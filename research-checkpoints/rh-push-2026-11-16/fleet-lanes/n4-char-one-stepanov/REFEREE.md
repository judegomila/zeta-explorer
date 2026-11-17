# REFEREE (general, adversarial): n4-char-one-stepanov

Refereed file: `RESULT.md` in this directory. Claimed verdict: precise-obstruction, closed at test (a).

Referee verdict: **the obstruction verdict survives; one PROVED step (L3) is false as stated and must be restated.** L1, L2, L4 confirmed. No bound on psi(x) - x, no statement about zeros, no use of RH, no restatement of verified height. Under the campaign rule (a PROVED step not confirmed as written), `holds = false` for the claim as written; the repaired claim below holds.

## 1. Re-derivation of each PROVED step

**L1 (confirmed).** `lambda * max_i(n_i x + c_i) = max_i(n_i (lambda x) + lambda c_i)` for lambda > 0, since multiplication by a positive real commutes with max. Equals `f(lambda x)` when all c_i are in {0, -inf}. Elementary; nothing to correct.

**L2 (confirmed, with a scope note).**
- Chart: for x >= 0, `max_i(n_i x) = (max_i n_i) x`. Correct. The restriction "0 <= n" is not needed and not justified in the text (negative integer slopes are also Boolean); it does not change the conclusion (a chain, no break at x > 0).
- Global: a convex function with `f(nx) = f(x)` for all n >= 1 is constant; Boolean constants are {-inf, 0}. Confirmed directly, without the Connes-Consani citation.
- C_p: a convex function on (0, inf) with `f(p lambda) = f(lambda)` is bounded, hence constant; so even before the Boolean condition the convex sections of C_p are constants, and the Boolean ones are {-inf, 0}. This is a shorter route than the `(p-1) f = 0` argument in the text and does not depend on how "Boolean-rational on C_p" is defined. The `(p-1) f = 0` argument is valid only under the author's definition (fixed by the value Frobenius); it is a definition, not a derived fact. For sections of `H^0(D)` (poles allowed) the conclusion again depends on that definition.

**L3 (NOT confirmed as stated; local form confirmed).** The text concludes `F(x, lambda) = alpha(x) + x * Phi(lambda)` from the hypothesis that the break locus contains `{lambda = r} x I`. What the argument proves: for the two indices i, j dominant along that line (after shrinking I so the pair is constant), `a_i - a_j = k x` with k an integer, zero constant term, and `r = k/(n_j - n_i)` rational. That gives `F = alpha(x) + x * max(m_i + n_i lambda, m_j + n_j lambda)` only in a neighbourhood of the line. It does not give the global factorisation, and it does not give it even for a section breaking along several lines `lambda = r_s`.

Counterexample (exact, run R5 below): `n_i = i`, `a_0 = 0`, `a_1 = -2x`, `a_2 = -5x - 1`, `a_3 = -10x - 1`. All a_i are affine with integer slopes. For every x > 1/2, F breaks along `lambda = 2` and `lambda = 5` (two horizontal lines) and also along the curve `lambda = 3 + 1/x`. A function of the form `alpha(x) + x Phi(lambda)` has only horizontal break lines in lambda, so F is not of that form on any x-interval. The chain `a_i = alpha + m_i x` breaks at the pair (1, 2), where `a_1 - a_2 = 3x + 1`.

Repair. The count in L4 does not need L3. For each fixed x > 0, `lambda -> F(x, lambda)` is a maximum of affine functions with slopes `n_i x`, so its total slope jump is at most `(max n_i - min n_i) x`: break order at most degree, pointwise in x, for arbitrary `a_i(x)` (R6 below: 20000 random cases, maximum ratio exactly 1). L3 should be restated as a local statement ("near a horizontal break line, F is `alpha + x *` a two-term tropical polynomial; r is rational"), and the sentence "the x-direction contributes the factor x and nothing else" should be removed or limited to the linked indices.

**L4 (confirmed).**
1. `Phi = max_{0<=i<=d}(m_i + i lambda)` is convex with slopes in [0, d]: total jump at most d. A break between indices i < j at `lambda = u/v` needs `m_i - m_j = (j - i) u/v`, so v divides j - i for each adjacent pair of active indices, hence the multiplicity. Correct.
2. `m_i = -(s_1 + ... + s_i)` with s increasing: line i meets line i-1 at s_i, envelope is convex because s is increasing. Correct for any finite set of positive reals, not only integers.
3. `f(p lambda) = f(lambda)` gives `lambda f'(lambda)` periodic; then the sum over one period of `lambda * jump(f')` equals `[lambda f']` over the period minus `f(pa) - f(a)`, both zero. Correct.

Inconsistency of wording: the claim line says "at most 1, never above"; the map row in section 5 says "break order = degree exactly". The proved statement is "at most, with equality when all roots are positive". The row should say "at most".

**Section "Why the Stepanov mechanism has no tropical counterpart".** Item 2 cites L3 for "the kernel condition reduces to linear relations"; with L3 restricted to its local form, item 2 holds per break line, and the ratio statement follows from the pointwise count above. Item 3 is labelled ARGUED by the author; agreed, it is not a proof that no other multiplicity mechanism exists.

**L3 consequence with weights log p.** The section `x * lambda * int_1^lambda psi(t) t^-2 dt` has second lambda-derivative `sum Lambda(n) delta_n / n`, order Lambda(n) at n under the `lambda * jump` normalisation. Verified by differentiation. Its lambda-slopes are real, not integers, so it is outside the integer-coefficient family of L3/L4; the text should say so. It is a tautology (psi = psi), as the author states.

## 2. Independent numeric check (different cases)

Run through `scripts/memcap.sh 8 python3 -c ...` (exact Fractions, single process, about 15 s, < 50 MB; inline script, no file written). Cases differ from the author's (p = 5, 7 in place of 2, 3; sign-mixed coefficients; other sets S).

| Run | Content | Result |
|---|---|---|
| R1 | L1, 3000 random cases, lambda rational in (0, 40], including lambda < 1 | 0 violations |
| R2 | L4.1, p = 5 and p = 7: 111132 polynomials of degree <= 3 with coefficients in [-14, 3], plus 4000 random of degree 5..9, coefficients in [-400, 0] | max (breaks on {p^k})/deg = 1; max (all breaks)/deg = 1; multiplicity at u/v divisible by v: True |
| R3 | L4.2 for S = prime powers in (64, 300] (deg 52); S = integers <= 120 coprime to 5 (deg 95, a Davenport-Heilbronn-type support); S = squares <= 900 (deg 30) | simple breaks exactly on S in all three |
| R4 | L4.3 on C_5, C_7, 2000 random periodic functions each | max abs(sum of orders) = 0 |
| R5 | L3 counterexample above at x = 1, 2, 7/3, 10 | breaks at lambda = 2, 3 + 1/x, 5 (4; 7/2; 24/7; 31/10): middle break moves with x |
| R6 | pointwise count with arbitrary a_i(x), 20000 random cases | max total break / degree = 1 |

The author's `test_stepanov.out` was read and is consistent with the script. Its check (c) tests only the tautological section `x max(1, lambda/q)`; it does not test L3.

## 3. Controls

The result claims no zeta-only mechanism and derives no inequality, so there is no step for a control to violate. Checked what could be checked:
- Davenport-Heilbronn: R3 confirms the count accepts a DH-type support (all n coprime to 5) exactly as it accepts prime powers. The construction is empty for DH and for zeta alike, as stated.
- Sign twist: the construction sees only the break set and integer orders; a sign-twisted weight has the same support. Unseen, as stated. (Negative weights would be poles; that changes D, not the count.)
- Backward heat: no orbit datum changes. Unseen, as stated.
- The function-field-fake row ("the tropical setting sits on the fake's side") is a remark, not a control outcome; it should be labelled ARGUED.

## 4. RH, verified height, novelty

- No step assumes RH or uses verified zeros.
- Nothing is presented as a new theorem. L1, L2, L4 are elementary facts of tropical algebra (the root count of a tropical polynomial; the degree-zero property of a principal divisor on a tropical circle). The lane's content is the observation that they close the transplant, which is a lane record, not a publishable result.
- Connes-Consani inputs (order normalisation `lambda * jump` with values in `lambda H_p`, real-valued degree, `Dim_R H^0(D) - Dim_R H^0(-D) = deg D`, Jacobian with the Z/(p-1) invariant) agree with this referee's recollection of "The Scaling Site" but were not re-read here either. No literature search was run. They remain CLASSICAL, from memory. The steps confirmed above (L1, chart and constant parts of L2, L4) do not depend on them.
- Pivot: recalled only, no computation; the author says so. The one-variable Gelfond-Schnirelman ceiling (Gorshkov) is classical. It is not a result of this lane.

## 5. Limits of the obstruction (unchanged from the author's weak steps, sharpened)

1. The obstruction covers one dictionary: sections `max_i(a_i + lambda n_i x)` with tropical vanishing = break locus. It says nothing about sections over the square of the scaling site with Frobenius correspondences, or about non-idempotent coefficients (S-modules, Witt-type lifts) where subtraction partly returns. The row must not be read as "no characteristic-one Stepanov argument exists".
2. On C_p the emptiness of the b-space is stronger than stated and more trivial: convex sections are constants before any Boolean condition. The whole content on C_p is in `H^0(D)`, where "Boolean-rational" is a chosen definition.
3. Break order at most degree is a property of every one-variable convex piecewise-affine function. The lane shows the count has ratio at most 1; it does not identify which additional structure would be needed, beyond "a multiplicity step".

## 6. Required corrections

1. Restate L3 as local (two dominant indices near one horizontal break line); delete the global factorisation claim or add the hypothesis that consecutive dominant indices are linked along every break. Counterexample: section 1 above.
2. Replace the dependence of L4 / "item 2" on L3 by the pointwise count (fixed x, total slope jump at most `(max n - min n) x`).
3. Map row T2': "break order at most degree (ratio at most 1)", not "= degree exactly"; replace "every section breaking along fixed loci factors as alpha(x) + x Phi(lambda)" by the local statement.
4. Note that the log p weighted section has real slopes and lies outside the integer family.
5. Label the function-field-fake line ARGUED.

## 7. Surviving claim

In the structure sheaf of the scaling site with the dictionary of this lane: Boolean sections are `x -> n x` on [0, inf) and constants on C_p and globally; for every fixed x the lambda-break order of `max_i(a_i(x) + lambda n_i x)` is at most its lambda-degree; any finite set of positive integers is the simple break set of a degree-|S| polynomial, so prime powers are not selected; on C_p zeros = poles. No Stepanov count with ratio above 1 can be formed in this dictionary. No bound on psi(x) - x. Precise obstruction for this dictionary only.
