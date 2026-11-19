# REFEREE (lens: general) for c9-normaliser-cap-avoidance/RESULT.md

Date 2026-11-18. Claimed verdict: partial-result. Referee verdict: **holds, with wording corrections E1-E6**.
The two PROVED items (Lemma U1; Theorem A relative to Lemma H and the hypotheses (F_j)) were re-derived and are
correct. Three sentences outside the proved core are wrong or stronger than what is shown (E1, E2, E3), one control
statement is conditional in part of its range (E4), and two labels are too strong (E5, E6). Nothing in the file is
a statement about zeros of zeta; RH is not assumed anywhere; no verified-height input is used; Lemma U1 is
acknowledged as one direction of c6 Lemma S and is not presented as new mathematics beyond the format reading.
Flags: R1 false, R2 false, R3 false, R4 false.

Sources read as text: `~/lean-deps/qrh-verify/paper.txt` lines 356-470 (definition (2.1), Prop. 2.1 and proof);
`c6-marks-bc-manuscript-check/RESULT.md` section 2 with REFEREE.md and REFEREE2.md (Lemma H, Corollary H1 hold by
two referees; "three referees" in RESULT section 3 is not what those files show: two).

## Confirmed (re-derived by hand)

* **Use of (2.2) in MS Prop. 2.1.** Two places: (a) "H_eta is bounded on Re s > sigma_0", used only on strips
  2 <= Re s <= B (contour shift for Z -> 0, constants may depend on B) and for integrability of A_eta(2 + it);
  (b) "abs(H_eta) >= 1/2", used only to divide F_eta by H_eta at one zero rho with Re rho > beta* - eps*. The
  Mellin identity F_eta = e^((s-5/6)^2) H_eta / L^S on Re s > 1 does not use (2.2). Agrees with RESULT section 1.
* **Lemma U1.** With (2.2a): F_eta is holomorphic on Re s > beta* - eps* (> sigma_0), H_eta / L^S is meromorphic
  there and equals e^(-(s-5/6)^2) F_eta on Re s > 1, so by the identity theorem it is holomorphic, i.e.
  ord_rho H_eta >= ord_rho L(s, eta) at every zero with Re rho > beta* - eps*. (2.2b) at eps = eps* contradicts
  this. Correct. Only eps = eps* is needed in (2.2b).
* **Theorem A (A1).** For b = beta(f_j) > sigma_0 >= 1/2 and a zero rho with Re rho > b - eps* > sigma_0: Lemma H
  (E_eta and the deleted factors non-vanishing on Re s > 1/2) gives L(6 rho - 3, psi) = 0 for the primitive
  character under psi_eta = alpha^(6f+6) chi^6, which lies in G_(6f+6). Re(6 rho - 3) > 0; non-vanishing on
  Re w >= 1 gives Re rho < 2/3. Upper inequality: 6 Re rho - 3 <= beta(f_(j+1)), Re rho -> b. Lower inequality:
  w zero of L(., psi) => 1 - conj(w) zero of L(., psi) (functional equation psi <-> conj psi, then conjugation), so
  4 - 6 Re rho <= beta(f_(j+1)), and 4 - 6b <= 4 - 6 Re rho. Correct.
* **(A2).** y_k = 1, y_j = (3 + y_(j+1))/6 = 3/5 + (2/5) 6^-(k-j); the case sigma_0 > y_(j+1) uses
  (3 + sigma_0)/6 < sigma_0 iff sigma_0 > 3/5, true since y_(j+1) > 3/5. Correct. x_1 = 2/3, x_2 = 11/18,
  x_3 = 65/108.
* **(A3).** B <= max(sigma_0, 3/5) from (A2) started at each level; if B > sigma_0, a level with
  beta(f_j) > max(sigma_0, B - delta) gives 4 - 6B <= 4 - 6 beta(f_j) <= beta(f_(j+1)) <= B, so B >= 4/7. Correct.
  (For sigma_0 >= 3/5 the second alternative is empty.)
* **GRH remark.** beta(f_(j+1)) = 1/2 gives (4 - 1/2)/6 = (3 + 1/2)/6 = 7/12. Correct.
* **Section 4 algebra.** (alpha^6 (eta^sigma)^6)^sigma = alpha^-6 eta^6 and L(w, chi^sigma) = L(w, chi). The two
  L-functions coincide iff eta^6 = (eta^sigma)^6 (alpha^12 != 1 excludes the other case). Correct.
* **Liouville and sign twists.** (alpha lambda eta)^6 = (alpha eta)^6; same L^S(6s - 3, psi_eta), same zeros of the
  normaliser in Re s > 1/2 (E depends on the twist, has no zeros). Correct relative to Lemma H.

## Numeric check rerun with different cases (`scripts/memcap.sh 8 .venv-arb/bin/python`, mpmath 30 digits, 22 s, < 100 MB)

Independent code; theta split at t_0 = 1.25 instead of 1, norms <= 48 instead of 60.
* k = 6: Theta(1/t) = t^7 Theta(t); L(9, alpha^6) = 0.999952991191023682 by the formula and by the Euler product
  over primes < 600; split independence at w = 0.3 + 4.7i: difference 1.4e-30. The same 12 zeros below 30 at step
  0.07. New: the count is complete. theta(30)/pi = 12.077571 (phase of c^-s' Gamma(s')), arg L(1/2 + 30i)/pi =
  -0.077571 by continuous variation from Re w = 3; sum 12.0000. So no zero with 0 < Im w < 30 lies off the line
  (floating point, not certified).
* Different image points (zeros 9 to 12): at s = 7/12 + i gamma'/6, abs(zeta(s)) = 0.630, 0.659, 0.700, 0.726 and
  abs(L(s, chi_-3)) = 1.730, 1.812, 1.892, 1.921. No resonance for eta = 1 at these points.
* Real axis, 300 points offset from RESULT's grid: L(w, alpha^6) in [0.71668, 0.86610], L(0) = 0.71644,
  L(1) = 0.86632. Agrees with T5.
* Different case, next ladder level (eta = alpha^6, psi = alpha^42): Theta(1/t) = t^43 Theta(t), root number +1;
  L(9, alpha^42) = 0.999953018187131202 by formula and Euler product; zeros of L(w, alpha^42) on Re w = 1/2 at
  0.8901, 2.4821, 4.7297, 6.2597, 7.5193; at the images s = 7/12 + i gamma/6 the level-1 target has
  abs(L(s, alpha^6)) = 0.816, 0.824, 0.849, 0.875, 0.901. No resonance at these points of level 1.
  (A shared scratch log under /tmp was overwritten by another process during the first run; the two affected lines
  were recomputed in a private directory. The numbers above are from complete lines.)

## Errors and corrections

* **E1 (section 2, last sentence; wrong "iff").** "(2.2b) ... holds automatically iff beta* > (3 + beta_1)/6" is
  not an equivalence. What is proved: (2.2b) holds automatically if beta* > (3 + beta_1)/6, and also if
  beta* < (4 - beta_1)/6 (zeros of H_eta in Re s > 1/2 lie in (4 - beta_1)/6 <= Re s <= (3 + beta_1)/6). Inside
  that strip (2.2b) may hold or fail; nothing is known. Replace "iff" by "if".
* **E2 (verdict item 4, claim line, proposed row Z24b: "exists except for eta = 1 and chi o N").** The proved
  criterion is eta^6 = (eta^sigma)^6. For finite-order targets this holds for many more characters than 1 and
  chi o N: every chi with chi^6 = 1 (all cubic and sextic residue characters, the characters the rows of MS are
  built from), every chi with (chi/chi^sigma)^6 = 1, and products of these with characters chi' o N. The body of
  section 4 says "holds for" (correct); the headline, the claim and the map row say "except for" (not correct).
  Also: the second condition at levels j >= 1 needs the format on G_(-f_j) (eta^sigma has frequency -f_j), which
  is not part of (F_j) as stated.
* **E3 (control U: "no continuation below Re s = 2/3 in general").** Not established, and false for almost every
  member in the natural measure: for independent uniform phases u_p (Steinhaus), sum u_p Np^-w converges almost
  surely on Re w > 1/2, so prod (1 - u_p Np^-w)^-1 continues holomorphically and without zeros to Re w > 1/2, that
  is, the normaliser product continues zero-free to Re s > 7/12 (CLASSICAL, random Euler products). Correct
  statement: the continuation of the normaliser below 2/3 depends on the member; for members with (alpha c)^6 = 1
  on almost all primes there is a pole at 2/3; for a typical member there is a zero-free continuation to 7/12 and
  (2.2b) then holds trivially for beta* > 7/12. This does not change the R3 flag (no control fails at this step).
* **E4 (control THIN, range 1/2 < b < 2/3).** "(2.2b) holds for THIN" needs b to be the supremum of real parts for
  the THIN family. By row P46 the zeros right of b are those of the untwisted L-functions; whether any exist is
  open, and if they do the top layer consists of those zeros, for which (2.2b) is the open non-resonance statement.
  For b >= 2/3 the statement is unconditional (no zero of H in Re s >= 2/3). For 1/2 < b < 2/3 it is conditional on
  no zero of the underlying L-functions with real part > b, in addition to the MEASURED grid of T5.
* **E5 (section 2 label).** "[PROVED] nothing is lost and nothing is gained": the proved part is the reduction of
  (2.2) to (2.2b). "Jensen, Borel-Caratheodory and counting cannot exclude resonance" is an argument about
  methods (ARGUED), not a theorem. Same for "not reachable by counting" in the claim.
* **E6 (verdict item 3, "obstruction at 3/5 (precise)", "ceiling ... is 3/5").** What is shown: the ladder
  inequalities give no contradiction for B in [4/7, 3/5]. No configuration satisfying all (F_j) with B in that
  window is exhibited, so 3/5 is the limit of this argument, not a proved limit of the format. And the value 3/5
  is reached only with (F_j) at infinitely many levels of infinite-order targets, for which no source exists; with
  the sourced levels only (k = 1) the value stays 2/3 (row Z24). RESULT states the second point in section 9; the
  headline "ceiling 2/3 becomes 3/5" should carry it.

## Requirement flags (set by the referee)

* R1 false: complete multiplicativity enters Lemma H only; the step is identical for every completely
  multiplicative unimodular target.
* R2 false: half-plane statement of an estimate format under hypotheses with no source below 7/8.
* R3 false: target-blind; Liouville, sign twists and THIN have the same normaliser zeros; typical members of U
  have a zero-free normaliser to 7/12 (E3).
* R4 false: stops at the window [4/7, 3/5] under hypotheses without source; no passage to the critical line.

## Surviving claim

Format step only, no statement about zeros. In MS Prop. 2.1, (2.2) can be replaced by: H_eta holomorphic on
Re s > sigma_0, bounded on Re s >= 2, and ord_rho H_eta < ord_rho L at one zero within eps* of the supremum
(Lemma U1). With the normaliser of Lemma H and the format ASSUMED on levels G_(f_j), f_0 = 0, f_(j+1) = 6 f_j + 6,
j < k (no source for j >= 1, none below 7/8 for j = 0): beta(0) <= max(sigma_0, 3/5 + (2/5) 6^-k); with all levels,
B <= sigma_0 or 4/7 <= B <= 3/5. The ladder argument gives nothing inside [4/7, 3/5]. A second normaliser
condition through eta^sigma exists exactly when eta^6 != (eta^sigma)^6 (it does not for 1, chi o N, and every
chi with chi^6 = (chi^sigma)^6, including all characters of order dividing 6). The step does not separate any
control.
