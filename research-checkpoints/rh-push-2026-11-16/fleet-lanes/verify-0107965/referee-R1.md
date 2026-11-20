# Referee R1: initial strip, normalisation and startup

Object: hexagon:2611.00460v1 (Raymond), sec 2.1 (eqs 7-16), sec 4.4 (eqs 99-102), sec 5.1.
Date 2026-11-17. Scope of this file: R1 only. Nothing here is a statement about the source theorem,
the kernel certificates, the wall, the contact argument or the 221,010 arcs.

**Verdict: verified-with-corrections.** Every step of R1 was re-derived and holds, given the imported
7/8 theorem (E1) and de Bruijn's contraction theorem (E3) as cited. The corrections are wording only
and do not change any number. No gap and no error was found in this part.

## 1. What the part claims

1. H_0(z) = xi((1+iz)/2)/8, d_t H = -d_zz H, H_t even and real on the real axis, H_t(iy) > 0 (eqs 7-12).
2. s = (1+iz)/2 = (1-y)/2 + i x/2 for z = x+iy (eq 13).
3. Import: zeta(s) != 0 for Re s > 7/8 (eq 14, sec 5.1). With the functional equation: nontrivial
   zeros have 1/8 <= Re <= 7/8, hence zeros of H_0 have |y| <= 3/4 (eq 15).
4. de Bruijn (Thm 2.1): zeros of H_t have y^2 <= max(9/16 - 2t, 0) for t >= 0 (eq 16).
5. Seed q_init = 9/16 + 1e-12; tau = 1e-14; on [0, tau] the first ideal arc stays above 9/16 - 2t by
   at least 1e-12 - r_0 q_init tau = 9.3036e-13 > 1/(2e12) (eqs 99-102).

## 2. Step-by-step check

| Step | Check | Result |
|---|---|---|
| xi definition (7), H_0 = xi/8 (10) | Compared with Polymath (arXiv:1904.12438v2) eqs (1)-(4), text extracted locally: identical definitions of xi, Phi, H_t, same constant 1/8, same equation d_t H = -d_zz H. Numerically: H_0(z) from the integral versus xi((1+iz)/2)/8 at 6 complex points (abs(Im z) up to 0.9, Re z up to 40), relative difference < 1e-30 at 30 digits. H_0(2 gamma_1) = 1.3e-34. | holds |
| heat equation sign | -d_zz cos(zu) = u^2 cos(zu) = d_t of e^{tu^2} cos(zu). Finite-difference test at t = 0.05, z = 11.3+0.4i: relative residual 8e-11. | holds |
| (12) H_t(iy) > 0 | cos(iyu) = cosh(yu) > 0; each summand of Phi has sign of 2 pi n^2 e^{4u} - 3 >= 2 pi - 3 > 0 for u >= 0, n >= 1. Sampled t in {-0.5, 0, 0.1, 0.5}, y in {0, 0.75, 1, 3}: all positive (min 0.0618). | holds, all real t and y |
| (13) coordinates | (1 + i(x+iy))/2 = (1-y)/2 + ix/2. | holds |
| zeros of xi = nontrivial zeros | s(s-1) cancels the pole of zeta at 1 and of Gamma(s/2) at 0 (xi(0) = xi(1) = 1/2, checked numerically as limits); the poles of Gamma(s/2) at -2, -4, ... cancel the trivial zeros (xi near -2, -4, -6 is nonzero, checked). | holds |
| (15) strip | Re rho > 7/8 excluded by E1. If Re rho < 1/8 then 1 - rho is a zero (xi(s) = xi(1-s), checked at two points) with real part > 7/8. So 1/8 <= (1-y)/2 <= 7/8, i.e. -3/4 <= y <= 3/4. Closed strip, from a strict hypothesis: correct direction. Halfwidth 2(7/8) - 1 = 3/4, square 9/16 (exact). | holds |
| Thm 2.1 = Polymath Thm 3.2 | Polymath text: "Suppose t0 in R and y0 > 0 is such that there are no zeroes H_t0(x+iy) = 0 with y > y0. Then for any t > t0 there are no zeroes H_t(x+iy) = 0 with y > max(y0^2 - 2(t-t0), 0)^(1/2)." Same H_t, same normalisation. The paper's two-sided form follows from H_t(conj z) = conj H_t(z). The hypothesis is a closed strip, the conclusion a closed strip; no endpoint issue. | statement matches |
| rate and sign of the contraction | Model with the same evolution: z^2 + a^2 evolves to z^2 + a^2 - 2t, so y^2 = a^2 - 2t exactly (rate 2 is attained, sign as stated). Second model e^t cos z + c (c = 1.05, 1.2, 2, 10; t from 1e-14 to 0.04): y(t)^2 <= y(0)^2 - 2t in all cases (minimum slack 6.6e-16, at t = 1e-14). A two-cosine model: slack positive at t = 0.01, 0.05, 0.1 (zero search by local root finding from a grid; a sanity check, not a proof). | consistent |
| (16) | Thm 2.1 at t0 = 0, a = 3/4. | holds |
| Lemma 4.1 lower bound used in (101) | Q(u) = (q0 + 2/r) e^{-ru} - 2/r and e^{-ru} >= 1 - ru give Q(u) >= q0 - (2 + r q0) u for every u >= 0 (no smallness needed). Checked against the exact Q at 11 points of [0, tau] at 60 digits. | holds |
| (101) | Q(t) - (9/16 - 2t) >= 1e-12 - r_0 q_init t >= 1e-12 - r_0 q_init tau for 0 <= t <= tau. The 2t terms cancel exactly. Valid on the whole closed interval [0, tau], which is what Thm 2.10 asks for ("exclusion of a violation during the preceding startup interval"). | holds |
| r_0 | Read from the certificate (`FLOW.json.gz`, record 0, field `rate`): equals the printed 122615339047817575291909362361/9903520314283042199192993792 = 12.380985... Record 0 has t = 0, dt = 1/2048000, qin = 562500000001/10^12, row 0. `initial_sigma` = "7/8", `initial_q` = 9/16 + 1e-12, `startup_tau` = 1e-14. | matches |
| (102) | Exact fractions: 1e-12 - r_0 q_init tau = 921380903213784218478552545296645590637639 / 990352031428304219919299379200000000000000000000000000 = 9.303569579e-13 > 1/(2e12). Equal to the printed fraction. | holds |
| tau inside the first arc | 0 < 1e-14 < 1/2048000 = 4.88e-7. | holds |
| slack of the startup | With the exact Q the classical bound 9/16 - 2t stays below the first arc until t = 1.436e-13 (root of Q(t) = 9/16 - 2t), 14 times tau. | margin exists |
| T < min(41/250, 1/2) | T = 22101/204800 = 0.10792. | holds |
| the packet checker does the same test | `verification/arcs/verify_arcs_fresh.py` lines 166-173 and 236-239 (read, not run by me): requires initial_sigma = 7/8, initial_q = 9/16 + 1e-12, tau = 1e-14 < step, startup = eta - rate_0 * initial * tau equal to the stored value and >= 1/(2e12). Same formula as (101)-(102). | consistent with the text |

## 3. The imported theorem (sec 5.1)

- Lean declaration, read in the local workspace `~/lean-deps/qrh-verify/lean` (unmodified copy) and in
  `r2-lean-kappa-1318/lean` (byte-identical file `OAI/NumberTheory/DirichletL/Nonvanishing.lean`):
  `theorem riemannZeta_ne_zero_of_seven_eighths_lt_re {s : C} (hs : (7 / 8 : R) < s.re) : riemannZeta s != 0`.
  One hypothesis, Re s > 7/8; conclusion about Mathlib's `riemannZeta`, the ordinary Riemann zeta function.
  No character, no extra strip, no certificate argument. This is the statement the paper says it imports.
- Local evidence already on disk (made by this project earlier, re-counted here, not re-run):
  `build.all.log` ends "Build completed successfully (7061 jobs)", exit 0; the retyped challenge type and the
  solution type are identical (`check/challenge.types` vs `check/solution.types`); `#print axioms` gives
  propext, Classical.choice, Quot.sound; `leanchecker` replay log has 2990 lines, all rc=0, covering
  2924 distinct modules, set-equal to the closure list. The count 2924 agrees with the paper. Lean 4.34.1 and
  Mathlib d13f23b7 agree with the paper's table.
- The paper says its author did not run a fresh Lean build. That is accurate; this project's local replay
  supplies it, at commit adc7f1241 (the paper's "external rebuild source commit"), not at fd4aeeb2.

## 4. Failure modes looked for

| Failure mode | Finding |
|---|---|
| open range used at an endpoint | E1 is strict (Re s > 7/8); it is used to get the closed strip abs(y) <= 3/4, and the barrier starts strictly above it (9/16 + 1e-12). Thm 3.2 of Polymath is closed-to-closed. No endpoint misuse. |
| supremum over infinitely many zeros treated as attained | Not in R1. On [0, tau] the bound 9/16 - 2t is a strip bound valid for every zero at once; no highest zero is selected. Attainment is needed only for t >= tau (Lemma 2.8, part R3). |
| real-zero collision or multiple zero | Thm 3.2 has no simplicity hypothesis. Nothing in R1 uses zero dynamics. |
| limit and maximum interchanged | None in R1. |
| remainder valid only for large argument | None in R1. |
| appeal to an earlier preprint by the same author | None in R1. External inputs are E1 (OpenAI Lean theorem) and Polymath Thm 3.2 / de Bruijn Thm 13 only. |
| narrower strip smuggled in | The checker and the flow file carry sigma = 7/8 and q = 9/16 + 1e-12 exactly; 0.8748867 does not occur in the R1 chain. |
| direction of inequalities | e^{-x} >= 1 - x gives a lower bound for the barrier; de Bruijn gives an upper bound for the zeros; the difference is bounded below. Correct directions. |
| Lemma 2.8 constant uniform in t | Polymath Thm 1.5 reads "Let 0 < t <= 1/2, let C > 0 be a sufficiently large absolute constant ... (i) if x >= exp(C/t) and H_t(x+iy) = 0 then y = 0". C is absolute, so exp(C/tau) bounds all t in [tau, T]. With tau = 1e-14 the rectangle is not effective; the paper uses only its existence. (Belongs to R3; checked here because it is the reason for the startup.) |

## 5. Corrections (wording; no number changes)

1. Eq (14) and (107) state the import with "s != 1". The Lean theorem has no such exclusion (Mathlib assigns
   a finite nonzero value at s = 1). The Lean statement is the stronger one; the paper's remark that the
   value at the pole is irrelevant is correct.
2. The paper does not say why Mathlib's `riemannZeta` on 7/8 < Re s <= 1 is the function zeta in (7). It is:
   Mathlib's function is holomorphic away from 1 and equals the Dirichlet series for Re s > 1, so it is the
   analytic continuation. One sentence should be added. This identification, the Fourier identity
   H_0 = xi/8 and Thm 2.1 are ordinary literature facts, not formalised in the packet.
3. Sec 2.1 says the contraction theorem "is used twice". It is used at least three times: startup (16),
   the bound abs(Im z) <= 1 in Prop 2.4 / Lemma 2.8, and the terminal cleanup Lemma 2.11.
4. The seed is called Q_0 in (10) and q_init in (99); same value.

## 6. Not checked

- The proof of the 7/8 theorem itself. It is imported. I read the declaration and re-counted existing
  local build and replay logs; I did not rebuild or replay anything in Lean today. Mathlib was never
  re-elaborated locally (compiled cache). The theorem is unrefereed.
- That commits fd4aeeb2 and adc7f1241 of openai/math have the same proof subtree (the paper's claim; the
  local copy is of adc7f1241 and is not a git checkout).
- The external verification report [7] cited by the paper.
- de Bruijn's original Theorem 13 (1950) was not read; the statement was taken from Polymath Thm 3.2,
  which cites it without proof. Its rate and sign were tested on explicit models only.
- The packet stage `arcs` was not run by me (the startup arithmetic was recomputed with own code).
- Everything outside R1, including whether the first arc's rate r_0 is justified (source and own-pair
  bounds of row 0): parts R3-R9.

## 7. Files

- Own script: `scripts/r1/r1_checks.py` (stdlib fractions + mpmath 1.3.0; run with `python3 -I` through
  `scripts/memcap.sh 8`; reads only `FLOW.json.gz` from the packet as data). Log: `runs/r1/r1_checks.log`
  (ends "R1 CHECKS PASS").
- Reference text: `runs/r1/ref/polymath15.txt` (pdftotext of arXiv:1904.12438v2; Thm 3.2 at line 648,
  Thm 1.5 at line 379, eqs (1)-(4) at lines 26-60).
