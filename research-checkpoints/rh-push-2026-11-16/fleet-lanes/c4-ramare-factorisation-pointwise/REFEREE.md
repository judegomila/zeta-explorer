# REFEREE: c4-ramare-factorisation-pointwise (lens: general)

Referee verdict: **holds** as a precise obstruction (negative result). No statement about zeros of zeta is claimed and
none is established. Flags set by the referee: R1 false, R2 false, R3 false, R4 false. Six corrections below; none
changes the verdict. Literature statements were not opened by the referee either and stay RECALLED.

## 1. PROVED steps re-derived

| Step | Check | Outcome |
|---|---|---|
| Lemma D | Mellin inversion; residue of -zeta'/zeta(s+z) X^z W(z) is -X^(rho-s) W(rho-s) at zeros and +X^(1-s) W(1-s) at the pole; new line Re z = -1 for s = 1/2+it crosses no trivial zero; integral there is << log(2+abs t)/X because W decays faster than any power | confirmed |
| (D1) | zeros on the line: sum over gamma of abs W(i(gamma-t)) << log(2+abs t) | confirmed |
| (N1) | square expanded term by term: diagonal H X log X; cross terms -2H^2 X + H^2 X; singular-series sum H^2/2 - (H/2) log H + O(H) gives H X (log(X/H) + O(1)); division by 2H^2; X/H = T = X^(1/alpha) | confirmed; the constant is c = (C-1)/(2 alpha) |
| needed saving | X divided by X^(1/alpha) log X = H/log X, exponent 1 - 1/alpha in (0, 1/2); H >= X^(8/33) iff alpha >= 33/25 | confirmed |
| zero-side reading | checked directly on V, not through F: a zero at beta, gamma ~ T contributes about X^beta/T to psi(x+H)-psi(x)-H when H = X/T, so X^(2 beta+1)/T^2 to V, against H X log T = X^2 log T/T: X^(2 eta) <= T log T. Same threshold 1/2 + 1/(2 alpha): 3/4 at alpha = 2, 7/8 at alpha = 4/3 | confirmed (isolated zeros) |
| large-value count | abs b_n <= k!, sum abs b_n^2/n^2 <= k! (sum_p p^-2)^k <= k! (P log P)^-k; (T + P^k) P^-k <= 2; R << (TP)^(2a) exp(k log(k/log P)) log T. The support of P^k reaches (2P)^k, a factor 2^k = T^(o(1)) | confirmed with the stated o(1) |
| Prop 3a | sum_{p<=x} p^(-1-it) = log zeta(1 + 1/log x + it) + O(1) for all t; abs(s - rho) >= 1 - beta | term bound confirmed; see correction 3 |
| Prop 3b | abs((x+H)^rho - x^rho)/abs rho <= H x^(beta-1); int_1^x y^(rho-2) dy = (x^(rho-1) - 1)/(rho-1) | confirmed |
| Prop 3c | each prime changes D^2 by at most 2/p; rotation identity is termwise | confirmed |
| converse remark | RH => bound by Plancherel on Re s = 1/2 + delta with 1/zeta << t^eps; bound at H = X => (2^s - 1) zeta(2s)/(s zeta(s)) analytic in Re s > 1/2 => RH | confirmed |

## 2. Numeric rerun (different case)

Script: /tmp/c4ref/chk.py (independent code, run through `scripts/memcap.sh 8`, under 200 MB). Changes against the lane:
weight w(y) = (1 - u^2)^6, u = log y/log 2 (not the bump); X = 1300, 7000; t = 33.3, 101.3178, 150; 200 zeros.

- zeta: abs(prime side - zero side - pole term) = 4.2e-12, 2.1e-11, 6.9e-11 (X = 1300) and 3.5e-12, 7.5e-12, 3.0e-11
  (X = 7000), with abs P_X between 0.23 and 1.77. Lemma D confirmed, tighter than the lane's 8e-7.
- DH zeros recomputed from the Hurwitz form at 25 digits: 0.8085171824566 + 85.6993484853776i and
  0.6508300806097 + 114.1633427307570i (abs F < 1e-25 at both). The lane's value is correct.
- DH, zero 1, X = 2000, 6000, 20000, 60000: abs P_X(gamma) = 4.29, 6.73, 11.60, 12.67 against X^eta abs W(eta) =
  4.94, 6.93, 10.05, 14.11; maximum of abs P_X at distance > 3 from gamma: 4.18, 6.41, 10.25, 11.11. Fitted slope 0.333
  (lane: 0.264; eta = 0.3085).
- DH, zero 2 (eta = 0.1508): abs P_X(gamma) = 3.76, 0.66, 2.51, 2.31 against prediction 1.49, 1.76, 2.11, 2.49; slope -0.004.
  Not detected.
- max abs(Lambda_F(n))/log n: 27.18 to 7e4 (n = 55692; lane value confirmed), 51.76 to 1.3e5 (n = 111384).

## 3. Corrections

1. **DH measurement is weaker than the map row states.** The peak at zero 1 exceeds the largest background value in a
   16-wide window by 3 to 14 per cent only, the fitted slope moves from 0.264 to 0.333 with the weight and the scales,
   and the second off-line zero is not visible. The proposed MV-CAP row should read "Lemma D checked for zeta to 7e-11;
   DH peak at 0.8085 + 85.699i consistent in size, not separated from the background", not "checked on the DH zero".
   Lemma D for DH was not tested against a DH zero side. The background is the other DH zeros, including those with
   Re s > 1, whose terms have size X^(beta - 1/2) > X^(1/2); the growth of Lambda_F (51.8 log n by 1.3e5, still rising)
   is the same fact on the coefficient side. (D2) is not available for DH at any scale.
2. **Section 3, "reached only at the single scale X = T".** By the lane's own count, the factor P^(2a) is absent
   whenever P^k = T, so the exponent 2(1 - sigma) is reached at every scale X = T^(1/k), k bounded, through the k-th
   moment. At a general scale the available count is (TP)^(2a), larger than the T^(2a) quoted in the summary claim.
   The gap statement (needed 0, available at best 2(1 - sigma)) is unaffected. At sigma = 1/2 the condition
   X^(beta - 1/2) >= C log T cannot hold, so "gap 1 at sigma = 1/2" is a limit, not a case.
3. **Proposition 3a is a term bound, not a two-world comparison.** What is proved: the term log abs(s - rho) of one zero
   with beta < 1 is at most abs log(1 - beta) + O(1) uniformly in x. The local factorisation used has error O(log t),
   larger than the claimed O(1) change, so "the distance changes by O_beta(1) between a world with the zero and one
   without" is ARGUED. The conclusion needed (pretentious hypotheses and Halász-type bounds are unconditional theorems
   and hold whether or not such a zero exists) stands on Proposition 3b's last sentence alone.
4. **Section 2, "unconditionally via (D2) with X = T^alpha".** For X > T the mean value theorem gives O(X log X), not a
   form-factor bound, and F built from ordinates does not see beta. The unconditional object is V(X, H) or (N1); the
   zero-side reading is correct for that object (row 5 of the table above). Wording only.
5. **DH control: the stated reason is more than is needed.** The DH coefficients are periodic mod 5 with zero sum over
   a period, so every short-interval mean is O(1/h) at every x. The DH pass for the short-interval conclusion is
   trivial and does not need the RECALLED two-function Elliott statement. The conclusion "DH is not separated" stands.
6. **(D3) by-product.** The derivation is correct for zeros isolated from other off-line zeros of comparable real part
   (zeros with beta' <= 1/2 + eta/2 are harmless, so the isolation hypothesis can be weakened). It is the standard
   zero-detection argument with -zeta'/zeta and no mollifier; it should not be presented as new before a comparison
   with the density literature (Turán; Halász–Turán). The lane already excludes it from the score. Agreed.

Steps that remain ARGUED and were not upgraded by this review: the ceiling "saving at most log P/log Q" for the
factorisation, the sharpness construction for the exponent 2a (needs spacing larger than a constant, a rescaling by
sqrt(log P) to keep abs a_p <= 1, and R <= T), the cluster loss exp(-cK), the Beurling row.

## 4. Checks requested by the assignment

- RH assumed anywhere: no. The Goldston–Montgomery dictionary is labelled as conditional and is used only to translate
  the target, not to prove anything.
- Verified height restated: no.
- Known theorem presented as new: no counted claim. (D3) is flagged in correction 6.
- Controls where a zeta-only mechanism is claimed: none is claimed. The lane states that DH, Liouville, TW+, U/WT and FM
  pass; the referee confirms DH (trivially, correction 5), Liouville (the theorems are stated for it), FM and U/WT
  (Proposition 3c). E_a fails at size (coefficients n^(-a) sigma_{2a}(n) >= n^a, confirmed), not at multiplicativity.

## 5. Flags

- R1 false. The conclusions are linear and hold for the DH coefficients; multiplicativity is used on sparse prime
  ranges inside the proofs and separates nothing at the level of conclusions.
- R2 false. Every output is a mean square in t or x; the exceptional-set exponent is positive.
- R3 false. No control of size 1 is separated.
- R4 false. All statements are on Re s = 1 with tolerance (log x)^-A.

## 6. Surviving claim

The Ramaré/Matomäki–Radziwiłł factorisation supplies no every-window or one-sided statement. (i) Bandwidth alpha in
(1, 2) in the inertia chain is the averaged Hardy–Littlewood bound (N1), a power saving of exponent 1 - 1/alpha over
the sieve bound; proved savings are powers of log (RECALLED, H >= X^(8/33)); on V(X, H) the bound excludes isolated
zeros with beta > 1/2 + 1/(2 alpha). (ii) The outputs are mean squares on Re s = 1; the large-value count at threshold
P^-a is (TP)^(2a + o(1)), T^(2a) when P^k = T, against the exponent 0 needed to exclude a zero at a = 1 - sigma.
(iii) Pretentious and log-averaged statements are unconditional, invariant under finite modification and rotation, and
their tolerances (log x)^-A exceed the size x^(beta-1) of a zero term. DH, Liouville, bounded twists and unimodular
twists satisfy the method's conclusions. The DH numeric check is consistent in size only.
