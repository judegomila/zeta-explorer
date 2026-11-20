# c18-referee-r17-independent-sources: RESULT

Date 2026-11-20 (campaign round 18). Kind: repair (Repair A: second, independent referee passes owed from round 17). No attack. This lane cannot raise the headline.

## Top of file: statements about zeros of zeta; failed PROVED labels used by a map row

- Statements about zeros of zeta: none, in the four refereed lanes or here.
- Failed PROVED labels: none in lanes `c17-u6e`, `c17-u6f`, `c17-u3` within the assigned scope. In `c17-window-information-law-ctheta-u5` three labels fall to ARGUED and two control rows change. Each is used by map row Q31 or by the corrections line of that lane (map line 661):
  1. (W4) density form ("only with off-line pair density of order u/2 pi over a length of order b_max"): ARGUED. Row Q31 may keep the count form W4c only.
  2. (W5) second bullet (sequences of isolated pairs with a height-coupled band): ARGUED. Proved at one band and equal offsets by this referee (W5c).
  3. Section 3, "N(theta) holds if and only if the truncated data extend to a function with positive real part (Remark K)": ARGUED for the windowed N(theta); holds for the unwindowed device. This is the gate statement (`GATE.md`).
  4. Control row zeta(s+a) zeta(s-a): the lane's "fails in a window" cites a measurement of a different configuration, and the map's corrected text "passes for every u <= Lg in the lattice model" is true for the lattice only. New run on the control's own configuration on zeta's ordinates (ball arithmetic): passes for a <= 0.22 and fails for a >= 0.24 at theta = 1/2, M = 0 (same bracket for window half-lengths 30 and 45); passes for a <= 0.02 and fails for a >= 0.05 at theta = 0.8, M = 0. The failure is through the size of the shifted coefficients and the small eigenvalues of the on-line form near the Nyquist band, not through a structural step.
  5. Control row Davenport-Heilbronn "fails at large height; pairs isolated": not established, not run.
- Gate for lanes `c18-tz-one-sided-bound-fe-reserve-bridge` and `c18-tz-band-completion-controls-server`: Theorem 1 HOLDS (form domain C_c^infinity); Remark K HOLDS for the unwindowed device and does NOT apply to the windowed N(theta). Filed first, in `GATE.md`.

## 1. Plan

For each of the four lanes: derive the statements in scope from the lane's result file without opening the first referee file; run independent numerics; then open the first referee file and record agreement and additions; write `REFEREE2.md` in the lane's directory. For the window-law lane also: file `GATE.md` first; rerun one ball-arithmetic table entry at theta = 1/2 and at theta = 2 on the server with independent code; try to open the three sources; decide the three items listed as not established.

Decisive first test (this lane): the bit-for-bit rerun of the two table entries by a different criterion. It passed.

## 2. Verdicts

| Lane | Scope | Verdict | PROVED labels that break | Referees now |
|---|---|---|---|---|
| `c17-window-information-law-ctheta-u5` | Theorems 1 to 6, Lemma P, Lemma E, Corollary T', Remark K, sources, W4, W5, DH and E_a rows, two reruns | holds with corrections | W5 second bullet (PROVED -> ARGUED); W4 density form and the Remark K sentence of section 3 (stated as established -> ARGUED); E_a row (MEASURED on another configuration) | 2, both hold |
| `c17-u6e-bost-connes-non-invariant-state-twin-ladder` | Lemma G; Lemma T (norm distance) with V_n* g = n^-s g(n .) | holds with corrections | none (Lemma G relabelled CLASSICAL; T-NR vector is b = D, not D^(1/2)) | 2, both hold |
| `c17-u6f-isogenous-points-norm-jensen-gap` | norm identity; limit log(p/(p+2)); Epstein rows n = 5, 6; non-vanishing | holds with corrections | none (reading of "Epstein passes (J)": A_p vanishes once on the arc for the control, J = -infinity there) | 2, both hold |
| `c17-u3-inequality-discontinuity-functional` | Proposition W; Lemma LR; kappa_0 = 0.0485883 | holds with corrections (wording) | none | 2, both hold |

## 3. Work

### 3.1 Window-law lane (`push/c17-window-information-law-ctheta-u5/REFEREE2.md`)

- All eight statements re-derived; details in the referee file. Numeric checks of the one-pair extremal function, the roots, and the constants 0.2927 and 5.8454 (`ref2_checks.py`).
- Rerun on the server (independent code `ref2_wil.py`; criterion neg(T) = pos(K + V* T0'^-1 V) - pos(K) from the inertia of a block matrix; 1024-bit balls):

| Entry, T = 1e6, one pair at the ordinate nearest T | lane | rerun |
|---|---|---|
| theta = 1/2, M = 0 | 0.34566484374999995 | 0.34566484374999995 |
| theta = 2, M = 1 | 0.0249923828125 | 0.0249923828125 |

All 13 bisection verdicts agree in each case; the on-line block has inertia (172, 171), which certifies the background form.
- Sources. Turan's second main theorem: primary sources not reachable; a refereed secondary source (van der Poorten, Bull. Austral. Math. Soc.) supports the constant 8e (Uchiyama; Sos-Turan); the factor 2 is printed by one of three secondary sources only (effect: log 2 in the logarithmic term; 5.85 unchanged). "Relative to" stays. Fejer-Riesz for exponential type: Akhiezer's theorem at secondary level (cites Boas pp. 124-132); its zero condition holds on K_u. Explicit formula: re-derived in the operator normalisation; signs correct; the pole-term bound is for indicator vectors only.
- The three items: W4 density form not established (count form holds); W5 sequence form not established (one-band, equal-offset form proved here relative to Plancherel-Polya); DH row not established; E_a row decided by a run:

Number of negative directions of T (0 = the configuration passes the complete device; every sign certified):

| theta (theta' = u/Lg) | M | window half-length | a = 0.005 | 0.02 | 0.05 | 0.1 | 0.2 | 0.22 | 0.24 | 0.26 | 0.28 | 0.3 | 0.45 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.5 (0.577) | 0 | 45 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 3 | 5 | 8 | 18 |
| 0.5 (0.577) | 0 | 30 | - | - | - | - | 0 | 0 | 1 | - | - | 6 | - |
| 0.5 (0.577) | 1 | 45 | 0 | 0 | 0 | 0 | 0 | - | - | - | - | 6 | 16 |
| 0.8 (0.923) | 0 | 45 | 0 | 0 | 2 | 11 | 30 | - | - | - | - | 42 | 53 |
| 0.8 (0.923) | 1 | 45 | 0 | 0 | 0 | 6 | 26 | - | - | - | - | 38 | >= 51 (3 pivots undecided at 512 bits) |

Largest passing a: between 0.22 and 0.24 at theta = 1/2, M = 0 (the same bracket with window half-length 30 and 45); between 0.2 and 0.3 at theta = 1/2, M = 1; between 0.02 and 0.05 at theta = 0.8, M = 0; between 0.05 and 0.1 at theta = 0.8, M = 1. For comparison the one-pair threshold of the lane at theta = 1/2, M = 0 is 0.346 at this ordinate.

Prime-side screen without the lattice model (float64, indicator vectors, `ref2_ea_prime.py`): at theta = 1/2 the maximum of the weighted prime sum over the window reaches 18.56, 23.86, 40.35 for a = 0.2, 0.3, 0.45 against the reserve 23.955; at theta = 0.8 it is 23.25, 33.92, 70.40 for a = 0.1, 0.2, 0.3. The root mean square agrees with sqrt(sum w_n^2/2) to 4 per cent.

Reading: on zeta's ordinates the control is not a lattice row. Its form is T_a = E_- T_Gamma E_+ + E_+ T_Gamma E_- with kernel 2 cosh(a (s - s')) k(s - s'); the factor cosh is not positive definite and is invisible only when k is a multiple of the delta function (the lattice). The complete device fails earlier near the Nyquist band (a = 0.05 at theta' = 0.92 against 0.24 at theta' = 0.58), where the on-line form has small eigenvalues; the indicator sub-device fails where the prime sum with coefficients Lambda(n) n^(-1/2)(n^a + n^-a) reaches 2 log(t/2 pi) + 2M. The failure is through coefficient size. It is not a structural step, and for small a the control passes.

### 3.2 Bost-Connes lane (`.../c17-u6e-.../REFEREE2.md`)

Lemma G re-derived (standard). Adjoint computed: V_n* g = n^(conj(s) - beta) g(n .) = n^-s g(n .). Lemma T re-derived: local overlaps, restriction to the Toeplitz tensor algebra, the bound log F_p <= -0.402 p^-beta (1 - cos(tau log p)), divergence for beta <= 1 from the pole of zeta at 1 and boundedness at 1 + i tau, equality for beta > 1 from irreducibility on l^2(N) (commutant argument written). Numeric: partial product to 2e5 at beta = 1.5, tau = 1 gives -0.73401 against -0.73421.

### 3.3 Isogenous-points lane (`.../c17-u6f-.../REFEREE2.md`)

Norm identity re-derived from the eta quotient without lane n3; sum identity; Lemma J and the limit; the Corollary for Epstein forms at inert primes. Numeric (mpmath 40 digits, every point value): identities to 1e-36 or better; J(1e-3) equals log(p/(p+2)) to 10 digits for p = 3, 5, 7. Non-vanishing: (i) point values are non-zero (theta has no zeros) but as small as 3.7e-21; (ii) for the Epstein control A_p has one zero on the arc (x = 0.040654 for n = 5, p = 11; 0.034401 for n = 5, p = 13; 0.031403 for n = 6, p = 13), where J = -infinity; for theta A_p > 0 on the whole arc; the difference is the weight (1/2 against 1), not arithmetic; (iii) the Epstein zeta functions of [1, 0, 5] and [1, 0, 6] have zeros off the line, found at 0.93297 + 15.66825 i and 0.80375 + 15.11758 i (and three more; Newton, 20 digits, not ball-certified).

### 3.4 U3 lane (`.../c17-u3-.../REFEREE2.md`)

Proposition W (a) to (d) and Lemma LR re-derived; zeros checked numerically to 1e-40. kappa_0 = 1/2 - Si(2 pi)/pi = 0.0485883332. Lemma S6 holds relative to the self-duality step of c16 Proposition T for signed N (not re-derived here). Wording corrections: the factor at q is a polynomial local factor with a unit shift; the clusters overlap for n >= 1/delta.

## 4. Controls

This lane makes no argument, so no control is run against one. Control rows of the refereed lanes that were checked:

| Control | Lane | Outcome of this pass |
|---|---|---|
| zeta(s+a) zeta(s-a) | window law | row rewritten: passes for small a, fails for larger a, through coefficient size (run, section 3.1) |
| Davenport-Heilbronn | window law | row not established; not run |
| T-NR | Bost-Connes | twin is conjugation by an invertible element (Lemma G holds); vector with T-NR coefficients is D xi_s |
| DEL (finite S), E_a | Bost-Connes | pass every step of Lemma T as the lane says (overlap formula does not depend on nu) |
| Epstein n = 5, 6 | isogenous points | pass (N) and J < 0 at inert primes with J = -infinity at one point; have off-line zeros (re-measured) |
| Proposition W member, NR-q | U3 | zeros on Re s = 1/2 +- b as stated |

## 5. Requirement flags (this lane and the four refereed lanes)

- R1 false. No refereed lane has an inequality that uses multiplicativity; evidence: Lemma E of the window lane holds for every multiplicative chain; in the Bost-Connes lane multiplicativity gives non-vanishing right of 1 only; in the U3 lane no proved step uses it.
- R2 false. No inequality at height t inside the strip is established in any of the four lanes.
- R3 false. Controls pass: T-NR and ZQ rows and E_a for small a (window law); DEL and E_a (Bost-Connes); Epstein at inert primes (isogenous points); the Proposition W member (U3).
- R4 false. Nothing crosses to the critical line; the window lane's exact device above the Nyquist band is the target in a window.

## 6. Three weakest steps of this pass

1. The E_a run uses the lane's window model (zeta's stored ordinates in abs(gamma - 1e6) <= 45, a lattice row outside) at one height (1e6); the window half-length was varied once (30 against 45: same bracket) and the bands are theta = 1/2 and 0.8 only; one cell (theta = 0.8, M = 1, a = 0.45) has 3 pivots undecided at 512 bits and is a failure by the count already certified. The statement "fails at a positive proportion of large heights for fixed a and theta" is ARGUED from moments and not written out; the prime-side table is float64 and covers the indicator vectors only.
2. Sources are at secondary level: Turan's theorem (the factor 2 unresolved), Akhiezer's factorisation, Krein's extension theorem in distribution form, Plancherel-Polya (used in W5c, which is new here and has no referee).
3. Scope. In the Bost-Connes, isogenous-points and U3 lanes only the items named in the assignment were re-derived (Lemmas K, S, E (c), D, R, the Mellin decay rates and the server LP were not). Lemma S6 is relative to the signed-measure form of c16 Proposition T. The off-line zeros of the Epstein zeta functions are Newton roots at 20 digits, not enclosures.

## 7. Files

- `GATE.md` (filed first).
- `REFEREE2.md` in each of `push/c17-window-information-law-ctheta-u5/`, `push/c17-u6e-bost-connes-non-invariant-state-twin-ladder/`, `push/c17-u6f-isogenous-points-norm-jensen-gap/`, `push/c17-u3-inequality-discontinuity-functional/`.
- `ref2_wil.py` (rerun), `ref2_ea.py`, `out_ea*.json` (E_a run), `ref2_ea_prime.py`, `ref2_ea_prime.json` (screen), `ref2_checks.py`, `ref2_checks.json` (local checks), `logs/` (server unit logs), `zeros_1e+06.json` (copy of the c16 ordinates), `lanes_records.jsonl` (records in the METRIC.md format for the learn step; `campaign/lanes.jsonl` was not edited).
- Server units, all through rhrun, all finished or stopped by this lane, none left running: rh-c18ref-a-1120043109, rh-c18ref-b-1120043109 (2 cores, 4 GB each), rh-c18ref-ea-1120043540 (4 cores, 8 GB), rh-c18ref-ea2-1120044726 (4 cores, 6 GB), rh-c18ref-ea3-1120044726 (stopped by this lane after seconds to stay at 8 cores), rh-c18ref-ea3-1120045219 (4 cores, 3 GB; window half-length 30). Held by the lane: 8 cores at most, except under one minute at 12 before the first ea3 unit was stopped; resident memory below 2 GB. One launch was refused by rhrun for machine memory (45 GB available) and repeated with a 3 GB limit.
- Web sources opened: Wikipedia "Turan's method" and "Akhiezer's theorem"; van der Poorten (Cambridge Core PDF); Kerr, "Power sums" slides (ANU); arXiv 0706.4131 (no statement of the theorem found there).

## 8. Proposed map text (not applied; this lane does not edit the map)

Row Q31, replace the bracketed gate by: "[two referees hold with corrections]". Replace "and only with off-line pair density of order u/2 pi" by "and a single cluster of radius r that passes has at least (u b_max - 1.2 log((M + 2 pi D')(r + 1/2)))/5.85 pairs (relative to Turan); the density form is ARGUED". Controls: "zeta(s+a) zeta(s-a): lattice model passes for u <= Lg; on zeta's ordinates at 1e6 (ball arithmetic, window model) passes for a <= 0.22 and fails for a >= 0.24 at theta = 1/2, M = 0 (same bracket for window half-lengths 30 and 45); passes for a <= 0.02 and fails for a >= 0.05 at theta = 0.8, M = 0. The failure is through the size of the shifted coefficients and the small eigenvalues of the on-line form near the Nyquist band, not through a structural step. DH: not run." Add: "Remark K (Krein extension) applies to the unwindowed device; for the windowed N(theta) the equivalence with a positive completion is ARGUED." Rows S12b, Q30, P45: the reach sentences may be replaced by row Q31 with these changes.
