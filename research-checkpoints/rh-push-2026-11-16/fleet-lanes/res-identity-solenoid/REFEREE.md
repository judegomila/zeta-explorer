# REFEREE: res-identity-solenoid

Date 2026-11-17. Adversarial referee of `RESULT.md` in this directory. Claimed verdict: precise-obstruction.

## Verdict

**Holds, with corrections.** Every step labelled PROVED was re-derived and is correct as mathematics, up to
the wording defects listed in section 2. The control failure was reproduced numerically with independent
code. Nothing in the result bears on the location of a zeta zero, and the result says so.

Three things reduce the claim:

1. Theorem 2 (`U_R`) is not new. Andersson, arXiv 2408.15713 ("Mittag-Leffler type theorems for Helson
   zeta-functions") states that with `chi(p)` restricted to `{-1, 1}` the prescribed zero/pole results hold
   when the sets are symmetric about the real axis. `U_R` is the one-pair case of that statement. The
   sigma-delta proof here is self-contained and correct, so the control is usable; it is a recalled
   construction with an elementary proof, not a new control.
2. Two cells of the control table (section 7 of the result) are wrong as stated (TW, HEAT); see 2.6, 2.7.
3. The bolded statement "the bridge form is the Hermitian trace form of the zero algebra" is proved for
   finite clusters only. The result admits this in its weakest step 2 but the verdict and the map row state
   it without the restriction.

## 1. Re-derivation of each PROVED step

| Step | Outcome | Notes |
|---|---|---|
| Thm 1(a) inversion-fixed cosets | confirmed | `chi0^{-1} in chi0 K` iff `chi0^2 = k_a`; `K cap G[2] = {1}` by irrationality of `log 2 / log 3`. Action `t -> -t` on `eps K`; symmetry `s -> conj s` only. |
| Thm 1(b) FE on `T^P` | confirmed relative to Kaczorowski-Perelli 1999 (Acta Math. 182) | A unimodular completely multiplicative `chi0` satisfies the Ramanujan and Euler-product axioms; with continuation, finite order and a degree-1 functional equation the function is in the Selberg class after a shift, hence `zeta` or `L(s + i theta, chi)`, `chi` primitive; coefficient 0 at `p | q` forces `q = 1`. See 2.1 for the hypothesis wording. |
| Thm 1(c) punctured tori | confirmed, same dependence | Count of real primitive characters with conductor support exactly `S`: one for `S` odd, three if `2 in S`. Correct. |
| Thm 2 `U_R` | confirmed | `abs(D) <= 2` by the two increment ranges; `R(s)` converges in `Re s > 0` by partial summation; `Re w > 1/2` iff `Re s > beta - 1/2`; poles at `rho + s0 - 1`, real part `< beta`. |
| Thm 3 `B_1` | confirmed | `Pi` non-decreasing for `u >= 2^{1/(1-beta)}`; `E_1(z) + log z` entire; signs: `-log(s-1) + log(s-s0) + log(s - conj s0)`; `k >= 2` terms converge in `Re s > 1/2`. |
| Lemma M | confirmed | Trivial: a line rotating by `theta_L` has index `theta_L/pi`. |
| Lemma R | confirmed up to `O(1)` | Winding of `(F', F)` is `pi N_0` up to an endpoint term less than `pi`; the result writes equality. |
| Thm 4 | confirmed | Convexity of the set with fixed endpoint signs. |
| Thm 5 (i)-(vi) | confirmed for finite clusters | (i) cyclic algebra + residue functional = coefficient of `z^{n-1}`; (ii) local Hankel block with constant antidiagonal `u(gamma)/G(gamma)`; (iii) `Res_gamma(F' V W / F) = m_gamma V(gamma) W(gamma)`; (vi) definiteness forces simple real zeros and one zero of `u` in each gap. |
| Thm 6 | confirmed | `E_a^#(z) = Xi(z - ia)`; factor comparison `(y + a -+ c)^2 > (y - a +- c)^2` for `y > 0`, `abs(c) < a`; even genus-1 product converges in pairs. Phase derivative `d/dt arg Xi(t + ia) = Re (xi'/xi)(1/2 - a + it)`, negative when `1/2 - a` is left of every zero. |
| Thm 7 | confirmed relative to unboundedness of `S(T)` | Gamma-factor phase at abscissa `1/2 + a` differs from `theta(T)` by `a pi/4 + O(1/T)`; `abs(arg zeta(sigma + iT)) <= log zeta(sigma)` for `sigma > 1`. |
| DH position | confirmed | `1 + kappa^2 = 1.0807009` (computed). |

## 2. Errors and imprecisions

2.1 **Thm 1(b), pole hypothesis.** "At most a pole on `Re s = 1`" must read "at most one pole, located on
`Re s = 1`". The Selberg class allows a pole at `s = 1` only; a single vertical shift cannot move two poles
there. The gamma factor must also satisfy the Selberg-class condition `Re mu_j >= 0`. With these the proof
stands. The classification is of degree-1 functional equations only; the result says so in 1(b) and section
8.3, but the verdict line and the map row drop "degree 1" in places.

2.2 **Thm 5(v), timing.** "`u_tau` acquires a common zero with `F_tau` at the merger" should be "at or before
the merger": the zero of `u` between the two real zeros can cross one of them earlier, which is also a
degenerate point and flips the pair to opposite signatures.

2.3 **Thm 5(vi), sign.** Interlacing gives a definite form; positive definite for one sign of `u`, negative
for the other. The statement needs the sign convention (`u/F' > 0` at the zeros).

2.4 **Thm 5(iii), scope.** Proved on `R[z]/(F_Gamma)` for a finite cluster and polynomial tests. The
identification with the bridge form of eq48 (all zeros, exponential tests) is by matching formulas; the
infinite-dimensional continuity (iv) and collision rule (v) are not proved. Label for the global statement:
ARGUED.

2.5 **Thm 6, labels.** (a) "`a > 3/8` unconditionally" is relative to the 7/8 theorem (Lean-checked locally,
not in the refereed literature); the result body labels it PROVED-rel correctly, the claim summary does not.
(b) The identity `h_{B_a}(V, V) = int abs(V)^2 / abs(E_a)^2` on the zeros of `A_a` is de Branges' sampling
theorem and needs the standard side condition (the corresponding combination of `A_a`, `B_a` not in
`H(E_a)`); not checked in the result. (c) Table row "DH, a = 0.3085, positive at t = 85.700 only" is a
finite-difference quotient evaluated at distance about `1e-3` from a zero of the denominator; it carries no
information and should be dropped.

2.6 **Control table, TW row.** "TW+-, U, `U_R`: points of `G`, off `K`; no functional equation by Theorem
1(b)". TW+ and TW- as defined in the map (`eps_n` real with `abs(eps_n) <= 1`) are not points of `T^P`
unless `abs(eps_p) = 1` and the twist is completely multiplicative, so Theorem 1(b) does not apply to them
as stated. What is true: if such a twist has an Euler product with Ramanujan bound and a degree-1 functional
equation, Kaczorowski-Perelli applies directly and it is an L-function. In all cases only a degree-1
functional equation is excluded; degree `>= 2` is open (section 8.3). "Lack the functional equation by the
classification" must be read as "lack a degree-1 functional equation, given continuation and finite order".

2.7 **Control table, HEAT row.** "Theorem 6 range: half-width of its zero strip". The obstruction map states
that the zeros of the backward heat family leave every strip (`b-escape-law`). Then the range is empty and
Theorem 6 has no valid `a`. "Holds with its own zero-free half-plane as input" is vacuous for HEAT. The EA
and NR ranges (`a' > a`, `a > arccosh(abs(c)/2)/log q`) hold only under RH for zeta; unconditionally add
`Theta - 1/2`.

2.8 **Claim summary, DH at a = 0.35.** "None for `a = 0.35`" is true on the windows `[80, 92]` and
`[110, 118]` only. By Theorem 6 itself (range `a > 0.6204`) the phase derivative at `a = 0.35` changes sign
near the heights of the DH zeros with `Re s > 0.85`, in particular those with `Re s > 1`. Not located here.

2.9 **Thm 3, last sentence.** "The additive structure of Z, which is the functional equation (Poisson
summation)" is a heuristic. Label ARGUED. Erdos 1946 is cited correctly.

2.10 **Thm 4, scope of "no other deformation invariant exists".** True for invariants defined on the whole
set `{F in V : F(a) F(b) != 0}` of a vector space. It says nothing about invariants defined on a smaller
open set (complement of the discriminant, where `N_0` is locally constant) or on a non-linear subclass. The
result notes both; the verdict item 3 states it without the restriction.

## 3. Cited theorems against their hypotheses

- Kaczorowski-Perelli 1999: degree-1 elements of the Selberg class are `zeta` and `L(s + i theta, chi)`,
  `chi` primitive. Requires the full Selberg axioms (pole at `s = 1` only, Ramanujan, Euler product with
  `b(n) << n^theta`, `theta < 1/2`, gamma factors with `Re mu >= 0`). Used correctly given 2.1. Statement
  checked against secondary sources only, not the paper.
- Conrey-Ghosh 1993 (no degree in `(0,1)`), Kaczorowski-Perelli 2011 (no degree in `(1,2)`): cited correctly.
- Bombieri-Hejhal 1995: conditional (GRH and a pair-correlation hypothesis); cited as conditional. Correct.
- 5/12 on the line (Pratt-Robles-Zaharescu-Zeindler 2020): correct.
- Selberg / Tsang omega-results for `S(T)`: unconditional. Correct.
- Lagarias 2005/2006, de Bruijn 1950 for the shifted pair: correct attribution; Theorem 6 is theirs apart
  from the `a > 3/8` instance.
- Erdos 1946: correct.

## 4. Numerical verification (independent code, run through `scripts/memcap.sh`, caps 4 and 2 GB)

Scripts kept outside this directory (`/tmp/ref-ris/`), not part of the record.

**DH (Theorem 6 check).** Own implementation with `mpmath.hurwitz`, derivative by `mp.diff`, 30 digits.
Functional equation residual `1.2e-30`; completed function real on the line to `1e-30`. Zeros by `findroot`:
`0.808517182456637 + 85.699348485377592i` and `0.650830080609737 + 114.163342730756981i`. `g(t) = Re
(Lambda'/Lambda)(1/2 - a + it)` on `[80, 92]`, step 0.02:

| a | positive points | range | max |
|---|---|---|---|
| 0.25 | 17 | 85.54 to 85.86 | +15.0849 |
| 0.35 | 0 | none | -0.7393 |
| 0.35, window [110, 118] | 0 | none | |

Agrees with the result to all printed digits. Grid values, not interval certificates.

**`U_R` (Theorem 2 check).** Different point `s0 = 0.8 + 5i`, `N = 4e6` (283,146 primes, 6 clipped,
`max abs(D) = 2.0`).
- `E_K(s0)` (truncated product for `zeta_eps` times the two truncated zeta products) at
  `K = 1e3, 1e4, 1e5, 283146` primes: `16.2269+13.1590i`, `16.2241+13.1678i`, `16.2253+13.1674i`,
  `16.2250+13.1676i`. Converges to a non-zero value, as the proof requires.
- Smoothed sum at `s0`: `1.072, 0.701, 0.431` for `M = 6250, 25000, 1e5` (decay about `M^{-0.33}`, expected
  `M^{-0.3}` from singularities at `Re s = beta - 1/2`).
- Winding on `abs(s - s0) = 0.1`: 1.0000 for the smoothed sum and for the closed form; 0.0000 on a circle
  about `0.95 + 8i`.
- Agreement with the closed form: `5.7e-6` at `1.5 + i`, `1.3e-2` at `1.1 + 5i`, `0.13` at `0.9 + 5i`.
Consistent with the theorem. The proof, not the run, carries the statement.

**Theorem 5 check, the 3 unexamined failures.** Reproduced with the same seed. All three are degree 10 or 11
with 3 complex pairs; the Gram matrix has a smallest relative eigenvalue of `2.9e-16`, `9.2e-14`, `3.3e-14`,
below or at the `1e-13` threshold, so one positive eigenvalue is dropped (`(7,3)` in place of `(8,3)`,
`(6,3)` in place of `(7,3)`). Conditioning of the float64 Gram matrix, not a counterexample.

**Not verified here.** `B_1` (no numerics in the result either); the DH supremum `Re s = 1.1203625` (taken
from the map); the eq48 formula for the bridge form (taken as refereed).

## 5. Novelty

- Theorem 1(a): elementary; no source found, likely folklore.
- Theorem 1(b),(c): corollaries of Kaczorowski-Perelli. The packaging as "K is the only coset" is a
  restatement.
- Theorem 2: in the literature (Andersson 2408.15713, remark on `chi(p) in {-1, 1}` with symmetric sets;
  following Seip 2020 and Bochkov-Romanov 2106.15949). Not new.
- Theorem 3: Beurling constructions of Diamond-Montgomery-Vorhauer / Zhang type; the result claims no
  novelty. Correct.
- Theorem 5: Hermite-Sylvester-Jacobi, Krein-Naimark; the result says so. The reading "bridge form = trace
  form, member `u = F'`" is a restatement of eq48 in that language.
- Theorem 6: Lagarias, de Bruijn. Theorem 7: a short consequence of the unboundedness of `S(T)`; no source
  found; elementary.
- Net: the contribution is the organisation (three meanings of self-dual; two controls for the two
  non-FE classes; partner formulation), not a new theorem.

## 6. Control failure: assessment

The claim "no structural separation found" is supported:
- Without the functional equation: `U_R` and `B_1` are proved to have prescribed zeros and pass the listed
  identity-tied properties. Confirmed.
- With the functional equation: Lemma M, Lemma R, Theorems 4, 5 use only that `F` is a real entire function,
  so they hold for DH, EA, NR and (as identities) HEAT. Theorem 6 holds for DH, EA, NR with their own
  zero-free range as input; it is vacuous for HEAT (2.7). DH sign change reproduced.
- The separation between zeta and DH at `a = 1/2` in Theorem 6 is the classical non-vanishing on
  `Re s = 1`, as the result states.

## 7. What the result does not cover

1. Any statement about zeta zeros: none is made and none follows.
2. Functional equations of gamma-degree `>= 2` for points of `T^P` (Theorem 1(b) is degree 1 only), and
   functional equations for twists that are not unimodular completely multiplicative (2.6).
3. Rigid (non-deformation) properties of the isolated point; Theorem 4 is silent on them.
4. Invariants defined off the discriminant or on non-linear subclasses (2.10).
5. The infinite-dimensional form of Theorem 5 (all zeros, exponential tests); the semilocal Krein index.
6. Unboundedness of `S(T) - (1/pi) arg zeta(1/2 + a + iT)` for `0 < a <= 1/2` (ARGUED in the result), so
   Theorem 7 excludes shifted partners only for `a > 1/2`.
7. Properties of one-parameter subgroups that use the radii `p^{-sigma}` together with the frequencies:
   `B_1` changes both the subgroup and the radii, so it is a control for properties of the pair
   `(omega, e^{-sigma omega})`, not for properties of zeta's symbol `F_sigma` restricted to another line.
8. Interval-certified numerics: all checks are float64 or mpmath grid values.

## 8. Surviving claim

Narrower no-go, relative to Kaczorowski-Perelli 1999 for the classification: (1) inversion-fixed cosets of
the Kronecker line are `eps K`, `eps in {+-1}^P`, with symmetry `s -> conj s` only; with a degree-1
functional equation (one pole at most, on `Re s = 1`; finite order) `K` is the only coset of `T^P`, and real
primitive characters give countably many lines on punctured tori. (2) `U_R` (known: Andersson 2408.15713)
and `B_1` (Beurling, known type) have prescribed zeros and pass the identity-tied properties that do not use
the functional equation. (3) On the line: Maslov index `theta(T)/pi + O(1)`; invariants locally constant on
the full set `F(a) F(b) != 0` of a vector space are functions of the endpoint signs. (4) For finite
clusters, the trace form is `h_{F'}`, degenerate exactly at multiple zeros, determinant = discriminant;
definiteness of `h_u` is equivalent to simple real zeros interlaced by `u` with the right sign. The shifted
pair is Hermite-Biehler iff zeta is zero-free in `Re s >= 1/2 + a` (`a >= 1/2` classical, `a > 3/8` relative
to the 7/8 theorem); a partner with count `theta(T)/pi + O(1)` cannot interlace the zeros of `Xi`. (5) DH,
EA, NR pass every line statement with their own zero-free range (EA, NR ranges conditional on RH for zeta);
HEAT passes the identities and has an empty Theorem 6 range; DH phase-derivative sign change at
`t = 85.54..85.86` for `a = 0.25` reproduced, none for `a = 0.35` on `[80, 92]` and `[110, 118]`.

Sources consulted for novelty and hypotheses:
- Bochkov, Romanov, On zeroes and poles of Helson zeta functions: https://arxiv.org/pdf/2106.15949
- Andersson, Mittag-Leffler type theorems for Helson zeta-functions: https://arxiv.org/pdf/2408.15713
- Kaczorowski, Perelli, On the structure of the Selberg class, I: https://projecteuclid.org/journals/acta-mathematica/volume-182/issue-2/On-the-structure-of-the-Selberg-class-I-0d1/10.1007/BF02392574.pdf
- Kaczorowski, Perelli, On the structure of the Selberg class, VII: https://annals.math.princeton.edu/2011/173-3/p04
