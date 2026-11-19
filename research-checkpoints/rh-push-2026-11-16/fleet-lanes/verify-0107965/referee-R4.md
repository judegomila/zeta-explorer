# Referee R4: physical approximation at probe heights up to 6 (sec 3.2, Prop 3.2, App C.1-C.2, packet notes)

Object: hexagon:2611.00460v1, Prop 3.2 (eq. (51)-(57)), App C.1-C.2, and the packet prose notes it points to
(`08_BROAD_HEIGHT_SOURCE_EXTENSION.txt`, `06_SHARED_REMAINDER_PROOF.txt` sec 2,
`HEIGHT_SPECIFIC_OLD_COMMON_PHYSICAL_SOURCE_V1.txt`), against Polymath arXiv:1904.12438v2 (source fetched
into `R4/polymath/debruijn.tex`; Prop 6.1 = "Estimate for r_{t,n}", sec 6.2 = Props 6.2-6.3 "Estimation of R_{t,N}").

## Verdict

**verified-with-corrections.** No error found. Every step of the extension to Re s in [-3,4] was re-derived
and every constant typed into the `wall` stage for Prop 3.2 was recomputed; all hold, most with large slack.
The result is conditional on three cited inputs that were not re-proved (list in "Not checked"). The
corrections are presentation/completeness items (C1-C5 below); none changes a number.

Labels: PROVED = re-derived here by hand from the stated hypotheses; MEASURED = numerical test (not interval
arithmetic); CITED = taken from the literature through Polymath.

## 1. What the statement needs and where each piece comes from

For z' = x+v+ih, the two real parts entering Polymath's expansion (37)-(41) are (1 -+ y)/2 with
y in [h-0.01, h+0.01], so y <= 6.01 gives [-2.505, 3.505], inside [-3,4]. PROVED.

| Step | Claim | Status |
|---|---|---|
| S1 | Polymath Prop 6.1 (single heated term) holds for every real sigma, T > 10, 0 < t <= 1/2 | PROVED from its printed proof: the only inputs are Im alpha_n >= -0.15, abs(alpha') <= 1/(2(T-3.08)) on a horizontal segment, Stirling with abs(Im z) >= 1. None depends on sigma. MEASURED: relative error <= eps_{t,n} at sigma in {-2.505,-1,0.5,2,3.505}, x in {2000, 30000.5}, t in {0.02, 0.152}, n in {1,3,N} (60 cases, ratio 0.82-0.98 of the bound). |
| S2 | Corrected Gaussian constant 11/12 | PROVED. Polymath bounds the Stirling term 1/(12(T'/2-0.33)) by (1/3)/(4(T-3)); that is false for T > 5.4 (the ratio tends to 2/3: measured 0.66666666666615 at the anchor). With 2/3 the integrand exponent is (u^2+6abs(u)+2/3)/(4D) and 4(u^2+11/12) - (u^2+6abs(u)+2/3) = 3(abs(u)-1)^2 >= 0; with 5/6 the difference is -1/3 at abs(u)=1. The author's correction is right and necessary. |
| S3 | G_sigma(c) of (56) is the exact Gaussian average | PROVED by completing the square; MEASURED against quadrature to 55 digits at three parameter sets. |
| S4 | delta_1 = 0.2 G_sigma(log 9)/(a-0.865), delta_2 = 0.029 G_sigma(-log 2)/(a-0.353), 1+eps = G_sigma(0) for every real sigma | PROVED: Polymath's bound on sum abs(C_k)/a^k + abs(RS_K) is stated for all real u (the integration variable already runs over the whole line in the published proof), so moving sigma only moves the Gaussian centre. No new demand is made on the Arias de Reyna bounds. |
| S5 | max over sigma in [-3,4]: at 4 for c = log 9 and c = 0, at -3 for c = -log 2; G_4(log 9) < 8104, G_{-3}(-log 2) < 8.5; bracket < 1 | PROVED (convex quadratic exponent); recomputed: 7882.14, 8.1474, bracket = 0.50229. |
| S6 | Negative tail delta_3 <= e^{-30000}/600 | PROVED: support r = -u >= T'/pi - 4, k <= r+4, Gamma(k/2) <= e^{k^2}, (r+sigma)^2 >= (r-3)^2, t^{-1/2}e^{-c/t} increasing on t <= 1/5; exponent -4r^2+38.7r+log(r+5)-28.8+(r^2+11/12)/D <= -3r^2 for r >= 100. |
| S7 | Each complete remainder <= e^{t pi^2/64} abs(M_0(iT')) | follows from S2-S6 + CITED inputs. MEASURED directly from xi (heat integral of xi/8 minus both finite sums, N = floor(sqrt(T'/2pi))): abs(R_total)/(e^{t pi^2/64}abs(M_0(iT'))) = 0.405-0.411 (x = 2000, 2003.7) and 0.643 (x = 30000.5) for y in {0,1,2.5,4,6.01}, t in {0.02,0.152}; the claimed bound for two remainders is 2. The measured value does not depend on y, as the argument predicts (it is about 2 abs(C_0(p)) times a phase factor). |
| S8 | alpha bounds: abs(alpha - (L'/2 +- i pi/4)) < 10/x', abs(alpha') < 2/x', abs(alpha) < L'/2+1 on abs(Re s) <= 4, abs(Im s) = x'/2 | PROVED (1/x' + 2/x' + 4/x' = 7/x'); MEASURED max 7.0000/x' and 1.0000/x' on a grid at the anchor. |
| S9 | (57): e_C < 4 exp(-(1+y)L'/4 - tL'^2/16 + 1/10) | PROVED. The exact exponent of e^{t pi^2/64}abs(M_0(iT'))/abs(M_t(s_+)) is -(1+y)L'/4 - tL'^2/16 + O(1e-14): the three pi^2 terms cancel (t pi^2/64 - t pi^2/32 + t pi^2/64). MEASURED at x*, X+1e6, 100X, y in {0,..,6.01}, t in {0, 0.05, 0.152}: deviation from the main term between -3.5e-14 and +3e-26. So the 1/10 reserve and the factor 4 (two remainders, each with bracket 0.5023 < 1) are both slack: the true size is about 1.005 e^{-S}, the charge is 4.42 e^{-S}. |
| S10 | Mass and moments 6 / 22 / 180 per branch, total mass 18 | PROVED: term <= n^{-q}(1+1e-12), q = (1+y)/2 + tL'/8 > 5/4 by (52) (uses b_t(n) n^{-tL'/4} <= n^{-tL'/8} for log n <= L'/2 + 1e-12; reflected branch has the extra factor e^{y(log n - L'/2)} <= 1+1e-11). zeta(5/4) = 4.5951, -zeta'(5/4) = 15.930, zeta''(5/4) = 127.99; with the 1.01 inflation 4.64 / 16.09 / 129.3. MEASURED at the anchor (direct sums over n <= 690988): first-branch moments 1.06-1.96 / 0.04-1.71 / 0.04-4.7. |
| S11 | e_AB = 5.5e-12 | PROVED: d = (t^2(L/2+1)^2/8 + t/4 + 1/6)/(x/2 - 3.33) = 2.692e-13 at t = 0.152, L = 26.90, x = x*; 18(e^d - 1) = 4.846e-12. abs(alpha - log n) <= L'/2 + 1 for 1 <= n <= N since Re(alpha - log n) in [-1e-12, L'/2 + 1e-12]. Decreasing in x. |
| S12 | One activation at most; abs(log m - L'/2) < 1e-12; pair cost 3e^{1e-5}e^{-S} | PROVED: spacing 4 pi(2m+1) > 1.7e7, displacement < 2, abs(u) <= 3.53e-13, abs(eta) <= 1.77e-13; exponent of each branch term = -(1+y)L'/4 - tL'^2/16 - (1+y)eta/2 + t eta^2/4 (the term linear in t eta cancels). MEASURED: exact-source pair at the activation of m = 690989, both crossing directions, four (h,t) rows: ratio to the charge 0.62-0.67. |
| S13 | Cauchy factor 100 | PROVED: H_t/B_t minus the exact-source model with the centre's N is holomorphic in zeta on the closed disk of radius 1/100 (M_t analytic and nonzero at abs(Im s) about 3e12; s_U, s_V, gamma are holomorphic in z); S7, S11, S12 bound it at every point of the disk because every such point has y >= h - 1/100, x' >= X - 1.96 > X*. The leading-model and common-clock transfers are differentiated explicitly, not through Cauchy. |
| S14 | Exact -> local leading: value (440t + 12 y C_gamma)/x', derivative (y C_gamma(6L'+22) + 5t(22L'+360) + 12 C_gamma + 44t)/x' | PROVED by the product rule with delta_s = 5t/x', delta_s' = t/(2x'), delta_gamma = y C_gamma/x', delta_gamma' = C_gamma/x' and the factor 2 for exponentials; my derivation gives exactly the printed expressions. Values at the anchor: 1.5775e-10 < 2e-10, 2.3866e-9 < 2.5e-9. |
| S15 | Local leading -> common model: 36 B_fr and 18 B_fr(L+1) + 36/(x-2), B_fr = (30 + 2t(L+3))/(x-2) | PROVED with room: I get delta_s <= t/(2(x-2)), delta_gamma <= (28.01 + t(L+2))/(x-2), value <= [336.1 + t(12L+68)]/(x-2) (printed fee: [1080 + 72t(L+3)]/(x-2)), derivative <= [(28.01 + t(L+2))(6L+22) + t(11L+180) + 6]/(x-2), about 6.0e3/(x-2) (printed fee about 1.97e4/(x-2)). Values: 2.3454e-10 < 2.35e-10, 3.278e-9 < 3.3e-9. |
| S16 | E_0 = 8e^{-S} + 5e-10, E_1 = 800e^{-S} + 7e-9; baselines e_0 = 5e-7, e_1 = 5e-5 | PROVED: 4e^{0.1} + 3e^{1e-5} = 7.4207 < 8; fixed fees 3.978e-10 and 6.214e-9. (52) is equivalent to S > (5/2)c* = 16.80625, so E_0 < 4.026e-7 and E_1 < 4.021e-5 on every admissible row, without reference to the plan. Own exact check of the pinned plan (sha256 ec346b7c..., 67 rows, 1048 nodes): all guards of (52) hold, minimum of the guard quantity 1.4439 > 5/4, heights 1.22-6.0, max abs(v) = 1.95. |
| S17 | App C.1 (128)-(129) | PROVED: abs(Delta') <= P e_1 + P_1 e_0/2 by the product rule; the quotient identity and the bound r_1/(g-r_0) + (B+b) r_0/(2g(g-r_0)) follow from abs(Q) >= g, abs(Q+Delta) >= g - r_0, abs(Q') <= (B+b)/2. Direction of use is correct (upper bound on the log-derivative discrepancy, needs g > r_0). |

MEASURED joint test of S14+S15 at the anchor (256-bit sums over all n <= 690988, exact-source model with
exact alpha, gamma versus f_x of (51)), x = X, (v,h,t) in {(+-1.95, 6, 0.152), (1.96, 6.01, 0.152),
(1, 3, 0.1), (-1.95, 1.5, 0.152), (0, 6, 0.152), (1.95, 2.5, 0)}: value difference <= 1.9e-14, derivative
difference <= 1.0e-14, against fees 3.92e-10 and 5.66e-9.

## 2. Failure modes looked for

- **Open range used at an endpoint.** Polymath's expansion is for t > 0; rows are closed and start at t = 0.
  The bounds (53)-(54) are non-strict, H_t -> H_0 locally uniformly (so derivatives converge), and
  N = floor(sqrt(e^L + t/16)) is right-continuous at t = 0, so the t = 0 case follows by the limit t -> 0+.
  This is one sentence in note 08 and absent from the paper's proof (C3). Height endpoints: y = h - 1/100 = 0
  cannot occur in an admissible row ((52) would need t_- > 0.22). Polymath's hypotheses T >= 100, t <= 1/2
  hold; the note's tail bound needs t <= 1/5 and rows have t <= 0.152.
- **Supremum at infinity.** All fixed fees are (polynomial in L of degree <= 2)/x with L > 26.89 > 2, hence
  decreasing in x; e^{-S} uses L' >= l*; the bracket uses a >= 690000 and D >= x*/2 - 3. Uniformity in
  x >= X holds (indeed for centres x >= X - 2).
- **Remainder valid only for large argument.** Stirling (Polymath Lemma 5.1(v)) needs abs(Im z) >= 1 or
  Re z >= 1; here abs(Im z) = T'/2 on the whole Gaussian line, including Re z -> -infinity. The Taylor step
  for log M_0 uses abs(alpha') <= 1/(2T'-6) on a horizontal line, uniform in u.
- **Direction of inequalities.** S uses the lower ends h - 1/100, t_-, l*; fixed fees use the upper ends
  y = 6.01, t = 19/125, L = 26.90 at the smallest x. Consistent.
- **Appeal to an earlier preprint.** The proof of Prop 3.2 in the paper is an outline; the derivation is in
  three packet notes written for the earlier chain (C1). I did not rely on them: each step above was
  re-derived. Note 08 as printed still has 5/6 and is stated for a 0.02 displacement; note 06 (2.2) and the
  height-specific note supply the 2-unit displacement and 11/12.
- **Moving cutoff differentiated.** Not done: the centre's N is frozen on the disk and the one possible
  index change is paid as a value error before Cauchy.

## 3. Corrections and remarks

- **C1 (self-containment).** Prop 3.2 is proved in the packet notes, not in the paper. The notes are
  layered (08 with 5/6, corrected by the height-specific note; 06 for the frozen model). A single
  consolidated proof should be in the paper or supplement. No mathematical gap once the three are read together.
- **C2 (inherited omission in Polymath sec 6.2, not mentioned by the author).** For u < 0 Polymath takes
  K_u = max(floor(-u)+3, floor(T'/pi)). When floor(-u)+3 < floor(T'/pi) (all moderately negative u) the
  remainder term (1/2)(9/10)^{ceil(-u)} Gamma((K_u+1)/2)/(a/1.1)^{K_u+1} has index K_u+1 > T'/pi but
  K_u+1 > -u+4, so it is not contained in the displayed sum over T'/pi <= k <= -u+4 and is dropped.
  Patch: with m = K_u+1 in (2a^2, 2a^2+1], Gamma(m/2)(1.1/a)^m <= C (1.21 (1+1/(2a^2))/e)^{m/2} < 0.446^{a^2},
  and a^2 > 4.7e11; integrated against 2^{-u} times the Gaussian it is below 8.5 * 0.446^{a^2}, far below the
  1e-100 allowance and the 0.4977 margin of the bracket. No number changes.
- **C3 (t = 0).** Add the limiting argument to the proof of Prop 3.2 (see section 2).
- **C4 (slack, not an error).** The reserve 1/10 in (57) is described as paying "the positive correction
  t pi^2/32"; the exact exponent has no such term (the heat factor of M_t and the shift T -> T' cancel it).
  The bound is valid as stated, about a factor 4.4 above the true remainder.
- **C5 (packet hygiene, relevant to anyone replaying).** `check_wall_and_physical.py` inserts
  `/tmp/lambda_publication_flint_runtime` at the front of `sys.path` and reads the plan from an absolute
  `/workspace/...` path. I did not run it; its physical-part arithmetic was recomputed independently
  (`R4/scripts/r4_scalars.py`).

## 4. Not checked

- Arias de Reyna's bounds on C_k and RS_K (Polymath Prop 6.2), Boyd's Stirling remainder (Lemma 5.1(v)),
  abs(C_0(p)) <= 1/2, and the Riemann-Siegel identity (37)-(41): CITED. The numerical test S7 exercises
  their combined consequence at x about 2e3 and 3e4 only; nothing was tested numerically for H_t itself at
  x about 6e12.
- The wall remainder (26)-(27) of Prop 2.3 (sigma in [-1,2], t <= 1/5; constants 229/1000 and 110): outside
  this part. The same S2-S9 argument applies; I did not recompute its scalars.
- How e_0, e_1, E_0, E_1 are consumed (refunds, App C.3, debit ledger), and the Euler norms P, P_1.
- My numerics are mpmath (50-60 digits) and python-flint used as high-precision floats; they are tests,
  not certificates. The packet's own `wall` stage was not executed.

## 5. Files

- `R4/scripts/r4_scalars.py` (constants, alpha bounds, normaliser exponent, fees)
- `R4/scripts/r4_remainder.py`, output `R4/r4_remainder.out` (remainder and term tests from xi)
- `R4/scripts/r4_common.py`, output `R4/r4_common.out` (anchor sums, crossing pair)
- `R4/scripts/r4_plan_guards.py` (exact row-guard check of the pinned plan)
- `R4/polymath/debruijn.tex` (arXiv:1904.12438v2 source; lines 602-920 are sec 6.1-6.2)
