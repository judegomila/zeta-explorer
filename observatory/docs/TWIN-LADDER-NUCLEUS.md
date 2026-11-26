# Twin-ladder model and the liquid-drop nucleus

Three workbenches opened by the **Twin ladder**, **Uranium-238** and **Horizon** buttons (`?view=twinLadder`, `?view=uranium238`, `?view=horizon`), each with sections chosen by tabs (settings `ladderPanel`, `nucleusPanel`). All are models with controls. None evaluates anything about the Riemann hypothesis, and the interface says so on screen.

Code: `dist/twin-ladder-model.js`, `dist/nucleus-model.js`, `dist/nucleus-data.js` (numbers only), `dist/models.js` (shared state), `dist/models-panel.js` (drawing). Sections 4–10: `dist/rails-model.js`, `dist/spectral-stats.js`, `dist/horizon-model.js`, `dist/models-sections.js`, `dist/models-links.js`, `dist/rails-data.js`, `dist/nuclides-data.js`. Tests: `tests/twin-ladder-model.test.mjs`, `tests/nucleus-model.test.mjs`, `tests/rails-model.test.mjs`, `tests/spectral-stats.test.mjs`, `tests/horizon-model.test.mjs`, `tests/models-links.test.mjs`, and the model route tests in `tests/channels-routes.test.mjs`.

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

## 4. Level statistics (nucleus workbench, section "Level statistics")

Replaces the earlier single spacing panel. Code: `dist/spectral-stats.js`; data: `dist/nuclides-data.js`, `dist/rails-data.js`.

- **Samples.** The s-wave resonances of the chosen even-even target (first 100 at most, unfolded with a constant level density) and the first 1000 zeros of ζ (unfolded with N(T) = (T/2π) log(T/2πe) + 7/8).
- **Drawn.** Spacing histograms and cumulative spacings against Poisson and the GOE and GUE Wigner surmises; the spacing ratio r = min/max of neighbouring spacings against the densities of Atas et al. (2013); the number variance Σ²(L) for 1 ≤ L ≤ 10 against the asymptotic forms; reduced neutron widths Γn⁰ = Γn/√E against the Porter–Thomas law, with the reduced widths of the two-rail system at a = ½ for contrast.
- **Goodness of fit, computed in code.** Kolmogorov–Smirnov distance and asymptotic p-value for spacings, ratios and widths; ⟨r⟩ minus each reference mean (0.5307, 0.5996, 0.3863) in standard errors; r.m.s. difference of Σ² from each form. The p-values assume independent samples and are indicative only.
- **Widths.** Γn is read from the same ENDF/B-VIII.0 MF=2 MT=151 file as the energies, so widths are sourced for every nucleus that has a resonance list.
- **Not computed.** The Δ₃ rigidity of the source paper is not drawn; the number variance is.
- **Limits.** About a hundred levels cannot separate GOE from GUE by spacings. The files are evaluations: for ²³⁸U and ²³²Th the evaluators state that weak levels were added or assigned so that the set conforms to the Wigner and Porter–Thomas laws. ²³⁵U (target spin 7/2, two spin groups, fissile) and ²⁴⁴Pu (14 resonances) are not analysed. Long nuclear sequences follow GOE and high zeros follow GUE (literature); the comparison is not evidence about the Riemann hypothesis and the nucleus is not a model of ζ.

## 5. Rails and bridge (twin-ladder workbench)

Code: `dist/rails-model.js`. `?view=twinLadder&state={"ladderPanel":"rails"}`.

    A_a(t) = Re ξ(½ + a + it),  B_a(t) = Im ξ(½ + a + it),  m_a = B_a/A_a = tan φ_a,  τ_a = 2φ_a′ = 2 Re ξ′/ξ(½ + a + it)

- **Normalisation.** The definitions carry no scaling. For display both rails are divided by the positive factor |½s(s−1)π^(−s/2)Γ(s/2)|, which leaves zeros, ratio and phase unchanged.
- **Drawn.** The two rails; the delay τ_a with its smooth part and the prime series smooth − 2 Σ_{n≤N} Λ(n) n^(−½−a) cos(t log n); the ratio; the continuous phase; exact minus series; the minimum of τ_a over the window against a.
- **Passivity indicator.** The inequality drawn is τ_a(t) > 0. Theorem for a ≥ ½ at all heights. For all a > 0 it is equivalent to the Riemann hypothesis. A finite window shows nothing about it: positivity below the verified height of zeros follows from that verification.
- **Controls.** a (0.01 to 3), window start and length (heights up to 2000), series cut N.
- **Numbers.** ξ and ζ from `dist/math.js`. Checks against the source: 2φ′ = 1.864963343 at a = 1.5, t = 30; first even-rail zeros and reduced widths at a = ½.
- **Limits.** Double precision; the raw rails underflow above t ≈ 900 (the scaled ones do not). For a ≤ ½ the prime series does not converge and is drawn as a finite sum only.

## 6. Limiting temperature (twin-ladder workbench)

    V(a) = ½ Σ Λ(n)² n^(−1−2a) = 1/(8a²) − 0.786575535662477614 + 6.02404097319776 a + …   (|a| < ¼)

- **Drawn.** 4V(a) (infinite-height variance of τ_a), the three-term expansion, the rounded form (1 − e^(−2aL))/(2a²) with L = log(t/2π) and its small-a form L/a − L², the measured variance of 2 Re ζ′/ζ on the chosen window at thirteen thicknesses and at the chosen a, and reference points from the source at t = 10⁴ and 10⁶. Small panels: 8a²V(a), the fluctuating part on the window, the energy −ζ′/ζ(β) of the prime gas.
- **a = ½** is the limiting inverse temperature β = 1 of the gas whose states are the integers with energy log n: its energy diverges there, so no finite energy reaches it. The prime series of the delay converges absolutely exactly for a > ½.
- **Table.** `scripts/build-rails-data.py` (mpmath, 40 digits; Σ Λ² n^(−s) = Σ_K c(K) (log ζ)″(Ks)) writes `dist/rails-data.js` (22 KB): V(a), v_a and ζ(1+2a) at 110 thicknesses from 0.005 to 3, and the first 1000 zero ordinates. Tests recompute entries in JavaScript by direct summation over prime powers.
- **Status.** Variance = 4V(a): theorem for a > ½, numerical observation for a ≤ ½. Rounding: numerical observation. "Temperature" below β = 1 is a label (ζ(β) < 0 there).

## 7. Vacuum energy (twin-ladder workbench)

    ζ(−1) = lim [Σ n e^(−εn) − 1/ε²] = −1/12,   jitter ζ(2)/(2π²) = +1/12,   v_a = (1/2π²) Σ Λ(n)² / (n^(1+2a) log² n)

- **Result as stated in the source.** The one-point balance (energy measured from the origin) is false. The two-point statement (energy measured from a rung, averaged over rungs) holds and equals ζ(−1) − v_a; it cancels the jitter energy 1/12 + v_a. It holds for any point set, so it carries no information on zeros.
- **Drawn.** The ladder and, with the toggle on, the rungs of the odd rail displaced by −(1/π) arg ζ; the counting fluctuation; the regularised sum against ε; the two sides of the balance; v_a against a with the measured mean of δ_n²; the source's one-point energies beside the values a one-point balance would need.
- **Controls.** a, the window, perfect or prime-corrected ladder.
- **Numbers.** v_1 = 0.0090819039, v_2 = 0.0018241297, v_3 = 0.0004204422 (table; the source writes σ_a²). One-point values are quoted from the source, not recomputed. Rungs are located for a ≥ ½ only.

## 8. Other heavy nuclei and the trend with mass

`?view=uranium238` is unchanged; the `nucleus` setting selects Th232, U235, U238, Pu240, Pu242, Pu244, Cm248, Cf252 or Og294 and sets Z, N and (where measured) β₂.

| Field | Source (retrieved 25 November 2026) |
|---|---|
| Half-life, decay branches | ENSDF via IAEA LiveChart API |
| Binding energy per nucleon | AME2020 via the same API (²⁹⁴Og: extrapolated) |
| β₂ | NNDC B(E2) adopted entries: Raman et al. 2001 and Pritychenko et al. 2016 |
| Fission barriers, D₀ | IAEA RIPL-3 `empirical-barriers.dat`, `resonances0.dat`, read from an Internet Archive capture of 5 March 2026 (the IAEA host refused automated requests) |
| s-wave resonances E, Γn | ENDF/B-VIII.0 MF=2 MT=151, positive-energy l = 0 rows in the resolved range |
| Liquid-drop barrier | model number from the source paper (five nuclides) |

Not available, and shown as such: β₂ for ²³⁵U and ²⁹⁴Og; barriers for ²⁵²Cf and ²⁹⁴Og; resonances for ²⁹⁴Og. ²³⁵U resonances are not listed (two spin groups). The measured ground band is loaded for ²³⁸U only. The hypothetical 1.4 eV resonance of ²⁵²Cf is excluded.

The trend section plots fissility x = (Z²/A)/50.1 and C₂ = Eₛ(1 − x)/π against Z²/A to the point where C₂ vanishes, with barriers, half-lives, spontaneous-fission branches and β₂. The infinite-mass statement (no sequence of charged nuclei reaches infinite mass; the bulk is already a saturated Fermi liquid; the realised limit is a neutron star) is established nuclear physics quoted from the source; its counterpart on the zeta side, overlapping resonances at κ = (a/π) log(t/2π) > 1, is an analogy.

## 9. Horizon model (`?view=horizon`)

Code: `dist/horizon-model.js`. A model analogy; it establishes nothing about black holes or about the Riemann hypothesis.

- **Drawn.** Time delay of the two-rail function S_a (inserted by hand) and of the gamma factor Γ_R(½+iE)/Γ_R(½−iE) (what the horizon supplies); the complex E plane with resonances at g − ia and the gamma poles at i(2n+½); counting laws; reduced widths against Porter–Thomas; the central pressure of a uniform star with the Buchdahl bound R = (9/8) r_s; local temperature ħc/(2πk_Bℓ) against proper distance with the Hawking temperature.
- **Numbers with units.** r_s, T_H, T_loc (K and MeV), entropy, least-damped l = 2 mode (Mω = 0.37367 − 0.08896i, Leaver), evaporation and infall times. Constants: CODATA 2018, IAU nominal solar mass.
- **Controls.** Mass, bridge thickness, window, stellar radius, proper distance.
- **Dictionary.** Ten candidate correspondences with the verdicts of the source: three adopted as analogies, seven shown as refuted, not adopted or without relation.
- **Not drawn.** The effective-Hamiltonian eigenvalues of the source's resonance figure (a 4234 × 4234 matrix) are not recomputed; the poles are placed at g − ia from the tabulated zeros.

## 10. Links to the mathematics

Each section shows "Mathematics of this view" (a section of `dist/methods.html`), an introduction link (`dist/learn/`), and each small panel a link to its most specific methods anchor. Methods sections 06c–06h were added for the rails, limiting temperature, vacuum energy, level statistics, heavy nuclei and horizon. In the mounted build (site bar present) links to main-site routes (`../#/twin-ladder`, `/hamiltonian`, `/oscillators`, `/paper`, `/supercritical`, `/key-results`) are added. All paths are relative. `tests/models-links.test.mjs` checks every file, anchor and route.
