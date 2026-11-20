# Negative actual cumulative-tail density at H=1

Status: independent Arb computation, independent DFT replay, analytic-error audit, and combined sign audit all passed.

This is a counterexample to **positivity of every spatial cumulative tail**, not to the full bridge kernel, RH, or the previously studied fixed cutoff H=1/16.

## 1. Exact target and contour identity
Set t=7005081715/1000000, H=1, delta=2/t, y=pi/4−delta, B=2H=2. Define

C_H(v)=int_0^H 2h² psi(h−v)psi(h+v)dh,
T_H(v)=int_H^infty 2h² psi(h−v)psi(h+v)dh,
F_0=C_H+T_H.

The Fourier convention is fhat(k)=int exp(−ikv)f(v)dv. With g(u)=psi(u+iy)exp(itu), and bar-g(u)=conjugate(g(u)) on the real axis,

exp(pi t/2) C_H_hat(2t)
=exp(4)/8 int_(-B)^B q² (g*bar-g)(q)dq.

To derive this, extend h evenly to [−H,H], put x=h−v,z=h+v, and use Jacobian1/2 and h²=(x+z)²/4. Shift x upward by iy and z downward by iy, leaving q=x+z real. The Fourier factor contributes exp(−2ty); exp(pi t/2−2ty)=exp(4). The convolution is ordinary convolution of g and its conjugate, **not** the squared Fourier magnitude. Integrable strip bounds below justify the shifts.

## 2. Certified full-theta samples and DFT arithmetic
Use L=6, N=2^20, Delta=12/N, period P=24, and m=2N samples. The first N nodes are x=−6+jDelta; the remaining N entries are zero. Every nonzero sample is evaluated using Arb complex balls at80bits, via

psi(u)=exp(u/2)[z² theta_3''''(0,tau)/(4pi⁴)+3z theta_3''(0,tau)/(2pi²)],
z=pi exp(2u), tau=i exp(2u).

Here the theta derivatives are with respect to the period-one argument, as in Arb: theta_3''=−8pi²sum n²q^(n²), theta_3''''=32pi⁴sum n⁴q^(n²). This evaluates the **entire theta sum**, not a finite orbit approximation. Exact evenness/conjugacy allows half the samples to be reflected.

Arb `acb.dft` encloses the complete DFT. If G_j is the DFT of sampled g, the conjugate-sample DFT is conjugate(G_(-j)). For omega_j=2pi j/P, define

W_j=int_(-B)^B q² exp(i omega_j q)dq
=2B³[((x²−2)sin x+2x cos x)/x³], x=omega_j B,

with W_0=2B³/3. The finite trigonometric-interpolant weighted convolution is

Delta/m sum_j G_j conjugate(G_(-j)) (−1)^j W_j.

The phase is exp(i omega_j 2L)=(−1)^j because convolution coordinates begin at−2L. Opposite frequency terms are paired through their real parts. For B=2,P=24, x=j pi/6, so twelve validated sine/cosine values suffice.

The independent Gaussian normalization test agrees with the exact Gaussian integral within4.44e−32. It is a sign/normalization sanity check; the following bounds, not that check, certify the actual sampling approximation.

The resulting Arb ball is safely enclosed between integers

56962777821815 < scaled finite interpolant <56962777822971.

## 3. A global full-theta strip bound
For c=cos(2s)>0, |s|<pi/4,

sup_x |psi(x+is)| <=100 c^(−5/2).

Proof: by evenness take x>=0, z=pi exp(2x), a=cz. Split exp(−an²)=exp(−a/2)exp(−a n²/2) using n>=1. For a nonnegative unimodal function, its sum over positive integers is at most its integral plus maximum. Applying this to u^4exp(−b u²) and u²exp(−b u²) gives

sum n⁴exp(−bn²) <=3sqrt(pi)/(8b^(5/2))+4exp(−2)/b²,
sum n²exp(−bn²) <=sqrt(pi)/(4b^(3/2))+exp(−1)/b.

Insert b=a/2 in the absolute theta series. Terms with z^(−1/4) are bounded using z>=pi; terms with z^(1/4)exp(−cz/2) use the maximum (1/(2ec))^(1/4). The four resulting constants are respectively <18,<32,<9,<12 after replacing their c powers by c^(−5/2), since0<c<=1. Their sum is below100.

## 4. Periodic interpolation alias bound
Set r=4delta/5, c0=cos(2y), cr=cos(2(y+r)). Periodize the exact g with period P. The preceding global bound and the image estimates below imply sup norms

M0=200 c0^(−5/2) on the real axis,
Mr=200 exp(tr) cr^(−5/2) on both lines Im u=±r.

The same bounds hold for the analytic conjugate function. Periodic Fourier coefficients therefore obey |a_k|<=Mr q^|k|, q=exp(−2pi r/P). The degree-m trigonometric interpolant aliases Fourier coefficients modulo m. Its uniform error is at most twice the omitted Fourier l1 tail, hence

E_alias <=4Mr q^N/(1−q).

This includes the Nyquist endpoint conservatively. The interval checker gives E_alias<2.795e−10. This estimate is on the exact analytic periodic function, independent of floating FFT assumptions.

## 5. Truncation and period images
For real x>=6 and c equal to either c0 or cr, the full theta tail satisfies

|psi(x+is)| <=S_c(x)
=8exp(x/2)[2(pi exp(2x))²+3pi exp(2x)]exp(−c pi exp(2x)).

Indeed the n>=1 polynomial-exponential majorants have successive ratio at most16exp(−3a)<1/2, so twice the first term bounds each sum. Logarithmic differentiation shows S_c'/S_c<=4.5−2c pi exp(2x). The interval checker verifies this is <−100 for cr and <−500 for c0 throughout x>=6. It also verifies S_cr(6)<1 and S_c0(6)<10^(−100).

For the strip-periodization bounds, choose a nearest period representative in [−12,12]. All other images have distance>=12; their sum is bounded by2S_cr(6)exp(−600)/(1−exp(−2400))<1. This justifies the factor2 in M0,Mr, including the modulation factor exp(tr).

At sampled real nodes, replacing the exact periodization by the truncated first-N-node vector incurs pointwise error at most4S_c0(6). Interpolation amplifies a sample sup error by at most m, giving E_sample<=4mS_c0(6). Put E=E_alias+E_sample.

The periodic convolution of exact periodizations is the periodization of the true convolution. For |q|<=2, nonzero convolution images have |q+kP|>=24|k|−2. At least one convolution argument then has absolute value >=12|k|−1. Since ||g||_1<=12(M0/2)+1, the sum of unwanted convolution images is bounded by

E_period <=4[12(M0/2)+1] S_c0(6)exp(−2500)/(1−exp(−6000)).

The checker evaluates these bounds directly with Arb.

## 6. Total analytic error
Both interpolants have sup error E from the exact periodized functions and those functions have sup bound M0. Their periodic convolution error is at most P E(2M0+E). After restoring the q² window and scaling, total error is bounded by

exp(4) B³/12 ·[P E(2M0+E)+E_period]
<13000.

The computed upper enclosure is approximately12534.1882. Every arithmetic error in the sampled theta, DFT, and W_j sum is already included in the Arb ball; this analytic error covers only interpolation, truncation, and periodization.

## 7. Sign conclusion
The independently reviewed full-side certificate gives

exp(pi t/2) F_0_hat(2t)<3195886054651.

Subtracting the analytic error from the certified core interpolant yields the safe integer lower bound

exp(pi t/2) C_H_hat(2t)>56962777800000.

Therefore

exp(pi t/2) T_1_hat(14010.163430)<−53766891745349<0.

The exact rational target does not require any claim about locations or simplicity of nearby zeta zeros. Continuity gives a negative spectral interval. By the independently reviewed exponential-moment/polynomial-density argument, some finite cumulative-tail moment block at H=1 must fail positivity (no degree is identified by this Fourier witness).

This rules out the blanket all-H cumulative-tail positivity route. It leaves the full bridge kernel and the H=1/16 results untouched.
