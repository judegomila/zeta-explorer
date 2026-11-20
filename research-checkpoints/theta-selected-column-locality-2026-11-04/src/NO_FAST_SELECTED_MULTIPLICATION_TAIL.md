# Simple-zero resonance forbids fast selected multiplication tails

2026-11-04. Analytic theorem using the proved actual-source/reference comparison. No Q positivity, RH, selected inverse gap, or numerical scan is assumed. This strengthens the finite-band obstruction.

## 1. Theorem

Let q_n=P_n/√A_n be the complete actual X-orthonormal polynomial sequence, where

    Tp=Fp′+2F′p,   X(p,q)=∫(Tp)(Tq),
    w=F²,         V=2(F′²−FF″).

Fix a nonzero polynomial q and a nonconstant real polynomial h. Define

    a_n=X(hq_n,q).

There do not exist C,c,α>0 with

    |a_n|≤C exp(−c n^α)     for every sufficiently large n.

The same conclusion holds within either fixed parity when q has that parity and h is even; n then runs over that parity. In particular, every fixed row of the selected t² multiplication matrix fails every stretched-exponential upper bound.

A stronger statement follows from the same proof: one cannot have

    |a_n|≤C exp[−η_n log²(n+2)],   η_n→∞.

More quantitatively, there is a finite universal comparison constant C_0 such that the bound C exp[−c log²(n+2)] is impossible for c>C_0. This constant is the one in the compact evaluation estimate below; no useful numerical value is asserted.

These are exclusions of absolute coefficient upper bounds, not lower bounds at every n. They do not imply failure of polynomial decay or failure of selected derivative coherence.

## 2. Inputs

From `../theta_pollaczek_trial_20261104/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md`, every polynomial p of degree ≤n satisfies

    ||p||²_W≤exp[C log²(n+2)] X[p],
    W(t)=|Γ(4+it/2)|².                                  (2.1)

From the actual-theta setup, F is real entire and its fixed derivatives decay exponentially times polynomial factors on R. The theta–Xi identity transfers simple critical-line zeta zeros to simple real F zeros. Infinitely many exist unconditionally: Bui–Conrey–Young, Theorem 1.1, prove a positive proportion of simple critical-line zeros (https://arxiv.org/pdf/1002.4127; journal DOI 10.4064/aa150-1-3). Other zeros are unrestricted.

## 3. Complex evaluation bound

Let Q_k(t)=P_k^(4)(t/2;π/2). Their generating function is

    Σ_(k≥0)Q_k(t)z^k
       =(1−iz)^(−4+it/2)(1+iz)^(−4−it/2),    |z|<1.

The analytic logarithms are normalized at z=0. For t in any compact complex set K and |z|=r<1, each base has positive real part, argument bounded by π/2, and modulus between 1−r and 2. Therefore the generating function has modulus ≤C_K(1−r)^(−B_K) for a finite B_K. Cauchy's coefficient formula with r=1−1/(k+2) gives

    sup_K |Q_k|≤C_K(k+2)^(B_K).

The exact squared W norm of Q_k is (4π/2^8)Γ(k+8)/k!, a positive constant times a degree-seven polynomial in k. Hence the W-orthonormal polynomials ψ_k obey a polynomial compact bound too. Expansion in ψ_0,…,ψ_n and Cauchy–Schwarz yield

    sup_K |p|≤C_K(n+2)^(D_K)||p||_W.

Apply (2.1) to q_n, for which X[q_n]=1, and use complex Cauchy estimates on a slightly larger compact set for derivatives. For every compact K and each fixed derivative order r,

    sup_K |q_n^(r)|
      ≤ C_(K,r) exp[C_0 log²(n+2)](n+2)^(D_(K,r)).        (3.1)

The coefficient C_0 of log² can be chosen independently of K and r. Only the polynomial factor varies. No asymptotic formula for q_n is used.

## 4. An assumed fast row produces an analytic source representative

Integration by parts gives the exact multiplication defect

    X(hp,q)−X(p,hq)=∫p f,
    f=(w h′)′q+2w h′q′.                                 (4.1)

Define b_n=∫q_n f=a_n−X(q_n,hq). The second term vanishes for n>deg(hq), so b_n has the same assumed fast tail. Under any excluded bound of Section 1, (3.1) gives locally uniform convergence of

    R(z)=Σ_n b_n q_n(z)

and of every fixed derivative. Thus R is entire. Also (b_n)∈ℓ², so the sources Σb_n Tq_n converge in L²(dt). Local convergence identifies their L² limit with TR, hence TR∈L².

Every polynomial p has a finite expansion in the selected basis. Orthogonality consequently gives

    ∫p f=∫(Tp)(TR).                                      (4.2)

For a single parity, the construction uses only the matching parity basis. R and f have that parity; identities for the other parity vanish automatically.

## 5. Distributional uniqueness without a growth assumption on R

Set u=FTR and v=2F′TR. Since TR∈L² and F,F′ decay exponentially, u and v are exponentially integrable. The explicit f in (4.1) is likewise exponentially integrable. Equation (4.2) says

    ∫p f=∫p′u+∫p v

for every polynomial p. Analytic Fourier-transform uniqueness gives

    f=−u′+v

as distributions. Since R and F are entire, this is the pointwise smooth identity

    f=L R,
    L R=−(wR′)′+VR.                                    (5.1)

No global bound on the entire function R is needed: the exponential integrability of u and v came from its L² source.

## 6. The local resonance contradiction

Choose a simple real zero r of F for which h′(r)q(r)≠0. Such a zero exists because the simple zeros are infinite and h′q is a nonzero polynomial. Put c=F′(r)≠0. Then

    w(r)=w′(r)=0,  w″(r)=2c²,  V(r)=2c².

Equation (4.1) gives f(r)=0. Equation (5.1) at r gives

    0=f(r)=2c²R(r),

so R(r)=0. Differentiating LR at r now gives

    (LR)′(r)=[−w″(r)+V(r)]R′(r)+V′(r)R(r)=0.

On the other hand, direct differentiation of (4.1) gives

    f′(r)=w″(r)h′(r)q(r)=2c²h′(r)q(r)≠0.

This contradicts (5.1), proving the theorem. The argument concerns ordinary analytic values at a zero and uses no quotient by F, no principal values, and no sign assumption on V.

## 7. Scope

The theorem is genuinely about the selected basis: its proof uses its exact source orthonormality and the actual source/reference inequality. It preserves the multiplication cross terms through (4.1).

A consequence for localization of selected inverse-Gram columns requires a separate matrix argument converting that localization into fast fixed-row multiplication decay. That conversion is not proved or assumed here. Nor does this theorem yield any conclusion about H[P_n]/A_n, Δ_n, U_n/Δ_n, or RH.

This is an independently checkable analytic proof with supplied source-comparison inputs, not external peer review or a machine-formal proof. No frozen files, dual notes, or live 4CT files were modified.
