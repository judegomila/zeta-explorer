# VERDICT: gaussian-proxy

Claim as listed: "The Gaussian-convolution proxy is the exact de Bruijn flow at negative time (t = -4 tau), with monotonicity following from de Bruijn Theorem 13."

## What is true
1. For tau > 0, Gaussian convolution of H_0 with variance 2 tau equals H_{-tau}, where H_t(x) = int e^{t u^2} Phi(u) cos(xu) du and dH/dt = -H_xx. This is the Fourier multiplier e^{-tau u^2}; it holds for any admissible kernel, not only the zeta kernel. Checked independently at 40 digits: relative error 1.9e-41 to 5.2e-35 (the repository's own check reached 2e-9). The wrong-sign alternative H_{+tau} differs by 3% to 400%.
2. With convolution done in gamma = x/2 units, t = -4 tau. The factor 4 is a units convention.
3. Recorded exact-flow numbers reproduce: real-zero counts on x in [20,104] at 17 values of t match exactly; first pair merger at t = -1.878 (the module headline -1.8837 is off by 0.006; its census value -1.8782 is right).

## What is weaker than the wording
1. The proxy in the code (src/math/supercritical.js heatEvolvedXi) averages the Riemann-Siegel Z function, not Xi. Since Xi = Z times a factor ~ g^{7/4} e^{-pi g/4}, the Z-average is the exact flow followed by a translation of about (pi/4 - 7/(4 gamma)) * 2 tau in gamma. Measured mean shift -0.0726 (tau=0.05) to -2.81 (tau=2), matching the prediction to 0.1%-1.5%. Counts and merger times agree (collision t = -1.8766 vs -1.8779); zero positions do not. "Exact" applies to convolution of H_0, not to the implemented proxy.
2. Monotonicity of the window count holds only when no zero crosses the window ends. Zeros drift left as t increases; window [27.70, 28.70] has count 1 at t=0.5 and 0 at t=1.
3. The strip-narrowing theorem of de Bruijn does not by itself give the window statement; the local Hermite-jet/Hurwitz argument is also needed. The repository says this; the one-line listing does not.
4. Theorem numbering "13" not confirmed from a source in this run.

## Status
Known mathematics (definition of the de Bruijn family read on the x side, plus de Bruijn 1950 / Csordas-Smith-Varga / Rodgers-Tao). Its content for the project is a correction of an earlier internal misreading (a sign inversion in a doc comment). No Lean, no certificate. No consequence for RH or for bounds on Lambda; the repository states this itself.

Scores: arbitrariness 2 (identity canonical; the "4", the window and the Z-vs-Xi substitution are choices). Importance 1 (project-internal correction of a classical fact).

Suggested public wording: "Gaussian smoothing of H_0 with variance 2 tau is H_{-tau} (a standard Fourier identity); the site's Z-based smoothing reproduces the same zero mergers with shifted positions. An earlier project note that called the merger an artefact was wrong."

Scripts: t1_identity.py, t2_zproxy.py, t3_boundary.py; outputs t1.out, t2.out, t3.out in this folder.
