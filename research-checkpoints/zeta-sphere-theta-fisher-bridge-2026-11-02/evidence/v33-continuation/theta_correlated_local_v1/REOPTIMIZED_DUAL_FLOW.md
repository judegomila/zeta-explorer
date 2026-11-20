# Reoptimized selected-dual flow with changing active contacts

Status: independent analytical review PASS.

## 1. Domain and fixed-degree compactness

Fix n=epsilon+2N, N>=1. Let I be a compact interval of nonnegative shifts on which the actual normalized old parity moment matrix A(a) is positive definite. Its cross column is b(a), and c(a)=-A(a)^-1 b(a). All moments use the complete theta kernel and sinhc weight; at a=0 they are interpreted by their analytic limits. No next target pivot is assumed positive.

Use A_loc,b_loc,d_loc,f_c,z_c from DUAL_PREFIX_CONTINUATION.md and define
Q(a,v,u)=f_(c(a))(u)-2v^T z_(c(a))(u),
L(a)=sup_v inf_(u>=0) Q(a,v,u).

At each a the previously audited selected-dual theorem gives finite attained maximizers, denoted V(a), and an attained dual minimum over probabilities nu with E_nu z_(c(a))=0. Denote the optimal dual measures by D(a). Their objective E_nu f_(c(a)) equals L(a). These auxiliary measures need not be the actual spatial measure rho_a.

The compactness bounds can be made uniform on I. The actual inverse and c(a) are smooth and bounded because the known old matrix remains positive definite. The positive-parent covariance E_(rho_a)[z z^T] is positive definite by the distinct leading theta powers, and varies continuously. Its least eigenvalue therefore has a positive minimum on I. The positive-parent second and fourth moments used in SELECTED_ORTHOGONALITY_DUAL.md are continuous and bounded on I by full-theta decay. Its coercive bound on maximizing v is consequently uniform. The local leading behavior Q~[(2n)!/n!]Z^n, Z=pi exp(2u), uniformly for these bounded c,v, restricts all active minimizing contacts to a common finite interval [0,U].

Thus the value problem can locally and on I be restricted to fixed compact sets in v and u without changing L. The maximizer set V(a) is convex and compact. D(a), restricted to [0,U], is convex and weakly compact. Every pairing of an optimal v and optimal nu is a saddle pairing. In particular, every optimal nu is supported on the contact set of every optimal supporting plane.

For explicit coercivity envelopes, use the earlier notation at each a:
kappa(a)=lambda_min E_(rho_a)[zz^T], C2(a)=E||z||^2,
C4(a)=E||z||^4, F2(a)=E f_c^2,
delta(a)=kappa(a)^(3/2)/(2 sqrt(C4(a))),
C(a)=sqrt(F2(a) C2(a))/delta(a).
Let delta_I=min_I delta>0, C_I=max_I C, and m_I=min_(a in I,u>=0) f_c(u), which is finite by the uniform leading tail. Then one valid optimizer bound is
V_I=(C_I-m_I)/(2 delta_I).
One may enlarge this bound strictly when selecting the compact strategy ball. Since the actual rho_a is dual feasible, L(a)<=E_(rho_a)f_c<=sqrt(F2(a)). Therefore an effective U can be chosen from the complete-theta tail bounds so that Q(a,v,u)>max_I sqrt(F2)+1 whenever u>=U and ||v|| is in that enlarged ball. No unknown signed target lower bound enters these constructions.

None of these uniform-on-I statements is uniform in degree. Positive-parent covariance controls dual coercivity only; it does not replace the true signed inverse A(a)^-1.

## 2. Exact one-sided variational derivative

At an interior a of I, set d=c'(a). Let
J_a(v,nu)=-2 v^T (E_nu A_loc) d.                            (1)
Then the right derivative exists and is

L'_+(a)=max_(v in V(a)) min_(nu in D(a)) J_a(v,nu)
       =min_(nu in D(a)) max_(v in V(a)) J_a(v,nu).          (2)

There is an analogous directional formula for motion in the negative a direction, with d replaced by -c'(a). No uniqueness of the supporting plane, contact locations or atomic measure is required. A left derivative need not equal the right derivative.

Here is a direct saddle proof. The uniform derivative of Q at fixed v,u is

partial_a Q=2d^T z_c-2v^T A_loc d.                          (3)

Fix an optimal v at a, and take optimal nu_h at a+h. Saddle inequalities give
L(a+h)-L(a)>=integral [Q(a+h,v,u)-Q(a,v,u)]dnu_h.
Every limit point of nu_h is optimal at a. Its z_c mean is zero, so (3) reduces to J_a(v,nu). Taking liminf and then maximizing v gives the max-min lower bound in (2).

Conversely fix an optimal nu at a and take optimal v_h at a+h. The same inequalities give
L(a+h)-L(a)<=integral [Q(a+h,v_h,u)-Q(a,v_h,u)]dnu.
Every limit point of v_h is optimal at a, yielding the min-max upper bound. The two bounds agree by the compact convex bilinear minimax theorem: J is linear in nu and linear in v. The measure dependence passes through the finitely many entries of E_nu A_loc, so this is also a finite-dimensional compact convex minimax problem. This proves (2), including at changing contacts.

The cancellation of the first term in (3) is the exact inverse-selection constraint, not an assumption about the next target sign.

## 3. The N+1-point structure survives

Choose any one v_ref in V(a), and let K_ref be its compact contact set. The set D(a) is exactly the probabilities supported on K_ref whose z_c mean vanishes. Indeed Q=L on K_ref, so their f mean equals L automatically.

For each fixed v in the inner minimization of (2), J_a(v,nu) is a linear objective over these probabilities with N cross-moment constraints and one normalization constraint. The minimum can be attained by a measure with at most N+1 points. This is the same finite-constraint extreme-measure/convex-hull argument as in the original selected dual. It does not claim that a single fixed atomic support works as a varies, or that an arbitrarily chosen positive atomic objective supplies a lower bound on L.

Accordingly, (2) may be evaluated as a maximum over optimal planes followed by a minimum over their original optimal dual measures with at most N+1 atoms. Active atoms may enter, leave or move. The result does not assume a nonsingular contact interpolation matrix.

## 4. A genuine local reoptimization bound

Let verified finite constants on I satisfy
||v||<=V_I for every v in V(a),
||A_loc(u)||op<=B_I for u in [0,U],
||c'(a)||<=D_I.
The last derivative is the actual prefix expression

c'(a)=-A(a)^-1[A'(a)c(a)+b'(a)].                           (4)

It uses only old and cross moments, through index n-1, not the next target integral. V_I and U can be bounded by the earlier coercivity and theta-tail estimates; these may involve positive-parent moments of known local expressions, not an assumed signed target norm.

The value function is locally Lipschitz because it is a max-min of uniformly C1 functions on fixed compact sets. Therefore it is absolutely continuous on I. Equation (2), valid in particular almost everywhere, gives

|L'(a)|<=2 V_I B_I D_I almost everywhere,
|L(a1)-L(a0)|<=2 V_I B_I D_I |a1-a0|.                     (5)

More generally integrate the pointwise bounds 2 V(a) B(a)||c'(a)|| where verified measurable envelopes are available. If an independently proved starting margin ell0>0 obeys

2 V_I B_I D_I |a1-a0|<ell0,

then L(a1)>0 and (5) gives an explicit lower bound. This permits full reoptimization; no supporting vector is transported rigidly. It remains valid through changes of active contacts.

The exact signed minimax (2) can be much better than the absolute bound (5). A useful global argument would need a one-sided integrated estimate for (1), or sufficiently controlled envelopes in (5). Neither a degree-uniform estimate nor a successful chain to a fixed critical shift is established here.

## 5. Relation to the known obstruction

Rigid transport fixed v-c throughout the path and was disproved even for an already-positive quadratic target. In (2) v is reoptimized independently at every shift, so that obstruction does not apply. Conversely, the existence and compactness of optimal planes do not imply J_a>=0: A_loc can be indefinite, and neither v nor c' has a prescribed sign. Dropping the mixed correlation or substituting positive-parent conditioning for A^-1 in (4) would be unjustified.

This is a noncircular local continuation theorem conditional only on a known old prefix and a previously proved positive starting supporting-plane margin. It supplies a derivative game that explicitly retains the remaining signed arithmetic difficulty. It is not an all-degree lower bound, a new finite positive rung, or a negative optimized-dual witness.
