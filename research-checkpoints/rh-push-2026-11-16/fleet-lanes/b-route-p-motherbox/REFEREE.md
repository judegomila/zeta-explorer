# REFEREE: b-route-p-motherbox

Date: 2026-11-16. Adversarial referee pass on `RESULT.md` (claimed verdict: partial-result). Nothing here is a QED. PT Λ ≤ 0.2 is the accepted benchmark; RH open.

## Verdict

**Holds as stated**: the computational claims reproduce, the one logical step (admitting budget-stopped certificates) is valid, and no refuting case was found. The claim is conditional numerics, not a theorem about Λ: the ledger it is relative to contains items graded **open** in `formalization/review-packet-sub0145/README.md` (G0-c, G0-d, G0-d′, AF gaps) and an in-house zero verification above the published height. Seven corrections are listed below; none changes a number.

`RESULT.md` contains no step labelled PROVED. The steps checked are CERTIFIED (numerics) and MEASURED.

## What I re-ran (all local, single process each; scripts in `/tmp/ref_b/`, volatile)

| # | Check | Method (independent of the pipeline unless noted) | Result |
|---|---|---|---|
| 1 | Real coverage of [0,π]×[−π,π]² by every assembled certificate, collect7 (369) and collect8 (369) | `kdcover.py`: my own kd recursion in exact Python integers (floats scaled by 2^120, asserted exact; π replaced by a rational upper bound). Different code and arithmetic from `routes-b1-ref1-cover.py` (numpy double-double) | collect7: 369/369, 0 holes, 36 incomplete. collect8: 369/369, 0 holes, 35 incomplete |
| 1a | Negative controls for check 1 on `cert_190` | drop one box; shrink one half-width by 3e-12; deflate all half-widths by 3e-12 | 6 holes; 5 holes; 56,527 holes. The checker detects holes at the 1e-12 scale |
| 2 | Margins and admission file | m = max ub − K0* as exact rationals from my check-1 run; shift ≤ 23/10000 − m − 1e-9 exactly | collect7 `fullref`: 354 direct + 15 via referee re-certificates, 0 bad, 0 unlicensed tags, no base tag lowered, min slack 1.13e-13. collect7 `full`: 369 direct, 0 bad. collect8: same counts, 0 bad |
| 3 | Route-P value | reran `tmp/r3-outer-mixed.py` on `collect7/merge/certfile_fullref.json` (pipeline code) | `U1_band 36249332027817/250000000000000`, last cell 579. Reproduced. sha256 of both admission files match the values quoted in RESULT |
| 4 | Engine identity | sha256 of `r7-engine-cert-v4c.py`, `r6-fiber-lib.py`, `r6-fiber-l1.py`, `libr6tm2`, `libr6maj`, `r7-engine-xstruct.py` against the hashes recorded in `formalization/paper/fiber-tails.md` | all equal (engine 3c5463d1fbff32f4). "No new bound code" confirmed. Note: these files are untracked in git; the paper hash is the only anchor |
| 5 | x86 port on floors other than 279 | `xprobe.py`: boxes that are new in the motherbox certificate (absent from the Mac partial), plus the margin-defining box, recomputed with the Mac engine. Floors 190, 279, 254, 176 | 14 boxes with source gap/full/open: recorded value equals the Mac recomputation to ≤ 2.2e-16. 7 boxes with source cheap: recorded value is larger than min(gap, full), i.e. looser, as expected. No mismatch |
| 6 | Integrity of campaign certificates never collected before | `xprobe2.py`: complete floors 265, 118, 292 from `tmp/route1-campaign/run`; margin-defining box and three random gap/full boxes each | 11/11 recorded bounds reproduced bit for bit; the twelfth (cheap source) is looser than the recomputed full bound |
| 7 | Falsification search on the bound itself | `mc2.py`: point evaluator of the bound function Φ (K0 + Σ|X_r| + Σ_s(β+hi+tl)/2 + T2, centre formulas of `r6-fiber-l1.py`), calibrated at θ = 0 against K0* (difference −2.3e-3, −1.1e-3, −1.5e-4 on floors 190, 104, 279: the recorded `err` allowance). Random starts plus coordinate ascent over all 15 phases; best point compared with the ub of the certificate box containing θ_s | Floor 190 (largest margin, incomplete, motherbox certificate): 7 starts, 888 evaluations, max Φ − K0* = −0.0023 at θ = 0, minimum slack against the containing box 0.0799, no violation. Floor 104 (complete, campaign): max −0.0011, minimum slack 0.0457, no violation. Floor 279 (completed on the motherbox): 6 starts, max −0.00015, minimum slack 0.0547, no violation. θ = 0 is a local maximum in all three, consistent with the outer lemma. Also `mc.py` (main part only, 9 boxes per floor): no violation |
| 8 | Probe claim | recomputed from `probe_mac_279.json`, `probe_mb_279.json` | 36 numbers, max difference 2.22e-16; Mac reproduces all recorded values. As stated |
| 9 | Campaign state | `tmp/route1-campaign/status.tsv`, `sched.log` | scheduler exit 2026-10-10 05:17, 102 done, 36 budget-stopped. As stated. `run/` not modified since |
| 10 | Arithmetic of the headline gaps | exact rationals | 0.145 − route P = 2.672e-6; 0.145 − joint = 3.673e-5; collect7 − collect8 = 2.12e-7 (route P), 1.16e-7 (joint). As stated |

Not re-run: the joint consumer (11–39 minutes per run; RESULT's four logs agree with each other on value, step count, usage and `fails {}`), E1–E8 and altlog (logs read, consistent), the motherbox runs.

## The one logical step: budget-stopped certificates

Re-derived from `tmp/r7-full-cert.py`. On a budget break the certificate lists accepted boxes and the heap; each heap entry carries min(own evaluations, parent bound); margin = max over all listed boxes. `emit.sh` (budget 0) breaks before any heap pop, so it only serialises the last checkpoint, which is written between complete parent expansions and replaced atomically. A larger margin gives a smaller shift, hence a lower admitted floor (floor = L_lo/4 − 1e-6 − pert − K*, slope 1 in K*). Each admission file is valid on its own, so no monotonicity of the consumer is needed. **Valid.**

One refinement that RESULT and the pipeline do not state. Every split inflates the child half-width by (1 + 1e-12), so a child box extends past its parent by about 0.5e-12 of the parent width. A parent-inherited or cheap bound is proved on (child box ∩ ancestor box), not on the whole stored child box. The flat-file cover check therefore is not by itself the proof; the proof is the tree induction R(node) = box(node) ∩ ⋂ ancestors, R(child₁) ∪ R(child₂) ⊇ R(parent). That induction holds for this driver, including seeds and resumed checkpoints. The slivers are 1e-12 wide and the pad is 1e-9, so nothing moves.

## Corrections

1. **"0.5%–16% above target" is 0.27%–16.3%.** Minimum ratio 1.00275 (from `collect7/assembled/report.json`).
2. **"CERTIFIED (interval/Arb …)" overstates the engine.** Arb is used for coefficient and phase tables. Box bounds are double precision with a priori inflation factors (`UP`, `SUMF = 1 + 2e-10`, `1 + 1e-12`, `U = 1.2e-16`) and directed rounding in two C files only. That is an error budget, not interval arithmetic. It is not material here: undoing the 2.67e-6 slack needs a uniform margin error of about 2.9e-4 across all floors (from RESULT's own ×0.9 scan), six orders above the rounding scale. The sign-deciding comparisons in the admission and consumer layers are exact rationals (confirmed).
3. **The dyadic tiling checks are not real-coverage proofs.** In `cert_10`, 258 of 2112 boxes do not contain their nominal dyadic cell (edge offsets up to 5.5e-13, from accumulated centre drift). Coverage holds through sibling overlap and is established by the kd checks (theirs and mine), not by the assembler's integer tiling. The same remark applies to the integer tiling used for the 15 referee re-certificates; the `full` lane (no referee certificates) gives 0.144997332500564, also below 0.145, so the headline does not depend on it.
4. **Not only "verified height restated".** RH-win is an in-house Route-2 verification of 16,071 zeros in a window near 7.8e12, and the joint run uses W2 at 9.9e12 (33,987 zeros). Both lie above the Platt–Trudgian height and use FLINT routines graded unaudited in the packet. No global RH assumption is made, but the DH/verified-height paragraph should say that the value depends on unpublished zero verification.
5. **The floor of the joint layout is X165mid, not U2.** The joint value 0.144963267 sits 5.08e-5 above the recorded X165mid 0.144912451862679, whose tables were deleted and cannot be replayed. The earlier record's "both ≥ 7.1e-4 below band 1" no longer applies. Band 1 still binds.
6. **Weakest step 3 understates the unrefereed set.** All 138 campaign certificates (102 complete, 36 incomplete) entered a collect for the first time here; 115 are new since collect6. None has had an independent-driver re-certification. My check 6 is an integrity check with the same engine, and check 7 is a one-sided falsification test; neither replaces that sample.
7. **The 36-number probe cannot validate directed rounding on x86.** A 2-ulp agreement test is coarser than the effect of a rounding mode that fails to apply. The effect is bounded by the 1e-9 pad, and collect7 does not use the port.

## Controls

Davenport–Heilbronn, backward heat flow and sign twist do not apply as tests of an argument: this is a finite certificate chain for an upper bound on Λ, and its ζ-specific inputs (zeros on the line to the head wall and in the windows, MTY zero-free region) are false for DH. Nothing in the chain bears on Λ = 0. No step assumes RH beyond the finite windows named in correction 4.

## Surviving claim

Relative to the route-P ledger (open items G0-c, G0-d, G0-d′, AF gaps; unrefereed Lemma B and Theorem B′_m; in-house zero windows above PT height; one float engine with a priori error factors; internal checks only): route P alone gives Λ ≤ 36249332027817/250000000000000 = 0.144997328111268 from Mac-engine certificates, and the 3-band joint run gives 0.144963267002879 (additionally relying on the unreplayable X165mid record). With the motherbox continuations: 0.144997115913964 (U_robust) and 0.144963150729611. The task premise was stale and the motherbox contributed −2.1e-7. No QED.

## Residual risks, in order

1. The ledger's open lemmas. All numerics could be exact and the bound on Λ still fail.
2. Single implementation of the box bounds. Check 7 found the certified bound 0.046–0.080 (three floors) above the best point value near θ_s = 0, so the margins are bound looseness, not measured excess; an error in the bound that lowered it by less than that would not be visible to point sampling.
3. Route P alone has 2.67e-6 of slack (one substep). The joint value has 3.67e-5 but rests on a record that cannot be replayed.
