# REFEREE (adversarial, lens: general): c18-u6c-gl3-cover-whittaker-constants-method

Date: 2026-11-19. Referee scratch (not part of the lane): `/tmp/ref_c18u6c/` (`refjob.py` = `job.py` with a different
index list; `ref2.py` = (C3) against other twins; both run locally through `scripts/memcap.sh 8`; no server use).

## Verdict

**Holds, with corrections.** The claimed verdict (precise obstruction; nothing about zeros of zeta; score 0; all four
flags false) stands. Every step labelled PROVED was re-derived and is correct relative to its recalled input. The
server numbers were reproduced at X = 1e5 and the lemma was confirmed at 23 indices the lane did not use. Six
statements need correction (section 3); none changes the verdict. No step assumes RH, none restates verified
height, and the cubic half is not presented as new (the lane says "no new object"; see correction 6 on labelling).

Flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false.

## 1. Re-derivation of the PROVED steps

1. **Lemma K count (given the free-orbit criterion).** With f - rho = (a, b, c), rho = (2, 1, 0):
   l1 = b - a - 1, l2 = c - b - 1. Distinct entries mod 3 force b - a, c - b nonzero with nonzero sum, so
   (b - a, c - b) = (1,1) or (2,2), giving (l1, l2) = (0,0) or (1,1) mod 3. Checked on all six permutations:
   (0,1,2), (1,2,0), (2,0,1) give (0,0); (0,2,1), (1,0,2), (2,1,0) give (1,1). Confirmed.
   n = 3, r = 2: l = b - a - 1 in {0, 1}. Confirmed. n = 2, r = 3: no triple of distinct residues. Confirmed.
   n = 4, r = 3, l2 = 0: c = b + 1, a in {b + 2, b + 3}, l1 in {1, 0}. Confirmed. Orbit counts 24/6 = 4 (n = 4) and
   60/6 = 10, 2 modulo translation (n = 5). Confirmed.
2. **Lemma C, "one simple reflection".** (2,0,1) -> (0,2,1) swaps the first two entries and moves the class
   (0,0) to (1,1). Confirmed. The value statement itself is RECALLED + MEASURED, as labelled.
3. **Lemma D (ii).** The commutator prod_{i != j} (t_i, t'_j) = (det t, det t') prod_i (t_i, t'_i)^(-1) follows from
   the cocycle prod_{i<j} (t_i, t'_j); for n = 2 the twist (det, det)^(2c) is trivial, so the choice c = 0 is
   harmless here. Gram matrix I + J over F_2 has rows (0,1,1), (1,0,1), (1,1,0): rank 2, kernel (1,1,1). Tensor
   with the rank-2 Hilbert pairing: rank 4, so T~/Z(T~) has order 16, Lagrangian index 4, Whittaker dimension 4,
   indexed by valuations mod 2 modulo (1,1,1), that is by (l1, l2) mod 2. Confirmed.
4. **Opened quotations.** `dl/fg.txt` lines 604 to 606 (n = 2: all non-degenerate coefficients zero), 667 to 669
   (n = 3: tau(m, 1) support and tau(a m^3, 1) = |m| tau(a, 1)), 793 to 798 (n = 4) read as quoted.

## 2. Numeric rerun with different cases (local, X = 1e5, 28224 moduli, 9601 primes, 22 s)

Same code path, new index list. S(X; 1, 1) = 1.40908e6 at X = 1e5, equal to the lane's value. Internal checks:
reciprocity mismatches 0, twisted multiplicativity 4.7e-16, Gauss recheck 5.2e-10.

| index | class mod 3 | abs R at X/8, X/4, X/2, X | R q^(1/6)/conj gamma at X |
|---|---|---|---|
| P31^(1,1) | (1,1) | 0.553 0.558 0.555 0.555 | 0.9833+0.0005i |
| P37^(1,1) | (1,1) | 0.533 0.540 0.541 0.540 | 0.9855+0.0011i |
| I11^(1,1) (inert, norm 121) | (1,1) | 0.436 0.438 0.441 0.442 | 0.9830 |
| P13^(4,4) | (1,1) | 0.644 0.643 0.642 0.635 | 0.9737-0.0044i |
| P13^(3,0) | (0,0) | 1.024 1.003 0.996 0.999 | |
| P31^(1,1) P37^(3,0) / P31^(1,1) | (0,0) at P37 | | 0.9892 |
| P31^(1,0) | (1,0) | 0.037 0.031 0.026 0.021 | |
| P37^(1,0) | (1,0) | 0.029 0.022 0.017 0.013 | |
| P13^(4,0) | (1,0) | 0.120 0.085 0.056 0.044 | |
| P31^(2,0), (2,1), (2,2) | | 0.0034, 0.0005, 0.0011 at X | |
| P37^(2,0), (2,1), (2,2) | | 0.0030, 0.0015, 0.0009 at X | |
| I11^(1,0), (2,0), (2,1), (2,2) | | 0.0070, 0.0010, 0.0018, 0.0006 at X | |
| P13^(2,5) | (2,2) | 0.0036 0.0025 0.0016 0.0009 | |
| P31^(1,0) P37^(1,0) | | 0.0017 0.0051 0.0090 0.0097 | |

Diagonal cocycle: R(P31 P37)/(R(P31) R(P37)) = 1.020 at argument -120.4 degrees with (P31/P37)_3 = w^2;
R(P37 P37b)/(R(P37) R(P37b)) = 1.026 with symbol 1. Conjugate selection: dividing by gamma(p) instead of
conj gamma(p) gives non-real ratios (-0.954-0.239i at P31, -0.223-0.960i at P37).

Result: support rule, periodicity, value conj(gamma(p)) q^(-1/6) up to a real factor 0.97 to 0.99, and the
cocycle are reproduced at new split primes, a new inert prime and higher exponents.

## 3. Corrections required

1. **The size and trend figures are specific to the lane's 34 indices.** "Vanishing classes at most 0.015 at 1e5 /
   0.012 at 2e5" does not extend: P31^(1,0) is 0.021 and P13^(4,0) is 0.044 at X = 1e5 (both falling), and
   P31^(1,0) P37^(1,0) rises from 0.0017 to 0.0097 over the four X values. "Kappa rising with X at every prime" is
   false at other indices: P31^(1,1) goes 0.9883, 0.9841, 0.9833 and P13^(4,4) goes 0.9850, 0.9737. The data
   support "vanishing classes small and of decaying trend, nonzero classes within 3 per cent of
   conj(gamma) q^(-1/6)", not a limit kappa = 1 and not a uniform bound. The record line should say
   "kappa 0.97 to 0.99, not resolved" in place of "0.989 to 0.992, rising".
2. **The cubic-character twin is theta data, not "the diagonal array of no theta function".** By reciprocity
   (m/p)_3 conj(gamma(m)) is the coefficient array of Patterson's series at index p; its smoothed sum has main term
   proportional to gamma(p). Measured (`ref2.py`): main-term argument 146.57, 45.03, -95.95 degrees for p = P7,
   P13, P31 against arg gamma(p) = 146.37, 44.63, -97.02. Consequently "(C3) fails for the twins" is
   prime-dependent: the twist by (m/P13)_3 satisfies (C3) at all 398 grid points. The conjugate character twists
   have no main term (lead 0.0005 to 0.0018 against 0.032 to 0.038). The lane's conclusion that (C3) is a residue
   identity and not a separating inequality is strengthened; the sentence and the control row need rewording.
3. **n = 4 comparison is across covers.** The lemma is stated at twist c = 0; the opened source states uniqueness
   for n = 4 only for c odd (`dl/fg.txt` lines 238 to 239, 616). "Permuted transitively by scalars: unique model"
   is not justified at c = 0. Only the support statement for l2 = 0 is confirmed by the opened text. Lemma K
   therefore reproduces three statements (n = 2, n = 3 r = 2, n = 3 r = 3 l2 = 0) plus a support statement on a
   different cover, not "four".
4. **(K3) is not a defined test.** eps(p, q) is not specified; by section 5.2 the genus sums equal a period times
   a coefficient, or products of cover coefficients, so vanishing of a single 2 x 2 determinant in K is not
   equivalent to the functional being a pure tensor in a restricted product of 4-dimensional spaces (needs the
   full 4 x 4 class arrays at p and q and a fixed normalisation). Register it as "statement to be formulated".
   The count "about 1e5 classes for D_max = 1e4" is not derived (class numbers of ternary genera grow linearly
   in the determinant, which suggests more) and should be computed before sizing a run.
5. **Label collision.** `MAP_ROW.md` proposes row "Z24"; the map already has Z24 (normaliser cap) and Z24b. Use a
   free label. "Same array as rows Z14/Z15" should read "the cubic Gauss-sum array used by the rows Z14/Z15
   family": those rows record exponent bounds, not an array.
6. **Labelling of the cubic half.** The opened source states that all tau(r1, r2) for n = 3 "were computed by
   Proskurin and by Bump and Hoffstein". The full support and the value at (p, p) are therefore a known theorem
   that was not opened; "PROVED" for the full support should read "PROVED relative to a recalled criterion;
   CLASSICAL, source not opened". The normalisation differs from the opened one (periodicity factor |m| there,
   1 here); the lane says so only implicitly ("no power of the index removed").

## 4. Controls

No zeta-only mechanism is claimed, so there is no zeta control to run. The lane's formulable controls were rerun
with different cases (section 3 item 2): multiplicative twists keep modulus, support and cocycle; (C3) does not
separate theta from its twins in a prime-independent way. The nine zeta controls are recorded as not formulable on
the cover; that is a gap in the record, not a pass.

## 5. Flags (strict)

- R1 false: multiplicativity enters only as the reciprocity cocycle and periodicity, shared by all twists.
- R2 false: no height-uniform or every-window statement.
- R3 false: twins pass every relation; the one candidate inequality is a residue identity.
- R4 false: all statements concern coefficient arrays right of the abscissa.

## 6. Surviving claim

Nothing about zeros of zeta. Cubic theta on GL(3): support (0,0)/(1,1) mod 3 follows from a recalled
Kazhdan-Patterson criterion (count verified; l2 = 0 case confirmed by the opened source) and is consistent with
smoothed double sums at X = 1e5 and 2e5 on 34 + 23 indices; tau(p, p)/tau(1, 1) = kappa conj(gamma(p)) q^(-1/6)
with kappa real, 0.97 to 0.99, limit not resolved; periodicity at p^3 and the reciprocity cocycle on the diagonal
hold to 1 to 3 per cent. This is a known array (Proskurin, Bump-Hoffstein; not opened). The sign candidate (C3) is
a residue statement of Patterson's series whose truth for twists depends on arg gamma(p). Double cover: theta has
no Whittaker coefficient (opened); local Whittaker dimension 4 (verified from the recalled commutator);
squarefree-class constants are not computed; the method is a plan and (K3) is not yet a defined statement.
Score 0.
