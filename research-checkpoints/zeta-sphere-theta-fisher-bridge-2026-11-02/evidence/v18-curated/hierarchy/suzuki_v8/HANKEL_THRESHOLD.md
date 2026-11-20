# Arithmetic Hankel threshold: exact representation and certified analytic budgets

Analytic setup and route ledger. A subsequently completed, independently reviewed signed block certificate crosses the n=2 threshold; see BLOCK_CERTIFICATE.md. No determinant formula or global nonvanishing is claimed.

## Source and overlap

Primary: Masatoshi Suzuki, arXiv:1204.1827v2, https://arxiv.org/pdf/1204.1827, downloaded with explicit user authorization; local SHA256 2c4cf2aa7a5bca731e0f1ac356deaa082eb6137a07c465fdfe09198acc82ef38. Read §§2,3.1,4.1,5. The paper's unconditional canonical-system theorem assumes omega>1; small-shift continuation cannot be imported from it. Only the kernel definitions and proved right-half-plane Mellin representation are used below. The arithmetic coefficients are c_w(n)=n^w product_(p|n)(1−p^(−2w)); h_w(x)=x^−1 sum_(n≤x)c_w(n)g_w(n/x), supported x≥1. The finite compression has kernel h_w(xy) on (0,A)². The historical catalog reports no checked duplicate of this specific first-threshold contraction; older Suzuki storage/prime5 work is being queried separately.

## Logarithmic compression, derived directly

The unitary map f(x) -> exp(u/2)f(exp u), x=exp u, turns the compression into a real symmetric Hankel kernel k_w(u+v), u,v≤L=log A. Since k_w(s)=0 for s<0, its active domain is [-L,L]. Put R=2L. Then

    k_w(s)=sum_(n≤exp s) c_w(n)/sqrt(n) q_w(s−log n),
    q_w(r)=exp(−r/2) g_w(exp(−r)), r>0.

Writing z=1−exp(−2r), define

    C_w=2pi^w/Gamma(w),
    q_w(r)=C_w[exp(−(5/2−w)r) z^(w−1)
                  −w exp((1/2−w)r) B_z(w,3/2−w)].

Here B_z is the unregularized incomplete beta integral. The arithmetic thresholds are exactly R=log n, equivalently A=sqrt(n); at finite R only finitely many n occur. The first extra term at R=log2 has coefficient

    c_w(2)/sqrt2 = (2^w−2^(−w))/sqrt2.

For small w its threshold singularity is a nonzero multiple of (s−log n)^(w−1). It is integrable for every w>0 and square-integrable only for w>1/2. A Hilbert–Schmidt argument is invalid in the requested w<1/2 range.

Reflection converts this Hankel operator into the causal Volterra convolution with k_w on [0,R]; reflection is unitary, so their operator norms agree. Young's inequality bounds that norm by integral_0^R |k_w(s)|ds. Approximating each integrable singularity in L1 by smooth kernels proves compactness of every finite compression for w>0, without invoking global innerness. It does not prove norm<1.

## Analytic treatment of the threshold singularity

For 1/4≤w≤1/2 and 0<r≤1, write q=q1−q2 with q1,q2 positive. Elementary inequalities give

    q1(r) ≤ c r^(w−1),
    q2(r) ≤ 2c exp(r/2) r^w,
    c=(2pi)^w/Gamma(w).

Indeed 1−e^(−2r)≥2r e^(−2r) handles the negative exponent in q1, while t^(1/2−w)≤1 in the beta integral bounds q2. Hence for 0<d≤1,

    integral_0^d |q_w(r)|dr
       ≤ (2pi)^w/Gamma(w+1) d^w
             [1+2w exp(d/2)d/(w+1)]
       ≤ 4 d^(1/4)(1+2d).                         (1)

The constant4 can be checked without numerical gamma evaluation: Gamma(w+1)≥integral_0^1 t^(1/2)(1−t)dt+integral_1^infinity e^(−t)dt=4/15+1/e>104/165, while (2pi)^w≤sqrt(2pi)<251/100. Use e<11/4 and pi<22/7. These imply the prefactor<4.

As an immediate *pre-threshold* certificate, every w∈[1/4,1/2] and R≤1/625 satisfies norm(H)≤(4/5)(1+2/625)=0.80256<1. This is an actual finite-interval contraction, but is far short of R=log2.

For the n=2 term alone, c_w(2)/sqrt2≤1/2. Therefore its contribution just after the threshold R=log2+d has norm at most

    2 d^(1/4)(1+2d).                               (2)

This bound treats the integrable singularity analytically; no sampled value at the singular point is used.

## An explicit crossing budget, conditional on a signed base gap

Dilation identifies all Volterra operators with a fixed [0,1] space. Differentiating the dilated n=1 kernel R q_w(Rs) gives q_w(r)+r q_w'(r). The beta formula yields q2'=(1/2−w)q2+2w q1. Also

    |q1+r q1'| ≤ c r^(w−1)[w+(9/2)r].

For r≤1 these imply

    integral_0^R |q+r q'|dr ≤22.

Thus for R0=log2 and 0≤d≤1−log2 the n=1 operators differ in norm by at most32d (using R0>.69). Combining this with (2),

    norm(H_(w,log2+d))
      ≤ norm(H_(w,log2)) +32d+2d^(1/4)(1+2d).       (3)

For a narrower compact w-range [w0,w1]⊂[1/4,1/2], the exponent1/4 in (1)–(3) may be replaced by w0, retaining the same constants. Formula(3) is a precise testable transfer budget, NOT a base-gap certificate. For example a proved uniform base gap gamma would permit any d with32d+2d^w0(1+2d)<gamma. The later signed block certificate proves a narrow crossing directly; formula(3) is retained as a separate analytic budget, not the method used to certify that crossing.

## Probes and failure ledger

Original exploratory code only; no acquired code execution. Signed piecewise-constant Galerkin probes (n=400) suggest top eigenvalues near .99965 for w=.25 and .99941 for w=.4 at R=log2. At w=.49,R=log(2.001), the probe gives .9992561, while its entrywise-absolute matrix has norm about1.0518. These are not interval certificates and do not bound the full operator. Plain absolute L1 Schur estimates already exceed1 at the threshold. Simple power-weighted absolute Schur probes also fail. Thus sign cancellation is essential; replacing the signed gamma kernel by its absolute value cannot justify the crossing based on these estimates.

The subsequent BLOCK_CERTIFICATE.md supplies the required signed block certificate with analytic weak-singularity error; ordinary sampled quadrature or an inapplicable HS estimate would not suffice. Small finite compression contractivity alone gives invertibility of I±H on that finite interval. It does NOT automatically justify Suzuki's small-shift determinant formulas, their regularization, canonical-system differentiability, global innerness, or any positivity claim for the campaign's C_a kernel. No such bridge is asserted here.
