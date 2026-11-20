# Actual mixed-bridge continuous compact-side odd carrier transfer theorem

## 0. Outcome and exact boundary

Use the locked positive-at-origin prolate convention.  For every real
`lambda>1`, put

\[
 b_\lambda=h_{2,\lambda}-{I_2\over I_0}h_{0,\lambda},
 \qquad A_\lambda=b_\lambda(0),
 \qquad X_\lambda=C_\lambda{\cal E}b_\lambda,       \tag{0.1}
\]

and define

\[
 w_\lambda=S_-X_\lambda,
 \qquad
 q^{\rm phys}_{\lambda,-}
 =\langle w_\lambda,Q_-w_\lambda\rangle.           \tag{0.2}
\]

Retain the checkpoint-1.76 odd beta carrier

\[
 {\mathfrak b}_{\lambda,-}
 ={A_\lambda^2C_\xi\over8\lambda}
  -{A_\lambda^2\over8}{\cal S}_\lambda,
 \qquad
 {\cal S}_\lambda=\sum_\rho{\lambda^{-2\rho}\over\rho^2}.
                                                               \tag{0.3}
\]

This note removes only the sampling-schedule restriction in checkpoint
1.76.  It proves, on the full continuous family,

\[
 \boxed{
 q^{\rm phys}_{\lambda,-}
 ={\mathfrak b}_{\lambda,-}+r_\lambda,
 \qquad r_\lambda=o(\lambda^{-1})}
 \quad(\lambda\longrightarrow\infty,\ \lambda\in\mathbb R).
                                                               \tag{0.4}
\]

In fact, for a fixed polynomial envelope `P(lambda,log lambda)`,

\[
 |r_\lambda|
 \leq C\left\{{\cal P}(\lambda,\log\lambda)^2d_2
       +{\cal P}(\lambda,\log\lambda)\sqrt {d_2}\right\},
 \qquad
 d_2\asymp\lambda^5e^{-4\pi\lambda^2}.             \tag{0.5}
\]

Consequently the continuous physical-self condition now has the exact
carrier equivalence

\[
 \boxed{
 q^{\rm phys}_{\lambda,-}=O(\lambda^{-1})
 \text{ for every sufficiently large real }\lambda
 \quad\Longleftrightarrow\quad {\rm RH}.}           \tag{0.6}
\]

Equation (0.6) is an equivalence, not an unconditional estimate.  It does
not prove either side.  The shifted energy remains

\[
 E_\lambda=q^{\rm phys}_{\lambda,-}
              -\mu\|w_\lambda\|^2.                 \tag{0.7}
\]

No estimate for `E_lambda`, no estimate for `mu`, no
`kappa*log^2(lambda)` reserve, no bridge overlap, no Pair-C closure, no
determinant convergence, and no Riemann-hypothesis conclusion is proved.
The standard eight are untouched and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

The direct FROZEN inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/ACTUAL_MIXED_BRIDGE_COMPACT_SIDE_ODD_CARRIER_TRANSFER_THEOREM.md` | `3320efd69a729f9709419bc539e765f94c73af20d2136f14068ee4da069c37c1` |
| `tests/test_actual_mixed_bridge_compact_side_odd_carrier_transfer_theorem.py` | `d3b0f08b9aefb7377b80cdefb5e76a35d07e004a56f90d2acc1580bf1c8199a3` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `tests/test_growing_transition_sampling.py` | `ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac` |
| `notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md` | `335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb` |
| `tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py` | `0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc` |
| `notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md` | `2feb3d62a71e435706c4b330d13bcb096015e52204af6ec9bd2828308d44383d` |
| `tests/test_compact_absolute_sampling.py` | `883c0e4edd8b6573bcf11740031a6a0ea93340d45e36ac1057e3793b729bc605` |

Checkpoint 1.76 supplies the all-real compact BV explicit-form identity,
the two-slot radical polarization, the gauge equality only after `Z`, the
exact beta carrier, and the continuous carrier-level RH
equivalence.  Its only missing input for a continuous physical transfer is
an all-real positive sampling estimate for the fixed-label modal row.

The transition outer theorem supplies the displayed weighted norm and
translation estimates for an even prolate label once
`0<=mu_n<3*c^2`.  Its growing-window statement uses a KRD transition index
on the odd halfgrid, but Sections 2--4 of its proof use only that differential
inequality and evenness of the label.  The transition sampling theorem
supplies the dyadic positive zero-count argument before its later compact
projection section.  The gauge theorem supplies the continuous fixed-label
defect and endpoint-shear asymptotics.  The compact sampling pair is used
only to mark its exact inapplicability to the noncompact modal tail and the
separate halfgrid projection boundary.

No zero table, numerical zero ordinate, zero-reality premise, or new
positive Weil-form premise is introduced.

## 2. Where the old halfgrid entered

The two growing transition theorems declare

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad c=2\pi\lambda^2.                          \tag{2.1}
\]

That restriction serves two growing-family tasks: it makes the KRD window
index an exact integer artifact and fixes the exponential compact-projection
cutoff.  Neither task is needed for the three fixed source labels used by
the bridge.

For every prolate index, the min--max estimate already displayed in the
transition outer proof is

\[
 0\leq\mu_n(c)\leq c^2+n(n+1).                    \tag{2.2}
\]

For `n` in the fixed set

\[
 {\cal I}_{\rm fix}=\{0,2,6\},                    \tag{2.3}
\]

one has `n(n+1)<=42`.  If `lambda>=2`, then
`c^2=4*pi^2*lambda^4>36*lambda^4`, so

\[
 \boxed{0\leq\mu_n(c)<3c^2
 \quad(n\in{\cal I}_{\rm fix},\ \lambda\geq2).}   \tag{2.4}
\]

This is an all-real statement.  It uses neither a KRD transition index nor
continuity between halfgrid samples.  All labels in (2.3) are even source
labels, so the sine-boundary-phase hypothesis in the complete harmonic-tail
estimate is also satisfied.

## 3. All-real fixed-label outer estimates

For `n` in (2.3), let `O_(n,modal)` denote the complete sampled modal
exterior profile, with both inversion-reflected logarithmic tails retained.
Put

\[
 L_\lambda=1+\log(2+2\pi\lambda^2),
 \qquad \epsilon(y)={1\over2}-|y|,
 \qquad K=2\pi\lambda^3.                          \tag{3.1}
\]

The exact one-sided leakage and endpoint estimates used by the transition
outer proof are

\[
 \int_\lambda^\infty H_{n,\lambda}(u)^2\,du={d_n\over2},
 \qquad
 |h_{n,\lambda}(\lambda)|^2
       \leq2592\pi^2\lambda d_n.                  \tag{3.2}
\]

Define the same displayed constants as in that proof,

\[
 \begin{aligned}
 {\cal E}_{\rm fix}(\lambda)
   &=1062724\,\lambda L_\lambda^2,\\
 C_{\rm near}(\lambda)
   &=1119744\pi^2\lambda^5+290304\pi^2\lambda^3
       +320c^4\lambda,\\
 {\cal D}_{\rm fix}(\lambda)
   &=6\left(82944\pi^2\lambda+C_{\rm near}(\lambda)
              +10^9{K^2\over\lambda}\right).
 \end{aligned}                                      \tag{3.3}
\]

The proof of transition-outer equations (4.4) and (4.12), with (2.4) in
place of the KRD window implication, now gives for every real
`lambda>=2`, every real `|y|<1/2`, and every `0<h<=1/2`,

\[
 \boxed{
 \begin{aligned}
 \|e^{y\,\cdot}O_{n,{\rm modal}}\|_2^2
 &\leq {\cal E}_{\rm fix}(\lambda)
          \epsilon(y)^{-1}d_n,\\
 \|\tau_h(e^{y\,\cdot}O_{n,{\rm modal}})
          -e^{y\,\cdot}O_{n,{\rm modal}}\|_2^2
 &\leq {\cal D}_{\rm fix}(\lambda)
          \epsilon(y)^{-1}h^{\epsilon(y)}d_n.
 \end{aligned}}                                      \tag{3.4}
\]

Here

\[
 {\cal E}_{\rm fix}(\lambda)
 =O(\lambda\log^2\lambda),
 \qquad
 {\cal D}_{\rm fix}(\lambda)=O(\lambda^9).        \tag{3.5}
\]

Changing the inversion-reflection sign changes neither positive estimate
in (3.4).  Thus the same bounds are available before choosing `S_+` or
`S_-`; no cancellation between parity sectors is used.

## 4. Dyadic positive sampling before projection

Retain the exact zero-count quantities
`Z_finite,Z_j,delta_j,phi_j` from the frozen transition sampling theorem.
They depend on the zero-count source locks, not on an arithmetic value of
`lambda`.  Define

\[
 \begin{aligned}
 B_{\rm fix}(\lambda)
 :={}&256Z_{\rm finite}{\cal E}_{\rm fix}(\lambda)\\
 &+\sum_{j\geq0}Z_j\delta_j^{-3}
 \min\left\{{512\over3}{\cal E}_{\rm fix}(\lambda),
 {5120\over3}{\cal D}_{\rm fix}(\lambda)e^{-\phi_j}\right\}.
 \end{aligned}                                      \tag{4.1}
\]

This is the same exact convergent block-minimum series as transition
sampling equation (2.8), specialized to one pure modal label.  Applying its
submean, Plancherel, and translated-filter argument to (3.4) gives the
positive two-slot estimate

\[
 \boxed{
 \|ZO_{n,{\rm modal}}\|_{{\mathfrak Z},{\rm repo}}^2
 \leq B_{\rm fix}(\lambda)d_n
 \quad(n\in{\cal I}_{\rm fix},\ \lambda\geq2).}     \tag{4.2}
\]

The growing transition theorem's corrected-combination `q<=3` conclusion
is not invoked.  That conclusion assumes one residue class modulo four and
uses a defect-relative origin bound, whereas `b_lambda^#` has a nonzero
limiting origin value while `D_mod(b_lambda^#)` tends to zero.  The argument
here instead applies the dyadic sampler separately to each pure modal tail
`O_(0,modal)`, `O_(2,modal)`, and `O_(6,modal)`, with no bump or origin
correction, and combines their positive `Z`-norms only afterward.

The frozen threshold split proving polynomial growth of its outer constant
is unchanged.  Hence there is a fixed polynomial envelope such that

\[
 B_{\rm fix}(\lambda)
 \leq {\cal P}_0(\lambda,\log\lambda)
 \qquad(\lambda\geq\lambda_0).                    \tag{4.3}
\]

Let

\[
 f=a_0h_0+a_2h_2+a_6h_6,
 \qquad
 D_{\rm mod}(f)=d_0|a_0|^2+d_2|a_2|^2+d_6|a_6|^2. \tag{4.4}
\]

Sequence-space Minkowski followed by coefficient Cauchy--Schwarz gives

\[
 \begin{aligned}
 \|ZO_{\rm modal}(f)\|_{{\mathfrak Z},{\rm repo}}
 &\leq\sum_{n\in{\cal I}_{\rm fix}}
       |a_n|\sqrt{B_{\rm fix}d_n}\\
 &\leq\sqrt{3B_{\rm fix}(\lambda)}
       D_{\rm mod}(f)^{1/2}.
 \end{aligned}                                      \tag{4.5}
\]

After enlarging a fixed polynomial envelope, (4.3)--(4.5) prove the
all-real fixed-label modal sampling theorem

\[
 \boxed{
 \|ZO_{\rm modal}(f)\|_{{\mathfrak Z},{\rm repo}}
 \leq {\cal P}_1(\lambda,\log\lambda)
       D_{\rm mod}(f)^{1/2}.}                      \tag{4.6}
\]

This is a positive sequence estimate.  It is not positivity of the signed
Weil form.

## 5. Raw bridge and endpoint shear on every real parameter

Use the gauge-theorem definitions

\[
 m_1=-h_6+a_6h_2,
 \qquad
 \gamma_\lambda={b_\lambda(\lambda)\over m_1(\lambda)},
 \qquad
 b_\lambda^\#=b_\lambda-\gamma_\lambda m_1.        \tag{5.1}
\]

Its fixed-label asymptotics are continuous-parameter asymptotics and give

\[
 D_{\rm mod}(b_\lambda^\#)=\Theta(d_2),
 \qquad
 \gamma_\lambda^2D_{\rm mod}(m_1)=O(d_2),
 \qquad
 \gamma_\lambda=\Theta(\lambda^{-4}).             \tag{5.2}
\]

Applying (4.6) separately to the endpoint-null row and the shear row gives

\[
 \begin{aligned}
 \|ZO_{\rm modal}(b_\lambda^\#)\|_{{\mathfrak Z},{\rm repo}}
 &\leq {\cal P}_2\sqrt {d_2},\\
 \|ZO_{\rm modal}(\gamma_\lambda m_1)\|_{{\mathfrak Z},{\rm repo}}
 &\leq {\cal P}_2\sqrt {d_2}.
 \end{aligned}                                      \tag{5.3}
\]

The identity `b_lambda=b_lambda^#+gamma_lambda*m_1` and triangle inequality
therefore imply

\[
 \|ZO_{b,{\rm modal}}\|_{{\mathfrak Z},{\rm repo}}
 \leq2{\cal P}_2(\lambda,\log\lambda)\sqrt {d_2}.
                                                               \tag{5.4}
\]

The inversion-odd projection is contractive in the positive two-slot norm.
For

\[
 m_\lambda=S_-O_{b,{\rm modal}},                    \tag{5.5}
\]

one obtains, on every sufficiently large real `lambda`,

\[
 \boxed{
 \|Zm_\lambda\|_{{\mathfrak Z},{\rm repo}}
 \leq {\cal P}_3(\lambda,\log\lambda)\sqrt {d_2}.} \tag{5.6}
\]

Equation (5.6), not continuity interpolation from halfgrid samples, is the
new input.

## 6. Continuous carrier transfer

Keep the spectral beta row

\[
 v_\lambda=-A_\lambda S_-J\beta_\lambda,
 \qquad
 \beta_\lambda(u)={{\bf1}_{\{u>\lambda\}}\over2\sqrt u}.
                                                               \tag{6.1}
\]

Checkpoint 1.76 proves, for all sufficiently large real `lambda`,

\[
 \|Zv_\lambda\|_{{\mathfrak Z},{\rm repo}}\leq C,
 \qquad
 {\cal W}_Z(v_\lambda,v_\lambda)
 ={\mathfrak b}_{\lambda,-}.                       \tag{6.2}
\]

Its compact BV explicit formula, radical polarization, and gauge equality
only after `Z` give the exact spectral expansion

\[
 \begin{aligned}
 r_\lambda
 &: =q^{\rm phys}_{\lambda,-}-{\mathfrak b}_{\lambda,-}\\
 &= {\cal W}_Z(m_\lambda,m_\lambda)
   +{\cal W}_Z(m_\lambda,v_\lambda)
   +{\cal W}_Z(v_\lambda,m_\lambda).
 \end{aligned}                                      \tag{6.3}
\]

The orbit-realified two-slot Cauchy--Schwarz inequality is

\[
 |{\cal W}_Z(f,g)|
 \leq {1\over2}
 \|Zf\|_{{\mathfrak Z},{\rm repo}}
 \|Zg\|_{{\mathfrak Z},{\rm repo}}.              \tag{6.4}
\]

Combining (5.6), (6.2), and (6.4), while retaining both cross orientations,
gives

\[
 |r_\lambda|
 \leq {1\over2}{\cal P}_3^2d_2
       +C{\cal P}_3\sqrt {d_2}.                    \tag{6.5}
\]

The fixed-label defect law is

\[
 d_2\sim {4\sqrt\pi\,8^2\over2!}
       (2\pi\lambda^2)^{5/2}e^{-4\pi\lambda^2}.
                                                               \tag{6.6}
\]

Therefore every fixed polynomial loss is beaten:

\[
 r_\lambda=o(\lambda^{-N})
 \quad\text{for every fixed }N>0
 \quad(\lambda\longrightarrow\infty,\ \lambda\in\mathbb R).
                                                               \tag{6.7}
\]

Equations (6.3)--(6.7) prove (0.4), in the stronger form

\[
 \boxed{
 q^{\rm phys}_{\lambda,-}
 ={\mathfrak b}_{\lambda,-}+o(\lambda^{-N})
 \quad\text{for every fixed }N>0.}                 \tag{6.8}
\]

The equality remains a compact physical self identified with an absolutely
convergent spectral pairing.  It does not identify the literal noncompact
ordered physical finite part of the corrected exterior row.

## 7. Continuous physical-self RH equivalence

The checkpoint-1.76 carrier theorem, inherited from checkpoint 1.75, is

\[
 {\mathfrak b}_{\lambda,-}=O(\lambda^{-1})
 \text{ for every sufficiently large real }\lambda
 \quad\Longleftrightarrow\quad {\rm RH}.            \tag{7.1}
\]

Equation (6.8) gives the two elementary implications

\[
 q^{\rm phys}_{\lambda,-}=O(\lambda^{-1})
 \quad\Longleftrightarrow\quad
 {\mathfrak b}_{\lambda,-}=O(\lambda^{-1})          \tag{7.2}
\]

on the same complete real parameter family.  Hence

\[
 \boxed{
 q^{\rm phys}_{\lambda,-}=O(\lambda^{-1})
 \text{ for every sufficiently large real }\lambda
 \quad\Longleftrightarrow\quad
 {\mathfrak b}_{\lambda,-}=O(\lambda^{-1})
 \quad\Longleftrightarrow\quad {\rm RH}.}          \tag{7.3}
\]

No selected sequence, prime-only sequence, or interpolation argument is
used in (7.3).

## 8. Why compact sampling alone is insufficient

The modal row is noncompact.  Its hard-endpoint component contains, on a
right logarithmic tail,

\[
 B_{n,0}(t)
 ={h_{n,\lambda}(\lambda)\over2\sqrt{\lambda e^t}}
 P(\lambda^2e^t),
 \qquad P(x)={1\over2}-\{x\}.                     \tag{8.1}
\]

The jumps occur at `t_k=log(k/lambda^2)`.  When the endpoint value is
nonzero, their absolute sizes are proportional to `k^(-1/2)`, and therefore

\[
 \sum_{k\geq k_0}|\Delta B_{n,0}(t_k)|=+\infty.
                                                               \tag{8.2}
\]

Thus this tail is neither compactly supported nor of bounded variation.
The compact BV sampling theorem, whose hypothesis is

\[
 \operatorname {supp}f\subset[-\log\lambda,\log\lambda],
 \qquad \operatorname {TV}_{\mathbb R}(f)<\infty,   \tag{8.3}
\]

cannot be applied directly to `O_(b,modal)`.  The weighted norm and
translation argument in Sections 3--4 is essential.

The compact projection artifact remains locked to

\[
 \lambda_j=j+{1\over2},
 \qquad N_j=2^{2400(2j+1)^2}.                     \tag{8.4}
\]

No all-real version of that projection artifact is asserted.  It is also
not needed here: the exact carrier expansion (6.3) contains the unprojected
modal row, and its proof uses

\[
 \text{outer weighted sampling}
 \quad+\quad\text{compact Fejer core passage},      \tag{8.5}
\]

not a finite log-Fourier projection.  The halfgrid projection lock therefore
does not restrict (6.8).

## 9. The later gates remain

The physical norm still has a nonzero limit,

\[
 \|w_\lambda\|^2\longrightarrow\|W_\infty\|^2>0.   \tag{9.1}
\]

Consequently an upper bound for the shifted energy in (0.7) would still
require the one-sided live-shift input

\[
 \mu\geq-O(\lambda^{-1}).                           \tag{9.2}
\]

Comparison with the pole-cancellation threshold still separately requires

\[
 \kappa\log^2\lambda\gtrsim1.                      \tag{9.3}
\]

Neither (9.2) nor (9.3) follows from the physical-self equivalence (7.3).
This note proves no energy estimate, shift estimate, transverse reserve,
overlap estimate, Pair-C closure, or determinant limit.

## 10. Final stopping line

The new result is precisely

\[
 \boxed{
 \text{compact physical odd self on all large real parameters}
 =\text{odd beta carrier}+o(\lambda^{-1}).}          \tag{10.1}
\]

It upgrades the physical-self RH equivalence from the complete odd halfgrid
to the complete continuous family.  It proves neither the bound nor RH,
does not extend the literal noncompact physical distribution, and leaves
the live shift and `kappa` gates untouched.  The formal project state remains
`P0_INVALIDATED`.

## 11. Reproduction

Run

    python3 -B -m unittest \
      tests.test_actual_mixed_bridge_continuous_compact_side_odd_carrier_transfer_theorem -v

from `research-checkpoints/xi-prolate-bridge` with `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`.
