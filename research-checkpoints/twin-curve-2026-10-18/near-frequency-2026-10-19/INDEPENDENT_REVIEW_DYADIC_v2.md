# Independent review receipt: near-frequency reduction v2

Reviewed 19 October 2026. The review is bound to the following exact source bytes:

- File: DYADIC_NEAR_FREQUENCY_REDUCTION_v2.md
- SHA256: 6014cccd3f2b0a6ddbca4ffcc31aca3da5f49bc904d00bc50e5b50795ece82d8
- Verdict: mathematical derivation passes; no correction required for validity.

An independent derivation from the exact Poisson covariance verifies the ordered-block factorization, the endpoint Cauchy bounds, the adjacent-block factor 1, the geometric far-block payment, and the cutoff- and carrier-independent constant C(x,R)=1+2/(1-R^(-x)). The factorization is a complex rank-one factorization followed by a real part; it does not assert rank one for the real covariance cross-block matrix.

Continuous log-offset averaging gives exactly the stated triangular weight. The diagonal and every mixed term are accounted for, the averaged local energy is nonnegative, and no favorable phase or covariance sign is assumed. Discrete dyadic offsets would not give the same exact logarithmic weight.

The full finite-rectangle condition (10) follows from monotonicity of the sharp two-moment clipping bound and the sufficient threshold V<4 Bstar(Bstar-a0), under Bstar>0 and a0<Bstar. The signed mean bound and all original analytic hypotheses remain separate requirements. Substituting the variance majorant into the preceding monotone square-refinement bounds is also valid.

The Q=3 example uses the actual stated prime coefficients and correctly proves only non-equivalence between an integrated allowance and the corresponding uniform endpoint allowance. The pointwise-exponent scale check retains the original critical threshold.

The artifact correctly states the scope: localization is a stronger sufficient replacement for the exact variance test and may lose cancellation. At fixed R its constant diverges as 2/(x log R) when x tends to zero; a bounded constant requires an expanding ratio window. No needed prime-pair estimate, signed mean estimate, effective onset, improved exponent, or all-height curve is proved.
