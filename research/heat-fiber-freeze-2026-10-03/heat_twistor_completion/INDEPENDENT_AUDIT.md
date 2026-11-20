# Independent audit: heat transfer, frozen fibers, and the proposed Lambda criterion

Date: 3 October 2026. This is a mathematical review, not a proof-assistant formalization. It audits `HEAT_FIBER_COMPLETION.md`, the specified normalization, the algebraic checks in `verify_identities.py`, and the proposed completion criterion. Nothing in this review certifies a new upper bound for the de Bruijn–Newman constant.

## Verdict

The normalization, heat generator, width-to-time conversion, constant-mode obstruction, commutator formulas, and accumulating-width holomorphic-transfer criterion are correct with the domain qualifications below. The useful completion criterion needs only holomorphy of a scalar transfer, rather than contractivity. Its hypotheses have **not** been constructed for the proposed time and widths. In fact the criterion is equivalent to the required zero-free strip, so it identifies exactly what a successful geometric construction would have to prove; it does not itself supply that construction.

At `t0 = 0.123637595` and `a0 = 0.1`, the conditional conclusion is

    Lambda <= t0 + 2 a0^2 = 0.143637595 < 0.145.

This is correct conditional arithmetic, not a proved numerical bound.

## 1. Normalization and heat direction

Use the standard Polymath normalization

    H0(z) = xi(1/2 + iz/2)/8,
    Ht(z) = integral_0^infinity exp(t u^2) Phi(u) cos(zu) du,
    Xt(w) = 8 Ht(-2 i w).

Then `X0(w) = xi(1/2+w)`, and the change of variables gives

    partial_t Ht = -partial_z^2 Ht,
    partial_t Xt = (1/4) partial_w^2 Xt.

Indeed `partial_w^2 Xt = -32 partial_z^2 Ht(-2iw)`. For real `t`, `Xt` is a nonzero entire even function. Nonzeroness also follows directly from `Xt(0)>0`: every summand of the standard `Phi(u)` is positive for `u>=0`, since `2 pi n^2 exp(4u)>3`.

For positive time increments, the scalar Gaussian representation is

    X_(t+s)(w) = (1/sqrt(pi)) integral_R exp(-v^2) Xt(w+sqrt(s)v) dv.

This is a valid representation for the actual entire heat family, with domination furnished by the defining super-exponentially decaying kernel. It does not automatically define heat evolution of an arbitrary meromorphic angular multiplier on a half-plane.

If all zeros of `X_t0` lie in `|Re w|<=a0`, then all zeros of `H_t0` lie in `|Im z|<=2a0`. De Bruijn's strip contraction gives

    |Im z| <= sqrt(max(4a0^2 - 2s, 0))

at time `t0+s`. Thus `Lambda<=t0+2a0^2`. There is no missing factor of four or sign reversal. See Polymath, equations (1), (4), (35) and Theorem 3.2: <https://arxiv.org/html/1904.12438v2>. Newman's original Theorem 1 states the same strip-contraction principle: <https://www.math.northwestern.edu/~auffing/papers/Newman.pdf>.

## 2. A precise minimal completion theorem

Let `C+ = {w: Re w>0}`. Let `X` be a nonzero entire even function, and let `a0>=0`. Choose pairwise distinct real numbers `a_n>a0` converging to `a0`. Assume that for **every n** there is a scalar holomorphic function `r_n` on **all of C+**, and a nonempty open set `U_n` in `C+` on which `X(w+a_n)` is nonzero, such that

    r_n(w) = X(w-a_n)/X(w+a_n),  w in U_n.

Then all zeros of `X` lie in `|Re w|<=a0`.

Proof. The holomorphic function

    r_n(w) X(w+a_n) - X(w-a_n)

vanishes on `U_n`, so it vanishes throughout the connected half-plane. Suppose `X(lambda)=0` and `Re lambda>a0`. For all sufficiently large n, `w_n=lambda-a_n` belongs to `C+`. Evaluation of the cross-multiplied identity gives `X(lambda-2a_n)=0`. These are pairwise distinct points converging to the finite point `lambda-2a0`. The identity theorem would force `X` to vanish identically, a contradiction. Evenness rules out zeros with `Re lambda<-a0` as well.

Conversely, if all zeros lie in this strip, `X(w+a_n)` is nonzero on `C+` for every `a_n>a0`. The actual ratios themselves are globally holomorphic and satisfy the hypotheses. Thus this scalar criterion is an equivalence.

Important quantifiers and scope:

- The same entire function and the same heat time must occur at all widths. Approximation at varying times does not give the stated theorem.
- The open matching sets may depend on n. A common set, a common norm bound, convergence of `r_n`, or estimates uniform in n are unnecessary.
- A discrete sample of matching values has to have an accumulation point in the analytic domain before the identity theorem applies. Numerical agreement is not an exact identity.
- Global means the entire right half-plane, not a finite-height window or a punctured half-plane with excluded spectral points.
- Pairwise distinctness and infinitely many widths approaching the threshold matter. Repeating one width does not suffice.
- The theorem excludes zeros strictly outside the closed strip. Zeros on its boundary are compatible with the conclusion and sufficient for de Bruijn's non-strict upper bound.
- Contractivity, positivity, a canonical system, and a full spectral realization are possible methods of proving the hypotheses. They are not extra assumptions needed by this scalar proof.
- An operator model suffices if it supplies this holomorphic scalar coefficient by genuinely holomorphic bounded input/output maps. Defining an arithmetic-weighted norm or allowing singular ports that cancel poles does not establish such a coefficient.

This theorem is a precise conditional completion test, not evidence that the hypotheses are easier than the zero-free strip to which they are equivalent.

## 3. Common-zero cancellation is a real obstruction at a fixed width

For any `a>0`, the even polynomial

    P(w) = (w^2-a^2)(w^2-9a^2)

has a zero at `3a`, but cancellation gives

    P(w-a)/P(w+a) = (w-4a)/(w+4a).

The reduced ratio is holomorphic and contractive on `C+`. Its holomorphy does not imply that all zeros of `P` lie in `|Re w|<=a`.

This is not an artifact of real-axis zeros. For real nonzero `gamma`, replace `P(w)` by `P(w-i gamma)P(w+i gamma)`. It is even, real under conjugation, and nonnegative on the real axis, with zeros at real parts `+-a` and `+-3a`. Its ratio is the product of the two corresponding right-half-plane Blaschke factors. The accumulating-width theorem defeats these cancellations because it would require infinitely many distinct zeros with a finite accumulation point.

For one width, holomorphy gives the exact divisibility condition

    ord_lambda X <= ord_(lambda-2a) X

whenever `X(lambda)=0` and `Re lambda>a`. This condition allows finite cancellation chains, rather than excluding the initial zero. A claim of fixed-width completeness must explicitly handle this fact.

## 4. Angular freezing preserves the arithmetic obstruction

In the specified compact picture, `H = L2_even(S3)` and

    A(w)|_(degree 2m) = b_m(w) I,
    b_m(w) = product_(j=1)^m (w-2j)/(w+2j),
    b_0(w) = 1.

For `Re w>0`, each factor has modulus at most one and `A(w)e0=e0` for a normalized constant vector `e0`. Consequently `||A(w)||=1`.

If a freezing operator `F` is a contraction and fixes `e0`, then

    (R(w) A(w) F)e0 = R(w)e0,
    ||R(w) A(w) F|| = |R(w)|

whenever the scalar `R(w)` is defined. The upper estimate uses the contractions, and the lower estimate is the constant vector. Projection onto constants and the usual angular heat semigroup both meet these conditions. Therefore neither suppressing high harmonics nor taking the fully frozen constant fiber improves the scalar bound. A pole in the exact scalar port remains a pole.

This assertion concerns the angular fibers in the specified norm. It is not a no-go theorem for every possible non-angular arithmetic construction. Also, constants form a distinguished compact-group-fixed vector, not a generic invariant subrepresentation for the full noncompact group. Projecting to constants can discard full group covariance and cannot itself count as preserving the entire geometric representation.

## 5. The heat/intertwiner calculation is local until domains are supplied

Let `L=(1/4)d^2/dw^2` and let `M_b` denote multiplication by a differentiable scalar multiplier. The exact differential identity is

    [L,M_b] f = (1/2)b' f' + (1/4)b'' f.

For `b=b_m` with `m>=1`, this is nonzero in general. Multiplication by the frozen, nonconstant angular intertwiner therefore does not commute with scalar heat. For example, `b_1=(w-2)/(w+2)` gives the nonzero residual

    -[L,M_b1] f = -2 f'/(w+2)^2 + 2 f/(w+2)^3.

On any open set avoiding the zeros and poles of `b`, putting `C=b'/b` gives

    M_b L M_b^(-1) f
      = Lf - (C/2)f' + (C^2-C')f/4.

This identity is valid, but its stated restriction is material: `b_m` has zeros at positive even integers and poles at negative even integers. Its inverse is not globally bounded on the fixed angular Hilbert space. A formal conjugation of differential expressions is not a globally conjugate heat semigroup without a common invariant domain, closure/generation results, and justified propagation across exceptional parameters.

Likewise, if `N` and `D` each solve scalar heat and `R=N/D`, then away from zeros of `D`,

    partial_t R = (1/4)R'' + (1/2)(D'/D)R'.

The ratio has a drift depending on its denominator. It does not obey bare scalar heat, and its drift can have poles. Heating the original ratio, heating numerator and denominator separately, and applying heat to an angular product are different operations.

A Gaussian contour used for a meromorphic factor may encounter its poles even when its evaluation point starts in `C+`. A full model must specify which contour, space, pole treatment, and boundary/domain condition it uses. No such global analytic conclusion follows merely from the displayed commutators.

## 6. Finite arithmetic heat is correlated; the infinite bare series diverges

For an exponential mode `exp(qw)`, scalar heat contributes `exp(t q^2/4)`. Thus the bare Dirichlet mode `n^(-w-c)` acquires the factor `exp(t log(n)^2/4)`.

For any fixed complex `w+c` and any `t>0`, the magnitudes of the terms in the proposed infinite bare heated Dirichlet series are

    exp((t/4) log(n)^2 - Re(w+c) log(n)),

which tend to infinity. The terms fail even the necessary condition of tending to zero. This rules out interpreting that series as an ordinary convergent Dirichlet series anywhere at positive time. It does not invalidate the entire function `Xt`, its theta-integral representation, or finite Riemann–Siegel formulas with separately bounded remainders.

For two finite modes, simultaneous heat differs from independent heat by

    exp(t(q+r)^2/4) /
      [exp(t q^2/4) exp(t r^2/4)] = exp(t q r/2).

In particular, for positive integers `m,n`, the additional factor is `exp((t/2)log(m)log(n))`. Coprimality does not remove it. Independent prime heat factors therefore omit cross terms. A shared Gaussian can exactly represent correlated heat for finite sums/products, but positivity or a useful global lower bound still has to be proved afterward. A formal infinite Euler product needs an independently justified convergence/regularization scheme; finite identities alone do not supply one.

There is a second caution: heat acting on a completed term `C(w)n^(-w-c)` also differentiates `C`. The simple exponential weight is exact for the bare exponential mode, not automatically for the full completed term.

## 7. Scalar transfer sufficiency and full model completeness are different claims

If exact global scalar holomorphy and exact local matching are already proved, the theorem in section 2 transfers the zero-strip conclusion without needing a spectral-exhaustiveness theorem for an auxiliary state space. But calling the model itself complete requires substantially more.

For a block pencil

    M(w) = [ A(w) B(w); C(w) E(w) ],

the Schur reduction `A-B E^(-1)C` is an exact invertibility reduction only where the discarded block `E` is invertible on its stated domain. Bounded blocks have the usual triangular factorization. Unbounded blocks require matching domains, closedness, and boundedness or relative-boundedness hypotheses. Zeros or spectrum of `E` cannot be silently discarded; they can account for hidden states and missing multiplicity.

In particular, zero coupling in the current diagonal angular model does not solve this requirement. For `Re w>0`, `b_m(w)` tends to zero as `m` tends to infinity, so the discarded infinite angular block has no bounded inverse on the fixed `L2` space. At positive even parameters it also has a kernel. Compression to the constant harmonic exactly preserves the chosen scalar observation, but it is not a full invertibility-equivalent Feshbach reduction. The initial completion note's phrase "exact reduction" was flagged and corrected in the reviewed version. The general block-pencil claim now explicitly assumes a bounded analytic pencil.

Finite determinants of `Xt(w)A(w)` also contain extraneous geometric factors: the angular multipliers vanish at positive even weights, where the positive theta integral gives `Xt(w)>0` for real `t,w`. Removing these zeros requires a justified relative determinant or other exact observable; it is not harmless cancellation in an unqualified spectral correspondence. The revised completion note correctly states this limitation.

Similarly, an input/output port may fail to see an internal eigenmode through lack of controllability or observability. A perfectly holomorphic scalar coefficient does not prove the full system has no other spectrum. Exact ratio matching is what ties the scalar theorem to the arithmetic function; an unspecified passive realization does not do so.

Finite truncation is not a remedy by itself. Let `S` be the unilateral shift on `l2`, and let `S_N` be its truncated finite shift, extended by zero. Then `S_N` converges strongly to `S`, and every finite pencil `I-zS_N` is invertible for every complex `z`. The limit `I-zS` fails to be invertible for `|z|>=1`. Thus strong convergence plus finite-dimensional invertibility does not establish global invertibility. Uniform resolvent bounds or another suitable convergence theorem are needed. This example is an elementary warning, not a claim about the actual twistor pencil.

A defensible completeness assertion must state the spectral parameter domain, state spaces and operator domains, exact arithmetic identification, the topology of all limiting operations, treatment of continuous/residual spectrum, the invertibility of discarded blocks, and any multiplicity or minimality claim. These have not been replaced by the finite symbolic identities.

## 8. Required next result and audit status

To deduce the target bound by this route, construct at the fixed time `t0=0.123637595`, for infinitely many distinct widths approaching `a0=0.1` from above, scalar functions holomorphic on the entire right half-plane and prove their exact agreement with the shifted `X_t0` ratios on open sets. An independently established operator model is useful only insofar as it proves those statements with nonsingular analytic ports.

The present identities do not provide that construction, all-height estimates, or a complete spectral realization. Angular freezing alone cannot provide it. The positive target margin `0.145-0.143637595=0.001362405` is an arithmetic margin, not an error allowance for an approximate equality in the completion theorem.

Verification record: the supplied symbolic script checks 25 identities, including finitely many angular multipliers, a Schur block factorization, and exact rational target arithmetic. An independent replay on 3 October 2026 returned `checks: 25, all_pass: true`. This confirms those identities only. The proofs above independently justify the general product-rule and holomorphic-transfer arguments; no finite symbolic test proves the missing global estimates.
