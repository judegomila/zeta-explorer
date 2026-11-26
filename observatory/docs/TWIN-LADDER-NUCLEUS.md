# Twin-ladder model and the liquid-drop nucleus

Two workbenches opened by the **Twin ladder** and **Uranium-238** buttons (`?view=twinLadder`, `?view=uranium238`). Both are models with controls. Neither evaluates anything about the Riemann hypothesis, and the interface says so on screen.

Code: `dist/twin-ladder-model.js`, `dist/nucleus-model.js`, `dist/nucleus-data.js` (numbers only), `dist/models.js` (shared state), `dist/models-panel.js` (drawing). Tests: `tests/twin-ladder-model.test.mjs`, `tests/nucleus-model.test.mjs`, and the model route test in `tests/channels-routes.test.mjs`.

## 1. Twin ladder

Each prime p carries rungs m = 1..M at log-length ℓ = m log p. On an arm with damping σ a rung has amplitude

    A(p, m; σ) = b(p) · exp(−σℓ) · exp(−βℓ − Pℓ²),    b(p) = log p or 1.

The direct arm sits at σ₊ = c + a and turns as exp(−iTℓ); the dual arm sits at σ₋ = c − a and turns as exp(+iTℓ). The packet is the same sum under a Gaussian window of width h in ℓ.

- **Agreement with the main view.** At c = ½, eight primes, M = 2, log p weights and β = P = 0 the packet equals the one drawn by the main view's packet inset (σ = ½ ± a). A test compares the two formulas to rounding.
- **Agreement with the research app.** β and P are the thermal weights of `src/math/twin-ladder.js`, with ψ(x) = x². That module starts at m = 0 and uses unit weights; this one starts at m = 1, so its T = 0 sum is that module's value minus one.
- **What the damping centre does.** The existing ladder fixes c = ½, where the two arms are the pair (σ, 1 − σ). The control lets c move. For the bare finite arms nothing special happens at ½: for a > 0 the direct arm is the more damped one at every centre. The completed bridge

      B(c) = tanh( log|ξ(c + a + iT)| − log|ξ(c − a + iT)| )

  is exactly 0 at c = ½ for every a and T, because |ξ(s)| = |ξ(1 − s̄)|, and is antisymmetric about ½. The balance plot draws both curves so the difference is visible: the balance belongs to the completed function, not to the finite ladders.
- **Scope.** With log p weights the direct sum truncates −ζ′/ζ(σ + iT), which converges only for σ > 1. At c = ½ it is a finite signal, not ζ. The zero ticks on the height scan are reference marks; the finite sums do not vanish there.
- **Display.** Rung and packet heights are scaled by the same ladder at c = ½, a = 0, β = P = 0, so changing the damping visibly shrinks or grows an arm. Rungs longer than ℓ = 8 are summed but not drawn. The height scan is scaled to its oscillating part, since at T = 0 every rung is aligned.

## 2. Liquid-drop nucleus

A textbook collective model (Bohr & Mottelson, *Nuclear Structure* vol. II, ch. 6A). The surface is

    R(θ, t) = R₀ k [1 + β₂ Y₂₀(θ) + Σ_λ a_λ(t) Y_λ0(θ)],    λ = 2..6,

with k fixing the volume. Each multipole is an oscillator with

    C_λ = (λ−1)(λ+2) Eₛ/(4π) − (5/2π) (λ−1)/(2λ+1) E꜀      surface − Coulomb
    B_λ = (3/4πλ) A m R₀²                                    irrotational flow
    Eₛ = aₛ A^(2/3),   E꜀ = a꜀ Z²/A^(1/3),   aₛ = 17.81 MeV,   a꜀ = 0.711 MeV.

R₀ = r₀A^(1/3) with r₀ = (3/5)e²/a꜀ = 1.215 fm, so the radius and the Coulomb term describe the same sphere. C₂ = (Eₛ − E꜀/2)/π vanishes at fissility x = E꜀/2Eₛ = 1, that is Z²/A = 2aₛ/a꜀ = 50.1. For ²³⁸U, x = 0.710 and the uncoupled quadrupole energy is 1.28 MeV.

**Model parameters that are not measurements.**

- *Coupling κ.* K(λ, λ ± 2) = κ β₂ √|C_λ C_λ±2|. A static quadrupole deformation does mix multipoles of equal parity, but this form and its strength are illustrative. With κ large the lowest coupled mode goes unstable although every multipole alone is stable.
- *Width Γ.* Amplitudes are multiplied by exp(−Γt/2ħ). It is a display parameter.
- *The pluck.* One multipole is displaced by 0.12 and released from rest. Motion is the exact solution of the linear system. When an unstable mode grows past the range of linear theory the display says so and restarts; it says nothing about fission lifetimes.

**Known limits.** Irrotational masses are several times too small, so liquid-drop energies overshoot observed band heads (the first excited 0⁺ of ²³⁸U is at 927 keV, the γ-vibrational 2⁺ at 1060 keV). Shell structure, pairing, triaxial shapes and rotation are absent. Real nuclei beyond the liquid-drop threshold exist because of shell effects the model lacks. The 238 dots are a drawing of a filled volume that follows the surface; they are not nucleon trajectories.

## 3. Measured data shown beside the model

Read on 24 November 2026. The model does not fit these values.

| Quantity | Value | Source |
|---|---|---|
| Ground band 2⁺…16⁺ (keV) | 44.916, 148.38, 307.18, 518.1, 775.9, 1076.7, 1415.5, 1788.4 | ENSDF Adopted Levels, A = 238 (Browne & Tuli, cut-off June 2014), via [IAEA LiveChart](https://www-nds.iaea.org/relnsd/v1/data?fields=levels&nuclides=238u) and [NuDat 3](https://www.nndc.bnl.gov/nudat3/) |
| β₂ | 0.2863(24) | Raman, Nestor & Tikkanen, ADNDT 78 (2001) 1. The later NNDC evaluation (Pritychenko et al. 2016) gives 0.2741(36). |
| Half-life; α Q-value; SF branch | 4.468 × 10⁹ y; 4.270 MeV; 5.45 × 10⁻⁵ % | ENSDF, IAEA LiveChart |
| Fission barriers | 6.30 MeV inner, 5.50 MeV outer | IAEA RIPL-3, `empirical-barriers.dat` |
| s-wave resonances of ²³⁸U + n | first 100, 6.674 eV to 2153.07 eV | ENDF/B-VIII.0, `n-092_U_238`, MF=2 MT=151, l = 0 block |

The rotational-ladder panel sets a rigid rotor E_J = E(2⁺) J(J+1)/6 beside the measured band; the measured levels lie below it (E(4⁺)/E(2⁺) = 3.30 against 3.33).

## 4. Level repulsion

The fourth panel compares cumulative nearest-neighbour spacings, at unit mean spacing, of the 100 resonances (uniform level density over the range) and of the 25 tracked zeros of ζ (unfolded with N(T) = (T/2π) log(T/2πe) + 7/8) with the Wigner surmises for GOE and GUE and with the Poisson law. Kolmogorov–Smirnov distances:

| Sample | GOE | GUE | Poisson |
|---|---|---|---|
| ²³⁸U + n, 99 gaps | 0.07 | 0.07 | 0.27 |
| ζ zeros, 24 gaps | 0.20 | 0.13 | 0.41 |

Both samples avoid small gaps. Neither is large enough to tell GOE from GUE, and the panel says so. Two caveats on the resonance list: the l assignment of weak resonances is an evaluators' judgement, and the list is about 6 % sparser than the evaluated mean spacing D₀ = 20.3(6) eV (RIPL-3), so a few s-wave levels are missing. The established results are that long resonance sequences of heavy nuclei follow GOE statistics and that high zeros of ζ follow GUE statistics (Montgomery; Odlyzko). That shared repulsion is the whole of the comparison made here. It is not evidence about the Riemann hypothesis and the nucleus is not a model of ζ.
