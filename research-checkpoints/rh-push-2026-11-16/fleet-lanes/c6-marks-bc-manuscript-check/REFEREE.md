# REFEREE (lens: general) for c6-marks-bc-manuscript-check/RESULT.md

Date 2026-11-18. Claimed verdict: precise-obstruction. Referee verdict: **holds, with wording corrections (E1-E5)**.
The unconditional core (Lemma H, Corollary H1, Lemma S, Liouville signal) is confirmed. Everything about the low
input (N) is relative to an identity and a high side that have no source at h > 1; RESULT says so. No statement
about zeros of zeta is made or supported. Flags: R1 false, R2 false, R3 false, R4 false.

## Confirmed (re-derived by hand unless marked)

* **(7.6) reading.** paper.txt line 3105 prints "ap = α(p) η(p)3" with a lost superscript; b_p^3 = a_p^2 and
  line 516 (alpha(a) = a/abs(a)) fix a_p = alpha(p)^3 eta(p)^3, so a_p^2 = (alpha eta)^6(p). R = a_p^2 Q^(4-6x-6z).
* **Lemma H.** From (7.11) at j = 0, rho = 1, W = V = q: P* = (1+q)(R-D)/(1-R),
  P = (1+q)(1 - D(1-q) - Rq)/((1-q)(1-R)), H_p = (1-q^2)(1 - D(1-q) - Rq)/((1-R)(1-D)). Both factorisations
  (1 - q(R-D)/(1-D); (1-Rq)(1 + Dq(1-R)/((1-D)(1-Rq)))) are identities. Convergence: q abs(R) = Q^(2-6 sigma),
  so E_eta converges absolutely for sigma > 1/2; Dq, DqR give Q^(-1-sigma), Q^(2-7 sigma), so E'_eta converges
  for sigma > 3/7. Local non-vanishing on sigma >= 1/2: abs(D)(1-q) + abs(R)q <= Q^(-1/2)(1-1/Q) + 1/Q < 1. Correct.
* **Corollary H1.** psi_eta = (alpha eta)^6 has infinity type of frequency 6, so L(w, psi_eta) is entire, has no
  zero on Re w = 1 or Re w = 0 (gamma factor Gamma(w+3) has no pole there), and its nontrivial zeros are symmetric
  about Re w = 1/2. (a)-(d) follow. Holomorphy of H_eta on the closed half-plane uses the second factorisation and
  the open zero-free neighbourhood of Re w = 1 for L(6s-2, psi). Correct.
* **Lemma S.** (i) => (ii): the Mellin part of the proof of MS Prop. 2.1 uses (2.2) only for boundedness of H
  on Re s >= 2 (true here) and for division by H (not needed for the quotient). (ii) <=> (iii): E_eta and the
  deleted factors do not vanish in Re s > 1/2. (ii) => (i): Landau lemma + rectangles avoiding zeros by
  c/log abs(t) + maximum principle gives abs(g) <= exp(C log abs(t) loglog abs(t)), dominated by the Gaussian. Correct.
  The lemma is a standard Landau-type statement; RESULT labels the tools classical and does not present it as new.
* **Theorem B1'.** (1a) from Lemma S with B = 1/2, C(1/2) = lx/2 at h = 3 (checked: C(s) = s - 1 + lx/2 + h/6
  reproduces C(s) = s - 2/3 of MS Part I). (2a) from H1(d). (2b): eps* = min(sigma, (beta*-1/2)/2), Lemma S at
  B = beta* - eps* > 1/2, non-vanishing of L(w, psi) on Re w >= 1: beta* <= 2/3 and top-layer resonance.
  Correct as PROVED-rel (ID_g), (HI_g(b)). (2c) is open; no argument given or known.
* **Theorem B'.** Mellin convergence on Re s > 1/2 - e', identity theorem on the connected domain where H/L is
  meromorphic (Re s > 3/7), zeros of zeta_F on the line (>> T log T distinct, Selberg) against O_S(T) zeros of
  H_eta on the line (only deleted factors). Correct as PROVED-rel, for the principal target, with strict slack.
* **Liouville signal.** With H_lambda defined by the Lemma H product, the integrand
  Z^C(s) H_lambda zeta_F^S(s)/zeta_F^S(2s) has only the simple pole s = 1 in Re s > 1/2, residue non-zero
  (L^S(3, alpha^6) E_lambda(1) != 0), polynomial growth. f_lambda = c Z^(C(1)) + O(Z^(C(1/2)+eps)). Correct.

## Numeric checks rerun with different cases (`scripts/memcap.sh 8 .venv-arb/bin/python`, mpmath dps 25)

* Lemma H at 12 complex points (Q = 4, 7, 13, 31; Re s in (0.55, 0.95); random unit phases for eta(p) and
  a_p^2), H_p built by summing the rows of table (7.16) (j = 0) as explicit series, not from (7.11):
  max abs(series - closed form) and abs(closed - second factorisation) = 6.5e-26.
* L(w, alpha^6) on Z[omega] by an incomplete-gamma expansion written here (coefficients sum a^6/(6 N^3),
  Lambda(w) = (2 pi/sqrt 3)^-w Gamma(w+3) L(w)): root number +1 (split-parameter defect 1.4e-26; -1 gives 0.43);
  Lambda is real on Re w = 1/2; sign changes at gamma' = 6.51020659, 10.6440252, 12.4712982. The first agrees
  with r3-tnr-control; the other two are new cases. Hence zeros of H_1 at s = 7/12 + i 1.085034, 7/12 + i 1.774004,
  7/12 + i 2.07855 (E_eta converges and does not vanish there). (2.2) is false for sigma_0 < 7/12: confirmed.
* `lp6.py` was read, not rerun. Its T4 is the identity h = 1 - lx + l.

## Errors and corrections

E1 (headline wording). "The equivalence fails in the direction low input => GRH" and "does not hold at manuscript
   level" are too strong as sentences. Nothing refutes (N) => GRH. What is established: the derivation through
   Prop. 2.1 is unavailable below 7/12 (PROVED), the replacement conclusion is (R) (PROVED-rel), and (R) => GRH is
   OPEN. If L(s, eta) and L(6s-3, (alpha eta)^6) have no common zeros (expected, unproved), (R) is GRH. The map
   entry should read "not derivable; conclusion (R); (R) => GRH open", as section 9 of RESULT in fact proposes.

E2 ("unconditional down to 2/3" and "h <= 2"). Two imprecisions. (a) (2.2) as written is not verifiable at
   sigma_0 = 2/3 itself: sup over Re w > 1 of abs(L^S(w, psi) - 1) is not small for any finite S (the prime sum
   diverges as Re w -> 1+). Prop. 2.1 applies literally for each sigma_0 > 2/3 with S depending on sigma_0; at
   2/3 and below one needs the Lemma S variant. (b) 2/3 is the limit of what can be proved about H_eta, not the
   location of the obstruction: the binding abscissa is (3 + Theta_psi)/6 in [7/12, 2/3], Theta_psi the supremum of
   real parts of zeros of L(w, psi_eta). The three zeros computed above lie on 7/12. "Unconditional" here still means
   relative to (ID_g) and the high side, which have no source at h > 1; the sentence in verdict item 3 should say so.

E3 (EXACT label on T3 and A2). The values 13/15, 6/7, 5/6 are bisection outputs slightly above the stated
   fractions (0.8666666666686, 0.857142857144936, 0.8333333333357587; A2: 114532461227/137438953472). They are
   upper approximations of an infimum, not exact LP outputs. Same kind as c5 referee item E4. Label: MEASURED
   to 1e-11, or prove the infimum.

E4 (Lemma S (iii), parenthesis). "no zero has Re rho >= max(B, 2/3)" should read "no zero has Re rho > B and
   Re rho >= 2/3". A zero with Re rho = B >= 2/3 is not excluded by (i).

E5 (scope of sections 3-5 for the vertex probes). Every h = 3 vertex listed has l >= 2, so every one is a marked
   or compensated probe. RESULT's weakest step 2 states that the signal of such a probe was not derived and that
   the slot multiplier has a term a_p^2 Q^(3-5s) that is not small for Re s <= 3/5 (the identity for B_p was
   re-derived here: B_p = (R/D - 1)(1-q)/(1 - D(1-q) - Rq) - q). Therefore "the long-marks branch closes" is
   established for the model in which the principal row of the vertex probe is c_S A_eta f_eta with f_eta as in
   (2.3). That hypothesis is inside (ID_g); the verdict lines should carry it explicitly. This does not reopen the
   branch: no source gives a different signal either, and an extra L(., alpha^6)-type factor would add zeros, not
   remove them.

No error found in a PROVED step.

## Checks requested by the task

* RH/GRH assumed: only as the explicit hypothesis of implication (1). Lemma H, H1, Lemma S, B', Liouville: no.
* Verified height: not used.
* Known theorem presented as new: no. Lemma S is standard and labelled so; the normaliser formula is credited
  to r3-tnr-control.
* Controls: no zeta-only mechanism is claimed, so no control separation is required for the verdict. Liouville
  signal recomputed by hand (above). Lemma H and Lemma S hold verbatim for any completely multiplicative
  unimodular target, so nothing in the lane separates zeta from sign-twisted or unimodular-twisted primes;
  RESULT states this. The remark in section 7 (a unimodular control with a resonant zero would satisfy the signal
  criterion at B = 1/2 while violating GRH) is correct as a statement about Lemma S and is the reason (2c)
  cannot be closed inside the format. THIN: undecided, as stated. DH, backward heat, T-NR, theta^w, Beurling,
  zeta(s+a)zeta(s-a), phase-rotated transfer operator: not run by the lane; not needed for an obstruction verdict.
* Source table: spot-checked lines 1 (Part I constants), 2 ((2.2) at lines 381-460), 3/5 (Prop. 15.3 states
  Z^(lx/2+b/12) at (12.4) only), (10.1)-(10.2) (holomorphy claimed on Re s > 7/8 only). Liu I/II entries not
  re-read.

## Requirement flags (set by the referee)

R1 false. R2 false. R3 false. R4 false. The lane is an obstruction inside an estimate system; it establishes none
of the four properties.

## Surviving claim

Unconditional: H_eta(s) = zeta_F^S(2)^-1 L^S(6s-3, (alpha eta)^6) E_eta(s) on Re s > 1/2 with E_eta non-vanishing;
H_eta has infinitely many zeros with 7/12 <= Re s < 2/3 (three located on Re s = 7/12 for eta = 1), so hypothesis
(2.2) of MS Prop. 2.1 is false for sigma_0 < 7/12; f_eta << Z^(C(B)+eps) iff H_eta/L^S(s, eta) is holomorphic on
Re s > B (1/2 <= B < 1); the Liouville signal has main term c Z^(C(1)), c != 0. Relative to the unsourced identity
(ID_g) (including: the vertex probe's principal row is c_S A_eta f_eta) and high side: GRH => (N) => (R)
[beta* <= 2/3 and top-layer zeros are common zeros with L(6s-3, (alpha eta)^6)]; (R) => GRH is open, not refuted;
for h > 3 and strict slack at the principal target no low exponent below C(1/2) holds (Selberg). Theorem C as
stated for sigma <= 1/3 only. The "equivalent to GRH" sentence of c5 Corollary B1 is replaced by this chain; the
long-marks branch gives no input weaker than its conclusion in that model. No statement about zeros of zeta.
