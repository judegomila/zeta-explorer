# REFEREE2: c16-qa-filter-silent-cells-geometric-nodes

Second independent referee (lane `c17-referee-r16-lemma-h-sources`, 2026-11-20). Own derivations; own code
(`push/c17-referee-r16-lemma-h-sources/code/indep.py`, numpy, local, `scripts/memcap.sh 8`). Nothing here is a
statement about zeros of zeta. Labels: PROVED, CLASSICAL, MEASURED, READ.

**Verdict: HOLDS as a filter and a table (precise obstruction; four flags false), with the first independent
referee's corrections E1 to E7. Proposition M's constant 0.48 is confirmed for the sup hypothesis and is the
exact leading constant of the two-zero family.**

## 1. Main lemma re-derived (Lemma QA (b) and Proposition M)

Each factor (s - rho) of the multiplier contributes x^(rho - 1) to the density. Removed: 1/2 +- i g1, 1/2 +- i g2;
added: 1/2 +- eta +- i gbar. With L = log x:
D(x) = +-4 x^(-1/2) cos(gbar L) [cosh(eta L) - cos(d L)] (sign by the convention for nu).
cosh(y) - 1 <= (y^2/2) e^y and 1 - cos(y) <= y^2/2 give abs D <= 2 (eta^2 + d^2) L^2 e^(-(1/2 - eta) L); the
maximum of L^2 e^(-aL) is 4 e^(-2)/a^2, the integral of L^2 e^(-bL) is 2/b^3. So
sup abs D <= 8 e^(-2)(eta^2 + d^2)/(1/2 - eta)^2 and int x^(-sigma_0) abs D dx <= 4 (eta^2 + d^2)/(sigma_0 - 1/2 - eta)^3.
Both constants of Lemma QA (b) confirmed. PROVED.

Proposition M. Setting the sup bound equal to eps with d -> 0: eta/(1/2 - eta) = e sqrt(eps/8) = r, so
eta(eps) = (r/2)/(1 + r); leading order (e/(4 sqrt 2)) sqrt(eps) = 0.480529 sqrt(eps). The hypothesis
"nu_G >= nu_zeta - eps dx" is a one-sided sup condition and is met when sup abs D <= eps. Confirmed.
Sharper than the lane states: for eta -> 0, d -> 0 and gbar large, sup abs D = 32 e^(-2) eta^2 (1 + o(1)) (the
maximum of 2 eta^2 L^2 e^(-L/2) at L = 4), so 0.4805 sqrt(eps) is the exact leading reach of this family, not
only a lower bound for it.
Input "d can be taken arbitrarily small": pairs of zeros on the line with gap tending to 0. This follows from
Selberg's positive proportion (CLASSICAL) by counting; the two zeros need not be consecutive among all zeros
(the count (d4) changes by at most 1 in either case).

## 2. Checks

| check | result |
|---|---|
| rerun of the lane's `ref_check.py` (copy, output under the referee's directory) | 52 of 52 stored values of `ref_check.json` reproduced exactly; eta(eps) = 4.8007e-4, 4.7595e-3, 4.3840e-2 at eps = 1e-6, 1e-4, 1e-2 |
| sup abs D on a grid (step 2e-5 in L up to 80), gbar = 5000, d = 1e-4, eta = 0.002, 0.01, 0.05 (not used by the lane) | 1.7366e-5, 4.3317e-4, 1.0863e-2; ratio to the lane's bound 0.992, 0.961, 0.813 (bound holds); eta/sqrt(sup abs D) = 0.4799, 0.4805, 0.4797 against e/(4 sqrt 2) = 0.4805 |
| sup of the negative part of D, same cases | equal to sup abs D to 5 digits (the one-sided hypothesis of Proposition M costs nothing) |
| p-norm reach at sigma_0 = 1 (first referee E1) | eta^2 (32 e^(-2) + 32) <= eps gives 0.166 sqrt(eps): confirmed |

## 3. Sentences false as written

1. (first referee E1; confirmed) Outcome item 2: "With a margin eps in the density norm ... zeros at distance up
   to eta(eps) ... (0.48 sqrt(eps) to leading order)". With the norm p of Lemma QA (b) the reach is
   0.166 sqrt(eps) at sigma_0 = 1 and depends on sigma_0. The constant 0.48 belongs to the sup hypothesis of
   Proposition M (sections 2.3, 4 row U3-4, 5), where it is correct.
2. (first referee E2, E4, E7) as listed there; not re-derived beyond E1 and E4 (E4: the bound of Lemma C (i)
   tends to 0 only along pairs with d/g1 -> 0; agreed).
3. No further false sentence found in sections 2.2 and 2.3. The table (71 node typings) is READ by one reader;
   this pass did not re-read node statements.

## 4. Requirement flags

No change: R1 = R2 = R3 = R4 = false. No statement about zeros of zeta.
