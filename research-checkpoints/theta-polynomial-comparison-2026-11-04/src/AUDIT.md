# Independent audit summary and exact input boundary

2026-11-04. The new actual-theta polynomial comparison received two independent analytic checks in addition to the originating derivation. This is not external peer review or machine formalization.

## Checks performed

- Uniform derivatives: fixed-radius Cauchy estimates on the known theta strip, not a nonuniform fixed-derivative assertion, give k!r^(-k)exp[−d exp(2|u|)] for all k.
- Coefficients: a Legendre expansion on a fixed real interval gives exp[O(n)] control of monomial coefficient sums by the W_4 norm. The independently proved preliminary exp[O(log²n)] comparison then supplies a source-relative bound.
- Fourier signs: with F(t)=∫psi(u)e^(−itu)du, the source inverse transform is −i{u,p(−iD)}psi=−2iu p(−iD)psi−p'(−iD)psi. Plancherel gives X=2π||g_p||².
- Fourier tails: the exp[O(n log n)] derivative bound is dominated past (1/2)log(N log N)+K. Fixed exponential multipliers cost (N log N)^a. The Fourier continuation is entire, so its shifted values equal the original entire source.
- Zero-free line: a>1/2 corresponds to Re s=1/2+a>1, where Euler product bounds are uniform in t. The exact xi factors give squared polynomial envelope q=a+7/2.
- Primitive: the complex-line identity uses F², while Cauchy–Schwarz uses |F|². Its endpoint terms vanish exponentially. No real-axis zero is divided through.
- Strip maximum: the analytic multiplier (z²+b²)^(q/4)exp[−(π/4)sqrt(z²+b²)], b>a, has the required weighted modulus throughout the closed strip. Real coefficients identify the boundary magnitudes. Constants are degree-independent.
- Reference integral: the interior integral is N^(2lambda−q) when q<2lambda. The exterior Chebyshev tail is exponentially small. At lambda=9/4,a=3/4, the interior power is N^(1/4), while the shift costs N^(3/4)L^(3/4).
- Gram/trial scope: the elementary N³ upper and arithmetic log³ single-polynomial upper are separate inherited inputs. The lower comparison does not use the latter. Trace improvement and overlap do use it. No scalar-error transfer, bounded conditioning, or relative-near-optimality claim is inferred.

## Prior supplied inputs

1. `../theta_pollaczek_trial_20261104/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md`: preliminary W_4 lower comparison and elementary weighted restricted range.
2. `../theta_selected_relative_locality_20261104/FIXED_ROW_STRETCHED_EXPONENTIAL.md`, Section 2: exact theta series, Fourier convention, and double-exponential strip decay. Its classical theta source is Romik, equations (1.7)–(1.11), https://arxiv.org/abs/1902.06330 .
3. `../theta_pollaczek_trial_20261104/NATURAL_GAMMA_REFERENCE.md`: natural-reference upper X≤C N³||p||² and exact normalization.
4. `../theta_pollaczek_natural_20261104/ARITHMETIC_SCALE_COROLLARY.md` and `NATURAL_FAMILY_RATIO_AUDIT.md`: the optional log³ natural trial upper, using the cited cumulative Hardy-Z derivative moment theorem.

The improved estimate is for the exact undeformed theta transform. It does not follow merely from the preservation properties established for earlier countermodels, and those models do not contradict it. Conversely this new estimate alone still does not control the actual escaping capacities or the particular selected negative cancellation.

All old frozen payloads remain unchanged. New working files initially placed alongside earlier packages were moved into this new package before freezing; no old payload was edited.
