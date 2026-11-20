# Independently accepted actual reflection-even endpoint: sqrt(33/2)

30 October 2026, 18:20 UTC. **Complete producer PASS, independent analytic and
source audit PASS, and isolated complete replay PASS.**

The actual supported reflection-even Weil form is coercively positive at
lambda=sqrt(33/2), and on smaller supports by exact support nesting. This
extends the independently accepted finite even endpoint from sqrt(161/10).
It proves neither odd-sector positivity nor a cofinal-support theorem nor RH.
No numerical pivot is asserted to be an eigenvalue floor.

## What changed

The old diagonal-inverse comparison at the same exact support failed, and its
exact rational negative witness remains valid evidence about that old
comparison. The new proof retains actual prime-tail stiffness:

    D >= d+B,       B=P*I−P_tail >=0,
    D^−1 <= d^−1−(2/25)d^−1 B d^−1.

A fixed Young inequality pays every near/far cross term. A PSD-seminorm
Cauchy–Schwarz inequality safely retains one positive rank-one term from the
resulting head Gram. This produces a complete rank-six structured lower
comparison; it is not an unproved block truncation or a numerical adjustment.
The far-H matrix **and** isotropic remainder are both multiplied by the
required factor1.6583678812485898....

Support X=33/2, N=2048, J=16384, L=36, precision1000 bits and the already
certified eighth-power prime envelope477513/125000 are unchanged. No new
prime-power sweep or support search was used.

## Verified complete gates

| Gate | Producer and independent replay |
|---|---|
| Corrected actual head core | 2049 strictly positive pivots |
| Last/minimum core pivot | 1.25343176232468965e−77;160 relative-accuracy bits |
| Far coefficient H | 72 strictly positive pivots |
| Whitened Schur block | 72 strictly positive pivots |
| Minimum whitened pivot | 0.78142924503538287 |
| Mathematical receipt/permutation comparison | All non-timing fields identical |
| Source integrity | All19 source files unchanged in both trees |
| Isolated runtime integrity | All115 copied runtime files unchanged |

Producer time194.762s; isolated replay time193.189s. The 33-mode dense
preflight also passed, including every direct/generator entry and permuted
pivot comparison. The independent exact-rational checks covered the fast
Cauchy action, forward coupling, prime action, transposed coupling, witness
identity and rank-one generator identity.

The actual infinite tail already has a positive uniform floor. The complete
finite lower Schur matrix is now positive definite. Bounded head/tail
coupling and the block triangular factorization therefore yield a positive
whole-even coercivity constant. No explicit numerical value of that constant
is extracted here.

## Evidence and replay

- Proof and implementation specification:
  `../near_tail_inverse_repair/COUPLED_PRIME_RETAINED_INVERSE_AND_RANK_ONE_SPEC.md`
- Independent inverse audit:
  `../near_tail_inverse_repair/PRIME_RETAINED_INVERSE_INDEPENDENT_AUDIT.md`
- Independent implementation preflight:
  `RANKONE_PREFLIGHT_INDEPENDENT_AUDIT.md` and `.json`
- Complete producer:
  `PRIME_RETAINED_RANKONE_FULL_GATE.json`
- Complete isolated replay comparison:
  `independent_review/COMPLETE_REPLAY_INDEPENDENT_AUDIT.json`
- Final independent acceptance audit:
  `independent_review/COMPLETE_PRIME_RETAINED_RANKONE_AUDIT.md`

Run from the workspace root with python-flint0.9.0:

    PYTHONPATH=.rh_python_deps python \
      rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/certify_prime_retained_rankone.py --full

The previous failed attempt is not overwritten. Its terminal manifest remains
SHA256 `ac80ae840bc9fb057bc5858c8473aa30b82bb3a0be5693499512d5cb30e8980c`.
This accepted result and the failed historical comparison are consistent.
Everything in this continuation is local; no remote, PR, merge or deployment
state was changed.
