# Three-node xi interpolation: curvature reduction and a uniform proof

Research note, 9 November 2026 UTC. This continues the positive-real
interpolation calculation after the two-node result. No RH proof or
novelty claim is made.

**Result.** Given the established strict two-node inequalities, positivity
of every three-node real Pick matrix is equivalent to two explicit
one-variable concavity statements. Both now hold strictly for the
actual xi response: this note proves the second globally and the first
on the bounded interval; the companion note
[large-argument proof](theta_third_pick_large_x_20261109.md) proves the first on the
remaining half-line. Therefore every three-node real Pick matrix is
positive definite. The bounded-interval argument uses the published
finite-height RH verification as an external theorem. Neither an
all-orders interpolation invariant nor a proof of RH follows.

## 1. Setup

Write

\[
F(x)=\xi(1/2+x),\qquad L(x)=F'(x)/F(x),\qquad x>0,
\]

and define

\[
P_L(x,y)=\frac{L(x)+L(y)}{x+y}.
\]

The earlier actual-theta calculation gives

\[
L(x)>0,\qquad 0<xL'(x)<L(x)\quad(x>0).
\tag{1.1}
\]

For completeness, its theta input is the strict concavity of
\(t\mapsto\log\kappa(\sqrt t)\), with
\(F(x)=\int_{\mathbb R}\kappa(v)e^{xv/2}\,dv\).
This is Csordas's Theorem 4.2(b), with the change of scale
\(\kappa(v)=\Phi(v/4)\); see [1]. It implies that
\(q(v)=-\kappa'(v)/(v\kappa(v))\) increases. A covariance identity then
proves that \(L(x)/x\) decreases, whereas exponential-tilt variance proves
\(L'(x)>0\). We use the already established conclusion (1.1).

Set

\[
h(u)=\frac{L(\sqrt u)}{\sqrt u},\qquad u>0.
\tag{1.2}
\]

In particular, \(h>0\), \(h'<0\), and \((uh)' >0\).

## 2. Exact three-node criterion

### Proposition

Suppose a smooth positive response \(L\) satisfies (1.1). Then the
following statements are equivalent:

1. Every matrix \([P_L(x_i,x_j)]_{i,j=1}^3\), for distinct positive real
   nodes, is positive semidefinite.
2. Both functions
   \[
   g(u)=1/h(u),\qquad \phi(t)=h(1/t)
   \tag{2.1}
   \]
   are concave on \((0,\infty)\).
3. For every \(u>0\),
   \[
   \boxed{h(u)h''(u)-2h'(u)^2\ge0,\qquad
          uh''(u)+2h'(u)\le0.}
   \tag{2.2}
   \]

Equivalently, the permitted curvature of \(h\) is

\[
\frac{2h'(u)^2}{h(u)}\le h''(u)\le-\frac{2h'(u)}u.
\tag{2.3}
\]

These are finite-order conditions. They neither assert complex-domain
positive-realness of \(L\), nor positivity of every larger Pick matrix.

### Proof by the exact Schur complement

Fix an anchor \(a>0\), put \(p=L(a)\), and use the first reduced response

\[
R_a(x)=\frac{xL(x)-ap}{xp-aL(x)}.
\tag{2.4}
\]

The numerator and denominator have the same strict sign away from
\(x=a\), by the increase of \(xL(x)\) and decrease of \(L(x)/x\).
Consequently \(R_a(x)>0\). Its removable value at the anchor is

\[
R_a(a)=\frac{p+aL'(a)}{p-aL'(a)}>0.
\tag{2.5}
\]

The scalar Schur complement of the anchor entry \(P_L(a,a)=p/a\) is

\[
\begin{aligned}
S_a(x,y)
&=P_L(x,y)-\frac{a}{p}P_L(x,a)P_L(a,y)\\
&=\frac{(xp-aL(x))(yp-aL(y))}{p(x+a)(y+a)}
  \frac{R_a(x)+R_a(y)}{x+y}.
\end{aligned}
\tag{2.6}
\]

Thus, when \(x,y\ne a\), the two-by-two Schur complement is a real
diagonal congruence of the two-node Pick matrix of \(R_a\).
The diagonal factors can have either sign; that does not change
positive semidefiniteness under congruence.

For any positive smooth function \(R\), the determinant factorization

\[
\det P_R(x,y)=
\frac{(xR(x)-yR(y))(xR(y)-yR(x))}{xy(x+y)^2}
\tag{2.7}
\]

shows that all its two-node matrices are positive semidefinite exactly
when both \(xR(x)\) is nondecreasing and \(R(x)/x\) is nonincreasing.
Indeed, for \(x>y\) determinant nonnegativity is equivalent to
\(y/x\le R(x)/R(y)\le x/y\). The differential form is

\[
-R(x)\le xR'(x)\le R(x).
\tag{2.8}
\]

Now let \(u=x^2\), \(v=a^2\), and write

\[
T(u,v)=\frac{uh(u)-vh(v)}{h(v)-h(u)},\qquad u\ne v.
\tag{2.9}
\]

Then \(xR_a(x)=T(u,v)/a\), whereas
\(R_a(x)/x=T(u,v)/(au)\). Therefore the needed two monotonicities are
\(\partial_uT\ge0\) and \(\partial_u(T/u)\le0\).

Put \(k=h(v)\). Direct differentiation gives

\[
\partial_uT=
\frac{h(u)(k-h(u))+(u-v)k h'(u)}{(k-h(u))^2}.
\tag{2.10}
\]

After division of the numerator by the positive quantity \(h(u)^2k\),
its sign is the sign of

\[
g(u)-g(v)-(u-v)g'(u).
\tag{2.11}
\]

Nonnegativity of (2.11) for all \(u,v\) is exactly the tangent-line
criterion for concavity of \(g\).

Similarly,

\[
u\partial_uT-T=
\frac{k\{v(k-h(u))+u(u-v)h'(u)\}}{(k-h(u))^2}.
\tag{2.12}
\]

Put \(t=1/u\) and \(r=1/v\). The expression in braces, divided by
\(v>0\), equals

\[
\phi(r)-\phi(t)-(r-t)\phi'(t).
\tag{2.13}
\]

Its nonpositivity is precisely concavity of \(\phi\). This proves the
equivalence of the first two statements. Continuity handles the
removable anchor value; it is enough to start with distinct nodes.
Finally,

\[
g''=\frac{2h'^2-hh''}{h^3},\qquad
\phi''(t)=u^3\{uh''(u)+2h'(u)\},\quad u=1/t,
\tag{2.14}
\]

proves the last equivalence.

If both concavities are strict, their tangent-line inequalities are
strict for distinct arguments. Then both monotonicities for every
\(R_a\) are strict, (2.7) is positive for distinct nodes, and the
Schur-complement argument proves that every three-node matrix is
positive definite. In particular it is enough to prove the two
inequalities (2.2) strictly at every positive \(u\).
The possible anchor point does not obstruct these monotonicities:
they hold on each side of it, and (2.5) supplies a continuous removable
extension there, so strict comparisons also hold across the anchor.

The identities (2.6), (2.10), and (2.12) are direct algebraic identities,
not assumptions about an infinite ladder or hidden spectral measure.

## 3. The same conditions in the original real coordinate

Writing \(x=\sqrt u\), differentiation gives

\[
h'(u)=\frac{xL'(x)-L(x)}{2x^3},\qquad
h''(u)=\frac{x^2L''(x)-3xL'(x)+3L(x)}{4x^5}.
\tag{3.1}
\]

Consequently (2.2) is equivalent to

\[
\boxed{
\mathcal A(x):=L(x)^2+xL(x)L'(x)+x^2L(x)L''(x)
                 -2x^2L'(x)^2\ge0
}
\tag{3.2}
\]

and

\[
\boxed{\mathcal B(x):=L(x)-xL'(x)-x^2L''(x)\ge0.}
\tag{3.3}
\]

More precisely,
\(hh''-2h'^2=\mathcal A/(4x^6)\) and
\(uh''+2h'=-\mathcal B/(4x^3)\).

## 4. The actual xi function satisfies the second sign globally

This argument uses known zero-location information only at a fixed low
height. It does not assume global RH.

Because \(F\) is even and entire of order one,

\[
\mathcal H(u)=F(\sqrt u)
\]

is an entire function of order one half. Choose one representative
\(\beta+i\gamma\), \(\gamma>0\), from each pair of centered zeros
\(\pm(\beta+i\gamma)\), with multiplicity, and put

\[
\lambda=-(\beta+i\gamma)^2
       =\gamma^2-\beta^2-2i\beta\gamma.
\tag{4.1}
\]

The resulting multiset of \(\lambda\)'s is invariant under conjugation.
The genus-zero product and logarithmic derivative give

\[
\mathcal H(u)=\mathcal H(0)\prod_\lambda(1+u/\lambda),\qquad
h(u)=2\frac{\mathcal H'(u)}{\mathcal H(u)}
    =2\sum_\lambda\frac1{u+\lambda}.
\tag{4.2}
\]

Here \(\sum_\lambda|\lambda|^{-1}<\infty\). The series and its
derivatives converge locally uniformly away from its poles; termwise
differentiation on \(u>0\) is justified. No positivity of a spectral
measure is assumed: the \(\lambda\)'s may be nonreal.

**Sector lemma.** If \(|\arg\lambda|<\pi/4\), then

\[
\Re\frac{\lambda}{(u+\lambda)^3}>0\qquad(u>0).
\tag{4.3}
\]

To check it, put \(\theta=\arg\lambda\). The argument of
\(u+\lambda\) lies between \(0\) and \(\theta\); hence the argument of
the quotient lies between \(-2\theta\) and \(\theta\), wholly inside
\((-\pi/2,\pi/2)\).

Every actual xi parameter \(\lambda\) belongs to this sector. The
classical critical strip gives \(|\beta|<1/2\), as in [2]. For the
zeros with \(0<\gamma\le2\), published finite-height RH verification
gives \(\beta=0\), so \(\lambda=\gamma^2>0\). For \(\gamma>2\),

\[
\Re\lambda>\gamma^2-\tfrac14>\gamma>
|\Im\lambda|.
\tag{4.4}
\]

The finite-height theorem used here is Platt--Trudgian [3], which
certifies RH through height \(3\cdot10^{12}\); this argument consumes
only its much weaker height-two consequence. It does not require a
numerical value for the first zero. There are no real zeros of \(F\),
because its positive theta integral is positive on the real axis.

Differentiating (4.2) now yields

\[
uh''(u)+2h'(u)
 =-4\sum_\lambda\frac{\lambda}{(u+\lambda)^3}<0.
\tag{4.5}
\]

The sum is real by conjugation, and every term has strictly positive
real part before multiplication by \(-4\). Therefore

\[
\boxed{\phi''(t)<0\quad(t>0),\qquad \mathcal B(x)>0\quad(x>0).}
\tag{4.6}
\]

The first inequality (3.2), equivalently concavity of \(g=1/h\), is
proved by the following bounded-interval estimate together with the
companion large-argument estimate.

## 4A. Uniform first-curvature proof on the bounded interval

Put \(T=3\cdot10^{12}\), and split the exact logarithmic derivative as

\[
h(u)=h_0(u)+e(u),\qquad
h_0(u)=2\sum_{0<\gamma\le T}\frac1{u+\gamma^2},\qquad
e(u)=2\sum_{\gamma>T}\frac1{u+\lambda}.
\tag{4A.1}
\]

The finite-height theorem [3] makes every term of the first sum exactly
real; no assumption is made about the zeros in the second sum. Both
sums include multiplicities.

The only additional numerical zero data needed are the very coarse
certified intervals

\[
14<\gamma_1<15,\qquad 21<\gamma_2<22,
\tag{4A.2}
\]

where \(\gamma_1,\gamma_2\) are the first two ordinates. In particular
every ordinate exceeds two. FLINT's official zero-isolation
documentation [6] states the rigorous isolation and counting property
and displays enclosing intervals well inside (4A.2). Odlyzko's primary
table [7], identified as the first 100,000 zeros with absolute error
at most \(3\cdot10^{-9}\), independently supports these coarse bounds.
These are imported published data; the present argument does not claim
to recompute their certification.

### A finite total reciprocal moment

For \(\gamma\ge2\), \(|\beta|<1/2\), let
\(c=1/4-\beta^2\). Directly,

\[
\Re\frac1{\lambda+1/4}
=\frac{\gamma^2+c}{(\gamma^2+c)^2+4\beta^2\gamma^2}
\ge\frac1{2\gamma^2}.
\tag{4A.3}
\]

Indeed the cross-multiplied inequality is
\(\gamma^4\ge c^2+4\beta^2\gamma^2\), which follows from
\(c^2\le1/16\), \(4\beta^2\le1\), and \(\gamma\ge2\).
Consequently

\[
\sum_\gamma\gamma^{-2}\le h(1/4)
=2+\gamma_{\!E}-\log(4\pi)<1.
\tag{4A.4}
\]

The equality follows directly by logarithmically differentiating the
xi definition at \(s=1\), using the constant term \(\gamma_E\) of the
Laurent expansion of zeta and
\(\psi(1/2)=-\gamma_E-2\log2\). The last inequality needs only
\(\gamma_E<1\) and \(\log(4\pi)>2\). Thus no explicit zero-counting
estimate is needed in this proof.

### Signed-tail control

For \(\gamma\ge2\),

\[
\frac{|\Im\lambda|}{\Re\lambda}
<\frac{\gamma}{\gamma^2-1/4}
\le\frac8{15}<\frac1{\sqrt3}.
\tag{4A.5}
\]

Hence \(|\arg\lambda|<\pi/6\). The same or smaller angular bound
holds for \(u+\lambda\). It follows, by taking real parts of the
conjugation-invariant sums, that

\[
e(u)>0,\qquad e''(u)>0.
\tag{4A.6}
\]

Although these two signs are positive, they do not assert positivity
of all derivatives or of the full complex Pick kernel.

Using \(\gamma>2\) and (4A.4),

\[
|h_0'(u)|
\le2\sum_{\gamma\le T}\gamma^{-4}<\frac12.
\tag{4A.7}
\]

Also
\(|u+\lambda|\ge\Re\lambda>\gamma^2-1/4\ge15\gamma^2/16\), so

\[
\begin{aligned}
|e'(u)|
&\le2\sum_{\gamma>T}|u+\lambda|^{-2}\\
&\le\frac{512}{225}\sum_{\gamma>T}\gamma^{-4}\\
&\le\frac{512}{225T^2}\sum_{\gamma>T}\gamma^{-2}
<\frac3{T^2}.
\end{aligned}
\tag{4A.8}
\]

Because \(h_0,h_0''\), \(e,e''\) are positive, expanding the exact
curvature gives the useful one-sided estimate

\[
\begin{aligned}
hh''-2h'^2
&=h_0h_0''-2h_0'^2+h_0e''+eh_0''+ee''-4h_0'e'-2e'^2\\
&\ge h_0h_0''-2h_0'^2-\frac6{T^2}-\frac{18}{T^4}.
\end{aligned}
\tag{4A.9}
\]

Thus the signs of the omitted cross terms are justified; the tail is
not simply discarded as though it were a positive-real response.

### A head margin supplied by two distinct real zeros

Let \(r_\gamma=(u+\gamma^2)^{-1}\) in the finite head. Then

\[
\begin{aligned}
h_0h_0''-2h_0'^2
&=8\left[(\sum r_\gamma)(\sum r_\gamma^3)
                  -(\sum r_\gamma^2)^2\right]\\
&=8\sum_{i<j}
\frac{(\gamma_i^2-\gamma_j^2)^2}
{(u+\gamma_i^2)^3(u+\gamma_j^2)^3}.
\end{aligned}
\tag{4A.10}
\]

Every summand is nonnegative. Retaining the first two alone, (4A.2)
gives, uniformly on \(0\le u\le10^4\),

\[
h_0h_0''-2h_0'^2
\ge\frac{8\cdot216^2}{10484^6}>\frac{24}{10^{20}}.
\tag{4A.11}
\]

At the published cutoff,

\[
\frac6{T^2}+\frac{18}{T^4}<\frac7{10^{25}}.
\tag{4A.12}
\]

These last comparisons are inequalities between explicit rational
numbers. Combining them proves

\[
\boxed{hh''-2h'^2>0\qquad(0\le u\le10^4).}
\tag{4A.13}
\]

This is a uniform analytic estimate with imported finite zero
verification, not a grid of evaluations of the desired curvature.

### Completion on the full positive axis

The companion note [large-argument proof](theta_third_pick_large_x_20261109.md) proves,
using the Euler product and elementary gamma bounds,

\[
\mathcal A(x)>58/225\qquad(x\ge100).
\tag{4A.14}
\]

Together with (4A.13), this proves \(g''(u)<0\) for every \(u>0\).
Section 4 proves \(\phi''(t)<0\) for every \(t>0\). The strict form
of the proposition in Section 2 therefore proves

\[
\boxed{[P_L(x_i,x_j)]_{i,j=1}^3\text{ is positive definite for every
three distinct positive real nodes.}}
\tag{4A.15}
\]

## 5. The resulting exact theta covariance inequality

The earlier two-node calculation can be differentiated once more
without replacing the theta equation. Let \(\theta=x/2\) and use

\[
d\nu_\theta(v)=
\frac{v\kappa(v)\sinh(\theta v)\,dv}
{\int_0^\infty r\kappa(r)\sinh(\theta r)\,dr},\qquad v>0.
\tag{5.1}
\]

Write

\[
M(\theta)=E_{\nu_\theta}q,
\quad a_\theta(v)=v\coth(\theta v),
\quad b_\theta(v)=\partial_\theta a_\theta(v)
                  =-v^2\operatorname{csch}^2(\theta v).
\tag{5.2}
\]

The integration-by-parts identity is
\(h(u)=1/(4M(\sqrt u/2))\), so

\[
g''(u)=\frac{\theta M''(\theta)-M'(\theta)}{16\theta^3},
\qquad u=4\theta^2.
\tag{5.3}
\]

Differentiating expectations gives

\[
M'=\operatorname{Cov}(q,a_\theta),
\tag{5.4}
\]

\[
M''=\operatorname{Cov}(q,b_\theta)
 +E\big[(q-M)(a_\theta-Ea_\theta)^2\big].
\tag{5.5}
\]

All expectations in these formulas use \(\nu_\theta\). Therefore the
proved three-node curvature has the exact theta form

\[
\boxed{
\theta E\big[(q-M)(a_\theta-Ea_\theta)^2\big]
< \operatorname{Cov}(q,a_\theta)
     -\theta\operatorname{Cov}(q,b_\theta)
\quad(\theta>0).
}
\tag{5.6}
\]

This is a strict mixed third-central-moment estimate. It now follows from the
proved actual-xi curvature, through the exact identities above. The
fact that \(q\) and \(a_\theta\) increase proves the sign of (5.4), but
does not by itself prove (5.6): the present proof of (5.6) uses finite
zero verification and the large-argument estimate. A direct intrinsic
theta-kernel proof, or a version preserved by every reduction, has not
been obtained. In particular, the earlier covariance proof must not
be iterated by simply assuming that its positivity survives.

An alternative spectral formulation, also without assuming RH, is

\[
hh''-2h'^2=8(S_1S_3-S_2^2),\qquad
S_k(u)=\sum_\lambda(u+\lambda)^{-k}.
\tag{5.7}
\]

Pairwise symmetrization gives

\[
S_1S_3-S_2^2
=\frac12\sum_{\lambda,\mu}
\frac{(\lambda-\mu)^2}{(u+\lambda)^3(u+\mu)^3}.
\tag{5.8}
\]

The sector lemma alone cannot sign (5.8). A nonreal conjugate pair has
\((\lambda-\bar\lambda)^2<0\); its internal contribution is negative.
Any proof using known low zeros and the narrow strip must therefore
control interactions and show domination, not assert termwise
positivity of this double sum.

## 6. Recent theta regularity: source audit and the transfer gap

Sra's 10 October 2026 preprint [4], Theorem 1.1, reports strict reverse
regularity through order four for the Hankel kernel
\(s(x+y)\), \(s(t)=\Phi(\sqrt t)\). Its fifth condition fails at
\(t=10^{-2}\). The assertions use an explicit software trust assumption
for interval calculations on a compact interval. The paper transfers
these signs to coefficient Hankel minors, differential Turan iterates,
and Fourier integral inequalities. Its own limitations distinguish
these from pointwise Laguerre inequalities for Xi. The displayed
source and PDF were inspected; its interval verifier was not
independently replayed here.

These are signs of a different kernel from \(P_L\). No implication
from the reported fourth-order reverse regularity to (5.6) has been
proved in this note. Also, the fifth-order failure of that particular
theta Hankel kernel does not refute higher Pick positivity of \(L\).
Either direction would require an explicit transfer argument.

Sra's 2 November 2026 reciprocal-xi preprint [5] reports positivity and
decrease of the heat trace \(\sum_\lambda e^{-t\lambda}\), hence complete
monotonicity of \(h=2\mathcal H'/\mathcal H\), using finite zero
verification. Its finite-order PF results concern inverse Laplace
densities. These results are not independently reproved here. Complete
monotonicity alone gives \(hh''\ge h'^2\), which is weaker than the
factor-two inequality in (2.2); no sufficient PF-to-Pick transfer is
being assumed.

## 7. Status and next exact target

Every three-node real Pick matrix is now positive definite, using the
proposition, the two curvature proofs, and the companion large-argument
note. This is one additional finite interpolation stage beyond the
two-node result. The exact theta inequality (5.6) is a corollary for the
actual response.

The fourth-node Schur residual and a property preserved through all
later reductions remain unproved. An all-orders conclusion cannot be
inferred from the finite theorem or from the finite-height zero data
used to prove it. The normal-family route to RH still requires those
all-orders interpolation matrices.

## Sources

1. George Csordas, *Fourier transforms of positive definite kernels and
   the Riemann xi-Function*, arXiv:1309.0055v2 (21 February 2014),
   Theorem 4.2(b) and equation (4.2).
   <https://arxiv.org/html/1309.0055v2>
2. NIST Digital Library of Mathematical Functions, Section 25.10(i),
   classical critical strip and zero symmetries.
   <https://dlmf.nist.gov/25.10>
3. Dave Platt and Tim Trudgian, *The Riemann hypothesis is true up to
   3\(\cdot\)10\(^{12}\)*, arXiv:2004.09765; published in the Bulletin
   of the London Mathematical Society, DOI 10.1112/blms.12460.
   <https://arxiv.org/abs/2004.09765>
4. Suvrit Sra, *Sharp order-four sign regularity of a Jacobi theta
   kernel*, v1, 10 October 2026, Theorem 1.1 and Assumption 1.5.
   <https://suvrit.github.io/papers/csordas/csordas-v1.pdf>
5. Suvrit Sra, *On some positivity properties of the Riemann Xi
   function*, author-site v3, 2 November 2026; arXiv:2611.02944v1.
   <https://arxiv.org/html/2611.02944v1>
6. The FLINT team, *Zeros of the Riemann zeta function*, official
   documentation, rigorous isolation and counting description and
   enclosing intervals for the first three zeros.
   <https://flintlib.org/doc/acb_dirichlet/zeta-zeros.html>
7. Andrew Odlyzko, *Tables of zeros of the Riemann zeta function*,
   table index and first entries of the first-100,000 table.
   <https://www-users.cse.umn.edu/~odlyzko/zeta_tables/>
   <https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros1>

## Validation record

- Direct symbolic simplification checked the Schur-congruence identity
  (2.6), the formula
  \(R_a'=[p(x^2-a^2)L'+a(p^2-L^2)]/(xp-aL)^2\), and the
  real-coordinate expression for \(g''\).
- A separate collaborating derivation checked the genus-zero product,
  normalization, convergence, sector argument, and sign (4.5).
- The finite-head/tail comparison and its constants were independently
  reviewed by two collaborating derivations. The final rational
  margin and error comparisons were checked with exact fractions.
- No numerical grid is used as proof. The imported finite-height
  verification and first-zero isolation computations were not rerun.
  No interval computation from either recent preprint was replayed;
  neither recent preprint is required by the three-node proof.
- The all-three-node conclusion uses the companion large-argument
  proof. No all-orders conclusion is claimed.
