# Theta propagation: the exact positive system and the required endpoint

Research continuation, **8 November 2026**, following
[PR #45](https://github.com/judegomila/mathexplorer/pull/45).

## Overall strategy for closing the RH argument

The strategy is to prove a global energy inequality for the **actual theta
convolution equation**. This would make its twin-ladder bridge analytic and
contractive in the right half-plane and exclude off-critical-line xi zeros.
The required inequality remains unproved. The work below supplies an exact
positive theta system, tests its spectral identification, and derives the
endpoint structure a successful positive realization would need.

Set

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\qquad
\kappa=(\partial_u^2-1/16)[e^{u/4}\theta(e^u)],
\]

\[
h_\pm=(1\pm\alpha u/2)\kappa,
\qquad
h_+*g=h_-*f,
\qquad
S(z)=\frac{F(z)-\alpha F'(z)}{F(z)+\alpha F'(z)},\quad \alpha>0.
\]

The boundary response `C0`, defined by multiplication by `S(it)` in the
Fourier convention `f_hat(t)=integral f(u) exp(itu/2) du`, is already unitary.
Boundary conservation alone does not imply the directional propagation
needed for RH. We seek the stronger analytic statement

\[
S\text{ holomorphic on }\Re z>0,
\qquad |S(z)|\le1.
\]

Equivalently, the target logarithmic derivative must be analytic there and
obey `Re(F'/F)>=0`. A zero of `F` in that half-plane would give a
nonremovable pole in `F'/F`; the symmetry of xi would then exclude zeros
in the left half-plane as well. For the Cayley-transform formulation,
common factors are canceled before interpreting `S`. At any hypothetical
right-half-plane zero of `F`, the continued `S` would take the interior
value `-1`; the maximum principle excludes this for a nonconstant Schur
function. Thus cancellation does not conceal an exception to the target.

There are two concrete ways to reach that statement:

1. **Prove the exact energy is nonnegative at every derivative order.** For
   every complex polynomial `P`, with `y=P(partial_u)kappa`, prove

   \[
   \boxed{Q(P)=2\alpha\operatorname{Re}\int_0^\infty
   \overline y\,P(\partial_u)(u\kappa)\,du\ge0.}
   \]

   The preceding analytic-localization result identifies all orders at one
   point with positivity of the complete cutoff kernel. That positivity
   gives directional energy contraction and hence the desired analytic
   bridge. Finite lists of positive derivative blocks are insufficient.

2. **Construct a positive canonical system with the exact xi response.**
   Its Weyl coefficient must be

   \[
   \boxed{M_\xi(z)=i\frac{F'(-iz)}{F(-iz)}.}
   \]

   Prove this identity from theta or prime data with the actual endpoint
   and operator domains. A positive canonical system has a Herglotz Weyl
   coefficient; that property of the exact target would give the same
   global inequality. Assuming in advance that `M_xi` is Herglotz would
   assume the missing conclusion.

These are RH-strength obligations, not routine completion steps. Sphere,
torus, spinor, and twistor pictures can organize a proposed construction,
but the zero exclusion must come from one of the exact analytic arguments.
No geometric compactification is used as a substitute for them here.

## What this continuation establishes

| Result | Status and consequence | Proof |
|---|---|---|
| Closed modular differential equations and derivative recurrence | Exact for the actual theta kernel at every order | [Modular system, Section 1](theta_modular_system_20261108.md) |
| Positive two-component theta propagation and energy identity | Unconditional, but attached to a specific modular state | [Modular system, Section 2](theta_modular_system_20261108.md) |
| Natural modular canonical lift has the wrong xi response | Proved by high-frequency asymptotics; every fixed real symplectic boundary normalization fails | [Endpoint note, Section 2](theta_logarithmic_endpoint_20261108.md) |
| Necessary endpoint for an exact positive xi realization | Its averaged trace-normalized Hamiltonian must tend to a rank-one matrix, conditional on the target identification | [Endpoint note, Section 3](theta_logarithmic_endpoint_20261108.md) |
| Positive logarithmic endpoint prototype | Constructed with `M(iy) ~ (i/2) log y`; no full xi identification | [Endpoint note, Section 4](theta_logarithmic_endpoint_20261108.md) |
| Positive Gaussian mixture for the actual commutator coefficient | Excluded by an analytic rational-cusp argument | [Modular system, Section 5](theta_modular_system_20261108.md) |
| Natural derivative operator and its domains | Nonsymmetric and nonsectorial; its closability is itself equivalent to RH | [Operator note](theta_unbounded_operator_domains_20261108.md) |
| Gaussian contour shift and weighted energy threshold | Exact grouped residue correction and sharp open weight threshold; no assumption that the correction vanishes | [Contour note](theta_direct_gaussian_contours_20261108.md) |

## The positive theta system and why its energy is not yet enough

The modular variables `a,c,v`, defined from the theta constants, obey

\[
a'=2a^2+(v-1)/8,\qquad c'=4ac+2v,\qquad v'=v(8a-c).
\]

Let `H=e^(u/4)theta(e^u)`, `q=kappa/H`, `w=1/16-a^2`, `d=c-16a`, and

\[
U=\frac{q}{vH^6},\quad V=H^2w,\quad
\beta=\frac{3(d+6a)}{vH^8},\quad\gamma=2avH^8.
\]

On the actual positive theta trajectory all four of `U,V,beta,gamma` are
positive for `u>0`. The equations reduce exactly to

\[
U'=-\beta V,\qquad V'=-\gamma U,
\]

and their decay at infinity gives

\[
\boxed{U(0)V(0)=\int_0^\infty
(\gamma U^2+\beta V^2)\,du>0.}
\]

This is a genuine positive propagation law derived from theta identities.
The associated positive canonical system, however, has a Weyl response
tending to a finite interior value `i r0` as the imaginary frequency grows.
The exact xi target instead satisfies

\[
M_\xi(iy)=\frac i2\log\!\left(\frac{y}{2\pi}\right)+O(1/y).
\]

A fixed real fractional-linear change of boundary coordinates maps
`i r0` to another finite upper-half-plane point. It cannot fix this
mismatch. The new positive energy therefore cannot be identified with the
desired arbitrary-pulse energy merely by introducing a spectral parameter.

## A concrete endpoint that passes the leading asymptotic test

In the canonical convention `JY'=z Hcal Y`, exact realization of `M_xi`
would require

\[
\frac{\int_0^x\mathscr H(t)\,dt}
{\int_0^x\operatorname{tr}\mathscr H(t)\,dt}
\longrightarrow\begin{pmatrix}1&0\\0&0\end{pmatrix}
\quad(x\downarrow0).
\]

This describes a degenerating ratio between the two channels, not an
assumption that the coefficients themselves must blow up. We construct

\[
\mathscr H_{\log}(x)=
\begin{pmatrix}1&0\\0&4/[\log(e/x)]^2\end{pmatrix},
\qquad0<x\le1,
\]

continued by `diag(1,4)` for `x>=1`. It is independently positive. An
explicit rescaling and canonical-system continuity prove

\[
M_{\log}(iy)\sim\frac i2\log y.
\]

This matches only the leading growth. It does not match the constant term,
the prime-power data, or the complete meromorphic function. The missing
arithmetic includes

\[
\frac{\zeta'(s)}{\zeta(s)}
=-\sum_p\sum_{m\ge1}(\log p)p^{-ms},\qquad\Re s>1.
\]

The next positive-system attempt must derive a Hamiltonian from the actual
data and establish the full Weyl identity. The prototype only shows that
the required leading behavior is compatible with positivity.

## Why domain control remains part of the proof

For `T0(P(D)kappa)=P(D)(u kappa)` on the dense theta derivative span,
`Q(P)=2 alpha Re<y,T0 y>`. The operator note proves that this exact
operator is not symmetric, has no finite-angle sectorial estimate at any
finite vertex, and is closable if and only if RH. An unproved closed
realization of it would therefore hide the main difficulty. A separate
positive ground-state operator `-D^2+kappa''/kappa` exists but has the wrong
cyclic structure to settle `Q(P)` by itself.

For a Gaussian input, shifting the response contour past genuine
right-half-plane bridge poles gives

\[
g=g_{\mathrm{out}}-R_\sigma.
\]

The correction is a precisely grouped residue sum, with all multiplicities
retained. The outer-contour response satisfies favorable weighted energy
bounds but is an ordinary `L2` solution only when the correction vanishes.
If `d` is the infimum of the real parts of genuine right-half-plane poles
(`d=infinity` if there are none), the actual Gaussian response satisfies

\[
\int e^{Xu}|g(u)|^2\,du<\infty\quad(0<X<d),
\qquad
\int e^{Xu}|g(u)|^2\,du=\infty\quad(X>d).
\]

The equality case `X=d` is left open. Finite Gaussian heat smoothing does
not change this threshold. Thus neither contour continuation nor smoothing
removes the actual domain obligation.

## Reproduce and review

```bash
python -m pip install -r requirements.txt
python theta_modular_system_20261108.py
```

The script checks exact polynomial identities symbolically, then performs
15 high-precision comparisons with independent theta series to catch
normalization errors. These numerical comparisons are **not interval
certificates**, all-order positivity tests, or a proof of RH. The cusp,
endpoint, operator, and contour results are analytic proofs in the notes.

See [AUDIT.md](AUDIT.md), [SOURCES.md](SOURCES.md), the captured replay,
`validation.json`, and `MANIFEST.json` for checks and scope. Repository CI
is separate from mathematical verification.

The new research directory and decision record are isolated additions to
main. The earlier research PRs remain separate dependencies; their claims
are linked at fixed commits in `SOURCES.md` rather than silently treated as
merged work.
