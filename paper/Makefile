# Makefile for paper/main.pdf
#
# Toolchain (in order of preference):
#   1. tectonic   — recommended; single-binary, auto-fetches packages.
#                   Install:  brew install tectonic
#                   Used here as the default rule.
#   2. pandoc + tectonic  — for HTML-to-PDF route via pandoc; not used here.
#   3. pdflatex + bibtex  — full TeX Live install; works but heavier.
#
# Usage:
#   make           — build main.pdf (and copy to public/papers/ for the app).
#   make clean     — remove build artifacts.
#   make install   — copy the built PDF to ../public/papers/ so Vite serves it.
#
# The PDF is intentionally committed under public/papers/ so the production
# build of the Vite app can serve it at /papers/gomila-finite-height-beat-2026-05.pdf.

TECTONIC ?= tectonic
PAPER_BASENAME = main
PDF_OUT        = $(PAPER_BASENAME).pdf
PUBLISH_PATH   = ../public/papers/gomila-finite-height-beat-2026-05.pdf

.PHONY: all install clean recompile

all: $(PDF_OUT) install

$(PDF_OUT): $(PAPER_BASENAME).tex refs.bib
	$(TECTONIC) $(PAPER_BASENAME).tex

install: $(PDF_OUT)
	mkdir -p ../public/papers
	cp $(PDF_OUT) $(PUBLISH_PATH)
	@echo "Published to $(PUBLISH_PATH)"

recompile:
	$(TECTONIC) --keep-intermediates --reruns 3 $(PAPER_BASENAME).tex

clean:
	rm -f $(PAPER_BASENAME).pdf $(PAPER_BASENAME).aux $(PAPER_BASENAME).log \
	      $(PAPER_BASENAME).bbl $(PAPER_BASENAME).blg $(PAPER_BASENAME).out \
	      $(PAPER_BASENAME).toc
