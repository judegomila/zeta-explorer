# Certified finite central positivity for the theta heat family

22 October 2026. A reproducible bounded certificate, not an RH proof or a novelty claim.

## Result and limitations

For the Rodgers–Tao normalization

H_tau(x) = integral_0^infinity exp(tau u^2) Phi(u) cos(xu) du,

Phi(u) = sum_(n>=1) (2 pi^2 n^4 exp(9u) - 3 pi n^2 exp(5u)) exp(-pi n^2 exp(4u)),

we certify

**H_tau(x) > 0 for every real x with |x| <= 13 and every 0 <= tau <= 1/2.**

This is a bounded, real-axis positivity statement. It is not a complex zero-free disk or strip, does not rule out nonreal zeros with small real part, does not establish a collision-free continuation outside the interval, and does not prove RH. No novelty or record claim is made. In a real-zero collision argument, this can exclude a real collision location in this central interval only; all remaining hypotheses and the outer region still require proof.

## Source and normalization

Rodgers and Tao, *The de Bruijn–Newman constant is non-negative*, https://arxiv.org/abs/1801.05914, supplies this theta family. Tao’s exposition explicitly gives H_0(z) = xi(1/2 + iz/2)/8 and the same integral and series: https://terrytao.wordpress.com/2018/01/19/the-de-bruijn-newman-constant-is-non-negativ/ . The normalization matters: x is twice the usual imaginary coordinate of xi. At tau=0, |x|<=13 corresponds to |Im(s)|<=6.5 on Re(s)=1/2 only; this is not a new zero-free height record. The certification below is a direct computation for that family, not a citation of an existing numerical bound.

## Reduction to two moments at one endpoint

Let M_k(tau) = integral_0^infinity u^k exp(tau u^2) Phi(u) du. Each summand of Phi is strictly positive on u >= 0, because 2 pi n^2 exp(4u) > 3. The superexponential decay permits differentiation under the integral throughout the compact tau interval.

The probability measure proportional to exp(tau u^2) Phi(u) du gives

d/dtau (M_2/M_0) = M_4/M_0 - (M_2/M_0)^2 = Var_tau(u^2) >= 0.

For real v, cos(v) >= 1-v^2/2. Consequently,

H_tau(x) >= M_0(tau) [1 - x^2 M_2(tau)/(2 M_0(tau))].

Thus it suffices to certify M_2(1/2)/M_0(1/2) < 2/169. The strict inequality also establishes positivity at x = +/-13.

## Complete tail estimates

Write N=5 and cut the u integral at U=1. All tails are nonnegative, so dropping them gives a valid lower bound for M_0.

For either k=0 or k=2 on 0 <= u <= 1, the tail with n>N is bounded above by

T_series = 2 pi^2 exp(19/2) (N+1)^4 exp(-pi (N+1)^2) / [1 - 16 exp(-pi(2N+3))].

Indeed u^k <= 1 and exp(u^2/2+9u) <= exp(19/2), while the negative term in each kernel summand can be discarded. The consecutive-term ratio of n^4 exp(-pi n^2) is at most 16 exp(-pi(2N+3)) for n >= N+1. Integrating this uniform bound over an interval of length one proves the assertion. The denominator is positive: with N=5 and pi>3, the subtracted term is less than 16 exp(-39)<1.

For u >= 1, both moment integrands are bounded by the sum of

f_n(u) = 2 pi^2 n^4 u^2 exp(u^2/2 + 9u - pi n^2 exp(4u)).

Its logarithmic derivative is u+9+2/u-4 pi n^2 exp(4u) <= -500 n^2. To check this, g(u)=4 pi exp(4u)-u-9-2/u is increasing on u>=1, since g'(u)=16 pi exp(4u)-1+2/u^2>0. Also g(1)>588>500 using pi>3 and exp(4)>50. Replacing the positive term u+9+2/u by n^2 times that term only weakens the bound. Hence integral_1^infinity f_n(u)du <= f_n(1)/(500 n^2).

Set A=pi exp(4). Consecutive terms n^2 exp(-A n^2) have ratio at most 4 exp(-3A). Therefore the complete u>=1 tail, including all n>=1, is bounded by

T_u = [2 pi^2 exp(19/2)/500] exp(-A) / [1-4 exp(-3A)].

The latter denominator is positive because A>150, so 4 exp(-3A)<4 exp(-450)<1. These two tails cover disjoint omitted domains and account for the full infinite integral and infinite theta series.

## Certified finite integration, not ordinary quadrature

The companion check_theta_horizon.py uses python-flint 0.9.0, its Arb real-ball arithmetic, and 128-bit working precision. Partition [0,1] into 65,536 dyadic cells. Evaluate the entire truncated integrand with u equal to an interval ball covering each cell. Multiply the resulting enclosure by the cell width and sum. This encloses the integral because it bounds every pointwise integrand value on every cell. No smoothness-based quadrature error estimate, sample-only grid inference, or ordinary floating-point quadrature is used.

Every input constant in the proof computation is an integer, an exact dyadic value, or an exactly parsed decimal; pi and exponentials are computed by Arb. Printed decimal output is explanatory. The proof target is checked directly by Arb’s strict comparison against the exact rational 2/169, with failure unless the inequality is certified.

A successful run gives outward-safe rounded bounds:

- M_0(1/2) > 0.06248510.
- M_2(1/2) < 0.000729899.
- T_series < 2.608e-41.
- T_u < 1.698e-72.
- M_2(1/2)/M_0(1/2) < 0.011681154 < 2/169.

The last ratio is computed from tighter Arb endpoints than these rounded moment summaries. Full output from the default 128-bit run is in [certificate_output_128.txt](certificate_output_128.txt). A separate rerun of the same implementation at 192 bits and 65,536 cells is recorded in [certificate_output_192.txt](certificate_output_192.txt), also with a ratio upper bound below 0.011681153282. This is a replay at higher precision, not an independent implementation. This is a reproducible interval-arithmetic certificate, conditional on the correctness of Python, python-flint/Arb, and the stated analytic reduction; it is not a formal proof-assistant verification.

## Reproduce

Python 3.12.14 and python-flint 0.9.0 were used. The complete checker and its sole third-party Python requirement are included; no data archive or network input is used by the computation. Install the pinned requirement from the Python package registry, preferably in a virtual environment. For example, from the repository root in a POSIX shell:

```sh
python3 -m venv .venv-theta-central
D=research-checkpoints/theta-central-2026-10-22
.venv-theta-central/bin/python -m pip install -r "$D/requirements.txt"
.venv-theta-central/bin/python "$D/check_theta_horizon.py"
.venv-theta-central/bin/python "$D/check_theta_horizon.py" --bits 192 --cells 65536
```

Keep the virtual environment outside the research checkpoint directory so it is not mistaken for an unlisted proof artifact by the manifest verifier. The checker has no network calls and performs no external writes. Optional `--bits` and `--cells` arguments change precision and interval resolution; cells must be a power of two. Changing these options is not a promise of success: the final assertion must pass. The supplied outputs record the default 128-bit run and the separate 192-bit rerun, both with 65,536 cells.

All included files are covered by this directory's `SHA256SUMS` and [standalone verification instructions](REPRODUCIBILITY.md). They do not use, recover, or replace the omitted large arithmetic proof bundle described in [PR #15](https://github.com/judegomila/mathexplorer/pull/15). No accessible persistent copy of that omitted bundle has been verified; this does not establish permanent loss. This checkpoint has no dependency on PR #15 or any other research branch.
