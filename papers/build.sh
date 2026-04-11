#!/usr/bin/env bash
# papers/build.sh
#
# Standard 4-pass LaTeX build for sota-lambda-2026.tex.
# Requires: pdflatex, bibtex (from any modern TeX distribution).
#
# Usage:
#   cd papers && bash build.sh          # compile to PDF
#   cd papers && bash build.sh clean    # remove auxiliary files

set -euo pipefail

BASENAME="sota-lambda-2026"
TEXFILE="${BASENAME}.tex"
BIBFILE="references.bib"

if [[ ! -f "$TEXFILE" ]]; then
  echo "ERROR: $TEXFILE not found. Run this script from the papers/ directory." >&2
  exit 1
fi

if [[ "${1:-}" == "clean" ]]; then
  echo "Cleaning auxiliary files..."
  rm -f "${BASENAME}".{aux,bbl,blg,log,out,toc,synctex.gz}
  echo "Done."
  exit 0
fi

# Pass 1 — generate .aux file with forward citation references
echo "[1/4] pdflatex (first pass)..."
pdflatex -interaction=nonstopmode "$TEXFILE"

# Pass 2 — BibTeX resolves citations against references.bib
echo "[2/4] bibtex..."
bibtex "$BASENAME"

# Pass 3 — pdflatex resolves undefined citations
echo "[3/4] pdflatex (second pass)..."
pdflatex -interaction=nonstopmode "$TEXFILE"

# Pass 4 — pdflatex resolves all cross-references and page numbers
echo "[4/4] pdflatex (third pass)..."
pdflatex -interaction=nonstopmode "$TEXFILE"

echo ""
echo "Build complete: ${BASENAME}.pdf"
echo ""

# Quick lint: warn on undefined references or citations
if grep -q "LaTeX Warning: Citation" "${BASENAME}.log" 2>/dev/null; then
  echo "WARNING: undefined citations detected (see ${BASENAME}.log)"
fi
if grep -q "LaTeX Warning: Reference" "${BASENAME}.log" 2>/dev/null; then
  echo "WARNING: undefined references detected (see ${BASENAME}.log)"
fi
