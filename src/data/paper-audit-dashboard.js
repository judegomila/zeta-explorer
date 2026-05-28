// imp-1218: Paper Audit Dashboard.
//
// PURPOSE
// -------
// research-inputs/twin_ladder_consolidated_v52.pdf names a collection of
// numbered conjectures across Sections 15, 16, 17, 18, and 22. As we audit
// each one against the published literature or against RH itself, we accrue
// a verdict: SUBSUMED-BY-RH (the conjecture is a known reformulation of RH),
// SUBSUMED-BY-LITERATURE (a named published theorem implies it),
// PARTIALLY-RELATED (a known body of work is adjacent but does not imply it),
// INDEPENDENT-NOVEL (no known precedent), or UNAUDITED.
//
// This module is the single source of truth tracking those verdicts. The
// /paper-audit-dashboard page reads from this file. As new audits land
// (imp-1163, imp-1202, imp-1210 already done; more to follow), the entries
// below should be updated in-place with the new verdict + auditTicket +
// recommendationForPaper.
//
// HONEST READ AS OF IMP-1229
// --------------------------
// Of 13 numbered conjectures spanning Sections 15-22, four have been
// audited so far:
//   * Section 4.5 Conjecture 1 (lin-stat variance) -> SUBSUMED-BY-LITERATURE
//     (Hughes-Rudnick 2003 + Bourgade 2010), via imp-1163. NOTE this is in
//     Section 4, not in 15-22, so it is OUT of this dashboard's coverage --
//     it is named here in the closureNote of the parent ticket for
//     bookkeeping but does not appear in the per-conjecture table.
//   * Conjecture 15.2 (zero bridge-thickness, shift contractivity) ->
//     SUBSUMED-BY-RH via shift-bridge threshold theorem (imp-1229): the
//     paper itself states |X(w-a)| < |X(w+a)| iff RH; same statement as 22.4.
//   * Conjecture 15.4 (prime-delay domination, infinitesimal form) ->
//     SUBSUMED-BY-RH via paired Hadamard (imp-1202).
//   * Conjecture 22.4 (zero bridge-thickness) -> SUBSUMED-BY-RH via the
//     de Branges / Lagarias formulation (imp-1210).
// Conjectures 22.2 and 22.3 received a PARTIALLY-RELATED verdict, 22.1 is
// INDEPENDENT-NOVEL, and the remaining seven (15.3, 16.4, 16.6, 17.3,
// 18.1, 18.2, 18.4) remain UNAUDITED. (NOTE: by imp-1231, 16.4 and 16.6 have
// moved to PARTIALLY-RELATED; by imp-1230 / imp-1232, 15.3, 17.3, 18.4 have
// moved to SUBSUMED-BY-RH.)
//
// VERDICT VOCABULARY
// ------------------
//   SUBSUMED-BY-RH         -- conjecture is a known reformulation of RH;
//                             listing it as a separate theorem target would
//                             overclaim the paper's contribution.
//   SUBSUMED-BY-LITERATURE -- a named published theorem (not RH itself)
//                             directly implies the conjecture.
//   PARTIALLY-RELATED      -- substantial prior work covers a neighbouring
//                             statement; the conjecture is a sharpening /
//                             specialization / re-axiomatization.
//   INDEPENDENT-NOVEL      -- no known precedent in published literature.
//   UNAUDITED              -- no literature or numerical audit yet; verdict
//                             not yet assigned.
//
// SYNTAX NOTE
// -----------
// JSDoc comments do NOT use the close-comment sequence. JS string literals
// use single quotes and avoid apostrophes inside.

// ── Verdict vocabulary export ─────────────────────────────────────────────

const VERDICT_VOCABULARY = Object.freeze([
  'SUBSUMED-BY-RH',
  'SUBSUMED-BY-LITERATURE',
  'PARTIALLY-RELATED',
  'INDEPENDENT-NOVEL',
  'UNAUDITED',
]);

// ── Per-conjecture audit entries ──────────────────────────────────────────

const CONJECTURE_ENTRIES = [
  {
    id: '15.2',
    label: 'Conjecture 15.2',
    shortName: 'Zero bridge-thickness / shift contractivity',
    paperSection: '§15',
    paperPage: 15,
    statement:
      'For every a > 0 and every w with Re(w) > 0, |X(w - a)| < |X(w + a)|. ' +
      'Equivalently, the shifted de Branges kernel K_a is positive definite ' +
      'for every a > 0. By the shift-bridge threshold theorem this conjecture ' +
      'is EQUIVALENT TO RH.',
    auditStatus: 'SUBSUMED-BY-RH',
    auditTicket: 'imp-1229',
    auditDate: '2026-05-27',
    recommendationForPaper:
      'CONFIRMED SUBSUMED-BY-RH. The paper Section 15 states explicitly that ' +
      'the shift-bridge threshold theorem makes |X(w-a)| < |X(w+a)| for all ' +
      'Re(w) > 0 EQUIVALENT TO RH. This is the same Hermite-Biehler statement ' +
      'as Conjecture 22.4 (audited SUBSUMED-BY-RH via imp-1210). Cite de ' +
      'Branges 1968, Lagarias 2007. Move out of the theorem-targets list into ' +
      'a single RH-equivalent reformulation subsection alongside 22.4, 17.3, ' +
      'and 18.4.',
  },
  {
    id: '15.3',
    label: 'Conjecture 15.3',
    shortName: 'Shift-bridge positivity (Hermite-Biehler form)',
    paperSection: '§15',
    paperPage: 15,
    statement:
      'The shifted bridge functions E_a(z) = xi(1/2 + a - iz) are ' +
      'Hermite-Biehler for every a > 0. (Equivalent to Conjecture 15.2 and ' +
      'hence to RH.)',
    auditStatus: 'SUBSUMED-BY-RH',
    auditTicket: 'imp-1230',
    auditDate: '2026-05-27',
    recommendationForPaper:
      'CONFIRMED SUBSUMED-BY-RH (imp-1230). The paper itself states 15.3 is ' +
      'equivalent to 15.2 (shift contractivity) and hence to RH. The ' +
      'Hermite-Biehler condition on E_a(z) = xi(1/2 + a - iz) is exactly the ' +
      'statement K_a(w,w) >= 0 for all w (de Branges kernel positivity). This ' +
      'is identical in content to Conjecture 22.4 (SUBSUMED-BY-RH via imp-1210: ' +
      'de Branges 1968, Lagarias 2007). Move 15.3 into the unified ' +
      'RH-equivalent reformulations subsection alongside 15.2, 15.4, 17.3, ' +
      '18.4, 22.4. Cite de Branges 1968, Lagarias 2007. K_a >= 0 is not ' +
      'stronger nor weaker than RH -- it is RH.',
  },
  {
    id: '15.4',
    label: 'Conjecture 15.4',
    shortName: 'Prime-delay domination, infinitesimal form',
    paperSection: '§15.9',
    paperPage: 15,
    statement:
      'For every sigma > 1/2 and every t in R, Re(xi\'/xi)(sigma + it) > 0. ' +
      'Equivalently, the completed rightward drift of xi dominates the ' +
      'coherent prime-delay echo train in the half-plane to the right of the ' +
      'critical line.',
    auditStatus: 'SUBSUMED-BY-RH',
    auditTicket: 'imp-1202',
    auditDate: '2026-05-26',
    recommendationForPaper:
      'Numerical audit (sigma = 0.6 on a 24-point (N, t) grid) returns ' +
      'empirically-holds at every point. But the paired Hadamard expansion ' +
      'shows every term in Re(xi\'/xi) is positive for sigma > 1/2 under RH, ' +
      'so the LITERAL inequality is RH-implied. Reframe as RH-consequence ' +
      'and isolate any QUANTITATIVE form (sub-gap imp-1202-sub-quantitative-' +
      'form) as the genuinely-open content.',
  },
  {
    id: '16.4',
    label: 'Conjecture 16.4',
    shortName: 'Shift-bridge square (hidden square)',
    paperSection: '§16.4',
    paperPage: 19,
    statement:
      'For every a > 0 there exists a Hilbert space H_a and a transform B_a, ' +
      'built directly from the completed Riemann kernel and NOT from the zero ' +
      'set, such that K_a(zeta, z) = <B_a(z), B_a(zeta)>_{H_a}.',
    auditStatus: 'PARTIALLY-RELATED',
    auditTicket: 'imp-1231',
    auditDate: '2026-05-28',
    recommendationForPaper:
      'CONFIRMED PARTIALLY-RELATED (imp-1231). Conj 16.4 has TWO PARTS: ' +
      '(a) EXISTENCE -- RH-equivalent by Thm 15.1 + de Branges 1968 RKHS ' +
      'realization; paper itself acknowledges on line 1630-1631. ' +
      '(b) NON-CIRCULAR CONSTRUCTION (build B_a directly from Phi, not from ' +
      'the zero set) -- genuinely open content. Cite de Branges 1968, ' +
      'Aronszajn 1950, Burnol 2002, Lagarias 2007, Connes 1999. Reframe as ' +
      'a CONTRIBUTION TO the de-Branges-realization-for-xi program with ' +
      'the non-circular-construction constraint as the precise open target. ' +
      'Same shape as 22.3 (PARTIALLY-RELATED via imp-1210).',
  },
  {
    id: '16.6',
    label: 'Conjecture 16.6',
    shortName: 'Canonical-system closure',
    paperSection: '§16.7',
    paperPage: 20,
    statement:
      'For every a > 0, the shifted bridge ratio Theta_a(z) = E_a^#(z)/E_a(z) ' +
      'is the transfer function of a passive canonical system constructed ' +
      'directly from the completed Riemann kernel. Equivalently, Theta_a is ' +
      'Schur in C_+ for every a > 0.',
    auditStatus: 'PARTIALLY-RELATED',
    auditTicket: 'imp-1231',
    auditDate: '2026-05-28',
    recommendationForPaper:
      'CONFIRMED PARTIALLY-RELATED (imp-1231). Conj 16.6 has TWO PARTS: ' +
      '(a) SCHUR / TRANSFER-FUNCTION half -- RH-equivalent by paper §15.3 ' +
      'line 1208-1209 (K_a positivity <=> Theta_a Schur) + Thm 15.1; paper ' +
      'itself acknowledges on line 1722-1723. (b) DIRECTLY-FROM-PHI ' +
      'HAMILTONIAN CONSTRUCTION -- the open content. Cite Krein 1955, ' +
      'de Branges 1968 Thm 38-40 (inverse spectral theorem), Romanov 2010, ' +
      'Remling 2002/2018 (Spectral theory of canonical systems), Lagarias-' +
      'Suzuki 2006, Burnol 2002, Connes 1999. Position §16.7 explicitly as ' +
      '"the inverse-spectral theorem for the Riemann case".',
  },
  {
    id: '17.3',
    label: 'Conjecture 17.3',
    shortName: 'Ghost-absence theorem',
    paperSection: '§17.6',
    paperPage: 25,
    statement:
      'For every a > 0, the right-half-plane ghost Blaschke product B_a^+(w) ' +
      'is identically 1. Equivalently: no off-critical zeros with ' +
      '|Re rho - 1/2| > a; equivalently RH in the limit a -> 0.',
    auditStatus: 'SUBSUMED-BY-RH',
    auditTicket: 'imp-1232',
    auditDate: '2026-05-27',
    recommendationForPaper:
      'CONFIRMED SUBSUMED-BY-RH (imp-1232). B_a^+(w) = 1 iff P_a empty iff ' +
      'xi has no zeros with Re(s) > 1/2 + a; for every a > 0 this is RH. ' +
      'The §17.4 Krein-Langer identity ind_-(K_{R_a}) = #{off-critical zeros} ' +
      'makes the equivalence exact. Move out of theorem-target list into the ' +
      'unified RH-equivalent reformulations subsection alongside 15.2, 15.4, ' +
      '18.4, 22.4. Cite de Branges (1968), Krein-Langer (1973, 1977), ' +
      'Lagarias (2007). The genuinely open content in §17-18 is in the three ' +
      'non-circular closure programs §18.1-18.3.',
  },
  {
    id: '18.1',
    label: 'Conjecture 18.1',
    shortName: 'Kernel/passivity closure',
    paperSection: '§18.1',
    paperPage: 27,
    statement:
      'For every shift a > 0, the pair (A_a, B_a) -- the even and odd ' +
      'Fourier channels of the centered completed kernel -- arises from a ' +
      'positive Hamiltonian canonical system whose Weyl transfer function is ' +
      'Theta_a(z) = E_a^#(z)/E_a(z). Equivalently, K_a is the energy kernel ' +
      'of a passive system constructed directly from Phi.',
    auditStatus: 'PARTIALLY-RELATED',
    auditTicket: 'imp-1233',
    auditDate: '2026-05-28',
    recommendationForPaper:
      'CONFIRMED PARTIALLY-RELATED (imp-1233). Reframe as a CONTRIBUTION TO ' +
      'the de Branges-Krein canonical-system + KYP / Darlington passive-' +
      'realization program rather than a free-standing conjecture. The paper ' +
      'itself states 18.1 implies RH, so it is NOT a mere RH restatement. ' +
      'Cite Yakubovich (1962), Kalman (1963), Anderson-Vongpanitlerd (1973) ' +
      'for KYP; Krein (1955), de Branges (1968) for canonical systems; ' +
      'Lagarias (2007) for the surveyed open Weil-form realization problem. ' +
      'Cross-link to 16.6 (canonical-system closure) and 22.3 (bridge-norm ' +
      'realization, PARTIALLY-RELATED via imp-1210). The new content is the ' +
      'explicit Wronskian-symplectic-pairing form and the diagnosis that the ' +
      'obstruction is the off-diagonal even/odd channel commutator.',
  },
  {
    id: '18.2',
    label: 'Conjecture 18.2',
    shortName: 'Prime-delay domination closure',
    paperSection: '§18.2',
    paperPage: 28,
    statement:
      'For every w with Re w > 0, the completed archimedean drift dominates ' +
      'the coherent prime-delay echo train (Weil-explicit-formula completed ' +
      'sense): Re(X\'/X)(w) > 0 for Re w > 0.',
    auditStatus: 'PARTIALLY-RELATED',
    auditTicket: 'imp-1233',
    auditDate: '2026-05-28',
    recommendationForPaper:
      'CONFIRMED PARTIALLY-RELATED (imp-1233). 18.2 is the CRITICAL-HALF-' +
      'STRIP strengthening of Conjecture 15.4 (SUBSUMED-BY-RH via imp-1202). ' +
      '15.4 holds in the Euler-convergent half-plane sigma > 1/2 by paired ' +
      'Hadamard; 18.2 demands the inequality for ALL Re(w) > 0 (i.e. into ' +
      'the critical half-strip), where Euler diverges and Hadamard no longer ' +
      'separates zero and prime contributions term-by-term. The off-critical-' +
      'zero witness Q_{delta,gamma}(w) = (w - i gamma)^2 - delta^2 makes 18.2 ' +
      'a tool that PROVES RH, not a mere restatement. Cite Weil (1952), ' +
      'Bombieri (1965, 1974), Iwaniec-Kowalski (2004 ch 5,17), Selberg (1942), ' +
      'Vinogradov-Korobov (1958). Cross-link imp-1184 (Montgomery PCC at ' +
      '2-point shared obstruction) and imp-1202 (15.4 Euler-half-plane case).',
  },
  {
    id: '18.4',
    label: 'Conjecture 18.4',
    shortName: 'Ghost absence theorem (Weil/Pontryagin form)',
    paperSection: '§18.4',
    paperPage: 28,
    statement:
      'For every a > 0, the inverse Blaschke ghost factor is absent: ' +
      'B_a^+ identically 1. Equivalently: R_a Schur in right half-plane; ' +
      'K_a positive semidefinite; twin-ladder Weil form has zero negative ' +
      'index; equivalently RH holds.',
    auditStatus: 'SUBSUMED-BY-RH',
    auditTicket: 'imp-1232',
    auditDate: '2026-05-27',
    recommendationForPaper:
      'CONFIRMED SUBSUMED-BY-RH (imp-1232). The paper Section 18.4 itself ' +
      'states "equivalently RH holds". The four conditions (B_a^+ = 1, R_a ' +
      'Schur, K_a PSD, Weil-form negative index = 0) are mutually equivalent ' +
      'by the §17.4 Krein-Langer identity and each equivalent to RH. 18.4 ' +
      'restates 17.3 in four languages. Move into the unified ' +
      'RH-equivalent reformulations subsection alongside 15.2, 15.4, 17.3, ' +
      '22.4. Cite Weil (1952), Connes (1999), Krein-Langer (1973, 1977). ' +
      'The genuinely open content in §18 is §18.1-18.3.',
  },
  {
    id: '22.1',
    label: 'Conjecture 22.1',
    shortName: 'Twin-ladder usefulness',
    paperSection: '§22',
    paperPage: 32,
    statement:
      'There exists a frozen-ladder approximation to the completed zeta ' +
      'function whose certified remainder bound in the classical case is ' +
      'smaller, at equal runtime, than a comparable baseline approximation ' +
      '(e.g. Riemann-Siegel or smoothed explicit-formula sum).',
    auditStatus: 'INDEPENDENT-NOVEL',
    auditTicket: 'imp-1210',
    auditDate: '2026-05-26',
    recommendationForPaper:
      'KEEP as a concrete benchmark target. Strengthen by naming the baseline ' +
      'explicitly (Platt-Trudgian 2021 at T = 3e12) and the target runtime ' +
      'regime. Cite Riemann-Siegel / Odlyzko-Schonhage / Hiary as runtime ' +
      'baselines. The imp-440 / imp-963 finite-height beat (Lambda <= 0.02 ' +
      'at N* = 1e4) already partially realizes this in the de Bruijn-Newman ' +
      'setting.',
  },
  {
    id: '22.2',
    label: 'Conjecture 22.2',
    shortName: 'Admissible pressure families',
    paperSection: '§22',
    paperPage: 32,
    statement:
      'There exists a nontrivial family M_{beta, P} of completed-kernel-' +
      'admissible deformations of xi indexed by a thermodynamic-style ' +
      'pressure parameter P and inverse-temperature parameter beta, ' +
      'approximable by real-zero-preserving universal factors (Laguerre-' +
      'Polya class operators).',
    auditStatus: 'PARTIALLY-RELATED',
    auditTicket: 'imp-1210',
    auditDate: '2026-05-26',
    recommendationForPaper:
      'REFRAME with explicit citations to Newman 1976, Csordas-Norfolk-' +
      'Varga 1988, Polya 1927, Bost-Connes 1995. Isolate the novel ' +
      'content: which admissibility axiom in M_{beta, P} is not subsumed ' +
      'by existing universal-factor theory? If none, flag as a definitional ' +
      'reformulation.',
  },
  {
    id: '22.3',
    label: 'Conjecture 22.3',
    shortName: 'Bridge-norm realization',
    paperSection: '§22',
    paperPage: 32,
    statement:
      'The Weil/twin-ladder quadratic form Q_TL[h] admits a non-circular ' +
      'norm-square realization Q_TL[h] = ||B_xi h||^2, where B_xi is a ' +
      'bounded linear operator constructed from xi without using zero-freeness ' +
      'as an input.',
    auditStatus: 'PARTIALLY-RELATED',
    auditTicket: 'imp-1210',
    auditDate: '2026-05-26',
    recommendationForPaper:
      'REFRAME with explicit citations to Weil 1952, Bombieri 2003, de Branges ' +
      '1968, Lagarias 2007, Connes 1999. State as "we seek a de-Branges-space ' +
      'realization of the Weil form with structure function E built from xi ' +
      'without circular use of RH". This is an OPEN problem already in the ' +
      'literature (Lagarias 2007 surveys it); position 22.3 as a CONTRIBUTION ' +
      'TO an existing line of work rather than a free-standing conjecture.',
  },
  {
    id: '22.4',
    label: 'Conjecture 22.4',
    shortName: 'Zero bridge-thickness',
    paperSection: '§22',
    paperPage: 32,
    statement:
      'For every a > 0, the shifted bridge function E_a(z) = xi(1/2 + a - iz) ' +
      'is Hermite-Biehler. Equivalently the shifted bridge kernel K_a is ' +
      'positive definite for every a > 0.',
    auditStatus: 'SUBSUMED-BY-RH',
    auditTicket: 'imp-1210',
    auditDate: '2026-05-26',
    recommendationForPaper:
      'REFRAME explicitly as RH-equivalent. Move out of Section 22 "theorem ' +
      'targets" into a standalone "RH-equivalent reformulation" subsection. ' +
      'Cite de Branges 1968, Lagarias 2007, Bombieri-Lagarias 1999 for the ' +
      'equivalence. Cite de Bruijn 1950, Newman 1976, Rodgers-Tao 2018 for ' +
      'the closest one-parameter-deformation framework. Acknowledge openly: ' +
      '22.4 IS RH.',
  },
];

// ── Summary aggregation ───────────────────────────────────────────────────

function countByStatus(status) {
  return CONJECTURE_ENTRIES.filter((e) => e.auditStatus === status).length;
}

const STATUS_COUNTS = Object.freeze({
  'SUBSUMED-BY-RH': countByStatus('SUBSUMED-BY-RH'),
  'SUBSUMED-BY-LITERATURE': countByStatus('SUBSUMED-BY-LITERATURE'),
  'PARTIALLY-RELATED': countByStatus('PARTIALLY-RELATED'),
  'INDEPENDENT-NOVEL': countByStatus('INDEPENDENT-NOVEL'),
  UNAUDITED: countByStatus('UNAUDITED'),
});

const AUDITED_COUNT = CONJECTURE_ENTRIES.filter(
  (e) => e.auditStatus !== 'UNAUDITED',
).length;

// ── Honest scope ──────────────────────────────────────────────────────────

const HONEST_SCOPE = Object.freeze([
  'This dashboard tracks 13 numbered conjectures from research-inputs/' +
    'twin_ladder_consolidated_v52.pdf Sections 15, 16, 17, 18, 22. The ' +
    'Section 4.5 Conjecture 1 (lin-stat variance) audit (imp-1163) is OUT ' +
    'of scope here because Section 4 is not covered by this tracker -- the ' +
    'verdict (SUBSUMED-BY-LITERATURE via Hughes-Rudnick 2003 + Bourgade ' +
    '2010) is recorded in imp-1163 and IMPROVEMENTS.md.',
  'As of imp-1231, 11 of 13 conjectures (15.2, 15.3, 15.4, 16.4, 16.6, ' +
    '17.3, 18.4, 22.1, 22.2, 22.3, 22.4) have received a verdict. The ' +
    'remaining 2 (18.1, 18.2) are UNAUDITED with auditTicket = null. ' +
  'As of imp-1233, 11 of 13 conjectures (15.2, 15.3, 15.4, 17.3, 18.1, 18.2, ' +
    '18.4, 22.1, 22.2, 22.3, 22.4) have received a verdict. The remaining 2 ' +
    '(16.4, 16.6) are UNAUDITED with auditTicket = null. ' +
    'recommendationForPaper for those 2 is a PREDICTION of the likely ' +
    'verdict based on visible cross-references, not a completed audit.',
  'The verdicts SUBSUMED-BY-RH on 15.4 (imp-1202) and 22.4 (imp-1210) are ' +
    'based on textbook de Branges / Hadamard machinery and are robust ' +
    'against further literature search. The PARTIALLY-RELATED verdicts on ' +
    '22.2 and 22.3 (imp-1210) depend on the exact axiomatization in the ' +
    'paper and could upgrade to SUBSUMED-BY-LITERATURE under closer ' +
    'reading. The INDEPENDENT-NOVEL verdict on 22.1 (imp-1210) is the ' +
    'weakest -- it depends on the qualitative-vs-quantitative reading of ' +
    'the "useful frozen ladder" claim.',
  'No external browsing was performed for any of the three completed ' +
    'audits. All verdicts use training-time knowledge plus internal cross-' +
    'references between sections of the paper itself.',
  'The recommendationForPaper text for the 4 UNAUDITED conjectures is ' +
    'INDICATIVE -- it notes the cross-references but is not a substitute for ' +
    'a per-conjecture literature audit ticket. Follow-up tickets per conjecture ' +
    'are the natural extension of this dashboard.',
]);

// ── Frozen export ─────────────────────────────────────────────────────────

export const PAPER_AUDIT_DASHBOARD = Object.freeze({
  id: 'paper-audit-dashboard',
  ticket: 'imp-1229',
  builtAt: '2026-05-27T00:00:00Z',
  paper: 'twin_ladder_consolidated_v52.pdf',
  paperSectionsCovered: Object.freeze(['§15', '§16', '§17', '§18', '§22']),

  verdictVocabulary: VERDICT_VOCABULARY,

  conjectures: Object.freeze(CONJECTURE_ENTRIES.map((e) => Object.freeze(e))),

  statusCounts: STATUS_COUNTS,
  auditedCount: AUDITED_COUNT,
  totalCount: CONJECTURE_ENTRIES.length,

  completedAuditTickets: Object.freeze([
    Object.freeze({
      ticket: 'imp-1163',
      title: 'Section 4.5 Conjecture 1 literature survey',
      verdict: 'SUBSUMED-BY-LITERATURE (Hughes-Rudnick 2003 + Bourgade 2010)',
      coversConjectures: Object.freeze(['4.5 Conj 1 (out of dashboard scope)']),
      auditDate: '2026-05',
    }),
    Object.freeze({
      ticket: 'imp-1202',
      title: 'Conjecture 15.4 numerical audit',
      verdict: 'SUBSUMED-BY-RH (paired Hadamard)',
      coversConjectures: Object.freeze(['15.4']),
      auditDate: '2026-05-26',
    }),
    Object.freeze({
      ticket: 'imp-1210',
      title: 'Conjectures 22.1-22.4 literature audit',
      verdict:
        '22.4 SUBSUMED-BY-RH; 22.2 and 22.3 PARTIALLY-RELATED; 22.1 ' +
        'INDEPENDENT-NOVEL',
      coversConjectures: Object.freeze(['22.1', '22.2', '22.3', '22.4']),
      auditDate: '2026-05-26',
    }),
    Object.freeze({
      ticket: 'imp-1229',
      title: 'Conjecture 15.2 audit (zero bridge-thickness / shift contractivity)',
      verdict: '15.2 SUBSUMED-BY-RH (shift-bridge threshold theorem, same Hermite-Biehler statement as 22.4)',
      coversConjectures: Object.freeze(['15.2']),
      auditDate: '2026-05-27',
    }),
    Object.freeze({
      ticket: 'imp-1232',
      title: 'Conjectures 17.3 + 18.4 audit (ghost-absence theorem)',
      verdict:
        '17.3 SUBSUMED-BY-RH (Krein-Langer identity: B_a^+=1 is definitionally RH); ' +
        '18.4 SUBSUMED-BY-RH (paper itself states equivalently RH holds; restates 17.3 in four languages)',
      coversConjectures: Object.freeze(['17.3', '18.4']),
      auditDate: '2026-05-27',
    }),
    Object.freeze({
      ticket: 'imp-1230',
      title: 'Conjecture 15.3 audit (shift-bridge positivity / Hermite-Biehler)',
      verdict: '15.3 SUBSUMED-BY-RH (E_a Hermite-Biehler iff K_a PSD iff RH; identical to 22.4; cite de Branges 1968, Lagarias 2007)',
      coversConjectures: Object.freeze(['15.3']),
      auditDate: '2026-05-27',
    }),
    Object.freeze({
      ticket: 'imp-1231',
      title: 'Conjectures 16.4 + 16.6 audit (shift-bridge square + canonical-system closure)',
      verdict:
        '16.4 PARTIALLY-RELATED (existence-half RH-equivalent via de Branges 1968 RKHS; ' +
        'non-circular B_a-from-Phi construction is the open content; cite Aronszajn 1950, ' +
        'Burnol 2002, Lagarias 2007). 16.6 PARTIALLY-RELATED (Schur-half RH-equivalent via ' +
        'paper §15.3 + Thm 15.1; directly-from-Phi canonical-system Hamiltonian is the open ' +
        'content; cite Krein 1955, de Branges 1968 Thm 38-40, Romanov 2010, Remling 2002/2018).',
      coversConjectures: Object.freeze(['16.4', '16.6']),
      auditDate: '2026-05-28',
    }),
    Object.freeze({
      ticket: 'imp-1233',
      title: 'Conjectures 18.1 + 18.2 audit (kernel/passivity + prime-delay domination closures)',
      verdict:
        '18.1 PARTIALLY-RELATED (KYP / Yakubovich-Kalman / Anderson-Vongpanitlerd / Krein 1955 / de Branges 1968 / Lagarias 2007; ' +
        'literature gives the realization machinery but not the non-circular construction from Phi alone). ' +
        '18.2 PARTIALLY-RELATED (Weil 1952 / Bombieri 1965, 1974 / Iwaniec-Kowalski 2004 / Vinogradov-Korobov 1958 / Selberg 1942; ' +
        'critical-half-strip strengthening of 15.4, where Euler diverges and Hadamard no longer separates terms).',
      coversConjectures: Object.freeze(['18.1', '18.2']),
      auditDate: '2026-05-28',
    }),
  ]),

  honestScope: HONEST_SCOPE,

  closureNote:
    'DASHBOARD: living tracker of every named conjecture in v52 paper ' +
    'Sections 15-22, with per-conjecture verdict in {SUBSUMED-BY-RH, ' +
    'SUBSUMED-BY-LITERATURE, PARTIALLY-RELATED, INDEPENDENT-NOVEL, ' +
    'UNAUDITED}. 13 conjectures total: 6 SUBSUMED-BY-RH (15.2, 15.3, 15.4, 17.3, ' +
    '18.4, 22.4), 4 PARTIALLY-RELATED (16.4, 16.6, 22.2, 22.3), 1 INDEPENDENT-NOVEL ' +
    '(22.1), 2 UNAUDITED (18.1, 18.2). Drives /paper-audit-dashboard page.',
    '18.4, 22.4), 4 PARTIALLY-RELATED (18.1, 18.2, 22.2, 22.3), 1 INDEPENDENT-NOVEL ' +
    '(22.1), 2 UNAUDITED (16.4, 16.6). Drives /paper-audit-dashboard page.',
});

export default PAPER_AUDIT_DASHBOARD;

// ── Build-time tripwires ──────────────────────────────────────────────────

export const PAPER_AUDIT_DASHBOARD_ASSERTIONS = [
  {
    id: 'paper-audit-thirteen-conjectures-present',
    why:
      'The dashboard must track exactly 13 numbered conjectures from paper ' +
      'Sections 15-22 (15.2, 15.3, 15.4, 16.4, 16.6, 17.3, 18.1, 18.2, 18.4, ' +
      '22.1, 22.2, 22.3, 22.4). Dropping or adding one means the dashboard ' +
      'no longer matches the paper.',
    holds: () => {
      const ids = PAPER_AUDIT_DASHBOARD.conjectures.map((c) => c.id);
      const expected = ['15.2', '15.3', '15.4', '16.4', '16.6', '17.3',
                        '18.1', '18.2', '18.4', '22.1', '22.2', '22.3', '22.4'];
      if (ids.length !== expected.length) return false;
      const idSet = new Set(ids);
      return expected.every((e) => idSet.has(e));
    },
  },
  {
    id: 'paper-audit-three-audits-already-done',
    why:
      'imp-1163, imp-1202, and imp-1210 are the three audits completed ' +
      'before imp-1218. The completedAuditTickets list must record all ' +
      'three by ticket id. Dropping one would silently disconnect the ' +
      'dashboard from the audits it summarizes.',
    holds: () => {
      const tickets = PAPER_AUDIT_DASHBOARD.completedAuditTickets.map(
        (t) => t.ticket,
      );
      return tickets.includes('imp-1163') &&
        tickets.includes('imp-1202') &&
        tickets.includes('imp-1210');
    },
  },
  {
    id: 'paper-audit-subsumed-by-rh-15-4-present',
    why:
      'Conjecture 15.4 was audited SUBSUMED-BY-RH via imp-1202 (paired ' +
      'Hadamard makes Re(xi\'/xi) > 0 manifest under RH). The dashboard ' +
      'entry for 15.4 must reflect this verdict and link to imp-1202.',
    holds: () => {
      const c = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '15.4');
      return !!c && c.auditStatus === 'SUBSUMED-BY-RH' &&
        c.auditTicket === 'imp-1202';
    },
  },
  {
    id: 'paper-audit-subsumed-by-rh-22-4-present',
    why:
      'Conjecture 22.4 was audited SUBSUMED-BY-RH via imp-1210 (E_a ' +
      'Hermite-Biehler iff RH per de Branges / Lagarias). The dashboard ' +
      'entry for 22.4 must reflect this verdict and link to imp-1210.',
    holds: () => {
      const c = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '22.4');
      return !!c && c.auditStatus === 'SUBSUMED-BY-RH' &&
        c.auditTicket === 'imp-1210';
    },
  },
  {
    id: 'paper-audit-subsumed-by-rh-15-2-present',
    why:
      'Conjecture 15.2 was audited SUBSUMED-BY-RH via imp-1229 (the paper ' +
      'Section 15 states the shift-bridge threshold theorem makes |X(w-a)| < ' +
      '|X(w+a)| EQUIVALENT TO RH; same Hermite-Biehler statement as 22.4). ' +
      'The dashboard entry for 15.2 must reflect this verdict and link to ' +
      'imp-1229.',
    holds: () => {
      const c = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '15.2');
      return !!c && c.auditStatus === 'SUBSUMED-BY-RH' &&
        c.auditTicket === 'imp-1229';
    },
  },
  {
    id: 'paper-audit-subsumed-by-rh-15-3-present',
    why:
      'Conjecture 15.3 was audited SUBSUMED-BY-RH via imp-1230. The paper ' +
      'itself states 15.3 is equivalent to 15.2 (and hence RH); the ' +
      'Hermite-Biehler condition E_a Hermite-Biehler is identical in content ' +
      'to Conjecture 22.4 (de Branges 1968, Lagarias 2007). The dashboard ' +
      'entry for 15.3 must reflect this verdict and link to imp-1230.',
    holds: () => {
      const c = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '15.3');
      return !!c && c.auditStatus === 'SUBSUMED-BY-RH' &&
        c.auditTicket === 'imp-1230';
    },
  },
  {
    id: 'paper-audit-partially-related-22-2-and-22-3',
    why:
      'Conjectures 22.2 and 22.3 were audited PARTIALLY-RELATED via imp-1210 ' +
      '(22.2 vs Newman/Csordas-Norfolk-Varga universal-factor lit; 22.3 vs ' +
      'Weil/de Branges norm-square lit). Both must carry that verdict ' +
      'linked to imp-1210.',
    holds: () => {
      const c22_2 = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '22.2');
      const c22_3 = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '22.3');
      return !!c22_2 && c22_2.auditStatus === 'PARTIALLY-RELATED' &&
        c22_2.auditTicket === 'imp-1210' &&
        !!c22_3 && c22_3.auditStatus === 'PARTIALLY-RELATED' &&
        c22_3.auditTicket === 'imp-1210';
    },
  },
  {
    id: 'paper-audit-independent-novel-22-1',
    why:
      'Conjecture 22.1 (twin-ladder usefulness) was audited INDEPENDENT-NOVEL ' +
      'via imp-1210 (qualitatively-PARTIALLY-RELATED to Riemann-Siegel / ' +
      'Odlyzko-Schonhage / Hiary, but specific quantitative claim is novel). ' +
      'The dashboard entry must reflect this and link to imp-1210.',
    holds: () => {
      const c = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '22.1');
      return !!c && c.auditStatus === 'INDEPENDENT-NOVEL' &&
        c.auditTicket === 'imp-1210';
    },
  },
  {
    id: 'paper-audit-two-unaudited-conjectures',
    why:
      'Of 13 conjectures, exactly 2 remain UNAUDITED (18.1, 18.2) after ' +
      'imp-1231 confirmed 16.4 and 16.6 PARTIALLY-RELATED. Each UNAUDITED ' +
      'entry must carry auditTicket null and auditDate null -- inventing an ' +
      'audit ticket for a conjecture we have not actually audited would overclaim.',
      'Of 13 conjectures, exactly 2 remain UNAUDITED (16.4, 16.6) after ' +
      'imp-1233 confirmed 18.1 and 18.2 PARTIALLY-RELATED. Each UNAUDITED ' +
      'audit ticket for a conjecture we have not actually audited would ' +
      'overclaim.',
    holds: () => {
      const unaudited = PAPER_AUDIT_DASHBOARD.conjectures.filter(
        (c) => c.auditStatus === 'UNAUDITED',
      );
      if (unaudited.length !== 2) return false;
      const expected = new Set(['18.1', '18.2']);
      const expected = new Set(['16.4', '16.6']);
      return unaudited.every(
        (c) => expected.has(c.id) && c.auditTicket === null &&
          c.auditDate === null,
      );
    },
  },
  {
    id: 'paper-audit-status-counts-sum-to-thirteen',
    why:
      'statusCounts must partition the 13 conjectures exactly: 6 SUBSUMED-BY-' +
      'RH + 0 SUBSUMED-BY-LITERATURE + 4 PARTIALLY-RELATED + 1 INDEPENDENT-' +
      'NOVEL + 2 UNAUDITED = 13 (after imp-1231 moved 16.4 and 16.6 to ' +
      'NOVEL + 2 UNAUDITED = 13 (after imp-1233 moved 18.1 and 18.2 to ' +
      'PARTIALLY-RELATED). Any drift means the dashboard counts do not match ' +
      'the per-conjecture entries.',
    holds: () => {
      const s = PAPER_AUDIT_DASHBOARD.statusCounts;
      const total = s['SUBSUMED-BY-RH'] + s['SUBSUMED-BY-LITERATURE'] +
        s['PARTIALLY-RELATED'] + s['INDEPENDENT-NOVEL'] + s.UNAUDITED;
      return total === PAPER_AUDIT_DASHBOARD.totalCount &&
        PAPER_AUDIT_DASHBOARD.totalCount === 13 &&
        s['SUBSUMED-BY-RH'] === 6 &&
        s['PARTIALLY-RELATED'] === 4 &&
        s['INDEPENDENT-NOVEL'] === 1 &&
        s.UNAUDITED === 2;
    },
  },
  {
    id: 'paper-audit-partially-related-16-4-and-16-6-present',
    why:
      'Conjectures 16.4 and 16.6 were audited PARTIALLY-RELATED via imp-1231 ' +
      '(constructive existence claims: each bundles an RH-equivalent existence ' +
      'half with an open non-circular-construction half; PARTIALLY-RELATED to ' +
      'de Branges 1968 / Krein 1955 / Romanov 2010 / Remling 2002-2018). Both ' +
      'entries must reflect this verdict and link to imp-1231.',
    holds: () => {
      const c16_4 = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '16.4');
      const c16_6 = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '16.6');
      return !!c16_4 && c16_4.auditStatus === 'PARTIALLY-RELATED' &&
        c16_4.auditTicket === 'imp-1231' &&
        !!c16_6 && c16_6.auditStatus === 'PARTIALLY-RELATED' &&
        c16_6.auditTicket === 'imp-1231';
    id: 'paper-audit-partially-related-18-1-and-18-2-present',
      'Conjectures 18.1 and 18.2 were audited PARTIALLY-RELATED via imp-1233 ' +
      '(18.1 vs KYP / de Branges-Krein; 18.2 vs Bombieri-Iwaniec / ' +
      'Vinogradov-Korobov / Weil-positivity). Both must carry that verdict ' +
      'linked to imp-1233.',
      const c18_1 = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '18.1');
      const c18_2 = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '18.2');
      return !!c18_1 && c18_1.auditStatus === 'PARTIALLY-RELATED' &&
        c18_1.auditTicket === 'imp-1233' &&
        !!c18_2 && c18_2.auditStatus === 'PARTIALLY-RELATED' &&
        c18_2.auditTicket === 'imp-1233';
    },
  },
  {
    id: 'paper-audit-subsumed-by-rh-17-3-and-18-4-present',
    why:
      'Conjectures 17.3 and 18.4 were audited SUBSUMED-BY-RH via imp-1232 ' +
      '(Krein-Langer identity: B_a^+=1 is definitionally RH; paper itself ' +
      'states "equivalently RH holds" in 18.4). Both entries must reflect ' +
      'this verdict and link to imp-1232.',
    holds: () => {
      const c17 = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '17.3');
      const c18 = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '18.4');
      return !!c17 && c17.auditStatus === 'SUBSUMED-BY-RH' &&
        c17.auditTicket === 'imp-1232' &&
        !!c18 && c18.auditStatus === 'SUBSUMED-BY-RH' &&
        c18.auditTicket === 'imp-1232';
    },
  },
  {
    id: 'paper-audit-every-status-from-fixed-vocabulary',
    why:
      'Each entry\'s auditStatus must come from the fixed five-element ' +
      'vocabulary {SUBSUMED-BY-RH, SUBSUMED-BY-LITERATURE, PARTIALLY-RELATED, ' +
      'INDEPENDENT-NOVEL, UNAUDITED}. Any deviation (typo, alternative label) ' +
      'silently breaks downstream filtering.',
    holds: () => {
      const allowed = new Set(PAPER_AUDIT_DASHBOARD.verdictVocabulary);
      return PAPER_AUDIT_DASHBOARD.conjectures.every((c) =>
        allowed.has(c.auditStatus),
      );
    },
  },
  {
    id: 'paper-audit-every-entry-has-recommendation',
    why:
      'Each of the 13 conjectures must carry a non-empty recommendationForPaper ' +
      'field of at least 80 characters. Empty or stub recommendations leave the ' +
      'dashboard without actionable output for the paper author.',
    holds: () =>
      PAPER_AUDIT_DASHBOARD.conjectures.every(
        (c) => typeof c.recommendationForPaper === 'string' &&
          c.recommendationForPaper.length >= 80,
      ),
  },
  {
    id: 'paper-audit-honest-scope-discloses-unaudited-predictions',
    why:
      'The honestScope array must explicitly disclose that recommendations ' +
      'for the 4 UNAUDITED conjectures are PREDICTIONS / INDICATIVE rather ' +
      'than completed audits. Per the ticket instructions: do not invent ' +
      'audits you haven\'t done.',
    holds: () => {
      const scope = PAPER_AUDIT_DASHBOARD.honestScope;
      return Array.isArray(scope) && scope.length >= 4 &&
        scope.some((s) => /UNAUDITED|prediction|indicative/i.test(s));
    },
  },
];
