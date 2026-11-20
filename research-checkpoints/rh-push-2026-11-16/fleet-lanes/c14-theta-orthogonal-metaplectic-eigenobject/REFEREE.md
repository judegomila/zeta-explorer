# REFEREE.md: c14-theta-orthogonal-metaplectic-eigenobject

## Self pass (author; not independent), 2026-11-19

This lane could not start an independent referee agent. The pass below was made by the author after RESULT.md was written, with a second script (`ref_check.py`) that shares no code with `checks.py` or `checks2.py`: Jacobi symbols as products of Legendre symbols by Euler's criterion, the sums K(m, c) straight from the definition, closed forms typed by hand from RESULT.md section 2. An independent referee is owed. `refereeHolds` is recorded as null.

**Outcome of the pass: the verdict (precise obstruction, stage A only) stands. Flags R1 = R2 = R3 = R4 = false. No statement about zeros.**

### Re-derivations

1. Lemma 1. Reciprocity step re-done for d > 0 odd, c' > 0 odd: `(c'/d) = (d/c') (-1)^((d-1)(c'-1)/4)`. The dependence of the 2-part on c' mod 8 follows from the substitution d -> d c' (for a = 2 it is c' mod 4). Multiplicativity of `eps^(-1) G_m`: checked on (3, 3), (3, 5), (3, 7). Holds.
2. Lemma 1' (i). Sums over d mod 4 and mod 8 re-done by hand for r = 1, 3, 5: values (1+i) 2^(a-2) and 4 e^(i pi/4) 2^(a-3). r = 7 by the script only. The reduction `U_a(n^2, r) = U_a(4^j, r)` uses n'^2 = 1 mod 8 and a <= 2j + 3. Holds.
3. Lemma 1' (ii). `L_p(-p^(-1/2)) = 0` re-done; the telescoping sum is correct. Holds.
4. Hecke relation: the exponents (p, p^(-1/2), p^(-1); eigenvalue p^(2s-1) + p^(1-2s)) were derived from Shimura's weight-1/2 formula with the normalisation b(m) = A(m)|m|^(s-1) and then tested, not fitted. Defect 1e-13 in the closed-form path; 1.6e-6 relative in the series-only path at p = 11, 13 (truncation level). Holds as a checked identity; its proof is cited as CLASSICAL, not written out.
5. Count. `P - beta_0 = 1` and `P - 1 <= w*(P, d)` for d >= 2: algebra re-done. Holds.
6. Lemma E (ii). Green's formula: with both leading coefficients zero at every cusp the constant terms are O(y^(1 - sigma_max)), 1 - sigma_max < 1/2, and the non-constant part decays exponentially; boundary term at height Y is O(Y^(1 - 2 sigma_max)) -> 0. For a multiplier system the weight-k Laplacian is symmetric on such functions. Holds.

### Numeric checks, second path (`ref_check.json`)

| Check | Outcome |
|---|---|
| series to c <= 1400 against hand-typed closed forms of A(1), A(0), A(9), A(25), at s = 1.6 + 0.45i and 1.75 - 1.2i | differences 1.2e-8 to 3.4e-7 (truncation level; |A(1)| = 0.022, 0.011) |
| Hecke relation at p = 11, 13, m = 1, 2, 5, -3, series only | relative defect 2.5e-8 to 1.6e-6 |
| zeros 1, 3, 4, 5: |A(1, s_rho)| | at most 2.1e-25 (25 digits) |
| same zeros: |A(5)|, |A(-3)| | 1.0831, 1.2472, 2.2640, 0.1869; 0.7433, 1.5873, 0.7853, 1.3226 |
| zero 1 against `checks.json` | |A(5)| = 1.0830919306282156 in both; |A(-3)| = 0.74326060061157 in both |
| min of w*(1 + beta_0, d) - beta_0 on the grid | 0.2 |

### Defects found in this pass

1. The first version of `ref_check.py` gave |A(5)| = 1.0735 and |A(-3)| = 1.0652 at zero 1, against 1.0831 and 0.7433 in `checks.json`. Cause: an error in the referee script (the local factor `1 - p^(-2u)` at the prime p = |m| was dropped while the same factor was removed from zeta(2u)). After the correction both paths agree to 16 digits. `checks.py` was not changed. Recorded because the disagreement was real before it was traced.
2. A first draft of the sanity paragraph (section 0) said the published LRS exponent would read `|beta - 1/2| <= 3/10` for this object. That reading belongs to the weight-0 image; on the weight-1/2 side the threshold with P = 1 is 3/5 and is vacuous. Corrected in RESULT.md before this file was written.
3. `c_inf` in the first run of `checks.py` was typed with `2^(2-2s)` and disagreed with the quadrature by a factor 2; the formula in RESULT.md is the corrected one (`2^(1-2s)`), equal to the quadrature to 17 digits.

### Points an independent referee should test

- Lemma 3(a): the regularised Rankin-Selberg statement for `Gamma_0(4)`, weight 1/2, three cusps. Only the exponents were measured (one decade in X). The residue at the rightmost pole was not compared with a predicted constant.
- Step S3 (twists by non-quadratic characters entire) and the remark on the forced vanishing for twists are ARGUED. They do not enter the verdict.
- Lemma V: the level and multiplier of `f_q` are relative to Shimura 1973, Lemma 3.6, for non-holomorphic forms; `f_q` was not computed as a function.
- Control rows DH and T-NR are paper statements.
- The claim "for every m only the trivial character mod 8 occurs" is MEASURED for |m| <= 2000; proved here for squares only.

### Flags

R1 false (the Hecke relation at all odd squares is an identity for every parameter; no inequality consumes it). R2 false (vacuous output). R3 false (generic parameter passes the count; NR-vec passes the orthogonality step). R4 false (no bound on beta).

---

## Independent referee pass (adversarial, lens: general), 2026-11-19

Not the author. Scripts kept outside the lane directory (`/tmp/c14ref/r.py`, `g.py`), run as `scripts/memcap.sh 8 .venv-arb/bin/python -I <file>` (5 s and about 3 min, local, under 300 MB). The compute server was not contacted. No file other than this one was changed.

**Outcome: the verdict holds (precise obstruction, stage A only, no statement about zeros of zeta). Flags R1 = R2 = R3 = R4 = false. Four corrections are required in RESULT.md; none changes the verdict.**

### Re-derivations (by hand)

| Step | Label in RESULT | Outcome |
|---|---|---|
| Lemma 1 (factorisation of K(m, c)) | PROVED | Confirmed. `(c/d) = (2/d)^a (d/c') (-1)^((d-1)(c'-1)/4)` for d, c' odd positive; multiplicativity of `eps^(-1) G_m` from the two sign rules. |
| Lemma 1' (row D = 1) | PROVED | Confirmed. `W_0 = (1+i) 2^(-4s) + 4 e^(i pi/4) 2^(-6s) = (1+i) 2^(-4s) (1 + 2^(1-u))`; `prod_{p odd} (1 + p^(-u)) = zeta(u)/((1 + 2^(-u)) zeta(2u))`; `L_p(-p^(-1/2)) = 0` by telescoping. |
| Constant term A(0, s), phi_inf | PROVED | Confirmed: geometric sum over even a gives `(1+i) 2^(-4s)/(1 - 2^(2-4s))`; odd part `zeta(4s-2)(1 - 2^(2-4s))/(zeta(4s-1)(1 - 2^(1-4s)))`; `e^(-i pi/4)(1+i) = sqrt 2` gives `pi 2^(5/2-6s)`. c_inf matches the standard integral `int (t+i)^(-a)(t-i)^(-b) dt` with a = s + 1/4, b = s - 1/4. |
| Lemma 2, row generating function | CLASSICAL, checked | Recursion re-derived: `c_k = p^k b(t p^(2k))`, `c_(k+1) = lambda c_k - c_(k-1)` (k >= 1), `c_1 = (lambda - p^(-1/2)(t/p)) c_0`. Confirmed. |
| Consequence at a zero | PROVED | Confirmed from Lemma 1' alone (every A(n^2, s) carries `zeta(u)/zeta(2u)`; `zeta(2 rho) != 0` for beta >= 1/2). The stated route "b(1) = 0 plus Lemma 2" is incomplete: see correction 1. |
| Lemma 3(a) pole positions | PROVED relative to an unopened source | Not confirmed from the source (not opened by me either). Consistent with Zagier's form (terms `c/(1 - w - alpha)` and `c phi^0(w)/(w - alpha)` up to sign), and with a direct heuristic that does not use Rankin-Selberg: `|b~(m)|^2 = |m|^(2 sigma - 1) |L(u, chi_m)|^2 x (bounded)`, mean of `|L|^2` over m is bounded for Re u > 1/2, giving `X^(2 sigma)`; for Re u < 1/2 the functional equation of `L(u, chi_m)` gives `X^(2 - 2 sigma)`. Exponents re-measured at new parameters (below). |
| Lemma 3(b) | from Lemma 2 | Confirmed (X = p^(-w), weight n^(1-w)). |
| Lemma 3(c) | CLASSICAL | Confirmed: `|W|^2 ~ y^(2 min(sigma, 1 - sigma))` at 0, convergence for `Re w > |2 sigma - 1|`; the two connection coefficients are non-zero for tau != 0. |
| The count, (C) | algebra | Confirmed: `P - 1 <= w*(P, d)` iff `A >= 2(P - 1)` iff `(d-1)/2 + (d-2)(P-1) >= 0`. w*(1, 4) = 3/5 equals the LRS value 1 - 2/(n^2+1), n = 2. The observation that the gamma pole `beta - 1/2` equals the reflected polar point `1 - (3/2 - beta)` is exact and does not depend on the c13 threshold. |
| Section 4 | PROVED from section 2 | Confirmed: `u' = rho/2`, `P = 3/2 - beta/2`, `beta_0 = 1/2 - beta/2`; `zeta(rho - 1) != 0` since Re(rho - 1) < 0 and rho is not real. "Simple zero" is stated as an assumption for the proportionality constant only. |
| Lemma E (i), (ii) | PROVED | Confirmed. With the dominant coefficient zero at every cusp, `|F|^2 y^(-2) ~ y^(2 sigma_min - 2)`, `2 sigma_min < 1`, so F is in L^2 and the eigenvalue is real; `Im s(1-s) = tau (1 - 2 sigma)`. This is the classical statement that L^2 eigenfunctions of the weight-k Laplacian have real eigenvalue; it is not new and is not presented as new. |
| Lemma E (iii) | relative to the same unopened source | Arithmetic `2 sigma_max - |2 sigma - 1| = 1` confirmed. Non-cancellation: diagonal weight-0 scattering entries are positive at real w > 1 (Dirichlet series with non-negative coefficients). The header label "PROVED" should read "PROVED for (i), (ii); (iii) relative". |

### Numeric checks rerun with different cases (own code for the series and the hand formulas)

| Check | Case (not in the author's files) | Outcome |
|---|---|---|
| Series from the definition (own Legendre/Euler-criterion symbol, c <= 600) against Lemma 1' typed by hand | s = 2.2 + 0.3i, m = 4, 16, 36, 49, 100 (even squares and p^2 with p = 7) | differences 3.8e-10 to 4.7e-10 with \|A\| = 0.0032 (truncation level) |
| Same series against the author's `A_closed` | m = 13, -1, 2, -6, 26, -4 | 2.8e-12 to 4.2e-11 |
| A(0, s) series against closed form | same s | 1.9e-10 |
| Hand formula against `A_closed` | same squares | at most 6.7e-17 |
| Row D = 1 at zeros 7 and 20 (30 digits) | n^2 = 1, 4, 16, 49, 100, 121 | at most 5.6e-30 |
| Other rows at zeros 7 and 20 | m = 5, -3, 2, -1, 13, -6 | 0.229 to 1.868 (zero 7); 0.405 to 1.136 (zero 20) |
| Hecke relation, closed-form path | p = 11, 13; m = 2, 2p, 2p^2, -1, -p^2, 6, 3p^3, 4, p^2; zero 7 and s = 0.61 - 2.7i | defect at most 3.1e-12 (float Gauss-sum values), smallest non-zero right side 1.2e-3 |
| Mean square, generic parameter (control) | u = 0.9 + 10i (sigma = 0.70), X = 250..4000 | `S/X^1.4` = 0.1037, 0.1030, 0.1035, 0.1035, 0.1038; local exponents 1.390, 1.407, 1.400, 1.405 |
| Mean square, left of the line | u = 0.1 + 21i (sigma = 0.30) | `S/X^1.4` = 1.0825, 1.0820, 1.0819, 1.0833, 1.0832 |
| Mean square at zero 2 | X = 250..4000 | `S/(X log X)` = 0.269, 0.258, 0.252, 0.249, 0.245 (slow drift, as in the author's table for zero 1); `S/X` grows 1.48 to 2.03; part from squares below 3e-27 |

The rule `P = 1 + |2 sigma - 1|` is confirmed at two further parameters over 1.2 decades. At sigma = 1/2 the data are consistent with `X log X` plus a lower-order `X` term; they do not by themselves separate a double pole from a slowly varying factor. The verdict does not depend on that case.

### Controls run by this referee

No zeta-only mechanism is claimed (R3 = false), so the task here was to confirm that controls pass.

1. Generic parameter: rows above. The count reads only the exponents; they follow `1 + |2 sigma - 1|` with no zero of zeta involved. Passes, as stated.
2. New control found in this pass (2-adic zero). At `u_0 = 1 + i pi/ln 2` the factor `1 + 2^(1-u)` of A(1, s) vanishes while `|zeta(u_0)|` = 0.7295. Measured: `|A(1)|` = 4e-32, `|A(9)|` = 3e-32, `|A(4)|` = 0.2162, `|A(16)|` = 0.3243. So `b(1) = 0` holds, all odd-square coefficients vanish through the Hecke relation at odd p, and the even-square coefficients do not vanish. The second moment there follows `X^1.5` (`S/X^1.5` = 0.066, 0.065, 0.066, 0.065, 0.065), the generic rule. See correction 1.
3. NR-vec (Lemma V): re-derived on paper; see correction 2.
4. DH and T-NR rows: paper statements, not constructed by the author and not constructed here. They feed nothing in the verdict.

### Corrections required in RESULT.md

1. **"One linear condition b(1) = 0, propagated to the whole row by the Hecke relation at squares" is false as stated.** Lemma 2 is stated for odd p, so `b(1) = 0` gives `b(n^2) = 0` for odd n only. The even squares need the 2-adic computation of Lemma 1' (the factor `zeta(u)` in every `W_j`-row) or a relation at p = 2, which RESULT.md does not state. Counterexample to the literal statement: control 2 above. Consequences: (a) T0 in section 3 is "b(1) = 0 and b(4) = 0" (or "b(4^j) = 0 for all j"), or equivalently Lemma 1' directly; (b) in Lemma V, "the Whittaker functional equals `zeta(2s - 1/2)/zeta(4s - 1)` times non-zero local functionals" is wrong at the prime 2 for the level-4 vector: the local factor at n = 1 is `(1 + 2^(1-u))/(1 + 2^(-u))`, which vanishes on Re u = 1; (c) the summary sentence in the claim and in MAP_ROW/lanes_line should be amended the same way. The vanishing of the full row at zeros of zeta is unaffected (confirmed at zeros 1, 3, 4, 5, 7, 20 for even and odd n).
2. **Lemma V, definition of the principal twist.** With the stated formula `F x chi = g(conj chi)^(-1) sum_j conj(chi)(j) F(z + j/q)` and chi = chi_q^2 (principal), the Gauss sum is the Ramanujan sum: g = -1 and the coefficient multiplier is 1 for q not dividing m and `-(q - 1)` for q | m, not the indicator of (m, q) = 1. Then `f_q` has coefficient `-(q-1)/2 * b(m)` at q | m, the squares n^2 with q | n do not vanish, and the constant term is multiplied by `-(q-1)/2`. Repair: replace `F x chi_q^2` by `F - (1/q) sum_{j mod q} F(z + j/q)` (coefficients `b(m) 1[q does not divide m]`). With that definition the coefficient statement `b(m) 1[(m/q) = -1]` is correct, all square-index coefficients vanish at every s, and `f_q` is still a combination of unipotent translates at q. Note also that the repaired `f_q` has zero constant term at infinity, so by Lemma E(ii) its dominant exponent sits at another cusp; the sentence "the object is not zero" is right but the level and multiplier statement remains relative to the unopened Shimura lemma.
3. **Stale numbers.** RESULT.md section 2 and the table in the author's pass above give, for zeros 3, 4, 5, `|A(5)|` = 1.247, 2.264, 0.187 and `|A(-3)|` = 1.587, 0.785, 1.323. `ref_check.json` on disk gives 1.1737, 2.6616, 0.1631 and 1.6848, 0.9738, 1.7615, and the author's own `A_closed` (30 digits, run by this referee) gives the same values as the file. The text values are from the uncorrected first version of `ref_check.py` (defect 1 of the author's pass) and must be replaced. All are non-zero; the statement "other rows do not vanish" stands for the tested m.
4. **Labels.** Lemma E header: (iii) is relative to the regularised Rankin-Selberg method, as the text says; the header should not read PROVED without that qualifier in the summary lines (section 8 item 3 and the campaign claim say "Lemma E: the same for every rank-one eigenfunction with non-real eigenvalue" without it). "Other rows do not vanish" is MEASURED for the listed m at the listed zeros; in general it is the statement `L(rho, chi_t) != 0`, which is not proved for all t and all rho and should not be written as a general fact.

### Checks requested by the assignment

- RH assumed anywhere: no. `zeta(2 rho) != 0` uses beta >= 1/2 only; section 4 uses Re(rho - 1) < 0.
- Verified height restated: no. Zeros are used only as test points for identities.
- Known theorem presented as new: no. Lemma 1, 1', the constant term and the Hecke relation are labelled CLASSICAL in form and "derived here"; Lemma E (i), (ii) is the classical reality of L^2 eigenvalues. Section 8 claims only that the derivation and the closure of the device type are recorded.
- Scope of "closed": rank one only, and relative to the regularised Rankin-Selberg method (unopened) for the pole positions. The exponent rule itself is supported by measurement at five parameters and by the direct mean-square heuristic above.

### Flags (set by this referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | Multiplicativity enters through identities valid at every parameter; no inequality uses it. After correction 1 the Hecke relation is not even the source of the full row. |
| R2 | false | Output (C) is true for every beta: nothing is concluded in any window. |
| R3 | false | The generic parameter passes the count; the 2-adic zero passes "b(1) = 0"; the repaired `f_q` passes the row condition at every parameter. |
| R4 | false | No bound on beta. |

holds = true for the claimed verdict (precise obstruction, no statement about zeros), subject to corrections 1 to 4.
