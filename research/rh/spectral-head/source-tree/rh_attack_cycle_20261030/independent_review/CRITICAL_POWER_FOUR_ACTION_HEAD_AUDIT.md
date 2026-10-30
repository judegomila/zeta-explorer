# Independent audit: critical power-four/log-tuned actual-action head

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **PASS.** Producer `weil_radical_tail_attack/CRITICAL_POWER_FOUR_LOG_TUNED_ACTUAL_ACTION_HEAD.md`, SHA256 `44599cd2bc804f2387d009506f70ac957ad4643ff45017b00ce9862dc4cf00a1`. No producer repair or numerical spectral run.

## Accepted conclusion

For each fixed r>0, put w=1+log(lambda), a_lambda=lambda^-4 w^-(3+2r). Let G_lambda consist of the actual positive-even prolate modes with 1-chi_n^2<=a_lambda, intersect mean zero; let F_lambda=S E_raw G_lambda be their literal physical image. Eventually,

    ||H_lambda F|| <= C w^-r ||F||, F in F_lambda,

with full supported operator-domain membership and no source trace deletions. The onset is unspecified. At r=2 the actual residual is O(w^-2), with cutoff lambda^-4 w^-7.

This is a full ACTUAL Weil-action estimate, not a coordinate-pairing estimate. Its proof explicitly reopens the relevant uniform bounds in the already accepted trace-repair proof. It does not substitute a varying A into a theorem proved only for fixed A.

## 1. Uniformity checked with one fixed deep split

For all lambda^-5<=a<=lambda^-3, use b=lambda^-11. The endpoint action-strip and logarithmic leakage theorems are invoked only at the SINGLE fixed exponent 11. Their onset/constants are therefore uniform in the later choice of a.

On b<=delta<=a, the cumulative KRD moment and endpoint gain give

    sum b_n^2(nu_n-nu_ref)^2 <= C lambda c^2 a log^3(10/a)
                              <= C lambda c^2 a w^3.

The factor beta=O(log c) cancels against the leakage denominator log c. Uniformly on the whole displayed a-range, log(10/a) is comparable to w. On delta<b, the global endpoint/width estimate gives C lambda c^4 lambda^-11 w^2. Dividing by the target row costs at most

    C c^2 lambda^-11/(a w) <= C lambda^-2/w,

because c^2=O(lambda^4) and a>=lambda^-5. Thus the complete row is uniform. Without the differential weight, the shallow part is C lambda a w; the deep part relative to it is at most C lambda^-6 w. The exact mean-zero origin bound remains 2a/(pi^2lambda).

I checked each subsequent step against the accepted bandwidth-scale repair proof. The reference gap, complete divided differences, p width 1/(4lambda), fixed rho/eta, disjoint image bound, gamma BV estimate and general Carleman/prime tail-to-window operator bound do not introduce an a-dependent constant. The resulting input-normalized action is C lambda sqrt(a) w^(3/2). The actual full mean-zero coordinate Gram is used only at the end, costing the second factor lambda:

    ||H_lambda F_g||/||F_g|| <= C lambda^2 sqrt(a) w^(3/2).

For fixed r, w^(3+2r)<=lambda eventually, so a_lambda lies above lambda^-5 and below lambda^-3. Substitution gives exactly w^-r. The onset can depend on r; no simultaneous assertion for r growing with lambda is made.

## 2. Guaranteed-prefix count

The explicit positive-sign prefix uses n divisible by4 and

    n<=floor(4lambda^2)-7-beta log(10/a_lambda),
    beta=(2/pi^2)log(200lambda^2+25).

Write L=log lambda. Then beta=(4/pi^2)L+O(1) and log(10/a_lambda)=4L+(3+2r)log(1+L)+log10. Dividing the product by4, allowing the bounded floor errors and removing the single mean constraint gives the certified-prefix lower count

    dim F_lambda >=lambda^2-(4/pi^2)L^2
       -((3+2r)/pi^2)L log(1+L)-C_r L

eventually. This is the precise lower-bound reading of the producer's +O_r(L) term. The actual selected head may be larger. Its physical image is injective by the independently proved Gram; no energy/coordinate projector identification is used.

## 3. Physical head reserve and bridge

Let P_phys be the orthogonal PHYSICAL L2 projection onto this image. Since its finite-dimensional range lies in Dom(H_lambda), the actual action bound gives ||H_lambda P_phys||<=Cw^-r. Consequently for fixed M>0 the head compression of H_lambda+M is >=(M-Cw^-r)P_phys, and ||(I-P_phys)H_lambda P_phys||<=Cw^-r. These include the actual off-head bridge; no claim about the complementary diagonal block follows.

The maximal transition head chi>=1/2 is not asserted near-null. No complement coercivity, inverse Schur estimate, global/cofinal floor, ground identification or RH theorem is established. The later complement target is a separate conditional statement.

Eight independent elementary scaling/Schur checks are recorded in `critical_cutoff_complement_checks/SCALING_AND_SCHUR_CHECKS.json`; they do not replace the analytic proof. The companion JSON pins the final source, accepted actual-action/coordinate dependencies and this receipt. Prior fixed-A notes are unchanged.
