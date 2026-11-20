# Independent review: endpoint and adaptive flat-boundary obstruction

2 November 2026. Reviewed hierarchy/endpoint_v7/ENDPOINT_PLAN.md. Deductions PASS, with the source-scope qualifications below. This is not a global positivity theorem or a fresh proof of the cited classical inputs.

## Uniform exponent and zero-count checks

For fixed 0<delta<1/2, Weyl exponent 1/6 at sigma=1/2, interpolation to sigma=1 and Cauchy differentiation yield zeta derivatives through order two bounded by |t|^((1-sigma)/3+epsilon) on the required compact strip. Thin extension left of 1/2 via the functional equation costs an arbitrarily small extra exponent. The normalized identity integrating partial_a W from a=0 therefore gives |W_a|/a bounded by exp(-pi|t|/2)|t|^(4-delta/3+epsilon), uniformly 0<a<=1/2-delta. The exponent follows from sigma+3+2(1-sigma)/3=11/3+sigma/3.

At sigma=1, pairing zeros beta+i gamma and (1-beta)+i gamma ensures at least half of any height-window count lies in beta<=1/2. Their horizontal distances are in [1/2,1]; for |gamma-t|<=10 each contributes at least 1/202 to Re xi'/xi. The centered canonical product justifies summing these nonnegative real contributions; multiplicities and on-line zeros cause no issue.

The displayed Rosser estimate gives N(t+10)-N(t-10)>=2log t for t>=exp(20). Independently checked its linear inequality using 3<pi<22/7 and log(log t+.001)<=log t/5. Thus the bound Re xi'/xi(1+it)>=log t/202 follows, without RH.

For 1/2<=A<=1, selected distances are in [1/2,3/2], giving the uniform weaker contribution 1/205. The reciprocal zeta input is uniform for sigma>=1, Stirling is uniform on [1,3/2], and the normalized Poisson kernel has a positive compact minimum when a<=1/2-delta. Thus

sup_(1/2<=A<=1,0<a<=1/2-delta) |W_a/B_(a,A)|
 <= C_(delta,epsilon)|t|^(-delta/3+epsilon)log|t| -> 0

for epsilon<delta/3. Flat choices A_T approaching 1/2 cannot restore a fixed strict relative gap in this bulk region. No uniform conclusion as delta tends to zero is supplied. Curved-boundary chain-rule formulas in the note are correct; substitution of A(t) into the flat formula alone is invalid.

## Explicit positive boundary-energy floor

The exact identity |xi(1+it)|^2=t^2(1+t^2)|zeta(1+it)|^2/[4cosh(pi t/2)] checks. With L=6.9*10^6, the stated reciprocal and logarithmic-derivative estimates imply

W_(1/2)(t)>=exp(-pi t/2)t^4/[808 L^2 log t], t>=exp(20).

The function sin(2pi a)/a decreases for 0<a<1/2. Consequently p_delta=sin(2pi delta)/[(1/2-delta)(cosh(2pi)+1)] is a valid lower bound for P_(1/2)^upper(a,u)/a on |u|<=1. Integrating the preceding floor over a length-two interval gives exactly the displayed b_delta(t), valid for t>=exp(20)+1.

This is a genuinely positive, explicit denominator for relative error accounting. It is not a lower bound for the residual W_a and gives no sign for that residual. Combined ratio constants remain unspecified because the interpolation upper estimates were not made numerical.

## Source verification and limits

Read Hiary–Patel–Yang's actual arXiv:2207.02366v1 PDF, Theorem 1.1: corrected critical-line Weyl estimate with exponent 1/6. Only its established exponent is used; no independent full-paper proof audit is claimed. https://arxiv.org/pdf/2207.02366

Read Trudgian's author institutional publication record, which explicitly states the reciprocal estimate and its sigma/t range. This verifies the cited theorem statement, not the full article's proof. https://researchportalplus.anu.edu.au/en/publications/explicit-bounds-on-the-logarithmic-derivative-and-the-reciprocal-/

Read the actual Hasanalizade–Shen–Wong arXiv:2107.06506v1 PDF Table 1 and definition (1.1), confirming the historical Rosser row (.137,.443,2.463,T0=2) and the main-term convention without an added 7/8. This is a primary research paper's explicit restatement, not a direct re-audit of Rosser's 1941 proof; none of that newer paper's improved zero-count constants is imported. https://arxiv.org/pdf/2107.06506

## Final theta-tail and cross-error appendices

Read and independently reconstructed the appended elementary tail bound. The substitution x=exp(2u) produces exactly 4pi^2 n^4 2^(-j)x^(3/2)(log x)^j. The Gamma integral with rate lambda-3/2 gives the displayed single-index formula; replacing that rate by lambda/2 and summing a geometric majorant gives R_j<=16pi^(1-j)j!m^(2-2j)exp(-pi m^2). The full envelopes P0<3,P1<1,P2<1/2 follow from m=1. The exact normalized derivative-of-shear identity gives error <=2P1R1+P2R0+P0R2, hence <=88m^2exp(-pi m^2), uniformly in real height and 0<a<=1/2. The final constant 88 is justified, for example, by 3.14<pi<22/7 and m>=1.

Expanding H=F-R instead gives the independently checked cross bound 2M1R1+M2R0+M0R2+R1^2+R0R2. Its quadratic coefficient is 256+512=768, so the stated E_cross is correct. Taking the smaller of the two valid errors is legitimate only when the M_j themselves have certified bounds. The existing asymptotic envelopes do not supply fully numerical constants.

A useful consequence of the explicit fallback is boundary-relative convergence: m(t)=ceil(sqrt(t/2)) gives error/b_delta(t)=O_delta(t^-3 log t), uniformly in 0<a<=1/2-delta. More generally m^2>=t/2+c log t and m^2=O(t) gives O_delta(t^(-3-pi c)log t). These are errors relative to the known positive boundary transfer, not relative to the possibly vanishing residual W_a; they do not supply its signed margin. The sharper cross-error can lower the leading cutoff toward t/4 under its certified full-function envelope assumptions, exactly as distinguished in the worker's note.

## Constructive thin near-boundary sign region: PASS

Read the final appended lemma and independently checked its proof. For |t|>=46 and

1/2-1/[8log(|t|+1/2)] <= a <= 1/2,

one has W_a(t)>0 unconditionally. In centered zero coordinates, horizontal mirror pairs ±beta+i gamma contribute

2a(a^2+(t-gamma)^2-beta^2)/[((a-beta)^2+(t-gamma)^2)((a+beta)^2+(t-gamma)^2)]

to the real logarithmic derivative. When |t-gamma|>=1/2, strict |beta|<1/2 makes this positive. For closer ordinates, gamma>=45 at positive height, and the already cited zero-free reciprocal domain implies |beta|<1/2-1/[8log gamma]<=a. These contributions are also positive. The centered paired canonical product has no extra real linear constant; real contributions converge absolutely. Multiplicity and beta=0 can be handled with half-weight coincident mirror pairs, so no zero is duplicated. The evaluation point is zero-free as well. Therefore W=|F|^2 Re(F'/F)>0; evenness handles negative height.

This is a positive sign theorem on a logarithmically thin near-boundary region, derived from an established zero-free region. It is not a new zero-free theorem, not a bulk-strip result, and not RH. The source-statement qualifications above apply unchanged.
