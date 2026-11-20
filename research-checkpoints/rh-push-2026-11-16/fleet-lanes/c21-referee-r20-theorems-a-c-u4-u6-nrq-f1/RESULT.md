# c21-referee-r20-theorems-a-c-u4-u6-nrq-f1: RESULT

Date 2026-11-20. Round 21, kind: repair (referee lane A of `campaign/STRATEGY.md` section 1). Scope: this directory
only; no other lane was edited. **No statement about zeros of zeta is made. No attack; no R4 answer; the headline
cannot rise from this lane.** Requirement flags R1 = R2 = R3 = R4 = false.

**First statement, as the assignment requires: Theorems A and C and Corollary A2 of
`c20-euler-shape-rigidity-infinite-modified-primes` hold. No failure was found. The footing of the lead BR stands.**

Labels: PROVED-2 (re-derived here in full; two derivations now exist) / CLASSICAL / CERTIFIED (Arb balls) /
CHECKED (mpmath 30 or 40 digits, not ball arithmetic) / MEASURED (float64) / ARGUED / OPEN.

## 0. Verdicts

| # | Item | Verdict | Corrections | File |
|---|---|---|---|---|
| 1 | Theorems A, C, Corollary A2 (euler-shape lane) | **holds** | 3 of wording: E_a has sigma_rel = 1 + a (not 1); "the product of the L_p converges in Re s > 1" holds for Re s >= sigma_0 only; Theorem B needs "N convergent somewhere" | `c20-euler-shape-rigidity-infinite-modified-primes/REFEREE2.md` |
| 2 | Lemma S, K3-M (U4 lane); rows DEL, THIN | **holds with corrections**; rows decided: THIN fails S3; DEL fails S3 for b = 0.55, 0.75; DEL at b = 0.9 not decided | 2 of wording (T-NR clause needs the vector class; a sup formula is an equality for h_0 >= 0 only) plus the two table rows | `c20-u4-second-order-archimedean-mixed-form/REFEREE2.md` |
| 3 | Lemma K; the five wording corrections (U6 lane) | **holds**; all five corrections accepted | 5 (those of the first referee) | `c20-u6ab-rank2-metaplectic-eigenobject-verdict/REFEREE2.md` |
| 4 | Theorem C (line-2 lane); one certified configuration recomputed | **holds**; four configurations recomputed with independent code, every sign and printed digit equal | 0 (one remark on wording) | `c20-statement-o-line2-dh-pick-kernel-certified-server/REFEREE2.md` |
| 5a | NR-q construction (Statement O line 15) | **holds with corrections** | 2 of wording (sign of c; generalised series, lowest frequency -log q) | `nrq-line15/REFEREE2.md` |
| 5b | Escape law F1 (line 4; Theorem A of `b-escape-law`) | **holds with corrections**: clause (i) as written; clause (ii) after a repair of the far zone of Lemma R | 1 (a proof step; repair written out) | `c20-statement-o-line4-heat-zero-enclosures-server/REFEREE2.md` |

Broken PROVED steps: 0 that change a statement. One PROVED step needed a repair (Lemma R, far zone, for the
sharp-reach clause only); the repaired statement is the one claimed.

## 1. Plan

Order as assigned. For each item: write the verdict from the lane's `RESULT.md` and sources before opening any
first-referee file; re-derive every PROVED step used by the named statements; run one independent numerical test
with objects checked not identically zero; relabel; name the three weakest steps. Decisive first test: the
reflection plus Liouville step and the uniform convergence of Theorem A on paper, then the 30-digit tests on the
controls. It passed, so no pivot was used.

What is new against the record: Lemma P (one-prime symmetric factors always violate (H) on both sides), the
Schwarz-lemma rate in Theorem A (i), the three corrections of item 1; the decision of the DEL and THIN rows of U4
with explicit windows; a third code for the DH Pick signs at a = 1 and a second for the Theorem C instance
Q = {2, 3, 4, 9}; the uniform far-zone bound for Lemma R; the sign-of-c note for NR-q.

## 2. Work

### 2.1 Theorems A, C, Corollary A2 (details in the REFEREE2 file)

- Uniform convergence on Re s >= 1/2: abs(n_p(p^-s) - 1) <= delta_p there; M-test. With the Schwarz lemma
  abs(n_p(p^-s) - 1) <= delta_p 2^(1/2 - sigma), which gives N -> 1 with a rate. PROVED-2.
- Reflection plus Liouville: E = N on the right, N(1 - s) on the left, continuous across the line by (FE), entire
  by Morera, bounded, equal to its limit 1. The passage from a meromorphic functional equation to (FE) uses the
  global bound on Re s > 1/2 on both sides of each point of the line. PROVED-2.
- N = 1 gives n_p = 1: Cauchy estimates, absolute convergence at sigma = 2 (constant 0.5470), uniqueness of
  Dirichlet coefficients. PROVED-2.
- A2: one-sided Bohr spectrum of f(t) = N(1/2 + it), coefficient c(n) n^(-1/2) at -log n by unique factorisation;
  f(-t) has no mass at -log n, n >= 2. PROVED-2.
- Theorem C: (a) by analyticity of N on the open half-plane and symmetry of m; (b) Phragmen-Lindelof on the strip
  of width 2 sigma_1 - 1 < 2d, where k < pi/(2d) is admissible; finite-order clause: N has no pole off the line,
  so without a zero of m on the line N is entire of finite order, which is admissible growth in every strip;
  (c) abs(m_p - 1) <= abs(alpha - 1) p^-sigma/(1 - 2^(1/2 - sigma)) when abs alpha <= p^(1/2). PROVED-2.
- Tests (30 digits; `thmA_ref2.json`): E_a: abs m = 0.738 at 1/2 + 5i, zeta's functional equation fails by 0.470,
  1.211, 2.271 at three points (its own holds to 1e-34), sum abs c(p) p^(-1/2) = 34.8 .. 3262 for p <= 1e3 .. 1e6.
  HQ1 (three eps), HQ2, HQ3, HQ4 at q = 2 and 5: functional equation to 6.4e-31, abs m in [0.40, 3.88], a root of
  numerator and of denominator in the closed unit disc in all 12 cases. Sparse DEL / THIN on two sets: defect
  1.018 / 2.233 (lane's set) and 0.396 / 0.811 (referee's set) against the A2 bounds 0.302 / 0.603 and
  0.122 / 0.244; Bohr means equal c(n) n^(-1/2) to 1e-5. Map DEL / THIN (b = 0.75): sum over S of p^(-1/2) = 4.4 .. 15.5
  (divergent), regime 3, outside the theorem.

### 2.2 U4: Lemma S, K3-M, and the two rows

- Lemma S: Plancherel reduction, near zone by the series of psi' (derivative below 2/t), far zone by the
  logarithmic size of G with the inequality at r = 1/2 holding from t = 42.6. PROVED-2. At 30 digits the ratio
  abs(G(x) - G_t) t/(log t abs(x - t)) is at most 0.993 on the samples (claimed bound 8).
- Proposition M, Proposition C, K3-M, P3: PROVED-2. K3-M coefficients CHECKED at q = 7.
- Rows DEL and THIN (zeta's Arch imposed), first test local, then the server at the scale that decides:
  2e7 heights t in [1e5, 2.1e6], P = floor(t^(3/4)), 6 sine modes, float64 screen; the lowest windows re-evaluated
  at 30 digits with the lane's error terms (Proposition M constants).

| family | heights below -err (of 2e7) | least form value (30 digits) at t | zeta on the same vector | error bound | row |
|---|---|---|---|---|---|
| zeta | 0 | +0.02578 at 1746644.65 | - | 0.006 | passes every scanned window |
| THIN b = 0.75 | 452856 (2.26 %) | -7.86902 at 1177978.95 | +2.68581 | 0.016 | fails S3 |
| DEL b = 0.55 | 25218 (0.126 %) | -2.86043 at 633099.15 | +2.08774 | 0.028 | fails S3 |
| DEL b = 0.75 | 6205 (0.031 %) | -1.92425 at 431553.15 | +3.32779 | 0.037 | fails S3 |
| DEL b = 0.9 | 0 | +0.11398 at 1371365.25 | +5.29035 | 0.019 | not decided |

  Why b = 0.9 is not decided: the DEL form is Lg - 2 Re A over the primes that remain; it fails where those primes
  alone exceed the reserve. No theorem bounds a prime subset by the reserve, and the more primes are deleted the
  smaller the sum (with all deleted the form is Lg). A failure at larger height is neither found nor excluded,
  and excluding it is an every-height statement that a scan cannot give.
  The failures are size events of a linear sum (Proposition C), not relations between primes; stage A is unchanged.

### 2.3 U6: Lemma K and the five corrections

Lemma K re-derived (quotient action; distinct eigencharacters are independent; the Eisenstein eigencharacter
determines {w, 1 - w}, written out with three primes). Lemma K' is one line. The five corrections were then read
and each checked: (1) Lemma 5 display, correct product Pi x conj Pi with shifts w_i + conj w_j, P - beta_0 >= 1 - 2 max theta;
(2) O3 "lowest rank with cuspidal datum"; (3) E_a row: M has poles at 1 - a and 1 + a in the open chamber, label
ARGUED; (4) T-NR, ZQ rows PROVED-rel D9; (5) Lemma 2 (O1, O3) and the O3 inner product PROVED-rel. All accepted.

### 2.4 Line 2: Theorem C and the recomputation

Theorem C re-derived (additivity, the tanh partial fractions, positive definiteness of M_E by the degree
argument, the B_c identity, f_DH > 0, compactness). Recomputation (`pick_ref2.py`, own code, 12000 bits, server):

| run | order | negative pivots | lane | d_149 here | lane |
|---|---|---|---|---|---|
| DH, a = 1 | 256 | 149, 150, 218, 219 | same | -6.233227522696339855141e-569 | -6.2332275226963398551e-569 |
| DH, a = 1/2 | 200 | 149, 150 | same | -7.597167730462748438955e-569 | -7.5971677304627484390e-569 |
| zeta, a = 1 | 256 | none (d_256 = 3.6525e-1167) | none (3.65e-1167) | positive | - |
| DH * B_2 B_3 B_4 B_9, a = 1 | 256 | none | none | positive (2.2216e-443) | - |

Every pivot ball excludes 0. CERTIFIED (third code at a = 1 for DH; second for the Theorem C instance).

### 2.5 NR-q (line 15)

All listed properties re-derived and checked at 30 digits (`nrq_ref2.json`): functional equation defect <= 1.2e-30
with abs G = 0.71 and 2.27 at the test points; q^k = a_k + b_k sqrt 2 with b_k > 0; zero
0.857311316383780998955 + 3.564427956382738223549 i at c = 2.1 (abs G = 7e-32, zeta = 0.632 there, winding 1.000000000000,
zeta's winding 0), 0.753177034801772 + 3.5644279563827 i at c = 2.05; strip condition abs c < 2.19736822693562;
local parameter 2.128913; Lemma D ratio 1.0463658. Corrections: for c < -2 the lowest zero is real; the object is
a generalised series with lowest frequency -log q.

### 2.6 Escape law F1 (line 4)

Re-derived: the Gaussian form (1.1), Lemma 1, the main-term algebra M_n = T# b_n n^(-s_eff), the error exponent
(kappa_0 - (2 sigma - 1))^2/(4 tau), the near zone, Lemma D (a) to (e), the Rouche step and the density count.
Gap: the far zone of Lemma R uses constants depending on kappa_0, which is unbounded on the range needed for the
sharp-reach clause (ii). Repair: abs g'' <= C_1/(1 + abs omega) on Re s >= 3/2 gives
abs R(w) <= 2 C_1 abs(w - z) log(2 + abs(w - z)), uniform, absorbed by the Gaussian. Clause (i) does not need it.
Test at three certified zeros (40 digits, `f1_ref2.json`): abs(F/T#) = 4e-13 to 9e-13 at the zeros;
abs D_tau(s_eff) = 3.1e-4 (tau = 1, x = 5e3), 1.3e-7 and 2.6e-7 (tau = 0.25, x = 1e6); at control points F/T# and
D_tau(s_eff) are 0.22 to 0.59 and differ by 2.8e-4, 1.5e-7, 2.6e-7.

## 3. Controls

This lane tests statements about controls; it has no device of its own. Per item, the control rows that were
run and what they show:

| item | control | result |
|---|---|---|
| 1 | E_a | fails both hypotheses of Theorem A (no zeta functional equation; (H) fails; sigma_rel = 1 + a). CHECKED |
| 1 | HQ1 to HQ4 | functional equation holds; (H) fails for N and for m (Lemma P, PROVED-2; roots MEASURED) |
| 1 | DEL, THIN, sparse | (H) holds, so the functional equation must fail; A2 bound met with room. CHECKED |
| 1 | DEL, THIN, map (b in (1/2, 1)) | (H) fails (regime 3); Theorem A silent. MEASURED |
| 1 | DH, Beurling as base | Theorem A is base-blind (Lemma A0): no R3. PROVED-2 |
| 2 | DEL, THIN with zeta's Arch | fail S3 at explicit windows (DEL at b = 0.9 not decided). CHECKED |
| 2 | zeta (control of the computation) | no window below 0 among 2e7. MEASURED |
| 2 | HQ1 to HQ4, T-NR beyond the stage | identical to zeta (K3-M). PROVED-2 |
| 4 | zeta at the same anchor | all pivots positive to 256. CERTIFIED |
| 4 | DH * four line-zero factors | all pivots positive to 256 while DH fails at 149. CERTIFIED |
| 5a | zeta on the same circles | winding 0. CHECKED |
| 5b | control points 0.3 to 0.4 from each zero | F/T# and D_tau(s_eff) of size 0.2 to 0.6. CHECKED |

Not run: backward heat, theta^w, phase-rotated transfer operator, unimodular twist on items 1 to 4 (not objects
of the refereed statements).

## 4. Requirement flags, with the evidence

- **R1 false.** Nothing here uses multiplicativity in an essential step. Theorem A holds for any Dirichlet series
  (Lemma A0); the U4 forms are linear in Lambda; Theorem C of line 2 shows a fixed Pick order is passed by a
  function without Euler product.
- **R2 false.** No conclusion of this lane is height-uniform about zeta. The DEL/THIN rows are existence of
  failing windows; "no failing window" for zeta or for DEL at b = 0.9 is a finite scan.
- **R3 false.** Referee lane; the refereed statements are identifications or control constructions.
- **R4 false.** Not addressed.

## 5. Three weakest steps of this lane

1. **The DEL/THIN decision is not ball arithmetic.** The failing windows were found in float64 and re-evaluated
   with mpmath at 30 digits; margins are 50 to 500 times the error bound, which itself uses the U4 lane's
   constants (Proposition M, re-derived here but with psi(x) < 1.04 x recalled). The vectors live in a 6-mode
   space and P is frozen per block of 2000 in the scan (exact P in the re-evaluation). DEL at b = 0.9 is left
   undecided; the percentages are measured on one range of heights.
2. **Recalled inputs were not opened by this pass either:** Bohr's inequality (Theorem B of item 1),
   Phragmen-Lindelof in the double-exponential form, Hermite-Genocchi, Jacquet-Shalika and Langlands' inner
   product formula (item 3), D9 Theorems B and C, Trefethen-Weideman (line 4 lane's Lemma Q). The tail lemmas of
   the line-4 certificate and Part 1 (kernel certificate) and the nested-node runs of line 2 were not recomputed.
3. **Lemma R after the repair still has untracked constants**, so clause (ii) of F1 and the density constant are
   not effective; the repair is one derivation (this pass). The independence of this referee from the first
   passes is by procedure (files not opened before the verdicts), and for U6 the five corrections were by
   construction read from the first referee.

## 6. Server use and files

Server (through `rhrun` only, after `rhstatus`; rh.slice at 14 to 25 GB): `rh-c21ref2-1120102305` (4 cores, 8 GB
limit, about 90 s), `rh-c21half-1120102637` (1 core, 4 GB, 46 s), `rh-c21u4scan-1120103045` (8 cores, 10 GB,
892 s). All three finished and are inactive; nothing was left running. GPU not used. Local runs through
`scripts/memcap.sh 8` (under 4 minutes in total).

Files: `RESULT.md`, `lanes.jsonl`, `lanes_records.jsonl` (7 records for the learn step: the five round-20 lanes,
`b-escape-law` for line 4, `c15-control-with-zeta-fe-classes-u1-u2` for line 15);
`c20-euler-shape-rigidity-infinite-modified-primes/` (`REFEREE2.md`, `thmA_ref2.py`, `.json`, `.log`);
`c20-u4-second-order-archimedean-mixed-form/` (`REFEREE2.md`, `u4_ref2.py`, `.json`, `.log`, `u4_scan.py`,
`scan_1e5_2.1e6.json`, `scan.log`, `u4_confirm.py`, `.json`, `.log`);
`c20-u6ab-rank2-metaplectic-eigenobject-verdict/REFEREE2.md`;
`c20-statement-o-line2-dh-pick-kernel-certified-server/` (`REFEREE2.md`, `pick_ref2.py`, `run_all.sh`, `run_half.sh`,
`out_*.json`, `log_*.txt`);
`c20-statement-o-line4-heat-zero-enclosures-server/` (`REFEREE2.md` for F1, `f1_ref2.py`, `.json`, `.log`);
`nrq-line15/` (`REFEREE2.md`, `nrq_ref2.py`, `.json`, `.log`).
