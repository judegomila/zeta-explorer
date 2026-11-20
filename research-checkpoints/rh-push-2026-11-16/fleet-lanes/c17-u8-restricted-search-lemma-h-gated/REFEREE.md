HOLDS (verdict "dead" / registered outcome "none" confirmed; six corrections of wording and scope, none changes the outcome)

# REFEREE: c17-u8-restricted-search-lemma-h-gated

Adversarial referee, lens: general. 2026-11-19 (PST). Refereed file: `RESULT.md` of this directory.
Nothing here is a statement about zeros of zeta. Labels: PROVED (re-derived here) / MEASURED (ball or float64) .
All referee runs were local, through `scripts/memcap.sh 8`, with the lane's code read from this directory
(no bytecode written, no lane file modified) and with one script that uses no lane code (mpmath only).
Referee scratch (scripts, logs, JSON): `/tmp/ref-c17u8/` (outside the repo; not part of the record).
No server unit was started.

## 0. Verdict

- The claimed outcome stands: 0 hold-out survivors of the registered question on dictionary DU. The lane makes no
  claim about zeros, proves nothing new, assumes neither RH nor a verified height, and presents no known theorem as
  new. R1 = R2 = R3 = R4 = false, as claimed.
- The counts of RESULT sections 0, 4, 5, 6 were recomputed from the raw `out/*.json` files: all agree
  (section 2 below).
- The referee completed every registered stream that the lane left cut (section 4). On the completed streams:
  4,360,000 family-nodes, 1,923 at T-train (all T6 with polar terms), 0 hold-out survivors, 0 undecided.
  The weakest step 1 of RESULT ("36% / 54% of the registered streams") is therefore removed as far as the lane's
  own code is concerned.
- Corrections (section 6): the phrase "ball-certified" does not cover 79.5% of the family-nodes; "one two-class
  node" is a property of the prefix that was run (the unreached part contains four more, of the same kind); one
  table header is mislabelled; one sign statement in the preregistration is valid for k > 0 only; the run
  shortfall was not forced by cost; the search code was edited while search jobs were running.

## 1. Re-derivations (PROVED steps the lane relies on)

The lane has no PROVED step of its own. It relies on four elementary facts; each was re-derived.

1. **HEAT column from zeta's values (C4).** K3_tau(u) = exp(tau u^2/4) K3(u). A monomial M = prod K(u_i)^(e_i)
   becomes exp(tau S/4) M with S = sum e_i u_i^2. Hence F_tau = sum_j a_j exp(tau S_j/4) M_j(zeta). Correct.
2. **Heat exponents.** T3: K(u)^2 gives 2u^2; K(u-2h)K(u+2h) gives 2u^2 + 8h^2; K(u-h)K(u+h) gives 2u^2 + 2h^2.
   T6: (u -+ h/2) gives 2u^2 + h^2/2; (u -+ 5h/2) gives 2u^2 + 25h^2/2; (u -+ 3h/2) gives 2u^2 + 9h^2/2.
   Minors: sum_i (x_i + y_sigma(i))^2 = sum x^2 + sum y^2 + 2 sum x_i y_sigma(i); distinct for generic nodes.
   Correct: every member of DU has at least three distinct heat exponents, so it is outside the paper-decided
   part of Lemma H.
3. **Lemma H (H1, H2), as stated in `c17-referee-r16-lemma-h-sources/REFEREE2-lemma-H.md`.** With c = exp(tau S/4)
   and M <= lam: S = 0 gives c = 1; S > 0 gives c in (0, 1) and cM <= lam fails only when M <= lam < 0 and
   c < lam/M; S < 0 gives c > 1 and failure only when 0 < M <= lam and c > lam/M. This is (H1)/(H2) with
   tau* = 4 abs(log(lam/M))/abs(S). Correct. The gate file exists, first line "HOLDS", file time 16:49:04 PST;
   the earliest search output is 18:00:03 PST. The gate condition was met before the search.
4. **Planted separator.** For K = exp(-al u^2): K(x+y) = K(x)K(y)exp(-2 al x y), so
   det[K(x_i + y_j)] = prod K(x_i) prod K(y_j) det[exp(-2 al x_i y_j)]. With x increasing, the last determinant
   has sign (-1)^(m(m-1)/2) when y is increasing and + when y is decreasing. For the control -exp(+al u^2) the
   sign is (-1)^m when y is increasing and (-1)^m (-1)^(m(m-1)/2) when y is decreasing. In all four cases
   (m = 5, 6; y increasing or decreasing) the two signs are opposite. The planted control is valid. The
   preregistration (section 9.1) states the signs for k > 0 only (correction 4).
   T3 planted set: at u = 0 the ratio is exp(2 al h^2) on positives and exp(2 al h^2)/(1 + c h^2)^2 on controls;
   with c >= 2.5 al the second is below 1 for small h. Correct.

## 2. Recount from the raw outputs (text read of `out/*.json`)

| quantity in RESULT | recomputed |
|---|---|
| 1,966,200 family-nodes; 1,965,142 excluded; 1,058 T-train | 318,500 + 79,900 + 1,567,800 = 1,966,200; 1,058 records with status "ttrain", all in the three `T6_pol*` files |
| 0 hold-out survivors, 0 undecided | no record with a full-tier hold value 1; 96 "undecided" records (56 + 40, all srho = -1), all "excl" in `resolved.json` at 256 or 512 bits; no record carries an error field |
| K3 sign minors: 0 of 160,000 reject a training HEAT member | the counter `heat_rej` is absent from all four K3 sign-minor files (it is set before the characters are read, so it covers the 20,000 recount nodes as well) |
| 1,058 nodes: abs(u) <= 0.49, h in [0.78, 1.19], rho >= 10^(1/2), mu > 0 | abs(u) in [0.0011, 0.4834], h in [0.7758, 1.1912], srho in {3.16: 254, 10: 394, 100: 257, 1000: 153} |
| HEAT window 6.9e-11 to 1.0e-6, median 6.5e-8 | 6.91e-11, 1.016e-6, 6.51e-8 |
| best hold-out score 15, median 7; best two-class 17 | 15.0, 7.0, 17 |
| float64: 398 T-train, 1,172 undecided; balls: 1,058 / 512 | 79+140+179 = 398; 255+390+527 = 1,172; 226+360+472 = 1,058; 108+170+234 = 512 |
| 3,172 float64-undecided K3 node-mu; 658,398 with one-signed positives; 182,733 T-train without HEAT | 1,636 + 1,536; 329,448 + 328,950; 84,014 + 98,719 |
| thresholded K3: {T-NR, HEAT} T-train 508 and 580; Kpol lazy exits 11,612, of which 5 at E_a | 146+362; 82+498; 3,259+2,461+3,758+2,134; `why_lazy:TE` = 5 |
| planned counts and fractions | T3 K3 646,920 / 1,800,000 = 35.9%; T6 K3 35.7%; T6 Kpol 97,920 / 180,000 = 54.4% |
| pipeline controls (section 3) | `tests.json` and `tests_server.json` are identical except the run time; every row of the table matches |

## 3. Numerical checks with different cases (MEASURED, referee)

1. **Independent of the lane's code (mpmath, 120 digits, own series
   K3(u) = sum_n 2(4w^2 - 6w) e^(v/2) e^(-w), w = pi n^2 e^(2v), v = abs(u)).** The node of RESULT section 5:
   det/prod on zeta = -1.807268734245381049144201e-6 (RESULT: -1.80726873424538104914420072936e-6, 25 digits
   agree). HEAT, tau = -0.005: relative shift 8.8318e-5 (RESULT: largest 8.83e-5). Slope of the shift at
   tau = -1e-4: -0.017918 (RESULT: -0.017923 at 1e-6). T-NR with p0 = 13, c = 2.5: +2.97e-52; p0 = 11, c = 2.9:
   +3.70e-36; p0 = 7: +3.3e-12; p0 = 2: +0.49 (RESULT: smallest 2.03e-52 and 4.0e-36, other c). The kernel, the
   determinant, the HEAT column and the T-NR scale of section 5 are confirmed without the lane's code.
2. **Float64 screen against balls on fresh nodes (referee seed 4242, not a lane stream).** 60 (u, h) of T3 K3,
   60 of T6 K3, 30 of T3 Kpol, 18 mu each, four tiers each, every node-mu decided in balls with `lazy=False`:
   10,800 tier decisions, 0 disagreements (float-excluded and ball-excluded: 10,355; both T-train: 357;
   float-undecided resolved by balls: 88). 0 full-tier T-train, 0 hold-out reads passed.
3. **Minor families on the dev stream (seed offset 500; these nodes are not in the registered streams), all tiers
   evaluated.** TM6 K3 300 nodes, DM5 K3 300, TM5 Kpol 200: all excluded at the positives, 0 HEAT rejections.
   TMt6 K3 300 and TMt5 K3 300: 0 full-tier T-train; 18 and 18 nodes T-train for {T-NR, HEAT}, 0 hold out;
   0 in any tier containing E_a. Same pattern as RESULT.
4. **Targeted attack on the only family with T-train nodes.** 480 fresh (u, h) with abs(u) < 0.5,
   h in (0.75, 1.19) (referee seed 99117), T6 Kpol, with mu off the registered grid:
   rho in {2, 5, 20, 50, 300, 3000, 1e4, 1e6}, sign +. 3,840 node-mu: 1,651 T-train in balls (0 at rho = 2),
   0 hold-out survivors in any tier, best full-tier hold-out score 15.5 of 23 (median 6), best two-class score
   20.5; HEAT windows 7.7e-13 to 7.1e-7 relative. Sampling the T-train region 40 times more densely and with
   other mu does not produce a survivor.

## 4. Completion of the cut streams (MEASURED, referee run with the lane's `du.py` as it stands)

The unreached parts were not expensive: 12 minutes of wall time on 7 local processes.

| family, read | registered stream nodes run by the referee | node-mu | full tier T-train (balls) | hold-out survivors | undecided |
|---|---|---|---|---|---|
| T6, Kpol | (u, h) 5,440 to 9,999 | 82,080 | 865 (abs(u) <= 0.482, h in [0.776, 1.170], rho >= 10^(1/2), mu > 0) | 0; best score 15, median 7; best two-class 17 | 0 |
| T3, K3 | (u, h) 35,940 to 99,999 | 1,153,080 | 0 (2,985 float64-undecided, all excluded in balls, largest rung 1,024) | 0 | 0 |
| T6, K3 | (u, h) 35,720 to 99,999 | 1,157,040 | 0 (2,871 float64-undecided, all excluded in balls, largest rung 1,024) | 0 | 0 |
| DM6, Kpol | nodes 38,500 to 39,999 | 1,500 | 0 (all excluded at the positives) | 0 | 0 |
| TMt6, K3 | nodes 9,900 to 9,999 | 100 | 0 (6 nodes T-train for {T-NR, HEAT}, 0 hold out) | 0 | 0 |

Together with the lane's prefix: sign minors 320,000, thresholded minors 80,000, T3/T6 3,960,000 node-mu;
T-train 1,058 + 865 = 1,923; 0 hold-out survivors; 0 undecided. This is a referee run with the lane's code, not an
independent implementation; item 3.1 is the only part checked without that code.

**Two-class tier {T-NR, HEAT} in the completed part of T3/T6 K3: four nodes pass the hold-out read in balls.**

| family | stream id | u | h | rho | r_zeta | threshold window, relative to r_zeta | E_a (8 + 24) | held-out positives on zeta's side |
|---|---|---|---|---|---|---|---|---|
| T3 | 62914 | -0.04343 | 0.02519 | +10^(-1/2) | 1.33209 | (0, 1.58e-186) | all on the positives' side (-1.57e-4) | 46 of 48 |
| T3 | 83985 | 0.01809 | 0.02631 | +10^(-1/2) | 1.33343 | (0, 1.54e-195) | all on the positives' side (-1.64e-4) | 46 of 48 |
| T3 | 97946 | -0.03053 | 0.02552 | +10^(-1/2) | 1.33245 | (0, 2.99e-191) | all on the positives' side (-1.59e-4) | 46 of 48 |
| T6 | 65077 | 0.00078 | 0.06535 | +10^(-1/2) | 1.54621 | (0, 2.14e-161) | all on the positives' side (-1.45e-2) | 46 of 48 |

At each of them all 32 T-NR and all 32 HEAT members lie on one side of zeta (T-NR from 1e-195 to 1e-4 relative,
HEAT from 1.4e-9 to 6e-6), so a threshold placed between zeta's value and the nearest T-NR value passes. This is
the identification of RESULT section 5 (Lemma H, C1: threshold equal to zeta's own value up to 1e-161 or less).
None is a survivor of the registered question (E_a is not rejected at any threshold; no score). They show that the
effect of section 5 is not particular to the thresholded minors (correction 2).

## 5. Checks requested by the assignment

- **Assumes RH?** No. Kernels are theta-series and Bessel-series sums; no zero enters.
- **Restates verified height?** No. No height enters.
- **Known theorem presented as new?** No. No theorem is claimed; the result is a MEASURED finite search.
- **Zeta-only mechanism claimed?** No, so there is no mechanism to run the nine controls against. The lane's
  class set is the three canonical lifts only; Davenport-Heilbronn, sign twists, unimodular twists, Beurling, the
  phase-rotated transfer operator and theta^w do not enter and RESULT says so. The control behaviour that RESULT
  does report (HEAT excludes K3 sign minors and K3 T3/T6; T-NR excludes Kpol thresholded minors; E_a excludes K3
  thresholded minors) was reproduced on other nodes in items 3.2 to 3.4 and section 4.
- **Compute rules.** Server units listed as inactive by the lane (not re-checked by the referee: no ssh was made).
  One local lane ran 1,472 s against the 20-minute rule (`DMt6_pol.json`, sec = 1472); disclosed in RESULT.

## 6. Corrections

1. **"Ball-certified" does not describe most of the count.** Of the 1,567,800 T3/T6 node-mu of the lane, 4,742
   went to balls (1,636 + 1,536 + 1,570); 1,563,058 (79.5% of all family-nodes) are excluded by the float64 scan
   alone, whose error bands are estimates. RESULT section 0 words this correctly ("at every node that float64 left
   T-train or undecided") and section 9.2 discloses it; the one-line claim ("0 undecided (python-flint balls)")
   reads as if every exclusion were a ball statement. The float64 exclusions are supported by the lane's control
   (3,782 tier decisions) and by item 3.2 here (10,800 on fresh nodes), 0 disagreements in both.
2. **"One two-class node" holds for the prefix only.** Section 4 lists four more {T-NR, HEAT} hold-out passes in
   the registered T3/T6 K3 streams. Same reading, same status (no score). The map row of RESULT section 8 should
   say "five" if the completed streams are used, or keep "one" with the prefix counts.
3. **Table header.** For the K3 thresholded minors the column "decided by the HEAT column before other columns"
   contains the lazy-exit counts (2,268; 1,666; 3,605; 2,405). The exits at HEAT alone are 122, 115, 6, 6; the
   others exit after T-NR is added. Item 3 of the "Reading of the main table" states this correctly; the header
   does not.
4. **Preregistration section 9.1.** "sign (-1)^(m(m-1)/2) on the positives and (-1)^m on the controls" is the case
   k > 0. For k < 0 the signs are + and (-1)^m (-1)^(m(m-1)/2). They are opposite in both cases (re-derivation
   1.4), so the control is valid; the sentence is incomplete.
5. **The shortfall was not forced.** RESULT attributes the 36% / 54% coverage to saturated machines. The
   remaining node-mu cost 12 minutes on 7 local processes one hour later (section 4). The statement is accurate
   about the launch time; it should not be read as a cost limit of the dictionary.
6. **Code edited during the search window.** `du.py` has file time 18:25 PST; search outputs were written from
   18:00 to 19:04 PST. Jobs started before 18:25 formed the breakpoints at 128 bits, later ones at the working
   precision. RESULT section 2 discloses the difference and its direction; the referee confirms the direction
   (a ball quotient formed at lower precision is a valid, wider enclosure, so it can add "undecided" and cannot
   change a decided status). The output files do not record which version produced them.

Smaller remarks, no action needed. (a) Section 5: the interval (2.03e-52, 2.09e-52) also passes, with 23 of 24
held-out T-NR members (`node6_TH.json`, first segment). (b) Section 5: "tau*(F) = 5.7e-51" is the first-order
estimate margin/0.0179; the number 3.8e-39 is the floor of the bisection ladder, not a measured root. RESULT
words both correctly. (c) At rho = -1 zeta's first two terms cancel to the rounding of the float64 parameter
`Lr`, so zeta's value of these functionals is fixed by rounding; these node-mu (1 in 18) are legitimate members of
DU and carry no information. (d) The preregistered float-against-ball control (2,000 node-object values with a
1e-8 relative test) was replaced by a tier-decision comparison (amendments A3, A4); the replacement tests the
quantity that is used.

## 7. Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument; no step uses multiplicativity or the Euler product |
| R2 | false | finite node sets on the kernel side; no statement at any height |
| R3 | false | outcome "none"; only three control classes enter; six of the nine controls are not run |
| R4 | false | nothing is carried to the critical line |

## 8. What survives

MEASURED, finite, no statement about zeros: on dictionary DU (orders 5 and 6, four parameters, K3 on [-4, 4],
Kpol on [-3, 3], canonical lifts T-NR, E_a, HEAT with abs(tau) <= 0.005, thresholds scanned over the line) no
functional rejects the three classes and holds out. Lane prefix: 1,966,200 family-nodes, 1,058 T-train, 0
hold-out survivors. With the referee's completion of the registered streams: 4,360,000 family-nodes, 1,923
T-train (all T6 with polar terms, thresholds within 1e-6 relative of zeta's value, best hold-out score 15 of 23),
0 hold-out survivors, 0 undecided; five two-class {T-NR, HEAT} hold-out passes, all identifications with
thresholds within 2e-52 (one) or 2e-161 (four) relative of zeta's value and with E_a on the positives' side.
Exclusions of T3/T6 node-mu are float64 except 11,915 ball decisions (4,742 lane; 1,313 + 2,988 + 2,872 = 7,173
referee); the minors are ball decisions throughout. Not covered: as listed in RESULT section 8, minus the unreached stream
parts.
