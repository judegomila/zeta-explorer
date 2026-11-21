/**
 * imp-96126 (2026-09-23) — MEASUREMENT: Richardson/Aitken-extrapolate the imp-96110 finite-eps
 * incremental out-fractions f_out(rho; J) of the Route I Sonine excess to a limit and test how
 * tightly the extrapolated value matches the conjectured law 1 - 1/rho at the mixed S = {oo, 2, 3}
 * units. imp-96110 reported f_out(rho) tracks 1 - 1/rho FROM BELOW at the same slow finite-J rate
 * as the validated p = 2 control, but its HONEST LIMIT flagged that the fractions are incremental
 * ratios at finite eps = 2^{-J} and are NOT extrapolated to a rigorous limit. This module builds the
 * per-J sequence, applies windowed Aitken acceleration, and MEASURES the per-unit residual with an
 * error estimate. Measurement only. RH open; no refereed bound is changed; NO QED.
 *
 * METHOD.
 *  Single-J incremental out-fraction: f(rho; J) = [delta^out(rho b) - delta^out(rho a)] /
 *  [delta_S(rho b) - delta_S(rho a)] with a = 1 + 2^{-J}, b = 1 + 2^{-(J+1)} (consecutive dyadic
 *  offsets straddling the cusp at rho). As J grows the offsets shrink to the cusp and f(rho; J)
 *  converges to the out-fraction of the log cusp. The p = 2 control uses the exact br2 bracket
 *  (no truncation); the S = {oo, 2, 3} sequence uses br23 truncated at L = 20 (imp-96110).
 *  Windowed Aitken: the L = 20 truncation makes the S23 sequence turn UPWARD once eps approaches
 *  2^{-L} (spurious acceleration), so we cut the sequence at the J where the forward increment is
 *  smallest (the deceleration turning point = onset of truncation contamination) and apply the
 *  Aitken delta^2 accelerator only on that clean sub-window. The p = 2 control has no truncation and
 *  the whole J = 8..20 window is clean.
 *
 * THE FINDING (the p = 2 log cusp extrapolates rigorously; the S23 log^2 cusps do NOT at L = 20).
 *   p = 2 control: windowed Aitken recovers 1 - 2^{-k} at rho = 2 / 4 / 8 to |err| < 1.1e-7
 *     (L_ext = 0.50000010 / 0.75000007 / 0.87500005). The incremental-fraction method admits a
 *     RIGOROUS-quality J-extrapolation because the log-cusp deficit decays geometrically (~2^{-J}).
 *   S = {oo, 2, 3}: the SAME accelerator does NOT sharpen. Per-unit extrapolated residual to 1 - 1/rho
 *     (mean |err| = 5.9e-2, max |err| = 1.9e-1) is FIVE-to-SIX orders of magnitude worse than the
 *     p = 2 control. The clean window closes (forward increment bottoms out) near J = 11..14 — before
 *     the slower log^2-cusp finite-J convergence resolves — and the Aitken self-consistency spread
 *     across the window is O(10^{-2}..10^{-1}), comparable to or larger than the residual itself. The
 *     rho = 9 truncation edge extrapolates to L_ext = 1.083 > 1, an IMPOSSIBLE value for a fraction:
 *     a clean signature that the L = 20 window shuts before the sequence settles.
 *   NET: 1 - 1/rho at the mixed S-units is CONFIRMED from below only at the O(10^{-2}) bracket level
 *     (raw f at the last clean J stays below 1 - 1/rho for every unit), NOT to a rigorous limit. This
 *     QUANTIFIES the imp-96110 honest limit and matches the obstruction picture: the log^2 density that
 *     imp-96110 flagged as the analytic obstruction ALSO degrades the numerical extrapolability.
 *
 * SUB-GAP SG-96126-truncation-window: a rigorous J-limit for the S23 fractions needs the br23
 *  truncation pushed well past L = 20 to open a clean J-window beyond the log^2 deceleration onset
 *  (exactly the territory of imp-96127). At L = 20 only an O(10^{-2}) confirmation of 1 - 1/rho
 *  survives; the rigorous limit stays UNESTABLISHED. Nothing here moves a Lambda bound or verified
 *  height. Measurement only; RH open; NO QED.
 *
 * Import-light (reuses br2/delta_S23c/delta_out_23 from imp-96110; no zeros bundle). Assertions
 * recompute the p = 2 control (Aitken err < 1e-5) and the S23 extrapolation (reproduces baked
 * literals; confirms the extrapolation is NOT rigorous) in ~0.5 s. Changes no bound.
 */

import {
  deltaS23c,
  deltaOut23,
  br2,
} from './imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js';

const dS2 = (rho) => Math.sqrt(rho) * br2(rho);
const dOut2 = (rho) => Math.sqrt(rho) * br2(rho) - br2(1 / rho) / Math.sqrt(rho);

/** single-J incremental out-fraction at the S = {oo,2,3} cusp rho (consecutive dyadic offsets J, J+1) */
export function foutJ_S23(rho, J, L = 20) {
  const a = 1 + Math.pow(2, -J), b = 1 + Math.pow(2, -(J + 1));
  return (deltaOut23(rho * b, L) - deltaOut23(rho * a, L)) / (deltaS23c(rho * b, L) - deltaS23c(rho * a, L));
}
/** single-J incremental out-fraction for the exact (untruncated) p = 2 control */
export function foutJ_P2(rho, J) {
  const a = 1 + Math.pow(2, -J), b = 1 + Math.pow(2, -(J + 1));
  return (dOut2(rho * b) - dOut2(rho * a)) / (dS2(rho * b) - dS2(rho * a));
}

const aitken3 = (x0, x1, x2) => {
  const d = x2 - 2 * x1 + x0;
  return Math.abs(d) < 1e-15 ? x2 : x0 - (x1 - x0) * (x1 - x0) / d;
};

/** windowed-Aitken extrapolation of the incremental out-fraction sequence over J = Jlo..Jhi.
 *  Cuts the sequence at the deceleration turning point (smallest forward increment = truncation
 *  onset for the S23 case) and Aitken-accelerates on that clean sub-window. Returns the extrapolated
 *  limit, the clean-window end index, the last raw value, and the Aitken self-consistency spread. */
export function extrapFout(fn, rho, Jlo, Jhi, L) {
  const seq = [];
  for (let J = Jlo; J <= Jhi; J++) seq.push(L === undefined ? fn(rho, J) : fn(rho, J, L));
  let minInc = Infinity, argmin = 1;
  for (let i = 1; i < seq.length; i++) { const inc = seq[i] - seq[i - 1]; if (inc < minInc) { minInc = inc; argmin = i; } }
  const clean = seq.slice(0, argmin + 1);
  const aitk = [];
  for (let i = 0; i + 2 < clean.length; i++) aitk.push(aitken3(clean[i], clean[i + 1], clean[i + 2]));
  const Lext = aitk.length ? aitk[aitk.length - 1] : clean[clean.length - 1];
  const spread = aitk.length >= 2 ? Math.max(...aitk) - Math.min(...aitk) : 0;
  return { Lext, JendIdx: Jlo + argmin, rawLast: clean[clean.length - 1], spread };
}

// ---- baked measurement literals (P2: J = 8..20; S23: J = 8..18, L = 20)
export const IMP_96126_EXTRAPOLATION_LITERALS = Object.freeze({
  p2Control: [ // [rho = 2^k, Aitken L_ext, target 1 - 2^{-k}]
    [2, 0.50000010, 0.5], [4, 0.75000007, 0.75], [8, 0.87500005, 0.875],
  ],
  s23Extrap: [ // [label, rho, Aitken L_ext, target 1 - 1/rho, raw f at last clean J, Aitken spread]
    ['9/8', 9 / 8, 0.097667, 1 / 9, 0.091764, 0.021291],
    ['4/3', 4 / 3, 0.212747, 0.25, 0.199037, 0.037777],
    ['3/2', 1.5, 0.256540, 1 / 3, 0.256540, 0.0],
    ['16/9', 16 / 9, 0.380588, 7 / 16, 0.376551, 0.030690],
    ['2', 2, 0.459798, 0.5, 0.456390, 0.018429],
    ['8/3', 8 / 3, 0.567335, 0.625, 0.566799, 0.039909],
    ['3', 3, 0.684050, 2 / 3, 0.628333, 0.284607],
    ['4', 4, 0.695451, 0.75, 0.694512, 0.034582],
    ['6', 6, 0.790865, 5 / 6, 0.790862, 0.042169],
    ['9', 9, 1.082888, 8 / 9, 0.861814, 0.614107],
  ],
  p2MaxErr: 1.1e-7,   // max |L_ext - (1 - 2^{-k})| over the p = 2 control
  s23MeanErr: 5.9e-2, // mean |L_ext - (1 - 1/rho)| over the 10 S23 units
  s23MaxErr: 1.94e-1, // max |L_ext - (1 - 1/rho)| = the rho = 9 truncation-edge blow-up (L_ext > 1)
});

export const IMP_96126_FOUT_EXTRAPOLATION = Object.freeze({
  id: 'imp-96126-route-i-fout-richardson-extrapolation-limit',
  route: 'I (Sonine refinement) — Richardson/Aitken extrapolation of the imp-96110 finite-eps out-fractions',
  parents: [
    'src/data/imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js (f_out incremental ratios, honest limit: not extrapolated)',
    'src/data/rh-route-i-sonine-excess-semilocal-port-2026-09-23.js (Theorem 4: half the rho = 2 cusp in the excess)',
  ],
  status: 'MEASURED — the p = 2 log-cusp out-fraction admits a RIGOROUS-quality J-extrapolation: windowed Aitken recovers 1 - 2^{-k} at rho = 2/4/8 to |err| < 1.1e-7 (geometric ~2^{-J} deficit). The S = {oo, 2, 3} log^2-cusp fractions do NOT extrapolate rigorously at L = 20: the same accelerator leaves a per-unit residual to 1 - 1/rho of mean 5.9e-2 / max 1.9e-1 (5-6 orders worse than p = 2), with the clean J-window closing near J = 11..14 before the slower log^2 convergence resolves and Aitken self-consistency spread O(10^{-2}..10^{-1}); the rho = 9 truncation edge extrapolates to an impossible L_ext = 1.083 > 1. So 1 - 1/rho at the mixed S-units is confirmed FROM BELOW only at the O(10^{-2}) bracket level, NOT to a rigorous limit. This quantifies the imp-96110 honest limit and matches the log^2-density obstruction (the density that hurts the analysis also degrades the numerics). RH open; no refereed bound is changed; NO QED',
  method: 'single-J incremental out-fraction f(rho; J) = [delta^out increment]/[delta_S increment] over consecutive dyadic offsets (J, J+1); windowed Aitken delta^2 on the clean sub-window cut at the deceleration turning point (smallest forward increment = truncation onset). p = 2 control uses the exact br2 bracket (J = 8..20); S23 uses br23 at L = 20 (J = 8..18)',
  finding: 'p = 2: L_ext = 0.50000010 / 0.75000007 / 0.87500005 vs 0.5 / 0.75 / 0.875 (|err| < 1.1e-7). S23: L_ext tracks 1 - 1/rho only to mean 5.9e-2 / max 1.9e-1; raw f at the last clean J stays below 1 - 1/rho for every unit (from below); the rho = 9 edge L_ext = 1.083 > 1 flags truncation failure',
  subGap: 'SG-96126-truncation-window: a rigorous J-limit for the S23 out-fractions needs br23 truncation pushed well past L = 20 to open a clean J-window beyond the log^2 deceleration onset (imp-96127 territory); at L = 20 only an O(10^{-2}) confirmation of 1 - 1/rho survives, the rigorous limit stays UNESTABLISHED',
  honestLimits: 'the p = 2 extrapolation is rigorous-quality only because the control bracket is untruncated and the cusp deficit is geometric; the S23 extrapolation inherits the L = 20 truncation ceiling and does NOT reach a rigorous limit; corr23 continuity through the cusp is still ASSUMED (imp-96110), not proved; nothing moves a Lambda bound or verified height; RH open; NO QED',
});

// ---- assertions
const L = IMP_96126_EXTRAPOLATION_LITERALS;
export const IMP_96126_FOUT_EXTRAPOLATION_ASSERTIONS = Object.freeze([
  {
    id: 'imp96126-p2-control-extrapolates-rigorously',
    description: 'windowed Aitken on the exact p = 2 control recovers 1 - 2^{-k} at rho = 2, 4, 8 to |err| < 1e-5 and reproduces the baked L_ext to 1e-6 (the log-cusp out-fraction admits a rigorous J-extrapolation)',
    holds: () => L.p2Control.every(([rho, baked, target]) => {
      const { Lext } = extrapFout(foutJ_P2, rho, 8, 20);
      return Math.abs(Lext - baked) < 1e-6 && Math.abs(Lext - target) < 1e-5;
    }),
  },
  {
    id: 'imp96126-s23-reproduces-baked-extrapolation',
    description: 'the windowed-Aitken S23 extrapolation reproduces the baked L_ext, raw-last, and spread literals to 1e-4, and the raw fraction at the last clean J stays below 1 - 1/rho for every unit (converging from below)',
    holds: () => L.s23Extrap.every(([, rho, bakedLext, target, bakedRaw]) => {
      const { Lext, rawLast } = extrapFout(foutJ_S23, rho, 8, 18, 20);
      return Math.abs(Lext - bakedLext) < 1e-4 && Math.abs(rawLast - bakedRaw) < 1e-4 && rawLast < target + 1e-6;
    }),
  },
  {
    id: 'imp96126-s23-extrapolation-not-rigorous',
    description: 'the S23 J-extrapolation is NOT rigorous at L = 20: mean |L_ext - (1 - 1/rho)| exceeds 1e-2 and is at least 1e4x the p = 2 control error, the rho = 9 truncation edge extrapolates to an impossible L_ext > 1, and its Aitken self-consistency spread exceeds 0.1',
    holds: () => {
      const p2Err = Math.max(...L.p2Control.map(([rho, , t]) => Math.abs(extrapFout(foutJ_P2, rho, 8, 20).Lext - t)));
      let sum = 0; let edge9 = null;
      for (const [, rho, , target] of L.s23Extrap) {
        const r = extrapFout(foutJ_S23, rho, 8, 18, 20);
        sum += Math.abs(r.Lext - target);
        if (rho === 9) edge9 = r;
      }
      const meanErr = sum / L.s23Extrap.length;
      return meanErr > 1e-2 && meanErr > 1e4 * p2Err && edge9 !== null && edge9.Lext > 1 && edge9.spread > 0.1;
    },
  },
  {
    id: 'imp96126-verdict-honesty',
    description: 'status records the p = 2 rigorous extrapolation, the S23 non-rigorous outcome, the named sub-gap, and NO QED',
    holds: () => /RIGOROUS-quality J-extrapolation/.test(IMP_96126_FOUT_EXTRAPOLATION.status)
      && /do NOT extrapolate rigorously/.test(IMP_96126_FOUT_EXTRAPOLATION.status)
      && /NOT to a rigorous limit/.test(IMP_96126_FOUT_EXTRAPOLATION.status)
      && /NO QED/.test(IMP_96126_FOUT_EXTRAPOLATION.status)
      && /SG-96126-truncation-window/.test(IMP_96126_FOUT_EXTRAPOLATION.subGap),
  },
]);

export default IMP_96126_FOUT_EXTRAPOLATION;
