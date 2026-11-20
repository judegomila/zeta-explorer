# Governed run and independent replay audit

## Pre-run correction

A static audit found that the first queued checker treated the scalar Ewald
cells as the full direct-source normalization.  The first supervisor was
stopped before it admitted any worker.  Its stop receipt records no straggler
or cleanup error, and no numerical output existed.

The corrected identities are

\[
 \sigma_0T^{\rm dir}=2T^{\rm Ew},\qquad
 R={4\pi T^{\rm Ew}\over E},\qquad
 e_1+e_2={E(\Delta-R)\over4\pi}.
\]

Seven focused tests pass, including a frozen-data regression showing that the
certified scalar cell sum overlaps `M_1` and is disjoint from `2 M_1`.

## Sampled-load run

The corrected queue used the shared sampled-load supervisor with

- a fixed 50% whole-Mac target;
- one active-worker maximum;
- three consecutive safe samples required before admission;
- one intended compute thread and background task policy;
- protected root `/Users/USER/Documents/GitHub/4ct/4ct-map`;
- command and cwd matching for the active chain, row, sweep, and cutproof
  processes.

The supervisor started worker PID `49795` only after the admission delay.
The worker completed with return code zero in `5.010848045349121` seconds.
The final supervisor sample was 30% whole-Mac busy.  The heartbeat still
classified 4CT as active.  There were no signal events, so no protected
process was paused, resumed, or terminated.

## Certified result

The atomic receipt has status `PASS_CERTIFIED_ACTUAL_KAPPA1_J2`, SHA-256

`97adc3bd11bd7aab66ec5cd7c2123f105c589e4a1c00a4f05ec6089870347d39`.

Its canonical pre-self hash is

`2b5ce755776ffdf6d0a145181aa77a6fb388a138563bc20c88407fc620ca746d`.

In particular,

\[
 \Delta-R\ge
 0.35160252495552413165569305419921875>0,
\]

and

\[
 e_1+e_2\ge
 0.1882129521999999652477697509311838075>0.
\]

The reconstructed-head interval overlaps the independently frozen scalar
Ewald head interval.  A second invocation reproduced every non-runtime field
of the receipt exactly; only measured CPU time and peak RSS changed.  The
stable-field projection of both receipts has SHA-256
`f533afe043cb963dcc2e19e844ea5b5cb5e206b6c98993792a50626aec9e9ef2`.
The complete replay receipt and path-sanitized supervisor artifacts are
preserved under `results/` and `evidence/`; `evidence/README.md` records the
hashes of the corresponding raw run files.

## Scope

This is one finite, actual-theta, first-rung certificate at cutoff `J=2`.
It is useful as a normalization and method check.  It does not control higher
degrees, prove a uniform Hardy-slack estimate, or imply RH.
