# Frozen modest extension: X=10000000, same floor and same block proof

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

The exact same pinned checker (`../certify_coarse_reserve.py`, SHA256 `e9e83a7c0727b667459090d22db8774381edacb8dae2cbefc768f5bf9420762b`) passes at 192 and 256 bits with `--limit 10000000` and the unchanged predetermined floor 1/100. Consequently the block-prefix hull proof establishes

\[
 \Psi(r)>1/100\qquad(\log2\le r\le\log10000000).
\]

The separate origin supplement covers 0<=r<=log2, with Psi(0)=0 and a linear lower bound near 0, rather than incorrectly asserting a positive constant at the origin.

Exact-accounting details:

- 665,134 distinct prime-power events, using 664,579 primes.
- Last event 9,999,991.
- 2,732 accepted blocks; 2,733 distinct endpoint reserve values; 2,865 intersection evaluations including rejected parent blocks.
- The same 133 initial blocks require splitting; no additional parent block fails later.
- Lowest accepted block lower bound remains 0.0104853603880709749...; this is not an assertion about the actual minimum reserve.
- Final R is 0.0379442133347272172..., with a full outward enclosure in each receipt.
- Exact event digest: `4c24e9f9cdf8411292143f0e81281da86dabcf08ad0c20c6064bcdffd3da06c1`.
- Observed runtime approximately 2.4 seconds per precision in this environment. No benchmark or optimality claim.

The all-future **positive convexity-debt** bound at the final state is below 0.015110. The separately proved all-future prime-credit block-freezing representation error is below 0.682236. Neither controls the retained future signed block credits. A favorable final reserve minus debt is not an all-future positivity proof, since the infinite signed supply is still missing.

All arithmetic event weights remain accounted; no prime table, float scan, or assumed zero-height verification is imported. This is a finite constant-box/scalar extension only. No whole-even support endpoint changes, and no RH, largest-known-range, or novelty claim is made.

The bundled finite-certificate review accepts this extension and records the independent checks.
