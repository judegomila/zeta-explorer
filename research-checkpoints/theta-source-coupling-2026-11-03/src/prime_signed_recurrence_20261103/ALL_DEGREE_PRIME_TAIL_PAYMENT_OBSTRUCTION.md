# At every odd degree the arithmetic prime debit dominates its matching half-source tail

Date: 2026-11-03. Status: independent analytic audit PASS for the expansion, differentiated remainder, signs, and ratio. This is a theta-specific theorem for every fixed finite polynomial degree. It is not a uniform-in-degree estimate, an obstruction to cross-index cancellation, or a negative original Schur pivot.

## 1. Exact objects and result

Fix a real monic polynomial q of definite parity and degree n. It may be an original inverse-selected residual or a residual reselected in an admissible half-sieved old metric. Keep q frozen during every shift derivative.

Let Z=πj and

A_(j,q)(a)=q(−iD_R/2)² A_(f,a)(R) evaluated at R=(log j)/2,
d_a(j)=Σ_(uv=j)(u/v)^a.

For a>0 define the j-index source and arithmetic contributions

s_j(a)=(π/a)j^(−1/2)d_a(j)∂_a A_(j,q)(a),
b_j(a)=(π/a)j^(−1/2)d_a′(j)A_(j,q)(a).                         (1)

Their sums are exactly the half-source and the arithmetic term added back:

S_half[q;a]=Σ_j s_j(a),
D_q(a)/2=Σ_j b_j(a),
h_a[q]=Σ_j(s_j(a)+b_j(a)).                                    (2)

All have the continuous even extension at a=0. At a=1/2 these are the arithmetic/Abel quantities, not a pointwise Euler quotient with its lattice masses deleted.

For every fixed compact real shift interval and fixed q,

A_(j,q)(a)
 = (−1)^n 32·4^n Z^(2n+4)exp(−2Z)
   [1+{a²/4−49/16−n(2n+7)/2}/Z+O_(q,A)(Z^(−2))],              (3)

and, uniformly through a=0,

∂_a A_(j,q)(a)/(a A_(j,q)(a))
 =1/(2Z)+O_(q,A)(Z^(−2)).                                    (4)

For prime j=p, L=log p, the explicit divisor factors give

s_p(a)/b_p(a)
 =a/[2πp L tanh(aL)]·[1+O_(q,A)(p^(−1))].                     (5)

At a=0 this reads

s_p(0)/b_p(0)
 =[1/(2πp(log p)²)]·[1+O_q(p^(−1))].                          (6)

Both s_p and b_p eventually have sign (−1)^n. Their ratio tends to zero uniformly for a∈[0,1/2].

Consequently, at EVERY fixed odd degree:
- the matching prime-index source term is itself negative;
- its magnitude is asymptotically negligible compared with the negative arithmetic term;
- no finite constant C can satisfy |b_p(a)|≤C|s_p(a)| for all sufficiently large primes, even with q fixed and even at a single shift.

This rules out same-index source payment of the odd arithmetic debit. It does not rule out paying these terms from a different arithmetic index or from the complete integrated source reserve.

## 2. A concrete fixed-degree bound over the entire critical shift interval

There exists P_0(q), also uniform over bounded coefficient sets at fixed degree, such that for every prime p≥P_0(q) and every 0≤a≤1/2,

1/[4πp(log p)²] ≤ |s_p(a)|/|b_p(a)| ≤ 3/[2πp log p].            (7)

To obtain it, make the relative error in (5) lie between 1/2 and 2. Use tanh(aL)≤aL for the lower bound. For the upper bound, a coth(aL) increases with a≥0, and

(1/2)coth((log p)/2)=(p+1)/(2(p−1))≤3/2.

The threshold P_0 depends on the fixed polynomial and degree. No bound uniform over unbounded degree or exploding old-inverse coefficients is claimed. In particular, do not extrapolate this asymptotic into the degree-dependent finite core without a separate uniform remainder theorem.

## 3. Derivation of the first two amplitude terms

The exact Bessel expression for the signed single-orbit kernel is

A_(f,a)(R)=16exp(R)[(4Z⁴+9Z²)K_a(2Z)
                   −6Z³{K_(a−1)(2Z)+K_(a+1)(2Z)}].             (8)

At R=(log j)/2 the common factors simplify, giving

A_(f,a)((log j)/2)
 =32Z⁴exp(−2Z)[1+(4a²−49)/(16Z)+O_A(Z^(−2))].                 (9)

For a fixed derivative order k, applying D_R=2Z∂_Z to an amplitude Z^βexp(−2Z) changes its power from β to β+1 and changes the relative first correction c to c−β/2. Repeating gives

D_R^k[Z^βexp(−2Z)(1+c/Z+...)]
 = (−4)^kZ^(β+k)exp(−2Z)
   [1+{c−kβ/2−k(k−1)/4}/Z+...].                              (10)

For the leading term of q² take β=4,k=2n and the coefficient (−1)^n/4^n. This gives (3). Because q has definite parity, every other term of q² has degree at most 2n−2 and affects only the relative Z^(−2) remainder. Thus the displayed coefficients cannot be changed by adjusting the old-inverse lower coefficients.

## 4. Differentiated asymptotics without differentiating an unspecified error

The full-line Bessel integral has a particularly useful exact Gaussian form. Set w=2sinh(t/2) to obtain

K_a(2Z)=exp(−2Z)∫_0^∞exp(−Zw²)
 [cosh(2a arsinh(w/2))/sqrt(1+w²/4)]dw.                        (11)

For a in a compact set, its amplitude is

1+(a²/2−1/8)w²+O_A(w⁴).

The remainder and its first two a-derivatives have the same uniform O_A(w⁴) bound near zero. Away from zero, those derivatives grow at most polynomially in w with logarithmic factors. Splitting at a fixed small positive w and evaluating Gaussian moments gives the standard order expansion with controlled mixed Z/a derivatives. A Z derivative only inserts a power of w² inside this exact representation.

After normalizing by exp(−2Z)Z^(−1/2), the remainder obeys

∂_Z^r∂_a^ell R_a(Z)=O_(A,r,ell)(Z^(−2−r)), ell=0,1,2,

for every fixed needed r. These bounds survive the finite operator q(−iD_R/2)². The normalized remainder for A_(j,q) is even in a, so its second derivative bound also controls its first derivative divided by a, including a=0. This proves (4) rigorously, rather than by formally differentiating an unspecified O term.

At a prime, d_a(p)=2cosh(aL), d_a′(p)=2L sinh(aL). Equations (4)-(6) follow. Absolute convergence of all fixed-degree arithmetic series was proved from full-line single-orbit bounds in the companion recurrence note; no compact-support approximation is involved here.

### Sharper coefficient independent of old lower coefficients

The expansion can be sharpened to

∂_a A_(j,q)/(a A_(j,q))
 =1/(2Z)+(4n−1)/(8Z²)+O_(q,A)(Z^(−3)).                        (12)

Thus the first two ratio coefficients depend only on degree, not on the old-inverse lower coefficients. Their remainder and useful threshold still depend on those coefficients.

For completeness, the base amplitude's second relative coefficient is
γ=a⁴/32−53a²/64+873/512. With β=a²/4−49/16, the second coefficient of its logarithm is γ−β²/2=−a²/16−191/64. Under one D_R differentiation of Z^m exp(−2Z), this logarithmic coefficient changes by β/2−m²/8. Its frozen-order derivative divided by a therefore increases by 1/4 at each differentiation. After 2n derivatives it is (4n−1)/8.

If q(t)=t^n+c t^(n−2)+..., the first lower coefficient contributes −c/(2Z²) to the normalized amplitude. This term is independent of a when q is frozen and does not change (12). For odd n, the logarithm used in this argument is log|A_(j,q)|, or equivalently the logarithm of its positive normalized signed amplitude. Extending the Gaussian expansion through w⁴ and bounding the w⁶ remainder with two a-derivatives proves the differentiated O(Z^(−3)) error.

## 5. Old inverse and reselection scope

The asymptotic applies to any fixed monic definite-parity q, so a finite old-inverse reselection cannot remove the eventual odd sign or the ratio limit. For a family q(a) on a compact shift interval, uniformity requires its coefficients to remain bounded. This is automatic at fixed degree on a compact set where its actual old block stays nonsingular and depends continuously on a, but is not automatic near a singular old block or as degree grows.

All derivatives in (1),(3),(4) are taken with q frozen. A derivative of the moving q(a) would introduce separate coefficient-variation terms and is not used.

The audited Schur transport identity still distinguishes the same-original-q half-source from its reselected Schur source. The present result concerns the arithmetic pieces of whichever fixed residual is inserted. It supplies no lower bound for the reselected integrated source and no bound for the total diagonal debit relative to that source.

### Different original and reselected residuals of the same degree

The leading ratio (5) remains valid if s_p is evaluated on a monic reselected residual q_S and b_p on a different monic original residual q_D of the same degree and parity. Both have exactly the same leading amplitude (3); their lower coefficients first change relative terms of order Z^(−2). The remainder constant now depends on both coefficient sets. Thus this is not avoided by comparing the reselected source with the original residual's diagonal debit. The global positive Schur mismatch remains a separate term and is not ruled out as a cross-index source of payment.

## 6. Consequence for the requested independent payment bound

Theta arithmetic supplies a concrete restriction on any successful payment strategy: at odd selected degrees, it cannot pay the negative high-prime diagonal term by multiplying its matching half-source term by a fixed constant. The actual square-orbit asymptotic forces the opposite scale relation.

This is not proof that the negative tail is large: for each fixed degree both contributions decay exponentially in p, and a finite-core reserve may pay them. Nor does it establish failure of an aggregated inequality. A closing estimate must use cross-index or integrated cancellation together with the actual old inverse. No such all-degree aggregate lower bound has been proved here.

Sources: exact Bessel integral https://dlmf.nist.gov/10.32#E9; complete-theta arithmetic baseline https://github.com/judegomila/mathexplorer/pull/40 at head 6c6c81697fdc527d017dc592b55bea3efa5bb31b; companions TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md and NONEMPTY_PREFIX_PAID_DEBIT_BARRIER.md.
