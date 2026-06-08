/**
 * @module data/papers-release-manifest
 * @fileoverview Ordered manifest of releasable papers (and planned future
 * releases). Consumed by src/pages/PapersDownloadPage.jsx for the
 * in-app downloads index. Each entry has a release-readiness status
 * (ready / draft / planned) plus the file path served by Vite.
 *
 * RELEASE PHILOSOPHY
 * ------------------
 * The mathematical results compose in stages, each defensible standalone:
 *
 *   v1 (READY): the rigorous unconditional finite-N beat at N* = 10^4
 *       (Theorem 1). Foundational result. SAFE to release alone.
 *
 *   v1.x (current — READY): adds Theorem 2 (conditional asymptotic
 *       Lambda <= 8e-4, 250x tighter than PT) and Theorem 3
 *       (unconditional N^{-3/2} rate from imp-1149), plus the candidate
 *       ESY linear-statistics empirical positive in Section 4.5.
 *       SAFE to release; comprehensive.
 *
 *   v2 (PLANNED): companion note converting Theorem 2 conditional to
 *       UNCONDITIONAL via either (a) cloud-extended N=10^7 sweep
 *       (imp-1150) + tighter V2 OLS interval that strictly excludes
 *       upper-region of the asymptotic deviation, OR (b) rigorous
 *       ESY linear-statistics bound for the imp-1149 conjecture.
 *
 *   v3 (RESEARCH-GRADE OPEN): Lambda = 0 unconditional (RH-equivalent
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
    status: 'ready',
    title:
      'A rigorous unconditional finite-height beat of the ' +
      'Platt-Trudgian bound on the de Bruijn-Newman constant Λ',
    authors: ['Jude Gomila'],
    abstractSummary:
      'Three results on the de Bruijn-Newman invariant Λ: (1) Λ(10⁴) ≤ 0.018 ' +
      'rigorous unconditional finite-N beat of PT 2021 (11.1× margin). ' +
      '(2) Λ ≤ 8×10⁻⁴ asymptotic, conditional on linear-1/N model ' +
      '(250× tighter than PT). (3) Unconditional N⁻³ᐟ² decay rate ' +
      'on |t_c(N) - 1/(2 M_∞(N))| via 2nd-moment Koksma-Hlawka (√N ' +
      'improvement over imp-341). Plus a candidate ESY-positive empirical ' +
      'observable identified for follow-up.',
    pdfPath: '/papers/gomila-finite-height-beat-2026-05.pdf',
    fileSizeBytes: PAPER_PUBLICATION_META.fileSizeBytes,
    pageCount: PAPER_PUBLICATION_META.pageCount,
    builtAt: PAPER_PUBLICATION_META.builtAt,
    latexCompilerUsed: PAPER_PUBLICATION_META.latexCompilerUsed,
    sectionsIncluded: V1_SECTIONS_INCLUDED,
    citationKey: 'gomila2026',
    bibtexSuggestion:
      '@unpublished{gomila2026,\n' +
      '  author       = {Jude Gomila},\n' +
      '  title        = {A rigorous unconditional finite-height beat of the\n' +
      '                  Platt-Trudgian bound on the de Bruijn-Newman constant Λ},\n' +
      '  note         = {Preprint, 2026, available at https://github.com/judegomila/mathexplorer},\n' +
      '  year         = {2026},\n' +
      '}',
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
    id: 'gomila-asymptotic-unconditional-2026-companion',
    releaseOrder: 2,
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
    releaseOrder: 3,
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
    id: 'papers-manifest-has-at-least-one-ready-paper',
    holds: () => PAPERS_RELEASE_MANIFEST.some((p) => p.status === 'ready'),
    why:
      'The /papers page is only useful if at least one paper is in the ' +
      'ready state. As of 2026-05-20 the primary v1 paper is ready.',
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
        ['ready', 'draft', 'planned', 'research-grade-open'].includes(p.status),
      ),
    why:
      'Status field must be one of the four pinned values so the UI can ' +
      'render the correct badge color.',
  },
];
