# n4-char-one-stepanov: Stepanov auxiliary sections in the tropical structure sheaf of the scaling site

Verdict: **precise obstruction; lane closed at the first test (a)**. Nothing about zeros of zeta is claimed.

Files: `test_stepanov.py` (exact rational arithmetic, run through `scripts/memcap.sh 8`, about 10 s, a few MB), `test_stepanov.out`.

## 1. Plan and what is new relative to the map

Row T2 of OBSTRUCTION_MAP.md stops the Stepanov-Bombieri transplant at the multiplicity step: `f(s)^k = f(ks)` is false in characteristic 0. The proposal here: in the structure sheaf of the Connes-Consani scaling site (convex piecewise-affine functions with integer slopes, values in R_max), the identity `f^lambda = f^(lambda) o Fr_lambda` holds for every real lambda > 0, and is `f o Fr_lambda` when the coefficients are Boolean. The question is whether that identity supports a Stepanov count: a space of sections `F = max_i(a_i + lambda b_i)` (b_i Boolean-rational), larger than the space of their restrictions to the fixed locus, with forced break order above 1 per unit of degree.

Not in the atlas or in rows T2/T3: the explicit list of Boolean-rational sections, the factorisation lemma (L3), the break-order = degree count (L4), and the weight remark on C_p (R1). `cc-latest` recorded only "the scaling-site Riemann-Roch program has produced no inequality"; this lane says why a Stepanov count cannot be formed there.

Conventions. R_max = (R ∪ {-inf}, max, +). The power `f^lambda` is `lambda * f` (ordinary product). Fr_lambda acts on values by `v -> lambda v` and on [0, inf) by `x -> lambda x`. A section is "Boolean-rational" if its coefficients lie in B = {-inf, 0}, the fixed semifield of all Fr_lambda. The "order" of a section at a point is the jump of its slope (tropical zero = positive jump, pole = negative jump).

Source caveat: the facts quoted from Connes-Consani ("The Scaling Site", 2016; "Riemann-Roch for Spec Z-bar", 2022) are stated from memory and were not re-read in this lane. They are marked CLASSICAL (from memory). L1 to L4 below do not depend on them except where stated.

## 2. Work

### L1. Frobenius identity (PROVED; exact check)
For `f(x) = max_i(n_i x + c_i)` and lambda > 0: `lambda f(x) = max_i(n_i (lambda x) + lambda c_i) = f^(lambda)(lambda x)`, where `f^(lambda)` has coefficients `lambda c_i`. It equals `f(lambda x)` for all x iff the function is unchanged by `c_i -> lambda c_i`, in particular when all `c_i = 0`.
Check (a1): 320000 exact evaluations, 0 violations; 7656 random non-Boolean cases with `f^lambda != f o Fr_lambda`.

### L2. Test (a): the Boolean-rational sections (PROVED)
1. On [0, inf): `max_i(n_i x) = (max_i n_i) x` because x >= 0. The Boolean-rational sections of slope at most N are exactly `x -> n x`, 0 <= n <= N, and -inf. They form a chain; none has a break at any x > 0. Check (a2): 561 families, 0 violations.
2. Global sections of the scaling site. With the restriction maps `f -> f(n x)` (CLASSICAL, from memory: H^0 = R_max, constants), the invariant Boolean sections are {-inf, 0}. If instead the action is twisted by the value Frobenius (`f -> n^{-1} f(n x)`), the invariant sections are the homogeneous ones, again `x -> n x`. Under either convention the list is the same or smaller.
3. On the periodic orbit C_p = R_+^*/p^Z: a section satisfies `f(p lambda) = f(lambda)`; Fr_p acts trivially on the points of C_p. Boolean-rational means `p f = f o Fr_p = f`, so `(p - 1) f = 0`, so `f = 0` (or -inf). This holds inside every `H^0(D)`: the Boolean part of `H^0(D)` is {-inf} or {-inf, 0} for every divisor D, while `Dim_R H^0(D) = deg D` for deg D > 0 (CLASSICAL, from memory: Connes-Consani Riemann-Roch on C_p, `Dim_R H^0(D) - Dim_R H^0(-D) = deg D`). Twisting by D makes the space of sections grow with deg D but adds no Boolean-rational section.

Outcome of test (a): the Stepanov b-space is `{n x}` on the chart and `{0}` on C_p and globally. By the task's own criterion the lane closes here. L3 and L4 show what that does to the count, so the row is recorded with a reason and not only a list.

### L3. Factorisation lemma (PROVED)
Let `F(x, lambda) = max_i(a_i(x) + lambda n_i x)` with a_i arbitrary sections (integer slopes) and Boolean b_i = n_i x. Suppose the break locus of F contains `{lambda = r} x I` for an interval I of x. Then two dominant indices i, j satisfy `a_i(x) - a_j(x) = r (n_j - n_i) x` on I; so on I, `a_i = alpha(x) + m_i x` with integers m_i for the indices involved, r = (m_i - m_j)/(n_j - n_i) is rational, and

`F(x, lambda) = alpha(x) + x * Phi(lambda)`, `Phi(lambda) = max_i(m_i + n_i lambda)`.

The break in lambda is a break of the one-variable tropical polynomial Phi with integer coefficients. The x-direction (the "curve") contributes the factor x and nothing else. Consequences:
- A single section can vanish along a range of lambda: `F = x * Phi(lambda)` with Phi breaking at each prime power in the range. The fixed locus of Fr_lambda (empty unless lambda = p^k, then all of C_p) is of codimension 1 in the (point, lambda) space and F breaks on it. Check (c): `max(x, lambda x / q) = x max(1, lambda / q)`.
- With weights log p this section is `x * lambda * int_1^lambda psi(t) t^{-2} dt`: the second antiderivative of d psi. Its degree up to lambda is psi(lambda). The statement "zeros = degree" for it reads psi = psi.

### L4. Test (b): break order against degree (PROVED; exact enumeration)
1. One-variable count. A tropical polynomial `Phi(lambda) = max_{0<=i<=d}(m_i + i lambda)` has total break order on lambda > 0 at most d, with equality when all roots are positive. A root at u/v in lowest terms has multiplicity divisible by v; roots at integers can be simple. Enumeration for p = 2, 3: 111100 polynomials of degree <= 4, coefficients in [-9, 0]: max (break order on {p^k})/degree = 1, max (all breaks)/degree = 1. The required ratio above 1 does not occur.
2. No arithmetic selection. For any finite set S of positive integers there is Phi of degree |S| with simple breaks exactly on S (`m_i = -(s_1 + ... + s_i)`). Checked for S = prime powers <= 64 (degree 27), S = non-prime-power composites <= 40 (degree 20), S = {2..30} (degree 29). The space of sections of degree d has d + 1 parameters and prescribing N breaks costs N conditions: solvable iff N <= d, for every S. The count does not distinguish prime powers from any other set of integers.
3. On C_p. For any piecewise-affine f with `f(p lambda) = f(lambda)`, the sum over one period of `lambda * (jump of f')` is 0 (summation by parts; proved in two lines, and exact check: 3000 random functions each for p = 2, 3, max |sum| = 0, zeros = poles in 3000/3000). So a section of `H^0(D)` has total break order at most deg D: ratio at most 1. The break divisor is a finite atomic measure; the fixed locus is the whole circle of length log p. A section cannot break on all of C_p, and a break density k per unit length would cost degree k log p with no step forcing k > 0.

### Why the Stepanov mechanism has no tropical counterpart (PROVED for items 1, 2; ARGUED for 3)
Stepanov over F_q uses three facts. (i) `b^q = b o Fr` for b with coefficients in F_q, and the space of such b in L(nP) has dimension about n. (ii) The map `sum a_i b_i^q -> sum a_i b_i` has a kernel by a dimension count. (iii) An element of the kernel built from p^mu-th powers a_i vanishes to order p^mu at each rational point, because `b^q - b(P)^q = (b - b(P))^q`.
1. (i) fails in size: the Boolean b-space is the chain {n x} (L2); on C_p it is {0}.
2. (ii) has no content: by L3 the kernel condition (max attained twice) reduces to linear relations `a_i - a_j = r (n_j - n_i) x`, which can be imposed for any rational r at cost one unit of degree per unit of break order (L4).
3. (iii) fails: there is no subtraction in R_max, so `b = b(P) + (b - b(P))` is unavailable; `max(b, b(P))` is a different function. A p^mu-th power multiplies existing break orders by p^mu and multiplies the degree by the same factor. The forced multiplicity per unit degree stays 1.

### R1. Weight remark on C_p (ARGUED; not used above)
The condition `(p - 1) f = 0` for Fr_p-fixed sections matches the Connes-Consani Jacobian of C_p, Z/(p - 1) (CLASSICAL, from memory). This is the point count of a multiplicative group over F_p (p - 1 = |1 - p|), and C_p = R_+^*/p^Z has the shape of a Tate curve G_m/p^Z. Frobenius weights on such an object are 0 and 2; no weight-1 (size sqrt p) eigenvalue is attached to a single orbit. The zeros of zeta are not carried by any single C_p or finite set of them; consistent with the map's statement that local conditions at single primes are empty for zeta.

## 3. Controls

No inequality was derived, so no control can be violated. Named-step outcomes:

| Control | Tropical data seen by the construction | Outcome |
|---|---|---|
| Sign twist eps_n Lambda(n), and U | same orbits C_p, same lengths log p, same H_p | Identical at every step L1-L4. A valid argument would have to fail here at an archimedean Riemann-Roch / Poisson step; no such step is reached, because the count stops at L2 before any archimedean input. |
| Davenport-Heilbronn | weights not supported on prime powers | L4.2: the count accepts any integer set S, so it accepts the DH support as well. It does not fail for DH; it is empty for DH and for zeta alike. |
| E_a = zeta(s+a) zeta(s-a) | weights p^(+-a): not Boolean, not integer slopes | Excluded from the sheaf at L1 (non-integer slopes). Exclusion by definition, not by an inequality. |
| Backward heat | no orbit data changes | Not seen by any step. |
| Function-field fake 1 - 5T + 5T^2 | no curve | Over F_q the separating step is existence of sections with F_q coefficients (row T3). Here the analogue of that existence step fails for zeta itself (L2), so the tropical setting sits on the fake's side of the test. |

## 4. Pivot (one, as allowed): integer sections on compactified Spec Z

The adjacent object with a real finite section count is Connes-Consani Riemann-Roch on compactified Spec Z (CLASSICAL, from memory): `H^0(D)` for an Arakelov divisor is a set of rationals bounded at each place, and its size is about `e^{deg D}`. A Stepanov section there is a nonzero integer of size `e^d` divisible by every prime in a range, which gives `theta(range) <= d`. This is the Chebyshev / Gelfond-Schnirelman method (integers from integrals of integer polynomials on [0,1]). CLASSICAL, from memory and not recomputed here: in one variable the method has a ceiling strictly below the prime number theorem constant (Gorshkov; integer Chebyshev constant of [0,1]), and no version gives an error term of square-root size. The reason matches L4: one integer section of height e^d can absorb prime factors of total log-size d, ratio 1, and multiplicity gain would need the missing Frobenius. Not pursued further; no computation run for the pivot. Status: OPEN only in the sense that the multivariable Gelfond-Schnirelman variant is not excluded by anything written here; it is an estimate method, not a structural one.

## 5. Row for the obstruction map

| Row | Mechanism | Stop | Status | Controls | Lane |
|---|---|---|---|---|---|
| T2' | Stepanov count in the scaling-site structure sheaf (char-one Frobenius `f^lambda = f o Fr_lambda`) | Boolean-rational sections are `x -> n x` on [0, inf) and constants on C_p and globally; every section breaking along fixed loci factors as `alpha(x) + x Phi(lambda)` with Phi a one-variable integer tropical polynomial; break order = degree exactly (ratio 1), for any integer set S, so no bound and no selection of prime powers. The identity `f^lambda = f o Fr_lambda` is available but the multiplicity step needs subtraction, absent in R_max. | PROVED (author; unrefereed); Connes-Consani inputs from memory | sign twist, U, backward heat: unseen; DH: accepted by the count (empty); E_a: excluded by definition; ff fake: tropical setting fails the existence-of-sections step for zeta itself | `n4-char-one-stepanov` |

## 6. Step labels

- L1 Frobenius identity: PROVED, exact check.
- L2 list of Boolean-rational sections: PROVED (chart, C_p); global-sections statement and action convention CLASSICAL from memory, with the alternative convention covered.
- L3 factorisation: PROVED.
- L4 break order = degree, arbitrary S, degree-zero on C_p: PROVED, exact enumeration (MEASURED part: the enumeration ranges stated).
- Riemann-Roch on C_p, Jacobian Z/(p-1), Riemann-Roch on Spec Z-bar: CLASSICAL, from memory, not re-read.
- R1 weight remark: ARGUED.
- Pivot ceiling (Gorshkov): CLASSICAL from memory, not recomputed.
- Any bound on psi(x) - x: none obtained. OPEN as before.

## 7. Three weakest steps

1. The Connes-Consani inputs (restriction maps of the structure sheaf, the normalisation of orders on C_p as `lambda * jump` in `lambda H_p`, `Dim_R H^0(D) = deg D`, Jacobian Z/(p-1)) are from memory. L2.2 covers both action conventions, and the degree-zero lemma in L4.3 was proved for the normalisation used here; a different normalisation of the order would change constants, not the ratio-1 conclusion, but this was not checked against the paper.
2. "Stepanov section" was formalised as `max_i(a_i + lambda b_i)` with tropical vanishing = break locus, and "Boolean-rational" as coefficients in B. A different dictionary (for instance sections over the square of the scaling site with the Frobenius correspondences as divisors, or a non-idempotent lift such as Witt-type or S-module coefficients where subtraction partly returns) is not covered by L3. The claim is about the structure sheaf named in the assignment.
3. The pivot paragraph is a recalled classical ceiling with no computation in this lane, and the multivariable Gelfond-Schnirelman variant is not addressed.
