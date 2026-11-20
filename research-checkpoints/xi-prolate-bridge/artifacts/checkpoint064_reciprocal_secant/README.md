# Checkpoint 0.64 reciprocal-secant point diagnostic

Status: `P0_INVALIDATED`. These files are finite arbitrary-precision point
diagnostics at the single locked point `lambda=2`, `N=4`, `T=1`. They are not
interval enclosures, an asymptotic result, a determinant-convergence result,
or evidence of a proof of RH.

The producer reconstructs the exact finite Weil blocks through
`blocks_direct`, the source-normalized prolate anchor in a fixed 30-mode
Legendre Galerkin space, the limiting arithmetic anchor by direct
`x`-quadrature of its convergent sum, and `K_T` by direct evaluation-vector
quadrature. The verifier imports no checkpoint-0.64 producer code: it uses
`verifier/independent_replay.py`, exchanges the arithmetic sum and integral
to obtain incomplete-gamma segment integrals, and assembles `K_T` from the
closed Si/Ci path.

Both paths retain every prime power `1<n<=lambda^2` (here `2,3,4`), the minus
sign on the prime block from source equation (3.19), the negative-sign
Fourier kernel, reflection as inversion, and the source-limit normalization.
The source lock, normalization audit, and both vendor PDFs are checked
against immutable SHA-256 constants in both programs.

Selected 80-digit point values are:

- `r = 5.2902271331806892721323218727314160436868e-5`
- `beta = 0.011716556029019030080601313946621596554`
- `epsilon = 0.00036458026222890509378650667419085074184`
- `c2 = 0.12875486632278846604923770123019041301`
- `r/epsilon = 0.14510459509898457358434033437694171026`
- `L^(3/2) r/epsilon = 0.23684507084369121375478143414847900352`
- `S = 0.078795117285484963976866055759945561185`
- `H0 = 4499.9036000476513009075299580709166212`
- `r H0 = 0.23805512121669549311141987458537096173`
- one-vector lower bound `= 0.016315472686734896099069831779701219637`
- tilted remainder `= 0.062479644598750067877796223980244341548`
- reciprocal crowding reserve `= 4.8294719251099853729690131482014769851`

The 40- and 80-digit independent replays have maximum scaled disagreements
`7.8712787933e-37` and `4.1312477075e-77`, respectively. Producer and verifier
share mpmath transcendental arithmetic and `eigsy`; this is an explicitly
recorded independence limitation.

The fixed 30-mode prolate Galerkin truncation has no tail enclosure. The two
assemblies check the same finite subspace and do not establish convergence
to the exact prolate eigenfunctions. Likewise, the serialized Gaussian-tail
bound expressions are nondirected mpmath point values, not outward-rounded
upper endpoints.

Files:

- `lambda2_N4_T1_dps40_producer.json`
- `lambda2_N4_T1_dps40_replay.json`
- `lambda2_N4_T1_dps80_producer.json`
- `lambda2_N4_T1_dps80_replay.json`
- `SHA256SUMS`

Rebuild with the producer and verifier commands documented by their
`--help` output, then run
`python3 -m unittest discover -s tests -p 'test_checkpoint064_reciprocal_secant.py' -v`.
