# Independent audit: prefix-only dual continuation

2026-11-03. Analytic PASS. This is a conditional transfer criterion, not an established chain of successful transfers.

Direct expansion with c1=c0+d and v1=v0+d cancels all b_loc cross terms and gives exactly q1=q0-2v0^T A_loc d-d^T A_loc d. No local old-block positivity is required. Subtracting the actual normal equations A1 c1=-b1 and A0 c0=-b0 gives d=-A1^-1[(A1-A0)c0+(b1-b0)]. This uses only known old matrices and cross columns, not the target mass or next pivot. It requires the stated actual old inverse at the destination.

For n=epsilon+2N, N>=1, q0 has leading positive local asymptotic d_n Z^n. Its supporting-plane subtraction has order at most Z^(n-1), while the largest A_loc entry has order Z^(n-2). Thus ||A_loc||/(1+q0) tends to zero. On compact intervals the assumed q0>=ell>0 controls the denominator. The finite constant C0 is justified, with no uniform-degree or explicit computational bound inferred merely from existence.

The Euclidean bilinear estimate bounds the absolute correction by eta(1+q0), where eta=C0(2||v0||D+D^2). For eta<1, this yields q1>=(1-eta)ell-eta. The stricter eta<ell/(1+ell) gives a strictly positive supporting-plane margin. Integration against the new positive spatial probability is legitimate because its actual cross densities have exact zero mean. No integration-by-parts or hidden boundary claim is added.

The initial strictly positive pointwise plane is an essential premise and is not supplied by a merely positive integrated norm. The earlier fixed-degree eventual theorem can provide such a starting point at large shifts. Without quantitative control of the margin, supporting coefficient, C0, and actual inverse displacement, the criterion does not prove that a continuation reaches any desired critical shift or works uniformly in degree.

Diagnostic LP files remain untrusted to proof: invalid reconstructed negative-weight bases are not witnesses; positive sampled objectives, even if exact, would only be upper bounds on the continuum minimum and would not prove its positivity. No numerical theorem or actual optimized-dual counterexample is accepted here.
