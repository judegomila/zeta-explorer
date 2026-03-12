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
| 143 | 2026-03-03T22:00:00Z | Memoize primeHarmonicDecomposition to eliminate duplicate computation in PrimeHarmonicsTab | FourierDomainViz.jsx |
| 144 | 2026-03-03T22:30:00Z | Add suggested learning path to HomePage guiding users through pages in logical progression | HomePage.jsx |
| 145 | 2026-03-03T23:00:00Z | Add visualization-by-visualization exploration guide card to ModesPage | ModesPage.jsx |
| 146 | 2026-03-03T23:30:00Z | Fix Bode phase plot using curveBasis interpolation across ±180° atan2 wrap discontinuities | NyquistBodeViz.jsx |
| 147 | 2026-03-04T00:00:00Z | Add hover tooltips to all data bars and dots in PrimeGapCouplingViz showing prime pair, gap, and coupling info | PrimeGapCouplingViz.jsx |
| 148 | 2026-03-03T23:45:00Z | Fix EulerPhaseTab average factor magnitude line drawn as static orange instead of green/red convergence coloring | SupercriticalViz.jsx |
| 149 | 2026-03-03T12:00:00Z | Add y-axis tick marks and amplitude gridlines to critical-line Z(t) chart in ZetaLandscapeViz | ZetaLandscapeViz.jsx |
| 150 | 2026-03-03T12:30:00Z | Fix stale docstring comments claiming τ>0 scatters zeros (actually τ<0 does) in supercritical.js | supercritical.js |
| 151 | 2026-03-03T21:00:00Z | Fix number variance explainer showing leading-order asymptotic instead of the full GUE formula actually plotted | GUEStatisticsViz.jsx |
| 152 | 2026-03-03T23:00:00Z | Add nearest-zero proximity indicator to t slider in EulerPhaseTab | SupercriticalViz.jsx |
| 153 | 2026-03-03T23:30:00Z | Add horizontal gridlines to both Bode magnitude and phase panels in NyquistBodeViz | NyquistBodeViz.jsx |
| 154 | 2026-03-03T23:50:00Z | Memoize Li coefficient and de Bruijn-Newman scatter data to avoid recomputing on resize | LiCriterionViz.jsx |
| 155 | 2026-03-03T19:00:00Z | Add Voronin universality exploration entry connecting oscillator chain ergodicity to universal approximation | explorations.js |
| 156 | 2026-03-03T12:45:00Z | Fix EulerProductViz phase curve using curveMonotoneX across ±π atan2 wrap discontinuities | EulerProductViz.jsx |
| 157 | 2026-03-03T20:30:00Z | Fix D3 force simulation not stopped on unmount in ExplorationGraphViz causing CPU leak | ExplorationGraphViz.jsx |
| 158 | 2026-03-03T13:15:00Z | Fix Wave Interference explainer using wrong term "constructive interference" for amplitude matching | WaveSimViz.jsx |
| 159 | 2026-03-03T13:30:00Z | Show largest prime (p_max) next to Primes slider count in SupercriticalViz ThermodynamicsTab and EulerPhaseTab | SupercriticalViz.jsx |
| 160 | 2026-03-03T14:00:00Z | Add horizontal gridlines to Von Mangoldt Spectrum tab for easier magnitude reading | FourierDomainViz.jsx |
| 161 | 2026-03-03T14:30:00Z | Show dual ladder |ζ(1−s)| in OscillatorChainViz top-right summary alongside direct |ζ(s)| | OscillatorChainViz.jsx |
| 162 | 2026-03-03T15:00:00Z | Memoize Euler product and true zeta computations to avoid recomputing on resize | EulerProductViz.jsx |
| 163 | 2026-03-03T15:30:00Z | Add Gram points exploration entry connecting theta function phase ticks to oscillator mode spacing | explorations.js |
| 164 | 2026-03-03T16:00:00Z | Add per-visualization exploration guide card to HamiltonianPage for energy and explicit formula charts | HamiltonianPage.jsx |
| 165 | 2026-03-03T16:30:00Z | Fix AnimatedModesViz pause resetting animation to t=0 instead of freezing in place | AnimatedModesViz.jsx |
| 166 | 2026-03-03T17:00:00Z | Fix PerPrimeTab explainer wrongly attributing dual symmetry to the functional equation | TwinOscillatorSimViz.jsx |
| 167 | 2026-03-03T17:30:00Z | Fix explicit formula display omitting trivial zeros term ½log(1 − x⁻²) | ExplicitFormulaViz.jsx |
| 168 | 2026-03-03T18:00:00Z | Show largest prime (p_max) next to Primes slider count in WaveSimViz | WaveSimViz.jsx |
| 169 | 2026-03-03T18:30:00Z | Fix Riemann-Siegel C₀ correction producing NaN at removable singularities p=1/4 and p=3/4 | zeta.js |
| 170 | 2026-03-03T19:00:00Z | Add horizontal gridlines to PerPrimeTab and BridgeTab charts in TwinOscillatorSimViz | TwinOscillatorSimViz.jsx |
| 171 | 2026-03-03T19:30:00Z | Memoize explicit formula data arrays to avoid recomputing psiTable and zero sums on resize | ExplicitFormulaViz.jsx |
| 172 | 2026-03-03T20:00:00Z | Add Dirichlet L-functions exploration entry on character-twisted oscillator chains and GRH | explorations.js |
| 173 | 2026-03-03T20:30:00Z | Add Riemann-Siegel formula computation explainer card to ZetaPage | ZetaPage.jsx |
| 174 | 2026-03-03T21:00:00Z | Fix DocsPage stale counts (15→16 pages, 17→18 viz) and add missing Rigor page, WaveSimViz, RHRigorViz entries | DocsPage.jsx |
| 175 | 2026-03-03T21:30:00Z | Fix spectralEnergyDensity dual ladder using wrong sign for imaginary part (ω instead of −ω) | supercritical.js |
| 176 | 2026-03-03T22:00:00Z | Fix EnergyLandscapeViz missing window resize handler causing blurry/distorted heatmap | EnergyLandscapeViz.jsx |
| 177 | 2026-03-03T22:30:00Z | Show largest prime (p_max) next to Primes slider count in RHRigorViz | RHRigorViz.jsx |
| 178 | 2026-03-03T23:00:00Z | Fix StatisticsPage de Bruijn-Newman description claiming positive τ scatters zeros (actually negative τ does) | StatisticsPage.jsx |
| 179 | 2026-03-03T23:30:00Z | Add horizontal gridlines to all three modes of ScatteringMatrixViz | ScatteringMatrixViz.jsx |
| 180 | 2026-03-03T23:45:00Z | Add legends to both EulerPhaseTab charts showing convergence coloring and reference lines | SupercriticalViz.jsx |
| 181 | 2026-03-03T23:55:00Z | Fix blurry canvas rendering on retina displays in WaveSimViz SignalFlowTab and WaveInterferenceTab | WaveSimViz.jsx |
| 182 | 2026-03-03T23:59:00Z | Fix Spectral Decomposition formula equating complex x^ρ/ρ with real cosine (missing conjugate pair and factor of 2) | HamiltonianPage.jsx |
| 183 | 2026-03-03T12:00:00Z | Show largest prime (p_max) next to Primes slider count in all three FourierDomainViz tabs | FourierDomainViz.jsx |
| 184 | 2026-03-03T12:30:00Z | Memoize prime gap data array in PrimeGapCouplingViz to avoid recomputing on mode switch and resize | PrimeGapCouplingViz.jsx |
| 185 | 2026-03-03T13:00:00Z | Memoize group delay computation in PhaseDelayTab to avoid recomputing oscillator stages on resize | WaveSimViz.jsx |
| 186 | 2026-03-03T13:30:00Z | Add "What to Explore" guide card to ControlTheoryPage for Nyquist, Bode, and Scattering visualizations | ControlTheoryPage.jsx |
| 187 | 2026-03-03T14:00:00Z | Add Davenport-Heilbronn counterexample exploration entry showing why functional equation alone is insufficient for RH | explorations.js |
| 188 | 2026-03-03T14:30:00Z | Fix waveform off-by-one causing curves to stop one sample short of rightmost x-axis tick in AnimatedModesViz | AnimatedModesViz.jsx |
| 189 | 2026-03-03T15:00:00Z | Fix hardcoded devicePixelRatio=2 in AnimatedModesViz and EnergyLandscapeViz causing wrong canvas scaling on non-retina displays | AnimatedModesViz.jsx, EnergyLandscapeViz.jsx |
| 190 | 2026-03-03T15:30:00Z | Fix Wave Interference explainer wrongly claiming difference is near zero at σ=0.5 | WaveSimViz.jsx |
| 191 | 2026-03-03T16:00:00Z | Show largest prime (p_max) next to Primes slider count in PrimeGapCouplingViz | PrimeGapCouplingViz.jsx |
| 192 | 2026-03-03T16:30:00Z | Add pass/fail legend to MultiZeroTab scatter plot in TwinOscillatorSimViz | TwinOscillatorSimViz.jsx |
| 193 | 2026-03-03T17:00:00Z | Fix hardcoded devicePixelRatio=2 in ZetaLandscapeViz causing wrong canvas scaling on non-retina displays | ZetaLandscapeViz.jsx |
| 194 | 2026-03-03T17:30:00Z | Memoize directLadder, dualLadder, and losslessBridge data in OscillatorChainViz to avoid recomputing on resize and stage click | OscillatorChainViz.jsx |
| 195 | 2026-03-03T18:00:00Z | Add "What to Explore" guide card to ZetaPage for Critical Line and Heatmap modes | ZetaPage.jsx |
| 196 | 2026-03-03T18:30:00Z | Fix ScatteringMatrixViz phase explainer describing phase-vs-t behavior when chart shows phase-vs-σ | ScatteringMatrixViz.jsx |
| 197 | 2026-03-03T19:00:00Z | Show highest zero frequency (γ_max) next to Zeros Used slider in LiCriterionViz | LiCriterionViz.jsx |
| 198 | 2026-03-03T19:30:00Z | Add legend to Hamiltonian test chart in RHRigorViz showing dot colors, trajectory line, and zero bands | RHRigorViz.jsx |
| 199 | 2026-03-03T20:00:00Z | Memoize per-prime energy curves in PerPrimeTab to avoid recomputing 640+ oscillatorStage calls on resize | TwinOscillatorSimViz.jsx |
| 200 | 2026-03-03T20:30:00Z | Add Hadamard product exploration entry showing the zero-factorization dual to the Euler product | explorations.js |
| 201 | 2026-03-03T21:00:00Z | Fix GradientDescentTab canvas not redrawing on window resize causing stretched/blurry display | TwinOscillatorSimViz.jsx |
| 202 | 2026-03-03T22:00:00Z | Fix explicit formula explainer claiming arg(ρ) ≈ π/2 'for all zeros' and missing factor of 2 | ExplicitFormulaViz.jsx |
| 203 | 2026-03-03T22:30:00Z | Show largest prime (p_max) next to Primes slider count in TwinOscillatorSimViz and OscillatorChainViz | TwinOscillatorSimViz.jsx, OscillatorChainViz.jsx |
| 204 | 2026-03-03T23:00:00Z | Fix WaveSimPage wrongly claiming Γ = (Z_dir − Z_dual)/(Z_dir + Z_dual) = 0 at σ=½; impedances are conjugate-matched, not equal | WaveSimPage.jsx |
| 205 | 2026-03-03T23:30:00Z | Add horizontal gridlines to both magnitude and phase panels in FrequencyResponseTab Bode diagram | FourierDomainViz.jsx |
| 206 | 2026-03-03T23:45:00Z | Fix Spectral Energy explainer wrongly claiming impedance mismatch vanishes at σ=½ (it equals 2|Im Z|, not zero) | FourierDomainViz.jsx |
| 207 | 2026-03-03T23:55:00Z | Fix Poisson reference line slope in number-variance plot drawing Σ²=L/4 instead of Σ²=L | GUEStatisticsViz.jsx |
| 208 | 2026-03-03T12:00:00Z | Precompute per-prime constants in AnimatedModesViz to avoid redundant Math.log/sqrt/cos calls per animation frame | AnimatedModesViz.jsx |
| 209 | 2026-03-03T23:59:00Z | Add γ_max display next to Zeros slider in SupercriticalViz Heat Flow tab | SupercriticalViz.jsx |
| 210 | 2026-03-04T00:30:00Z | Add Selberg Central Limit Theorem exploration entry connecting Gaussian statistics to oscillator cascade | explorations.js |
| 211 | 2026-03-04T01:00:00Z | Add label and legend entry for R₂=1 reference line in pair-correlation plot | GUEStatisticsViz.jsx |
| 212 | 2026-03-04T01:30:00Z | Memoize eulerProductPhaseAnalysis data in EulerPhaseTab to avoid recomputing 150-point scan on resize | SupercriticalViz.jsx |
| 213 | 2026-03-04T02:00:00Z | Fix pair-correlation reference curve missing R₂(0)=0 boundary point due to loop starting at r=0.01 | GUEStatisticsViz.jsx |
| 214 | 2026-03-03T12:00:00Z | Fix OscillatorChainViz explainer saying 'impedance-matched' instead of 'conjugate-matched' at σ=0.5 | OscillatorChainViz.jsx |
| 215 | 2026-03-04T02:30:00Z | Fix ZetaPage claiming θ'(t) is the local zero density when the density is θ'(t)/π | ZetaPage.jsx |
| 216 | 2026-03-04T03:00:00Z | Show largest prime (p_max) next to Primes slider count in EnergyLandscapeViz | EnergyLandscapeViz.jsx |
| 217 | 2026-03-04T03:30:00Z | Add legend to critical-line Z(t) chart in ZetaLandscapeViz showing positive/negative/zero color coding | ZetaLandscapeViz.jsx |
| 218 | 2026-03-03T12:00:00Z | Add horizontal gridlines to magnitude axis in EulerProductViz for easier value reading | EulerProductViz.jsx |
| 219 | 2026-03-03T12:30:00Z | Memoize per-prime stage data in WaveInterferenceTab to avoid recomputing oscillatorStage on every animation frame | WaveSimViz.jsx |
| 220 | 2026-03-03T12:45:00Z | Fix mismatch test using independent y-scales for on-line and off-line curves, hiding visual comparison | RHRigorViz.jsx |
| 221 | 2026-03-03T13:00:00Z | Fix SimulatorPage claiming Z_dir = Z_dual (impedance match) when actually Z_dir = Z*_dual (conjugate match) at σ=½ | SimulatorPage.jsx |
| 222 | 2026-03-03T13:15:00Z | Fix ModesPage claiming impedance mismatch 'vanishes' on the critical line (it is minimized, not zero) | ModesPage.jsx |
| 223 | 2026-03-03T13:30:00Z | Add "What to Explore" guide card to RHRigorPage explaining each stress test and what to look for | RHRigorPage.jsx |
| 224 | 2026-03-03T14:00:00Z | Add horizontal gridlines to all three ConvergenceTab sub-charts in TwinOscillatorSimViz | TwinOscillatorSimViz.jsx |
| 225 | 2026-03-03T14:30:00Z | Memoize mismatch test derived statistics to avoid 6 array iterations on every draw/resize in RHRigorViz | RHRigorViz.jsx |
| 226 | 2026-03-03T15:00:00Z | Fix stale hardcoded Visualizations count (17→18) on HomePage | HomePage.jsx |
| 227 | 2026-03-03T15:30:00Z | Add nearest-zero proximity indicator to t slider in ExtendedLandscapeTab of SupercriticalViz | SupercriticalViz.jsx |
| 228 | 2026-03-03T16:00:00Z | Add horizontal gridlines to all three modes of LiCriterionViz for easier value reading | LiCriterionViz.jsx |
| 229 | 2026-03-03T16:30:00Z | Fix DocsPage Mathematical Model section saying 'impedance-matched' and 'mismatch vanishes' at σ=½ | DocsPage.jsx |
| 230 | 2026-03-03T17:00:00Z | Memoize directLadder, dualLadder, and losslessBridge in SignalFlowTab to avoid recomputing on every animation frame | WaveSimViz.jsx |
| 231 | 2026-03-03T17:30:00Z | Add tab-explainer blocks to all three stress test modes in RHRigorViz | RHRigorViz.jsx |
| 232 | 2026-03-03T18:00:00Z | Fix heatEvolvedXi ignoring its numTerms parameter, always using hardcoded 31 samples | supercritical.js |
| 233 | 2026-03-03T18:30:00Z | Fix stale hardcoded Pages count (15→16) on HomePage | HomePage.jsx |
| 234 | 2026-03-03T19:00:00Z | Fix HamiltonianPage claiming mismatch vanishes and Z_dir = Z_dual at σ=½ (conjugate-matched, minimized not zero) | HamiltonianPage.jsx |
| 235 | 2026-03-03T19:30:00Z | Add scroll-to-top on route change so pages always start at the top | App.jsx |
| 236 | 2026-03-03T20:00:00Z | Add legend to GradientDescentTab canvas showing H(σ) curve, descent path, critical line, and convergence | TwinOscillatorSimViz.jsx |
| 237 | 2026-03-03T20:30:00Z | Memoize thermodynamicScan in ThermodynamicsTab to avoid recomputing 120-point scan on resize | SupercriticalViz.jsx |
| 238 | 2026-03-03T21:00:00Z | Memoize all three GUE statistics (spacing, pair-correlation, number-variance) to avoid recomputing on resize and mode switch | GUEStatisticsViz.jsx |
| 239 | 2026-03-03T21:30:00Z | Add thermodynamic quantity explainer cards (F, S, C_v, P) to SupercriticalPage | SupercriticalPage.jsx |
| 240 | 2026-03-03T22:00:00Z | Fix SupercriticalPage inverting de Bruijn-Newman heat flow direction in two places | SupercriticalPage.jsx |
| 241 | 2026-03-03T22:30:00Z | Fix thermodynamicState producing -Infinity/NaN near zeta zeros due to missing Math.log zero guards | supercritical.js |
| 242 | 2026-03-03T23:00:00Z | Fix OscillatorsPage Dual Ladder card saying 'Impedance matches' instead of 'Conjugate-matches' on critical line | OscillatorsPage.jsx |
| 243 | 2026-03-03T23:30:00Z | Fix RHRigorPage conflating 'bounded below' with 'self-adjoint' in Hilbert-Pólya program description | RHRigorPage.jsx |
| 244 | 2026-03-03T23:45:00Z | Make Play/Pause button always visible across all tabs in WaveSimViz with 'animating' hint on non-animated tabs | WaveSimViz.jsx |
| 245 | 2026-03-04T00:00:00Z | Memoize vonMangoldtSpectrum in VonMangoldtSpectrumTab to avoid recomputing 24,000 trig calls on resize | FourierDomainViz.jsx |
| 246 | 2026-03-03T12:00:00Z | Fix bandwidth formula off by factor of log(p): BW = 2σ, not 2σ·log(p) | oscillators.js, supercritical.js |
| 247 | 2026-03-03T12:30:00Z | Fix HomePage correspondence table saying 'Perfect impedance match' instead of 'Conjugate impedance match' at σ=½ | HomePage.jsx |
| 248 | 2026-03-03T13:00:00Z | Add y-axis tick marks to mismatch test panel in RHRigorViz | RHRigorViz.jsx |
| 249 | 2026-03-03T13:30:00Z | Memoize bridge σ-scan data in BridgeTab to avoid recomputing 101 losslessBridge calls on resize | TwinOscillatorSimViz.jsx |
| 250 | 2026-03-03T14:00:00Z | Add RH significance context to MultiZeroTab explainer in TwinOscillatorSimViz | TwinOscillatorSimViz.jsx |
| 251 | 2026-03-03T14:30:00Z | Add pagination (20 per page) to ImprovementsPage to avoid rendering 250+ cards at once | ImprovementsPage.jsx |
| 252 | 2026-03-03T15:00:00Z | Add y-axis tick marks and gridlines to both Penrose Transform panels in TwistorViz | TwistorViz.jsx |
| 253 | 2026-03-03T15:30:00Z | Memoize incidence status computation in TwistorViz to avoid redundant twistor+incidence calls on tab switch and play toggle | TwistorViz.jsx |
| 254 | 2026-03-03T22:09:23Z | Fix GUE number variance reference curve using GOE coefficient 2/π² instead of correct GUE coefficient 1/π² | GUEStatisticsViz.jsx |
| 255 | 2026-03-03T16:30:00Z | Fix incidence relation using Hermitian inner product (grows as t²) instead of symplectic form (vanishes at σ=0.5) | twistor.js |
| 256 | 2026-03-03T17:00:00Z | Fix WaveSimViz saying 'perfect impedance match' instead of 'conjugate impedance match' at σ=½ | WaveSimViz.jsx |
| 257 | 2026-03-03T17:30:00Z | Add nearest-zero proximity indicator to t slider in TwistorViz | TwistorViz.jsx |
| 258 | 2026-03-03T18:00:00Z | Add dark halo to zeta zero markers in TwistorViz incidence heatmap for better visibility | TwistorViz.jsx |
| 259 | 2026-03-03T18:30:00Z | Scale AnimatedModesViz canvas height with numPrimes to keep waveforms readable at high prime counts | AnimatedModesViz.jsx |
| 260 | 2026-03-03T19:00:00Z | Fix TwistorPage saying 'impedance match' instead of 'conjugate impedance match' at σ=½ | TwistorPage.jsx |
| 261 | 2026-03-03T19:30:00Z | Show visible zeta zeros count next to t max slider in EnergyLandscapeViz | EnergyLandscapeViz.jsx |
| 262 | 2026-03-03T19:45:00Z | Make nearest-zero proximity indicator clickable to snap t slider to exact zero value in HamiltonianViz | HamiltonianViz.jsx |
| 263 | 2026-03-03T20:00:00Z | Fix stale hardcoded Pages (16→17) and Visualizations (18→19) counts on HomePage after TwistorPage addition | HomePage.jsx |
| 264 | 2026-03-03T20:30:00Z | Add "What to Explore in Each Tab" guide card to TwistorPage | TwistorPage.jsx |
| 265 | 2026-03-03T21:00:00Z | Add σ=0.5 value markers to reflection and phase modes in ScatteringMatrixViz | ScatteringMatrixViz.jsx |
| 266 | 2026-03-03T21:30:00Z | Avoid per-frame canvas buffer reallocation in DualPairTab animation loop in TwistorViz | TwistorViz.jsx |
| 267 | 2026-03-03T22:15:00Z | Add text labels to unlabeled σ=½ and σ=1 reference lines in ThermodynamicsTab charts | SupercriticalViz.jsx |
| 268 | 2026-03-03T22:30:00Z | Fix Penrose Transform curves misaligned with axis labels due to i/n instead of i/(n-1) x-positioning | TwistorViz.jsx |
| 269 | 2026-03-03T23:00:00Z | Fix number variance explainer showing 2/π² coefficient instead of correct GUE 1/π² | GUEStatisticsViz.jsx |
| 270 | 2026-03-03T23:15:00Z | Fix Nyquist contour gradient off-by-one and apply missing gradient to negative frequency trace | NyquistBodeViz.jsx |
| 271 | 2026-03-03T23:30:00Z | Fix DocsPage calling log(p) the 'resonant frequency' when LC parameters give ω₀=1 | DocsPage.jsx |
| 272 | 2026-03-03T23:45:00Z | Fix DocsPage Riemann-Siegel formula missing (-1)^{N-1}(t/2π)^{-1/4} prefactor on C₀ correction term | DocsPage.jsx |
| 273 | 2026-03-03T23:55:00Z | Add missing horizontal gridlines to SpectralEnergyTab in FourierDomainViz | FourierDomainViz.jsx |
| 274 | 2026-03-03T12:00:00Z | Fix OscillatorsPage banner formula claiming ω_p=log(p) when LC resonant frequency is ω₀=1 | OscillatorsPage.jsx |
| 275 | 2026-03-03T12:15:00Z | Show visible zeta zeros count next to t range end slider in ZetaLandscapeViz | ZetaLandscapeViz.jsx |
| 276 | 2026-03-03T12:30:00Z | Show largest prime (p_max) next to Primes slider count in TwistorViz | TwistorViz.jsx |
| 277 | 2026-03-03T12:45:00Z | Add −180° text label to critical phase margin threshold line in Bode phase plot | NyquistBodeViz.jsx |
| 278 | 2026-03-03T13:00:00Z | Skip redundant gradient computation in hamiltonianSigmaScan | oscillators.js |
| 279 | 2026-03-03T13:15:00Z | Add 'Where to Start' suggested reading progression card to LiteraturePage | LiteraturePage.jsx |
| 280 | 2026-03-03T13:30:00Z | Fix pair-correlation histogram over-normalized by factor of 2 in GUEStatisticsViz | GUEStatisticsViz.jsx |
| 281 | 2026-03-03T13:45:00Z | Fix inverted imaginary axis in TwistorViz s-plane Correspondence diagram | TwistorViz.jsx |
| 282 | 2026-03-03T14:00:00Z | Fix PrimeGapCouplingViz frequency mode calling log(p) the "natural frequency" when LC resonance is ω₀=1 | PrimeGapCouplingViz.jsx |
| 283 | 2026-03-03T14:15:00Z | Fix misspelling "decoherring" → "decohering" in WaveSimPage intro text | WaveSimPage.jsx |
| 284 | 2026-03-03T14:30:00Z | Show visible zeta zeros count next to t-range sliders in RHRigorViz | RHRigorViz.jsx |
| 285 | 2026-03-03T14:45:00Z | Fix oscillatorStage resonantFreq returning log(p) instead of ω₀=1/√(LC)=1 | oscillators.js |
| 286 | 2026-03-03T15:00:00Z | Fix displayed entropy formula showing β²∂log|ζ|/∂β instead of correct log|ζ|−β·∂log|ζ|/∂β | SupercriticalPage.jsx |
| 287 | 2026-03-03T15:15:00Z | Add π-labeled y-axis ticks and gridlines to phase panel in ExtendedLandscapeTab | SupercriticalViz.jsx |
| 288 | 2026-03-03T15:30:00Z | Make nearest-zero proximity indicator clickable to snap t to exact zero value in EulerProductViz | EulerProductViz.jsx |
| 289 | 2026-03-03T15:45:00Z | Show visible zeta zeros count next to t max slider in NyquistBodeViz | NyquistBodeViz.jsx |
| 290 | 2026-03-03T16:00:00Z | Memoize ladderFrequencyResponse in FrequencyResponseTab to avoid recomputing 201×numPrimes Euler factor evaluations on resize | FourierDomainViz.jsx |
| 291 | 2026-03-03T16:15:00Z | Add 'Why Λ(n), Not π(x)?' explainer card to FourierPage explaining the von Mangoldt function's spectral advantage | FourierPage.jsx |
| 292 | 2026-03-03T16:30:00Z | Add Nyman-Beurling criterion exploration entry on L² completeness of oscillator modes and RH equivalence | explorations.js |
| 293 | 2026-03-03T16:45:00Z | Fix OscillatorChainViz explainer incorrectly calling log(p) the natural frequency when LC resonant frequency is ω₀=1 for all primes | OscillatorChainViz.jsx |
| 294 | 2026-03-03T17:00:00Z | Add axis name labels 'σ (Re s)' and 't (Im s)' to EnergyLandscapeViz heatmap | EnergyLandscapeViz.jsx |
| 295 | 2026-03-03T17:15:00Z | Memoize Hamiltonian test verdict statistics to avoid recomputing maxDev/avgDev on every canvas redraw | RHRigorViz.jsx |
| 296 | 2026-03-03T17:30:00Z | Fix SimulatorPage calling log(p) the 'natural frequency' when it is the characteristic impedance and ω₀=1 | SimulatorPage.jsx |
| 297 | 2026-03-03T18:00:00Z | Fix IncidenceRelationTab canvas not redrawing on window resize causing stretched/blurry heatmap | TwistorViz.jsx |
| 298 | 2026-03-03T18:15:00Z | Fix DocsPage intro calling log(p) the resonant frequency instead of the Euler factor phase rate | DocsPage.jsx |
| 299 | 2026-03-03T18:30:00Z | Make nearest-zero proximity indicator clickable to snap t to exact zero value in ScatteringMatrixViz | ScatteringMatrixViz.jsx |
| 300 | 2026-03-03T19:00:00Z | Make nearest-zero proximity indicator clickable to snap t to exact zero value in OscillatorChainViz | OscillatorChainViz.jsx |
| 301 | 2026-03-03T19:30:00Z | Show prime count context next to Max N slider in VonMangoldtSpectrumTab | FourierDomainViz.jsx |
| 302 | 2026-03-03T20:00:00Z | Add amplitude scale ticks and improve zero-line visibility in WaveInterferenceTab panels | WaveSimViz.jsx |
| 303 | 2026-03-03T20:15:00Z | Memoize spectralEnergyDensity in SpectralEnergyTab to avoid recomputing 120×numPrimes Euler factor evaluations on resize | FourierDomainViz.jsx |
| 304 | 2026-03-03T20:30:00Z | Fix GUE number variance reference curve using 1/π² instead of correct 2/π² prefactor | GUEStatisticsViz.jsx |
| 305 | 2026-03-03T20:45:00Z | Add Lindelöf Hypothesis exploration entry on bounded gain and subconvexity in the oscillator chain | explorations.js |
| 306 | 2026-03-03T21:00:00Z | Fix oscillators.js module docstring calling log(p) the natural frequency instead of the characteristic impedance | oscillators.js |
| 307 | 2026-03-03T21:15:00Z | Fix pair correlation histogram normalization dividing by zeros.length instead of pairDists.length | GUEStatisticsViz.jsx |
| 308 | 2026-03-03T21:30:00Z | Fix oscillator node labels showing ω=log(p) instead of Z₀=log(p) in OscillatorChainViz | OscillatorChainViz.jsx |
| 309 | 2026-03-03T22:00:00Z | Fix primes.js module docstring calling log(p) the oscillator angular frequency instead of the Euler factor phase rate | primes.js |
| 310 | 2026-03-03T22:15:00Z | Scale de Bruijn-Newman scatter dot radius by displacement from critical line | LiCriterionViz.jsx |
| 311 | 2026-03-03T22:30:00Z | Fix number variance including anchor zero in count, biasing Σ²(L) by +1 | GUEStatisticsViz.jsx |
| 312 | 2026-03-03T22:45:00Z | Make nearest-zero proximity indicator clickable to snap t to exact zero value in WaveSimViz | WaveSimViz.jsx |
| 313 | 2026-03-03T23:00:00Z | Add direction arrows along Nyquist contour to indicate increasing frequency traversal | NyquistBodeViz.jsx |
| 314 | 2026-03-03T23:15:00Z | Replace useCallback with useMemo for GradientDescentTab H(σ) curve to avoid recomputing 80 Hamiltonian evaluations on every resize and redraw | TwinOscillatorSimViz.jsx |
| 315 | 2026-03-03T23:30:00Z | Fix DocsPage stale counts (18→19 viz, 16→17 pages, 4→5 modules) and add missing TwistorViz, TwistorPage, twistor.js entries | DocsPage.jsx |
| 316 | 2026-03-03T23:45:00Z | Fix GUE number variance prefactor using GOE 2/π² instead of correct GUE 1/π² | GUEStatisticsViz.jsx |
| 317 | 2026-03-04T00:00:00Z | Make nearest-zero proximity indicator clickable to snap t to exact zero value in TwistorViz | TwistorViz.jsx |
| 318 | 2026-03-03T12:00:00Z | Fix PenroseTransformTab canvas not redrawing on window resize causing stretched/blurry display | TwistorViz.jsx |
| 319 | 2026-03-03T12:15:00Z | Add legend entry for shaded zero-correction region in ExplicitFormulaViz | ExplicitFormulaViz.jsx |
| 320 | 2026-03-03T12:30:00Z | Reuse superposition Float64Array buffer across animation frames in AnimatedModesViz | AnimatedModesViz.jsx |
| 321 | 2026-03-03T12:45:00Z | Add Skewes number exploration entry on constructive interference of zero modes flipping π(x)−Li(x) | explorations.js |
| 322 | 2026-03-03T13:00:00Z | Fix DualPairTab canvas not redrawing on window resize when animation is paused | TwistorViz.jsx |
| 323 | 2026-03-03T13:15:00Z | Fix PrimeGapCouplingViz labeling log(p) as 'Frequency ω' instead of phase rate | PrimeGapCouplingViz.jsx |
| 324 | 2026-03-03T13:30:00Z | Add hover-to-inspect σ, t, and log(1+|ζ|) values on ZetaLandscapeViz heatmap | ZetaLandscapeViz.jsx |
| 325 | 2026-03-03T13:45:00Z | Fix WaveInterferenceTab canvas not redrawing on window resize when animation is paused | WaveSimViz.jsx |
| 326 | 2026-03-03T14:00:00Z | Fix Bost-Connes phase labels reversed: σ>1 is ordered/condensed, not gas | SupercriticalPage.jsx, supercritical.js |
| 327 | 2026-03-03T14:15:00Z | Fix HomePage card calling log(p) the resonator 'frequency' instead of characteristic impedance Z₀ | HomePage.jsx |
| 328 | 2026-03-03T14:30:00Z | Add horizontal gridlines to all three modes of GUEStatisticsViz for easier value reading | GUEStatisticsViz.jsx |
| 329 | 2026-03-03T22:15:00Z | Pre-render IncidenceRelationTab heatmap to offscreen canvas to avoid 4,941 fillRect calls on every slider change | TwistorViz.jsx |
| 330 | 2026-03-03T23:00:00Z | Add Lehmer's phenomenon exploration entry on near-degenerate zeros and GUE level repulsion | explorations.js |
| 331 | 2026-03-04T00:00:00Z | Fix PhaseDelayTab SVG not redrawing on window resize due to missing resize handler | WaveSimViz.jsx |
| 332 | 2026-03-03T12:00:00Z | Fix DocsPage stale function counts (46→48 total, 16→15 for zeta.js) in Math Modules section | DocsPage.jsx |
| 333 | 2026-03-03T12:15:00Z | Brighten near-invisible center baselines in AnimatedModesViz waveform rows and superposition panel | AnimatedModesViz.jsx |
| 334 | 2026-03-03T22:30:00Z | Add disabled state styling for buttons and sliders during long-running operations | app.css |
| 335 | 2026-03-03T14:45:00Z | Add missing legend to Von Mangoldt Spectrum tab in FourierDomainViz | FourierDomainViz.jsx |
| 336 | 2026-03-04T00:30:00Z | Fix pair correlation histogram normalization dividing by N(N-1)/2 instead of N | GUEStatisticsViz.jsx |
| 337 | 2026-03-03T23:30:00Z | Add missing horizontal gridlines to Prime Harmonics tab in FourierDomainViz | FourierDomainViz.jsx |
| 338 | 2026-03-03T15:00:00Z | Fix Keiper-Li asymptotic formula missing Euler-Mascheroni constant γ term | LiCriterionViz.jsx |
| 339 | 2026-03-03T23:45:00Z | Pre-compute critical-line stroke color palettes to avoid per-segment string allocation in ZetaLandscapeViz | ZetaLandscapeViz.jsx |
| 340 | 2026-03-03T23:50:00Z | Make nearest-zero proximity indicator clickable to snap t to exact zero value in SupercriticalViz | SupercriticalViz.jsx |
| 341 | 2026-03-03T23:55:00Z | Add click-to-snap-to-zero on nearest-zero indicators in all 4 TwinOscillatorSimViz tabs | TwinOscillatorSimViz.jsx |
| 342 | 2026-03-04T01:00:00Z | Fix EnergyLandscapeViz x-axis label and colorbar min label clipped at canvas bottom edge | EnergyLandscapeViz.jsx |
| 343 | 2026-03-03T15:15:00Z | Fix StatisticsPage still showing old wrong Keiper-Li asymptotic formula missing Euler-Mascheroni constant γ | StatisticsPage.jsx |
| 344 | 2026-03-03T16:00:00Z | Add hover crosshair to ScatteringMatrixViz showing σ, |χ|, Γ, and phase values | ScatteringMatrixViz.jsx |
| 345 | 2026-03-03T22:09:00Z | Add rotated metric title label to EnergyLandscapeViz colorbar | EnergyLandscapeViz.jsx |
| 346 | 2026-03-03T22:30:00Z | Fix Bode phase plot using raw atan2 without unwrapping, causing false ±180° jumps | NyquistBodeViz.jsx |
| 347 | 2026-03-03T22:45:00Z | Fix ZetaLandscapeViz heatmap off-by-one causing zero markers to misalign with heatmap data | ZetaLandscapeViz.jsx |
| 348 | 2026-03-03T23:00:00Z | Reuse memoized chainData.primes instead of redundant getPrimes() call in OscillatorChainViz JSX | OscillatorChainViz.jsx |
| 349 | 2026-03-03T23:15:00Z | Fix ExtendedLandscapeTab showing trivial zero markers at all t values when they only exist at t=0 | SupercriticalViz.jsx |
| 350 | 2026-03-03T15:30:00Z | Add Cramér's random model exploration entry explaining why primes look random through the oscillator lens | explorations.js |
| 351 | 2026-03-04T01:30:00Z | Add background box to mismatch test legend in RHRigorViz for readability | RHRigorViz.jsx |
| 352 | 2026-03-03T16:15:00Z | Fix Phase & Delay explainer showing wrong derivative variable ∂φ/∂ω instead of ∂φ/∂t | WaveSimViz.jsx |
| 353 | 2026-03-03T16:30:00Z | Add spacebar keyboard shortcut for play/pause in AnimatedModesViz with visual kbd hint | AnimatedModesViz.jsx |
| 354 | 2026-03-03T17:00:00Z | Fix mismatch test legend showing solid line for Known zeros but plot draws them dashed | RHRigorViz.jsx |
| 355 | 2026-03-03T17:15:00Z | Fix PrimeGapCouplingViz using simplified N(T)~(T/2π)log T instead of standard Riemann-von Mangoldt formula | PrimeGapCouplingViz.jsx |
| 356 | 2026-03-03T17:30:00Z | Fix spacing histogram using linear density approximation instead of exact Weyl-law unfolding | GUEStatisticsViz.jsx |
| 357 | 2026-03-03T18:00:00Z | Add RMS approximation error readout to ExplicitFormulaViz controls | ExplicitFormulaViz.jsx |
| 358 | 2026-03-03T18:15:00Z | Fix zero-correction area fill opacity mismatch between chart (8%) and legend swatch (25%) in ExplicitFormulaViz | ExplicitFormulaViz.jsx |
| 359 | 2026-03-04T02:00:00Z | Avoid canvas buffer reallocation on every animation frame in WaveSimViz animated tabs | WaveSimViz.jsx |
| 360 | 2026-03-03T20:00:00Z | Add Bost-Connes phase transition exploration entry explaining KMS states and symmetry breaking at σ=1 | explorations.js |
| 361 | 2026-03-03T21:00:00Z | Fix heatmap using tRange[0]||0.5 which silently replaces 0 with 0.5 due to JS falsy zero | ZetaLandscapeViz.jsx |
| 362 | 2026-03-03T23:30:00Z | Fix explicit formula exploration entry claiming zero amplitude decays as 1/γ² instead of 1/γ | explorations.js |
| 363 | 2026-03-03T23:45:00Z | Add region label and tooltip to color-coded σ slider in WaveSimViz | WaveSimViz.jsx |
| 364 | 2026-03-04T03:00:00Z | Add missing y-axis labels to both charts in BridgeTab | TwinOscillatorSimViz.jsx |
| 365 | 2026-03-04T03:15:00Z | Replace superposition.map(Math.abs) spread with inline loop in AnimatedModesViz draw | AnimatedModesViz.jsx |
| 366 | 2026-03-04T04:00:00Z | Add thermodynamic and Li criterion rows to HomePage correspondence table | HomePage.jsx |
| 367 | 2026-03-04T06:00:00Z | Add missing window resize listener to CorrespondenceTab in TwistorViz | TwistorViz.jsx |
| 368 | 2026-03-04T07:00:00Z | Fix heat flow zero velocity coefficient from 1/(2π) to 2 in heatFlowZeros | supercritical.js |
| 369 | 2026-03-04T08:00:00Z | Add convergent/critical-strip region label to sigma slider in EulerProductViz | EulerProductViz.jsx |
| 370 | 2026-03-04T09:00:00Z | Add missing coupling trend line legend entry in PrimeGapCouplingViz coupling mode | PrimeGapCouplingViz.jsx |
| 371 | 2026-03-04T10:00:00Z | Add missing window resize listener to ZetaLandscapeViz canvas | ZetaLandscapeViz.jsx |
| 372 | 2026-03-04T11:00:00Z | Fix spectral energy formula showing |H(s)|² instead of Σ_p ½log(p)|H_p(s)|² | FourierDomainViz.jsx |
| 373 | 2026-03-04T12:00:00Z | Add critical-strip region label and tooltip to σ slider in TwistorViz | TwistorViz.jsx |
| 374 | 2026-03-05T12:00:00Z | Add missing legends to Frequency Response tab magnitude and phase charts in FourierDomainViz | FourierDomainViz.jsx |
| 375 | 2026-03-05T14:00:00Z | Fix Jensen-Shannon divergence using Jeffreys divergence formula instead of correct midpoint formula | information-theory.js |
| 376 | 2026-03-05T16:00:00Z | Add missing y-axis tick labels to log|ζ| panel in Extended Landscape tab | SupercriticalViz.jsx |
| 377 | 2026-03-05T18:00:00Z | Fix x-axis label saying "Prime index n" when tick labels show prime values | PrimeGapCouplingViz.jsx |
| 378 | 2026-03-05T20:00:00Z | Add missing y-axis tick labels and gridlines to all Information Theory scan plots | InformationTheoryViz.jsx |
| 379 | 2026-03-05T22:00:00Z | Fix rh-attack.js using uncorrected Riemann-Siegel Z without C₀ term in heat flow scan | rh-attack.js |
| 380 | 2026-03-05T23:00:00Z | Remove unused errorData computation from ExplicitFormulaViz useMemo | ExplicitFormulaViz.jsx |
| 381 | 2026-03-06T00:00:00Z | Fix Li Coefficients reference line label showing λ=0 instead of λ=1 on log scale | RHAttackViz.jsx |
| 382 | 2026-03-05T22:30:00Z | Add missing y-axis labels to both charts in Decorated Zeta tab of PascalZetaViz | PascalZetaViz.jsx |
| 383 | 2026-03-05T23:30:00Z | Fix selbergTraceAnalog missing conjugate zeros in spectral side sum | weil-connes.js |
| 384 | 2026-03-06T00:30:00Z | Add missing window resize handlers to all five SpectralAttackViz canvas tabs | SpectralAttackViz.jsx |
| 385 | 2026-03-05T22:00:00Z | Fix incorrect unit '(s)' on group delay y-axis label in Phase & Delay tab | WaveSimViz.jsx |
| 386 | 2026-03-05T23:00:00Z | Add missing circle markers to error convergence chart in PascalZetaViz ConstantsTab | PascalZetaViz.jsx |
| 386 | 2026-03-05T23:45:00Z | Replace 10,000 fillRect calls with single putImageData in ZetaLandscape heatmap | ZetaLandscapeViz.jsx |
| 387 | 2026-03-06T01:00:00Z | Add background box to de Bruijn-Newman scatter plot legend for readability | LiCriterionViz.jsx |
| 388 | 2026-03-06T12:00:00Z | Add background box to Confinement tab legend in GapClosingViz for readability | GapClosingViz.jsx |
| 388 | 2026-03-05T02:00:00Z | Fix von Mangoldt spectrum missing n^{-1/2} weight needed to align peaks with zeta zeros | supercritical.js, FourierDomainViz.jsx |
| 389 | 2026-03-05T23:00:00Z | Use Unicode subscript digits in AnimatedModesViz zeta zero dropdown | AnimatedModesViz.jsx |
| 448 | 2026-03-05T22:00:00Z | Fix InformationTheoryPage saying 'impedance matched, zero noise' instead of 'conjugate-matched, noise minimized' | InformationTheoryPage.jsx |
| 390 | 2026-03-05T23:30:00Z | Fix Weil explicit formula prime-power sum using f instead of fHat | weil-connes.js |
| 391 | 2026-03-05T23:45:00Z | Fix GUE number variance reference curve missing factor of 2 in leading coefficient | GUEStatisticsViz.jsx |
| 392 | 2026-03-06T02:30:00Z | Add background box to Regularization tab legend in GapClosingViz for readability | GapClosingViz.jsx |
| 393 | 2026-03-05T22:00:00Z | Fix oscillators.js docstrings saying 'impedance-matched' instead of 'conjugate-matched' at σ=½ | oscillators.js |
| 394 | 2026-03-05T23:50:00Z | Fix KL divergence and Jensen-Shannon using natural log (nats) instead of log₂ (bits) | information-theory.js |
| 395 | 2026-03-06T03:00:00Z | Fix inlineKL in spectral-attack.js using Math.log (nats) instead of Math.log2 (bits) | spectral-attack.js |
| 396 | 2026-03-05T22:30:00Z | Fix twistor incidence derivation using natural pairing (+) instead of symplectic form (−) | TwistorPage.jsx |
| 397 | 2026-03-06T04:00:00Z | Fix dual ladder magnitude bars overlapping Z₀ labels in OscillatorChainViz | OscillatorChainViz.jsx |
| 398 | 2026-03-06T05:00:00Z | Fix KL divergence in InfoTheoryExperimentsViz using Math.log (nats) instead of Math.log2 (bits) | InfoTheoryExperimentsViz.jsx |
| 399 | 2026-03-06T06:00:00Z | Remove redundant stats useMemo that re-scanned all primes in PerPrimeTab | TwinOscillatorSimViz.jsx |
| 400 | 2026-03-05T23:00:00Z | Fix KL divergence explainer saying 'nats' when computation uses log₂ (bits) | InformationTheoryViz.jsx |
| 401 | 2026-03-05T23:30:00Z | Fix Li coefficients logLambda using Math.log (ln) but chart label saying log₁₀ | rh-attack.js, RHAttackViz.jsx |
| 402 | 2026-03-05T12:00:00Z | Fix GUE number variance reference curve using 2/π² instead of correct 1/π² | GUEStatisticsViz.jsx |
| 403 | 2026-03-05T23:45:00Z | Fix Montgomery pair correlation form factor showing 1+|α| instead of min(|α|,1) | FourierPage.jsx |
| 404 | 2026-03-05T12:30:00Z | Fix KL divergence y-axis label saying 'nats' when computation uses log₂ (bits) | InformationTheoryViz.jsx |
| 405 | 2026-03-05T14:00:00Z | Fix WaveSimPage saying 'impedance-matched' instead of 'conjugate-matched' at σ=½ | WaveSimPage.jsx |
| 406 | 2026-03-05T15:00:00Z | Fix explorations claiming V_mismatch = 0 at σ=½ instead of minimized (conjugate match) | explorations.js, information-theory.js |
| 454 | 2026-03-05T23:00:00Z | Add missing window resize handlers to all four RHAttackViz canvas tabs | RHAttackViz.jsx |
| 455 | 2026-03-05T23:30:00Z | Add missing bridge penalty (V_b) to HamiltonianViz hover tooltip | HamiltonianViz.jsx |
| 456 | 2026-03-05T23:45:00Z | Add missing σ=0.2 tick label to Penrose Transform x-axis in TwistorViz | TwistorViz.jsx |
| 457 | 2026-03-05T22:00:00Z | Fix Li coefficient formula on PascalPage using undefined (-1)! factorial and wrong form | PascalPage.jsx |
| 458 | 2026-03-05T23:55:00Z | Fix Ball-Rivoal dimension bound formula growing as s/log(s) instead of correct log(s) | OddZetaPage.jsx |
| 459 | 2026-03-05T22:15:00Z | Fix ScatteringMatrixViz reflection explainer saying 'impedance match' instead of 'conjugate match' | ScatteringMatrixViz.jsx |
| 460 | 2026-03-05T14:30:00Z | Add missing window resize handlers to all six InformationTheoryViz canvas tabs | InformationTheoryViz.jsx |
| 461 | 2026-03-05T16:00:00Z | Add missing window resize handlers to all three ZXCalculusViz canvas tabs | ZXCalculusViz.jsx |
| 462 | 2026-03-06T00:10:00Z | Fix dual energy formula showing +iω instead of correct −iω in Spectral Energy explainer | FourierDomainViz.jsx |
| 463 | 2026-03-05T23:00:00Z | Add missing circle markers to error convergence chart in PascalZetaViz ConstantsTab | PascalZetaViz.jsx |
| 464 | 2026-03-05T23:59:00Z | Add missing y-axis tick labels and gridlines to both charts in OddZetaViz Transfer Function tab | OddZetaViz.jsx |
| 465 | 2026-03-05T17:30:00Z | Fix KL divergence unit label showing "nats" instead of "bits" in InfoTheoryExperimentsViz dashboard | InfoTheoryExperimentsViz.jsx |
| 466 | 2026-03-05T18:00:00Z | Cap algorithmicRandomnessTest to float64 mantissa precision (52 bits) instead of analyzing 200 bits of rounding noise | odd-zeta.js |
| 467 | 2026-03-05T19:00:00Z | Add hover-to-inspect tooltip for Z(t) values and nearest zero in critical-line mode of ZetaLandscapeViz | ZetaLandscapeViz.jsx |
| 468 | 2026-03-05T19:30:00Z | Fix KL divergence y-axis label showing "nats" instead of "bits" in SpectralAttackViz Lyapunov tab | SpectralAttackViz.jsx |
| 469 | 2026-03-05T20:00:00Z | Add missing legend to Hasse–Sondow convergence chart in PascalZetaViz | PascalZetaViz.jsx |
| 470 | 2026-03-05T20:30:00Z | Add x-axis label and repeat phase boundary labels on bottom chart of Thermodynamics tab | SupercriticalViz.jsx |
| 471 | 2026-03-05T21:00:00Z | Add missing y-axis tick labels and gridlines to Rate-Distortion tab in InformationTheoryViz | InformationTheoryViz.jsx |
| 472 | 2026-03-05T21:30:00Z | Optimize eulerFactor to use direct real-base arithmetic instead of generic cPow | zeta.js |
| 473 | 2026-03-06T00:30:00Z | Fix stale Q-factor explainer card on OscillatorsPage still showing wrong prime-dependent formula | OscillatorsPage.jsx |
| 474 | 2026-03-05T23:00:00Z | Fix Darlington S21 using |Zd| instead of sqrt(Re(Zd)·Re(Zdl)) in transmission coefficient | gap-closing.js |
| 475 | 2026-03-06T00:45:00Z | Add Davenport-Heilbronn counterexample warning card to ControlTheoryPage | ControlTheoryPage.jsx |
| 476 | 2026-03-05T22:00:00Z | Add zeta zero snap indicators to t sliders in PascalZetaViz Hasse and Decorated tabs | PascalZetaViz.jsx |
| 477 | 2026-03-05T23:00:00Z | Add hover-to-inspect hint text to HamiltonianViz when not hovering | HamiltonianViz.jsx |
| 478 | 2026-03-05T23:30:00Z | Fix GUE concept entry showing pair correlation R₂(r) mislabeled as gap probability P(gap=r) | ConceptsPage.jsx |
| 479 | 2026-03-05T12:00:00Z | Fix truncated Euler-Mascheroni constant in GUE number variance reference curve | GUEStatisticsViz.jsx |
| 480 | 2026-03-05T23:59:00Z | Fix formal-proof.js S6 claiming V_mismatch vanishes and Z_dir = Z_dual at σ=½ (conjugate-matched, minimized not zero) | formal-proof.js |
| 481 | 2026-03-05T22:30:00Z | Fix spider phase formula claiming α_p = −t·log(p) at σ=0 (only valid when p^{-σ} ≪ 1) | ZXCalculusPage.jsx, zxcalculus.js |
| 482 | 2026-03-05T23:00:00Z | Fix Mellin transform formula missing s/(s-1) main term and wrong convergence region | FourierPage.jsx |
| 483 | 2026-03-05T23:30:00Z | Fix stale numPrimes closure in AnimatedModesViz draw callback by using primeData.length | AnimatedModesViz.jsx |
| 484 | 2026-03-06T00:00:00Z | Fix missing minus sign in explicit formula asymptotic approximation | ExplicitFormulaViz.jsx |
| 485 | 2026-03-06T00:30:00Z | Fix number variance formula using GOE coefficient 2/π² instead of correct GUE coefficient 1/π² | StatisticsPage.jsx |
| 486 | 2026-03-05T01:00:00Z | Add hover crosshair to ExplicitFormulaViz showing ψ(x), approximation, and error at cursor | ExplicitFormulaViz.jsx |
| 487 | 2026-03-05T14:00:00Z | Add tab explainer banners to all 5 tabs in OddZetaViz | OddZetaViz.jsx |
| 488 | 2026-03-05T15:00:00Z | Add tab explainer banners to all 4 tabs in PascalZetaViz | PascalZetaViz.jsx |
| 489 | 2026-03-05T16:00:00Z | Fix wrapped phase plot in Frequency Response tab showing false discontinuities at ±π | FourierDomainViz.jsx |
| 490 | 2026-03-05T17:00:00Z | Fix phase plot false discontinuities at ±π wraps in Extended Landscape tab | SupercriticalViz.jsx |
| 491 | 2026-03-05T18:00:00Z | Fix wrong claim that Euler factor weights are uniform at σ=½ in PrimeContributions explainer | InfoTheoryExperimentsViz.jsx |
| 492 | 2026-03-05T19:00:00Z | Fix PaperPage abstract claiming reflected power 'vanishes' at σ=½ (it is minimized, not zero) | PaperPage.jsx |
| 493 | 2026-03-06T01:30:00Z | Add horizontal gridlines to Li Coefficients bar chart in RHAttackViz | RHAttackViz.jsx |
| 494 | 2026-03-06T02:00:00Z | Fix information-theory.js docstrings falsely claiming entropy is maximized via uniform distribution at σ=½ | information-theory.js |
| 495 | 2026-03-06T03:00:00Z | Fix Weil positivity Fourier transform missing exp(-a/4) prefactor from test function | rh-attack.js |
| 496 | 2026-03-06T04:00:00Z | Add legend background box to Darlington tab in GapClosingViz for readability | GapClosingViz.jsx |
| 497 | 2026-03-06T05:00:00Z | Add nearest-zero proximity indicator to t slider in InformationTheoryViz | InformationTheoryViz.jsx |
| 498 | 2026-03-06T06:00:00Z | Precompute log(p) and log(p)/p weights in hilbertPolyaMatrix to avoid redundant Math.log calls | gap-closing.js |
| 499 | 2026-03-06T07:00:00Z | Fix heat flow ZPO interpretation saying t>0 scatters zeros (correct: t<0 scatters, t>0 preserves) | SupercriticalPage.jsx |
| 500 | 2026-03-06T08:00:00Z | Add Montgomery-Dyson encounter exploration entry connecting GUE random matrix statistics to zeta zeros | explorations.js |
| 501 | 2026-03-06T09:00:00Z | Fix Heat Flow tab using per-curve y-normalization hiding amplitude differences across τ values | RHAttackViz.jsx |
| 502 | 2026-03-06T10:00:00Z | Fix false biconditional Z·W=0 ⟺ σ=½ in twistor derivation (incidence also vanishes at cos(t log 2)=0) | TwistorPage.jsx |
| 503 | 2026-03-06T11:00:00Z | Replace white-centered correlation matrix heatmap with dark-friendly diverging color scale | SpectralAttackViz.jsx |
| 504 | 2026-03-06T12:00:00Z | Fix false claim that prime weights are uniform at σ=½ in InformationTheoryViz entropy tab | InformationTheoryViz.jsx |
| 505 | 2026-03-06T13:00:00Z | Add nearest-zero proximity indicator to t slider in InfoTheoryExperimentsViz | InfoTheoryExperimentsViz.jsx |
| 506 | 2026-03-06T14:00:00Z | Add missing Y-axis label to critical-line Z(t) plot in ZetaLandscapeViz | ZetaLandscapeViz.jsx |
| 507 | 2026-03-06T15:00:00Z | Fix phase plot false discontinuities at ±π wraps in EulerProductViz | EulerProductViz.jsx |
| 508 | 2026-03-06T16:00:00Z | Eliminate duplicate gapClosingReport computation in GapClosingViz ConfinementTab | GapClosingViz.jsx |
| 509 | 2026-03-06T17:00:00Z | Add missing y-axis tick labels and gridlines to Irrationality Measure chart in OddZetaViz | OddZetaViz.jsx |
| 510 | 2026-03-06T18:00:00Z | Fix false claim that Euler product entropy gives uniform prime distribution at sigma=1/2 | InformationTheoryPage.jsx |
| 511 | 2026-03-06T19:00:00Z | Fix InsightDAG legend missing Analogous and Extends edge types | InsightDAG.jsx |
| 512 | 2026-03-06T20:00:00Z | Fix false claim that Λ≥0 (Rodgers-Tao) means zeros are on the critical line at τ=0 | LiCriterionViz.jsx |
| 513 | 2026-03-06T21:00:00Z | Fix markdown **bold** syntax rendering as literal asterisks in JSX on ModesPage | ModesPage.jsx |
| 514 | 2026-03-06T22:00:00Z | Add missing y-axis tick labels, gridlines, and x-axis tick labels to Heat Flow tab in RHAttackViz | RHAttackViz.jsx |
| 515 | 2026-03-06T23:00:00Z | Add missing window resize handler to FormalProofViz EvidenceTab canvases | FormalProofViz.jsx |
| 516 | 2026-03-07T00:00:00Z | Add missing legend for derivative color coding in SpectralAttackViz Lyapunov tab | SpectralAttackViz.jsx |
| 517 | 2026-03-07T01:00:00Z | Add Deninger foliated spaces exploration entry connecting closed orbits to prime oscillators | explorations.js |
| 518 | 2026-03-06T23:45:00Z | Fix darlingtonSMatrix docstring showing wrong S21 formula: |Z_d| instead of √(Re(Z_d)·Re(Z_dual)) | gap-closing.js |
| 518 | 2026-03-06T21:30:00Z | Add missing y-axis tick labels and gridlines to ZXCalculusViz Symmetry tab | ZXCalculusViz.jsx |
| 519 | 2026-03-06T23:45:00Z | Remove dead code with x2-x2 typo in ZXCalculusViz drawArrow helper | ZXCalculusViz.jsx |
| 520 | 2026-03-06T14:30:00Z | Precompute (1−1/ρ) values outside n-loop in liCoefficients to avoid redundant cDiv/cSub per zero | rh-attack.js |
| 522 | 2026-03-06T21:00:00Z | Fix Full Report tab in ProofCheckerViz never running due to disconnected ref callback | ProofCheckerViz.jsx |
| 523 | 2026-03-07T02:00:00Z | Fix Heat Flow tab claiming Λ = 0 instead of Λ ≥ 0 (Rodgers–Tao proved the lower bound, not equality) | RHAttackViz.jsx |
| 524 | 2026-03-07T03:00:00Z | Add descriptive slider labels and tooltips to PascalZetaViz Hasse-Sondow and Decorated tabs | PascalZetaViz.jsx |
| 525 | 2026-03-07T04:00:00Z | Add missing window resize handlers to all 4 canvas tabs in InfoTheoryExperimentsViz | InfoTheoryExperimentsViz.jsx |
| 526 | 2026-03-06T15:30:00Z | Use Unicode subscript digits instead of subscript parentheses in AnimatedModesViz canvas title | AnimatedModesViz.jsx |
| 527 | 2026-03-06T16:00:00Z | Add missing y-axis labels to both charts in Euler Phase tab | SupercriticalViz.jsx |
| 528 | 2026-03-07T05:00:00Z | Add background box to legend in ExplicitFormulaViz for readability over chart data | ExplicitFormulaViz.jsx |
| 529 | 2026-03-06T18:00:00Z | Add missing y-axis label to Symmetry tab in ZXCalculusViz | ZXCalculusViz.jsx |
| 530 | 2026-03-06T19:30:00Z | Add tab explainer banners to all 6 tabs in InformationTheoryViz | InformationTheoryViz.jsx |
| 531 | 2026-03-07T06:00:00Z | Fix Hilbert-Polya text saying operator must be "positive" instead of "self-adjoint" | StatisticsPage.jsx |
| 532 | 2026-03-07T07:00:00Z | Fix Lyapunov tab legend incorrectly labeling positive dD_KL/dσ as "away from ½" | SpectralAttackViz.jsx |
| 533 | 2026-03-06T08:00:00Z | Eliminate redundant Euler product loop in oddZetaValue by saving second-to-last cumulative value | odd-zeta.js |
| 534 | 2026-03-06T08:30:00Z | Add tab explainer banners to all 5 tabs in RHAttackViz | RHAttackViz.jsx |
| 535 | 2026-03-06T20:00:00Z | Add missing window resize handler to AnimatedModesViz when paused | AnimatedModesViz.jsx |
| 536 | 2026-03-06T21:00:00Z | Add missing axis labels to gradient and curvature sub-charts in ConvergenceTab | TwinOscillatorSimViz.jsx |
| 537 | 2026-03-06T22:00:00Z | Add missing y-axis labels to both charts in OddZetaViz Values & Convergence tab | OddZetaViz.jsx |
| 538 | 2026-03-07T08:00:00Z | Add tab explainer banners to all 4 tabs in FormalProofViz | FormalProofViz.jsx |
| 539 | 2026-03-07T09:00:00Z | Add tab explainer banners to all 5 tabs in SpectralAttackViz | SpectralAttackViz.jsx |
| 540 | 2026-03-06T10:00:00Z | Fix Von Mangoldt spectrum legend using wrong notation |Λ̂(ω)| instead of |F(ω)| | FourierDomainViz.jsx |
| 541 | 2026-03-06T11:00:00Z | Add Hadamard product formula card to ZetaPage with ξ(s) factorization and ZPO notch-filter interpretation | ZetaPage.jsx |
| 542 | 2026-03-06T22:30:00Z | Change Confinement tab Hamiltonian curve from orange to pink for better contrast with Bridge curve | GapClosingViz.jsx |
| 543 | 2026-03-06T23:00:00Z | Add tab explainer banners to all 4 tabs in InfoTheoryExperimentsViz | InfoTheoryExperimentsViz.jsx |
| 544 | 2026-03-06T23:30:00Z | Add tab explainer banners to all 4 tabs in ProofCheckerViz | ProofCheckerViz.jsx |
| 545 | 2026-03-07T10:00:00Z | Fix impulse response formula containing Laplace variable s and wrong delta arguments | OscillatorsPage.jsx |
| 546 | 2026-03-06T15:00:00Z | Hoist per-x-step constants out of per-prime loop in AnimatedModesViz draw function | AnimatedModesViz.jsx |
| 547 | 2026-03-06T23:45:00Z | Fix incorrect |H| = 1 reference line label in EulerProductViz to |factor| = 1 | EulerProductViz.jsx |
| 548 | 2026-03-06T23:55:00Z | Add missing y-axis labels to Hilbert-Polya tab in GapClosingViz | GapClosingViz.jsx |
| 549 | 2026-03-07T10:30:00Z | Disable Primes slider on Bridge test in RHRigorViz since losslessBridge ignores numPrimes | RHRigorViz.jsx |
| 550 | 2026-03-06T16:00:00Z | Fix Evidence tab showing count/count instead of onLineCount/count for zeros on critical line | FormalProofViz.jsx, formal-proof.js |
| 551 | 2026-03-06T17:00:00Z | Fix error convergence chart x-domain clipping first pi error point in PascalZetaViz | PascalZetaViz.jsx |
| 552 | 2026-03-06T18:00:00Z | Add 0° reference line to phase mode in ScatteringMatrixViz | ScatteringMatrixViz.jsx |
| 553 | 2026-03-06T19:00:00Z | Add click-to-snap on nearest-zero indicator in InformationTheoryViz t slider | InformationTheoryViz.jsx |
| 554 | 2026-03-06T20:00:00Z | Add click-to-snap nearest-zero indicator to t slider in ZXCalculusViz | ZXCalculusViz.jsx |
| 555 | 2026-03-06T21:30:00Z | Fix Li Coefficients bar chart anchoring bars at x-axis instead of zero reference line | RHAttackViz.jsx |
| 556 | 2026-03-06T23:00:00Z | Add missing axis labels to first sub-chart in Convergence tab of TwinOscillatorSimViz | TwinOscillatorSimViz.jsx |
| 557 | 2026-03-06T23:50:00Z | Add missing y-axis labels to both charts in Transfer Function tab of OddZetaViz | OddZetaViz.jsx |
| 558 | 2026-03-07T00:15:00Z | Fix inconsistent σ slider color thresholds in TwistorViz (0.05/0.2 → 0.02/0.15) | TwistorViz.jsx |
| 559 | 2026-03-07T01:00:00Z | Fix Strategy Scores bar fill drawing three overlapping fills resulting in fully opaque bars instead of semi-transparent | SpectralAttackViz.jsx |
| 560 | 2026-03-07T11:00:00Z | Add missing axis labels to all three charts in Constants tab of PascalZetaViz | PascalZetaViz.jsx |
| 561 | 2026-03-06T12:00:00Z | Merge duplicate loops and hoist shared Math.log calls in riemannSiegelZeta | gap-closing.js |
| 562 | 2026-03-06T12:30:00Z | Add missing accent-cyan class to Extended Landscape tab explainer in SupercriticalViz | SupercriticalViz.jsx |
| 563 | 2026-03-06T18:00:00Z | Add missing accent color classes to all four tab explainers in TwistorViz | TwistorViz.jsx |
| 564 | 2026-03-06T22:00:00Z | Add missing CSS rules for accent-blue and accent-yellow tab-explainer classes | app.css |
| 565 | 2026-03-06T23:30:00Z | Add missing y-axis tick labels and rotated axis label to Hamiltonian Convexity chart in RHAttackViz | RHAttackViz.jsx |
| 566 | 2026-03-06T23:55:00Z | Eliminate redundant eulerFactor calls in PrimeContributions per-prime loop | InfoTheoryExperimentsViz.jsx |
| 567 | 2026-03-07T12:00:00Z | Replace inline styles with accent-blue class on Channel Capacity tab explainer in InformationTheoryViz | InformationTheoryViz.jsx |
| 568 | 2026-03-06T23:59:00Z | Add right-side y-axis with error scale for unitarity error curve in Darlington tab | GapClosingViz.jsx |
| 569 | 2026-03-06T12:45:00Z | Add missing accent-blue class to OscillatorChainViz tab explainer | OscillatorChainViz.jsx |
| 570 | 2026-03-06T23:00:00Z | Add missing accent-blue class to Von Mangoldt Spectrum tab explainer in FourierDomainViz | FourierDomainViz.jsx |
| 571 | 2026-03-06T23:00:00Z | Fix false claim that de Bruijn-Newman Λ = 0 is a proven theorem | rh-attack.js |
| 572 | 2026-03-06T23:30:00Z | Precompute log(p) and p^k tables to eliminate redundant Math calls in linearIndependenceTest Gram matrix loop | odd-zeta.js |
| 573 | 2026-03-06T23:45:00Z | Add missing accent color classes to all 5 tab explainers in WaveSimViz | WaveSimViz.jsx |
| 574 | 2026-03-06T12:00:00Z | Fix ZXCalculusViz hover tooltip labeling log(p) as ω (frequency) instead of Z₀ (characteristic impedance) | ZXCalculusViz.jsx |
| 575 | 2026-03-06T13:00:00Z | Fix inconsistent Gram matrix inner product for constant '1' element in linearIndependenceTest | odd-zeta.js |
| 576 | 2026-03-06T23:00:00Z | Fix scattering resonance concept entry contradicting itself: said 'transmits perfectly' but also 'S₂₁ → 0' | ConceptsPage.jsx |
| 577 | 2026-03-06T16:00:00Z | Fix Li coefficients bar chart drawing bars from chart bottom instead of zero baseline in FormalProofViz | FormalProofViz.jsx |
| 578 | 2026-03-06T23:30:00Z | Hoist constant logX and envelope arrays out of AnimatedModesViz per-frame draw loop | AnimatedModesViz.jsx |
| 579 | 2026-03-06T23:45:00Z | Fix RHAttackPage falsely claiming Rodgers-Tao proved Λ = 0 (they proved Λ ≥ 0; Λ = 0 would prove RH) | RHAttackPage.jsx |
| 580 | 2026-03-06T23:55:00Z | Fix Channel Capacity tab explainer showing wrong formula C = log K − H_min instead of Shannon-Hartley ½log₂(1+SNR) | InformationTheoryViz.jsx |
| 581 | 2026-03-07T00:10:00Z | Add missing accent-blue class to Nyquist Plot tab explainer in NyquistBodeViz | NyquistBodeViz.jsx |
| 582 | 2026-03-07T00:20:00Z | Add missing accent-blue class to Per-Prime Energy tab explainer in TwinOscillatorSimViz | TwinOscillatorSimViz.jsx |
| 583 | 2026-03-07T01:30:00Z | Fix π chart y-scale excluding arcsin series data, clipping early points off-screen | PascalZetaViz.jsx |
| 584 | 2026-03-07T01:45:00Z | Add tab-explainer divs to all 4 tabs in ZXCalculusViz (Spider Chain, Twin Ladder, Rewrite Rules, Symmetry) | ZXCalculusViz.jsx |
| 585 | 2026-03-06T23:00:00Z | Fix D-H phase entropy evalFn ignoring n parameter, making all 20 samples identical and entropy trivially zero | proof-checker.js |
| 586 | 2026-03-07T02:00:00Z | Use rounded corners on legend boxes in RHRigorViz for consistency with other canvas charts | RHRigorViz.jsx |
| 587 | 2026-03-06T12:00:00Z | Precompute σ=0.5 reference weights once for LandscapeScan instead of recomputing in all 81 iterations | InfoTheoryExperimentsViz.jsx |
| 588 | 2026-03-06T18:30:00Z | Fix Component Diagram and frequency tooltip labeling log(p) as ω (frequency) instead of Z₀ (impedance) | WaveSimViz.jsx, PrimeGapCouplingViz.jsx |
| 589 | 2026-03-06T23:00:00Z | Fix primeHarmonicDecomposition computing full Euler factor at wrong s instead of k-th Taylor harmonic | supercritical.js |
| 590 | 2026-03-06T04:30:00Z | Fix formal-proof.js claiming Rodgers-Tao proved Λ = 0 instead of Λ ≥ 0 (Λ = 0 would mean RH is proved) | formal-proof.js |
| 591 | 2026-03-06T23:30:00Z | Fix OscillatorChainViz detail card labeling log(p) as Frequency ω instead of Impedance Z₀ | OscillatorChainViz.jsx |
| 592 | 2026-03-06T14:00:00Z | Add horizontal gridlines to Fisher-Twistor tab in SpectralAttackViz for easier value reading | SpectralAttackViz.jsx |
| 593 | 2026-03-06T18:00:00Z | Update outdated de Bruijn-Newman upper bound from Λ ≤ ½ (1950) to Λ ≤ 0.2 (Platt-Trudgian 2021) | rh-attack.js |
| 595 | 2026-03-07T03:00:00Z | Fix DocsPage describing primeFrequency as "Oscillator frequency ω = log(p)" instead of impedance Z₀ | DocsPage.jsx |
| 596 | 2026-03-11T12:00:00Z | Fix AnimatedModesViz labeling log(p) as ω (frequency) instead of Z₀ (impedance) | AnimatedModesViz.jsx |
| 597 | 2026-03-11T14:00:00Z | Add legend to SupercriticalViz main panel identifying curve and reference lines | SupercriticalViz.jsx |
| 598 | 2026-03-11T16:00:00Z | Add hover tooltips to all GUEStatisticsViz data elements (histogram bars and number-variance dots) | GUEStatisticsViz.jsx |
| 599 | 2026-03-11T18:00:00Z | Fix phasor sum label showing "+ -0.567i" instead of "− 0.567i" for negative imaginary parts | TwinLadderViz.jsx |
| 600 | 2026-03-11T20:00:00Z | Replace 3,721 fillRect calls with single putImageData in EnergyLandscapeViz heatmap | EnergyLandscapeViz.jsx |
| 601 | 2026-03-11T22:00:00Z | Add Parseval energy conservation explainer card to FourierPage linking unitarity to spectral balance | FourierPage.jsx |
| 602 | 2026-03-12T00:00:00Z | Add zeta zero frequency markers to Bode diagram in NyquistBodeViz | NyquistBodeViz.jsx |
| 603 | 2026-03-12T02:00:00Z | Add nearest-zeta-zero snap indicator to T sliders in TwinLadderViz | TwinLadderViz.jsx |
| 604 | 2026-03-12T04:00:00Z | Fix ambiguous phase notation in Euler product explainer: arg(1-p^{-s})^{-1} → -arg(1-p^{-s}) | EulerProductViz.jsx |
| 605 | 2026-03-12T06:00:00Z | Fix pair correlation histogram showing half the correct density in GUEStatisticsViz | GUEStatisticsViz.jsx |
| 606 | 2026-03-11T22:30:00Z | Eliminate per-frame Float64Array allocation in AnimatedModesViz animation loop | AnimatedModesViz.jsx |
| 607 | 2026-03-11T23:00:00Z | Add hover crosshair and readout to Von Mangoldt Spectrum tab in FourierDomainViz | FourierDomainViz.jsx |
| 608 | 2026-03-11T23:30:00Z | Add legend box to Irrationality Measure tab in OddZetaViz identifying data points and reference lines | OddZetaViz.jsx |
| 609 | 2026-03-12T08:00:00Z | Fix Borwein error bound using 3^{-n} instead of correct 2^{-n} for Knopp-Hasse weights | gap-closing.js |
| 610 | 2026-03-11T23:45:00Z | Add descriptive tooltips to ThermoBar explaining T, P, F, S quantities and phase badge | ThermoBar.jsx |
| 611 | 2026-03-11T23:50:00Z | Fix Shannon entropy formula showing log instead of log₂ to match code that computes in bits | InformationTheoryViz.jsx |
| 612 | 2026-03-11T23:55:00Z | Fix oscillator frequency label showing Z₀ instead of ω in AnimatedModesViz | AnimatedModesViz.jsx |
| 613 | 2026-03-11T23:58:00Z | Fix inverted color bar in TwistorViz Incidence Relation heatmap to follow standard low-bottom high-top convention | TwistorViz.jsx |
| 614 | 2026-03-11T12:05:00Z | Replace linear ZETA_ZEROS scans with binary search in ZetaLandscapeViz hover and zero count | ZetaLandscapeViz.jsx |
| 615 | 2026-03-11T12:10:00Z | Fix GUE hypothesis listed as RH equivalence and marked untested in Known Equivalences table | RHAttackPage.jsx |
| 616 | 2026-03-11T12:15:00Z | Use math-rendered label for t slider in Gradient Descent tab of TwinOscillatorSimViz | TwinOscillatorSimViz.jsx |
| 617 | 2026-03-11T12:20:00Z | Fix Phase tab explainer accent color mismatch in ScatteringMatrixViz | ScatteringMatrixViz.jsx |
| 618 | 2026-03-11T12:25:00Z | Add zero reference line and y-axis labels to cumulative phase graph in ZXCalculusViz Spider Chain tab | ZXCalculusViz.jsx |
| 619 | 2026-03-11T12:30:00Z | Fix Phase Rates tooltip showing Z₀ (impedance) instead of ω (frequency) in PrimeGapCouplingViz | PrimeGapCouplingViz.jsx |
| 620 | 2026-03-11T12:35:00Z | Fix misattribution of 10^13 zero verification to Platt instead of Gourdon in proof checker | FormalProofPage.jsx, formal-proof.js |
| 621 | 2026-03-11T12:40:00Z | Add missing y-axis tick labels, gridlines, and axis labels to S-Matrix tab in RHAttackViz | RHAttackViz.jsx |
| 622 | 2026-03-11T12:45:00Z | Add legend box to EulerProductViz identifying magnitude curve, phase curve, reference line, and factor bars | EulerProductViz.jsx |
| 623 | 2026-03-11T12:50:00Z | Add |χ| magnitude to Phase mode hover tooltip in ScatteringMatrixViz for cross-mode visibility | ScatteringMatrixViz.jsx |
| 624 | 2026-03-11T12:55:00Z | Memoize nearest-zero lookup in three SupercriticalViz tabs to avoid per-render IIFE loops | SupercriticalViz.jsx |
| 625 | 2026-03-11T13:00:00Z | Add missing rotated y-axis labels to both AperyTab charts in OddZetaViz | OddZetaViz.jsx |
| 626 | 2026-03-11T13:05:00Z | Add "(up to p=X)" label to Primes slider in GapClosingViz for consistency with other components | GapClosingViz.jsx |
| 627 | 2026-03-11T13:10:00Z | Add missing rotated y-axis label to PressureTemperatureTab bottom chart in TwinLadderViz | TwinLadderViz.jsx |
| 628 | 2026-03-11T13:15:00Z | Add "(up to p=X)" label to Primes slider in InfoTheoryExperimentsViz for consistency | InfoTheoryExperimentsViz.jsx |
| 629 | 2026-03-11T13:20:00Z | Fix lempelZivComplexity always returning 1 due to empty-prefix search at i=0 | odd-zeta.js |
| 630 | 2026-03-11T13:25:00Z | Fix spectralGapAnalysis to use GUE statistics instead of GOE for Wigner surmise CDF and variance | gap-closing.js |
| 631 | 2026-03-11T13:30:00Z | Use fast real-base exponentiation in zetaDirichlet and zetaEulerProduct instead of generic cPow | zeta.js |
| 632 | 2026-03-11T13:35:00Z | Add σ = ½ label to critical line in all three ScatteringMatrixViz modes | ScatteringMatrixViz.jsx |
| 633 | 2026-03-11T13:40:00Z | Add functional equation explainer card to ZetaPage with symmetric/asymmetric forms and bridge interpretation | ZetaPage.jsx |
| 634 | 2026-03-11T13:45:00Z | Add status label and tooltip to σ slider in NyquistBodeViz for critical line proximity | NyquistBodeViz.jsx |
| 635 | 2026-03-11T13:50:00Z | Remove spurious Math.abs from reflection coefficient formula, allowing signed Γ | oscillators.js, ScatteringMatrixViz.jsx |
| 636 | 2026-03-11T13:55:00Z | Fix von Mangoldt spectrum explainer claiming truncated DFT "equals" −ζ'/ζ on critical line | FourierDomainViz.jsx |
| 637 | 2026-03-11T14:00:00Z | Add Reset button to AnimatedModesViz to restart animation from t=0 | AnimatedModesViz.jsx |
| 638 | 2026-03-11T14:05:00Z | Color-code per-point error in ExplicitFormulaViz hover tooltip to match RMS error styling | ExplicitFormulaViz.jsx |
| 639 | 2026-03-11T14:10:00Z | Memoize eigenvalue/zero y-bounds in HilbertPolyaTab to avoid flatMap on every resize | GapClosingViz.jsx |
| 640 | 2026-03-12T00:15:00Z | Remove spurious −π²/8 constant from GUE number variance reference curve formula | GUEStatisticsViz.jsx |
| 641 | 2026-03-11T14:20:00Z | Add L_p and C_p values to OscillatorChainViz selected-stage detail card | OscillatorChainViz.jsx |
| 642 | 2026-03-11T17:30:00Z | Add σ = ½ label on heatmap critical line overlay in ZetaLandscapeViz | ZetaLandscapeViz.jsx |
| 643 | 2026-03-11T18:00:00Z | Fix reflection coefficient going negative for σ < 0.5 due to missing Math.abs | oscillators.js |
| 644 | 2026-03-11T19:00:00Z | Replace O(n) linear scan with O(log n) binary search in FourierDomainViz hover handler | FourierDomainViz.jsx |
| 645 | 2026-03-11T20:30:00Z | Fix pair correlation histogram normalization inflated by spurious factor of 2 | GUEStatisticsViz.jsx |
| 646 | 2026-03-11T21:00:00Z | Fix ScatteringMatrixViz reflection coefficient always non-negative after Math.abs fix | ScatteringMatrixViz.jsx |
| 647 | 2026-03-11T22:00:00Z | Add PNT expected average gap ~log(p) trend line to Prime Gaps chart | PrimeGapCouplingViz.jsx |
| 648 | 2026-03-11T23:00:00Z | Add hover tooltips to Phase & Delay bar chart showing exact group delay values | WaveSimViz.jsx |
| 649 | 2026-03-11T23:30:00Z | Replace O(n) reduce+indexOf with O(1) direct index computation in ExplicitFormulaViz hover | ExplicitFormulaViz.jsx |
| 650 | 2026-03-12T00:00:00Z | Clarify contradictory Q-factor formulas on ModesPage (per-zero vs per-prime) | ModesPage.jsx |
| 651 | 2026-03-11T23:45:00Z | Add worked example card showing per-prime phase cancellation at first zeta zero | WaveSimPage.jsx |
| 652 | 2026-03-12T00:30:00Z | Add γₙ index labels to zeta zero markers on critical line Z(t) plot | ZetaLandscapeViz.jsx |
| 653 | 2026-03-12T01:00:00Z | Fix inverted LZ76 loop condition in Lempel-Ziv complexity algorithm | odd-zeta.js |
| 654 | 2026-03-11T14:30:00Z | Fix unreachable trivial zeros in Extended Landscape — t slider min was 1 but markers require t < 0.5 | SupercriticalViz.jsx |
| 655 | 2026-03-11T14:35:00Z | Fix number variance explainer formula still showing spurious −π²/8 term removed in #640 | GUEStatisticsViz.jsx |
| 656 | 2026-03-11T15:00:00Z | Add semi-transparent background boxes to all three PrimeGapCouplingViz legends | PrimeGapCouplingViz.jsx |
| 657 | 2026-03-11T16:00:00Z | Add descriptive σ proximity text and tooltip to OscillatorChainViz σ slider | OscillatorChainViz.jsx |
| 658 | 2026-03-11T17:00:00Z | Memoize min/max metric scan in EnergyLandscapeViz draw callback | EnergyLandscapeViz.jsx |
| 659 | 2026-03-11T18:00:00Z | Add quick notation reference card to ConceptsPage listing key symbols used throughout the app | ConceptsPage.jsx |
| 660 | 2026-03-11T19:00:00Z | Add missing log(p) von Mangoldt weight to per-prime mode amplitude in AnimatedModesViz | AnimatedModesViz.jsx |
| 661 | 2026-03-11T20:00:00Z | Add fill area and ±90° reference lines to phase mode in ScatteringMatrixViz | ScatteringMatrixViz.jsx |
| 662 | 2026-03-11T21:00:00Z | Fix wrong sign of ladder rung phase in twin-ladder: used +mT·log(p) instead of −mT·log(p) | twin-ladder.js |
| 663 | 2026-03-11T22:00:00Z | Add hover crosshair and value readout to Thermodynamics tab in SupercriticalViz | SupercriticalViz.jsx |
| 664 | 2026-03-11T23:00:00Z | Memoize heatFlowZeros and heatFlowScan in HeatFlowTab to avoid recomputing on resize | SupercriticalViz.jsx |
| 665 | 2026-03-12T00:15:00Z | Guard cLog and cPow against near-zero magnitudes that produce -Infinity/NaN | zeta.js |
| 666 | 2026-03-11T23:45:00Z | Add semi-transparent background boxes to all three legends in GUEStatisticsViz | GUEStatisticsViz.jsx |
| 667 | 2026-03-12T01:00:00Z | Fix AnimatedModesViz explainer omitting log(p) factor from stated amplitude formula | AnimatedModesViz.jsx |
| 668 | 2026-03-11T07:30:00Z | Add largest-prime hint to Primes slider in InformationTheoryViz | InformationTheoryViz.jsx |
| 669 | 2026-03-11T12:00:00Z | Track phase min/max inline during unwrap loop instead of spreading array twice in FourierDomainViz | FourierDomainViz.jsx |
| 670 | 2026-03-12T02:00:00Z | Add largest-prime hint to Primes slider in OddZetaViz | OddZetaViz.jsx |
| 671 | 2026-03-11T12:30:00Z | Fix Ladder Freezing legend: use dashed line for proxy and add background box | TwinLadderViz.jsx |
| 672 | 2026-03-11T16:00:00Z | Fix transmission coefficient label from T to T² for consistency with Γ² in WaveSimViz | WaveSimViz.jsx |
| 673 | 2026-03-12T02:30:00Z | Add Lehmer phenomenon explainer card to ZetaPage | ZetaPage.jsx |
| 674 | 2026-03-11T17:00:00Z | Fix error convergence legend in PascalZetaViz Constants tab to show line+circle markers | PascalZetaViz.jsx |
| 675 | 2026-03-11T19:00:00Z | Add background box to Hilbert-Polya tab legend in GapClosingViz | GapClosingViz.jsx |
| 676 | 2026-03-11T20:00:00Z | Memoize log-magnitude arrays in RegularizationTab to avoid recomputing on resize | GapClosingViz.jsx |
| 677 | 2026-03-11T21:30:00Z | Fix heatmap hover tooltip clamped at log(1+|ζ|)=4.000 for large zeta magnitudes | ZetaLandscapeViz.jsx |
| 678 | 2026-03-11T22:00:00Z | Fix wrong sign in impulse response phase formula: +arg ρ should be −arg ρ | PaperPage.jsx |
| 679 | 2026-03-11T23:00:00Z | Add background box and circle marker to Keiper-Li tab legend in LiCriterionViz | LiCriterionViz.jsx |
| 680 | 2026-03-11T23:30:00Z | Add γ_max and largest-prime hints to sliders in RHAttackViz | RHAttackViz.jsx |
| 681 | 2026-03-12T03:00:00Z | Memoize Z(t) values in ZetaLandscapeViz critical-line mode to avoid recomputing on resize | ZetaLandscapeViz.jsx |
| 682 | 2026-03-12T04:00:00Z | Add tab-by-tab exploration guide card to OddZetaPage for all five OddZetaViz tabs | OddZetaPage.jsx |
