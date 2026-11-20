# REFEREE: c1-missing-controls (lens: general)

Date 2026-11-17. Target: `RESULT.md` in this directory. Claimed verdict: partial-result (filter repair, no RH attack).
Referee scripts were run outside this directory (`/tmp/c1ref/`, through `scripts/memcap.sh 8`, interpreter
`.venv-arb/bin/python`, mpmath 1.3.0, python-flint 0.9.0); nothing in the lane was edited. The compute server was
not used.

## Verdict

**The claimed verdict holds (partial result, filter repair), with two corrections and four scope notes.**
Every PROVED step was re-derived and confirmed. Every numeric item that was rerun reproduced. No step assumes RH
(D2 uses RH only as one branch of a case split), nothing restates verified height, and no classical theorem is
presented as new (D1 and D2 are labelled as corollaries of Selberg and Bohr-Jessen). Nothing in the result is a
statement about zeros of zeta.

Requirement flags set by the referee: **R1 = false, R2 = false, R3 = false, R4 = false** (no attack is made; same
as claimed).

## Errors

**E1 (wrong statement, FLAGS last paragraph and weakest step 3).** The result says that no sign twist with a false
zero conclusion was constructed and that the only example in the push is the float64 `U_R` of
`res-identity-solenoid`. The lane's own twist TW- b (Liouville) is an exact example for the conclusion "all zeros
in the open strip lie on Re s = 1/2": `sum lambda(n) n^{-s} = zeta(2s)/zeta(s)` has zeros at `rho/2` and poles at
`rho`. Referee check: `|zeta(2s)/zeta(s)| = 5.5e-31` at `s = 1/4 + 7.06736257087i` with `|zeta(s)| = 1.126` there
(30 digits), so the zero is not cancelled. More generally, for eps_p = +-1 completely multiplicative,
`F_eps(s) F_{-eps}(s) = zeta(2s)`. What stays correct: the Liouville zeros lie in Re s < 1/2, so for the
conclusion "zero-free in Re s > 1/2" no exact twist counterexample is exhibited, and the item "TW+ with a zero in
7/8 < Re s < 1" stays OPEN. The filter text should name the conclusion it refers to.

**E2 (scope of a CLASSICAL label, Part A table row 1 and the Verdict sentence "the twist fails at the
functional-equation step").** (a) A real primitive Dirichlet character (eps_p = chi(p), 0 at ramified primes) is a
sign twist in the brief's sense and passes the functional-equation step; the result says so only inside a label
("unless eps is a character"), not in the verdict. (b) Hamburger and Kaczorowski-Perelli (degree 1) exclude only
functional equations of degree-1 Selberg type for a function with meromorphic continuation of finite order. For
TW+ b (eps_p = 1/2 at all p) the function is `zeta(s)^{1/2}` times a factor analytic and non-zero in Re s > 1/2:
it has branch points at s = 1 and at the zeta zeros, so the step that fails is continuation, before any
functional equation. The measured T4 line test covers three twists and the single factor `pi^{-s/2} Gamma(s/2)`.
The cell "twist fails at Fricke" is therefore: PROVED for finite twists (explicit ratio of local factors),
CLASSICAL for degree-1 type equations, MEASURED otherwise.

## Scope notes (not errors)

1. **TW- c is not independent of TW- b at kernel level.** Seed 20261117 gives eps_p = -1 at p = 2, 3, 5, 7, 11
   (referee replay of the generator). The T4 kernel ratios of TW- c equal those of Liouville to 12 digits in
   `partA_twist.log`. T1, T2, T3 are exact identities for any completely multiplicative eps, so they do not
   depend on the choice.
2. **"Lowest off-line zero" is a count comparison with zeta, not a zero count of `F_tau`.** The result says the
   argument principle was not used. The headline heights 415.256, 111.694, 49.715 are "lowest found, with
   sign changes + 2 x off-line equal to the zeta count below", label MEASURED.
3. **`sq-canonical-det`, Lemma A(b), has a cancellation clause** (a pole at `rho` is removed by a zero at
   `rho - 2 omega`). The result does not state that it was checked. It is not met for the listed poles: at each
   listed height the only zeros are the pair `+-delta`, and `delta != omega`. The hypothesis `nu omega > 1` /
   continuity of the kernel for the heat family rests on ten measured values, as the result says. The row
   "norm K[T] < 1 fails" is PROVED-rel Lemma A + MEASURED zeros + MEASURED kernel class. The Ritz run was not
   done; T* is unknown.
4. **Part C uses two inputs outside the interval computation**: exact evenness of the kernel (classical theta
   inversion; used only for (CS) on (0, 1/4) and for the extension to u < 0; (P) and (LC) on u >= 0 do not use
   it) and a hand-derived tail bound. Both are stated. "Arb certificate" is accurate with those two inputs named.
   Item 4 of FLAGS (M3 failure of TW+ with 0 < eps_p < 1 in `h-tnr-geometric`) was read against the lane's
   definition of M3 and is plausible; it was not re-derived in detail.

## Re-derivation of the PROVED steps

- **Finite twist (Part A).** `F = zeta(s) (1 - p^{-s})/(1 - eps_p p^{-s})`. Zeros of the ratio: `p^{-s} = 1`,
  Re s = 0. Poles: `p^{s} = eps_p`, so Re s = log|eps_p|/log p <= 0 (none if eps_p = 0). Zeros in 0 < Re s < 1
  are zeta's. Confirmed.
- **T1, T2.** `a(pn) = a(p)a(n)` and `a^{-1} = mu a` are identities for completely multiplicative a. DH defect
  `a(4) - a(2)^2 = -1 - k0^2`, modulus 1.0807. Confirmed.
- **D1.** Tightness of `S_{sigma_0}` on [T, 2T] from the Bohr-Jessen limit law on [0, 2T]; Selberg's central
  limit theorem with `lambda_T -> 0` gives proportion 1/2 + o(1) for `S > M + R`; intersection has proportion
  >= 1/2 - eps - o(1); the two sets `D_a > M`, `D_a < -M` are disjoint, so both proportions tend to 1/2.
  Confirmed. Both inputs are unconditional as stated (Selberg 1946 / Tsang; Bohr-Jessen for sigma > 1/2,
  including sigma = 1). The removed variance `sum_p (2 p^{-1/2-sigma_0} - p^{-2 sigma_0})/(2 pi^2)` converges
  because `1/2 + sigma_0 > 1`. Confirmed. Cited statements were not re-read by the referee either.
- **D2.** `Xi(t + ia) = xi(1/2 - a + it) = conj xi(sigma_0 + it)`. Under RH, `E_a` is Hermite-Biehler without
  real zeros (lane Theorem 6, classical), so `N_u(T) = arg xi(sigma_0 + iT)/pi + O(1)`. Stirling:
  `Im log Gamma(s/2) - (t/2) log pi = theta(t) + a pi/4 + O(1/t)`. Referee check of the constant: a = 0.1 gives
  0.0785623 (t = 1e3), 0.0785400 (t = 1e5) against `a pi/4` = 0.0785398; a = 0.5 gives 0.3927616, 0.3926997
  against 0.3926991. Hence `N - N_u = D_a + O(1)`, unbounded by D1; interlacing needs a bounded difference.
  Confirmed. The lane's exclusion of a > 1/2 is at `res-identity-solenoid/RESULT.md` line 334.
- **Part C, interval part.** `trunc_tail`: `|D^j e^{-y}| <= Bell(j) y^j e^{-y}` for y >= 1;
  `n^{2j+1} <= n^9 <= e^{C n^2/2}` for n >= 41 (9 log 41 = 33.4 against 528); geometric ratio of the tail sum
  below `e^{-40 C}`. Jets with an interval base point enclose the derivatives on the whole interval. Confirmed.
- **Part C, step 2.** `h' = u L'''`, `h(0) = -L'(0) = 0`, and `L'''(u) = int_0^u L'''' < 0`. Confirmed.
  `-log kappa(sqrt t)` convex iff `L'(u)/u` decreasing iff `h < 0`. Confirmed.
- **Part C, tail.** `(log(1 + r))'' = r''/(1+r) - (r'/(1+r))^2`; `Q_2(y) e^{-y}` decreases for y > 1.62 and
  `lambda_2 X0 = 13.9`; `u e2 <= (u - 1) E2 + E2`; `-(u-1) C x <= -(u-1) C X0`. Numbers: `C X0 = 4.6427`,
  `L'' <= -4.6423`, `h(2) <= -5.3919`. Confirmed.
- **`sq-canonical-det` pole table.** `v = delta - omega`: 0.1403 - 0.1 = 0.040; 0.2610 - 0.25 = 0.011;
  0.6247 - 0.25 = 0.375; at tau = -2, omega = 0.25 the zero at 49.7 (delta = 0.2486) gives no pole. Confirmed.

## Numeric reruns (different cases and an independent implementation)

- **Part C with a different split.** Copy of `partC_dh_cert.py` with U0 = 3/2, U1 = 1/8, 47 terms, 256 bits:
  certified; 1514 + 610 intervals; `L'' <= -0.6073`, `L'''' <= -2.14e-4` on [0, 3/2]; tail `L'' <= -2.7817`,
  `h <= -2.1030` on [3/2, inf); `L''(0)`, `L''''(0)` identical to the lane values to 20 digits.
- **Part C, independent mpmath evaluation** at u = 0.003, 0.0371, 0.26, 0.913, 1.777, 1.9999, 2.5, 3.3 (off the
  lane's grid): `kappa > 0`, `L'' < 0`, `h < 0` at all eight; `h/u^3` = -0.6587 at u = 0.003, equal to
  `L''''(0)/3`; `L''''(0) = -1.97620088837177`.
- **Part B zeros, independent quadrature** (trapezoid rule in mpmath, 110 and 300 digits; validated at tau = 0:
  `F_0/xi = 1` to 1e-63 at height 150 and 1e-117 at height 560). Newton from the claimed values converges to
  the same points: tau = -0.5: 0.198107911 + 150.692246101i, 0.343257871 + 221.226840806i; tau = -2:
  0.248577414 + 49.715447570i, 0.624723962 + 60.707870555i; tau = -0.1: 0.021557869 + 415.256278964i,
  0.060915242 + 540.469736230i, 0.140253145 + 564.369309103i. Relative residuals 1e-40 to 1e-164.
- **Part B count, different window.** tau = -2 on [1, 62], step 0.05: 10 sign changes (first at 14.7) plus the
  two off-line pairs at 49.7 and 60.7 = 14 = zeta's count below 62 (the tau = 0 scan gives 14).
- **Part B, `L_tau - L_0`.** Referee values at x = 0.6 and 6.1: -5.715e-5, -4.828e-4 (tau = -0.1); -2.836e-4,
  -2.400e-3 (tau = -0.5); -1.103e-3, -9.393e-3 (tau = -2). Equal to the lane values. A third node x = 3.3:
  -2.968e-4, -1.474e-3, -5.745e-3.

Not rerun by the referee: the Pick and sector matrices at 300 digits, T3, the decay table of the scattering
quotient, the Part D illustration, the windows [230, 405] and [532, 572].

## Controls

The result claims no zeta-only mechanism, so there is no step that the controls have to fail. The control
statements it makes about other lanes were checked as above. One control run by the referee changes the text
(E1): the Liouville twist is an exact sign twist with zeros off the critical line.

## Requirement flags

| Flag | Referee value | Reason |
|---|---|---|
| R1 | false | no attack; the multiplicative steps tested pass for every twist |
| R2 | false | D1 is a statement on proportions of t; C concerns the DH kernel |
| R3 | false | no mechanism is proposed |
| R4 | false | no zero location is derived |

## What survives

1. Sign twists (six, completely multiplicative) pass the DH-failing coefficient steps exactly (identities).
   Finite twists have zeta's zeros in the open strip. Failure at the functional-equation step: PROVED for finite
   twists, CLASSICAL for degree-1 type equations, MEASURED otherwise; real characters pass it.
2. Backward heat: seven off-line zeros confirmed by an independent quadrature; "lowest" is by count comparison.
   `stack-feasibility`: (ii) mismatch values confirmed; (i) exact; (iii), (vi) as measured by the lane.
   `sq-canonical-det`: outcome relative to Lemma A; Ritz run not done.
3. DH theta kernel: positive, strictly log-concave on u >= 0, `h < 0` on u > 0; interval cover reproduced with a
   different split; tail bound and the step from `L'''' < 0` re-derived; evenness is a classical input.
4. D1 and D2 hold relative to Selberg's central limit theorem and Bohr-Jessen (not re-read). Fixed shifted
   interlacing partners are closed. Height-dependent shifts and non-shift partners stay OPEN.
5. Corrections to carry into the map: E1 (Liouville is an exact twist with off-line zeros, in Re s < 1/2) and E2
   (scope of the functional-equation failure).
