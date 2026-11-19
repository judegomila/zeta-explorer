# c10-spectral-reciprocity-signed-moduli: reciprocity duals of the n4 off-diagonal

Date 2026-11-18. Author check only, unrefereed. One local numeric check (section 3); no server job was started. No statement about zeros of zeta or of any L-function is proved here. Labels: PROVED / CLASSICAL / ARGUED / RECALLED / MEASURED / OPEN.

Verdict: **precise obstruction; lead 4 is closed a second time, same kind.** The exact reciprocity dual of the n4 off-diagonal acts on the pair (n, c) only. The twist variable l <= X^2, which carries A, is a parameter of the identity and is not moved. The map on the ledger is A -> A for every A (not only A = 1), and the composite of the two exact steps is the functional equation of L(s, phi_j). The reciprocity formulas that have a second family on the dual side (Motohashi, Blomer-Khan, Humphries-Khan, Kwan) need a weight of degree >= 6 over the family; for those variants the control E_a passes positivity, linearisation and the identity, and the dual side is the target itself in a long window, or a longer family. No A > 1/2 was obtained from any of them. Step P2 (detector) is OPEN, with the missing ingredients named (section 6).

Row for the map:

> Spectral reciprocity applied to the window-positivity lane (n4). For the first-moment weight L(1/2, phi_j) the exact dual of sum_c S(n, l; c)/c is the coprime-lattice sum over (m, c), and its second dual is a Kloosterman sum to the moduli m: the composite is the functional equation in the n-variable, the twist l is untouched, the ledger map is A -> A (identity checked numerically to 1e-13). For the cubic weight (Motohashi type) the dual is an oscillatory twisted fourth moment of zeta over tau of size T with a polynomial of the same length X^2: lengths (T, X^2) -> (T, X^2), positivity lost, and in absolute value it is the long-window mollified fourth moment, known range A <= 1/4 (recalled). Level reciprocity (Blomer-Khan type) moves l into the level: dual family of size >= X^2 against T, with Moebius signs over levels. In the degree >= 4 variants the weight L(1/2 + a, phi_j) L(1/2 - a, phi_j) is non-negative on even forms for every real a by the functional equation alone, so E_a passes P1, K0 and every identity; T-NR passes them as a finite Hecke polynomial at q. Closed by: every transformation preserves (family length, twist length); nothing distinguishes a = 0 except the bound itself.

## 0. Plan and what is new against the map

- Read: n4-spectral-window-moebius RESULT.md and REFEREE.md (K0-K3, rows (i)-(iii-c), errors E1-E4), map rows P26, Z4, Z16, the control table (E_a, NR, THIN, U), STRATEGY lead 4.
- New input named by the reopening rule: reciprocity identities that transform the modulus sum exactly, with signs.
- Decisive test: write the n4 off-diagonal and its exact dual with lengths in (A, T); decide whether the dual is shorter for some A > 1.
- The code "EIS-w" in the assignment has no definition in the map, the campaign directory or the engine files that I could find. I read it as the Eisenstein member at a general complex parameter w, i.e. E_a with a = w, and treat it together with E_a.

Notation as in n4: h(t) = exp(-(t-T)^2) + exp(-(t+T)^2), M_j = sum_{d m^2 <= X} mu(d) lambda_j(d) (d m^2)^{-1/2}, M_j^2 = sum_{l <= X^2} b(l) lambda_j(l) (K0), X = T^A, e(x) = exp(2 pi i x), S(a, b; c) the Kloosterman sum.

## 1. Screen of the controls (done before the derivation)

Two weights are in play. Weight 1 is the n4 weight L(1/2, phi_j) (degree 2). Weight 3 is L(1/2, phi_j)^3 (degree 6), the lowest weight for which a reciprocity formula with an L-function family on the dual side exists (Motohashi type). The degree-4 weight L(1/2, phi_j)^2 is listed because its shifted form is where E_a enters.

**C1 (shifted positivity). PROVED (functional equation; elementary).** Let phi_j be even, a real. Lambda(s, phi_j) = pi^{-s} Gamma((s + i t_j)/2) Gamma((s - i t_j)/2) L(s, phi_j) = Lambda(1 - s, phi_j), and for real s the gamma product is abs(Gamma((s + i t_j)/2))^2 > 0. L(s, phi_j) is real for real s. Hence
L(1/2 + a, phi_j) L(1/2 - a, phi_j) = g_j(a) L(1/2 + a, phi_j)^2 >= 0, g_j(a) > 0.
The Eisenstein member of the same family is zeta(1/2+a+it) zeta(1/2-a+it) zeta(1/2+a-it) zeta(1/2-a-it) = abs(E_a(1/2+it))^2 >= 0, E_a(s) = zeta(s+a) zeta(s-a). For odd forms the product is <= 0; the even projection is available in Kuznetsov's formula (opposite-sign term).
So for the family {L(s, phi_j x E_a)} = {L(s+a, phi_j) L(s-a, phi_j)} window positivity holds for every real a with no theta-lift input, and its Eisenstein member is abs(E_a)^2 on the critical line.

| Control | weight 1 (n4) | weight L(1/2+a) L(1/2-a) (degree 4) and L(1/2+a) L(1/2-a) L(1/2) (degree 6) | Reciprocity identity | Bound for A > 1 |
|---|---|---|---|---|
| E_a, a real (and "EIS-w" as read above, w real) | fails at P1 (n4 table: E_a is the member at t = -ia, outside the spectrum) | passes P1 by C1 (degree 6: with Katok-Sarnak for the third factor); passes K0 with mollifier coefficients of 1/(L(s+a, phi) L(s-a, phi)), which are Hecke-linear | passes: the identities are meromorphic in the shifts (Motohashi's formula is stated with four shifts; the dual integrand for shifts (a, -a, 0) is zeta(1/2+i tau)^2 conj(E_a(1/2+i tau)) up to a translation) | false for E_a at rate X^{2a} (zeros at Re s = 1/2 +- a; relative to the unproved detector P2; MEASURED once by the n4 referee in the equivalent s = 0.2 form) |
| E_a, a not real | fails at P1 | fails at C1 (product not real) | passes | - |
| T-NR, abs(c) > 2 | passes P1 and K0: abs(X(1/2+it))^2 corresponds to abs(zeta(1/2+it))^2 (lambda_t(q) + c)^2, cusp analogue L(1/2, phi_j)(lambda_j(q) + c)^2 >= 0, and (lambda(q) + c)^2 = lambda(q^2) + 2c lambda(q) + 1 + c^2 | passes | passes (a fixed Hecke polynomial at q) | with the n4 mollifier: equivalent to the zeta statement up to constants. With the mollifier of the T-NR member (inverse of a non-tempered local factor at q) false at rate X^{2(sigma_q - 1/2)} (ARGUED, not computed) |
| DH | fails at P1 and K0 (n4 referee E4: non-self-dual packet, complex central value; a(2)a(3) - a(6) = -1.0807) | same | holds per packet | not formulable |
| THIN, U, sign twists, backward heat, Beurling, phase-rotated transfer operator, theta^w | no automorphic family, no trace formula | same | none | not formulable (by map rule Q1 this is not a quantitative failure) |

Reading. In the n4 form (weight 1) E_a fails at P1, but that form has no reciprocity dual beyond the functional equation (section 2). In every form that does have one, E_a with real a passes each identity step and each positivity step; T-NR passes all of them in both forms. Under the stop rule this is the device row above. E_a is not a refutation of a bound at a = 0: the truth for E_a degrades continuously (X^{2a}), and any estimate through absolute values of coefficients loses at least a comparable power, so no contradiction arises. What the screen establishes: no step of the chain separates zeta^2 from E_a; the separation would have to be made by the estimate of the dual side, at the rate X^{2a}.

## 2. First lemma: the n4 off-diagonal and its exact dual

Fix l != 0, a Schwartz function f on R (it carries n^{-1/2} V(n) and the n-dependence of the Bessel transform at fixed c) and a weight w on c >= 1. fhat(y) = int f(u) e(uy) du.

**Lemma R (exact). PROVED; checked numerically in section 3.**
(R0) Kloosterman side, moduli c:  OD = sum_{c >= 1} w(c) sum_{n in Z} S(n, l; c) f(n).
(R1) Lattice side:  OD = fhat(0) w(1) + sum_{c >= 1} w(c) sum_{m != 0, (m,c) = 1} e(l mbar / c) fhat(m/c),  m mbar = 1 mod c.
(R2) Kloosterman side, moduli m:  OD = fhat(0) w(1) + sum_{m >= 1} (1/m) sum_{+-} sum_{k in Z} S(l, +-k; m) Ghat^{+-}_m(k/m),
G^{+-}_m(c) = e(+- l/(mc)) fhat(+- m/c) w(c) for c > 0 and 0 for c <= 0, Ghat(xi) = int G(c) e(c xi) dc.

Proof. (R0) to (R1) is K2 of n4 (open S, Poisson in n; the term m = 0 occurs only for c = 1). (R1) to (R2): for coprime positive m, c, mbar/c + cbar/m = 1/(mc) mod 1, so e(l mbar/c) = e(l/(mc)) e(-l cbar/m); for m < 0 replace l by -l. For fixed m the sum over c >= 1 coprime to m of e(-+ l cbar/m) G^{+-}_m(c) splits into classes r mod m; Poisson in each class gives (1/m) sum_k Ghat(k/m) e(-kr/m), and the sum over r is S(-+l, -k; m) = S(l, +-k; m). G is smooth on R when fhat(y) decays faster than any power as abs(y) grows (then G vanishes to infinite order at c = 0+). No absolute values are taken.

Structure. (R1) is symmetric under m <-> c up to the archimedean factor: the dual of the modulus sum is a sum over coprime pairs, and the dual of that is again a Kloosterman sum, with the old dual variable m as modulus and a new frequency k. The terms k = 0 of (R2) are Ramanujan sums c_m(l) (divisor-type main terms). Applying Kuznetsov to (R2) in the modulus m returns sum_j lambda_j(k) lambda_j(l) (...). So (R0) -> (R2) is a transform in the first argument of lambda_j(n) lambda_j(l) alone.

**Lengths with the n4 weights. ARGUED (stationary phase, exponent level; uses K1', K3 of n4 as confirmed by its referee).** Unit window at height T, n <= N, l <= X^2 = T^{2A}.

| Side | variables | ranges | terms per l (at l = X^2, N = T) |
|---|---|---|---|
| spectral | t_j in the window | about T forms | T |
| (R0) | n, c | n <= N, c <= sqrt(N l)/T | T^{A + 1/2} |
| (R1) | m, c coprime | m = sqrt(l/n) in [sqrt(l/N), sqrt(l)], m c <= l/T | T^{2A - 1} |
| (R2) | k, m | k of size T^2 m^2/l = T^2/n in [T^2/N, T^2], m of size sqrt(l k)/T | same shape as (R0) with n replaced by k = T^2/n |

(Correction to n4 K3 and to its referee's range: n >= 1 forces m <= sqrt(l) = X, so for A > 1 the range is m in [X T^{-1/2}, X], not up to X^2/T. The count l/T per l is unchanged up to a logarithm.)

In (R2) the pair (k, m) satisfies 4 pi sqrt(k l)/m of size T, the Kuznetsov range for the pair (k, l): (R2) is the Kloosterman side of the same spectral sum with n replaced by k, n k of size T^2 = the analytic conductor. The composite (R0) -> (R2) is the functional equation L(s, phi_j) = L(1 - s, phi_j) read on the Kloosterman side (approximate functional equation with the two halves exchanged). On the ledger:
(N, C = sqrt(N l)/T; l) -> (T^2/N, sqrt(l/N) ... sqrt(l); l),  moduli c m <= l/T,  l -> l.

**Decisive test.** The twist l is a parameter of Lemma R. The map on A is the identity for every A; it does not single out A = 1. What happens at A = 1 is a different coincidence: the lattice side (R1) has T^{2A-1} terms per l against T spectral terms, equal at A = 1, shorter for A < 1, longer for A > 1. For 1/2 < A < 1 the shorter lattice side still has absolute-value size X^2 (n4 row (i'): weight T/l per term, l/T terms), so it proves nothing beyond A = 1/2. For A > 1 the dual is longer than the spectral side. The answer to the test is: no A > 1 for which the dual side is shorter; the reciprocity is an involution of the ledger that fixes every A. PROVED for the identity; ARGUED for the lengths.

The exact form (R2) does give one thing the n4 sketch did not state: the signed sum over the moduli c has been carried out exactly, and what it returns is Kloosterman sums to the moduli m with the Moebius variable l = ab unchanged in the argument S(l, k; m). The "Moebius against additive characters, summed with signs over moduli" requirement of n4 reading 3 is therefore not removed by summing over the moduli with signs: after the exact sum over c it reappears as the same requirement with m in place of c.

## 3. Numeric check of Lemma R (local, memcap 8 GB)

`recip_check.py`, log `recip_check.log`. f(u) = exp(-pi ((u - 4.3)/6)^2), w(c) = exp(-pi ((c - 14)/sigma)^2), c <= 45, abs(n) <= 80, m <= 45, abs(k) <= 4m + 8; Ghat by the trapezoid rule on 35839 points (planned work arrays 2.9 MB), one value cross-checked with mpmath quad at 25 digits (agreement 1e-15 relative or better). Run time under 10 s per case.

| l | sigma | (R0) | abs((R0) - (R1)) | abs((R1) - (R2)) | part of (R2) from k != 0 |
|---|---|---|---|---|---|
| 3 | 5 | -28.086541002487 | 2.8e-14 | 4.5e-14 | -0.00266 |
| 3 | 1.2 | -8.000048124667 | 5.8e-15 | 9.4e-15 | -0.24045 |
| -5 | 1.2 | 8.132644779614 | 5.9e-15 | 2.6e-14 | -0.19596 |
| 12 | 0.8 | 3.534762362542 | 1.2e-14 | 7.2e-15 | 0.33837 |

MEASURED: the three sides agree to 1e-13. In the first case the Kloosterman terms k != 0 are a 1e-4 fraction of the total (the sum is nearly all Ramanujan terms), so the narrow-weight cases were added; there the k != 0 part is 3 to 10 percent and the agreement is unchanged. This checks the identity at small size; it does not check the length table, which is asymptotic.

## 4. Variants with a second family on the dual side

These are not duals of the n4 sum; they are duals of the same construction with a higher weight. None was derived here: the shapes are recalled from the literature (not re-read in this lane) and the lengths are exponent counts.

**V3 (cubic weight; Motohashi type). RECALLED / ARGUED.** S_3 = sum_j h(t_j) omega_j L(1/2, phi_j)^3 M_j^2 + Eisenstein term with abs(zeta(1/2+it))^6. L(1/2, phi_j)^3 >= 0, so P1 holds and under GRH for the family S_3 << T^{1+eps} for every A. For each l the twisted cubic moment is dual to int zeta(1/2+i tau)^2 zeta(1/2-i tau)^2 P_l(tau) k_T(tau) d tau plus main terms. Two properties are used:
- a Hecke eigenvalue lambda_j(l) on the spectral side comes from an unramified (bi-K_p-invariant) local test function, so the dual weight is unramified: P_l(tau) is a Laurent polynomial in p^{i tau} of degree at most v_p(l) for each p, i.e. a combination of (a/b)^{i tau} with ab dividing l. The exact polynomial was not derived (weak step 1). Summing b(l) P_l gives a Dirichlet polynomial in tau with ab <= X^2, of the type of M_tau^2.
- the kernel of a unit spectral window at T: from the Ivic-Motohashi asymptotic of the forward transform (amplitude (r tau)^{-1/2}, phase r log(r/(4 e tau))), a width-1 Gaussian in r leaves tau within a constant factor of T, amplitude of order 1, total mass of order T, and the residual phase T log tau: the kernel oscillates in tau at unit frequency.
Lengths: (family T, twist X^2) -> (integral length T, twist X^2). A -> A.
Consequences. (a) The dual side is not sign-definite; the every-window information that positivity gives on the spectral side appears on the dual side as the unit-frequency oscillation of k_T. (b) In absolute value the dual side is int_{tau of size T} abs(zeta(1/2+i tau))^4 abs(polynomial of length X^2), a twisted fourth moment of zeta in a long window; the proved range for such moments is twist length T^{1/2 - eps} in ab, i.e. A <= 1/4 (Watt; Hughes-Young; Bettin-Bui-Li-Radziwill; recalled). This is below the n4 range A = 1/2. (c) A bound T^{1+eps} for that long-window integral with A > 1 is a mollified fourth moment with a mollifier longer than the window; by the same residue heuristic as P2 it detects every off-line zero at height of size T directly, with no automorphic family. The reciprocity returns the target.

**V4 (twist to level; Blomer-Khan type). RECALLED / ARGUED.** These formulas exchange the Hecke twist l of a level-q family with the level: level 1 twisted by l is dual to level l twisted by 1. The dual family has size at least l <= X^2 per l (against T), and the sum over l carries the Moebius weights b(l) as signs over levels. Longer than the original for every A > 1/2; the "signs over moduli" requirement becomes "signs over levels".

**V2 (square weight). RECALLED.** The dual of sum_j L(1/2, phi_j)^2 lambda_j(l) h(t_j) is the binary additive divisor sum sum_n d(n) d(n + l) W(n/l) (Motohashi); no family on the dual side. With shifts it is the sigma_{2a} divisor sum, and C1 applies: E_a passes.

Humphries-Khan (GL(4) x GL(2) to itself) and Kwan (GL(3) x GL(2) to GL(3) x GL(1)) are V3-type in the spectral aspect: they map a spectral family of the SL(2,Z) spectrum to a moment in the dual spectral or t-variable with the unramified twist unchanged. Not examined beyond this classification.

## 5. Why no variant gives A > 1/2

1. Weight 1: the only exact dual is Lemma R, which is the functional equation; l fixed (sections 2, 3).
2. Weight 3: l fixed, positivity lost, proved range A <= 1/4 on the dual side.
3. Twist-to-level: dual family longer for A > 1/2.
4. In all three the transformed variable is the L-value variable (n, or the spectral parameter); the mollifier variable l is either a parameter or becomes a level. The saving T^{2A-1} that n4 needs is cancellation in l with Moebius weights, and no reciprocity acts on l with a shorter dual, because the Moebius weights b(l) are not the Hecke eigenvalues of a fixed automorphic object of bounded conductor (their generating series is 1/L, the reciprocal of the target).
5. Section 1: the chain cannot be closed by identities and positivity, since E_a with real a passes all of them and its hypothesis is false.

## 6. Step P2 (detector): OPEN

Status after the n4 referee (E1): the two-pole residue form needs a lower bound for abs(zeta(1/2+it)) near gamma. Work here:

**P2-a (anchor without a comparison region). PROVED (elementary).** Let B(t) = zeta(1/2+it) zeta(1/2-it) M_t - 1, analytic in t away from t = -+ i/2 (M_t is a finite sum of (a/b)^{it}). For a zero rho = beta + i gamma and t_rho = gamma - i(beta - 1/2): 1/2 + i t_rho = rho and 1/2 - i t_rho = 1 - rho, both zeros, so B(t_rho) = -1. This is the anchor of the classical zeta M - 1 argument. The classical argument also needs a region where B is small; here the Dirichlet series of 1/(zeta(s+it) zeta(s-it)) at s = 1/2 converges absolutely only if 1/2 - Im t > 1 and 1/2 + Im t > 1, which is empty. The hypothesis S << T^{1+eps} bounds int h(t) (B(t) + 1)^2 / (abs(zeta(1/2+it))^2 abs(zeta(1+2it))^2) dt from above (on the real axis (B + 1)^2 = abs(zeta)^4 M_t^2), an upper bound for B + 1 and not smallness of B; with the anchor value -1 there is no contradiction. The convexity proof of a detector cannot be run in the t-variable.

**P2-b (lower bound for zeta on the window). ARGUED.** By the two-constants theorem applied to zeta on a disc of radius 2 around 2 + i gamma (growth T^C, abs(zeta(2+it)) >= 0.6) the set of t in [gamma - 1, gamma + 1] with abs(zeta(1/2+it)) < T^{-K} has measure tending to 0 as K grows; so the missing lower bound is available with a polynomial loss T^{-2K_0} for some absolute K_0 (not computed), not with T^{-eps}. With that loss the detector threshold is at best A > 1 + 2K_0 instead of A > 1 (before the loss from abs(zeta'(rho)) that the n4 referee recorded).

**P2-c (what remains). OPEN.** A proof of M_t >> X^{beta - 1/2} T^{-C} on a subset of positive measure of the window needs (i) non-cancellation between the residues of all zeros with real part within 1/log X of the maximal one in the window (their number is not bounded; power-sum lower bounds lose exp(-c log^2 T) or more), and (ii) bounds for 1/zeta on the shifted Perron contour, which are bounds on a line where zeros may lie arbitrarily close. Neither is supplied by positivity. The dual sides of section 4 do not help: they contain the same polynomial.

P2 is therefore marked OPEN, not settled. Corrected statement of the lane's output if its hypothesis were proved: "abscissa 1/2 + 1/(2A)" is not established for any A; the available form has threshold A > 1 + 2K_0 and is conditional on P2-c.

## 7. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 multiplicativity essential | not established | The construction uses Hecke relations at K0 and DH fails there (n4 referee, confirmed). But no result is derived from it here, and section 1 shows that in the variants with a reciprocity dual the positivity step needs only the functional equation. |
| R2 height-uniform, every window | not established | No bound for A > 1/2 was obtained. On the dual side of V3 the every-window property becomes an oscillating kernel. |
| R3 fails for every control | no | E_a (real a) passes P1, K0 and the identity in the degree >= 4 variants; T-NR passes them in all variants; THIN, U, sign twists, heat, Beurling, phase-rotated transfer, theta^w are not formulable. |
| R4 reaches the critical line | no | No A > 1 (no abscissa below 1); the unconditional range stays A = 1/2 (abscissa 3/2, void); detector open. |

## 8. Three weakest steps

1. Section 4 (V3, V4, V2) is recalled and argued, not derived: the exact dual polynomial P_l, the kernel of a unit spectral window, the main terms, and the quoted ranges (Watt, Hughes-Young, Bettin-Bui-Li-Radziwill, Blomer-Khan, Humphries-Khan, Kwan) were not re-read. No instance of a Motohashi-type identity was checked numerically (it needs Maass-form data that the lane did not compute). The conclusion "A -> A" for V3 rests on the unramified-twist argument and on a heuristic inversion of the Ivic-Motohashi kernel.
2. The length table of section 2 is at the exponent level and inherits the stationary-phase sketches K1', K3 of n4; the identification of (R2) with the functional-equation dual (n k of size T^2) is by matching ranges, not by a computed transform. The numeric check covers the identity only.
3. Section 1: the rates X^{2a} (E_a) and X^{2(sigma_q - 1/2)} (T-NR) at which the control hypotheses fail are relative to the unproved detector P2 and were not computed here; P2-b is a sketch with an uncomputed constant K_0; the closing sentence of section 5 item 4 (no reciprocity acts on l with a shorter dual) is a statement about the formulas listed, not a theorem.

## 9. Pivot

Not run. The adjacent idea considered was the dual statement of V3(c) taken as the primary object (a mollified fourth moment of zeta in a long window with a mollifier longer than the window). It has no automorphic family, fails R2 as a mean value (MV-CAP) unless positivity is restored, and is of the type of rows P26 and Z16; it is not stronger than what is closed.

## 10. Files

- `RESULT.md` (this file)
- `recip_check.py`, `recip_check.log`: numeric check of Lemma R; run with `scripts/memcap.sh 8 .venv-arb/bin/python recip_check.py <l> <sigma>`.
