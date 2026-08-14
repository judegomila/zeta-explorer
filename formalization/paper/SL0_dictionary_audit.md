# SL0 — dictionary + factor-2 audit (verified)

**Claim audited (Fable "(†)", load-bearing for the T3 reclassification).**
With the repo conventions (`src/data/three-attacks-section.js:103-107`)
  A_a(z) = 8∫₀^∞ Φ(u) cosh(2au) cos(2zu) du,
  B_a(z) = 8∫₀^∞ Φ(u) sinh(2au) sin(2zu) du,
  Ξ(λ)   = 8∫₀^∞ Φ(u) cos(2λu) du   ( = c·ξ(½+iλ) ),
the identity is
  **E_a(z) := A_a(z) − i B_a(z) = Ξ(z + i a).**   (†)

**Proof (exact).** cos(2(z+ia)u) = cos(2zu)cos(2iau) − sin(2zu)sin(2iau)
= cosh(2au)cos(2zu) − i sinh(2au)sin(2zu). Integrating against 8Φ(u) gives (†). ∎

**Machine check (mpmath, 40 dps).**
- trig core `cos(2(z+ia)u) = cosh(2au)cos(2zu) − i sinh(2au)sin(2zu)`: max error **1.0e-30** over 2000 random complex (a,z,u).
- full (†) `E_a − Ξ(z+ia)` for the even test profile Φ=e^{−u²}: max error **1.1e-15** over 4 (a,z) points (quadrature-limited).

**Verdict.** (†) is EXACT. Hence, via the Hermite–Biehler reproducing-kernel
identity, T3 at shift a ⟺ E_a=Ξ(·+ia) ∈ HB ⟺ Ξ has no zero with Im>a ⟺ **ζ has
no zero with Re s > ½ + a**. The reclassification (SL1) is sound.

**Factor-2 (real, harmless).** The canonical E_a above uses cosh(**2**au) → strip
shift **a**. The channel/numeric data used for the ‖R‖ plateau
(`imp-3382-rawdiagonal-R-degree-growth-law.js:18-23`: p=Φcosh(**a**t), shear
sinh(a(u−v)), diagonal sinh(2aτ)) are the expansion of E at shift **a/2**. So any
‖R‖/λ_min numeric quoted "at level a" is really at canonical half-width **a/2** —
a rung relabel (the strip ladder is shift-covariant), NOT a structural error. This
is the same trap the program retracted once (imp-2424, `omittedTransformArgumentFactor:2`,
"SURROGATE / INVALID FOR T3"). Structural conclusions (SL1, SL2, the wall verdict)
are unaffected; only per-rung numeric labels double.

Also (referee): the *implemented* D_{a,R} uses a regularized pseudo-inverse of the
rank-deficient Gpass (cutoff-dependent), strictly weaker than the exact kernel — so
implemented-D positivity is silent on discarded near-null directions. "T3" here
means the exact ideal kernel.
