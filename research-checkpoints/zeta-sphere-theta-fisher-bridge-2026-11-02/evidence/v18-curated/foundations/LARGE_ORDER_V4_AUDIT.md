# Independent review of the quantitative large-order theorem

Reviewed hierarchy/large_order_v4/L1_GAUSSIAN_THEOREM.md line by line on 2 November 2026. Result: PASS after the cosmetic tail-coefficient adjustment 112 -> 114 described below. The main bound 250s, n>=700, and the expanding Laguerre positivity band are supported by the stated elementary inequalities. No RH assumption, numerical zero verification, or positivity of an unknown Fourier transform enters this proof.

## Statement checked

For H solving 2n/H+9=4pi exp(2H)=k, s=k^-1/2 and F_n(x)=M_n(sx)/M_n(0),

||F_n-exp(-x²)||_1 <=250s, n>=700.

Thus the Fourier error is <=250s globally in absolute size. When sqrt(pi)>500s, positivity follows on |xi|<=2sqrt(log(sqrt(pi)/(500s))). In the original height variable this is

|t|<=s^-1 sqrt(log(sqrt(pi)/(500s))),

an asymptotically sqrt(2n) band. The theorem does not give all-frequency positivity at any order, nor every-order positivity at arbitrary height.

## Critical global points checked

1. Full-theta amplitude A(u): the exact leading-mode factorization and bounds 1/2<=A<=2, |A-1|<=exp(-2u) hold for all u>=0 by a positive-index tail estimate. The entire infinite theta sum is retained, not replaced by one mode.

2. Crossing |v|>h: with U(u)=pi exp(2|u|)-(9/2)|u|, the crossing correction is exactly 2pi sinh(2d)-9d, d=|v|-h. It is nonnegative because 4pi>9. Therefore the global envelope r_h(sx)<=16exp(-exp(2(h-H))x²) is valid on the ENTIRE x-axis, including h near zero and |v|>h.

3. Saddle location: pi<22/7 and exp(4)<55 give ell'(2)>0 for n>=700; pi>3 and exp(4)>50 then give H>2 and k>600. There is no hidden asymptotic-only threshold here.

4. Curvature on |h-H|<=1/4: the first term of -ell'' is at most (32/49)k, and the second at most 2exp(1/2)k<(10/3)k, whose sum is below 4k. The second term alone exceeds k. This checks the two curvature inequalities.

5. Normalization: a preliminary proof using only A²>=1/4 would not yield Z>=s/2; this was flagged and repaired. The final text correctly uses h>7/4, hence A²>9/10, on |h-H|<=s/2, together with exp(ell-ell(H))>=exp(-1/2)>3/5. This gives Z>(27/50)s exp(ell(H)) and supports the weaker s/2 bound actually used.

6. Expected central displacement: numerator A²<=4 and the exact integral integral_R |delta|exp(-kdelta²/2)d delta=2/k give the claimed <=16s after division by the repaired normalizer.

7. Small-h probability mass: global strict concavity extends the central slopes to exponentially decreasing tails. The left tail is integrated only where h>=0, but extending its positive upper bound further left is conservative. Crucially the slice L1 mass contains exp(-(h-H)); the proof retains this weight, integrates it against the left-tail decay, and does not replace it by a local saddle constant.

## Central conditional L1 estimate checked

On |sx|<=1/4 and |h-H|<=1/4, both theta arguments are positive. Every amplitude differs from 1 by at most epsilon=4pi e/k<40/k<=1/15. The quotient bound |B-1|<=7epsilon follows from [(1+epsilon)/(1-epsilon)]²-1=4epsilon/(1-epsilon)². Its relaxed 1000/k bound contributes <2300/k after Gaussian integration.

Taylor's formula gives

0<=(cosh(2sx)-1)/(2s²)-x²<=(1/2)s²x^4

on this region, since cosh(1/2)/3<1/2. Multiplying by the Gaussian-width parameter a<=5/3 contributes less than s²x^4exp(-3x²/5); its integral is <10/k. The width-change L1 distance is exactly sqrt(pi)|exp(-delta)-1|<3|delta|.

For the outside region, the displayed common bound is 17exp(-3x²/5). At L=sqrt(k)/4, the elementary Gaussian tail estimate gives

integral_|x|>L 17exp(-3x²/5)dx
 <=(340/3)k^-1/2 exp(-3k/80)
 <114k^-1/2 exp(-3k/80)<1000/k, k>=600.

The draft's coefficient 112 is not the direct consequence of that displayed relaxed common bound; using 114 fixes this tiny presentation issue without changing any subsequent constant. A tighter use of the actual width exp(-1/2) could also establish 112, but is unnecessary.

Thus 2300/k+10/k+1000/k<4000/k, proving the claimed central conditional estimate.

## Remaining constants and conclusion

The upper probability tail has slice L1 error <31; the lower has error <45exp(y). With A²<=4 and Z>=s/2, their contributions are respectively <=992s exp(-k/32) and <=1800s exp(-k/32), totaling <2800s exp(-k/32).

Consequently the final error is at most

48s+4000s²+2800s exp(-k/32)<250s

for k>=600. The Fourier scaling hat M_n(2t)=s M_n(0)hat F_n(2st), and L_n=2^(2n)/(2n)! hat M_n(2t), has the correct factors. Saddle asymptotics H~(1/2)log n and s²~log n/(4n) give band radius asymptotic to sqrt(2n), as claimed.

The nonempty Fourier-band condition is additional: the conservative bound can be vacuous for many n just above 700. It becomes nonempty eventually; the theorem does not claim otherwise. The local Gaussian approximation cannot control arbitrarily high frequencies, as the draft's explicit modulated-Gaussian example correctly illustrates.

## Source boundary

The original finished ChatGPT thread proposed this saddle and quantitative L1 target. The parallel hierarchy lane supplied the proof, and this audit independently checked it. This is a meaningful positive partial theorem within the campaign, not a claim of priority over the literature or a completed RH argument.
