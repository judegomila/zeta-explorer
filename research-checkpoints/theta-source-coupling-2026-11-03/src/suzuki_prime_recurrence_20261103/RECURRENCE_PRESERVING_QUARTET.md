# Prime-power recurrence does not detect a remote off-line quartet

Date: 2026-11-03. Status: independent analytic review PASS for orbit positivity, recurrence constants, convergence, and the archimedean comparison; exact symbolic replay PASS. This is an obstruction to a proposed mechanism, not a negative theta pivot, a proof of RH, or a novelty claim. It strengthens the separate remote-quartet obstruction by retaining the complete integer-orbit structure and every prime-power/divisor recurrence.

## 1. Result and relevance

Let psi be the original complete even theta profile, with

    psi(u) = sum_{n>=1} n^(-1/2) f(u+log n),
    f(u) = 4 exp(u/2) (2 x^2 - 3 x) exp(-x),  x=pi exp(2u),
    F(z) = integral psi(u) exp(izu) du = 2 xi(1/2+iz).

There exist positive, even, super-exponentially decaying complete profiles psi_tilde for which:

- the integer weights n^(-1/2) and all tilted divisor factors d_a(j) are exactly unchanged;
- every arbitrary-prime recurrence, the integrated prime correction identity, and fixed-degree convergence from TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md remain valid;
- the transform is real, even, entire of order one, with all zeros still in |Im z|<1/2;
- any prescribed finite set of strictly positive original polynomial moment blocks is retained by sufficiently remote versions of the construction;
- nevertheless the new zero-shift bridge density is negative on an open interval and has negative polynomial directions in both parities.

Thus these recurrences, even together with the listed analytic properties and any prescribed positive finite prefix, cannot force an all-degree signed bridge. The exact unmodified single-orbit formula is essential additional information. This does not assert that an inequality using that exact formula is false.

## 2. The explicit deformation

For T>=10 and 0<epsilon<=1 put

    P(z) = (z^2-T^2)^2 + epsilon^2,
    L = D^4 + 2 T^2 D^2 + T^4 + epsilon^2,
    f_tilde = Lf,      psi_tilde = Lpsi,      F_tilde = PF.

Here D=d/du and all parameters are fixed when taking other derivatives. A harmless positive normalization T^(-4) will be used when comparing finite moment blocks.

Translation commutes with L, so

    psi_tilde(u) = sum_{n>=1} n^(-1/2) f_tilde(u+log n)

holds exactly. Termwise differentiation is justified locally by the original Gaussian-in-n orbit bounds. Evenness follows from L containing only even derivatives of the complete smooth even profile. Integration by parts has no boundary terms and gives F_tilde=PF with the stated signs.

### Explicit positivity, without an asymptotic threshold

Write f^(k)(u)=4 exp(u/2) exp(-x) P_k(x). Then

    P_0(x)=2x^2-3x,
    P_(k+1)(x)=2x P_k'(x)+(1/2-2x)P_k(x).

Set V=T^2-100>=0 and y=x-3. Direct exact algebra gives

    P_4 + 2T^2 P_2 + T^4 P_0
      = 32 y^6 + 48 y^5 + (16V+588)y^4 + (80V+4560)y^3
        + (2V^2+421V+174409/8)y^2
        + (9V^2+2913V/2+1032633/16)y
        + 9V^2+2889V/2+979785/16.

Every coefficient is strictly positive for V>=0. For u>=0, every orbit has x=pi n^2 exp(2u)>3, hence y>0. Also P_0(x)>0 there, so adding epsilon^2 P_0 preserves positivity. Therefore every modified orbit is positive on this half-line, psi_tilde(u)>0 for u>=0, and evenness proves positivity on all of R.

This certificate does not replace the unreflected orbit by a positive one on the whole real line. f_tilde can still be signed on the negative half-line.

The positivity certificate itself holds for every real epsilon, without the upper bound one. For comparison with the interior-shift workstream, its quartet parameters satisfy

    T^2=R^2-d^2,   epsilon=2Rd,
    P(z)=((z-R)^2+d^2)((z+R)^2+d^2),
    T^4+epsilon^2=(R^2+d^2)^2.

Thus the normalization used in REMOTE_QUARTET_INTERIOR_OBSTRUCTION.md is P/(T^4+epsilon^2). In particular R>=11 and 0<d<1/2 imply T>=10, so the explicit positive-coefficient certificate applies uniformly to that workstream's entire interior-shift family. Normalizing a source by a positive constant changes none of the sign or recurrence conclusions. The restriction epsilon<=1 below is only a convenient choice for the direct zero-shift negative-density witness and finite-prefix argument.

Finite derivatives preserve super-exponential decay of the complete profile and the exponential frequency decay rate of F. Polynomial multiplication preserves entire order one. The inserted roots satisfy

    z^2 = T^2 +/- i epsilon.

Writing their positive coordinates as R,d gives R^2-d^2=T^2 and 2Rd=epsilon. Consequently 0<d<epsilon/(2T)<=1/20<1/2. The other zeros are exactly those of F, with multiplicities added if a coincidence occurs.

## 3. Exact recurrence and correction identities survive

For each fixed real polynomial q of definite parity, define every original correlation using f_tilde and F_tilde instead of f and F. For example

    A_tilde,a(R)=integral exp(-2av) f_tilde(R+v)f_tilde(R-v) dv,
    a_tilde,j(a)=q(-iD_R/2)^2 A_tilde,a((log j)/2),
    d_a(j)=sum_{nm=j}(n/m)^a.

Fix a prime p, set ell=log p and x=a ell, and let

    C_tilde(m ell)=(1/(2pi)) integral q(t)^2 |F_tilde(t+ia)|^2 cos(mt ell) dt,
    b_m=p^(-m/2) C_tilde(m ell),
    X_v=sum_{p does not divide u} (p^v u)^(-1/2) d_a(u) a_tilde,p^v u(a).

Exactly the original argument yields

    b_m=sum_{v>=m} S_(v-m)(x) X_v,
    b_m-2 cosh(x)b_(m+1)+b_(m+2)=X_m,
    S_v(x)=sum_{r=0}^v exp((2r-v)x).

The generating identity for S_v and multiplicativity of d_a also give

    D_tilde,q(a)=(2pi/a) sum_j j^(-1/2) d_a'(j) a_tilde,j(a),
    h_tilde,a[q]=(pi/a) sum_j j^(-1/2)
                    [d_a'(j)a_tilde,j(a)+d_a(j)a_tilde,j'(a)].

Use the even analytic continuation at a=0. The q coefficients remain frozen in every shift derivative. The same finite symmetric Euler multipliers therefore cancel half, or reverse all, of the divisor-derivative term exactly as before. The normalized/fractional-power Euler interpretation is restricted to |a|<1/2; a boundary assertion needs the original paired Abel convention. No infinite Euler quotient is asserted.

The reason is structural: these statements use translation, integer factorization, and a generating identity. They do not use the particular degree-two polynomial 2x^2-3x in the original orbit. The modified orbit is still a finite exponential polynomial times exp(-x), so complete-support bounds and all fixed-degree prime regroupings remain valid. Constants AND polynomial prefactors change: a bound j^(k+9/2)exp(-pi j) for the original base can be replaced by j^(k+25/2)exp(-pi j) for the degree-six modified base. Exponential summability is unchanged, and no degree-uniform estimate is silently obtained.

## 4. An actual negative density is forced

For a real entire H define w_H=H'^2-HH'' on the real axis. The exact product rule is

    w_(PF)=P^2 w_F+F^2 w_P.

At t=T,

    P(T)=epsilon^2,  P'(T)=0,  P''(T)=8T^2,
    w_(PF)(T)=epsilon^4 w_F(T)-8T^2 epsilon^2 F(T)^2.

Choose any T>=10 with F(T) nonzero. Such T exist arbitrarily far out because F is a nonzero entire function with discrete real zeros. Write c_T=|w_F(T)|/F(T)^2 and choose

    epsilon^2=min(1, 4T^2/(1+c_T)).

Then 0<epsilon<=1 and epsilon^2 w_F(T)/F(T)^2<4T^2, so

    w_(PF)(T)<-4T^2 epsilon^2 F(T)^2<0.

This is a direct differential calculation, not an inference from RH being false. Continuity and evenness supply negative open intervals near +/-T. Since |w_(PF)| has a positive exponential moment, even and odd polynomials are dense in their respective parity subspaces of L^2(|w_(PF)|dt). Approximate functions supported in these intervals. This produces negative finite polynomial directions in each parity, indeed arbitrarily large negative index. No explicit first negative degree is asserted.

## 5. Every prescribed finite positive prefix can survive

Normalize P by T^4:

    M_T(t)=1-2t^2/T^2+(t^4+epsilon^2)/T^4.

The bound epsilon<=1 is uniform. For every fixed polynomial q,

    integral q^2 w_(M_T F) -> integral q^2 w_F

as T tends to infinity through the nonzero choices above. This follows directly from

    w_(M_T F)=M_T^2 w_F+F^2 w_(M_T),

because the coefficients tend to those of 1 and 0, respectively, and every polynomial moment of |w_F| and F^2 is finite. Hence all entries of each fixed finite moment block converge. A strictly positive finite block has a strictly positive smallest eigenvalue, so it remains positive for sufficiently large T. The same holds for any finite collection of such blocks.

The construction therefore passes every prescribed finite positive-prefix test while eventually failing higher-degree positivity. It is not an extension of a numerical test and does not contradict any finite result in PR #40.

## 6. Exactly what changed, and a useful falsification test

The modified source is NOT the original theta source. Its unreflected orbit has a degree-six exponential polynomial instead of degree two. Equivalently, its Mellin/Fourier archimedean factor is multiplied by P. The original factor, with s=1/2+iz, is exactly

    F_f(z)=s(s-1) pi^(-s/2) Gamma(s/2),

and satisfies the rational shift relation

    2pi(s-1)A(s+2)=(s+2)(s+1)A(s).

The direct orbit integral converges initially for Re s>-2, and the expression and shift relation then extend meromorphically. The quotient version A(s+2)/A(s)=(s+2)(s+1)/(2pi(s-1)) is used only away from its zeros and poles. A nonconstant inserted quartic changes this relation: preserving it would require its multiplier in s to be a nonconstant 2-periodic polynomial, which is impossible. The prime recurrence does not see that change; the exact archimedean source equation does. In particular, this is not a counterexample to Suzuki's criterion for the unmodified Riemann xi function, and one must not substitute the modified source into his zeta-specific explicit formula while leaving its archimedean terms unchanged.

A practical test for any proposed all-degree closure is now explicit: apply its stated hypotheses to the family Lf above. If they still hold, those hypotheses cannot suffice. A viable theta-specific proof must use a property destroyed by this deformation, for example the exact minimal archimedean factor or original degree-two single-orbit equation, rather than only its positivity, tails, parity, moment prefix, and prime/divisor recurrence. No sufficient inequality using that extra property is proved here.

## Provenance

- PR #40 was inspected live and remains draft/open at head 6c6c81697fdc527d017dc592b55bea3efa5bb31b: https://github.com/judegomila/mathexplorer/pull/40 .
- Frozen exact prime identities: the local TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md, corresponding to that PR head.
- The remote-quartet obstruction was independently reached by the interior-shift workstream; this note adds recurrence preservation and an explicit orbit positivity threshold.
- Suzuki's actual screw criterion and its operator interpretation: https://arxiv.org/abs/2206.03682 and https://arxiv.org/html/2606.09096v1 . The calculations here are independent and do not assume the conjectural operator limit in the latter paper.
- No live 4CT files or GitHub state were modified.
