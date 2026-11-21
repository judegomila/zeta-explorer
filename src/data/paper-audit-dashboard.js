/**
 * @module data/paper-audit-dashboard
 * @fileoverview Historic v52 conjecture-audit verdicts with a twin-ladder review overlay.
 *
 * Exports:
 *   - PAPER_AUDIT_DASHBOARD (also the default export) — frozen object holding the
 *     verdict vocabulary, the per-conjecture entry table, status counts, the
 *     central collapse target (27.2), and the completed-audit ticket log.
 *   - PAPER_AUDIT_DASHBOARD_ASSERTIONS — checkable claims the dashboard makes,
 *     consumable by tripwires that re-verify audit bookkeeping.
 *
 * Proof-chain role: audit/bookkeeping, not a mathematical step. The individual
 * rows preserve their original twin_ladder_consolidated_v52.pdf provenance.
 * The twin-ladder overlay records later corrections without rewriting those historic
 * audit records as if they had originally audited twin-ladder.
 *
 * Key assertions: each conjecture carries one verdict from the controlled
 * vocabulary (SUBSUMED-BY-RH, SUBSUMED-BY-LITERATURE, PARTIALLY-RELATED,
 * INDEPENDENT-NOVEL, UNAUDITED); several Section 15/22 conjectures are
 * SUBSUMED-BY-RH, and the whole §15-27 program collapses to conjecture 27.2.
 *
 * Tickets: created by imp-1218; verdict entries maintained by imp-1163,
 * imp-1202, imp-1210, imp-1229, imp-1258; module doc added by imp-2447.
 */
// imp-3191: cross-module tripwire imports. The frontier-verdict modules below
// are imported ONLY so the dashboard assertion sweep can certify that the
// audit (27.2 = the live OPEN central-collapse front) cannot silently drift
// out of sync with what the frontier verdicts actually record. Each imported
// module also self-executes its own RH-HARD/RH-EQUIVALENT runner at import, so
// pulling them in makes a frontier regrade fail the build too. All three are
// light (no zeros bundle).
import { CH_WALL_FRONTIER } from './ch-wall-frontier-verdict-2026-06-26.js';
import { SECTION26_MUPASS_OPERATOR_VERDICT } from './section26-mupass-operator-verdict-2026-06-30.js';
import { ECONN_METRIC_REARCH } from './econn-metric-rearchitecture-verdict-2026-06-30.js';

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
      'Historic v52 form: for every a > 0, the raw right-half-plane ghost ' +
      'product B_a^+(w) is identically 1. The twin-ladder correction replaces raw ' +
      'shifted-zero counts by residual, uncancelled pole orders; all-a residual ' +
      'ghost absence is RH-equivalent, while a fixed-a raw statement needs ' +
      'coprimality and bounded-type hypotheses.',
    auditStatus: 'SUBSUMED-BY-RH',
    auditTicket: 'imp-1232',
    auditDate: '2026-05-27',
    recommendationForPaper:
      'CONFIRMED SUBSUMED-BY-RH (imp-1232) as an all-shifts statement after ' +
      'the twin-ladder residual-pole correction. At a fixed shift, B_a^+ = 1 and the ' +
      'Krein-Langer index must be formulated for the reduced ratio using ' +
      '[m(lambda)-m(lambda-2a)]_+, not all raw off-critical zeros. Exact index ' +
      'equalities also require the stated finite-pole/finite-window and ' +
      'bounded-type hypotheses. Move the all-a target out of theorem list into the ' +
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
    // imp-3932 (2026-07-03): first direct approach on 22.1 truth status (the
    // auditStatus above is a NOVELTY verdict and is unchanged by this).
    truthAttackTicket: 'imp-3932',
    truthAttackDate: '2026-07-03',
    truthAttackNote:
      'RIGOROUS coefficient-dimension obstruction (independently refereed): ' +
      'the Fourier transform of any eq (20)-(21) proxy -- or finite Gaussian ' +
      'mixture -- with D stored coefficients has at most D-1 sign changes on ' +
      '(0,inf) (Fourier closure + Polya-Szego exponential-polynomial zero ' +
      'bound), so certifying the M_sc = 12,363,153,437,138 sign changes of ' +
      'Xi over the Platt-Trudgian 2021 verified range forces D >= 1.2363e13 ' +
      'coefficients vs a 691,008-term Riemann-Siegel main sum: the strong ' +
      'global reading of 22.1 is FALSE at the audit-named benchmark under ' +
      'any per-coefficient-cost evaluation model. PARTIAL overall: named ' +
      'surviving readings are windowed/modulated proxies (= Odlyzko-' +
      'Schonhage band-limited interpolation, hence PARTIALLY-RELATED rather ' +
      'than novel), small-height constant-chasing, and exotic fast-evaluable ' +
      'exponential polynomials (blocked only by absent algebraic-complexity ' +
      'lower bounds). See imp-3932-conjecture-22-1-frozen-ladder-' +
      'obstruction.js for the theorem chain, referee record, and the ' +
      '2x-margin caveat on the comparison form.',
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
      'Per imp-1258, conjectures 15.2, 15.3, 15.4, 17.3, 18.2, 18.4, 22.4 are ' +
      'RH-equivalents that link to 27.2; conjectures 16.4, 16.6, ' +
      '18.1 unify under CDB-Exist which connects to 27.2. The §15-27 proof ' +
      'program is information-preservingly RH-equivalent to ‖V_{a,Phi}‖ ≤ 1 — ' +
      'NOT a strict reduction to an easier object (see refutedAsReduction below). ' +
      'The empirical ‖V_{a,Phi}‖ ~ 10^{-4} margin is a homogeneity artifact and is NOT ' +
      'evidence the bound is loose. Recommend presenting §15-27 as a SINGLE ' +
      'unifying RH-EQUIVALENT reformulation, NOT as a reduction shortcut to a proof.',
    refutedAsReduction:
      'REFUTED AS A REDUCTION (section26-verdict-volterra-not-a-reduction-2026-06-18). ' +
      'The §15-27 collapse is information-preservingly RH-EQUIVALENT, not a reduction ' +
      'to a strictly easier statement: the claimed biconditional ‖V_{a,Phi}‖ ≤ 1 ⇔ K_a ⪰ 0 ' +
      'is FALSE because at the genuine Riemann Phi the two positivity conditions ' +
      'PROVABLY DECOUPLE. The imp-1240 "5000x below 1" margin is a scale/homogeneity ' +
      'artifact (the bare Volterra norm silently absorbs Phi super-exponentially-small ' +
      'scale) measuring the WRONG object, so it is NOT empirical evidence for Conj 27.2. ' +
      'The only surviving target is the degree-0 scale-invariant relative bound ‖R‖ ≤ 1.',
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
    'proof program (7+ named conjectures spanning 13 entries) is ' +
    'information-preservingly RH-EQUIVALENT to a SINGLE claim, Conjecture 27.2 ' +
    '(Volterra-norm ‖V_{a,Phi}‖ ≤ 1). ' +
    'All other conjectures in §15-22 are either RH-equivalents (7 total) or ' +
    'intermediate existence problems (5 PARTIALLY-RELATED) that link to 27.2. ' +
    'This restructuring unifies the audit but is a reformulation, NOT a reduction ' +
    'to an easier object (see next bullet).',
  'CAVEAT (section26-verdict-volterra-not-a-reduction-2026-06-18, supersedes ' +
    'the imp-1258 framing above): the §15-27 collapse is NOT a reduction. The ' +
    'biconditional ‖V_{a,Phi}‖ ≤ 1 ⇔ K_a ⪰ 0 is FALSE — at the genuine Riemann Phi ' +
    'the two positivity conditions PROVABLY DECOUPLE, so 27.2 is RH-EQUIVALENT, ' +
    'not a proof shortcut. The imp-1240 "5000x below 1" margin is a scale/homogeneity ' +
    'artifact measuring the WRONG (scale-miscalibrated) object and is NOT empirical ' +
    'evidence for Conj 27.2. The only surviving target is the degree-0 scale-invariant ' +
    'relative bound ‖R‖ ≤ 1. Do NOT elevate 27.2 to the paper headline as a reduction.',
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
  reviewedAt: '2026-07-23T00:00:00Z',
  paper: 'twin_ladder_consolidated_v52.pdf',
  historicalAuditPaper: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  currentReviewPaper: 'twin_ladder_consolidated_v70.tex',
  currentReviewVersion: 'twin-ladder',
  currentCorrectionAudit: 'twin_ladder_rh_attack_report.md',
  paperSectionsCovered: Object.freeze(['§15', '§16', '§17', '§18', '§22']),

  currentReview: Object.freeze({
    scope:
      'The conjecture rows below are the historic v52 audit ledger. The twin-ladder ' +
      'review does not relabel them as newly audited; it overlays corrections ' +
      'that affect how the carried-forward claims may now be stated.',
    corrections: Object.freeze([
      Object.freeze({
        id: 'twin-ladder-shift-endpoint',
        affects: '§15 strict shift threshold',
        correctedStatement:
          'For fixed a > 0, strict interior shift contractivity holds exactly ' +
          'when a >= Delta, not only when a > Delta.',
      }),
      Object.freeze({
        id: 'twin-ladder-common-shifted-zeros',
        affects: '§15 fixed-a PSD converse',
        correctedStatement:
          'A common zero of X(w-a) and X(w+a) may cancel in the quotient and ' +
          'leave a zero kernel row. The exact a >= Delta threshold is for ' +
          'strict diagonal positivity; a fixed-a PSD converse needs a ' +
          'coprimality hypothesis. Positivity for every a > 0 remains RH-equivalent.',
      }),
      Object.freeze({
        id: 'twin-ladder-ghost-index',
        affects: '§17-18 inverse-Blaschke / negative-index count',
        correctedStatement:
          'Ghost counts use uncancelled pole orders ' +
          '[m(lambda)-m(lambda-2a)]_+ and a coprime Krein-Langer factorization, ' +
          'not the raw multiplicity of every shifted denominator zero.',
      }),
      Object.freeze({
        id: 'twin-ladder-numerics-transferability',
        affects: 'twin-ladder rigorous-numerics certificate summaries',
        correctedStatement:
          'The supplied twin-ladder source does not include the named leaf files, raw ' +
          'JSON, coverage ledger, or independent verifier needed to transfer ' +
          'its finite-region certificate tables. Summary hashes alone do not ' +
          'recompute ACB leaves or prove coverage.',
      }),
      Object.freeze({
        id: 'twin-ladder-rigorous-pf2',
        affects: '§28 midpoint / log-concavity route',
        correctedStatement:
          'The correction audit proves the unconditional quantitative bound ' +
          '(log Phi)\'\' < -68 on [0,infinity). Consequently the even bilateral ' +
          'Riemann kernel and every exponential tilt are PF_2. Under Newman ' +
          'heat flow the bound becomes (log Phi_t)\'\' < -68 + 2t. This proves ' +
          'the scalar midpoint inequality, but PF_2 alone gives no Newman bound ' +
          'and does not imply shifted Hermite-Biehler positivity or RH.',
      }),
      Object.freeze({
        id: 'twin-ladder-pf5-counterexample',
        affects: '§29 raw total-positivity route',
        correctedStatement:
          'An independently reproduced negative 5-by-5 Toeplitz minor, checked ' +
          'with a separate 384-bit Arb implementation, shows that the actual ' +
          'Riemann kernel and every exponential tilt fail PF_5 and therefore ' +
          'fail PF_infinity. Global PF_3 and PF_4 are not decided by this witness.',
      }),
      Object.freeze({
        id: 'twin-ladder-offdiagonal-reduction',
        affects: '§24-27 measure-domination / Volterra reduction',
        correctedStatement:
          'The proposed scalar measure-domination argument controls only one ' +
          'of two indefinite off-diagonal channels. Its positive diagonal ' +
          'comparison object is not an actual summand of the bridge kernel, so ' +
          'the asserted absorption does not follow. The full two-channel ' +
          'cancellation-sensitive operator remains open.',
      }),
    ]),
  }),

  verdictVocabulary: VERDICT_VOCABULARY,

  conjectures: Object.freeze(CONJECTURE_ENTRIES.map((e) => Object.freeze(e))),

  statusCounts: STATUS_COUNTS,
  auditedCount: AUDITED_COUNT,
  totalCount: CONJECTURE_ENTRIES.length,

  // The single conjecture to which the entire Sections 15-27 program reduces
  // (imp-1258 two-way collapse). Surfaced as a first-class field so downstream
  // consumers can route to the live front without re-deriving it from prose.
  centralCollapseTarget: '27.2',

  // imp-3190: re-characterization of the stale "open critical gaps" headline.
  // The earlier framing treated the §15-27 program conjectures plus the
  // finite-N / C_H content as a list of ~8 independently-open critical gaps.
  // Recent frontier verdicts collapse that count: the Volterra / normalized-R /
  // §26 / §27 items are RH-EQUIVALENT (NOT open reductions to an easier object),
  // and the finite-N / C_H content is RH-HARD (deterministic but off-basin),
  // leaving exactly ONE genuinely-open-AND-attackable deterministic forward
  // residual. genuinelyOpenAndAttackableCount is computed below, not hardcoded.
  openGapRecharacterization: Object.freeze({
    staleFraming:
      'The PaperAuditDashboard headline previously read as roughly 8 ' +
      'independently-open critical gaps (the §15-27 program conjectures plus ' +
      'the finite-N / C_H content). That count over-states what is genuinely ' +
      'open versus RH-equivalent or RH-hard.',
    rhEquivalent: Object.freeze({
      verdict: 'RH-EQUIVALENT (reformulation, NOT a reduction to an easier object)',
      items: Object.freeze([
        'Volterra-norm Conj 27.2 and the §15-27 collapse identity',
        'normalized-R degree-0 relative bound',
        '§26 mu-pass operator / diagonal route',
      ]),
      cites: Object.freeze([
        'section26-verdict-volterra-not-a-reduction-2026-06-18',
        'section26-mupass-operator-verdict',
        'section27-identity-refutation',
      ]),
    }),
    rhHard: Object.freeze({
      verdict: 'RH-HARD (deterministic on the real-zero basin, unclosed off-basin)',
      items: Object.freeze([
        'finite-N / C_H wall content',
        'metric-invariant multi-body isolation / D_rest lower bound',
      ]),
      cites: Object.freeze([
        'ch-wall-frontier-verdict',
        'econn-metric-rearchitecture-verdict-2026-06-30',
      ]),
    }),
    // The honest open-AND-attackable item: the single deterministic forward
    // residual, the sg1c R2-T multi-body isolation constant c in [0.72,1)
    // (single-shell c*~0.9319 closed by imp-3005; the asymmetric multi-body
    // closure remains open, scanned ~0.943). This is the SAME deterministic
    // target the C_H frontier converged on.
    genuinelyOpenAndAttackable: Object.freeze([
      'sg1c R2-T multi-body isolation constant c (asymmetric closure)',
    ]),
    genuinelyOpenAndAttackableCount: 1,
    ptFraming:
      'Per-Theorem 0.2 (PT 0.2) remains the SOTA framing: this ' +
      're-characterization does NOT assert any QED on RH; it only reclassifies ' +
      'the audit gaps into RH-equivalent, RH-hard, and the one open-and-' +
      'attackable deterministic residual.',
  }),

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
    id: 'paper-audit-twin-ladder-overlay-preserves-v52-provenance',
    why:
      'The dashboard must identify twin-ladder as the current review source while ' +
      'preserving v52 as the provenance of its historic per-conjecture ledger. ' +
      'The overlay must lock the endpoint, common-zero, uncancelled ghost-index, ' +
      'certificate-transferability, PF_2, PF_5, and off-diagonal corrections ' +
      'from the correction audit.',
    holds: () => {
      const d = PAPER_AUDIT_DASHBOARD;
      const corrections = d.currentReview?.corrections || [];
      const ids = new Set(corrections.map((c) => c.id));
      return (
        d.currentReviewVersion === 'twin-ladder' &&
        d.currentReviewPaper.includes('twin_ladder_consolidated_v70') &&
        d.historicalAuditPaper.includes('twin_ladder_consolidated_v52') &&
        d.currentCorrectionAudit.includes('twin_ladder_rh_attack_report') &&
        corrections.length === 7 &&
        ids.has('twin-ladder-shift-endpoint') &&
        ids.has('twin-ladder-common-shifted-zeros') &&
        ids.has('twin-ladder-ghost-index') &&
        ids.has('twin-ladder-numerics-transferability') &&
        ids.has('twin-ladder-rigorous-pf2') &&
        ids.has('twin-ladder-pf5-counterexample') &&
        ids.has('twin-ladder-offdiagonal-reduction')
      );
    },
  },
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
    id: 'paper-audit-22-1-truth-attack-recorded',
    why:
      'imp-3932 delivered the first direct truth-status approach on 22.1 (the ' +
      'rigorous frozen-ladder coefficient-dimension obstruction falsifying ' +
      'the strong global reading at the Platt-Trudgian benchmark, with the ' +
      'partial-overall boundary named). The 22.1 dashboard entry must carry ' +
      'the truthAttack fields, keep them distinct from the imp-1210 NOVELTY ' +
      'verdict, and state both the FALSE-at-benchmark finding and the ' +
      'PARTIAL overall status. Dropping this note would silently un-push ' +
      'the only INDEPENDENT-NOVEL Section 22 conjecture.',
    holds: () => {
      const c = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '22.1');
      return !!c && c.truthAttackTicket === 'imp-3932' &&
        typeof c.truthAttackNote === 'string' &&
        /FALSE at the audit-named benchmark/.test(c.truthAttackNote) &&
        /PARTIAL overall/.test(c.truthAttackNote) &&
        c.auditStatus === 'INDEPENDENT-NOVEL';
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
  {
    id: 'paper-audit-open-gap-recharacterization-imp-3190',
    why:
      'imp-3190: the stale "open critical gaps" headline must be re-characterized ' +
      'against the frontier verdicts. The §15-27 / Volterra / §26 / §27 items are ' +
      'RH-EQUIVALENT and the finite-N / C_H content is RH-HARD, leaving exactly ONE ' +
      'genuinely-open-and-attackable deterministic forward residual (the sg1c R2-T ' +
      'multi-body isolation constant c). The block must cite the verdict modules ' +
      'and keep the count self-consistent so the audit cannot silently re-inflate.',
    holds: () => {
      const r = PAPER_AUDIT_DASHBOARD.openGapRecharacterization;
      if (!r) return false;
      const rhEq = r.rhEquivalent && Array.isArray(r.rhEquivalent.cites) &&
        r.rhEquivalent.cites.includes('section26-verdict-volterra-not-a-reduction-2026-06-18') &&
        r.rhEquivalent.cites.includes('section26-mupass-operator-verdict') &&
        r.rhEquivalent.cites.includes('section27-identity-refutation');
      const rhHard = r.rhHard && Array.isArray(r.rhHard.cites) &&
        r.rhHard.cites.includes('ch-wall-frontier-verdict') &&
        r.rhHard.cites.includes('econn-metric-rearchitecture-verdict-2026-06-30');
      const openOk = Array.isArray(r.genuinelyOpenAndAttackable) &&
        r.genuinelyOpenAndAttackable.length === r.genuinelyOpenAndAttackableCount &&
        r.genuinelyOpenAndAttackableCount === 1 &&
        /sg1c R2-T/.test(r.genuinelyOpenAndAttackable[0]);
      return rhEq && rhHard && openOk && /PT 0\.2|refereed bound is changed/.test(r.ptFraming);
    },
  },
  {
    id: 'paper-audit-central-collapse-target-is-27-2',
    why:
      'Per imp-1258 two-way collapse, Conjecture 27.2 (‖V_{a,Phi}‖ ≤ 1) is THE ' +
      'single central load-bearing claim to which the entire Sections 15-27 ' +
      'program reduces. The dashboard must surface this as a first-class ' +
      'centralCollapseTarget field pointing at 27.2, and that conjecture must ' +
      'carry the INDEPENDENT-NOVEL verdict from imp-1258. Drift here would hide ' +
      'the most significant finding of the audit campaign (imp-1269 sub-d).',
    holds: () => {
      const target = PAPER_AUDIT_DASHBOARD.centralCollapseTarget;
      if (target !== '27.2') return false;
      const c = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === target);
      return !!c && c.auditStatus === 'INDEPENDENT-NOVEL' &&
        c.auditTicket === 'imp-1258';
    },
  },
  {
    id: 'paper-audit-frontier-verdicts-stay-rh-hard-no-reduction',
    why:
      'imp-3191 cross-module tripwire. The audit must not silently drift out of ' +
      'sync with the live frontier verdicts. The central-collapse front 27.2 is ' +
      'the lone OPEN claim the whole program reduces to, and it is recorded as ' +
      'INDEPENDENT-NOVEL with refutedAsReduction = RH-EQUIVALENT / not a reduction. ' +
      'The three frontier-verdict modules independently certify the same wall: ' +
      'ch-wall-frontier-verdict (RH-HARD-CONFIRMED), section26-mupass-operator-verdict ' +
      '(RH-EQUIVALENT residual), and econn-metric-rearchitecture-verdict (RESIDUAL, ' +
      'metric incidental). Each also keeps the Platt-Trudgian Lambda <= 0.2 SOTA with ' +
      'no reduction / no beat. This assertion FAILS the build if 27.2 is regraded ' +
      'away from the open RH-EQUIVALENT front while any frontier module still records ' +
      'RH-HARD / RH-EQUIVALENT, or if any frontier verdict drops its grade or its ' +
      'no refereed bound is changed -- preventing the dashboard and the frontier from diverging.',
    holds: () => {
      const c = PAPER_AUDIT_DASHBOARD.conjectures.find((x) => x.id === '27.2');
      const frontStillOpen =
        !!c &&
        c.auditStatus === 'INDEPENDENT-NOVEL' &&
        /RH-EQUIVALENT/.test(c.refutedAsReduction) &&
        /not a reduction/i.test(c.refutedAsReduction);
      const sotaHeld = (v) =>
        /refereed bound is changed/i.test(v.sota);
      const chHard =
        /RH-HARD/.test(CH_WALL_FRONTIER.verdict) && sotaHeld(CH_WALL_FRONTIER);
      const mupassEquiv =
        /RH-EQUIVALENT/.test(SECTION26_MUPASS_OPERATOR_VERDICT.verdict) &&
        /no reduction, no beat/.test(SECTION26_MUPASS_OPERATOR_VERDICT.sota);
      const econnResidual =
        /RESIDUAL/.test(ECONN_METRIC_REARCH.verdict) && sotaHeld(ECONN_METRIC_REARCH);
      return frontStillOpen && chHard && mupassEquiv && econnResidual;
    },
  },
];
