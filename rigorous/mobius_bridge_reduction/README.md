# Möbius bridge reduction

Research checkpoint prepared 20 October 2026; repository integration 21 October 2026.

**Status: exact numerical admissibility, with a conditional analytic conclusion.**
The supplied arithmetic checks do not independently establish the imported
analytic estimates or closure lemma. This package makes no claim to prove RH,
set a literature record, or provide a Lean-verified theorem.

## Results and their scope

| Result | Value or statement | Evidence and dependency |
| --- | --- | --- |
| Refined right-hand boundary | `B = 17497733/20000000 = 0.87488665` | Exact numerical gates pass; the zero-free conclusion imports Xu–Sang v2's analytic inputs and closure lemma |
| Gain against that source's stated boundary | `8748867/10000000 − B = 1/20000000 = 5e-8` | Exact rational subtraction; no wider priority claim |
| Conditional symmetric strip | `0.12511335 ≤ Re(ρ) ≤ 0.87488665` for nontrivial zeros | Functional-equation reflection, subject to the same analytic dependency |
| Obstruction to the larger target | `B ≤ 0.8748` is infeasible in the source's stated numerical admissibility system | Exact endpoint obstruction; does not exclude other analytic methods |
| Direct Möbius bridge route | Block energy exponent `2B − 1 = 0.7496` would give boundary `B = 0.8748` | The implication is derived in the report; the all-scale energy hypothesis remains unproved |

Here `B` concerns the real parts of zeta zeros. It is not a bound on the
de Bruijn–Newman constant `Λ`. The small numerical refinement comes from
retuning the Xu–Sang parameter system; it does not discharge the remaining
Möbius correlations.

Read [Mobius_Bridge_Reduction.pdf](Mobius_Bridge_Reduction.pdf) for the endpoint
identity, positivity argument, target obstruction, and direct bridge reduction.

## Larger-cut research target

[TARGET_0874.md](TARGET_0874.md) derives a route to `B = 0.874` from a new
restricted fourth-moment saving of `U^(-1/40)`. Its exact arithmetic checker
passes all modified endpoint and unchanged scalar conditions, including the
short-block supply constraint. **The additional moment estimate is unproved;
0.874 is a target, not an achieved bound.** This follow-up also explains why
the existing row count and fourth moment alone cannot supply the saving.

## Exact certificate

The new-stage parameters are

```text
b       = 17307/200000
ell     = 2506801/15000000
kappa   = 29991/40000
g       = 1/10000000000
zeta    = 1/1000000000000
gstar   = 1/100000000000
B       = 11/12 - ell/4 = 17497733/20000000
```

`zeta` in the parameter file is a small extension parameter, not the zeta
function. The source first-stage boundary `69991/80000` is rechecked and
licenses the retained `kappa` through `(1 + kappa)/2 = 69991/80000`.

After setting `y = 1/2 - x`, the endpoint witness has the form

```text
2 * multiplier * J * (-E - g)
    = A(y) * delta^2 + Bpoly(y) * delta + C(y).
```

The coefficients of `A` and `4*A*C - Bpoly^2` are positive integers. Together
with `J > 0`, completing the square gives endpoint negativity throughout
`0 ≤ delta ≤ 5/6`, `0 ≤ x ≤ 1/2`. The separate verifier checks the rational
identity on an exact interpolation grid, sufficient for its displayed
bidegree bound `(2, 3)`, and recomputes the scalar gates and stage linkage.
Acceptance uses Python integers and `fractions.Fraction`, not floating-point
optimization. This checking boundary trusts Python arithmetic and the
displayed polynomial degree argument; it is not proof-assistant verification.

From the repository root, use Python 3.9 or newer with no third-party packages:

```bash
cd rigorous/mobius_bridge_reduction
sha256sum --check SHA256SUMS.txt
python3 -E verify_certificate.py
python3 -E certify_parameters.py
git diff --exit-code -- parameter_certificate.json target_obstruction.json
```

Run the verifier first to check the committed witness before regenerating it.
`verify_certificate.py` writes the deterministic `target_obstruction.json`;
`certify_parameters.py` writes `parameter_certificate.json`. A clean final
diff confirms both reproduce the committed outputs. Do not use `-O` or `-OO`:
the checkers use assertions. `-E` ignores environment variables such as
`PYTHONOPTIMIZE`. The repository's existing verification workflow runs these
checks on pull requests and manual dispatches.

## Direct Möbius route: what remains

For the pole-cancelling spline packet `k`, define

```text
F(y) = sum_{m >= 2} (log m)/sqrt(m) * k(log m - y)
S(L) = sum_{d >= 1} mu(d)/sqrt(d) * F(L - log d)
     = sum_{n >= 2} Lambda(n)/sqrt(n) * k(log n - L).
```

Here `Lambda(n)` is the von Mangoldt function. The report derives the
energy-to-zero-free implication via the Laplace transform of `S`. To reach
`B = 0.8748`, it would suffice to prove

```text
integral_j^{j+1} |S(u)|^2 du <= C * exp(0.7496 * j)
```

for all sufficiently large integers `j`. Elementary counting controls the
diagonal, the pairs with sufficiently large common divisor, and the pairs
with sufficiently short additive separation. The remaining signed pairs,
with small common divisor and large separation, are uncontrolled. Finite
agreement of the prime and Möbius formulas does not supply this all-scale
estimate.

Optional finite diagnostics require NumPy and SciPy:

```bash
python3 -E mobius_sector_check.py
python3 -E explore_endpoint.py
```

The first command overwrites `mobius_diagnostics.json` with floating-point
checks at `L = 4, 6, 8`; low-order digits can depend on the numerical libraries.
The optimizer is exploratory, checks fewer constraints than the certificate,
and includes a trial `kappa` below the admitted source range. Its output and
solver status never constitute certificate acceptance or an optimality proof.

## Files and provenance

| File | Purpose |
| --- | --- |
| `certify_parameters.py` | Constructs both exact-rational stage witnesses |
| `verify_certificate.py` | Separately checks the committed witness without importing the generator |
| `parameter_certificate.json` | Parameters, integer polynomials, and exact scalar margins |
| `target_obstruction.json` | Rational corner values excluding the `0.8748` target in the stated system |
| `mobius_sector_check.py`, `mobius_diagnostics.json` | Finite identity and pair-partition diagnostics |
| `explore_endpoint.py` | Floating-point parameter exploration, outside the proof acceptance path |
| `Mobius_Bridge_Reduction.pdf`, `build_report.py` | Six-page report and its source |
| `README.txt`, `verification_receipt.txt` | Original checkpoint scope and local verification receipt |
| `SHA256SUMS.txt` | Checksums of the original checkpoint's eleven other files |

To rebuild the PDF, install ReportLab, Matplotlib, and Pillow, provide the
DejaVu fonts at `/usr/share/fonts/truetype/dejavu`, and run
`python3 build_report.py`. PDF metadata can make a rebuilt PDF differ in bytes;
the checked-in PDF is the rendered and visually reviewed checkpoint. The
checksum manifest covers the original checkpoint, not this integration README.

Analytic source: Yuanda Xu and Hejian Sang, *Amplified moments and a refinement
of the quasi-Riemann hypothesis*,
[arXiv:2610.15291v2](https://arxiv.org/html/2610.15291v2), 15 October 2026.
Imported interfaces: equations (10), (21), (28), Section 6.2, and Lemma 8.1.
The source's analytic proof is an explicit dependency, not verified by these
scripts.

Internal packet reference: Jude Gomila, `rh_global_bound_v3.pdf`,
30 September 2026, consulted during the research session and not bundled here.
The present report states the packet transform and the reduction used by this
checkpoint; the finite diagnostic constructs the spline packet directly.
