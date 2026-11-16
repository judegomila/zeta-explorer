# REFEREE: b-escape-law (adversarial pass, 2026-11-16)

Verdict: HOLDS for the escape law EL(tau) (every tau > 0) and for the positive-density statement.
One proof gap (repairable) affects only the sharp-reach clause (ii) / the limsup identity. No RH assumption,
no verified-height restatement, no Lambda bound moved. Zeros are MEASURED (float winding numbers), not certified,
and are labelled so. Scratch code and logs: /tmp/ref-escape/ref.py, z02.log (not in the repo).

## 1. Steps re-derived by hand

| step | result |
| --- | --- |
| (1.1) Gaussian form, variance 2 tau, G_tau = (4 pi tau)^{-1/2} e^{-u^2/4tau} | correct |
| Lemma 1 (contour shift to Re s > 1, Fubini, J_0 analytic for Re s > -2) | correct |
| Lemma R main term: c = -g' + i l/2, tau c^2 = tau g'^2 - i tau g' l - tau l^2/4, so M_n = Tsharp b_n n^{-s_eff} | correct, exact |
| (1.2): g' ~ (i/4) log(s/2pi), s_eff = (1+eta)/2 - tau L/4 + i(x/2 - pi tau/8) | correct |
| Lemma R error exponent: delta^2/4tau + delta Im g' + tau (Im g')^2 = (kappa_0 - (2 sigma - 1))^2/4tau | correct |
| R bound for abs(v) <= abs(z)/2: segment in Re s >= 3/2, g'' = O(1/abs(omega)), integral O(log^2/abs(z)) | correct |
| Lemma R tail abs(v) > abs(z)/2 | GAP, see 2.1 |
| Lemma D(a) order <= 2; (b) Hadamard; (c) Bohr; (d) Hurwitz/normal family; (e) | correct ((b) needs one more line, 2.2) |
| Theorem A(i) Rouche transfer, univalence of s_eff, density c X | correct; uses Lemma R only for sigma in a compact set, where its proof is complete |
| Theorem A(ii), limsup = 2 sigma^+ - 1 | depends on 2.1 |
| C1, C4 | follow from A(i) |
| C2 (o(T) clause), C3 (survival = 2c) | follow; C3 needs A(ii) |

## 2. Errors and gaps

2.1 (gap, repairable) Lemma R is stated for all z with sigma(z) >= a, so kappa_0 = max(2, 2 sigma - 1) is unbounded.
The tail estimate uses "abs(J_0(w)) <= C(kappa_0)", which is not uniform in kappa_0 (it grows like Gamma((1+kappa_0)/4)).
The constant C in (2.2) is therefore not established as written when sigma is unbounded. Repair: compare
abs(J_0(w)) with abs(J_0(z)) directly; kappa_0 - eta = O(log abs(z)), so the ratio is at most
exp(pi abs(z)/8 + O(log^2 abs(z))) (times a polynomial in abs(v)), still negligible against exp(-abs(z)^2/16 tau).
EL(tau) and the density statement do not need this (sigma stays in [sigma_0 - 1, sigma_0 + 1]). Clause (ii), the
limsup identity, the upper bound "abs(Im rho) <= (tau/2) log + 2 sigma_1 - 1 + o(1)" and C3 do.
Status of those: PROVED modulo this repair, not PROVED as written.

2.2 (minor) Lemma D(b): P may have complex coefficients. Needed extra line: abs(Q e^P) -> 1 on the real axis forces
Re a = Re b = 0 and Q constant; D real positive there forces the phase alpha sigma^2 + beta sigma to converge, so
alpha = beta = 0. Conclusion unchanged.

2.3 (overstatement) C5 "flow-critical at xi = uniform in height" is not an equivalence: P_c of C3 is a
height-uniform zero-location statement with survival 2c > 0. Correct form: every horizontal strip confinement
is flow-critical. "Same wall" is commentary, not a result.

2.4 (unproved remark) The uniformity remark "down to the real axis" (kappa_0 = 1 + delta) is not proved; it is
supported only by the eta = 0 rows. It is not used by Theorem A.

2.5 (numerics rigor) Winding numbers are float phase sums on a 0.02 grid. The recorded max_phase_step (2.73 to 2.81)
is taken over the whole grid, not over the box boundary, so the boundary winding count is not shown to be
well-resolved. In my rerun one boundary passed 4e-4 from a zero (step 2.97). No interval arithmetic decides any
sign. The label MEASURED is correct; nothing here is a certificate. The "independent" re-evaluation shares
log_gamma_factor / model_parts with the main code.

2.6 (DH) RESULT.md asserts the DH case "verbatim" with no computation. Checked here (section 3): it holds.

2.7 (scope) C3's kappa(P_c) = infinity and C1's kappa(Strip_Y) = Y^2/2 are route-43 class statements (de Bruijn class
without Phi > 0), not re-derived. QRH 7/8 rests on the unrefereed openai/math result. Novelty against the
literature is not claimed by the author and was not checked.

## 3. Independent numerics (own code, python-flint 0.9 at 200 bits, local, different cases)

Differences from the author's code: g' by Arb central difference of log J_0 (no digamma formula); sampling line
Im w = -(e1+e2)/2 (not the saddle); grid 0.01; each root re-evaluated by direct horizontal-line quadrature and a
24-point circle (radius 0.04) winding count; D_tau by direct series, N = 3e7.

| case | box | zeros (cells = boundary winding) | max eta | abs(G) at roots | abs(D_tau(s_eff)) at roots | abs(G - D) at control points | circle winding |
| --- | --- | --- | --- | --- | --- | --- | --- |
| zeta, tau = 0.5 | x in [20000, 20024], eta in [0.8, 2.8] | 4 | 1.7013 | 1e-12 to 8e-14 | 5e-6 to 1.5e-5 | 6e-6 to 1.3e-5 | 1.000 each |
| zeta, tau = 0.2 | x in [3e8, 3e8+12], eta in [0.76, 2.6] | 4 | 1.6326 | 1e-9 to 1e-7 | 3e-8 to 6e-7 | 4e-8 to 5e-7 | 1.000 each |
| DH, tau = 0.6 | x in [3000, 3024], eta in [0.8, 3.2] | 1 | 1.9765 | 1e-13 | 1.2e-4 | 1.1e-4 | 1.000 |
| DH, tau = 0.6 | x in [3030, 3090], eta in [0.4, 3.2] | 12 | 1.8722 | 8e-15 to 4e-13 | 1.3e-4 to 2.8e-4 | (same order) | 1.000 each |

zeta tau = 0.2 roots (x - 3e8, eta): (2.854479, 0.792352), (4.183274, 1.632569), (7.119364, 1.028770),
(10.343163, 1.483800): three with abs(Im z) > 1 at tau < 9/32, at a height the author did not use.
DH: xi_DH(s) = (5/pi)^{s/2} Gamma((s+1)/2) f(s), functional equation checked to 6e-59, known off-line zero
0.808517 + 85.699348i reproduced (abs(f) = 7e-7). Model D^{DH} = sum a_n b_n n^{-s}, a = (1, kappa, -kappa, -1, 0) mod 5.
The backward-flowed DH function has zeros at depth 1.98 matching the model to 1e-4: the theorem is Euler-blind, as
claimed. sigma_1 spot-check (tau = 1, 0.25, 0.1): sum_{n>=2} b_n n^{-sigma_1} = 1 to 4e-7.

## 4. Checks requested

* RH assumed anywhere: no. Statements about xi are conditional on being true for xi ("for every Y for which xi in Strip_Y").
* Verified height restated as new: no.
* Interval rigor of certified numbers: there are no certified numbers; all zeros MEASURED (2.5).
* DH control: passes (result holds for DH, as a no-go must).

## 5. Surviving claim

EL(tau) holds for every tau > 0: H_{-tau} has zeros with abs(Im z) -> infinity along a relatively dense set of heights
(at depth (tau/2) log(x/4pi) + 2 sigma_0 - 1 for each zero sigma_0 + i t_0 of D_tau), with count >= c X outside any strip.
PROVED internally (Lemma 1, Lemma R on compact sigma-ranges, Lemma D, Rouche); confirmed numerically in three
independent cases including DH. Consequences C1, C2 (o(T) clause), C4, C6 follow. The sharp reach 2 sigma^+ - 1,
the upper envelope with sigma_1, and C3 hold modulo the repair in 2.1. Density law 1/(4 pi tau) and sigma^+ remain
MEASURED / OPEN as stated. No Lambda bound moves; RH open.
