# Adaptive critical odd-half-grid literal-ceiling transfer theorem

## 0. Exact outcome and claim boundary

Assume RH.  Fix

\[
 {1\over2\pi}<D_-<D_+<{1\over2},\qquad
 \mathcal D=[D_-,D_+].                              \tag{0.1}
\]

For each sufficiently large dyadic height `Y`, take the same ordinate
`gamma=gamma_Y`, exact carrier height `t=gamma+delta_Y`, density `D`,
length `L`, and tangent filters `E,C` selected by the frozen
checkpoint-1.53 covariance theorem.  Thus

\[
 t={2\pi(N+1)\over L},\qquad
 \lambda=e^{L/2},\qquad
 |C|^2\geq c_1(\log L)^2|E|^2,\qquad
 |C|^2\geq c_2L^2(\log L)^2.                       \tag{0.2}
\]

This note proves that one can perturb the analytic parameters, while keeping
that same zero, to numbers `lambda',L',N',D'` for which

\[
 \boxed{
 \lambda'={p\over2}\quad(p\ \text{odd}),\qquad
 N'=\left\lceil D'(\lambda')^2L'\right\rceil,
 \qquad L'=2\log\lambda'.}                         \tag{0.3}
\]

The density is not prescribed: it varies with `Y` and satisfies

\[
 D'=D+O_{\mathcal D}(t^{-1/4}).                    \tag{0.4}
\]

At the primed parameters the tangent endpoint and same-zero row obey the
same two lower bounds as (0.2), with smaller uniform constants.  A fresh,
parameter-uniform application of the frozen critical scalar interface at
`(lambda',N')` uses

\[
 D_{N'}^{\rm act}=\sum_{\gamma'>0}\nu_{\gamma'}
 \left|{\sin(\gamma'L'/2)\over\gamma'}
 H_{N'}\!\left({\gamma'L'\over2\pi}\right)\right|^2. \tag{0.5}
\]

It therefore gives either the favorable zero-endpoint branch or

\[
 \boxed{
 {D_{N'}^{\rm act}\over |d_{N'}|^2}
 \gg_{\mathcal D}(\log L')^2,\qquad
 (\eta_{N'}^{\rm pr})^2
 =O_{\mathcal D}((\log L')^{-2})\longrightarrow0.} \tag{0.6}
\]

The construction is a literal critical-density ceiling on a strict
odd-half-grid.  It is not a fixed-`D` ceiling theorem: `D'=D'_Y` moves by
the amount in (0.4).  It is also not the old Gevrey literal ceiling
`ceil(lambda*L^3)`.  No value of the actual finite endpoint, row, or Gram
form is transported by continuity; indeed the two cutoffs can differ by
`O(t^(3/4))`.  The finite simple-ground, boundary, shifted-sign,
response-reserve, and strict-denominator gates remain open.

This is a narrow post-checkpoint-1.53 theorem pair.  It changes none of the
standard eight files, proves no unconditional zero statement, RH, converse
to RH, determinant convergence, or de Bruijn--Newman bound, and does not
complete the finite-gate program.  The formal state remains
`P0_INVALIDATED`.

## 1. Frozen checkpoint-1.53 inputs and external inequalities

Exactly the three checkpoint-1.53 note/test pairs `A,B,C` are imported.

| Dependency | SHA-256 |
|---|---|
| notes/ADAPTIVE_CRITICAL_EXACT_CARRIER_SHORT_ENDPOINT_COVARIANCE_THEOREM.md | b56bbe941bb9922be5701f17bd404192501c07c8a58e05ec9f58e126df384a1f |
| tests/test_adaptive_critical_exact_carrier_short_endpoint_covariance_theorem.py | b8724a4e439d3db445a8d92215a6cbee05e6c0d3bba0ce081f707aaace6c0a18 |
| notes/SUPERCRITICAL_FULL_SOURCE_ADAPTIVE_ABEL_TAIL_THEOREM.md | ddd9fe4132e43bbbf859b89192380b3c299f2d9e3acec528bdefe39bb0f2eece |
| tests/test_supercritical_full_source_adaptive_abel_tail_theorem.py | a3d6169ab083b6fa5ebdce9273c43639680ee2d9db2034d3de842703fb814371 |
| notes/CRITICAL_ARITHMETIC_TO_ACTUAL_SCALAR_TRANSFER_THEOREM.md | 8c453f25d75ab351a15faa65a8b7ce5eaaf96ba3b83043b4cdb037f5daa379d8 |
| tests/test_critical_arithmetic_to_actual_scalar_transfer_theorem.py | 6e313a0fdeb2db8f11721ce805ff02c60567d370ec4430b63e6a8faae3e00408 |

Pair `A` supplies the selected same zero, the exact unprimed critical
carrier, the global positive tangent filters, and (0.2).  Pair `B` supplies
the full-source tail uniformly for every real `lambda>1`, hence in
particular for strict half-integers.  Pair `C` supplies the exact finite
endpoint/row identities and a scalar interface whose estimates are uniform
when the density stays in a compact subset of `(1/(2*pi),1/2)`.

Two classical inequalities are used in their printed one-dimensional
forms.  Lemma 2 of P. Erdos and J. F. Koksma,
[*On the uniform distribution modulo 1 of sequences*](https://www.renyi.hu/~p_erdos/1949-11.pdf),
records the Erdos--Turan discrepancy inequality.  Lemma 2 of W. G. Nowak,
[*On Ramanujan sums over the Gaussian integers*](https://www.degruyterbrill.com/document/doi/10.2478/s12175-013-0131-4/pdf),
records the classical third-derivative test in exactly the form

\[
 \left|\sum_{n\in I}e(F(n))\right|
 \ll |I|\Delta^{1/6}+|I|^{1/2}\Delta^{-1/6},
 \quad \Delta\leq|F'''|\leq C\Delta.              \tag{1.1}
\]

Both sources are primary scholarly files, external and unvendored.  No
zero table, numerical producer, or external theorem about zeta zeros is
introduced.

## 2. The odd-`p` phase selector

Write

\[
 M=\lfloor t^{1/4}\rfloor,\qquad
 R=\lfloor t^{1/20}\rfloor,\qquad
 \Delta_t=t^{-1/25}.                               \tag{2.1}
\]

Let `p_0` be a nearest odd integer to `2*lambda`.  For
`1<=n<=M`, put

\[
 p_n=p_0+2n,\qquad
 f_t(n)={t\over\pi}\log {p_n\over2}.               \tag{2.2}
\]

The frozen critical schedule gives `lambda asymp_D sqrt(t)`.  Hence
`p_n asymp_D sqrt(t)` uniformly on this block, and direct differentiation
with respect to the real variable `n` gives

\[
 f_t'''(n)={16t\over\pi(p_0+2n)^3}
 \asymp_{\mathcal D}t^{-1/2}.                      \tag{2.3}
\]

For `1<=r<=R`, apply (1.1) to `F=r*f_t`.  If

\[
 S_r=\sum_{1\leq n\leq M}e^{2\pi i r f_t(n)},      \tag{2.4}
\]

then

\[
 |S_r|\ll_{\mathcal D}
 M(rt^{-1/2})^{1/6}
 +M^{1/2}(rt^{-1/2})^{-1/6}.                       \tag{2.5}
\]

Erdos--Turan applied to the one-sided interval
`I_t=[0,Delta_t)` gives

\[
 \left|\#\{n\leq M:\{f_t(n)\}\in I_t\}
       -\Delta_tM\right|
 \ll {M\over R}+\sum_{r\leq R}{|S_r|\over r}.    \tag{2.6}
\]

The three error exponents are exact:

\[
 {M\over R}\ll t^{1/5},\qquad
 M t^{-1/12}R^{1/6}\ll t^{7/40},\qquad
 M^{1/2}t^{1/12}\ll t^{5/24}.                    \tag{2.7}
\]

On the other hand

\[
 \Delta_tM=t^{21/100+o(1)},\qquad
 {21\over100}-{5\over24}={1\over600}>0.           \tag{2.8}
\]

Thus (2.6) has a positive left count for all sufficiently large `t`.
Choose one resulting odd `p=p_n`.  It satisfies

\[
 |p-2\lambda|=O(t^{1/4}),\qquad
 \left\|{t\over\pi}\log {p\over2}\right\|
 \leq t^{-1/25}.                                  \tag{2.9}
\]

The distance in (2.9) is not a hypothesis and no Diophantine subsequence
is assumed; it is the conclusion of the finite discrepancy argument at
each selected height.

## 3. Exact half-grid ceiling and half-cell

Define

\[
 \lambda'={p\over2},\qquad L'=2\log\lambda',
 \qquad h'={2\pi\over L'},
 \qquad m=\operatorname {nint}\!\left({tL'\over2\pi}\right). \tag{3.1}
\]

Because the fractional part selected in Section 2 lies in
`[0,Delta_t)`, the nearest integer is the lower integer.  Therefore, with

\[
 \epsilon=m-{tL'\over2\pi},                        \tag{3.2}
\]

one has `-Delta_t<epsilon<=0`.  Put

\[
 T'=mh'=t+h'\epsilon,\qquad
 N'=m-1,\qquad
 D'={m-3/2\over(\lambda')^2L'},\qquad
 c'=2\pi(\lambda')^2.                              \tag{3.3}
\]

Every relation in (3.3) is exact.  In particular

\[
 D'(\lambda')^2L'=m-{3\over2}=N'-{1\over2},
 \qquad
 \boxed{N'=\left\lceil D'(\lambda')^2L'\right\rceil}. \tag{3.4}
\]

The physical height also has the exact critical-density form

\[
 T'=D'c'+{3\pi\over L'}.                            \tag{3.5}
\]

The odd-grid displacement and the phase discrepancy give

\[
 L'-L=O_{\mathcal D}(t^{-1/4}),\qquad
 T'-t=O_{\mathcal D}(t^{-1/25}/L).                 \tag{3.6}
\]

Moreover, using `t/(2*pi*lambda^2)=D+O_D(t^(-1))`
from the frozen exact carrier construction,

\[
 D'=D+O_{\mathcal D}(t^{-1/4}),\qquad
 N'-N=O_{\mathcal D}(t^{3/4}).                    \tag{3.7}
\]

Let

\[
 \sigma={1\over2}\min\left\{
 D_- -{1\over2\pi},{1\over2}-D_+\right\}>0,
 \qquad
 \mathcal D^\sharp=[D_--\sigma,D_++\sigma].       \tag{3.8}
\]

Then `D' in mathcal D^sharp`, a fixed compact subset of
`(1/(2*pi),1/2)`, for all sufficiently large `Y`.

The zero remains at a half carrier cell.  Indeed the frozen shift is

\[
 \delta_Y={\pi\over\log(2Y/(2\pi))},\qquad
 t=\gamma+\delta_Y,                                \tag{3.9}
\]

so its primed coordinate is

\[
 x'={T'-\gamma\over h'}
 ={\delta_YL'\over2\pi}+\epsilon
 ={1\over2}+O_{\mathcal D}(L^{-1}).                \tag{3.10}
\]

Equivalently,

\[
 T'-\gamma={h'\over2}+O_{\mathcal D}(L^{-2}),
 \qquad
 |\sin(\gamma L'/2)|=1+O_{\mathcal D}(L^{-2}).    \tag{3.11}
\]

Thus the primed row has no carrier small divisor.

## 4. Stability of the normalized tangent filters

For `a(d)=pi/4-arcsin(d/2)/2`, write the normalized unprimed and
primed tangent weights as

\[
 w_k=e^{-a(D)kh},\qquad
 w'_k=e^{-a(D')kh'},\qquad k\geq0.                 \tag{4.1}
\]

Define

\[
 E'=\sum_{k\geq0}(-1)^kw'_kZ(T'+kh'),              \tag{4.2}
\]

and, with

\[
 Q(v;\gamma)=-{2\gamma\over\gamma^2-v^2},         \tag{4.3}
\]

define the same-zero row

\[
 C'=\sum_{k\geq0}(-1)^kw'_kZ(T'+kh')Q(T'+kh';\gamma). \tag{4.4}
\]

These are exactly the normalized tangent definitions of the frozen
covariance theorem at the primed data.  The corresponding unprimed
expressions are (4.2)--(4.4) with primes removed.

Under RH, Lindelof and Cauchy's formula imply, for every fixed
`varepsilon>0` and every fixed `B`,

\[
 \sup_{|u|\leq B\log t}
 \{|Z(t+u)|+|Z'(t+u)|\}
 \ll_{B,\varepsilon}t^\varepsilon.                \tag{4.5}
\]

For `0<=kh<=B log t`, (3.6)--(3.7) give

\[
 |(T'+kh')-(t+kh)|
 \ll_{B,\mathcal D}{t^{-1/25}\over L}
       +{k\,t^{-1/4}\over L^2},                  \tag{4.6}
\]

and the mean-value theorem applied to (4.1) gives the summed weight
variation

\[
 \sum_{kh\leq B\log t}|w'_k-w_k|
 \ll_{B,\mathcal D}L t^{-1/4}.                    \tag{4.7}
\]

The exact factorization at `v=t+kh=gamma+h(k+x)` gives, uniformly on
the same collar,

\[
 |Q(t+kh;\gamma)|\ll_{\mathcal D}{L\over k+1},
 \qquad
 |\partial_vQ(t+kh;\gamma)|
 \ll_{\mathcal D}{L^2\over(k+1)^2}.               \tag{4.8}
\]

Equations (4.5)--(4.8), termwise mean-value estimates, and geometric
summation yield

\[
 |E'-E|\ll_{\mathcal D,\varepsilon}
 t^{-1/25+\varepsilon}+L t^{-1/4+\varepsilon}=o(1), \tag{4.9}
\]

\[
 |C'-C|\ll_{\mathcal D,\varepsilon}
 L t^{-1/25+\varepsilon}+L t^{-1/4+\varepsilon}=o(1). \tag{4.10}
\]

For completeness, truncate first at `kh=B log t`.  The global positive
tangent weights and a polynomial zeta bound make both endpoint tails
`O(t^{-A})` after choosing `B=B(A,mathcal D)`; (4.8) gives the same for
the row tails.  This justifies (4.9)--(4.10) for the complete infinite
sums, not merely a finite prefix.

Because the old row has the absolute floor in (0.2), the additive
`o(1)` estimates are much smaller than both `|C|` and `|C|/log L`.
After decreasing the constants,

\[
 \boxed{
 |C'|^2\geq c'_1(\log L')^2|E'|^2,
 \qquad
 |C'|^2\geq c'_2(L')^2(\log L')^2.}               \tag{4.11}
\]

This is continuity only of the explicitly defined infinite tangent
filters.  It says nothing about continuity in the finite cutoff.

## 5. Fresh primed scalar interface

The hypotheses used by the frozen scalar interface can now be checked
directly at the primed point:

\[
 \begin{aligned}
 &\lambda'>1,\quad L'=2\log\lambda',\quad
 N'=m-1,\quad T'=mh',\\
 &D'\in\mathcal D^\sharp,\quad
 T'=D'c'+O(L^{-1}),\quad
 x'={1\over2}+O(L^{-1}),\quad
 m=O_{\mathcal D}(c'L').
 \end{aligned}                                      \tag{5.1}
\]

The local critical Mellin connection, retuned Laurent bridge, exterior
finite identities, and full-source Abel bounds imported by pair `C` are
uniform on the fixed compact `mathcal D^sharp`.  Pair `B` explicitly
requires no integer, half-integer, rational, or Diophantine condition on
`lambda`, so it applies to `lambda'=p/2`.  The half-cell estimate (3.10)
makes every carrier-safe row bound uniform.

Consequently one reruns the scalar comparison of pair `C`, from its exact
finite identities onward, with every symbol replaced by its primed
counterpart.  There are primed tangent scale `A'_0>0`, exact
`q'_m=-2(-1)^m/sqrt(L')`, and errors satisfying

\[
 R'_e=o(|q'_m|A'_0),\qquad
 R'_c=o(|q'_m|A'_0),                               \tag{5.2}
\]

such that

\[
 \boxed{d_{N'}=-q'_mA'_0E'+R'_e,}                 \tag{5.3}
\]

\[
 \boxed{
 {\sin(\gamma L'/2)\over\gamma}
 H_{N'}\!\left({\gamma L'\over2\pi}\right)
 ={q'_mA'_0\over2}\sin(\gamma L'/2)C'+R'_c.}     \tag{5.4}
\]

This is a fresh parameter-uniform reapplication, not a continuity
argument for finite endpoint data.  In particular, (3.7) rules out any
claim that `d_(N')` is close to `d_N` merely because `L'-L=o(1)`.

The absolute row floor in (4.11) absorbs (5.2), exactly as in the frozen
one-cutoff proof.  If `d_(N')` is nonzero, the selected zero contributes

\[
 D_{N'}^{\rm act}\geq
 \left|{\sin(\gamma L'/2)\over\gamma}
 H_{N'}\!\left({\gamma L'\over2\pi}\right)\right|^2
 \gg_{\mathcal D}(\log L')^2|d_{N'}|^2.           \tag{5.5}
\]

If `d_(N')=0`, (5.4) and (4.11) show that the displayed row is nonzero,
which is the favorable zero-endpoint branch.  The frozen bounded
zero-sampling constant then gives (0.6).

No second cutoff is appended, and no Hilbert two-cutoff transfer is used.

## 6. Quantifier ledger and stopping point

For each sufficiently large dyadic `Y`, the order of choices is:

\[
 Y\longmapsto(\gamma,t,L,D,E,C)
 \longmapsto p\longmapsto(\lambda',L',m,N',D')
 \longmapsto(E',C')\longmapsto(d_{N'},D_{N'}^{\rm act}). \tag{6.1}
\]

The density `D'_Y` is an output, not a fixed input.  What is now proved is
the simultaneous strict odd-half-grid and varying-density critical ceiling
in (0.3), together with the RH-conditional scalar conclusion (0.6).

The following statements remain unproved:

1. the same literal ceiling with one prescribed fixed `D`;
2. the old Gevrey ceiling `N=ceil(lambda*L^3)`;
3. any intersection with the finite simple-even, boundary, shifted-sign,
   response-reserve, or strict-denominator gates;
4. continuity of actual finite endpoint or Gram data across the
   `O(t^(3/4))` cutoff displacement;
5. any unconditional zero theorem, RH proof or converse, determinant
   convergence, or de Bruijn--Newman bound.

Thus this theorem repairs precisely the critical half-grid/literal-ceiling
quantifier with a varying density.  It does not close the remaining finite
zeta-specific gates.  The formal state is still `P0_INVALIDATED`.
