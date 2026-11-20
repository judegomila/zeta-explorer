# A simpler monic comparison sharpens the actual packet-leverage obstruction

Date: 2026-11-04. Analytic derivation with independent AI-assisted audit; not machine formalization or external peer review. No numerical degree scan is used. The conclusion concerns the explicit actual-theta mesoscopic packet hierarchy, not the truth or failure of selected derivative coherence or RH.

## Result

For the actual-theta packets, notation and uniform compact parameter class in EXPONENTIAL_PACKET_LEVERAGE.md, a simpler monic competitor improves the exponent to

    nu = 2 log 3 - 2 = 0.197224577336219... > 0.

Uniformly over L in the stated compact interval,

    limsup_(n->infinity) (1/n) log sup_L theta_n(p_(n,L)) <= -nu.  (1)

Thus all consequences of that note hold with any 0<rho<nu instead of 0<rho<eta_*/2. In particular, EVERY sufficiently large exact-degree packet in this family is exponentially close in X to its full old prefix, and any triangular hierarchy made from them has exponentially large selected diagonal synthesis coefficients. Its weighted-absolute derivative synthesis sum diverges.

This sharpening does not need the earlier monic comparison's optimization or the monomial arithmetic asymptotic. It uses only true-theta exponential moments, an explicit Chebyshev polynomial, and the already proved actual packet source-norm lower bound.

## 1. A monic Chebyshev competitor in both parities

Fix 0<beta<c=pi/2. The actual theta transform satisfies

    K_beta = integral_R (1+t²)exp(beta|t|)(F²+F'²) dt < infinity.

For integer n>=1 put

    B_n = 4n/(3beta),
    R_n(t) = 2(B_n/2)^n T_n(t/B_n).

Since the leading coefficient of T_n is 2^(n-1), R_n is monic of degree n and has exactly the required parity. No zero or positivity property of the theta potential is used.

For |x|<=1, |T_n(x)|<=1 and |T'_n(x)|<=n². For x=cosh u>=1,

    |T_n(x)|=cosh(nu)<=exp(nu),
    |T'_n(x)|=n sinh(nu)/sinh u
             <= n² exp((n-1)u) <= n² exp(nu).             (2)

The derivative bound follows either by summing the n exponential terms of U_(n-1)(cosh u), or by continuity at u=0. Negative x is identical by parity.

For x>=1 the weighted upper exponent is

    f(x)=2 arcosh x-(4/3)x.

Its unique maximum is at x=sqrt(13)/2 and equals

    f_max=2 asinh(3/2)-(2/3)sqrt(13)<0.                    (3)

Here is an exact elementary certificate for the strict sign, avoiding reliance on its decimal value. Set y=sqrt(13)/3. Then

    sinh y > y+y³/6+y⁵/120
           = 12229 sqrt(13)/29160 > 3/2,

because

    4 * 12229² * 13 - 9 * 29160² = 123768532 > 0.

Since sinh is increasing, asinh(3/2)<sqrt(13)/3, proving (3).

Inside the interval [-B_n,B_n], the weight is at most one. Outside, (2)-(3) apply. Thus the following finite-degree estimates hold:

    S_0 := sup_t exp(-beta|t|)R_n(t)²
          <= 4(B_n/2)^(2n),
    S_1 := sup_t exp(-beta|t|)R'_n(t)²
          <= 4(B_n/2)^(2n)n⁴/B_n².                       (4)

The inequalities remain valid in odd parity; it is unnecessary for the supremum to occur at t=0.

## 2. The true-theta monic norm bound

Using the exact positive source norm rather than a signed potential decomposition,

    X[R_n] = integral_R (F R'_n+2F'R_n)²
       <= 2 integral F² R'_n²+8 integral F'² R_n²
       <= K_beta(2S_1+8S_0).

The monic selected norm therefore obeys the finite bound

    A_n <= X[R_n]
        <= 4 K_beta [8+2n⁴/B_n²](B_n/2)^(2n).             (5)

In particular,

    log A_n
       <= 2n log(2n/c)-2n
             -nu n+2n log(c/beta)+O_beta(log n),            (6)

with nu=2log3-2. Positivity of nu follows from e<3. The polynomial prefactor in (5) is harmless and explicitly retained. K_beta may diverge as beta increases to c; no endpoint estimate is asserted.

## 3. Actual packet leverage

Recall k=n-j, j=sd=o(n), T=2k/c and L>4/c. The preceding packet note proves uniformly

    2 log |ell_n(p)|
       <= -2k log(2k/c)+2j log(2/(Ln))+O(1),
    log X[p] = -2k+O(log n).

When ell_n(p)=0 the leverage is zero and needs no logarithm. Otherwise insert these bounds and (6) into theta_n=A_n ell_n(p)²/X[p]. The exact leftover expression is

    2j log(4/(cL))+2k log(n/k)-2j <= 0.

Consequently for every fixed beta<c,

    log theta_n(p_(n,L))
       <= -nu n+2n log(c/beta)+O_beta(log n),               (7)

uniformly in L. Divide by n, take limsup, and only then let beta increase to c. This proves (1). No uniform control of K_beta near c is needed. The constant nu is an achieved exponent, not claimed optimal.

## 4. Exponential synthesis cost

For any triangular basis formed by taking one exact-degree packet from this class in each sufficiently large parity degree, complete the initial finite prefix by a fixed triangular basis. Let G_N be the actual X Gram of the normalized packets e_j, and let the last degree be n. Complete selection gives exactly

    (G_N^-1)_(NN)=1/theta_n(e_N),
    |c_(N,N)|=theta_n(e_N)^(-1/2),
    q_n=sum_(j<=N)c_(j,N)e_j.

For any 0<rho<nu, all sufficiently large n therefore satisfy

    (G_N^-1)_(NN)>=exp(rho n),
    |c_(N,N)|>=exp(rho n/2),
    kappa_2(G_N)>=exp(rho n).

Using the actual packet asymptotic H[e_N]~(3pi²/16)/log²n,

    sum_(j<=N)|c_(j,N)|sqrt(H[e_j])
       >= C exp(rho n/2)/log n -> infinity.                 (8)

This rules out both a uniform Riesz lower bound and the previously proposed uniformly bounded or exponentially localized absolute synthesis-column criterion for this family. It does not rule out estimates that preserve exact derivative cancellations in the large signed synthesis, other packet families, or redundant nontriangular representations with different degree profiles.

No positivity of Delta_n, no bound on U_n/Delta_n, and no RH conclusion follows. All prior checkpoints and live 4CT scripts remain unchanged.

## Verification and attribution scope

SHARPER_CHEBYSHEV_AUDIT.md independently checks the finite comparison and all rate conversions. The packet lower norm and its uniformity are inherited from the frozen notes listed in EXPONENTIAL_PACKET_LEVERAGE.md; the audit does not claim a new independent verification of their published Hardy-Z moment inputs. No literature-novelty claim is made for the Chebyshev bounds, monic extremal principle, or Gram identities.
