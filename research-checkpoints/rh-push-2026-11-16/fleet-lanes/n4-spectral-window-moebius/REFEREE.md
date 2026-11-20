# REFEREE: n4-spectral-window-moebius

Date 2026-11-17. Adversarial pass on RESULT.md (claimed verdict: precise obstruction). Internal referee; no external review. Labels: CONFIRMED (re-derived by hand and/or rerun), CORRECTED, NOT CONFIRMED, ARGUED (referee reasoning, not proved).

## Verdict

**Holds, with corrections.** Both PROVED steps (K0, K2) are confirmed by re-derivation and by numerics on cases the author did not run (the author ran none). The unconditional part of the ledger (A = 1/2; abscissa 3/2, which is void) is confirmed at the exponent level. The obstruction verdict stands as a ledger over the listed tools. It is not a no-go theorem.

Four statements are wrong or unsupported as written (E1-E4). All four errors make the lane weaker, not stronger, so the verdict "no zero information; lane closed" is unaffected. No step assumes RH, none restates verified height, and no known theorem is presented as new.

## 1. PROVED steps, re-derived

**K0 (Hecke linearisation). CONFIRMED.** With lambda(d1) lambda(d2) = sum over g dividing gcd(d1, d2) of lambda(d1 d2 / g^2), d1 = ga, d2 = gb (g runs over all common divisors, so a, b need not be coprime), l = ab <= X^2:
b(l) = sum_{ab = l} sum_g mu(ga) mu(gb) (g sqrt(ab))^{-1} sum_{m1^2 <= X/(ga)} 1/m1 sum_{m2^2 <= X/(gb)} 1/m2.
Bound: abs(b(l)) <= tau(l) l^{-1/2} (1 + log X)(1 + (1/2) log X)^2. This is <= tau(l) l^{-1/2} log^3 X only for large X (the constant is not 1 at small X: at X = 30 the product is 32.1 against log^3 X = 39.3, so the stated form also holds there).
Numeric check (different cases; `scripts/memcap.sh 8`, .venv-arb python, under 1 s):

| lambda | X | M^2 | sum b(l) lambda(l) | abs diff | max abs(b(l)) sqrt(l)/tau(l) | (1+log X)(1+log X/2)^2 |
|---|---|---|---|---|---|---|
| tau(n)/n^{11/2} (Ramanujan) | 30 | 1.945869575098 | 1.945869575098 | 8.9e-16 | 9.92 | 32.10 |
| lambda_t, t = 3.7 | 30 | 14.921267195792 | 14.921267195792 | 2.8e-14 | 9.92 | 32.10 |
| tau(n)/n^{11/2} | 45 | 2.058315479817 | 2.058315479817 | 2.2e-15 | 11.93 | 40.52 |
| lambda_t, t = 3.7 | 45 | 16.928170871943 | 16.928170871943 | 7.1e-15 | 11.93 | 40.52 |

**K2 (Poisson in n). CONFIRMED.** sum_n S(n, l; c) f(n) = sum_{a mod c, (a,c)=1} e(l abar/c) sum_n f(n) e(na/c) = sum_a e(l abar/c) sum_k f^((a - kc)/c); m = a - kc runs once over the integers coprime to c and mbar = abar. Numeric check with complex Schwartz f(u) = exp(-pi((u-u0)/s)^2) e(0.13 u):

| c | l | abs(lhs - rhs) |
|---|---|---|
| 1 | 5 | 2.5e-16 |
| 7 | 3 | 4.5e-15 |
| 12 | 5 | 1.3e-14 |
| 15 | -4 | 2.9e-14 |
| 16 | 6 | 1.3e-14 |

**D << T^{1+eps}. CONFIRMED** from the K0 bound (sum of tau(l)/l over l <= T^{1+eps}).

## 2. ARGUED steps, checked at the exponent level

- **K1'. CONFIRMED (exponent level).** With a width-1 Gaussian window the integral representations of J_{2it} and K_{2it} restrict the auxiliary variable to abs(zeta) << sqrt(log T), and a stationary point needs x sinh(zeta) = 2T (J side) or x cosh(zeta) = 2T (K side). So H^+ is negligible for x <= T^{1-eps}, and H^- is supported on T^{1-eps} <= x <= 2T. The length of L(1/2, phi_j) is T (analytic conductor T^2), so sqrt(nl) <= X T^{1/2+eps} and c <= X T^{-1/2+eps}. The correction "X/T^{1/2}, not X/T" is right. The sign of the secondary phase is x - 2T^2/x, not x + 2T^2/x (no effect on any exponent).
- **Empty off-diagonal for X <= T^{1/2-eps}. CONFIRMED given K1'.**
- **K3. CONFIRMED (leading term).** Stationary point u0 = l/m^2; phase -2 pi l/(mc); second derivative pi m^3/(lc); amplitude T c l^{-1/2}; reciprocity mbar/c + cbar/m = 1/(mc) mod 1 gives e(-l cbar/m); range mc <= l/T^{1-eps}. One omission: n0 = l/m^2 <= T^{1+eps} forces **m >= (l/T)^{1/2}**, so at l ~ X^2 the modulus m lies in [X T^{-1/2}, X^2/T] and c <= X T^{-1/2}. RESULT.md does not state the lower limit of m (see E3).
- **Row (i) Weil.** Per pair: sum over c <= sqrt(nl)/T of c^{-1/2} T (c/sqrt(nl))^{1/2} = (nl)^{1/4}; total T^{3/4} X^{3/2}. CONFIRMED.
- **Row (i').** (l/T) terms of weight T/l per l, l <= X^2: X^2. CONFIRMED.
- **Row (ii).** Hoelder with the unit-window large sieve: T^{1/2}(T + X^2)^{1/2}. I also checked the cubic moment (T^{1/3}(T+X)^{1/3}(T+X^2)^{1/3}) and a hypothetical unit-window fourth moment (T^{3/4}(T+X^2)^{1/4}): each gives X <= T^{1/2}. Row (ii') under Lindeloef: T^eps (T + X). CONFIRMED. Reading 2 (one member saturates T + N) is the standard sharpness statement.
- **Abscissa arithmetic.** 1/2 + 1/(2A) and (A+2)/(2A+1) are < 1 exactly when A > 1; thresholds 1.3337 and 1.5006 against 0.874886647. Arithmetic CONFIRMED relative to the P2 formula, which is itself wrong (E1).
- **"Truth under GRH for the window family". CONFIRMED (argued).** Perron on Re w = eps crosses no pole, 1/L(1/2 + eps + i tau, phi_j) << (T tau)^eps under GRH, so M_j << (TX)^eps; the Eisenstein term needs RH for zeta. Without the coprimality conditions the generating series of M_j is zeta(2s) prod_p (1 - lambda(p) p^{-s}) = L(s)^{-1} G(s) with G absolutely convergent for Re s > 1/3, so "up to the coprimality conditions" is harmless.

## 3. Errors

**E1. P2 detector formula is wrong in the power of zeta'(rho) and omits a factor. CORRECTED.**
The residue of 1/(zeta(s+it) zeta(s-it)) at s = rho - it is 1/(zeta'(rho) zeta(rho - 2it)), not 1/zeta'(rho). Since abs(zeta(rho - 2it)) = abs(zeta(beta + i(gamma + 2 delta))) with delta = t - gamma, which is about 2 abs(delta) abs(zeta'(rho)) for small delta, the two poles merge into a double pole at t = gamma and

M_t ~ X^{beta-1/2} log X sinc(delta log X) / ((beta - 1/2) abs(zeta'(rho))^2),
L(1/2, E_t) M_t^2 ~ X^{2 beta - 1} log^2 X sinc^2(delta log X) abs(zeta(1/2+it))^2 / ((beta - 1/2)^2 abs(zeta'(rho))^4 abs(zeta(1+2it))^2).

RESULT.md has abs(zeta'(rho))^2 in the denominator and no factor abs(zeta(1/2+it))^2. That form follows only if zeta(1/2 + i gamma) is replaced by zeta'(rho)(1/2 - beta), a Taylor step across horizontal distance beta - 1/2, which is not valid for beta near 7/8. Consequences:
- The lower bound for S_Eis needs a **lower bound for abs(zeta(1/2+it)) on the critical line within 1/log X of gamma**, in addition to an upper bound for abs(zeta'(rho)). No such lower bound is known; lower bounds for short-interval mean squares need interval length >= C log log T, not 1/log X. This is a second unproved input of the detector that RESULT.md does not list.
- With convexity for zeta' the second form becomes beta <= (A + 3)/(2A + 2), not (A + 2)/(2A + 1). It is < 1 exactly when A > 1 (threshold unchanged); comparison with 0.874886647 needs A > 1.668, not 1.501. This still assumes the missing lower bound above.

Numeric check of the residue structure (run where zeros exist: smoothed partial sum of 1/(zeta(s+it) zeta(s-it)) at s = 0.2, weight exp(-n/X), X = 4e4, N = 1.5e6, t = gamma_1 + delta; the zeros at real part 1/2 then play the role of a zero 0.3 to the right; memcap 8 GB, 4 s, 96 MB planned):

| delta | numeric M | residue sum with 1/(zeta'(rho) zeta(rho - 2it)) |
|---|---|---|
| 0.05 | 876.44345 | 876.44346 |
| 0.3 | 134.10613 | 134.10613 |
| 0.8 | 35.84752 | 35.84753 |

At delta = 0: numeric abs(zeta(s+it))^2 M^2 = 6.1e4; the corrected form (fourth power of zeta', factor abs(zeta(s+it))^2) gives 4.8e4 at leading order; the RESULT.md form gives 4.1e5 (off by the factor abs(zeta'(rho))^2 / abs(zeta(s+i gamma))^2 = 8.7 in this case).
P2 was labelled ARGUED and listed as weak step 2, so no PROVED label falls. The sentences "(MB) implies the zero-free statement it was meant to prove" and "isolates the Eisenstein member" as a detector are therefore NOT CONFIRMED: they depend on P2.

**E2. Row (iii-c): "GRH for all Dirichlet L-functions inserted in absolute value gives X, hence A = 1" is not derived. NOT CONFIRMED; referee count is lower.**
The count X^2/(X^{1/2} X^{1/2}) assumes square-root cancellation of Moebius against the full twist e(-ab cbar/m) e(kappa T^2 mc/(ab)) with no cost for the decomposition. GRH gives square-root cancellation for sum mu(a) chi(a) a^{-1-i tau} per character; passing from the additive character mod m to Dirichlet characters costs m^{1/2} (Gauss sums), and separating the archimedean phase of frequency T by Mellin costs T^{1/2}. Referee count (ARGUED, leading exponents only):
- Gauss-sum cost only: saving per (m, c) is min(1, m^{1/2}/X); T sum_{mc <= Y} (m^{1/2}/X) = T Y^{3/2}/X = X^2 T^{-1/2} with Y = X^2/T. This is <= T for A <= 3/4.
- Gauss-sum and Mellin cost: saving min(1, (mT)^{1/2}/X); the sum is dominated by m ~ Y where (YT)^{1/2}/X = 1: no gain, A = 1/2.
This matches the remark in K1' that the total conductor (X T^{1/2} in K1, mT up to X^2 in K3) exceeds the length. The value A = 1 is what an unproved uniform bound sum_{a <= x} mu(a) e(a h/m + phase) << x^{1/2+eps} would give; under GRH the known bound for sum mu(a) e(a alpha) is x^{3/4+eps} (Baker-Harman; recalled). The summary line should read: "GRH for Dirichlet L-functions in absolute value gives at most A = 3/4 and, with the archimedean phase counted, A = 1/2; ideal square-root cancellation in both Moebius sums gives A = 1." As an upper cap "A <= 1" the row survives. Reading 3 ("beyond A = 1 the remaining factor X/T ...") should start from the corrected value.

**E3. Row (iii-b): the reason given is wrong.** "sum_{mc <= Y} m^{-1/2} ~ Y, dominated by small m, large c" ignores m >= X T^{-1/2} (section 2 above); with it the sum is Y (X T^{-1/2})^{-1/2}. The conclusion "no proved gain" still holds, for a different reason: the weight W has frequency T in a, the Vinogradov-Davenport bound applies to linear phases, and for m > X it gives nothing. The "5/8 optimistic" arithmetic (X^{8/5} <= T) is right.

**E4. Control table and wording.**
- DH row: "DH(1/2+it) DH(1/2-it) ... has no sign" is false as a statement about the product: DH is real on the real axis, so the product is abs(DH(1/2+it))^2 >= 0 (rerun: 2.12988, 3.68407, 0.20021, 0.12733 at t = 3, 10, 17.3, 85.7, imaginary part 0). The Eisenstein-side positivity in P1 is trivial for zeta and for DH alike. What fails is that the cross term L(1/2+it, chi) L(1/2-it, chi) is the central value of the packet E(chi, chi), which **is** a spectral member (nebentypus chi^2 = Legendre symbol mod 5, level 25) but is not self-dual, so its central value is complex: measured 1.41269+0.87309i (t = 3), -0.06109-0.03775i (t = 17.3), -0.11433-0.07066i (t = 85.7). "Not central values of spectral members" should be "central values of non-self-dual members". The failing step is the cuspidal positivity that would have to accompany that member (no Katok-Sarnak sign for a non-self-dual family), which is P1 as stated.
- DH at K0: confirmed. a(2)a(3) - a(6) = -1.0807009 (matches the map), inverse coefficients b(2)b(3) - b(6) = 1.0807009, b(8) = -0.3070, b(27) = 0.3070 (non-zero at cubes, so no degree-2 local factor). Off-line zero recomputed: 0.8085171825 + 85.6993484854i.
- Backward heat, sign twist, Beurling: "not formulable". By the map's Q1 this does not count as a quantitative handle. The header line "passes every control" should read "is not formulable for HEAT, TW, B; fails for DH and E_a at P1/K0". These three controls cannot be run numerically for this mechanism; none was run.
- "(MB) is the hypothesis itself: GRH for the window family": (MB) = S - D << T^{1+eps} is the hypothesis by definition, and GRH for the family plus RH implies it. The converse is not shown. Write "implied by", not "is".

## 4. Other checks

- RH assumed anywhere: no. Conditional rows are labelled conditional.
- Verified height restated: no.
- Novelty: none is claimed beyond the placement against rows P26/Z4. Dropping a non-negative cuspidal part to bound the Eisenstein member is the Conrey-Iwaniec (2000) / Ivic (2001) / Petrow-Young device; RESULT.md cites the last two. Katok-Sarnak non-negativity for level 1 even Maass forms: correctly cited. FKM exponents, the unit-window large sieve and Ivic's cubic moment were not re-read by the author or by me (recalled; consistent with my recollection at the exponent level; the conclusion does not depend on the FKM exponent).
- Reading 4 (c = 1 term; D^{-1/8} from the 7/8 half-plane): arithmetic right (D^{3/8} against D^{1/2}). It uses the 7/8 half-plane, which is Lean-checked locally and not externally refereed. The "CLASSICAL equivalence" was not written out by the author; not checked here.
- AFE for the Eisenstein member has polar terms from s = 1 +- it; they are negligible only with a decaying weight (for example G(w) = e^{w^2}). Not tracked in K1; no effect on exponents.
- Scope: the ledger covers the listed tools. "Largest admissible A <= 1 in all ledgers" is a statement about those tools, not a proof that no evaluation of S(T,X) beyond A = 1 exists.

## 5. Surviving claim

PROVED (confirmed): K0 with abs(b(l)) <= tau(l) l^{-1/2} (1+log X)(1+(1/2)log X)^2; K2; D << T^{1+eps}.
ARGUED (confirmed at the exponent level): Kloosterman moduli c <= X T^{-1/2+eps}; empty off-diagonal and S << T^{1+eps} for X <= T^{1/2-eps}; dual form K3 with m in [(l/T)^{1/2}, l/T], c <= l/(mT); unconditional ledger A = 1/2 for Weil, large sieve/moments, FKM and Vinogradov; A = 1 under Lindeloef for the family; hypothesis true under GRH for the family plus RH.
CORRECTED: GRH for Dirichlet L-functions in absolute value gives A <= 3/4 (A = 1/2 with the archimedean phase counted), not A = 1; A = 1 belongs to ideal square-root cancellation. Detector: L M^2 ~ X^{2 beta - 1} log^2 X sinc^2 abs(zeta(1/2+it))^2 / ((beta-1/2)^2 abs(zeta'(rho))^4 abs(zeta(1+2it))^2); it needs an unproved lower bound for abs(zeta(1/2+it)) near gamma; second abscissa form (A+3)/(2A+2).
Result for the map: no zero information; every listed tool gives an output abscissa >= 1; the lane needs GRH-strength input for the window family and its detector is unproved. Row wording for the map should drop "passes every control".

## 6. Runs

All through `scripts/memcap.sh 8`, single process, .venv-arb python, scripts kept outside the repo (/tmp/ref-n4: k0.py, k2.py, p2.py, dh.py). Longest run 4 s; largest planned allocation 96 MB. No ssh.
