# Zero-sampling external-input lock and independent constant audit

Status: **source statements pinned; sampling implication admitted through the
separate complete weighted-translation and domain theorems**.  The formal
project state remains `P0_INVALIDATED`.

This note locks the external zero-free and zero-count inputs used by the
admitted theorem in `OUTER_OUTER_SPECTRAL_THEOREM.md`.  It also reconstructs
the disk-overlap, submean, Plancherel, and dyadic constants
by two arithmetic paths.  This source-audit note alone proves no weighted
translation lemma, sector floor, equation (5.2), or determinant limit.  The
weighted physical input is now proved separately in
`OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md`, and the complete admitted
outer--outer consequence is assembled in
`OUTER_OUTER_SPECTRAL_THEOREM.md`.

No decimal zero list is read or vendored.  No zero is assumed real.  A
published finite-height line verification is used as an external theorem and
is disclosed in Section 7; its computation is not replayed here.

## 1. Exact source bytes

The binding set is deliberately minimal.

| Role | Exact version and location | Vendored SHA-256 |
|---|---|---|
| all-height Vinogradov--Korobov region | Mossinghoff--Trudgian--Yang, arXiv:2212.06867v1, Theorem 1.1, printed page 2, equation (1.5); range split on printed page 11 | `127c32eb86d0aea264cc5b1ba96cc83243ef6b763451591e1560edaca1767300` |
| analytic zero count | Hasanalizade--Shen--Wong, arXiv:2107.06506v1, Theorem 1.1, printed page 2, equation (1.4), first row of Table 2 on printed page 15 | `3fc4c89f49249924e61cb0d289d81559faed53fcbb838628ea32dc7ec6f89fbf` |
| finite-height line verification | Platt--Trudgian, arXiv:2004.09765v1, Theorem 1 and Section 2, printed pages 2--3 | `3362f66af9fa9373977eee70e2282ec33989d5d8b97e0852df9e32cc25b52885` |

The exact files are `vendor/MTY-ZFR-2212.06867v1.pdf`,
`vendor/HSW-ZC-2107.06506v1.pdf`, and
`vendor/PT-RH-VERIFY-2004.09765v1.pdf`.  Each arXiv record has only a v1
submission.  The MTY and HSW statements were also cross-checked against their
versions of record, DOI `10.1007/s40993-023-00498-y` and
`10.1016/j.jnt.2021.06.032` respectively.

## 2. Locked source statements

MTY Theorem 1.1 states that, for `|t|>=3`, there are no zeros in

\[
 \sigma\geq 1-
 \frac{1}{55.241(\log|t|)^{2/3}(\log\log|t|)^{1/3}}.       \tag{2.1}
\]

For the count, put

\[
 M(u)=\frac{u}{2\pi}\log\frac{u}{2\pi e},                 \tag{2.2}
\]

and, using the first row of HSW Table 2,

\[
 R(u)=0.103787\log u+0.257297\log\log u+9.367419.          \tag{2.3}
\]

HSW Theorem 1.1, specialized at

\[
 T_0=30\,610\,046\,000,                                   \tag{2.4}
\]

gives

\[
 \boxed{|N(u)-M(u)+\tfrac18|\leq R(u),\qquad u\geq T_0.}   \tag{2.5}
\]

The `+1/8` in (2.5) is source-critical.  It is retained in both code paths and
has an adversarial mutation test.  The source defines `N(u)` by the argument
principle; zeros are counted with multiplicity.

This lock does **not** use HSW Corollary 1.2 directly for the sampling overlap.
That corollary extends a rounded count to `u>=e` using the asserted
finite-database estimate `|S(u)|<=2.5167` through `30 610 046 000`; the
piecewise overlap below instead uses analytic Theorem 1.1.  There is still an
indirect dependency: MTY imports HSW Corollary 1.2 as its equation (3.8).  Thus
the published zero-free theorem retains the disclosed database dependency even
though this repository reads no zero table.

## 3. Two-sided strip margin without zero reality

Write a nontrivial zero as

\[
 \rho=\beta+i\gamma,\qquad
 s_\rho=\gamma+i(\tfrac12-\beta).                          \tag{3.1}
\]

For `T>=3`, define

\[
 \delta_T=\frac{1}{55.241(\log(2T))^{2/3}
                 (\log\log(2T))^{1/3}},qquad
 r_T=\frac{\delta_T}{4}.                                   \tag{3.2}
\]

The denominator in (2.1) is increasing for `t>=3`.  Thus a zero with
`T<=gamma<2T` has `1-beta>delta_T`.  The functional equation and conjugation
make `1-conjugate(rho)=(1-beta)+i gamma` another zero.  Applying (2.1) to that
zero gives `beta>delta_T`.  Consequently

\[
 \operatorname{dist}(s_\rho,\{|\Im z|=\tfrac12\})
 =\min\{\beta,1-\beta\}>\delta_T.                          \tag{3.3}
\]

Every disk `D(s_rho,r_T)` stays in the Mellin strip, and every point `x+iy`
in it satisfies

\[
 \epsilon(y):=\tfrac12-|y|\geq\frac{3\delta_T}{4}.         \tag{3.4}
\]

Equations (3.1)--(3.4) use zero-free exclusion and symmetry only.  They do not
replace `beta` by `1/2`.

## 4. An explicit local overlap with no direct database input

The lower finitely many dyadic blocks can be bounded by one total count.  Set

\[
 U=2(T_0+1)=61\,220\,092\,002
\]

and

\[
 Z_{\rm finite}=1+M(U)-\frac18+R(U).                        \tag{4.1}
\]

By (2.5), `N(U)<Z_finite`.  Hence every overlap in every block
`3<=T<T_0+1` is at most `Z_finite`, counted with multiplicity.  Independent
80-digit reconstruction gives

\[
 214355242606<Z_{\rm finite}<214355242607.                  \tag{4.2}
\]

The size of (4.2) is irrelevant to convergence because it is used for only
finitely many dyadic blocks.  Its virtue is that it is an explicit theorem
constant derived without a zero list.

Now suppose `T>=T_0+1`.  A point can lie in disks whose center ordinates are
in an interval `(a,b)` of length `2r_T<1`.  Since the horizontal union of the
disks is contained in `[T-r_T,2T+r_T]`,

\[
 a\geq T-2r_T>T_0,
 \qquad b\leq2T+2r_T<2T+1.                                 \tag{4.3}
\]

Using (2.5) at both endpoints makes the two `1/8` terms cancel:

\[
 N(b)-N(a)
 \leq M(b)-M(a)+R(a)+R(b).                                 \tag{4.4}
\]

Here `M'(u)=(2\pi)^{-1}\log(u/(2\pi))`, `R` is increasing, and `b-a<1`.
Writing `B=2T+1`, the deliberately rounded bound

\[
 \boxed{Z_{\rm high}(T)=1+\pi^{-1}\log B+2R(B)}             \tag{4.5}
\]

dominates (4.4).  Define the binding overlap by

\[
 Z(T)=
 \begin{cases}
 Z_{\rm finite},&3\leq T<T_0+1,\\
 Z_{\rm high}(T),&T\geq T_0+1.
 \end{cases}                                                \tag{4.6}
\]

For reference, independent reconstruction gives

\[
 34.44<Z_{\rm high}(T_0+1)<34.46.                           \tag{4.7}
\]

The discontinuity between (4.2) and (4.7) is only slack in a finite cover.

## 5. Independent submean and Plancherel constants

Let `F` be holomorphic in the open strip `|Im z|<1/2`.  Submean on each disk,
followed by (4.6), gives for positive ordinates

\[
 \sum_{T\leq\gamma<2T}|F(s_\rho)|^2
 \leq\frac{Z(T)}{\pi r_T^2}
 \int_{|y|\leq1/2-3\delta_T/4}
 \int_{T-r_T}^{2T+r_T}|F(x+iy)|^2\,dx\,dy.                 \tag{5.1}
\]

Multiplicity is already included in `Z(T)`.  Since `r_T=delta_T/4`, the disk
factor is exactly

\[
 \frac1{\pi r_T^2}=\frac{16}{\pi\delta_T^2}.               \tag{5.2}
\]

Use the Fourier convention

\[
 F(x+iy)=\int_{\mathbb R}e^{yt}O(t)e^{-ixt}\,dt.            \tag{5.3}
\]

Put `h=1/(2T)`.  The exact reconstruction gives
`0.014<delta_3<0.015`, and `delta_T` decreases, so `r_T<1/4`.  On the
horizontal interval in (5.1),

\[
 \frac{11}{24}<hx<\frac{25}{24}.                            \tag{5.4}
\]

With `u=hx/2`, `sin u>=u-u^3/6` yields the rational certificate

\[
 |e^{ihx}-1|^2=4\sin^2u
 \geq\frac{22720437289}{110075314176}>\frac1{10}.           \tag{5.5}
\]

Plancherel for (5.3) is
`integral |F(x+iy)|^2 dx=2*pi*||e^{y dot}O||_2^2`.  Therefore

\[
 \int_{T-r_T}^{2T+r_T}|F(x+iy)|^2\,dx
 \leq20\pi\|\tau_h(e^{y\cdot}O)-e^{y\cdot}O\|_2^2.        \tag{5.6}
\]

Multiplying (5.2) and (5.6) gives the exact positive-height prefactor

\[
 16\cdot20=320.                                             \tag{5.7}
\]

A safe factor four covers the negative-height block and the polarized-product
inequality.  Thus the global prefactor used by the sampling argument is

\[
 \boxed{4\cdot320=1280.}                                    \tag{5.8}
\]

No positivity of the Weil form is used in (5.1)--(5.8).

## 6. Dyadic series and convergence

The independently proved weighted translation theorem has displayed integer
`q=1` and coefficient `D_S(lambda)*d_4`.  Equations (3.4) and (5.1)--(5.8)
therefore give
the explicit high-zero majorant

\[
 1280D_S(\lambda)d_4
 \sum_{j\geq0}Z(T_j)\frac43
 \delta_{T_j}^{-3}
 (2T_j)^{-3\delta_{T_j}/4},
 \qquad T_j=3\cdot2^j.                                     \tag{6.1}
\]

The producer and verifier reconstruct every source-audit factor in (6.1)
independently.
The producer uses Python `Decimal` with Machin reconstruction of `pi`; the
verifier uses `mpmath` and does not import producer constants or booleans.
Both reject binary64 decimal input.

The convergence proof is elementary.  Put `x=log(2T)`.  The last factor is

\[
 \exp\left[-\frac{3}{4\cdot55.241}
       \left(\frac{x}{\log x}\right)^{1/3}\right].          \tag{6.2}
\]

For all sufficiently large dyadic blocks, (4.5) and every inverse power of
`delta_T` are a fixed polynomial in `x` and `log x`.  For every fixed `p`,

\[
 \frac{(x/\log x)^{1/3}}{\log x}
 =\frac{x^{1/3}}{(\log x)^{4/3}}\longrightarrow\infty,      \tag{6.3}
\]

so the stretched exponential in (6.2) eventually dominates `x^p` by more
than `x^2`.  Since `x=log 6+j log 2` on the locked schedule, the remaining
tail is bounded by a constant multiple of `j^{-2}`.  The finitely many terms
using (4.1) do not affect convergence.

Equation (6.1) is an explicit convergent series, not a practical numerical
constant: the first terms are enormous and decay begins very late.  No finite
ball evaluation of the whole series is claimed or needed for this source
audit.

## 7. Finite-height dependencies and the low block

MTY's proof of Theorem 1.1 uses Platt--Trudgian's rigorous finite verification
for `3<=|t|<=3*10^12`.  The pinned Platt--Trudgian Theorem 1 actually reaches
the exact height

\[
 3\,000\,175\,332\,800.                                    \tag{7.1}
\]

Their Section 2 reports Arb ball arithmetic and a Turing-method count.  This
repository checks the paper bytes and statement but does not replay the
multi-million-core-hour computation.  MTY also uses numerical optimization in
its high-range proof.  HSW reports Maple computations for its admissible Table
2 constants.  These are external published-theorem dependencies, not producer
certificates generated here.

For the finite block `0<|gamma|<3`, (7.1) places any such zero on the central
line without enumerating it.  Disks of radius `1/4` then remain in the Mellin
strip.  Their total multiplicity is bounded by `Z_finite` from (4.1), not by a
zero table.  The weighted `L2` part of the admitted translation theorem
supplies the same submean calculation for the finite low-block contribution.
The resulting constant, including both height signs and polarized
bookkeeping, is `C_low=128 Z_finite`; see
`OUTER_OUTER_SPECTRAL_THEOREM.md`.

The LMFDB-dependent HSW Corollary 1.2 is not used directly in the overlap
formulas (4.1)--(4.6), and no decimal zero parameters enter either
implementation.  It remains an indirect dependency of the external MTY
zero-free theorem through MTY equation (3.8); that computation is disclosed
but not replayed.

## 8. Admission boundary

The exact source lock is `ZERO_SAMPLING_SOURCE_LOCK.json`.  The producer-side
validator is `src/zero_sampling_source_lock.py`; the independent replay is
`verifier/zero_sampling_source_replay.py`; adversarial tests are in
`tests/test_zero_sampling_source_lock.py`.

What is now locked:

1. exact source versions, bytes, theorem locations, constants, and height
   ranges;
2. the functional-equation derivation of the two-sided strip margin;
3. a multiplicity-aware piecewise local count with no direct database input;
4. the exact constants `1/10`, `320`, and `1280`; and
5. convergence of the dyadic series used by the admitted weighted input.

The separately admitted completion is now:

1. `OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md` proves the full reflected
   Volterra/bump estimate with `q=1` and `D_S(lambda)=O(lambda^7)`;
2. `OUTER_OUTER_SPECTRAL_THEOREM.md` supplies the full closed-strip Fejer/BV
   domain passage and combines it with this lock to prove
   `|W_Z(O_lambda,O_lambda)|/d_8 -> 0`; and
3. after the other three remainder pairings, the exact radical identity gives
   the unnormalized scalar energy `q_lambda(p,p)=o(d_8)` on the locked
   schedule.

What remains open is the residual action, the signed even/odd sector floors,
the shifted-resolvent decay required by equation (5.2), and locally uniform
determinant convergence.  The scalar outer--outer theorem supplies none of
those operator conclusions.  Accordingly, this source lock and its admitted
sampling use do not promote the formal project status.
