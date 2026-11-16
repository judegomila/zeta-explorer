# Cluster residuals, phase concentration, and an actual finite window

Research continuation, 4 November 2026. The contour identities below are elementary consequences of the residue theorem, repackaged for this attack; no novelty claim is made. The global arithmetic and full Schur-positivity estimates remain open. The finite-window computation uses the actual completed zeta function through Euler--Maclaurin continuation with an explicit remainder, not a bare finite prime array. This is an internally checked research certificate, not external peer review or a formalized proof.

## 1. Remove all zeros in a contour, with multiplicity

Let f be holomorphic on a neighborhood of the closure of a bounded Jordan domain D with positively oriented piecewise smooth boundary Gamma. Assume only that f is nonzero on Gamma. Let C be the set of **all distinct** zeros in D, with their multiplicities recorded, and put

$$
P_C(z)=\prod_{\rho\in C}(z-\rho)^{m_\rho},\qquad
H_C=f/P_C,\qquad g_C=H_C'/H_C.
$$

Here the product indexes distinct zeros and m_rho counts copies. H_C is holomorphic and nonzero in D, including at the removed zeros. No assumption about their separation, simplicity, or location on a symmetry line is needed. For z in D,

$$
g_C(z)=\frac1{2\pi i}\int_\Gamma
\frac{f'(\zeta)}{f(\zeta)}\frac{d\zeta}{\zeta-z}.
\tag{1}
$$

For z away from the zeros, the residues are f'(z)/f(z) and m_rho/(rho-z). Their sum is f'/f-P_C'/P_C. Analytic continuation gives (1) also at the removed zeros. This is the key distinction from assuming f'/f is holomorphic throughout an unverified box: its poles are explicitly retained in P_C'/P_C.

If the boundary length is L_Gamma, dist(K,Gamma)>=d>0, and sup_Gamma|f'/f|<=B, differentiation of (1) gives

$$
\sup_K|g_C^{(k)}|\le
\frac{k!L_\Gamma B}{2\pi d^{k+1}},\qquad k=0,1,\ldots.
\tag{2}
$$

For a circle of radius R and concentric inner disk of radius r<R this is k! R B/(R-r)^(k+1). These bounds contain **no internal separation denominator**. They are uniform under a family of coalescences only if the boundary bound B and distance d remain uniform. Zeros approaching the contour, growing boundary oscillation, and shrinking collars still have a cost.

The cluster coefficients can in principle be enclosed without resolving individual roots: contour moments p_k=(2pi i)^(-1) integral_Gamma zeta^k f'/f are the sums of rho^k with multiplicities. An independently certified integer count supplies the degree; Newton identities then recover P_C. This is a construction, not a claim that its high-degree numerical conditioning has been controlled here.

## 2. A completed-source boundary error budget

Suppose on the entire boundary we have rigorous enclosures

$$
|f-f_0|\le\eta_0,\quad |f'-f_0'|\le\eta_1,
\quad |f_0|\ge\delta_0>\eta_0,
\quad |f_0'|\le L_0.
$$

Then the actual boundary is zero-free, and

$$
\left|\frac{f'}f-\frac{f_0'}{f_0}\right|
\le E_B:=\frac{\eta_1}{\delta_0-\eta_0}
+\frac{L_0\eta_0}{\delta_0(\delta_0-\eta_0)}.
\tag{3}
$$

Indeed f'/f-f0'/f0=(f'-f0')/f-f0'(f-f0)/(f f0). If g0 is the contour integral (1) with f0'/f0 in its numerator, then

$$
|g_C-g_0|\le\frac{L_\Gamma E_B}{2\pi d}.
\tag{4}
$$

Any contour quadrature error must be added separately. No lower bound for |f| **inside** the cluster region enters (3)-(4). The exact actual P_C remains in the principal part; substituting an approximate cluster polynomial incurs its own logarithmic-derivative error, which may diverge near its roots. In particular, this estimate does not allow f0's zeros to replace actual zeros without a separate argument.

For f=xi, write A_C=Re(P_C'/P_C). On a regular vertical scan A=A_C+Re(g_C). If |g_C-g0|<=eta, the pointwise one-sided bound is

$$
(-A)_+\le(-A_C-\Re g_0+\eta)_+.
\tag{5}
$$

This retains cancellation between the complete cluster and regular source. Integrating (5) gives a phase budget; squaring its nonnegative sides gives an L2 budget. The certified derivative bounds in (2) can control interpolation of the **regular remainder**, not interpolation across an unresolved principal-part pole.

## 3. Exact squared-norm blowup

Suppose xi has an off-line zero rho=1/2+b+i gamma, b>0, of multiplicity m. On a sufficiently small fixed interval |y|<=r, with x=b-epsilon and epsilon>0 small,

$$
A(b-\varepsilon,\gamma+y)
=-\frac{m\varepsilon}{\varepsilon^2+y^2}+R_\varepsilon(y),
\qquad |R_\varepsilon(y)|\le M.
$$

Let N_x=(-A(x,.))_+ and k_epsilon(y)=m epsilon/(epsilon^2+y^2). The positive-part map is 1-Lipschitz and k_epsilon>=0, so

$$
\big|\|N_{b-\varepsilon}\|_{L^2(\gamma-r,\gamma+r)}
-\|k_\varepsilon\|_{L^2(-r,r)}\big|\le M\sqrt{2r}.
$$

Direct integration gives

$$
\|k_\varepsilon\|_2^2=m^2\left[
\frac{r}{\varepsilon^2+r^2}
+\frac1\varepsilon\arctan\frac r\varepsilon\right],
\qquad
\varepsilon\int_{\gamma-r}^{\gamma+r}N_{b-\varepsilon}(t)^2dt
\longrightarrow\frac{\pi m^2}{2}.
\tag{6}
$$

Thus on I_j=[j/2,j/2+1], a finite upper bound on sup_regular 0<x<1/2 integral_Ij N_x^2 would exclude every off-line zero whose height is interior to I_j. Every height is interior to some such interval. Conversely RH gives N=0 from the real-part zero sum. These uniform bounds are therefore RH-equivalent, not weaker established estimates.

A weaker sufficient regularity formulation is

$$
\Omega_j(\ell):=
\sup_{\substack{0<x<1/2\\\text{regular scans on }I_j}}
\sup_{\substack{J\subset I_j\text{ an interval}\\|J|\le\ell}}
\int_J N_x(t)dt\longrightarrow0\quad(\ell\downarrow0).
\tag{7}
$$

An off-line zero contradicts (7) by the shrinking-core mass m*pi proved in the original note. An L2 bound C_j implies Omega_j(ell)<=sqrt(C_j ell) by Cauchy--Schwarz. This is interval nonconcentration; no stronger assertion about arbitrary measurable sets is needed. The criterion for all j is again equivalent to RH.

In the shear notation W=|xi|^2 A, the L2 integrand is (-W)_+^2/|xi|^4. Replacing this by an unweighted shear norm removes exactly the singular weight that detects an off-line core. A norm bound for selected theta sources is not automatically a bound for this quotient.

## 4. A finite certificate for the actual completed function

The script `certify_actual_window.py` encloses the whole boundary of

$$
D=\{0<\sigma<1,\ 13.5<t<14.5\}.
$$

It evaluates zeta and zeta' on complex rectangular **segments**, using outward Decimal intervals. It never calls a zeta library or imports known zero locations. The argument-principle integral is enclosed by summing interval enclosures of (zeta'/zeta) dz on all segments. If its real part contains zero and its imaginary part lies strictly between 0 and 12, the integer zero count is exactly one: the domain contains no pole and pi>3 excludes every count >=2. An unresolved boundary or count raises an error rather than returning a certificate.

Xi's completion factor is analytic and nonzero here. Its functional equation and conjugation symmetry map a zero rho in D to 1-conjugate(rho) in D. Hence count one proves that the enclosed zero is simple and lies on sigma=1/2. This re-certifies a familiar low-height zero; it is not a new height record or an unbounded-height result.

For s in the closed outer rectangle,

$$
\frac{\xi'}\xi=\frac{\zeta'}\zeta+G(s),\qquad
G(s)=\frac1s+\frac1{s-1}+\tfrac12\psi(s/2)-\tfrac12\log\pi.
$$

Here |G|<7 follows without a numerical gamma implementation. Put z=s/2. The expansion psi(z)=-gamma+sum_(k>=0)(1/(k+1)-1/(k+z)), |gamma|<1, |z|>6, |z-1|<8 and Re z>=0 give |psi(z)|<1+7/6+8=61/6. Also |1/s|,|1/(s-1)|<=1/13.5 and log(pi)<2. The expansion is valid away from the digamma poles and converges absolutely after combining each summand.

On K={1/4<=sigma<=3/4, 13.75<=t<=14.25}, the distance to Gamma is 1/4 and its length is 4. If the verified boundary bound on |xi'/xi| is B, then (2) gives |g_C|<=8B/pi<8B/3. The output supplies the integer M=ceil(8B/3).

Since the unique cluster zero is on the line, its real-part principal term is positive for x>0. Consequently this computation proves, on **all** 0<x<=1/4 and 13.75<=t<=14.25,

$$
N_x(t)\le M,\qquad \int_J N_x(t)dt\le M|J|,
\qquad \int_J N_x(t)^2dt\le M^2|J|.
\tag{8}
$$

This tests the full pipeline through arbitrarily small transverse x in this finite patch. It does not cover x>1/4 or other height windows, and is logically based on a finite zero count. It supplies no uniform growing-height arithmetic estimate.

The recorded run uses 1,024 boundary segments and 70 decimal digits. It certifies |zeta|>0.24 on the boundary, an argument integral with real part enclosed in [-2,2] and imaginary part enclosed in [4,9], B<=14, and **M=38**. Replaying at 100 digits gives the same integer zero count and bounds. Thus (8) reads integral_J N_x<=38|J| and integral_J N_x^2<=1444|J|. The two precisions use the same implementation and are not independent external verification. The earlier 256- and 512-segment attempts did not isolate the integer count and returned errors; those unresolved enclosures are not positive certificates.

### Euler--Maclaurin error used by the checker

Let N=16, K=8 and (s)_j=s(s+1)...(s+j-1). The finite expression is

$$
Z_0(s)=\sum_{n=1}^{15}n^{-s}+\frac{16^{1-s}}{s-1}
+\frac12 16^{-s}
+\sum_{k=1}^{8}\frac{B_{2k}}{(2k)!}(s)_{2k-1}16^{1-s-2k}.
$$

The periodic-Bernoulli remainder is bounded using |B_16({u})|/16!<=2*zeta(16)/(2pi)^16<4/6^16. On the whole rectangle |s|<16 and |s+j|>=13. Put P=product_(j=0)^15 (16+j). Since sigma>=0,

$$
|\zeta-Z_0|\le R_0=\frac{4P}{6^{16}\,15\,16^{15}},
\quad
|\zeta'-Z_0'|\le R_1=R_0\left(\frac{16}{13}+3+\frac1{15}\right).
\tag{9}
$$

The derivative bound differentiates the exact integral remainder: |(s)_16'|<=16P/13 and integral_16^infinity u^-16 log u du=16^-15(log16/15+1/225), with log16<3. Both complex remainders are added to **each** real/imaginary component as symmetric intervals. This is conservative and covers the entire tail.

Arithmetic uses directed rounding for +,-,*,/. Correctly rounded Decimal exp and ln are enclosed by their adjacent representable numbers. Sin and cos use a 121-term interval Taylor sum at an exact Decimal midpoint, an alternating-series next-term bound, and a separate input-radius allowance using |sin'|,|cos'|<=1. The checker verifies that the tail terms are decreasing. No floating-point decision is used for the final count or residual bound.

Primary formulas: [DLMF 25.2, Euler--Maclaurin continuation](https://dlmf.nist.gov/25.2), [DLMF 24.8, Bernoulli Fourier expansion](https://dlmf.nist.gov/24.8), [DLMF 5.7, digamma series](https://dlmf.nist.gov/5.7), and [Python Decimal arithmetic](https://docs.python.org/3/library/decimal.html). The residue, norm, and error manipulations are proved here.

## 5. What this changes, and what it leaves open

The regular residual now has an explicit contour bound that survives internal coalescence. The source-approximation error can be paid on a zero-free boundary without assuming an empty interior. The actual finite patch checks that mechanism on the full completed function. The synthetic tests exhibit the divergence of an isolated-zero residual while the complete-cluster residual stays bounded.

The missing global input is still an arithmetic estimate controlling the **principal part together with the residual** on every height window and every transverse scale. Contour bounds alone do not establish that the enclosed zeros lie on the line; a cluster with two or more zeros can include off-line reflected pairs. Coefficient conditioning, boundary clearance as height grows, uncovered supports, and the full signed operator/inverse transfer remain unpaid. The all-height nonconcentration statement (7), the all-degree selected-source statements in the other theta work, and full Schur positivity are not equated by an unproved finite-form identity.

Reproduce with `python3 cluster/certify_actual_window.py 256` and `python3 cluster/check_cluster.py` from the parent checkpoint directory. The first command can take roughly a minute depending on the machine. See the saved JSON outputs and checksum manifest. The older floating-point phase probe retains its original diagnostic status.

The auxiliary checks use exact Fractions to test coalescing four-root configurations (down to separation 10^-8 and at exact double-root coalescence), the boundary quotient-error algebra, and enclosures for the squared-norm limiting constant via an alternating-series Machin formula. Decimal interval endpoints are checked against exact rational operations, and invalid intervals, denominators containing zero, out-of-domain evaluation, and non-dyadic partitions are rejected. These finite checks support the implementation and do not replace the proofs above or establish a global estimate.
