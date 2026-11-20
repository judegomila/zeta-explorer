# Third theta origin and all-order compensation

This continuation of [PR #53](https://github.com/judegomila/mathexplorer/pull/53)
proves the third canonical theta origin-curvature inequality for every
positive triple of anchors, both next-source origin limits for every
positive anchor pair, and strengthens the compensation kernel to
total nonnegativity of every finite order. It gives an exact one-anchor
formulation of the remaining spatial source problem.

**Start with [the synthesis](theta_third_gate_synthesis_20261111.md).**
It explains the proof structure and separates the new operator theorem
from the still-open all-order Pick condition needed for RH.

The proved Pick order remains five. Third full preservation, six-node
positivity, arbitrary-depth canonical preservation, and RH are not
claimed in this checkpoint.

## The main advance

The next origin condition is now proved on its entire anchor domain:

\[
\left(4n_{a,c,d}''/n_{a,c,d}\right)''(0)>0
\qquad(a,c,d>0),
\]

including coincident anchors. The third numerator is a positive scalar
times a second divided difference of the first-numerator family in
the increasing coordinate `x=aL(a)`. A one-variable positive matrix
curvature therefore controls every triple of anchors. Fresh interval
certificates cover `a<=100`; an explicit analytic estimate covers
`a>=100`, including tuples straddling that split.

The compensation kernel `Pi` also satisfies

\[
\det[\Pi(y_i,s_j)]_{i,j=1}^{m}\ge0
\]

for every finite `m` and ordered nodes. Thus its integral transform
cannot increase the number of strict sign changes, and absolutely
convergent finite compositions retain that property. The analytic
proof smooths the nonsmooth remainder before higher differentiation;
finite symbolic checks validate the formulas but do not replace the
all-order argument.

## The remaining next-step inequality

All origin conditions for the next full-preservation step are now
proved. In addition to the third curvature, the two next sources have
strictly positive `t^6`-normalized origin limits for every anchor pair.
The source proof combines 4,096 compact-anchor cells with a new global
fourteenth-derivative bound and a Bernstein certificate covering all
anchors above 100. It includes equal anchors and pairs straddling 100.

Use the original ratios `H=C/kappa`, `B=4C''/kappa` and
`N(a,t)=n_a(t)/kappa(t)`, and define the known positive functions

\[
f_H=(H''/H')N_t-N_{tt},\qquad
f_P=N_{tt}-(B''/B')N_t.
\]

Both next source signs at every anchor pair, including repeated
anchors, are exactly equivalent to

\[
f_H(f_H)_{at}-(f_H)_a(f_H)_t>0,
\qquad
f_P(f_P)_{at}-(f_P)_a(f_P)_t>0
\quad(a,t>0).
\]

The next task is to prove these inequalities over the whole positive
quadrant, or prove an equivalent source-propagation statement. The
operator's fixed-anchor total nonnegativity does not alone establish
that comparison between different anchors. The component notes show
the exact missing signed-density determinants and a counterexample
to that inference for general parameterized kernels.

## Proof map

| Component | What it supplies |
| --- | --- |
| [Synthesis](theta_third_gate_synthesis_20261111.md) | Main conclusions, proof dependencies, exact remaining obligation |
| [Third origin](theta_third_origin_20261111.md) | General divided-difference criterion and its all-anchor theta proof |
| [All-order compensation](theta_iterated_compensation_20261111.md) | Total nonnegativity at every order, variation diminution, finite composition, and the source-inheritance boundary |
| [One-anchor source criterion](theta_third_source_criterion_20261111.md) | Exact equivalence to the two mixed-derivative inequalities and both even-variable deflations |
| [Next source algebra](theta_third_source_20261111.md) | Two-anchor determinants, coalescent formulas, and the persistent failure of the stronger positive-source hierarchy |
| [Source-origin compact certificate](theta_third_source_origin_20261111.md) | Positive spatial-origin source limits at all compact anchor pairs, with exact deflation at zero |
| [Source-origin infinite tail](theta_third_source_origin_tail_20261111.md) | New global fourteenth-derivative bound and a compact parameter rectangle proving all remaining anchor-origin signs |
| [Signed-source span](theta_signed_source_span_20261111.md) | Three rigorous point witnesses rule out every nonzero globally nonnegative constant combination of the original two signed sources |
| [Audit](AUDIT.md) | Verification, independent review, fixed dependencies, and scope |
| [Sources](SOURCES.md) | Immutable project commits and primary mathematical references |

The exact source algebra is separated into
`theta_third_source_algebra_20261111.py`. High-precision quadrature
probes live under `diagnostics/`; their positive samples are not inputs
to any proof certificate.

## Reproduce

Install the pinned dependencies from `requirements.txt` in a suitable
Python environment, then run from this directory:

```sh
python run_checks.py
```

Run without `python -O`. The runner rejects optimized mode and checks
the package versions. It recomputes 602 positive theta moment
coefficients, shares the actual fresh ball objects between the compact
certificates, and replays the explicit tail arguments. A stored replay
or diagnostic cache is never loaded as a mathematical input.

`checks_replay.json` records the complete combined result. Component
replays retain the exact constants, interval margins, named algebra
checks, and all declared proof dependencies. `MANIFEST.json` records
the deliverable hashes and the immutable provenance of copied helpers.

These are analytic and computer-assisted mathematical proofs relative
to the stated prior theorems and arithmetic implementation. They have
received independent internal review. No formal proof-assistant,
external peer-review, or literature-novelty claim is made.

## Recorded verification

The combined replay passed all 12 gates in 136.779 seconds with
Python 3.12.14 and the pinned package versions. It records:

| Check | Count |
| --- | ---: |
| New exact symbolic checks, including rational positivity checks | 85 |
| Third-origin tail exact rational checks | 32 |
| Source-origin tail assertions, including interval bounds and bookkeeping | 1,436 |
| New compact-anchor interval cells | 8,192 |
| New spatial cells for the fourteenth-derivative bound | 2,048 |
| Tail Bernstein-coefficient interval checks, included in the tail assertions | 768 |
| Replayed fixed-dependency interval cells | 6,144 |
| Fresh shared positive moment coefficients | 602 |
| Additional independent origin-moment calculations | 2 |
| Rigorous source-span point witnesses | 3 |

The categories are not all disjoint and must not be added into a single
test count. These are interval coverings, exact identities, and explicit
tail estimates; the separate diagnostic samples do not prove any sign
on an unbounded domain. Existing repository CI is a separate check and
does not substitute for this mathematical replay.
