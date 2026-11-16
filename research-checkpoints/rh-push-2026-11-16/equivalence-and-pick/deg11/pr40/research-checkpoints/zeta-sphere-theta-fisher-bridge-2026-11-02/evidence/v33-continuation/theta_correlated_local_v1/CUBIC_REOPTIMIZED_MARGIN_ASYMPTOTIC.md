# Sharp full-theta asymptotic for a genuinely reoptimized cubic dual

Status: independent analytical review PASS. This is a fixed-degree, large-shift theorem, not a critical-strip or all-degree proof.

## 1. Actual selected polynomial and dual

Let a tend to infinity in the original complete-theta shifted family. Write M_j(a) for its spatial moments and g_j(u) for the unchanged local theta moments. The actual odd cubic selected polynomial is
p_a(t)=t^3-alpha(a)t, alpha(a)=M_2(a)/M_1(a).
Its old block M_1 is independently positive because g_1>17/2 and the spatial weight is positive. No cubic target norm is an input.

Set
f_a=g_3-2alpha g_2+alpha^2 g_1,
z_a=g_2-alpha g_1,
L(a)=sup_(v in R) inf_(u>=0) [f_a(u)-2v z_a(u)].
The exact actual spatial expectation of z_a is zero. The already audited selected-dual theorem applies with N=1: the optimized margin is attained and its dual minimum admits at most two atoms.

Let
m=min_(u>=0) g_1(u)>17/2,
w_*=2+sqrt(10), C_*=21+6sqrt(10), t_*=(5+sqrt(10))/10.
The minimum defining m is attained because g_1 is continuous and tends to infinity. Then

L(a)/a^2 -> C_* m.                                         (1)

Moreover every optimal supporting coefficient v_a satisfies

v_a/a -> w_*.                                              (2)

The normalized actual integrated cubic pivot obeys E_(rho_a) f_a~6a^3, so

L(a)/E_(rho_a)f_a ~ C_* m/(6a) ->0.                        (3)

This is an actual-theta failure of a positive shift-uniform fractional-reserve assumption, even after genuine reoptimization. It is not a negative optimized margin.

## 2. Full-theta inputs and their uniform meaning

The previously audited gamma concentration gives, at fixed j,
M_j/(M_0 a^j)=(2j-1)!!+O_j(1/a).
Consequently alpha(a)=3a+O(1). The full-theta local asymptotics, with Z=pi exp(2u), are
g_1=2Z+O(1), g_2=12Z^2+O(Z), g_3=120Z^3+O(Z^2).
Since g_1>17/2 everywhere, they imply
g_2/g_1=6Z+O(1), g_3/g_1=60Z^2+O(Z).
These ratio error bounds extend uniformly to all Z>=pi by enlarging fixed constants on the remaining compact interval. They retain the complete orbit sum and do not assume a local Gram matrix positive.

## 3. Matching lower bound by reoptimizing the plane

Fix any sufficiently small epsilon>0, for example 0<epsilon<1, and choose
v=(w_*-epsilon)a.
Put w=w_*-epsilon and C_epsilon=9+6w=C_*-6epsilon. Directly from the preceding uniform ratio bounds,

[f_a-2v z_a]/g_1
 =a^2 Q_epsilon(Z/a)+O(a+Z+1),
Q_epsilon(t)=60t^2-12(3+w)t+C_epsilon.                      (4)

The minimum of Q_epsilon over the real line is
kappa_epsilon=(3/5)epsilon(2sqrt(10)-epsilon)>0.
Thus there is a fixed c_epsilon>0 such that Q_epsilon(t)>=c_epsilon(1+t^2) for all t>=0. The error in (4) is at most a constant times a+Z+1. For sufficiently large a it follows that

f_a-2v z_a >= (c_epsilon/2)a^2 g_1

uniformly in u. Choose a finite R so large that (c_epsilon/2)g_1(u)>C_epsilon m+1 for every u>=R. This pays the entire spatial tail, including Z comparable to a and much larger than a.

On the remaining fixed compact interval 0<=u<=R,
[f_a-2v z_a]/a^2 -> C_epsilon g_1(u)
uniformly. Hence
liminf_(a->infinity) L(a)/a^2 >= C_epsilon m.
Letting epsilon decrease to zero proves the lower bound C_*m in (1). The positive margin follows from a genuinely reoptimized plane, not rigid transport, and no next target moment has been assumed.

## 4. Matching upper bound using an exact two-atom constraint

Choose u_0 at which g_1(u_0)=m. For large a let u_a be defined by Z(u_a)=t_* a. At the fixed compact atom,
z_a(u_0)=-3ma+O(1)<0,
f_a(u_0)=9ma^2+O(a).
At the moving atom,
z_a(u_a)=6t_*(2t_*-1)a^2+O(a)>0,
f_a(u_a)=[120t_*^3-72t_*^2+18t_*]a^3+O(a^2).

Define exact positive weights
omega_a=-z_a(u_0)/[z_a(u_a)-z_a(u_0)],
nu_a=(1-omega_a)delta_(u_0)+omega_a delta_(u_a).
For sufficiently large a, 0<omega_a<1 and E_(nu_a)z_a=0 exactly. Thus this is a valid two-atom dual witness, not a quadrature approximation. Its weight has asymptotic
omega_a= m/[2t_*(2t_*-1)a]+O(a^(-2)).

Every supporting plane integrates under nu_a to E_(nu_a)f_a, giving the rigorous upper bound L(a)<=E_(nu_a)f_a. The limit of that objective divided by a^2 is
m[9+3(20t_*^2-12t_*+3)/(2t_*-1)]
=(21+6sqrt(10))m.
This matches Section 3 and proves (1). The moving atom tends to infinity and its mass tends to zero, while its signed constraint contribution remains essential. The witness is asymptotically sharp; it is not asserted to be an exact optimizer at finite a.

## 5. Actual optimal plane scale and target comparison

For any optimal v_a, evaluate its remainder at u_a. The inequality
L(a)<=f_a(u_a)-2v_a z_a(u_a)
and positive z_a(u_a) imply limsup v_a/a<=w_*. Evaluate at u_0, where z_a(u_0)<0. The same inequality, together with (1), implies
liminf v_a/a >=(C_*-9)/6=w_*.
This proves (2). In particular, a shift-uniform bound on the norm of optimal planes is false for the actual complete theta even at this fixed degree. It does not contradict compact-shift optimizer bounds from REOPTIMIZED_DUAL_FLOW.md.

Finally,
E_(rho_a) f_a=M_3/M_0-M_2^2/(M_1 M_0)
            =(15-9)a^3+O(a^2)=6a^3+O(a^2).
This is a derived asymptotic of the actual target, not an input to either margin bound. It gives (3). No asymptotic for L'(a) is inferred merely by differentiating (1).

## 6. Precise implications for the all-degree effort

This result verifies a nontrivial reoptimization mechanism with changing spatial scale and an exact N+1-point dual, while rigorously disproving uniform-in-shift optimizer bounds and fixed fractional comparison to the actual pivot. It does not establish degeneration with degree at a fixed critical shift, and does not preclude a useful degree-dependent margin there.

The general signed minimax from REOPTIMIZED_DUAL_FLOW.md remains uncontrolled at fixed critical shifts. Neither the positivity in this fixed-degree asymptotic nor the existence of its two-atom witness can be extrapolated to all degrees. No numerical finite-rung escalation or external code is used.
