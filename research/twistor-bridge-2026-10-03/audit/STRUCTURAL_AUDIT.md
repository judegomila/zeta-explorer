# Structural audit and exact all-window criterion

3 October 2026. This independent mathematical review covers the split-projective Fourier construction, its chosen arithmetic completion, the local-to-global criterion, and the new analytic extensions of the signed-window certificate. It does not establish RH, claim literature priority, or replace proof-assistant verification.

## Verdict and precise scope

The Fourier coefficients, even harmonic dimensions, width-3/2 completion identity, and constant-mode norm reduction are consistent. The following distinctions are essential:

- After identifying the two compact pictures by an auxiliary Euclidean pairing, covariance is `A(w) pi_w(g) = pi_-w(g^-T) A(w)`. The SO(4) harmonic spaces are not invariant subrepresentations for the whole SL(4,R) action.
- `A(w)` is compact, bounded, and operator-norm holomorphic for `Re(w)>0`. Its unitary imaginary-axis values are strong boundary limits. For `0<x<2`, `||A(x)-A(0)||=1`; there is no operator-norm continuation to that boundary.
- The meromorphic continuation is a statement about homogeneous distributions or smooth sections, not a globally bounded operator on one fixed L2 space. The value `A(2)=P0` is a normalized continued value at an exceptional raw homogeneous weight.
- The Q-based local spaces, spherical vectors, characters, measures, and xi-completion factor are added arithmetic choices. Real incidence geometry does not uniquely force them. For real `0<w<1`, each selected prime scalar `(1-p^(-2-w))/(1-p^(-2+w))` exceeds one.
- Scalar Schur contractivity is known unconditionally for every `a>=1/2`. Only `a=3/2` is matched by this particular four-dimensional local-factor construction. The unresolved scalar range is `0<a<1/2`.
- A finite-window Hankel certificate is distinct from a global Schur theorem, and an unweighted scalar positivity statement must not be assumed as an energy definition.

These qualifications are present in the reviewed updated model view and foundational report section.

## An exact local-to-global theorem

Fix `a>0`. Use the report's explicit real kernel `h_a`, supported in `[1,infinity)`, and define `H_(a,L)` directly by its kernel `h_a(xy)` on `L2((0,L),dx)`. Define `N_a(L)=||H_(a,L)||`. The following are equivalent:

1. `sup_(L>1) N_a(L) < infinity`.
2. `N_a(L)<=1` for every `L>1`.
3. `R_a(w)=xi(1/2+w-a)/xi(1/2+w+a)` is Schur on `Re(w)>0`.

Moreover, `N_a(L)` is nondecreasing and tends to exactly one when these conditions hold, and to infinity otherwise.

### Proof

Smaller windows are orthogonal compressions of larger ones, proving monotonicity. Suppose the finite norms are bounded by a finite constant `C`. For a compactly supported input `f`, all sufficiently large finite operators give restrictions of one locally defined output. Monotone convergence of its squared norm shows this output lies in global L2 with norm at most `C||f||`. Density gives a bounded global operator `H_a` agreeing with the explicit kernel.

The inversion `Jf(x)=x^-1 f(1/x)` is unitary for measure `dx`. Substituting `y=1/t` gives

    (H_a Jf)(x) = integral h_a(x/t) f(t) dt/t.

For inputs supported in `(1,infinity)`, the support of `h_a` restricts this integral to `1<=t<=x`. Local Young bounds in logarithmic coordinates and input truncation identify the integral with the bounded extension for all such L2 inputs. Suzuki's Theorem 2.2(3) therefore applies and makes `Theta_a(z)=R_a(-iz)` inner. This proves implication 1 to 3 without assuming the global convolution exists in advance.

Conversely, Schur contractivity together with xi's reflection symmetries gives innerness. Suzuki's Lemma 4.1 identifies the explicit global Hankel operator as an isometry, so its finite compressions have norm at most one. These compressions converge strongly to the global operator, giving norm supremum exactly one. The remaining implications and the divergent alternative follow immediately.

### What estimate would suffice for RH

For any positive sequence `a_n` tending to zero, it would suffice to prove a finite constant `C_n` with `N_(a_n)(L)<=C_n` for every `L>1`. The constants need not be uniform in `n`, and a strictly positive gap below one uniform in `L` is unnecessary.

Indeed, the theorem makes all these ratios holomorphic in the right half-plane. A zero `lambda` of `X(w)=xi(1/2+w)` there would produce a pole at `w=lambda-a_n` for all sufficiently small widths: isolation gives `X(lambda-2a_n)!=0`. Evenness then excludes zeros in either open half-plane. The required all-window bounds have not been established.

## Why one width cannot be read as a zero-free strip

For `a>0`, the even polynomial

    P(w)=(w^2-a^2)(w^2-9a^2)

has a zero at `3a`, but exact cancellation gives

    P(w-a)/P(w+a)=(w-4a)/(w+4a),

a Schur factor. Replacing `P(w)` by `P(w-i*tau)P(w+i*tau)` gives a nonreal-zero example. These are logical counterexamples for general entire functions, not for xi. The sequence-to-zero implication above remains valid because isolation eventually prevents cancellation. Suzuki's Proposition 1.2 uses every width above a threshold rather than one width alone.

## Review of the added analytic results

### Genuine width interval

The proof establishes `||H_(a,L)-H_(b,L)||<=500|a-b|` for `a,b` in `[1/5,3/10]` and `1<L<=3/2`. The reviewed derivative estimates are `||f_a||_1<=39/2`, `||partial_a f_a||_1<=292`, and `||partial_a K_a||_1<=1869/4<500`. Integrable parameter-independent majorants justify differentiation and integration in L1. Young's inequality then yields the operator estimate.

Combining it with the existing exact interval certificate gives

    ||H_(a,L)|| <= 99999/100000

for `a` in `[0.24999998,0.25000002]` and `1<L<=3/2`. The rational arithmetic is exact. This is a proved perturbation result, not interpolation between samples. It does not approach zero width.

### Unconditional global growth and weighted energy

The modulus identity `|R_a(x+it)|=|R_x(a+it)|` makes `R_a(w+1/2)` Schur for every `a>0`, using only the known wide theorem. The shifted denominator is zero-free in that half-plane. Causal-kernel identification is justified on an absolutely convergent Euler line and then by Laplace uniqueness.

The two undamping multipliers each have norm `sqrt(L)` on the active logarithmic interval. Therefore the proof correctly gives `N_a(L)<=L`, for all positive widths and finite truncations. This is weaker than the all-window boundedness criterion.

Writing `E_a(u)=1-integral_0^u K_a(v)dv`, the same damped multiplier gives

    integral_0^infinity exp(-u)|E_a(u)|^2 du <= 2(1-R_a(1)).

The normalization checks: `f(u)=exp(-u/2)` has squared L2 norm one; `(I-C)f=exp(-u/2)E_a(u)`; and `<Cf,f>=R_a(1)`. The finite arithmetic expansion of `E_a` contains the required factor `c_a(n)/sqrt(n)`.

Suzuki's existing unweighted L2 criterion for `E_a` is substantially stronger. The weighted estimate does not remove that gap.

### Other structural constructions

The X-weighted Hardy translation semigroup, its generator domain, and its reproducing-kernel evaluation factors are correct. Its norm is defined through multiplication by X; the arithmetic factors cancel from the evaluation estimate, so it does not prove the scalar Schur bound. The sharp polynomial width-threshold counterfamily and the contractive inclusion criterion for the two known wide defect spaces also check. The latter's diagonal condition already contains the thin scalar inequality and is an exact reformulation rather than a positivity proof.

## Sources and provenance

- [Suzuki, A canonical system of differential equations arising from the Riemann zeta-function](https://arxiv.org/abs/1204.1827): Theorem 2.2 and Lemma 4.1 supply the global implications; Proposition 1.2 supplies the all-width formulation; Theorem A.1(2) supplies the step-response criterion. All-positive-width finite-window compactness is explicitly stated in the unnumbered paragraph after Theorem 2.3, printed p.8, and explained through weakly singular kernels in Section 5, printed p.24. Lemma 4.2 alone covers only the Hilbert–Schmidt regime.
- [Lagarias, Zero Spacing Distributions for Differenced L-Functions](https://arxiv.org/abs/math/0601653), corrected version, Lemma 2.1: the unconditional wide-shift comparison.
- [Olafsson, Pasquale and Rubin, Analytic and Group-Theoretic Aspects of the Cosine Transform](https://arxiv.org/abs/1209.1822), equations (2.4)–(2.6) and section 4.3: homogeneous Fourier multipliers and twisted covariance.
- [Aryapoor, The Penrose transform in split signature](https://arxiv.org/abs/0812.3692): the real projective/X-ray setting.

The audit began from PR 10 head `81ce245b8959b9a0c958fe6c201971a3ecf99719`; the reviewed original UI and report-source Git blobs were `fa26e0d057b8ebbc91d5694c34bf0f719a198323` and `acad446c2cbd73b88b0b9b5da6acccfebec1b469`. The updated proof-unit hashes are recorded in `reviewed-units.json`. This review did not rerun the previously independently checked interval certificate or replace its existing review. No new all-window bound independent of L, zero-free region, or RH proof is claimed.
