# Base-2 theta filter: positive residue primitive and exact endpoint cancellation

New analytical work awaiting independent audit. Source filter conventions are those of the 01:45 UTC original sphere response, privately read in source_0145_audit/private/source/relative_modular_bridge_all_order.tex. No acquired code has been executed. This note adds actual theta structure; it does not establish all-degree bridge positivity.

Fix L=log2, 0<=a<1/2, d=1/2-a, c=exp(dL), S_Lf(u)=f(u+L), A_a=a²-D², and R=(I-cS_L)^-1. The actual completed profile is
 psi(u)=4 sum_(n>=1) exp(u/2)(2z_n²-3z_n)exp(-z_n), z_n=pi n²exp(2u).

## 1. The scalar modular residue becomes a positive decaying profile

Set chi(u)=4 exp(u/2)sum_(n>=1)z_n exp(-z_n). Direct differentiation gives
 psi=-(D+1/2)chi.
Although chi grows like exp(-u/2) at negative infinity, define
 chi_2=(I-sqrt2 S_L)chi.
The scale relation combines its orbits into the alternating sum. For x=exp(2u), and Theta4(x)=sum_(n in Z)(-1)^n exp(-pi n²x),
 chi_2(u)=2 x^(5/4) Theta4'(x)>0.                       (1)
Indeed the Jacobi product Theta4(x)=prod_(n>=1)(1-q^(2n))(1-q^(2n-1))², q=exp(-pi x), has positive logarithmic derivative in x. Differentiation is locally uniformly convergent for x>0. Primary product reference: https://dlmf.nist.gov/20.5.E4 .

At positive infinity the usual full-theta series yields rapid decay. At negative infinity the modular relation Theta4(x)=x^-1/2 sum_(k in Z)exp[-pi(k+1/2)²/x] gives rapid decay as well. Thus chi_2 and every fixed derivative and position weight are in L². This is precisely where the filter repairs the unfiltered residue's domain defect.

The filtered completed profile obeys
 h_2=(I-sqrt2 S_L)psi=-(D+1/2)chi_2.
After tilt, chi_(a,2)=exp(au)chi_2 and h_(a,2)=-(D+d)chi_(a,2).

## 2. Applying the convergent scale inverse removes the base entirely

Define the canonical positive primitive
 K(u)=integral_(-infinity)^u exp[-(u-v)/2]psi(v)dv>0,
 K_a(u)=exp(au)K(u).
Then (D+d)K_a=f_a=exp(au)psi. The modular asymptotic of chi fixes the exact identity
 K(u)=exp(-u/2)-chi(u).                                (2)
The homogeneous exponential is canceled by I-sqrt2 S_L. Hence
 (I-cS_L)K_a=-chi_(a,2),
 R chi_(a,2)=-K_a.                                    (3)
Both sides of(3) are in L² and the graph domain of X for a<1/2, so uniqueness under the bounded inverse justifies it. Alternatively, R's negative geometric shift series applied to positive chi_(a,2) directly gives the sign. This positive primitive is independent of the arithmetic base; using b=2 supplies its explicit positive alternating-theta representation.

K_a is rapidly decaying at negative infinity and has the exact leading tail exp(-du) at positive infinity, with a rapidly decaying correction. This exponential tail is integrable only for d>0. No endpoint a=1/2 domain claim is made.

## 3. One exact scalar tail coefficient at every polynomial degree

Let eta=a-1/4=a²-d² and divide an arbitrary polynomial as
 p(x)=p(eta)+(x-eta)q(x).
Since A_a-eta=d²-D²=-(D-d)(D+d),
 w=p(A_a)K_a=p(eta)K_a-(D-d)q(A_a)f_a.                (4)
Its entire nonrapid positive tail is the one scalar p(eta)exp(-du); the remainder is a lower-degree complete-theta differential expression. This is an exact degree-sensitive residue extraction with no truncated scale hierarchy. It does not give a sign for the central remainder.

The original transformed profile is g=p(A_a)f_a=(D+d)w. Integration by parts, valid on these exponential/rapid tails, gives
 2Q_a[p]=integral_R u(|w'|²+d²|w|²)du-d||w||².        (5)
The complete mixed form is retained. Discarding either signed position term or assuming derivative contraction would change the target.

## 4. Exact all-degree endpoint payment

At a=0, d=1/2 and F(t)=hat psi(t) is real and even. Write
 W(t)=p(t²)F(t)/(d+it)=hat w(t).
For complex p the contribution from its own phase derivative is odd in t and integrates to zero. Parseval and X=iD_t give
 integral u|w|² = d/(2pi) integral |p(t²)F(t)|²/(d²+t²)² dt,
 integral u|w'|² = d/(2pi) integral t²|p(t²)F(t)|²/(d²+t²)² dt.
Both are nonnegative, and their weighted sum is EXACTLY d||w||². Thus (5) vanishes at a0 for every polynomial, with all nonzero terms kept. One must differentiate the entire equality in a to obtain the normalized endpoint. The new positive primitive does not produce a spare endpoint reserve.

## 5. Additional actual base-profile localization

The established actual-theta bound -(log psi)''>=17 implies that k(u)=psi(u)-sqrt2 psi(u+L) has exactly one zero. For r(u)=log psi(u)-log psi(u+L), r'>=17L, r(-L/2)=0, and the zero solves r=L/2. Thus
 -L/2 < u_* <= -L/2+1/34 <0.
The full-theta tails give r's range from minus to plus infinity. Positive exponential tilt does not change this zero. Polynomial differentiation and B^(1/2) smoothing do not preserve this one-crossing statement without an additional theorem; no such extrapolation is made.

## Remaining comparison

Equation(4) isolates the scalar tail exactly and provides a positive actual-theta primitive with legitimate domains. The sign of the central expression in(5), or a relative bound for its Schur residual after conditioning, is still missing. At a0 its positive-looking pieces cancel identically. Neither the positive base profile nor the scalar tail extraction establishes the required inequality for arbitrary polynomial degree.

## 6. Conditional spatial blocks must pay the scalar-tail boundary exactly

For any finite interval[l,r], the correct local energy identity is
 integral_l^r u|g|²
 =integral_l^r u(|w'|²+d²|w|²)-d integral_l^r |w|²
   +d[u|w(u)|²]_l^r.                                 (6)
The boundary term telescopes only when the blocks are recombined. It cannot be omitted in a blockwise positive-part or conditional-mean estimate.

For the exact scalar tail w_tail=p(eta)exp(-du), the bulk contribution on[H,infinity) is dH|p(eta)|²exp(-2dH), while the boundary contribution is its negative. They cancel exactly, as they must because(D+d)w_tail=0. Thus this explicit apparent positive tail reserve is identically zero in the actual energy, independently of degree. It is a homogeneous mode, not an available Schur reserve.

A numerically or analytically useful decomposition is w=p(eta)K_a+v, v=-(D-d)q(A_a)f_a: the slow scalar tail is treated with(6) exactly, and only the actual rapidly decaying complete-theta remainder and its cross terms are estimated. Those cross terms remain signed. In particular positive bulk tail bounds without their boundary cannot supply a growing-degree induction.
