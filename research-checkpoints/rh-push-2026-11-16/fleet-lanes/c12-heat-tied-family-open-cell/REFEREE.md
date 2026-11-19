# c12-heat-tied-family-open-cell: REFEREE

Status of this file: **author's own adversarial pass, not an independent referee.** Count it as zero independent referees. Items recomputed by a second route are marked.

## Items checked

1. Source. Conrey-Li arXiv:math/9812166v1 fetched and the text of Theorem 2, its proof and section 3.1 read. Theorem 2 as used: W analytic without zeros in the upper half-plane; hypothesis Re <F, TF> >= 0 on F(W); conclusion "W(z) has an analytic extension to Im z > -1/2 and W(z)/W(z + i) has a nonnegative real part in this half-plane" (their proof shows W(z)/W(z+i) analytic there). HOLDS as quoted. Theorem 1 was not re-read; it is used only through c11's statement, for Lemma H1.
2. Heat code against known values (`cell1_check.py`). X_0 against Arb's zeta at 0.5+30i, 1.5+111.03i, 0.5+499.3i, 1.5+499.3i: relative difference at most 4.1e-180. Step 0.002 against 0.001 at tau = -0.5: 0 and 3.6e-180. c11 (3.2): -5.38910050718295e-69 reproduced; q_1(zero 34) = -0.08788 (c11: -0.0879). Map zero for tau = -0.5: |X| = 1.9e-56. HOLDS.
3. Heat, second route (`referee_checks.py`, mpmath quadrature at 120 digits, no flint): tau = -1, zero at 76.5306407114, q_1 = -0.20065651; the Arb code gives 76.53064071136, -0.200656510. HOLDS.
4. Heat table. N(0) = 269 equals the number of zeta zeros below 500. N(tau) = 270 for tau >= 0.5: one zero has moved below 500, consistent with zeros moving down under the forward flow; not checked separately. The claim "pair 34/35 has left the line at tau = -0.5" rests on the absence of a sign change in (109.5, 113) and a same-sign local extremum at 111.72; the off-line pair itself was not located. Wording in RESULT matches this.
5. Pre-registered monotonicity. The registered criterion (T* non-decreasing) fails seven times; RESULT reports the seven and separates the five that are the drift of one zero. A reader could object that the registered criterion was badly chosen (it conflates the index of the failing zero with its height). The two genuine inversions (-2 to -1, -0.5 to -0.2) do not depend on that choice. HOLDS.
6. Lemma S. Step "an interior zero of W gives an interior zero of P": P = W(z)/W(z+i) and W(z+i) is finite and non-zero for Im z > -1/2 since Im(z+i) > 1/2. An analytic function with non-negative real part and an interior zero is identically zero (minimum principle for the harmonic function Re P, then P is an imaginary constant, equal to 0). HOLDS. Step "W W* = 1/m continues": needs W analytic in Im z > -1/2 (Theorem 2), W* analytic in Im z < 1/2, m meromorphic in the strip; holds in |Im z| < 1/2.
7. Lemma T. For z = x - i/2: z + i = x + i/2 and conj z = x + i/2, so W(z+i) = W(x+i/2), W*(z) = conj W(x+i/2). P extends continuously to that boundary point when m is finite and non-zero there, and Re P >= 0 passes to the limit. Check on W = 1/xi: m(s) = xi(s) xi(2-s), formula gives xi(3/2 - ix)/xi(1/2 - ix) = W(x - i/2)/W(x + i/2). HOLDS. Not checked: existence and boundary regularity of W for the tied weights (the lemma is conditional on a W as in Theorem 2; if none exists the tied condition is not formulable, which closes the row as well).
8. Orientation of the variable. s = 1 - iz, so Im z = -1/2 is Re s = 1/2 and t = -x. S_v and S_w are computed for t > 0 only; the families are closed under conjugation, so S(-t) = S(t) for a conjugation-closed family (v(conj s) = conj v(s)). For the single character mod 5 the family is not closed; the row is a control only. HOLDS.
9. Interior zeros, second route (`referee_checks.py`): R + 1 at the first q = 5 zero evaluated with mpmath Hurwitz zeta: -2.305e-29 + 3.118e-30 i; Arb gives -2.3050e-29 + 3.118e-30 i. HOLDS. The Arb winding routine: each boundary piece is enclosed by one ball evaluation; the piece is accepted only if the enclosure times the conjugate of an endpoint value has positive real part, which puts the image in an open half-plane and makes the principal logarithm of the endpoint ratio the true argument change. All listed zeros have winding 1.0000000 +/- 3e-13. The routine was not tested on a function with a known zero count other than through the q = 5 re-examination (cell winding 0; zero-plus-pole square 0).
10. Boundary values, second route (`referee_checks.py`, mpmath): q = 5 pair, normalised S_v(8.55) = -0.00265, S_v(27.81) = -0.373226 (Arb: -0.373226003564), S_w(3.79) = -0.00201. HOLDS. Two independent implementations of the full odd family (characters one by one, `cell2c.py`; orthogonality with Hurwitz zeta, `cell2d.py`) give the same first negative heights at q = 13 (17.44) and q = 29 (63.46) and the same negative fractions (0.0601, 0.0076). HOLDS.
11. T-NR factor. arg m(3/2 + it) = arctan(0.6 tan(t log 2 / 2)) checked at t = 3, 3.34, 4 (0.796, 0.940, 1.269). It exceeds pi/4 from t = 2.97. The measured first negative heights 3.24 to 3.42 are inside (2.97, 4.53). Not proved: that the T-NR family is negative there for every q (it is measured at q = 5, 13, 29, 53, 101, 199).

## Errors and corrections made during the pass

- A first draft of the control paragraph placed the T-NR zeros of m "inside the strip" for c = 2.5, p = 2; arccosh(1.25)/log 2 = 1.0000, so the zero is on the edge Re s = 3/2. RESULT states the edge case.
- The count of tau values at which zero 34 is on the line was written as nine; it is ten.
- Run discipline: two q = 13 interior screens and one E_a run at q = 29 passed 20 minutes before they were stopped (about 27 minutes each). Their output is not used. The q = 5 interior screen to height 500 took 1241 s (41 s over the cap) and its output is used. Reported in RESULT.

## Not checked

- No interval enclosure of the trapezoid error in the heat code.
- Lemma H2 for tau != 0 (no numerical comparison of q_h with the zero sum).
- Zeros of v for families of three or more characters (reading (c), Lemma S).
- The band 0.5 < Re s < 0.505 for interior zeros.
- The off-diagonal bound behind the conductor-aspect positivity; the q^2 description of T_0 (four points).
- Heat applied to the tied family.

## Verdict of the pass

No arithmetic error found in the items recomputed. The closing statements (heat fails at (N2); V3b closed by computation) rest on certified signs or winding numbers plus Lemmas S, T, which depend on Theorem 2 as quoted. Nothing here is a statement about zeros of zeta. Referee count: 0 independent.

---

# Independent referee pass (lens: general), 2026-11-19

Status: independent of the author. Appended below the author's own pass, which is left unchanged. Scripts and logs: `referee_general/` (`chkA.py`, `chkB.py`, `chkD2.py` and their `.log` files; mpmath only, no flint, run through `scripts/memcap.sh 8`, no server use). Source re-opened: Conrey-Li arXiv:math/9812166v1 (PDF text extracted with pdftotext).

**Outcome: holds (as a precise obstruction). No PROVED step failed re-derivation; every number rechecked was reproduced. Flags: R1 = R2 = R3 = R4 = false. Nothing is a statement about zeros of zeta.** Six items of wording or scope are listed in section 4; none changes the verdict.

## 1. PROVED steps re-derived

| Step | Re-derivation | Result |
|---|---|---|
| Theorem 2 as quoted | Read in the source: W analytic and zero-free in the upper half-plane; T takes K(w, z) to K(w + i, z); Re <F, TF> >= 0 on F(W) implies W extends to Im z > -1/2 and W(z)/W(z + i) has non-negative real part there. | matches the quotation |
| Theorem 1 / (N2) | Source: conclusion "zeros on Im z = -1/2 and Re{conj E'(w) E(w + i)/2 pi i} >= 0 at each zero"; with X' purely imaginary on the line this is -Re{X'(rho) X(rho + 1)} >= 0 up to a positive factor. | consistent with c11's (N2) |
| H1: E_tau* (z) = E_tau(z - i) | E*(z) = X(1 + iz) = X(-iz) by X(s) = X(1 - s) and reality; E(z - i) = X(-iz). | holds |
| H2 (phase form) for tau != 0 | Needs only: X_tau entire of order one (the factor e^{tau v^2} does not change the double-exponential decay of Phi), real on the line, X(s) = X(1 - s). Then X(rho + h)/X'(rho) = h c prod(1 + h/(rho - rho')) with c > 0 under symmetric summation, and X'(rho)^2 < 0, so q_h = cos Delta_h. | holds; the "typical case" consequence (lower zero of a closing pair fails) is a heuristic, labelled as such in the text |
| H3 (lattice) | X'(rho_n) = iL(-1)^n, X(rho_n + h) = i(-1)^n sinh(Lh); product -L sinh(Lh); X'' = L^2 X. | holds (X is purely imaginary on the real axis, not real; no effect) |
| Lemma S | Interior zero of W gives interior zero of P; Re P >= 0 harmonic with interior minimum 0 forces P = 0. W W* = 1/m continues to abs(Im z) < 1/2; s = 1 - iz maps this to 1/2 < Re s < 3/2. w and w0 differ by G(s)G(2 - s), zero-free and pole-free in the strip. | holds |
| Lemma T | At z = x - i/2: W(z + i) = W(x + i/2), W*(z) = conj W(x + i/2), an interior zero-free point, so P(z) -> 1/(m abs(W(x + i/2))^2); Re(1/m) >= 0 iff Re m >= 0. Identity checked numerically for W = 1/xi at x = 7.3: difference 5.7e-42. | holds |
| Corollary (S_w sign change at each zero) | Simple pole of one term with real variable t crossing it. | holds |
| T-NR factor | cosh(log 2) = 1.25, sinh(log 2) = 0.75; arg m(3/2 + it) = arctan(0.6 tan(t log 2 / 2)); > pi/4 iff t in (2.973, 4.532). Zero of m at Re s = 1/2 + arccosh(1.25)/log 2 = 3/2 exactly. v_NR = m(s) m(2 - s) v. | holds |
| Orthogonality identity | sum over odd chi of chi(a) conj chi(b) = (phi/2)(delta_{a,b} - delta_{a,-b}); diagonal (phi/2) zeta(2)(1 - q^-2); gamma phase arg Gamma(3/4 + iy) - arg Gamma(5/4 + iy) in (-pi/4, 0). | holds |

## 2. Numeric checks rerun with different cases (independent code, mpmath, trapezoid step 0.0025 on [0, 1.6] at 110 digits; the author used step 0.002 on [0, 1.5] in Arb)

Author's second-route cases were tau = -1 at 76.53, the first q = 5 zero, and q = 5 boundary values. Cases below are different.

| Check | This pass | RESULT.md |
|---|---|---|
| X_0 against xi/2 at 1.5 + 37.3i | relative difference 1.5e-103 | agreement claimed |
| tau = -0.5, first failing zero | 173.811125477, q_1 = -0.00364 | T* = 173.81 |
| tau = -2, first failing zero | 84.3320893005, q_1 = -0.1395 | T* = 84.33 |
| tau = 0.2, first failing zero | 282.260773295, q_1 = -0.0525 | T* = 282.26 |
| zero 34 tracked: tau = -0.05, 0, 0.5 | q_1 = -0.1314, -0.0879, +0.1870 | -0.131, -0.088, +0.187 |
| tau = -0.5: sign changes of X(1/2 + it) in (100, 120), grid 0.01 | 101.53, 103.99, 105.61, 107.21, 114.52, 116.35, 118.99: none in (107.3, 114.5) | "no on-line zero between 109.5 and 113" |
| **tau = -0.5: the off-line zero itself (not located by the author)** | **0.742956506487 + 111.694227672i**, abs(X) = 4.6e-113 there against 2.6e-37 at distance 0.01 | supports "the pair has left the line" |
| q = 7, three odd characters, first zero of w0 | abs(w0) = 9.0e-16 at the 16 stored digits; refined 0.50859577309514082232 + 17.48111285037289304777i; winding number 1.0 on a circle of radius 1e-6 (64 points); abs(L) at 1/2 + 17.48i = 0.75, 2.31, 0.60 (not a pole) | 0.5085957730951408 + 17.4811128503728930i, winding 1 |
| q = 7, three odd: S_v at 16.70 / 16.75 / 16.80 | +0.0431 / -0.0074 / -0.0564 | first negative 16.75 |
| q = 7, three odd: S_w at 2.25 / 2.31 | +0.0694 / -0.0111 | first negative 2.31 |
| zeta alone: S_v at 13.50 / 13.54 | +0.0284 / -0.0031 | first negative 13.54 |
| q = 5 pair, second zero of w0 | 0.506663120192295 + 106.615752173975i, abs(w0) = 3.5e-29, winding 1.0 | listed in `cell2_q5_p1_L_T500.json` |
| q = 5 pair: 33 confirmed zeros, largest Re s | 34 records, 33 with ball winding 1, one screen cell with winding -1; max 0.59152 | 33; 0.5915 |
| Table of section 2.2 against the 13 json files (N, F_0.5, F_1, F_2, T*, min q_1) | all 13 rows agree | - |

## 3. Controls run by this referee

- T-NR (p = 2, c = 2.5), q = 5 pair, S_v: +0.0256 (t = 3.20), +0.0057 (3.23), -0.00097 (3.24), -0.0412 (3.30), -0.510 (4.00). The untwisted pair at the same heights: +0.771 to +0.652. First negative 3.24 as in the table, inside (2.973, 4.532).
- Lattice: Lemma H3 re-derived by hand (section 1); passes at every tau.
- Forward heat: tau = 0.5 at the continuation of zero 34 (110.6038): q_1 = +0.187 > 0, q_2 = -0.750 < 0. The pass is at h = 1 only; at h = 2 the forward family fails at 116 to 126 zeros (author's table).
- No zeta-only mechanism is claimed, so there is no positive claim for the controls to break. The one separating inequality (conductor-aspect S_v > 0 for t < T_0(q)) is labelled a mean value by the author; not re-run here for q >= 13.

## 4. Errors, gaps and wording (none changes the verdict)

1. **"Fails Theorem 1's hypothesis for every tau < 0 tested" is demonstrated in this lane only at tau = -2** (located zero at Re s = 1.125). For the other five values it rests on the internal `b-escape-law` Theorem A (one referee), at unspecified height. The off-line zero found here for tau = -0.5 has Re s = 0.743 < 1: it shows an (N1) failure, not a failure of the hypothesis. (N1) failing for every tau < 0 is the classical statement Lambda >= 0 (Rodgers-Tao), which should be cited as CLASSICAL rather than left to the internal theorem. At tau = -0.05 the on-line count below 500 is still 269, so no (N1) failure is visible below 500 there.
2. Lemma H1's parenthesis "no zeros in Re s >= 1 (this is abs(E*) < abs(E) in the upper half-plane together with no real zeros)" is an equivalence only with the product-formula argument (Conrey-Li use it for xi). Only the necessary direction is used (failure for tau < 0), so nothing depends on it.
3. **Lemma T is not a new condition.** It is the boundary value of the conclusion of Theorem 2 (de Branges, as stated by Conrey-Li). Its one-character case is the kind of failure Conrey-Li (3.4) and Sarnak's remark already give, and Sarnak's remark in the source covers every single Dirichlet character. What is added in this lane is the observation that the outer function cancels on Im z = -1/2, which makes the condition computable for a weight given only through abs(W) on the real axis, and its use on tied weights. The campaign summary's phrase "a new boundary condition" should read "boundary form of Theorem 2".
4. Lemmas S and T are conditional on a W as in Theorem 2 for each tied weight and on reading "tied" as one of (a), (b), (c). A tie with one common F and one shift per character is not covered (author's weakest step 1). "Closed in three readings" is correct; "closed" without that qualifier is not established.
5. Reading (c) for families of three or more characters is closed only at the boundary step (statistic 2); the interior-zero statistic covers them in readings (a), (b) only. The text says this; the one-line claim does not.
6. tau = -0.5 first failure: q_1 = -0.0036 at 173.81. It is negative in both codes at well over 100 digits of working precision, so the sign is not in doubt, but the trapezoid error is not enclosed (author's weakest step 2); the row's T* is certified only in the sense "two codes with different steps agree". The sentence "a condition that holds strictly on one side of zeta in the flow and fails at zeta ... is the flow-blindness wall read in the other direction" is commentary: the passing range tau >= 0.5 is a finite statement (height 500, h = 1) and the threshold may move with height.

Run discipline of this pass: a first combined script was stopped by pid after about 20 minutes (a root scan for further q = 5 zeros over 40 starting points was too slow); its output was not used. The split reruns finished in under 2 minutes each.

## 5. Checks requested by the assignment

- Assumes RH: no. Zeros on the line are found by sign changes; off-line zeros are allowed for and one is located.
- Restates verified height: no.
- Known theorem presented as new: Lemma T (item 3) is a corollary of Theorem 2 and should be labelled so; the failure of the one-character device is Conrey-Li and Sarnak (cited in c11). The heat and tied-family evaluations are computations, not theorems.
- Statement about zeros of zeta: none.

## 6. Requirement flags (set by this referee)

- R1 false: no step uses multiplicativity; the conductor-aspect positivity uses orthogonality of characters.
- R2 false: all results are finite-height tables; every family fails at a finite height.
- R3 false: the lattice passes everything, forward heat passes (N2) at h = 1 below 500, zeta's families fail at the same step as T-NR and E_a.
- R4 false: no passage to the critical line; the boundary condition is false.

Referee count contributed by this pass: 1 independent (general lens).
