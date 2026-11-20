# Quotient and bridge-coupling audit

This is a finite numerical audit plus two exact algebraic comparisons. It uses the existing completed-ξ/heat evaluator and bridge definitions in `zeta-view/dist/research-math.js`. All numerical spectra, tail probes and multiprecision results below are exploratory computations, not interval certificates or global inequalities. In particular, a small finite eigenvalue is not a uniform margin.

## 1. The invariant quantity to compare

Fix the same frozen/live coefficient spaces and write

\[
Q=\begin{pmatrix}C&B^*\\B&A\end{pmatrix},\qquad A>0,\ C>0.
\]

The relevant dimensionless coupling is

\[
T=A^{-1/2}BC^{-1/2},\qquad \rho=\|T\|,
\]

because

\[
A^{-1/2}(A-BC^{-1}B^*)A^{-1/2}=I-TT^*.
\]

Thus positivity of this finite Schur complement is equivalent to `rho<=1`. A strict bound `rho<=q<1` gives the relative estimate `A-BC^-1 B* >= (1-q²) A`. The hypothesis that both diagonal blocks are positive is essential; the negative quadratic control below violates it.

An invertible blockwise change of coordinates replaces

\[
(C,B,A)\longmapsto(S_C^*CS_C,\ S_A^*BS_C,\ S_A^*AS_A).
\]

After whitening, the new `T` differs from the old one by a left and right unitary map. Equivalently, the generalized eigenvalues of `(BC^-1 B*,A)` are unchanged. Therefore **all normalized coupling singular values are invariant**, even though `||B||` alone can change substantially. Complex conjugation also preserves these singular values. This is the relevant algebra for the Klein conjugating transition.

Likewise, doubling a quadratic form as `Q ⊕ conjugate(Q)` does not improve rho. The normalized real-linear embedding `z -> (z,conjugate(z))/sqrt(2)` preserves its real quadratic value; using an unnormalized embedding merely multiplies every block by two, which cancels in rho. These are exact bookkeeping facts. They do not substitute for proving that a proposed integral transform intertwines the actual bridge operator and its domain.

A basis change mixing the frozen and live spaces changes the partition being tested. Its rho can change, but that is a different decomposition, not an improvement obtained from expressing the same fixed split in quotient coordinates.

## 2. Actual ξ/heat finite matrices

The first two sample nodes are the frozen block. All rows below use the app's homogeneous bridge kernel, followed by its positive diagonal normalization. The positive real-node log-Pick checkpoint is a separate kernel.

| Case | Parameters | rho | Relative Schur margin `1-rho²` |
|---|---|---:|---:|
| ξ, local to first zero | `T=14.134725141734693, a=.25, x=.15`, offsets `−1,−.3,.3,1` | 0.99999984249748 | 3.15005014e−7 |
| ξ, wider first-zero window | same T, `a=.5, x=.3`, offsets `−3,−1,1,3` | 0.99982036000919 | 3.59247711e−4 |
| ξ, height 30 | `T=30, a=.5, x=.3`, same wide offsets | 0.94242365196995 | 0.1118376602 |
| ξ, height 60 | `T=60, a=.5, x=.3`, same wide offsets | 0.55235215125965 | 0.6949071010 |
| Heat, τ=.1 | first-zero wide parameters | 0.99981568714847 | 3.68591732e−4 |
| Heat, τ=−.1 | first-zero wide parameters | 0.99982492227420 | 3.50124799e−4 |
| ξ log-Pick | real nodes `.15,.35,.7,1.2` | 0.99999999996638 | 6.72390410e−11 |

The ξ rows were independently recomputed at **70 decimal digits** with mpmath's zeta/gamma functions rather than the app's Euler–Maclaurin evaluator. The largest entry discrepancy in these five matrices was `1.97e−13`. The first local row has minimum full-matrix eigenvalue about `6.97646796e−8`. The log-Pick row has minimum eigenvalue about `9.49606788e−12`, which the app's scale-dependent double-precision tolerance correctly labels unresolved. The 70-digit computation is still not a certified enclosure.

For all resolved-positive-block cases, an explicit nonsingular complex block congruence preserved rho to within `8.11e−15`; conjugation and duplicated-cover tests also agreed. The bridge/Pick presentations agreed in rho to within `8.89e−16`. Thus the small first-zero margin survives these representation changes; it is not enlarged by them.

The negative control `F(s)=(s−1/2)²−1/2` gives indefinite diagonal blocks for the local four-node configuration. The script declines to form an SPD-whitened norm. The on-axis control `F(s)=(s−1/2)²+1/2` has a rank-two full kernel and rho=1 up to rounding; its computed `−2.7e−15` relative margin is zero at working precision, not a negative theorem.

## 3. Why the elementary annulus gap does not transfer automatically

For the ordinary annulus Dirichlet-to-Neumann reference at frequency kappa,

\[
C=A=\kappa\coth(\kappa b),\quad B=-\kappa\operatorname{csch}(\kappa b),
\]

so

\[
\rho_n=\operatorname{sech}(\kappa_n b),\qquad
1-\rho_n^2=\tanh^2(\kappa_n b).
\]

Here `ell=4K(r^-4)`, `b=K(1-r^-4)` and `kappa_n=2π|n|/ell`. The zero mode has rho=1 and saturates the Schur condition. Removing it gives a positive reference margin controlled by the first nonzero mode.

| r | First nonzero reference rho |
|---:|---:|
| 1.15 | 0.436541651 |
| 1.2 | 0.389235286 |
| 1.6 | 0.201352512 |
| 2 | 0.126510498 |
| 3 | 0.055684923 |

This reference coupling changes strongly with the auxiliary elliptic shape, while the fixed spectral bridge matrix above has no r parameter. Varying r changes the reference annulus itself, together with any proposed transformed kernel and admissible subspace. Its improving reference gap is therefore not an estimate for the actual bridge until the exact intertwining/comparison and remainder bounds have been proved. It would be circular to keep the favorable reference gap but discard the corresponding r-dependence of that comparison.

Direct actual-ξ pullbacks at fixed spectral points, for both quotient charts, `r in {1.15,1.6,2,3}` and `L in {1,24}`, reproduced spectral values and conjugated phase. Maximum observed spectral-coordinate, log-amplitude and phase errors were respectively `5.06e−12`, `5.09e−12`, and `3.50e−12` radians. These sample checks verify implementation consistency, not a uniform geometric error bound.

## 4. Height parity does not decouple just because the transverse quotient does

For the boundary pair at `T−r,T+r`, write its real symmetric kernel matrix as

\[
P=\begin{pmatrix}D_-&C_r\\C_r&D_+\end{pmatrix}.
\]

The even/odd basis gives

\[
\frac12\begin{pmatrix}
D_-+D_++2C_r&D_--D_+\\
D_--D_+&D_-+D_+-2C_r
\end{pmatrix}.
\]

Consequently the two parity directions remain coupled unless `D_-=D_+`. The transverse reflection `(sigma,t)->(1-sigma,t)` does not exchange the two heights. At T=0 the reality symmetry supplies the height reflection, but around an arbitrary nonzero T it does not.

Actual ξ with `a=.5, T=14.134725141734693` gives:

| Half-separation r | `C_r/sqrt(D_-D_+)` | Normalized parity coupling |
|---:|---:|---:|
| 1 | 0.8713003103 | 0.9451523341 |
| 4 | −0.1082323837 | 0.9997284656 |
| 6 | −0.3466768823 | 0.9999968096 |

The last column is `|D_--D_+| / sqrt((D_-+D_+)²-4C_r²)`. Positive boundary matrices may have negative cross entries. A Cauchy–Schwarz absolute-value bound therefore cannot by itself give the signed inward average.

For the exact quadratic control with epsilon=−.25, `a=1,T=.3,h=.15`, the starting boundary is PSD but the reconstructed difference is negative. Its kernel is explicitly

\[
P_a(t_1,t_2)=2(a^2+2\varepsilon+t_1t_2),
\]

and the inward difference is `2(T²+h²+2epsilon)=−.775`. The app divides it by the common positive boundary normalization 1.18, producing `−.6567796610`. This is a direct control against treating PSD of the starting boundary as the missing propagation inequality.

Actual ξ does give positive differences in the sampled windows, but individual tails still require separate control. At height 60, `a=1,h=.15`, the [8,12] even and odd probes are about `7.64144e−5` each, while their difference is about `−1.22655e−11`. Neither the small signed tail nor the small quadrature residual certifies either infinite positive tail.

## 5. Independent algebra audit of the actual theta odd-kernel ordering

Let `kappa(v)=Phi(v/4)`, `kappa_tau(v)=exp(tau v²/16)kappa(v)`, and alpha>0. For the theta primitive

\[
H_\tau(x,y)=2\alpha\int_{|(x+y)/2|}^{\infty}
t\,\kappa_\tau(t-(x-y)/2)\kappa_\tau(t+(x-y)/2)\,dt,
\]

take x,y>0, c=(x+y)/2 and d=(x−y)/2. With `q=t²-c²`, the same-sign entry has squared arguments

\[
S\pm r_s,\quad S=q+c^2+d^2,\quad r_s=2|d|\sqrt{q+c^2}.
\]

The opposite-sign entry, after its own substitution `q=t²-d²`, has squared arguments

\[
S\pm r_c,\qquad r_c=2c\sqrt{q+d^2}.
\]

The common sum is `2S`, and

\[
r_c^2-r_s^2=4xyq>0\quad(q>0).
\]

The verified theta input is that `V(z)=−log kappa(sqrt(z))` is strictly convex for z>0. This follows after rescaling from Csordas, *Fourier transforms of positive definite kernels and the Riemann ξ-function*, arXiv:1309.0055v2, Theorem 4.2(b). The theorem states strict concavity of `log Phi(sqrt(z))`; it does not claim the global bridge positivity being sought here.

For convex V, `V(S+r)+V(S−r)` increases with r. Hence the opposite-sign product is strictly smaller for every q>0. The heat factor is the same on both products:

\[
\exp\!\left[\tau(2q+x^2+y^2)/16\right].
\]

It follows, with finite integrals supplied by theta decay, that

\[
\boxed{H_\tau(x,y)-H_\tau(x,-y)>0\quad(x,y>0,\ \tau\in\mathbb R).}
\]

The corresponding statement at x=0 or y=0 is equality. This establishes strict positivity of the odd half-line kernel entries and of its quadratic form on nonzero, fixed-phase nonnegative test functions for which the integral exists. **It does not establish positive semidefiniteness on sign-changing or general complex test functions.** That is exactly the extra step which cannot be supplied by merely replacing a matrix by its entrywise absolute value.

The script independently evaluated 15 `(x,y,tau)` cases at tau=−.3,0,.5. At tau=0, x=.35,y=.7, alpha=1:

\[
H(x,y)=0.00796066866118073,\quad
H(x,-y)=0.007107345458677903,
\]

and the positive difference is `0.000853323202502828`. Integrating the difference directly versus subtracting independently integrated entries agreed to about `5.5e−19`. The finite theta sum uses 12 positive-coordinate terms with even reflection; adaptive quadrature estimates are not rigorous remainder enclosures.

For the normalized four-node odd-kernel Gram at nodes `.15,.35,.7,1.2`, the computed smallest eigenvalue is about `9.38e−7`; its weakest vector has alternating signs, approximately `(-.559,.787,-.261,.033)`. At seven equally spaced nodes `.15,.30,...,1.05`, the smallest computed eigenvalue is only about `3.7e−14` and is **unresolved at double precision**. This is not an extrapolated proof of positivity. It identifies why the newly established positive-cone estimate leaves the oscillatory directions as the main task.

## 6. Reproduction and scope

Use zeta-view commit `e88a12315cf4423d77ddc89f961245d83b59204b` (the released merge of PR #2). Run the commands from this `numeric` directory; `requirements.txt` records the Python package versions used in the saved audit. The sampling command requires an explicit checkout path.

```bash
node sample-app.mjs /absolute/path/to/zeta-view > app-samples.json
python3 analyze-coupling.py
```

Files:

- `sample-app.mjs`: real app field, finite Gram/energy and quotient-pullback samples.
- `app-samples.json`: the exact sampled matrices and finite quadrature output.
- `analyze-coupling.py`: independent invariant checks, 70-digit ξ comparison, annulus reference, and theta half-line checks.
- `coupling-results.json`: numerical results, dependency versions, state parameters and scope labels.

The bridge matrices retain all complex entries. No diagonal repair, clipped negative eigenvalue, pseudoinverse, or regularization is used. The theta kernel's 12-term truncation and quadrature are numerical checks of an independently derived inequality; they are not its proof. The appropriate follow-through is a bound on the signed/oscillatory remainder in the same normalized energy spaces, including an explicit treatment of the zero mode and the infinity/tail terms.

Primary mathematical source: [Csordas, arXiv:1309.0055v2](https://arxiv.org/pdf/1309.0055), Theorem 4.2(b), printed page 11. Actual bridge definitions and source provenance: `zeta-view/docs/BRIDGE-RESEARCH.md` and `zeta-view/docs/KLEIN-ANNULUS.md`; the H kernel convention is the frozen Math Explorer PR43 boundary-energy construction being audited in the companion note.
