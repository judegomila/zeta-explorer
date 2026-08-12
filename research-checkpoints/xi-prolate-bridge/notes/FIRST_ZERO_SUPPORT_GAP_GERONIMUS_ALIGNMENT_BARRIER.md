# First-zero support-gap Geronimus alignment barrier

## 0. Exact outcome and claim boundary

Assume RH only when the actual critical-zero measure is mentioned.  Put

\[
 h={2\pi\over L},\qquad x_n=h^2n^2,\qquad
 g=\gamma _1^2,                                   \tag{0.1}
\]

where `gamma_1` is the least positive zeta-zero ordinate.  The actual
zero measure starts at `g`, while the exact carrier measure has

\[
 M_L=\#\{n:x_n<g\}
 ={\gamma _1L\over2\pi}+O(1)=O(L)                 \tag{0.2}
\]

positive atoms below `g`.  This support separation does not orient the
odd-ground mixed cofactor.

The exact carrier weights reduce to a centered hypergeometric law.  In
particular, for the constant polynomial,

\[
 {\sigma_e(y)\over\sigma_e(1)}
 =h^2{N^2\over4N-1}.                              \tag{0.3}
\]

On the critical schedule

\[
 N=De^LL+O_D(L),\qquad {1\over2\pi}<D<{1\over2}, \tag{0.4}
\]

this mean is

\[
 {\sigma_e(y)\over\sigma_e(1)}
 ={\pi^2De^L\over L}\{1+o_D(1)\}\gg g.           \tag{0.5}
\]

For every sufficiently large critical `N`, this note constructs a positive
zero-side moment measure whose support starts exactly at `g`, whose support
may be chosen to satisfy the Riemann--von Mangoldt main count with `O(1)`
error, and whose generalized odd ground is positive and simple, but

\[
 \boxed{\Delta_N<0.}                              \tag{0.6}
\]

The ground polynomial has `N-1` simple positive roots above `g`.  The
shifted signed Hankel matrix has a positive flat Gaussian representation on
those roots.  Thus support ordering, Christoffel or Gaussian quadrature,
Sturm root location, and a Schur complement over the sub-`g` carrier atoms
do not force the desired sign.

The same family has a ground-weighted zero distribution concentrated at
the first support atom, while its carrier polynomial can be arbitrarily
close to the constant polynomial.  The exact constant-polynomial
coefficient statistics are

\[
 \boxed{J_1={4N-1\over N^2},\qquad
 J_2={(4N-1)(4N-3)\over N^3(3N-2)}.}              \tag{0.7}
\]

Consequently `L^2 J_1` and `L^4 J_2` tend to zero on (0.4), although the
ground-weighted inverse second and fourth zero moments can tend to
`gamma_1^(-2)` and `gamma_1^(-4)`.

The constructed weights are free positive moment weights.  They are not
the pole--archimedean--minus-prime zeta weights and the construction is not
the zeta divisor.  It proves that the first-zero gap and zero count alone
are insufficient; it proves no failure for the actual zeta ground.  No
finite gate, determinant convergence, unconditional zero statement, RH,
converse from RH, or de Bruijn--Newman bound follows.  This is a narrow
post-checkpoint-1.56 barrier pair, changes none of the standard eight files,
and leaves the formal state `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/CRITICAL_ODD_GROUND_MIXED_VANDERMONDE_COFACTOR_TARGET.md` | `e29cbe760a3fea646220fa738573638ad42075e92cf4a0345e674002f9f91fda` |
| `tests/test_critical_odd_ground_mixed_vandermonde_cofactor_target.py` | `ee3fd3205cdefb061c4d55f321e69b5cd480fd109b0670bb9d028066d530f51f` |
| `notes/CRITICAL_GROUND_NEGATIVE_SOBOLEV_NO_ESCAPE_BARRIER.md` | `08048a91afda16b0b1305f7355efc5b8be223d7fc8a27a8918da71a8532cdfa6` |
| `tests/test_critical_ground_negative_sobolev_no_escape_barrier.py` | `9afbfa782f507ad1c6ffd2b7e9721d06413a90d82c83c987b1d1abb1441e71a4` |
| `notes/RH_ACTUAL_ODD_GROUND_PRIMITIVE_CHRISTOFFEL_PARITY_BARRIER.md` | `29475ddb8b57f227530b6aa296b088f07c4ac9db0cadd1a2d230b40a780b3157` |
| `tests/test_rh_actual_odd_ground_primitive_christoffel_parity_barrier.py` | `c03b4325d8f04266091dc3cd8ad17f6bf4f91ca97773cf7dfcaedb44f46caeb6` |

The first pair supplies the exact carrier and zero measures, the signed
Christoffel--Geronimus pencil, and the equivalence between `Delta_N>0` and
the favorable derivative.  The second supplies the negative-Sobolev
statistics and their exact support-only sufficient conditions.  The third
supplies the polynomial-to-Fourier coefficient maps and the endpoint-zero
primitive.  No zero table, external source, numerical producer, source-lock
JSON, or standard-eight byte is imported.

## 2. Exact carrier weights and hypergeometric law

Retain

\[
 D_N(y)=\prod_{k=1}^N(y-h^2k^2).                  \tag{2.1}
\]

The frozen even carrier weights are

\[
 s_0={1\over D_N(0)^2},\qquad
 s_n={1\over2x_n^2D_N'(x_n)^2}.                  \tag{2.2}
\]

Direct products give

\[
 D_N(0)=(-1)^Nh^{2N}(N!)^2,                      \tag{2.3}
\]

\[
 D_N'(x_n)=(-1)^{N-n}h^{2N-2}
 { (N-n)!(N+n)!\over2n^2}.                       \tag{2.4}
\]

Therefore

\[
 s_0={h^{-4N}\over(N!)^4},\qquad
 s_n={2h^{-4N}\over\{(N-n)!(N+n)!\}^2}.         \tag{2.5}
\]

Put

\[
 r_n={N!^2\over(N-n)!(N+n)!}
 ={\binom{2N}{N-n}\over\binom{2N}{N}},
 \qquad0\leq n\leq N.                           \tag{2.6}
\]

Then

\[
 s_n=2s_0r_n^2\quad(1\leq n\leq N).             \tag{2.7}
\]

The Vandermonde convolution gives the exact normalizer

\[
 Z_N:=1+2\sum_{n=1}^Nr_n^2
 ={\binom{4N}{2N}\over\binom{2N}{N}^2}.          \tag{2.8}
\]

Equivalently, let `K` have the hypergeometric distribution obtained by
drawing `2N` objects from `4N`, of which `2N` are marked, and put `X=N-K`.
Then

\[
 {\mathbb P}(X=n)={r_{|n|}^2\over Z_N},
 \qquad -N\leq n\leq N.                          \tag{2.9}
\]

Its exact centered moments are

\[
 {\mathbb E}X^2={N^2\over4N-1},                  \tag{2.10}
\]

\[
 {\mathbb E}X^4
 ={N^3(3N-2)\over(4N-1)(4N-3)}.                 \tag{2.11}
\]

Consequently

\[
 {\sigma_e(y)\over\sigma_e(1)}
 =h^2{\mathbb E}X^2
 =h^2{N^2\over4N-1},                             \tag{2.12}
\]

and

\[
 {\sigma_e(y^2)\over\sigma_e(1)}
 =h^4{N^3(3N-2)\over(4N-1)(4N-3)}.              \tag{2.13}
\]

No carrier pole has been discarded in these formulas.  The atom at zero
is included in `Z_N`; multiplication by `y` or `y^2` kills it only in the
corresponding odd or positive-index even pencil.

## 3. The sub-first-zero carrier block at critical density

Assume for notation that `gamma_1/h` is not an integer and put

\[
 M=M_L=\left\lfloor{\gamma_1\over h}\right\rfloor.
                                                               \tag{3.1}
\]

At a collision one replaces `M` by `M-1`; every asymptotic below is
unchanged.  Since `M=O(L)` and `N` obeys (0.4),

\[
 q_L:={M\over\sqrt N}
 ={\gamma_1\over2\pi\sqrt D}\sqrt L\,e^{-L/2}
 \{1+o_D(1)\}.                                    \tag{3.2}
\]

Uniformly for `n<=M`,

\[
 r_n^2=1+O\left({M^2\over N}\right),             \tag{3.3}
\]

while Stirling's formula gives

\[
 Z_N=\sqrt{{\pi N\over2}}\{1+O(N^{-1})\}.        \tag{3.4}
\]

Thus the fraction of the full even carrier mass lying below `g` is

\[
 {s_0+\sum_{n=1}^Ms_n\over\sigma_e(1)}
 =2\sqrt{{2\over\pi}}q_L\{1+o_D(1)\}.            \tag{3.5}
\]

The odd denominator is `y d sigma_e`.  Its low-block fraction is

\[
 {\sum_{n=1}^Mx_ns_n\over\sigma_e(y)}
 ={8\over3}\sqrt{{2\over\pi}}q_L^3
 \{1+o_D(1)\}.                                    \tag{3.6}
\]

The positive-index even denominator is `y^2 d sigma_e`.  Its corresponding
fraction is

\[
 {\sum_{n=1}^Mx_n^2s_n\over\sigma_e(y^2)}
 ={32\over15}\sqrt{{2\over\pi}}q_L^5
 \{1+o_D(1)\}.                                    \tag{3.7}
\]

Although there are `O(L)` carrier atoms below the first zero, their raw
mass fractions on the constant direction are respectively of orders

\[
 \sqrt L e^{-L/2},\qquad
 L^{3/2}e^{-3L/2},\qquad
 L^{5/2}e^{-5L/2}.                                \tag{3.8}
\]

A Schur complement over this block cannot yield a uniform true-ground
coercivity estimate from support ordering alone.  The construction below
keeps its ground arbitrarily close to this constant direction.

## 4. Exact support-gap family with the wrong mixed sign

Fix a critical `N` so large that

\[
 \mu_0:={\sigma_e(y)\over\sigma_e(1)}>g.          \tag{4.1}
\]

Choose distinct points `R_2,...,R_N` above `max(g,x_N)` and define the
constant-normalized polynomial

\[
 P(y)=\prod_{j=2}^N\left(1-{y\over R_j}\right).  \tag{4.2}
\]

The points may be chosen arbitrarily far out.  Hence `P` may be made
uniformly as close to one as desired on `[0,x_N]`.  In particular, choose
them so that

\[
 \mu_P:={\sigma_e(yP^2)\over\sigma_e(P^2)}>g.     \tag{4.3}
\]

Choose positive `w_2,...,w_N`.  Let `chi` be any positive measure supported
away from `g,R_2,...,R_N` with finite moments through degree `2N`.  For
`epsilon>0`, put

\[
 \nu_\epsilon=\epsilon\delta_g
 +\sum_{j=2}^Nw_j\delta_{R_j}
 +\epsilon^2\chi.                                 \tag{4.4}
\]

Let

\[
 A=\bigl(\sigma_e(y^{i+j+1})\bigr)_{0\leq i,j<N},
 \qquad
 B_\epsilon=\bigl(\nu_\epsilon(y^{i+j+1})\bigr)_{0\leq i,j<N}.
                                                               \tag{4.5}
\]

The matrix `A` is positive definite because its `N` positive carrier nodes
are distinct.  At `epsilon=0`, `B_0` is positive semidefinite of rank
`N-1`, and its kernel is exactly the coefficient vector of `P`.  Hence zero
is a simple smallest generalized eigenvalue of `(B_0,A)`.

Ordinary finite-dimensional simple-eigenvalue perturbation gives, for all
sufficiently small positive `epsilon`, a positive simple generalized ground

\[
 B_\epsilon p_\epsilon
 =\lambda_\epsilon A p_\epsilon,
 \qquad p_\epsilon=P+O(\epsilon).                 \tag{4.6}
\]

The leading eigenvalue is

\[
 \lambda_\epsilon
 ={\epsilon gP(g)^2\over\sigma_e(yP^2)}
 +O(\epsilon^2).                                  \tag{4.7}
\]

At every high core node `R_j`, one has

\[
 p_\epsilon(R_j)=O(\epsilon).                    \tag{4.8}
\]

Therefore the total high-core and padding contribution to either ground
quadratic form is `O(epsilon^2)`, whereas the atom at `g` contributes
`Theta(epsilon)`.  In particular,

\[
 {\nu_\epsilon(yp_\epsilon^2)
  \over\nu_\epsilon(p_\epsilon^2)}
 =g+O(\epsilon).                                  \tag{4.9}
\]

The mixed cofactor has the expansion

\[
 \Delta_N(\epsilon)
 =\epsilon P(g)^2\sigma_e(P^2)(g-\mu_P)
 +O(\epsilon^2).                                  \tag{4.10}
\]

Equation (4.3) now proves

\[
 \boxed{\Delta_N(\epsilon)<0}                    \tag{4.11}
\]

for every sufficiently small positive `epsilon`.  This is an exact open
inequality for a positive measure and a positive simple generalized odd
ground, not a singular limiting example.

## 5. Count-compatible support and exact limitation

The support in Section 4 can obey the zero count without changing the
argument.  Let `Gamma={tau_1<tau_2<...}` be any simple positive sequence
with

\[
 \tau_1=\gamma_1,\qquad
 N_\Gamma(T)={T\over2\pi}\log{T\over2\pi e}+O(1). \tag{5.1}
\]

Such a sequence is obtained after a finite beginning by inverse quantiles
of the increasing main term on the right.  Select `R_2,...,R_N` from
sufficiently remote squared ordinates `tau_j^2`.  On every remaining
squared ordinate put, for example, a positive `chi` weight bounded by

\[
 2^{-j}(1+\tau_j^2)^{-2N-2}.                      \tag{5.2}
\]

Then every support point remains present for every `epsilon>0`, all needed
moments converge, the support begins at `g`, and (5.1) is unchanged.  The
same construction may use any stronger count-compatible support supplied
independently.

The support and count do not determine the moment weights.  In the actual
zeta functional those weights contain the sine phase, every carrier pole,
algebraic multiplicity, and the full source normalization.  Equation
(4.4) does not reproduce that arithmetic law.  Its role is exactly to show
that support and count, even together, cannot prove the desired sign.

There is also a companion favorable-sign family on the same support.  Give
weight `epsilon` to a distinguished support point `R_*>x_N`, give weight
`epsilon^2` to the first point `g`, and choose the `N-1` core roots still
farther out.  Then

\[
 {\nu_\epsilon(yp_\epsilon^2)
  \over\nu_\epsilon(p_\epsilon^2)}
 =R_*+O(\epsilon)>x_N,                            \tag{5.3}
\]

whereas every carrier mean is at most `x_N`.  Thus the same gap and count
permit either sign after changing only positive weights.

## 6. Signed Geronimus mass, Gaussian nodes, and Sturm roots

For the simple ground of Section 4, put

\[
 \omega_\epsilon=\nu_\epsilon
 -\lambda_\epsilon\sigma_e.                      \tag{6.1}
\]

The shifted Hankel matrix

\[
 H_1(\lambda_\epsilon)
 =\bigl(\omega_\epsilon(y^{i+j+1})\bigr)_{0\leq i,j<N}
                                                               \tag{6.2}
\]

is positive semidefinite of rank `N-1` and has kernel `p_epsilon`.  Its
leading principal block of order `N-1` is positive at `epsilon=0` and
remains positive for small `epsilon`.  The flat Hamburger representation
therefore has `N-1` positive weights at the `N-1` simple roots of
`p_epsilon`.

At `epsilon=0` those roots are `R_2,...,R_N`.  Simple real roots persist
under small real perturbations, so every Gaussian node and every Sturm root
remains strictly above `g`.  Nevertheless the inverse Christoffel step has

\[
 \omega_\epsilon(p_\epsilon^2)
 =\epsilon P(g)^2
 \left\{1-{g\over\mu_P}\right\}
 +O(\epsilon^2)>0.                                \tag{6.3}
\]

The frozen identity

\[
 \Delta_N=-\sigma_e(yp_\epsilon^2)
             \omega_\epsilon(p_\epsilon^2)       \tag{6.4}
\]

then gives the wrong sign.  In Geronimus form, the flat positive
representation of `y d omega_epsilon` determines every shifted moment but
leaves one boundary mass in `d omega_epsilon`.  Root location does not
determine that mass.

This also explains the Schur-complement failure.  The fixed high-core
operator has rank `N-1` and an exact kernel.  Along the perturbed ground its
quadratic contribution is only second order, while the first support atom
sets the first-order floor in (4.7).  Operator size and support height do
not control ground-weighted mass.

## 7. Exact constant-polynomial negative-Sobolev statistics

For the odd polynomial `P=1`, the frozen residue map gives, after
normalization,

\[
 d_n^{(0)}={(-1)^{N-n}nr_n\over S_2^{1/2}},
 \qquad
 S_2=\sum_{n=1}^Nn^2r_n^2
 ={Z_NN^2\over2(4N-1)}.                           \tag{7.1}
\]

The alternating binomial identity gives

\[
 \sum_{n=1}^N(-1)^{N-n}r_n={(-1)^{N-1}\over2}.   \tag{7.2}
\]

Since

\[
 \sum_{n=1}^Nr_n^2={Z_N-1\over2},                \tag{7.3}
\]

the exact odd statistic is

\[
 J_1(d^{(0)})
 =2\left|\sum_{n=1}^N{d_n^{(0)}\over n}\right|^2
 +\sum_{n=1}^N{|d_n^{(0)}|^2\over n^2}
 ={4N-1\over N^2}.                               \tag{7.4}
\]

Choose the remote roots in Section 4 so that `P-1=o(N^(-1))` uniformly on
the carrier nodes, and then choose `epsilon` still smaller.  The normalized
ground coefficients obey

\[
 J_1(d^{(\epsilon)})={4N-1\over N^2}+o(N^{-1}).  \tag{7.5}
\]

On the critical schedule,

\[
 L^2J_1(d^{(\epsilon)})
 ={4\over D}Le^{-L}\{1+o_D(1)\}\longrightarrow0. \tag{7.6}
\]

On the other hand, the odd sampling-energy probability of Section 4 puts
`1-O(epsilon)` mass at `gamma_1`, so

\[
 \int\gamma^{-2}\,d\nu_-(\gamma)
 =\gamma_1^{-2}+O(\epsilon).                     \tag{7.7}
\]

Thus the support-gap construction violates the support-only sufficient
odd no-escape inequality once `L` is large.

There is an exact positive-index even analogue.  For the constant second-
Christoffel polynomial, the normalized coefficients are

\[
 h_n^{(0)}={(-1)^{N-n}n^2r_n\over S_4^{1/2}},
 \qquad
 S_4={Z_NN^3(3N-2)\over
 2(4N-1)(4N-3)}.                                  \tag{7.8}
\]

Equations (7.2)--(7.3) and the fourth moment (2.11) give

\[
 J_2(h^{(0)})
 =2\left|\sum_{n=1}^N{h_n^{(0)}\over n^2}\right|^2
 +\sum_{n=1}^N{|h_n^{(0)}|^2\over n^4}
 ={(4N-1)(4N-3)\over N^3(3N-2)}.                 \tag{7.9}
\]

Therefore

\[
 L^4J_2(h^{(0)})
 ={16\over3D^2}L^2e^{-2L}\{1+o_D(1)\}
 \longrightarrow0.                               \tag{7.10}
\]

Repeating Section 4 for the `y^2` pencil concentrates the corresponding
ground-weighted inverse fourth moment at `gamma_1^(-4)`.  The first-zero
gap therefore does not supply the true-even negative-Sobolev reserve
either.

## 8. Minimal surviving input and fail-closed stopping line

The support gap supplies only

\[
 {\nu_e(yp^2)\over\nu_e(p^2)}\geq g.             \tag{8.1}
\]

It supplies no upper bound below `g` for
`sigma_e(yp^2)/sigma_e(p^2)`.  Equation (0.5) shows that even the constant
direction has the opposite ordering by an exponentially large factor at
critical density.

A successful actual theorem must therefore use information absent from the
counterfamily: the fixed zeta weights, their carrier phases, or an
equivalent relative actual-ground row-deletion or source-correlation bound.
The exact surviving targets remain

\[
 \Delta_N>0,\qquad
 \Theta_N\leq1-\rho,
 \qquad\hbox{or directly}\qquad
 {\mu_N\over\alpha_N}\leq1-\rho.                 \tag{8.2}
\]

Any downstream use must reject an argument which

1. infers the sign of the Geronimus boundary mass from positivity of
   `H_1`;
2. treats the signed atomic measure `omega_epsilon` as its positive flat
   quadrature representation;
3. turns the `O(L)` low carrier count into a uniform low-block leverage;
4. drops the high carrier atoms or any carrier pole;
5. promotes the free weights in (4.4) to the actual zeta weights;
6. identifies the count-compatible support with the zeta divisor; or
7. claims an actual gate failure, determinant convergence, a zero theorem,
   RH, a converse from RH, or a de Bruijn--Newman bound.

The terminal result is a strict support-and-count no-go with a simple
ground.  The actual arithmetic mixed cofactor and negative-Sobolev
statistics remain open, and the formal state remains `P0_INVALIDATED`.
