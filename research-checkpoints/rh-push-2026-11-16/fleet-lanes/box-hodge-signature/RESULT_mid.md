## 3. Signature tables

Reading of the columns. "certified a/b": the certificate of section 2.3 covers the first a of b stages. "inertia of
full form (+,-)": for the form on the fibre classes and the classes D_1..D_a. "min log10 abs pivot": smallest
certified |d_i|. "digits": decimal working precision of the run that completed. Stage m of a uniform run is the cutoff
c = (m-1)h, so every row certifies all smaller cutoffs on the same grid as well.

### 3.1 Zeta, uniform family (CERTIFIED)

__T_ZETA__

Every completed zeta run has inertia exactly (1, n+1): one positive eigenvalue, negative definite on the complement
of the fibre classes, no kernel. The run with X = e^20.73 = 1.0e9 used 120,896,183 primes (prime sum split into 125
segments on 6 workers, 1493 s). "height horizon T" = sqrt(2(ln(1/pivot_min) + c/2 + 5)/v): a zero above T changes every
entry by less than the smallest certified pivot times e^-5 (estimate, see section 8 item 2).

Runs with r other than 0.75 show the dependence of the conditioning on the width: at h = 0.02, n = 750 the smallest
pivot is 1e-7.6 (r = 0.3), 1e-19 (0.5), 1e-43 (0.75), 1e-77 (1.0), 1e-170 (1.5); the inertia is the same.

### 3.2 Davenport-Heilbronn, uniform family (CERTIFIED)

Rows marked "g=2 (proved)" use the proved tail bound of section 2.2; rows marked "g=1 (hypothesis)" were computed
earlier with the tail exponent 1 assumed (the entry radii are then conditional on |Lambda_DH(n)| <= n^1.5 beyond the
table); where both exist the stages agree.

__T_DH__

Positive eigenvalues arrive in pairs of stages (120 and 123; 222 and 227; ...): each off-line quartet contributes
two negative directions to Z (sibling lane, zero-side attribution: removing the quartet at height 85.70 removes the
first pair).

For r = 0.75 and pi/h > 85.7 the first failure is at c* = 3.53 to 3.57, X* = e^c* about 35, at every spacing from
0.03 to 0.0025, while the dimension n* runs from 120 to 1427. The window length depends on the width: c* = 3.21 to
3.28 (r = 1.5), 3.45 (r = 1.0), 3.66 to 3.87 (r = 0.5), 4.18 to 5.43 (r = 0.3).

Grid scan, 33 spacings x 7 width ratios (CERTIFIED; cutoff up to 9; proved tail bound). Cells "n/a" were not run (the
dense weight table exceeded the cap, section 7).

__T_SCAN__

Comparison with Pick order 149 (row P5): on grids that resolve height 85.7 the dimension at first failure is
c*/h + 1 and can be made as large as wanted (1427 at h = 0.0025). On coarser grids the off-line pair is seen through
aliasing at smaller dimension and longer window; the smallest dimension in the scan is the value printed above.
For h >= 0.13 no failure occurs within cutoff 9 for any width.

### 3.3 Other controls, uniform family (CERTIFIED)

"first failing stage" = first stage with more positive eigenvalues than the pole count (1 for the twists, 2 for EA).

__T_CTRL__

Twists and deletions at a single prime p (h = 0.03): c* = log p - delta with delta = 0.00 to 0.35 for p = 2 .. 100003;
at h = 0.01 (narrower bumps) delta = -0.06 to 0.05; at h = 0.1 delta = 0.19 to 1.51. The offset is the reach of a
Gaussian of width s = 0.75 h, so the failure occurs when the classes first reach log p. The sign of the change
(TW-, TW+, deletion) does not matter for the location. The Liouville twist and the random twists fail at the first
prime where they differ from zeta (c* = 0.50 to 1.09).

E_a: c* = 0.75 (a = 0.4) rising to 1.38 (a = 0.001) at h = 0.03; at h = 0.1, c* = 0.6 rising to 2.8. The first failure
moves out slowly as a -> 0 (roughly like log(1/a)); at a = 0 the object is zeta^2 and the baseline changes.

### 3.4 Prime-power family (CERTIFIED; fixed code only)

Classes D_q at log q, q = 1 and prime powers p^k <= X with p <= P, in increasing q; "first q" is the class at which
the first extra positive eigenvalue appears.

__T_PP__

Zeta: inertia (1, n+1) in every row, up to all prime powers below 10^4 (1281 classes, width 0.005, 128 digits;
821,121 entries, 2874 s on 6 workers) and below 3000 at widths 0.02 and 0.01. DH: with all prime powers as classes the first positive
eigenvalue appears at q = 563 to 647 (cutoff log q = 6.3 to 6.5), later than on the uniform grid (3.56) because the
prime-power nodes are sparse at small q; with only the powers of primes up to 7 or 31 as classes DH does not fail up to
X = 10^4, and with primes up to 101 it gains one positive eigenvalue at q = 8192.
A single-prime twist at p fails at or shortly after q = p when the class at log p exists (p = 101: q = 79 to 101 for
s >= 0.01), and at a later class when it does not (P = 7: q = 128). With all prime powers below 10^4 and s = 0.005
(128 digits): zeta (1,1282); DH nine positive eigenvalues, the first at q = 1087; tw-_101 thirty-seven extra, the
first at q = 179. With narrower bumps the first failing class moves out (DH: q = 563, 647, 641, 1087 for
s = 0.05, 0.02, 0.01, 0.005), because narrow bumps at sparse nodes give a diagonally dominant matrix: the diagonal of Z
grows like log(1/s) times the norm (sibling lane, section 3).

### 3.5 Backward heat (MEASURED entries; exact certificate given the stated radius)

Here the matrix is Z_t itself (zero side by contour integral), and the Lorentzian statement is "no positive pivot of
-Z_t". t is the de Bruijn-Newman time; t = 0 is zeta.

__T_HEAT__

For t >= -0.1 there is no failure up to the largest cutoff run (12.6 at h = 0.03). The first failure moves in as t
decreases; at h = 0.03: c* = 11.8 (t = -0.15), 9.4 (-0.2), 8.6 to 8.8 (-0.22 to -0.28), 4.6 (-0.3), 4.1 (-0.5), 2.8 (-1),
1.4 (-2), 0.9 (-4). On the finer grid h = 0.02 (band to height 157): 7.7 (t = -0.2), 4.1 (-0.3), 2.5 (-0.5), none to
cutoff 8 at t = -0.1. On the coarser grid h = 0.05: 9.4 (-0.3), 3.6 (-0.5), none to cutoff 11 at t = -0.2. As for DH,
the size of first failure depends on the grid, and for every grid and size some t < 0 passes. The jump between t = -0.28 and -0.3 is not attributed (a second off-line pair entering the band is the
likely cause; not checked). Rows with "certified" below n stop where the pivots reach the assumed radius.

## 4. Function-field calibration (CERTIFIED, exact)

`ff.py`. Classes H, V, G_0..G_30 on C x C with the intersection numbers of section 2.1's dictionary:
H.H = V.V = 0, H.V = 1, G_k.H = q^k, G_k.V = 1, G_j.G_k = q^min(j,k) N_|j-k| for j != k, G_k.G_k = q^k(2 - 2g).
Point counts by enumeration over F_q and F_{q^2}. The Gram matrix (33 x 33, integers) is exact; the inertia is read
from the characteristic polynomial (all roots real, so the number of sign changes of the coefficients is the number of
positive roots, and the multiplicity of the root 0 is the nullity). Second route: the normalised Toeplitz lags
`-sum_j (alpha_j/sqrt q)^m` through the same Arb pipeline as zeta (midpoint Levinson + certificate) for the 2g
nonsingular stages.

__T_CAL__

Outcome: every genuine curve gives exactly one positive eigenvalue and rank at most 2g+2 (rank 4 for
y^2 = x^5 + x + 1 over F_5, whose L-polynomial is (1 + 5T^2)^2). The five polynomials with real roots off the circle
give two positive eigenvalues, first seen at k = 1 (g = 1 and the squared factor) or k = 3 (one off-circle factor
times one genuine factor). Two reciprocal polynomials that I had listed as fakes have all roots on the circle and
give (1,5,27): the test cannot distinguish a Weil polynomial that comes from a curve from one that does not, as
expected. The Arb pipeline reproduces the signs: all pivots of -Z negative for genuine curves, a positive pivot at
stage 2 or 4 for the fakes.
