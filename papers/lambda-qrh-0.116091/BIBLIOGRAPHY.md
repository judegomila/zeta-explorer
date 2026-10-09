# Bibliography

Each entry was checked on 2026-10-09 against the publisher record (Crossref),
the arXiv abstract page, the Zenodo record or the GitHub repository named in the
"checked" line. Entries 1–4 are inputs of the result; entries 5–9 are cited
mathematical background; entries 10–14 are software; entries 15–18 are
unrefereed 2026 preprints cited for the history of the bounds only.

## Inputs

1. D. H. J. Polymath, *Effective approximation of heat flow evolution of the
   Riemann ξ function, and a new upper bound for the de Bruijn–Newman constant*,
   Research in the Mathematical Sciences **6** (2019), no. 3, article 31.
   DOI <https://doi.org/10.1007/s40687-019-0193-1>; arXiv:1904.12438
   (v1 29 April 2019, v2 4 August 2019), <https://arxiv.org/abs/1904.12438>.
   Used: normalisation of `H_t`, Proposition 3.1, Theorem 3.2, Theorem 1.5(i),
   Theorem 1.2 (context). The local copy read for this package is arXiv v2,
   sha256 `60d0d2d381227d32f98535a5c43dedb86e333a9006d6819f0bdebdd734085603`.
   Checked: Crossref, arXiv abstract page, local copy (Theorem 3.2 cites
   de Bruijn's Theorem 13).

2. D. Platt and T. Trudgian, *The Riemann hypothesis is true up to 3·10¹²*,
   Bulletin of the London Mathematical Society **53** (2021), no. 3, 792–797.
   DOI <https://doi.org/10.1112/blms.12460>; arXiv:2004.09765,
   <https://arxiv.org/abs/2004.09765>. Theorem 1: RH holds up to height
   3 000 175 332 800. Corollary 2: `Λ ≤ 0.2`. Checked: Crossref; text of arXiv v1
   (sha256 `3362f66af9fa9373977eee70e2282ec33989d5d8b97e0852df9e32cc25b52885`,
   the same file hash as in the earlier package's `references/README.md`), where
   Theorem 1, Corollary 2 and the remark on `Λ < 0.19` were read.

3. D. J. Raymond, *Correlated translated probes and the bound Λ < 0.149396 for the
   de Bruijn–Newman constant*, Zenodo preprint, version 1, 21 September 2026,
   DOI <https://doi.org/10.5281/zenodo.22867547>, CC BY 4.0. The deposit includes
   the companion *Analytic foundations for the time-zero upper-bound construction*
   (version 1.0, 21 September 2026), the TeX source of the main paper, a
   verification guide and the replay archive. Author as listed: Raymond, Dale James
   (ORCID 0009-0001-1682-8529). Checked: Zenodo record page (title, author, date,
   DOI, file list); the deposit's `SHA256SUMS.txt`, against which the local copies
   of `Analytic_Foundations.pdf`, `Correlated_Translated_Probes.pdf`,
   `Correlated_Translated_Probes.tex`, `README.md` and `Verification_Guide.pdf`
   match (sha256 in `PROVENANCE.md`).

4. openai/math, result family 003, *The Quasi-Riemann Hypothesis: A Zero-Free
   Half-Plane Re s > 7/8* (manuscript dated 30 September 2026,
   `preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf`) with Lean
   formalisation (`lean/docs/003.md`; comparator statement
   `lean/ComparatorChallenges/QuasiRiemannHypothesis.lean`), and *The Quasi-Riemann
   Hypothesis (alternate 11/12 proof)* (5 October 2026,
   `preprints/The-Quasi-Riemann-Hypothesis-October-5-2026/paper2.pdf`), in the
   repository <https://github.com/openai/math> (Apache-2.0; initial commit
   `adc7f1241b42e322a6451854ab7e4b4c146bf78a`, 6 October 2026; updated
   8 October 2026). The repository describes its contents as manuscripts and proof
   artifacts produced by an internal OpenAI model and states that some
   unformalized results could have issues. Checked: repository front page,
   `CONTENTS.md` (family 003 entry), the README (provenance statement), the comparator file (statement
   `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re {s : ℂ} (hs : (7 / 8 : ℝ) < s.re) :
   riemannZeta s ≠ 0`), the commit list; the 8 October 2026 update (commit `301488868`, merged as `fd4aeeb2`) changes none of the 2,924 modules of the import closure, the comparator file, the lakefile, the manifest, the toolchain or the family-003 manuscripts (commit file list compared with the closure on 2026-10-09); the build was not repeated at the new commit.

## Background

5. N. G. de Bruijn, *The roots of trigonometric integrals*, Duke Mathematical
   Journal **17** (1950), no. 3, 197–226. DOI
   <https://doi.org/10.1215/S0012-7094-50-01720-0>. Theorem 13 (strip contraction
   under the heat flow; `Λ ≤ 1/2`). Checked: Crossref, Project Euclid.

6. C. M. Newman, *Fourier transforms with only real zeros*, Proceedings of the
   American Mathematical Society **61** (1976), no. 2, 245–251. DOI
   <https://doi.org/10.1090/S0002-9939-1976-0434982-5>. Checked: Crossref.

7. B. Rodgers and T. Tao, *The de Bruijn–Newman constant is non-negative*, Forum
   of Mathematics, Pi **8** (2020), e6. DOI <https://doi.org/10.1017/fmp.2020.6>;
   arXiv:1801.05914, <https://arxiv.org/abs/1801.05914>. Checked: Crossref, arXiv.

8. H. Ki, Y.-O. Kim and J. Lee, *On the de Bruijn–Newman constant*, Advances in
   Mathematics **222** (2009), no. 1, 281–306. DOI
   <https://doi.org/10.1016/j.aim.2009.04.003>. Checked: Crossref.

9. M. J. Mossinghoff, T. S. Trudgian and A. Yang, *Explicit zero-free regions for
   the Riemann zeta-function*, Research in Number Theory **10** (2024), no. 1,
   article 11. DOI <https://doi.org/10.1007/s40993-023-00498-y>; arXiv:2212.06867.
   Cited for the remark that classical zero-free regions near `Re s = 1` give no
   uniform start below the classical strip. Checked: Crossref, search record.

## Software

10. F. Johansson, *Arb: efficient arbitrary-precision midpoint-radius interval
    arithmetic*, IEEE Transactions on Computers **66** (2017), no. 8, 1281–1292.
    DOI <https://doi.org/10.1109/TC.2017.2690633>; arXiv:1611.02831. Checked:
    Crossref, arXiv.

11. The FLINT team, *FLINT: Fast Library for Number Theory*,
    <https://flintlib.org>; Python bindings *python-flint*,
    <https://github.com/flintlib/python-flint> (versions used: 0.8.0 under Python
    3.13.15 for the route-P consumer, 0.9.0 under Python 3.14.7 for Raymond's chain
    replay). Checked: project pages; local version query.

12. L. de Moura and S. Ullrich, *The Lean 4 theorem prover and programming
    language*, in: Automated Deduction – CADE 28, Lecture Notes in Computer Science
    **12699**, Springer (2021), 625–635. DOI
    <https://doi.org/10.1007/978-3-030-79876-5_37>. Checked: Crossref, search
    record (volume number).

13. The mathlib Community, *The Lean mathematical library*, in: Proceedings of the
    9th ACM SIGPLAN International Conference on Certified Programs and Proofs
    (CPP 2020), 367–381. DOI <https://doi.org/10.1145/3372885.3373824>. Checked:
    Crossref.

14. LeanCert, *Verified interval arithmetic for Lean 4*,
    <https://github.com/alerad/leancert> (Apache-2.0), commit
    `7f91b6eb3567437f6cfac03ed279706603ee22f4` (29 September 2026). Provides the
    formalised `H_t`, `H_0 = ξ(1/2 + iz/2)/8`, de Bruijn's strip contraction and the
    threshold characterisation of `Λ` used by the Lean packages. Checked: GitHub
    repository page; local checkout (`git log`, remote URL).

## Unrefereed 2026 preprints (history only; none is an input)

15. Mosaic Intelligence, *A certified unconditional upper bound Λ ≤ 0.1875 for the
    de Bruijn–Newman constant*, Zenodo preprint, 3 July 2026; this DOI is the second
    and latest version of the record (concept record 20724169), DOI <https://doi.org/10.5281/zenodo.21175533>. Checked: Zenodo.

16. J. Gomila, *A computer-assisted proof of the bound Λ ≤ 0.1787854 for the
    de Bruijn–Newman constant*, public repository and manuscript dated 20 August 2026, <https://github.com/judegomila/dbn-lambda-01787854-candidate-audit>.
    Not peer reviewed. Checked: repository page (public, status paragraph); title and
    date from the first page of `gomila_dbn_lambda_01787854_release.pdf`.

17. D. J. Raymond, *Phase-correlated certificates and the bound Λ < 0.163297 for
    the de Bruijn–Newman constant*, Zenodo preprint, 8 September 2026, DOI
    <https://doi.org/10.5281/zenodo.22626161>. Checked: Zenodo.

18. S. Gordon, *A computer-assisted upper bound for the de Bruijn–Newman
    constant*, public manuscript and repository, September 2026,
    <https://github.com/stefangordon/dbn-upper-bound>; claims
    `Λ ≤ 0.157656619095490606768…`; states that it has not undergone external peer
    review and that its Lean theorem is conditional on explicit analytic inputs.
    Checked: repository page.

The internal project documents cited in the package (reviews, write-ups, data
modules) are listed with their hashes in `PROVENANCE.md`. They are not
publications.
