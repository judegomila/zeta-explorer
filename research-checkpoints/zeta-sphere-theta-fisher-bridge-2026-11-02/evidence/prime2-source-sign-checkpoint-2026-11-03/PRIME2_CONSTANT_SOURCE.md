# A single-prime source-sign countertest on the actual theta constant residual

Status: independent analytic audit PASS and independent directed-decimal interval replay PASS; separate MPFI replay corroborates. This is a targeted falsification of a source-positivity shortcut, not a new theta pivot or RH claim.

Let ψ be the complete even theta profile, F(t)=∫ψ(u)e^{itu}du, L=log 2, r=2^(−1/2), and R₂(t)=1−2r cos(Lt)+r². Put G=R₂F and Λ_H=H'²−HH''. The finite Euler identity gives

Λ_G/R₂² = Λ_F−F²(log R₂)'',
(log R₂)''=2L²∑_{m≥1}m r^m cos(mLt).

By Plancherel and positive autocorrelation, if

I=∫_R u²ψ(u)²du,   C_m=∫_R ψ(u)ψ(u+mL)du >0,

then

(1/4π)∫_R Λ_G/R₂² dt = I−L²∑_{m≥1}m r^m C_m
                         ≤ I−L²r C₁.                       (1)

The constant polynomial 1 is the actual selected residual of the empty even prefix. Thus L²r C₁>I proves the complete transformed-source integral is negative even for the single prime 2, while Q_F[1]=4πI>0. It does not show the original bridge negative.

## Complete-theta envelopes

For u≥0 set z=πe^{2u} and

f(u)=4e^{u/2}z(2z−3)e^(−z)>0.

The complete theta profile is even and ψ(u)=∑_{n≥1}4e^{u/2}(2n⁴z²−3n²z)e^(−n²z). Every summand is positive for u≥0. For n≥2,

f_n(u)/f(u) ≤ 2n⁴e^{−3(n²−1)},

using π>3 and 2z/(2z−3)<2. For n≥3, successive terms n⁴e^{−3(n²−1)} have ratio <1/2. Therefore

0≤ψ(u)−f(u)≤R f(u),
R≤32e^(−9)+324e^(−24)<0.0041.                           (2)

The last elementary comparison follows, for example, from the exact rational partial sum ∑_{k=0}^{16}9^k/k!>8000 and e>8/3. By evenness (2) holds with f(|u|) on all real u.

The upper bound on I uses 2(1.0041)²∫₀²u²f(u)²du and a strict tail allowance 10^(−100). Indeed for u≥2, u²≤e^{2u} and f(u)≤8π²e^(9u/2)e^(−πe^{2u}), so the tail is at most

2(1.0041)²(8π²)² ∫₂∞ exp(11u−2πe^{2u})du <10^(−100).

The logarithmic derivative on u≥2 is at most −1; π>3, e⁴>54 and 2(1.0041)²(8π²)²<e¹¹ give an explicit bound below e^(−291)<10^(−100).

The lower bound on C₁ retains only the positive first orbit, and by symmetry about −L/2,

C₁ ≥ 2∫₀² f(v+L/2)f(|v−L/2|)dv.                        (3)

The omitted tail is positive and is discarded only in this lower bound.

## Interval computation to audit

The owned script check_prime2_source.py applies mpmath.iv interval rectangles at 35 decimal digits to exactly 20,000 decimal cells of width 0.0001 covering [0,2]. It encloses log 2 and π by interval arithmetic and treats the one cell crossing L/2 with an outward [0,0.0002] absolute-value interval. The per-cell f expressions and their products are evaluated over full intervals, so no derivative remainder is needed.

The live interval assertions are

I < 0.03176,
L² r C₁ > 0.03276,
L² r C₁−I > 0.001.                                       (4)

The run produced respectively upper 0.0317596390..., lower 0.0327671617..., and gap lower 0.0010075227.... The exact strict assertions, not these displayed decimal truncations, are the intended certificate.

If independently accepted, (1) and (4) give the strict quantitative conclusion

∫ Λ_G/R₂² dt < −0.004π <0.                               (5)

This is a sign-preserving *complete-source* counterexample to the candidate that the once-sieved source contributes a nonnegative form even at the actual constant residual. It retains all omitted higher p=2 prime powers with their correct positive correction signs and does not replace or assume an unknown next pivot. It does not preclude a correlated source-plus-prime proof, other filters, or positivity of the original theta bridge.

## Independent directed-interval backend

A separate owned replay check_prime2_mpfi.py uses the system MPFI/MPFR libraries at 160-bit precision. It encloses every decimal grid endpoint by adjacent binary doubles before constructing the MPFI interval; the rational cell width is itself an MPFI decimal interval. It uses a [0,0.0002] enclosure only in the single cell straddling log(2)/2 and checks that this is the correct cell with outward MPFR endpoints. The MPFI assertions give the conservative outward-double endpoints

I<0.03175963904652396,
L²r C₁>0.0327671617570475,
L²r C₁−I>0.001007522710523547.

This is separate from the mpmath.iv replay and removes reliance on mpmath's experimental interval support, subject to review of the ctypes MPFI interface and script. A reviewer also implemented a third directed-Decimal replay; its result is independent corroboration, subject to that implementation's own audit.

## Small positive shifts

The strict source negativity also persists for some interval 0≤a<ε of normalized shifts, by continuity at a=0. On every compact |a|≤η<1/2, R₂(t+ia) is bounded away from zero, while the complete theta transform and its needed derivatives have uniform gamma decay; the normalized bridge has its continuous zero-shift limit. Dominated convergence therefore applies to the integrated source. This is an existence claim for ε>0, not an explicit numerical shift range.
