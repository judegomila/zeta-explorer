/**
 * @module imp-35571-route-i-subleading-rate-scope
 *
 * imp-35571 (proof/assessment, S-frontier): LITERATURE-SCOPE whether any GUE
 * local law carries a SUBLEADING finite-N rate strictly better than the natural
 * leading O(1/log T0) rate that imp-35538 REQ-2/REQ-4 identify, and QUANTIFY by
 * how much such a rate would lower the log T0 >= 200 (T0 >= e^200 ~ 7.23e86)
 * height threshold that REQ-4 pins for the imp-35475 Part-C 0.5% relative
 * crossover budget. Where imp-35493 surveyed the literature for the LEADING
 * remainder and imp-35538 enumerated the derivation requirements, this module
 * addresses the ONE sub-question REQ-4 names but never scopes: is the e^200
 * threshold an artifact of the LEADING rate, and would a proved subleading rate
 * dissolve it?
 *
 * ASSESSMENT / SCOPING ONLY. Derives NO remainder; discharges NOTHING; changes
 * no bound; tightens no bound; establishes no operator positivity; no RH
 * verdict, NO QED. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the
 * E_trunc = 3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED. No refereed bound is changed.
 *
 * THE THRESHOLD-COLLAPSE ARITHMETIC (a subleading rate would dissolve e^200)
 * -----------------------------------------------------------------------------
 * REQ-4 pins log T0 >= 200 because the NATURAL leading rate is O(1/log T0):
 * hitting the 0.5% relative crossover budget B = 0.005 needs 1/log T0 <= B, i.e.
 * log T0 >= 1/B = 200. Two candidate SUBLEADING families and what they need:
 *   (A) POLY-LOG  O(1/(log T0)^a), a > 1:  (log T0)^a >= 1/B, i.e.
 *       log T0 >= (1/B)^(1/a) = 200^(1/a).
 *         a = 1   (baseline):  log T0 >= 200
 *         a = 1.5:             log T0 >= 34.20   (5.85x lower threshold)
 *         a = 2:               log T0 >= 14.14   (14.1x lower)
 *         a = 3:               log T0 >= 5.85    (34.2x lower)
 *   (B) POWER-LAW  O(T0^{-delta}), delta > 0:  T0^{-delta} <= B, i.e.
 *       log T0 >= ln(1/B)/delta = 5.2983/delta.
 *         delta = 0.25:        log T0 >= 21.19   (9.4x lower)
 *         delta = 0.5:         log T0 >= 10.60   (18.9x lower)
 *         delta = 1:           log T0 >= 5.30    (37.8x lower)
 * The landmark log-heights are ~13.23 (peak) and ~20.86 (crossover), and
 * log T_PT ~ 28.73. So even a modest a = 2 poly-log upgrade drops the required
 * log-height from 200 to ~14.14 -- JUST above the peak (13.23) and BELOW both the
 * crossover (20.86) and the PT anchor (28.73). A power-law rate with delta as
 * small as ~0.254 already puts the threshold at the crossover height. NET: the
 * astronomical e^200 threshold is ENTIRELY an artifact of the LEADING O(1/log T0)
 * rate; any proved subleading (a > 1, or any delta > 0) rate would collapse it
 * into (or near) the landmark-height regime.
 *
 * IS ANY SUBLEADING RATE PROVED FOR THE ZETA ZEROS? -- NO
 * -----------------------------------------------------------------------------
 * TIER A -- ZETA-ZERO statistics (what route-(i) actually needs): NO rate at all.
 *   Montgomery (1973) pair-correlation and Rudnick-Sarnak (1996) n-level
 *   correlations are ASYMPTOTIC-only for restricted Fourier support |alpha| < 1
 *   -- they carry NO explicit finite-T rate, LEADING or subleading (imp-35493
 *   Tier 1, imp-35538 REQ-2). A fortiori there is NO PROVED subleading rate for
 *   the zeta local statistics. The finite-T lower-order structure (Berry 1988
 *   number-variance, Bogomolny-Keating 1996 arithmetic form-factor corrections,
 *   Conrey-Snaith 2007 ratios) predicts corrections of natural LEADING size
 *   ~1/log(T0/2pi) and is itself HEURISTIC (Hardy-Littlewood-conditional). So the
 *   zeta side offers neither a leading nor a subleading proved rate.
 * TIER B -- the GUE RANDOM-MATRIX ENSEMBLE (proved, but does not transfer): YES,
 *   POWER-LAW rates. Optimal eigenvalue rigidity holds to scale N^{-1+eps}
 *   (Erdos-Schlein-Yau, Erdos-Yau-Yin) and bulk universality carries polynomial
 *   rates -- these ARE subleading (power-law in matrix size), far better than
 *   1/log. BUT they are theorems about the ensemble; transferring a power-law
 *   ensemble rate to the zeta-zero statistics IS EXACTLY Montgomery pair-
 *   correlation (and stronger n-level) -- CONJECTURAL (imp-35538 REQ-3). The
 *   proved power-law rate lives on the wrong object.
 *
 * NET: a subleading rate WOULD lower the REQ-4 threshold dramatically -- an a = 2
 * poly-log rate collapses log T0 >= 200 to ~14.14, into the landmark regime, and
 * a power-law rate collapses it further -- so the e^200 wall is an artifact of the
 * LEADING rate, NOT a fundamental barrier. BUT no subleading rate is PROVED for
 * the zeta zeros: the rigorous zeta pair-correlation results carry no finite-T
 * rate at all, and the proved power-law rates belong to the GUE ensemble whose
 * transfer to zeta is the conjectural Montgomery step. So REQ-4 e^200 STANDS as
 * the honest state on the natural rate, and closing the subleading-rate gap is a
 * Montgomery-conjecture-scale advance, not an available lever. Route-(ii) (the
 * imp-35488 two-height data-anchored spot check, both landmark heights below
 * T_PT = 3e12) remains the only viable partial for the OPEN imp-35337a.
 * Assessment/scoping only; discharges nothing; changes no bound; no positivity;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ-2 explicit-rate crux, REQ-4 log T0 >= 200 threshold this module probes)
 * @see imp-35493-route-i-remainder-literature-scope (leading-rate survey; this module scopes the SUBLEADING sub-question)
 * @see imp-35551-route-i-requirement-severity-ranking (ranks REQ-2 > REQ-4; a subleading rate would move REQ-4)
 * @see imp-35475-sigma-fidelity-closure-scope (Part C the 0.5% crossover budget; Part D imp-486)
 * @see imp-35488-route-ii-two-height-gtrue-spotcheck (route-(ii) partial for imp-35337a)
 * @see imp-486 (GUE-conditional caveat inherited by any pair-correlation remainder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.38374752 (imp-2642/imp-2643 ansatz)
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any subleading-rate scoping)
const T_PT = 3e12; // Platt-Trudgian verified height

// The two interior landmark N values (imp-35337 / imp-35475), taken as given.
const N_PEAK = 9.2186e5; // interior flat-cap sigma PEAK
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER

// The tightest imp-35475 Part-C budget a route-(i) remainder must meet.
const CROSS_ECOLL_REL_BUDGET = 0.005; // 0.5% relative E_coll fidelity

// Landmark / anchor log-heights (recomputed from the RvM surrogate, matching imp-35538).
const LOG_T0_PEAK = Math.log(effectiveHeightForN(N_PEAK)); // ~13.2309
const LOG_T0_CROSS = Math.log(effectiveHeightForN(N_CROSS)); // ~20.8576
const LOG_T_PT = Math.log(T_PT); // ~28.7296

// Baseline: the natural LEADING O(1/log T0) rate needs log T0 >= 1/B = 200 (imp-35538 REQ-4).
const LOG_T0_NEEDED_LEADING = 1 / CROSS_ECOLL_REL_BUDGET; // 200
const LN_INV_BUDGET = Math.log(1 / CROSS_ECOLL_REL_BUDGET); // ln(200) ~ 5.29832

// Poly-log rate O(1/(log T0)^a): needs log T0 >= (1/B)^(1/a) = 200^(1/a).
const logT0NeededPolylog = (a) => Math.pow(1 / CROSS_ECOLL_REL_BUDGET, 1 / a);
// Power-law rate O(T0^{-delta}): needs log T0 >= ln(1/B)/delta.
const logT0NeededPower = (delta) => LN_INV_BUDGET / delta;

// The candidate subleading rates, each with the log-height threshold it would imply
// and the reduction factor versus the leading-rate baseline of 200.
const CANDIDATES = [
  { family: 'poly-log', form: 'O(1/(log T0)^a)', param: 'a', value: 1.5, logT0Needed: logT0NeededPolylog(1.5) },
  { family: 'poly-log', form: 'O(1/(log T0)^a)', param: 'a', value: 2, logT0Needed: logT0NeededPolylog(2) },
  { family: 'poly-log', form: 'O(1/(log T0)^a)', param: 'a', value: 3, logT0Needed: logT0NeededPolylog(3) },
  { family: 'power-law', form: 'O(T0^{-delta})', param: 'delta', value: 0.25, logT0Needed: logT0NeededPower(0.25) },
  { family: 'power-law', form: 'O(T0^{-delta})', param: 'delta', value: 0.5, logT0Needed: logT0NeededPower(0.5) },
  { family: 'power-law', form: 'O(T0^{-delta})', param: 'delta', value: 1, logT0Needed: logT0NeededPower(1) },
].map((c) => ({
  ...c,
  logT0Needed: +c.logT0Needed.toFixed(4),
  reductionVsLeading: +(LOG_T0_NEEDED_LEADING / c.logT0Needed).toFixed(2),
  belowCrossoverHeight: c.logT0Needed < LOG_T0_CROSS,
  belowPTAnchor: c.logT0Needed < LOG_T_PT,
}));

// The a = 2 poly-log rate is the headline: it drops the threshold to ~14.14, into the landmark regime.
const A2 = CANDIDATES.find((c) => c.family === 'poly-log' && c.value === 2);

export const IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE = {
  id: 'imp-35571',
  proofSection: 'S-frontier',
  question:
    'imp-35538 REQ-4 pins the route-(i) remainder height requirement at log T0 >= 200 (T0 >= e^200 ~ 7.23e86) ' +
    'because the natural LEADING GUE local-law rate is O(1/log T0) (imp-35493). ASSESS the literature for any ' +
    'local law / n-level-correlation theorem carrying a strictly SUBLEADING explicit rate (O(1/(log T0)^a), ' +
    'a > 1, or T0^{-delta}), QUANTIFY the log-height threshold each would imply for the imp-35475 Part-C 0.5% ' +
    'crossover budget, and STATE whether any such rate is proved (vs conjectural). Scoping/assessment only; ' +
    'derives no remainder; discharges nothing; changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'NO QED.',
  thresholdCollapse: {
    leadingRateThreshold:
      'The natural LEADING rate O(1/log T0) needs 1/log T0 <= B = 0.005, i.e. log T0 >= 1/B = 200 (imp-35538 ' +
      'REQ-4, T0 >= e^200 ~ 7.23e86).',
    subleadingFormulae:
      'A poly-log rate O(1/(log T0)^a) needs log T0 >= (1/B)^(1/a) = 200^(1/a); a power-law rate O(T0^{-delta}) ' +
      'needs log T0 >= ln(1/B)/delta = 5.2983/delta. Both collapse the 200 threshold: a = 2 gives ~14.14 ' +
      '(14.1x lower), a = 3 gives ~5.85, delta = 0.25 gives ~21.19, delta = 1 gives ~5.30.',
    headlineA2:
      'The a = 2 poly-log rate drops the required log-height from 200 to ~14.14 -- JUST above the peak ' +
      'log-height ~13.23 and BELOW both the crossover ~20.86 and the PT anchor ~28.73. So the e^200 wall is ' +
      'ENTIRELY an artifact of the LEADING O(1/log T0) rate, not a fundamental barrier: any proved subleading ' +
      'rate would collapse it into (or near) the landmark-height regime.',
    candidates: CANDIDATES,
    logT0NeededLeading: LOG_T0_NEEDED_LEADING, // 200
    logT0Peak: +LOG_T0_PEAK.toFixed(4), // ~13.2309
    logT0Cross: +LOG_T0_CROSS.toFixed(4), // ~20.8576
    logT_PT: +LOG_T_PT.toFixed(4), // ~28.7296
    crossEcollRelBudget: CROSS_ECOLL_REL_BUDGET, // 0.005
  },
  provedStatus: {
    tierAZetaZeros:
      'TIER A -- the ZETA-ZERO statistics route-(i) actually needs: NO rate at all. Montgomery (1973) ' +
      'pair-correlation and Rudnick-Sarnak (1996) n-level correlations are ASYMPTOTIC-only for restricted ' +
      'Fourier support |alpha| < 1 and carry NO explicit finite-T rate, LEADING or subleading. A fortiori NO ' +
      'proved subleading rate exists for the zeta local statistics. The finite-T structure (Berry 1988, ' +
      'Bogomolny-Keating 1996, Conrey-Snaith 2007) predicts corrections of natural LEADING size ~1/log(T0/2pi) ' +
      'and is HEURISTIC (Hardy-Littlewood-conditional).',
    tierBGueEnsemble:
      'TIER B -- the GUE RANDOM-MATRIX ENSEMBLE: YES, POWER-LAW rates are PROVED (optimal rigidity to scale ' +
      'N^{-1+eps}, Erdos-Schlein-Yau / Erdos-Yau-Yin; bulk universality with polynomial rates) -- far better ' +
      'than 1/log. BUT they are theorems about the ENSEMBLE; transferring a power-law ensemble rate to the ' +
      'zeta-zero statistics IS EXACTLY the Montgomery pair-correlation (and stronger n-level) conjecture -- ' +
      'CONJECTURAL (imp-35538 REQ-3). The proved power-law rate lives on the wrong object.',
    net:
      'A subleading rate WOULD dissolve the REQ-4 e^200 threshold (a = 2 poly-log collapses it to ~14.14, a ' +
      'power-law further), so the wall is a LEADING-rate artifact -- BUT no subleading rate is PROVED for the ' +
      'zeta zeros. The rigorous zeta pair-correlation results carry no finite-T rate at all, and the proved ' +
      'power-law rates belong to the GUE ensemble whose transfer to zeta is the conjectural Montgomery step. ' +
      'So REQ-4 e^200 STANDS on the natural rate; closing the subleading-rate gap is a Montgomery-conjecture-' +
      'scale advance, not an available lever. Route-(ii) (imp-35488) remains the only viable partial for the ' +
      'OPEN imp-35337a.',
    anySubleadingRateProvedForZeta: false,
    L_pt_unchanged: L_PT, // 0.2
  },
  C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction subleading-rate survey, NOT rigorous). Probing the ONE ' +
    'sub-question imp-35538 REQ-4 names but never scopes -- is the log T0 >= 200 (T0 >= e^200 ~ 7.23e86) ' +
    'height threshold an artifact of the LEADING O(1/log T0) rate, and would a proved subleading rate ' +
    'dissolve it? QUANTIFICATION: a poly-log rate O(1/(log T0)^a) needs log T0 >= 200^(1/a) and a power-law ' +
    'rate O(T0^{-delta}) needs log T0 >= 5.2983/delta, so an a = 2 rate collapses the threshold from 200 to ' +
    '~14.14 (14.1x lower) -- just above the peak log-height ~13.23 and below both the crossover ~20.86 and ' +
    'the PT anchor ~28.73 -- and a power-law rate collapses it further. The e^200 wall is therefore ENTIRELY ' +
    'a LEADING-rate artifact, not a fundamental barrier. PROVED STATUS: NO subleading rate is proved for the ' +
    'zeta zeros -- the rigorous pair-correlation results (Montgomery 1973 restricted-support, Rudnick-Sarnak ' +
    '1996) are asymptotic-only and carry no finite-T rate at all, and the PROVED power-law rates (GUE ensemble ' +
    'optimal rigidity N^{-1+eps}, Erdos-Schlein-Yau / Erdos-Yau-Yin) live on the ENSEMBLE, whose transfer to ' +
    'zeta is exactly the conjectural Montgomery step (imp-35538 REQ-3). So REQ-4 e^200 STANDS on the natural ' +
    'rate and closing the subleading-rate gap is a Montgomery-conjecture-scale advance, not an available ' +
    'lever; route-(ii) (the imp-35488 two-height data check, both landmark heights below T_PT = 3e12) remains ' +
    'the only viable partial for the OPEN imp-35337a. Derives NO remainder; discharges NOTHING; changes no ' +
    'bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = ' +
    '3.06e-5 (imp-2631), the imp-398 C_F prefactor and C_mb GUE-conditional (imp-486) are UNTOUCHED; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35538 (REQ-2 explicit-rate crux, REQ-4 log T0 >= 200 threshold this module probes, REQ-3 the ' +
    'conjectural transfer); imp-35493 (leading-rate literature survey); imp-35551 (ranks REQ-2 > REQ-4); ' +
    'imp-35475 (Part C the 0.5% crossover budget, Part D imp-486); imp-35488 (route-(ii) two-height partial ' +
    'for imp-35337a); imp-35337 (names imp-35337a); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz, ' +
    'C_H = 1/8); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse); Platt-Trudgian 2021 (T_PT = 3e12). ' +
    'Literature: Montgomery (1973); Rudnick-Sarnak (1996); Berry (1988); Bogomolny-Keating (1996); ' +
    'Conrey-Snaith (2007); Erdos-Schlein-Yau; Erdos-Yau-Yin (GUE ensemble optimal rigidity, power-law rate).',
};

export const IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE_ASSERTIONS = [
  {
    // (1) threshold-collapse arithmetic: a subleading rate collapses log T0 >= 200 into the landmark regime.
    id: 'imp35571-subleading-rate-collapses-threshold',
    description: 'a poly-log a=2 rate collapses the log T0 >= 200 threshold to ~14.14 (14.1x lower), just above the peak log-height and below the crossover and PT anchor; a power-law rate collapses it further',
    holds: () =>
      LOG_T0_NEEDED_LEADING === 200 &&
      A2.logT0Needed > 14 && A2.logT0Needed < 15 && // a=2 -> ~14.14
      A2.reductionVsLeading > 13 && A2.reductionVsLeading < 15 && // ~14.1x lower
      A2.logT0Needed > LOG_T0_PEAK && // just above the peak log-height ~13.23
      A2.logT0Needed < LOG_T0_CROSS && A2.logT0Needed < LOG_T_PT && // below crossover ~20.86 and PT ~28.73
      CANDIDATES.every((c) => c.reductionVsLeading > 1) && // every subleading candidate lowers the threshold
      logT0NeededPower(1) < 6 && logT0NeededPower(1) > 5, // power-law delta=1 -> ~5.30
  },
  {
    // (2) proved-status honesty: no subleading rate is PROVED for the zeta zeros; the power-law rate is ENSEMBLE-only.
    id: 'imp35571-no-proved-subleading-rate-for-zeta',
    description: 'the zeta pair-correlation results carry no finite-T rate at all, and the proved power-law rates belong to the GUE ensemble whose transfer to zeta is the conjectural Montgomery step',
    holds: () =>
      IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.provedStatus.anySubleadingRateProvedForZeta === false &&
      /ASYMPTOTIC-only|NO explicit finite-T rate|NO rate at all/i.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.provedStatus.tierAZetaZeros) &&
      /ENSEMBLE|Montgomery/.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.provedStatus.tierBGueEnsemble) &&
      /Montgomery-conjecture-scale/.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.provedStatus.net) &&
      Math.abs(C_C - 0.38374752) < 1e-6, // C_C ansatz constant untouched
  },
  {
    // (3) honesty gate: conditional, inherits imp-486, no bound moves, no refereed bound is changed, sub-gap named; NO QED.
    id: 'imp35571-conditional-no-bound-moves-no-qed',
    description: 'route-(i) stays imp-486 GUE-conditional, sigma-fidelity is not a Lambda lever so no bound moves, PT 0.2 unchanged, imp-35337a named, NO QED',
    holds: () =>
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.isRigorous === false &&
      IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.isUnconditional === false &&
      /imp-486/.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.citation) &&
      /imp-35337a/.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.citation) &&
      /NO QED/.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.verdict),
  },
];

for (const a of IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35571-route-i-subleading-rate-scope assertion failed: ${a.id}`);
  }
}
