# The actual omitted arithmetic tail has no uniform strict gap against the N=1 head

2 November 2026. New post-v4-snapshot theorem; independent hierarchy-lane review PASS; see REVIEW_HIERARCHY.md. This uses classical Voronin universality as an established external theorem, not an RH assumption.

Fix any 0<a<1/2, put p=1/2+a, and define

 H_a(t)=hat D_(a,1)(2t)/a,
 F_a(t)=hat C_a(2t)/a=W_a(t)/a,
 E_a(t)=F_a(t)-H_a(t).

The signed-head theorem proves H_a(t)>0 for t>=100. We prove there is a sequence t_j->infinity on which

             F_a(t_j)/H_a(t_j) ->0,
             E_a(t_j)/H_a(t_j) ->-1.                 (1)

In fact the sequence may be chosen with F_a(t_j)>0. Thus there is NO q<1 and T such that E_a(t)>=-q H_a(t) for every t>=T. In particular neither an absolute relative bound |E|<=qH nor a lower Loewner gap with constant q<1 can hold globally for this fixed head. This is an actual tail obstruction, not merely a defective upper estimate.

## 1. Exact full arithmetic formula

Use P_a(2t)=16(t²+p²)(t²+(1-p)²), g_p(t)=pi^(-p)|Gamma((p+it)/2)|². From xi(s)=(1/2)s(s-1)pi^(-s/2)Gamma(s/2)zeta(s),

 |xi(p+it)|²=P_a(2t)g_p(t)|zeta(p+it)|²/64.

Since W_a(t)=(1/2)partial_a|xi(p+it)|², define

 J_a(t)=partial_a[P_a(2t)g_p(t)]/(128a),
 L_a(t)=partial_a log[P_a(2t)g_p(t)].

Then exactly

 F_a(t)=J_a(t){|zeta(p+it)|²
                   +2 Re[zeta'(p+it)conj(zeta(p+it))]/L_a(t)}. (2)

There is no division by xi or zeta. Only the explicit gamma-polynomial factor is divided out, and L_a(t)>0 at sufficiently large height.

## 2. The corrected N=1 head asymptotic

Standard fixed-strip gamma asymptotics give

 L_a(t)=log(t/(2pi))+O_a(t^(-2)),
 g_(1-p)(t)/g_p(t)=(t/(2pi))^(-2a)(1+O_a(t^(-1))).

The exact completed-parent decomposition in signed_head_v5 shows

 H_a(t)=J_a(t)(1+o_a(1)).                              (3)

Indeed the differentiated dual parent is smaller by O_a(t^(-2a)); the explicit low-integral correction is O(sqrt(t)e^(-pi t/2)), and the exact axis is O(t log(t)e^(-pi t/2)). Meanwhile J_a(t) is a positive constant times t^(p+3)log(t)e^(-pi t/2), up to a factor tending to one. Thus both corrections are negligible relative to J_a. This is a fixed-a statement, not uniform as a decreases to zero.

## 3. Universality supplies small values and small derivatives together

Choose r with |p-3/4|<r<1/4. Let d>0 be smaller than r-|p-3/4|. Classical universality says that for every epsilon>0 there are arbitrarily large t such that

 sup_(|z|<=r)|zeta(3/4+it+z)-epsilon|<epsilon/2.        (4)

The target is the nonzero constant epsilon; no forbidden zero target is used. At the interior point z=p-3/4, Cauchy's estimate on radius d gives

 epsilon/2<|zeta(p+it)|<3epsilon/2,
 |zeta'(p+it)|<=epsilon/(2d).

Taking epsilon_j->0 and choosing t_j arbitrarily large for each j, (2)-(3) imply

 |F_a(t_j)/H_a(t_j)|
 <=(1+o(1))epsilon_j²[9/4+3/(2d L_a(t_j))] ->0.

Moreover the brace in (2) is at least epsilon_j²[1/4-3/(2d L_a(t_j))], which is positive once L_a(t_j)>6/d. Hence F_a(t_j)>0 can be imposed. This proves (1) without any assumption on zero locations.

## 4. Stronger value-distribution consequence

The same argument with any fixed nonzero constant target b and approximation errors tending to zero gives a sequence on which zeta(p+it)->b and zeta'(p+it)->0. Equations(2)-(3) then show

                    F_a(t)/H_a(t) -> |b|².

Every positive real number is therefore a subsequential limit of this ratio; zero is also a limit by the previous construction. In particular limsup_(t->infinity) F_a(t)/H_a(t)=+infinity, and no finite height-uniform constant can bound |E_a(t)|/H_a(t). This is still compatible with F_a(t)>=0 at every height: the obstruction is loss of a fixed-head comparison scale, not evidence of a sign violation.

## 5. What this closes, and what remains possible

The positive high-frequency finite head cannot dominate its actual omitted arithmetic orbits with a height-uniform strict relative gap, even at one fixed interior shift. The tail approaches complete cancellation along heights supplied by classical universality. An adaptive relative defect q(t)->1 is not excluded; neither are adaptive arithmetic heads N=N(t), richer correlated groupings, or a direct sign proof exploiting cancellation instead of coercive domination.

This does not show that F is negative anywhere, and is compatible with RH. It also does not apply to the endpoint a=1/2, to a uniform a->0 limit, or to an adaptive head without a separate analysis. The result is an obstruction for a specific proposed proof mechanism, not a new zero-free theorem.

## External input and reading scope

Primary original: S. M. Voronin, Theorem on the universality of the Riemann zeta-function (1975), DOI https://doi.org/10.1070/IM1975v009n03ABEH001485; bibliographic record https://www.mathnet.ru/eng/im2037. Its English-PDF link redirected to the record in this access route; no access restriction was bypassed.

The exact positive-density disk statement was read in the primary research article by Lamzouri, Lester and Radziwill, An effective universality theorem for the Riemann zeta function, arXiv:1611.10325v2, Introduction, displayed (1.2), https://arxiv.org/html/1611.10325. Their article also proves an effective refinement. We use only the established universality input, not that refinement, and do not claim to have independently audited their entire proof. Our new deduction is equations(1)-(3) and the Cauchy-estimate comparison above. Classical gamma asymptotics and the already audited exact grouped-head decomposition are the other inputs.
