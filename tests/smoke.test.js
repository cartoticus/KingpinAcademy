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
    win.scrollTo = () => {};
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
ok(!tabs.includes('sim') && !tabs.includes('spare'), 'no simulator or spare lab tabs');
ok(!d.getElementById('laneCanvas') && !d.getElementById('pinRack'), 'simulator and spare lab removed from the page');
ok(!/imulator|Spare Lab/.test(d.body.textContent), 'no leftover simulator or spare lab text');
tabs.forEach(t => { click(d.querySelector(`[data-tab="${t}"]`)); ok(d.getElementById('panel-'+t).classList.contains('active'), `tab ${t} opens`); });

ok(d.querySelectorAll('.level').length === 4, '4 roadmap levels rendered');
ok(d.querySelectorAll('#roadmap .week').length === 13, '13 roadmap steps rendered');
ok(!/week/i.test(d.getElementById('panel-path').textContent), 'no week-based wording on The Path');
ok(d.querySelector('#roadmap .week').classList.contains('next'), 'step 1 is marked Up next');
const first = d.querySelector('#roadmap input'); first.checked = true;
first.dispatchEvent(new w.Event('change',{bubbles:true}));
ok(d.querySelectorAll('#roadmap .week')[1].classList.contains('next'), 'checking step 1 moves Up next to step 2');
ok(d.querySelector('.level-count[data-level="0"]').textContent === '1 of 3', 'level progress shows 1 of 3');
click(d.querySelector('#roadmap .tool-link[data-module="4"]'));
const links = [...d.querySelectorAll('#roadmap .tool-link')].map(b => b.dataset.goto);
ok(links.every(t => tabs.includes(t)), 'every roadmap link points to a tab that exists');
ok(d.getElementById('panel-study').classList.contains('active') && d.querySelectorAll('#moduleList .module')[4].classList.contains('open'), 'step link opens Study Hall at the right module');
click(d.querySelector('[data-tab="path"]'));
ok(d.querySelectorAll('.module').length === 8, '8 modules rendered');
ok(d.querySelector('.module-head').textContent.includes('M1'), 'module 1 present');
ok([...d.querySelectorAll('.module-head')].pop().textContent.includes('Mental Game'), 'M8 is Mental Game');

// grade M8 correctly
[1,2,2].forEach((a,qi)=>{ d.querySelector(`input[name="m7q${qi}"][value="${a}"]`).checked = true; });
click(d.querySelector('[data-grade="7"]'));
ok(d.getElementById('qres7').textContent.includes('mastered'), 'M8 quiz grades as mastered');

// score demo
click(d.getElementById('scoreDemo'));
ok(d.getElementById('scoreTotal').textContent === 'Final: 167', 'demo game scores 167');

// basics cheat sheet
ok(tabs[1] === 'basics', 'Basics tab sits right after The Path');
const basics = d.getElementById('panel-basics');
ok(basics.querySelectorAll('.rack-svg circle').length === 10, 'pin diagram shows 10 pins');
ok([...basics.querySelectorAll('.rack-svg text')].filter(t=>/^\d+$/.test(t.textContent)).map(t=>+t.textContent).sort((a,b)=>a-b).join(',') === '1,2,3,4,5,6,7,8,9,10', 'pins numbered 1-10');
['Headpin','Kingpin','Strike','Spare','Split','Turkey','Yield to the right','Foul line'].forEach(t => ok(basics.textContent.includes(t), `cheat sheet covers: ${t}`));
click(d.querySelector('#roadmap .tool-link[data-goto="basics"]'));
ok(basics.classList.contains('active'), 'roadmap link opens Basics');

// practice tab
ok(d.querySelectorAll('#drillList .drill').length === 8, '8 student drills');
ok(!/[Cc]oach (watches|scores|confirms)/.test(d.getElementById('drillList').textContent), 'drills written for self-practice');
ok(d.querySelectorAll('#selfCheck input').length === 7, 'self-check renders');
ok(d.querySelectorAll('#routineCard li').length === 5, 'routine card shows 5 default steps');
const extra = d.querySelector('#routineOptions input[data-step="5"]'); extra.checked = true;
extra.dispatchEvent(new w.Event('change',{bubbles:true}));
ok(d.querySelectorAll('#routineCard li').length === 6, 'adding a step updates the routine card');

// path completion message
d.querySelectorAll('#roadmap input').forEach(i=>i.checked=true);
d.getElementById('roadmap').dispatchEvent(new w.Event('change',{bubbles:true}));
ok(d.getElementById('pathCount').textContent.includes('know how to bowl'), 'completion message is student-facing');
ok(d.querySelector('.level-count[data-level="3"]').textContent === 'Level complete', 'level marked complete');

ok(errors.length === 0, 'no runtime errors' + (errors.length ? ': '+errors.join('; ') : ''));
console.log(`\nsmoke: ${n} checks, ${fail} failures`);
process.exit(fail?1:0);
})();
