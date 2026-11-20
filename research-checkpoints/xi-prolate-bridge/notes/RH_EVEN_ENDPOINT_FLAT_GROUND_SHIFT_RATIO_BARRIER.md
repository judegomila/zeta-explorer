# RH even endpoint-flat ground-shift ratio barrier

## 0. Exact outcome and claim boundary

Let

\[
 L=2\log\lambda,
 \qquad N=\lceil\lambda L^3\rceil,
 \qquad \Omega_N={2\pi N\over L}.                 \tag{0.1}
\]

Work on the branch where every nontrivial zero is on the critical line,
and retain the finite strict hypotheses of checkpoints 1.37--1.40.  Fix
`1/2<theta<1`, put `M=floor(theta*N)`, and let `h_N` be the unit
positive-index even quotient vector from the checkpoint-1.40 endpoint-flat
construction.  Write

\[
 T_N=\gamma_M^\#,
 \qquad
 r_N^{\rm flat}=\langle h_N,A^\circ h_N\rangle,
 \qquad
 \alpha_N=\lambda_{\min}(A^\circ).                \tag{0.2}
\]

The first exact advance is a full-even lift of this particular witness.
There is a clamped twice primitive `G_N` in the full centered even space
such that

\[
 G_N''=h_N,
 \qquad G_N(\mathord\pm L/2)=G_N'(\mathord\pm L/2)=0,
 \qquad
 \widehat h_N(t)=-t^2\widehat G_N(t).              \tag{0.3}
\]

Since `h_N` annihilates the first `M` distinct positive zero rows, every
nonzero sample in (0.3) lies at height at least `T_N`.  If

\[
 D_N^{\rm flat}={\|h_N\|_2^2\over\|G_N\|_2^2},
 \qquad
 \varkappa_N^{\rm flat}={r_N^{\rm flat}\over\alpha_N}\geq1,
                                                               \tag{0.4}
\]

then min--max and Bernstein give the exact chain

\[
 \boxed{
 {\mu\over\alpha_N}
 \leq
 {D_N^{\rm flat}\over T_N^4}\,
 \varkappa_N^{\rm flat}
 \leq
 \left({\Omega_N\over T_N}\right)^4
 \varkappa_N^{\rm flat}.}                         \tag{0.5}
\]

The checkpoint-1.40 count gives `T_N/Omega_N>=2*theta-o(1)`.  At its
optimized value `theta_*=0.7273666087...`, the explicit scalar in (0.5)
is

\[
 \left({1\over2\theta_*}\right)^4
 =0.2232886136\ldots .                              \tag{0.6}
\]

This is not an even reserve theorem.  The new factor
`varkappa_N^flat` is the saturation of the endpoint-flat witness relative
to the true positive-index floor.  No frozen result bounds it.

The second advance identifies the exact scalar target without using a
generic lower frame.  In the central decomposition

\[
 Q_+^Z=\begin{pmatrix}a&b^*\\ b&A^\circ\end{pmatrix},
 \qquad
 s_0=a-b^*(A^\circ)^{-1}b
 ={\det Q_+^Z\over\det A^\circ},                   \tag{0.7}
\]

the simple ground equation gives

\[
 \boxed{
 {\mu\over\alpha_N}
 ={s_0\over
 \alpha_N\{1+b^*(A^\circ)^{-1}
                  (A^\circ-\mu I)^{-1}b\}}.}       \tag{0.8}
\]

Thus an oriented relative Schur/cofactor estimate, not another absolute
Rayleigh envelope, is required.

Finally, an exact same-prolate-anchor source-Cauchy family proves that all
of these finite algebraic data can coexist with

\[
 \boxed{{\mu\over\lambda_{\min}(A^\circ)}\longrightarrow1.}  \tag{0.9}
\]

The family has a simple even ground, a strictly positive shifted odd block,
a strictly positive central-deleted even block, the same actual projected
prolate vectors as comparison anchors, and every displayed determinant and
cofactor identity.  Its endpoint-flat Rayleigh scale may be set to
`exp(-(c_*-o(1))*N)`, and `mu/r_N^flat=1/5` lies below (0.6), while (0.9)
still holds.

This family is a structural source-Cauchy matrix.  It is not the actual
pole--archimedean--minus-prime matrix and is not the actual zeta zero Gram.
It therefore proves no actual failure of the reserve.  It proves that the
checkpoint-1.40 primitive comparison, exact source displacement, simple
ground, strict shifted signs, determinant identities, same prolate anchor,
and all current absolute envelopes do not by themselves control (0.9).

No quantitative actual even reserve, shifted-node uniqueness, determinant
convergence, normalization transfer, prolate-normalized response bound,
new zero theorem, RH proof or converse, or de Bruijn--Newman `Lambda` bound
is obtained.  The standard eight are unchanged and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

Only the following four frozen pairs are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/RH_EVEN_QUOTIENT_ENDPOINT_FLAT_FLOOR_OBSTRUCTION.md` | `b0a561a048df0b0eede249be8cc014ce29b8aa8fa29efb61de5d9bf773822d8c` |
| `tests/test_rh_even_quotient_endpoint_flat_floor_obstruction.py` | `1f9caeec9487afd7a632b8572e1e401dbca22a2acb2b37b5359d5b5bf6ce1742` |
| `notes/RH_EVEN_DERIVATIVE_RELATIVE_LEAKAGE_COMPARISON_BARRIER.md` | `0cf345e6eccd543fa2552848bc79be9b51e0e74217b2947ca9c1ad8cde26479c` |
| `tests/test_rh_even_derivative_relative_leakage_comparison_barrier.py` | `5f70ccb12dfc9892f020551a17bdf516706b353fcd60f18108aa93ca923214d7` |
| `notes/CENTRAL_PROLATE_NORMALIZATION_FEEDBACK_BARRIER.md` | `00efc515b17157da25e980962aee7fafdd4ea522e92b5db0caca290fead0490d` |
| `tests/test_central_prolate_normalization_feedback_barrier.py` | `128026af692bf3f03663510b4dadbab3518509e107ab488c1c00a4e9f3a84e66` |
| `notes/RH_EVEN_ZERO_GRAM_GEVREY_RELATIVE_RESERVE_BARRIER.md` | `4527a5cc5ba8a7c66b76ff70c4aa4423aaecd60fe10ba52cee134b9d9c2ef36c` |
| `tests/test_rh_even_zero_gram_gevrey_relative_reserve_barrier.py` | `fe276d7e4e60f1f40ec10fc4dac1cee8084fc3e8df969fa3a9f30ef64cd4ad86` |

The first pair supplies the actual quotient vector, its exact endpoint
moments, the multiplicity-safe zero-row annihilation, and the lower bound
for `T_N/Omega_N`.  The second supplies the actual projected-prolate
quantities `q_N` and `r_N^pr` and fixes their distinction from the floor.
The third supplies the unshifted hyperplane source-Cauchy family and the
same-prolate-anchor convention.  The fourth fixes the actual even zero
Gram, the reflected-height normalization, and the reserve ratio.

No zero table, external source, numerical ordinate, new source lock, or
standard-eight byte is imported.

## 2. The clamped primitive of the endpoint-flat quotient

Use the aligned centered even basis

\[
 e_0(x)=L^{-1/2},
 \qquad
 e_n^+(x)=\sqrt{2/L}(-1)^n
       \cos\left({2\pi nx\over L}\right),
 \qquad1\leq n\leq N,                              \tag{2.1}
\]

and put `omega_n=2*pi*n/L`.  Write

\[
 h_N=\sum_{n=1}^Nh_ne_n^+,
 \qquad \sum_{n=1}^Nh_n=0.                         \tag{2.2}
\]

The final equality is exactly the zeroth endpoint-moment cancellation in
the quotient construction.  Define

\[
 G_N=G_0e_0-\sum_{n=1}^N{h_n\over\omega_n^2}e_n^+,
 \qquad
 G_0=\sqrt2\sum_{n=1}^N{h_n\over\omega_n^2}.       \tag{2.3}
\]

Every basis vector in (2.1) has the same physical endpoint value after its
normalization factor is included.  Hence (2.3) gives

\[
 G_N(\mathord\pm L/2)=0.
                                                               \tag{2.4}
\]

All first derivatives of the even modes vanish there, and coefficientwise
differentiation gives

\[
 G_N'(\mathord\pm L/2)=0,
 \qquad G_N''=h_N.                                  \tag{2.5}
\]

Twice integrating the compact Fourier transform by parts proves (0.3),
with no endpoint remainder.  This construction uses no division by a zero
sample and includes every carrier through continuous interpretation.

On RH the full even zero Gram and the positive-index block have the same
paired sampling normalization on their respective vectors.  Since
`hat(h_N)(gamma)=0` for the first `M` distinct positive ordinates,

\[
 \begin{aligned}
 \langle G_N,Q_+^ZG_N\rangle
 &=2\sum_{\gamma>T_N}m_\gamma
                 {|\widehat h_N(\gamma)|^2\over\gamma^4}\\
 &\leq {1\over T_N^4}
       2\sum_{\gamma>T_N}m_\gamma
                 |\widehat h_N(\gamma)|^2\\
 &={r_N^{\rm flat}\over T_N^4},
 \end{aligned}                                      \tag{2.6}
\]

where `||h_N||_2=1`.  Min--max yields

\[
 \mu\leq {r_N^{\rm flat}\over T_N^4\|G_N\|_2^2}
 ={D_N^{\rm flat}\over T_N^4}r_N^{\rm flat}.       \tag{2.7}
\]

Because `G_N` is bandlimited by `Omega_N`, Bernstein gives

\[
 D_N^{\rm flat}
 ={\|G_N''\|_2^2\over\|G_N\|_2^2}
 \leq\Omega_N^4.                                   \tag{2.8}
\]

Dividing (2.7) by `alpha_N` proves (0.5).  The HSW consequence frozen in
checkpoint 1.40 gives

\[
 {T_N\over\Omega_N}\geq2\theta-o(1),              \tag{2.9}
\]

and hence

\[
 {\mu\over\alpha_N}
 \leq\{(2\theta)^{-4}+o(1)\}
       \varkappa_N^{\rm flat}.                     \tag{2.10}
\]

At the optimizer, `theta_*=1/W(2e)`, so the limiting scalar is
`{W(2e)^4}/16`, which is (0.6).

The orientation in (2.6) is essential.  Multiplication by `gamma^(-4)`
helps only because all surviving samples lie above `T_N`.  It gives no
lower bound for `alpha_N`, and (2.10) is useful only with a separate upper
bound for the saturation factor `varkappa_N^flat`.

## 3. Exact Schur, determinant, and cofactor target

Write the actual full even Gram in the central chart as in (0.7), and put

\[
 \alpha_N=\lambda_{\min}(A^\circ),
 \qquad
 \ell_\mu=b^*(A^\circ)^{-1}
                 (A^\circ-\mu I)^{-1}b.            \tag{3.1}
\]

The finite strict hypotheses give `A^circ-mu*I>0`.  The scalar Schur
equation at the simple ground is

\[
 a-\mu-b^*(A^\circ-\mu I)^{-1}b=0.                \tag{3.2}
\]

Using

\[
 (A^\circ-\mu I)^{-1}-(A^\circ)^{-1}
 =\mu(A^\circ)^{-1}(A^\circ-\mu I)^{-1}           \tag{3.3}
\]

in (3.2) gives

\[
 \boxed{s_0=\mu(1+\ell_\mu),
 \qquad
 s_0={\det Q_+^Z\over\det A^\circ}.}              \tag{3.4}
\]

This proves (0.8).  In particular, either

\[
 {s_0\over\alpha_N}=o(1)                           \tag{3.5}
\]

or a quantitatively growing leverage `ell_mu` would be sufficient for a
small reserve ratio.  Neither is frozen.

Let `kappa_N` be the unit actual projected-prolate anchor, with nonzero
central coefficient `kappa_(0,N)`, and retain

\[
 q_N=\langle\kappa_N,Q_+^Z\kappa_N\rangle.          \tag{3.6}
\]

Completing the square after central normalization gives the exact identity

\[
 {q_N\over|\kappa_{0,N}|^2}
 =s_0+
 \left\|(A^\circ)^{1/2}
 \left({\kappa_N^\circ\over\kappa_{0,N}}
       +(A^\circ)^{-1}b\right)\right\|_2^2.        \tag{3.7}
\]

Thus the prolate trial proves only

\[
 s_0\leq {q_N\over|\kappa_{0,N}|^2}.               \tag{3.8}
\]

The known central coefficient has square scale `1/L`, so the frozen upper
bound for `q_N` remains an absolute upper bound for `s_0`; it does not
compare (3.8) with the unknown, possibly much smaller `alpha_N`.

There is an equivalent cofactor form at the shifted ground.  Put

\[
 H=Q_+^Z-\mu I,
 \qquad O_\mu=Q_-^Z-\mu I,
\]

and let `Phi_mu` be the boundary-normalized simple ground.  The source
cofactor identity is

\[
 \operatorname {adj}(H)e_0=(\det O_\mu)\Phi_\mu.   \tag{3.9}
\]

Taking the central coordinate gives

\[
 \boxed{
 \det(A^\circ-\mu I)
 =\det(O_\mu)\langle e_0,\Phi_\mu\rangle.}         \tag{3.10}
\]

This is exact, but it contains the oriented central ground coefficient.
Without a relative estimate for that coefficient or for (3.5), the odd
determinant cannot orient `mu/alpha_N`.

## 4. Shifted-hyperplane same-prolate-anchor obstruction

Let `d=2N+1`, let

\[
 \eta=\sum_{n=-N}^NV_n,
 \qquad g={\eta\over\sqrt d},                      \tag{4.1}
\]

and take arbitrary positive scalars `tau` and `epsilon`.  Define on the
same raw source modes

\[
 \boxed{
 Q_{\tau,\epsilon}
 =\tau I+\epsilon
 \left(I-{1\over d}|\eta\rangle\langle\eta|\right).}         \tag{4.2}
\]

This is an exact real inversion-symmetric source-Cauchy matrix.  Its raw
parameters are

\[
 b_n=-{\epsilon n\over d},
 \qquad
 a_n=\tau+\epsilon\left(1-{1\over d}\right),       \tag{4.3}
\]

because every off-diagonal entry is

\[
 {b_n-b_m\over n-m}=-{\epsilon\over d}.            \tag{4.4}
\]

In parity coordinates,

\[
 Q_+g=\tau g,
 \qquad
 Q_+|_{g^\perp}=(\tau+\epsilon)I,
 \qquad
 Q_-=(\tau+\epsilon)I_N.                           \tag{4.5}
\]

Thus `mu=tau` is a simple inversion-even ground and

\[
 Q_--\mu I=\epsilon I_N>0.                         \tag{4.6}
\]

Delete the central coordinate.  With `1_N=(1,...,1)^T`,

\[
 A^\circ=(\tau+\epsilon)I_N
             -{2\epsilon\over d}|1_N\rangle\langle1_N|.     \tag{4.7}
\]

Its spectrum is

\[
 \boxed{
 \lambda_{\min}(A^\circ)=\tau+{\epsilon\over d},
 \qquad
 \operatorname {spec}(A^\circ)
 =\left\{\tau+{\epsilon\over d},
          (\tau+\epsilon)^{[N-1]}\right\}.}        \tag{4.8}
\]

Consequently

\[
 {\mu\over\lambda_{\min}(A^\circ)}
 ={\tau\over\tau+\epsilon/d}.                    \tag{4.9}
\]

The endpoint-flat quotient satisfies
`<eta,h_N>=0`, so in this structural family

\[
 r_N^{\rm flat}=\tau+\epsilon.                    \tag{4.10}
\]

Use the same unit actual projected-prolate anchor `kappa_N` only as a
comparison vector and put `a_N=<g,kappa_N>`.  Its Rayleigh value is

\[
 \boxed{q_N^{\rm str}
 =\tau+\epsilon(1-|a_N|^2).}                       \tag{4.11}
\]

Likewise, if `v_N=p_N''/||p_N''||_2` is the actual normalized positive-
index prolate derivative from checkpoint 1.40, then

\[
 \boxed{r_N^{{\rm pr},{\rm str}}
 =\tau+\epsilon(1-|\langle g,v_N\rangle|^2),
 \qquad
 \lambda_{\min}(A^\circ)
 \leq r_N^{{\rm pr},{\rm str}}
 \leq\tau+\epsilon.}                              \tag{4.12}
\]

Equations (4.8)--(4.12) keep `q_N`, `mu`, `r_N^pr`, the endpoint-flat
Rayleigh value, and the true floor distinct.

All Schur and cofactor identities are explicit.  In the central block,

\[
 a=\tau+\epsilon(1-d^{-1}),
 \qquad
 b=-{\sqrt2\epsilon\over d}1_N,                   \tag{4.13}
\]

and

\[
 b^*(A^\circ-\tau I)^{-1}b
 =\epsilon(1-d^{-1})=a-\tau.                      \tag{4.14}
\]

Moreover,

\[
 \det Q_+=\tau(\tau+\epsilon)^N,
 \qquad
 \det A^\circ=(\tau+\epsilon/d)
                    (\tau+\epsilon)^{N-1},        \tag{4.15}
\]

so

\[
 s_0={\tau(\tau+\epsilon)\over\tau+\epsilon/d}. \tag{4.16}
\]

At the shifted ground,

\[
 \operatorname {adj}(Q_+-\tau I)
 =\epsilon^N|g\rangle\langle g|,                  \tag{4.17}
\]

and therefore

\[
 \det(A^\circ-\tau I)={\epsilon^N\over d},
 \qquad
 \langle\eta,\operatorname {adj}(Q_+-\tau I)e_0\rangle
 =\epsilon^N
 =\det(Q_--\tau I).                               \tag{4.18}
\]

The determinant identities are all favorable and still do not separate
`mu` from the principal floor.

For the sharp nonimplication, let `R_N>0` have any prescribed upper scale,
and set

\[
 \tau={R_N\over5},
 \qquad
 \epsilon={4R_N\over5}.                            \tag{4.19}
\]

Then

\[
 r_N^{\rm flat}=R_N,
 \qquad
 \mu={R_N\over5},
 \qquad
 \lambda_{\min}(A^\circ)
 ={R_N\over5}\left(1+{4\over d}\right),          \tag{4.20}
\]

and hence

\[
 {\mu\over r_N^{\rm flat}}={1\over5}
 <0.2232886136,
 \qquad
 {\mu\over\lambda_{\min}(A^\circ)}
 ={1\over1+4/d}\longrightarrow1.                 \tag{4.21}
\]

Taking `R_N=exp(-(c_*-o(1))*N)` matches the endpoint-flat upper scale and
is stronger than every frozen `exp(-c*N/L)` absolute envelope.  Thus even
the new scalar contraction in (0.6) is compatible with reserve collapse;
the missing datum is exactly `r_N^flat/alpha_N`.

The `tau=0` member of (4.2) is the normalization obstruction already
frozen at checkpoint 1.39.  It has `mu=0`, hence reserve ratio zero.  The
positive scalar shift in (4.2) is therefore essential and nonredundant: it
preserves the ground line, source-Cauchy displacement, same prolate anchor,
and shifted strictness while making the reserve ratio tend to one.

The matrix (4.2) is not asserted to equal the actual arithmetic or zeta
zero Gram.  In particular, its action on the clamped primitive need not
obey the actual zero-support contraction (2.6).  Equation (4.21) is a
structural nonimplication for the frozen scalar and source identities, not
an actual counterexample.

## 5. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. drops the saturation factor `varkappa_N^flat` from (0.5);
2. reverses the upper Rayleigh comparison in (2.7);
3. applies the `gamma^(-4)` gain before the first `M` rows are annihilated;
4. identifies `q_N`, `mu`, `r_N^pr`, `r_N^flat`, or `alpha_N`;
5. infers `s_0=o(alpha_N)` from the two absolute upper envelopes;
6. omits the leverage denominator in (0.8);
7. treats the odd determinant identity (3.10) as an oriented reserve bound;
8. calls the shifted-hyperplane family the actual zeta zero Gram;
9. claims that the `tau=0` normalization model already obstructed a
   positive ground-shift ratio; or
10. infers shifted-node uniqueness, determinant convergence, RH, a
    converse from RH, or a de Bruijn--Newman `Lambda` bound.

The surviving actual targets are a saturation theorem for the endpoint-
flat quotient, an oriented relative Schur/cofactor estimate in (0.8), or a
direct signed proof of the required even localizing reserve.
