# Global actual-theta ratio theorem and interval proof

Research continuation, 10 November 2026. This is a computer-assisted
proof of the two pointwise ratio inequalities left open in PR #50.
An analytic comparison theorem removes the anchor parameter. Rigorous
interval arithmetic covers a compact spatial interval, and an explicit
analytic estimate covers the full tail. No finite-height zero
verification or RH assumption enters this argument. No novelty claim
or all-order preservation theorem is asserted.

## 1. The actual kernel and theorem

Use the theta kernel

$$
\kappa(t)=e^{t/4}\sum_{n\ge1}
\bigl[2(\pi n^2e^t)^2-3\pi n^2e^t\bigr]e^{-\pi n^2e^t},
\qquad t\ge0,
$$

extended evenly. In the preceding normalization,

$$
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}dt,
\qquad L=F'/F,
\qquad C(t)=\frac14\int_t^\infty s\kappa(s)ds.
$$

The classical theta input is $\kappa>0$, $\kappa'<0$ on $t>0$,
and $Q=-\kappa'/(t\kappa)>0$, $Q'>0$. The last property is the
squared-variable log-concavity recorded by Csordas, Theorem 4.2(b),
with $\kappa(t)=\Phi(t/4)$. It gives $4QC<\kappa$ and hence
$(C/\kappa)'<0$. The preceding first-pair theorem gives positive even
kernels $n_a,b_a$, for every $a>0$, satisfying

$$
n_a+a b_a=C,\qquad
an_a+4b_a''=p\kappa,\qquad p=L(a)>0.
$$

**Theorem.** For the actual theta kernel and every $a,t>0$,

$$
\boxed{
\left(\frac{n_a}{b_a}\right)'(t)>0,
\qquad
\left(\frac{n_a}{\kappa}\right)'(t)<0.
}
\tag{1}
$$

Equivalently,

$$
\boxed{\frac{C'(t)}{C(t)}
<\frac{n_a'(t)}{n_a(t)}
<\frac{\kappa'(t)}{\kappa(t)}<0.}
\tag{2}
$$

In particular $n_a'<0$ on the positive half-line. The first derivatives
appearing in (1)--(2) vanish at the symmetry point by evenness;
(1)--(2) concern $t>0$.

## 2. The analytic removal of every anchor

Set

$$
V=-\log\kappa,\qquad f=tV',\qquad
W=4\kappa''/\kappa,\qquad h=C/\kappa,
$$

$$
D_W=W''f'-W'f'',\qquad D_h=h''f'-h'f''.
$$

The [comparison note](theta_ratio_analytic_20261110.md) proves that
the following three signs suffice for (1) at every anchor:

$$
\boxed{W'>0,\qquad D_W>0,\qquad D_h>0\quad(t>0).}
\tag{3}
$$

The already known inequalities imply $f'>0$ and $h'<0$. Thus (3)
means that W is increasing and convex as a function of f, and h is
decreasing and convex as a function of f.

The comparison is exact: the canceled Green inverse of a centered
source becomes a covariance with a positive-part function after the
change of variable $Y=\tanh(at/2)$. Concavity or convexity of one
source as a function of another determines the derivative sign of the
ratio of these covariances. The proof applies to

$$
n_a=\mathcal G_a[f],\qquad
\kappa=\mathcal G_a[W],\qquad
C=\mathcal G_a[f-a^2h].
$$

There is consequently no anchor grid or limiting-anchor assumption in
the application of (3). What remains is a one-variable theorem about
the fixed, explicit theta kernel.

## 3. Exhaustive proof regions and certified margins

The proof covers three closed overlapping regions; the lower endpoint
zero is handled using the even coordinate $u=t^2$.

| Domain | Method | Conservative strict bounds |
| --- | --- | --- |
| $0<t\le1/8$ | Degree-20 even Taylor enclosure, Cauchy remainder, 32 exact dyadic cells in $u$ | $W'/(2t)>69.60$, $D_W/(8t^3)>337.61$, $D_h/(8t^3)>0.05959$ |
| $1/8\le t\le4$ | Full interval Taylor polynomials with Lagrange remainders, 1,984 exact dyadic cells | $W'>17.91$, $D_W>5.48$, $D_h>0.00108$ |
| $t\ge4$ | First-theta-term comparison plus an explicit bound for all other terms | $W'>1/2$, $D_W>1/2$, $D_h>1/2$ |

Every listed decimal lower bound denotes an exact rational number.
The replay gives outward-rounded bounds strictly above these values.
Interval assertions cover every point of each cell, including its
endpoints. The tail proof covers every real $t\ge4$. Together they
prove (3), and the comparison theorem proves (1)--(2).

## 4. Rigorous values of the integrated kernel

The only integrated quantity needed by the compact proof is C. The
function `C_point` in `theta_ratio_c_integral_20261110.py` computes
rigorous enclosures of its endpoint values.

It integrates the first 16 theta terms over $[t,t+4]$ using FLINT's
rigorous complex ball integration, then adds explicit enclosures of
the omitted theta sum and the remaining spatial tail. The finite
integrand is entire; its callback is therefore holomorphic on every
complex ball on which it is evaluated.

For $j=0,1$, the derivative polynomial has degree at most three and
coefficient norm less than 14. With $m=17$ and $t\ge0$, the omitted
theta tail is bounded in absolute value by

$$
E(t)=28(4e^t m^2)^3\exp(t/4-3e^tm^2).
\tag{4}
$$

Indeed, $3<\pi<4$, and the successive $n^6$ Gaussian majorants have
ratio at most $((m+1)/m)^6e^{-3(2m+1)}<1/2$. The envelope (4)
decreases in t. Since $\int_t^{t+4}s/4\,ds=t+2$, the executable's
larger error allowance $(2t+4)E(t)$ bounds the finite integral's
theta truncation error.

For the spatial tail, the known $Q'>0$ gives

$$
0<C(t+4)<\frac{\kappa(t+4)}{4Q(t+4)}.
\tag{5}
$$

Both quantities in (5) are themselves enclosed with their theta-series
errors. The resulting reproducible endpoint enclosures are

$$
C(0)\in
0.021528707625566523248989621991521973453722249763325813
\ \pm\ 6.27\cdot10^{-55},
$$

$$
C(4)\in
3.0007270222571887949010658713226252459843757364685602
\cdot10^{-72}
\ \pm\ 6.47\cdot10^{-125}.
$$

The point values are recomputed by the runner. No diagnostic decimal
value is substituted for the rigorous integral.

## 5. Origin proof in the even coordinate

Write $K(u)=\kappa(\sqrt u)$. The theta modular identity makes
$\kappa$ even. On the complex disk $|t|\le1/2$,

$$
\pi\Re(e^t)>3/2,\qquad
|\kappa(t)|\le240\sum_{n\ge1}n^4e^{-3n^2/2}<40000.
$$

The prefactor bound follows from $e^{1/8}<2$, $\pi<4$, $e<3$,
and $e^{1/2}<2$. The final sum is bounded using
$e^{-3/2}<1/2$ and $\sum_{n\ge1}n^4/2^n=150$.

If $K(u)=\sum b_ku^k$, Cauchy's inequality gives
$|b_k|\le40000\cdot4^k$. The first 16 theta terms determine
coefficient enclosures through degree 20. Their omitted complex-disk
tail is bounded by

$$
480\cdot17^4e^{-3\cdot17^2/2}.
$$

Multiplication by $4^k$ bounds its effect on the kth coefficient.
For $0\le u\le1/64$, the remaining Taylor tails and their first
four derivatives have explicit geometric majorants. For derivative
order j and first omitted index k=21, the successive majorant ratio
is at most $4u(k+1)/(k+1-j)<1$.

The integrated kernel obeys the exact relation

$$
C(\sqrt u)=C(0)-\frac18\int_0^uK(v)dv.
$$

This also has an explicit integrated Taylor-tail bound. The executable
checks the rational expressions for f, W, h and their u-derivatives on
32 dyadic interval cells. Its positive lower bounds include
$f_u>4.677$, $W_u>69.60$, and the two determinants displayed in the
table. The conversion back is exact:

$$
W_t'=2tW_u,\qquad
D_W(t)=8t^3(W_{uu}f_u-W_uf_{uu}),
$$

$$
D_h(t)=8t^3(h_{uu}f_u-h_uf_{uu}).
$$

Thus arbitrarily small positive t is covered without extracting a
tiny cubic difference from point evaluations. See
`theta_ratio_origin_certificate_20261110.py` for the finite enclosure.

## 6. Bounded-interval proof and exact numerator formulas

Put $k_j=\kappa^{(j)}(t)$. Define the following polynomial expressions:

$$
\begin{aligned}
F_1&=-k_0k_1+t(k_1^2-k_0k_2),\\
F_2&=2k_0(k_1^2-k_0k_2)
 +t(-k_0^2k_3+3k_0k_1k_2-2k_1^3),\\
B_3&=k_0k_3-k_1k_2,\\
B_4&=k_0^2k_4-k_0k_2^2-2k_0k_1k_3+2k_1^2k_2,\\
H_1&=-tk_0^2-4Ck_1,\\
H_2&=-k_0^3+tk_0^2k_1+4C(2k_1^2-k_0k_2).
\end{aligned}
$$

Direct differentiation gives

$$
\boxed{
f'=\frac{F_1}{k_0^2},\quad
W'=\frac{4B_3}{k_0^2},\quad
D_W=\frac{4(B_4F_1-B_3F_2)}{k_0^5},\quad
D_h=\frac{H_2F_1-H_1F_2}{4k_0^5}.
}
\tag{6}
$$

The core executable verifies all four identities symbolically before
using them. Their denominators are positive, so only polynomial
numerators require interval sign checks.

### Theta derivative enclosures

The exact derivative polynomials satisfy

$$
P_0(r)=2r^2-3r,\qquad
P_{j+1}(r)=(1/4-r)P_j(r)+rP_j'(r),
$$

$$
\kappa^{(j)}(t)
=\sum_{n\ge1}e^{t/4-\pi n^2e^t}P_j(\pi n^2e^t).
$$

If $M_j$ is the sum of absolute coefficients of $P_j$, then its
degree is $d=j+2$, and $|P_j(r)|\le M_jr^d$ for $r\ge1$.
The $n\ge17$ real tail is consequently bounded by

$$
2M_j(4e^t17^2)^{j+2}\exp(t/4-3e^t17^2).
\tag{7}
$$

The geometric ratio is at most $2^{2d}e^{-3(35)}<1/2$ for every
order used by the certificate. The executable checks that bound.
Real ball evaluation of (7) safely enlarges it over each cell.

### Full Taylor models

On a cell $[m-d,m+d]$, use order M=12. For $0\le j\le4$,

$$
\kappa^{(j)}(m+\delta)\in
\sum_{q=0}^{M-1}\frac{\kappa^{(j+q)}(m)}{q!}\delta^q
+\frac{\kappa^{(j+M)}([m-d,m+d])}{M!}\delta^M.
\tag{8}
$$

This is Taylor's theorem with an interval enclosure of its Lagrange
coefficient. All products in (6) retain their full polynomial degree;
no discarded high-degree product is silently omitted. For each fixed
$\delta\in[-d,d]$, the true coefficient choices belong to the
interval coefficients in (8), so polynomial interval arithmetic
encloses the actual numerator.

The cells are exact dyadics. Their widths are at most $1/64$ and are
halved until $\text{width}\cdot\pi e^{t_{\rm right}}\le1/8$.
This controls enclosure width in the rapidly decaying tail of the
compact region. All cells from 4 down to 1/8 are visited; no cell is
skipped after a failed assertion.

### Backward propagation of C

Start with the rigorous C(4) enclosure. Let I be the antiderivative,
with I(0)=0, of the polynomial part of
$(m+\delta)\kappa(m+\delta)/4$. If

$$
R=\frac{t_{\rm right}\sup_{\rm cell}|\kappa^{(M)}|}
{4M!(M+1)},\qquad E=R d^{M+1},
$$

then

$$
C(m)\in C(t_{\rm right})+I(d)+[-E,E],
$$

$$
C(t_{\rm left})\in C(t_{\rm right})+I(d)-I(-d)+[-2E,2E],
$$

and the full cell model is

$$
C(m+\delta)\in C(m)-I(\delta)+[-R,R]\delta^{M+1}.
\tag{9}
$$

The bound integrates the absolute remainder. It does not cancel an
unknown odd remainder across the midpoint. Backward propagation adds
positive integrals, avoiding subtraction of a large integral to obtain
a tiny tail.

At 224-bit precision, every numerator assertion passes on all 1,984
cells. For the reported lower bounds in the table, the positive
denominators in (6) are bounded above using the known decrease of
$\kappa$ and an enclosure at the cell's left endpoint. A final direct
enclosure of C(1/8) overlaps the propagated enclosure; this is an
additional consistency check, not a substitute for the error proof.

## 7. Analytic tail and conclusion

The [tail note](theta_ratio_tail_signs_20261110.md) proves (3) for
$t\ge4$. It compares the actual kernel with its first theta term,
uses a positive rational subsolution for the integrated ratio, and
certifies first-term margins greater than one by shifted polynomials
with nonnegative coefficients. Every omitted theta term and the needed
derivatives are controlled explicitly. The resulting common error
bound is less than $2^{-288}$, giving the stated half-unit margins.

Sections 5--7 exhaust $t>0$. The comparison theorem therefore proves
both ratios for every $a,t>0$, completing the theorem.

## 8. Second-kernel positivity and the intrinsic three-node consequence

At a second anchor $c>0$, let $q=R_a(c)>0$. The second pair has
sources

$$
S_U=n_a-cq b_a,\qquad
S_V=qp\kappa-(aq+c)n_a.
$$

The two thresholds are the exact cosh-weighted means of $n_a/b_a$
and $n_a/\kappa$ established in PR #50. The now proved strict ratio
signs give one negative-to-positive crossing for each source. Each
source has zero cosh-weighted mass at c. The canceled Green lemma
therefore proves both second kernels strictly positive, including at
the spatial origin, for every $a,c>0$.

Their transforms U,V are positive on the positive real axis, and the
second reduced response is $R_{a,c}(x)=xU(x)/V(x)>0$. Define
$P_L(x,y)=(L(x)+L(y))/(x+y)$. The exact Schur congruences then give
positive definiteness of every three-node matrix
$[P_L(x_i,x_j)]$ at distinct positive real nodes. To check strictness,
write $A_a=\mathcal L n_a$, $B_a=\mathcal L b_a$. The diagonal factors
are nonzero away from their anchors because

$$
xp-aL(x)=\frac{x(x^2-a^2)B_a(x)}{F(x)}\ne0\quad(x\ne a),
$$

$$
xq-cR_a(x)=\frac{(x^2-c^2)V(x)}{xB_a(x)}\ne0\quad(x\ne c).
$$

All denominator transforms are positive on the positive real axis.
Removable anchor values are handled by the entire transforms.

This supplies an intrinsic theta proof of that three-node result.
The previously established fourth-stage theorem in PR #50 has a
different proof, still using finite-height zero verification. The
present theorem neither removes that proof's external input nor proves
arbitrary-order positivity.

The stronger class in Section 7 of the comparison note is verified for
the starting pair $(C,\kappa)$. It is proved to produce the basic
shape conditions for the next canonical pair. The three extra
inequalities needed to preserve the stronger class remain open.
