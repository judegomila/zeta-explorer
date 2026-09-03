# Gate-2 Lane-A native evaluator (imp-95013b)

Native (clang -O3, pthreads, double-double) evaluator for the Gate-2
residual cocycle E97(x) of the frozen spec (`src/data/imp-95012-gate2-frozen-spec.js`,
paper eqs (10)-(11)), plus the imp-95011 oscillation-probe scanner for the
open family 690988 <= N <= 54799999.

## Status: BLOCKED-ON-CONVENTION (anchor gate not reproduced)

The mandatory anchor gate — reproduce `|E97|(N=690988) = 0.2141254901198318`
to <= 1e-9 relative before any scan output is trusted — **fails** for a
precisely diagnosed reason: the anchor cell is
`|x - x*| <= 1/40000000000` at N = 690988, and **the cell center x\* is not
transcribed** in the committed paper
(`research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf`,
Section 4.6, "the accompanying replay closes one positive-width cell"), in
the delivered evaluator inputs (`research-inputs/gate2-evaluator-inputs/`),
in the public sealed audit repo (`judegomila/dbn-lambda-01787854-candidate-audit`),
or anywhere in this repository. |E97(x)| oscillates on a Delta-x ~ 0.1
scale (phase (x/2) ln n), so without the exact x* no point evaluation can
match a 16-digit literal. Per the ticket protocol the scan was NOT run and
no surrogate was substituted; the `scan` mode hard-refuses until the gate
passes.

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

### The unlock

Commit ONE of: (a) the exact rational/dyadic x* of the N = 690988 anchor
cell (>= 13 decimal places), or (b) the replay evaluator that produced
0.2141254901198318 (its x*, gamma convention — directed complex vs
gamma_at — and phase spelling). Then set
`GATE2_ANCHOR_XSTAR_OFFSET=<x* - 6000000185827>`, adjust `locked_conv()`
if the matching convention differs from the baseline, re-run
`./gate2 scan 1000 14 results.json`, and feed the resulting L and
sampledSup to `probeVerdict` in `src/data/imp-95011-gate2-oscillation-probe.js`.

## Build and run

```
make            # clang -O3 -march=native, pthreads
./gate2 selftest
./gate2 anchor   # convention search table at N=690988
./gate2 anchor2  # directed complex-gamma variants + eq-(13) pilot
./gate2 hunt -1 30 0.02 1   # peak/crossing hunt near X
./gate2 scan 1000 14 results.json   # REFUSES until the anchor gate passes
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
