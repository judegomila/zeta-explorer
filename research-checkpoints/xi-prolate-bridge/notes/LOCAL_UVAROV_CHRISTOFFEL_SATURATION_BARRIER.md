# Local multi-Uvarov Christoffel saturation barrier

## 0. Exact outcome and claim boundary

Checkpoint 1.38 proves, for the positive auxiliary zero functional, that a
fixed transformed zero atom of weight `alpha_j` satisfies

\[
 \alpha_j\leq\lambda_0(s_{j,L})
 \leq\alpha_j\{1+O_j(L^{-2})\},
 \qquad
 {\mu a_{n_j}\over\alpha_j}
 ={\mu\over m_jL}\{1+o(1)\}.                    \tag{0.1}
\]

Here `lambda_0` is the degree-`N-1` Christoffel function and `a_(n_j)` is
the nearest lattice mass.  These are strong one-point statements.  This
note proves that they do not, by themselves, localize all the Gaussian
nodes of the negative multi-Uvarov perturbation

\[
 \mathfrak L_\mu=\mathfrak L_0-
       \sum_{i=1}^Nc_i\delta_{x_i},
 \qquad c_i=\mu a_i>0.                            \tag{0.2}
\]

The exact Woodbury and Uvarov formulas contain the global inverse
`(I-C^(1/2)K_X C^(1/2))^(-1)`.  A local leverage estimate does not bound
that inverse on the other `N-1` lattice directions.

More sharply, for every finite lattice and every target site there is a
positive truncated functional with all of the following properties:

1. both its unshifted and shifted moment and positive localizing Grams are
   positive definite;
2. the unshifted functional has exactly one Gaussian node in a chosen
   target neighborhood;
3. that node is an atom of an `N`-atom positive representation, so its
   Christoffel function equals its atom weight exactly;
4. its nearest removed lattice mass can have the checkpoint-1.38 ratio
   `mu/(m_j*L)*(1+o(1))`; and
5. after the multi-Uvarov subtraction there are two Gaussian nodes in the
   same target neighborhood, while both global relative reserves tend to
   zero.

Thus fixed-atom Christoffel saturation cannot replace a global Woodbury
reserve, endpoint-pencil inertia estimate, or an equally strong
arithmetic statement.  The construction is a structural truncated-moment
family.  It is not the actual transformed zeta-zero functional, does not
obey the actual zero distribution, and proves no actual shifted-node
failure.  No statement here proves RH, a converse, a zeta-zero theorem, a
prolate response bound, or a de Bruijn--Newman `Lambda` bound.  The
checkpoint-1.38 standard eight are unchanged and the project state remains
`P0_INVALIDATED`.

## 1. Frozen input

Only the immediately preceding theorem pair is imported.

| Dependency | SHA-256 |
|---|---|
| `notes/RH_ZERO_GAUSSIAN_SQUARE_FREE_LIMIT_THEOREM.md` | `6622d6ee81f08daef596850ecd4dfbb071c5a2a087e083ee5f68a5bc1b211742` |
| `tests/test_rh_zero_gaussian_square_free_limit_theorem.py` | `680c2ad7ebef01683b218d4f2e4693047d01a0452346fe89b8277f7bd31c84fb` |

Checkpoint 1.38 supplies (0.1), the exact lattice masses, the positive
`mu=0` node theorem, and the distinction between the auxiliary zero
functional and the genuine shifted functional.  No zero table, numerical
artifact, external paper, or new arithmetic estimate is imported.

## 2. Exact multi-Uvarov formulas

Let

\[
 v(y)=(1,y,\ldots,y^{N-1})^T,
 \qquad
 V=(v(x_1)\ \cdots\ v(x_N)),
 \qquad C=\operatorname {diag}(c_1,\ldots,c_N).   \tag{2.1}
\]

For a positive definite moment Gram `M_0`, put

\[
 K_0(y,z)=v(y)^TM_0^{-1}v(z),
 \quad K_X=V^TM_0^{-1}V,
 \quad B=C^{1/2}K_XC^{1/2}.                       \tag{2.2}
\]

The shifted moment Gram is

\[
 M_\mu=M_0-VCV^T.                                \tag{2.3}
\]

Because the lattice points are distinct, `V` is invertible.  Congruence
and the equality of the nonzero spectra of `WW^T` and `W^TW` give

\[
 \boxed{M_\mu>0\quad\Longleftrightarrow\quad I-B>0.} \tag{2.4}
\]

Woodbury, with all matrix orientations displayed, gives

\[
 \boxed{
 K_\mu(y,z)=K_0(y,z)+K_0(y,X)C^{1/2}(I-B)^{-1}
                   C^{1/2}K_0(X,z).}              \tag{2.5}
\]

Let `P_0` and `P_mu` be the monic degree-`N` polynomials orthogonal to
degrees below `N` for the two functionals.  No degree-`2N` norm is used.
Reproduction of `P_mu-P_0` and evaluation on the lattice give

\[
 P_\mu(y)=P_0(y)+K_0(y,X)C P_\mu(X),
 \qquad
 (I-K_XC)P_\mu(X)=P_0(X).                         \tag{2.6}
\]

Consequently

\[
 \boxed{
 P_\mu(y)=P_0(y)+K_0(y,X)C^{1/2}(I-B)^{-1}
                    C^{1/2}P_0(X).}               \tag{2.7}
\]

The plus sign is the sign for subtraction of positive masses.  Equations
(2.5) and (2.7) show why a one-point argument stops.  If a support atom at
`s` has weight `alpha`, then

\[
 \alpha\leq\lambda_0(s)\leq\alpha(1+\varepsilon)
 \quad\Longleftrightarrow\quad
 {1\over1+\varepsilon}\leq
       \alpha K_0(s,s)\leq1.                     \tag{2.8}
\]

Even if `x_n=s`, the local removed term obeys
`c_n*K_0(s,s)<=c_n/alpha`.  Neither (2.8) nor the smallness of this
diagonal term bounds `(I-B)^(-1)` on a remote almost-null direction.

## 3. An all-lattice-site nonimplication family

Fix distinct positive lattice sites

\[
 0<x_1<\cdots<x_N,\qquad N\geq2.                 \tag{3.1}
\]

Choose a target index `n`, a different remote index `r`, and an interval
`I` containing `x_n` but no other `x_i`.  Choose
`t in I` distinct from `x_n`, positive weights `A_i` for every `i!=r`,
positive lattice masses `c_i`, and `beta>0`.  Define

\[
 \rho_\beta=A_n\delta_{x_n}+\beta\delta_t
       +\sum_{i\ne n,r}A_i\delta_{x_i},
 \qquad
 U_\beta=\rho_\beta+\sum_{i=1}^Nc_i\delta_{x_i}. \tag{3.2}
\]

The first display has exactly `N` distinct positive atoms: `t` and every
lattice site except `x_r`.  At `beta=0`, the second display has exactly the
`N` lattice atoms, with weights

\[
 W_i=A_i+c_i\quad(i\ne r),
 \qquad W_r=c_r.                                  \tag{3.3}
\]

Hence the `N` Gaussian nodes of `U_0` are exactly the `x_i`, and they are
simple.  The moment and localizing pencils depend continuously on `beta`.
For all sufficiently small positive `beta`, their Gaussian nodes and
weights can therefore be ordered so that

\[
 s_i(\beta)\longrightarrow x_i,
 \qquad
 \alpha_i(\beta)\longrightarrow W_i.             \tag{3.4}
\]

Let

\[
 \nu_{0,\beta}=\sum_{i=1}^N
             \alpha_i(\beta)\delta_{s_i(\beta)}  \tag{3.5}
\]

be the `N`-node Gaussian representation of `U_beta`.  It agrees with
`U_beta` on every polynomial of degree at most `2N-1`.  Define the
truncated functionals by `mathfrak L_0=nu_(0,beta)` and

\[
 \mathfrak L_\mu=\mathfrak L_0-
                \sum_{i=1}^Nc_i\delta_{x_i}.     \tag{3.6}
\]

On the full available degree range, (3.2), (3.5), and (3.6) give

\[
 \boxed{
 \mathfrak L_\mu[f]=\rho_\beta[f],
 \qquad \deg f\leq2N-1.}                         \tag{3.7}
\]

All support points in (3.2) are positive.  Therefore the moment and
positive localizing Grams of both `mathfrak L_0` and `mathfrak L_mu` are
positive definite.  For small `beta`, (3.4) puts exactly one unshifted
node `s_n(beta)` in `I`.  In contrast, (3.7) says that the shifted Gaussian
nodes are the support of `rho_beta`, so both `x_n` and `t` lie in `I`.
This is exact two-node intrusion, not merely a parity ambiguity.

There is exact target saturation.  The Lagrange polynomial for
`s_n(beta)` in the `N`-atom measure (3.5) isolates that atom.  The atom
lower bound and this competitor give

\[
 \boxed{
 \lambda_0(s_n(\beta))=\alpha_n(\beta).}          \tag{3.8}
\]

Thus the construction satisfies a stronger statement than the relative
`O(L^(-2))` saturation in (0.1).

## 4. Checkpoint scaling and exact reserve collapse

Take the actual lattice normalization `c_i=mu*a_i`.  At the target choose

\[
 A_n=(m_jL-\mu)a_n>0.                             \tag{4.1}
\]

After choosing `beta=beta(L)` sufficiently small, (3.4) gives

\[
 \alpha_n(\beta)=m_jLa_n\{1+o(1)\},
 \qquad
 {c_n\over\alpha_n(\beta)}
 ={\mu\over m_jL}\{1+o(1)\}.                    \tag{4.2}
\]

Together, (3.8) and (4.2) reproduce both local inputs of (0.1).  This is
only a scaling match inside the structural model; it does not identify
the model with the actual zero weights.

The missing information is global and can be seen without an estimate.
Let

\[
 q_t(y)={\displaystyle\prod_{i\ne r}(y-x_i)
          \over\displaystyle\prod_{i\ne r}(t-x_i)}. \tag{4.3}
\]

Then `deg(q_t)=N-1`, `q_t(t)=1`, and `q_t(x_i)=0` for every `i!=r`.
Put `q_r=q_t(x_r)`, which is nonzero.  The exact moment ratios are

\[
 {\mathfrak L_\mu[q_t^2]\over\mathfrak L_0[q_t^2]}
 ={\beta\over\beta+c_rq_r^2},
 \qquad
 {\mathfrak L_\mu[yq_t^2]\over\mathfrak L_0[yq_t^2]}
 ={\beta t\over\beta t+c_rx_rq_r^2}.             \tag{4.4}
\]

Define the relative moment and positive-localizing reserves by
minimizing these two form ratios over nonzero polynomials of degree below
`N`.  Under the checkpoint-1.37 cardinal congruences these are exactly
the quantities denoted by `delta_-` and `delta_+`.  Therefore

\[
 \boxed{
 \delta_-\leq{\beta\over\beta+c_rq_r^2}\longrightarrow0,
 \qquad
 \delta_+\leq{\beta t\over\beta t+c_rx_rq_r^2}
                       \longrightarrow0.}         \tag{4.5}
\]

The direction `q_t` vanishes at the target and at every removed lattice
site except the remote omitted site.  Thus it is invisible to the target
leverage calculation.  Cancelling its remote mass exposes the tiny
`beta` atom and creates the additional local Gaussian node.

## 5. Exact two-dimensional fixture

The mechanism already occurs for degree at most three.  Put

\[
 x=1,\qquad t={5\over4},\qquad R=9,
 \qquad c_x=c_R={1\over100},
 \qquad\beta={1\over10^6},                        \tag{5.1}
\]

and define

\[
 \rho=\delta_1+{1\over10^6}\delta_{5/4},
 \qquad
 U={101\over100}\delta_1+{1\over10^6}\delta_{5/4}
                  +{1\over100}\delta_9.          \tag{5.2}
\]

The moments of `U` through degree three are

\[
 (m_0,m_1,m_2,m_3)=
 \left({1020001\over1000000},{880001\over800000},
       {1164801\over640000},{4249601\over512000}\right). \tag{5.3}
\]

Its monic quadratic Gaussian polynomial is

\[
 P_0(y)=y^2-Sy+P,
 \qquad
 S={20684820155\over2068482124},
 \qquad
 P={18616341875\over2068482124}.                 \tag{5.4}
\]

Writing

\[
 D=S^2-4P
 ={273831503313853654025\over4278618297307551376}, \tag{5.5}
\]

the two unshifted nodes are `s_+/-=(S+/-sqrt(D))/2`.  Exact signs give

\[
 P_0(1)={961\over517120531}>0,
 \quad
 P_0(13/10)={-238909476847\over103424106200}<0,
 \quad
 P_0(8)={-14479363429\over2068482124}<0,
 \quad
 P_0(10)={18616352725\over2068482124}>0.          \tag{5.6}
\]

Thus exactly one unshifted node lies in `[1,13/10]`, while the other lies
in `(8,10)`.  Replace `U` by its two-node Gaussian representation.  If
`alpha_-` is the weight at `s_-`, then

\[
 \alpha_-={m_0\over2}
 +{m_0S/2-m_1\over\sqrt D},
 \qquad
 \lambda_0(s_-)=\alpha_-.                         \tag{5.7}
\]

Subtracting the two masses in (5.1) recovers the moments of `rho` through
degree three.  Its two Gaussian nodes are exactly `1` and `5/4`, both in
`[1,13/10]`.  Its moment and localizing determinants are, respectively,

\[
 \det M_\mu={1\over16000000}>0,
 \qquad
 \det H_\mu={1\over12800000}>0.                  \tag{5.8}
\]

Finally `q(y)=4(y-1)` obeys `q(5/4)=1` and `q(9)=32`.  It gives the exact
reserve witnesses

\[
 \boxed{
 \delta_-\leq{1\over10240001},
 \qquad
 \delta_+\leq{1\over73728001}.}                  \tag{5.9}
\]

This fixture uses equal displayed subtraction weights only to keep the
fractions short.  Section 3 allows arbitrary positive `c_i`, including
the factorial lattice weights `mu*a_i`.

## 6. Exact stopping line

The one-point saturation in checkpoint 1.38 protects a useful target
trial direction, and the lattice cardinal polynomial annihilates the
other direct subtraction terms on that direction.  That observation is
consistent with the surviving fixed-index upper Ritz bound.  It does not
control how many other eigenvalue branches enter the same window.

The all-site family proves that no theorem based only on target
Christoffel saturation, the nearest mass ratio, and strict positivity of
the two truncated Grams can establish shifted local uniqueness.  A valid
continuation for the actual zero functional still needs at least one of:

1. a quantitative global moment or even localizing reserve;
2. direct inertia control for both endpoint pencils; or
3. new source-specific arithmetic information that rules out the remote
   near-cancellation in (4.4).

Any downstream use must reject a claimed pass if it identifies the
structural family with the zeta-zero functional, infers an actual shifted
node failure, drops the global inverse from (2.5) or (2.7), treats one
small diagonal mass as a bound for `(I-B)^(-1)`, or claims RH, a converse,
an actual prolate normalized-response estimate, or a `Lambda` bound.
