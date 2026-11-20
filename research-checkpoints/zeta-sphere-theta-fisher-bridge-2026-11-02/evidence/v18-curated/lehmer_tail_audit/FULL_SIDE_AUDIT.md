# Independent full-side bound at rational height
2026-11-02 22:44 UTC. PASS for the full density only; core/tail witness not yet certified.

Independently replayed authored interval checker with N=8192,m=40 at exact t=7005081715/1000000 and sigma=1/2. Verified inclusive endpoint convention, 40 Bernoulli corrections with odd rising-factorial lengths, complete 80-factor remainder, first/second derivative recurrences and e/e1/e2 bounds. Digamma error pi/t is valid by sum/integral comparison. Trigamma comparison error <=2/(Im w)^2, multiplied by 1/2 in b_G', correctly gives 4/t^2. Actual normalized a=0 density is one half of the sigma-second derivative of G|zeta|^2, matching the checker head and E2/2 budget. The exp(pi*t/2) scaling is accounted for by exp(pi*t/4) inside Q before taking its squared modulus.

Independent enclosure matches author output. A safely rounded rational summary is
3195878911633 < exp(pi*t/2) F_0_hat(2t) < 3195886054651.
The detailed decimal endpoints in full_certificate.json are for inspection; use these enclosing integers or padded interval loads for chained rigorous comparisons.

This establishes a positive full density at one rational frequency. It does not alone establish the sign of a cut-off tail. The proposed core excess requires an independently justified core quadrature/theta truncation/alias certificate; FFT stability is not sufficient.
