# Lower-Ritz actual-remainder FKS resolution barrier

## 0. Exact outcome and claim boundary

Fix

\[
 I_L=[-L/2,L/2],\qquad L=2\log\lambda,
 \qquad \lambda\geq\sqrt2.                          \tag{0.1}
\]

For a physical source vector `f`, let

\[
 C_f(t)=\langle f,K_tf\rangle,\qquad
 \Omega_f(t)=e^{t/2}C_f(t),\qquad 0\leq t\leq L.    \tag{0.2}
\]

Thus `C_f(0)=2||f||^2` and `C_f(L)=0`.  The exact normalized
Chebyshev-error kernel is

\[
 \boxed{
 \delta_*(t)=1-e^{-t}\psi_C(e^t)
 -{1\over2}e^{-t}\log(1-e^{-2t}).}                  \tag{0.3}
\]

Let `G_u` be any actual lower-Ritz harmonic lift into one parity source
sector and put `f=G_u z`.  The full boundary-gauged multiplier numerator,
including the parity pole and the lower shift, has the exact global form

\[
\boxed{
\begin{aligned}
 \mathcal N_{u,G}(z)
 :={}&\int_{\mathbb R}r_\lambda(\xi)
             |\widehat f(\xi)|^2{d\xi\over2\pi}
       -u\|f\|^2+2\epsilon|\langle p_\epsilon,f\rangle|^2\\
 ={}&(\kappa_0-u)\|f\|^2
 -\int_0^L\delta_*(t)
              \{\Omega_f'(t)-\Omega_f(t)\}\,dt,
 \qquad \kappa_0=-2-\gamma-\log\pi.
\end{aligned}}                                      \tag{0.4}
\]

Here

\[
 r_\lambda(\xi)=m_\lambda(\xi)+4\lambda\cos(L\xi) \tag{0.5}
\]

is the exact actual-symbol boundary gauge.  Equation (0.4) retains the
inclusive von Mangoldt inventory and the complete Archimedean and pole
cancellation.  It contains no separate `O(lambda)` estimate.

Write

\[
 E(X)=\psi_C(X)-X,\qquad t_0=\log2,
 \qquad J_f(t)=C_f'(t)-{1\over2}C_f(t).             \tag{0.6}
\]

The only high prime history in (0.4) is

\[
 \boxed{
 \mathcal H_L(f)=
 \int_{t_0}^L E(e^t)e^{-t/2}J_f(t)\,dt.}            \tag{0.7}
\]

With the pinned Fiori--Kadiri--Swidinsky constants

\[
 A=9.22022,\qquad \alpha=0.8476836,                 \tag{0.8}
\]

define the boundary-layer graph load

\[
 \Gamma_L(f)=\int_{t_0}^L
 e^{-(L-t)/4}|J_f(t)|\,dt.                           \tag{0.9}
\]

Then the exact prime history obeys

\[
 \boxed{
 |\mathcal H_L(f)|
 \leq A\lambda L^{3/2}e^{-\alpha\sqrt L}\Gamma_L(f).}
                                                               \tag{0.10}
\]

For the normalized fixed source mode `V_n`,

\[
 \Gamma_L(V_n)\leq {24\over L}
              +{64\pi|n|\over L^2},                 \tag{0.11}
\]

and therefore

\[
 |\mathcal H_L(V_n)|
 \leq A\lambda e^{-\alpha\sqrt L}
       \left(24\sqrt L+{64\pi|n|\over\sqrt L}\right).          \tag{0.12}
\]

This is `o(lambda)` for fixed `n`, so FKS magnitude resolves the coarse
edge-energy scale.  It does not resolve the pure-edge lower-shift
numerator `|u|` in the negative-shift case.  Even in the fixed-mode
diagnostic, the displayed FKS enclosure is `o(|u|)` only under the scale
condition

\[
 \lambda\sqrt L\,e^{-\alpha\sqrt L}=o(|u|).          \tag{0.13}
\]

In particular, (0.13) fails for every `|u|=O(L^B)` with fixed `B`.
Relative to an edge positive energy of order `lambda`, (0.12) reaches only

\[
 O(\sqrt L\,e^{-\alpha\sqrt L}),                    \tag{0.14}
\]

whereas the sharp pure-edge angle is `O(|u|/lambda)`.  A uniform lift
argument based only on (0.10) would require

\[
 \boxed{
 \sup_{0\ne z}{\Gamma_L(G_uz)\over\|G_uz\|^2}
 =o\!\left({|u|\over
 \lambda L^{3/2}e^{-\alpha\sqrt L}}\right),}         \tag{0.15}
\]

together with a signed lower bound for the remaining exact baseline.
No frozen theorem supplies either assertion.

Thus the first strict obstruction is a resolution mismatch, not a proof
that the actual history is large.  FKS is an upper envelope and cannot
exclude additional von Mangoldt cancellation.  No actual lower-Ritz sign,
actual-symbol near-extremizer in `ran(G_u)`, response estimate, equation
(5.2) of `DIRECT_RH_ATTACK.md`, zero statement, or RH conclusion is proved.
The formal state remains `P0_INVALIDATED`, and the standard eight are
unchanged.

## 1. Frozen inputs

Only the following repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/CHEBYSHEV_ERROR_REWRITE.md` | `164482f280284c49eda27c6d22607f32d5e16db4ab053b965c97f8bbd81db20a` |
| `notes/GROWING_ACTUAL_SYMBOL_BOUNDARY_GAUGE_PHASE_ANGLE_BARRIER.md` | `de8a95d46fdaf393208124b7813637333c1e309e457473f893c3fd51b66138b1` |
| `notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md` | `aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `DIRECT_RH_ATTACK.md` | `b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2` |

The first row fixes the cancellation-preserving Chebyshev rewrite.  The
second fixes the full actual symbol, boundary alias, and phase-angle
benchmark.  The third fixes the lower-Ritz harmonic lift.  The fourth pins
the unconditional PNT constants, and the last fixes the one-vector target.

## 2. Exact actual-symbol compression on the lift

The actual multiplier is

\[
 m_\lambda(\xi)=
 \operatorname {Re}\psi\!\left({1\over4}+{i\xi\over2}\right)
 -\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                          \cos(\xi\log n).           \tag{2.1}
\]

The endpoint is inclusive.  Zero-extension compression annihilates
`cos(L xi)`, so (0.5) has exactly the same compression as (2.1).  On parity
`epsilon`, for every physical source vector `f`,

\[
\begin{aligned}
 \langle f,(Q_{\lambda,\epsilon}-uI)f\rangle
 ={}&\int_{\mathbb R}r_\lambda(\xi)
             |\widehat f(\xi)|^2{d\xi\over2\pi}
       -u\|f\|^2+2\epsilon|\langle p_\epsilon,f\rangle|^2.
\end{aligned}                                                  \tag{2.2}
\]

This identity may be pulled back by any map `G_u`; in particular it applies
to the complete lower-Ritz harmonic lift.  Nothing is estimated before the
pullback.

To obtain the second line of (0.4), start from the exact weighted-PNT
cumulative form

\[
 \langle f,(Q_\lambda-uI)f\rangle
 =(c_*-u)\|f\|^2
 +\int_0^L\{D(t)-H_{\rm tail}(t)\}C_f'(t)\,dt,       \tag{2.3}
\]

where

\[
\begin{aligned}
 c_*&=\psi(1/4)-\log\pi+4,\\
 D(t)&=\sum_{1<n\leq e^t}{\Lambda(n)\over\sqrt n}
          -2(e^{t/2}-1),\\
 H_{\rm tail}(t)&={1\over2}\log {1+e^{-t/2}\over1-e^{-t/2}}
       +\arctan(e^{-t/2})-2e^{-t/2}.
\end{aligned}                                        \tag{2.4}
\]

Partial summation, with `E(1)=-1`, gives

\[
 D(t)=1+e^{-t/2}E(e^t)
       +{1\over2}\int_0^tE(e^s)e^{-s/2}\,ds.        \tag{2.5}
\]

Since `C_f(L)=0` and `C_f(0)=2||f||^2`, Fubini preserves the sign and yields

\[
 \int_0^LD(t)C_f'(t)\,dt
 =-2\|f\|^2+\int_0^LE(e^t)e^{-t/2}J_f(t)\,dt.       \tag{2.6}
\]

No total variation appears in (2.6).  Now put

\[
 B(t)={1\over2}e^{-t/2}\log(1-e^{-2t}).             \tag{2.7}
\]

The definitions give

\[
 \delta_*(t)=-e^{-t}E(e^t)-{1\over2}e^{-t}
                         \log(1-e^{-2t}),             \tag{2.8}
\]

\[
 B'(t)+H_{\rm tail}'(t)=-{1\over2}B(t).             \tag{2.9}
\]

Consequently

\[
 -B(t)J_f(t)-H_{\rm tail}(t)C_f'(t)
 =-{d\over dt}\{(B(t)+H_{\rm tail}(t))C_f(t)\}.    \tag{2.10}
\]

The singularities cancel at the origin, with

\[
 \lim_{t\downarrow0}\{B(t)+H_{\rm tail}(t)\}
 ={3\over2}\log2+{\pi\over4}-2.                    \tag{2.11}
\]

Using

\[
 \psi(1/4)=-\gamma-{\pi\over2}-3\log2              \tag{2.12}
\]

in (2.3), equations (2.6)--(2.11) leave

\[
 c_*-2+2\left({3\over2}\log2+{\pi\over4}-2\right)
 =-2-\gamma-\log\pi=\kappa_0.                       \tag{2.13}
\]

Finally `Omega_f'-Omega_f=e^(t/2)J_f`, proving (0.4).  This derivation
combines the pole, continuous density, Archimedean tail, and prime inventory
before any absolute value is taken.

## 3. Exact prime-free baseline and signed high history

Equation (2.8) separates only the normalized prime discrepancy from a
source-independent integrable term.  Define

\[
\begin{aligned}
 \mathcal B_{u,L}(f)
 :={}&(\kappa_0-u)\|f\|^2
 +\int_0^{t_0}E(e^t)e^{-t/2}J_f(t)\,dt\\
 &+{1\over2}\int_0^Le^{-t/2}\log(1-e^{-2t})J_f(t)\,dt.
\end{aligned}                                        \tag{3.1}
\]

On `[0,t_0)`, `psi_C(e^t)=0`, so `E(e^t)=-e^t`; hence (3.1) contains no
unresolved prime information.  Equations (0.4) and (2.8) give the exact
decomposition

\[
 \boxed{
 \mathcal N_{u,G}(z)=\mathcal B_{u,L}(G_uz)
                     +\mathcal H_L(G_uz).}           \tag{3.2}
\]

This is not an estimate of two cancelling `O(lambda)` terms.  The first
term is an explicit prime-free baseline and the second is one signed prime
history.  A lower bound must orient their sum.

## 4. The sharp FKS resolution supplied by the frozen data

The pinned theorem states, for `t>t_0`,

\[
 |E(e^t)|\leq A e^t t^{3/2}e^{-\alpha\sqrt t}.       \tag{4.1}
\]

Set

\[
 \Phi(t)=e^{t/2}t^{3/2}e^{-\alpha\sqrt t}.           \tag{4.2}
\]

For every `t>0`, completing the square gives

\[
 {d\over dt}\log\Phi(t)
 ={1\over2}+{3\over2t}-{\alpha\over2\sqrt t}
 \geq {1\over2}-{\alpha^2\over24}>{1\over4}.       \tag{4.3}
\]

Therefore

\[
 \Phi(t)\leq\Phi(L)e^{-(L-t)/4},\qquad 0<t\leq L.  \tag{4.4}
\]

Substitution of (4.1) and (4.4) into the single signed integral (0.7)
proves (0.10).  Notice what has and has not happened: (0.7) is still the
actual signed history, while (0.10) is the strongest conclusion here from
the frozen pointwise envelope alone.  It supplies magnitude, not
orientation.

There is also a direct combined-kernel envelope.  From (2.8), for
`t>=t_0`,

\[
 |\delta_*(t)|
 \leq A t^{3/2}e^{-\alpha\sqrt t}+{2\over3}e^{-3t}. \tag{4.5}
\]

Indeed `e^(-2t)<=1/4` and
`-log(1-x)<=x/(1-x)`.  This proves that the normalized exact kernel has
finite `L1`, `L2`, and first weighted `L2` norms.  Those global norm facts
alone imply no sharper scale on a correlation whose graph is amplified by
`e^(t/2)` at the far boundary; without a compatible weighted graph
estimate they furnish no `o(|u|)` conclusion.

## 5. Fixed-mode calculation and the lower-Ritz scale

For the normalized source mode `V_n`,

\[
 C_{V_n}(t)=2\left(1-{t\over L}\right)
                 \cos {2\pi nt\over L}.              \tag{5.1}
\]

Writing `s=L-t`, direct differentiation gives

\[
 |J_{V_n}(L-s)|
 \leq {2\over L}+{s\over L}
                    +{4\pi|n|s\over L^2}.            \tag{5.2}
\]

Since

\[
 \int_0^\infty e^{-s/4}\,ds=4,
 \qquad \int_0^\infty se^{-s/4}\,ds=16,             \tag{5.3}
\]

extending the positive integral proves (0.11), and (0.12) follows from
(0.10).

The edge model has positive energy asymptotic to `4 lambda/pi` on a
pole-orthogonal unit direction, while its negative-shift signed numerator
is exactly `|u|`.  Dividing (0.12) by `lambda` gives (0.14).  Comparing it
instead with `|u|/lambda` gives the necessary FKS-resolution condition
(0.13).

More generally, normalize (0.10) by `||G_u z||^2`.  For its error to be
`o(|u|)||G_u z||^2` uniformly on the lift, one needs (0.15).  This is much
stronger than an unweighted `L2` bound for `delta_*`, a generic
Paley--Wiener uncertainty inequality, or ordinary control of
`||G_u z||`.  It is a boundary graph-localization statement tied to the
actual lower-Ritz harmonic range.

The fixed mode is only a scale diagnostic.  This note does not assert that
`V_n` lies in `ran(G_u)`, and it does not construct an actual-symbol
near-extremizer in that range.

## 6. Strict stopping line

Equation (0.4) turns the requested global multiplier compression into one
exact signed Chebyshev-error history.  Equations (0.10) and (0.15) locate
the unresolved scale without destroying the arithmetic cancellation.

There are two possible ways forward:

1. prove a signed lower bound for (3.2) on the actual harmonic range; or
2. prove a cancellation or boundary-graph estimate for (0.7) at absolute
   scale `o(|u|)`, together with a compatible baseline bound.

The pinned FKS magnitude theorem proves neither.  Its fixed-mode enclosure
is already too coarse at every polynomial-in-`L` lower shift, even though
it is small relative to the `O(lambda)` edge energy.  An oscillation or
Riesz-history theorem would have to use information beyond the pointwise
FKS envelope.

No sign or failure of sign for the actual operator is inferred.

## 7. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_lower_ritz_actual_remainder_fks_resolution_barrier -v

The regression checks the frozen hashes, exact partial-summation and
combined-kernel identities, the origin constant, the FKS boundary-layer
exponent, the fixed-mode graph bound, the scale mismatch, displayed TeX,
ASCII hygiene, and the fail-closed scope.
