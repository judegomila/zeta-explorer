# Direct actual-theta Hardy gate at the first odd rung

## Scope

This workstream evaluates one finite, actual-theta instance of the wave-31
tail-augmented Hardy gate.  It fixes

\[
 m=1,\qquad n=0,\qquad q(t)=t,\qquad J=2,
\]

and evaluates the Hardy energy directly from the complete physical theta
profile.  It does not obtain the energy from the known next pivot.

With `W=2 Xi`, `G=tW`, and `H_1=W`, put

\[
 E=\|(tW)'\|_2^2,\qquad B_1=\|W\|_2^2,
 \qquad \gamma_1={E\over B_1},
\]

\[
 \Delta_1^{\rm H}=2-{B_1\over E},\qquad
 R_{0,2}={4\pi T_{q,2}^{\rm Ew}\over E}.
\]

Here `T_(q,2)^Ew=sum_(k>2)e_k` is the scalar Ewald-cell tail.  The scalar
cells carry half the direct-source normalization:

\[
 \sigma_0 T_{0,2}^{\rm dir}=2T_{q,2}^{\rm Ew}.
\]

Thus the factor `sigma_0` cancels from the wave-31 cost
`2 pi sigma_0 T_(0,2)^dir/E`, leaving the displayed `4 pi` ratio.  Wave 31
therefore gives

\[
 \Delta_1^{\rm H}>R_{0,2}
 \quad\Longleftrightarrow\quad
 H_{q,2}:=e_1+e_2>0.
\]

This is a one-rung finite certificate only.  It is not an all-degree
estimate and does not prove the Riemann hypothesis.

## Independent evaluation of `E`

The complete-orbit Hardy normalization gives

\[
 E=4\pi\int_0^\infty h^2\psi'(h)^2\,dh.
\]

The checker reuses the complete theta jet engine from
`certify_modular_vprime_tilt.py`.  On `0<=h<=2`, that engine evaluates the
first eight theta orbits and encloses every orbit `n>=9` analytically on
each Arb cell.  The omitted spatial tail `h>=2` uses the engine's existing
`L_sinh_over_a` bound at `a=0`, where the integrand is exactly
`2 h^2 psi'(h)^2`.  No signed target pivot or Ewald endpoint is used to
construct `E`.

The other inputs are reused rather than recomputed:

- `B_1=4 pi ||psi||_(L2(0,infinity))^2` comes from the complete positive
  moment receipt with exact orbits `1,...,8` and an analytic `n>=9` tail;
- `e_1,...,e_6` and the sign-free all-index bound
  `sum_(k>6)|e_k|` come from the independently audited first-rung Ewald
  certificate;
- the `J=2` tail is enclosed as
  `e_3+e_4+e_5+e_6 +/- sum_(k>6)|e_k|`.

The frozen positive-moment file contains other fields, but the checker reads
only its degree-zero half-line norm for `B_1`.  Likewise `e_1+e_2` is not an
input to `E`, `B_1`, `Delta`, or the tail cost; it is read only after those
quantities are formed, as a normalization crosscheck.

The receipt must certify positive `E`, `B_1`, `gamma_1`, Ewald head, Ewald
tail, and `Delta-R`.  It reconstructs

\[
 e_1+e_2={E(\Delta-R)\over4\pi}
\]

and checks interval overlap with the direct cell sum.  A pre-run static audit
caught and corrected an earlier factor-two mismatch in this normalization;
the governor was stopped before it launched a worker, so no invalid numerical
receipt was produced.

## Queued replay

Run from the checkpoint root with the recorded Arb environment:

```text
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 \
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/actual-hardy-kappa1-gate-20261104/src/certify_actual_hardy_kappa1_gate.py \
  --checkpoint-root . \
  --spatial-cells 4096 \
  --precision-bits 192 \
  --max-cpu-seconds 120 \
  --max-rss-mib 512 \
  --output workstreams/actual-hardy-kappa1-gate-20261104/results/actual_hardy_kappa1_gate.json
```

Then run the focused tests:

```text
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 \
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python -m unittest \
  workstreams/actual-hardy-kappa1-gate-20261104/tests/test_certify_actual_hardy_kappa1_gate.py
```

The job requests one process and one intended compute thread.  Its in-process
CPU and RSS checks are cooperative checkpoints, while the sampled-load
supervisor controls admission; neither mechanism is a kernel hard quota.  It
must not be started while sampled whole-machine usage is at or above the
user's 50% total-Mac target.

## Nonclaims

- No value or bound for the stronger logarithmic variance `V_1` is claimed.
- No higher residual degree is tested or inferred.
- A finite first-rung pass cannot establish a uniform theorem or RH.
