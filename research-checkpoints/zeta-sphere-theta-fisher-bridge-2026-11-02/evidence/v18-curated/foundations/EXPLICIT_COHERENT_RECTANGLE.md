# Explicit full-theta coherent certificate on a finite rectangle

## Result

For the COMPLETE theta profile, the shear is strictly positive throughout

1/10 <= a <= 1/4,     |t| <= 1.

The proof below verifies the coherent head–tail phase certificate with the explicit head N=3 and its EXACT infinite arithmetic tail. It uses elementary analytic bounds, not numerical quadrature or any RH assumption. This deliberately conservative low-height rectangle is not a novel zero-free region and supplies no all-height theorem; its purpose is to demonstrate an actually closed instance of the proposed constructive certificate.

Work in w=a+it, F(w)=xi(1/2+w). Primes mean the outward holomorphic derivative d/dw. Put H=integral f_3(u)cosh(wu)du and R=integral r_3(u)cosh(wu)du, so F=H+R exactly. All integrals below run over nonnegative u unless indicated.

## 1. Elementary bounds for the full theta profile

Write p(n,u)=4 exp(u/2)r(2r-3)exp(-r), r=pi n²exp(2u). For u>=0 all terms are positive. Using 3<pi<22/7 gives

0<psi(u)<=80 sum_(n>=1) n^4 exp(9u/2-3n²exp(2u)).                 (1)

Throughout take A=1/4. Since cosh(Au)<=exp(Au) and exp(2u)>=1+2u,

P_j:=integral u^j psi(u)cosh(Au)du
 <=80 j! sum_(n>=1) n^4 exp(-3n²)/(6n²-19/4)^(j+1).             (2)

The n=1 contribution is below 3.2 for j=0 and 2.56 for j=1, using exp(-3)<1/20 and 6-19/4=5/4. For n>=2, the scalar sum is at most 2*2^4 exp(-12)<32*10^-5; successive terms decrease by a ratio below 1/2. Since 6n²-19/4>19, these tails add less than 0.002 in either case. Therefore

P_0<4,       P_1<3.                                            (3)

For u in [0,1/4], 3<r=pi exp(2u)<6. The function r(2r-3)exp(-r) is decreasing for r>=3, since its derivative is -(2r-1)(r-3)exp(-r). Thus the first theta summand obeys

f_1(u)=p(1,u)>=216 exp(-6)>8/15,                                (4)

using exp(6)<405. In particular the integrals restricted to [0,1/4] satisfy

integral f_1(u)du > 2/15,
integral u² f_1(u)du > 1/360.                                  (5)

Every elementary exponential comparison used here can be checked directly by the exponential power series; none depends on a special-function sign theorem.

## 2. Uniform spatial-tail bounds

For j=0,1,2 let E_j=integral_1^infinity u^j psi(u)cosh(Au)du. Put u=1+x. Since exp(2)>7 and exp(19/4)<120, (1) gives

E_j <=9600 [sum_(n>=1)n^4 exp(-21n²)]
                 integral_0^infinity (1+x)^j exp(-37x)dx.

The sum is at most 2exp(-21)<2*10^-9. For j<=2 the integral is at most 1/37+2/37²+2/37³<0.03. Therefore

E_j<10^-6, j=0,1,2.                                           (6)

These bounds also hold with psi replaced by any positive finite head f_N.

## 3. Head phase positivity for the whole rectangle

For |t|<=1 and 0<=u<=1, cos(tu)>=cos(1)>1/2. For 0<=t<=1, sin(tu)>=tu/2 on 0<=u<=1, whereas |sin(tu)|<=tu everywhere. Also sinh(au)>=au for a>0.

Using only the portion [0,1/4] for the positive lower bounds in (5), and allowing the whole region u>=1 to have the adverse sign with bound (6), gives, for every N>=1 and a in [1/10,1/4],

Re H >= (1/2)(2/15)-E_0 > 1/16,
Re H' >= (a/2)(1/360)-E_1 > 1/8000.                            (7)

For 0<=t<=1,

Im H >= t[(a/2)(1/360)-E_1]>=0,
Im H' >= t[(1/2)(1/360)-E_2]>=0.                              (8)

At negative t both imaginary parts reverse sign. Hence their product is always nonnegative, and

W_head=Re(H' overline H)
      =(Re H')(Re H)+(Im H')(Im H)>1/128000.                    (9)

Moreover (3) gives |H|<4 and |H'|<3. In particular H never vanishes here. Thus

mu:=Re(H'/H)=W_head/|H|² > 1/2048000,
|H|>1/16,       |H'/H|<48.                                   (10)

All of these estimates are uniform across the stated rectangle, including t=0.

## 4. The exact theta-index tail for N=3

For R_j(A)=integral u^j r_3(u)cosh(Au)du, formula (2) restricted to n>=4 gives

R_j(A)<=80 j! sum_(n>=4)n^4 exp(-3n²)/(6n²-19/4)^(j+1).

The sum is at most 2*4^4 exp(-48)<1024*10^-21, using exp(-48)<2*10^-21. The denominator is greater than 91. Consequently the very loose but convenient bounds

R_0(A)<10^-17,       R_1(A)<10^-17                            (11)

hold. The tail is not dropped, independently declared positive in Fourier space, or replaced by an unrelated correction: (11) encloses its exact value and derivative at every point of the rectangle.

## 5. Verification of the coherent condition

Set q=H'/H, u=R/H and v=(R'-qR)/H. The exact identity is

W_full/|H|²=mu|1+u|²+Re[v overline(1+u)].

By (10)–(11), independently of the unknown full shear,

|u|<=rho:=16*10^-17,
|v|<=eta:=16(1+48)*10^-17=784*10^-17.

Clearly rho<1 and

mu(1-rho) > (1-rho)/2048000 > eta.

Therefore W_full>0 throughout the entire rectangle. This is an actual verified finite-domain application of the phase-aware coherent-tail criterion. The decisive bounds came from positive low-u theta mass, explicit control of the adverse spatial tail, and explicit control of the arithmetic theta-index tail.

## 6. Coupled-matrix interpretation and limits

The full shear is the coherent quadratic form of the exact head–tail 2x2 coupling matrix at vector (1,1). It is not necessary, and in general is false, that this matrix be positive semidefinite for every independent head/tail vector. The present certificate bounds precisely the physical coherent sum.

The general correlated-tail 3x3 S-procedure certificate in modular_approximants/signed_pair_certificate.md also passes independent review: for x=(H,H'), y=(R,R'), J=[[0,1/2],[1/2,0]], and y*D^-1 y<=1, positivity of

[[J+lambda D^-1, Jx], [x*J, x*Jx-lambda]], lambda>=0,

is sufficient because its quadratic form at (y,1) equals W_full+lambda(y*D^-1y-1)<=W_full. Its Schur complement and the ellipsoid D=m integral r k k* are correct. An optimized ellipsoid may improve domains, but no global feasibility claim follows.

This rectangle does not reach high zeta zeros, does not establish the a->0 quantifier, and does not eliminate the need for new all-height sign information. It is a concrete, fully controlled starting case for a coupled-tail certificate rather than another conjectural positivity decomposition.
