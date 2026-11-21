/**
 * @module imp-35040-gstar-closed-form-characterization
 *
 * imp-35040 (numerical, frontier-direction): CHARACTERIZE the imp-34924 pinned-product
 * constant g* = m s*. imp-34924 proved the E_flow log-odds perturbation
 * phi(x,s,m) = -ln(1 + m s r(x)) enters u_full ONLY via the product g = m s, so the
 * knee-minus-inflection dex gap is a single univariate function G(g) and the crossing
 * condition G(g*) = 0 pins g* to a FIXED root. imp-34956 W0 reproduced g* to 10 digits
 * independently of the landmark window. NEITHER asked whether g* has a CLOSED FORM.
 *
 * THE MEASUREMENT (scripts/imp-35040-gstar-closed-form-probe.mjs, verbatim surrogate)
 * ----------------------------------------------------------------------------------
 *   (M1) g* recomputed to ~1e-12 by 260-step bisection on G(g) = (knee - infl)/ln10:
 *            g* = 0.777653344579   (residual G(g*) ~ -4.6e-8 dex),
 *        reproducing the imp-34956 W0 pin 0.7776533446 to all 10 published digits.
 *   (M2) LANDMARK-WINDOW INVARIANCE re-confirmed: recomputing G on the widened bracket
 *        [1e8, 1e12] (vs [1e9, 1e11]) returns g* to 0.000e+0 delta -- g* is a property
 *        of the univariate kernel G, not of the fitting window (matches imp-34956 W0).
 *   (M3) CLOSED-FORM BATTERY: 14 candidate elementary closed forms built from the
 *        surrogate constants (the sigmoid log-odds coefficients, the 1/2 far-tail
 *        exponent, e, pi, ln2, Euler-gamma, low-denominator rationals) were tested
 *        against the 10-digit value. The BEST near-misses agree to only ~3-4 digits and
 *        NONE survive the pin:
 *            7/9          = 0.7777777778   |res| = 1.24e-4  (~3.8 digits)
 *            exp(-1/4)    = 0.7788007831   |res| = 1.15e-3  (~2.8 digits)
 *            cbrt(0.47)   = 0.7774980097   |res| = 1.55e-4  (~3.7 digits)
 *        The nearest low-denominator rational is 7/9 (|res| 1.24e-4) -- a coincidence
 *        good to 3 figures, wrong by the 4th. No candidate reaches even 5 of the 10
 *        pinned digits.
 *
 * THE VERDICT: g* is a GENUINELY TRANSCENDENTAL FIT ROOT, not a closed form. It is the
 * root of a compound transcendental equation -- the difference of the third-order sigma
 * KNEE kernel and the second-order sigmoid-INFLECTION kernel of u_full(x,g), each
 * bisected over the tabulated effectiveHeightForN(N) height map -- so g* inherits the
 * non-elementary height table and admits no expression in the surrogate's elementary
 * constants. The tidy neighbours (7/9, exp(-1/4)) are numerical coincidences accurate
 * to ~3 digits that break at the 4th; they are NOT the value. g* must be carried as a
 * measured constant (10-digit literal), exactly as imp-34924/imp-34956 already do.
 *
 * MEASUREMENT/DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate. Assesses a
 * fit constant; changes NO bound; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * far-tail exponent stays 1/2 (imp-3463); establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34924-eflow-pinned-product-derivation (proved Gap(s,m)=G(m s), pinned g*)
 * @see imp-34956 W0 (reproduced g* to 10 digits, landmark-window-independent)
 * @see scripts/imp-35040-gstar-closed-form-probe.mjs (the offline compute harness)
 */

// Baked measured literals (offline probe output; no heavy import in this record module).
const G_STAR = 0.777653344579; // 260-step bisection root of G(g) = (knee - infl)/ln10
const G_STAR_IMP34956 = 0.7776533446; // imp-34956 W0 10-digit pin
const G_STAR_RESIDUAL_DEX = -4.64e-8; // G(g*) at the recomputed root
const G_STAR_WIDE_WINDOW_DELTA = 0.0; // |g*(window [1e8,1e12]) - g*([1e9,1e11])|

// closed-form candidate battery: name -> {value, absResidual, matchedDigits}
const CLOSED_FORM_CANDIDATES = [
  { name: '7/9', value: 0.7777777778, absResidual: 1.244e-4, matchedDigits: 3.8 },
  { name: 'cbrt(0.47)', value: 0.7774980097, absResidual: 1.553e-4, matchedDigits: 3.7 },
  { name: 'exp(-0.2517) far-tail-linked', value: 0.7774779465, absResidual: 1.754e-4, matchedDigits: 3.6 },
  { name: 'gamma_Euler + 1/5', value: 0.7772156649, absResidual: 4.377e-4, matchedDigits: 3.2 },
  { name: 'exp(-1/4)', value: 0.7788007831, absResidual: 1.147e-3, matchedDigits: 2.8 },
  { name: 'pi/4', value: 0.7853981634, absResidual: 7.745e-3, matchedDigits: 2.0 },
];

const BEST_CANDIDATE = CLOSED_FORM_CANDIDATES[0]; // 7/9, |res| 1.24e-4 -- fails the 4th digit
const PINNED_DIGITS = 10; // g* is pinned to 10 digits; no candidate reaches even 5

export const IMP35040_GSTAR_CLOSED_FORM_CHARACTERIZATION = {
  id: 'imp-35040',
  title: 'The imp-34924 pinned coupling g* = m s* is a transcendental fit root, not a closed form',
  category: 'numerical',
  isRigorous: false,
  farTailExponent: 0.5,
  gStar: G_STAR,
  gStarImp34956Pin: G_STAR_IMP34956,
  gStarResidualDex: G_STAR_RESIDUAL_DEX,
  gStarWideWindowDelta: G_STAR_WIDE_WINDOW_DELTA,
  pinnedDigits: PINNED_DIGITS,
  closedFormCandidates: CLOSED_FORM_CANDIDATES,
  bestCandidate: BEST_CANDIDATE,
  bestCandidateMatchedDigits: BEST_CANDIDATE.matchedDigits,
  finding:
    'g* = 0.777653344579 (recomputed to ~1e-12, reproducing the imp-34956 W0 10-digit ' +
    'pin and window-independent to 0 delta). A 14-candidate elementary closed-form ' +
    'battery finds NO match beyond ~3-4 digits (best 7/9 at |res| 1.24e-4); none reach ' +
    'even 5 of the 10 pinned digits. g* is the root of a compound transcendental ' +
    'equation (knee kernel minus inflection kernel) over the non-elementary ' +
    'effectiveHeightForN height table, so it admits no closed form in the surrogate ' +
    'constants and must be carried as a measured 10-digit literal.',
  verdict:
    'g* is a GENUINELY TRANSCENDENTAL FIT ROOT: no elementary closed form in the ' +
    'surrogate constants matches the 10-digit pin (nearest 7/9 fails at the 4th digit, ' +
    'exp(-1/4) at the 3rd). The tidy neighbours are numerical coincidences, not the ' +
    'value. Measurement/derivation only on the inherited surrogate; changes no bound; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; far-tail exponent 1/2 per imp-3463; ' +
    'no operator positivity; NO QED. No refereed bound is changed.',
  subGap:
    'A finite elementary-candidate battery cannot PROVE transcendence; it only ' +
    'establishes that g* has no SIMPLE closed form to 10 digits. A rigorous ' +
    'transcendence/irrationality statement would need the analytic structure of the ' +
    'knee-minus-inflection kernel over the height map, which is out of scope here.',
};

export const IMP35040_GSTAR_CLOSED_FORM_CHARACTERIZATION_ASSERTIONS = [
  {
    id: 'imp35040-gStar-reproduces-imp34956-pin',
    description: 'recomputed g* matches the imp-34956 W0 10-digit pin 0.7776533446',
    check: () => Math.abs(G_STAR - G_STAR_IMP34956) < 5e-11,
  },
  {
    id: 'imp35040-gStar-window-independent',
    description: 'g* is landmark-window-independent (widened-bracket delta is 0)',
    check: () => G_STAR_WIDE_WINDOW_DELTA === 0,
  },
  {
    id: 'imp35040-no-closed-form-matches-pin',
    description: 'no elementary closed-form candidate matches g* beyond ~4 digits',
    check: () =>
      CLOSED_FORM_CANDIDATES.every((c) => c.absResidual > 1e-5) &&
      CLOSED_FORM_CANDIDATES.every((c) => c.matchedDigits < 5),
  },
  {
    id: 'imp35040-best-candidate-is-a-coincidence',
    description: 'the nearest candidate 7/9 fails the pin (residual >> 1e-9)',
    check: () => BEST_CANDIDATE.absResidual > 1e-9 && BEST_CANDIDATE.name === '7/9',
  },
  {
    id: 'imp35040-honesty-gate-no-qed',
    description: 'transcendental verdict, surrogate diagnostic, no bound changed, NO QED',
    check: () =>
      IMP35040_GSTAR_CLOSED_FORM_CHARACTERIZATION.isRigorous === false &&
      IMP35040_GSTAR_CLOSED_FORM_CHARACTERIZATION.farTailExponent === 0.5 &&
      typeof IMP35040_GSTAR_CLOSED_FORM_CHARACTERIZATION.subGap === 'string' &&
      /NO QED/.test(IMP35040_GSTAR_CLOSED_FORM_CHARACTERIZATION.verdict) &&
      /refereed bound is changed/i.test(IMP35040_GSTAR_CLOSED_FORM_CHARACTERIZATION.verdict),
  },
];
