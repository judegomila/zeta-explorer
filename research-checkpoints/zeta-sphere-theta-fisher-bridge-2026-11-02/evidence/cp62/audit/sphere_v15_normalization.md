# Sphere v15 normalization audit for CP62

Status: PASS for source integrity, normalization and exact chaining of supplied bounds. The numerical theorems are imported with their supplied independent audits; no Arb/DFT, Euler–Maclaurin or other acquired producer was run here. Both CP61 compact byte pins remain unchanged.

## Exact source and variables

The v15 archive has 4,062,261 bytes and SHA256 `cbb9e402553adaa5de6b9ef76f82ca53765fcd7307a1263ebdc7eb768db3e57c`. All 483 members passed CRC, all 481 JSON manifest records and all 481 SHA records matched. Selected extracted bodies also matched their archived bytes. Exact member hashes are in the companion receipt.

| Source notation | CP61 meaning |
|---|---|
| t=7005081715/1000000 | Frequency nu=7005.081715; never the heat time |
| Fourier argument 2t | x=2nu=14010.163430 |
| H=1 | Spatial integration cutoff; not the entire heat function H(tau,z) |
| a=0 or a=1/10000 | Normalized sphere shift; physical height y=2a |
| y=pi/4-2/t in the DFT proof | Auxiliary contour height in the profile variable; denote it eta to distinguish physical y |
| Heat deformation | tau=0 for both v15 certified witnesses |

Use the same full even profile psi and Fourier convention `hat f(x)=integral f(v) exp(-ixv) dv`. The local normalized spatial tail is

\[
 K_{a,0}^{\ge H}(v)=\int_H^\infty\frac{h\sinh(2ah)}a
                   \psi(h-v)\psi(h+v)\,dh,
\]

with removable limit

\[
 K_{0,0}^{\ge H}(v)=F_H(v)=\int_H^\infty2h^2\psi(h-v)\psi(h+v)\,dh.
\]

These are exactly the definitions in the two original v15 proofs. In particular, the positive-shift proof's `T_(a,H)` is **already normalized by a**. The v15 index writes an extra `/a` in its synopsis without defining that symbol consistently. The proof definition, normalized certificate field and independent audit govern the import: do not divide the normalized tail by a a second time.

## Scalar source and physical conversion

The profile normalization is `integral_R psi(u) exp(i nu u) du = 2 Xi(nu)`. Extending the h integral evenly and setting u=h-v, w=h+v gives Jacobian1/2 and h^2=(u+w)^2/4. Hence

\[
 \widehat F_0(2\nu)=\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu).
\]

For a>0, the full normalized transform is

\[
 \widehat K_{a,0}(2\nu)=\frac1{2a}\partial_a|\Xi(\nu+ia)|^2
 =\frac{G}{a}\left[\frac b2|\zeta|^2+\Re(\zeta'\overline\zeta)\right],
\]

where s=1/2+a+i nu, G=|Q(s)|^2 and b=partial_a log G. This matches the positive-shift audit and its `full_normalized_scaled_interval`. It is not a sigma-second derivative at positive a. The a=0 limit is half that second derivative.

CP61 has `H(0,z)=Xi(z/2)/8`, `S=D_y/2=hat C/128`, and a=y/2. For the tail contribution defined by the shared-full-denominator split,

\[
 S_{\ge H}(x,y)=\frac{a}{128}\widehat K_{a,0}^{\ge H}(x),
 \qquad \frac{S_{\ge H}(x,y)}y=\frac1{256}\widehat K_{a,0}^{\ge H}(x).
\]

At a=0 the last expression is a removable limit; the unnormalized S itself vanishes at y=0. No sign for the complete logarithmic curvature, quotient derivative, covariance or physical form follows from this component sign.

## Certified inequalities now source-bound

The supplied a=0 core and full-side audits give enclosing integers

\[
 e^{\pi\nu/2}\widehat C_1(2\nu)>56962777800000,
 \qquad e^{\pi\nu/2}\widehat F_0(2\nu)<3195886054651.
\]

Their exact difference is

\[
 e^{\pi\nu/2}\widehat K_{0,0}^{\ge1}(2\nu)<-53766891745349.
\]

At a=1/10000 the normalized full side is below3197245160046 and the absolute normalized core change is below2046593363087 on the same scale. Thus

\[
 e^{\pi\nu/2}\widehat K_{1/10000,0}^{\ge1}(2\nu)
 <-51718939276867.
\]

The physical boundary location is x=2nu,y=1/5000,tau=0. The corresponding scaled `S_tail/y` bounds have the same negative constants divided by256. The JSON `positive_shift_tail_upper_interval` encloses an upper-bound expression, not a two-sided enclosure of the actual tail. Only its upper endpoint is used. Local work checked the exact decimal/rational chains and normalization, not the numerical theta computation.

The archive also supplies the exponential-moment/polynomial-density argument: a negative open Fourier interval forces failure of some finite cumulative-tail moment block. This existence statement identifies no degree, basis vector or margin. It does not refute the full bridge or its positive full-side value at this frequency, the fixed H=1/16 results, RH, or the positive-time phase theorems whose time gates exclude tau=0. Positive shift a is not positive heat time.

## Finite degree19 source availability

The archive scan corrects an initial availability assumption: `core_inertia_v2/FULL_SPLIT_PROOF.md`, its certificate, and `full_split_audit/AUDIT.md` are present in v15. They concern the complete10x10 **odd** moment block at normalized a=0, with spatial split H=1/16 and fixed rational congruences. They do not establish the even block, full H19, nonzero shifts, positive heat or all-degree positivity. Their reported LDL pivots are coordinate pivots, not invariant eigenvalue lower bounds. No new continuation margin or scaling is inferred here. A stronger newly reported anchor or pending replacement framework still requires its own exact source and gates.

The finite H5 and degree-dependent outer theorem keep their original scopes. Universal all-H/all-order tail positivity is unavailable. Any joint core/tail argument must retain its actual complete lower inverse, all mixed columns, exceptional terms and signed boundary feedback.
