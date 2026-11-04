# Independent audit: exact theta-map rigidity and fixed-target source distance

2026-11-04. Analytical audit of `THETA_SELECTION_INTERTWINER.md`, with read-only checks against the frozen finite-arithmetic source audit and source-localization note. Only this new working audit is written. No frozen, repository, or 4CT artifact is changed. This is AI-assisted mathematical checking, not external peer review or machine formalization.

## Verdict

The substantive claims pass. The degree-coordinate transform, exact full-sum rigidity, reflected-derivative boundary corrections, nonzero finite-order jump, eventual real algebraic Fourier tail, and positive actual zero-cell source-distance floor are correctly derived. The fixed-target versus growing-family limitation is essential and is correctly stated. The result does not prove actual selected theta failure or impossibility of the different modulation map.

One domain clarification was requested from the author: the translation identities in Section 3.3, equation (6), must explicitly be restricted to the positive half-line (or to analytic unreflected continuations). They do not hold globally for the reflected finite sources. This is the restriction in the frozen source-localization input and does not change any proof here, all of which uses those identities only in the positive-half-line discussion.

## 1. Differential coordinates and their image

With z=pi m^2 e^(2u), the given summand is exactly

    phi_m(u)=e^(u/2)e^(-z)(4z^2-6z).

Differentiation of the complete product gives

    D[e^(u/2)e^(-z)R(z)]
      =e^(u/2)e^(-z)[2zR'(z)+(1/2-2z)R(z)].

Thus L and R_p=p(-iL)V are correct, including the factor 2 multiplying z and the constant 1/2. Applying L to a degree-j monomial gives (2j+1/2)z^j-2z^(j+1), proving the coefficient recurrence. Its top coefficient is multiplied by 2i at each application of -iL, yielding exactly

    [z^(n+2)]R_p=4(2i)^n b_n.

This proves injectivity and the descending triangular inverse on the image. It does not identify label m with differential degree n.

For w=z^(-1/2)e^(-z), integration by parts gives

    integral w LR = -1/2 integral w R.

The boundary term 2z^(1/2)e^(-z)R vanishes at both ends for every polynomial. Also LV preserves a zero at z=0, and

    integral wV=4 Gamma(5/2)-6 Gamma(3/2)=0.

The two image constraints are independent on polynomials of degree at most n+2: evaluation at zero vanishes on z, whereas its weighted integral does not. Their joint kernel therefore has dimension n+1. The n+1 triangular independent images span it. Equation (4) is an exact characterization, not merely necessary conditions.

The h-coordinate uses R_(p'), with the coefficient k in p' preserved. This agrees with the corrected finite-arithmetic audit.

## 2. Rigidity of the complete finite sum

After x=e^(2u), every summand contains a distinct exponential e^(-pi m^2 x). For a finite sum of these exponentials multiplied by polynomials and polynomial-times-logarithm factors, divide by the smallest exponential rate with a nonzero coefficient pair. Later terms are exponentially small. A nonzero A(x)log x+B(x) cannot be exponentially small at positive infinity: its highest nonzero polynomial order, with the logarithmic term taking precedence at equal order, has nonzero algebraic-logarithmic size. Thus every pair must vanish.

This proves the lemma for complex as well as real coefficients. Equality in L2 suffices because all relevant functions are analytic on the open positive half-line and hence equality almost everywhere extends to equality everywhere there.

For the value source, the lemma gives R_p=c_m R_q for every label. For the complete source, the coefficient of log x gives exactly the same identities. The nonzero scaling z=lambda_m x does not alter polynomial identity. Injectivity then yields p=c_m q for every m. The derivative-polynomial coefficient yields a consistent further identity but is not needed for the conclusion.

For the Mobius endpoint, c_M=1 forces p=q. The coefficient at label 1 is mu(M)/sqrt(M), whose absolute value is less than one for M>=2; hence the entire vector cannot be constant. The impossibility is therefore exact for this specified finite internal-summand weighting target.

This does not prohibit a map that changes the target construction or approximates it with degree-dependent error. Nor does it prove equality of the GCD model's modulation labels with the theta kernel's internal summand labels. The note explicitly keeps these matters separate.

## 3. Translation and full source

On u>=0, phi_m(u)=m^(-1/2)phi_1(u+log m). Differentiation commutes with this translation. Writing v=u+log m gives

    -2iu f_1(v)-h_1(v)
      =g_1(v)+2i log(m) f_1(v).

The mixed term in equation (6) therefore has the correct positive sign and factor 2. It must be kept in every full squared norm. Translation of the reflected source on the whole line is a different operation, which is why the positive-half-line domain qualification is needed.

## 4. Exact distributional and Fourier boundary corrections

For E_k(u)=sgn(u)^k s_c^(k)(|u|), the jump at zero is zero for even k and 2d_k for odd k. Consequently

    D E_k=E_(k+1)+2 1_(k odd)d_k delta_0.

Induction gives equation (7), with odd indices 1<=j<k and derivative order k-1-j on delta_0. In the stated Fourier convention, D transforms to multiplication by it, while (-i)^k(it)^k=t^k. Thus

    hat f=qF_c-B_(c,q),
    hat h=q'F_c-B_(c,q').

Also hat(uf)=i partial_t hat f. Transforming -2iu f-h yields

    G=F_cq'+2F_c'q-2B_(c,q)' +B_(c,q'),

including all signs and the distinction between differentiating B in t and replacing q by q'. These operations are generally different.

For q=t^3, direct substitution gives B=-2d_1 t and B_(q')=-6d_1. Hence the total boundary correction is -2d_1, as stated. For q=1 the boundary polynomial vanishes and G=2F_c'. Although the separate polynomial terms in the general formula need not lie in L2, their complete combination is the Fourier transform of the prescribed piecewise L2 source. The note correctly takes the norm only after this combination.

The actual smooth even infinite kernel has vanishing odd jets at zero, so the corresponding corrections vanish. Finite reflection does not share that property automatically.

## 5. A nonzero finite-order jump must occur

The positive-half-line expression extends analytically to all real u and has the convergent expansion

    s_c(u)=sum_(j>=1)a_j e^((2j+1/2)u).

There are infinitely many nonzero a_j. If there were only finitely many, the entire function sum_m c_m V(lambda_m x)e^(-lambda_m x) would be a polynomial in x. It decays at positive infinity, so that polynomial would be zero. Distinct-rate independence would then force every c_m=0, contrary to the hypothesis.

Termwise finite differentiation yields the displayed continuation

    g_+(u)=sum_j a_j e^(beta_j u)
               [-2iu q(-i beta_j)-q'(-i beta_j)].

A nonzero polynomial q cannot simultaneously satisfy q(-i beta_j)=q'(-i beta_j)=0 for infinitely many distinct beta_j. Hence there is a least j with a nonzero source coefficient. As u tends to negative infinity, that term dominates all later terms, giving a nonzero exponential times a polynomial of degree at most one in u. This domination follows directly from the convergent power series at x=e^(2u)=0; it does not assume a formal asymptotic summation.

In contrast, the prescribed negative-half-line source is obtained from finite reflected theta derivatives and decays superexponentially there. Both the positive continuation and the negative formula are real-analytic across a neighborhood of zero, indeed entire in u. If their derivatives all matched at zero, their analytic functions would coincide, contradicting the distinct negative-infinity decay. Thus a least finite nonzero jump J_r exists.

All piecewise derivatives of the source are integrable because each half-line has superexponential decay and finite one-sided jets. The subsequent integrations by parts are therefore justified. This argument also ensures the fixed target is nonzero; its norm cannot vanish.

## 6. Fourier tail, real sign, and explicit threshold

For real c and q, each reflected derivative coefficient satisfies the required Hermitian symmetry, and directly

    g(-u)=conjugate(g(u)).

Thus G is real for real t. Equivalently J_r is purely imaginary for even r and real for odd r, so J_r/i^(r+1) is real.

Integrating by parts separately on the two half-lines gives the expansion

    G(t)=sum_(k=0)^(r+1) J_k/(it)^(k+1)
          +(it)^(-r-2) integral g_pw^(r+2)(u)e^(-itu)du.

The jumps below r vanish. Therefore

    A=J_r/i^(r+1) !=0,
    |G(t)-At^(-r-1)|
      <=[|J_(r+1)|+||g_pw^(r+2)||_1]t^(-r-2).

Both the exponent r+2 and the supplied error constant are correct. For t>=max(1,2C_g/|A|), the error is at most half the leading magnitude. Hence G has the fixed sign of A and the claimed lower magnitude. The threshold is an explicit target-dependent expression; the argument is not a uniform numerical certification or complexity bound for finding r.

For q=1 and first nonzero odd jet d_(2s+1), the even reflected transform has leading term

    F_c(t)=2(-1)^(s+1)d_(2s+1)t^(-2s-2)+lower terms.

Applying the same jump expansion directly to its derivative source, rather than assuming differentiation of an arbitrary remainder, yields

    F_c'(t)=4(s+1)(-1)^s d_(2s+1)t^(-2s-3)
             +O(t^(-2s-4)).

Thus the note's example G=2F_c' and coefficient 8d_1/t^3 when d_1!=0 are correct.

## 7. Actual zero-cell source-distance floor

For an interval I=(a,b) between consecutive distinct real zeros of F,

    integral_I F Tp=integral_I (F^2p)'=0.

No zero simplicity is required. Polynomial sources are in L2 by the actual theta decay, and F1_I belongs to L2 with strictly positive norm. The normalized cell functions on disjoint cells form an orthonormal family. Applying Bessel's inequality to G-Tp gives exactly equation (10), then taking the infimum over all polynomial degrees preserves the bound.

The classical unconditional infinitude of real Xi zeros ensures cells arbitrarily far on the positive axis. Alternatively, the following argument needs only any one supplied cell beyond the explicit threshold. On such a cell, F has one fixed nonzero sign and G has the fixed sign of A. Hence no cancellation occurs in integral_I FG, and

    |integral_I FG|
      >=(|A|/2)b^(-r-1) integral_I |F|>0.

Dividing by ||F1_I||_2 gives equation (16). Plancherel in the convention used here is ||hat f||_2^2=2pi||f||_2^2, so the source-space lower bound has exactly the stated factor 1/sqrt(2pi). The sum-of-cells squared lower bound correspondingly has factor 1/(2pi).

This is a distance obstruction in the complete actual source norm, not in a sum of separate label norms. Adding a derivative-source approximation requirement cannot lower the already positive source error. The argument applies even when the approximating p is complex because cell annihilation remains exact.

## 8. Fixed-target and full-selection limitations

The tail order, leading jump, threshold, witnessing cell, and target norm all depend on c,q,M. The proof supplies no positive uniform lower bound along a changing sequence of targets.

For the all-ones finite prefixes, the frozen finite-arithmetic audit gives

    ||g_p-g_(1,p,M)||_2+||h_p-h_(1,p,M)||_2
      <=exp(C(n+2)log(n+2)-cM^2)sqrt(X[p]).

The orthogonal projection onto the zero-cell annihilators is contractive and annihilates the actual source Tp. Thus the nodal residual of the finite Fourier target is at most its squared distance from Tp, with the stated Plancherel factor. Every fixed finite target can have positive distance while these distances tend rapidly to zero with M. There is no contradiction and no uniform obstruction to the audited M=O(sqrt(n log n)) reduction.

Finally, multiplying F(t) by e^(it ell) translates the entire kernel to psi(u+ell) in the given convention. That operation is not the finite internal weighting sum_m c_m phi_m. Accordingly the exact internal-weighting rigidity does not settle the separate GCD modulation-map problem, nor transport the complete polynomial monic affine space. The note's four remaining requirements correctly retain full source-relative control, derivative error, leading functional, and every older direction.

No actual-theta selected upper bound, actual selected counterexample, or general impossibility theorem is established or asserted. Apart from the stated positive-half-line domain clarification, no correction is required.

## Source-freeze verification

The requested domain clarification has been applied: Section 3.3 now explicitly restricts the translation formulas to u>=0, or the unreflected positive-half-line analytic functions. The displayed identities and the substantive audited conclusions are unchanged.
