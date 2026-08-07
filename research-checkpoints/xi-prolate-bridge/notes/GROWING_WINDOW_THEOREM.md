# Growing additive prolate-window theorem

## 1. Scope and source lock

This note proves two facts about the positive additive prolate comparison
model:

1. its source-coordinate Gram matrices remain full rank for an arbitrarily
   growing family, including after the actual plus-anchor deflation;
2. an explicit `O(log lambda)` buffer beyond the Shannon index leaves an
   additive high sector with concentration defect at least `1/2`.

The nonasymptotic eigenvalue input is Karnik--Romberg--Davenport,
arXiv:2006.00427v2, Corollary 3, pinned by exact PDF hash in
`P2_SOURCE_LOCK.json`.  Its Section 6.2 DPSS-to-PSWF comparison is traced to
and pinned at Boulsane--Bourguiba--Karoui, arXiv:1905.08354v1, Proposition 1
(32)/(37); both source PDFs are hashed and independently inspected.

These statements concern the positive sinc-kernel leakage Gram.  They do not
compare it with the signed Weil form, prove a shifted-sector floor, bound the
resolvent, or imply RH.

## 2. Exact additive leakage coordinates

Let `h_(n,lambda)`, `n=0,2,4,...`, be the orthonormal even prolate modes on
`[-lambda,lambda]`.  Write

\[
 I_n=\int_{-\lambda}^{\lambda}h_{n,\lambda}(x)\,dx,
 \qquad
 \Lambda_n=\chi_n(\lambda)^2,
 \qquad d_n=1-\Lambda_n.
\]

If `e_n` denotes the corresponding source-coordinate vector, Fourier
unitarity and the compressed prolate eigenrelation give the exact identity

\[
 \left\langle(1-P_\lambda)\mathcal Fh_{n,\lambda},
                    (1-P_\lambda)\mathcal Fh_{m,\lambda}\right\rangle
 =d_n\delta_{nm}.                                  \tag{2.1}
\]

Every `d_n` is strictly positive.  Equality `d_n=0` would make the Fourier
transform of the nonzero compactly supported mode also compactly supported;
its entire extension would then vanish on an open real set and hence
identically.  Fourier unitarity gives the contradiction.  Thus the
determinants below are genuinely positive at every finite `lambda`, although
this argument gives no useful quantitative lower scale for leading modes.

Consequently, for any source coefficient matrix `C`,

\[
 B=C^*C,
 \qquad
 G_{\rm add}=C^*\operatorname{diag}(d_n)C          \tag{2.2}
\]

are respectively its source `L2` Gram and positive additive-leakage Gram.

### Minus family

For distinct targets `t_j in {6,10,14,...}`, put

\[
 a_j=I_{t_j}/I_2,\qquad
 c_j^-=-e_{t_j}+a_je_2.
\]

These are exactly the zero-integral source columns.  With
`a=(a_j)` and `D_T=diag(d_(t_j))`, their unique target rows give

\[
 B_-=I+aa^*,
 \qquad
 G_-=D_T+d_2aa^*.                                  \tag{2.3}
\]

Thus

\[
 B_-\succeq I,\qquad G_-\succeq D_T.               \tag{2.4}
\]

The matrix determinant lemma now gives

\[
 \det G_-=\left(\prod_jd_{t_j}\right)
 \left(1+d_2\sum_j\frac{|a_j|^2}{d_{t_j}}\right),
 \qquad
 \det B_-=1+\|a\|^2.                               \tag{2.5}
\]

The shared base row cannot cause a growing-window rank loss.

### Plus family with arbitrary physical anchor deflation

To avoid conflict with the fixed scalar in `P0_NORMALIZATION_AUDIT.md`, write

\[
 \rho_4=-I_4/I_0,\qquad c_4=e_4+\rho_4e_0,
\]

and, for distinct targets `t_j in {8,12,16,...}`,

\[
 \rho_j=-I_{t_j}/I_0,\qquad c_j=e_{t_j}+\rho_je_0.
\]

Let `T_(+,N)` be the actual physical map: arithmetic transform, exact
evenization, and projection into the plus sector.  Put

\[
 p_4=T_{+,N}c_4,\qquad p_j=T_{+,N}c_j,\qquad p_4\ne0.
\]

The locked source functions and this map preserve the real Hilbert subspace.
Consequently all `I_n`, `rho_j`, and the physical deflation coefficients
below are real; the stars in the Gram formulas may equivalently be read as
transposes.  No unproved complex-conjugation convention is hidden here.

The implemented deflation by `kappa=p_4/||p_4||` is

\[
 p_j-\kappa\langle\kappa,p_j\rangle
 =T_{+,N}(c_j-\alpha_jc_4),\qquad
 \alpha_j=\frac{\langle p_4,p_j\rangle}{\|p_4\|^2}. \tag{2.6}
\]

No estimate on `alpha_j` is needed.  The exact deflated source column is

\[
 \widetilde c_j=e_{t_j}-\alpha_je_4
                +(\rho_j-\rho_4\alpha_j)e_0.       \tag{2.7}
\]

With `alpha=(alpha_j)` and `b=rho-rho_4 alpha`,

\[
 B_+^{\rm def}=I+\alpha\alpha^*+bb^*,
\]

\[
 G_+^{\rm def}=D_T+d_4\alpha\alpha^*+d_0bb^*.     \tag{2.8}
\]

Hence, for every physical deflation vector,

\[
 B_+^{\rm def}\succeq I,
 \qquad G_+^{\rm def}\succeq D_T.                 \tag{2.9}
\]

Writing

\[
 u=\alpha^*D_T^{-1}\alpha,\qquad
 v=b^*D_T^{-1}b,\qquad
 z=\alpha^*D_T^{-1}b,
\]

the rank-two determinant lemma gives

\[
 \det G_+^{\rm def}
 =\left(\prod_jd_{t_j}\right)
 \left(1+d_4u+d_0v+d_4d_0(uv-|z|^2)\right)
 \geq\prod_jd_{t_j},                               \tag{2.10}
\]

by weighted Cauchy--Schwarz.  An analogous formula proves
`det(B_+^def)>=1`.

These are source Grams, not physical projected Grams.  If `W` is the matrix
of physical columns and `R=W^*W>0`, the code applies `S=R^(-1/2)`, and
congruence preserves the anisotropic lower model

\[
 S^*G_\pm S\succeq S^*D_TS.                       \tag{2.11}
\]

Dimension counting alone does not prove that `R` is nonsingular or uniformly
conditioned.  `notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md` now proves
qualitative nonsingularity for every fixed finite analytic source family on
the locked half-integer schedule, using an unmatched arithmetic breakpoint.
That theorem is non-effective and supplies no uniform lower scale for `R`.

## 3. Pinned transition-window bound

The repo/source parameter conversion is

\[
 c=2\pi\lambda^2,\qquad
 S_\lambda=\frac{2c}{\pi}=4\lambda^2,             \tag{3.1}
\]

and `Lambda_n(c)=chi_n(lambda)^2`.  Define

\[
 C_\lambda=\lceil S_\lambda\rceil,
\]

\[
 \beta_\lambda=\frac{2}{\pi^2}
       \log(200\lambda^2+25).                     \tag{3.2}
\]

Karnik--Romberg--Davenport Corollary 3 states, for every integer
`n>=C_lambda`,

\[
 \Lambda_n(c)\leq10\exp\left(
       -\frac{n-C_\lambda-6}{\beta_\lambda}\right). \tag{3.3}
\]

The factor in the denominator is `(2/pi^2) log(...)`; reversing the
`pi^2/2` placement changes the theorem and is forbidden.

Set

\[
 n_*(\lambda)
 =C_\lambda+6+\left\lceil\beta_\lambda\log20\right\rceil. \tag{3.4}
\]

Then (3.3) gives the explicit high-sector floor

\[
 n\geq n_*(\lambda)
 \quad\Longrightarrow\quad
 \Lambda_n\leq\frac12,\qquad d_n\geq\frac12.      \tag{3.5}
\]

There is no extra `+1`: `n_*` itself belongs to the high sector.  On the
trailing side, `+6` is the individual-eigenvalue constant; the different
trailing tail-sum estimate uses `+7`.  The leading individual bound (3.6)
also has its own `+7`, so the constants must always be read with their side
and inequality direction.

Thus the deterministic low window should contain targets `t<n_*`, not
`t<=n_*`.  The buffer beyond the Shannon index is only `O(log lambda)`.

For reference, the same corollary also gives

\[
 d_n\leq10\exp\left(
 -\frac{\lfloor S_\lambda\rfloor-n-7}{\beta_\lambda}\right),
 \qquad 0\leq n\leq\lfloor S_\lambda\rfloor-1.    \tag{3.6}
\]

This is an upper bound on the leading defects.  It must not be reversed into
the lower bound needed to invert the smallest low-window scales.

## 4. Label counts and bandwidth compatibility

Let `x=lambda^2`, `m=ceil(x)`, and use the current Fourier schedule

\[
 N=3m.
\]

Through the unbuffered Shannon threshold, the target counts are

\[
 r_+=\max(0,\lceil x\rceil-2),\qquad
 r_-=\max(0,\lceil x-1/2\rceil-1).                \tag{4.1}
\]

The ceiling form in (4.1) is essential at integer and half-integer values of
`x`, because the low-window convention is the strict inequality `t<4x`.
The total selected physical low dimension, including the plus anchor, is at
most `2m-2`, while the full matrix dimension is `6m+1`.

For the KRD-buffered window `t<n_*`, the exact counts are

\[
 r_+^{\rm buf}=\max\left(0,
       \left\lfloor\frac{n_*-1}{4}\right\rfloor-1\right),
\]

\[
 r_-^{\rm buf}=\max\left(0,
       \left\lfloor\frac{n_*-3}{4}\right\rfloor\right). \tag{4.2}
\]

They fit the plus and minus dimensions of `N=3m`.  This is only an absence of
a dimension obstruction.  Qualitative continuous-map injectivity is now
known at each fixed half-integer `lambda`, but the displayed bandwidth and
the growing physical family still need a uniform restricted-conditioning
theorem.

The independent differential-prolate Galerkin basis has a separate indexing
requirement

\[
 B\geq\lceil n_*/2\rceil.                          \tag{4.3}
\]

Choosing `B=N` is automatically enough for the Shannon-only window but can
fail for the buffered window at small `lambda` (for example, `lambda=2`
gives `n_*=27`, hence `B>=14`, while `N=12`).  This is an implementation
constraint, not a convergence theorem.

## 5. Remaining signed obligations

The following are still missing:

1. a lower bound of the correct scale for the fixed leading defects;
2. the normalized physical Gram determinant/minor lower bound needed for
   uniform conditioning of the arithmetic/parity/projection map on the
   growing source family;
3. a comparison of the complete shifted signed Weil form with (2.8),
   including invisible-bump cross terms;
4. a bound retaining the actual residual forcing orientation;
5. an outward-rounded prolate/Schur realization on an unbounded schedule.

The exact combined signed object to compare is now given by
`notes/CHEBYSHEV_ERROR_REWRITE.md`, not by three separate block norms.
