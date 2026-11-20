# Orbit-score payment: exact ordering and the modular-center compensation

## Scope and outcome

This note continues the joint orbit-score target in
`NEWEST_BELL_ARITHMETIC_NEXT.md`.  It uses the actual positive Jacobi orbit
weights throughout; no theta-index truncation or surrogate orbit packet is
introduced.

There are two rigorous outcomes.

1. The exact Jacobi orbit law is strictly monotone-likelihood-ratio ordered
   in the orbit index.  Consequently every increasing orbit observable has
   strictly negative covariance with the score.
2. At the modular center, the first nontrivial covariant score is strictly
   increasing in the orbit index, while the score is strictly decreasing.
   Modular evenness forces its negative covariance to be canceled *exactly*
   by a positive mean score-drift.  This gives an all-orbit positive pair
   representation, but it also supplies a sharp obstruction: the covariance
   recursion is not a one-sided Fisher-information payment.

For each fixed `h`, the anti-association persists on a sufficiently high
orbit tail at every even degree; the tail threshold is not asserted uniform
in `h`.  If

\[
 A_s=\mathscr T^{s-1}\sigma,
\]

then `A_(2j)` is eventually strictly increasing in the orbit index, whereas
`sigma` is strictly decreasing.  In particular, the top observable
`A_(2k+4)=mathscr T^(2k+3)sigma` in the newest Bell coefficient has a
strictly negative tail--tail covariance with the score.  This does not sign
the full covariance, which also has head--tail pairs.  Modular symmetry
kills the center average of `A_(2j+1)`, not the required even average
`A_(2j)`.

Thus score ordering plus modular-center cancellation does not prove the
joint payment.  It identifies the missing source-specific statement more
sharply: a successful argument has to combine score drift, score covariance,
the lower Bell polynomial, and the old regression cost before taking a
sign.  The ordering and center identities proved here do not turn any one of
those pieces into a separate signed envelope; any successful use of them has
to retain the joint assembly.

Nothing below proves the joint payment, an all-degree endpoint sign, or RH.

## 1. Exact orbit law and the payment observable

For `h>=0`, write

\[
 z_n=\pi n^2e^{2h},\qquad d_n=2z_n-3,
\]

\[
 \phi_n=4z_n(2z_n-3)e^{h/2-z_n},\qquad
 p_n={\phi_n\over\psi},\qquad \psi=\sum_{n\geq1}\phi_n.
 \tag{1}
\]

All `p_n` are strictly positive and sum to one.  The exact score from
`NEWEST_BELL_ARITHMETIC_NEXT.md` has the useful normal form

\[
 \boxed{
 \sigma_n={5\over2}+{4z_n\over2z_n-3}-2z_n
 ={3\over2}-d_n+{6\over d_n}.}
 \tag{2}
\]

Let `mu=E_h[sigma]` and

\[
 (\mathscr T A)_n=A_n'+(\sigma_n-\mu)A_n,
 \qquad A_s=\mathscr T^{s-1}\sigma\quad(s\geq1).
 \tag{3}
\]

Here every prime is the total `h` derivative, including the derivatives of
`mu` and of all lower expectations already present in `A`.  With
`ell=log psi`, the exact score recursion is

\[
 \boxed{E_h[A_s]=\ell^{(s)}(h).}
 \tag{4}
\]

For `j=k+2`, the top score in the newest Bell coefficient is

\[
 A_{2j}=A_{2k+4}=\mathscr T^{2k+3}\sigma.
 \tag{5}
\]

If

\[
 \mathfrak J_j(h)=2E_h[A_{2j}]+\mathcal P_j(h),
 \tag{6}
\]

where `mathcal P_j` is the complete Bell polynomial with its final argument
removed, the exact outstanding inequality is

\[
 {2(-1)^j\over4^j}\int_0^\infty h^2\psi(h)^2
       \mathfrak J_j(h)\,dh
 \ \geq\ {m_{j-1}^2\over m_{j-2}}+\eta^*P^\dagger\eta.
 \tag{7}
\]

Equation (7) is recorded only to fix what must remain assembled.  Its
difference is the already isolated next Schur pivot, so (7) is a target and
not an input below.

## 2. Strict Jacobi monotone-likelihood-ratio ordering

Differentiating (2) with respect to `d` gives

\[
 {\partial\sigma\over\partial d}=-1-{6\over d^2}<0.
 \tag{8}
\]

Since `d_n` is strictly increasing in `n`,

\[
 \boxed{\sigma_1(h)>\sigma_2(h)>\sigma_3(h)>\cdots}
 \qquad(h\geq0).
 \tag{9}
\]

Equivalently, for `m>n`,

\[
 {d\over dh}\log{p_m(h)\over p_n(h)}
 =\sigma_m(h)-\sigma_n(h)<0.
 \tag{10}
\]

Thus the complete positive-orbit family is strictly
monotone-likelihood-ratio ordered as `h` increases.

For any two square-integrable orbit observables, the covariance has the
division-free pair form

\[
 \operatorname{Cov}_h(F,G)
 ={1\over2}\sum_{n,m\geq1}p_np_m
       (F_n-F_m)(G_n-G_m).
 \tag{11}
\]

Therefore, if `F_n` is nondecreasing in `n`, then

\[
 \boxed{\operatorname{Cov}_h(F,\sigma)\leq0,}
 \tag{12}
\]

with strict inequality whenever `F` is nonconstant.  Absolute convergence
is automatic for all covariant scores used here: the weights have Gaussian
decay in `n`, while every fixed covariant iterate has only polynomial growth
in `z_n`.

This is a genuine source-specific sign supplied by the exact orbit weights.
Its orientation is important: increasing orbit observables are
*anti-associated* with the score.

## 3. An exact modular-center compensation lemma

At `h=0`, modular evenness of `psi` gives

\[
 \mu(0)=\ell'(0)=0.
 \tag{13}
\]

Put `d=d_n(0)=2\pi n^2-3`.  Since

\[
 {d d\over dh}=2(d+3),
\]

the first covariant score at the center is

\[
\begin{aligned}
 A_2
 &=\sigma'+\sigma^2\\
 &=2(d+3)\partial_d\left({3\over2}-d+{6\over d}\right)
   +\left({3\over2}-d+{6\over d}\right)^2\\
 &=\boxed{d^2-5d-{63\over4}+{6\over d}.}
\end{aligned}
\tag{14}
\]

Every orbit lies in `d>3`, because `pi>3`.  On this domain,

\[
 {dA_2\over dd}=2d-5-{6\over d^2}
 >1-{2\over3}>0.
 \tag{15}
\]

Hence `A_2` is strictly increasing in the orbit index at the actual modular
center.  The sign split is also exact.  Using `3<pi<22/7` gives

\[
 3<d_1<{23\over7}<4,
 \]

and therefore, by (15),

\[
 A_{2,1}<A_2(4)=-{73\over4}<0.
 \tag{16}
\]

For `n>=2`, one has `d_n>21`, and (14) gives `A_{2,n}>0`.  The raw score has
the opposite sign split.  Indeed, for positive `d`, `sigma(d)>0` is
equivalent to

\[
 2d^2-3d-12<0.
\]

The left side is increasing for `d>3/4` and has value `-13/49` at `23/7`,
so `sigma_1(0)>0`; while `d_n>21` makes `sigma_n(0)<0` for every `n>=2`.
Thus the identity `E_0[sigma]=0` is itself an exact cancellation of the
positive first orbit by the infinite negative tail.

The next odd log derivative also vanishes by modular evenness:

\[
 E_0[A_3]=\ell'''(0)=0.
 \tag{17}
\]

Apply the expectation recursion once to `A_2`.  Equations (3), (13), and
(17) give

\[
 0=E_0[A_2']+\operatorname{Cov}_0(A_2,\sigma).
 \tag{18}
\]

Now (9), (12), and (15) make the covariance strictly negative.  Consequently

\[
 \boxed{
 E_0[A_2']=-\operatorname{Cov}_0(A_2,\sigma)
 =\sum_{1\leq n<m}p_n(0)p_m(0)
   (A_{2,m}-A_{2,n})(\sigma_n-\sigma_m)>0.}
 \tag{19}
\]

This is an exact all-orbit positive representation.  It is not obtained by
retaining finitely many theta indices: every positive orbit weight and the
entire modular tail occur in (19).

Equation (19) is also the sharp obstruction to treating the score covariance
as a free Fisher-information gain.  At the center the covariance has the
wrong sign for such a gain, and modular coupling cancels it by an equal,
oppositely signed mean drift.  Dropping either term destroys the exact zero
in (17).

More generally, modular evenness gives the all-degree center identities

\[
 \boxed{E_0[A_{2r+1}]=\ell^{(2r+1)}(0)=0\qquad(r\geq0),}
 \tag{20}
\]

but it gives no sign to

\[
 E_0[A_{2r}]=\ell^{(2r)}(0),                       \tag{21}
\]

which is the parity required by the top Bell score in (5).

## 4. The all-degree tail orientation

The center calculation is not an accident of the first score level.  For
each fixed `h>=0` and fixed `s>=1`, the exact covariant scores satisfy

\[
 \boxed{
 \begin{aligned}
 A_s(n,h)&=(-2)^s z_n^s+O_{s,h}(z_n^{s-1}),\\
 \partial_zA_s(n,h)&=s(-2)^s z_n^{s-1}
                       +O_{s,h}(z_n^{s-2})
 \end{aligned}}
 \qquad(n\longrightarrow\infty).
 \tag{22}
\]

To prove (22), note first that `sigma=-2z+O(1)`.  If

\[
 A_s=(-2)^sz^s+O(z^{s-1}),
\]

then total `h` differentiation contributes only `O(z^s)`, whereas

\[
 (\sigma-\mu)A_s
 =-2(-2)^sz^{s+1}+O(z^s).
\]

Thus `A_(s+1)=(-2)^(s+1)z^(s+1)+O(z^s)`, proving the claim by induction.
All derivatives of `mu` which enter the total derivative are finite
`h`-dependent coefficients and hence do not alter the leading power.
At fixed `h`, every `A_s` is a rational function of `z`, with poles confined
to `2z-3=0`, and coefficients formed from finitely many derivatives of
`mu`.  Its asymptotic expansion can therefore be differentiated term by
term, proving the second line of (22).

For every even `s`, (22) implies that `A_s` is positive and strictly
increasing in `n` on a sufficiently high infinite orbit tail.  Since the
score is strictly decreasing on the entire orbit set, there is an
`N=N(s,h)` for which

\[
 \boxed{
 \sum_{N\leq n<m}p_np_m
 (A_{s,m}-A_{s,n})(\sigma_m-\sigma_n)<0.}
 \tag{23}
\]

This is the tail--tail contribution to the full covariance, not a finite
packet approximation.  In particular, it applies to the top payment
observable `s=2k+4` for every `k` in (5).

The exact transport identity for that even score is

\[
\begin{aligned}
 E_h[A_{2j}]
 &=E_0[A_{2j}]
   +\int_0^h E_u[A_{2j+1}]\,du\\
 &=E_0[A_{2j}]
   +\int_0^h\left\{E_u[A_{2j}']
          +\operatorname{Cov}_u(A_{2j},\sigma)\right\}du.
\end{aligned}
\tag{24}
\]

This is a noncircular center-anchored reduction of the top score.  It also
shows why monotone-likelihood-ratio ordering alone cannot sign it.  The
covariance has a negative tail orientation, the drift has no independent
sign, and at the modular center their *complete* averages cancel because
the integrand in (24) equals `ell^(2j+1)(0)=0`.  For `j=1`, (19) proves that
the cancellation is between two nonzero terms of strict opposite sign.

## 5. Consequence for the joint payment

The lower Bell polynomial in (6) is not optional.  Neither is the old
regression cost on the right side of (7).  The facts proved above rule out
the following proposed shortcuts.

- **Positive-score-covariance shortcut.**  The exact likelihood-ratio order
  gives the opposite covariance sign for the even top score on every high
  orbit tail, and gives a strict negative covariance already for `A_2` at
  the modular center.
- **Drift deletion.**  Equation (19) shows that score drift cancels the
  covariance exactly at the center.  Keeping only the covariance changes an
  exact Jacobi identity into a false one-sided payment.
- **Odd-jet modular shortcut.**  Modular symmetry proves (20), whereas the
  newest Bell coefficient contains the even score (21).  The center
  cancellation therefore does not sign the required datum.
- **Tail-sign shortcut.**  The leading tail in (22) is positive for the
  even top score, but the Bell prefactor alternates with `j`, the lower Bell
  terms remain of the same assembled order, and the old regression cost is
  global.  A tail sign cannot be substituted into (7).

The surviving analytic route is correspondingly specific.  One needs a
Jacobi identity or inequality for the *joint* quantity

\[
 2E_h[A_{2j}]+\mathcal P_j(h)
\]

which retains the drift--covariance compensation in (24), and that quantity
must be assembled with `m_(j-1)^2/m_(j-2)+eta^*P^dagger eta` before a sign is
taken.  Equation (19) shows the shape such a mechanism can have: an infinite
positive orbit-pair form emerges only after two oppositely signed score
terms are combined.  Extending that pair form to the complete Bell
contraction and the old regression residual is the unresolved lemma.

## Self-audit and nonclaims

- Rewriting (2) uses `4z/(2z-3)=2+6/(2z-3)` and
  `2z=d+3`.
- The factor in (14) uses `d'=4z=2(d+3)`; expanding
  `sigma'+sigma^2` cancels the `d^(-2)` terms and leaves exactly
  `d^2-5d-63/4+6/d`.
- The covariance factor in (19) was checked from the symmetric double sum
  (11): each unordered pair occurs once after the factor `1/2`.
- The index in the target was checked as
  `T^(2k+3)sigma=A_(2k+4)=A_(2j)` for `j=k+2`.
- The asymptotic induction in (22) treats every derivative of `mu` as a
  finite coefficient at fixed `h`; none can create the next power
  `z^(s+1)`.
- All sums used in the proof are infinite complete-orbit sums and converge
  absolutely.  No finite orbit computation, degree experiment, or numerical
  sign check is used.

The proved statements are the likelihood-ratio order, the center
compensation formula (19), and the tail orientation (22)--(23).  They do not
establish (7), do not assert positivity of any unproved next pivot, and do
not imply RH.
