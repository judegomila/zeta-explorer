# REFEREE: e2-gl3-cover-cuspidal-rows (2026-11-18)

Adversarial check of `RESULT.md`. Claimed verdict: precise obstruction.
Referee outcome: **the verdict holds for the two row models tested; it is not a statement about the actual
Whittaker coefficient of the GL(3) cover series.** All numerical claims re-run reproduce. Four corrections below
(one of scope, two of labels, one of wording). No step assumes RH, none restates verified height, and no known
theorem is presented as new. No zero statement is made.

Referee run: one process, `scripts/memcap.sh 8 .venv-arb/bin/python -c ...` (no file written), 51 s, largest
allocation 40 MB. Independent code: theta series by completed squares (Q1 = w^2 + 11y^2 + 11z^2 with w = z mod 2;
3 Q2 = u^2 + 44(y^2 - yz + z^2) with u = y + z mod 3), c(n) to 2 x 10^6; a_p of 11a by point counts on
y^2 + y = x^3 - x^2 - 10x - 20 for p < 240000 (not the eta product); own Kronecker symbol.

## 1. Steps re-derived

| step | label in RESULT | referee |
|---|---|---|
| Brubaker-Friedberg Thm 4.1, eq. (16), intro quotation, Thm 6.5, "all maximal parabolics of type A are cominuscule" | CLASSICAL, opened | Confirmed against `dl/bf.txt` (lines 108-111, 171-176, 911-925, 1503). See correction C1 for a hypothesis not reported. |
| Lemma 1, symbol-type rows have sign-blind Gram matrix | PROVED | Confirmed: (chi_c(m) x_m)(chi_c'(m) conj x_m) = chi_c chi_c'(m) abs(x_m)^2. Row scaling drops out after normalisation. |
| Lemma 1, a_I is not symbol x column weight | PROVED (stated as "measured" + support) | Confirmed by the support argument: c(cm) = 0 unless chi_{-cm}(11) = -1 (or 11 divides cm); rows with (-c/11) = +1 and -1 force x_m = 0 on complementary classes of m, so no single nonvanishing symbol times x_m reproduces it. The support indicator itself is (1 - (-c/11)(m/11))/2, a sum of two symbol-type terms; this does not rescue symbol type because the signs of c(cm) are not a symbol (section 3c). |
| Lemma 2, "absorbs Moebius" requires R1-R3 | PROVED as equivalence | Not a proof. See C2. |
| Lemma 3, row series entire | CLASSICAL-recalled + ARGUED | Argument is correct for the unrestricted row: sum over all m of c(cm) psi(m) m^{-s} with periodic psi is a finite combination of additive twists of g, and g(z + a/q) decays at 0 because g is cuspidal at every cusp. See C3 for the restricted rows. |
| Shimura relation c(n p^2) = (a_p - (-n/p)) c(n) - p c(n/p^2) | PROVED by exact check | Formula matches Shimura's T(p^2) at weight 3/2 (lambda = 1). Re-run below with other primes. |
| Section 4, shift 1/2 | via e1 Lemma S | Confirmed: in the unitary normalisation c~(d0 p^2 m) = (lambda_f(p) - chi_{-d0 m}(p) p^{-1/2}) c~(d0 m); Shimura's series sum_k c(d0 k^2) k^{-s} = c(d0) L(s, f)/L(s, chi_{-d0}) is L(s + 1/2, f)/L(s + 1/2, chi) after centring f. Classical (Shimura 1973), cited as such. |
| Root number w_d = chi_d(-11), conductor 11 d^2, AFE formula | CLASSICAL-recalled | Correct for (d, 11) = 1. |

## 2. Numerical re-runs with different cases

| check | RESULT | referee (different case) |
|---|---|---|
| g, first terms | q^3 - q^4 - q^11 - q^12 + q^15 + 2q^16 + q^20 - q^23 | identical from the independent enumeration; plus-space support holds to 2 x 10^6 |
| Shimura relation | p = 3, 5, 7, 13, 17: 180896 cases, 0 mismatches | p = 19, 23, 29, 31, 37, 41, 43 (a_p = 0, -1, 0, 7, 3, -8, -6 from point counts): 17509 cases, 0 mismatches. Also c(121 n) = c(n): 16528 cases, 0 mismatches |
| Waldspurger ratio L(E_d, 1) sqrt(abs d) / c(abs d)^2 | abs(d) <= 10^4: 1264 values in [2.917633233861, 2.917633233897] | 10^4 < abs(d) <= 1.3 x 10^4, truncation 18 abs(d), a_n from point counts: 380 values, min = max = 2.917633233877 to 12 decimals; 40 with c = 0 all have abs(L) < 1e-6; w = -1: c = 0 in 415 of 415 |
| prime direction (b) | D_0 = 3, ..., 71: abs(rho) <= 0.039 | D_0 = 88, 91, 104, 115, 136, 163, 203, 223, 355, primes to 2 x 10^6 / D_0: rho with chi_{-D_0}(p) in [-0.027, +0.047], each within 1.3 x 1/sqrt(n). Planted control (adding -chi(p) c~(D_0) to the data) gives abs(rho) = 0.49 to 0.94 with the predicted sign, so the statistic has power |
| correlation with mu(d) chi_d(m) (a) | 6 to 27 columns m < 60 | D <= 2 x 10^6 (n = 278622), 37 new columns m in [61, 139]: max / rms z = 2.56 / 0.91; random signs 2.70 / 1.13; chi alone 0.26 / 0.11. Correlation of c~ with mu: 0.00045 against 1/sqrt(n) = 0.0019 |
| Gram spectrum (c) | block d < 500: sv_1 = 1.404; one random-sign control 1.471 | new block 500 < d < 1000, m < 2000: sv_1 = 1.387, off-diagonal rms / max 0.032 / 0.279; signs removed 4.754. Random-sign control over 8 seeds: sv_1 in [1.446, 1.510]. Original block, 8 further seeds: [1.460, 1.510] against 1.404 |

All measured statements in sections 3 and 4 of RESULT reproduce. The square-class correlations in the pivot
table are consequences of the exact relation: predicted -1 (p divides d_0), about -(share)^{1/2} for a_3 = -1,
+(share)^{1/2} for a_5 = 1, about -0.89 for a_7 = -2; the deviations from 0.707 (for example 0.624 at d_0 = 3,
p = 5 with 1413 columns) are explained by the Euler factor at p of the central value, not by an error.

## 3. Corrections

**C1 (scope; not reported in RESULT).** Brubaker-Friedberg section 2 assumes F is a totally complex number
field containing the 2n-th roots of unity; for the double cover that is F containing Q(i). Theorem 4.1 as opened
does not apply over Q. The numerical object (weight 3/2, level 44, over Q) is an analogue of the inducing data
of that theorem, not an instance. Together with weakest step 1 of RESULT (H and the coefficient index for
Levi GL(2) x GL(1) not derived), the link between the theorem and the two row types is by analogy at two
places: the field and the specialisation. The verdict should read: obstruction for twist rows and for
product-index rows of a genuine GL(2) form over Q; the GL(3) cover series itself is not computed.

**C2 (label).** Lemma 2 is labelled PROVED "as an equivalence of formulations". The step from
A_c = B_c / L(s, chi_c) to sum over p <= x of a(c, p) chi_c(p) log p = -(a(c, 1) + o(1)) x needs a prime-sum
bound for B_c that is not stated; and "a row gives a signal only if its row series has a pole" is a property of
the scalar model of `r3-method-limit`, not a theorem. Correct label: MODEL / ARGUED. The stop does not depend on
it: within the model, an entire row series gives h = 0.

**C3 (gap between Lemma 3 and the rows tested).** Lemma 3 covers the row over all m. The rows in tests (a) and
(c) are restricted to squarefree labels coprime to the row. The squarefree restriction is an infinite Moebius
sum over e of series supported on e^2 m, and entire-ness of the result is not shown. By the Shimura relation any
singularity introduced comes from the square direction, i.e. the mechanism of section 4 (reciprocal at shift
1/2 in the variable 2s), which lies further left, so the conclusion "no reciprocal at shift 0" is not affected;
the sentence "the row series is entire" should be limited to the unrestricted row.

**C4 (wording).** "The Gram spectrum equals that of the random-sign control" is not exact. On both blocks the
true-sign sv_1 (1.387, 1.404) is below the range of 16 random-sign controls (1.446 to 1.510), and the
off-diagonal rms is 0.032 against 0.036. The true rows are slightly closer to orthogonal than random signs,
consistent with the better-than-square-root cancellation RESULT notes for the "chi alone" column. The direction
is against a coherent set, so the conclusion stands; the statement should be "not above the random-sign control".

## 4. Controls

No zeta-only mechanism and no zero statement is claimed, so no control can pass wrongly. Referee re-ran the
random-sign control (16 seeds, two blocks) and the signs-removed control: outcomes as in RESULT apart from C4.
The zeta(s+a) zeta(s-a) control (Cohen-type Eisenstein form) is reported in RESULT as not computed; the referee
did not compute it either. The "DH-type" entry is multiplication of the product-index array by a symbol, which
is a relabelling test and not a Davenport-Heilbronn function; RESULT says "not excluded", which is the correct
reading. The third requirement (failure for the controls for a structural reason) is not met, as RESULT states.

## 5. Other checks

- RH is not assumed anywhere. Nonnegativity of central values is observed numerically (and is a theorem of
  Waldspurger / Kohnen-Zagier for this family), not inferred from RH.
- Nothing restates verified height.
- Waldspurger / Kohnen-Zagier / Gross and the Shimura relation are cited as classical; no novelty is claimed.
- The statistical statements exclude a correlation of order 1; they do not exclude one below about 0.002
  (RESULT weakest step 2 says this).
- The identification of the square class with h/r = 1/2 is by count only (RESULT weakest step 3); unchanged.

## 6. Surviving claim

For a genuine weight-3/2 form over Q (the Kohnen-plus form of 11a, c(n) exact to 2 x 10^6, validated against
1644 central values): twist rows are of symbol type with sign-blind Gram matrix; product-index rows c(dm) over
squarefree labels show no correlation with mu(d) chi_d(m), prime-direction statistic 0 within 1/sqrt(n) where
a planted absorption term gives 0.5 to 0.9, and a Gram spectrum not above the random-sign control; the
unrestricted row series is entire; the only coherent set is the square class, whose relation is the classical
Shimura relation with the Moebius sign at shift 1/2 (closed by e1). In the scalar model this gives abscissa 1.
The transfer of these two row types to the Eisenstein series on the double cover of GL(3) is by analogy
(field hypothesis of the opened theorem not met over Q; H and the coefficient index not derived). Genuine cusp
forms on the GL(3) cover and the Gauss-sum-weighted double sum remain not computed. No zero statement.
