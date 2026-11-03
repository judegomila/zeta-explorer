# H4 global proof audit

2 November2026. Analytic/algebraic review PASS; full interval replay outcome appended below. Separate from immutablev7.

Read h4_attack_v1/H4_PROOF.md and certify_h4.py. The moment expansion throughorder8 and the even3x3 determinant were independently verified with symbolic algebra. The Schur quantities A,B,D and displayed polynomial AD-B² agree exactly. The previous H3 pointwise odd2x2 proof supplies the other parity block. Positive pointwise full matrices can be integrated against the actual positive bridge weight; strict positivity is preserved for every nonzero finite coefficient vector. Thus the claimed result is valid for every a>0 if the compact interval certificate passes, not merely finitely sampled shifts. The normalized a0 endpoint also follows with weight2h².

The complete tail representation and log-derivative recurrence throughorder9 are correct. The midpoint sharpening uses d/dz ell^(k)=ell^(k+1)/(2z), with a uniform interval bound over each cell. The interval cell endpoints are outward rational enclosures; their exact dyadic midpoint and radius fit within the higher scalar precision. The interval evaluation at midpoint and mean-value radius therefore enclose the complete derivatives on each cell. This is not heuristic interpolation.

The larger Cauchy disk|w|<=1/16 gives Re(ze^(2w))>(55/64)z, and the ratio coefficient bound554/343<2 is valid. The resulting full-tail bound64exp(-165/4)<2^-49, logarithmic bound2^-48 and derivatives k!16^k2^-48<1 through8 were checked. Exact first-term even derivative series yield X>=63, |Y|<=5X,0<Z<=17X,|W|<=90X. The determinant lower bound discards only nonnegative128X³Z and304X²Y²; all remaining signed costs are retained. The polynomial bound768-6720/63-8860/63³-739/63⁴>600 proves the claimed unbounded-half-line reserve. A>0 also follows.

This proof advances H4 by pointwise Bell-fiber positivity. It cannot establish all subsequent orders by this same strategy: the independently audited pointwise H5 odd3x3 failure is real. Integrated H5 may nevertheless be positive; that is a separate calculation.

## Full replay outcome21:18UTC

PASS all13,000cells. Independent h4_replay.py completed in142.299seconds. Minimum X lower18.72689686463335, A lower2519.531429903, determinant-minus500X6 lower17705110418.603357, anddet/X6 lower910.472919134175817872061957335798238823812505147308073373647. Exact fulloutput retained in certificate_h4.json. The independent analytic half-line review plus this replay establishes the finite-order H4 theorem for everypositivea. Combined with the separately reviewed integratedoddH5 block it establishes fullH5 for0<a<=.5, with normalizedzero-shiftlimit. Noallorder conclusion.
