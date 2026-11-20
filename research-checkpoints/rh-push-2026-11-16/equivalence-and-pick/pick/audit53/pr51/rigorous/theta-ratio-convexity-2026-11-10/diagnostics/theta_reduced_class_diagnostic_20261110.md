# First reduced pair: diagnostic test of the stronger comparison class

10 November 2026. This is a numerical risk check of the actual first
reduced pair, not a proof of preservation. No counterexample was found
in the selected cases. The original one-step comparison theorem does
not imply these additional conditions automatically.

## Exact reduction of the diagnostic quantities

Use

$$
N=n_a/\kappa,\qquad c=C/\kappa,\qquad
B=tV'-1,\qquad V=-\log\kappa,\qquad p=L(a).
$$

The canonical swapped pair is `(b_a,n_a)`. With `z=1/N`, its ratios
from the comparison note are

$$
H_{\rm new}=\frac{cz-1}{a},\qquad
B_{\rm new}=pz-a,\qquad
J_{\rm new}=a^2+(B-ap)z.
$$

The previously targeted sign N'<0 makes z an increasing coordinate.
The three new shape requirements have the following exact sign tests:

$$
J_{\rm new}'=
\frac{B'}N-\frac{(B-ap)N'}{N^2}>0,
$$

$$
\mathcal D_H=c'N''-c''N'>0,\qquad
\mathcal D_B=B'N''-B''N'>0.
$$

Indeed, for any smooth g,

$$
\frac{d^2(gz)}{dz^2}
=\frac{N^3}{(-N')^3}(g'N''-g''N').
$$

The multiplier is positive. Affine transformations from z to
`B_new=pz-a` do not change the convexity signs.

No numerical differentiation of the canceled kernels is needed. The
exact source equation gives

$$
N''=\left(\frac{a^2}4-(V')^2+V''\right)N
+2V'N'+\frac{B-ap}{4}.
$$

The remaining derivatives are

$$
B'=V'+tV'',\qquad B''=2V''+tV''',
$$

$$
c'=V'c-t/4,\qquad c''=V''c+V'c'-1/4.
$$

The probe evaluates N,N',c using the positive centered Stein integrals
implemented in `theta_ratio_probe_20261110.py`, based on the Stein
representation in the fixed PR #50 proof. High precision controls
the cancellations in N'' and the convexity numerators at the selected
points, but no interval enclosure is claimed for these values.

## Selected results

All 16 cases with

$$
a\in\{0.01,1,10,100\},\qquad
t\in\{0.001,0.5,2,6\}
$$

gave all three new signs at 70 decimal digits.

Three additional cases were evaluated at both 65 and 95 digits. Each
pair agreed to all 28 printed digits:

| a | t | J_new' | D_H | D_B |
| --- | --- | --- | --- | --- |
| 0.000001 | 0.0001 | 0.0183792780443 | 1.97382334443e-30 | 5.66927325202e-13 |
| 1000000 | 1 | 395.025725346 | 3.35367159647e-13 | 2.63148693147e-14 |
| 10000 | 8 | 701472776.453 | 1.05908042082e-8 | 9.89948814484 |

The tiny-anchor and near-origin case is especially cancellation
sensitive; its positive numerator remains stable under the precision
increase. These observations support further investigation of the
stronger class for actual theta. They neither prove its first-stage
validity for all anchors and t nor prove preservation through further
reductions.

## Reproduce

The script is `theta_reduced_class_probe_20261110.py`, importing the
two previous diagnostic modules. The main 16-case output is
`theta_reduced_class_probe_results_20261110.jsonl`. The three precision
comparisons are in `theta_reduced_class_precision_20261110.json`.

All finite quadrature outputs are explicitly diagnostic. The rigorous
origin certificate for the original anchor-free criteria is separate.
