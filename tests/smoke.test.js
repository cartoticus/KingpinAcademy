const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
const errors = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously', pretendToBeVisual: true,
  beforeParse(win){
    // stub canvas 2D context
    const noop = () => {};
    win.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t,k) => (k in t ? t[k] : noop), set: (t,k,v) => (t[k]=v, true) });
    win.addEventListener('error', e => errors.push(e.message));
  }
});
const w = dom.window, d = w.document;
(async () => {
await new Promise(r => d.readyState === 'complete' ? r() : w.addEventListener('load', r));
let n=0, fail=0;
const ok = (c,m)=>{n++; if(c) console.log('  ok', m); else {fail++; console.log('  XX', m);} };
const click = el => el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));

const tabs = [...d.querySelectorAll('.tab-btn')].map(b=>b.dataset.tab);
console.log('tabs:', tabs.join(', '));
ok(!tabs.includes('coach') && !tabs.includes('cert'), 'no coach/cert tabs');
tabs.forEach(t => { click(d.querySelector(`[data-tab="${t}"]`)); ok(d.getElementById('panel-'+t).classList.contains('active'), `tab ${t} opens`); });

ok(d.querySelectorAll('.week').length === 12, '12 weeks rendered');
ok(d.querySelectorAll('.module').length === 8, '8 modules rendered');
ok(d.querySelector('.module-head').textContent.includes('M1'), 'module 1 present');
ok([...d.querySelectorAll('.module-head')].pop().textContent.includes('Mental Game'), 'M8 is Mental Game');

// grade M8 correctly
[1,2,2].forEach((a,qi)=>{ d.querySelector(`input[name="m7q${qi}"][value="${a}"]`).checked = true; });
click(d.querySelector('[data-grade="7"]'));
ok(d.getElementById('qres7').textContent.includes('mastered'), 'M8 quiz grades as mastered');

// simulator
d.getElementById('simBall').value = 'reactivePolished';
click(d.getElementById('simThrow'));
ok(/POCKET/.test(d.getElementById('simReadout').innerHTML), 'default throw hits pocket');

// score demo
click(d.getElementById('scoreDemo'));
ok(d.getElementById('scoreTotal').textContent === 'Final: 167', 'demo game scores 167');

// spare preset
click([...d.querySelectorAll('#sparePresets button')].find(b=>b.textContent==='10-pin'));
ok(/9 boards LEFT/.test(d.getElementById('spareAdvice').innerHTML), '10-pin advice: 9 left');

// practice tab
ok(d.querySelectorAll('#drillList .drill').length === 8, '8 student drills');
ok(!/[Cc]oach (watches|scores|confirms)/.test(d.getElementById('drillList').textContent), 'drills written for self-practice');
ok(d.querySelectorAll('#selfCheck input').length === 7, 'self-check renders');
ok(d.querySelectorAll('#routineCard li').length === 5, 'routine card shows 5 default steps');
const extra = d.querySelector('#routineOptions input[data-step="5"]'); extra.checked = true;
extra.dispatchEvent(new w.Event('change',{bubbles:true}));
ok(d.querySelectorAll('#routineCard li').length === 6, 'adding a step updates the routine card');

// path completion message
d.querySelectorAll('#weekList input').forEach(i=>i.checked=true);
d.getElementById('weekList').dispatchEvent(new w.Event('change',{bubbles:true}));
ok(d.getElementById('pathCount').textContent.includes('league-ready'), 'completion message is student-facing');

ok(errors.length === 0, 'no runtime errors' + (errors.length ? ': '+errors.join('; ') : ''));
console.log(`\nsmoke: ${n} checks, ${fail} failures`);
process.exit(fail?1:0);
})();
