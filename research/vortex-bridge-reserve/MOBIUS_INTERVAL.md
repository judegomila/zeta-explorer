# Certified finite centering and the necessary tail

4 November 2026 (Pacific). Continuation of [MOBIUS_CENTERING.md](MOBIUS_CENTERING.md).

**Result:** the centered Vaughan calculation now has outward-rounded enclosures at 23 integer triples `(x, U, V)` and 69 tail cutoffs. All finite identities and quadrature comparisons passed. In 22 of the 69 cutoff evaluations, dropping the tail provably reverses the sign. This certifies a previously floating observation; it supplies no uniform estimate as `x` tends to infinity.

## 1. The finite identity being checked

Use the definitions of `w_x`, `c`, `c_1`, `M`, `L`, `A`, `H`, and `C` in the preceding note. Set

\[
D_{x,V}=c\log x+c_1-cA(V),\qquad
T_{x,V}(k)=\sqrt{x}\,[D_{x,V}M(k)-cL(k)-c].
\]

For integer `K >= ceil(2x/V)`, the support of `w_x` gives `H(a)=0` for `a>K`. Therefore

\[
\sum_{U<a\le K}\mu(a)C(a)
=\sqrt{x}\{D_{x,V}[M(K)-M(U)]-c[L(K)-L(U)]\}
=T_{x,V}(K)-T_{x,V}(U).
\]

Writing `I_4 = sum_{a>U} mu(a)H(a)`, the exact finite algebra is

\[
\boxed{J=I_4+T_{x,V}(U)=J_K+T_{x,V}(K)},\qquad
J_K=\sum_{U<a\le K}\mu(a)[H(a)-C(a)].
\]

No limiting process or hypothesis about the Mertens function is needed for this identity. The constant `-c` in `T` is retained.

For two cutoffs beyond the support,

\[
J_{K_2}-J_{K_1}=T_{x,V}(K_1)-T_{x,V}(K_2).
\]

Thus changing `K` transfers a known amount between the partial sum and correction. It cannot change the true corrected `J` for fixed `(x,U,V)`. Changing `U` or `V` can change `J`: the quadrature remainder changes with it. The code does not assume invariance across different `(U,V)` pairs.

## 2. A certified sign reversal

At `x=65536`, `U=V=64`, the 50-digit calculation encloses

\[
J\in[-0.0504355617852112176651201387905129212157891938458,
      -0.0504355617852112176651201387905129212157891886984].
\]

For readability the following endpoints are rounded **outwards** to 12 decimal places:

| K | Centered partial sum `J_K` | Required correction `T(K)` | Corrected `J` |
| ---: | --- | --- | --- |
| 2048 | `[0.007973206228, 0.007973206229]` | `[-0.058408768014, -0.058408768013]` | `[-0.050435561786, -0.050435561785]` |
| 4096 | `[-0.451064243374, -0.451064243373]` | `[0.400628681588, 0.400628681589]` | `[-0.050435561786, -0.050435561785]` |
| 8192 | `[0.480860872739, 0.480860872740]` | `[-0.531296434525, -0.531296434524]` | `[-0.050435561786, -0.050435561785]` |

The last column encloses the full-precision sum before display rounding. It is not obtained by adding the coarsened display endpoints. The uncorrected sign alternates across these cutoffs, while the corrected sign is rigorously negative.

The separate components satisfy `I_4` in `[-6.809744782849, -6.809744782848]` and `T(U)` in `[6.759309221063, 6.759309221064]`. The finite ratio

\[
\frac{|J|}{|I_4|+|T(U)|}\in[0.003716954901,0.003716954902]
\]

measures cancellation in this example. It is not an asymptotic saving. A negative `J` is neither a negative value of the original response `Psi` nor a counterexample to RH.

## 3. Coverage and arithmetic controls

The default sweep uses `x` in `{64,256,257,1024,4096,16384,65536}`. For each, let `b=floor(x^(3/8))`, computed using integer eighth powers. The three pairs are `(b,b)`, `(2b,floor(b/2))`, and `(floor(b/2),2b)`. Two additional cases test fixed `V=1` and the admissibility boundary `2UV=x`. Each triple is evaluated at `K0`, `2K0`, and `4K0`, where `K0=ceil(2x/V)`.

The implementation uses:

- Exact integer sieving for `mu` and the prime base of each prime power. The convolution `mu * 1 = epsilon` is checked at all 131,072 generated integers.
- Exact integer decisions at the two support endpoints and the tent apex. At the endpoints the weight is exactly zero. Interior weights use `log(2n/x)/sqrt(n)` or `log(2x/n)/sqrt(n)`.
- The existing 50-digit directed Decimal interval engine. The constants use `sqrt(2)` and `log(2)` directly, without binary floating point or hyperbolic-library calls.
- Independent computations of `I_4+T(U)` and each `J_K+T(K)`. Their intervals intersect, their difference encloses zero, and every difference interval has width below `1e-35`. This is an implementation check of the algebra in section 1, not a numerical proof of that algebra.
- An independently summed prime-power shell. For each finite triple, its difference from `J` is enclosed and verified smaller in absolute value than the manuscript's displayed quadrature expression. This finite comparison does not independently prove that expression's all-parameter analytic validity.

The maximum `J` interval width in the default sweep was `9.071e-45`; the maximum identity-difference width was `9.200255e-44`. All 23 `J` signs were resolved. The seven balanced-case values change sign between the sampled scales; no monotonicity or rate is inferred.

`check_mobius_interval.py` adds 2,048 independent trial-factor references, 128 exact-rational prefix checks, and four direct divisor-enumeration references for `I_4`, including odd `x` and support-boundary cases. It does not reuse the production beta sieve or weight table in its reference sum.

A separate 70-digit replay of `(65536,64,64)` produced a `J` interval of width `5.1417e-65`. All 27 interval-valued fields, including the three cutoff evaluations, lay inside their corresponding 50-digit enclosures. This cross-check strengthens the numerical audit; the enclosure argument still depends on the interval implementation and Decimal's documented rounding behavior.

## 4. Reproduction

From this directory:

```bash
python3 check_mobius_interval.py
python3 mobius_interval_audit.py
```

The second command writes [mobius_interval_audit.json](mobius_interval_audit.json), including complete enclosures and SHA-256 hashes of the audit and interval-engine source files. Both commands are also included in `replay.py`, which compares the saved result exactly in a temporary directory.

To repeat the higher-precision example without overwriting the default snapshot:

```bash
python3 mobius_interval_audit.py --case 65536 64 64 --precision 70 --output /tmp/mobius_precision70.json
```

Primary implementation reference: [Python Decimal documentation](https://docs.python.org/3.12/library/decimal.html), specifically the rounding behavior of logarithms, square roots, context arithmetic, and neighboring representable values. Mathematical input and provenance remain as stated in `MOBIUS_CENTERING.md`; this continuation does not re-audit the external manuscript.

## 5. What remains

The arithmetic object is now reliably measurable at these finite points, and the tail-omission shortcut has a rigorous counterexample. The missing step remains a uniform one-sided bound on the **jointly centered** expression, including its correction. Increasing `K` alone cannot supply it, by section 1. A subsequent bilinear or dyadic estimate must retain the interaction of `mu(a)`, `beta_V(d)`, the product `ad`, and the continuum term. Its hypotheses must also be checked against the zero-free conclusion they already imply directly.
