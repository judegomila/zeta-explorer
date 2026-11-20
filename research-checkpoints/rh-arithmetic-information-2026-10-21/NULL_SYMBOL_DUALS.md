# Null-symbol certificates: complete at fixed support, not an all-scale bound

Use `Q_L`, `V_L`, and `D_L` from [the normalization note](FIXED_SUPPORT.md), and let `lambda_L=inf_(||f||=1,f in D_L) Q_L(f)`.

## Complete finite null corrections

The characteristic function of `p_f=|fhat|^2` is the autocorrelation of `f`, hence vanishes for `|a|>2L`. Consequently every finite

`W(t)=sum_j c_j cos(a_j t)`, with `a_j>2L` and real `c_j`,

has zero expectation against every admissible `p_f`. Thus `inf_t(V_L+W)>=b` certifies `Q_L>=bI`.

At each fixed `L`, the exact completeness statement is

`lambda_L = sup_(finite W) inf_t [V_L(t)+W(t)]`.

The proof has three ingredients. First, a probability measure with characteristic function supported in `[-2L,2L]` has a nonnegative entire density of exponential type at most `2L`. One-dimensional Krein factorization gives a half-type `L2` factor, and Paley–Wiener gives a supported function. Finite `V_L` energy supplies the logarithmic form domain. Second, finite cosine-moment constraints have strong duality: the zero vector is an interior moment vector, as witnessed by the positive-almost-everywhere sinc-squared density. Third, coercivity makes energy sublevels tight; a dense nested list of forbidden frequencies enforces the whole support constraint in the limit.

The factorization is for complex supported functions, not an added real/even or pole-moment-zero subclass. Every strict floor below `lambda_L` has a finite witness, but the optimum need not be attained by one. No coefficient budget, frequency bound, complexity estimate, or effective convergence rate is supplied.

Classical factorization inputs: [Lawton, Lemma 5](https://arxiv.org/abs/2104.08917) and [Ehm–Gneiting–Richards, one-dimensional convolution roots](https://doi.org/10.1090/S0002-9947-04-03502-0). This checkpoint makes no literature-priority claim for the assembled duality formulation.

## Exact fixed-period relaxation

For `P>0`, set `omega=2pi/P`, `N=floor(2L/omega)`, and

`H_P(t)=min_(k in Z) V_L(t+kP)`.

Coercivity excludes all but uniformly finitely many translates on a period. Let `h_n` be the normalized Fourier coefficients of `H_P`, and `T_N=(h_(j-k))_(0<=j,k<=N)`. The exact optimum over all finite strict-null harmonics `n omega>2L` is

`Lambda_(P,L)=lambda_min(T_N)`.

This follows from circle moment duality and Fejer–Riesz factorization of nonnegative trigonometric densities. Every actual supported Fourier-square density is feasible, so `Q_L>=Lambda_(P,L) I`. The converse feasibility fails: a periodic relaxed measure may satisfy only lattice moments. Negative relaxation energy does not imply actual-form negativity.

Internally replayed interval certificates at `L=11/20` establish:

- `P=64pi`: `-1/100 < Lambda_(P,L) < -1/2500`. This period cannot certify a zero pointwise floor, regardless of the number or sizes of allowed harmonic coefficients.
- `P=128pi`, no extra term: `-1/2500 < B(0) < -1/5000`.
- Same `P`, one off-lattice term `-(1/10)cos(4t/3)`: `-1/5000 < B(-1/10) < -1/25000`.

The last interval strictly improves the complete old-period dual, yielding `Q_(11/20)>=-(1/5000)I`, but is still negative as a relaxation. Its upper certificate restricts only that fixed coefficient. The numerical source files and candidate data are not included here, so these interval results are recorded rather than replayable from this checkpoint alone.

For a certified grid, the envelope satisfies `H_P>=I_h-M2*h^2/8`, where `I_h` is the piecewise-linear interpolant and `|V_L''|<=M2`. The error is a scalar Loewner debit, not a matrix-size-multiplied entry debit. Directed Fourier sums, LDL, and an analytic omitted-translate tail finish the lower certificate. A frozen nonnegative circle density and any selected branches provide a separate primal upper certificate.

## Adaptive off-lattice cuts

With distinct off-lattice `a_j>2L`, define `U_c=V_L+sum_j c_j cos(a_jt)` and `B_A(c)=lambda_min T_N(min_k U_c(t+kP))`. Then:

- `B_A` is concave and `|B_A(c)-B_A(d)|<=||c-d||_1`.
- A minimizing measure's moment vector is a **supergradient**. At a degeneracy, the directional derivative is the minimum of `v dot m` over all active moment vectors, not the maximum. One selected supergradient is not automatically an ascent direction.
- If `ell<=B_A(c)` and a feasible measure has energy at most `U`, its moments give an `(U-ell)`-supergradient and a globally valid upper cut. Approximate primal data are not exact stationarity certificates.
- Optimizing each finite cut family attains its augmented relaxation optimum. Taking all finite off-lattice families recovers `lambda_L`. The matrix stays size `N+1`; the envelope work and coefficients need not remain bounded.

Neither pure greedy selection nor fixed-size matrices provide an all-`L` theorem. The unresolved arithmetic task is to construct certified witnesses with an all-support subexponential lower loss. Fixed-representative Gibbs averaging does not remove exponential-depth valleys; changing the null representative restores bandwidth constraints but does not supply cancellation for free.
