# Full rank-one Müntz factorization and its signed commutator test

Status: independent analytical review PASS. This is a distinct operator test and a failed positivity shortcut, not a new proof of the target sign.

## 1. Recovering the original complete theta, with the counterterm retained

Let phi(x)=exp(-pi x^2), D=x d/dx, and define the rank-one arithmetic Müntz operator on this Gaussian by
P phi(x)=sum_(n>=1) phi(nx)-1/(2x).
The classical Müntz identity gives, initially for 0<Re s<1,
M(P phi)(s)=zeta(s) M phi(s),
M phi(s)=(1/2)pi^(-s/2)Gamma(s/2).
A primary source for the operator and formula is Báez-Duarte, “A general strong Nyman-Beurling criterion,” formula (1.1) and Theorem 2.1/formula (2.10):
https://arxiv.org/html/math/0505453v1

Set k(x)=D(D+1)P phi(x). Integration by parts in the displayed strip gives

M k(s)=s(s-1) M(P phi)(s)=xi(s).                           (1)

No counterterm is dropped before applying the annihilator: D(D+1)(1/x)=0 exactly. Termwise differentiation of the Gaussian series gives
k(x)=2 sum_(n>=1)(2Z_n^2-3Z_n)exp(-Z_n), Z_n=pi n^2 x^2.
Consequently

psi(u)=2exp(u/2)k(exp u), F(t)=2xi(1/2+it).                (2)

These are the original campaign kernel and Fourier transform. Poisson reflection shows P phi(x)=-1/2 plus an exponentially small term at x=0, and the other endpoint is -1/(2x) plus Gaussian terms. The annihilator kills both elementary terms, so k has the complete-theta rapid decay at both logarithmic ends. This also justifies continuation of (1) to the entire xi function. No finite sieve or artificial replacement kernel appears.

## 2. Precise Mellin operator domains

For fixed sigma use H_sigma=L2((0,infinity),x^(2sigma-1)dx) and the unitary Mellin transform
U_sigma f(t)=(2pi)^(-1/2) integral f(x)x^(sigma+it-1)dx.
On the dense core whose Mellin transforms lie in C_c^infinity(R), multiplication by X=log x becomes -i d/dt.

Let T_sigma be the closed Mellin multiplier zeta(sigma+it), on its natural multiplier domain. For 0<sigma<1 this agrees with the Müntz transform where the latter's classical formula applies. It must not be assumed bounded throughout this strip. For sigma>1 it is the bounded absolutely convergent dilation sum sum_(n>=1)K_n, K_n f(x)=f(nx); this is NOT the subtracted physical formula with a non-L2 counterterm in that exterior weighted space. The line sigma=1 is excluded for T_sigma because of its pole at t=0.

On the core,

[X,T_sigma] = multiplier zeta'(sigma+it).                  (3)

Equivalently, in sigma>1 this is the absolutely convergent sum -sum_(n>=1)(log n)K_n, since [X,K_n]=-(log n)K_n.

Let G_sigma be multiplication in Mellin coordinates by
G(s)=(1/2)s(s-1)pi^(-s/2)Gamma(s/2),
and let A_sigma be the complete multiplier xi(s)=G(s)zeta(s). For sigma!=1 in the stated ranges, on the core A_sigma=G_sigma T_sigma. At sigma=1 the completed xi multiplier is used directly; no separately bounded zeta factor is asserted there. The complete multiplier and its derivative extend boundedly along each fixed vertical line by the usual Gamma decay and zeta growth. Thus its full signed commutator below is well defined as a bounded multiplier even when T_sigma separately is unbounded. No unproved bounded inverse or density of an arithmetic dilation span is assumed.

## 3. The exact bridge is a signed commutator, not T*T

Define
B_sigma=A_sigma^*[X,A_sigma]+[X,A_sigma]^* A_sigma.
It is exactly the multiplier

2 Re(conjugate(xi(s)) xi'(s)).                             (4)

For sigma=1/2+a, a>0, the campaign's original normalized bridge density is therefore

Lambda_a(t)=(2/a) B_sigma(t).                              (5)

This uses the previously established functional-symmetry normalization Lambda_a=(4/a)Re(conjugate(xi)xi'). Equation (5) is not asserted at a=0 without its normalized limit.

For an actual polynomial residual p(t), which is not itself an L2 Mellin-coordinate vector, evaluate the completed quadratic form using smooth compact cutoffs p(t)chi_R(t) and then let R tend to infinity. Gamma decay makes the limit integral p(t)^2 B_sigma(t) absolutely convergent. The arithmetic-only sign tests below instead use genuine compactly supported L2 vectors; no polynomial is inserted into an unintegrable arithmetic-only form.

The positive operator A_sigma^*A_sigma instead has multiplier |xi|^2. Its positivity does not control (4). The exact nonsingular product expansion is
Re(conjugate(xi)xi')
=|G|^2 Re(conjugate(zeta)zeta')
 +|zeta|^2 Re(conjugate(G)G').                              (6)
Every arithmetic and archimedean term remains present. At a zeta zero, (6) remains meaningful without division by zeta.

## 4. An unconditional arithmetic sign obstruction

Already for sigma>1, the arithmetic Hermitian commutator
T_sigma^*[X,T_sigma]+[X,T_sigma]^*T_sigma
has multiplier 2|zeta(s)|^2 q_sigma(t), where

q_sigma(t)=Re(zeta'/zeta)(sigma+it)
          =-sum_(n>=2) Lambda_vM(n)n^(-sigma)cos(t log n).   (7)

The series converges absolutely and uniformly. At t=0 it is strictly negative. It also has a strictly positive value somewhere. For a short proof, its symmetric long-interval mean is zero, while its Fourier coefficient at frequency log2 is -(log2)/(2*2^sigma), which is nonzero. If q_sigma were everywhere nonpositive, the mean of |q_sigma| would be zero, forcing every such Fourier coefficient to vanish by the elementary integral bound. This contradiction proves a positive value. Continuity gives intervals of both signs.

Since zeta is nonzero in sigma>1, its modulus square preserves these signs. Smooth Mellin test functions supported in the two intervals give positive and negative quadratic values of this arithmetic commutator. Thus even the actual rank-one arithmetic dilation operator, with a positive norm-square and an absolutely convergent Euler expansion, does not supply a positive bridge commutator by itself.

This does not refute positivity of the full completed bridge in the exterior; the full gamma contribution in (6) must be retained and can compensate. In the critical strip, (7) cannot be used as an absolutely convergent prime-power expansion. Analytically continuing its sign or its termwise inequality there would be unjustified.

## 5. Outcome of this operator test

The full Gaussian/Müntz/annihilator factorization is exact and noncircular, but it does not yield a square factorization of the signed bridge. A proof by positivity of the dilation norm-square fails for the concrete reason in Section 4. Obtaining a one-sided estimate for the completed correlated commutator on the actual selected polynomial space remains the original unpaid sign problem.

The Nyman-Beurling literature supplies approximation criteria, not an unconditional convergence result that may be inserted here. In particular, the cited 2005 source imposes a compact-support hypothesis in its general sufficiency statement; this Gaussian is not compactly supported. No Gaussian approximation-to-RH equivalence or convergence is inferred from that theorem.

The full multidimensional atomic repair criterion also remains unpaid: no favorable actual reservoir cost and no full zero-cross-moment negative witness have been established. This note records a distinct arithmetic operator mechanism tested and the precise positivity implication that fails; it is not counted as an all-degree advance.
