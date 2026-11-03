# Exact-EGF gate and signed modular-pair results

## Scope and outcome

This workstream tested an arbitrary-grade generating identity and two proposed
shrinking endpoint scales. It did not extend the finite-degree certificate
search, and it does not prove the reflected contraction or RH.

The exact exponential generating function passed its hard gate. The finite
signed-pair experiment then rejected the proof strategy of paying reflected
halves or orbit contributions separately in absolute value. It did **not**
identify either `h=c/N` or `h=c/N^2` as a distinguished boundary scale: both
observed collapses are explained by the ordinary center Taylor laws forced by
parity.

The next analytic target is therefore a residue-preserving Hadamard--Schur
reduction in the actual paid-twin border recurrence. It must retain the signed
feature/residue cross term.

## Execution and resource audit

- Stage 0 completed `1/1` task and emitted `queue_complete`.
- Stage 1 recorded 13 completed receipts and one failed receipt, then emitted
  `queue_complete`. No stage-0 or stage-1 supervisor or worker remains.
- The stage-1 final heartbeat saw two-key agreement that the Mac was locked,
  the protected 4CT command and exact working directory matched, the protected
  job had zero absence samples, and the five-worker cap remained in force. It
  sampled 18% total-host busy against the conservative 84% locked target.
- A final read-only audit at `2026-11-03T11:01:47Z` again found both lock keys
  set to `Yes`, 10--15% total-host busy over the two interval samples, and the
  protected controller still active as PID `76469` in
  `/Users/USER/Documents/GitHub/4ct/4ct-map/experiments/rsst-layer3`.
  Its current `mip_chain.py` descendant used about one core. No RH worker or
  supervisor was active.
- No event recorded a signal, load-sample failure, or protected-job-finished
  transition. The workstream never wrote to the protected checkout or its live
  scripts.
- Before the later `M0` run, results and run records occupied about 1.9 MiB.
  Every worker was launched with
  single-thread library limits, background scheduling, and `nice 15`.
- The later `M0` diagnostic completed one additional governed task in about
  90 seconds. Its retained final heartbeat records locked two-key agreement,
  8% host busy, the five-worker cap, no remaining active worker, and a matching
  protected PID/CWD. Its event log contains no signal or failure event, and
  the protected 4CT chain remained active throughout the run. The result SHA-256 is
  `ca2d92a54be962d1ca2d8c54f29ca8b191fc04924ead504ed232071cfde2c5c2`;
  the deterministic analysis SHA-256 is
  `29d7e4fc0fabc3da5e2add1c764e4e0c8bb1eea30b5c4b251fcbfaaa90ea9d3d`.

The sampled governor is not a kernel quota. Its conservative targets are 84%
when locked and 42% when unlocked or lock-uncertain; it can signal only process
groups it created and recorded. While 4CT is present it permits at most five RH
workers. Only three consecutive verified absences would permit the locked
15-worker cap.

## Stage 0: exact generating identity

The characteristic calculation gives the arbitrary-grade identity

\[
P(t,z)=e^{t/2-z(e^{2t}-1)}P_0(ze^{2t})
\]

and, after removing the apparent pole at `z=3/2`,

\[
A(t,z)=
\frac{e^{5t/2-z(e^{2t}-1)}(2ze^{2t}-3)-C(t)}{2z-3},
\qquad
C(t)=3(e^{2t}-1)e^{5t/2-\frac32(e^{2t}-1)}.
\]

The result manifest checked the full polynomial recurrence through grade 64,
the scalar residue through grade 128, and 260 sampled comparisons. All exact
checks passed. The formula hash is
`7cd5aa8898b39cfc1eed9417bd6bb7d9b8f52dfd33ca25665e4f2c7765cf8843`;
the result hash is
`354703546a02d24f41699a47739686057a94270103589a62601181043ad9c83c`.

The finite check is an implementation audit. The arbitrary-grade claim comes
from the characteristic proof in `../all-degree-analytic-search/GENERATING_FUNCTION.md`,
not from checking 128 coefficients.

## Stage 1: signed `h,-h` diagnostics

The accepted source at each `(N, parity)` is the highest-precision valid
result. The sweep used `N=8,12,16,20,24`, both parities, and the six points
`h=c/N^beta` with `beta=1,2` and `c=1/4,1,4`.

### Receipt and replay gate

The primary `pair_n24_odd_p756` task correctly rejected its output because
direct and paired evaluations of the residue could not meet the accuracy gate.
Here

\[
\ell=3.9760389934\ldots\times10^{-804},\qquad
\log_{10}|\ell|=-803.40055\ldots .
\]

At 756 decimal digits the direct cancellation budget is about `-47.4` digits,
so no reliable value can be recovered. The planned 916-digit replay had about
`112.6` digits of headroom and passed all six scales with relative paired
residuals between roughly `10^-111.90` and `10^-111.49`. Its interpolation
retained about 873 nominal digits after condition loss. This classifies the
primary failure as cancellation-driven precision exhaustion, not an identity
failure. The failed receipt is preserved and no p756 JSON was accepted.

The N16 even/odd and N24 even primary/replay pairs agree exactly at the emitted
80-digit precision in all replay metrics. The p916 N24 odd result has no second
successful N24 odd run, so the documented two-success promotion gate remains
unmet.

### Absolute-value obstruction

Regressing

\[
y_N=\log_{10}\frac{\mathrm{TV}}{|\text{signed total}|}
\quad\text{against}\quad x_N=N^2
\]

over `N=12,16,20,24` gives:

| parity/scale | `c=1/4` | `c=1` | `c=4` |
|---|---:|---:|---:|
| even, `beta=1` | -0.0000117 | -0.0001537 | -0.0003766 |
| even, `beta=2` | -0.0000003 | -0.0000018 | -0.0000247 |
| odd, `beta=1` | 1.3908088 | 1.3908905 | 1.3937579 |
| odd, `beta=2` | 1.3894422 | 1.3894428 | 1.3894535 |

The even cancellation cost stays bounded near
`10^0.3825 = 2.413...`. The odd cost grows empirically like
`10^(1.39 N^2)`; at `N=24, beta=2, c=1` its logarithm is `800.292791`.
On this tested family, applying triangle inequalities orbitwise or paying
`+h` and `-h` separately loses the essential odd-sector cancellation. This
raw finite linear diagnostic does not by itself reject a universal proof step
or rule out a correlated blockwise estimate inside the true paid-twin metric.

### Scale and profile tests

All twelve `N=20` to `N=24` total-variation-normalized cumulative-profile
distances are below 10%. The largest is `0.02842003`, for even
`beta=1,c=4`. That profile nevertheless fails the stricter shrinking-distance
gate: its consecutive discrepancies are
`0.01556435, 0.02789528, 0.02842003`.

The apparent stable profiles do not select an endpoint exponent. In the local
regime the data give

\[
E_{\rm even}(0,h)\sim0.01855h,
\qquad
E_{\rm odd}(0,h)\sim515.7h^3,
\]

with odd total variation approximately `281.3 h^2`. These powers are forced by
the center parity. Both polynomial scales therefore collapse automatically;
`beta=2` merely reaches the local Taylor regime sooner.

The consecutive profile distances, odd `TV/h^2` normalization, and crossover
logs in this subsection are separate read-only diagnostics derived from the
stored results; `analysis-stage1.json` currently emits the N20--N24 profile
distances, energy normalizations, and regressions but not those three auxiliary
summaries.

For the adversarial odd interpolants, balancing the scalar signed total with
the absolute Taylor contribution suggests an empirical crossover with decimal
logs approximately

`-45.8, -102.2, -180.5, -280.8, -402.9`

at `N=8,12,16,20,24`. This suggests a Gaussian-thin scalar layer for this
family, rather than `N^-1` or `N^-2`, but it is only a numerical inference.

## Exact versus numerical evidence

- The EGF is arbitrary-grade because of its characteristic proof.
- The infinite-sum odd-center lemma in `../all-degree-analytic-search/ODD_CENTER_LEMMA.md`
  is exact. The worker field named `odd_exact_tail_bound` uses the finite
  orbit-96 sums and is not itself a rigorous infinite-tail bound.
- All pair diagnostics use orbit cutoff 96. A tiny last term and last-term
  ratio are diagnostics, not interval tail bounds.
- Local energies use 16-panel Simpson quadrature without an interval enclosure
  or stored error estimate. They are explicitly non-rigorous.
- Replays use the same implementation. Agreement is a reproducibility and
  precision check, not independent formal verification.
- No finite scaling pattern here proves bridge positivity, the reflected
  contraction, or RH.

## Stage 2: finite endpoint forcing diagnostic

The implemented first stage-2 mode is a SHA-bound midpoint reconstruction of
the already certified odd endpoint rungs 3--19. It binds the exact EGF result,
the parent interval Gram, the inherited target moments and the archived
endpoint certificate. For every rung it computes

\[
D_{\rm old}=L\operatorname{diag}(s_k)L^T,
\qquad \eta=L^{-1}w,
\qquad w^TD_{\rm old}^{-1}w=
\sum_k\frac{\eta_k^2}{s_k}. \tag{S2.1}
\]

The 120- and 180-digit tasks both completed with return code zero. Receipt
hashes match their outputs, every hard gate passed, and the largest scaled
primary/replay disagreement across parent coefficients, forcing vectors,
pivots, innovations, payment terms and reconstructed metrics was below
`3.7e-105`. The governed event sequence contains no signal, load-sample
failure, worker failure or protected-job-finished event. Its last heartbeat
recorded two-key locked agreement, 8% host busy, the five-worker cap and an
exact protected PID/CWD match.

One earlier detached launch used relative paths and exited before creating a
supervisor or worker. The preserved launcher log records the ENOENT. The
absolute-path relaunch is the run represented by the receipts and events.

At the degree-19 reconstruction the replay gives

| quantity | midpoint diagnostic |
|---|---:|
| innovation derivative gain | `0.0002522037215243273520...` |
| target inverse cost | `0.0000918765622810192213...` |
| new degree-19 surplus/pivot | `0.0001603271592433081307...` |
| last old-block degree-17 pivot | `0.0004596904801786960028...` |

The final old-channel term contributes
`0.0000734117796328606911...`, or about `79.9026%`, of the degree-19 inverse
cost. This is a useful finite near-diagonal concentration diagnostic, not a
proved all-degree decay law.

The archived intervals remain the certificate. Midpoint containment is only a
consistency check, and the new `eta` coordinates are not interval-certified.
Direct modular-channel and finite-shift modes remain unimplemented. A safe
direct-channel implementation must replace the proposed fixed negative-side
orbit cutoff by an audited modular transform or a validated adaptive cutoff,
and must specify its spatial, quadrature, tail, stabilization and ablation
contracts before launch.

## Exact spectral and rank-two closure

Let `widehat(psi)=2Xi` in the nonunitary Fourier convention. For a real
fixed-parity polynomial `p`, the endpoint target has the exact representation

\[
\mathfrak q(p)=\frac1\pi\int_{\mathbb R}
\left(\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)\right)
|p(i\nu)|^2\,d\nu. \tag{S2.2}
\]

Equivalently, with the frozen audit's bridge density

\[
f_{\rm bridge}(t)=
\Xi'(t/2)^2-\Xi(t/2)\Xi''(t/2),
\]

the form is `(1/(2*pi)) integral f_bridge(t)|p(it/2)|^2 dt`. Exponential
moments and polynomial density imply, separately in either complete parity
ladder,

\[
\mathfrak q(p)\geq0\text{ for all }p
\quad\Longleftrightarrow\quad
f_{\rm bridge}(t)\geq0\text{ for every real }t. \tag{S2.3}
\]

Thus the directional contractive-extension inequalities are exactly the
successive signed Christoffel pivots of this density. The even and odd Hankel
blocks obey, under nonzero old-prefix determinants, the exact cross-parity
recurrence

\[
\widetilde h_n=-h_n\frac{\pi_{n+1}(0)}{\pi_n(0)}, \tag{S2.4}
\]

where `pi_n` is the monic polynomial for the signed pushforward in
`u=t^2/4`. This is a sharp reformulation, not a proof: a positive spectral
square root assumes (S2.3), and endpoint sign alternation for every `pi_n`
encodes the same missing sign.

The rank-two residue drift also admits a sharp conditional reduction. If
`M_0>0`, put

\[
R=M_0^{-1},\quad V=v^*Rv,\quad D=d^*Rd,\quad v^*Rd=C+iJ.
\]

Then

\[
M_0-vd^*-dv^*\succeq0
\quad\Longleftrightarrow\quad
C+\sqrt{VD-J^2}\leq1. \tag{S2.5}
\]

For real theta data the right side is `C+sqrt(VD)<=1`, and the intrinsic
balancing parameter is `tau_*=sqrt(D/V)`. However, positivity of this signed
`M_0` is itself unproved; the positive-parent Christoffel metric is different.
Moreover, once either parity prefix contains the two independent displayed
residue/drift coordinates, the pure Poisson-residue sector satisfies for every
`tau>0`

\[
b_{\tau,{\rm res}}^*B_{\tau,{\rm res}}^\dagger b_{\tau,{\rm res}}
=1+\frac{\tau\Gamma^2}{A}>1. \tag{S2.6}
\]

So neither the retained residue nor the choice `tau=c^{-1}` can close the
contraction alone. Corrected-feature/residue cross terms are mandatory. The
subsequent independent inertia audit shows that the tempting all-prefix bound
`n_-(M_0)<=1` is not a weaker intermediate target: any uniform finite bound on
`n_-(M_(0,N))` is equivalent to the endpoint spectral sign.

Finally, the exact grade-shift recurrence has an unavoidable auxiliary
channel. With `S:p->zp` and `Vp=p(D)psi`,

\[
XS^m=D^mX-mD^{m-1}V,
\qquad YS^m=D^mY+mD^{m-1}V. \tag{S2.7}
\]

The pure `V` squares cancel in the target, leaving a signed cross term. Any
proof that drops that term and budgets `V` separately loses the exact
compensation. This matches the two independent residue/drift coordinates
`-C(t)` and `-tC(t)`.

## Frozen-residue closure and governed finite diagnostic

For each finite parity prefix the actual target `Q_N` and frozen-residue form
obey the exact identity

\[
M_{0,N}=Q_N+v_Nd_N^*+d_Nv_N^*. \tag{S3.1}
\]

The cross term has at most one positive and at most one negative direction.
If the continuous Xi--Laguerre density is negative anywhere, parity-polynomial
density produces arbitrarily large negative target subspaces, and the
rank-two correction can change their negative index by at most one. Therefore,
separately in either complete parity ladder,

\[
f_{\rm bridge}\geq0
\quad\Longleftrightarrow\quad
n_-(M_{0,N})\leq1\ \hbox{for every }N
\quad\Longleftrightarrow\quad
\sup_N n_-(M_{0,N})<\infty. \tag{S3.2}
\]

This is an endpoint-equivalent closure, not a one-step induction. Knowing only
that the old target is positive gives the sharp generic bound
`n_-(M_(0,N))<=2`; `M0_INERTIA_COUNTERMODEL.md` gives a positive-parent model
attaining two. The exact extra real-theta gate on a positive old target `A` is

\[
\sqrt{VD}-C\leq1,
\qquad
V=v^TA^{-1}v,\quad D=d^TA^{-1}d,\quad C=v^TA^{-1}d. \tag{S3.3}
\]

Equivalently, with

\[
\mathcal L_\tau(p)=
\frac{\sqrt\tau\,v(p)-\tau^{-1/2}d(p)}{\sqrt2},
\]

the noncircular finite-prefix target is

\[
\inf_{\tau>0}\|\mathcal L_\tau\|_{A^*}^2\leq1. \tag{S3.4}
\]

Here `v` is a one-sided real-frequency correlation, whereas the residue EGF
gives the off-real trace

\[
d(p)=3e^{3/2}\sum_{k\geq0}\frac{(-3/2)^k}{k!}
\left[p'(5/2+2k)-p'(9/2+2k)\right]. \tag{S3.5}
\]

For even `p`, `d(p)=Psi_(p')(0)/chi(0)`; for odd `p`,
`d(p)=-Psi_(p')'(0)/q''(0)`. A theorem making (S3.4) hold on every prefix
would have to preserve this `v`--`d` correlation. The real-line analysis below
proves that this stronger universal theorem is false in each parity.

The SHA-bound governed diagnostic reconstructed `M_0` on the archived odd
prefixes through degree 19. Its single worker performed a 100-digit primary
run with `(h_cutoff,t_extent,orbits,step_denominator)=(3,4,12,128)` and a
160-digit parameter replay with `(4,5,16,256)`. It completed in about 90
seconds with the event sequence `supervisor_started`, `worker_started`,
`worker_completed`, `queue_complete`; no signal, failure or load-sample event
occurred. The final governed analyzer passed every source, input, manifest,
receipt, event and result-hash gate.

Every tested prefix had ordinary and positive-parent-whitened inertia
`(0,0,n)`. At degree 19 the ordinary minimum eigenvalue was
`3.190708788505076e-7`, the parent-whitened generalized minimum was
`0.0519068354542091`, and (S3.3) had left side
`0.2752057211006705450...`, leaving margin
`0.7247942788993294550...`. The primary/replay `M_0` matrices differed by at
most `3.09e-60`. These are floating cutoff and midpoint diagnostics, not
interval-certified new claims, an all-degree proof, or evidence that finite
checks imply RH.

The JSON field names containing `certified_prefixes` refer only to the
archived list of endpoint rungs used as inputs. They do not classify the new
`M_0` reconstructions or their inertias as certified.

## Real-line trace and retirement of universal `M_0` positivity

The residue drift has an exact undivided real-frequency kernel. With the
Fourier convention `uhat(nu)=integral u(t)e^(-i nu t)dt`, put

\[
 E(t)=3(1-e^{2t})
 e^{5t/2-(3/2)(e^{2t}-1)},\qquad D(t)=tE(t),
\]

\[
 a=\frac32,\qquad s=\frac54-\frac{i\nu}{2}.
\]

Both `E` and `D` are Schwartz, and direct Mellin substitution gives

\[
 \widehat E(\nu)=\frac{e^a}{4}a^{-s}(1+2i\nu)\Gamma(s),
\]

\[
 \widehat D(\nu)=-\widehat E(\nu)
 \left[\frac12\log a+\frac{2}{1+2i\nu}
       -\frac12\psi_0(s)\right],
 \qquad
 d(p)=\frac1{2\pi}\int_{\mathbb R}p(i\nu)\widehat D(\nu)\,d\nu.
 \tag{S4.1}
\]

For `g=1_(h>0)h chi`, the two channels therefore have the single numerator

\[
 B_\tau(\nu)=2\sqrt\tau\,\Xi(\nu)\overline{\widehat g(\nu)}
             -\tau^{-1/2}\widehat D(\nu).
 \tag{S4.2}
\]

On a positive finite prefix with Christoffel kernel `K_N`, this yields the
division-free identity

\[
 \|\mathcal L_\tau\|_{A_N^*}^2
 =\frac1{8\pi^2}\iint K_N(i\nu,i\mu)
 B_\tau^{(\epsilon)}(\nu)
 \overline{B_\tau^{(\epsilon)}(\mu)}\,d\nu\,d\mu,
 \tag{S4.3}
\]

where the real and imaginary projections serve the even and odd ladders.
The same drift is exactly a shifted first-theta-orbit trace:
`E(t)=-kappa_0 psi_1(t-delta)` with
`delta=log(2 pi/3)/2`, so
`d(p)=-kappa_0[p'(D)psi_1](-delta)`. The reflected real-space formulas in
`M0_THETA_ORBIT_REFLECTION.md` give a second derivation with all boundary
terms retained.

These formulas do not prove (S3.4) uniformly. They prove its obstruction.
Stirling and the complete-theta boundary expansion give

\[
 |\widehat D(\nu)|\asymp
 |\nu|^{7/4}\log|\nu|e^{-\pi|\nu|/4},
 \qquad
 \widehat g(\nu)=\frac{\chi(0)}{(i\nu)^2}+O(|\nu|^{-3}).
 \tag{S4.4}
\]

For every fixed finite `tau`, the drift term dominates (S4.2). Its gamma
phase traverses positive-density cosine and sine sectors on every large dyadic
interval, so both parities retain this size. On the conditional branch
`f=Xi'^2-Xi Xi''>=0`, standard critical-line bounds give
`f(nu)<<_epsilon e^(-pi|nu|/2)|nu|^(4+epsilon)`. Consequently the squared
even and odd numerators divided by `f` each dominate a nonintegrable
`|nu|^(-1/2-epsilon)log^2|nu|` lower envelope on positive-density sectors.
No fixed-`tau` functional is bounded in the full target norm.

For nested positive prefixes,

\[
 F_N(\tau)=\|\mathcal L_\tau\|_{A_N^*}^2
 =\frac12(\tau V_N+D_N/\tau-2C_N)
 \tag{S4.5}
\]

is pointwise nondecreasing. Once `V_N,D_N>0`, every nonempty feasible set is
the compact interval

\[
 \left[
 \frac{1+C_N-\sqrt{(1+C_N)^2-V_ND_N}}{V_N},
 \frac{1+C_N+\sqrt{(1+C_N)^2-V_ND_N}}{V_N}
 \right].
 \tag{S4.6}
\]

If every prefix passed, nested compactness would therefore produce one fixed
`tau` passing the whole ladder, contradicting the preceding unboundedness. If
`f` is negative somewhere instead, parity-polynomial density gives target
prefixes of unbounded negative inertia, which a rank-two update cannot all
repair. Hence, unconditionally, some finite `M_(0,N)` prefix fails positive
semidefiniteness in each parity. This does not locate that prefix, prove
endpoint negativity, refute the endpoint-equivalent `n_-<=1` statement, or
have an RH implication.

The lightweight Arb certificate in `results/m0_boundary_jet_arb.json`
independently proves

\[
 B_4+\frac{65}{2}B_2=18.88523612206745\ldots>18,
\]

which rules out a naive one-scalar formal-adjoint cancellation of every
boundary jet. It is a local obstruction, not the proof of the all-prefix
route-retirement theorem.

### Surviving one-negative-direction structure

The correct continuation is indefinite rather than positive semidefinite.
If an old frozen-residue block `B` has exactly one negative direction, then a
border `[[B,b],[b^*,c]]` preserves index at most one exactly when

\[
 b\in\operatorname{Ran}B,
 \qquad c-b^*B^\dagger b\geq0.                       \tag{S4.7}
\]

If `B` is nonsingular, the second quantity is the exact frozen-residue square
of the `M_0`-orthogonal theta residual `R_N`:

\[
 \mathfrak m_0[R_N]
 =\frac12\left(
 \|2hF_{R_N}+\Psi_{R_N'}\|_2^2-\|\Psi_{R_N'}\|_2^2
 \right).                                           \tag{S4.8}
\]

Thus all leading pivots may contain at most one negative term. This criterion
does not assume a positive old target, but proving it for every rung is still
endpoint-equivalent. `ONE_NEGATIVE_DIRECTION_NEXT.md` gives the singular,
Pontryagin-graph, determinant, and secular forms.

For any `lambda>0`, the same structure has the exact minimal signature split

\[
 M_0=\left(A+|a_\lambda|^2\right)-|b_\lambda|^2.     \tag{S4.9}
\]

The boundary functionals in (S4.9) are unbounded and nonclosable in the
target completion. More strongly, every nonzero finite constant-coefficient
combination of residue jets has leading kernel
`Ehat(nu)P(log(nu/3)/2-i pi/4)` and remains target-dual divergent in both
parities. `DRIFT_RENORMALIZATION_NEXT.md` therefore rules out finite boundary-
jet repair while retaining the one allowed negative square.

The endpoint density itself has the unconditional theta interaction form

\[
 \Xi'(t)^2-\Xi(t)\Xi''(t)=\widehat R(t),
 \qquad
 R(u)=\frac12(\psi*\psi)(u)
 \operatorname{Var}(X\mid X+Y=u)>0.                 \tag{S4.10}
\]

Its sign is equivalent to positive definiteness of `R`, not pointwise
positivity. `THETA_TURAN_NEXT.md` proves (S4.10), shows that an unspecified
autocorrelation factor would be circular, and supplies exact Gaussian and
decay guardrails. It does not prove the missing positive definiteness.

## Next all-degree lemma

Let `r_n` be the positive-parent regression residual for the new rung and let
its opposite-parity feature drift be

\[
k_n=n f_{n-1}-\sum_j j\alpha_j f_{j-1}.
\]

The exact endpoint pivot derivative is

\[
\dot\delta_n=
2\langle h r_n,r_n\rangle_0+
2\operatorname{Re}\langle r_n,k_n\rangle_0. \tag{1}
\]

If `s_j>0` are the old actual-target LDL pivots and `eta_{n,j}` are the
corresponding forcing innovations, the missing paid-twin statement is

\[
2\langle h r_n,r_n\rangle_0+
2\operatorname{Re}\langle r_n,k_n\rangle_0
\geq \sum_{j<n}\frac{|\eta_{n,j}|^2}{s_j}, \tag{2}
\]

equivalently

\[
\begin{pmatrix}
\dot\delta_n&\eta_n^*\\
\eta_n&\operatorname{diag}(s_j)
\end{pmatrix}\succeq0. \tag{3}
\]

The exact two-regression decomposition in `PAID_SCHUR_NEXT.md` now rewrites
this same border as

\[
 2S=A_X-B_Y-C_{XY},
 \qquad
 C_{XY}=r^*(G_Y^\dagger+Q^{-1})r\geq0,              \tag{4}
\]

where `A_X=dist(Xp,XP_old)^2`, `B_Y=dist(Yp,YP_old)^2`, and
`Q=G_X-G_Y=2A_old`. For a monic degree-`n>=1` rung,
`B_Y=n^2h_(n-1)^(Y)`, the adjacent opposite-parity positive-`L2`
Christoffel pivot. The necessary positive-channel comparison is
`A_X>=B_Y`; the exact sufficient target is

\[
 r^*(G_Y^\dagger+Q^{-1})r\leq A_X-B_Y.              \tag{5}
\]

This keeps the full corrected-feature/residue/drift correlation inside the
regression mismatch. It proves no uniform bound on either side.

### Directional mismatch, angle, and Turan forms

For the positive-`X` regression residual `R_X=p-q_X`, the mismatch covector
has the exact assembled theta forms

\[
 r(q)=\langle Yq,YR_X\rangle=-2\mathfrak q(q,R_X),
 \qquad
 r=G_Y(\alpha_Y-\alpha_X)=Q(\alpha_X-\alpha_A).     \tag{6}
\]

In real frequency its polynomial `U` satisfies, against every old polynomial,
the Galerkin equation for

\[
 \mathcal L U=-(\Xi^2U')'
 +2(\Xi'^2-\Xi\Xi'')U.                              \tag{7}
\]

All coefficients are undivided through Xi zeros. The mismatch payment is

\[
 r^*(G_Y^\dagger+Q^{-1})r
 =\|Y(q_Y-q_X)\|^2+2\mathfrak q(q_X-q_A),           \tag{8}
\]

and substitution gives `2S=2\mathfrak q[p-q_A]`. This last collapse is the
actual signed Schur pivot itself, not a sign proof. It shows that a generic
`Q^-1` Cauchy payment is circular.

Writing `w=Y(q_Y-q_X)` and letting `cos(theta_j)` be the old contraction
singular values gives the exact angle form

\[
 C_{XY}=\sum_j\csc^2\theta_j|w_j|^2.                \tag{9}
\]

The live inequality is therefore a spectral-alignment statement: the actual
mismatch must avoid or be paid more strongly in near-isometric old modes.
`OPERATOR_ANGLE_NEXT.md` gives the equivalent normalized matrix
`K(I+K)`, the feedback split, and an exact two-dimensional countermodel that
can also satisfy the formal graded commutators. `INNOVATION_GAP_NEXT.md`
independently gives exponential and even positive entire Schwartz profiles
with `A_X-B_Y<0`. These countermodels refute generic shortcuts only; they are
not generated by the complete-theta source.

For that actual source, the same directional border is

\[
 2S=A_X-B_Y-C_{XY}
 =4[\pi(D)\pi(-D)R](0),                             \tag{10}
\]

where `pi=p-q_X+q_(Q^-1 r)` is the mismatch-corrected old-target residual and
`R=(psi*psi) Var(X given X+Y)/2`. Equivalently,

\[
 2S=\frac1{128\pi}\int_{\mathbb R}
 \left|\pi\!\left(\frac{i\kappa}{2}\right)\right|^2
 \left.\partial_a^2(P_a\mathcal F_a)\right|_{a=0}
 \,d\kappa.                                        \tag{11}
\]

This primitive-curvature formula is zero-safe and weaker than pointwise
curvature, but its directional sign remains open. Treating `R` as a
stationary covariance would already assume the missing positive definiteness.

For any polynomial channel `A`, put `e_A=ell(A)`. The exact modular split is

\[
F_A=S_A-e_Aq/2\quad(A\text{ even}),
\qquad
F_A=-D_A+e_Aq'\quad(A\text{ odd}).
\]

Substituting this split into both terms of (1) retains the signed `Fq`, `Fq'`,
and `e_r e_k q q'` correlations. At the endpoint the residual residue and its
opposite-parity drift are two independent linked coordinates, generated by
`-C(t)` and `-tC(t)`. The minimal uniform augmentation is therefore a `3x3`
quadratic in corrected feature, residue, and residue drift. It must prove (2)
without separating their signed cross terms.

Two bounded falsification tests are appropriate before pursuing the proof:

1. Reconstruct (1)--(3) on already verified finite rungs by both direct theta
   integrals and modular-channel substitution, checking precision, cutoff, and
   quadrature doubling. A stronger channel inequality that fails while the
   direct pivot stays positive is too strong.
2. For any proposed sublemma claimed for **all** parity polynomials, apply it
   to the adversarial center interpolants. A universal step that replaces
   their signed channels by total variation or absolute cross terms should
   expose the observed `10^(1.39 N^2)` loss. These interpolants are not actual
   paid-twin regression residuals and cannot falsify a lemma restricted to
   that residual family.

Further degree escalation is not the target. The blocker is the exact signed
Schur inequality (2)/(3). The stronger attempt to replace it by all-prefix
positivity of the frozen-residue form, equivalently universal validity of
(S3.4), is now analytically refuted and must not be used as a surrogate.
`STAGE2_BORDER_FALSIFIER.md` maps a bounded algebra
audit of this target onto the existing certified endpoint-rung artifacts.
`DEFECT_FACTORIZATION.md` rewrites the same blocker exactly as a one-point
contractive-extension inequality. It also records the linked `3x3`
residue-motion quadratic and an equivalent rank-one-downdate condition that
preserve the favorable signed square discarded by generic Cauchy.

### Global factorization, parallel trace, and orbit obstruction

The Galerkin operator has the global division-free factorization

\[
 \mathcal A=\Xi\partial_\nu,
 \qquad \mathcal B=\Xi\partial_\nu+2\Xi',
 \qquad \mathcal L=\mathcal B^*\mathcal B.          \tag{12}
\]

For analytic trial vectors the equivalent divided quadratic form crosses
every real Xi zero with locally integrable density and vanishing boundary
flux. This corrects the earlier interpretation that only a local divided
factorization was available. It does not factor the signed target:

\[
 2(\Xi'^2-\Xi\Xi'')
 =\mathcal B^*\mathcal B-\mathcal A^*\mathcal A.   \tag{13}
\]

Thus (12) is exactly the positive `X` normal equation, and the inverse
feedback in the paid pivot remains.

The angle payment can be compressed without losing its correlation. With

\[
 H=G_Y:Q=G_Y-G_YG_X^{-1}G_Y,
\]

one has `C_XY=r^*H^dagger r`, including singular `G_Y`. The complete target
is the bordered trace condition

\[
 \begin{pmatrix}H&r\\r^*&A_X-B_Y\end{pmatrix}\succeq0,
\]

or equivalently `A_X-B_Y>=0` and

\[
 |r(q)|^2\leq(A_X-B_Y)H(q,q),
 \qquad
 H(q,q)=\inf_{a+b=q}\{Q(a,a)+G_Y(b,b)\}.           \tag{14}
\]

This is the exact combined-vector form; separate Cauchy estimates enlarge
the right metric and do not prove (14).

Two independent actual-theta obstructions rule out orbitwise closure. For an
isolated positive orbit with parameter `a`, old space `span{1}`, and new even
polynomial `s^2`,

\[
 A_X(a)-B_Y(a)
 =-128a^5e^{-2a}(1+O(a^{-1}))<0.                  \tag{15}
\]

For half-line orbit transforms `C_n`, their pair contributions satisfy

\[
 \mathcal B(C_n,C_m)
 =-{2b_nb_m\over t^6}+O(t^{-8}).                  \tag{16}
\]

In particular every diagonal block changes sign, and every raw finite
positive orbit packet has a negative `t^-6` Turan tail. The complete modular
sum cancels the seam only after infinitely many orbits are assembled.
Consequently orbitwise positivity, raw finite-prefix limits, and blockwise
regression are invalid proof mechanisms. The domain-safe surviving split
keeps one full theta leg assembled before summing orbit contributions and
forms `Q^-1 r` only after that sum.

### Moment and positive-definiteness gates

The endpoint moments

\[
 s_k={1\over2\pi}\int_{\mathbb R}t^{2k}
 (\Xi'^2-\Xi\Xi'')\,dt
\]

give the even and odd target Grams as twice the unshifted and once-shifted
Hankel matrices. Their next Schur pivots are exact determinant ratios.
All-order Hankel/Stieltjes positivity in this exponential-moment class is
equivalent to the missing pointwise spectral sign, not an independent input.
Moreover, the actual odd-H5 Bell-fiber matrix is rigorously indefinite near
the center. Integrated cross-region covariance can repair it, as the known
H5 theorem does, but pointwise fiber total positivity cannot be the
all-degree proof.

The interaction profile has the exact signed autocorrelation

\[
 R={1\over4}C_{h\psi}
  +{1\over16}C_{(1+h^2)\psi}
  -{1\over16}C_{(1-h^2)\psi}.                     \tag{17}
\]

For the mismatch-corrected residual `pi`, the border is equivalently the
three-channel norm contraction in (17), or the tilted-norm curvature

\[
 \mathfrak q(\pi)={1\over4}J_\pi''(0),
 \qquad A_X-B_Y-C_{XY}={1\over2}J_\pi''(0).        \tag{18}
\]

Every tilted parent is positive definite, but membership in that cone does
not imply the Loewner curvature (18). Positive local differential squares
are also obstructed by their order of vanishing at real Xi zeros. A current
verified-zero theorem gives a rigorous positive frequency band, but a fixed
band cannot control an all-degree polynomial ladder.

Finally, with Csordas' normalization

\[
 \psi(2t)=4\Phi(t),\qquad \Xi(\nu)=8H(2\nu),
\]

the missing density obeys

\[
 \Xi'^2-\Xi\Xi''
 =256\{H'(2\nu)^2-H(2\nu)H''(2\nu)\}.             \tag{19}
\]

The all-prefix endpoint target is therefore exactly the first Riemann-Xi
Laguerre inequality stated as Open Problem 4.7 by Csordas, up to scale and
dilation. Its real-space kernel is likewise `R(u)=64K_1(u/4)`. This
literature alignment explains the strength of the remaining sign but is not
an RH equivalence: the first Laguerre inequality alone is only necessary in
general.

## Fourth-wave correlated and modular results

This wave did not run a new degree sweep. It derived and independently
audited six analytic reductions directed at the actual complete-theta
correlation.

### Sharp modular shorting

The exact modular determinants keep each corrected feature and derivative
channel assembled. In those coordinates the old parallel metric is the
quotient norm

\[
 H[q]=\inf_{a+b=q}\{Q[a]+G_Y[b]\}.
\]

One direct-sum Cauchy estimate gives the sharp inequality

\[
 |r(q)|^2\le C_{XY}H[q].                           \tag{20}
\]

For singular `G_Y`, `s+delta` is a quotient representative satisfying
`H(s+delta)=r`; the Moore--Penrose representative is its projection onto
`ran H`. The desired bordered condition must separately retain `g>=0` when
`H=0`. With those domains included, replacing `C_XY` in (20) by
`g=A_X-B_Y` is equivalent to

\[
 g-C_{XY}=Q[p-q_A]=2S\ge0.                         \tag{21}
\]

Thus the best generic correlated Cauchy argument is exactly circular. The
local independent-channel `Q` density has determinant `-4h^2`, so generic
pointwise covariance shorting also fails. This does not exclude an additional
theta-specific restriction on the admissible pointwise feature graph.

### Integrated covariance repair

For positive regional old blocks the exact law of total Schur variance is

\[
 \mathcal S(M)=\sum_j\mathcal S(M_j)
 +\sum_j(\alpha_j-\bar\alpha)^*A_j
                    (\alpha_j-\bar\alpha).        \tag{22}
\]

At odd H5, the actual center pivot is negative at order `H^3`; covariance
confined to the shrinking core is only `O(H^7)`. The known positive integrated
H5 pivot is therefore a genuine tail-plus-core--tail covariance repair.

At arbitrary degree, where a regional old block may be indefinite, a positive
auxiliary density `R` with `integral R=A` gives the domain-safe identity

\[
 \mathcal S(M)=\int(d-b^*R^{-1}b)
 +\int(r-\bar r)^*R(r-\bar r).                    \tag{23}
\]

Optimized finite regional anchors isolate exact angular payments
`2 delta_(ij) a_i a_j`. Proving that these payments dominate the actual signed
regional remainders for a degree-dependent theta partition is the remaining
lemma; ordinary Brascamp--Lieb estimates have the wrong variance direction.

### Seam-free Ewald grouping

The cell correction

\[
 \varepsilon_n(h)=\frac12\left\{
 \omega_n(h)-\int_{n-1}^n\omega_x(h)dx
 +\omega_n(-h)-\int_{n-1}^n\omega_x(-h)dx\right\}
\]

is even and cancels every odd center jet. The cells sum to the complete theta
profile in weighted `W^(j,1)`/Schwartz topology. Their Fourier transforms are
the convergent Euler remainders

\[
 \widehat\varepsilon_n(t)
 =\operatorname {Re}\{K(t)d_n(1/2-it)\},
 \qquad \sum_nd_n(s)=\zeta(s),
 \quad 0<\operatorname {Re}s<1.                   \tag{24}
\]

This repairs the seam and all-degree domain defect of raw finite orbit
packets. It does not create positive blocks: every nonzero finite real packet
has infinitely many Fourier sign changes, and every nonempty packet with
positive cell coefficients changes sign physically. The exact paid
decomposition is therefore correlated and signed; regressions and inverses
must still be formed only after the full sum.

### Sine-tail, recent-primary, and zero-crowding tests

The associated kernel `K_1` is positive, even, log-concave, and decreasing;
its tail is decreasing and convex. These properties prove the lower sine
bound but not the required upper bound. An explicit analytic Schwartz
log-concave countermodel has negative Fourier transform at `2pi`, so the
generic shape route is retired. A stronger sufficient theta target is the
alternating lattice sign

\[
 D_\delta(s)=\sum_{n\in\mathbb Z}(-1)^nK_1(s+n\delta)\ge0,
 \quad 0\le s\le\delta/2,                         \tag{25}
\]

whose high-frequency value is beyond every finite local jet expansion.

Sra's reciprocal-Xi theorem transfers exactly to

\[
 -\{\log\Xi\}''(x)
 =2\int_0^\infty e^{x^2t}(1+2x^2t)\mathcal H(t)dt>0,
 \qquad |x|<\gamma_1,                             \tag{26}
\]

and to all generalized Laguerre inequalities on the published finite
verified band. The positive integral ceases to converge at the first
squared-zero boundary, and the reciprocal PF results do not transfer to the
Turan profile globally.

Finally, a hypothetical off-line quartet `±a±ib` forces the necessary local
reserve

\[
 M_{a,b}+\frac1{2a^2}\ge\frac2{b^2}.              \tag{27}
\]

Finite verification, the critical strip, near-one zero-free regions,
zero-density upper bounds, and global zero counts do not imply this
`b^(-2)`-scale crowding. A canonical-product countermodel proves only that
information separation; it deliberately does not preserve the theta source,
gamma factor, Dirichlet series, or Euler product and is not a Xi or RH
counterexample.

The global first Xi Laguerre inequality remains open. Among the live analytic
directions highlighted by this wave are a theta-specific admissible-graph
inequality, a degree-uniform regional angular budget, and a genuinely global
Euler/Ewald/lattice compensation; these are not claimed to exhaust every
possible argument. No finite computation in this wave is used as evidence for
an all-degree sign.

## Fifth-wave source-specific closure and surviving payment

### The exact theta graph does not supply a pointwise sign

The all-grade feature vector has the exact exponential generating function

\[
 \sum_{j\ge0}{\tau^j\over j!}(U_j,J_j)
   =(\psi(h+\tau),\tau\psi(h+\tau)).              \tag{28}
\]

The even degree-at-most-two graph maps onto all of `R^2` at every `h>0`, and
the odd first-grade graph already enters the negative local cone near the
center. Thus no pointwise Cholesky or conditional-variance restriction survives
the actual theta graph. Conversely, retaining the common polynomial
coefficients and integrating the Appell relation gives exactly

\[
 Q[a]={2\over\pi}\int_{\mathbb R}|a(it)|^2
       \{\Xi'(t)^2-\Xi(t)\Xi''(t)\}\,dt.          \tag{29}
\]

This is the original unknown signed form, not a new positive parent. The
pointwise admissible-graph route is therefore retired without producing a
global counterexample.

### Regional angles and the H5 ratio theorem

At the first odd extension all regional whitened borders are positive
collinear scalars, so every angular separation vanishes for every partition.
Refining a partition produces exact zero-sum covariance; a shrinking core has
angle payment only `O(H^7)`, while its negative H5 center pivot is `O(H^3)`.
Hence no degree-uniform positive angular gap can prove the ladder.

There is nevertheless a genuine complete-theta H5 ordering. The ratio
`c4(h)/c3(h)` is strictly increasing for every `h>0`. It implies strict
core--tail projective ordering in the exact globally whitened metric and, by
continuity, at least one cutoff with equal whitened core and tail masses. At
that balanced cutoff the exact remaining sufficient condition is

\[
 d_C+d_T-4a^2+
 {m_C^2m_T^2(\overline{\mathcal R}_T-
   \overline{\mathcal R}_C)^2\over\det(A)a^2}\ge0. \tag{30}
\]

The monotone ratio controls the projective term but not the signed regional
`c5` diagonals `d_C,d_T`. Equation (30) is a valid sufficient payment, not an
angular-only estimate. The sixth-wave audit below shows that it is stronger
than the true H5 pivot by an explicit positive square, so it is no longer the
sharp live target. The center, compact, and outer ratio proof was independently
recomputed. The compact part is now stored as a deterministic 3,300-cell Arb
artifact; the outer proof is analytic. This promotes the fixed-H5 ratio theorem,
not the open signed payment or an all-degree statement.

### Exact Ewald curvature coordinates

For every assembled corrected residual, the left-cell Euler error has the
Peano form

\[
 \mathfrak q(\pi)={1\over2}\int_0^\infty
   \{x\}(1-\{x\})J_\pi''(x)\,dx.                 \tag{31}
\]

The correlated source is cosine self-dual and has zero total curvature.
Galerkin orthogonality removes only one global curvature mode; it does not
sign the local density. The exact payment is a comparison of the mean
fractional-cell Peano weight under the positive and negative curvature
measures. The previous two-region core--edge condition is equivalent to
perfect sign segregation and is retired. Self-duality, positive old data, and
Galerkin orthogonality alone admit a structural countermodel, so the surviving
criterion must control the actual assembled theta source and its mismatch
correction.

### Alternating lattice: one theorem and one bounded certificate schema

The modularly folded associated kernel has an exact adjacent-pair
representation. If `T` lies beyond its decreasing-convex threshold, then

\[
 \delta\ge2T,\qquad
 2\sum_{n\ge1}K(n\delta-T)\le K(T)               \tag{32}
\]

implies `D_delta(r)>=0` throughout `0<=r<=delta/2`. The complete-theta tail
makes (32) true for every sufficiently large spacing. This is a nontrivial
all-half-cell theorem for a sufficient condition stronger than the desired
weighted Laguerre sign.

Modular inversion does not change the spacing, integer refinement has no
one-sided sign, and Poisson summation changes both the twist and the kernel.
There is therefore no large-to-small scale closure. For any compact spacing
interval bounded away from zero, a finite even-lobe block plus an explicit
convex alternating-tail bound gives a rigorous certificate schema using only
direct complete-theta interval enclosures. No such compact certificate is
claimed complete here, and the small-spacing regime remains open.

### Three transfer routes that do not close the sign

Along the Rodgers--Tao heat convention, away from zeros the divided curvature
obeys a favorable semilinear equation on each collision-free nodal component.
At a generic double-zero collision the undivided expression instead has a
negative derivative in the decreasing-time coordinate `s=T-tau` and creates a
negative center layer. Continuing the maximum principle through every
collision down to zero heat would already
exclude the topology changes encoded by the de Bruijn--Newman problem; it is
not a weaker proof of the missing sign.

Recent coefficient results also do not transfer formally. An explicit entire
order-zero sequence is strictly infinitely log-concave and has every relevant
Toeplitz minor positive, yet its continuous spectral Laguerre value at one
point is less than `-1.4104`. Thus coefficient log-concavity/Toeplitz
positivity and the endpoint Hankel/Fourier sign are distinct without a new
theta-specific cancellation theorem.

Finally, for one fixed polynomial residual an off-line quartet contributes an
integrated negative penalty of size

\[
 {4\over3}b^3|H_{a,b}(a)\pi(ia)|^2+o(b^3)        \tag{33}
\]

under the stated scaled local-flatness hypothesis. A disk estimate and
canonical-series limiting lemma yield a conditional fixed-polynomial
verification principle above a verified band. The required verification
height depends on the residual; there is no single finite band that closes
the all-degree polynomial ladder.

The global first Xi Laguerre sign remains open. At this fifth-wave checkpoint,
the candidate obligations were the sufficient signed regional `c5` payment
(30), fractional-cell Ewald placement for the assembled corrected residual, a
compact/small-spacing alternating-lattice completion, or quotient sampling.
The sixth-wave audit below sharpens or retires those formulations. No statement
in this wave proves RH or promotes a finite check to an all-degree theorem.

## Sixth-wave exact saturation and high-frequency barriers

### The combined trace construction is saturated by the pivot

Let `B=[[H,r],[r*,g]]` be the bordered parallel-trace matrix and let `q_A`,
`q_Y` be the old target and derivative regressions. A three-block completion
gives the exact variational identity

\[
 B[(q,t)]=\inf_{a\in P}\{G_Y[a+q+tq_Y]+Q[a+tq_A]\}
             +|t|^2Q[\pi].                       \tag{34}
\]

This remains valid on the quotient by `ker G_Y`. At `t=1`, the actual old
polynomial `q=q_A-q_Y` and `a=-q_A` cancel both nonnegative channel terms, so

\[
 \boxed{B[(q_A-q_Y,1)]=Q[\pi]=2\mathfrak q[\pi]=2S.} \tag{35}
\]

Thus combining the channels before Cauchy does not create a reserve: the
canonical joint covariance is exactly saturated by the original signed pivot.
This retires the generic combined-channel shortcut, not a source-specific
arithmetic proof of `Q[pi]>=0`.

### H5: the wedge target loses a square

At the balanced H5 cutoff, direct subtraction between the exact angular
reserve and its wedge lower bound gives

\[
 \boxed{\operatorname{LHS}_{44}
        =\mathcal S_5-\delta_*^2a^2.}             \tag{36}
\]

Equation (44) of the preceding note is therefore a strict sufficient
condition whenever the proved projective separation is nonzero. Eliminating
the old block in the other order yields the sharper exact scalarization

\[
 \boxed{
 \mathcal S_5=\int_0^\infty2h^2c_3\mathcal P_5\,dh
 +M_3\operatorname{Var}_\nu(c_4/c_3)-E_5,}       \tag{37}
\]

where `mathcal P_5=(c3 c5-c4^2)/c3^2` and `E_5` is one explicit old-prefix
coupling cost. An exact rational two-region model makes (37) negative despite
ratio ordering, balanced whitened masses, positive regional old blocks, and
bottom-Turan positivity. Separately, the Planat--Sole second-level concavity
transfers to a four-spatial-jet cone; an even positive analytic perturbation
preserves that cone and `c1,...,c4` at a point while changing `c5`. The
published concavity inequality alone therefore cannot pay (37).

The compact component of the ratio theorem is now reproducible rather than
provisional. A one-thread, 256-bit Arb artifact covers 3,300 closed cells with
a full-theta tail from orbit seven. Its all-cell trace SHA-256 is
`22136f96428c4b1c832eec61998bf2de6a01ebf3cc12fb7995c168fe6cfe5b12`.
This freezes the fixed-H5 ordering only; it does not establish (37).

### Ewald placement is a stronger sine-family route

Folding the assembled curvature modulo the integer scale lattice and applying
Poisson summation gives

\[
 \boxed{\mathcal F_\pi(r)
 =4\pi\sum_{m\ge1}mJ_\pi(m)\sin(2\pi mr).}        \tag{38}
\]

Fractional stochastic dominance is exactly `mathcal F_pi(r)>=0` on the
half-cell, while the actual pivot is only

\[
 \boxed{\mathfrak q(\pi)
 =\int_0^{1/2}{1-2r\over2}\mathcal F_\pi(r)\,dr
 =\sum_{m\ge1}J_\pi(m).}                         \tag{39}
\]

An explicit self-Fourier Gaussian-polynomial source has positive scalar sum
but a negative sine value, proving that placement is not necessary even under
the structural self-duality and moment constraints. On the sufficient side,
the exact triangular-kernel expansion shows that
`a_m=mJ_pi(m)>=0` and `Delta^2 a_m>=0` imply (38). The corrected mismatch is
inside `pi` throughout.

### Small-spacing lattice and zero-sampling barriers

With `a=pi/(4 delta)` and `t=pi r/delta`, the alternating lattice has the
exact high-frequency form

\[
 128\delta D_\delta(\delta t/\pi)
 =\sum_{m\ge0}F((2m+1)a)\cos((2m+1)t).            \tag{40}
\]

Half-cell positivity necessarily implies `F(a)>=0`; if equality holds, all
odd-multiple samples must vanish. Completed-zeta bounds give
`sup|D_delta|=O_epsilon(delta^(-5-epsilon)
exp(-pi^2/(8delta)))` and an additive first-harmonic approximation whose
error begins at the third-harmonic exponential scale. This does not determine
the sign. A matching lower bound for the actual `F(a)` would close sufficiently
small spacings, but is precisely unproved.

For zero compensation, fix a hypothetical off-line quartet beyond height
`T`. On either parity ladder the exact quotient-sampling operator satisfies

\[
 \boxed{
 \lambda_N=\|S_N\|\ge {\nu_{a,b}(J)\over M_T}
 \left({\inf_Jx\over T}\right)^{2N}.}            \tag{41}
\]

Thus a core-only contraction for every polynomial is equivalent to excluding
all off-line quartets and cannot be used as a weaker input. This theorem does
not condemn the actual mismatch-corrected Galerkin residual: a viable route
could prove exponentially small alignment with the exterior Christoffel
direction or keep the exact positive background terms.

### Two additional route guardrails

The certified source theorem `psi(2t)=4Phi(t)` transfers a negative
five-by-five Toeplitz translation minor to `psi`; hence the raw complete-theta
source is not `PF_r` for any `r>=5`. This closes source total positivity and
its variation-diminishing consequences, but says nothing directly about the
associated Turan profile or endpoint Hankel form.

Independently, the shifted-Xi de Branges diagonal has an exact small-shift
relation to the Xi Laguerre density. The 2026 normalized Volterra construction
is an exact structural quotient analogue, but the cited source, even granting
its strongest later appendix claims, supplies no proved evaluation-trace and
joint-isometry pullback between the two or the required endpoint passage. It
therefore provides an analogue, not a sign transfer.

The first Xi Laguerre sign remains open. After this wave, the live analytic
inputs must act directly on `Q[pi]`, on the assembled H5 expression (37), on a
weaker integrated form of (38), or on actual residual alignment in (41).
None of the exact identities, countermodels, or finite replay artifacts proves
the all-degree sign or RH.

## Seventh-wave assembled scalar and saturation barriers

### Reverse anchoring exposes the all-degree signed object

For `r in {0,1}` and `n>=2`, eliminate the last old monomial before the
newest one on the corresponding parity ladder. Under the old-prefix/range
hypotheses, with reverse anchor `m=m_k>0`, old remainder block `P`, border remainder `eta`, and
`B=m_km_(k+2)-m_(k+1)^2`, the singular-safe next pivot is

\[
 \boxed{
 \mathcal S_{n,r}={B\over m}-\eta^*P^\dagger\eta,
 \qquad\eta\in\operatorname{Ran}P.}              \tag{42}
\]

When the anchoring coefficient `c_k` is positive a.e. and the displayed
quotient integrals converge, set `rho_k=2h^2c_k` and
`dnu=rho_k(h)dh/m`. This normalization gives one exact combined-feature
identity

\[
 \boxed{
 {\mathcal S_{n,r}\over m}
 =E[w^*\mathcal L(h)w]
  +\operatorname{Var}_\nu(w^*Y(h)).}              \tag{43}
\]

The local Schur defect in the first term is signed and the covariance in the
second is positive; they are not estimated separately. This recovers the H5
bottom-Turan-plus-ratio-variance identity with its exact old-prefix cost.
It also proves an algebraic saturation: holding all moments through
`m_(k+1)` fixed, `m_(k+2)` changes (42) with coefficient one. No recursion
using only the old block and border can sign the extension.

### The actual residual can align with the bad exterior mode

Keep the full positive parent `mathcal A`, including real-zero, background,
and exterior terms, and write the negative quartet form as `mathcal N`.
Assume `mathcal A` is positive definite on the enlarged space `W` and the old
signed block `mathfrak q_V` is positive definite. If `phi_N` is the monic
`mathcal A`-orthogonal residual and
`s(q)=mathcal N(q,phi_N)` on the old prefix, then the actual signed Galerkin
residual and pivot are

\[
 \boxed{
 \pi_N=\phi_N+\mathfrak q_V^{-1}s,
 \qquad
 \mathfrak q[\pi_N]
 =\mathcal A[\phi_N]-\mathcal N[\phi_N]
  -s^*\mathfrak q_V^{-1}s.}                     \tag{44}
\]

After whitening, a sampling eigenvalue `lambda` amplifies the correction by
`(1-lambda)^(-1)`. For the exact rank-one sample at an exterior `a` with
`phi_N(a)!=0`, Christoffel kernels give

\[
 \boxed{
 \mathfrak q_\tau[\pi_{N,\tau}]
 =h_N{1-\tau K_N\over1-\tau K_-}.}               \tag{45}
\]

Hence `1/K_N<tau<1/K_-` keeps the entire old prefix positive but makes the
next actual pivot negative, with the convention `1/K_-=infinity` when the
old prefix is trivial. The effect persists for fixed-degree
quartet-shaped interval densities. These are method countermodels, not Xi
quartets; they show that Galerkin orthogonality and positive exterior reserve
alone do not imply special residual alignment.

### Sobolev-square complexity guardrails

For `k>=1`, every integrated Bell moment has the exact identity

\[
 \boxed{
 M_k=\int h^2(\psi^{(k)})^2dh
     -{k\over2}\int(\psi^{(k-1)})^2dh.}          \tag{46}
\]

For an arbitrary residual degree `N` and parity `epsilon`, put
`q=t^epsilon P_N(t^2)` and `w=q^2`. The full pivot is

\[
 \mathcal S_{N,\epsilon}
 ={1\over2\pi}\int\{wW'^2-w''W^2/4\}dt,
 \qquad W=2\Xi.                                  \tag{47}
\]

Completing one auxiliary square with
`g_epsilon=t^(1-epsilon)G(t^2)` gives a finite correlated moment criterion.
For H5 the exact normalization is
`2pi S_5=positive square+integral R_(P,g)(t^2)W(t)^2dt`; its cubic instance is
positive in a noncertifying diagnostic, offering a compact alternative
fixed-rung target. At every nontrivial rung `kappa=2N+epsilon>=1`, however,
the pointwise remainder has the sharp unavoidable leading deficit

\[
 \boxed{
 \Delta_{\rm Hardy}(N,\epsilon)
 ={4N+2\epsilon-1\over4}.}                       \tag{48}
\]

No polynomial auxiliary makes it pointwise nonnegative on those nontrivial
rungs; the even base `(N,epsilon)=(0,0)` is separately positive. The
integrated criteria increase to `2pi S_(N,epsilon)` as auxiliary degree
grows, and a strictly positive Gaussian ladder makes every fixed auxiliary
degree fail for all sufficiently large `N`. A viable theta theorem therefore
needs a source-specific construction and margin paying (48); linear growth is
the natural generic scale, while a theta-specific fixed-degree miracle is not
excluded. Unrestricted growth is target-equivalent.

### The Ewald pivot is one signed half-space and one Abel endpoint

For `a_m=mJ_pi(m)`, write
`Delta a_k=a_k-a_(k+1)` and `H_k=sum_(j=1)^k 1/j`. The scalar pivot has the
exact compensation forms

\[
 \boxed{
 \mathfrak q(\pi)
 =\sum_{k\ge1}H_k\Delta a_k
 =\sum_{k\ge1}W_k\Delta^2a_k,
 \qquad W_k=(k+1)H_k-k.}                         \tag{49}
\]

This is a single signed half-space, strictly weaker than termwise sample
convexity or the full fractional-placement sine family. The seam-free Ewald
counterterm also has the Euler-renormalized Abel source

\[
 D(z,s)=\operatorname{Li}_s(z)
 -{1-z\over1-s}\operatorname{Li}_{s-1}(z),
 \quad 0\le z<1,\quad0<\operatorname{Re}s<1,
 \qquad D(z,s)\longrightarrow\zeta(s)\ (z\uparrow1). \tag{50}
\]

and yields `mathfrak q(pi)=integral_0^1 A_pi(z)dz`, where `A_pi` is the fully
assembled path built from `D`, with the corrected residual assembled before
the endpoint. A distributional interpolation theorem in the real even
Fourier-`+1` Schwartz class with `J(0)=0` shows that finitely many samples or
Ewald cells can be held fixed while the scalar sum takes either sign. Finite Ewald
data therefore need an independent theta-specific tail or rigidity theorem.

### Minimum modulus and universal-contraction guardrails

The earlier absolute small-spacing lower bound for
`F=Xi'^2-Xi Xi''` would imply eventual simplicity of critical-line zeros,
individual lower bounds for `abs(zeta'(rho))`, exponentially weak uniform
zero-spacing bounds, and an exponentially thin zero-free tube for complex
zeros of `F`. Completed-zeta upper envelopes and averaged moments do not
supply that minimum modulus. A closer relative lemma is

\[
 F>0,\quad(\log F)'\le-c\quad(t\ge A),\quad A>0,\ c>0
 \quad\Longrightarrow\quad
 {E_1(a)\over F(a)}\le{q(3-q)\over(1-q)^2},
 \qquad q=e^{-2ca},\quad a\ge A.                 \tag{51}
\]

Odd-harmonic dominance follows only once
`q<=(5-sqrt(17))/4`. The lemma avoids an absolute lower bound but retains the
missing first-Laguerre sign.

Finally, the complete positive two-channel feature `mathbf A` and negative
channel `B` obey

\[
 \boxed{\|\mathbf A p\|^2-\|Bp\|^2=8\mathfrak q[p].} \tag{52}
\]

Any degree-independent translation-intertwining contraction on either full
parity cyclic range is therefore equivalent to the global first-Laguerre
sign. Positive tilted theta autocorrelations do not by themselves sign the
curvature: their Loewner curvature at zero is exactly the same Turan profile.
Hilbert-valued complex-shift subharmonicity leaves the exact
polynomial-transport cost, with `P(t)=i^(-epsilon)p(it)`,

\[
 \mathfrak q[p]
 ={2\over\pi}\int P^2\Xi'^2dt
 -{1\over2\pi}\int(P^2)''\Xi^2dt,               \tag{53}
\]

so it signs only the sum of the desired real curvature and the orthogonal
transport curvature. A surviving contraction must depend on the actual
residual/degree or break translation invariance, for example through explicit
modular/Ewald compensation.

This wave produces exact closer targets and route classifications, not the
first Xi Laguerre sign, an all-degree positivity theorem, or RH.

## Eighth-wave correlated theta targets and source-free barriers

### The newest Bell moment is locally free outside the Jacobi family

For every finite `J`, the Frechet derivatives of
`(m_0,...,m_J)` at the actual complete-theta profile are linearly independent.
The proof uses the first theta orbit at spatial infinity. Theta-scale positive
even analytic packets can therefore be chosen so that the inverse-function
theorem gives, for every sufficiently small real `tau`,

\[
 \boxed{
 m_j[\psi_\tau]=m_j[\psi]\ (0\le j<J),\qquad
 m_J[\psi_\tau]=m_J[\psi]+\tau.}                 \tag{54}
\]

The packets and all their fixed derivatives lie below the actual `e^(-3z)`
first-orbit gap. They preserve positivity, evenness, real analyticity,
Schwartz decay, and that differentiated tail hierarchy. For `r in {0,1}`
and `n>=2`, assume the old prefix is positive semidefinite, `m_k>0`, and
`eta in Ran(P)`. Taking `J=k+2`, `k=r+2n-2`, then holds the reverse-anchor
old block, border, anchor, and range condition fixed, while

\[
 \boxed{\mathcal S_{n,r}[\psi_\tau]
       =\mathcal S_{n,r}[\psi]+\tau.}             \tag{55}
\]

This is a route limitation, not a theta deformation: the packets do not stay
inside the discrete Jacobi orbit family. The exact positive-orbit score
recursion isolates `c_(k+2)` as one top covariant score average plus lower
Bell data. Its joint orbit-score payment is the explicit source-specific
obligation, but it is algebraically the desired pivot and remains unproved.

### The mismatch and sampling spectrum combine in one defect metric

Retain the full positive parent `mathcal A`, assume it is positive definite
on the enlarged space, and assume the old signed block is positive definite.
Factor the complete negative-quartet form through its sampling operator `B`.
If `C` is the old restriction, `z=B phi_N`, and
`alpha=mathcal A[phi_N]`, then

\[
 \boxed{
 \mathcal N[\phi_N]+s^*\mathfrak q_V^{-1}s
 =\langle z,(I-CC^*)^{-1}z\rangle,\qquad
 \mathfrak q[\pi_N]
 =\alpha-\langle z,(I-CC^*)^{-1}z\rangle.}       \tag{56}
\]

Thus the exact missing target is the directional defect estimate

\[
 \boxed{
 |\langle z,g\rangle|^2
 \leq\alpha\{\|g\|^2-\|C^*g\|^2\}
 \quad\text{for every sampling-space }g.}        \tag{57}
\]

It is equivalent to contractivity of the augmented column
`[C,z/sqrt(alpha)]`, not a separate bound on the mismatch and inverse metric.
An exact real-even entire model with a coupled mirrored quartet, its
inside--outside pieces, and positive background keeps the old prefix positive
but has degree-six pivot
`-97265104847865/3343061903998976`. The model is not Xi and lacks
complete-theta modular arithmetic; it refutes only a source-free derivation
from product geometry, reflection, exterior reserve, and old positivity.

### The actual residual is the canonical one-rung defect lift

In the complete positive/negative theta channels, let `V` be the old prefix
and assume its channel defect is strict. Put `M=mathbf A V` and redefine the
strict contraction in this channel section by
`C(mathbf A q)=Bq` for `q in V`. For a new polynomial, let `phi` be its
positive-channel residual, `x_perp=mathbf A phi`, `z=B phi`, and
`D_(C*)=(I-CC^*)^(1/2)`. The prescribed one-rung extension is contractive
exactly when

\[
 \boxed{
 \|D_{C^*}^{-1}z\|^2\leq\|x_\perp\|^2.}          \tag{58}
\]

The actual signed Galerkin residual has the exact Julia-defect lift

\[
 \boxed{
 \mathbf A\pi=x_\perp+C^*D_{C^*}^{-2}z,\qquad
 B\pi=D_{C^*}^{-2}z,\qquad
 \|x_\perp\|^2-\|D_{C^*}^{-1}z\|^2
 =8\mathfrak q[\pi].}                            \tag{59}
\]

Unlike a universal cyclic contraction, (58) may depend on the rung and
residual and may break translation invariance. The final scalar in (59)
retains the complete harmonic and Abel Ewald compensation. A noncircular
sufficient continuation is the damped Abel lemma: if `S` is absolutely
continuous on `[z_0,1]`, real `lambda` is integrable, and

\[
 S(z_0)\geq0,\qquad S'(z)+\lambda(z)S(z)\geq0
 \quad\text{a.e. on }[z_0,1],                    \tag{60}
\]

then `S(1)>=0`. Applied to the complete residual Abel path, this permits
negative cells and a negative Abel derivative. Constructing the seed and
damping function from theta arithmetic, without using the endpoint sign,
is open.

### All interior Abel packets retain both signs

For the actual self-dual assembled scale source `J_pi`, the whole Abel path
has the exact Poisson--ceiling representation

\[
 \boxed{
 \mathcal S_\pi(z)=\int_0^\infty
 \{\mathcal P_z(x)-z^{\lceil x\rceil}\}J_\pi(x)\,dx,
 \quad0\leq z<1.}                                \tag{61}
\]

Its radial kernel has positive seam spikes but negative mean on every unit
cell. Separately, for every `0<z<1`, the underlying complete-theta
Abel-damped Ewald packet `Sigma_z` and its radial derivative change sign in
both physical and Fourier space. The positive-real Laplace weight for the
Euler-renormalized polylogarithm does not survive the completed gamma/Fourier
assembly as a positive source. A generic real even Fourier-`+1` Schwartz
source also has a positive endpoint pivot with negative initial Abel
derivative, so pointwise Abel monotonicity is not necessary and does not
follow from generic self-dual data. Positive-packet proofs are refuted.
Monotonicity remains a possible but unnecessarily strong theta-specific
sufficient condition; the integrated sign-changing correlation in (61) and
the damped route (60) are weaker live options.

### A two-generator Sobolev criterion uses only old data

At a nontrivial rung `kappa=2N+epsilon>=1`, assume the old signed block is
invertible, let `q=t^epsilon P_N(t^2)` be its actual old-data residual, and
put `W=2Xi`. Define

\[
 \begin{gathered}
 A=\int q'^2W^2,\quad B=\int qq''W^2,\quad
 C=\int q^2W^2,\quad D=\int t^2q^2W^2,\quad
 E=\int tqq'W^2,\\
 K=\begin{pmatrix}A&E\\E&D\end{pmatrix},\qquad
 r=\binom{-(A+B)/2}{-(C+2E)/2}.
 \end{gathered}                                  \tag{62}
\]

The residual-dependent family `g_(alpha,beta)=alpha q'+beta tq` has only two
parameters while reaching the natural degree `N+epsilon`. Its exact optimum
gives

\[
 \boxed{
 \mathcal H_{N,\epsilon}=r^TK^{-1}r-{A+B\over2}\geq0
 \quad\Longrightarrow\quad
 \mathcal S_{N,\epsilon}\geq0.}                 \tag{63}
\]

The quantities in (62)--(63) use the residual and five `W^2`-weighted scalars
under the positive measure `W^2dt`, but not the unknown newest target moment.
This is a genuinely sufficient lemma,
not the unrestricted projection limit. Its rounded H5 value is positive but
noncertifying. The derivative-only tail-matched recurrence has the exact
Hardy deficit and fails strictly for real-rooted residuals, while ordinary
theta heat flow introduces imaginary-frequency shifts rather than a fixed
polynomial closure. Proving (63) at every rung is now a concrete all-degree
five-scalar target.

### Imaginary-shift norm positivity leaves an indefinite transport kernel

For real `z` with `abs(z)<pi/2`, the Bell exponential generating function is
the positive norm

\[
 \boxed{
 M(z)=\sum_{k\geq0}m_k{z^{2k}\over(2k)!}
 =\int h^2|\psi(h+iz/2)|^2dh
 ={1\over\pi}\int f(t)e^{-zt}dt,}
 \quad f=\Xi'^2-\Xi\Xi''.                        \tag{64}
\]

For real `x,y` with `abs(x),abs(y)<pi/2`, polarizing the norm gives an
automatic positive Gram `G`, but the target exponential-Hankel kernel
`K_exp(x,y)=M((x+y)/2)` obeys

\[
 \boxed{
 K_{\rm exp}(x,y)=G(x,y)+(x-y)^2L((x+y)/2),
 \qquad
 L(s)={1\over32\pi}\int e^{-st}(2\Xi(t))^2dt>0.} \tag{65}
\]

The correction in (65) is indefinite: on two distinct nodes it has zero
diagonal and positive off-diagonal. Full positivity of `K_exp` on any real
neighborhood of zero is equivalent to `f>=0`, so an unspecified positive
completion is target-equivalent. A scaled positive even Gaussian mixture
retains arbitrary strong log concavity, the formal Bell calculus, reflection,
and a nontrivial heat interval while its spectral Turan density is negative.
It is not theta and lacks its orbit arithmetic and super-Gaussian tail. The
countermodel retires source-free imaginary-shift, heat, and log-concavity
proofs; it leaves degree-dependent control of (65) on the actual residual as
a live arithmetic option.

This wave supplies one exact directional target, (57), one noncircular
sufficient target, (63), and one weaker signed-compensation mechanism, (60).
It also shows exactly which generic positivity routes cannot prove them.
None is established uniformly for the complete-theta residual, and no first
Xi Laguerre sign, all-degree positivity theorem, or RH conclusion follows.

## Ninth-wave orbit, score, Abel, and Hardy reductions

### Super-Gaussian shape does not control the transport defect

The Gaussian countermodel from the preceding wave can be upgraded, for
`lambda>0` and `epsilon>0`, to the theta-scale source

\[
 \boxed{
 \psi_{\lambda,\varepsilon}(h)
 =\psi_G(\lambda h)
   \exp\{-\varepsilon(\cosh(2h)-1)\}.}           \tag{66}
\]

For `epsilon=2pi` it has the same leading double-exponential tail
`log psi~-pi exp(2 abs(h))`, the same natural open imaginary-shift strip,
positivity, evenness, entire continuation, and arbitrarily strong log
concavity. Nevertheless its spectral Turan density remains negative for all
sufficiently large `lambda`. Thus the super-Gaussian tail and strip, even together with the
previous generic inputs, do not control the indefinite transport kernel. The
model is not the Jacobi source and leaves exact orbit/modular arithmetic as a
genuine missing input.

### Finite theta packets lose the quotient reserve

For one mirrored quartet with `a` real and `b>0`, the exact Green
representation of the complete quotient is

\[
 \boxed{
 H_{a,b}
 =\widehat{\,{e^{-b|\cdot|+ia(\cdot)}\over2b}*\psi\,}.}       \tag{67}
\]

It inserts the full positive theta orbit sum into the negative sampling
channel before the direct penalty and inverse feedback are assembled. Every
nonempty raw finite packet of positive half-line theta orbits, however, has a
first uncancelled odd modular-center jet. Its quotient consequently has an
algebraic tail, and the positive exterior reserve diverges for sufficiently
high polynomial degree (already degree three for a first-jet packet).
Orbitwise-positive Cauchy and raw positive-orbit truncations therefore cannot
prove the directional defect. All odd seam jets must first be canceled by the
complete modular sum or an explicitly seam-free Euler/Ewald grouping. The
all-orbit inequality that remains is the next pivot itself, not a proved sign.

### Orbit ordering is exact but not a standalone payment

The exact positive Jacobi orbit law is strictly
monotone-likelihood-ratio ordered in the orbit index. At the modular center,
the first nontrivial even covariant score obeys

`A_2=d^2-5d-63/4+6/d`

and is strictly increasing, while the orbit score is strictly decreasing.
Its negative covariance has an exact positive all-orbit pair representation,
but modular symmetry cancels it with the mean score drift. For every fixed
`h`, every higher even score is increasing on a sufficiently high orbit tail,
so only the tail--tail covariance is signed; the full covariance, lower Bell
data, drift, and regression remain inseparable.

### A bounded Abel gauge isolates two explicit all-index obligations

Every `L1` damping is a bounded positive gauge and cannot create a
nonnegative Abel tail. The formal logarithmic damping `-S'/S` is circular and
nonintegrable at every nontrivial zero. Moreover every completed packet
`partial_z Sigma_z+ell Sigma_z`, `ell>=0`, has positive mass but a negative
right tail and infinitely many Fourier sign changes.

For the actual residual cells `e_n`, define
`V(z)=sum_(n>=1)|e_n|z^n` and `M=V(1)`. If `M=0`, then every `e_n=0`, the
Abel path is identically zero, and the target is trivial. Otherwise `M>0`;
fix `alpha>0` and `0<=z_0<1`, and put

\[
 \boxed{
 V(z)=\sum_{n\ge1}|e_n|z^n,\quad M=V(1),\quad
 \lambda_{\pi,\alpha}(z)
 ={V'(z)\over(1+\alpha)M-V(z)},\quad
 \int_{z_0}^1\lambda_{\pi,\alpha}
 \leq\log{1+\alpha\over\alpha}.}                \tag{68}
\]

This is a noncircular, degree-uniformly bounded damping and permits negative
cells and negative Abel derivative. With `z_0=alpha=1/2`, it reduces the route
to the exact Poisson--ceiling seed `S_pi(1/2)>=0` and one signed Wronskian
inequality on `[1/2,1]`. Neither inequality is proved; they are the concrete
complete-theta blocker for this route.

### The five-scalar condition is one score-projection inequality

Under the probability measure `dnu=q^2W^2dt/C`, put
`X=q'/q`, `T=t`, `L=W'/W`, `Z=L+X/2`, and
`U=span{X,T}`. The quotients are understood `nu`-almost everywhere; their
values at the discrete zeros of `qW` are immaterial, equivalently all products
may be read after multiplication by `q^2W^2`. The exact sufficient margin and
target are

\[
 \boxed{
 {\mathcal H\over C}=\|P_UZ\|_\nu^2-{\|X\|_\nu^2\over4},
 \qquad
 {2\pi\mathcal S\over C}=\|Z\|_\nu^2-{\|X\|_\nu^2\over4}.}  \tag{69}
\]

The unnormalized difference is the nonnegative projection remainder
`2pi S-H=C||(I-P_U)L||_nu^2`. The entire old-data condition collapses to

\[
 \boxed{
 \left\|K^{-1/2}\binom{B}{C+E}\right\|^2\geq A,
 \quad
 \{AC+E(A-B)\}^2\geq(AD-E^2)(A^2-B^2).}         \tag{70}
\]

This keeps the two coordinates correlated. Generic Gram geometry supplies
the opposite inequality and cannot prove (70). The analytic family
`W_m=exp(-t^(2m)/2)` has positive target density and actual nontrivial
old-data residuals but `mathcal H_m=-pi^2/(3m^2)+O(m^(-3))<0`. Separately,
the exact source `W=exp(-t^2/2)(1+2t^2)` satisfies both special old-space
identities from `q''` and `tq'-kappa q`, yet has a positive current pivot and
negative two-generator margin, followed by a negative next pivot. Therefore
those residual identities, positivity, convexity, and source-free Sobolev
geometry do not establish (70).

### The first odd theta auxiliary closes analytically

At `(N,epsilon)=(0,1)`, `q=t`, and (70) specializes exactly to the
non-strict criterion

\[
 \boxed{
 \|\psi\|_2^2\|\psi''\|_2^2
 \leq5\|\psi'\|_2^4.}                           \tag{71}
\]

In fact the strict strengthening of this inequality is now proved for the
actual complete-theta source. Exact
upper-incomplete-gamma formulas control the first Jacobi orbit, and a uniform
geometric estimate sums every orbit `n>=2`. Rational half-line bounds give
`||psi||_(2,+)<811/1000`, `||psi'||_(2,+)>62/25`, and
`||psi''||_(2,+)<31/2`, with strict final rational margin
`622392611/20000000`. No quadrature, sampled-height sign, or finite orbit
truncation is used. Two Fourier-positive Schwartz families show that this
norm inequality and the global first Xi--Laguerre sign are independent in the
ambient source class. Equation (71) proves only the first odd sufficient
criterion, not a higher rung or RH.

### The complete joint payment is a mean square minus a Hardy cost

Assume the two coupled old Hankel prefixes through `m_(kappa-1)` are positive.
Their monic residual `P_N` has positive simple zeros and
`q=t^rP_N(t^2)` is real-rooted. For the complete raw orbit feature `U_P`,
formed using the single global old regression, the full Bell-plus-regression
pivot is

\[
 \boxed{
 \mathcal S_{N,r}
 =2\int_0^\infty h^2\psi(h)^2\{E_hU_P\}^2dh
 -{1\over4\pi}\int_{\mathbb R}(q'^2-qq'')W^2dt.}              \tag{72}
\]

The first term contains the complete infinite orbit mean before squaring.
The second is a strict cost. Expanding the square subtracts the complete
orbit variance, so Jensen has the wrong orientation. Under the old-prefix
hypotheses, (72) reduces the next sign exactly to a complete-theta Hardy
inequality; it does not prove that inequality.

Factoring `q` by its real roots `rho_j`, put
`H_j=qW/(t-rho_j)` and let `V_j` be the variance of
`log|t-rho_j|` under the positive density `H_j^2dt`. A two-branch logarithmic
transform and vector Heisenberg inequality give the new noncircular
sufficient condition

\[
 \boxed{
 \sum_{j=1}^{\kappa}{4V_j\over1+V_j}\leq2.}                  \tag{73}
\]

The uniform bound `V_j<=1/(2kappa-1)` suffices. For complex `s` with
`Re(s)>-1`, the fractional-moment integral
`Z_j(s)=integral |t-rho_j|^s H_j(t)^2dt` is analytic; it is positive for real
`s>-1`, and `V_j=(log Z_j)''(0)`. This makes (73) a concrete Mellin/Ewald
curvature target. Generic root vanishing gives only the sharp Hardy constant
`1/4`, whereas already the one-root problem needs `1/2`; direct integration
by parts collapses back to the weighted first Xi--Laguerre target. Thus (73)
requires new complete-theta arithmetic and remains open.

Assembling all roots before applying uncertainty gives the still simpler
Mellin function, analytic for `Re(s)>-1` and positive for real `s>-1`,

\[
 \boxed{
 \mathcal Z(s)=\sum_{j=1}^{\kappa}
  \int|t-\rho_j|^sH_j(t)^2dt,\qquad
 (\log\mathcal Z)''(0)\leq{1\over2\kappa-1}.}                 \tag{74}
\]

Equation (74) is also a noncircular sufficient condition. In spatial
coordinates it is a vector-state variance bound for `log|D|` on the complete
modulated root features. Ordinary Holder convexity yields only the opposite
one-sided fact `(log mathcal Z)''>=0`, and dilation leaves the variance
unchanged.

Two exact Gaussian calculations show where the Heisenberg relaxation loses
the actual payment. For the degree-five Hermite residual, the central-root
variance is `pi^2/8+71/225>1`; that root alone violates (73), while the exact
collective Hardy sum is `20/11<2` and the pivot is positive. The assembled
variance in (74) also exceeds its `1/9` threshold. Thus the Mellin budgets are
sufficient but not necessary and do not follow from strong log concavity or
Christoffel localization.

The Green/Volterra analysis makes the domain obstruction exact. If a raw
finite packet of positive half-line theta orbits first fails modular
cancellation at odd jet `2ell+1`, its root-quotient Mellin strip has sharp
upper boundary `Re(s)<4ell+5-2kappa`; at campaign degrees the natural raw
packets do not even define their finite-packet moment `Z_(j,S)(0)`. Complete
all-jet cancellation, including
an explicitly seam-free Euler/Ewald grouping, restores the Schwartz domain
but not a quantitative gap: a positive smooth Gaussian scale mixture
has every odd center jet zero while simultaneously
`gamma_j->1/4` and `V_j=L^2/12+O(L)`. Exact Jacobi weights beyond seam
cancellation are one possible additional quantitative actual-theta input;
smooth modular completion alone is insufficient.

Under the two old positive-prefix hypotheses, so that the residual has real
simple roots, the Abel and Hardy routes are in fact the same signed defect for
`0<=z<1`. If `W_z` is the Abel-deformed complete profile and
`q_j=q/(t-rho_j)`, then

\[
 \boxed{
 4\pi S_\pi(z)
 =2\langle(qW)',(qW_z)'\rangle
  -\sum_j\langle q_jW,q_jW_z\rangle.}                         \tag{75}
\]

The endpoint `z=1` is obtained only after taking the Euler-renormalized limit.

This polarization holds for the continuous scale source and cell by cell in
the Euler decomposition. The bounded variation-gauge Wronskian is exactly a
directional cross-Hardy inequality with positive Abel cell weights, and the
assembled root log variance has an exact all-index Euler-cell formula. This
gives a genuine bridge, not a new sign. Mellin differentiation inserts
`log|t-rho_j|` branch singularities whose scale sources have non-`L1`
logarithmic tails; differentiating the unrenormalized continuous-scale/
root-Mellin representation under the integral is invalid. Euler subtraction
must be performed before the Mellin derivatives. The two
live bridge targets are therefore a complete-theta cross-Hardy angle bound or
reverse curvature of the root-resolved Euler cells.

### The first even theta auxiliary also closes analytically

For `q=t^2-c`, put `m_j=integral t^(2j)W(t)^2dt` and

\[
 r={m_0m_2\over m_1^2},\qquad
 s={m_0^2m_3\over m_1^3}.
\]

Exact discriminant algebra shows that the five-scalar margin is strictly
positive for **every real coefficient** `c` if

\[
 \boxed{4s<9r^2+6r-27.}                         \tag{76}
\]

For the actual complete-theta source, two explicitly integrated first orbits
give the main terms and one geometric estimate sums every orbit `n>=3`.
Rational outward bounds yield

`r>14/5`, `s<14`, and
`9r^2+6r-27-4s>109/25>0`.

Thus the first even nonconstant instance `(N,epsilon)=(1,0)` of the
two-generator sufficient criterion is proved analytically, without estimating
the actual old residual coefficient and without quadrature or a finite orbit
truncation. Together with (71), both first nontrivial parity instances are now
closed. No induction to higher residuals is supplied.

This wave proves the first odd auxiliary (71) and the first nonconstant even
auxiliary (76), but it does not establish the
all-degree score inequality, the complete Hardy/Mellin budget, the first
Xi--Laguerre sign, or RH.

## Tenth-wave fixed-rung certificates and all-degree caps

### The cross-Hardy form is a signed logarithmic band correlation

Under the two old positive-prefix hypotheses, let `q` have its `kappa` real
simple roots and let `mathcal U` collect the two logarithmic branches at every
root. For real rapidly decreasing profiles `U,V`, the complete polarized
Hardy form is exactly

\[
 \boxed{
 \mathscr Q_q(U,V)
 ={2\over\kappa}\left\langle\mathcal UU,
 \left(-\partial_y^2-{2\kappa-1\over4}\right)
 \mathcal UV\right\rangle.}                                \tag{77}
\]

The bounded-gauge Wronskian is therefore one signed correlation across the
log-frequency threshold `sqrt(2kappa-1)/2`; the low and high bands are not
separately positive. At every real zero of `W=2Xi`, the interior Ewald
direction fails to share that zero except at a discrete set of Abel
parameters. Quotient or bounded-multiplier angle proofs consequently have
poles, so the division-free form (77) is essential.

After Euler subtraction, let `dnu_n` be the signed root-resolved measure of
the `n`th complete cell, `Y=log|t-rho_j|`, and
`c_kappa=1/(2kappa-1)`. The assembled Mellin sufficient condition is exactly

\[
 \boxed{
 \sum_{n,m\ge1}\iint
 \left\{c_\kappa-{1\over2}(Y-Y')^2\right\}
 \,d\nu_n\,d\nu_m\ge0.}                                  \tag{78}
\]

The double series is absolutely convergent only after the cell subtraction.
Individual cells and the pair kernel are signed, so diagonal or cellwise
positivity does not prove (78).

After each complete scalar cell `e_n` has assembled every root and its Euler
subtraction, write `S=P-N`, `V=P+N`, `M=V(1)`,
`C=(1+alpha)M`, `R=C-V`, and `D_cell=P'N-PN'`. The band difference has the
exact scalar factorization

\[
 \boxed{
 V\mathcal W_\alpha=2R D_{\rm cell}+C S V',
 \qquad
 \mathcal W_\alpha=(C-2N)P'-(C-2P)N'.}                     \tag{79}
\]

For `alpha=1/2`, the original obligation is exactly the half-seed
`P(1/2)>=N(1/2)` together with
`(3M/2-2N)P'>=(3M/2-2P)N'` on `[1/2,1)`. The stronger order
`D_cell>=0` plus the seed is sufficient, not equivalent or necessary. Exact
same-magnitude sequences with the same positive seed and endpoint can have
opposite Wronskian signs, so magnitudes alone do not prove the band
inequality.

### The next even anchor is theta-positive, but generic Gram completion fails

For `q=t^4+at^2+b`, the complete-theta fixed-coefficient anchor is

\[
 \boxed{
 7\|\psi^{(3)}\|_2^2\|\psi^{(5)}\|_2^2
 <11\|\psi^{(4)}\|_2^4.}                                  \tag{80}
\]

Exact first-two-orbit incomplete-gamma bounds and one analytic all-`n>=3`
tail prove (80). The full auxiliary is
`mathcal H_(2,0)=mathcal N(a,b)/Delta`, with
`mathcal N=Du^2-2Euv+Av^2+uDelta`, `u=-(A+B)/2`, and
`v=-(C+2E)/2`. A fixed `3 by 3` positive moment Gram controls the projection
part but not the signed `u` term. An exact positive-Gaussian actual residual
has `Delta>0` and `mathcal N<0`, so positive-source/Gram geometry cannot prove
the theta rung.

Using the frozen normalization `M_j=mu_j/4^j`, outward target padding, and
tight complete-orbit boxes through derivative order five, the actual theta
residual satisfies

\[
 \boxed{
 \begin{aligned}
 \Delta[n]&>2.704026596843609\times10^{11},\\
 \mathcal N[n]&>8.458724288280467\times10^{14},\\
 \mathcal H[m]&>39182.35127475381,
 \end{aligned}
 \qquad \mathcal S_{2,0}>0.}                                \tag{81}
\]

The 300-bit replay is byte-identical to its frozen receipt and contains every
theta orbit. This proves the actual fixed `(2,0)` rung, not arbitrary
bivariate positivity.

### The next odd theta auxiliary is positive for every coefficient

For `q_c=t(t^2-c)`, let `A,B,C,D,E` be the five positive-weight scalars and
`Delta=AD-E^2`. The exact numerator and auxiliary are

\[
 \boxed{
 F(c)=\{AC+E(A-B)\}^2-\Delta(A^2-B^2),
 \qquad \mathcal H(c)={F(c)\over4A\Delta}.}                 \tag{82}
\]

The coefficient of `c^8` is exactly
`m_0^2(5m_1^2-m_0m_2)`, the proved first-odd gap, but the finite coefficients
use new moments through `m_4`. With
`F_+=(4pi)^(-4)F_theta`, complete-theta first-two-orbit integrals and an
analytic all-`n>=3` tail give alternating coefficient signs. For `c>=0`,
they give the rigorous lower polynomial

\[
 \boxed{
 \begin{aligned}
 F_+(c)>P(c)={}&37c^8-8873c^7+1054700c^6-78290000c^5\\
 &+3974300000c^4-141800000000c^3\\
 &+3564000000000c^2-59420000000000c\\
 &+549500000000000>0.
 \end{aligned}}                                             \tag{83}
\]

The exact Sturm sequence has four variations at both zero and positive
infinity. For `c<=0`, termwise sign alternation gives positivity. Hence
`F_theta(c)>0` for every real `c`, and the actual `(1,1)` pivot is strictly
positive.

This is source-specific. For
`W_G=e^(-t^2/2)+e^(-49t^2/2)`, the first-odd gap and old odd block are
positive, but the actual next residual has `c=281423/86730` and signed pivot
`-334398467889/774697656250<0`. Thus the leading inherited gap is not a
generic induction.

### The following odd actual residual also closes

For the actual `q=t(t^4+at^2+b)`, correctly rescaled target moments and the
complete derivative norms through order six give

\[
 \boxed{
 \begin{aligned}
 a&=-115.1343904510145197\ldots\pm5.31\times10^{-17},\\
 b&=2007.268091634418605\ldots\pm9.57\times10^{-16},\\
 F&=9.3689682\times10^{26}\pm2.83\times10^{18},\\
 \mathcal H[n]&=68176.985\ldots\pm3.53\times10^{-4},
 \end{aligned}
 \qquad \mathcal S_{2,1}>0.}                                \tag{84}
\]

Since the whole-line moments obey `m_j=4pi n_j`, the sign is unchanged.
Independent 300- and 420-bit replays are byte-identical to their receipts.
Coefficient-free positivity is false: the real-rooted trial
`q=t(t^2-68)(t^2-13)` has `Delta>0` but `F<0`. The fixed-rung theorem uses
the actual signed residual; it is not a parity induction.

### The uniform Sobolev target is a reverse Schur cap

For any actual monic residual, orthogonalize `b_q=tqW` against `a_q=q'W`.
The degree-uniform auxiliary is exactly

\[
 \boxed{
 |B|\ge A
 \quad\text{or}\quad
 D-{E^2\over A}
 \le {A\{C+E-EB/A\}^2\over A^2-B^2}.}                     \tag{85}
\]

The first branch is automatic. In the nonautomatic branch, ordinary Hankel
or J-fraction positivity proves only the strict lower bound `D-E^2/A>0`, not
the upper cap (85). The newest positive moment enters the denominator-free
numerator affinely with coefficient `-A(A^2-B^2)`. Multiplication by
`t^2-c` gives an exact trial transfer and inherits the old margin only as its
leading escape form; general actual residuals also carry the `q_(N-1)` term
of their three-term recurrence. Thus (85) is a degree-uniform, noncircular
theta-specific target, but it is exactly the existing sufficient auxiliary
in reverse-Schur form. The eleventh wave below refutes it in general at an
actual complete-theta residual.

This wave proves three additional fixed low-degree two-generator
certificates. At that checkpoint (85) and the signed-cell condition were
candidate continuation targets; the eleventh wave below refutes the former.
No first Xi--Laguerre inequality, all-degree positivity theorem, or RH result
follows. In particular, a fixed positive prefix of the auxiliary does not
imply that (85) continues.

## Eleventh-wave route resolution and reverse cell order

### The actual degree-ten theta residual refutes the uniform cap

For the actual `(N,epsilon)=(5,0)`, `kappa=10` residual, outward interval
`LDL^T` proves the old signed block positive definite. Complete all-orbit
positive-moment boxes put the residual in the nonautomatic branch of (85),
but give the strict separation

\[
 \boxed{
 \mathcal S_{5,0}^{\rm archive}>1.3981115905406887\times10^{16}>0,
 \quad {AR_0^2\over G}-V<-8.571354299633478\times10^{16},
 \quad \mathcal H[n]<-1.019072112071746\times10^{14}.}
                                                               \tag{86}
\]

The first number uses the corrected archived signed-moment normalization;
the cap and `H[n]` use the half-line positive moments. Here `G=A^2-B^2`,
`R_0=C+E-EB/A`, and `V=D-E^2/A`. Equivalently,
`y^T K^(-1)y-A=4H<0` for the full correlated two-vector. Thus the
actual target pivot is positive while its stronger two-generator sufficient
condition is negative. The primary proof uses exact theta orbits one through
six and an analytic `n>=7` tail. A separate 720-bit implementation uses
`arb_mat`, a determinant-ratio pivot, exact orbits one through eight, and an
analytic `n>=9` tail; it confirms all signs.

This is an actual complete-theta counterexample to the proposed uniform
auxiliary, not to the signed target pivot, the first Xi--Laguerre inequality,
an all-degree target theorem, or RH.

### The exact cell hazard admits a reverse-order payment

For fully assembled scalar cells, retain `S=P-N`, `C=(1+alpha)M`, and
`D=P'N-PN'`. Direct expansion strengthens the usable form of (79):

\[
 \boxed{
 \mathcal W_\alpha=C S'-2D,
 \qquad
 D(z)=\sum_{i,j\ge1}(i-j)a_i b_jz^{i+j-1}.}       \tag{87}
\]

For `0<z<=1` with `P(z)N(z)>0`, use the Abel-tilted positive and negative
index laws `p_z,n_z` and cell tails `A_k=sum_(i>=k)a_i z^i`,
`B_k=sum_(j>=k)b_j z^j`. Then

\[
 \boxed{
 D={PN\over z}\{\mathbb E_{p_z}I-\mathbb E_{n_z}J\},
 \qquad
 -zD=\sum_{k\ge1}\{PB_k-NA_k\}.}                 \tag{88}
\]

Consequently

\[
 \boxed{
 \alpha>0,\quad {1\over2}\le z<1,\quad S'(z)\ge0,
 \quad P(z)B_k(z)\ge N(z)A_k(z)\ \ (k\ge1)
 \quad\Longrightarrow\quad
 D(z)\le0,
 \quad \mathcal W_\alpha(z)\ge0.}               \tag{89}
\]

The bounded Abel lemma still needs its separate half-seed. Two frozen
first-ten-cell floating probes observe this reverse order at the five proved
low rungs, but they are diagnostic only: they have no outward quadrature,
analytic Ewald-index tail, Abel-interval proof, or all-degree conclusion.

### Adjacent Turan and Hankel data do not recover the correlation

At the actual `(2,1)` residual, the complete-theta value satisfies the
correlated newest-moment cap. However, retaining the certified half-line
moments `n_0,...,n_5` and setting only `n_6^*=4500000000` preserves every
adjacent reverse-Turan test through `j=5`, all relevant strict ordinary and
shifted Hankel minors, and `AD-E^2>0`, while

\[
 \boxed{
 n_6<U_q<n_6^*<{13\over9}{n_5^2\over n_4},
 \qquad
 F(n_6^*)=-9.02891070\times10^{27}
           \pm8.25\times10^{18}<0.}              \tag{90}
\]

The modified `n_6^*` is not asserted to be the theta moment. The spectral
moments obey `m_j=4pi n_j`, and every sign and normalized ratio here is
invariant under that common scaling. Equation (90)
is a strict moment-cone non-implication: source-only adjacent ratios and
positive Stieltjes geometry cannot supply the missing residual correlation.

### A conditional tilted Brascamp--Lieb step is valid but unlinked

Normalize `dnu_b` proportional to `h exp(2bh) psi(h)^2dh`, put
`v=-psi'/psi`, and define
`A_b=E[(h^(-2)+2v')^(-1)]` and
`B_b=E[4v^2(v')^2/(h^(-2)+2v')]`. The audited theta curvature gives a
strictly positive denominator, and asymmetric Brascamp--Lieb plus tilt
differentiation yields

\[
 \boxed{
 \left|\mathbb E_{\nu_a}[v^2]-\mathbb E_{\nu_{-a}}[v^2]\right|
 \le 2\int_{-a}^{a}\sqrt{A_bB_b}\,db
 \qquad(a>0).}                                    \tag{91}
\]

The proposed `I_+`, `I_-`, `P_+`, `P_-` commutator implication is not a
consequence of (91) without their missing definitions and an exact bridge to
the archived modular commutator. Equation (91) is a noncircular conditional
tool, not an `N=1` pivot theorem.

The current live analytic choices are therefore a larger, explicitly
noncircular correlated score space retaining the orthogonal reserve, or a
complete-cell proof of (89) and the separate seed. Neither is yet an
all-degree theorem.

## Twelfth-wave enlarged score and Bessel cell tail

### One added score direction repairs the first failed actual rung

For any linearly independent polynomial dictionary `r_i`, let
`V=span{r_iW}`, `K_ij=integral r_i r_j W^2`,
`y_i=integral q r_i'W^2`, `A=integral q'^2W^2`, and
`s=-q'W-2qW'`. Integration by parts and the Sobolev identity give

\[
 \boxed{
 \mathcal H_V={y^TK^{-1}y-A\over4},\qquad
 2\pi\mathcal S[q]-\mathcal H_V
 ={1\over4}\|(I-P_V)s\|_2^2.}                  \tag{92}
\]

If one feature `v` is added, with squared residual norm
`sigma=||(I-P_V)v||^2` and residual score correlation
`delta=<s,(I-P_V)v>`, block inversion gives the exact monotone gain

\[
 \boxed{\mathcal H_{V+\operatorname {span}\{v\}}
 =\mathcal H_V+{\delta^2\over4\sigma}.}         \tag{93}
\]

At the actual `(N,epsilon)=(5,0)` residual, take
`V_2=span{q',tq}` and `V_3=span{q',tq,t^2q'}`. Complete-orbit Arb bounds in
the half-line `n_j` scale prove

\[
 \boxed{
 \mathcal H_{V_2}\in[-1.0191547405,-1.0189895180]\times10^{14},\qquad
 \mathcal H_{V_3}\in[6.3933727580,6.3954807774]\times10^{13}.} \tag{94}
\]

The enlarged auxiliary uses the corrected signed archive only through
`M_9`; `M_10` is used solely to report the separate positive target pivot.
Its positive metric needs complete moments only through `n_11`. The primary
and replay 720-bit receipts are byte-identical, and a different-precision
800-bit run independently confirms all low-rung signs in both parity ladders.
Equation (94) is a finite-rung certificate. The uniform obligation is (93)
with `delta^2>=-4 sigma H_(V_2)` at every rung.

The actual residual recurrence closes on two consecutive rungs as an
operator recurrence, but a fixed finite scalar feature span does not: its
highest multiplication layer creates a polynomial two degrees beyond the old
span. This finite-Gram escape does not refute theta-specific fixed-width
inequalities; (94) directly rules out such a blanket interpretation.

### The complete Ewald cells have a Bessel-controlled infinite tail

Let `q` be a real monic parity residual of degree `kappa`, and map it to the
real monic physical polynomial
`p(z)=(-1)^kappa i^(-kappa)q(-iz)`, so `|p(it)|^2=q(t)^2`. The complete
physical correlation, before a sign split, reduces orbit by orbit to
modified Bessel `K` functions with argument `2pi m x`. The first orbit
dominates with differentiated uniform remainder. Write `J_q:=J_p` for this
mapped residual. Then

\[
 \boxed{
 J_q(x)=(-1)^\kappa\,8\pi^4(2\pi)^{2\kappa}
 x^{2\kappa+7/2}(\log x)^2e^{-2\pi x}
 \{1+O_q(x^{-1})\}.}                            \tag{95}
\]

For the complete left Euler cell
`e_n=J_q(n)-integral_(n-1)^n J_q(x)dx`, put
`H=(e^(2pi)-1)/(2pi)-1>0`. Uniformity on a unit cell yields

\[
 \boxed{
 e_n=(-1)^{\kappa+1}8\pi^4(2\pi)^{2\kappa}H
 n^{2\kappa+7/2}(\log n)^2e^{-2\pi n}
 \{1+O_q(n^{-1})\},\qquad
 {|e_{n+1}|\over|e_n|}\longrightarrow e^{-2\pi}.}             \tag{96}
\]

Thus the infinite cell tail now has an analytic sign and geometric majorant.
On odd rungs it is eventually positive. The thirteenth-wave certificate
proves `e_2(q=t)<0` at the actual first odd rung, so the stronger cutoff
inequalities `P B_k>=N A_k` fail there for all sufficiently large `k`. The
aggregate identity
`-zD=sum_k(PB_k-NA_k)` is not refuted, and the unfavorable far tail is
geometrically small. The explicit tail inequalities give an effectively
certifiable majorant and reduce the live Ewald problem to
finite-head interval margins for the half-seed, `S'`, and `D<=0` over
`1/2<=z<=1`.

Finally, summing the exact cell multiplier with an index weight gives, for
`Re(s)>m`,

\[
 \boxed{
 M_m(s)=\sum_{n\ge1}n^m d_n(s)
 =\zeta(s-m)+{1\over1-s}\sum_{j=0}^{m-1}{m\choose j}
 \zeta(s-j-1),\qquad
 H_1=-s(2-s)\pi^{-s/2}\Gamma(s/2)\zeta(s-1).}   \tag{97}
\]

The corresponding real-line pairing is exactly `S'(1)`, but (97) does not
sign it. Equations (95)--(97) are analytic infinite-tail and endpoint
identities, not an Abel-interval proof, all-degree pivot theorem, or RH proof.

## Thirteenth-wave exact bridge and route falsifiers

### A fixed three-feature score space has a source-free obstruction

For `U_3(q)=span{q'W,tqW,t^2q'W}`, let `K` and `y` be the polynomial Gram
matrix and score vector, and let `A=||q'W||_2^2`. After reducing dependent
generators to a maximal independent basis, define

\[
 \boxed{
 \mathfrak m_3(q,W)={y^TK^\dagger y\over A}-1,
 \qquad
 \mathcal H_{U_3}={A\over4}\mathfrak m_3(q,W).}          \tag{98}
\]

Take `q=t` and
`W=exp(-t^2/2)+(1/100)exp(-t^2/800)`. Then `U_3` rank-adapts to
`span{W,t^2W}`. Exact Gaussian moments prove

\[
 \boxed{
 8\pi\mathcal S[q]=||s||_2^2-A>0,
 \qquad
 \mathfrak m_3(q,W)<0,
 \qquad
 \mathcal H_{U_3}<0.}                                   \tag{99}
\]

This is a source-free obstruction, not an actual-theta counterexample. It
shows that positive-even-Schwartz geometry alone cannot prove a fixed-`U_3`
theorem. The exact identity `D_2N_3=D_3N_2+Delta^2` in
`U3_UNIFORM_OBSTRUCTION_NEXT.md` supplies a denominator-free test for future
full-rank interval certificates.

### The first Ewald index packet changes physical sign

The inverse Fourier packet of
`H_1=-s(2-s)pi^(-s/2)Gamma(s/2)zeta(s-1)` is

`chi(h)=8 exp(h/2) sum_(n>=1) n z_n(z_n-2)exp(-z_n)`,
`z_n=pi n^2 exp(2h)`.

Its real even part `eta(h)=(chi(h)+chi(-h))/2` obeys

\[
 \boxed{
 \eta(0)>0,
 \qquad
 \eta(H)=-{\pi\over15}e^{-5H/2}+O(e^{-9H/2})<0
 \quad(H\ \hbox{sufficiently large}).}                  \tag{100}
\]

The tail sign follows from an explicit Euler--Maclaurin bound, not a formal
asymptotic. With `Xi=(1/2)widehat psi`, the exact endpoint correlation is

\[
 \boxed{
 R_1(u)={1\over8}\int_{\mathbb R}v^2
 \psi\!\left({u+v\over2}\right)
 \eta\!\left({u-v\over2}\right)dv,
 \qquad
 S'(1)=[q(-iD)^2R_1](0).}                                \tag{101}
\]

Thus pointwise packet positivity is refuted, but the complete differentiated
correlation in (101) is not signed.

### The complete `N=1` modular commutator has an exact bridge

Define
`I_+/-=integral_0^infinity h exp(+/-2ah)psi^2 dh`,
`P_+/-=integral_0^infinity exp(+/-2ah)psi^2 dh`, and
`M(b)=E_(nu_b)[v^2]`, where
`dnu_b` is proportional to `h exp(2bh)psi^2 dh`. Direct specialization of
the archived reflection matrices and complete integrated commutator gives

\[
 \boxed{
 \mathcal C_1={4aI_-\over s_0s_1}
 \{I_+[M(a)-M(-a)]-a(P_++P_-)\}.}                        \tag{102}
\]

For `a>0`, `s_0=I_+-I_->0` automatically. Assuming the separate actual-prefix
input `s_1>0`, the already audited asymmetric Brascamp--Lieb estimate makes
(102) strictly negative under

\[
 \boxed{
 2I_+\int_{-a}^{a}\sqrt{A_bB_b}\,db<a(P_++P_-)
 \quad\Longrightarrow\quad \mathcal C_1<0.}             \tag{103}
\]

This is the complete commutator, including the derivative-of-weight term. It
is an unpaid defect sign: neither `s_1` nor the next pivot `s_2` follows from
the algebra alone. At this checkpoint the remaining analytic target was the
correlated opposite-tilt inequality for `E_(nu_b)v'`; the next wave certifies
it and `s_1>0` on the campaign interval without paying `s_2`.

### One actual negative odd-rung Ewald head cell is certified

For the actual degree-one residual `q=t`, complete Arb integration on
`[-40,40]` gives
`-0.42546800686816579594009338701+/-1.08e-30`. An explicit contour-shift and
complete-theta derivative majorant bounds both omitted spectral tails, with an
extra factor-two safety reserve, by `1.4251071458817267e-6`. Hence

\[
 \boxed{
 e_2(q=t)<-0.425466581761017<0.}                          \tag{104}
\]

Together with the proved eventual-positive odd Ewald tail, (104) rigorously
refutes the stronger cutoff-by-cutoff stochastic order at this actual rung.
This one cell alone does not determine aggregate `D=P'N-PN'`, the half-seed,
or `S'`; the next wave supplies the required signed regional compensation at
this rung. It does not prove a pivot or RH.

### The fixed three-feature rule also fails at an actual theta rung

The source-free obstruction above does not by itself decide the complete
theta ladder. A separate source-bound calculation does. Construct the actual
odd monic `kappa=15` residual from `M_0,...,M_14`, with `M_15` excluded. For
`U_3=span{q',tq,t^2q'}`, exact coefficient arithmetic certifies rank three;
complete positive moments through order 16 and the signed old-data receipt
give positive `Delta_2` and `det K_3`. The denominator-free Schur numerator

`N_3=D_num^2+H_num S_num`

then satisfies

\[
 \boxed{
 N_3<-5.973346107310686\,10^{177},
 \qquad
 \mathcal H_{U_3}\in
 [-9.886093182083536,-9.886043195560485]10^{24}<0.}       \tag{105}
\]

A clean replay reproduces every substantive signed-moment enclosure and the
800-bit downstream result byte-for-byte; an independent implementation audit
checks the padding, normalization, exact rank, complete positive tail,
bordered determinant, and Schur identity. Equation (105) refutes this fixed
dictionary as a uniform actual-theta auxiliary. It does not sign `M_15` or the
true target. The next wave supplies a finite recurrence-aware repair, while
the adaptive/growing all-degree question remains open.

## Fourteenth-wave recurrence repair and first-rung closures

### Exact adaptive block gain and its source-free boundary

Let `U` be an old-data score space and let `R` be a finite candidate block.
After residualizing `R` against `U`, write its Gram matrix as `Sigma` and its
score-correlation vector as `z`. Exact block inversion gives

\[
 \boxed{
 \mathcal H_{U+R}=\mathcal H_U+{1\over4}z^T\Sigma^{-1}z,
 \qquad c=\Sigma^{-1}z
 \text{ realizes the same gain in one direction}.}       \tag{106}
\]

This construction is noncircular whenever the candidates and positive moments
are old data. It still cannot yield a source-free fixed-degree theorem. For
each fixed `d`, take `q=t` and
`W_L=exp(-t^2/2)+L^(-1)exp(-t^2/(2L^2))`. Projection onto the entire even
polynomial space through degree `2d` satisfies

\[
 \boxed{
 \Pi_d(L)=O_d(L^{-1}),\qquad
 8\pi\mathcal S_L[t]\longrightarrow\sqrt\pi>0,qquad
 \mathcal H_{\mathcal P_d^{\rm even}W_L}
 \longrightarrow-\frac{\sqrt\pi}{4}<0.}                 \tag{107}
\]

Thus no source-free fixed polynomial degree ceiling works uniformly, even
with moment-adaptive coefficients. Growing-degree and complete-theta
recurrence rules remain admissible.

### The backward recurrence channel repairs every available actual rung

The actual residual recurrence gives

\[
 \boxed{
 t^2q_N'=q_{N+1}'+\alpha_{N+1}q_N'-2tq_N
             +\beta_{N+1}q_{N-1}',
 \qquad
 V_N^{\rm prior}=\operatorname {span}\{q_N',tq_N,q_{N-1}'\}.} \tag{108}
\]

The forward derivative in (108) needs new signed data; the predecessor is
already old data. Distinct leading degrees certify rank three. Complete-orbit
Arb enclosures prove positive inverse-free Schur numerators at all thirteen
available rungs. At the critical actual odd degree fifteen,

\[
 \boxed{
 \mathcal H_{V_7^{\rm prior}}
 \in[6.611165481170336,6.611172265806858]10^{25}>0,
 \qquad
 N_{\rm prior}>1.080381572245252\,10^{169}.}             \tag{109}
\]

Only `M_0,...,M_14` enter; `M_15` is absent. Equation (109) repairs the known
fixed-`U_3` failure at this rung but does not prove the open all-degree target
`N_prior(N,epsilon)>0`.

### Signed Ewald compensation closes the first odd aggregate

If `e_2` is the sole negative cell, an exact useful reduction is

\[
 \boxed{
 D(z)=(-e_2)z\{zS'(z)-2S(z)\},qquad
 D\le0\text{ on }(0,1]
 \Longleftrightarrow S'(1)-2S(1)\le0.}                  \tag{110}
\]

The actual certificate does not assume that sign pattern. For `q=t`, complete
cells `e_1,...,e_6` and a sign-free `Y=20` tail give
`T_0=sum_(n>6)|e_n|<0.00064572235` and
`T_1=sum_(n>6)n|e_n|<0.00784330785`. A regional perturbation inequality then
proves uniformly for `1/2<=z<=1`

\[
 \boxed{
 S(1/2)>0.2224841354323905,qquad
 S'(z)>0.2535251354001165,qquad
 -D(z)>0.0340797978403207.}                              \tag{111}
\]

Arbitrary signs after cell six are allowed. This closes the bounded Abel seed,
derivative, and aggregate reverse-order gates at `kappa=1` only.

### The complete `N=1` modular tilt input is uniformly certified

Let `J_b=integral h exp(2bh)psi^2v' dh` and form the even and divided-odd
combinations `I_e,I_s,J_e,J_s`. With `c=psi(0)^2` and
`Q=c/4-aP_(-a)`, define

\[
 \boxed{
 R(a)=I_eJ_s-I_sJ_e-2I_sQ,qquad
 {I_{-a}\over a}F(a)=R(a),qquad
 {s_1\over2a}=L_s-P_e-a^2I_s.}                          \tag{112}
\]

Here `F<0` is exactly the previously open opposite-tilt condition, and the
divided functions have ordinary limits at `a=0`. Complete theta orbits one
through eight, analytic `n>=9` and `h>=2` tails, and a full parameter/spatial
interval cover prove

\[
 \boxed{
 R(a)<-0.0324959540305671,qquad
 {s_1\over2a}>0.352482030101313,qquad
 \mathcal C_1<0
 \quad(0<a\le1/4).}                                     \tag{113}
\]

Thus neither the opposite-tilt bound nor `s_1>0` remains an input at `N=1` in
the campaign range. The negative complete commutator is still an unpaid
defect: `s_2`, the next pivot, every all-degree conclusion, and RH remain
open.

## Fifteenth-wave source-specific barriers and endpoint payment

### The prior repair requires complete-theta drift alignment

Let `p=(I-P_U)q_(N-1)'`, where `U=span{q_N',tq_N}`, and put
`v=-W'/W`. Orthogonality to both old features gives, for every real `lambda`,

\[
 \boxed{
 \mathcal H_{V_N^{\rm prior}}
 =\mathcal H_U+
 {\left|\int_{\mathbb R}(v-\lambda t)q_NpW^2\,dt\right|^2
  \over\|pW\|_2^2}.}                                  \tag{114}
\]

Equation (114) is exact and noncircular. It also shows why recurrence or
Christoffel--Darboux geometry alone is insufficient: the predecessor pays
only through its alignment with the nonlinear logarithmic drift.

An exact positive-even-Schwartz countermodel makes this failure concrete. For
`W=exp(-t^2/2)(1+4t^2/5)`, the old signed determinant and current target are
positive, while

\[
 \boxed{
 \Delta_{\rm old}={3393\over1250}>0,qquad
 \mathcal T_4={4035\over754}>0,qquad
 \mathcal H_{V_2^{\rm prior}}
 =-{14131991108769\over2800717324340}\sqrt\pi<0.}       \tag{115}
\]

The stronger supergaussian example rules out even log-concavity plus full
target-ladder positivity. For `W=exp(-t^4)`,

\[
 \boxed{W'^2-WW''=12t^2e^{-2t^4}\geq0,}                \tag{116}
\]

but exact gamma moments and Arb enclosure give

\[
 \boxed{
 \mathcal H_7<-0.0017001720616628,qquad
 \mathcal H_8<-0.00074017432132118.}                    \tag{117}
\]

Thus positive targets, Favard geometry, and log concavity cannot prove the
prior rule. The Gaussian reference has exactly
`H_prior/A=1/(4 kappa)`, so its generic reserve shrinks. For the actual theta
orbits, `phi_n^(j)(h)=n^(-1/2)phi_1^(j)(h+log n)` exposes why fixed-order
first-orbit dominance is not uniform as the derivative order grows. The open
lemma is the complete-theta version of the alignment in (114), formed before
separate orbit bounds.

### Eventual Ewald tails are resolved by parity

Fix a certified eventual-sign threshold `K`. At odd degree the remote tail
`A=sum_(n>K)e_nz^n` is positive, so it improves the seed and derivative. If
`mu_-=zN_K'/N_K` and `m<=mu_-`, then exactly

\[
 \boxed{
 D=D_K+N_K\sum_{n>K}(n-\mu_-)e_nz^{n-1},qquad
 D_K+N_KU_m\leq0\Longrightarrow D\leq0,}               \tag{118}
\]

where `U_m` majorizes the centered tail moment. This removes the generic
`P_KT_1`, `P_K'T_0`, and `T_0T_1` payments.

At even degree the remote tail is negative. Writing its magnitude as `B`,
support separation gives

\[
 \boxed{
 D=D_K+P_K'B-P_KB'\leq D_K.}                            \tag{119}
\]

Hence the even aggregate needs no tail-size payment; only the seed and
derivative pay `T_0,T_1`. Equations (118)--(119) include every remote cell for
each fixed residual. They do not supply a threshold uniform in `kappa` or the
finite-head margins required for an all-degree theorem.

### The normalized `N=1` modular defect is paid locally

For positive `a`, the audited one-negative-direction cost is not simply the
negative commutator. Exact cleared algebra gives

\[
 \boxed{
 \kappa_1\mu_1^-=-\mathcal C_1+\mathscr R_a,qquad
 \mathscr R_a=4a\left({I_-\over s_0}+{aP_-\over s_1}
       +{a^2s_0Q_-\over s_1^2}\right)>0.}              \tag{120}
\]

Thus `C_1<0` alone strictly underpays. At `a=0`, the independently audited
quadratic curvature result gives `sigma_2>(1254/8)sigma_0`. The exact drift
identity, `17<v'<2v+20`, `c_*<16/5`, and the frozen moment bound
`M_0>3/100` give the rational chain

\[
 \boxed{
 Q_0<{182\over85}<{1881\over800}
 <{1254\over32}\sigma_0,qquad
 \sigma_2>{1254\over8}\sigma_0>4Q_0.}                 \tag{121}
\]

This pays the normalized first-rung scalar and proves `sigma_2>0`. All divided
prefix quantities extend continuously at zero, so the strict margin also
gives

\[
 \boxed{
 \lim_{a\downarrow0}\left{{s_2(a)\over s_1(a)}
        -\kappa_1(a)\mu_1^-(a)\right}
 ={\sigma_2-4Q_0\over\sigma_1}>0.}                     \tag{122}
\]

Consequently some unspecified `a_0>0` has strong payment and `s_2(a)>0` for
`0<a<a_0`. No explicit `a_0`, coverage of the full `0<a<=1/4` interval,
higher-degree payment, all-degree theorem, or RH conclusion follows.

## Reproduction and recovery

- `README.md` records the hard gates and interpretation rules.
- `RUNBOOK.md` records test, launch, status, graceful-stop, and recovery
  commands.
- `tasks-stage0.json`, `tasks-stage1.json` and `tasks-stage2.json` are the
  finalized deterministic queues. The stage-1 completion parameters include
  the executed orbit cutoff. The stage-2 manifest binds its four inputs and
  worker source; `analyze_stage2.py` enforces those hashes after execution.
- `results/egf_identity_j128.json` is the exact-gate manifest.
- `run-stage1/completed.jsonl` and `run-stage1/failed.jsonl` retain every
  receipt; `run-stage1/events.jsonl` is the process audit trail.
- The curated stage-2 checkpoint retains both small result JSON files,
  completion receipts, events, heartbeat, supervisor metadata and the
  pre-start launcher error log. `analysis-stage2.json` is the deterministic
  aggregate.
- `tasks-m0-inertia.json` binds the `M0` worker, exact inputs, Arb Python and
  primary/replay parameters. `run-m0-inertia/` retains the supervisor metadata,
  heartbeat, event sequence, completion receipt and worker log;
  `results/m0_inertia_primary_parameter_replay.json` is the bound floating
  result and `analysis-m0-inertia.json` is its deterministic governed receipt.

The committed checkpoint retains the exact EGF manifest, both N24 replay
exemplars, the terminal receipts/event audit, and the deterministic aggregate.
The other accepted raw pair JSON files remain ignored generated state. A fresh
checkout must rerun the gated queues before rerunning `analyze_results.py`;
the stored aggregate records the original source and receipt hashes.

After the run, `tasks-stage1.json` was deterministically regenerated to add
the already executed `max_orbit=96` value to `expected_parameters`, hardening
recovery. Its launched definition had SHA-256
`72dcb54b1f0bcfe1dd9f4e6a920f32a262c7d9908d5b497d104aafe933b39dfb`;
the finalized definition has SHA-256
`8521da6ead30d0f41ad2175a7e99483ee435ffeaa9e19bcb898328c97591f6d2`.
Worker argv and scientific parameters are unchanged. `analysis-stage1.json`
intentionally binds the finalized queue definition while retaining the
original receipt and result hashes.

Do not restart the completed queues merely to keep CPUs busy. A new workload
must target (2)/(3), use a new run directory, pass its own tests and manifest
gate, and continue to respect the lock/load governor and protected 4CT PID/CWD
checks.
