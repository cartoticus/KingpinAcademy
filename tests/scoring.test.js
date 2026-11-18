const { scoreGame, legalNextRolls, gameIsOver } = require('./load-app');
let n = 0, failed = 0;
const assert = (c, m) => { n++; if (c) console.log(`  ok ${n} ${m}`); else { failed++; console.error(`  FAIL ${n} ${m}`); } };
const strikes = k => Array(k).fill(10);

const g300 = scoreGame(strikes(12));
assert(g300.total === 300, '12 strikes = 300');
assert(g300.frames[4].cumulative === 150, 'frame 5 cumulative = 150');
assert(g300.frames[9].rolls.length === 3, '10th frame holds 3 balls');
const gSp = scoreGame([].concat(...Array(10).fill([5,5]), [5]));
assert(gSp.total === 150, 'all 5-spares = 150');
assert(gSp.frames[0].cumulative === 15, 'frame 1 = 15');
assert(scoreGame(Array(20).fill(0)).total === 0, '20 gutters = 0');

const g167 = scoreGame([10,7,3,9,0,10,0,8,8,2,0,6,10,10,10,8,1]);
[20,39,48,66,74,84,90,120,148,167].forEach((v,i) => assert(g167.frames[i].cumulative === v, `167 game: frame ${i+1} = ${v}`));
assert(g167.total === 167 && g167.complete, '167 game complete');

const gP1 = scoreGame([10,5]);
assert(gP1.frames[0].cumulative === null, 'pending strike shows no cumulative');
assert(gP1.complete === false, 'partial game not complete');
const gP2 = scoreGame([5,5,3]);
assert(gP2.frames[0].cumulative === 13, 'spare resolves once bonus known');
assert(gP2.frames[1].cumulative === null, 'open second ball still pending');
assert(scoreGame([]).complete === false, 'empty game not complete');

const nine = Array(18).fill(1);
assert(scoreGame(nine.concat([3,4])).total === 25, '10th open frame');
assert(scoreGame(nine.concat([5,5,10])).total === 38, '10th spare + strike');
assert(scoreGame(nine.concat([10,10,10])).total === 48, '10th turkey');
assert(gameIsOver(nine.concat([3,4])) === true, 'open 10th ends after 2 balls');
assert(gameIsOver(nine.concat([10,10])) === false, 'strike in 10th needs a 3rd ball');
assert(scoreGame(strikes(11).concat([9])).total === 299, '11 strikes + 9 = 299');
assert(scoreGame([].concat(...Array(10).fill([9,1]), [9])).total === 190, 'all 9-spares = 190');
assert(JSON.stringify(legalNextRolls([7])) === '[0,1,2,3]', 'after a 7, only 0-3 legal');
assert(legalNextRolls(strikes(12)).length === 0, 'nothing legal after a finished game');

console.log(`\nscoring: ${n} checks, ${failed} failures`);
process.exit(failed ? 1 : 0);
