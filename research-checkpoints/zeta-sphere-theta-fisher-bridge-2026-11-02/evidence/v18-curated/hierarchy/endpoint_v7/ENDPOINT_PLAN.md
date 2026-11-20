# Endpoint Green boundary: shrinking relative gap and explicit certification scales

Status: final consolidated derivations independently reviewed PASS; see foundations/ENDPOINT_V7_AUDIT.md. Known literature inputs are identified below. This is not an RH proof. The fixed-A>1/2 theorem is preserved in localization_v6.

Fix δ∈(0,1/2). Let A=1/2 and 0<a≤1/2−δ. Classical Weyl subconvexity, interpolated between sigma=1/2 and sigma=1, gives

    |zeta^(j)(sigma+it)| <<_(epsilon,j) |t|^((1−sigma)/3+epsilon), j=0,1,2,

uniformly on the fixed compact strip needed here, allowing an arbitrarily small exponent loss for Cauchy differentiation and a thin extension to the left of 1/2 using the functional equation. Therefore

    |W_a(t)|/a <<_(δ,epsilon) exp(−pi|t|/2)|t|^(4−δ/3+epsilon).

The division by a is justified by integrating ∂a W from zero, as in localization_v6, not by an interior reciprocal of xi.

At sigma=1, an established unconditional reciprocal bound is

    |zeta(1+it)|^−1 ≤ 6.9e6 log t, t≥45

(Trudgian 2015, source below). To lower-bound the outward logarithmic derivative, use the centered paired canonical product. At a=1/2 all zero contributions have nonnegative real part. Pair beta+i gamma with (1−beta)+i gamma; at least half the zeros in any symmetric height window have beta≤1/2, hence their horizontal distance from 1+it lies in [1/2,1]. Each such zero with |gamma−t|≤R contributes at least 1/[2(1+R²)] to Re xi'/xi(1+it). If

    N(t+R)−N(t−R) ≥ c_R log t,

then Re xi'/xi(1+it)≥c_R log t/[4(1+R²)]. A sufficiently large fixed R has this property from the classical Riemann–von Mangoldt formula with O(log t) remainder. No RH or zero-free claim inside the critical strip is used. Multiplicities are counted; boundary sigma=1 is zero-free by the established classical theorem.

Stirling then yields

    W_(1/2)(t) >= c exp(−pi|t|/2)|t|^4/log|t|.

The positive Poisson kernel divided by a has a positive minimum on 0≤a≤1/2−δ, |u|≤1, so convolution gives the same lower scale for B_a/a. Consequently

    sup_(0<a≤1/2−δ) |W_a/B_a|
        <<_(δ,epsilon) |t|^(−δ/3+epsilon) log|t|.

For epsilon<δ/3 this tends to zero. Thus even the endpoint boundary cannot support a fixed strict relative contraction on any interior compact a-range. This is an upper bound on the absolute surviving gap, NOT a lower bound or proof of its sign. Any grouped forcing certificate needs to resolve K/B within a shrinking distance of 1 while determining on which side it lies.

## Known inputs, not campaign novelty

- Hiary–Patel–Yang, *An improved explicit estimate for zeta(1/2+it)*, https://arxiv.org/abs/2207.02366, published Journal of Number Theory (2024): corrected explicit Weyl estimate. We use only the classical exponent 1/6, not any numerical constant or unreviewed newer improvement.
- Trudgian, *Explicit bounds on the logarithmic derivative and the reciprocal of the Riemann zeta-function*, Functiones et Approximatio 52 (2015), author institutional record https://researchportalplus.anu.edu.au/en/publications/explicit-bounds-on-the-logarithmic-derivative-and-the-reciprocal-/ . The stated reciprocal estimate holds on sigma≥1−1/(8logt), t≥45, hence at sigma=1.
- Classical Riemann–von Mangoldt count and paired canonical product. No explicit numerical onset is currently claimed for the combined endpoint deduction; making all constants numerical would require choosing an explicit count remainder and carrying the Stirling/interpolation constants.

## Height-adaptive boundaries: two different constructions

Choosing a separate flat strip width A_T for each target window centered at T is legitimate: apply the fixed-strip Green identity afresh. No derivatives of A_T occur because it is a constant inside that application. In contrast, replacing A by A(t) in an already differentiated PDE is not legitimate. For U(t)=W(A(t),t),

    U′ = W_t + A′ W_a,
    U″ = W_tt + 2A′ W_at + (A′)² W_aa + A″ W_a.

A curved-boundary Green problem must retain these terms (and the changed normal derivative/Poisson geometry). Merely inserting A(t) into the flat-strip multiplier is not an exact transfer. The flat-window strategy avoids these derivative errors but supplies no sign for the residual forcing.

## Optional explicit boundary log-derivative constant

Rosser's classical bound (Theorem 19, 1941) implies

    |N(T) − T/(2pi) log(T/(2pi e))|
       ≤ .137 log T + .443 log log T + 2.463, T≥2.

It is restated in Table 1 of Hasanalizade–Shen–Wong, *Counting zeros of the Riemann zeta function*, JNT 235 (2022), https://arxiv.org/pdf/2107.06506 . We use the old Rosser row, not newer explicit constants whose subconvex inputs require separate auditing.

For t≥exp(20), set ell=logt. On [t−10,t+10], log(u/(2pi))≥ell−2. Also log(t+10)≤ell+.001 and log(ell+.001)≤ell/5. Hence

    N(t+10)−N(t−10)
      ≥ (10/pi)(ell−2) − .274(ell+.001) − .886 ell/5 − 4.926
      ≥ 2 ell.

The last inequality follows already from 3<pi<22/7 and ell≥20. At least half these zeros have beta≤1/2, and each contributes at least 1/202. Thus

    Re xi'/xi(1+it) ≥ logt/202, t≥exp(20).

This converts the canonical-product portion of the endpoint lower bound into an explicit estimate. The complete endpoint ratio still has non-numerical interpolation/Stirling constants and is not advertised as a fully explicit numerical certificate.

## Uniform family of flat-strip boundaries approaching the endpoint

The same bulk obstruction holds uniformly for the entire family 1/2≤A≤1 and 0<a≤1/2−δ. In the paired-zero argument the selected left-half zero has horizontal distance from sigma=1/2+A in [1/2,3/2]. A zero within height 10 contributes at least (1/2)/(100+9/4)>1/205. Thus the same local count gives Re xi'/xi(1/2+A+it)≥logt/205 for t≥e20. The established reciprocal bound above is uniform for sigma≥1, and Stirling is uniform on sigma∈[1,3/2]. Consequently

    W_A(t) >= c exp(−pi|t|/2)|t|^4/log|t|

uniformly for 1/2≤A≤1. The normalized Poisson kernel P_A^upper(a,u)/a has a positive minimum on the compact parameter set A∈[1/2,1], a∈[0,1/2−δ], |u|≤1. Therefore

    sup_(1/2≤A≤1, 0<a≤1/2−δ) |W_a(t)/B_(a,A)(t)|
        <<_(δ,epsilon) |t|^(−δ/3+epsilon)log|t|.

In particular a separately chosen flat boundary A_T down to 1/2 cannot avoid the near-total boundary/forcing cancellation at high height in the bulk interior. This result says nothing uniform as δ down to zero (the upper-boundary layer is different: at a=A, K=0). It is also not an analysis of a curved domain; the derivative costs for an actual graph boundary remain as stated above.

## Fully explicit boundary-energy floor at A=1/2

At sigma=1 the gamma factor has an exact modulus, avoiding hidden Stirling constants:

    |xi(1+it)|² = t²(1+t²)|zeta(1+it)|² / [4 cosh(pi t/2)].

Let L=6.9×10^6. Combining the reciprocal bound and the explicit logarithmic-derivative lower bound gives, for t≥e20,

    W_(1/2)(t) >= exp(−pi t/2)t^4 / [808 L² log t].

For 0<δ<1/2 define

    p_δ = sin(2piδ) / [(1/2−δ)(cosh(2pi)+1)].

Since sin(x)/x decreases on (0,pi), P_(1/2)^upper(a,u)/a≥p_δ for 0<a≤1/2−δ and |u|≤1. Hence for t≥e20+1,

    B_(a,1/2)(t)/a >= b_δ(t),
    b_δ(t) = 2 p_δ exp(−pi(t+1)/2)(t−1)^4
                 / [808 L² log(t+1)].

This is an explicit, unconditional energy floor (very conservative), not a positive lower bound for the desired residual W. It provides a concrete error scale: an absolute certified error E in K/a produces relative error at most E/b_δ(t). Thus grouped direct/dual arithmetic can be measured against a known nonzero denominator without assuming the unknown sign or dividing by interior xi. To prove W≥0, its computed residual margin must still dominate that error; the floor alone does not supply a margin.

## Explicit elementary theta-tail bridge (conservative, not the sharpest campaign cutoff)

Let F_N use theta indices 1≤n≤N, m=N+1, and define its shear W_(a,N) with the same normalization. For j=0,1,2 let R_j bound the j-th transform derivative error, uniformly |Re w|≤1/2. Directly from the positive complete theta summands,

    R_j <= integral_0^infinity u^j e^(u/2) sum_(n≥m) psi_n(u) du
        <= 16 pi^(1−j) j! m^(2−2j) exp(−pi m²).

Proof: psi_n(u)≤8pi²n⁴e^(9u/2)exp(−pi n²e^(2u)). Substitute x=e^(2u), use logx≤x−1 and x^(3/2)≤exp(3(x−1)/2), and integrate the remaining Gamma moment. The single-index bound is

    4pi²n⁴ 2^(−j) exp(−lambda) j!/(lambda−3/2)^(j+1), lambda=pi n².

Since lambda−3/2≥lambda/2 and the ratio of consecutive n^(2−2j)exp(−pi n²) terms is <1/2 for n≥1,j≤2, summing gives the stated bound. The same m=1 estimates imply full derivative envelopes P0<3,P1<1,P2<1/2.

Both full and truncated profiles have zero shear at a=0. Integrating their exact shear derivative from 0 to a gives

    |W_a/a−W_(a,N)/a| <= 2P1 R1 + P2 R0 + P0 R2
       <= [32+8pi m²+96/(pi m²)]exp(−pi m²)
       <= 88m²exp(−pi m²).

This holds uniformly for all real t and 0<a≤1/2. Therefore a rigorously computed finite-head margin

    W_(a,N)(t)/a >= 88m²exp(−pi m²)

would certify the full sign at that point; when comparing to the positive boundary energy, the certified relative error is at most 88m²exp(−pi m²)/b_δ(t).

This moment-only bound requires m² about t/2 plus logarithmic overhead to resolve a polynomial relative tolerance at high height. The modular lane has a sharper full-Xi envelope/cross-error estimate with leading cutoff m² about t/4. That sharper result should be used where its hypotheses hold; this elementary constant is preserved as a simple explicit fallback, not a claimed improvement. Improving either already-exponentially-small tail does not establish the indispensable signed finite-head margin.

### Comparison and reuse of the sharper modular cross-error

The earlier result is in modular_approximants/adaptive_results.md, §§1–2. With M_j(t)=sup_(0≤b≤1/2)|F^(j)(b+it)|, its exact full-function/tail expansion gives

    |W_a/a−W_(a,N)/a|
      <= 2M1 R1 + M2 R0 + M0 R2 + R1² + R0 R2.

Inserting the explicit tail coefficients above yields the usable combined bound

    E_cross(t,m) = exp(−P)[32M1+16pi m²M2+32M0/(pi m²)]
                    +768 exp(−2P),  P=pi m².

Thus one may use min(88m²e^(−P), E_cross) as an error certificate whenever the M_j are themselves rigorously bounded. Unconditional gamma/strip growth supplies M_j≤C(1+t)^B e^(−pi t/4), and hence the leading asymptotic cutoff P≥pi t/4+L logt; the sharper route's C,B are not fully numerical in the earlier artifact. It is an analytic complexity improvement, not a ready numerical interval certificate. The new elementary fallback and the modular asymptotic improvement are therefore complementary, not competing claims.

## Constructive near-boundary sign from the established zero-free region

Unlike the relative error floor, the following gives an actual sign region. For t≥46 set

    a_*(t)=1/2−1/[8 log(t+1/2)].

Then W_a(t)>0 for a_*(t)≤a≤1/2 (and the usual unconditional boundary theorem covers a≥1/2). The same holds at negative height by symmetry.

Proof from the paired canonical product: use centered zeros β+iγ, |β|<1/2, paired with −β+iγ. At w=a+it, d=t−γ, their real logarithmic-derivative contribution is

    2a(a²+d²−β²) /
       [((a−β)²+d²)((a+β)²+d²)].

For |d|≥1/2 this is strictly positive. For |d|<1/2, the nearby ordinate γ≥45 and the established zero-free region implies

    |β| < 1/2−1/[8 log γ]
          ≤ 1/2−1/[8 log(t+1/2)] ≤ a.

Thus these contributions are positive as well. The canonical product is paired as usual, with multiplicity and critical-line zeros handled without duplication; its real logarithmic derivative is the convergent sum of these contributions. There is no zero at the evaluation point. Hence Re(F'/F)>0 and W_a=|F|² Re(F'/F)>0.

This conclusion is an elementary consequence of a known unconditional zero-free region, not an RH proof or a new zero-free theorem. It closes only a logarithmically thin near-boundary layer. It does not supply positivity in the bulk a≤1/2−δ, where the relative forcing still nearly cancels the boundary energy. At moderate heights t<46 no assertion from this argument is made.

## Source-reading scope

The corrected Weyl theorem was read directly in the HPY primary PDF (arXiv2207.02366v1, Theorem1.1). The reciprocal constant was checked in Trudgian’s author-affiliated institutional publication record; the DOI full text was inaccessible through the web tool, so no full-paper proof audit is claimed. Rosser’s bound was checked in the explicit old1941 row of the HSW primary paper Table1, rather than recomputing Rosser’s original proof. These are standard published inputs, not new campaign theorems. The elementary deductions, constants, and parameter ranges above are independently checked separately.
