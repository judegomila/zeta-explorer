# Actual theta propagation: quantitative energy and the remaining uniformity

Research continuation, **8 November 2026**. This is a new checkpoint following
[PR #43](https://github.com/judegomila/mathexplorer/pull/43). It adds independent
proofs and certificates and can be reviewed without merging that earlier PR.
No novelty claim is made.

**The zero-leakage/exponential-energy task is not closed.** The strongest new
bound on the actual response is

\[
\boxed{
0\le\|\mathbf1_{(1,\infty)}C_0\mathbf1_{[0,1]}\|_2^2
<0.124030166<\frac18\qquad(\alpha=1).
}
\]

It is an unconditional, interval-certified upper bound. The actual leakage may
be zero. This does not establish exponential integrability or RH.

## Definitions and the open estimate

Let

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\quad
\kappa(u)=(\partial_u^2-1/16)[e^{u/4}\theta(e^u)],
\]

where \(\theta(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t}\). Set
\(h_\pm(u)=(1\pm\alpha u/2)\kappa(u)\), \(A=h_+*\), \(A^*=h_-*\), and

\[
\widehat{C_0f}(t)=
\frac{F(it)-\alpha F'(it)}{F(it)+\alpha F'(it)}\widehat f(t),
\quad \widehat f(t)=\int f(u)e^{itu/2}\,du.
\]

Common boundary zeros are removable. The operator \(C_0\) is unconditionally
unitary. For \(f_0=1_{[0,1]}\) and \(g_0=C_0f_0\), the actual equation is
\(h_+*g_0=h_-*f_0\), and \(\|g_0\|_2=1\).

The prior exact energy identity, for \(f=Aa\), \(g=A^*a\), is

\[
\|Q_cg\|_2^2-\|Q_cf\|_2^2=-\langle a,\mathcal H_ca\rangle,
\qquad Q_c=1_{(c,\infty)},
\]

\[
H_c(u,v)=2\alpha\int_{|c-(u+v)/2|}^\infty
t\kappa\left(t-\frac{u-v}{2}\right)
\kappa\left(t+\frac{u-v}{2}\right)\,dt.
\]

The known positive Gram operator and explicit correction are

\[
(B_ca)(s)=\sqrt\alpha\int
\kappa\left(\sqrt{s+(u-c)^2}\right)a(u)\,du,
\quad \Delta_c=B_c^*B_c-\mathcal H_c.
\]

For the actual regularized preimages
\(a_\epsilon=(A^*A+\epsilon I)^{-1}A^*f_0\), the remaining limit is

\[
\|Q_1g_0\|_2^2
=\lim_{\epsilon\downarrow0}
\left[\langle a_\epsilon,\Delta_1a_\epsilon\rangle
-\|B_1a_\epsilon\|^2\right].
\]

The task is to show this limit is zero. Only the combined expression is known
to converge. This checkpoint does not assert separate finite limits for its
two terms.

## New results and their evidence

| Result | Evidence and scope | Read |
|---|---|---|
| Actual box leakage is less than 1/8 | Full-theta interval certificate using a fixed rational three-feature witness; no kernel-PSD assumption | [Pulse bound](theta_pulse_leakage_bound_20261108.md) |
| Regularized pulse preimages require unbounded signed cancellation | Real Schwartz preimages have diverging L1 and L2 norms, bounded total integral, and diverging positive/negative masses | [Actual preimages](theta_pulse_hardy_defect_20261108.md) |
| Exact leakage is a Hardy model-space projection | Unconditional quotient of coprime inner factors; finite/confluent Cauchy-Gram bounds detect hypothetical poles | [Projection formula](theta_pulse_hardy_defect_20261108.md) |
| Every cardinality of separated configurations is positive far into one tail | Explicit coercivity bound uniform in number and span, with a fixed positive minimum spacing | [Separated-tail theorem](theta_separated_tail.md) |
| Full PSD on any open interval is equivalent to global PSD | Holomorphic L2 feature span and analytic continuation; full tail positivity is already the global task | [Localization](theta_flux_analytic_localization_20261108.md) |
| The derivative jet indexed by orders 0,1,2 at zero is positive definite | Full-theta interval certificate; this is one finite jet, not all orders | [Jet proof](theta_flux_analytic_localization_20261108.md) |

The separated-tail theorem is stronger than the previous fixed-finite-offset
limit: it permits an arbitrary number of points with constants independent of
cardinality. Its minimum-spacing restriction is essential to the proved bound.
The required start tends to infinity as the spacing decreases in this proof.

The localization theorem explains the unresolved regime precisely. For this
analytic kernel, positivity for all derivative orders at a single point is
equivalent to full kernel positivity. A finite jet and a separated-family
theorem do not supply that order-uniform control.

## Why a small leakage bound is not zero leakage

The preimage divergence is an inverse-smoothing phenomenon; it occurs even if
RH is true. It prevents the specific Tikhonov family from staying in the
nonnegative-preimage cone, so the entrywise-positive kernel cannot simply be
applied to that cone and passed to the limit.

The Hardy note also gives a single inverse-Blaschke toy with arbitrarily small
strictly positive leakage. This is not an xi counterexample. It demonstrates
that the general unitary/projection framework has no universal positive gap
that could promote a fixed upper bound to exact zero. No new certified
zero-free height is claimed.

## Reproduce the certificates

From this directory, using Python 3.12 and `mpmath==1.3.0`:

```bash
python -m pip install -r requirements.txt
python theta_pulse_leakage_certificate_20261108.py
python theta_flux_jet3_certificate_20261108.py
python theta_separated_tail_certificate.py
```

All three completed successfully in this continuation. Their captured logs
are the corresponding `*_replay.txt` files. The pulse and separated-tail
scripts also write JSON outputs. The programs include the full theta tails,
analytical quadrature bounds where needed, and assertions on the claimed
inequalities. Finite eigenvalue sampling is not used as a positivity proof.

`AUDIT.md` records the mathematical checks and their scope. `validation.json`
records runtime and replay status. `MANIFEST.json` records source and staged
file hashes. `SOURCES.md` identifies the primary background references.

## Remaining mathematical obligation

Prove an estimate on the actual signed pulse preimages that forces the above
combined limit to zero; or prove the complete derivative-jet hierarchy, which
would give full boundary-kernel positivity and the global propagation theorem.
The new certificates establish only the specific bounds stated here.
