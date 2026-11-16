# A regularized arithmetic payment test, and a scalar obstruction

Status: independent analytic review PASS. This is an all-finite-degree error lemma and a counterexample to positivity of the regularized arithmetic approximant. It is not an all-degree positivity proof.

## 1. Arithmetic regularization without a zero-side hypothesis

Let s=sigma+it, sigma>1/2, and
 A(s)=(1/2)s(s-1)pi^(-s/2)Gamma(s/2), X(s)=xi(s)=A(s)zeta(s).
For an integer N>=1 set
 D_N(s)=sum_(k=1)^N k^(-s)+N^(1-s)/(s-1),
 X_N(s)=A(s)D_N(s).
At s=1, X_N is understood by its removable limit. The compulsory integral counterterm is retained before any inequality. Euler summation gives exactly
 zeta(s)=D_N(s)+R_N(s),
 R_N(s)=-s integral_N^infinity {x} x^(-s-1)dx,        (1)
valid for Re s>0 away from the displayed zeta pole. Source: NIST DLMF25.2.8, https://dlmf.nist.gov/25.2#E8 .

Using0<={x}<1 and differentiating the absolutely convergent remainder,
 |R_N|<=N^(-sigma)|s|/sigma,
 |R_N'|<=N^(-sigma)[1/sigma+|s|(log N/sigma+1/sigma^2)]. (2)
These estimates are independent of zeros and of any unknown target pivot.

Fix any real polynomial p, including the actual inverse-selected residual from a known prefix. Define weighted L2 norms over t, and set
 E0=N^(-sigma)||p |A| |s|/sigma||_2,
 E1=N^(-sigma)||p[|A'| |s|/sigma
                +|A|(1/sigma+|s|(log N/sigma+1/sigma^2))]||_2.
Gamma decay makes every displayed norm finite at every finite polynomial degree. The same is true at sigma=1 because A and A' are regular there; X_N is evaluated after pole cancellation.

Let
 K[p]=Re integral p(t)^2 X'(s)conjugate(X(s))dt,
 K_N[p]=Re integral p(t)^2 X_N'(s)conjugate(X_N(s))dt.
Writing X=X_N+e and applying Cauchy only to the remainder gives the rigorous, noncircular bound
 |K[p]-K_N[p]| <= ||p X_N'||_2 E0+||p X_N||_2 E1+E0E1 =: E_N[p].  (3)
Thus K_N[p]>E_N[p] is a sufficient arithmetic test for the actual target. With sigma=1/2+a, functional symmetry and F=2Xi give exactly L_a[p^2]=8K[p]. The polynomial is frozen; no coefficient derivatives or next-pivot normalization enter.

For each fixed sigma,p, X_N and X_N' converge in the indicated weighted norms, and E_N[p]=O(N^(-sigma)log N). The constants depend on the full polynomial, hence on its actual prefix inverse. No degree-uniform constant or uniform positive lower bound for K_N is supplied.

## 2. The regularized approximant is not itself a positive kernel

This can be falsified exactly without a numerical ladder run. Take N=1 and p=1. The pole cancellation gives
 X_1(s)=(1/2)s^2 pi^(-s/2)Gamma(s/2).
Define M_1(sigma)=integral_R |X_1(sigma+it)|^2 dt. The beta integral yields
 integral_R exp(itu)|Gamma((sigma+it)/2)|^2dt
          =4pi Gamma(sigma)/(2cosh u)^sigma.
Its second and fourth moments in t are sigma and sigma(3sigma+2) times the zeroth moment. Consequently
 M_1(sigma)=pi Gamma(sigma+2)(sigma^2+sigma+2)/(2pi)^sigma,
 2K_1[1]/M_1(sigma)
   =digamma(sigma+2)+(2sigma+1)/(sigma^2+sigma+2)-log(2pi).  (4)
At sigma=3/4, monotonicity of digamma gives
 digamma(11/4)<digamma(3)=3/2-EulerGamma.
The elementary bounds EulerGamma>57/100 and log(2pi)>9/5 therefore imply
 2K_1[1]/M_1(3/4)<93/100+40/53-9/5=-611/5300,
                  K_1[1]<-(611/10600)M_1(3/4)<0.          (5)
This is the shift a=1/4. The actual complete-theta scalar target is strictly positive there by the direct positive Hardy integral. So positivity cannot be assigned to every finite *regularized* arithmetic approximant, even at degree0. Its negative contribution must be repaired by the actual remainder and correlations.

## 3. Remaining candidate and scope

A genuinely sufficient all-degree arithmetic lemma would provide an explicit choice N=N(n,a,prefix) and prove K_N[p_n]>E_N[p_n] for every actual selected residual p_n, without assuming K[p_n]>0. The approximation/error estimate (3) is proved; that signed finite-sum lower bound is not. Conditional eventual success when the true target is already positive is not a proof of positivity.

This differs from a zero-side criterion: its approximant and error use only a finite integer Dirichlet sum, the mandatory integral counterterm, Gamma factors and the actual polynomial. Nevertheless, treating those inputs as positive termwise is disproved by(5). Any useful arithmetic proof must preserve their cancellation and establish a degree-dependent margin; no such margin has been obtained here.
