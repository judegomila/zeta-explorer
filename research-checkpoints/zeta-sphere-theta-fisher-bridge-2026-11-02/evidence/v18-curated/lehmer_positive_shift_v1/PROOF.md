# The cumulative-tail failure persists at an explicit positive shift

2026-11-02. Independent analytic audit and complete interval replay PASS; see ../lehmer_tail_audit/POSITIVE_SHIFT_AUDIT.md. This uses the already certified a=0 core, without another FFT.

Set t=7005081715/1000000, H=1, a=1/10000 and
T_(a,H)(v)=∫_H∞[h sinh(2ah)/a]ψ(h−v)ψ(h+v)dh.
This is the normalized positive-shift tail, with limit F_H as a↓0. It is not the full bridge.

Use the same contour y=π/4−2/t, c=cos(2y), g(u)=ψ(u+iy)e^(itu), and ordinary convolution c_g=g*conjugate g from the reviewed H=1 counterexample. Put B=2H=2 and N_y=||ψ(.+iy)||₂². The exact compact-core weight changes from q² to q sinh(aq)/a:

exp(πt/2) core_(a,H)_hat(2t)
=exp(4)/(8a)∫_(−B)^B q sinh(aq)c_g(q)dq.

Cauchy–Schwarz gives |c_g(q)|≤N_y. The reviewed strip estimate gives N_y≤512c^(−5). Since sinh(x)/x increases for x≥0,

|exp(πt/2)[core_(a,H)_hat−core_(0,H)_hat]|
≤ exp(4)B³N_y/12 [sinh(aB)/(aB)−1]
<2046593363087.                                        (1)

The certified a=0 compact core is greater than56962777800000 on this scale. Hence the positive-shift normalized compact core exceeds54916184436913.

The accompanying interval checker independently evaluates the actual full bridge C_a_hat/a through the reviewed one-sided corrected-head formula at σ=1/2+a, N=8192,m=40. It encloses ζ and ζ′ with the full Euler–Maclaurin remainder; the digamma π/t allowance remains included. It proves

exp(πt/2) C_a_hat(2t)/a <3197245160046.                  (2)

Subtracting (1) from the certified core and then using (2) yields

exp(πt/2) T_(a,1)_hat(2t)<−51718939276867<−5·10^13.     (3)

Thus the stronger tail positivity premise fails at a genuine positive shift, not only at a=0. This does not contradict any assertion about the full bridge, which is positive at this test point, or about the separate H=1/16 cutoff. It does not give an RH counterexample.

The JSON field positive_shift_tail_upper_interval encloses the calculated upper-bound expression, not the actual tail on both sides; only its upper endpoint is used. The original a=0 core lower bound and theta norm estimate are independently reviewed inputs from ../lehmer_tail_certificate_v1/ and ../lehmer_full_side_v1/THETA_STRIP_MAJORANTS.md.
