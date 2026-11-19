# c7-uncompensated-high-side-normaliser: the marked-only high side from MS (12.5), (16.1) with H kept, and which input fails at lx < l

Internal working note, 2026-11-18. Slug `c7-uncompensated-high-side-normaliser`. Kind: combine (STRATEGY 4.0, the two
derivation items left by `c7-repair-engine-map-r6`). Not refereed. Nothing committed, pushed or posted. No job was
run on the compute server (the LP did not grow: 53 s locally through `scripts/memcap.sh 8`); one ssh connection
running only `true` was opened to it at the end and started no unit.

Scope: an ESTIMATE SYSTEM inside the 7/8 architecture. Sources read as text: the manuscript
`~/lean-deps/qrh-verify/paper.txt` ("MS"; sections 6.1, 7.1-7.2, 10.1-10.7, 12, 16.1-16.2), Liu II Lemma 2.4 and
Prop. 2.5 (`push/bypass-78/dl/2610.26835.txt`). All unrefereed. Every abscissa is the value of a hypothetical
estimate system. No statement about zeros of zeta is made. 7/8 (unrefereed) stands. RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / EXACT (rational arithmetic, logs) / ARGUED (exponents
complete, analytic bookkeeping not written out) / MODEL / MEASURED (by another lane, cited) / OPEN.

Files: `local_check.py` + `.log` (exact local identities), `lp7.py` + `lp7.log` (exact rational LP),
`regress.py` + `.log`, `tiers_fe_copy.py` (= `c5-target-fe-order2-ledger/tiers_fe.py`, unchanged).

## Verdict: precise obstruction (third of the same kind for h > 1; two earlier attributions corrected)

1. **The uncompensated high side is derived and it is not the failing input.** The marked-only probe
   (the J = empty term of MS (12.5)) has an exact high representation of the form MS (10.5) with a full
   correction that is holomorphic in both Euler regions, no division by P_p or H_p (Lemma 1, EXACT local
   identities). On a retained contour each slot factor is
   (sextic prime sum) + (scalar prime sum S_i = sum_p W_i q_p^(z-1-w)) + (the local errors of MS (16.8)).
   The only new term is S_i, of exact size P_i^(z0 - w_r) = P_i^(z0 - 1/2 + delta/2) on Re w = 1 - a.
   So the derived uncompensated high side is the compensated line (10.15) with the amplitude g replaced by
   max(g, l delta/2): the saving - l/2 is kept, and the cost of not compensating is l delta/2 on the class delta
   (Lemma 2, ARGUED-rel the MS row estimates). In the ideal model (x up to 1/2 kept) it coincides with the
   compensated high side. The guess of `r3-method-limit` (H0' = H0 + l/2, "no saving") is not what (12.5), (16.1)
   give; it was conservative.
2. **The signal (S) is unchanged, with the same normaliser.** At the principal residue point the marked-only slot
   multiplier is Bmark_p = -(1 - q)(1 - R/D)/(1 - D(1 - q) - R q) and the compensated one is Bmark_p - q
   (EXACT). The principal row is Z^C(s) H_eta(s) prod_i B_i(s) / L^S(s, eta) with the same H_eta = zeta_F^S(2)^-1
   L^S(6s - 3, psi_eta) E_eta and the same h = 1 - lx + l; no condition lx >= l enters (Lemma 3).
3. **The false input of the region lx < l is the row-energy input (dir0, k0), not (S) and not H0'.** The slot primes
   are coherent with the target at the principal frequencies (this is MS (16.13): B_p = -1 + O(Q^(-7/8)) uniformly
   in the target phase). Hence the energy of the marked row contains the squared signal: for M >= 1 + l,
   k_true >= ksig(beta*) = (2 + 2l - M)/6 - 2(1 - beta*) (Lemma C, ARGUED: Poisson duality with a positive
   kernel). Consequences: (a) every Cauchy-Schwarz low estimate with valid norms has B_low >= beta* when
   M >= 1 + l: such a geometry can never produce the contradiction of Prop. 2.1; (b) the input "K + D for the
   marked rows at (M, l)" implies, without any high side, zero-freeness of L(s, eta) in
   Re s > B_E = 1 - h_E/6, h_E = 1 + l - M/2, and equals the vertex value when G = b/12; (c) it is false wherever
   B_E < 1/2. This corrects `c6-unreflected-marks-kd23` Proposition E, which placed the falsity on the
   uncompensated branch: its Lemma D(a) assumed the mark polynomial cancels under GRH; at sixth-power
   frequencies it has no cancellation, by design of (12.5).
4. **Decisive test (EXACT LP, `lp7.log`).** With the derived high side and the necessity constraint at beta0 = 1/2,
   the system that returned 0.4653 / 0.25 (search bound) returns exactly **1/2** at (lx, ly, l) = (3, 3, 5),
   h = h_E = 3 (CONFIRMED, boxes 8 and 16, also with r3's guess for the high side). With proved rows only
   (Liu II Lemma 2.4 or MS Lemma 9.1) and lx <= l the minimum is 8/9 at h = 1 and rises with h (0.9051 at
   h = 1.1; above 1 at h = 2). Maximal effective signal constant h_eff = 6(1 - B): 3 at B = 1/2; with the
   normaliser kept, 2 (zero-free reading ends at 2/3), 2.5 where (2.2) fails (7/12), 2.4 for the slot term (3/5,
   slots of length <= 1/5 only).
5. **Part A answer.** Consistent model vertices with 1 < h <= 3 exist: the cone (t, t, 2t - 1), 1 < t <= 3, value
   B = 1 - t/6, single unproved input "E << K^(1+eps) N for the coherent marked rows at K = D" (WLS-coh). That input
   by itself implies the conclusion (item 3(b)) and is implied by GRH for the dual family (ARGUED), so it is
   the conclusion in the row variable. With H kept the conclusion is zero-freeness only for t <= 2 and the
   resonant statement (R) of `c6-marks-bc-manuscript-check` for 2 < t <= 3.
6. **Part B answer.** The compensated (and the marked-only) principal signal is, exactly,
   X^(1/3) Z^(-5/6) times a finite combination of g_eta(Z / prod q_p^5) with coefficients omega_eta(p) q_p^(13/6),
   g_eta the Mellin integral of H_eta / L^S (Lemma 3). A slot of length > 1/5 contributes nothing beyond the main
   term at any abscissa (rapid decay of g_eta at 0). For a slot of length <= 1/5 the extra term has relative size
   at most P_i^(theta_omega + 2 - 5 beta), theta_omega <= 1 the zero abscissa of L(s, omega_eta), omega_eta of
   infinite order: the factorisation MS (10.18) holds for Re s > (2 + theta_omega)/5, unconditionally for
   Re s > 3/5, and stops there: below it the Z-dependent factor prod_i B_i(s) has no lower bound (it vanishes
   identically in p when R/D = 1), so the signal is not of the form Z^C(s) H(s)/L(s) with H independent of Z.

State of "R4 inside the 7/8 architecture": **unchanged, no probe with h > 1.** What moves: the model vertex with
h > 1 is now explicit and its one input is shown to be the conclusion; the two derivation items of STRATEGY 4.0
are done and neither reopens the branch. Requirement flags: R1 no, R2 no, R3 no, R4 no (section 8).

---

## 0. Plan; relation to closed rows

Read: BRIEF to the end; OBSTRUCTION_MAP rows Z15, Z15b, Z15c, Z18, Z24 and the controls list; RESULT of
`c5-target-fe-order2-ledger`, `c6-marks-bc-manuscript-check`, `c6-unreflected-marks-kd23` in full; `r3-method-limit`
sections 1-3; `tiers_fe.py`, `tiers_fe2.py`, `hp_check.py`; MS (6.1), (7.3)-(7.5), Lemma 7.1 with its proof,
Def. 10.1, Lemma 10.4 and its proof, (12.4), (12.5), section 16.1, (16.8), (16.12)-(16.14), Lemma 16.2; Liu II
Lemma 2.4.

Order of work: first lemma (section 1), then the decisive LP (section 4), then Parts A and B.

New relative to the three lanes: (i) the marked-only correction and its slot decomposition (c6-marks table line 12
was "NO SOURCE"); (ii) the derived exponent of the uncompensated high side; (iii) coherence of the marks at the
principal frequencies and the resulting lower bound for the row energy, which changes the identification of the
false input made in c6-kd23; (iv) the exact form of the principal signal below 3/5.

## 1. First lemma: the high-side row of the marked-only probe, H not divided out

Notation of MS Lemma 7.1 and section 16 at a slot prime p (Q = q_p, q = 1/Q): P_p, P_p*, H_p = P_p (1-V)(1-W)/(1-D),
V = Q^(-6z), W = chi_p(u) Q^(-w), D the local factor of L^S(x, eta chi_.(u)), R = a_p^2 Q^(4-6x-6z). The text
extraction lost the conjugations; the two unit phases are fixed by the identities MS states below (16.7):
eta(p) Q^x D = v^-1 and v^-1 W = Q^-w, v a unit, v = 1 on the row u = 1.

Marked-only probe: I_mark(Z) = sum over tuples of prod_i W_i(q_{p_i}/P_i) eta(p_all) I_{eta; p_all}(X, Y, Z q_{p_all}),
the J = empty term of (12.5). By (12.5), I_mod = prod_i (M_i - R_i) and I_mark = prod_i M_i (M_i marking, R_i
rescaling in slot i), so

    I_mark = sum over J of [rescaled in the slots of J, compensated in the slots of J^c];
    one slot:  I_mark(Z) = I_mod(Z) + sum_p W(q_p/P) q_p^(-3/2) I_eta(X/q_p, Y/q_p, Z).                    (1.1)

If ly < l the rescaled probe is empty (no ideal s of norm about Y/q_p < 1 in (6.1)) and I_mark = I_mod for large Z.

**Lemma 1 [EXACT `local_check.log` (i)-(v), 390 random rational points; PROVED-rel MS (7.11), (16.2), (16.4), (16.8)].**
For a slot prime p not dividing u define the marked-only selected factor

    Gmark_p := eta(p) Q^x P_p* (1 - V)(1 - W)/(1 - D).

(i) Gmark_p = G_p + Q^-w H_p, G_p the combined factor (16.2). It has the denominators 1 - R, 1 - V, 1 - D only
    (those of P_p* in (7.11)), so it is holomorphic in both Euler regions of Lemma 7.1, including at zeros of
    P_p and H_p.
(ii) Gmark_p = -(v^-1 - Q^-w) H_p + Delta_p, where Delta_p is the right side of (16.8),
    Delta_p << Q^(-x_r) + Q^(-6 z_r) + Q^(4 - 5 x_r - 6 z_r) + Q^(1 - w_r - 6 z_r) (MS Lemma 16.2).
    For p | u: Gmark_p = eta(p) Q^x (1 - V) E_p = G_p + Q^-w H_p as well.
(iii) At the principal residue point (u = 1, w = 1, z = 1/6; V = W = q):
    Gmark_p = -(1 - q^2)(1 - q)(1 - R/D)/((1 - R)(1 - D)),     R/D = omega_eta(p) Q^(3 - 5s),
    omega_eta = psi_eta eta^(+-1), psi_eta = (alpha eta)^6 (infinite order for every finite-order eta).
(iv) Bmark_p := Gmark_p/H_p = -(1 - q)(1 - R/D)/(1 - D(1 - q) - R q) (H_p != 0 on Re s >= 1/2, Lemma H of c6).
(v) The compensated multiplier (16.1) at the same point is B_p = Bmark_p - q.

**Corollary 1 (the row) [PROVED-rel MS (7.5), (7.13), by the argument of MS section 16.1 with (16.4) replaced by
its first term].** With

    Hmark_{eta,u,Z}(x, w, z) := sum over tuples of prod_i W_i(q_{p_i}/P_i) q_{p_i}^(z-1) Gmark_{p_i} prod_{p not in S, not selected} H_p,

one has, absolutely convergent on the lines Re x = Re w = 3, Re z = 2,

    I_mark(Z) = (2 pi i)^-3 Int Int Int W(X, Y, Z; x, w, z) sum_u q_u^-z xi(u)
                zeta_F^S(6z) L^S(w, chi_.(u)) / L^S(x, eta chi_.(u)) Hmark_{eta,u,Z}(x, w, z) dz dw dx.        (1.2)

Hmark is holomorphic in both Euler regions and satisfies (10.4) (same proof as (16.6)); no division by H occurs.
So Def. 10.1 holds for I_mark with h = 1 - lx + l and any lx, ly > 0, l >= 0: the condition lx >= l is not used.
Where the slot quotients are defined, Hmark = H_{eta,u} prod_i Bmark_i with

    Bmark_i(u) = Q_i(u; z) + S_i(w, z) + D_i(u),   Q_i = - sum_p W_i q_p^(z-1) chi_p(u)^(+-1)   (MS Prop. 16.1),
    S_i(w, z) = sum_{p in slot i, p not | u} W_i(q_p/P_i) q_p^(z - 1 - w),                                   (1.3)

D_i the same error part as in the compensated case. S_i is the term the subtraction in (12.5) removes ("the scalar
prime contribution on the high side"). This replaces table line 12 of `c6-marks-bc-manuscript-check` (NO SOURCE).

## 2. The derived uncompensated high side

On the retained contour (10.11): Re s = a + 16e, Re w = 1 - a - 6e, Re z = z0, a = (1 + delta)/2.

**Lemma 2 [exponent PROVED for S_i; the rest ARGUED-rel MS Lemma 10.4, Prop. 16.1 at general geometry].**
(a) abs(S_i) <= sum_p W_i q_p^(z0 - 2 + a + 6e) << P_i^(z0 - 1/2 + delta/2 + 6e), and this is its true order at
    bounded height (prime number theorem; the summand is positive at Im(z - w) = 0).
(b) Q_i and D_i are the compensated terms: P_i^(z0 - 1/2) times the prime amplitude, total Z^(l(z0 - 1/2) + g)
    in (10.13).
(c) Hence the row hypothesis (10.13) holds for Hmark with g replaced by g' = max(g, l delta/2), and the exponent is

    E'_{sigma0}(d; R, g) = a - sigma0 + h(z0 - 1/6) - a ly - l/2 + max(g, l delta/2) + d(R + delta/2 - z0).    (2.1)

Cross-check through (1.1): the rows of the rescaled probe are the rows of the base probe at (lx - l, ly - l, 0)
times q_p^(-3/2); summing over p gives exponent l - 3l/2 - l/2 + a l = - l(1 - a) = - l/2 + l delta/2 relative to
the base line. Same number.

Reduced form at d = h with the ideal counts: E'(delta) = E(delta, x = 1/2) of `r3-method-limit`. At the floor
class delta = 0 it is H0 itself. The r3 guess "no - l/2, no amplitude term" (flag `comp=False`) is larger by
l(1 - delta)/2 >= 0: it was a conservative stand-in, not the derived line.

## 3. Signal with H kept, and the energy lemma

**Lemma 3 (principal signal) [EXACT local part; PROVED given Lemma 1 and Lemma H of c6].** For Re s >= 1/2, at
(w, z) = (1, 1/6),

    Hmark_{eta,1,Z}(s, 1, 1/6) = H_eta(s) prod_i Bmark_i(s),   Bmark_i(s) = sum_p W_i(q_p/P_i) q_p^(-5/6) Bmark_p(s),
    Bmark_i(s) = - A_i + T_i(s) + (terms with q_p^(-ns), n >= 1, and q_p^(n(2 - 6s)), n >= 1),
    A_i = sum_p W_i q_p^(-5/6)(1 - q_p^-1) ~ P_i^(1/6)/log P_i,    T_i(s) = sum_p W_i(q_p/P_i) omega_eta(p) q_p^(13/6 - 5s).

The compensated slot factor is B_i = Bmark_i - sum_p W_i q_p^(-11/6): relative difference P_i^-1. Writing
g_eta(Y) = (2 pi i)^-1 Int_(2) Y^s e^((s-5/6)^2) H_eta(s)/L^S(s, eta) ds, the principal row of either probe is

    f_probe(Z) = c_S X^(1/3) Z^(-5/6) sum over subsets I of slots of (-1)^(K-|I|) prod_{i not in I} A_i
                 sum over (p_i)_{i in I} of prod_{i in I} W_i omega_eta(p_i) q_{p_i}^(13/6) g_eta(Z / prod_{i in I} q_{p_i}^5)
                 + (the n >= 1 terms, of relative size at most P_i^(-1/2)).                                   (3.1)

Consequences. (a) (S) holds for the marked-only probe exactly as for the compensated one: same C(s), same
normaliser H_eta, so Lemma S, Corollary H1 and the cap of row Z24 apply verbatim; lx >= l is not needed.
(b) Part B is section 6.

**Coherence [PROVED-rel MS (16.13); EXACT at the principal point by Lemma 1(iv)].** On the row u = 1 every slot
prime has multiplier -1 + (smaller): the weight eta(p) in (12.5) cancels the phase of the local factor of
1/L(x, eta), and the slot primes lie in the identity ray class, where all fixed finite phases are 1. In the
variable A = c n^3 of the row this says: at the principal frequency the marked row has dual coefficients
mu(A') eta(A') q^(-1/2) (target part, A' of norm up to Z) times a positive prime sum sum_p W q_p^(-1/2) ~ P^(1/2).

**Lemma C (the row energy contains the squared signal) [ARGUED; Poisson step of Lemma D of c6-kd23 with two
corrections].** Let E(K, D) = sum over m of norm about K = Z^M of abs(Bmark_m)^2 for the marked row at scale
D = Z^(1+l), N its coefficient norm (Z^o(1)), E <= Z^(k_true + eps) K N. With a row weight whose transform is a
positive-definite kernel in the column pair, and columns in one class with reciprocity sign +1,

    E(K, D) + c D N  =  K N' + (K/D) sum over frequencies k != 0, q_k <= D^2/K, of w_k abs(M_k(D))^2,   w_k > 0,      (3.2)

(the term c D N is the diagonal c = c' of the dual form, which the off-diagonal Poisson sum does not contain; it was
omitted in Lemma D(b) of c6-kd23). At the sixth-power frequencies, by coherence,
abs(M_{a^6}(D)) = (sum_p W q_p^(-1/2)) abs(sum_{A'} mu eta q^(-1/2) V(q_{A'}/Z)) = Omega(P^(1/2) Z^(beta - 1/2 - eps))
for every beta below the zero abscissa of L(s, eta). There are (D^2/K)^(1/6) such frequencies. So

    max(k_true, 1 + l - M) >= ksig(beta*) := (2 + 2l - M)/6 - 2(1 - beta*),                                   (C1)

and for M >= 1 + l simply k_true >= ksig(beta*). In the vertex formula B_low = 1 - h/6 + G + k/2:

    1 - h/6 + ksig(beta*)/2 = beta* - b/12,   so with G >= max(0, b)/12:   B_low >= beta*  whenever M >= 1 + l.    (C2)

Equality case b >= 0, G = b/12: B_low = B_E := 1 - h_E/6 + k/2 with h_E = 1 + l - M/2 = h - b/2.

Readings of Lemma C.
(a) In the unreflected regime M >= 1 + l the Cauchy-Schwarz bound with true norms is at or above the signal
    Z^C(beta*). No geometry there yields the strict inequality (2.4) against (2.5). The MS/Liu method works only
    where rows are fewer than columns (M + l <= 1 < 1 + l) and the reflected energy K beats D.
(b) An input "k <= kappa at (M, l), M >= 1 + l" implies beta_eta <= 1 - h_E/6 + kappa/2 for the target directly,
    by positivity, with no high side, no A-side and no contour. For kappa = 0 (dir0, k0) this is the vertex value.
(c) dir0 at (M, l) with M >= 1 + l and h_E > 3 is false (zeros on the critical line exist); under the ideal high
    side the same holds for k0 at M < 1 + l (that case is Theorem B' of c6-marks, not (C1)).
(d) Pole case as a check of the formula: for a target with a pole in place of zeros (dual coefficients 1) the term
    is K^(5/6) D^(1/3) N. c6-kd23 MEASURED exactly this law on its control s1c (excess exponent 0.153 +- 0.012 at
    K = D, prediction 1/6). Its theta-row measurements cannot see the coherent term: marks were all primes of a
    dyadic range with a_p = 1 or random signs, and at D <= 10^7, P = D^(1/4) the term is D^(-5/6) P relative to K.

Sufficiency (ARGUED, as Lemma D(a)): under GRH for the characters at the non-principal frequencies the mark
polynomial there does cancel, and E << (KD)^eps (K + D + K^(5/6) D^(-2/3) P Z^(2 beta* - 1)) N, that is
k_true = max(0, 1 + l - M, ksig(beta*)). Named input **WLS-coh(M, l)**: k_true = max(0, 1 + l - M) at (M, l); by
(b) and sufficiency it is equivalent, under GRH for the non-principal dual family, to beta* <= 1 - h_E/6.

## 4. Decisive test: the LP with the derived high side and the necessity constraint

`lp7.py` = `tiers_fe.py` plus: derived high side (flag comp=True used at lx <= l, by Lemma 2); necessity (C1) as a
disjunction over the branches of k; lower bounds on h, upper bounds on l and b for the max/min runs. Exact
rational vertex enumeration; "CONFIRMED" = feasible at the value, infeasible at value - 1e-9.

| run (lx <= l, w = 0) | value | point (lx, ly, l) | h | h_E |
|---|---|---|---|---|
| P1b regression: dir0, polar G, r3 guess high side, box 8 | 0.4653168 (= c5 Y3) | (5.79, 5.79, 8) | 3.21 | 3.21 |
| P2a proved rows: refl (Liu II 2.4), source G | 0.9122807 | (0.263, 0.579, 0.263) | 1 | 0.84 |
| P2b/P2c refl or dir, polar G | 8/9 | (1/9, 7/9, 1/9) | 1 | 0.67 |
| P2j refl, h >= 11/10 | 0.9051282 | (0, 0.923, 0.1) | 1.1 | 0.64 |
| P2k refl, h >= 2 | 1.2380952 (vacuous) | (0, 0.857, 1) | 2 | 1.57 |
| P2d dir (MS Lemma 9.1) | 1 CONFIRMED | (0, 2, 0) | 1 | 0 |
| P2e/P2f dir0, derived high side, no necessity | 0.25 = search bound | (4.5, 4.5, 8) | 4.5 | 4.5 |
| P2i refl with K, P removed, no necessity | 0.5416667 | (6.25, 6.25, 8) | 2.75 | 2.75 |
| **P3a dir0, derived high side, necessity at 1/2, box 8 and 16** | **1/2 CONFIRMED** | (3, 3, 5) | 3 | 3 |
| P3g same with r3's guess high side | 1/2 CONFIRMED | (5, 5, 7) | 3 | 3 |
| P3f refl or dir or dir0, free geometry, necessity | 1/2 CONFIRMED | (3, 3, 5) | 3 | 3 |
| P3b k0 (energy K at every geometry), necessity | 0.25 = search bound | (2.7, 2.7, 6.2), M < 1 + l | 4.5 | 4.5 |
| P3c dir0 with G = 0 at b > 0, necessity | 0.25 = search bound | (1.5, 4.5, 5), b = 3 | 4.5 | 3 |

P3' (necessity taken at beta0 = B): for B = 1/2, 7/12, 3/5, 2/3, 3/4, 5/6 the system is feasible at B and
infeasible at B - 1e-6, at the cone points (t, t, 2t - 1), t = 6(1 - B). This is (C2) in exact arithmetic: the
vertex value is beta*, the system has no slack.

P4 (normaliser floors; dir0 + necessity): smallest mark length reaching B: l = 1 (5/6), 2 (3/4), 3 (2/3), 3.8 (3/5),
4 (7/12), 5 (1/2), always at the cone point with M = 1 + l. Maximal nominal h at fixed B is limited only by the box
(4.8 to 5.2 with b <= 0, box 8): nominal h is not the relevant number, because (C2) pays b/12 for every unit b/2
of h. The effective constant is h_eff = 6(1 - B) = h - 6G - 3k: **maximal h_eff = 3** (B = 1/2);
**2 with the normaliser constraint "zero-free reading requires B >= 2/3"**; 2.5 at the (2.2) threshold 7/12;
2.4 at the slot-term threshold 3/5.

Readings. (1) P3b and P3c are the two remaining inconsistent packages. k0 at M < 1 + l escapes (C1) because of the
diagonal term c D N; it is excluded only relative to the high side (Theorem B' of c6-marks). G = 0 at b > 0 is the
A-side analogue of dir0: the additive norm has its own coherent term (K/Y)(Y/X)^(1/6) (pole case, no zero-free
input needed), so "G = 0 at b > 0" is false as a norm bound; as a statement about the bilinear form it is TRO6
and is not touched here. (2) With proved rows the uncompensated probe has no vertex below 8/9 and none with
h > 1 below 0.905. Removing the compensation does not help the proved system.

Regression note. `regress.log`: the current `tiers_fe.py` returns 0.9 for row Y2 of `tiers_fe2.log` (logged 1.0,
at the same point as Y1) and 0.8810 for Y6 (logged 0.9103). The point (1/15, 13/15, 1/15) satisfies every
constraint of Y2 at B = 0.9 by hand. The logged Y2, Y6 appear to come from a version in which the option
G = "polar" still contained the term b - ly/2. Neither value is an h > 1 vertex; verdict statement 3 of c5 is
unaffected. Y1 and Y3 reproduce.

## 5. Part A: is there a consistent vertex with 1 < h <= 3, and which input is false at lx < l

Inputs at lx < l, after sections 1-3:

| input | status at lx < l |
|---|---|
| exact high identity for the marked-only probe, (10.5) form | PROVED-rel MS (Corollary 1); no lx >= l |
| (S): signal Z^C(s) H_eta(s) prod B_i(s)/L^S(s, eta), h = 1 - lx + l | holds (Lemma 3); H_eta kept |
| uncompensated high side | derived: (2.1); equals the ideal compensated line; r3's H0' was a conservative guess |
| low side, reflected rows (Liu II 2.4) | usable for the marked-only probe at any (M, l); gives B >= 8/9 at lx <= l |
| low side, dir (Lemma 9.1) | B >= 1 |
| low side, dir0 / k0 (K + D or K for coherent marked rows) | false where B_E < 1/2; elsewhere it implies its own conclusion (Lemma C) |

So in the inconsistent region neither (S) nor H0' is the false input. The false input is the hypothetical energy
bound for the marked rows. c6-kd23 Proposition E reached the opposite attribution from Lemma D(a) with a bounded
mark polynomial; that bound fails exactly at the frequencies that carry the signal. Its measurement and its
statement "no (KD)^(2/3) term" are not affected.

Consistent vertices with 1 < h <= 3: yes, as MODEL vertices with one named unproved input.

    cone (t, t, 2t - 1), 1 < t <= 3:  h = h_E = t,  M = 1 + l,  B = 1 - t/6,  H0 = 1 - 2t/3 <= B,  E(2B - 1, 1/2) < 0
    (`lp7.log` P5: t = 6/5, 3/2, 2, 12/5, 5/2, 3 give B = 4/5, 3/4, 2/3, 3/5, 7/12, 1/2; t = 7/2 violates necessity).
    Input: WLS-coh at K = D = Z^(2t), marks of length 2t - 1.

The input is not independent of the conclusion: by Lemma C(b) it alone gives beta_eta <= 1 - t/6 for the target.
The rest of the architecture (signal extraction, high side, counts) adds nothing at such a vertex. With H kept:
for t <= 2 the conclusion is zero-freeness; for 2 < t <= 3 the Prop. 2.1 reading is statement (R) (row Z24),
while the energy route (b) reads the reciprocal sum of L(s, eta) directly and its own normaliser was not derived
(weakest step 2). Criterion of the assignment ("vertex with h > 1 and a named unproved input"): met in the
letter, not in substance; by the rule used in c5 and c6 (input must not be equivalent to the conclusion) the
state does not move.

## 6. Part B: the compensated principal signal for Re s below 3/5, with H kept

From (3.1), for a single slot subset I = {i}:

    term_i(Z) = c_S X^(1/3) Z^(-5/6) prod_{j != i} (-A_j) sum_p W_i(q_p/P_i) omega_eta(p) q_p^(13/6) g_eta(Z/q_p^5).

* Slot length l_i > 1/5: Z/q_p^5 <= Z^(-c), c > 0, and g_eta decays faster than every power at 0 (contour to the
  right; H_eta and 1/L^S are bounded there). The term is O(Z^-N) at every abscissa. The same holds for a subset I of
  total length > 1/5. [PROVED]
* Slot length l_i <= 1/5: g_eta(Y) = sum over poles rho of H_eta/L^S of c_rho Y^rho + (contour), so
  term_i = sum_rho c_rho Z^(C0(rho)) T_i(rho), T_i(rho) = sum_p W_i omega_eta(p) q_p^(13/6 - 5 rho), a prime sum of
  the infinite-order character omega_eta. Size: abs(T_i(rho)) << P_i^(theta_omega + 13/6 - 5 Re rho + eps) with
  theta_omega the zero abscissa of L(s, omega_eta); trivially theta_omega <= 1. Against the main term
  A_i ~ P_i^(1/6): relative size P_i^(theta_omega + 2 - 5 Re rho). [PROVED-rel the explicit formula for
  L(s, omega_eta), classical]
* Where it stops. The factorisation (10.18), Hmod = H_eta Z^(l/6) A_eta (1 + R) with a power-saving R, holds on
  Re s > (2 + theta_omega)/5 + eps: unconditionally on Re s > 3/5 (MS (16.13) lists the exponent 4 - 5x_r - 6z_r,
  which is 3 - 5 Re s at z = 1/6); down to 1/2 exactly when L(s, omega_eta) satisfies GRH, where the term is of
  the same order as the main term at Re s = 1/2 and not smaller. Below (2 + theta_omega)/5 the signal has size up
  to Z^(C(beta)) P_i^(theta_omega + 2 - 5 beta), larger than the transcribed one, but with no lower bound: the slot
  factor B_i(s) = -A_i + T_i(s) + ... depends on Z and can vanish (the local factor 1 - R/D vanishes identically
  where the phases align, `local_check.log` last table at s = 3/5). A Z-dependent normaliser is outside the format
  of Prop. 2.1 and of Lemma S.
* With H kept the thresholds stack as follows for a probe with all slots <= 1/5 (the source: l <= 1/5):
  zero-free reading of Prop. 2.1 needs B >= 2/3 (zeros of L(6s - 3, psi_eta)); Lemma S format needs
  B > (2 + theta_omega)/5 (at most 3/5); (2.2) fails below 7/12. For probes with every slot longer than 1/5
  (possible when l > 1/5, in particular on the whole branch h > 1) the slot term is absent and the signal is
  c_S (-1)^K prod A_i (f_eta(Z) + O(Z^(C(theta)) P^(-1/2))) at every abscissa >= 1/2: weakest step 2 of
  c6-marks is resolved in favour of its sections 3-5 for long slots.
* The marked-only signal differs from the compensated one by the relative amount P_i^-1 per slot (Lemma 1(v)).

## 7. Controls: does the derived high side hold

No statement about zeros is made, so no control has to fail. The assignment asks where each sits.

| control | Lemma 1 / Corollary 1 (exact identity) | Lemma 2 (row bound (2.1)) | signal and Lemma C |
|---|---|---|---|
| THIN (completely multiplicative signs, one zero at b) | holds: uses complete multiplicativity and abs(eta(p)) = 1 only | not available: the twists L(s, eps chi_u) have no continuation to the retained contour, so (10.13) cannot be verified; the same open dichotomy as Proposition D of c4-thin | signal c' Z^C(b); (C1) holds with beta* = b (k_true >= ksig(b)): Lemma C is Euler-blind, it reads the reciprocal sum only |
| Liouville twist | holds; marks coherent (weight conj(lambda(p)) = -1 for every slot prime) | holds, and with no zero classes: 1/L(s, lambda chi_u) = L(s, chi_u)/L(2s, chi_u^2) is holomorphic on Re s > 1/2 for u != 1 | signal c Z^C(1) from the pole (c6-marks); (C1) with beta* = 1 gives the full sextic pole term K^(5/6) D^(1/3): the Liouville-twisted marked row is the extremal vector of the sextic sieve (dual coefficients all 1; measured as s1c in c6-kd23). Low side: B >= 1. Consistent. |
| unimodular twist U (eta(p) replaced by eta(p) u_p, abs(u_p) = 1, completely multiplicative) | holds verbatim; coherence holds if the mark weights use conj(u_p) | not available in general (no continuation of the twisted rows) | Lemma 3 and Lemma C hold with the abscissa of the twisted reciprocal; not separated from zeta by anything in this note |
| Davenport-Heilbronn | holds termwise (finite combination of ray characters; marks in the identity ray class are coherent for all terms at once) | holds termwise | the signal is sum a_theta f_{eta theta}; Prop. 2.1 continues each 1/L(s, eta theta) and says nothing about zeros of the combination. Fails at the scalar Euler identity for u = 1 (MS Lemma 7.1), as in c5. Lemma C holds termwise only: the energy of a combination contains cross terms that are not squares |

Other controls (backward heat, T-NR, Beurling, zeta(s+a)zeta(s-a), phase-rotated transfer operator, theta^w): not
run; nothing here is a positivity or zero statement about a function.

## 8. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | Lemma 1 is an Euler-factor identity and coherence uses complete multiplicativity, but no statement about zeros is drawn; Lemma C holds for THIN and U |
| R2 height-uniform, every window | false | no conclusion about a function |
| R3 controls fail structurally | false | nothing to fail; section 7 records where each control sits; THIN and U are not separated |
| R4 reaches the critical line | false | the only vertices with h > 1 have an input that is the conclusion in the row variable (Lemma C(b)); with H kept the zero-free reading ends at h_eff = 2 |

## 9. Three weakest steps

1. **Lemma C is argued, not written out.** Needed: a row weight whose dual kernel is positive definite in the
   column pair (a Gaussian kernel is not; the argument sketched is expansion of exp(-lambda u u') about a narrow
   column range with the odd terms bounded by the same energy with modified weights); the pairs with a common
   factor; the cube completion n != 1; the reciprocity sign on a class; an Omega-result for the smoothed
   reciprocal sum (needs a weight whose Mellin transform does not vanish at the zero). The diagonal term limits
   the unconditional form to max(k, 1 + l - M). The identification of the dual coefficient at the principal
   frequency with mu eta rests on MS (7.13) and (16.13), not on the reduced row of c6-kd23 (whose
   xi_1 = alpha^2 G nu comes from a text with lost conjugations). No numerical test of the coherent term with
   zeros was run: it needs h_E > 3, that is P > Z^5 at K = D, out of reach of a direct sum; the pole case is the
   only measured instance (s1c of c6-kd23).
2. **Lemma 2 beyond S_i is relative to row estimates that MS proves only at (12.4).** Prop. 16.1 (moment bounds
   for Q_i, error slots D_i, rows with p | u) and Lemma 10.4 are stated for sigma0 in [7/8, 1), z0 = 17/50; the
   reduced line uses them at general geometry with ideal counts. The exact part is Lemma 1 and the size of S_i.
   The normaliser of the energy route in Lemma C(b) (the analogue of H_eta for the squared signal) was not
   derived, so "zero-free" there is subject to the same kind of resonance caveat as row Z24.
3. **Part B sizes are upper bounds.** The statement "stops at (2 + theta_omega)/5" is about the available
   factorisation; the true size of T_i(rho) depends on zeros of L(s, omega_eta) and on the weight W_i. The phase
   conventions (omega_eta = psi_eta eta or psi_eta conj(eta)) were not resolved; only infinite order is used.
   Liu II Lemma 2.4 is used for the marked-only row at lx <= l on the reading that its hypotheses involve (m, l)
   only; its proof was not replayed. The whole system is transcribed from unrefereed sources.

## 10. Proposed map and strategy changes (not applied)

* Row Z15d (new): "Uncompensated (marked-only) probe of MS (12.5). Exact high identity with holomorphic
  correction sum prod q^(z-1) Gmark_p prod H_p, Gmark_p = G_p + Q^-w H_p; slot factor = sextic prime sum + scalar
  prime sum + errors; high side = compensated line with g -> max(g, l delta/2); signal and normaliser unchanged
  (Bmark_p = B_p + q). Marks are coherent at sixth-power frequencies, so the marked-row energy has the term
  K^(5/6) D^(1/3) P D^-1 Z^(2 beta* - 1): max(k, 1 + l - M) >= (2 + 2l - M)/6 - 2(1 - beta*), hence B_low >= beta*
  for M >= 1 + l. LP with this constraint: exactly 1/2 at (3, 3, 5); proved rows: 8/9 at h = 1. The h > 1 vertices
  (cone (t, t, 2t - 1)) have the single input K + D for coherent marked rows, which alone implies their
  conclusion. Status: local identities EXACT; high side ARGUED-rel MS; Lemma C ARGUED; LP EXACT on MODEL inputs.
  Controls: THIN, U not separated (Lemma C reads the reciprocal sum); Liouville = extremal vector; DH termwise."
* Row Z15c of c6-kd23 (label used there for the unreflected-rows result): replace "under GRH the false input of
  the lx < l region is the uncompensated branch, not the sieve" by "the false input is K + D for the coherent
  marked rows at the sixth-power frequencies; the uncompensated high side is derived and holds in the model".
* STRATEGY 4.0: both derivation items are done. Third same-kind obstruction for "h > 1 by marks": the low input
  is the conclusion. Nothing is left on the list from this branch.
* c5 `tiers_fe2.log` rows Y2, Y6 should be regenerated (values 0.9 and 0.8810 with the current script).

No pivot taken. No abscissa below 0.874886647 is proved.
