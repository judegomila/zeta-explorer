# REFEREE.md: c21-statement-o-line11-control-table-40-digits-server

Status of this file: a recomputation by the same lane with separate code. It is not an independent referee and does
not count as one. What is independent: the arithmetic (mpmath 1.x floating point at 50 to 95 digits instead of Arb
balls), the special-function code (mpmath zeta, zetazero, digamma, gammainc instead of Arb), the quadrature (mpmath
tanh-sinh on subdivided sides instead of `acb.integral`), the source of the zeros (mpmath `zetazero`, closed forms for
the T-NR factor, Newton from 4-digit starts for DH). What is shared: the formulas of RESULT.md section 2 (same author),
and the rectangle edges and rates, which are read from `out_main.json`. Runs on the server through `rhrun` (mpmath is
not installed on the Mac). Scripts: `referee.py` (cells B, C, D), `referee_A2.py` (DH). Outputs: `referee_*.json`.

## Cells recomputed

| cell | control, row | mpmath result | table (Arb) | agreement of the parts |
|---|---|---|---|---|
| B | unimodular twist (alpha = 1), row P8, rate 0.375 - 13.375 i, R = [-2, 2] x [9.5, 45.5] | contour count 8.0; cell_gen = -7.6e-50 + 5.3e-51 i; **cell_sym = -4.7462** | cell_gen: 0 +- 6.1e-49; cell_sym: excludes 0, -4.74623 +- 6.1e-49 | W_R, C_R, Q_sym, Q_gen agree with the Arb midpoints in all 45 printed digits (W_R = 5.08405450335010163..., C_R = -0.0271684805000217931..., Q_sym = 0.364993754367193270..., Q_gen = 5.11122298385012342...) |
| D | T-NR (q = 2, c = 17/8), row P8, rate 0.375 - 4.625 i, R = [-2, 2] x [1.5, 20.5] | contour count 5.0; cell_sym = cell_gen = 7.3e-49; W_R - pair formula = 0 | 0 +- 6.5e-49 (both forms); pair cell 0 +- 1.3e-73 | all 45 printed digits (W_R = -10.4949927965414926..., C_R = -0.0956267364146306..., Q = -10.3993660601268619...) |
| C | zeta, row P45, s = 1/2 + 20 i, Y = 30.5, R = [-1/2, 24] x [-31.6875, 31.6875] (95 digits, N = 6000) | cell = 2.4e-59 - 1.3e-59 i | 0 +- 4.3e-47 | S_Y, Res: all 45 printed digits; TU and C3 (size 6.1e22): all 45 printed digits (TU = 61045684784777358021130.7325094776768169495338 - 18198124968338089772944.43617618... i) |
| A2 | DH, row P8, rate 0.375 - 85.75 i: pointwise parts only | zeros by Newton: +-0.30851718245663738555335196 + 85.69934848537759217192926771 i, abs f = 3e-60 and 5e-60 there, pair symmetric to 4e-62; Q_sym - Q_gen = 2e-58; W_R - pair formula = 8e-60; hybrid cell Q_sym(mpmath) - W_R(mpmath) + C_R(Arb) = 7.0e-47 | 0 +- 2.6e-48 | W_R = 29.2592924839251554923330123876..., Q_sym = 30.1057821952250982651215320469...: agree with the Arb midpoints to the 45 printed digits (differences 2e-44 and 4e-44 are the truncation of the printed strings) |

Cell A (DH row P8 with the contour integral recomputed in mpmath; unit `rh-c21refA-1120125247`) was stopped by this
lane after 105 minutes without output (mpmath's Dirichlet L-function with derivative on 26 sub-segments at 50 digits).
The DH contour integral C_R is therefore checked only through the hybrid cell above, which uses the Arb value of C_R.

## What the recomputation covers and does not cover

- Covered: the residue bookkeeping of Lemma R (cells B, D), including the sign and size of the symmetric-form defect
  for a non-real control (B: -4.7462, the correction reported in RESULT.md section 0 item 3); the pair formula (D,
  A2); the whole P45 construction for zeta, including the closed form of the tails by Gamma(-1, v) (mpmath
  `gammainc`, an implementation unrelated to Arb's), the residue at the double pole, the pole term at s = 1 and the
  tail truncation (N = 6000 against 4096 in the table); the DH zero pair and the pointwise values at the DH rate.
- Not covered: any HEAT cell (the trapezoid representation was not re-implemented); rows P1 and EF; P45 for controls
  other than zeta; the sign-twist cells; the DH contour integral; the Arb executions themselves (not re-run at another
  precision); the proofs of Lemmas M and U (re-read, not re-derived by another author).
- One discrepancy with PREREG.md found while writing this file: PREREG.md announces "three cells recomputed with
  independent code (mpmath, own zero finding, own quadrature)". Cells B and C take zeta's zeros from `mpmath.zetazero`
  and cell D from closed forms; only A2 finds zeros by its own Newton iteration, and A2 has no quadrature. The count
  "three cells with own quadrature" holds (B, C, D); "own zero finding" holds in the sense of an independent source.

## Rule

Holds as claimed for the cells recomputed: no number of Tables 1, 3 (not rechecked), 4 that was recomputed differs from
the table beyond the printed digits, and the exclusion of 0 by the symmetric form for the unimodular twist is
reproduced. The lane's verdict (certified conversion; no statement about zeros of zeta; R1 = R2 = R3 = R4 = false) is
unchanged. A separate referee is still owed.

---

# Independent referee pass (adversarial, lens: general), 2026-11-20

Status: written by a referee that did not take part in the lane. Appended below the lane's own recomputation, which is
left unchanged above. Own code (python-flint 0.9.0 / Arb, 200 and 260 bits, run on the Mac under `scripts/memcap.sh 8`;
no server unit started), own zero finding (grid Newton), own contour counts, own coefficient recursion for DH, a
different route for Gamma(-1, v) (e^-v/v - E_1(v)), and rates, rectangles, s, Y, sigma_R different from the lane's.
Scratch scripts were kept outside the lane directory (`/tmp/c21ref/ref.py`, `p45.py`; not part of the record); every
parameter needed to repeat the runs is in the tables below.

## Verdict

**Holds as a certified conversion, with the corrections E1 to E6 (none changes a cell).** No statement about zeros of
zeta. No PROVED step failed re-derivation. Every recomputed cell agrees. HEAT cells were not recomputed here.
Flags: R1 = false, R2 = false, R3 = false, R4 = false (same as claimed).

## 1. Re-derivation of the PROVED steps

| step | result |
|---|---|
| Lemma R | Confirmed. Res_{s=-z_i} h = b_i V#(-z_i) = sum_j b_i conj(b_j)/(z_i + conj z_j); Res_{s=conj z_j} h = -conj(b_j) V(conj z_j); divisor points give m_rho V(rho) conj V(-conj rho). Contour = W_R - Q_gen. Needs the rates not to be divisor points (checked by the lane: abs D bounded below) and Re z_j > 0 (so -z_i != conj z_j). |
| Q_sym = Q_gen for F even and real | Confirmed (L odd, L(conj z) = conj L(z)). Order 1: Q_sym = Re L(z)/Re z. |
| Pair formula | Confirmed: with a = rho + z, b = conj z - rho, 1/(ab) = (1/a + 1/b)/(2x); summing a list closed under rho -> -conj rho gives sum (x - Re rho)/(x abs(z - conj rho)^2). |
| Lemma M | Confirmed. Coefficientwise majorant (-zeta'(s))/(2 - zeta(s)), M_2 = 0.93755/0.35507 = 2.6405. Variants: E_a (2 n^a Lambda(n), uses -zeta'/zeta(2) = 0.570 <= M_2), T-NR (factorisation K = q^w(1 + ru)(1 + u/r), Lambda_NR(1) = -log q, geometric tail with rho = r q^(1/2 - sigma) < 1): confirmed. Stated tail values reproduced by hand: 2.64 x 2^-160 = 1.8e-48 (EF); 30.5^23.5/(2 x 23.5 x log 30.5) x 2.64 x 2^-264 = 4.2e-47 (P45); E_a 1.2e-46 and 3.4e-52. Float check for DH: sum_{n<=2e5} abs(Lambda_DH(n)) n^-2 = 0.4056 <= 2.6405; Lambda_DH(3) = -0.31209, Lambda_DH(6) = 1.93636 (the two values quoted in section 7). |
| Lemma U | Confirmed, both signs of lambda: the image ray stays in one open half-plane Im v != 0 (lambda > 0: Re v = -lambda c < 0, Im v moving away from 0) or in Re v = abs(lambda) c > 0 (lambda < 0), so it does not meet the cut; the closing arc lies in Re v >= min(Re v_0, 0) where the integrand is O(abs v ^-2). Signs of the two tails as stated. Bound abs U_n <= (Y/n)^c/(2 c log Y): confirmed. Checked numerically below with an unrelated evaluation of Gamma(-1, v). |
| Residue at the double pole (P45) | Confirmed: d/du[-D'/D(u) Y^(u-s)/log Y] at u = s = -D'/D(s) - (D'/D)'(s)/log Y; simple divisor point d contributes -m_d k(d). |
| Interval Newton and the count | The test N(B) = m - phi(m)/phi'(B) in B is valid for holomorphic phi on a convex box (mean of phi' over a segment lies in the box enclosure). Adjacent pieces of a side share an identical breakpoint ball, so non-dyadic breakpoints do not break the enclosure. Read in `table11.py`; the midpoint-based switches (DH reflected form left of Re s = -2; HEAT reflection) select between two expressions that are both valid everywhere, so they cost no rigour. |
| Code against text | `tables.md` and Tables 1 to 4 were compared with every `contains0`/`rad` field of `out_main.json` and `out_heat.json` by script: all agree; no `_error` key; every `zero_list_complete` is true; internal arithmetic Q_gen = W_R - C_R holds in Table 2 for all 16 cells (signs read from the JSON). `heat_c20.py` is byte-identical to `c20-.../heat_encl.py`. |

## 2. Recomputation with different cases (own code; "abs mid" = modulus of the midpoint of the ball; all balls contain 0 unless a value is printed)

Pointwise, at the lane's own rates (reproduces the scope correction): sign twist Q_gen = 5.58032700437875 + 4.44400573856405 i,
Q_sym - Q_gen = -3.31584259603 - 4.44400573856 i; unimodular twist Q_gen = 5.11122298385012, Q_sym - Q_gen =
-4.74622922948; zeta, DH (30.1057821952251), T-NR (-10.3993660601269), E_a (6.29978786143291): Q_sym - Q_gen encloses 0.

Rows P8 / P1, new rectangles and rates (order 2 with b = (1, 2/3 - 5i/7)):

| control | rectangle (X; Im range) | rate(s) | zeros found / contour count | Q_gen | W_R | C_R | cell general | cell symmetric |
|---|---|---|---|---|---|---|---|---|
| zeta, order 1 | 1.5; [17.5, 35.25] | 0.625 - 30.25i | 4 / 4 | 2.62537945318 | 2.55331748007 | -0.0720619731144 | 0, rad 7.5e-49 | 0 |
| zeta, order 2 | same | 0.625 - 30.25i, 1.125 - 22.75i | 4 / 4 | 2.92044092903 | 2.72372800525 | -0.196712923780 | 0, rad 1.5e-48 | 0 |
| DH, order 1 (contour by direct Hurwitz; the cell the lane's recomputation did not finish) | 1; [85.25, 86.25] | 0.125 - 85.625i (inside the lens, x < 0.3085) | 2 / 2 | -18.6792391397 | -19.5200645154 | -0.840825375618 | 0, rad 2.9e-46 | 0 |
| E_a, a = 5/16 | 1.5; [17.5, 28] | 0.25 - 21.5i | 2 + 2 / 2 + 2 | 3.36256999969 | 3.21130205230 | -0.151267947389 | 0, rad 1.2e-48 | 0 |
| T-NR, q = 2, c = 17/8, order 1 | 1.5; [10, 18] | 0.25 - 13.5i | 1 + 2 / 1 + 2 | -6.11622041009 | -6.25845700572 | -0.142236595622 | 0, rad 7.2e-47 | 0 |
| T-NR, order 2 | same | 0.75 - 13.5i, 0.25 - 14.5i | same | 22.6011751601 | 22.1219004158 | -0.479274744365 | 0, rad 2.7e-46 | 0 |
| sign twist, order 1 | 1.5; [8.75, 13.75] | 0.5 - 11.25i | 2 / 2 (zeta(2u)); 0 / 0 (zeta(u)) | 1.72869553392 + 0.404574855371i | 1.59058406198 + 0.368526470182i | -0.138111471937 - 0.0360483851888i | 0, rad 1.7e-46 | **-1.36099461647 - 0.404574855371i** |
| sign twist, order 2 | same | 0.5 - 11.25i, 1 - 9.5i | same | 1.67254590486 + 0.217560720479i | 1.10452259899 + 0.0579575603609i | -0.568023305874 - 0.159603160118i | 0, rad 7.2e-46 | **-1.76755348065 - 0.217560720479i** |
| unimodular twist, alpha = 1 | 1.5; [17.5, 35.25] | 0.625 - 30.25i | 4 / 4 | 1.35998824001 | 1.27786043285 | -0.0821278071658 | 0, rad 2.4e-47 | **-0.589571261339** |

Pair-formula cell: encloses 0 for zeta, DH, E_a, T-NR, unimodular twist; sign twist -0.463876930657 + 0.368526470182 i.

Row P45, new parameters (Y = 12.5, sigma_R = 12, sigma_L = -1/2, N = 16384, s off the critical line; n-tail bounds 7e-32 and 2.5e-31):

| control | s | Im range | divisor (zeros, poles; count) | S_Y | Res | cell |
|---|---|---|---|---|---|---|
| sign twist | 0.75 + 3i | [-8.5, 9.25] | zeta(2u): 2, 1; 1. zeta(u): 0, 1; -1 | 0.23088500010332 + 0.10158792840386i | 0.22796113947727 + 0.10410038453313i | abs mid 1.6e-32, rad 2.8e-28 (TU and C3 of size 9.7e4) |
| DH | 0.25 + 86i | [84.875, 87.25] | f: 2, 0; 2 | -1.2444802670464 + 0.19896074004646i | -1.1610896170884 + 0.49317086543968i | abs mid 5.4e-40, rad 2.2e-39 (TU and C3 of size 1.9e5) |

Lemma U self-test with Gamma(-1, v) = e^-v/v - E_1(v), c = 11.25 and 11.75, asymmetric T', n = 1, 3, 12, 13, 40
(both signs of lambda): abs(J_n + U_n - weight) between 8e-81 and 7e-64. Negative control of my own run: with the two DH
zeros left out of Res the DH cell is -0.541 - 2.246 i, so the cell does read the divisor term.

These runs cover what the lane's recomputation did not: a full DH contour (P8 and P45), the sign-twist cells in both
forms and in P45, E_a, order 2, and a second parameter set for every Dirichlet-series control.

## 3. Controls

No zeta-only mechanism is claimed, so there is no step at which a control should fail. I confirmed the opposite, as the
lane states: each general-form identity closes for DH, E_a, T-NR, sign twist and unimodular twist at parameters the
lane did not use; the symmetric form closes exactly for the even and real controls and fails for the two twists.
Controls not in the table (Beurling, phase-rotated transfer operator, theta^w, ZQ, SG, NR-q, HQ*) were not run by the
lane or by me.

## 4. Errors and corrections

- **E1 (false sentence, no effect on a cell).** Section 2.4: "radius below 1e-60 in every case" for the zero enclosures.
  For HEAT tau = 0.25 the stored on-line zero has real part [+/- 1.05e-51] (`out_heat.json`), and it cannot be tighter:
  the trapezoid error of that configuration is eps = 3.27e-53 (log of unit `rh-c21heatC`). The pair cell of that row has
  radius 4.3e-49 for the same reason. Replace by "below 1e-60 for the Dirichlet-series controls and HEAT tau = 1; about
  1e-51 for HEAT tau = 0.25".
- **E2 (instance of T-NR).** The pre-registered c = 2.1 has the factor zeros inside the strip (Re s = 1/2 +- 0.4544).
  c = 17/8 exceeds q^(1/2) + q^(-1/2) = 2.1213 (the map's own threshold, section 2 note on T-NR), so the tested
  instance has its zeros at Re s = 1.00745 and -0.00745, outside the closed strip. The deviation is disclosed, and it
  does not matter for an identity, but the dyadic constraint did not force it (33/16 stays inside). The proposed label
  text of section 9 should say "T-NR (q = 2, c = 17/8; factor zeros at Re s = 1/2 +- 0.5074)".
- **E3 (what the label may say).** The general-form cells are instances of Cauchy's theorem and enclose 0 for any
  meromorphic function with a correct divisor list. The control-dependent content is: (a) the pointwise equality
  Q_sym = Q_gen at the tested rates (evenness and reality at two or three points per control), (b) the coefficient
  and tail bookkeeping of rows EF and P45, (c) completeness of each zero list. Section 0 item 4 and weakest step 1 say
  this; the proposed label in section 9 does not. It should carry the clause "finite-rectangle Cauchy identities; the
  identity with the sum over all zeros is CLASSICAL for zeta, DH, E_a, T-NR and not established for HEAT". For the
  starred HEAT cells of P8 and P1 the cited form was not computed; they are "general form certified, cited form by
  the evenness and reality argument", not certified in the cited form.
- **E4 (necessity not proved).** Section 0 item 3 says the cited form "is formulable only for controls that are even
  and real". Only sufficiency is proved. Necessity fails as worded: F(z) = e^(ibz) F_0(z) with F_0 even and real, b
  real, has L = L_0 + ib and Q_sym = Q_gen for all rates and coefficients. Use "holds for". The list "ZQ, SG, NR-q,
  HQ* by the same argument, not run" is an assertion about four controls whose evenness and reality were not checked
  in this lane; it should be marked inferred.
- **E5 (wording).** "Q is negative there, as row P8 says it must be for a control with off-line zeros": row P8 gives the
  sign of the contribution of one pair inside its disk; negativity of the total Q at these rates is a computed value
  (and confirmed here at other rates: T-NR -6.116, DH -18.68), not a consequence of the row.
- **E6 (scope of "line 11").** Line 11 of Statement O names P1, P8, L2, D7 and Q25. D3 is not in line 11 (it is cited
  from line 2), and P45 enters only through line 12 ("mode (I) of line 11 for the tapered section"). Rows EF and P45
  are additions by this lane, which is fine, but "not converted: D3" is not a gap of line 11. The unimodular-twist
  cells in the general form and in P45 are translates of zeta's (disclosed), so the number of distinct Dirichlet-series
  instances in rows EF and P45 is five, not six.

## 5. Checks requested by the assignment

- Assumes RH: no. No formula is evaluated at a hypothetical zero; zeros are found and counted.
- Restates verified height: no; rectangles are at fixed small heights and nothing is claimed beyond them.
- Known theorem presented as new: no. Lemma R is Cauchy, Lemma M a standard majorant, Lemma U a closed form of a
  Perron tail; the lane labels the explicit formula CLASSICAL and the scope correction as a wording qualifier.
- Not verified by this referee: both HEAT rows (values rest on the c20 lane's Lemmas S, T, Q and its referee; code file
  identical; internal consistency of the HEAT JSON checked only); the Arb executions on the server were not re-run
  with the lane's parameters; row EF on the wide rectangle was not recomputed (its prime side was checked through the
  pointwise coefficient test at s = 8 + 3i for DH and the sign twist: 2e-32 and 4e-31 with N = 16384).

## 6. Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | every identity closes for DH and the sign twist; multiplicativity is not used |
| R2 | false | fixed finite rectangles |
| R3 | false | no step fails for a control; the symmetric form separates by evenness and reality only, which DH, E_a, T-NR, HEAT share with zeta |
| R4 | false | no inequality and no passage to the line |

Holds: yes, as a certified conversion with corrections E1 to E6. Surviving claim: on the stated finite rectangles the
general residue forms of P8 and P1 close for all eight control rows, the cited symmetric form closes for zeta, DH, E_a,
T-NR and fails for the sign twist and the unimodular twist by the pointwise amounts stated, and the EF and P45 forms
close for the Dirichlet-series controls; HEAT rests on the c20 lane and is not independently recomputed.
