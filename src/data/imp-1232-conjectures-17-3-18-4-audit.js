/**
 * @fileoverview Literature audit of paper Conjectures 17.3 and 18.4 (the
 * ghost-absence theorem in two notational forms). Exports CONJ_17_3_AUDIT and
 * CONJ_18_4_AUDIT (frozen per-conjecture verdict records), IMP_1232_AUDIT_SUMMARY
 * (the combined verdict + cross-references), and IMP_1232_ASSERTIONS (7
 * build-time tripwires).
 *
 * PROOF-CHAIN STEP: paper-audit leg of the v52 conjecture classification pass.
 * Both conjectures are graded SUBSUMED-BY-RH: each asserts the right-half-plane
 * ghost Blaschke product B_a^+(w) is identically 1, which unwinds by definition
 * to "xi has no zeros with Re(s) > 1/2 + a for all a > 0" -- exactly RH via the
 * functional equation. The para 17.4 Krein-Langer negative-index identity
 * ind_-(K_{R_a}) = #{off-critical zeros with Re(lambda) > a} is the load-bearing
 * bridge. Conjecture 18.4 restates 17.3 in four equivalent languages (Schur
 * class, K_a PSD, zero Weil-form negative index, RH) and the paper itself states
 * "equivalently RH holds".
 *
 * KEY ASSERTIONS: both verdicts equal SUBSUMED-BY-RH; each equivalencePath spells
 * out at least 5 auditable steps; Krein-Langer is cited in the 17.3 prior-art;
 * the paper sections are pinned (17.6 for 17.3, 18.4 for 18.4); both entries point
 * at audit ticket imp-1232; both recommendations foreground the genuinely open
 * non-circular para 18.1-18.3 programs.
 *
 * HONEST SCOPE: this file classifies the conjectures as RH restatements; it does
 * NOT advance the three genuinely open closure programs (kernel/passivity,
 * prime-delay domination, Weil-Pontryagin duality) in para 18.1-18.3, which
 * remain the real research targets.
 *
 * TICKETS: created by imp-1232; structurally identical audits in imp-1210 (22.4),
 * imp-1229 (15.2), imp-1202 (15.4); references imp-1198 (blaschke-ghosts) and
 * imp-1199 (ThreeAttacksPage non-circular programs).
 *
 * @module imp-1232-conjectures-17-3-18-4-audit
 * @see imp-1232
 * @see src/data/paper-audit-dashboard.js
 * @see src/data/blaschke-ghosts-section.js
 */

// imp-1232: Literature audit for paper Conjectures 17.3 and 18.4
//           (ghost-absence theorem -- SUBSUMED-BY-RH like 22.4).
//
// SCOPE
// -----
// Training-time knowledge only. No external browsing. Verdicts use
// the established five-element vocabulary from paper-audit-dashboard.js.
//
// STATEMENTS UNDER AUDIT
// ----------------------
// Conjecture 17.3 (Ghost-absence theorem -- para 17.6):
//   For every a > 0, the right-half-plane ghost Blaschke product
//   B_a^+(w) is identically 1.
//
// Conjecture 18.4 (Ghost-absence theorem, Weil/Pontryagin form -- para 18.4):
//   For every a > 0, B_a^+ is identically 1; equivalently R_a is
//   Schur in the right half-plane; K_a positive semidefinite;
//   twin-ladder Weil form has zero negative index; equivalently RH holds.
//
// VERDICT SUMMARY
// ---------------
// BOTH conjectures are SUBSUMED-BY-RH. The equivalence is exact and
// explicit: no proof beyond unwinding definitions is required.
//
// ARGUMENT FOR 17.3:
//   B_a^+(w) = product over P_a of b_alpha(w), where
//   P_a = {lambda - a : X(lambda) = 0, Re(lambda) > a}.
//   B_a^+(w) = 1 iff P_a is empty.
//   P_a is empty iff X has no zeros with Re(lambda) > a.
//   X(lambda) = xi(1/2 + lambda), so Re(lambda) > a iff Re(s) > 1/2 + a.
//   "For every a > 0, B_a^+(w) = 1" is therefore RH.
//   Cross-check via the para 17.4 Krein-Langer identity:
//     ind_-(K_{R_a}) = #{lambda : X(lambda) = 0, Re(lambda) > a}
//   K_{R_a} is positive semidefinite iff 17.3 holds iff RH (as a -> 0).
//
// ARGUMENT FOR 18.4:
//   The paper itself states "equivalently RH holds" in para 18.4.
//   The four conditions -- (i) B_a^+ = 1, (ii) R_a Schur, (iii) K_a PSD,
//   (iv) Weil-form negative index = 0 -- are mutually equivalent by the
//   para 17.4 Krein-Langer identity, and each equivalent to RH for a -> 0.
//   18.4 restates 17.3 in four languages.
//
// KEY REFERENCES
// --------------
//   Krein-Langer (1973, 1977): generalized Schur functions and Pontryagin
//     spaces. ind_-(K_S) = n relates Pontryagin index to RHP poles.
//   de Branges (1968), Hilbert Spaces of Entire Functions: K_a >= 0 is RH.
//   Lagarias (2007): survey of RH-equivalent reformulations.
//   Weil (1952) / Connes (1999): trace formula positivity = RH.
//
// SYNTAX NOTE
// -----------
// No apostrophes inside single-quoted JS strings.

// ── Per-conjecture audit entries ──────────────────────────────────────────

export const CONJ_17_3_AUDIT = Object.freeze({
  id: '17.3',
  label: 'Conjecture 17.3',
  shortName: 'Ghost-absence theorem',
  paperSection: 'para 17.6',
  paperPage: 25,
  auditTicket: 'imp-1232',
  auditDate: '2026-05-27',
  verdict: 'SUBSUMED-BY-RH',

  statement:
    'For every a > 0, the right-half-plane ghost Blaschke product ' +
    'B_a^+(w) is identically 1.',

  equivalencePath: Object.freeze([
    'Step 1: By definition, B_a^+(w) = product over P_a of b_alpha(w), where ' +
      'P_a = {lambda - a : X(lambda) = 0, Re(lambda) > a}, X(lambda) = xi(1/2 + lambda).',
    'Step 2: B_a^+(w) = 1 iff P_a is empty iff X has no zeros with Re(lambda) > a.',
    'Step 3: X(lambda) = xi(1/2 + lambda) so Re(lambda) > a iff Re(s) > 1/2 + a for s = 1/2 + lambda.',
    'Step 4: "For every a > 0, B_a^+(w) = 1" is therefore "xi has no zeros with ' +
      'Re(s) > 1/2 + a for any a > 0", which is exactly RH by the functional equation.',
    'Step 5: Cross-check -- the para 17.4 Krein-Langer identity ind_-(K_{R_a}) = #{zeros with Re > a} ' +
      'confirms: K_{R_a} positive semidefinite iff 17.3 holds iff RH (a -> 0).',
    'Conclusion: 17.3 is definitionally equivalent to RH. No new mathematics needed.',
  ]),

  circularityTest:
    'The equivalence 17.3 <=> RH is by direct definition-unwinding, not by a ' +
    'non-trivial proof that could carry independent mathematical content. ' +
    'Classifying 17.3 as SUBSUMED-BY-RH does NOT diminish the novelty of the ' +
    'para 17 Blaschke/Pontryagin framework -- that machinery is genuinely new. ' +
    'But the CONJECTURE ITSELF (B_a^+ = 1) is RH in disguise.',

  priorArtComparison: Object.freeze([
    {
      ref: 'de Branges (1968), Hilbert Spaces of Entire Functions',
      overlap:
        'de Branges positivity K_a >= 0 is exactly the same RH-equivalent condition ' +
        'in the Hilbert-space-of-entire-functions language. The ghost product B_a^+ is ' +
        'the Blaschke-product obstruction to de Branges positivity.',
    },
    {
      ref: 'Krein-Langer (1973, 1977), generalized Schur functions',
      overlap:
        'The negative-index identity ind_-(K_S) = number of right-half-plane poles of S ' +
        'is the Pontryagin-space theorem making the equivalence exact. ' +
        'Pontryagin index = 0 is the Schur class condition; for S = R_a this is 17.3.',
    },
    {
      ref: 'Lagarias (2007), survey of RH-equivalent reformulations',
      overlap:
        'Lagarias catalogues many positivity reformulations of RH equivalent to K_a >= 0. ' +
        'The B_a^+ = 1 statement is one such reformulation.',
    },
  ]),

  recommendationForPaper:
    'CONFIRMED SUBSUMED-BY-RH. Move Conjecture 17.3 out of the theorem-target list ' +
    'into a unified RH-equivalent reformulations subsection alongside 15.2, 15.4, 18.4, 22.4. ' +
    'Cite de Branges (1968), Krein-Langer (1973, 1977), and Lagarias (2007). ' +
    'The GENUINELY OPEN content in para 17-18 is the three non-circular closure programs ' +
    'in para 18.1-18.3 (kernel/passivity, prime-delay, Weil-Pontryagin).',
});

export const CONJ_18_4_AUDIT = Object.freeze({
  id: '18.4',
  label: 'Conjecture 18.4',
  shortName: 'Ghost-absence theorem (Weil/Pontryagin form)',
  paperSection: 'para 18.4',
  paperPage: 28,
  auditTicket: 'imp-1232',
  auditDate: '2026-05-27',
  verdict: 'SUBSUMED-BY-RH',

  statement:
    'For every a > 0, the inverse Blaschke ghost factor is absent: ' +
    'B_a^+ identically 1. Equivalently: R_a Schur in right half-plane; ' +
    'K_a positive semidefinite; twin-ladder Weil form has zero negative ' +
    'index; equivalently RH holds.',

  equivalencePath: Object.freeze([
    'Step 1: The paper para 18.4 ITSELF states "equivalently RH holds" as one reformulation.',
    'Step 2: The four stated conditions -- (i) B_a^+ = 1, (ii) R_a in Schur class, ' +
      '(iii) K_a PSD, (iv) Weil-form negative index = 0 -- are mutually equivalent by ' +
      'the para 17.4 Krein-Langer identity.',
    'Step 3: By Conjecture 17.3 audit (above), condition (i) is equivalent to RH.',
    'Step 4: Therefore all four conditions in 18.4 are equivalent to RH.',
    'Step 5: 18.4 restates 17.3 in four additional notational languages. ' +
      'Both are SUBSUMED-BY-RH for identical reasons.',
    'Conclusion: 18.4 is definitionally equivalent to RH, confirmed by the paper itself.',
  ]),

  circularityTest:
    'The paper itself supplies the chain: 18.4 says "equivalently RH holds". ' +
    'The audit confirms what the paper already stated. This is the strongest ' +
    'possible case for SUBSUMED-BY-RH.',

  priorArtComparison: Object.freeze([
    {
      ref: 'Same as Conjecture 17.3 (identical mathematical content)',
      overlap:
        '18.4 is 17.3 restated in the Weil/Pontryagin language. The Krein-Langer ' +
        'negative-index identity unifies all four reformulations under a single theorem.',
    },
    {
      ref: 'Weil (1952), explicit formula; Connes (1999), trace formula',
      overlap:
        'The "twin-ladder Weil form has zero negative index" condition in 18.4 is the ' +
        'Weil explicit formula positivity statement. Positivity of the Weil form is ' +
        'a well-known RH-equivalent in the Connes noncommutative geometric framework.',
    },
  ]),

  recommendationForPaper:
    'CONFIRMED SUBSUMED-BY-RH. Move Conjecture 18.4 out of the theorem-target list ' +
    'into the unified RH-equivalent reformulations subsection alongside 15.2, 15.4, ' +
    '17.3, and 22.4. The paper already states the equivalence at para 18.4. ' +
    'The genuinely open and independent research content in para 18 is in para 18.1 ' +
    '(kernel/passivity), para 18.2 (prime-delay domination), and para 18.3 ' +
    '(Weil-Pontryagin non-circular closure) -- those should be foregrounded.',
});

// ── Audit summary ─────────────────────────────────────────────────────────

export const IMP_1232_AUDIT_SUMMARY = Object.freeze({
  id: 'imp-1232-conjectures-17-3-18-4-audit',
  ticket: 'imp-1232',
  auditDate: '2026-05-27',
  paper: 'twin_ladder_consolidated_v52.pdf',
  paperSections: Object.freeze(['para 17.6', 'para 18.4']),

  verdicts: Object.freeze({
    '17.3': 'SUBSUMED-BY-RH',
    '18.4': 'SUBSUMED-BY-RH',
  }),

  sharedRationale:
    'Both conjectures are definitionally equivalent to RH. The para 17.4 Krein-Langer ' +
    'identity ind_-(K_{R_a}) = #{off-critical zeros with Re(lambda) > a} is the exact ' +
    'bridge: B_a^+(w) = 1 iff ind_- = 0 iff RH. The paper itself acknowledges this in ' +
    'para 18.4 ("equivalently RH holds"). Neither should be listed as an independent ' +
    'research target; both are RH in bridge/Blaschke language.',

  genuinelyOpenContent:
    'The three non-circular closure programs in para 18.1-18.3 (kernel/passivity, ' +
    'prime-delay domination, Weil-Pontryagin duality) are research-grade-open. None is ' +
    'a mere RH restatement -- each has a named open gap. Those should be foregrounded.',

  crossReferences: Object.freeze([
    'imp-1210: Conjecture 22.4 (structurally identical -- SUBSUMED-BY-RH)',
    'imp-1229: Conjecture 15.2 (structurally identical -- SUBSUMED-BY-RH)',
    'imp-1202: Conjecture 15.4 (structurally identical -- SUBSUMED-BY-RH)',
    'imp-1198: src/data/blaschke-ghosts-section.js (para 17 reference doc)',
    'imp-1199: ThreeAttacksPage.jsx (para 18.1-18.3 non-circular programs)',
  ]),
});

// ── Build-time tripwires ──────────────────────────────────────────────────

export const IMP_1232_ASSERTIONS = [
  {
    id: 'imp1232-17-3-verdict-is-subsumed-by-rh',
    why:
      'The audit concludes 17.3 is definitionally equivalent to RH via the Krein-Langer ' +
      'identity. The verdict must be SUBSUMED-BY-RH.',
    holds: () => CONJ_17_3_AUDIT.verdict === 'SUBSUMED-BY-RH',
  },
  {
    id: 'imp1232-18-4-verdict-is-subsumed-by-rh',
    why:
      'The audit concludes 18.4 is definitionally equivalent to RH; the paper itself ' +
      'states "equivalently RH holds". The verdict must be SUBSUMED-BY-RH.',
    holds: () => CONJ_18_4_AUDIT.verdict === 'SUBSUMED-BY-RH',
  },
  {
    id: 'imp1232-equivalence-path-has-five-steps',
    why:
      'The equivalence argument for each conjecture must spell out at least 5 steps ' +
      'so the logic is auditable. A single-line conclusion would not constitute a ' +
      'traceable audit.',
    holds: () =>
      CONJ_17_3_AUDIT.equivalencePath.length >= 5 &&
      CONJ_18_4_AUDIT.equivalencePath.length >= 5,
  },
  {
    id: 'imp1232-krein-langer-cited-for-17-3',
    why:
      'The Krein-Langer negative-index identity is the load-bearing reference making ' +
      'the 17.3 equivalence exact. It must appear in the priorArtComparison for 17.3.',
    holds: () =>
      CONJ_17_3_AUDIT.priorArtComparison.some(
        (r) => r.ref.toLowerCase().includes('krein'),
      ),
  },
  {
    id: 'imp1232-paper-section-references-correct',
    why:
      'The audit must pin the correct paper sections (17.6 for 17.3, 18.4 for 18.4). ' +
      'Wrong section numbers would disconnect the audit from the source document.',
    holds: () =>
      CONJ_17_3_AUDIT.paperSection === 'para 17.6' &&
      CONJ_18_4_AUDIT.paperSection === 'para 18.4',
  },
  {
    id: 'imp1232-audit-ticket-is-imp-1232',
    why:
      'Both audit entries must point at the correct audit ticket imp-1232. ' +
      'Wrong ticket would break the completedAuditTickets cross-reference in ' +
      'paper-audit-dashboard.js.',
    holds: () =>
      CONJ_17_3_AUDIT.auditTicket === 'imp-1232' &&
      CONJ_18_4_AUDIT.auditTicket === 'imp-1232',
  },
  {
    id: 'imp1232-recommendations-cite-open-content-in-18-1-to-18-3',
    why:
      'The recommendations for both conjectures must foreground the genuinely open ' +
      'non-circular programs in para 18.1-18.3 so the paper author knows what the ' +
      'independent research targets are.',
    holds: () =>
      CONJ_17_3_AUDIT.recommendationForPaper.includes('18.1') &&
      CONJ_18_4_AUDIT.recommendationForPaper.includes('18.1'),
  },
];
