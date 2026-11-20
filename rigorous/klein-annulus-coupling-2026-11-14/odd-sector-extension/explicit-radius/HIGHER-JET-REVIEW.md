# Independent review of the four-feature theta interval certificate

Reviewed and privately replayed on 14 November 2026. Sources under review:
`higher-jets/theta-odd-higher-jet-interval.py`,
`higher-jets/HIGHER-JET-CERTIFICATE.md`, and
`higher-jets/coefficient-reduction-audit.py`.

## Verdict

The certificate is sound under its stated interval-arithmetic trust basis. No substantive code or mathematical correction was needed. A private replay reproduced the four strictly positive interval LDL pivots and the leading determinant enclosures, including

\[
\det J_4\in[1.4097072863877992\times10^{-12},
1.4097309454731956\times10^{-12}].
\]

The separate exact Gaussian and negative-control coefficient checks also passed.

## Checks performed

1. **Coefficient normalization.** Differentiating the fixed-lower-limit cutoff integral gives, for odd `m,n`,
   \[
   J_{mn}=\frac{2}{m!n!}
   \left(2T_{mn}+mU_{m-1,n}+nU_{m,n-1}\right).
   \]
   The factor two comes from the odd reflection difference. The cross-term signs are positive because differentiating the linear prefactor reverses the remaining derivative parity.

2. **Integration by parts.** The recurrences
   \[
   U_{ab}=-k_a k_{b-1}-U_{a+1,b-1},
   \quad U_{j,j+1}=-k_j^2/2,
   \]
   \[
   T_{ab}=-U_{a,b-1}-T_{a+1,b-1},
   \quad T_{jj}=I_j
   \]
   correctly retain the origin terms. Odd origin derivatives vanish by exact evenness. The weighted `T` boundary term vanishes at zero because of the factor `u`.

3. **Derivative recurrence and theta tails.** Exact rational coefficients are used in `P_(j+1)=(1/4-v)P_j+vP_j'`. The geometric remainder after six theta terms is valid uniformly on the whole positive half-line through derivative order 17. Its monotonicity and ratio hypotheses are checked as strict interval inequalities.

4. **Taylor quadrature.** For each 128-panel subinterval, the degree-nine midpoint Taylor polynomial integrates with weights `h^(q+1)/(2^q(q+1)!)` for even `q=0,2,4,6,8`. The omitted part is bounded by
   \[
   \frac{h^{11}}{2^{10}11!}\sup|f_j^{(10)}|.
   \]
   The full interval derivative expression includes the product-rule term from the factor `u`. All theta truncation errors are already included in both midpoint and remainder evaluations. No floating quadrature error estimate is used.

5. **Infinite moment tails.** For `u>=3`, the complete theta derivative is bounded by the doubled first-term envelope. Squaring that envelope and using `exp(v)>=1+v` yields the stated `(R/beta+1/beta^2)` bound. The contribution is added as a nonnegative interval and covers the entire unbounded domain for all seven moments.

6. **Interval LDL.** Each computed pivot and multiplier encloses the corresponding exact recurrence value. Positive lower pivot endpoints justify every division and certify strict positive definiteness. Multiplying the pivot intervals encloses the exact leading determinants. Correlations between entries may enlarge bounds without invalidating the enclosure.

7. **Arithmetic and output.** Certificate arithmetic uses interval numbers, exact integers, or exact rational inputs. Binary floats occur only in displayed endpoints, which are widened outward. Positivity assertions use the original interval objects.

## Scope of the consequence

A positive definite leading four-feature block, together with real analyticity, gives a sufficiently small neighborhood in which every odd Gram of at most four distinct positive nodes is positive definite. The Newton divided-difference congruence approaches the coefficient block uniformly even when nodes nearly coincide. This qualitative consequence needs no minimum separation.

The four-feature certificate itself does not supply an explicit neighborhood radius. It also does not establish arbitrary-order positivity, an unrestricted eight-center statement, global bridge control, or RH. The underlying trust basis remains mpmath's outward-rounded elementary operations, the Python runtime, and the displayed elementary estimates, rather than formal proof-assistant verification.
