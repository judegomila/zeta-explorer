# Planner note for round 19: which top-60 triples are usable

Written 2026-11-19 by lane `c18-repair-owed-record-r17-open-device-nodes` (campaign round 18, repair lane B). Input:
`engine/CANDIDATES.json` as rerun by that lane after its edits (`generate.py --top 60`, through `scripts/memcap.sh 8`;
44,431 generated, 12,315 scored; copy in `push/c18-repair-owed-record-r17-open-device-nodes/after/CANDIDATES.json`;
table of all 60 entries in `top60_before_after.md` there). One reader, no referee. A rank is a heuristic of the
generator and is not evidence about zeros of zeta. Nothing here is a statement about zeros of zeta.

## 1. What the list is

- 24 entries stand on a proposed, untested device node: 12 on `tz-one-sided-completion-bound-band`, 12 on
  `exact-relation-rigidity` (12 is the per-device cap). The other 36 stand on the floored 7/8 device type
  (`tro6-natural` 12, `qrh-seven-eighths` 12, `map-open-2` 7, `seven-eighths-abscissa-formula` 4, `map-open-4` 2; one entry
  has two device members).
- Rank 1: `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tz-one-sided-completion-bound-band`, 11.25.
  It is the previous rank 1 (10.25) with the floored node `tro6-natural` replaced by the proposed node; the partners are
  joined to the device by the tags `bridge` and `shear` only. It is not usable (section 3).
- The two proposed nodes are questions with entry conditions (`engine/curated/devices.json`, fields `entryConditions`,
  `controlsThatMustFail`). No lane has passed stage A on either. The proposed nodes carry tags chosen by one reader from
  the round-18 allocation text; the partner lists follow from those tags.

## 2. State of the two device types when this note was written

| type | lanes of round 18 on it | state |
|---|---|---|
| `tz-one-sided-completion-bound-band` | `c18-tz-one-sided-bound-fe-reserve-bridge` (paper), `c18-tz-band-completion-controls-server` (server) | neither had filed a RESULT.md. Open. |
| `exact-relation-rigidity` | `c18-exact-relation-rigidity-klein-spinor` | RESULT.md filed, 0 referees: precise obstruction; with the relation "multiplicativity" the branch closes (multiplicativity is independent of every clause of Hamburger and of Theorem P; new control HQ2 with zeta's functional equation, integer frequencies, multiplicative coefficients >= 1 and zeros off the line, failing only the pole clause). Open in `devices.json` until a referee holds; then the next record lane sets it to closed and its 12 entries are rejected. |

Rule for the planner: read the RESULT and REFEREE files of these three lanes before using any entry below. If lane 2
or 3 of round 18 finds a control that passes every step of the displayed bound, the first type closes too and no
entry of the list is usable as an explore slot.

## 3. The 24 entries on a proposed node

"Usable" means only: a partner states an object on which entry condition E1 of the type can be written, and no
partner is a target form, a mean-value object alone or a 7/8 node. It does not mean a lead.

| rank | score | partners | device | usable | reason |
|---|---|---|---|---|---|
| 1 | 11.25 | `capture-ratio-psd-slope`, `sympow-conductor-normalised-shift` | tz | no | shear capture norm and a Sym^m conductor lemma; no band operator, joined by tags only |
| 6 | 10.25 | `pascal-carry-ballot`, `two-tents-joint-zero-completeness` | tz | no | both partners are target forms (`devices.json`, `targetForms`) |
| 10 | 10.00 | `autocorrelation-moment-ladder`, `cotangent-second-moment-upper-lemma` | tz | no | moment expansion and a mean-value lemma (MV-CAP) |
| 11 | 10.00 | `tilt-det-majorant`, `prime-delay-domination-15-4` | tz | no | Re xi'/xi > 0 right of the line is the target (row P45); the other partner is Lambda-side |
| 13 | 9.75 | `lean-weil-small-support`, `mem-atlas-closing-line` | tz | yes, as carrier | the Lean lemma is the band form at u < log 2 with a deficit clause (`uncertainty_toeplitz_nonneg`: a one-sided completion at small band); the atlas open item "all-scale signed arithmetic estimate / cofinal floor of the form" is the missing bound in the user's wording |
| 15 | 9.50 | `gl2-weil-symbol`, `gauss-plancherel-alias-lemma` | tz | as a control row only | Weil symbol of a newform with the prime sum cut at 2a: a companion on which a displayed bound can be run (passes under GRH); not a lane |
| 19 | 9.25 | `arch-native-prime-jordan-product`, `restricted-mobius-delay-lift` | tz | yes (first partner) | closed forms of the archimedean, pole and prime terms on the native span: the pole term of E1 in explicit form; the second partner is a measured conditioning barrier |
| 26 | 8.75 | `zv-taylor-rouche-channel-criterion`, `prime-tent-rh-equivalence` | tz | no | target form plus a local zero-isolation tool |
| 27 | 8.50 | `ka-positivity-residual`, `map-pos-18` | tz | yes | `map-pos-18` is the proved band of the truncated chain (Q <= (log(t_0/2 pi))^2/16, a power of log t; node marked unrefereed, lane `sq-causal-cascade`), the lower end of the band the type asks about; the other partner is the off-diagonal endpoint-Hankel residual (bridge Hankel block). Nearest to lane 2 of round 18 |
| 30 | 8.25 | `ri-sigma2-symbol`, `route-i-toeplitz-krein` | tz | yes, for definition and calibration only | Route I is the pole-free Weil form as a Toeplitz form at fixed band 2a <= ln 3 (Arb-certified); the band is not coupled to height, so R2 and R4 are not addressed |
| 32 | 8.00 | `schur-charge-payment`, `h6-symbol-offline-poisson` | tz | yes | H6 is the symbol decomposition (natural part plus Poisson kernels of off-line zeros) and the Schur charge is the pole-term Schur complement named by the planner; the first partner is attached to closed rows G11, P10 (penalty taken) |
| 33 | 8.00 | `ka-offdiagonal-hankel-g7`, `scattering-causality-at-one-line` | tz | yes (first partner) | endpoint-Hankel block of the bridge; the second partner is attached to closed row G10 |
| 2 | 10.75 | `sep-opt-lattice-extremal`, `tro6-natural` | xr | no | no relation; second device is the floored 7/8 node |
| 3 | 10.50 | `sun-prop63-plus4-offset`, `mem-sextic-theta-squarefree` | xr | no (7/8-adjacent) | a six-fold Patterson-type identity would be an exact relation for theta coefficients, not for zeta at defect 0; counts against the two-lane limit on 7/8 machinery |
| 4 | 10.25 | `parity-pure-maj-witness-threshold`, `alias-sign-determinacy` | xr | no | seam-Gram objects; no exact relation of the required kind |
| 5 | 10.25 | `ingham-offlattice-riesz-floor`, `alias-energy-in-sieve-algebra` | xr | no | as rank 4 |
| 7 | 10.25 | `ramanujan-cube-satake-point`, `cmv-truncation-from-taylor-data` | xr | no | first partner is an RH-equivalent restatement |
| 8 | 10.00 | `zv-annulus-dtn-operator`, `star-min-pointwise-prime-bound` | xr | carrier only | the annulus Dirichlet-to-Neumann operator is the Klein-seam carrier; the second partner is a bound at one verified height |
| 9 | 10.00 | `evaluation-christoffel-duality`, `gauss-plancherel-alias-lemma` | xr | no | as rank 4 |
| 14 | 9.72 | `parity-amgm-gram-sharp`, `cotangent-second-moment-upper-lemma` | xr | no | mean-value lemma |
| 17 | 9.25 | `subleading-k-closed-form`, `route-m-vasyunin-gram` | xr | no | Bettin-Conrey reciprocity is an exact relation that reads the functional equation in Estermann form, not multiplicativity (fails E3); mean-value side |
| 18 | 9.25 | `bridge-winding-equals-NT`, `route-m-first-moment-kappa` | xr | no | the winding identity is a zero count |
| 20 | 9.00 | `zv-annulus-boundary-conditions`, `bohr-torus-scan-certification` | xr | carrier only | the symmetries f o D = f, f o R = conj f on the reflection annulus are exact relations that every real function with the functional equation satisfies (DH passes): E3 needs an added multiplicative step; second partner is Lambda-side |
| 22 | 9.00 | `tilt-det-majorant`, `kyp-bounded-real-prime-delay` | xr | no | passivity is a positivity (E4 excludes it) |

Count: on the first type 5 entries usable (ranks 13, 19, 27, 32, 33), 1 for definition and calibration (30), 1 as a
control row (15), 5 not usable. On the second type 0 usable as a lane, 2 as carriers (8, 20), and all 12 are held
until the referee of `c18-exact-relation-rigidity-klein-spinor` reports.

## 4. The 36 entries on the floored 7/8 device type

Not usable as explore slots: no named new input (unchanged from rounds 17 and 18; limit of two lanes per round on the 7/8
machinery in the user directive of 2026-11-19, STRATEGY.md).

## 5. User geometric program in the list

Entries of the top 60 with a partner (a member other than the proposed node) carrying a declared tag: twin-ladder 17,
bridge 16, shear 9, torus 6, zero-channel 5, klein 4, vortex 1, antibridge 0, spinor 0, twistor 0 (before the change:
13, 11, 6, 6, 4, 2, 2, 0, 0, 0). 38 of the 60 entries have at least one such partner (before: 31); 20 of the 24
proposed-node entries do. Antibridge, spinor, twistor and vortex partners exist among the scored candidates on the
proposed nodes and are cut by the selection caps (per-node 2, per-device 12, per-family 6), not by a rule: best scores
on the first type antibridge 10.5 (`bridge-sign-from-phi-positivity` x `sympow-conductor-normalised-shift`), spinor 7.5,
vortex 7.25, torus and twistor none; on the second type twistor 10.0 (`zv-dual-conormal-family` x
`ramanujan-cube-satake-point`), spinor 9.0, antibridge 9.0, vortex 8.5, shear none
(`push/c18-repair-owed-record-r17-open-device-nodes/after/geo_best.json`). To list them:
`python3 generate.py --node tz-one-sided-completion-bound-band --theme geometry --top 40`.

## 6. Suggested use (the planner decides)

1. Read the three RESULT/REFEREE files named in section 2 first.
2. If the first type is still open: one lane on the triple of rank 27 with the pole term of rank 19 and the symbol
   decomposition of rank 32 as written inputs (they are one object seen three ways: band operator, pole term, off-line
   Poisson part), entry test E4 on paper against the eleven controls before any proof attempt.
3. The second type gives no slot for round 19 unless the referee of its lane does not hold.
4. Cells without a passing control on file after round 17: the U4 residual and U6 (c), both with round-18 lanes.
