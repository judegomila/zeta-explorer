/**
 * @module imp-35888-req4-required-height-multiple-reaches-1x
 *
 * imp-35888 (accuracy, measurement): LOCATE the sigma, N and log T0 at which the imp-35853
 * REQ-4 required-height multiple 200 / log T0 crosses BELOW 1x -- the height where the
 * imp-35538 REQ-4 binding log T0 >= 200 is actually MET -- continuing the imp-35853 sigma
 * sweep past the ~6.96x Platt-Trudgian anchor toward smaller sigma / larger downslope N.
 *
 * imp-35853 tabulated the continuous required-height multiple 200 / log T0 versus sigma and
 * found it does NOT asymptote onto the ~6.96x PT-anchor value: it keeps DESCENDING for smaller
 * sigma / larger height, and imp-35853 stopped the sweep at the PT anchor (log T0 ~ 28.73,
 * sigma ~ 0.019, multiple ~ 6.96x) without ever locating where the multiple reaches the
 * binding 1x. This module continues the same imp-3406 / imp-33582 sub-term surrogate
 * (sigma = E_coll / (E_trunc + E_flow + E_coll), log T0 = log(effectiveHeightForN(N)) on the
 * shared imp-3220 / imp-3406 Riemann-von Mangoldt surrogate) down the downslope and bisects
 * the N at which log T0 = 200 exactly (multiple = 200 / log T0 = 1).
 *
 * WHAT THE CONTINUATION SHOWS (the honest finding). The multiple = 1x binding is met only at a
 * COMPLETELY unreachable height: N ~ 2.27e88 zeros, log T0 = 200, T0 = e^200 ~ 7.23e86
 * (confirming continuity with the imp-35538 e^200 REQ-4 figure to full double precision), and
 * there the collision share has collapsed to sigma ~ 1.18e-39 -- essentially zero. So the
 * descent imp-35853 flagged continues smoothly and monotonically all the way to 1x, but the
 * required height is met only where the collision term E_coll ~ 3.6e-44 is astronomically
 * dominated by the fixed E_trunc = 3.06e-5 (sigma ~ E_coll / E_trunc ~ 1e-39). A continuation
 * table from the PT anchor (multiple ~ 6.96x) down to the 1x binding is exported: at every
 * reachable interior sigma the multiple stays well above 1x, and it only touches 1x at a
 * sigma more than 37 orders of magnitude below the PT-anchor sigma. This makes explicit that
 * "log T0 >= 200 met" is not a finite-N target on this surrogate -- it lives at an
 * e^200-height, sigma ~ 0 corner of the model.
 *
 * Measurement / tabulation only on the existing imp-35853 surrogate; re-reads the imp-33582
 * model and the imp-35538 binding log-height on the same imp-3220 / imp-3406 surrogate;
 * derives no remainder; discharges nothing; changes no bound; establishes no operator
 * positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and
 * C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35853-req4-required-height-continuous-sigma-knee (source sweep continued here)
 * @see imp-35813-req4-required-height-sigma-landmark-extend (discrete rungs)
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 4; binding log-height 200, e^200)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source model; peak sigma_max ~ 0.9494)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';
import { IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE } from './imp-35853-req4-required-height-continuous-sigma-knee.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// REQ-4 binding log-height: 1/log T0 <= 0.005 => log T0 >= 200 (imp-35538).
const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;
const LOG_T0_NEEDED = HR.logT0NeededForHalfPctBudget; // 200

// EXACT imp-3406 / imp-3529 / imp-33582 sub-terms (identical to imp-35853; no re-derivation).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, sigma: E_coll / E_N, logT0: L, E_flow, E_coll, E_N };
}

// Bisect the downslope N whose surrogate log-height equals a target log T0 (monotone in N).
function nForLogT0(target) {
  let a = Math.log(1e6);
  let b = Math.log(1e120);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).logT0 < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The 1x binding: multiple = 200 / log T0 = 1 <=> log T0 = 200 <=> T0 = e^200 ~ 7.23e86.
const N_1X = nForLogT0(LOG_T0_NEEDED); // ~2.27e88
const P_1X = parts(N_1X);
const SIGMA_1X = P_1X.sigma; // ~1.18e-39
const MULT_1X = LOG_T0_NEEDED / P_1X.logT0; // == 1 to full precision

// PT anchor reference (where imp-35853 stopped) for the continuity check.
const LOG_T0_PT = Math.log(3e12); // ~28.7298
const MULT_PT = LOG_T0_NEEDED / LOG_T0_PT; // ~6.9614

// Continuation table: the multiple descending from the PT anchor (~6.96x) down to the 1x
// binding, one row per target multiple. Shows the monotone descent past the anchor and the
// astronomical N / vanishing sigma at which 1x is finally reached.
const TARGET_MULTIPLES = [6.9614, 5, 4, 3, 2, 1.5, 1.25, 1.1, 1.0];
const continuationTable = TARGET_MULTIPLES.map((mult) => {
  const L = LOG_T0_NEEDED / mult;
  const N = nForLogT0(L);
  const p = parts(N);
  return {
    multiple: +mult.toFixed(4),
    logT0: +p.logT0.toFixed(3),
    N: +N.toExponential(3),
    sigma: +p.sigma.toExponential(3),
    isBinding: Math.abs(mult - 1) < 1e-9,
    isPtAnchor: Math.abs(mult - MULT_PT) < 5e-3,
  };
});

export const IMP35888_REQ4_REQUIRED_HEIGHT_MULTIPLE_REACHES_1X = {
  id: 'imp-35888',
  proofSection: 'S-frontier',
  question:
    'Continuing the imp-35853 REQ-4 required-height multiple 200 / log T0 sweep past the ~6.96x ' +
    'Platt-Trudgian anchor toward smaller sigma / larger downslope N (the multiple keeps descending ' +
    'rather than asymptoting), at what sigma, N and log T0 does the multiple finally cross BELOW 1x -- ' +
    'the height where the imp-35538 REQ-4 binding log T0 >= 200 is actually met?',
  method:
    'Reuse the exact imp-3406 / imp-33582 sub-terms (sigma = E_coll / (E_trunc + E_flow + E_coll), ' +
    'log T0 = log(effectiveHeightForN(N)) on the imp-3220 / imp-3406 RvM surrogate) and bisect the ' +
    'downslope N at which log T0 = 200 exactly (multiple = 200 / log T0 = 1); read off sigma there and ' +
    'confirm T0 = e^200 continuity with the imp-35538 figure; tabulate the descent from the PT anchor ' +
    '(~6.96x) down to the 1x binding.',
  logT0Needed: LOG_T0_NEEDED, // 200
  ptAnchorMultiple: +MULT_PT.toFixed(4), // ~6.9614 (where imp-35853 stopped)
  bindingReachedAt: {
    multiple: +MULT_1X.toFixed(6), // 1.0
    logT0: +P_1X.logT0.toFixed(6), // 200
    T0: +P_1X.T0.toExponential(4), // ~7.226e86 == e^200
    N: +N_1X.toExponential(4), // ~2.267e88
    sigma: +SIGMA_1X.toExponential(4), // ~1.178e-39
    E_coll: +P_1X.E_coll.toExponential(3),
    E_trunc: E_TRUNC_PT,
  },
  // e^200 continuity with the imp-35538 REQ-4 figure (T0 = e^200 ~ 7.23e86 at the 1x binding).
  eTo200: +Math.exp(200).toExponential(4),
  eTo200MatchesBindingT0: Math.abs(P_1X.T0 / Math.exp(200) - 1) < 1e-9,
  continuationTable,
  // The honest finding: the multiple descends monotonically from ~6.96x straight to 1x with no
  // asymptote; 1x is met only at N ~ 2.27e88 where the collision share sigma ~ 1e-39 (essentially
  // zero, E_coll astronomically below the fixed E_trunc). Not a finite-N target on this surrogate.
  bindingIsAtVanishingSigma: SIGMA_1X < 1e-30,
  sigmaDropOrdersFromPtAnchor: +Math.log10(IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.ptAnchor.sigma / SIGMA_1X).toFixed(2),
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Continuing the imp-35853 required-height multiple 200 / log T0 sweep ' +
    'past the ~6.96x Platt-Trudgian anchor: the multiple descends monotonically with NO asymptote and ' +
    'reaches the 1x binding (log T0 = 200, i.e. log T0 >= 200 met) only at N ~ 2.27e88 zeros, ' +
    'T0 = e^200 ~ 7.23e86 (matching the imp-35538 REQ-4 e^200 figure to full double precision), where ' +
    'the collision share has collapsed to sigma ~ 1.18e-39 -- essentially zero, since there ' +
    'E_coll ~ 3.6e-44 is astronomically dominated by the fixed E_trunc = 3.06e-5. So "log T0 >= 200 met" ' +
    'is not a finite-N target on this surrogate: every reachable interior sigma still needs more than 1x ' +
    'the log-height, and the binding lives at an e^200-height, sigma ~ 0 corner of the model, more than ' +
    '37 orders of magnitude in sigma below the PT anchor. Measurement / tabulation only on the imp-35853 ' +
    'surrogate; re-reads the imp-33582 model and the imp-35538 binding log-height; derives no remainder; ' +
    'discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are ' +
    'UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35853 (continuous sigma sweep continued here); imp-35813 / imp-35763 / imp-35722 (rungs / ladders); ' +
    'imp-35538 (REQ 4; binding log-height 200, T0 = e^200); imp-33582 (sigma-decay model; peak ' +
    'sigma_max ~ 0.9494); imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: ' +
    'Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35888_REQ4_REQUIRED_HEIGHT_MULTIPLE_REACHES_1X_ASSERTIONS = [
  {
    // (1) the multiple reaches exactly 1x at log T0 = 200 (the REQ-4 binding).
    id: 'imp35888-multiple-1x-at-logT0-200',
    description: 'multiple = 200 / log T0 = 1 exactly at log T0 = 200 (REQ-4 binding met)',
    holds: () => Math.abs(MULT_1X - 1) < 1e-9 && Math.abs(P_1X.logT0 - 200) < 1e-6,
  },
  {
    // (2) e^200 continuity: T0 at the 1x binding equals e^200 ~ 7.23e86 (imp-35538 REQ-4 figure).
    id: 'imp35888-eTo200-continuity-with-imp35538',
    description: 'T0 at the 1x binding = e^200 ~ 7.23e86, matching the imp-35538 REQ-4 figure',
    holds: () =>
      IMP35888_REQ4_REQUIRED_HEIGHT_MULTIPLE_REACHES_1X.eTo200MatchesBindingT0 === true &&
      Math.abs(P_1X.T0 / 7.226e86 - 1) < 1e-3,
  },
  {
    // (3) the binding N is astronomically large (~2.27e88) -- far past any reachable height.
    id: 'imp35888-binding-N-astronomical',
    description: 'N at the 1x binding ~ 2.27e88 zeros, far past the PT anchor N ~ 1.24e13',
    holds: () => Math.abs(N_1X / 2.267e88 - 1) < 5e-3 && N_1X > 1e80,
  },
  {
    // (4) the collision share sigma at the 1x binding has collapsed to ~1e-39 (essentially zero).
    id: 'imp35888-binding-sigma-vanishing',
    description: 'sigma at the 1x binding ~ 1.18e-39 -- collision share collapsed, E_coll << E_trunc',
    holds: () =>
      Math.abs(SIGMA_1X / 1.178e-39 - 1) < 5e-3 &&
      IMP35888_REQ4_REQUIRED_HEIGHT_MULTIPLE_REACHES_1X.bindingIsAtVanishingSigma === true &&
      P_1X.E_coll < E_TRUNC_PT,
  },
  {
    // (5) the sigma at 1x is more than 37 orders of magnitude below the imp-35853 PT-anchor sigma.
    id: 'imp35888-sigma-drop-37-orders-below-pt',
    description: 'sigma drops > 37 orders of magnitude from the imp-35853 PT-anchor sigma ~ 0.019 to ~1e-39',
    holds: () => IMP35888_REQ4_REQUIRED_HEIGHT_MULTIPLE_REACHES_1X.sigmaDropOrdersFromPtAnchor > 37,
  },
  {
    // (6) the continuation table descends monotonically from the PT anchor (~6.96x) to the 1x binding,
    //     and every row is internally consistent (multiple * log T0 = 200).
    id: 'imp35888-continuation-table-monotone-consistent',
    description: 'continuation table descends monotonically from ~6.96x to 1x; every row satisfies multiple * log T0 ~ 200',
    holds: () => {
      const t = continuationTable;
      const monotone = t.every((r, i) => i === 0 || r.multiple < t[i - 1].multiple);
      const consistent = t.every((r) => Math.abs(r.multiple * r.logT0 - 200) < 0.05);
      const endsAt1x = Math.abs(t[t.length - 1].multiple - 1) < 1e-6 && t[t.length - 1].isBinding === true;
      const sigmasDescend = t.every((r, i) => i === 0 || r.sigma < t[i - 1].sigma);
      return monotone && consistent && endsAt1x && sigmasDescend && t.length === TARGET_MULTIPLES.length;
    },
  },
  {
    // (7) reuses the identical imp-35853 sub-terms: the PT-anchor multiple here matches imp-35853.
    id: 'imp35888-reuses-imp35853-subterms',
    description: 'PT-anchor multiple ~ 6.96x matches the imp-35853 PT anchor -- identical sub-terms in use',
    holds: () =>
      Math.abs(MULT_PT - IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.ptAnchor.multiple) < 5e-3 &&
      Math.abs(MULT_PT - 6.9614) < 5e-3,
  },
  {
    // (8) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, imp-486 kept, NO QED.
    id: 'imp35888-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35888_REQ4_REQUIRED_HEIGHT_MULTIPLE_REACHES_1X;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35888_REQ4_REQUIRED_HEIGHT_MULTIPLE_REACHES_1X_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35888-req4-required-height-multiple-reaches-1x assertion failed: ${a.id}`);
  }
}
