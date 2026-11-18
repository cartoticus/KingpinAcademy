const { computePath } = require('./load-app');
let n = 0, failed = 0;
const assert = (c, m) => { n++; if (c) console.log(`  ok ${n} ${m}`); else { failed++; console.error(`  FAIL ${n} ${m}`); } };

const house = computePath('house', 11, 16, 300);
assert(house.entryBoard >= 16 && house.entryBoard <= 19, `default line hits the pocket (board ${house.entryBoard})`);
assert(house.breakY >= 36 && house.breakY <= 50, `breakpoint depth realistic (${house.breakY} ft)`);
assert(house.breakBoard >= 5 && house.breakBoard <= 11, `breakpoint board realistic (${house.breakBoard})`);
assert(house.entryAngleDeg > 2 && house.entryAngleDeg < 8, `entry angle plausible (${house.entryAngleDeg} deg)`);
const burned = computePath('burned', 11, 16, 300);
assert(burned.entryBoard > house.entryBoard, 'burned lane hooks earlier');
assert(burned.breakBoard > house.breakBoard, 'burned breakpoint stays inside');
assert(computePath('shortSport', 11, 16, 300).entryBoard > computePath('longSport', 11, 16, 300).entryBoard, 'short pattern hooks more than long');
assert(computePath('house', 11, 20, 300).entryBoard < house.entryBoard, 'more speed = less hook');
assert(computePath('house', 11, 12, 300).entryBoard > house.entryBoard, 'less speed = more hook');
assert(computePath('house', 11, 16, 500).entryBoard > house.entryBoard, 'more revs = more hook');
assert(computePath('shortSport', 5, 12, 500).points.every(p => p.x >= 1 && p.x <= 39), 'ball stays on the lane');

const [pl, ur, po, du] = ['plastic','urethane','reactivePolished','reactiveDull'].map(b => computePath('house', 11, 16, 300, b));
assert(po.entryBoard === house.entryBoard, 'default ball is polished reactive');
assert(pl.entryBoard < ur.entryBoard && ur.entryBoard < po.entryBoard && po.entryBoard < du.entryBoard, 'hook order: plastic < urethane < polished < dull');
assert(Math.abs(pl.entryBoard - 11) < 4, 'plastic stays nearly straight');
assert(du.breakY < po.breakY, 'dull cover reads the lane earlier');
assert(computePath('burned', 11, 16, 300, 'plastic').entryBoard < 14, 'plastic goes straight on a burned lane');
assert(computePath('burned', 11, 16, 300, 'reactiveDull').entryBoard > 20, 'dull reactive hooks hard on a burned lane');

console.log(`\nphysics: ${n} checks, ${failed} failures`);
process.exit(failed ? 1 : 0);
