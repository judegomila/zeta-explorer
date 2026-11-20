# Exact signed theta-tail closure (2 November 2026)

## Status and useful result
This is a proved, scoped decomposition, not an RH proof or a positive all-height approximant. It retains the exact modular tail through a one-dimensional Euler–Maclaurin integral. In particular, the tail's own shear is eventually negative, not positive. Head–tail cross terms supply twice the positive amount required to cancel the two negative self terms. Thus a scheme that drops the cross terms, or replaces the exact tail by an independent positive spectral weight, does not represent the full problem.

Source read in full: `libfile_45bd1fbffcf481918939d4c18afd8b43`, bridge_shear_vortex_positivity.tex, copied to source.tex. The source proves the finite-cutoff asymptotic used below. All additional displayed identities are derived here; no literature priority is claimed.

## 1. Definitions and exact closure
For v >= 0 let

p(n,v) = 4 exp(v/2) r (2r−3) exp(−r), r=π n² exp(2v),
f_N(v)=Σ_{1<=n<=N}p(n,v), r_N(v)=Σ_{n>N}p(n,v).

Then ψ=f_N+r_N. All half-line derivatives and every fixed exponential-weighted moment exist. Full modularity implies, at every odd order,

r_N^(2j+1)(0)=−f_N^(2j+1)(0).

This is exact, not asymptotic. In particular d_N=f_N′(0)>0 and r_N′(0)=−d_N. Although r_N is positive on v>=0, its endpoint derivative is negative.

The globally smooth full profile is ψ(v)=f_N(|v|)+r_N(|v|). Neither summand individually has smooth even extension. The cancellation is in the sum, including every derivative order. Replacing the remainder by an arbitrary smooth correction or reflecting f_N alone does not supply these identities.

For a half-line profile q set
A[q]=∫q(u)cosh(au)cos(tu)du,
B[q]=∫q(u)sinh(au)sin(tu)du,
W[q]=A[q]B[q]′−A[q]′B[q].

Define the mixed shear
X[f,r]=A[f]B[r]′+A[r]B[f]′−A[f]′B[r]−A[r]′B[f].
Then EXACTLY W[ψ]=W[f_N]+X[f_N,r_N]+W[r_N]. All integrals are over [0,∞).

The associated exact interaction decomposition, for q_e(v)=q(|v|), is
C[ψ]=C[f_N]+C_cross[f_N,r_N]+C[r_N],
C_cross(v)=∫_0∞ h sinh(2ah){f_e(h−v)r_e(h+v)+r_e(h−v)f_e(h+v)}dh.

All three profiles here are pointwise nonnegative. Their Fourier transforms need not be nonnegative. Their transforms at frequency 2t are respectively W[f_N], X, W[r_N]. This follows by the same linear changes of variables as the source; smoothness is not required for the absolutely convergent transform identity.

## 2. Signed high-height theorem
For each fixed N>=1 and a>0,

W[f_N](t)=−2a d_N² t^(−6)+O(a,N)(t^(−8)),
W[r_N](t)=−2a d_N² t^(−6)+O(a,N)(t^(−8)),
X[f_N,r_N](t)=+4a d_N² t^(−6)+O(a,N)(t^(−8)).

Consequently the exact total omitted correction satisfies

W[ψ](t)−W[f_N](t)=+2a d_N² t^(−6)+O(a,N)(t^(−8)).

In particular the correction is strictly positive for sufficiently large |t|, while the tail self term is strictly negative there. The onset may depend on N and a; this is not an effective all-height sign certificate.

Proof: For any smooth, rapidly decaying half-line q with d=q′(0), integrations by parts in the original integrals and their t derivatives give
A[q]=−d/t²+O(t^(−4)), B[q]=−2ad/t³+O(t^(−5)),
A[q]′=2d/t³+O(t^(−5)), B[q]′=6ad/t⁴+O(t^(−6)).
Thus W[q]=−2ad²/t⁶+O(t^(−8)). For two profiles with derivatives d,e, polarization gives X=−4ade/t⁶+O(t^(−8)). Set e=−d. No differentiated uncontrolled remainder is used. Higher-order endpoint terms cancel likewise in the full sum because ψ has zero odd jets. The full W is Schwartz; this does not establish its sign.

## 3. Exact analytic tail: no discarded theta indices
For fixed v>=0 extend p(n,v) to p(u,v), u>=N. Let β_1(u)={u}−1/2 away from integers. Euler summation gives the exact tail representation

r_N(v)=I_N(v)−p(N,v)/2+∫_N∞ β_1(u)∂_u p(u,v)du.

The integral is absolutely convergent. Writing c=π exp(2v), the elementary part is

I_N(v)=∫_N∞p(u,v)du
=2 exp(v/2)c^(−1/2){2Γ(5/2,cN²)−3Γ(3/2,cN²)}
=4 exp(v/2)c N³ exp(−cN²).

The last simplification uses Γ(5/2,z)=(3/2)Γ(3/2,z)+z^(3/2)e^(−z). Thus the exact remainder is one explicit elementary term, one boundary term, and one signed sawtooth integral. This is an exact arithmetic tail, not an evenization prescription. Its derivatives at v=0 equal minus the head odd jets by Jacobi modularity. One may differentiate under the integral at any fixed finite order.

For any integer M>=1 the equivalent formula is

r_N(v)=I_N(v)−p(N,v)/2−Σ_{k=1}^M B_(2k)/(2k)! ∂_u^(2k−1)p(N,v)+E_(M,N)(v),
E_(M,N)(v)=−1/(2M)! ∫_N∞ B_(2M)({u})∂_u^(2M)p(u,v)du.

A rigorous absolute enclosure is
|E_(M,N)(v)| <= [2ζ(2M)/(2π)^(2M)]∫_N∞ |∂_u^(2M)p(u,v)|du.

This is not a claimed sign enclosure: Bernoulli factors and derivatives change sign. Dropping E generally reintroduces endpoint defects. Keeping E gives exact modular closure. Bounds on v derivatives follow by replacing p with the corresponding derivative. These formulas yield finite certified integration problems without pretending the tail itself has a positive Fourier transform.

## 4. Explicit uniform error bounds, stable as a tends to zero
Fix A>0 and 0<a<=A. Define
F_j=∫_0∞u^j f_N(u)cosh(Au)du,
R_j=∫_0∞u^j r_N(u)cosh(Au)du, P_j=F_j+R_j.

Since sinh(au)/a <= u cosh(Au), direct bilinear estimates give, uniformly over ALL real t,

|W[ψ](t)−W[f_N](t)|/a
<= F_0 R_2+R_0 F_2+2F_1 R_1+R_0 R_2+R_1².

Thus an enclosure for W[f_N]/a whose positive lower bound exceeds this quantity proves the full sign at the specified points or compact interval. The estimate alone cannot prove the sign at every height: its right side is independent of t, while W tends to zero faster than every power. In fact W[f_N] eventually becomes negative.

For explicit scalar tail bounds set n0=N+1, q=exp(−2π n0), and
D_N=Σ_{m>=0}(n0+m)^4 q^m
=n0^4/(1−q)+4n0³q/(1−q)²+6n0²q(1+q)/(1−q)³
 +4n0 q(1+4q+q²)/(1−q)^4+q(1+11q+11q²+q³)/(1−q)^5.

The inequalities (n0+m)²>=n0²+2n0m and exp(2u)>=1 imply
0<r_N(u)<=8π²D_N exp(9u/2)exp(−πn0² exp(2u)).
For any δ>0 and j>=0, putting b=(9/2+A+δ)/2 gives

R_j <= 4π² D_N j! δ^(−j) (πn0²)^(−b) Γ(b,πn0²).

This follows from u^j<=j!δ^(−j)e^(δu), cosh(Au)<=e^(Au), and y=e^(2u). It supplies effective convergent bounds, uniform in a∈(0,A], without loss from dividing by a. A sharper j=0 estimate sets δ=0 directly.

## 5. What is and is not obtained
Obtained: exact signed arithmetic tail, all-order endpoint closure when the remainder is retained, signed leading head/tail/cross spectral contributions, explicit compact-window certification bounds uniform down to arbitrarily small a after normalization.

Not obtained: a finite approximant that is positive definite at all heights, a positive spectral tail, a frequency-relative remainder bound, or an RH proof. Since positive-definite functions are closed under pointwise convergence, construction of everywhere-positive approximants converging to every full C_a would itself establish the missing RH-equivalent theorem; smoothness or modular symmetry alone cannot substitute for that positivity proof.

## 6. Supplemental numerical check (not a certificate)
60-digit mpmath evaluation of d_N and the tail derivative summed through n=19 gives:
N=1: d_N=0.07899753053549986936681703,
N=2: d_N=0.0000001653055915545467882287439,
N=3: d_N=2.783451727218610304943462e−16.
The tail derivative is the negative of each value within approximately 1e−62 in these computations. This illustrates the exact modular identity but is not used in the proof.

## 7. Effective eventual sign, with an explicit (not optimized) threshold
The big-O in the signed correction can be replaced by derivative-norm constants. This does not supply the intervening heights, but makes the signed-tail statement quantitative.

Fix a>0. For each q (f_N, r_N, or ψ), write F(u)=q(u)cosh(au), G(u)=q(u)sinh(au), d=q′(0), and define
α=|F'''(0)|+||F^(4)||_1,
β=|G^(4)(0)|+||G^(5)||_1,
γ=|(uF)^(4)(0)|+||(uF)^(5)||_1,
η=|(uG)^(5)(0)|+||(uG)^(6)||_1.
All norms are on [0,∞). Integration by parts gives for |t|>=1
|A+d/t²|<=α/t⁴,
|B+2ad/t³|<=β/|t|⁵,
|A′−2d/t³|<=γ/|t|⁵,
|B′−6ad/t⁴|<=η/t⁶.
Consequently

|W[q]+2ad²/t⁶| <= M[q]/t⁸,
M[q]=|d|η+6a|d|α+2|d|β+2a|d|γ+αη+γβ.

This follows by expanding the two products; the final two product-error terms actually have order t^(−10), weakened to t^(−8). The derivative norms can be rigorously bounded by Gaussian/incomplete-gamma integrals using the explicit theta series or the exact Euler tail above. No noncomputable limiting constant is required.

In particular with M_tot=M[ψ]+M[f_N],

W[ψ](t)−W[f_N](t) >= 2ad_N²/t⁶−M_tot/t⁸.

The exact omitted correction is positive whenever
|t|>=1 and t² > M_tot/(2ad_N²).

This bound is generally very inefficient (d_N is tiny), is for fixed a,N, and asserts positivity of the CORRECTION, not of the full shear. It is nonetheless a genuine signed tail bound beyond an explicit threshold, paired with a computable absolute bound on the remaining finite window. It cannot be promoted to a global RH proof: the full shear is the very small difference left after the leading cancellations.

Independent check: the foundations lane verified the −4ade mixed coefficient algebraically. `check.py` and `check_output.txt` include two 70-digit Euler-summation closure checks as well as endpoint checks. They are diagnostics, not interval certificates.
