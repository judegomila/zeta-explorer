# Exact endpoint selection in the full GCD arithmetic model

2026-11-04. A fully solved arithmetic comparison model, not the actual theta polynomial selection. All divisor cross terms are retained. This note neither identifies a theta-selected polynomial with this model nor supplies a relative growing-block theta approximation.

## 1. Result and boundary

On the complete integer label set {1,...,N}, let

    K(a,b)=gcd(a,b)/sqrt(ab),
    Lambda_N(a,a)=log(a/N).

Minimize c* K c subject to c_N=1. The unique fully K-selected endpoint vector is

    c_a=sqrt(a/N) mu(N/a)  if a divides N,
    c_a=0                 otherwise.                         (1)

It is K-orthogonal to every one of the N-1 older coordinate directions, not just a short prefix. Its exact norm and centered derivative response are

    A_N=c* K c=phi(N)/N,
    [(Lambda_N c)* K (Lambda_N c)]/A_N
       =sum_(p divides N) (log p)^2/(p-1).                   (2)

For N>=2 the latter is at most

    (log 2) log N,

and the elementary Chebyshev prime bound improves this to

    C [log log(N+3)]^2.                                    (3)

Thus full arithmetic selection can control a derivative multiplier even though the dimension-free all-vector inequality fails on fixed-width integer windows. These are different selected spaces and different statements. In particular the label set in this note is the full prefix 1,...,N; its centered log-frequency width grows like log N, rather than remaining fixed.

No identity relates the polynomial-degree selector of X[p]=||Fp'+2F'p||^2 to the integer-label selector in (1). That missing identification, or a suitable replacement estimate, is essential. The exact finite-theta matrices involve derivatives and every pair of arithmetic summands, not this bare GCD matrix.

## 2. Divisor coordinates make complete selection explicit

For any vector c on 1,...,N define

    b_d(c)=sum_(a<=N, d divides a) c_a/sqrt(a).

The exact divisor factorization gives

    c* K c=sum_(d<=N) phi(d)|b_d(c)|^2.                    (4)

The map c -> b is triangular and invertible, with nonzero diagonal, so K is strictly positive. For (1), the elementary Mobius identity yields

    b_d(c)=(1/sqrt(N)) sum_(d divides a divides N) mu(N/a)
          =1/sqrt(N) if d=N, and 0 otherwise.             (5)

Every older coordinate vector e_j, j<N, has b_d(e_j)=0 at d=N. Hence (4)-(5) prove K(c,e_j)=0 for all j<N. Also c_N=1 and (4) gives A_N=phi(N)/N. The Pythagoras identity now proves that c is the unique constrained minimizer, without a condition-number estimate or discarded cross term.

## 3. The selected derivative response is a prime sum

The last coefficient of Lambda_N c is zero. If d does not divide N, its divisor coordinate vanishes. For d|N put q=N/d. Then

    b_d(Lambda_N c)
       =(1/sqrt(N)) sum_(r divides q) mu(q/r) log(r/q).

At q=1 this is zero. At q>1, sum_(r|q)mu(q/r)=0 and the standard convolution identity (mu * log)(q)=Lambda_vM(q) gives

    b_d(Lambda_N c)=Lambda_vM(N/d)/sqrt(N),  d<N,          (6)

where Lambda_vM is the von Mangoldt function, not the diagonal matrix Lambda_N. Therefore

    [(Lambda_N c)* K (Lambda_N c)]/A_N
       =sum_(d divides N, d<N) [phi(d)/phi(N)]
                                  Lambda_vM(N/d)^2.      (7)

Only prime-power quotients contribute. If p^e exactly divides N, multiplicativity of phi gives

    sum_(k=1)^e phi(N/p^k)/phi(N)
       =sum_(k=1)^(e-1) p^(-k)+1/[p^(e-1)(p-1)]
       =1/(p-1).

Substituting into (7) proves (2). Prime powers have not been omitted; their exact sum is the denominator p-1.

## 4. Uniform complexity bounds

The function log x/(x-1) decreases on x>=2. Hence

    sum_(p|N) (log p)^2/(p-1)
       <=(log 2) sum_(p|N)log p <=(log 2)log N.            (8)

For the stronger bound choose y=max(3,log N). The elementary Chebyshev estimate theta(x)=sum_(p<=x)log p<=C x and partial summation imply

    sum_(p<=y) (log p)^2/(p-1) <= C log^2 y.               (9)

Indeed apply partial summation to theta and the positive decreasing function log x/(x-1); its derivative has magnitude O(log x/x^2), whose product with theta(x) integrates to O(log^2 y). For p>y, monotonicity gives

    sum_(p|N,p>y) (log p)^2/(p-1)
       <=[log y/(y-1)] sum_(p|N)log p
       <=C log y.                                       (10)

Equations (9)-(10), absorbing small N, prove (3). This uses no RH, prime-gap assertion, or asymptotic prime number theorem.

## 5. A conditional leading-model implication, and why it is not a theta proof

For clarity, consider only the explicitly defined matrix model

    G_(T,N)=(log T)^3 K,
    J_(T,N)=(log T) Lambda_N K Lambda_N,   T>1.

Its completely selected endpoint is exactly (1), and (2)-(3) give

    h_(T,N) <= C [log log(N+3)]^2/(log T)^2.               (11)

Thus if N<=T^C0 for a fixed C0, this model has h_(T,N)->0. Fixed positive scalar constants in front of either matrix do not change the conclusion.

The same conclusion survives genuine reselection in the positive-sum comparison model. Define

    G=alpha K+beta Lambda_N K Lambda_N,
    J=beta Lambda_N K Lambda_N,       alpha>0, beta>=0,

and let c_G be its complete endpoint minimizer with (c_G)_N=1. Set R_N to the exact prime sum in (2) and A_0=phi(N)/N. The bare-K selected trial from (1) gives

    G[c_G]<= (alpha+beta R_N)A_0,

while complete K-minimality gives K[c_G]>=A_0. Consequently

    J[c_G]/G[c_G]
       =1-alpha K[c_G]/G[c_G]
       <= beta R_N/(alpha+beta R_N).                      (12)

This proof uses the actual changed selector of G, not an identification with the old K selector. Taking alpha=(log T)^3 and beta=log T again gives a vanishing selected quotient when N<=T^C0. It is still a theorem only for this explicitly defined positive-sum arithmetic model.

Equation (11) is a proved statement about the matrices just defined, not an approximation theorem for the exact theta source. In growing arithmetic families, even the ordinary twisted zeta mean-square has additional logarithmic arithmetic terms involving log(ab/gcd(a,b)^2). They need not be lower order at polynomial label size. The derivative/potential twisted forms have their own correlations, and the actual polynomial selector is not the integer-label selector. These effects must all be controlled before (11) could inform an actual-theta bound.

The useful distinction is exact: complete selection yields an explicit Mobius cancellation in a genuine full arithmetic kernel, whereas an arbitrary bounded-frequency packet need not have that cancellation. This supplies a calibrated example of a mechanism selection can provide. It does not establish that the required cancellation occurs for the actual P_n.

## Verification scope

The factorization, complete-prefix orthogonality, prime-power summation, and complexity bounds are derived analytically above. No numerical sign check or finite scan is used. The definitions and basic identities for phi, mu, and Lambda_vM suffice for Sections 2-3; Section 4 uses only the classical elementary Chebyshev upper bound, with the weaker fully elementary bound (8) also stated.

No frozen artifact, repository, external service, or 4CT work was changed. The actual selected determinant upper bound remains open.
