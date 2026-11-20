# Independent audit of the completed original-thread factorization

## Result and source grounding

PASS on the core identities, normalization, renormalization, and first-Bessel-block obstruction. No proof of the parameter-derivative positivity was found or claimed. The new representation factors a positive parent, not the target derivative. A further cancellation-preserving formula at small a is derived in Section 7 below.

Read the complete two-page originating assistant message in the private research thread (conversation and message identifiers redacted for repository publication), updated 2026-11-02 18:01:44 UTC. Retrieved original source bundle libfile_3d7f9dd7c9bc81919c227563091a4ba7 and PDF libfile_6aaa2b2c55f48191bf8ab8fdf28b0064. Local editable sources are in foundations/original_factorization/. Only the .tex sources were extracted from the ZIP. The acquired numerical Python script was NOT executed or used as evidence.

Authoritative source reviewed: complete_modular_kernel_attack.tex. Standard Bessel identities were checked against NIST DLMF https://dlmf.nist.gov/10.38.E7 and https://dlmf.nist.gov/10.32.E9. Other displayed computations below are independent derivations.

## 1. Parent autocorrelation and tangent constants

With f_a(u)=exp(au)psi(u), define the half-lag correlation
R_a(v)=integral_R f_a(h-v)f_a(h+v)dh.

Its Fourier transform is (1/2)|hat f_a(k/2)|². In the fixed normalization hat f_a(t)=2Xi(t+ia), so hat R_a(2t)=2|Xi(t+ia)|². The factor 1/2 is the half-lag scaling, not an optional convention.

Evenness in h gives R_a(v)=2 integral_0^infinity cosh(2ah)psi(h-v)psi(h+v)dh, hence

C_a=(1/4)partial_a R_a.

Polarizing g_±=(1±eta u)f_a yields the product difference 4eta h exp(2ah)psi(h-v)psi(h+v). Integrating in h gives 8eta C_a, so the source's divisor 8eta and corresponding Fourier difference divisor 4eta are correct.

## 2. Positive primitive and its transform

Theta(u)=exp(u/2)theta(exp(2u)) is even and psi=(D²-1/4)Theta. Therefore k=2cosh(u/2)-Theta satisfies psi=(1/4-D²)k and is smooth even.

For u>=0,
k(u)=exp(-u/2)-2exp(u/2)sum_(n>=1)exp(-pi n²exp(2u)).

The positive decreasing Gaussian summand has sum strictly smaller than its integral over [0,infinity), namely (1/2)exp(-u). Hence 0<k(u)<exp(-u/2). Its derivatives have the same exponential tail plus super-exponentially small corrections; evenness handles the other end.

For 0<Re(s)<1, integration by parts is justified and gives

integral_R exp((s-1/2)u)psi(u)du
 =-s(s-1) integral_R exp((s-1/2)u)k(u)du.

The left side is 2xi(s)=s(s-1)Lambda(s), so the primitive transform is -Lambda(s). This independently proves the source's Mellin normalization without importing another theta convention.

Consequently F_a(v)=2 integral_R exp(2ah)k(h-v)k(h+v)dh is positive definite and Schwartz for |a|<1/2, with hat F_a(k)=|Lambda(a+1/2+ik/2)|². Although k decays only exponentially, it and every derivative decay exponentially; the same is true of this convolution at each fixed |a|<1/2, which is sufficient for the Schwartz assertions.

## 3. Fourth-order operator constants

Let s=a+1/2+ik/2. Then

|s(s-1)|²=P_a(k)/16,
P_a(k)=[k²+(2a-1)²][k²+(2a+1)²].

Because xi=(1/2)s(s-1)Lambda, this gives 2|xi|²=P_a|Lambda|²/32. Thus

R_a=(1/32)L_a F_a,
C_a=(1/128)partial_a(L_a F_a),
L_a=[D_v²-(2a-1)²][D_v²-(2a+1)²].

The multiplier P_a is strictly positive for 0<a<1/2; at the endpoint a=1/2 it vanishes at k=0, so inversion statements should stay in the open strip. Direct expansion P=(k²+4a²+1)²-16a² gives

partial_a P_a=16a(k²+4a²-1).

This derivative changes sign; positivity of P_a and of F_a does not prove positivity of their parameter derivative.

## 4. Epstein reduction: independent raw-pair computation

For p=a+1/2, A=n²exp(-2v), B=m²exp(2v), Q=A+B and r=AB/Q², put x=exp(2h) in the full-line product integral. The pair contributes

8 integral_0^infinity x^(p-1)[4pi^4 A²B²x^4-6pi³ABQx³+9pi²ABx²]exp(-pi Qx)dx
=8pi^-p Gamma(p+2)rQ^-p[4(p+2)(p+3)r-6p-3].

This matches the source exactly. Independently differentiating Q^-p gives

D_v² Q^-p=4p[p-4(p+1)r]Q^-p,
D_v²(rQ^-p)=4(p+2)[p+2-4(p+3)r]rQ^-p.

Applying the two shifted second derivatives produces 64p(p+1)rQ^-p times the same bracket. Hence the pair equals (1/8)pi^-p Gamma(p)L_aQ^-p. The complete lattice has four copies of the positive quadrant plus the axis term 4zeta(2p)cosh(2pv), killed by D_v²-4p². This establishes R_a=L_a E(p,v)/32 initially for p>1.

Absolute summand integration really needs Re(a)>1/2 here: as h tends to negative infinity the absolute sums of individual theta terms grow like exp(-h/2), so their product with the tilt has size exp((2Re(a)-1)h). The source correctly does not use this uncontinued raw expansion in the difficult strip.

The Mellin split for E gives poles only at p=0,1, with v-constant residues. Since L_a1=16p²(p-1)², the singularities after applying L_a are removable. Analytic continuation then proves the identity in the desired strip. There is no extra additive homogeneous term in R itself.

## 5. Renormalization: correct and necessary

For 1/2<p<1, write
A_p=2pi^-p Gamma(p)zeta(2p),
B_p=2pi^(1/2-p)Gamma(p-1/2)zeta(2p-1).

The rectangular Epstein Bessel expansion for v>=0 is

E(p,v)=A_p exp(2pv)+B_p exp(2(1-p)v)+S_a(v),
S_a(v)=8exp(v)sum_(m,n>=1)(n/m)^a K_a(2pi mn exp(2v)).

The coefficient 8 and aspect-ratio exponents agree with the standard one-dimensional Poisson summation of the lattice Gaussian. Hence the exact smooth even renormalization is

F_tilde=E-2A_p cosh(2pv)-2B_p cosh(2(1-p)v)
       =S_a-A_p exp(-2pv)-B_p exp(-2(1-p)v), v>=0.

It is smooth even by its first expression and exponentially decaying with all derivatives by its second. Applying L_a kills both subtracted modes. Thus L_a(F_tilde-F_a)=0. Both functions are Schwartz and P_a(k)>0, so Fourier inversion forces F_tilde=F_a. This proves the renormalization uniquely and avoids Fourier transforming the exponentially growing raw Epstein function.

Differentiating an individually reflected half-line Bessel expansion without the matching homogeneous corrections would introduce seam distributions. The full renormalized expression avoids this issue; its derivative must be taken as a whole.

## 6. First Bessel block: derivative and sign check

Using D_v acting on exp(v)K_a(x), x=2pi exp(2v), means applying 1+2xD_x to K_a. Reduction with the Bessel ODE gives

L_a[exp(v)K_a(x)]=16exp(v)x²[(x²+9)K_a(x)+6xK_a'(x)].

The source's factor 8/32 then gives R_(a,1)=4exp(v)x²[(x²+9)K_a+6xK_a']. This operator reduction was independently reproduced by exact symbolic algebra.

DLMF 10.38.7 gives partial_order K_order(x)|_(1/2)=K_(1/2)(x)r(x), with r=exp(2x)E1(2x)=integral_0^infinity exp(-u)/(2x+u)du. The source's derivative r'=2r-1/x is correct. Differentiating the block and using K_(1/2)'=-(1+1/(2x))K_(1/2) independently reproduces

C_(1/2,1)'(0+)=x²K_(1/2)(x)[-2x²-36+(2x³+20x²+48x+24)r(x)], x=2pi.

Jensen gives r>=1/(2x+1). The lower-bound numerator polynomial x³-9x²+12x+6 increases on [6,44/7] and equals -8854/343 at 44/7, so it is negative at 2pi. The slope is strictly positive. The even block therefore violates the necessary PD maximum at zero, and continuity carries the obstruction into some shifts below 1/2. This is a rigorous local obstruction to the specific blockwise-PD strategy, not a negative witness for the complete C_a.

## 7. Additional cancellation-preserving small-shift formula

The homogeneous coefficients have a further cancellation that should be retained before taking small-a derivatives:

A_p=2Lambda(1+2a), B_p=2Lambda(1-2a).

Individually they diverge as +1/a and -1/a. Let c be the finite part of Lambda(s) at s=1; explicitly c=(EulerGamma-log(4pi))/2. Define regular even functions

U(a)=Lambda(1+2a)+Lambda(1-2a), U(0)=2c,
V(a)=a[Lambda(1+2a)-Lambda(1-2a)], V(0)=1.

Writing sinhc(x)=sinh(x)/x with sinhc(0)=1, the ENTIRE homogeneous subtraction combines exactly as

Z_a(v)=2A_p cosh((1+2a)v)+2B_p cosh((1-2a)v)
      =4U(a)cosh(v)cosh(2av)+8vV(a)sinh(v)sinhc(2av).

Therefore

Z_0(v)=8c cosh(v)+8v sinh(v),
F_0(v)=E(1/2,v)-8c cosh(v)-8v sinh(v).

The grouped formula is regular and even in a. It removes artificial 1/a and 1/a² cancellations in separate coefficient/derivative estimates. It does not imply a sign for partial_a(L_aF_a), and uniform control as a approaches 1/2 remains a different endpoint issue.

## Scope

The audited original factorization is a valid exact modular reformulation. Its positive parent and positive fourth-order multiplier do not close the open derivative inequality. Raw lattice terms, individual Bessel blocks, and separately divergent renormalization modes cannot be assigned the needed sign independently. Grouped arithmetic relative bounds remain a legitimate next target, not an established theorem.
