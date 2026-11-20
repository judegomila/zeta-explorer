# REFEREE (adversarial, lens: general) for c9-eh-dual-r5-target-excess

Date 2026-11-18. Only this file was written in the lane directory. Scratch scripts and outputs are in `/tmp/ref_c9`
(not in the repo). Local runs went through `scripts/memcap.sh 8` (copies of `dual5.py` and `dual_c8.py` were run from
`/tmp/ref_c9`; nothing was imported from inside the lane directory, no `__pycache__` was created there). One server
unit was started through `rhrun` (`rh-c9ref-ehdual-1119025813`, 8 GB, 4 cores, planned memory 4.67 GB printed, 39
minutes, ended by itself, verified inactive; `rhstatus` checked before launch: slice at 13 GB; work directory
`~/rh-push/c9-eh-dual-r5-target-excess-referee/`). Nothing was killed; no other unit was touched.

## Verdict

**holds = true for the measured claim, with wording corrections (section 4). All integers and all table entries
that I recomputed are confirmed. The pre-registered rule fails at every size, and it still fails on 16 new seeds
per control class at r = 5 and at a second block (k, N') = (5, 5). Three sentences are stronger than what is
established: "ABSENT" (should read "not detected at the stated resolution, r <= 5, q = 7"), "so the cancellation is
norm type" (the linearity of NP does not imply it; the statistics support it), and "Lemma A is settled in the
model" (it is a sketch for q -> infinity at fixed degrees; at q = 7 it is a measurement inside the range only).**

No statement about zeros of zeta is made. RH is not assumed anywhere. No verified-height input. No known theorem
is presented as new (Lemma D is declared to be Moebius inversion; Weil is cited as classical).

## 1. Re-derivation of the PROVED steps

| step | label in RESULT | referee outcome |
|---|---|---|
| Lemma D (D1) | PROVED | Confirmed. 1_{(c1, A') = 1} = Sum_{h | (c1, A')} mu(h); c1 = h c' gives chi_h(y) a_{k1 - deg h}(y); so I_W(y; g) = Sum_{A'} mu(A') W(gA') conj chi_{A'}(y) Sum_{h | A'} mu(h) chi_h(y) a_{k1 - deg h}(y). The condition (h, y) = 1 is automatic (chi_h(y) = 0 otherwise). The lane's written proof takes a detour (it splits A' = h A'' and re-inserts the factor) but ends at the same formula. |
| Lemma D (D2), (D3): NP linear in W, kernel independent of the target | PROVED | Confirmed by the algebra and exactly on the data: in all 15 blocks (r = 3, 4, 5, five geometries) every stored row value satisfies c_u(dh) = c_u(a) + c_u(b) in Z[zeta_6], and the same for Diag (dh = nu_a + nu_b in `dual_c8.py`). |
| E|NP(W)|^2 = ||K_NP||^2 for independent random signs | PROVED | Confirmed. Addition (not in the RESULT): the same identity holds for the rm class. For random completely multiplicative signs and squarefree A, B of equal degree, E[W(A) W(B)] = 1 if A = B and 0 otherwise, and the marked weights have the same covariance in both classes. So the rm and n classes have exactly the same second moment of NP in every geometry. This is used in section 3. |
| Lemma A (a): principal row of W = mu | PROVED-sketch + EXACT check | Confirmed for r <= 5. The sentence "g squarefree and e | g force g = e = 1" is incomplete as written: a prime p | g has exponent 2 + v_p(z1) (or 7 + v_p(z1) if p | e) in y, which is 0 mod 6 once v_p(z1) >= 4 (resp. 5); the degree bound deg z1 <= r - 2 gamma + deg e excludes this exactly when r <= 5. The count Sum_{A'} #{c1 of degree k coprime to A'} = q^(k - N') Sum phi(A') is correct for k >= N'. New exact check at a block the lane did not run, (k, N') = (5, 5), geometry (5, 0), r = 3 and 4: Sum phi over squarefree A of degree 5 = 211,411,872 (my own loop over the sieve), Princ(mu) = +1,268,471,232 = (q - 1) Sum phi, Diag(mu) = Princ(mu)/6. The sign is s_gamma at gamma = 0, which is +1 at (5, 5) and -1 at (6, 6); the RESULT's "s_0" is this quantity. |
| Lemma A (b): T1(mu) << (q - 1) q^(r + (k + N')/2) | PROVED-sketch | The exponent count is confirmed: the stratum gamma contributes q^(gamma - deg e) x q^(r - 2 gamma + deg e) values of z1 x q^gamma values of g x q^((k + N')/2 - gamma) = q^(r - gamma + (k + N')/2), largest at gamma = 0. The generating function Sum mu^2(A') conj chi_{A'}(y) t^deg = L(t, conj chi)/L(t^2, conj chi^2) and the pole locations are correct. The constants are binomial in the degrees (deg y up to about 17 here), so at q = 7 the inequality has no numerical content; the lane says so. See E3. |
| Lemma A (c): range r < (k + N')/2 | PROVED-sketch | Follows from (a), (b). Measured values at (6, 6) reproduced from `extra.txt`. New case (5, 5), where (k + N')/2 = 5: max over the geometries N >= 3 of T1(mu)/|Princ(mu)| = 4.5e-3 (r = 3), 4.2e-2 (r = 4), against q^(r - 5) = 2.0e-2, 1.4e-1. The value at equal distance from the edge of the range agrees with the lane's (4.2e-2 at r = 5 for (6, 6)). No block outside the range (r >= (k + N')/2) was run by the lane or by me. |

Structural fact not stated in the RESULT (checked by me on 10 frequencies with `ff.phase`): a_n(y) = 0 exactly for
n >= deg rad(y) when y is not a sixth power (complete character sum). Since a complete row range d >= N' means
r <= k - 1, in the stratum gamma = 0 one has k1 = k > r >= deg rad(y), so the h = 1 term of (D1) vanishes
identically and only the terms with deg h >= k - deg rad(y) + 1 contribute. The second bullet of section 2.1 ("row
u carries the twisted reciprocal 1/L(s, eta conj chi_u)") should say that at gamma = 0 the row carries only the
coefficients of degree N' - deg h <= N' - (k - r + 1) of that reciprocal, entering through the coprimality
correction. This does not change (D1) to (D3) or any number; it makes the bound in Lemma A (b) easier, and it
describes what the test at r <= 5 actually samples.

## 2. Recomputation from the stored data

My script (`/tmp/ref_c9/recheck.py`) recomputes U, NP, T1, S2 for all 39 weights from the stored row values in the
three jsonl files, not from the `stats` records.

- 15 of 15 blocks: 0 mismatches with the stored statistics for all weights. `red` and `n2` in `dual_c8.py` are the
  correct reduction and norm in Z[zeta_6]. `dual_c8.py` is byte-identical to round 8's `dual.py`.
- Decision table of section 0 / 4.1 reproduced to three decimals: theta_a = 0.263, 0.338, 0.455; theta_b = 0.391,
  0.417, 0.389; lnu 0.478, 0.377, 0.383; mu 0.069, 0.059, 0.082; E_a = -0.137, -0.079, +0.009; E_b = -0.009, +0.000,
  -0.057; S = 0.102, 0.076, 0.051.
- File times: `PREREG.md` was created at 17:50:22, after `precheck.log` (17:49:33 to 17:50:01) and before
  `run_r3.log` (17:50:45). Consistent with the stated order.

## 3. Independent numeric checks with different cases

**3.1 New seeds at r = 5 (server).** Same code path (`dual5.run_block`), (k, N') = (6, 6), d = 6, geometries (6,0),
(5,1), (4,2), (3,3), weights a, b, mu, lnu and new seeds rm:9..24, n:9..24. The values for a, b, mu, lnu (U, NP^2,
T1) are identical to the lane's in all four blocks (the run with a different worker split and weight set reproduces
them). Mean over the four geometries:

| seed set | theta rm: mean, sd, range | theta n: mean, sd, range | E_a | E_b | S | E > S |
|---|---|---|---|---|---|---|
| lane, seeds 1 to 8 | 0.447, 0.054, [0.395, 0.564] | 0.371, 0.046, [0.309, 0.478] | +0.009 | -0.057 | 0.054 | false |
| new, seeds 9 to 24 | 0.406, 0.043, [0.334, 0.508] | 0.442, 0.063, [0.340, 0.556] | +0.013 | -0.053 | 0.063 | false |
| pooled, 24 per class | 0.420, 0.051, [0.334, 0.564] | 0.419, 0.067, [0.309, 0.556] | +0.035 | -0.030 | 0.067 | false |

The rule fails out of sample for both targets. Mean over geometries of log|NP|: target a 14.98, b 15.97, lnu 16.06;
rm class 15.68 (sd 0.56), n class 15.94 (sd 0.68), 24 seeds each. Target a is 1.2 to 1.4 standard deviations below
both classes (rank 3 of 48 from the bottom; per geometry rank 18, 27, 3, 4 of 48); target b is at rank 29 of 48.

**3.2 The multiplicative against non-multiplicative difference at r = 5 is seed noise.** In the lane's own 8 + 8
seeds the two classes differ at r = 5: theta 0.447 against 0.371 (Welch t = +2.8), mean log|NP| 15.44 against 16.41
(t = -4.2), rms ratios 0.39, 0.26, 0.72, 0.27. On the 16 + 16 new seeds: theta 0.406 against 0.442 (t = -1.8, the
opposite sign), mean log|NP| 15.80 against 15.70 (t = +0.4), rms ratios 0.63, 0.91, 0.72, 0.65. Pooled: t = +0.06
(theta), -1.5 (log|NP|). By section 1 the expected squared ratio is exactly 1. The lane's reading ("no consistent
effect of multiplicativity") is confirmed, but see E4 for the sentence that contradicts its own table.

**3.3 Second block, (k, N') = (5, 5)** (local, single process, 16 seeds per class; r = 4 at d = 5 and r = 3 at
d = 6; geometries (5,0), (4,1), (3,2)). Exact |J|^2 against the m-side files of `c7-ff-order2-vertex-exact`: 35 of
35 identical.

| r | theta a | theta b | lnu | mu | rm mean, sd | n mean, sd | E_a | E_b | S | E > S |
|---|---|---|---|---|---|---|---|---|---|---|
| 3 | 0.351 | 0.360 | 0.359 | 0.056 | 0.312, 0.063 | 0.384, 0.092 | -0.033 | -0.024 | 0.092 | false |
| 4 | 0.352 | 0.471 | 0.535 | 0.065 | 0.395, 0.055 | 0.405, 0.076 | -0.053 | +0.066 | 0.076 | false |

The rule fails at both sizes. E_b at r = 4 is 0.87 S. Mean log|NP|, rm against n: t = +0.2 (r = 3), -0.9 (r = 4).

**3.4 Controls.** No zeta-only mechanism is claimed, so no control has to fail. I confirm the direction of the
claim on the controls that exist in the model: sign-twisted primes (rm, 24 seeds at r = 5) and non-multiplicative
weights (n, 24 seeds) are not separated from the targets by theta or by |NP|; the aligned vector W = mu is
separated (theta 0.06 to 0.08; 0.056 to 0.065 at (5, 5)). The model has no off-line weight with a functional
equation (dh satisfies the model Riemann hypothesis), and no analogue of backward heat, zeta(s+a) zeta(s-a), T-NR,
the phase-rotated transfer operator or theta^w; these are untested, as the RESULT states.

## 4. Errors and overstatements

**E1 (headline wording). "ABSENT" / "close (E-H) in the model".** What is established: at q = 7, (k, N') = (6, 6)
and (5, 5), r <= 5, no excess of the targets over the two control classes is detected at a resolution of 0.05 to
0.07 in theta (one seed standard deviation of a four-geometry mean; a factor 1.6 to 2 in |NP| at r = 5). The test
has no stated effect size for a true target mechanism, so its power against one is unknown. E_a rises
monotonically with r (-0.137, -0.079, +0.009; +0.035 against 24 pooled seeds) and target a is at rank 3 and 4 of 48
in two geometries at r = 5. This is not significant (two targets, four geometries; target b shows nothing), and the
lane reports it; but it is the reason the headline should read "not detected at r <= 5" and the map row should
keep the status MEASURED, as the proposed row text already does. The body (sections 6 and 8) is correctly hedged;
section 0 and the claim line are not.

**E2 (inference). "NP is a linear functional of the weight with target-independent kernel, so the cancellation is
norm type."** Linearity with a fixed kernel holds for any linear device and says nothing about where the target
sits relative to the kernel. The support for "norm type" is the measurement (targets at |NP|/||K_NP|| within the
range of random vectors), not Lemma D. Reword as: Lemma D makes the comparison with random vectors exact in second
moment; the measurement finds the targets inside the random range.

**E3 (Lemma A status).** "Settled in the model" is a sketch: the Weil-bound step for the coefficients with removed
Euler factors is not written out and the constants are binomial in the degrees, so the statement is for q -> infinity
at fixed degrees. At q = 7 the content is the measured table, which covers only r inside the range; no block with
r >= (k + N')/2 was run, so the range itself is not tested. The step "a low estimate blind to the phases has
B >= 1 in the format" is quoted from `c7-probe-format-h-cap` and was not re-derived by me. The number-field
sub-step (A-rows) is OPEN and stated as such; the first-moment bound it names is not proved here and not claimed.

**E4 (a sentence contradicted by the lane's own r = 5 table).** Section 0 item 2 and the R1 line of section 7 say
the random non-multiplicative weights have "the same theta and the same R" as the multiplicative ones. In the
lane's data at r = 5 they differ (theta t = +2.8; log|NP| t = -4.2; section 3.2). The sentence is true only after
the 16 additional seeds of section 3.1. The lane's seed standard deviations (0.046 to 0.051 at r = 5) also
understate the spread: 0.051 to 0.067 with 24 seeds, and the estimate of ||K_NP|| from 8 seeds moved by 9% to 49%
with the new 16 (the RESULT states about 25%).

**E5 (deviation from the pre-registration, no effect on the outcome).** PREREG lists the rm class as rm:1..8. The
analysis adds the round-8 weight `rm` to the class (9 seeds). With the 8 pre-registered seeds: rm mean and sd
0.316, 0.042 (r = 3), 0.380, 0.032 (r = 4), 0.447, 0.054 (r = 5) instead of 0.335, 0.067; 0.393, 0.048; 0.446,
0.051. E and the outcome are unchanged at every size (S is set by the n class at r = 3, 4; at r = 5 S becomes
0.054). The rma mean at r = 5 is 0.399 with the 8 seeded weights (0.387 with 9).

**E6 (omission).** At the excluded geometry (2, 4), r = 5, `extra.txt` shows R(a) = 0.01 and R(b) = 0.00 (rank 1
and 0 of 16): NP(a), NP(b), NP(mu) keep their r = 3 values while most other weights grow by a factor of 30 to 400.
The RESULT does not mention it. I checked that it is not target-specific: the random weights n:7 and n:8, which
coincide with b and a in this geometry at r = 3, 4, also keep their values at r = 5. The exclusion of N = 2 was
pre-registered and is justified, but the line should be reported.

**E7 (minor).** The validation covers totals only (14 of 14 here, 35 of 35 in my block); the assignment of terms
to rows, and with it T1 and U, rests on the definition, as the RESULT says. The structural vanishing of a_n(y) for
n >= deg rad(y) (section 1) is missing from Lemma D's consequences.

## 5. Surviving claim

In the F_q[T] model, q = 7, exact dual decomposition at (k, N') = (6, 6), r = 3, 4, 5 and (referee) (5, 5),
r = 3, 4: NP is a linear functional of the weight with a kernel that does not depend on the target (PROVED;
confirmed rowwise). The pre-registered excess E > S of the targets a, b over random multiplicative and random
non-multiplicative signs is not detected at any size, including against 24 seeds per class at r = 5 (resolution
0.05 to 0.07 in the exponent). Random multiplicative and random non-multiplicative signs have the same second
moment of NP exactly and are not separated in the pooled data. The aligned vector W = mu has
Princ = +-(q - 1) Sum phi exactly and non-principal rows below it at every tested size, all inside r < (k + N')/2
(sketch for q -> infinity; measured at q = 7). Status MEASURED and pre-asymptotic: an excess below about 0.05, or one
that sets in at r >= 6, is not excluded; target a leans low at r = 5 without significance. No statement about
zeros.

## 6. Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | Lemma D holds for arbitrary W; no step uses multiplicativity; multiplicative and non-multiplicative classes are not separated. |
| R2 | false | Finite model blocks; nothing about heights or windows. |
| R3 | false | No control fails; the result is that target and controls agree on NP. |
| R4 | false | Nothing reaches the critical line; model ledger unchanged. |

## 7. Files (scratch, outside the repo)

`/tmp/ref_c9/recheck.py` (recomputation from rows), `an5.py`, `k5_r3.jsonl`, `k5_r4.jsonl` (block (5, 5)),
`an_van.py` (vanishing of a_n), `srv/ref5.py`, `ref_r5.jsonl`, `an_srv.py` (new seeds at r = 5).
