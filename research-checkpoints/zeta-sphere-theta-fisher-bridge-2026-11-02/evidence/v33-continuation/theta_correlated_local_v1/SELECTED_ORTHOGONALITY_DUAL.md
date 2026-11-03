# A selected-prefix variational lower bound with finite atomic dual witnesses

Status: independent analytic review PASS. A noncircular variational lower bound and its attained finite-dimensional dual are proved. Its uniform positivity for theta is not proved.

Use the all-degree canonical flux and signed moments g_j from ALL_DEGREE_SOS_FLUX.md. Work at normalized shift a=0. All functions below are the actual complete theta functions, not truncated orbits. Let p(t)=Σ_(i=0)^N c_i t^(epsilon+2i), c_N=1, n=epsilon+2N, epsilon=0 or1. The actual positive lower prefix fixes c_low=−A^(-1)b using only moments through index n−1. Define, for u≥0,

f(u)=Σ_(i,k=0)^N c_i c_k g_(epsilon+i+k)(u),
z_k(u)=Σ_(i=0)^N c_i g_(epsilon+i+k)(u), 0≤k<N.

Write z(u) for this N-column, not the earlier theta phase-space coordinate. Let M0=∫_R u²psi(u)²du>0 and dρ(u)=2u²psi(u)²du/M0 on [0,∞). Then

Eρ[z]=0,
h[p]/(4pi)=M0 Eρ[f].                                      (1)

The zero means use exactly the known lower-prefix inverse. They do not assume any sign of the next norm.

## 1. A concrete sufficient inequality and lower bound

For a constant real N-column a, set

lambda(a)=inf_(u≥0){f(u)−2a^T z(u)},
lambda_*=sup_(a∈R^N) lambda(a).                            (2)

For N=0 take the infimum of f with no optimization. The exact lower bound is

                  h[p]≥4pi M0 lambda_*.                    (3)

Thus an independently verified inequality f(u)−2a^Tz(u)≥lambda>0 for one explicit a proves the desired selected norm positive. It keeps the actual selected c; a merely adds known zero-mean cross terms. No next norm or unknown spectral measure occurs in (2).

The corresponding nonlinear-module expression is polynomial after multiplication by T0²:

Σ c_i c_k G_(epsilon+i+k)−2Σ_(k<N) a_k Σ_i c_i G_(epsilon+i+k)
                         −lambda T0² ≥0.                  (4)

The uniformly bounded positive T0 makes (4) equivalent to the asserted pointwise inequality. A positive-generator SOS could certify (4); feasibility is not assumed. Adding a nonzero weighted divergence instead creates a different integrated refinement and does not, by itself, certify this pointwise inequality or its lambda_* margin. For the basic method here a is constant. Allowing a(u) would generally destroy Eρ[a(u)^Tz(u)]=0 and requires a separately proved compensating term.

This dual is stronger than the desired integrated inequality: failure to make lambda_* positive need not imply a negative actual norm.

## 2. Full-theta tails prove attainment

For every fixed j, putting Z=pi exp(2u), the complete-theta logarithmic derivatives satisfy ell^(2m)=−2^(2m)Z+O(1) as u→∞ for each fixed m≥1. The full-orbit remainder is exponentially smaller. The Bell recurrence therefore gives

g_j(u)=[(2j)!/j!] Z^j+O_j(Z^(j−1)), j≥1, g0=1.             (5)

All constants here are fixed-degree constants; no uniform-in-j asymptotic is claimed. The leading term comes from the j copies of kappa2=2Z+O(1); higher cumulants use fewer than j factors of Z.

For n≥1 this implies
f(u)=[(2n)!/n!]Z^n+O_p(Z^(n−1)),
z_k(u)=[(2epsilon+2N+2k)!/(epsilon+N+k)!]
                Z^(epsilon+N+k)+lower powers.              (6)

In particular f→+∞, while z_k/f→0. The z_k have distinct positive leading powers and are linearly independent as real functions. Hence, for every fixed a, the infimum in (2) is finite and attained. The minimizers stay in a common compact spatial interval when a ranges over a bounded set. This also proves continuity and concavity of lambda.

The true ρ has positive density on every interval contained in (0,∞), and Eρ[z]=0. For every nonzero v, v^Tz cannot have one sign everywhere: a nonnegative continuous function with zero ρ-mean would vanish identically, contradicting linear independence. Therefore the convex hull of the curve z(u) contains a ball about zero. One elementary justification is to cover the unit sphere by finitely many neighborhoods on each of which some fixed sampled z(u_i) has positive dot product bounded below; the convex hull of these finitely many points then contains a ball of radius delta>0.

For Fmax=max_i f(u_i),

lambda(a)≤Fmax−2delta||a||.                                 (7)

Thus lambda tends to minus infinity as ||a||→∞. It has a finite attained maximum a_*. The constants delta and Fmax depend on the actual selected prefix and are not asserted degree-uniform or numerically evaluated.

An explicit fixed-degree version of the coercivity constant can be given without using the target mean. For N≥1 put

Cz=Eρ[zz^T], c0=lambda_min(Cz)>0,
C2=Eρ||z||², C4=Eρ||z||^4, F2=Eρ f²,
delta0=c0^(3/2)/(2sqrt(C4)), C0=sqrt(F2 C2)/delta0.

These are convergent complete-theta positive-parent integrals, with the actual prefix-selected coefficients fixed. Independence of the z_k proves Cz positive definite. It is NOT the original signed prefix A and is not substituted for A in (1).

For unit v let Y=v^Tz. Since EρY=0, interpolation of L1,L2,L4 gives
EρY_+=(1/2)Eρ|Y|≥c0^(3/2)/(2sqrt(C4))=delta0.
The probability tilt dν_v=Y_+dρ/EρY_+ satisfies Eν_v Y≥EρY_+≥delta0, while |Eν_v f|≤sqrt(F2 C2)/delta0. Taking v=a/||a|| proves the explicit bound

lambda(a)≤C0−2delta0||a||.                                 (7a)

Thus, writing f_min=inf_u f(u), any maximizer obeys ||a_*||≤(C0−f_min)/(2delta0). These constants are degree-dependent functionals, not an established uniform rate in degree. Their estimation could be expensive; in particular no useful uniform lower bound on c0 is claimed. F2 is the integral of the square of the known local remainder, not an assumption on the unknown signed mean Eρf.

For n=0, p=1 and f=1; lambda_*=1 directly. For n=1, N=0 and the known curvature gives f=g1>17/2. These are old base cases, not new finite degree coverage.

## 3. An exact finite atomic dual, with no target moment imposed

At a maximizer a_*, let U_* be the compact set of minimizers in u of f(u)−2a_*^Tz(u). Then

0 belongs to conv{z(u):u in U_*}.                           (8)

Otherwise strict separation supplies a direction of a that increases the infimum, contradicting maximality. This can be proved directly on the common compact minimizer interval; the coercive tail in (6) excludes escape to infinity during a sufficiently small change of a.

Caratheodory's theorem in R^N now gives at most N+1 points u_l in U_* and weights w_l≥0, Σw_l=1, with Σw_l z(u_l)=0. Since all these points attain the same minimum,

                    lambda_*=Σ_l w_l f(u_l).               (9)

Conversely every probability measure ν with Eν[z]=0 and finite Eν[f] satisfies Eν[f]≥lambda(a) for every a. Hence

lambda_*=min_{ν≥0, ν([0,∞))=1, Eν[z]=0} Eν[f],             (10)

and the minimum has an atomic optimizer with at most N+1 points. Infinite positive expectation is harmless; f is bounded below. No equality involving the unknown target integral Eρ[f] is included among the constraints. The actual ρ is one feasible measure, not necessarily the minimizing one.

Equations (8)–(10) provide a precise falsification mechanism: a positive finite atomic witness with exact zero z-mean and negative f-mean disproves this particular pointwise orthogonality repair, even if the actual theta norm remains positive. An inequality proving every such witness has positive mean would establish lambda_*>0. Neither sign conclusion is proved here at general degree.

## 4. Why this is not automatic from a positive prefix

A small abstract example shows the distinction between this sufficient method and an integrated proof. Take two spatial states with equal true probability, g0=g1=1 at both, and g2=0,4 respectively. The old even prefix has M0=M1=1 and the selected p=t²−1 has positive norm M2−M1²=1. Yet z=g1−1=0 at both states and f=g2−1 is −1,3, so lambda_*=-1. No constant orthogonality correction can fix the first state. This is an abstract moment example, not a theta counterexample and not an example satisfying the theta curvature inequalities.

The arithmetic task is therefore genuinely extra: control the actual theta curve (z(u),f(u)) for the actual selected c, not just its true mean or the positive lower prefix. The all-degree canonical flux removes boundary terms correctly; it does not imply this curve lies above a positive affine supporting plane.

## 5. Exploratory probes and exact scope

Separate files named probe_* contain uncertified falsification probes using midpoint coefficients from the already-existing normalized moment packet and finite-orbit numerical jets. They are not new certificates, and their sign observations are not used in this theorem. A proposed negative witness would still require full-theta interval verification and exact zero-mean constraints; no such witness has been established.

The result is the lower bound (3), its attained optimizer, and the at-most-N+1-point dual description for every fixed actual selected prefix. No degree-uniform lower bound on lambda_*, no bound on its optimizer norm uniform in degree, no positive-shift extension, and no RH conclusion follow. The unresolved arithmetic inequality is now explicit: positivity of the optimized supporting-plane margin for this complete-theta moment curve, or an integrated refinement that succeeds when this stronger margin fails.
