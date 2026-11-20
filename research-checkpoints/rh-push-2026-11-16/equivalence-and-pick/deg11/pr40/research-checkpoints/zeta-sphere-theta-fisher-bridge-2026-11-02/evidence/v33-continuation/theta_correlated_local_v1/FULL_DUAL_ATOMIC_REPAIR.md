# Exact repair of every cross moment in an atomic dual candidate

Status: independent analytical review PASS. This is a sufficient negative-witness test, not a claim that the test succeeds for the current theta residual.

## 1. Candidate and genuine full constraints

Fix the actual selected prefix at a critical shift where the old block is known positive. Use either the original local pair (f,z) or the parity-weighted pair (F,Z), consistently throughout. Write them as (f,z) below, with z in R^N. The optimized dual requires E_nu z=0 in every component, not only E_nu(c^Tz)=0.

Let nu0 be a finite positive probability measure on actual theta points with
F0=E_(nu0)f<0, r=E_(nu0)z.
If r=0 it is already a valid negative witness. Suppose r!=0. Choose a finite reservoir of points u_j such that
conv{z(u_j)} contains the Euclidean ball of radius delta>0 centered at zero,
and let Fmax=max_j f(u_j).
These are finite independently checkable geometric and local-evaluation conditions. They do not use the next integrated target moment.

## 2. Exact full repair and cost

By the convex-ball condition a positive reservoir probability tau exists with
E_tau z=-delta r/||r||.
Define

nu=delta/(delta+||r||) nu0 + ||r||/(delta+||r||) tau.

This is a positive probability measure and E_nu z=0 EXACTLY in all N components. Its objective satisfies

E_nu f <= [delta F0+||r||Fmax]/[delta+||r||].                (1)

Therefore the strict inequality

delta F0+||r||Fmax<0                                      (2)

is a sufficient, noncircular certificate of negative optimized dual margin. It explicitly pays the multidimensional cross-moment repair. Scalar cancellation or a small single residual component cannot substitute for (2).

The union of the candidate and reservoir supports is finite. Minimize f over its nonnegative weights with normalization one and all N means zero. This finite feasible compact linear program has a negative optimal value if (2) holds, and an extreme optimal solution supported on at most N+1 points. Thus the repaired witness can be compressed to the required atomic size without increasing its objective. No uncontrolled signed weights or target-pivot assumption enter this compression.

## 3. An explicit finite test for the reservoir ball

Let Z be the N-by-M matrix whose columns are z(u_j). Suppose exact weights w0>0 satisfy 1^T w0=1 and Z w0=0. Let R be any M-by-N right inverse satisfying
1^T R=0, ZR=I_N.
Such an R exists if the augmented matrix with rows 1^T and Z has full row rank. For example it is obtained by multiplying its transpose by the inverse of its row Gram matrix and the block column (0;I_N). This is only a finite geometric matrix, not a replacement for the true signed prefix inverse.

For each nonzero row R_j set delta_j=w0_j/||R_j||, and choose
0<delta<=min_(R_j!=0) delta_j.
Then for every ||y||<=delta the weights w(y)=w0+Ry are nonnegative, sum to one, and satisfy Zw(y)=y. Thus this delta rigorously verifies the required convex-ball containment. Exact interval bounds on the weights, row norms and inverses can certify a strict conservative delta. Any invertible change of cross-moment coordinates may be used consistently; it does not remove the repair cost.

## 4. What exact selection supplies, and what remains unpaid

The actual positive spatial reference measure has zero cross means by inverse selection. The full-theta leading powers make the cross functions independent, and the reference measure is positive on every positive-u interval. The already audited selected-dual argument therefore implies zero is interior to the convex hull of the cross curve; some finite reservoir and delta>0 exist at every fixed degree with a known old prefix.

That existence does NOT control Fmax/delta. It does not imply (2), and it does not show that all negative local or scalar-projected sources can be repaired cheaply. A degree-uniform or useful degree-sensitive bound on this ratio is still missing.

For the certified degree20 scalar-family witness, F0<-426.09 but a full cross component lies near -0.047369, so r is demonstrably nonzero. No reservoir satisfying the favorable cost inequality (2) has been certified. Previously observed positive sampled LP objectives also do not supply a continuum lower bound. Accordingly there is currently neither a full negative optimized-dual witness nor a noncircular all-degree positive margin established by this route.

This note separates an implementable exact full-witness test from the invalid promotion of a scalar-only witness. It does not assert a new theta sign, a target pivot sign, a new finite degree, or a proof of RH.
