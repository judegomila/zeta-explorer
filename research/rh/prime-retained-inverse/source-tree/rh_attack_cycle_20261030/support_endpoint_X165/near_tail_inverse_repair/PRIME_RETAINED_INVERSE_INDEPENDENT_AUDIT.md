# Prime-retained inverse repair: independent audit

30 October 2026. **PASS for the operator lemma and bounded implementation checks.**
No mathematical, sign, convolution, or near/far-coupling failure was found.
The pinned producer's fixed-direction quadratic lower bound is
`+1.8312465108615856e-76`, versus the old surrogate's `-3.9398212031312674e-77`.
This audit did **not** rerun the complete directional producer, reconstruct the
full repaired matrix, or accept a new support endpoint. There is no RH result.

## 1. Correct lower operator and domains

Work on the reflection-even tail `j>N=2048`, at `W=log(33/2)`. Let `P` denote
the actual selfadjoint prime translation operator, not its negative matrix in
the Weil form. The direct source `FULL_TAIL_COERCIVITY.md`, sections 1–5, gives
on the complete logarithmic form domain

    D = diag(a_j) + E_tail + 2|c_tail><c_tail| − K_tail − P_tail,
    E_tail >= −Gamma I,       K_tail <= (H_K/N) I.

The odd negative pole vanishes exactly; the positive even pole may be discarded
only in the lower direction. Consequently, with the unchanged rational norm
envelope `P*=477513/125000`,

    d_j = a_j − Gamma − H_K/N − P*,
    B = P* I − P_tail,
    D >= d+B,        0 <= B <= 2P* I.

This uses selfadjointness and `||P_tail||<=||P||<=P*`; it does **not** assume P
is positive semidefinite. The compressed-kernel penalty remains `H_K/N`, not
`H_K/J`. Monotonicity of the archimedean symbol gives `d>=d_min I>0` on the
entire tail and `d>=d_far I` after `J=16384`.

The common closed-form domain and bounded B justify the resolvent identity
and inverse order even though d and D are unbounded. Specifically
`T=d^(-1/2) B d^(-1/2)` is a bounded PSD operator with
`||T||<=R=2P*/d_min`. For `0<=t<=R` and `0<=c<=1/(1+R)`,

    1/(1+t) <= 1−ct,
    D^(-1) <= (d+B)^(-1) <= d^(-1)−c d^(-1)B d^(-1).

The receipt has `d_min/(d_min+2P*)=0.0846036249190816...>2/25`; c is admissible.
The head-to-tail coupling is bounded: the diagonal symbol has no cross block
and all remaining operator terms are bounded. Thus every finite head vector
has a valid tail vector `z=d^(-1) K_cpl v` in this inequality.

## 2. All cross-band terms are included

Split `z=z_n+z_f`, retaining the complete near band `N<j<=J`. Set

    E = <z_n,B z_n>,
    F(v) = v*F_mat v = old far-H charge + remainder,
    G = (2P*/d_far) F(v).

The accepted far majorant bounds the actual diagonal far charge, so

    ||z_f||^2 <= F(v)/d_far,       <z_f,Bz_f> <= G.

The reverse triangle inequality for the B-seminorm therefore gives

    <z,Bz> >= (sqrt(E)−sqrt(G))_+^2.

No near/far prime block was deleted. The producer checks `E>G` before dropping
the positive-part symbol for its one direction. For every head vector,
Cauchy–Schwarz followed by Young gives, with `epsilon=1/4`,

    <z,Bz> >= (3/4)E − 3G,
    c<z,Bz> >= (3/50)E − (6/25)G.

This bound remains valid when its right side is negative; no directional
condition `E>G` is needed for the global quadratic inequality. With
`Y=d_n^(-1)K_n` and `B_nn` the near compression, the resulting whole-head
**lower comparison matrix** is

    M_new = A − K_n* d_n^(-1) K_n
              − [1 + (6/25)(2P*/d_far)] F_mat
              + (3/50) Y*B_nn Y.

The far multiplier is `1.6583678812485898...`, not 1; including it is essential.
Validity of this matrix lower bound is not positivity of that matrix.

## 3. Signs and convolution

The producer's coupling array omits the factor `(-1)^j`; its x array is
therefore the diagonal unitary sign transform of z_n. The same transform is
removed from the prime matrix. If `b_j^P=sum w_n sin(t_j log n)/pi`, the
transformed **negative** prime matrix has diagonal
`-2 sum w_n(1-log n/W)cos(t_j log n)+b_j^P/j` and off-diagonal
`2(j b_j^P-k b_k^P)/(j^2-k^2)`. Accordingly
`E=P*||x||^2+qprime(x)` has the correct plus sign.

For `j=a+i`, the implemented action follows exactly from

    1/(j^2-k^2) = [1/(j-k)+1/(j+k)]/(2j).

The forward/reversed polynomial products supply the two signs of `1/(j-k)`;
the reversed sum-kernel convolution supplies `1/(j+k)`, and the explicit
`x_i/(2j)` subtraction removes its otherwise included diagonal. Pairing the
two ordered off-diagonal contributions yields the factor 4 in the quadratic.

The independent `audit_prime_retained_inverse.py` executes only the three
extracted producer function definitions, never its top-level calculation.
At 512 bits it passed:

* 503 exact-Fraction Cauchy-entry identities, including unit vectors and signed
  vectors at starting indices 1, 2049, 4093 and 16380;
* 503 comparisons of Arb action endpoints with the exact rational answers;
* 51 exact-Fraction quadratic identities with arbitrary signed rational
  generator/diagonal data;
* 163 prime entries against independent integrals over the actual two
  zero-extension translation overlaps, including shifted near-tail blocks.

The audit harness initially used `Arb.contains(fmpq)`, which can demand
containment of a wider rounded conversion ball. This false test failure was
repaired by comparing exact dyadic lower/upper endpoints with the exact
rational; it was not a producer or mathematical failure.

## 4. Provenance and remaining work

Every current producer source hash matches its before/after receipt. All nine
overlapping inputs also match the historical terminal manifest. The audit
separately pins the direct tail-domain/decomposition source, which the producer
only cites through secondary pinned notes. Receipt-level scalar identities
and positive reported margins were independently checked; all 2049 frozen
coordinates and 14336 near rows were **not** replayed by this audit.

The rank-one implementation interface is valid: if `y0=Yv0`,
`E0=<y0,B_nn y0>>0` and `e=Y*B_nn y0`, then
`Y*B_nnY >= ee*/E0` by B-seminorm Cauchy–Schwarz. A future certificate must
enclose these exact quantities and certify the complete resulting matrix;
the one repaired direction cannot substitute for that full-head gate.

No old accepted artifact was edited, no producer/full prime-norm enumeration
was rerun, and no remote or PR state was changed. Machine-readable evidence:
`PRIME_RETAINED_INVERSE_INDEPENDENT_AUDIT.json`.
