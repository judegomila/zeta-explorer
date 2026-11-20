# Execution ledger for the exact `Lambda <= 0.14` program

Date: 27 August 2026

## Verdict

This workspace does **not** yet prove

\[
\Lambda\le\frac7{50}=0.14.
\]

It now reduces that statement to one explicit, finite analytic certificate:
the early correlated mantle on

\[
0\le\lambda\le
\lambda_h:=\frac{23514296330019}{500000000000000},
\qquad 690988\le N\le14999999,
\]

including its bottom and both closed vertical faces.  The complementary late
mantle has a complete directed P19 certificate.  No local packet, point
scout, state-count theorem, or unfinished transform is promoted to the global
claim.

## Why this bypasses the height-`3*10^16` RH input

The frozen-rung Poisson theorem remains rigorous: a hypothetical target zero
must produce a horizontally separated rung.  Current explicit-formula and
minimum-modulus estimates do not convert that separated value into a
contradiction at feasible cost.

The shorter route is therefore a moving-cutoff version of Polymath's
zero-flow argument.  Put

\[
T=\frac{33}{250},\qquad
Y(t)=\sqrt{\frac7{25}-2t},\qquad
U(t)=\sqrt{1-2t},
\]

\[
X_a=6000000185827,qquad
X_b=60000000000156984,qquad w=\frac{17}{20}.
\]

Keep the cutoff parked at `X_a` through

\[
t_p=\frac{26399999}{200000000}=T-\frac1{200000000},
\]

and, for `0<=lambda<=1`, sweep it by

\[
t(\lambda)=\frac{26399999+\lambda}{200000000},\qquad
R(\lambda)=X_a+59993999999971158\lambda.
\]

The cap-aware first-contact theorem has exact squared clearance

\[
w^2-\bigl(U(t)^2-Y(t)^2\bigr)=\frac1{400}>0.
\]

It uses no derivative bound for `R`.  First contact at `x=0` is excluded by

\[
H_t(iy)=\int_0^\infty e^{tu^2}\Phi(u)\cosh(yu)\,du>0.
\]

The [Platt--Trudgian theorem](https://arxiv.org/abs/2004.09765) supplies the
initial left canopy only through `X_a/2`, while the published final-region
computation in [Polymath Table 1](https://arxiv.org/html/1904.12438v2#S10)
supplies the terminal right canopy.  A zero-free swept side tube joins them.
If that tube is complete, then

\[
\Lambda\le T+\frac{Y(T)^2}{2}
=\frac{33}{250}+\frac1{125}=\frac7{50}.
\]

Thus the construction replaces the unperformed RH verification near height
`3*10^16` by a positive-time finite mantle certificate.

## Proof ledger

| Component | Exact scope | Result |
|---|---|---|
| Platt--Trudgian import | Initial left canopy through `X_a`; height slack `350479773/2` | published rigorous theorem, exact mapping checked |
| Cap-aware moving cutoff | Width `17/20`; squared clearance `1/400` | proved |
| Parking barrier | `[X_a,X_a+1]`, `.12649<=y<=1`, `0<=t<=.132` | certified; minimum margin `>0.09351171649` |
| Swept analytic transfer | Complete moving domain; ordinary and half-jump charts | certified; `<4.826e-6` ordinary, `<1.236e-5` seam |
| P19 coefficient theorem | 256 masks; all 255 nonempty sharp supports; complex-gamma and seam convexity | proved and independently audited |
| Late P19 mantle | `lambda_h<=lambda<=1`, full `x` hull and moving `y` interval | certified by 798 directed transcripts |
| Early P97 correlated packet | First seam; `u` width `1/1000`, total `x` width `3/1000` | certified locally; full-criterion margin `>0.140889322516`; no vertical face or complete window |
| Early P97 line packet | Both charts at the first seam, total `x` width `1/25` | certified locally; no positive `u` or vertical face |
| Endpoint-core cubicization | Every early selector, bottom, both vertical faces, every one-sided seam chart; declared finite endpoint core only | certified; fully recombined log-to-cubic radius `<497/16950000<3e-5`; centers, outside-core tail and transformed bulk open |
| First-window vertical transport | \(N=690989\), both vertical faces, full moving height, four bounding seam charts | certified; gamma/ladder phase drift \(<5.41\times10^{-14}\); gamma and reflected amplitudes contract, while primary amplitudes are nonincreasing (strict for \(n\ge2\)); correlated center open |
| Early correlated mantle | `0<=lambda<=lambda_h`, bottom and both vertical faces | **open** |
| Published final region | `t=T`, starts before `R(1)` and below `Y(T)` | published computation, exact splice checked |
| Complete swept tube | All ramp faces | **not certified** |
| `Lambda<=7/50` | Global conclusion | **not proved** |

## Complete late-family certificate

The late certificate covers

\[
\lambda_h\le\lambda\le1,qquad
R(\lambda)\le x\le R(\lambda)+\frac{17}{20},qquad
Y(t(\lambda))\le y\le U(t(\lambda)).
\]

Its conservative selector inventory is

\[
14999999\le N\le69098829.
\]

The fail-closed assembler verifies:

- `14` closed lambda blocks and `19` closed y tiles;
- `266` parameter cells at `160`, `192`, and `256` bits;
- all `798` authenticated transcripts;
- `10,640` literal cross-precision interval containments;
- the exact start-seam straddle, every shared join, the terminal selector
  cap, and complete moving-y coverage;
- all 256 masks before absolute values, every 255-support tail branch,
  multiplier nonvanishing, kappa removal, and ordinary/half-jump transfer;
- full bottom, both vertical faces, and the interior x hull.

The minimum padded 160-bit ray margin is

\[
0.001321200366072983320455956542999377\ldots>0
\]

at cell `b00/y00`.  The family-record trust root is

```text
bcbe3bc97795e6a906871d2340a4d7dea77895ad17336b03ff06f32d2c18977c
```

and the top-level verifier hard-binds that digest.  A separate isolated
`--fresh` mode recompiles the producer and compares every one of the 798
outputs byte for byte.  The definitive isolated replay passed 798/798; the
late-family source SHA-256 is
`981d7997c8e8743853a257ea1cd2fc9503944386c908a27a7403344f155f7bdb`,
and the audited P19 theorem note SHA-256 is
`a082443eb4f22ccfe64ad3b57774893ab2dcfb198f711a5b373eb7ebf4a00a74`.

## Exact remaining theorem

It is sufficient to prove

\[
H_{t(\lambda)}(z)\ne0
\]

for `0<=lambda<=lambda_h` on

\[
\begin{aligned}
\mathcal B_\lambda &: y=Y(t(\lambda)),
&R(\lambda)\le x\le R(\lambda)+17/20,\\
\mathcal V^-_\lambda &: x=R(\lambda),
&Y(t(\lambda))\le y\le U(t(\lambda)),\\
\mathcal V^+_\lambda &: x=R(\lambda)+17/20,
&Y(t(\lambda))\le y\le U(t(\lambda)).
\end{aligned}
\]

This is `14,309,012` inclusive selector values.  Both lambda endpoints and
every selector seam remain in the contract.

## What the negative results rule out

The hard first selector has a directed universal obstruction for every
finite real multiplier normalized by `lambda_1=1` whose nonvanishing is
proved by the disk condition

\[
\sum_{d\ge2}|\lambda_d|d^{-\sigma}<1.
\]

Even with zero analytic error, its best possible phase-blind loss exceeds
the ray baseline by more than

\[
0.181282765711.
\]

Thus arbitrary tapered or LP-optimized weights do not solve the hard start
under this nonvanishing mechanism.  This does not rule out factorized or
phase-aware multipliers.  An exploratory arbitrary-support point scout is
positive at `N=13,000,000`, but it is neither directed nor a family
certificate.

The hardened correlated Taylor packet proves a healthy local margin

\[
0.23287650857996992
\]

over total line width `0.04`.  A literal cover to the P19 handoff would need
about `7.05e16` such line packets before adding either vertical face.

A separate fully correlated source-bound packet reaches positive
`u` width `1/1000` and total `x` width `3/1000`, with full-criterion margin
`>0.140889322516`.  It validates the two-dimensional local mechanism, but a
literal rectangular cover would still require about `1.20e21` bottom-face
boxes and would not cover either vertical face.

More generally, a termwise polynomial carrier atlas with relative carrier
error below one requires more than

\[
5,613,062,605,047,000
\]

degree-plus-box units over the full interior windows.  Higher Taylor order
alone is therefore not a scalable solution.

## Concrete next certificate

The retained P97 body has `15,849` nonzero squarefree divisor branches with
`d<=10^6`.  Their endpoints can be advanced through an exact monotone event
DAG with

\[
57,948,135
\]

quotient updates, instead of `226,783,531,188` raw `(N,d)` states.  This is
more than a `3912`-fold state compression.

The next producer should:

1. keep primary, reflected, and scalar cross terms correlated;
2. cancel their B-dual stationary interiors before taking a modulus;
3. advance shifted endpoints through the exact divisor event DAG;
4. evaluate the now-certified finite cubic endpoint cores and enclose their
   correlated centers before taking a modulus;
5. certify the outside-core endpoint tail, nonstationary Poisson frequencies,
   transformed bulk, scalar/cross-chart terms, seam centers and half-jumps;
6. extend the first-window vertical real-attenuation atlas across all selector
   windows, including the initial partial window; and
7. replay the recombined result with literal nesting at 160, 192, and 256 bits.

The event DAG solves endpoint state explosion.  The finite declared endpoint
core now has an exact discrete cubic kernel (zero stationary-approximation
remainder) and a uniform log-to-cubic charge below `3e-5`.  The first complete
selector window also has a stable vertical-gamma/ladder transport theorem.
Neither result encloses the correlated center or complementary bulk, so the
uniform recombination margin remains missing.

## Replay

From the bundle root:

```bash
python3 lambda_014_parked_tube_v1/verify_contract.py
python3 lambda_014_parked_tube_v1/test_fail_closed.py
python3 p19_swept_family_v1/verify_p19_swept_family.py
python3 p19_swept_family_v1/verify_p19_swept_family.py --fresh --jobs 8
bash early_p97_strategy/verify.sh
bash optimized_mollifier_search/verify.sh
bash early_p97_packet_theory_v1/verify.sh
bash early_p97_airy_kernel_v1/verify.sh
bash early_p97_vertical_v1/verify.sh --replay
```

The required global terminal state remains

```text
P19_LATE_FAMILY_MANTLE_CERTIFIED true
CORRELATED_PREHANDOFF_MANTLE_CERTIFIED false
SWEPT_TUBE_NONVANISHING false
LAMBDA_LE_7_OVER_50 false
```
