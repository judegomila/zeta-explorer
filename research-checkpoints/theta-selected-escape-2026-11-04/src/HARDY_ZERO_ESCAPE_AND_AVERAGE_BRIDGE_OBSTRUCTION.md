# Actual-theta escaping polynomials: Hardy endpoints and the limit of a bulk-uniform bridge

Date: 2026-11-04. Status: analytical construction and domain audit, not a proof or counterexample for the actual selected endpoint polynomials. No RH, global sign of V, positive Q prefix, enlarged-block positivity, or inverse-gap estimate is used. No finite scan is used. Prior packages are unchanged.

## 1. Useful result and exact scope

For the actual theta transform retain

    T f = F f' + 2 F' f,
    H[f] = integral F^2 f'^2,
    Q[f] = integral V f^2,   V = 2(F'^2 - F F''),
    X[f] = ||T f||_2^2 = H[f] + Q[f].

The identity holds for polynomials, compactly supported smooth functions, and their differences. Let

    M[f] = integral W_av f^2,
    W_av(t) = a(t)^2 log^3(2+|t|),

where F(t)=+/-a(t)Z(t) is the exact positive gamma-envelope representation, extended evenly. The precise harmless choice of W_av on a compact interval does not matter. This weight has a positive exponential moment.

Fix either parity. Let E_j be any prescribed sequence of finite-dimensional polynomial subspaces of that parity, for example all parity polynomials of degree at most j. There exist finite polynomials p_j of this parity, exactly X-orthogonal to E_j and normalized by X[p_j]=1, with the following properties:

**Hardy endpoint family.** There are simple real Xi zeros r_j tending to infinity and shrinking symmetric neighborhoods I_j of +/-r_j such that

    H[p_j] -> 1/9,
    Q[p_j] -> 8/9,
    integral_(R\I_j) (|T p_j|^2 + F^2 p_j'^2 + |V|p_j^2) -> 0.

**High-log-frequency family.** A possibly different family has the same parity, exact prefix orthogonality, normalization, and localization, but

    H[p_j] -> 1,
    integral |V|p_j^2 -> 0,
    M[p_j] -> 0.

The second family can be located at arbitrary sufficiently high real Xi zeros, with no simplicity requirement. Simplicity is used only to obtain the exact constant 1/9 in the first family. Infinitely many simple critical-line zeros are known unconditionally, for example from the Bui–Conrey–Young theorem cited below. For a zero of multiplicity m, the endpoint constant is instead

    c_m = ((2m-1)/(2m+1))^2 >= 1/9.

These are actual-theta finite-polynomial obstructions, not counterexamples using unrelated weights. They rule out an argument which treats all polynomial mass escaping to high t as automatically derivative-small, even after orthogonality to an arbitrarily large prescribed finite prefix.

**Crucial limitation:** the degree of p_j is not controlled in relation to r_j, and E_j need not be its entire lower-degree prefix. Thus p_j is not asserted to be the selected q_n. Neither result refutes H[q_n]/X[q_n]->0, U_n=o(Delta_n), a degree-linked bulk theorem with |t| comparable to n, or the amplitude inequality. A bridge exploiting complete endpoint selection could still hold.

## 2. Exact coordinates at an actual real zero

Let r>0 be a real zero of multiplicity m. For 0<=x<=d, write

    F(r+x) = x^m g(x),

where g is real, smooth, and nonzero, and d is small enough to contain no further zero. Put ell=log|g|. For h in C_c^infinity((0,infinity)), use

    s = log(d/x),   x = d exp(-s),
    f(r+x) = x^(1/2-m) g(x)^(-1) h(s).

Set f=0 off this right-hand annulus, and reflect it about zero with the chosen parity. Each f is smooth and compactly supported: h vanishes near both endpoints of its finite support, which lies strictly away from x=0. There is no division by F at a zero. Division by g is legitimate on this fixed nonvanishing neighborhood.

For the one-sided contribution, define

    b(s) = x ell'(x),   a_m = m-1/2,   c_m^* = m+1/2.

Direct differentiation and dx/x=-ds give the exact identities

    H[f] = integral |h'(s) + (a_m+b(s))h(s)|^2 ds,
    X[f] = integral |h'(s) - (c_m^*+b(s))h(s)|^2 ds,        (2.1)
    Q[f] = 2 integral [m-x^2 ell''(x)]h(s)^2 ds.            (2.2)

In (2.1)-(2.2) only the right-hand piece is counted. Reflection doubles all quadratic forms, hence leaves their ratios unchanged. To check (2.2), note that b_s=-b-x^2 ell'' and integrate the h'h cross term in X-H. Equivalently,

    V(r+x) = 2 x^(2m-2) g(x)^2 [m-x^2 ell''(x)].

By decreasing d, the bracket is positive. This is a local conclusion from the Taylor expansion, not a global sign assumption on V.

The averaged multiplier becomes exactly

    M[f] = integral W_av(r+x) g(x)^(-2) x^(2-2m) h(s)^2 ds, (2.3)

again on one side. Also

    integral F^2 f^2 = integral x^2 h(s)^2 ds.             (2.4)

All subsequent estimates are derived from the actual F through these identities.

## 3. The Hardy endpoint and the logarithmic frequency parameter

Choose nonzero real chi in C_c^infinity((1,2)) and set

    h_L(s)=L^(-1/2) chi(s/L).

Then ||h_L||_2^2=||chi||_2^2 and ||h_L'||_2^2=L^(-2)||chi'||_2^2. Its support has x between d exp(-2L) and d exp(-L), so b tends uniformly to zero there. Equations (2.1) give

    H[f_L] -> (m-1/2)^2 ||chi||_2^2,
    X[f_L] -> (m+1/2)^2 ||chi||_2^2.

Thus H[f_L]/X[f_L] tends to ((2m-1)/(2m+1))^2. The support shrinks to the actual zero. No large-frequency limit is needed for this nonvanishing ratio. At a simple zero it is exactly 1/9.

More generally, for fixed tau>0 take

    h_(L,tau)(s)=L^(-1/2) chi(s/L) cos(tau s).

As L tends to infinity, elementary integration by parts in the oscillatory integrals gives

    ||h_(L,tau)||_2^2 -> (1/2)||chi||_2^2,
    ||h_(L,tau)'||_2^2 -> (tau^2/2)||chi||_2^2.

Therefore

    H[f_(L,tau)]/X[f_(L,tau)]
       -> [tau^2+(m-1/2)^2]/[tau^2+(m+1/2)^2].            (3.1)

This ranges from the Hardy endpoint to 1. It is an exact local obstruction in the theta weight, independent of arithmetic averaging.

At a simple zero, (2.3) also gives, for fixed tau>0,

    M[f_(L,tau)]/X[f_(L,tau)]
      -> W_av(r) / {g(0)^2 [tau^2+9/4]}.                 (3.2)

The tau=0 endpoint has the same expression with tau=0. Since g(0)=F'(r)=+/-a(r)Z'(r), the right side is

    log^3(2+r) / {Z'(r)^2 [tau^2+9/4]}.

Equation (3.2) does not assume a bound on Z'(r). In particular, it must not be converted into a uniform constant by an unproved zero-derivative estimate.

### 3.1 Simultaneously defeating averaged-potential domination

For each fixed r, m, and chosen large L, keep the compact annulus fixed and let tau tend to infinity. Its M coefficient in (2.3) is bounded, even for m>1. The norm of h is bounded while its derivative norm grows quadratically in tau. The coefficient in (2.2) is also bounded. Hence, after X normalization,

    H[f_(L,tau)] -> 1,
    integral |V| f_(L,tau)^2 -> 0,
    M[f_(L,tau)] -> 0.                                    (3.3)

Here each expression denotes the normalized form. For any requested error epsilon and support radius delta, first choose L with d exp(-L)<delta, then choose tau large enough for (3.3). This order avoids any unjustified uniformity in r, m, L, or Z'(r). Choosing a new high zero at each step gives compactly supported tests escaping to infinity.

## 4. Polynomial graph density with the averaged weight included

The prior graph-density argument remains valid after adding W_av. Set

    v = F^2 + |V| + W_av.

Both v and w=F^2 have a positive exponential moment. Polynomial graphs (p,p') are dense, in the graph-closure sense, at every (f,f') with f smooth and compactly supported in

    L^2(v) direct-sum L^2(w).

For completeness, suppose (A,B) in that Hilbert space annihilates every polynomial graph. The distribution

    S = A v - (B w)'

has zero polynomial moments. Cauchy-Schwarz supplies positive exponential L1 moments for A v and B w. Consequently

    Phi(z) = Fourier(A v)(z) - i z Fourier(B w)(z)

is analytic on a strip around the real axis. All its derivatives at zero vanish, so the identity theorem gives Phi=0, hence S=0. Therefore (A,B) annihilates every compactly supported smooth graph. The double-orthogonal-complement theorem yields the claimed graph closure. This does not incorrectly treat the derivative term as a measure.

The weights are even, so parity symmetrization of the approximating polynomials is contractive and preserves the prescribed parity. In particular, for each individual test f, there are finite polynomials p with

    H[p-f] + integral (F^2+|V|+W_av)(p-f)^2

as small as desired. The integration-by-parts identity gives

    0 <= X[p-f] <= H[p-f] + integral |V|(p-f)^2.

Thus the approximation controls T, H, signed Q, absolute potential, and M. It also controls their restrictions to every measurable region. There is no estimate here for the required approximation degree.

## 5. Exact orthogonality to any prescribed growing finite prefix

This strengthening prevents a fixed or slowly growing number of orthogonality conditions from repairing the uniform bridge.

For a prescribed finite E_j, take an X-orthonormal basis e_1,...,e_d. Let Pi_j be its X-orthogonal projection. For a compactly supported f with X[f]=1 and support in a measurable set Omega,

    ||Pi_j f||_X^2
      = sum_k |integral T f T e_k|^2
      <= sum_k integral_Omega |T e_k|^2.                  (5.1)

The bound tends to zero either when Omega escapes to infinity, or when Omega shrinks to the two fixed points +/-r. The latter follows from absolute continuity of the integrals and is useful after the zero has already been chosen. Both statements respect parity-reflected supports.

Here is an explicit account of all finite-dimensional inverse constants. In any fixed basis v_1,...,v_d of E_j, let G_j be the positive definite X Gram matrix, A_j the Gram matrix of

    G[f] = H[f] + integral (F^2+|V|+W_av)f^2,

and B_j(Omega) the matrix with entries integral_Omega (T v_k)(T v_l). Define

    C_j = max(1,lambda_max(G_j^(-1/2) A_j G_j^(-1/2))),
    eta_j(Omega)^2 = Tr(G_j^(-1) B_j(Omega)).

These are finite, and (5.1) is exactly ||Pi_j f||_X^2<=eta_j(Omega)^2. One may bound C_j by max(1,||G_j^(-1)|| ||A_j||), but no degree-uniform bound is asserted. If E_j is empty take C_j=1 and eta_j=0. In particular,

    H[e] + integral (F^2+|V|+W_av)e^2 <= C_j X[e]

for e in E_j. No positive Q gap is needed: the only inverse here is the explicitly displayed finite X Gram inverse, which exists independently of Q.

Choose an actual real zero r_j>j+1, simple for the endpoint family. Then choose its support annuli Omega_j sufficiently small that eta_j(Omega_j) is as small as required after C_j is known. For the high-frequency family, choose tau only after these choices to enforce (3.3). Its X-normalized tests have bounded G norm, since H+absolute potential=X on this small region, while M and the term in (2.4) can both be made at most 1. For the simple-zero endpoint family, M[f_L]/X[f_L] remains bounded as L grows, by (2.3) and g(0) nonzero. The finite bound may depend on r_j and is allowed to be arbitrarily large. Choose the support tolerance after that finite bound too.

Approximate f_j by a parity polynomial s_j in the augmented graph norm and set

    p_j^raw = s_j - Pi_j s_j,
    p_j = p_j^raw / sqrt(X[p_j^raw]).

For a quantitative check, if G[s_j-f_j]^(1/2)<=delta_j, then X[s_j-f_j]^(1/2)<=delta_j and

    G[Pi_j s_j]^(1/2) <= sqrt(C_j)[eta_j(Omega_j)+delta_j],
    G[p_j^raw-f_j]^(1/2)
       <= delta_j + sqrt(C_j)[eta_j(Omega_j)+delta_j].       (5.2)

For a desired raw error epsilon_j, it suffices to choose

    eta_j(Omega_j) <= epsilon_j/(4 sqrt(C_j)),
    delta_j <= epsilon_j/[4(1+sqrt(C_j))].

Choose epsilon_j also small relative to 1+G[f_j]^(1/2) if full augmented-graph closeness after normalization is desired. The preceding local bounds allow this choice before taking the final large L or tau. Equation (5.2) then proves the correction is tiny in each of X, H, absolute potential, and M. The normalization tends to 1, and all desired limits persist. Exact X orthogonality to E_j holds. The polynomials are nonzero and, when E_j is the full prefix through j, have degree greater than j.

For the endpoint family select simple real zeros and choose L_j so that its H/X ratio is within 1/j of 1/9. For the high-frequency family select L_j and tau_j in that order to make both absolute potential and M below 1/j. All choices are existential finite choices at each j. No uniform degree estimate or inverse-gap bound is smuggled in.

## 6. Precisely what is falsified and what remains possible

The endpoint family disproves the implication

    X-normalized + actual-theta tail localization + finite-prefix orthogonality
       ==> H[p_j] -> 0.

The high-frequency family disproves any tail-uniform inequality of the form

    H[p] <= epsilon_R X[p] + C M[p] + o(1) X[p],

where epsilon_R tends to zero, C is fixed, and the final error tends to zero for the constructed tail-localized families. A version using H restricted to |t|>R is also contradicted: the constructed H energy is all there asymptotically. It likewise disproves a uniform assertion that the averaged potential dominates X on all escaping finite polynomials. Multiplying M by any fixed constant, such as the monomial arithmetic factor 1/3, does not change the obstruction.

The endpoint family establishes nondecay without high logarithmic frequency. The stronger M/X->0 family uses an unconstrained logarithmic frequency and can require very large polynomial degrees. The averaged-domination obstruction itself can also be made with highly oscillatory tests away from zeros; the exact zero construction above additionally resolves the real-Xi-zero domain and Hardy endpoint issue. It is therefore especially important not to describe it as a counterexample to a theorem whose admissible tests satisfy degree n and localization at |t| comparable to n.

The polynomials generally contain many selected-basis coefficients above the prescribed prefix. They are not the one-dimensional new endpoint of that prefix, and no bound on their degree relative to the prefix or zero height has been supplied. Nevertheless, each polynomial, at its own degree n_j, automatically obeys the separate uniform n_j log n_j tail theorem in `/workspace/shared/theta_selected_escape_20261104/UNIFORM_LOGARITHMIC_RANGE_BOUND.md`. Consequently compact escape, that n log n tail restriction, and incomplete finite-prefix orthogonality together still do not force derivative decay. There is no conflict: approximation degree can grow as much as needed.

What a successful selected proof still needs is a fact using the entire X-minimizing endpoint structure, or a degree-sensitive exclusion of these fine near-zero profiles. Compact localization alone, ordinary graph density, arbitrarily many but incomplete lower orthogonality conditions, and the monomial saddle asymptotic do not supply that fact.

No conclusion about the sign of Delta_n, the value of U_n/Delta_n for selected q_n, or the 11/20 amplitude constant follows from this obstruction.

## 7. Inputs and verification boundary

1. Exact theta forms, exponential moments, and the original graph-density argument: `/workspace/shared/theta_coupling_bounds_20261103/AMPLITUDE_SOBOLEV_REDUCTION.md`.
2. Actual selected compact bounds and the monomial asymptotic: `/workspace/shared/theta_excess_independent_20261104/SELECTED_COMPACT_LOCALIZATION_AND_MONOMIAL_TEST.md`.
3. Selected parameter/excess identities and the need for the full endpoint selection: `/workspace/shared/theta_coherence_asymptotics_20261104/PARAMETER_STABILITY_AND_TRACE.md`.
4. H. M. Bui, J. B. Conrey, and M. P. Young, *More than 41% of the zeros of the zeta function are on the critical line*, arXiv:1002.4127v2, https://arxiv.org/pdf/1002.4127 . Page 1 defines N_0^*(T) as the simple critical-line zero count and Theorem 1.1 gives κ*≥0.4058. This primary theorem was directly verified in the earlier audit. Together with the standard Riemann–von Mangoldt count, it implies that simple positive real Xi zeros are unbounded, which is the only consequence used here. No RH-dependent zero-derivative estimate is used.

The displayed local-coordinate algebra and the graph/projection transfer have been checked analytically in this note. They are not machine-formalized or externally peer-reviewed. No literature-novelty claim is made.
