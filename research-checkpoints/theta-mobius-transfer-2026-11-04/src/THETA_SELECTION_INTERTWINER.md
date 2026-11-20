# The common-polynomial theta map: exact rigidity and a fixed-target source-distance obstruction

2026-11-04. Analytic investigation. This note concerns a precise natural map from arithmetic-label weights to the actual theta differential-polynomial source. It proves that this map does not intertwine the two complete selections. It does **not** exclude degree-dependent approximation by other maps or prove a selected theta upper bound.

## Results first

Let `F` be the real even Fourier transform of the smooth theta kernel, with the normalization in the supplied finite-arithmetic audit, and let

    T p = F p' + 2 F' p.

For a finite prefix `1 <= m <= M`, use the audited reflected-derivative prescription, not distributional differentiation of a reflected finite sum.

1. There is an explicit triangular polynomial-coordinate map `p -> R_p`. On the positive half-line,

       p(-iD) phi_m(u) = e^(u/2) exp(-z_m) R_p(z_m),
       z_m = pi m^2 e^(2u).

   The same polynomial `R_p` is evaluated at every label. Its degree is `deg(p)+2`; integer labels are not polynomial degrees.

2. For any nonzero polynomial `q`, either of the exact finite identities

       sum_m p(-iD) phi_m = sum_m c_m q(-iD) phi_m,
       g_(1,p) = g_(c,q)

   forces `p = c_m q` for **every** `m <= M`. Thus all label coefficients must be equal. This is an identity for the complete sums, not merely a coefficientwise convention. Distinct exponential rates prevent cross-label cancellation from evading it. The nonconstant endpoint Mobius vector cannot be realized by this natural map.

3. There is also a genuine total-source norm obstruction for every **fixed** nonzero finite real vector `c` and nonzero real polynomial `q`. Write `G_(c,q)` for the Fourier transform of its prescribed finite reflected source. Every actual polynomial source `T p` is orthogonal to `F 1_I` on every interval `I` between consecutive distinct real zeros of `F`. Consequently

       inf_p ||T p - G_(c,q)||_2^2
         >= sum_I | integral_I F G_(c,q) |^2 / integral_I F^2
         > 0.                                                   (A)

   The infimum allows all polynomial degrees. The strict inequality follows from a nonzero finite-order reflection-boundary jump, which gives `G_(c,q)` an eventually fixed-sign algebraic tail. Section 5 supplies an explicit one-cell lower bound, including a computable tail threshold.

4. The positive bound in (A) is target-dependent. It is **not uniform** when `M`, `q`, or `c` change with degree, and does not contradict the audited source-relative approximation with `M = O(sqrt(n log n))`. It cannot by itself rule out a sufficiently accurate growing-family transfer.

The labels of the GCD model originally index Fourier modulations. Weighting the internal theta summands is a different construction. This note obstructs that latter natural construction; it does not identify the two meanings of an arithmetic label.

## 1. Inputs, spaces, and what is actually being compared

The read-only inputs were:

- `theta_full_selection_20261104/EXACT_GCD_ENDPOINT_SELECTION.md`;
- `theta_full_selection_20261104/ARITHMETIC_FREQUENCY_SEPARATION.md`;
- `theta_finite_arithmetic_reduction_20261104/UNIFORM_FINITE_ARITHMETIC_AUDIT.md`;
- `theta_displacement_response_20261104/THETA_SOURCE_LOCALIZATION_ROUTE_CHECK.md`.

The theta summands are

    phi_m(u) = 2[2 pi^2 m^4 e^(9u/2) - 3 pi m^2 e^(5u/2)]
                     exp(-pi m^2 e^(2u)),                 u >= 0,
    phi_m(u) = m^(-1/2) phi_1(u + log m).

For a real finite label vector `c`, set

    s_c(u) = sum_(m=1)^M c_m phi_m(u),                  u >= 0,
    E_(c,k)(u) = sgn(u)^k s_c^(k)(|u|),                u != 0.

For `q(t) = sum b_k t^k`, define, exactly as in the finite-arithmetic audit,

    f_(c,q) = sum b_k (-i)^k E_(c,k),
    h_(c,q) = sum_(k>=1) k b_k (-i)^(k-1) E_(c,k-1),
    g_(c,q) = -2 i u f_(c,q) - h_(c,q).

The value at `u=0` does not matter for these L2 functions. The factor `k` in `h` is essential. Subscript `1` denotes the vector with all entries equal to one.

For the actual smooth infinite kernel, `g_p` and `h_p` have Fourier transforms `T p` and `F p'`, respectively, with Fourier convention

    hat f(t) = integral_R f(u) exp(-i t u) du.

Thus `X[p]=||T p||_2^2=2 pi ||g_p||_2^2` and `H[p]=2 pi ||h_p||_2^2`.

The GCD endpoint vector is

    c_m = sqrt(m/M) mu(M/m) if m divides M, and 0 otherwise.

It is nonconstant for every `M >= 2`. Nothing in its complete `K`-orthogonality supplies a map to the degree flag of the actual polynomial space.

## 2. An explicit degree-coordinate transform, with no label substitution

Put

    z = pi m^2 e^(2u),
    V(z) = 4 z^2 - 6 z,
    L = 2 z partial_z + 1/2 - 2 z.

The exact identity

    phi_m(u) = e^(u/2) exp(-z) V(z)

gives

    D^k phi_m(u) = e^(u/2) exp(-z) L^k V(z).

Define

    R_p(z) = p(-i L) V(z).

Then, simultaneously for every label,

    f_(m,p)(u) = e^(u/2) exp(-z_m) R_p(z_m),
    h_(m,p)(u) = e^(u/2) exp(-z_m) R_(p')(z_m),
    g_(m,p)(u) = e^(u/2) exp(-z_m)
                       [-2 i u R_p(z_m) - R_(p')(z_m)].          (1)

This is a completely explicit triangular coefficient map. If `r_(k,j)` are the coefficients of `(-i)^k L^k V`, then

    r_(0,1) = -6,       r_(0,2) = 4,
    r_(k+1,j) = -i[(2j+1/2) r_(k,j) - 2 r_(k,j-1)].             (2)

For a degree-`n` polynomial with leading coefficient `b_n`,

    deg R_p = n+2,
    [z^(n+2)] R_p = 4 (2i)^n b_n.                               (3)

In particular the map is injective. Its inverse is obtained by removing the top coefficient using (3), then proceeding downwards in degree.

There is also an exact intrinsic description of its image. The polynomials `R_p` of degree at most `n+2` are precisely those satisfying

    R_p(0) = 0,
    integral_0^infinity z^(-1/2) exp(-z) R_p(z) dz = 0.            (4)

Indeed, integration by parts shows that the linear functional in (4) sends `L R` to `-1/2` times its value on `R`. It vanishes on `V`, since `4 Gamma(5/2)-6 Gamma(3/2)=0`. The target space in (4) has dimension `n+1`, and the `n+1` triangular vectors in (3) are independent. This proves the characterization.

Equations (1)-(4) are a genuine polynomial-degree transform. They do not convert the labels `m` into independent coordinates: every label still sees the same `R_p`, at the argument `z_m`.

## 3. Exact rigidity survives taking the complete arithmetic sum

### 3.1 A finite exponential-polynomial lemma

Let the positive numbers `lambda_m` be distinct. If polynomials `A_m,B_m` obey

    sum_m exp(-lambda_m x)[A_m(x) log x + B_m(x)] = 0,
                                                               x >= 1,

then every `A_m` and `B_m` is zero.

To prove it, take the smallest `lambda_m` with a nonzero pair and divide by its exponential. All later terms are exponentially small as `x -> infinity`. A nonzero polynomial times `log x` plus a polynomial cannot be exponentially small. This is a contradiction. Iteration proves the assertion. The case without `log x` is included.

### 3.2 Value-source and full-source consequences

Suppose for some finite prefix and nonzero `q` that

    f_(1,p) = f_(c,q)

in L2. On `u>0` the functions are analytic, so their equality is pointwise. With `x=e^(2u)` and `lambda_m=pi m^2`, (1) gives

    sum_m exp(-lambda_m x)
       [R_p(lambda_m x) - c_m R_q(lambda_m x)] = 0.

The lemma yields `R_p=c_m R_q` for every label. Injectivity gives

    p = c_m q,                  1 <= m <= M.                     (5)

Exactly the same conclusion follows from equality of the **full sources**

    g_(1,p) = g_(c,q).

The expression for the difference on the positive half-line is

    e^(u/2) sum_m exp(-lambda_m x)
      {-i log x [R_p(lambda_m x)-c_m R_q(lambda_m x)]
                   -[R_(p')(lambda_m x)-c_m R_(q')(lambda_m x)]}.

The logarithmic version of the lemma again gives (5). This argument works for complex coefficients as well.

Consequently there is no exact map, linear or nonlinear, taking arbitrary independent label weights `c` to a common differential polynomial `p` while realizing this specified target. For the Mobius endpoint vector, `c_M=1` forces `p=q`, after which every other coefficient would also have to be one. This fails for all `M>=2`.

The conclusion does not come from deleting cross terms. It follows from an identity of the total source function before taking any quadratic form. It also does not depend on numerical conditioning or fixed-degree limits.

### 3.3 The arithmetic shift has a compulsory mixed term

For completeness, on u>=0 (equivalently for the unreflected positive-half-line analytic functions), translation yields

    f_(m,p)(u) = m^(-1/2) f_(1,p)(u+log m),
    h_(m,p)(u) = m^(-1/2) h_(1,p)(u+log m),
    g_(m,p)(u) = m^(-1/2)
       [g_(1,p)(u+log m) + 2 i log(m) f_(1,p)(u+log m)].          (6)

Here the index `1` in each summand means the single first arithmetic summand, not the full all-ones prefix. Formula (6) retains its `log(m) f` term. The complete norm is the squared norm of the complete sum of these expressions and therefore includes every ordered pair of labels and every mixed term.

## 4. Exact finite-reflection boundary corrections

Finite reflected derivatives cannot silently be replaced by powers of a global derivative. Let

    d_j = s_c^(j)(0),
    F_c(t) = integral_R E_(c,0)(u) exp(-i t u) du.

Distributionally,

    D E_(c,k) = E_(c,k+1) + 2 1_(k odd) d_k delta_0.

Induction gives

    E_(c,k) = D^k E_(c,0)
       - 2 sum_(1 <= j < k, j odd) d_j D^(k-1-j) delta_0.        (7)

For a polynomial `q(t)=sum b_k t^k`, define the finite boundary polynomial

    B_(c,q)(t) = 2 sum_k b_k (-i)^k
                     sum_(1 <= j < k, j odd) d_j (it)^(k-1-j).

Then the exact Fourier identities are

    hat f_(c,q) = q F_c - B_(c,q),
    hat h_(c,q) = q' F_c - B_(c,q'),
    G_(c,q) := hat g_(c,q)
       = F_c q' + 2 F_c' q
                   - 2 partial_t B_(c,q) + B_(c,q').            (8)

All boundary terms are retained. The pieces on the right of (8) need not separately lie in L2: their high-frequency polynomial parts can cancel. Only their complete combination is being used in a norm.

For example, for `q=t^3`,

    B_(c,q)=-2 d_1 t,       B_(c,q')=-6 d_1,
    G_(c,t^3)=3t^2 F_c+2t^3 F_c'-2d_1.

For `q=1`, no boundary polynomial occurs, and `G_(c,1)=2 F_c'`. Boundary regularity still controls the algebraic tail of `F_c'`.

For the actual infinite smooth theta sum the odd boundary jets vanish and there are no corrections. Formula (8) explains precisely why a finite reflection cannot be treated as another smooth `F` in the differential source formula without checking the corrections.

## 5. A quantitative lower bound in the total actual source norm

This section is a separate, stronger distinction than exact coefficientwise rigidity. It compares a **fixed finite target** with the actual smooth-theta sources over **all** polynomial degrees.

### 5.1 Exact cell annihilators for every actual polynomial source

Let `I=(a,b)` be an interval between consecutive distinct real zeros of `F`. No simplicity hypothesis is needed. For every complex polynomial `p`,

    integral_I F(t) T p(t) dt
      = integral_I [F(t)^2 p(t)]' dt = 0.                       (9)

Thus `F 1_I` annihilates the entire polynomial-source space, not just an initial degree block. These functions have disjoint supports for different cells. Bessel's inequality gives, for any `G in L2(R)`,

    inf_(p polynomial) ||T p-G||_2^2
       >= sum_I |integral_I F G|^2 / integral_I F^2.             (10)

The sum may be over any collection of disjoint real zero cells. Every term uses the complete `G`, with all arithmetic cross effects already included. In source coordinates the lower bound is divided by `2 pi`.

### 5.2 Every nonzero finite reflected source has a nonzero boundary jump

Assume `c` is a nonzero finite real vector and `q` a nonzero real polynomial. The function `g=g_(c,q)` is analytic separately on the positive and negative half-lines, has one-sided derivatives of every order at zero, and all its piecewise derivatives are integrable.

It cannot have all derivatives matching at zero. Here is an explicit proof.

On the positive half-line, extend `s_c` analytically to all real `u`. It has an expansion

    s_c(u) = sum_(j>=1) a_j exp(beta_j u),
    beta_j = 2j+1/2,                                          (11)

converging for every finite `u`. Infinitely many coefficients `a_j` are nonzero. Otherwise the entire function

    sum_m c_m V(lambda_m x) exp(-lambda_m x)

would be a polynomial in `x`; its decay as `x -> +infinity` would force it to be zero, contrary to the distinct-rate lemma and `c != 0`.

The analytic continuation of the positive source is

    g_+(u) = sum_(j>=1) a_j exp(beta_j u)
                   [-2 i u q(-i beta_j)-q'(-i beta_j)].          (12)

A nonzero polynomial cannot have double roots at infinitely many distinct `-i beta_j`. Therefore (12) has a first nonzero term and has ordinary exponential, possibly linear-times-exponential, asymptotics as `u -> -infinity`.

In contrast, the prescribed negative-half-line source is a finite combination of reflected theta derivatives and has superexponential decay as `u -> -infinity`. If all one-sided derivatives at zero matched, analyticity and the identity theorem would make these two analytic functions equal. Their different negative-infinity asymptotics forbid that.

Consequently there is a least integer `r>=0` for which

    J_r := g^(r)(0+) - g^(r)(0-) != 0.                          (13)

This establishes a genuine nonzero finite-order boundary defect, without estimating any matrix condition number.

### 5.3 A computable tail threshold and one-cell floor

For real `c,q`, the source obeys `g(-u)=conjugate(g(u))`; hence its Fourier transform `G` is real on the real line. Repeated integration by parts on the two half-lines, keeping every jump, gives

    G(t) = A t^(-r-1) + E(t),
    A = J_r / i^(r+1),                  A is real and nonzero,
    |E(t)| <= C_g t^(-r-2),              t >= 1,                (14)

where one explicit constant is

    C_g = |J_(r+1)| + ||g_pw^(r+2)||_(L1(R)).

Here `g_pw^(r+2)` means separate differentiation on the two open half-lines. The formula follows by using `r+2` integrations; the first `r` jumps vanish by definition.

Set

    T_g = max(1, 2 C_g / |A|).

For all `t >= T_g`, `G(t)` has the sign of `A` and

    |G(t)| >= (|A|/2) t^(-r-1).                                (15)

There are real zero cells arbitrarily far out because the xi function has infinitely many real zeros, the classical unconditional Hardy theorem. This use requires neither RH nor simplicity of zeros. Equivalently, the next bound may be read just for any supplied real zero cell beyond `T_g`.

Choose such a cell `I=(a,b)` with `a>=T_g`. Since `F` has constant nonzero sign in its interior, (15) gives

    |integral_I F G|
       >= (|A|/2) b^(-r-1) integral_I |F|.

Therefore, for every degree and every polynomial `p`,

    ||T p-G||_2
       >= (|A|/2) b^(-r-1)
               [integral_I |F|] / [integral_I F^2]^(1/2)
       > 0.                                                   (16)

In the `u`-source norm the right side is divided by `sqrt(2 pi)`. Dividing by `||G||_2` gives a positive relative approximation floor for this fixed target. The same floor holds if one additionally asks to match the `H` source, since adding a target-form error cannot remove a source error.

For the simplest case `q=1`, if `d_(2s+1)` is the first nonzero odd derivative of `s_c` at zero, then

    F_c'(t) = 4(s+1)(-1)^s d_(2s+1) t^(-2s-3)
                         + O(t^(-2s-4)),
    G_(c,1)(t)=2 F_c'(t).

This is consistent with (13)-(14). In particular, if `d_1 != 0`, the leading source coefficient is `8 d_1/t^3`.

## 6. What this lower bound does and does not establish

The bound (16) is an actual total-source norm lower bound. It is not an estimate in a direct sum of labelwise norms, which would fail to control cancellation in the complete theta source. It applies to every nonzero fixed finite Mobius target and every fixed real nonzero `q`, with no upper restriction on the approximating polynomial degree.

However, its constants and its witnessing cell depend on the target. The first nonzero jump can be very small, its order can change, and `T_g` can move very far out. No uniform lower estimate for (16), relative to the target norm, is established for a growing family `c=c_n`, `q=q_n`, `M=M_n`.

This limitation is mathematically necessary. Even the all-ones finite targets with a fixed `q` converge to the actual source as `M -> infinity`. The finite-arithmetic audit proves the stronger degree-uniform estimate

    ||g_p-g_(1,p,M)||_2 + ||h_p-h_(1,p,M)||_2
       <= exp(C(n+2)log(n+2)-c M^2) sqrt(X[p]).                 (17)

The nodal-cell residual in (10) is bounded above by the squared approximation error in (17), after the Fourier normalization. Thus every fixed finite truncation has a positive residual, but these residuals must become arbitrarily small as the truncation grows. There is no contradiction.

In particular, (16) does not rule out an error of `exp(-A n log n)` for some carefully chosen degree-dependent finite targets. To rule out or justify a proposed growing transfer, one must compare its actual nodal-cell residual, its source normalization, and its `H` error on that same growing family.

## 7. The different modulation map and the remaining selection problem

In the full GCD comparison, a coefficient vector belongs to a Fourier modulation

    f_c(t) = sum_m c_m exp(i t (log m-gamma)).

Multiplying an amplitude by `f_c` translates the **entire** theta kernel in source space. It does not weight just its internal `m`th summand. In particular,

    inverse_Fourier[exp(i t ell) F(t)](u) = psi(u+ell).

Therefore the rigidity theorem for `sum c_m phi_m` is not an impossibility theorem for approximating `q(t) f_c(t)` by algebraic polynomials. The fixed-band arithmetic note already has certain fixed-family Taylor approximation constructions. Their scope remains fixed-family; it supplies no degree-uniform, source-relative approximation of a growing full GCD flag, and no identification of its endpoint normalization with polynomial monicity.

A successful full-selection transfer still needs all of the following on one common growing scale:

1. A concrete map from the arithmetic coefficient flag to the degree flag, with its leading-coefficient functional specified.
2. Source-relative errors for the complete `X` form, including every label pair and any envelope or boundary term.
3. A controlled error for `H`, with the derivative/source mixed terms retained.
4. An argument transporting the entire older-direction constraint, not merely one selected arithmetic trial vector or a short prefix.

The natural internal-theta-summand weighting map fails exactly by Sections 2-3 and has the fixed-target total-norm obstruction of Section 5. The alternative modulation map requires a separate analysis. Neither the Mobius GCD selector nor the finite-arithmetic reduction supplies these four requirements automatically.

## Verification and preservation

All proofs here are finite algebra, analytic continuation, integration by parts with explicit boundary jumps, or exact zero-cell orthogonality. The only additional classical input for strict positivity on arbitrarily distant cells is infinitude of real xi zeros; the explicit cell inequality itself needs only the indicated two endpoint zeros. No numerical sign test, discarded arithmetic cross term, RH hypothesis, or generic conditioning claim is used.

Only this working note was written. No frozen artifact, repository, 4CT material, or external service was changed. The actual full-selected limit `H[P_n]/X[P_n] -> 0` remains open in this analysis.
