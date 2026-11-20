# The following odd complete-theta two-generator rung

## Scope and outcome

This note treats only the complete-theta two-generator auxiliary at

\[
 (N,\epsilon)=(2,1),\qquad
 q(t)=t(t^4+a t^2+b)=t^5+a t^3+b t .
\]

There are three conclusions.

1.  The exact auxiliary numerator is an explicit bivariate polynomial
    `F(a,b)` of total degree eight in `(a,b)`, written below without
    splitting any correlated term.  If `q_d=(t^2-d)q_0`, then

    \[
      F[q_d]=d^8F[q_0]+O(d^7),\qquad
      \mathcal H[q_d]=d^2\mathcal H[q_0]+O(d).
    \]

    Thus the preceding rung controls coefficient escape but not the finite
    coefficient interior.
2.  For the **actual** signed residual, exact decimal endpoint parsing,
    the required correction `M_j=mu_j/4^j`, a complete first-three-orbit
    block, and one analytic tail containing every orbit `n>=4` prove

    \[
      A>0,\qquad \Delta>0,\qquad F>0,
      \qquad \mathcal H_{2,1}>0.
    \]

    The exact two-generator square identity then proves the actual fixed
    pivot `S_(2,1)>0`.
3.  Coefficient-free positivity is false, even if `q` is required to be
    real-rooted.  For the same complete-theta positive moments,

    \[
       q(t)=t(t^2-68)(t^2-13)
    \]

    has `A>0`, `Delta>0`, but `F<0`.  Hence the actual signed-residual
    arithmetic is essential; real-rootedness and positive Gram geometry do
    not yield an odd-parity induction.

This is a computer-assisted theorem for one fixed rung.  It is not an
all-degree Xi--Laguerre theorem and does not prove RH.

## 1. Normalization audit

The signed-moment source is

```text
evidence/v18-curated/full_split_audit/actual_total_certificate.json
sha256 06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536
scope  Full theta normalized a=0 full moments via reflected identity
```

Its archived entries are geometrically normalized:

\[
   \boxed{\mu_j=4^jM_j.}
\]

The residual equations use `M_j`, not `mu_j`.  The verifier therefore reads
each lower and upper decimal string as an exact rational endpoint, expands
the pair outward by the documented serialization guard

\[
  10^{-90}(1+|\mathrm{lower}|+|\mathrm{upper}|),
\]

and only then divides the whole padded interval by the exact integer `4^j`.
It never parses a rounded midpoint.  The normalization proof, its frozen
manifest, and the independent full-split audit are pinned by SHA-256 in the
receipt.  The resulting enclosures needed for the residual are

\[
\begin{array}{c|c}
j&M_j\\ \hline
1&[0.36927306476563221715\mathbin{+/-}6.73\,10^{-21}]\\
2&[12.8203922920237684739\mathbin{+/-}8.93\,10^{-20}]\\
3&[734.83801188093787486\mathbin{+/-}8.62\,10^{-18}]\\
4&[58871.16220813198815\mathbin{+/-}2.34\,10^{-15}].
\end{array}
\]

The positive spectral moments have a separate normalization.  Put

\[
 n_j=\int_0^\infty |\psi^{(j)}(h)|^2\,dh,
 \qquad
 m_j=\int_{\mathbb R}t^{2j}W(t)^2\,dt .
\]

With the campaign Fourier convention and evenness,

\[
   \boxed{m_j=4\pi n_j.}
\]

Consequently, under a common rescaling `m -> lambda m`,

\[
 A,B,C,D,E\mapsto\lambda(A,B,C,D,E),\quad
 \Delta\mapsto\lambda^2\Delta,\quad
 F\mapsto\lambda^4F,\quad
 \mathcal H\mapsto\lambda\mathcal H.
\]

For the computed half-line boxes this gives exactly

\[
  F[m]=(4\pi)^4F[n],\qquad
  \mathcal H[m]=4\pi\mathcal H[n].
\]

No factor from the signed archive is mixed with this Fourier/Plancherel
factor.

## 2. Exact residual and exact correlated numerator

The old odd signed block and its monic residual give

\[
 d_{\rm old}=M_1M_3-M_2^2,
\]

\[
 \boxed{
 a={M_2M_3-M_1M_4\over d_{\rm old}},\qquad
 b={M_2M_4-M_3^2\over d_{\rm old}}.}
\]

For arbitrary real `a,b`, direct polynomial integration against `W^2`
gives

\[
\begin{aligned}
A={}&9a^2m_2+6abm_1+30am_3+b^2m_0+10bm_2+25m_4,\\
B={}&6a^2m_2+6abm_1+26am_3+20bm_2+20m_4,\\
C={}&a^2m_3+2abm_2+2am_4+b^2m_1+2bm_3+m_5,\\
D={}&a^2m_4+2abm_3+2am_5+b^2m_2+2bm_4+m_6,\\
E={}&3a^2m_3+4abm_2+8am_4+b^2m_1+6bm_3+5m_5.
\end{aligned}
\]

Here

\[
 A=\int q'^2W^2,
 \quad B=\int qq''W^2,
 \quad C=\int q^2W^2,
 \quad D=\int t^2q^2W^2,
 \quad E=\int tqq'W^2.
\]

The exact Gram determinant, numerator, and sufficient remainder are

\[
 \boxed{\Delta=AD-E^2,}
\]

\[
 \boxed{
 F(a,b;m_0,\ldots,m_6)
 =\{AC+E(A-B)\}^2-(AD-E^2)(A^2-B^2),}
\]

\[
 \boxed{\mathcal H={F\over4A\Delta}.}
\]

These displayed formulas are the exact multivariate numerator: substituting
the five preceding quadratic polynomials produces a degree-eight polynomial
with 45 nonzero `(a,b)` monomials and no division.  Keeping this compact
form is important: it evaluates `AC+E(A-B)` and `AD-E^2` as correlated
objects instead of assigning independent boxes to their expanded pieces.

For an independent geometric audit, in the basis

\[
  (W,t^2W,t^4W,t^6W),\qquad G_{ij}=m_{i+j},
\]

put

\[
 d=(b,3a,5,0)^T,\qquad e=(0,b,a,1)^T.
\]

Then `A=d^TGd`, `E=d^TGe`, and `D=e^TGe`.  If `Y=qW'`, its four inner
products with the basis are

\[
 -{1\over2}
 \begin{pmatrix}
 5m_2+3am_1+bm_0\\
 7m_3+5am_2+3bm_1\\
 9m_4+7am_3+5bm_2\\
 11m_5+9am_4+7bm_3
 \end{pmatrix}.
\]

Their contractions are exactly

\[
   \langle q'W,Y\rangle=-{A+B\over2},\qquad
   \langle tqW,Y\rangle=-{C+2E\over2}.
\]

This recovers the same two-generator Schur complement and independently
checks every correlation in `F`.

## 3. Degree-uniform leading inheritance and its limit

Give `a` weight one and `b` weight two, as dictated by multiplication by a
new quadratic factor.  The top weighted piece of `F` is

\[
 \boxed{
   F_{\rm wt=16}=b^8m_0^2(5m_1^2-m_0m_2).}
\]

Thus the first-odd complete-theta gap is literally the far-`b` leading
coefficient.  More generally, for any fixed odd residual `q_0`, set

\[
    q_d=(t^2-d)q_0.
\]

Every one of `A,B,C,D,E` has leading term `d^2` times its old value, so exact
homogeneity gives

\[
 \boxed{
 F[q_d]=d^8F[q_0]+O(d^7),\qquad
 \mathcal H[q_d]=d^2\mathcal H[q_0]+O(d).}
\]

This is the degree-uniform pattern.  It controls only escape in a new
coefficient.  It cannot imply positivity on the compact coefficient
interior; Section 7 gives a strict complete-theta counterexample to such an
implication.

## 4. Complete-theta all-orbit enclosure

On `h>=0`, write the complete theta derivative expansion as

\[
 \psi^{(j)}(h)=\sum_{r\ge1}4e^{h/2}
 P_j(\pi r^2e^{2h})e^{-\pi r^2e^{2h}},
\]

with

\[
 P_0(z)=-3z+2z^2,
 \qquad P_{j+1}={P_j\over2}+2z(P_j'-P_j).
\]

The two new derivative polynomials are

\[
\begin{aligned}
P_5(z)={}&-{9375\over32}z+{142935\over16}z^2
          -{126121\over4}z^3+30510z^4\\
        &-10720z^5+1456z^6-64z^7,\\
P_6(z)={}&-{46875\over64}z+{1305165\over32}z^2
          -{445627\over2}z^3+{644791\over2}z^4\\
        &-173580z^5+39640z^6-3840z^7+128z^8.
\end{aligned}
\]

For each `0<=j<=6`, exact rational coefficient checks after the shift
`z=y+27` prove

\[
  0<(-1)^jP_j(z)<2^{j+1}z^{j+2}\qquad(z\ge27).
\]

The verifier evaluates all nine pairings among orbits `1,2,3` as exact
incomplete-gamma Arb expressions.  Every orbit `r>=4` is placed in one norm
tail.  The uniform tail ratio is justified by the exact inequality

\[
  \left({5\over4}\right)^{15}e^{-9\pi}<\frac12.
\]

If `s_j` is the norm of the first-three-orbit block and `T_j` the certified
norm tail, then

\[
  |n_j-s_j^2|\leq2s_jT_j+T_j^2.
\]

Thus cross-orbit signs are retained inside the exact block, while the
infinite remainder is bounded analytically rather than truncated.  At 300
Arb bits the resulting balls are

\[
\begin{array}{c|c}
j&n_j\\ \hline
0&[0.639503623923242570\mathbin{+/-}8.21\,10^{-19}]\\
1&[6.527774651285279\mathbin{+/-}4.39\,10^{-16}]\\
2&[191.637170858682\mathbin{+/-}2.63\,10^{-13}]\\
3&[8973.2636508026\mathbin{+/-}9.01\,10^{-11}]\\
4&[563481.204712\mathbin{+/-}3.14\,10^{-7}]\\
5&[43922895.960\mathbin{+/-}3.22\,10^{-4}]\\
6&[4132820626.2\mathbin{+/-}8.86\,10^{-2}].
\end{array}
\]

These are complete-source enclosures, not finite-orbit approximations.

## 5. The actual residual

After the `4^j` correction, the old determinant and actual coefficients are

\[
\begin{aligned}
d_{\rm old}&=[106.99342623217553294\mathbin{+/-}7.88\,10^{-18}],\\
a&=[-115.1343904510145197\mathbin{+/-}5.31\,10^{-17}],\\
b&=[2007.268091634418605\mathbin{+/-}9.57\,10^{-16}],\\
a^2-4b&=[5226.85549798898899\mathbin{+/-}5.39\,10^{-15}].
\end{aligned}
\]

Together with

\[
 M_1=[0.36927306476563221715\mathbin{+/-}6.73\,10^{-21}]>0,
\]

the positive determinant proves that the old odd `2 x 2` block is positive
definite, not merely invertible.  The quadratic in `t^2` has
two strictly positive real roots.  One correlated evaluation of the exact
formulas in Section 2 gives

\[
\begin{array}{c|c}
A&[3327730.25272\mathbin{+/-}6.52\,10^{-6}]\\
B&[-1708104.72585\mathbin{+/-}6.29\,10^{-6}]\\
C&[6867572.270\mathbin{+/-}2.29\,10^{-4}]\\
D&[3.74918212\,10^8\mathbin{+/-}9.97\,10^{-2}]\\
E&[14670778.258\mathbin{+/-}6.62\,10^{-4}]\\
\Delta&[1.032394942\,10^{15}\mathbin{+/-}6.64\,10^5]\\
F&[9.3689682\,10^{26}\mathbin{+/-}2.83\,10^{18}]\\
\mathcal H[n]&[68176.985\mathbin{+/-}3.53\,10^{-4}].
\end{array}
\]

Every lower endpoint used for the sign claim is strictly positive.  Interval
dependencies are not silently discarded: `(a,b)` are computed once as
correlated Arb expressions from the same `M_j` balls, and `F` is evaluated
as the combined expression in Section 2.  Ordinary interval arithmetic may
overestimate the range; a strictly positive lower endpoint remains a valid
certificate.

## 6. Strict implication for the actual pivot

The vectors `q'W` and `tqW` are linearly independent for nonzero polynomial
`q` and nontrivial `W`, so their Gram matrix has `A>0` and `Delta>0`.
The numerical balls above independently certify both strict inequalities.
Since `F>0`,

\[
  \mathcal H[n]={F[n]\over4A[n]\Delta[n]}>0.
\]

The scaling audit gives

\[
   \mathcal H[m]=4\pi\mathcal H[n]>0.
\]

Finally the exact two-generator identity is

\[
 2\pi\mathcal S_{2,1}
 =\min_{\alpha,\beta\in\mathbb R}
 \int_{\mathbb R}
 \{qW'+(\alpha q'+\beta tq)W\}^2dt
 +\mathcal H[m].
\]

The minimum is nonnegative and the second summand is strictly positive.
Therefore

\[
   \boxed{\mathcal S_{2,1}>0.}
\]

This implication uses the old signed moments only to build the residual; it
does not assume the target pivot.

## 7. Rigorous obstruction to coefficient-free positivity

Take

\[
 a=-81,\qquad b=884,
 \qquad q=t(t^2-68)(t^2-13).
\]

This is a real-rooted odd polynomial.  Evaluation against the same
complete-theta all-orbit balls gives

\[
\begin{array}{c|c}
A&[2987310.62593\mathbin{+/-}5.56\,10^{-6}]\\
\Delta&[8.82874314\,10^{14}\mathbin{+/-}4.81\,10^5]\\
F&[-9.780909\,10^{25}\mathbin{+/-}6.80\,10^{18}]\\
\mathcal H[n]&[-9271.286\mathbin{+/-}2.84\,10^{-4}].
\end{array}
\]

Thus exact real-algebraic positivity over all `(a,b)` is impossible, even
on the real-rooted region.  This does **not** say that the target pivot for
this arbitrary polynomial is negative: a negative two-generator remainder
only means that this sufficient auxiliary fails there.

The degree-uniform statement still needed is therefore theta-specific:

> For every actual odd signed residual `q_N` generated by the complete-theta
> moment recursion, prove the correlated inequality
> `F[q_N]>=0` (preferably strictly), using constraints on the joint residual
> coefficients supplied by the complete theta arithmetic.

The inherited `d^8F[q_{N-1}]` term handles coefficient escape.  The
counterexample proves that a proof of the compact interior must use more
than positive moment Hankel matrices, polynomial real-rootedness, and the
preceding rung.  A viable all-degree theorem must exploit a new uniform
orbit correlation or an equivalent signed-residual constraint.

## 8. Frozen replay and nonclaims

The bounded verifier uses Python `3.14.10`, python-flint `0.9.0`, 300-bit
Arb arithmetic, no network, seven fixed derivative orders, one exact
three-orbit block, and one analytic tail containing all `n>=4`.  It performs
no quadrature grid, coefficient sampling, finite-orbit substitution, or
degree sweep.

Replay from the checkpoint root with the installed Arb environment:

```text
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search-next-v1/src/verify_following_odd_theta.py \
  --root . \
  --precision-bits 300 \
  --output workstreams/all-degree-analytic-search-next-v1/results/following_odd_theta_verification.json
```

The receipt records the verifier, helper, signed-moment certificate,
normalization proof, manifest, and audit hashes, plus the exact replay
command.  It also stores a SHA-256 of canonical sorted compact JSON with the
`receipt_integrity` field omitted, so the substantive payload can be checked
independently of pretty-printing.  A PASS certifies only the actual `(2,1)` two-generator sufficient
condition and the stated auxiliary counterexample.  It does not certify a
higher rung, an induction, an all-degree theorem, Xi--Laguerre, or RH.
