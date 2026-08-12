# Actual centered-remainder long-block Hermite moment barrier

## 0. Exact outcome and claim boundary

Put

\[
 x=\lambda^2,\qquad L=\log x,\qquad
 \beta=1-\alpha.                                      \tag{0.1}
\]

For an integer `k>=2` and fixed `A>0`, define the translated long block

\[
 I_{x,k}=[Ax^k,2Ax^k],\qquad T_k=Ax^k.                \tag{0.2}
\]

Let `He_k` be the probabilists' Hermite polynomial and let `rho_k` be its
largest zero.  The frozen Montgomery--Vaughan input implies the following
general theorem:

\[
 \boxed{
 k(1-\alpha)<\rho_k
 \quad\Longrightarrow\quad
 \mathfrak R_{\lambda,\alpha},\qquad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha,k}x^kL.}                              \tag{0.3}
\]

The best member of this integer long-block moment hierarchy is `k=4`.
Since

\[
 \rho_4=\sqrt{3+\sqrt6},                              \tag{0.4}
\]

equation (0.3) gives

\[
 \boxed{
 \alpha>1-{\sqrt{3+\sqrt6}\over4}
 \quad\Longrightarrow\quad
 \mathfrak R_{\lambda,\alpha},\qquad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha}\lambda^8L.}                        \tag{0.5}
\]

The new threshold is

\[
 1-{\sqrt{3+\sqrt6}\over4}
 =0.4163964454\ldots .                                \tag{0.6}
\]

Thus (0.5) includes `alpha=1/2` and a nonempty fixed range below it.  It
does not reach every positive `alpha`.

On the original block `[Ax^2,2Ax^2]`, the same source controls moments only
through degree four.  This note sharpens the normalized fourth moment to
the Gaussian value three, gives an exact three-atom obstruction showing
that even those sharp moments cannot force positive excess at normalized
levels at least one, and identifies the uncontrolled fifth mixed moment.

The phase-volume comparison remains one-way.  None of these lower bounds
for the centered remainder is a lower bound for the actual phase volume.
No determinant convergence, zero-location theorem, Riemann hypothesis,
converse, or de Bruijn--Newman bound follows.  The formal state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies and source lineage

The exact local inputs are:

| Frozen path | SHA-256 |
|---|---|
| `notes/ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md` | `2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1` |
| `tests/test_actual_phase_volume_centered_pnt_remainder_reduction_barrier.py` | `7fbcdf15dde20d3d2a00303f74d5441ee143af74ae269992fe79b1fb0c97456f` |
| `notes/ACTUAL_CENTERED_REMAINDER_PRIME_FOURTH_MOMENT_LOWER_BARRIER.md` | `920b6434cc89c663ae95f6f7803780cd164e99b8e5cdc82c2de1a3655171035a` |
| `tests/test_actual_centered_remainder_prime_fourth_moment_lower_barrier.py` | `de1e282b5106d0dc3ecb95a19773433baff029f1ff7cb5c45229e86374696fe7` |
| `notes/ACTUAL_CENTERED_REMAINDER_PRIME_THIRD_MOMENT_HALF_ALPHA_BARRIER.md` | `0d9a8326abe3752e2cdaf13333c7e768816a1d0d3773df998842b1333d313287` |
| `tests/test_actual_centered_remainder_prime_third_moment_half_alpha_barrier.py` | `acf9f91fd1dd8b76adee84eeaa22ba42dfb05b6c70282aaa04eb88dc509499d9` |

The phase-reduction pair supplies the definitions of `R_lambda`,
`mathfrak R_(lambda,alpha)`, its high-time restriction, and the one-way
phase-volume comparison.  The fourth-moment pair supplies the PNT
coefficient estimates, proper-prime-power bound, and the translated
weighted mean-value theorem.  The third-moment pair supplies the normalized
level-one moment argument and its exact stopping line on the `x^2` block.

The substantive primary input inherited through those frozen pairs is H. L.
Montgomery and R. C. Vaughan, *Hilbert's Inequality*, *Journal of the London
Mathematical Society* (2) **8** (1974), 73--82, DOI
<https://doi.org/10.1112/jlms/s2-8.1.73>, Corollary 2, equations
(1.8)--(1.9).  It remains external and unvendored.  No new external input,
source lock, vendored byte, zero table, numerical orbit, or artifact is
added here.

For an interval `I` of length `T`, the inherited consequence is

\[
 \left|\int_I|F(t)|^2dt-T\sum_n|c_n|^2\right|
 \leq {9\pi\over2}\sum_n n|c_n|^2,
 \qquad F(t)=\sum_nc_nn^{it}.                          \tag{1.1}
\]

Translation of `I` only rotates the coefficients and does not change the
right side.

## 2. Prime convolution energies and bilinear MV control

Retain

\[
 P_x(t)=\sum_{p\leq x}a_pp^{it},\qquad
 a_p={\log p\over\sqrt p},\qquad
 Y_x(t)=\operatorname {Re}P_x(t),                     \tag{2.1}
\]

and put

\[
 S_x=\sum_{p\leq x}a_p^2
 =\left({1\over2}+o(1)\right)L^2,qquad
 V_x=\sum_{p\leq x}p a_p^2=O(xL).                    \tag{2.2}
\]

For a fixed integer `r>=1`, expand

\[
 P_x(t)^r=\sum_nb_{r,x}(n)n^{it}.                     \tag{2.3}
\]

Every index in the support of `b_(r,x)` has exactly `r` prime factors with
multiplicity.  The number of ordered representations of one such index is
at most `r!`.  Cauchy--Schwarz on each representation class gives

\[
 W_{r,x}:=\sum_n n|b_{r,x}(n)|^2
 \leq r!V_x^r
 \ll_r(xL)^r.                                        \tag{2.4}
\]

The quadratic error in (1.1) is a Hermitian form.  Polarization followed by
the scaling `F -> uF`, `G -> u^(-1)G` therefore gives

\[
 |\mathcal B_I(F,G)|
 \ll\{W(F)W(G)\}^{1/2},                              \tag{2.5}
\]

where `mathcal B_I` is the integral inner product with its coefficient
diagonal removed and `W(F)=sum n|c_n|^2`.

If `a!=b`, unique factorization makes the supports of `P_x^a` and `P_x^b`
disjoint.  On the block (0.2), equations (2.4)--(2.5) imply

\[
 \left|{1\over T_k}\int_{I_{x,k}}
 P_x(t)^a\overline {P_x(t)}^{b}dt\right|
 \ll_{A,a,b}
 x^{(a+b)/2-k}L^{(a+b)/2}.                            \tag{2.6}
\]

When one exponent is zero, direct endpoint integration and the frozen
bound `sum_(p<=x) a_p=O(sqrt(x))` give

\[
 \left|{1\over T_k}\int_{I_{x,k}}P_x(t)^d dt\right|
 \ll_{A,d}x^{d/2-k}.                                  \tag{2.7}
\]

Thus every off-diagonal term of total degree at most `2k` is negligible
relative to `L` raised to that total degree.

## 3. Gaussian moments through degree `2k`

Put

\[
 D_{r,x}=\sum_n|b_{r,x}(n)|^2,qquad
 E_{4,x}=\sum_{p\leq x}a_p^4=O(1).                   \tag{3.1}
\]

Unique factorization says that two ordered prime `r`-tuples have the same
product exactly when they have the same multiset.  Tuples with distinct
entries supply the leading `r!` permutations, while tuples with a repeated
entry have total weight `O_r(E_(4,x)S_x^(r-2))`.  Hence

\[
 D_{r,x}=r!S_x^r+O_r(E_{4,x}S_x^{r-2})
 =\{r!+o(1)\}S_x^r.                                  \tag{3.2}
\]

Applying (1.1) to `P_x^r` gives, for `r<=k`,

\[
 {1\over T_k}\int_{I_{x,k}}|P_x(t)|^{2r}dt
 =\{r!+o(1)\}S_x^r,                                  \tag{3.3}
\]

because `W_(r,x)/T_k=O_(A,r)(x^(r-k)L^r)=o(L^(2r))`.

Normalize the block by

\[
 \mathbb E_{x,k}f={1\over T_k}\int_{I_{x,k}}f(t)dt,
 \qquad
 \sigma_{x,k}^2=\mathbb E_{x,k}Y_x^2.                \tag{3.4}
\]

Equations (2.6)--(3.3) give

\[
 \sigma_{x,k}=\left({1\over2}+o(1)\right)L.          \tag{3.5}
\]

Set `Z_(x,k)=Y_x/sigma_(x,k)`.  Expanding powers of
`(P_x+overline(P_x))/2`, only the equal-exponent term survives at leading
order.  Consequently, for every `0<=j<=2k`,

\[
 \boxed{
 \mathbb E_{x,k}Z_{x,k}^j\longrightarrow
 \begin{cases}
  0,&j\text{ odd},\\
  (j-1)!!,&j\text{ even}.
 \end{cases}}                                         \tag{3.6}
\]

These are only finitely many Gaussian moments.  No convergence in law to a
Gaussian is asserted or needed.

## 4. Quantitative Hermite localizing lemma

Let `gamma` be standard Gaussian measure.  In the orthonormal basis

\[
 e_j(z)={\operatorname {He}_j(z)\over\sqrt{j!}},
 \qquad 0\leq j\leq k-1,                              \tag{4.1}
\]

the compression of multiplication by `z` is the Jacobi matrix

\[
 J_k=
 \begin{pmatrix}
 0&1&&&\\
 1&0&\sqrt2&&\\
 &\sqrt2&0&\ddots&\\
 &&\ddots&\ddots&\sqrt{k-1}\\
 &&&\sqrt{k-1}&0
 \end{pmatrix}.                                      \tag{4.2}
\]

Its characteristic polynomial is `He_k`; its largest eigenvalue is
`rho_k`.  Let `q_k` be a corresponding real eigenpolynomial, normalized so
that `int q_k^2 dgamma=1`.  Then

\[
 \int zq_k(z)^2d\gamma(z)=\rho_k.                     \tag{4.3}
\]

We record a quantitative deterministic lemma.  Suppose real random
variables `Z_n` have moments converging to the Gaussian moments through
degree `2k` as in (3.6).  For every fixed `c<rho_k`,

\[
 \boxed{\liminf_{n\to\infty}\mathbb E(Z_n-c)_+>0.}   \tag{4.4}
\]

Indeed, moment convergence through degree `2k-1` gives

\[
 \mathbb E\{(c-Z_n)q_k(Z_n)^2\}
 \longrightarrow c-\rho_k<0.                         \tag{4.5}
\]

Put `d=rho_k-c`, `U_n=(Z_n-c)_+`, and `u_n=E U_n`.  For all sufficiently
large `n`, positivity of `(c-Z_n)q_k(Z_n)^2` on `Z_n<=c` implies

\[
 {d\over2}
 \leq\mathbb E\{U_nq_k(Z_n)^2\}
 \leq C_{k,c}\{u_n+\mathbb E U_n^{2k-1}\}.           \tag{4.6}
\]

The convergent `2k`-th moments bound `E U_n^(2k)` uniformly.  Exact
interpolation between `L^1` and `L^(2k)` gives

\[
 \mathbb E U_n^{2k-1}
 \leq u_n^{1/(2k-1)}
       \{\mathbb E U_n^{2k}\}^{(2k-2)/(2k-1)}.        \tag{4.7}
\]

Equations (4.6)--(4.7) force `u_n>=delta_(k,c)>0`.  This proves (4.4)
without a qualitative compactness shortcut.

Applying the lemma to (3.6), for each fixed `c<rho_k`,

\[
 \mathbb E_{x,k}(Y_x-c\sigma_{x,k})_+
 \gg_{A,k,c}L.                                       \tag{4.8}
\]

## 5. Long-block threshold and transfer to the actual remainder

Uniformly for `t in I_(x,k)`,

\[
 h(t)={1\over2}\log(1+4t^2)=kL+O_A(1).               \tag{5.1}
\]

Together with (3.5), this gives the exact normalized threshold

\[
 \sup_{t\in I_{x,k}}
 {\beta h(t)/2\over\sigma_{x,k}}
 \longrightarrow k\beta.                             \tag{5.2}
\]

If `k beta<rho_k`, choose a fixed

\[
 k\beta<c<\rho_k.                                    \tag{5.3}
\]

Then `beta h(t)/2<=c sigma_(x,k)` throughout the block for all sufficiently
large `x`.

Use the frozen exact split

\[
 R_\lambda(t)=P_x(t)+H_x(t)-M_\lambda(t).             \tag{5.4}
\]

The proper-prime-power estimates remain uniform on the translated longer
block:

\[
 \mathbb E_{x,k}|H_x|^2=Q_x+o(1)\leq Q_\infty+o(1),
 \qquad
 \sup_{I_{x,k}}|M_\lambda|=O_A(x^{1/2-k}).            \tag{5.5}
\]

Thus

\[
 \int_{I_{x,k}}|\operatorname {Re}(H_x-M_\lambda)|dt
 =O_{A,k}(T_k),                                       \tag{5.6}
\]

whereas (4.8) supplies prime positive excess of order `T_k L`.  The exact
pointwise noise inequality therefore yields

\[
 \int_{I_{x,k}}
 \left[\operatorname {Re}R_\lambda(t)-{\beta\over2}h(t)\right]_+dt
 \gg_{A,\alpha,k}T_kL.                               \tag{5.7}
\]

Since

\[
 [2\operatorname {Re}R_\lambda-\beta h]_+
 =2[\operatorname {Re}R_\lambda-\beta h/2]_+,        \tag{5.8}
\]

restriction of the defining statistic to `I_(x,k)` proves (0.3).  The
high-time cutoff is

\[
 T_0={4\sqrt x\over L^2}=o(Ax^k),                    \tag{5.9}
\]

so the same block proves the high-time statement.

## 6. The optimal integer moment block is `k=4`

For `k=2,3,4`,

\[
 {\rho_2\over2}={1\over2},\qquad
 {\rho_3\over3}={1\over\sqrt3},\qquad
 {\rho_4\over4}={\sqrt{3+\sqrt6}\over4}.            \tag{6.1}
\]

The last number is strictly larger than `7/12`, because

\[
 3+\sqrt6>{49\over9}
 \quad\Longleftrightarrow\quad
 6>{484\over81}.                                     \tag{6.2}
\]

The first two ratios in (6.1) are strictly smaller than `7/12`.

For each `5<=k<=10`, put `y_k=7k/12`.  The exact rational recurrence

\[
 H_0=1,\qquad H_1=y_k,\qquad
 H_{j+1}=y_kH_j-jH_{j-1}                              \tag{6.3}
\]

is positive for every `0<=j<=k`.  These numbers are the leading principal
minors of `y_kI-J_k`, so Sylvester's criterion proves `rho_k<7k/12`.
For an independently checkable terminal certificate, the six final values
are

\[
\begin{array}{c|c}
k&H_k\\ \hline
5&1668275/248832\\
6&7909/64\\
7&64809846913/35831808\\
8&172479769/6561\\
9&105568243893/262144\\
10&400539571026805/60466176.
\end{array}                                           \tag{6.4}
\]

For `k>=11`, entrywise Perron comparison of `J_k` with
`sqrt(k-1)` times the path adjacency matrix gives

\[
 \rho_k<2\sqrt{k-1}<{7k\over12}.                     \tag{6.5}
\]

The last inequality holds at `k=11` and its squared margin increases
thereafter.  Equations (6.1)--(6.5) prove

\[
 \boxed{
 \sup_{k\geq2}{\rho_k\over k}
 ={\sqrt{3+\sqrt6}\over4}.}                          \tag{6.6}
\]

This is an optimality statement only for the integer translated-block
MV/Hermite hierarchy proved here.  It is not an impossibility theorem for
all arithmetic methods.

## 7. Exact barrier on the original `x^2` block

The frozen fourth-moment note recorded only an upper bound for `E Y_x^4`.
The same source gives its exact leading value.  Optimized polarization in
(2.5) gives

\[
 \mathbb E_{x,2}(P_x^3\overline {P_x})=O_A(L^2),
 \qquad
 \mathbb E_{x,2}P_x^4=O_A(1).                        \tag{7.1}
\]

Since `E|P_x|^4=(2+o(1))S_x^2`, expansion of `Y_x^4` proves

\[
 \mathbb E_{x,2}Y_x^4
 =\left({3\over4}+o(1)\right)S_x^2,
 \qquad
 {\mathbb E_{x,2}Y_x^4\over\sigma_{x,2}^4}
 \longrightarrow3.                                  \tag{7.2}
\]

Even the exact moments `(1,0,1,0,3)` do not force excess above a normalized
level `c>1`.  For such a `c`, put

\[
 d=c^2-1,\qquad D=\sqrt{c^4-3c^2+3},\qquad
 r_\pm={-c\pm D\over d}.                              \tag{7.3}
\]

Define

\[
 \begin{aligned}
 w_c&={2\over c^4+3},\\
 w_-&={(cD-1)d\over2D(c^3+D)},\\
 w_+&={(cD+1)d\over2D(c^3-D)}.
 \end{aligned}                                       \tag{7.4}
\]

The identities

\[
 c^2D^2-1=(c^2-1)^3,
 \qquad
 c^6-D^2=(c^2-1)(c^4+3)                              \tag{7.5}
\]

show that all three weights are positive and that `r_-<r_+<c`.  Direct
substitution gives

\[
 \sum_{z\in\{r_-,r_+,c\}}w_z=1,qquad
 \sum_z w_zz=0,qquad
 \sum_z w_zz^2=1,qquad
 \sum_z w_zz^3=0,qquad
 \sum_z w_zz^4=3.                                    \tag{7.6}
\]

Equivalently, this is the three-node Gaussian--Radau formula generated by

\[
 Q_c(z)=(z-c)
 \left(z^2+{2c\over c^2-1}z+{3-c^2\over c^2-1}\right),
 \qquad
 \int Q_c\,d\gamma=\int zQ_c\,d\gamma=0.            \tag{7.7}
\]

The measure in (7.6) is supported on `(-infinity,c]`, so

\[
 \mathbb E(Z-c)_+=0.                                  \tag{7.8}
\]

Taking `1<c_j<sqrt(3)` down to one gives measures with the exact first four
Gaussian moments and uniformly bounded fourth moment.  Both non-`c_j`
nodes are then negative, and

\[
 \mathbb E(Z_j-1)_+
 ={2(c_j-1)\over c_j^4+3}\longrightarrow0.           \tag{7.9}
\]

Thus no Paley--Zygmund variant or other consequence of moments only through
degree four can cross the level-one boundary.

The first missing datum is the fifth moment.  On `[Ax^2,2Ax^2]`, (2.5)
gives only

\[
 \mathbb E_{x,2}
 \left(P_x^3\overline {P_x}^{2}\right)
 =O_A(x^{1/2}L^{5/2}),                                \tag{7.10}
\]

while direct endpoint integration gives

\[
 \mathbb E_{x,2}P_x^5=O_A(x^{1/2}).                  \tag{7.11}
\]

Both are vacuous relative to the required `o(L^5)`.  Unique factorization
removes the exact diagonal between the three-prime-factor and
two-prime-factor supports, but does not separate near frequencies with
integer indices of size `x^2`.  A weighted shifted almost-prime correlation
or genuinely new finite-orbit large-deviation theorem would be required.
Neither is present in the frozen source set.

## 8. Exact stopping line

The same primary mean-value theorem therefore has two distinct conclusions:

1. on the original `x^2` block it stops exactly at normalized level one;
2. on longer integer blocks it proves (0.3), whose best threshold is (0.5).

Nothing here proves the centered-remainder lower bound for

\[
 0<\alpha\leq1-{\sqrt{3+\sqrt6}\over4}.               \tag{8.1}
\]

Most importantly, the frozen comparison remains

\[
 \Phi_\lambda(U,g)
 \leq\mathfrak M_{\lambda,\alpha}(C)
       +\mathfrak R_{\lambda,\alpha}.                 \tag{8.2}
\]

A lower bound for the rightmost term cannot be reversed into a lower bound
for `Phi_lambda`.  The theorem proves no dangerous-projector capture,
weighted coframe rate, parity ordering, determinant convergence,
unconditional zero theorem, RH proof or converse, or de Bruijn--Newman
bound.  The formal state remains `P0_INVALIDATED`.
