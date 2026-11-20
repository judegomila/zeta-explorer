# Independent actual cumulative-tail counterexample audit
2026-11-02 22:51 UTC. PASS.

Independently replayed copied campaign-authored Arb theta/DFT checker (only dependency path changed) at 80 bits and N=2^20, all 2N DFT entries. Replay 27.7 seconds gives core interpolant between enclosing integers 56962777821815 and 56962777822971. Replayed analytic alias/truncation/periodization checker and Gaussian normalization diagnostic. Total analytic error <12534.188145<13000. Separately replayed full-side Euler–Maclaurin enclosure; safely F_scaled<3195886054651.

## Identity and normalization
Extending h evenly and using x=h-v,z=h+v gives weighted full convolution factor1/8. Opposite contour shifts leave q=x+z real and produce exp(-2ty); external exp(pi*t/2) leaves exp(4). The product is g convolved with its conjugate, not a positive squared-modulus spectral product. For samples starting at -6 in period24, each coefficient carries exp(i omega*6); their product gives (-1)^j. Periodic convolution normalization P/m^2 equals Delta/m. The explicit q^2 window integral W and paired real-frequency factors, including one Nyquist representative, are consistent. Nyquist interpolation may use one signed representative for both functions; the error bound includes that endpoint.

Checked theta normalization against the documented period-one series: ordinary derivatives are -8pi^2 sum n^2q^(n^2) and32pi^4 sum n^4q^(n^2). An independent direct-series check at tau=i confirms the wrapper returns derivatives rather than Taylor coefficients. Thus the full-theta formula has no missing factorial. Official documentation consulted: https://python-flint.readthedocs.io/en/latest/acb.html . Entire theta values and DFT arithmetic use enclosing Arb balls; no finite-orbit truncation is substituted.

## Analytic error checks
The global bound100 cos(2s)^(-5/2) follows from evenness, the sum<=integral+maximum bound for unimodal Gaussian monomials, and the four displayed constants (each strictly below18,32,9,12). For x>=6 the successive orbit ratios are bounded by16 exp(-3a)<1/2, giving S_c; its logarithmic derivative is at most4.5-2c*pi*exp(2x). The verified -100/-500 derivative bounds apply monotonically for all x>=6.

Periodizing analytic g in strip r gives M0 and Mr with the modulation factor exp(tr). Other images have distance>=12 after selecting a nearest representative, and their geometric tail fits the stated factor2. Fourier coefficients decay as Mr*q^|j|, so twice the omitted l1 tail gives4Mr*q^N/(1-q), including the Nyquist alias. Replacing all samples outside[-6,6) by zero incurs <=4S_c0(6); the conservative interpolation amplification m gives the stated E_sample.

For convolution images |q+kP|>=24|k|-2, at least one argument has modulus>=12|k|-1. Splitting the convolution integral gives2||g||_1 times that tail supremum; summing both signs yields the factor4 and exp(-2500)/(1-exp(-6000)). The bound ||g||_1<=12(M0/2)+1 follows from the global bound on[-6,6] and the -500 spatial tail. Finally, periodic convolution error P E(2M0+E) and integral q^2=2B^3/3 yield exactly the prefactor exp(4)B^3/12. No unaccounted discretization or orbit error remains.

## Certified conclusion and scope
The safe integer core bound after subtracting13000 is C_scaled>56962777800000. Therefore at H=1 and exact k=2*(7005081715/1000000),
exp(pi*t/2) T_1_hat(2t)<-53766891745349<0.
Continuity gives a negative spectral interval. Polynomial determinacy then implies some finite cumulative-tail moment block fails at this cutoff, without identifying its degree. This disproves the proposed all-H/all-order cumulative-tail positivity premise. It does NOT disprove the actual full bridge kernel or RH, and does NOT address the previously certified cutoff H=1/16. All earlier finite H5 and odd degree19 claims remain intact. Replace the blanket cumulative-tail propagation plan with a cutoff-dependent/weighted strategy or direct full-kernel control; do not present this as a full-kernel counterexample.
