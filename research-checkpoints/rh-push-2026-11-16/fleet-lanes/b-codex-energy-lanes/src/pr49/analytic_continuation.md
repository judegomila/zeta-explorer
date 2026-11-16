# Heat-deformed theta flux: uniform freezing, analytic propagation, and a high-order obstruction

Research continuation, 9 November 2026.

## Status and scope

This note records deductions from the exact theta boundary-energy checkpoint in
Math Explorer PR #43. It proves an explicit obstruction to treating the frozen
end approximation as a uniformly positive operator. It also applies an established
analytic-kernel theorem to show that all-order positivity on any open interval of
the actual theta coordinate is already equivalent to global positivity.

No new numerical bound on the de Bruijn–Newman constant is established. No claim
of novelty relative to the full literature is made. The new application and the
explicit coefficient calculation below should be reviewed independently before
being described as a published theorem.

The real variable `u` here is the logarithmic theta/convolution coordinate. It is
Mellin-dual to the spectral variable. Its two tails are not automatically the
spectral torus punctures, and the cross-tail kernel is not automatically the
geometric anti-bridge. A separate exact dictionary is needed for that identification.

## 1. Exact heat normalization

Let

$$
\theta(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t},\qquad
\kappa(u)=\left(\partial_u^2-\frac1{16}\right)
          [e^{u/4}\theta(e^u)],
\qquad
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du.
$$

The normalization in the checkpoint is `kappa(u) = Phi(u/4)`. For the standard
de Bruijn–Newman parameter `tau`, put

$$
\kappa_\tau(u)=e^{\tau u^2/16}\kappa(u),\qquad
F_\tau(z)=\int_{\mathbb R}\kappa_\tau(u)e^{zu/2}\,du
         =8H_\tau(-2iz).
\tag{1}
$$

Consequently

$$
\partial_\tau F_\tau=\frac14\partial_z^2F_\tau.
\tag{2}
$$

For every fixed real `tau`, the kernel is positive, even, and faster than
exponentially decaying. Fix `alpha > 0` and let

$$
h_{\tau,\pm}(u)=(1\pm\alpha u/2)\kappa_\tau(u).
$$

Write `A_tau` for convolution by `h_tau,+`, and `Q_c` for multiplication by
`1_(c,infinity)`. The exact flux identity is

$$
\|Q_cA_\tau^*a\|_2^2-\|Q_cA_\tau a\|_2^2
=-\langle a,K_{\tau,c}a\rangle,
\tag{3}
$$

where

$$
K_{\tau,c}(u,v)
=\alpha\int_c^\infty(2r-u-v)
 \kappa_\tau(r-u)\kappa_\tau(r-v)\,dr.
\tag{4}
$$

The cutoff only translates the arguments. Henceforth `K_tau = K_tau,0`.

Reflecting the omitted integral over the negative half-line gives a useful
second formula, valid for all real `p,q`:

$$
\boxed{
K_\tau(p,q)=\alpha\int_0^\infty(p+q+2s)
\kappa_\tau(p+s)\kappa_\tau(q+s)\,ds.}
\tag{5}
$$

Indeed, the full-line integral in (4) is zero by oddness around its midpoint.
On substituting `r=-s` in its negative-half-line part, evenness of `kappa_tau`
produces (5).

## 2. Positivity on one open interval is already global positivity

### 2.1 Holomorphic extension of the actual kernel

Let

$$
S=\{z\in\mathbb C:|\operatorname{Im}z|<\pi/2\}.
$$

The Jacobi series for `theta(e^z)` converges locally uniformly on `S`, because
`Re(e^z)>0` there. Thus `kappa_tau` is holomorphic on `S`. Define

$$
\mathcal K_\tau(z,w)
=\alpha\int_0^\infty(z+\overline w+2s)
\kappa_\tau(z+s)\kappa_\tau(\overline w+s)\,ds.
\tag{6}
$$

This integral is locally uniformly convergent on `S x S`: for `z,w` in a
fixed compact subset, their imaginary parts stay a positive distance from the
strip boundary, and the theta terms decay as
`exp(-c exp(s))`, up to factors of at most `exp(C s^2)`.
The integral and its derivatives are therefore dominated on compact subsets.
It follows that `mathcal K_tau` is holomorphic in `z` and antiholomorphic in
`w`. Its restriction to real arguments is exactly (5). It is Hermitian,
since `kappa_tau(bar z) = conjugate(kappa_tau(z))`.

### 2.2 Application of analytic propagation

Neeb and Olafsson's Theorem A.1 states that a holomorphic kernel on a connected
complex manifold is positive semidefinite everywhere if it is positive
semidefinite on a nonempty maximal totally real submanifold, using the
paper's definition of totally real. Its real dimension here is one, equal to
the ambient complex dimension. An open real interval is such a submanifold
of the connected strip `S`; a single point is not sufficient.

Therefore, for every real `tau` and every nonempty open interval `I` of the
real line,

$$
\boxed{
K_\tau|_{I\times I}\succeq0
\quad\Longleftrightarrow\quad
\mathcal K_\tau\succeq0\text{ on }S
\quad\Longleftrightarrow\quad
K_\tau\succeq0\text{ on }\mathbb R.}
\tag{7}
$$

The implications from global positivity to a restriction are immediate; the
forward implication is the application of Theorem A.1 to (6).

Here kernel positivity means positivity of **every** finite matrix, for all
numbers of points and all complex coefficients. It is much stronger than
positivity of a particular frozen packet or every matrix of bounded size.

## 3. Global flux positivity and the actual de Bruijn–Newman threshold

For completeness, the all-time version of the checkpoint's equivalence is
recorded explicitly.

Define

$$
D_\tau=F_\tau+\alpha F_\tau',\qquad
N_\tau=F_\tau-\alpha F_\tau'.
$$

On the imaginary axis `N_tau(it) = conjugate(D_tau(it))`. Thus

$$
\widehat{C_\tau f}(t)
=\frac{N_\tau(it)}{D_\tau(it)}\widehat f(t),
\qquad
\widehat f(t)=\int f(u)e^{itu/2}\,du,
\tag{8}
$$

defines a unitary operator. The exceptional boundary zeros are isolated and
have measure zero. Also `A_tau C_tau = A_tau*`.

### 3.1 Positivity implies only imaginary zeros of `F_tau`

The range of `A_tau` is dense in ordinary `L2`: its symbol `D_tau(it)` is an
entire function restricted to the boundary, nonzero almost everywhere.
If `K_tau` is PSD, translation and (3), followed by density, imply

$$
\|Q_cC_\tau f\|_2\le\|Q_cf\|_2
\quad(f\in L^2,\ c\in\mathbb R).
\tag{9}
$$

In particular, `C_tau` preserves `L2(-infinity,0]`. Under the Fourier convention
in (8), that support subspace corresponds to the Hardy space on the right
half-plane. The Hardy multiplier theorem therefore gives a Schur function
`S_tau` on `Re z>0` whose boundary multiplier is the quotient in (8).

One need not assume that `F_tau` is globally of bounded type in that half-plane
to identify this extension. The holomorphic function

$$
N_\tau-D_\tau S_\tau
$$

is bounded on every finite half-disk touching the imaginary axis, and has
boundary values zero almost everywhere on that half-disk's diameter. Boundary
uniqueness for bounded analytic functions makes it zero there; analytic
continuation gives zero throughout the right half-plane. Thus `S_tau` is the
analytic version of `N_tau/D_tau` wherever that quotient is initially defined.

If `F_tau` had a zero `z0` with positive real part, write

$$
F_\tau(z)=(z-z_0)^m g(z),\qquad m\ge1,\quad g(z_0)\ne0.
$$

Cancelling the common power in the quotient gives `S_tau(z0)=-1`.
The maximum modulus principle would force `S_tau` to be the constant `-1`,
and hence `2 F_tau = N_tau+D_tau = 0`, a contradiction. Evenness of `F_tau`
then excludes zeros with negative real part as well.

### 3.2 Only imaginary zeros imply positivity

The theta decay gives `F_tau` order at most one. More explicitly, its maximal
growth satisfies `log M(r) = O_tau(r log(r+2))`; this follows from maximizing
the real exponent in (1). Since `F_tau` is even and `F_tau(0)>0`, if its zeros
are all imaginary it has the paired canonical product

$$
F_\tau(z)=F_\tau(0)\prod_{\gamma>0}
\left(1+\frac{z^2}{\gamma^2}\right)^{m_\gamma},
\qquad \sum_{\gamma>0}\frac{m_\gamma}{\gamma^2}<\infty.
$$

There is no nonconstant exponential factor: order at most one permits only a
linear exponential, and evenness removes it. On the right half-plane,

$$
\frac{F_\tau'(z)}{F_\tau(z)}
=\sum_{\gamma>0}m_\gamma
\left(\frac1{z-i\gamma}+\frac1{z+i\gamma}\right)
$$

has positive real part. Consequently

$$
\frac{1-\alpha F_\tau'/F_\tau}
{1+\alpha F_\tau'/F_\tau}
$$

is Schur on the right half-plane. Its boundary multiplication preserves the
negative-support Hardy subspace. Unitarity then gives (9): the part of the
input supported to the left of `c` contributes nothing to the output right of
`c`, and the remaining output has norm at most that of the remaining input.
Applying (3) proves `K_tau >= 0`.

Continuous-kernel positivity and positivity of the bounded integral operator
are equivalent here, by compactly supported approximation in one direction
and mollified point masses in the other.

Combining these deductions with (7) and the defining de Bruijn–Newman theorem,

$$
\boxed{
K_\tau|_{I\times I}\succeq0
\quad\Longleftrightarrow\quad
K_\tau\succeq0
\quad\Longleftrightarrow\quad
H_\tau\text{ has only real zeros}
\quad\Longleftrightarrow\quad
\tau\ge\Lambda.}
\tag{10}
$$

This is a strict reduction, not a proof of the missing positivity. At `tau=0`,
all-order positivity on **any** open tail interval is already RH-equivalent.
For `tau<0`, Rodgers–Tao gives `tau<Lambda`; therefore every nonempty open
real interval contains some finite negative flux Gram configuration. This is
consistent with every fixed packet becoming positive far into either end:
the negative packet's order, spacing, or coefficients must change.

## 4. The finite-R leading same-end kernel fails at high order

For large positive `p,q`, the existing theta-tail calculation gives

$$
K_\tau(p,q)\sim
\frac{\alpha(p+q)\kappa_\tau(p)\kappa_\tau(q)}
{\pi(e^p+e^q)}.
\tag{11}
$$

After positive diagonal congruence, the finite-R leading kernel is

$$
M(p,q)=\frac{p+q}{e^p+e^q}.
\tag{12}
$$

Although its fixed-offset normalized limit is the positive sech kernel,
`M` itself is not positive semidefinite on **any** nonempty open interval,
however far to the right.

Any interval containing a negative `p` already fails because
`M(p,p)=p exp(-p)<0`. The proof below handles all remaining open intervals
by taking a positive interior center.

### 4.1 Self-contained confluent witness

Take an interior center `P>0`, set `a=e^P`, and introduce local coordinates

$$
x=e^p=a\frac{1+z}{1-z},\qquad
y=e^q=a\frac{1+w}{1-w}.
$$

Then

$$
f_P(z)=\log x=P+2\sum_{\substack{k\ge1\\k\text{ odd}}}\frac{z^k}{k},
$$

and

$$
M(p,q)=\frac{(1-z)(1-w)}{2a}
B_P(z,w),\qquad
B_P(z,w)=\frac{f_P(z)+f_P(w)}{1-zw}.
\tag{13}
$$

The prefactor is a positive diagonal congruence on a sufficiently small real
neighborhood. The `N x N` Taylor coefficient matrix of `B_P` is

$$
C^{(N)}_{jk}=
\begin{cases}
2P,&j=k,\\
2/|j-k|,&|j-k|\text{ odd},\\
0,&|j-k|\text{ even and nonzero},
\end{cases}
\quad 0\le j,k<N.
\tag{14}
$$

For the unit vector `v_j=(-1)^j/sqrt(N)` and even `N=2n`, direct summation gives

$$
\boxed{
v^*C^{(2n)}v
=2P-4H_{2n}+2H_n+2
=2P+2-4\sum_{k=1}^n\frac1{2k-1}.}
\tag{15}
$$

This tends to negative infinity as `n` grows. For example, at `P=3,N=16`,

$$
v^*C^{(16)}v=-\frac{3928}{45045}<0.
\tag{16}
$$

If a smooth kernel is PSD on a neighborhood, every finite mixed-derivative
matrix there is PSD, because derivative evaluations are limits of finite
differences of point evaluations. Equation (15) contradicts that requirement.
Equivalently, approximate the functional

$$
L=\sum_{j=0}^{N-1}\frac{v_j}{j!}\partial_z^j\bigg|_{z=0}
$$

by forward differences on points `0,h,...,(N-1)h`. Its quadratic form converges
to (15). For sufficiently small `h`, it is therefore a negative ordinary
point-Gram quadratic form, with every point in an arbitrarily small interval.
The change of variables and positive congruence in (13) transfer it to `M`.

The coefficient witness has asymptotic value

$$
2P-2\log N-2\log2-2\gamma+2+o(1).
$$

Thus this particular witness appears at order approximately

$$
N>\frac12 e^{P+1-\gamma}\approx0.7631e^P.
\tag{17}
$$

This is a sufficient witness scale, not a claim that the least possible
negative order equals that scale.

### 4.2 A small exact point-Gram witness

There is also a three-point witness above `p=1`. Let

$$
L=\frac54,\qquad d=\log\frac{11}{9},\qquad
(p_1,p_2,p_3)=(L-d,L,L+d),\qquad c=(50,-99,50).
$$

Direct rational arithmetic using `exp(d)=11/9` gives

$$
e^L\sum_{i,j=1}^3c_i c_j M(p_i,p_j)
=\frac{29999}{9999}L-\frac{1990}{99}d.
\tag{17a}
$$

Since `d=2 atanh(1/10)`, its positive series gives

$$
\frac15<d<\frac{20}{99}<\frac14.
$$

Thus all three centers exceed `1`, and

$$
e^L c^TMc<-\frac{3599}{13332}<0.
\tag{17b}
$$

The coefficients and the rational bound in (17a)–(17b) were independently
recomputed. They certify failure of the leading model only.

### 4.3 Entrywise smallness cannot be upgraded to relative form smallness

Normalize the diagonal of (12). Then

$$
\widehat M(p,q)
=\frac{p+q}{2\sqrt{pq}}\operatorname{sech}\frac{p-q}{2}.
$$

Write `k(p,q)=sech((p-q)/2)` and `E=Mhat-k`. Exactly,

$$
E(p,q)=\frac{(\sqrt p-\sqrt q)^2}{2\sqrt{pq}}k(p,q).
\tag{18}
$$

On a fixed-width interval `[R,R+L]`,

$$
0\le E(p,q)\le\frac{L^2}{8R^2}\,k(p,q)
\tag{19}
$$

entry by entry. Nevertheless, there is no quadratic-form bound

$$
E\succeq-\varepsilon k\quad\text{with any }\varepsilon<1
\tag{20}
$$

uniform over all finite configurations in that interval. Such a bound would
make `Mhat=k+E` PSD, contradicting (15).

This is an explicit obstruction to a proposed proof step, not a negative
result about the actual theta kernel. The exact remainder can repair the
high-order directions. Indeed, at times already known to satisfy `tau>=Lambda`,
the true kernel must be PSD although (12) remains indefinite. Neglected terms
can be essential on nearly cancelling feature packets despite their very
small entrywise size. Estimating them separately as uniformly small relative
forms is not justified by the existing asymptotics.

## 5. What remains useful about the two-end limit

This section proves the finite-packet statements directly from the full theta
series. In every limit below, offsets range over a fixed compact set and heat
times satisfy `|tau| <= T` for a fixed finite `T`.

### 5.1 Same-end Laplace limit

The exact theta series gives, as `x -> +infinity`,

$$
\kappa_\tau(x)
=2\pi^2\exp\!\left(\frac94x-\pi e^x+\frac{\tau x^2}{16}\right)
\bigl(1+O(e^{-x})\bigr).
\tag{21a}
$$

The relative error is uniform for bounded `tau`, because the heat factor is
exact. Put `p=R+a`, `q=R+b`, and `A=pi(e^p+e^q)`. In (5) the product ratio is

$$
\frac{\kappa_\tau(p+s)\kappa_\tau(q+s)}
{\kappa_\tau(p)\kappa_\tau(q)}
=\exp\!\left[-A(e^s-1)
 +\left(\frac92+\frac{\tau(p+q)}8\right)s
 +\frac{\tau s^2}{8}\right](1+O(e^{-R})),
\tag{21b}
$$

uniformly for `s>=0`. Substitute `s=z/A`. For fixed `z`, (21b) tends to
`exp(-z)`. To justify dominated convergence uniformly, use
`e^s-1 >= s+s^2/2`. For sufficiently large `R`, half of the negative term
`-A(e^s-1)` absorbs the linear and quadratic terms uniformly in the stated
parameters. The normalized integrand is then bounded by
`C(1+z) exp(-z/2)`. Hence

$$
K_\tau(p,q)\sim
\frac{\alpha(p+q)\kappa_\tau(p)\kappa_\tau(q)}
{\pi(e^p+e^q)},\qquad
K_\tau(p,p)\sim
\frac{\alpha p\kappa_\tau(p)^2}{\pi e^p}.
\tag{21c}
$$

After diagonal normalization this yields

$$
\frac{K_\tau(R+a,R+b)}
{\sqrt{K_\tau(R+a,R+a)K_\tau(R+b,R+b)}}
\sim\frac{2R+a+b}{2\sqrt{(R+a)(R+b)}}
\operatorname{sech}\frac{a-b}{2}
\longrightarrow\operatorname{sech}\frac{a-b}{2}.
\tag{21d}
$$

Simultaneous reflection gives the same limit within the negative end.

### 5.2 Cross-end limit, including coincident offsets

For the positive magnitudes `p=R+a`, `q=R+b`, write
`d=(p+q)/2` and `m=(p-q)/2=(a-b)/2`. The even-kernel form of (4) gives

$$
K_\tau(p,-q)=2\alpha\int_{|m|}^\infty
t\kappa_\tau(d+t)\kappa_\tau(d-t)\,dt.
\tag{21e}
$$

Choose a fixed sufficiently large `L`. On `|m|<=t<=d-L`, (21a) makes the
product, divided by `kappa_tau(p) kappa_tau(q)`, equal to

$$
\exp\!\left[-2\pi e^d(\cosh t-\cosh m)
             +\frac{\tau(t^2-m^2)}8\right]
$$

times a bounded relative factor tending to one whenever `t` stays bounded.
Make the Laplace change of variable

$$
v=2\pi e^d(\cosh t-\cosh m),\qquad
t\,dt=\frac{t}{\sinh t}\frac{dv}{2\pi e^d}.
\tag{21f}
$$

The function `t/sinh(t)` extends continuously at zero with value one and is
at most one for nonnegative `t`. Thus this substitution includes `m=0`
without a separate singular endpoint argument. Since

$$
t^2-m^2\le2(\cosh t-\cosh m),
$$

bounded heat times give the uniform integrable majorant `C exp(-v/2)` for
large `R`. At fixed `v`, `t -> |m|` uniformly for compact `m`; the normalized
integrand tends to `(m/sinh m) exp(-v)`.

The remaining part `t>=d-L` is negligible under the same normalization.
Uniformly for bounded heat times, `kappa_tau` is bounded on the real line and
`kappa_tau(d+t) <= C exp[-(pi/2) exp(d+t)]` there for large `d`. Its integrated
tail is bounded by `exp[-c exp(2d-L)]` up to polynomial factors. Dividing by
`kappa_tau(p) kappa_tau(q)` costs only
`exp[O(exp(d))+O_T(d^2)]`, so this contribution is `o(exp(-d))` uniformly.
Dominated convergence in (21f) therefore proves

$$
K_\tau(p,-q)\sim
\frac{\alpha\kappa_\tau(p)\kappa_\tau(q)}{\pi e^d}
\frac{m}{\sinh m}.
\tag{21g}
$$

Combining this with the diagonal formula in (21c) gives

$$
\boxed{
\frac{K_\tau(p,-q)}
{\sqrt{K_\tau(p,p)K_\tau(q,q)}}
\sim\frac{m/\sinh m}{\sqrt{pq}}.}
\tag{21}
$$

Here `m/sinh(m)=1` at zero. In particular the normalized cross-end block is
`O(1/R)` for every fixed compact offset set.

### 5.3 Each fixed finite two-end packet is eventually positive

Fix distinct offsets `a_1,...,a_n` within the positive end and distinct offsets
`b_1,...,b_l` within the negative end. The normalized Gram matrix at centers

$$
R+a_1,\ldots,R+a_n,\quad -(R+b_1),\ldots,-(R+b_l)
$$

converges to the block diagonal matrix with blocks
`[sech((a_i-a_j)/2)]` and `[sech((b_i-b_j)/2)]`. Both are strictly positive
definite. A self-contained Gram factorization is

$$
\operatorname{sech}\frac{a-b}{2}
=\int_0^\infty
 \bigl[\sqrt{2e^a}e^{-e^a r}\bigr]
 \bigl[\sqrt{2e^b}e^{-e^b r}\bigr]\,dr.
\tag{21h}
$$

Distinct offsets give distinct exponential rates; the corresponding finite
family is linearly independent. The limiting block matrix thus has a positive
smallest eigenvalue. Since the matrix size is fixed, the uniform entrywise
limits above imply matrix-norm convergence, and the actual normalized matrix
is positive definite for sufficiently large `R`. Positive diagonal congruence
returns the assertion for the original matrix.

This proves eventual positivity for **each fixed finite packet**, uniformly
over a bounded heat-time interval. Its threshold may depend on the number,
spacing, and arrangement of the offsets. There is no all-orders or arbitrary
configuration uniformity, in agreement with (10) and the obstruction in
Section 4.

### 5.4 Relative comparison inside the limiting model

Within either end, the limit is `k(s)=sech(s/2)`. The leading cross-end profile

$$
f(s)=\frac{s/2}{\sinh(s/2)}
$$

has Fourier density `(pi/2) sech(pi y)^2`, while `k` has density `sech(pi y)`.
Hence

$$
0\preceq f\preceq\frac\pi2 k.
\tag{22}
$$

This is a useful, all-orders comparison **inside the limiting model**. For
matched offsets, its cross-end relative coupling is at most `pi/(2R)`.
Equations (15)–(20) show why the passage to the actual finite-R kernel must
retain exact cancellations. Uniformity does not follow by combining entrywise
same-end and cross-end error bounds.

## 6. Exact derivative identity and a local jet formulation

Differentiating (5) along simultaneous translation of its arguments gives

$$
\boxed{
(\partial_p+\partial_q)K_\tau(p,q)
=-\alpha(p+q)\kappa_\tau(p)\kappa_\tau(q).}
\tag{23}
$$

The proof is integration of the total `s` derivative; its upper endpoint
vanishes by the exact theta decay. This identity retains the entire theta
series and is preferable to differentiating a fixed-order asymptotic in the
high-order regime of (17).

At a real center `P`, define Taylor coefficients

$$
J_{ij}=\frac{\partial_p^i\partial_q^jK_\tau(P,P)}{i!j!},\qquad
a_i=\frac{\kappa_\tau^{(i)}(P)}{i!},\quad a_{-1}=0.
$$

Then (23) gives the exact recurrence

$$
(i+1)J_{i+1,j}+(j+1)J_{i,j+1}
=-\alpha\bigl(2P a_i a_j+a_{i-1}a_j+a_i a_{j-1}\bigr).
\tag{24}
$$

It is a constraint on the jet matrix, not by itself a complete initialization
or a positivity proof. Additional boundary/row data are needed to compute it.

Analyticity gives another exact characterization: all finite principal jet
matrices `[J_ij]_(0<=i,j<N)` are PSD if and only if `K_tau` is PSD in a
neighborhood of `P`. In one direction use finite differences; in the other
use the absolutely convergent Taylor expansion and limits of its finite PSD
partial sums. Combining with (10), this all-order condition at any single
center is equivalent to `tau>=Lambda`.

The next useful analytic advance would therefore need a theta-specific
identity controlling these unbounded orders, or a substantially weaker
restricted family sufficient for the actual pulse. Proving more fixed-order
end matrices cannot substitute for that theorem.

## Sources

1. Math Explorer, pinned theta-boundary checkpoint:
   <https://github.com/judegomila/mathexplorer/blob/69d4049f289217812051188378a0a9f3f061a169/rigorous/theta-bridge-2026-11-08/theta_boundary_energy.md>
   and
   <https://github.com/judegomila/mathexplorer/blob/69d4049f289217812051188378a0a9f3f061a169/rigorous/theta-bridge-2026-11-08/theta_boundary_two_point.md>.
   These provide the normalization, bounded convolution identity, density
   argument, and fixed-finite same-end theorem. They do not contain the new
   explicit obstruction or local-interval application in this note.
2. K.-H. Neeb and G. Olafsson, *Reflection Positivity and Conformal Symmetry*,
   arXiv:1206.2039v2, Appendix A, Theorem A.1, printed pp. 41–42:
   <https://arxiv.org/pdf/1206.2039v2>.
   Published in *Journal of Functional Analysis* 266 (2014), 2174–2224,
   DOI <https://doi.org/10.1016/j.jfa.2013.10.030>.
   Used for analytic propagation of positive definiteness, not as a source
   claiming any theta/RH result.
3. B. Rodgers and T. Tao, *The de Bruijn–Newman constant is non-negative*:
   <https://arxiv.org/abs/1801.05914>.
   Used only for `Lambda >= 0` and hence the negative-time consequence of (10).
4. D. H. J. Polymath, *Effective approximation of heat flow evolution of the
   Riemann xi function, and a new upper bound for the de Bruijn–Newman constant*:
   <https://arxiv.org/abs/1904.12438>.
   Supplies the standard heat-family normalization and threshold convention.

## Evidence ledger

| Item | Status |
|---|---|
| Exact heat factors and cutoff identities | Derived from the actual theta convolution |
| Sesquiholomorphic strip extension (6) | Proved by locally uniform convergence |
| Local interval PSD iff global PSD | Application of established Theorem A.1 |
| Global PSD iff all zeros real at the stated time | Hardy/canonical-product argument detailed above |
| Exact high-order negative witness for leading model | Algebraic identity (15); example (16) is rational |
| Three-point leading-model failure above p=1 | Exact witness (17a)–(17b) |
| Failure of an entrywise-to-relative-form upgrade | Follows from (15) and (18)–(20) |
| Fixed finite same-end and two-end packet limits | Full-theta Laplace proofs in Section 5, uniform on compact offsets and bounded heat times |
| Actual theta kernel negative at tau=0 | **Not claimed** |
| Improved bound on Lambda | **Not established** |
| Uniform all-order theta estimate | **Open** |
