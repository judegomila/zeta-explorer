# A non-Gaussian all-order positive bridge reference with the exact first-theta prefactor

2026-11-02. New analytic derivation; independent analytic review passed. This is a reference kernel, not the full modular theta bridge or an RH proof.

## 1. Why a fixed exponential-of-cosh fiber is not enough

The positive function exp[−λ(cosh(2v)−1)] is not positive definite for any fixed λ>0. Its formal moment generating function after rescaling is exp[λ(1−cos t)], an entire bounded periodic function with a strictly positive second Taylor coefficient. If all even Taylor coefficients were nonnegative it would exceed1 at t=2π, whereas its value is exactly1. Thus some even signed derivative moment is negative, already ruling out PD. Equivalently a positive measure with an analytic mgf, nonzero variance, and a bounded real mgf is impossible.

The exact low-order moments satisfy
m0=1, m_(2n)=λΣ_(j=0)^(n−1)(−1)^j binom(2n−1,2j+1)m_(2n−2j−2).
For example the odd two-channel determinant is3λ³(2λ−3), and the next odd three-channel determinant is180λ⁶(4λ³−26λ²+45λ−30). Exact symbolic examples are in exact_model.py. At the natural scale λ=J, the parity block through J=7 is already negative; this is a finite exact regime example, not an asserted asymptotic critical law.

Yet integration can repair every order exactly. For p>0,
∫_0∞ λ^(p−1)e^(−λ) exp[−λ(cosh(2v)−1)] dλ /Γ(p)=sech(2v)^p.
Its Fourier density is
2^(p−2)|Γ(p/2+ik/4)|²/Γ(p)>0.
This follows from the beta integral after exponentiating the integration variable. It retains all cumulants; it is not a Gaussian perturbation.

## 2. Retain the actual first-summand polynomial and the bridge weight

Define on the whole real line, without even reflection,

f(u)=8π²e^(9u/2)(1−3e^(−2u)/(2π))e^(−πe^(2u)).

This equals the first theta summand for u≥0 but is a smooth different extension for u<0, where it may be negative. Define the real even reference

D_a(v)=(1/2)∫_R h sinh(2ah) f(h−v)f(h+v)dh, 0<a≤1/2.

The factor1/2 aligns it with the half-line convention for an even full profile. The theorem below concerns this precise whole-line reference, not the reflected finite head whose endpoint defects were previously disproved.

Set L=2π, p=9/2, q=p+s, A=32π⁴ L^(−p), and
I_s(v)=∫_R e^(2sh)f(h−v)f(h+v)dh.
For q>2, substituting λ=Le^(2h) and c=cosh(2v) gives exactly

I_s(v)=A L^(−s){Γ(q)c^(−q)+(21−6q)Γ(q−2)c^(−q+2)}.       (1)

Indeed the polynomial product is1−6c/λ+9/λ². The full lower integration endpoint isλ=0; replacing it byλ=L is a different kernel and is not allowed in this identity.

Fourier transformation and the Gamma recurrence simplify (1) to

hat I_s(k)=A f_k(s),
f_k(s)=L^(−s)2^(q−4)|Γ((q−2)/2+ik/4)|²[(q−5)²+k²/4].   (2)

This expression is nonnegative. More importantly, the bridge weight is retained exactly:

hat D_a(k)=(A/8)[f_k′(a)−f_k′(−a)].                    (3)

All substitutions, Fourier integrals and s derivatives are absolutely convergent uniformly on compact s intervals in q>2, including |s|≤1/2. At h→−∞ the first summand has exponential decay rate5/2; the positive tail decays doubly exponentially. Extra powers of h from differentiation are harmless.

## 3. Strict convexity and positivity for every frequency

Write q∈[4,5], r=q−5∈[−1,0], x=(q−2)/2∈[1,3/2], y=k/4. Let

g=L^(−s)2^(q−4)|Γ(x+iy)|²,
B=∂_s log g=−logπ+Re Ψ(x+iy),
T=∂_s² log g=(1/2)Re Ψ′(x+iy),
P=r²+4y²,

where Ψ denotes the digamma function, not the theta profile. Then

f_k″(s)=g[(B²+T)P+4rB+2].                             (4)

We need two elementary polygamma facts.

First, Re Ψ′(x+iy)>0 for x≥1. At x=1, reflection and recurrence give, for y≠0,
2Re Ψ′(1+iy)=1/y²−π²/sinh²(πy)>0.
At y=0 it is2ζ(2)>0. The real part is harmonic in the half-plane x>1 and tends uniformly to0 at infinity there (the absolutely convergent trigamma series bounds its modulus by O(1/|x+iy|)). The minimum principle, followed by the strong minimum principle, extends strict positivity to x>1. Thus T>0.

Second, if y²≤1/2 and1≤x≤3/2, the digamma series gives
Re Ψ(x+iy)≤Ψ(x)+y²Σ_(n≥0)(n+x)^−3
           ≤Ψ(3/2)+(1/2)ζ(3)<1/6+5/8=19/24<logπ.
Here Ψ(3/2)=2−γ−2log2<1/6 using γ>1/2 and log2>2/3, and ζ(3)<5/4 follows by an integral tail. Therefore B>0 can occur only if4y²>2.

If B≤0, every term in (4) is nonnegative except none: r≤0 makes4rB≥0, and the final2 is strictly positive. If B>0, then P>2 and completing the square gives

P B²+4rB+2=P(B+2r/P)²+2−4r²/P>0,

because r²≤1. Adding TP≥0 proves f_k″(s)>0 in all cases, including r=y=0 where (4) equals2g.

By (3), hat D_a(k)>0 for every real k and every0<a≤1/2. The density is integrable with exponential decay. Fourier inversion proves D_a is strictly positive definite on every finite set of distinct real nodes and every finite confluent jet family. This is an all-order positive non-Gaussian reference, not a finite-order certificate.

## 4. What is and is not matched to the actual theta problem

The reference retains:
- the entire exponential-of-cosh profile, not a quadratic expansion;
- the exact polynomial prefactor of the first theta summand;
- the exact h sinh(2ah) bridge weight and its normalized small-a limit;
- the full spectral frequency range and every derivative order.

It changes the negative-h extension and omits all higher theta summands. The full target is
C_a(v)=(1/2)∫_R h sinh(2ah)ψ(h−v)ψ(h+v)dh,
using the actual even full ψ. Thus the remainder is exactly

E_a(v)=(1/2)∫_R h sinh(2ah)[ψ(h−v)ψ(h+v)−f(h−v)f(h+v)]dh.   (5)

Every cross term and the negative-h closure correction belongs in E_a. No relative Loewner bound E_a≽−D_a has been proved. The earlier fixed-head/universality obstructions warn against claiming a global strict relative contraction merely from a good approximation. This reference is a candidate for degree-dependent integrated core comparison and exact Schur calculations, not a completed transfer theorem to the full theta kernel.

## Sources and verification scope

The algebra and convexity argument are derived here. Standard Gamma/polygamma identities were checked against NIST DLMF https://dlmf.nist.gov/5.15 (series, recurrence and reflection) and https://dlmf.nist.gov/5.9 (integral representations). No acquired executable code was run. Independent analytic review of this reference theorem has passed; the transfer to the actual full profile remains open.
