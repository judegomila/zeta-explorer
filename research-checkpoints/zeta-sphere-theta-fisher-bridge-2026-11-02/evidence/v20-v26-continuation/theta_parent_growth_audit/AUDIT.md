# Independent all-degree positive-parent spatial-growth audit

PASS for the stated full-theta positive L2 parent estimate, not the signed Schur comparison. Post-v20 packet.

For derivative order j<=n, the exact coefficient recurrence gives Cj<=5(2n+5)^n. At h>=log(10(n+1)), z>=300(n+1)². The complete orbit ratio is bounded by2^(2n+4)e^-3z<1/2. This is an all-orbit bound, not a fixed-cutoff approximation. The unit-circle Cauchy bound for exponential derivatives is valid for both signs of h and all stated a,lambda. Leibniz with sum1/j!<3 gives the displayed derivative envelope. Summing over monomial coefficients introduces n+1, not an uncontrolled polynomial-dependent constant.

Writing w=n+1, the logarithmic bound B(H)<=10w²+27w+44<=81w²<z(H)/2 checks term by term. Derivative comparison B'=4h+4n+14<z at H, with increasing gap thereafter, propagates it. Thus the complete tail of any coefficient vector is bounded by its squared coefficient norm times exp(-z), with the stronger exp(-3z/2) available.

The positive-parent coercivity is independent of unknown bridge sign. cos(tu)>=1-t²u²/2 and positivity of psi yield Re F_lambda(t+ia)>=A0-B0/2>1/4 on |t|<=1. Independent6000-cell Arb replay gives A0>.4950014737515 and B0<.0269071424130, including complete orbit/spatial tails. The n0 tail bound used here is established before and without this coercivity step, so no circularity occurs.

Complex-polynomial Chebyshev coefficient bounds and the Legendre reproducing kernel yield ||c||²<=9^w(w²/2)integral_-1^1|p|². Parseval's factor2/pi for Fourier(g)=2F is correct, giving P>=||c||²/(4pi9^w w²)>||c||²/(16*9^w w²). No claim about the signed u-weighted energy is used.

The shifted-tail integral estimate follows z(H+r)>=300w²+600w²r and H<=3w. Exact exponential polynomial moments give the displayed coefficients; the factor3w² is conservative. Finally48*9^w*w4*e^-300w²<=e^-250w² follows log48<4,log9<3 and1+logw<=w. Hence the all-coefficient relative spatial tail and ||u²f||<([log(10w)]²+1)||f||, ||uf||<(log(10w)+1)||f|| are valid. The application to F,K,L has no higher-jet norm on its right, but still uses positive parent norms, which are not controlled by the signed Schur surplus here.

No all-order positivity, uniform signed reserve, or proof of RH follows. Every finite degree is covered as a positive-parent growth estimate only.

## ALL_MOMENTS extension
PASS separately. With w=n+r+1, H=log(10w), log(1+h^(2r)) costs at most7w² at the cutoff and has derivative<=2w thereafter. The enlarged exponent therefore starts below88w²<z/2 and its derivative remains below z. The weighted coefficient tail is bounded by exp(-z); integrating both tails gives exp(-300w²)/(300w²). Combining the original positive-parent coefficient coercivity with n+1<=w yields the claimed exp(-250w²) relative tail and ||u^r f||<(H^r+1)||f||. The case r=0 is included (weight2). Cutoff depends on both spatial power and jet degree; no fixed-tail approximation or signed-metric domination is implied.
