# Independent structural audit: local modular signs and the sharp ladder boundary

Audit date: 2026-11-03 (UTC).

## Result

**The two assigned structural arguments pass this independent mathematical audit.** I found no invalid inference in either the odd/odd rational-cusp sign theorem or the symmetric-translation obstruction to a uniform strict reflected contraction. The nearby fixed-degree Gaussian limit and conditional essential-spectrum conclusion also pass.

These are obstruction/structure theorems, not an all-order positivity proof. In particular:

- At every stated rational-cusp midpoint, the local diagonal moments have infinitely many strictly positive and infinitely many strictly negative terms.
- The union of local negative-witness sets is relatively open and dense. This does not prove failure at every irrational midpoint, nor any negative integrated quadratic form.
- At each fixed positive shift, the reflected ladder cannot have any uniform contraction constant below one. The argument does not establish the missing bound at constant one, or prove that its norm is finite.
- There is no contradiction between these obstructions and positivity of each fixed finite local degree sufficiently far out, or finite integrated positivity reserves in a chosen polynomial basis.

## Sources and scope

Primary source: `private/source/relative_modular_bridge_all_order.tex`, especially lines 168–445. Supporting definitions and estimates were read in:

- `private/source/relative_modular_bridge_bounds.tex`: the complete profile, bridge normalization, strict log-concavity, and its Gaussian envelope.
- `private/source/relative_modular_bridge_extensions.tex`: the mixed position-energy identity and reflected transforms.
- `private/source/relative_modular_bridge_hierarchy.tex`: complete-profile strip analyticity and decay.

This is an original analytic audit of the supplied mathematics. No acquired code was executed. No numerical certificate was replayed. No external publication, upload, or write occurred. The integrated finite-block certificates and the later arithmetic scale remainder are outside this report's substantive audit scope.

## 1. Odd/odd rational cusps: normalization and absence of a zero mode

Write

    Θ(x) = Σ_{n∈Z} exp(-π n²x), Re x > 0.

Direct differentiation gives Θ′(x) = -2π Σ_{n≥1} n² exp(-π n²x) and Θ″(x) = 2π² Σ_{n≥1} n⁴ exp(-π n²x). Therefore

    ψ(u) = 4 exp(9u/2) Θ″(exp(2u))
           + 6 exp(5u/2) Θ′(exp(2u))

has exactly the original coefficients 8π²n⁴ and -12πn². There is no factor-of-two or normalization defect in source lines 310–315.

For α = p/q with p,q positive odd integers, let a_n = exp(-iπpn²/q). Then

    a_{n+q}/a_n = exp[-iπp(2n+q)] = -1.

Thus the 2q-periodic Fourier expansion has only odd modes m. Each coefficient has modulus at most one, since it is an average of 2q unit-modulus values. Reduction of p/q to lowest terms is unnecessary; an unreduced odd denominator merely gives a weaker valid bound.

Poisson summation for each character gives

    Θ(t+iα) = t^(-1/2) Σ_{m odd} c_m
                 Σ_{ℓ∈Z} exp[-π(ℓ-m/(2q))²/t].

The square root is the holomorphic branch in Re t > 0. Both sides are holomorphic there, and the dual series converges normally on compact subsets because Re(1/t)>0. Hence continuation from positive real t is justified. Crucially, no odd m is congruent to zero modulo 2q, so every dual distance d satisfies d ≥ 1/(2q). There is no nondecaying dual term. This verifies the decisive step in lines 316–334.

## 2. The actual complex cusp path and derivative flatness

At u = h + i(π/4-ε), where exp(2h)=α,

    exp(2u)-iα = α sin(2ε) + iα[cos(2ε)-1]
               = 2α exp(-iε) sin ε = t_ε,

and therefore

    1/t_ε = (cot ε+i)/(2α).

The source uses the actual path, not an unjustified replacement by a horizontal real-t approach. Here |t_ε| is comparable to ε, and R = Re(1/t_ε) = cot ε/(2α) tends to infinity.

The displayed summable majorant is valid. For R≥1 and d²≥1/(4q²),

    d²R ≥ R/(8q²) + d²/2,

because d²(R-1/2) ≥ (R-1/2)/(4q²) ≥ R/(8q²). Consequently

    d^(2j) exp(-πd²R)
      ≤ exp[-πR/(8q²)] d^(2j) exp(-πd²/2).

After any fixed number r of t-derivatives, a summand is a finite combination of powers of t^(-1) times powers of d² times the same exponential. The remaining Gaussian sums converge. Thus, along the specified path, every fixed Θ derivative is bounded by a finite power of ε^(-1) times

    exp[-π cot ε/(16αq²)].

This proves the estimate in lines 343–358, with constants allowed to depend on the fixed cusp and derivative order. The chain rule for the complete-profile identity introduces only finitely many Θ derivatives, while exp(2u) and the prefactors stay bounded along this fixed-h path. It follows that ψ^(r)(h+iy) tends to zero for every fixed r as y approaches π/4 from below. Exponential flatness dominates all inverse powers; there is no hidden uniform-in-r requirement.

Schwarz reflection gives the corresponding limits for h-iy. Therefore every real-y derivative of

    G_h(y) = ψ(h-iy)ψ(h+iy)/ψ(h)²

also tends to zero at the upper boundary. The denominator is positive and independent of y. For real y inside the strip, G_h(y)=|ψ(h+iy)|²/ψ(h)². This is a real-line identity for the holomorphic product, not a claim that an absolute-square expression is holomorphic in complex y.

No continuation across the boundary is needed. Interior derivative limits suffice for the sign argument.

## 3. Flatness excludes both eventual coefficient signs

The Taylor expansion is

    G_h(y) = Σ_{n≥0} q_n(h)y^(2n)/(2n)!,
    q_n(h) = (-1)^n F_h^(2n)(0).

The factor (-1)^n is correct because substituting v=iy multiplies the even Taylor coefficient by i^(2n). The strip of analyticity contains the disk |y|<π/4, so termwise differentiation is valid at every strictly interior y.

Suppose q_n≥0 for all n≥N. Then for 0<y<π/4,

    G_h^(2N)(y) = Σ_{n≥N} q_n y^(2n-2N)/(2n-2N)!.

If some q_m>0 with m≥N, retain that single term. On, for example, π/8≤y<π/4, it gives a strictly positive constant lower bound. This contradicts G_h^(2N)(y)→0. The argument needs neither interchange of a boundary limit and an infinite sum nor a claim that the series converges at the boundary.

If instead every coefficient in that tail vanishes, G_h is a polynomial. A polynomial whose derivatives all vanish at the finite endpoint is zero, contradicting G_h(0)=1. Thus eventual nonnegativity is impossible and there are infinitely many strictly negative q_n.

Applying the same reasoning to -G_h^(2N) excludes eventual nonpositivity and gives infinitely many strictly positive q_n. Zeros in the sequence cause no difficulty. This validates lines 364–381 exactly as stated.

## 4. Density, local matrix failure, and limits of the conclusion

Positive odd/odd rationals are dense in the positive reals. Restricting to α≥1 and applying h=(log α)/2 gives a dense set in [0,∞). Every q_n(h) is continuous (indeed real analytic), since ψ(h)>0. A strict negative q_n therefore persists on a relative neighborhood of its midpoint. The union

    U = ⋃_{n≥1}{h≥0:q_n(h)<0}

is relatively open and contains the dense rational-cusp set. It is consequently dense. The word “open” at h=0 must be understood in the relative topology of [0,∞), as is natural in the statement.

At row/column n, the local matrix diagonal is (-1)^n F_h^(2n)(0)=q_n(h). A strict negative diagonal immediately forbids positive semidefiniteness at every matrix size N≥n. No off-diagonal analysis is required.

Every nonempty open midpoint interval therefore contains an all-order local failure. Arbitrarily large explicit midpoint locations h=(1/2)log(2m+1) rule out one common all-order positive tail. This does not say that any one fixed q_n stays negative arbitrarily far out. The negative order can, and must, rise along sufficiently large midpoints.

This is a local obstruction. Integrating signed local forms against the positive bridge weight can preserve or restore positivity through cancellation. The argument gives no negative integrated witness. The source expressly retains this distinction in lines 391–394.

## 5. Fixed-degree Gaussian limit: independent compatibility check

The first-summand calculation is exact:

    F_h^(1)(v) = [4z²-12z cosh(2v)+9]/(2z-3)²
                 × exp[-2z(cosh(2v)-1)],
    z = π exp(2h).

With v=w/√(8z), the exponent tends to -w²/2 and the prefactor tends to one, locally uniformly for complex w. The scale 8z is correct.

For bounded complex w, Z_±=z exp(±2v) obey Re Z_±≥z-C_R√z and |2Z_±-3|≥z for large z. The complete n-th/first summand ratio is exactly the one in source line 415. Its prefactor is bounded by C_R n⁴, while its exponential modulus is at most exp[-(n²-1)(z-C_R√z)]. Summing n≥2 gives O_R(exp[-3z+C′_R√z]). The n=2 term controls the leading exponent and the rest form a uniformly summable tail for large z. The real-h normalizing denominator is also first-term dominated. Therefore the full-profile limit, not merely a truncation limit, follows.

Cauchy's derivative formula gives

    q_n(h)/(8z)^n → (2n-1)!!

for each fixed n, with the n=0 value interpreted as one. For μ_(2n)=q_n and μ_(2n+1)=0, the phase identity

    H_N = diag(i^j) [μ_(j+k)] diag(i^j)*

has the correct signs. Rescaling row and column j by (8z)^(-j/2) produces entrywise convergence to the finite standard-Gaussian moment matrix. That matrix is strictly positive because a nonzero polynomial cannot have zero squared integral against a positive Gaussian density. Positive definiteness is open in fixed finite dimension, so the claimed h_N exists.

Thus both quantifiers are sound:

    For every fixed N, there exists h_N with all h≥h_N locally positive.
    There is no h_* that works for every N simultaneously.

Neither h_N nor the convergence is claimed uniform in degree. This is precisely why there is no contradiction with the rational-cusp obstruction.

## 6. Symmetric translates really belong to the weighted cyclic closure

Fix a>0, f=f_a=exp(au)ψ(u), A=a²-D², and H=L²(R,|u|du). Let V be the closed span of A^n f. The polynomial spans generated by A and by D² coincide at each degree, because

    A^n = Σ_{k=0}^n binom(n,k) a^(2n-2k)(-1)^k D^(2k)

is triangular with nonzero diagonal.

For z in the connected strip |Im z|<π/4, define

    Φ(z)(u) = [f(u-z)+f(u+z)]/√2.

On each compact z-set, the real translations are bounded and the imaginary parts stay in a smaller closed strip. The complete-profile estimate |ψ(x+iy)|≤K exp(-Bx²), for arbitrarily large fixed B, gives a common integrable |u|-weighted square majorant after multiplication by exp(au). The same holds for any fixed derivative by a slightly wider closed strip and Cauchy's estimate. This justifies strong H-valued holomorphy and differentiation under the norm.

At zero the odd derivatives of Φ vanish and the even derivatives are √2 D^(2n)f, all in V. If ℓ is any bounded complex-linear functional annihilating V, then ℓ∘Φ has every Taylor coefficient zero at zero. It vanishes near zero and hence throughout the connected strip by the scalar identity theorem. Separation of the closed subspace V then gives Φ(R)∈V for every real R.

This closes the principal possible gap in a naïve translation proof. It does not require a Taylor series at zero to converge for all real R. Nor does it require translations to be bounded operators on all of L²(|u|du), which in general they are not. The argument applies directly to this specific holomorphic orbit with complete-profile decay. Source lines 187–204 use the correct reasoning.

## 7. Exact signed and absolute energies of the translated vectors

Let g_R=Φ(R), M_0=∫f², M_1=∫u f², and M_abs=∫|u|f². All are finite; M_0>0 and, by evenness of ψ and a>0,

    M_1 = 2∫_0^∞ u sinh(2au)ψ(u)² du = 2C_a(0)>0.

The two squared diagonal translation terms in g_R contribute

    (1/2)∫[(v+R)+(v-R)] f(v)² dv = M_1

to the signed moment. The cross term is

    ∫u exp(2au) ψ(u-R)ψ(u+R) du = 2C_a(R).

The last equality uses evenness of the product in u. Thus

    N_R = ∫u|g_R|² = M_1+2C_a(R).

The complete-profile curvature bound gives 0<C_a(R)≤C_a(0)exp(-17R²), hence

    M_1≤N_R≤M_1[1+exp(-17R²)].

A minor proof-reading caution: one should obtain this bound after symmetrizing into the positive bridge weight. Directly multiplying the pointwise envelope by the signed weight u and integrating would be invalid. The source's exact C_a(R) identity supplies the needed justification, so this is not a defect in its argument.

For the absolute energy, the exact elementary identity

    (|v+R|+|v-R|)/2 = max(R,|v|), R≥0,

gives

    D_R = ∫|u||g_R|²
        = RM_0 + ∫(|v|-R)_+ f(v)² dv + J_R,
    0≤J_R≤exp(-17R²) M_abs.

Dominated convergence applies to the remaining tail because it is bounded by |v|f(v)². Hence D_R=RM_0+o(1), while N_R→M_1>0. All factors and signs in source lines 206–232 are correct.

The half-line squared energies E_± satisfy E_+=(D_R+N_R)/2 and E_-=(D_R-N_R)/2. Thus

    N_R/D_R→0 through positive values,
    E_-/E_+→1 from below,
    ||g_R||_(negative half)/||g_R||_(positive half)→1 from below.

## 8. Transfer to finite polynomials and what is actually ruled out

The half-line restrictions are bounded maps in H, and the signed form is the bounded multiplication form associated with sgn(u). Thus H-convergence of polynomial vectors to g_R transfers both half-line norms and signed/absolute energies. The positive-side norm of g_R is nonzero.

Given q<1, first choose R so E_-/E_+>q². Then choose a sufficiently close finite polynomial vector p(A)f. Strictness survives the approximation and gives

    ||T_a^-p||_2 > q ||T_a^+p||_2.

Similarly, Q[p]=(1/2)N and the total reflected energy is D. If a fixed ε>0 lower bound Q[p]≥εD held for all polynomial p, continuity would make it hold on V, contradicting N_R/(2D_R)→0. This establishes the stated lack of a positive relative reserve.

The upper bound at constant one is still missing. Unconditionally the argument proves only that the sharp ratio supremum is at least one; it may exceed one or be unbounded if positivity fails. The source correctly says that *if* contraction holds, its sharp constant is exactly one.

## 9. Finite-dimensional metric and conditional essential spectrum

The degree-N Rayleigh minima λ_N decrease because the test spaces are nested. Under the explicitly conditional all-order positivity hypothesis they are nonnegative. Approximation of the g_R sequence forces inf_N λ_N=0, hence λ_N decreases to zero.

For each nonzero finite polynomial vector, analyticity prevents its restriction to a half-line from vanishing without the whole vector vanishing. Therefore its positive-side norm is nonzero. In each fixed finite-dimensional space the ratio extrema exist, and

    q_N² = (1-λ_N)/(1+λ_N).

The monotonicity and limiting value one follow. These are generalized eigenvalues against the absolute-weight Gram matrix, not ordinary eigenvalues in arbitrary polynomial coordinates. A finite fixed-coordinate Gershgorin reserve does not contradict their limit.

For B=P_V sgn(u) P_V restricted to V, the normalized v_R=g_R/√D_R have unit norm and tend weakly to zero. Indeed they tend to zero in H on each fixed compact interval by translated complete-profile decay; compactly supported test vectors are dense in H, and the norms remain one.

Under B≥0, also 0≤B≤I, so

    ||Bv_R||² ≤ <v_R,Bv_R> = N_R/D_R → 0.

They are consequently a singular Weyl sequence for zero, proving zero belongs to the essential spectrum under that assumption. Without B≥0, small quadratic expectations would not imply small residual norms. The source explicitly acknowledges this necessary condition. No essential-spectrum assertion independent of the missing positivity estimate has been established.

## 10. Supporting curvature estimate checked

I also checked the algebra underlying the envelope used above. For x=3+t, the source identity expands to

    (4x+24x/(2x-3)²-19)(2x-3)²
      = 16t³+20t²-24t+9
      = 16t³+20(t-3/5)²+9/5 > 0.

This gives the individual logarithmic-slope derivative bound below -19. The mixture variance estimate is valid: f_n/f_1≤2n⁴exp[-z(n²-1)], the slope difference is at most 2z(n²-1)+2, and (x+1)²exp(-x) decreases for x>1. The first variance-majorant term is less than 8/5; the successive-term ratio is less than 32exp(-15)<10^(-5), so the full variance is less than two. Hence (log ψ)″<-17 follows on the positive half-line and extends by modular evenness. Concavity of log ψ+(17/2)u² yields the exact envelope exp(-17R²).

This argument uses the complete series and its complete infinite tail. It does not borrow a finite theta truncation's properties on the negative half-line.

## Audit conclusion

No substantive correction is required for the audited claims. The principal cautions are already present in the text: keep local and integrated positivity separate; do not swap the fixed-degree and far-tail quantifiers; do not assume global convergence of the translation Taylor series; and keep both the norm-one upper bound and the essential-spectrum positivity hypothesis conditional.

The correct research consequence is a narrowing of viable proof architectures. A single fixed positive local tail cannot settle all degrees, and a uniform strict relative contraction cannot settle the reflected ladder. Any successful all-order proof must retain degree-sensitive localization/cancellation or establish the sharp, non-coercive norm-one bound itself. Neither obstruction resolves the Riemann hypothesis.
