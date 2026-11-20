# REFEREE2: c15-u7-growing-section-twin-ladder-bridge

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. Second independent pass (the lane's REFEREE.md already
holds one independent report; I read it together with the lane, so this pass is an own derivation with own code on other cases, not a blind one). Own code: `code/loc_lemmas.py`. Nothing here is a
statement about zeros of zeta; Theorem 1 (a) and Lemma 3 are conditional on a zero-free hypothesis which they state.

## Ruling: holds with corrections. No PROVED statement is broken.

| statement | independent derivation | ruling |
|---|---|---|
| closed form of `K_u` | `int_0^u (1 - v/u) e^(-wv) dv = 1/w - (1 - e^(-uw))/(u w^2)` (direct) | holds |
| Lemma 1 (CLASSICAL) | `sum_rho K_u(s - rho) = xi'/xi(s) - (1/u) sum_rho (1 - P^(rho-s))/(s - rho)^2`; compared with the Perron residues of `e^(uw)/(u w^2)` | holds |
| Lemma 2 | `phi(v) = (1 - v/u) e^(-xv)` is non-negative, vanishes at u, and `-phi'` is non-negative and non-increasing; one integration by parts and the alternating-series bound (this is Polya's criterion for cosine transforms) | holds, with equality case `x = 0`: `(1 - cos uy)/(u y^2)` |
| Theorem 1 (a) | termwise sign; `L_F` is holomorphic in `Re s > 0` (only `g` has poles, at `0, -2, ...`) | holds, conditional on its hypothesis |
| Theorem 1 (b) | positive real part plus a bounded value at s = 2 gives a normal family (Cayley transform, Montel); the limit continues `xi'/xi + M` | holds |
| Lemma 3 | `S_1 - S_2 = -2 alpha (L_1 - L_2)/((1 + alpha L_1)(1 + alpha L_2))`; `abs(1 + alpha L) >= 1` when `Re L >= 0` | holds |
| Proposition 4 | `w = B (1 + cos(v_0 y + phi)) >= 0` has integral 1 because `b(v_0) = 0`; the prime side keeps only `b(log n - v_0)` because `log 2 > delta`; supremum over phi | holds with an unspecified absolute constant |
| unconditional range | `Re g(1/2 + it) = (1/2) log(t/2 pi) + O(t^-2)`; the term `K_u(s - 1)` has size `sqrt(P)/(u t^2)`, negligible when the stated condition on the prime sum holds (`4 sqrt(P)/u < (1/2) log t`) | holds asymptotically; the margin `-1/t` is not derived with explicit constants for small P |

## Numbers recomputed (own prime side, float64; a cell not in the lane or in the first referee's rerun)

t in [2000, 2100], step 0.02, P = t^1 = 2000: zeta, Fejer: `min Re L_F` = 0.153, fraction below 0: 0.
Liouville twist on zeta's gamma one-port: min -1.179, fraction 0.0182 (lane: 0.024 at t = 1e3, 0.018 at 1e4;
first referee 0.022 at 3000). P = 44.7 (theta = 1/2): zeta min 0.792. Lemma 2 on a grid
(`0 <= Re w <= 5`, `abs(Im w) <= 200`, four values of u): minimum of `Re K_u` = 5.7e-14 >= 0.
Non-vanishing: the positivity statement is strict at these points (0.153 > 0).

## Sentences false or too strong as written (RESULT.md at 13:40 PST)

- Section 2, Q-P: "T-NR has no Euler product." False against the map's definition (one changed local factor;
  coefficients multiplicative), and the range `0 < c <= 2` used there is not the control (`abs c > 2`).
  Corrected sentence: "for `0 < c <= 2` the symmetric factor `p0^(s-1/2) + c + p0^(1/2-s)` has its zeros on
  the line and adds non-negative terms `K_u(s - rho')`; this is not the control T-NR. For the control
  (`c > 2`) the statement fails through the off-line zeros of the factor." (first referee's E1; confirmed).
- "unimodular twists pass" (section 6, R3) is wrong for the campaign's unimodular control (first referee's
  E2: 4 of 4 violate). Rerun here (`code/loc_unimodular.py`, six random unimodular completely multiplicative
  twists on zeta's gamma one-port, t in [2000, 2100], P = 2000): 6 of 6 violate, `min Re L_F` from -2.88 to
  -1.00, fraction of the window below 0 from 0.022 to 0.038. Corrected sentence: "Dirichlet characters pass
  under GRH; the campaign's unimodular control violates the stage statement at theta >= 1, like the sign
  chains." 
- Novelty: Theorem 1 is the Fejer-smoothed form of "RH iff `Re xi'/xi > 0` on `Re s > 1/2`"; label CLASSICAL in
  content.

Referees for the PROVED statements: 2 independent. Flags unchanged: R1 to R4 false.
