# Exact compression of the Hardy debit into the actual prefix

Status: independent analytic review PASS. This removes the exponential subset bookkeeping from the all-degree Hardy budget, but proves no new target sign or all-degree bound.

Use the conventions and limiting domains of ALL_DEGREE_HARDY_BUDGET.md. Write L_a[r]=integral_R r(t) partial_a|F(t+ia)|^2 dt as a linear polynomial functional; thus L_a[p^2]=J_a[p] in the previous note. Fix a>0 and the actual monic degree-n residual p selected by the positive degree<n signed functional L_a. Its roots r_j are real. All derivatives in the shift variable freeze this p. For complex polynomials define L_a[|v|^2] by sesquilinear extension of the real moment functional.

## 1. The combined lower-degree signed debit is a single prefix norm

Let Delta_a p(t)=p(t+ia)-p(t), which has degree at most n-1. Actual orthogonality, not positive-parent orthogonality, gives
 L_a[p conjugate(Delta_a p)]=0.
Consequently
 L_a[|p(t+ia)|^2-p(t)^2]=L_a[|Delta_a p|^2].          (1)
The right side is an actual known-prefix positive norm, with no unknown target norm in its definition. In root-subset notation, this is precisely
 sum_(S nonempty) a^(2|S|) L_a[q_S^2]
             =L_a[|Delta_a p|^2].                  (2)
Thus all lower signed subset costs combine exactly, including their coefficient correlations.

The other debit also compresses. Since the roots are real,
 d/da |p(t+ia)|^2=2a sum_j |q_j(t+ia)|^2,
where q_j=p/(t-r_j). Integrating with |F(t+ia)|^2 gives the exact identity
 L_a[p^2]=G_a[p]-L_a[|Delta_a p|^2],                 (3)
 G_a[p]=H_p'(a)-2a sum_j H_(q_j)(a).                 (4)
In particular, no product of n root bounds or sum over 2^n subsets is required. Equation (4) must remain correlated: neither a separate lower bound for H_p' nor a separate upper bound for every H_q is presently known to be sharp enough.

## 2. Complete-theta physical representation of the unpaid excess

Put f_q=q(iD)psi. The Fourier and reflection identities give
 G_a[p]=8pi integral_0^infinity u sinh(2au)|f_p(u)|^2 du
              -8pi a sum_j integral_0^infinity cosh(2au)|f_(q_j)(u)|^2 du.  (5)
The full theta series, the entire physical tail, and both polynomial parities are retained. Both terms individually are finite. Formula (5) has a signed integrand; positivity of psi or of the Hardy source alone is insufficient. Demanding pointwise positivity would be a stronger, unsupported condition. This is a genuinely integrated target.

## 3. A finite-dimensional degree-dependent upper bound, with actual conditioning

Choose any orthonormal basis e_0,...,e_(n-1) of the actual positive L_a prefix. Use column coefficient vectors: column j of D_n is the coefficient vector of e_j'. Let d be the column coefficient vector of p'. Let nu=||D_n||_2. All of these use only the actual known prefix and the already selected residual; no next norm appears.

The translation difference has exact coefficient vector
       v=i integral_0^a exp(is D_n)d ds
        =sum_(k=0)^(n-1) i^(k+1)a^(k+1) D_n^k d/(k+1)!.   (6)
Nilpotence makes this sum finite (zero terminal terms may be omitted). Its exact cost is v* v, not a generic auxiliary-parent norm. In particular,
 L_a[|Delta_a p|^2]
 <= [sum_(k=0)^(n-1) a^(k+1)nu^k/(k+1)!]^2 L_a[(p')^2]
 <= [(exp(a nu)-1)/nu]^2 L_a[(p')^2],                (7)
with quotient a at nu=0. Formula (6) is preferable when preserving cancellation. The bound (7) is rigorous but may be much too large; no degree-uniform estimate on nu is asserted. It cannot silently be replaced by the norm of differentiation in the positive Fourier-parent metric.

A sufficient theta-specific degree-dependent estimate would be
 G_a[p_n] >= L_a[|Delta_a p_n|^2]+epsilon_n(a),
                        epsilon_n(a)>0,            (8)
or the stronger version with the explicit bound (7). A positive epsilon_n(a) may shrink with degree. By (3), the exact version (8) is still the missing pivot inequality, so it is not itself an independent proof. Its value is identifying the *single actual-prefix translation norm* that a full-theta excess estimate must pay. There is presently no proved theta estimate for G_a that pays this norm for all n.

## 4. Noncircularity and current scope

Equations (1)-(7) require only known-prefix positivity and full-theta integrability. They never normalize by the target pivot. They apply at each fixed positive shift. Applying them continuously as a approaches zero additionally requires the normalized-prefix limit discussed in the previous note; a changing p_n(a) is not differentiated in (3)-(5).

This supplies an exact recurrence/translation formulation rather than another finite certificate. It does not solve the all-degree signed compensation. The remaining analytic problem is to compare the correlated physical excess (5) to the explicitly prefix-controlled translation cost (6), using theta-specific modular structure. The known logarithmic-curvature bound alone has no established implication for that comparison.
