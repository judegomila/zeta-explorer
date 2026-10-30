# Complete prime-retained rank-one repair: independent audit

30 October 2026. **PASS. The finite reflection-even endpoint
`lambda=sqrt(33/2)` is independently cleared.** The new analytic lower bound,
producer full gate and isolated complete replay all pass. This is not an
odd-sector, cofinal-support or RH result.

## Complete independent result

The approved producer completed in 194.762 seconds. Its isolated replay
completed in 193.189 seconds, both at 1000-bit Arb, exact `X=33/2`, `N=2048`,
`J=16384`, and 72 far features.

| Required block | Dimension | Minimum positive LDL pivot | Minimum relative accuracy |
|---|---:|---:|---:|
| Repaired core | 2049 | `1.25343176232468965e-77` | 160 bits |
| Far coefficient H | 72 | `1.44798968511366122e-6` | 980 bits |
| Whitened Schur | 72 | `0.781429245035382871` | 163 bits |

Every pivot was tested strictly positive as an entire Arb ball. These are LDL
inertia diagnostics, **not** eigenvalue floors. Every non-timing receipt field
is identical, including the complete 2049-index pivot permutation.

## Why this certifies the actual finite even support

The independent inverse audit establishes, on the complete infinite even tail,

    D >= d+B,    B=P*I−P_tail >=0,
    D^(-1) <= d^(-1)−(2/25)d^(-1)B d^(-1).

The global near/far seminorm estimate includes all cross-band couplings. After
Young's inequality it yields the valid whole-head lower comparison

    A−Near−rF+(3/50)Y*B_nnY,
    r=1+(6/25)(2P*/d_far)=1.6583678812485898... .

Both H and its isotropic remainder are scaled by r. The rank-one term is a
proved lower bound on `(3/50)Y*B_nnY`, obtained from Cauchy–Schwarz using the
exact frozen head witness. It is not an artificial lift of the actual operator.
The historical constant-coordinate lift is removed, and the energy anchor is
zero. The complete positive repaired core and whitened Schur blocks prove
positivity of this entire finite comparison matrix. Together with the positive
entire-tail denominator and the actual Schur-complement theorem, this gives
the claimed actual reflection-even supported positivity.

No implication is drawn from the fixed-direction gate alone. Earlier failed
surrogates remain failed: the new result uses a genuinely different, justified
inverse estimate, not a changed interpretation of their receipts.

## Isolation and provenance

`replay_root/` contains byte-identical copies of all 19 source/input/proof
dependencies pinned by the approved small gate and full producer. It also
contains independent copies of all 115 python-flint package/runtime files.
The replay used those copies through its own `PYTHONPATH`, not the producer's
input builder or cached matrix. All 19 source files and all 115 runtime files
remain unchanged in **both** trees. The Python executable hash and version
match the preparation manifest. No prime-norm enumeration was repeated.

The full replay was authorized conditionally on producer PASS and was run
exactly once. The original failed-attempt manifest, accepted sources and
producer receipts were not modified. No remote or PR state was changed.

Producer receipt SHA-256:
`8fad3f81f08b714052715c368bd6480764f7448347494d36ec50f2d38067406c`.

Independent receipt SHA-256:
`774b0121e863088495d1867281824a69f37bd6bdc30a14ddddf6df2096c63dc1`.

The differing receipt hashes reflect timing fields only. The exact comparison
and runtime/source checks are reproducible with
`compare_complete_replay.py`; evidence is in
`COMPLETE_REPLAY_INDEPENDENT_AUDIT.json`, `REPLAY_PREPARATION.json`, and
`INDEPENDENT_FULL_REPLAY.log`.

## Independent analytic and implementation evidence

The accompanying inverse audit checks the closed-form domains, one-sided
even-tail decomposition, spectral inverse inequality, sign convention,
entire far charge, exact constants and shifted prime convolution. It includes
503 exact rational Cauchy-entry checks, 51 rational quadratic identities and
163 independent literal prime-translation entries. The separate rank-one
preflight checks fast forward/transpose actions and the displacement-rank-six
update, including coordinate zero, with exact rational synthetic tests.

See `../../near_tail_inverse_repair/PRIME_RETAINED_INVERSE_INDEPENDENT_AUDIT.md`
and `../RANKONE_PREFLIGHT_INDEPENDENT_AUDIT.md` for those proofs and limits.
Inherited gamma/prime/far-majorant results are used at the same exact support
with pinned, unchanged accepted sources; this audit did not claim a new prime
norm or a uniform-in-support theorem.
