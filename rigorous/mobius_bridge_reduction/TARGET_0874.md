# An open restricted-moment route to B = 0.874

22 October 2026. **This is a reduction to a new, unproved arithmetic estimate.
It does not improve the established status of the preceding checkpoint.**

The target is `B = 437/500 = 0.874`, a decrease of `17733/20000000 = 0.00088665`
from the preceding conditional `0.87488665`. The resulting symmetric strip
would be `[0.126, 0.874]`. The implication below retains all the imported
analytic hypotheses of [Xu–Sang v2](https://arxiv.org/html/2610.15291v2) and
adds the explicitly open hypothesis (H). No novelty or literature-record
claim is made.

## The missing estimate

Use the physical row classes, numerator blocks, selected primes, character
presentations, masks, profiles, and uniformity conventions of that source.
For `1/8 <= delta <= 5/6`, let `Bcal` be a detected nonunit amplitude class
at scale `U`, with row-count exponent `R = R_kappa(delta,x)`. Let `S_m` be a
centrally normalized block in the reflected numerator's approximate
functional equation and `Q_sel` an allowed selected prime product.

**Open hypothesis (H):** for the blocks and selections used below,

$$
\sum_{u\in\mathcal B}|S_m(u)|^4|Q_{\rm sel}(u)|^2
\ll U^{39/40+\varepsilon}(1+H)^{A}.
$$

For `0 <= m <= 1/2`, the selection has length
`z_p = (1-2m)/(6*kappa)` whenever this fits the physical supply.
For `m >= 1/2`, use the empty selection. Very short supply-limited blocks
are handled by absolute counting below, so (H) is not needed for them.
The estimate must hold with the source's smooth-profile and polynomial-height
uniformity, all relevant fixed twists, and one compatible prime-slot system
chosen before the large scale. A fixed-height or finite-row experiment is
insufficient.

Compared with the existing moment bound, (H) requests an extra `U^(-1/40)`
on this restricted class. The class is selected partly through inverse
polynomials with Möbius coefficients. Thus (H) asks whether those detections
force a saving in the numerator moment. The detector and numerator characters
need not coincide; a proof must retain their actual twists.

## Derivation of the target

Set

$$
b=\frac1{25},\quad \ell=\frac{64}{375},\quad
\kappa=\frac{29991}{40000},\quad h=\frac{97}{125},\quad
\eta=\frac1{160}.
$$

The existing first-stage boundary `69991/80000` licenses this `kappa`.
The direct-bound relation gives `11/12 - ell/4 = 437/500`.

Write `q = delta*x` and `theta = q/(6*kappa)`. On a selected amplitude
class, `|Q_sel|^2 >= U^(2*q*z_p-epsilon)`. Hölder applied to (H) gives

$$
\sum_{u\in\mathcal B}|S_m(u)|
\ll U^{(3R+1)/4-\eta-qz_p/2+\varepsilon}(1+H)^{A'}.
$$

For `m <= 1/2`, multiplying by the block coefficient `U^(-theta*m)`
leaves the exponent `(3R+1)/4 - eta - theta/2`. For larger blocks,
the empty-selection bound and `m >= 1/2` give the same upper bound.

There is a supply issue for very short blocks. Put
`L = ell/d` and `m0 = 1/2 - 3*kappa*L` when `m0 > 0`.
Absolute counting for `m <= m0` suffices if

$$
R+4\eta\le (6\kappa-2q)\mathscr L.
$$

This strengthened condition is checked, not assumed. With the retained
row extension `zeta = 1/1000000`, the coarse row-count bound gives

$$
(6\kappa-2q)\mathscr L-R-4\eta
\ge \frac{1884239}{93120120}>0
$$

throughout the required range `d <= h+zeta`, `delta >= 1/8`.
Consequently the full reflected numerator average gains `U^(-eta)`.

This changes the total row exponent to `Ecal(d) - eta*d`.
Its slope remains positive: the source's lower slope bound becomes
`7/200 - 1/160 = 23/800`. Its upper slope remains at most 2.
The critical endpoint is therefore

$$
E_{\rm new}(\delta,x)=E_{b,\ell,\kappa}(\delta,x)-\frac{h}{160}.
$$

The supplied exact certificate proves

$$
E_{\rm new}(\delta,x)<-\frac1{10000}
\quad(0\le\delta\le5/6,\ 0\le x\le1/2).
$$

It clears the positive denominator and verifies coefficientwise positivity
of `A(y)` and `4*A(y)*C(y)-Bpoly(y)^2`, where `y=1/2-x`, then completes
the square in `delta`. A separate evaluation of the rational endpoint on
a sufficient exact interpolation grid checks the polynomial identity.

All unchanged scalar gates pass, including small `delta`, the detector
floor, and small rows. Choose `g=1/10000`, `zeta=1/1000000`, and
`gstar=1/20000`; then `g-2*zeta>gstar`. The unchanged contour, local-error,
tail, and closure arguments therefore yield `B=0.874` **if (H) holds with
the required uniformity and the source's analytic inputs hold**. This is
a modification of the high-side proof; it is not an application of the
unmodified admissibility theorem to inadmissible parameters.

## Why the current estimates do not prove (H)

Knowing only `#Bcal <= U^R` and a global fourth-moment bound of size `U`
cannot force an extra power saving. An abstract saturation example has
`U^R` entries of size `U^((1-R)/4)`, supported on the selected class.
Its fourth moment is `U` and its first moment is `U^((3R+1)/4)`.
Integer rounding does not change the exponents. This shows that the
Hölder step is sharp given those two inequalities alone; it is not an
arithmetic counterexample to (H).

For these target parameters the old endpoint is strictly positive at
`delta=x=1/2` (greater than `0.004`, checked exactly). Setting the new
saving to zero therefore fails. Calling the rows rare, treating their
phases as independent, or rearranging the existing inequalities would
leave a gap.

The next arithmetic task is to expand the numerator fourth moment with
the detector restriction retained. A successful proof must control the
joint detector/numerator terms and show that concentration on the detected
class loses at least `1/40` in the exponent. An unrestricted large-sieve
bound alone does not do this. No such joint estimate is proved in this
checkpoint.

For the separate direct Möbius-packet route, this same boundary requires
block energy `O(exp(0.748*j))`. No improvement of the remaining signed
correlations is supplied by the conditional moment calculation above.

## Reproduce

```bash
python3 -E target_0874.py
python3 -E target_0874.py --json > /tmp/target_0874_certificate.json
diff -u target_0874_certificate.json /tmp/target_0874_certificate.json
```

The checker uses only Python's standard library, refuses optimized Python,
and prints the unproved status on a successful run. The JSON records all
rational margins and integer polynomial coefficients. Its success certifies
the numerical implication, not (H), the imported analytic inputs, or a new
zero-free theorem. The original checkpoint checksum manifest is unchanged;
these follow-up files are outside that original manifest.
