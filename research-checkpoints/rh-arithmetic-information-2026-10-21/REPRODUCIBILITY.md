# Reproducibility index and explicit omissions

## Included, self-contained checks

Run from this checkpoint directory using Python 3:

```sh
python3 checks/check_scalar_defect.py
python3 checks/check_block_identities.py
python3 -m unittest discover -s checks -p 'test_*.py' -v
python3 checks/verify_manifest.py
```

No third-party packages are required. The scalar checker uses exact rational arithmetic, outward decimal rounding, convergent-series remainder bounds, and the elementary enclosure `H_N-log N-1/N < EulerGamma < H_N-log N`, with `N=10000`. It verifies the two canonical row defects at two small radii. The block checker performs 1,119 exact-rational checks of windowed hinges, the compact B-spline kernel, endpoints, mass, and discrete reconstruction using synthetic event locations and masses, not primes. The unit tests check finite exact-algebra analogues of the weighted-network identity, the pole/variance signs, Gaussian invariant covariance, and short-time sharpness. These are regression checks of the displayed identities, not formal proofs of the continuum theorems or a replay of the full Weil certificate.

`SHA256SUMS` binds the included files except itself. `checks/verify_manifest.py` fails on a missing, modified, unsafe, duplicate, or unlisted file, ignoring Python cache files only.

## Large fixed-support proof package: identified but not included

The independently replayed `L=6/5` computation belongs to the frozen package identified as `frozen_l1200_complete_20261021_1902`. It is approximately 1.1 GB on disk, with 117 files including its manifest. This commit deliberately does not copy that large package.

`provenance/frozen_l1200_inventory.sha256` is the original relative-path SHA-256 inventory, not the corresponding file contents. `provenance/source_index.json` binds that inventory and selected research-source documents by content hash and byte length. These identifiers support provenance; they do not make omitted inputs available or prove their mathematical claims. The inventory includes computational replay filenames but no replay report text is copied into this checkpoint.

In particular, this checkpoint does **not** include the complete Fourier coupling exports, exact rational caches, interval matrices, kernel features, inverse proposal, complete original/independent residual archives, or all dependency scripts. Repository contents added by this commit alone cannot replay `Q_(6/5)>=10^-55 I` or the shifted-xi transfer. There is no claimed downloadable artifact location for the omitted bundle in this checkpoint. A full reproducibility release would need to supply those files and a self-contained replay environment separately.

The original package records Python 3.12.14, NumPy 2.3.5, SciPy 1.17.0, mpmath 1.3.0, SymPy 1.14.0, and python-flint 0.9.0. Original Fourier export used two disjoint workers; the independent reference was serial. All shared coupling fields matched exactly, despite different archive metadata. The 160-pivot final test and thin-shift scalar calculation were separately replayed within this research effort. Those completed research runs are distinct from the small fresh checks for this commit.

Selected immutable output identifiers:

- Arbitrary inverse proposal: `ad837083f4eb6ca3d337e709c33982f50b48b3f47253bd83ab832d036e029c70`.
- Original residual correction: `b36931165d86e6aff900441627880e663c70efd5d1e0cc9e987d82ccdbce9f2a`.
- Independent residual correction: `2f6b980f54da652fa3d70069aaf607d3513a85c3109b4e20ed10180291e2bd2b`.

## Other results

The periodic/adaptive interval results and `L=5/4` comparison diagnostics are summarized with their exact scope and selected source hashes, but their full numerical suppliers are not included. Analytic notes explain the reductions and reference their classical ingredients; no machine-proof verification of those arguments is claimed. Vortex/deformation claims were checked against source mathematics; incomplete recovered archive data do not establish a full replay, and deployed application behavior was not verified.

This is a curated research ledger with small reproducible checks, not a full archival release of every computation.
