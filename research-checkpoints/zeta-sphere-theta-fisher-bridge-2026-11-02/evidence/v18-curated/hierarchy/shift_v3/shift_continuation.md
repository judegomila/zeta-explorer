# Shift continuation from a>=1/2: exact evolution, barrier, and coupling budget

Status: exact lemmas and independently checkable sufficient estimates. No inward positivity-preserving evolution is obtained. Earlier v1/v2 outputs remain unchanged.

## 1. Exact shift evolution and derivative tower

For any real entire f define

    H_j(a,t)=|f^(j)(t+ia)|²,
    W_j(a,t)=1/2 partial_a H_j(a,t).

Cauchy–Riemann differentiation gives

    (partial_a²+partial_t²)H_j=4H_(j+1),
    (partial_a²+partial_t²)W_j=4W_(j+1),                    (1)
    partial_a W_j=|f^(j+1)(t+ia)|²
                  −Re[f^(j+2)(t+ia) conjugate(f^(j)(t+ia))]. (2)

The second expression has one positive square and a full signed coupling. It is exactly the three-coordinate Hermitian form of inertia (2,1), consistent with the n=1 coupled state in v2. Since W_j(0,t)=0,

    W_j(a,t)/a=integral_0^1 partial_a W_j(sa,t)ds.            (3)

Thus a small-a certificate need not divide by f or a small phase amplitude; controlling this three-coordinate form is enough. The modular lane's near-zero certificate uses this constructive observation.

### Counterexample to an inward maximum-principle inference

Let f(t)=t²+b², b>0. Direct calculation gives

    W_0(a,t)=2a(a²+t²−b²),
    W_1(a,t)=4a>0,
    W_j=0 for j>=2.

All shifts a>=b have nonnegative W_0 at every t, yet W_0(a,0)<0 for 0<a<b. The derivative forcing is positive throughout. Equation (1) makes W_0 subharmonic, not superharmonic; a lower-bound maximum principle would need the opposite forcing sign. This example can be placed inside the Xi zero strip by taking b<1/2. It tests a proposed general propagation mechanism, not the full theta profile itself.

## 2. The full-theta kernel evolution

Put P(h,v)=psi(h-v)psi(h+v) and

    D_a(v)=integral_0^infinity cosh(2ah)P(h,v)dh,
    C_a(v)=integral_0^infinity h sinh(2ah)P(h,v)dh.

Then

    C_a=(1/2)partial_a D_a,
    partial_a² C_a=4 integral_0^infinity h³sinh(2ah)P dh.     (4)

Every derivative of C_a with respect to a is pointwise positive for a>0. This is not positivity in the positive-definite-kernel order.

Indeed D_a is unconditionally PD for every real a, with an explicit representation. Set g_a(u)=exp(au)psi(u); then

    D_a(v)=1/2 integral_R g_a(u)g_a(u+2v)du,
    Fourier[D_a](2t)=|Xi(t+ia)|²,
    Fourier[C_a](2t)=W_0(a,t).                              (5)

The derivative of a curve lying in the PD cone need not lie in that cone. Thus (5) supplies the full positive state, but not positivity of its tangent C_a. No unknown Fourier square root is used in (5).

## 3. Quantified negative-channel budget for the shift tangent

Use the two-state vector (g_a,u g_a). The exact contraction for C_a has off-diagonal entries 1/4. Its zero-lag Gram is

    S_a=[[A_a,J_a],[J_a,B_a]],
    A_a=integral_R exp(2au)psi(u)²du,
    B_a=integral_R u²exp(2au)psi(u)²du,
    J_a=integral_R u exp(2au)psi(u)²du.

Here C_a(0)=J_a/2>0 for a>0. By the same congruence optimization proved in v2, the minimum negative-channel zero-lag mass among all constant signed-SOS decompositions of this fixed two-state contraction is

    delta_a=(sqrt(A_a B_a)−J_a)/4>0.                         (6)

Strict positivity follows from strict Cauchy–Schwarz. This is an integrated spectral cancellation budget, not a negative value of W_a.

Write m_k=integral_0^infinity u^(2k)psi(u)²du. As a→0+,

    A_a=2m_0+O(a²), B_a=2m_1+O(a²), J_a=4am_1+O(a³),
    delta_a/C_a(0)=sqrt(m_0/m_1)/(4a)−1/2+O(a).              (7)

The validated v2 moment intervals give

    1.59458710609 < sqrt(m_0/m_1)/4 < 1.59458710664.

Consequently a direct fixed-two-state signed decomposition requires increasingly delicate cancellation, with relative negative-channel mass asymptotic to 1.594587106.../a. This explains why taking a small shift is not automatically a favorable perturbative regime. It does not forbid the three-coordinate normalized form (3), a different representation with more useful local structure.

## 4. Exact strip Green representation: the correct continuation budget

Fix A>0. For the complete theta profile, f=Xi and every derivative is rapidly decreasing as |t|→infinity, uniformly for a in [0,A]. This follows by repeated integration by parts in the full even Fourier integral: all weighted profile derivatives are integrable and there are no half-line odd endpoint defects. Thus there are no missing boundary-at-infinity terms in the following infinite-strip formula.

Let

    G_A(a,t;b,s)=(1/(4pi)) log(
      [cosh(pi(t-s)/A)−cos(pi(a+b)/A)]/
      [cosh(pi(t-s)/A)−cos(pi(a-b)/A)]),

and

    P_A^upper(a,x)=sin(pi a/A)/
                    [2A(cosh(pi x/A)+cos(pi a/A))].

G_A is the positive Dirichlet Green function for minus the planar Laplacian on 0<a<A. P_A^upper is the upper-edge Poisson kernel, with integral a/A. Applying (1), using W_0(0,t)=0, gives

    W_0(a,t)=(P_A^upper(a,.)*W_0(A,.))(t)
       −4 integral_0^A integral_R G_A(a,t;b,s)W_1(b,s)dsdb.  (8)

One can verify signs and normalization independently by Fourier transformation in t: the Green multiplier is

    sinh(|k|min(a,b))sinh(|k|(A−max(a,b)))/
      [|k|sinh(|k|A)],

with k=0 limit min(a,b)(A−max(a,b))/A; the upper Poisson multiplier is sinh(|k|a)/sinh(|k|A).

For A>=1/2, the boundary shear is unconditionally nonnegative. Nevertheless even a positive W_1 produces a **subtracted** Green potential. The precise requirement for inward propagation is that the positive boundary extension cover this entire derivative-channel cost. The PDE alone does not establish that inequality.

### Small-shift limit

Dividing (8) by a and taking a→0 gives the exact identity

    L_1[Xi](t)=(K_A*W_0(A,.))(t)
      −4 integral_0^A(P_A^lower(b,.)*W_1(b,.))(t)db,         (9)

where

    K_A(x)=pi/(4A²) sech²(pi x/(2A)),
    P_A^lower(b,x)=sin(pi b/A)/
                   [2A(cosh(pi x/A)−cos(pi b/A))].

The kernels integrate to 1/A and 1−b/A respectively. Formula (9) identifies the exact budget for first-level positivity, without pretending that the cost is zero or favorable. Both sides depend on known complete-theta data; proving the required domination uniformly in t remains open.

## 5. A usable sufficient bound, with all derivative costs retained

For j>=0 set

    P_j(A)=integral_0^infinity u^j psi(u)cosh(Au)du.

Then |f^(j)(t+ia)|<=P_j(A) throughout 0<=a<=A. Equation (2), together with W_1(0,t)=0, yields

    |W_1(b,t)|<=b N_A,
    N_A=P_2(A)²+P_1(A)P_3(A).

The integrated Green identity

    integral_0^A integral_R G_A(a,t;b,s)b dsdb
       =a(A²−a²)/6

therefore proves the unconditional lower bound

    W_0(a,t)>=(P_A^upper(a,.)*W_0(A,.))(t)
               −(2/3)N_A a(A²−a²).                        (10)

This is a genuine computable sufficient criterion: a lower enclosure of the boundary convolution exceeding the explicit moment cost proves positivity at that point or window. The bound may be very conservative. A sharper pointwise envelope N_A(s) can be integrated against G_A instead of using its global supremum; head-adapted coherent/jet estimates from the modular lane can supply such envelopes.

At high |t| the boundary term tends to zero while the constant-cost bound does not, so (10) cannot by itself prove the all-height theorem. This is a limitation of this estimate, not an argument that the exact forcing cannot be controlled.

## 6. Exact zero-strip barrier and escape to infinity

For Xi let B=sup{|Im lambda|: Xi(lambda)=0}, so 0<=B<=1/2. Define the descending positivity property at c>=0 by

    W_0(a,t)>=0 for every a>=c and every real t.

This property holds exactly when c>=B. For a>B, the canonical-product logarithmic derivative sums positive terms (a−Im lambda)/|t+ia−lambda|²; the undivided W extends continuously to a=B. Conversely, if c<B, choose an off-line zero with imaginary part b>c. Its local expansion forces negative W immediately below b, at some a>c. No assumption about simple zeros is needed.

Thus continuing the global sign from a>=1/2 down to c is exactly a sharpening of the zero strip to |Im lambda|<=c. This equivalence is not a new positivity argument.

Two compactness costs must not be dropped:

1. Even when W_A(t)>0 everywhere, it tends to zero at infinite height. There is no uniform positive lower bound on the whole real t-axis.
2. B may be a supremum not attained by a zero at finite height. A putative first failure can escape to |t|→infinity; a finite first-contact argument then has no contact point to inspect.

If a first contact does occur at a finite (a*,t*), then W=0 and W_tt>=0 at a spatial minimum, but (1) gives W_aa=4W_1−W_tt, with no contradictory sign. The polynomial example above realizes exactly this compatible loss of positivity.

## 7. Ledger and scope

- Scalar shift evolution is not a positive inward semigroup; its exact derivative tower contains signed couplings.
- PD of D_a and pointwise absolute monotonicity of C_a do not imply PD monotonicity in a.
- Positive derivative forcing is insufficient, as the explicit off-line-zero polynomial demonstrates.
- The Green formula supplies a real boundary-versus-coupling budget and the computable sufficient estimate (10), not a missing maximum principle.
- The normalized three-coordinate jet form (3) can be useful near zeros and small a, unlike phase division by a small head value.
- No uniform boundary/Green-potential domination, all-height continuation, or RH proof is established.
