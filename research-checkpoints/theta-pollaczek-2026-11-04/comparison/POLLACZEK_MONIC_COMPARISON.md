# An explicit oscillatory monic competitor for the actual theta form

2026-11-04. Analytic derivation with an independent AI-assisted audit, not external peer review or machine formalization. This proves a noncircular all-degree upper bound on the actual selected monic X norm, and a stronger obstruction for the existing mesoscopic packets. It does NOT prove relative near-extremality of the new competitor, selected derivative decay, coherence, or RH.

## 1. Result

Let T p=F p'+2F'p, X[p]=||Tp||², and let A_n be the monic minimum in the complete parity prefix. There is a constant C, independent of n, such that

    A_n <= C n! Gamma(n+8),       n >= 0.                 (1)

The competitor is completely explicit:

    M_n(t)=n! P_n^(4)(t/2; pi/2),                         (2)

where P denotes the Meixner–Pollaczek polynomial. It has degree n, leading coefficient one, and parity n. Thus

    log A_n <= 2n log n - 2n + O(log(n+2)).               (3)

The argument uses orthogonality before estimating derivatives. It is not an absolute sum of packet synthesis coefficients and does not invert a Gram matrix.

For the uniformly controlled exact-degree mesoscopic packets in the frozen selected bridge, (3) improves the uniform leverage upper exponent to

    limsup_n n^(-1) log sup_L theta_n(p_(n,L))
        <= -2 log(4/pi) = -0.4831289505....              (4)

This replaces 2log3-2=0.1972245773 in the existing obstruction. The triangular inverse-Gram diagonal and Gram spectral condition-number consequences stated in that package follow with every 0<rho<2log(4/pi).

## 2. A positive scalar majorant, not a scalar replacement

Set W_lambda(t)=|Gamma(lambda+it/2)|². For lambda=4,

    F(t)²+F'(t)² <= C_0 W_4(t)       for every real t.    (5)

This follows from the exact factorization F=aZ (up to a fixed normalization), with

    a(t)=(t²+1/4)|Gamma(1/4+it/2)|,
    a(t)² asymp (1+|t|)^(7/2) exp(-pi|t|/2).

The smooth logarithmic derivative a'/a is bounded. The elementary estimates

    |Z(t)|+|Z'(t)| = O(1+|t|)

suffice. One way to obtain them without any RH input is Euler summation for zeta with cutoff N comparable to |t|: on the critical line it gives zeta=O(sqrt(|t|)) and zeta'=O(sqrt(|t|)log(|t|)); the integer cutoff is held fixed during differentiation before N comparable to |t| is chosen, and differentiating the Hardy phase adds only an O(log(|t|)) factor. Since sqrt(t)log t=O(t), the asserted estimate follows. On bounded intervals smoothness handles the constants. Hence F²+F'²=O((1+|t|)^(11/2)exp(-pi|t|/2)), whereas W_4 is asymptotic to a positive constant times |t|^7 exp(-pi|t|/2). Stirling and positivity of W_4 prove (5).

Alternatively, the already supplied fixed-order theta derivative bounds of polynomial times exp(-pi|t|/4) prove (5) for any sufficiently large fixed lambda. This weaker input still proves (3)-(4), with Gamma(n+2lambda) in (1).

No lower comparison F²>=cW_lambda or X>=c times a scalar norm is asserted. Real zeros of F remain present. Equation (5) is used solely to estimate an explicit competitor's true source norm from above.

## 3. Exact derivative expansion with cancellation retained

For lambda>=1/2 write Q_n(t)=P_n^(lambda)(t/2;pi/2). The classical generating function is

    sum_(n>=0) Q_n(t) z^n
       =(1-iz)^(-lambda+it/2)(1+iz)^(-lambda-it/2).

It has leading coefficient 1/n!. Differentiating in t multiplies this generating function by arctan z. Thus the exact finite identity is

    Q_n'(t)=sum_(1<=k<=n, k odd)
                 (-1)^((k-1)/2) Q_(n-k)(t)/k.            (6)

Orthogonality in W_lambda gives

    h_n:=integral W_lambda Q_n²
         = (4pi/2^(2lambda)) Gamma(n+2lambda)/n!,

    integral W_lambda (Q_n')² / h_n
         =sum_(k odd<=n) h_(n-k)/(k² h_n)
         <=sum_(k odd>=1) 1/k² = pi²/8.                 (7)

The last inequality follows since h_j is nondecreasing when lambda>=1/2. In fact the ratio in (7) tends to pi²/8 by dominated convergence. There is no logarithmic loss from the sum of absolute derivative coefficients: the lower-degree polynomials are orthogonal, so their cross terms vanish before any bound is made.

In monic normalization M_n=n!Q_n, equations (6)-(7) give

    ||M_n||²_W = (4pi/2^(2lambda)) n!Gamma(n+2lambda),
    ||M_n'||²_W <= (pi²/8)||M_n||²_W.                   (8)

These are explicit all-degree identities and estimates, rather than a finite scan.

## 4. Actual-theta estimate

The elementary positive-source inequality and (5) give

    X[M_n] <= 2 integral F²(M_n')²+8 integral F'²M_n²
           <= C_0 [2||M_n'||²_W+8||M_n||²_W]
           <= C_0(8+pi²/4)(4pi/2^8)n!Gamma(n+8).

Since M_n is admissible, A_n<=X[M_n]. This proves (1), with C explicit in terms of C_0=sup_t(F²+F'²)/W_4. That supremum is finite and independent of n; its numerical evaluation is unnecessary for the exponential consequence. Stirling proves (3).

This calculation estimates the actual X source rather than replacing its arithmetic Gram by a Pollaczek Gram. Its one-sided nature is essential.

## 5. Packet leverage consequence

Use the notation from EXPONENTIAL_PACKET_LEVERAGE.md: c=pi/2, k=n-j, j=sd=o(n), T=2k/c=4k/pi, and L lies in a fixed compact interval with L>4/c=8/pi. The frozen packet inputs are uniformly

    2log|ell_n(p)| <= -2k log(2k/c)+2j log(2/(Ln))+O(1),
    log X[p] = -2k+O(log n).

Selection says theta=A_n ell_n(p)²/X[p]. The new bound (3) equals the old monomial factorial scale 2n log(2n/c)-2n minus 2n log(2/c), up to O(log n). Consequently

    log theta <= -2n log(4/pi)
       +2j log(4/(cL))+2k log(n/k)-2j+O(log n)
       <= -2n log(4/pi)+O(log n),                        (9)

since log(1+j/k)<=j/k and L>4/c. A vanishing top coefficient makes theta=0 and causes no exception. This proves (4) uniformly over the supplied parameter range.

## 6. What this does and does not open

The Pollaczek family devotes all degrees to oscillation, unlike a degree-n-o(n) monomial carrier with an o(n)-degree localization kernel. It has exactly controlled signed derivative expansion, so it is a concrete alternative starting family for cancellation-sensitive work.

However, (1) alone does NOT show X[M_n]/A_n is bounded or tends to one. The scalar derivative estimate (7) is NOT H[M_n]/X[M_n]=o(1), because the Hardy factors are not orthogonalizing weights for (6). Neither estimate applies directly to the selected polynomial P_n. Thus this note supplies a sharper true-theta all-degree monic bound and a better alternative trial family, not the requested final selected coherence theorem or a certified near-extremal X family.

A subsequent positive result would need genuinely relative arithmetic control for this oscillatory family and its lower-degree residuals, or an independent lower bound matching (1) at sufficient relative precision. Merely taking nth roots of A_n and X[M_n] would still be insufficient.

## Sources and scope

The generating function, orthogonality normalization, and leading coefficient are standard formulas verified against NIST DLMF Sections 18.19 and 18.23:

- https://dlmf.nist.gov/18.19
- https://dlmf.nist.gov/18.23
- https://dlmf.nist.gov/25.2.E8

The derivative identity and norm bound above are derived directly from those formulas. The theta factorization and packet bounds are inherited from the supplied frozen checkpoints. No prior package or live script has been changed. No literature-novelty claim is made.
