# REFEREE: ideation-panel (2026-11-16)

Adversarial check of RESULT.md. Scripts used: /tmp/ref_ip/{c1.py,c2.py,cs2.py} (numpy/mpmath, .venv-arb), different
test cases from the author's. No RH claim is made in RESULT.md and none is found hidden.

## Outcome

holds = false on one narrow point (Lemma 3.2 is proved only for N = 3, stated for all N >= 3). Everything else
labelled PROVED was re-derived and confirmed. The verdict (no angle supplies the missing input; RH open) stands.

## PROVED steps

**(a) T-NR twin (section 0.1): CONFIRMED, two wording corrections.**
Re-derived: q^{s-1/2}D(s) = 2cosh((s-1/2)log q) + c; alpha*beta = q, alpha+beta = -c q^{1/2}; real roots for
abs(c) > 2; zeros at Re s = 1/2 +- arccosh(abs(c)/2)/log q inside the strip iff abs(c) < q^{1/2}+q^{-1/2};
Lambda_F(q^k) = (1 - alpha^k - beta^k) log q, and alpha^2+beta^2 = q(c^2-2) > 1 so k = 2 is negative.
Numeric (q = 3, c = 2.2): zero at 0.90375 + i*pi/log 3, abs(D) = 2e-26; Lambda_F(q^k)/log q = 4.81, -7.52, 22.03, -53.59.
The support-below-log-q Weil claim (labelled argued) was also checked: Poisson summation over the zero lattice of the
cosh factor gives exactly 2 log q * G(0), G = g*g~. Correct.
Corrections: (1) heights are pi(2k+1)/log q for c > 2 and 2 pi k/log q for c < -2 (so c < -2 gives two REAL off-line
zeros 1/2 +- delta); "pi*k/log q" is the union, not the zero set of one F_c. (2) "fails exactly Lambda >= 0" is
slightly too strong: the local factor (1-alpha x)(1-beta x)/(1-x) is also not a reciprocal polynomial of degree <= 1,
and the Selberg-class bound b(p^k) << p^{k theta}, theta < 1/2, fails. These are the same defect as the stated
"local Ramanujan" failure, but an argument that uses only the shape "local factor = 1/polynomial" also excludes T-NR
without using positivity.

**(b) Proposition 1.2: CONFIRMED.**
Mellin identity, entire tail, analyticity of G on real s > 1/2 (G(1) = 0, no real zeros of zeta in (1/2,1)), simple
pole at 1/2 with residue sqrt(pi)/(2 zeta(1/2)) = -0.60686, Landau, then (i). For (ii),(iii):
abs(F(sigma+it)) <= F(sigma) ~ abs(c)/(sigma-1/2) and zeta(1+2i gamma) != 0, Gamma(rho) != 0, so a zero of order m
gives a pole of order m, forcing m = 1 and abs(residue) <= abs(c). Correct. Lemma 1.1 re-derived (lambda = mu * 1_square).
Constant term +1 (pole of Gamma at 0, zeta(0)/zeta(0)) and next term O(y^2) (pole at s = -2 only) confirmed.
The side remark "M(q) is not eventually <= 0, unconditionally" is correct by the same Landau argument.
Overstatement: line 285 says the target "is equivalent to" RH + simple zeros + S-type bound. What is established is
necessary: sup_rho abs(res_rho) <= abs(c); sufficient (argued): sum_rho abs(res_rho) < abs(c), which also needs
convergence of the sum (not known even under RH + simplicity, since 1/zeta'(rho) is uncontrolled). These are not the
same condition. The summary line lists this as OPEN, which is the right label; the body sentence should say
"sandwiched between", not "equivalent".

**(c) Lemma 3.1: CONFIRMED. Lemma 3.2: PROVED ONLY FOR N = 3.**
3.1: abs(Q~/Q) <= 1 on the closed polydisc (maximum on the distinguished boundary), a zero of W needs Q~ != 0 and
abs(w)^2 = abs(Q/Q~) >= 1; exterior case by the reflection symmetry (Q~~ = Q). Real-rootedness along
z_p = e^{-it log p}, w = e^{-ilt}, l > 0, follows. Numeric: 4 primes, l = 0.7, complex Newton from random starts
returned only real roots (run cut short; partial).
3.2: the written proof evaluates at (-1,...,-1), i.e. sum_{n<=N} lambda(n) n^{-1/2}. That value is NEGATIVE for N = 3
but POSITIVE for N = 4, 6, 10, 16 (the author's own a3.log prints +0.0946 for N = 10). So the stated range "N >= 3" is
not proved by the given line. The statement is true for N = 4 and 5 by a different witness: sum_{n<=N} n^{-s} has a
zero at 0.62597 + 3.12712i (N = 4) and 0.87041 + 48.79007i (N = 5), which lifts to a zero in the open polydisc.
General N needs a zero of the partial sum with Re s > 1/2 (true for large N by Montgomery/Turan-type results;
LITERATURE, not checked here). Repair: restate as "N = 3 (proved), N = 4, 5 (numeric witness), general N (literature)".

**Exposition error in Angle 3 (not a PROVED step).** RESULT says the model is W restricted to w = e^{-i theta(t)}.
Direct computation: Z_P = e^{i theta}/Q + e^{-i theta}/conj(Q) is proportional to Q + e^{2i theta(t)} z^{-d} Q~, so
w^2 = e^{2i theta(t)} prod_{p<=P} p^{it}. For Im t > 0 the z_p leave the polydisc while the factor prod p^{it}
pulls w inward at rate (1/2) sum_{p<=P} log p. Lemma 3.1 therefore applies to the model only when
theta'(t) > (1/2) vartheta(P), i.e. P < about log t. That is the actual location of the Hermite-Biehler failure and it
is a tighter window than the "(log t)^2" quoted in the Stop paragraph (which is the worst-case necessary size, not
what Lemma 3.1 delivers). The conclusion (wall; no new statement) is unchanged or slightly stronger.

## MEASURED, rerun on other cases

* Liouville Abel sum (own sieve, N = 3e6): x = 50: L/sqrt(x) = -0.46545, L - c sqrt(x) = 0.999895; x = 7e3: 0.9999998;
  x = 7e4: 0.9999999. One sign change on [0.05, 7e4], in (2.489, 2.540); max L for x > 3 is -0.087. Agrees.
* Residues: zero 1: 1.40263e-9, zero 2: 8.356e-15, zero 4: 1.74e-21. Reserve 2*1.4026e-9/0.60686 = 4.62e-9. Agrees.
* Chowla-Selberg split at D = -67 and -43 (not in the author's run) and -163: identity residual <= 1.8e-30 at
  s = 0.5+7.3i and 0.8+17.1i. abs(rem/main) = 1.9e-7 (D=-67, t=7.3), 7e-5 (D=-43, t=7.3), 1.3e-13 (D=-163): the
  horizon scales with sqrt(abs(D)) as claimed. Main-term zero 14.13472514182 reproduced.
* Angle 3 table: not rerun (the a3 script was read and is sound; the HB margin at sigma = 1 uses zeta_P(it), where
  abs(1-p^{-it}) can be near 0, so the -90.7 minimum is dominated by a boundary effect and is grid-dependent, as the
  author's weakest-step 3 already says).

## Controls

* DH: Angle 1 target fails for DH and for T-NR (poles of the inverse in Re s > 1/2): correct, and it is a consequence
  of the target implying zero-freeness, not an independent test. Angle 2: the author correctly states the split is
  Euler-blind. Angle 3: excluded at fixed P only. Angles 4-12 are untested and labelled so.
* Hidden RH: none. Statement 1.3 assumes RH explicitly. The planted-zero flip thresholds (log x > 1.26e13 etc.)
  compare only Gamma damping against x^{beta-1/2} and ignore zeta(2 rho)/zeta'(rho); they are heuristics, not bounds.
* Verified height restated as new: no. Angle 2 is explicitly closed as a verified-height statement (horizon 40).
* Literature caveat missing: Lagarias-Suzuki give all zeros of a_0(y,s) on the line only for 1 <= y <= y* =
  4 pi e^{-gamma} = 7.0555; for y > y* there are two real off-line zeros. Here y = sqrt(163)/2 = 6.3836 < y*, so the
  use is valid, with margin 0.67. This also bears on the Stop (c) remark about orders with y = f k: for f >= 2 the
  main term itself is no longer fully on the line. Recalled, not re-read.

## Is the obstruction real?

Yes for the three worked angles.
* Angle 1: Proposition 1.2 shows the target implies RH + simplicity, so no route to it avoids square-root
  cancellation. Changing the kernel (Riesz/Cesaro means, other Mellin multipliers) changes the constant reserve, not
  the exponent. I see no way around.
* Angle 2: horizon pi sqrt(abs(D)) with h = 1 bounded by 163. One untested variant: Epstein/Eisenstein representations
  of Dedekind zeta for class-number-one fields of higher degree or real quadratic fields (unbounded discriminant
  conjecturally); there zeta_K is a period over a torus/geodesic, not a point value, so the constant-term split has no
  single dominant y. I expect the same Euler-blindness; not a lead.
* Angle 3: with the corrected w-map the window is P < about log t; no way around short of an RH-strength
  approximation statement.

## Novelty claim

Keyword grep of the atlas (PR #27) finds no Liouville/Abel/Lee-Yang/Heegner/Hamburger/Bagchi/Riesz entries; the
fifty-routes list likewise. Unflagged partial overlap: Angle 2's object (Heegner point, class number one) shares its
setting with round 3 `2026-11-01-r3-heegner-heights.md`; the mechanism (Chowla-Selberg constant term vs Neron-Tate
heights) is different. The novelty claim is against project files only, as the author states.

## Adjusted strength

Lead strength low (author's own rating); nothing here moves a bound or supplies arithmetic input. Useful residue:
the T-NR twin as a second control, and the Angle 1 necessary condition (ii)-(iii).
