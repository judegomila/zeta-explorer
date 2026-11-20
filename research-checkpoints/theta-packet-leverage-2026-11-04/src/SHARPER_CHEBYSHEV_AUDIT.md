# Independent audit of the sharper Chebyshev monic comparison

2026-11-04. Verdict: the proposed bound is sound and improves the uniform leverage exponent from eta_*/2 to nu=2log3-2. This audits the elementary comparison independently; it continues to inherit the uniform actual-theta packet lower norm from the supplied mesoscopic theorem.

## 1. Monicity and weighted supremum

Fix 0<beta<c and integer n>=1. Write B=4n/(3beta) and

    R_n(t)=2(B/2)^n T_n(t/B).

The leading coefficient of T_n is 2^(n-1), so R_n is monic of degree n. Since T_n has parity n, it is an admissible same-parity monic competitor for A_n.

For |t|<=B, exp(-beta|t|)|T_n(t/B)|^2<=1. For x=|t|/B>=1, let u=arcosh x. Then |T_n(x)|=cosh(nu)<=exp(nu), and

    exp(-beta|t|)|T_n(t/B)|^2
        <= exp(n f(x)),
    f(x)=2arcosh x-(4/3)x.

For x>1, f'(x)=2/sqrt(x^2-1)-4/3. Its unique maximum occurs at x=sqrt(13)/2, with

    max f = 2asinh(3/2)-(2/3)sqrt(13)<0.

The supplied exact certificate is correct. Set y=sqrt(13)/3. Then

    sinh y > y+y^3/6+y^5/120
           =12229sqrt(13)/29160 > 3/2.

The last strict inequality follows by squaring positive quantities:

    4*12229^2*13 - 9*29160^2 = 123768532 > 0.

Hence y>asinh(3/2), as required. Therefore, globally,

    sup_t exp(-beta|t|)|R_n(t)|^2 <= 4(B/2)^(2n).

No numeric approximation is required for this conclusion.

## 2. Derivative control

For |x|<=1, |T_n'(x)|<=n^2. Outside the interval, using parity and x=cosh u with u>=0,

    |T_n'(x)| = n sinh(nu)/sinh u
              <= n^2 exp((n-1)u)
              <= n^2 exp(nu).

The middle inequality follows from the exact finite exponential sum

    sinh(nu)/sinh u
       = exp((n-1)u)+exp((n-3)u)+...+exp(-(n-1)u),

whose n terms are each at most exp((n-1)u). At u=0 use continuity. The same weighted exterior bound from section 1 therefore yields

    sup_t exp(-beta|t|)|R_n'(t)|^2
        <= 4(B/2)^(2n) n^4/B^2.

## 3. Actual-theta X norm and exponent

Let K_beta be the finite true-theta exponential-moment constant from the supplied notes. The elementary inequality

    |F R_n'+2F'R_n|^2 <= 2F^2 R_n'^2+8F'^2 R_n^2

and the preceding suprema give

    A_n <= X[R_n]
        <= 4K_beta [8+2n^4/B^2](B/2)^(2n).

The extra (1+t^2) factor in the definition of K_beta causes no issue: discarding it only decreases the exponential integral. This bound applies directly to both parities and requires neither old-prefix Q positivity nor any inverse-gap estimate.

Since n^4/B^2=(9beta^2/16)n^2, the prefactor contributes O_beta(log n) to the logarithm. Consequently

    log A_n <= 2n log(2n/(3beta))+O_beta(log n)
             = 2n log(2n/c)-2n
               -nu n+2n log(c/beta)+O_beta(log n),
    nu=2log3-2=0.197224577336219... >0.

Positivity follows exactly from e<3. In contrast to the earlier parity competitor, no conversion from r=(n-epsilon)/2 is necessary.

## 4. Uniform packet leverage and consequences

For the same fixed-parameter mesoscopic family, use its top-coefficient and norm estimates. Write j=n-k=sd. The exact leftover contribution is

    2j log(4/(cL))+2k log(n/k)-2j <= 0

because L>4/c and log(1+j/k)<=j/k. Thus

    log theta_n(p_(n,L))
        <= -nu n+2n log(c/beta)+O_beta(log n),

uniformly over the specified compact L interval. Parameters at which the leading coefficient vanishes have theta=0 and are harmless for this upper bound.

Take the degree limsup with beta<c fixed, and only afterward let beta increase to c:

    limsup_n (1/n)log sup_L theta_n(p_(n,L)) <= -nu.

No uniform estimate for K_beta at beta=c is needed or claimed. For every 0<rho<nu, theta_n<=exp(-rho n) uniformly for all sufficiently large degrees.

The triangular-hierarchy consequences sharpen accordingly:

    liminf log((G_N^(-1))_(NN))/n >= nu,
    liminf log |c_(N,N)|/n >= nu/2,
    liminf log kappa_2(G_N)/n >= nu.

The weighted absolute synthesis sum has logarithmic lower rate at least nu/2 per degree n, using H[e_N] asymptotic to 3pi^2/(16log^2 n). All prior scope restrictions remain essential: this rules out the uniform absolute estimates for the explicit mesoscopic hierarchy, not cancellation-sensitive derivative synthesis, different packet systems, RH, or selected coherence.

## 5. Status of the constant

nu is a rigorously achieved exponent, not claimed optimal. The convenient rational scale 4/3 was selected to admit the exact negative-exterior-phase certificate. Optimizing the scale within the Chebyshev competitor family could slightly strengthen it, but is not needed for any of the preceding conclusions.
