# Nonlinear rank-one theta module for the complete signed budget

Status: independent analytic review PASS. An exact all-order representation and a divergence-certificate framework are established, not an all-order sign theorem.

## 1. Classical nonlinear input, distinguished orbit

The earlier no-linear-ODE result does not exclude nonlinear differential closure. Use Θ(q)=Σ_{n∈Z}e^{−πn²q}. Jacobi's classical third-order identity is

(Θ²Θ‴−15ΘΘ′Θ″+30Θ′³)²+32(ΘΘ″−3Θ′²)³
=π²Θ^{10}(ΘΘ″−3Θ′²)².                                      (1)

A primary modern reference is Dan Romik, “The Taylor coefficients of the Jacobi theta constant θ₃,” equation (28), https://danromik.com/resources/papers/jac3.pdf (arXiv:1807.06130). The following three-variable coordinates also appear in Planat–Solé, arXiv:2608.19160, Section 5; we use the algebraic identities only, not that preprint's computer-assisted positivity claims.

Put L=log q, A=πe^LΘ(e^L)^4, x=A′/A, y=2x′+1−x², and z=(x″+x³−3xx′−x)/y, where primes here mean L derivatives. Standard theta logarithmic-derivative identities give

y=π²e^{2L}θ₂(e^L)^4θ₄(e^L)^4>0,
A²=4(y+z²).

The actual theta orbit satisfies

x′=(y+x²−1)/2, y′=2y(x+z), z′=xz−y, A′=xA.                  (2)

Its initial data are x(0)=z(0)=0 and y(0)=Γ(1/4)^8/(64π⁴). These initial data and the theta-defined trajectory are essential; no arbitrary solution of (2) is substituted. The first two identities in (2) follow directly from the definitions; differentiating A²=4(y+z²) gives the third where z≠0 and then by analytic continuation. The actual z is not identically zero, as the large-L theta asymptotics show.

## 2. An exact all-order polynomial recurrence

Let

V=(y+x²−1)∂_x/2+2y(x+z)∂_y+(xz−y)∂_z,
P₀=y+(3/2)(x²−1),
P_{j+1}=2V P_j+(x/2)P_j.                                    (3)

The original profile, with L=2u, is exactly

ψ(u)=A(L)^{1/4}P₀(x,y,z)/(2π^{1/4}),
D_u^jψ(u)=A(L)^{1/4}P_j(x,y,z)/(2π^{1/4}).                   (4)

To verify the normalization, x=1+4qΘ′/Θ implies
q²Θ″+(3/2)qΘ′=Θ[4x′+x²−1]/16=ΘP₀/8;
substitute into ψ=4e^{u/2}[q²Θ″+(3/2)qΘ′]. Differentiating (4) then gives (3).

Every P_j is a polynomial of total degree at most j+2. Thus arbitrarily high complete-theta derivatives are represented by a degree-controlled nonlinear ring, with no omitted orbit, no rational-coefficient linear ODE in u, and no unknown pivot.

For example,
P₁=(15/4)x³+(15/2)xy+4yz−(15/4)x,
P₂(0,y,0)=−y²/2−45y/4+15/4.
The second expression is negative at the actual center, as required by the known negative ψ″(0); this is not a positivity-preserving jet recursion.

## 3. Actual inverse-selected polynomial and a legitimate integrated certificate

For any polynomial p(t)=Σc_j t^j, write Q_p=Σc_j i^jP_j. For the actual real-rooted parity residual p, retain every deletion q_j=p/(t−r_j). The normalized root-deletion identity becomes

h[p]=(sqrtπ/4)∫_{−∞}^{∞} A(L)^{1/2} B_p(L,x,y,z)dL,
B_p=(L²/2)|Q_p|²−Σ_j|Q_{q_j}|².                             (5)

This uses the actual inverse-selected coefficients. For real phase-space variables, the squared moduli in (5) are real polynomials (real and imaginary parts are squared separately). The first term's state degree is at most 2n+4, and the deletion terms' at most 2n+2 for degree n.

Define the weighted divergence operator

G=∂_L+V+x/2.

Along the distinguished orbit, d[A^{1/2}R]/dL=A^{1/2}GR. Consequently a sufficient noncircular certificate is an explicit identity

B_p=GR+S,
A^{1/2}R→0 at both ends,
S≥0 along the actual theta orbit, with S not identically zero.             (6)

Then h[p]>0. The sign of S must be proved independently of h[p], and the coefficients of p and R may use only established data and the actual known prefix. Merely defining S through the desired integral does not constitute a certificate.

The endpoint condition is substantial: A^{1/2} grows exponentially at both ends, and arbitrary polynomial R need not be admissible. A safe algebraic class is finite sums of polynomial(L,x,y,z) times P_jP_k: these products have superexponential decay along the actual theta trajectory, by (4) and full-theta tails, while x,y,z have at most exponential growth there. This class retains boundary flux rather than silently dropping it.

On its basic generators there is an exact cancellation:

G[L^mP_jP_k]=mL^{m−1}P_jP_k+(L^m/2)(P_{j+1}P_k+P_jP_{k+1}). (7)

The x/2 weight drift cancels exactly against the two derivative recurrences. This is the full signed integration-by-parts module, not a positive cone assertion.

## 4. Base check retaining the negative terms

For p=t, B_p=(L²/2)P₁²−P₀². Choose the admissible flux

R=−L P₀²+(L²/2)P₀P₁.

Equation (7) yields the exact remainder

B_p−GR=(L²/4)(P₁²−P₀P₂).

The bracket is P₀² times −(logψ)″, so the independently established full-theta curvature >17 proves this remainder nonnegative and not identically zero. This recovers the already-known first odd payment while keeping the original negative deletion term. It is not a new degree certificate or an induction for all p.

## 5. Even normalized jet signs cannot all be positive

A tempting coefficientwise shortcut would require (−1)^jψ^{(2j)}(0)≥0 for every j. This is false for the actual theta, without computing a large derivative.

For ε↓0, take u=i(π/4−ε) and q=e^{2u}=i+w with
w=2sinε e^{−iε},  Re(1/w)=(1/2)cotε→∞.

The alternating theta transformation gives

Θ(i+w)=w^{−1/2}Σ_{m∈Z}exp[−π(m+1/2)²/w].

It and its first two q derivatives tend to zero faster than any power along this path, so the exact profile formula gives ψ(i(π/4−ε))→0. But if every displayed normalized even derivative were nonnegative, the Taylor series on |u|<π/4 would give ψ(iv)≥ψ(0)>0 for every 0<v<π/4, a contradiction.

Thus some normalized even jet has the wrong sign for that proposed coefficientwise cone. This does not refute the integrated bridge: its correlated products and admissible divergences are essential. No claim is made about which first order fails.

## 6. Remaining gap and relation to other kernels

Equations (3)–(7) offer an exact rank-one nonlinear setting for a uniform certificate family, but no such family has been constructed. The known indefinite local bridge blocks exclude simply setting R=0 and declaring every local quadratic form positive. The modular/Epstein counterexample cannot justify a theorem for arbitrary self-dual kernels; this construction additionally requires Jacobi's specific equation and its distinguished initial data. Those identities were not supplied by the generic counterexample assumptions.

No prime-power high-frequency sign estimate, fixed critical-shift all-degree theorem, or RH claim follows from this representation. Its useful output is a degree-controlled exact recurrence with a verified base flux and an explicit falsification of coefficientwise jet positivity. The source papers retain attribution; no supplied external code has been executed.
