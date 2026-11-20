# Independent audit: eventual threshold-to-one-well Sonin extension

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **PASS for the stated eventual per-mode envelope, with unspecified onset and the stated exclusions.**

Reviewed frozen producer: `repo_leverage/EVENTUAL_THRESHOLD_SONIN_EXTENSION.md`, SHA256 `8bd7ac668d341b86d101329a54b3b89430c9a0256354f82e806448631fd85f94`.

The conditional ODE/Fourier lemma is independently proved in the already frozen `CONDITIONAL_SUPERCRITICAL_SONIN.md`. This receipt audits the ADDITIONAL concentration-width and differential-quantization argument. It does not alter that earlier packet.

## 1. Primary-source statements and conventions

The physical conventions agree: `c=2pi lambda²`, concentration eigenvalue `mu_n=|chi_n|²`, and the differential eigenvalue is nu_n. Three different eigenvalue notations must not be conflated.

I checked [Karnik–Romberg–Davenport](https://arxiv.org/html/2006.00427) directly:

* Lemma 2 places the DPSS eigenvalue with label ceil(2NW) at most 1/2.
* Lemma 3 gives convergence of each DPSS eigenvalue to the continuous concentration eigenvalue at c=pi NW when N grows with W=c/(pi N).
* Section 3.2 states the fixed-epsilon Landau–Widom transition COUNT with coefficient `(2/pi²)log((1-epsilon)/epsilon)` multiplying log c and error o(log c).

For each fixed c, `ceil(2NW)=ceil(2c/pi)` is independent of N. Taking the Lemma 3 limit therefore rigorously yields

    mu_ceil(2c/pi) <= 1/2.                                (A)

No moving-index interchange is involved in that limit. This uses the transition-width statement, not a coarser absolute counting error mislabeled as a smaller error.

I also checked [Bonami–Karoui, Theorem 1](https://arxiv.org/html/1405.3676v2). It applies for c>0 and n>=2. Their chi_n is our DIFFERENTIAL nu_n; their parameter q is c²/nu_n. In the regime nu_n>c², write the elliptic modulus as s=c/sqrt(nu_n)<1. Applying their increasing inverse-function bounds gives exactly

    pi*n/2 < sqrt(nu_n)E(s) < pi*(n+1)/2,
    n < J(nu_n,c) < n+1,                                 (B)

where `J(v,c)=(2/pi)integral_0^1 sqrt[(v-c²x²)/(1-x²)]dx`. No WKB-error hypothesis from a later theorem is needed for (B).

## 2. Threshold index bound, including endpoints

The signed-magnitude condition |chi_n|>=1/2 is precisely mu_n>=1/4. Let m(c) be its largest label. For labels from ceil(2c/pi) through m(c), (A) and strict concentration ordering put mu in [1/4,1/2]. This lies inside the Landau–Widom transition interval (1/4,3/4), except possibly one label with mu=1/4. A value mu=1/2 is already strictly inside that interval.

The endpoint correction and the ceiling cost are O(1), so

    m(c)<=2c/pi+[A+o(1)]log c,
    A=2log(3)/pi².                                       (C)

If m(c)<ceil(2c/pi), the bound is immediate. Alternatively, using fixed epsilon<1/4 and then taking epsilon upward to 1/4 proves the same limsup without relying on the single-endpoint argument. Counting ALL labels is conservative and safely bounds each parity/sign subset; no factor of four should be inserted in A.

## 3. Independent check of the action asymptotic

For fixed delta>0 put a=delta/c and

    I(a)=integral_0^1 sqrt[1+a/(1-x²)]dx.

The substitution s=1-x² gives an especially transparent derivative formula:

    I'(a)=1/4 integral_0^1
              ds/[sqrt(1-s)sqrt(s(s+a))].

Subtract `(1/2)asinh(1/sqrt(a))`, which equals one quarter of the same integral without the factor `(1-s)^(-1/2)`. The remaining integrand is nonnegative. Since `sqrt(s(s+a))>=s`,

    0 <= I'(a)-(1/2)asinh(1/sqrt(a)) <= (1/2)log 2.

The upper constant follows from the exact elementary integral

    integral_0^1 [(1-s)^(-1/2)-1]/s ds = 2log 2.

Integrating from 0 to a gives the explicit bounds

    L(a) <= I(a)-1 <= L(a)+(a/2)log 2,
    L(a)=(a/2)asinh(1/sqrt(a))+(sqrt(1+a)-1)/2.

Thus

    I(a)-1=(a/4)log(1/a)+O(a),
    J(c²+delta*c,c)-2c/pi
       =[delta/(2pi)]log c+O_delta(1).                    (D)

This independently verifies the exact logarithmic coefficient. Differentiation under the integral is legitimate for each a>0, and the displayed bounds justify integration down to zero. The source note's simpler endpoint-splitting proof has the same correct coefficient.

## 4. Uniformity over a moving threshold head

For v>c² the integrand makes J(v,c) strictly increasing in v. Suppose along arbitrarily large c a qualifying mode satisfied `nu_n>=c²+delta*c`, with FIXED `delta>2pi A`. Then (B) and (D) would imply

    n+1>2c/pi+[delta/(2pi)]log c+O_delta(1),

whereas (C) gives the incompatible upper coefficient A. Because delta is fixed in this contradiction, no uniformity of the O_delta(1) term for a moving eigenvalue is assumed.

It follows that

    limsup_(c->infinity) max_(|chi_n|>=1/2)
                   (nu_n-c²)_+/(2c)
       <= pi A = 2log(3)/pi < 3/4.                       (E)

The n>=2 condition in (B) is harmless: the trial spaces generated by 1 and x yield `nu_0<=c²/3` and `nu_1<=2+3c²/5<c²` for c²>5. These explicit variational checks avoid a hidden fixed-label asymptotic assumption.

Therefore every fixed rho strictly between 2log(3)/pi and 1 eventually controls the ENTIRE moving threshold set by `(nu_n-c²)_+<=2c*rho`. The coefficient is sufficient, not asserted optimal. The argument supplies no evaluated onset.

## 5. Exterior consequence and exact stopping scope

Combining (E), with rho=3/4, and the independently audited one-well lemma gives, eventually and mode by mode,

    |e_n(t)| <= 4|e_n(lambda)|
                /[pi|chi_n|sqrt(7)sqrt(t²-lambda²)],
    |F(e_n,zero-extended)(t)| <= 4|e_n(lambda)|
                /[pi sqrt(7)sqrt(t²-lambda²)], t>lambda.

The analytic continuation and the zero extension are distinguished here. The Fourier transform bound has no chi denominator. Complex phases are covered by the absolute-square Sonin energy. For subcritical nu<=c² the old monotone case is already stronger.

**Accepted:** an eventual, bounded-loss, per-mode exterior envelope relative to the endpoint value for the full Fourier-magnitude threshold, and in particular its positive-even subset. The local counterexample to nu<c² remains valid; it does not contradict this weaker supercritical allowance.

**Not obtained:** an explicit lambda_0, a small-lambda bridge, an endpoint trace bound in terms of leakage, a dimension-uniform estimate for arbitrary head combinations, signed Poisson–Möbius edge cancellation, an evenized Gram floor, a signed transition-head or gamma-complement theorem, or RH. In particular, an order-c number of modes cannot be inserted into a theorem requiring only O(log c) modes without paying or removing the modal-count loss.

The frozen producer states these exclusions correctly. No unresolved error in its mathematical implication was found. No novelty or publication-priority claim is made.
