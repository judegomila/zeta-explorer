# Baseline synthesis (2026-11-16): the sixteen `b-*` lanes

Source: the per-lane ledger (author claim, referee report, surviving statement). This file records only what a referee confirmed. Every referee here is an internal adversarial pass; nothing has had external review. Labels: PROVED / CLASSICAL / CERTIFIED / MEASURED / HEURISTIC / MODEL / SKETCH / OPEN, as graded by the referee, not by the author.

Lane files: `tmp/research-2026-11-16/push/<slug>/RESULT.md` and `REFEREE.md`. Several referee scripts are in `/tmp/` (volatile) and are not archived.

Summary of outcomes: 16 lanes, 16 referee passes, no PROVED step failed re-derivation in any lane. Verdicts: 3 proved-new-result, 5 partial-result, 7 precise-obstruction, 1 dead. Every lane had at least one statement narrowed or corrected. No lane gives a statement about the location of zeta zeros. No unconditional bound on Lambda changes.

---

## 1. Referee-surviving results

### 1.1 New proved statements (internal, unrefereed externally)

**E1. Escape law (`b-escape-law`).**
Statement: for every tau > 0, H_{-tau} has zeros with |Im z| -> infinity along a relatively dense set of heights, at depth (tau/2) log(x/4pi) + 2 sigma_0 - 1 for each zero sigma_0 + i t_0 of D_tau(s) = sum_n exp(-(tau/4) log^2 n) n^{-s}; at least cX zeros lie outside any horizontal strip up to height X.
Dependencies: Lemma 1; Lemma R on compact sigma-ranges; Hadamard (D_tau has zeros); Bohr almost periodicity (CLASSICAL); Rouche.
Checks: three independent referee reruns (zeta at tau = 0.5 and 0.2; Davenport-Heilbronn at tau = 0.6). Holds for DH, so it is Euler-blind.
Consequences that follow: every horizontal-strip statement true for xi (PNT line; QRH 7/8 given its unrefereed input) and every N(sigma,T) = o(T) statement is flow-critical at xi without RH strength; flow-stable hypotheses cannot prove any strip; reaching Lambda = 0 needs kappa(P) = 0.
Proved only modulo a repairable uniformity gap in the Lemma R tail: the sharp reach limsup = 2 sigma^+ - 1, the sigma_1 upper envelope, and C3 (survival of P_c = 2c).
MEASURED, not interval-certified: 86 zeros at tau <= 0.25; density law 1/(4 pi tau). OPEN: sigma^+(tau). Novelty against the literature not checked.

**E2. Route M first moment (`b-route-m-first-moment`).**
Conditional on the classical Vasyunin/BBLS identity I(a,b) = b A(a/b), A(x) = int_0^inf {t}{xt} dt/t^2 (checked numerically, not proved in the note). PROVED:
- I(a,b) >= min(a,b).
- F(b) >= b phi(b)/2 - 1 for all b >= 3, so kappa(b) >= 1/3.
- |F(b) - K b phi(b)| <= b 2^omega(b) (3 + 2 log b) + 2 + log b, K = (3/4)(log 2pi - gamma) - 1/4 = 0.6954960511.
- kappa_cot -> 1/8 (the imp-97541 conjecture); O-constant not explicit.
- Int(N) >= (36 K^2/pi^2) log N - O(1).
- Q(b) >= phi(b) - 1; Q(b) = s0 phi(b) + O(2^omega(b) log^3 b) with explicit constant, s0 = (1/4pi) int |zeta(1/2+it)|^4/(1/4+t^2)^2 dt.
- T(M) slope 12 s0/pi^2; ||G_N||_F^2 slope 2 s0.
- lam_max(G_N) <= 18 for all N (Schur test).
MEASURED: s0 = 2.9193 (float quadrature, no enclosure). SKETCH (completable): lim lam_max(G_N) >= 4 zeta(1/2)^2 = 8.5305. OPEN: equality.
Scope: mean-value statements about the Nyman-Beurling Gram matrix. Nothing about lam_min, d_N or zeros. New relative to the repo only; ingredients are in Baez-Duarte-Balazard-Landreau-Saias 2005.

**E3. Calogero-Moser minimal-pair theorems (`b-sg1c-r1-transfer`).**
For N distinct real points under the attractive CM flow, minimal gap m, minimal-pair Theta. PROVED:
1. Theta_min jumps only downward at minimality transfers.
2. For every adjacent pair, d/ds[(1-Theta)/g] = (4 - 6 sum mu^2 - 2 sum mu^3)/g^3.
3. A globally minimal pair has g^2 dTheta/ds <= 4(1-Theta)^2 Theta.
4. W = (1-Theta_min)/(Theta_min m) is nondecreasing; hence m0^2/8 <= t_c <= m0^2 (1+Theta0)/(8(1-Theta0)) <= (N-1) m0^2/8, with no trap or isolation hypothesis.
5. The Theta_b = (sqrt(73)-5)/8 trap survives transfers; every level in (Theta_b, 1) is crossed upward by a strictly minimal pair starting just below it.
6. Hermite zeros: Theta_min constant = 1 - m0^2/2, t_c/m0^2 ~ N/(2 pi^2); so no N-uniform t_c <= C m0^2.
Checks: exact-rational verification on 40,000 and 154,372 configurations, 240 independent flows.
MEASURED: rho-basin not closed under transfer. OPEN: t_c <= m0^2/(8(1-Theta0)); the excursion function e(theta0); the reachability form of R1 from generic or isolated data; C_N.
Holds for any finite real point set, including DH zeros. No literature check.

**E4. Theorem HF (`b-conjecture-22-1`).**
Statement: a sum of real Gaussian-times-polynomial blocks with arbitrary real centres and widths has at most 2 sum_{non-widest}(d_j+1) + sum_{widest}(d_j+1) - 1 <= 2 D_t - 2 real zeros; sharp for degree 0 (interval-certified for N = 4, 6).
Dependency: Gaussian variation diminishing (CLASSICAL; the Karlin theorem number is unverified). Degree 0 is Kalai-Moitra-Valiant with the same induction.
Consequence: a storage floor D >= (M+1)/2 = 6,181,576,718,570 for any real-width, real-frequency frozen ladder at the Platt-Trudgian benchmark. This replaces the heuristic regime (B) of imp-33233.

**E5. Lean formalization (`b-lean-eq48`).**
PROVED in Lean 4.22 + Mathlib v4.22.0: 7 files, 1612 lines, no sorry, 29 theorems with axioms [propext, Classical.choice, Quot.sound]; independently rebuilt by the referee.
- Pick matrices: if P_T is PD then P_{T+y} is PSD iff Delta >= 0 and PD iff Delta > 0; det P_{T+y} = det P_T * Delta.
- (a) <=> (b) for any L analytic on (a, inf), a >= 0, with L >= c > 0 eventually and L(y)/y -> 0. Lemma B by a one-variable proof.
- The hypotheses are proved for Mathlib's xi: `xi_theorem2 : ResidualTarget Lxi (Ioi 1/2) <-> FullClass Lxi (Ioi 1/2)` with no hypotheses. Here (a) is the Pick-side statement Delta_T(y) >= 0 and includes the empty node set; the nonempty-T reading (`xi_theorem2_pos`) needs the unformalized Lxi >= 0.
- Prefix-PD <=> all defects > 0; prefix-PSD => (b_I). Finite eq. (1.7) and on-line Hadamard limit => PSD.
Not formalized: Theorem 1 in full; PR #50 Prop. 5 and the Hadamard pairing (hypotheses of the Theorem 3 assembly). The theorem applies to DH and gives only an equivalence there.

### 1.2 Proved structural statements inside obstruction lanes

**S1. Alpoge-Furman chain (`b-alpoge-furman`).**
- With Re s > 7/8 as extra input the AF chain still gives 0.672500704 simple on-line zeros; the half-plane changes only error factors (X^(1/2) -> X^(3/8)).
- PROVED: Gram-window chain ceiling at bandwidth lambda <= 1 is C(lambda) = 2 - lambda/2 - cot(lambda/sqrt2)/sqrt2 over all real windows; C(1) = 0.6725007; zero at lambda0 = 0.5501939647 (interval-enclosed).
- DERIVED: bandwidth lambda in (1,2) beats 2/3 iff int_1^lambda (lambda-alpha) F(alpha) dalpha < (lambda-1)(2 lambda-1)/3. A zero-free half-plane gives no bound on F better than Montgomery-Vaughan for any lambda < 4.
- QUOTED + PROVED given the law: every linear bandwidth-one certificate valid on on-line configurations certifies at most 0.6818287 + 2.55e-6 (|r'(1)| + int |r''|); same for on-line-count certificates at any depth bound; no every-zero upgrade.
- MEASURED (comb LP, N <= 16, corrected values 0.6831608 at N=14 and 0.6828267 at N=16): extrapolation about 0.68173; no off-line column prices in.

**S2. Lacunary Pick nodes (`b-lacunary-threshold`).**
- (BT) xi'/xi(1/2+w) is of bounded type in Re w > 0 unconditionally, |B L| <= 2 |L_C|.
- (M) For a node set in Re w > 0 with sum Re w/(1+|w|^2) = infinity and no node at a zero, Pick/Weil positivity on it <=> RH. Closes route 13's conditional item for discrete sets such as nu_k = k^p, 0 < p <= 1.
- (M2) Geometric cones with ratio -> 1+ taken together <=> RH (density and the identity theorem).
- (M4) Prime-aligned cone has Blaschke product (1 - p^a p^-w)/(p^a - p^-w); the union over any infinite set of primes is dense on Re w = a, so positivity on it <=> RH, with no arithmetic content.
- (S) Given route 13's certificate (lambda_min >= 3.6346e-4) and float constants S = 4.5324, c(1) = 0.046136: positivity on {4^k} persists when an off-line quadruple at height >= 1000 is added to xi.
- MEASURED (added-quadruple model; gamma = 30, 40.9, 50, 60, 100): delta* crosses 1/2 at r in [0.5, 0.7]; delta* is not a function of r alone and the band is model-dependent.

**S3. Euler constraints (`b-euler-detector`).**
- PROVED (Lemma A): in a finite-dimensional FE-space with a multiplicative eigenbasis, Euler at p holds iff the supported eigenfunctions share the local factor at p.
- Given Kaczorowski-Perelli: a degree-1 FE function of any conductor has Euler density 1 or at most 1/2. Given Ramakrishnan: a finite combination of GL(2) newforms has density 1 or at most 7/8. Every non-collapsed member has zeros in Re s > 1 (Saias-Weingartner, Booker-Thorne; CLASSICAL).
- PROVED: right-edge formula. MEASURED: sigma*(DH) = 1.1203625 +- 1e-7.
- EXACT: all 283,144 prime conductors up to 4e6 collapse by prime 47; T_2 is irreducible on S_k for all even k <= 600.
- MEASURED: on 94 DH-type twins the off-line share is governed by the mixing phase (corr -0.97) and does not fall with Euler density (pair-level corr +0.34, p = 0.02).
- MEASURED: class-uniform Weil radius 0.7228 at conductor 1 (Rayleigh-Ritz upper bound); Weil positivity on tests of support below ln 3 confines c(2) to within 0.1% (outer bound).

**S4. Volterra norm (`b-volterra-norm`).**
- For canonical Phi: ||V_{a,Phi}|| <= 1 exactly for a <= a*, a* in (31.6213, 31.6214) (Arb enclosures plus hand tail bounds; independently reproduced).
- G/2 <= ||V|| <= G for every real Phi, G^2 = |p|^2 |q|^2 - <p,q>^2.
- T2: V depends on Phi only through Phi^2. T3: V is the Green operator of a string with mass Phi^2.
- The identity K_a <-> b_a (Hankel domination) is correct. With the corrected normalization Xi(w) = xi(1/2 + i w/2)/4: b_a >= 0 is classical for a >= 1, equivalent to the unrefereed 7/8 half-plane for a > 3/4, RH-equivalent over all a > 0. No Euler-product input.
- Referee measurement: the positive even DH kernel satisfies the same norm bound (0.0616, 0.124, 0.806 at a = 0.5, 1, 5).

**S5. Codex PR 56/57 (`b-codex-zero-channels`).**
- PROVED: PR 56's cutoff form equals the zero-sum (Weil) form on the one-sided test 1_[c,inf)(K*a); its Taylor-block target is the same RH-equivalent positivity on tests p(D)K.
- CERTIFIED on [0,1] up to an unenclosed series truncation, tail PROVED: the Csordas convexity input holds for the DH kernel, so PR 56's odd-cone theorem holds for DH.
- MEASURED (arb-decided signs, quadrature not enclosed, reproduced with separate code): DH Taylor blocks are positive through order 164 (even) / 169 (odd) and first fail at 165 / 170.
- MEASURED: blocks of order N tolerate about 10^-(N-2) relative error in the prime-2 theta term. Blocks of order <= 16 are positive on the backward heat family down to tau = -0.5.
- PR 57: certificates replay; its disk test passes at DH's off-line zero; it is a verified-height statement.

**S6. Codex PR 44/45 with 7/8 (`b-codex-energy-lanes`).**
- PROVED: the separated-tail limit theorem (qualitative form), the PR 45 all-order identities, and "no zeros of the transform in Re z > 3/8" hold simultaneously for kappa_sharp = P(d/du) kappa, whose transform P(z/2) xi(1/2+z) has prescribed off-line zeros in 0 < Re z <= 3/8 and whose energy kernel is not PSD.
- CONDITIONAL on 7/8 (Thm C): bridge-multiplier poles lie in discs |p - i gamma| < beta <= 3/8; the cutoff-averaged kernel K_x is PSD for x >= 3/8. Both transcribe the 7/8 input.
- PROVED and Arb-certified: PR 44's single-pole lower bound is < 7.1e-25 above verified height, so the 0.124030166 leakage bound is vacuous as a pole exclusion by a factor > 1e23.

**S7. Toeplitz ladder (`b-toeplitz-beyond`).**
- PROVED: the off-line pair kernel 2cosh(delta(x-y)) on L^2(-a,a) has lambda_min = 2a - sinh(2a delta)/delta.
- PROVED given the 7/8 theorem: for theta > Theta, W((g*g~) e^{-theta|u|}) = (1/pi) int Re xi'/xi(1/2+theta+it) |ghat|^2 dt, positive on every support with a uniform gap.
- SKETCH (one Fatou step to add): any all-support lower bound -C ||g||^2 implies the half-plane 1/2 + theta.
- MEASURED (float Ritz, 2a <= 11): zeta gap about 0.0925 theta; DH diverges for theta below 0.3085 in the resolved band.
- MODEL: crossover at X = 3e12 is 2a = 7.051 (delta0 = 1/2), 8.767 (delta0 = 3/8); margin at the theta = 0 crossover of order 1e-30900 by extrapolation; triviality height about 1e38.

**S8. MV-CAP function side (`b-mvcap-function-side`).**
Conditional on H_W(c, h+1) for a lane window (zeros real and simple; not known for any lane window above 3e12), double-precision constants:
- The cluster lift F = zeta (p+q)/p lies in route-42 class A(1), has one off-line pair, |dN| <= 1, violates the literal t = 0 form of H_desc(p) for every p > 0, and sup over Re s >= sigma > 1 of |F/zeta - 1| <= 2E + E^2, E <= C |Z(t_m)| (c/2pi)^(-(sigma-1/2)/2).
- At sigma = 2: C <= 2.44 for h >= 500 (E <= 8.7e-6 lane bottom, 3.3e-8 top via Hiary-Patel-Yang); C <= 3.34 for h >= 300 (1.17e-5, 4.6e-8).
- Theorem 1: matching lower bound |Z(e)| (c/2pi)^(-(sigma-1/2)/2) for removing a sign change of Z guarded by extremum e, under a polynomial growth bound in the strip and a line window of half-width >= 2a log log c.
- Proposition 3: log F(sigma+iu) is not positive definite for these lifts; log zeta is. log DH has coefficient -kappa < 0 at 3^-s, so exact positive-definiteness separates zeta from DH and from every lift.

### 1.3 Measurements and certificates

**M1. Route P collection (`b-route-p-motherbox`).** See section 5.

**M2. Close zero pairs (`b-lehmer-lower`).**
- MEASURED (double precision): 1,006,602,771 / 10,065,980,192 / 2,709,425,640 zeros of Z located in windows at 1e12 / 1e15 / 1e18; Riemann-von Mangoldt count discrepancies in [-2.0, 2.4], no step of -2 in any contiguous run.
- CERTIFIED (Arb; 7 pairs re-certified by the referee): 27 pairs of sign changes; smallest normalised distances 0.0002522, 0.0004021, 0.0006792. These are upper bounds on the minimal gap in each window.
- PROVED (Lemma W): on tests vanishing at the pair midpoint, the pair contributes (sigma/2)|V'(i gamma_0)|^2 + O(sigma^2) to the one-sided Weil form, analytic through sigma = 0, with sigma/2 = eps^2/2 equal to the two-body de Bruijn-Newman collision time. This is a pair coefficient, not a margin.
- MEASURED + HEURISTIC: prime-phase multipliers 3.925 +- 0.012 (pairs), 8.47 +- 0.07 (triples), 2% and 6% below n^2; small-gap count ratio 0.9829 +- 0.0018 against Bogomolny-Keating 0.9823 at 1e15.

**M3. Dyson defect (`b-dyson-defect`).**
- MEASURED (1.04e8 zeros, T = 1e7..1e12): c(L) = (Q+1) L^2/(12 Lambda_B) is not constant; slope -0.0056 +- 0.0014 per unit L; constant-c chi2 = 17.6 on 6 points.
- CLASSICAL, confirmed to about 1e-3 (not exact; regularisation not written out): Q = prime sum over n < e^X + remainder.
- MEASURED: prime-wave response equals the sine-process kernel within 0.5% for p >= 11 with k_p < 2; excess 1-3% for k in [2,4]; unmeasured above k ~ 3.9.
- HEURISTIC: formula (*) reproduces the total defect to 7-12% for L >= 14 (ratio 0.904 +- 0.009) through cancellation of two errors each about half the defect; predicts the conductor-5 character at two heights (0.135 vs 0.134 +- 0.005; 0.120 vs 0.116 +- 0.008).
- Forward heat flow = damping mode n by exp(-tau k(2pi - k)), confirmed to about 1e-3 relative.
- DH: Q+1 = 0.0 +- 0.05 on real zeros with about 10% of zeros off the line; -0.17 +- 0.02 for the 27.5%-off-line combination.

---

## 2. Results a referee broke

Statements in author claims that did not survive. None is a PROVED step; each is an overstatement, a wrong number, or a wrong attribution.

| Lane | Author statement | Referee finding |
|---|---|---|
| b-codex-zero-channels | Taylor blocks are "functional-equation rigid"; a proof must be exact in the functional equation at every order | Wrong attribution. An even, FE-preserving perturbation of the prime-2 theta term fails at the same orders. The tolerance is in that term regardless of evenness. |
| b-codex-zero-channels | "Every certificate in both PRs replays" | Two PR 56 continuum-radius certificates were read only. |
| b-codex-zero-channels | Horizon rule: failure order about 2 x height | One data point; PR 56's own comparison kernel has ratio 0.48. OPEN. |
| b-conjecture-22-1 | "Class R: reading S is refuted"; "the only escape is complex widths" | Does not follow. D >= (M+1)/2 is a storage bound. Locally evaluated class-R ladders remain; the comparison set total storage against one Riemann-Siegel evaluation (RS cost for the same deliverable is about 8.5e18). Refutation holds only under the read-every-coefficient cost model. |
| b-dyson-defect | Response equals GUE kernel within 0.5% for p >= 11 | Holds only for k_p < 2; excess up to 3% for k in [2,4], about 40% of the defect at L = 16.6. |
| b-dyson-defect | Formula (*) is Prop. 1 with K_P -> K and R -> modes above kappa | False part by part: model prime part 0.0332 vs measured 0.0158; model remainder 0.0000 vs measured 0.0143. |
| b-dyson-defect | (*) as a no-parameter law, chi2 = 2.3 | chi2 = 118.5 without normalisation; normalisation is 10 sigma from 1; on all 14 points the shape is not better than a constant. |
| b-dyson-defect | 1/L^2 coefficient is 0; Q+1 ~ 280.6/L^3 | Established for (*) only; OPEN for Q. |
| b-dyson-defect | DH gives 0.03 +- 0.015, "same range as genuine L-functions" | Heavy-tailed; realistic 0.0 +- 0.05; the second combination is 15 sigma from 0.13. |
| b-alpoge-furman | DH control: the mechanism yields a proportion for DH | Unsupported. The Euler product enters at bandwidth one in the prime-side second moment (P); sum |L(n)|^2/n for DH is 6.1x the zeta value at X = 2e5 and growing. |
| b-alpoge-furman | LP optima at N = 14, 16; "on = sym to 1e-8" | Not optima; corrected to 0.6831608110 and 0.6828267200. The agreement compared two under-converged runs. |
| b-alpoge-furman | Prop 2 zero side holds for every lambda; "C=1: 100%" | Fails for lambda >= 2; the optimum is justified only for C > 4/3; the 100% statement is unproved. |
| b-alpoge-furman | Half-plane misses by x^(2 Theta - 1) = x^(3/4) | Wrong measure; the number is withdrawn. Conclusion stands. |
| b-alpoge-furman | "Gap is proof-method slack"; ceilings "the same" | Comb-level N <= 16 local-search finding; common upper bound only. |
| b-volterra-norm | b_a >= 0 CLASSICAL for a >= 1/2; a >= 3/8 restates 7/8; poles at 1/2 + a | Factor-2 normalization slip. Correct: a >= 1, a > 3/4, 1 + a. A CLASSICAL label had been placed on an OPEN statement for a in [1/2, 1). |
| b-volterra-norm | "False for all a > 0"; "decided by three moments" | The bound is true for each a <= 31.6213 and false above a*; the range 1 < G <= 2 needed a test pair plus monotonicity. |
| b-volterra-norm | T2 implies blindness to zeros | T2 excludes only gauge-invariant implications. The DH measurement closes the loophole, not T2. |
| b-mvcap-function-side | C <= 2.44 at half-width >= 301 | Needs h >= 500. At h = 300 the constant is 3.19-3.34. |
| b-mvcap-function-side | Cap covers H_desc | Covers only the literal t = 0 form, which route 42 already calls weaker than needed. The mirror form (the one giving Lambda <= 0.145) is measured only, with 2 of 60 positions working at 7.5e16. |
| b-mvcap-function-side | Theorem 1: no model below eps* | Needs a growth bound not in the class axioms and a line window; forces only persistence of a guarded sign change. |
| b-lacunary-threshold | M1: any real sequence with sum 1/nu_k = infinity | False as written (nu_k = k^-2). Requires nu_k >= 1 or sum nu/(1+nu^2) = infinity. |
| b-lacunary-threshold | Table rows "< 1.7e-5" | Bracket midpoint reported as a bound; interval LDL gives 2.203e-5 for m = 6. Correct bounds < 3.4e-5, < 2.9e-5, < 2.5e-5. |
| b-lacunary-threshold | delta* is a function of r; measured to gamma <= 300 | Not supported: at r ~ 0.54, delta* ranges from 0.541 to 9.4e-5. r_c bracketed only at gamma = 30 and 100. |
| b-lacunary-threshold | DH fails a two-node test at its zero; certificate costs more than T^3 | Holds at 2 of 4 DH off-line zeros tested. The cost is for one dense-matrix scheme, not a lower bound. |
| b-euler-detector | corr +0.06 with Euler density | Design artifact (zero by construction). Controlled statistic: +0.34. |
| b-euler-detector | sigma*(DH) = 1.120362 | Sixth decimal not secured: 1.1203625 +- 1e-7. |
| b-euler-detector | Zeta min eigenvalues "positive, as it must be" | Unconverged (scale like 8/n^2); cannot be separated from 0. |
| b-euler-detector | Twin-table row on zeta(s-d) zeta(s+d) | States RH as a fact. Cosmetic, not load-bearing. |
| b-escape-law | Limsup identity, sigma_1 envelope, C3 as proved | Proved only modulo the Lemma R tail uniformity repair. |
| b-escape-law | C5: flow-critical at xi = uniform in height | Not an equivalence. |
| b-route-m-first-moment | Lower limit 4 zeta(1/2)^2 "PROVED"; DH "same proofs run" | SKETCH; DH analogue is MEASURED with different constants (L2's floor does not transfer verbatim). |
| b-sg1c-r1-transfer | "R1 is settled in all three readings" | Overstated. The reachability form from generic data remains OPEN; only its consumer is bypassed. |
| b-toeplitz-beyond | Real-zero backgrounds give 0.75-1.00 of the model | DH gives ratio <= 0.63. The crossovers are not lower bounds. |
| b-toeplitz-beyond | Lemma A as stated; margins 1e-30900 as measured | The kappa a <= 1 case is omitted (kernel not PSD there). Margins are extrapolations of a fit for a different form; relabelled MODEL. |
| b-codex-energy-lanes | "None can produce a zero-density or zero-spacing statement" | Unproved. P is a polynomial: only finitely many zeros are inserted. Asymptotic density statements are not excluded. |
| b-codex-energy-lanes | Counter-model satisfies PR 44 "in the form proved" | Only the qualitative form with P-dependent R. The numerical counter-model kernel changes sign, so deductions using kappa > 0 or log-concavity are not covered. |
| b-lehmer-lower | "Zero same-sign extrema of Z" | The scanner silently skips same-sign intervals clearing zero by about 0.03; larger extrema are excluded only by the count check. |
| b-lehmer-lower | Scaling N^(-2/3) under PROVED; table = smallest Weil margins | GUE prediction plus one running record. eps^2/2 is a pair coefficient on a codimension-one class. |
| b-lehmer-lower | Fits to n^2 | Pair multiplier is 6 sd below 4; triple ratios below the CUE factor. Validation value at 1e18 is 2.24e-12, not 1.2e-12. |
| b-lean-eq48 | DH: "both sides are then false" | Not established; needs unformalized Prop. 5. |
| b-lean-eq48 | `literal_a'_gap` refutes eq48 (a') | Refutes the Lean-form implication on a discrete sequence with a polynomial L outside the growth class. |
| b-route-p-motherbox | Collector banner "CERTIFIED (interval/Arb)" | The engine is double precision with a priori inflation factors; directed rounding in two C files only. Immaterial to the number (needs a uniform margin error of about 2.9e-4). |
| b-route-p-motherbox | Flat cover check and dyadic tiling checks as coverage proofs | The proof for parent-sourced boxes is the tree induction (holds). 258 of 2112 boxes in cert_10 miss their nominal cell by up to 5.5e-13; kd checks carry coverage. |
| b-route-p-motherbox | Only 36 certificates unrefereed | All 138 campaign certificates (115 new since collect6) lack independent-driver re-certification. |
| b-route-p-motherbox | Task premise (campaign in progress) | Stale. The campaign finished 2026-10-10 and was never collected. Motherbox contribution: -2.1e-7. |

---

## 3. Obstructions

Each is stated at the strength the referee confirmed.

1. **Strip statements cannot come from flow-stable hypotheses (E1).** H_{-tau} has zeros outside every horizontal strip for every tau > 0, for zeta and for DH. Internal proof; the sharp-reach parts need the Lemma R repair.
2. **Bandwidth-one proportion certificates stop at 0.6818 (S1).** Under RH, any zero-free half-plane and any depth bound. The 7/8 half-plane changes no main term of the AF chain. Passing 2/3 at bandwidth in (1,2) needs a bound on F(alpha) that a half-plane does not give for lambda < 4. An unconditional certificate in (0.6725, 0.6818] is not excluded at comb level.
3. **Sparse Pick/Weil node sets (S2).** Non-Blaschke node sets give RH-equivalence with no arithmetic content; prime alignment adds nothing (density on a line). A sparse cone {4^k} does not see an off-line quadruple at height >= 1000. Horizon figures beyond gamma = 100 are extrapolation.
4. **Euler-at-p as a membership constraint (S3).** It identifies the function (collapse to an eigenform) and does not locate zeros in the FE-spaces examined. Off-line share in DH-type twins tracks the mixing phase. Limited to that use of multiplicativity.
5. **Volterra norm (S4).** Decided unconditionally; true on the whole range a < 1 where zeros could matter; satisfied by the DH kernel. Carries no zero information.
6. **PR 56 Taylor blocks (S5).** Same RH-equivalent target as eq48 on a subclass of tests. DH passes all blocks to order 164/169 and the odd-cone theorem. Finite blocks are also blind to the backward heat control to order 16.
7. **PR 44 + PR 45 + 7/8 (S6).** A counter-model with prescribed off-line zeros in 0 < Re z <= 3/8 satisfies all three inputs. They exclude no zero in 1/2 < Re s <= 7/8 and give no effective finite-configuration bound. Not covered: asymptotic density statements; deductions that use kappa > 0 or log-concavity.
8. **Toeplitz ladder past ln 3 (S7).** An all-support certificate at damping theta is equivalent to the half-plane 1/2 + theta: the input at theta >= 3/8, RH at theta = 0. Finite-support rungs at theta = 0 carry margins of order 1e-30900 (MODEL). This is a cost estimate, not a theorem.
9. **MV-CAP on the function side (S8).** Conditional on H_W: a lift within about 1e-5 to 1e-8 of zeta at sigma = 2 has an off-line pair. Only the t = 0 form is covered. Exact positive-definiteness of log F (Euler product with Lambda >= 0) is the property the lifts lack.
10. **Conjecture 22.1 (E4).** A certified-numerics cost claim; every recorded argument uses only the sign-change count and holds for DH. The memory-index "untapped lead" line is stale.
11. **Dyson defect / Route 23 (M3).** Second-moment statistic; no Lambda constraint. DH with 10% of zeros off the line gives a value consistent with 0.
12. **Route M (E2), sg1c R1 (E3), Lehmer pairs (M2), Lean eq48 (E5).** Each holds for DH or for arbitrary real point sets, or is an equivalence only. None is a lever on zeros.

Common pattern in the DH controls: 13 of 16 lanes are confirmed Euler-blind by a referee-run or referee-checked DH computation. The places where the Euler product was located: the AF prime-side second moment (P); exact positive-definiteness of log F(sigma + iu) (Prop. 3 of `b-mvcap-function-side`); collapse of FE-spaces under Euler-at-p (identification only).

---

## 4. Top 5 next moves

1. **Referee and record collect7 (`b-route-p-motherbox`).** Re-certify a sample of the 36 incomplete floors with the independent driver; regenerate and re-replay X165mid and U2 for the joint value; re-check the collect7 certfile; then record in a data module. Route P alone has one substep of slack (2.67e-6); the joint value has 18. More cell compute is low value (at most 6.9e-6 if all stalled floors reach target).
2. **Close the escape law (`b-escape-law`).** Repair the Lemma R tail (bound |J_0(w)/J_0(z)| directly), referee the Rouche transfer, then update route 43's CONDITIONAL line and synthesis item 11. This fixes the flow-blindness wall as a written theorem rather than a class statement.
3. **Continuum kernel for an unconditional proportion in (0.6725, 0.6818] (`b-alpoge-furman`).** Prove that a non-Gram kernel r on [-1,1], starting from the N = 16 LP dual, satisfies int r |A_Z|^2 >= c(2N - s1) for all symmetric configurations. This is a proportion result; it does not approach RH.
4. **Formalize the Hadamard pairing of xi'/xi in Mathlib, then PR #50 Prop. 5 (`b-lean-eq48`).** This removes the two hypotheses and makes (a) <=> RiemannHypothesis hypothesis-free in Lean. It is an equivalence, not progress on RH.
5. **Use the located Euler-product entry points as the only continuing analytic leads.** (a) Exact positive-definiteness of log F(sigma + iu): remove H_W, extend to 1/2 < sigma <= 1, and prove the duration >= sqrt(c/2pi) claim by a Beurling-Selberg minorant (`b-mvcap-function-side`). (b) Lowering Theta, the only lever on the damped-Weil diagram (`b-toeplitz-beyond`; the TRO6 line). Both are OPEN with no result yet.

Lanes to close without further work: Volterra norm, Conjecture 22.1 as an RH route, Route 23 as a Lambda lever, the theta = 0 Toeplitz ladder, separated-tail and finite-jet lanes, the Euler constraint-class lane, Route M sub-gaps. Housekeeping attached to these: correct imp-33233 regime (B) and the stale memory line on 22.1; record a* in (31.6213, 31.6214); correct the RES-T crossover record (7.05 / 8.77, background-dependent); literature checks for the sigma* formula (Bombieri-Ghosh 2011, Righetti 2017) and for Theorem HF.

---

## 5. Status of Lambda and RH

The accepted benchmark is unchanged: Lambda <= 0.2 (Platt-Trudgian). No lane moves an unconditional bound. The only number below it in this ledger is conditional numerics relative to the route-P ledger, with internal checks only: route P alone gives Lambda <= 36249332027817/250000000000000 = 0.144997328111268 from Mac-engine certificates (collect7: 369 floors, 0 cover holes, 36 floors on incomplete covers admitted at their actual margins 0.27%-16.3% above target; slack to 0.145 is 2.67e-6). The referee reproduced this value, the cover and admission checks, and both sha256 values. The 3-band joint run gives 0.144963267002879 (consumer not rerun by the referee; logs read) and additionally relies on Theorem B'_m and the unreplayable X165mid/U2 records. With the 36 motherbox continuation certificates the values are 0.144997115913964 (U_robust) and 0.144963150729611. These depend on: open ledger items G0-c, G0-d, G0-d', AF gaps; unrefereed Lemma B and Theorem B'_m; in-house, FLINT-unaudited Route-2 zero windows above the Platt-Trudgian height (about 7.8e12 and 9.9e12); a single double-precision bound engine with a priori error factors, not interval arithmetic; and 138 campaign certificates with no independent-driver re-certification. It is not a theorem about Lambda and not a QED. RH is open. Nothing in these sixteen lanes proves a zero-free region, excludes a zero, or narrows RH; the proved items are Euler-blind statements, RH-equivalences, or conditional transcriptions of the unrefereed Re s > 7/8 input.
