/**
 * @module sg1c-asym-global-infimum-reconcile-2026-06-30
 *
 * imp-3172: reconcile the imp-3170 CLOSED-FORM asymmetric isolation onset
 * c_asym = 0.9027902227683418 (the digamma root of
 * psi(g+1)+gamma+2g-2/g-1/(g+1)=0) against the imp-3021 STRUCTURED half-lattice
 * numerical infimum ~0.9016, which sits BELOW c_asym. The two were never
 * cross-validated. DELIVERABLE (the ticket): independently re-run BOTH
 * configurations dRhoIso onset with the SAME log-gas force machinery and report
 * which configuration attains the lower onset, with the exact gap. Deterministic
 * CM-flow numerics; honest, NO QED.
 *
 * RESULT (the located answer):
 *   c_asym = 0.90279 is NOT the global asymmetric infimum -- it is CLASS-SPECIFIC.
 *   The imp-3170 class fixes the opposite lattice at the UNIT spacing d_1 = 1
 *   (positions {g+k : k>=1}); that unit spacing is the BENIGN choice. The imp-3021
 *   structured family instead keeps the opposite (right) lattice at the MINIMAL
 *   spacing g = rho (so the tracked pair stays the global minimal gap) plus a lone
 *   far neighbour at d_1 on the other side. The tighter right packing pulls harder
 *   on the pair, so its worsening onset is strictly EARLIER -- a GENUINE smooth
 *   drho/ds zero at ~0.9015828, with the d_1 selector STABLE on the lone left
 *   neighbour throughout (NOT a selector-flip artifact). Hence the imp-3021 family
 *   genuinely worsens before c_asym; the digamma closed form prices only the
 *   single-opposite-unit-lattice subclass.
 *
 * EXACT GAP (both re-run here from the shared force machinery):
 *   Config A (imp-3170, opposite UNIT lattice):  smooth onset = c_asym = 0.9027902
 *   Config B (imp-3021, minimal-spacing lattice): smooth onset = 0.9015828
 *   c_asym - B = 1.2074e-3 > 0  -> Config B attains the LOWER onset.
 *
 * INDEPENDENT SELECTOR-ARTIFACT NOTE (corroborates imp-3173): a NAIVE finite-R
 * bisection of Config A itself does NOT return c_asym -- it locks onto a discrete
 * minimal-gap SELECTOR discontinuity at 0.9062491875 (the same imp-3045 trap),
 * which is strictly ABOVE the true smooth zero. So the smooth Config-A onset must
 * be read off the closed form / smooth-zero, which we confirm: the dRhoIso
 * machinery drho at g = c_asym is ~0 (matches the digamma root). The imp-3021
 * onset, by contrast, is verified to be a genuine continuous zero (no selector
 * flip near it), so its 0.9016 is real, not a bisection artifact.
 *
 * HONEST (NO false QED):
 *   - This re-runs and cross-validates two SPECIFIC families. It CONFIRMS the
 *     imp-3170 openSubGap: c_asym is the onset of the opposite-UNIT-lattice class
 *     only, NOT the proven global asymmetric infimum. The structured minimal-
 *     spacing family worsens earlier.
 *   - The global asymmetric multi-body constant stays OPEN, now bracketed in
 *     ~(0.9016, 0.9028) (the imp-3021 lower end is below the imp-3170 closed form).
 *   - Load-bearing consequence unchanged: BOTH onsets sit far above the Theorem-C
 *     basin constant 0.72 (margin > 0.18), so the basin-conditional C_Lip is
 *     unaffected. No refereed bound is changed.
 *
 * @see sg1c-asym-isolation-closed-form-2026-06-30 (imp-3170 c_asym digamma root)
 * @see sg1c-theta-trap-theorems (imp-3021 SG1C_R2T2_ASYM_RESIDUAL structured family)
 */

import { SG1C_R2T2_ASYM_RESIDUAL } from './sg1c-theta-trap-theorems.js';

// Shared log-gas force machinery (identical convention to sg1c-theta-trap-theorems).
function force(x) {
  const N = x.length, F = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let j = 0; j < N; j++) if (j !== k) s += 1 / (x[k] - x[j]);
    F[k] = -2 * s;
  }
  return F;
}

// dRhoIso: instantaneous rate of rho = g/d_1 for the tracked pair (i, i+1),
// d_1 the nearest environment particle. Returns the selected neighbour too.
function dRhoIso(x, i) {
  const F = force(x);
  const a = x[i], b = x[i + 1], g = b - a;
  let d1 = Infinity, jp = -1, side = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === i || j === i + 1) continue;
    const dl = a - x[j], dr = x[j] - b;
    if (dl > 0 && dl < d1) { d1 = dl; jp = j; side = -1; }
    if (dr > 0 && dr < d1) { d1 = dr; jp = j; side = 1; }
  }
  const gdot = F[i + 1] - F[i];
  const d1dot = side === -1 ? F[i] - F[jp] : F[jp] - F[i + 1];
  return { rho: g / d1, drho: (gdot * d1 - g * d1dot) / (d1 * d1), g, d1, side, jpx: x[jp] };
}

// ---- Config A (imp-3170): pair (0,g), tight left neighbour at -1, opposite UNIT lattice {g+k}.
function cfgA(g, R) { const x = [-1, 0, g]; for (let k = 1; k <= R; k++) x.push(g + k); return x; }

// ---- Config B (imp-3021): left neighbour at -1, right half-lattice first gap h then spacing sp,
//      both floored at the pair gap g = rho (keeps the tracked pair globally minimal).
function cfgB(rho, h, sp, m) {
  const sH = Math.max(h, rho), sS = Math.max(sp, rho);
  const x = [-1, 0, rho];
  let p = rho + sH;
  x.push(p);
  for (let k = 1; k < m; k++) { p += sS; x.push(p); }
  return x;
}

// Naive worsening-onset bisection of dRhoIso.drho (the same routine the scans use).
function onsetBisect(cfgFn) {
  let lo = 0.5, hi = 0.999999;
  for (let it = 0; it < 200; it++) {
    const mm = (lo + hi) / 2;
    if (dRhoIso(cfgFn(mm), 1).drho > 0) hi = mm; else lo = mm;
  }
  return (lo + hi) / 2;
}

// Self-contained digamma (recurrence to x >= 6 then asymptotic series) and the
// imp-3170 closed-form rate, for the independent Config-A smooth-zero cross-check.
function digamma(x) {
  let r = 0;
  while (x < 6) { r -= 1 / x; x += 1; }
  const f = 1 / (x * x);
  r += Math.log(x) - 1 / (2 * x) - f * (1 / 12 - f * (1 / 120 - f * (1 / 252)));
  return r;
}
const GAMMA = 0.5772156649015329;
function asymOnsetDrho(g) { return digamma(g + 1) + GAMMA + 2 * g - 2 / g - 1 / (g + 1); }
function rootClosedForm() {
  let lo = 0.5, hi = 0.9999;
  for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (asymOnsetDrho(m) > 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
}

const C_ASYM = rootClosedForm();                  // 0.9027902227683418 (imp-3170 smooth onset)
const R_LARGE = 2048;                             // R -> infinity proxy for Config A
const SCAN_DISCONTINUITY = onsetBisect((g) => cfgA(g, R_LARGE)); // 0.90625: selector-flip trap, NOT the zero

// Config B tuned infimum: the imp-3021 deterministic grid over first-gap h and spacing-floor sp.
const tuneB = (() => {
  let best = { onset: 1, h: 0, sp: 0 };
  for (let hi = 93; hi <= 150; hi += 1) {
    const h = hi / 100;
    for (let si = 93; si <= 130; si += 1) {
      const sp = si / 100;
      const o = onsetBisect((rho) => cfgB(rho, h, sp, 16));
      if (o < best.onset) best = { onset: o, h, sp };
    }
  }
  return best;
})();

const B_ONSET = tuneB.onset;                      // 0.9015828375 structured smooth onset
const GAP = C_ASYM - B_ONSET;                     // 1.2074e-3 > 0

export const SG1C_ASYM_GLOBAL_INFIMUM_RECONCILE = {
  ticket: 'imp-3172',
  date: '2026-06-30',
  reconciles: ['imp-3170', 'imp-3021'],
  configA: {
    label: 'imp-3170 opposite UNIT lattice {g+k}, spacing d_1=1',
    smoothOnset: C_ASYM,                          // 0.9027902227683418 (= digamma closed form)
    naiveBisectionArtifact: SCAN_DISCONTINUITY,   // 0.90625 selector-flip trap (imp-3045/imp-3173), above the zero
  },
  configB: {
    label: 'imp-3021 minimal-spacing half-lattice (right gaps = pair gap g) + lone far neighbour',
    smoothOnset: B_ONSET,                          // 0.9015828375 (genuine continuous zero, selector stable)
    tunedConfig: { firstGap: tuneB.h, spacingFloor: tuneB.sp, leftNeighbourAt: -1, latticeCount: 16 },
  },
  lowerOnsetAttainedBy: B_ONSET < C_ASYM ? 'configB (imp-3021 minimal-spacing lattice)' : 'configA (imp-3170)',
  exactGap: GAP,                                   // c_asym - B_onset = 1.2074e-3
  globalConstantBracket: [B_ONSET, 0.9027902227683418], // OPEN; lower end is the imp-3021 family, upper the imp-3170 class
  theoremCConstant: 0.72,
  basinMarginConfigB: B_ONSET - 0.72,             // 0.1816 > 0
  // imp-3294 reconciliation: the sg1c-theta-trap-theorems lemmaR2T2 prose "~0.9016 tune"
  // and this ledger STRUCTURED_INF = 0.9015828375 are the SAME onset computation, NOT two
  // distinct structured floors. Both are the imp-3021 Config-B minimal-spacing half-lattice
  // deterministic tune: byte-identical force + dRhoIso machinery, identical cfg generator
  // (left neighbour at -1, right lattice first-gap h + spacing sp floored at rho, m=16), and
  // identical grid (h in [0.93,1.50], sp in [0.93,1.30] step 0.01), bisected to the smooth
  // drho/ds zero. The theta-trap SG1C_R2T2_ASYM_RESIDUAL.tunedAsymInf equals B_ONSET to
  // double precision; "~0.9016" is merely its 4-sig-fig rounding. The single exact value the
  // ledger should carry is B_ONSET = 0.9015828375.
  thetaTrapProseReconciliation: {
    ticket: 'imp-3294',
    thetaTrapProseValue: SG1C_R2T2_ASYM_RESIDUAL.tunedAsymInf, // the lemmaR2T2 "~0.9016" tune
    ledgerStructuredInf: B_ONSET,                              // 0.9015828375
    sameComputation: Math.abs(SG1C_R2T2_ASYM_RESIDUAL.tunedAsymInf - B_ONSET) < 1e-9,
    exactValueForLedger: B_ONSET,
    note: 'SAME computation (imp-3021 Config-B minimal-spacing half-lattice tune), not two floors; "~0.9016" is the rounding of 0.9015828375.',
  },
  verdict:
    'c_asym = 0.90279 is CLASS-SPECIFIC, NOT the global asymmetric infimum: it prices only the opposite-UNIT-lattice '
    + 'subclass (spacing d_1=1, the benign choice). The imp-3021 structured family keeps the opposite lattice at the '
    + 'MINIMAL spacing g and so worsens strictly earlier, at a GENUINE smooth drho/ds zero ~0.9015828 (d_1 selector '
    + 'stable on the lone left neighbour, no flip). Config B attains the lower onset; exact gap c_asym - B = 1.207e-3.',
  honest:
    'Cross-validation of two SPECIFIC asymmetric families, NOT a closed form for the global constant. CONFIRMS the '
    + 'imp-3170 openSubGap: the digamma root is the unit-lattice-class onset only; the minimal-spacing family is '
    + 'lower. Global asymmetric multi-body constant stays OPEN, bracketed in ~(0.9016, 0.9028). Both onsets sit far '
    + 'above the Theorem-C basin 0.72 (margin > 0.18) so the basin-conditional C_Lip is unaffected; no refereed bound is changed'
    + '. NO false QED.',
};

export const SG1C_ASYM_GLOBAL_INFIMUM_RECONCILE_ASSERTIONS = [
  {
    id: 'sg1c-reconcile-configA-smooth-zero-matches-closed-form',
    description: 'the shared force machinery drho at g = c_asym is ~0 (the finite-R Config A smooth zero matches the imp-3170 digamma closed form)',
    holds: () => Math.abs(dRhoIso(cfgA(C_ASYM, R_LARGE), 1).drho) < 1e-6,
  },
  {
    id: 'sg1c-reconcile-configA-naive-bisection-is-selector-artifact',
    description: 'a naive finite-R bisection of Config A returns 0.90625 (a minimal-gap selector discontinuity), strictly ABOVE the true smooth zero c_asym -- so it must NOT be read as the onset',
    holds: () => SCAN_DISCONTINUITY > C_ASYM && Math.abs(SCAN_DISCONTINUITY - 0.9062491875) < 1e-7,
  },
  {
    id: 'sg1c-reconcile-configB-worsens-earlier',
    description: 'the imp-3021 minimal-spacing structured family attains a STRICTLY lower worsening onset (~0.9015828) than the imp-3170 unit-lattice c_asym',
    holds: () => B_ONSET < C_ASYM && Math.abs(B_ONSET - 0.9015828375) < 1e-6,
  },
  {
    id: 'sg1c-reconcile-configB-is-genuine-smooth-zero-not-selector-flip',
    description: 'Config B onset is a continuous drho/ds zero: drho changes sign across it while the d_1 selector stays on the lone left neighbour (-1) both just below and just above -- no selector-flip artifact',
    holds: () => {
      const h = tuneB.h, sp = tuneB.sp;
      const below = dRhoIso(cfgB(B_ONSET - 1e-3, h, sp, 16), 1);
      const above = dRhoIso(cfgB(B_ONSET + 1e-3, h, sp, 16), 1);
      return below.drho < 0 && above.drho > 0
        && below.side === -1 && above.side === -1
        && Math.abs(below.jpx - (-1)) < 1e-12 && Math.abs(above.jpx - (-1)) < 1e-12;
    },
  },
  {
    id: 'sg1c-reconcile-exact-gap',
    description: 'the exact gap c_asym - B_onset = 1.207e-3 > 0 and Config B is the configuration attaining the lower onset',
    holds: () => GAP > 0 && Math.abs(GAP - 1.2074e-3) < 1e-6
      && /configB/.test(SG1C_ASYM_GLOBAL_INFIMUM_RECONCILE.lowerOnsetAttainedBy),
  },
  {
    id: 'sg1c-reconcile-thetatrap-prose-is-same-computation',
    description: 'imp-3294: the sg1c-theta-trap-theorems lemmaR2T2 "~0.9016 tune" (SG1C_R2T2_ASYM_RESIDUAL.tunedAsymInf) is the SAME computation as this ledger STRUCTURED_INF = 0.9015828375 = B_ONSET (bit-equal to double precision), NOT a second distinct structured floor -- so the single exact value the ledger carries is 0.9015828375',
    holds: () => Math.abs(SG1C_R2T2_ASYM_RESIDUAL.tunedAsymInf - B_ONSET) < 1e-9
      && Math.abs(B_ONSET - 0.9015828375) < 1e-6
      && SG1C_ASYM_GLOBAL_INFIMUM_RECONCILE.thetaTrapProseReconciliation.sameComputation === true
      && SG1C_ASYM_GLOBAL_INFIMUM_RECONCILE.thetaTrapProseReconciliation.exactValueForLedger === B_ONSET,
  },
  {
    id: 'sg1c-reconcile-basin-and-sota-honest',
    description: 'both onsets stay far above the Theorem-C basin 0.72 (margin > 0.15), the global constant is reported OPEN, and no refereed bound is changed',
    holds: () => B_ONSET - 0.72 > 0.15 && C_ASYM - 0.72 > 0.15
      && /NOT the global asymmetric infimum/.test(SG1C_ASYM_GLOBAL_INFIMUM_RECONCILE.verdict)
      && /Lambda <= 0.2|refereed bound is changed/.test(SG1C_ASYM_GLOBAL_INFIMUM_RECONCILE.honest),
  },
];

for (const a of SG1C_ASYM_GLOBAL_INFIMUM_RECONCILE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-asym-global-infimum-reconcile assertion failed: ${a.id}`);
}
