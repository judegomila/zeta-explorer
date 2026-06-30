/**
 * @module imp-3152-c-shock-coincidence-divergence-lock
 * @fileoverview imp-3152 -- Cross-module build-assertion lock for the imp-3126
 *   COINCIDENCE verdict: the imp-3106 regular tail mass int_{s0+1}^inf phi ds
 *   ~0.26900597 and the imp-3026/imp-3070 cusp constant C_shock(N) =
 *   sqrt(2/(3 log gamma_N)) ~0.26922 agree to ~2.1e-4 at exactly ONE ladder point
 *   (N*=1e4) and DIVERGE everywhere else. imp-3126 documents this and self-asserts
 *   the divergence in isolation, but the verdict had no INDEPENDENT cross-module
 *   tripwire: a future constant edit (to the regular-mass integrand, to the
 *   effectiveHeightForN height ladder, or to the C_shock numerator) could silently
 *   re-create a false near-identity between the two degree-0 scalars and rebaseline
 *   the imp-3126 self-assertions along with it.
 *
 *   WHAT THIS MODULE ADDS (the imp-3152 deliverable)
 *   ------------------------------------------------
 *   A SINGLE cross-module tripwire that INDEPENDENTLY recomputes both scalars from
 *   their closed forms -- the regular mass via its own composite-Simpson code path
 *   over phi(s) = G(s)/F(s), and C_shock(N) = sqrt(2/(3 log gamma_N)) via the live
 *   effectiveHeightForN height map -- on the imp-3126 ladder N in {1e4, 1e5, 1e6},
 *   and certifies:
 *     (1) the recomputed regular mass equals the LIVE imp-3126 regularMass export to
 *         ~1e-9 (drift sentinel on the fixed integral);
 *     (2) the recomputed C_shock(N) equals the LIVE imp-3126 ladder cShock per row to
 *         ~1e-9 (drift sentinel on the decaying constant);
 *     (3) THE DELIVERABLE -- the independently recomputed abs diff
 *         |C_shock(N) - regularMass| is STRICTLY INCREASING in N across the ladder
 *         (2.12e-4 at 1e4 -> 2.53e-2 at 1e5 -> 4.52e-2 at 1e6), i.e. the agreement is
 *         confined to the single near-miss and is destroyed by moving in N; and
 *     (4) the end-to-end blowup |diff(1e6)| / |diff(1e4)| is ~213x, matching the live
 *         imp-3126 absDiffBlowupOverLadder export to ~1e-6 -- a structural identity
 *         would keep this ratio ~1, so the ~213x divergence is the coincidence
 *         signature, and the verdict stays isCoincidence === true / isStructural ===
 *         false.
 *   So a silent edit that shrinks the divergence (re-creating a false near-identity)
 *   is caught here even if the imp-3126 per-module assertions were also rebaselined.
 *
 *   NO new math: every value is recomputed from the imp-3126 closed forms and
 *   cross-checked against the imp-3126 exports.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   PURE CROSS-VALIDATION of two degree-0 scalars. Neither quantity is an operator
 *   step; this neither proves nor weakens RH. The off-diagonal endpoint-Hankel
 *   operator step (imp-3066) remains the lone obstruction and is untouched. Lock
 *   only, no QED. Platt-Trudgian Lambda &lt;= 0.2 REMAINS the rigorous SOTA. No false
 *   QED.
 *
 *   @see imp-3126-regular-mass-vs-c-shock-coincidence.js (the coincidence verdict)
 *   @see imp-3106-excess-fraction-integrability.js (the regular mass 0.2690)
 *   @see imp-3070-c-shock-n-dependence.js (the monotone C_shock(N) decay)
 *
 *   Ticket: imp-3152 (accuracy, medium).
 */

import IMP3126_REGULAR_MASS_VS_C_SHOCK from './imp-3126-regular-mass-vs-c-shock-coincidence.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;

// (A) imp-3106 reduced masses in s (overflow regime s > s0) -- independent recompute.
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

// Composite Simpson (n even), own code path; reproduces the imp-3106/imp-3126 mass.
function simpson(f, a, b, n) {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(a + i * h);
  return (sum * h) / 3;
}
const TAIL_CAP = 45;                                   // phi(45) ~ K e^{-45} ~ 1e-19, exact-to-double cap
const REGULAR_MASS = simpson(PHI, S0 + 1, TAIL_CAP, 40000);   // int_{s0+1}^inf phi ds (FIXED, N-independent)

// (B) imp-3026/imp-3070 closed-form cusp constant C_shock(N) = sqrt(2/(3 log gamma_N)).
function cShockClosedForm(N) {
  const gammaN = effectiveHeightForN(N);
  return Math.sqrt(2 / (3 * Math.log(gammaN)));
}

// Ladder mirrors imp-3126 exactly (N* = 1e4 is the lone near-miss).
const LADDER_N = Object.freeze([10000, 100000, 1000000]);

const RECOMPUTED_ROWS = LADDER_N.map((N) => {
  const cShock = cShockClosedForm(N);
  return Object.freeze({
    N,
    cShock,
    absDiff: Math.abs(cShock - REGULAR_MASS),
  });
});

// End-to-end divergence of the agreement over the ladder (a structural identity ~1).
const ABS_DIFF_BLOWUP = RECOMPUTED_ROWS[RECOMPUTED_ROWS.length - 1].absDiff / RECOMPUTED_ROWS[0].absDiff;

// Live imp-3126 exports (drift sentinels).
const LIVE = IMP3126_REGULAR_MASS_VS_C_SHOCK;
const LIVE_LADDER = LIVE.ladder;

export const IMP3152_C_SHOCK_COINCIDENCE_DIVERGENCE_LOCK = Object.freeze({
  id: 'imp-3152-c-shock-coincidence-divergence-lock',
  ticket: 'imp-3152',
  relatedCoincidenceVerdict: 'imp-3126-regular-mass-vs-c-shock-coincidence.js',
  relatedRegularMass: 'imp-3106-excess-fraction-integrability.js',
  relatedCShockNDependence: 'imp-3070-c-shock-n-dependence.js',

  summary:
    'Single cross-module build assertion locking the imp-3126 COINCIDENCE verdict. ' +
    'Independently recomputes the imp-3106 regular tail mass int_{s0+1}^inf phi ds ' +
    '~0.26900597 (own Simpson code path) and the imp-3026/imp-3070 cusp constant ' +
    'C_shock(N) = sqrt(2/(3 log gamma_N)) on the ladder N in {1e4, 1e5, 1e6}, and ' +
    'certifies (1) the recomputed regular mass equals the live imp-3126 export to ' +
    '~1e-9; (2) the recomputed C_shock(N) equals the live imp-3126 ladder per row to ' +
    '~1e-9; (3) the recomputed abs diff |C_shock(N) - regularMass| is STRICTLY ' +
    'INCREASING in N (2.12e-4 -> 2.53e-2 -> 4.52e-2); and (4) the end-to-end blowup is ' +
    '~213x, matching the live absDiffBlowupOverLadder. A constant edit that shrinks the ' +
    'divergence to re-create a false near-identity between the two degree-0 scalars is ' +
    'caught here. Pure cross-validation; NOT an operator step; no RH verdict.',

  recomputedRegularMass: REGULAR_MASS,
  liveRegularMass: LIVE.regularMass,
  recomputedLadder: RECOMPUTED_ROWS,
  absDiffBlowupRecomputed: ABS_DIFF_BLOWUP,        // ~212.93x
  absDiffBlowupFromModule: LIVE.absDiffBlowupOverLadder,

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isCrossValidationOnly: true,
    locksCoincidenceVerdict: true,
    operatorStepUntouched:
      'Pure cross-validation of two degree-0 scalars; the off-diagonal endpoint-Hankel ' +
      'operator step (imp-3066) remains the lone obstruction and is NOT addressed here.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3152_C_SHOCK_COINCIDENCE_DIVERGENCE_LOCK_ASSERTIONS = [
  {
    id: 'imp3152-regular-mass-matches-live-imp3126',
    why: 'The regular mass recomputed here (own Simpson path) must reproduce the LIVE ' +
         'imp-3126 regularMass export ~0.26900597 to ~1e-9. A drift means the imp-3106/imp-3064 ' +
         'reduced F/G integrand was silently edited.',
    holds: () =>
      Math.abs(REGULAR_MASS - LIVE.regularMass) < 1e-9 &&
      Math.abs(REGULAR_MASS - 0.269005971094) < 1e-9,
  },
  {
    id: 'imp3152-c-shock-ladder-matches-live-imp3126',
    why: 'The closed-form C_shock(N) = sqrt(2/(3 log gamma_N)) recomputed here via the live ' +
         'effectiveHeightForN map must equal the LIVE imp-3126 ladder cShock per row to ~1e-9. ' +
         'A drift means the height ladder or the cusp numerator was silently rebaselined.',
    holds: () => {
      if (RECOMPUTED_ROWS.length !== LIVE_LADDER.length) return false;
      for (let i = 0; i < RECOMPUTED_ROWS.length; i++) {
        const live = LIVE_LADDER.find((r) => r.N === RECOMPUTED_ROWS[i].N);
        if (!live) return false;
        if (Math.abs(RECOMPUTED_ROWS[i].cShock - live.cShock) >= 1e-9) return false;
        if (Math.abs(RECOMPUTED_ROWS[i].absDiff - live.absDiff) >= 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: 'imp3152-abs-diff-strictly-increasing-in-N',
    why: 'THE DELIVERABLE: the independently recomputed abs diff |C_shock(N) - regularMass| must ' +
         'be STRICTLY INCREASING along the ladder (2.12e-4 -> 2.53e-2 -> 4.52e-2). The agreement ' +
         'is confined to the lone N*=1e4 near-miss; a constant edit that shrank the divergence to ' +
         'fake a structural near-identity would break this monotonicity.',
    holds: () => {
      for (let i = 1; i < RECOMPUTED_ROWS.length; i++) {
        if (!(RECOMPUTED_ROWS[i].absDiff > RECOMPUTED_ROWS[i - 1].absDiff)) return false;
      }
      return (
        Math.abs(RECOMPUTED_ROWS[0].absDiff - 0.000212098126) < 1e-9 &&
        Math.abs(RECOMPUTED_ROWS[RECOMPUTED_ROWS.length - 1].absDiff - 0.045162351501) < 1e-9
      );
    },
  },
  {
    id: 'imp3152-blowup-is-213x-not-structural',
    why: 'A structural identity would keep |diff(1e6)| / |diff(1e4)| ~1; instead the divergence ' +
         'blows up ~213x. The recomputed blowup must exceed 100x and match the LIVE imp-3126 ' +
         'absDiffBlowupOverLadder export to ~1e-6 -- this ~213x ratio IS the coincidence signature.',
    holds: () =>
      ABS_DIFF_BLOWUP > 100 &&
      Math.abs(ABS_DIFF_BLOWUP - LIVE.absDiffBlowupOverLadder) < 1e-6 &&
      Math.abs(ABS_DIFF_BLOWUP - 212.931402702) < 1e-6,
  },
  {
    id: 'imp3152-verdict-stays-coincidence-not-structural',
    why: 'VERDICT LOCK: the imp-3126 verdict must stay COINCIDENCE (isCoincidence true, ' +
         'isStructural false) and pure cross-validation -- not a proof, not a reduction below RH, ' +
         'operator step untouched, PT 0.2 SOTA. Blocks any future edit from upgrading the ' +
         'near-miss into a claimed shared closed form or RH-relevant link.',
    holds: () => {
      const c = IMP3152_C_SHOCK_COINCIDENCE_DIVERGENCE_LOCK.honestCaveat;
      return (
        LIVE.isStructural === false &&
        LIVE.isCoincidence === true &&
        /COINCIDENCE/.test(LIVE.verdict) &&
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isCrossValidationOnly === true &&
        c.locksCoincidenceVerdict === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3152_C_SHOCK_COINCIDENCE_DIVERGENCE_LOCK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3152-c-shock-coincidence-divergence-lock assertion failed: ' + a.id);
  }
}

export default IMP3152_C_SHOCK_COINCIDENCE_DIVERGENCE_LOCK;
