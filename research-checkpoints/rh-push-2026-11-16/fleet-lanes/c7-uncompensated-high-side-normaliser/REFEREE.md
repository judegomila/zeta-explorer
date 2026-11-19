# REFEREE: c7-uncompensated-high-side-normaliser (lens: general)

Date 2026-11-18. Object: `RESULT.md` in this directory. Claimed verdict: precise-obstruction. Claimed flags: all false.

**Referee verdict: holds, with corrections E1-E6.** Every step labelled PROVED or EXACT was confirmed. The two
steps that carry the verdict sentences (Lemma 2 beyond S_i, Lemma C) are labelled ARGUED by the lane and are not
established; several verdict sentences state their consequences without that qualifier (E1, E2). The result makes
no statement about zeros of zeta, does not assume RH or GRH for a claimed conclusion (GRH appears only as a
labelled hypothesis), does not use verified height, and does not present a known theorem as new (the mechanism of
Lemma C is the standard dual lower bound for a power-residue large sieve; the lane does not claim otherwise).

Referee scripts: `/tmp/ref_c7u/chk1.py`, `/tmp/ref_c7u/lpchk.py`; local, through `scripts/memcap.sh 8`; no server use.

## What was re-derived and re-run

1. **Lemma 1 against the manuscript text.** MS (7.11), (7.12), (16.1), (16.2), (16.4), (16.8) and the phase
   identities below (16.7) were read in `paper.txt` (lines 3221-3250, 6529-6650). For p not dividing u the product
   eta(p) Q^(-x-w) = D W is phase-free and J_0 = -D + W R, so P_p* depends on (q, D, R, V, W) as coded in
   `local_check.py`; only eta(p) Q^x = v^-1/D and Q^-w = v^-1 W carry the unit v. The lane's script fixes v = 1.
   **Rerun on a different case:** 600 random rational points, new seed, v^-1 = c a sixth free variable (c != 1):
   (i) G_p = Gmark_p - Q^-w H_p, (16.4), (16.8) in the form G_p + v^-1 H_p = rhs, (ii)
   Gmark_p = -(v^-1 - Q^-w) H_p + Delta_p: all exact. Principal point (iii), (iv), (v): exact. (i) is also immediate
   by hand: P_p (1-V)(1-W) = 1 - VW + P_p* (1-V)(1-W). Closed form E_p = [R(1-q)/(1-V) - D(Q-1)WV/(1-V) + WR - DR]/(1-R)
   confirmed; multiplied by eta Q^x it gives the four exponents of MS Lemma 16.2. CONFIRMED.
   Since the identities hold with all phases free, they hold for every completely multiplicative unimodular twist
   (the lane's control statement for Lemma 1).
2. **Corollary 1.** The marked term has multiplier eta(p) Q^(x+z-1) P_p*/P_p (MS, below 16.1 heading); replacing
   (16.4) by its first term gives the selected factor Q^(z-1) Gmark_p times the common scalar factor. Weights:
   W(X,Y,Z; s,w,z) = X^(1/2-z) Z^(s+z-1) Y^(w-1) (Def. 10.1) gives Q^(s+z-1) for Z -> ZQ and Q^(z-w-1) for the rescaled
   term. (10.4) for Hmark: Gmark_p = G_p + Q^-w H_p with w_r >= -1/100 in region 1, so the bound of (16.6) changes by
   a fixed power of Z. CONFIRMED relative to MS (7.5), (7.13).
3. **Lemma 2(a) and the cross-check.** Re(z - 1 - w) = z0 - 2 + a + 6e; ideal count gives P^(z0 - 1/2 + delta/2 + 6e).
   Cross-check recomputed from absolute exponents: base probe at (lx - l, ly - l), factor q_p^(-3/2), count P, then
   subtraction of C(sigma0) of the marked probe: a - sigma0 + h(z0 - 1/6) - a ly - l(1 - a), and
   -l(1 - a) = -l/2 + l delta/2. Same number as (2.1) with g = 0. CONFIRMED (exponent only).
4. **(C1), (C2) arithmetic.** (K/D) (D^2/K)^(1/6) P Z^(2 beta - 1) against Z^k K gives
   (2 + 2l - M)/6 - 2(1 - beta); with b = ly - lx, 1 - h/6 + ksig/2 = beta - b/12 and h_E = h - b/2 = 1 + l - M/2.
   ksig(1) = (2 + 2l - M)/6 is the pole term K^(5/6) D^(1/3), consistent with the control s1c of c6-kd23
   (0.153 measured, 1/6 predicted, reproduced by that lane's referee). CONFIRMED as arithmetic.
   Consistency test added by the referee: a proved row can never violate (C1) at beta = 1/2. For the reflected row
   the P-branch (3l - 1)/2 >= ksig(1/2) always (it would need -M - 1 > 7l); for Lemma 9.1 the branch
   (2 + 2l - M)/3 >= ksig(1). So Lemma C does not contradict either proved row anywhere.
5. **LP, independent re-implementation** (3 variables, own exact vertex enumeration, constraints typed from RESULT
   sections 2-4, nothing imported from the lane). Reproduced: P2b 8/9 at (1/9, 7/9, 1/9) (exact, infeasible at
   8/9 - 1e-9); P2d 1; P2j 0.9051282; P2k 26/21; P3a 1/2 at (3, 3, 5); P3c 0.25 = search bound at (1.5, 4.5, 5).
   **Different cases:** necessity at beta0 = 11/20 returns exactly 11/20 at (2.7, 2.7, 4.4); at beta0 = 7/10
   (box 16) exactly 7/10 at (1.8, 1.8, 2.6); P3a with the constraint lx <= l dropped: still 1/2 at (3, 3, 5);
   reflected row with h >= 3/2: 1.0385 (vacuous); reflected row with lx <= l dropped: 13/15 at h = 0.8 (the r3 source
   value). CONFIRMED.
6. **Part B exponents.** R/D = (unit) Q^(3 - 5s) at z = 1/6; T_i has q^(-5/6 + 3 - 5s) = q^(13/6 - 5s); A_i ~ P^(1/6)/log P;
   ratio P^(theta_omega + 2 - 5 beta); threshold (2 + theta_omega)/5 <= 3/5. g_eta(Y) = O_N(Y^N) as Y -> 0 by moving
   the line to Re s = N (H_eta and 1/L^S bounded there), so a slot longer than 1/5 has Z/q_p^5 <= Z^(1 - 5 l_i) and
   contributes O(Z^-N). The n >= 1 terms: D against the main term and R = (R/D) D against T, each at most Q^(-1/2)
   relative to the larger of the two leading terms, termwise. CONFIRMED.
7. **Cone table P5** recomputed by hand: h = t, M = 1 + l, B = 1 - t/6, H0 = 1 - 2t/3, ksig(1/2) = t/3 - 1. CONFIRMED.
8. **MS (10.13), (10.15), (10.18), (12.5), (16.13)** are quoted as printed.

## Errors and corrections

**E1 (Lemma C; the necessity is not established, and reading (b) drops a hypothesis).** Identity (3.2) is written
with weights w_k > 0 at every frequency, "with a row weight whose transform is a positive-definite kernel in the
column pair". The referee of `c6-unreflected-marks-kd23` (its E2) showed that after Poisson the weight at
frequency k is a function of q_c q_c' and cannot be positive definite in (c, c') for a bounded decaying transform.
What is available: the sixth-power frequencies summed over a give a separable weight (q_c q_c'/K)^(1/6), so that
block is a square (up to coprimality conditions); the remaining frequencies are not sign-definite. Dropping them
needs one of: (i) a bound for the non-sixth-power frequencies (for example GRH for the non-principal dual family,
as in the lane's "sufficiency" paragraph); (ii) the narrow-column-range expansion sketched in weakest step 1, which
requires the hypothesised energy bound for a class of modified weights and was not written. Consequences:
- (C1) is ARGUED with a named gap, as the lane says in section 9; it is not a fact.
- Reading (b), "an input k <= kappa implies beta_eta <= 1 - h_E/6 + kappa/2 directly, by positivity, with no high
  side", is not shown as stated: the input bounds the total energy, and the passage to the sixth-power block
  needs (i) or (ii). Correct form: "under (i) or (ii)".
- Reading (c), "dir0 at M >= 1 + l with h_E > 3 is false", and verdict item 3 ("the false input is the row-energy
  input, not (S) and not H0'") carry the same condition. The independent support (Lemma 3 for (S), Lemma 2 for
  the high side, Theorem B of c5) is also ARGUED in its high-side part. The attribution is supported at the
  level of exponents by two argued routes; it is not established. "Corrects c6-kd23 Proposition E" should read
  "replaces the attribution of c6-kd23 Proposition E (itself conditional, referee did not hold) by an argued one".
  The specific point against Lemma D(a) of c6-kd23 is sound at exponent level: the marks carry weight conj-phase
  eta(p), the u = 1 multiplier is -1 + O(Q^(-7/8)) (MS (16.13)), so the mark polynomial has modulus P^(1/2) at
  sixth-power frequencies and not P^(theta - 1/2); this is the same coherence that produces the l/6 in C(s).
- Verdict item 5 and section 5 ("that input by itself implies the conclusion") inherit the condition.

**E2 (verdict item 4, "decisive test").** The value 1/2 at (3, 3, 5) is (C2) evaluated by the LP: with the
necessity constraint inserted the minimum equals beta0 for every beta0 (referee runs at 11/20 and 7/10; the
lane's P3' says the same). The LP run confirms the arithmetic of (C2) and the absence of another escaping branch
under G = polar; it does not test Lemma C. "Decisive" should be removed.

**E3 (Lemma 2(c) for more than one slot).** Hmark = H prod_i (Q_i + S_i + D_i). A term with S in the slots of I and
Q in the others has amplitude l_I delta/2 + g_{I^c}. So g' = max over I of (l_I delta/2 + g_{I^c}), which lies
between max(g, l delta/2) and g + l delta/2 and equals max(g, l delta/2) only when the amplitude is proportional
to slot length (the ideal model g = l delta x). The LP is unaffected (it uses the ideal model at x = 1/2); the
sentence "g replaced by max(g, l delta/2)" in the verdict, in (2.1) and in proposed row Z15d should say
"in the ideal model; in general at most g + l delta/2". The row bound for the mixed terms (fewer character
slots) is not in MS Prop. 16.1 and stays ARGUED.

**E4 (normaliser thresholds; stale relative to the referee of `c7-repair-engine-map-r6`).** That report (its E1)
shows (2.2) fails for every sigma_0 <= 2/3 and every finite S (sup of abs(L^S(w, psi)) on Re w > 1 is infinite),
not only below 7/12. The entries "2.5 where (2.2) fails (7/12)" (verdict item 4, P4 note, section 6 last list)
should be removed or replaced: the (2.2) threshold coincides with the zero-free-reading threshold 2/3, and (2.2)
does not hold at sigma_0 = 2/3 itself. h_eff = 2 is then a supremum, not attained in the Prop. 2.1 format.

**E5 (wording, Part B).** "It vanishes identically in p when R/D = 1": the local factor 1 - R/D vanishes at a
given s only for those p with omega_eta(p) Q^(3 - 5s) = 1 (possible only on Re s = 3/5). What is shown is that
below (2 + theta_omega)/5 no lower bound for abs(B_i(s)) = abs(-A_i + T_i(s) + ...) is available; that it does
vanish there was not shown. "Lemma 3 for Re s >= 1/2": at Re s = 1/2 one has abs(R) = 1 and the local factors
H_p, Gmark_p have poles at R = 1; the product form of H_eta is on Re s > 1/2 (row Z24). Read "Re s > 1/2".

**E6 (labels).** Verdict item 1 says "derived"; the derived part is the identity (Corollary 1) and the size of
S_i. The line (2.1) is ARGUED-rel MS row estimates used outside the geometry (12.4) and outside
sigma_0 in [7/8, 1), z0 = 17/50 where MS states them (the lane's weakest step 2). "Derived (exponent, in the ideal
model)" is the accurate label.

## Observation (not an error)

The lane notes in one line that for ly < l the rescaled probe is empty. On the cone (t, t, 2t - 1) with t > 1 one
has ly = t < l. With a single slot (or any slot subset J of total length above ly) the rescaled terms vanish for
large Z (W_1 has annular support and q_s >= 1), so I_mark = I_mod as finite sums there. At such vertices the
"uncompensated" and the "compensated" probe are the same object; S_i then integrates to a negligible quantity and
the bound of Lemma 2(a) is an overestimate. This supports item 1 (the high side is not where the two probes
differ) without Lemma 2.

## Controls

No zeta-only mechanism is claimed, so no control has to fail. Checked by the referee: Lemma 1 holds with all unit
phases free (item 1), hence for unimodular and sign twists; (C1)-(C2) and the LP read the target only through
beta* (the abscissa of the reciprocal sum), hence do not separate zeta from THIN or U; Lemma C is quadratic in the
target, so for a Davenport-Heilbronn combination it holds termwise only, as the lane says. Backward heat, T-NR,
Beurling, zeta(s+a)zeta(s-a), phase-rotated transfer operator, theta^w: not applicable to an estimate-system
statement; not run by the lane or the referee.

## Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | Euler-factor identities are used, but no statement about zeros is built on them; Lemma 1 and Lemma C hold for unimodular twists |
| R2 | false | no conclusion about a function |
| R3 | false | nothing fails for the controls |
| R4 | false | no passage to the critical line; no probe with h > 1 is established |

## Surviving claim

EXACT / PROVED-rel MS (confirmed, including general unit phase): the marked-only probe of MS (12.5) has an exact
high representation of the form (10.5) with holomorphic correction built from Gmark_p = G_p + Q^-w H_p
= -(v^-1 - Q^-w) H_p + Delta_p; where slot quotients exist the slot factor is Q_i + S_i + D_i with the scalar prime
sum S_i of size P_i^(z0 - 1/2 + delta/2) on the retained contour; at the principal point
Bmark_p = -(1 - q)(1 - R/D)/(1 - D(1 - q) - R q) = B_p + q, so signal and normaliser H_eta are those of the
compensated probe. PROVED-rel classical bounds: the slot term T_i has relative size at most
P_i^(theta_omega + 2 - 5 Re s), absent for slots longer than 1/5; the factorisation (10.18) is available for
Re s > (2 + theta_omega)/5, unconditionally for Re s > 3/5. EXACT on MODEL inputs (reproduced independently):
proved rows with lx <= l give 8/9 at h = 1, 0.9051 at h = 1.1, above 1 from h = 3/2; with constraint (C1) the dir0
system returns exactly beta0, at the cone point (t, t, 2t - 1), t = 6(1 - beta0).
ARGUED, not established: the high-side line (2.1) beyond S_i (ideal model; general form in E3); Lemma C, which
needs control of the non-sixth-power dual frequencies (E1). Conditional on Lemma C: the h > 1 cone vertices have
one input (K + D for coherent marked rows) that implies their conclusion, and that input is false for h_E > 3.
No probe with h > 1 is established; the state of the 7/8 architecture is unchanged; nothing about zeros.
