# Independent H3 audit

2 November 2026, 21:09 UTC. PASS, mathematical argument plus independently replayed rigorous interval computation. Not a formal proof-assistant check and not an all-order RH proof.

Reviewed `../h3_attack_v1/certify.py`, newly authored within this campaign, and independently replayed an identical copy `h3_replay.py` in this audit directory. This is not acquired external code. The resulting `certificate.json` agrees with the worker's bounds (runtime differs).

## Exact sufficient condition

Put x=-ell'', y=ell^(4), z6=-ell^(6), b=y+6x², c=z6+30xy+60x³. Expansion of exp(ell(h-v)+ell(h+v)-2ell(h)) yields C''/C0=-2E x, C4/C0=2E b, C6/C0=-2E c. The pointwise identity xc-b²=P=xz6+18x²y+24x⁴-y² is exact.

If x>17 and P>8x⁴, then c>b²/x+8x³. Cauchy applied to sqrt(x) and b/sqrt(x), followed by Jensen, proves

(C'' C6-C4²)/C0² =4[(Ex)(Ec)-(Eb)²] >32(Ex)(Ex³) >=32(Ex)^4 >32*17^4 =2,672,672.

This applies to every positive finite bridge weight and its zero-shift normalization. Combined with audited H2 it proves H3 strictly positive definite for every a>0. All expectations exist by profile decay.

## Compact z interval

The script uses z=pi exp(2u) and covers the enlarged interval [3,16] with 13,000 contiguous interval cells. It factors the profile as constant*exp(5u/2-z)*F(z), with F=2z-3+sum_{n>=2}n²(2n²z-3)exp(-(n²-1)z). Derivatives through order six of the finite n<=6 sum are exact polynomials times exponentials.

The n>=7 absolute derivative tail is bounded by twice its first majorant: 2*7^(2k+4)*(2z+2k)*exp(-48z). The successive-n ratio is at most (8/7)^16 exp(-15z)<1/2 forz>=3. This uniformly bounds each derivative, including k=0. Each upper endpoint is converted exactly at higher scalar precision and added as a symmetric interval. The log-derivative recurrence is the exact differentiated F=exp(log F) recurrence. Stirling numbers correctly implement (2z d/dz)^k. No truncated-theta positivity is substituted for the full sum.

Replay minimum x lower endpoint: 18.7067250478701091393252414399990167924672488743454602991083.
Replay minimum P-8x^4 lower endpoint: 881661.270284428472937816430403970223255695085693269395812902.
Replay minimum P/x^4 lower endpoint: 15.0758315178670351030502786094648148858647866834290700950501.

The scalar-generated nominal rational grid endpoints are rounded at 60 decimal digits before outward 45-digit interval conversion. Contiguous cells share the identical generated endpoints and span exact endpoints3 and16; thus there is no coverage gap even apart from the outward conversion. This does not rely on exact decimal representation of every intermediate grid endpoint.

## Unbounded z interval

For real z>=16 and complex |w|<=1/64, Re(z exp(2w))>=z exp(-1/32)cos(1/32)>=z(31/32)(2047/2048)>15. The exact ratio formula bounds the full tail by 2sum_{n>=2}n^4 exp(-15(n²-1))<64exp(-45)<2^-54. Hence |log(1+r)|<2^-53 on the disk, giving |D_u^k log(1+r)|<k!64^k/2^53<1 for k<=6.

For L=log f1 and j>=1,
D_u^(2j)L=-2^(2j)[z+sum_{m>=1}m^(2j-1)(3/(2z))^m].
Thus x>=4z-1>=63, z6>=64z-1>0. Also 16sum m³(3/32)^m=2176512/707281<4, so |y|<=16z+5<=5x. Consequently P>=x²(24x²-90x-25)>22x⁴ for x>=63. All inequalities are uniform in the unbounded domain. Evenness extends to negative u.

## Limitation

This advances the hierarchy by one order. It neither proves H4 nor supplies an order-uniform recurrence. The numerical part is rigorous interval arithmetic with analytic tail control, not a sampled graph. Preserve these distinctions in reporting.

## Frozen author artifact identifiers

Reviewed finalized H3_PROOF.md including its explicit complex-ratio bound37/27 and numeric trusted base. Author frozen hashes:
- H3_PROOF.md: ee07b4c06919ebba5e4cd41bf4ea6f6aff3a3a3146fc34a4bb462d097b33a806
- certify.py: 042e9a482d38a2e25e2f8aa77b75da122821d655e0b398cc26fc69d0c31644cf
- certificate.json: 5df5a396740de73dffb2a04f94a6868f0345617562b77d9671d9b99caf4053b7
- certificate_run.txt: b39632040c476ad0667fe47f2ac7f5e0f3be4ef945eb16f0e1cae6cb57140c24

A negative pointwise integrand in an alternative integrated-by-parts derivative-Gram representation does not contradict this result: the positive object here is the distinct sufficient polynomial P=XD-B² in logarithmic derivatives. Positivity of all such alternative integrands is not assumed.
