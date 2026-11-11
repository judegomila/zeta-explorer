# Theta preservation through the first reduction, and a general obstruction

Research continuation, 10 November 2026.

**The actual first reduced theta pair preserves the full comparison
structure for every positive anchor and spatial argument. The same
claim is false for general positive kernel pairs.** Both conclusions
are proved here, with explicit analytic arguments and reproducible
rigorous certificates.

The positive result supplies a theta-kernel proof of the four-node
real Pick theorem without finite-height zero verification. The
counterexample identifies why the proposed class alone cannot be
iterated into an all-order proof. RH and arbitrary-depth preservation
remain open; no novelty claim is made.

## 1. What is now proved for actual theta

Retain kappa,C,n_a,b_a,F,L from PR #51. For every a>0, form the
canonical first reduced pair (b_a,n_a), and define

$$
H_1=b_a/n_a,\qquad B_1=4b_a''/n_a,\qquad J_1=4n_a''/n_a.
$$

Then, for every t>0,

$$
\boxed{H_1'<0,\quad B_1'>0,\quad J_1'>0,\quad
d_{B_1}^2H_1>0,\quad d_{B_1}^2J_1>0.}
$$

The first two signs were known. This checkpoint proves the three
remaining signs globally. The [full theorem](theta_preservation_global_20261110.md)
gives definitions, proof assembly, strictness, and consequences.

## 2. How the proof removes the anchor

For the original pair (C,kappa), set

$$
H=C/\kappa,\quad B=-1-t\kappa'/\kappa,
\quad J=4\kappa''/\kappa,\quad
P=16C^{(4)}/\kappa.
$$

A proved second-order comparison theorem shows that the two source
Wronskians

$$
\boxed{\mathcal W(B',J',-H')>0,\qquad
\mathcal W(B',J',P')>0}
$$

imply both reduced convexities for every anchor. A Wronskian here is
the three-by-three determinant with rows consisting of the functions
and their first two derivatives. The proof uses a positive derivative
kernel for the call covariance and a continuous determinant identity.

The source inequalities are certified on the whole positive axis:

| Region | Argument |
| --- | --- |
| 0<t<=1/8 | Even Taylor/Cauchy enclosure; 128 interval cells |
| 1/8<=t<=4 | Full Taylor models with explicit remainders; 1,984 cells |
| t>=4 | Analytic first-theta-term estimate with a full-series error below 2^(-116) |

A separate theorem proves J_1''(0)>0 for every anchor. It uses the
old curvature sandwich for a<=20 and a global sixth-degree theta
lower bound for a>=20. Its constants and a global sixth-derivative
bound are rigorously certified. Convexity of J_1 in the increasing
coordinate B_1 then propagates its positive initial slope to all t>0.

See the [comparison and tail proof](theta_preservation_comparison_20261110.md)
and the [origin proof](theta_preservation_origin_20261110.md).

## 3. Consequence for the bridge energy

The first reduced pair now has enough structure for two further
positive kernel reductions. The Schur congruences give

$$
\boxed{
\left[\frac{L(x_i)+L(x_j)}{x_i+x_j}\right]_{i,j=1}^4\succ0
\quad\text{for every four distinct }x_i>0.
}
$$

Consequently the exact finite theta/prime energy is strictly positive
for any nonzero test with at most four distinct exponential rates
greater than one half. Its energy identity and convergence are the
fixed earlier PR #48 results.

PR #50 already established four-node positivity using a finite-zero
theorem on part of its proof domain. The current argument gives a
separate proof entirely through theta properties and rigorous kernel
estimates. It does not prove the fifth stage or every matrix order.

## 4. A rigorous counterexample changes the general strategy

The general comparison class is not invariant. Take

$$
v(t)=e^{-t^2},\qquad
u(t)=\frac{e^{-t^2}}{\sqrt{t^2+5}},\qquad a=10.
$$

All proposed input signs and convexities hold globally by exact
polynomial identities. Nevertheless the reduced H becomes strictly
concave as a function of the reduced B near zero. A branch-aware
rigorous integral certificate encloses the decisive coefficient near
-1.7857962135*10^(-5), strictly below -0.0000178.

The [counterexample note](theta_preservation_counterexample_20261110.md)
contains the complete input proof, output formulas, integral tails,
and strict failure. This is an auxiliary kernel pair, not actual theta.
The new source Wronskian condition explicitly excludes it.

The remaining research task is to establish sufficient higher source
conditions and origin control for later actual theta reductions. The
two source determinants are not yet known to preserve themselves.
The successful first theta reduction cannot be promoted to an
all-depth theorem from the old comparison class alone.

## 5. Reproduce and inspect

From this directory, without Python optimization that disables assertions:

```bash
python -m pip install -r requirements.txt
python run_checks.py
```

The runner recomputes all rigorous interval/integral enclosures and
the exact algebra checks. Captured output is `checks_replay.json`.
The [large-anchor companion](theta_preservation_actual_20261110.md)
provides a separate analytic boundary theorem and useful asymptotic
structure; it is auxiliary to the global proof.

Read [AUDIT.md](AUDIT.md) for proof assumptions and review coverage,
[SOURCES.md](SOURCES.md) for primary references and immutable prior
checkpoints, and `MANIFEST.json` for file hashes. This is a
computer-assisted mathematical argument, not a formal proof-assistant
verification or external peer-review claim.

Only this new research directory and one decision record are added.
The base is main at `942ba1760c4ef54a519750ab91c37a661c31e0ce`.
The preceding PR #51 dependency is fixed at
`afdac28948ab084e80214c31ef72c9520d943760`; no prior merge is presumed.
