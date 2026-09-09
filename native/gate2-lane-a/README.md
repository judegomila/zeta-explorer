# Gate-2 Lane-A native evaluator (imp-95013b)

Native (clang -O3, pthreads, double-double) evaluator for the Gate-2
residual cocycle E97(x) of the frozen spec (`src/data/imp-95012-gate2-frozen-spec.js`,
paper eqs (10)-(11)), plus the imp-95011 oscillation-probe scanner for the
open family 690988 <= N <= 54799999.

## Status: BLOCKED-ON-CONVENTION (anchor gate not reproduced; x* resolved)

The mandatory anchor gate — reproduce `|E97|(N=690988) = 0.2141254901198318`
to <= 1e-9 relative before any scan output is trusted — **fails**, now with
the diagnosis sharpened to a single residual layer.

**x\* RESOLVED (2026-09-02 rev 2).** The anchor cell center is the
window-freeze "criterion start"
`x* := X + sqrt(1 - y0^2)`, X = 6000000185827
(local audit workspace `~/dbn-lambda-audit-review/WINDOW_FREEZE_THEOREM.md`,
"Site and endpoint coverage"). Validation: this evaluator reproduces that
theorem's 400-bit certified window margins digit-for-digit under the
audit-row parameterization (t = 129/800, y0^2 = 87677/2500000):
`x* - x_690988 = 5377393.98785643` (certified > 5377393.9878) and
`x_690989 - x* = 11989041.1746638` (certified > 11989041.1746). So the
site grid, landmark map, dd machinery, and x* are all beyond doubt.

**The residual gap.** |E97| evaluated AT the exact x* still misses
0.2141254901198318 by 49-96 percent under every tested convention
combination and under both row parameterizations:

- Gate-2 row (t0 = 24727519/2e8, y0 = 0.1809, x* = X + 0.98350149466078596):
  realGamma 0.0321779141165190 / 0.0138966350704802 (bb=1/0);
  chi(+,+pi/4) 0.0459446251234859 / 0.0282544257296109;
  chi(+,-pi/4) 0.1025333889745654 / 0.0917108547778853;
  chi(-,+pi/4) 0.0972877223445335 / 0.0799773334421578;
  chi(-,-pi/4) 0.0507766824636418 / 0.0411889420169782;
  samePhase 0.1081646523386882 / 0.0878107559836428;
  polymath(atX) 0.0705459658528420 / 0.0625452726582259;
  polymath(frozen) 0.0705459708497002 / 0.0625452768406508.
  Pilots (sum_j |D_j|) range 0.0520 - 0.1425.
- Audit row (t = 129/800, y0^2 = 87677/2500000, x* = X + 0.98230809830724698):
  realGamma 0.0285675189118675 / 0.0190311923373948;
  chi(+,+pi/4) 0.0197666032940615 / 0.0077802407063070;
  chi(+,-pi/4) 0.0783242949997991 / 0.0677667740233703;
  chi(-,+pi/4) 0.0451351004435043 / 0.0380843865220843;
  chi(-,-pi/4) 0.0479279819744724 / 0.0390167939169303;
  samePhase 0.0685352261420517 / 0.0557069381636419;
  polymath(atX) 0.0758802543680923 / 0.0669975421545769;
  polymath(frozen) 0.0758802621466442 / 0.0669975488049318.
  Pilots range 0.0272 - 0.0906.

**Where the producing convention lives.** The 0.2141254901198318 literal was
produced by the paper's reference [19] replay
(`strict_sub014_extension_v1/`, "included in the companion source archive").
That archive is NOT on this machine: Spotlight plus targeted greps of
`~/dbn-lambda-audit-review`, `~/dbn-lambda-sweep-clean`,
`~/dbn-lambda-01758354-candidate`, `~/Downloads/twin_ladder_rh_repo`, and
the candidate zips find the literal only in the paper PDF and this repo's
own modules (the audit workspaces contain NO E97 code; their `0.2141` grep
hits are digit-substring coincidences inside prism logs). The row check
requested by the coordinator: the anchor cell GEOMETRY is audit-row
(margins match t = 129/800 exactly), but the |E97| VALUE reproduces under
neither row, so row membership does not resolve the gap — the [19]
evaluator's ladder normalization / gamma weighting / exponent spelling
does.

Per the ticket protocol the scan was NOT run and no surrogate was
substituted; the `scan` mode hard-refuses until the gate passes (it now
tests the resolved x* by default).

### What was searched (all fail by >= 15 percent)

Convention degrees of freedom, exhaustively combined:

- b_n law: `exp((t0/4) ln^2 n)` (paper eq (10), matches `bt_eval` in every
  delivered C source) vs `exp(ln^2 n / 4)` (imp-95012 transcription).
  DECIDED: the t0 factor is required (without it |E97| ~ 1e13).
- carrier bracket: `c_n = b_n (n^-sB + gamma n^-sA)` vs
  `b_n n^-sB + gamma n^-sA`.
- gamma: real `gamma_at = exp(0.02y - (y/2)ln(x_N/4pi))` (delivered
  majorant); four chi-phase variants; the exact directed Polymath-15
  M-ratio `lambda = (x/4pi)^{-y/2} exp(i[pi/4 + x/2 - (x/2 + t*pi/8)ln(x/4pi)])`
  (derived in closed form; the s(s-1) prefactors cancel exactly; dropped
  corrections O(1/x) ~ 1e-13).
- ladder phases: `(x/2) ln n` (paper 4.6 reading) vs the exact
  Polymath-15 Theorem-1.3 phases `(x/2 + t*pi/8) ln n` — note
  `theta_n/2pi = frac((x/(4pi) + t/16) ln n)`, the same radicand as
  `compute_exact_N`, confirming the imp-95013 note that the landmark map
  fixes "sieve, phases, and window".
- frozen-at-landmark vs evaluated-at-x chart constants (sigma, gamma).
- t in {24727519/200000000 (Gate-2 row), 129/800 (audit row)}.
- x* candidates: X+1 (= x0, the open-edge start), X + t0 + sqrt(1-y0^2)
  (= X + alpha), X + sqrt(1-y0^2), X + sqrt(1-y0_audit^2),
  X + sqrt(1-2t0) (= X + beta), X, x_N(690988), window midpoint, X + 0.5.
- both the raw |E97| and the 25-defect pilot sum_j |D_j| (paper eq (13)).
- peak hunt: 25,200 dense samples over x in [X-54, X+450]: max |E97|
  observed 0.18603 (at x-X = -0.22); the target 0.2141254901198318 is
  never attained or crossed in that strip.

### Internal validations (the evaluator itself is consistent)

- `selftest`: dd_log/dd_sqrt against known double-double constants; the
  big-x phase reduction at x = 3.77e16, n = 54799999 agrees with an
  independent full-dd reference and with mpmath (60 dps) to ~6e-16;
  landmark(x_N) == N at 690988 / 3840000 / 54799999; coprime-97 mask.
- the eq-(13) 25-defect telescope identity `sum_j D_j = E97` holds to
  ~1e-14 in every evaluation (exact identity, strong algebra check).
- chart constants (x_N, sigma_B, sigma_A, gamma_at) match mpmath 50-digit
  references to full double precision.

### The unlock (sharpened)

x* is no longer the blocker. Commit the paper's [19] replay
(`strict_sub014_extension_v1/` from the companion source archive) or, at
minimum, its E97 evaluator conventions: the exact ladder normalization
(what the n = 1 terms of each ladder equal), the gamma weighting (directed
complex value vs gamma_at modulus, and which ladder carries it), the exact
complex exponent spellings sA(x)/sB(x), and the row (t, y) the anchor was
computed under. Then adjust `locked_conv()` / `eval_E97` to match, confirm
the gate passes at the default x*, and run
`./gate2 scan 1000 14 results.json`; feed the resulting L and sampledSup
to `probeVerdict` in `src/data/imp-95011-gate2-oscillation-probe.js`.

## Archive-free G3 lane (imp-95205): the anchor literal is NOT needed

The paper's own stop/go program (section 12.1, G3) attacks the complete
N = 690988 window FIRST with the source-closed evaluator and uses the
stronger pilot `sum_j |D_j| < Rex` as the go/no-go — no anchor replay
required. Modes:

```
./gate2 pilotg3 300001 10 out.json   # dense window pilot, both seam charts
./gate2 point W SIDE                 # full-precision single point (mp audit)
```

Result (2026-09-09, 300001-pt grid x 2 seam charts + top-32 zoom refinement,
612,290 dd evaluations, 714 s wall on 10 threads): sampled sup of the pilot
`sum_j |D_j|` = 0.2437541384450471 (w = 0.5245, chart 690988) and sampled
sup |E97| = 0.1934424506064475 (w = 0.0533, chart 690989), both < Rex =
0.2796881955526244. Telescope identity held to 8.02e-14 across every
evaluation; mpmath replay at 166/199/265 bits agrees with the dd lane to
<= 1.3e-16 on |E97| and <= 1.7e-14 on the pilot at three representative
points. SAMPLED sup only (the fastest ladder phase turns ~62x per grid
step): a measurement, not a certificate. Frozen record:
`src/data/imp-95205-g3-first-window-pilot.js`.

## Build and run

```
make            # clang -O3 -march=native, pthreads
./gate2 selftest
./gate2 anchor   # convention search table at N=690988
./gate2 anchor2  # directed complex-gamma variants + eq-(13) pilot
./gate2 hunt -1 30 0.02 1   # peak/crossing hunt near X
./gate2 scan 1000 14 results.json   # REFUSES until the anchor gate passes
./gate2 pilotg3 300001 10 out.json  # archive-free G3 first-window pilot
```

Memory: the full-family tables (dd ln n to 5.48e7 + SPF sieve) need
~1.1 GB transient, ~0.94 GB steady.

## Evaluation conventions implemented (from the delivered sources)

See the header docblock of `main.c` for the full extraction with line
references into `research-inputs/gate2-evaluator-inputs/`
(lemma_sweep_p235711.c gamma_at/sigma, verify_tail_arb.c sigma1/sigma2,
verify_uniform_error_01787854.c compute_exact_N, verify_window_freeze.py
half-open windows/seams). CAUTION #1 (t-coefficient spelling): resolved,
`4*pi*(N^2 - t0/16)` == `4*pi*N^2 - pi*t0/4` identically; we use the first
with t0 as an exact dd rational. CAUTION #2 (vecmax/bound_constants
normalization): the direct ladder's n=1 term is exactly 1 (leading-B
normalization) and gamma enters as the cross-chart ratio.

Measurement infrastructure only. Changes no bound. NO QED.
Platt-Trudgian Lambda <= 0.2 remains SOTA.
