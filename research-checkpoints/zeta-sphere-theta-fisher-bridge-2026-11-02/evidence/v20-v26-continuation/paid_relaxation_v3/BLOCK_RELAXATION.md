# Spatial/time conditional expectation retains signed forcing credit

Status: exact budget inequalities and explicitly labelled floating theta diagnostics. No uniform-degree theorem or high-degree interval certificate.

Let J_gamma(lambda,h) be the reflected gauged forcing density on h>=0 from GAUGE.md, without the common pi/2. Its total over lambda0..Lambda and h0..infinity is (S_Lambda-S0)/pi. Let a finite measurable partition P divide this space-time domain into blocks. Define
 B_P=(pi/2) sum_(B in P) [integral_B J_gamma]_+.
Then the exact signed evolution gives
 S0 >= S_Lambda-2 B_P.
This retains cancellation INSIDE each spatial/time block before discarding negative block totals. It requires the old block to remain positive along the whole lambda path, exactly as the original Schur envelope identity does.

If P is coarser than Q, then B_P<=B_Q, by [x+y]_+<=[x]_++[y]_+. In particular
 B_P <= (pi/2) integral [J_gamma]_+.
No regional/tail positive-definiteness assumption is used.

## Genuine information-relaxation interpretation
Use the positive physical paired measure density P0(lambda,h)=h[F_lambda(h)^2+F_lambda(-h)^2], normalized on the space-time domain if desired. The signed source m=J_gamma/P0 has the same mean before and after conditional expectation onto the block sigma-algebra. Since positive part is convex,
 E[(E[m|blocks])_+] <= E[m_+].
This is an exact information/coarse-graining inequality on the original compensated source. The coarse-graining operation does not redefine the target or assume the Fourier bridge is positive. The Newman deformation itself changes the function; its entire forcing cost is still paid to return to the original lambda0 target. Computing/certifying each signed block integral still requires actual theta evidence; using a single global block would simply expose the unresolved total source and is not an automatic proof.

The orthogonality gauge and this conditional expectation are complementary: the first removes source components with exact zero total, and the second preserves negative credit within controlled regions. Their effectiveness must be measured against the actual terminal Schur reserve.

## Actual growing-degree diagnostic
probe_blocks.py uses a=.25,Lambda1, time blocks[0,.5],[.5,1], spatial cutoffs0,1/8,1/4,1/2,1,2,3, and q_spectral=-(n+1)/(n-1)p''. It is floating-only, ten orbits, |u|<=3; the spatial masks on a global GL grid do not certify block integrals.
Approximate local positive-part -> blockwise paid ratios:
 n5: .50649 -> .20111;
 n9: .80675 -> .30448;
 n12:1.07082 -> .16561;
 n13:1.15865 -> .14213;
 n15:1.21331 -> .23993.
All use the SAME full lambda interval, not a smaller deformation. The exact signed evolution residual on this floating grid is about1e-11 relative or less at the reported orders, but that is not a rigorous error bound. Separate per-block quadrature is being used to check sensitivity to cut locations.

These numbers identify retained signed block cancellation as a useful next finite certificate target. They do not prove these ratios, assert their persistence as degree grows, or reintroduce the refuted all-H tail-PSD assumption.

### Separate-block quadrature replay
probe_blocks_refined.py and probe_blocks_refined240.py integrate each spatial block with respectively120 and240 Gauss-Legendre nodes, avoiding discontinuous masks on a global grid. Both retain the same32-node quadrature per time block and remain floating diagnostics. The240-node gauge ratios are n5:.2009377714834568, n9:.3109308990874249, n12:.1597031241817372, n13:.1420079955445606, n15:.2440106076440641. The120-node results agree to about1e-11 absolute or better. This is a consistency check, not a rigorous error certificate.

### Which conditional variance matters
On the positive paired measure, the exact law of total variance separates source variation into within-block variance and variance of the block conditional mean. The block budget depends only on the latter mean. Gauges can therefore be fitted against the positive weighted Gram of BLOCK-AVERAGED old-feature regressors, instead of paying all pointwise source variance. The remaining task is a theta-specific comparison of this between-block mean residual and the actual Schur reserve, including conditioning of the projection. No contraction of unrelated orbit variance is substituted for that comparison.
