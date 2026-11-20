# Time-band Cauchy displacement and determinant response

## 0. Scope and outcome

This note records a cancellation-preserving response identity for the
residual-ridged fixed-window observable.  It proves three finite facts.

1. The exact finite time-band matrix has the same Cauchy displacement form
   as the source Weil matrix.
2. Consequently the homotopy `Q+s K_T` stays in that displacement class,
   and the parity determinant identity may be differentiated without
   separating the pole, archimedean, and prime blocks.
3. The reciprocal trace on the projected-anchor complement is exactly an
   odd reciprocal trace minus two scalar logarithmic responses.  At the
   existing `lambda=2,N=4,T=1` point these three terms undergo cancellation
   by more than two orders of magnitude.

An exact diagonal source-Cauchy family shows that the displacement,
inversion, both strict shifted signs, boundary nonvanishing, fixed anchor
residual, and the complete time-band covariance do not bound the reciprocal
trace.  The counterfamily is structural; it is not the pinned arithmetic
matrix.  Therefore the finite identities below expose a source-specific
quantity to estimate but do not supply its asymptotic estimate.

All source specializations use the centered interval `[-L/2,L/2]`,
Lebesgue measure, zero extension, reflection as inversion, and

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(x)e^{-itx}\,dx.       \tag{0.1}
\]

The combined source matrix is formed with every prime power
`1<n<=lambda^2` and with the minus sign on the prime block before any
inverse or absolute value is taken.  No zeta-zero list and no global Weil
positivity are used.  This note proves neither an unbounded shifted-sector
sign, the reciprocal-tail target, equation (5.2) of `DIRECT_RH_ATTACK.md`,
nor a determinant limit.  The formal project state remains
`P0_INVALIDATED`.

## 1. Exact Cauchy displacement of the time-band matrix

Put

\[
 c_n={2\pi n\over L},\qquad
 V_n(x)={(-1)^n\over\sqrt L}e^{ic_nx},qquad |n|\leq N.
                                                               \tag{1.1}
\]

The transform of a centered mode, with its removable values understood by
continuity, is

\[
 I_n(t)=\widehat V_n(t)
       ={2\sin(tL/2)\over\sqrt L\,(t-c_n)}.           \tag{1.2}
\]

For fixed `T>0`, the full finite time-band matrix is

\[
 (K_T)_{nm}=\int_{-T}^{T}I_n(t)I_m(t){dt\over2\pi}.   \tag{1.3}
\]

Define the even primitive

\[
 A_L(s)=\log|s|-\operatorname {Ci}(L|s|),             \tag{1.4}
\]

with its continuous value `-gamma-log(L)` at zero, and put

\[
 F_n={A_L(T-c_n)-A_L(T+c_n)\over2},qquad
 d_n={F_n\over\pi^2}.                                 \tag{1.5}
\]

Since `A_L` is even,

\[
 F_{-n}=-F_n,\qquad d_{-n}=-d_n,qquad d_0=0.         \tag{1.6}
\]

### Theorem 1.1 (time-band source-Cauchy formula)

For `n!=m`,

\[
 \boxed{(K_T)_{nm}={d_n-d_m\over n-m}.}               \tag{1.7}
\]

Consequently, for the integer mode operator `M V_n=nV_n`, and

\[
 \eta=\sum_{|n|\leq N}V_n,qquad
 \beta_T=\sum_{|n|\leq N}d_nV_n,                    \tag{1.8}
\]

one has

\[
 \boxed{[M,K_T]=|\beta_T\rangle\langle\eta|
                    -|\eta\rangle\langle\beta_T|.} \tag{1.9}
\]

**Proof.**  The primitive satisfies

\[
 A_L'(s)={1-\cos(Ls)\over s}
         ={2\sin^2(Ls/2)\over s}.                    \tag{1.10}
\]

For `n!=m`, partial fractions in (1.3), together with
`c_n-c_m=2*pi*(n-m)/L`, give

\[
 \begin{aligned}
 (K_T)_{nm}
 &= {2\over\pi L}{F_n-F_m\over c_n-c_m}\\
 &= {F_n-F_m\over\pi^2(n-m)}.
 \end{aligned}                                        \tag{1.11}
\]

This is (1.7).  The `(n,m)` entry of the left side of (1.9) is
`(n-m)(K_T)_(nm)`, while the corresponding right-side entry is
`d_n-d_m`.  The diagonal entries vanish on both sides.  \(\square\)

The diagonal values of `K_T` are still the closed sine-integral values from
the independent replay.  They do not enter the commutator.  Formula (1.7)
together with the symmetric-band diagonal integral proves that `K_T`
commutes with inversion.

The exact source matrix has

\[
 [M,Q]=|\beta_Q\rangle\langle\eta|
             -|\eta\rangle\langle\beta_Q|.           \tag{1.12}
\]

Therefore every real homotopy parameter `s` gives

\[
 \boxed{
 [M,Q+sK_T]
 =|\beta_Q+s\beta_T\rangle\langle\eta|
  -|\eta\rangle\langle\beta_Q+s\beta_T|.}           \tag{1.13}
\]

No approximation is present in (1.13).

## 2. Parity and anchor determinant factorization

Let `H_+` and `H_-` be the inversion-even and inversion-odd sectors, and
write `Q_+`, `Q_-`, `K_+`, and `K_-` for their restrictions.  Let

\[
 \delta f=\langle\eta,f\rangle,qquad e_0=V_0.        \tag{2.1}
\]

Fix a real unit even anchor `kappa`, put

\[
 q=\langle\kappa,Q_+\kappa\rangle,qquad
 {\cal K}=H_+\cap\kappa^\perp,                       \tag{2.2}
\]

and let `W:C^N -> K` be any isometry onto the complement.  Define

\[
 b=W^*(Q_+-qI)\kappa,qquad
 B=W^*(Q_+-qI)W,qquad
 K=W^*K_+W,                                           \tag{2.3}
\]

\[
 k=W^*K_+\kappa,qquad
 k_{00}=\langle\kappa,K_+\kappa\rangle.             \tag{2.4}
\]

For a real spectral parameter `z` and homotopy parameter `s`, put

\[
 \begin{aligned}
 A_s(z)&=Q_+-zI+sK_+,\\
 C_s(z)&=Q_--zI+sK_-,\\
 B_s(z)&=B+(q-z)I+sK,\\
 b_s&=b+sk,\\
 a_s(z)&=q-z+sk_{00}.
 \end{aligned}                                        \tag{2.5}
\]

Whenever the displayed inverses exist, define the anchor Schur scalar and
the boundary Weyl scalar by

\[
 \sigma_s(z)=a_s(z)-b_s^*B_s(z)^{-1}b_s,             \tag{2.6}
\]

\[
 m_s(z)=\delta\,A_s(z)^{-1}e_0.                      \tag{2.7}
\]

Below a prime on `sigma_0(z)` or `m_0(z)` always means differentiation in
the homotopy parameter at fixed `z`:

\[
 \sigma_0'(z):=\left.\partial_s\sigma_s(z)\right|_{s=0},
 \qquad
 m_0'(z):=\left.\partial_s m_s(z)\right|_{s=0}.       \tag{2.7a}
\]

### Theorem 2.1 (two-scalar determinant response)

One has

\[
 \boxed{
 \det C_s(z)=\det A_s(z)\,m_s(z)
            =\det B_s(z)\,\sigma_s(z)\,m_s(z).}     \tag{2.8}
\]

If the factors in (2.8) are nonzero near `s=0`, then

\[
 \boxed{
 \operatorname {tr}\{B_0(z)^{-1}K\}
 =\operatorname {tr}\{C_0(z)^{-1}K_-\}
  -{\sigma_0'(z)\over\sigma_0(z)}
  -{m_0'(z)\over m_0(z)}.}                           \tag{2.9}
\]

**Proof.**  Equation (1.13) has the same parity displacement used in the
source boundary-pullback theorem.  Applying that theorem to `Q+sK_T-zI`
gives the first equality in (2.8).  Ordinary block Schur complementation
relative to `C*kappa direct-sum K` gives the second equality.  Logarithmic
differentiation at zero proves (2.9).  \(\square\)

The derivatives in (2.9) are reconstructible without finite differences:

\[
 \boxed{
 m_0'(z)=-\delta A_0(z)^{-1}K_+A_0(z)^{-1}e_0,}      \tag{2.10}
\]

\[
 \boxed{
 \begin{aligned}
 \sigma_0'(z)={}&k_{00}
 -2\operatorname {Re}\langle k,B_0(z)^{-1}b\rangle\\
 &+\langle b,B_0(z)^{-1}KB_0(z)^{-1}b\rangle.
 \end{aligned}}                                      \tag{2.11}
\]

Under the two strict shifted signs `B>0`, `Q_--qI>0`, and for `b!=0`,
all factors at `z=q` are nonzero.  Indeed,

\[
 \sigma_0(q)=-\langle b,B^{-1}b\rangle<0,            \tag{2.12}
\]

and (2.8) then forces `m_0(q)!=0`.  Equation (2.9) becomes the exact
unregularized reciprocal identity

\[
 \boxed{
 H_0:=\operatorname {tr}(B^{-1}K)
 =\operatorname {tr}\{(Q_--qI)^{-1}K_-\}
  -\partial_s\log\{\sigma_s(q)m_s(q)\}|_{s=0}.}      \tag{2.13}
\]

There is also a directly regularized version.  Set `z=q-r`, where
`r=||b||>0`.  Then `B_0(z)=B+rI`, and multiplication of (2.9) by `r`
gives

\[
 \boxed{
 \operatorname {tr}\{r(B+rI)^{-1}K\}
 =r\operatorname {tr}\{(Q_--qI+rI)^{-1}K_-\}
  -r\partial_s\log\{\sigma_s(q-r)m_s(q-r)\}|_{s=0}.}
                                                               \tag{2.14}
\]

Under `B>0`, this logarithmic derivative is automatically nonsingular:

\[
 \sigma_0(q-r)
 =r-\langle b,(B+rI)^{-1}b\rangle>0,                 \tag{2.15}
\]

because `(B+rI)^(-1)<r^(-1)I` and `||b||=r`.  The odd
factor is positive under `Q_--qI>0`, and (2.8) then also makes the boundary
factor nonzero.

Equations (2.13)--(2.14) preserve the cancellation between the odd response,
the anchor self-energy, and the boundary response.  Bounding their absolute
values separately is not justified by these identities.

## 3. Point reconnaissance: the cancellation is large

Using the existing checkpoint-0.64 `lambda=2,N=4,T=1` producer values for
the source matrix and anchor, but rebuilding `K_T` through the independent
closed `Si/Ci` path, (2.13) gives at 80 decimal working precision

```text
tr(B^(-1) K)                         4499.9036000476513009075
tr((Q_- - q I)^(-1) K_-)            27247.8705450737556375640
- sigma'(q)/sigma(q)              +2871547.3108177572527752
- m'(q)/m(q)                       -2894295.2777627833571118
identity defect                         4.8e-71
```

At the ridge `z=q-r`, the three terms in (2.14), already multiplied by
`r`, are

```text
odd response                           +0.00645580855324350103
- r sigma'(q-r)/sigma(q-r)             -0.218437035581166920
- r m'(q-r)/m(q-r)                     +0.290776344313408383
combined soft trace                     0.0787951172854849640
```

The 40-decimal reconstruction gives the same displayed digits and an
identity defect below `8e-32`.  These are point diagnostics, not interval
or ball enclosures and not evidence for an unbounded rate.  Their role is
methodological: a triangle inequality on the three response terms loses the
observed effect by orders of magnitude.

## 4. Exact source-Cauchy no-go family

The response identity does not by itself bound its positive left side.
Fix one finite interval and `T>0`, take `N=2`, and use the normalized parity
basis

\[
 e_0=V_0,qquad e_j^+={V_j+V_{-j}\over\sqrt2},qquad
 e_j^-={V_j-V_{-j}\over\sqrt2}.                     \tag{4.1}
\]

Choose `0<s<1/sqrt(2)`, put `c=sqrt(1-s^2)`, and let `epsilon>0`.  For an
arbitrary real scalar `a`, define a diagonal source-Cauchy matrix by

\[
 b_n^{\rm C}=0,qquad
 a_0=a,qquad a_{\pm1}=a+1,qquad
 a_{\pm2}=a+s^2+\epsilon.                            \tag{4.2}
\]

Thus every off-diagonal entry is zero, inversion is exact, and the source
commutator holds with `beta=0`.  Take

\[
 \kappa=ce_0+se_1^+,qquad
 \omega=-se_0+ce_1^+.                               \tag{4.3}
\]

Direct calculation gives

\[
 q=a+s^2,qquad r=\|(Q-qI)\kappa\|=sc,              \tag{4.4}
\]

and, on `K=span{omega,e_2^+}`,

\[
 \boxed{B=\operatorname {diag}(1-2s^2,\epsilon).}    \tag{4.5}
\]

The odd shifted block is

\[
 \boxed{Q_--qI=\operatorname {diag}(c^2,\epsilon).} \tag{4.6}
\]

Hence both finite shifted signs are strict.  The global ground is the
simple even vector `e_0`, with nonzero boundary value, for every
`epsilon>0`.  Moreover `Qe_0=ae_0`, so changing `epsilon` preserves the
complete first column and every scalar weak boundary test on this ground.

Let `K` now be the actual compressed time-band operator from (1.3).  Since
the transform of `e_2^+` is a nonzero entire function,

\[
 k_{22}=\langle e_2^+,K_Te_2^+\rangle>0.             \tag{4.7}
\]

The reciprocal trace is exactly

\[
 \boxed{
 \operatorname {tr}(B^{-1}K)
 ={\langle\omega,K_T\omega\rangle\over1-2s^2}
  +{k_{22}\over\epsilon}.}                          \tag{4.8}
\]

Thus it diverges as `epsilon` decreases to zero while the anchor, `q`,
`r`, its transverse energy `1-2s^2`, the source commutator, the first
column, boundary nonvanishing, and both strict signs remain fixed.  The
regularized contribution of the hidden mode is

\[
 {r\over\epsilon+r}k_{22}\longrightarrow k_{22}>0.  \tag{4.9}
\]

The reciprocal-tail threshold cannot hide this mode.  For every `u>0`,
the spectral weight `k_22` lies in the low layer when `u>=epsilon` and in
the reciprocal tail when `u<epsilon`.  Hence

\[
 \boxed{
 \Phi(u)+rH(u)\geq
 k_{22}\min\!\left\{1,{r\over\epsilon}\right\}.}     \tag{4.10}
\]

In particular, when `epsilon<r`, every threshold has a fixed positive
lower bound.

The family can be perturbed by any fixed nonzero odd Cauchy sequence with
coefficient `o(epsilon)`; finite-dimensional continuity preserves the two
strict signs, boundary nonvanishing, and the divergence.  The zero
displacement vector is therefore not essential.

This is not an arithmetic Weil counterexample.  The pinned source entries
fix the diagonal coefficients instead of permitting (4.2).  It proves the
narrow logical statement that the Cauchy displacement, boundary tests,
moment identities, and sign hypotheses cannot replace an arithmetic lower
bound excluding a captured near-null complementary direction.

## 5. Relation to the boundary and moment reductions

The boundary-discrepancy identity tests the finite ground weakly against the
constant mode.  In the family above, its left column and ground are
independent of `epsilon`; the reciprocal divergence lives in `e_2^+` and is
invisible to that scalar test.  Choosing the scalar `a` to match one declared
boundary quotient leaves (4.8) unchanged.  This does not make the family a
pinned arithmetic matrix; it shows exactly why one boundary scalar cannot
control the complementary inverse.

The fixed-window moment theorem makes the covariance outside an `O(L)`
physical range superpolynomially small.  It does not lower-bound `B` on that
range.  The hidden vector in (4.8) is itself seen by the time band, so a
moment-tail estimate cannot remove it.

The source commutator supplies the determinant factorization (2.8), but its
right side is a signed product.  At the actual pilot, the two scalar
logarithmic derivatives are individually about `2.9e6` and have opposite
signs.  Neither the safe-half-plane Laplace formula for the boundary
discrepancy nor absolute prime-number-theorem envelopes currently control
their combined derivative at the required scale.

## 6. Best next theorem and diagnostic

The exact unregularized target can now be stated without an eigenbasis:

\[
 \boxed{
 r\left[
 \operatorname {tr}\{(Q_--qI)^{-1}K_-\}
 -\partial_s\log\{\sigma_s(q)m_s(q)\}|_{s=0}
 \right]=o(L^{-3/2}).}                               \tag{6.1}
\]

The sharper direct soft-trace target is the identical statement at
`z=q-r`, as in (2.14), with the left side required to be `o(L^(-3/2))`.
Any proof through (6.1) must estimate the bracket as one signed response;
separate magnitude bounds destroy its cancellation.

The next source diagnostic should therefore reconstruct, at each declared
parameter and at doubled precision,

1. the coefficients `d_n` in (1.5) and the exact displacement defect;
2. `m_s`, `sigma_s`, and their analytic derivatives at both `z=q` and
   `z=q-r`;
3. the odd reciprocal response and the combined identity defects in
   (2.13)--(2.14); and
4. the positive spectral/Feshbach decomposition independently, so a signed
   cancellation cannot manufacture a false pass.

A theorem must use the actual pole--archimedean--inclusive-minus-prime
coefficients to exclude the hidden-mode mechanism in Section 4 or prove the
combined derivative in (6.1) directly.  No current source estimate does so.
