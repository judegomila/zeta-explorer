# Secant-shorted reciprocal Feshbach reduction

## 0. Scope and exact outcome

This note refines the reciprocal-crowding target in
`DIRECT_SOFT_TRACE_RECIPROCAL_RESERVE.md` by shorting first along the exact
prolate secant.  It proves finite identities and a structural no-go theorem.
It does not prove an actual-source asymptotic estimate.

On the inversion-even projected-anchor complement let

\[
 B\succ0,\qquad r>0,\qquad 0\preceq K_T\preceq I,
 \qquad \|\omega\|=1,                                  \tag{0.1}
\]

and put

\[
 \varepsilon=\langle\omega,B\omega\rangle,
 \qquad c^2=\langle\omega,K_T\omega\rangle>0.          \tag{0.2}
\]

For the actual application, `omega` is the source-reconstructible secant in
`PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md`, `r` is the norm of the complete
combined residual, and

\[
 \mathfrak R_r(\omega)
 ={\varepsilon+r\over c^2}
   \operatorname {tr}\{(B+rI)^{-1}K_T\}.              \tag{0.3}
\]

The main conclusions are as follows.

1. Shorting `B+rI` along `omega` gives an exact positive two-term
   decomposition of (0.3): one harmonic graph load and one deflated
   reciprocal bulk.
2. Bounded reciprocal crowding is equivalent to bounding both terms.  A
   one-vector relative residual estimate cannot control the bulk.
3. Two dimensionless quantities give a sharp two-sided envelope for the
   complete reserve.
4. The exact source commutator reconstructs the harmonic graph vector from
   three inversion-odd resolvent responses and a `2 by 2` scalar system.
5. After the secant is removed, the source displacement becomes a
   rectangular rank-three identity.  The remaining `(N-1)`-dimensional
   inverse is not eliminated.
6. An exact source-Cauchy family with nonzero displacement, strict parity
   signs, a simple even ground, and the genuine fixed-window time-band
   operator has `mathfrak R_r=Omega(L)`.  It can simultaneously have
   `r/epsilon=L^(-p)` for any prescribed `p>0`.

The counterfamily uses synthetic diagonal and displacement coefficients.  It
is structurally compatible with the source Cauchy formula, inversion, and
the centered time-band geometry, but it is **not** the matrix assembled from
the pinned pole, archimedean, and prime-power formulas and it is not the
source-normalized prolate anchor.  It proves a non-implication, not failure
of the arithmetic source sequence.

Every actual-source specialization in this note uses the centered interval
`[-L/2,L/2]`, Lebesgue measure, zero extension, reflection as inversion, and

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(x)e^{-itx}\,dx.       \tag{0.4}
\]

The complete Weil matrix is formed before an absolute value, every prime
power `1<n<=lambda^2` is included, and the prime block retains the minus sign
from source equation (3.19).  The state is source-normalized, not replaced by
a unit-normalized version of `h_lambda`.  No zero list and no global Weil
positivity are used.  The note proves neither shifted-sector sign on
an unbounded schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally
uniform determinant convergence, nor the Riemann hypothesis.  The formal
project state remains `P0_INVALIDATED`.

## 1. Exact one-step Feshbach inverse

Let

\[
 {\cal F}=\omega^\perp,
 \qquad U:{\cal F}\longrightarrow{\cal K},
 \qquad U^*U=I,\qquad UU^*=I-|\omega\rangle\langle\omega|. \tag{1.1}
\]

Relative to `C*omega direct-sum U F`, write

\[
 B=\begin{pmatrix}\varepsilon&g^*\\g&C\end{pmatrix},
 \qquad
 D_r=C+rI,                                             \tag{1.2}
\]

and define

\[
 \delta_r=\varepsilon+r-g^*D_r^{-1}g,
 \qquad
 v_r=\omega-UD_r^{-1}g.                               \tag{1.3}
\]

Because `B+rI>0`, both `D_r>0` and `delta_r>0`.  Direct block elimination
gives

\[
 (B+rI)v_r=\delta_r\omega.                            \tag{1.4}
\]

### Theorem 1.1 (secant-shorted inverse)

One has the exact positive decomposition

\[
 \boxed{
 (B+rI)^{-1}
 ={1\over\delta_r}|v_r\rangle\langle v_r|
   +U(C+rI)^{-1}U^*.}                                 \tag{1.5}
\]

Equivalently, if

\[
 w_r=(B+rI)^{-1}\omega,\qquad
 s_r=\langle\omega,w_r\rangle,                        \tag{1.6}
\]

then

\[
 s_r=\delta_r^{-1},\qquad v_r={w_r\over s_r},          \tag{1.7}
\]

and

\[
 \boxed{
 (B+rI)^{-1}
 ={|w_r\rangle\langle w_r|\over
       \langle\omega,w_r\rangle}
  +U(C+rI)^{-1}U^*.}                                  \tag{1.8}
\]

**Proof.**  The ordinary inverse of the block matrix in (1.2), after adding
`rI`, has upper-left entry `delta_r^(-1)`, off-diagonal entries
`-delta_r^(-1)g^*D_r^(-1)` and their adjoints, and lower-right entry

\[
 D_r^{-1}+D_r^{-1}g\delta_r^{-1}g^*D_r^{-1}.
\]

These four blocks are exactly the two terms in (1.5).  Equation (1.4)
proves (1.7), and substitution proves (1.8).  Both summands in (1.5) and
(1.8) are positive.  \(\square\)

Put

\[
 K_F=U^*K_TU.                                          \tag{1.9}
\]

Taking the trace of (1.5) against `K_T` gives the exact graph-load identity

\[
\boxed{
\begin{aligned}
 \operatorname {tr}\{(B+rI)^{-1}K_T\}
  &={\langle v_r,K_Tv_r\rangle\over\delta_r}
    +\operatorname {tr}\{(C+rI)^{-1}K_F\}\\
  &={\langle w_r,K_Tw_r\rangle\over
         \langle\omega,w_r\rangle}
    +\operatorname {tr}\{(C+rI)^{-1}K_F\}.
                                                               \tag{1.10}
\end{aligned}}
\]

This identity keeps the combined inverse.  It does not replace a compression
of the complete inverse by the inverse of a raw compression: `C+rI` is the
exact lower diagonal block appearing in the block inverse, and the harmonic
rank-one term retains all feedback through `g`.

## 2. Exact reserve criterion

Define the two nonnegative normalized loads

\[
 \mathfrak R_{\rm graph}
 ={\varepsilon+r\over c^2}
  {\langle w_r,K_Tw_r\rangle\over
       \langle\omega,w_r\rangle},                     \tag{2.1}
\]

\[
 \mathfrak R_{\rm bulk}
 ={\varepsilon+r\over c^2}
   \operatorname {tr}\{(C+rI)^{-1}K_F\}.             \tag{2.2}
\]

Equation (1.10) is exactly

\[
 \boxed{
 \mathfrak R_r(\omega)
 =\mathfrak R_{\rm graph}+\mathfrak R_{\rm bulk}.}   \tag{2.3}
\]

Consequently, on any schedule on which `c>0`, one has the equivalence

\[
 \boxed{
 \mathfrak R_r(\omega)=O(1)
 \quad\Longleftrightarrow\quad
 \mathfrak R_{\rm graph}=O(1)
 \ \hbox{and}\
 \mathfrak R_{\rm bulk}=O(1).}                       \tag{2.4}
\]

In particular, bounded reserve necessarily requires

\[
 \boxed{
 (\varepsilon+r)
 \operatorname {tr}\{(C+rI)^{-1}K_F\}=O(c^2).}       \tag{2.5}
\]

No estimate involving only `r/epsilon`, the secant coordinate of the
residual, or the scalar short `delta_r` implies (2.5).  The term is the
reciprocal time-band mass of the whole deflated complement.

Multiplying (2.3) by `c^2*r/(epsilon+r)` gives the corresponding exact split
of the residual-ridged soft trace.  Thus either term may be attacked
directly without introducing the older one-threshold `O(L)` loss.  If the
bulk itself has `Theta(L)` effective rank at the secant energy scale, that
factor is genuine rather than a proof artifact.

## 3. Sharp two-parameter reserve envelope

The graph term and the bulk are coupled through the vector `g`.  That
coupling has a dimensionless exact envelope.

Set

\[
 a={\delta_r\over\varepsilon+r}\in(0,1],
 \qquad
 x=\mathfrak R_{\rm bulk}.                             \tag{3.1}
\]

Since

\[
 \zeta:=g^*D_r^{-1}g
 =\varepsilon+r-\delta_r=(\varepsilon+r)(1-a),        \tag{3.2}
\]

and `z=UD_r^(-1)g=omega-v_r`, positivity gives

\[
\begin{aligned}
 \|K_T^{1/2}z\|^2
 &=g^*D_r^{-1}K_FD_r^{-1}g\\
 &\leq
 \{g^*D_r^{-1}g\}
 \operatorname {tr}(D_r^{-1}K_F)\\
 &=c^2(1-a)x.                                          \tag{3.3}
\end{aligned}
\]

The inequality follows by applying
`<h,Mh><=||h||^2 tr(M)` to
`h=D_r^(-1/2)g` and
`M=D_r^(-1/2)K_FD_r^(-1/2)>=0`.

The observation-space triangle and reverse-triangle inequalities now give

\[
 c\{1-\sqrt{(1-a)x}\}_+
 \leq\|K_T^{1/2}v_r\|
 \leq c\{1+\sqrt{(1-a)x}\}.                         \tag{3.4}
\]

Substitution in (2.3) proves the sharp reserve envelope

\[
\boxed{
 x+{\{1-\sqrt{(1-a)x}\}_+^2\over a}
 \leq\mathfrak R_r(\omega)
 \leq
 x+{\{1+\sqrt{(1-a)x}\}^2\over a}.}                 \tag{3.5}
\]

The constants in (3.5) are attained already in dimension two.  Take

\[
 B=\begin{pmatrix}2&2\\2&3\end{pmatrix},\qquad r=1,
 \qquad
 K_\pm={1\over4}\begin{pmatrix}1&\pm1\\\pm1&1\end{pmatrix},
 \qquad\omega=e_1.                                   \tag{3.6}
\]

Then `a=2/3`, `x=3/4`; `K_+` attains the lower endpoint `9/8`, while
`K_-` attains the upper endpoint `33/8`.  Both `K_+` and `K_-` are positive
contractions.

Thus the source-usable sufficient pair

\[
 a\geq a_0>0,
 \qquad x=O(1)                                       \tag{3.7}
\]

does imply bounded reserve.  Neither condition can be deleted on the basis
of the one-vector data alone.  When `g=0`, one has `a=1` and the exact
identity simplifies to

\[
 \boxed{\mathfrak R_r(\omega)=1+x.}                  \tag{3.8}
\]

## 4. Exact source displacement after secant shorting

Return to the finite source matrix.  Let `H_+` and `H_-` be the inversion
sectors, let `kappa in H_+` be the projected source anchor, and put

\[
 {\cal K}=H_+\cap\kappa^\perp,
 \qquad q=\langle\kappa,Q\kappa\rangle,
 \qquad b=(Q-qI)\kappa\in{\cal K}.                   \tag{4.1}
\]

Let `D` be the source mode-number operator.  With the normalized parity
bases, define

\[
 T=D|_{\cal K}:{\cal K}\longrightarrow H_-,
 \qquad d=D\kappa,
 \qquad \eta_{\cal K}=P_{\cal K}\eta,               \tag{4.2}
\]

and let `boldsymbol beta` be the odd source displacement vector.  If the
zero-mode coefficient of `kappa` is nonzero, `T` is an isomorphism.  The
plus-to-minus part of the exact source commutator is

\[
 \boxed{
 TB-{\cal C}_-T
 =|\boldsymbol\beta\rangle\langle\eta_{\cal K}|
  -|d\rangle\langle b|,\qquad
 {\cal C}_-=Q_--qI.}                                  \tag{4.3}
\]

The scalar ridge cancels from the displacement:

\[
 T(B+rI)-({\cal C}_-+rI)T
 =|\boldsymbol\beta\rangle\langle\eta_{\cal K}|
  -|d\rangle\langle b|.                              \tag{4.4}
\]

Now use the secant block in (1.2).  Since

\[
 BU=|\omega\rangle\langle g|+UC,                     \tag{4.5}
\]

substitution in (4.4) gives the exact rank-three deflated displacement

\[
\boxed{
\begin{aligned}
 (TU)(C+rI)-({\cal C}_-+rI)(TU)
 ={}&|\boldsymbol\beta\rangle
       \langle U^*\eta_{\cal K}|\\
 &-|d\rangle\langle U^*b|
  -|T\omega\rangle\langle g|.
                                                               \tag{4.6}
\end{aligned}}
\]

The minus sign on the last term is forced by moving `T omega g^*` from
(4.5) to the right side.  Equation (4.6) is rectangular: `TU` maps an
`(N-1)`-dimensional space into the `N`-dimensional odd sector.  A rank-three
right side does not make the Sylvester solution rank three.  In spectral
coordinates, its entries are divided by all cross-parity eigenvalue
differences, which may be arbitrarily small under strict positivity alone.

This is the exact stopping point for a commutator-only proof of (2.5).
Secant deflation changes the source displacement from rank two to at most
rank three, but it leaves the full deflated reciprocal bulk.

## 5. Odd-resolvent reconstruction of the graph vector

The first term in (2.3) does admit a complete source reconstruction through
the odd block.  Put

\[
 R_- =({\cal C}_-+rI)^{-1},                            \tag{5.1}
\]

and define three even response vectors

\[
 x=T^{-1}R_-T\omega,
 \qquad y=T^{-1}R_-\boldsymbol\beta,
 \qquad z=T^{-1}R_-d.                                \tag{5.2}
\]

Because `(B+rI)w_r=omega`, equation (4.4) gives

\[
 ({\cal C}_-+rI)Tw_r
 =T\omega-\boldsymbol\beta
      \langle\eta_{\cal K},w_r\rangle
      +d\langle b,w_r\rangle.                        \tag{5.3}
\]

Write

\[
 \alpha=\langle\eta_{\cal K},w_r\rangle,
 \qquad \gamma=\langle b,w_r\rangle.                \tag{5.4}
\]

Then

\[
 w_r=x-y\alpha+z\gamma,                              \tag{5.5}
\]

and the two scalars are reconstructed by

\[
\boxed{
 \begin{pmatrix}
  1+\langle\eta_{\cal K},y\rangle
    &-\langle\eta_{\cal K},z\rangle\\
  \langle b,y\rangle&1-\langle b,z\rangle
 \end{pmatrix}
 \begin{pmatrix}\alpha\\\gamma\end{pmatrix}
 =\begin{pmatrix}
   \langle\eta_{\cal K},x\rangle\\
   \langle b,x\rangle
  \end{pmatrix}.}                                    \tag{5.6}
\]

### Theorem 5.1 (odd-response graph reconstruction)

Under the strict finite signs `B>0` and `C_->0`, and with `T` invertible,
the `2 by 2` matrix in (5.6) is nonsingular.  Equations (5.2), (5.5), and
(5.6) reconstruct `w_r=(B+rI)^(-1)omega` exactly.  In particular,

\[
 \boxed{
 \mathfrak R_{\rm graph}
 ={\varepsilon+r\over c^2}
  {\langle w_r,K_Tw_r\rangle\over
       \langle\omega,w_r\rangle}.}                   \tag{5.7}
\]

**Proof.**  Equations (5.3)--(5.5) follow by applying `T^(-1)R_-`.
Pairing (5.5) with `eta_K` and `b` gives (5.6).  If the scalar matrix had a
nonzero homogeneous vector, the corresponding
`w=-y*alpha+z*gamma` would satisfy

\[
 ({\cal C}_-+rI)Tw
 =-\boldsymbol\beta\langle\eta_{\cal K},w\rangle
   +d\langle b,w\rangle.
\]

Equation (4.4) would then give `T(B+rI)w=0`.  Invertibility of `T` and
positivity of `B+rI` force `w=0`, and its two defining pairings force the
homogeneous scalars to vanish.  This proves nonsingularity and the
reconstruction.  Equation (5.7) is (2.1).  \(\square\)

The reconstruction isolates a narrow actual-source graph target: control
the three odd response vectors in (5.2), the scalar determinant in (5.6),
and the fixed-window quotient in (5.7).  Strict positivity alone supplies
none of those quantitative estimates.

For completeness, (4.4) also gives an all-shift rank-two Woodbury formula.
Put

\[
 {\bf U}_0=[\boldsymbol\beta,-d],
 \qquad {\bf V}_0=[\eta_{\cal K},b],                  \tag{5.8}
\]

\[
 X=T^{-1}R_-T,
 \qquad Y=T^{-1}R_-{\bf U}_0.                         \tag{5.9}
\]

Then

\[
 \boxed{
 (B+rI)^{-1}
 =X-Y(I_2+{\bf V}_0^*Y)^{-1}{\bf V}_0^*X.}           \tag{5.10}
\]

The two terms in (5.10) are not separately positive.  Taking their norms
would pay the conditioning of `T`, the odd inverse, and the `2 by 2`
denominator.  Thus (5.10) is an independent reconstruction path, not an
actual-source upper bound.

## 6. Source-Cauchy/time-band no-go

The exact source displacement and the fixed-window geometry do not imply a
bounded reserve.  The following family makes the surviving bulk explicit.

Fix `L>0`, `N>=2`, and positive numbers `rho,tau`.  On the source modes
`V_n`, `-N<=n<=N`, set

\[
 b_n=\tau n,\qquad a_0=0,
 \qquad a_n=\rho+\tau\quad(n\ne0),                    \tag{6.1}
\]

and reconstruct

\[
 Q_{nn}=a_n,
 \qquad Q_{nm}={b_n-b_m\over n-m}=\tau\quad(n\ne m). \tag{6.2}
\]

Equivalently,

\[
 Q=\operatorname {diag}(-\tau,\rho,\ldots,\rho)
   +\tau|\eta\rangle\langle\eta|.                    \tag{6.3}
\]

This matrix is real Hermitian, commutes with inversion, and satisfies the
exact nonzero source displacement

\[
 [D,Q]=|\boldsymbol\beta\rangle\langle\eta|
       -|\eta\rangle\langle\boldsymbol\beta|,
 \qquad \boldsymbol\beta=\tau D\eta\ne0.             \tag{6.4}
\]

Take `kappa=V_0`.  In the normalized even basis put

\[
 u=\sqrt2\sum_{n=1}^Ne_n^+.
\]

Then

\[
 q=0,qquad b=\tau u,qquad r=\tau\sqrt{2N},          \tag{6.5}
\]

\[
 \boxed{B=\rho I+\tau|u\rangle\langle u|,
 \qquad Q_--qI=\rho I.}                              \tag{6.6}
\]

Both required finite signs are strict.  The full even block couples only
`kappa` and `u`; its `2 by 2` determinant is
`-tau^2*||u||^2<0`.  Hence the global ground is unique, negative, and
inversion even, while all other even and odd directions are positive.  The
source boundary pairing is nonzero by the exact commutator theorem.

Choose

\[
 \omega={e_1^+-e_2^+\over\sqrt2}.                    \tag{6.7}
\]

Then `omega` is orthogonal to `u`, so

\[
 \varepsilon=\rho,qquad g=0,qquad
 \delta_r=\rho+r,qquad v_r=\omega.                  \tag{6.8}
\]

Let `K_T` be the genuine centered zero-extension time-band operator for one
fixed `T>0`.  Put `c^2=<omega,K_T omega>`.  Sherman--Morrison gives

\[
 \mathfrak R_r(\omega)
 ={\operatorname {tr}K_T
   -\theta\langle\widehat u,K_T\widehat u\rangle
   \over c^2},
 \qquad
 \theta={\tau\|u\|^2\over\rho+r+\tau\|u\|^2}\in(0,1),
                                                               \tag{6.9}
\]

where the trace is on the even anchor complement and
`u_hat=u/||u||`.  Since `0<=K_T<=I`,

\[
 \boxed{\mathfrak R_r(\omega)\geq\operatorname {tr}K_T-1.}
                                                               \tag{6.10}
\]

This lower bound uses `c^2<=1`; for large `L`, `c^2` is also bounded away
from zero.

Indeed, the Fourier energy of a normalized centered mode with
`|2*pi*n/L|<=T/2` outside `[-T,T]` is at most

\[
 {8\over\pi LT}.                                      \tag{6.11}
\]

The corresponding even mode loses at most `16/(pi*L*T)`, and the vector in
(6.7) loses at most `32/(pi*L*T)`.  Therefore, with

\[
 J=\left\lfloor{LT\over4\pi}\right\rfloor,
 \qquad N\geq J,                                      \tag{6.12}
\]

one has, for all sufficiently large `L`,

\[
 c^2\geq{1\over2},
 \qquad \operatorname {tr}K_T\geq{J\over2}.          \tag{6.13}
\]

Equations (6.10)--(6.13) prove

\[
 \boxed{\mathfrak R_r(\omega)=\Omega(L).}             \tag{6.14}
\]

The residual ratio can nevertheless be prescribed independently.  For any
fixed `p>0`, choose

\[
 \tau={\rho L^{-p}\over\sqrt{2N}}.                   \tag{6.15}
\]

Then

\[
 {r\over\varepsilon}=L^{-p}.                         \tag{6.16}
\]

For `p=2`, the intrinsic one-vector condition
`r/epsilon=o(L^(-3/2))` holds, but (6.13)--(6.16) make
`L^(3/2)*tr(r(B+rI)^(-1)K_T)` diverge.  Thus the ratio alone is not
sufficient.  For every `p>5/2`, the same soft trace tends to zero after the
`L^(3/2)` scaling, because

\[
 \operatorname {tr}\{r(B+rI)^{-1}K_T\}
 \leq {r\over\rho+r}{LT\over\pi}=O(L^{1-p}),          \tag{6.17}
\]

while the reserve still diverges linearly.  Thus a bounded reserve is a
useful sufficient mechanism, but it is not necessary for the soft-trace
target.

This family strengthens an abstract diagonal no-go in exactly the limited
sense relevant here: it retains nonzero source Cauchy displacement, strict
finite parity signs, simple-even globality, boundary nonvanishing, and the
actual fixed-window time-band operator.  It still does not retain the pinned
arithmetic coefficients or the prolate state, so it cannot decide the
actual source sequence.

## 7. Point diagnostic at `lambda=2, N=4, T=1`

The serialized checkpoint-0.64 producer matrices give the following
one-step decomposition for the exact secant.  These are high-precision point
values, not interval or ball enclosures and not an asymptotic estimate.

```text
epsilon                         3.64580262228905e-4
r                               5.29022713318069e-5
c^2                             1.28754866322788e-1
delta_r                         7.93199980562e-5
a=delta_r/(epsilon+r)           1.89995967926e-1
g^*(C+rI)^(-1)g                 3.38162535504e-4
||g||                           1.30671685343e-2
||v_r-omega||                   5.83736987146e-2
||v_r||                         1.00170229545
R_graph                         4.82538429942
R_bulk                          4.08762568894e-3
R_graph+R_bulk                  4.82947192511
```

Thus this single pilot's reserve is almost entirely the harmonic graph
term, not the deflated bulk.  This observation does not extrapolate: the
source-Cauchy family in Section 6 proves that the opposite behavior is
compatible with the structural identities.

A read-only replay from the serialized 80-decimal producer inputs also gave
point defects about `1.2e-70`, `6.4e-72`, and `4.7e-71` respectively for
the original rank-two displacement, equation (5.3), and the rank-three
deflated displacement.  Both formula paths used the same serialized point
matrix and arithmetic library environment.  These checks are DIAGNOSTIC;
they are not independent analytic or interval evidence.

Checkpoint 0.65 adds a stronger finite replay for the one-step split itself.
The producer rebuilds the checkpoint-0.64 source objects live and evaluates
the Schur decomposition, while the standalone verifier imports no
checkpoint-0.65 producer code and independently rebuilds the source matrix,
differential-form prolate state, closed-Si/Ci time-band matrix, and
incomplete-gamma limiting state before performing fresh solves.  At 80
digits it gives

```text
rank-one soft contribution       0.07872842574020351591
deflated-bulk soft contribution  0.00006669154528144807
rank-one H0 contribution         4498.6414604334730009
deflated-bulk H0 contribution    1.2621396141783000
```

The largest scaled producer/replay discrepancy is about `3.97e-74`.
Producer and replay still share `mpmath` and the same unenclosed 30-mode
Galerkin truncation, so this remains a point diagnostic rather than a
certified source estimate.

## 8. Exact next source theorem

On one common unbounded source schedule, after proving both strict shifted
sector signs, the secant-shorted route can be closed by proving

\[
 \inf_L{\delta_r\over\varepsilon+r}>0,               \tag{8.1}
\]

\[
 {\varepsilon+r\over c^2}
 \operatorname {tr}\{(C+rI)^{-1}K_F\}=O(1),          \tag{8.2}
\]

together with the already isolated relative ratio

\[
 {r\over\varepsilon}=o(L^{-3/2}).                    \tag{8.3}
\]

Equations (3.5) and (8.1)--(8.2) make the reserve bounded, after which
(8.3) proves the intrinsic soft-trace target.  A sharper proof may replace
(8.1)--(8.2) by direct decay of the sum in (2.3); bounded reserve is not
necessary by Section 6.

The exact odd-response alternative is to prove (5.7) bounded and (2.5)
directly.  The present source inputs give neither the required odd response
quotient nor the deflated reciprocal trace.  Rank-two displacement, strict
positivity, absolute prolate flatness, and a one-vector secant energy do not
supply either estimate.

The note therefore identifies a finite, source-reconstructible next test
without changing the claim boundary.  It proves no unbounded arithmetic
estimate and leaves the formal state `P0_INVALIDATED`.
