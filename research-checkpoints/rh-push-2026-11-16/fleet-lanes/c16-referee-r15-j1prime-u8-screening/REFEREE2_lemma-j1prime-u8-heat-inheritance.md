# REFEREE2: Lemma J1' (LIFT_RULING.md section 5) and the U8 heat-inheritance exclusion

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. Independent of the author of both statements
(`c15-referee-r14-independent-checkpoint`): own derivation, own code (`code/loc_lemmas.py`, `loc_lemmas.json`,
local, `scripts/memcap.sh 8`, mpmath 30 to 40 digits, 22 s). Nothing here is a statement about zeros of zeta.
Labels: PROVED (argument written here), CLASSICAL, MEASURED.

## 0. Ruling

| statement | ruling | referees after this file |
|---|---|---|
| Lemma J1' (common pointwise positive factor) | **holds as stated**; two hypotheses to be written (section 1.2) | 2 (author of LIFT_RULING; this file) |
| the three listed instances and the four listed non-instances | hold | 2 |
| U8 exclusion "monomial upper bounds with lam >= 0 and sum e_i u_i^2 >= 0 are inherited by backward heat" | **holds**; it is one of four cases of an exact rule (Lemma H below), which is stronger | 2 for the filed case; 1 (this file) for the extension |
| consequence for round 17 | a U8 search **may run, restricted** (section 3): monomial and two-term conditions are decided on paper and leave the dictionary; the HEAT column needs no kernel of the control | - |

Neither statement is broken. No sentence of LIFT_RULING section 5 or of the U8 paragraph is false as written.

## 1. Lemma J1'

### 1.1 Statement and proof (re-derived)

Registered HEAT lift (c14 PREREG section 4, class 4): every member X of the pair or triple is replaced by
`g K_X`, `g(u) = exp(tau u^2/4)`, the same tau < 0 on every member, kernels without polar terms. Let Phi be a
function of the values `K_X(u_i)` at finitely many nodes with `Phi((c_i K_X(u_i))) = Phi((K_X(u_i)))` for all
`c_i > 0`. Then `Phi(HEAT) = Phi(positive)` for every tau: take `c_i = g(u_i) > 0`. PROVED (one line).

The only content is that the lift is a pointwise positive multiplier common to the members. That is the
definition of the lift; I checked it against the function side so that the check is not a tautology:
`int g Phi_zeta e^(izu) du = sum_k (tau/4)^k/k! (-1)^k Xi^(2k)(z)` (multiplication by `e^(tau u^2/4)` on the
kernel is the operator `exp(-(tau/4) d^2/dz^2)` on the transform). At tau = -0.3, z = 3.7: both sides
0.18024967963657680911, relative difference below 1e-38 (MEASURED).

### 1.2 Hypotheses that the text should carry

1. Phi must be defined at the nodes: every kernel value that is divided by, or whose logarithm is taken, is
   non-zero there. Numeric non-vanishing check (own kernel code; MEASURED): `Phi_zeta > 0` on [-2.6, 2.6],
   minimum 1.13e-241 at abs(u) = 2.6 (CLASSICAL: positive everywhere); for the order-6 character mod 7 and its
   square, `min abs K / max abs K` on [-1, 1] is 0.252 and 0.107; at abs(u) = 2.6 the ratios are 3.6e-34 and
   3.0e-35 (decay, not a zero). A complex kernel can vanish at isolated real nodes for other characters; the
   lemma then says nothing at such a node.
2. "For every choice of the c_i" may be weakened to "for `c_i = exp(tau u_i^2/4)`, tau < 0" (a one-parameter
   family). This matters: section 2 uses it.

### 1.3 Instances and non-instances (recomputed with members built separately, 60 draws, tau = -10^x, x in (-1.7, 0.3))

| functional | max relative change, HEAT pair against positive pair |
|---|---|
| `K_B(u)/K_A(u)` | 1.2e-30 |
| cross-ratio `K_A(u) K_B(v)/(K_A(v) K_B(u))` | 1.5e-30 |
| triple at one point `K_chi(u)^2/(K(u) K_(chi^2)(u))` | 1.2e-30 |
| `K_B(u)/K_A(v)`, u != v (non-instance) | 0.23 |
| `log K_A(u)` alone (non-instance; shift tau u^2/4) | 0.27 (absolute) |
| quotient with tau on A and tau/2 on B (non-instance) | 0.14 |

The author's own check file computes `g K_B/(g K_A)` with the same `g` in one expression, which cannot fail; the
table above evaluates each HEAT member on its own (the A member through `exp(tau u^2/4 + log K_A)`).

### 1.4 What J1' is an instance of (PROVED; new sentence, one referee)

**Lemma J1''.** For a monomial in the member values, `Phi = prod over (X, i) of K_X(u_i)^(e_(X,i))`,
`Phi(HEAT) = exp(tau S/4) Phi(positive)`, `S = sum e_(X,i) u_i^2`. So Phi is HEAT-invariant iff `S = 0`.
J1' is the case "the exponents at each node sum to zero" (then S = 0 for every node set). The lane's Lemma J1-L
(third log differences unchanged, second differences shifted by tau h^2/2) is the case S = 0 that is not a J1'
instance: `L3` has S = 0 through the node geometry, not node by node. `L2_A - L2_B` is a J1' instance.

Scope (unchanged from the ruling, confirmed): equal tau on the members; no polar terms; the statement blocks
R3 against the class HEAT only and says nothing about the other eight classes.

## 2. The U8 exclusion

### 2.1 Filed statement

"For a kernel without polar terms any monomial inequality `prod K(u_i)^(e_i) <= lam` with real values,
lam >= 0 and `S = sum e_i u_i^2 >= 0` is inherited by backward heat (the monomial is multiplied by
`exp(tau S/4)` in (0, 1])." Holds. Proof re-derived: `M_tau = f M`, `0 < f <= 1`; if `M >= 0` then
`f M <= M <= lam`; if `M < 0` then `f M < 0 <= lam`. The clause `lam >= 0` is used in the second case and is
needed (2.2). Hypotheses to be written (the first is the first referee's note): `K(u_i) != 0` at nodes with
`e_i < 0`; `K(u_i) > 0` at nodes with non-integer `e_i`.

### 2.2 Lemma H (exact rule; PROVED here; one referee)

Let K be real without polar terms, `M = prod K(u_i)^(e_i)` real and defined, `S = sum e_i u_i^2`,
`M_tau = exp(tau S/4) M` its value on the backward-heat member (tau < 0). Suppose zeta's kernel satisfies
`M <= lam`. Then:

- (H1) `M_tau <= lam` for every tau < 0 if and only if `lam S >= 0` or `M lam <= 0`.
- (H2) In the remaining case (`lam S < 0` and `M lam > 0`) put `tau* = 4 abs(log(lam/M))/abs(S)`. Then
  `M_tau <= lam` exactly for `abs(tau) <= tau*`, and fails exactly for `abs(tau) > tau*`.
- (H3) The same with `>=`: `M >= lam` is inherited for every tau < 0 iff `lam S <= 0` or `M lam <= 0`; otherwise
  it holds exactly for `abs(tau) <= tau*`.
- (H4) Sign conditions (`lam = 0`) are inherited always. An equality `M = lam != 0` is inherited iff `S = 0`.

Proof. `S = 0`: invariant. `S > 0` (`0 < f < 1`): `M >= 0` gives `fM <= M <= lam`; `M < 0 <= lam` gives
`fM < 0 <= lam`; `M <= lam < 0` gives `fM <= lam` iff `f >= lam/M`, i.e. `abs(tau) <= 4 log(M/lam)/S`.
`S < 0` (`f > 1`): `M <= 0` gives `fM <= M <= lam`; `M > 0` (so `lam > 0`) gives `fM <= lam` iff `f <= lam/M`.
The four sub-cases are (H1), (H2). (H3) is (H1), (H2) for `-M`, `-lam`. (H4): `lam = 0` falls under (H1), (H3);
for `M = lam != 0` both `<=` and `>=` must be inherited, and then `tau* = 0` unless `S = 0`. QED

The filed exclusion is the sub-case `lam >= 0`, `S >= 0` of (H1). The Turan ratio
`K(u-h) K(u+h)/K(u)^2 <= lam` has `S = 2h^2`: at u = 0.3, h = 0.4 the ratio is 0.0143884210 for zeta and
0.0138242429 at tau = -0.5 from the kernels directly, equal to `exp(tau h^2/2)` times the first (MEASURED).

Check of (H1) to (H4) on 4000 random monomials of `Phi_zeta` (2 to 4 nodes in [-1.2, 1.2], exponents in
{+-1, +-2, +-3}, both signs of M, relative slack 1e-3 to 3, tau in {-0.02, -0.1, -0.5, -2, -8, -40}):

| case | number | violated for some tau |
|---|---|---|
| upper bound, `lam S >= 0` | 1852 | 0 |
| upper bound, `lam S < 0` | 1830 | 1573 (the rest have `M lam <= 0` or `tau* > 40`) |
| lower bound, `lam S <= 0` | 1870 | 0 |
| lower bound, `lam S > 0` | 1827 | 1562 |

(The random test uses the factor `exp(tau S/4)`; the independent content is the two kernel-level checks above.)

### 2.3 Corollaries for the class U8 (PROVED from Lemma H unless marked)

- (C1) **No monomial inequality that zeta's kernel satisfies with a positive margin rejects every backward-heat
  member.** Either it is inherited by all of them (H1), or it is passed by all `abs(tau) <= tau* > 0` (H2).
  Rejecting the whole family needs `tau* = 0`, i.e. `lam` equal to zeta's own value of the monomial: an
  identification of a kernel value, not an inequality with a margin.
- (C2) Against the registered class (training tau = -0.1, -0.5; held-out `abs(tau)` down to 10^-1.7 = 0.02;
  nodes in [-2.6, 2.6]): a monomial bound rejects the member tau iff `lam S < 0`, `M lam > 0` and
  `abs(log(lam/M_zeta)) < abs(tau) abs(S)/4`. For abs(tau) = 0.02 and the reverse Turan ratio with h = 0.4
  the relative margin must be below 1.6e-3. Such a `lam` exists for every monomial with `S != 0` (take it
  inside the window). So "zeta passes, every registered HEAT member fails" is always attainable by tuning
  `lam` to zeta's value and never by a threshold fixed in advance; the held-out positives (other kernels,
  other values of M) are what removes it.
- (C3) Two-term conditions `a M_1 + b M_2 >= 0` reduce to a monomial bound on `M_1/M_2` whenever `M_2` has a
  known sign. For `Phi_zeta > 0` every monomial is positive, so every two-term condition on the kernel without
  polar terms is covered by Lemma H. The Turan determinant `K(u-h)K(u+h) - lam K(u)^2` is of this kind.
- (C4) For a k-term functional `F = sum a_j M_j` the HEAT column is `F_tau = sum a_j exp(tau S_j/4) M_j(zeta)`:
  it is computed from zeta's kernel values alone; no kernel of the control is needed. `d F_tau/d tau` at 0 is
  `(1/4) sum a_j S_j M_j`. If all `S_j` are equal the functional is covered by Lemma H as one monomial.
  CLASSICAL (Laguerre's extension of Descartes' rule to exponential sums): the number of real zeros of
  `tau -> F_tau` is at most the number of sign changes of the sequence `a_j M_j` ordered by `S_j`.
- (C5) Not covered, as before: kernels with polar terms (the heat member is not `g K`); minors of order 3 and
  above with at least three distinct `S_j` (for `det[K(x_i - y_j)]` the heat member is the Hadamard product
  with the totally positive matrix `exp(abs(tau) x_i y_j/2)` after positive row and column scalings; no sign
  rule follows); conditions on infinitely many nodes whose margin is zero by a limit.

## 3. Decision for round 17 (compute item 3 of STRATEGY section 1)

A U8 search may run under these conditions; without them its HEAT outcome is known in advance.

1. Remove from the dictionary, and report as closed on paper by Lemma H: every monomial bound, every two-term
   condition, and every functional whose terms share one value of `S_j`, for kernels without polar terms, at
   every order, node set and normalisation by a factor `e^(cu)` (a factor `e^(cu)` multiplies M by a constant
   independent of tau; a Gaussian normalisation shifts S).
2. For every functional kept, compute the HEAT column from (C4) and record `tau*(F)`, the root of `F_tau`
   nearest to 0 on tau < 0, and zeta's margin. A functional counts as rejecting HEAT only if `tau*(F)` is below
   the smallest registered `abs(tau)`, and the registered ladder must then be extended (tau = -0.02 x 2^-k)
   until the rejection stops or ball arithmetic no longer separates `F_0` from 0.
3. Registered prediction to write before the run: for every strict finite-node condition `tau*(F) > 0`
   (continuity; the flow-blindness wall in the form (C1)); the search can only return functionals whose
   threshold was tuned inside zeta's margin, and the held-out positives decide those.
4. Ball arithmetic for the margin column (margins of size 1e-3 and below are the only candidates).
5. Kernels with polar terms are a separate registered family; Lemma H does not apply to them.

This is a restriction of the search, not a closure of U8: three-term and higher functionals and all readings
with polar terms stay open. The size is that of a small compute item, not of a heavy lane.

## 4. Three weakest points of this file

1. Lemma H and (C1) to (C4) have this file as their only derivation.
2. The 4000-monomial test verifies the case analysis, not the lift; the lift is verified at one (tau, z) on the
   function side and at one Turan node at kernel level.
3. Non-vanishing of the complex kernels was checked for one character of conductor 7 and its square on a grid
   of step 0.025; it is not a statement about every character of the battery.
