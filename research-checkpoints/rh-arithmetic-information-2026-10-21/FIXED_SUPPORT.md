# Fixed-support arithmetic positivity and extension boundaries

## Normalization

Extend `f` by zero outside `[-L,L]`, and set `F(t)=integral f(x) exp(-itx) dx`, `fhat=F/sqrt(2 pi)`. The domain is

`D_L = {f in L2 : supp f subset [-L,L], integral log(2+|t|) |fhat(t)|^2 dt < infinity}`.

There is no imposed zero endpoint trace. For normalized `f`, write `p_f=|fhat|^2`. With `psi` the digamma function and `Lambda` the von Mangoldt function,

`V_L(t) = Re psi(1/4+it/2) - log pi - 2 sum_(n<=exp(2L)) Lambda(n)/sqrt(n) cos(t log n) + C_L(t)`,

`C_L(t) = [2 sinh L cos(2Lt) + 4t cosh L sin(2Lt)]/(t^2+1/4)`.

Then `Q_L(f)=integral V_L p_f`; for arbitrary `f`, multiply by `||f||_2^2` after normalizing. The completion includes the pole term exactly once. Endpoint prime shifts do not matter because the support autocorrelation vanishes at distance `2L`.

## Internally replayed certificate at L=6/5

The full-domain conclusion is `Q_(6/5) >= 10^-55 I`, in physical `L2` norm. Its finite low space is the first 160 normalized Legendre modes after unitary scaling `x=(6/5)u`; the whole high complement is controlled analytically.

The proof package retains prime powers `2,3,4,5,7,8,9,11` with their von Mangoldt weights and signed interference. Essential components are:

1. Exact low/cross arithmetic and logarithmic boundary potential. Dyadic Chebyshev completion error is below `1.279878e-63`, with both required error payments.
2. A signed negative-symbol majorant on 17,319 original cells, 34,638 two-point Gauss nodes, and the analytic infinite tail. The Gauss debit is below `1.062626e-5`; node displacement costs below `3.006103e-8`.
3. A matching norm transfer below `2.480077479726`, conservatively using `a=2.485` and effective baseline `delta=2.49997`.
4. Forty-seven disjoint positive-symbol cells used as exact-average ports, including quadrature, mixed, and self-Gram error payments.
5. All `160 * 34,638 = 5,542,080` complete Fourier couplings. The independent serial export and original split export agree in every shared coupling field. No high-Legendre coupling tail is discarded.
6. Residual verification of an arbitrary inverse proposal, followed by a directed 160-pivot LDL comparison. The final last pivot exceeds `0.5503947703583926`; a pivot is not an eigenvalue lower bound.

The accompanying canonical shifted-xi transfer has `B<60.080620067` and remaining slope `>9.899865633e-56`, giving

`||H_(omega,6/5)|| <= exp(-9e-56 omega) < 1`, `0 < omega <= 10^-29`.

This is **identity-only**. The prior smaller-support `0.03` relative-leakage coefficient is not asserted here. The full package is not included in this commit; see the precise [reproduction boundary](REPRODUCIBILITY.md).

## L=5/4 comparison failures

At `N=160`, a fresh support-dependent completion has error below `2.061e-70`, so approximation precision is not the obstruction. The original full-prime coarse comparison has directional inverse-Schur minimum about `-0.54939552`. An exact-prime-11 alternative improves frame geometry but not enough coupling control: an enclosed scalar baseline near `0.01403262862325138` is exceeded by a directed four-node penalty near `0.01663547968829880`. The frozen block-model trial is at most `-0.002602851065047418`, with radius below `1.80e-36`.

The model uses redistributed diagnostic masses without a certified continuum error. This rigorous negative block value is therefore **not a negative value of actual Q**, not a counterexample to RH, and not a general obstruction to other comparisons.

At `N=180`, recomputed low/cross data and nested-projection checks improve the scalar threshold from about `3.18698` to `1.73964`, but the directional comparison remains about `-0.25468171`. Re-ranking the original positive pool with 32, 64, or 128 additional midpoint ports improves it only to approximately `-0.25447700`, `-0.25437691`, and `-0.25434349`. Those midpoint ports are diagnostics, not certified average-port replacements.

An exact derivative norm, `(1/3+1/sqrt(5)) L^3/pi`, halves an older midpoint debit. It improves a prospective norm estimate, not the negative coupling comparison. No automatic support bootstrap, monotone reserve recurrence, or all-scale inference follows.
