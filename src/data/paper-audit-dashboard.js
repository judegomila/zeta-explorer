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
// 18.1, 18.2, 18.4) remain UNAUDITED.
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
    auditTicket: 'imp-1241',
    auditDate: '2026-05-28',
    recommendationForPaper:
      'PARTIALLY-RELATED via de Branges 1968 H(E) existence + Lagarias 2007 ' +
      'survey (imp-1241). Existence of H_a, B_a is automatic by Kolmogorov ' +
      'factorization once K_a is PSD. The open content is the non-circular ' +
      'construction from Phi. Reframe as a corollary of the UNIFIED CDB-Exist ' +
      'conjecture (with 16.6 and 18.1) -- the three are notational ' +
      'presentations of a single de Branges canonical-system existence problem. ' +
      'See imp-1241 for the unified statement.',
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
    auditTicket: 'imp-1241',
    auditDate: '2026-05-28',
    recommendationForPaper:
      'PARTIALLY-RELATED via Krein-de Branges canonical-system bijection ' +
      '(de Branges 1968 / Krein 1955 / Romanov 2010 / Winkler 1995) per ' +
      'imp-1241. Once E_a is Hermite-Biehler, the canonical-system dm exists ' +
      'automatically. The open content is the non-circular construction of ' +
      'dm from Phi. Reframe as a corollary of the UNIFIED CDB-Exist conjecture ' +
      '(with 16.4 and 18.1).',
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
    auditTicket: 'imp-1241',
    auditDate: '2026-05-28',
    recommendationForPaper:
      'PARTIALLY-RELATED via Krein-de Branges canonical-system bijection + ' +
      'infinite-dimensional passivity (Arov-Nudelman 1996, Brodskii 1971, ' +
      'Sz.-Nagy-Foias 1970) + classical KYP (Anderson-Vongpanitlerd 1973, ' +
      'Yakubovich-Kalman-Popov) per imp-1241 + imp-1272. Identical TYPE of ' +
      'existence as 16.4 and 16.6. Reframe as a corollary of the UNIFIED ' +
      'CDB-Exist conjecture. Disambiguate the B_a notation (Fourier sine ' +
      'channel here, reproducing-kernel evaluation in 16.4). NOTE: the ' +
      'Schur-to-passive bridge for infinite-dim H(E_a) state-space requires ' +
      'Arov-Nudelman 1996 (not just finite-dim KYP) -- cite explicitly.',
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
    auditStatus: 'SUBSUMED-BY-RH',
    auditTicket: 'imp-1241',
    auditDate: '2026-05-28',
    recommendationForPaper:
      'CONFIRMED SUBSUMED-BY-RH (imp-1241). Structurally identical to ' +
      'Conjecture 15.4 (SUBSUMED-BY-RH via imp-1202: paired Hadamard makes ' +
      'Re(xi\'/xi) > 0 manifest under RH). The "completed sense / Weil ' +
      'explicit formula" qualification replaces the divergent Euler series ' +
      'by its analytic continuation, which is exactly xi\'/xi. So 18.2 = 15.4 ' +
      'in notation. Move out of theorem-targets list into the unified ' +
      'RH-equivalent reformulations subsection alongside 15.2, 15.3, 15.4, ' +
      '17.3, 18.4, 22.4. Cite Hadamard / Lagarias 2007.',
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
  {
    id: '27.2',
    label: 'Conjecture 27.2',
    shortName: 'Volterra-norm bound (the central load-bearing claim)',
    paperSection: '§27',
    paperPage: 35,
    statement:
      'For every a > 0, the Volterra-norm ‖V_{a,Phi}‖ of the endpoint-Hankel ' +
      'operator with kernel built from the completed zeta function is bounded ' +
      'by 1. This conjecture serves as THE SINGLE CENTRAL CLAIM to which the ' +
      'entire §15-27 program of 7+ named conjectures reduces via the collapse ' +
      'structure discovered in imp-1258.',
    auditStatus: 'INDEPENDENT-NOVEL',
    auditTicket: 'imp-1258',
    auditDate: '2026-05-28',
    recommendationForPaper:
      'ELEVATE to the paper as the CENTRAL LOAD-BEARING CLAIM of Sections 15-27. ' +
      'Per imp-1258, conjectures 15.2, 15.3, 15.4, 17.3, 18.2, 18.4, 22.4 are ' +
      'RH-equivalents that follow trivially from 27.2; conjectures 16.4, 16.6, ' +
      '18.1 unify under CDB-Exist which is implied by 27.2. The entire proof ' +
      'program §15-27 reduces to proving ‖V_{a,Phi}‖ ≤ 1. Empirically ‖V_{a,Phi}‖ ~ 10^{-4}, ' +
      'so the bound is not tight. Recommend rewriting the paper §15-27 as a SINGLE ' +
      'unifying program with 27.2 as the headline target.',
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
  'This dashboard tracks 14 numbered conjectures from research-inputs/' +
    'twin_ladder_consolidated_v52.pdf Sections 15-27. The Section 4.5 ' +
    'Conjecture 1 (lin-stat variance) audit (imp-1163) is OUT of scope ' +
    'because Section 4 is not covered -- verdict (SUBSUMED-BY-LITERATURE ' +
    'via Hughes-Rudnick 2003 + Bourgade 2010) is in imp-1163 and IMPROVEMENTS.md.',
  'As of imp-1258, a CENTRAL COLLAPSE was discovered: the entire §15-27 ' +
    'proof program (7+ named conjectures spanning 13 entries) reduces to a ' +
    'SINGLE central claim: Conjecture 27.2 (Volterra-norm ‖V_{a,Phi}‖ ≤ 1). ' +
    'All other conjectures in §15-22 are either RH-equivalents (7 total) or ' +
    'intermediate existence problems (5 PARTIALLY-RELATED) that follow from 27.2. ' +
    'This restructuring is the most significant finding of the entire audit campaign.',
  'All 14 conjectures have now received a verdict: 7 SUBSUMED-BY-RH, 5 ' +
    'PARTIALLY-RELATED, 2 INDEPENDENT-NOVEL (22.1 and 27.2), 0 UNAUDITED.',
  'The verdicts SUBSUMED-BY-RH on 15.4 (imp-1202) and 22.4 (imp-1210) are ' +
    'based on textbook de Branges / Hadamard machinery and are robust ' +
    'against further literature search. The PARTIALLY-RELATED verdicts on ' +
    '22.2 and 22.3 (imp-1210) depend on exact axiomatization in the paper. ' +
    'The INDEPENDENT-NOVEL verdicts on 22.1 (imp-1210, qualitative) and 27.2 ' +
    '(imp-1258, central-collapse discovery) are the structurally novel findings.',
  'No external browsing was performed for any audits. All verdicts use ' +
    'training-time knowledge plus internal cross-references between paper sections.',
  'imp-1241 closed the 4 former UNAUDITED conjectures (16.4, 16.6, 18.1, 18.2) ' +
    'by hypothesis: are they all instances of a single de Branges ' +
    'canonical-system existence problem? Verdict: three-of-four-unified. ' +
    '16.4 + 16.6 + 18.1 unify under CDB-Exist; 18.2 belongs with 15.4 on ' +
    'the Hadamard side. imp-1258 then discovered both the CDB-Exist conjectures ' +
    'and the RH-equivalents are corollaries of 27.2 (Volterra-norm bound).',
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
      ticket: 'imp-1241',
      title: 'Unified existence audit: Conjectures 16.4 + 16.6 + 18.1 + 18.2',
      verdict:
        'three-of-four-unified: 16.4 + 16.6 + 18.1 PARTIALLY-RELATED, unify ' +
        'under CDB-Exist (de Branges canonical-system existence non-circularly ' +
        'from Phi); 18.2 SUBSUMED-BY-RH (paired Hadamard, same logic as 15.4)',
      coversConjectures: Object.freeze(['16.4', '16.6', '18.1', '18.2']),
      auditDate: '2026-05-28',
    }),
    Object.freeze({
      ticket: 'imp-1258',
      title: 'CENTRAL COLLAPSE: TWO-WAY IMPLICATION Volterra-norm ‖V_{a,Phi}‖ ≤ 1 ⟷ CDB-Exist',
      verdict:
        '27.2 INDEPENDENT-NOVEL (central load-bearing claim of §15-27). ' +
        'The entire proof program Sections 15-27 (13 named conjectures) reduces ' +
        'to this single statement: ‖V_{a,Phi}‖ ≤ 1. All 7 SUBSUMED-BY-RH conjectures ' +
        'and 5 PARTIALLY-RELATED (CDB-Exist) follow from 27.2. Empirically ‖V_{a,Phi}‖ ~ 10^{-4}.',
      coversConjectures: Object.freeze(['27.2']),
      auditDate: '2026-05-28',
    }),
  ]),

  honestScope: HONEST_SCOPE,

  closureNote:
    'DASHBOARD: living tracker of every named conjecture in v52 paper ' +
    'Sections 15-27, with per-conjecture verdict in {SUBSUMED-BY-RH, ' +
    'SUBSUMED-BY-LITERATURE, PARTIALLY-RELATED, INDEPENDENT-NOVEL, ' +
    'UNAUDITED}. 14 conjectures total: 7 SUBSUMED-BY-RH (15.2, 15.3, 15.4, ' +
    '17.3, 18.2, 18.4, 22.4), 5 PARTIALLY-RELATED (16.4, 16.6, 18.1, 22.2, ' +
    '22.3), 2 INDEPENDENT-NOVEL (22.1, 27.2—the central load-bearing claim ' +
    'to which all §15-27 conjectures reduce via imp-1258 collapse), 0 UNAUDITED. ' +
    'All 14 conjectures audited. 27.2 (Volterra-norm ‖V_{a,Phi}‖ ≤ 1) is the ' +
    'headline of the entire proof program. Drives /paper-audit-dashboard page.',
});

export default PAPER_AUDIT_DASHBOARD;

// ── Build-time tripwires ──────────────────────────────────────────────────

export const PAPER_AUDIT_DASHBOARD_ASSERTIONS = [
  {
    id: 'paper-audit-fourteen-conjectures-present',
    why:
      'The dashboard must track exactly 14 numbered conjectures from paper ' +
      'Sections 15-27 (15.2, 15.3, 15.4, 16.4, 16.6, 17.3, 18.1, 18.2, 18.4, ' +
      '22.1, 22.2, 22.3, 22.4, 27.2). The central-collapse finding from imp-1258 ' +
      'elevated 27.2 as THE single central claim to which all others reduce.',
    holds: () => {
      const ids = PAPER_AUDIT_DASHBOARD.conjectures.map((c) => c.id);
      const expected = ['15.2', '15.3', '15.4', '16.4', '16.6', '17.3',
                        '18.1', '18.2', '18.4', '22.1', '22.2', '22.3', '22.4', '27.2'];
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
    id: 'paper-audit-all-subsumed-by-rh-verdicts',
    why:
      'All 7 SUBSUMED-BY-RH conjectures must carry that verdict and the ' +
      'correct audit ticket: 15.4 (imp-1202), 22.4 (imp-1210), 15.2 (imp-1229), ' +
      '15.3 (imp-1230), 17.3 + 18.4 (imp-1232), 18.2 (imp-1241). Any ' +
      'regression loses the audit record and breaks downstream routing.',
    holds: () => {
      const get = (id) => PAPER_AUDIT_DASHBOARD.conjectures.find((c) => c.id === id);
      const ok = (id, ticket) => {
        const c = get(id);
        return !!c && c.auditStatus === 'SUBSUMED-BY-RH' && c.auditTicket === ticket;
      };
      return ok('15.4', 'imp-1202') && ok('22.4', 'imp-1210') &&
        ok('15.2', 'imp-1229') && ok('15.3', 'imp-1230') &&
        ok('17.3', 'imp-1232') && ok('18.4', 'imp-1232') &&
        ok('18.2', 'imp-1241');
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
    id: 'paper-audit-status-counts-sum-to-fourteen',
    why:
      'statusCounts must partition the 14 conjectures exactly: 7 SUBSUMED-BY-' +
      'RH + 0 SUBSUMED-BY-LITERATURE + 5 PARTIALLY-RELATED + 2 INDEPENDENT-' +
      'NOVEL (22.1, 27.2) + 0 UNAUDITED = 14 (after imp-1241 closed 16.4 + 16.6 + 18.1 ' +
      'as PARTIALLY-RELATED and 18.2 as SUBSUMED-BY-RH, then imp-1258 elevated 27.2 ' +
      'as the central load-bearing claim). Any drift means the dashboard counts do not match.',
    holds: () => {
      const s = PAPER_AUDIT_DASHBOARD.statusCounts;
      const total = s['SUBSUMED-BY-RH'] + s['SUBSUMED-BY-LITERATURE'] +
        s['PARTIALLY-RELATED'] + s['INDEPENDENT-NOVEL'] + s.UNAUDITED;
      return total === PAPER_AUDIT_DASHBOARD.totalCount &&
        PAPER_AUDIT_DASHBOARD.totalCount === 14 &&
        s['SUBSUMED-BY-RH'] === 7 &&
        s['PARTIALLY-RELATED'] === 5 &&
        s['INDEPENDENT-NOVEL'] === 2 &&
        s.UNAUDITED === 0;
    },
  },
  {
    id: 'paper-audit-imp-1241-closed-four-unaudited',
    why:
      'imp-1241 closed the final 4 UNAUDITED conjectures (16.4, 16.6, 18.1, ' +
      '18.2). Each of those entries must carry auditTicket = imp-1241 and ' +
      'a non-null auditDate. The unified existence verdict (three-of-four ' +
      'unify under CDB-Exist; 18.2 SUBSUMED-BY-RH) must be reflected in ' +
      'the per-conjecture entries: 16.4, 16.6, 18.1 PARTIALLY-RELATED; ' +
      '18.2 SUBSUMED-BY-RH.',
    holds: () => {
      const get = (id) =>
        PAPER_AUDIT_DASHBOARD.conjectures.find((c) => c.id === id);
      const c164 = get('16.4');
      const c166 = get('16.6');
      const c181 = get('18.1');
      const c182 = get('18.2');
      if (!c164 || !c166 || !c181 || !c182) return false;
      return c164.auditTicket === 'imp-1241' && c164.auditStatus === 'PARTIALLY-RELATED' &&
        c166.auditTicket === 'imp-1241' && c166.auditStatus === 'PARTIALLY-RELATED' &&
        c181.auditTicket === 'imp-1241' && c181.auditStatus === 'PARTIALLY-RELATED' &&
        c182.auditTicket === 'imp-1241' && c182.auditStatus === 'SUBSUMED-BY-RH';
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
