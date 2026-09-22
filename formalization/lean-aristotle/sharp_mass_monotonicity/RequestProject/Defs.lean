import RequestProject.Dini

/-!
# The SHARP mass: definitions

Producer-exact definitions for the sharp-mass `y`-monotonicity statement.

Throughout, `t > 0` is a real parameter, `P` is a finite set of primes, `D = ∏_{p ∈ P} p`
and `N ≥ 1` is a cutoff with `q_N = N² - t/16 > 0`.
-/

open Filter Set Topology

namespace SharpMass

/-- `b_t(m) = exp((t/4) log² m)`. -/
noncomputable def bt (t m : ℝ) : ℝ := Real.exp (t / 4 * Real.log m ^ 2)

/-- `λ_d = ∏_{p ∣ d} (-b_t(p))`. -/
noncomputable def lam (t : ℝ) (d : ℕ) : ℝ := ∏ p ∈ d.primeFactors, (-(bt t p))

/-- `D = ∏_{p ∈ P} p`. -/
def Dnum (P : Finset ℕ) : ℕ := ∏ p ∈ P, p

/-- `q_N = N² - t/16`. -/
noncomputable def qN (t : ℝ) (N : ℕ) : ℝ := (N : ℝ) ^ 2 - t / 16

/-- `x_N = 4π q_N`. -/
noncomputable def xN (t : ℝ) (N : ℕ) : ℝ := 4 * Real.pi * qN t N

/-- `g_N = 1/50 - (1/2) log q_N`; the logarithmic slope of `γ_N`. -/
noncomputable def gN (t : ℝ) (N : ℕ) : ℝ := 1 / 50 - (1 / 2) * Real.log (qN t N)

/-- `γ_N(y) = e^{y/50} q_N^{-y/2}`. -/
noncomputable def gammaN (t : ℝ) (N : ℕ) (y : ℝ) : ℝ :=
  Real.exp (y / 50) * (qN t N) ^ (-y / 2)

/-- `σ_N(y) = (1+y)/2 + (t/4) log q_N - (t/(2x_N²)) max(0, 1 - 3y + 4y(1+y)/x_N²)`. -/
noncomputable def sigmaN (t : ℝ) (N : ℕ) (y : ℝ) : ℝ :=
  (1 + y) / 2 + t / 4 * Real.log (qN t N)
    - t / (2 * (xN t N) ^ 2) * max 0 (1 - 3 * y + 4 * y * (1 + y) / (xN t N) ^ 2)

/-- `c(g) = (1-g)/(1+g)`. -/
noncomputable def cfun (g : ℝ) : ℝ := (1 - g) / (1 + g)

/-- `ċ_N(y) = -2 g_N γ_N(y)/(1+γ_N(y))²`, the `y`-derivative of `y ↦ c(γ_N(y))`. -/
noncomputable def cdotN (t : ℝ) (N : ℕ) (y : ℝ) : ℝ :=
  -2 * gN t N * gammaN t N y / (1 + gammaN t N y) ^ 2

/-- `𝒟_{N,n} = {d ∣ D : d ∣ n, n ≤ dN}`, the (`y`-independent) active divisor set. -/
def cellSet (P : Finset ℕ) (N n : ℕ) : Finset ℕ :=
  (Dnum P).divisors.filter (fun d => d ∣ n ∧ n ≤ d * N)

/-- `B_{N,n} = ∑_{d ∈ 𝒟_{N,n}} λ_d b_t(n/d)`. -/
noncomputable def Bcoef (t : ℝ) (P : Finset ℕ) (N n : ℕ) : ℝ :=
  ∑ d ∈ cellSet P N n, lam t d * bt t ((n : ℝ) / (d : ℝ))

/-- `A_{N,n}(y) = ∑_{d ∈ 𝒟_{N,n}} λ_d b_t(n/d) (n/d)^y`. -/
noncomputable def Acoef (t : ℝ) (P : Finset ℕ) (N n : ℕ) (y : ℝ) : ℝ :=
  ∑ d ∈ cellSet P N n, lam t d * bt t ((n : ℝ) / (d : ℝ)) * ((n : ℝ) / (d : ℝ)) ^ y

/-- `A'_{N,n}(y) = (d/dy) A_{N,n}(y)`, given by the explicit differentiated sum. -/
noncomputable def Aderiv (t : ℝ) (P : Finset ℕ) (N n : ℕ) (y : ℝ) : ℝ :=
  ∑ d ∈ cellSet P N n,
    lam t d * bt t ((n : ℝ) / (d : ℝ)) * (((n : ℝ) / (d : ℝ)) ^ y * Real.log ((n : ℝ) / (d : ℝ)))

/-- First branch of the sharp summand: `u₁ = |B - γA|`. -/
noncomputable def u1 (t : ℝ) (P : Finset ℕ) (N n : ℕ) (y : ℝ) : ℝ :=
  |Bcoef t P N n - gammaN t N y * Acoef t P N n y|

/-- Second branch of the sharp summand: `u₂ = c(γ) |B + γA|`. -/
noncomputable def u2 (t : ℝ) (P : Finset ℕ) (N n : ℕ) (y : ℝ) : ℝ :=
  cfun (gammaN t N y) * |Bcoef t P N n + gammaN t N y * Acoef t P N n y|

/-- The weight `w(y) = n^{-σ_N(y)}`. -/
noncomputable def wgt (t : ℝ) (N n : ℕ) (y : ℝ) : ℝ := (n : ℝ) ^ (-(sigmaN t N y))

/-- The SHARP mass
`F♯_N(y) = γ_N(y) + ∑_{n=2}^{DN} max(|B - γA|, c(γ)|B + γA|) n^{-σ_N(y)}`. -/
noncomputable def Fsharp (t : ℝ) (P : Finset ℕ) (N : ℕ) (y : ℝ) : ℝ :=
  gammaN t N y +
    ∑ n ∈ Finset.Icc 2 (Dnum P * N), max (u1 t P N n y) (u2 t P N n y) * wgt t N n y

/-- The sharp numerator `Num♯_N = 1 - F♯_N`. -/
noncomputable def NumSharp (t : ℝ) (P : Finset ℕ) (N : ℕ) (y : ℝ) : ℝ := 1 - Fsharp t P N y

/-- `Φ⁻_{N,n}(y) = γ|g_N A + A'| - (L/2)|B - γA|`, `L = log n`. -/
noncomputable def PhiMinus (t : ℝ) (P : Finset ℕ) (N n : ℕ) (y : ℝ) : ℝ :=
  gammaN t N y * |gN t N * Acoef t P N n y + Aderiv t P N n y|
    - Real.log n / 2 * |Bcoef t P N n - gammaN t N y * Acoef t P N n y|

/-- `Φ⁺_{N,n}(y) = ċ_N|B + γA| + c γ|g_N A + A'| - (L/2) c |B + γA|`, `L = log n`. -/
noncomputable def PhiPlus (t : ℝ) (P : Finset ℕ) (N n : ℕ) (y : ℝ) : ℝ :=
  cdotN t N y * |Bcoef t P N n + gammaN t N y * Acoef t P N n y|
    + cfun (gammaN t N y) * gammaN t N y * |gN t N * Acoef t P N n y + Aderiv t P N n y|
    - Real.log n / 2 * cfun (gammaN t N y) * |Bcoef t P N n + gammaN t N y * Acoef t P N n y|

/-! ### The named gates -/

/-- Gate **(G1)** (`γ`-band): `0 < γ_N(y) < 1` on `I = [ylo, yhi]`. -/
def G1 (t : ℝ) (N : ℕ) (ylo yhi : ℝ) : Prop :=
  ∀ y ∈ Icc ylo yhi, 0 < gammaN t N y ∧ gammaN t N y < 1

/-- Gate **(G2)** (leading decay): `g_N < 0`. -/
def G2 (t : ℝ) (N : ℕ) : Prop := gN t N < 0

/-- Gate **(G3)** (`σ`-slope): `σ_N(y') - σ_N(y) ≥ (y' - y)/2` on `I`. -/
def G3 (t : ℝ) (N : ℕ) (ylo yhi : ℝ) : Prop :=
  ∀ y y', ylo ≤ y → y ≤ y' → y' ≤ yhi → (y' - y) / 2 ≤ sigmaN t N y' - sigmaN t N y

/-- Gate **(G4)** (two-branch bracket): `Φ⁻_{N,n} ≤ 0` and `Φ⁺_{N,n} ≤ 0` for all
`2 ≤ n ≤ DN` and all `y ∈ I`. -/
def G4 (t : ℝ) (P : Finset ℕ) (N : ℕ) (ylo yhi : ℝ) : Prop :=
  ∀ n, 2 ≤ n → n ≤ Dnum P * N → ∀ y ∈ Icc ylo yhi,
    PhiMinus t P N n y ≤ 0 ∧ PhiPlus t P N n y ≤ 0

end SharpMass
