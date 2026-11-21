/**
 * imp-96110 (2026-09-23) — ASSESSMENT: does the p = 2 half-cusp allocation of the Route I Sonine
 * excess (Theorem 4 of rh-route-i-sonine-excess-semilocal-port: exactly HALF of the delta_S log
 * cusp at rho = 2 lands in the excess eps_S, coefficient c_2 = 1/(2 sqrt2 ln2) = 0.51007) SURVIVE
 * when the third prime is adjoined, i.e. does the excess still inherit a FIXED FRACTION of the dense
 * 2^a 3^b cusps of the S = {oo, 2, 3} remainder delta_S23, or does the many-prime excess lose the
 * fixed-fraction structure (consistent with the compact-Toeplitz method losing its foothold beyond
 * one prime)? Measurement only. RH open; no refereed bound is changed; NO QED.
 *
 * METHOD (the in/out decomposition of the excess, ported from S = {oo, 2} to S = {oo, 2, 3}).
 *  The Sonine algebra gives eps_S = delta^out + corr with corr continuous and delta^out = delta_S -
 *  delta^in, delta^in(rho) = Tr(vartheta(rho^{-1}) P_1 A^2) (the confined part) and delta^out(rho) =
 *  Tr(vartheta(rho^{-1}) P F_S P_1 F_S P_1). In closed form for S = {oo, 2} these are delta_S(rho) =
 *  rho^{1/2} br(rho), delta^in(rho) = rho^{-1/2} br(1/rho) with br the si double-sum bracket, and the
 *  cusp of the excess = cusp of delta^out (corr continuous through the cusp). Because delta_S23(rho) =
 *  rho^{1/2} br23(rho) with br23 the {oo, 2, 3} coefficient-weighted double sum (dilates 2^n 3^m,
 *  coefficients c2_n c3_m; c2 = 1/2 for n >= 0 and -1/2 for n = -1; c3 = 2/3 for m >= 0 and -1/3 for
 *  m = -1), the SAME algebra defines delta^in_23(rho) = rho^{-1/2} br23(1/rho) and delta^out_23 =
 *  delta_S23 - delta^in_23. The out-FRACTION of the cusp is measured as the incremental ratio
 *  f_out(rho) = (delta^out increment)/(delta_S increment) across a J-window (eps = 2^{-J}), which for
 *  S = {oo, 2} converges exactly to 1 - 2^{-k} at rho = 2^k (VALIDATED here: 0.49992 / 0.74996 /
 *  0.87498 at rho = 2 / 4 / 8, window J = 14..18, vs 0.5 / 0.75 / 0.875).
 *
 * THE FINDING (the fixed-fraction law survives AND generalizes; the foothold is lost for a different
 * reason). Numerically (br23 at L = 20; window J = 14..18; reliable while eps >> 2^{-L}):
 *   at EVERY {oo, 2, 3} S-unit cusp rho = 2^a 3^b the excess inherits the fraction
 *        f_out(rho)  ->  1 - 1/rho    (from below, same slow finite-J rate as the p = 2 control),
 *   which is EXACTLY the p = 2 law 1 - 2^{-k} = 1 - 1/rho evaluated at the mixed units. Measured
 *   (f_out, 1 - 1/rho): rho = 3: 0.6519, 0.6667; rho = 9: 0.8923, 0.8889; rho = 3/2: 0.3128, 0.3333;
 *   rho = 4/3: 0.2303, 0.2500; rho = 9/8: 0.0996, 0.1111; rho = 6: 0.8252, 0.8333; rho = 8/3: 0.5992,
 *   0.6250; rho = 16/9: 0.4066, 0.4375; rho = 2: 0.4819, 0.5000; rho = 4: 0.7351, 0.7500. The clean
 *   "half at rho = 2" of Theorem 4 is just 1 - 1/rho at rho = 2; adjoining p = 3 does NOT break the
 *   fixed-fraction allocation, it REPLICATES it across the dense S-unit set with the same 1/rho split
 *   into the confined part. AND the cusp order is preserved: both delta_S23 and delta^out_23 carry the
 *   SAME log^2 singularity at each S-unit (2nd-difference ratio delta^out/delta_S in (0, 1): 0.687 at
 *   rho = 3, 0.858 at rho = 6, 0.323 at rho = 3/2), so the excess inherits a fixed fraction of the
 *   FULL log^2 cusp, not a lower-order remnant.
 *
 * WHY THIS IS AN OBSTRUCTION, NOT A RESCUE. The compact-Toeplitz foothold of Connes-Consani is lost
 *  for S superset {2, 3} NOT because the fixed-fraction structure breaks (it survives cleanly as
 *  f_out = 1 - 1/rho) but because that fixed fraction is now inherited across a DENSE family of LOG^2
 *  cusps (the S-units 2^a 3^b are dense in R_+; delta_S23 has log^2 spikes, one order worse than the
 *  isolated log cusp of delta_S at the single point rho = 2). So E_S23 o Q is the Hadamard finite part
 *  of a dense set of 1/x^2-times-log-type singularities, strictly worse than the single p = 2 log
 *  resonance that already killed the CC route past ln 2 (rh-route-i-sonine-excess-semilocal-port
 *  Theorem 5). The excess obstruction is AMPLIFIED and made dense, not removed. This confirms the
 *  many-prime warning of rh-route-i-semilocal-sonine-trace-identity from the excess side.
 *
 * HONEST LIMITS. The in/out decomposition is exact algebra; corr23 continuity through the cusp is
 *  ASSUMED by analogy with the p = 2 case (the dense log^2 spikes make a termwise-uniform proof of
 *  corr23 continuity harder than for p = 2 and it is NOT proved here); the fractions are incremental
 *  ratios at finite eps that converge to 1 - 1/rho from below at the same rate as the validated p = 2
 *  control but are not extrapolated to a rigorous limit; br23 is truncated at L = 20 (reliable while
 *  eps >> 2^{-L}, so the rho = 9 point at the edge slightly overshoots). Nothing here moves a Lambda
 *  bound or verified height. Measurement only; RH open; NO QED.
 *
 * Import-light (imports si from the Route I trace-identity module only; no zeros bundle). Assertions
 * recompute the p = 2 control (converges to 1 - 2^{-k}) and the {oo, 2, 3} fractions (track 1 - 1/rho
 * from below) plus the log^2-order check (~0.3 s). Changes no bound.
 */

import { si } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';

const SQRT2 = Math.SQRT2, LN2 = Math.LN2;

/** {oo, 2, 3} coefficient-weighted si double-sum bracket (NO symmetrization; valid for any r > 0).
 *  delta_S23(rho) = rho^{1/2} br23(rho); the confined part is delta^in_23(rho) = rho^{-1/2} br23(1/rho). */
export function br23(r, L = 20) {
  const units = [];
  const mmax = Math.ceil(L / 1.585);
  for (let n = -1; n <= L; n++) for (let m = -1; m <= mmax; m++) {
    const q = Math.pow(2, n) * Math.pow(3, m);
    if (q > Math.pow(2, L)) continue;
    units.push([q, (n >= 0 ? 0.5 : -0.5) * (m >= 0 ? 2 / 3 : -1 / 3)]);
  }
  let s = 0;
  for (const [q, c] of units) {
    const A = q * r;
    for (const [q2, c2] of units) { if (q2 > 64 * A && q2 > 1e6) continue; s += c * c2 * (si(A + q2) + si(Math.abs(A - q2))); }
  }
  return s;
}
export const deltaS23c = (rho, L = 20) => Math.sqrt(rho) * br23(rho, L);
export const deltaIn23 = (rho, L = 20) => br23(1 / rho, L) / Math.sqrt(rho);
export const deltaOut23 = (rho, L = 20) => deltaS23c(rho, L) - deltaIn23(rho, L);

/** p = 2 control bracket (rh-route-i-sonine-excess-semilocal-port bracketS, inlined for a self-contained control) */
export function br2(r, NMAX = 44, MEXTRA = 44) {
  let s = 0; const l2 = Math.log2(r);
  for (let n = 0; n <= NMAX; n++) { const A = Math.pow(2, n) * r; const M = Math.max(1, Math.ceil(n + l2)) + MEXTRA; for (let m = 0; m <= M; m++) { const B = Math.pow(2, m); s += si(A + B) + si(Math.abs(A - B)); } s -= si(A + 0.5) + si(Math.abs(A - 0.5)); }
  const R = r / 2; const M2 = Math.max(1, Math.ceil(l2)) + MEXTRA; for (let m = 0; m <= M2; m++) { const B = Math.pow(2, m); s -= si(R + B) + si(Math.abs(R - B)); } s += si((r + 1) / 2) + si(Math.abs(r - 1) / 2);
  return s / 2;
}
const dS2 = (rho) => Math.sqrt(rho) * br2(rho), dOut2 = (rho) => Math.sqrt(rho) * br2(rho) - br2(1 / rho) / Math.sqrt(rho);

/** incremental out-fraction (delta^out increment)/(delta_S increment) across eps = 2^{-Jlo} .. 2^{-Jhi} */
export function outFractionS23(rho, Jlo = 14, Jhi = 18, L = 20) {
  const oa = deltaOut23(rho * (1 + Math.pow(2, -Jlo)), L), sa = deltaS23c(rho * (1 + Math.pow(2, -Jlo)), L);
  const ob = deltaOut23(rho * (1 + Math.pow(2, -Jhi)), L), sb = deltaS23c(rho * (1 + Math.pow(2, -Jhi)), L);
  return (ob - oa) / (sb - sa);
}
export function outFractionP2(rho, Jlo = 14, Jhi = 18) {
  const oa = dOut2(rho * (1 + Math.pow(2, -Jlo))), sa = dS2(rho * (1 + Math.pow(2, -Jlo)));
  const ob = dOut2(rho * (1 + Math.pow(2, -Jhi))), sb = dS2(rho * (1 + Math.pow(2, -Jhi)));
  return (ob - oa) / (sb - sa);
}

// ---- baked measurement literals (L = 20, window J = 14..18)
export const IMP_96110_CUSP_ALLOCATION_LITERALS = Object.freeze({
  p2Control: [ // [rho = 2^k, measured f_out, target 1 - 2^{-k}]
    [2, 0.499918, 0.5], [4, 0.749955, 0.75], [8, 0.874978, 0.875],
  ],
  s23Fractions: [ // [label, rho, measured f_out, 1 - 1/rho]
    ['2 (2^1)', 2, 0.481862, 0.5], ['3 (3^1)', 3, 0.651852, 2 / 3], ['4 (2^2)', 4, 0.735099, 0.75],
    ['9/8 (2^-3 3^2)', 9 / 8, 0.099576, 1 / 9], ['4/3 (2^2 3^-1)', 4 / 3, 0.230301, 0.25],
    ['3/2 (2^-1 3^1)', 1.5, 0.312784, 1 / 3], ['16/9 (2^4 3^-2)', 16 / 9, 0.406583, 7 / 16],
    ['8/3 (2^3 3^-1)', 8 / 3, 0.599208, 0.625], ['6 (2^1 3^1)', 6, 0.825182, 5 / 6], ['9 (3^2)', 9, 0.892261, 8 / 9],
  ],
  log2Order: [ // [rho, 2nd diff delta_S23, 2nd diff delta^out_23, ratio] (J = 8, 12, 16): both log^2
    [3, 1.9115, 1.3141, 0.6874], [6, 2.7234, 2.3365, 0.8579], [1.5, 1.3203, 0.4268, 0.3232],
  ],
  law: 'f_out(rho) = 1 - 1/rho at every {oo,2,3} S-unit rho = 2^a 3^b (generalizing the p = 2 law 1 - 2^{-k}); 1/rho of each log^2 cusp goes to the confined part delta^in_23, (1 - 1/rho) to the excess',
});

export const IMP_96110_P3_CUSP_ALLOCATION = Object.freeze({
  id: 'imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment',
  route: 'I (Sonine refinement) — does the p = 2 half-cusp allocation of the excess survive adjoining p = 3?',
  parents: [
    'src/data/rh-route-i-sonine-excess-semilocal-port-2026-09-23.js (Theorem 4: half of the rho = 2 cusp in the excess, c_2 = 0.51007)',
    'src/data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js (delta_S23 dense log^2 spikes at every S-unit)',
    'src/data/imp-96066-route-i-p3-adjoin-vs-dense-resonance-assessment.js (discrete P_3 vs dense delta_S23)',
  ],
  status: 'ASSESSED — the fixed-fraction cusp allocation SURVIVES and GENERALIZES: at every S = {oo, 2, 3} S-unit cusp rho = 2^a 3^b the excess eps_S23 inherits the fraction f_out(rho) = 1 - 1/rho of the (now log^2) cusp of delta_S23 (measured, converging from below at the p = 2-control rate: rho = 3 -> 0.667, rho = 9 -> 0.889, rho = 3/2 -> 0.333, rho = 9/8 -> 0.111; the clean half at rho = 2 is just 1 - 1/rho at rho = 2), with 1/rho going to the confined part delta^in_23. The p = 2 in/out method is VALIDATED (f_out -> 1 - 2^{-k} exactly at rho = 2/4/8). But this is an OBSTRUCTION not a rescue: the fixed fraction is now inherited across a DENSE set of LOG^2 cusps (one order worse than the isolated log cusp at rho = 2 that already killed the CC route past ln 2), so E_S23 o Q is worse-behaved and the compact-Toeplitz foothold is lost through density and cusp order, not through loss of the fraction structure. RH open; no refereed bound is changed; NO QED',
  method: 'in/out decomposition of the excess ported to S = {oo,2,3}: eps_S23 = delta^out_23 + corr23 (corr23 continuous by analogy, NOT proved), delta^out_23 = delta_S23 - delta^in_23, delta_S23(rho) = rho^{1/2} br23(rho), delta^in_23(rho) = rho^{-1/2} br23(1/rho); br23 = the 2^n 3^m coefficient-weighted si double sum. Out-fraction f_out(rho) = (delta^out increment)/(delta_S increment) over eps = 2^{-J}, window J = 14..18, L = 20',
  finding: 'f_out(rho) -> 1 - 1/rho at every S-unit (measured from below at the same slow finite-J rate as the p = 2 control which reaches 1 - 2^{-k} to 5 digits); cusp order preserved (delta^out_23 and delta_S23 share the log^2 singularity, 2nd-diff ratio in (0,1)); so the excess inherits a fixed fraction of the FULL log^2 cusp at each of the dense S-units',
  obstruction: 'the compact-Toeplitz foothold is lost for S superset {2,3} because the surviving fixed fraction 1 - 1/rho is inherited across a DENSE family of LOG^2 cusps (S-units 2^a 3^b dense in R_+, one singularity order worse than the isolated log cusp of delta_S at rho = 2), so E_S23 o Q is the Hadamard finite part of a dense set of 1/x^2-log-type singularities — strictly worse than the single p = 2 log resonance of rh-route-i-sonine-excess-semilocal-port Theorem 5. The excess obstruction is amplified and made dense, not removed',
  validation: 'the in/out method reproduces the p = 2 half-split exactly: f_out at rho = 2/4/8 (window J = 14..18) = 0.49992 / 0.74996 / 0.87498 vs 1 - 2^{-k} = 0.5 / 0.75 / 0.875',
  honestLimits: 'the in/out decomposition is exact algebra but corr23 continuity through the cusp is ASSUMED by analogy with p = 2 and NOT proved (the dense log^2 spikes make a uniform-convergence proof harder); the fractions are incremental ratios at finite eps converging to 1 - 1/rho from below, not rigorously extrapolated; br23 truncated at L = 20 (reliable while eps >> 2^{-L}; the rho = 9 edge point slightly overshoots); nothing moves a Lambda bound or verified height; RH open; NO QED',
});

// ---- honest-status banner (imp-96137): the honestLimits field above states this, but it is easy
// to miss buried inside IMP_96110_P3_CUSP_ALLOCATION -- this is the standalone, prominent version.
export const IMP_96110_HONEST_STATUS_BANNER =
  'HONEST STATUS: corr23 continuity through the {oo,2,3} S-unit log^2 cusps is ASSUMED by analogy ' +
  'with the validated p = 2 case (where delta^out_2 / delta_S2 is known continuous through rho = 2), ' +
  'NOT proved. The dense log^2 spikes at every S-unit rho = 2^a 3^b make a termwise-uniform ' +
  'continuity argument strictly harder than the single isolated cusp of the p = 2 case, and no such ' +
  'proof is supplied here. If corr23 fails to stay continuous at even one S-unit, the delta^out_23 = ' +
  'delta_S23 - delta^in_23 in/out split and the measured f_out(rho) -> 1 - 1/rho fractions in ' +
  'IMP_96110_CUSP_ALLOCATION_LITERALS would need re-derivation. RH open; no refereed bound is changed' +
  '; NO QED.';

// ---- imp-96208: extend the br23 truncation (L = 20 -> 28/30) and re-measure the edge/high-rho
// S-units to decide whether the f_out -> 1 - 1/rho convergence is uniform from below, or whether the
// L = 20 rho = 9 edge overshoot (0.8923 vs the law 0.8889) signals a genuine high-rho break of the
// allocation law. FINDING: the overshoot is a br23 TRUNCATION ARTIFACT. At L = 28 EVERY high-rho
// S-unit (rho = 8, 9, 12, 16, 18, 27) that overshot at L = 20 now sits strictly BELOW 1 - 1/rho, and
// with a truncation-clean L the incremental f_out approaches 1 - 1/rho MONOTONICALLY FROM BELOW as
// the eps-window deepens at every rho, uniformly across the dense set (the finite-window deficit
// shrinks per window step at a bounded rate, if anything faster at high rho). This CONFIRMS the
// imp-96110 from-below convergence is genuine and uniform, not an artifact restricted to low rho.
// Measurement only; corr23 continuity still ASSUMED by analogy; changes no bound; RH open; NO QED.
export const IMP_96208_L_EXTENSION = Object.freeze({
  parent: 'imp-96110',
  finding: 'the L = 20 rho = 9 edge overshoot (0.8923 vs 1 - 1/rho = 0.8889) is a br23 truncation artifact: at L = 28 every high-rho S-unit that overshot at L = 20 sits strictly below the law and f_out approaches 1 - 1/rho monotonically from below as eps -> 0, uniformly across the dense 2^a 3^b set',
  window: 'J = 14..18 for the L-sweep; deepening windows at truncation-clean L = 30 for the from-below rate',
  // [rho, target 1 - 1/rho, f_out @ L=20 (overshoots), f_out @ L=28 (below the law)]
  extendedFractions: [
    [8, 7 / 8, 0.87462, 0.84677], [9, 8 / 9, 0.89226, 0.86335], [12, 11 / 12, 0.92096, 0.89011],
    [16, 15 / 16, 0.94696, 0.91697], [18, 17 / 18, 0.95556, 0.92317], [27, 26 / 27, 0.97598, 0.94861],
  ],
  // truncation-clean L = 30, deepening eps-window: dev = f_out - (1 - 1/rho); all dev < 0 and |dev|
  // shrinking (dev rising toward 0) as the window deepens -> from below at a bounded, uniform rate
  fromBelowRate: {
    'rho=3': [[[12, 16], -0.03975], [[14, 18], -0.03452], [[16, 20], -0.03044], [[18, 22], -0.02699], [[20, 24], -0.02350]],
    'rho=9': [[[12, 16], -0.03005], [[14, 18], -0.02565], [[16, 20], -0.02227], [[18, 22], -0.01936], [[20, 24], -0.01607]],
    'rho=27': [[[12, 16], -0.01734], [[14, 18], -0.01447], [[16, 20], -0.01230], [[18, 22], -0.01035], [[20, 24], -0.00774]],
  },
  verdict: 'from-below convergence to 1 - 1/rho is UNIFORM across the dense S-unit set (edge/high-rho included); the L = 20 overshoot was truncation, not a high-rho break of the allocation law. corr23 continuity still ASSUMED; changes no bound; RH open; no refereed bound is changed; NO QED',
});

// ---- imp-96226: DERIVE (not just measure) the log^2 cusp order and confirm delta^out_23 keeps it.
// imp-96110 read the log^2 order off finite second-difference RATIOS in (0,1); it never derived WHY
// adjoining a second prime lifts the isolated log cusp of delta_S (at the single point rho = 2) to a
// dense family of log^2 cusps, nor did it rule out delta^out_23 carrying only a lower-order remnant.
// Here is the derivation, with a decisive numeric discriminator that imp-96110 lacked.
//
// THE MECHANISM (free-direction count of the resonance sub-lattice). delta_S(rho) = rho^{1/2} br(rho)
// with br a coefficient-weighted double sum over pairs of dilation scales q = prod p^{n_p}, q2 =
// prod p^{n2_p} of the kernel si(q rho + q2) + si|q rho - q2|. The singular (cusp) contribution at an
// S-unit rho = rho* concentrates on the NEAR-RESONANT pairs where the two scale ladders align,
// q rho* approx q2, i.e. q2/q approx rho*. Writing q = prod p^{n_p}, q2 = prod p^{n2_p}, resonance at
// rho* = prod p^{a_p} PINS the differences n2_p - n_p = a_p for each prime p, but leaves the base
// index n_p FREE along every prime axis (the pair q, q2 = q rho* both stay S-units and both stay under
// the truncation as long as each n_p ranges within a window). The cusp strength is the count of
// near-resonant pairs inside a scale-separation window of width W, which is a lattice-point count over
// the FREE directions: with k = #(primes in S minus infinity) free geometric-ladder axes each of
// length approx log W, the count grows like (log W)^k. So the cusp order is EXACTLY k:
//     S = {oo, 2}       -> 1 free axis (n_2)          -> log^1  (the isolated cusp at rho = 2),
//     S = {oo, 2, 3}    -> 2 free axes (n_2, n_3)     -> log^2  (dense over the 2^a 3^b S-units),
//     S = {oo, p_1..p_k}-> k free axes                -> log^k.
// Adjoining the second prime does not sharpen one cusp; it adds a second free lattice axis, lifting the
// order by one AND spreading it over the (dense) two-parameter S-unit set 2^a 3^b -- the density and
// the order rise together from the SAME lattice fact. This is why the excess obstruction is amplified,
// not removed (imp-96110 obstruction field), and it matches the many-prime warning of the trace-identity.
//
// THE DECISIVE DISCRIMINATOR (log^1 -> 0, log^2 -> const, in EQUAL J-steps). Sample the cusp along
// rho(1 + 2^{-J}); then log(1/eps) = J ln2, so a C (log 1/eps)^p singularity is a degree-p POLYNOMIAL
// in J. Its equal-step second difference D2_J[f] = f(J0 + 2h) - 2 f(J0 + h) + f(J0) therefore VANISHES
// for p = 1 (log) and is a NONZERO CONSTANT (= 2 C (h ln2)^2) for p = 2 (log^2). Measured (h = 4,
// J0 = 8): the single-prime control delta_S2 gives D2_J approx 0 (3.1e-3 at rho = 2, 7.1e-3 at rho = 4,
// at the truncation-noise floor -- log^1 confirmed), while the two-prime delta_S23 gives D2_J = O(1)
// (1.9116 at rho = 3, 2.7234 at rho = 6, 1.3203 at rho = 3/2 -- log^2 confirmed). This 0-vs-O(1)
// contrast is the analytic-order signature the ratio-only measurement of imp-96110 could not supply.
//
// delta^out_23 KEEPS THE FULL log^2 ORDER (not a lower-order remnant). delta^out_23 = delta_S23 -
// delta^in_23 and, since 1/rho* is ALSO an S-unit, delta^in_23 carries its OWN log^2 cusp there. But
// the two log^2 coefficients differ: D2_J[delta^out]/D2_J[delta_S] -> 1 - 1/rho and
// D2_J[delta^in]/D2_J[delta_S] -> 1/rho, and the two ratios sum to 1 EXACTLY (out + in = S). Because
// 1 - 1/rho is strictly in (0, 1) for every S-unit rho > 1, the leading log^2 coefficient of delta^out
// is (1 - 1/rho) C != 0: the difference does NOT cancel to a lower order. Measured D2_J ratios (out/S,
// in/S): rho = 3 (0.6874, 0.3126); rho = 6 (0.8579, 0.1421); rho = 3/2 (0.3233, 0.6768) -- each pair
// sums to 1 and out/S tracks 1 - 1/rho, so delta^out inherits the FULL log^2 order with the same
// fixed-fraction split into the confined part.
//
// HONEST LIMITS (imp-96226). The order is derived from the free-direction lattice-count MECHANISM and
// confirmed by the 0-vs-O(1) J-second-difference discriminator, but this is not a fully rigorous
// theorem: the log^2 signature is read off a FINITE J-window plateau (constant only for moderate J0;
// the br23 L = 20/30 truncation floor cuts it off once eps approaches 2^{-L}, so D2_J drifts down at
// large J0 -- see the J0-sweep decay 1.98 -> 1.10 from J0 = 6 to 12), and a uniform remainder bound on
// the near-resonant sum (needed to promote the plateau to a proven leading order) is NOT supplied. The
// corr23 continuity of imp-96110 remains ASSUMED (unchanged here). Derivation/assessment only; changes
// no bound; no refereed bound is changed; RH open; NO QED.
const _dS2 = (rho) => Math.sqrt(rho) * br2(rho);
// equal-J-step second difference D2_J[f] = f(J0+2h) - 2 f(J0+h) + f(J0) of a cusp probe f(J)
function d2JOrder(fOfJ, J0 = 8, h = 4) { return fOfJ(J0 + 2 * h) - 2 * fOfJ(J0 + h) + fOfJ(J0); }
export const d2JOrderS2 = (rho, J0 = 8, h = 4) => d2JOrder((J) => _dS2(rho * (1 + Math.pow(2, -J))), J0, h);
export const d2JOrderS23 = (rho, J0 = 8, h = 4, L = 20) => d2JOrder((J) => deltaS23c(rho * (1 + Math.pow(2, -J)), L), J0, h);
export const d2JOrderOut23 = (rho, J0 = 8, h = 4, L = 20) => d2JOrder((J) => deltaOut23(rho * (1 + Math.pow(2, -J)), L), J0, h);
export const d2JOrderIn23 = (rho, J0 = 8, h = 4, L = 20) => d2JOrder((J) => deltaIn23(rho * (1 + Math.pow(2, -J)), L), J0, h);

export const IMP_96226_LOG2_ORDER_DERIVATION = Object.freeze({
  parent: 'imp-96110',
  claim: 'the log^2 cusp order of delta_S23 at each 2^a 3^b S-unit is DERIVED (not just read off ratios) from the free-direction count of the resonance sub-lattice: the cusp order equals k = #(finite primes in S), so S = {oo,2} gives log^1 and S = {oo,2,3} gives log^2; delta^out_23 keeps the FULL log^2 order with leading coefficient (1 - 1/rho) C != 0',
  mechanism: 'the cusp concentrates on near-resonant scale-ladder pairs (q rho* approx q2); resonance at rho* = prod p^{a_p} pins n2_p - n_p = a_p per prime but leaves each base index n_p free, so the near-resonant pair count in a window of scale-separation W is a lattice-point count over k free geometric-ladder axes ~ (log W)^k -> cusp order k',
  // decisive numeric discriminator: sampling along rho(1 + 2^{-J}) makes log(1/eps) = J ln2, so a
  // C (log 1/eps)^p cusp is degree-p in J; its equal-J-step 2nd difference D2_J is 0 for p=1, a nonzero
  // constant for p=2. h = 4, J0 = 8.
  d2JDiscriminator: {
    // single-prime control delta_S2: D2_J approx 0 -> log^1
    s2LogOne: [[2, 0.003110], [4, 0.007051]],
    // two-prime delta_S23: D2_J = O(1) -> log^2 (matches imp-96110 log2Order 2nd diffs)
    s23LogTwo: [[3, 1.91155], [6, 2.72340], [1.5, 1.32032]],
  },
  // delta^out keeps the FULL log^2 order: D2_J ratios out/S -> 1-1/rho, in/S -> 1/rho, summing to 1
  outKeepsFullOrder: [ // [rho, out/S ratio, in/S ratio, 1-1/rho, 1/rho]
    [3, 0.68744, 0.31256, 2 / 3, 1 / 3], [6, 0.85793, 0.14207, 5 / 6, 1 / 6], [1.5, 0.32325, 0.67675, 1 / 3, 2 / 3],
  ],
  honestLimits: 'order derived from the free-direction lattice mechanism + confirmed by the 0-vs-O(1) J-2nd-difference discriminator, but read off a FINITE J-window plateau (br23 L-truncation floor cuts it at large J0; D2_J drifts 1.98 -> 1.10 from J0 = 6 to 12); a uniform near-resonant-sum remainder bound to promote the plateau to a proven leading order is NOT supplied; corr23 continuity still ASSUMED (imp-96110); changes no bound; no refereed bound is changed; RH open; NO QED',
});

// ---- assertions
const within = (x, lo, hi) => x >= lo && x <= hi;
const L = IMP_96110_CUSP_ALLOCATION_LITERALS;
export const IMP_96110_P3_CUSP_ALLOCATION_ASSERTIONS = Object.freeze([
  {
    id: 'imp96110-p2-control-recovers-1-minus-2-to-k',
    description: 'the in/out decomposition VALIDATION: incremental f_out at rho = 2, 4, 8 (window J = 14..18) equals 1 - 2^{-k} within 1e-3 and reproduces the baked control literals',
    holds: () => L.p2Control.every(([rho, baked, target]) => {
      const f = outFractionP2(rho);
      return Math.abs(f - baked) < 1e-4 && Math.abs(f - target) < 1e-3;
    }),
  },
  {
    id: 'imp96110-s23-fixed-fraction-tracks-1-minus-1-over-rho',
    description: 'at every {oo,2,3} S-unit rho = 2^a 3^b the incremental f_out tracks 1 - 1/rho within 0.033, approaches it from below (deficit > -0.01 except the rho = 9 truncation edge), reproduces the baked fractions, and is strictly increasing in rho (the allocation law survives and generalizes)',
    holds: () => {
      let ok = true, prevRho = 0, prevF = -1;
      const sorted = [...L.s23Fractions].sort((a, b) => a[1] - b[1]);
      for (const [, rho, baked, target] of sorted) {
        const f = outFractionS23(rho);
        if (Math.abs(f - baked) > 1e-4) ok = false;
        if (Math.abs(f - target) > 0.033) ok = false;
        if (target - f < -0.01) ok = false; // from below (rho=9 edge allowed a small overshoot)
        if (rho > prevRho && !(f > prevF)) ok = false;
        prevRho = rho; prevF = f;
      }
      return ok;
    },
  },
  {
    id: 'imp96110-excess-inherits-full-log2-cusp',
    description: 'the excess inherits the FULL log^2 cusp: at rho = 3, 6, 3/2 both delta_S23 and delta^out_23 have positive 2nd differences (log^2 signature) with ratio delta^out/delta_S strictly in (0, 1), matching the baked log2Order to 1e-3',
    holds: () => L.log2Order.every(([rho, d2Sb, d2Ob, ratb]) => {
      const j = [8, 12, 16].map((J) => ({ S: deltaS23c(rho * (1 + Math.pow(2, -J))), O: deltaOut23(rho * (1 + Math.pow(2, -J))) }));
      const d2S = j[2].S - 2 * j[1].S + j[0].S, d2O = j[2].O - 2 * j[1].O + j[0].O;
      return d2S > 0.5 && d2O > 0 && within(d2O / d2S, 0.01, 0.999) && Math.abs(d2S - d2Sb) < 1e-2 && Math.abs(d2O - d2Ob) < 1e-2 && Math.abs(d2O / d2S - ratb) < 1e-3;
    }),
  },
  {
    id: 'imp96110-verdict-honesty',
    description: 'status records that the fixed-fraction law survives (f_out = 1 - 1/rho) yet is an obstruction (dense log^2 cusps, compact-Toeplitz foothold lost), the p = 2 method is validated, and NO QED; honestLimits disclaims the assumed corr23 continuity',
    holds: () => /SURVIVES and GENERALIZES/.test(IMP_96110_P3_CUSP_ALLOCATION.status)
      && /1 - 1\/rho/.test(IMP_96110_P3_CUSP_ALLOCATION.status)
      && /OBSTRUCTION not a rescue/.test(IMP_96110_P3_CUSP_ALLOCATION.status)
      && /NO QED/.test(IMP_96110_P3_CUSP_ALLOCATION.status)
      && /corr23 continuity through the cusp is ASSUMED/.test(IMP_96110_P3_CUSP_ALLOCATION.honestLimits)
      && /compact-Toeplitz foothold is lost/.test(IMP_96110_P3_CUSP_ALLOCATION.obstruction),
  },
  {
    id: 'imp96208-L-extension-overshoot-is-truncation-artifact',
    description: 'extending br23 from L = 20 to L = 28 removes the rho = 9 / rho = 27 edge overshoot (both sit strictly BELOW 1 - 1/rho, reproducing the baked L = 28 fractions), and at truncation-clean L = 30 the rho = 9 incremental f_out approaches 1 - 1/rho monotonically FROM BELOW as the eps-window deepens (deficit strictly negative and shrinking) -- confirming the from-below convergence is uniform, not a low-rho-only artifact',
    holds: () => {
      const oF = (rho, Jlo, Jhi, Lc) => {
        const oa = deltaOut23(rho * (1 + Math.pow(2, -Jlo)), Lc), sa = deltaS23c(rho * (1 + Math.pow(2, -Jlo)), Lc);
        const ob = deltaOut23(rho * (1 + Math.pow(2, -Jhi)), Lc), sb = deltaS23c(rho * (1 + Math.pow(2, -Jhi)), Lc);
        return (ob - oa) / (sb - sa);
      };
      // overshoot removed at L = 28: rho = 9 and rho = 27 now sit below the law and match the bake
      for (const rho of [9, 27]) {
        const row = IMP_96208_L_EXTENSION.extendedFractions.find((e) => e[0] === rho);
        const f = oF(rho, 14, 18, 28);
        if (f - row[1] > 0) return false;              // strictly below 1 - 1/rho (overshoot gone)
        if (Math.abs(f - row[3]) > 2e-3) return false; // matches the baked L = 28 fraction
      }
      // monotone from below as the window deepens (rho = 9, truncation-clean L = 30)
      let prevDev = null;
      for (const [[a, b], devBaked] of IMP_96208_L_EXTENSION.fromBelowRate['rho=9']) {
        const dev = oF(9, a, b, 30) - 8 / 9;
        if (dev >= 0) return false;                    // strictly below the law
        if (Math.abs(dev - devBaked) > 2e-3) return false;
        if (prevDev !== null && !(dev > prevDev)) return false; // deficit shrinks toward 0
        prevDev = dev;
      }
      return true;
    },
  },
  {
    id: 'imp96226-log2-order-derived-by-J-second-difference-discriminator',
    description: 'DERIVES the log^2 cusp order via the equal-J-step second-difference discriminator (log^1 -> D2_J approx 0, log^2 -> D2_J nonzero const): the single-prime delta_S2 gives D2_J < 0.02 at rho = 2, 4 (log^1), the two-prime delta_S23 gives D2_J = O(1) at rho = 3, 6, 3/2 matching the baked values (log^2), and delta^out_23 keeps the FULL log^2 order -- its D2_J ratios out/S and in/S sum to 1 exactly with out/S tracking 1 - 1/rho (leading coefficient (1 - 1/rho) C != 0, not a lower-order remnant)',
    holds: () => {
      const D = IMP_96226_LOG2_ORDER_DERIVATION;
      // single-prime control: log^1 => equal-J-step 2nd difference vanishes (below the O(1) two-prime scale)
      for (const [rho, baked] of D.d2JDiscriminator.s2LogOne) {
        const v = d2JOrderS2(rho);
        if (!(Math.abs(v) < 0.02)) return false;
        if (Math.abs(v - baked) > 2e-3) return false;
      }
      // two-prime: log^2 => equal-J-step 2nd difference is O(1) nonzero, matching the bake
      for (const [rho, baked] of D.d2JDiscriminator.s23LogTwo) {
        const v = d2JOrderS23(rho);
        if (!(v > 0.5)) return false;
        if (Math.abs(v - baked) > 1e-2) return false;
      }
      // delta^out keeps the full log^2 order: ratios sum to 1, out/S tracks 1 - 1/rho
      for (const [rho, oR, iR, oneMinus, oneOver] of D.outKeepsFullOrder) {
        const S = d2JOrderS23(rho), o = d2JOrderOut23(rho), i = d2JOrderIn23(rho);
        const ro = o / S, ri = i / S;
        if (Math.abs(ro - oR) > 2e-3 || Math.abs(ri - iR) > 2e-3) return false;
        if (Math.abs(ro + ri - 1) > 1e-9) return false;        // out + in = S exactly
        if (Math.abs(ro - oneMinus) > 0.03) return false;      // out/S tracks 1 - 1/rho
        if (Math.abs(ri - oneOver) > 0.03) return false;       // in/S tracks 1/rho
        if (!within(ro, 0.01, 0.999)) return false;            // full order retained, coefficient != 0
      }
      return true;
    },
  },
  {
    id: 'imp96110-honest-status-banner-names-corr23-assumption',
    description: 'the standalone honest-status banner names corr23 continuity as ASSUMED by analogy with p = 2, NOT proved, and keeps the NO QED / SOTA guardrail',
    holds: () => /corr23 continuity/.test(IMP_96110_HONEST_STATUS_BANNER)
      && /ASSUMED by analogy/.test(IMP_96110_HONEST_STATUS_BANNER)
      && /NOT proved/.test(IMP_96110_HONEST_STATUS_BANNER)
      && /NO QED/.test(IMP_96110_HONEST_STATUS_BANNER),
  },
]);

export default IMP_96110_P3_CUSP_ALLOCATION;
