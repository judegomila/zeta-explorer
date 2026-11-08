# Theta bridge: geometry, boundary energy, and audited obstructions

Research checkpoint, **8 November 2026**. This directory preserves the torus,
spinor, minitwistor, theta-kernel, and actual-convolution work from the current
research thread. It is a self-contained research lane. It does **not** prove RH,
and no novelty claim is made relative to the full literature.

## Main result of this continuation

For the actual theta kernels

\[
h_\pm(u)=(1\pm\alpha u/2)\kappa(u),\qquad \alpha>0,
\]

put \(A a=h_+*a\), so \(A^*a=h_-*a\). With
\(Q_c=1_{(c,\infty)}\), the exact identity is

\[
\|Q_cA^*a\|_2^2-\|Q_cAa\|_2^2
=-\langle a,\mathcal H_c a\rangle,
\]

where

\[
\mathcal H_c(u,v)=2\alpha\int_{|c-(u+v)/2|}^\infty
t\,\kappa\!\left(t-\frac{u-v}{2}\right)
\kappa\!\left(t+\frac{u-v}{2}\right)\,dt.
\]

The kernel is pointwise positive. Its **every two-point principal matrix is
positive semidefinite**, by the known strict concavity of
\(\log\kappa(\sqrt{s})\) and an explicit Gram majorant. This establishes
restricted energy inequalities. A second theorem proves positivity for every
fixed finite configuration translated sufficiently far into either end, via
the normalized limiting Gram kernel \(\operatorname{sech}((u-v)/2)\).
The exact energy also splits into a negative square and a fully explicit
indefinite remainder. Controlling that remainder for arbitrary signed or
complex superpositions remains unproved.

The actual box response is reached by a convergent unweighted regularization,
without identifying it with a continued outer-line multiplier. See
[the boundary-energy derivation](theta_boundary_energy.md) and
[the two-point positivity proof](theta_boundary_two_point.md).

## Exact open target

Let \(F(z)=\xi(1/2+z)\), \(D=F+\alpha F'\), \(N=F-\alpha F'\), and
\(\widehat{C_0f}(t)=[N(it)/D(it)]\widehat f(t)\), using
\(\widehat f(t)=\int f(u)e^{itu/2}\,du\). Common boundary zeros are cancelled.
For \(f_0=1_{[0,1]}\), \(g_0=C_0f_0\) is the unique ordinary \(L^2\) solution of

\[
h_+*g_0=h_-*f_0,\qquad \|g_0\|_2=1.
\]

The required propagation statement is \(g_0=0\) on \((1,\infty)\). Equivalently,
one can prove even the finiteness of

\[
\int_{\mathbb R}e^{u/2}|g_0(u)|^2\,du.
\]

For this particular xi family, either conclusion would imply RH. Neither is
established here. Full operator positivity \(\mathcal H_0\succeq0\) would prove
the propagation statement for every input and recover all positive exponential
energy inequalities. The exact remaining sign for the box input is recorded in
the boundary-energy note.

## Evidence ledger

| Item | Status | Location |
|---|---|---|
| Two-sphere cut and cross-glue; punctured elliptic model; spin lifts; minitwistor normalization | Algebraic construction and analytic limitations | `geometry_and_twistors.md` |
| Theta kernel as differentiated torus-period scalar; signed Gram | Derived identities | `gram_twistor_research_README.txt` |
| Fixed-midpoint seven-point negative Gram direction, including the full theta tail | Interval certificate | `gram_attack_torus_theta_20261108.py` and accompanying `.txt` |
| Positive integrated value for that one direction | Numerical diagnostic only | `gram_layer_cancellation.json` and `.svg` |
| Single actual pulse plus one exponential moment implies RH | Derived criterion, independently audited in this session | `bridge_single_pulse_research_note.txt`, `independent_audit.txt` |
| Weighted positive theta resolvent, with explicit feature-matching failure | Proved for the stated operator | `weighted_theta_resolvent_20261108.txt` |
| Specific confining operator with ground state \(\kappa^2\) cannot have exactly the xi frequencies | Interval Rayleigh exclusion | `theta_confining_operator_certificate.py` and `.json` |
| Boundary-flux identity and actual-pulse regularization | Derived identities and convergence | `theta_boundary_energy.md` |
| Every two-point principal matrix of the boundary kernel is PSD | Proved using cited theta concavity | `theta_boundary_two_point.md` |
| Every fixed finite configuration sufficiently far into either end is positive definite | Proved by theta-tail asymptotics; no uniformity in size/configuration claimed | `theta_boundary_two_point.md` |
| Arbitrary-order boundary-kernel PSD / box-pulse propagation / endpoint exponential energy | **Open** | `theta_boundary_energy.md` |

The existing [theta-Fisher/zeta-sphere checkpoint, PR #40](https://github.com/judegomila/mathexplorer/pull/40)
is related repository context. This directory is an independent checkpoint of
the present convolution and geometry work; it does not upgrade that campaign's
finite or conditional claims.

## Reproduce

From this directory, using Python 3.12:

```bash
python -m pip install -r requirements.txt
python gram_attack_torus_theta_20261108.py
python theta_confining_operator_certificate.py
```

The first two scripts are the interval certificates. Their analytic remainder
bounds are part of the accompanying notes. The second overwrites its JSON with
the reproduced enclosure. They do not depend on the app or on a zero-data API.

The numerical figures can be regenerated separately:

```bash
python gram_layer_cancellation.py
python torus_vortex_audit.py
```

These create PNG/SVG/JSON files next to the scripts. The checked-in SVGs and JSONs
are historical outputs from the thread; they are **numerical illustrations**,
not global sign certificates. The torus plot omits \(|s|>50\) in its global
sample, retaining the essential punctures as unresolved analytic boundaries.

`validation.json` distinguishes this checkpoint's certificate replays from
historical illustration outputs. `MANIFEST.json` records file hashes and
source-copy provenance. `SOURCES.md` identifies primary references and what
they support. The original note's two domain-wording issues were corrected in
this staged copy, with the changes recorded by the audit.
