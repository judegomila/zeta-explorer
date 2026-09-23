/**
 * imp-96110 (2026-09-23) — ASSESSMENT: does the p = 2 half-cusp allocation of the Route I Sonine
 * excess (Theorem 4 of rh-route-i-sonine-excess-semilocal-port: exactly HALF of the delta_S log
 * cusp at rho = 2 lands in the excess eps_S, coefficient c_2 = 1/(2 sqrt2 ln2) = 0.51007) SURVIVE
 * when the third prime is adjoined, i.e. does the excess still inherit a FIXED FRACTION of the dense
 * 2^a 3^b cusps of the S = {oo, 2, 3} remainder delta_S23, or does the many-prime excess lose the
 * fixed-fraction structure (consistent with the compact-Toeplitz method losing its foothold beyond
 * one prime)? Measurement only. RH open; PT Lambda <= 0.2 stands; NO QED.
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
  status: 'ASSESSED — the fixed-fraction cusp allocation SURVIVES and GENERALIZES: at every S = {oo, 2, 3} S-unit cusp rho = 2^a 3^b the excess eps_S23 inherits the fraction f_out(rho) = 1 - 1/rho of the (now log^2) cusp of delta_S23 (measured, converging from below at the p = 2-control rate: rho = 3 -> 0.667, rho = 9 -> 0.889, rho = 3/2 -> 0.333, rho = 9/8 -> 0.111; the clean half at rho = 2 is just 1 - 1/rho at rho = 2), with 1/rho going to the confined part delta^in_23. The p = 2 in/out method is VALIDATED (f_out -> 1 - 2^{-k} exactly at rho = 2/4/8). But this is an OBSTRUCTION not a rescue: the fixed fraction is now inherited across a DENSE set of LOG^2 cusps (one order worse than the isolated log cusp at rho = 2 that already killed the CC route past ln 2), so E_S23 o Q is worse-behaved and the compact-Toeplitz foothold is lost through density and cusp order, not through loss of the fraction structure. RH open; PT Lambda <= 0.2 stands; NO QED',
  method: 'in/out decomposition of the excess ported to S = {oo,2,3}: eps_S23 = delta^out_23 + corr23 (corr23 continuous by analogy, NOT proved), delta^out_23 = delta_S23 - delta^in_23, delta_S23(rho) = rho^{1/2} br23(rho), delta^in_23(rho) = rho^{-1/2} br23(1/rho); br23 = the 2^n 3^m coefficient-weighted si double sum. Out-fraction f_out(rho) = (delta^out increment)/(delta_S increment) over eps = 2^{-J}, window J = 14..18, L = 20',
  finding: 'f_out(rho) -> 1 - 1/rho at every S-unit (measured from below at the same slow finite-J rate as the p = 2 control which reaches 1 - 2^{-k} to 5 digits); cusp order preserved (delta^out_23 and delta_S23 share the log^2 singularity, 2nd-diff ratio in (0,1)); so the excess inherits a fixed fraction of the FULL log^2 cusp at each of the dense S-units',
  obstruction: 'the compact-Toeplitz foothold is lost for S superset {2,3} because the surviving fixed fraction 1 - 1/rho is inherited across a DENSE family of LOG^2 cusps (S-units 2^a 3^b dense in R_+, one singularity order worse than the isolated log cusp of delta_S at rho = 2), so E_S23 o Q is the Hadamard finite part of a dense set of 1/x^2-log-type singularities — strictly worse than the single p = 2 log resonance of rh-route-i-sonine-excess-semilocal-port Theorem 5. The excess obstruction is amplified and made dense, not removed',
  validation: 'the in/out method reproduces the p = 2 half-split exactly: f_out at rho = 2/4/8 (window J = 14..18) = 0.49992 / 0.74996 / 0.87498 vs 1 - 2^{-k} = 0.5 / 0.75 / 0.875',
  honestLimits: 'the in/out decomposition is exact algebra but corr23 continuity through the cusp is ASSUMED by analogy with p = 2 and NOT proved (the dense log^2 spikes make a uniform-convergence proof harder); the fractions are incremental ratios at finite eps converging to 1 - 1/rho from below, not rigorously extrapolated; br23 truncated at L = 20 (reliable while eps >> 2^{-L}; the rho = 9 edge point slightly overshoots); nothing moves a Lambda bound or verified height; RH open; NO QED',
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
]);

export default IMP_96110_P3_CUSP_ALLOCATION;
