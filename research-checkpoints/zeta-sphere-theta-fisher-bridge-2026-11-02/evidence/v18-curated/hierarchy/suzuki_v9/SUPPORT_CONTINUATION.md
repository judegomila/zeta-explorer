# Substantial finite-support extension by a singularity-aware linear block certificate

Status: completed certificate; independent analytic/code audit and enlarged-entry interval-Cholesky replay PASS. Review: ../../relative_tail_v6/suzuki_v9_review/REVIEW.md. V8 is preserved unchanged. Literature scope is audited separately in LITERATURE_SCOPE.md; no novelty claim is made.

## Target and mechanism

At omega=2/5 take

    R=(16/15)log2,  A=exp(R/2)=2^(8/15), A²=2^(16/15)≈2.09459.

This traverses a nonzero portion of the second arithmetic interval, rather than a microscopic increment beyond A²=2. The same finite kernel and logarithmic normalization as v8 apply. Only n=1,2 occur. The certified base norm is rho=.99995; the omega-parameter bound from v8 gives rho=.99996 on [.39999999,.40000001], with inverse norm25000. The weaker resolvent margin reflects support growth; no support-independent gap is assumed.

Two structural changes make the larger support tractable:

1. The newly active positive decreasing n=2 kernel has translation modulus2c2 Qprim(h), not twice its entire mass. This prevents the high-block bound from becoming useless as the new arithmetic interval grows.
2. Approximate HP by continuous piecewise-linear functions, integrating their Gram matrix exactly. Treat the fractional r^(2/5) term analytically at every activation; curvature controls the rest. This greatly reduces the residual error compared with v8's monotone step-function approximation.

## 1. High block and finite Schur test

Use n=256 coarse cells, h=R/n, and m=2^22 fine cells, dx=R/m. Both log2=(15/16)R and the coarse breakpoints align exactly with the fine grid. The projection P remains coarse-cell constants, Q=I−P. The same signed block criterion from v8 holds:

    ||QHQ||≤d<rho and rho I±PHP−PHQHP/(rho−d)≥0
      imply ||H||≤rho.

The n=1 monotone-kernel translation bound is2Qprim(h)+2h|q(R)|, with q(R−h)<0 verified. The n=2 portion has length delta=R−log2=R/16 and q>0 on[0,delta], verified both by an endpoint enclosure and monotonicity. Since h<delta, the L1 translation modulus of q restricted to[0,delta] is exactly2Qprim(h). Thus

    ||QH||≤2(1+c2)Qprim(h)+2h|q(R)|<.638=d.

This is an explicit arithmetic-threshold budget and does not discard the signed n=1 gamma cancellation in the low block.

## 2. Linear residual approximation and exact finite Gram

For each coarse indicator use the exact image V_j given in v8 by differences of Qprim. On each fine cell let Vl,Vr be its endpoint vectors and set Vhat to their linear interpolant. Then the exact finite matrices are

    Ahat=P Vhat,
    S=integral Vhat*Vhat
      =sum_cells dx[(Vl+Vr)*(Vl+Vr)/4 +(Vr−Vl)*(Vr−Vl)/12],
    Ghat=S−Ahat* Ahat.

Here vector products mean outer products with consistent row/column convention. Ahat uses the endpoint average exactly. No quadrature error enters these formulas for Vhat; all approximation is in V−Vhat.

Put w=2/5, c=(2pi)^w/Gamma(w), K=c/w and D=(13/2)c/(w+1). The elementary q1,q2 bounds from v8 give

    |Qprim(r)−K r^w|≤D r^(w+1), 0≤r≤1,
    |q'(r)|≤c[(1−w)r^(w−2)+(5/2+w)r^(w−1)+.4], 0<r≤1.  (1)

For the first inequality, q1/(c r^(w−1)) lies between exp(−(5/2−w)r) and exp(−(1/2+w)r), hence its difference from1 is at most(5/2−w)r; q2≤4c r^w. Integrate their sum. For the second, use q2'=(1/2−w)q2+2wq1 and2/(e^(2r)−1)≤1/r. These are absolute estimates, not sign assumptions on the unknown norm.

At an activation cell, the leading fractional interpolation errors have exact moments

    integral_0^1 (x^w−x)²dx=1/18,
    integral_0^1 (x^w−x)dx=3/14.

The remainder in(1) contributes at most2D dx^(w+1) pointwise. Thus the cell L2 and L1 interpolation errors for a single Qprim component are bounded respectively by

    s2=K dx^(w+1/2)/sqrt18 +2D dx^(w+3/2),
    s1=K dx^(w+1)(3/14)+2D dx^(w+2).

For any other cell whose left argument is ell*dx>0, the linear interpolation remainder is at most dx² sup|q'|/8. Using(1), summing squared bounds and the inequalities sum ell^(−s)≤1+1/(s−1), s>1, yields the following bound for the L2 norm of the sequence of nonsingular cell errors:

    b2=(c dx^(w+1/2)/8)[.6sqrt(1+1/2.2)
                         +2.9dx sqrt6 +.4dx^1.6 sqrt(m)].

For its L1 sum use

    b1=(c dx^(w+1)/8)[.6(1+1/.6)
          +2.9dx(1+(m^.4−1)/.4)+.4dx^1.6 m].

These overestimate the finite sums and therefore need no floating summation of singular samples.

Each basis image has two primitive components whose error sequences are shifted by M=m/n fine cells. Their supports are not disjoint; the overlap is retained as follows. Let

    eM=(c dx^(5/2)/8)[.6h^(−1.6)+2.9h^(−.6)+.4],
    overlap=eM(s2+b1/sqrt(dx)).

The nonsingular error sequence decreases. Thus sum_(ell≥0)e_ell e_(ell+M)≤eM sum e_ell≤overlap. Minkowski and the support count give

    e0=sqrt(n/h)*sqrt(2(s2²+b2²)+2overlap),
    ||HP−Vhat||_HS≤e0(1+c2/4).

The factor1/4 is sqrt((n/16)/n): only the last16 of256 coarse columns can contain the new n=2 component. The two primitive contributions are bounded separately, without assuming cancellation. For the coarse matrix error, the fine indices from distinct columns cover disjoint consecutive ranges; each positive error index occurs at most twice. Hence

    ||PHP−Ahat||≤2(1+c2)(s1+b1)/h.

Both induced1 and infinity matrix norms obey that bound. This avoids an unnecessary factor n in the low-block error.

## 3. Certified numeric budgets

The generator support_linear_probe.py constructs endpoint candidates and the exact linear Gram matrices. certify_support.py independently compares every endpoint candidate with the elementary beta-polynomial representation validated in v8, now using r<.75,z<.78. The128-term beta-series tail is still<10^−15; degree30 exponential polynomials are valid on |argument|≤1.6. The positive fifth-root candidate is checked by its multiplication residual. No correctness of SciPy beta/gamma evaluations is assumed: all4,194,305 candidate endpoints are compared against the separately controlled elementary representation.

The resulting primitive allowance is10^−9. Since h>.0028, each basis-image endpoint error is<10^−7. It changes the HP Hilbert–Schmidt error by at most sqrt(nR)10^−7<1.4×10^−6 and the coarse-matrix norm by at most n sqrt(h)10^−7<1.4×10^−6. The code reserves2×10^−6 for each.

The analytic interval arithmetic gives the conservative rounded bounds

    e=.00022, ae=.000003, ||Rhat||≤.1,
    ge=2(.1)e+e²+2×10^−7.

The last allowance covers Gram accumulation rounding. The reconstructed diagonal of S is checked below.064, so Cauchy–Schwarz bounds absolute product sums; even a gamma_(4m) binary64 accumulation estimate gives a row-sum error well below2×10^−7 for256 rows. Products used in Ahat* Ahat and serialization fit within the same reserve. These retain the same stated IEEE/basic-arithmetic and mpmath.iv implementation assumptions as v8, rather than claiming a hardware-formal proof.

With rho=.99995,d=.638, E=.00014, interval arithmetic verifies

    ae+ge/(rho−d)<E.

The final tests are positive definiteness of

    (rho−E)I±Ahat−Ghat/(rho−d),

with every stored entry inflated by10^−10, using50-digit interval Cholesky. The data file records all constants, endpoint comparison residuals, and hashes of the generator and matrix data.

## Scope and continuation

The completed certificate proves the finite support bound at A=2^(8/15) and hence all smaller A by compression. The existing uniform L1 omega-derivative budget1000 on [.39,.41],R≤1 then extends the norm by at most10^−5 over omega∈[.39999999,.40000001]. Thus the final uniform norm is.99996 and the resolvent bound25000.

This is a support-dependent finite theorem. Beyond R=log3 a new shifted singular term must be added and its coefficient/translation/residual budgets recomputed. Even before that point, the signed finite matrices may lose their current margins. There is no claim that these budgets or a spectral gap persist uniformly with support. The method neither supplies a determinant-class theorem for w<1/2 nor identifies its finite contractions with global C_a positivity.

## Completed run

The final exact-generator replay checks all4,194,305 endpoint values with maximum candidate-to-polynomial difference2.708944180085382e−14. Generator log2 and c2 agree with interval-centered constants to less than10^−15. The analytic residual upper bounds are e<.000218598374716238 and ae<.000002234618833647114. The two50-digit interval-Cholesky minimum pivots are greater than.59312677235 and.84303299449. An independent replay with slightly enlarged entry radii also passed. These establish the finite theorem under the explicitly stated arithmetic implementation assumptions. Files frozen after review; no all-support or RH claim.
