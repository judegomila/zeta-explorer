# Independent audit of the actual-theta `N=2` endpoint payment

## Verdict and scope

The complete theta profile satisfies the strong `N=2` modular payment at the
normalized endpoint `a=0`.  Directed frozen enclosures give

\[
 \boxed{\sigma _3>\kappa _0Q_{2,0}^-}
 \qquad\hbox{with a certified margin greater than }194.69.       \tag{1}
\]

This is a direct fixed-endpoint, degree-three certificate.  It does not prove
the payment on an interval of positive `a`, an all-degree theorem, or RH.
The calculation evaluates the fixed target moment `M_3`; it certifies rather
than assumes the next-pivot sign, but it is not a prefix-only induction
mechanism.

## 1. Exact normalization and formulas

Let `M_j` be the full-line integrated-square moments in
`INTEGRATED_SQUARE_PAYMENT.md`.  General pivot transport gives

\[
 \sigma _2=2\left(M_2-{M_1^2\over M_0}\right),\qquad
 \sigma _3=2\left(M_3-{M_2^2\over M_1}\right).             \tag{2}
\]

Thus

\[
 \bar b_1={M_1\over M_0},\qquad
 \bar b_2={\sigma _2\over2M_1}.                            \tag{3}
\]

Put

\[
 F_{2,0}=\psi''+\bar b_1\psi,qquad
 Q_{2,0}^-=\int_0^\infty hF_{2,0}(h)^2\,dh.                \tag{4}
\]

For the positive half-line derivative norms

\[
 n_j=\int_0^\infty(\psi^{(j)})^2dh,
\]

integration by parts and the exact endpoint transport identity give

\[
\begin{aligned}
 A:=\int_0^\infty F_{2,0}^2dh
   &=n_2-2\bar b_1n_1+\bar b_1^2n_0,\\
 B:=\int_0^\infty h^2F_{2,0}^2dh
   &={\sigma _2\over4}+n_1+\bar b_1n_0.                  \tag{5}
\end{aligned}
\]

Cauchy--Schwarz, applied to `F_(2,0)` and `hF_(2,0)`, retains the
correlation between the feature and its spatial weight:

\[
 (Q_{2,0}^-)^2\leq AB.                                    \tag{6}
\]

The exact reflection coefficient is

\[
 \kappa _0=8+{(\bar b_2-2\bar b_1)^2\over\bar b_1\bar b_2}.
                                                                  \tag{7}
\]

There is no half-line/full-line factor mismatch: `M_j` enters the full-line
signed derivative with the factor two in (2), while `n_j`, `A`, `B`, and
`Q_(2,0)^-` are half-line quantities.

## 2. Directed frozen bounds

The independent standard-library replay consumes the fully outward
enclosures serialized in `prior_derivative_score_20261103.json`.  It obtains

\[
\begin{aligned}
 \kappa _0&<8.002,& A&<126.54,& B&<18.283,\\
 Q_{2,0}^-&<48.0922,& \sigma _3&>579.48.
                                                               \tag{8}
\end{aligned}
\]

All arithmetic after loading the Arb enclosures is exact rational interval
arithmetic.  In particular, the replay constructs a rational decimal ceiling
for `sqrt(AB)` and proves

\[
 \kappa _0Q_{2,0}^-<385,
 \qquad
 \sigma _3-\kappa _0Q_{2,0}^->194.69.                    \tag{9}
\]

The tighter direct interval evaluation has central bounds
`kappa_0 Q_(2,0)^- < 384.786` and `sigma_3 > 579.481`; the simpler rational
bounds (8)--(9) are the independently replayed theorem statement.

## 3. Provenance and reproduction

The audit binds the signed-moment source and receipt, the positive-moment
engine and receipt, the integrated-square identity, the general pivot
transport, and the exact `N=2` reflection map by SHA-256.  It also recomputes
both embedded canonical payload hashes before using any enclosure.

From the checkpoint root, run

```text
python3 workstreams/all-degree-analytic-search-next-v1/src/audit_modular_n2_endpoint_payment_20261103.py \
  --root . \
  --output workstreams/all-degree-analytic-search-next-v1/results/modular_n2_endpoint_payment_independent_audit_20261103.json
```

The verifier performs no quadrature and no degree sweep.  Its conclusion is
only (1) at the normalized endpoint.  Continuity implies the existence of
some unspecified sufficiently small positive interval, but this audit does
not quantify that interval and does not replace the open uniform finite-`a`
correlated payment problem.
