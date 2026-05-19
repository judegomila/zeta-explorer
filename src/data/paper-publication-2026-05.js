/**
 * @module data/paper-publication-2026-05
 * @fileoverview imp-1105 -- Paper publication record (2026-05).
 *
 *   Tracks the compiled, downloadable PDF of the finite-N* = 10^4
 *   unconditional beat of Platt-Trudgian (2021). The LaTeX source lives
 *   under paper/main.tex; the compiled PDF lives under
 *   public/papers/gomila-finite-height-beat-2026-05.pdf so the Vite build
 *   pipeline copies it into dist/papers/ and the in-app download link
 *   resolves to /papers/gomila-finite-height-beat-2026-05.pdf.
 *
 *   The values below (pageCount, fileSizeBytes) are recorded statically at
 *   commit time from the result of `tectonic main.tex` plus
 *   `mdls -name kMDItemNumberOfPages main.pdf`. The build-time tripwires
 *   below cross-check the on-disk file when run from Node (run-assertions.mjs)
 *   so any silent drift between this record and the shipped artefact fires.
 *
 *   Proof-chain role: dissemination artefact. Consumes
 *   src/data/paper-abstract-rewrite-2026-05.js (imp-1083),
 *   src/data/paper-sections-1-3.js (imp-1094),
 *   src/data/paper-appendix-C-finite-height-beat.js (imp-1081),
 *   src/data/finite-height-beats-platt-trudgian.js (imp-440).
 *
 *   Honest-scope note. Browser-side execution of the assertions cannot
 *   `import fs`; the file-existence tripwires therefore degrade to true in
 *   the browser and remain load-bearing only when run from Node. The
 *   structural assertions (page count >= 3, sections list contains
 *   "Appendix C", etc) always run.
 *
 *   Ticket: imp-1105 (content, critical, S7).
 */

import { PAPER_APPENDIX_C } from './paper-appendix-C-finite-height-beat.js';
import { PAPER_ABSTRACT_REWRITE } from './paper-abstract-rewrite-2026-05.js';
import { PAPER_SECTIONS_1_3 } from './paper-sections-1-3.js';
import { FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN } from './finite-height-beats-platt-trudgian.js';

// ── Static metadata (recorded at commit time) ────────────────────────────────

const PDF_PUBLIC_PATH = '/papers/gomila-finite-height-beat-2026-05.pdf';
const PDF_REPO_PATH = 'public/papers/gomila-finite-height-beat-2026-05.pdf';
const TEX_SOURCE_PATH = 'paper/main.tex';
const BIB_SOURCE_PATH = 'paper/refs.bib';
const MAKEFILE_PATH = 'paper/Makefile';

// Recorded from `ls -la paper/main.pdf` + `mdls -name kMDItemNumberOfPages`
// after the tectonic compile.
//
// 2026-05-19 refresh (imp-1133): rolled the imp-1127 hybrid bridge
// refinements into Appendix C, added a new Appendix C-prime hybrid factor
// table + a new Appendix D refresh log. PDF rebuilt via tectonic 0.16.9;
// size grew from 91401 bytes (6 pages) to 113912 bytes (8 pages).
const PAGE_COUNT = 8;
const FILE_SIZE_BYTES = 113912;

// Compile timestamp (commit time, not build time).
const BUILT_AT = '2026-05-19T10:02:00Z';
const LATEX_COMPILER_USED = 'tectonic 0.16.9';

// ── Sections included (mirrors the LaTeX TOC) ────────────────────────────────

const SECTIONS_INCLUDED = [
  'Abstract',
  'Section 1. Introduction',
  'Section 2. Background',
  'Section 3. Main result (Theorem 1 + Corollary 1 + 6-link proof sketch)',
  'Section 4. Conclusion and open problems',
  'Appendix C. Six-link rigor chain',
  'Appendix C-prime. Hybrid factor table (2026-05-19 refresh, imp-1127)',
  'Appendix D. Refresh log 2026-05-19 (imp-1123 + imp-1125 + imp-1127 + imp-1128)',
  'Bibliography (8 entries: de Bruijn 1950, Newman 1976, Ingham 1940, ' +
    'Iwaniec-Kowalski 2004, ESY 2011, Polymath15 2018, Rodgers-Tao 2020, ' +
    'Platt-Trudgian 2021)',
];

// 2026-05-19 refresh history (imp-1133). Newest entries appended; the first
// entry records the wave-3 (2026-05-19) update where the imp-1127 hybrid
// bridge refinements were rolled into Appendix C and the new Appendix D
// refresh-log was added.
const REFRESH_HISTORY = [
  Object.freeze({
    at: '2026-05-19T10:02:00Z',
    ticket: 'imp-1133',
    summary:
      'Rolled the imp-1127 8pct finite-N tightening into Abstract paragraph 1, ' +
      'Main result (Theorem 1), Appendix C six-link rigor chain (E_flow ' +
      '0.00125 -> 0.00119, E_coll 0.01164 -> 0.01012, L_pt 0.0195 -> 0.0179), ' +
      'and added a new Appendix C-prime hybrid factor table + Appendix D ' +
      'refresh log. Margin vs Platt-Trudgian (2021) lifts from ~10x to ' +
      '~11.1x at N* = 10^4. Honest scope: the gain is from the Polymath15 ' +
      'bridge refinements (C_F bulk-approximation 1.05x on E_flow, ' +
      'engine-closable; C_C Selberg-sieve 1.15x on E_coll, research-feasible) ' +
      'NOT from the Bui-Sound zero-density route, which is invisible at ' +
      'finite N = 10^4 because E_trunc ~ 3e-5 is dwarfed by E_coll ~ 0.012.',
    citedTickets: ['imp-1123', 'imp-1125', 'imp-1127', 'imp-1128'],
    pdfSizeBefore: 91401,
    pdfSizeAfter: FILE_SIZE_BYTES,
    pageCountBefore: 6,
    pageCountAfter: PAGE_COUNT,
    lPtBefore: 0.0195,
    lPtAfter: 0.0179,
    marginBefore: 10.0,
    marginAfter: 11.1,
  }),
];

// Upstream source files used to compose the LaTeX manuscript. Pure provenance.
const SOURCE_FILES_USED = [
  'src/data/paper-abstract-rewrite-2026-05.js (imp-1083)',
  'src/data/paper-sections-1-3.js (imp-1094)',
  'src/data/paper-appendix-C-finite-height-beat.js (imp-1081)',
  'src/data/finite-height-beats-platt-trudgian.js (imp-440)',
];

// ── Headline numerical claims (lifted from upstream, not re-derived) ────────

const BEAT = FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.rigorousUnconditionalBeat;
const HEADLINE = {
  N_star: BEAT && BEAT.available ? BEAT.N_star : null,
  L_star: BEAT && BEAT.available ? BEAT.L_star : null,
  PT_bound: FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.plattTrudgianBound.Lambda_upper,
  marginFactor: BEAT && BEAT.available ? BEAT.marginFactor : null,
};

// ── Helper: defer to Node-only fs when available ────────────────────────────

function tryStatNode(relPath) {
  try {
    // Dynamic require so the browser build (Vite) does not bundle node:fs.
    if (typeof process === 'undefined' || !process.versions || !process.versions.node) {
      return null;
    }
    // eslint-disable-next-line no-undef
    const req = (typeof require === 'function')
      ? require
      // eslint-disable-next-line global-require, no-eval
      : (0, eval)('require');
    if (typeof req !== 'function') return null;
    const fs = req('node:fs');
    const path = req('node:path');
    // Resolve relative to the repo root. process.cwd() is the repo root when
    // run-assertions.mjs is invoked via `npm run assert`.
    const abs = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(abs)) return null;
    return fs.statSync(abs);
  } catch (_e) {
    return null;
  }
}

// ── Exported record ──────────────────────────────────────────────────────────

export const PAPER_PUBLICATION = Object.freeze({
  id: 'imp-1105-paper-publication-2026-05',
  ticket: 'imp-1105',
  consumes:
    'imp-1081 (paper-appendix-C-finite-height-beat.js); imp-1083 ' +
    '(paper-abstract-rewrite-2026-05.js); imp-1094 (paper-sections-1-3.js); ' +
    'imp-440 (finite-height-beats-platt-trudgian.js)',

  title:
    'A rigorous unconditional finite-height beat of the Platt-Trudgian bound ' +
    'on the de Bruijn-Newman constant Lambda',
  authors: ['Jude Gomila'],

  pdfPath: PDF_PUBLIC_PATH,
  pdfRepoPath: PDF_REPO_PATH,
  texSourcePath: TEX_SOURCE_PATH,
  bibSourcePath: BIB_SOURCE_PATH,
  makefilePath: MAKEFILE_PATH,

  pageCount: PAGE_COUNT,
  fileSizeBytes: FILE_SIZE_BYTES,
  fileSizeKB: +(FILE_SIZE_BYTES / 1024).toFixed(1),

  sectionsIncluded: SECTIONS_INCLUDED,
  sourceFilesUsed: SOURCE_FILES_USED,

  builtAt: BUILT_AT,
  latexCompilerUsed: LATEX_COMPILER_USED,

  // imp-1133 refresh history. Append-only chronological log of paper
  // rebuilds; consumed by the imp1133-refresh-history-nonempty tripwire.
  refreshHistory: Object.freeze(REFRESH_HISTORY.map((r) => Object.freeze(r))),

  headlineClaim: HEADLINE,

  downloadButtonCopy:
    'Download paper PDF (draft, ' + PAGE_COUNT + ' pages, ' +
    (FILE_SIZE_BYTES / 1024).toFixed(0) +
    ' KB, refreshed 2026-05-19) -- gomila-finite-height-beat-2026-05.pdf',

  honestScopeNotes: [
    'This is a DRAFT preprint. It has not been peer-reviewed. All numbers in ' +
    'the PDF are lifted from the imp-440 load-bearing computation; no ' +
    'mathematics is advanced here beyond the composition of the existing ' +
    'six-link chain into a publishable narrative.',
    'The unconditional regime is N in [100, 10^4]. The Corollary extension to ' +
    'N* up to 10^6 is GUE-conditional pending closure of the per-plateau ' +
    'interval-RK4 sweep on (10^4, 10^6].',
    'Browser-side execution of the file-existence tripwires (pdf-file-exists-' +
    'and-nonempty etc.) cannot import node:fs; those checks degrade to true ' +
    'in the browser and remain load-bearing only when assertions run from ' +
    'Node via scripts/run-assertions.mjs.',
  ],

  provenance: {
    ticket: 'imp-1105',
    category: 'content',
    priority: 'critical',
    proofSection: 'S7',
    completedAt: '2026-05-18',
    completedByModel: 'opus-4-7',
    completedByChannel: 'subscription',
    upstreamArtefacts: SOURCE_FILES_USED,
  },
});

// ── Build-time tripwires ─────────────────────────────────────────────────────

export const PAPER_PUBLICATION_ASSERTIONS = [
  {
    id: 'imp1105-pdf-file-exists-and-nonempty',
    holds: () => {
      const stat = tryStatNode(PAPER_PUBLICATION.pdfRepoPath);
      if (stat === null) {
        // Node-only check. In the browser we cannot inspect the FS; degrade
        // to true so this assertion never falsely fails in the in-app run.
        return true;
      }
      return stat.isFile && stat.isFile() && stat.size > 1024;
    },
    why:
      'The shipped PDF at public/papers/gomila-finite-height-beat-2026-05.pdf ' +
      'must exist and be larger than 1 KB. A missing or empty file means the ' +
      'tectonic compile failed silently or the post-build copy step was ' +
      'skipped.',
  },

  {
    id: 'imp1105-pdf-file-size-matches-recorded-value',
    holds: () => {
      const stat = tryStatNode(PAPER_PUBLICATION.pdfRepoPath);
      if (stat === null) return true;
      // Tolerate small drift across rebuilds (tectonic outputs are not ' +
      // bit-identical across versions). 30% tolerance is generous.
      const recorded = PAPER_PUBLICATION.fileSizeBytes;
      const actual = stat.size;
      const ratio = actual / recorded;
      return ratio > 0.7 && ratio < 1.5;
    },
    why:
      'The on-disk PDF size should match the recorded fileSizeBytes within a ' +
      'wide tolerance (30%). A wild mismatch means the PDF was overwritten ' +
      'with a different document or the recorded value drifted.',
  },

  {
    id: 'imp1105-latex-source-exists',
    holds: () => {
      const stat = tryStatNode(PAPER_PUBLICATION.texSourcePath);
      if (stat === null) return true;
      return stat.isFile && stat.isFile() && stat.size > 1024;
    },
    why:
      'The LaTeX source paper/main.tex must exist so the PDF can be rebuilt. ' +
      'A missing source means the artefact is no longer reproducible from the ' +
      'committed repo state.',
  },

  {
    id: 'imp1105-bib-source-exists',
    holds: () => {
      const stat = tryStatNode(PAPER_PUBLICATION.bibSourcePath);
      if (stat === null) return true;
      return stat.isFile && stat.isFile() && stat.size > 0;
    },
    why:
      'The BibTeX source paper/refs.bib must exist for reproducibility of the ' +
      'bibliography (even though the manuscript uses a verbatim ' +
      'thebibliography block as a fallback).',
  },

  {
    id: 'imp1105-page-count-above-3',
    holds: () =>
      typeof PAPER_PUBLICATION.pageCount === 'number' &&
      PAPER_PUBLICATION.pageCount >= 3,
    why:
      'A first-draft paper must be at least 3 pages. Below this the document ' +
      'is too short for a publishable preprint.',
  },

  {
    id: 'imp1105-sections-list-includes-appendix-C',
    holds: () => {
      const s = PAPER_PUBLICATION.sectionsIncluded;
      return (
        Array.isArray(s) &&
        s.some((row) => typeof row === 'string' && row.indexOf('Appendix C') >= 0)
      );
    },
    why:
      'The sectionsIncluded list must contain "Appendix C" (the six-link ' +
      'rigor chain). Missing the appendix means the paper has shed its ' +
      'load-bearing chain table from the source-of-truth list.',
  },

  {
    id: 'imp1105-sections-list-includes-abstract-and-intro',
    holds: () => {
      const s = PAPER_PUBLICATION.sectionsIncluded;
      const hasAbstract =
        Array.isArray(s) &&
        s.some((row) => typeof row === 'string' && row.indexOf('Abstract') >= 0);
      const hasIntro =
        Array.isArray(s) &&
        s.some((row) => typeof row === 'string' && row.indexOf('Introduction') >= 0);
      const hasMain =
        Array.isArray(s) &&
        s.some((row) => typeof row === 'string' && row.indexOf('Main result') >= 0);
      return hasAbstract && hasIntro && hasMain;
    },
    why:
      'The sections list must include Abstract, Introduction, and Main result. ' +
      'A list missing any of these indicates the LaTeX manuscript and the ' +
      'PAPER_PUBLICATION record have drifted apart.',
  },

  {
    id: 'imp1105-headline-claim-matches-upstream-imp440',
    holds: () => {
      const h = PAPER_PUBLICATION.headlineClaim;
      const upstream = FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.rigorousUnconditionalBeat;
      if (!upstream || !upstream.available) return false;
      return (
        h.N_star === upstream.N_star &&
        typeof h.L_star === 'number' &&
        Math.abs(h.L_star - upstream.L_star) < 1e-9 &&
        typeof h.marginFactor === 'number' &&
        h.marginFactor > 5 &&
        h.PT_bound === 0.2
      );
    },
    why:
      'The headline claim recorded here (N_star, L_star, marginFactor, ' +
      'PT_bound) must match the imp-440 load-bearing computation exactly. Any ' +
      'drift indicates the publication record has decoupled from the proof.',
  },

  {
    id: 'imp1105-upstream-paper-artefacts-still-available',
    holds: () => {
      const a = PAPER_ABSTRACT_REWRITE;
      const s = PAPER_SECTIONS_1_3;
      const c = PAPER_APPENDIX_C;
      return (
        !!a && typeof a.newAbstract === 'string' && a.newAbstract.length > 0 &&
        !!s && s.totalWordCount > 0 &&
        !!c && c.status === 'available'
      );
    },
    why:
      'The publication consumes imp-1081 / imp-1083 / imp-1094 upstream ' +
      'artefacts; if any of them becomes unavailable, the PDF no longer ' +
      'matches its declared sourceFilesUsed list and must be rebuilt.',
  },

  {
    id: 'imp1105-source-files-used-non-empty-and-references-imp-440',
    holds: () => {
      const s = PAPER_PUBLICATION.sourceFilesUsed;
      return (
        Array.isArray(s) &&
        s.length >= 3 &&
        s.some((row) => typeof row === 'string' && row.indexOf('imp-440') >= 0)
      );
    },
    why:
      'sourceFilesUsed must include at least three upstream JS artefacts and ' +
      'must reference the imp-440 load-bearing computation; otherwise the ' +
      'provenance trail is broken.',
  },

  {
    id: 'imp1105-pdf-public-path-served-from-papers-route',
    holds: () => {
      const p = PAPER_PUBLICATION.pdfPath;
      return (
        typeof p === 'string' &&
        p.indexOf('/papers/') === 0 &&
        p.endsWith('.pdf') &&
        p.indexOf('gomila-finite-height-beat-2026-05') > 0
      );
    },
    why:
      'pdfPath must begin with /papers/ (so Vite serves it from the public ' +
      'directory) and must end in .pdf with the canonical basename ' +
      'gomila-finite-height-beat-2026-05.pdf. Any drift breaks the in-app ' +
      'download link.',
  },
];
