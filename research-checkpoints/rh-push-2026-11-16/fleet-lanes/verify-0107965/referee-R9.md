# Referee report R9: exact flow and full replay (sec 4.3-4.8, 5; Prop 4.3, Prop 4.4, Cor 4.5)

Paper: hexagon:2611.00460v1 (Raymond). Date of this report: 2026-11-18. All statements below are about
what was executed or re-derived here; nothing else is claimed.

## Verdict

**verified-with-corrections** for the finite content of this part:

- Prop 4.3 (the 221,010-arc certificate) is confirmed by an independent exact replay of every arc (own code,
  different arithmetic library and different formulas from the packet's checker), and by the packet's own
  checker run on the pinned runtime.
- The arithmetic of Cor 4.5 (terminal pair, B* = T + q_T/2, decimal ceiling) and the startup inequality (102)
  are confirmed exactly.
- Lemma 4.1, Lemma 4.2, the Pade bound (95)-(96), the Newton identity (98) and the startup estimate (101) were
  re-derived; no error found.
- The packet's 15-stage replay passes on the pinned runtime (CPython 3.12, python-flint 0.8.0, Linux x86_64),
  and the bundled runtime is byte-identical to the official PyPI wheel.

The correction is cosmetic (one displayed digit, item C1). Prop 4.4 and Cor 4.5 as theorems about zeros
remain conditional on (89), i.e. on Thm 3.1, Thm 3.4 and section 2, which are other referees' parts
(R1-R8) and were not examined here. A PASS of the 15 stages does not establish those (see "Not checked").

## 1. Independent replay of all 221,010 arcs  [PROVED here, exact]

Script `scripts/r9/arc_full.py` (stdlib `fractions`, run with `python3 -I` under `scripts/memcap.sh 8`),
output `runs/r9/arc_full.json`, log `runs/r9/arc_full.log`. 130 s, exit 0.

Independence from `verification/arcs/verify_arcs_fresh.py`:

| Item | Packet checker | This replay |
|---|---|---|
| arithmetic | FLINT `fmpq` | Python `int`/`Fraction` |
| node own pair | (87) with denominator (h^2-q)^2 + v^2(2h^2+2q+v^2) | (h^2+v^2+q)^2 - 4h^2 q, from the factorisation ((h-y)^2+v^2)((h+y)^2+v^2) |
| jet own pair | Newton recurrence (98) | binomial closed form of (p-y)^-(m+1) + (p+y)^-(m+1) |
| e^-x upper bound | [6/6] Pade (96) | alternating Taylor sum ending on an even index (valid for 0 <= x <= 1; max x here is 1.11e-5) |
| source bound | intercept + slope form | (86) directly |

Checked for every arc, in exact rationals: input digests (plan ec346b7c..., source b59905d7..., flow a664e829...);
row sequence contiguous; exact join of (t, q) with the previous record; delta = 1/2048000 and
a_i <= t0 < t0+delta <= b_i; 0 < q0 <= c_i; s <= S_i(t0); o >= O_pair,i(q0) (all signed terms summed first);
r > 0 and 2(s-o) - r >= 1e-12; ell = q0 - (2 + r q0) delta > 0 and equal to the stored field; upper bound of
Q(delta) <= q1 < q0; q1 dyadic with denominator <= 2^96; row 55 tube 289/10000 <= Q <= 361/10000.
Row data: 67 rows, cells join and cover [0, 87/800], A_i >= B_i > 0, node poles h^2 > c_i, |v| <= 39/20,
jet centres p^2 > c_i, alpha >= 0, plan and source ledger agree on cells and caps.

Results (all assertions passed):

- terminal pair (T, q_T) = (22101/204800, 7902377963830536747158643/2^96); 0 < q_T <= 1e-4.
- T + q_T/2 = 427693072077942473661578098491/3961408125713216879677197516800 exactly;
  B* < 107964910079/10^12 < B* + 1e-12.
- arc counts per row = 20 x 5120, 46 x 2560, 850; every row 0..65 runs exactly to its cell end; T < b_66.
- startup: r0 as printed in the paper; 1e-12 - r0 q_init tau equals the fraction in (102) and exceeds 1/(2e12);
  0 < tau = 1e-14 < delta.
- sec 4.6 first record: s0, o0, 2(s0-o0)-r0, ell0, q1 equal the printed fractions.
- (104): min over arcs of c_i - q0 = 21059999/10^12, attained at arc 0.
- sec 4.5 table: entry and exit squares of rows 0, 1, 16, 44, 55, 65, 66 agree to the printed digits; node counts
  9, 9, 9, 25, 10, 10, 9 agree.

Margins observed (floats of exact values):

| quantity | min | max |
|---|---|---|
| S_i(t0) - s | 1.5e-30 | 4.5e-29 |
| o - O_pair(q0) | 1.4e-29 | 2.3e-28 |
| 2(s-o) - r - 1e-12 | 5.13e-30 (same for all arcs: r = 2(s-o) - ceil(2^95 e-12)/2^95) | same |
| q1 - (Taylor upper bound of Q(delta)) | 1.6e-35 (> 0: every reset is a strict upward jump) | 1.3e-29 |
| ell | 9.974e-5 (last arc) | 0.56250 |
| c_i - q0 | 2.106e-5 (arc 0) | 0.0221 |
| min pole (h^2 or p^2) - q0 | 1.48 | 8.27 |
| rate r | 12.3809852614710... | 22.6946264087302... |
| x = r delta | 6.05e-6 | 1.11e-5 |

The certificate carries no slack beyond the stated eta: the rate is set to the largest value the stored
bounds allow. This is by design and is not a defect.

## 2. Re-derivation of the analytic steps of sec 4.2-4.4, 4.8

Script `scripts/r9/identities.py`, log `runs/r9/identities.log`.

- **Lemma 4.1.** Q(u) = (q0 + 2/r) e^{-ru} - 2/r, and e^{-ru} >= 1 - ru with q0 + 2/r > 0 gives
  Q(u) >= q0 - (2 + r q0) u >= ell on [0, delta]. Correct; the bound is on the closed arc. Checked with mpmath at
  9 parameter pairs x 5 values of u (the only non-positive gap printed, -1.3e-82, is rounding at u = 0, where
  the gap is exactly 0). CLASSICAL.
- **Lemma 4.2.** Needs S_i nondecreasing in t (true since A_i >= B_i, checked for all rows, and
  S_i = M - N - A + theta (A - B)), and O_pair,i nondecreasing on (0, c_i] (Thm 3.4, R8). The directions are the
  right ones: contact height q = Q(u) <= q0 gives O(q) <= O(q0) <= o; contact time t0+u >= t0 gives
  S_i(t0+u) >= S_i(t0) >= s. Then (89) gives q' <= -2 - (r + eta) q < -2 - r q = Q'(u) at any q > 0. The
  contact height lies in [ell, q0], inside (0, c_i]; the closed cell is used at t0 + delta = b_i for rows 0..65
  (the source theorem is stated on closed cells). Correct given (89).
- **Resets and joins.** q1 > Q(delta) strictly on every arc, so the comparison jumps up at every join; a contact
  at the end of an arc is a contact on the closed previous arc, excluded by Lemma 4.2 with that arc's row. At
  a row join the next arc checks its own cap and cell. Correct.
- **(95)-(96).** The coefficients of P are those of the [6/6] Pade numerator of e^x (checked: 1, 1/2, 5/44, 1/66,
  1/792, 1/15840, 1/665280; integer Horner list 1, 42, 840, 10080, 75600, 332640, 665280). The power series of
  e^{-x}P(x) - P(-x) was computed exactly through x^39: it vanishes through x^12 and its coefficients from x^13
  on equal those of -(x^13/12!) Int_0^1 e^{-tx} t^6 (1-t)^6 dt (Beta-function expansion), term by term. So the
  identity and its sign hold for all x >= 0; P(x) > 0 for x >= 0. No range restriction is needed.
  mpmath values of P(-x)/P(x) - e^{-x} at x = 6e-6 ... 30 are positive. PROVED (series identity to order 39;
  the general identity is classical).
- **(98).** (1/m!) d^m/dp^m [1/(p-y) + 1/(p+y)] = (-1)^m (u^{m+1} + v^{m+1}), and the Newton recurrence for
  S_j = u^j + v^j. Checked exactly at 200 random rational (p, y) for m = 0..9 against the direct formula and the
  binomial form; finite-difference check of the derivative for m = 1, 2. Valid for p^2 > q. CLASSICAL.
- **(87).** 2 w h (h^2+v^2-q)/((h^2+v^2-q)^2 + 4 v^2 q) = w [ (h-y)/((h-y)^2+v^2) + (h+y)/((h+y)^2+v^2) ], checked
  exactly at 200 random rationals. So the stored function is the contribution of the conjugate pair at height
  +-y to the probe at offset v + ih. The denominator is positive for h > y.
- **(101)-(102).** Q(t) - (9/16 - 2t) >= q_init - (2 + r0 q_init) t - 9/16 + 2t = 1e-12 - r0 q_init t; direction
  correct; uses Lemma 4.1 on arc 0 and de Bruijn from t = 0. The comparison argument is only used from
  tau > 0, so non-simple zeros at t = 0 do not enter. Exact value confirmed.
- **Cor 4.5.** T + q_T/2 with de Bruijn applied to the whole strip at time T. Exact. T = 43/400 + 850/2048000.
  T < 19/125 and B* < 41/250 confirmed.

Classic failure modes looked for in this part, none found:
endpoint use of an open-range bound (cells and caps are closed and used closed; q0 never reaches a cap, minimum
clearance 2.1e-5; poles at distance >= 1.48 in q); a bound valid only for small or large argument (Pade bound
holds for all x >= 0; my Taylor bound is used only at x <= 1.11e-5); sign or direction errors in (92), (93),
(97), (101); the terminal step treating small q_T as zero (the full q_T/2 is paid); an unchecked row change
(each record re-checks cell and cap of its own row).

## 3. Interface bindings between the flow and the other certificates

- `verification/kernel/ACTUAL_67_ROW_PLAN.json` (the kernel stage's input) is byte-identical to the flow plan
  `M8_LATE_PLAN.json` (sha256 ec346b7c...). The kernel checker builds its own-pair function with the same
  formula as (87)-(88): `own_node` = 2h(h^2+v^2-q)/((h^2+v^2-q)^2+4v^2q), jet term b_m p^(m-1) (1/m!) d^m/dh^m
  [2h/(h^2-q)] at h = p with the outer factor 2 and alpha applied to the node part only (read in the source,
  lines 55-121). So the function whose monotonicity the kernel stage certifies is the function the arcs
  evaluate, on the same caps.
- The four fields consumed by the arcs come from `MAIN_CLOCK_SOURCE.json`. The `overlays` stage reconstructs
  them and requires equality with that file; `interfaces` requires equality of fields, nodes, jet overlay,
  cells and caps across final source, plan, the overlays table and the arc stage's row dump (read in full;
  7,085 checks in the run below). `direct-source` rebuilds all 268 fields (run below; its internal logic is
  R7's part and was not audited here).
- Process note: `interfaces` reads `arcs/ACTUAL_67_ROW_ARC_INPUTS.json`, which the arc stage writes before it
  checks any arc; it does not read the arc stage's result. The statement "the arcs passed" is therefore carried
  only by the exit code recorded by `run.py`. This is adequate for a full `--all` run and is not a
  mathematical issue.

## 4. Full 15-stage replay on the pinned runtime  [executed]

- Runtime identity: the 74 files of the bundled `runtime/` that also occur in the official wheel
  `python_flint-0.8.0-cp312-cp312-manylinux2014_x86_64.manylinux_2_17_x86_64.whl` (PyPI sha256 af60dbed...,
  downloaded here) are byte-identical to it, including all shared objects; the only differing file is the
  pip-written `RECORD`, and the bundle adds `INSTALLER`, `REQUESTED`, `RUNTIME_PROVENANCE.json`.
- Code reading before running: `run.py`, `launch.py`, `arcs/verify_arcs_fresh.py`, `arcs/compact_arc_witnesses.py`,
  `referee/check_mathematical_interfaces.py`, `referee/check_original_affine_native.py` in full; the kernel
  checker lines 1-140; the tail of `overlays`. The other checkers were scanned statically (imports, file
  writes, absolute paths, dynamic execution): they import only the standard library and `flint`, use no
  subprocess, socket, eval/exec or deletion, and write only into the work directory. The proof map records a
  reading of all 15.
- Run: compute server through `rhrun r9-replay15 8 4` (unit rh-r9-replay15-1118055921), command
  `/usr/bin/python3.12 -I Lambda_Peer_Review/replay/run.py --all --jobs 4 --work <slug>/work`.
  CPython 3.12.3, Linux x86_64, glibc 2.39, bundled python-flint 0.8.0 / FLINT 3.3.1. Peak memory under 1 GB
  while observed. Result: `ALL_REQUESTED_STEPS_PASS 15`, exit 0, 227 s.

| stage | exit | seconds | count reported |
|---|---|---|---|
| native | 0 | 173.5 | 843,026 checks, 67 rows x 7 heights |
| activation | 0 | 1.4 | 67 rows, 469 heights |
| spectral | 0 | 3.4 | 19,416 interval evaluations |
| heads28 | 0 | 21.7 | 1,513,158 checks, 28 rows |
| heads39 | 0 | 12.3 | 39 rows |
| wall | 0 | 9.2 | 2,763,952 prefixes |
| kernel | 0 | 192.7 | 10,388 checks, 67 rows |
| arcs | 0 | 97.1 | 221,010 arcs, 5,797,314 checks |
| affine | 0 | 0.6 | 67 rows |
| overlays | 0 | 8.7 | 54,651 checks |
| compact-arcs | 0 | 20.8 | 3,978,180 checks |
| interfaces | 0 | 0.2 | 7,085 checks |
| physical-debit-map | 0 | 0.2 | 4,784 checks |
| arithmetic-credit-map | 0 | 0.3 | 650 checks |
| direct-source | 0 | 1.2 | 268 fields |

- Comparison with the result files shipped in the bundle: the arc transcript has the same uncompressed
  sha256 (e7951651...) and the same check count 5,797,314 as the paper states; the compact margin file is
  identical after decompression; all 67 kernel certificates, and the native, activation, spectral, affine,
  heads28, heads39, wall, interfaces and physical-debit results, are equal after dropping timing fields; the
  overlays table agrees in fields, functionals, cells and caps (it differs only in a recorded path string).
  Remaining byte differences are gzip headers, timings and that path.
- Files: `runs/r9/server/` (receipt, 15 logs, results, `work_sha256.txt`). The 425 MB full-margin transcript
  was left on the server.

## 5. Corrections and remarks

- **C1 (cosmetic).** Sec 4.5: "rates range up to approximately 22.6946264088". The exact maximum is
  22.69462640873..., which rounds to 22.6946264087. No inequality uses this figure.
- **R1 (robustness, MEASURED in floats, `scripts/r9/sens.py`, `runs/r9/sens.log`).** Integrating
  q' = -2 - 2q(S_i - eps - O_i(q)) with the ledger's S_i: eps = 1e-4 moves the endpoint to 0.1079655,
  eps = 1e-3 to 0.1079714; with eps = 1e-2 (about 0.1 % of S_i) the trajectory leaves the kernel cap at the
  start of row 27 (0.16307 > c_27 = 0.16299), and a 1 % relative loss already fails at row 1. So a correction
  of that size to any upstream source constant would require new kernel caps and a new flow, not only a new
  endpoint. This matters for referees R4-R7: the proof has an absolute tolerance to source errors of the
  order of 1e-3 in S_i units (S_i ranges over 7.64 ... 18.39) before the certificate structure breaks.
- **R2.** (89) is the only link between the flow and the zeros, and no stage tests it; the paper says this
  itself (sec 4.1). Prop 4.3 is a statement about rational data only.
- **R3.** The paper's sec 5.5 statement that the "independent" consumers were written in the same session as
  the producers applies to the arc checker too; the replay in section 1 above is independent of both.

## 6. Not checked

- (89) itself: Thm 3.1 (source bound for all x >= X), Thm 3.4 (kernel inequality and monotonicity of O_pair on the
  cap; only a 400-point exact grid per row was sampled here, all increments positive, which is a spot check and
  not a proof), Prop 2.7, Lemma 2.5-2.9, Prop 2.4, Thm 2.10.
- The 7/8 theorem (E1) and its translation to |Im z| <= 3/4; Platt-Trudgian; Polymath inputs.
- The mathematical content of the 14 stages other than `arcs`: they were executed and passed, their internal
  reductions were not audited here (except the bindings in section 3). In particular the constants typed in
  from prose in `wall`, `affine`, `overlays` (proof map, section 5, gaps 1-3) were not re-derived.
- Correctness of FLINT/Arb and CPython. For the arc stage this dependence is removed by the stdlib replay; for
  the other stages it is not.
- A run of the 15 stages on a second arithmetic runtime (other platform or python-flint version) was not done.
  The author's `verify_bundle.py` and `Verify_Deposit.py` were not run.
