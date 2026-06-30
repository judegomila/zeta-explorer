/**
 * @module imp-3126-regular-mass-vs-c-shock-coincidence
 * @fileoverview imp-3126 -- Cross-check whether the imp-3106 convergent regular
 *   tail mass int_{s0+1}^inf phi ds ~0.2690 is numerically/structurally related to
 *   the imp-3026/imp-3070 cusp constant C_shock ~0.2692, or merely a coincidence.
 *
 *   THE QUESTION (frontier scout)
 *   -----------------------------
 *   Two unrelated scalar quantities from two different program threads agree to
 *   ~2e-4 at one ladder point -- suspiciously close:
 *     (A) imp-3106 REGULAR MASS: the convergent mass of the imp-3064 excess fraction
 *         phi(s) = G(s)/F(s) beyond the onset window,
 *           int_{s0+1}^inf phi ds = 0.26900597...,
 *         with F(s) = cosh(s) - sqrt(2) - s + arcsinh(1), G(s) = sqrt(2) - arcsinh(1)
 *         - e^{-s}, s0 = arcsinh(1). A FIXED, N-INDEPENDENT number (a definite integral).
 *     (B) imp-3026/imp-3070 C_shock: the Holder-1/2 cusp prefactor of the first-collision
 *         min gap, closed form C_shock(N) = sqrt(2 / (3 log gamma_N)) (imp-2786), which
 *         at N*=1e4 evaluates to C_shock = 0.26921807..., i.e. abs diff ~2.12e-4 from (A).
 *
 *   THE TEST -- is the proximity STRUCTURAL or COINCIDENTAL?
 *   -------------------------------------------------------
 *   The decisive discriminator is N-dependence. The regular mass (A) is a fixed
 *   integral with NO N. The cusp constant (B) is C_shock(N) = sqrt(2/(3 log gamma_N)),
 *   which the imp-3070 ladder shows DECAYS MONOTONICALLY in N (the 1/sqrt(log gamma_N)
 *   factor). If the two were structurally tied they would track each other along the
 *   ladder; instead C_shock(N) slides straight through the fixed 0.2690 near N*=1e4 and
 *   keeps falling, so the abs diff |C_shock(N) - 0.2690| GROWS without bound:
 *       N = 1e4 : C_shock = 0.26921807, abs diff = 2.1210e-4   (the near-miss)
 *       N = 1e5 : C_shock = 0.24371186, abs diff = 2.5294e-2   (119x larger)
 *       N = 1e6 : C_shock = 0.22384362, abs diff = 4.5162e-2   (213x larger)
 *   The agreement exists at exactly ONE ladder point and is destroyed by moving one
 *   decade in N. A structural identity cannot be N-fragile like this.
 *
 *   ALGEBRA -- no shared arcsinh(1)/sqrt(2) closed form
 *   ---------------------------------------------------
 *   The only atom the two share is sqrt(2), and it enters in structurally unrelated
 *   ways: in (A) sqrt(2) = cosh(s0) sets the F,G overflow geometry inside a transcendental
 *   definite integral of cosh/exp; in (B) the sqrt(2) is the bare numerator of
 *   sqrt(2/(3 log gamma_N)), a Holder cusp prefactor governed by the zero-height log.
 *   There is NO arcsinh(1)/sqrt(2) identity that maps the integral 0.26900597 onto
 *   sqrt(2/(3 log gamma_N)); the regular mass has no log gamma_N in it at all, and
 *   C_shock has no e^{-s} cosh-completion integral in it. The match is a NUMERICAL
 *   COINCIDENCE of a slowly-decaying N-dependent constant passing a fixed one.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   PURE CROSS-VALIDATION OF TWO DEGREE-0 SCALARS. Neither quantity is an operator step;
 *   neither proves nor weakens RH. The off-diagonal endpoint-Hankel step (imp-3066)
 *   remains the lone obstruction and is untouched. No QED. Platt-Trudgian Lambda <= 0.2
 *   REMAINS the rigorous SOTA.
 *
 *   @see imp-3106-excess-fraction-integrability.js (the regular mass 0.2690)
 *   @see imp-3026-c-shock-cross-validation.js (C_shock dual-appearance ~0.2692 at N*=1e4)
 *   @see imp-3070-c-shock-n-dependence.js (the monotone C_shock(N) decay)
 *
 *   Ticket: imp-3126 (numerical, medium).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;

// (A) imp-3106 reduced masses in s = a*U (overflow regime s > s0).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

// Composite Simpson (n even), identical code path to imp-3106 so the regular mass
// here reproduces the imp-3106 export bit-for-bit.
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

// N ladder mirroring imp-3026/imp-3070; tabulate C_shock(N) and its abs diff from the
// fixed regular mass so the COINCIDENCE (agreement only at N*=1e4) is explicit.
const LADDER_N = Object.freeze([10000, 100000, 1000000]);
const N_STAR = 10000;

const ROWS = LADDER_N.map((N) => {
  const cShock = cShockClosedForm(N);
  return Object.freeze({
    N,
    gamma_N: effectiveHeightForN(N),
    regularMass: REGULAR_MASS,            // (A) fixed, repeated each row to show it does NOT move
    cShock,                               // (B) C_shock(N), decaying in N
    absDiff: Math.abs(cShock - REGULAR_MASS),
  });
});

const STAR_ROW = ROWS.find((r) => r.N === N_STAR);
// Ratio of the worst (N=1e6) abs diff to the near-miss (N*=1e4) abs diff: how badly
// the agreement degrades over the ladder (a structural identity would keep this ~1).
const ABS_DIFF_BLOWUP = ROWS[ROWS.length - 1].absDiff / STAR_ROW.absDiff;

export const REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126 = Object.freeze({
  id: 'imp-3126-regular-mass-vs-c-shock-coincidence',
  ticket: 'imp-3126',
  title:
    'Cross-check the imp-3106 regular tail mass (~0.2690) against the imp-3026/imp-3070 cusp constant C_shock (~0.2692): coincidence or structural?',
  verdict:
    'COINCIDENCE. The imp-3106 regular mass int_{s0+1}^inf phi ds = 0.26900597 is a FIXED, ' +
    'N-independent definite integral; the imp-3026/imp-3070 cusp constant C_shock(N) = ' +
    'sqrt(2/(3 log gamma_N)) DECAYS monotonically in N. They agree to ~2.1e-4 at exactly one ' +
    'ladder point (N*=1e4) because the slowly-decaying C_shock(N) slides through the fixed 0.2690 ' +
    'there; the abs diff then GROWS ~213x over the next two decades (2.1e-4 -> 4.5e-2). There is no ' +
    'shared arcsinh(1)/sqrt(2) closed form -- only the bare sqrt(2) atom, used in unrelated ways.',
  nStar: N_STAR,
  regularMass: REGULAR_MASS,                 // (A) ~0.26900597, fixed
  regularMassClosedForm: 'int_{s0+1}^inf [sqrt(2)-arcsinh(1)-e^{-s}]/[cosh(s)-sqrt(2)-s+arcsinh(1)] ds',
  cShockStar: STAR_ROW.cShock,               // (B) ~0.26921807 at N*=1e4
  cShockClosedForm: 'sqrt(2 / (3 log gamma_N))',
  absDiffStar: STAR_ROW.absDiff,             // ~2.12e-4 (the near-miss)
  absDiffBlowupOverLadder: ABS_DIFF_BLOWUP,  // ~213x: agreement destroyed by moving in N
  ladder: ROWS,
  isStructural: false,
  isCoincidence: true,
  sharedAtom: 'sqrt(2) only -- cosh(s0) geometry in (A) vs the bare cusp numerator in (B); no arcsinh(1)/sqrt(2) identity links them',
  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isCrossValidationOnly: true,
    operatorStepUntouched:
      'Pure cross-validation of two degree-0 scalars; the off-diagonal endpoint-Hankel ' +
      'operator step (imp-3066) remains the lone obstruction and is NOT addressed here.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_ASSERTIONS_IMP3126 = [
  {
    id: 'imp3126-regular-mass-matches-imp3106',
    why: 'The regular mass recomputed here must reproduce the imp-3106 export ' +
         'int_{s0+1}^inf phi ds ~0.26900597 (same F, G, Simpson code path). A drift means ' +
         'the imp-3064 reduced F/G algebra was mis-imported.',
    holds: () => Math.abs(REGULAR_MASS - 0.269005971094) < 1e-9,
  },
  {
    id: 'imp3126-c-shock-star-near-miss',
    why: 'At N*=1e4 the closed-form cusp constant C_shock = sqrt(2/(3 log gamma_N)) ~0.26921807 ' +
         'must sit within ~3e-4 of the fixed regular mass -- the near-miss that prompted the ' +
         'cross-check.',
    holds: () =>
      Math.abs(STAR_ROW.cShock - 0.269218069221) < 1e-9 &&
      STAR_ROW.absDiff < 3e-4,
  },
  {
    id: 'imp3126-c-shock-decays-while-mass-is-fixed',
    why: 'THE DISCRIMINATOR: the regular mass is N-independent (identical every row) while ' +
         'C_shock(N) decays strictly along the ladder. If C_shock did not decay the proximity ' +
         'could be structural; its monotone decay through the fixed mass is the coincidence signature.',
    holds: () => {
      for (let i = 1; i < ROWS.length; i++) {
        if (ROWS[i].regularMass !== ROWS[0].regularMass) return false;     // (A) truly fixed
        if (!(ROWS[i].cShock < ROWS[i - 1].cShock)) return false;          // (B) strictly decaying
      }
      return true;
    },
  },
  {
    id: 'imp3126-abs-diff-grows-off-the-near-miss',
    why: 'A structural identity would keep |C_shock(N) - regular mass| ~constant; instead it ' +
         'GROWS monotonically and blows up ~100x+ over the ladder (2.1e-4 -> 4.5e-2). The ' +
         'agreement is confined to the single N*=1e4 point.',
    holds: () => {
      for (let i = 1; i < ROWS.length; i++) {
        if (!(ROWS[i].absDiff > ROWS[i - 1].absDiff)) return false;
      }
      return ABS_DIFF_BLOWUP > 100 &&
        Math.abs(ROWS[ROWS.length - 1].absDiff - 0.045162351501) < 1e-9;
    },
  },
  {
    id: 'imp3126-verdict-is-coincidence-not-structural',
    why: 'VERDICT LOCK: this is a COINCIDENCE (not a structural identity) and pure ' +
         'cross-validation -- not a proof, not a reduction below RH, operator step untouched, ' +
         'PT 0.2 stays SOTA. Blocks any future edit from upgrading the near-miss into a claimed ' +
         'shared closed form or RH-relevant link.',
    holds: () => {
      const r = REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126;
      const c = r.honestCaveat;
      return (
        r.isStructural === false &&
        r.isCoincidence === true &&
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isCrossValidationOnly === true &&
        /Platt-Trudgian/.test(c.sota) &&
        /COINCIDENCE/.test(r.verdict)
      );
    },
  },
];

for (const a of REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_ASSERTIONS_IMP3126) {
  if (!a.holds()) {
    throw new Error('imp-3126-regular-mass-vs-c-shock-coincidence assertion failed: ' + a.id);
  }
}

export default REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126;
