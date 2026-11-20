# Noncircular correlated whole-interval recovery with an actual-inverse error budget

This packet combines moving bulk, mixed inverse term, and endpoint flux derivative before estimating. It gives a general conditional quadrature inequality and fresh complete-theta verification of both existing finite recovery examples. It reads no previous target gain and no integrated target moment for either optimizer. It is not an all-degree positivity result.

## 1. Exact correlated derivatives

Write the actual local full target density as
 W(H)=[[L(H),l(H)],[l(H)^T,d(H)]],
and integrated old block A with A'=L, integrated cross b with b'=l. Set z=-A^-1b, v=(z,1), r=Lz+l, t=L'z+l'. Wherever A>0,
 S'=v^TWv,
 S''=v^TW'v-2r^TA^-1r,
 S'''=v^TW''v-6t^TA^-1r+6(A^-1r)^TL(A^-1r).             (1)
Proof: z'=-A^-1r, r'=t-LA^-1r, and (A^-1)'=-A^-1LA^-1. Differentiating S'' gives the coefficients-6 and+6 in(1). No sign is assigned to W, d, t^TA^-1r, or the target Schur value. Local old positivity is not required for this derivative identity.

This S' is exactly beta+mixed+the total derivative of Phi in the reviewed source-flux identity. Combining them before interval estimation preserves cancellations that were lost in the earlier separate-term full-interval quadrature.

## 2. Explicit actual-conditioning error bound

For a cell of width w, suppose A>=lambda I with lambda>0, ||b||<=B, and ||W^(j)||<=J_j for j=0,1,2, all on the cell. These are bounds on the actual old/cross data and the full-theta local source, not on an auxiliary parent or unknown integrated target pivot. Let V²=1+B²/lambda². Then
 |S'''|<=V²[J2+6J0 J1/lambda+6J0³/lambda²].              (2)
This follows from ||v||<=V, ||r||<=J0 V, ||t||<=J1 V, ||L||<=J0. For a physical polynomial of degree d, W'' uses theta derivatives only through order2d+2.

Consequently a noncircular finite-width lower test is
 S(b)-S(a)>=sum_cells w*(certified lower S'(midpoint))
               -sum_cells w³ sup|S'''|/24.              (3)
The actual implementation evaluates(1) by interval matrix/LDL operations rather than substituting the coarser norm estimate(2). Formula(2) exposes the conditioning cost: its worst displayed inverse dependence is lambda^-4. It gives an error budget, not a positive lower bound for the main signed sum. No degree-uniform lambda or source-sign estimate has been obtained.

## 3. Full-theta certified implementation

The owned `check_midpoint_recovery_flow.py` uses192bits and16000 cells on[1/8,1/2]. Initial old/cross moments come from the independently reviewed compact-core1000-cell calculation. Odd7 uses M1..M6, and even6 uses M0..M5. Their respective top target integrals M7 and M6 are not inputs. M6 is propagated jointly only because it is an old/cross input for odd7; it does not enter the even6 inverse.

For a cell starting at a with midpoint m and width w:
1. Enclose each moment at every point using the signed increment hull[w min(0,qlo),w max(0,qhi)] for its full-theta local density. Verify the actual old block positive throughout the cell by interval LDL.
2. Enclose the true midpoint moment using the half-cell midpoint rule: (w/2) times density at a+w/4, with error at most(w/2)^3 sup|density''|/24. The inherited endpoint interval errors remain present.
3. Evaluate S'(m) from the actual midpoint optimizer. For stability the checked positive local old matrix at that midpoint permits S'=s_local+(z-z_local)^TL(z-z_local). The local target remainder stays signed. No interval-wide or all-degree local positivity assumption is used.
4. Enclose(1) on the whole cell using the actual path inverse and density derivatives through order16. Add the rigorous w³ sup|S'''|/24 midpoint error.
5. Propagate the old/cross endpoint moments by their full-cell midpoint rules and second-derivative errors.

The first local-density derivative is w_weight' g_j+w_weight g_j'; the second derivative and full-orbit error bounds are the previously reviewed complete-theta derivative16 implementation. All arithmetic-orbit tails are retained. There is no missing spatial tail because the integration domain is the specified finite recovery interval.

## 4. Fresh noncircular results

All values are in h/(4pi) units. Independently replayable directed results:
- Even6: S(1/2)-S(1/8)>47,324,928; total explicit midpoint quadrature error<25.568.
- Odd7: S(1/2)-S(1/8)>4,064,774,311; total explicit midpoint quadrature error<23,811,212.

All actual old-path LDL pivots remain positive. The errors in midpoint moment/coefficient enclosures are also retained in the result; the listed quadrature-error totals alone are not the complete interval widths.

These gains are freshly proved by the signed flow computation and do not reuse previously certified gains. If one additionally uses the previously certified starting-core bounds s_even6>-743414 and s_odd7>-347755655, the new flow estimate gives final cores>46,581,514 and>3,717,018,656, respectively. Those initial conditions are explicitly separate inputs to this last consequence; they are not needed for the fresh gain assertions.

This reproduces existing finite recovery at these degrees through a different correlated mechanism. It is not a ladder extension. The even6 initial negative derivative is retained, not discarded or replaced by monotonicity.

## 5. Limits and preserved unsuccessful attempts

A coarser16000-cell rectangle source calculation could not certify its local-old inverse enclosure and stopped; this is not a mathematical indefinite-matrix counterexample. A64000-cell rectangle attempt returned a positive even6 lower enclosure but remained inconclusive for odd7. It is retained as an unreviewed diagnostic, not an input to this proof. Both attempts are preserved separately. The present midpoint proof succeeds by controlling the exact correlated derivative's error, not by reclassifying those wide intervals as positive.

The kinetic companion gives a conditional positive action when L>0, but its endpoint Cauchy lower bound equals the already-known finite merge correction. There is no free new reserve. Uniform closure still needs a degree-dependent positive lower bound for the signed sum in(3), compatible old-path metrics, and control of the actual inverse-conditioning cost. The success of these finite calculations does not establish those conditions at growing degree.
