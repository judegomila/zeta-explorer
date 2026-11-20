# c22-referee-r21-theorem-w-p0-p1-theorem1prime-ts-line11: RESULT

Date 2026-11-20. Round 22, referee lane A (kind: repair). Scope: this directory only; no lane file was edited.
Nothing committed or pushed. **No statement about zeros of zeta is made or refereed here: every item is a
statement about a relative Euler product, an identification theorem, a filter table, an identity on controls,
or a coefficient test.** Requirement flags R1 = R2 = R3 = R4 = false (a referee lane cannot score).

Labels: PROVED (rederived here) / MEASURED (Arb balls, or float64 where stated) / ARGUED.

## 0. Verdict

Six second readings, each written before the lane's first referee file was opened.

| # | Item | Verdict | Exact line of the correction | File |
|---|---|---|---|---|
| 1 | Theorem W (BR-2 sparse sets: natural boundary), step 4 in particular | **holds with corrections** | Step 3: "let d_(n,k) be the distance from n lambda_(k0) to the lattice lambda_k Z". With 0 in the lattice every n is k-bad for all large k (W_k -> infinity) and step 4 (c) is false as written; step 4 (b) already assumes m >= 1. Repair: distance to {m lambda_k : m >= 1}. Statement unchanged | `c21-br2-sparse-pole-lattice-natural-boundary-or-twin/REFEREE2.md` |
| 2 | Lemma P0 | **holds with corrections** (scope sentence) | Sections 1, 4, 6: "no infinite S gives a twin" needs the lemma's hypothesis sum over S of q^-delta finite; for S = all primes G = zeta(s - 1/2) is meromorphic | `c21-br2-relative-product-pole-lattice-census-server/REFEREE2.md` |
| 2 | Lemma P1 | **holds** | - | same |
| 3 | Lemma 1, Theorem H (Hamburger with finitely many poles) | **holds** | - | `c21-br0-br3-hamburger-finite-poles-regime3/REFEREE2.md` |
| 3 | Corollary H1 (a) | **holds with corrections** | "symmetric under s -> 1 - s": false at s = 1 (zeta has a pole at 1, none at 0); the conclusion does not use it | same |
| 3 | Theorem H' | **holds**; the sentence after it **with corrections** | "over the strip 0 <= sigma <= 1": H' gives it for -delta <= sigma <= 1 + delta, every delta > 0; the closed-strip form holds for abs(alpha_p) <= 1 by a subharmonic majorant (ARGUED), not for general coefficients | same |
| 3 | NWM as a control | **holds** | not identically zero (1 + R -> 1 as sigma -> infinity); one off-line zero now enclosed | same |
| 4 | TWIN_SCREEN.md: 22 rows sampled; Lemma TS-1 | **holds with corrections** (no verdict changes) | row 4 citation of G13, G17; row s5 quotation of line 70 not verbatim; row s8 example line 117; Klein row kind letter for G17; TS-1 proof: "the equivalence does not use ... the Euler product" is true for the first equivalence only; device count 56 is now 58 | `c21-twin-screen-ts/REFEREE2.md` |
| 5 | Line 11: symmetric form separates controls by evenness and reality only | **holds with corrections** | Verdict item 3 "formulable only for controls that are even and real"; section 5 "needs evenness and reality": sufficiency proved; exact condition is L(z) + L(-z) = L(z) - conj L(conj z) = i kappa, i.e. even and real up to a factor exp(i kappa z/2) | `c21-statement-o-line11-control-table-40-digits-server/REFEREE2.md` |
| 6 | V6 test (step (a) of the c4 lane) | **holds** | - | `c21-c4-r1-flag-test-lemma-e-hq-beurling/REFEREE2.md` |

**No PROVED claim breaks.** Every correction is a repair of wording, of one definition (item 1) or of the
scope of one sentence; no later lane depends on an uncorrected form (section 5).

## 1. Plan

For each item: rederive the proof from the RESULT.md text; fix the verdict; only then compare with the
lane's REFEREE.md; recheck the numbers that carry the claim with new code in Arb on the server through
rhrun. Decisive first test: step 4 of Theorem W (the only PROVED claim of round 21 with referees = 0 that
closes a branch of the lead BR), on log q_k = k^1.5 and on CYC.

## 2. Work

### 2.1 Theorem W

Rederived in full (steps 0 to 5). Order of choices: h, (gamma, A, b), Z, W_k, K_0(h), tail product, (B, R),
k_0, K_1, X. B is fixed before k_0; every o(X) is for fixed h, k_0, K_1. Step 4 (a): Weyl for finitely many k.
Step 4 (b): six-term count checked term by term; the last four terms are o(X) from N(Y) = o(Y^gamma).
Step 4 (c): at most X (1/4 + 1/8 + o(1)) bad n. One defect, E1 (table above). One remark, E2: for the set
"nearest prime to exp(k^1.5)" the ratios log q_(k0)/log q_k with k_0/k a rational square are within
e^(-lambda) of a rational, so the X from which Weyl's count holds is of order e^(lambda); the theorem is
asymptotic in X and stands.

Test on k^1.5 (hypothesis (W) with gamma = 0.8, A = 11, window cos^10). MEASURED, float64 scan with 10 values
recomputed in Arb (agreement 2e-10 relative): fraction of n <= 1000 with E_n <= h lambda_(k0)/4 at
K_0 = 8, 100, 600, 2500, 10^4, 4 * 10^4: 0.000, 0.012, 0.180, 0.411, 0.551, 0.652 (integer model) and
0.000, 0.010, 0.174, 0.442, 0.649, 0.660 (model with no rational ratios); with other k_0: 0.60 to 0.67 at
10^4, 0.79 at 4 * 10^4. Every bad n has a lattice point within 6 pi (0 exceptions in 5,800 n); the mean
number of such points agrees with sum 2 W/lambda_k (0.66 to 0.80 against 0.65 at K_0 = 10^4). Weyl step on
true primes (nearest prime to exp(k^1.5), k <= 36, n <= 2e6, tolerance 0.05): 0.09999 to 0.10000 for 21
generic pairs; 0.125, 0.109375, 0.125, 0.125 and 1.000 for the pairs (7,28), (9,16), (9,36), (36,16), (36,9)
(ratios 1/8, 27/64, 1/8, 27/8, 8 to within 4e-12): remark E2.

Test on CYC (lambda_k = 2^k log 3, theta = pi). Hypothesis (W) holds; steps 0 to 3 and 4 (b) apply; step 4 (a)
fails at the irrationality: lambda_(k0)/lambda_k is an integer for k < k_0 and every n is k-bad (measured
fraction 1.000 at six pairs; no good n among 400 for four (k_0, h)). Signed sum of (2) in Arb at six
(k_0, h, n): -12.765836814588 in every case, equal to the closed form -lambda_0 sum_m T^(omega - m lambda_0) to
1.7e-12 and to -2 pi T(0) = -12.76584, while the tested spike is 70 to 4500: the product side stays at the
bound B of step 1.

### 2.2 Lemmas P0, P1

Rederived; hold. Arb: the lane's seven values of y(2^-j, 0) on S1 are reproduced to all printed digits
(8.79702, 51.0295, 128.0560, 239.6787, 385.8940, 566.7020, 782.1026) with the set started at k = 0 (first
prime 3), a convention the RESULT.md does not state. Lemma P's inequality holds as a ball comparison in 50
cells on S0.

### 2.3 Theorem H, H', NWM

Each of the four steps rederived and checked on zeta in closed form (Q = (x^(-1/2) - 1)/2;
A - H = (coth(pi t) - 1)/(2t) = B). The continuation in step 4 is on C minus two parallel cuts, connected,
containing every t = i n. Section 3 needs one added line (Putnam applied to the progression of step K d).
NWM (kappa = 4), Arb: entire form and Laplace form of R(2 + 0.7i) agree to 5e-42 and with the lane's 17
digits; abs R on the line at t = 0.25, 0.5, 0.75, 1 is 7.384, 61.90, 1.0959e4, 5.9244e9; Rouche on
abs(s - s_0) = 1e-9 about s_0 = 0.9476686720276245 - 0.7846755606466836i (5.05e-11 < 3.80e-8) encloses one
zero of 1 + R; zeta = 0.49176 + 1.21106i on the disc. The lane's "Not ball-certified" is lifted for this
zero.

### 2.4 TWIN_SCREEN.md

22 rows compared with map rows P3, P9, P18, P21, P36, P40, P58, Q12, Q19, Q21, Q22, S12, S12b, Z15, F1, Q20,
G1, G6, G7, G11, G13, G17, G38, the device entries and screened lines 3, 5, 6, 9, 14, 22, 44, 70, 106, 117.
All verdicts agree with the cited rows. Lemma TS-1 (i) rederived; the HQ1, HQ2, T-NR entries of the twin
table checked by hand.

### 2.5 Line 11

Lemma R rederived. Q_sym - Q_gen = sum b_i conj(b_j)[A(z_i) - C(conj z_j)]/(z_i + conj z_j), A = L + L(-.),
C = L - conj L(conj .). Sufficiency as in the lane. Necessity: a meromorphic function equal to an
anti-meromorphic one is constant, so A = C = i kappa. Arb: Q_gen(zeta) = 5.111222983850..., twist cell
-4.746229229482... (lane: 5.111222984, -4.74623); gauge member exp(0.35 i z) xi: Q_sym - Q_gen = 0 +- 2e-74 at
order 2 while L(z) + L(-z) = 0.7 i.

### 2.6 V6

By hand and in Arb (n <= 3000): V6 has no negative a_n and f = (-1)^(v_6); first negative coefficients
a_2 = -1.41421 and -7.07107 (HQ1), a_49 = -1.4 (HQ2), a_5 = -0.539849 (HQ3), a_5 = -9.540943 (HQ4),
a_2 = -1.019249 (E_a). All equal to the lane's values.

## 3. Controls

A referee lane tests no attack. Controls enter as test objects of the refereed claims:

| Control | Where | Outcome of the recheck |
|---|---|---|
| CYC (Beurling-type, dependent norms) | Theorem W | fails the proof at step 4 (a), irrationality; signed sum bounded; confirmed |
| NWM (general frequencies, infinite order) | Theorem H' | valid control: not identically zero, off-line zero enclosed |
| HQ1 to HQ4 | Theorem H; V6 test | outside the finite-pole class (one line added); fail H(a) at the named prime power |
| E_a | V6 test | fails H(a) at every prime |
| V6 (non-multiplicative, unimodular) | V6 test | passes H(a) |
| unimodular twist | line 11 | symmetric form fails by -4.74623; general form holds |
| gauge member exp(i kappa z/2) xi | line 11 (new here) | symmetric form holds although F is neither even nor real |
| DH, backward heat, sign twist, T-NR, zeta(s+a)zeta(s-a), Beurling, theta^w, phase-rotated transfer operator | - | not re-run; the refereed lanes' tables for them were not rechecked except where listed |

## 4. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 | false | nothing here uses multiplicativity of zeta's coefficients; Theorem W uses pairwise irrationality of log q only (E3 of its file); the V6 recheck confirms that step (a) of the c4 lane does not need multiplicativity |
| R2 | false | no height-uniform statement about zeta is made |
| R3 | false | no attack; controls are test objects |
| R4 | false | Theorem W says the relative product does not reach the line in class (W); Theorem H assumes the continuation |

About zeros of zeta: no.

## 5. Dependence of later lanes

- Theorem W (with E1 repaired): `c22-br2-dense-remainder-integer-quantization`,
  `c22-br2-dense-census-cyc-nwm-server`, `c22-no-stage-objects-axis-support-weyl-independence-prefilter`,
  the BR-2 engine node. Statement unchanged; a lane that copies step 3 must copy the repaired definition.
  Referees for Theorem W: 1.
- P0: lanes on regime (K) use its hypothesis; the unqualified sentence is used nowhere.
- Theorem H, H': `c22-br3prime-integer-frequencies-no-growth-two-sided-almost-periodic`; quote the growth
  statement in the strip form -delta <= sigma <= 1 + delta unless abs(alpha_p) <= 1.
- TWIN_SCREEN.md: `c22-input-d-geometric-joins-prefilter-v6`,
  `c22-no-stage-objects-axis-support-weyl-independence-prefilter`; no verdict changes.
- Line 11: the qualifier owed in Statement O should be the condition on L (file of item 5).
- V6: control rows V6 and THIN x V6 of the record lane; V6 confirmed, THIN x V6 not recomputed.

## 6. Server use

Through rhrun only, after rhstatus (rh.slice at 10 to 15 GB). Units, all exited, none left running:
`rh-c22refm-1120145537` (1 core, 3 GB), `rh-c22refw-1120145537` (3 cores, 5 GB),
`rh-c22refs-1120145623` (1 core), `rh-c22refw2-1120145702` (1 core), `rh-c22refw3-1120151014` (4 cores, 6 GB,
started after the others had exited). While `rh-c22refw` (3 cores) was running, 1-core units ran beside it
(4 cores at most at a time, except for about a minute at the start when two 1-core units overlapped: 5 cores). No process was stopped by name. Code: `code/`;
outputs and logs: `out/`. python-flint 0.9.0, 160 to 300 bits. The scan of section 2.1 is float64 and is
labelled as a screen; it is not an input of any verdict.

## 7. Three weakest steps

1. Theorem W was rederived by one reader on paper. The numerical tests do not reach the proof's own
   constants (K_0 of order 1e9 by a rough estimate); they check the mechanism at K_0 <= 4 * 10^4 in a model
   of k^1.5 in float64, and the good fraction depends on k_0 at N = 1000 (0.66 against 0.79 at
   K_0 = 4 * 10^4). Step 1 (limit of the pole kernel) was rederived but not recomputed.
2. The closed-strip form of the growth statement after Theorem H' is ARGUED here for abs(alpha_p) <= 1
   (subharmonic majorant) and not written out; for general coefficients it is open. The NWM enclosure covers
   one of the three listed zeros; the bound for f'' uses monotonicity of int t^2 e^(xt) t^-t dt in x.
3. TWIN_SCREEN.md was sampled (22 of about 90 rows), and the statements R1-S, R2-S, R3-E, R3-C and parts (ii), (iv)
   of Lemma TS-1 were taken relative to their round-20 referee files. In line 11 the contour cells and the
   sign-twist cell were not recomputed; the order-2 twist cell was not reproduced because the lane's second
   rate is not printed.

## 8. Files

`RESULT.md`, `lanes.jsonl`, one `REFEREE2.md` in each of the six subdirectories named after the lanes,
`code/ref2_w.py`, `code/ref2_w2.py`, `code/ref2_w3.py`, `code/ref2_misc.py`, `code/ref2_s1.py`,
`out/w_all.json`, `out/w_arb.json`, `out/w2.json`, `out/w3.json`, `out/misc.json`, `out/s1.json`, unit logs.
