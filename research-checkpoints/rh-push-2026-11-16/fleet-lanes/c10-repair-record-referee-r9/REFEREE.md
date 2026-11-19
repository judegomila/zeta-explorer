# REFEREE: c10-repair-record-referee-r9 (adversarial pass, lens: general)

2026-11-18 (local). Internal referee, one pass, not the author of the lane. Target: `RESULT.md`, `REFEREE2.md`,
`ref2_checks.*`, `ref2_l9_hp.*`, `map_edits.json`, `engine_counts.json` in this directory, and the files the lane
edited (`push/OBSTRUCTION_MAP.md`, `push/c9-obstruction-record-statement/STATEMENT_O.md`, `campaign/MAP_PENDING.md`,
`campaign/STRATEGY.md`, `campaign/lanes.jsonl`, `engine/outcomes/c9-*.json`, `engine/curated/mk_devices.py`,
`engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json`), read as text or JSON. Only this file was written. Referee
script outside the repo (`/tmp/c10ref/chk.py`), one local run through `scripts/memcap.sh 8` (mpmath, 35 and 60
digits, no array). The compute server was not contacted.

## Outcome

**holds = false as labelled, because one of the four PROVED labels (line 3) cannot be confirmed in the form
written (E1, E2). Everything else was confirmed.** The repair is two sentences in `STATEMENT_O.md` line 3 and in
`REFEREE2.md` section 3; after it the count is PROVED 4 in narrowed form, as the claim says. The bookkeeping part
(map, records, engine counts, strategy, untracked files) agrees with the files on disk.

No statement about zeros of zeta is made by the lane. No new theorem is claimed; the constructions are named
elementary or classical. Verified height is not restated. RH is not assumed in any step the lane labels PROVED,
with the exception described in E1 (membership of E_a in a class that contains a zero-free hypothesis).

Flags set by this referee: R1 = R2 = R3 = R4 = false (same as claimed).

## 1. PROVED steps re-derived

Closing step of a zero-mode line (statement A3, A4): (m) the control satisfies every input of the read class;
(z) the control has a zero right of the stated abscissa.

**Line 8 (frequencies only). Confirmed.** zeta(s)(1 - q^(b-s)) vanishes at s = b + 2 pi i k/log q (zeta finite
there); 1 - M 2^(-s) vanishes on Re s = log M/log 2. The class reads no coefficient, so both are members. No floor.

**Line 9 (special values). Confirmed.** chi_-4 odd: L(s, chi_-4) = 0 at s = -1, -3, ...; chi_5 real even:
L(s, chi_5) = 0 at s = 0, -2, .... The product vanishes at every non-positive integer, so C_c(1 - k) = zeta(1 - k)
for k >= 1 and every c; c = -zeta(s0)/(L4 L5)(s0) gives C_c(s0) = 0 wherever the product is non-zero. The numerical
"abs(C_c(s0)) = 0" in `ref2_checks` is true by construction and tests nothing; the content is the parity argument.

**Line 6 (local test vector), narrowed form. Confirmed.** q^(1/2 - s)(2 cosh((s - 1/2) log q) + c)
= 1 + c sqrt(q) q^(-s) + q q^(-2s) (checked by hand and numerically). So xi(s) D(s) is the completed function of
zeta(s)(1 + c sqrt(q) q^(-s) + q q^(-2s)) with conductor q^2: multiplicative coefficients (Euler factor changed at
q only), zeta's gamma factor, pole at 1 with residue 1 + c/sqrt(q) + 1/q (non-zero unless
c = -(sqrt(q) + 1/sqrt(q)); 0.186 for q = 11, c = -3). Zeros: cosh x = abs(c)/2, heights (2k+1) pi/log q for
c > 2 and 2 k pi/log q for c < -2. KER is correctly excluded from the proved form.

**Line 3 (E_a). Confirmed only for the inputs {EP, POS, FE}; not confirmed for the read class as written.**
See E1, E2.

## 2. Numerical checks re-run with different cases (float multiprecision, not certificates)

| line | case of this referee | value |
|---|---|---|
| 3 | a = 0.29, gamma_7: s = 0.79 + 40.918719012i | abs E_a = 5.5e-36; FE defect of xi(s+a) xi(s-a) at 0.42 + 9.3i: 3.4e-36 |
| 6 | q = 13, c = 2.5, k = 4: 0.770238154 + 11.023349759i; q = 5, c = -6, k = 1: 1.595256400 + 3.903962532i | abs D = 2.1e-35, 6.2e-36; identity defect at 0.37 + 4.4i: 6.3e-36; sum of coefficients n^-6 (q = 3, c = 2.2, n <= 3000) against zeta(6) P(3^-6): 1.8e-18 (truncation) |
| 8 | zeta(s)(1 - 3^(b-s)), b = 0.57, k = 7; 1 - 0.3 * 2^(-s) (zero line Re s = -1.737) | 5.0e-37; 4.5e-37 |
| 9 | product L4 L5 at s = 0, -1, ..., -5 (60 digits) | 0 or below 1e-60; L4, L5 checked against direct series at s = 4, 6; s0 = 0.62 + 17.9i: c = -5.513574204 + 3.373088633i, root found again from a displaced start |

All agree with the lane's statements. The line-7 check in `ref2_checks.py` ("abs(count - target) < 1 for p > 1000")
holds for any greedy rule with density below 1 and is not a test of the error term; `REFEREE2.md` says so.

## 3. Errors and corrections

**E1 (line 3, label PROVED; membership not established for one input of the read class).** The read class of
line 3 is R = {EP, POS, FE, explicit formula, ZF(theta) as hypothesis, growth in vertical strips}. `REFEREE2.md`
section 3 checks (m) for EP, POS, FE and the failure of SIZE, and takes "explicit formula and growth" as
inherited. It does not check the input ZF(theta). For E_a that input is the statement "zeta has no zero with
Re s > theta - a", so:
- with theta = 1/2 + a (the case needed for "the bootstrap map is f(theta) = theta" and for the floor
  "nothing below 1/2 + a" when the device's hypothesis is at that level) membership of E_a is RH;
- unconditionally, with Theta = sup of real parts of zeros of zeta, E_a satisfies ZF(theta) exactly for
  theta >= Theta + a, and the floor that follows for a device with hypothesis ZF(theta) is
  max(Theta, 1/2 + theta - Theta), which is theta only if Theta = 1/2.
So the label field of line 3 ("PROVED under the label rule ... the sentence 'every inequality built from these
inputs holds for E_a' is then a consequence of A3") is not covered for R as written. The same wording issue was
raised by the referee of `c9-szego-sum-rule-prime-cascade` (E7: "the line of its zeros"). Correction: narrow the
proved form to the inputs {EP, POS, FE (degree 2, gamma factor Gamma((s+a)/2) Gamma((s-a)/2)), finite order},
as was done for KER in line 6, and state the ZF(theta) part as: "for theta >= Theta + a; equal to the stated floor
if all zeros of zeta lie on the line; ARGUED, relative to `bootstrap` (no referee)". "Growth: inherited from
zeta" should read "polynomial growth in strips (degree 2; exponents are twice those of zeta)"; a device that
reads zeta's own convexity exponent is outside the class. E_a has poles at 1 + a and 1 - a and abscissa of
convergence 1 + a; this is consistent with "without SIZE" (A1 puts "pole at 1 only" inside SIZE) but should be said.

**E2 (line 3, a false sentence in the proved step).** `REFEREE2.md` section 3: "Lambda_{E_a}(n) = Lambda(n)(n^a +
n^-a) >= 0, and it exceeds log n at every prime power"; RESULT table: "> log n". False at higher prime powers:
Lambda_{E_a}(p^k) = log p (p^(ka) + p^(-ka)) and log(p^k) = k log p; for a = 0.11 the inequality fails at 2^k for
all 3 <= k <= 11 and at 3^k for k >= 3 (checked); for a = 0.45 at 2^3, 2^4, 2^5. Correct statement: it exceeds
log n at every prime and every prime square (2 cosh > 2). The conclusion (SIZE fails for E_a) is unaffected.

**E3 (independence of the second file).** The label rule of Statement O asks for two referee files on the closing
step. The second file was written by the same lane that then rewrote the label fields and the counts in
`STATEMENT_O.md` and entered "PROVED 4" in map row O1. The lane is neither the author of the statement nor the
first referee, and it says both passes are internal; still, the pass that upgraded the labels did not have a
reader between it and the map. E1 is an instance of what that reader would have caught. Row O1 and the count line
of `STATEMENT_O.md` should carry "line 3 in the form {EP, POS, FE}" until E1 is applied.

**E4 (records: "verdicts agree in all eight").** Seven agree without remark. For `c9-mv6-window-statement` the
referee's E1 is a correction of the verdict label itself ("precise obstruction" rests on a definitional identity,
a float measurement and an argued description; it holds "for the negative verdict with corrected labels"). The
record keeps `verdict: precise-obstruction` with a `correction` field. That is a defensible choice, but "agree"
overstates it; say "verdict kept, label narrowed by the referee (correction field)". `engineVerdict: closed` for
`c9-eh-dual-r5-target-excess` ("not detected") and `c9-szego-sum-rule-prime-cascade` (five named forms) is the
planner's and is disclosed in weak step 2.

**E5 (strategy 4.0).** The new paragraph says "The item list below is empty" and "the attack slots leave ORDER-2"
while the pre-registered run of lane `c10-ff-completed-rows-692` ("closes or keeps the last open device node of
ORDER-2", `ROUND_LOG.md` round-10 table) has not reported and the device `effective-order-two` is open in
`devices.json`. The paragraph lists that run as bounded item (b), so nothing is hidden; but the sentence
"No allocation or weight change" in RESULT 2.5 sits next to a sentence in STRATEGY that describes where the attack
slots go. It follows the planner's round-10 text (`ROUND_LOG.md` lessons 1, 2), so it is a restatement, not a new
decision; word it as "per the round-10 planner step".

**E6 (small).** RESULT 2.3 says "ten section-7 rows"; `map_edits.json` and the map header say twelve (ten plus
the two of MAP_PENDING E2). Consistent once read together; give one number. The file is dated 2026-11-19 while the
file times are 2026-11-18 22:27 local (UTC date presumably).

## 4. Bookkeeping checked against the disk

- Map: 515 -> 551 lines; row ids counted with an own regex: 166 before, 180 after, no duplicate id;
  P 51, G 31, Q 27, S 12, Z 35, F 8, T 3, L 5, D 7, O 1. New ids: Q23 to Q27, G31, Z24b, Z27 to Z32, O1 (14).
  Row O1 is worded as separate conditional statements with the joint sentence withdrawn. Rows Q26, Q27, Z30, Z31,
  Z32 were read against the round-8 and round-9 referee files quoted in them: "not detected", "five named forms",
  "one direction", "0.72"-type corrections are carried.
- `MAP_PENDING.md`: status section "fourth" present; the table matches `map_edits.json`.
- `STATEMENT_O.md`: joint clause withdrawn in section C with the reason; A1 codes changed (SIZE = abs(Lambda_F(n))
  <= log n, pole at 1 only); line 8 floor withdrawn; labels of lines 1 to 12 as in the RESULT table.
- Outcome records: 8 files, `refereeHolds` true, `referees` 1, `score` 0, `aboutZeros` false, all four
  requirement flags false; `correction` present in 7, absent in `c9-repair-referee-debts-r8`; other changed
  fields: `obstruction` (eh-dual), `lesson` (tro6). `lanes.jsonl`: 82 lines before and after; 7 lines changed
  (`correction`; `lesson` also changed on the tro6 line, which RESULT 2.4 mentions for the outcome file only).
- Devices: 31 closed / 1 floored / 2 open; diff of `mk_devices.py` touches evidence text of four entries, no state.
- Engine: `IDEA_GRAPH.json` 1,640 nodes, 8,855 edges, meta live 960; `CANDIDATES.json` generated 40,671, scored
  10,311. Matches.
- Untracked `b1_blocks.json` (1,175 bytes) and `checks.json` (3,366 bytes) are present and untracked.
- Server: not checked by this referee (no contact with the server). Local side confirmed: both server logs under
  `c9-tro6-interstratum-cancellation/logs/`, the digest log, and `tmp/sextic/data/sf_1e7.npz` are present.

## 5. Checks required by the task

- Zeta-only mechanism claimed: none, so no control run is owed. The controls of lines 3, 6, 8, 9 were run as
  functions with new cases (section 2).
- RH assumed: not in any stated step; implicitly in the membership of E_a in a class containing ZF(theta) (E1).
- Verified height restated: no. Known theorem presented as new: no.

## 6. Requirement flags

| flag | value | reason |
|---|---|---|
| R1 | false | no argument; bookkeeping and control constructions |
| R2 | false | no conclusion about zeros |
| R3 | false | no device; controls shown to lie in read classes |
| R4 | false | no step toward the critical line |

## 7. What survives

Record and bookkeeping only. Statement O has a second referee file for its 12 lines. Under its two-file rule:
PROVED lines 6, 8, 9 as labelled (line 6 without KER; line 8 as "no floor"), and line 3 only for the inputs
{EP, POS, FE}: E_a has an Euler product, non-negative Lambda, a functional equation, and zeros on Re s = 1/2 + a;
the part of line 3 that reads ZF(theta) as a hypothesis is ARGUED and, at theta = 1/2 + a, equivalent to RH for
the membership step. MEASURED 1 (line 2), ARGUED 7. Joint clause withdrawn. Map 166 -> 180 rows, records, device
evidence, engine counts and strategy edits as described, with E4 to E6 as wording corrections.
