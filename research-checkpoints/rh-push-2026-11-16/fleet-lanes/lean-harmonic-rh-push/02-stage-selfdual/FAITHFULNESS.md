# 02 stage-selfdual (res-sparse-ferromagnet Thm. 3 (i)-(iii), as confirmed in REFEREE.md 2.3)
Status: NO PROOF RETURNED (service declined Lean input). Statement only; typechecks with `sorry`.
- Lee-Yang enters as the explicit hypothesis `LeeYangProp K` (statement of file 01); nothing else is assumed.
- General form uses positive energies l_p in place of log p; `dirichletStage` instantiates l_p = log P_p with P_p prime, kappa = 0, sum rule r_p = log P_p, and states zeros on Re s = 1/2 and Z(1-s) = M^(s-1/2) Z(s).
- Referee's wording correction respected: the Curie-Weiss member is NOT covered by (iii) (it has kappa != 0); it is covered by `stagePoly_zero_on_line` with a = 1/2.
- `hinj` (distinct primes) and `hn` are not needed by the mathematics; they are harmless extra hypotheses, not vacuity.
- Float check of the duality: defect 1.4e-14 at n = 4 (`_scripts/sanity.py`).
- Not covered: (iv) general depth (Polya-de Bruijn), (v) twists (same proof, moduli only), (vi) zero count.
