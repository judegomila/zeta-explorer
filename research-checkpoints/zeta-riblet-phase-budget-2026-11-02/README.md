# Zeta riblets and backward phase budgets

[Theta ratio barriers and cumulative tails](cluster/THETA_RATIO_LARGE_ANCHOR.md) proves both proposed first-pair ratio signs for sufficiently large positive real reduction parameters, uniformly on each fixed compact interval of positive theta-kernel coordinates. An exact resolvent expansion supplies explicit remainder bounds. A small-parameter expansion and a cumulative-tail sufficient condition identify further scalar targets. Eight sampled pairs pass at two numerical precisions, without interval certification. The joint parameter limits, all-order preservation, and global arithmetic gain remain open.

[A correlation inequality for arithmetic gain](cluster/ARITHMETIC_GAIN_INEQUALITY.md) gives an unconditional correction bound using signed residual correlations and their energy cost. At the exact difficult anchor, a verified gain above 3.273390 exceeds the required deficit, leaving energy below 0.805280. A common-zero control shows why Gram conditioning alone cannot force progress. The corresponding correlation lower bound at every grid anchor remains open.

[Moving arithmetic certificates and the missing gain estimate](cluster/FILTER_PROPAGATION.md) proves an exact comparison between height/scale anchors and specifies the arithmetic gain needed after each move. Interval transport widens the existing certified band by a factor of 32. Universality rules out a height-independent fixed stopping cutoff, while known boundary zeros force coefficient growth at small scales. The required height- and scale-dependent gain bound remains open.

[Growing arithmetic filters and direct zero evaluation](cluster/GROWING_ARITHMETIC_FILTER.md) raises the sufficient residual-energy allowance to $15/16$ on the covering grid. A search with an explicit boundary-tail penalty selects exact arithmetic coefficients and certifies every scale on the band near height 1967.40625. At scale $1/2$, cutoff three passes while every cutoff-two filter fails this threshold. An analytic bound covers the continuum of smaller scales. The all-height accumulated-gain inequality remains open.

[Arithmetic jump cancellation and the signed bridge](cluster/ARITHMETIC_GAIN_BRIDGE.md) derives a smoothed fractional-part residual whose norm below $3/10$ gives a local filter certificate. A two-delay interval example passes. An exact evaluation identity writes the main shifted kernel as a difference of source energies on an interior domain, with a transferable approximation error; its sign remains open. Discrete universality proves that no fixed maximum Cayley degree passes the entire covering grid.

[Theta source, causal correlations, and a convergent arithmetic ladder](cluster/THETA_LAGUERRE_LADDER.md) identifies the local filter energy with a causal Laguerre norm. Raw finite Euler products fail to converge in this norm; an explicit pole term repairs the finite arithmetic approximation and gives a global source-error bound of order $N^{-1/2}$ at each fixed anchor. A 64-term interval certificate verifies the transfer at low height. The all-height gain estimate and a positive factorization of the main de Branges kernel remain open.

[Arithmetic filter selection and a covering grid](cluster/ARITHMETIC_FILTER_SEARCH.md) selects exact dyadic coefficients from the zeta energy matrix, verifies each proposal with interval arithmetic, and gives a fixed grid covering every possible off-line zero. At the tested band near height 1967, degree two is certified necessary and sufficient for the grid threshold. Termination at every grid point is equivalent to RH and remains open.

[Adaptive local filters and the finite-rung obstruction](cluster/ADAPTIVE_LOCAL_FILTER.md) gives a certified zeta band around height 1967.40625 where a linear filter repairs a false low reading. Voronin universality shows that every fixed finite Dirichlet dictionary fails the all-height threshold somewhere, even after optimizing its coefficients. The limiting ratio gives a simultaneous fine-scale coverage estimate and an explicit arithmetic residual for an adaptive filter.

[Full-strip shear on a fixed grid of heights](cluster/MOLLIFIED_SHEAR_COVERAGE.md) derives an asymptotic lower bound of 83.4% for whole cells with outward shear across the critical strip. A reflected pair would force a local zeta energy ratio below 2.95% at a matching dyadic scale. An interval calculation puts this ratio above 4.6% at every dyadic scale on a band around height 18. A uniform bound at candidate pair centers remains open.

[Signed moments of the low transverse coefficients](cluster/LOW_ORDER_MOMENTS.md) give an independent additive lower bound on boxes reaching one mean spacing from the critical line at arbitrarily large heights.

[A finite theta test at a shared height](cluster/TRANSVERSE_THETA.md) gives an explicit remainder for the transverse squared modulus, proves positivity of its high-order coefficients directly from the theta density, and certifies outward bridge shear across the entire strip at heights 32–64. The remaining low-order sign problem is explicit.

[Two-zero windows with positive shear and reversed endpoint slopes](cluster/JOINT_PAIR_WINDOWS.md) derives a lower bound exceeding one disjoint passing window per 40 zero copies from two preprint estimates. A four-point slope formula distinguishes a double line zero from an off-line pair at the same height in the shrinking-scale limit.

[Signed zeta shear on windows fixed in advance](cluster/FIXED_WINDOW_SHEAR.md) bounds the shear throughout many predetermined cells at arbitrarily large heights. A separate endpoint test classifies all three two-zero rectangles in a fixed eight-window check. The empty rectangle also has positive shear.

[Positive shear at unbounded pair centroids](cluster/UNBOUNDED_CENTROIDS.md) gives two per-zero packing inequalities, a positive-density consequence of Conrey’s theorem, and a stronger full-strip result using an additional preprint input.

[Centroid shear and isolated close pairs](cluster/CENTROID_SHEAR.md) bounds the exterior zero contribution at every height and verifies the complete-theta curvature criterion on a two-zero window near height 111.

[Reading the last Hermite pivot from the sign of zeta](cluster/ARITHMETIC_PIVOT.md) gives a moment-selected Hardy sign test, a two-critical-value variant, and an interval certificate for three critical-line zeros at heights 12 to 27. It identifies the signed theta estimate that remains open at arbitrary height.

[Partial cluster mass and an actual two-zero certificate](cluster/PARTIAL_CLUSTER_MASS.md) gives a lower bound from moment subspaces and the final-pivot obstruction for close reflected pairs.

[Moving-window critical-line mass](energy/MOVING_WINDOW.md) derives a half-unit grid test, an exponentially small tail, and the lower bounds available on verified windows and on average.

[All-height weighted shear bound, 7 November 2026](energy/GLOBAL_BOUND.md) gives an explicit bound uniform in small amplitudes, the weighted zero-count limit on the entire strip, and the remaining moving-window threshold.

**Small-value energy continuation, 4 November 2026:** [Backward shear and logarithmic energy](energy/SMALL_VALUE_ENERGY.md) derives the exact fourth-power small-value law and logarithmic energy coefficient for off-line zeros, including multiplicity and critical-line boundary zeros. It connects the statistic to the complete modular bridge, transfers the existing weighted density estimate, and gives a zero-safe approximation bound and a symmetric counterexample to unweighted norm control. The required small-value little-o estimate remains open. Run `python3 energy/check_energy.py` for the new model checks.

**Continuation, 4 November 2026:** [Cluster residuals and an actual finite-window certificate](cluster/CLUSTER_RESIDUAL.md) adds a contour bound independent of internal zero spacing, the exact squared-norm blowup, and outward-interval verification of a low-height completed-zeta window. The global nonconcentration and Schur-positivity estimates remain open.

**Research checkpoint for review, 2 November 2026.** Analytic derivations with finite exact checks and floating-point diagnostics; not refereed or Lean-formalized. No RH proof, new zero-verification height, or de Bruijn–Newman bound is claimed. The global one-sided arithmetic estimate remains open.

Research note, 2 November 2026. Distant reflected zero pairs provide positive transverse reserve, while a bare finite array with the natural prime amplitudes cannot resolve the singular field beside a zero at arbitrarily small scales. The continuation proves that an off-line zero leaves a limiting backward phase variation of mπ, derives a finite-scale bound, and gives an exact countermodel to finite scan-line positivity. The resulting one-sided arithmetic error criterion remains unproved; global confinement and the Weil Schur-complement inequality remain open.

## The intrinsic field and what confinement means

The completed function removes the trivial zeros and zeta pole. Let x measure transverse displacement from the critical line, and let A be the logarithmic amplitude derivative.

$$
s=\tfrac12+x+it,\quad
\xi(s)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s),\quad
A(x,t)=\Re\frac{\xi'(s)}{\xi(s)}.
$$

The desired sign is x A(x,t) > 0 away from the critical line and the zeros. It would make the auxiliary fixed-height flow dx/dτ = −A point inward. This flow moves test points; it does not move zeros of the fixed analytic function. Global horizontal monotonicity is an established RH criterion: [Sondow and Dumitrescu](https://arxiv.org/abs/1005.1104). The exact bridge relation in the existing [bridge-shear paper](https://chatgpt.com/library?file_id=libfile_564776a62b988191ac21ec37fb22e844&account_id=personal) is W_x(t) = |ξ(s)|² A(x,t).

## A positive bound for the entire distant zero tail

In centered coordinates, nontrivial zeros have the form b+iγ with |b|<1/2. Functional symmetry pairs b+iγ with −b+iγ, with equal multiplicities. The real-part zero sum is locally absolutely convergent away from zeros, so these pairs may be retained without assuming RH. A zero already on the line contributes m x/[x²+(t−γ)²] once; it must not be counted twice as its own reflected partner.

$$
A(x,t)=\sum_{\alpha=b+i\gamma}m_\alpha
\frac{x-b}{(x-b)^2+(t-\gamma)^2}.
$$

To justify the absence of an extra real constant, apply the centered even Hadamard product to $F(w)=\xi(1/2+w)$, grouping each $\alpha,-\alpha$ pair. Its logarithmic derivative is the sum of $1/(w-\alpha)+1/(w+\alpha)$. Evenness removes the linear exponential factor. The real parts may then be regrouped absolutely on compact sets avoiding zeros: the horizontal zero coordinates are bounded and the tails are bounded by a constant times $\sum_\alpha m_\alpha/(1+|\operatorname{Im}\alpha|^2)<\infty$. A reflected pair below has $b>0$; a critical-line zero is counted just once in the full sum.

For one reflected pair of multiplicity m, put d=t−γ and q=x²+d². Its complete contribution is

$$
P_{b,\gamma}(x,t)=
\frac{2mx(q-b^2)}{(q+b^2)^2-4x^2b^2}.
$$

For x>0, a negative contribution is possible only inside x²+(t−γ)²<b². In particular, every pair at vertical distance at least 1/2 is nonnegative. This sign localization was already present in the bridge paper. The following quantitative bound retains a specified fraction of the corresponding centered-pair field:

$$
|b|\le B,\quad |d|\ge R>B
\quad\Longrightarrow\quad
P_{b,\gamma}(x,t)\ge
c_{B,R}\frac{2mx}{x^2+d^2},\qquad
c_{B,R}=\frac{1-B^2/R^2}{(1+B^2/R^2)^2}>0.
$$

Proof: divide the pair contribution by 2mx/q. Its ratio is q(q−b²)/[(q+b²)²−4x²b²], which is at least (1−u)/(1+u)² with u=b²/q. Since 0≤u≤B²/R²<1 and this last expression decreases on that interval, the stated bound follows. The constant is optimal as a uniform bound for this comparison class: approach x=0, |b|=B and |d|=R. This is an elementary consequence of the exact pair formula; no priority claim is made.

For B=1/2 and R=1 the guaranteed fraction is 12/25. The argument applies to every distant pair, including an infinite tail. It uses the actual paired sign, not an absolute truncation-error estimate.

## A rigorous finite-height inward field

Suppose all nontrivial zeros with |γ|≤T have been verified on the line, counting every zero and with T large enough to include at least one zero. Then throughout x>0 and |t|≤T−1/2, all omitted pairs are nonnegative. Consequently

$$
A(x,t)\ge
\sum_{|\gamma|\le T}m_\gamma
\frac{x}{x^2+(t-\gamma)^2}>0.
$$

The verified zeros form a finite positive core and the entire unknown-height tail remains nonnegative. No assumption about RH above T enters this statement. A sharper rounded boundary is available inside 0<x<1/2: it suffices that |t|≤T and x²+(T−|t|)²≥1/4. For x≥1/2 positivity holds at every height.

[Platt and Trudgian](https://arxiv.org/pdf/2004.09765) rigorously verified RH through at least T=3×10¹². Thus the displayed field inequality follows through |t|≤3×10¹²−1/2. This is a corollary of their finite verification and the paired-zero identity, not a new height record or a proof at unbounded height.

On any rectangle 0<|x|≤X₀, |t|≤T₀≤T−1/2, even one verified zero γ₀ gives A/x≥m₀/[X₀²+(T₀+|γ₀|)²]. Hence the auxiliary motion has an explicit exponential upper bound for |x(τ)| while it remains defined; at a zero height it may reach the singular endpoint. This concerns test-point motion only.

## The finite prime corrugation and its resolution limit

The Euler product gives the following expression only in σ>1. Here Λ(n)=log p when n=p^m and is zero otherwise, and ψ denotes the digamma function.

$$
A(\sigma-\tfrac12,t)=G(\sigma,t)
-\sum_{n\ge2}\Lambda(n)n^{-\sigma}\cos(t\log n),\qquad
G(\sigma,t)=\Re\left[\frac1s+\frac1{s-1}+\frac12\psi(s/2)-\frac12\log\pi\right].
$$

See the [Euler product and continuation formulas in DLMF](https://dlmf.nist.gov/25.2) and [the completed-function definition](https://dlmf.nist.gov/25.4). A finite sum transported into the critical strip is an ansatz, not a justified analytic continuation. Its reflection-odd version is

$$
R_X(x,t)=G_o(x,t)+
\sum_{n\le X}\frac{\Lambda(n)}{\sqrt n}\sinh(x\log n)\cos(t\log n),
\qquad
G_o(x,t)=\frac{G(\tfrac12+x,t)-G(\tfrac12-x,t)}2.
$$

For any fixed finite cutoff, R_X is O(x) near the line. At an actual line zero of multiplicity m, A(x,γ)=m/x+O(x), so xA tends to m while xR_X tends to zero. Therefore this finite smooth odd field cannot approximate the true normalized field uniformly down to the core. A smooth imposed force can still point inward; that fact alone does not identify it with zeta's field.

The same amplitude obstruction applies if every cosine is replaced by any independently chosen coefficient c_n with |c_n|≤1. When |G_o|≤C_G x, the phase-independent capacity bound is

$$
|xR_X(x,t)|
\le x^2\left[C_G+
\sum_{n\le X}\frac{\Lambda(n)\log n}{\sqrt n}
\cosh(x\log n)\right].
$$

Proof: apply the triangle inequality and sinh u≤u cosh u for u≥0. This bound permits arbitrary phases; it does not permit extra amplitudes diverging as x tends to zero. It does not apply to an approximation that includes an additional analytic remainder, the pole-centering continuum of the full Weil form, or an explicit singular core.

## An integer-checked bound at one million

Take x=3/1000 and X=1,000,000. For every t≥14 and 0<σ<1, a trigamma-series estimate gives

$$
|\partial_\sigma G(\sigma,t)|
\le \frac3{t^2}+\frac{\pi}{4t}<\frac1{14}.
\qquad\text{Thus}\qquad |G_o(x,t)|<\frac{x}{14}.
$$

To verify the estimate, bound the two reciprocal-square terms by 2/t² and use |ψ′(σ/2+it/2)|≤4/t²+π/t. The latter follows by comparing the positive series Σ[(k+σ/2)²+(t/2)²]⁻¹ with its first term plus its integral. The final rational inequality uses t≥14 and π<22/7.

Every contributing n≤10⁶ obeys Λ(n)<14 and log n<14. Also cosh((3/1000) log n)<1001/1000. The logarithm bound follows from e>27/10 and (27/10)^14>10⁶; the hyperbolic-cosine bound follows from cosh u≤1/(1−u²/2) at u=21/500.

An integer sieve enumerates 78,734 distinct prime powers. Replacing 1/√n by 1/floor(√n), then rounding each reciprocal upward to a multiple of 10⁻⁶, gives

$$
\sum_{\substack{n\le10^6\\n=p^m}}\frac1{\sqrt n}
\le\frac{182590132}{10^6}.
$$

Combining these rational bounds yields the strict, phase-independent conclusion

$$
|xR_{10^6}(x,t)|
<
\frac{4513764145771872}{14000000000000000}
<\frac13,\qquad x=\frac3{1000},\quad t\ge14.
$$

At any verified zero height γ with 14≤γ≤T−1/2, the positive-tail theorem instead gives xA(x,γ)≥mγ≥1. Thus this bare finite array misses more than two-thirds of the normalized actual field, even after arbitrary phase choices. The integer verifier below checks the finite enumeration and rational comparisons; the analytic inequalities above are part of the proof. This is not a formal proof-assistant certificate.

## Consequence for the next confinement argument

The surviving construction retains the true local cores and the complete paired tail. On a zero-counted window, the core contributes explicit positive terms and all sufficiently distant pairs supply positive reserve. For computation, the already-established smooth shear W=|ξ|²A avoids the logarithmic singularity while retaining its sign away from zeros; the finite-field obstruction above does not rule out certified approximations to W.

The global gap is still the arithmetic exclusion of a negative pocket from an unverified nearby off-line zero. The finite-height theorem cannot extend itself past the zero-counted region. The current route ledger, revision 59, also leaves full signed Schur positivity open. A successful continuation must prove the sign for the full shear or full coupled form at every height and arbitrarily small positive transverse scale, with the complete analytic remainder retained. Neither freely tuning finite phases nor counting far-field positive pairs supplies that missing theorem.

## Backward phase variation detects a shrinking off-line core

Continuation, 2 November 2026. A positive regular background cannot erase the local reversal caused by an off-line zero, but its integrated phase signature survives when the negative region becomes arbitrarily narrow. The result below gives a scale-stable observable and a precise one-sided error target. It does not supply the arithmetic bound needed to prove RH.

On a zero-free vertical scan segment, define the backward phase variation

$$
\mathcal S_x(I)=\int_I(-A(x,t))_+\,dt,
\qquad A(x,t)=\partial_t\arg\xi(\tfrac12+x+it).
$$

Here u₊=max(u,0), and the argument is lifted continuously along the segment. This is one-sided phase variation, not closed-contour winding. For the exclusion criterion below, only scans avoiding zeros on the chosen segment are used; no artificial infinite value is assigned at a zero.

## A local phase mass of m pi

Suppose ρ=1/2+b+iγ is an off-line zero with b>0 and multiplicity m. In a disk containing no other zero, factor ξ(s)=(s−ρ)^m h(s), with h holomorphic and nonzero. On the scan x=b−ε, put t=γ+y. Then

$$
A(b-\varepsilon,\gamma+y)
=-\frac{m\varepsilon}{\varepsilon^2+y^2}
+R_\varepsilon(y),\qquad
R_\varepsilon(y)=\Re\frac{h'}h(\rho-\varepsilon+iy).
$$

The regular term has a finite absolute bound M on a sufficiently small closed neighborhood. Choose shrinking radii rε with rε→0 and ε/rε→0. The negative-part map is 1-Lipschitz, so

$$
\left|
\int_{-r_\varepsilon}^{r_\varepsilon}
(-A(b-\varepsilon,\gamma+y))_+\,dy
-2m\arctan\frac{r_\varepsilon}{\varepsilon}
\right|\le 2Mr_\varepsilon.
$$

Consequently the shrinking-core backward phase mass tends exactly to mπ. For any fixed interval I containing γ in its interior, the liminf of S_{b−ε}(I) is at least mπ along zero-avoiding scans. A large positive background can shrink the region of reversal; it cannot remove this limiting phase mass.

This is related to Parker Emmerson's [Slip Certificates for the Riemann ξ–Function](https://www.preprints.org/manuscript/202601.2022), posted 27 January 2026 and marked not peer reviewed. That preprint uses a Poisson-kernel forcing argument and a π/4 sufficient threshold in its rotated coordinates. The local factorization proof above and finite-scale bound below are supplied directly here; no novelty claim or reliance on the preprint's computational certification layer is made.

## An explicit bound at finite distance

Assume |Rε(y)|≤M with M>0 on the local rectangle. Put q=Mε/m. For 0<q<1 define r*=sqrt(mε/M−ε²), and require the entire segment |y|≤r* to lie inside that rectangle. The core dominates the worst allowed positive background on this segment. Exact integration gives

$$
\mathcal S_{b-\varepsilon}
([\gamma-r_*,\gamma+r_*])
\ge 2m\left[\arccos\sqrt q-\sqrt{q(1-q)}\right].
$$

The bound is sharp for the local class in which the regular field may equal the constant M. As q tends to zero it is mπ−4m√q+O(m q^{3/2}). This makes the size of the required scan resolution explicit instead of assuming that an unresolved negative pocket has negligible phase weight.

## A uniform window criterion and its necessary quantifier

Use the overlapping unit intervals I_j=[j/2,j/2+1] for all integers j. Every real height lies in the interior of at least one interval, with distance at least 1/4 from its endpoints. The following statement is equivalent to RH:

$$
\forall j\in\mathbb Z,\qquad
\sup_{\substack{0<x<1/2\\
\xi(1/2+x+it)\ne0\ \forall t\in I_j}}
\mathcal S_x(I_j)<\pi.
$$

Proof: RH gives A>0 for x>0, so all these budgets are zero. Conversely, an off-line zero has a reflected partner with b>0. Choose a covering interval containing its height internally. The preceding local limit forces the corresponding supremum to be at least mπ≥π, a contradiction. Zero-avoiding scans approaching b exist because there are only finitely many zeros in the relevant compact rectangle.

The supremum is essential. The weaker assertion S_x(I)<π separately at each scan has no uniform gap and need not exclude a zero. For the elementary model F(w)=w²−b², direct integration gives S_x(ℝ)=2 arcsin(x/b)<π for every 0<x<b, and S_x(ℝ)=0 for x>b, although the off-axis zeros remain. Its supremum over regular scans is π.

The margin below π may depend on the height interval. The theorem does not require summing phase-error budgets across all heights or imposing one common margin for all intervals. It does require uniform control over the transverse scans within each interval.

## Finite scans can miss the defect at every height

Consider the synthetic entire function

$$
F_c(w)=\cosh(cw)
\big((w-i\Gamma)^2-b^2\big)
\big((w+i\Gamma)^2-b^2\big),
\qquad b=\frac15,\quad \Gamma=10.
$$

It is even, real entire, and of order one. It has infinitely many zeros on x=0 from cosh(cw), together with the four off-axis zeros ±b±iΓ. It has the reflection symmetries relevant to the geometric analogy, but does not have zeta's arithmetic structure and is not a counterexample to RH.

Take c=100 and scan at x in {0.05,0.10,0.15,0.25,0.40}. The background satisfies Re[c tanh(c(x+it))]≥c tanh(cx). At a scan x<b, each of the two right-hand polynomial zeros contributes at least −1/(b−x), and the left-hand zeros contribute positively. At x>b every polynomial contribution is positive. Thus on all five scans, at every real height,

$$
\Re\frac{F_{100}'(x+it)}{F_{100}(x+it)}
\ge100\tanh 5-40>59.
$$

The last inequality follows from e¹⁰>199, which gives tanh 5>0.99. Every scanned phase budget is therefore zero, while all four off-axis zeros persist between scans. More generally, any finite collection of positive scan positions avoiding b can be made positive at every height by increasing c. A certified interpolation bound or an analytic control of every intermediate scan is indispensable. Assuming a globally bounded logarithmic-derivative derivative in the unverified rectangle would already exclude its poles and cannot be inserted without justification.

## Numerical check with a strong positive background

For the same synthetic family, use the local rectangle 0≤ε≤b/2 and |y|≤r₀=b/4. A valid regular-field bound is

$$
M_c=c\coth(cb/2)+\frac2{3b}+\frac2{2\Gamma-r_0}.
$$

The numerical check sets ε=q/M_c and integrates after the substitution y=ε tan u, which resolves the narrow core without a uniform height grid. For c=1000 and m=1:

| q | Distance ε from the off-line core | Width of the central negative pocket | Computed phase mass | Analytic lower bound |
|---:|---:|---:|---:|---:|
| 0.1 | 9.96578×10⁻⁵ | 5.98256×10⁻⁴ | 1.89864895 | 1.89809154 |
| 0.01 | 9.96578×10⁻⁶ | 1.98410×10⁻⁴ | 2.74244530 | 2.74226032 |
| 0.0001 | 9.96578×10⁻⁸ | 1.99398×10⁻⁵ | 3.10161191 | 3.10159332 |

The phase mass approaches π≈3.14159 despite the narrow pocket and large positive background. Twelve cases, with c in {1,10,100,1000}, were checked. Tightening the adaptive integration tolerance from 10⁻¹¹ to 10⁻¹³ changed the computed masses by at most 1.25×10⁻¹⁴. These decimals are floating-point diagnostics; the local bound and finite-scan counterexample follow from the analytic proofs.

## The arithmetic target is a one-sided error budget

Let A₀(x,t) be an arithmetic approximation whose sign and error can be controlled without assuming the zero locations. Define an upper bound E⁻ for the integrated amount by which A₀ overestimates the actual field. Pointwise positive-part algebra gives

$$
E_x^-(I)\ge\int_I(A_0-A)_+\,dt
\quad\Longrightarrow\quad
\mathcal S_x(I)\le
\int_I(-A_0)_+\,dt+E_x^-(I).
$$

Therefore the following sufficient arithmetic estimate would complete this phase route:

$$
\forall j,\qquad
\sup_{\substack{0<x<1/2\\\text{regular scans on }I_j}}
\left\{\int_{I_j}(-A_0(x,t))_+\,dt
+E_x^-(I_j)\right\}<\pi,
\quad I_j=[j/2,j/2+1].
$$

The error bounds are required on all regular scans and must retain the complete arithmetic remainder. Unlike a two-sided absolute error, this quantity does not charge an approximation for missing a large positive core contribution. That is why the previous finite-core amplitude obstruction does not by itself refute this one-sided certificate. A larger cutoff alone does not establish the bound either.

The full shear still satisfies S_x(I)=∫_I (−W_x(t))₊/|ξ(1/2+x+it)|² dt on regular scans. The denominator matters: the unweighted negative integral of the smooth shear can shrink to zero near a zero even while the normalized phase mass tends to mπ.

No bound E⁻ meeting the displayed all-height condition has been proved here. The continuation supplies a multiplicity-safe local obstruction, a finite-scale lower bound, and a robust arithmetic error target; it does not establish RH or a new certified height.

## Connection to the main proof attack

The scalar identity is

$$
W_x(t)=\tfrac12\partial_x|\xi(\tfrac12+x+it)|^2
      =|\xi(\tfrac12+x+it)|^2 A(x,t).
$$

The phase budget is therefore the negative shear divided by the **complete** amplitude squared. Splitting the numerator into core and tail does not permit replacing the denominator by a truncated core. This note supplies an alternative sufficient arithmetic target, not an estimate of the physical operator's full Schur complement $E-B^*D^{-1}B$. Establishing the window criterion globally would imply RH; no transfer from the currently certified finite sectors to that criterion is proved here.

[PR #38](https://github.com/judegomila/mathexplorer/pull/38) analyzes the collision field $G(\tau,u)=H_\tau(u)+iH_\tau'(u)$ in **heat-time/real-position** coordinates. This note instead concerns the phase of the **undeformed completed function** in $(x,t)=(\sigma-1/2,\operatorname{Im}s)$ coordinates. Here $t$ is zeta height, not heat time; a simple off-line zero already gives the phase obstruction. A collision-field certificate or a positive-time band cannot be substituted without a proved translation and endpoint limit.

For integration with the signed-boundary program, retain all gamma/pole terms, ordinary primes and proper powers, head/exceptional terms, core–tail cancellation, and the complete inverse/mixed-direction costs. Finite scans require certified interpolation or analytical control between scans; a bound on a logarithmic derivative across an unverified region must not assume away its poles. No positivity premise for an arbitrary spatial tail is used.

The concrete follow-up is to construct $A_0$ from an actual completed arithmetic approximation, bound $E_x^-(I)$ without assuming RH, and prove the strict supremum bound on every overlapping height window. The constants may depend on the window, but not on its scan position $x$.

## Reproduction and provenance

From the repository root, run:

```sh
node research-checkpoints/zeta-riblet-phase-budget-2026-11-02/verify.mjs
```

The verifier runs the integer prime-power capacity check, exact rational reflected-pair checks, finite-grid negative-part checks, and the twelve synthetic phase probes at two quadrature tolerances. The last group uses ordinary floating-point arithmetic and is **not** an interval certificate. Neither the finite checks nor their count establish the all-height theorem; the proofs above supply the implications and state the missing hypothesis.

The implementation rejects nonfinite phase masses and exhausted adaptive quadrature. Its finite-scan counterexample is synthetic and has no Euler product. Numerical results and their status are recorded in `verification-results.json`.

Adapted from the project [research Page](https://chatgpt.com/space/page_a3d97efd706481918db8d9bcdbfdb228), sequence 3 (2 November 2026), with equations and scope reviewed for this PR. This is a human-directed AI-assisted research note; the proof remains subject to mathematical review. Public source links above identify the DLMF definitions, Platt–Trudgian's finite-height input and the related Emmerson preprint. No novelty claim is made for the phase-obstruction mechanism. The PR changes neither the canonical campaign ledger nor any claimed positivity or Newman-bound status.

