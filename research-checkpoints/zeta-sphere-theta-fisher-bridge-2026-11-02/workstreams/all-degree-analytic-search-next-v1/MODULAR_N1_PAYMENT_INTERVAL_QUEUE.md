# Governed interval queue for the modular `N=1` payment

## Purpose and exact scope

`MODULAR_N1_FULL_INTERVAL_PAYMENT_NEXT.md` now proves the finite-`a` scalar
analytically. This queue is a bounded direct Arb cross-check and falsifier of
that theorem, not the primary route and not a polynomial-degree sweep. It asks
the same theorem-relevant question for the complete theta profile:

> Does the strong `N=1` payment
> `s_2/s_1 >= kappa_1 mu_1^-` hold uniformly on `0<a<=1/4`?

A pass independently certifies the same first-rung scalar by interval
assembly. A negative cell would create a concrete contradiction requiring an
audit of the analytic theorem and checker; it would not refute RH. An
overlapping interval is recorded as unresolved and must not be called a pass.

## Cancellation-safe scalar

Let

```text
g_a(u) = exp(a u) psi(u),
s_0(a) = integral_R u g_a(u)^2 du,
s_1(a) = integral_R u (D g_a(u))^2 du,
T_2(D,a) = D^2 + s_1(a)/s_0(a),
s_2(a) = integral_R u (T_2(D,a) g_a(u))^2 du.
```

Pairing `h` and `-h` and integrating the cross terms by parts gives quantities
that continue through `a=0` without dividing interval enclosures by `a`:

```text
I_s  = integral_0^infinity h psi^2 sinh(2ah)/a dh
P_e  = integral_0^infinity psi^2 cosh(2ah) dh
L_s  = integral_0^infinity h (psi')^2 sinh(2ah)/a dh
P1_e = integral_0^infinity (psi')^2 cosh(2ah) dh
K2_s = integral_0^infinity h (psi'')^2 sinh(2ah)/a dh

u_0 = I_s
u_1 = L_s - P_e - a^2 I_s
H_2 = K2_s - 2 P1_e - 2 a^2 L_s + 2 a^2 P_e + a^4 I_s,
s_2/(2a) = H_2 - u_1^2/u_0.
```

Here `u_0=s_0/(2a)`, `u_1=s_1/(2a)`, while `H_2` is the raw
second-derivative square. The inverse-selected subtraction `u_1^2/u_0` is
essential and is not dropped.

The physical negative-side energy is retained with its sign:

```text
Q_- = integral_0^infinity h exp(-2ah) (a psi - psi')^2 dh.
```

Using

```text
kappa_1 = 4a(1 + a^2 s_0/s_1),    mu_1^- = Q_-/s_1,
```

the desired payment is equivalent, when the separately checked `u_0,u_1>0`,
to the division-free inequality

```text
G(a) = u_0 u_1 H_2 - u_1^3
       - 2 Q_- u_0 u_1 - 2 a^2 u_0^2 Q_- >= 0.         (1)
```

At `a=0`, (1) is the previously audited actual-pivot endpoint condition
`sigma_2>=4Q_0`, multiplied only by positive current prefixes. The worker also
performs an exact rational coefficient self-check of the raw `H_2`
integration-by-parts reduction before any interval work.

## Complete-theta enclosure

The worker imports the SHA-bound theta jet from
`src/certify_modular_vprime_tilt.py`. On `[0,2]` it uses outward Arb cells,
eight explicit theta orbits, and the helper's analytic all-orbit remainder.
The factor

```text
sinh(2ah)/a = 2h sinhc(2ah)
```

is evaluated by the helper's remainder-bounded series, so the parameter cell
Both partitions use exact dyadic Arb midpoint/radius tuples. Thus their
boundary cells have exact endpoints `h=0,2` and `a=0,1/4`; no outward radius
rounding leaks the proof domain into negative `a`.

For `h>=2`, put `z=pi exp(2h)`, `z_0=pi exp(4)`, and let `c_j` be the sum of
the absolute coefficients of the `j`-th theta-jet polynomial, whose degree is
`d=j+2`. First-orbit domination gives the deliberately loose uniform bounds

```text
integral psi_j^2 cosh(2ah) dh
    <= 2 c_j^2 integral_{z_0}^infinity z^(2d) exp(-2z) dz,

integral h psi_j^2 sinh(2ah)/a dh
    <= c_j^2 integral_{z_0}^infinity z^(2d+2) exp(-2z) dz.
```

The second line is the existing helper estimate extended from `j=1` to
`j=2`. It supplies powers `6`, `8`, and `10` for `I_s`, `L_s`, and `K2_s`.
For the negative-side tail the worker uses

```text
(a psi-psi')^2 <= 2a^2 psi^2 + 2(psi')^2,
h sinh(2ah)/a >= 2h^2,
```

and therefore, on `h>=2`,

```text
Q_- tail <= (a^2/2)(I_s tail) + (1/2)(L_s tail).
```

All ignored tails are added as outward errors before (1) is formed.

## Two bounded runs

`tasks-modular-n1-payment.json` contains exactly two single-thread tasks:

1. Primary: `4096` spatial cells, `64` parameter cells, `192` bits, at most
   `900` CPU seconds and `1024 MiB` observed peak RSS.
2. Parameter replay: `8192` spatial cells, `128` parameter cells, `256` bits,
   at most `2400` CPU seconds and `1536 MiB` observed peak RSS.

Each run has its own atomic JSON checkpoint and a `4 MiB` output cap. CPU time
is measured by `process_time`, so a governor `SIGSTOP` does not consume the
worker's budget. RSS is checked cooperatively at least every 256 compact
cells. The existing supervisor supplies one-thread BLAS/OpenMP environment
variables, `nice`, background task policy, and process-group pause/resume.
The manifest passes frozen SHA-256 values for the worker itself, the imported
theta helper, the payment-reduction note, and the hardened full-interval
theorem note. The worker checks all four before computation and again before
finalizing the receipt.

The replay is a different partition and precision in a separate process. It
is not an independent implementation, and the result must say so. Agreement
between the two outputs is a partition/precision replay; disagreement is an
audit blocker.

## Launch and recovery contract

Do not launch these commands by hand while the protected 4CT workload or the
host lock/load policy forbids capacity. The corrected governor must be checked
first, and it must remain the only component allowed to signal the worker
process groups. The queue does not read, write, or signal any 4CT path or
process.

The supervisor root is the checkpoint directory containing `workstreams/`.
Use the Arb environment recorded in the manifest. A production launch should
point the corrected supervisor at `tasks-modular-n1-payment.json` and a new
run directory; do not reuse a prior run directory. On restart, the
supervisor requires the expected status and parameters **and** one of the
three manifest-listed terminal verdicts. A SHA mismatch, internal incomplete
receipt, or exhausted budget is never restart-complete. Those outcomes still
write an atomic diagnostic receipt with the exact stopping reason and return
nonzero; after correction or a deliberately revised resource contract, a
fresh supervisor run retries the task. If stopped mid-task, the process-group
stop protocol applies.

No queue result may be described as an RH proof. Even a uniform pass is only
a direct cross-check of the first-rung scalar on the stated modular interval;
it proves no higher-degree or all-degree statement.
