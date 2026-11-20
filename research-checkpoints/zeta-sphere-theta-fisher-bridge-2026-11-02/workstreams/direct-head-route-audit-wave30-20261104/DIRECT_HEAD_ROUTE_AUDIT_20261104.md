# Direct-head route audit: incomplete Euler coordinates and exact obstructions

## Result and scope

Let `m=n+1`, and retain the wave-29 direct Ewald source

\[
 \mathcal P_n(x)={4\over\sigma_n}\int_0^\infty
 hF_m(h)T_m(D)(h\sigma_x)(h)\,dh,
 \qquad
 \Lambda[\mathcal P_n]={\sigma_m\over\sigma_n}.
 \tag{1}
\]

This note gives four exact continuations of the wave-29 reduction.

1. Every cutoff head is one incomplete-Euler cross form.  The left and
   trapezoidal parities differ by the expected half endpoint.
2. The direct source is cosine self-dual.  Its finite heads therefore have
   explicit modular kernels, but those kernels are signed.
3. Two explicit self-dual Hermite--Gaussian functions satisfy all generic
   endpoint, mean, decay, and eventual derivative-sign requirements while
   having a negative first selected head.  Thus modular symmetry alone cannot
   pay either parity.
4. The recurrence and Jordan-arithmetic routes admit exact lower-bound
   coordinates.  Each also shows precisely which actual-theta input is still
   missing.

These statements prune generic routes and sharpen the target.  They do not
prove a direct head, a next pivot, an all-degree theorem, or RH.

## 1. One incomplete-Euler kernel per cutoff

Put

\[
 s={1\over2}-it,
 \qquad
 K(t)=s(s-1)\pi^{-s/2}\Gamma(s/2),
 \qquad
 C_x(t)={1\over2}\operatorname {Re}\{K(t)x^{-s}\}.
 \tag{2}
\]

For a fixed old-prefix polynomial `q`, define the complete scalar source

\[
 J_q(x)={1\over\pi}\int_{\mathbb R}
 q(t)^2\mathcal B(\Xi,C_x)(t)\,dt,
 \qquad
 \mathcal B(A,B)=A'B'-{1\over2}(AB''+A''B).
 \tag{3}
\]

For `q=p_m`, this is the unnormalized direct source in (1); multiplication by
the known positive factor `sigma_n^(-1)` does not change any head sign.  The
left Ewald cells are

\[
 e_{q,k}=J_q(k)-\int_{k-1}^kJ_q(x)\,dx.
 \tag{4}
\]

The continuum terms telescope exactly.  Hence the cutoff-`K` left head is

\[
 L_{q,K}={1\over\pi}\int q^2\mathcal B
 \left(\Xi,{1\over2}\operatorname {Re}\{K(t)Z_K^L(s)\}\right)dt,
 \tag{5}
\]

where

\[
 \boxed{Z_K^L(s)=\sum_{k=1}^Kk^{-s}-{K^{1-s}\over1-s}.}
 \tag{6}
\]

Since `J_q(0)=0`, the trapezoidal aggregate is

\[
 T_{q,K}=L_{q,K}-{1\over2}J_q(K),
 \tag{7}
\]

or equivalently

\[
 \boxed{Z_K^T(s)=Z_K^L(s)-{1\over2}K^{-s}.}
 \tag{8}
\]

Thus the finite head is not intrinsically a cellwise problem: it is one
completed finite-Euler kernel for each cutoff.  Euler--Maclaurin makes the
parity correction explicit,

\[
 Z_K^L-\zeta(s)={1\over2}K^{-s}-{s\over12}K^{-s-1}+\cdots,
 \qquad
 Z_K^T-\zeta(s)=-{s\over12}K^{-s-1}+\cdots.
 \tag{9}
\]

Existing actual-theta receipts give positive cumulative left heads through
the stored cutoffs at residual degrees `1,...,5`.  Only degree one currently
has an interval-certified all-tail reserve.  Those finite facts motivate
(5)--(8), but are not used as an all-degree argument.

## 2. Exact cosine self-duality and the head kernels

Let

\[
 (\mathcal Cf)(y)=\int_0^\infty f(x)\cos(2\pi xy)\,dx.
 \tag{10}
\]

For

\[
 g_h(x)=e^{h/2}e^{-\pi e^{2h}x^2},
 \tag{11}
\]

the full Fourier transform interchanges `g_h` and `g_(-h)`.  Moreover

\[
 \omega_x(h)=2(D_h^2-\tfrac14)g_h(x),
 \qquad
 \sigma_x(h)=(D_h^2-\tfrac14)(g_h(x)+g_{-h}(x)).
 \tag{12}
\]

Therefore

\[
 \mathcal C[\sigma_\bullet(h)](y)={1\over2}\sigma_y(h).
 \tag{13}
\]

The strong Ewald/Fubini domain from wave 29 permits the `h` operations in
(1) to pass through (13), giving

\[
 \boxed{\mathcal C[\mathcal P_n]={1\over2}\mathcal P_n.}
 \tag{14}
\]

In particular, `mathcal P_n(0)=0` implies

\[
 \int_0^\infty\mathcal P_n(x)\,dx=0.
 \tag{15}
\]

For any self-dual `f` satisfying (15), the integer cutoff heads have the
exact global representations

\[
 L_J(f)=2\int_0^\infty f(y)\left[
 \sum_{k=1}^J\cos(2\pi ky)-{\sin(2\pi Jy)\over2\pi y}
 \right]dy,
 \tag{16}
\]

\[
 T_J(f)=2\int_0^\infty f(y)\left[
 \sum_{k=1}^{J-1}\cos(2\pi ky)+{1\over2}\cos(2\pi Jy)
 -{\sin(2\pi Jy)\over2\pi y}
 \right]dy.
 \tag{17}
\]

The left kernel has quadratic coefficient

\[
 -{\pi^2\over3}J(3J+1)
 \tag{18}
\]

at the origin and equals `J` at every positive integer.  The trapezoidal
kernel equals `-1/2` at zero and `J-1/2` at every positive integer.  Adding a
constant to (17) does not change its integral because of (15); the
zero-normalized version still has quadratic coefficient `-pi^2 J/3`.
Thus modularity converts the head into a signed global correlation, not a
positive head--tail pairing.

## 3. Exact self-dual counterexamples in both parities

Let `H_j` be the physicists' Hermite polynomials.  The functions

\[
 H_{4r}(\sqrt{2\pi}x)e^{-\pi x^2}
 \tag{19}
\]

are Fourier self-dual.  Define

\[
 \Phi_4(x)=(16\pi^2x^4-24\pi x^2)e^{-\pi x^2},
 \tag{20}
\]

\[
 \Phi_8(x)=(4096\pi^4x^8-28672\pi^3x^6
 +53760\pi^2x^4-26880\pi x^2)e^{-\pi x^2}.
 \tag{21}
\]

Here `4 Phi_4=(H_4(sqrt(2 pi)x)-12)e^(-pi x^2)` and
`Phi_8=(H_8(sqrt(2 pi)x)-1680)e^(-pi x^2)`.  Both are entire Schwartz,
self-dual, vanish at zero, and have zero half-line integral.

For the trapezoidal parity, `Phi_8` has eventual derivative signs
`(+,-,+)` for orders `0,1,2`, but direct Gaussian integration gives

\[
 T_1(\Phi_8)=128\pi e^{-\pi}
 (16\pi^3-96\pi^2+154\pi-35)<0.
 \tag{22}
\]

The cubic in (22) is increasing for `t>=3`, while its value at `22/7` is
`-873/343`; hence it is negative at `pi<22/7`.

For the left-cell parity put

\[
 f=-\Phi_8-256\Phi_4.
 \tag{23}
\]

Its eventual derivative signs are `(-,+,-)`, but

\[
 L_1(f)=-512\pi e^{-\pi}
 (8\pi^3-52\pi^2+99\pi-43)<0.
 \tag{24}
\]

The cubic in (24) is increasing for `t>=3` and equals `2` at `t=3`, so it is
positive at `pi>3`.

Equations (22)--(24) show that self-duality, endpoint/mean cancellation,
analyticity, Schwartz decay, and the correct eventual derivative signs do
not pay even the first selected head in either parity.  These functions are
not actual-theta direct sources: they do not preserve the theta/Jacobi
coefficient coupling.  They close only the generic modular-pairing route.

## 4. A fixed-prefix Gaussian-quadrature target

Assume the actual moment prefix is positive through degree `n`, and put
`m=n+1`.  The monic `p_m`, its real roots `r_1,...,r_m`, and the positive
Gauss weights

\[
 \lambda_i=K_n(r_i,r_i)^{-1}
 \tag{25}
\]

use only the established prefix.  The `m`-node rule is exact through degree
`2m-1`.  Since `p_m^2=t^(2m)+q` with `deg q<=2m-1` and `p_m(r_i)=0`,

\[
 \boxed{
 \sigma_m=\mu_{2m}-\sum_{i=1}^m\lambda_i r_i^{2m}.}
 \tag{26}
\]

Let the direct Ewald split be

\[
 \mathcal H_{n,J}^{\rm dir}+\mathcal T_{n,J}^{\rm dir}
 ={\sigma_m\over\sigma_n}.
 \tag{27}
\]

Then the finite-head target is exactly

\[
 \boxed{
 \mathcal H_{n,J}^{\rm dir}>0
 \iff
 \mu_{2m}>
 \sum_i\lambda_i r_i^{2m}
 +\sigma_n\mathcal T_{n,J}^{\rm dir}.}
 \tag{28}
\]

This is noncircular, but equivalent to the desired sign.  It isolates the
missing actual-theta statement: the newest moment must pay the old-prefix
Gaussian prediction plus the explicit Ewald tail.  Its positivity for a
cutoff beyond the stated onset remains conditional on the imported wave-24
complete-orbit and wave-29 domain hypotheses; (28) itself is the exact
algebraic criterion without that sign assumption.

Pure recurrence geometry cannot prove (28).  Adding a multiple of the
`2m`th derivative of a Gaussian to a moment density preserves every moment
below `2m`, hence preserves `p_m`, its roots, the weights, and the old CD
kernel, while moving `mu_(2m)` arbitrarily.  Such a perturbation is analytic
and rapidly decreasing, but it destroys the exact complete-theta orbit.

## 5. Mellin diagonalization of the Jordan weight

For

\[
 \mathfrak H(x)=x^{-3}\sum_{a\le x}J_2(a)(x/a-1),
 \tag{29}
\]

termwise integration and
`sum J_2(a)a^(-u)=zeta(u-2)/zeta(u)` give, for `Re s>1`,

\[
 \boxed{
 \int_1^\infty\mathfrak H(x)x^{-s}\,dx
 ={\zeta(s)\over\zeta(s+2)(s+1)(s+2)}.}
 \tag{30}
\]

Consequently, assume that `mu` is a nonzero positive measure supported on
`(0,infinity)`, with finite mass and first moment, and that the displayed
Fubini interchange is valid.  If

\[
 Z(x)=\int_0^\infty x^{-p}\,d\mu(p),
 \qquad \mu\ge0,\qquad \mu(\{0\})=0,
 \tag{31}
\]

then `Z(infinity)=0` and

\[
 -\int_1^\infty\mathfrak H Z'
 =\int_0^\infty
 {p\zeta(p+1)\over\zeta(p+3)(p+2)(p+3)}\,d\mu(p)>0.
 \tag{32}
\]

Writing `pbar=-Z'(1)/Z(1)`, the inequalities
`p zeta(p+1)>=1`, `zeta(p+3)<=zeta(3)`, and Jensen's inequality for the convex
function `1/((p+2)(p+3))` give

\[
 \boxed{
 -\int_1^\infty\mathfrak H Z'
 \ge {Z(1)\over\zeta(3)(\bar p+2)(\bar p+3)}.}
 \tag{33}
\]

This positive Mellin cone cannot contain a nonzero actual theta packet.  In
the logarithmic variable `y=log x`, (31) is a positive Laplace mixture
`int e^(-py)dmu(p)`.  A nonzero positive mixture is bounded below by one
exponential on some bounded `p` interval.  The actual packet instead decays
like a polynomial times `exp(-pi e^(2y))`, faster than every exponential.
Thus (33) is a rigorous route selector, not the missing theta proof.

There is nevertheless an exact signed-variation certificate.  On
`[k,k+1]`, put

\[
 S_0=\sum_{a\le k}J_2(a),
 \qquad
 S_1=\sum_{a\le k}{J_2(a)\over a}.
 \tag{34}
\]

Then

\[
 \mathfrak H(x)=S_1x^{-2}-S_0x^{-3},
 \qquad
 x_*={3S_0\over2S_1},
 \qquad
 \mathfrak H(x_*)={4S_1^3\over27S_0^2}.
 \tag{35}
\]

When `x_*` lies in `[k,k+1]`, it is the only interior critical point and is
the maximum in (35); otherwise both extrema occur at endpoints.  Let
`h_k,M_k` be the resulting exact minimum and maximum on the cell and

\[
 D_k=\int_k^{k+1}(-Z')_+,
 \qquad
 U_k=\int_k^{k+1}(Z')_+.
 \tag{36}
\]

Then

\[
 -\int_k^{k+1}\mathfrak H Z'\ge h_kD_k-M_kU_k.
 \tag{37}
\]

Combining (37) through `J-1` with the wave-29 tail estimate yields

\[
 -\int_1^\infty\mathfrak H Z'
 \ge
 \sum_{k<J}(h_kD_k-M_kU_k)
 +h_JZ(J)-(\tfrac16-h_J)V_{+,J},
 \tag{38}
\]

where `h_J=(1-J^(-2))/pi^2`.  The first cell already shows the limitation of
uncorrelated variation bounds:

\[
 h_1=0,
 \qquad
 M_1={4\over27}.
 \tag{39}
\]

Downward variation placed near `x=1` can earn arbitrarily little, whereas
upward variation near `x=3/2` incurs the full penalty.  The missing lemma must
control the placement/correlation of the actual `Z_n'`, not only its total
variation.

## 6. Remaining analytic target

The direct-head problem now has two exact equivalent coordinate systems and
one auxiliary threshold coordinate:

- the incomplete-Euler cross form (5)--(8);
- the fixed-prefix newest-moment inequality (28);
- the actual signed Jordan placement bound (38), which controls the
  wave-29 angle/threshold term rather than the direct head itself.

The last distinction is essential.  At a finite split, wave 29 gives

\[
 H_J(\mathcal M)-\Lambda[\mathcal R]
 =H_J(\mathcal P)-T_J(\mathcal R),
 \tag{40}
\]

not merely `H_J(mathcal P)`.  Thus (38) can help pay the threshold side of a
correlated proof, but it is not equivalent to direct-head positivity unless
the remainder in (40) is also controlled.

The self-dual counterexamples prove that no argument using only modularity,
domain safety, endpoint cancellation, or eventual cell signs can close the
first two routes.  The first Jordan cell separately proves that
magnitude-only total variation cannot close the auxiliary threshold route.
A successful next step must prove an actual complete-theta coefficient
inequality: for example a lower bound for `mu_(2m)` against the correlated
Gauss cost and Ewald tail, or an all-degree placement theorem for the signed
derivative packet in (38), together with the finite-split remainder.

The verifier checks the exact Hermite algebra, both first-head formulas and
their rigorous signs, the finite-Euler telescoping, the modular-kernel Taylor
coefficients, the Jordan divisor identity, the cell maximum, and illustrative
Gauss-cost cancellations.  Gaussian-quadrature exactness is an analytic
input, not something proved by the finite cases.  These exact checks audit
the formulas; they do not formalize the analytic Ewald/Fubini or
complete-theta inputs.
