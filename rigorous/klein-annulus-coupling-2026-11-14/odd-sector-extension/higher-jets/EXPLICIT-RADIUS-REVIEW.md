# Independent review of the explicit two-node radius

Reviewed and independently replayed on 14 November 2026. Source reviewed: `theta-odd-explicit-radius.py` and `EXPLICIT-RADIUS.md` from the companion explicit-radius directory. The replay used a private copy, leaving the source and its saved output unchanged.

## Verdict

**Passed.** No substantive error was found. The default radius `delta=1/200` and lower constant `mu=1/10000` are supported by the interval calculation and the analytic argument. The private replay reproduced

\[
\det(B-10^{-4}I)\in
[3.491470714516927\times10^{-6},\;
 1.2909332850886195\times10^{-4}]>0,
\]

with `B00-10^-4>0`. The enclosures certify `B>10^-4 I` uniformly for the continuum of distinct two-node configurations, not only for finitely sampled pairs.

The trust basis remains the outward-rounded mpmath implementation and the stated elementary analytic bounds. The result is not proof-assistant verification or a global odd-sector proof.

## Checks

### Positive-weight conversion to squared coordinates

For `h(x)=x q(x²)`, the identity

\[
q^{(a)}(X)=\frac1{4^a a!}\int_0^1(1-t^2)^a
h^{(2a+1)}(t\sqrt X)\,dt
\]

has the correct coefficient and nonnegative weight. Monomial substitution gives `n!/(n-a)! X^(n-a)` for `h=x^(2n+1)` and zero when `n<a`. Its weight mass is exactly `a!/(2a+1)!`, including `1`, `1/6`, and `1/60` for the orders used here. Applying it in both variables gives the script's derivative scaling without losing positivity or introducing node-separation denominators.

The actual theta series is holomorphic for `|Im u|<pi/2`, and the shifted cutoff integral has a uniform integrable envelope when both node variables lie in a small complex polydisk containing the stated real interval. Thus the analytic identity is valid throughout that interval, including its removable zero-coordinate values.

### Differentiation and absolute bounds

For odd `m,n`, differentiation of the linear cutoff prefactor produces the two positive cross terms stated in the note. Differentiating the reflected term in `H_-(x,y)=H0(x,y)-H0(x,-y)` contributes a second positive copy because `n` is odd. The factor two in the absolute bound is therefore correct.

On each panel, every shifted argument belongs to the interval `u+[-delta,delta]`. Interval evaluation bounds each derivative throughout that panel. Multiplying a uniform product bound by the panel width gives a rigorous integral upper bound; no quadrature error estimate is needed for this part.

### Truncated theta series and full tails

The derivative polynomial recurrence and exact rational arithmetic agree with the earlier certificates. For the omitted `n>=5` terms, the envelope decreases for every `u>=-delta`; the first omitted term and successive-term ratio are correctly evaluated at the left endpoint `-delta`. The prerequisite inequalities are checked using interval arithmetic.

For `r>=3`, the complete derivative envelope decreases in its argument, so replacing every shifted argument by `r-delta` is a valid upper bound. The product-tail integration uses `exp(v)>=1+v` with positive rate. The linear-prefactor integral retains both `(6+2delta)/rate` and `2/rate²`. This covers the entire infinite tail of every mixed derivative.

The first jet is recomputed independently within the script using the earlier interval midpoint remainder and a complete moment-tail bound. It is not loaded from an unverified saved numerical matrix.

### Newton congruence and lower bound

With `X=x²`, `Y=y²`, `Delta=Y-X`, the triangular matrix

\[
T=\begin{pmatrix}1&0\\-1/\Delta&1/\Delta\end{pmatrix}
\]

gives `B=TAT^T`. The off-diagonal entry is an average of `G_Y`; the bottom diagonal entry is a double average of `G_XY`. Both remain controlled as the nodes coalesce. The three entry-error estimates follow from integrating the first derivatives over the square `[0,delta²]^2` and using symmetry.

For an exact symmetric two by two matrix, the two verified inequalities `B00-mu>0` and `det(B-mu I)>0` imply `B>mu I`. The interval tests imply these inequalities for every matrix admitted by the entry enclosures.

Finally, with `D=diag(x,y)`,

\[
T^{-T}Dc=
\begin{pmatrix}xc_1+yc_2\\(y^2-x^2)yc_2\end{pmatrix}.
\]

This confirms the stated physical-coordinate energy bound, including its dependence on separation. The lower bound is strictly positive for every nonzero complex coefficient vector when the two nodes are distinct and positive.

## Scope retained

The radius is in the stated Mellin cutoff coordinate, for the actual unheated theta kernel. It is not a zero-capture radius in the complex zeta plane. The result allows arbitrary complex coefficients, arbitrarily close distinct nodes, and any positive scale `alpha`. It makes no claim that the radius is maximal, that the same numerical constants hold under heat deformation, or that positivity extends to unrestricted node counts or the full bridge estimate.
