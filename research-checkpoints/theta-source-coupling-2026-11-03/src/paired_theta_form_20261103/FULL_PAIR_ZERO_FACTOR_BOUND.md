# A full-pair all-degree lower bound on the unconditional outer-shift domain

Date: 2026-11-03. Status: independent analytic audit PASS for the zero-factor identities, constants, convergence, domain, and strictness. This is AI-assisted review, not peer review or a machine-formalized proof. This uses the complete original paired form, not any fractional prime source. The global domain is |a|>=1/2; the interior-shift statement is only a finite spectral band. No RH or global interior positivity claim is made.

## 1. Normalization and zero-pair contribution

Let F(z)=2xi(1/2+iz), and

    w_a(t) = -Im(F'(t+ia) conjugate(F(t+ia)))/a,
    h_a[q] = integral_R q(t)^2 w_a(t) dt.

At a=0 use w_0=F'^2-FF''. Real entire evenness makes these quantities even in a and in t. Standard gamma decay makes the integral finite for every fixed real a and every finite real polynomial q.

The zeros of F lie in |Im z|<1/2. Its order-one canonical product can be paired under z -> -z, leaving a constant exponential factor because F is even. Alternatively, in the genus-one logarithmic derivative the real normalization constant contributes no imaginary part; conjugate regularization constants cancel in the imaginary part. Thus, away from zeros, the normalized density w_a/|F(t+ia)|^2 is obtained by summing the zero contributions below.

A real zero gamma of multiplicity m contributes

    m / [(t-gamma)^2+a^2].

A nonreal conjugate pair gamma +/- i delta contributes, per common multiplicity,

    2[(t-gamma)^2+a^2-delta^2] /
    {[(t-gamma)^2+(a-delta)^2][(t-gamma)^2+(a+delta)^2]}.

This is just the imaginary part of the two logarithmic-derivative terms, divided by -a. Its a=0 limit agrees with the corresponding real Laguerre pair. On compact sets away from zeros the paired sum converges normally, since the paired terms are O(|gamma|^-2) for fixed a,t and the zero count is O(T log T).

## 2. Independent all-degree positive inequality for |a|>=1/2

Every displayed summand is nonnegative when |a|>=1/2, because |delta|<1/2. There are no F zeros on those shifted horizontal lines.

Fix any positive real zero gamma_0 of F. Existence is unconditional by Hardy's theorem; no simplicity or numerical value is required. Retain the factors at +/-gamma_0 and discard the nonnegative contributions of all other zeros. Then

    w_a(t) >= |F(t+ia)|^2
       {1/[(t-gamma_0)^2+a^2]+1/[(t+gamma_0)^2+a^2]}
       >= 2|F(t+ia)|^2 / [t^2+gamma_0^2+a^2].

The last step is the elementary reciprocal-mean inequality. Therefore, for every nonzero real polynomial q of ANY degree or parity,

    h_a[q] >= 2 integral_R q(t)^2 |F(t+ia)|^2 /
                                  [t^2+gamma_0^2+a^2] dt > 0,
    |a|>=1/2.

This is a genuine independent positive lower bound on the full paired form. Its positive reference retains the full shifted theta transform, and its coefficient 2 is independent of degree. It proves all finite original Schur complements are positive in this stated domain. It does not transport them into |a|<1/2.

## 3. Sharper interior band from a finite verified zero height

Assume every F zero whose real coordinate has |gamma|<=T is real, where T>1/2. This is exactly a finite verified-height input for the corresponding zeta zeros, not RH.

For 0<=|a|<1/2 define

    B_a = T-sqrt(1/4-a^2).

If |t|<=B_a, any unverified nonreal pair has

    |t-gamma| >= sqrt(1/4-a^2),
    (t-gamma)^2+a^2-delta^2 > 0.

Consequently all pair contributions are nonnegative there, and the same pointwise rational lower bound of Section 2 holds in that band, by continuity at any real zeros when a=0. The formula with gamma_0 need not be evaluated as a singular quotient: the final rational lower bound is continuous.

For interior a the valid integrated statement is only

    h_a[q] >= 2 integral_(|t|<=B_a) q^2|F_a|^2/(t^2+gamma_0^2+a^2) dt
              + integral_(|t|>B_a) q^2 w_a dt.

The last integral is still signed and unbounded polynomial degree cannot be suppressed by a finite band. No estimate paying that complement is established.

## 4. Relation to the new finite-band preprint

Suvrit Sra's preprint arXiv:2611.02944v1, submitted 2 November 2026, states all-order generalized Laguerre positivity on |t|<=T-1/2 under verification to height T. Differentiating

    |F(t+ia)|^2 = sum_(j>=0) L_j[F](t) a^(2j)

gives w_a=sum_(j>=1) j L_j[F](t)a^(2j-2). This transfers that finite-band theorem to all shifts. The explicit conjugate-pair calculation above improves the band radius to B_a for nonzero interior a, without needing the full higher-order theorem.

This is not a claim of literature novelty, nor a full referee audit of that preprint. Its separate high finite PF-order result concerns reciprocal-law densities and does not supply the missing full-tail estimate here. See the inspection report at /workspace/shared/paired_theta_20261103/SRA_PREPRINT_TRANSFER_AUDIT.md.

## Sources

Primary/authoritative sources inspected:
- https://dlmf.nist.gov/25.10 (zeta zero strip and critical-line zeros).
- https://dlmf.nist.gov/25.4 (xi normalization and functional equation).
- https://arxiv.org/abs/2611.02944 and https://arxiv.org/html/2611.02944v1 (recent preprint and paired-zero finite-band argument).
- https://arxiv.org/abs/2004.09765 (Platt-Trudgian published finite-height verification, also used by the local verified-band notes; not recomputed here).

No live 4CT scripts were used and no external state was changed.
