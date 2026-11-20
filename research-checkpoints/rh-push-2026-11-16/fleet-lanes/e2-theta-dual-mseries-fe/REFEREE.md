# REFEREE: e2-theta-dual-mseries-fe

Adversarial referee pass, 2026-11-18. Only this file was written. Checks were run locally, single process, through
`scripts/memcap.sh 8 .venv-arb/bin/python`, reading only `tmp/sextic/data/sf_1e7.npz` (scratch scripts in `/tmp/ref_e2/`,
not kept in the repo). The large data modules were not imported. The compute server was not used.

**Ruling: the verdict "precise obstruction" holds, in a narrower form than written.** The obstruction part
(PROVED-model) is confirmed. The positive part ("a reflection in m exists in classical form") is not established
by Lemma 1 and has to be read as a granted hypothesis. One of the two "exact checks" of Lemma 1 is a tautology.
No statement about zeros is made, RH is not assumed, verified height is not used, and no abscissa below
0.874886647 is claimed. Suggested strength: 0.55 (was implied about 0.8).

---

## 1. Steps re-derived and confirmed

| step | label in RESULT | referee outcome |
|---|---|---|
| Reading of MS Prop. 5.1 at j_p = 1: B_p(x) = chi_p(x)^(-3); omega_{p,1} = tau^-_{p,1} tau^+_{p,3} chi_p(eps_p)^(-3); sigma_p = lambda^2 c/p; eps_p = -(lambda^3 c/p) sigma_p^(-1) = -lambda; factor conj(alpha(c))^2 with c = c_F r | PROVED-rel MS | Confirmed against `~/lean-deps/qrh-verify/paper.txt` lines 1390-1560 (items 1-3 and (5.3)). |
| (a) local-to-global product | exact check | Confirmed with a different case: new seed, 800 nodes at each depth 2, 3, 4, 5 and all 52 at depth 6 (RESULT used depths 2-4). Max error 2.5e-15. Negative control added: without the pair phase chi_p(m/p)^(-2) the error is 1.73, so the check has power. |
| g = Th3 K6m Th3 = (-5T-3V, S+2T+V, 8T+5V), g^2 = 1, X o g = 3T + 2V | PROVED-model | Confirmed by hand and by an independent script. x' = x + 2T + V; with T = t, V = v - 1/2 (centres of `n1-tube-hull` 2.2) this is 2t + v - 1/2 = 2x + z - 3/2, so x' = 3x + z - 3/2. Correct. |
| Cartan matrix, orders (K6m K6 = 3, K6 Th3 = 2, Th3 K6m infinite), determinant -6 | PROVED-model | Confirmed. The matrix was recomputed from the action on the functionals S, V, T. |
| Growth 1, 3, 5, 7, 9, 12, 16, 21, 28, 37, 49, 65, 86 (339 elements) | PROVED-model | Confirmed, and extended to length 16: ..., 114, 151, 200, 265 (1069 elements). |
| Lemma 3: X o w - X is a nonnegative combination of T, S, V for all w in W_D; chambers lie in x >= 3/2 | PROVED-model | Proof confirmed: X o K6 = X + S, X o K6m = X + V, X o Th3 = X, so X is antidominant for the simple system (S, V, T); the cone statement is the standard Kac-Moody fact. <K6, Th3, g> = <K6, Th3, K6m> as matrix groups (K6m = Th3 g Th3), so it does not matter which generating set is used. Check extended: 0 of 1069 elements (length <= 16) have a negative coefficient; smallest inf x is 3/2; 20,000 random points of random chambers give min x = 2.34. |
| g raises x on every old piece | stated for low, high, theta-dual | Confirmed and extended: on all six <K6, Pm> pieces the functional (2T + V) o w has nonnegative coefficients (2,0,1), (2,1,1), (2,1,2). |
| Divisor images S + 2T + V = 1/6, S + 10T + 6V = 1/2; pole at v = 5/6; working-point arithmetic (1.92, 1.29, z near -1.46); K6 image of the high region has z' = 1 - w < 0 and x' = x + w + z - 1 > 2 | PROVED-model / by hand | Confirmed. |
| Table of section 2.2 and null quantiles | MEASURED | Every entry matches `post3.log` (R values, counts out of 60, onsets). |
| K-type table (c) | MEASURED | Matches `lemma1.log`. Not rerun. |

Controls. No zeta-only mechanism is claimed: section 6 states that the new step is identical for every eta and for
a DH combination. That is consistent with what Lemma 1 contains (Gauss-sum algebra, no target). There was
therefore no zeta-only step to run controls against. The DH and sign-twist rows of section 6 are arguments, not
runs; they are labelled as such.

---

## 2. Errors and overstatements

### E1. Check (b) of Lemma 1 is a tautology in (s, mu). [substantive for the evidence count, not for the identity]

The identity is

    gamma_1(m) gamma_3(m) conj(chi_m(s)) chi_m(mu)^3 = G(m) conj(chi_m(4^5 s mu^3)) gamma_1(m),

and G(m) is DEFINED in `alib.py` as conj(chi_m(4)) gamma_3(m). Since chi_m(4) is a cube root of unity and
chi_m(mu)^3 is real, both sides are equal term by term for every s and mu, by multiplicativity of chi_m alone.
"Checked for five pairs on 2.29 to 2.62 million moduli: max error 1.7e-15" therefore tests nothing about s or mu;
the 12 million evaluations are one identity evaluated five times. The only content of (b) is that the prefactor is
a function of m mod 4.

Referee run (different pairs, norms (37, 73), (31, 37), (1, 1), (73, 109)): the identity holds to 1.7e-15 with
index 4^5 s mu^3, and equally with 4^5 s mu^9, 4^11 s mu^3 and 4^2 s mu^3; it fails (error 1.73) with mu^1, mu^5
and 4^1. So:

* The index is determined only modulo sixth powers. "4^5" is not canonical; 4^2 = 16 gives the same series.
* The factor 4^5 is not needed at all: in the table gamma_3(m) alone is a function of m mod 4 (one value per
  class in all 12 classes), and so is chi_m(4) alone. The statement can be written with index s mu^3 and the class
  function gamma_3(m). Nothing in the model depends on this, but the phrase "at index 4^5 s mu^3" suggests more
  structure than there is.
* G is a class function to 4.1e-9 (table precision), not to 1e-15. "Checked exactly" should read "checked in
  double precision".

What Lemma 1 actually rests on: twisted multiplicativity of Gauss sums (check (a), CLASSICAL, confirmed with
power) and the fact that the normalised quadratic Gauss sum over Z[omega] depends on m mod 4 (CLASSICAL,
confirmed on the table). The label PROVED-rel MS is acceptable for the squarefree statement. It is a
rearrangement of classical identities applied to (5.3), not a new identity.

### E2. "So a reflection in m exists in classical form" does not follow from Lemma 1. [main overstatement]

Three separate gaps, each sufficient:

1. **Non-squarefree m carry full-size coefficients that are not Kubota coefficients.** For p^2 exactly dividing m,
   Prop. 5.1 gives j_p = 2, B_p(x) = chi_p(x)^(-4) and omega_{p,2} = tau^-_{p,2} tau^+_{p,4} chi_p(eps_p)^(-4), of
   modulus 1. A sextic Gauss sum in the modulus m with index prime to p vanishes at p^2. So the theta-dual
   m-series is not the Kubota series; it is the Kubota series on the squarefree part of m times further factors on
   the square, cube, fourth-power (j_p = 4, Ramanujan type) and fifth-power parts, with coprimality conditions
   between the parts. The scale also changes: c = c_F r with r the product of the active primes, not m. A
   functional equation of one factor is not a functional equation of the m-series. RESULT lists "m with square
   factors" as not covered, but the verdict and item 1 of the summary state the reflection as existing.
2. **The K-type is not fixed.** Candidates A and B differ in the gamma factor and in whether there is a pole at
   2/3; which one applies was not traced (weakest step 1). The measured statement "no X^(2/3) term for l != 0" is
   compatible with A but was run only at y = 1.
3. **The functional equation is CITED with a known gap** (the explicit version assumes mu_12 in the field, false
   for Q(omega)), for a series with infinity type alpha^(-2) and finite S-data that are not written out.

Correct label for the existence of the reflection: OPEN (ARGUED on the squarefree part). Because sections 3-4
grant the reflection and still find no gain, the obstruction does not depend on this.

### E3. The linear map K6m uses only the main conductor exponent; the secondary piece dominates in the reflected chamber. [model caveat not stated]

Section 1.2 records that the stripped series has, at a prime of mu, a main piece of exponent 3 and a secondary
piece of exponent 5 with weight N(p)^(-1/2) (same in `cubic-r2-conductor-verdict.md`, table at line 191 and line
411). In the reflected chamber the reflected variable satisfies V' > 1/2, and there N(p)^(5V' - 1/2) exceeds
N(p)^(3V') (this holds for V' > 1/4). So the convergence condition of the reflected series in the mu-variable is
governed by the secondary piece, and the true first reflected chamber is a proper subset of the model chamber
K6m(R_+). The same holds for K6 (main exponent 1, secondary 5; dominant for |S| > 1/8).

Consequences:

* First-generation chambers: a subset of a set in x >= 3/2 is in x >= 3/2. The obstruction is unaffected.
* "The m-reflection moves x by 2t + v - 1/2" and "rank-3 Weyl group" are statements about the main-piece model.
  The Coxeter relations and Lemma 3 for longer words are not statements about the actual series.
* Lemma 3 does not extend automatically. Referee test: entering the secondary exponents as additional linear maps
  (K6 with V -> V + 5S; K6m with S -> S + aV, T -> T + bV, a in {1, 5}, b in {3, 5}) and composing words of
  alternating type up to length 8 gives 37,682 words out of 210,681 with a negative coefficient in X o w - X. That
  enlarged set is not a set of holomorphy pieces (it ignores the affine shifts and the validity of each step), so
  it refutes nothing; it shows that "every chamber" is a property of the main-term group and not of any model that
  includes the secondary pieces.

A second instance of the same kind: d(mu) is supported on mu = n b^3 (MS (5.2)), and chi_m(mu)^3 = chi_m(n b)^3,
so on the b-part the conductor is N(b)^3, not q_b^9 as the single exponent T -> T + 3V assigns. The n-part is
binding, so the first chamber is unchanged.

### E4. "Hull abscissa = input" is PROVED-model only under an ARGUED piece rule; the summary drops the qualifier.

Section 4 is headed "[PROVED-model; the piece rule is ARGUED]", but item 3 of the summary, section 9 and the
claimed verdict give "hull abscissa = input" as PROVED-model without it. The rule matters: X o (Pm g) = -5T - 3V
(referee run), so a single application of Pm after g sends x to minus infinity, and `group.log` itself reports 143
(length 6) and 865 (length 9) images with x unbounded below in <K6, AW, g>. The statement that survives without
the rule is: every chamber of W_D = <K6, Th3, g> applied to R_+, and g applied to each of the 8 pieces of
`n1-tube-hull`, lies in x >= 3/2 (the latter checked here). The exclusion of words with Pm after g rests on
Theorem T / Corollary T2 of `n1-tube-hull`, which is the actual reason no tube can pass the input abscissa; the
hull table of section 4 adds no information beyond that theorem plus Lemma 3.

Also in section 4, item 2: the chambers are said to be joined to R_+ only by meromorphic continuation. If so they
are not holomorphy pieces at all, and the table row "W_D chambers: 3/2" is an upper bound on what could be added,
not a computed hull. This is consistent with the conclusion but should be stated.

### E5. Minor points

* Section 6 and the claimed verdict compare the cubic R = 0.02-0.09 with "null min 0.156". 0.156 is the minimum of
  the order-6, |l| = 1 window. The comparator for the cubic l = +-1 rows is the order-3, |l| = 1 window: minimum
  0.185. The calibration still passes (0 of 60).
* The calibration is established only for l = +-1. At l = 0 with y != 1 the cubic series does not fall
  (R = 0.37, 0.25, 0.26, at or near the 2% null quantile) and this is unexplained. So the one-sided test is not
  validated in K-type 0 away from y = 1, in either order.
* "Sextic undecidable" is correctly stated. The explanation offered (conductor in window units exceeds the usable
  X) is ARGUED; the alternative that the candidate gamma factor is wrong is not excluded by the data.
* 60 null draws cannot resolve a tail below 1/60; "0 of 60" supports p < about 0.05 per series after allowing for
  20 series, as RESULT says for the one marginal sextic row.
* "Hyperbolic rank-3 Weyl group": as a Coxeter group W_D has exponents (3, 2, infinity), the (2, 3, infinity)
  triangle group, which is hyperbolic. As a generalised Cartan matrix it is indefinite but not of hyperbolic type
  in Kac's sense (the {V, T} submatrix is already indefinite). "Indefinite type", as in section 3, is the accurate
  term.
* Section 1.3 states the K-type result as "the pole at 2/3 is present only in K-type 0". The measurement is: the
  fitted X^(2/3) constant is 5.7 standard errors for l = 0 (class-resolved sum of z^2 = 251) and within the
  20-draw null for l = +-1..+-6, at y = 1, norm <= 1e7. It is a non-detection for l != 0, not a proof of absence.

---

## 3. Checks against the campaign rules

* RH assumed anywhere: no.
* Verified height restated as a result: no.
* Known theorem presented as new: no, with the reservation of E1 (Lemma 1 is classical Gauss-sum algebra applied
  to (5.3); it is labelled relative to the manuscript, and Lemma 3 is labelled classical).
* Three requirements: RESULT states that the new step is target-blind and is not an attack. Agreed.
* End point: consistent with the campaign's known end point (nothing passes from the region right of 1 to the
  strip); here specifically because the only x-moving reflection raises x on every region where holomorphy is
  known.

---

## 4. Surviving claim

On squarefree m prime to 6 L s mu, the m-dependence of the theta-dual scalar MS (5.3) at j_p = 1, multiplied by
the low-side factor conj(chi_s(-m)), equals (function of m in finitely many classes) x conj(alpha(m))^2 x
gt_1(s mu^3, m) (index modulo sixth powers). This is PROVED-rel MS from classical Gauss-sum identities and
confirmed numerically on the table with a check that has power.

If a functional equation of Kubota type is GRANTED for that series, then in the main-term affine model the
reflection acts by x' = 3x + z - 3/2, the group <K6, Th3, g> is infinite of indefinite type, and every chamber
w(R_+), and the image under g of each of the 8 pieces of `n1-tube-hull`, lies in x >= 3/2 (PROVED-model, checked
to word length 16). No region with x below the input abscissa is produced.

Not established: that the theta-dual m-series (all m) has a functional equation; its K-type; the S-data; any
statement about the sextic series from the dual-length test; the piece rule; the behaviour of the model with
secondary pieces. No abscissa below 0.874886647. No statement about zeros. 7/8 (unrefereed) stands; RH open.
