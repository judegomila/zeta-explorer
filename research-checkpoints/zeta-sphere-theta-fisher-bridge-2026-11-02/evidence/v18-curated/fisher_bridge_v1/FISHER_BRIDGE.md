# Actual-theta Fisher bridge and the unpaid signed residual

2026-11-02. Exact derivation; independent review pending. No RH or all-order positivity claim. No acquired code executed.

## 1. Genuine bridge probability and a uniform Fisher bound

Use the full even positive theta profile ψ, ℓ=log ψ, and the already audited bound ℓ''<−17. For a>0 let

ρ_a(h)=h sinh(2ah)ψ(h)^2/C_a(0), h>0.

This probability is positive without any Fourier positivity assumption. Set r_a(h)=2h coth(2ah). Its parameter score and Fisher information are exactly

s_a=r_a−Eρ r_a,    I_a=Eρ s_a²=Varρ(r_a).

For a parameter-dependent finite vector V(a,h),

∂_a Eρ V = Eρ(∂_a V)+Covρ(V,r_a).                         (1)

The covariance part e satisfies, in Loewner order,

e e^T <= I_a Covρ(V).                                    (2)

This follows by scalar Cauchy–Schwarz in every vector direction; it survives arbitrary fixed whitening. The explicit feature drift in (1) cannot be dropped.

Put x=2ah. Then

r_a'(h)=2(coth x−x csch²x),   0<r_a'<2,

because sinh x cosh x>x and (1−exp(−2x))/2<x for x>0. The bridge potential U_a=−log ρ_a obeys

U_a''=1/h²+4a² csch²(2ah)−2ℓ''>34.

The one-dimensional Brascamp–Lieb variance inequality gives

I_a <= Eρ[(r_a')²/U_a''] <= 2/17.                         (3)

It also yields the directional bound |Covρ(V,r_a)|² <=(1/289) Eρ|V'|² for scalar V. The singular endpoint h=0 presents no missing boundary term: ρ_a=O(h²), the natural zero-flux Dirichlet-form realization applies; equivalently use convex interval truncation and pass to the limit. All finite derivative observables have finite moments by theta decay.

This is a uniform-in-degree coefficient, NOT a uniform bound on jet covariance or whitened drift. It must not be advertised as a uniform relative error.

### Regular parameter at a=0

ρ_0 is proportional to 2h²ψ². Although r_a starts with 1/a, centering removes this constant:

s_a=(4a/3)(h²−Eρ_a h²)+O(a³),

in each finite-moment norm. In λ=a² coordinates,

s_λ -> (2/3)(h²−Eρ_0 h²),
I_λ -> (4/9)Varρ_0(h²).

Thus I_a→0 is parameter degeneracy, not evidence of a cost-free all-order bridge.

## 2. The positive parent is a Hellinger Gram, not the target

Let Z(a)=∫R exp(2au)ψ(u)²du and p_a(u)=exp(2au)ψ(u)²/Z(a). Define g_a=exp(au)ψ and

K_a(v)=∫_0∞ cosh(2ah)ψ(h−v)ψ(h+v)dh
      =(1/2)∫R g_a(u−v)g_a(u+v)du.

Then

K_a(v)/K_a(0)=∫R sqrt[p_a(u−v)p_a(u+v)]du.

This is a positive-definite Hellinger-affinity kernel for any positive ψ of sufficient decay. Its translation Fisher information only controls the local curvature: if J_a=∫p_a[(log p_a)']², then the displayed affinity equals 1−J_a v²/2+o(v²). The target is C_a=(1/2)∂_a K_a, a parameter derivative of an unnormalized positive Gram. Derivatives of positive Gram matrices need not be positive.

For direct jet normalization put B_j(a,u)=(-2)^j(D+a)^jψ(u)/ψ(u). The parent jet Gram Γ has

Γ_ij=(Z/2)E_p[B_i B_j],  ∂_a B_j=−2j B_(j−1).

Its target H=(1/2)∂_aΓ therefore has the exact general formula

H_ij=(Z/4)E_p[2u B_iB_j+(∂_aB_i)B_j+B_i(∂_aB_j)].        (4)

On either parity block (i,j both even or both odd), the feature-drift integral is zero by integration by parts: its derivative-pair total order is odd. Hence, within each parity block,

H_ij=(Z/2)E_p[u B_iB_j].                                  (5)

This retains a signed weight u under an unquestionably positive measure. No Fourier density has been treated as a probability.

Let m_a=E_p u>0 and σ_a=2(u−m_a), the tilt score. Then

(2/Z)H = m_a E_p[BB^T]+(1/2)Cov_p(BB^T,σ_a).              (6)

The target is positivity of this precise sum, not positivity of Fisher information Var_p σ_a. The latter is <=2/17 by the same curvature bound, but covariance in (6) has no prescribed sign.

## 3. Exact Schur residual and a valid sufficient Fisher test

Assume only that the complete previous target block A is positive, as established at a finite rung. Adjoin a feature B_n of the same parity, and set β=A^-1 b, R=B_n−β^T B_lower. Then the actual Schur residual is

S=(Z/2)E_p[u R²]
 =(Z/2){m_a E_p R²+(1/2)Cov_p(R²,σ_a)}.                   (7)

This is an exact signed regression residual. It is NOT a conditional variance or a Fisher-matrix Schur complement. Minimization over β is valid because A>0, not because u p_a is a positive measure.

A constructive sufficient (not necessary) inequality is

m_a E_p R² >= (1/2)sqrt[I_p(a) Var_p(R²)],                (8)

The non-strict inequality proves S>=0 only; carrying a positive-definite induction needs strict > in (8), or an additional strictness argument. Here I_p=Var_p σ_a=4Var_p u. Equivalently, the negative score-covariance in (7) must fit within the positive m_a energy. The square root in (8) may be replaced by a tighter signed covariance calculation. This supplies an actual checkable inequality for the next rung; proving it uniformly in n is presently missing. It will often be too wasteful near a=0: m_a=O(a), while absolute Cauchy loses reflection cancellation. The unnormalized target H vanishes at a=0, so β=A^-1b here is defined only for a>0. At a=0 one must use the normalized target H/a and its positive previous block, or a same-parity residual with a finite coefficient limit. For such a residual R² is even and σ_0 odd, so the covariance is exactly zero before differentiation. Preserve that cancellation rather than infer a singular obstruction from (8).

## 4. What information relaxation gives, exactly

For either positive density μ above, let Lf=f''+(log μ)'f' be its reversible diffusion generator, with natural boundary conditions, and P_t its Markov semigroup. For centered finite-energy F,G,

Covμ(F,G)=∫_0∞ Eμ[(P_t F)'G']dt.                         (9)

Proof: differentiate E[(P_tF)G], use reversibility/integration by parts, and integrate to the stationary limit. Strong curvature supplies exponential L² relaxation and the standard Poincaré bound; it does not fix the sign of the integrand.

For the full-line tilt p_a, define the positive Stein kernel

τ_a(u)=[1/p_a(u)]∫_u∞(x−m_a)p_a(x)dx.

Then Cov_p(u,F)=E_p[τ_a F'] by direct integration by parts. Formula (7) becomes the exact relaxation/Stein cost identity

2S/Z=m_a E_p R²+2E_p[τ_a R R'].                          (10)

Equivalently the last term is ∫_0∞ E[(P_t u)'(R²)']dt. This is the missing signed coupling. Fisher, Poincaré, and log-Sobolev control magnitudes/decay, not its favorable sign. The theta-specific derivative-feature subspace or a sharp joint drift/covariance cancellation must provide the remaining domination. An arbitrary L² observable cannot satisfy E[uF²]>=0, since it can be supported on u<0; the restricted actual derivative features are essential.

A positive ordinary Gram has a nonnegative regression Schur residual by construction; turning (7) into such a Gram without paying its signed weight would assume the very result sought. Even for an ordinary Gram, the residual is variance after linear projection, not generally the full probabilistic conditional variance unless the relevant conditional expectation lies in the chosen span.

## 5. Integration with the orbit twin ladder

The companion orbit_covariance_transport_v1 packet establishes actual-theta pair-law chi-square transport <=801/160000 and retains Cov(V) plus explicit drift. The present continuous bridge-score inequalities are complementary, not a replacement:

- orbit tilt: e e^T <= χ² Cov_orbit(V);
- bridge shift a: e e^T <= I_a Cov_ρ(V), I_a<=2/17;
- actual signed Schur target: equations (7), (10).

For orbit features R_j=f_n^(j)/f_n, with score S_n=f_n'/f_n,

R_j'=R_(j+1)−S_nR_j,
∂_h E_p R_j=E_p R_j'+Cov_p(R_j,S_n)
             =E_p R_(j+1)−(E_pS_n)(E_pR_j).

The explicit drift and information covariance cancel exactly. Bounding their magnitudes separately can destroy the useful twin-ladder structure. This identifies the right research target: preserve that joint recurrence inside the actual lower-block metric, then dominate the negative term in (7) or (10), uniformly across rung and permitted shift.

The all-order tail-PD shortcut is already refuted. None of these probability or entropy identities reinstates it. Existing H5 all-shift and odd-degree19 at a=0 remain finite validated footholds only.

## References and provenance

All displayed theta-specific identities and score bounds are derived above from the campaign definitions and audited ℓ'' bound. Standard covariance-inequality context: Carlen, Cordero-Erausquin, Lieb, *Asymmetric Covariance Estimates of Brascamp–Lieb Type and Related Inequalities for Log-concave Measures* (2011), https://arxiv.org/abs/1106.0709. Original variance inequality: Brascamp–Lieb (1976), https://collaborate.princeton.edu/en/publications/on-extensions-of-the-brunn-minkowski-and-pr%C3%A9kopa-leindler-theorem/ . Standard diffusion/curvature context: Gentil, *Logarithmic Sobolev inequality for diffusion semigroups* (2010), https://arxiv.org/abs/1009.3421. No source asserts the needed theta Schur domination.

## Addendum: a nondegenerate small-shift Fisher constant

The λ=a² endpoint information also has a concrete bound, so the regularization is not merely formal. Under ρ_0∝h²ψ(h)², integration of (h³ψ²)' gives

3+2Eρ0[hℓ'(h)]=0.

Evenness gives ℓ'(0)=0, and ℓ''<−17 implies ℓ'(h)<−17h. Thus Eρ0 h²<=3/34. Applying Brascamp–Lieb to h², with U_0''=2/h²−2ℓ''>34, yields

Varρ0(h²)<= (4/34)Eρ0 h²<=3/289,
I_λ(0)=(4/9)Varρ0(h²)<=4/867.

Boundary terms vanish at both endpoints. This is the regular bridge-parameter Fisher constant, not the distinct orbit-law Fisher information I(h) or its h-decay rate.
