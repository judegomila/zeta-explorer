# Proposed map entries (for the record lane; the map is not edited here)

Lane `c20-euler-shape-rigidity-infinite-modified-primes`, round 20, combine (pre-filter). Zero referees (the
REFEREE.md on file is the author's adversarial pass). Status words as in RESULT.md.

## Section 3 (obstruction table): one row

| X3 | Euler-shape rigidity without the pole clause for infinitely many modified primes (campaign round 20; combine; question Q-inf of row X2) | Theorem A: if G is an Euler product with zeta's functional equation and the relative product N = zeta/G converges uniformly on Re s >= 1/2 (sum over p of sup over abs y <= p^(-1/2) of abs(n_p - 1) finite; for degree-one geometric factors: sum abs(1 - alpha_p) p^(-1/2) finite), then G = zeta. Covers every modified set S with sum over S of p^(-1/2) finite and bounded parameters of bounded degree, deletions and sign flips included, and Lemma C of X2. Proof: reflection across the line and Liouville, or one-sided Bohr spectrum on the line; the functional equation enters once, as equality of boundary values on the line. No hypothesis on poles of G, no order clause, no positivity. The proof uses no multiplicativity (it holds for any Dirichlet series zeta/G or G/zeta bounded on Re s > 1/2) and is base-blind (holds over DH and Beurling systems): in the functional-equation class the local-shape step is a boundedness clause on zeta/G in the closed right half-plane (referee E1 of X2, for infinitely many primes). Corollary A2: the miss of the functional equation on the line is at least abs(1 - a_G(p)) p^(-1/2) for every p. Theorem B (Bohr's inequality): boundedness of zeta/G on Re s > 1/2 forces sum abs(1 - a_G(p)) p^(-1/2) finite, so the method covers exactly the summable class. Theorem C, regime (K) (relative product convergent for every Re s > 1/2, divergent at 1/2): every off-line zero of a twin is a zero of zeta; a twin of finite order has a zero of G/zeta on the line; existence OPEN. Regime sigma_rel > 1/2 (unimodular completely multiplicative classes, non-sparse S): OPEN; the proof has no input in 1/2 < Re s <= sigma_rel (R4 in relative form). No twin was found; an identification; it locates no zero. | PROVED (Theorem A, Corollaries A1, A2, Lemma A0, Theorem C; author only, zero independent referees); CLASSICAL (Bohr's inequality, uniqueness of almost periodic functions, Phragmen-Lindelof; recalled); MEASURED (defect on the line for sparse THIN, DEL and three other families: sup 2.23, 1.02, 1.17, 0.29, 1.44; Kronecker product formula to 1.4e-4) | none passes the hypotheses: HQ1 to HQ4 (zero or pole of the local multiplier in abs u <= 1), ZQ and SG (not almost periodic on the line), NR and NR-q (two-sided spectrum), THIN, DEL, E_a (no functional equation of zeta; sigma_rel > 1/2); holds verbatim with DH or B as base | `c20-euler-shape-rigidity-infinite-modified-primes` |

## Section 2 (controls): one note (no new control)

- Sparse sign chains and sparse deletions (THIN, DEL, TW, U restricted to a set S with sum over S of p^(-1/2)
  finite) cannot have zeta's functional equation: the boundary values of zeta/G on the line differ from their
  reflection by at least 2 p_min^(-1/2) (sign flip) or p_min^(-1/2) (deletion) in sup norm (Corollary A2 of
  row X3). A twin with zeta's functional equation and local Euler shape must have sum over p of
  abs(1 - a(p)) p^(-1/2) infinite; if it is to have an off-line zero of its own, sum abs(1 - a(p)) p^-sigma
  must diverge for some sigma > 1/2.

## Section 6 (what is not covered): replace the Q-inf item of X2 by

Q-inf, remaining part: is zeta the only function with zeta's functional equation and an Euler product with
geometric (or locally zero-free) factors when the relative product zeta/G has abscissa of absolute convergence
above 1/2? And in the boundary regime (convergent for every Re s > 1/2, not uniformly up to the line): does a
twin exist at all (if so, all its extra zeros are on the line)? An identification question in both parts.

## Addendum to row X2 (filter)

For the device rows of X2 class (iii-b), (iii-c) and map rows L1, L4, L5, Z18, Q19, Q21, D8 (eigenstates),
G40, P46, P51: rejection of a functional-equation control through local shape is forced for finitely many
modified primes (X2) and for infinitely many in the summable class (X3: no such control exists); in regime (K)
no such control with an off-line zero exists (for the Ramanujan-size variant only: no off-line pole); not
decided for sigma_rel > 1/2. Row L6 (Edrei-Thoma) is not forced (HQ4).
