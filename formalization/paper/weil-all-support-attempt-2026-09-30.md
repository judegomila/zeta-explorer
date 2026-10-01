# Attempting the all-support step

**Status: the all-support theorem is not proved.** This follow-up develops the
exact prime-power continuation, a signed remainder identity valid at every
support width, and a certificate checker that includes all contributing prime
powers. It identifies why neither monotone prime insertion nor straightforward
scaling of the previous numerical certificate closes RH.

**Completed local result:** the 384-bit interval checker certifies
`W(h) ≥ 5×10⁻¹³ ||h||₂²` for every complex smooth pole-free test supported in
`(-4/5,4/5)`. This extends the certified width to `B=1.6`, including the prime
square `4`. The derivation and code have not been independently reviewed or
formally verified; no novelty or published-record claim is made.

The preceding [two-prime certificate](weil-two-prime-certificate-2026-09-30.md)
remains a bounded-support result. The missing quantifier is still positivity for
every smooth compact pole-free test, with no upper bound on its support width.
This is the criterion in Connes–Consani,
[Appendix C, Proposition C.1](https://arxiv.org/pdf/2006.13771).

## 1. The exact family to be continued

Write `B=2a`, `I_B=(-B/2,B/2)`,

\[
 \widehat h(t)=\int h(x)e^{-itx}dx,\qquad
 C_h(x)=\int h(u+x)\overline{h(u)}du,
\]

and impose `hhat(i/2)=hhat(-i/2)=0`. Put

\[
 \mathcal A(h)=\frac1{2\pi}\int
 [\Re\psi(1/4+it/2)-\log\pi]|\widehat h(t)|^2dt.
\]

Then the exact form is

\[
 W_B(h)=\mathcal A(h)
 -2\sum_{n=p^k:\,\log n<B}\frac{\log p}{\sqrt n}\Re C_h(\log n).
 \tag{1}
\]

In particular the coefficient of `n=4` uses `log 2`, not `log 4`. The smooth
autocorrelation vanishes near the endpoint `B`; equality at a support threshold
therefore makes no difference for an individual smooth test. A fixed-width
certificate and an assertion uniform in the width are different statements.

## 2. A new prime power is not a positive update

Fix `n=p^k`, `ℓ=log n`, `c=log p/sqrt(n)`, and `ℓ<B<2ℓ`. The new contribution is

\[
 V_n=-c(S_\ell+S_\ell^*),
 \qquad (S_\ell h)(x)=h(x-\ell)
\]

with translations compressed to `L²(I_B)`. Only the two edge strips of width
`B−ℓ` are coupled. On their paired copies the operator is

\[
 \begin{pmatrix}0&-cI\\-cI&0\end{pmatrix}.
\]

It has eigenvalues `+c` and `−c`, and norm `c`, however small `B−ℓ>0` is.
This remains true after compression to the pole-free subspace. To see this,
take a nonzero smooth bump `g` in the left strip and normalize
`u=(-d²/dx²+1/4)g` to have L² norm one. Integration by parts shows that `u` has
both zero exponential moments. Its translated copy `v=S_ℓu` has the same
property and disjoint support. Thus `h₊=(u+v)/sqrt(2)` and
`h₋=(u−v)/sqrt(2)` are pole-free and satisfy

\[
 \langle h_+,V_nh_+\rangle=-c,
 \qquad \langle h_-,V_nh_-\rangle=+c.
\]

For `n=4` these values are `±log(2)/2`. Consequently a proof cannot simply
insert prime powers as positive corrections, or treat their L² operator norms
as tending to zero at entry. This does **not** show that the total Weil form
loses positivity: concentration in a thin edge strip also incurs archimedean
cost, which this isolated-term calculation does not bound.

A sufficient collar estimate for this single insertion is

\[
 W_{\rm old,B}(h)\ge c\bigl(\|h_L\|_2^2+\|h_R\|_2^2\bigr)
 \quad\text{for all pole-free }h.
 \tag{2}
\]

Here `W_old,B` is the old arithmetic form evaluated on the **enlarged** interval;
its positivity there is not inherited from positivity on the smaller interval.
Equation (2) follows as a sufficient condition by Cauchy–Schwarz, but is not
established uniformly over all insertions in this attempt.

## 3. A signed identity that removes the smooth pole contribution

Let `Ψ(X)=Σ_{n≤X}Λ(n)` denote the Chebyshev prime-power counting function, and set

\[
 R(x)=\Psi(e^x)-(e^x-1+x),\qquad
 F_h(x)=e^{-x/2}\Re C_h(x),\quad x\ge0.
\]

These definitions use primes, not a zero list. On the positive axis,

\[
 dR(x)=\sum_{n=p^k}\log p\,\delta_{\log n}(dx)-(e^x+1)dx.
\]

The ordinary pole contribution is

\[
 P(h)=2\Re\!\left(\widehat h(i/2)
          \overline{\widehat h(-i/2)}\right)
      =4\int_0^B\cosh(x/2)\Re C_h(x)dx.
\]

Therefore the full Weil form, including poles when they are nonzero, obeys

\[
 \mathcal A(h)+P(h)
 -2\sum_{\log n<B}\frac{\Lambda(n)}{\sqrt n}\Re C_h(\log n)
 =\mathcal A(h)-2\int_0^B F_h(x)\,dR(x).
 \tag{3}
\]

Since `R(0)=0` and `F_h` vanishes near `B`, Stieltjes integration by parts gives
the following exact all-width identity on the pole-free test space:

\[
 \boxed{W_B(h)=\mathcal A(h)+2\int_0^B R(x)F_h'(x)dx.}
 \tag{4}
\]

The leading continuum term is removed exactly by the pole moments. No sign has
been assigned to the remaining arithmetic error, and every covariance between
separated parts of `h` remains in its autocorrelation.

The desired all-support estimate in these coordinates is

\[
 2\int_0^B R(x)F_h'(x)dx\ge-\mathcal A(h)
 \quad\text{for every }B\text{ and every pole-free }h\in C_c^\infty(I_B).
 \tag{5}
\]

Equation (4) is proved here; inequality (5) is **not**. Treating (5) as an
automatic consequence of the identity would assume the missing RH content.

Two tempting shortcuts fail:

1. `F_h'` need not have one sign. The diagnostic uses
   `h=Q[(1-(x/(4/5))²)^4]`, extended by zero, and computes its autocorrelation
   as an exact rational polynomial. The weighted derivative has both signs.
   This compact C¹ test has zero pole moments; smooth approximations preserve
   the strict signs. Thus a monotonic-autocorrelation assumption would omit
   allowed tests.
2. The archimedean form alone cannot supply a positive lower bound at every
   width. For a fixed nonzero smooth compact `g`, put
   `g_L(x)=L^{-1/2}g(x/L)` and `h_L=Qg_L`. These tests are pole-free. Fourier
   scaling and dominated convergence give
   `A(h_L)/||h_L||² → Re ψ(1/4)−log π < 0` as `L→∞`.
   The signed arithmetic contribution is essential; a universal uncertainty
   bound for the archimedean part alone cannot replace it.

The diagnostic separately computes the finite prime sum and integrates (4)
over every interval between consecutive prime-power jumps. Exponentials times
rational polynomials are integrated by exact coefficient recurrences and Arb
endpoint evaluation. Their difference encloses zero with absolute bound below
`10⁻⁴⁰`. This checks the normalization on one test, not inequality (5).

## 4. Why the present frequency cutoff becomes expensive

The previous checker uses the sufficient tail bound

\[
 w_B(t)\ge\Re\psi(1/4+it/2)-\log\pi-A_B,
 \qquad A_B=2\sum_{n=p^k<e^B}\frac{\log p}{\sqrt n}.
\]

For a fixed floor `m>0`, the cutoff determined by this **constant triangle
envelope** satisfies

\[
 \log T_B=A_B+m+\log(2\pi)+o(1).
\]

Partial summation and the prime number theorem give `A_B∼4e^{B/2}`. Thus this
particular method asks for a doubly exponential frequency cutoff. The current
Legendre complement estimate also asks for a dimension of order `BT_B` to
overcome the factor `exp(3BT_B/8)`.

The diagnostic interval-brackets the exact cutoff equation for `m=1/4`:

| Support width B | Contributing prime powers | Approximate log₁₀ cutoff |
|---:|---:|---:|
| 1.3 | 2 | 1.88341 |
| 1.6 | 3 | 2.18444 |
| 2 | 5 | 3.44845 |
| 3 | 12 | 6.55938 |
| 4 | 24 | 11.49628 |
| 5 | 47 | 19.38667 |
| 6 | 98 | 33.56156 |

These are cost estimates for the stated envelope, not a lower bound on the
complexity of every RH proof. In particular they do not rule out a
frequency-dependent bound or a direct estimate of the compressed operator.
A recent [preprint by Marcus Chuk](https://arxiv.org/html/2608.24827v2) also
studies compact-window finite reductions and this envelope's cost. Its reported
local bounds are not independently audited here; our pole-free margins are not
directly comparable to its unrestricted even-test profile. The asymptotic
digamma expansion used above is recorded in
[DLMF §5.11](https://dlmf.nist.gov/5.11).

## 5. Generalized local checker

`scripts/certify-weil-window.py` extends the prior checker with the following
changes:

- Enumerate all prime powers from a certified upper bound on `exp(B)` and
  compare their logarithms with `B` using interval arithmetic. Ambiguous
  comparisons reject. The implementation has an explicit enumeration resource
  guard at 2000, not an assertion about all widths.
- Use `2 log(p)/sqrt(p^k)` for each power. The diagnostic tests both sides of
  `log 4` and includes the powers `4,8,9,16` at wider supports.
- Accept configurable cutoff, dimension, quadrature order, penalty and floor.
  Every parameter still has to pass the analytic error and positivity checks.
- Evaluate spherical Bessel functions with equivalent interval formulas:
  `sqrt(π/(2z))J_{n+1/2}(z)` when `n<z`, and the previous `0F1` formula otherwise.
  This improves conditioning without changing the function being enclosed.

The preceding certificate proof applies with the constant `100` replaced by

\[
 \Phi=1+32/5+(T/2+1)\pi^2/6+\log\pi+m
       +\sum_{n=p^k<e^B}\frac{2\log p}{\sqrt n}\cosh(3\log n/16).
\]

Indeed `Re u≥5/32` and `|u|<T/2+1` for the digamma arguments in the same panel
ellipses when `T≥1`. The three analytic errors are

\[
 \delta_{\rm quad}=4TN\,\frac{\Phi B e^{3B/16}}\pi\,2^{1-2q},
\]
\[
 \delta_K=\frac{4BT\Phi}{\pi}e^{3BT/8}2^{1-N},\qquad
 \delta_C=8\gamma B e^{9B/16}2^{1-N}.
\]

Interval LDL must accept both parity blocks after subtracting the requested
gap and these errors, and the complementary identity floor must pass too.
Increasing `N` makes the analytic projection errors small. It does not imply
that the finite matrix is positive.

## 6. Reproduce and interpret the attempt

The accepted run uses `B=8/5`, `ε=5×10⁻¹³`, `T=160`, `N=224`, `q=48`,
`γ=1000`, `m=1/4`, and 384-bit precision. Both parity blocks of dimension 112
pass interval LDL. The enclosures give

- frequency-tail floor greater than `0.2953215`, exceeding `m`;
- quadrature operator error less than `3.609×10⁻²²`;
- omitted-mode operator error less than `1.727×10⁻²¹`;
- moment-projection error less than `2.336×10⁻⁶³`.

The source-hashed receipt is
`research-inputs/rh-positivity-audit/certificate-160-replay.json`. The generalized
checker also reproduces the earlier `B=1.3`, `ε=5×10⁻⁷` result with its original
cutoff/dimension at 192 bits; that receipt is `generalized-130-check.json`.
The smaller margin at the wider interval is not a weakening of the narrower
certificate: the wider result covers a larger test space.

```sh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/audit-weil-continuation.py
python scripts/certify-weil-window.py
# Deliberately invalid tail floor for the default cutoff and arithmetic:
python scripts/certify-weil-window.py --floor 1/2
```

The last command must fail before matrix construction. Earlier 192-bit runs at
the wider support stopped at pivot intervals containing zero; they were
inconclusive and produced no certificate. A numerical failure is not a negative
Weil test, and a finite successful run is not the all-support theorem.

For the next mathematical advance, the target is (5), or another estimate of
the same signed compressed arithmetic operator. A valid result must preserve
all tests, both pole conditions, all contributing prime powers, and every
cross-window term. Neither the derived identity nor the project's physical or
logical analogies establish that sign estimate by themselves.

## Prime-5 extension follow-up

The [prime-5 extension](prime5-extension-2026-09-30.md) certifies width 1.65
with gap 10⁻¹⁴ by retaining the exact edge-pair operator and its full inverse.
It also supplies a certified counterexample to the sufficient collar estimate
(2) at that width, while the complete form remains positive on the same test.
The all-support inequality (5) is still unproved.

## Prime-7 extension follow-up

The [prime-7 extension](prime7-extension-2026-10-01.md) certifies width 2 with
gap 10⁻²⁴, retaining the exact four-node interactions of primes 5 and 7.
Both 288-dimensional parity blocks pass interval congruence checks at 768 bits,
including all omitted-space and frequency-tail bounds. This extends the local
result to tests supported in (-1,1); it does not establish (5) at unbounded
width. The next prime-power-8 decomposition is derived but not positivity-certified.
