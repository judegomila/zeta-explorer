# Independent audit of exact GCD endpoint selection

2026-11-04. Read-only audit of `EXACT_GCD_ENDPOINT_SELECTION.md`. No frozen file or 4CT artifact was changed. This is analytical verification, not external peer review or machine formalization.

## Verdict

All stated formulas and bounds pass. The endpoint normalization, orthogonality to the entire older coordinate space, contribution of every prime power, and uniform log-log bound are correct. The conclusion for the explicitly defined leading matrix model is correct and does not establish an actual-theta selected estimate.

A useful optional extension is proved in Section 5 below: the model's small selected derivative ratio survives adding its positive derivative matrix to the source, although that addition changes the selected vector. This remains solely a finite-matrix-model statement.

## 1. Endpoint and norm

Let K_(a,b)=gcd(a,b)/sqrt(ab) on labels 1,...,N. For

    b_d(c)=sum_(d|a, a<=N)c_a/sqrt(a),

one has exactly

    c*Kc=sum_(d<=N)phi(d)|b_d(c)|^2.

The map from c to b is triangular with nonzero diagonal, so this is a strictly positive quadratic form. For the proposed vector

    c_a=sqrt(a/N)mu(N/a) if a|N, and c_a=0 otherwise,

the coefficient c_N is one, and

    b_d(c)=(1/sqrt(N))1_(d=N).

For d not dividing N the sum is empty. For d|N, this is the divisor identity sum_(r|N/d)mu(r)=1_(d=N). In particular, every older coordinate e_j, j<N, has zero N-th divisor coordinate, and hence K(c,e_j)=0. The norm is exactly

    A_N=phi(N)/N.

Any other admissible vector is c+v with v_N=0. Complete orthogonality gives (c+v)*K(c+v)=A_N+v*Kv, proving uniqueness. There is no missing factor sqrt(phi(N)), and no prefix direction is omitted.

These statements include N=1, when c=(1), A_1=1, and the centered derivative vanishes.

## 2. Derivative normalization and every prime power

Write D_N=diag(log(a/N)) to distinguish the diagonal from the von Mangoldt function Lambda_vM. For d|N and q=N/d,

    b_d(D_Nc)
      =(1/sqrt(N))sum_(r|q)mu(q/r)log(r/q).

For q=1 this is zero. For q>1 the constant log q term cancels, and (mu*log)(q)=Lambda_vM(q). Thus

    b_d(D_Nc)=Lambda_vM(N/d)/sqrt(N),   d<N and d|N,

and zero otherwise. The sign is positive. Dividing the resulting K norm by A_N gives

    R_N:= (D_Nc)*K(D_Nc)/A_N
      =sum_(d|N,d<N)phi(d)/phi(N) Lambda_vM(N/d)^2.

If p^e exactly divides N, its prime-power quotients contribute

    (log p)^2 [sum_(k=1)^(e-1)p^(-k)
                    +1/(p^(e-1)(p-1))]
      =(log p)^2/(p-1).

The final k=e term is crucial. It also handles e=1 correctly, when the preceding sum is empty. Hence

    R_N=sum_(p|N)(log p)^2/(p-1).

The response depends only on the prime support of N, not the exponents. This is a consequence of including and summing all prime powers, not of dropping them.

## 3. Uniform complexity bounds

The function r(x)=log x/(x-1) decreases on x>=2, because

    r'(x)=[1-1/x-log x]/(x-1)^2<0.

It follows that

    R_N<=log(2)sum_(p|N)log p<=log(2)log N.

For the sharper bound let y=max(3,log N). The classical elementary Chebyshev estimate theta(x)<=Cx and partial summation give

    sum_(p<=y)(log p)^2/(p-1)
      =r(y)theta(y)-integral_2^y theta(x)r'(x)dx+O(1)
      <=C log^2 y.

Here |r'(x)|<=C log x/x^2. For primes exceeding y,

    sum_(p|N,p>y)(log p)^2/(p-1)
      <=r(y)sum_(p|N)log p
      <=[log y/(y-1)]log N<=C log y.

When y=3 the same estimate is an absolute bound. This proves, uniformly for all N>=1 after enlarging C,

    R_N<=C[log log(N+3)]^2.

No asymptotic prime number theorem, RH, or prime-gap estimate enters. The word “uniform” applies to this bound over integer N, not to a theta moment approximation.

## 4. The stated leading matrix model

For the expressly defined matrices

    G_(T,N)=(log T)^3K,
    J_(T,N)=(log T)D_NKD_N,    T>1,

the G-selected endpoint is exactly the K-selected endpoint because G is a positive scalar multiple of K. Its exact selected quotient is

    h_(T,N)=R_N/(log T)^2.

Therefore, uniformly over integers N<=T^C0 with fixed C0>0,

    h_(T,N)<=C(1+log log T)^2/(log T)^2 ->0.

Its source normalization is `(log T)^3 phi(N)/N`, not just phi(N)/N. The note's quotient and bound use these factors correctly. Fixed positive scalar constants multiplying G and J merely change the bound's constant.

The model does not include the complete actual-theta source. It is not an asserted uniform leading approximation to that source on growing blocks. In particular, the full integer-prefix constraint c_N=1 is a different affine selection problem from a monic degree-N polynomial constraint, and changing one into the other is not justified by the divisor identity.

## 5. Optional extension: add the positive derivative term to the model source

This extension is not needed to validate the note. It clarifies that a natural positive source correction does not by itself destroy the model conclusion.

Let alpha>0, beta>=0, set

    J=beta D_NKD_N,
    G=alpha K+J,

and let u be the unique minimizer of u*Gu subject to u_N=1. Its vector generally differs from the K-selected c above. Write A=phi(N)/N and g=u*Gu. Positivity and the K endpoint minimum imply

    u*Ku>=A,
    g<=c*Gc=A(alpha+beta R_N).

Since u*Ju=g-alpha u*Ku,

    (u*Ju)/g <=1-alpha A/g
      <=1-alpha/(alpha+beta R_N)
      =beta R_N/(alpha+beta R_N).

For alpha=(log T)^3 and beta=log T this gives

    (u*Ju)/(u*Gu)<=R_N/[(log T)^2+R_N],

so the same uniform vanishing conclusion holds for N<=T^C0. The proof uses only a variational comparison; it does not falsely preserve the old selected vector after changing G.

This remains an exact statement about the matrices defined here. It does not make their identification with the actual-theta source any more automatic.

## 6. Exact model-versus-theta boundary

What is proved:

- An exact full-prefix selection formula in the genuine positive GCD kernel.
- A precise selected multiplier response and unconditional uniform bounds for it.
- A vanishing selected response in the explicitly defined leading matrix model, and in the optional positive-sum model above, under polynomial label growth.

What is not proved:

- A map identifying this integer-label selector with the actual theta polynomial selector.
- Relative growing-block theta source/derivative approximation by these matrices.
- Control of the additional arithmetic logarithmic terms in growing twisted moments.
- Actual selected localization, endpoint stability under those errors, or H[P_n]/X[P_n]->0.

The general fixed-bandwidth all-vector Bernstein obstruction is compatible with this endpoint result: the former concerns arbitrary vectors in complete integer windows, whereas this note exploits exact Mobius cancellation in the selected endpoint of a full prefix. Neither statement transfers to a different selector without further argument.

No correction to the stated theorem is required.
