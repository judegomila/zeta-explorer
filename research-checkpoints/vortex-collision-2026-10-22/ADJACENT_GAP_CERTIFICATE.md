# First-collision geometry and adjacent-gap certificates
22 October 2026. Mathematical follow-up; no RH proof or improved Newman bound.

## 1. Setting and what is already known

Use H_t(z)=integral_0^infinity exp(tu²) Phi(u) cos(zu) du, so partial_t H_t=-partial_z² H_t and H_0(z)=xi(1/2+iz/2)/8. H_t denotes the family at time t; time derivatives are written explicitly.

The relevant established results are Polymath, Proposition 3.1 (regularized zero velocity and Hermite splitting at multiple zeros), and Theorem 1.5 (real, simple positive-time tails with an absolute exponential cutoff). See https://arxiv.org/html/1904.12438v2 . Newman’s real-root threshold and Rodgers–Tao’s nonnegativity theorem are summarized and proved in https://arxiv.org/html/1801.05914v5 .

These inputs justify considering a hypothetical first collision c>0 while continuing backward from an all-real simple time T. On any slab bounded away from zero, tail control reduces a possible failure to finite height. Reality on (c,T] is a consequence of the definition of first failure, not an assumption about [0,c). The elementary identities below are derived here for clarity; they are reformulations of classical zero dynamics, not claims of novelty.

## 2. All multiplicities have a known local model

Suppose H_c has a zero of multiplicity m at x0, with leading term A w^m, w=z-x0, A nonzero. Put s=t-c. Taylor expansion using the heat equation gives, in the parabolic scaling w=O(sqrt(|s|)),

H_(c+s)(x0+w) =
 A m! sum_(k=0)^floor(m/2) [(-s)^k w^(m-2k)/(k!(m-2k)!)]
 + O(|s|^((m+1)/2)).

For s>0 this leading polynomial is A s^(m/2) H_m(w/(2 sqrt(s))), using physicists’ Hermite polynomials. If their distinct real roots are h_j, the nearby zeros are

q_j(c+s)=x0+2 sqrt(s) h_j+O(s).

For s<0 the leading locations are x0+2i sqrt(-s) h_j+O(|s|). Thus every m>=2 produces nonreal zeros just below c; odd m leaves one central real branch. A collision need not be a pair: m=3 gives w(w²-6s).

For an isolated double collision, d²=8s+O(s²). For higher multiplicity, adjacent d_j²=4(h_(j+1)-h_j)²s+O(s^(3/2)). For m=3 the adjacent slope is 6, not 8. The other members of a multiple cluster are not a bounded background.

If H=(z-a)(z-b)G locally, G nonzero near the pair, the exact simple-zero velocities are
 a'=-2/(b-a)+2G'(a)/G(a),
 b'=+2/(b-a)+2G'(b)/G(b).
These are regularized self-fields. An unregularized vortex plot is not the equation of motion of its own singularity.

## 3. Exact adjacent-gap reserve

On a simple all-real interval, let a<b be adjacent zeros, d=b-a and y=d². For the actual H-family its order-one paired Hadamard product gives

q_j'=2 sum_(k!=j)' 1/(q_j-q_k).

Subtracting the two velocities gives the absolutely convergent identity

y'=8-4S y,
S(t)=sum_(r other than a,b) 1/((b-r)(a-r)) >=0.                 (1)

The summands are positive because the zeros are adjacent and every other zero is real. Symmetric summation is needed for individual velocities but not for S.

For c<u<T in the maximal simple-real interval, integration gives

y(T)=exp(-4 integral_u^T S) y(u)
     +8 integral_u^T exp(-4 integral_v^T S) dv.                (2)

This equation describes possible collisions; it does not forbid them.

A useful noncircular certificate is the following. Choose an intended earlier time a0<T, and a deterministic nonnegative function L on [a0,T]. Prove S(t)>=L(t) wherever the backward simple-real continuation exists. If

y(T)>8 integral_a0^T exp(-4 integral_v^T L(w)dw)dv,            (3)

then this pair cannot collapse in [a0,T]. Indeed, at a putative collision c>=a0, let u decrease to c in (2). The first term tends to zero, since 0<=exp(-4 integral_u^T S)<=1 and y(u) tends to zero, even if S diverges at a higher collision. The remaining integral is at most the right side of (3), a contradiction.

To exclude every first failure, (3) must cover every potentially colliding adjacent pair, together with finite-height and tail continuation. A certificate for a single pair does not prevent a different pair from colliding first.

With L=0 the sharp elementary certificate is y(T)>8(T-a0). With constant L=ell>0 it improves to

y(T)>(2/ell)[1-exp(-4ell(T-a0))].

Equivalently, before the first collision, y(T-s)>=y(T)-8s. These are genuine finite backward-step guards. They are not a fixed positive step for the entire zeta spectrum: at a fixed positive time, tail spacing tends to zero, so the global infimum of gaps is zero. A finite displayed minimum cannot replace that infimum.

## 4. What endpoint data would actually have to establish

The quantity needed for (3) is a lower bound on S along the maximal backward continuation, or an upper bound on its weighted exponential integral. Knowing all endpoint roots or evaluating S(T) alone does not supply this time-uniform information.

For an exterior root r define
g_r=(a-r)^(-2)+(b-r)^(-2).
Then g_r>=2/((a-r)(b-r)); hence g=sum g_r>=2S. Upper bounds on this exterior inverse-square energy control weak background screening and can force a close pair to collide under sufficient backward evolution. This is the mechanism behind classical Lehmer-pair lower bounds on Lambda, not automatically an upper-bound certificate.

Primary reference: Csordas, Smith and Varga, “Lehmer pairs of zeros, the de Bruijn–Newman constant Lambda, and the Riemann Hypothesis,” Constructive Approximation 10 (1994), 107–129:
https://www.math.kent.edu/~varga/pub/paper_206.pdf .
The present note does not assert a new endpoint-only Lehmer criterion.

For collision prevention, a usable lower bound could come from rigorously controlled exterior zeros: if throughout the continuation an exterior root remains on the same side and |a-r|<=A(t), |b-r|<=B(t), it contributes at least 1/(A(t)B(t)). But proving those trajectory envelopes is additional work. Endpoint numerics alone are not a proof of them. Stronger local-equilibrium/information statements require quantitative worst-case control, not just average relaxation. Rodgers–Tao used dynamics under a hypothetical negative threshold to prove a lower bound on Lambda; reversing that conclusion does not prove Lambda<=0.

## 5. Exact counterexamples and the direction problem

Two-root polynomial:
P_t(z)=z²-2(t-c), with any c>0.
It solves partial_t P_t=-partial_z² P_t, is even and real on the real axis, has two real roots for t>c, a double root at c, and a nonreal conjugate pair for t<c. Its y=8(t-c) and S=0 saturate the finite-step bound. Repulsion and eventual capture are fully present, but the earlier zeros are not real.

Triple capture:
P_t(z)=z[z²-6(t-c)].
It solves the same equation. A conjugate pair joins an existing real zero in a triple collision, then all three zeros become real. Near c, S for either adjacent pair is 1/(12(t-c)), so (1) gives y'=8-2=6.

Even noncentral collisions with positive value at the origin:
P_(c+s)(z)=z^4-(2A²+12s)z²+A^4+4A²s+12s², A>0.
This is exactly exp(-s d_z²)(z²-A²)². For small s>0 all four roots are real; for small s<0 they form a nonreal quartet. P_(c+s)(0)>0 near s=0. Thus evenness, a nonvanishing central value, finite tails, and heat flow still allow delayed capture. This polynomial is not claimed to be a theta transform.

Positive spectral-measure example:
F_t(z)=exp(t)cos(z)+C, C>1.
The measure consists of positive atoms at 0 and ±1. Every zero is real for t>log C; at t=log C the odd multiples of pi are double zeros; below it zeros are nonreal. This example is even and exponential type, but its measure is not a smooth theta kernel and it does not have the positive-time real-tail property below collision. Its limited role is to refute positivity/symmetry alone.

A conjugation-invariant contour enclosing exactly one zero, counted with multiplicity, really does force that zero to be real and simple. However, one must prove the boundary stays nonzero over the entire backward interval. Winding conservation alone allows the two- and three-zero collisions above. A vortex’s circulation or an inward amplitude-gradient flow for test points is not such a boundary certificate for moving zeros.

## 6. A genuine theta-specific signed target

All integrals in this section are over [0,infinity). Let Psi_t(u)=exp(tu²)Phi(u), and define
C0=integral Psi_t(u)cos(xu)du,
S1=integral u Psi_t(u)sin(xu)du,
C2=integral u² Psi_t(u)cos(xu)du.

The first Laguerre difference is
D_t(x)=H_t'(x)²-H_t(x)H_t''(x)=S1²+C0 C2.

Exactly,
D_t(x)=1/4 integral integral Psi_t(u)Psi_t(v)
 [(u+v)² cos(x(u-v))+(u-v)² cos(x(u+v))] du dv.

The positive theta weight does not make this oscillatory expression positive. A proof of strict D_t(x)>0 for every real x and every 0<t<=1/2 would exclude all positive-time real multiple zeros and, with the established continuation/tail inputs, imply RH. This is an unproved sign target, not a consequence of the preceding dynamics.

There is also an exact evolution identity:
(partial_t+partial_x²)D=2[(H'')²-H'H'''].

At a double collision H=H'=0, partial_t D=(H'')²>0. For the local model H=A(w²-2s), D=2A²(w²+2s). Thus strict positivity emerges forward across a collision; it is not automatically maintained backward. The source has no general global sign and the time direction is backward heat. No ordinary forward maximum-principle or information-dissipation slogan closes this gap.

## 7. Constructive finite-neighbor certificate

There is a rigorous truncation direction, but only before the first loss of an all-real simple configuration. Choose finitely many distinct exterior root labels J. Then S>=sum_(r in J)1/((b-r)(a-r)); omitting the remaining positive terms is safe.

Suppose validated real trajectory tubes on the proposed slab are
a(t) in [a_-(t),a_+(t)], b(t) in [b_-(t),b_+(t)],
r(t) in [r_-(t),r_+(t)] for r in J,
valid for as long as the backward all-real simple continuation exists. For each right-hand root r>b define
A_r=r_+-a_-, B_r=r_+-b_-.
For each left-hand root r<a define
A_r=a_+-r_-, B_r=b_+-r_-.
When these are finite and positive, both same-side factors have the same sign and their absolute product is at most A_r B_r. Consequently

S(t)>=L_J(t):=sum_(r in J)1/(A_r(t)B_r(t))>=0.

This lower bound, inserted into (3), gives a finite-neighbor sufficient no-collision certificate. The comparison direction matters twice: larger S means a smaller exponential survival integral; using a lower bound L_J makes the computed integral an upper bound, so a strictly positive reserve remains safe.

For a rigorous numerical bridge, partition [a0,T] into time cells, certify the tube envelopes by interval/contour or validated differential-equation bounds, and use outward rounding to upper-bound
8 integral_a0^T exp(-4 integral_v^T L_J)dv.
A piecewise constant lower bound for L_J permits exact elementary exponential integration cell by cell. Compare this upper bound with a rigorously computed lower bound for the endpoint squared gap. The stopping condition is a strictly positive lower bound for their difference for every candidate first-collision pair in the finite-height region, with tail and boundary control proved separately. A zero or negative reserve is inconclusive, not a detected collision or a disproof of RH.

Order preservation ensures an exterior label stays on its original side before the first collision. Nevertheless, the trajectory tubes must themselves be certified; they cannot be replaced by unchanged endpoint intervals or guessed velocities. One may stop a proposed step when tube validation fails, refine it, or require new estimates. If a tube certificate already proves disjointness throughout a slab, it independently excludes that particular collision; the reserve method is useful when target-pair tubes overlap but exterior separations remain controlled.

This supplies a repeatable finite computation conditional on rigorously validated tubes. It does not presently give an effective uniform family of certificates as a0 tends to zero or height tends to infinity. Such uniformity is precisely where additional theta/arithmetic information is still needed.

## Status

Checked here: the algebraic normal forms, gap identity, integrating-factor reserve, determinant evolution, and explicit polynomial/cosine counterexamples. Established literature: regularized dynamics, Hermite splitting, positive-time tails, Newman threshold, Lehmer-pair theory and Rodgers–Tao. Still absent: a theta-specific lower bound on S strong enough for (3) uniformly through every relevant positive-time slab, or a direct strict sign theorem for the signed theta expression. No new arithmetic estimate, RH proof, or numerical upper bound for Lambda is claimed.
