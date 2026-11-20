# Early P97 progress checkpoint — 28 August 2026

> **Status: this is not a proof of** \(\Lambda \le 0.14\).
>
> The late P19 mantle remains certified. The early mantle remains open. This
> note records the sharper reductions obtained after the 27 August execution
> ledger and keeps every global promotion flag false.

This is an isolated research note. It changes no MathExplorer route, page,
runtime dependency, build step, public asset, CI job, or deployment surface.

## Exact frontier

The endpoint remains

\[
T=\frac{33}{250},\qquad Y(T)^2=\frac{2}{125},\qquad
T+\frac{Y(T)^2}{2}=\frac7{50}=0.14.
\]

After the named Platt--Trudgian and Polymath imports and the completed late
P19 certificate, the open domain is

\[
0\le\lambda\le
\lambda_h=\frac{23514296330019}{500000000000000},
\qquad 690988\le N\le14999999,
\]

on the moving bottom and both closed vertical faces, including both lambda
endpoints and both one-sided charts at every selector seam.

~~~mermaid
flowchart TD
  A["Early mantle — OPEN"] --> B["Bottom smooth-tail gate — OPEN"]
  A --> C["Vertical-face gate — OPEN"]
  B --> D["All seams and endpoints"]
  C --> D
  D --> E["Global replay — FALSE"]
~~~

## New rigorous reductions

| Component | Exact result | Claim boundary |
|---|---|---|
| Selector event DAG | 57,948,135 quotient updates, 12,587,788 selector groups, and 514 width events; heap and independent dense algorithms agree | Does not enclose an analytic center |
| Endpoint coalescence | \(\max_N\sum_n|\kappa_N(n)|=8419\), first at \(N=1485959\) | Sharpens endpoint mass only |
| Directional center | \(R_{97}-E_{97}=A_{97}F_N^{(0)}\), with a rational half-plane support gate | Global centers and correlations remain open |
| Complementary collapse | Outside-core, scalar Euler, and reflected cross-chart terms are one coefficient vector; complete P97 seam jump is \(<1/34000\) | Transformed bulk and stationary center remain open |
| Vertical coefficient atlas | All 14,309,012 selectors, five closed blocks, both faces, all seams, and the terminal handoff; worst phase drift \(<5.737\times10^{-13}\) | Coefficient transport alone does not imply nonvanishing |
| Vertical lifting theorem | Primary transport is a convex combination of bottom prefixes; reflected transport is a convex combination of zero and bottom suffixes | The required cumulative supports are not certified |

The event-DAG trust root is
'9425c6de638f647960892c5f14c503f87ccc7f8042acf9894a2f76022e03399a'.
The directional-center trust root is
'd2e0fc5215c0fa42cebadae84a5f59e72d2f37eabc8561ca6bd1496ea51c30d7'.
The vertical-atlas trust root is
'af46389f3710e996ef13ac230931a21ba56e1dd9443e15b72f2d58887179b298'.
The complementary-term theorem SHA-256 is
'08704eb3833411a2e2d62be42ae9b4c41f5e1cad3385d95732af18cdcc3b1386'.

## Branch-free P97 bottom reduction

Put

\[
b_n=\exp\!\left(\frac t4\log^2n\right),\qquad
D_M(s)=\sum_{n\le M}b_n n^{-s},
\]

\[
A_{97}(s)=\prod_{p\le97}(1-b_pp^{-s}),\qquad
s_A^{(0)}=\overline{s_B}-y.
\]

The multiplied approximant splits exactly as

\[
A_{97}(s_B)\{D_N(s_B)+\gamma D_N(s_A^{(0)})\}
=P_{100}+T_{100,N},
\]

where \(P_{100}\) contains the first 100 terms and

\[
T_{100,N}=A_{97}(s_B)\{(D_N-D_{100})(s_B)
+\gamma(D_N-D_{100})(s_A^{(0)})\}.
\]

Directed finite Euler coalescence at 160, 192, and 256 bits gives

\[
\Re P_{100}>0.26842844879751026.
\]

Together with the complete transfer \(<1/50000\), the single uniform estimate

\[
\boxed{|T_{100,N}|<\frac14}
\]

would leave support \(>0.0184084487975\) and certify the complete early
bottom. After the finite prefix is proved, this route contains no rough mask
or retained-divisor defect.

### Diagnostic evidence only

Across 519 dense hard-selector rows, ordinary binary128/long-double sampling
found

\[
\max|T_{100,N}|=0.073519256573305145.
\]

A further 516 dense rows had maximum \(0.06674066118046823\), and a broad
113-row selector atlas had maximum \(0.04068295291458760\). The smallest
sampled full support was

\[
\min\Re(A_{97}F_N^{(0)})=0.80028092846171528.
\]

These values give about \(0.17648\) sampled slack against the quarter-tail
gate. They do not cover the continuum and carry no proof status.

## Smaller P7 candidate

A systematic finite-prefix sweep found a promising alternative using only
the primes \(2,3,5,7\) and splitting at \(n=10\). The selected directed
prefix computation gives

\[
\Re P_{7,10}>0.43578458.
\]

If an A7-specific source binding proves the complete transfer \(<1/50000\),
then

\[
|T_{7,10,N}|<\frac25
\]

would leave reserve \(>0.03576458\). This normalization uses only 16 Euler
divisors. Dense diagnostics found a maximum sampled tail about
\(0.2488498652\), but that number is not an interval bound.

This candidate is still under audit. In particular, the A97 transfer headline
cannot simply be reused for A7; the source must expose the factorized positive
Euler majorant, multiplier nonvanishing, denominator-positivity gates, and
cross-precision transcript binding.

## Vertical conclusion and no-go

Positive support of the complete bottom aggregate does **not** lift by itself.
The vertical package gives an exact two-atom counterexample which is positive
at the bottom and cancels at an interior height.

For fixed bottom atoms \(z_n^+\) and \(z_n^-\), define

\[
P_k=\sum_{n\le k}z_n^+,\qquad Q_k=\sum_{n\ge k}z_n^-.
\]

The coefficient atlas gives decreasing positive primary weights \(a_n\) and
increasing positive reflected weights \(b_n\). Abel summation yields

\[
\sum_na_nz_n^+
=\sum_{k<N}(a_k-a_{k+1})P_k+a_NP_N,
\]

\[
\sum_nb_nz_n^-
=b_1Q_1+\sum_{k=2}^N(b_k-b_{k-1})Q_k.
\]

Thus the order-only lifting datum is primary-prefix and reflected-suffix
support, not the final bottom total. The quantitative conditional gate is

\[
L_{\rm rem}+\frac{\sigma_+}{1024}+\frac{\sigma_-}{200000}
-\frac{117}{10^{15}}M_+
-\frac{574}{10^{15}}M_-
-\rho-T>0.
\]

Dense diagnostics found negative reflected suffix support near \(-0.205\) in
the fixed \(u=1\) direction for the simple P7, P5, and P19 normalizations.
Consequently the present order-only lift does not close the faces. The active
vertical route is an independent, height-tiled prefix-plus-tail certificate;
sampled tail moduli decrease rapidly away from the moving bottom.

## Scalable endpoint architecture

For

\[
q=N^2+f(2N+1),\qquad n=N-h,
\]

the top endpoint phase has the exact normalization

\[
e(q\log(N-h))
=e(q\log N)(-1)^h e(-2hf)e(S_N(f,h)+R_4),
\]

\[
S_N=-\frac{h^3}{3N}
-f\left(\frac hN+\frac{(2N+1)h^2}{2N^2}
+\frac{(2N+1)h^3}{3N^3}\right).
\]

The derived full-range planner has carrier frequency at most 492, slow
\(f\)-slope at most \(0.0113631392601\), cubic remainder \(<1/30000\), and
398 \(N\)-cells after subdividing the 159 endpoint-width bands. Five moment
terms require 52,264,960 FFT grid slots.

This is a scalable plan for the **top endpoint packet only**, not a
certificate of the full smooth tail. The incomplete Riemann--Siegel/B-dual
interior, stationary and nonstationary remainders, the lower endpoint, bulk
curvature bands, interval amplitudes, and both seam charts remain open.

## Exact completion gates

The shortest current fail-closed program is:

1. certify either the P97 quarter-tail gate or the audited P7 two-fifths gate
   on every bottom chart;
2. certify both vertical faces independently, or supply a stronger signed
   Mellin lifting theorem than the failed order-only suffix condition;
3. charge every endpoint, half-jump, \(e_\kappa\), bulk, and analytic
   transfer term exactly once;
4. replay every cell, join, seam, and both lambda endpoints at nested
   precision; and
5. promote only if the source-bound assembler derives all terminal flags.

The terminal state remains

~~~text
P19_LATE_FAMILY_MANTLE_CERTIFIED true
CORRELATED_PREHANDOFF_MANTLE_CERTIFIED false
RAMP_BOTTOM_CERTIFIED false
RAMP_VERTICALS_CERTIFIED false
ALL_RAMP_SEAMS_CERTIFIED false
SWEPT_TUBE_NONVANISHING false
LAMBDA_LE_7_OVER_50 false
~~~

See [the original execution ledger](./EXECUTION_LEDGER.md) and
[evidence contract](./EVIDENCE.md) for the preceding checkpoint.
