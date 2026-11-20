# Two actual theta points exclude every scalar coefficient gauge

Status: independent analytic and interval replay review PASS. This strengthens the nonnegative-scalar result without asserting failure of the full optimized dual.

Use exactly the actual selected degree20 residual and positive scaling from SELECTED20_SCALAR_GAUGE_OBSTRUCTION.md. Let h(u)=c^T z(u), so the scalar-gauge remainder is q_theta(u)=f(u)-2theta h(u). Only the spatial evaluation point changes in the hash-verified frozen owned checker. Its full-orbit derivative bounds hold for every u>=0; the integrated prefix, rational congruence and actual inverse uncertainty are unchanged.

At u_1=11/25 and u_2=27/50, independent interval replay verifies the following results:

h(u_1)<0, f(u_1)/(2h(u_1)) > -1/5000,
h(u_2)>0, f(u_2)/(2h(u_2)) < -1/200.                       (1)

For nonnegative q_theta at the first point, theta must exceed -1/5000. At the second point it must be below -1/200. These requirements are incompatible. Thus no real theta, including negative theta, can make v=theta c a feasible nonnegative supporting plane.

Approximate enclosing ratios are
f(u_1)/(2h(u_1)) in (-0.000193058,-0.000192974),
f(u_2)/(2h(u_2)) in (-0.005855599,-0.005855232).
The rational inequalities (1), not decimal rounding, are asserted by the checker.

An equivalent finite witness for this restricted family is
omega=h(u_2)/(h(u_2)-h(u_1)),
nu=omega delta_(u_1)+(1-omega)delta_(u_2).
Its exact positive weights cancel E_nu h=0. The checker encloses
0.73350<omega<0.73352,
-426.15<E_nu f<-426.09.
Therefore every scalar-gauge remainder has a strictly negative nu-average, proving the same exclusion.

Crucially, this is NOT a feasible witness for the full N-component dual. The checker also verifies the first component is NOT canceled:
-0.047371<E_nu z_0<-0.047368.
Hence the negative objective must not be described as a negative optimized supporting-plane margin. A genuinely multidimensional vector could still succeed. No degree20 target integral or sign is used.

The strict old-prefix and two-point inequalities persist on some unevaluated neighborhood of normalized a=0 by the same full-theta analyticity argument as the preceding note. Thus the exclusion of ALL real scalar gauges also holds on a small positive-shift interval; there is no assertion of a numerical width or all-shift result.

The even parity weight is g_0=1, and any further positive coefficient scaling preserves the contradiction. This is a falsification of a concrete simple prefix-payment mechanism at an existing residual, not a new finite positive rung or an all-degree theorem.

Owned checker: check_selected20_two_point_gauge_obstruction.py.
Owned output: selected20_two_point_gauge_obstruction.json.
The checker retains the frozen original source hash and changes only its rational u assignment for the two evaluations. No acquired source is executed.
