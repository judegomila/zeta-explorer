## 6. Controls on the computation

| control required by the assignment | how it was met |
|---|---|
| every object checked not identically zero on the contour | every vertex and segment enclosure excludes 0 (stronger: no zero on the contour); lower bounds for abs F on the contour are in the tables |
| each enclosure rerun at doubled precision | items A, B, C: 128 and 256 bits, all squares, same integers; item A also at 256 bits with a different integration line and strip width (run B); item D: 128 and 256 bits for P <= 29 and for the zeta phases at P = 37; 128 bits only for U_s0 at P = 37 and the zeta phases at P = 47 |
| zeta itself on the same rectangles | item A: H_0(z) = xi((1+iz)/2)/8 on the same squares, winding 0 in every run; items B, C: zeta(s) on the same squares, winding 0. Item D has no zeta analogue (finite stages); the stage control there is U_s0 |
| planned precision and allocation printed before the run | `PLAN:` line at the head of every log |

Independent check (not rigorous, different code path, mpmath only, unshifted line): `referee_check.py`, three zeros;
see REFEREE.md.

What the controls of the campaign (Davenport-Heilbronn and the rest) would mean here: nothing. This lane contains no
argument towards the target; it certifies properties of three controls and of one stage family. The requirement
flags are therefore all false by construction.

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity used essentially) | false | no attack; nothing here uses the Euler product (the zeta samples are numerical input) |
| R2 (height-uniform, every window) | false | finitely many squares at six heights; nothing uniform |
| R3 (fails for every control for a structural reason) | false | not applicable: the objects certified are themselves controls |
| R4 (reaches the critical line) | false | not applicable; no statement about zeta |

No requirement score is claimed. No statement about zeros of zeta is made: the only facts about zeta used or produced
are "H_0 has no zero in these squares" and the Arb enclosure of g1.

Note on the squares that meet the strip (tau = 0.25 second zero, tau = 0.15, tau = 0.1): they lie in
0.94 <= Re s <= 1.03 at heights Im s near 5.0e5, 8.5e10 and 5.0e9. The zero count 0 for H_0 there is implied by the
verified height of RH (all zeros below 3e12 are on the line); the run reproduces it and adds nothing.

## 8. Three weakest steps

1. One derivation. Lemmas T, S, Q-application and W, the code and the choice of parameters are by this lane; the
   in-lane referee pass (REFEREE.md) is by the same agent with a different numerical code path, not an independent
   referee. Lemma Q is quoted from memory (Trefethen-Weideman 2014, Theorem 5.1) with a proof sketch; the
   Poisson-summation step was not written in full.
2. Trust in Arb for zeta at large height. The samples are `acb.zeta` at Im s up to 8.5e10 (Riemann-Siegel inside
   Arb, with its own rigorous remainder). The certificate is exactly as reliable as that routine; the mpmath
   cross-check covers only tau = 1 (height 2.5e3) and tau = 0.25 (height 5e5). At x = 1.7e11 the 128-bit run loses
   about 36 bits to the size of the exponent (sample radius 1e-22); the 256-bit runs do not depend on this.
3. Scope of what is certified. Item A certifies zeros of the function (A0) of `b-escape-law`; the identification of
   (A0) with the map's "kernel e^{tau u^2/16} kappa, tau < 0" was not rechecked, and the escape law itself (Theorem
   A there, the statement Statement O line 4 leans on) is not touched: six certified zeros off the axis show that
   H_{-tau} violates the strip conclusion at those tau, not that zeros leave every strip. Item D certifies counts on
   the box 0 < Re z < 4 only (the half-plane Re z >= 4 is not covered), for a function N written by this lane from
   the code of the source lane, with exact digamma in place of the asymptotic series used there.

## 9. Files

- `heat_encl.py` (item A), `cfg_*_A.json`, `cfg_*_B.json`, `jobs.txt`, `run_all.sh`, `run_rest.sh`, outputs
  `out_<tag>_{A_p128,A_p256,B_p256}.json`; `table.py` prints the table of section 3.
- `ctrl_bc.py` (items B, C), outputs `out_bc_p128.json`, `out_bc_p256.json`.
- `stage_poles.py` (item D), outputs `out_stage_p128.json`, `out_stage_p256.json`;
  `out_stage_v1_delta1024_p128.json` is the first version (direct enclosures, delta = 2^-10; P = 13, 19 only).
- `referee_check.py`, `referee_*.json`; `REFEREE.md`; `lanes.jsonl` (one line); `logs/` (server logs of every unit).
- Server units (all started through `rhrun`; all finished or stopped by this lane; none left running): the 20 log files in `logs/` are named by unit. Stopped early by this lane: the first design (`rh-c20-heat-t1-p128-1120082924`), two mis-configured starts, `rh-c20-heat-all-1120083601` and `-1120084237` (superseded code; completed tags kept only from the final code), `rh-c20-stageD-p128-1120083857` (first version), three slow mpmath referee units.
