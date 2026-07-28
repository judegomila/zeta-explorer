/**
 * @module data/papers-release-manifest
 * @fileoverview Ordered manifest of releasable papers (and planned future
 * releases). Consumed by src/pages/PapersDownloadPage.jsx for the
 * in-app downloads index. Withdrawn artifacts remain in repository history
 * for provenance but are not offered as current downloads.
 *
 * RELEASE PHILOSOPHY
 * ------------------
 * The mathematical results compose in stages, each defensible standalone:
 *
 *   Entry 1 (WITHDRAWN): its finite-N headline depended on undischarged C_H
 *       and was incorrectly labeled an unconditional theorem.
 *
 *   Entry 2 (PRIVATE REFEREE DRAFT): the immutable review-01787854-v3
 *       standalone package proposes an unconditional computer-assisted proof
 *       of Lambda <= 0.1787854. Its exact replays pass, but the mathematics
 *       remains unreviewed and the bound is not established.
 *
 *   Entry 3 (PLANNED): companion note converting Theorem 2 conditional to
 *       UNCONDITIONAL via either (a) cloud-extended N=10^7 sweep
 *       (imp-1150) + tighter V2 OLS interval that strictly excludes
 *       upper-region of the asymptotic deviation, OR (b) rigorous
 *       ESY linear-statistics bound for the imp-1149 conjecture.
 *
 *   Entry 4 (RESEARCH-GRADE OPEN): Lambda = 0 unconditional (RH-equivalent
 *       via Polymath15 bridge step 4 G6a_shock_lipschitz closure).
 */

// IMPORTANT: import ONLY the lightweight metadata mirror, never the full
// PAPER_PUBLICATION from paper-publication-2026-05.js. That module pulls a
// heavy transitive chain (… → zeros-to-1e6.js, a 16.7 MB blob) which, when
// dragged into this manifest, gets bundled into the lazy PapersDownloadPage
// chunk. The browser then spends so long parsing/executing the 16.7 MB chunk
// that React never mounts before the page-health checker samples it, so the
// page reads as "0 chars" with no error (same failure mode fixed for
// LambdaBoundsPage in 49f8d10f). The meta mirror carries every field this
// page actually renders.
import { PAPER_PUBLICATION_META } from './paper-publication-meta.js';

// sectionsIncluded is NOT mirrored in the meta module; keep it here as a
// static literal (kept in sync with SECTIONS_INCLUDED in
// paper-publication-2026-05.js). This is display-only and load-bearing for
// nothing beyond the collapsible "Sections" list on the page.
const V1_SECTIONS_INCLUDED = Object.freeze([
  'Abstract',
  'Section 1. Introduction',
  'Section 2. Background',
  'Section 3. Main result (Theorem 1 + Corollary 1 + 6-link proof sketch)',
  'Section 4. Conclusion and open problems',
  'Appendix C. Six-link rigor chain',
  'Appendix C-prime. Hybrid factor table (2026-05-19 refresh, imp-1127)',
  'Section 4. Asymptotic bound via Barnes-Hut multipole sweep (imp-1147, NEW 2026-05-20)',
  'Appendix D. Refresh log 2026-05-19 (imp-1123 + imp-1125 + imp-1127 + imp-1128)',
  'Bibliography (8 entries: de Bruijn 1950, Newman 1976, Ingham 1940, ' +
    'Iwaniec-Kowalski 2004, ESY 2011, Polymath15 2018, Rodgers-Tao 2020, ' +
    'Platt-Trudgian 2021)',
]);

export const PAPERS_RELEASE_MANIFEST = Object.freeze([
  Object.freeze({
    id: 'gomila-finite-height-beat-2026-05',
    releaseOrder: 1,
    status: 'withdrawn',
    title: '[WITHDRAWN] May 2026 finite-height manuscript',
    authors: ['Jude Gomila'],
    abstractSummary:
      'Withdrawn from the release surface after audit: the claimed Λ(10⁴) ≤ 0.018 ' +
      'unconditional beat depends on the undischarged many-body constant C_H. It is a ' +
      'model estimate, not a theorem or a state-of-the-art improvement. The binary remains ' +
      'in repository history for provenance but is not a current publication.',
    pdfPath: null,
    fileSizeBytes: PAPER_PUBLICATION_META.fileSizeBytes,
    pageCount: PAPER_PUBLICATION_META.pageCount,
    builtAt: PAPER_PUBLICATION_META.builtAt,
    latexCompilerUsed: PAPER_PUBLICATION_META.latexCompilerUsed,
    sectionsIncluded: V1_SECTIONS_INCLUDED,
    citationKey: 'gomila2026',
    bibtexSuggestion: null,
    blockers: Object.freeze([
      'Discharge C_H with a rigorous N-uniform theorem',
      'Rewrite and independently review every headline claim before republication',
    ]),
    releaseChecklist: Object.freeze([
      Object.freeze({ item: 'Build passes', done: true }),
      Object.freeze({ item: '8+ build-time tripwires', done: true }),
      Object.freeze({ item: 'Cross-verified independent integrator', done: true,
        notes: 'imp-1086 DP45 + imp-1140 Verner 8(7); both within tolerance.' }),
      Object.freeze({ item: 'Honest scope flags on conditional results', done: true,
        notes: 'Theorem 2 explicitly flagged conditional on linear 1/N.' }),
      Object.freeze({ item: 'Named open sub-gaps for residual obstructions', done: true,
        notes: '3 obstructions in §4.5; 2 ruled out, 1 (ESY) candidate-live.' }),
      Object.freeze({ item: 'arXiv submission', done: false,
        notes: 'Ready to submit; waiting on user action.' }),
    ]),
    relatedTickets: Object.freeze([
      'imp-440',  'imp-963',  'imp-1082', 'imp-1087', 'imp-1088',
      'imp-1132', 'imp-1136', 'imp-1137', 'imp-1139', 'imp-1145',
      'imp-1147', 'imp-1148', 'imp-1149',
    ]),
  }),

  Object.freeze({
    id: 'dbn-lambda-01787854-candidate-audit-v3',
    releaseOrder: 2,
    status: 'draft',
    title:
      'A Candidate for an Unconditional Computer-Assisted Proof of Lambda <= 0.1787854',
    authors: ['Jude Gomila'],
    abstractSummary:
      'PRIVATE REFEREE DRAFT. The immutable review-01787854-v3 package proposes ' +
      'an unconditional computer-assisted proof of Lambda <= 0.1787854. Both exact-commit ' +
      'replay lanes pass, but the cited-theorem applications, handwritten reductions, ' +
      'proof-to-code maps, and interval computations still require independent validation. ' +
      'The proposed bound is not an established theorem and does not prove RH.',
    pdfPath: '/papers/dbn-lambda-01787854-candidate-audit-v3.pdf',
    provenancePath:
      '/papers/dbn-lambda-01787854-candidate-audit-v3.provenance.txt',
    fileSizeBytes: 73703,
    pageCount: 21,
    builtAt: '2026-07-27',
    pdfSha256: 'b1151d56bc2917d98e3ff4047c0426f44ee88e6cf7edd1a6ca3c47ef324b1172',
    releaseTag: 'review-01787854-v3',
    releaseCommit: '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea',
    releaseUrl:
      'https://github.com/judegomila/dbn-lambda-01787854-candidate-audit/releases/tag/review-01787854-v3',
    sectionsIncluded: Object.freeze([
      'Abstract and review status',
      'Criterion and exact candidate row',
      'Proof architecture and dependency discipline',
      'Verified-height hypothesis',
      'Finite final-time corpus',
      'Native binding, height transfer, and window freeze',
      'Infinite all-N tail theorem',
      'Closed barrier, derivative bounds, prisms, and winding',
      'Final theorem weld',
      'Evidence hierarchy, reproduction protocol, and referee protocol',
      'Risk register, conclusion, references, and exact numerical ledger',
    ]),
    citationKey: null,
    bibtexSuggestion: null,
    blockers: Object.freeze([
      'Independent line-by-line review of the published-theorem applications and all new analytic reductions',
      'Independent proof-to-code audit and genuinely separate recomputation',
      'Referee sign-off before any theorem, publication, or public-priority claim',
    ]),
    releaseChecklist: Object.freeze([
      Object.freeze({ item: 'Immutable v3 release and 362-entry seal', done: true }),
      Object.freeze({ item: 'Exact-commit full-review workflow', done: true }),
      Object.freeze({ item: 'Complete 3,149,013-row replay', done: true }),
      Object.freeze({ item: 'Exact-image and offline cold replay', done: true }),
      Object.freeze({ item: 'Independent mathematical referee report', done: false }),
      Object.freeze({ item: 'Independent computational referee report', done: false }),
    ]),
    relatedTickets: Object.freeze([]),
  }),

  Object.freeze({
    id: 'gomila-asymptotic-unconditional-2026-companion',
    releaseOrder: 3,
    status: 'planned',
    title:
      'Unconditional asymptotic improvement of the de Bruijn-Newman ' +
      'bound via [TBD: ESY linear-statistics OR cloud-sweep tightening]',
    authors: ['Jude Gomila'],
    abstractSummary:
      'PLANNED companion paper. Lifts the conditional asymptotic ' +
      'Λ ≤ 8×10⁻⁴ from Theorem 2 of the primary paper to UNCONDITIONAL ' +
      'via one of two routes: (a) cloud-extended N=10⁷ sweep (imp-1150) ' +
      'driving V2 OLS interval bracket below the residual conditional ' +
      'tolerance, OR (b) rigorous bound on the candidate ESY ' +
      'linear-statistics observable identified in §4.5 of the primary paper.',
    pdfPath: null,
    fileSizeBytes: 0,
    pageCount: 0,
    builtAt: null,
    citationKey: 'gomila2026-companion',
    bibtexSuggestion: null,
    blockers: Object.freeze([
      'Either imp-1150 cloud sweep at N=10⁷ landing measured rows',
      'OR imp-1149-sub-erdos-schlein-yau-port-residual elevation from ' +
        'empirical positive (conjecture only) to rigorous theorem',
    ]),
    estimatedTime: '2-4 months active research',
    relatedTickets: ['imp-1150', 'imp-1149-sub-erdos-schlein-yau-port-residual'],
  }),

  Object.freeze({
    id: 'gomila-lambda-equals-zero-research-grade-open',
    releaseOrder: 4,
    status: 'research-grade-open',
    title:
      'A rigorous unconditional proof of Λ = 0 (RH-equivalent)',
    authors: ['Jude Gomila'],
    abstractSummary:
      'RESEARCH-GRADE OPEN. Would close the Riemann Hypothesis via ' +
      'the Polymath15 bridge: rigorously close G6a_shock_lipschitz ' +
      '(longstanding open) + an unconditional asymptotic Λ ≤ 0 from ' +
      'the bridge chain. Decades of community work likely required.',
    pdfPath: null,
    fileSizeBytes: 0,
    pageCount: 0,
    builtAt: null,
    citationKey: 'gomila-rh-future',
    bibtexSuggestion: null,
    blockers: Object.freeze([
      'G6a_shock_lipschitz closure — longstanding open Polymath15 sub-gap',
      'Full asymptotic Lambda = 0 unconditional via bridge chain',
    ]),
    estimatedTime: 'Decades of community research',
    relatedTickets: ['imp-345', 'imp-366', 'imp-454', 'imp-470'],
  }),
]);

export const PAPERS_RELEASE_MANIFEST_ASSERTIONS = [
  {
    id: 'papers-manifest-has-no-promoted-withdrawn-paper',
    holds: () => PAPERS_RELEASE_MANIFEST.every(
      (p) => p.id !== 'gomila-finite-height-beat-2026-05' || p.status === 'withdrawn',
    ),
    why:
      'The May 2026 manuscript must remain withdrawn until its undischarged C_H dependency is replaced by a theorem.',
  },
  {
    id: 'papers-manifest-v3-candidate-paper-is-pinned-and-not-promoted',
    holds: () => {
      const paper = PAPERS_RELEASE_MANIFEST.find(
        (p) => p.id === 'dbn-lambda-01787854-candidate-audit-v3',
      );
      return (
        paper?.status === 'draft' &&
        paper?.pdfPath === '/papers/dbn-lambda-01787854-candidate-audit-v3.pdf' &&
        paper?.provenancePath ===
          '/papers/dbn-lambda-01787854-candidate-audit-v3.provenance.txt' &&
        paper?.pageCount === 21 &&
        paper?.fileSizeBytes === 73703 &&
        paper?.pdfSha256 ===
          'b1151d56bc2917d98e3ff4047c0426f44ee88e6cf7edd1a6ca3c47ef324b1172' &&
        paper?.releaseTag === 'review-01787854-v3' &&
        paper?.releaseCommit === '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea' &&
        paper?.releaseChecklist?.some(
          (item) => item.item === 'Independent mathematical referee report' && item.done === false,
        )
      );
    },
    why:
      'The referee manuscript must remain downloadable as a pinned private-review draft without being promoted to an established or publication-ready theorem.',
  },
  {
    id: 'papers-manifest-release-order-strictly-increasing',
    holds: () => {
      for (let i = 1; i < PAPERS_RELEASE_MANIFEST.length; i++) {
        if (
          PAPERS_RELEASE_MANIFEST[i].releaseOrder <=
          PAPERS_RELEASE_MANIFEST[i - 1].releaseOrder
        )
          return false;
      }
      return true;
    },
    why:
      'releaseOrder must be strictly increasing so the UI shows papers ' +
      'in the intended release sequence.',
  },
  {
    id: 'papers-manifest-ready-papers-have-pdf-path',
    holds: () =>
      PAPERS_RELEASE_MANIFEST.filter((p) => p.status === 'ready').every(
        (p) => p.pdfPath && p.pdfPath.startsWith('/papers/') && p.pageCount > 0,
      ),
    why:
      'Any paper marked ready must point at an actual served PDF (pdfPath ' +
      'starting /papers/) with a non-zero page count.',
  },
  {
    id: 'papers-manifest-authors-contains-gomila',
    holds: () =>
      PAPERS_RELEASE_MANIFEST.every(
        (p) => Array.isArray(p.authors) && p.authors.some((a) => a.includes('Gomila')),
      ),
    why:
      'Every paper in this manifest credits Jude Gomila as an author. ' +
      'Catches accidental author removal in a future edit.',
  },
  {
    id: 'papers-manifest-statuses-pinned',
    holds: () =>
      PAPERS_RELEASE_MANIFEST.every((p) =>
        ['ready', 'draft', 'withdrawn', 'planned', 'research-grade-open'].includes(p.status),
      ),
    why:
      'Status field must be one of the pinned values so the UI can ' +
      'render the correct badge color.',
  },
];
