# Both proposed separate aggregate signs fail for actual theta residuals

Independent numerical and analytic review PASS. These are targeted countertests at already-known rungs, not a ladder extension.

Use the reviewed exact decomposition
 h[p]=4pi Y[p]+2pi L²D[p],
 D[p]=sum_(m>=1)m q^m C_m[p], L=log2, q=1/sqrt2.
The actual residual coefficients, prefix inverses, and original odd-tail cost are unchanged.

## 1. Exact oscillatory multiplier, with no continuation of inequalities

Let F=hat(psi), theta=Lt, and B=|1-sqrt2 exp(i theta)|². Absolute convergence of sum m q^m permits Parseval term by term:
 D[p]=(1/(2pi))integral p(t)²F(t)² M(theta)dt,
 M(theta)=[q(1+q²)cos(theta)-2q²]/[1-2q cos(theta)+q²]².
In particular M changes sign at cos(theta)=2sqrt2/3. This formula retains the actual inverse-selected p; it does not replace it with an arbitrary test polynomial or parent norm.

The remaining aggregate is exactly
 4pi Y[p]=integral p²[Lambda-L²M F²].                       (1)
There is also a precise filtered interpretation. Put a=1-c exp(i theta), c=sqrt2, H=aF and
 omega(t)=Im(a'/a)=L c(c-cos(theta))/B.
For the reviewed W_H=|H'|²-Re(H''conj(H)),
 kappa+L²M=2omega²,
 4pi Y[p]=integral p²[W_H/B-2omega² F²].                  (2)
The mixed FF' terms cancel as before. These identities are nonsingular at zeros of F: omega is defined from a, which never vanishes on the real axis. Away from zeros, the integrand in (1) equals minus F² times the real second derivative of log H. This last description is optional intuition, not a prescription to integrate a singular logarithm.

Thus the low signed aggregate is a genuine phase-energy subtraction from the filtered form. Filtered positivity does not prove Y>=0. Neither M nor the phase-energy-subtracted form has a free positivity claim.

## 2. Actual counterexamples, including all tails

`certify_initial_dyadic_signs.py` uses the already audited 160-bit Arb midpoint method with6000 cells on w in[0,3], j=1,...,63. Same second-derivative, spatial-tail and arithmetic-tail bounds as LOW_SHIFT_EVALUATION.md, now with:
- odd0: p(t)=t, operator -D_r²/4, K=2. No source file is opened and no Gram entry or inverse is required.
- even1: p(t)=t²-alpha, alpha=(47G00+66G01)/(4G00), operator alpha²+(alpha/2)D_r²+D_r4/16, K=4. Only G00 and G01 are used; this is the actual one-dimensional old-prefix projection, not an arbitrary positive-root polynomial.

The degree-only sign cutoff64 is valid in both cases. The negative odd arithmetic tail is explicitly paid. The weighted dyadic tail uses the previously reviewed bound, equal at J64 to7/15 of the eta-tail envelope.

`check_initial_aggregate_signs.py` produces rigorous coarse enclosures:

odd0:
  -9.888541 < 2pi L²D < -9.888532,
  1.156176 < Y < 1.156180,
  4.640410 < h < 4.640434.
Hence **D>=0 is false for an actual odd residual**, even the first one. The positive remaining aggregate pays the negative dyadic component.

even1:
  181.12088 < 2pi L²D < 189.83808,
  -6.886113 < Y < -5.668058,
  103.30463 < h < 109.89397.
Hence **Y>=0 is false for an actual even inverse-selected residual**. The positive dyadic component pays the negative remaining aggregate.

The interval widths include current coefficient uncertainty, midpoint errors, omitted spatial integrals and the full arithmetic/dyadic remainders. These are actual-theta counterexamples to the stronger component signs, not counterexamples to h>0 or RH.

## 3. Consequence for a uniform route

Previously evaluated odd1 and even2 happened to have both aggregates positive. The present smaller-rung counterexamples show why those finite successes cannot define an induction hypothesis. Any viable aggregate theorem must allow the compensating component to switch between parity and degree.

Equations(1)-(2) give an exact common-integrand formulation with the actual p retained. They do not supply the required correlated lower bound. Requiring Y>-(L²/2)D without a separate theta-specific estimate is exactly h>0 rewritten and is circular as a proof strategy. No uniform estimate of the compensation margin is established here.
