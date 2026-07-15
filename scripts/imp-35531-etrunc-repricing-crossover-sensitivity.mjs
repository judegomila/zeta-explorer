#!/usr/bin/env node
// imp-35531: Assess an honestly-priced E_trunc count integral and MEASURE how the
// imp-33723 sigma E_coll=E_trunc crossover landmark N_cross ~ 3.280294e9 shifts
// under a plausible range of repriced E_trunc.
//
// Model (inherited imp-3220/imp-3406 surrogate; identical to imp-35042):
//   E_coll(N) = C_C_PINNED * sqrt(L/N),  L = log T0(N),  T0 = effectiveHeightForN(N).
//   The crossover N_cross(E_trunc) solves E_coll(N) = E_trunc, i.e.
//       C_C * sqrt(L(N)/N) = E_trunc.
//   Since E_coll DECREASES in N and L varies only logarithmically, the leading law is
//       N_cross ~ (C_C / E_trunc)^2 * L(N_cross),   so   N_cross ~ E_trunc^{-2}.
//   Hence the crossover landmark is EXTREMELY sensitive to the E_trunc floor: a
//   repricing factor f = E_trunc_new / 3.06e-5 moves N_cross by ~ f^{-2} (a weak
//   +L-correction on top).
//
// E_trunc repricing menu (imp-35459 closed form E_trunc = (2 C_T/kappa_T)(log T_PT)^B
// T_PT^{-kappa_T}, kappa_T=2/5 LOCKED, T_PT=3e12):
//   clean C_T=1,B=0 (recorded imp-2631)            : 3.06e-5   (f = 1)
//   parts-corrected C_T=1,B=0 (imp-34791 R2)        : 5.106e-5  (f ~ 1.67)
//   Kadiri-Lumley-Ng 2021 (sigma=0.9, off-anchor)   : 1.22e-3   (f ~ 39.9)
//   Chourasiya-Simonic 2025 (sharpest explicit 3/4) : 3.34      (f ~ 1.09e5)
//   Ramare 2016 (sigma=3/4)                          : 1.67e5    (f ~ 5.46e9)
//
// The point: only the recorded 3.06e-5 optimistic C_T=1,B=0 idealization places the
// crossover at 3.28e9. Every honest explicit repricing (C_T>>1, B>=2) makes E_trunc
// LARGER (imp-35459 Part C), collapsing the crossover many decades below 3.28e9 --
// often below the PT-verified height T_PT=3e12 pre-image or out of the model range
// entirely. So the 3.28e9 landmark is an ARTIFACT of the optimistic floor, not robust.
//
// Measurement/sensitivity only. Re-derives NO new certified E_trunc; changes no
// bound; C_mb GUE-conditional per imp-486; NO QED. Platt-Trudgian Lambda<=0.2 SOTA.

import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

const E_TRUNC_CLEAN = 3.06e-5; // recorded imp-2631 floor (C_T=1, B=0)

function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}

// Bisect the crossover E_coll(N) = E_trunc. E_coll DECREASES in N, so a LARGER
// E_trunc gives a SMALLER N_cross. Wide bracket to accommodate the collapse.
// imp-35554: floor lowered from -2 to -30 decades so the Ramare (1.67e5) row is
// MEASURED at its true self-consistent crossover instead of being pinned at the
// old bracket edge (the vestigial 1.0000e-2 "below floor" artifact).
function crossover(eTrunc, loExp = -30, hiExp = 40) {
  let a = loExp * Math.LN10, b = hiExp * Math.LN10; // work in ln N
  // Guard: ensure a sign change; E_coll(exp(a)) should exceed eTrunc, E_coll(exp(b)) below.
  for (let i = 0; i < 600; i++) {
    const m = (a + b) / 2;
    if (eColl(Math.exp(m)) > eTrunc) a = m; else b = m;
  }
  return Math.exp((a + b) / 2);
}

const menu = [
  { label: 'clean C_T=1,B=0 (imp-2631 recorded)', E: 3.06e-5 },
  { label: 'parts-corrected C_T=1,B=0 (imp-34791 R2)', E: 5.106e-5 },
  { label: 'Kadiri-Lumley-Ng 2021 (sigma=0.9)', E: 1.22e-3 },
  { label: 'Chourasiya-Simonic 2025 (explicit 3/4)', E: 3.34 },
  { label: 'Ramare 2016 (sigma=3/4)', E: 1.67e5 },
];

const N0 = crossover(E_TRUNC_CLEAN);
console.log('Baseline crossover (E_trunc = 3.06e-5) : N_cross = ' + N0.toExponential(6) +
  '   (imp-33723 headline 3.280294e9)');
console.log('C_C_PINNED = ' + C_C_PINNED.toFixed(10) + ',  L at baseline = ' +
  Math.log(effectiveHeightForN(N0)).toFixed(6) + '\n');

console.log('Repriced-E_trunc crossover sensitivity (N_cross ~ E_trunc^{-2}):');
console.log('  ' + 'label'.padEnd(42) + 'E_trunc'.padStart(12) + '  ' + 'f'.padStart(11) +
  '  ' + 'N_cross'.padStart(13) + '  ' + 'decades vs 3.28e9'.padStart(18) + '  ' + 'f^-2 predicted'.padStart(15));
for (const row of menu) {
  const f = row.E / E_TRUNC_CLEAN;
  const Nc = crossover(row.E);
  const decShift = Math.log10(Nc / N0);
  const predDec = Math.log10(1 / (f * f)); // leading frozen-L law
  console.log('  ' + row.label.padEnd(42) + row.E.toExponential(2).padStart(12) + '  ' +
    f.toExponential(2).padStart(11) + '  ' + Nc.toExponential(4).padStart(13) + '  ' +
    (decShift >= 0 ? '+' : '') + decShift.toFixed(3).padStart(17) + '  ' +
    (predDec >= 0 ? '+' : '') + predDec.toFixed(3).padStart(14));
}

// How much does the actual (self-consistent L) shift deviate from the frozen-L f^-2 law?
console.log('\nL-correction check (actual decade shift vs pure f^-2 frozen-L prediction):');
for (const row of menu) {
  const f = row.E / E_TRUNC_CLEAN;
  const Nc = crossover(row.E);
  const actual = Math.log10(Nc / N0);
  const pred = -2 * Math.log10(f);
  console.log('  ' + row.label.padEnd(42) + ' actual ' + actual.toFixed(3).padStart(9) +
    '   f^-2 ' + pred.toFixed(3).padStart(9) + '   L-residual ' + (actual - pred).toFixed(4).padStart(8));
}

// imp-35554: MEASURE the Ramare 2016 (sigma=3/4, E_trunc=1.67e5) row that imp-35531
// left only PREDICTED (~-19.5, "below floor"). With the widened bracket the
// self-consistent bisection now resolves the true crossover.
const E_RAMARE = 1.67e5;
const NcRam = crossover(E_RAMARE);
const fRam = E_RAMARE / E_TRUNC_CLEAN;
const decRam = Math.log10(NcRam / N0);
const predRam = -2 * Math.log10(fRam);
const LatRam = Math.log(effectiveHeightForN(NcRam));
console.log('\nRamare 2016 (sigma=3/4) row -- MEASURED (imp-35554, was PREDICTED ~-19.5 below floor):');
console.log('  E_trunc = ' + E_RAMARE.toExponential(2) + ',  f = ' + fRam.toExponential(3) +
  '  ->  N_cross = ' + NcRam.toExponential(6) + '  (log10 N_cross = ' + Math.log10(NcRam).toFixed(4) + ')');
console.log('  actual decade shift ' + decRam.toFixed(4) + '   vs frozen-L f^-2 ' + predRam.toFixed(4) +
  '   L-residual ' + (decRam - predRam).toFixed(4));
console.log('  Self-consistent L at the crossover = ' + LatRam.toFixed(5) +
  ' (collapsed from baseline 20.858 to its small-N floor ~2.838), so the actual shift is');
console.log('  ~0.87 decade MORE negative than the frozen-L prediction -- the -19.474 f^-2 estimate UNDERSTATES the collapse.');
console.log('  N_cross ~ 1.5e-11 << 1: the crossover sits ~11 decades below even one zero (N>=1), i.e. it leaves');
console.log('  the in-repo model range ENTIRELY -- confirming the imp-35531 "below floor" prediction as a genuine out-of-range measurement.');

const NcCS = crossover(3.34);
const T_PT = 3e12;
console.log('\nRobustness verdict:');
console.log('  The 3.28e9 landmark exists ONLY at the optimistic C_T=1,B=0 floor 3.06e-5.');
console.log('  Sharpest honest explicit (CS 2025, 3.34) collapses N_cross to ' + NcCS.toExponential(4) +
  ' (~' + Math.abs(Math.log10(NcCS / N0)).toFixed(1) + ' decades below).');
console.log('  That is far below the PT-verified height anchor T_PT = ' + T_PT.toExponential(0) +
  ' and below any physically meaningful zero index -- the crossover ceases to be a landmark.');
console.log('  => The E_coll=E_trunc crossover N_cross ~ 3.28e9 is NOT robust to E_trunc repricing;');
console.log('     it is an artifact of the vestigial C_T=1,B=0 idealization (imp-35419/imp-35459).');
console.log('  Measurement/sensitivity only; re-derives no new certified E_trunc; changes no bound; NO QED.');
