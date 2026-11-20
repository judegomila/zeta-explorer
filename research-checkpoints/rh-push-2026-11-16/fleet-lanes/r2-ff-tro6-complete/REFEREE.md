# REFEREE: r2-ff-tro6-complete/RESULT.md

2026-11-16. Adversarial referee. Only this file was written in the repo; scratch code is in /tmp/ref-r2-tro6
(own pure-python implementation: polynomials as tuples, resultants by Euclid, Gauss sums from the definition;
shares no code with `ff.py` or `fflib.py`).

## Verdict

Every statement labelled PROVED was re-derived and survives as stated up to constants: Theorem A, Lemma R,
Theorem B, Lemma E, Theorem C (exponents), Theorem U, the d = 0 case of F1, Lemma H. Independent numerics at a new
prime (q = 19), new triples and new targets agree to 1e-14. The verdict "partial-result" is appropriate.
Four statements in the summary are worded more strongly than what is proved (section "Errors and gaps", items 1-4).
None of them invalidates a PROVED step. Nothing here bears on zeta or on any theta < 7/8, and the report says so.

## Re-derivation of the PROVED steps

* **Theorem A.** (i) m-sum over monic m of degree d: forces theta_1..theta_d = 0, value q^d psi(theta_{d+1}); with
  theta = z/(cA), deg z < k+N, this is deg z <= r and theta_{d+1} = z_r. (ii) tau = chi_A(-1) conj g_6(1,A),
  chi_A(-1) = chi_0(-1)^N, |tau|^2 = q^N by primitivity of chi_A for squarefree A; the separation formula holds for
  all m. (iv) cross factor conj chi_c(A) chi_A(c) = chi_0(-1)^(kN). Prefactor tau^-1 = chi_0(-1)^N g_6(1,A) q^-N.
  Total sign chi_0(-1)^(N(k+1)). (v) chi_c conj chi_A on constants is chi_0^(k-N); the a-sum is G or -1 at top
  degree and 0 or q-1 below. The generating-function form -[u^r](1-qu)L/(1-u) is correct. No use of c squarefree.
  Confirmed. N = 0 (A = 1) is covered.
* **Lemma R.** Twisted multiplicativity, g_6(m,c_2) = conj chi_{c_2}(m) g_6(1,c_2) for (m,c_2) = 1, vanishing of
  g_6(1,P^a) for a >= 2 (character of conductor P on modulus P^a), Moebius removal of (m,g) = 1,
  g_6(e m',c_1) = conj chi_{c_1}(e) g_6(m',c_1). Confirmed.
* **Theorem B.** g_3(1,gA') = chi_{A'}(g)^4 g_3(1,g) g_3(1,A') (the reciprocity sign is squared away). Diagonal:
  q^d sum_g mu(g) nu(g) phi(g) when N <= d, which is Theorem 1. For r < 0 one has r' <= r - gamma < 0, so only the
  diagonal remains: consistent with Theorem 1. Euler form: Moebius over h | (c,A) gives
  sum_h nu(h) a_{k'-j}(y) M_{N'-j}(y,h) with mu(h)^2 = 1. The r = 0 generating function
  (1-qu)^-1 prod_P (1 - nu(P) v^p (1-u^p)) and the value [u^2 v^3] = -q(q-1)(2q-1) for nu trivial were recomputed
  by hand. Phases sigma_gamma were not re-derived by hand; they are confirmed numerically below on blocks with
  gamma >= 1 and nonzero value.
* **Lemma E.** |c_j| <= (D-1) q^(j/2) (Weil; imprimitive factors have roots of modulus 1) and <= q^j; majorant
  series; binomial bound from (1 - q^(1/2) u)^-D. Closed bound checked on 14 (q, D) pairs, n <= 300, q = 7, 13,
  19, 31: no violation (slack >= 28 in the logarithm).
* **Theorem C.** Non-principal: |I| <= (N'+1) Lambda^2 q^((k'+N')/2); z-weights <= 2 q^(r'+1/2); the (g,e)-sum
  gives sum (gamma+1) q^-gamma = (1-1/q)^-2; exponent d + r + 1/2 + (k+N)/2 = log_q Q + (r-d)/2. Principal:
  z = a e^5 h^4 s^6, 6(gamma + deg s) <= r, weight <= 2 q^(5/6 + r/6 - gamma) (checked in both residue cases of
  r mod 6), |I| <= Lambda q^(k'+N'/2)/(1 - q^(-1/2)); total <= 6.1 Lambda Q q^(5/6 + r/6 - N/2). Diagonal
  <= 1.61 Lambda Q q^(-N/2). Exponents confirmed. Constant: see item 4.
* **Corollary.** (r-d)/2 <= -eta r/12 iff r <= 6d/(6+eta); 5/6 + r/6 - N/2 <= -eta r/12 iff
  N >= 5/3 + r(2+eta)/6. The sub-claims for k <= (d+1)/2 (eta <= 4 automatic; eta = 6 for N <= d, d >= 3) check.
* **Theorem U.** a_n(y) = 0 for n >= deg rad(y) and deg rad(y) <= r - gamma + deg e give j >= k - r - deg e + 1;
  trivial bounds give per gamma q^(d + N + 2r - 1/2 - gamma); C <= 2 (1-1/q)^-3 = 3.2 at q = 7. No Weil. The
  hypothesis N <= d is not needed for the inequality. Confirmed.
* **F1 at d = 0.** c_{6j} = (q-1)[q^(6j) + sum_{i=1}^{j-1} q^(i+6j)(1-1/q)] = (1-1/q) q^(7j); c_{6j+1}, c_1 as
  stated; psi(1,u)(1 - q^7u^6)/(1 - q^6u^6) = 1 + qGu. Confirmed.
* **Lemma H.** Re-derived: after the sum over the low d-j coefficients of m, deg x = k-1-d+j; c = xb + rho with
  deg rho < deg x <= k - j leaves the top j coefficients of c to b, and sum_b lambda(b) = 0. Needs 2j <= d+1.
  Confirmed. Remark: for J = 1 the statement follows from translation invariance T -> T + a alone; it has
  content only for J >= 2, d >= 3.

## Numeric rerun, different cases (own code)

| check | cases | result |
|---|---|---|
| Theorem A + Lemma R, q = 19 | (1,1,0), (1,1,1), (2,1,1), (1,2,1), (2,1,2), (2,2,1), 150 pairs each, all three classes | max abs error 9.5e-13 on values up to 361 |
| Theorem A + Lemma R, q = 7, outside the report's grid | (4,2,2), (2,4,2), (0,2,1), (3,0,1), (4,1,3), 30 pairs each | max abs error 2.8e-12 on values up to 1.8e3 |
| Theorem B, q = 19, targets trivial and conductor T^2 (non-squarefree conductor, not in the report) | 13 blocks, d <= 2 | relative error <= 1e-14 on nonzero blocks; zero blocks reproduced to 3e-10 absolute |
| Theorem B, q = 7, targets mod T^2 and mod T(T-1) (order 3 x order 2) | (2,2,1), (2,2,2), (2,3,2), (1,3,1), (2,2,0) | relative error <= 2e-15; gamma >= 1 terms and the diagonal are nonzero here |
| Theorem B, q = 13, targets mod T^2 and chi_0^5 mod T | (2,2,1), (1,2,0), (1,3,2) | relative error <= 1e-14 |
| Theorem U on the same blocks | nonprincipal part / q^(d+N+2r-1/2) | <= 0.22 |
| Theorem C split on the same blocks, nonprincipal targets | nonprincipal / (Q q^((r-d)/2)) <= 0.28; principal / (Q q^(5/6+r/6-N/2)) <= 0.73 | inside the stated constants |
| Lemma H, q = 7, d = 3, k = 1 | J = 1, 2 constant to 1e-16; J = 3 not constant | agrees |

Observed in passing: at q = 19 the trivial-target blocks (1,2,2), (2,1,2), (0,1,0), (1,1,0) have
|B| = ||c_k|| ||R_N|| (ratio 1.000), and |B|/Q = 0.217, 4.13, 4.36, 19. This reproduces limit (c) of section 6
at a new prime and bears on item 2 below.

## Errors and gaps

1. **"Holds exactly on the blocks with ..." is a sufficient range, not an exact one.** Theorem C is an upper bound.
   Nothing proves that the model statement fails outside r <= 6d/(6+eta), N >= 5/3 + r(2+eta)/6 (the report lists
   the window as OPEN in the same breath). Also the loss Lambda^2 = q^(o(k+N+f)) is not o(r): for bounded r, or on
   the boundary of the range, Lambda^2 q^(-eta r/12) > 1 and the stated inequality gives no saving. What is proved is
   |B| <= Lambda^2 Q [N q^((r-d)/2) + q^(5/6 + r/6 - N/2)] up to constants; this beats Q by a power of q^d only in
   the interior of the range and for f = O(d).
2. **The reference scale Q is not the Cauchy-Schwarz scale in the incomplete range.** ||c_k|| ||R_N|| = Q-size is
   proved only for 2k <= d and 2N <= d, which forces r < 0. For r >= 0 the ratio is measured (0.12 to 15.9 in the
   report; 0.217 to 19 in my q = 19 run), and c_k vanishes identically for k = (d+1)/2. "TRO6(eta) holds" is a
   bound against Q, not against ||c_k|| ||R_N||. The report states this in section 2; the summary does not.
3. **"TRO6 in this model <=> square-root bound for the Moebius sums of the target" is proved in one direction
   only.** Theorem U gives B = Diag + Princ + O(Q q^(2r-k-1/2)). (a) For 2r < k the error is <= C q^(-3/2) Q, a
   bounded factor; it is below the Weil size of Princ (Q q^(1/2 + r/6 - N/2)) only if k > N/2 + 11r/6 - 1.
   (b) Princ is a weighted sum over the coupling h and over sixth-power frequencies t of coefficients
   [v^(N-j)] 1/L(v, nu 1_{ht}), not of M_N(nu) alone; at r = 0 the terms j = 0 and j = 1 are of comparable size.
   The implication (bound on Princ) => (bound on M_N) is not written. (c) In the odd case Princ = 0 unless 6 | r
   (seen in my runs: (2,3,2), (1,3,2), (1,2,0) have Princ = 0 and the block is entirely non-principal), and at
   r = 0 the model statement asks for no saving. So the converse needs blocks with r proportional to N and
   k > 2r, and an inversion of the h, t sums. "Bound on 1/L coefficients => model TRO6 in the stated range" is
   proved; "equivalent" is HEURISTIC.
4. **Constants in Theorem C.** The sub-case "nu conj xi_y 1_h principal for non-principal y" is said to be
   "absorbed for r >= 1" without a computation. These y carry an extra factor (1 + q^(1/2)); for r' = 1 their
   share of the z-weight is about q^(-1/2), so the non-principal constant can exceed 2.8 by a bounded factor
   (roughly 2). The exponents are unaffected. The report lists this under weakest step 3; the constants 2.8, 8.4
   should be read as O(1). 1.61 = 1/(1 - 7^(-1/2)) is valid for q >= 7.
5. **Limits (a), (b) are thin.** (a) d = 0 is a one-row block, so ratio 1 is Cauchy-Schwarz equality by
   definition; it shows that a saving in r alone is impossible but says nothing inside r <= 6d/eta. (b) "bounded N,
   no saving at any d" is measured at N = 1, d = 3, 4 only; the argument (diagonal/principal term of size
   q^(-N/2)) is correct but is a two-point measurement.
6. **Controls.** Only DH is run. The sign twist and the backward heat family of the brief are not addressed; they
   do not apply directly (no zeta zeros, no Lambda(n)), and the report should say so.

## Controls

* **Davenport-Heilbronn.** Passes. Theorems A, B, U are linear in nu and hold for any combination; the saving
  comes only from W3, Weil for each Euler product separately, after
  sum_{A sf} mu(A) nu(A) conj xi_y(A) v^(deg A) = 1/L, which needs complete multiplicativity of nu. For
  c_1 nu_1 + c_2 nu_2 the zeros of the combination never enter. The Euler-product step is named correctly.
* **RH / verified height.** Weil's theorem over F_q is used openly (W1-W3) and Theorem U uses none. No statement
  about zeta, no verified-height restatement. W3 is the target's own zero-free region, so the result is circular
  if transported; the report says this.

## Is the open window an artifact of a weak attempt?

Partly. For r > 6d/eta the required saving is below q^(-d/2) and the d = 0 equality shows the limit is real. In
the window 6d/(6+eta) < r <= 6d/eta the loss comes from absolute values over the dual frequency z (termwise Weil).
Mean-square bounds over y do not help: a_n(y) is supported on n < deg rad(y) <= r, where the large sieve
gives the same size as Weil on average. One way around that was not tried: keep the phase psi(z_r') and the
arithmetic of y -> a(y) M(y) together and exploit cancellation over z (a bilinear estimate in (z, A)), or dualise
only part of the m-sum (hybrid at the self-dual point r = d). Whether this gains is not known; the data
(d <= 3 in the window) decide nothing.

## Adjusted claim

Over F_q[T], q = 1 mod 6 prime. PROVED (confirmed here, q = 7, 13, 19): Theorem A and Lemma R (all monic moduli,
both parities, all ranges); Theorem B (exact block formula with the coupling); Theorem U with C <= 3.2 (no RH);
Lemma E; Theorem C with O(1) constants; F1 at d = 0; Lemma H. Consequence: |B| <= Lambda^2 Q O(N q^((r-d)/2) +
q^(5/6 + r/6 - N/2)), a bound against Q = q^(d+k+N), giving the model saving q^(-eta r/12) (up to Lambda^2) on
the range r <= 6d/(6+eta), N >= 5/3 + r(2+eta)/6; this range is sufficient, not shown necessary. The implication
"Weil-size bound for 1/L coefficients of the target => model TRO6 on that range" is proved; the converse is
heuristic. Q versus ||c_k|| ||R_N|| is measured for r >= 0. Open: the window, F1 for general m, any transport to
the number field (model only; W3 is the statement to be proved).
