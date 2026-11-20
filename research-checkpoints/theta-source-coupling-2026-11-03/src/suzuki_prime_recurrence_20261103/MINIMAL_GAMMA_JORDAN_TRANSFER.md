# Minimal gamma factor: an exact Jordan transfer and its endpoint obstruction

Date: 2026-11-03. Status: analytic derivation; independent review requested. All statements use the unmodified complete theta source. No global temperedness of Suzuki's screw function is assumed. No all-degree signed bridge or RH conclusion is established.

## 1. A source-specific relation the counterfeit fails

Use the original complete theta profile psi and unreflected orbit f from RECURRENCE_PRESERVING_QUARTET.md. Put D=d/du and define

    L_2=(D-5/2)(D-3/2),       A=D+5/2,
    J_2(n)=n^2 product_{p|n}(1-p^(-2)),
    (U h)(u)=exp(2u) sum_{n>=1} J_2(n)n^(-1/2)h(u+log n).

The exact minimal-source relation is

    L_2 psi = -2pi U A psi.                                      (1)

Unlike the generic divisor recurrence, it uses the particular degree-two orbit. For every polynomial q, of arbitrary degree,

    L_2 q(D)psi = -2pi U A q(D+2)psi.                            (2)

All functions and all derivatives in (1)-(2) are untruncated. The sums converge at each real u and locally uniformly with all fixed derivatives.

### Direct proof, with no Euler continuation

For x=pi exp(2u), the orbit f=4exp(u/2)(2x^2-3x)exp(-x) satisfies

    L_2 f = -2x A f.                                           (3)

This is an elementary polynomial identity under D=2x d/dx on the polynomial part, including the derivative of exp(u/2-x). Since sum_{d|n}J_2(d)=n^2, regrouping the complete integer orbits gives (1). The identity D U=U(D+2) then gives (2).

The equivalent minimal gamma identity is

    2pi(s-1)A_gamma(s+2)=(s+2)(s+1)A_gamma(s),
    A_gamma(s)=s(s-1)pi^(-s/2)Gamma(s/2).

It becomes (1) using zeta(s)/zeta(s+2), whose Dirichlet coefficients are J_2(n)/n^2. The direct orbit/divisor proof above avoids depending on that series outside its convergence half-plane.

If psi is replaced by M(D)psi, its defect in (1) is exactly

    L_2 M(D)psi + 2pi U A M(D)psi
      = -2pi U A [M(D+2)-M(D)]psi.                            (4)

The remote-quartet multiplier is a nonconstant quartic, so this relation is not preserved. The gamma multiplier calculation also proves the defect cannot vanish identically for a nonconstant polynomial M: that would force a polynomial multiplier in s to be 2-periodic.

## 2. An independent sharp all-degree weighted bound

Set B(u)=U psi(u)>0. For sigma>1/2 define

    K_sigma=zeta(sigma+1/2)/zeta(sigma+5/2).

Then, for every measurable h in the indicated weighted source space,

    integral exp(sigma u) |U h(u)|^2/B(u) du
      <= K_sigma integral exp((sigma+2)u) |h(u)|^2/psi(u) du.    (5)

All integrals are on the entire real line. In particular, for every polynomial q, with no degree-dependent constant,

    integral exp(sigma u) |L_2 q(D)psi|^2/B(u) du
      <= 4pi^2 K_sigma
         integral exp((sigma+2)u) |A q(D+2)psi|^2/psi(u) du.     (6)

This is a genuine source-specific, arbitrary-degree bound. It is not the required Schur payment: its norms, derivative orders, and translated polynomial are different.

### Proof and sharpness

Weighted Cauchy-Schwarz for the positive discrete kernel gives

    |U h|^2 <= (U psi) U(|h|^2/psi).

For nonnegative k, Tonelli and a change of variable give

    integral exp(sigma u) U k(u) du
      = [sum_n J_2(n)n^(-sigma-5/2)]
        integral exp((sigma+2)v) k(v) dv.

The bracket equals K_sigma and converges precisely for sigma>1/2. This proves (5); (2) gives (6). Equality in (5) holds for h=psi, so the constant is sharp on the full source space. This proof keeps all prime correlations and uses no zero location, old inverse, or next-pivot assumption.

## 3. The pole and the exact cancellation in the derivative module

The operator relation also gives a useful exact expression for B. Since (D+1/2)B=U A psi, integrate (1) from u to positive infinity to obtain

    B(u)=(1/(2pi))[-psi'(u)+(9/2)psi(u)
          +6 exp(-u/2) integral_u^infinity exp(v/2)psi(v)dv].     (7)

Here integral_R exp(v/2)psi(v)dv=2xi(1)=1. Therefore

    B(u) ~ (3/pi)exp(-u/2) as u tends to negative infinity.     (8)

Accordingly K_sigma diverges like 1/[zeta(3)(sigma-1/2)] as sigma decreases to 1/2. This is the exact pole, not an artifact of an absolute estimate.

However the actual features in (6),

    h_q=A q(D+2)psi,

satisfy the exact vanishing moment

    M(h_q):=integral exp(5u/2) h_q(u)du=0.                     (9)

Integration by parts proves (9), with no boundary terms. Thus their U-image equals a derivative of psi and has rapid decay, even though the positive parent B has the tail (8). Simply letting sigma approach 1/2 in (6) discards this cancellation and gives an infinite constant. Replacing h_q by an arbitrary positive envelope makes the same error.

## 4. The single vanishing moment alone does not repair the bound

For every -3/2<sigma<=1/2, there is NO finite constant C_sigma such that

    integral exp(sigma u)|U h|^2/B du
      <= C_sigma integral exp((sigma+2)u)|h|^2/psi du           (10)

for all smooth compactly supported h with M(h)=0. Each such h individually has a finite left side. The obstruction is arithmetic resonance, despite the exact pole cancellation.

### Tail asymptotic

The elementary identity J_2=mu*(n->n^2) gives

    sum_{n<=X}J_2(n)=X^3/(3zeta(3))+O(X^2).

Partial summation therefore yields, for fixed smooth compactly supported h,

    U h(u)=[M(h)/zeta(3)]exp(-u/2)+O_h(exp(u/2)),  u->-infinity. (11)

If M(h)=0, this and (8) give integrability at the negative endpoint precisely in the stated sufficient range sigma>-3/2. U h vanishes for all sufficiently positive u. No uniform error constant in h is claimed.

### Resonant witnesses

Fix a nonzero nonnegative smooth h_0 supported in [a,b]. For each large integer N, choose arbitrarily large tau so that

    |exp(-i tau log n)-1|<1/8 for every 1<=n<=N.

This is possible by simultaneous Diophantine approximation of the finite set of prime logarithms, choosing the approximation tight enough for all their products up to N. The arbitrarily large tau choices also ensure

    c_tau=M(exp(-i tau u)h_0)/M(h_0),   |c_tau|<1/8,

by the Riemann-Lebesgue lemma. Set

    h_tau(u)=(exp(-i tau u)-c_tau)h_0(u).

Then M(h_tau)=0 exactly, and its input norm in (10) is bounded uniformly by (9/8)^2 times that of h_0. For b-log N<=u, all nonzero terms of U h_0 use n<=N. The triangle inequality and positivity imply

    |U h_tau(u)| >= (3/4) U h_0(u).

By (11), U h_0(u) is a positive constant times exp(-u/2) for all sufficiently negative u. By (8), on b-log N<=u<=-C the left-side density in (10) is therefore bounded below by a positive constant times exp((sigma-1/2)u). Its integral grows like log N when sigma=1/2 and at least a positive constant times N^(1/2-sigma) when sigma<1/2. This contradicts any fixed C_sigma.

Complex witnesses suffice; if one insists on real functions, split them into real and imaginary parts, both of which retain the zero moment, and at least one component has an unbounded ratio along a subsequence.

## 5. The precise unresolved step

The source-specific relation (2) gives more information than the generic prime recurrence and genuinely excludes the counterfeit. It also gives the sharp all-degree estimate (6). What has NOT been proved is a bound at a useful unweighted/critical parameter on the actual derivative module

    { A q(D+2)psi : q a polynomial },

with the norms and old-inverse information needed to pay the signed Schur defect. Equation (10) cannot be asserted on the larger class based only on the one cancelled Mellin moment.

Nor can the resonant witnesses in Section 4 automatically be identified with this derivative module. Its Fourier transforms are

    (5/2-it) q(2-it) F(t),

so they retain all the zero constraints of the actual F. In the strong weighted source norm, evaluation of the transform at each fixed complex point is continuous, since psi has every exponential moment. Thus density of unconstrained smooth functions cannot be assumed: a function whose transform is nonzero at an actual zero of F cannot lie in the closure of this module in that norm.

This is the remaining concrete question: can the exact minimal-gamma/Jordan relation plus those module constraints control the signed next-residual payment without assuming a zero-location statement or a positive future pivot? The weighted estimate above does not answer it. No claimed proof substitutes (6) for that missing step, and the generic zero-moment bound is rigorously false.

## Reproducibility and scope

The algebraic single-orbit relation (3) and the differential-polynomial commutator (4) can be replayed exactly by the companion symbolic script. The tail and resonance arguments are analytic and do not rely on a finite numerical search. All operator formulas act on rapidly decaying sources or controlled distributions and compactly supported test functions; no global Fourier transform of Suzuki's undamped screw function is used.

Baseline remains draft PR #40 at head 6c6c81697fdc527d017dc592b55bea3efa5bb31b: https://github.com/judegomila/mathexplorer/pull/40 . No live 4CT or external repository state was modified.
