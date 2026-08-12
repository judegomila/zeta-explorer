# Actual mixed-bridge pole row and resolvent-cancellation reduction

## 0. Outcome and claim boundary

Use the locked positive-at-origin prolate convention and the odd physical
sector.  Put

\[
 a=\log\lambda,\qquad p_\lambda(y)=\sinh(y/2),
 \qquad M_\lambda=\|p_\lambda\|_2^2
 ={\lambda-\lambda^{-1}\over2}-\log\lambda,             \tag{0.1}
\]

and let

\[
 b_\lambda=h_{2,\lambda}-{I_2\over I_0}h_{0,\lambda},
 \qquad
 w_\lambda=S_-C_\lambda{\cal E}b_\lambda              \tag{0.2}
\]

be the raw mixed bridge in the odd physical copy.  An invisible-origin
correction does not change (0.2) on the compact interval.  A shear by a
captured bulk vector changes this representative, but not its pairing with
a line missed by that bulk.

The actual finite bridge pole row has the asymptotic

\[
\boxed{
 \begin{aligned}
 \beta_\lambda
 :=\langle p_\lambda,w_\lambda\rangle
 ={}&2^{-5/4}\log\lambda
 -{2^{3/4}\over8}\{4+\gamma_E-\log(4\pi)\}
 +{2^{3/4}\over4\lambda}\\
 &-{15\,2^{-1/4}\over128\pi}
       {\log\lambda\over\lambda^2}
 +{2^{3/4}\over512\pi\lambda^2}
       \{68+15\gamma_E-15\log(4\pi)\}
 +O(\lambda^{-5/2}).
 \end{aligned}}                                        \tag{0.3}
\]

In particular, `beta_lambda>0` eventually.  This is an actual finite-source
statement, not merely a computation for the limiting Hermite bridge.  Its
starting threshold is qualitative because the frozen fixed-label
quasimode remainders are qualitative.

The limiting odd bridge profile itself is strictly positive on the positive
half-line.  If

\[
 b_\infty(x)=2^{3/4}(1-2\pi x^2)e^{-\pi x^2},
 \qquad K(u)=\sqrt u\sum_{n\geq1}b_\infty(nu),           \tag{0.4}
\]

then

\[
 \boxed{W_\infty(y):={K(e^y)-K(e^{-y})\over2}>0
        \quad(y>0).}                                    \tag{0.5}
\]

Neither (0.3) nor (0.5) proves a bottom-projector overlap.  Let the odd
loaded block be

\[
 Q_-=H_--2|p_\lambda\rangle\langle p_\lambda|,          \tag{0.6}
\]

and suppose its live eigenvalue `mu` is on the nonexceptional pole-created
branch below the spectrum of `H_-`.  The exact Feshbach formula below gives
a normalized ground `g_mu` and

\[
\boxed{
 |\langle g_\mu,w_\lambda\rangle|^2
 ={\left|\beta_\lambda/\sqrt{M_\lambda}
       -\langle B_\mu^{-1}r_\lambda,w_\lambda^\perp\rangle
   \right|^2
   \over 1+\|B_\mu^{-1}r_\lambda\|^2}.}               \tag{0.7}
\]

Here `r_lambda` is the centered nonpole pole residual and `B_mu` is the
strictly positive transverse compression of `H_--mu`.  The first term in
the numerator is explicit:

\[
 {\beta_\lambda\over\sqrt{M_\lambda}}
 =2^{-3/4}{\log\lambda\over\sqrt\lambda}{1+o(1)}.
                                                               \tag{0.8}
\]

The second term in (0.7) is an exact source-specific transverse resolvent
response.  No frozen estimate prevents it from cancelling (0.8), and no
frozen estimate gives a subexponential upper bound for the denominator in
the normalization needed by the final overlap criterion.

This is not a merely generic cone caveat.  Every reflected prime atom gives
a positive off-diagonal atom in the odd fold.  It produces explicit
nonnegative bump pairs for which a sufficiently far below-spectrum odd
resolvent has a negative cross entry.  Thus the literal nonpole odd
resolvent family is not inverse-positive, totally positive,
variation-diminishing, or governed by a positive monotone folded kernel.
The one-vector response in (0.7) must be estimated arithmetically.

No lower bound for (0.7), no bottom-projector floor, no new zero statement,
and no Riemann-hypothesis conclusion is proved.  The standard eight are
untouched and the formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs

No external source or zero table is used.  The exact repository inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md` | `d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771` |
| `notes/MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md` | `4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2` |
| `notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md` | `703c19f9cbadd73e6b60672a6f836fc2bd0bf7d43eaa5f60ac5806dd1cdc0d18` |
| `notes/POSITIVITY_IMPROVING_SOURCE_GROUND_OBSTRUCTION.md` | `5cd474c382c25dd3fd02d0e77bc3287dd69dda9ff23ab47c10aacfbf8491bf31` |

The first two notes supply the fixed label-zero and label-two prolate
quasimodes, their origin values, and the arithmetic `L2` transfer.  The
Xi-over-s note supplies the limiting bridge and its Mellin factor.  The
odd-pole note supplies the exact pole convention and identifies the
centered nonpole pole residual as an arithmetic object.  The positivity
note supplies the exact reflected-prime sign in the odd fold.

## 2. Actual fixed-label bridge expansion

Let `h_0,h_2,h_4,h_6` be the unit Hermite functions in the locked phases,
so

\[
 h_0(0)=2^{1/4},\qquad h_2(0)=2^{-1/4},\qquad
 {h_2(0)\over h_0(0)}=r=2^{-1/2}.                     \tag{2.1}
\]

The frozen quasimode theorems give, after zero extension,

\[
 h_{0,\lambda}=h_0+\lambda^{-2}u_0+O_{L^2}(\lambda^{-4}),
 \qquad u_0=-{\sqrt6\over32\pi}h_4,                  \tag{2.2}
\]

\[
 h_{2,\lambda}=h_2+\lambda^{-2}u_2+O_{L^2}(\lambda^{-4}),
 \qquad u_2=-{3\sqrt{10}\over32\pi}h_6.             \tag{2.3}
\]

The same expansions hold at zero.  In these phases

\[
 I_0=\chi_0h_{0,\lambda}(0),\qquad
 I_2=-\chi_2h_{2,\lambda}(0),                         \tag{2.4}
\]

and the fixed-label concentration defects make `chi_2/chi_0-1` smaller
than every algebraic power.  Since

\[
 {u_0(0)\over h_0(0)}=-{3\over64\pi},\qquad
 {u_2(0)\over h_2(0)}=-{15\over64\pi},                \tag{2.5}
\]

division in (2.4) gives

\[
 {I_2\over I_0}
 =-r+{3r\over16\pi}\lambda^{-2}+O(\lambda^{-4}).      \tag{2.6}
\]

Substitution in (0.2) proves

\[
 \boxed{b_\lambda=b_\infty+\lambda^{-2}b_1
                +O_{L^2}(\lambda^{-4}),}              \tag{2.7}
\]

where

\[
 b_\infty=h_2+rh_0
 =2^{3/4}(1-2\pi x^2)e^{-\pi x^2},                    \tag{2.8}
\]

\[
 b_1=u_2+ru_0-{3r\over16\pi}h_0,\qquad
 b_1(0)=-{15\,2^{-1/4}\over32\pi}.                   \tag{2.9}
\]

Both `b_infty` and `b_1` have zero integral.  For `b_1`, this follows
directly from the Fourier phases and (2.5); it also follows by comparing
the exact zero integral of `b_lambda` in (2.7).

Let

\[
 W_1=S_-{\cal E}b_1.
\]

The elementary arithmetic transfer loses one power of `lambda`.  Thus

\[
 \boxed{
 \|w_\lambda-W_\infty-\lambda^{-2}W_1\|_
 {L^2(-a,a)}=O(\lambda^{-3}).}                         \tag{2.10}
\]

Since `||p_lambda||=O(sqrt(lambda))`, the contribution of the remainder in
(2.10) to the pole row is `O(lambda^(-5/2))`.

## 3. Strict sign of the limiting odd bridge

Put

\[
 \Theta(u)=\sum_{n\in\mathbb Z}e^{-\pi n^2u^2},
 \qquad c=2^{3/4}.                                    \tag{3.1}
\]

Direct summation gives

\[
 K(u)={c\sqrt u\over2}\{\Theta(u)+u\Theta'(u)-1\}.   \tag{3.2}
\]

Jacobi inversion `Theta(u)=u^(-1)Theta(1/u)` gives

\[
 K(1/u)={c\over2}\{-u^{3/2}\Theta'(u)-u^{-1/2}\}.    \tag{3.3}
\]

Consequently, for `u>=1`,

\[
 W_\infty(\log u)={c\over4\sqrt u}B(u),
 \qquad
 B(u)=1+u\{\Theta(u)-1\}+2u^2\Theta'(u).             \tag{3.4}
\]

Differentiating Jacobi inversion at one gives
`Theta'(1)=-Theta(1)/2`, hence `B(1)=0`.  Termwise
differentiation is absolutely convergent and yields

\[
 B'(u)=2\sum_{n\geq1}e^{-A_n(u)}
       \{1-14A_n(u)+8A_n(u)^2\},
 \qquad A_n(u)=\pi n^2u^2.                            \tag{3.5}
\]

The larger root of `8A^2-14A+1` is
`(7+sqrt(41))/8`, which is smaller than `pi`.  Every summand in
(3.5) is therefore positive for `u>=1`.  This proves (0.5).

This pointwise theorem is not stable under the available actual-source
comparison: (2.10) is an `L2` estimate on a growing interval, while
`W_infty(y)` tends to zero as `y` tends to either zero or positive
infinity.  Thus (2.10) proves the pole-row statement below, but no
finite-`lambda` pointwise sign.

## 4. Exact limiting row and transfer to the actual bridge

The limiting Mellin identity is

\[
 Z(s):=\int_{\mathbb R}K(e^y)e^{(s-1/2)y}\,dy
 =\zeta(s)B_\infty(s)=-c{\xi(s)\over s}.              \tag{4.1}
\]

It gives

\[
 Z(1)=-{c\over2},\qquad
 Z(s)=-{c\over2s}-c\xi'(0)+O(s)\quad(s\longrightarrow0). \tag{4.2}
\]

Poisson summation also gives the two endpoint expansions

\[
 K(e^y)=-{c\over2}e^{y/2}
  +O\!\left(e^{-5y/2}e^{-\pi e^{-2y}}\right)
       \quad(y\longrightarrow-\infty),                \tag{4.3}
\]

\[
 K(e^y)=O\!\left(e^{5y/2}e^{-\pi e^{2y}}\right)
       \quad(y\longrightarrow+\infty).                \tag{4.4}
\]

Because `p_lambda` is odd,

\[
 \langle p_\lambda,W_\infty\rangle_{[-a,a]}
 =\int_{-a}^a\sinh(y/2)K(e^y)\,dy.                    \tag{4.5}
\]

Equations (4.1)--(4.4) identify the finite part at `s=0` and give

\[
 \begin{aligned}
 \langle p_\lambda,W_\infty\rangle
 ={}&{c\over4}a-{c\over4}+{c\over2}\xi'(0)
       +{c\over4}e^{-a}
       +O\!\left(\lambda^3e^{-\pi\lambda^2}\right)\\
 ={}&{c\over4}\log\lambda
 -{c\over8}\{4+\gamma_E-\log(4\pi)\}
 +{c\over4\lambda}
 +O\!\left(\lambda^3e^{-\pi\lambda^2}\right).
 \end{aligned}                                                \tag{4.6}
\]

For any fixed even polynomial--Gaussian source `f` with zero integral,
the same Poisson argument gives

\[
 \langle p_\lambda,S_-{\cal E}f\rangle_{[-a,a]}
 ={f(0)\over4}\log\lambda+O_f(1).                    \tag{4.7}
\]

For the explicit first correction in (2.9), direct Hermite integration
gives

\[
 {\cal M}_1(s):=\int_0^\infty b_1(x)x^{s-1}\,dx
 ={2^{3/4}\over32\pi}(s-1)
 \left(s^2-s+{15\over4}\right)
 \pi^{-s/2}\Gamma(s/2).                              \tag{4.7a}
\]

Consequently

\[
 Z_1(s):=\zeta(s){\cal M}_1(s)
 ={2^{3/4}\over16\pi}
 \left(s^2-s+{15\over4}\right){\xi(s)\over s}.       \tag{4.7b}
\]

Its value at one and finite part at zero are

\[
 Z_1(1)={15\,2^{3/4}\over128\pi},\qquad
 \operatorname {FP}_{s=0}Z_1(s)
 ={2^{3/4}\over16\pi}
 \left\{{15\over4}\xi'(0)-{1\over2}\right\}.       \tag{4.7c}
\]

The same finite-part calculation as (4.6) now gives

\[
 \langle p_\lambda,W_1\rangle
 =-{15\,2^{-1/4}\over128\pi}\log\lambda
 +{2^{3/4}\over512\pi}
       \{68+15\gamma_E-15\log(4\pi)\}
 +O(\lambda^{-1}).                                    \tag{4.7d}
\]

Insert (4.6) and (4.7d) into (2.10).  The paired remainder is
`O(lambda^(-5/2))`, which proves (0.3), including its sign.

There is also an exact finite-source formula, useful independently of the
asymptotic.  With `H_m=sum_(j=1)^m 1/j`,

\[
 \boxed{
 \beta_\lambda={1\over2}\int_{1/\lambda}^{\lambda}
 b_\lambda(v)
 \left\{H_{\lfloor\lambda v\rfloor}
       -{\lfloor\lambda v\rfloor\over v}\right\}\,dv.} \tag{4.8}
\]

The inclusive upper arithmetic index is retained.  Formula (4.8) follows
by substituting the bridge into the frozen unprojected pole cross Gram.

## 5. Exact pole-axis Feshbach identity

Let `H=H_-` and suppose

\[
 \mu<\lambda_{\min}(H),\qquad
 1-2\langle p_\lambda,(H-\mu I)^{-1}p_\lambda\rangle=0. \tag{5.1}
\]

The second equality is the Birman--Schwinger equation for the
nonexceptional pole-created eigenvalue of (0.6).  Put

\[
 e={p_\lambda\over\sqrt M},\qquad P_\perp=I-|e\rangle\langle e|,
 \qquad M=M_\lambda,                                  \tag{5.2}
\]

\[
 A=\langle e,(H-\mu I)e\rangle,qquad
 r=P_\perp He,\qquad
 B=P_\perp(H-\mu I)P_\perp|_{e^\perp}.               \tag{5.3}
\]

Then `B>0` and

\[
 H-\mu I=
 \begin{bmatrix}A&r^*\\r&B\end{bmatrix}.             \tag{5.4}
\]

Its scalar Schur complement is

\[
 s=A-r^*B^{-1}r.                                      \tag{5.5}
\]

Block inversion gives

\[
 (H-\mu I)^{-1}p_\lambda
 ={\sqrt M\over s}\{e-B^{-1}r\}.                     \tag{5.6}
\]

Equation (5.1) is exactly `s=2M`.  Therefore the normalized loaded ground
is, up to its global phase,

\[
 \boxed{g_\mu={e-B^{-1}r\over\sqrt{1+\|B^{-1}r\|^2}}.} \tag{5.7}
\]

Decompose the raw bridge as

\[
 w_\lambda={\beta_\lambda\over\sqrt M}e+w_\lambda^\perp.
                                                               \tag{5.8}
\]

Taking its pairing with (5.7) proves (0.7).  Equivalently, the unnormalized
cross resolvent is

\[
 \boxed{
 \langle(H-\mu I)^{-1}p_\lambda,w_\lambda\rangle
 ={\beta_\lambda\over2M}
 -{1\over2\sqrt M}\langle B^{-1}r,w_\lambda^\perp\rangle.} \tag{5.9}
\]

The vector `r` is precisely the normalized centered nonpole pole residual:

\[
 r={1\over\sqrt M}
 P_\perp H p_\lambda.                                 \tag{5.10}
\]

Thus the unresolved scalar in (0.7) is not a free abstract orientation.  It
is the actual mixed response of the centered pole residual against the
transverse bridge through the actual nonpole inverse.

A shear `w_lambda -> w_lambda-T_Ff` by a captured bulk vector missed by
`g_mu` leaves the left side of (0.7) unchanged.  In the right side it changes
the explicit pole row and transverse response by exactly compensating
amounts.  One may therefore use the raw representative for (0.3), but may
not discard the second term in (0.7).

## 6. Why the literal nonpole resolvent has no sign theorem

On the positive half-interval, an actual source prime atom of weight
`omega_n=Lambda(n)/sqrt(n)` folds in the odd sector as

\[
 -\omega_n\delta_{|x-y|=\log n}
 +\omega_n\delta_{x+y=\log n}.                        \tag{6.1}
\]

For `lambda>sqrt(2)`, choose positive centers `x_0,y_0` with
`x_0+y_0=log(2)` and with `|x_0-y_0|` different from every prime-power
logarithm.  Nonnegative disjoint smooth bumps `f_epsilon,g_epsilon` of
width `epsilon` at these centers satisfy

\[
 \langle f_\epsilon,H_-g_\epsilon\rangle
 =c_2\epsilon+O(\epsilon^2)>0                         \tag{6.2}
\]

for all sufficiently small `epsilon`; the reflected atom supplies the
linear term and the continuous kernel supplies only the quadratic term.

For domain bumps with disjoint supports, the resolvent identity and strong
convergence `alpha(H_-+alpha I)^(-1)->I` give

\[
 \alpha^2\langle f_\epsilon,
       (H_-+\alpha I)^{-1}g_\epsilon\rangle
 \longrightarrow-\langle f_\epsilon,H_-g_\epsilon\rangle<0
 \quad(\alpha\longrightarrow\infty).                 \tag{6.3}
\]

Thus even below the spectrum the odd resolvent family is not
positivity-preserving.  In particular no total-positivity,
variation-diminishing, or monotone-positive-kernel theorem can turn the two
positive limiting profiles `p_lambda` and `W_infty` into a sign for (5.9).

Equations (0.3) and (0.8) show that the explicit first term in (0.7) is
already at the desired subexponential scale.  The exact remaining
obligations are

\[
 \left|{\beta_\lambda\over\sqrt M}
 -\langle B^{-1}r,w_\lambda^\perp\rangle\right|
 \geq e^{-o(\lambda^2)},
 \qquad
 \|B^{-1}r\|\leq e^{o(\lambda^2)}.                   \tag{6.4}
\]

Neither inequality follows from the pole row.  Proving (6.4), or a stronger
one-sided source-specific version, is the exact next mathematical task.
