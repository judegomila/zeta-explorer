# Zero-centered actual bridge propagation, uniform down to a=0

2026-11-02. Independently reviewed analytic local propagation mechanism. This is conditional on certifying an actual critical-line zero and local analytic bounds; it does not assume all zeros lie there.

Let ξ(z)=Q(z)ζ(z) be the actual completed zeta function and ρ=1/2+iγ an actual critical-line zero. Write w=a+iu and f(w)=ξ(ρ+w). The established bridge identity is

C_a_hat(2(γ+u))=Re[f′(w) conjugate f(w)].                  (1)

## 1. Exact local factorization and the missing a-cancellation

Suppose f(w)=w^m A(w), m≥1, with A analytic and nonzero on |w|≤R. The completed functional equation and reality give
f(−conjugate w)=conjugate f(w),
A(−conjugate w)=(−1)^m conjugate A(w).
Consequently Re(A′/A)(iu)=0 on the imaginary diameter. If
|(log A)″(w)|≤K for |w|≤r<R,
then integration along the horizontal segment from iu to a+iu yields
|Re(A′/A)(a+iu)|≤aK whenever a≥0 and |a+iu|≤r.
The segment stays inside the disk. Thus exactly

C_a_hat/a ≥ |A(w)|² |w|^(2m−2) [m−K|w|²].                (2)

There is no singular division by a in this bound. In particular, for a simple zero it supplies a strictly positive normalized margin even at the limiting point (a,u)=(0,0). For multiple zeros the vanishing factor is retained rather than incorrectly claiming strict positivity there.

## 2. A fully explicit simple-zero certificate

Assume m=1, |ξ′(ρ)|≥d>0, and
sup_(|w|≤R)|ξ″(ρ+w)|≤M2,       R M2≤d.                  (3)

Taylor's integral formula gives
A(w)=ξ′(ρ)+w∫_0^1(1−v)ξ″(ρ+vw)dv,
so |A/ξ′(ρ)−1|≤1/2 on |w|≤R. In particular A has no zeros there and |A|≥d/2. The principal logarithm of A/ξ′(ρ) is analytic and has modulus at most log 2, by its convergent power series. Cauchy's estimate therefore gives

|(log A)″|≤2log 2/(R−r)² on |w|≤r.

Taking r=R/4 yields K r²≤2log 2/9<1/5. Combining this with (2) proves the explicit actual-target margin

C_a_hat(2(γ+u))/a > d²/5,
0<a,       a²+u²≤R²/16.                                (4)

The bound extends continuously to a=0. This is a two-dimensional half-disk of actual bridge positivity, not just a pointwise zero check or a positive surrogate reference. It avoids a mesh whose a-spacing collapses as a approaches zero.

## 3. How the corrected Dirichlet head pays the analytic uncertainties

Use the reviewed Euler–Maclaurin head H and remainder bounds e,e1,e2 from ../modular_transfer_v1/ACTUAL_COMPLETED_HEAD_TRANSFER.md. Since ξ=Q(H+R), the errors in ξ, ξ′ and ξ″ are bounded respectively by

U0=|Q|e,
U1=|Q′|e+|Q|e1,
U2=|Q″|e+2|Q′|e1+|Q|e2.                               (5)

On a validated disk containing the root, a lower derivative bound d can therefore be obtained from |(QH)′|−U1, and an upper M2 from |(QH)″|+U2. The bounds must hold uniformly over the disk and over any uncertainty interval for γ. A real sign change of ξ(1/2+it), together with a certified nonzero derivative, can establish existence and simplicity of an actual on-line root; no root is inferred merely from floating-point output. Conditions (3) then finish the propagation certificate. Gamma factors and all derivative errors remain present.

## 4. Clusters and the honest scaling obligation

More generally, if a disk contains a certified factorization
f(w)=P(w)A(w),    P(w)=∏_(j=1)^m(w−iu_j),    u_j real,
with A analytic/nonzero and the same symmetry, then

C_a_hat/a ≥ |f(w)|² [Σ_j |w−iu_j|^(−2)−K]               (6)

away from the factored zeros, with continuous limits after expanding the products. Thus the certified critical-line cluster supplies an inverse-square reserve, while the analytic remainder costs K. This is a correlated cluster criterion, not a count of negative directions. It requires actual certification of all factored roots and of the zero-free remainder.

For unbounded-height coverage, the new quantitative issue is maintaining overlap of such disks or clusters with the complementary sign-certified regions. In the simple-zero construction, the usable radius is controlled by |ξ′(ρ)|/sup|ξ″|. The paid Euler–Maclaurin errors can be made arbitrarily small, but they do not supply a uniform lower bound for this ratio, a lower bound on zero spacing, or proof that no off-line zero was missed. No unbounded-height coverage or RH proof follows automatically from (4).
