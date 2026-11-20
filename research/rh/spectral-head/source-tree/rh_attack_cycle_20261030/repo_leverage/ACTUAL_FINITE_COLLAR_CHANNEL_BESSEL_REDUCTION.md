# Actual finite-collar channel Bessel reduction

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Exact actual-head theorem; producer pending independent audit.** This removes the collective-channel convergence issue from the hard-edge candidate. It does NOT bound the remaining single-channel budget by the ideal value, control trace repairs, or establish a Weil/gamma-complement floor.

Let {e_n} be the real orthonormal prolate basis on [-lambda,lambda] and H_n(t)=F(e_n 1_[-lambda,lambda])(t), using exp(2pi ixt). Let B_lambda be any finite selected subset, in particular the actual signed chi_n>=1/2 positive-even head. No modal asymptotics are assumed.

Write Lambda=lambda² and let W=lambda h>0. For integer j>=2 define an ACTUAL operator K_(j,lambda):ell²(B_lambda)->L²([-1,1],d_xi) by

    k_(j,lambda)(xi,n)
       =lambda^(-1/2) integral_0^W
           H_n(lambda+tau/lambda) exp(-2pi i xi tau/j)d_tau.

Put U_(j,lambda)=M_j K_(j,lambda), with

    M_j(xi)=exp(-2pi i Lambda xi/j).

All intervals and sums here are finite. In particular no Abel limit, endpoint normalization asymptotic, or differentiated counting formula is involved.

## 1. Uniform row and derivative bounds by Parseval

Completeness of the additive source basis gives, for every real t,

    sum_(all n)|H_n(t)|²
      =||exp(2pi ixt)||²_L²[-lambda,lambda]=2lambda.

Restricting the sum and applying the vector-valued triangle inequality therefore proves

    ||k_j(xi,.)||_ell² <=sqrt2 W,
    ||partial_xi k_j(xi,.)||_ell²
       <=(2pi/j)sqrt2 integral_0^W tau d_tau
        =sqrt2 pi W²/j.                                (1)

These hold uniformly in xi, the selected modes, support, and arithmetic label. In particular K_j is Hilbert--Schmidt.

## 2. Exact cross-channel estimate, with both endpoints

For j!=l, U_j*U_l is the integral over -1<=xi<=1 of the rank-one outer product k_j(xi,.)* k_l(xi,.) times exp[2pi i Lambda xi(1/j-1/l)]. The derivative of this outer product has Hilbert--Schmidt norm at most

    2pi W³(1/j+1/l).

Each endpoint outer product has Hilbert--Schmidt norm at most2W². Integration by parts, retaining BOTH endpoints, yields

    ||U_j*U_l|| <=||U_j*U_l||_HS
       <= [2W²/pi+2W³(1/j+1/l)]
                /[lambda² |1/j-1/l|]
       <= C_W jl/[lambda²|j-l|],
    C_W=2W²/pi+2W³.                                    (2)

This is an estimate on the actual source-coordinate operators, not only on a scalar trace or an ideal kernel. It also holds after any orthogonal compression of the source coordinates, including mean/origin/source-endpoint restrictions.

For 2<=j<=J define

    b_lambda² =max_(2<=j<=J)||K_(j,lambda)||²,
    beta_lambda²=max_(2<=j<=J)||K_(j,lambda)||_HS²,
    epsilon_(lambda,W,J)=2C_W J²(1+log J)/lambda².

The block Gram of the direct-sum synthesis (f_j)->sum U_j f_j has diagonal blocks <=b_lambda² I and off-diagonal block-row sums <=epsilon. The operator-valued Schur estimate proves

    ||sum_(j=2)^J a_j U_j g||
      <=sqrt(b_lambda²+epsilon)
          (sum_(j=2)^J |a_j|²)^(1/2)||g||
      <=sqrt(beta_lambda²+epsilon)
          (sum_(j=2)^J |a_j|²)^(1/2)||g||.              (3)

For the actual localization scales W=(1+loglambda)^6 and J=O((1+loglambda)^8), epsilon=O((1+loglambda)^34 log(2+loglambda)/lambda²)=o(1). This assertion requires no rate in a prolate asymptotic theorem.

## 3. Exact connection to the retained arithmetic collar

Suppose J<lambda², as eventually holds at the above scales. Every label2<=j<=J then satisfies j<=lambda t throughout lambda<=t<=lambda+h, so the moving first-shell cutoff causes no deletion inside this low-label block.

For any actual positive-head test u, the exact inverse-chi representation is u=Fq on [-lambda,lambda], with ||q||<=2||u||. Put q_tilde(xi)=sqrt(lambda)q(lambda xi); its L²[-1,1] norm equals ||q||. For H_g=sum g_n H_n, the actual full-even low-label pairing is exactly

    -2 sum_(j=2)^J mu(j)/j integral_lambda^(lambda+h)
           H_g(t) conjugate(u(t/j))dt
      =-2 <q_tilde, sum_(j=2)^J mu(j)/j U_j g>.          (4)

The sign convention of the complex inner product is fixed by the explicit integral in (4); the absolute estimate is unaffected. Since lambda/j<=lambda and (lambda+h)/j<=lambda when h<=lambda and j>=2, all test evaluations are inside its finite-Fourier input interval. This condition is assumed here and holds eventually for h=(1+loglambda)^6/lambda.

Combining (3)-(4),

    |B_low(u,g)| <=4 sqrt(beta_lambda²+epsilon)
                      sqrt(zeta(2)-1)||u||||g||.        (5)

Equation (4) is the literal first-shell defect on the previously established mean/origin/source-endpoint-null source space. For unrestricted sources the known finite-rank repair terms must still be added; this note does not remove them.

## 4. Precise remaining local target

The collective issue is reduced to a SINGLE-CHANNEL estimate, uniform for2<=j<=J:

    limsup_(lambda->infinity) beta_lambda²
       <= H² :=4(log4-3/4)[4atanh(1/2)]/(32pi²).        (6)

If (6) were proved, (5) would give the candidate budget0.4274536654... . The ideal Coulomb model proves its own counterpart of (6), but **(6) for the actual finite collar is NOT proved here**. Weak endpoint spectral-measure convergence plus compact normalized shape convergence do not automatically imply it on W growing like log^6lambda.

One exact scalar representation, useful for attacking this target, is

    ||K_j||_HS²
      =(1/lambda) integral_-1^1 sum_(n in B_lambda)
           |integral_0^W H_n(lambda+tau/lambda)
                         exp(-2pi i xi tau/j)d_tau|² d_xi. (7)

Equivalently this is the positive double integral of the ACTUAL Fourier-head projector kernel, with the finite sinc factor obtained by integrating exp[-2pi i xi(tau-tau')/j]. Neither the upper collar boundary nor selected-head projection can be dropped. The trace-null, arithmetic-sign, and gamma-metric conclusions remain separate from this purely collective reduction.
