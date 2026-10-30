# Independent audit: actual Hardy-channel closure and two-trace coordinate Gram

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **PASS, with the scope below.** Independent internal mathematical/source review. No producer source was changed. This is a mathematical dependency-chain review plus independent exact scalar checks, not a numerical spectral experiment.

Producer: `gamma_complement_attack/HARDY_CHANNEL_CLOSURE_AND_TWO_TRACE_COORDINATE_GRAM.md`, SHA256 `72c6f1bbc5a4aee305aa5cd66584b48f7160d159e5f63e67100d922d4ac5a5fa`.

## Accepted theorem and limitations

Let B_lambda be the actual additive positive-even Fourier head chi>=1/2 with its full L2[-lambda,lambda] norm. For

    F_lambda = {g in B_lambda: integral(g)=g(0)=g(lambda)=0},

there is an unspecified lambda_0 such that, for every lambda>=lambda_0,

    2 Re <g_visible,W_lambda E_even g> >= (1/10)||g||^2,
    ||E_even g||^2 >= ||g||^2/(3200 lambda^2), g in F_lambda.

E_even is reflection averaging of the actual supported arithmetic E image. The visible pairing is the full-even pairing (twice the positive-half pairing). W_lambda is the literal finite Mobius inverse followed by the additive/logarithmic isometry and full-even extension; its norm is at most 2 sqrt(2) lambda.

**This is a coordinate-map lower Gram theorem, not a lower bound on the Weil form.** Mean zero is imposed first, then two source traces. On the mean-zero maximal positive head an at-most-two-dimensional, correctly main-whitened Schur problem remains. Neither its sign nor any correct gamma-complement floor is asserted. The accepted A4 energy and A6 full-action theorems continue to require their polynomial-deficit selections. There is no effective onset, new fixed-support positivity certificate, RH conclusion, or change to V8.

## 1. Exact operator-level dependency and uniform fixed-collar transfer

I read the broad WOT proof and the designated independent receipt, not merely the constant-vector endpoint theorem. With K_c the concentration operator and M_c=e^(icx), the exact demodulated operator is compression of the frequency interval [-c/pi,0] in cycle frequency. It increases strongly to the negative-frequency Hardy compression A. For the actual positive Fourier phase and chi^2>=1/4,

    0 <= Q_c=M_c* P_c M_c <= 4 M_c* K_c M_c <= 4A.

The quarter-projector weak limit Q_c -> (1/4)1_[1/4,1](A) follows from the four-phase polar projector: the nonidentity terms pair an endpoint-concentrated weakly null vector with a strongly converging bounded functional-calculus vector, or use the oscillatory reflection term. The threshold is atomless in the explicit logistic spectral representation. No unbounded inverse on an arbitrary vector, strong convergence of projections, or differentiation of a counting remainder is used.

The actual physical coefficient is exactly

    lambda^(-1/2) integral_0^W H_n(lambda+tau/lambda)e^(-2pi i xi tau/j) d_tau
      = <psi_n,M_c F_(W,xi/j)>.

The lambda normalization cancels on x_physical=lambda*x. No extra chi or endpoint factor remains. For each fixed W the functions F_(W,omega), |omega|<=1/2, form a compact subset of L2[-1,1]. Uniform boundedness plus a finite net makes the quadratic-form WOT convergence uniform in omega, hence in every j>=2. Integration in xi over [-1,1] proves actual HS-squared convergence. It is not inferred from compact-sandwich operator norm alone. The designated WOT receipt separately verifies the same HS trace argument.

## 2. Exact projected tail and the growing-collar quantifiers

For G=F_(V,omega)-F_(W,omega), the negative-frequency Fourier transform after zero extension is the exact sine integral displayed in the producer. Both finite endpoints in integration by parts contribute. The resulting bound is

    |Ghat(-v)| <= 1/[pi^2(1-omega^2)(W+v)], v>=0.

Integrating its square, then using Q_c<=4A and xi-length 2, gives

    ||K_(j,c,V)-K_(j,c,W)||_HS^2 <= 128/(9pi^4 W).

This is uniform in c, j>=2 and V>W. There is no extension of the actual arithmetic sampling interval: only a source-coordinate comparison operator is extended. The limiting projected channels satisfy the same bound.

For arbitrary W_lambda->infinity, first fix W0, use the uniform fixed-W0 convergence, bound the actual and limiting tails by the displayed quantity, then send W0->infinity. This proves the all-j diagonal limsup without requiring a rate for WOT. It does not require commuting growing W with the weak limit. The separate transfer receipt a05f494e... is accepted and preserved; the present synthesis also supplies an independent direct Hardy evaluation rather than relying on modal shape asymptotics.

## 3. Direct half-line Hardy computation, including distributional domain

Under V f(u)=sech(u)f(tanh(u)), the negative-frequency Hardy compression has multiplier

    a(eta)=(1+exp(pi eta))^(-1).

The sign is important. The compression kernel is (1/2)delta minus i/(2pi) times the principal-value Cauchy kernel. After the tanh map, the latter becomes PV csch(u-v); its angular Fourier multiplier is -i*pi*tanh(pi eta/2). Thus the sign gives a, not 1-a.

On the other hand, the positive-frequency half-line plane-wave integral is

    F_infinity,omega=(1/2)delta(x-omega)+(i/(2pi))PV 1/(x-omega).

At u0=atanh(omega), the exact transformed distribution is

    cosh(u0)[(1/2)delta(u-u0)+(i/(2pi))PV csch(u-u0)].

Both the delta Jacobian and the smooth Cauchy-kernel factor give cosh(u0). Its angular Fourier transform is therefore

    cosh(u0)e^(-i eta u0)(1-a(eta))/sqrt(2pi).

This sign difference between the projection and the test distribution is retained. The identity for PV csch can also be derived by expanding 1/sinh(u) on u>0 and summing the odd-pole partial fractions; it is consistent with the already audited logistic diagonalization.

The projected distribution is an ordinary L2 vector: E_A=1_[1/4,1](A)<=4A and the tail inequality make E_A F_W Cauchy. On compact u intervals F_W converges distributionally; away from the central singularity the transformed functions have a uniform sech(u) tail bound. Hence this distributional limit also holds against inverse Fourier transforms of smooth compact frequency tests. Testing strictly below eta=log(3)/pi identifies the L2 limit; these tests are dense on the spectral half-line and its endpoint has measure zero. No undefined square of a delta distribution is used.

The scalar integral is exactly

    integral_(a>=1/4) (1-a)^2 d_eta = (log4-3/4)/pi.

Including the phase factor 1/4 gives

    (1/4)||E_A F_infinity,omega||^2
        = (log4-3/4)/[8pi^2(1-omega^2)].

Thus H_j^2=(log4-3/4)j atanh(1/j)/(4pi^2). The positive power series of atanh(x)/x proves the maximum at j=2, so

    H^2=(log4-3/4)log3/(4pi^2).

The independent Arb check gives H^2=0.0177069104274174100... . No endpoint differential-label or phase-mass assumption beyond the proved projector limit is hidden here.

## 4. Actual collective Bessel bound and exact factors

The source is the same selected positive head throughout. Parseval on the full additive basis bounds the selected row by sqrt(2)W, and its xi derivative by sqrt(2)pi W^2/j. Both endpoints in the second integration by parts give the displayed U_j*U_l bound. The finite block Gram is dominated by the maximum diagonal plus

    epsilon_lambda=2(2W^2/pi+2W^3)J0^2(1+log J0)/lambda^2.

At W=(1+log lambda)^6 and J0 between (1+log lambda)^8 and twice that value this is O(log^34(lambda)loglog(lambda)/lambda^2)=o(1). The bound is an actual finite-dimensional operator inequality uniform in the moving source dimension, not an ideal-mode orthogonality assertion.

For u in the positive head, q=C_lambda^(-1)u on the source interval has norm <=2||u|| and its full Fourier transform equals u at all visible points. The rescaling q_tilde(xi)=sqrt(lambda)q(lambda xi) preserves this norm. The physical substitution t=j y contributes 1/j. The full-even pairing contributes 2. This proves the exact low-label identity and the total factor 4 in its norm bound.

The literal coefficients are mu(j)/j for j>=2, not unrestricted divisor sums or prime weights. The absolutely convergent Euler product gives

    sum_(j>=2) mu(j)^2/j^2 = zeta(2)/zeta(4)-1 =15/pi^2-1.

No Mobius sign cancellation is assumed in this step. The resulting actual low-label bilinear constant is

    B0=4 sqrt[H^2(15/pi^2-1)]
       =0.3837575572134962399... .

It applies to all admissible source/test unit balls, not merely a frozen vector. The original weaker zeta(2)-1 bound remains valid historically.

## 5. All discarded ranges and every source restriction

I reread the exact repaired Poisson/Mobius identity, the critical-collar theorem, the reciprocal-sampling reduction, and the accepted far-resolvent theorem. Their combination has no uncharged range:

* g has mean zero, g(0)=0 and g(lambda)=0. Thus the endpoint collar and invisible-origin source repairs vanish literally. The Fourier endpoint H_g(lambda) need not vanish and is retained in the channel.
* On lambda<t<2lambda the exact truncated divisor coefficient is -mu(j), with original moving visibility cutoff j<=lambda*t. For retained j<J0 the cutoff is eventually inactive because h<lambda and J0<lambda^2. It is not discarded in the other ranges.
* The physical middle shell lambda+h<t<2lambda contributes O(1/log lambda), using the direct complete Green-kernel amplitude variation and both physical endpoints.
* The physical far range t>=2lambda contributes O(log^2(lambda)/lambda), by the actual signed bandwidth-resolvent pairing, not a norm-square estimate.
* In the remaining collar, dyadic reciprocal sampling controls J0<=j<=lambda^2/J0 by O(1/log lambda), with no extra number-of-blocks logarithm.
* Largest labels retain both Abel endpoints. Classical unconditional Mertens decay at X=lambda^2/J0 gives O(exp(-b sqrt(log X))(1+log lambda)^11)=o(1). I freshly checked Lee--Leong arXiv:2208.06141v5 Theorem 1.1, equation (10): its extra log X is absorbed by weakening b. No RH-strength cancellation is imported.

Consequently the complete actual defect equals the finite low-label form plus a uniform o(1)||u||||g|| on precisely the declared trace-null source space and the full positive-head test space.

## 6. Main reserve, strict slack, and Gram normalization

The accepted positive-chi core/Jordan calculation is independent of the arithmetic defect. It applies first on the full positive head and then restricts to mean zero; no false commutation with mean removal occurs. It gives

    gamma_lambda=(4sqrt(3)-3)/8-2/lambda.

The limiting value is 0.4910254037844386468... and gamma_infinity-B0 is 0.1072678465709424068... . The producer's weaker rational/elementary enclosure proves margin >0.105>0.1. Thus all uniform o(1) errors and 2/lambda can be absorbed eventually. No effective lambda_0 is supplied.

The exact identity is 2 W_lambda E_even g=visible[(I+C_lambda)g]+R_complete g. Cauchy--Schwarz in the full-even visible norm and ||W_lambda||<=2sqrt(2)lambda then give

    (1/10)||g||^2 <= 4sqrt(2)lambda ||g|| ||E_even g||.

Squaring yields exactly 1/(3200lambda^2), not a factor-two variant. The source norm is full additive L2 and the output norm is physical log-window L2.

Finally, for the positive main operator A on E=B_lambda intersect 1-perp and T g=(g(0),g(lambda)), the proved subspace in z=A^(1/2)g coordinates is ker(T A^(-1/2)). Its orthogonal complement is ran(A^(-1/2)T*) of rank at most two. The full coordinate-pairing sign still requires its actual Schur complement, including the inverse of the positive block and complete bridge. Removing trace rows changes a Hermitian form by rank at most four. No coordinate result is promoted to a Weil-energy or external-complement statement.

## Reproducibility

`hardy_channel_checks/check_hardy_channel_constants.py` performs exact SymPy/Fraction and 256-bit Arb scalar checks; `HARDY_CHANNEL_CONSTANTS.json` records the outward values. The script does not evaluate prolate eigenfunctions or any Weil matrix. Its first development run left atanh(1/2) unevaluated in SymPy; rewriting atanh in logarithms made the exact symbolic identity explicit. This was a symbolic simplification issue, not a failed mathematical inequality.

The accompanying JSON pins the producer, direct theorem sources, independent dependency receipts, this audit and the scalar script/output. Older receipts that deliberately left the diagonal limit or synthesis open are preserved as historical; this separate receipt admits the newly completed chain. No source, paper or external service was modified.

Primary source rechecked: <https://arxiv.org/html/2208.06141v5>, Theorem 1.1, equation (10), only the unconditional eventual Mertens estimate.
