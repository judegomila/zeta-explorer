# Positive-shift robustness audit
2026-11-02 22:56 UTC. PASS, separate post-v14 result.

Independently replayed certify_positive_shift.py at exact a=1/10000, t=7005081715/1000000. The reviewed Euler–Maclaurin head with N8192,m40 and first derivative budget gives normalized scaled full density less than3197245160046. This is C_a_hat(2t)/a, not its sigma-second derivative; the code correctly uses G[(b/2)|H|²+Re(H'conj H)]/a with error GE/a.

For the core, the exact contour convolution weight becomes q²*sinh(aq)/(aq). On |q|<=B=2 its change from a=0 is bounded by sinh(aB)/(aB)-1. Cauchy–Schwarz bounds the convolution modulus by512 cos(2y)^-5, using the independently reviewed full-theta strip norm. Hence the change in normalized scaled core is at most exp(4) B³/12 times this norm and weight increment. Replayed upper bound is less than2046593363087. With the certified a0 core lower56962777800000, the positive-shift normalized scaled tail is strictly less than
3197245160046 +2046593363087 -56962777800000 = -51718939276867.

Thus the H=1 cumulative-tail obstruction occurs at an explicit positive shift as well as normalized a0. No actual full-kernel negativity, RH failure, or fixed H=1/16 conclusion follows. Raw decimal endpoints are not needed for chaining: the enclosing integers above give a rigorous summary.
