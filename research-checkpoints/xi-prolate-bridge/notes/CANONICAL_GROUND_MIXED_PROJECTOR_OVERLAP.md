# Canonical ground overlap as a mixed spectral-projector coefficient

## 0. Claim boundary

This note proves a **finite-dimensional algebraic reduction**.  It does not
prove a lower bound for the actual pinned Weil matrices on an unbounded
schedule.  In particular, it proves neither RH nor a new bound for the
de Bruijn--Newman constant, and it does not prove equation (5.2), locally
uniform convergence of the finite ground transforms, or the needed signed
alignment with the source-normalized prolate state.  The project state remains
`P0_INVALIDATED`.

No zero table, global Weil positivity assertion, cached eigendata, or
real-axis eigenvalue agreement is used below.

## 1. Source and normalization conventions retained

The finite matrix and state referred to here are the objects reconstructed
from Connes--Consani--Moscovici, *Zeta Spectral Triples*,
arXiv:2511.22755v1, vendored as `vendor/CCM-ZST-2511.22755v1.pdf` with
SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The source-lock corrections remain binding: the duplicated `c(L)` in
printed (4.14) is removed, and the printed prolate normalization tends to
`Xi/4`, with any factor four applied only to the final characteristic
function.  Thus

* \(L=2\log\lambda\), with the centered logarithmic coordinate
  \(t=\log(\lambda u)-L/2\) and \(du/u=dt\);
* \(V_n(t)=(-1)^nL^{-1/2}e^{2\pi i nt/L}\) on
  \([-L/2,L/2]\), and
  \(\widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt\);
* inversion is \(JV_n=V_{-n}\);
* the complete finite Weil matrix is the pole block minus the
  archimedean block minus the prime block, with every prime power
  \(1<k\leq\lambda^2\) included and with the minus sign in source
  equation (3.19) preserved;
* the prolate input uses \([-\lambda,\lambda]\), Lebesgue measure, zero
  extension, and the source scalar normalization; inversion evenization is
  performed only after the arithmetic transform.

Nothing in the theorem changes any of these conventions.  It consumes an
already reconstructed real inversion-symmetric finite matrix and the
source-normalized projected state.

## 2. Finite setup and the quantity that must be controlled

Fix \((\lambda,N)\).  Let

\[
 A=Q_{\lambda,N,+}\in\mathbb R^{d\times d},\qquad d=N+1,
\]

be the even parity block in an orthonormal basis, and put

\[
 \mu=\min\operatorname{spec}(A),\quad
 E=\ker(A-\mu I),\quad m=\dim E,\quad P=P_E.
\]

Let \(\eta\) be the finite boundary vector.  In raw Fourier coordinates it
is the all-ones vector; in the orthonormal even basis it is
\((1,\sqrt2,\ldots,\sqrt2)^T\).  Let \(\kappa\) be the unit,
source-normalized projected prolate state in the even block.  Assume

\[
 u=P\eta\ne0,qquad a=\|u\|,qquad x=\frac{u}{a}.
\tag{2.1}
\]

The canonical mixed overlap is

\[
 \alpha=\langle\kappa,x\rangle
 =\frac{\langle\kappa,P\eta\rangle}
 {\sqrt{\langle\eta,P\eta\rangle}}.
\tag{2.2}
\]

This is the exact finite quantity that the canonical-boundary-ground route
needs in addition to the already separate transform and tail hypotheses.

## 3. Multiplicity-safe derivative--cofactor identity

Use the sign convention

\[
 p(z)=\det(zI-A),\qquad C(z)=\operatorname{adj}(zI-A).
\tag{3.1}
\]

Define the scalar cofactor contractions

\[
 b(z)=\eta^TC(z)\eta,qquad
 c(z)=\kappa^TC(z)\eta.
\tag{3.2}
\]

Write

\[
 p(z)=(z-\mu)^m g(z),\qquad g(\mu)\ne0.
\tag{3.3}
\]

### Theorem 3.1 (derivative projector formula)

With (3.1)--(3.3),

\[
 C^{(m-1)}(\mu)=(m-1)!\,g(\mu)P,
 \qquad
 p^{(m)}(\mu)=m!\,g(\mu),
\tag{3.4}
\]

and hence

\[
 \boxed{\displaystyle
 P=\frac{m\,C^{(m-1)}(\mu)}{p^{(m)}(\mu)}.}
\tag{3.5}
\]

If \(P\eta\ne0\), then

\[
 \boxed{\displaystyle
 |\alpha|^2=
 \frac{m\,|c^{(m-1)}(\mu)|^2}
 {p^{(m)}(\mu)b^{(m-1)}(\mu)}.}
\tag{3.6}
\]

The denominator in (3.6) is strictly positive despite the possible sign of
\(g(\mu)\):

\[
 p^{(m)}(\mu)b^{(m-1)}(\mu)
 =m!(m-1)!g(\mu)^2\langle\eta,P\eta\rangle>0.
\tag{3.7}
\]

#### Proof

By the spectral theorem, if \(P_\nu\) denotes the projector for an eigenvalue
\(\nu\), then away from the spectrum

\[
 C(z)=p(z)(zI-A)^{-1}
 =\sum_\nu\frac{p(z)}{z-\nu}P_\nu.
\]

The \(\nu=\mu\) term is
\((z-\mu)^{m-1}g(z)P\), while every other term is divisible by
\((z-\mu)^m\).  Taking the first nonzero derivative gives the first
identity in (3.4); differentiating (3.3) gives the second.  Equation (3.5)
follows.  Contracting (3.4) with \((\eta,\eta)\) and
\((\kappa,\eta)\), then substituting in (2.2), proves (3.6)--(3.7).
\(\square\)

This is multiplicity-safe.  In particular, the undifferentiated adjugate
\(C(\mu)\) vanishes whenever \(m\ge2\); replacing (3.6) by an ordinary
adjugate formula in that case loses the entire projector.

The same cofactors independently encode the auxiliary boundary selector:

\[
 \det\!\left(zI-(A-\varepsilon\eta\eta^T)\right)
 =p(z)+\varepsilon b(z).
\tag{3.8}
\]

Equation (3.8) follows from the rank-one determinant identity and fixes the
sign: the matrix is perturbed by \(-\varepsilon\eta\eta^T\), so the
characteristic matrix contains \(+\varepsilon\eta\eta^T\).

### Simple branch

When \(m=1\), (3.5) reduces to

\[
 P=\frac{\operatorname{adj}(\mu I-A)}{p'(\mu)}.
\tag{3.9}
\]

Equivalently, with the positive semidefinite matrix \(H=A-\mu I\) and
\(C_H=\operatorname{adj}(H)\),

\[
 P=\frac{C_H}{\operatorname{tr}C_H},\qquad
 |\alpha|^2=
 \frac{|\kappa^TC_H\eta|^2}
 {\operatorname{tr}(C_H)\,\eta^TC_H\eta}.
\tag{3.10}
\]

The two presentations have different harmless cofactor signs when the
dimension changes; (3.1) is the convention used in (3.4)--(3.9).

## 4. Resolvent reconstruction with a finite certified error

Let

\[
 R_\delta=(A-\mu I+\delta I)^{-1},\qquad \delta>0,
 \qquad
 y_\delta=\frac{R_\delta\eta}{\|R_\delta\eta\|}.
\tag{4.1}
\]

Put \(v=(I-P)\eta\).  If \(E\ne\mathbb R^d\), let

\[
 \gamma=\min\operatorname{spec}(A|_{E^\perp})-\mu>0;
\tag{4.2}
\]

if \(E=\mathbb R^d\), set \(\gamma=+\infty\).  Spectral decomposition gives

\[
 R_\delta\eta=\frac{u}{\delta}+w_\delta,qquad
 w_\delta=(A-\mu I+\delta I)^{-1}v,qquad
 u\perp w_\delta,
\tag{4.3}
\]

and

\[
 \|w_\delta\|\le\frac{\|v\|}{\gamma+\delta}.
\tag{4.4}
\]

Set \(t_\delta=\delta\|w_\delta\|/a\).  Orthogonality in (4.3) gives the
exact identity

\[
 \|y_\delta-x\|^2
 =2\left(1-\frac1{\sqrt{1+t_\delta^2}}\right)
 \le t_\delta^2.
\tag{4.5}
\]

Consequently,

\[
 \boxed{\displaystyle
 \|y_\delta-x\|
 \le \frac{\delta\|v\|}{a(\gamma+\delta)},}
\tag{4.6}
\]

and, because \(\|\kappa\|=1\),

\[
 \boxed{\displaystyle
 |\alpha|\ge
 |\langle\kappa,y_\delta\rangle|
 -\frac{\delta\|(I-P)\eta\|}
 {\|P\eta\|(\gamma+\delta)}.}
\tag{4.7}
\]

In particular,

\[
 \boxed{\displaystyle
 \alpha=\lim_{\delta\downarrow0}
 \frac{\langle\kappa,R_\delta\eta\rangle}
 {\sqrt{\langle\eta,R_\delta^2\eta\rangle}}.}
\tag{4.8}
\]

Equations (4.6)--(4.7), not merely the formal limit (4.8), are the finite
certificate: interval enclosures for the displayed resolvent contraction,
\(a\), \(\gamma\), and \(\|v\|\) give a rigorous lower enclosure for the
mixed overlap.

## 5. The weakest asymptotic overlap condition

Consider a deterministic diagonal schedule \((\lambda_j,N_j)\), with
\(\lambda_j\to\infty\) and all objects above indexed by \(j\).  The desired
normalization condition

\[
 |\alpha_j|^{-1}=\lambda_j^{o(1)}
\tag{5.1}
\]

is **equivalent** to the existence of numbers \(\epsilon_j\ge0\),
\(\epsilon_j\to0\),
such that, eventually,

\[
 \boxed{\displaystyle
 |\langle\kappa_j,P_j\eta_j\rangle|^2
 \ge \lambda_j^{-2\epsilon_j}
 \langle\eta_j,P_j\eta_j\rangle.}
\tag{5.2}
\]

Thus (5.2), rather than a lower bound on the entire ground-space mass
\(\|P_j\kappa_j\|\), is the weakest direct projector statement.  By
Theorem 3.1 it is equivalently the derivative--cofactor inequality

\[
 m_j|c_j^{(m_j-1)}(\mu_j)|^2
 \ge \lambda_j^{-2\epsilon_j}
 p_j^{(m_j)}(\mu_j)b_j^{(m_j-1)}(\mu_j).
\tag{5.3}
\]

The right side is positive by (3.7).  A verifier-friendly sufficient
condition is to choose certified \(\delta_j>0\) for which

\[
 |\langle\kappa_j,y_{\delta_j}\rangle|
 -\frac{\delta_j\|(I-P_j)\eta_j\|}
 {\|P_j\eta_j\|(\gamma_j+\delta_j)}
 \ge \lambda_j^{-\epsilon_j},
 \qquad \epsilon_j\to0.
\tag{5.4}
\]

A collection of finite checks of (5.2)--(5.4) is diagnostic until one also
proves the stated bound uniformly along an unbounded schedule.

### Extra information available only on a simple branch

Suppose \(m=1\), let \(\gamma\) be the next even eigenvalue gap, and put

\[
 q=\langle\kappa,A\kappa\rangle,qquad
 r=\|(A-qI)\kappa\|.
\]

Then

\[
 1-|\alpha|^2=\|(I-P)\kappa\|^2
 \le\frac{q-\mu}{\gamma}.
\tag{5.5}
\]

If \(q<\mu+\gamma\), one also has

\[
 \|(I-P)\kappa\|
 \le\frac{r}{\mu+\gamma-q}.
\tag{5.6}
\]

These follow immediately by expanding \(\kappa\) in an eigenbasis.  They
show why a proved simple-ground residual/gap estimate would be powerful.
For \(m>1\), the same estimates control distance to \(E\) but say nothing
about the orientation of \(P\kappa\) relative to \(P\eta\); the mixed
coefficient in (5.2) remains independent information.

## 6. Finite-\(N\) boundary caveat

The construction is deliberately finite.  In raw modes

\[
 \|\eta_N\|^2=2N+1,
\tag{6.1}
\]

so \((\eta_N)_N\) has no \(\ell^2\) limit.  Equivalently, endpoint
evaluation is not a bounded functional on the limiting \(L^2\) space.  The
finite auxiliary perturbation has operator norm

\[
 \|\varepsilon\eta_N\eta_N^T\|=\varepsilon(2N+1).
\tag{6.2}
\]

Therefore (3.8), (4.8), and the finite canonical vector do not by themselves
define an infinite-space rank-one perturbation or permit interchange of
\(N\to\infty\) with \(\varepsilon\downarrow0\) or \(\delta\downarrow0\).
Such a passage needs new boundary control, projector convergence in a stated
topology, and a proved relation to the source-normalized prolate states.

## 7. Exact source-Cauchy counterfamily

The following exact family proves that inversion symmetry, source-Cauchy
displacement structure, zero residual, and a fixed gap above the complete
even ground space do **not** imply (5.1).

For each \(j\), choose any \(N_j\ge2\) (including a choice with
\(N_j\to\infty\)) and fix \(G>0\).  In raw modes
\(-N_j\le n\le N_j\), set

\[
 b_n=0,qquad
 a_0=a_{1}=a_{-1}=0,qquad
 a_n=G\quad(2\le |n|\le N_j).
\tag{7.1}
\]

Then

\[
 Q_{mn}=a_m\mathbf1_{m=n}
 +\frac{b_m-b_n}{m-n}\mathbf1_{m\ne n}
\tag{7.2}
\]

is an exact real inversion-symmetric diagonal source-Cauchy matrix.  In the
orthonormal even basis \(e_0,e_1^+,\ldots,e_N^+\),

\[
 E=\operatorname{span}\{e_0,e_1^+\},\qquad
 \mu=0,qquad
 \gamma=G.
\tag{7.3}
\]

Moreover,

\[
 P\eta=e_0+\sqrt2e_1^+,qquad
 x=\frac{e_0+\sqrt2e_1^+}{\sqrt3},qquad
 w=\frac{\sqrt2e_0-e_1^+}{\sqrt3}
\tag{7.4}
\]

are unit with \(x\perp w\).  For \(j\ge1\), let

\[
 T_j=2^j,qquad
 t_j=\frac{2T_j}{1+T_j^2},qquad
 s_j=\frac{T_j^2-1}{T_j^2+1},qquad
 \kappa_j=t_jx+s_jw.
\tag{7.5}
\]

The Pythagorean identity \(t_j^2+s_j^2=1\) makes \(\kappa_j\) an exact
unit even ground vector.  Consequently

\[
 q_j=\mu=0,qquad r_j=0,qquad
 \|(I-P)\kappa_j\|=0,qquad
 \alpha_j=t_j,
\tag{7.6}
\]

while the gap above the complete even ground space remains \(G\).  If
\(\lambda_j=j+1\), then

\[
 |\alpha_j|^{-1}=\frac{1+4^j}{2^{j+1}},
\tag{7.7}
\]

which is exponentially large in \(j\), and hence is not
\(\lambda_j^{o(1)}\).  All high-mode tails vanish once the cutoff contains
mode one.

Because \(E\) is multiple, the complementary minimum relative to the single
vector \(\kappa_j\) is zero; (7.1)--(7.7) address the multiplicity-safe
ground-space formulation, not a hypothesis of a positive one-vector
complementary gap.

This is a structural counterfamily, not the pinned arithmetic Weil matrix
and not the actual source-normalized prolate state.  Its exact conclusion is
only that the admitted abstract matrix, symmetry, residual, and
ground-space-gap inputs cannot establish (5.1).  A genuine bridge still
requires an actual-source proof of (5.2), (5.3), or an equally strong mixed
projector estimate.

## 8. Result of this checkpoint

The finite overlap question has an exact, independently reconstructible
target:

1. locate the lowest even root \(\mu\) and its exact multiplicity \(m\);
2. reconstruct the characteristic polynomial and mixed adjugate
   contractions using convention (3.1);
3. certify (3.6), or use (4.7) with a finite \(\delta\);
4. prove, rather than extrapolate, the unbounded-schedule inequality (5.2).

Steps 1--3 are finite algebra.  Step 4 is the still-open actual-source
theorem.  The counterfamily shows why it cannot be replaced by residual and
gap control alone.
