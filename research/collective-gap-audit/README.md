# Collective gap interaction audit (research prototype)

This audit evaluates the dimensionless collective interaction
\(R_j=g_j^2 S_j/2\), where
\(S_j=\sum_{k\ne j,j+1}[(x_{j+1}-x_k)(x_j-x_k)]^{-1}\).
For a real-rooted heat polynomial with simple roots, the exact identity is
\((g_j^2)'=8-4g_j^2S_j=8(1-R_j)\).

## Run

```bash
pip install mpmath
python gap_audit.py --zeros 80 --exact-pairs 3 --output gap_snapshot.csv
```

The tests verify (1) the exact heat polynomial \(z(z^2-1-6t)\),
for which \((g^2)'=6\), and (2) a finite regular lattice, where
\(R=M/(M+1)\) tends to one.

The zeta snapshot is **not a proof certificate**. It includes only the
first N known critical-line ordinates, omits the negative ordinates, all
later zeros, and any hypothetical off-line zeros. Its computed
\(8(1-R_j)\) is a truncated *model* prediction, not the true heat
derivative. For the first few pairs, the script independently evaluates
the true derivative at time zero using \(H''/H'\) from the completed
xi function; the discrepancy explicitly measures the danger of
truncation. Here the xi heat variable is \(z=2\gamma\).

The full Dyson sum must be regularized and controlled before using it
as an exact statement about the infinite xi family. Assuming every
unlisted zero is real would already assume RH.

**Research next step:** replace the truncated interaction with a
rigorous interval enclosure for the actual \(H''/H'\), then study its
variation over positive heat time. No global RH bound is claimed.


## Genuine heat-flow derivative audit (new)

Run from this directory:

```bash
pip install mpmath
python genuine_heat_audit.py --times 0,0.02 --pairs 2 --terms 7 --umax 1.4 --dps 35 --output genuine_heat_snapshot.csv
python genuine_heat_audit.py --times 0,0.02 --pairs 2 --terms 9 --umax 1.7 --dps 40 --output genuine_heat_crosscheck.csv
```

This second script evaluates the **actual theta-integral heat family**
`H_t(z)=integral_0^infinity exp(t*u^2) Phi(u) cos(z*u) du`,
where `Phi(u)=sum_{n>=1}(2*pi^2*n^4*exp(9u)-3*pi*n^2*exp(5u))*exp(-pi*n^2*exp(4u))`.
It tracks simple real roots near the first critical-line ordinates, and evaluates
`v_j=H_t''(z_j)/H_t'(z_j)` and `(g_j^2)'=2*g_j*(v_{j+1}-v_j)`.
The effective interaction `R_eff=1-(g_j^2)'/8` is an exact reparametrization
of this derivative **not** a proved positive sum over all real zeros.

Exploratory outputs (heat coordinate `z=2*gamma`):

| heat t | pair | gap z | genuine qdot | R_eff |
|---:|---:|---:|---:|---:|
| 0 | 1 | 13.7746289941 | -4.8311734387 | 1.6038966798 |
| 0 | 2 | 7.9776358827 | 2.6990310675 | 0.6626211166 |
| 0.02 | 1 | 13.7711238358 | -4.8240518562 | 1.6030064820 |
| 0.02 | 2 | 7.9810147137 | 2.6931286398 | 0.6633589200 |

Two different theta truncation/integration cutoffs agreed at the displayed precision.
**These are high-precision numerical diagnostics, not interval-certified results.**
No rigorously enclosed roots, quadrature remainder, theta tail, or global
noncollision theorem is asserted. In particular, positivity of a collective
sum over *all* zeros cannot be assumed without RH. A future certified backend
must provide ball enclosures for `H_t,H_t',H_t''`, a Rouché/simple-root
certificate for each tracked root, and explicit infinite-tail bounds.

The numerical root velocity does not require any assumption about unlisted zeros.
It is a better benchmark for the truncated-zero model than adding more known
ordinates without bounding the omitted interactions.
