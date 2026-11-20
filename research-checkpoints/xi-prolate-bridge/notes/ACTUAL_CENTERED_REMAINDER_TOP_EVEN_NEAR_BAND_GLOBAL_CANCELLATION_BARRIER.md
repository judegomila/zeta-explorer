# Actual centered-remainder top-even near-band global-cancellation barrier

## 0. Exact outcome and claim boundary

Put

\[
 x=\lambda^2,\qquad L=\log x,\qquad r=k+1,\qquad
 T=Ax^k=Ax^{r-1},\qquad X=x^r.                       \tag{0.1}
\]

For the prime polynomial

\[
 P_x(t)=\sum_{p\leq x}{\log p\over\sqrt p}\,p^{it}, \tag{0.2}
\]

checkpoint 1.69 identified the sufficient top-even uniform-integrability
target

\[
 {1\over T}\int_T^{2T}|P_x(t)|^{2r}\,dt=O_{A,r}(L^{2r}). \tag{0.3}
\]

This note proves that the top product shell contains a positive
off-diagonal near-band contribution of size

\[
 \boxed{\mathcal N_{r,A}(x)\gg_{A,r}x.}               \tag{0.4}
\]

The shift width is a fixed positive multiple of

\[
 {X\over T}={x^r\over Ax^{r-1}}\asymp_A x.           \tag{0.5}
\]

Thus (0.3) cannot follow by proving that the growing near band is small,
nor by taking absolute values in a shifted-correlation estimate.  If
(0.3) is true, the complementary signed kernel must cancel (0.4) to
additive accuracy `O_(A,r)(L^(2r))`.  The translated endpoint phase and
the shifts outside the positive core are essential to that possible
cancellation.

For `k=4`, one has `r=5`, `T=Ax^4`, `X=x^5`, and a concrete positive
core of width

\[
 h_0=\left\lfloor{x\over512A}\right\rfloor.           \tag{0.6}
\]

It contributes `Omega_A(x)` off the diagonal.  Its restricted-shell
diagonal is only `O(L^5)`, whereas the full diagonal is

\[
 D_{5,x}=\{120+o(1)\}S_x^5\asymp L^{10}.             \tag{0.7}
\]

No claim is made that the full tenth moment is `Omega(x)`: terms outside
the positive core may cancel it.  No new shifted-correlation theorem is
proved, and no frozen theorem supplies the required complementary signed
cancellation.  Nothing here changes the checkpoint-1.68 alpha threshold
or reverses the one-way phase-volume comparison.  No determinant theorem,
zero-location result, Riemann hypothesis, converse, or de
Bruijn--Newman bound follows.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen pair and admitted input

This note freezes exactly the checkpoint-1.69 shifted-correlation pair:

| Frozen path | SHA-256 |
|---|---|
| `notes/ACTUAL_CENTERED_REMAINDER_SHIFTED_CORRELATION_TOP_MOMENT_UI_BARRIER.md` | `8ab0f30e32fe715a4f839228f5d05dc581292c99c2a04f42804f0ff4d2d878d9` |
| `tests/test_actual_centered_remainder_shifted_correlation_top_moment_ui_barrier.py` | `ecaf4f1eaaab4a3a146c277eb0897e79d5323bfe9b79709bbc5cac5d423bd787` |

That pair supplies the exact moment kernel, the prime convolution
coefficients, the PNT coefficient estimates, and the weighted
Montgomery--Vaughan bound.  Its transitive PNT input includes

\[
 \vartheta(y):=\sum_{p\leq y}\log p=y+o(y),           \tag{1.1}
\]

and hence

\[
 \vartheta(x)-\vartheta(x/2)=\left({1\over2}+o(1)\right)x. \tag{1.2}
\]

The inherited substantive external lineage is H. L. Montgomery and R. C.
Vaughan, *Hilbert's Inequality*, *Journal of the London Mathematical
Society* (2) **8** (1974), 73--82, Corollary 2.  The primary paper remains
external and unvendored.  This note adds no external theorem, source lock,
vendored byte, prime sample, zero table, numerical artifact, or external
computation.

## 2. Exact top-even kernel

Let

\[
 \ell_x(n)=
 \begin{cases}
  \log n,&n\leq x\text{ is prime},\\
  0,&\text{otherwise},
 \end{cases}
 \qquad C_{r,x}=\ell_x^{*r}.                            \tag{2.1}
\]

Then

\[
 P_x(t)^r=\sum_{n\leq X}{C_{r,x}(n)\over\sqrt n}\,n^{it}. \tag{2.2}
\]

With

\[
 K(v)=\int_1^2e^{isv}\,ds,
 \qquad \operatorname {Re}K(v)=\int_1^2\cos(sv)\,ds, \tag{2.3}
\]

finite expansion gives

\[
 M_{r,r}(T):={1\over T}\int_T^{2T}|P_x(t)|^{2r}\,dt
 =\sum_{n,m}{C_{r,x}(n)C_{r,x}(m)\over\sqrt{nm}}
 K\!\left(T\log{n\over m}\right).                   \tag{2.4}
\]

The full diagonal is

\[
 D_{r,x}:=\sum_n{C_{r,x}(n)^2\over n}
 =\{r!+o(1)\}S_x^r\asymp_r L^{2r}.                   \tag{2.5}
\]

The remaining sum is real after pairing `(n,m)` with `(m,n)`, but its
individual real terms need not be positive outside a sufficiently narrow
band.  This sign change is what prevents the lower bound below from being
a lower bound for the full moment.

## 3. Restricted-prime top-shell mass

Define the restricted prime weight and its `r`-fold convolution by

\[
 \ell_x^\sharp(n)=
 \begin{cases}
  \log n,&x/2<n\leq x\text{ is prime},\\
  0,&\text{otherwise},
 \end{cases}
 \qquad B_{r,x}=(\ell_x^\sharp)^{*r}.                  \tag{3.1}
\]

Coefficientwise,

\[
 0\leq B_{r,x}(n)\leq C_{r,x}(n),                    \tag{3.2}
\]

and the support of `B_(r,x)` lies in

\[
 J_r=[2^{-r}X,X].                                      \tag{3.3}
\]

Summing the ordered prime tuples before collecting equal products gives
the exact identity

\[
 \sum_nB_{r,x}(n)
 =\left(\vartheta(x)-\vartheta(x/2)\right)^r
 =\left(2^{-r}+o(1)\right)X.                          \tag{3.4}
\]

In particular, for fixed `r` and all sufficiently large `x`,

\[
 \sum_nB_{r,x}(n)\geq3^{-r}X.                        \tag{3.5}
\]

This is a literal actual-prime lower mass.  It is not an independent
density heuristic and does not require a shifted-prime theorem.

## 4. A positive growing near band

For fixed `A>0`, set

\[
 h_0=\left\lfloor{2^{-r-4}\over A}x\right\rfloor.    \tag{4.1}
\]

For sufficiently large `x`, `h_0>=1` and

\[
 h_0\asymp_{A,r}x.                                    \tag{4.2}
\]

If `n,m in J_r` and `|n-m|<=h_0`, then

\[
 \begin{aligned}
 \left|T\log{n\over m}\right|
 &\leq {T|n-m|\over\min\{n,m\}}\\
 &\leq {Ax^{r-1}\,2^{-r-4}A^{-1}x\over2^{-r}x^r}
 ={1\over16}.
 \end{aligned}                                        \tag{4.3}
\]

For `1<=s<=2`, the elementary inequality
`cos(sv)>=1-(sv)^2/2` therefore gives

\[
 \operatorname {Re}K(v)\geq{1\over2}
 \qquad(|v|\leq1/16).                                 \tag{4.4}
\]

Partition `J_r` into consecutive half-open intervals of length at most
`h_0`, and write

\[
 \beta_j=\sum_{n\text{ in bin }j}B_{r,x}(n).          \tag{4.5}
\]

There are at most `2X/h_0` bins for all sufficiently large `x`.  Cauchy's
inequality and (3.5) give

\[
 \sum_j\beta_j^2
 \geq{(\sum_j\beta_j)^2\over\#\{j\}}
 \geq {3^{-2r}\over2}Xh_0.                           \tag{4.6}
\]

Every ordered pair counted by `beta_j^2` lies in the positive band of
(4.4).  Since `n,m<=X`, equations (3.2), (4.4), and (4.6) imply

\[
 \begin{aligned}
 &\sum_{\substack{n,m\in J_r\\|n-m|\leq h_0}}
 {C_{r,x}(n)C_{r,x}(m)\over\sqrt{nm}}
 \operatorname {Re}K\!\left(T\log{n\over m}\right)\\
 &\hspace{35mm}\geq {1\over2X}\sum_j\beta_j^2
 \geq {3^{-2r}\over4}h_0
 \gg_{A,r}x.
 \end{aligned}                                        \tag{4.7}
\]

This proves a lower bound for a signed-kernel subregion because that
subregion has a fixed positive sign.  It does not use absolute values to
alter the exact kernel.

## 5. Removing the restricted-shell diagonal

Put

\[
 V_x=\sum_{p\leq x}(\log p)^2=O(xL),\qquad
 W_{r,x}=\sum_nC_{r,x}(n)^2.                           \tag{5.1}
\]

The inherited ordered-representation Cauchy--Schwarz argument gives

\[
 W_{r,x}\leq r!V_x^r\ll_r(xL)^r=XL^r.                \tag{5.2}
\]

Consequently the diagonal inside `J_r` satisfies

\[
 \sum_{n\in J_r}{C_{r,x}(n)^2\over n}
 \leq {2^r\over X}W_{r,x}
 \ll_r L^r.                                           \tag{5.3}
\]

This `O(L^r)` estimate is only for the restricted top product shell.  It
does not replace the full diagonal asymptotic (2.5), which is of order
`L^(2r)` and receives mass from all product scales.

Subtracting (5.3) from (4.7), and using `x/L^r -> infinity`, proves the
off-diagonal assertion

\[
 \boxed{
 \mathcal N_{r,A}(x):=
 \sum_{\substack{n,m\in J_r\\0<|n-m|\leq h_0}}
 {C_{r,x}(n)C_{r,x}(m)\over\sqrt{nm}}
 \operatorname {Re}K\!\left(T\log{n\over m}\right)
 \gg_{A,r}x.}                                         \tag{5.4}
\]

Thus unique factorization controls the exact diagonal, but it does not
make the growing off-diagonal band sparse at resolution `X/T`.

## 6. Exact global-cancellation requirement

Let `mathcal F_(r,A)(x)` denote the real part of every off-diagonal term
in (2.4) not included in (5.4).  Then the exact decomposition is

\[
 M_{r,r}(T)=D_{r,x}+\mathcal N_{r,A}(x)
                  +\mathcal F_{r,A}(x).               \tag{6.1}
\]

If the sufficient UI target (0.3) holds, then (2.5), (5.4), and (6.1)
force

\[
 \boxed{
 \mathcal F_{r,A}(x)
 =-\mathcal N_{r,A}(x)+O_{A,r}(L^{2r}).}               \tag{6.2}
\]

In particular, the complement must have negative size at least a fixed
multiple of `x`, up to the logarithmic remainder.  The needed theorem is
therefore a complete signed-kernel evaluation, not a positive majorant
for each shift.

The weighted Montgomery--Vaughan theorem gives only

\[
 M_{r,r}(T)=D_{r,x}+O_{A,r}(xL^r).                    \tag{6.3}
\]

It has ample scale to permit the cancellation in (6.2), but it supplies
neither its sign nor its logarithmic accuracy.  Its deficit relative to
(0.3) is the previously recorded factor

\[
 {x\over L^r}.                                        \tag{6.4}
\]

## 7. Why the standard local routes do not close the gap

The exact distinction is now sharper than a missing pointwise estimate.

1. Unique factorization proves the equality diagonal.  For `h!=0`, one
   only has `gcd(n,n+h)|h`; this does not remove the `h asymp x` band.
2. Divisor switching and Selberg-sieve majorants estimate nonnegative
   correlations.  The actual positive subband is already `Omega(x)`, so
   an absolute-value argument cannot prove (0.3).
3. A theorem for each fixed shift does not cover the growing family
   `|h|<=h_0 asymp x`.  Even uniform pointwise bounds must preserve the
   translated sinc phase and be summed with enough cancellation.
4. A dispersion or large-sieve theorem would have to evaluate the full
   weighted aggregate in (6.1) to additive error `O(L^(2r))`.  None of
   the admitted large-sieve inputs is a theorem for these coefficients at
   the resolution `H=X^(1/r)`.
5. Coefficient positivity proves (5.4), but it does not prove a lower
   bound for the complete moment.  On the translated interval the
   complement contains both signs, and dropping it is invalid.

The power scale required of a pointwise shifted asymptotic can also be
read off exactly.  On a dyadic top shell the denominator in (2.4) is
comparable to `X`, and there are

\[
 H={X\over T}\asymp_A X^{1/r}=x                       \tag{7.1}
\]

active near shifts.  If an argument first subtracts a main correlation
and then sums absolute errors `E_r(h;X)`, the sufficient error budget is

\[
 \sum_{0<|h|\ll H}|E_r(h;X)|
 \ll_{A,r}XL^{2r}.                                     \tag{7.2}
\]

Without cancellation between the errors, their average size would have
to be at most

\[
 {X\over H}L^{2r}=X^{1-1/r}L^{2r}.                    \tag{7.3}
\]

Thus a pointwise error `O(X/L^B)` with any fixed `B` is still
power-scale insufficient after summing the `H=X^(1/r)` shifts.  One
needs at least an `X^(-1/r)` power saving at the pointwise scale, or an
equally strong signed average over `h`, and one must also evaluate the
main terms globally so that they produce the cancellation in (6.2).
For `r=5`, (7.3) is `X^(4/5)L^10=x^4L^10`.  This is a
growing-shift aggregate requirement; it is not supplied by a theorem
for every fixed `h`.

There is a related localization trap.  A compactly supported nonnegative
time weight centered in `[T,2T]` carries the translated Fourier phase,
whereas a frequency-compact positive kernel has tails outside the target
interval.  One cannot combine the two properties to delete
`mathcal F_(r,A)` without an additional theorem.

## 8. The `k=4` stopping line

For `k=4` and `r=5`, equations (5.4) and (6.1) read

\[
 \mathcal N_{5,A}(x)\gg_Ax,\qquad
 M_{5,5}(Ax^4)=D_{5,x}+\mathcal N_{5,A}(x)
                         +\mathcal F_{5,A}(x),         \tag{8.1}
\]

where the positive off-diagonal core has

\[
 0<|n-m|\leq\left\lfloor{x\over512A}\right\rfloor,
 \qquad n,m\in[x^5/32,x^5].                           \tag{8.2}
\]

The two diagonal scales are

\[
 \sum_{x^5/32\leq n\leq x^5}{C_{5,x}(n)^2\over n}
 =O(L^5),\qquad
 D_{5,x}=\{120+o(1)\}S_x^5\asymp L^{10}.             \tag{8.3}
\]

Therefore the sufficient normalized tenth-moment UI bound

\[
 M_{5,5}(Ax^4)=O_A(L^{10})                            \tag{8.4}
\]

requires

\[
 \mathcal F_{5,A}(x)
 =-\mathcal N_{5,A}(x)+O_A(L^{10}).                   \tag{8.5}
\]

The admitted estimate remains only

\[
 M_{5,5}(Ax^4)=D_{5,x}+O_A(xL^5).                    \tag{8.6}
\]

Equations (8.1)--(8.6) do not decide whether the actual cancellation
occurs.  They prove that a local positive shifted-correlation bound is the
wrong target and isolate the exact complete signed cancellation that a
future arithmetic theorem must supply.  The fixed-shift ninth-moment
problem remains separate from this growing-shift tenth-moment problem.

Nothing in this note extends the centered-remainder theorem below its
current threshold, proves an actual phase-volume lower bound, or changes
the fail-closed formal state `P0_INVALIDATED`.
