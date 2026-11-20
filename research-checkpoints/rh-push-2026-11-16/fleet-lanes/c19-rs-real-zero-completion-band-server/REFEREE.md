# REFEREE: c19-rs-real-zero-completion-band-server (adversarial, lens: general)

Date: 2026-11-20. Refereed: `RESULT.md`, `PREREG.md`, `rsc.py`, `rsgrid.py`, the `res_*.jsonl` and `owed1_*.jsonl` records.
Claimed verdict: precise-obstruction, outcome (b), no statement about zeros of zeta. Claimed flags: R1 to R4 all false.

## Verdict of this referee

- holds = false for the claim as written: the step labelled PROVED ("T_sigma >= 0 on every band", "sigma >= 0 for every point set G") is false in the stated generality (E1, explicit counterexample). The gap is 3e-11 Lg on the mode spaces actually used and is covered there by the lane's own per-cell enclosure of lambda_min(T_sigma), so no measured number and no control verdict changes.
- The obstruction verdict (device closed; nothing about zeros of zeta) survives after the corrections E1 to E4. Surviving claim at the end.
- Flags set by this referee: R1 false, R2 false, R3 false, R4 false.
- Nothing in the result assumes RH. Positivity of zeta's data form is correctly attributed to verified height. Lemma P is the trivial direction of Bochner and the pair-form bound is c17's; neither is presented as new.

## Errors

**E1 (PROVED step false as stated; repairable; no number changes).** Section 2 states "rho - rho_J >= 0 on J and sigma >= 0 for every point set G" and the verdict states "Lemma P (PROVED): T_sigma >= 0 on every band". Outside J the measure sigma has density rho(x) = (Re psi(1/4 + ix/2) - log pi)/(2 pi), and this is negative near the origin: rho(0) = -0.8550, rho(3) = -0.118, rho(6) = -0.0075, sign change at abs(x) = 6.2898, negative mass 2.2479 (computed here, mpmath). So sigma is a signed measure, the hypothesis of Lemma P is not met, and T_sigma is not non-negative on H^1_0(I). Counterexample: U = 10, h(s) = sin(pi s/10): int abs(g)^2 rho dx = -22.76 against norm(h)^2 = 5; the point masses near 1e6 add less than 1e-18 and the chord term is subtracted, so <h, T_sigma(10) h> < -4.5 norm(h)^2. (This is the known negativity of the archimedean term at low frequency.)
Repair: Lemma P itself (hypothesis sigma >= 0) is correct. For the constructed sigma one has T_sigma >= -2.248 sup over abs(x) <= 6.29 of abs(g(x))^2. On m Fourier modes centred at t_w, abs(g)^2 <= 4 m norm(c)^2/(t_w - span)^2 and norm(h)^2 = u norm(c)^2, so the correction is at most 2.248 * 4m/(u t_w^2) = 3e-10 absolute (3e-11 Lg) at 1e6 with m = 384 and smaller above. The runs do not rely on the lemma for this: t_min is enclosed at or above 2.4e-6 Lg in every zeta cell (re-read from the records: 2.4e-6, 2.3e-3, 4.5e-3 Lg at the three heights), with the exact digamma multiplier in `tz.arch`. The statement must be restricted to the mode spaces (or carry the correction term); "on every band" and "for every point set, by construction" must be removed. Lemma P (iii) and all tolerances inherit the same correction.

**E2 (misstated range).** "-e_min times (t/2 pi)^(1/4) = 1.3 to 2.1 at all three heights" (section 4 reading 2, verdict item 2, proposed map text) is the range of the medians over m. Re-aggregated from the 216 zeta records: the cell range is 0.73 to 2.74 at 1e6, 0.95 to 2.26 at 1e9, 1.04 to 3.29 at 1e12; medians by m are 0.0674/0.0703/0.0797, 0.0113/0.0127/0.0144, 0.00216/0.00306/0.00335 Lg. The map text should say "median 1.3 to 2.1; cells 0.7 to 3.3". The upper edge of the scaled range rises with height (2.26 to 3.29 from 1e9 to 1e12 at fixed grid), so "the defect is the Riemann-Siegel remainder and nothing else" stays ARGUED, as the lane's weakest step 3 already says.

**E3 ("ZQ has the same one-sided defect as zeta" is false at 1e12; "passes" is threshold- and height-limited).** From the records, ZQ at eta = 0.01 against zeta in the same cell: ratio of defects 1.00 (1e6), 0.99 to 1.08 (1e9), 1.52 to 4.22 (1e12; median 2.37). At 1e12 ZQ's defect exceeds zeta's worst cell (0.0052) in 72 of 72 cells. ZQ "passes" only because the registered threshold 0.05 is fixed while zeta's defect falls. Two consequences the result does not state:
(a) at fixed eta the pair term is mu/Lg = (u/Lg)(sinh(u eta)/(u eta) - 1), about theta^3 Lg^2 eta^2/6 in the lane's units, which grows with height; ZQ at eta = 0.01 exceeds the registered 0.05 itself once Lg is about 70 (t of order 1e31 at theta = 0.85). "ZQ at eta = 0.01 passes" is a statement about 1e9 and 1e12, not a height-uniform one.
(b) against a height-scaled tolerance (the measured Riemann-Siegel size, or the 5e-4 Lg of the C0 variant) eta = 0.01 is rejected at 1e12, and by the C0 variant at all three heights (pair form 0.0015 to 0.0084 against 5e-4).
The obstruction is therefore not "ZQ at small eta passes" but: at tolerance tau Lg the one-sided statistic cannot see a pair with u (sinh(u eta)/(u eta) - 1) below tau Lg, i.e. (u eta)^2 below about 6 tau Lg/u, a set that is non-empty for every tau > 0 and every height. Section 7 item 2 is correct only with eta allowed to depend on height (u eta bounded by that threshold). In this form the closure stands, and it is forced by Lemma Z on paper; the runs confirm sizes but add no independent evidence for (b), because the ZQ completion is zeta's point set minus two points by convention (the lane's weakest step 1 says so).

**E4 (certification count).** "eta* > 0 in 432 of 432 cells" is true of the float bisection (re-read: 144 + 144 + 144 records, smallest eta* 0.0142, 0.0064, 0.0025). The bracket is certified in balls in 422 of 432 (10 uncertified at (1e12, 0.95)); the body of the result says this, the summary line does not.

**E5 (scope notes, not errors of substance).** u = theta log T0 while the full band is Lg = log(t/2 pi), so u/Lg is 0.87 to 0.98 at 1e6 and 0.80 to 0.91 at 1e12: the label theta is not the same fraction of the band at different heights, and theta = 0.85 at 1e6 is within 2 percent of the full band. All signs at 1e12 for theta = 0.80, 0.85 are relative to a hand-derived prime-sum radius with no direct sum (stated by the lane). DH at 1e12, backward heat, unimodular twist, Beurling, phase-rotated transfer operator and theta^w were not run (stated).

## PROVED steps re-derived

- Lemma P (i) to (iii): correct under its hypothesis sigma >= 0 (integral of abs(g)^2 against a positive measure; a form on L^2[0, u] reads its kernel on (-u, u); linearity). Its application to the constructed sigma fails by E1.
- Arch density: vartheta'(x)/pi = (Re psi(1/4 + ix/2) - log pi)/(2 pi) is the multiplier of the archimedean term of the explicit formula. Confirmed; matches `rsc.py` line 94 and `tz.arch`.
- Pair form (Lemma Z (d)): with a_+-(s) = e^(i gbar s) e^(+-eta s) on [0, u], the pair contributes |a_+><a_-| + |a_-><a_+|, rank two, eigenvalues <a_+, a_-> +- norm(a_+) norm(a_-) = u +- sinh(u eta)/eta. Smallest eigenvalue on L^2[0, u] is exactly -mu = -u (sinh(u eta)/(u eta) - 1); on a subspace it is at least -mu. Confirmed by hand. Spot values: 1e12, theta = 0.75, eta = 0.01 gives mu/Lg = 0.005763 (record: 0.005763; measured pair_min -0.005762); eta = 0.25 at theta = 0.85 gives 26.6 (table: -26.6).
- Lemma Z consequence E_ZQ = E_zeta + r1 + r2 - g1 - g2 + pair: sign bookkeeping confirmed.
- Lattice root of Proposition Z: recomputed at (1e6, 0.6) = 0.135 and (1e6, 0.95) = 0.0032; table has 0.134 and 0.0032.

## Numeric check rerun on a different case (this referee; local, `scripts/memcap.sh 8`, mpmath + numpy in a scratch venv outside the repo, 8 min 45 s)

Case not in the lane: t_w = 200037, theta = 0.8 (u = 9.765, Lg = 10.368), m = 48, J = t_w +- 100. Zero side only: E approximated by sum over zeros of zeta in J (sign changes of mpmath `siegelz`, 330 found, smooth count 330.04) minus sum over sign changes of the main sum (N = 178, 328 found); float64 eigenvalues; tails outside J dropped.
- zeta: e_min = -0.0677 Lg, e_max = +0.0681 Lg (symmetric, as the lane reports); -e_min (t/2 pi)^(1/4) = 0.90, inside the cell range 0.73 to 2.74 of E2 and below the lane's stated "1.3 to 2.1".
- ZQ on the two zeros nearest the centre: pair form smallest eigenvalue / (-mu) = 0.99991 to 0.99993 at eta = 0.25, 0.05, 0.01, 0.003. lambda_min(E_ZQ)/Lg = -1.283, -0.0677, -0.0659, -0.0659, and lambda_min(E_ZQ) - lambda_min(E_zeta) - lambda_min(pair) = +0.042, +0.038, +0.0033, +0.0019 (the lane: at least +0.0012 in all cells). lambda_max(E_ZQ)/Lg = 1.87 to 3.09 (the lane: 1.6 to 2.05 at small eta). Consistent.
- Controls: sign changes of 2 Re[e^(i vartheta) sum eps(n) n^(-1/2 - ix)] for Liouville and three random completely multiplicative sign chains: 82, 77, 72, 73 percent of the smooth count (the lane: 66 to 75 percent; Liouville here is above that range in this one window at lower height).
Re-aggregation of the lane's records (text processing): 13104 records; 216 zeta cells; s_D certified positive in all; cells meeting 0.05: 10 / 72 / 72; C0 variant max 5.01e-4; ZQ eta = 0.01 holds in 10 / 72 / 72 and its data form is positive in 72 / 69 / 66 (207 of 216); ZQ eta = 0.25 fails in 216 of 216; pair_min/(-mu) in 0.976 to 1.00000. All match the result apart from E2 and E3.

## Controls where a zeta-only mechanism is claimed

None is claimed. The result states that no failure reads multiplicativity and that ZQ is not excluded. This referee confirms the direction: the one-sided statistic separates zeta from ZQ only by the pair form, at any height and tolerance, down to the resolution in E3.

## Requirement flags (strict)

- R1 false: Lemma P uses positivity and linearity only; the completely multiplicative chains fail through the missing functional equation, not through a multiplicative step.
- R2 false: 8 windows at three heights, finite mode counts; E3 (a) shows the control verdict itself is height-dependent.
- R3 false: ZQ is not excluded at u eta below the tolerance threshold; five listed controls were not run.
- R4 false: the conclusion available is a band statement with tolerance for u < Lg; zeta's positivity is read off verified zeros.

## Surviving claim

No statement about zeros of zeta. On m = 96, 192, 384 Fourier modes centred at t_w (not on every band): Q_D = T_sigma + E with T_sigma >= -3e-11 Lg (and enclosed >= 0 per cell), so the sub-device N(theta) holds there with tolerance -lambda_min(E). MEASURED, prime side, relative to the hand-derived radius, 1e6 / 1e9 / 1e12, 8 windows: zeta's defect is 0.036 to 0.137, 0.008 to 0.020, 0.0016 to 0.0052 Lg (medians 1.3 to 2.1 times (t/2 pi)^(-1/4); cells 0.7 to 3.3 times); at most 5e-4 Lg with C0. The one-sided statistic changes under a ZQ exchange only by the pair form, of size at most u (sinh(u eta)/(u eta) - 1) (PROVED, c17, re-derived), so at tolerance tau Lg it cannot exclude an off-line pair with (u eta)^2 below about 6 tau Lg/u; at the registered tolerance 0.05 this includes eta = 0.01 at 1e9 and 1e12 (not at heights above about 1e31, and not at the C0 tolerance). Exchange threshold eta* > 0 in 432 of 432 cells (422 certified). Chains, Liouville, DH (1e6, 1e9), E_a, T-NR, HQ2 fail by missing functional equation, zero or pole location, or size; no step reads multiplicativity. Device closed (outcome (b)); the two-sided version is the target in the window (ARGUED).
