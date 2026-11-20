# Hermite moments and the exact left-response theorem

## Result and scope

Let

\[
 g_h(x)=e^{h/2}e^{-\pi e^{2h}x^2},\qquad
 G_h(x)=g_h(x)+g_{-h}(x),\qquad
 C(h)=G_h(0)=2\cosh(h/2).
\tag{1}
\]

Within the strong complete-theta decay and Ewald/Fubini domain imported from
wave 29, this note gives two exact reductions for the direct source.

1. Its Fourier--Hermite coefficients are signed Hausdorff moments of one
   explicit complete-theta function.  Endpoint cancellation forces both
   coefficient signs, so coefficientwise Hermite positivity is impossible.
2. Every finite **left** incomplete-Euler response of the normalized squeezed
   Gaussian `G_h/C(h)` is strictly increasing for `h>0`.  This turns the left
   finite-head problem into one signed Green correlation with a positive
   universal response derivative.

The analogous global monotonicity theorem for the trapezoidal response is not
proved.  More importantly, the remaining complete-theta factor in the Green
correlation is signed.  Nothing here proves a direct-head sign, a next pivot,
an all-degree theorem, or RH.

## 1. Positive squeezed-Hermite expansion

Use the normalized Fourier Hermite functions

\[
 \phi_j(x)={2^{1/4}\over\sqrt{2^j j!}}
 H_j(\sqrt{2\pi}x)e^{-\pi x^2},
\tag{2}
\]

where `H_j` is the physicists' Hermite polynomial.  The standard squeezed
Gaussian generating function and the symmetrization `h -> -h` give

\[
 \boxed{
 G_h(x)=\sum_{r\ge0}s_r(h)\phi_{4r}(x),\qquad
 s_r(h)=c_r(\operatorname {sech}h)^{1/2}\tanh^{2r}h,}
\tag{3}
\]

with

\[
 c_r={2^{3/4}\sqrt{(4r)!}\over2^{2r}(2r)!}>0.
\tag{4}
\]

Only Fourier eigenvalue `+1` modes survive.  In particular every coefficient
in (3) is nonnegative, even in `h`, and

\[
 c_r\phi_{4r}(0)=2{\binom{4r}{2r}\over16^r}>0.
\tag{5}
\]

## 2. The direct source as one signed Hermite mixture

Put `m=n+1`, let `D=d/dh`, and retain the wave-29 notation

\[
 F_m=T_m(D)\psi,\qquad
 Y_m=hT_m(D)[hF_m],\qquad
 W_m=(-1)^m(D^2-\tfrac14)Y_m.
\tag{6}
\]

Starting from the proved wave-29 formula

\[
 \mathcal P_n(x)={4\over\sigma_n}\int_0^\infty
 hF_m(h)T_m(D)[h\sigma_x](h)\,dh,
 \qquad \sigma_x=(D^2-\tfrac14)G_h(x),
\]

the parity of `T_m`, evenness of `psi`, and two integrations by parts in the
strong wave-29 Ewald/Fubini domain give

\[
 \boxed{
 \mathcal P_n(x)={2\over\sigma_n}
 \int_{\mathbb R}W_m(h)G_h(x)\,dh.}
\tag{7}
\]

Indeed, moving `T_m(D)` across the real-line pairing contributes `(-1)^m`,
and moving `D^2-1/4` from `G_h` to `Y_m` gives (7).  The functions `Y_m` and
`W_m` are even.

If

\[
 \mathcal P_n=\sum_{r\ge0}a_{r,n}\phi_{4r},
\tag{8}
\]

then

\[
 \boxed{a_{r,n}={2\over\sigma_n}\int_{\mathbb R}W_m(h)s_r(h)\,dh.}
\tag{9}
\]

With `z=tanh^2 h`, evenness and

\[
 dh={dz\over2\sqrt z(1-z)}
\tag{10}
\]

turn (9) into the signed Hausdorff representation

\[
 \boxed{
 {\sigma_n a_{r,n}\over2c_r}
 =\int_0^1 z^{r-1/2}(1-z)^{-3/4}
 W_m(\operatorname {artanh}\sqrt z)\,dz.}
\tag{11}
\]

This is an exact one-dimensional target, but its density is signed.

## 3. Endpoint cancellation is a sign obstruction

Because `C''=C/4`,

\[
 (D^2-\tfrac14)C=0.
\tag{12}
\]

The same boundary domain used in (7) therefore gives

\[
 \boxed{\int_{\mathbb R}W_m(h)C(h)\,dh=0.}
\tag{13}
\]

Equivalently `mathcal P_n(0)=0`.  Combining (5), (8), and (13), and using the
imported Schwartz/absolute endpoint convergence, the sequence `(a_(r,n))`
must contain both signs unless `mathcal P_n` vanishes identically.
Thus a proof by nonnegative Hermite coefficients cannot work for the actual
direct source.  Eventual coefficient signs, even if proved, must retain a
finite signed compensation.

## 4. Exact Green correlation for a finite head

Let `mathcal E_J` be either the left or trapezoidal incomplete-Euler
functional and put

\[
 K_J(h)=\mathcal E_J[G_h],\qquad R_J(h)={K_J(h)\over C(h)}.
\tag{14}
\]

Since (13) permits subtraction of any constant from `R_J`, (7) gives

\[
 \mathcal H_{n,J}^{\rm dir}
 ={2\over\sigma_n}\int_{\mathbb R}W_m C R_J\,dh.
\tag{15}
\]

The elementary Wronskian identity

\[
 C(D^2-\tfrac14)Y_m
 =\left[C^2(Y_m/C)'\right]'
\tag{16}
\]

and evenness then yield

\[
 \boxed{
 \mathcal H_{n,J}^{\rm dir}
 ={4(-1)^{m+1}\over\sigma_n}
 \int_0^\infty C(h)^2(Y_m/C)'(h)R_J'(h)\,dh.}
\tag{17}
\]

The lower boundary vanishes by parity.  At infinity the imported
complete-theta decay supplies both the Wronskian limit in (13) and
`R_J C^2(Y_m/C)' -> 0`; for fixed `J`, boundedness of `R_J` makes
`e^(h/2)(|Y_m|+|Y_m'|)->0` a sufficient explicit condition.

All normalization and sign information is visible in (17).  The remaining
task is a correlated complete-theta sign/variation estimate; separate
absolute-value bounds discard the needed compensation.

## 5. The normalized universal response

Write `a=e^h`.  Division by `C` gives

\[
 p_h(x):={G_h(x)\over C(h)}
 ={ae^{-\pi a^2x^2}+e^{-\pi x^2/a^2}\over a+1}.
\tag{18}
\]

It is decreasing in `x`, satisfies `p_h(0)=1`, and, by self-duality,

\[
 \int_0^\infty p_h(x)\,dx={1\over2}.
\tag{19}
\]

For integer `J>=1`,

\[
 R_J^L=\sum_{k=1}^Jp_h(k)-\int_0^Jp_h(x)\,dx<0,
\tag{20}
\]

\[
 R_J^T=R_J^L+{1-p_h(J)\over2}
 =\sum_{k=1}^{J-1}p_h(k)+{p_h(J)\over2}
   +\int_J^\infty p_h(x)\,dx>0.
\tag{21}
\]

The signs in (20)--(21) alone do not settle (17), which uses `R_J'`.

## 6. Exact all-cutoff theorem for the left rule

The new universal theorem is

\[
 \boxed{(R_J^L)'(h)>0\qquad(h>0,\ J=1,2,\ldots).}
\tag{22}
\]

Here and below a prime denotes `d/dh`.  Put `q=partial_h p_h`, `y=pi x^2`,
and `d=a+1`.  Direct differentiation shows that the sign of `q_x` for `x>0`
is the sign of `A(y)+B(y)`, where

\[
 A=a^3e^{-a^2y}[2da^2y-(2a+3)],
\tag{23}
\]

\[
 B=a^{-2}e^{-y/a^2}[(3a+2)-2dy/a^2].
\tag{24}
\]

The zeros of the two linear factors are

\[
 \alpha={2a+3\over2da^2},\qquad
 \beta={a^2(3a+2)\over2d}.
\tag{25}
\]

For `a>1`, `alpha<beta` and `alpha<pi`.  Hence `A>0` on `x>=1`, while
`B` changes from positive to negative at `beta`.  For `y>beta`,

\[
 {d\over dy}\log{A\over-B}
 =-(a^2-a^{-2})+{1\over y-\alpha}-{1\over y-\beta}<0.
\tag{26}
\]

The ratio starts at infinity and tends to zero.  Thus `q` is increasing and
then decreasing on `[1,infinity)`.

Let

\[
 e_k=q(k)-\int_{k-1}^kq(x)\,dx
 =\int_{k-1}^k(x-k+1)q_x(x)\,dx.
\tag{27}
\]

For `k>=2`, every cell before the unique maximum has nonnegative error and
every cell after it has nonpositive error.  The single cell containing the
maximum may have either sign, but it cannot create a second transition.
Thus `(e_k)` has at most one `+` to `-` transition.
The first cell is strictly positive.  In exact form,

\[
\begin{aligned}
2d^2e_1={}&a\left[
 \operatorname {erfc}(\sqrt\pi/a)-\operatorname {erfc}(\sqrt\pi a)
 \right]\\
&+2\left(1+{2\pi d\over a^2}\right)e^{-\pi/a^2}
-2a^2(1+2\pi ad)e^{-\pi a^2}.
\end{aligned}
\tag{28}
\]

The error-function term is positive.  The remaining pair is positive because

\[
 e^{\pi(a^2-a^{-2})}>a^6>a^5>
 {a^2(1+2\pi ad)\over1+2\pi d/a^2}.
\tag{29}
\]

For the first inequality, set `a=e^h`: both sides have logarithm zero at
`h=0`, while `d[pi(a^2-a^-2)]/dh=4pi cosh(2h)>6`.  The last inequality in
(29) follows from
`1+2pi*a*d < a^3(1+2pi*d/a^2)` for `a>1`.

Finally, the limiting partial sum is strictly positive.  With

\[
 \vartheta(a)=\sum_{n\in\mathbb Z}e^{-\pi a^2n^2},
\tag{30}
\]

Poisson summation gives

\[
 R_\infty^L={a\vartheta(a)\over a+1}-1,
\tag{31}
\]

and

\[
 (R_\infty^L)'={a\over(a+1)^2}
 [\vartheta+a(a+1)\vartheta']>0.
\tag{32}
\]

The bracket equals

\[
1-\sum_{n\ge1}
[4\pi n^2a^2(a+1)-2]e^{-\pi n^2a^2}.
\tag{33}
\]

The sum is `1` at `a=1` by modular symmetry.  Each summand decreases strictly
for `a>1`, because its derivative is

\[
4\pi n^2a(a+1)e^{-\pi n^2a^2}(3-2\pi n^2a^2)<0.
\tag{34}
\]

The partial sums `sum_(k<=J)e_k` first increase and then decrease to the
positive limit (32), while their first value (28) is positive.  This proves
(22).

## 7. Trapezoidal status and the remaining lemma

Exactly,

\[
 \boxed{(R_J^T)'=(R_J^L)'-{1\over2}q(J).}
\tag{35}
\]

Therefore (22) proves trapezoidal monotonicity whenever `q(J)<=0`, but `q(J)`
can be positive.  Trapezoidal cell derivatives can have a `+,-,+` pattern,
so the one-transition proof above does not transfer.

Both rules are strictly increasing for small positive `h`.  Since they are
even in `h`, their first derivative vanishes at zero, and

\[
 R_J''(0)=\mathcal E_J\left[
 2\pi x^2(2\pi x^2-3)e^{-\pi x^2}\right]>0.
\tag{36}
\]

Here

\[
 \int_0^J2\pi x^2(2\pi x^2-3)e^{-\pi x^2}\,dx
 =-2\pi J^3e^{-\pi J^2},
\tag{37}
\]

and the integrand is positive at every positive integer.  For fixed `J`, both
derivatives are also positive for all sufficiently large `h`; a completed
diagnostic scan found no trapezoidal counterexample through `J=500` and
`10^-7<=h<=12`.  That scan is evidence only, not a proof.

The left finite-head problem has therefore been reduced to the theta-specific
correlation

\[
 (-1)^{m+1}\int_0^\infty
 C^2(Y_m/C)'(R_J^L)'\,dh>0,
\tag{38}
\]

with a rigorously positive second factor.  Proving (38), or the corresponding
correlated trapezoidal inequality, is the remaining analytic task.

## 8. The actual theta factor is necessarily signed

The positivity in (22) does not make the Green integrand pointwise positive.
Set

\[
 y_m={Y_m\over C},\qquad
 u_m=(-1)^m y_m,
\qquad
 S_m=(-1)^{m+1}C^2y_m'=-C^2u_m'.
\tag{39}
\]

Since `Y_m(0)=0` and `Y_m/C -> 0`,

\[
 \boxed{
 \int_0^h{S_m(t)\over C(t)^2}\,dt=-u_m(h),\qquad
 \int_0^\infty{S_m\over C^2}=0.}
\tag{40}
\]

Every nonzero `S_m` must therefore take both signs.  Pointwise
total-positivity or same-sign factorization cannot prove (38).

There is a parity-free second Green form.  Put

\[
 Q_J=C^2(R_J^L)'.
\tag{41}
\]

The boundary terms vanish under the same complete-theta decay domain, and

\[
 \boxed{
 \int_0^\infty S_m(R_J^L)'\,dh
 =\int_0^\infty u_m Q_J'\,dh.}
\tag{42}
\]

But `Q_J` is itself nonmonotone.  With

\[
 c_J={\pi J(3J+1)\over6},\qquad a=e^h,
\]

the explicit fixed-cutoff formula gives

\[
 Q_J={1\over2}+{3c_J\over a^2}+{2c_J\over a^3}
 +O_J(a^{-4}),
\tag{43}
\]

so `Q_J'<0` eventually.  At the other endpoint,

\[
 Q_J'(0)=4(R_J^L)''(0)>0.
\tag{44}
\]

Thus (42) is a correlation of two signed factors, not an ordered pairing.

The obstruction is already strict for actual theta at `m=1`.  Since `T_1=D`,

\[
 Y_1=h\psi'+h^2\psi''.
\tag{45}
\]

The inequality `psi''(0)<0` makes `Y_1<0` near zero.  Complete-theta tail
asymptotics give `Y_1>0` and `(Y_1/C)'<0` eventually.  Hence

\[
 S_1=C^2(Y_1/C)'
\]

is negative near zero, positive somewhere, and negative in the tail: it has
at least two sign changes without assuming a next-pivot sign.

For general `m`, monicity gives

\[
 Y_m\sim h^2(2z)^{2m}\psi>0,qquad z=\pi e^{2h},
\]

and therefore the eventual sign of `S_m` is `(-1)^m`.  At the center, define

\[
 \alpha_m=(-1)^m
 [T_m(D)^2\psi+D T_m(D)T_m'(D)\psi](0).
\tag{46}
\]

Then

\[
 u_m={\alpha_m\over2}h^2+O(h^4),qquad
 S_m=-4\alpha_mh+O(h^3).
\tag{47}
\]

No all-degree sign for this honest old-polynomial/complete-theta scalar is
known.

At `m=1`, writing `v=-psi'/psi`, one obtains the sharper factorization

\[
 Y_1=h\psi v(\Phi-1),qquad
 \Phi(h)=h\left(v-{v'\over v}\right).
\tag{48}
\]

Here `Phi(0+)=-1` and `Phi(infinity)=+infinity`.  Proving `Phi'>0` would give
a unique zero of `u_1`; proving that `Q_J` has one maximum would then reduce
the first actual case to a quantitative ordering of two crossings.  The
minimal bounded diagnostic is therefore `m=1,J=2`, with interval enclosures
for `Phi,Phi',Q_2',Q_2''` and analytic tail signs.  Such a finite diagnostic
would guide a lemma; it would not prove an all-degree theorem or RH.

## 9. Exact trapezoidal curvature reduction

The unresolved trapezoidal response also has a one-dimensional exact
reduction.  Let `R` have Rayleigh survival

\[
 \Pr(R>x)=e^{-\pi x^2},
\]

and let `S_a` take `a^-1` with probability `a/(a+1)` and `a` with probability
`1/(a+1)`.  Then `p_h(x)=Pr(S_aR>x)` and `E S_a=1`.

For one scale `s`, let

\[
\begin{aligned}
 g_J(s)={}&{1\over2}+\sum_{k=1}^{J-1}e^{-\pi k^2/s^2}
 +{1\over2}e^{-\pi J^2/s^2}\\
 &-s\int_0^{J/s}e^{-\pi u^2}\,du.
\end{aligned}
\tag{49}
\]

This is the expectation of the bounded sawtooth which equals
`1/2-{x}` on `0<x<J` and zero on `x>J`; values at integer jumps are
irrelevant.  Mean preservation gives

\[
 R_J^T(h)={a g_J(a^{-1})+g_J(a)\over a+1}.
\tag{50}
\]

Differentiating the mean-preserving chord gives the exact correlated-curvature
identity

\[
 \boxed{
 (R_J^T)'(h)={a\over(a+1)^2}
 \int_{1/a}^{a}(s+1)g_J''(s)\,ds.}
\tag{51}
\]

Here

\[
\begin{aligned}
g_J''(s)={}&\sum_{k=1}^{J-1}{2\pi k^2\over s^6}
 e^{-\pi k^2/s^2}(2\pi k^2-3s^2)\\
&+{\pi J^2\over s^6}e^{-\pi J^2/s^2}
 [2\pi J^2+(2J-3)s^2].
\end{aligned}
\tag{52}
\]

Termwise convexity is false: for `J=1`, `g_1''(s)<0` once
`s>sqrt(2pi)`.  Nevertheless (51) proves the full `J=1` theorem.  After
`u=1/s`, the integral is

\[
 \pi\int_{1/a}^{a}(u+u^2)(2\pi u^2-1)e^{-\pi u^2}\,du>0.
\tag{53}
\]

For `a<=sqrt(2pi)` its relevant paired form is positive; for larger `a` it
exceeds the positive full comparison integral on `[0,1]`, whose value is

\[
 {1\over2}+\int_0^1e^{-\pi u^2}\,du
 -(2\pi+\tfrac32)e^{-\pi}>0.
\]

Thus

\[
 \boxed{(R_1^T)'(h)>0\quad(h>0).}
\tag{54}
\]

There is also a scalar all-cutoff sufficient condition.  Let `D_1(a)` and
`D_infinity(a)` be the first and limiting left-response derivatives from
Section 6, and put

\[
 M(a)=\sup_{x\ge1}(\partial_h p_h(x))_+.
\]

The justified endpoint bound gives

\[
 (R_J^T)'\ge\min(D_1,D_\infty)-{M\over2}.
\]

Hence every cutoff is paid if

\[
 \boxed{M(a)<2\min(D_1(a),D_\infty(a)).}
\tag{55}
\]

The weaker-looking condition `M<D_1+D_infinity` does **not** follow from the
unimodality argument; it incorrectly drops `|D_1-D_infinity|`.

Condition (55) holds for `a` near one and for all sufficiently large `a`.
At `a=1`, the leading constants are

\[
 {M\over h}\to2\pi(2\pi-3)e^{-\pi},\quad
 {D_1\over h}\to4\pi(\pi-1)e^{-\pi},
\]

while `D_infinity/h` is the strictly larger positive integer sum from (36).
As `a->infinity`,

\[
 M\sim{2e^{-3/2}\over a},\qquad
 D_1\sim{1\over2a},\qquad D_\infty\sim{1\over a}.
\]

The remaining trapezoidal gap is therefore the compact intermediate-`a`
inequality (55), or a sharper correlated proof of (51); finite scans alone do
not close it.
