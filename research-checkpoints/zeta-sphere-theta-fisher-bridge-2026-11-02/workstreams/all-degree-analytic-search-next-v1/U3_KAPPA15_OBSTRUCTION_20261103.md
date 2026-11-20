# The fixed three-score dictionary fails at the actual odd degree 15

## Outcome

Let `q` be the actual monic odd Galerkin residual of degree `kappa=15`,
determined by the old complete-theta signed moments `M_0,...,M_14`.  For

\[
 U_3=\operatorname {span}\{q',tq,t^2q'\},
\]

a complete-orbit Arb certificate gives, in the half-line positive-moment
scale,

\[
 \boxed{
 \mathcal H_{U_3}\in
 [-9.88609318208354,-9.88604319556049]\,10^{24}<0.}
\]

Thus the fixed `U_3` dictionary does **not** satisfy the proposed uniform
all-degree sufficient inequality, even for the actual complete-theta source.
This is a finite, source-specific obstruction to that auxiliary route.  The
new signed moment `M_15` is absent, so this result says nothing about its sign.
Failure of a sufficient auxiliary is not an RH counterexample and does not
rule out adaptive or growing dictionaries.

## 1. Exact three-by-three condition

All inner products in this section are against the positive weight `W^2 dt`.
Set

\[
\begin{array}{lll}
 A=\langle q',q'\rangle,&
 B=\langle q,q''\rangle,&
 C=\langle q,q\rangle,\\
 D=\langle tq,tq\rangle,&
 E=\langle q',tq\rangle,&
 F=\langle q',t^2q'\rangle,\\
 G=\langle tq,t^2q'\rangle,&
 T=\langle t^2q',t^2q'\rangle,&
 R=\langle q,(t^2q')'\rangle,
\end{array}
\]

and `Y=C+E`.  Integration by parts in the score identity gives the exact
Gram matrix and score-correlation vector

\[
 K_3=\begin{pmatrix}
 A&E&F\\ E&D&G\\ F&G&T
 \end{pmatrix},\qquad
 y_3=\begin{pmatrix}B\\Y\\R\end{pmatrix}.
\]

No quotient by `q` or `W` occurs.  Polynomial times Schwartz decay removes
all boundary terms.  If the three polynomials are independent, `K_3` is
positive definite and

\[
 \mathcal H_{U_3}={1\over4}(y_3^TK_3^{-1}y_3-A).
\]

For the baseline `U_2=span{q',tq}`, define

\[
 \Delta_2=AD-E^2>0
\]

and the following denominator-free quantities:

\[
\begin{aligned}
 H_{\rm num}
 &=DB^2-2EBY+AY^2-A\Delta_2,\\
 S_{\rm num}
 &=T\Delta_2-(DF^2-2EFG+AG^2),\\
 D_{\rm num}
 &=R\Delta_2-(DF-EG)B-(AG-EF)Y.
\end{aligned}
\]

Then

\[
 4\mathcal H_{U_2}={H_{\rm num}\over\Delta_2},\qquad
 \sigma={S_{\rm num}\over\Delta_2},\qquad
 \delta={D_{\rm num}\over\Delta_2},
\]

where `sigma=||(I-P_U2)t^2q'W||^2` and `delta` is the corresponding score
innovation.  Since

\[
 \det K_3=S_{\rm num}>0,
\]

the exact cleared repair condition is

\[
 \boxed{
 N_3:=D_{\rm num}^2+H_{\rm num}S_{\rm num}\geq0.}       \tag{1}
\]

Indeed,

\[
 \mathcal H_{U_3}
 ={N_3\over4\Delta_2S_{\rm num}},\qquad
 \delta^2+4\mathcal H_{U_2}\sigma
 ={N_3\over\Delta_2^2}.
\]

There is also an exact bordered-determinant test:

\[
 \det\begin{pmatrix}K_3&y_3\\y_3^T&A\end{pmatrix}
 =-{N_3\over\Delta_2}.
\]

Thus (1), the Schur-gain inequality, the nonpositivity of this bordered
determinant, and `H_U3>=0` are all equivalent.  This is the exact analytic
three-score obligation; no coordinatewise Cauchy estimate has been inserted.

## 2. Old-data construction and exact rank

For odd `q=t^15+a t^13+b t^11+...`, the old Galerkin system is

\[
 (M_{i+j+1})_{0\leq i,j<7}c
 =-(M_{i+8})_{0\leq i<7}.
\]

It uses exactly `M_0,...,M_14`.  The target `M_15` is not loaded by either
the signed-moment generator or the projection verifier.

Before forming a numerical Gram matrix, rank three is certified by the exact
coefficient minor of `(q',tq,t^2q')` at degrees `(16,14,12)`:

\[
 \det_{16,14,12}=2\{2\kappa b-(\kappa-2)a^2\}.
\]

Its interval excludes zero at `kappa=15`.  Hence positive definiteness of
`K_3` follows analytically from polynomial independence and the fact that
`W` is nonzero on an interval; no floating condition-number test is used.

## 3. Complete-theta enclosures

The signed generator recomputes only `mu_j=4^j M_j`, `0<=j<=14`, on
`0<=h<=3` using 3,072 cells of width `1/1024`, degree-20 symmetric Taylor
integration, exact theta orbits `1,...,16`, and analytic bounds for every
orbit `n>=17` and all `h>=3`.  With the inherited complex disk radius
`R=1/20`, its Taylor ratio is

\[
 q={1/1024\over2R}={5\over512}.
\]

The verifier applies the inherited outward decimal serialization padding
*before* division by `4^j`.

The positive moments are

\[
 n_j=\|\psi^{(j)}\|_{L^2(h\geq0)}^2,\qquad0\leq j\leq16.
\]

They use exact orbit pairs `1,...,8` and an analytic norm tail containing
every orbit `n>=9`.  The generalized tail ratio is certified by

\[
 (10/9)^{35}e^{-19\pi}<1/2.
\]

The common spectral factor `m_j=4*pi*n_j` is omitted; it is positive and
preserves every sign.

At 800-bit precision the primary certificate proves

\[
\begin{aligned}
 \mathcal H_{U_2}
 &\in[-4.07821081876350,-4.07821065030533]10^{26},\\
 \sigma
 &\in[1.04874445812174,1.04874446165797]10^{33},\\
 \delta
 &\in[-1.29202497936115,-1.29202496494723]10^{30},\\
 \mathcal H_{U_3}
 &\in[-9.88609318208354,-9.88604319556049]10^{24},\\
 N_3
 &<-5.97334610731068\,10^{177}.
\end{aligned}
\]

The gain is strictly positive but too small to repair the baseline deficit.
A 900-bit replay independently confirms the strict signs with the same
frozen verifier source.

## 4. Reproduction and frozen provenance

From the checkpoint root:

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_u3_kappa15_obstruction_20261103.py \
  --root . --precision-bits 800 \
  --output workstreams/all-degree-analytic-search-next-v1/results/u3_kappa15_actual_obstruction_20261103.json
```

Frozen artifacts:

```text
signed generator source
  dc5828f6ce61a461d5a881c08d0e4034dab473f85dabd20be488dd4b5f6ff178
signed moment receipt
  94d3741b7eabecf2f0f0ccc33a2786f8a4eaae752a98e1076fe08389828b1eff
primary verifier source
  568a6159b08563a9af938927dae0cf8f8458a1fc7dc562eb66d26f82b0612050
primary result
  54a67b1978aaa0c9afc00df02e3e9549f064a54464d068a5540e5e157c0e6dad
900-bit result
  a3b1ef4d8160d00af8bb01b139342bdc107c8d2db4a02d70740cf0bf5891de95
```

Independent audit is now a **DECISIVE PASS**, recorded in
`U3_KAPPA15_INDEPENDENT_AUDIT_20261103.md` with SHA-256
`f310646e05d48457fdf4cd62783e0ef220f8cf71ecf4d01bacca85982c619889`.
The clean audit reran all 3,072 signed-moment cells from the frozen source and
reproduced every moment endpoint, remainder bound, and provenance field
exactly (only PID, elapsed time, and their dependent receipt hash changed).
It then reproduced the 800-bit projection receipt byte-for-byte with SHA-256
`54a67b1978aaa0c9afc00df02e3e9549f064a54464d068a5540e5e157c0e6dad`
and independently checked endpoint padding, archive normalization, exact
rank, positive-moment completion, and the inverse-free cleared sign.  The
same-source 900-bit run remains a separate precision check.

## Consequence for the analytic search

There can be no complete-theta theorem proving (1) at every actual rung for
this fixed dictionary: the actual odd degree-15 rung violates it strictly.
The viable score-projection continuations must therefore change the feature
rule, for example by using a rigorously old-data adaptive direction or a
dictionary whose width grows with the rung.  The exact condition above
remains useful for auditing such replacements, but `t^2q'` alone cannot be
the uniform repair.
