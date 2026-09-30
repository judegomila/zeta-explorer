# RH direction audit — September 30, 2026

**Recommendation:** prioritize the exact arithmetic positivity direction of the twin ladder / Weil / Toeplitz–Krein program. Keep freezing permutations as the quantitative de Bruijn–Newman program. This is a judgment about the next productive work, not a claim that an RH proof is close.

This review is based on `editorial-redesign` at `488fc05ce2bfffaa5379b312f168536c720a9cb0`. That branch contains the September research. The audit covers the named approaches and selected mathematical dependencies, not every research ticket or every formalization. The older `main` branch also contains a continuum-measure correction that had not reached this branch. The corrections below state the mathematical reasons explicitly.

## Why this direction ranks first

| Direction | Strongest surviving content | Missing step | Priority |
|---|---|---|---|
| Twin ladder + bridge, narrowed to Weil / Route I | Exact positivity criterion, explicit arithmetic symbol, committed exterior-atom payloads | A construction valid for all compact supports, adding every contributing prime power | Best direct RH direction |
| Freezing permutations / correlated barriers | Named finite/tail obligations and quantitative Λ candidates | Close the remaining enclosures and audit the complete implication chain | Best quantitative Λ direction |
| Fluid mechanics / Burgers | Useful transform identities and zero dynamics | A global zero-exclusion or infinite-system estimate | Supporting framework |
| Heisenberg / uncertainty | Concentration estimates for a definite positivity problem | Preserve cancellation lost by positive/negative window splitting | Supporting tool; a failed split bound is not a universal no-go |
| Supercritical fluids / superwires | Models, scaling proposals, numerical diagnostics | A proved connection to the exact completed zeta function and its zeros | Exploratory |
| Gödel witnesses | Logical analogies and witness constructions | A formal theorem about the specified system and RH | Exploratory; no independence conclusion follows from an analogy |

The key advantage of Route I is that its local result can be checked without accepting the project's qualitative narrative. The new checker independently passes both the `2a=0.90` and `2a=0.96` payloads. That supports a local positivity result; it does not establish a global extension, a new Λ bound, a novelty claim, or RH.

The superwire evidence needs particularly careful interpretation: `src/math/branched-flow.js` stops a classical ray once it reaches a prescribed strip near `sigma=1/2`, and its caustic comparison uses known zero heights as initial data. Such outputs do not establish asymptotic confinement or an independent prediction of zeros. A finite prime model also needs a justified relation to analytic continuation in the critical strip. These observations identify what to prove next; they do not refute every physical approach.

## 1. The correct all-support target

Use

\[
\widehat h(t)=\int_{\mathbb R}h(x)e^{-itx}\,dx,
\qquad h\in C_c^\infty(\mathbb R),
\qquad \widehat h(i/2)=\widehat h(-i/2)=0.
\]

Pole-free tests already suffice for the RH positivity criterion. See Connes–Consani, [Appendix C, Proposition C.1](https://arxiv.org/pdf/2006.13771#page=51), with the allowed finite Mellin vanishing set `{0,1}`. Centering converts these to the two displayed Fourier moments. The sign convention here is the zero-side Weil form, the negative of the local-distribution sum in that proposition.

Consequently:

- A fixed support range is only a local result.
- Positivity for **every** such test in `(-a_n,a_n)`, for any nested sequence `a_n → ∞`, covers every compact test.
- No uniform strictly positive margin or additional limiting theorem is required after this coverage is proved.
- A finite set of widths or finite-dimensional trial spaces does not give this coverage.
- Extending the form to tests with nonzero pole moments at a fixed width is a different problem, not a prerequisite for this RH route.

This withdraws the three-independent-obstruction-axes interpretation in `imp-97049` and its glossary/index copies. It does not claim that the known numerical blockers are exhaustive.

For the Q substitution, put `Q=-d²/dx²+1/4`. If `h=Qg` with smooth compact `g`, integration by parts gives `hhat(t)=(t²+1/4)ghat(t)` and both moments vanish. Conversely, for such an `h`, the solution

\[
g(x)=-2\int_{-a}^{x}\sinh((x-y)/2)h(y)\,dy
\]

is zero to the left of the support, and both zero moments make it zero to the right as well. Thus it is smooth and compactly supported. This proves the needed correspondence on the smooth test core. A statement on unrestricted L² would additionally need the domain of the unbounded, roughly `t⁴ log|t|` weighted form.

Without RH, the zero-side expression is

\[
\sum_\rho \widehat h(z_\rho)\overline{\widehat h(\overline{z_\rho})},
\qquad z_\rho=(\rho-\tfrac12)/i.
\]

Replacing it with a sum of absolute squares over real ordinates would assume the reality being sought.

## 2. The pole contribution is indefinite

For the autocorrelation `f=h*tilde(h)`, analytic continuation gives
`fhat(z)=hhat(z) conjugate(hhat(conjugate(z)))`. Hence the pole term is

\[
P(h)=2\operatorname{Re}\!\left(\widehat h(i/2)
  \overline{\widehat h(-i/2)}\right).
\]

For real `h`, let `c=∫h(x)cosh(x/2)dx` and `s=∫h(x)sinh(x/2)dx`. Then
`P(h)=2(c²-s²)`. An even nonnegative bump gives a positive value. An odd bump with nonzero `s` gives a negative one. Thus the rank-two term is not PSD.

In L² on a symmetric interval, the two moment functionals have Riesz representers `e^(x/2)` and `e^(-x/2)`, equivalently `cosh(x/2)` and **`sinh(x/2)`**. The old pair `cosh(x/2), x sinh(x/2)` consists of two even functions and misses the odd moment. Any use of this L² decomposition for the Weil form must also check form domains.

`imp-97076` is corrected accordingly. A failed Sonine sufficient inequality or shared resonance window is not a proof that every local, finite-rank, or non-Sonine extension fails. Its class-wide impossibility claim is withdrawn.

## 3. Scope of flow-blindness

Let a hypothesis class contain the Riemann profile and its sufficiently small deformations `exp(-εu²)Φ`. Their transforms are negative-time heat-flow functions, and [Rodgers–Tao](https://arxiv.org/abs/1801.05914) implies those transforms have a nonreal zero. Membership in that class therefore cannot force all-real zeros.

The class-membership assumption is essential. Gaussian multiplication preserves evenness, positivity, decay upper bounds and, when present, log-concavity. It does not automatically preserve every analytic subclass, kernel PSD or Wronskian total positivity. The result does not require a successful proof to invoke the Euler product explicitly, and does not show verified height is the only useful lever.

The data module, overview, and TeX source now state this narrower result. The existing August PDF remains an explicitly labeled **superseded historical artifact**, not the corrected note. The conditional Lean theorem is not re-audited here; verifying an implication does not establish every informal application of its hypotheses.

## 4. Continuum diagonal and signed residual

For an ordinary double integral against `Φ(u)Φ(v) du dv`, the set `u=v` has zero product measure. A one-dimensional integral along that diagonal can define a useful comparison kernel, but cannot be identified with a nonzero summand of the original integral without an additional singular measure or a separately proved identity.

Likewise, for finite Hermitian matrices with `P>0`,

\[
K=P+S\succeq0
\iff I+R\succeq0,\qquad R=P^{-1/2}SP^{-1/2}.
\]

The norm bound `||R||≤1` is sufficient, but generally not necessary. For example `P=I`, `S=diag(2,-1/2)` gives `K=diag(3,1/2)>0` while `||R||=2`. The special off-diagonal block `[[I,V],[V*,I]]` does have a contraction criterion; identifying it with the actual kernel is an extra step. Infinite-dimensional statements need the relevant domain and invertibility hypotheses.

This corrects the hidden-square record and canonical status pages. It preserves the exact Wronskian identity, not the invalid diagonal interpretation or bare Volterra equivalence.

## 5. Independent local certificate replay

For `2a≤log(3)`, the pole-free arithmetic symbol is

\[
\sigma_2(t)=(t^2+1/4)^2 w_2(t),\quad
w_2(t)=\operatorname{Re}\psi(1/4+it/2)-\log\pi
        -\sqrt2\log2\cos(t\log2).
\]

For smooth compact `g`, the inverse Fourier support of `|ghat|²` is strictly inside `(-2a,2a)`. An exterior atom `t^k trig_k(x_j t)` with `x_j≥2a` pairs to zero with it, including all distributional derivatives. Therefore `σ₂+ν≥0` on the **entire real axis** proves the required quadratic inequality for all smooth tests at this support. This is the sufficiency direction; no general finite-atom necessity claim is needed.

The new `scripts/audit-route-i-certificate.py`:

1. Loads the committed payload through Node, interprets its JSON coefficient decimals as exact reals, and uses exact lattice positions `ks/50`. The JSON SHA-256 records this precise input. Stored floating `xs` are checked for consistency, not used as exact periodic locations.
2. Encloses digamma and its derivative using shifted Euler–Maclaurin expansions with exact rational Bernoulli numbers and explicit remainder bounds. No NumPy or unproved floating rounding-slack rule participates in acceptance.
3. Covers `[0,60]` by adaptive dyadic intervals, using endpoint enclosures and the interpolation bound `min(F(left),F(right))−M₂ width²/8`.
4. Certifies `p₄≥−0.85` for a complete period of the exterior top-degree trigonometric polynomial. In phase coordinates `θ=t/50`, the interval `[0,7]` covers `2π`.
5. Proves a positive monotone tail bracket for `t≥60`; evenness covers negative `t`.

| Payload width | Accepted compact cells | Weakest compact lower bound, rounded down | Tail bracket, rounded down | Result |
|---|---:|---:|---:|---|
| 0.90 | 1,465 | 0.01328 | 0.15029 | Independent interval replay passed |
| 0.96 | 7,847 | 0.03697 | 0.09637 | Independent interval replay passed |

These conservative cover bounds are not estimates of the true minimum, spectral gap, or nominal LP margin. Both periodic covers passed as well. The stored receipts are in `research-inputs/rh-positivity-audit/`. This is a separately implemented numerical verifier, not a formally verified proof of its own source or a refereed novelty determination.

### Bounds used by the checker

After shifting to `w=49/4+it/2`, use eight terms of the digamma Euler–Maclaurin expansion. The periodic Bernoulli integral remainder gives the deliberately conservative bounds

\[
|R_8(w)|\le\frac{|B_{16}|}{16(\Re w)^{16}},\qquad
|R_8'(w)|\le\frac{|B_{16}|}{(\Re w)^{17}}.
\]

They follow by bounding the periodic Bernoulli polynomial by `|B16|` and integrating `|w+x|^-17` (and its derivative) over `x≥0`. The twelve recurrence terms are enclosed individually. See also [DLMF §5.11](https://dlmf.nist.gov/5.11) for the expansions and error-bound framework. The self-test compares these enclosures to separate high-precision digamma values; this catches implementation errors but is not the justification for the remainder bound.

For the curvature bound, the polygamma series gives

\[
|w_2''|\le\tfrac12\sum_{n\ge0}(n+1/4)^{-3}+\sqrt2(\log2)^3<33.
\]

The tail uses `S_k=Σ_j |c_kj|` and

\[
L(t)=\log(t/2)-1/t-\frac{4\sum_{j=0}^{11}(j+1/4)}{t^2}
 -\frac1{3t^2}-\frac1{12(49/4)^2}-\log\pi.
\]

The one-term shifted expansion proves `Re ψ(1/4+it/2)−log π≥L(t)`. All variable terms of `L` increase for `t>0`. The checker verifies both `L(60)−√2 log2>0` and

\[
L(60)-\sqrt2\log2-0.85-\sum_{k<4}S_k/60^{4-k}>0.
\]

The first check allows replacement of `(t²+1/4)²` by the smaller `t⁴` in the positive lower bound. The second then proves `F(t)>0` for the infinite tail. No finite frequency cutoff is silently promoted to a global statement.

## 6. Concrete extension contract

First target a certificate at `2a=log(3)`; after that, test the rational width `2a=11/10`. Since `log3<11/10<log4`, the **exact** next symbol is

\[
\sigma_{2,3}(t)=(t^2+1/4)^2\left[
\operatorname{Re}\psi(1/4+it/2)-\log\pi
-\sqrt2\log2\cos(t\log2)
-\frac{2\log3}{\sqrt3}\cos(t\log3)\right].
\]

The scope-check command verifies this threshold and refuses to reuse either old payload. Their exterior atoms begin inside the enlarged autocorrelation support, so their vanishing-pairing argument is invalid there. The new `p=3` symbol correction changes sign between `t=0` and `t=π/log3`; this observation alone does not determine the sign of its compressed operator.

A successful extension must supply:

- New exact coefficient data with every exterior atom at or beyond the target width.
- A global lower bound for `σ₂,₃+ν`, including between-node and infinite-tail control.
- The smooth-core sufficiency argument for all tests at that width, with any claimed domain extension justified.
- A reproducible receipt tied to the exact input and checker version.

For later widths `B=2a`, the exact prime part is

\[
-2\sum_{p^m:\,m\log p<B}\frac{\log p}{p^{m/2}}\cos(mt\log p).
\]

Boundary shifts vanish on the smooth compact core, so including equality does not change the form. At `B>log4`, the `p²=4` term must be added as well. Pushing the `p=2`-only model past `log3` and extrapolating its eigenvalues cannot certify this family.

**No two-prime positivity certificate is produced here.** The recorded experiment checks the arithmetic and rejection of invalid reuse. Optimizer failure, a positive finite Galerkin matrix, or a finite-frequency check would each leave this contract open. To reach RH, the construction must eventually cover unbounded supports; success at `11/10` would be a useful local milestone only.

## Reproduce and review

```sh
npm run audit:rh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/audit-route-i-certificate.py --self-test
python scripts/audit-route-i-certificate.py --certificate 090
python scripts/audit-route-i-certificate.py --certificate 096
python scripts/audit-route-i-certificate.py --two-prime-diagnostic
```

The JS checks include explicit pole-sign/parity and signed-residual counterexamples, plus consistency checks on the corrected data. The Python checks include digamma enclosures, the curvature constant, a negative between-endpoint test, and invalid-support rejection. Exhausting the adaptive cell budget yields an error and no certificate, not a mathematical refutation.

This review used a pinned partial source snapshot. The full application build, complete historical assertion suite, Lean projects, and unrelated certificate packages were not replayed. Historical modules outside the edited dependency chain may still repeat superseded conclusions; this note and the corrected overview state the current audit scope. No candidate Λ value is promoted, and no published-record claim is made.
