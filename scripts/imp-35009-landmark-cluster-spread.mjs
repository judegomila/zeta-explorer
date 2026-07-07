#!/usr/bin/env node
// imp-35009: Tabulate the four-landmark cluster near N~3.3e9 and measure the
// pairwise relative spreads, to assess whether the tight co-location is a
// structural consequence of the E_coll=E_trunc crossover geometry or a
// numerical coincidence.
//
// Landmarks (all inherited from the imp-3220/imp-3406 surrogate component model):
//   N_cross = 3.280294e9  imp-33723 Banach fixed point (E_coll=E_trunc crossover, closed form)
//   N_half  = 3.27e9      imp-33582 sigma=1/2 halving point
//   N_star  = 3.38e9      imp-33721 sigmoid inflection knee
//   seed band [3.11e9,3.45e9]  imp-34693 admissible seed band
//
// Measurement only. Changes no bound. C_mb GUE-conditional per imp-486. NO QED.

const N_cross = 3.280294e9;
const N_half = 3.27e9;
const N_star = 3.38e9;
const band = [3.11e9, 3.45e9];
const bandMid = (band[0] + band[1]) / 2;

const pts = { N_cross, N_half, N_star, N_seedmid: bandMid };
const keys = Object.keys(pts);

console.log('Point landmarks:');
for (const k of keys) console.log('  ' + k.padEnd(11) + ' = ' + pts[k].toExponential(6));
console.log(
  '\nSeed band = [' + band[0].toExponential(3) + ', ' + band[1].toExponential(3) +
  '], mid = ' + bandMid.toExponential(6) +
  ', halfwidth = ' + ((band[1] - band[0]) / 2 / bandMid * 100).toFixed(2) + '% of mid'
);

console.log('\nPairwise relative spreads |a-b| / mean(a,b):');
let maxSpread = 0;
let maxPair = '';
for (let i = 0; i < keys.length; i++) {
  for (let j = i + 1; j < keys.length; j++) {
    const a = pts[keys[i]];
    const b = pts[keys[j]];
    const s = Math.abs(a - b) / ((a + b) / 2);
    if (s > maxSpread) { maxSpread = s; maxPair = keys[i] + '/' + keys[j]; }
    console.log('  ' + (keys[i] + ' / ' + keys[j]).padEnd(26) + ' : ' + (s * 100).toFixed(3) + '%');
  }
}
console.log('\nMax pairwise spread = ' + (maxSpread * 100).toFixed(3) + '% (' + maxPair + ')');

const vals = keys.map((k) => pts[k]);
const lo = Math.min(...vals);
const hi = Math.max(...vals);
console.log(
  'Full envelope of the 4 point landmarks: [' + lo.toExponential(6) + ', ' + hi.toExponential(6) +
  '], total range = ' + ((hi - lo) / ((hi + lo) / 2) * 100).toFixed(3) + '% of mean'
);
console.log('Seed band contains all three point landmarks: ' + (band[0] <= lo && hi <= band[1]));

// Verdict: all six pairwise spreads land under 4% (max 3.308%, the N_half..N_star
// endpoints of the cluster); N_cross and the seed-band midpoint coincide to 0.009%;
// and the imp-34693 seed band brackets all three point landmarks. The co-location is
// consistent with -- but this measurement does NOT prove -- the shared E_coll=E_trunc
// crossover geometry underlying each landmark. Measurement only; NO QED.
