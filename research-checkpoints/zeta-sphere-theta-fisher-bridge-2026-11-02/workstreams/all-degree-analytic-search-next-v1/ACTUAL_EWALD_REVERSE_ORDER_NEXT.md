# Reverse cell order in the actual Ewald hazard

## Scope and outcome

`CROSS_HARDY_CELL_ORDER_NEXT.md` reduces the bounded cross-Hardy direction
to the exact scalar inequality

\[
 \mathcal W_\alpha=(C-2N)P'-(C-2P)N'\geq0,
 \qquad C=(1+\alpha)M.                           \tag{1}
\]

Here the signed cells are split only **after** the complete theta profile,
all roots, the one actual residual, and the Euler subtraction have been
assembled.  This note gives a second sufficient route to (1), opposite to
the earlier sufficient condition `D=P'N-PN'>=0`:

\[
 \boxed{S'(z)\geq0\quad\hbox{and}\quad D(z)\leq0
        \quad\Longrightarrow\quad\mathcal W_\alpha(z)\geq0.} \tag{2}
\]

The implication is exact, division-free, and valid for every `alpha>0`.
The condition `D<=0` says that the positive cells have no larger Abel-tilted
mean index than the negative cells.  It admits an all-index stochastic-tail
certificate and a robust pairwise compensation certificate below.

A reproducible, explicitly non-rigorous probe of the actual complete cells
at the five proved low rungs finds `S'>0`, `D<0`, and the truncated
half-gauge expression positive at the sampled Abel parameters.  In
particular, the sufficient route `D>=0` is opposite to the observed
diagnostic geometry at these rungs; it remains a valid sufficient theorem.
The probe is a route selector only: it has neither interval
quadrature nor an analytic Ewald-index tail, and it does not prove (2) for an
Abel interval or uniformly in degree.

## 1. Exact reverse-order factorization

Retain the notation

\[
 P(z)=\sum_{i\geq1}a_i z^i,\qquad
 N(z)=\sum_{j\geq1}b_j z^j,\qquad a_i,b_j\geq0,                \tag{3}
\]

where `a_i=e_i^+`, `b_j=e_j^-`, `S=P-N`, `V=P+N`, and
`M=V(1)`.  Direct expansion of the audited hazard identity gives

\[
 \boxed{\mathcal W_\alpha=C(P'-N')-2(P'N-PN')
       =C S'-2D.}                                \tag{4}
\]

Equation (2) follows immediately from (4).  No seed is needed for the
pointwise implication (2); the seed `S(1/2)>=0` remains a separate
obligation of the bounded Abel lemma.

The signed-placement term has the pairwise form

\[
 \boxed{D(z)=\sum_{i,j\geq1}(i-j)a_i b_jz^{i+j-1}.}            \tag{5}
\]

Thus lower-index positive mass paired with higher-index negative mass makes
`D` negative and pays positively in (4).  This is precisely the placement
seen in the dominant actual cells below.  Formula (5) also yields the exact
regional compensation test

\[
 \sum_{i>j}(i-j)a_i b_jz^{i+j-1}
 \leq
 \sum_{i<j}(j-i)a_i b_jz^{i+j-1},               \tag{6}
\]

which is equivalent to `D(z)<=0`.  Unlike a cellwise sign condition, (6)
allows arbitrarily many sign changes.

## 2. Tilted stochastic-tail certificate

When `P(z)N(z)>0`, introduce the Abel-tilted index laws

\[
 p_z(i)={a_i z^i\over P(z)},\qquad
 n_z(j)={b_j z^j\over N(z)}.                    \tag{7}
\]

Then

\[
 \boxed{D(z)={P(z)N(z)\over z}
 \{\mathbb E_{p_z}I-\mathbb E_{n_z}J\}.}        \tag{8}
\]

Consequently first-order stochastic domination of the positive cell index
by the negative cell index is sufficient for `D<=0`.  A ratio-free version
is useful for rigorous orbit-tail estimates.  Put

\[
 A_k(z)=\sum_{i\geq k}a_i z^i,\qquad
 B_k(z)=\sum_{j\geq k}b_j z^j.                  \tag{9}
\]

The tail-sum formula for integer expectations gives

\[
 \boxed{-zD(z)=\sum_{k\geq1}
 \{P(z)B_k(z)-N(z)A_k(z)\}.}                   \tag{10}
\]

Therefore the all-index inequalities

\[
 \boxed{P(z)B_k(z)\geq N(z)A_k(z)
        \quad(k\geq1)}                          \tag{11}
\]

imply `D(z)<=0`.  A single exact sign cut (all positive indices below all
negative indices) is a special case, but (11) is strictly more flexible and
matches the odd-rung pattern, where a small positive tail follows a negative
middle block.

The other half of (2) is the correlated derivative-mass condition

\[
 \boxed{P'(z)\geq N'(z).}                       \tag{12}
\]

Equations (11)--(12), plus the separate seed, are thus a concrete
theta-specific continuation target.  They retain positive and negative
cells together instead of applying separate Cauchy estimates to the two
root-logarithmic bands.

## 3. The actual cells used by the probe

For the one actual residual `q`, the complete scalar cell is

\[
 e_n={1\over\pi}\int_{\mathbb R}
 q(t)^2\mathcal B(\Xi,E_n)(t)\,dt,
 \qquad
 E_n(t)={1\over2}\Re\{K(t)d_n(s)\},             \tag{13}
\]

where

\[
 s={1\over2}-it,\qquad
 K(t)=s(s-1)\pi^{-s/2}\Gamma(s/2),              \tag{14}
\]

\[
 d_n(s)=n^{-s}-{n^{1-s}-(n-1)^{1-s}\over1-s}.  \tag{15}
\]

For `n=1`, the second numerator in (15) is interpreted as `1`, giving
`d_1=1-(1-s)^(-1)`.  Formula (13), rather than a raw positive theta packet,
is what the probe evaluates.  Derivatives in `mathcal B` are taken only
after `K d_n` is assembled.

Equations (13)--(15) are the audited left-cell formulas (20), (23), and
(24) of `EWALD_WEIGHTED_PIVOT_NEXT.md`, with the same `1/pi` normalization;
the cross-Hardy normalization is independently restated as equations
(7)--(11) of `CROSS_HARDY_CELL_ORDER_NEXT.md`.  The endpoint check combines
the audited identity `sum e_n=mathfrak q(q)` from the former note with
`M_j=pi^(-1) integral t^(2j)(Xi'^2-Xi Xi'') dt`, equation (130) of
`H5_ASSEMBLED_SCHUR_NEXT.md`.  Thus the probe does not infer its endpoint
normalization from its own quadrature.

The five residuals are

\[
 t,\quad t^2-c_2,\quad t(t^2-c_3),\quad
 t^4+a_4t^2+b_4,\quad t(t^4+a_5t^2+b_5),        \tag{16}
\]

with their coefficients recomputed from midpoints of the archived signed
moment intervals using the required normalization `M_j=mu_j/4^j`.  The
floating endpoint consistency check uses the exact identity

\[
 \sum_{n\geq1}e_n={1\over\pi}\int_{\mathbb R}q(t)^2
 \{\Xi'(t)^2-\Xi(t)\Xi''(t)\}\,dt,              \tag{17}
\]

evaluated from those interval midpoints.  This checks numerical consistency;
it is not interval arithmetic and supplies no certified endpoint enclosure.

## 4. Low-rung route diagnostic

The frozen diagnostic uses 640 Gauss--Legendre nodes on `0<=t<=40`, 35
decimal digits for the special functions, and the first ten complete scalar
cells.  The leading cell patterns are:

| residual degree | first assembled cell signs | dominant placement |
|---|---|---|
| 1 | `+-++++++++` | positive first cell, negative second cell, small positive tail |
| 2 | `++--------` | positive cells 1--2, negative tail |
| 3 | `+--+++++++` | positive first cell, negative middle, positive tail |
| 4 | `+++-------` | positive cells 1--3, negative tail |
| 5 | `++--++++++` | positive cells 1--2, negative middle, positive tail |

At every sampled `z` in `{1/2,3/5,3/4,9/10,1}`, all five first-ten-cell
truncations have

\[
 S'_{[10]}(z)>0,\qquad D_{[10]}(z)<0,\qquad
 \mathcal W_{1/2,[10]}(z)>0.                                  \tag{18}
\]

The smallest displayed margins occur at degree one and `z=1/2`:

\[
 S'\approx0.32153,\qquad D\approx-0.06046,
 \qquad\mathcal W_{1/2}\approx0.70943.          \tag{19}
\]

An independent 480-node run on `0<=t<=36` changes the first eight cells by
at most approximately `1.9e-14`, `2.6e-13`, `1.8e-10`, `2.3e-7`, and
`2.9e-4` for degrees one through five respectively.  Relative to the
dominant cells these discrepancies are small.  This agreement is only a
floating convergence check, not an outward enclosure.

Both floating runs are frozen.  The primary 640-node receipt is
`results/actual_ewald_reverse_order_probe.json`; the comparison receipt is
`results/actual_ewald_reverse_order_probe_480.json`.  Their provenance is

```text
verifier SHA-256: 34286b65cd1ae998e239fe15a3a1049efc51e3796c6f7510b42ad4976a7804fa
640-node receipt SHA-256: d9694df04c4fbd3fd42ae985ff0ff368545fe33d2680c162f0b384098c107f49
480-node receipt SHA-256: bda43471783845177f64aaada4d8b5cdc77d72559f69654229c2ddfa895c49ca
```

The numerical finding changes the analytic priority: the stronger sufficient
condition `D>=0` is opposite to the observed low-rung diagnostic geometry.
A route matching that evidence is the reverse tilted order (11), together
with the derivative balance (12), or a direct proof of (1).  This observation
does not refute the earlier sufficient implication or prove the diagnostic
sign pattern beyond the sampled finite calculation.

## 5. Replay and limitations

From the checkpoint root, using the recorded Arb-enabled Python environment,
run

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/probe_actual_ewald_reverse_order.py \
  --checkpoint-root . \
  --output workstreams/all-degree-analytic-search-next-v1/results/actual_ewald_reverse_order_probe.json
```

For the frozen comparison run, add
`--nodes 480 --tmax 36` and write
`results/actual_ewald_reverse_order_probe_480.json`.

The output labels itself `PASS_DIAGNOSTIC_ONLY`.  In particular:

- no finite Ewald-cell list proves an interval or an endpoint sign;
- the displayed variation reserve uses the truncated list and has no
  interval tail enclosure;
- (11) and (12) are sufficient conditions, not established actual-theta
  theorems;
- the complete half-gauge hazard, an all-degree auxiliary, the first
  Xi--Laguerre inequality, and RH all remain open.

The next rigorous step is not a larger cell table.  It is an analytic
complete-orbit bound proving (11)--(12) from (13)--(15), with an all-index
tail controlled before any sign split.
