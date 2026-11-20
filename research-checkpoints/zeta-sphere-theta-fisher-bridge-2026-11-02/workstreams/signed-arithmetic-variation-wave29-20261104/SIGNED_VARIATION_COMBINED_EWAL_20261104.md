# Signed arithmetic variation and the combined Ewald source

## Scope

This checkpoint sharpens and audits two exact reductions for the actual
complete-theta endpoint problem. First, it gives explicit degree-independent
bounds for the positive Jordan weight in the wave-28 Abel representation.
Second, it combines the endpoint angle with the wave-24 Ewald source before
estimating either one. The resulting remote tail has the imported parity sign
after an `O(n log n)` onset, conditional on the positive current prefix and
the paper-level complete-orbit transfer lemma. A further exact decombination,
however, shows that subtracting the required threshold returns the direct
next-pivot Ewald source. Thus the combined gate is a useful route audit, not a
new positivity mechanism. No next pivot or RH claim is made.

## 1. Exact Jordan-weight bounds

Write

\[
 \mathfrak H(x)=x^{-3}\sum_{m\le x}J_2(m)
 \left({x\over m}-1\right),\qquad
 c={1\over6\zeta(3)}.                                      \tag{1}
\]

The divisor identity

\[
 J_2(m)=\sum_{d\mid m}\mu(d)(m/d)^2
\]

gives

\[
 \mathfrak H(x)=x^{-3}\sum_{d\le x}\mu(d)F(x/d),
 \qquad F(y)=\sum_{k\le y}k(y-k).                         \tag{2}
\]

For `M=floor(y)` and `r=y-M`, direct summation gives

\[
 F(y)={y^3-y(1-3r+3r^2)+(2r^3-3r^2+r)\over6}.             \tag{3}
\]

Let `N=floor(x)`. Separating the cubic term in (3), bounding the
tail of `sum mu(d)/d^3`, and using
`max_[0,1]|r(2r-1)(r-1)|=1/(6 sqrt(3))` gives

\[
 \left|\mathfrak H(x)-c\right|
 \le {1\over12N^2}+{H_N\over6x^2}
       +{N\over36\sqrt3\,x^3}.                            \tag{4}
\]

In particular, for every `x>=2`,

\[
 \boxed{
 \left|\mathfrak H(x)-{1\over6\zeta(3)}\right|
 \le {1+\log x\over2x^2}.}                                \tag{5}
\]

This improves the previous crude `O(1/x)` control to an explicit
`O(log(x)/x^2)` estimate.

If `Z` is locally absolutely continuous, `Z(infinity)=0`, and the weighted
variation below is finite, then for every integer `J>=2`,

\[
 \boxed{
 -\int_J^\infty\mathfrak H Z'
 \ge {Z(J)\over6\zeta(3)}
 -{1\over2}\int_J^\infty{1+\log x\over x^2}|Z'(x)|\,dx.}  \tag{6}
\]

There is also a one-sided version. Since

\[
 {m^2\over\zeta(2)}\le J_2(m)\le m^2
\]

and `F(x)/x^3` has its cell minima at integer endpoints,

\[
 h_J:={1-J^{-2}\over\pi^2}
 \le\mathfrak H(x)\le {1\over6}\qquad(x\ge J).             \tag{7}
\]

If the upward variation

\[
 V_{+,J}=\int_J^\infty (Z')_+\,dx
\]

is finite, splitting positive and negative variation gives

\[
 \boxed{
 -\int_J^\infty\mathfrak H Z'
 \ge h_JZ(J)-\left({1\over6}-h_J\right)V_{+,J}.}            \tag{8}
\]

For an actual-theta envelope

\[
 |Z_n'(x)|\le M_nx^{r_n}e^{-\pi x^2},
 \qquad \pi J^2\ge r_n-1,
\]

the error in (6) is at most

\[
 {M_n\over2\pi}(1+\log J)J^{r_n-3}e^{-\pi J^2}.            \tag{9}
\]

Thus an `O(n log n)` cutoff makes this error absolutely tiny when
`r_n=O(n)` and `M_n=exp(O(n log n))`. A comparison scale is still needed
before calling it relatively negligible.

Jordan arithmetic alone cannot sign the integral for arbitrary `Z`.
Already on `1<x<2`,

\[
 \mathfrak H(x)={x-1\over x^3},\qquad
 \mathfrak H'(x)={3-2x\over x^4},                          \tag{10}
\]

so the derivative has both signs. Smooth test bumps supported on the two
sides of `x=3/2` give both signs of the integrated functional. A proof must
constrain the actual theta packet, not just the positive arithmetic weight.

## 2. One combined Ewald source

Let `m=n+1`, `F_j=T_j(D)psi`, and

\[
 q_n=T_m'-mT_{m-1}.
\]

For the continuous symmetrized scale orbit `sigma_x`, define

\[
 Q_n(x)={1\over\sigma_n}\int_0^\infty
 hF_{m-1}(h)q_n(D)\sigma_x(h)\,dh.                         \tag{11}
\]

With

\[
 \Lambda[f]=\sum_{k\ge1}\left(f(k)-\int_{k-1}^kf(x)\,dx\right),
\]

the imported strong Ewald/Fubini hypotheses give

\[
 \Lambda[Q_n]=X_n,
 \qquad \Lambda[\mathcal J_n]=\mathcal W_n.                \tag{12}
\]

Consequently the combined source

\[
 \mathcal M_n=\mathcal J_n+4Q_n                            \tag{13}
\]

satisfies

\[
 \Lambda[\mathcal M_n]
 =\mathcal W_n+4X_n
 ={\sigma_{n+1}\over\sigma_n}+4(A_n-nB_n).                \tag{14}
\]

Therefore

\[
 \boxed{
 {\sigma_{n+1}\over\sigma_n}>0
 \quad\Longleftrightarrow\quad
 \Lambda[\mathcal M_n]>4(A_n-nB_n).}                      \tag{15}
\]

This criterion uses no unknown next-pivot normalization.

The Weyl identity

\[
 T_m(D)(h\sigma_x)=hT_m(D)\sigma_x+T_m'(D)\sigma_x
\]

cancels the explicit residual row and gives

\[
 \boxed{
 \begin{aligned}
 \mathcal M_n(x)={4\over\sigma_n}\int_0^\infty\bigl[&
 h^2(F_m-F_{m-1})T_m(D)\sigma_x\\
 &+hF_mT_m'(D)\sigma_x
 -mhF_{m-1}T_{m-1}(D)\sigma_x\bigr]dh.
 \end{aligned}}                                           \tag{16}
\]

The angle and the finite head now occupy literally the same Ewald cells;
there is no comparison of separately estimated signed quantities.

## 3. Exact decombination back to the next pivot

The apparent combined payment has an exact linear obstruction. Diagonal
Christoffel--Darboux gives

\[
 \sigma_n(A_n-nB_n)=-\int_0^\infty
 hF_n(h)\{hF_m(h)+mF_n(h)\}\,dh.                         \tag{D1}
\]

Define its Ewald source

\[
 \mathcal R_n(x)=-{4\over\sigma_n}\int_0^\infty hF_n
 \{hT_m(D)\sigma_x+mT_n(D)\sigma_x\}\,dh.                \tag{D2}
\]

Strong Ewald replacement gives

\[
 \Lambda[\mathcal R_n]=4(A_n-nB_n).                      \tag{D3}
\]

Subtracting (D2) from (16) cancels every `F_n` term:

\[
 \begin{aligned}
 \mathcal P_n(x)&:=\mathcal M_n(x)-\mathcal R_n(x)\\
 &={4\over\sigma_n}\int_0^\infty
 hF_m(h)T_m(D)(h\sigma_x)(h)\,dh.                        \tag{D4}
 \end{aligned}
\]

This is precisely the direct next-pivot source, and

\[
 \boxed{\Lambda[\mathcal P_n]={\sigma_{n+1}\over\sigma_n}.} \tag{D5}
\]

Consequently the combined criterion (15) is identically
`Lambda[mathcal P_n]>0`. Cellwise subtraction also returns the direct pivot
cells. The combined source may expose a useful correlated grouping, but any
linear comparison with its threshold is a repackaging, not an independent
payment lemma. A genuine advance must add a nonlinear or theta-arithmetic
inequality that is not equivalent to positivity of `mathcal P_n`.

For a finite split, one qualification matters. If `H_J` and `T_J` denote the
chosen head and tail cell sums, then

\[
 H_J(\mathcal M)-\Lambda[\mathcal R]
 =H_J(\mathcal P)-T_J(\mathcal R),                         \tag{D6}
\]

not just `H_J(mathcal P)`. Only the full functional criterion decombines
without a boundary remainder. The positive remote tail of `mathcal P` below
supplies a separate direct finite-head route.

## 4. Conditional linear-logarithmic remote tail

Assume the current actual prefix through degree `n` is positive. Then the
recurrence coefficients are positive and every coefficient of `T_j` is
nonnegative in the appropriate parity. Beyond the exact raw-jet roots, the
three reflected central-saddle terms in (16) all have sign `(-1)^m`:

1. `F_m-F_(m-1)=(-1)^m(P_m+P_(m-1))` with both amplitudes positive;
2. `F_m T_m'(D)sigma_x` has sign `(-1)^m`;
3. `-m F_(m-1)T_(m-1)(D)sigma_x` has sign `(-1)^m`.

After `j` scale derivatives, `j=0,1,2`, the reflected-orbit identity adds
exactly `(-1)^j`. Every central term therefore has sign `(-1)^(m+j)`.
The maximum raw order is `m+2`.

The audited root bound

\[
 R_r\le2e(r+3)\{\log(r+3)+1\}                             \tag{17}
\]

and the imported wave-24 complete-orbit transfer lemma then give an absolute
effective constant `C` such that

\[
 \boxed{
 (-1)^{m+j}\mathcal M_n^{(j)}(x)>0,
 \quad j=0,1,2,
 \quad x\ge C(n+6)\{\log(n+6)+1\}.}                       \tag{18}
\]

The extension is termwise: each recurrence monomial's complement is compared
with its own local mass, so coefficient heights cancel. The explicit factor
`m` and the factors `h,h^2` occur in both bounds. Higher first-leg orbits,
the boundary saddle, and the unreflected leg retain the same exponential
action gaps as the wave-24 proof.

Equation (18) is a paper-level extension of the imported analytic
complete-orbit lemma, not a new machine-checked certificate. Its use also
requires the strong Ewald/domain justification in (12), including absolute
Fubini/Sobolev convergence, `Q_n(0)=0`, rapid decay, and zero continuum mean.
No numerical value of `C` is supplied.

The same termwise argument applies directly to the decombined pivot source
`mathcal P_n`. Its two reflected central terms are

\[
 h^2F_mT_m(D)\sigma_x,
 \qquad hF_mT_m'(D)\sigma_x,
\]

and both have sign `(-1)^m`; `j` scale derivatives again contribute
`(-1)^j` and use raw order at most `m+2`. Conditional on the same imported
complete-orbit lemma,

\[
 (-1)^{m+j}\mathcal P_n^{(j)}(x)>0,
 \quad j=0,1,2,
 \quad x\ge C'(n+6)\{\log(n+6)+1\}.                       \tag{18a}
\]

Thus the direct next-pivot source itself has a positive parity-adapted remote
tail. This is a direct adaptation of the wave-24 analytic transfer proof, not
a previously machine-checked theorem. The same weighted Ewald domain gives
`mathcal P_n(0)=0` and `mathcal P_n,mathcal P_n'` tending to zero at infinity,
so both parity tilings sum to `Lambda[mathcal P_n]` with no endpoint half-term.

The cell heads have exact Peano forms. If `J` is an integer beyond the onset,
the sum through cell `J` is

\[
 \mathcal H_{n,J}^{\rm dir}=
 \begin{cases}
 \displaystyle\int_0^J\{x\}\,\mathcal P_n'(x)\,dx,
       &n\text{ even},\\[1ex]
 \displaystyle{1\over2}\int_0^J\{x\}(1-\{x\})
       \mathcal P_n''(x)\,dx,&n\text{ odd}.
 \end{cases}                                             \tag{18b}
\]

Since all later parity cells are positive, the noncircular sufficient target
is `mathcal H_(n,J)^dir>0`. This is the clean first-`O(n log n)` direct
finite-head problem.

For even `n`, `m` is odd, so each eventual source is negative and increasing;
the left Ewald cells are positive. For odd `n`, `m` is even and the eventual
sources are convex; the trapezoidal cells are positive. The direct-source
tiling sums to `sigma_(n+1)/sigma_n` after the domain conditions above.

## 5. Tail and domain data do not pay the head

There is a sharp analytic nonimplication even if all generic source properties
above are imposed. Put `a=2 pi`, `s=(-1)^(n+1)`, and

\[
 g_s(x)=s(e^{-ax}-4e^{-2ax}+3e^{-3ax}).                    \tag{19}
\]

Then `g_s(0)=0`, its continuum integral is zero, and for `x>=1`,

\[
 \operatorname{sgn}g_s^{(j)}=s(-1)^j,qquad j=0,1,2.       \tag{20}
\]

For `R>log(2)`, define

\[
 h_R(x)=e^{-2Rx}-3e^{-3Rx}+2e^{-4Rx}.                      \tag{21}
\]

Again `h_R(0)=0` and its continuum integral is zero, while

\[
 \Lambda[h_R]=\sum_{k\ge1}e^{-2Rk}
 (1-e^{-Rk})(1-2e^{-Rk})>0.                               \tag{22}
\]

Given any finite threshold `Theta` and any prescribed onset `J>1`, choose

\[
 t_R={\Theta-1-\Lambda[g_s]\over\Lambda[h_R]}.             \tag{23}
\]

Because `Lambda[h_R]` is asymptotic to `e^(-2R)`, whereas
`|h_R^(j)(x)|` is at most a constant times `R^j e^(-2Rx)`, sufficiently
large `R` makes

\[
 |t_Rh_R^{(j)}(x)|<{1\over2}|g_s^{(j)}(x)|
 \quad(x\ge J,\ j=0,1,2),                                 \tag{24}
\]

but

\[
 \Lambda[g_s+t_Rh_R]=\Theta-1<\Theta.                     \tag{25}
\]

Thus real analyticity, endpoint and continuum-mean cancellation, rapid decay,
a prescribed eventual derivative sign, positive parity cells, and the
`e^(-2 pi)` tail ratio still do not imply the finite-head payment.

Positive current recurrence is also insufficient. Let `L_0` be the standard
Gaussian moment functional and set

\[
 L_c[p]=L_0[p]-{1\over6\sqrt\pi}\int_{\mathbb R}
 p(t){d^4\over dt^4}e^{-t^2}\,dt.                          \tag{26}
\]

Integration by parts preserves moments through degree three,
`(mu_0,mu_1,mu_2,mu_3)=(1,0,1,0)`, but changes `mu_4` from `3` to `-1`.
Therefore the current degree-one Gram block and positive recurrence are
unchanged while

\[
 L_c[(t^2-1)^2]=-2.                                       \tag{27}
\]

These are generic analytic countermodels, not actual-theta counterexamples.
They prove that the missing finite-head inequality must use the rigid
complete-theta bilinear/modular coupling.

## 6. Remaining blocker and bounded computation

What remains is not remote-tail positivity. Linear decombination shows that a
bound for the first `O(n log n)` combined cells against `4(A_n-nB_n)` is the
direct next-pivot finite-head problem in different coordinates. The useful
open target is therefore a genuinely theta-specific, nonlinearly correlated
inequality for the signed variation in (6)--(8), or an independent lower
bound for the direct source `mathcal P_n`, that does not assume the desired
pivot sign.

The companion queue evaluates only `n=3` and `n=5`, with a primary and a
higher-resolution replay. It checks the direct, Laplace, Abel, and Stieltjes
forms and records unit-cell signed variation. These finite values may falsify
candidate inequalities or locate compensation, but they cannot establish the
all-degree finite-head bound and do not prove RH.

The completed primary/replay agree to relative scale below `3.6e-14` and
reproduce the certified signs `X_3<0<X_5`. Both degrees contain both signs of
`Z_n'`, so pointwise monotonicity is false. The cell data instead show a
localized placement mechanism: the degree-three adverse first cell overwhelms
a small favorable tail, whereas the degree-five favorable first cell pays a
contiguous adverse remainder. Crude absolute-variation payments lose this
correlation and fail even at the positive degree-five rung. These are floating
route diagnostics, not interval certificates or all-degree evidence.

