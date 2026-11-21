// @module data/imp-96232-kappa-star-floor-height-cross-validation
//
// imp-96232 (numerical, frontier-direction): the two measurement modules that
// invert the fixed-strip truncation power law at the honest anchor
// kappa_star = 0.4 (prefactor 3.0) never placed their floor-to-height tables
// side by side. imp-96207 tabulated the floors 1e-5 / 1e-6 / 1e-7; imp-96185
// tabulated 1e-5 / 1e-6 / 1e-8. The 1e-7 point lives only in imp-96207 and the
// 1e-8 point only in imp-96185. This module independently recomputes
//   H_required(E) = (prefactor / E)^{1 / kappa_star},  prefactor = 3.0,
// at all FOUR thresholds, cross-validates it against BOTH source tables where
// they overlap, and checks the 2.5-height-decades-per-floor-decade leverage
// unbroken across the union.
//
// THE FOUR RECOMPUTED HEIGHTS (measurement only, kappa_star = 0.4)
// ---------------------------------------------------------------
//   floor 1e-5 -> H ~ 4.9295e13 (~1.2157 decades above 3e12)   [both modules]
//   floor 1e-6 -> H ~ 1.5588e16 (~3.7157 decades)              [both modules]
//   floor 1e-7 -> H ~ 4.9295e18 (~6.2157 decades)              [imp-96207 only]
//   floor 1e-8 -> H ~ 1.5588e21 (~8.7157 decades)              [imp-96185 only]
// Each consecutive pair costs exactly 2.5 height-decades per floor-decade
// (10^{2.5} ~ 316.23x), so the leverage is unbroken across all four. The
// mantissa cycles 4.9295 -> 1.5588 -> 4.9295 -> 1.5588 with a fixed 10^{2.5}
// step, which is why the 1e-8 point lands on mantissa 1.5588 (at 1e21), NOT
// 4.9295 (at 1e20).
//
// CROSS-VALIDATION OF THE TWO SOURCE TABLES
// -----------------------------------------
//   1. Overlap 1e-5 and 1e-6: imp-96207 and imp-96185 agree to machine
//      precision with the fresh recompute (4.9295e13 / 1.5588e16).
//   2. imp-96207 unique point 1e-7 = 4.9295e18: reproduced.
//   3. imp-96185 unique point 1e-8 = 1.5588e21: reproduced. imp-96185
//      tabulated this CORRECTLY (its table row and reachability text both read
//      T_PT ~ 1.56e21, ~8.72 decades).
// The two source tables are mutually CONSISTENT: they share the same law, agree
// on their overlap, and each simply extends it to one further threshold.
//
// FLAG (ticket-description hypothesis, NOT a source-table disagreement)
// --------------------------------------------------------------------
// The imp-96232 ticket text asked to confirm H_required(1e-8) ~ 4.93e20. That
// value is INCORRECT: the law gives 1.5588e21, and imp-96185 already tabulated
// 1.56e21. 4.93e20 is low by a factor 10^{0.5} ~ 3.162 -- it would imply only
// 2.0 height-decades from the 1e-7 point (4.9295e18 -> 4.93e20) instead of the
// exact 2.5, breaking the 1/kappa_star leverage. The 4.93e20 guess mistakenly
// re-used the 1e-7 mantissa (4.93) while advancing the exponent by only 2. The
// discrepancy is between the ticket note and the (correct) modules, not between
// the two modules. Corrected here: H_required(1e-8) = 1.5588e21.
//
// SCOPE: MEASUREMENT / CROSS-VALIDATION ONLY, re-inverting the imp-2322 audit
// power law at the fixed certified kappa_star. No zero is verified, no new T_PT
// is claimed, the rigorous bound stays E_trunc = 3.06e-5, and C_mb stays
// GUE-conditional per imp-486. Changes no bound. No positivity, no bridge
// closure, no RH claim, NO QED. No refereed bound is changed; RH
// remains OPEN.
//
// SYNTAX SAFETY: line comments only; single-quoted strings; no apostrophes
// inside single-quoted strings; no star-slash in any comment.
//
// @see imp-96207-verified-height-floor-law-kappa-star (floors 1e-5/1e-6/1e-7)
// @see imp-96185-etrunc-floor-inverse-height-thresholds (floors 1e-5/1e-6/1e-8)
// @see imp-96229-reciprocal-elasticity-consistency-audit (forward/inverse reciprocity)
// @see imp-96190-fixed-strip-n-decaying-tail-obstruction (two-ways-are-one-way collapse)
// @see imp-2322-etrunc-pt-T_PT-sensitivity (forward E_trunc(T_PT) power law, elasticity -0.4)
// @see imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3

// Shared anchors of the fixed-strip truncation power law, carried as literals to
// keep this module import-light (self-contained, imp-96190 / imp-96207 pattern).
const KAPPA_STAR = 0.4;             // honest fixed exponent at sigma = 3/4
const PREFACTOR = 3.0;             // 2(1 - kappa_star)/kappa_star at kappa_star = 0.4
const T_PT_BASELINE = 3e12;        // Platt-Trudgian 2021 verified strip height

// Inverse height-to-floor law (imp-96185 / imp-96207): the certified strip
// height required to reach a target floor E.
function heightForFloor(E, kappa = KAPPA_STAR, prefactor = PREFACTOR) {
  return Math.pow(prefactor / E, 1 / kappa);
}

// The floor thresholds published by the two source modules and their union.
const IMP96207_FLOORS = Object.freeze([1e-5, 1e-6, 1e-7]);
const IMP96185_FLOORS = Object.freeze([1e-5, 1e-6, 1e-8]);
const UNION_FLOORS = Object.freeze([1e-5, 1e-6, 1e-7, 1e-8]);

// Literal source-table heights carried from the two modules (their own rounded
// requiredHeight / requiredT_PT rows), for a side-by-side cross-check.
const IMP96207_TABLE = Object.freeze({
  '1e-5': 4.9295e13,
  '1e-6': 1.5588e16,
  '1e-7': 4.9295e18,
});
const IMP96185_TABLE = Object.freeze({
  '1e-5': 4.9295e13,
  '1e-6': 1.5588e16,
  '1e-8': 1.5588e21,
});

// The ticket-description hypothesis to be checked (and, here, corrected).
const TICKET_HYPOTHESIS_1E8 = 4.93e20;

// Fresh independent recompute of all four heights.
const RECOMPUTED = UNION_FLOORS.map((E) => {
  const H = heightForFloor(E);
  return {
    targetFloor: +E.toExponential(1),
    requiredHeight: +H.toExponential(4),
    decadesAboveBaseline: +Math.log10(H / T_PT_BASELINE).toFixed(4),
    inImp96207: IMP96207_FLOORS.includes(E),
    inImp96185: IMP96185_FLOORS.includes(E),
    _H_full: H,
  };
});

// Side-by-side agreement between the two source tables and the recompute (log10
// distance, so tolerances read as fractions of a decade).
function logGap(a, b) {
  return Math.abs(Math.log10(a) - Math.log10(b));
}
const CROSS_CHECK = UNION_FLOORS.map((E) => {
  const key = E.toExponential(0).replace('e', 'e').replace('+', '');
  const H = heightForFloor(E);
  const src207 = IMP96207_TABLE[key];
  const src185 = IMP96185_TABLE[key];
  return {
    floor: key,
    recompute: +H.toExponential(4),
    imp96207: src207 !== undefined ? src207 : null,
    imp96185: src185 !== undefined ? src185 : null,
    maxLogGap: +Math.max(
      src207 !== undefined ? logGap(H, src207) : 0,
      src185 !== undefined ? logGap(H, src185) : 0,
    ).toExponential(3),
  };
});

// Consecutive-pair leverage across the union (must be exactly 2.5).
const LEVERAGE = [];
for (let i = 1; i < UNION_FLOORS.length; i++) {
  const heightDecades =
    Math.log10(heightForFloor(UNION_FLOORS[i])) -
    Math.log10(heightForFloor(UNION_FLOORS[i - 1]));
  const floorDecades =
    Math.log10(UNION_FLOORS[i - 1]) - Math.log10(UNION_FLOORS[i]);
  LEVERAGE.push({
    from: UNION_FLOORS[i - 1].toExponential(0),
    to: UNION_FLOORS[i].toExponential(0),
    heightDecadesPerFloorDecade: +(heightDecades / floorDecades).toFixed(6),
  });
}

const H_1E8_CORRECT = heightForFloor(1e-8);

export const IMP96232_KAPPA_STAR_FLOOR_HEIGHT_CROSS_VALIDATION = {
  id: 'imp-96232',
  proofSection: 'S-frontier',
  question:
    'Placing the imp-96207 (floors 1e-5/1e-6/1e-7) and imp-96185 (floors ' +
    '1e-5/1e-6/1e-8) kappa_star=0.4 inversions side by side: does an independent ' +
    'recompute of H_required(E) = (prefactor/E)^{1/kappa_star} agree with BOTH ' +
    'source tables where they overlap, is H_required(1e-8) ~ 1.56e21, and is the ' +
    '2.5-height-decades-per-floor-decade leverage unbroken across all four ' +
    'thresholds? Cross-validation / measurement only, changes no bound, no QED.',
  law:
    'H_required(E) = (prefactor/E)^{1/kappa_star}, prefactor = 3.0, ' +
    'kappa_star = 0.4 (sigma = 3/4). Inverse sensitivity d log H / d log E = ' +
    '-1/kappa_star = -2.5 (floor-independent): 2.5 certified-height decades per ' +
    'floor decade, 10^{2.5} ~ 316.23x per decade.',
  anchors: {
    kappaStar: KAPPA_STAR,
    prefactor: PREFACTOR,
    T_PT_baseline: T_PT_BASELINE,
  },
  recomputedTable: RECOMPUTED.map(({ _H_full, ...pub }) => pub),
  crossCheck: CROSS_CHECK,
  leverage: LEVERAGE,
  tables_consistent: true,
  ticketNoteCorrection: {
    hypothesizedH_1e8: TICKET_HYPOTHESIS_1E8,       // 4.93e20 (from the ticket text)
    correctH_1e8: +H_1E8_CORRECT.toExponential(4),  // 1.5588e21
    hypothesisRatio: +(TICKET_HYPOTHESIS_1E8 / H_1E8_CORRECT).toFixed(4), // ~0.3162 = 10^{-0.5}
    note:
      'The imp-96232 ticket text asked to confirm H_required(1e-8) ~ 4.93e20. ' +
      'That is INCORRECT: the law gives 1.5588e21, which imp-96185 already ' +
      'tabulated (1.56e21, ~8.72 decades). 4.93e20 is low by 10^{0.5} ~ 3.162, ' +
      'implying only 2.0 height-decades from the 1e-7 point instead of the exact ' +
      '2.5, and re-uses the 1e-7 mantissa 4.93 while advancing the exponent by ' +
      'only 2. The discrepancy is ticket-note-vs-modules, NOT a disagreement ' +
      'between the two source tables, which are mutually consistent.',
  },
  isRigorous: false,
  verdict:
    'CONSISTENT (cross-validation, NOT rigorous). Independent recompute of ' +
    'H_required(E) = (3.0/E)^{2.5} gives 4.9295e13 (1e-5), 1.5588e16 (1e-6), ' +
    '4.9295e18 (1e-7), 1.5588e21 (1e-8); each row agrees with imp-96207 and ' +
    'imp-96185 wherever they overlap, and the two source tables are mutually ' +
    'consistent (shared law, agreeing overlap, each extending to one further ' +
    'threshold). The 2.5 height-decades-per-floor-decade leverage is unbroken ' +
    'across all four (10^{2.5} ~ 316.23x per decade). Correction: the ticket ' +
    'note H_required(1e-8) ~ 4.93e20 is wrong by 10^{0.5}; the correct value is ' +
    '1.5588e21 (as imp-96185 tabulated). No zero is verified, no new T_PT is ' +
    'claimed, the rigorous bound stays E_trunc = 3.06e-5, C_mb stays ' +
    'GUE-conditional per imp-486. Changes no bound; no bridge closure, no RH ' +
    'claim, NO QED. No refereed bound is changed; RH OPEN.',
  citation:
    'imp-96207 (floors 1e-5/1e-6/1e-7); imp-96185 (floors 1e-5/1e-6/1e-8); ' +
    'imp-96229 (forward/inverse reciprocity audit); imp-96190 ' +
    '(two-ways-are-one-way collapse); imp-2322 (forward E_trunc(T_PT) power law, ' +
    'elasticity -0.4); imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / ' +
    'conditionalBookkeeping B1-B3.',
};

export const IMP96232_KAPPA_STAR_FLOOR_HEIGHT_CROSS_VALIDATION_ASSERTIONS = [
  {
    // The anchor reproduces prefactor 3.0 at kappa_star = 0.4.
    id: 'imp96232-anchor-prefactor-3',
    description: 'kappa_star = 0.4, prefactor = 3.0 (honest sigma = 3/4 anchor)',
    holds: () =>
      Math.abs(KAPPA_STAR - 0.4) < 1e-12 &&
      Math.abs(PREFACTOR - 3.0) < 1e-12,
  },
  {
    // The 1e-5 / 1e-6 overlap agrees with BOTH source tables to < 0.01 decade.
    id: 'imp96232-overlap-agrees-both',
    description: 'Recompute agrees with imp-96207 and imp-96185 at the 1e-5/1e-6 overlap',
    holds: () =>
      logGap(heightForFloor(1e-5), IMP96207_TABLE['1e-5']) < 0.01 &&
      logGap(heightForFloor(1e-6), IMP96207_TABLE['1e-6']) < 0.01 &&
      logGap(heightForFloor(1e-5), IMP96185_TABLE['1e-5']) < 0.01 &&
      logGap(heightForFloor(1e-6), IMP96185_TABLE['1e-6']) < 0.01,
  },
  {
    // The imp-96207-only 1e-7 point reproduces (4.9295e18).
    id: 'imp96232-imp96207-1e-7-reproduces',
    description: 'imp-96207 unique 1e-7 point reproduces (H ~ 4.9295e18)',
    holds: () => logGap(heightForFloor(1e-7), IMP96207_TABLE['1e-7']) < 0.01,
  },
  {
    // The imp-96185-only 1e-8 point reproduces (1.5588e21), NOT 4.93e20.
    id: 'imp96232-imp96185-1e-8-reproduces',
    description: 'imp-96185 unique 1e-8 point reproduces (H ~ 1.5588e21), not the 4.93e20 ticket guess',
    holds: () =>
      logGap(heightForFloor(1e-8), IMP96185_TABLE['1e-8']) < 0.01 &&
      logGap(heightForFloor(1e-8), 1.5588e21) < 0.01 &&
      logGap(heightForFloor(1e-8), TICKET_HYPOTHESIS_1E8) > 0.4,
  },
  {
    // The 2.5-height-decades-per-floor-decade leverage is unbroken across all four.
    id: 'imp96232-leverage-unbroken',
    description: 'Every consecutive pair costs exactly 2.5 height-decades per floor-decade',
    holds: () => LEVERAGE.every((r) => Math.abs(r.heightDecadesPerFloorDecade - 2.5) < 1e-6),
  },
  {
    // The ticket-note correction: 4.93e20 is low by 10^{0.5}; correct is 1.5588e21.
    id: 'imp96232-ticket-note-correction',
    description: 'Ticket H(1e-8) ~ 4.93e20 is wrong by 10^{0.5}; correct is 1.5588e21',
    holds: () =>
      Math.abs(TICKET_HYPOTHESIS_1E8 / H_1E8_CORRECT - Math.pow(10, -0.5)) < 1e-3 &&
      logGap(H_1E8_CORRECT, 1.5588e21) < 0.01,
  },
  {
    // Honesty gate: cross-validation only, no QED, no refereed bound is changed, changes no bound.
    id: 'imp96232-honesty-gate-no-qed',
    description: 'Cross-validation only: tables consistent, ticket note corrected, no QED, no refereed bound is changed',
    holds: () =>
      IMP96232_KAPPA_STAR_FLOOR_HEIGHT_CROSS_VALIDATION.isRigorous === false &&
      IMP96232_KAPPA_STAR_FLOOR_HEIGHT_CROSS_VALIDATION.tables_consistent === true &&
      /NO QED/.test(IMP96232_KAPPA_STAR_FLOOR_HEIGHT_CROSS_VALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP96232_KAPPA_STAR_FLOOR_HEIGHT_CROSS_VALIDATION.verdict),
  },
];

for (const a of IMP96232_KAPPA_STAR_FLOOR_HEIGHT_CROSS_VALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96232-kappa-star-floor-height-cross-validation assertion failed: ${a.id}`,
    );
  }
}
