# REFEREE2: c15-nonhomogeneous-pair-triple-kernel-search

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. Second independent pass on the statements labelled
PROVED (three, all elementary); the first independent report was read together with the lane. The scan itself (MEASURED, outcome "none") was not rerun by me: its referee count
stays as recorded. No statement about zeros of zeta.

## Ruling: the three PROVED statements hold. The counts in three sentences are wrong as written (first referee, confirmed by arithmetic).

| statement | independent derivation | ruling |
|---|---|---|
| Lemma J1-Q | instance of Lemma J1' (see `REFEREE2_lemma-j1prime-u8-heat-inheritance.md`): `g K_B/(g K_A) = K_B/K_A` | holds; scope: equal tau, no polar terms, `K_A != 0` at the node |
| Lemma J1-L | `log abs(gK) = tau u^2/4 + log abs K`; second difference of `u^2` with step h is `2h^2`; third difference of a quadratic is 0 | holds. It is the case `S = 0` (third difference) and `S` equal on both members (second difference) of Lemma J1'' |
| reflection nodes | `K(-u) = conj K(u)` makes `log abs K` and `log abs R` even; an even function has equal values at `u` and `-u` and vanishing odd differences at 0 | holds |

Numeric check with separately built members (own kernels, 60 draws): quotient, cross-ratio and one-point triple
change by at most 1.5e-30 under HEAT; non-instances change by 0.14 to 0.27 (`loc_lemmas.json`).
Non-vanishing: `Phi_zeta > 0` on the window; `abs K_chi`, `abs K_(chi^2)` at least 0.25 and 0.11 of their
maxima on [-1, 1] for the character tested.

## Sentences false as written (RESULT.md at 13:40 PST)

- Section 0 table, section 2 and section 6: "280 by reflection identity, 472 in balls" / "280 grid nodes are
  of this kind (b6: 40; b2, b5l, b5m, b5p: 80 each)" / "280 identity, 2,494 read". The list in the same
  sentence sums to 40 + 4 x 80 = 360. Corrected (first referee's D1): "nine-class tier: 752 = 360 identity +
  392 in balls; six-class tier: 2,774 = 360 identity + 2,414 in balls". No count of survivors changes.
- "HEAT passes ... identically" is a statement about the registered lift (equal tau, no polar terms).
- Reading rule to keep: the canonical tier {T-NR, E_a, HEAT} is not closed (67,138 float64-undecided nodes).

Addition from this pass: by Lemma H and corollary (C4) of the J1'/U8 file, the HEAT column of any functional
that is a polynomial in kernel values without polar terms is `sum a_j exp(tau S_j/4) M_j(positive pair)`; it
can be computed from the positive pair alone. For the with-polar-term readings this does not hold.

Referees: 2 independent for the three PROVED statements; the measured outcome is unchanged by this file.
