# Strong modular-style monotonicity does not imply all moments positive

Status: independent analytic audit PASS. Auxiliary Gaussian-mixture source, not actual theta.

Take F(t)=e^(−t²)+e³e^(−4t²), and let λ=2(F'²−FF''). Its positive even inverse Fourier profile is

 ψ(h)=e^(−h²/4)/(2√π)+e³e^(−h²/16)/(4√π).

Writing r=2e^(−3)e^(−3h²/16) gives

 (logψ)''=−1/8−(3/8)r/(1+r)+(9h²/64)r/(1+r)²
          ≤−1/8+(3/2)e^(−4)<0.

Thus ψ is uniformly strongly log-concave, so its conditional-variance R has the same strict modular-style monotonicity used in THETA_GLOBAL_LINEAR_GAUSSIAN_WINDOWS. Nevertheless,

 λ(t)=4e^(−2t²)+16e⁶e^(−8t²)+e³(20−72t²)e^(−5t²).

At s=0, the moment ∫t¹⁰λ(t)dt is a strictly positive factor times

 4/2^(11/2)+16e⁶/8^(11/2)−296e³/5^(13/2).

Using e³>20, e⁶<441, √2>7/5, √8>14/5 and √5<9/4 gives the strict rational upper bound −1774967/806400000<0. The source's fifth-degree monomial test is therefore negative. Equivalently, the fifth signed derivative needed for complete monotonicity of s↦∫λe^(−st²)dt fails at s=0 and, by continuity, for sufficiently small s>0.

Rescale ψ_L(h)=Lψ(Lh) with L=20. Its log-curvature is multiplied by L² and exceeds 17 in magnitude, while its negative tenth spectral moment is multiplied by L⁹>0. This explicit strongly log-concave source is not theta and does not say the actual theta moment is negative. It proves that the generic curvature/monotonicity mechanism alone cannot yield all-degree monomial positivity or complete monotonicity.
