# Long-window Fejér reduction for the early P97 smooth tail

> **Status (29 August 2026): this is not a proof of** \(\Lambda\le0.14\).
>
> This note proves the uniform coefficient-energy estimate and an exact
> long-window reduction of the remaining early-bottom theorem. The resulting
> signed correlation inequality remains open. Both vertical faces and every
> global promotion flag remain open.

This is a documentation-only research note. It changes no MathExplorer page,
route, runtime dependency, build step, CI job, public asset, or deployment
surface.

## Imported prefix theorem

For

\[
690988\le N\le14999999,
\]

the directed P97 prefix computation gives

\[
\Re P_{100}>0.26842844879751026.
\]

After the complete transfer radius \(<1/50000\), it is sufficient to prove

\[
|T_{100,N}|<\frac14,
\]

where

\[
T_{100,N}=A_{97}(s_B)
\left\{\sum_{101\le n\le N}b_nn^{-s_B}
+\gamma\sum_{101\le n\le N}b_nn^{-s_A^{(0)}}\right\}.
\]

The primary and reflected channels and the P97 multiplier remain recombined
before any modulus.

## Certified coefficient energy

Write

\[
T_{100,N}=\sum_{j=1}^{L}z_j,\qquad L=N-100.
\]

A directed geometric-block producer, replayed at 160, 192, and 256 bits,
proves uniformly on the moving bottom

\[
\sum_{j=1}^{L}|z_j|^2
<0.007656512312157
<\frac{43}{5600}.
\]

It also proves the auxiliary \(\ell^1\) envelope \(<56\). The energy
estimate contains the PP, RR, PR, and RP contributions because each \(z_j\)
is already the recombined twin-ladder atom.

## Exact Fejér identity

Extend \(z_j\) by zero outside \(1\le j\le L\). For
\(1\le K\le L\), put

\[
C_r=\sum_{j=1}^{L-r}z_{j+r}\overline{z_j}.
\]

Cauchy--Schwarz applied to the translated length-\(K\) windows gives

\[
\left|\sum_{j=1}^{L}z_j\right|^2
\le\frac{L+K-1}{K}
\left\{
\sum_{j=1}^{L}|z_j|^2+
\frac2K\Re\sum_{r=1}^{K-1}(K-r)C_r
\right\}.
\]

The active choice is \(K=L\), whose prefactor is \(2-1/L<2\). Therefore
the single strict estimate

\[
\boxed{
\frac2L\Re\sum_{r=1}^{L-1}(L-r)
\sum_{j=1}^{L-r}z_{j+r}\overline{z_j}<\frac1{43}}
\]

implies

\[
|T_{100,N}|^2
<2\left(\frac{43}{5600}+\frac1{43}\right)
<\frac1{16}.
\]

Thus it implies the required quarter-tail theorem.

The signed correlation has the equivalent linear-time form

\[
\frac1L\sum_{m=1}^{2L-1}
\left|
\sum_{j=\max(1,m-L+1)}^{\min(L,m)}z_j
\right|^2
-\sum_{j=1}^{L}|z_j|^2.
\]

This is an average prefix/suffix partial-sum energy minus the diagonal. It is
the correct target for a mean-square B/Fresnel--Airy transform or a rigorous
large-sieve estimate.

## Improvement over the short-window contract

The earlier provisional choice \(K\approx L/6\) required a signed
correlation below \(1/800\). The exact long-window choice relaxes the
allowance to \(1/43\), more than eighteenfold.

Noncertifying resonance probes retained all four correlation channels. Near
\(N=5{,}000{,}000\), the largest tested signed Fejér correlation was about

\[
0.00141,
\]

versus

\[
\frac1{43}\approx0.02326.
\]

The probes show narrow rational-phase resonances, especially near
\(q\bmod1=1/2\) and \(3/4\). They suggest splitting a finite collection
of resonance arcs from a nonstationary complement. They are route-selection
diagnostics only and are not interval evidence.

## Remaining theorem

The bottom closes only after the boxed \(1/43\) inequality is proved
uniformly over:

1. every selector \(690988\le N\le14999999\);
2. both closed one-sided charts at every selector seam;
3. the exact Polymath exponent and gamma balls; and
4. outward-rounded PP, RR, PR, and RP recombination.

The vertical atlas proves coefficient contraction and phase drift below
\(5.737\times10^{-13}\), but the finite-prefix support and the correlation
gate still require a full height-uniform argument on both vertical faces.

The fail-closed state is

~~~text
SMOOTH_TAIL_ENERGY_CERTIFIED true
FEJER_WINDOW_CHOICE K=L
SIGNED_AUTOCORRELATION_LT_1_OVER_43 false
EARLY_P97_BOTTOM_CERTIFIED false
EARLY_P97_VERTICALS_CERTIFIED false
CORRELATED_PREHANDOFF_MANTLE_CERTIFIED false
SWEPT_TUBE_NONVANISHING false
LAMBDA_LE_7_OVER_50 false
~~~

## Replay binding

The local source package is
`early_p97_smooth_tail_analysis_v1`. Its principal SHA-256 roots are:

| Object | SHA-256 |
|---|---|
| theorem note | `2c6dd0102210672ff319b37fc7cdeea9ebcad91d3593b9517736c4d49736ed47` |
| directed energy producer | `f00badb7a14c203383e7132c17402983c875bd2373f7f5b203dfc57e49c9d220` |
| fail-closed verifier | `bd6fdce788a9ac48a42c8410f5b617111951c5354eb965bdb2ba399abb98a6b9` |
| 160-bit transcript | `791b020bfc47daecd9538756400dd9c8e8cdb2593b4c44fd87b25937990da95f` |
| 192-bit transcript | `9a5d417c92050e254fa27ef6ccc83a05a518216216c2a2c39e22ddda5be6ffe5` |
| 256-bit transcript | `995aa519005dcfaf5046f80992f1ada5a98d20306d742363229f9d4ab80a4710` |

Replay:

~~~bash
cd early_p97_smooth_tail_analysis_v1
sha256sum -c SHA256SUMS
bash verify.sh
~~~
