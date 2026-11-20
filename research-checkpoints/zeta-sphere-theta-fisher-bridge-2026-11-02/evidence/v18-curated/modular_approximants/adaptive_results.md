# Adaptive cutoff regime and its conditioning barrier

2 November 2026. Continuation of results.md. This note gives a proved asymptotic regime, not an RH proof. No lower bound for the full shear is assumed.

## Main findings
Write n=N+1 and P=πn². The natural cutoff boundary is n²≈t/4 for approximation at the completed-function exponential scale. Increasing N this quickly removes the fixed-cutoff obstruction as an approximation-error problem, but does not establish positivity of the finite head.

More sharply, in the adaptive regime t=rP, fixed r>4/π, the finite head has the asymptotic

W_(a,N)(t)/a = [512(4−r²)/(4+r²)^4 + O_A,r(P^(−1))] exp(−2P),

uniformly for 0<a<=A. Thus:

* n²/t<1/(2π), equivalently r>2: the adaptive head is eventually negative.
* 1/(2π)<n²/t<1/4, equivalently 4/π<r<2: the adaptive head is eventually positive, but exponentially larger than the full shear. Its positivity is an approximation artifact, canceled by the exact tail correction.
* At n²/t=1/(2π), the leading term vanishes and this theorem does not decide the next sign.
* At n²/t>=1/4, the head-dominated-by-tail comparison no longer follows; no sign is inferred.

The constants 1/(2π) and 1/4 refer to this precisely defined theta cutoff and scaling. The first is also familiar as a Riemann–Siegel length scale, but no identification of the two constructions is asserted.

## 1. Exact normalized perturbation identity
For a real half-line profile q define Q(z)=∫_0∞q(u)cos(zu)du. Its shear obeys

W_q(a,t)/a = ∫_0^1 {|Q′(t+isa)|²−Re[Q″(t+isa)overline(Q(t+isa))]} ds.

Indeed W=(1/2)∂_a|Q(t+ia)|², its first a derivative vanishes at a=0, and the second derivative of the squared modulus is twice the displayed integrand. This identity is stable as a decreases to zero.

Let R(z)=∫r_N(u)cos(zu)du be the omitted tail transform, so Q_N=Ξ−R. Put
M_j(t,A)=sup_(0<=b<=A)|Ξ^(j)(t+ib)|,
R_j(A)=∫_0∞u^j r_N(u)cosh(Au)du.

Then, for all 0<a<=A,

|W_ψ(a,t)−W_N(a,t)|/a
<= 2M_1 R_1+M_2 R_0+M_0 R_2+R_1²+R_0 R_2.       (1)

This follows by expanding the quadratic expression and using |R^(j)(t+ib)|<=R_j. Unlike the earlier raw moment estimate, this retains the exponentially small full Ξ in the cross terms. The appearance of Ξ here is legitimate for an error bound; it does not assume any sign or nonzero lower bound.

## 2. Unconditional envelope and a sufficient adaptive rule
For each fixed A there exist finite C_A,B_A such that, for j=0,1,2 and t>=2,

M_j(t,A)<=C_A(1+t)^(B_A)exp(−πt/4).             (2)

One obtains this directly from ξ(s)=s(s−1)π^(−s/2)Γ(s/2)ζ(s)/2: the gamma factor supplies exp(−πt/4), ζ has polynomial upper bounds in each fixed vertical strip, and a fixed-radius Cauchy estimate bounds derivatives. Polynomial strip bounds can be obtained from the finite Euler–Maclaurin formula for ζ with cutoff comparable to t and a fixed number of derivatives; no zero-free assumption is used. This is an envelope, emphatically NOT a positive lower bound.

Primary references for the standard gamma asymptotic and zeta approximate functional equation are [NIST DLMF §5.11](https://dlmf.nist.gov/5.11) and [NIST DLMF §25.9](https://dlmf.nist.gov/25.9). The strip-polynomial conclusion is all that is needed here; B_A is not optimized.

The explicit tail bounds in results.md imply, as N→∞ with A fixed,

R_j(A)= [2^(2−j)π^(1−j) j! + O_A,j(n^(−2))] n^(2−2j) exp(−πn²), j=0,1,2.   (3)

Equivalently R_0∼4P e^(−P), R_1∼2e^(−P), R_2∼2P^(−1)e^(−P). Proof: the first omitted index dominates; put u=x/(2P). Its rescaled density tends to exp(−x). The remaining indices have exponentially smaller weight, by a factor O(exp(−2πn)). Polynomial domination justifies integration against x^j; cosh(Ax/(2P)) tends to 1.

Combining (1)–(3), for P comparable to t,

|ΔW|/a <= C_A{t^(B_A+1)exp(−πt/4−P)+exp(−2P)}.    (4)

Therefore any choice

P>=πt/4+L log(t+2), with L>B_A+1+m,

and P comparable to t, gives

|ΔW|/a=O_A,m(t^(−m)exp(−πt/2)).                    (5)

For example choose n as the least positive integer with πn²>=πt/4+L log(t+2), and N=n−1. Integer rounding adds at most O(sqrt(t)) to P and does not hurt the bound.

The simpler raw moment estimate without M_j would require P roughly πt/2. Thus retaining the small full function halves the leading required n²/t constant. The value 1/4 is optimal for exponential-envelope approximation within the generic subthreshold regimes proved below, not a claim of optimality for all approximation methods or exceptional subsequences.

Equation (5) is accuracy relative to the UNCONDITIONAL ENVELOPE exp(−πt/2), not relative to |W_ψ|. If |W_ψ| is still smaller, or zero, this estimate is not a sign certificate. Increasing N can improve any prescribed absolute tolerance at each finite point; a uniform positive lower bound for the head/full shear remains additional arithmetic information.

## 3. Uniform adaptive tail-transform asymptotic
Take t=rP, r in a compact subset of (0,∞), and 0<a<=A. For z near t+ia set ζ=z/P. The exact first-tail-index scaling is

p(n,x/(2P)) = 8P²e^(−P) exp(x/(4P))
 ×{exp(2x/P)−[3/(2P)]exp(x/P)}
 ×exp{−P[exp(x/P)−1]}.

Consequently, uniformly for ζ in a fixed small complex neighborhood of the real r interval,

R(Pζ)=4P e^(−P)∫_0∞e^(−x)cos(ζx/2)dx+O(e^(−P))
      =16P e^(−P)/(4+ζ²)+O(e^(−P)).             (6)

The estimate also holds after j differentiations in z, with remainder O(e^(−P)P^(−j)), for each fixed j. To justify it, expand the displayed scaled density with an O(P^(−1)) integrable error on a growing x interval, and dominate its complement by an exponential. Choose the complex neighborhood with |Im ζ|<1; the cosine and its derivatives then remain integrable against the dominating exponential. Higher theta indices are exponentially smaller in n. Analytic uniformity also permits Cauchy differentiation.

Write L_r(ζ)=16/(4+ζ²); the subscript only indicates the neighborhood. Then (6) says R^(j)(Pζ)=e^(−P)P^(1−j){L_r^(j)(ζ)+O(P^(−1))}. Inserting this in the normalized identity from §1 and using a/P→0 uniformly for a<=A yields

W_tail(a,rP)/a
=e^(−2P){L_r′(r)²−L_r(r)L_r″(r)+O_A,r(P^(−1))}
=e^(−2P){512(4−r²)/(4+r²)^4+O_A,r(P^(−1))}.      (7)

This derivation does NOT substitute t-dependent N into a fixed-N endpoint expansion. It treats the boundary-layer scale u≈1/P and oscillatory scale 1/t simultaneously. Doing the former substitution would be unjustified because the endpoint expansion constants grow with N.

## 4. Transfer to the head below the approximation threshold
If r>4/π, then πt/4=(πr/4)P>P. The full function and its derivatives are exponentially smaller than R and its derivatives, by (2). Since Q_N=Ξ−R, quadratic expansion of the normalized identity gives

W_head/a = W_tail/a + O_A,r(poly(P)exp[−(1+πr/4)P]).

The error is exponentially smaller than e^(−2P), so (7) proves the main head asymptotic. Meanwhile |W_full|/a<=2C_A²(1+t)^(2B_A)e^(−πt/2). For r>4/π and r≠2, the ratio |W_head|/[a e^(−πt/2)] grows exponentially. Thus the head is not accurate at the full exponential envelope in either generic subthreshold sign regime.

In the apparently favorable interval 4/π<r<2, the exact correction ΔW=W_full−W_head is asymptotically NEGATIVE and cancels the positive head. For r>2 it is asymptotically POSITIVE and cancels the negative head. This contrasts with the fixed-N theorem in results.md, where the correction is eventually positive. There is no contradiction: the order/scaling of limits differs.

## 5. Conditioning and what remains
Adaptive n≈sqrt(t)/2 with logarithmic safety is a usable sufficient error-control regime for the natural completed-function envelope. It removes the automatic fixed-cutoff negative tail as a reliable proxy for the full function. It does not furnish a lower bound for W_head, nor a proof that the exact remainder is smaller than that lower bound at every t and every a.

In particular:
* The normalized bound avoids a spurious 1/a divergence, so a→0 by itself does not defeat this absolute-error scheme.
* At the subthreshold scales, the finite head and exact correction cancel exponentially larger quantities; treating either one's sign as evidence is unsound.
* Above the threshold, arbitrary envelope-level accuracy is attainable, but full-sign certification still needs a positive margin that is not supplied by gamma decay, modular symmetry, or the tail norm.
* An all-height/all-shift lower-margin theorem strong enough to close these inequalities would supply genuinely new RH-relevant arithmetic information. No such theorem is established here.

## 6. Supplemental checks
`adaptive_check.py` integrates the rescaled first-omitted-index kernel at r=1.5 and r=3, for n=5,10,20. The normalized zero-shift-limit shears converge toward respectively +0.58720256 and −0.08963271594131858, matching (7). Error sizes decrease like n^(−2). Higher indices are not included in this numerical diagnostic, but their asymptotic negligibility is proved above. The checks are not interval certificates.

### Uniformity detail for (6)
For clarity, the dominated expansion can be made quantitative without appealing to a formal Laplace series. Let
H_P(x)=exp(x/(4P)){exp(2x/P)−(3/(2P))exp(x/P)}exp{−P[exp(x/P)−1]}.
For P sufficiently large (for example P>=32), elementary inequalities exp(y)−1−y<=y²exp(y)/2 and 1−exp(−y)<=y, y>=0, give

|H_P(x)−exp(−x)| <= (C/P)(1+x+x²)exp(−3x/4), x>=0,

with an absolute C. To see this, separate the prefactor error from the exponential error; bound the former by O(P^(−1))(1+x)exp(9x/(4P)), and the latter by x²exp(x/P)/(2P), then multiply by exp(−x) and the prefactor bound. With |Im ζ|<=1/2 the cosine or its j-th ζ derivative is bounded by (x/2)^j exp(x/4). The error is therefore integrable and O_j(P^(−1)), uniformly on that neighborhood. This proves all fixed-order differentiated versions of (6) directly.

For indices m>=n+1, the same rescaling at P_m=πm² bounds their j-th z derivatives by C_j P_m^(1−j)exp(−P_m), uniformly when |Im z|<=P/2, because P_m>=P. Relative to the first index, their sum is O_j(exp(−2πn)) times a polynomial factor bounded for large n; this is o(P^(−1)). The subsequent normalized-shear identity avoids dividing a nonuniform error by a. These observations supply the uniformity conditions independently flagged by the foundations audit.
