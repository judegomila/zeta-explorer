# Proposed replacement for sentence E1 of c14-prefilter-sweep-geometric-nodes

Status: proposal by lane c15-klein-transport-lemma-w-stage-a-and-e1, 2026-11-19. The c14 files are not edited.
The statement below is that of graph nodes 386 (`wiener-hopf-phase-condition`) and 358
(`thin-hankel-schur-equivalence`); what is added is a written proof.

## Sentence as filed (false; c14 referee E1)

"For a < 1/2 an off-line zero is a pole and the Schur condition is the zero-free statement itself."

## Theorem E1' (PROVED)

Setting. X entire, even, real on the real axis, of order one with sum over zeros of abs(lambda)^-2 finite
and all zeros in a vertical strip abs(Re lambda) <= B (for example X(z) = xi(1/2 + z), B = 1/2), so that each
horizontal line carries finitely many zeros; m(lambda) the multiplicity of lambda as a zero (0 if not a zero). The zero
multiset is closed under lambda -> -lambda and lambda -> conj(lambda), hence m(beta + i gamma) =
m(-beta + i gamma). Fix a > 0 and R_a(w) = X(w - a)/X(w + a).

(i) R_a is meromorphic with abs(R_a) = 1 on Re w = 0 off its poles there, and its pole order at
w0 = lambda - a is max(0, m(lambda) - m(lambda - 2a)).
(ii) R_a is Schur on Re w > 0 (analytic with abs(R_a) <= 1) if and only if
m(lambda - 2a) >= m(lambda) for every zero lambda with Re lambda > a.
(iii) If abs(Re lambda) <= a for every zero, R_a is Schur. In particular for X = xi(1/2 + .) every a >= 1/2.
(iv) Schur at one a does not imply abs(Re lambda) <= a. Example: a = 1/4, zeros +-0.35 +- 3i and
+-0.15 +- 3i.
(v) R_{a_n} is Schur for a sequence a_n -> 0+ if and only if every zero has Re lambda = 0.

Proof. Hadamard and evenness give X(z) = X(0) z^(2k) prod over pairs {lambda, -lambda} of (1 - z^2/lambda^2),
absolutely convergent, so

    R_a(w) = ((w - a)/(w + a))^(2k) prod over pairs of (w - a - lambda)(w - a + lambda)/((w + a - lambda)(w + a + lambda)).

Group the zeros by ordinate. For gamma real let D_gamma be the finite multiset of real parts beta of zeros
with ordinate gamma; it is symmetric under beta -> -beta. Put

    f_gamma(w) = prod over beta in D_gamma of (w - i gamma - a - beta)/(w - i gamma + a - beta).

The pair grouping {lambda, -lambda} joins ordinate gamma with -gamma, so R_a = prod over gamma >= 0 of
f_gamma f_{-gamma} (f_0 alone for gamma = 0), a regrouping of finitely many factors inside each term of an
absolutely convergent product.

In the variable v = w - i gamma, f_gamma is a rational function with zeros at v = a + beta and poles at
v = beta - a, beta in D_gamma. By the symmetry of D_gamma the zero multiset {a + beta} = {a - beta} is the
reflection v -> -v of the pole multiset {beta - a}. Cancel common points: a pole at p = beta - a of order
m(beta) meets a zero of order m(beta') with a + beta' = p, that is beta' = beta - 2a; the surviving pole order
is max(0, m(beta) - m(beta - 2a)), which is (i) (poles from different ordinates do not meet). Reflection maps
a cancelling pair at p to a cancelling pair at -p, so after cancellation the zero multiset is still the
reflection of the pole multiset: f_gamma = prod over surviving poles p_j of (v + p_j)/(v - p_j), with real p_j.

If the condition of (ii) holds, no pole with p_j > 0 survives; factors with p_j = 0 are 1; each remaining
factor (v + p_j)/(v - p_j), p_j < 0, has modulus < 1 on Re v > 0 and 1 on Re v = 0. So abs(f_gamma) <= 1 on
Re w > 0 for every gamma, and abs(R_a) <= 1 there as a convergent product of such factors. If the condition
fails at some lambda, (i) gives a pole in Re w > 0 and R_a is not Schur. This proves (ii); the modulus claim of
(i) follows from the same representation.

(iii) No zero has Re lambda > a, so the condition is empty.
(iv) m(0.35 + 3i) = 1 and 0.35 - 2a = -0.15, a zero of multiplicity 1. The condition holds and a zero has real
part 0.35 > a.
(v) If all zeros are on the axis, (iii) applies for every a > 0. Conversely let lambda = beta + i gamma be a
zero with beta > 0. For each n with a_n < beta the condition requires a zero at beta - 2a_n + i gamma. These
are distinct points for distinct a_n, all on the segment of ordinate gamma with real part in (-beta, beta);
there are infinitely many such n and only finitely many zeros on that segment. Contradiction.

## Checks (MEASURED; `checks.json` key `e1_repair`, `second_pass.json` key `E1prime_random`)

- 7 hand cases, 40 digits, 4000 points of Re w > 0 each: predicted Schur (strip inside a; cancelling pair;
  three-step chain) sampled supremum 0.99998, 0.99998, 0.99999; predicted not Schur (no companion; companion at
  another ordinate; broken chain; multiplicity deficit) supremum 8.2, 5.9, 2.1, 2.9. Axis defect below 1e-40.
- 400 random symmetric multisets (real parts on a 0.05 grid, two ordinates, multiplicities 1 to 4,
  a in {0.05, ..., 0.25}; seed 90917): rule against a direct pole test by scaling at distances 1e-8 and 1e-14:
  400 agree, 32 Schur, none with sampled supremum above 1 without a pole. A first version of the pole test
  (size above 1e3 at distance 1e-8) missed 3 poles with small residue; the scaling test replaced it.

## Proposed replacement text

- c14 RESULT verdict item 5 and "none sits between": "For a >= 1/2 the bridge ratio R_a is Schur
  unconditionally and Blaschke-closed. For a < 1/2, R_a is Schur iff every zero with Re lambda > a has a
  same-ordinate zero at lambda - 2a of at least its multiplicity (nodes 386, 358; proof in
  c15-klein-transport-lemma-w-stage-a-and-e1/PROPOSED_E1_REPLACEMENT.md). The strip abs(Re lambda) <= a implies
  it; it does not imply the strip at a single a; along a sequence a_n -> 0+ it is RH."
- c14 section 2.2, row Q-B (a): replace "the inequality is the zero-free statement" by "the inequality is the
  cancellation-aware condition of node 386, which the zero-free strip abs(Re lambda) <= a implies and which is
  RH along a -> 0+; the node stays typed X3".
- Typing consequence: none. T-NR's added zeros at Re = +-b have no same-ordinate companion at b - 2a for
  0 < a < b (the only other added zero on that ordinate is at -b, and b - 2a = -b needs a = b), so T-NR fails
  the Schur condition for every a < b, provided no zero of xi sits at the companion point. For a >= b its added
  zeros satisfy abs(Re lambda) <= a and impose no condition (case (iii)).
