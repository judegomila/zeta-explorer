# The H5 ratio-average ordering and its remaining signed payment

## Scope and result

This note continues the exact odd-H5 wedge criterion in
`REGIONAL_ANGULAR_BUDGET_NEXT.md`.  It proves that the actual complete-theta
ratio

\[
 \mathcal R_5(h)=\frac{c_4(h)}{c_3(h)}
\]

is strictly increasing for every \(h>0\).  The proof is analytic at the
center and on the outer half-line, with a complete-theta interval enclosure
on the intervening compact set.  No finite theta truncation is assumed.

Consequently every nontrivial core--tail split has strict projective
ordering after the exact global old-block whitening.  Moreover, at least one
cutoff has equal whitened core and tail masses.  Thus H5 admits a
source-adapted split with both a positive angular gap and exact mass balance.

This does not by itself pay the signed scalar-anchor remainder.  At a
balanced cutoff, the remaining sufficient inequality becomes an explicit
combined \(c_5\) budget.  A tempting reduction to a core-only budget loses
the actual positive tail reserve and fails a finite diagnostic.
Monotonicity of \(c_4/c_3\) cannot control the newest diagonal without an
additional theta identity.  Nothing below is an all-degree extension or an
RH claim.

## 1. Exact derivative target

Let \(\ell=\log\psi\) and use the audited variables

\[
 X=-\ell'',\qquad Y=\ell^{(4)},\qquad
 Z=-\ell^{(6)},\qquad W=\ell^{(8)}.                 \tag{1}
\]

The normalized pointwise moments needed here are

\[
 C=\mu_3=2Z+60XY+120X^3,                           \tag{2}
\]

\[
 D=\mu_4
 =2W+112XZ+140Y^2+1680X^2Y+1680X^4.              \tag{3}
\]

Since \(c_k=\psi^2 4^{-k}\mu_k\),

\[
 \boxed{\mathcal R_5=\frac{D}{4C}.}                \tag{4}
\]

Pointwise H3 gives \(C>0\), so this quotient has no singularity.  Its
derivative has the exact sign target

\[
 \boxed{
 \mathcal R_5'
 =\frac{\mathcal N}{4C^2},\qquad
 \mathcal N=D'C-DC',}                              \tag{5}
\]

where

\[
 C'=2Z'+60(X'Y+XY')+360X^2X',                     \tag{6}
\]

\[
 D'=2W'+112(X'Z+XZ')+280YY'
 +3360XX'Y+1680X^2Y'+6720X^3X'.                  \tag{7}
\]

Thus the desired spatial ordering is not inferred from raw-coordinate
separation; it is proved for the actual Bell ratio before inserting it into
the \(A^{-1}\) wedge formula.

## 2. The modular center is a strict minimum

Evenness of \(\psi\) makes \(X,Y,Z,W\), and hence \(\mathcal R_5\), even.
Therefore

\[
 \mathcal R_5'(0)=0.                               \tag{8}
\]

Put \(V=-\ell^{(10)}\).  At the center, all odd log derivatives vanish and

\[
 C''=-2W-60Y^2-60XZ-360X^2Y,                      \tag{9}
\]

\[
 D''=-2V-392YZ-112XW-3360XY^2
     -1680X^2Z-6720X^3Y.                          \tag{10}
\]

The fifth normalized moment is

\[
 \mu_5=2V+180XW+840YZ+5040X^2Z+12600XY^2
       +50400X^3Y+30240X^5.                       \tag{11}
\]

Equations (2), (3), and (11) recover \(X,Y,Z,W,V\) successively from the
audited center intervals for \(\mu_1,\ldots,\mu_5\).  Exact rational interval
propagation through

\[
 \mathcal R_5''(0)=\frac{D''C-DC''}{4C^2}          \tag{12}
\]

gives

\[
 \boxed{\mathcal R_5''(0)>1105.}                   \tag{13}
\]

The central value is about \(1105.9880908926\).  The strict lower bound, not
the decimal, is the result.  It uses the already enclosed infinite
theta-index tail in the pointwise H5 center certificate.

Away from the center, the quotient second derivative used below is the
exact identity

\[
 4C^3\mathcal R_5''
 =D''C^2-DC''C-2D'CC'+2D(C')^2.                   \tag{12a}
\]

## 3. Complete-theta compact monotonicity certificate

The center inequality can be extended with the same full-theta derivative
representation used in the audited H4/H5 proofs:

\[
 \psi^{(j)}(h)=4e^{h/2}
 \sum_{n\ge1}P_j(n^2z)e^{-n^2z},\qquad
 z=\pi e^{2h},                                    \tag{14}
\]

\[
 P_0(z)=2z^2-3z,\qquad
 P_{j+1}=\tfrac12P_j+2z(P_j'-P_j).                 \tag{15}
\]

The enclosure keeps \(n\le6\) exactly.  Through derivative order \(11\), the
omitted part of the \(k\)-th ordinary \(z\)-derivative is bounded by

\[
 2\,7^{2k+4}(2z+2k)e^{-48z}.                       \tag{16}
\]

The successive-term ratio is below one half on the entire domain.  Ordinary
derivatives of the exact tail ratio and of its logarithm are recovered by
the product and logarithmic recurrences.  Each log derivative is evaluated
at the cell midpoint and enlarged by the mean-value bound

\[
 \operatorname{rad}(z)\,
 \sup_{\rm cell}\left|\frac{\ell^{(k+1)}}{2z}\right|. \tag{17}
\]

All cells are closed and all operations are outward interval operations.
The completed check has two overlapping parts.

1. On \(0\le h\le3/25\), use \(600\) cells of width \(1/5000\) and evaluate
   the exact quotient second derivative, retaining log derivatives through
   order \(10\).  Every cell gives

   \[
   \boxed{\mathcal R_5''(h)>416.9798371809.}        \tag{18}
   \]

   Together with (8), this proves \(\mathcal R_5'(h)>0\) for
   \(0<h\le3/25\).

2. Enclose \(\mathcal N=D'C-DC'\) and \(C\) on the following rational
   \(z\)-cells:

   \[
   \begin{array}{c|c|c|c}
   z\text{ range}&\text{width}&\text{cells}
      &\text{minimum lower bound for }\mathcal N\\ \hline
   [15/4,5]&1/400&500&1.5808148581\cdot10^{14}\\
   [5,8]&1/200&600&7.3286799415\cdot10^{14}\\
   [8,16]&1/100&800&1.4019447401\cdot10^{16}\\
   [16,32]&1/50&800&1.6760999218\cdot10^{18}
   \end{array}                                      \tag{19}
   \]

   The lower endpoint of \(C\) is positive on every cell.

There is overlap: using \(\pi>25/8\) and
\(e^{6/25}>1+6/25+(6/25)^2/2\), the endpoint \(h=3/25\) has
\(z>15/4\).  Hence (18)--(19) prove

\[
 \boxed{
 \mathcal R_5'(h)>0
 \quad\text{for }0<h\text{ and }z\le32.}           \tag{20}
\]

This is a computer-assisted compact theorem, not a grid plot: the full theta
tail, every point of every cell, and the modular endpoint are enclosed.
The interval base and recurrence are the same ones used in the independently
audited finite H4/H5 certificates.  An independent in-memory reconstruction
and replay of this new quotient calculation passed, including all four
compact covers.  The deterministic frozen Arb replay described in Section 8
now persists those covers and their complete-theta tail bounds.

## 4. Analytic outer monotonicity

For \(z\ge32\), the audited analytic theta-tail argument gives

\[
 X\ge127,\quad X'>X,\quad |X'|<3X,                 \tag{21}
\]

\[
 |Y|<5X,\quad |Z|<17X,\quad |W|<90X,              \tag{22}
\]

\[
 |Y'|<9X,\quad |Z'|<33X,\quad |W'|<150X.          \tag{23}
\]

For completeness, the odd-derivative bounds follow from

\[
 \ell^{(k)}
 =-2^kz-(-2)^k\sum_{m\ge1}m^{k-1}t^m+q^{(k)},
 \qquad t=\frac3{2z},\quad |q^{(k)}|<1,            \tag{24}
\]

and the already audited geometric sums.  For example,
\(8\sum m^2t^m<1\), \(32\sum m^4t^m<5\),
\(128\sum m^6t^m<84\), and
\(512\sum m^8t^m<5159/2\).  Also
\(X<4z+2\), which gives \(X'>8z-2>X\).

Exact expansion of (5) isolates

\[
 \mathcal N=201600X^6X'+\mathcal E.                \tag{25}
\]

The remaining polynomial is

\[
\begin{aligned}
\mathcal E={}&100800X^5Y'+100800X^4YX'+10080X^4Z'\\
&+33600X^3YY'-13440X^3ZX'+240X^3W'\\
&+50400X^2Y^2X'+3360X^2YZ'-3360X^2ZY'-720X^2WX'\\
&+8400XY^2Y'+6720XYZX'+120XYW'-120XWY'\\
&-8400Y^3X'-280Y^2Z'+560YZY'-120YWX'\\
&+224Z^2X'+4ZW'-4WZ'.
\end{aligned}                                      \tag{26}
\]

Substitution of (21)--(23), retaining the exact integer coefficients, gives

\[
 |\mathcal E|\le18006648X^6.                       \tag{27}
\]

Therefore

\[
 \mathcal N
 >X^6(201600X-18006648)
 \ge7596552X^6>0.                                  \tag{28}
\]

Combining (5) and (28),

\[
 \boxed{\mathcal R_5'(h)>0\qquad(z\ge32).}         \tag{29}
\]

Equations (20) and (29) prove the global monotonicity theorem

\[
 \boxed{
 \mathcal R_5(0)<\mathcal R_5(h_1)
 <\mathcal R_5(h_2)
 \quad(0<h_1<h_2).}                                \tag{30}
\]

## 5. Strict regional projective ordering

Set

\[
 \omega(h)=2h^2c_3(h)>0.                           \tag{31}
\]

For \(C_H=[0,H]\), \(T_H=(H,\infty)\), define

\[
 m_E=\int_E\omega(h)\,dh,\qquad
 \overline{\mathcal R}_{E}
 =\frac1{m_E}\int_E\omega(h)\mathcal R_5(h)\,dh.   \tag{32}
\]

Strict monotonicity gives the exact identity and sign

\[
\boxed{
 m_Cm_T(\overline{\mathcal R}_T-\overline{\mathcal R}_C)
 =\int_0^H\int_H^\infty
 \omega(h)\omega(k)
 [\mathcal R_5(k)-\mathcal R_5(h)]\,dk\,dh>0.}     \tag{33}
\]

Thus

\[
 \overline{\mathcal R}_C<\mathcal R_5(H)
 <\overline{\mathcal R}_T.                         \tag{34}
\]

The regional borders are

\[
 b_E=m_E\binom{1}{\overline{\mathcal R}_E}.         \tag{35}
\]

Let \(A>0\) be the complete old odd-H3 block and put

\[
 q_E=b_E^*A^{-1}b_E,\qquad
 g_{C,T}=b_C^*A^{-1}b_T.                           \tag{36}
\]

The exact globally whitened Gram determinant is

\[
\boxed{
 q_Cq_T-g_{C,T}^2
 =\frac{m_C^2m_T^2
  (\overline{\mathcal R}_T-\overline{\mathcal R}_C)^2}
 {\det A}>0.}                                      \tag{37}
\]

Hence every nontrivial core--tail split has a strictly positive angular
separation in the actual \(A^{-1}\) metric.  No condition number estimate
or raw-coordinate angle is substituted for (37).

## 6. A mass-balanced source-adapted cutoff

Let

\[
 a_C(H)=\sqrt{q_C(H)},\qquad
 a_T(H)=\sqrt{q_T(H)}.                             \tag{38}
\]

Both are continuous.  Since the complete border \(b\ne0\),

\[
 a_C(0)=0,\quad a_T(0)=\|A^{-1/2}b\|>0,
\]

\[
 \lim_{H\to\infty}a_C(H)=\|A^{-1/2}b\|,\quad
 \lim_{H\to\infty}a_T(H)=0.                        \tag{39}
\]

The intermediate value theorem gives at least one finite \(H_*>0\) with

\[
 \boxed{a_C(H_*)=a_T(H_*)=:a>0.}                  \tag{40}
\]

By (37), its angle satisfies \(\delta_*>0\).  The exact scalar-anchor
covariance and the wedge lower bound are

\[
 \Gamma_*=2\delta_*a^2,                            \tag{41}
\]

\[
\boxed{
 \Gamma_*\ge
 \frac{m_C^2m_T^2
  (\overline{\mathcal R}_T-\overline{\mathcal R}_C)^2}
 {\det(A)\,a^2}>0,}                                \tag{42}
\]

with every quantity in (42) evaluated at \(H_*\).  This proves existence of
an actual-theta H5 partition having both strict projective separation and
perfect whitened mass balance.

## 7. The exact signed remainder still missing

At the balanced cutoff, \(L=a_C+a_T=2a\), so the optimized scalar-anchor
identity is

\[
\boxed{
 \mathcal S
 =[d_C-2a^2]+[d_T-2a^2]+2\delta_*a^2.}            \tag{43}
\]

Using only the proved wedge bound, a sufficient inequality is

\[
\boxed{
 d_C+d_T-4a^2+
 \frac{m_C^2m_T^2
  (\overline{\mathcal R}_T-\overline{\mathcal R}_C)^2}
       {\det(A)\,a^2}\ge0.}                        \tag{44}
\]

This keeps the signed regional diagonal terms.  It does not replace them by
absolute values.

At H5 there is one further audited input.  The old pointwise H3 block is
positive, so \(A_C,A_T>0\), and the cumulative H5 tail theorem gives
\[
 M_T=\begin{pmatrix}A_T&b_T\\b_T^*&d_T\end{pmatrix}\succeq0.
\]
Since \(A=A_C+A_T\succeq A_T\),

\[
 d_T\ge b_T^*A_T^{-1}b_T
      \ge b_T^*A^{-1}b_T=a^2.                     \tag{45}
\]

Consequently the following single-core inequality would be sufficient:

\[
\boxed{
 d_C-3a^2+
 \frac{m_C^2m_T^2
  (\overline{\mathcal R}_T-\overline{\mathcal R}_C)^2}
       {\det(A)\,a^2}\ge0.}                        \tag{46}
\]

This reduction is valid but too lossy to be the preferred remaining lemma.
An exploratory full-theta quadrature at the balanced cutoff finds, in the
normalization of (1)--(7),

\[
 H_*\simeq0.32871,\quad
 \delta_*\simeq0.03686,\quad
 a^2\simeq1.3507\cdot10^6.                         \tag{47}
\]

It gives a positive tail scalar-anchor remainder, a negative core
scalar-anchor remainder, and a positive wedge payment; together the
left-hand side of (44) is about \(8.1\cdot10^5\).  In contrast, the
left-hand side of the coarser condition (46) is about
\(-1.3\cdot10^6\).  These floating values are discovery diagnostics, not
proof evidence.  They reject the plan of replacing the actual tail
remainder by only the generic lower bound (45).

Equation (44) is a valid sufficient condition with both signed regional
remainders retained.  The subsequent exact audit in
`H5_SIGNED_C5_PAYMENT_NEXT.md` shows that it is nevertheless stronger than
the true H5 pivot by the explicit positive loss `delta_*^2 a^2`.  The sharp
live target should therefore retain the exact regional inner product rather
than the wedge lower bound.  Its newest core term is

\[
 d_C=2\int_0^{H_*}h^2c_5(h)\,dh,                  \tag{48}
\]

which is not controlled by monotonicity of \(c_4/c_3\).

This limitation is algebraically sharp.  Holding \(A\), all regional
borders, their ratio ordering, and their masses fixed while decreasing a
regional \(d_j\) leaves (30)--(42) unchanged but makes the Schur pivot
arbitrarily negative.  Such a modification is not asserted to be another
theta profile; it proves that projective ordering and mass balance alone
cannot replace a theta-specific \(c_5\) estimate.

## 8. Nonclaims and provenance

- The global monotonicity theorem is an H5 statement only.
- The compact part (18)--(20) is a new computer-assisted interval result.
  The frozen replay below passed; the outer proof (21)--(29) remains analytic.
- The first theta orbit is individually monotone, but it cannot prove the
  center result by a uniformly small perturbation: modular cancellation
  forces the actual derivative to vanish at \(h=0\), whereas the isolated
  first-orbit derivative there is strictly positive.
- Equations (33)--(42) prove projective ordering and existence of a balanced
  cutoff, not the signed payment (44).  The values in (47) are explicitly
  non-rigorous diagnostics.
- No endpoint spectral sign, all-degree Hankel positivity, or RH conclusion
  is claimed.

The center moment intervals come from
`evidence/v18-curated/h4_attack_v1/pointwise_h5_obstruction.json`.
The complete-theta derivative and tail bounds are those of the independently
audited H4/H5 pointwise certificates.  The cumulative tail input in (45) is
`evidence/v18-curated/integrated_h5_v1/SPATIAL_TAIL_PROPAGATION.md`.

The compact replay is frozen as
`src/certify_h5_ratio_compact.py` and
`results/h5_ratio_compact_arb.json`.  It uses 256-bit Arb, one internal
thread, six explicit theta orbits, a rigorous geometric tail from orbit 7,
and 3,300 closed cells.  A twelfth-order Taylor remainder in the spatial
variable controls the large cancellations in the four rational \(z\)-covers.
Theta derivatives are enclosed through order 22, supplying stabilized log
derivatives through order 21.  Its strict lower bounds are


| cover | certified lower bound |
|---|---:|
| \(0\le h\le3/25\), \(\mathcal R_5''\) | `442.5339125145...` |
| \(15/4\le z\le5\), \(\mathcal N\) | `1.6201600299e14` |
| \(5\le z\le8\), \(\mathcal N\) | `7.4868201210e14` |
| \(8\le z\le16\), \(\mathcal N\) | `1.4422875372e16` |
| \(16\le z\le32\), \(\mathcal N\) | `1.7239194164e18` |

The canonical all-cell trace SHA-256 is
`22136f96428c4b1c832eec61998bf2de6a01ebf3cc12fb7995c168fe6cfe5b12`.
At the frozen source version, the source and result SHA-256 values are,
respectively,
`e54e3b8a249dfe41ed98377362ad1d49cfb87454e79cda2e9176fa681a694651`
and
`b767db85fb2788049036e00b4c2957c0d9fc896be9e92aa2f3250e71ee28f8fe`.
Reproduce the bounded one-core calculation with

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  src/certify_h5_ratio_compact.py --precision 256 \
  --output results/h5_ratio_compact_arb.json
```

The quick artifact tests run by default.  The complete archived-output
equality replay is deliberately explicit:

```sh
RUN_H5_COMPACT_REPLAY=1 \
  /Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  -m unittest \
  tests.test_certify_h5_ratio_compact.H5RatioCompactCertificateTest.\
test_full_replay_matches_archived_cell_trace_and_minima -v
```

This artifact promotes only the compact part of the fixed-H5 ratio theorem.
It does not certify the analytic outer estimates, the true signed \(c_5\)
payment or its stronger sufficient condition (44), any higher rung, the
global first Xi Laguerre sign, or RH.
