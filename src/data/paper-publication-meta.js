// @module data/paper-publication-meta
// LIGHTWEIGHT metadata-only export of the paper publication record.
//
// The full src/data/paper-publication-2026-05.js record (PAPER_PUBLICATION)
// is build-time-validated via tripwires that depend on heavy chain modules
// (paper-appendix-C-finite-height-beat → finite-height-beats-platt-trudgian
// → finite-k-c-mb-unconditional → imp-911-per-plateau-gronwall-certs →
// ... → eventually zeros-to-1e6.js, a 16.7 MB blob). Pages that need ONLY
// the published-paper metadata (title, page count, file size, PDF path)
// should import from THIS file instead, to avoid pulling the entire chain
// into the page's bundle chunk.
//
// Used by: LambdaBoundsPage and any other page that just renders a "Download
// the paper" link or footer line.

export const PAPER_TITLE =
  'A rigorous unconditional finite-height beat of the Platt-Trudgian bound ' +
  'on the de Bruijn-Newman constant Lambda';

export const PAPER_AUTHORS = Object.freeze(['Jude Gomila']);

export const PAPER_PDF_PATH = '/papers/gomila-finite-height-beat-2026-05.pdf';
export const PAPER_PDF_REPO_PATH = 'public/papers/gomila-finite-height-beat-2026-05.pdf';
export const PAPER_TEX_SOURCE_PATH = 'paper/main.tex';

// These two are intentionally duplicated from paper-publication-2026-05.js;
// they MUST stay in sync with that file. A build-time tripwire there
// (imp1133-paper-meta-mirror) is recommended as a follow-up to enforce.
export const PAPER_PAGE_COUNT = 12;
export const PAPER_FILE_SIZE_BYTES = 159284;
export const PAPER_FILE_SIZE_KB = +(PAPER_FILE_SIZE_BYTES / 1024).toFixed(1);

export const PAPER_BUILT_AT = '2026-05-26T23:43:43Z';
export const PAPER_LATEX_COMPILER = 'tectonic 0.16.9';

// Lightweight reference layer for capture-ratio constants: literal numbers +
// citing ticket ids only, so summary pages can name-drop the supporting
// evidence for the imp-3346 C_inf ~ 0.1751 consensus without importing the
// heavy imp-3346/imp-3485/imp-3489/imp-3483 data modules. Per-field detail
// (derivations, tripwires, grids) lives in those modules, not here.
export const CAPTURE_CONSTANT_C_INF = 0.1751370;
export const CAPTURE_CONSTANT_ONE_OVER_U_LAW =
  'C(U) = C_inf + b/U, b ~ 0.018 (imp-3346 Richardson fit of the U ladder, C_inf ~ 0.1751 to 1e-4)';
export const CAPTURE_RATIO_LINEAR_SHEAR_LIMIT_MAX_GAP = 5e-15;
export const CAPTURE_CONSTANT_C_INF_SUPPORTING_EVIDENCE = Object.freeze([
  {
    ticket: 'imp-3346',
    note: 'the capture-ratio constant is a true finite limit C_inf ~ 0.1751, not a fixed-N resolution artifact, ' +
      'and obeys the one-over-U law C(U) = C_inf + b/U with b ~ 0.018',
  },
  {
    ticket: 'imp-3485',
    note: 'a structurally distinct Krylov/Lanczos solver reproduces C = 0.1751370 to <0.4% relative agreement, ' +
      'solver-independent of the imp-3467 closed-form assembly',
  },
  {
    ticket: 'imp-3350',
    note: 'the a -> 0 sinh-shear capture limit r_star equals the exactly-linear-shear ratio r_lin to below ' +
      '5e-15 at every U tested (U=6,8,10), so C_inf is a property of the a-free linear kernel alone',
  },
]);

export const XI_STAR_PEAK_SLOPE_MAXIMIZER = 12.0870439;
export const XI_STAR_SUPPORTING_EVIDENCE = Object.freeze([
  {
    ticket: 'imp-3489',
    note: 'xi* = 12.0870439 is U-independent: recomputed as a root of the PSD peak-slope stationarity on the ' +
      'full capture-ratio grid, matching the imp-3470 value to 2.7e-8',
  },
  {
    ticket: 'imp-3483',
    note: 'xi* = 12.0870439 is the UNIQUE global maximizer -- exactly one root of P2(xi)=0 on the full domain ' +
      '[0, 120], stable across the U ladder',
  },
]);

export const PAPER_PUBLICATION_META = Object.freeze({
  title:          PAPER_TITLE,
  authors:        PAPER_AUTHORS,
  pdfPath:        PAPER_PDF_PATH,
  pdfRepoPath:    PAPER_PDF_REPO_PATH,
  texSourcePath:  PAPER_TEX_SOURCE_PATH,
  pageCount:      PAPER_PAGE_COUNT,
  fileSizeBytes:  PAPER_FILE_SIZE_BYTES,
  fileSizeKB:     PAPER_FILE_SIZE_KB,
  builtAt:        PAPER_BUILT_AT,
  latexCompilerUsed: PAPER_LATEX_COMPILER,
});
