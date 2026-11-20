# REFEREE: ap-box-experiment/RESULT.md

Referee pass of 2026-11-17. Verdict under review: partial-result. Referee outcome: **does not hold as stated**
(one PROVED statement has consequences that are false as written); the code deliverable, the certified table and
Proposition 1 are confirmed. Labels: CONFIRMED (re-derived or re-run by the referee), REFUTED, NOT CHECKED.

All referee numerics were run through `scripts/memcap.sh 8` with `.venv-arb/bin/python -I` (python-flint 0.9.0,
mpmath, numpy, scipy), single process, each under 10 minutes, planned memory under 400 MB. Referee scripts:
`/tmp/ref-apbox/c1.py … c6.py` (not kept in the repo). Nothing was run on the compute server.

## 1. What was confirmed

| item | check | result |
|---|---|---|
| `selftest.py` | re-run under the cap | 16 of 16, `SELFTEST PASSED`, 19.7 s |
| `sweep.py --tier smoke` | re-run, 2 workers, 8 GB cap | completes, plans printed before each task, verdicts consistent with `results/local.jsonl` |
| DH off-line zero | mpmath (Hurwitz zeta), independent of lylib | 0.80851718245664 + 85.699348485378i; reflected point also a zero |
| DH fails `afe` sharp at N = 4 | mpmath root search, independent code | zero at z = 0.765513326 i (a real zero of the object at s = -0.2655 and 1.2655); none found at N = 3 |
| DH fails `thalf` at N = 1 | mpmath | zero at z = 9.909150605 + 1.064564528 i, inside the certified bracket (9.75, 10.56) |
| zeta fails `afe` sharp at N = 2 | mpmath | z = 4.259283885 + 0.973595933 i |
| zeta fails `euler` at P = 17, 23; passes P = 13, 29 | mpmath | zeros 0.7522 + 0.2970 i (P = 17), 0.6976 + 0.1010 i (P = 23); none found for P = 13, 29 in the window |
| Jensen verdicts | lylib re-run | dh d = 128 PASS; nr:3:2.2 n = 0: d = 8 PASS, d = 16 FAIL (14 real roots); n = 8, d = 16 PASS |
| "EXPECTED Jensen failure near d ~ (gamma_1/2a)^2" | lylib on wider E_a (referee's inputs) | ea:2 (prediction 12.5): passes 12, fails 16; ea:1 (prediction 50): passes 48, fails 64. The rule is consistent with three data points (with nr); it remains an extrapolation for ea:0.25 (800) and DH (2e4) |
| Proposition 1 | re-derived; numerics | see section 2 |
| Proposition 2, the stated equivalence | re-derived; numerics | see section 3 |
| certified machinery (Expander remainder, `darg`, symmetry factors 2 and 4 in the counts, PASS rule n_tot = 2 n_real, Sturm chain with certified degrees, K-Bessel bound, pole-free strips Y < 1.9 / 1.4 / 0.35) | read line by line | no error found |
| identity for `afe` and incomplete-gamma closed form for `thalf` | re-derived | correct: 2 Gamma(s/2+2) - 3 Gamma(s/2+1) = (s(s-1)/2) Gamma(s/2) |

The statement "no scheme has the pattern: zeta passes every size, every control fails" is correct for the full
windows. For the high window it needs the qualification in section 4.1.

## 2. Proposition 1 (half-line truncation): CONFIRMED

Re-derivation. phi_n'(0) = e^{-pi n^2}(-8 pi^3 n^6 + 30 pi^2 n^4 - 15 pi n^2): correct. The bracket is +0.914 at n = 1
(phi_1'(0) = +0.0394988) and negative for every n >= 2; sum over n >= 1 is 0 (evenness of Phi; checked to 40 digits).
So Phi_N'(0) = -sum_{n>N} phi_n'(0) > 0 for N >= 1. Two integrations by parts are valid (Phi_N and its derivatives
decay doubly exponentially), giving t^2 F_N(t) -> -2 Phi_N'(0) < 0. Finitely many real zeros follows (isolated zeros,
none for large |t|). F_N is entire of order at most 1 (kernel bounded by exp(-pi e^{2u})), even, and o(1) on the real
axis, so by Hadamard it is not a polynomial times an exponential; it has infinitely many zeros, hence infinitely
many non-real ones.

Numerical check: Phi_N'(0) = 3.9498765e-2, 8.2652796e-8, 1.3917259e-16 for N = 1, 2, 3, and t^2 F_N(t) at
t = 800 equals -0.078965, -1.6470e-7, -2.7465e-16 against -2 Phi_N'(0) = -0.078998, -1.6531e-7, -2.7835e-16.
For N = 1 there is exactly one sign change of F_1 on (0, 60) (near 14.05).

Remarks.
1. Not new in kind: it is the standard 1/t^2 asymptotic of a cosine transform whose kernel has a corner at 0. It is
   a correct elementary observation, not a result about zeta; the same proof applies to DH and to every input
   (the RESULT says so). No novelty should be claimed.
2. "First off-axis zero near 4.2 (N+1)^2 + 3" is a three-point fit with residuals +0.8, +2.3, -2.3 (referee zeros:
   20.625 + 2.697 i, 43.139 + 3.281 i, 67.880 + 0.477 i against 19.8, 40.8, 70.2), and "first" means first with
   |Im z| <= 4. Zeros with |Im z| > 4 at lower height are not excluded by the run. Label: MEASURED, low weight.

## 3. Proposition 2 (Bohr lift): the equivalence is CONFIRMED; two stated consequences are REFUTED

Confirmed. With a = |eps| p^{-sigma} < b = |eps| p^{sigma-1} < 1 and c = Re(z sign eps), the ratio
(1 + b^2 - 2bc)/(1 + a^2 - 2ac) has derivative of the sign of (a - b)(1 - ab) < 0, so its minimum over the circle is
((1-b)/(1-a))^2 at z = sign eps. The phases are independent, so
min over the torus of |first term|/|second term| = R prod (1-b_p)/(1-a_p), attained. The near-line form
Re psi(1/4 + it/2) - log pi > 2 sum |eps_p| log p/(sqrt p - |eps_p|) is the sigma-derivative at 1/2: correct.
t_line reproduced: log10 = 2.2517, 3.5552, 4.6862 for P = 2, 3, 5. Closed form against 3000 random torus points
for three sign patterns at sigma = 0.51, 0.6, 0.9: never beaten, attained at z_p = sign eps_p to 10 digits.
Hypothesis to add: eps_p real (for complex eps_p the two factors carry eps_p z and eps_p conj z and the argument
changes).

So the proposition is a statement about **dominance** (|first| > |second| on the whole torus). It is not a
statement about zeros of M, and the RESULT, the README and the docstring of `bohr.py` ("Lee-Yang stability at height
t: M != 0 for all th, i.e. R m > 1") identify the two. Both directions of that identification fail:

**(a) "The multivariate Lee-Yang property therefore fails for zeta at every P >= 2 below t_line(P)" and the table
entry "unstable at t = 14 for every P >= 2": REFUTED for P = 2 (float64 and 30-digit search, not certified).**
For P = 2 there is one phase. The dominance criterion fails at t = 14, 30, 100, 170 (all below t_line(2) = 178.5),
but M has no zero with 1/2 < sigma < 1: on a 600 x 1440 grid in (sigma, theta) followed by local refinement,
min |1 + second/first| = 1.063, 0.960, 0.119, 0.961 at t = 14, 30, 100, 170, attained at the edge sigma -> 1; an
independent 2-unknown Newton search at 30 digits (400 starts) found no interior zero at t = 14, 100, 170. This is
what the count of unknowns predicts (two real equations, two unknowns: zeros are isolated and need not exist), and
it agrees with the lane's own certified result that the univariate `euler` object passes at P = 2. The RESULT marks
the converse as ARGUED "with P >= 2 free phases"; at P = 2 there is one free phase and the argument does not apply.
For P = 3 and P = 5 at t = 14 interior torus zeros do exist (e.g. P = 3: sigma = 0.9362271502,
theta = (0.39368645, 0.89464013), residual 2e-30), so the statement is supported for P >= 3 at that height.

**(b) "... and holds above it for every sign twist": REFUTED on the strip 1/2 < sigma < 1.**
prod (1 - p^{sigma-1}) -> 0 as sigma -> 1 while R stays bounded, so dominance fails near sigma = 1 at every height
and every P. Interior zeros of M above t_line: P = 2, t = 200: sigma = 0.8519336605, theta = 0.096189541;
P = 3 (t_line = 3591), t = 1e4: sigma = 0.9889784, 0.9439355, 0.9467988; t = 1e6: three zeros with sigma in
(0.992, 0.9995); P = 5 (t_line = 4.9e4), t = 1e6: three zeros with sigma in (0.984, 0.9995); residuals below 1e-24.
t_line(P) is therefore only the threshold for dominance in a neighbourhood of sigma = 1/2 (the table row says
"stable near the line", which is the correct wording; the sigma grid of `bohr.py` stops at 0.75 and cannot see this).
The lifted symmetrised Euler product is not Lee-Yang on the open strip at any tested height for P >= 3.

**(c) Twist-blindness does not need the proposition.** For real signs eps_p = +-1 the substitution
z_p -> sign(eps_p) z_p is a bijection of the torus and maps the lift of the twist to the lift of zeta exactly. The
zero sets are translates of each other; every torus-level statement (dominance, zeros, minima) is identical. This
is an identity, stronger and simpler than the consequence drawn from Proposition 2, and it already follows from the
definition of the Bohr lift. For |eps_p| < 1 (tw2h) the lift does change, as reported.

Corrected statement that survives: for real eps_p with |eps_p| <= 1 and 1/2 < sigma < 1, the first term of M
dominates the second on the whole torus iff R prod (1-b_p)/(1-a_p) > 1; this is sufficient for M != 0 at that
sigma and not necessary; near sigma = 1/2 it holds iff t > t_line(P), log t_line ~ 4 sqrt P; near sigma = 1 it
fails for every t. The link to row Q11 (finite-prime reserve, twist-blind) is as the RESULT states.

Novelty: none claimed beyond "Q11 restated on the torus"; that is accurate. The dominance mechanism for symmetrised
finite Euler products at large height is in the literature on finite Euler products (Gonek and co-authors; from
memory, not re-read for this pass).

## 4. Table and controls

1. **High-window `euler` row is the target pattern at the tested sizes, among formulable controls.** zeta passes all
   ten P <= 47 on 10 <= |Re z| <= 30; tw2m, tw2h, liou, ea:0.25 each fail at some P <= 17. The sentence "No scheme in
   the local run has the target pattern (… every formulable control fails at some tested size)" is true only for the
   full windows; it contradicts "partial pattern 1" two lines below it. The qualification that makes the conclusion
   safe is the lane's own: the window is |Im z| <= 0.35, contains three zeros (n_tot = 6 in every passing record),
   DH is not formulable, and the control failures are not monotone in P (tw2h high window: fails at 17, passes at 23,
   29, 47; liou: passes at 7 and 23, fails at 13, 17, 29). A three-zero window with non-monotone control verdicts
   is not evidence of a structure. This should be stated as the reason, in place of "no scheme has the pattern".
2. **`polya` rows carry no information about the inputs zeta, tw2m, liou.** n_tot = 12 for all three at N = 1, 2, 3:
   at T = 40 the n >= 2 terms are below the n = 1 term by about e^{-6 pi}, so the object is the one-term Polya
   function, whose zeros are real by Polya's theorem for any a_1. The RESULT says this for zeta; it should not list
   "tw2m, liou pass" as control data. The stated relative size e^{-6 pi} is for the zeta-type kernel; for DH the
   arguments are 2 pi n^2/5 and the n = 2 term is not negligible (n_tot = 32), so the DH pass at N <= 3 is a real
   observation.
3. **"Sign twists fail only through the missing functional equation"**: every object in `afe` and `euler` is
   symmetrised by construction (F is real on the axis and even for every input), so the object does have the
   reflection symmetry. What the twists lack is that the one-sided piece approximates a function with a functional
   equation. Wording only.
4. DH: confirmed that DH fails `afe` sharp later than zeta does (N = 4 against N = 2) and passes Riesz-weighted
   truncations, Jensen d <= 256, `polya` N <= 3 and `dbn` at lam = 0.05, T = 62. The control statement "no structural
   failure found; DH is not formulable in the Euler scheme" is accurate. Per the map's rule, "not formulable" is not
   a quantitative handle, so the `euler` scheme has no DH control at all.
5. HEAT: the Jensen stage shows no HEAT failure at any tested degree (d <= 64 or 128); only `dbn` at lam = -1 does.
   On the box, heat:-1 at d = 128 is skipped by plan and heat:-0.25 at d = 128 is at risk (section 5.2), so the
   Jensen stage will probably deliver no HEAT failure either.
6. `results/local.jsonl` has 453 lines for 435 keys (18 UNRESOLVED records superseded by later re-runs; `summary.py`
   takes the last line per key). "435 tasks" is correct; the status line "OK 423" counts lines.
7. The cited rows P17, Q11, Q13, S4, F1, G14 of the map say what the RESULT attributes to them. No external theorem
   (Lee-Yang, Newman, Lieb-Sokal, Borcea-Branden, Rallis, Kohnen-Zagier, Hodge-Riemann, Branden-Huh) is invoked in
   this RESULT; the only classical inputs are Hurwitz (used only in the plan, and it would need locally uniform
   convergence, which the `euler` scheme does not have in the strip), Riemann-Lebesgue, Hadamard factorisation and
   |K_nu(x)| <= K_{Re nu}(x) for x > 0, each used within its hypotheses.

## 5. Code deliverable and memory planning

1. **Launch command conflicts with the current box rules.** The README starts the job with `systemd-run --user
   --slice=rh.slice … taskset -c 32-39` and a 72 GB resident bound (RH_TOTAL_GB=48). BRIEF.md (reopening notice and
   updates) requires every job to be started only through `~/rh-push/bin/rhrun <name> <memGB> <cores> -- …`, at most
   64 GB per job, about 45 GB and 10 cores per lane. With `RH_WORKERS=8 RH_TASK_GB=24 RH_TOTAL_GB=28` the bound is
   1.25 x 28 + 8 x 1.5 = 47 GB; that allows one d = 2048 Jensen task at a time. The command must be rewritten for the
   wrapper before anything is launched.
2. **Heat-input memory plan is low by a factor 1.3 to 1.5.** Measured peak/plan: heat:-0.05 d = 128: 544 MB against
   371 MB (1.47); heat:-1 d = 64: 1445 MB against 1098 MB (1.32). The second task exceeded 1.25 x plan and survived
   only because of the 1.5 GB floor in the kill rule. On the box, heat:-0.25 at d = 128 is planned at 10.5 to 11.0 GB;
   at the measured ratio it peaks at 14 to 16 GB, above its kill threshold of 13.2 to 13.8 GB, and will end as
   `KILLED_MEM`. This is safe (the supervisor kills, nothing crashes) but loses those three tasks. Fix: multiply the
   heat plan by 1.6.
3. **`euler` plan is low by up to 1.9** (327 MB against 170 MB at P = 29); harmless because of the 1.5 GB floor,
   provided the Taylor-model cache (capped at 2e6 coefficients) stays below 1.5 GB at box sizes. Not tested at
   P = 997, T = 200.
4. **Wall time is underestimated.** "Wall time is about total/8" ignores the memory gate: the fifteen formulable
   d = 2048 Jensen tasks are planned at 18.3 to 18.9 GB each, so at most two run at once under RH_TOTAL_GB=48 (one
   under a 45 GB share). With the README's own per-task figures (1.2 h zeta, 4.6 h dh) that tail is about 35
   core-hours on two cores, 15 to 20 hours of wall time after the rest of the sweep. The dh d = 2048 tasks (4.6 h
   estimated, uncertainty factor 2 to 3) can exceed the 6 h task limit. The plan itself is 2.3 to 3.6 times the
   README's expected peak (5 to 8 GB); lowering it would restore concurrency but has not been measured above d = 512.
5. Supervisor logic read and found sound: plan printed before start, per-task and total gates, polling of resident
   memory, kill and record, fsync per line, resume by key, torn last line tolerated. Bound 1.25 x RH_TOTAL_GB +
   1.5 GB x workers is correct for the sum of kill thresholds (polling interval 0.5 s; a child can overshoot between
   polls; on Linux RLIMIT_AS = RH_TASK_GB + 2 GB per child is the backstop, and an allocation failure inside FLINT
   aborts the child, which is recorded as ERROR, not KILLED_MEM).
6. The Bohr stage tests dominance on sigma <= 0.75 at t = 14 only and is float64; its PASS/FAIL must not be read as
   "M has no zero / has a zero" (section 3).

## 6. Outcome

* Proposition 1: holds. Elementary, not new, control-blind.
* Proposition 2: the equivalence holds as a dominance criterion for real eps_p. The consequences "Lee-Yang fails
  below t_line(P) for every P >= 2" and "holds above it" are false as written (P = 2 counterexample below; interior
  zeros near sigma = 1 above). Twist-blindness is an exact torus translation and does not depend on the proposition.
* Certified table: reproduced where sampled; DH failures confirmed independently. The negative conclusion (no
  scheme separates zeta from the controls) stands, with the high-window `euler` row reported as a three-zero,
  non-monotone, DH-free coincidence, not as "no pattern".
* Code: runs and is resumable; memory supervision is sound; the launch command, the heat memory plan and the wall
  time estimate need the corrections in section 5 before a box run.
* Nothing in the lane bears on the location of zeta zeros; the RESULT does not claim otherwise.
