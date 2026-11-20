# Direct/dual Ewald grouping with an exact axis-closure block

2 November 2026. Status: exact construction and rigorous absolute-tail bounds; individual/group positivity and global relative domination remain unproved.

This develops the original thread's renormalized Epstein proposal rather than assigning positivity to individual Bessel terms. Source: `foundations/original_factorization/complete_modular_kernel_attack.tex`, Library bundle `libfile_3d7f9dd7c9bc81919c227563091a4ba7`; the private originating message is omitted from this repository derivative. No source-bundle code was executed.

## 1. Pair direct and dual Mellin weights before any differentiation

Put p=1/2+a, 0<a<1/2, Q_nm(v)=n²e^(−2v)+m²e^(2v), and

G_p(Q)=integral_1^infinity [x^(p−1)+x^(−p)]e^(−pi xQ)dx
      =(pi Q)^(−p)Gamma(p,pi Q)+(pi Q)^(p−1)Gamma(1−p,pi Q).

This is invariant under p↔1−p. The exact Ewald continuation is

E(p,v)=−1/[p(1−p)] + sum_((n,m)≠(0,0))G_p(Q_nm(v)).          (1)

The sum and all finite-order derivatives converge uniformly on compact real v and compact p ranges away from the explicit poles. Group each lattice vector with sign and coordinate-swap partners BEFORE applying

L_a=D_v^4−(8a²+2)D_v²+(4a²−1)²,
C_a=(1/128)partial_a L_a E(1/2+a,v).                         (2)

Each complete orbit is analytically even in v and even in a. This is a genuine arithmetic direct/dual grouping, not an arbitrary even reflection of a half-line approximation. Its odd endpoint jets vanish identically.

## 2. Why a finite square Ewald cutoff still fails globally

Let E_N be (1) with |n|,|m|<=N and the pole term retained, and let C_N=(1/128)partial_a L_a E_N. For each fixed a and N,

    lim_(|v|→infinity) C_N(v)=a(2N+1)/4.                    (3)

Proof: as Q→0,
G_p(Q)=Gamma(p)(pi Q)^(−p)+Gamma(1−p)(pi Q)^(p−1)
       −1/[p(1−p)]+O(Q).
At v→+infinity there are exactly 2N surviving short-axis vectors (n,0). The first two terms are homogeneous exponentials annihilated by L_a. Together with the pole term, the constant is −(2N+1)/[p(1−p)]. Since L_a1=16p²(1−p)², (2) gives (3). All other vectors have Q→infinity.

For fixed v, however, C_N(v)→C_a(v). Thus subtracting the constant in (3) to force decay makes the corrected value tend to −infinity at every fixed v. Pairing has repaired the seam but not the normalization at spatial infinity.

There is also a positive-definiteness obstruction: C_N(0) remains bounded as N→infinity, whereas the limit (3) grows linearly in N. Hence, for every fixed a>0, all sufficiently large N violate the necessary PD inequality |C_N(v)|<=C_N(0). This rules out the straightforward finite-square Ewald family as an everywhere-positive approximation, despite its exact evenness and direct/dual symmetry.

## 3. The corrected construction: keep the axes as one exact closure block

Define the ENTIRE axis-plus-pole block

Acal(p,v)=−1/[p(1−p)]
 +2sum_(n>=1){G_p(n²e^(−2v))+G_p(n²e^(2v))}.

Set
A_a(v)=(1/128)partial_a L_a Acal(1/2+a,v),
I_(a,nm)(v)=(1/32)partial_a L_a G_(1/2+a)(Q_nm(v)), n,m>=1.

Then EXACTLY

    C_a(v)=A_a(v)+sum_(n,m>=1) I_(a,nm)(v).                 (4)

The factor 1/32 includes the four sign choices in the lattice. For finite N define

    D_(a,N)(v)=A_a(v)+sum_(1<=n,m<=N)I_(a,nm)(v).           (5)

The finite square is closed under n↔m. Unlike §2, the full one-dimensional axes are never truncated independently of their pole/continuum cancellation. The construction is not claimed to make D_(a,N) positive definite; that must be tested or proved.

## 4. Exact, pole-free evaluation of the axis closure

Write theta(y)=sum_(n∈Z)exp(−pi n²y) and
J_s(y)=integral_1^infinity x^(s−1)[theta(yx)−1]dx.
For y>=1 the one-dimensional modular identity gives

J_s(1/y)=2Lambda(2s)y^s−y^(1/2)/(s−1/2)+1/s
         −y^(1/2)J_(1/2−s)(y).                            (6)

Pairing s=p and 1−p cancels the apparent y^(1/2)/a terms BEFORE differentiation. Their constants cancel the pole term in Acal. Thus, for v>=0 and y=e^(2v),

Acal(p,v)=A_p e^(2pv)+B_p e^(2(1−p)v)+H_a(v),
A_p=2Lambda(2p), B_p=2Lambda(2−2p),
H_a(v)=2integral_1^infinity cosh(a log x)
                  [x^(−1/2)−e^v x^(−1)] [theta(e^(2v)x)−1]dx. (7)

Consequently

    A_a(v)=(1/128)partial_a L_a H_a(v), v>=0.              (8)

The homogeneous terms are annihilated identically before parameter differentiation. Formula (7) has no 1/a subtraction and is stable as a decreases to zero. The output (8), not H_a itself, extends smoothly and evenly across v=0, because its globally defined parent Acal is even. This distinction avoids introducing seam distributions by reflecting an intermediate expression.

The theta tail in (7) decays double-exponentially as v→+infinity, also after derivatives. Therefore A_a is smooth, even and rapidly decaying. Each interior swap orbit is likewise smooth, even and rapidly decaying, since

Q_nm(v)=2nm cosh[2(v−(1/2)log(n/m))].                       (9)

This yields a genuine modular-cancellation-preserving family (5), with an exact analytic closure block. It does not use an assumed spectral square root, positive Gaussian weights, or a claim that the first Bessel block is PD.

## 5. A uniform normalized L1 remainder bound

Let T_(a,N)=C_a−D_(a,N). The following deliberately coarse bound is uniform for 0<a<=A<=1/2:

    ||T_(a,N)/a||_1
      <=336 sum_(n,m>=1, max(n,m)>N) (2pi nm)^(5/2)e^(−2pi nm).
                                                                    (10)

Here ||.||_1 is in v over the full real line. Thus the same expression bounds the absolute Fourier error at EVERY frequency. It is not a lower-margin or relative-to-C bound.

Proof details: G_p(Q)=2integral_1^infinity x^(−1/2)cosh(a log x)e^(−y)dx with y=pi xQ. Differentiating the full expression in (2), and using

partial_a L_a/a=−16D_v²+16(4a²−1),
(log x)sinh(a log x)/a <=(log x)² cosh(A log x),
cosh(A log x)<=x^A,

shows, for the positive-quadrant contribution I_(a,nm),

|I_(a,nm)(v)/a|
 <=28 integral_1^infinity x^(A−1/2)[1+(log x)²]y^4e^(−y)dx.  (11)

For completeness, |D_v^j e^(−y)|<=2^j B_j(y)e^(−y), where B_j is the j-th Touchard polynomial, because |D_v^ell y|<=2^ell y. For j=2,4 and y>=2pi>1 this gives
|D²e^(−y)|<=8y²e^(−y),
|D⁴e^(−y)|<=240y⁴e^(−y).
Since 8a²+2<=4 and (4a²−1)²<=4, the L term is bounded by 276y⁴e^(−y); the differentiated-L term by 160y⁴e^(−y). Including the factor 1/16 after G is expanded gives (11) with room to spare.

Put s=2pi nm and w=v−(1/2)log(n/m). Since y=sx cosh(2w), log cosh(2w)<=cosh(2w)−1 and cosh(2w)−1>=2w² give

integral_R y⁴e^(−y)dv
 <=(sx)^4e^(−sx) sqrt[pi/(2(sx−4))]
 <=3(sx)^(7/2)e^(−sx), s>=2pi.

Thus the L1 norm in (11) is at most
84s^(7/2)integral_1^infinity x^(A+3)[1+(log x)²]e^(−sx)dx.
Use x^(A+3)<=exp[(A+3)(x−1)] and log x<=x−1. With d=s−A−3>5/2, the remaining integral is at most
e^(−s)(1/d+2/d³)<=4e^(−s)/s.
This proves (10). All interchanges involve nonnegative majorants and absolutely convergent sums.

An elementary closed-form upper bound follows by grouping products k=nm and using the divisor bound d(k)<=k, then k^(7/2)<=k^4:

    epsilon_N=150(2pi)^3 sum_(k>=N+1) k^4e^(−2pi k).       (12)

The slightly enlarged coefficient in (12) also bounds the SUPREMUM norm, needed for Gram entries: since y^4e^(−y) decreases for y>=2pi, (11) implies

||I_(a,nm)/a||_infinity <=28s^4 integral_1^infinity x^(A+7/2)[1+(log x)^2]e^(−sx)dx
 <=140s^3e^(−s).

Indeed d=s−A−7/2>=s−4>2, and 1/d+2/d^3<=5/s. Summing and using d(k)<=k gives 140(2pi)^3 times the series in (12); 150(2pi)^3 also exceeds the L1 coefficient 336(2pi)^(5/2). Therefore epsilon_N bounds BOTH the pointwise kernel error and its L1 norm.

The final series is an explicit geometric-polynomial sum: with q=e^(−2pi), n0=N+1 it equals q^n0 times

n0^4/(1−q)+4n0³q/(1−q)²+6n0²q(1+q)/(1−q)³
 +4n0q(1+4q+q²)/(1−q)^4+q(1+11q+11q²+q³)/(1−q)^5.

For each fixed number of v derivatives the same argument gives an exponentially decaying tail bound with an additional polynomial in N. Hence D_(a,N)/a approaches C_a/a in Schwartz seminorms on compact shift ranges after retaining the exact closure block. In particular no finite-order cusp or algebraic Fourier defect is introduced. This last qualitative assertion requires no sign claim.

## 6. A finite-test relative Gram certificate

For specified real nodes v_1,...,v_J, let D_N=[D_(a,N)(v_j−v_k)/a]. If a rigorous computation gives D_N>0, the exact remainder matrix E satisfies entrywise |E_jk|<=epsilon_N, hence

||D_N^(−1/2) E D_N^(−1/2)|| <= J epsilon_N/lambda_min(D_N). (13)

Thus, if q_N:=J epsilon_N/lambda_min(D_N)<1, then

    E >= −q_N D_N,     D_N+E >=(1−q_N)D_N>0.

This is a genuine relative remainder certificate for the specified finite Gram problem, with an independently computable tail and candidate positive matrix. It does NOT assert D_N is positive in general, nor control arbitrary nodes, node collisions, unbounded J, or all heights. More refined entrywise/correlated remainder matrices can replace the scalar epsilon_N in (13), using the same exact grouping.

The unconditional closure and tail bounds are the new input here. A global lower-margin theorem for D_N would still be needed to turn (13) into the original universal positivity statement. The original first-Bessel-block obstruction and the fixed-cutoff obstruction remain consistent with this construction: neither licenses positivity of any individual grouped term.

## 7. What has and has not been achieved

Obtained: a direct/dual orbit construction with an essential exact axis/pole closure; a proof that naive finite-axis Ewald truncations fail; smooth even decay of the corrected grouped heads; explicit all-frequency absolute remainder control normalized by a; and a computable finite-Gram relative sufficient condition.

Not obtained: positivity of the grouped heads for arbitrary tests, a global relative remainder bound with q<1, or RH. A next concrete test is a validated finite Gram for (5), using (7) for the axis closure and (12) to certify the relative remainder. Individual Bessel positivity is neither assumed nor sought.
