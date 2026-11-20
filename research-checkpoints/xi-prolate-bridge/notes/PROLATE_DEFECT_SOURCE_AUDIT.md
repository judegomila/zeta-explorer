# Prolate concentration-defect source audit

## Claim boundary and admission status

This note audits one possible asymptotic input for the positive additive
prolate model.  It does **not** prove a comparison with the signed Weil form,
equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform determinant
convergence, or RH.

> **SOURCE-LOCK STATUS:** Slepian's primary 1964 derivation is pinned and
> admitted for the **qualitative fixed-index equivalence and its eventual
> consequences only**.  It is not admitted as an effective finite bound.
> The source gives no explicit constant or threshold for its `O(1/c)`
> remainder.

The binding source is David Slepian, *Prolate Spheroidal Wave Functions,
Fourier Analysis and Uncertainty--IV: Extensions to Many Dimensions;
Generalized Prolate Spheroidal Functions*, Bell System Technical Journal
**43** (November 1964), 3009--3057,
[doi:10.1002/j.1538-7305.1964.tb01037.x](https://doi.org/10.1002/j.1538-7305.1964.tb01037.x).
The manuscript date printed on page 3009 is June 12, 1964.  The lawful scan
from the [UC Davis archive](https://www.math.ucdavis.edu/~saito/data/ONR15/PSWF-IV.pdf)
is vendored as `vendor/SLEPIAN-PSWF-IV-1964.pdf`, with SHA-256

```text
86efb6b69f405a046914f19c07161329b3f455a93a58467cc8107cfa4a135351
```

and is locked by `PROLATE_DEFECT_SOURCE_LOCK.json`.

W. H. J. Fuchs, *On the eigenvalues of an integral equation arising in the
theory of band-limited signals*, J. Math. Anal. Appl. **9** (1964), 317--330,
[doi:10.1016/0022-247X(64)90017-4](https://doi.org/10.1016/0022-247X(64)90017-4),
is no longer needed as an unchecked dependency: Slepian derives the same
ordinary one-dimensional formula from his generalized equation.  The later
transcription in Bonami--Jaming--Karoui
[arXiv:1804.01257v1](https://arxiv.org/abs/1804.01257v1), Section 2.2, is
corroboration only.

## 1. Exact convention map

Let `lambda` denote the repository's interval parameter and let

\[
 (A_\lambda f)(y)
 =1_{[-\lambda,\lambda]}(y)
   \int_{-\lambda}^{\lambda}f(x)e^{2\pi ixy}\,dx
\]

on Lebesgue `L2([-lambda,lambda],dx)`.  With the unitary scaling

\[
 (U_\lambda f)(s)=\sqrt\lambda\,f(\lambda s),
 \qquad -1\le s\le1,
\]

direct substitution gives

\[
 U_\lambda A_\lambda U_\lambda^{-1}
 =\lambda F_c^+,
 \qquad
 (F_c^+g)(s)=\int_{-1}^1e^{icst}g(t)\,dt,
 \qquad
 \boxed{c=2\pi\lambda^2}.                       \tag{1.1}
\]

Consequently

\[
 (\lambda F_c^+)^*(\lambda F_c^+)=Q_c,
 \qquad
 (Q_cg)(s)=\int_{-1}^1
   \frac{\sin(c(s-t))}{\pi(s-t)}g(t)\,dt.       \tag{1.2}
\]

This normalization is also present directly in the binding source.  Slepian
page 3010, equations (1)--(2), writes

\[
 \alpha\psi(x)=\int_{-1}^1e^{icxy}\psi(y)\,dy,
 \qquad
 \Lambda=\frac{c}{2\pi}|\alpha|^2,
\]

and the iterated kernel in his equation (2) is exactly
`sin(c(x-y))/(pi*(x-y))`.  In the multidimensional notation, pages
3014--3015, equations (8) and (12)--(14), give the same relation as
`Lambda=(c/(2*pi))^D*|alpha|^2`.  Thus (1.2) is checked against the primary
source and does not depend on the inconsistent finite-Fourier prefactor
printed in arXiv:1804.01257v1.

For completeness, that later preprint prints the correct sinc kernel but
also `Q_c=(2c/pi) F_c^*F_c` for its unnormalized finite Fourier integral;
direct composition gives `c/(2*pi)`.  The lock therefore uses Slepian's
equations and the sinc kernel, not that factor-four typo.

For the even labels used in this project, the repository chooses the real
prolate mode so that

\[
 A_\lambda h_{n,\lambda}
 =(-1)^{n/2}\chi_{n,\lambda}h_{n,\lambda},
 \qquad 0<\chi_{n,\lambda}<1,qquad n\in2\mathbb Z_{\ge0}.
\]

If `Lambda_n(c)` denotes the `n`-th eigenvalue of (1.2), indexed from zero,
then the exact dictionary is therefore

\[
 \boxed{\chi_{n,\lambda}^{\,2}=\Lambda_n(2\pi\lambda^2)},
 \qquad
 d_n(\lambda):=1-\chi_{n,\lambda}^{\,2}
 =1-\Lambda_n(c).                               \tag{1.3}
\]

The square in (1.3) is mandatory.  Confusing the finite-Fourier amplitude
`chi_n` with the sinc-kernel energy eigenvalue `Lambda_n`, or replacing
`c=2*pi*lambda^2` by `2*pi*lambda`, changes the asymptotic.

## 2. Fixed-index formula and repository constant

### 2.1 Primary-source equation and one-dimensional label map

Slepian page 3033, equation (93), states for fixed generalized order `nu`
and fixed radial index `j` that

\[
 1-\Lambda_{\nu,j}(c)
 =\frac{\pi 2^{2\nu+4j+3}}
        {\Gamma(j+1)\Gamma(j+\nu+1)}
   c^{\nu+2j+1}e^{-2c}
   \left[1+O\!\left(\frac1c\right)\right].      \tag{2.1}
\]

Here `Lambda` is the concentration eigenvalue, not the finite-Fourier
amplitude.  The equation map leading to (2.1) is:

- pages 3027--3028, equations (67)--(68): the fixed-index eigenfunction
  asymptotic and its `L2(0,1)` normalization;
- page 3032, equations (84)--(86): the leading finite-transform amplitude,
  exact endpoint derivative identity, and normalization;
- page 3033, equations (89)--(90):
  `kappa^(-1) partial_c kappa=phi(1)^2/(2c)` and
  `kappa -> 1`;
- page 3033, equations (91)--(93): integration of that identity and
  conversion `Lambda=c*gamma^2`.

The ordinary one-dimensional labels are fixed by Slepian's Section VII,
not guessed from the differential equation.  Pages 3037--3039, equations
(110)--(113), set `D=p+2`.  For `D=1`, hence `p=-1`, the two harmonic degrees
`N=0,1` give generalized orders

\[
 \nu=N+p/2=-\tfrac12,+\tfrac12.
\]

The corresponding kernels in equation (113) are respectively
`sqrt(2/pi)*cos(crr')` and `sqrt(2/pi)*sin(crr')`; the text identifies them
as the even and odd ordinary prolate equations.  Therefore radial index `j`
maps to ordinary label `m=2j` in the even family and `m=2j+1` in the odd
family.

Set `nu=-1/2` and `m=2j` in (2.1).  The duplication identity

\[
 \Gamma(j+1)\Gamma(j+\tfrac12)
 =2^{-2j}\sqrt\pi\,(2j)!
\]

then gives, for each **fixed** ordinary even label `m`,

\[
 1-\Lambda_m(c)
 \sim 4\sqrt\pi\,\frac{8^m}{m!}
       c^{m+1/2}e^{-2c}.
                                                        \tag{2.2}
\]

The `nu=+1/2`, `m=2j+1` substitution gives the same formula for fixed odd
labels.  Thus (2.2) is exactly the ordinary Fuchs formula, now derived and
checked in the pinned primary Slepian scan.

Combining (2.2) with the exact convention map (1.1)--(1.3) gives the
repository-normalized qualitative asymptotic

\[
 d_n(\lambda)
 \sim A_n\lambda^{2n+1}e^{-4\pi\lambda^2},
 \qquad
 \boxed{A_n=4\sqrt2\,\pi\frac{(16\pi)^n}{n!}}. \tag{2.3}
\]

In particular, the powers for labels 4, 6, and 8 are respectively
`lambda^9`, `lambda^13`, and `lambda^17`, all multiplying
`exp(-4*pi*lambda^2)`.

### 2.2 Exact fixed-label constants and eventual consequences

At labels 4 and 8, (2.2) reads

\[
 d_4\sim \frac{2048}{3}\sqrt\pi\,c^{9/2}e^{-2c},
 \qquad
 d_8\sim \frac{524288}{315}\sqrt\pi\,c^{17/2}e^{-2c}.       \tag{2.4}
\]

Consequently

\[
 \boxed{c^4\frac{d_4}{d_8}\longrightarrow\frac{105}{256}},
 \qquad
 \boxed{\lambda^8\frac{d_4}{d_8}
        \longrightarrow\frac{105}{4096\pi^4}}.             \tag{2.5}
\]

As a rigorous consequence of these limits, there exist finite but
noncomputed thresholds `c_ratio` and `c_floor` such that

\[
 \frac{d_4}{d_8}\le \frac{105}{128}c^{-4}
 \quad(c\ge c_{\rm ratio}),                                  \tag{2.6}
\]

\[
 d_8\ge \frac{262144}{315}\sqrt\pi\,
            c^{17/2}e^{-2c}
 \quad(c\ge c_{\rm floor}).                                  \tag{2.7}
\]

The factor two and factor one-half in (2.6)--(2.7) are explicit; only their
starting thresholds are not.  Thus (2.5)--(2.7) are sufficient for purely
qualitative asymptotic algebra along any schedule with `lambda -> infinity`.
In particular, the fixed-window input requested in (6.5) of
`notes/NEAR_SIGNED_HANKEL_REDUCTION.md` is now available as
`d_4/d_8=O(c^(-4))`.  This does not prove the other hypotheses in that
reduction, including the geometric-mean coupling estimate, the projection
estimate, or a signed floor.

Formula (2.1) remains only a fixed-index equivalence.  Slepian prints an
unspecified `O(1/c)` in equations (91) and (93), and the preceding
normalization argument on page 3028 also leaves an unspecified constant and
power in `O(c^p*exp(-sqrt(c)))`.  The source gives no computable threshold
in `c` and no uniformity when the label grows with `lambda`.  Therefore
(2.6)--(2.7) cannot be invoked for any particular finite pilot pair, cannot
choose the first point of a deterministic replay schedule, and cannot serve
as a raw interval or ball bound.

## 3. Exact two-window Gram identities

The following identities are algebraic and do not require (2.1).  In the raw
orthonormal prolate coordinates, the positive additive leakage Gram is

\[
 G_{ij}=\sum_n \overline{a_{ni}}a_{nj}d_n.      \tag{3.1}
\]

For the two plus windows with targets 8 and 12 and common base 0, write

\[
 w_8^+=h_{8,\lambda}+a_8^+h_{0,\lambda},
 \qquad
 w_{12}^+=h_{12,\lambda}+a_{12}^+h_{0,\lambda},
 \qquad
 a_n^+=-\frac{\int h_{n,\lambda}}
                  {\int h_{0,\lambda}}.
\]

Then

\[
 G_+=
 \begin{bmatrix}
 d_8+(a_8^+)^2d_0&a_8^+a_{12}^+d_0\\
 a_8^+a_{12}^+d_0&d_{12}+(a_{12}^+)^2d_0
 \end{bmatrix},                                 \tag{3.2}
\]

and the rank-one `d_0^2` term cancels exactly:

\[
 \boxed{\det G_+
 =d_8d_{12}+d_0\big((a_8^+)^2d_{12}
                    +(a_{12}^+)^2d_8\big)}.     \tag{3.3}
\]

For the two minus-family windows with targets 6 and 10 and common base 2,

\[
 w_6^-=-h_{6,\lambda}+a_6^-h_{2,\lambda},
 \qquad
 w_{10}^-=-h_{10,\lambda}+a_{10}^-h_{2,\lambda},
 \qquad
 a_n^-=\frac{\int h_{n,\lambda}}
                 {\int h_{2,\lambda}},
\]

one similarly has

\[
 G_-=
 \begin{bmatrix}
 d_6+(a_6^-)^2d_2&a_6^-a_{10}^-d_2\\
 a_6^-a_{10}^-d_2&d_{10}+(a_{10}^-)^2d_2
 \end{bmatrix},                                 \tag{3.4}
\]

\[
 \boxed{\det G_-
 =d_6d_{10}+d_2\big((a_6^-)^2d_{10}
                    +(a_{10}^-)^2d_6\big)}.     \tag{3.5}
\]

The source-limit Hermite ratios are finite and nonzero:

\[
 a_8^+\to-\frac{\sqrt{70}}{16},\qquad
 a_{12}^+\to-\frac{\sqrt{231}}{32},\qquad
 a_6^-\to\frac{\sqrt{10}}4,\qquad
 a_{10}^-\to\frac{3\sqrt{14}}{16}.             \tag{3.6}
\]

At the admitted qualitative fixed-index level, (2.3) and (3.2)--(3.6) give

\[
 \begin{array}{lll}
 (G_+)_{11}\sim A_8\lambda^{17}e^{-4\pi\lambda^2},&
 (G_+)_{22}\sim A_{12}\lambda^{25}e^{-4\pi\lambda^2},&
 (G_+)_{12}\sim\dfrac{7\sqrt{330}}{512}A_0
                      \lambda e^{-4\pi\lambda^2},\\[2mm]
 (G_-)_{11}\sim A_6\lambda^{13}e^{-4\pi\lambda^2},&
 (G_-)_{22}\sim A_{10}\lambda^{21}e^{-4\pi\lambda^2},&
 (G_-)_{12}\sim\dfrac{3\sqrt{35}}{32}A_2
                      \lambda^5e^{-4\pi\lambda^2},
 \end{array}                                     \tag{3.7}
\]

and hence

\[
 \boxed{\det G_+
 \sim A_8A_{12}\lambda^{42}e^{-8\pi\lambda^2}},
 \qquad
 \boxed{\det G_-
 \sim A_6A_{10}\lambda^{34}e^{-8\pi\lambda^2}}. \tag{3.8}
\]

These are raw source-coordinate statements.  In the odd sector, the square
Loewdin Gram congruence replaces `G_-` by `T^*G_-T` and scales its determinant
by `|det T|^2`.  In the plus sector, finite-state deflation also subtracts the
external label-4 anchor.  It is therefore not a square congruence of the raw
`2 by 2` matrix (3.2).  One must first enlarge the raw prolate-coordinate
Gram to include the anchor, apply the rectangular deflation map, and only
then apply the square Loewdin congruence.  Without uniform control of that
full map, (3.8) does not automatically transfer to the physical two-window
matrices or to their comparison reserves.

## 4. Why no effective fixed-index bound follows

The body of arXiv:1804.01257v1, Theorem 3.2 and Lemma 3.3, proves the explicit
one-sided estimate

\[
 \Lambda_n(c)\ge
 1-\frac7{\sqrt c}\frac{(2c)^n}{n!}e^{-c},
 \qquad 0\le n\le c/2.7.                        \tag{4.1}
\]

The preprint's introductory equation (1.2) instead prints the larger range
`0<=n<2c/2.7`.  That range is inconsistent with the theorem and proof in the
body, so this audit retains only the conservative body range.

It follows only that

\[
 d_n(\lambda)\le
 \frac{7\,2^n}{n!}(2\pi)^{n-1/2}
 \lambda^{2n-1}e^{-2\pi\lambda^2},
 \qquad 0\le n\le\frac{2\pi\lambda^2}{2.7}.   \tag{4.2}
\]

This is exponentially larger than the fixed-index scale (2.3), supplies no
matching lower bound, and supplies no relative error at the
`exp(-4*pi*lambda^2)` scale.  It therefore cannot establish a two-sided
finite defect comparison, an effective lower bound at the leading
determinant scale (3.8), or either signed reserve in the two-window Sylvester
test.  It does not make the existential thresholds in (2.6)--(2.7)
computable: its exponential scale is different and its inequality points
only toward an upper bound for `d_n`.

Most importantly, the positive matrices (3.2) and (3.4) are not the signed
Weil Schur complements.  No Fuchs/Slepian asymptotic, exact positive Gram
identity, or pointwise numerical match supplies the missing direct estimate
for `pole - archimedean - prime`.  This audit adds no proof of equation
(5.2), no locally uniform determinant convergence, and no RH claim.

## 5. Reproducibility and fail-closed checks

`PROLATE_DEFECT_SOURCE_LOCK.json` records the source URL, DOI, 50-page scan,
hash, equation map, exact normalization dictionary, and the explicit
non-admission of every finite or signed conclusion.  The validator
`src/prolate_defect_source_lock.py` reconstructs the two rational
coefficients and their ratio without decimal input:

\[
 \frac{4\,8^4}{4!}=\frac{2048}{3},\qquad
 \frac{4\,8^8}{8!}=\frac{524288}{315},\qquad
 \frac{(2048/3)}{(524288/315)}=\frac{105}{256}.
\]

`tests/test_prolate_defect_source_lock.py` rejects changed PDF bytes or hash,
`c=2*pi*lambda` in place of `c=2*pi*lambda^2`, omission of the square in
`chi_m^2=Lambda_m`, a changed even/radial label map, a changed ratio
constant, and any attempt to promote the unknown threshold to a finite
bound.
