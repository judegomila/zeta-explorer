# route-i-ln2: verdict

## Statement the material supports
Setting: Connes-Consani decomposition W = Tr(theta(f) S) - E(f) (arXiv:2006.13771), transcribed to S = {oo, 2} with cutoff 1: F_S has half-line kernel K_S(t) = sum_{n>=0} cos(2 pi 2^n t) - cos(pi t); A = P_1 F_S P_1; eps_S = delta_S - delta_in + corr with delta_S(rho) = rho^{1/2} B(rho), delta_in(rho) = rho^{-1/2} B(1/rho), B(r) = int_{[0,1]^2} K_S(xy) K_S(r xy) dx dy, corr = sum lam_n^3/(1-lam_n^2) <xi_n|theta(rho^-1) psi_n>.

(a) Proved (elementary): B(2^{+-k}(1+eps)) = (1/2) log_2(1/eps) + O(1). Hence at rho = 2^k the log cusp of delta_S has coefficient 2^{k/2}/2 per log_2, that of delta_in 2^{-k/2}/2, and delta_out = delta_S - delta_in carries the fraction 1 - 2^{-k}; one half at rho = 2. For a one-prime system at p with local sign chi the fraction is 1 - p^{-k}, independent of chi.

(b) Numerical, with a heuristic derivation: if corr is continuous at rho = 2 (requires sum |lam_n|^3 < oo; measured, not proved), then for 2a > ln 2 the quadratic form k -> E_S(Q(k*k^*)), Q = -(d/dx)^2 + 1/4, on L^2(-a, a) is unbounded above: along k = cos(t x) phi(x) with t = 2 pi j/ln 2 it grows like 2 pi c_2 t R_phi(ln 2)/||phi||^2 times (1 + a log-periodic factor of about +-3%), c_2 = 1/(2 sqrt2 ln 2). Consequently the sufficient condition E o Q <= c |ghat(0)|^2 used by Connes-Consani in the archimedean case does not hold for S = {oo, 2} on any window longer than ln 2, and a finite-rank correction cannot restore it.

Not supported: any statement that Weil positivity fails or is unprovable past ln 2, or that Sonine-space methods in general stop at ln 2. The condition that fails is one sufficient condition in one bookkeeping.

## Replay
- Cusp coefficients, own 30-digit computation: increments per halving of eps at rho = 2: delta_S 0.707106781181, delta_in 0.353553390596, delta_out 0.353553390585 (exact: 0.707106781187, 0.353553390593); fraction 0.499999999992. rho = 4: fraction 0.749999997. p = 3: 0.666666665.
- Spectral computation re-run at a different grid step and 160 modes: lam = 0.9999731, -0.9927027, 0.6202075, -0.5609470; corr continuous through ln 2 (1.4535 .. 1.4604 over ln2 -+ 1e-3).
- Resonance test with independent delta_out and quadrature: a = 0.5, j = 32: split 208.9 (record 210.0, prediction 201.9); j = 64: 411.3 vs 402.3; j = 128: 819.8 vs 803.0. No split for 2a < ln 2. Archimedean control -45.74.
- Near threshold, 2a = ln 2 + 0.0069, twin-bump phi: E_S o Q/||k||^2 = +3686 at t = 2321 (prediction 3719).

## Stress tests
- Test-function shape (plateau, polynomial bump, asymmetric bump, twin bumps): same law; ratio to prediction 1.00-1.06 for j >= 32.
- Mode cut-off 20 -> 160: corr part of the split moves by at most 3.5.
- Sign-twisted Euler factor at 2 (chi = -1): same cusp fraction, growth of the same size with resonances and anti-resonances exchanged. The result is a property of the local factor at 2 and does not distinguish zeta. Davenport-Heilbronn: construction not defined.
- Quadrature validated on the pure log model (ratio 1.00000).

## Errors and weak points found
1. The record's leading-order formula omits a term: delta_out(2e^d) - (1/(2 sqrt2)) log_2(1/|e^d - 1|) does not converge as d -> 0; it is a 1-periodic function of log_2(1/d) (values -0.98748, -0.98280, -0.97764, -0.97852 at quarter phases). This adds a linear-in-t term with a log-periodic factor, +2.0% at j = 2^m and -3.3% at j = 2^{m+1/2}. The record attributes the mismatch to O(log t). Conclusion unchanged.
2. "lam_k ~ 1/(2 sqrt k)" is wrong in the constant: at least 19 eigenvalues exceed 0.2 and 67 exceed 0.1. Order k^{-1/2} agrees with Connes-Consani (quasi-inner paper, Thm 4.4, as quoted in arXiv:2611.13129).
3. The spectrum used for corr is incomplete in the deep degenerate clusters (Lanczos, 120 steps in the original, 300 here). corr is a truncated quantity; its Q-composite is not bounded analytically. Part (b) is therefore numerical evidence plus a heuristic, not a proof. The public status note "derived in the note" applies to (a) only.
4. "Unbounded above" is in the Q-normalisation. In symbol terms the excess is 3.2 cos(t ln 2)/|t| against a Weil symbol of size ln(t/2 pi): along tested resonances E_S o Q is 1e-4 to 5e-3 of W o Q. The discarded Sonine trace exceeds the excess by that factor, so retaining any fixed fraction of it at high frequency removes the obstruction above a finite frequency. The obstruction is to the literal archimedean scheme only.

## Literature
Closest: Connes-Consani 2006.13771 (the scheme), Connes-Consani 2008.10974 (semilocal quasi-inner, order 1/2), Connes-Consani-Moscovici 2310.18423, and Andrews-Connes-La Gatta 2611.13129 Section 8 (semilocal pair not trace class, "the tail must be controlled against the scaling action, not as an operator", hypothesis (H2') open). The structural fact that the archimedean compact-error argument does not carry over once a prime is present is stated there in another form. The cusp fraction 1 - 1/p and the explicit unboundedness of E_S o Q along 2 pi j/ln 2 were not found (4 queries, 2 papers opened; a modest search).

## Scores
- Arbitrariness 3. The cusp fraction 1 - 1/p is canonical within the decomposition (independent of local sign and of the cutoff by the same pairing count), and ln 2 is the canonical point where the prime 2 enters. The "obstruction" is relative to one sufficient condition (rank-one domination of E after discarding the Sonine trace) and its "unbounded" form depends on the Q-normalisation.
- Importance 2. It rules out the verbatim port of one argument; it has no consequence for RH, for de Bruijn-Newman bounds, or for positivity on (ln 2, ln 3). A specialist in this programme already works with a different control (2611.13129) and would regard the statement as an expected, explicit instance.

## Status
Obstruction / negative result. Part (a) proved in notes (elementary, re-derived and checked to 11 digits). Part (b) numerical evidence, reproduced and extended, not proved.

## Suggested public wording
"In the transcription of the Connes-Consani archimedean argument to S = {oo, 2}, the error functional E_S has a logarithmic singularity at rho = 2 carrying the fraction 1 - 1/2 of the singularity of the trace remainder (proved; 1 - 1/p in general). Numerically, for windows longer than ln 2 this makes E_S o Q positive and growing linearly along the frequencies 2 pi j/ln 2, so the rank-one bound on E used in the archimedean case is not available. This concerns that one step of that argument; it is small relative to the Weil form itself and says nothing about positivity."
