# Principal-sector correlation follow-up

Research continuation for Jude Gomila, 2026-10-08.

**No positive exponent saving, new zero-free region, or RH proof was obtained.**

Read [principal_sector.pdf](principal_sector.pdf) for the complete derivations.
The six-page note proves an explicit polynomial diagonal bound, an O(H T^5)
bound for nearby integer shifts, the full principal-density subtraction, and
an exact reduction to the remaining signed large-shift estimate. It compares
the resulting coefficients with the pinned source's matched rectangle lemma
and states the missing coefficient invariant and remainder estimate.

The result is an elementary analytic reduction and a scoped transfer audit.
It is not independently refereed, formally verified, or a novelty claim.

## Reproduce

Use Python 3.10+ from this directory. The first command needs only the standard
library. The second checker uses Arb through the pinned python-flint package.

```bash
python3 audit.py
python3 -m pip install -r requirements.txt
python3 interval_audit.py
```

These regenerate `exact_results.json` and `interval_results.json` beside the
scripts. Exact checks cover 16,384 formal-log coefficients, twelve Laurent
models, twelve rational Gram models, and negative controls. The 512-bit Arb
checks use exact piecewise antiderivatives for the actual kernel at T=2,3,4.
They retain prime powers and all signed terms. The T=4 energy also agrees with
the archived v9 enclosure. Positive and negative far correlations occur.

These finite checks do not prove an infinite-scale bound. The external Lean
project was not rebuilt and the broader inherited analytic arguments still
require independent review.

Build the PDF with a standard TeX Live installation:

```bash
pdflatex -interaction=nonstopmode -halt-on-error principal_sector.tex
pdflatex -interaction=nonstopmode -halt-on-error principal_sector.tex
```

`packet.py` is an unchanged copy from the user's v9 bundle; provenance and its
hash are recorded in `source_index.json`. The external manuscript and original
input archive are not redistributed. `manifest.json` records this release's
file hashes. Rebuilding a PDF can change its byte hash through metadata.

The preceding seven-file October 6 release remains unchanged. This follow-up
changes research documentation and checkers only, with no app or deployment
changes.
