# Actual theta derivative orbit forces degeneration of the mixed-prefix gap

Status: new analytic argument awaiting audit. This is NOT a counterexample to the scalar payment criterion. It rules out a specific growing-degree strategy: obtaining a degree-independent positive spectral gap for the common mixed metric in COMMON_METRIC.md.

Fix the actual even theta profile phi=psi_lambda, lambda in[0,1]. Define, for a real polynomial p,
 f=p(D)phi, k=p'(D)phi,
 H[p]=2 integral_0^infinity [h² f²+h f k]dh.
This is exactly the common half-line derivative metric B' at normalized a0, before choosing coordinates. Reflection p^r(x)=p(-x) gives f^r(h)=f(-h), k^r(h)=-k(-h).

## 1. Simultaneous approximation is in the ACTUAL derivative orbit

Use the real Hilbert space X=L²(R,(1+h²)dh)² and strongly continuous group whose individual operators T(t) are bounded (not uniformly in t)
 T(t)(f,k)=(f(.+t), k(.+t)+t f(.+t)).
Its infinitesimal generator acts as A(f,k)=(Df,f+Dk). On v=(phi,0),
 A^jv=(D^jphi,jD^(j-1)phi), and p(A)v=(p(D)phi,p'(D)phi).

The full theta profile extends analytically to a strip |Im h|<pi/4. On each narrower closed strip its Gaussian-deformed profile and its h-weighted square norm are uniformly integrable, from the full theta exponential bound. Vector-valued Cauchy estimates therefore give an analytic-vector radius r>0 for v in X. Every polynomial p(A)v has the same open radius r: the fixed extra derivative count changes constants/polynomial factors but not convergence radius.

Let C be the closed real span of {A^jv:j>=0}. For |t|<r, the convergent Taylor expansion of T(t)p(A)v lies in C. Boundedness of T(t) extends this invariance from polynomial vectors to C. Iteration of small shifts proves T(t)v in C for EVERY finite real t. Consequently there are actual real polynomials p_m such that
 (p_m(D)phi,p_m'(D)phi) -> (phi(.+t),t phi(.+t)) in X.
This is simultaneous approximation of both symbol components, not an arbitrary replacement of a signed residual by a spatial function. No RH, next norm, positive spectral measure, or uniform finite-orbit approximation enters it.

H[p] and H[p^r] are continuous quadratic forms on X, so both converge under this approximation.

## 2. Exact translated energies and the limiting true normalization

Write m2=integral_R h²phi(h)²dh>0. For the translated vector,
 H_plus(t)=2 integral_t^infinity v(v-t)phi(v)²dv,
 H_minus(t)=2 integral_(-t)^infinity v(v+t)phi(v)²dv.
Evenness gives the EXACT conservation law
 H_plus(t)+H_minus(t)=2m2.
For t>0, H_plus(t)>0 and H_plus(t)->0 superexponentially; for example it is bounded by 2 integral_t^infinity v²phi(v)²dv. These are actual full-theta tails. The opposite-side energy stays bounded away from0; the two-sided normalization is not vanishing.

## 3. Consequence for the actual prefix matrices

Assume the actual normalized parity prefixes remain positive through the degrees under discussion. If this hypothesis fails at some finite degree, that is already a distinct failure of the positive-prefix route; this argument does not assume the next pivot to prove its sign.

For p of degree<=N, use the normalized basis T_j/sqrt(sigma_j), with real coefficient vector z. Its same-parity blocks in H_N are I/2. Reflection flips the cross-parity terms. Hence the ACTUAL coefficient normalization is
 ||z||²=H[p]+H[p^r],
 not a positive-parent norm substitution.
If J_N is the mixed block, lambda_min(H_N)=1/2-||J_N||. Polynomial approximants above and the Rayleigh principle yield: for every t>0 and every eta>0, some finite prefix degree N satisfies
 ||2J_N|| >= 1-H_plus(t)/m2-eta.
The mixed blocks nest in the fixed actual normalized basis; their norms are nondecreasing in N. Taking t->infinity proves
 liminf_(N->infinity) ||2J_N|| >=1.
Therefore no uniform bound ||2J_N||<=1-epsilon, epsilon>0, is possible along an indefinitely positive theta prefix. Equivalently the mixed metric cannot have a uniform positive gap. It may already become indefinite; this proof does not decide that.

The proof gives an explicit superexponentially small tail threshold in the spatial translation parameter t, but does NOT give an explicit polynomial degree N(t,eta). Claiming a numerical rate in N would require a quantitative simultaneous polynomial-approximation estimate not supplied here.

## 4. Scope for the payment question

The exact common scalar includes a source term and a regression-dependent negative square, correlated with J_N. Near saturation of J_N does not determine their difference and does not prove failure of
 2(L_N'-f_actual) >= kappa_0 M_N.
It DOES show that a proof which demands a degree-independent coercive mixed-prefix metric cannot work even for the actual complete theta profile. The remaining comparison must exploit correlated source/regression structure or pay a degenerating gap explicitly. This is an actual-profile, true-prefix-metric obstruction, not a generic positive-parent counterexample.
