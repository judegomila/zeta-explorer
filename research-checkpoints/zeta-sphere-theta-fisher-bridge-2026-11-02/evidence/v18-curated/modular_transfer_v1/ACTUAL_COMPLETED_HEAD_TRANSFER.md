# Actual completed-zeta transfer with a linear-size corrected Dirichlet head

2026-11-02. Independently reviewed analytic theorem, including the spatial grouping and normalized small-shift bound. This pays an actual remainder to the full theta bridge, not a surrogate Euler-box tail. Positivity of the corrected head is not established.

## 1. An exact adaptive head on both sides of the critical line

Let z=σ+it, 0<δ≤σ≤1, T≤|t|≤2T, N a positive integer and m≥1. Write (z)_r=z(z+1)…(z+r−1), and define the finite corrected head

H_(N,m)(z)=Σ_(n=1)^N n^(−z)+N^(1−z)/(z−1)−(1/2)N^(−z)
 +Σ_(k=1)^m [B_(2k)/(2k)!](z)_(2k−1)N^(−z−2k+1).        (1)

Repeated integration by parts in the Euler–Maclaurin formula gives exactly

ζ(z)=H_(N,m)(z)+R_(N,m)(z),
R_(N,m)(z)=−(z)_(2m)/(2m)! ∫_N^∞ Btilde_(2m)(x)x^(−z−2m)dx. (2)

The endpoint convention in (1) includes n=N and therefore has −N^(−z)/2, not +N^(−z)/2. The Bernoulli Fourier series gives
sup_x |Btilde_(2m)(x)|/(2m)!≤2ζ(2m)/(2π)^(2m).
Consequently the explicit bounds

e(z)= [2ζ(2m)/(2π)^(2m)] |(z)_(2m)| N^(1−σ−2m)/(σ+2m−1),
e1(z)=e(z)[Σ_(r=0)^(2m−1)|z+r|^(−1)+log N+(σ+2m−1)^(−1)]       (3)

satisfy |R(z)|≤e(z), |R′(z)|≤e1(z). The derivative estimate differentiates both the rising factorial and the integrand, using
∫_N^∞(log x)x^(−σ−2m)dx
=N^(1−σ−2m)[log N/(σ+2m−1)+1/(σ+2m−1)²].
All integrals and differentiated integrals converge absolutely on the stated band. No ζ-zero information enters.

These identities can also be obtained from the primary Euler–Maclaurin representations in NIST DLMF §25.11(iii), https://dlmf.nist.gov/25.11.iii, and the Bernoulli Fourier series https://dlmf.nist.gov/24.8.E1. Here the endpoint convention and derivative bound were derived explicitly.

## 2. Linear cutoff, logarithmically many corrections, arbitrary polynomial accuracy

Take N=ceil T and assume 2m+1≤T. Then |z+r|≤2T+2m≤3T≤3N. Put ρ=3/(2π)<1. Uniformly on δ≤σ≤1,

e(z)≤4(T+1)^(1−δ)ρ^(2m)/(δ+2m−1),
e1(z)≤[same bound][2m/T+log N+1/(δ+2m−1)].                  (4)

For any prescribed A>0, choosing
m=ceil[(A+2)log T/(2 log(2π/3))]
gives e,e1=O_(A,δ)(T^(−A)), once T is large enough that 2m+1≤T. For smaller T one uses (3) directly or increases N. Thus N is linear in height, the number of boundary corrections is logarithmic, and the approximation is valid on the full band δ≤σ≤1, including both sides of 1/2. This is absolute approximation to ζ and ζ′; it does not divide by ζ and remains valid near zeros.

## 3. Exact relation to the prime-power box: which terms were unpaid

There is also an exact spatial grouping. With the full-line first summand f from the reviewed reference theorem, put f_A(u)=Σ_(n∈A)n^(−1/2)f(u+log n). The full theta profile obeys ψ(u)=Σ_(n≥1)n^(−1/2)f(u+log n), locally uniformly for real u. Thus τ_A=ψ−f_A is exactly the grouped sum over n∉A. Writing w_a(h)=h sinh(2ah),
C_a(v)−D_(a,A)(v)=(1/2)∫_R w_a(h)[f_A(h−v)τ_A(h+v)+τ_A(h−v)f_A(h+v)+τ_A(h−v)τ_A(h+v)]dh.
This retains every mixed and omitted–omitted orbit. It does not justify interchanging an unbounded negative-h integral with an absolutely summed orbit expansion: the modular cancellations there matter. The spectral construction below pays the grouped remainder without making that interchange.

For any finite prime-power box A with P_A(z)=Σ_(n∈A)n^(−z), let B_(N,m)(z) denote all non-sum correction terms in (1). Then exactly

H_(N,m)(z)−P_A(z)
 =Σ_(n≤N,n∉A)n^(−z)−Σ_(n>N,n∈A)n^(−z)+B_(N,m)(z).          (5)

The first sum includes omitted large-prime and nonbox integers. The second removes the often very large set of overincluded box integers. The boundary corrections supply the analytic-continuation closure; they are not optional. Both sides of (5) and their derivatives are finite, explicitly computable expressions. No assertion that this correction is small is made. The boxed reference's positivity theorem cannot be transferred just by deleting (5).

## 4. Actual bridge spectral cost, retaining every derivative cross term

Use the established exact identity
C_a_hat(2t)=(1/2)∂_a[G_a(t)|ζ(1/2+a+it)|²],
G_a(t)=|Q(1/2+a+it)|²,
Q(z)=(1/2)z(z−1)π^(−z/2)Γ(z/2).
At z=1/2+a+it, put H=H_(N,m)(z), H′=∂_zH and
b_G=∂_a log G_a=2Re[1/z+1/(z−1)−(logπ)/2+Ψ(z/2)/2].
Define the explicit signed corrected-head density

J_(a,N,m)(2t)=G_a[(b_G/2)|H|²+Re(H′ conjugate H)].           (6)

Expansion of ζ=H+R and ζ′=H′+R′ gives

|C_a_hat(2t)−J_(a,N,m)(2t)|≤G_a E_(a,N,m)(t),              (7)
E=(|b_G|/2)(2|H|e+e²)+|H′|e+|H|e1+ee1.                  (8)

Every head–remainder and derivative term is included. In particular no log-derivative approximation divides by H or ζ. A sufficient, completely explicit local sign certificate is J/G_a>E. Its uniform validity is NOT proved here.

For the two-sided derivative representation, apply (7) separately at σ=1/2±a and use
C_a_hat=(1/4)[∂_s(G_s|ζ|²)|_(+a)−∂_s(G_s|ζ|²)|_(−a)],
which follows from the completed functional equation. Formula (3) covers both evaluation points when a≤1/2−δ. The one-sided formula (6) is simpler and exact for the actual bridge; neither requires an Euler box to inherit the functional equation.

## 5. Quadratic-form remainder on the actual height band

Extend J and G E evenly to negative t, and restrict to B={k:2T≤|k|≤4T}. Let the band-limited kernels use inverse Fourier convention (2π)^−1∫ e^(ikv)f_hat(k)dk. Define the positive semidefinite envelope kernel R_B by spectral density
1_B(k)G_a(k/2)E_(a,N,m)(k/2).
For every finite set of real nodes and complex coefficients, with p(k)=Σ_j c_j e^(ikx_j),

|c*[(C_a)_B−J_B]c|
 ≤(1/(2π))∫_B G_a(k/2)E_(a,N,m)(k/2)|p(k)|²dk
 =c*R_B c.                                                  (9)

Thus −R_B≼(C_a)_B−J_B≼R_B. The same inequality holds for polynomial jet tests by replacing p with the relevant polynomial, since B is bounded. This is a real quadratic-form transfer allowance on the full completed-theta target. It is absolute on the natural gamma scale, not a fictitious fixed relative gap against a signed or vanishing head.

## Remaining proof obligation

The full analytic remainder is now bounded with arbitrary accuracy on each height band. What remains is to prove the corrected finite head dominates (8), or to exploit integrated cancellation in (9), uniformly over the required bands and shifts. The earlier Euler-box density-one convexity result does not prove that assertion: (5) can change both modulus and derivative. No all-height sign, all-order closure, or RH proof is claimed.

## 6. Normalized small-shift transfer without losing a factor 1/a

The preceding one-sided budget is valid at every positive a, but need not vanish with a. A symmetric head and one additional derivative give a uniform normalized bound as a↓0. Let
D=σ+2m−1, S1=Σ_(r=0)^(2m−1)|z+r|^(−1), S2=Σ|z+r|^(−2).
Then differentiation of (2) twice gives

|R″(z)|≤e2(z)=e(z)[(S1+log N+1/D)²+S2+1/D²].             (10)

This uses |( (z)_(2m) )″|/|(z)_(2m)|≤S1²+S2 and the exact second logarithmic integral moment. Thus e2 too is arbitrarily polynomially small with the same N~T, m~log T scheme (increase the requested accuracy slightly to absorb log²T).

For s∈[−a,a], set σ=1/2+s, b_s=∂_slog G_s, b_s′=∂_s²log G_s, and evaluate H,H′,H″,e,e1,e2 there. Define

E2_s=|b_s²+b_s′|(2|H|e+e²)
 +4|b_s|(|H′|e+|H|e1+ee1)
 +2(2|H′|e1+e1²)
 +2(|H″|e+|H|e2+ee2).                                   (11)

Expanding W_s=G_s(|ζ|²−|H|²) twice shows |W_s″|≤G_s E2_s. Let the symmetric corrected-head density be
J_sym,a(2t)=(1/4)[∂_s(G_s|H|²)|_(a)−∂_s(G_s|H|²)|_(−a)].
For 0<a≤1/2−δ,

|[C_a_hat(2t)−J_sym,a(2t)]/a|
 ≤(1/(4a))∫_(−a)^a G_s E2_s ds
 ≤(1/2) sup_(|s|≤a) G_s E2_s.                            (12)

This extends continuously to a=0 and yields the analogous normalized quadratic-form envelope. The cancellation making C_a vanish at a=0 is retained, rather than dividing the one-sided absolute error by a. Positivity of this symmetric corrected head remains an unpaid assertion.
