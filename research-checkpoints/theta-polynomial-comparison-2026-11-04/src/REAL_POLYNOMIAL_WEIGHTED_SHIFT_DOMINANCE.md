# Degree-independent weighted vertical-shift dominance

2026-11-04. Elementary independent proof. No frozen-file edits and no theta asymptotic is asserted here.

For c>0 set

    M_c(f)=sup_(x∈R) exp(−c|x|/2)|f(x)|.

For every a>0 and every real-coefficient polynomial p,

    M_c(p) ≤ exp(ca/2) M_c(p(·−ia)).                    (1)

The constant is independent of degree and coefficients. This note does not assert that exp(ca/2) is optimal.

## Proof

Fix b>a and define on the closed strip |Im z|≤a

    S_b(z)=sqrt(z²+b²),
    q_b(z)=p(z)exp[−(c/2)S_b(z)],

using the principal square-root branch. For z=x+iy in this strip,

    Re(z²+b²)=x²+b²−y²>0.

Thus z²+b² stays in the open right half-plane and S_b is analytic on a neighborhood of the closed strip. Its real part u is positive. If S_b=u+iv, then

    u²−v²=x²+b²−y²,

which gives u²≥x². Conversely the triangle inequality gives

    u²=(|z²+b²|+Re(z²+b²))/2
       ≤[(x²+y²+b²)+(x²+b²−y²)]/2
       =x²+b².

Consequently

    |x|≤Re S_b(x+iy)≤sqrt(x²+b²)≤|x|+b.              (2)

On the horizontal boundary,

    |q_b(x±ia)|≤exp(−c|x|/2)|p(x±ia)|.

On vertical rectangle edges x=±R, uniformly for |y|≤a,

    |q_b(±R+iy)|≤C_p(1+R)^(deg p) exp(−cR/2)→0.

Apply the maximum-modulus principle on [−R,R]×[−a,a] and let R→∞. This yields

    sup_(x∈R)|q_b(x)|
       ≤max{M_c(p(·+ia)), M_c(p(·−ia))}.

On the real axis S_b(x)=sqrt(x²+b²), so (2) gives

    M_c(p)≤exp(cb/2) sup_(x∈R)|q_b(x)|.

For real coefficients, p(x+ia)=overline{p(x−ia)}, and the two boundary weighted suprema are identical. Thus

    M_c(p)≤exp(cb/2)M_c(p(·−ia)).

Finally let b↓a to obtain (1). The zero polynomial is immediate.

## Scope

Without real coefficients the proof establishes the same bound with the maximum of both shifted boundary norms. It does not replace that maximum by one boundary norm without an additional argument. The exponential boundary decay is used only after fixing p; no degree-dependent constant remains in (1).
