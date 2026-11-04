# Independent audit of the shifted-moment and full-reselection theorem

2026-11-04. Scope: `MOBIUS_TWIST_CORRECTION.md`, Sections 1–10, including its compact exact-theta packet extension. Only this working audit is written. No frozen artifact, repository, or 4CT file is changed.

## Verdict

**The stated arithmetic-packet theorem passes this independent analytic audit.** For a fixed nonzero nonnegative smooth window compactly supported in `(1,2)`, normalized to integral one, and `1 <= N <= T^(1/100)`, the complete minimizer of the actual Hardy-source form on `c_N=1` satisfies

    H_T[c_X]/X_T[c_X] <<_w (1+log log(N+3))^2/(log T)^2.

The same conclusion holds for the separately reselected compact packets in Section 9 after inserting the actual gamma envelope and retaining the cutoff derivatives. The proof does not identify either endpoint selector with a monic-polynomial selector. It gives no upper bound for the actual selected theta polynomials.

No substantive error remains in the audited draft. Two points that would have invalidated a shorter argument are explicitly retained in the current version:

- The raw twisted `Z'^2` moment contains a `-delta^2(h+2gamma)/4` term. It disappears only after the specified integration-by-parts calculation for the Laguerre core, not by scalar differentiation alone.
- Reselection is controlled in the full arithmetic energy metric by a small endpoint column and a separately proved coercive source matrix. A small value on the old Mobius vector alone would not suffice.

This is an analytic AI-assisted audit, not external peer review or machine formalization.

## 1. Primary-source input and exact scope

[Pratt–Robles, arXiv:1706.04593v3](https://arxiv.org/pdf/1706.04593v3), Theorem 1.1 on page 3, applies to `A(s)=sum_(n<=N) a_n n^(-s)` with general coefficients `a_n <<_epsilon n^epsilon`, complex shifts of size `O(1/log T)`, and a smooth weight supported in `[1,2]` with the stated mild derivative bounds. Its general-coefficient remainder is bounded by

    T^epsilon [T^(3/20) N^(33/20) + T^(1/2) N^(1/2)].      (1.1)

The discussion on page 21 explicitly permits Cauchy differentiation of the uniform shifted errors. The shift-free input in [Bettin–Chandee–Radziwill, Theorem 1, page 2](https://www.math.mcgill.ca/radziwill/BCR.pdf) has remainder

    T^(3/20+epsilon) N^(33/20) + T^(1/3+epsilon).          (1.2)

All uses lie strictly within the general-coefficient length regime `N=T^theta`, `theta<17/33`. The rest of this audit consists of independent algebra, norm estimates, and deductions from these inputs. Neither theorem is being asserted for arbitrary large unnormalized coefficients without a corresponding error multiplier.

The fixed window in the audited theorem satisfies the published smoothness requirements. Auxiliary smooth nonnegative windows may be chosen inside `(1,2)` because the original window and its derivatives have compact support there. Their normalization need not be one: constants then change by a fixed amount.

If desired, a theorem stated with length exactly `T^theta` can be applied uniformly to all smaller integer lengths by padding the coefficient vector with zeros to the top allowed length. No issue at a moving integer endpoint is used in the argument.

## 2. Coefficient normalization and the `N log N` loss

Let

    K(a,b)=gcd(a,b)/sqrt(ab),
    Q(a,d)=sqrt(a/phi(d)) mu(d/a) 1_(a|d).

The elementary divisor factorization gives `Q* K Q=I`. Thus `c=Qy` has `K[c]=||y||^2`. The matrix is triangular and

    c_N=sqrt(N/phi(N)) y_N.

Consequently the endpoint condition is exactly

    y_N=sqrt(A_0),       A_0=phi(N)/N.                   (2.1)

There is no approximation or unnoticed change of affine constraint here.

For any `n<=N`, Cauchy–Schwarz gives

    n|c_n|^2
      <= n^2 sum_(k<=N,n|k) 1/phi(k) ||y||^2.

The elementary product identity implies

    k/phi(k) <= zeta(2) sigma_(-1)(k)
              <= zeta(2)(1+log k).

Hence

    n^2 sum_(k<=N,n|k)1/phi(k)
      <= C n log(2N) [1+log(N/n)]
      <= C N log(2N).

Therefore the draft's uniform bound is correct:

    max_(n<=N) n|c_n|^2 <= C N log(2N) K[c].             (2.2)

To use the primary theorems, take `a_n=sqrt(n)c_n`, divide all coefficients by `M=max|a_n|`, apply the bounded-coefficient theorem, and multiply its error by `M^2`. The common phase `N^(it)` in the centered packet cancels from every undifferentiated absolute square. The zero vector is trivial. This proves uniformity over all coefficient vectors rather than merely over one chosen Mobius trial vector.

After division by `T`, the shifted ordinary error is bounded by `eta K`, where

    eta << N log(2N) T^epsilon
             [T^(-17/20) N^(33/20) + T^(-1/2) N^(1/2)].  (2.3)

The two powers at `N=T^theta` are `-17/20+53theta/20` and `-1/2+3theta/2`. Thus `theta<17/53` suffices. In the derivative theorem's much shorter range `theta=1/100`, these are `-0.8235` and `-0.485`, before the arbitrarily small epsilon and logarithmic factors. There is ample power saving.

For the unshifted BCR input, the second power is instead `-2/3+theta`; the first again gives `theta<17/53`. The stated ordinary-moment range is therefore correct.

## 3. Cauchy differentiation is legitimate, with its full cost

Fix a coefficient vector while differentiating. The shifted integral is holomorphic in both shifts in a small complex polydisc about zero; the heights stay far from the pole of zeta. The main term is also holomorphic there because the apparent pole in the sum of its two terms is removable.

Apply the uniform error estimate on circles of radii `c/log T` inside the permitted shift region. Cauchy's formula yields, for nonnegative `j,k` with `j+k<=2`,

    |partial_alpha^j partial_beta^k R_c(0,0)|
      <= C_(j,k) (log T)^(j+k) eta K[c].                (3.1)

This does not differentiate a pointwise `O` symbol without justification. It uses the holomorphic difference between the actual integral and its complete main term, uniformly bounded on a complex neighborhood.

Factors of `ell(t)=log(t/(2pi))` in the derivative operator cause no hidden variable-weight problem. Expand

    ell(Tx)^m = sum_(r=0)^m binom(m,r)
                      (log T)^(m-r) [log(x/(2pi))]^r.

Only finitely many fixed smooth weights `w(x)[log(x/(2pi))]^r` occur. First derivatives multiplied by `ell` and zeroth derivatives multiplied by `ell^2` cost at most the same `O((log T)^2 eta)` as the mixed second derivative. This fixed-weight expansion is now explicit in the draft.

At nonreal shifts the error matrix need not be Hermitian. The scalar bound for every complex coefficient vector is sufficient for (3.1); after the combinations giving the actual real-weight quadratic forms, the error matrices are Hermitian, so their quadratic-form bounds are exactly operator-norm bounds in the `Q` coordinates. No unjustified entrywise-to-operator conversion occurs.

## 4. Shift algebra and all Stieltjes coefficients

For one pair `a,b`, write

    g=gcd(a,b), u=log(a/g), v=log(b/g),
    sigma=u+v, delta=u-v=log(a/b),
    ell=log(t/(2pi)), h=ell-sigma.

The shifted pair kernel, up to swapping `u,v` according to the conjugation convention, is

    K(a,b) exp(-alpha u-beta v) F_h(alpha+beta),
    F_h(s)=zeta(1+s)+exp(-hs)zeta(1-s).                 (4.1)

The symmetric differentiation used below is unaffected by that swap. With

    zeta(1+s)=1/s+gamma-gamma_1 s+gamma_2 s^2/2+O(s^3),

direct multiplication gives

    F_h(0)=h+2gamma,
    F_h'(0)=-h^2/2-gamma h,
    F_h''(0)=h^3/3+gamma h^2-2gamma_1 h+2gamma_2.        (4.2)

In particular, there is no missing `gamma_1` term in the first derivative: its two contributions cancel. The sign of the `gamma_1` term in the second derivative is negative under the stated convention.

Since `Z=e^(i theta) zeta(1/2+it)`,

    Z'=i exp(i theta)(zeta'+theta' zeta),
    |Z'|^2=|zeta'+theta' zeta|^2.

Replace `theta'` by `ell/2` only after assigning its `O(T^(-2))` error. Applying

    (partial_alpha+ell/2)(partial_beta+ell/2)

to (4.1) gives

    K(a,b) [ F_h'' + h F_h' + (h^2-delta^2)F_h/4 ]
      = K(a,b) [ P(h)-delta^2(h+2gamma)/4 ],             (4.3)

where

    P(h)=h^3/12+gamma h^2/2-2gamma_1 h+2gamma_2.

This independently verifies every coefficient and the crucial nonzero `delta^2` term in the raw derivative moment. The draft retains it correctly.

The approximation to `theta'` contributes `O_w((log T)^2/T^2)K`, by the ordinary and zeta-derivative moment bounds and Cauchy–Schwarz. These bounds can first be obtained from the shifted zeta derivatives themselves, so this estimate is not circular.

## 5. Exact window integration by parts and cancellation

Use the normalized convention

    W_T[c]=(1/T) integral w(t/T) Z^2 |f_c|^2 dt,
    J_T[c]=(1/T) integral w(t/T) Z'^2 |f_c|^2 dt,
    G_T[c]=(1/T) integral w(t/T)(Z'^2-ZZ'')|f_c|^2 dt.

Let `q(t)=|f_c(t)|^2`. All boundary terms vanish, because the window is smooth and compactly supported. The exact pointwise identity

    Z'^2-ZZ''=2Z'^2-(Z^2)''/2

gives

    G_T[c]=2J_T[c]
       -(1/(2T)) integral w(t/T) Z^2 q'' dt
       -(1/T^2) integral w'(t/T) Z^2 q' dt
       -(1/(2T^3)) integral w''(t/T) Z^2 q dt.          (5.1)

For a pair term in `q`, the second derivative contributes `-delta^2`. Thus the second term of (5.1) adds `+delta^2/2` times the ordinary moment. This cancels exactly the `-delta^2/2` ordinary main term in twice (4.3). The remaining full main density is

    2 K(a,b)P(h)
       = K(a,b)[h^3/6+gamma h^2-4gamma_1h+4gamma_2].      (5.2)

This is a cancellation in an integrated Laguerre-core form. It is not a pointwise identity between `Z'^2` and `P(h)`.

Let `D=diag(log(n/N))` and `U=Q^(-1)DQ`. The norm `||U||<=3log N` is verified below. Multiplying an error matrix by `(D_a-D_b)^2` becomes, in the `Q` coordinates,

    (U*)^2 E - 2 U* E U + E U^2.

Its norm is at most `4||U||^2||E||`. Hence the ordinary remainder accompanying the `delta^2` cancellation costs `O((log N)^2 eta)`, already covered by the derivative error. Cancellation of the main term does not silently cancel unrelated remainders.

Choose a fixed smooth nonnegative `w_0` which dominates the absolute values of the required window derivatives. In the stated short range, auxiliary ordinary forms are `O(log T)K` and auxiliary derivative forms are `O((log T)^3)K`. Since `q'=2 Re(f'_c conjugate(f_c))`, Cauchy–Schwarz bounds the last two terms of (5.1) respectively by

    C_w (log N)(log T)/T K[c],
    C_w (log T)/T^2 K[c].

Their sum is `O_w((log T)^2/T)K`. This verifies the exact window-error scale claimed in the draft.

There is a second integration-by-parts identity for the source itself. Direct expansion gives

    |Zf'+2Z'f|^2=Z^2|f'|^2+4Z'^2|f|^2+2ZZ' q'.

Therefore

    X_T=H_T+2G_T+E_w,
    E_w[c]=-(2/T^2) integral w'(t/T)ZZ' |f_c|^2 dt.     (5.3)

The sign, factor two, and power `T^(-2)` are correct. Cauchy–Schwarz with `w_0` gives `|E_w[c]|<=C_w(log T)^2 K[c]/T`. Neither (5.1) nor (5.3) omits a cutoff term.

## 6. Arithmetic coordinates and ordinary corrected selection

In `Q` coordinates,

    Q^(-1) diag(log n) Q = diag(log n)+V,
    V_(d,n)=sqrt(phi(d)/phi(n)) Lambda(n/d) 1_(d|n,d<n).

This follows by Mobius inversion; only prime-power quotients contribute. For `omega_n=sqrt(phi(n))/n`, the weighted row sum of `V` is

    r_d=sum_(m<=N/d,m>1) Lambda(m)/m,

and the weighted column sum is exactly

    t_n=log n+s_n,
    s_n=sum_(p|n)log p/(p-1).

For `p^e||n`, the column contribution is `e log p+log p/(p-1)`, so no prime-power term is dropped. The factorial identity gives `r_d<=2log N`, while `t_n<=2log N`. The weighted Schur test then yields

    ||V||<=2log N,       ||U||<=3log N.                 (6.1)

Writing `K_alpha(a,b)=gcd(a,b)^(2alpha)/(ab)^alpha`, differentiation of its divisor factorization gives

    B_1=Q* K_alpha'|_(alpha=1/2) Q = 2S-V-V*,
    S=diag(s_n).                                      (6.2)

The stronger additive row/column estimate `r_d+t_d<=log N+s_d+C`, proved from the elementary Chebyshev bound, implies

    B_1 >= -(log N+C)I,
    ||B_1||<=log N+3s_max+C.

Thus the ordinary corrected kernel is coercive precisely in the range claimed by the draft, without assuming a lower Euclidean eigenvalue for `K`.

Its full last-column residual is `-v_N`, where `v_N=Ve_N`, and

    ||v_N||^2=sum_(p|N)(log p)^2/(p-1)=R_N.             (6.3)

For each prime, summing the totient ratios over all admissible prime powers gives exactly `1/(p-1)`. The Schur-complement minimizer displayed in the draft consequently permits every one of the `N-1` older coordinates to change. Its sign and normalization are correct.

## 7. Concrete cubic derivative bounds and coercivity

Let `Q_alpha` be the exact triangular whitening matrix of `K_alpha`, and set

    C(z)=Q^(-1)Q_(1/2+z),
    B(z)=Q* K_(1/2+z) Q.

For complex `z`, use the holomorphic transpose, not conjugate transpose:

    C(z)^T B(z) C(z)=I.

The analytic square-root branches in `Q_alpha` exist near zero because the Jordan-totient factors are nonzero there. At real zero the transpose identity agrees with the real matrix identity, and all matrices used for quadratic-form estimates are Hermitian.

The differential relation

    C'=L_op C-C J,
    L_op=diag(log n)+V,
    J(z)=diag(log n+sum_(p|n) log p/(p^(1+2z)-1))

is correct. With `h_N=log N`, its input bounds are

    ||L_op||<=3h_N, ||J||<=2h_N,
    ||J'||<=4h_N^2, ||J''||<=24h_N^3,
    ||C'(0)||<=3h_N.

The last derivative estimates follow from `p/(p-1)^2<=2` and `p(p+1)/(p-1)^3<=6`. They lead to the valid generous bounds

    ||C''(0)||<=29h_N^2,       ||C'''(0)||<=209h_N^3.

Differentiating `C^TBC=I` gives, successively,

    ||B_1||<=6h_N,
    ||B_2||<=[2(29)+4(3)(6)+2(3)^2]h_N^2=148h_N^2,
    ||B_3||<=[2(209)+6(29)(6)+6(3)(148)
                      +6(29)(3)+6(3)^2(6)]h_N^3
             =4972h_N^3.                              (7.1)

All product-rule terms and their multiplicities are present. These are valid concrete estimates, though not optimized.

Because `K_alpha^(j)=(-sigma)^j K` at `alpha=1/2`, the relative matrix of the cubic density (5.2) is exactly

    (ell^3 I+3ell^2B_1+3ell B_2+B_3)/6
      +gamma(ell^2I+2ell B_1+B_2)
      -4gamma_1(ell I+B_1)+4gamma_2I.                   (7.2)

For `r=log N/ell`, the leading cubic's relative error is at most

    18r+444r^2+4972r^3.

At `r=0.0101`, the value is `0.232215096572<1/4`. For `N<=T^(1/100)` and sufficiently large `T`, this inequality holds throughout the window. The lower-degree terms are uniformly `O((log T)^2)`; the errors from Sections 3–5 are smaller still. Thus the draft's concrete bounds

    (log T)^3 K/10 <= G_T <= (log T)^3 K/3             (7.3)

hold for sufficiently large `T`, with the threshold allowed to depend on the fixed window. Positivity is asserted for the entire finite-dimensional integrated quadratic form. It does not require `Z'^2-ZZ''` to be pointwise nonnegative.

## 8. Small endpoint columns, including higher derivatives

Set `ell_N=1+log log(N+3)`. Elementary Chebyshev partial summation, splitting at a number comparable to `log N`, gives for every fixed `j>=1`

    sum_(p|N)(log p)^j/(p-1) <<_j ell_N^j.              (8.1)

The exact two-variable identity

    ((exp(uD)c_0)^T K(exp(vD)c_0))/A_0
      = product_(p|N)
          [1+(1-p^(-u))(1-p^(-v))/(p-1)]               (8.2)

is correct even when `N` is not squarefree. In each prime-power component, the Mobius sum has precisely the two possibilities of removing that prime or not; the original prime exponent cancels from this normalized expression.

After differentiating `k` times in both variables, each contributing nonconstant factor receives at least one derivative in each variable. The total sign is positive, and every resulting prime sum is covered by (8.1). Consequently

    K[D^k c_0] <= C_k A_0 ell_N^(2k).                  (8.3)

This is stronger than substituting the full norm bound `||U||^k`, and is what controls the endpoint columns.

The exact selected identity `B(z)v(z)=a(z)e_N`, with `v^(k)(0)=U^k e_N`, then yields

    B_j e_N=a^(j)(0)e_N
       -sum_(k=1)^j binom(j,k)B_(j-k)U^k e_N.

Combining (7.1), (8.1), and (8.3) gives

    ||B_j e_N|| <<_j (1+log N)^(j-1)ell_N, j=1,2,3.    (8.4)

The leading scalar cubic contributes no older-coordinate column. Thus the complete actual Laguerre-core matrix satisfies

    ||Pi Q*G_TQ e_N|| <<_w (log T)^2 ell_N.             (8.5)

Uniform operator errors can be inserted into this column bound directly. No claim that the whole cubic perturbation is `O(ell_N/log T)` is needed or made.

## 9. Complete actual source reselection

Let `M_X=Q*X_TQ`. Equations (5.3) and (7.3), the nonnegativity of `H_T`, and the ordinary moment upper bound give

    c_w (log T)^3 I <= M_X <= C_w (log T)^3 I.

Furthermore

    Q*H_TQ=U*(Q*W_TQ)U,
    ||Ue_N||=sqrt(R_N),
    ||Q*W_TQ||=O_w(log T),

so its endpoint column has norm `O_w((log T)^2 ell_N)`. Together with (8.5) and the small window error,

    ||Pi M_X e_N|| <= C_w (log T)^2 ell_N.              (9.1)

Write the full older principal block as `A_X` and the full older endpoint column as `r_X`. Strict coercivity gives an inverse and the exact unique minimizer on (2.1):

    y_X=sqrt(A_0)(-A_X^(-1)r_X,1).

Hence

    ||y_X-sqrt(A_0)e_N||
      <= C_w sqrt(A_0) ell_N/log T.                    (9.2)

This solves the entire constrained problem, not a divisor-supported restriction. The new coefficients may occupy indices that do not divide `N`.

Applying `U`, using (6.1), and using `log N<=0.01 log T` now gives

    K[Dc_X] <= C_w A_0 ell_N^2.

Finally,

    H_T[c_X] <= C_w A_0 (log T) ell_N^2,
    X_T[c_X] >= c_w A_0 (log T)^3.

Their quotient is the claimed theorem. For `N=1`, the Hardy derivative numerator is zero, so the conclusion is immediate. For every allowed varying sequence `N(T)`, the bound tends to zero because `ell_N=O(log log T)`.

## 10. Gamma-envelope conversion and its strict boundary

For the standard Xi normalization, the exact positive amplitude on `t>0` is, up to the fixed normalization of `F`,

    a(t)=(1/2)(t^2+1/4) pi^(-1/4)|Gamma(1/4+it/2)|,
    F(t)=-a(t)Z(t).

This follows from the [definition of xi](https://dlmf.nist.gov/25.4.E4). The [gamma/digamma asymptotics](https://dlmf.nist.gov/5.11) give

    g(t)=a'(t)/a(t)=-pi/4+7/(4t)+O(t^(-2)),

so the boundedness required in the draft is valid. A constant nonzero normalization or overall sign has no effect on the quotient.

Choose a real smooth cutoff `eta` compactly supported in `(1,2)` and normalize `integral eta^2=1`. This chooses a permitted special window `w=eta^2`; it does not assert that every nonnegative smooth window has a smooth square root. Define

    p_c(t)=a(t)^(-1) eta(t/T) f_c(t)

on positive heights and zero elsewhere. The support is a compact subset of `(T,2T)`, so this is a smooth compactly supported global function despite the rapidly growing reciprocal envelope. No division by the zeros of `Z` occurs.

The exact identities are

    Fp_c'=sigma[eta Zf_c'+(eta'/T-g eta)Zf_c],
    Fp_c'+2F'p_c
      =sigma[eta(Zf_c'+2Z'f_c)+(g eta+eta'/T)Zf_c].      (10.1)

The signs of `g` and all cutoff terms in the draft are correct. The squared norm of the added source summand, divided by `T`, is `O_w(log T)K`. Its mixed term with the original source is `O_w((log T)^2)K`, uniformly in `c`. Thus the total Hermitian source perturbation is `O_w((log T)^2)K`, which preserves coercivity and the endpoint-column estimate. The source must then be reselected again; the draft does so.

For that new minimizer, the first identity in (10.1) yields an upper bound by

    C_w (log T)(K[Dc]+K[c]).

This establishes the compact-packet quotient claimed in Section 9.

The conversion has a precise limitation. These packets are generally complex and are not algebraic polynomials; their cutoff, reciprocal envelope, endpoint condition, and older subspace depend on the packet construction. Neither smooth polynomial approximation nor a common-frequency shift automatically preserves the monic functional and its complete lower-degree space. The theorem therefore supplies no identification with the actual theta polynomial selector and no proof of its desired determinant limit.

## 11. Audit conclusion and remaining open work

The primary shifted input, coefficient normalization, differentiation, Stieltjes terms, both integrations by parts, arithmetic derivative matrices, concrete coercivity, higher selected columns, complete reselection, and compact gamma-envelope extension are mutually consistent. The current theorem can be retained with the explicit hypotheses and scope above.

The unproved step is a transfer to the actual degree-selected theta polynomial problem, including its affine constraint, entire older polynomial space, and global localization. That step is not supplied by this theorem and must remain labeled open. No numerical sign scan, RH assumption, or unproved pointwise Laguerre sign is used by the audited result.
