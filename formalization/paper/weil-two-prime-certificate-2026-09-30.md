# A two-prime local Weil certificate

**Result of the September 30 proof attempt:** the verifier supplied here certifies

\[
 W(h)\ge \frac1{2{,}000{,}000}\|h\|_2^2
\]

for every complex-valued `h ∈ C_c^∞((-13/20,13/20))` satisfying
`hhat(i/2)=hhat(-i/2)=0`, with Fourier convention
`hhat(t)=∫h(x)e^{-itx}dx`. This is a local computer-assisted result with a written
analytic reduction and Arb interval arithmetic. It is not an RH proof, a formally
verified theorem, a refereed result, or a claim to improve a published record.

The new ingredient is a combination of the project's exact arithmetic bridge and
its uncertainty/concentration approach: preserve the signed compact-frequency
operator, control its full orthogonal complement, and enforce the two pole
constraints using positive penalties. Neither a sampled spectrum nor a projected
moment condition is used as the final acceptance criterion.

## 1. Exact form and scope

Let `B=13/10`, `a=B/2`. Since `log 3 < B < log 4`, the exact pole-free Weil form on
these tests is

\[
 W(h)=\frac1{2\pi}\int_{\mathbb R}w(t)|\widehat h(t)|^2dt,
\quad w(t)=\Re\psi(1/4+it/2)-\log\pi
 -\sqrt2\log2\cos(t\log2)
 -\frac{2\log3}{\sqrt3}\cos(t\log3).
\]

All other prime-power shifts lie outside the autocorrelation support and pair to
zero. The same formula represents the form on narrower supports: any newly
exterior term pairs to zero there. Thus the certificate also covers every smaller
support width, including the proposed `B=11/10` milestone. The two positive
penalties below are auxiliary; they are **not** an assertion that the actual pole
term is positive.

The [direction audit](rh-direction-audit-2026-09-30.md) explains the classical
all-support criterion and sign convention. Positivity for all pole-free compact
tests implies RH; positivity on this single bounded support range does not.

## 2. A bounded operator below the form

Set `T=80`, `m=29/100`. For `u>0`,

\[
 \Re\psi(u+iv)-\psi(u)
 =\sum_{k=0}^{\infty}\frac{v^2}{(k+u)((k+u)^2+v^2)}.
\]

Every summand increases with `|v|`. The interval evaluation at `t=T` gives

\[
 \Re\psi(1/4+40i)-\log\pi
 -\sqrt2\log2-2\log3/\sqrt3 > 0.2953167 > m.
\]

Consequently `w(t)≥m` for `|t|≥T`. Define the bounded self-adjoint operator `K` on
`H=L²(-a,a)` by

\[
 \langle h,Kh\rangle=
 \frac1{2\pi}\int_{-T}^{T}(w(t)-m)|\widehat h(t)|^2dt.
\]

Plancherel implies `W(h)≥m||h||²+⟨h,Kh⟩` on the smooth test core. Let
`c(x)=cosh(x/2)`, `s(x)=sinh(x/2)` and `γ=1000`, and put

\[
 A=mI+K+\gamma(c\otimes c+s\otimes s),
 \qquad (v\otimes v)h=v\langle v,h\rangle.
\]

Both penalty terms vanish exactly on pole-free tests. It suffices to prove
`A≥εI` on all of `H`, with `ε=1/2,000,000`. This avoids assuming that a finite
projection of a pole-free function is still pole-free.

## 3. Finite matrix, with all normalizations specified

Let `P=P_N`, `N=128`, project onto the first `N` orthonormal Legendre functions

\[
 \phi_n(x)=\sqrt{(2n+1)/B}\,P_n(x/a),\qquad 0\le n<N.
\]

Their Fourier transforms are

\[
 \widehat\phi_n(t)=\sqrt{B(2n+1)}(-i)^n j_n(at),\qquad
 j_n(z)=\frac{z^n}{(2n+1)!!}\,{}_0F_1(n+3/2;-z^2/4).
\]

The even and odd blocks decouple. Within either block, write
`b_n(t)=sqrt(B(2n+1))(-1)^floor(n/2) j_n(at)`. Then

\[
 (PKP)_{nk}=\frac1\pi\int_0^T(w(t)-m)b_n(t)b_k(t)dt.
\]

The moment vector in each parity block is

\[
 v_n=\sqrt{B(2n+1)}\,i_n(a/2),\qquad
 i_n(z)=\frac{z^n}{(2n+1)!!}\,{}_0F_1(n+3/2;z^2/4),
\]

using `c` for even `n` and `s` for odd `n`. The finite matrix is therefore
`A_N=mI+K_N+γvvᵀ` in each block of dimension 64. The code constructs these
matrices using interval special functions and interval matrix multiplication.

## 4. Certified integration error

Each interval of length `ℓ=1/2` in `[0,80]` uses 32-point Gauss–Legendre
quadrature. Arb encloses both the roots and their weights. To bound its analytic
error, use the Bernstein ellipse with parameter `ρ=2` on each interval.
Every point `z` in these ellipses has

\[
 |\Im z|\le3/16,\qquad -1/16\le\Re z\le80+1/16.
\]

The holomorphic continuation of the symbol is

\[
 w(z)=\tfrac12[\psi(1/4+iz/2)+\psi(1/4-iz/2)]-\log\pi
       -\sum_{p=2,3}\frac{2\log p}{\sqrt p}\cos(z\log p).
\]

This is not an attempt to use `Re ψ` as a holomorphic function. Each digamma
argument `u` satisfies `Re u≥5/32` and `|u|<41`. The convergent identity

\[
 \psi(u)=-\gamma_E-1/u+\sum_{k=1}^\infty\frac{u}{k(k+u)}
\]

and `0<γ_E<1` give

\[
 |w(z)-m|\le
 1+32/5+41\pi^2/6+\log\pi+m+
 \sum_{p=2,3}\frac{2\log p}{\sqrt p}\cosh(3\log p/16)<100.
\]

The verifier checks this final inequality using interval arithmetic (the bound
is less than 78.562). Cauchy–Schwarz gives
`|φhat_n(z)|≤sqrt(B) exp(a|Im z|)`. Thus every matrix-entry integrand, including
its `1/π`, is bounded on the ellipse by

\[
 M=100 B e^{3B/16}/\pi.
\]

For an analytic function bounded by `M` on a `ρ` ellipse, its Chebyshev series
has coefficient bounds `|c_k|≤2Mρ^{-k}`. Truncating at degree `2q−1` has uniform
error at most `2Mρ^{1−2q}/(ρ−1)`. Since a `q`-point Gauss rule is exact through
degree `2q−1`, has positive weights summing to `ℓ`, and integration also has norm
`ℓ`, the error on one panel is at most `4ℓMρ^{1−2q}/(ρ−1)`.
Summing the 160 panels gives entry error

\[
 E=4TM2^{1-64},\qquad \delta_{\rm quad}=NE<2.345\cdot10^{-13}.
\]

The Hermitian entry-error matrix has norm at most `NE`; using the full dimension
`N` instead of a block dimension is conservative. Interval evaluation errors
are already enclosed by Arb and are additional to, not substitutes for, this
analytic quadrature bound.

## 5. Infinite-dimensional complement

For `e_t(x)=e^{itx}`, approximate the function of `x/a∈[-1,1]` by its first `N`
Chebyshev terms, again on the `ρ=2` ellipse. Since `|t|≤T`, its modulus there is
at most `exp(3aT/4)`. Orthogonal projection is the best L² approximation, so

\[
 \|(I-P)e_t\|_2\le\sqrt B\,r_N,
 \qquad r_N=2e^{3aT/4}2^{1-N}.
\]

The integral representation of `K` as weighted rank-one operators gives

\[
 \|K(I-P)\|\le BT\cdot100\,r_N/\pi,
 \quad \|K-PKP\|\le2\|K(I-P)\|
 \le\delta_K:=2BT\cdot100\,r_N/\pi.
\]

For each of `c,s`, `||v||₂≤sqrt(B)e^{a/2}`. On the same spatial ellipse their
moduli are bounded by `e^{5a/8}`, giving
`||(I-P)v||₂≤2sqrt(B)e^{5a/8}2^{1−N}`. Since
`||v⊗v−Pv⊗Pv||≤2||v||||(I−P)v||`, both penalties together have error

\[
 \delta_C=8\gamma B e^{9a/8}2^{1-N}.
\]

At the stated parameters, the verifier encloses
`δ_K<6.740×10⁻¹⁸` and `δ_C<1.270×10⁻³⁴`. These bounds include every omitted
Legendre mode, not a further finite sample of them.

## 6. Acceptance and reproducibility

Let `Ã_N` denote the quadrature matrix before analytic error correction. Each
parity block is tested by interval LDL factorization of

\[
 \widetilde A_N-
 (\epsilon+\delta_{\rm quad}+\delta_K+\delta_C)I.
\]

Every pivot must have a strictly positive interval lower bound. For a symmetric
matrix this proves positive definiteness; a pivot interval containing zero causes
rejection. The checker also verifies `m>ε+δ_K+δ_C`. Comparing `A` with
`A_N ⊕ mI` now proves `A≥εI`. The lower-pivot values in the receipts are **not**
eigenvalue estimates or claimed gaps.

```sh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/certify-weil-two-prime.py
python scripts/certify-weil-two-prime.py --precision 256
# Deliberately too large for this finite lower-operator certificate; must reject:
python scripts/certify-weil-two-prime.py --gap 0.00001
```

The 192-bit and 256-bit runs both pass at `B=1.3`, `ε=0.0000005`. The last
command fails a positive-pivot check; rejection does not prove that the true
Weil form fails that larger bound. Receipts in
`research-inputs/rh-positivity-audit/certificate-130-replay*.json` include the
script SHA-256, package version, parameters and error enclosures. Repeating at
higher precision tests numerical stability; it is not an independent proof of
the analytic reduction or the implementation. Those remain review obligations.

The interval library is [python-flint](https://python-flint.readthedocs.io/en/stable/arb.html)
0.8.0, wrapping FLINT/Arb. The formulas above specify the reduction sufficiently
to implement another checker without trusting the original matrix calculation.

## 7. What the other attempts contribute—and what they do not

- **Twin ladder / arithmetic bridge:** supplies the exact signed Weil symbol and
  the relevant RH quantifier: all compact pole-free tests.
- **Heisenberg / uncertainty:** supplies a useful question about concentration
  and the omitted space. Preserving the signed compact operator avoids the loss
  from separately bounding its positive and negative parts.
- **Freezing / Schur-complement thinking:** motivates checking the remaining
  space rather than inspecting a finite spectrum. The present proof uses norm
  bounds and LDL; it does not establish any of the freezing program's Λ claims.
- **Fluid / mirror descent:** retains useful identities and zero dynamics, but
  no global zero-exclusion estimate from those identities is supplied here.
- **Supercritical fluids / superwires / Gödel witnesses:** no additional proved
  implication from these reviewed modules is needed or assumed in this certificate.

Two specific obstructions emerged during this attempt:

**Higher derivative exterior atoms need a different tail argument.** For the
repo's finite lattice-frequency ansatz, write
`ν(t)=Σ_{k≤d}t^k P_k(t)`, where the top nonzero `P_d` is a trigonometric polynomial
with nonzero frequencies and hence mean zero. If `d>4`, choose a phase with
`P_d(t₀)<0` and repeat it along the positive period sequence `t_j→∞`. For any
fixed finite prime list, the arithmetic symbol obeys
`σ(t)=O(t⁴ log t)`. Therefore `(σ(t_j)+ν(t_j))/t_j^d→P_d(t₀)<0`.
A nonzero degree-five family cannot certify nonnegativity on the whole real
axis in this ansatz, even if it succeeds on `[0,40]`. This statement is scoped
to the specified lattice ansatz; it does not rule out other distributions,
support constructions, or uncertainty proofs. The degree-four-or-less and
finite-section approaches are unaffected.

**Zero density is weaker than zero exclusion.** A thermodynamic order parameter
defined as an asymptotic fraction of off-axis zeros can vanish while exceptions
remain. For example, the even real entire function `(z²+1)cos z` has two nonreal
zeros and infinitely many real zeros, so its fraction of nonreal zeros tends to
zero. This is a counterexample to that inference alone, not a counterexample
about zeta or all the project's physical hypotheses. A claimed equivalence
between RH and a vanishing limiting fraction needs an additional theorem
excluding finite or sparse exceptions.

## 8. The exact remaining proof obligation

For an arbitrary width `B`, replace the prime part by

\[
 -2\sum_{p^k:\,k\log p<B}\frac{\log p}{p^{k/2}}\cos(kt\log p).
\]

The `p²=4` contribution enters after `B=log 4`. A possible continuation is to
construct `T_B,m_B,γ_B,N_B` and certified lower matrices at an unbounded nested
sequence of widths, with errors controlled as above. Each width may use its own
positive margin; no uniform gap is necessary. This proposal becomes an RH proof
only with a theorem guaranteeing positivity and termination at **all** those
widths. Increasing `N` controls truncation, but does not itself make the exact
finite matrix positive. Assuming that positivity would assume the missing
arithmetic content.

The present result crosses the first additional-prime threshold. It does not
establish that all-width theorem, and the many named attacks cannot substitute
for it merely by being combined.
