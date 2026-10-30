# Rank-one full-gate preflight: independent clearance

30 October 2026. **PASS for analytic/source clearance and the pinned small
preflight.** No implementation blocker was found. This permits evaluation of
the parent-authorized complete finite gate; it is not endpoint acceptance.

The independent inverse audit already proves the lower comparison
`A−Near−rF+(3/50)Y*B_nnY`. PSD-seminorm Cauchy–Schwarz gives
`Y*B_nnY >= ee*/E0`, with `e=Y*B_nnYv0`, `E0=v0*Y*B_nnYv0>0`.
Thus `u=sqrt((3/50)/E0)e` is a valid positive rank-one replacement.

The new builder was reviewed line by line:

* Zero-padded convolution computes every near row of Yv0, retaining the
  separate constant-coordinate term `v0/j^2`.
* The B action has the correct sign for the actual negative-prime matrix.
* The transposed action has the correct denominator sign and separately
  computes coordinate zero. The sign-removed near basis is used consistently.
* The quantities e and E0 are fresh Arb enclosures, not midpoint substitutes.
* Both coefficient H and isotropic remainder rem are multiplied by r.
* Appending `g_i=x_i u_i`, `h_i=u_i` produces `+u_i u_j`; the diagonal gets
  `+u_i^2`. The existing eliminator iterates over the actual number of wedge
  pairs and supports displacement rank six.
* The historical constant-coordinate lift is removed exactly as before.
  `rank_one_lift:false` refers to that lift, not to the genuine new correction.

The 33-mode small receipt is a PASS for its complete core, 72-dimensional H
and 72-dimensional whitened Schur block. Every current source matches its
before/after pins. Direct dense-versus-generator entries and permuted core
pivots overlap. The small preflight was produced by the producer, not rerun by
this auditor.

The separate exact-rational synthetic audit independently checked four
dimensions: 42 forward rows, 42 B-action rows, 31 transposed columns, all
`e*v0=E0` identities, and all rank-one wedge identities. It evaluates only the
new Cauchy function and rational synthetic data, not the full input builder.
See `audit_rankone_preflight.py` and `RANKONE_PREFLIGHT_INDEPENDENT_AUDIT.json`.

Cleared hashes:

* Builder: `238b04e13d65e214d827c1d7b53cd976985e5f4d4275d3d444a248a84c24fc50`.
* Driver: `7a5725e4522317c5993326b494fc81d4ee188716ef822e489adb670e4d937c61`.
* Small receipt: `f33d1a1f393fde16ebad2edd4aa32919414b49350641da5158190385162ac385`.

The full producer and an isolated independent complete replay remain the
required acceptance gates. No odd-sector, cofinal-support, or RH statement
follows from a finite even-sector PASS.
