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
