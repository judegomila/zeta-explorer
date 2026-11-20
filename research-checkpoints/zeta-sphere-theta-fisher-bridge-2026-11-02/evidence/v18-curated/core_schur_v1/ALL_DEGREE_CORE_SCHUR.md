# Exact all-degree core/tail Schur transport

2026-11-02. Independent mathematical review and strengthened interval replay PASS; see ../core_schur_audit/AUDIT.md. These are exact reductions and sufficient criteria, **not an all-order positivity proof**. The all-degree outer theorem supplies a positive outer region with logarithmic cutoff; the signed core remains the obligation below.

## 1. Tail matrices and the actual evolution

Work in either parity block of the original Bell moments, in a fixed real or complex coefficient basis. Let B_J(h) be its full-theta matrix density, including2h²ψ(h)², and F_J(H)=∫_H∞B_J(h)dh. Partition the last degree against earlier degrees:

F_J=[A,b;b*,c],  B_J=[A0,b0;b0*,c0].

Assume A(H)>0 on the interval under discussion, as would follow from the lower-order cumulative-tail theorem. Define r=A⁻¹b and S=c−b*A⁻¹b. Direct differentiation gives

r'=−A⁻¹(b0−A0r),
S'=−[c0−2Re(r*b0)+r*A0r].                                      (1)

This is an exact coupled transport law; it does not discard any interaction or assume the local matrix B_J positive. For multiple newly added channels replace r by a matrix and the real cross term by its Hermitian symmetrization.

Where A0>0, put r0=A0⁻¹b0 and s0=c0−b0*A0⁻¹b0. Then

S'=−s0−(r−r0)*A0(r−r0).                                       (2)

Therefore for a known positive outer endpointH*,

S(H)=S(H*)+∫_H^H* [s0(u)+(r(u)−r0(u))*A0(u)(r(u)−r0(u))]du.    (3)

The second term inside the integral is a genuine nonnegative compensation term. Negative pointwise Schur residuals can be paid by changing projection coefficients across the actual theta profile. Conversely, dropping this term can lose a proof; assuming it covers the entire negative term would be circular.

Equation(2) is available only where the local lower block A0 is positive. At high degree that premise is not automatic: the original pointwise H5 block already fails near zero. Equation(1) remains valid whenever the integrated lower block A is positive.

The local density is generally not rankone and can be indefinite. Thus F_J need not be Loewner-decreasing with H, and standard positive-measure rankone moment updates cannot be imported without proof.

## 2. Exact finite-block merge with a positive covariance gain

Let T be the actual integrated outer tail and C an actual finite-core block. Write their lower blocksAt,Ac, columnsbt,bc and last entriesct,cc. IfAt,Ac>0, define Rt=At⁻¹bt, Rc=Ac⁻¹bc and St,Sc their Schur complements. Then

S(T+C)=St+Sc+(Rc−Rt)*(Ac:At)(Rc−Rt),                           (4)
Ac:At=(Ac⁻¹+At⁻¹)⁻¹.

This identity is valid for noncommuting positive matrix weights. It follows by completing the square after minimizing over the common lower-degree projection. Equivalently Ac:At=Ac−Ac(Ac+At)⁻¹Ac. The correction is positive semidefinite. It is not an entrywise or scalarweight approximation.

One may merge a partition of the core recursively. Each merge retains its own covariance gain; the final answer equals the Schur complement of the total matrix independent of merge order. A proof must verify positivity of the lower blocks at each merge. Choosing an interval so small that its local lower block is indefinite defeats this version of the recursion; coarser integrated blocks or(5) below are then needed.

For a scalar last channel with St>0, the directly verifiable sufficient condition is

−Sc < St + (Rc−Rt)*(Ac:At)(Rc−Rt).                            (4a)

No comparison is made with a fixed first theta term or a headline Gaussian amplitude. The denominator is the actual outer-tail Schur reserve plus the actual mixing gain.

## 3. An exact version without assuming the core lower block positive

Assume only At>0 and At+Ac>0. Set

r0=At⁻¹bt,
e=bc−Ac r0,
d=cc−2Re(r0*bc)+r0*Ac r0.

Completing the square in the tail-adapted basis gives

S(T+C)=St+d−e*(At+Ac)⁻¹e.                                   (5)

If S_t is a matrix, strict positivity is equivalent to

I+St^(−1/2)[d−e*(At+Ac)⁻¹e]St^(−1/2)>0.                    (6)

This exposes the complete residual coupling cost in a tail-normalized coordinate system. It also works when Ac is indefinite. The hypothesis At+Ac>0 is the lower-order induction hypothesis, not a conclusion from the outer theorem.

For the interpolationT+sC, all lower blocks At+sAc are positive for0≤s≤1 if both endpoints are. The same formula becomes

S(s)=St+s d−s² e*(At+sAc)⁻¹e,
S''(s)=−2(bc−Ac r_s)*(At+sAc)⁻¹(bc−Ac r_s)≤0.

This concavity does not itself imply positivity at s=1. It identifies the exact loss that any purported monotone continuation must pay.

## 4. How the degree-dependent Gaussian outer theorem may be used

The separate theorem provides, for degree≤J and X(h)=−ell''(h)≥2²²J²,

M_J(h)≥(2/3)D_X G_J D_X

in the stated variance-normalized coordinates. Retain the integrated Gaussian mixture

Z_J=∫_{H_J}∞2h²ψ(h)²D_X G_J D_X dh.

Then the actual outer tail satisfies T_J≥(2/3)Z_J>0. This supplies a valid reference or verified initialization for(1)–(6).

It is **not** valid to replace every G_X by G_(X(H_J)) merely because X increases. Expectations of arbitrary polynomial squares under Gaussian measures are not Loewner-monotone in variance. For example E[(Y²−c)²]=3v²−2cv+c² decreases with variancev whenv<c/3. The full Gaussian mixture or a proved matrix lower bound must be kept.

At the conservative threshold X~J², the raw theta mass of the outer tail is exponentially small inJ². Separately bounding large positive core terms and large coupling terms by absolute norms can destroy their cancellation. Equations(4) and(5) keep that cancellation; they do not establish the needed order-uniform relative bound by themselves.

## 5. A safe covariance lower bound when matrix weights vary

If a local lower block satisfies A(h)≥λ(h)Aref with fixedAref>0 andλ(h)>0, then the exact averaging covariance obeys

inf_R ∫(R_h−R)*A(h)(R_h−R)dh
≥ [1/(2Λ)]∫∫λ(h)λ(k)(R_h−R_k)*Aref(R_h−R_k)dhdk,
Λ=∫λ.

This follows by replacing the matrix weight by the fixed lower bound and minimizing the resulting weighted Euclidean square. It avoids an invalid pairwise identity for noncommuting matrix weights. It can be applied to the already verified low-order positive channels while retaining the higher-channel residual. Coercivity uniformly over all higher polynomials still requires a theorem; finite-channel positivity alone does not establish it.

## 6. Exact scalar tail moments and a numerical trap

For μ_n(H)=∫_H∞2h²(-1)^n ∂_v^(2n)[ψ(h−v)ψ(h+v)]_(v=0)dh, the identity
(∂y−∂x)²=(∂x+∂y)²−4∂x∂y yields

μ_n(H)=2·4^n∫_H∞h²|ψ^(n)|²dh−n4^n∫_H∞|ψ^(n−1)|²dh + B_n(H),

with the second term omitted atn=0, and

B_n(H)=Σ_(j=1)^n (−1)^j binom(n,j)4^(n−j)
[−2H²D^(2j−1)(ψ^(n−j))² +4HD^(2j−2)(ψ^(n−j))²
 −4·1_(j≥2)D^(2j−3)(ψ^(n−j))²]_(h=H).

This follows by integrating the diagonal derivative2j times; only the first three derivatives of2h² survive. AtH=0 all boundary terms vanish by parity.

The formula is exact but can be disastrously ill-conditioned. A floating probe atH=1.5 produced apparent negative7×7 tail matrices;80-digit recomputation removed both negatives. The even and odd blocks were positive in that highprecision experiment. Those values remain exploratory, not interval certificates. No higher-order tail obstruction is claimed. For rigorous computation use direct Bell/log jets, tail-adapted coordinates, interval quadrature, and explicit error accounting rather than trusting a large bulk-minus-boundary cancellation.

## 7. Remaining theorem

A sufficient induction would prove, in each parity and every degreeJ, positivity of the previous tail block and the signedcore condition(3), or equivalently an appropriate sequence of exact block merges(4)/(5), uniformly for all cutoffH≤H_J. The outer part is available. The actual full-theta covariance/coupling estimate on this degree-dependent core is not yet proved. This is the precise remaining condition, not a claim that the finiteH5 certificate establishes it for everyJ.


## 8. Verified zero-shift covariance example

`certify_covariance_repair.py` applies(4) to the actual oddH5 matrix at the **normalized zero-shift limit a=0 only**, with exact density2h² times the full theta Bell moments. The core is[0,1/16], the tail[1/16,∞), and the fixed congruence scaling isdiag(1,200,80000). Its complete-theta adaptive Simpson quadrature includes explicit fourth-derivative bounds. The already certified first shift-bin interval is used only as an enclosure of the a=0 total matrix; it does NOT make this particular core/tail decomposition an all-shift certificate.

The integrated core itself has a negative Schur complement, approximately−0.000066190603. Its positive lower2×2 block and this negative Schur complement certify that the whole core block is indefinite. The exact mixing gain is enclosed between0.000596788 and0.000646730, already more than nine times the deficit, independently of the additional positive tailSchur reserve exceeding0.127. The deficit divided by(actualtailreserve+mixinggain) is below0.000519. See `covariance_repair.json` for full intervals.

All inversions explicitly check both A00>0 and determinant>0, ensuring positive definiteness rather than merely invertibility. This is a concrete theta-specific realization of covariance repair. It does not establish an order-uniform inequality or an all-shift numerical reserve. It also shows why a naive fixed-core positive-block recursion cannot be assumed at subsequent odd degrees: the integrated oddH5 core is already indefinite.
