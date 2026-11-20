# A quantitative collective-zero certificate for the twin-ladder heat flow

## Status and scope

This note completes an analytic certificate design. It does **not** certify a new numerical upper bound for the de Bruijn–Newman constant, and it does not prove RH. The completed results are the error-aware contour formula, the resulting collective contraction inequality, its integrated slab bound, and explicit error bounds for a symmetric finite theta approximation. A supplied implementation still has to verify those hypotheses on an actual global zero envelope.

The main practical change is to retain a **cluster of nearby arithmetic zeros** in the contraction estimate. Their contribution can be substantially larger than the single reflection partner on the opposite side of the torus. A second copy of an arithmetic zero on another torus sheet must never be counted as an additional zero.

## 1. Normalization audit

Use the standard de Bruijn–Newman parameter $\tau$:

$$
H_\tau(z)=\int_0^\infty e^{\tau u^2}\Phi(u)\cos(zu)\,du,
\qquad
\partial_\tau H_\tau=-\partial_z^2H_\tau,
$$

$$
\Phi(u)=\sum_{n\ge1}
\bigl(2\pi^2n^4e^{9u}-3\pi n^2e^{5u}\bigr)e^{-\pi n^2e^{4u}},
\qquad
H_0(z)=\tfrac18\xi(\tfrac12+iz/2).
$$

Thus $H_\tau$ has only real zeros exactly when $\tau\ge\Lambda$. A smaller positive **upper** bound is progress toward RH. A strictly positive lower bound would disprove RH, since the established lower bound is already $\Lambda\ge0$.

For the centered xi variable $w=s-\tfrac12$, define

$$
X_\theta(w)=8H_{4\theta}(-2iw).
$$

Then

$$
\partial_\theta X_\theta=\partial_w^2X_\theta,
\qquad \tau=4\theta.
$$

The threshold in this kernel-time convention is $\theta=\Lambda/4$, not $\Lambda$. To see the multiplier directly, put $v=2u$:

$$
X_\theta(w)=\frac12\int_{\mathbb R}
\Psi(v)e^{\theta v^2}e^{wv}\,dv,
\qquad \Psi(v)=4\Phi(v/2).
$$

In standard coordinates,

$$
M_\tau(x,y)=|H_\tau(x+iy)|^2,
\quad W_\tau=\tfrac12\partial_yM_\tau,
\quad
2\partial_\tau M=M_{yy}-M_{xx},
\quad
2\partial_\tau W=W_{yy}-W_{xx}.
$$

Consequently, if
$M=\sum_{n\ge0}A_n(x)y^{2n}/(2n)!$, then

$$
2\partial_\tau A_n=A_{n+1}-\partial_x^2A_n,
\qquad A_1=2\bigl((H_\tau')^2-H_\tau H_\tau''\bigr).
$$

These formulas audit the signs and the factor of four. They also show that finite-rung freezing is not closed without a remainder estimate.

## 2. Zero dynamics and the quartet term

At a simple zero $z=x+iy$,

$$
z'=\frac{H_\tau''(z)}{H_\tau'(z)}
=2\operatorname{PV}\sum_{\rho\ne z}\frac1{z-\rho}.
\tag{2.1}
$$

The sum uses the symmetric principal-value convention. This formula for complex zeros is Proposition 3.1 of Polymath [P]. For a globally highest zero, every other zero has imaginary part at most $y$. Writing $U=y^2$, each other zero $\rho=a+ib$ contributes

$$
-4y\frac{y-b}{(x-a)^2+(y-b)^2}
\tag{2.2}
$$

to $U'$, which is nonpositive.

The conjugate zero $\bar z$ contributes $-2$. The opposite reflection $-z$ contributes $-2U/(x^2+U)$. The remaining quartet member $-\bar z$ contributes zero. Hence

$$
U'\le-2-\frac{2U}{x^2+U}.
\tag{2.3}
$$

There is no double counting in the actual theta family: $\Phi(u)>0$ for $u\ge0$, so $H_\tau(iy)>0$ and a nonreal zero cannot have $x=0$.

**Prior-art qualification.** The proof of Proposition 3.3 of [P] already uses the negative sign of this opposite reflection term. Interpreting it as an anti-bridge contribution does not create a new interaction. The integrated expression below is an elementary quantitative extraction of that known term.

If every point attaining the global height envelope stays within $|x|\le X$, (2.3) gives the conditional landing-time estimate

$$
B_X(\Delta)=\int_0^{\Delta^2}\frac{X^2+u}{2(X^2+2u)}\,du
=\frac{\Delta^2}{4}
+\frac{X^2}{8}\log\left(1+\frac{2\Delta^2}{X^2}\right).
\tag{2.4}
$$

Its improvement over $\Delta^2/2$ is only $\Delta^4/(4X^2)+O(\Delta^6/X^4)$ for large $X$. This motivates retaining nearby clusters instead.

## 3. The collective field can be measured off the zeros

Fix a time $\tau$. Let $C_1,\ldots,C_m$ be disjoint positively oriented, piecewise smooth Jordan contours. Their interiors are bounded, $H_\tau$ has no zero on their boundaries, and the candidate point $z$ is outside their closed interiors. Require also that neither $z$ nor its conjugate belongs to any contour interior.

Define

$$
S_j(z)=\frac1{2\pi i}\oint_{C_j}
\frac{H_\tau'(w)}{H_\tau(w)}\frac{dw}{z-w}.
\tag{3.1}
$$

The residue theorem gives the exact finite identity

$$
S_j(z)=\sum_{\rho\ \mathrm{inside}\ C_j}\frac{m_\rho}{z-\rho}.
\tag{3.2}
$$

Let

$$
\mathcal A(z)=-\Im\sum_jS_j(z).
\tag{3.3}
$$

At a simple globally highest zero $z=x+iy$, all omitted terms in (2.2) are nonpositive. Therefore

$$
\boxed{U'\le-2-4y\mathcal A(z).}
\tag{3.4}
$$

The $-2$ is the separately retained conjugate. If the selected contours contain the opposite reflection $-z$, it is already included in $\mathcal A$ and must not be added again. Alternatively, exclude the entire quartet and append its explicit opposite-reflection contribution.

The selected zeros need not already be known to be real. Contour zero counts and (3.1) are valid for complex clusters as well. Their nonnegative individual contribution follows at a *global* highest zero, not from an assumption of RH.

## 4. Explicit transfer from a finite approximation

Let $B_\tau$ be holomorphic and nonvanishing on and inside each contour and on an exterior collar. Put $G_\tau=H_\tau/B_\tau$; one may simply take $B_\tau=1$. Assume a holomorphic finite approximation $F_\tau$ and certified bounds on each contour,

$$
|G_\tau-F_\tau|\le\varepsilon_0(w),
\quad |G_\tau'-F_\tau'|\le\varepsilon_1(w),
\quad |F_\tau(w)|>\varepsilon_0(w).
\tag{4.1}
$$

These inequalities imply that both $F_\tau$ and $G_\tau$ are nonzero on the contours. The logarithmic derivative error is

$$
\left|\frac{G_\tau'}{G_\tau}-\frac{F_\tau'}{F_\tau}\right|
\le
E(w):=
\frac{|F_\tau(w)|\varepsilon_1(w)+|F_\tau'(w)|\varepsilon_0(w)}
{|F_\tau(w)|\bigl(|F_\tau(w)|-\varepsilon_0(w)\bigr)}.
\tag{4.2}
$$

Proof: write $G=F+R$. The difference is
$(R'F-F'R)/(F(F+R))$; apply the triangle and reverse-triangle inequalities.

The normalization does not change the contour trace. Indeed,
$H'/H=G'/G+B'/B$, and
$\oint_C(B'/B)(z-w)^{-1}dw=0$, because $z$ lies outside and $B$ is nonvanishing inside.

Define the computable finite trace

$$
S_{F,j}(z)=\frac1{2\pi i}\oint_{C_j}
\frac{F_\tau'(w)}{F_\tau(w)}\frac{dw}{z-w}.
$$

Then

$$
|S_j(z)-S_{F,j}(z)|\le
\delta_j(z):=\frac1{2\pi}\oint_{C_j}\frac{E(w)}{|z-w|}\,|dw|.
\tag{4.3}
$$

A simpler uniform bound for $z$ in a target region $T$ is

$$
\delta_j\le
\frac{\operatorname{length}(C_j)}{2\pi\,\operatorname{dist}(T,C_j)}
\sup_{w\in C_j}E(w).
\tag{4.4}
$$

If certified numerical contour integration produces $\widehat S_{F,j}$ with error at most $q_j$, then the complete lower certificate is

$$
\boxed{
\mathcal A(z)\ge
-\Im\sum_j\widehat S_{F,j}(z)-\sum_j(\delta_j+q_j)
=:\mathcal A_{\rm cert}(z).
}
\tag{4.5}
$$

Every quantity is evaluated away from zeros. No unstable division by $H_\tau(z)=0$ occurs. The contour integration error $q_j$ must be included; an unvalidated quadrature sum is not a certificate.

### Derivative errors from a scalar remainder

If $R=G-F$ is holomorphic in every disk $D(w,r)$ centered on a contour and $|R|\le\varepsilon_0^+$ throughout those disks, Cauchy's inequality gives

$$
\varepsilon_1(w)\le\varepsilon_0^+/r.
\tag{4.6}
$$

This permits use of an existing rigorously bounded normalized approximation without independently differentiating its error formula.

**Analytic truncation requirement.** The Riemann–Siegel approximation in [P] is holomorphic only where its truncation index is fixed. A contour and its collar must lie in such a region, or one must use an analytic fixed-index formula with the corresponding adjusted error. Inserting values across an uncorrected truncation jump invalidates (3.1), (4.2), and (4.6).

## 5. A slab certificate with an explicit improved upper bound

Choose $0<\eta<\Delta$ and $\kappa>0$. Suppose:

1. At $\tau_0$, every zero of $H_{\tau_0}$ lies in $|\Im z|\le\Delta$.
2. Throughout the time interval considered, a certified tail exclusion places every zero with $\Im z\ge\eta$ in a bounded region covered by finitely many target boxes.
3. For each target box, uniformly in time and $\eta\le y\le\Delta$, valid contour certificates of Sections 3–4 establish
   $\mathcal A_{\rm cert}(x+iy)\ge\kappa y$.
   The selected contours exclude the target box and its conjugate, and do not overlap one another.

Then, at any simple globally highest zero while $U\ge\eta^2$,

$$
U'\le-2-4\kappa U.
\tag{5.1}
$$

The time needed to enter the strip $|\Im z|\le\eta$ is at most

$$
T_{\Delta\to\eta}
=\frac1{4\kappa}
\log\frac{1+2\kappa\Delta^2}{1+2\kappa\eta^2}.
\tag{5.2}
$$

Thereafter the ordinary de Bruijn theorem gives a remaining time $\eta^2/2$. Consequently,

$$
\boxed{
\Lambda\le\tau_0+
\frac1{4\kappa}
\log\frac{1+2\kappa\Delta^2}{1+2\kappa\eta^2}
+\frac{\eta^2}{2}.
}
\tag{5.3}
$$

The interval on which hypotheses 2–3 are verified must cover at least the duration in (5.2). This is strictly better than $\tau_0+\Delta^2/2$ whenever the hypotheses hold and $\kappa>0$.

### Continuity and multiple zeros

The displayed differential inequality is initially derived for simple zeros. The global conclusion uses the standard first-contact barrier argument rather than assuming all zeros remain simple. The local multiple-zero splitting in Proposition 3.1(ii) of [P] rules out a multiple zero as a first upward contact with a smooth upper barrier: just before such a collision a split root lies higher by an amount of order $\sqrt{\tau_*-\tau}$, exceeding the barrier's linear change. For a simple first contact, use a comparison barrier with an arbitrarily small outward slack in (5.1), obtain the contradiction, and let the slack tend to zero. The bounded tail exclusion in hypothesis 2 prevents contact from escaping to infinity. This supplies the usual extension through multiple-zero events.

A slab $y\ge\eta>0$ is deliberate: a fixed absolute error in (4.5) divided by $y$ becomes costly as $y\to0$. There is no requirement to certify a vanishingly thin final strip with the same approximation. Several slabs with different $\kappa_j$ can be concatenated, each using the logarithmic expression in (5.2), followed by the final de Bruijn remainder.

## 6. A cheaper count-and-box certificate

Contour integration of the full Cauchy transform may be unnecessary. Suppose a conjugation-invariant cluster of $m_j$ zeros is certified inside a rectangle

$$
|\Re\rho-a_j|\le r_j,\qquad |\Im\rho|\le h_j,
$$

and the cluster excludes $z,\bar z$. At a global maximum, every numerator $y-\Im\rho$ is nonnegative. Conjugation symmetry gives $\sum\Im\rho=0$, so

$$
-\Im S_j(z)
\ge
\frac{m_jy}{(|x-a_j|+r_j)^2+(y+h_j)^2}.
\tag{6.1}
$$

If $x\in I$ and $y\le\Delta$, set
$D_j=(\sup_{x\in I}|x-a_j|+r_j)^2+(\Delta+h_j)^2$. Then

$$
\mathcal A(z)\ge y\sum_jm_j/D_j.
\tag{6.2}
$$

Thus $\kappa=\sum_jm_j/D_j$ is sufficient in Section 5. Rouché's inequality $|F|>\varepsilon_0$ transfers an independently certified zero count of $F$ to $H$. Nearby clusters can dominate (6.2); their positions need not be resolved to individual zeros.

## 7. One explicit symmetric finite theta backend

The contour theorem accepts any certified analytic approximation. The following construction provides a direct backend at moderate spectral height. For the very high heights used by current upper-bound computations, normalized Riemann–Siegel approximations are more efficient; direct cosine quadrature resolves oscillations on scale $1/|x|$.

Let $I_\tau=[\tau_a,\tau_b]$, $T=\max(\tau_b,0)$, $S=\max(|\tau_a|,|\tau_b|)$, and suppose the evaluation region satisfies $|\Im z|\le Y$, $|z|\le Z$. Choose $U>0$, $N\ge1$, and $J\ge1$, with $h=U/J$, $u_j=(j+\tfrac12)h$. Put

$$
\Phi_N(u)=\sum_{n=1}^N
(2\pi^2n^4e^{9u}-3\pi n^2e^{5u})e^{-\pi n^2e^{4u}},
$$

$$
F_\tau(z)=h\sum_{j=0}^{J-1}
e^{\tau u_j^2}\Phi_N(u_j)\cos(u_jz).
\tag{7.1}
$$

This finite approximation is real-even and solves $\partial_\tau F=-F_{zz}$ exactly. Its scalar and first-derivative errors have the decomposition

$$
\varepsilon_k\le Q_k+V_k+P_k,\qquad k=0,1,
\tag{7.2}
$$

where the terms below are quadrature, theta-index, and integration-tail errors.

### 7.1 Integration tail, all constants explicit

Define

$$
q_0=e^{-3\pi},\qquad
C_\Phi=2\pi^2\frac{1+11q_0+11q_0^2+q_0^3}{(1-q_0)^5}.
$$

The elementary inequalities $n^2-1\ge3(n-1)$ for integer $n\ge1$ and $\Phi(u)>0$ give

$$
0<\Phi(u)\le C_\Phi e^{9u-\pi e^{4u}},\qquad u\ge0.
$$

For $k=0,1$, suppose

$$
16\pi e^{4U}\ge2T,
\qquad a_k=4\pi e^{4U}-2TU-(9+Y)-k/U>0.
$$

Then

$$
P_k\le
\frac{C_\Phi U^k}{a_k}
\exp\bigl(TU^2+(9+Y)U-\pi e^{4U}\bigr).
\tag{7.3}
$$

Proof: the logarithm of the tail majorant is
$g_k(u)=Tu^2+(9+Y)u+k\log u-\pi e^{4u}$. Its second derivative is nonpositive for $u\ge U$; hence $g_k(u)\le g_k(U)-a_k(u-U)$, which integrates to (7.3).

### 7.2 Omitted theta indices

Put $m=N+1$, $q=e^{-\pi(2m+1)}$, and

$$
C_m=\frac{m^4}{1-q}
+\frac{4m^3q}{(1-q)^2}
+\frac{6m^2q(1+q)}{(1-q)^3}
+\frac{4mq(1+4q+q^2)}{(1-q)^4}
+\frac{q(1+11q+11q^2+q^3)}{(1-q)^5}.
$$

Since $(m+j)^2\ge m^2+(2m+1)j$,

$$
0\le\Phi(u)-\Phi_N(u)
\le2\pi^2C_m e^{9u-\pi m^2e^{4u}}.
$$

If $b=4\pi m^2-(9+Y)-2TU>0$, this yields

$$
V_k\le2\pi^2C_m e^{-\pi m^2}\frac{k!}{b^{k+1}}.
\tag{7.4}
$$

The proof bounds the derivative of
$Tu^2+(9+Y)u-\pi m^2e^{4u}$ above by $-b$ on $[0,U]$, then extends the resulting $u^ke^{-bu}$ integral to infinity. If $b\le0$, a universally valid weaker alternative is

$$
V_k\le2\pi^2C_m\frac{U^{k+1}}{k+1}
\exp\bigl(TU^2+(9+Y)U-\pi m^2\bigr).
\tag{7.5}
$$

### 7.3 Composite midpoint error

Let
$f_k(u;\tau,z)=\partial_z^k[e^{\tau u^2}\Phi_N(u)\cos(zu)]$.
If $M_{k,2}$ is a certified uniform upper bound for $|\partial_u^2f_k|$ on $[0,U]\times I_\tau$ and the evaluation region, the complex-valued midpoint remainder gives

$$
Q_k\le Uh^2M_{k,2}/24.
\tag{7.6}
$$

Here is an explicit scalar majorant from which $M_{k,2}$ can be obtained. For $a\in\{5,9\}$, $d=\pi n^2$, set

$$
E_{n,a}(u)=e^{Tu^2+(a+Y)u-de^{4u}},\quad
D_{1,n,a}(u)=2Su+a+4de^{4u}+Z,\quad
D_{2,n}(u)=2S+16de^{4u},
$$

$$
L_{0,n,a}=E_{n,a}(D_{1,n,a}^2+D_{2,n}),
\qquad
L_{1,n,a}=E_{n,a}\{2D_{1,n,a}+u(D_{1,n,a}^2+D_{2,n})\}.
$$

Then one may take

$$
M_{k,2}\ge
\sup_{0\le u\le U}\sum_{n=1}^N
\{2\pi^2n^4L_{k,n,9}(u)+3\pi n^2L_{k,n,5}(u)\}.
\tag{7.7}
$$

The supremum is a one-dimensional positive-function enclosure, suitable for interval subdivision. An explicit, looser closed bound replaces every $E_{n,a}(u)$ by $\exp(TU^2+(a+Y)U-d)$, every $D$ by its value at $U$, and $u$ by $U$ in the braces.

Equations (7.2)–(7.7) bound the mathematical approximation. Floating-point roundoff in coefficients, function evaluation, and contour quadrature requires separate interval enclosures or additional additive error terms.

## 8. Noncircular implementation target

The next runnable certificate should provide the following concrete data:

1. A previously certified initial strip at $\tau_0$, with its source and normalization.
2. An analytic tail exclusion valid throughout the chosen time interval, not just at its initial endpoint.
3. Target boxes covering every possible globally highest zero with $y\ge\eta$.
4. For each target box, nearby disjoint zero-cluster contours, an analytic approximation on collars, and certified $\varepsilon_0,\varepsilon_1,q_j$.
5. A positive common $\kappa$, or a positive value for each height slab, verified from (4.5) or (6.2).
6. The resulting expression (5.3), compared with the existing certificate using the same initial-strip input.

The torus supplies a useful symmetry organization for these data. The arithmetic certification is still performed on actual zeros of $H_\tau$. A geometric meeting point does not replace any of the six items.

## 9. Validation and limits

The accompanying `verify_collective_certificate.py` checks the logarithmic derivative identity, normalization chain rule, amplitude transport identity, and an exact even-polynomial heat-flow example with a nonreal quartet plus nearby real zeros. It also checks the integrated landing-time formulas symbolically. The polynomial example illustrates the size of the collective term, but is not evidence of any particular contraction constant for the Riemann theta family. The script does not implement a global interval certificate for $H_\tau$.

## References

[P] D. H. J. Polymath, *Effective approximation of heat flow evolution of the Riemann xi function, and a new upper bound for the de Bruijn–Newman constant*, Research in the Mathematical Sciences 6 (2019), 31. [arXiv:1904.12438v2](https://arxiv.org/html/1904.12438v2). Relevant locations: Proposition 3.1 (complex zero dynamics and multiple-zero splitting); Theorem 3.2 (strip contraction); Proposition 3.3 (barrier argument and quartet sign); Theorem 1.3 and the following analyticity remark (normalized approximation); Theorem 1.5(i) (eventually real zeros at positive time).

[RT] B. Rodgers and T. Tao, *The de Bruijn–Newman constant is non-negative*, Forum of Mathematics, Pi 8 (2020), e6. [arXiv:1801.05914](https://arxiv.org/abs/1801.05914).

