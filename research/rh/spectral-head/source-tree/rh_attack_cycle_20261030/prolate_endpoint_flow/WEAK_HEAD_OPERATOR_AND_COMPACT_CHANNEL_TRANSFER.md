# Weak head-projector limit and compact-channel transfer

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. Supplement to the frozen strong-edge endpoint-measure note. This proves an operator-level fixed-collar transfer. It does not assert norm convergence of the head projectors or a complete growing-label signed pairing bound.

## 1. Weak operator limit for the actual positive head

Use H,K_c,B_c,R,M_c,A,U_c and P_+,c from `STRONG_EDGE_LIMIT_AND_POSITIVE_PHASE_MEASURE.md`. Define the actual head projector

    P_head,c=P_+,c 1_[1/4,1](K_c).

Then, in the WEAK operator topology on H,

    M_c* P_head,c M_c -> (1/4) 1_[1/4,1](A).             (1)

This is stronger than the constant-vector endpoint measure but weaker than strong convergence. In fact its non-projector limit precludes strong convergence.

Proof. Let a,b be arbitrary fixed elements of H. With the unitary angular-frequency full-line Fourier transform and zero extension,

    B_c* M_c a(x)=sqrt(c) F(Ea)(c(x-1)),
    B_c  M_c a(x)=sqrt(c) F(Ea)(-c(x+1)).                 (2)

Both have norm at most ||a||. The first has vanishing norm on x<=1-epsilon as c->infinity, by the L2 Fourier tail of Ea; the second similarly concentrates at -1. After multiplication by M_c* they remain bounded and endpoint-concentrated, hence tend weakly to zero. Also M_c* R M_c a=exp(-2icx)a(-x) tends weakly to zero by the Riemann--Lebesgue lemma applied to products of L2 functions.

Let h(t)=1_[1/4,1](t) and g(t)=h(t)/sqrt(t), with g(0)=0. The strong limit T_c=M_c*K_cM_c->A implies

    h(T_c)->h(A), g(T_c)->g(A) strongly.                 (3)

Indeed h and g are bounded, with their only discontinuity at 1/4, and A has no spectral atom there in any vector: after the tanh/sech unitary, A is multiplication by the strictly monotone continuous logistic function a(xi). The standard discontinuous-functional-calculus assertion in (3) follows by continuous upper/lower approximation of a neighborhood of that point and its vanishing limiting spectral mass.

Apply P_+=(I+U+R+U*)/4 and U h(K)=B g(K). In a matrix coefficient between a and b, the identity term converges strongly by (3), while each other term pairs one of the weakly vanishing vectors from (2) or reflection with a strongly converging vector g(T_c)b or h(T_c)b. All three terms vanish. This proves (1). There is no inverse-square-root domain issue because g is bounded. The proof also works for any fixed head threshold in (0,1), and for the other three Fourier phases.

## 2. Compact sandwiches converge in norm, uniformly in a compact channel family

If Q_c=M_c*P_head,c M_c and Q=(1/4)1_[1/4,1](A), then ||Q_c||<=1 and Q_c->Q weakly. For any compact operator S:G->H,

    ||S*(Q_c-Q)S|| ->0.                                 (4)

Approximate S in norm by a finite-rank operator; weak convergence gives convergence in norm on its fixed finite-dimensional range, and the uniform operator bound controls the approximation error. The same proof gives uniformity for S in a norm-compact family of compact operators.

For W<infinity and 0<=r<=1/2 put

    F_W(z-omega)=integral_0^W exp(2pi i tau(z-omega))d_tau,
    (S_W,r f)(z)=integral_-1^1 F_W(z-r xi) f(xi)d_xi.     (5)

These are Hilbert--Schmidt operators L2([-1,1],d_xi)->H, and r->S_W,r is continuous in Hilbert--Schmidt norm. Consequently (4) is uniform in r in [0,1/2]. In particular it is uniform in ALL integer channel labels j>=2 by setting r=1/j. This does not require a convergence rate or a choice of j fixed as c grows.

The original finite physical channel has modal coefficient

    a_n integral_0^W H_n(tau) exp(-2pi i xi tau/j)d_tau,
    a_n=chi_n e_n(lambda)/sqrt(lambda),
    H_n(tau)=F(e_n)(lambda+tau/lambda)/(chi_n e_n(lambda)).

The identity

    a_n H_n(tau)=integral_-1^1 psi_n(z) exp(icz)
                                   exp(2pi i tau z)dz   (6)

shows that its coefficient equals <psi_n,M_c F_W(.-xi/j)> (psi_n is real). Therefore its output Gram kernel is the transpose of the kernel of S_W,1/j* Q_c S_W,1/j; the transpose is related by complex conjugation and has the same operator norm. Equivalently one can fix the opposite inner-product convention. No lambda or chi factor remains in (6).

It follows that the squared operator norm of every fixed-W actual channel converges to the squared ideal channel norm below, uniformly over j>=2. This uses the actual selected positive head, not all even modes and not the full concentration head.

## 3. Exact identification with the Coulomb finite-W ideal channel

The following unitary maps H to L2(R,d_delta):

    (Jh)(delta)=(4pi)^(-1/2) F(Vh)(delta/(4pi)),
    (Vh)(u)=sech(u)h(tanh u).

It diagonalizes A as multiplication by kappa(delta)=(1+exp(delta/4))^(-1). Hence J1_[1/4,1](A)J* is multiplication by 1_(delta<=4log3).

Set a=2pi, eta=delta/(8pi), and let

    Phi_delta(tau)=exp(i a tau) 1F1(1/2+i eta;1;-2i a tau).

An exact Euler integral gives

    (1/2) J[exp(i2pi tau z)](delta)
      =sqrt[kappa(delta)(1-kappa(delta))/8] Phi_delta(tau). (7)

For clarity, substitute z=tanh u and then z=1-2s in the left side. It becomes

    1/(4sqrt(2)pi) integral_0^1
       exp[i2pi tau(1-2s)]
       s^(-1/2+i eta)(1-s)^(-1/2-i eta) ds.

Euler's formula and Gamma(1/2+i eta)Gamma(1/2-i eta)=pi/cosh(pi eta) prove (7). In particular its tau=0 coefficient is 1/[4sqrt(2)cosh(delta/8)], exactly sqrt[kappa(1-kappa)/8], and its normalized tau derivative is delta/2. These check both normalization and sign.

Thus the limiting Gram S_W,r* Q S_W,r is precisely that of the finite-W ideal kernel (up to the harmless transpose already stated)

    k_j,W(xi,delta)=1_(delta<=4log3)
           sqrt[kappa(delta)(1-kappa(delta))/8]
           integral_0^W Phi_delta(tau)exp(-2pi i xi tau/j)d_tau. (8)

This is the finite-W version of the ideal kernel in `../repo_leverage/HARD_EDGE_LIMIT_MODEL_AND_CHANNEL_BESSEL.md`. Its phase and coefficient are exact consequences of the limiting operator, not hypotheses about individual prolate mode amplitudes.

## 4. Scope and interaction with the independent tail estimate

Equations (1)--(8) prove fixed-W diagonal channel norm convergence uniformly over all j>=2, avoiding any modal shape asymptotics or differential-label tail estimate. They do not alone compare different carrier-modulated channels, sum an increasing number of errors, or pass to W=W(lambda) growing with lambda.

The separate `../repo_leverage/UNIFORM_COLLAR_TAIL_AND_SINGLE_CHANNEL_TRANSFER.md` proposes a uniform-in-c,j Hilbert--Schmidt tail bound of order W^(-1/2), using P_head,c<=4K_c and T_c<=A. If that exact bound is independently admitted, a fixed-W-then-W-to-infinity argument supplies the individual diagonal channel limit for arbitrary later finite collar lengths, without a rate in (4). Collective carrier interactions and the signed low-port pairing still require their own operator estimates.
