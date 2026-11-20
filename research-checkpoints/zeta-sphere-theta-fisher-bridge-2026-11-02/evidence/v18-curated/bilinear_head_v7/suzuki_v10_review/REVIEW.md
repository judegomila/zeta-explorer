# Independent Suzuki v10 exact-compression audit

2 November 2026. PASS for the n2048,K640 integer Rayleigh witness and the exact compression method, under the stated interval implementation assumptions. This does not review any later n8192 run.

Read EXACT_COMPRESSION_AND_GAP.md and primitive_trial.py. The second-primitive expansion follows from dr=dz/[2(1-z)]; the convolution exponent21/20 is correct. Bounds |f_j|<=5/2, b_j<=j+1 and |a_j|<=33(j+2)^2 suffice for the stated uniform polynomial-geometric tail. The interval recurrence encloses each coefficient and retains cancellation.

The double-difference cell matrix is exactly the distributional double integral of the weakly singular kernel, since T(0)=Q(0)=0. No alignment of log2 with the grid is required. At R=log3 the n=3 term occupies only a measure-zero corner and contributes no bounded integral operator term. Exact integer convolution and normalization give the proposed Rayleigh quotient without assuming any floating eigensolver accuracy.

Independently checked every n2048 activation interval: none strictly straddles zero. The previously unused generic fallback was appropriately replaced by an assertion. Our own replay likewise uses an assertion and evaluates the integer second-difference weights directly, rather than the original accumulation order.

Independent replay enclosure:

 [0.99999964479876266158397716992493477612125120407649,
  0.9999996447987626615841027537606070004919887643777].

It lies within the original certificate interval. Own code and complete output are in this directory.

Self-adjointness gives the unconditional lower bound on ||H|| and therefore a necessary contraction-margin budget below3.55202e-7. It does not prove contraction, noninvertibility, or a crossing. The inverse lower bound is valid only under the separately stated premise ||H||<1, because positivity of I-H is needed for the inverse Cauchy–Schwarz argument. No global determinant or RH conclusion follows.

## Completed n8192 extension

The separately authored replay_rayleigh_8192.py completed successfully using Python exact integer convolution (not fixed-width convolution), interval second-primitive evaluation and direct integer second-difference weights. Its enclosure is

 [0.99999995275148007045292316481647382703547561327724,
  0.99999995275148007045292316486772450778281470462359].

This lies inside the original n8192,K768 certificate. Every activation interval passed the replay's no-straddling assertion. The same audited analytic formula/tail applies, so this witness is independently validated. Consequently any contraction margin at A²=3 is less than4.724852e-8. An inverse norm lower bound greater than21million remains conditional on a separately established contraction premise. No endpoint contraction or invertibility is asserted by this witness.
