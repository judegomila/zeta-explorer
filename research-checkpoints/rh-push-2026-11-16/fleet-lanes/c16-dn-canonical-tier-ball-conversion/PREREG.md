# PREREG: c16-dn-canonical-tier-ball-conversion

Written 2026-11-19 before any node of the record was evaluated. Round 16, kind compute (heavy lane, server through
`rhrun`, at most 16 cores and 32 GB). No statement about zeros of zeta is made by any outcome. No answer for R4 is
registered.

Disclosure of what ran before this file: one local kernel probe (`diag1.py`, through `scripts/memcap.sh 8`): ball
values of the family value at 3 far-tail nodes for 6 training objects at 128, 256, 512, 1024 bits. It was run to find
why the c15 ball stage reported "not decided at 1024 bits". Finding (used in section 4): `nball.bratio` accepts a
rung when `rad <= 1e-6 * max(abs(mid), 1e-30)`; a 256-bit ball `[+/- 1.9e-76]` passes that test with midpoint 0, so
the c15 ball stage never reached 1024 bits at those entries. The values resolve at 512 bits (for example
L2 of log Kpol: zeta 1.8419e-84, HEAT tau = -0.1: 1.6575e-84, HEAT tau = -0.5: 1.0870e-84 at u = 2.142, h = 0.0817).

## 1. Exact objects and node ids

Part A (dictionary DN, canonical tier).
- Objects: the c15 pair set restricted to the canonical classes, built by `nobj.build({}, skip=(1,5,6,7,8,9))`
  (the class generators have separate seeds, so the members equal those of c15): training positives P = 23 pairs
  (zeta, chi), PX = 506 pairs (chi, chi'), conductor <= 13; held-out positives PH = 24; training controls C2 (T-NR at
  the smallest split prime, 5 pairs), C3 (E_a, a = 1/8, 1/4, 10 pairs), C4 (HEAT, tau = -0.1, -0.5, the same tau on
  both members, 10 pairs); held-out controls H2, H3, H4, 24 seeded members each (seeds 140002, 140003, 140004 of
  `jobj.rng`). 650 pairs. A check that the names equal the stored `out2/objects.json` names of those groups is the
  first step of the run.
- Nodes: the row indices stored by c15 run 2 under `out2/<family>_summary.json`, key `PA/canon/rows_und`, read against
  `out/g1_nodes.npz` and `out/g2_nodes.npz`: b1-Aw 19,253; b3-with 18,381; b2-with 14,652; b5l-with 14,652; b5m-with
  80; b5p-with 80; b6-with 40. Total 67,138 family-nodes. No other node is in scope of the count.
- Tier: PA/canon = positives P + PX (529), classes {2, 3, 4}.

Part B (dictionary DJ of c14, canonical lifts only).
- Objects: the c14 pair set as stored (`out/objects.json` on the server; T-NR there is at p0 = 3, 4 training pairs).
- Functionals: every stored row of the 40 family runs of c14 (10 families x {grid, -rnd, -adp, -rnd2}); ids are the
  row indices of `<family>_params.npz`; signs from `<family>_s1.npy`, `_idx2.npy`, `_s2.npy`. The draw stage is the
  20 runs `-rnd` and `-rnd2`; grid and adaptive runs are recounted too and reported separately.
- Tier: positives PA, strict reading, classes {2, 3, 4}.

## 2. Sign statistic

Part A. Family value sign(V1 - lam V2) (V2 = 1 for threshold families), as in c15 `nf.py`, `nball.bvalue`. Node
status in the tier, by the c15 interval logic `nsolve.solve_sign`:
- T-train: some lam gives all 529 positives one strict sign and a training member of each of C2, C3, C4 the
  opposite strict sign;
- excluded: no lam does so even when every undecided entry is read in favour;
- undecided: neither.
- identity: reflection node (b6 at 2u + h = 0; third differences at u = 0), excluded by the reflection identity
  (all three canonical classes have K(-u) = conj K(u)).
A T-train node **holds out** (primary rule, the c15 rule) if at lam = `nsolve.pick` of a feasible interval at least
23 of 24 PH have the positives' sign and at least 23 of 24 members of each of H2, H3, H4 have the opposite sign.
Secondary read (new in this lane, registered because the c15 rule fixes lam at the interval midpoint): the node
**holds out for some lam** if a lam in a feasible interval meets the same counts; lam is scanned over the midpoints
between consecutive held-out ratio values inside the interval and the interval ends. A survivor under either read is
reported; the registered count is the primary one.

Part B. Stored float64 signs; a row is T-train if one-signed on PA and a training pair of each of C2, C3, C4 has
the opposite sign; full if in addition >= 23 of 24 PH agree and >= 23 of 24 of each of H2, H3, H4 are opposite.
Rows that float64 cannot exclude (c14 `jan.optimistic` with classes {2, 3, 4}) and rows at T-train whose held-out
count could reach the rule if undecided entries are read in favour are re-read in balls (`jball.bsign`).

## 3. Precision ladder and the rule at 512 bits

Ladder 128, 256, 512 bits. A rung is accepted for an entry only if the ball of the ratio has radius at most 1e-6 of
the absolute value of its midpoint (so it excludes 0); the c15 absolute floor 1e-30 is removed (see disclosure).
Shortcut that does not change any verdict: an entry may start at a higher rung (start rung = smallest rung above
pi e^(2x)/ln 2 + 64 bits, x = smallest absolute stencil point, when the A kernel carries polar terms).
Rule for an entry not accepted at 512 bits: extended rungs 1024 and 2048. An entry not accepted at 2048 bits stays
undecided and is read in favour of feasibility. A node whose status is still "undecided" after that is **not
closed**: it is listed with its u, h and the entries left, it does not count as excluded, and the tier is then
reported as not closed. Part B: ladder 128, 256, 512, extended 1024, 2048, 4096 (c14 used up to 4096); same rule.
Midpoints are stored in float64; an accepted entry with abs(mid) < 1e-290 is treated as not accepted.

## 4. Decomposition with a predicted count per part

| part | families | with / without polar terms | undecided nodes in scope | predicted T-train in balls | predicted hold out |
|---|---|---|---|---|---|
| quotient value and quotient minors | a1-with, a2-with, a3-with | with | 0 | 0 | 0 |
| quotient log step | b6-with | with | 40 (40 identity) | 0 | 0 |
| second log differences, threshold | b1-Aw | with | 19,253 | 0 | 0 |
| second log differences, ratio | b3-with | with | 18,381 | no number (unknown sign pattern); fewer than 5,000 | 0 |
| third log differences, threshold | b2-with | with | 14,652 (80 identity) | more than 5,000 | 0 |
| third log differences, ratio | b5l-with | with | 14,652 (80 identity) | fewer than 7,000 | 0 |
| third log differences, mixed | b5m-with, b5p-with | with | 160 (160 identity) | 0 | 0 |
| all without-polar reads | b1-Ao, b1-B, b3-without, b4p-without | without | 0 | 0 | 0 |
| product nodes | c1, c2, c3 (T and Q) | - | 0 (c15: no undecided node in a PA tier) | not run | 0 |
| total | | | 67,138 (360 identity) | | **0** |

Reasons for the predictions (ARGUED, from the probe and the kernel formulas; not results): at the far-tail nodes
Kpol_zeta = e^(v/2)(1 + eps_z), eps_z = 2 e^(-pi e^(2v)) + ..., and the HEAT A side with polar terms is
c e^(v/2)(1 + eps_h) with eps_h close to (g(v)/c) eps_z, 0 < g(v)/c < 1. The log differences of both are tiny and of
the same sign, the HEAT value being the smaller in absolute value; chi-side values are large and of the sign of
-e^(2u) differences. For b1-Aw the positives lie below the zeta value, so a rejection of HEAT needs a HEAT value
above the zeta value: predicted never. For b2-with the HEAT value lies between the zeta value and 0, on the side
where a threshold can cut: T-train expected whenever T-NR and E_a have a member on that side; the midpoint
threshold then leaves the held-out HEAT members with small abs(tau) on the positives' side (c15 medians 10 to 12 of
24). Registered prediction: **0 nodes hold out** (primary). Secondary read: predicted 0 as well, with less
confidence (no measurement of the held-out E_a and T-NR values relative to the zeta value exists).

Part B predictions: T-train in the canonical tier between 59 (the FE-tier rows are a subset) and 975 (rows rejecting
HEAT with PA); predicted about 150; full: 0.

## 5. Components removed

- The 360 reflection-identity nodes (40 + 4 x 80) are removed by the identity, not by evaluation; the count 360 is
  checked.
- Float64 entries farther than 20 half-widths from every interval that is feasible in the favourable reading are
  kept in float64 (the c15 rule); all other training entries are recomputed in balls.
- Nothing is fitted. No class, family or node is removed after the run.

## 6. Seeded controls, held-out members, checks

- First check (before the main run): 200 float64-decided nodes of the c15 canonical tier (seed 160001; b2-with: 25
  T-train + 25 excluded; b5l-with: 25 T-train + 25 excluded; b1-Aw: 50 excluded; b3-with: 50 excluded), every one of
  the 554 training entries recomputed in balls; the status must equal the stored one. And the count of
  reflection-identity nodes among the 67,138 must be 360.
- Control checks: (i) Lemma J1-Q: a1-without on each of the 34 HEAT pairs (10 training, 24 held-out) equals a1-without
  on (zeta, same chi); Lemma J1-L: third log difference of the HEAT A side without polar terms equals that of zeta,
  and the second differs by tau h^2/2; in balls at 256 bits at 20 seeded nodes (seed 160002): each difference ball
  must contain 0 with radius below 1e-50. (ii) Every control kernel (A and B members of C2, C3, C4, H2, H3, H4, 97
  pairs) has a ball value excluding 0 at one of u = 0.3, 0.7, 1.1.
- Held-out members: PH (24), H2, H3, H4 (24 seeded members each) as in c15; they enter only the hold-out rule.
- Seeded control classes for the search statistic: the three canonical classes each have 24 held-out seeds; label
  shuffles are not repeated (c15: 0 or 1 of 200 at T-train).

## 7. What each outcome changes

- "None" (0 nodes hold out, 0 nodes left undecided): the canonical tier of DN is closed on the registered scan
  (MEASURED, ball-certified at the converted nodes); with the Part B recount at 0 full, family 34 is closed at the
  canonical tier as well (map row DN final). No score.
- A node holds out (either read): MEASURED only; it carries no score until a structural reason is proved; it
  becomes the lead of round 17. Its family, u, h, lam interval and the held-out counts are reported.
- Nodes left undecided after 2048 bits: the tier is reported "not closed", with the list.
- Part B full survivor: same treatment as a held-out node.

## 8. Compute plan

Local: probes and the first check at reduced size through `scripts/memcap.sh 8`. Server: `rhrun` only, `rhstatus`
before each launch, one unit at a time, 16 cores, 16 GB requested; unit names recorded in RESULT.md; units stopped
by name if still running at the end. Planned memory is printed by each script before allocation (Part A: float64
value blocks of 25 nodes x 650 pairs per worker, below 1 MB each; Part B: one sign matrix at a time, at most
int8[rows x 833], largest about 2.7 GB plus one boolean copy per class).

## 9. Amendments

- **A0 (compute, during the Part A run; no change of object, statistic or rule).** The server was oversubscribed
  (load average 110 to 190 on 48 cores, 31 units in rh.slice); the 16-worker unit advanced at 0.06 to 0.3 jobs per
  second. The same deterministic job list was therefore also processed from its end by local helper runs (single
  process each, through `scripts/memcap.sh 8`, up to five at a time, `C16_JOBSLICE`); the first five local runs
  lasted 34 to 36 minutes (above the 20-minute local limit: the local machine was itself loaded), the later ones
  were cut to 40 jobs (2 to 10 minutes each). The server unit covered the front of the list. Nodes computed on both
  machines are compared entry by entry in `merge.py`. The first server unit was stopped by name after 12 minutes
  and relaunched with a resume option and checkpoints every 100 jobs.
- **A1 (extension, written after the Part A result and before its run).** Part A converted the 67,138 undecided
  nodes: 29,144 reach T-train in balls and none holds out under either read. The 22,508 nodes that c15 already had
  at T-train in float64 (b2-with 15,784; b5l-with 6,724) were read by c15 with the primary rule only and in float64.
  Extension: the same code on those node lists (`PA/canon/rows_feas`, `C16_ROWS=feas`): status in balls, primary
  rule with balls on demand, secondary read. Predictions: 22,508 of 22,508 at T-train; 0 hold out (primary, as
  c15); 0 hold out for some lam (secondary). Outcomes change the record as in section 7. Run on the server
  (16 workers) from the front of the list and by local helper runs of 40 jobs from the end, as in A0.
