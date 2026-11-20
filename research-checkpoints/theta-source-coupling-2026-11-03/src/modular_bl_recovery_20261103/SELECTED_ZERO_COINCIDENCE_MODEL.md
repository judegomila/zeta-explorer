# Exact selected-zero coincidence in a positive-profile paired model

Status: independent analytic audit PASS. This is an auxiliary source, not the Riemann theta profile.

Let α,b>0 and F(t)=exp(−αt²/2)cos(bt). Its inverse Fourier transform is a strictly positive even sum of two Gaussians centered at ±b. Its full paired density is

 λ(t)=2(F'²−FF'')=2 exp(−αt²)[α cos²(bt)+b²]>0.                    (1)

Thus both parity moment Grams are positive at every finite degree, and all their selected residuals are defined. The first positive source zero is t₀=π/(2b). The even degree-2 monic selected residual for the full density is q₂(t)=t²−β, where

 β=[∫t²λ(t)dt]/[∫λ(t)dt].                                          (2)

Put r=b²/α. Elementary Gaussian integration gives

 αβ = [r/2+1/4+(1/4−r/2)e^(−r)] / [r+(1+e^(−r))/2].               (3)

The equality β=t₀² is exactly

 r [r/2+1/4+(1/4−r/2)e^(−r)]/[r+(1+e^(−r))/2] = π²/4.           (4)

The left side is continuous, tends to zero as r↓0, and grows like r/2 as r→∞. It therefore equals π²/4 for at least one r>0. Choose such an r and b²=rα. Then q₂(t)=t²−t₀² vanishes exactly at ±t₀, which are simple zeros of F. The full paired density remains strictly positive there and everywhere.

Consequently, neither positive physical profile, evenness, the exact paired density, all-degree old-pivot positivity, nor simple real source zeros can imply that the actual inverse-selected residual avoids a source zero. The model is not Jacobi theta and the coincidence parameter has r>1 and the two-Gaussian profile is not log-concave: (log ψ)''(0)=(r−1)/α>0. It does not show coincidence for an actual Xi zero or rule out a theta-specific separation theorem. It is a counterexample only to the proposed generic zero-avoidance shortcut.
