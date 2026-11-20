# Prime-square refinement: reviewed additive checkpoint

18 October 2026. Two internally reviewed mathematical notes and their independent review are preserved byte-for-byte below. This is an additive refinement of the parent checkpoint; it proves no global zero-free curve, no improved height exponent, and no RH result. It has not undergone external peer review or Lean verification.

## Verified result

Separating the prime-square modes leaves a j>=3 logarithmic remainder bounded uniformly in cutoff and height for every s0>=1/2 by C3(s0), with C3(1/2)=5(1+sqrt(2))/6. The joint prime/square Poisson variance retains every mixed term and every square of a prime p<=Q, including p^2>Q.

For s0>1/2, paying the square modes absolutely after separating them also gives a strictly smaller deterministic allowance than the earlier geometric bound. At s0=.834 the old and new allowances are approximately1.431426 and0.940940. Exact formulas prove the improvement; decimal values are illustrative, not interval certificates.

## What remains open

The actual joint signed mean and covariance still need to meet the full finite-rectangle budget. Separating square modes changes neither the residual nor its zeta(s+h) denominator. Denominator clearance, left/right/horizontal boundary estimates, effective onset, and every-carrier coverage remain required. Moving s0 or h requires fresh verification of the analytic inputs. In particular s0=1/2,h=1/8 does not obtain denominator clearance from a baseline near7/8.

## Evidence

- [Joint prime-square criterion](PRIME_SQUARE_JOINT_POISSON_REVIEW_v1.md)
- [Absolute-constant improvement](ABSOLUTE_SPLIT_CONSTANT_COROLLARY_v1.md)
- [Independent mathematical review](INDEPENDENT_REVIEW_PRIME_SQUARE_v1.md)

The frozen notes' statements that no publication or external modification had occurred describe their preparation/review time. They are retained unchanged to preserve exact source hashes; this directory is their authorized subsequent publication in draft PR12.

verification-receipt.json binds all three frozen files and records copy verification. SHA256SUMS covers this release. The previous checkpoint files are preserved unchanged. No merge or deployment is part of this addition.
