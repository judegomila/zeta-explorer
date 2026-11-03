# The fixed \(U_3\) route: exact generic obstruction and theta-specific test

## Scope

Let

\[
 s=-q'W-2qW',\qquad A=\|q'W\|_2^2,
\]

and let

\[
 U_3(q)=\operatorname{span}\{q'W,tqW,t^2q'W\}.
\]

For polynomial generators \(r_i\), put

\[
 K_{ij}=\int_{\mathbb R}r_i r_jW^2,\qquad
 y_i=\langle s,r_iW\rangle
     =\int_{\mathbb R}q r_i'W^2.
\]

The exact projected auxiliary is

\[
 H_{U_3}=\frac14\left(y^{\mathsf T}K^\dagger y-A\right),
\]

where the pseudoinverse means that dependent polynomial generators are first
reduced to a maximal independent basis.  For the nonconstant rungs, where
\(A>0\), the dimensionless, falsifiable margin is

\[
 \boxed{\quad
 \mathfrak m_3(q,W)
   :=\frac{y^{\mathsf T}K^\dagger y}{A}-1.
 \quad}                                                     \tag{1}
\]

Thus \(H_{U_3}\geq0\) if and only if \(\mathfrak m_3\geq0\).  A fixed-\(U_3\)
all-degree theorem for the complete-theta residuals must prove

\[
 \inf_{\substack{\epsilon\in\{0,1\},\,N\geq0\\2N+\epsilon\geq1}}
 \mathfrak m_3(q_{\epsilon,N},W_\theta)\geq0.               \tag{2}
\]

A finite list of positive values does not prove (2).  Conversely, one
certified negative actual-theta value refutes only this fixed auxiliary route;
it does not refute positivity of the full Sobolev target and says nothing by
itself about RH.

This note proves an exact **source-free** countermodel to any attempt to get
(2) from positive-even-Schwartz geometry alone.  It is not an actual
complete-theta counterexample and is not an RH claim.

## Exact two-scale Gaussian countermodel

Take

\[
 q(t)=t,
 \qquad
 W(t)=e^{-t^2/2}+\frac1{100}e^{-t^2/800}.                    \tag{3}
\]

The weight is strictly positive, even, and Schwartz.  Since

\[
 q'=1,\qquad tq=t^2,\qquad t^2q'=t^2,
\]

the nominal three-generator space has rank two:

\[
 U_3=\operatorname{span}\{W,t^2W\}.
\]

Write

\[
 m_j=\int_{\mathbb R}t^{2j}W^2dt,
 \qquad
 s_0=\sqrt{\frac{800}{401}}<2.
\]

Expanding the square of (3) and using Gaussian moments gives the exact
closed forms

\[
 \begin{aligned}
 \frac{m_0}{\sqrt\pi}
   &=\frac{501}{500}+\frac{s_0}{50}=:a_0,\\
 \frac{m_1}{\sqrt\pi}
   &=\frac9{10}+\frac{s_0^3}{100}=:a_1,\\
 \frac{m_2}{\sqrt\pi}
   &=\frac{963}{4}+\frac{3s_0^5}{200}=:a_2.                 \tag{4}
 \end{aligned}
\]

For the rank-adapted basis \((1,t^2)\),

\[
 K=\begin{pmatrix}m_0&m_1\\m_1&m_2\end{pmatrix},
 \qquad y=\binom{0}{2m_1},
 \qquad A=m_0.
\]

Strict Cauchy--Schwarz gives \(D=m_0m_2-m_1^2>0\), and hence

\[
 y^{\mathsf T}K^{-1}y=\frac{4m_0m_1^2}{D},
\]

so the sign numerator of the projected margin is

\[
 D\,\mathfrak m_3=5m_1^2-m_0m_2.                           \tag{5}
\]

The sign in (5) is elementary, not numerical.  From \(s_0<2\),

\[
 a_1<\frac9{10}+\frac8{100}=\frac{49}{50},
 \qquad a_0>1,
 \qquad a_2>240.
\]

Therefore

\[
 5a_1^2<5<240<a_0a_2,
\]

and consequently

\[
 \boxed{\mathfrak m_3(q,W)<0.}                              \tag{6}
\]

The failure is not caused by a negative target.  Direct differentiation of
(3) gives

\[
 J:=\int_{\mathbb R}t^2W'(t)^2dt
  =\sqrt\pi\left(\frac{1503}{2000}
                 +\frac{3s_0^5}{80000}\right).             \tag{7}
\]

For \(q=t\), integration by parts yields

\[
 \|s\|_2^2-A=4J-2m_0
  =\sqrt\pi\left(
       \frac{501}{500}-\frac{s_0}{25}
       +\frac{3s_0^5}{20000}
    \right).                                                \tag{8}
\]

Again \(s_0<2\) proves the sign without numerics:

\[
 \frac{501}{500}-\frac{s_0}{25}
       +\frac{3s_0^5}{20000}
 >\frac{501}{500}-\frac{2}{25}
 =\frac{461}{500}>0.
\]

Thus

\[
 \boxed{
  8\pi\,\mathcal S[q]=\|s\|_2^2-A>0
  \quad\text{but}\quad
  H_{U_3}<0.
 }                                                          \tag{9}
\]

The Arb audit records

\[
 \mathcal S[q]>0.0667397,
 \qquad
 \mathfrak m_3<-0.9860628,
 \qquad
 H_{U_3}<-0.4501546.
\]

The wide separation is useful, but the proof is the exact algebra (4)--(9),
not floating-point evidence.

## Rank-safe denominator-free certificate

For a full-rank \(3\times3\) Gram matrix, define

\[
 N_3:=y^{\mathsf T}\operatorname{adj}(K)y-A\det K.          \tag{10}
\]

Since \(\det K>0\), \(N_3\) has the sign of \(H_{U_3}\).  If

\[
 K=\begin{pmatrix}K_2&k\\k^{\mathsf T}&d\end{pmatrix},
 \qquad y=\binom{y_2}{\eta},
\]

put

\[
 \begin{aligned}
 D_2&=\det K_2,\\
 D_3&=\det K=dD_2-k^{\mathsf T}\operatorname{adj}(K_2)k,\\
 \Delta&=\eta D_2-k^{\mathsf T}\operatorname{adj}(K_2)y_2,\\
 N_2&=y_2^{\mathsf T}\operatorname{adj}(K_2)y_2-AD_2.
 \end{aligned}
\]

Exact Schur algebra gives the polynomial identity

\[
 \boxed{D_2N_3=D_3N_2+\Delta^2.}                            \tag{11}
\]

When \(D_2,D_3>0\), (11) is the inverse-free repair test

\[
 \Delta^2\geq-D_3N_2.                                     \tag{12}
\]

It is preferable for interval certification: certify the polynomial feature
rank exactly, use (10) or (11), and never infer a sign from an ill-conditioned
floating-point inverse.  In coordinates

\[
 K=\begin{pmatrix}a&b&c\\b&d&e\\c&e&f\end{pmatrix},
 \quad y=(u,v,w)^{\mathsf T},
\]

(10) expands to

\[
\begin{aligned}
N_3={}&u^2(df-e^2)+v^2(af-c^2)+w^2(ad-b^2)\\
&+2uv(ce-bf)+2uw(be-cd)+2vw(bc-ae)\\
&-A(adf+2bce-ae^2-dc^2-fb^2).                             \tag{13}
\end{aligned}
\]

If the generators are dependent, as in (3), one must first use an independent
basis.  A zero or unresolved determinant is not evidence of a negative
margin.

## What the residual recurrence does and does not transfer

Let \(M=t^2\) and suppose the monic parity residuals obey

\[
 q_{N+1}=(M-\alpha_{N+1})q_N-\beta_{N+1}q_{N-1}.
\]

With \(a_N=q_N'\) and \(b_N=tq_N\), differentiation gives

\[
 \boxed{
 Ma_N=a_{N+1}+\alpha_{N+1}a_N-2b_N+\beta_{N+1}a_{N-1}.
 }                                                          \tag{14}
\]

Hence the new direction in \(U_3(q_N)\) is, modulo
\(\operatorname{span}\{a_N,b_N\}\), the two-sided combination

\[
 a_{N+1}+\beta_{N+1}a_{N-1}.                              \tag{15}
\]

This is a useful exact transfer identity, but it is not by itself a positivity
inequality.  The cross term between the forward and backward pieces in (15)
has no source-free sign.  A uniform proof still needs complete-theta control
of the correlated Gram/score combination in (11).

As a sanity check, the generic obstruction is not a claim that every simple
family fails.  For \(q=t^\kappa\), \(U_3\) again collapses to
\(\operatorname{span}\{t^{\kappa-1},t^{\kappa+1}\}\).  If
\(x=m_{\kappa-1},y=m_\kappa,z=m_{\kappa+1}\), direct inversion gives

\[
 \mathfrak m_3
 =\frac{4y^2/(xz-y^2)-(2\kappa-1)}{\kappa^2}.               \tag{16}
\]

For \(W^2=e^{-|t|^{2m}}\), gamma-ratio asymptotics give

\[
 \frac{y^2}{xz-y^2}=m\kappa+O(1),
 \qquad
 \mathfrak m_3=\frac{4m-2}{\kappa}+O(\kappa^{-2}).          \tag{17}
\]

Thus one-scale super-Gaussian monomials with \(m\geq1\) pass asymptotically.
The exact countermodel instead exploits a two-scale moment geometry.  This is
why it rules out a generic theorem but does not predict the complete-theta
sign.

## Protocol for an actual complete-theta falsifier

Any claimed negative actual-theta rung should pass all of the following:

1. Reconstruct the monic residual \(q_{\epsilon,N}\) from certified signed
   moments, rather than a midpoint-only coefficient vector.
2. Prove the polynomial rank of \(q',tq,t^2q'\) exactly.  If the rank is below
   three, reduce the basis before forming a determinant.
3. Use one consistent positive-moment normalization (full line or half line)
   for every entry of \(K,y,A\).  A common factor does not change the sign;
   mixing factors does.
4. Certify \(D_2>0,D_3>0\) and then certify the sign through (11), or certify
   (13) directly.  Do not rely on a midpoint matrix inverse.
5. Replay the source to a byte-identical receipt and separately verify archive
   hashes and the first omitted orbit/tail enclosure.

If a negative actual-theta \(N_3\) is certified, the remaining viable route is
not “increase the degree until it looks positive.”  One noncircular option is
an old-data adaptive dictionary.  Starting from a certified space \(U\), for
each polynomial candidate \(r_j\) form

\[
 \sigma_j=\|(I-P_U)r_jW\|^2,
 \qquad
 \delta_j=\langle s,(I-P_U)r_jW\rangle.
\]

Then select, using only \(q\), recurrence coefficients, and complete positive
moments,

\[
 j_*=\arg\max_j\frac{\delta_j^2}{\sigma_j}.                 \tag{18}
\]

Candidates such as \(t^3q\) and \(t^4q'\) are the next multiplication layers.
The exact gain is \(\delta_{j_*}^2/(4\sigma_{j_*})\).  This selection is
noncircular provided it uses no new signed pivot.  It remains only a strategy,
not a theorem: an all-degree result would have to prove a uniform lower bound
for (18) from complete-theta arithmetic.

## Reproduction

Run

```bash
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  src/verify_u3_source_free_countermodel.py \
  --output results/u3_source_free_countermodel.json
```

from this workstream directory.  The script uses 256-bit Arb balls and asserts
all signs appearing in (6) and (9).  It is a compact audit of the exact proof
above.  Two clean replays produced byte-identical receipts with SHA-256

```text
c96352f987a0b28030a13f3ff8596dbfd78fe2135ad65d852b7dc6b8869e35ef
```

and recorded script SHA-256

```text
17e28b177b718c829eeda01d28e4d4e4771c3745820597b57eec2daae226db44
```
