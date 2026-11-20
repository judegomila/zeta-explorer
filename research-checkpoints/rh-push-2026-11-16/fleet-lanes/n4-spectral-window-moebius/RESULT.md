# n4-spectral-window-moebius: unit spectral window, non-negative central values, long Moebius polynomial

Date 2026-11-17. Author check only, unrefereed. Paper ledger; no computation was run. No statement about zeros of zeta or of any L-function is proved here. Labels: PROVED / CLASSICAL / ARGUED / RECALLED / OPEN.

Verdict: **precise obstruction; lane closed at the first test.** In all three ledgers the largest admissible A is <= 1 (unconditionally A = 1/2 in each), so the output abscissa 1/2 + 1/(2A) is >= 1. Inserting GRH for every Dirichlet L-function in absolute value in the Moebius sums still gives only A = 1. Row for the map:

> Window positivity isolates the Eisenstein member and passes every control, but the long-polynomial off-diagonal needs Moebius cancellation against characters of total conductor >= length, summed with signs over the moduli: GRH for the window family. Coefficient-blind tools cap at A = 1/2 (A = 1 under Lindeloef for the family); termwise GRH for Dirichlet L-functions caps at A = 1; the c = 1 term alone needs zero-free information for zeta at heights T to T^{A+1/2}.

No pivot was run (section 7).

## 0. Plan, and what is new against the map

- Rows read: P26 (mollifier, cuspidal off-diagonal fixes the length), Z4 (spectral methods bound non-polar parts only), Z16 (bootstrap f(theta) = theta), section 5 part 1 (MV-CAP), n2-landau-even-moment-family L1-L3 and Lemma P.
- Difference from P26/Z4: the family is the SL(2,Z) spectrum in a window of length 1 at height T, the zeta-member is the Eisenstein packet, and non-negativity of L(1/2, phi_j) lets one drop the whole cuspidal part. As in n2 (L1), positivity turns a family bound into an every-window bound, so MV-CAP does not apply to the hypothesis; the cost is moved into the hypothesis.
- Test: largest A (X = T^A) for which S(T,X) << T^{1+eps} X^eps can be proved, under (i) Weil termwise, (ii) Deshouillers-Iwaniec / spectral large sieve, (iii) Moebius-against-Kloosterman bounds.

Notation. phi_j: Hecke-Maass cusp forms for SL(2,Z), spectral parameter t_j, Hecke eigenvalues lambda_j(n) (real), omega_j = 1/L(1, sym^2 phi_j) up to a constant (> 0, T^{+-eps}). lambda_t(n) = sum_{ab=n} (a/b)^{it}. h(t) = exp(-(t-T)^2) + exp(-(t+T)^2) (even, entire, >= 0 on R). sigma_0 = 1/2 throughout (other sigma_0 only shifts the abscissa).
M_j = sum_{d m^2 <= X} mu(d) lambda_j(d) (d m^2)^{-1/2}, M_t the same with lambda_t.
S(T,X) = sum_j h(t_j) omega_j L(1/2, phi_j) M_j^2 + (1/4 pi) int h(t) |zeta(1/2+it)|^2 M_t^2 / |zeta(1+2it)|^2 dt = S_cusp + S_Eis.

## 1. Positivity and the detector

**P1 (isolation). CLASSICAL.** L(1/2, phi_j) >= 0 (Katok-Sarnak, Baruch-Mao; odd forms have L(1/2) = 0), omega_j > 0, M_j real. Hence 0 <= S_Eis <= S(T,X). Uses: phi_j is a Hecke eigenform on the unitary axis, and the theta correspondence.

**P2 (detector). ARGUED.** The Dirichlet series of 1/(zeta(s+it) zeta(s-it)) is sum mu(d) lambda_t(d) d^{-s} m^{-2s} over squarefree coprime d, m, so M_t is (up to the coprimality conditions) its partial sum at s = 1/2 on the hyperbola d m^2 <= X. For a zero rho = beta + i gamma, beta > 1/2, and abs(t - gamma) <= 1, Perron gives the pair of poles w = beta - 1/2 +- i(gamma - t) and
L(1/2, E_t) M_t^2 ~ X^{2 beta - 1} (log X)^2 sinc^2((gamma - t) log X) / abs(zeta'(rho))^2,
so S_Eis >> X^{2 beta - 1} T^{-eps} / abs(zeta'(rho))^2. With S << T^{1+eps}:
- if abs(zeta'(rho)) << T^eps: beta <= 1/2 + 1/(2A) (the form in the assignment);
- with the convexity bound abs(zeta'(rho)) << T^{(1-beta)/2 + eps}: beta <= (A + 2)/(2A + 1).
Both are < 1 exactly when A > 1. Comparison with 0.874886647 requires A > 1.334 (first form) or A > 1.501 (second form).
The standard convexity proof of a detector (interpolate zeta M - 1 between sigma = 1/2 and sigma large) is not available here: positivity holds only at s = 1/2 and t real, and continuing in t moves the two factors zeta(1/2 +- it) in opposite directions. The lower bound therefore depends on the residue computation above, with other zeros in the window not controlled.

## 2. First lemma: Kuznetsov evaluation

**K0 (linearisation). PROVED (Hecke relations).** M_j^2 = sum_{l <= X^2} b(l) lambda_j(l), b(l) = sum over (g, a, b, m_1, m_2) with ab = l, d_1 = ga, d_2 = gb of mu(ga) mu(gb) (g^2 a b m_1^2 m_2^2)^{-1/2}; abs(b(l)) <= tau(l) l^{-1/2} log^3 X. The same identity holds for lambda_t.

**K1 (Kuznetsov). CLASSICAL; constants and the even/odd projection not tracked.** With the approximate functional equation L(1/2, phi_j) = 2 sum_n lambda_j(n) n^{-1/2} V_{t_j}(n), effective length n <= T^{1+eps}:
S(T,X) = D + OD^+ + OD^-,
D = H_0 sum_{l} b(l) l^{-1/2} V_T(l), H_0 = pi^{-2} int h(t) t tanh(pi t) dt ~ T,
OD^{+-} = sum_{l <= X^2} b(l) sum_n n^{-1/2} V(n) sum_{c >= 1} S(n, +-l; c)/c H^{+-}(4 pi sqrt(n l)/c),
H^+(x) = (2i/pi) int J_{2it}(x) h(t) t / cosh(pi t) dt, H^-(x) = (4/pi^2) int K_{2it}(x) sinh(pi t) h(t) t dt.
D << T^{1+eps} (PROVED: abs(b(l)) l^{-1/2} <= tau(l) l^{-1} log^3 X on l <= T^{1+eps}).

**K1' (range of c). ARGUED (standard Bessel asymptotics, contour shift in t for H^-).** H^{+-}(x) is negligible for x <= T^{1-eps}; for x >= T^{1-eps}, H^+(x) = T x^{-1/2} sum_{+-} e^{+- i (x + 2T^2/x + ...)} u_{+-}(x) with u flat. Hence
c <= C_max = sqrt(n l)/T^{1-eps} <= X T^{-1/2+eps}.
Correction to the expected range in the assignment: the modulus bound is c <= X/T^{1/2}, not X/T (the length of L(1/2, phi_j) contributes T^{1/2}). For d ~ X this is c < d T^{-1/2}. The d-sum is a sum of mu(d) against a function of d mod c times an archimedean factor of frequency x = 4 pi sqrt(n l)/c >= T^{1-eps}; the total conductor is c x = 4 pi sqrt(n l), up to X T^{1/2}, which exceeds the length X of the d-sum by T^{1/2}.
Consequence (PROVED given K1'): for X <= T^{1/2-eps} the off-diagonal is negligible and S << T^{1+eps}. This is A = 1/2, abscissa 3/2.

**K2 (n-sum, exact). PROVED.** For f Schwartz, f^(y) = int f(u) e(uy) du:
sum_{n in Z} S(n, l; c) f(n) = sum_{m in Z, (m,c)=1} e(l mbar / c) f^(m/c), m mbar = 1 mod c.
(Open the Kloosterman sum, Poisson in n; m = a - kc.)

**K3 (dual form). ARGUED (stationary phase; error terms not written).** With f(u) = u^{-1/2} V(u) H^+(4 pi sqrt(u l)/c) the stationary point is n_0 = l/m^2, f^(m/c) ~ T c l^{-1/2} e(-l/(mc) + kappa T^2 m c / l), and by reciprocity e(l mbar/c) e(-l/(mc)) = e(-l cbar/m). So
OD ~ T sum_{l <= X^2} b(l) l^{-1/2} sum_{(m,c)=1, mc <= l/T^{1-eps}} e(-l cbar/m) W(mcT/l), W(y) = e(kappa T y) w(y), w flat.
Number of (m, c) per l: about l/T. Weight per term: T abs(b(l)) l^{-1/2} ~ T/l. The roles of the moduli are exchanged: the Moebius variables a, b (l = ab) now meet an additive character of modulus m <= X^2/T, and the c-sum is an incomplete Kloosterman-type sum to the same modulus. Applying Poisson in c returns Kloosterman sums S(l, k; m): the transformation is an involution (same structure as n2 Lemma P), fixed at l ~ T^2, i.e. A = 1.

## 3. First test: exponent ledger

Target: S << T^{1+eps} X^eps, X = T^A. Needed: A > 1.

| Tool | Bound on the off-diagonal | Largest A | Label |
|---|---|---|---|
| none (off-diagonal empty) | 0 for X <= T^{1/2-eps} | 1/2 | PROVED given K1' |
| (i) Weil termwise in K1 | T^{3/4} X^{3/2} (per pair (n l)^{1/4}; at X^2 = T^{1+eps} already T^{3/2}) | 1/2 | PROVED given K1' |
| (i') absolute values after K2/K3 | X^2 (T/l per term, l/T terms, l <= X^2) | 1/2 | ARGUED |
| (ii) Deshouillers-Iwaniec bilinear in (n, l) or (c, l) | equals the spectral large sieve in the window: sum_{abs(t_j - T) <= 1} omega_j abs(sum_{n <= N} a_n lambda_j(n))^2 << (T+N)^{1+eps} norm(a)^2. With Hoelder: S << (sum L^2)^{1/2} (sum M^4)^{1/2} << T^{1/2}(T + X^2)^{1/2}; with Ivic's cubic moment in unit windows the same exponent | 1/2 | CLASSICAL inputs (RECALLED: Iwaniec/Jutila local large sieve, Ivic 2001) |
| (ii') same, assuming Lindeloef L(1/2, phi_j) << T^eps for the family | S << T^eps (T + X) | 1 | conditional; boundary, abscissa 1 |
| (iii-a) Moebius against Kloosterman trace functions mod c (Fouvry-Kowalski-Michel) in K1 | saving at most c^{-1/24+eps} <= X^{-1/24}, for prime c, bounded smooth weights, d-length >= c^{3/4}; needed on top of Weil: X^{3/2} T^{-1/4}. The weight here has frequency x >= T in d (polynomial loss in x); c = 1 and small c have no modulus | 1/2 | RECALLED (FKM exponents from memory); ARGUED |
| (iii-b) Moebius against additive characters mod m in K3 (Vinogradov/Davenport bilinear) | saving per a-sum at most min(m^{1/2}, X^{1/5}, (X/m)^{1/2}); sum_{mc <= Y} m^{-1/2} ~ Y, dominated by small m, large c: no gain. Optimistic count (X^{1/5} on both Moebius sums for every (m, c)): X^{8/5} | 1/2 proved; 5/8 optimistic | ARGUED |
| (iii-c) GRH for all Dirichlet L-functions and RH, inserted in absolute value in both Moebius sums in K3 | X^2 / (X^{1/2} X^{1/2}) = X | 1 | conditional; boundary, abscissa 1 |
| (iii-c') the same in K1 on top of Weil | T^{3/4} X^{1/2} | 1/2 | conditional |
| truth under GRH for the window family | S << T^{1+eps} X^eps | every A | conditional (equals the conclusion) |

Readings.
1. All three unconditional ledgers give A = 1/2: the range where the off-diagonal is empty. None of the three tools extends it. (PROVED/ARGUED as labelled.)
2. Coefficient-blind tools ((i), (ii)) cap at A = 1 even under Lindeloef for the family: the witness a_n = lambda_{j_0}(n) makes the large-sieve constant T + N sharp, and at N = X > T one member alone accounts for the bound. This is the known "(T+X)^{1+eps} is void" statement.
3. Termwise GRH for GL(1) (iii-c) also caps at A = 1. Beyond A = 1 the remaining factor X/T must come from cancellation in the sum over the moduli (m, c) of the outputs of the Moebius sums, i.e. from the signs of sums over characters mod m of partial sums of 1/L(1/2 + i tau, chi). Summing over moduli is Kuznetsov in the reverse direction (K3, involution). So the missing bound is not "Moebius in progressions mod c" alone; it is that statement with signs over c, which is the spectral statement.
4. The c = 1 term of K1 is sum_n sum_l n^{-1/2} b(l) H^+(4 pi sqrt(n l)). By Mellin inversion in d its Moebius sum is sum_{d <= D} mu(d) d^{-1/2 - i tau} with tau between T and X T^{1/2} = T^{A+1/2}, D <= X. A power saving D^{-eta} there, uniform in tau, is a zero-free strip for zeta at heights T to T^{A+1/2} (CLASSICAL equivalence, ARGUED here). Input: zero-free information at heights up to T^{A+1/2}; output: zero-free information at height T. With the 7/8 half-plane as input the c = 1 term gains D^{-1/8}, but the terms with c > 1 need the same for Dirichlet characters mod c <= X T^{-1/2}, which no available result supplies. Same type as Z16 (output <= input).

**Missing bound, stated. OPEN.** (MB) For some A > 1 and X = T^A:
sum_{l <= X^2} b(l) sum_{n} n^{-1/2} V(n) sum_{c <= sqrt(nl)/T} S(n, l; c)/c H^+(4 pi sqrt(nl)/c) << T^{1+eps},
against the absolute-value size X^2. Required saving T^{2A-1} > T. Summing over c first, the left side is S(T,X) - D: (MB) is the hypothesis. It is implied by GRH for {L(s, phi_j), abs(t_j - T) <= 1} together with RH (through M_j << (TX)^eps and Lindeloef), and it implies the zero-free statement it was meant to prove.

## 4. Controls

| Control | P1 window positivity | K0 Hecke linearisation | K1-K3 identities | Hypothesis S << T^{1+eps}, A > 1 | Failing step |
|---|---|---|---|---|---|
| DH | fails: DH(1/2+it) DH(1/2-it) is a combination of Eisenstein packets of level 5 with characters; the cross terms L(1/2+it, chi) L(1/2-it, chi) are not central values of spectral members and have no sign | fails: 1/DH has no coefficients of the form mu(d) lambda(d); products of coefficients do not linearise | hold for each packet separately | not formulable for DH | P1 and K0 (eigenform property; a non-eigen combination is not isolated by positivity) |
| Backward heat | no spectral family | - | - | - | not formulable (no trace formula) |
| Sign twist TW, U | no trace formula; no theta-lift positivity | holds if eps is completely multiplicative | no Kuznetsov | - | P1 |
| E_a = zeta(s+a) zeta(s-a) | fails: E_a is the Eisenstein packet at t = -ia, off the unitary axis, absent from the spectral decomposition; continuation of S_Eis in t loses positivity | holds | hold | - | P1 (membership in the tempered spectrum: unimodular local parameters at all primes jointly) |
| Beurling | no group, no spectrum | - | - | - | not formulable |

The mechanism fails for every control at P1 or K0, at steps that are not identities. It meets filter items (a) and (b) of the map (section 5 corollary) and item (c) through positivity. It is closed by the ledger, not by a control: the every-window, height-uniform bound it needs is (MB).

MV-CAP: consistent. S << T^{1+eps} with A > 1 is not obtainable from mean-value tools (reading 2), exactly because positivity would make it an every-window statement.

## 5. Step labels

- P1: CLASSICAL. P2: ARGUED.
- K0, K2: PROVED. K1: CLASSICAL. K1', K3: ARGUED.
- Ledger rows: as labelled in the table. A = 1/2 unconditional; A <= 1 for every listed tool including conditional ones short of GRH for the window family.
- (MB): OPEN, of the strength of the conclusion.

## 6. Three weakest steps

1. K3 and row (i'), (iii-b), (iii-c): the dual form after Poisson in n is a stationary-phase sketch without error terms; the Bessel transition range x ~ 2T, the K-Bessel side and the even/odd projection are not written. The caps A = 1/2 (unconditional) do not depend on K3; the cap A = 1 under termwise GRH does.
2. P2: the lower bound for S_Eis near a zero comes from a two-pole residue computation, depends on abs(zeta'(rho)), and does not control other zeros within distance 1; no rigorous detector at s = 1/2 with t real was derived. This step would have to be proved before any use of the lane; it is moot under the present verdict.
3. FKM exponents (1/24, 1/48, length >= c^{3/4}), the local spectral large sieve and Ivic's cubic moment are quoted from memory and not re-read; the statement that FKM-type bounds lose polynomially in the archimedean frequency is an assessment, not a computation. The "CLASSICAL equivalence" in reading 4 was not written out.

## 7. Pivot

Not run. Adjacent ideas considered and why none is stronger:
- Higher positivity (L(1/2, phi_j)^3 >= 0, or L(1/2, phi_j) L(1/2, phi_j x chi) >= 0) with Petrow-Young-type evaluations: these reach Weyl-strength bounds for the L-value with no mollifier or a mollifier of length T^{small}; the cap in reading 2 (one member saturates any coefficient-blind bound once X > T) is unchanged.
- Using the 7/8 half-plane as input in the c = 1 term: reading 4; the c > 1 terms need the same for Dirichlet characters, and the output cannot exceed the input.
- A level-aspect or GL(3) family: the hypothesis becomes GRH for that family by the same ledger; nothing specific to that family was found.
