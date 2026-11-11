# Positive origin limits for both first-reduced theta source determinants

**Role in the completed checkpoint.** This is a proof component. The [global theorem](theta_second_preservation_global_20261111.md) combines the source crossing, compensation, first-source origin, and second-origin results to prove second preservation and five-node positivity. Statements below limiting an individual component retain that local scope.


Research continuation, 11 November 2026. This note proves the all-anchor
endpoint assertion needed by the compensated spatial transfer theorem.
The origin and the spatial transfer are distinct proof steps.

## 1. The theorem and normalization

For the actual theta kernel and its first canceled pair, write

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\quad C(t)=\frac14\int_t^\infty s\kappa(s)\,ds,
\quad p=p(a)=F'(a)/F(a),
$$

$$
n_a+ab_a=C,\qquad an_a+4b_a''=p\kappa.
$$

For the canonical pair (b_a,n_a), put

$$
H_1=b_a/n_a,\quad B_1=4b_a''/n_a,\quad
J_1=4n_a''/n_a,\quad P_1=16b_a^{(4)}/n_a.
$$

**Theorem.** For every fixed a>0, both limits exist and are strictly
positive:

$$
\boxed{
\lim_{t\downarrow0}\frac{W_3(B_1',J_1',-H_1')}{t^6}>0,
\qquad
\lim_{t\downarrow0}\frac{W_3(B_1',J_1',P_1')}{t^6}>0.}
\tag{1}
$$

W_m denotes the ordinary Wronskian, with derivative rows 0,...,m-1.
All spatial functions are extended evenly. The proof covers 0<a<=100
by a rigorous moment certificate, and a>=100 by a Taylor estimate and
four explicit positive polynomials. Neither an anchor grid nor an
uncertified numerical sign is used.

## 2. Exact endpoint formulas

Define

$$
q=a^2,\quad N=\frac{n_a(0)}{\kappa(0)},\quad d=1+ap,
\quad h=\frac{C(0)}{\kappa(0)},
$$

$$
c=-\frac{\kappa''(0)}{\kappa(0)},\quad
\beta=\frac{\kappa^{(4)}(0)}{\kappa(0)},\quad
\gamma=\frac{\kappa^{(6)}(0)}{\kappa(0)},\quad
\delta=\frac{\kappa^{(8)}(0)}{\kappa(0)}.
$$

The signs of gamma and delta are retained; gamma is negative. Put

$$
Y=qN-d,\qquad Z=qY+4c(d+2),\qquad T=qZ-16\beta(d+4).
\tag{2}
$$

Differentiating the canceled ODE gives

$$
\frac{4n_a''(0)}{\kappa(0)}=Y,\qquad
\frac{16n_a^{(4)}(0)}{\kappa(0)}=Z,\qquad
\frac{64n_a^{(6)}(0)}{\kappa(0)}=T.
$$

In the even spatial coordinate u=t^2, form the five columns

$$
\mathbf n=\begin{pmatrix}N\\Y/8\\Z/192\\T/7680\end{pmatrix},
\quad
\mathbf k=\begin{pmatrix}1\\-c/2\\\beta/12\\\gamma/120\end{pmatrix},
\quad
\mathbf j=\begin{pmatrix}0\\-c\\\beta/3\\\gamma/20\end{pmatrix},
$$

$$
\mathbf c=\begin{pmatrix}h\\-1/8\\c/16\\-\beta/96\end{pmatrix},
\qquad
\mathbf k_2=\begin{pmatrix}-c\\\beta/2\\\gamma/12\\\delta/120\end{pmatrix}.
$$

These are the u-derivative rows 0,...,3 of n_a, kappa, t*kappa', C,
and kappa'', respectively, each divided by the constant kappa(0).
Set

$$
D_H=64\det(\mathbf n,\mathbf k,\mathbf j,\mathbf c),
\qquad
D_P=-256\det(\mathbf n,\mathbf k,\mathbf j,\mathbf k_2).
\tag{3}
$$

The determinant elimination established in the source note and the
even-coordinate factor 64t^6 now give

$$
\boxed{
\lim_{t\downarrow0}\frac{W_3(B_1',J_1',-H_1')}{t^6}
=\frac{p}{a}\frac{D_H}{N^4},\qquad
\lim_{t\downarrow0}\frac{W_3(B_1',J_1',P_1')}{t^6}
=p^2\frac{D_P}{N^4}.}
\tag{4}
$$

The prefactors are positive. Thus the endpoint problem is precisely
D_H>0 and D_P>0. Both are affine in N and d, with no Nd term,
and polynomial of degree at most three in q. Their rational constant
denominators are 5760 and 360. The executable constructs them directly
from (2)--(3); no long hand-transcribed expansion is required.

Write

$$
D_H=A_H(q)N+B_H(q)d+C_H(q),
\quad D_P=A_P(q)N+B_P(q)d+C_P(q).
\tag{5}
$$

At q=0,N=h,d=1, D_H vanishes identically. This cancellation must be
preserved before any interval evaluation near a=0.

## 3. Compact anchors, with the zero at a=0 removed exactly

The companion `theta_second_source_origin_compact_20261111.py`
recomputes the positive theta moments used by the second-origin
certificate. With A=200 and x=(a/A)^2, write

$$
E(a)=\int_0^\infty\kappa(s)\cosh(as/2)\,ds=e(x),
\qquad
O(a)=\int_0^\infty\kappa(s)\sinh(as/2)\,ds=\frac aA o(x).
$$

Let K=2*kappa(0)*A. Then

$$
N=\frac{P}{Ke},\qquad d=\frac{T_e}{e},\qquad
P=eo+2x(eo'-e'o),\quad T_e=e+2xe'.
$$

The same first odd moment determines h=o(0)/K. This is an exact
identity between the underlying integrals. Let

$$
o_*(x)=\frac{o(x)-o(0)}x,
\qquad D_0(q)=\frac{D_H(q,h,1)}q.
$$

D_0 is a polynomial of degree at most two. The compact certificate
constructs o_* directly from shifted moment coefficients, with its own
explicit remainder; it never divides a ball containing a spurious
constant error by x. With q=A^2*x, the exact cleared numerator is

$$
\boxed{
\frac{D_H}{q}=
\frac{A_H(q)[eo_*+2(eo'-e'o)]
+2KB_H(q)e'+A^2KeD_0(q)}{A^2Ke}.}
\tag{6}
$$

For D_P the cleared numerator is simply

$$
\boxed{D_P=\frac{A_P(q)P+KB_P(q)T_e+KC_P(q)e}{Ke}.}
\tag{7}
$$

At 384-bit precision, 602 freshly computed moment balls, degree-300
even/odd series, explicit theta and spatial integral tails, and 4,096
closed interval cells covering 0<=x<=1/4 prove

$$
\boxed{D_H/a^2>3.07\cdot10^{-8},\qquad D_P>0.36
\quad(0<a\le100).}
\tag{8}
$$

The more precise replay lower bounds are 3.0791284411e-8 and
0.3663058006. The broad displayed margins in (8) are exact rational
bounds. The moment models and error treatment are documented in the
compact companion note. This part proves signs over entire intervals,
including arbitrarily small positive anchors.

## 4. A global twelfth-derivative bound

The tail proof uses the newly certified bound

$$
\boxed{\sup_{t\in\mathbb R}\frac{|\kappa^{(12)}(t)|}{\kappa(0)}
<150000000=:M.}
\tag{9}
$$

On [0,4], take 4,096 dyadic cells of radius r=1/2048. At a cell
midpoint m, Taylor's theorem gives

$$
\frac{|\kappa^{(12)}(t)|}{\kappa(0)}
\le\frac{|\kappa^{(12)}(m)|}{\kappa(0)}
+r\frac{|\kappa^{(13)}(m)|}{\kappa(0)}
+\frac{r^2}{2}\sup_{s\text{ in cell}}
\frac{|\kappa^{(14)}(s)|}{\kappa(0)}.
\tag{10}
$$

All derivative evaluations are outward-rounded theta-series balls,
including explicit omitted-term bounds. The largest certified right
side is below 141955909, strictly below M. Midpoint evaluation in
(10) preserves the cancellations in the high theta derivative; it is
an interval Taylor bound rather than a midpoint sign sample.

For t>=4, let P_12 be the exact derivative polynomial satisfying
kappa^(12)(t)=sum exp(t/4-pi*n^2*exp(t))*P_12(pi*n^2*exp(t)).
Writing its coefficient norm as ||P_12||_1, the Gaussian ratio gives

$$
\frac{|\kappa^{(12)}(t)|}{\kappa(0)}
\le\frac{2\|P_{12}\|_1(4e^t)^{14}e^{t/4-3e^t}}{\kappa(0)}.
\tag{11}
$$

The ratio of successive n terms is at most 2^28*exp(-9e^4)<1/2,
and the logarithmic derivative of the right side is 57/4-3e^t<0.
Its value at t=4 is rigorously below M. Evenness covers negative t.
Thus (10)--(11) prove (9) globally.

## 5. All anchors a>=100

### The permissible interval for d

The fresh integral certificate gives

$$
1<p(100)<3/2.
$$

The second-origin companion proves 0<ap'(a)<1/2 for a>=100,
while p is increasing. Therefore p>1 and

$$
\frac{d}{da}\frac{p(a)}a=\frac{ap'(a)-p(a)}{a^2}<0.
$$

Consequently, for q=a^2>=10000,

$$
\boxed{101\le d=1+ap(a)\le1+\frac3{200}q.}
\tag{12}
$$

The endpoint values in (12) bound a complete interval of possible d;
no numerical approximation of p(a) at variable anchors is used.

### A controlled Laplace expansion of N

Let eta=kappa^(10)(0)/kappa(0). The exact positive Laplace formula

$$
N(a)=\frac14\int_0^\infty(s+2p(a))
\frac{\kappa(s)}{\kappa(0)}e^{-as/2}\,ds
$$

and the global bound (9) give

$$
N=N_5+\varepsilon,
$$

$$
N_5=\frac d q-\frac{4c(d+2)}{q^2}
+\frac{16\beta(d+4)}{q^3}
+\frac{64\gamma(d+6)}{q^4}
+\frac{256\delta(d+8)}{q^5}
+\frac{1024\eta(d+10)}{q^6},
\tag{13}
$$

$$
\boxed{|\varepsilon|\le\frac{4096M(d+12)}{q^7}.}
\tag{14}
$$

Indeed the even Taylor polynomial of kappa/kappa(0) through degree ten
has absolute remainder at most M*s^12/12!. Integrating each monomial
gives the coefficient 4^j(d+2j)/q^(j+1). Applying the same calculation
to the remainder gives (14). This error is global in the integration
variable; no truncated Laplace integral is substituted.

### Four positive polynomials finish the proof

Direct rigorous evaluation of the coefficients in (5) proves that
every coefficient of A_H is positive and every coefficient of A_P
is negative. It follows from (14) that

$$
q^7D_H\ge L_H(q,d):=q^7D_H(q,N_5,d)
-4096M A_H(q)(d+12),
$$

$$
q^7D_P\ge L_P(q,d):=q^7D_P(q,N_5,d)
+4096M A_P(q)(d+12).
\tag{15}
$$

Both L_H and L_P are polynomials, affine in d. Thus it suffices to
prove their positivity at the two endpoints in (12). The executable
forms all four polynomials in (16) exactly before evaluating the theta
constants as outward-rounded balls:

$$
\begin{aligned}
&L_H(10000+X,101),&&L_H(10000+X,1+3(10000+X)/200),\\
&L_P(10000+X,101),&&L_P(10000+X,1+3(10000+X)/200).
\end{aligned}
\tag{16}
$$

Their degrees are respectively 5, 6, 5, 5. Every coefficient has a
strictly positive lower bound. The constant coefficients are greater
than 1.9e24, 3.4e24, 3.8e27, and 3.1e27, respectively. Complete
coefficient balls appear in the replay; these conservative margins
are exact rational inequalities. Hence all four expressions are
strictly positive for every X>=0. Affinity in d and (12) imply
L_H,L_P>0 on the entire permissible region. Equation (15) proves

$$
\boxed{D_H>0,\qquad D_P>0\qquad(a\ge100).}
\tag{17}
$$

Combining (8), (17), and the positive factors in (4) proves the theorem.

## 6. Scope and reproducibility

`theta_second_source_origin_20261111.py` recomputes the determinant
formulas, exact Laplace coefficients, theta constants, p(100), the
4,096-cell global twelfth-derivative certificate, the analytic spatial
tail, and every shifted coefficient in (16). It rejects Python
optimization and reads no diagnostic cache. Its replay is
`theta_second_source_origin_replay_20261111.json`.

The compact companion similarly recomputes the full moment certificate.
The only extra large-anchor input is the proved real-axis estimate
0<ap'(a)<1/2 from `theta_second_origin_20261111.md`; its derivation and
exact rational checks are recorded there. The remaining fixed inputs
are the actual theta normalization, evenness, positive canceled kernels,
and theta derivative/cancellation formulas from PRs #51–52.

The endpoint theorem (1), together with the independently proved
one-sign-change compensation theorem and the source crossing
certificates, can establish the first-reduced source inequalities on
the full positive spatial axis. The second-preservation and Pick
consequences require those additional steps and their hypotheses;
they are not inferred from endpoint positivity alone.
