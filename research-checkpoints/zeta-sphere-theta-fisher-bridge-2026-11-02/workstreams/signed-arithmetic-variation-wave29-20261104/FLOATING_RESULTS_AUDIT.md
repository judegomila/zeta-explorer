# Floating results audit

The fixed-50% sampled governor completed the primary, higher-resolution
replay, and comparison with return code zero. The protected 4CT chain stayed
active; the governor sent it no signal and edited no 4CT file.

## Frozen receipts

| file | SHA-256 |
|---|---|
| `results/signed_variation_primary.json` | `0298631fa73d498817977d7dd6b27ee29d311776943a845d7ebcdfa84320bb8c` |
| `results/signed_variation_replay.json` | `b030626e24463d9588a24312a3ac078c6209c86386face639a3cb26ffd3d6cf7` |
| `results/signed_variation_resolution_audit.json` | `fa767e705638a12885703db2cb56852d55ef3a271738308cb5e6a8d3a617f252` |

All embedded receipt payload hashes recompute exactly. The comparison receipt
binds the first two file hashes and reports a maximum relative discrepancy
below `3.6e-14` across the direct, Laplace, Abel, and common-scale Stieltjes
representations.

## Mechanism diagnostic

- Degree three: `X_3=-0.0872779998125...`; the Abel target is about
  `-4.02470803423`. Cell `[1,2]` contributes about `-4.03121783831`, while
  all later sampled cells recover only about `+0.00650980408`.
- Degree five: `X_5=0.720531260372...`; the Abel target is about
  `93257.1040246`. Cell `[1,2]` contributes about `94083.9200421` and pays
  the later adverse packet of about `-826.8160175`.
- Both degrees have positive and negative sampled nodes of `Z_n'`.
  Pointwise monotonicity is therefore falsified on these actual rungs.
- The endpoint-minus-absolute-variation proxies are negative at both rungs,
  including the strongly positive degree-five target. The useful information
  is signed placement/correlation, not total-variation magnitude.

These receipts use floating quadrature and one implementation at two
resolutions. They are mechanism diagnostics, not interval certificates, and
prove no uniform angle bound, direct-head sign, next pivot, or RH statement.
