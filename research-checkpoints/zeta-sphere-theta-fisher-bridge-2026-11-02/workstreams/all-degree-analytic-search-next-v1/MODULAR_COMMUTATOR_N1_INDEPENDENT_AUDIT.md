# Independent audit of the `N=1` modular-commutator bridge

## Verdict and scope

The proposed bridge is algebraically correct.  With

\[
 I_\pm=\int_0^\infty h e^{\pm2ah}\psi^2\,dh,
 \qquad P_\pm=\int_0^\infty e^{\pm2ah}\psi^2\,dh,
\]

\[
 K_\pm=\int_0^\infty h e^{\pm2ah}\psi^2v^2\,dh,
 \qquad M(\pm a)=K_\pm/I_\pm,
 \qquad v=-\psi'/\psi,
\]

the complete archived scalar at `N=1` is

\[
 \boxed{
 \mathcal C_1={4aI_-\over s_0s_1}
 \left[I_+\{M(a)-M(-a)\}-a(P_++P_-)\right].}
 \tag{A1}
\]

This audit derives (A1) directly from the frozen definitions in
`modular_cd_flux_v1/MODULAR_REFLECTION.md` and
`modular_innovation_payment_v1/BOUNDARY_ELIMINATION.md`; it does not identify
the scalar by analogy with a normalized derivative quotient.

For `a>0`, `I_->0` and `s_0=I_+-I_->0`.  The remaining sign hypothesis is
the archived positive current prefix `s_1>0`.  Under it, the prefactor in
(A1) is positive.  Therefore the already-audited Brascamp--Lieb estimate

\[
 |M(a)-M(-a)|\leq2\int_{-a}^a\sqrt{A_bB_b}\,db
\]

proves `mathcal C_1<0` whenever

\[
 2I_+\int_{-a}^a\sqrt{A_bB_b}\,db<a(P_++P_-).
\tag{A2}
\]

The conclusion is only negativity of the complete integrated commutator.
It assumes `s_1>0`, contains no next pivot `s_2`, and does not prove a pivot,
an all-degree theorem, or RH.

## Reflection matrices

The even moment functional gives

\[
 T_0=1,\qquad T_1=x,\qquad T_2=x^2+s_1/s_0.
\]

Put `rho=sqrt(s_0/s_1)`.  Substitution in the archive's polynomial
reflection definitions gives

\[
 R=\begin{pmatrix}1&0\\2a\rho&-1\end{pmatrix},\qquad
 r=\binom{4a^2\rho}{-4a},\qquad
 \eta=R^{\mathsf T}r=\binom{-4a^2\rho}{4a}.
\tag{A3}
\]

Thus `R^2=I` and `eta=-r`, as required by `R^T r=(-1)^N r` at `N=1`.
With

\[
 X_1=\begin{pmatrix}0&\rho^{-1}\\-\rho^{-1}&0\end{pmatrix},
 \qquad G=I+R^{\mathsf T}R,
\]

direct multiplication yields

\[
 C_1=GX_1-X_1G
 =\begin{pmatrix}4a&4a^2\rho\\4a^2\rho&-4a\end{pmatrix}.
\tag{A4}
\]

This also checks the signs and factor four in the general archived
rank-two commutator formula.

## Half-line reductions

On the positive half-line,

\[
 g'(h)=e^{ah}\psi(h)(a-v(h)),
\]

whereas evenness of `psi` gives

\[
 g'(-h)=e^{-ah}\psi(h)(a+v(h)).
\]

Define the corresponding derivative energies

\[
 Q_+=\int_0^\infty h e^{2ah}\psi^2(a-v)^2\,dh,
 \qquad
 Q_-=\int_0^\infty h e^{-2ah}\psi^2(a+v)^2\,dh.
\]

The boundary terms in `integral (h e^(plus or minus 2ah) psi^2)'` vanish.
It follows that

\[
 Q_+=K_+-aP_+-a^2I_+,
 \qquad
 Q_-=K_-+aP_--a^2I_-,
\tag{A5}
\]

and hence

\[
 s_0=I_+-I_-,\qquad
 s_1=Q_+-Q_-
 =K_+-K_--a(P_++P_-)-a^2s_0.
\tag{A6}
\]

For `y(h)=Y(-h)`, the same integration by parts gives

\[
 H_{00}={I_-\over s_0},\qquad
 H_{01}={P_-\over2\sqrt{s_0s_1}},\qquad
 H_{11}={Q_-\over s_1}.
\tag{A7}
\]

The complete scalar in `BOUNDARY_ELIMINATION.md` is

\[
 \mathcal C_1=4a\operatorname{tr}H-2\eta^{\mathsf T}He_1.
\]

Using (A3) and (A7), this becomes

\[
 \mathcal C_1={4aI_-\over s_0}-{4aQ_-\over s_1}
                    +{4a^2P_-\over s_1}.
\tag{A8}
\]

After multiplication by `s_0s_1/(4a)`, the numerator in (A8) is

\[
 I_-s_1-s_0(K_--a^2I_-)
 =I_-\left[I_+\{M(a)-M(-a)\}-a(P_++P_-)\right],
\]

which proves (A1).

## Distinction from a shifted-derivative quotient

For `f_b=e^(bh)psi`, another integration by parts gives

\[
 {1\over I_b}\int_0^\infty h|f_b'|^2\,dh
 =M(b)-b^2-bP_b/I_b.
\]

Thus the opposite-tilt normalized derivative-energy difference is

\[
 D_a=M(a)-M(-a)
 -a\left(P_+/I_++P_-/I_-\right).
\]

It is not the archive scalar.  If `B` denotes the square bracket in (A1),
then

\[
 B=I_+D_a+aP_-\left(I_+/I_--1\right),
\]

and the last term is strictly positive.  Condition (A2) controls `B`
directly, so no quotient identification is needed.

## Audit of the optional theta-specific reduction

The further analytic reduction in the source note is also correct, but it
does not discharge (A2).  For one positive theta orbit, with
`z=pi*n^2*exp(2h)`, its logarithmic slope is

\[
 S(z)={9\over2}+{6\over2z-3}-2z,
 \qquad
 -\partial_hS=4z+{24z\over(2z-3)^2}.
\]

If the orbit weights are normalized at fixed `h`, differentiation of a
positive mixture gives exactly

\[
 v'=\mathbb E(-\partial_hS)-\operatorname {Var}(S).
\]

For `z>=pi>157/50`, the elementary decreasing expression

\[
 (-\partial_hS)-2(-S)
 =9+{12\over2z-3}+{24z\over(2z-3)^2}
 \leq {33054\over1681}<20.
\]

Together with the previously audited lower curvature bound, this proves

\[
 17<v'<2v+20.
\tag{A9}
\]

Since `h^(-2)+2v'>=2v'`, (A9) gives the valid but lossy bounds

\[
 A_b\leq{1\over34},\qquad
 B_b\leq4\mathbb E_{\nu_b}v^3+40M(b).
\tag{A10}
\]

The integration-by-parts identity used for the sharper reduction was checked
separately.  Expanding `(h exp(2bh) psi^2 v)'`, using
`E_(nu_b)v=b+P_b/(2I_b)`, gives

\[
 M(b)=b^2+b{P_b\over I_b}+{\psi(0)^2\over4I_b}
             +{1\over2}\mathbb E_{\nu_b}v'.
\tag{A11}
\]

Substitution in the square bracket `B` from (A1) yields

\[
 B={I_+\over2}
 \left(\mathbb E_{\nu_a}v'-\mathbb E_{\nu_{-a}}v'\right)
 -\left({I_+\over I_-}-1\right)
 \left({\psi(0)^2\over4}-aP_-\right).
\tag{A12}
\]

Evenness and `(log psi)''<-17` imply
`psi(h)^2<=psi(0)^2 exp(-17h^2)`.  Therefore, for `0<a<=1/4`,

\[
 aP_-\leq a\psi(0)^2{\sqrt\pi\over2\sqrt{17}}
 <{\psi(0)^2\over16}.
\tag{A13}
\]

Thus the second term in (A12) is rigorously favorable.  What remains is a
correlated opposite-tilt estimate for `E v'`.  Neither (A9) nor (A10) controls
that difference sharply enough, so (A12)--(A13) are a valid reduction rather
than a proof of the commutator sign.

## Replay

The author's exact standard-library checker
`src/verify_modular_commutator_n1_bridge.py` was run twice independently.
Both outputs and the tracked replay were byte-identical, with SHA-256

```text
75babc9a0b122f564ebe0f1fd5f3a597643bc3c1dc6dd2681c878035816f4c87
```

The checker verifies `R^2`, `R^T r`, (A4), (A5)--(A6), the cleared
factorization (A1), and the derivative-quotient distinction using exact
Laurent polynomials.  This is an internal algebra audit, not formal
verification or community peer review.
