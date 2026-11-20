# Finite actual-theta parent-angle certificate

Date: 2026-11-04 UTC.

Evidence grade: SHA-bound finite interval diagnostic with a 384-bit primary
and 640-bit replay.  The two runs use the same implementation at different
precisions; this is precision replay, not an independent recomputation of the
archived theta quadrature.

## Definitions

For odd `n<=19`, let `T_n` and `T_(n+1)` be the physical monic polynomials
reconstructed from the archived actual complete-theta moment boxes.  Put

\[
 q_n=T'_{n+1}-(n+1)T_n.
\]

In the certified positive half-first-moment parent metric `P`, define

\[
 B_n={(T_n,PT_n)\over\sigma_n},\qquad
 L_n={(q_n,Pq_n)\over\sigma_n},\qquad
 X_n={(T_n,Pq_n)\over\sigma_n}.
\]

The calculation retains the archived scaled parent basis.  Physical
polynomial coefficients are transformed into that basis, and the certified
endpoint surplus supplies `sigma_n` in the same top-normalized coordinates.
All stored moment and parent intervals receive conservative rational decimal
padding before Arb evaluation.

## Strict finite result

Both precisions certify the same signs:

| odd `n` | certified `X_n` conclusion | 384-bit enclosure (rounded display) |
|---:|---|---:|
| 1 | exactly zero | `0` |
| 3 | negative | about `-0.087278000` |
| 5 | positive | about `0.720531260` |
| 7 | positive | about `2.592470451` |
| 9 | positive | `[3.7708790349, 3.7708790354]` |
| 11 | positive | `[9.141426394, 9.141426659]` |
| 13 | positive | `[8.5877823, 8.5881164]` |
| 15 | positive | `[13.5447, 15.4133]` |
| 17 | unresolved | approximately `[-3098.44, 3132.94]` |
| 19 | unresolved | approximately `[-6.64e6, 6.64e6]` |

The high-degree unresolved intervals reflect dependency amplification in the
archived input boxes.  They do **not** certify that `X_17` or `X_19` is zero,
negative, or unusually large.  Increasing arithmetic precision from 384 to
640 bits leaves the sign classification unchanged, showing that input width
and conditioning, not floating precision, are the present limitation.

The runs also certify `B_n,L_n>0` through odd degree 13 and the displayed
angle interval strictly inside `(-1,1)` through degree 11.  Wider direct
interval propagation at later degrees is not a violation of exact Cauchy.

## Interpretation

The degree-three negative sign rules out a universal positive-angle claim
starting at every nontrivial rung.  The strict positive sequence from 5
through 15 is useful evidence for an eventual theta-specific localization
lemma, including the fixed Green-kernel criterion developed in the companion
source-channel checkpoint.  It is still finite evidence only.

No conclusion here establishes a uniform all-degree lower bound for `X_n`,
the finite-head comparison, the next pivot, an Xi-Laguerre inequality, or RH.

## Resource and protection audit

The successful primary and replay were admitted by the fixed 50% sampled
whole-Mac governor after sustained headroom.  Observed heartbeat samples were
40--43% busy during the successful window.  The governor had a one-worker
cap and detected the protected chain19, csweep, contract-guided, and
antichain processes throughout.  It sent no signal to and made no edit in the
4CT workspace.  As documented by the governor itself, sampled admission is
not a kernel-enforced instantaneous CPU ceiling.
