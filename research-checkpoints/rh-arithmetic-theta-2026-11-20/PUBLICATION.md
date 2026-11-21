# Public publication record

## Scope and status

This public checkpoint makes the arithmetic theta and twin-ladder research accessible from [Explore Riemann](https://exploreriemann.com/#/rh-arithmetic-theta-geometry). The geometric manuscript contains proved finite results and conditional arithmetic completion statements. It does not prove RH. Its review is internal and AI-assisted; its 20 exact checks are finite algebra checks, not a full external Lean replay.

## Provenance

The geometric continuation was first recorded in the historical MathExplorer repository at commit `2c628f61cdee35e3af7a2e23da43eaaf716fb8dd`, on branch `codex/rh-arithmetic-theta-completion-2026-11-20`. Access to that historical repository may be restricted. The public files here provide the actual proofs and checkers; historical links are not a prerequisite for reading them.

The PDF and editable TeX are preserved byte for byte. Their hashes are:

| File | SHA-256 |
|---|---|
| `geometric-compression/RH_Geometric_Compression.pdf` | `2e2dee16450610a920caf39344bb7d141c2bf7366950dc2632c4d8cdd2de527d` |
| `geometric-compression/RH_Geometric_Compression.tex` | See `geometric-compression/SHA256SUMS`. |

The public wrapper README uses project-facing language and links the earlier analytic manuscript. Its checksum is refreshed accordingly. The mathematical note, proof source, source audit and checker files retain their content from the historical continuation.

## Public analytic dependencies

- [Earlier 16-page conditional manuscript](release-v0.1/RH_Arithmetic_Theta_Completion.pdf), with [editable source](release-v0.1/RH_Arithmetic_Theta_Completion.tex): sparse Pick criterion and scalar Mellin–Landau endpoint.
- [Prime-ladder ramp and averaging note](twin-ladder-refinement/RAMP_AND_AVERAGING.md).
- [Geometric manuscript](geometric-compression/RH_Geometric_Compression.pdf), [frame proof](geometric-compression/FRAME_GEOMETRY.md), [lattice proof](geometric-compression/LATTICE_AND_TWIN_LADDER.md), and [source audit](geometric-compression/SOURCE_DEPENDENCY_AUDIT.md).

The external source comparison is pinned to `Deicyde/riemann-hypothesis@712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9`. Only citations and our independently written derivations are included; the third-party Lean tree is not redistributed. The unclosed `S76` supplier is an inspection boundary of this audit, not an assertion that the external repository lacks a proof.
