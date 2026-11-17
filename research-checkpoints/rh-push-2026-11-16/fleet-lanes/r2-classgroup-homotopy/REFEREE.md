# REFEREE: r2-classgroup-homotopy (2026-11-16)

Adversarial check of RESULT.md. Script: /tmp/ref_r2/c1.py (python-flint 0.9.0 via an existing sibling venv, numpy),
test cases different from the author's. RESULT.md makes no RH/GRH claim and none is hidden.

## Outcome

holds = true for every step labelled PROVED (S3, S4, Thm 1 to 5, the real-zero pair of row 1). One false sentence in
the DH control (section 7, unlabelled), one label inconsistency, and provenance issues in the argument-principle logs.
The verdict "precise obstruction" stands, with the qualification in the last section: the obstruction is the generic
openness of "real and simple below T", not something specific to this pencil. The new content is Thm 2, Thm 5 and
the measured rate.

## PROVED steps, re-derived

* **S4.** f(3) = f(7) = 2(c-s), f(21) = 4(c+s), f(1) = c+s from chi_5(3) = chi_-4(3) = -1 (same at 7).
  f(3)f(7) = f(1)f(21) iff cs = 0. Confirmed.
* **Thm 1.** F_phi = A(cos phi + sin phi R); R(1 - conj s) = conj R(s) from the common functional equation and real
  coefficients. Confirmed.
* **Thm 2.** Local factors of L_K(psi)/zeta_K checked prime by prime: p = 2 gives (1-x)/(1+x); p = 5 gives 1;
  p = 1, 9 mod 20 gives 1; p = 3, 7 mod 20 gives ((1-x)/(1+x))^2; inert p gives 1. (1-x)/(1+x) = tanh(s log N / 2).
  c(n) = Lambda(n)(1-chi_5(n))(1-chi_-4(n)) (the product chi_5 chi_-4 equals the primitive chi_-20 at 2 and 5 as
  well, both 0). Numeric, new points, product to 3e6: s = 2.5+11i agreement 2e-12; s = 4+0.5i 1e-14; s = 1.8-23.3i
  2e-8 (truncation). R'/R(3+2i) against sum c(n) n^-s (n < 2e5): agreement 1e-11.
* **S1** at s = 4 (author used 3), lattice box 300: Z_1+Z_2 = 2.19235711972 against A = 2.19235711972;
  Z_1-Z_2 = 1.83812543971 against B = 1.83812543971.
* **Thm 3.** Derivation confirmed (R real on the line, dR/dt = R omega). New cases: phi = 0.25, gamma = 4.9601344105:
  finite difference 0.87893638 against formula 0.87893638; phi = 1.1, gamma = 6.9975074218: -0.42151789 against
  -0.42151789. The zero-side form (ii) has the correct extra term 2t/(t^2+1/4) (R has simple zeros at s = 0, 1 from
  the poles of Lambda_A); it assumes the zeros are on the line and says so.
* **Thm 4.** Items 1 to 5 follow from simple zeros/poles and Thm 3. Bookkeeping checks: 1460 + 1459 + 4967 + 86 + I_0
  = 7973 intervals = 3987 + 3986 zeros; 1460 + 1459 + 2*86 = 3091 critical points; colliding A-zeros
  2*1460 + 86 + 1 = 3007 = 1407 + 1600. Consistent. Item 3 counts critical points with multiplicity; all certified
  critical points are simple, so no issue in range.
* **Thm 5.** Circle image of (1+w)/(1-w), max argument 2 arctan r, abs(artanh w) <= artanh abs(w),
  abs(tanh u) <= tan abs(u): all confirmed. kappa: L(1,chi_5) = 2 log((1+sqrt5)/2)/sqrt5, L(1,chi_-4) = pi/4,
  L(1,chi_-20) = pi/sqrt5, so kappa = (1/2) log((1+sqrt5)/2) = 0.2406059. Numeric: R(1+1e-6)/1e-6 = 0.2406061.
  Sampling 3000 random heights in [0, 5000] on sigma = 1.08, 1.3, 2.0: min abs(R) = 0.0617, 0.1106, 0.3589 against
  R(sigma) = 0.0205, 0.0875, 0.3486; max abs(R) = 17.8, 8.77, 2.836 against 1/R(sigma) = 48.9, 11.43, 2.869. Bounds
  hold. Item 3: monotonicity of tan U(sigma) 2^sigma (needed for "false for sigma > sigma_tan") is not stated but
  true (U decays like 3^-sigma). R at the round-3 zero 2.079414+7.628868i equals 1 to 1e-7, below sigma_tan.
* **Row 1 real pair.** R(1/2) = -0.0630834, arccot = 1.5077965. phi = 1.54: zero at sigma = 0.853476, abs(F_phi) = 2e-16.
  The proof uses that R has no pole on (1/2,1), i.e. L(sigma,chi_-20) != 0 there; not stated. It follows from the
  author's own count (N_A(100.01) from the contour equals the number of on-line zeros, which excludes real zeros of
  Lambda_A), and is classical.

## Certified computation

* `stage1.py` read: Taylor model with Lagrange remainder from a wide jet; derivative models are differentiated
  correctly (remainder coefficient scaled); accept/discard logic is sound; panel-edge roots are flagged. No flaw
  found. Not re-run.
* Counts against the asymptotic formulas: zeta zeros below 2000 = 1517, so L(chi_-20) contributes 2470; main term
  (T/2pi) log(20T/2pi e) = 2469.7. B: 2028.4 + 1957.4 = 3985.8 against 3986. N_A(100) = 29 + 76 = 105.
* Record pair, direct evaluation: abs(zeta(1/2+1505.261530i)) = 2.8e-6, abs(L(1/2+1505.261554i, chi_-20)) = 1.2e-6;
  R at the midpoint 1505.261542 = 5.14e7, arccot = 1.945e-8. Matches.
* `stage2.py` (final version) re-derived: N = (theta + arg F(8+iT) + Delta arg)/pi + 1 - r/2 with r real zeros; the
  -1 correction for pi/2 < phi < 3pi/4 (r = 2) is justified; the sign normalisation for c + s < 0 and the 2^s shift
  for Z_2 are correct.
* **Provenance issue.** `s2_low.log` and `s2_high.log` are pre-fix and disagree with the stated counts by +-1
  (Z_2: 84, 208, 300, 1553 against 83, 209, 299, 1554 in `s2_z2fix.log`; 13 to 15 pi/16: 106, 254, 358, 1775 against
  105, 253, 357, 1774 in `s2_fix.log`). RESULT cites `s2_*.log` as one body of evidence. The fixed values are the
  right ones (parity: total minus real is even only for the fixed values; N_A - T log2/pi = 82.9, 208.9, 298.8,
  1553.4), but the Z_2 difference alternates in sign, so the earlier bug was a branch error, and the value 1554 at
  T = 1000 is 0.6 above the asymptotic. The stale logs should be deleted or marked, and the label CERTIFIED for the
  Z_2 totals rests on the final code only.

## Errors and gaps

1. **DH paragraph (section 7): false statement.** "its ratio function L(chi)/L(chi-bar) is unimodular on the line"
   is wrong. For the complex characters mod 5: abs(L(1/2+it,chi)/L(1/2+it,chi-bar)) = 2.31 at t = 3,
   3.5e-6 at t = 6.18357 (a zero of one factor), 4.60 at t = 10. Correct structure: h_1(t) = phase * Lambda(1/2+it,chi)
   is real, h_2(t) = h_1(-t); the ratio is real with zeros and poles. Only h_1 +- h_2 are self-dual. So DH is not an
   interior point of a one-functional-equation pencil with Euler end points: in the DH pencil the Euler members
   (L(chi), L(chi-bar)) sit at the +-pi/4 positions and are not self-dual, and the self-dual members are the
   non-Euler ones. The sentence should be replaced. The DH control itself is not affected: no theorem in the note is
   an argument towards RH, Thm 1 to 4 hold for all phi including Z_1 and Z_2 (which have off-line zeros), and the
   note says so.
2. **Label inconsistency.** Section 5 says "For every phi outside {0, pi/2} off-line zeros exist (CLASSICAL,
   section 6)". Section 6 labels this ARGUED for general phi (Bohr's method not written out, cited hypotheses not
   checked); CLASSICAL holds only for phi = pi/4, 3pi/4. Consequently "the interval shrinks to {0}" in section 5 is
   ARGUED, and phi_0(T) -> 0 is MEASURED, not proved.
3. **Abscissa statement.** The form "abscissa <= 1 + abs(phi)/0.2406" (as summarised) needs the (1+o(1)) that
   RESULT.md carries. Thm 5.1 alone gives it for small abs(phi) (it holds up to about abs(phi) = 0.68 on the computed
   values, since R(sigma) >= kappa(sigma-1) there) and gives nothing as abs(phi) -> pi/4, where R(sigma) = tan phi has
   sigma -> infinity.
4. **Rate.** "phi_c of order delta^2": the author's own list has angle/delta^2 from 0.038 to 39 (three orders).
   phi_0 n^2 ranges over a factor 70 on five non-independent record values. The exponent 2 is consistent with the
   data, not determined by it. Labelled MEASURED/ARGUED, which is correct.
5. Minor: `lib.py` defaults in `stage1.py` are H = 0.01, N = 10; RESULT states width 0.04, order 16. The run
   parameters are not recorded in a log in this directory (`run` command lines absent).

## RH / verified-height checks

Nothing assumes RH silently: Thm 4 uses the certified hypothesis in range, form (ii) of omega states its assumption,
"no off-line zeros of A, B between 1000 and 2000" is attributed to the literature. The zero-freeness to T = 1000 is
stated as known. No verified-height statement is presented as new.

## Is the obstruction real

Yes, but it is generic. "All zeros below T real and simple" is an open condition in the parameter for any continuous
family of functions real on the line (Hurwitz plus the reflection symmetry), so the Euler point is interior without
any computation. The computation adds the measured size of the interval, not its existence. The note's obstruction
covers arguments that use (a) on-line data at finite height or (b) a property open in phi.

Not covered, hence a possible way around (no claim that it leads anywhere): statements about R as a whole rather
than about one member. R carries both Euler points at once and has a closed, non-open characterisation: log R is a
Dirichlet series over prime powers with nonnegative coefficients (Thm 2). The note uses this only in sigma > 1
(Thm 5). Two things were not tried: (i) the complex-level family R = c, c in CP^1 (the Hermite-Biehler question for
Lambda_A - i Lambda_B; the note's own data, 37 per cent aa/bb intervals, shows plain interlacing fails, but the
argument of R off the line was not examined); (ii) the lower bound matching Thm 5.1 (zeros of F_phi at real part
1 + c abs(phi)), which would be an exact, phi-uniform statement at infinite height. Both use multiplicativity through
c(n) >= 0 and so pass the sign-twist filter only if the character structure is used, which it is. I do not see that
either gives a critical-line statement.

## Surviving claim

Thm 1 to 5 as stated (with (1+o(1)) in the abscissa), the certified tables to height 2000 with completeness to 1000,
the measured non-decay of the typical collision angle and the measured decay of the first collision angle with
exponent near 2 from mixed zeta / L(chi_-20) pairs. RH/GRH untouched. Lead strength for RH: low (unchanged).
