# First reduced theta source determinants: a complete compact-anchor endpoint certificate

**Role in the completed checkpoint.** This is a proof component. The [global theorem](theta_second_preservation_global_20261111.md) combines the source crossing, compensation, first-source origin, and second-origin results to prove second preservation and five-node positivity. Statements below limiting an individual component retain that local scope.


Research continuation, 11 November 2026. This note proves that the two
higher source determinants required to apply second-order comparison to
the first canonical theta pair have strictly positive normalized limits
at the spatial origin, for every anchor \(0<a\le100\). The companion
large-anchor proof covers \(a\ge100\). The spatial transfer from these
endpoint signs to positive determinants for all \(t>0\) is a separate
analytic argument; this certificate by itself does not claim that step.

## 1. The exact endpoint determinants

For the first canonical pair \((u_1,v_1)=(b_a,n_a)\), write

\[
H_1=b_a/n_a,\quad B_1=4b_a''/n_a,\quad J_1=4n_a''/n_a,
\quad P_1=16b_a^{(4)}/n_a,
\]

\[
W_{H,1}=\mathcal W(B_1',J_1',-H_1'),\qquad
W_{P,1}=\mathcal W(B_1',J_1',P_1').
\]

A prime here denotes spatial differentiation. For an even kernel,
put \(u=t^2\); then
\(\mathcal W_t(B',J',Q')=64t^6\mathcal W_u(B_u,J_u,Q_u)\).
Homogeneous Wronskian identities and
\(n_a+ab_a=C\), \(an_a+4b_a''=p\kappa\) give

\[
\lim_{t\downarrow0}\frac{W_{H,1}(t)}{t^6}
=\frac{p(a)}{a}\frac{D_H(a)}{N(a)^4},\qquad
\lim_{t\downarrow0}\frac{W_{P,1}(t)}{t^6}
=p(a)^2\frac{D_P(a)}{N(a)^4},
\tag{1}
\]

where \(p=L\), \(N=n_a(0)/\kappa(0)\), and the cleared determinants
below use derivatives with respect to \(u\), of orders zero to three.

Let \(q=a^2\), \(d=1+ap\), and normalize the theta constants by

\[
c=-\kappa''(0)/\kappa(0),\quad
b=\kappa^{(4)}(0)/\kappa(0),\quad
g=\kappa^{(6)}(0)/\kappa(0),\quad
k_8=\kappa^{(8)}(0)/\kappa(0),\quad h=C(0)/\kappa(0).
\]

Set

\[
Y=qN-d,\quad Z=qY+4c(d+2),\quad T=qZ-16b(d+4).
\]

The required derivative columns, after division by \(\kappa(0)\), are

\[
\begin{aligned}
\mathbf n&=(N,Y/8,Z/192,T/7680)^\top,\\
\mathbf k&=(1,-c/2,b/12,g/120)^\top,\\
\mathbf t&=(0,-c,b/3,g/20)^\top,\\
\mathbf C&=(h,-1/8,c/16,-b/96)^\top,\\
\mathbf k_2&=(-c,b/2,g/12,k_8/120)^\top.
\end{aligned}
\]

Thus

\[
\boxed{D_H=64\det(\mathbf n,\mathbf k,\mathbf t,\mathbf C),
\qquad D_P=-256\det(\mathbf n,\mathbf k,\mathbf t,\mathbf k_2).}
\tag{2}
\]

For example, the column \(\mathbf t\) represents \(t\kappa'(t)\),
not a further derivative of \(\kappa\). The recurrence for \(T\) follows
by twice differentiating the canceled equation again; it represents
\(64n_a^{(6)}(0)/\kappa(0)\).

The executable derives (2) exactly with rational symbolic algebra.
Both expressions are affine in \(N,d\):

\[
D_H=A_H(q)N+B_H(q)d+C_H(q),\qquad
D_P=A_P(q)N+B_P(q)d+C_P(q).
\tag{3}
\]

Their coefficients are explicit polynomials in \(q,c,b,g,k_8,h\),
with rational coefficients. No symbolic expression is replaced by a
floating-point fit.

## 2. Positive-moment models and the removable anchor factor

Use the freshly recomputed models in the second-origin certificate:
\(A=200\), \(X=q/A^2\), \(E(a)=e(X)\), and
\(O(a)=(a/A)o(X)\). Put \(K_0=2\kappa(0)A\). Then

\[
P=eo+2X(eo'-e'o),\qquad T_e=e+2Xe',\qquad
N=\frac{P}{K_0e},\quad d=\frac{T_e}{e}.
\tag{4}
\]

Primes in this section refer to \(X\). The positive series coefficients
of \(e,o\) are integrals of the actual theta kernel. The base verifier
recomputes all 602 coefficients through degree 300, including complete
theta and spatial-tail errors. It also supplies separate derivative
remainder bounds for \(e,e',o,o'\) on \(0\le X\le1/4\).

The determinant \(D_H\) vanishes at anchor zero, because \(n_0=C\).
Consequently its positive sign must be tested after removing the factor
\(q=a^2\). Performing a numerical subtraction and then dividing by an
interval containing zero would be invalid. Instead, use the exact
correlation

\[
h=\frac{o_0}{K_0},\qquad
\widehat o(X)=\frac{o(X)-o_0}{X}
=\sum_{j\ge0}o_{j+1}X^j.
\]

The executable builds \(\widehat o\) directly from the raw odd moment
coefficients. Its omitted series is bounded by

\[
E(A)\frac{(1/4)^{300}}{1-1/4}
<1.38\cdot10^{-70}.
\tag{5}
\]

The value \(o_0\) is taken from the same freshly enclosed moments,
not from a separately rounded value of \(C(0)\). Equation (4) then gives

\[
N-h=\frac{X}{K_0e}
\{e\widehat o+2(eo'-e'o)\},\qquad d-1=\frac{2Xe'}e.
\tag{6}
\]

Exact symbolic algebra checks that

\[
D_{H,0}(q)=\frac{A_H(q)h+B_H(q)+C_H(q)}q
\]

is a polynomial. Using \(q=A^2X\), define

\[
\begin{aligned}
G_H={}&A_H(q)\{e\widehat o+2(eo'-e'o)\}
+2K_0B_H(q)e'+A^2K_0eD_{H,0}(q),\\
G_P={}&A_P(q)P+K_0B_P(q)T_e+K_0C_P(q)e.
\end{aligned}
\]

Then the exact cleared identities are

\[
\boxed{\frac{D_H}{a^2}=\frac{G_H}{A^2K_0e},
\qquad D_P=\frac{G_P}{K_0e}.}
\tag{7}
\]

Every denominator is positive. Formula (7) is regular at \(X=0\),
and its derivation removes the vanishing factor before interval
evaluation. Full polynomial products are retained. The implementation
uses separately bounded actual function and derivative values rather
than differentiating artificial error intervals.

## 3. Complete compact verification

The default executable recomputes the entire moment certificate. It
accepts no disk cache as a proof input. A combined runner may reuse
models just produced by the base verifier within the same process.

At 384-bit precision, 4,096 closed intervals cover \(0\le X\le1/4\).
On every interval it verifies \(e>0\), \(G_H>0\), and \(G_P>0\).
The full polynomials have degrees 602 and 603. The resulting bounds are

\[
\boxed{D_H(a)/a^2>3.0\cdot10^{-8},\qquad
D_P(a)>0.36\qquad(0<a\le100).}
\tag{8}
\]

The unrounded minimum lower bounds in the replay are approximately
\(3.0791284411080\cdot10^{-8}\) and \(0.36630580062046\).
All 4,096 checks concern complete intervals, including their endpoints.
The same fresh models verify

\[
1<p(100)<1.5,
\]

which is an input to the separate large-anchor proof.

Because \(p(a)>0\), \(N(a)>0\), and \(a>0\), equations (1) and (8)
prove both normalized source limits are strictly positive for every
anchor in the stated range. The companion tail result extends this to
all positive anchors. Any conclusion about all positive spatial
arguments additionally uses the independently proved spatial transfer
and its source-sign hypotheses.

## Reproducibility and dependencies

- `theta_second_source_origin_compact_20261111.py`: exact determinant
  generation and complete compact interval verification.
- `theta_second_source_origin_compact_replay_20261111.json`: fresh successful replay.
- `theta_second_origin_20261111.py`: freshly computed positive moment
  models and their rigorous remainders; its proof note details the
  analytic bounds used for each integral.
- The copied `theta_preservation_origin_20261110.py` helper supplies
  the finite theta series and derivative-polynomial recurrence, with
  explicit omitted-term bounds. It is fixed to PR #52's helper.

No complex zero verification, RH assumption, or unproved global
preservation assertion is an input to this compact certificate.
