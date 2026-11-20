# c6-marks-bc-manuscript-check: Theorems B and C of `c5-marks-circularity-order2` against the manuscript text

Internal working note, 2026-11-18. Slug `c6-marks-bc-manuscript-check`. Kind: deepen (STRATEGY 4.0 item 4). Unrefereed.
Nothing committed, pushed or posted. No ssh; two local runs through `scripts/memcap.sh 8` (stdlib python, exact rationals).
Scope: an ESTIMATE SYSTEM inside the 7/8 architecture. Sources read as text: the manuscript
`~/lean-deps/qrh-verify/paper.txt` (openai/math, 5 Oct 2026; "MS" below), Liu arXiv:2610.12234 ("Liu I") and
2610.26835 ("Liu II") in `push/bypass-78/dl/`. All are unrefereed. Every abscissa below is the value of a hypothetical
estimate system. No statement about zeros of zeta is made. 7/8 (unrefereed) stands. RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / EXACT (rational arithmetic, logs) / CLASSICAL / ARGUED /
MODEL / NO SOURCE (no numbered statement of MS, Liu I, Liu II covers it) / OPEN.

## Verdict: precise obstruction (second same-kind obstruction for long prime marks; the equivalence is corrected)

1. **The equivalence "low input at the h = 3 vertex <=> GRH for the family" does not hold at manuscript level in
   the direction (low input => GRH).** The reduced system drops the normaliser H_eta of MS (10.1). At the principal
   residue point, H_eta(s) = zeta_F^S(2)^-1 L^S(6s - 3, psi_eta) E_eta(s) with psi_eta = (alpha eta)^6 an
   infinite-order Hecke character (frequency 6), E_eta holomorphic and non-vanishing on Re s > 1/2 (formula found in
   `r3-tnr-control`, re-derived here exactly, `hp_check.log`). H_eta has infinitely many zeros in
   7/12 <= Re s < 2/3. Hypothesis (2.2) of MS Proposition 2.1 is therefore false for every sigma_0 < 7/12, and
   Proposition 2.1 cannot be applied at sigma_0 = 1/2 for any choice of S.
2. **What holds instead (Theorem B1', section 3).** Write (N) for the low input at the vertex. Then
   GRH(family) => (N) [signal part PROVED with classical inputs; remainder PROVED-rel an identity and a row bound
   that have NO SOURCE at the vertex]; (N) + high side => (R): beta* <= 2/3, and every zero of the family in the
   top layer of the strip 1/2 < Re s <= 2/3 is a common zero of L(s, eta) and L(6s - 3, psi_eta) [PROVED-rel];
   (R) => GRH is OPEN (it is the non-resonance statement NONRES). For the signal alone the statement is exact and
   unconditional (Lemma S, PROVED): f_eta(Z) << Z^(C(1/2)+eps) iff H_eta / L^S(s, eta) is holomorphic on Re s > 1/2.
3. **No weaker independent input appears.** (N) lies between GRH and (R); a proof of (N) with the high side would
   give beta* <= 2/3 for the whole family. The input is still the conclusion in another variable, so the branch
   "h = r/2 by long marks" closes. The correction is to the conclusion: with the sextic probe of MS, Proposition 2.1
   gives an unconditional statement only down to abscissa 2/3 (h = 2, effective order 3), not 1/2 (h = 3).
4. **Theorem B (criticality at h > 3) survives** at manuscript level with the referee's slack hypothesis: H_eta is
   holomorphic on Re s >= 1/2 and its zeros on the line Re s = 1/2 number O(T), fewer than the zeros of zeta_F on
   the line (Selberg), so the principal target gives the contradiction (section 4). **Theorem C** holds as stated for sigma <= 1/3 (b <= 4) and becomes the resonant statement
   for 1/3 < sigma <= 1/2; its polar decomposition has NO SOURCE (section 5).
5. **Source table (section 1).** Of 12 lines of the reduced system, 5 agree with a numbered statement in formula
   (lines 1, 5, 6, 8, 10), 4 are transcribed differently (2, 3, 4, 11), 3 have no source (7, 9, 12; also the
   weakened geometry GEO-Q). Every geometry with h > 1 has lx < l and is outside the hypothesis lx > l of every
   proved low estimate (MS Prop. 15.3, Liu II Prop. 13.4, Remark 14.1(1)).
6. **Claim A corrected (section 6).**
7. **Controls (section 7).** Liouville: the signal is c Z^(C(1)) + O(Z^(C(1/2)+eps)) unconditionally, so the low
   input fails by Z^(1/2) unless the rows cancel a main term (PROVED for the signal). THIN: the signal has the main
   term c' Z^(C(b)); whether (N) holds is the open half of Proposition D (not decided here).

Requirement flags: R1 no, R2 no, R3 no, R4 no (section 8).

---

## 0. Plan

Decisive test first (sections 2-3): write the low input at an h = 3 vertex in MS notation and test both directions
of the equivalence with GRH. The test needs the exact analytic form of every object in MS Proposition 2.1 at
sigma_0 = 1/2: C(s), J, f, H_eta, (2.2), (2.4), (2.5). The only object the reduced system does not carry is H_eta.
Then: source table, Theorems B and C, claim A, controls.

Read: BRIEF (all notices); STRATEGY 4.0; OBSTRUCTION_MAP rows Z15, Z18, G21, THIN and section 2; RESULT + REFEREE of
`c5-marks-circularity-order2`; `r3-method-limit` sections 1-3; `r3-tnr-control` section 3 (normaliser formula) and
its REFEREE lines on it; `c4-thin-twist-control-78` verdict and Proposition D; MS sections 2, 6-7 (Lemma 7.1 and
its proof), 10.1-10.2, Lemmas 10.4, 10.5, section 12, Lemma 15.1, Propositions 15.2 (end of proof), 15.3, section
16.1 and (16.12)-(16.14); Liu II 2.4, 13.4, (14.7), Remark 14.1, 15.1.

Not repeated: the LP tables of c5 (two spot checks only, `lp6.log`), the WLS numerics.

New relative to c5 and r3-tnr: (i) the normaliser formula applied to the h = 3 vertex (c5 flagged it as weakest
step 1 and did not use it; r3-tnr stated the resonance variant of Prop. 2.1 but for the present design, where it
does not bind); (ii) the second factorisation of H_eta to Re s > 3/7 and the count of its zeros on the critical
line, which decides Theorem B; (iii) Lemma S; (iv) the source table; (v) the exact principal slot multiplier,
which shows where the compensated signal formula stops being the transcribed one; (vi) the Liouville control at
the vertex.

## 1. First lemma: source table for the reduced system

Reduced system = `r3-method-limit` section 1 as coded in `c5/lp5.py` (variables lx, ly, l; M = lx + ly, b = ly - lx,
h = 1 - lx + l).

| # | line of the reduced system | numbered statement | status |
|---|---|---|---|
| 1 | C(s) = s - 1 + lx/2 + h/6, h = 1 - lx + l | MS Def. 10.1, (10.3); (15.9); Liu II 15.1 | SAME. (10.3) requires lx, ly > 0, l >= 0, h > 0. It is notation; the content is the identity (10.5), which MS calls "a hypothesis to be proved for the physical expression" and proves at lx = ly = 1/2, l = 0 and at (12.4). |
| 2 | abscissa rule B = (low exponent) - (C(s) - s) | MS Prop. 2.1, (2.4) at sigma_0 = B | DIFFERENT. Hypothesis (2.2) (H_eta holomorphic with abs(H_eta - 1) <= 1/2 on Re s > sigma_0) is omitted. MS proves it on Re s > 7/8 ((10.2)). It is false for sigma_0 < 7/12 (section 2). |
| 3 | signal (S): row u = 1 gives Z^C(s) / L(s, eta) | MS (7.13) at u = 1; (10.1); Lemma 10.5, (10.18), (10.19) | DIFFERENT. The integrand is Z^C(s) H_eta(s) / L^S(s, eta). Lemma 10.5 is stated for sigma_0 in [7/8, 1) with contours in the region D2 (Re s >= 7/8). |
| 4 | signal for the compensated probe: same, times a normaliser Z^(l/6) A(Z) | MS (16.12)-(16.14), (10.18); section 20 | DIFFERENT below Re s = 3/5. Exact principal multiplier at a slot prime (eta(p) = 1): B_p = -1 + a_p^2 Q^(3-5s) + smaller (`hp_check.log`, last line). MS (16.13) lists the exponent 4 - 5 x_r - 6 z_r, which is 3 - 5 Re s at z = 1/6. For Re s <= 3/5 the second term is not an error term; the factorisation (10.18) with a power-saving remainder then has no source (ARGUED: the slot sum of the second term is a prime sum of alpha^6, and no power saving for it is available without a zero-free strip for L(., alpha^6)). |
| 5 | low side: abs(I) << Z^(lx/2 + G + k/2) | MS Prop. 6.3 (lx = ly = 1/2, l = 0, G = k = 0); Prop. 15.3 at (12.4) (G = b/12, k = 0); Liu II Prop. 13.4 (l <= 1/5, b >= 0, ly >= 11b/6, lx > l); Liu I Prop. 22.2 = Liu II Prop. 2.5, (2.7) (lx, ly > l, b > 0, h > 0) | SAME formula. Range: every numbered statement assumes lx > l, hence h < 1. Liu II 15.1 relaxes to "M, ly, l >= 0" and says this "goes beyond" the cited proposition. |
| 6 | G = max(0, b/12, b - ly/2) | MS Prop. 15.2 (terms P_a^(1/6) and P_a^2/Y', P_a = Y'^2/Q), used in (15.7) | SAME (upper bound only). |
| 7 | G packages "tro6" = max(0, b - ly/2) and "zero" | none | NO SOURCE (TRO6-natural at eta = 1; "zero" also drops the P_a^2/Y' term). |
| 8 | k = max(0, (1 + 3l - 2M)/4, M + l - 1, (3l - 1)/2) | Liu I Lemma 22.1 = Liu II Lemma 2.4; MS Lemma 15.1, (15.2) is the instance at (12.4), where M + l = 1 | SAME. |
| 9 | k packages "wls", "hb", "zero", "dual" for unreflected marked rows | none. MS uses Heath-Brown [17, Thm 2] in Lemma 9.1 and section 17, not for the marked completed row B_m | NO SOURCE (c5: ARGUED for M >= 2 + 2l with cube completion omitted; conjecture otherwise). |
| 10 | geometry (GEO): lx >= l, ly >= l | MS (12.5) (rescaled term I(X/q_p, Y/q_p, Z)); proof of Prop. 15.3 ("lx - d >= 3/16, ly - d >= 5/16", "Q, Y' >= 1"); Liu II Remark 14.1(1) | SAME. The weaker (GEO-Q) M >= 2l has NO SOURCE. |
| 11 | high side: E(delta, x) = 1/2 + delta/2 - B - ly/2 + h(5/6 - delta) - l/2 + l delta x <= 0 | MS Lemma 10.4, (10.15) at d = h with a = (1 + delta)/2, R = 1 - 3 delta/2, g = l delta x; Liu II (14.7) | DIFFERENT. (a) (10.15) has - a ly = - ly/2 - delta ly/2; the reduced line drops - delta ly/2 (conservative). (b) R = 1 - 3 delta/2 is the MODEL count (density hypothesis and Lindelof on the class); the proved R come from MS Prop. 9.2, Lemmas 17.1, 18.1. (c) Lemma 10.4 is stated for sigma_0 in [7/8, 1), z_0 = 17/50, and needs hypothesis (10.13) for the compensated correction, proved in MS Prop. 16.1 at (12.4) only. (d) Only d = h is kept; the other row ranges (MS Lemma 10.6) are not in the reduced system. |
| 12 | uncompensated high side H0' (no - l/2, no amplitude term, (S) unchanged) | none. The marked-only term has local multiplier eta(p) Q^(x+z-1) P_p*/P_p (first term of (16.1)), defined "at points where P_p is defined and nonzero"; MS builds a holomorphic correction only for the two-term operation ((16.2), (16.3)) | NO SOURCE (r3's guess, as c5 says). |

Count: SAME in formula 1, 5, 6, 8, 10 (line 5 is outside its proved range at every h > 1 point: Lemma 1);
DIFFERENT 2, 3, 4, 11; NO SOURCE 7, 9, 12 and (GEO-Q).

**Lemma 1 [EXACT, trivial; `lp6.log` T4].** h > 1 iff l > lx. So no geometry with h > 1 satisfies the hypothesis
lx > l of MS Prop. 15.3, Liu II Prop. 13.4 or Remark 14.1(1), and none satisfies l <= 1/5 together with M + l <= 1
at B < 13/15 (T3: with lx >= l, M + l <= 1, l <= 1/5 the reduced infimum is 13/15 with polar or source G, 6/7 with
TRO6 G, 5/6 with G = 0). The h = 3 vertices are (lx, ly, l) = (0, 4, 2), (0, 6, 2), (5, 5, 7), (5/2, 5, 9/2),
(4, 8, 6), (6, 12, 8) (T1); at each, lines 5, 9, 10, 11 are used outside every range in which a numbered statement
exists, and (0, 4, 2), (0, 6, 2) also violate lx > 0 of Def. 10.1.

## 2. The normaliser

Notation of MS section 7.2 for the row u = 1 (j = 0, rho = 1) at a prime p outside S: Q = q_p, q = 1/Q,
D = eta(p) Q^-s, R = a_p^2 Q^(4 - 6s - 6z), V = Q^(-6z), W = Q^-w, a_p^2 = (alpha(p) eta(p))^6 up to the
conjugation convention of (7.6), alpha(p) = p/abs(p) on primary generators.

**Lemma H [EXACT `hp_check.log`; the first form is `r3-tnr-control` section 3, confirmed by its referee].**
From MS (7.11), (7.12) at (w, z) = (1, 1/6):

    H_p(s, 1, 1/6) = (1 - q^2) (1 - D(1 - q) - R q) / ((1 - R)(1 - D)),          R = a_p^2 Q^(3 - 6s),
    1 - D(1 - q) - R q = (1 - D)(1 - R q) + D q (1 - R).

Hence, with psi_eta = (alpha eta)^6 (or its conjugate-alpha form; in both cases of infinite order, conductor
dividing that of eta^6, so L(w, psi_eta) is entire):

    H_eta(s) = zeta_F^S(2)^-1 L^S(6s - 3, psi_eta) E_eta(s)                                  (Re s > 1/2)
             = zeta_F^S(2)^-1 [L^S(6s - 3, psi_eta) / L^S(6s - 2, psi_eta)] E'_eta(s)        (Re s > 3/7),

E_eta = prod (1 - q(R - D)/(1 - D)) absolutely convergent for Re s > 1/2 (largest term Q^(2 - 6 Re s)),
E'_eta = prod (1 + D q (1 - R)/((1 - D)(1 - R q))) absolutely convergent for Re s > 3/7 (terms Q^(-1 - Re s),
Q^(2 - 7 Re s)). Every local factor is non-zero on Re s >= 1/2 (abs(D)(1 - q) + abs(R) q <= Q^(-1/2)(1 - 1/Q) + 1/Q
<= 0.625 for Q >= 4). The algebra uses only complete multiplicativity and abs(eta(p)) = 1.

**Corollary H1 [PROVED given Lemma H; CLASSICAL facts about Hecke L-functions].**
(a) H_eta is holomorphic on Re s >= 1/2 and polynomially bounded on Re s >= 1/2 + eps.
(b) In Re s > 1/2 its zeros are exactly the points s = (3 + rho')/6, rho' a zero of L(w, psi_eta) in 0 < Re w < 1.
    There are infinitely many, symmetric about Re s = 7/12; at least one has Re s >= 7/12. None has Re s >= 2/3.
(c) On Re s = 1/2 its zeros are those of the deleted factors, prod_{p in S} (1 - psi_eta(p) Q^(3 - 6s)): a finite
    union of arithmetic progressions, O_S(T) zeros up to height T with multiplicity at most abs(S). (L(w, psi) has no
    zero on Re w = 0 or Re w = 1.)
(d) MS (2.2), sup over Re s > sigma_0 of abs(H_eta - 1) <= 1/2, is false for every sigma_0 < 7/12 and every finite S.
    For 7/12 <= sigma_0 < 2/3 it requires at least that L(w, psi_eta) has no zero in Re w > 6 sigma_0 - 3, a
    zero-free strip for an infinite-order character that is not in the family (2.1).

**Lemma S (signal criterion) [PROVED; classical tools].** Let f_eta be (2.3) with this H_eta and any C(s) = s + c.
For 1/2 <= B < 1 the following are equivalent:
(i) f_eta(Z) <<_eps Z^(C(B) + eps) as Z -> infinity;
(ii) H_eta(s) / L^S(s, eta) is holomorphic on Re s > B;
(iii) every zero rho of L(s, eta) with Re rho > B is a zero of L(6s - 3, psi_eta) of at least the same multiplicity
     (so no zero has Re rho >= max(B, 2/3)).
Proof. (i) => (ii): the Mellin argument in the proof of MS Prop. 2.1 (rapid decay of f at 0, Fourier inversion on
Re s = 2, identity theorem) gives a holomorphic continuation of e^((s-5/6)^2) H_eta / L^S to Re s > B; (2.2) is not
used in that part. (ii) <=> (iii): Corollary H1(b) and non-vanishing of the deleted factors in Re s > 0.
(ii) => (i): g = H_eta / L^S is holomorphic on Re s > B. For large abs(t), L(s, eta) has O(log abs(t)) zeros in a disc of
radius 2 about 2 + it and log L minus the sum of log(s - rho) over them is O(log abs(t)) on the half-radius disc
(Landau's lemma, Titchmarsh 3.9). Choose a rectangle [B + eps', 3] x [t - 1 - a, t + 1 + a'] with eps' in
(eps/4, eps/2) and a, a' in (0, 1) whose sides stay at distance >= c/log abs(t) from every zero (pigeonhole). On its
boundary abs(1/L) <= exp(C log abs(t) loglog abs(t)); H_eta is polynomially bounded; the maximum principle gives
abs(g(s)) <= exp(C' log abs(t) loglog abs(t)) inside. The Gaussian in (2.3) dominates, the contour moves to
Re s = B + eps, and (i) follows. QED

Lemma S with H_eta replaced by 1 is the statement the reduced system uses. The difference is (iii).

## 3. Decisive test: the low input at an h = 3 vertex

Fix a geometry g with h = 3 (so C(1/2) = lx/2) and the corresponding probe; J_eta = I_eta,modified / (c_S A_eta)
as in MS section 20 (or I_eta / c_S for an unmarked probe).

    (N)        abs(J_eta(Z)) <<_{eta, eps} Z^(lx/2 + eps)  for every primitive finite-order eta.     [(2.4), sigma_0 -> 1/2]
    (ID_g)     the exact high representation (10.5) holds for the probe at g with a correction holomorphic for
               Re s > 1/2 on the contours used, and the principal row gives c_S A_eta f_eta as in Lemma 10.5.
    (HI_g(b))  abs(J_eta - f_eta) <<_eta Z^(C(b) - sigma) for some sigma > 0 independent of eta.          [(2.5) at beta* = b]

**Theorem B1' [labels per line].**

(1) GRH for the family => (N).
  (1a) GRH(eta) => f_eta(Z) << Z^(lx/2 + eps). PROVED (Lemma S, (iii) is empty; only GRH for L(s, eta) is used, none
       for psi_eta). CLASSICAL inputs: bound for 1/L under GRH or the lemma in the proof of Lemma S.
  (1b) J_eta - f_eta << Z^(lx/2 + eps). PROVED-rel (ID_g) and the floor-class row bound ((10.13) with delta = 0,
       R = 1, then (10.15) at sigma_0 = 1/2: 5h/6 - ly/2 - l/2 + g <= 0; under GRH no class with delta > 0 is
       occupied and Lindelof for the numerators is CLASSICAL). (ID_g) and (10.13) at g: NO SOURCE (table lines
       3, 4, 11, 12; MS proves them at (12.4) and for Re s >= 7/8).
  Status of (1): CLASSICAL in the signal, OPEN in the remainder at every h = 3 vertex. It is not refuted.

(2) (N) => GRH for the family.
  (2a) Through MS Prop. 2.1 as stated: not available. (2.2) is false at sigma_0 < 7/12 (Corollary H1(d)). PROVED.
  (2b) Variant without (2.2) [PROVED-rel (ID_g), (HI_g(b)) for every b in (1/2, 1]]: assume beta* > 1/2. (N) and
       (HI_g(beta*)) give f_eta << Z^(C(beta*) - eps*) with eps* = min(sigma, (beta* - 1/2)/2) > 0; Lemma S gives:
       every zero of every L(s, eta) with Re rho > beta* - eps* is a zero of L(6s - 3, psi_eta). If beta* > 2/3 some
       zero of the family has Re rho > max(beta* - eps*, 2/3), where H_eta does not vanish: contradiction. So

       (R)   beta* <= 2/3; and if beta* > 1/2, every zero of the family with Re rho > beta* - eps* is a common zero
             of L(s, eta) and L(6s - 3, (alpha eta)^6), with at least the same multiplicity.

  (2c) (R) => GRH: OPEN. It is equivalent to NONRES-top: for beta* in (1/2, 2/3], not all zeros of the family within
       eps* of the abscissa beta* are common zeros. No argument is known to exclude common zeros of two L-functions
       at related points; the manuscript mechanism gives no handle (the factor L(6s - 3, psi) multiplies the pole away).
  Status of (2): the implication to GRH is OPEN; what is PROVED-rel is (N) => (R).

So GRH => (N) => (R) (each relative to the unsourced identity and high side at g), and (R) => GRH is open.
"Equivalent to GRH" in c5 Corollary B1 is replaced by this chain. For the signal alone the exact statement is
Lemma S: the square-root size of f_eta is equivalent to resonant GRH for eta, (iii) with B = 1/2.

**Reading.** (i) (N) is not an independent input: it implies beta* <= 2/3 given the high side, and it is implied by
GRH given the same identities. The obstruction of c5 (the needed low estimate is the conclusion in another
variable) stands, with conclusion (R) in place of GRH. (ii) The outcome "equivalence fails in one direction, a
weaker input suffices and the vertex reopens" does not occur: the failing direction is the one that would make the
vertex useful. No input weaker than (R) gives (N), because (N) with the high side implies (R). (iii) New constraint
for ORDER-2 (STRATEGY 4.0): in the Prop. 2.1 format with the sextic rows of MS, the unconditional conclusion stops
at abscissa 2/3. In h-units: 1 - h/6 >= 2/3, h <= 2, effective order 3. A probe aimed at h = r/2 must also have a
normaliser without zeros in Re s > 1/2, or the family (2.1) must be enlarged to contain (alpha eta)^6 and the
common-zero case excluded. `r3-tnr-control` recorded the 2/3 threshold as non-binding for the present design; it
binds exactly on the branch c5 studied.

Spot check [EXACT, `lp6.log` T2]: vertices of the reduced system at B = 2/3 (h = 2): (0, 2, 1), (0, 4, 1), (3, 3, 4),
(3/2, 3, 5/2), (2, 4, 3), (4, 8, 5). All have lx < l (Lemma 1).

## 4. Theorem B (criticality) at manuscript level

**Theorem B' [PROVED-rel (ID_g) and (HI_g(1/2)) with strict slack, for the target eta = 1 or eta = chi o N;
replaces c5 Theorem B and referee item E3].**
Let g have h > 3 and suppose abs(J_eta - f_eta) << Z^(C(1/2) - sigma), sigma > 0, for the principal target (or a
target chi o N, chi a Dirichlet character). Then abs(J_eta(Z)) << Z^(C(1/2) - e) holds for no e > 0; in reduced
notation, no low exponent below lx/2 + (h - 3)/6 is true for the whole family.
Proof. Otherwise f_eta << Z^(C(1/2) - e'), e' = min(e, sigma) > 0. The Mellin argument (proof of Lemma S; H_eta is
meromorphic on Re s > 3/7 by Lemma H and the statement is for the quotient) continues H_eta / L^S(s, eta)
holomorphically to Re s > 1/2 - e'. So every zero of L(s, eta) on the line Re s = 1/2 is a zero of H_eta. For
eta = 1, L = zeta_F = zeta(s) L(s, chi_-3), which has >> T log T distinct zeros on the line up to height T
(Selberg 1942, CLASSICAL; the same for Dirichlet L-functions). H_eta has O_S(T) zeros on the line
(Corollary H1(c)). Contradiction for large T. QED

Remarks. (a) The comparison is made on the line only. In Re s > 1/2 counting does not help: L(6s - 3, psi_eta) has
about six times as many zeros up to height T as L(s, eta), so full resonance of off-line zeros is not excluded by
density. (b) For a target that is not of the form chi o N the proof needs a positive proportion (or at least more
than O_S(T)) of zeros of L(s, eta) on the line; not needed for the statement about the family. (c) The slack
hypothesis is referee item E3 of c5: at geometries where the floor row is tight at B = 1/2 the theorem says nothing.

Corollary B2 of c5 (a package uniform in the geometry cannot be the input at a vertex) is unchanged for h > 3.
For 2 < h <= 3 a feasible package is not thereby false; with the high side it implies a statement of type (R).

## 5. Theorem C on the compensated ray at manuscript level

Ray (lx, ly, l) = (b, 2b, (3b - 2)/2), b >= 2; h/6 = b/12; reduced reading "abscissa = 1 - sigma, sigma the saving in
the polar correlation, 0 <= sigma <= b/12".

**Theorem C' [PROVED-rel (ID_g), (HI_g) on the ray, k = 0 (ARGUED in c5), and the polar decomposition (NO SOURCE)].**
(i) unchanged (Cauchy-Schwarz with the polar norm gives B = 1).
(ii) for sigma <= 1/3 (abscissa >= 2/3; on the ray b <= 4 suffices for the full range): low exponent
     lx/2 + b/12 - sigma + eps  <=>  no zero of the family in Re s > 1 - sigma, as c5 states, with both directions
     relative to the high side at that abscissa (referee item E5) and to (ID_g).
(ii') for 1/3 < sigma <= 1/2: zero-freeness in Re s > 1 - sigma => the low exponent [PROVED-rel, Lemma S (ii) => (i)
     and the high side]; the low exponent => statement (R) at level 1 - sigma, not zero-freeness.
(iii) "the part of I not coming from the polar part of A is << Z^(lx/2) with proved norms": NO SOURCE. MS Prop. 15.2
     is an upper bound for the whole Gram form with a term P_a^(1/6); it does not split A. The split is
     `r2-tro6-polar-theorem` (relative) at b = 1/8.
(iv) sigma <= 1/2 from Theorem B' (with its slack hypothesis).
In addition, on the ray l = (3b - 2)/2 >= 2 > 1/5 and lx = b < l for b > 2: table lines 4, 5, 10, 11 are outside
their ranges. Referee item E5's caveat "for targets with (lambda eta)^6 principal there is a pole at s = 2/3" is
vacuous for the family (2.1): (alpha eta)^6 has infinite order for every finite-order eta, so L(6s - 3, psi_eta) is
entire. The correct caveat is the zero set of Corollary H1(b), which acts for every target.

## 6. Claim A corrected

Claim A of c5 after the referee (E1, E2, E4) and this lane. All statements are about the reduced system.

A1 [PROVED scalar, relative to the unsourced line 12 for the uncompensated half]. No geometry with l >= M has
   abscissa <= 1.
A2 [EXACT]. With polar G and (GEO-Q) the floor is 5/6 (`lp6.log` T1 last line: 0.83333 by bisection; c5 T1), so
   r3's "polar kept, l = 7/2" vertex is not a vertex of a system with (GEO-Q).
A3 [EXACT, `lp6.log` T1; this replaces the false sentence]. r3's "G = 0, l = 2" vertex is consistent with (GEO-Q):
   it is (0, 4, 2) with k = 0, and (0, 6, 2) with the proved-sieve package, where M = 2 + 2l. Geometry does not
   remove it. What it lacks is a source: G = 0 at b = 4 > ly/2 = 2 discards the P_a^2/Y' term of MS Prop. 15.2
   (table line 7), and lx = 0 is excluded by Def. 10.1.
A4 [EXACT]. Vertices at B = 1/2, by smallest l per package: (0, 4, 2), (0, 6, 2) (G = 0, compensated);
   (5/2, 5, 9/2) (TRO6 G, uncompensated); (5, 5, 7) (polar G, uncompensated); (4, 8, 6), (6, 12, 8) (TRO6 G,
   compensated); the referee adds (3, 5, 5) and (8, 16, 12) under the rule "uncompensated only where (GEO-Q)
   fails". At each M > l (M - l >= 2). The smallest mark length at B = 1/2 is 2 (G = 0) or 9/2 (TRO6 G).
A5 [EXACT]. The LP has no floor at 1/2 (referee E4): its value is the search bound. The sentence "the infimum is 1/2"
   is withdrawn. Below 1/2 the inputs are false by Theorem B' (relative); between 1/2 and 2/3 the conclusion of a
   feasible vertex is (R), not zero-freeness (section 3); at and above 2/3 the reduced reading is the manuscript
   reading, relative to lines 3, 4, 5, 9, 10, 11, 12 being used outside their sourced ranges (Lemma 1).
A6. The heuristic "prime marks with l - lx = 2 are circular because they need GRH-strength prime sums" stays
   withdrawn (c5): no low-side prime-sum estimate is needed. The circularity is in the signal: Lemma S.

## 7. Controls

The lane proves statements inside an estimate system; none separates zeta from a control by itself. The two
controls named in the assignment, at an h = 3 vertex g:

**Liouville twist** (eta replaced by lambda, lambda(p) = -1; completely multiplicative, unimodular, not periodic).
Lemma 7.1 and Lemma H use only complete multiplicativity and abs(eta(p)) = 1, so H_lambda = zeta_F^S(2)^-1
L^S(6s - 3, alpha^6) E_lambda, and L^S(s, lambda) = zeta_F^S(2s)/zeta_F^S(s). The signal integrand
Z^C(s) H_lambda(s) zeta_F^S(s)/zeta_F^S(2s) is holomorphic on Re s > 1/2 except a simple pole at s = 1 with
non-zero residue (H_lambda(1) != 0). Hence, unconditionally,

    f_lambda(Z) = c_lambda Z^(C(1)) + O(Z^(C(1/2) + eps)),  c_lambda != 0,   C(1) = lx/2 + 1/2 at h = 3.   [PROVED]

The signal criterion fails by exactly Z^(1/2). The rows are L(w, chi_u) L(s, chi_u)/L(2s, chi_u^2) times
corrections; they have no pole in Re s > 1/2 for u != 1, unconditionally. So (N) holds for the Liouville twist
only if the rows cancel a main term of size Z^(C(1)); with (ID_g) and the floor-class bound for these rows
(a mean-value statement, no zero-free input) (N) fails [ARGUED-rel; not PROVED because (ID_g) has no source].
Answer: the Liouville twist does not satisfy the signal form of the low input (PROVED); it does not satisfy (N)
relative to the unsourced identity (ARGUED).

**THIN** (eps = +-1 completely multiplicative, F = zeta (s - b) W, one simple zero at real b in (1/2, 1); over F by
composition with the norm, as in `c4-thin-twist-control-78`). psi_eps = alpha^6. 1/F has a simple pole at b, and
H_eps(b) = 0 only if b < 2/3 and L(6b - 3, alpha^6) = 0 (a real zero of the weight-7 CM L-function in (0, 1); none
is known; the first zeros measured in `r3-tnr-control` are at height 6.51 and above; the real segment was not
checked here). For b >= 2/3, or b non-resonant: f_eps(Z) = c' Z^(C(b)) + lower order, c' != 0 [PROVED-rel the
continuation of F stated in c4-thin Theorem 1]. So the signal form of the low input fails for THIN by Z^(b - 1/2).
Whether (N) itself holds for THIN at g is the same open dichotomy as at the manuscript geometry (Proposition D of
c4-thin; STRATEGY 4.0 item 1): (N) holds for THIN iff the high comparison fails for THIN by at least Z^(b - 1/2).
Not decided here. The manuscript's proof route for a low estimate (reflection, MS Prop. 5.1, periodicity of the
weight) is unavailable for THIN and for the Liouville twist alike.

Remark (OPEN, not pursued). A unimodular control with a zero placed at a resonant point (L(s, eps) and
L(6s - 3, (alpha eps)^6) vanishing together) would satisfy the signal criterion of Lemma S at B = 1/2 while
violating GRH. Whether the THIN construction can be steered to such a point is not known; it would settle (2c)
negatively for the class of completely multiplicative unimodular targets.

Other controls (DH, backward heat, T-NR, theta^w, Beurling, phase-rotated transfer operator, zeta(s+a)zeta(s-a)):
not run. The lane makes no positive claim that would need them. T-NR and theta^w enter as in c5 section 7 (read,
not verified).

## 8. Requirement flags

* R1 (all primes together, multiplicativity essential): **no**. Lemma H is an Euler-product identity and Lemma S a
  Mellin statement; neither is an attack. The equivalences hold for any completely multiplicative unimodular target.
* R2 (height-uniform, every window): **no**. No conclusion about a function is drawn.
* R3 (fails for every control at a named structural step, verified): **no**. Two controls examined; for THIN the
  decisive half is open.
* R4 (finite stages or the region right of 1 to the critical line): **no**. The lane shows that the one model point
  of the architecture that reads abscissa 1/2 has (R) as its conclusion and an input implied by GRH and implying
  beta* <= 2/3.

State of "R4 inside the 7/8 architecture" for the planner: unchanged, **no probe with h > 1**. Added detail: a
model vertex with h > 2 has conclusion (R), not zero-freeness; the unconditional range of the format ends at h = 2.

## 9. What moves in the map and the strategy (proposed; not edited by this lane)

* STRATEGY 4.0, bullet "At the point reaching abscissa 1/2 in the reduced model (h = 3) the low input is equivalent
  to GRH for the family": replace by "GRH => low input => (R) (beta* <= 2/3 and top-layer zeros resonant with
  L(6s - 3, (alpha eta)^6)), each relative to an identity and a high side that have no source at h > 1; (R) => GRH
  open. Checked against the manuscript text."
* ORDER-2 lemma: add the requirement "normaliser H of the probe has no zeros in Re s > 1/2 (or the family contains
  the characters occurring in H and common zeros are excluded)". For the sextic rows of MS this fails: h <= 2.
* Row Z15: "1/2 requires h = r/2" should read "within Prop. 2.1 with the MS rows, h > 2 yields the resonant
  statement (R); the unconditional floor of the format is 2/3 for r = 6". Row Z18: its last sentence is confirmed
  and now binds (on the long-marks branch).
* Item 4 of STRATEGY 4.0 is decided: second same-kind obstruction for "h = r/2 by long prime marks"; remove.

## 10. Three weakest steps

1. **Everything in sections 3-5 is relative to (ID_g) and a high side that have no source at any h > 1
   geometry** (Lemma 1, table lines 3, 4, 11, 12). Lemma H, Corollary H1 and Lemma S are unconditional; the
   statements about (N) are not. Theorem B' in addition needs strict slack in the high side at C(1/2) and uses
   Selberg's positive-proportion theorem for the principal target (classical, cited not re-read).
2. **(ID_g) is assumed, and table line 4 suggests it has a different shape below Re s = 3/5.** The exact slot
   multiplier is B_p = -1 + a_p^2 Q^(3-5s) + smaller. For compensated probes at h > 1 the principal row is
   Z^C(s) H_eta / L times a product of slot sums that contain prime sums of alpha^6; this lane did not derive the
   resulting signal. For slot subsets of total length > 1/5 the extra term can be moved to the right and is
   negligible (ARGUED, one line); for shorter subsets it competes with the normaliser when Re s < 3/5. If it
   changes the signal, sections 3-5 hold for the unmarked signal f_eta of Lemma S and not for the compensated probe.
3. **The conjugation convention of a_p in (7.6) was read from a text extraction that lost overlines.** The results
   need only that psi_eta = alpha^(+-6) eta^6 has infinite order, which holds for either sign; the identification
   with the weight-7 level-3 CM form is taken from `r3-tnr-control`. The algebra of Lemma H was checked at 400
   random rational points (exact), which proves the rational-function identities; the convergence ranges are by
   hand. Liu I/II were read at the cited statements only; Xu-Sang (2610.15291) was not opened beyond its
   definition of H_eta.

## 11. Files

`hp_check.py`, `hp_check.log` (Lemma H, (7.17) consistency, slot multiplier; exact rationals);
`lp6.py`, `lp6.log` (vertices at B = 1/2 and 2/3, source-hypothesis infima; uses `lp5.py`, `tiers_copy.py` copied
unchanged from c5).
