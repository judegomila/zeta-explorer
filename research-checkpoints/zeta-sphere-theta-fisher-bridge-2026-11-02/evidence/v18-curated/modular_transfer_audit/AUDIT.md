# Corrected completed-head transfer: independent analytic audit

2 November 2026. PASS including normalized small-shift extension. This bounds an actual full-theta target remainder; positivity of the finite corrected head is not proved.

## Euler–Maclaurin and derivative constants

The head includes n=N, so its half endpoint is -N^-z/2. Repeated integration of the periodic Bernoulli remainder gives the displayed negative sign and factor (z)_(2m)/(2m)! in the exact remainder. The Bernoulli Fourier series gives supremum <=2 zeta(2m)/(2pi)^(2m). Integrating x^(-sigma-2m) and its first two logarithmic moments yields exactly e, e1 and e2. For the rising factorial, the first logarithmic derivative is sum 1/(z+r); the second derivative is bounded by S1²+S2. Combining product and integral derivatives gives e2=e[(S1+log N+1/D)²+S2+1/D²]. The band avoids every factorial zero and pole needed in these formulas.

Checked primary representations at NIST DLMF https://dlmf.nist.gov/25.11.iii and the Bernoulli series https://dlmf.nist.gov/24.8.E1; independently derived the endpoint and repeated-integration convention.

With N=ceil T, 2m+1<=T, delta<=sigma<=1 and T<=|t|<=2T, every |z+r|<=3N. Since 2zeta(2m)<4, the stated bound 4(T+1)^(1-delta)[3/(2pi)]^(2m)/(delta+2m-1) follows. The reciprocal-factor sum is <=2m/T. The logarithmic correction count yields arbitrary polynomial accuracy for e,e1, and after absorbing log² T also e2. This is absolute approximation, valid near zeros; no division by zeta or the head occurs.

## Actual spectral and matrix transfer

The exact box/head difference includes omitted small integers, subtracts overincluded large box integers, and retains the analytic-continuation boundary corrections. Its size or sign is not bounded by the Euler-box positivity theorem.

The gamma logarithmic derivative b_G is correct. Expanding zeta=H+R and zeta'=H'+R' gives every term of E: |b_G|(2|H|e+e²)/2, |H'|e, |H|e1 and ee1. The one-sided bridge density has the required factor one half. The two-sided derivative difference has factor one quarter because the completed modulus is even in shift.

For W=G(|zeta|²-|H|²), the second derivative error E2 has the exact coefficients: G'' contributes |b²+b'|(2|H|e+e²); twice G' times the first modulus derivative gives 4|b| times its three cross bounds; the remaining terms are twice the derivative-square difference and twice the second-derivative cross difference. All terms are included with correct signs replaced by absolute bounds.

For the symmetric head, (W'(a)-W'(-a))/(4a) is bounded by (1/2) sup_|s|<=a G_s E2_s. This preserves the a->0 cancellation and extends continuously to the normalized endpoint for fixed head parameters. It does not divide a fixed one-sided error by a. The two-sided domain requires 0<a<=1/2-delta with fixed delta>0.

On the frequency band 2T<=|k|<=4T, the nonnegative envelope density G_a(k/2)E(k/2) gives precisely the quadratic-form allowance with inverse-Fourier factor 1/(2pi). Multiplication by an exponential-polynomial or jet polynomial is integrable on the bounded band, so both node and jet Loewner envelopes follow. The normalized envelope uses the corresponding supremum from E2.

This is a bandwise absolute allowance on the natural gamma scale. It is not a uniform positive relative gap against a signed head, and not a proof that the corrected head dominates the allowance at every height or shift. Neither the density-one Euler-box theorem nor its unmatched remainder may substitute for that missing sign inequality.

The added spatial tau_A grouping also checks: the theta sum of n^-1/2 f(u+log n) is locally uniform on every compact real-u set, so finite A subtraction is exact. Expanding the full products yields the stated cross-integral identity. The warning against interchanging the unbounded negative-h integral with an absolutely summed orbit series is necessary and retained; the spectral remainder proof does not rely on that interchange.
