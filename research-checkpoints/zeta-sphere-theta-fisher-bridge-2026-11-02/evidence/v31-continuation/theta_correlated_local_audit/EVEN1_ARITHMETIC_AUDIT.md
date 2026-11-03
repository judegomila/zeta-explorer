# Independent replay: actual even1 aggregate arithmetic cancellation

PASS, 2026-11-03. Owned checker independently copied to even1_replay/check.py and run with12000 cells and160-bit Arb. No acquired code executed.

The only inherited source entries read are G00 and G01, establishing alpha in47/4 plus/minus11/200 exactly as in the first-core audit. This interval is positive, so the N1 actual two-parity prefix and positive-root premise hold without a next norm. K=4 gives the other threshold components68,285/4 and half log(24*6400*6²*7³), all below64pi, as checked by live Arb comparisons. Hence every k>=64 omitted arithmetic term is positive.

For each k=1..63, the checker uses R=log k/2, z=pi k, exact divisor count, and outward interval ell2=sum(log(d²/k))². The product derivative expression retains exponents9,7,5 and all three signed prefactors. Its factor2/sqrt(k) times exp(R) and weight d(k)w²+ell2/4 exactly match the full divisor grouping and both w signs. Interval rectangles cover the full alpha range and every w in[0,3].

For the omitted integration tails of each retained k, the larger argument is u=R+|w|>=R+3. Both w² and1 are bounded by u² there, so the weight is bounded by(d(k)+ell2/4)u². The single-orbit T/M derivative convolution then gives the displayed bound with Z=pi k exp6 and overall k^(-1/2). No extra exp(R) factor is missing: the large-argument e^(u/2) factor is already integrated in the tail change of variables, while the other derivative is globally bounded. The summed tail is below7.542e-262.

Independent output directed lower endpoint is6.5917478911924426791383464105756864425003217705, with outward serialization uncertainty below5e-47. The live positivity check passes. Thus the core is>6.59, and the positive arithmetic remainder gives h1>4pi*6.59>79.08. The separately certified first summand is negative, so this is genuine aggregate low-divisor cancellation.

Evidence limit: this is an independent proof by the new arithmetic mechanism of an already-known finite rung, conditional only on the existing old-contact enclosure. It does not regenerate that enclosure, does not read any next moment or next-pivot reserve, and does not extend the known ladder or prove a uniform cancellation law. Coarse default Arb strings are not used as directed endpoints.
