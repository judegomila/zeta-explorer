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
// HONEST READ AS OF IMP-1218
// --------------------------
// Of 13 numbered conjectures spanning Sections 15-22, three have been
// audited so far:
//   * Section 4.5 Conjecture 1 (lin-stat variance) -> SUBSUMED-BY-LITERATURE
//     (Hughes-Rudnick 2003 + Bourgade 2010), via imp-1163. NOTE this is in
//     Section 4, not in 15-22, so it is OUT of this dashboard's coverage --
//     it is named here in the closureNote of the parent ticket for
//     bookkeeping but does not appear in the per-conjecture table.
//   * Conjecture 15.4 (prime-delay domination, infinitesimal form) ->
//     SUBSUMED-BY-RH via paired Hadamard (imp-1202).
//   * Conjecture 22.4 (zero bridge-thickness) -> SUBSUMED-BY-RH via the
//     de Branges / Lagarias formulation (imp-1210).
// Conjectures 22.2 and 22.3 received a PARTIALLY-RELATED verdict, 22.1 is
// INDEPENDENT-NOVEL, and the remaining eight (15.2, 15.3, 16.4, 16.6, 17.3,
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
    auditStatus: 'UNAUDITED',
    auditTicket: null,
    auditDate: null,
    recommendationForPaper:
      'Pending audit. Internally flagged as RH-equivalent in the paper itself ' +
      '(via the shift-bridge threshold theorem). A literature audit comparable ' +
      'to imp-1210 should formally walk the de Branges / Lagarias machinery ' +
      'and assign verdict SUBSUMED-BY-RH if confirmed.',
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
    auditStatus: 'UNAUDITED',
    auditTicket: null,
    auditDate: null,
    recommendationForPaper:
      'Pending audit. The paper itself notes equivalence to 15.2 and hence ' +
      'to RH. This is the same de Branges Hermite-Biehler statement as ' +
      'Conjecture 22.4 (already audited SUBSUMED-BY-RH); a follow-up audit ' +
      'should cross-link to imp-1210 and likely assign SUBSUMED-BY-RH.',
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
    auditStatus: 'UNAUDITED',
    auditTicket: null,
    auditDate: null,
    recommendationForPaper:
      'Pending audit. Closely related to Conjecture 22.3 (bridge-norm ' +
      'realization), already audited PARTIALLY-RELATED via imp-1210 (Weil ' +
      '1952 / Bombieri 2003 / de Branges 1968 / Lagarias 2007). A targeted ' +
      'audit should cross-link to imp-1210 22.3 and likely inherit ' +
      'PARTIALLY-RELATED (the non-circular constraint is the open novel ' +
      'content).',
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
    auditStatus: 'UNAUDITED',
    auditTicket: null,
    auditDate: null,
    recommendationForPaper:
      'Pending audit. Sits on top of de Branges canonical-system theory ' +
      '(Krein 1955, de Branges 1968). A targeted audit should compare to ' +
      'the Connes 1999 / 2025-2026 noncommutative-geometric attacks (the ' +
      'imp-1205 crosswalk has partial coverage) and likely classify ' +
      'PARTIALLY-RELATED with the non-circular kernel-only construction as ' +
      'the genuinely-open content.',
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
    auditStatus: 'UNAUDITED',
    auditTicket: null,
    auditDate: null,
    recommendationForPaper:
      'Pending audit. The paper Section 17.6 itself derives RH-equivalence. ' +
      'This is structurally identical to Conjecture 22.4 (already SUBSUMED-' +
      'BY-RH via imp-1210). A targeted audit should cross-link and assign ' +
      'SUBSUMED-BY-RH; the paper should present 17.3, 18.4, and 22.4 ' +
      'together as a single RH-equivalent reformulation rather than three ' +
      'independent conjectures.',
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
    auditStatus: 'UNAUDITED',
    auditTicket: null,
    auditDate: null,
    recommendationForPaper:
      'Pending audit. Strongly overlaps with Conjecture 16.6 (canonical-' +
      'system closure) and with Conjecture 22.3 (bridge-norm realization, ' +
      'already PARTIALLY-RELATED via imp-1210). A targeted audit should ' +
      'cross-link to imp-1210 22.3 and to KYP/bounded-real literature ' +
      '(Anderson-Vongpanitlerd 1973, Yakubovich-Kalman-Popov classical KYP).',
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
    auditStatus: 'UNAUDITED',
    auditTicket: null,
    auditDate: null,
    recommendationForPaper:
      'Pending audit. Structurally identical to Conjecture 15.4 (already ' +
      'SUBSUMED-BY-RH via imp-1202: paired Hadamard makes Re(xi\'/xi) > 0 ' +
      'manifest under RH). A targeted audit should cross-link to imp-1202 ' +
      'and likely inherit SUBSUMED-BY-RH; the quantitative-form follow-up ' +
      '(imp-1202-sub-quantitative-form) carries any independent content.',
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
    auditStatus: 'UNAUDITED',
    auditTicket: null,
    auditDate: null,
    recommendationForPaper:
      'Pending audit. Verbatim equivalent to Conjecture 17.3 and the ' +
      'Hermite-Biehler form of Conjecture 22.4 (already SUBSUMED-BY-RH via ' +
      'imp-1210). A targeted audit should cross-link and assign SUBSUMED-BY-' +
      'RH. The paper should present 17.3, 18.4, 22.4 as a single RH-' +
      'equivalent reformulation.',
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
  'As of imp-1218 only 5 of 13 conjectures (15.4, 22.1, 22.2, 22.3, 22.4) ' +
    'have received a verdict. The remaining 8 (15.2, 15.3, 16.4, 16.6, ' +
    '17.3, 18.1, 18.2, 18.4) are UNAUDITED with auditTicket = null. ' +
    'recommendationForPaper for those 8 is a PREDICTION of the likely ' +
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
  'The recommendationForPaper text for the 8 UNAUDITED conjectures is ' +
    'INDICATIVE -- it notes the cross-references (e.g. 17.3 is structurally ' +
    'identical to 22.4) but is not a substitute for a per-conjecture ' +
    'literature audit ticket. Follow-up tickets per conjecture are the ' +
    'natural extension of this dashboard.',
]);

// ── Frozen export ─────────────────────────────────────────────────────────

export const PAPER_AUDIT_DASHBOARD = Object.freeze({
  id: 'paper-audit-dashboard',
  ticket: 'imp-1218',
  builtAt: '2026-05-26T18:00:00Z',
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
  ]),

  honestScope: HONEST_SCOPE,

  closureNote:
    'DASHBOARD: living tracker of every named conjecture in v52 paper ' +
    'Sections 15-22, with per-conjecture verdict in {SUBSUMED-BY-RH, ' +
    'SUBSUMED-BY-LITERATURE, PARTIALLY-RELATED, INDEPENDENT-NOVEL, ' +
    'UNAUDITED}. 13 conjectures total: 2 SUBSUMED-BY-RH (15.4, 22.4), ' +
    '2 PARTIALLY-RELATED (22.2, 22.3), 1 INDEPENDENT-NOVEL (22.1), 8 ' +
    'UNAUDITED. Drives /paper-audit-dashboard page.',
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
    id: 'paper-audit-eight-unaudited-conjectures',
    why:
      'Of 13 conjectures, exactly 8 remain UNAUDITED (15.2, 15.3, 16.4, 16.6, ' +
      '17.3, 18.1, 18.2, 18.4). Each UNAUDITED entry must carry auditTicket ' +
      'null and auditDate null -- inventing an audit ticket for a conjecture ' +
      'we have not actually audited would overclaim.',
    holds: () => {
      const unaudited = PAPER_AUDIT_DASHBOARD.conjectures.filter(
        (c) => c.auditStatus === 'UNAUDITED',
      );
      if (unaudited.length !== 8) return false;
      const expected = new Set(['15.2', '15.3', '16.4', '16.6', '17.3',
                                '18.1', '18.2', '18.4']);
      return unaudited.every(
        (c) => expected.has(c.id) && c.auditTicket === null &&
          c.auditDate === null,
      );
    },
  },
  {
    id: 'paper-audit-status-counts-sum-to-thirteen',
    why:
      'statusCounts must partition the 13 conjectures exactly: 2 SUBSUMED-BY-' +
      'RH + 0 SUBSUMED-BY-LITERATURE + 2 PARTIALLY-RELATED + 1 INDEPENDENT-' +
      'NOVEL + 8 UNAUDITED = 13. Any drift would mean the dashboard counts ' +
      'don\'t match the per-conjecture entries.',
    holds: () => {
      const s = PAPER_AUDIT_DASHBOARD.statusCounts;
      const total = s['SUBSUMED-BY-RH'] + s['SUBSUMED-BY-LITERATURE'] +
        s['PARTIALLY-RELATED'] + s['INDEPENDENT-NOVEL'] + s.UNAUDITED;
      return total === PAPER_AUDIT_DASHBOARD.totalCount &&
        PAPER_AUDIT_DASHBOARD.totalCount === 13 &&
        s['SUBSUMED-BY-RH'] === 2 &&
        s['PARTIALLY-RELATED'] === 2 &&
        s['INDEPENDENT-NOVEL'] === 1 &&
        s.UNAUDITED === 8;
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
      'for the 8 UNAUDITED conjectures are PREDICTIONS / INDICATIVE rather ' +
      'than completed audits. Per the ticket instructions: do not invent ' +
      'audits you haven\'t done.',
    holds: () => {
      const scope = PAPER_AUDIT_DASHBOARD.honestScope;
      return Array.isArray(scope) && scope.length >= 4 &&
        scope.some((s) => /UNAUDITED|prediction|indicative/i.test(s));
    },
  },
];
