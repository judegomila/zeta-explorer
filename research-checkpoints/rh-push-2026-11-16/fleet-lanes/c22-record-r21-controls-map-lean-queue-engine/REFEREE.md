# REFEREE.md: c22-record-r21-controls-map-lean-queue-engine

**Status of this file: author's check, not an independent referee.** This lane is a single agent without a tool for starting a separate referee process. Under STRATEGY section 1 this file counts as referees = 0, and an independent pass is owed. What follows is what the author checked a second time, by a route different from the one used when writing, the errors that check found, and the points an independent referee should attack first.

Nothing in the lane is a statement about zeros of zeta. The lane makes no attack. Flags: R1 = false, R2 = false, R3 = false, R4 = false.

## 1. Checks made (script `author_check.py` -> `author_check.json`, `logs/author_check.log`; `checks.py` -> `checks.json`)

| check | method | result |
|---|---|---|
| every path cited in `campaign/LEAN_QUEUE.md`, `CORRECTIONS.md`, Part 3 of `MAP_PENDING.md` and the four new control entries exists | regular expression over the files, `os.path.exists` | 50 cited, 0 missing (one false positive of the pattern: "engine/checks.py" read out of this lane's own path) |
| every "text as it stands" in `CORRECTIONS.md` and every replaced phrase in Part 3 of `MAP_PENDING.md` occurs in the file named | whitespace-normalised substring search | 15 of 15 found |
| quotations of referee files in `campaign/STATEMENT_O.md` version 5.2 occur in those files | assertions inside `build_statement_o_v5_2.py` (markup and line breaks removed) | 5 of 5 |
| Statement O structure after the edit | count of line headings; diff against the copy of version 5.1 | 17 line headings as before; 10 replaced passages; no other line differs (`statement_o_v5_1_v5_2.diff`) |
| referee counts written in LEAN_QUEUE | compared with `campaign/lanes.jsonl` for the source lane of each entry | 11 of 11 equal; refereeHolds true and aboutZeros false for each source lane |
| files changed since the lane started, outside this directory | modification times under `push/`, `campaign/`, `engine/` | in `campaign/` and `engine/`: exactly the 15 files listed in RESULT section 7; under `push/`: only directories of other running lanes (`c22-*`, `s6-*`), none written by this lane |
| the engine baseline | rerun before any edit compared with the `CANDIDATES.json` found on disk | 60 of 60 keys, same order |
| `CANDIDATES.json` after the `--node` run | plain `generate.py --top 60` rerun and compared with the copy in `after/` | 60 of 60 keys, same order |
| mathematical statements added by this lane to control entries and to the queue | exact and numerical checks, RESULT section 2.7 | all pass |

## 2. Errors found by this check and corrected

1. **Erratum E1 of Theorem W was paraphrased wrongly** in the first draft of Part 3 of `MAP_PENDING.md` (a formula with phases theta_k that is not in the referee file). The referee's text was then read in full; the corrected sentence is "d_(n,k) is the distance from n lambda_(k0) to the set {m lambda_k : m >= 1}, not to the lattice lambda_k Z". Fixed in `campaign/MAP_PENDING.md` and `MAP_PENDING_R22_SECTION.md` (script inline, asserted single occurrence).
2. **A run of `generate.py --node twin-screen-ts` overwrote `engine/CANDIDATES.json`** with a one-candidate list. Restored by a plain rerun; verified against the saved copy. Recorded in `engine/ENGINE_LOG.md` so that the next record lane does not repeat it.
3. **Convention of CYC.** The source lane's `MAP_ROW.md` says "the product is 1/(1 - w)" and its RESULT says "1/N_1 = 1 - w is entire". Both are right for different products (prod (1 + w^(2^k)) and the product of the local factors (1 + w^(2^k))^-1). The control entry, the map proposal and Q1 of the queue state both forms explicitly.
4. **The remainder of BR-2.** The round log words it as "sum 1/log q infinite". Theorem W is proved for sum (log q)^(-gamma) finite with gamma < 1, and its referee (point P2) notes that gamma = 1 was not attempted. The device text, the node and item 75 therefore say "sum (log q)^(-gamma) infinite for every gamma < 1". This is wider than the round log's wording, not narrower.

## 3. Second reading of the restatements in LEAN_QUEUE (same agent; by hand)

- Q1 (a): induction on K, (1 - w^(2^K))(1 + w^(2^K)) = 1 - w^(2^(K+1)). (c): poles of the factor k where q_k^(1/2 - s) = -1.
- Q2 (a): n = 1 gives a(1) = 1; for n < P the n-th equation is a(n) + c(n) + sum over proper divisors d, 1 < d < n, of a(d) c(n/d); under either hypothesis the middle sum reduces so that a(n) = 1 iff c(n) = 0 by induction. (b): every n in [2, P) has a prime-power component p^k < P exactly dividing it.
- Q3 (c): log((1 - x)/(1 + x)) = -2 sum over odd k of x^k/k with x = 6^-s. Extension to a base g that is not a prime power: (b) needs two coprime factors of g each not divisible by g; for g a prime power f is multiplicative, hence the restriction.
- Q4 (b): R(delta) <= prod over S of (1 - q^(-1/2))^(-1) times prod over any M elements of (delta log q_i).
- Q6 core: E(s) = N(s) for Re s >= 1/2, N(1 - s) for Re s <= 1/2; the two agree on the line because N(1 - (1/2 + it)) = N(1/2 - it) = N(1/2 + it); Morera, Liouville; the constant is the limit c. Rate in (i): Schwarz lemma on the disc of radius p^(-1/2) with n_p(0) = 1.
- Q8 (c): m of finite order gives N = 1/m of finite order; N has no pole off the line (analytic on the right, symmetric); if m has no zero on the line N is entire of finite order, which is admissible growth in every strip; (b) applies. (d): exchange of roles is legitimate because 1/n_p = (1 - y)/(1 - alpha_p y) is analytic in abs(y) < p^(-1/2) when abs(alpha_p) <= p^(1/2), and the summability transfers (second referee, step C-c).
- Q9: far zone at r = abs(x - t)/t = 1/2 needs 2 log t + 7.5 <= 4 log t, i.e. t >= e^3.75 = 42.5; the lane's t >= 43 is consistent.
- Line 10: abs(abs(1 + d)^2 - 1) = abs(2 Re d + abs(d)^2) <= 2s + s^2; 2s + s^2 <= 3s iff s <= 1. abs(log(1 + d)) <= -log(1 - s) for abs(d) <= s < 1; Cauchy on a disc of radius sigma' - sigma inside Re s >= sigma.

No error was found in these. They remain one agent's reading.

## 4. Points for an independent referee, in order

P1. `campaign/LEAN_QUEUE.md`, entries Q6 and Q8: are the restated hypotheses exactly those the proofs of the source lane use? In Q8 the queue assumes "m meromorphic on C with m(s) = m(1 - s) and m = 1/N on Re s > 1/2"; the lane assumes G meromorphic on C with zeta's functional equation and G = zeta/N. Check that nothing about zeta (its pole at 1, its trivial zeros) is needed beyond what the restatement keeps. In Q6 (i) the queue assumes n_p(0) = 1, which the lane uses without listing it under (H).
P2. Q9: the statement is for an unbounded multiplier; the domain sentence ("on its natural domain") should be made precise or the statement restricted to the pointwise inequality.
P3. Statement O line 15: does the independent pass in `push/c15-control-with-zeta-fe-classes-u1-u2/REFEREE.md` cover the closing step (functional equation, integer-frequency part, zero line), so that with the new file there are two? The version-5 header table recorded that a different second file (`REFEREE2_control-zq.md`) did not. If the c15 pass is judged not to cover it, line 15 returns to ARGUED and the count to PROVED 8, ARGUED 6.
P4. Statement O line 11: is "MEASURED for the cells of P8 and P1" a label of the rule, given one execution, one independent referee and HEAT cells not recomputed? The alternative is to keep ARGUED and carry the certified cells in the Label text only.
P5. Line 10, premise form (P-iii): the two constants are this lane's; check them or replace them by the source's words "with room".
P6. `engine/nodes/nodes-23.json`, node `twin-screen-ts`: status "proved" for a filter file. The alternative is a separate node for Lemma TS-1 (i) with type identity and status proved, leaving the screen without a role.
P7. Control THINxV6: entered on Lemma 1 (iii) of the source lane and the THIN row of the map; the product was never run. Its status is written "proved-relative"; a referee may prefer "argued".
P8. Section 3.1 item 74 is entered under "families closed by this rule" although BR-3 was decided by one lane with one referee, not obstructed twice; the item says so. Item 76 counts the rejection of the c1 flag (item 71) and of the c4 flag as two obstructions of the same kind.

## 5. Verdict of this check

The record edits agree with the round-21 referee files as far as this check reaches; four errors of the lane's own drafting were found and corrected (section 2). No claim is made beyond the sources. Independent referee: owed. referees = 0.

---

# Independent referee pass (lens: general), 2026-11-20

Separate agent from the lane. Own scripts, kept outside the lane directory (`/tmp/ref_c22_record_general/rc.py`, `rc2.py`; run under `scripts/memcap.sh 8` with `.venv-arb/bin/python`, mpmath 30 digits, exact rationals; under one minute; no server job, no unit started). The section above is the lane's own pass and is left unchanged. This pass wrote only this section.

**Verdict: holds as a record lane (partial-result), with corrections E1 to E6.** No attack is made and nothing in the lane is a statement about zeros of zeta, with one exception of wording (E1), where a "lacks" field asserts something that is equivalent to RH. Every mathematical statement the lane added (control entries, the 11 queue statements, the constants of line 10, the NR-q wording) was re-derived by hand and is confirmed. No step uses verified height. Known theorems (Q10 Hamburger, Q11) are marked classical in the queue and are not presented as new.

Flags set by this pass: **R1 = false, R2 = false, R3 = false, R4 = false.** There is no mechanism, so nothing for a control to fail; nothing is carried to the critical line.

## R.1 Statements re-derived by hand

| statement | result |
|---|---|
| V6: sum f(n) n^-s = zeta(s)(1 - 6^-s)/(1 + 6^-s) | confirmed: sum over k of (-1)^k 6^(-ks) zeta(s)(1 - 6^-s). Residue at 1 is (5/6)/(7/6) = 5/7. Zeros of the factor at 2 pi i k/log 6, poles at (2k + 1) pi i/log 6, all on Re s = 0 |
| V6: partial sums | S(x) = floor(x) + 2 sum over k >= 1 of (-1)^k floor(x/6^k), so abs(S(x) - 5x/7) <= 1 + 2 log x/log 6 |
| V6: log F - log zeta = -2 sum over odd k of 6^(-ks)/k; kappa - l_f = 2/k at 6^k, k odd, 0 elsewhere | confirmed (kappa(6^k) = 0 because 6^k is not a prime power). F F*/zeta^2 = exp(-2A) with A = sum a_n n^-s: consistent (F has real coefficients) |
| base g not a prime power | confirmed: g = ab with a, b > 1 coprime, neither divisible by g, so f(a) f(b) = 1, f(g) = -1; density (1 - 1/g)/(1 + 1/g) |
| THIN x V6: series equals F_THIN(s)(1 - 6^-s)/(1 + 6^-s) when 2, 3 are not in S | confirmed (eps_S(6^k m) = eps_S(m)); partial sums (5c/7) x + O(x^theta log x); the zero is the zero of THIN (map row THIN: F = zeta(s)(s - b) W(s)), relative to that row; not run |
| CYC: (1 - w) prod_{k<K} (1 + w^(2^k)) = 1 - w^(2^K); poles of factor k at 1/2 + (2n + 1) pi i/(2^k log Q); sum (2^k log Q)^(-gamma) finite for every gamma > 0; q_k^2 = q_(k+1) | confirmed |
| NWM: R(s) = R(1 - s); Laplace form; abs(R) <= 2/(kappa abs(sigma - 1/2) - pi/2); growth exp(e^(kappa t)/e) on the line | confirmed. Rotation t = -+ i r: g(z) = -i int e^(-ur) e^(i r log r + pi r/2) dr, g(-z) = i int e^(-ur) e^(-i r log r + pi r/2) dr, u = kappa(s - 1/2); the sum is 2 int sin(r log r) e^(pi r/2 - ur) dr; modulus of each rotated integrand e^(-(abs(Im z) - pi/2) r). Saddle of xt - t log t at t = e^(x-1) |
| Q2 (a), (b), (c) | confirmed. Forward: the n-th equation is a(n) c(1) = 1. Converse: sum over e dividing n of c(e) = 1 for n < P, induction. (b) by a prime-power component p^k < P. (c): log n = sum over d dividing n of L(d) for n < P |
| Q4 (a), (b), (c) | confirmed: all factors (1 - q^-delta) are in (0, 1); keep M of them and bound each by delta log q; denominators bounded by prod (1 - q^(-1/2))^-1 |
| Q5 | confirmed: majorant sum over k of (zeta(2) - 1)^k/k = -log(2 - zeta(2)) |
| Q6 core, (i), (ii), degree one | confirmed. Schwarz on the disc of radius p^(-1/2) gives abs(n_p(p^-s) - 1) <= delta_p p^(1/2 - sigma) <= delta_p 2^(1/2 - sigma); Cauchy abs(c_(p,k)) <= delta_p p^(k/2) gives absolute convergence at sigma = 2 (sum delta_p p^(-3/2)/(1 - p^(-3/2))); 1/(1 - 2^(-1/2)) = 3.41421 |
| Q7 | confirmed: f(t) = N(1/2 + it) is a uniform limit of trigonometric polynomials (disc-algebra factors, uniform convergence of the product); f(-t) has frequencies +log m >= 0, so the mean of (f(t) - f(-t)) n^(it) is c(n) n^(-1/2) for n >= 2 |
| Q8 (a) to (d) | confirmed. In (d): sup over abs y <= p^-sigma of abs(1/n_p - 1) <= abs(alpha_p - 1) p^-sigma/(1 - 2^(1/2 - sigma)), so the summability transfers; the four conclusions (zero and pole on the line, neither off it) follow from (a), (c) and their exchanged forms |
| Q9 | confirmed: near zone from abs(psi'(z)) <= 1/abs(z)^2 + pi/(2 abs(Im z)) (sum compared with the integral of 1/((a + x)^2 + b^2)) gives abs(G') <= 4/t^2 + pi/(2t) on (t/2, 3t/2); far zone from the logarithmic bound |
| Q11 | re-derived by a route that may differ from the lane's: with nu = r delta_0 + the even extension of N, the theta relation gives nu^ = nu (tempered); for phi supported in (-1/2, 1/2), int abs(phi^)^2 d nu = r norm(phi)^2 because phi * phi~ is supported in (-1, 1) where nu is r delta_0; phi = indicator of the interval (limit) gives int over abs x >= 1 of sinc^2 d nu = 0, so nu is carried by the integers; nu^ = nu is then 1-periodic, so all masses equal r |
| line 10 | abs(abs(1 + d)^2 - 1) <= 2s + s^2; 3s suffices iff s <= 1; abs(log(1 + d)) <= -log(1 - s); Cauchy on the open disc of radius sigma' - sigma, which lies in Re s > sigma. Item (3): 2 x 2.4 x (c/2 pi)^(-3/4) = 8.2e-9 at c = 3.1e12 and 4.3e-12 at c = 7.5e16, matching the source |
| line 15 | m(s) = q^(s - 1/2) + c + q^(1/2 - s) = m(1 - s); zeros where cosh((s - 1/2) log q) = -c/2; c > 2: 1/2 +- b + (2k + 1) pi i/log q; c < -2: 1/2 +- b + 2k pi i/log q, real zero 1/2 + b; b < 1/2 iff abs(c) < q^(1/2) + q^(-1/2); q^k = a_k + b_k sqrt 2 with b_k > 0, so the three cosets of frequencies are disjoint, the integer-frequency part is c zeta and each coset series is a constant times a shift of zeta |
| corrections register | E1 example: a(2^k) = (3^k - 2^k)/k > 0, confirmed. DH: l_f(6) = f(6) - f(2) f(3) = 1 + xi^2 = 1.0807009, confirmed. E_a: c(p) = 1 - p^a - p^-a, sigma_rel = 1 + a, confirmed. BR-2 set condition: confirmed |

## R.2 Numerical reruns on different cases (MEASURED, this referee)

| check | value |
|---|---|
| V10 and V15 (the lane ran base 6): convolution identity on n <= 100,000; max abs(S(n) - (g - 1) n/(g + 1)) | true, true; 4.909, 3.625 (ratio to log(n + 2) at most 0.68) |
| V6 partial sums to 279,936 | max deviation 5.714 (4.2857 on n <= 7776, the lane's value) |
| V6 log coefficients computed directly from f (not from the closed form), n <= 1300 | kappa - l_f non-zero only at n = 6 (value 2) and n = 216 (value 2/3) |
| CYC exact, K = 9, w = 3/7; local-factor product against 1 - w at Q = 7, s = 0.5003 + 11.3 i (abs w = 0.99942), 40 factors | true; 1.5e-32 |
| TS-1 (i) in the ring Z/97 (not characteristic 0), P = 50, n <= 600, both directions | true, true |
| Lemma S: max over 488 values of x (abs(x - t)/t from 1e-6 to 1e6, both sides, and x near 0) of abs(G(1/2 + ix) - G(1/2 + it)) t/(log t abs(x - t)) | 0.992 (t = 43), 0.951 (60), 0.764 (1000), 0.630 (1e6); the stated constant is 8 |
| NR-q: abs m at the stated zeros, c = 2.1, -2.1 and the new cases 2.15, -2.15 | below 2e-31; zeros 0.8573113164 + 3.564427956 i, 0.8573113164 (real), 0.9367247719 + 3.564427956 i, 0.9367247719 (real) |
| NWM, kappa = 4: root of 1 + R by the direct integral; the same point through the Laplace form (a different representation) | 0.947668672028 + 0.784675560647 i; abs(1 + R) = 1.9e-11 by the Laplace form at that point; abs(1 + R(1 - s)) = 2.4e-30 |
| NWM, kappa = 3 and 5 (the lane has kappa = 4): abs R against the bound at four points outside the strip | 0.0244 <= 3.78; 0.582 <= 8.73; 6.4e-4 <= 0.337; 0.0478 <= 4.66 |

Engine and record numbers read from the files: graph 1,764 -> 1,768 nodes and 9,265 -> 9,266 edges (logs); control-defeats edges 920 before and after; the four control nodes have role wall; `twin-screen-ts` has role rigid; `before/CANDIDATES.json` against `after/CANDIDATES.json`: 52 of 60 keys in common, ranks 1 and 2 unchanged; `after/CANDIDATES.json` equals the file now in `engine/` (60 of 60, same order); `campaign/STATEMENT_O.md` equals `STATEMENT_O_v5_2.md`; `push/OBSTRUCTION_MAP.md` was last modified before the lane started; the c4 and c20 lane files named in `CORRECTIONS.md` were not modified by this lane; referee counts of the 11 queue entries equal `campaign/lanes.jsonl`. The line count 9 / 1 / 2 / 5 sums to 17.

## R.3 Errors and required corrections

- **E1 (wording that asserts RH; three places).** RESULT section 2.1, table row V6: "it has no off-line zero in Re s > 0". `engine/curated/controls.json`, V6, field "lacks": "a zero off the critical line in the strip (it is not an off-line control)". `campaign/MAP_PENDING.md` Part 3, row V6: "a zero off the line (it is not an off-line control)". In Re s > 0 the zeros of V6 are exactly the zeros of zeta (the "has" field says so), so "V6 has no zero off the line" is equivalent to RH and is not established. Replace in all three by: "a zero in Re s > 0 other than the zeros of zeta (it is not an off-line control: it adds no zero)". `CORRECTIONS.md` item 3, E4, already has the right form ("no extra zero in Re s > 0").
- **E2 (Statement O line 15, the first file cited for the label).** The label names the independent pass of `push/c15-control-with-zeta-fe-classes-u1-u2/REFEREE.md` as the first file covering the closing step. That pass confirms Lemma A, Lemma D, the zero at c = 2.1 and a rerun at another base; it does not state the integer-frequency part c zeta, the Hecke relation on the cosets, or the zero lines, which are the clauses (a), (b) of the sentence labelled PROVED. Version 5 of the same record refused `REFEREE2_control-zq.md` as a covering file for exactly that reason. By that criterion clauses (a), (b) had one covering file (`nrq-line15/REFEREE2.md`) when the label was changed. This pass re-derived the full closing step (R.1, line 15; R.2, four values of c), so two files now cover it and the label can stand; the Label bullet must name this pass (or another full second file) instead of, or next to, the c15 pass. If the record does not count a campaign referee of a record lane, line 15 returns to ARGUED and the count to 8 / 1 / 2 / 6.
- **E3 (Q2 of LEAN_QUEUE, ring).** Part (c) uses log n and Lambda(n), so it needs the ring to be R, C or an algebra over R; the statement says "a commutative ring". Restrict (c) to R or C. Parts (a), (b) hold in any commutative ring (checked in Z/97).
- **E4 (Q8 (c), (d), "finite order" for a meromorphic function).** The statement needs a definition (Nevanlinna order, or: quotient of two entire functions of finite order), and the proof uses that 1/m then has finite order and, having no pole, is entire of finite order. That input is not in the list of proof inputs. Add both. The mathematics is confirmed.
- **E5 (Q9, domain and convention).** The author's point P2 stands: state the inequality for k_0 in H^1 with the multiplier applied to k^ pointwise (the product is in L^2 because G grows logarithmically and (x - t) k_0^(x - t) is in L^2), and fix the convention k^(x) = int k(u) e^(-ixu) du, which is what "k^(x) = k_0^(x - t)" assumes; the sentence "the sign convention does not affect the statement" is true for the sign, not for a 2 pi in the exponent. The pointwise inequality holds with a large margin (measured ratio below 1 against the constant 8).
- **E6 (stale headline in a file the lane edited; disclosed by the lane).** `campaign/STRATEGY.md` still prints "1 of 4" in sections 0, 0c and 4.0 (lines 20, 46, 68, 95) while item 76 and the scoreboard say 0 of 4. The lane lists this under "Not done". Until the strategy review rewrites those sections, a reader of the top of the file gets the wrong headline; a one-line pointer at line 20 to item 76 would remove the contradiction.

Points of judgement, not errors: line 11 "MEASURED, certified per cell" is within the label rule (the closing step is numerical) and the bullet carries the limits (one execution; HEAT cells not recomputed; cited symmetric form for HEAT argued, not computed); THIN x V6 as "proved-relative" is accurate because the series identity is elementary and the zero is relative to row THIN; status "proved" on the node `twin-screen-ts` is a generator setting and the lane says so (weakest step 3). The one new edge of the graph is of type composes-with, not a control edge, so the sentence "no existing row acquires an edge" is right for control edges.

## R.4 Checks asked of every referee

- RH assumed: no, except the wording of E1.
- Verified height restated as a result: no.
- Known theorem presented as new: no (Q10 and Q11 are marked classical; P0 carries the referee's note that it is an instance of a classical mechanism).
- Zeta-only mechanism claimed: none; no control run is owed. The control facts entered were rerun (R.2).
- Claims beyond the sources: none found apart from E1 and the citation in E2.

Referees for this lane after this pass: 1.
