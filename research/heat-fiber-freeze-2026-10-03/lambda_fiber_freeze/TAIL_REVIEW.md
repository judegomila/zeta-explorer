# Independent audit of the coarse analytic tail

Reviewed 2026-10-03 against [Polymath, arXiv:1904.12438v2](https://arxiv.org/html/1904.12438), Theorem 1.3, equations (13)–(24), and Proposition 6.6(vi).

**Verdict: PASS.** No defect was found in the universal inequalities or either claimed margin. For the specified t=24727519/200000000 and every y in [1/5,1], the proof establishes

- N>=10^17: |H_t/B_t|>43/500;
- N>=10^20: |H_t/B_t|>31/125.

These are uniform infinite-x-tail statements, not a global Lambda certificate. The stated finite gap remains unfilled. This review does not certify any preceding finite interval or the historical tail archive.

## Checks of the actual argument

1. **Floor and theorem domain.** N=floor(sqrt(x/(4pi)+t/16)) gives z>=N^2-t/16. Since .123<t<1/8, x>10N^2 follows, for example, from pi>3 and N>=1. In the audited range this puts all points safely inside the theorem's x>=200, 0<t<=1/2, 0<=y<=1 domain. The argument of M_t defining B_t has nonzero imaginary part, so its explicit factors and exponential are nonvanishing.

2. **Real exponent and heat coefficients.** log(1-r)>=-2r for 0<=r<=1/2, with r=t/(16N^2), has the correct direction. It gives the loss t^2/(32N^2); bounding the positive part in equation (21) by 2 gives the additional loss t/x^2. Both losses are positive, uniformly below 1/1000. For n<=N, (t/4)log^2 n<=(t/4)log N log n, so the claimed n^{-a} majorant is valid, including n=1. The weakest y is 1/5 for a and 1 for a-y. The thresholds a>9/5, a-y>6/5 at 10^17 and a>2, a-y>7/5 at 10^20 are correct.

3. **Gamma and kappa retained.** The gamma estimate gives exp(.02+r)N^{-y}<2N^{-y}: explicitly, r<1/128, so .02+r<1/2. Equation (22), x>10N^2 and N>=1 even give |kappa|<1/(64N^2). Thus the weaker documented |kappa|<1/N^2 is safe. The derivative (1-2log N)/N^3 is negative on the full range; the checked cutoff values imply N^{|kappa|}<2 at every larger N. Consequently the complete reflected sum is bounded by 4N^{-y} times the relevant sum of n^{-(a-y)}. No sign of Re(kappa) or phase cancellation was assumed.

4. **Sums and integral tails.** The integral-test orientation is correct. In particular, sum from n=9 onward is bounded by the integral from 8 to infinity; the n=8 term in the finite sum is not a missing or miscounted endpoint. The 50-digit outward interval for the 9/5 majorant is [0.8936283141123477648491696446536775951619084388622510119, 0.8936283141123477648491696446536775951619084388622643757], below .893628315 and .9. The other displayed majorants evaluate to less than 3.274 (7/5) and 5.789 (6/5), so bounds 4 and 13/2 are safe. N>=10^17>2000^5 gives the stated reflected contribution <.013. Hence |f-1|<.913 and S<1.913<2; the larger cutoff gives |f-1|<.7516 and S<1.7516<2.

5. **Equation (23), including n=N.** For n<=N, z/n^2>1/2. If this ratio is below 1, its negative logarithm has magnitude <log 2<log z; otherwise its logarithm lies between 0 and log z. Thus the absolute-logarithm bound remains valid just to the right of an index change, where z may be slightly below N^2. The stated derivatives of log x/x and (log x)^2/x are correct and negative throughout both ranges. With t^2/16<1/1024 and x-6.66>x/2, the exponential arguments are <10^-33 and <10^-39 respectively. exp(u)-1<=2u is applied only with 0<=u<=1/2, yielding the stated 4*10^-33 and 4*10^-39 bounds.

6. **Conservative C-error.** Proposition 6.6(vi) gives exactly the advertised 10.50 corollary: replace 1+u by exp(u), enlarge the positive denominator correction from x-8.52 to x-12, and combine 3.58+6.92=10.50. The proof does not need the displayed 10.44. The discarded heat exponent is nonpositive. Since z>1, the weakest prefactor is at y=1/5. Also 3^y+3^{-y}<=4 and N-1/8>N/2 give the first correction <9.92/N<10/N. For the second correction, pi<4 yields 3|log z+i*pi/2|+10.50<3log x+17; dividing by x-12>x/2 gives the documented bound. The positive exponent and prefactor estimates imply e_C,0<4*10^-10 at the small cutoff and <4*10^-12 at the large cutoff.

7. **Margins and exact seam coverage.** The retained lower bounds are .0869999995 and .248399999995, respectively, strictly above .086 and .248. For any integer K, the domain N>=K is exactly x>=4pi(K^2-t/16). Individual index cells are [4pi(k^2-t/16),4pi((k+1)^2-t/16)); the next cell includes its left endpoint. The argument is pointwise in the actual floor-defined N and uniform in y, so all seams and both y endpoints are covered without continuity of f or sampled interpolation.

## Reproducibility and minor clarifications

Ran `python verify_coarse_tail_constants.py` successfully at its prescribed 50-digit interval precision. This is a constant check, not a substitute for the universal arguments audited above. No heavy computation or shared compute lock was used.

The source has different small correction expressions in Theorem 1.3 equation (21) and Proposition 6.6(ii); the proof's coarse bound by 2 is valid for either, so this does not affect the result. For maximum self-containment, the proof could spell out the gamma inequality .02+r<1/2, the two-case absolute-log argument, and the exact cutoff x>=4pi(K^2-t/16). These are explanatory improvements, not repairs.

Audited SHA-256:

- ANALYTIC_TAIL.md: 1b1dac67608134106a906759f994e54ec7ab9555ddfb6783bb6767f717552510
- verify_coarse_tail_constants.py: 97cf859aedc89dda0fd2020bd152b546034b4746305c58be4e523dca467a887c
