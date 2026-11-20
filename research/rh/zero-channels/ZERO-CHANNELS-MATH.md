# Zero channels, coupling, and Newton guidance

## Results and claim status

The proposed “super wires” have two useful mathematical interpretations: the existing analytic coupling between zeros, and a continuous family of regions each proved to contain one zero. The regions constrain what can be proved about the original function; they add no force to its zeros.

This work supplies two computer-assisted local certificates and a separate numerical audit:

| Result | Scope | Status |
|---|---|---|
| Four moving quartet channels | Every real heat parameter `−0.13 ≤ τ ≤ 0`; radius `0.01` in the `s` plane; 130 whole time cells | Exact rational certificate |
| One actual-theta channel | Fixed disk centered at `1/2 + 14.134725141734693 i`, radius `0.35`; every real `−0.05 ≤ τ ≤ 0.05` | Arb interval certificate with explicit theta-series and integration tails |
| Three moving theta candidates | 723 saved frames from the prior comparison; candidate radii `0.01, 0.0001, 0.00001` | Numerical candidates only |

The theta certificate proves exactly one simple zero in its particular disk throughout the stated interval. Reflection puts that zero on the critical line. It does not certify every theta zero, a global heat interval, the other two displayed branches, or the Riemann Hypothesis. The mathematical family is certified; the browser's drawn positions remain floating-point approximations.

The data and verifier are `dist/experiments/zero-channel-bounds.json` and `scripts/experiments/zero-channel-bounds.py`. The JSON separates `exactQuarticCertificate`, `thetaCertifiedWitness`, and `thetaCandidateAudit`. A change to a disk's radius or center does not inherit a certificate for the original disk.

## 1. Normalization and zero motion

Use the entire completed family

\[
F_\tau(s)=8H_\tau(-2i(s-\tfrac12))
=8\int_0^\infty e^{\tau u^2}\Phi(u)
\cosh(2u(s-\tfrac12))\,du,
\]

\[
\Phi(u)=\sum_{n=1}^\infty
(2\pi^2n^4e^{9u}-3\pi n^2e^{5u})e^{-\pi n^2e^{4u}}.
\]

Then

\[
F_0(s)=\xi(s)=\frac{s(s-1)}2\pi^{-s/2}\Gamma(s/2)\zeta(s),
\qquad \partial_\tau F_\tau=\tfrac14F_{\tau,ss},
\qquad F_\tau(1-\bar s)=\overline{F_\tau(s)}.
\]

At a simple zero,

\[
\rho_i'=-\frac{F_{ss}(\rho_i)}{4F_s(\rho_i)}.
\]

For a polynomial with simple zeros, differentiation of its product gives

\[
\rho_i'=-\frac12\sum_{j\ne i}\frac1{\rho_i-\rho_j}.
\]

For the actual theta entire function, the infinite sum needs the symmetric pairing specified in Polymath's Proposition 3.1. Truncating to the three plotted positive zeros is not the full zero dynamics. The direct derivative ratio used by the renderer avoids substituting that truncated sum for the actual velocity.

If all zeros are on the symmetry line, write `ρ_i=1/2+iγ_i`. In a finite configuration,

\[
\gamma_i'=\frac12\sum_{j\ne i}\frac1{\gamma_i-\gamma_j}.
\]

Linearizing gives a weighted graph Laplacian:

\[
\eta_i'=-\frac12\sum_{j\ne i}
\frac{\eta_i-\eta_j}{(\gamma_i-\gamma_j)^2},
\qquad w_{ij}=(\gamma_i-\gamma_j)^{-2}.
\]

For real perturbations of a finite configuration,

\[
\frac d{d\tau}\sum_i\eta_i^2
=-\sum_{i<j}\frac{(\eta_i-\eta_j)^2}{(\gamma_i-\gamma_j)^2}\le0.
\]

Thus increasing `τ` damps relative perturbations. Decreasing `τ` reverses this local mechanism. A common translation is a null mode, so the network alone does not prescribe absolute destinations. This is a linearized statement around simple on-line zeros; it is not a global collision exclusion. Infinite systems need convergence and tail estimates.

For adjacent real heights `a<b`, let `q=(b−a)²`. Subtraction gives

\[
q'=2-qS,\qquad
S=\sum_{k\ne i,i+1}\frac1{(b-\gamma_k)(a-\gamma_k)}>0.
\]

In reverse time `v=τ₀−τ`, `dq/dv=−2+qS`. With only two roots, `S=0` and collision occurs after reverse time `q(0)/2`. A lower bound `S(v)≥L(v)` would instead yield

\[
q(v)\ge e^{A(v)}\left(q(0)-2\int_0^v e^{-A(w)}\,dw\right),
\qquad A(v)=\int_0^v L(w)\,dw.
\]

A positive right-hand side excludes a collision on that interval. Obtaining useful collective bounds for the full theta system remains a research task.

## 2. One zero per moving channel

Let a disk have center `c=1/2+iy`, radius `r`, and rigorous bounds

\[
|F(c)|\le E,\qquad |F_s(c)|\ge A>0,\qquad
\sup_{|s-c|\le r}|F_{ss}(s)|\le B.
\]

Taylor's integral remainder gives, on its whole boundary,

\[
|F(s)-F_s(c)(s-c)|\le E+\tfrac12Br^2.
\]

Consequently

\[
\boxed{E+\tfrac12Br^2<Ar}
\]

proves exactly one zero counting multiplicity by comparison with the linear function `F_s(c)(s−c)`. It also gives the boundary lower bound `Ar−E−Br²/2`. There is no assumption that the proposed center is an exact root. Count one implies simplicity. Reflection symmetry forces this unique zero onto `Re s=1/2`.

If centers and radii vary continuously, these bounds hold over every full time interval, and the disks remain disjoint, each branch has a unique continued assignment. In the whole `(s,τ)` space the moving disks form channels. A collision cannot occur inside a channel with count one.

An alternative stepwise certificate is obtained by pulling a moving disk back to `|w|≤1`. For a parameter `λ`, set

\[
G(\lambda,w)=F_{\tau(\lambda)}(c(\lambda)+r(\lambda)w).
\]

Then exactly

\[
\partial_\lambda G=\frac{\tau'}4F_{ss}+(c'+r'w)F_s.
\]

Starting with a certified one-zero disk and boundary floor `m`, the strict bound

\[
\int_{\lambda_0}^{\lambda_1}
\sup_{|w|=1}\left|\frac{\tau'}4F_{ss}+(c'+r'w)F_s\right|d\lambda<m
\]

preserves the count throughout the step. This formula captures how a centerline chosen close to the zero velocity can improve the bound. Such cancellation must be enclosed; it cannot be assumed from a sampled trajectory.

## 3. Exact rational quartet certificate

The calibration is

\[
P_u(z)=z^4+(12u-5)z^2+12u^2-10u+4,
\quad u=-\tau,\quad z=-2i(s-\tfrac12).
\]

The generator chooses rational approximations to the two positive roots at the 131 knots `u=k/1000`, `0≤k≤130`, and includes their negatives. Decimal square roots are used only to suggest centers. **Every claim is subsequently checked with exact rational arithmetic without trusting those root approximations.**

Between neighboring knots, the center is affine in `u`. Set `u=u₀+(u₁−u₀)w` and `c=c₀+(c₁−c₀)w`. The expressions `P_u(c)`, `P'_u(c)`, and `P''_u(c)` are rational polynomials in `0≤w≤1`. Their Bernstein coefficients give exact full-interval enclosures because the Bernstein basis is nonnegative and sums to one.

For a power polynomial `p(w)=Σ a_j w^j` of degree `n`, the coefficients are

\[
b_k=\sum_{j=0}^k a_j\frac{\binom{k}{j}}{\binom{n}{j}},
\qquad \min b_k\le p(w)\le\max b_k.
\]

The full complex disk is controlled by

\[
P''_u(c+h)=P''_u(c)+24ch+12h^2.
\]

The radius is `r_s=1/100`, corresponding to `r_z=1/50`. The derivative conversions are `F_s=−2iP_z` and `F_ss=−4P_zz`. Every one of the 520 branch-cell comparisons has positive Taylor–Rouché margin. The minimum is approximately **0.0204443207681**. Every pair of affine centers stays separated; minimum physical disk clearance is approximately **0.0701095262562**.

The four disks therefore contain all four polynomial zeros and keep them simple and on the line throughout `−0.13≤τ≤0`. This extends one-zero isolation past the old fixed-disk entry threshold `τ≈−0.08175425`. It stops before the actual collision `τ=−(10−√46)/24≈−0.13406958`. No continuation through that collision is certified.

## 4. A certified actual-theta interval

This certificate uses the exact rational center

\[
c=\frac12+i\frac{14134725141734693}{10^{15}},
\qquad r=\frac7{20},\qquad \delta=\frac1{20}.
\]

The verifier uses python-flint 0.9.0 / Arb at 50 decimal digits with outward ball arithmetic. It verifies these fixed rational constants:

\[
|\xi(c)|\le E=2\times10^{-18},\qquad
|\xi'(c)|\ge A=0.0013827,
\qquad \sup_{|s-c|\le r}|\xi''(s)|\le B=0.0021.
\]

The implementation evaluates the completed `ξ` formula above using `acb_series`. Its coefficient of `x` is `ξ'`; its coefficient of `x²` is multiplied by `2!=2` to obtain `ξ''`. The factor `8` in `F=8H` is already accounted for by `F₀=ξ`.

### Whole-disk derivative bound

At 128 equally spaced circle nodes, Arb encloses `ξ''`. The largest node modulus is approximately `0.00202182970301810`. To control every point between nodes, use

\[
L_3=64\int_0^\infty u^3\Phi(u)\cosh(2ru)\,du,
\qquad |\xi'''(s)|\le L_3\quad (|\Re s-1/2|\le r).
\]

Every circle point is within chord distance `d=2r sin(π/(2N))` of a node, and the joining segment remains in that strip. Thus

\[
\sup_{\partial D}|\xi''|
\le\max_j|\xi''(s_j)|+L_3d.
\]

The maximum-modulus principle extends the bound to the whole disk. Rigorous quadrature and tails give `L₃≈0.00774195284358408` and a final disk upper bound below `0.00208833367252650`, hence below the claimed rational `B=0.0021`.

Initial Taylor–Rouché therefore gives count one and the exact boundary floor

\[
m=Ar-E-Br^2/2
=\frac{177659999999999}{500000000000000000}
=0.000355319999999998.
\]

### Whole-parameter perturbation bound

Each theta summand is positive on `u≥0` because
`2πn²e^(4u)−3>0`. For every real `|τ|≤δ` and every point in the disk,

\[
|F_\tau-F_0|
\le8\int_0^\infty\Phi(u)(e^{\delta u^2}-1)\cosh(2ru)\,du.
\]

Arb quadrature plus the explicit tails below encloses this integral below

\[
P=\frac{29}{100000}=0.00029.
\]

Hence the final strict Rouché margin is

\[
\boxed{m-P=
\frac{32659999999999}{500000000000000000}
=0.000065319999999998>0.}
\]

This proves exactly one simple zero in the stated fixed disk for **every** `−0.05≤τ≤0.05`. The proof covers all boundary arcs and intermediate times, rather than only the plotted samples. Reflection forces the unique zero onto the critical line.

### Explicit omitted-term and integration tails

The rigorous integrals evaluate `n≤12` and `0≤u≤L=3/2`. Both omitted parts are bounded analytically. A common envelope is

\[
\Phi_n(u)\le2\pi^2n^4e^{9u-\pi n^2e^{4u}}.
\]

For a moment with prefactor `a`, power `u^m`, and heat envelope `e^(du²)`, put `C=2aπ²` and `M=13`. On `[0,L]`, `e^(9u−πn²e^(4u))` decreases for `n≥M`, since `4πM²>9`. The missing theta terms contribute at most

\[
T_n\le
\frac{C L^{m+1}e^{dL^2+2rL}M^4e^{-\pi M^2}}
{1-16e^{-\pi(2M+1)}}.
\]

For `u≥L`, the ratio of consecutive positive envelopes is at most
`q=16 exp(−3π exp(4L))<1`. Define

\[
K=4\pi e^{4L}-m/L-2dL-(9+2r)>0.
\]

The function `g(u)=m log u+du²+(9+2r)u−πe^(4u)` satisfies `g'(L)=−K` and `g''(u)<0`, because `16πe^(4L)>2d`. Therefore

\[
T_u\le
\frac{C L^m e^{dL^2+(9+2r)L-\pi e^{4L}}}
{K(1-q)}.
\]

Use `(a,m,d)=(64,3,0)` for `L₃`, and `(8,0,δ)` for the perturbation. In the latter tail estimate, `e^(δu²)−1≤e^(δu²)` is sufficient. All denominators and tail hypotheses are checked using Arb strict comparisons. The missing-term upper bounds are about `1.38e−222` and `5.70e−224`; the integration-tail bounds are below `6.55e−545` and `2.72e−546`, respectively. They are included despite being much smaller than the main numerical enclosures.

The finite quadrature integrands consist entirely of polynomials, exponentials, and hyperbolic functions. They are entire in the integration variable, so ignoring the optional `analytic` flag in `acb.integral` is valid. No nonanalytic absolute-value operation occurs inside those callbacks.

## 5. The numerical theta audit remains separate

The previous 723 frames give positive estimated Taylor–Rouché margins for radii `0.01,0.0001,0.00001` around the three tracked centers. The positive-kernel expression

\[
32\int_0^\infty u^2e^{0.2u^2}\Phi(u)\cosh(0.02u)\,du
\]

is a valid analytic curvature envelope for `|τ|≤0.2` and `|Re s−1/2|≤0.01`. Its mpmath evaluation is approximately `0.0231209888751`. Unlike the separate Arb witness, this audit still uses floating-point residuals, finite unbounded truncations, and sampled time. Its positive margins are candidates, not certificates. The separate fixed first-root witness must not be applied to these smaller, moving disks.

## 6. Newton guidance and the phase-field distinction

For a fixed function, continuous Newton flow

\[
\frac{ds}{d\ell}=-\frac{F(s)}{F_s(s)}
\]

satisfies `dF/dℓ=−F`, hence `F(s(ℓ))=e^(−ℓ)F(s(0))` while the solution is defined. Its curves preserve phase and locally guide probes to existing simple zeros. An off-line simple zero attracts such probes too. The construction moves probes, not the zeros of the original function; derivative singularities and escape remain possible globally. Discrete integration only approximates this identity.

Multiplication by a nonvanishing analytic factor can reshape the phase field without changing any zero. Covering spaces and projective coordinates do not by themselves add a new zero-location constraint.

## 7. Reproduction, verification, and remaining work

From the renderer repository, full regeneration is:

```sh
python3 scripts/experiments/zero-channel-bounds.py --with-arb --self-test
```

The full command requires `mpmath` and `python-flint` (verified with python-flint `0.9.0`). The rational quartet proof and tampering checks require only Python's standard library:

```sh
python3 scripts/experiments/zero-channel-bounds.py --verify-existing dist/experiments/zero-channel-bounds.json --self-test
```

To independently re-evaluate both the quartet and the actual-theta certificate, add `--with-arb`:

```sh
python3 scripts/experiments/zero-channel-bounds.py --verify-existing dist/experiments/zero-channel-bounds.json --with-arb --self-test
```

The verifier recomputes the bounds rather than trusting serialized `certified` flags. Checks reject an inflated derivative floor, a missing time cell, a visibly shifted center, a forged margin, and an expanded theta interval. Numeric display values must agree with the exact rational quartet metadata. Re-running without `--with-arb` does not carry forward a stale theta witness.

Portable research copies can supply explicit paths:

```sh
python3 zero-channel-bounds.py --theta-data theta-input.json --output channel-bounds.json --with-arb --self-test
```

The numerical input hash and original evaluated JavaScript source hashes are retained. A compact input can omit contour arrays while preserving all root records and recording the original full-dataset hash in `provenance`.

The next meaningful extension is validated moving theta channels over wider time intervals, using the material-derivative cancellation and local normalization to avoid overly conservative global moment bounds. A global proof also needs an independent complete zero count or tail argument: tracking a few branches cannot silently exclude untracked ones. One-zero channels through the terminal time prove simplicity as well as realness; for RH alone, a carefully controlled limiting argument may allow channels to meet at `τ=0`.

## Sources

- [NIST DLMF §1.10: Taylor expansion, argument principle, Rouché, maximum modulus](https://dlmf.nist.gov/1.10).
- [D. H. J. Polymath, effective heat-flow approximation; normalization and Proposition 3.1](https://arxiv.org/html/1904.12438v2).
- [Tao, heat flow and zeroes of polynomials](https://terrytao.wordpress.com/2017/10/17/heat-flow-and-zeroes-of-polynomials/).
- [Rodgers–Tao, the de Bruijn–Newman constant is non-negative](https://arxiv.org/abs/1801.05914).
- [python-flint 0.9.0 complex-ball and rigorous integration API](https://python-flint.readthedocs.io/en/latest/acb.html).
- [FLINT rigorous calculus and integration documentation](https://flintlib.org/doc/acb_calc/index.html).

The rational channel construction, the stated constants, and the local actual-theta certificate are derived and checked here. They are local mathematical results with explicit scope, not claims of a new global bound for Λ.
