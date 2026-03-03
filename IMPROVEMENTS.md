# Auto-Improvements Log

Automated improvements made by the Claude Code auto-improvement engine.

| # | Timestamp | Summary | Files Changed |
|---|-----------|---------|---------------|
| 1 | 2026-03-02T12:00:00Z | Fix de Bruijn-Newman x-scale using gamma values instead of zero count | LiCriterionViz.jsx |
| 2 | 2026-03-02T12:05:00Z | Fix Nyquist plot double-negation bug in negative frequency contour | NyquistBodeViz.jsx |
| 3 | 2026-03-02T12:10:00Z | Fix inverted sign in Riemann-Siegel Z correction term | zeta.js |
| 4 | 2026-03-02T12:15:00Z | Fix incorrect claim that Euler product converges in the critical strip | EulerProductViz.jsx |
| 5 | 2026-03-02T12:20:00Z | Add axis tick labels to Energy Landscape heatmap canvas | EnergyLandscapeViz.jsx |
| 6 | 2026-03-02T12:25:00Z | Prevent t-range sliders from crossing in ZetaLandscapeViz | ZetaLandscapeViz.jsx |
| 7 | 2026-03-02T12:30:00Z | Add legend and improve unit circle visibility in Nyquist plot | NyquistBodeViz.jsx |
| 8 | 2026-03-02T12:35:00Z | Add missing legend to frequency mode in PrimeGapCouplingViz | PrimeGapCouplingViz.jsx |
| 9 | 2026-03-02T12:40:00Z | Hoist loop-invariant Math.log and Math.pow out of explicitFormulaTerms zero loop | primes.js |
| 10 | 2026-03-02T12:45:00Z | Memoize expensive energyLandscape computation to avoid recomputing on metric change | EnergyLandscapeViz.jsx |
| 11 | 2026-03-02T12:50:00Z | Add mode physics explainer cards to ModesPage explaining damped oscillation anatomy and RH equipartition | ModesPage.jsx |
| 12 | 2026-03-02T12:55:00Z | Add spectral decomposition and impulse response explainer cards to explicit formula section | HamiltonianPage.jsx |
| 13 | 2026-03-02T13:00:00Z | Fix Q-factor formula that was wrong by a factor of log(p) | oscillators.js, supercritical.js |
| 14 | 2026-03-02T13:05:00Z | Fix wrong sign of imaginary part in dual ladder construction in WaveSimViz | WaveSimViz.jsx |
| 15 | 2026-03-02T13:10:00Z | Fix specific heat formula dividing by σ² instead of multiplying | supercritical.js |
| 16 | 2026-03-02T13:15:00Z | Replace Riemann-sum unfolding with exact Weyl-law formula in number variance | GUEStatisticsViz.jsx |
| 17 | 2026-03-02T13:20:00Z | Add critical line color indicator to all σ sliders in Fourier Domain tabs | FourierDomainViz.jsx |
| 18 | 2026-03-02T13:25:00Z | Add missing y-axis labels to all three modes of ScatteringMatrixViz | ScatteringMatrixViz.jsx |
| 19 | 2026-03-02T13:30:00Z | Fix number-variance legend to match plot styling (dashed Poisson line, data point circles) | GUEStatisticsViz.jsx |
| 20 | 2026-03-02T13:35:00Z | Hoist oscillatorStage calls out of per-pixel loop in WaveInterferenceTab animation | WaveSimViz.jsx |
| 21 | 2026-03-02T13:40:00Z | Add Hamiltonian anatomy and caveat explainer cards to SimulatorPage | SimulatorPage.jsx |
| 22 | 2026-03-02T13:45:00Z | Fix heat-evolved Xi chart clipping negative values, hiding zero crossings | SupercriticalViz.jsx |
| 23 | 2026-03-02T13:50:00Z | Fix heatEvolvedXi using Re(ζ) instead of Riemann-Siegel Z(t) for Xi proxy | supercritical.js |
| 24 | 2026-03-02T13:55:00Z | Fix Keiper-Li title and legend omitting +½ constant from asymptotic formula | LiCriterionViz.jsx |
| 25 | 2026-03-02T14:00:00Z | Add critical line color indicator to σ slider in OscillatorChainViz | OscillatorChainViz.jsx |
| 26 | 2026-03-02T14:05:00Z | Add missing y-axis labels to both charts in Heat Flow tab | SupercriticalViz.jsx |
| 27 | 2026-03-02T14:10:00Z | Add right-side y-axis with π-labeled ticks for phase curve in Euler product plot | EulerProductViz.jsx |
| 28 | 2026-03-02T14:15:00Z | Cache Borwein acceleration weights in zetaCriticalStrip to avoid recomputing per call | zeta.js |
| 29 | 2026-03-02T14:20:00Z | Add Z(t) motivation and heatmap reading guide explainer cards to ZetaPage | ZetaPage.jsx |
| 30 | 2026-03-02T14:25:00Z | Fix GradientDescentTab not redrawing when numPrimes slider changes | TwinOscillatorSimViz.jsx |
| 31 | 2026-03-02T14:30:00Z | Fix energyLandscape missing 0.5 mismatch factor and bridge coupling term | oscillators.js |
| 32 | 2026-03-02T14:35:00Z | Fix ConvergenceTab third chart clipped by insufficient SVG height (700→780) | TwinOscillatorSimViz.jsx |
| 33 | 2026-03-02T14:40:00Z | Fix Bode integral text conflating minimum-phase with no-RHP-poles | ControlTheoryPage.jsx |
| 34 | 2026-03-02T14:45:00Z | Add nearest-zero proximity indicator to t slider in HamiltonianViz | HamiltonianViz.jsx |
| 35 | 2026-03-02T14:50:00Z | Add critical line color indicator to σ slider in EulerProductViz | EulerProductViz.jsx |
| 36 | 2026-03-02T14:55:00Z | Add hover tooltips to all data points in LiCriterionViz (bars, scatter, heat flow) | LiCriterionViz.jsx |
| 37 | 2026-03-02T15:00:00Z | Add nearest-zero proximity indicator to t slider in ScatteringMatrixViz | ScatteringMatrixViz.jsx |
| 38 | 2026-03-02T15:05:00Z | Fix ExplicitFormulaViz legend to match plot styling (dashed PNT line, step-pattern staircase) | ExplicitFormulaViz.jsx |
| 39 | 2026-03-02T15:10:00Z | Add colorbar with labeled scale to heatmap mode in ZetaLandscapeViz | ZetaLandscapeViz.jsx |
| 40 | 2026-03-02T15:15:00Z | Add horizontal gridlines to ExplicitFormulaViz for easier y-value reading | ExplicitFormulaViz.jsx |
| 41 | 2026-03-02T15:20:00Z | Fix BridgeTab reflection coefficient formula missing denominator (1+|χ|) | TwinOscillatorSimViz.jsx |
| 42 | 2026-03-02T15:25:00Z | Add critical line color indicator to σ slider in NyquistBodeViz | NyquistBodeViz.jsx |
| 43 | 2026-03-02T15:30:00Z | Add impedance matching and observation guide explainer cards to WaveSimPage | WaveSimPage.jsx |
| 44 | 2026-03-02T15:35:00Z | Precompute sparse non-zero entries in vonMangoldtSpectrum to avoid redundant Math.log calls | supercritical.js |
| 45 | 2026-03-02T15:40:00Z | Add tab-by-tab exploration guide card to FourierPage | FourierPage.jsx |
| 46 | 2026-03-02T15:45:00Z | Fix frequency mode x-scale off-by-one causing last prime to render past chart edge | PrimeGapCouplingViz.jsx |
| 47 | 2026-03-02T15:50:00Z | Fix Heat Flow evolved zeros clamped to hardcoded gamma=155 instead of dynamic xMax | SupercriticalViz.jsx |
| 48 | 2026-03-02T15:55:00Z | Fix ScatteringMatrixViz reflection formula missing denominator (1+|χ|) in explainer | ScatteringMatrixViz.jsx |
| 49 | 2026-03-02T16:00:00Z | Hoist loop-invariant density calculation out of inner pair-correlation loop in GUEStatisticsViz | GUEStatisticsViz.jsx |
| 50 | 2026-03-02T16:05:00Z | Add feedback loop analogy and RH interpretation intro cards to ControlTheoryPage | ControlTheoryPage.jsx |
| 51 | 2026-03-02T16:10:00Z | Fix OscillatorChainViz explainer claiming L=log(p), C=1/log(p) give ω=log(p) when they give ω=1 | OscillatorChainViz.jsx |
| 52 | 2026-03-02T16:15:00Z | Fix pair correlation using linear density approximation instead of exact Weyl-law unfolding | GUEStatisticsViz.jsx |
| 53 | 2026-03-02T16:20:00Z | Fix ThermodynamicsTab 4th chart (Specific Heat) clipped by insufficient SVG height (680→800) | SupercriticalViz.jsx |
| 54 | 2026-03-02T16:25:00Z | Add x-axis tick marks and labels to AnimatedModesViz log-space waveform display | AnimatedModesViz.jsx |
| 55 | 2026-03-02T16:30:00Z | Add nearest-zero proximity indicator to t slider in ThermodynamicsTab | SupercriticalViz.jsx |
| 56 | 2026-03-02T16:35:00Z | Memoize PerPrimeTab stat grid to avoid redundant oscillatorStage calls on re-render | TwinOscillatorSimViz.jsx |
| 57 | 2026-03-02T16:40:00Z | Replace O(n) repeated complex multiplication with O(1) De Moivre in LiCriterionViz | LiCriterionViz.jsx |
| 58 | 2026-03-02T16:45:00Z | Add research area guide cards to LiteraturePage explaining spectral and engineering threads | LiteraturePage.jsx |
| 59 | 2026-03-02T16:50:00Z | Fix pair correlation histogram normalization to match R₂ scale instead of probability density | GUEStatisticsViz.jsx |
| 60 | 2026-03-02T16:55:00Z | Fix pair correlation missing factor of 2 for unordered-to-ordered pair count conversion | GUEStatisticsViz.jsx |
| 61 | 2026-03-02T17:00:00Z | Fix group delay computation missing phase unwrapping at ±π atan2 boundary | WaveSimViz.jsx |
| 62 | 2026-03-02T17:05:00Z | Add nearest-zero proximity indicator to all t sliders in TwinOscillatorSimViz | TwinOscillatorSimViz.jsx |
| 63 | 2026-03-02T17:10:00Z | Add horizontal gridlines to HamiltonianViz for easier energy value reading | HamiltonianViz.jsx |
| 64 | 2026-03-02T17:15:00Z | Pre-compute 256-entry colormap palette to eliminate per-pixel interpolation in ZetaLandscapeViz heatmap | ZetaLandscapeViz.jsx |
| 65 | 2026-03-02T17:20:00Z | Memoize hamiltonianSigmaScan to avoid recomputing on window resize | HamiltonianViz.jsx |
| 66 | 2026-03-02T17:25:00Z | Avoid per-frame canvas buffer reallocation in AnimatedModesViz animation loop | AnimatedModesViz.jsx |
| 67 | 2026-03-02T17:30:00Z | Add de Bruijn-Newman constant exploration entry explaining heat flow and oscillator chain dissipation | explorations.js |
| 68 | 2026-03-02T17:35:00Z | Fix signal flow legend showing amplitude ratio instead of power fraction for transmitted/reflected percentages | WaveSimViz.jsx |
| 69 | 2026-03-02T17:40:00Z | Fix swapped |χ| region annotations in ScatteringMatrixViz magnitude mode | ScatteringMatrixViz.jsx |
| 70 | 2026-03-03T00:00:00Z | Fix wrong sign in entropy formula: S = log|ζ| − σ·∂log|ζ|/∂σ, not plus | supercritical.js |
| 71 | 2026-03-03T06:00:00Z | Show metric value in Energy Landscape hover tooltip alongside σ and t coordinates | EnergyLandscapeViz.jsx |
| 72 | 2026-03-03T12:00:00Z | Fix bridge scattering matrix using ξ(s) (completed zeta) instead of proper transmission coefficient τ | OscillatorsPage.jsx |
| 73 | 2026-03-03T12:05:00Z | Add right-side y-axis for mismatch curve in Spectral Energy tab of FourierDomainViz | FourierDomainViz.jsx |
| 74 | 2026-03-03T18:00:00Z | Memoize bridge data array in ScatteringMatrixViz to avoid recomputing on mode switch or resize | ScatteringMatrixViz.jsx |
| 75 | 2026-03-03T18:30:00Z | Add Hilbert-Pólya conjecture exploration entry connecting spectral theory to oscillator model | explorations.js |
| 76 | 2026-03-03T19:00:00Z | Fix stale hardcoded Pages (9→15) and Visualizations (14→17) counts on HomePage | HomePage.jsx |
| 77 | 2026-03-04T00:00:00Z | Fix Spectral Energy right y-axis label showing |E_dir − E_dual| instead of |Z_dir − Z_dual| | FourierDomainViz.jsx |
| 78 | 2026-03-04T03:00:00Z | Eliminate redundant zetaExtended calls in thermodynamicState specific heat computation | supercritical.js |
| 79 | 2026-03-04T06:00:00Z | Fix heatEvolvedXi applying Gaussian smoothing for negative τ (backward heat flow) instead of returning unsmoothed Z(t) | supercritical.js |
| 80 | 2026-03-03T18:00:00Z | Add Mertens function exploration entry on inverse cascade and constructive interference of zero modes | explorations.js |
| 81 | 2026-03-03T19:00:00Z | Fix StatisticsPage Keiper-Li description omitting +½ constant from asymptotic formula | StatisticsPage.jsx |
| 82 | 2026-03-03T20:00:00Z | Add expand/collapse chevron indicator to exploration entries | ExplorationsPage.jsx |
| 83 | 2026-03-03T21:00:00Z | Add hover-to-inspect hint text on Energy Landscape heatmap when not hovering | EnergyLandscapeViz.jsx |
| 84 | 2026-03-03T22:00:00Z | Add shaded area between PNT line and spectral approximation in ExplicitFormulaViz | ExplicitFormulaViz.jsx |
| 85 | 2026-03-03T23:00:00Z | Add missing y-axis labels to all three modes in PrimeGapCouplingViz | PrimeGapCouplingViz.jsx |
| 86 | 2026-03-03T23:30:00Z | Derive negative frequency Nyquist contour via Schwarz reflection instead of recomputing 301 zeta evaluations | NyquistBodeViz.jsx |
| 87 | 2026-03-03T23:45:00Z | Add tab-by-tab exploration guide card to SupercriticalPage | SupercriticalPage.jsx |
| 88 | 2026-03-03T12:00:00Z | Fix wrong claim that Euler product gain diverges at zeta zeros | FourierDomainViz.jsx |
| 89 | 2026-03-04T00:00:00Z | Fix Extended Landscape explainer claiming bottom panel is a 2D heatmap when it shows a 1D phase curve | SupercriticalViz.jsx |
| 90 | 2026-03-03T22:00:00Z | Add hover tooltips to Euler product factor bars and cumulative magnitude dots | EulerProductViz.jsx |
| 91 | 2026-03-03T19:30:00Z | Show highest zero frequency (γ_max) next to Zeta Zeros Used slider in ExplicitFormulaViz | ExplicitFormulaViz.jsx |
| 92 | 2026-03-04T06:30:00Z | Fix GUE legend swatches showing lines for histogram data in spacing and pair-correlation modes | GUEStatisticsViz.jsx |
| 93 | 2026-03-04T07:00:00Z | Add missing y-axis labels to all three modes in GUEStatisticsViz | GUEStatisticsViz.jsx |
| 94 | 2026-03-03T07:30:00Z | Fix kinetic energy formula using H_p* (conjugate) instead of H_p(1-s) (dual) in HamiltonianViz | HamiltonianViz.jsx |
| 95 | 2026-03-03T08:00:00Z | Add nearest-zero proximity indicator to t slider in WaveSimViz | WaveSimViz.jsx |
| 96 | 2026-03-03T18:30:00Z | Fix Euler factor bar heights using y-scale instead of fixed linear formula in EulerProductViz | EulerProductViz.jsx |
| 97 | 2026-03-03T20:00:00Z | Fix explainer wrongly claiming prime superposition is the ρ-th term of the explicit formula | AnimatedModesViz.jsx |
| 98 | 2026-03-03T21:00:00Z | Add nearest-zero proximity indicator to t slider in OscillatorChainViz | OscillatorChainViz.jsx |
| 99 | 2026-03-03T21:30:00Z | Add axis tick marks and labels to ZetaLandscapeViz heatmap mode | ZetaLandscapeViz.jsx |
| 100 | 2026-03-03T22:00:00Z | Precompute cumulative ψ(x) table to avoid redundant vonMangoldt summation in ExplicitFormulaViz | ExplicitFormulaViz.jsx |
| 101 | 2026-03-03T22:30:00Z | Remove non-functional Primes slider from NyquistBodeViz | NyquistBodeViz.jsx |
| 102 | 2026-03-03T23:00:00Z | Add tab-by-tab exploration guide card to StatisticsPage | StatisticsPage.jsx |
| 103 | 2026-03-03T23:30:00Z | Fix DocsPage Hamiltonian formula using H_p* (conjugate) instead of H_p(1-s) (dual) | DocsPage.jsx |
| 104 | 2026-03-04T00:00:00Z | Fix vonMangoldtSpectrum missing primes >541 due to wrong loop break and missing prime fallback | supercritical.js |
| 105 | 2026-03-03T21:00:00Z | Fix Frequency Response explainer wrongly claiming resonances are sharpest at σ=0.5 | FourierDomainViz.jsx |
| 106 | 2026-03-03T12:00:00Z | Add category color legend to ExplorationGraphViz force-directed graph | ExplorationGraphViz.jsx |
| 107 | 2026-03-03T12:15:00Z | Memoize zetaMagnitudeScan in ExtendedLandscapeTab to avoid 300 zeta evaluations on resize | SupercriticalViz.jsx |
| 108 | 2026-03-03T19:30:00Z | Add zero-free regions as stability margins exploration entry connecting PNT error to Nyquist gain margin | explorations.js |
| 109 | 2026-03-03T12:30:00Z | Fix HamiltonianViz explainer wrongly claiming impedance mismatch vanishes at σ=0.5 | HamiltonianViz.jsx |
| 110 | 2026-03-03T13:00:00Z | Add nearest-zero proximity indicator to t slider in EulerProductViz | EulerProductViz.jsx |
| 111 | 2026-03-03T14:00:00Z | Add right-side y-axis for cumulative delay scale in Phase & Delay tab | WaveSimViz.jsx |
| 112 | 2026-03-03T18:30:00Z | Add missing axis labels to all three modes of LiCriterionViz | LiCriterionViz.jsx |
| 113 | 2026-03-03T19:00:00Z | Fix DocsPage stale counts (13→15 pages, 16→17 viz) and add missing Waves and Improvements pages | DocsPage.jsx |
| 114 | 2026-03-03T19:30:00Z | Fix bridge scattering matrix wrong sign: S₂₂ should be −Γ not +Γ for unitarity | OscillatorsPage.jsx |
| 115 | 2026-03-03T20:00:00Z | Fix explainer calling ψ(x) 'the prime counting function' and giving wrong oscillation trig form | ExplicitFormulaViz.jsx |
| 116 | 2026-03-03T20:30:00Z | Show highest zero frequency (γ_max) next to Zeros Used slider in GUEStatisticsViz | GUEStatisticsViz.jsx |
| 117 | 2026-03-03T21:00:00Z | Add missing y-axis label to Gradient Descent bottom panel (σ vs Step) | TwinOscillatorSimViz.jsx |
| 118 | 2026-03-03T21:30:00Z | Add horizontal gridlines to all three modes of PrimeGapCouplingViz for easier value reading | PrimeGapCouplingViz.jsx |
| 119 | 2026-03-03T22:00:00Z | Memoize ConvergenceTab curve data to avoid recomputing 378 Hamiltonian evaluations on resize | TwinOscillatorSimViz.jsx |
| 120 | 2026-03-03T22:30:00Z | Add primon gas exploration entry connecting zeta partition function to oscillator chain thermodynamics | explorations.js |
| 121 | 2026-03-03T23:00:00Z | Add Montgomery pair correlation exploration entry on level repulsion and GUE universality in the oscillator chain | explorations.js |
| 122 | 2026-03-03T23:30:00Z | Fix spectralEnergyDensity dual ladder using conjugate s* instead of reflected (1−σ,ω) | supercritical.js |
| 123 | 2026-03-03T23:45:00Z | Show largest prime (p_max) next to Primes slider count in AnimatedModesViz | AnimatedModesViz.jsx |
| 124 | 2026-03-03T12:00:00Z | Fix AnimatedModesViz amplitude ignoring zero frequency γₙ (was 1/√p, now Re(p^{-1/2-iγₙ})) | AnimatedModesViz.jsx |
| 125 | 2026-03-03T12:30:00Z | Add horizontal gridlines to all four ThermodynamicsTab charts in SupercriticalViz | SupercriticalViz.jsx |
| 126 | 2026-03-03T13:00:00Z | Hoist constant reference curves to module level in GUEStatisticsViz to avoid recomputing on every draw | GUEStatisticsViz.jsx |
| 127 | 2026-03-03T13:30:00Z | Memoize Nyquist and Bode loop-gain data to avoid recomputing 1104 zeta evaluations on resize | NyquistBodeViz.jsx |
| 128 | 2026-03-03T14:00:00Z | Add navigation guide card to ExplorationsPage explaining categories and depth scale | ExplorationsPage.jsx |
| 129 | 2026-03-03T14:30:00Z | Fix phase response chart using curveBasis interpolation across ±π atan2 wrap discontinuities | FourierDomainViz.jsx |
| 130 | 2026-03-03T15:00:00Z | Fix inverted de Bruijn-Newman heat flow direction: τ>0 preserves real zeros, τ<0 scatters them | supercritical.js, SupercriticalViz.jsx |
| 131 | 2026-03-03T15:30:00Z | Fix inverted heat flow direction in LiCriterionViz de Bruijn-Newman scatter plot | LiCriterionViz.jsx |
| 132 | 2026-03-03T16:00:00Z | Fix BridgeTab annotation using ASCII "chi" instead of Unicode "χ" for bridge magnitude label | TwinOscillatorSimViz.jsx |
| 133 | 2026-03-03T16:30:00Z | Fix de Bruijn-Newman "Look for" text contradicting corrected heat flow direction | LiCriterionViz.jsx |
| 134 | 2026-03-03T17:00:00Z | Show largest prime (p_max) next to Primes slider count in HamiltonianViz | HamiltonianViz.jsx |
| 135 | 2026-03-03T18:00:00Z | Add horizontal gridlines to MultiZeroTab scatter plot for easier σ_min reading | TwinOscillatorSimViz.jsx |
| 136 | 2026-03-03T18:30:00Z | Memoize 10,000-cell heatmap grid in ZetaLandscapeViz to avoid recomputing zeta on resize | ZetaLandscapeViz.jsx |
| 137 | 2026-03-03T19:00:00Z | Add observation guide card to OscillatorsPage explaining what to look for in chain and Euler product | OscillatorsPage.jsx |
| 138 | 2026-03-03T19:30:00Z | Add Keating-Snaith moment conjecture exploration entry on power statistics of the oscillator chain output | explorations.js |
| 139 | 2026-03-03T20:00:00Z | Fix phase mode using curveBasis interpolation across ±π atan2 wrap discontinuities in ScatteringMatrixViz | ScatteringMatrixViz.jsx |
| 140 | 2026-03-03T20:30:00Z | Fix EnergyLandscapeViz explainer claiming mismatch shows |Z|² (actually |Z|) and is zero on critical line (actually minimized) | EnergyLandscapeViz.jsx |
| 141 | 2026-03-03T21:00:00Z | Show largest prime (p_max) next to Max Primes slider count in EulerProductViz | EulerProductViz.jsx |
| 142 | 2026-03-03T21:30:00Z | Scale horizontal connector opacity and width by per-stage magnitude in OscillatorChainViz | OscillatorChainViz.jsx |
