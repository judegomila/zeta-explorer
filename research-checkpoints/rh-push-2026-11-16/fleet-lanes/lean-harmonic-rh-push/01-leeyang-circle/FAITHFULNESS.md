# 01 leeyang-circle (dependency of res-sparse-ferromagnet Thm. 3(i); also ap-leeyang-*, c1-leeyang-chain-closure, c2-polydisc-leeyang-bound)
Status: NO PROOF RETURNED (service declined Lean input). Statement only; typechecks on Lean v4.28 / Mathlib with `sorry`.
Statement review (of the statement, since there is no proof to review):
- `stageZ K z` = sum over subsets S of exp(sum_{p<q in S} K p q) * prod_{p in S} z p: the lane's occupation-number polynomial.
- Hypotheses: K symmetric, K >= 0; all |z p| e^{r_p/2} < 1 (resp. > 1), r_p = sum_{q != p} K p q. With zeta_p = e^{r_p/2} z_p this is the standard Lee-Yang polynomial with a_ij = e^{-K_ij/2} in (0,1] (identity checked by hand: prod_{i in S, j notin S} a_ij = exp(-(1/2) sum_{i in S} r_i + sum_{pairs in S} K)).
- No vacuous hypothesis (n = 0 gives Z = 1). Float check: `_scripts/sanity.py` (n = 4, 20000 random points inside the polydisc, min |Z| = 0.19).
- This is the classical multivariate circle theorem; the lane labels it CLASSICAL. It is not in Mathlib.
