# Parity collision and projector orientation

## 0. Claim boundary

This is a finite, theorem-only source-Cauchy package.  It separates the
parity-noncollision branch, where the mixed-projector problem collapses to
one rank-one angle, from the parity-collision branch, where a Moore--Penrose
term invisible to the usual odd forcing survives.

It proves no actual-source estimate on an unbounded schedule, no instance of
equation (5.2) of `DIRECT_RH_ATTACK.md`, and no locally uniform determinant
limit.  In particular, the bound

\[
 \tau=O(\lambda^{-1/2})
\tag{0.1}
\]

for a rigorous tangent-angle/shifted-solve majorant remains an **unproved
actual-source alignment input**.  Finite decimal rows, were any to be
computed, would be diagnostic only; none are used here.  No zero list,
global Weil positivity assertion, cached eigensystem, or real-axis
eigenvalue agreement enters the arguments.  The formal project state remains
`P0_INVALIDATED`.

## 1. Locked source conventions and parity displacement

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf` with SHA-256

`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.

The source-lock repairs remain unchanged: the printed Section 7 state tends
to `Xi/4`, with the factor four applied only to the final characteristic
function, and the duplicated `c(L)` in printed (4.14) is removed.  We retain

\[
 L=2\log\lambda,\qquad
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt,\qquad
 JV_n=V_{-n}.
\tag{1.1}
\]

The complete finite Weil matrix is assembled as pole minus archimedean minus
prime, with every prime power \(1<n\leq\lambda^2\) included.  Nothing below
changes that matrix or substitutes a positive model for it.

For a real inversion-symmetric source-Cauchy matrix, write

\[
 Q_{nn}=a_n,\qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),\qquad
 a_{-n}=a_n,\quad b_{-n}=-b_n.
\tag{1.2}
\]

In the normalized parity bases

\[
 e_0=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},\qquad
 e_n^-={V_n-V_{-n}\over\sqrt2},
\tag{1.3}
\]

let

\[
 A=Q_+,\qquad B=Q_-,\qquad
 \eta=e_0+\sqrt2\sum_{n=1}^N e_n^+,
\tag{1.4}
\]

and let \(\beta\) be the odd parity vector obtained from
\(\sum b_nV_n\).  Define

\[
 De_0=0,\qquad De_n^+=ne_n^-.
\tag{1.5}
\]

The exact parity block of the source commutator is

\[
 \boxed{DA-BD=|\beta\rangle\langle\eta|.}
\tag{1.6}
\]

Its adjoint is

\[
 AD^*-D^*B=|\eta\rangle\langle\beta|.
\tag{1.7}
\]

All inner products below are antilinear in the first variable.  The formulas
also apply verbatim to the real matrices used by the source.

## 2. Ground projectors and the mixed quantities

Put

\[
 \mu=\min\operatorname{spec}(A),\qquad
 E=\ker(A-\mu I),\qquad P=P_E,
\tag{2.1}
\]

and let \(\kappa\) be the unit source-normalized projected prolate anchor.
Define

\[
 u=P\eta,\qquad t=\langle\eta,P\eta\rangle=\|u\|^2.
\tag{2.2}
\]

When \(t>0\), the canonical boundary ground and its prolate overlap are

\[
 x={u\over\sqrt t},\qquad
 \alpha=\langle\kappa,x\rangle.
\tag{2.3}
\]

Let \(\Pi\) be a declared low orthogonal projector, put
\(p=\Pi\kappa\), and let

\[
 {\cal L}=\operatorname{Ran}\Pi\cap p^\perp,\qquad
 P_L=P_{\cal L},\qquad
 Y=\|P\kappa\|,\qquad T=\operatorname{tr}(P_LP).
\tag{2.4}
\]

Because \({\cal L}\subset\operatorname{Ran}\Pi\) and
\({\cal L}\perp\Pi\kappa\), one has

\[
 P_L\kappa=0.
\tag{2.5}
\]

For the odd collision space define

\[
 F=P_{\ker(B-\mu I)},\qquad
 S=(B-\mu I)^\dagger,\qquad d=D\eta.
\tag{2.6}
\]

Thus \(S\) is zero on \(\operatorname{Ran}F\) and is the inverse of
\(B-\mu I\) on \((\operatorname{Ran}F)^\perp\).

## 3. The regular noncollision branch

### Theorem 3.1 (rank-one collapse)

Assume

\[
 F=0,
\quad\text{equivalently}\quad
 \det(B-\mu I)\ne0.
\tag{3.1}
\]

Then the even ground is simple, \(P\eta\ne0\), and

\[
 \boxed{|\alpha|^2=Y^2,\qquad T\leq1-Y^2.}
\tag{3.2}
\]

Let \(\theta\in[0,\pi/2]\) be the acute angle between the lines generated
by \(\kappa\) and \(x\).  Then

\[
 Y=\cos\theta.
\tag{3.3}
\]

Consequently, if a rigorous source estimate gives
\(\tan\theta\leq\tau\), then the following implications are exact:

\[
 \boxed{
 |\alpha|^{-2}=\sec^2\theta\leq1+\tau^2,
 \qquad
 {T\over Y^2}\leq\tan^2\theta\leq\tau^2,
 \qquad
 T\leq{\tau^2\over1+\tau^2}.}
\tag{3.4}
\]

In particular, a proved \(\tau=O(\lambda^{-1/2})\) would give both
\(|\alpha|^{-2}=1+O(\lambda^{-1})\) and
\(T/Y^2=O(\lambda^{-1})\) on this branch.  The implication is a theorem;
the actual-source estimate for \(\tau\) is not.

#### Proof

If the even multiplicity were at least two, then
\(E\cap\ker\langle\eta,\cdot\rangle\) would contain a nonzero vector
\(v\).  Equation (1.6) gives

\[
 (B-\mu I)Dv=0.
\]

The restriction of \(D\) to the boundary kernel is injective, because its
kernel is \(\mathbb C e_0\) and
\(\langle\eta,e_0\rangle=1\).  This would produce a nonzero odd collision,
contrary to (3.1).  Hence \(\dim E=1\).

The source-Cauchy boundary determinant identity is

\[
 \det(B-zI)=
 \langle\eta,\operatorname{adj}(A-zI)e_0\rangle.
\tag{3.5}
\]

For completeness, it follows by restricting \(D\) to
\(\ker\langle\eta,\cdot\rangle\), where it intertwines the oblique boundary
compression of \(A\) with \(B\), and then taking the Schur determinant in
\(\mathbb Ce_0\oplus\ker\langle\eta,\cdot\rangle\).  At the simple root
\(\mu\), the adjugate in (3.5) is a nonzero scalar multiple of the rank-one
ground projector.  The nonzero left side therefore forces both boundary
factors, and in particular \(P\eta\ne0\).

Now \(P=|x\rangle\langle x|\).  Therefore

\[
 Y^2=\langle\kappa,P\kappa\rangle
     =|\langle\kappa,x\rangle|^2=|\alpha|^2
\]

and

\[
 T=\operatorname{tr}(P_LP)=\|P_Lx\|^2.
\]

By (2.5),

\[
 \|P_Lx\|
 \leq\|x-\langle\kappa,x\rangle\kappa\|
 =\sqrt{1-Y^2},
\]

which proves (3.2).  Equations (3.3)--(3.4) are the elementary identities
\(\sec^2\theta=1+\tan^2\theta\) and
\((1-Y^2)/Y^2=\tan^2\theta\).  \(\square\)

### Corollary 3.2 (a residual alternative)

Let \(\nu>\mu\) be the second even eigenvalue, put

\[
 q=\langle\kappa,A\kappa\rangle,
 \qquad r=\|(A-qI)\kappa\|,
\]

and assume \(q<\nu\).  Then

\[
 1-Y^2\leq{r^2\over(\nu-q)^2},
 \qquad
 T\leq{r^2\over(\nu-q)^2}.
\tag{3.6}
\]

Indeed, on \(E^\perp\), the operator \(A-qI\) has smallest singular value
at least \(\nu-q\).  This corollary is finite algebra and does not assert a
uniform source residual--gap rate.

## 4. The singular collision branch

The next theorem assumes the canonical boundary vector is visible,
\(t>0\).  The branch \(P\eta=0\) has no canonical vector (2.3) and is not
silently treated as a limiting case.

### Theorem 4.1 (Moore--Penrose collision decomposition)

Assume \(t>0\).  Then

\[
 \boxed{F\beta=0,\qquad
 D^*\operatorname{Ran}F\subset E.}
\tag{4.1}
\]

Moreover,

\[
 \boxed{FDu=Fd,\qquad Du=Fd-tS\beta.}
\tag{4.2}
\]

Let \(D^\dagger:H_-\to H_+\) be the Moore--Penrose inverse of \(D\):

\[
 D^\dagger e_n^-={1\over n}e_n^+,
 \qquad D^\dagger D=I-|e_0\rangle\langle e_0|.
\tag{4.3}
\]

Define

\[
 g=D^\dagger Fd
   -\langle\eta,D^\dagger Fd\rangle e_0,
\tag{4.4}
\]

\[
 h=\bigl(1+\langle\eta,D^\dagger S\beta\rangle\bigr)e_0
   -D^\dagger S\beta.
\tag{4.5}
\]

Then the actual ground projection obeys the exact identities

\[
 \boxed{u=g+th,\qquad t=\|g+th\|^2,}
\tag{4.6}
\]

and

\[
 \boxed{
 \alpha={\langle\kappa,g+th\rangle\over\sqrt t},
 \qquad
 |\alpha|^2={|\langle\kappa,g+th\rangle|^2\over t}.}
\tag{4.7}
\]

Equivalently, \(t\) is a positive root of

\[
 \|h\|^2t^2+\bigl(2\operatorname{Re}\langle g,h\rangle-1\bigr)t
 +\|g\|^2=0.
\tag{4.8}
\]

The scalar equation alone need not select the projector root; the exact
spectral projector \(P\) is still part of the data.

#### Proof

Since \(Au=\mu u\), applying (1.6) gives

\[
 (B-\mu I)Du=-t\beta.
\tag{4.9}
\]

Projecting (4.9) onto \(\operatorname{Ran}F\), and using \(t>0\), proves
\(F\beta=0\).  If \(y\in\operatorname{Ran}F\), equation (1.7) gives

\[
 (A-\mu I)D^*y
 =\eta\langle\beta,y\rangle=0,
\]

so \(D^*y\in E\).  Consequently

\[
 \langle y,Du\rangle
 =\langle D^*y,P\eta\rangle
 =\langle D^*y,\eta\rangle
 =\langle y,D\eta\rangle,
\]

which proves \(FDu=Fd\).  Applying \(S\) to (4.9) gives
\((I-F)Du=-tS\beta\), and hence (4.2).

Apply \(D^\dagger\) to (4.2).  The noncentral part of \(u\) is

\[
 (I-|e_0\rangle\langle e_0|)u
 =D^\dagger Fd-tD^\dagger S\beta.
\]

The central coefficient is determined by
\(\langle\eta,u\rangle=t\).  Solving that scalar equation gives precisely
the central terms in (4.4)--(4.5), proving \(u=g+th\).  Finally
\(t=\|P\eta\|^2=\|u\|^2\), which proves (4.6), (4.8), and (4.7).  \(\square\)

## 5. Trace and principal-angle obstruction

Continue under the hypotheses of Theorem 4.1, in particular \(t>0\).

Define the collision image

\[
 W=\operatorname{Ran}(D^*F),\qquad P_W=P_W^{\rm orth}.
\tag{5.1}
\]

The map \(D^*:H_-\to H_+\) is injective, so
\(\dim W=\operatorname{rank}F\).  By (4.1), \(W\subset E\), hence

\[
 P_W\leq P.
\]

For every low transverse projector,

\[
 \boxed{
 T=\operatorname{tr}(P_LP)
 \geq\operatorname{tr}(P_LP_W)
 =\sum_j\cos^2\phi_j,}
\tag{5.2}
\]

where \(\phi_j\) are the principal angles between \(W\) and
\({\cal L}=\operatorname{Ran}P_L\), padded by \(\pi/2\) if necessary.
Indeed, \(P-P_W\) is an orthogonal projector and

\[
 \operatorname{tr}\bigl(P_L(P-P_W)\bigr)
 =\operatorname{tr}\bigl((P-P_W)P_L(P-P_W)\bigr)\geq0.
\]

Thus a collision branch cannot satisfy the checkpoint-0.74 target

\[
 T=O(Y^2/\lambda)
\tag{5.3}
\]

unless the collision image itself has the corresponding principal-angle
decay.  If \(W\cap{\cal L}\ne\{0\}\), the right side of (5.2) is at least
one and (5.3) is impossible whenever \(Y\leq1\) and
\(\lambda\to\infty\).

There is a second, source-specific obstruction.  Equation (4.1) makes the
collision component invisible to every estimate driven only by \(\beta\):

\[
 F\beta=0,
\qquad
 Du=\underbrace{Fd}_{\text{collision orientation}}
     -\underbrace{tS\beta}_{\text{screened forced response}}.
\tag{5.4}
\]

Weighted-PNT, source-Cauchy, prolate, Krylov, screened-response, and coframe
estimates for \(S\beta\) do not control \(Fd\) without a new identity or
angle estimate.  The weakest clean escape is therefore either:

1. prove actual-source parity noncollision \(F=0\) and then prove the
   tangent bound (0.1); or
2. retain the singular decomposition and separately prove the collision
   principal-angle rate in (5.2), together with the mixed numerator in
   (4.7) and the remaining part of \(T\).

This is a reduction, not either missing estimate.

## 6. Exact source-Cauchy fixtures

All fixtures below use the exact raw formula (1.2).  Sections 6.1--6.2 set
\(b_n=0\), while Section 6.3 deliberately retains a nonzero source forcing.
They are source-Cauchy matrices, but they are not the pinned arithmetic Weil
matrix and their declared anchors are not the actual source prolate state.

### 6.1 Regular rank-one fixture

Take \(N=2\), \(G>0\), and

\[
 a_0=0,\qquad a_{\pm1}=G,\qquad a_{\pm2}=2G.
\tag{6.1}
\]

Then

\[
 A=\operatorname{diag}(0,G,2G),\qquad
 B=\operatorname{diag}(G,2G),\qquad F=0.
\tag{6.2}
\]

Let

\[
 \kappa={3\over5}e_0+{4\over5}e_1^+,
 \qquad
 w=-{4\over5}e_0+{3\over5}e_1^+,
 \qquad P_L=|w\rangle\langle w|.
\tag{6.3}
\]

The exact values are

\[
 |\alpha|^2=Y^2={9\over25},\qquad
 T={16\over25}=1-Y^2,
\qquad \tan^2\theta={16\over9}.
\tag{6.4}
\]

Thus every inequality in (3.2)--(3.4) can be attained sharply.

### 6.2 Collision decomposition fixture

Take \(N=2\), \(G>0\), and

\[
 a_0=a_{\pm1}=0,
 \qquad a_{\pm2}=G.
\tag{6.5}
\]

Then

\[
 A=\operatorname{diag}(0,0,G),\qquad
 B=\operatorname{diag}(0,G),\qquad
 E=\operatorname{span}\{e_0,e_1^+\},
\tag{6.6}
\]

\[
 F=|e_1^-\rangle\langle e_1^-|,
 \qquad \beta=0,
 \qquad u=e_0+\sqrt2e_1^+,
 \qquad t=3.
\tag{6.7}
\]

Here

\[
 d=\sqrt2e_1^-+2\sqrt2e_2^-,
 \qquad Fd=\sqrt2e_1^-,
 \qquad S\beta=0,
\tag{6.8}
\]

and (4.4)--(4.5) give

\[
 g=-2e_0+\sqrt2e_1^+,
 \qquad h=e_0,
 \qquad g+3h=u.
\tag{6.9}
\]

The scalar equation is

\[
 t=(t-2)^2+2,
\tag{6.10}
\]

whose positive roots are \(2\) and \(3\).  Only the actual projector in
(6.6) selects \(t=3\), proving that (4.8) alone is not a reconstruction
theorem.

For the same fixture, take \(\kappa=e_0\) and
\(P_L=|e_1^+\rangle\langle e_1^+|\).  Then

\[
 Y^2=1,\qquad W=\operatorname{span}\{e_1^+\},
 \qquad T=\operatorname{tr}(P_LP)=1.
\tag{6.11}
\]

The principal-angle lower bound (5.2) is an equality, so no
\(O(1/\lambda)\) trace rate follows from the commutator.

Finally let

\[
 x={e_0+\sqrt2e_1^+\over\sqrt3},\qquad
 w={\sqrt2e_0-e_1^+\over\sqrt3},
\tag{6.12}
\]

and, for \(R_j=2^j\),

\[
 c_j={2R_j\over1+R_j^2},\qquad
 s_j={R_j^2-1\over R_j^2+1},\qquad
 \kappa_j=c_jx+s_jw.
\tag{6.13}
\]

Every \(\kappa_j\) is a unit exact ground vector with zero residual and
\(Y^2=1\), while \(|\alpha_j|=c_j\) tends to zero exponentially in \(j\).
Thus the regular identity \(|\alpha|^2=Y^2\) does not extend to a general
collision branch: a rank-one ground space is essential.  Noncollision
guarantees that rank-one hypothesis, but is not logically necessary for the
identity; a visible rank-one ground at a collision still obeys the same
rank-one calculation.  Neither the singular Moore--Penrose formulas nor a
fixed gap above a multiple ground space supplies the missing orientation
rate.

### 6.3 Zero-visibility collision counterfixture

Take \(N=1\), \(c>0\), and the exact raw source data

\[
 a_0=a_{\pm1}=c,
 \qquad b_1=c,\quad b_0=0,\quad b_{-1}=-c.
\tag{6.14}
\]

In the raw order \((-1,0,1)\), \(Q\) is \(c\) times the all-ones matrix,
and its parity blocks are

\[
 A=c\begin{pmatrix}1&\sqrt2\\ \sqrt2&2\end{pmatrix},
 \qquad B=(0),
 \qquad \eta=\binom1{\sqrt2},
 \qquad \beta=\sqrt2c\,e_1^-.
\tag{6.15}
\]

At \(\mu=0\),

\[
 E=\operatorname{span}\{-\sqrt2e_0+e_1^+\},
 \qquad F=I_{H_-},
 \qquad P\eta=0,
 \qquad t=0,
 \qquad F\beta=\beta\ne0.
\tag{6.16}
\]

Therefore Theorem 4.1 cannot be invoked at \(t=0\): neither \(x\) nor
\(\alpha\) exists, and division of (4.9) by \(t\) would manufacture the
false conclusion \(F\beta=0\).  The branch is rejected rather than treated
as a limit of visible collisions.

## 7. Exact conclusion

The source commutator yields the following complete branch split.

* If \(\mu\notin\operatorname{spec}(B)\), the even ground is rank one and
  the two checkpoint-0.74 mixed quantities reduce to one acute angle.  A
  proved tangent bound \(\tau=O(\lambda^{-1/2})\) would close both at once.
* In the visible collision branch with \(t>0\), the exact term \(Fd\), the
  embedded ground subspace \(D^*\operatorname{Ran}F\), and its principal
  angles must be controlled.  They are invisible to the \(\beta\)-forced
  screened resolvent.
* The branch \(t=0\) is a failed branch for the canonical construction:
  \(x\) and \(\alpha\) are undefined, and (6.14)--(6.16) show that
  \(F\beta=0\) need not hold.

The split is exact finite algebra.  No admitted branch currently carries
the missing actual-source unbounded-schedule estimate.
