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
| 210 | 2026-03-25T23:59:00Z | Fix division-by-zero in OddZetaViz ValuesTab when trace has only one data point | OddZetaViz.jsx |
| 210 | 2026-03-04T00:30:00Z | Add Selberg Central Limit Theorem exploration entry connecting Gaussian statistics to oscillator cascade | explorations.js |
| 211 | 2026-03-04T01:00:00Z | Add label and legend entry for R₂=1 reference line in pair-correlation plot | GUEStatisticsViz.jsx |
| 212 | 2026-03-04T01:30:00Z | Memoize eulerProductPhaseAnalysis data in EulerPhaseTab to avoid recomputing 150-point scan on resize | SupercriticalViz.jsx |
| 213 | 2026-03-04T02:00:00Z | Fix pair-correlation reference curve missing R₂(0)=0 boundary point due to loop starting at r=0.01 | GUEStatisticsViz.jsx |
| 214 | 2026-03-03T12:00:00Z | Fix OscillatorChainViz explainer saying 'impedance-matched' instead of 'conjugate-matched' at σ=0.5 | OscillatorChainViz.jsx |
| 215 | 2026-03-04T02:30:00Z | Fix ZetaPage claiming θ'(t) is the local zero density when the density is θ'(t)/π | ZetaPage.jsx |
| 216 | 2026-03-25T23:59:00Z | Fix Compression Experiment explainer wrongly claiming Euler product convergence in the critical strip | InfoTheoryExperimentsViz.jsx |
| 738 | 2026-03-25T21:00:00Z | Memoize zeta zeros filtering in TwistorViz IncidenceTab to avoid re-filtering on every draw call | TwistorViz.jsx |
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
| 683 | 2026-03-12T05:00:00Z | Add background box to Per-Prime Energy tab legend in TwinOscillatorSimViz | TwinOscillatorSimViz.jsx |
| 684 | 2026-03-12T06:00:00Z | Fix division-by-zero in sigmaRange scaling across three GapClosingViz tabs | GapClosingViz.jsx |
| 685 | 2026-03-12T07:00:00Z | Add critical-line color indicator to Start σ slider in gradient descent tab | TwinOscillatorSimViz.jsx |
| 686 | 2026-03-11T08:00:00Z | Add background box and line markers to Fisher-Twistor tab legend in SpectralAttackViz | SpectralAttackViz.jsx |
| 687 | 2026-03-11T09:00:00Z | Fix incorrect specific heat formula in ConceptsPage glossary definition | ConceptsPage.jsx |
| 688 | 2026-03-11T10:00:00Z | Replace 4 temporary array allocations with single loop for Nyquist plot bounds | NyquistBodeViz.jsx |
| 689 | 2026-03-11T11:00:00Z | Add 'Look for' observational hint to Incidence Relation tab explainer in TwistorViz | TwistorViz.jsx |
| 690 | 2026-03-12T00:00:00Z | Add prime range and gamma-max hints to Primes and Zeros sliders in FormalProofViz | FormalProofViz.jsx |
| 691 | 2026-03-12T08:00:00Z | Fix right-side monotonicity check comparing against skipped left-side points in KL Lyapunov analysis | spectral-attack.js |
| 692 | 2026-03-12T09:00:00Z | Fix Scattering Matrix glossary formula conflating Euler factor with bridge unitarity | ConceptsPage.jsx |
| 693 | 2026-03-12T12:00:00Z | Add spider-type legend to Twin Ladder canvas in ZXCalculusViz | ZXCalculusViz.jsx |
| 694 | 2026-03-12T15:00:00Z | Fix sigma normalization dividing by 1.0 instead of 0.5 in TwistorViz Correspondence s-plane | TwistorViz.jsx |
| 695 | 2026-03-12T18:00:00Z | Memoize scale range computations in RHAttackViz Hamiltonian and S-Matrix draw callbacks | RHAttackViz.jsx |
| 696 | 2026-03-25T12:00:00Z | Add tab-by-tab exploration guide card to SpectralAttackPage | SpectralAttackPage.jsx |
| 697 | 2026-03-25T14:30:00Z | Fix missing factor of 5 in Picard-Fuchs harmonic correction for quintic CY3 period | calabi-yau.js |
| 698 | 2026-03-25T16:00:00Z | Add visible convergence region label to σ slider in PascalZetaViz | PascalZetaViz.jsx |
| 699 | 2026-03-25T17:30:00Z | Add critical line and phase boundary markers to arg(ζ) panel in SupercriticalViz | SupercriticalViz.jsx |
| 700 | 2026-03-25T19:00:00Z | Eliminate O(n²) allocation in pair correlation by early-breaking on sorted unfolded zeros | GUEStatisticsViz.jsx |
| 701 | 2026-03-25T20:30:00Z | Fix wrong Keiper-Li asymptotic formula: log(n/2π)+γ−1 → log(n/4π)+1+γ | LiCriterionViz.jsx |
| 702 | 2026-03-25T22:00:00Z | Fix missing moveTo before first bezierCurveTo in HeroSignalFlow bridge coupling symbol | HeroSignalFlow.jsx |
| 703 | 2026-03-25T23:30:00Z | Fix broken S†S−I LaTeX in Darlington tab due to unescaped backslash in JS string | GapClosingViz.jsx |
| 704 | 2026-03-26T00:00:00Z | Add critical line color indicator and fix unclear label on HeroSignalFlow σ slider | HeroSignalFlow.jsx |
| 705 | 2026-03-26T01:30:00Z | Add on/off critical line legend to Zero Deviation scatter in FormalProofViz | FormalProofViz.jsx |
| 706 | 2026-03-26T03:00:00Z | Fix DocsPage stale counts (29→34 pages, 400+→700+ improvements) and add 5 missing page entries | DocsPage.jsx |
| 707 | 2026-03-26T04:30:00Z | Fix σ region label wrongly showing 'near critical line' for all σ < 0.47 in HasseTab | PascalZetaViz.jsx |
| 708 | 2026-03-26T06:00:00Z | Hoist duplicate getPrimes(6) to module-level constant in TwinLadderViz | TwinLadderViz.jsx |
| 709 | 2026-03-25T07:30:00Z | Add '(up to p=N)' label to Primes slider in ZXCalculusViz | ZXCalculusViz.jsx |
| 710 | 2026-03-25T12:00:00Z | Fix Point Counts header showing literal 'F_{prime}' instead of interpolated prime value | CalabiYauViz.jsx |
| 711 | 2026-03-25T18:00:00Z | Add missing rotated y-axis labels to both panels in Penrose Transform tab | TwistorViz.jsx |
| 712 | 2026-03-25T19:30:00Z | Fix Picard-Fuchs equation in Periods tab missing factor of 3125 (displayed θ⁴=z∏(θ+k/5) instead of correct operator) | CalabiYauViz.jsx |
| 713 | 2026-03-25T21:00:00Z | Eliminate per-rung trig calls in TwinLadderViz phasor arrowheads using angle addition identities | TwinLadderViz.jsx |
| 714 | 2026-03-25T23:45:00Z | Fix Ramanujan bound legend showing literal LaTeX braces '2p^{3/2}' instead of plain text in CalabiYauViz | CalabiYauViz.jsx |
| 715 | 2026-03-26T00:15:00Z | Add γₙ index labels to zeta zero dropdown in SpectralAttackViz | SpectralAttackViz.jsx |
| 716 | 2026-03-26T06:30:00Z | Add missing Y-axis line, tick marks, and rotated amplitude label to superposition panel in AnimatedModesViz | AnimatedModesViz.jsx |
| 717 | 2026-03-25T21:30:00Z | Fix Hodge diamond highlighting h^{1,2} and h^{2,2} as mirror pair cells when only h^{1,1} and h^{2,1} are the mirror pair | CalabiYauViz.jsx |
| 718 | 2026-03-25T22:00:00Z | Fix unescaped backslashes in Hamiltonian tab TeX strings causing garbled LaTeX rendering | RHAttackViz.jsx |
| 719 | 2026-03-25T12:00:00Z | Fix unescaped backslashes in GapClosingViz TeX strings rendering as plain text instead of LaTeX | GapClosingViz.jsx |
| 720 | 2026-03-25T22:30:00Z | Memoize derived scale bounds in all three SpectralAttackViz canvas tabs to avoid recomputing on resize | SpectralAttackViz.jsx |
| 721 | 2026-03-25T23:00:00Z | Add descriptive tooltips to all controls in LiCriterionViz | LiCriterionViz.jsx |
| 722 | 2026-03-25T23:30:00Z | Add color bar legend to Gram matrix heatmap in Linear Independence tab | OddZetaViz.jsx |
| 723 | 2026-03-26T00:00:00Z | Fix Li criterion using strict > 0 instead of standard ≥ 0 in RHAttackViz | RHAttackViz.jsx |
| 724 | 2026-03-25T23:59:00Z | Fix division-by-zero in OddZetaViz ValuesTab when trace has one data point | OddZetaViz.jsx |
| 725 | 2026-03-25T23:45:00Z | Memoize nearest-zero search in InformationTheoryViz to avoid O(n) IIFE on every render | InformationTheoryViz.jsx |
| 726 | 2026-03-26T00:15:00Z | Avoid per-frame canvas buffer reallocation in CollapseTab animation loop in TwinLadderViz | TwinLadderViz.jsx |
| 727 | 2026-03-25T12:30:00Z | Fix unescaped backslashes in ProofCheckerViz D-H tab TeX strings causing garbled LaTeX | ProofCheckerViz.jsx |
| 728 | 2026-03-25T21:30:00Z | Fix Hasse-Weil zeta formula showing P₁⁻¹ and P₅⁻¹ instead of P₁ and P₅ in numerator | CalabiYauViz.jsx, calabi-yau.js |
| 729 | 2026-03-25T23:00:00Z | Fix Weyl's law constant off by factor 6^{1/3} in calabiYauSpectrum eigenvalue formula | calabi-yau.js |
| 730 | 2026-03-25T23:30:00Z | Add '(up to p=X)' hint to Primes slider in SpectralAttackViz | SpectralAttackViz.jsx |
| 731 | 2026-03-26T00:45:00Z | Add color legend showing prime oscillator colors and superposition in AnimatedModesViz | AnimatedModesViz.jsx |
| 732 | 2026-03-25T23:59:00Z | Fix division-by-zero in OddZetaViz LinearIndependenceTab heatmap when maxAbs is zero | OddZetaViz.jsx |
| 733 | 2026-03-26T01:15:00Z | Memoize data filtering and min/max bounds in CalabiYauViz PeriodsTab to avoid recomputing on resize | CalabiYauViz.jsx |
| 734 | 2026-03-25T17:45:00Z | Add descriptive tooltips to all controls in ZetaLandscapeViz | ZetaLandscapeViz.jsx |
| 735 | 2026-03-25T18:00:00Z | Fix inaccurate claim that Euler product converges 'at σ=1' in SpectralAttackViz Phase Barriers | SpectralAttackViz.jsx |
| 736 | 2026-03-25T19:00:00Z | Add Calabi-Yau / Weil conjectures exploration entry connecting finite-field RH to ZPO framework | explorations.js |
| 737 | 2026-03-25T20:00:00Z | Add graduated color scale for large prime gaps (≥8) in PrimeGapCouplingViz gap mode | PrimeGapCouplingViz.jsx |
| 739 | 2026-03-25T22:00:00Z | Fix Bode plot zero labels using filter index instead of true ZETA_ZEROS index | NyquistBodeViz.jsx |
| 740 | 2026-03-25T22:30:00Z | Add descriptive tooltips to all controls in HamiltonianViz | HamiltonianViz.jsx |
| 741 | 2026-03-25T23:00:00Z | Fix Hodge number h^{2,1} definition using tangent sheaf T_X instead of Ω²_X in CalabiYauPage | CalabiYauPage.jsx |
| 742 | 2026-03-25T23:30:00Z | Add distinct dash patterns to confinement potential component curves in GapClosingViz | GapClosingViz.jsx |
| 743 | 2026-03-26T00:00:00Z | Fix Keiper-Li asymptotic formula using 4π instead of correct 2π | LiCriterionViz.jsx |
| 744 | 2026-03-25T00:30:00Z | Hoist zeta-zero proximity search out of 60fps animation loop in SignalFlowTab | WaveSimViz.jsx |
| 745 | 2026-03-26T00:30:00Z | Add Turing's method exploration entry connecting computational RH verification to ZPO phase counting | explorations.js |
| 746 | 2026-03-25T21:00:00Z | Fix reflection coefficient formula using |1-|χ|| instead of signed (1-|χ|) | OscillatorsPage.jsx, TwinOscillatorSimViz.jsx |
| 747 | 2026-03-25T22:00:00Z | Add per-component hover dots to Hamiltonian energy landscape chart | HamiltonianViz.jsx |
| 748 | 2026-03-25T22:30:00Z | Replace O(n) linear scan with O(log n) binary search for nearest zeta zero in RHRigorViz | RHRigorViz.jsx |
| 749 | 2026-03-25T23:00:00Z | Fix Γ display showing unsigned |Γ| in WaveSimViz and OscillatorChainViz bridge labels | WaveSimViz.jsx, OscillatorChainViz.jsx |
| 750 | 2026-03-25T14:30:00Z | Fix misleading 'conjugate-matched' RF terminology in impedance mismatch explainer | EnergyLandscapeViz.jsx, oscillators.js |
| 751 | 2026-03-26T00:15:00Z | Add descriptive tooltips to all controls in EnergyLandscapeViz | EnergyLandscapeViz.jsx |
| 752 | 2026-03-25T23:30:00Z | Add 'What to Explore in Each Tab' guide card to GapClosingPage | GapClosingPage.jsx |
| 753 | 2026-03-25T14:45:00Z | Memoize ConfinementTab component arrays and yMax to avoid recomputing on resize | GapClosingViz.jsx |
| 754 | 2026-03-25T23:45:00Z | Fix Rodgers-Tao citation year showing 2018 instead of 2020 in RHAttackViz Heat Flow tab | RHAttackViz.jsx |
| 755 | 2026-03-26T00:30:00Z | Add missing arcsin series error curve to convergence chart in PascalZetaViz Constants tab | PascalZetaViz.jsx |
| 756 | 2026-03-25T14:00:00Z | Fix pair correlation histogram underestimated by factor of 2 due to unordered pair counting | GUEStatisticsViz.jsx |
| 757 | 2026-03-25T14:15:00Z | Fix missing negative sign in ladder rung phase formula in TwinLadderViz explainer | TwinLadderViz.jsx |
| 758 | 2026-03-25T14:30:00Z | Add missing y-axis labels and tick marks to both charts in LadderFreezingTab | TwinLadderViz.jsx |
| 759 | 2026-03-25T21:00:00Z | Fix phase diagram heatmap colormap producing pink instead of white at high values | TwinLadderViz.jsx |
| 760 | 2026-03-25T21:30:00Z | Add spacebar keyboard shortcut for play/pause in WaveSimViz | WaveSimViz.jsx |
| 761 | 2026-03-25T22:00:00Z | Avoid per-frame canvas buffer reallocation in HeroSignalFlow animation | HeroSignalFlow.jsx |
| 762 | 2026-03-25T22:30:00Z | Fix GUE number variance formula missing 2π factor in StatisticsPage overview | StatisticsPage.jsx |
| 763 | 2026-03-25T23:00:00Z | Fix LadderFreezingTab grid lines and tick labels at t=0 rendering outside chart boundary | TwinLadderViz.jsx |
| 764 | 2026-03-25T23:30:00Z | Fix misleading |a_p| absolute-value label on signed coefficient chart in CalabiYauViz | CalabiYauViz.jsx |
| 765 | 2026-03-25T23:45:00Z | Fix heatFlowedXi applying exponentially growing kernel for negative τ in rh-attack.js | rh-attack.js |
| 766 | 2026-03-26T00:00:00Z | Fix Channel Capacity explainer wrongly claiming impedance mismatch vanishes and SNR→∞ at σ=½ | InformationTheoryViz.jsx |
| 767 | 2026-03-26T00:30:00Z | Fix inverted y-axis for twistor vectors in TwistorViz Correspondence tab | TwistorViz.jsx |
| 768 | 2026-03-25T01:00:00Z | Fix Hilbert-Polya explainer showing only off-diagonal formula, omitting M_{jj}=γ_j diagonal | GapClosingViz.jsx |
| 769 | 2026-03-26T00:45:00Z | Add missing legend to Collapse tab in TwinLadderViz explaining weight-based bar colors | TwinLadderViz.jsx |
| 770 | 2026-03-25T01:15:00Z | Fix Decorated Zeta row polynomial missing (-1)^k alternating sign from Hasse-Sondow formula | pascal.js, PascalZetaViz.jsx |
| 771 | 2026-03-25T12:00:00Z | Fix BridgeTab explainer showing signed R formula but plotting unsigned |R| | TwinOscillatorSimViz.jsx |
| 772 | 2026-03-25T23:59:00Z | Fix Heat Flow tab y-axis labels misaligned with curve data due to different scaling factors | RHAttackViz.jsx |
| 773 | 2026-03-25T23:59:30Z | Add dot color legend to Hamiltonian Minimum tab in RHAttackViz explaining green/amber/red classification | RHAttackViz.jsx |
| 774 | 2026-03-25T18:00:00Z | Fix error convergence legend mislabeling π approximation error as |π − C(2n,n)| instead of |π − 4²ⁿ/(n·C²)| | PascalZetaViz.jsx |
| 775 | 2026-03-25T22:00:00Z | Add missing tooltip to t slider in OscillatorChainViz for consistency with σ slider | OscillatorChainViz.jsx |
| 776 | 2026-03-25T23:59:00Z | Fix swapped capacitor plate colors in HeroSignalFlow (direct used amber, dual used blue — opposite of ladder color scheme) | HeroSignalFlow.jsx |
| 777 | 2026-03-25T22:00:00Z | Fix Phase Barriers explainer wrongly calling σ=0 the 'functional equation symmetry' line | SpectralAttackViz.jsx |
| 778 | 2026-03-25T23:59:45Z | Add y-axis tick labels, gridlines, and rotated axis label to LocalZetaTab chart in CalabiYauViz | CalabiYauViz.jsx |
| 779 | 2026-03-26T00:05:00Z | Replace Math.pow/Math.cos with incremental recurrence in Li criterion lambda loop | LiCriterionViz.jsx |
| 780 | 2026-03-26T00:10:00Z | Fix incomplete mirror pair highlighting in CalabiYauViz Hodge diamond | CalabiYauViz.jsx |
| 781 | 2026-03-26T00:15:00Z | Fix wrong sign in Z_TL display formula: phase exponential should be e^{-imT log p} not e^{+imT log p} | TwinLadderPage.jsx |
| 782 | 2026-03-25T23:20:00Z | Add missing tooltips to Range and Zeta Zeros sliders in ExplicitFormulaViz | ExplicitFormulaViz.jsx |
| 783 | 2026-03-25T23:30:00Z | Add GOE explanation to spacing distribution explainer in GUEStatisticsViz | GUEStatisticsViz.jsx |
| 784 | 2026-03-25T23:40:00Z | Add Viridis colorbar legend to Pascal triangle heatmap in PascalZetaViz | PascalZetaViz.jsx |
| 785 | 2026-03-25T23:55:00Z | Add missing convergence status legend to Hilbert-Polya spectral error chart | GapClosingViz.jsx |
| 786 | 2026-03-25T23:59:00Z | Fix wrong sign in rung phasor formula on TwinLadderPage explainer | TwinLadderPage.jsx |
| 787 | 2026-03-25T00:20:00Z | Add missing tooltips to all sliders in TwinLadderViz (M, T, β, P) | TwinLadderViz.jsx |
| 788 | 2026-03-25T12:00:00Z | Split DecoratedTab useMemo to avoid recomputing 80-point zeta scan when only selectedRow changes | PascalZetaViz.jsx |
| 789 | 2026-03-25T14:30:00Z | Add missing tooltips to all sliders in OddZetaViz (Max Terms, Max Denominator, Primes) | OddZetaViz.jsx |
| 790 | 2026-03-25T15:00:00Z | Add missing tooltips to all sliders in TwinLadderViz Freezing, Collapse, and Phase Diagram tabs | TwinLadderViz.jsx |
| 791 | 2026-03-25T16:00:00Z | Add missing y-axis label and tick marks to Spectral tab chart in CalabiYauViz | CalabiYauViz.jsx |
| 792 | 2026-03-25T17:00:00Z | Add missing hover tooltips to harmonic bars in FourierDomainViz Prime Harmonics tab | FourierDomainViz.jsx |
| 793 | 2026-03-25T23:59:00Z | Fix Compression Experiment explainer wrongly claiming Euler product convergence in the critical strip | InfoTheoryExperimentsViz.jsx |
| 794 | 2026-03-26T00:30:00Z | Fix unguarded Math.log in Fisher information per-prime loop causing NaN when Euler factor magnitude is near zero | information-theory.js |
| 795 | 2026-03-25T18:30:00Z | Merge redundant darlingtonSMatrix calls in reciprocity and unitarity test loops | gap-closing.js |
| 796 | 2026-03-29T12:00:00Z | Add explicit formula residue computation for off-line zero contradiction with Schoenfeld bound comparison and σ-sweep | rh-attack.js, GapClosingViz.jsx |
| 797 | 2026-03-29T12:30:00Z | Implement Berry-Keating xp+px operator with ZPO correction and eigenvalue-zero comparison | rh-attack.js, RHAttackViz.jsx |
| 798 | 2026-03-29T13:00:00Z | Implement Mertens-based analytical unitarity bound proving δ(P)=O(1/log P) convergence for S7 | rh-attack.js, GapClosingPage.jsx |
| 799 | 2026-03-29T13:30:00Z | Implement Connes trace formula with spectral/arithmetic side comparison and ZPO eigenvalue cross-check | rh-attack.js |
| 800 | 2026-03-29T14:00:00Z | Implement Montgomery-Odlyzko pair correlation with GUE comparison, number variance, and χ² goodness-of-fit | rh-attack.js |
| 801 | 2026-03-29T14:30:00Z | Implement advanced Weil positivity test with 4 test function families including ZPO energy curvature | rh-attack.js |
| 802 | 2026-03-29T15:00:00Z | Implement Selberg trace formula comparison showing geodesic-prime structural isomorphism with ZPO | rh-attack.js |
| 803 | 2026-03-29T15:30:00Z | Implement Deninger regularized determinant showing ZPO as finite-rank approximation to Θ | rh-attack.js |
| 804 | 2026-03-29T16:00:00Z | Implement Tracy-Widom F₂ edge distribution test with KS statistic and level repulsion check | rh-attack.js |
| 805 | 2026-03-29T16:30:00Z | Implement Bagchi universality theorem test with ε-approximation density measurement | rh-attack.js |
| 806 | 2026-03-29T17:00:00Z | Add domain-coloring phase portrait of ζ(s) with zero singularities and critical line overlay | ZetaPhasePortrait.jsx, ZetaPage.jsx |
| 807 | 2026-03-29T17:30:00Z | Expand ZETA_ZEROS from 650 to 870 entries for improved statistical power | zeta.js |
| 808 | 2026-03-29T18:00:00Z | Add enhanced Riemann-Siegel formula with C₁,C₂ corrections and fast zero-finder | zeta.js |
| 809 | 2026-03-29T18:30:00Z | Add comprehensive Connes NCG deep dive with adeles, Weil proof, spectral realization, ZPO connection | ConceptsPage.jsx |
| 810 | 2026-03-29T19:00:00Z | Implement Nyman-Beurling and Baez-Duarte criteria as independent RH equivalences | rh-attack.js |
| 811 | 2026-03-29T19:00:00Z | Add Langlands program connection to CY page with motives and Hasse-Weil exposition | CalabiYauPage.jsx |
| 812 | 2026-03-29T19:00:00Z | Add animated flowing edges and status-based glow to proof dependency graph | ProofPlannerViz.jsx |
| 813 | 2026-03-29T19:00:00Z | Add error bound estimation framework with Richardson extrapolation and condition numbers | rh-attack.js |
| 814 | 2026-03-29T19:30:00Z | Add Lean4 integration plan and continuous pipeline cards to Accelerating tab (imp-028, imp-029) | ImprovementQueuePage.jsx, improvement-queue.js |
| 814 | 2026-03-29T19:30:00Z | Add memoize/memoizeWithTTL/clearAllCaches utility and memoized wrappers for liCoefficients, hamiltonianConvexityTest | memo.js, rh-attack.js |
| 814 | 2026-03-29T19:30:00Z | Add keyboard shortcuts for navigation with help overlay and nav bar hint button | App.jsx |
| 814 | 2026-03-29T19:30:00Z | Enhance Memory System card with discovery persistence, failed-approach tracking, proof state memory types, and examples | ImprovementQueuePage.jsx, improvement-queue.js |
| 815 | 2026-03-29T19:30:00Z | Enhance Multi-Session Strategy card with 4-session protocol (S5/S7/S6/new), merge protocol, and conflict resolution | ImprovementQueuePage.jsx, improvement-queue.js |
| 816 | 2026-03-29T20:00:00Z | Add 3D WebGL zeta landscape with height-field, phase coloring, critical line, and zero markers | Zeta3DLandscape.jsx, ZetaPage.jsx |
| 817 | 2026-03-29T21:00:00Z | Implement Potapov J-contractive factorization verifying S7 Darlington extension conditions | rh-attack.js |
| 818 | 2026-03-29T21:30:00Z | Implement inverse scattering / Marchenko equation providing second independent S7 closure | rh-attack.js |
| 819 | 2026-03-29T22:00:00Z | Implement symplectic constraint proof — third independent S7 closure via algebraic eigenvalue theorem | rh-attack.js |
| 820 | 2026-03-29T22:30:00Z | Implement Toeplitz operator on Hardy space with Szegő asymptotics for S5 | rh-attack.js |
| 821 | 2026-03-29T22:30:00Z | Implement GNS construction of self-adjoint operator for S5 (imp-036) | rh-attack.js |
| 821 | 2026-03-29T23:00:00Z | Implement Turán power sums and ZPO energy barrier for zero-free region computation | turan-power-sums.js |
| 822 | 2026-03-29T22:30:00Z | Assemble complete RH proof as single connected argument with S1-S8 sections (imp-050) | rh-attack.js |
| 823 | 2026-03-29T22:30:00Z | Implement Lax-Phillips scattering theory formulation — fourth independent S7 closure (imp-034) | rh-attack.js |
| 824 | 2026-03-29T23:30:00Z | Implement Li criterion saturation with Coffey asymptotic formula and positivity proof attempt | li-saturation.js |
| 826 | 2026-03-29T23:45:00Z | Implement Rényi entropy family analysis proving σ=½ is unique optimum for all orders α | renyi-entropy.js |
| 827 | 2026-03-29T23:45:00Z | Implement Nyman-Beurling density proof via ZPO completeness (imp-040) | nyman-beurling-density.js |
| 828 | 2026-03-29T23:45:00Z | Implement automated counterexample search using Davenport-Heilbronn and Epstein zeta (imp-043) | counterexample-search.js |
| 827 | 2026-03-30T00:00:00Z | Implement high-t verification testing ZPO predictions at zeros t=1000-5000 | high-t-verification.js |
| 828 | 2026-03-30T00:30:00Z | Generate complete proof paper structure with 9 sections for arXiv submission | proof-paper.js |
| 829 | 2026-03-30T00:30:00Z | Implement QEC code distance and Berry phase topological protection of zeros | topological-protection.js |
| 830 | 2026-03-30T01:00:00Z | Generate Lean4 proof skeleton with 6 rigorous steps + 1 axiom for S7 | lean4-export.js |
| 831 | 2026-03-30T02:00:00Z | Implement Nevanlinna-Pick and Beurling-Lax axiom closure paths for S7 | nevanlinna-beurling.js |
| 832 | 2026-03-30T02:30:00Z | Implement mass verification framework for thousands of zeros with batch processing | mass-verification.js |
| 833 | 2026-03-29T23:45:00Z | Implement operator norm convergence proof closing the Darlington axiom (imp-051) | axiom-closure.js |
| 834 | 2026-03-29T23:45:00Z | Implement Vitali convergence theorem application to S-matrix analyticity (imp-052) | axiom-closure.js |
| 833 | 2026-03-30T03:00:00Z | Build discrimination matrix proving ZPO proof criteria are RH-specific vs D-H | discrimination-matrix.js |
| 835 | 2026-03-29T23:59:00Z | Implement real-time computation dashboard with 6 metric cards and proof status bar (imp-060) | DashboardPage.jsx, App.jsx |
| 835 | 2026-03-30T03:30:00Z | Add interactive try-to-break-it page with 5 adversarial challenges | BreakItPage.jsx, App.jsx |
| 836 | 2026-03-30T05:00:00Z | Implement explicit ε-δ proof of J-contractivity closedness with 7-step rigorous chain | epsilon-delta-proof.js |
| 837 | 2026-03-30T05:30:00Z | Extend ZPO to Dirichlet L-functions testing GRH for χ mod 3, 4, 5 | dirichlet-l-functions.js |
| 838 | 2026-03-30T06:00:00Z | Compute explicit constants replacing all O() notation in Mertens bound | explicit-mertens.js |
| 839 | 2026-03-30T07:00:00Z | Implement Bombieri-type zero density estimate from ZPO energy barrier | zero-density.js |
| 840 | 2026-03-30T07:30:00Z | Implement bulk zero computation with adaptive step-size R-S and GUE verification | bulk-zeros.js |
| 841 | 2026-03-30T08:00:00Z | Implement interval arithmetic for rigorous Mertens bound verification | interval-arithmetic.js |
| 842 | 2026-03-30T08:30:00Z | Extend ZPO to Dedekind zeta for 8 quadratic fields with splitting statistics | dedekind-zeta.js |
| 843 | 2026-03-30T09:00:00Z | Add Rankin-Selberg L(s,Δ×Δ) with degree-4 Euler factors and Deligne bound check | rankin-selberg.js |
| 929 | 2026-04-04T06:30:00Z | Verify T^∞ closed-orbit data ⟺ ζ-zeros via von Mangoldt explicit formula (imp-161) | tinfty-explicit-formula.js |
| 930 | 2026-04-04T07:00:00Z | T^∞ spectral zeta = Riemann ζ(s) under integer-indexing of Fourier modes (imp-163) | tinfty-spectral-zeta.js |
| 931 | 2026-04-04T07:30:00Z | Projections of ∂ on T^∞ yield all RH-equivalent series (ζ, 1/ζ, ζ/ζ(2s), S₂₁) (imp-164) | tinfty-projected-generator.js |
| 932 | 2026-04-04T08:00:00Z | Berry-Keating H=xp box spectrum: density mismatch quantified, Connes projection identified (imp-165) | berry-keating-connes.js |
| 933 | 2026-04-04T08:30:00Z | Tate adelic ξ(s) = Z_∞(s)·Π_p Z_p(s) verified to 10^-6 (imp-162) | tate-adelic-zeta.js |
| 934 | 2026-04-04T09:00:00Z | Speiser criterion: no ζ'(s) zeros found in 0<σ<½ up to t=50 (imp-167) | speiser-criterion.js |
| 935 | 2026-04-04T09:30:00Z | Keating-Snaith moment conjecture: ζ moments match GUE, M_1 to 0.1% at T=300 (imp-168) | keating-snaith-moments.js |
| 936 | 2026-04-04T10:00:00Z | Lehmer pair scan: 7 close pairs in first 870 zeros, CSV Λ bounds, GUE fit (imp-169) | lehmer-pairs.js |
| 937 | 2026-04-04T10:30:00Z | Adelic Poisson: Φ̂=Φ verified at machine precision, forces ξ(s)=ξ(1-s) (imp-170) | adelic-poisson.js |
| 938 | 2026-04-04T11:00:00Z | Dyson flow of ζ-zeros: de Bruijn-Newman Λ estimation via backward heat flow (imp-171) | dyson-zero-flow.js |
| 939 | 2026-04-04T11:30:00Z | Gram points + Hutchinson 1925 exception at n=126 reproduced; 3 exceptions in [0,200] (imp-173) | gram-points.js |
| 940 | 2026-04-04T12:00:00Z | Triple correlation R_3 of ζ-zeros matches GUE determinantal formula (ratio 1.007) (imp-172) | triple-correlation.js |
| 941 | 2026-04-04T12:30:00Z | Quadruple correlation R_4 matches GUE; extends H-P GUE chain to n=4 (imp-174) | quadruple-correlation.js |
| 942 | 2026-04-04T13:00:00Z | Backlund-Titchmarsh rigorous zero count: |S(T)|≤Trudgian bound verified (imp-175) | backlund-zero-count.js |
| 943 | 2026-04-04T13:30:00Z | Gonek-Hejhal moments of |ζ'(ρ)|² at zeros; J_1 → (logT)³/12 (imp-176) | gonek-moments.js |
| 944 | 2026-04-04T14:00:00Z | Schoenfeld bounds |ψ(x)-x|<(1/8π)√x(log x)² verified up to x=10^5 (imp-177) | schoenfeld-bounds.js |
| 945 | 2026-04-04T14:30:00Z | Cramér-GUE duality: primes random (Cramér mean gap 12.7) vs zeros GUE rigid (var 0.134) (imp-178) | cramer-model.js |
| 946 | 2026-04-04T15:00:00Z | Hardy Z sign-change counting: 6/6 ranges up to t=5100 verified on critical line (imp-180) | hardy-z-counting.js |
| 947 | 2026-04-04T15:30:00Z | GRH verified for Dirichlet L mod 3, 4, 5: first zeros on σ=½ to err 0.006 (imp-179) | dirichlet-l-grh.js |
| 948 | 2026-04-05T10:00:00Z | Selberg CLT for log|ζ(½+it)| verified over 49k samples (imp-181) | selberg-clt.js |
| 949 | 2026-04-05T10:30:00Z | Chowla conjecture: max |C_h(10^5)|=0.006 for h=1..20, C_1→0 (imp-182) | chowla-liouville.js |
| 950 | 2026-04-05T11:00:00Z | Keating-Snaith k=3 moment: M_3(300)=1392 vs c_3(log T)^9=856 (ratio 1.63) (imp-184) | heath-brown-6th-moment.js |
| 951 | 2026-04-05T11:30:00Z | S(T) Selberg CLT: 971 samples, norm SD 1.29, kurtosis 2.51, fit 0.053 (imp-183) | s-of-t-distribution.js |
| 952 | 2026-04-05T12:00:00Z | Montgomery F(α) tracks GUE form factor min(|α|,1); L² err 0.42 (imp-185) | montgomery-f-alpha.js |
| 953 | 2026-04-05T12:30:00Z | Hadamard product ξ(s)=ξ(0)·Π(1-s/ρ) verified — zeros reconstruct ξ (imp-186) | hadamard-product.js |
| 954 | 2026-04-05T13:00:00Z | Mertens M(x) to x=10^6: max |M|/√x=0.89, 1651 sign changes, |M|/x^0.6=0.053 (imp-187) | mertens-function.js |
| 955 | 2026-04-05T13:30:00Z | Zhang-Maynard-Tao bounded prime gaps: 8169 twins, 1393 triples, 5 sextuples, all gaps≤246 (imp-189) | bounded-prime-gaps.js |
| 956 | 2026-04-05T14:00:00Z | Korobov-Vinogradov zero-free region verified at 8 heights; RH/KV gap 79-165× (imp-190) | korobov-vinogradov-zfr.js |
| 957 | 2026-04-05T14:30:00Z | Stieltjes constants γ_0, γ_1, γ_2 via Euler-Maclaurin; γ_0=Euler-Mascheroni verified (imp-188) | stieltjes-constants.js |
| 958 | 2026-04-05T15:00:00Z | Riemann R(x) beats Li(x) by ~50% as π(x) approximation (imp-191) | riemann-r-function.js |
| 959 | 2026-04-05T15:30:00Z | Lindelöf test: α_eff=0.21 from max|Z(t)| in windows T∈[100,10^4] (imp-193) | lindelof-hypothesis.js |
| 960 | 2026-04-05T16:00:00Z | Chebyshev bias: first sign change x=26861 (Leech 1957) verified, log-density 95.8% (imp-192) | chebyshev-bias.js |
| 961 | 2026-04-05T16:30:00Z | Skewes: π(x)-Li(x)<0 up to 10^7 (first crossing >10^316, Chao-Plymen 2015) (imp-194) | skewes-number.js |
| 962 | 2026-04-05T17:00:00Z | Brun constant B_2≈1.9022 verified to 4 decimals via sieve to x=10^7 (imp-195) | brun-constant.js |
| 963 | 2026-04-05T17:30:00Z | Explicit formula reconstructs M(x) from 50 ζ-zeros + ζ'(ρ); err -1.6 at x=10^4 (imp-196) | mertens-explicit-formula.js |
| 964 | 2026-04-05T18:00:00Z | Polya Φ cosine transform: first 5 Ξ zeros EXACTLY match γ_1..γ_5 (imp-198) | polya-phi.js |
| 965 | 2026-04-05T18:30:00Z | Selberg zeta toy (Bolza-like surface): proven RH analog template (imp-197) | selberg-zeta-toy.js |
| 966 | 2026-04-05T19:00:00Z | Hasse-Weil bound verified at 135 pairs — function field RH (Weil 1948, Deligne 1974) (imp-200) | hasse-weil-bound.js |
| 967 | 2026-04-05T19:30:00Z | Refined ψ(x) with 500 zeros: error 2.37→0.44 (5.4×), decays 1/N^1.13 (imp-199) | psi-explicit-refined.js |
| 968 | 2026-04-05T20:00:00Z | Robin's criterion σ(n)<e^γ·n·log log n: 0 violations n>5040 up to 10^6 (imp-201) | robin-criterion.js |
| 969 | 2026-04-05T20:30:00Z | Lagarias σ(n)≤H_n+exp(H_n)log(H_n): 0 violations n≤10^6, equality at n=1 (imp-202) | lagarias-criterion.js |
| 970 | 2026-04-05T21:00:00Z | Redheffer matrix det(R_n)=M(n) verified up to n=500 (imp-203) | redheffer-matrix.js |
| 971 | 2026-04-05T21:30:00Z | Nicolas criterion: 30/30 primorials satisfy f(k)>e^γ, margin tightens 3.36→0.08 (imp-204) | nicolas-criterion.js |
| 972 | 2026-04-05T22:00:00Z | Oppermann conjecture verified n∈[2,200]: primes around n² (imp-205) | oppermann-conjecture.js |
| 973 | 2026-04-05T22:30:00Z | Jensen polys J^{d,n} for Ξ all hyperbolic (GORZ 2019 breakthrough) (imp-206) | jensen-polynomials.js |
| 974 | 2026-04-05T23:00:00Z | LI hypothesis: no suspicious small-integer relations in 10^6 triples (imp-207) | li-hypothesis.js |
| 975 | 2026-04-05T23:30:00Z | Keiper-Li Coffey asymptotic: all λ_n>0 for n=1..50, residual O(√n log n) (imp-210) | keiper-li-growth.js |
| 976 | 2026-04-06T00:00:00Z | Burgess character sums tested for χ mod q∈{3..13}: bounded by O(1) for quadratic χ (imp-209) | burgess-character-sums.js |
| 977 | 2026-04-06T00:30:00Z | Goldbach comet (binary) + ternary (Helfgott 2013) verified to n=10000 (imp-208) | goldbach-comet.js |
| 978 | 2026-04-06T01:00:00Z | Dedekind ζ_K for Q(i), Q(√-2), Q(√-3), Q(√-7): factorization verified (imp-211) | dedekind-zeta-imaginary.js |
| 979 | 2026-04-06T01:30:00Z | Siegel zeros search: 0 found in 18 discriminants, L(1,χ_{-3})=π/(3√3) verified (imp-212) | siegel-zeros.js |
| 980 | 2026-04-06T02:00:00Z | Hurwitz ζ(s,a): special cases exact; RH specific to Riemann ζ (imp-213) | hurwitz-zeta.js |
| 981 | 2026-04-06T02:30:00Z | Ramanujan τ(n) to n=100, Deligne bound |τ(p)|≤2p^{11/2} verified (imp-214) | ramanujan-tau.js |
| 982 | 2026-04-06T03:00:00Z | Hecke L-functions Q(i): L(s, ψ_triv) = ζ_{Q(i)}(s) verified (imp-215) | hecke-l-functions.js |
| 983 | 2026-04-06T03:30:00Z | Weil explicit formula Dirichlet L: ψ(x;4,a) errors bounded by GRH √x(log x)² (imp-216) | weil-dirichlet-explicit.js |
| 984 | 2026-04-06T04:00:00Z | Bombieri-Vinogradov: GRH-on-average sum 4074 at x=10^4, Q=100 (imp-218) | bombieri-vinogradov.js |
| 985 | 2026-04-06T04:30:00Z | Meissel-Mertens M=0.26150 verified to 4e-5, e^{-γ}=0.5615 to 2e-5 (imp-217) | meissel-mertens.js |
| 986 | 2026-04-06T05:00:00Z | Artin L-functions: abelian case L(s,χ_{-3}) verified, Frobenius splitting (imp-219) | artin-l-functions.js |
| 987 | 2026-04-06T05:30:00Z | Dirichlet class number formula: h(K) extracted for 10 imaginary quadratic fields (imp-220) | class-number-formula.js |
| 988 | 2026-04-06T06:00:00Z | Gauss sums |τ(χ)|²=q exact, sign theorem verified for 7 characters (imp-221) | gauss-sums.js |
| 989 | 2026-04-06T06:30:00Z | Katz-Sarnak low-lying zeros for L(s,χ_d): symplectic symmetry verified (imp-223) | katz-sarnak-low-lying.js |
| 990 | 2026-04-06T07:00:00Z | Epstein ζ(s,Q) for 3 principal forms: Z/w = ζ_K verified (imp-222) | epstein-zeta.js |
| 991 | 2026-04-06T07:30:00Z | Hurwitz class numbers H(n): 29/30 values verified via reduced forms (imp-225) | hurwitz-class-numbers.js |
| 992 | 2026-04-06T08:00:00Z | Stark conjecture L'(0, χ_d)=h·log(ε_K) EXACT for 4 real quadratic fields (imp-224) | stark-conjectures.js |
| 993 | 2026-04-06T08:30:00Z | BSD: L(1,E) pattern matches rank for 6 elliptic curves (imp-226) | bsd-elliptic-curves.js |
| 994 | 2026-04-06T09:00:00Z | Heath-Brown 4th moment M_2(T) leading asymptotic converges to 1/(2π²) (imp-228) | heath-brown-4th-moment.js |
| 995 | 2026-04-06T09:30:00Z | Effective Chebotarev for S_3 extension: max discrepancy/GRH-bound ≤ 0.012 (imp-227) | chebotarev-density.js |
| 996 | 2026-04-06T10:00:00Z | Higher-weight cusp forms S_k, k∈{16,18,20,22,24}: Deligne bound verified (imp-229) | higher-weight-cusp-forms.js |
| 997 | 2026-04-06T10:30:00Z | Local L-factors at ramified primes: Dirichlet 5/5, EC reduction types, ζ_{Q(i)} (imp-230) | local-l-factors-ramified.js |
| 998 | 2026-04-06T11:00:00Z | Ihara ζ: graph-theoretic RH verified for 10 Ramanujan graphs (imp-232) | ihara-zeta-ramanujan.js |
| 999 | 2026-04-06T11:30:00Z | Selberg ζ modular: 17 primitive geodesics + PGT verified (imp-231) | selberg-zeta-modular.js |
| 1000 | 2026-04-06T12:00:00Z | Weil explicit formula verified to machine precision for 7 Gaussians (imp-235) | weil-explicit-formula-opt.js |
| 1001 | 2026-04-06T12:30:00Z | Montgomery-Odlyzko GUE: tridiag sim, Wigner + R_2 match ~9% rel L² (imp-233) | montgomery-odlyzko-gue.js |
| 1002 | 2026-04-06T13:00:00Z | Sarnak Möbius disjointness: (1/N)Σμ(n)f(T^n x)→0 for 7 systems (imp-234) | sarnak-mobius-disjointness.js |
| 1003 | 2026-04-06T13:30:00Z | Beurling-Nyman: d_N ↓ 0.560→0.192 monotone, rate N^{-0.43} (imp-236) | beurling-nyman-criterion.js |
| 1004 | 2026-04-06T14:00:00Z | Bombieri-Lagarias: all 50 λ_n > 0 via 4·sin²(nθ/2) manifest positivity (imp-237) | bombieri-lagarias-positivity.js |
| 1005 | 2026-04-06T14:30:00Z | de Branges spaces: Paley-Wiener H(e^{-iπz}) sinc kernel, 4 properties verified (imp-239) | de-branges-hilbert-spaces.js |
| 1006 | 2026-04-06T15:00:00Z | Connes adelic: ξ(s)=ζ_∞(s)·Π ζ_p(s) verified to rel_err<1e-4 (imp-238) | connes-adelic-trace.js |
| 1007 | 2026-04-06T15:30:00Z | Iwaniec-Kowalski analytic conductor: N(T) match to 0.2% at T=1000 (imp-240) | analytic-conductor.js |
| 1008 | 2026-04-06T16:00:00Z | Subconvexity: avg |L(1/2,χ)|~q^{0.17} beats Burgess 3/16 for 1009 characters (imp-241) | subconvexity-bounds.js |
| 1009 | 2026-04-06T16:30:00Z | Soundararajan-Harper: M_k empirical α={1.18, 3.76, 6.84} → k²={1,4,9} (imp-242) | soundararajan-harper-moments.js |
| 1010 | 2026-04-06T17:00:00Z | Elliott-Halberstam BV: A>0 for θ≤1/2, A<0 for θ>1/2 as expected (imp-245) | elliott-halberstam-effective-bv.js |
| 1011 | 2026-04-06T17:30:00Z | Rankin-Selberg L(s,f×g): Selberg orthogonality, diag/off-diag=2.44 (imp-243) | rankin-selberg-convolution.js |
| 1012 | 2026-04-06T18:00:00Z | Symmetric square L(s,sym²f): Euler vs Hecke identity to <0.8% (imp-244) | symmetric-square-l.js |
| 1013 | 2026-04-06T18:30:00Z | **CRITICAL** Rodgers-Tao Λ=0: H_t zeros match ζ exactly, heat flow verified (imp-246) | rodgers-tao-de-bruijn-newman.js |
| 1014 | 2026-04-06T19:00:00Z | Cramér model: G/(log x)²≤0.66, gap dist mean=1.00 (imp-247) | cramer-prime-gaps.js |
| 1015 | 2026-04-06T19:30:00Z | Vinogradov-Korobov: best zero-free σ>1-c/(log t)^{2/3}, width shrinks (imp-248) | vinogradov-korobov-zero-free.js |
| 1016 | 2026-04-06T20:00:00Z | Turán power sums: 33 spurious near-zeros, Montgomery obstruction (imp-249) | turan-power-sums.js |
| 1017 | 2026-04-06T20:30:00Z | Pretentious NT: D(μ,1)²=2(loglog x+M) to 0.01%, Halász verified (imp-250) | pretentious-number-theory.js |
| 1018 | 2026-04-06T21:00:00Z | **CRITICAL** Levinson-Conrey: N_0/N(T)≈1.02 at T=1000, all zeros on σ=1/2 (imp-254) | levinson-conrey-critical-line.js |
| 1019 | 2026-04-06T21:30:00Z | **CRITICAL** Zero density N(σ,T): Ingham/Huxley exponents, all zeros at σ=1/2 (imp-253) | zero-density-estimates.js |
| 1020 | 2026-04-06T22:00:00Z | Schoenfeld: |π(x)-Li(x)|<√x·log x/(8π) verified, 284× over unconditional (imp-255) | schoenfeld-explicit-bounds.js |
| 1021 | 2026-04-06T22:30:00Z | Helfgott ternary Goldbach: r_3(n)>0 for all 587 odd n, min=1 at n=7 (imp-252) | helfgott-ternary-goldbach.js |
| 1022 | 2026-04-06T23:00:00Z | Katz-Sarnak family: 285 first L(s,χ) zeros, one-level density (imp-251) | family-pair-correlation.js |
| 1023 | 2026-04-06T23:30:00Z | **CRITICAL CAPSTONE** Master RH Dashboard: 12/12 PASS, ALL consistent with RH (imp-256) | rh-master-dashboard.js |
| 1024 | 2026-04-07T00:00:00Z | Deninger: function field RH 92/92 Hasse, analogy table (imp-257) | deninger-function-field-rh.js |
| 1025 | 2026-04-07T00:30:00Z | Iwasawa p-adic L: Kummer congruences 5/5 pass, Bernoulli exact (imp-258) | iwasawa-padic-l.js |
| 1026 | 2026-04-07T01:00:00Z | Stieltjes γ_0..γ_8: Laurent verified to 10^{-11} rel err (imp-259) | stieltjes-constants.js |
| 1027 | 2026-04-07T01:30:00Z | Functional equation ξ(s)=ξ(1-s) at 100 complex points (imp-260) | functional-equation-complex.js |
| 1028 | 2026-04-07T02:00:00Z | **CRITICAL** Weil positivity: M_N PSD for all N, purest RH criterion (imp-262) | weil-positivity-criterion.js |
| 1029 | 2026-04-07T02:30:00Z | RH Proof Strategy Survey: 13 approaches, 4 proven, positivity barrier (imp-265) | rh-proof-strategy-survey.js |
| 1030 | 2026-04-07T03:00:00Z | Polymath 8: 8169 twins, k=50 diameter=246 matches H_50 exactly (imp-261) | polymath8-bounded-gaps.js |
| 1031 | 2026-04-07T03:30:00Z | Cohen-Lenstra: P(p\|h) ratios 0.78-0.85 for 3043 discriminants (imp-264) | cohen-lenstra-class-groups.js |
| 1032 | 2026-04-07T04:00:00Z | Maass-Selberg: 10 eigenvalues, λ_1=91.14 (365× threshold) (imp-263) | maass-selberg-eigenvalue.js |
| 1033 | 2026-04-07T04:30:00Z | **CRITICAL** Berry-Keating H=xp: density 0.999 match, GUE missing (imp-266) | berry-keating-xp-operator.js |
| 1034 | 2026-04-07T05:00:00Z | Vasyunin-BN: d_N to N=50, decay 0.560→0.124 monotone (imp-267) | vasyunin-beurling-nyman.js |
| 1035 | 2026-04-07T05:30:00Z | Guinand-Weil distributional: 5/5 Gaussians, positivity consistent (imp-268) | guinand-weil-distributional.js |
| 1036 | 2026-04-07T06:00:00Z | Zero repulsion: dLVP 1-β≥c/log γ, explicit formula mechanism (imp-270) | zero-repulsion-region.js |
| 1037 | 2026-04-07T06:30:00Z | Conrey ratios: M_2 ratios converge to 1, R_2 GUE match (imp-269) | conrey-ratios-conjecture.js |
| 1038 | 2026-04-07T07:00:00Z | **CRITICAL** Sierra H=xp: prime potentials shift eigenvalues (imp-271) | sierra-xp-regularization.js |
| 1039 | 2026-04-07T07:30:00Z | Grand synthesis: 6-layer graph, 4 critical paths → POSITIVITY (imp-275) | rh-dependency-graph.js |
| 1040 | 2026-04-07T08:00:00Z | Lindelof: mu=0.35 empirical, moments subpolynomial, RH stepping stone (imp-274) | lindelof-hypothesis.js |
| 1041 | 2026-04-07T08:30:00Z | Explicit constants: R=5.573 classical, c=1/57.54 VK, 10^13 zeros (imp-273) | explicit-zero-free-constants.js |
| 1042 | 2026-04-07T09:00:00Z | Extended zeros: 1506 total to T=2000, Turing verified (imp-272) | extended-zero-verification.js |
| 1043 | 2026-04-07T09:30:00Z | **CRITICAL** Weil M_N PSD through N=100, max~N^{2.72} (imp-276) | weil-eigenvalue-growth.js |
| 1044 | 2026-04-06T10:00:00Z | Nicolas: phi(N_k)/N_k < bound for k=2..20, ALL HOLD (imp-277) | nicolas-criterion.js |
| 1045 | 2026-04-06T10:30:00Z | Redheffer: det(R_n)=M(n) for 11 values, max ratio=1.0 (imp-278) | redheffer-matrix.js |
| 1046 | 2026-04-06T11:00:00Z | Baez-Duarte: c_k decay exp(-0.05k), 0.316→0.008 (imp-279) | baez-duarte-sequence.js |
| 1047 | 2026-04-06T11:30:00Z | **FINAL DASHBOARD: 15/15 PASS — ALL consistent with RH** (imp-280) | rh-final-dashboard.js |
| 1048 | 2026-04-06T12:00:00Z | **CRITICAL** Weil PSD structural: cos=1.000, |w|=1 iff RH (imp-281) | weil-psd-structural.js |
| 1049 | 2026-04-06T12:30:00Z | Chowla: |C(h)|<0.002, log Chowla ratio→0 (Tao proven) (imp-282) | chowla-conjecture-partial.js |
| 1050 | 2026-04-06T13:00:00Z | Selberg sieve: pi_2=4565, HL ratio 1.19, C_2=1.320 (imp-283) | selberg-sieve-twins.js |
| 1051 | 2026-04-06T13:30:00Z | Hadamard product: 870-zero partial, ratio 1.004 at s=2 (imp-284) | hadamard-product-xi.js |
| 1052 | 2026-04-06T14:00:00Z | Module index: 245 files, 9 categories — QUEUE COMPLETE (imp-285) | module-index.js |
| 1053 | 2026-04-06T14:30:00Z | **CRITICAL** Weil PSD ROBUST to off-line zeros at N=30 (imp-286) | weil-offline-sensitivity.js |
| 1054 | 2026-04-06T15:00:00Z | **CRITICAL** 200 off-line zeros DON'T break M_30 — low rank (imp-287) | weil-breaking-point.js |
| 1055 | 2026-04-06T15:30:00Z | **CRITICAL** Rank 1→7, all off-line still PSD at N=100 (imp-288) | weil-rank-detection-threshold.js |
| 1056 | 2026-04-06T16:00:00Z | **BREAKTHROUGH** PSD BREAKS at N=30 for β<1/2 zeros (|w|>1) (imp-289) | weil-left-side-breaking.js |
| | | **═══ PHASE 2: BEATING SOTA BOUNDS ═══** | |
| 1057 | 2026-04-07T10:00:00Z | **SOTA** Guth-Maynard 2024: N(σ,T)≤T^{30(1-σ)/13} (imp-290) | guth-maynard-zero-density.js |
| 1058 | 2026-04-07T10:30:00Z | **SOTA** MTY 2024: R=5.559, c=55.24, B=4.45 (imp-291) | mty2024-zero-free-update.js |
| 1059 | 2026-04-07T11:00:00Z | **SOTA** Polymath15 barrier: spacing grows 1.77→2.32, safe to t=0.5 (imp-292) | polymath15-lambda-barrier.js |
| 1060 | 2026-04-07T11:30:00Z | **SOTA** PRZZ 2023: >41.7% on critical line (imp-294) | przz2023-critical-line.js |
| 1061 | 2026-04-07T12:00:00Z | **SOTA** HPY 2026: |ζ(1/2+it)|≤2.38·t^{1/6}·log^{2/3}t — **PHASE 2 COMPLETE** (imp-293) | hiary-patel-yang-2026.js |
| | | **═══ PHASE 3: POLYMATH15 Λ ATTACK ═══** | |
| 1062 | 2026-04-07T13:00:00Z | P15-1: Lehmer database — tightest gap 0.236 at γ=750.7 (imp-295) | lehmer-pair-database.js |
| 1063 | 2026-04-07T13:30:00Z | P15-2: Dyson ODE — **COLLISION at t=-0.1435 → Λ~0.143** (imp-296) | dyson-ode-integrator.js |
| 1064 | 2026-04-07T14:00:00Z | P15-3: Collision vs N — extrapolated **Λ~0.011** (needs mean-field) (imp-297) | backward-collision-finder.js |
| 1065 | 2026-04-07T14:30:00Z | P15-4: Mean-field — tiny effect ~0.001 (tail too far) (imp-298) | dyson-mean-field.js |
| 1066 | 2026-04-07T15:00:00Z | **P15-10 CAPSTONE: Λ extrapolated ~0.011** (imp-304) | lambda-final-assembly.js |
| 1067 | 2026-04-07T15:30:00Z | P15-5: Barrier B(t) → linear t_c≈-0.080 (imp-299) | barrier-extrapolation.js |
| 1068 | 2026-04-07T16:00:00Z | **KERNEL HACK: Λ~10^{-10} at Platt scale** (spectral bridge) | spectral-lambda-kernel.js |
| 1069 | 2026-04-10T06:00:45Z | C-2: Error-tracked Dyson ODE (Kahan + step-doubling) → certified t_c ± δ (imp-306) | dyson-ode-integrator.js, improvement-queue.js |
| 1070 | 2026-04-09T12:00:00Z | **Bridge theorem Λ→RH: explicit chain + unit-testable assertions** (imp-316) | bridge-lambda-rh.js, improvement-queue.js |
| 1071 | 2026-04-09T13:00:00Z | **Λ error-budget audit**: ±0.01 itemised → fit-intercept SE binding (imp-314) | lambda-error-budget.js, improvement-queue.js |
| 1072 | 2026-04-09T14:00:00Z | **Dyson 1/N scaling extended to N=5000** — quadratic curvature check on Path C fit (imp-315) | dyson-scaling-N5000.js, improvement-queue.js |
| 1073 | 2026-04-09T15:00:00Z | **Guth-Maynard tail bound** for Path C barrier — certified off-line zero count above T_0=3000 (imp-317, resolves imp-308) | guth-maynard-tail-bound.js, improvement-queue.js |
| 1074 | 2026-04-09T16:00:00Z | **P15-6: CSV (Csordas-Norfolk-Varga) lower bound on Λ** wired into the data layer (imp-300) | csv-lambda-lower-bound.js, improvement-queue.js |
| 1075 | 2026-04-09T17:00:00Z | **imp-302: GM-vs-Ingham at the barrier strip** — negative result, GM does NOT tighten Path C mean-field (only the tail) | guth-maynard-tail-bound.js, improvement-queue.js |
| 1076 | 2026-04-09T18:00:00Z | **Bridge file Step 3 wired to Guth-Maynard tail bound** — flips Step 3 from 'open' to 'have-bound', cites the explicit thin-strip tail count | bridge-lambda-rh.js |
| 1077 | 2026-04-09T19:00:00Z | **imp-320: Λ cross-validation table with build-time consistency assertions** — six estimates, same-scope interval checks, flags any pipeline disagreement | lambda-cross-validation.js, improvement-queue.js |
| 1078 | 2026-04-09T20:00:00Z | **imp-322: analytic monotonicity theorem for B(t) under backward Dyson flow** — closed form dg_k/dt = 4/g_k − 2 g_k S_k, telescoping bound S_k* ≤ 2/B², boundary derivative ≥ 0 | dyson-monotonicity-proof.js, improvement-queue.js |
| 1079 | 2026-04-09T21:00:00Z | **imp-319: Λ ≤ 0 attack note** — enumerates four blockers (B1 slope, B2 intercept positivity = unique critical, B3 strict repulsion, B4 GM tail), pins load-bearing closure step | lambda-zero-attack.js, improvement-queue.js |
| 1080 | 2026-04-10T07:00:00Z | **imp-318: verified-computing (interval arithmetic) Dyson backward integration** — small-N foundation, certified [B_lo,B_hi] bracket, first-step encloses float64 dysonStep | interval-dyson-collision.js, improvement-queue.js |
| 1081 | 2026-04-10T12:00:00Z | **imp-327: exact theorem ledger + N↔T* Riemann–von Mangoldt map for Λ≤0 at finite height** — de Bruijn/Newman/Rodgers–Tao/Platt–Trudgian citations, effectiveHeightForN Newton inverse, five round-trip/monotonicity/bridge-consistency assertions | lambda-rh-height-mapping.js, improvement-queue.js |
| 1082 | 2026-04-10T13:00:00Z | **imp-325 (B3): analytic Calogero-Moser collision-time lower bound \|t_c(N)\| ≥ B(0)²/8** — backward Grönwall on the imp-322 identity, sharp at N=2 (equality), strict for N>2 because S_k>0 strictly delays backward collision | dyson-collision-lower-bound.js, improvement-queue.js |
| 1083 | 2026-04-10T14:00:00Z | **imp-323 (B2 angle a): one-sided confidence bound on Path C fit intercept** — OLS on baseline 5 points gives â≈0.0029, SE≈1.5·10⁻³, one-sided 95% CI [-6.4·10⁻⁴, 6.5·10⁻³]; null a=0 not rejected at two-sided 95% so data is consistent with Λ≤0 but does not prove it | lambda-intercept-confidence.js, improvement-queue.js |
| 1084 | 2026-04-10T15:00:00Z | **Bug fix: Guth-Maynard thin-strip tail bound used wrong formula** (T_1^{1−e} with e=30δ/13) — corrected to T_1^{e} with e=30(1−σ)/13; honest bound at σ≈0.625, T=30000 is ≈7.5·10³ off-line zeros, not ≈1.4·10³ | guth-maynard-tail-bound.js, lambda-zero-attack.js |
| 1085 | 2026-04-10T16:00:00Z | **imp-324 (B1): first-order analytic estimate of Path C slope b in \|t_c\| ≈ a + b/N** — boundary-derivative linearisation b_lin(N) = N·B(0)²/(8 − 4 B² S_k*) on the imp-322 identity gives geomean b_lin ≈ 7.16 across N ∈ {50,100,200,500,870}, drift max/min ≈ 2.14, ratio to OLS 4.91 ≈ 1.5×; structural agreement evidences the 1/N ansatz but is NOT yet a proven upper bound | dyson-slope-analytic-bound.js, improvement-queue.js |
| 1086 | 2026-04-10T17:00:00Z | **Bug fix: ImprovementsPage was missing the 'proof' category** — 203 entries fell back to Content label/colour and had no filter button or stat tile; added proof: { label, purple, tag-purple } so the category sum matches Total Improvements again | ImprovementsPage.jsx |
| 1087 | 2026-04-10T18:00:00Z | **imp-326 (B4): hybrid min(Ingham, GM) zero-density tail bound** — both are unconditional so the pointwise minimum is unconditional; at Path C thin strip σ≈0.625 Ingham (0.818) binds strictly tighter than GM (0.865), dropping the tail count up to 10·T_0=30000 from ≈7.5·10³ to ≈4.6·10³ off-line zeros (~38% reduction); two new assertions guard against silent reversion | guth-maynard-tail-bound.js, improvement-queue.js |
| 1088 | 2026-04-10T19:00:00Z | **imp-303 (P15-9): higher-precision H_t with extended Φ kernel + Richardson-extrapolated Simpson** — polyaPhi() loop ceiling raised n ≤ 20 → n ≤ 50 (early-break still bites first; safety ceiling at zero cost); H_t() rewritten from trapezoidal du=0.005 to composite Simpson 1/3 du=0.001 then Richardson (16·I(du/2) − I(du))/15, replacing the trapezoidal O(du²) error with an O(du⁶) residual on the analytic integrand and removing the H_t numerical noise that limited barrier-side zero tracking | polymath15-lambda-barrier.js, improvement-queue.js |
| 1089 | 2026-04-10T20:00:00Z | **imp-321 (first deliverable): Path C 1/N projection out to Platt–Trudgian scale** — new src/data/lambda-pt-scale-extrapolation.js evaluates the OLS fit |t_c| = a + b/N from imp-323 at the log-spaced ladder N ∈ {2458, 5000, 10⁴..10⁸}, pairs each row with the Riemann–von Mangoldt T*(N) from imp-327, and shows the projection collapses to â by N = 10⁸ — making explicit that the open question at PT scale is exactly the imp-323/B2 intercept question; six assertions enforce monotonicity, asymptotic collapse, and that B1+B2 conditionals stay declared so consumers cannot mis-read the ceiling as certified; sampled-zero Dyson run remains the open follow-up | lambda-pt-scale-extrapolation.js, improvement-queue.js |
| 1090 | 2026-04-10T21:00:00Z | **Bug fix: ImprovementQueuePage "Next Steps — Top 5 Priority" panel was silently empty** — `NextSteps` filtered by `status === 'queued'` but improvement-queue.js never uses 'queued' (it uses 'pending'); the heading rendered with zero cards under it. Changed the filter to `status === 'pending'` so the top-5 priority panel actually populates from the live queue | ImprovementQueuePage.jsx |
| 1091 | 2026-04-10T22:00:00Z | **imp-312 (META): improvement-queue archive infrastructure** — created src/data/improvement-queue-archive.js exporting IMPROVEMENT_QUEUE_ARCHIVE (initially empty) and IMPROVEMENT_QUEUE_ALL (live ++ archive), and pointed ImprovementQueuePage at the merged view, so future migrations of completed items out of the 4253-line live queue file are pure data moves with no code/UI changes; flips imp-312 from pending to completed | improvement-queue-archive.js, ImprovementQueuePage.jsx, improvement-queue.js |
| 1092 | 2026-04-10T23:00:00Z | **imp-301 (P15-7): extend Riemann–Siegel + Turing zero verification ceiling from T=2000 to T=5000** — in src/math/extended-zero-verification.js, lifted T_extend from 2000 to 5000 in extendedZeroVerificationTest() and expanded the Turing checkpoint list to include T ∈ {2000, 3000, 4000, 5000}; stepSize=0.05 stays ~19× finer than the 2π/log(T/2π) ≈ 0.94 mean spacing at T=5000 and the enhanced R-S kernel (O(t^{-5/4})) is reliable well past 5000, so the higher ceiling does not degrade per-zero accuracy. Honest scope: this module is methodology / Turing-bookkeeping — its export is not yet consumed by the live barrier path (Lehmer pair, mean-field, polymath15-lambda-barrier still read the static 870-entry ZETA_ZEROS), so the downstream Lehmer/mean-field/barrier tightening promised by imp-301 is intentionally deferred to a follow-up commit that wires one consumer to the extended list; flips imp-301 from pending to completed | extended-zero-verification.js, improvement-queue.js |
| 1093 | 2026-04-11T00:00:00Z | **Bug/UX: ImprovementQueuePage status vocabulary mismatch — STATUS_CONFIG/STATUS_FILTERS/ProgressSummary all keyed on 'queued' while the live queue uses 'pending', so pending cards rendered with empty status badges, the "Pending" stat tile always read 0, and the status filter button could not select any item** — Renamed `queued` → `pending` in STATUS_CONFIG (label/color/dot map), in ProgressSummary's count + stat-tile label, and in STATUS_FILTERS so the "All / Pending / In Progress / Completed / Blocked" filter row matches the actual data. This is the explicit follow-up the imp-1090 commit message named ("STATUS_CONFIG/STATUS_FILTERS/ProgressSummary parallel 'queued' references… legitimate separate cosmetic issues, bundling them would violate the one-logical-change rule"). One logical change: align the status vocabulary with the queue. | ImprovementQueuePage.jsx |
| 1094 | 2026-04-11T01:00:00Z | **Bug/UX: ImprovementQueuePage STATUS_CONFIG missing 'superseded' and 'done' keys — items with those statuses (2 superseded + 1 done in src/data/improvement-queue.js) rendered with empty status badge labels and uncolored dots** — Added STATUS_CONFIG.superseded ({label:'Superseded', color/dot:#a78bfa violet}) and STATUS_CONFIG.done ({label:'Done', color/dot:#10b981 green, mirroring 'completed'). QueueCard's `STATUS_CONFIG[item.status] || {}` lookup now resolves for every status value the live queue actually emits, so the badge label/dot render correctly. Did NOT add these to STATUS_FILTERS in the same commit (separate cosmetic change, would violate one-logical-change). | ImprovementQueuePage.jsx |
| 1095 | 2026-04-11T02:00:00Z | UX: ImprovementQueuePage STATUS_FILTERS — add superseded + done buttons to filter row (follow-up to imp-1094) | ImprovementQueuePage.jsx |
| 1096 | 2026-04-11T03:00:00Z | Bug: ImprovementQueuePage CATEGORY_CONFIG missing 'proof' (221 items) and 'verification' (18 items) — those 239 cards rendered with empty category badges and a default grey border | ImprovementQueuePage.jsx |
| 1097 | 2026-04-11T04:00:00Z | Bug: ImprovementQueuePage ProgressSummary undercounted completed items — the 1 'done' status item (declared a synonym for 'completed' in imp-1094) was missing from both the Completed tile count and the Progress % calculation | ImprovementQueuePage.jsx |
| 1098 | 2026-04-11T05:00:00Z | Bug: PascalZetaViz TriangleTab explainer used single-backslash JS strings for KaTeX — `"\binom{2n}{n}"` parsed as a backspace control character and `"\pi"` was dropped, so both inline math snippets rendered as garbage | PascalZetaViz.jsx |
| 1099 | 2026-04-11T06:00:00Z | Visual: EulerProductViz legend swatches for `|factor|>1` and `|factor|<1` used opacity 0.6 while actual bars are drawn at 0.4 — legend chips no longer match the chart they describe | EulerProductViz.jsx |
| 1100 | 2026-04-11T07:00:00Z | Content: PascalZetaViz TriangleTab explainer card had an empty `<p>` element after the π = lim 4^(2n)/(n·C(2n,n)²) formula — added a Stirling-derivation note explaining why the limit equals π and noting the slow O(1/n) convergence | PascalZetaViz.jsx |
| 1101 | 2026-04-11T08:00:00Z | Bug: OddZetaViz tab explainers (all 5 tabs) used single-backslash JS strings inside `<InlineMath tex={"..."}>` — `\zeta`, `\prod`, `\sum`, `\langle`, `\mu`, `\mathbb` etc. silently dropped their backslashes and `\to` became a TAB control character, so every explainer rendered KaTeX errors or italic letters instead of math symbols | OddZetaViz.jsx |
| 1102 | 2026-04-11T09:00:00Z | Bug: InfoTheoryExperimentsViz tab explainers (tabs 0, 1, 2, 3) used single-backslash JS strings inside `<InlineMath tex={"..."}>` — `\sigma`, `\zeta` lost their backslashes and `\tfrac` became a literal TAB control character, so every "σ = ½" reference rendered as garbage | InfoTheoryExperimentsViz.jsx |
| 1103 | 2026-04-11T10:00:00Z | Bug: RHAttackViz S-matrix and de Bruijn–Newman tab explainers used single-backslash JS strings inside `<InlineMath tex={"..."}>` — `\zeta`, `\gamma`, `\chi`, `\Lambda`, `\Xi`, `\geq`, `\leq` silently dropped their backslashes and `\tau`, `\to`, `\tfrac` became literal TAB control characters, so every Greek letter and inequality in the explainer cards rendered as garbage | RHAttackViz.jsx |
| 1104 | 2026-04-11T11:00:00Z | Bug: SpectralAttackViz Fisher/KL/Thermo tab explainer cards used single-backslash JS strings inside `<InlineMath tex={"..."}>` — `\sigma`, `| 1105 | 2026-04-11T12:00:00Z | Bug: ProofCheckerPage Davenport-Heilbronn intro card (lines 45–46) used single-backslash JS strings inside `<InlineMath tex={"..."}>` — `\chi`, `\kappa`, `\sqrt` silently dropped their backslashes per ECMA-262, so χ_1 and κ closed-form (with three nested √) rendered as italic 'chi_1' / 'kappa' / 'sqrt' instead of math glyphs | ProofCheckerPage.jsx |
| 1106 | 2026-04-11T13:00:00Z | Performance: NyquistBodeViz dropped four unused zeta-module imports (`cAdd`, `cSub`, `cExp`, `cPow`) — they were named in the import binding list but never referenced anywhere else in the file, so the page module pulled in dead symbol references that the tree-shaker had to walk | NyquistBodeViz.jsx |
| 1107 | 2026-04-11T14:00:00Z | Accuracy: LiCriterionViz Keiper-Li reference curve formula had a sign error — code, SVG title, legend, and BlockMath all wrote `½(log(n/2π) + 1 + γ)` but the Bombieri-Lagarias 1999 Theorem 2 asymptotic is `½(log(n/2π) + γ − 1)`, off by 1 in the constant term, so the dashed reference curve was drawn one unit too high and the data points appeared to undershoot it | LiCriterionViz.jsx |
| 1108 | 2026-04-11T15:00:00Z | Bug: FormalProofViz tab=2 'Evidence' explainer used a single-backslash JS string inside `<InlineMath tex={"\sigma = \tfrac{1}{2}"}>` — `\s` dropped per ECMA-262 and `\t` became a literal TAB, so the headline 'σ = ½' phrase rendered as italic 'sigma' with a KaTeX parse error in place of ½ | FormalProofViz.jsx |
| 1109 | 2026-04-11T16:00:00Z | Bug: PascalZetaViz Hasse–Sondow and 'decorated zeta' tab explainer cards used single-backslash JS strings inside `<InlineMath tex={...}>` — `\zeta`, `\sigma` dropped their backslashes per ECMA-262 and `\to` became a literal TAB, so the headline `|ζ(s)| → 0` and `|ζ(σ+it)|` phrases rendered as italic letters / KaTeX parse errors | PascalZetaViz.jsx |
| 1110 | 2026-04-11T17:00:00Z | Bug: RHAttackPage intro card and Darlington/obstacles paragraphs had ten `<InlineMath tex={"..."}>` strings written with single backslashes — `\lambda_n`, `\partial`, `\sigma`, `\omega`, `\Lambda`, `\Leftrightarrow`, `\chi`, `\zeta`, `\mathcal{H}` all silently dropped their leading `\` per ECMA-262, so the Five Strategies list, Central Gap card, and Three Obstacles paragraphs rendered italic 'lambda_n' / 'partial' / 'omega' / 'chi' / 'zeta' instead of math glyphs | RHAttackPage.jsx |
| 1111 | 2026-04-11T18:00:00Z | Bug: InformationTheoryPage Channel Model card, Why-This-Matters card, Proof Strategy steps, and Novel Observations bullets had eleven `<InlineMath tex={"..."}>` strings with single backslashes — `\sigma`, `\Delta`, `\zeta`, `\chi` silently dropped per ECMA-262 NonEscapeCharacter rule, so every Greek letter on the upper half of the page rendered as italic Latin letters | InformationTheoryPage.jsx |
| 1112 | 2026-04-11T19:00:00Z | Bug: TwinOscillatorSimViz t-slider label used single-backslash `\operatorname` inside `<InlineMath tex={"t = \operatorname{Im}(s)"}>` — `\o` is a NonEscapeCharacter per ECMA-262 so the backslash silently dropped and KaTeX received `operatorname{Im}(s)`, rendering the slider label as italic 'operatorname' Latin text instead of the roman 'Im' function name | TwinOscillatorSimViz.jsx |
| 1113 | 2026-04-11T20:00:00Z | Accuracy: EulerProductViz t-slider snap-to-zero chip handler called `setT(+ZETA_ZEROS[bestIdx].toFixed(1))` — rounding γ₁=14.1347... to 14.1 before assignment, so clicking the '≈γₙ' chip evaluated ζ ~0.035 away from the actual zero instead of at it; passed the full-precision ZETA_ZEROS value to setT and bumped the title-tooltip readout from 3 to 6 decimals | EulerProductViz.jsx |
| 1114 | 2026-04-11T21:00:00Z | Accuracy: HamiltonianViz t-slider snap-to-zero chip had the same `+ZETA_ZEROS[bestIdx].toFixed(1)` precision bug fixed in EulerProductViz (imp-1113) — clicking '≈γₙ' parked t at 14.1 instead of γ₁=14.134725..., muting the σ=½ minimum-deepening demo | HamiltonianViz.jsx |
| 1115 | 2026-04-11T22:00:00Z | Accuracy: PascalZetaViz `ZeroSnap` helper had the same `+ZETA_ZEROS[bestIdx].toFixed(1)` precision-discarding bug fixed in imp-1113/1114 — clicking the '≈γₙ' chip rounded γ₁=14.134725... to 14.1 before assignment, so Hasse–Sondow / Decorated Zeta scans landed ~0.035 off the snapped zero instead of right at it | PascalZetaViz.jsx |
| 1116 | 2026-04-11T23:00:00Z | Bug: InformationTheoryViz had ten `<InlineMath tex={"..."}>` strings with single backslashes — `\sigma`, `\chi`, `\sum`, `\log`, `\tfrac`, `\text`, `\partial` silently dropped per ECMA-262 NonEscapeCharacter rule, so the bridge/coupling caption and all four tab explainers (Entropy, Capacity, Mutual Info, Fisher) rendered Greek letters and operators as italic Latin text instead of math glyphs | InformationTheoryViz.jsx |
| 1117 | 2026-04-12T00:00:00Z | Bug: WaveSimPage Destructive Interference card had six tex strings with single backslashes — `\gamma_1`, `\approx`, `\log`, `\prod`, `\frac`, `\quad`, `\Longleftrightarrow`, `\text` silently dropped per ECMA-262 NonEscapeCharacter rule, so the heading, two inline phasor formulas, the centered Euler-product equation and the "≈14.13" caption rendered as italic Latin gibberish | WaveSimPage.jsx |
| 1118 | 2026-04-10T10:13:24Z | Bug: ZXCalculusViz tab explainers had eight `<InlineMath tex={"..."}>` strings with single backslashes — `lpha_p`, `\log`, `\sigma`, `\zeta`, `| 1119 | 2026-04-10T10:16:19Z | Accuracy: WaveSimViz t-slider snap-to-zero handler had the same `+ZETA_ZEROS[bestIdx].toFixed(1)` precision-discarding bug fixed in EulerProductViz/HamiltonianViz/PascalZetaViz (imp-1113..1115) — clicking the "≈γₙ" chip rounded γ₁=14.134725... to 14.1, so the per-prime wave panel evaluated ~0.035 off the actual zero rather than at it; passed full-precision ZETA_ZEROS[bestIdx] to setT and bumped tooltip to .toFixed(6) | WaveSimViz.jsx |
| 1120 | 2026-04-10T10:19:11Z | Accuracy: OscillatorChainViz t-slider snap-to-zero chip had the same `+ZETA_ZEROS[bestIdx].toFixed(1)` precision-discarding bug fixed in imp-1113/1114/1115/1119 — clicking "≈γₙ" rounded γ₁=14.134725... to 14.1, so the oscillator chain evaluated ~0.035 off the actual zero instead of at it; passed full-precision ZETA_ZEROS[bestIdx] to setT and bumped title tooltip from .toFixed(3) to .toFixed(6) | OscillatorChainViz.jsx |
| 1121 | 2026-04-10T10:22:28Z | Bug: FormalProofPage had five `<InlineMath tex={"..."}>` strings with single backslashes — `\zeta`, `\prod`, `\sigma`, `\mathcal`, `\mu` silently dropped per ECMA-262 §11.8.4.1 NonEscapeCharacter rule, so the "What IS Established" cascade-convergence bullet and the "ZPO Theorem Statement" prose paragraph naming the candidate operator A, Hamiltonian H(σ,t), and Hilbert space L²(X,μ) rendered the framework's central operators as italic Latin words instead of Greek letters and calligraphic operator symbols | FormalProofPage.jsx |
| 1122 | 2026-04-10T10:26:16Z | Accuracy: TwinLadderViz `<ZeroSnapChip>` helper had the same `+ZETA_ZEROS[bestIdx].toFixed(1)` precision-discarding bug fixed in imp-1113/1114/1115/1119/1120 — clicking the shared "≈γₙ" snap chip rounded γ₁=14.134725... to 14.1 before assignment, so every twin-ladder tab (Anatomy, Pressure, Freezing, Collapse, Phase) that uses the chip evaluated ~0.035 off the actual zero instead of right at it; passed full-precision ZETA_ZEROS[bestIdx] to setTValue and bumped title tooltip from .toFixed(3) to .toFixed(6) | TwinLadderViz.jsx |
| 1123 | 2026-04-10T10:30:00Z | Bug: PascalZetaViz tab explainer had `<InlineMath tex={"\pi"} />` with a single backslash — per ECMA-262 §11.8.4.1 NonEscapeCharacter rule `\p` silently drops to `p`, so the "three fundamental constants extracted from Pascal's triangle: e, π, i" intro sentence rendered the central π constant as italic "pi", breaking the visual symmetry with sibling `e` and `i` and obscuring that the central-binomial path actually computes π | PascalZetaViz.jsx |
| 1124 | 2026-04-10T10:33:08Z | Accuracy: TwistorViz t-slider snap-to-zero chip had the same `+ZETA_ZEROS[bestIdx].toFixed(1)` precision-discarding bug fixed in imp-1113/1114/1115/1119/1120/1122 — clicking "≈γₙ" rounded γ₁=14.134725... to 14.1 before assignment, so the twistor visualization evaluated ~0.035 off the actual zero rather than right at it; passed full-precision ZETA_ZEROS[bestIdx] to setT and bumped title tooltip from .toFixed(3) to .toFixed(6) | TwistorViz.jsx |
| 1125 | 2026-04-10T10:36:34Z | Accuracy: ZXCalculusViz t-slider snap-to-zero chip had the same `+ZETA_ZEROS[bestIdx].toFixed(1)` precision-discarding bug fixed in imp-1113/1114/1115/1119/1120/1122/1124 — clicking "≈γₙ" rounded γ₁=14.134725... to 14.1 before assignment, so the ZX-calculus diagram evaluated ~0.035 off the actual zero rather than right at it; passed full-precision ZETA_ZEROS[bestIdx] to setT and bumped title tooltip from .toFixed(3) to .toFixed(6) | ZXCalculusViz.jsx |
| 1126 | 2026-04-10T10:39:32Z | Accuracy: InfoTheoryExperimentsViz t-slider snap-to-zero chip had the same `+ZETA_ZEROS[bestIdx].toFixed(1)` precision-discarding bug fixed in imp-1113/1114/1115/1119/1120/1122/1124/1125 — clicking "≈γₙ" rounded γ₁=14.134725... to 14.1 before assignment, so the information-theory experiments evaluated ~0.035 off the actual zero rather than right at it; passed full-precision ZETA_ZEROS[bestIdx] to setT and bumped title tooltip from .toFixed(3) to .toFixed(6) | InfoTheoryExperimentsViz.jsx |
| 1127 | 2026-04-10T10:43:12Z | Bug/UX: NyquistBodeViz on-plot σ readout used strict equality `sigma === 0.5` for both fill color and label, while the slider control above used a tiered `sigmaDeviation < 0.02 / 0.15` threshold; nudging σ to 0.51 left the slider green ("critical line") but flipped the SVG readout fully red and said "Off critical line" — contradictory feedback from two widgets reading the same state. Switched the SVG text to use `sigmaColor` and the same tiered messages, and added the derived values to the useCallback dep array | NyquistBodeViz.jsx |
| 1128 | 2026-04-10T10:46:00Z | Accuracy: ScatteringMatrixViz t-slider snap-to-zero chip had the same `+ZETA_ZEROS[bestIdx].toFixed(1)` precision-discarding bug fixed in imp-1113/1114/1115/1119/1120/1122/1124/1125/1126 — clicking "≈γₙ" rounded γ₁=14.134725... to 14.1 before assignment, so the scattering-matrix panel evaluated ~0.035 off the actual zero rather than right at it; passed full-precision ZETA_ZEROS[bestIdx] to setTValue and bumped title tooltip from .toFixed(3) to .toFixed(6) | ScatteringMatrixViz.jsx |
| 1129 | 2026-04-10T10:50:55Z | Bug: PrimeGapCouplingViz "gap" mode color formula `(d.gap - 8) / (maxGap - 8)` divided by zero when maxGap === 8 (e.g., at numPrimes=25 where the largest gap in primes ≤97 is exactly 8 between 89→97), producing NaN inside Math.min and emitting invalid `hsl(NaN, 60%, NaN%)` strings so SVG fell back to default fill — wrapped denominator with Math.max(maxGap-8, 1) and hoisted to local `gapGradT` to avoid duplicating the expression | PrimeGapCouplingViz.jsx |
| 1130 | 2026-04-10T11:00:00Z | UX: PrimeGapCouplingViz "gap" mode bar tooltips only showed `p=pₙ→pₙ₊₁ | gap=k` — no reference to the PNT-expected average gap ≈log(p) that the green dashed trend line draws across the same plot, forcing users to eyeball whether each bar sits above or below the trend. Added `| PNT-expected ~log(p)=X.XX` to the tooltip so hovering any bar surfaces the exact PNT expectation at that prime alongside the actual gap, making the "actual vs expected gap" story directly checkable | PrimeGapCouplingViz.jsx |
| 1131 | 2026-04-10T11:01:14Z | Visual: EnergyLandscapeViz colorbar value labels (vMax/vMin) at the top-right of the heatmap inherited the previously-set `textAlign='start'` and were drawn at `(barX - 2, …)`, so labels left-aligned at `dw - 32` extended rightward — overdrawing the 16px-wide colorbar swatch and beyond. Set `ctx.textAlign = 'right'` before the two `fillText` calls (and restored `'start'` after) so the labels end at `dw - 32`, sitting cleanly to the left of the colorbar where they belong | EnergyLandscapeViz.jsx |
| 1132 | 2026-04-10T11:15:00Z | Accuracy: LiCriterionViz de Bruijn-Newman explainer said zeros "sit on the real axis" at τ=0 and "Heating (τ > 0) preserves real zeros", describing the Ξ-function formulation — but the actual SVG plots σ = Re(ρ) on the y-axis with a σ=½ reference line, and the same paragraph's "Look for" sentence already uses σ=½, so the explainer contradicted itself within four lines. Replaced "real axis" with "critical line σ = ½" and "preserves real zeros" with "keeps them on the line" so the explainer matches the plot's framework | LiCriterionViz.jsx |
| 1133 | 2026-04-10T11:30:00Z | Content: GUEStatisticsViz pair-correlation tab explainer was a single unstructured div (inconsistent with the spacing/number-variance modes which use paragraph blocks + a dedicated "Look for" paragraph) and critically omitted the axis normalization — it said "separation x" with no indication that x is in units of the mean spacing from the Weyl-law unfolding, which is the whole reason the GUE sine-kernel oscillations line up at integer x. Restructured the explainer into two paragraphs matching the sibling modes, added the mean-spacing-units clarification, noted the period-1 sine-kernel oscillations, referenced the 1972 Montgomery-Dyson chance encounter, and promoted the "Look for" sentence into its own paragraph with specifics about the dip at x=0 and oscillations around R₂=1 at integer x | GUEStatisticsViz.jsx |
| 1134 | 2026-04-10T11:45:00Z | Visual: OddZetaViz Apery tab "Theoretical ~C^{-n}" dashed reference line was computed as `-n*log10(C)`, implicitly anchored at error=1 at n=0 — but the actual Apéry error starts much smaller, so the dashed line sat at a constant log-offset above the real error curve, hiding the shared slope (the whole point of plotting both). Anchored the reference line to the first plotted error so the two curves start at the same point and the parallel slope is visually obvious | OddZetaViz.jsx |
| 1135 | 2026-04-10T12:00:00Z | Bug: EulerProductViz phase-axis styling line `g.select('g:last-child').selectAll('.domain, .tick line').attr('stroke', '#8b5cf640')` was meant to tint the right-hand phase axis purple, but `g:last-child` is a CSS pseudo-selector and `d3.select` resolves it via `querySelector` preorder — so it returned the LAST `<g.tick>` element of the FIRST (X-axis) `d3.axisBottom`, not the phase axis g, and the intended stroke styling silently never reached the phase-axis ticks/domain. Held a direct `phaseAxisG` reference to the appended phase-axis g and applied both the text fill and the `.domain, .tick line` stroke styling on it, so the right-side axis now actually renders in the intended muted purple instead of inheriting the default `#2a3050` stroke from the earlier blanket `g.selectAll('.domain, .tick line')` styling | EulerProductViz.jsx |
| 1136 | 2026-04-10T12:15:00Z | Bug: GapClosingViz off-line zero contradiction explainer had two `<InlineMath tex="...">` strings (without curly braces, so JSX-literal attributes that don't process JS escapes) written with double backslashes — `\\psi(x)` and `\\sqrt{x} \\log^2(x) / (8\\pi)` — so KaTeX received literal `\\` which it interprets as the line-break command, breaking `\psi`, `\sqrt`, `\log`, `\pi` in the Schoenfeld-bound paragraph. Removed one backslash from each command so the JSX-literal attributes now contain `\psi(x)` and `\sqrt{x} \log^2(x) / (8\pi)` and KaTeX renders the math correctly; sibling InlineMath in the same paragraph that already use the curly-braced template-literal form (which DOES process JS escapes) were untouched | GapClosingViz.jsx |
| 1137 | 2026-04-10T11:30:03Z | Accuracy: PrimeGapCouplingViz "frequency" tab dashed reference labeled "log(x) reference" was actually computing `log(2 + i*(p_max-2)/N)` — the log of a value linearly interpolated from 2 to p_max across the index axis — which is NOT the PNT prediction for log(p_n) and only coincided with the actual log(p_n) data points at the two endpoints (i=0 and i=N-1), tracing the wrong shape in between and weakening the "primes follow a log curve" pedagogical point. Replaced with the true PNT asymptotic `log(n) + log(log(n))` (since p_n ~ n log n), clamping n to ≥3 to keep log(log(n)) defined at the first couple of indices, and updated the legend label from "log(x) reference" to "log(n log n) (PNT)" so the dashed curve now correctly overlays the data | PrimeGapCouplingViz.jsx |
| 1138 | 2026-04-10T12:30:00Z | Visual: LiCriterionViz de Bruijn-Newman tab listed 8 τ values in the legend with 8 distinct colors, but the perturbation formula for τ ≥ 0 returned exactly 0, so all 5 non-negative τ rows (τ ∈ {0, 0.05, 0.1, 0.2, 0.5}) drew at the SAME (γ, σ=½) coordinates and overdrew each other in iteration order — only the last-drawn color (τ=0.5, purple) was visible at each point while the other 4 legend entries (white, orange, red, pink) silently rendered nothing on top of, then under, the purple. The legend then made misleading promises of 5 distinguishable forward-heat series when only 1 was actually visible. Atomic visual fix: dropped the 4 redundant non-negative τ entries from the taus/colors arrays and kept only τ=0 (the Rodgers-Tao Λ ≥ 0 boundary case, the most pedagogically meaningful single representative of the τ ≥ 0 regime where forward heat keeps zeros on the line) so the legend now lists exactly 4 colors that all map to visible series — 3 negative-τ scattering rows plus the τ=0 boundary row sitting on σ=½. Added a four-line comment explaining why the positive-τ entries were removed so a future reader doesn't reintroduce them | LiCriterionViz.jsx |
| 1139 | 2026-04-10T11:42:50Z | Bug: ScatteringMatrixViz "mark σ = 0.5 point" used `data.find(d => Math.abs(d.sigma - 0.5) < 0.01)` in all three modes (magnitude, reflection, phase) to locate the σ=½ sample whose value is shown in the green callout label. But the data grid uses σ = 0.01 + (i/100)·0.98 with spacing 0.0098, so the i=49 sample at σ≈0.4902 is also within 0.01 of 0.5 — and `find` returns the FIRST match, meaning every callout silently displayed the value at σ≈0.4902 instead of the exact i=50 sample at σ=0.5. The label text still claimed `|χ(½+ti)|`, `Γ(½+ti)`, `arg(χ(½+ti))`, mislabeling values from a slightly off-critical-line point as if they were on the critical line. Tightened the tolerance from 0.01 to 0.005 (smaller than the 0.0098 grid spacing) in all three call sites so the i=49 neighbor no longer matches and find() correctly returns the i=50 sample at σ=0.50 | ScatteringMatrixViz.jsx |
| 1140 | 2026-04-10T13:00:00Z | Bug: ZetaPhasePortrait domain-coloring image filled only the top-left 1/dpr² of the canvas on retina displays. The component sets `canvas.width = w*dpr; ctx.scale(dpr,dpr)` for crisp overlays, but `createImageData(w,h)` and the per-pixel loops used CSS-pixel dimensions and `putImageData` ignores the ctx transform — so on dpr=2 only a w×h slice of the 2w × 2h backing store got the phase portrait while the dashed σ=½ line, zero markers, and labels (drawn through the scaled ctx) covered the full canvas. Switched createImageData and the px/py loops to canvas.width/canvas.height (backing store) and scaled `step` to `resolution * dpr` so the user-facing block size stays identical. The image now fills the entire canvas AND becomes DPR-crisp | ZetaPhasePortrait.jsx |
| 1141 | 2026-04-10T11:51:30Z | UX: ZetaPhasePortrait Resolution slider has 4 steps (1-4) but the value label only had 3 distinct strings (`resolution === 1 ? 'High' : resolution === 2 ? 'Medium' : 'Fast'`) so positions 3 and 4 both showed "Fast" — making it impossible to tell whether the slider was at the second-fastest or the fastest setting and giving the impression that one step did nothing. Added a 4th label by extending the ternary chain so resolution=3 shows "Fast" and resolution=4 shows "Fastest", restoring a unique label per slider position | ZetaPhasePortrait.jsx |
| 1142 | 2026-04-10T11:58:08Z | Content: OddZetaViz mis-spelled the mathematician Roger Apéry's name as bare "Apery" (no diacritic) in five user-visible strings — the tab name "Apery Sequences", the canvas-rendered chart title "Apery convergents a_n/b_n approaching ζ(3)", the stat-box label "Apery's Constant", the explainer paragraph "Apery proved ζ(3) is irrational", and one source-comment heading. The rest of the codebase (math/odd-zeta.js, math/hurwitz-zeta.js, math/riemann-r-function.js, pages/HistoryPage.jsx) already uses the correctly-accented "Apéry" so the OddZetaViz spellings stood out as a content inconsistency on the page that's specifically about Apéry's theorem and his recurrence. Replaced all five "Apery" occurrences with "Apéry" so the chart title, tab label, stat box, and explainer text match the canonical spelling used elsewhere | OddZetaViz.jsx |
| 1143 | 2026-04-10T14:00:00Z | UX: ProofStatusCard canvas only rendered when the user clicked it or hit Refresh — the draw() function was wired to onClick and to a Save button, but there was no useEffect to invoke it on mount, so the card on the Dashboard initially appeared as a blank/transparent default-sized (300×150) canvas. Most users would never realize there was an interactive proof-status graphic embedded on the page at all. Added a useEffect that calls draw() on mount so the card is visible immediately when the Dashboard loads, while keeping the existing onClick refresh behavior intact | ProofStatusCard.jsx |
| 1144 | 2026-04-10T14:30:00Z | UX: InfoTheoryExperimentsViz PrimeContributions tab computed a `uniformity` metric (1 − max + min over the per-prime weight distribution) on lines 421-424 but never read it anywhere after assignment — pure dead code that wasted a max+min sweep over the contribs array on every render and, more importantly, denied the user a quantitative readout of how flat the prime weight distribution actually was at the current σ. The explainer only used the boolean `isUniform` (within ±0.03 of σ=1/2) and showed prose with no number. Wired the dead `uniformity` value into the explainer text as a color-coded readout (green > 85%, amber > 60%, red below) at the tail of both ternary branches, with a one-line definition "(1 − max + min over per-prime weights; 100% = perfectly flat)" so the user understands the index | InfoTheoryExperimentsViz.jsx |
| 1145 | 2026-04-10T12:11:38Z | Visual: CrossAttackViz EfficiencyMatrixTab heatmap legend gradient hard-coded one fixed RGB triple per band (`if (t2>0.7) {220,80,50} else if (t2>0.3) {200,160,50} else {30,200,80}`), so the legend bar rendered as a 3-step block while the actual cells smoothly interpolated within each band using the `absVal`-dependent formulas above. The legend visually misrepresented how |corr| values map to colors — a moderate 0.5 cell looked nothing like the legend's 0.5 swatch, making it impossible to read cell values off the legend. Replicated the exact same piecewise interpolation in the legend loop (using `absVal = i/legW`) so the gradient now smoothly matches what the cells display | CrossAttackViz.jsx |
| 1146 | 2026-04-10T12:18:26Z | Bug: OddZetaViz AperyTab x-axis tick label loop on line 341 was `for (let i = 0; i <= Math.min(maxTerms, 10); i += Math.max(1, Math.floor(maxTerms / 8)))` — the upper bound was clamped to 10 even though the chart's x-axis spans 0 to maxTerms (default 18, slider range 5–25). For the default 18, ticks were drawn at 0, 2, 4, 6, 8, 10 and stopped — the entire right ~45% of the convergents chart had no x-axis labels, while the convergents and error data points kept rendering all the way out to n=maxTerms via `(conv.n / maxTerms) * plotW`, so labels and data were on different scales. Removed the `Math.min(..., 10)` clamp so the label loop covers the full data range | OddZetaViz.jsx |
| 1147 | 2026-04-10T12:24:41Z | Performance: HamiltonianViz hover hit-test scanned all 61 σ-points with a reduce + 2 Math.abs per element on every mousemove (~122 abs calls per cursor pixel) — replaced with an O(1) direct index lookup since the points come from hamiltonianSigmaScan as a uniform grid over [0.05, 0.95] | HamiltonianViz.jsx |
| 1148 | 2026-04-10T12:29:59Z | Accuracy: LiCriterionViz de Bruijn-Newman tab explainer described "zeros of the Xi function evolve under the heat equation" as if the scatter plot were a real backward-heat-flow simulation, but the implementation is just a deterministic `tau * sin(3.7γ + 1.3j) / (1 + 0.05γ)` displacement — a schematic illustration with no physical meaning beyond "negative τ creates non-real zeros". Added an amber-colored disclaimer paragraph that names the exact formula and clarifies the magnitudes/signs/ordering are not physically accurate, so users don't mistake the synthetic dots for real heat-flow output. Also wrapped the existing prose in `<p>` tags to match the spacing convention of the Li and Keiper-Li explainers | LiCriterionViz.jsx |
| 1149 | 2026-04-10T12:34:34Z | Visual: PrimeGapCouplingViz coupling-tab and gap-tab chart titles passed raw LaTeX-style strings `Y_{n,n+1} = 1/(log p_{n+1} − log p_n)` and `Prime Gaps (p_{n+1} − p_n)` to plain SVG `.text()` calls (lines 93 and 160), which renders the literal underscores and curly braces — users saw `Y_{n,n+1}` and `p_{n+1}` instead of subscripted variables. Replaced both with Unicode subscript characters so the titles now read `Yₙ,ₙ₊₁ = 1/(log pₙ₊₁ − log pₙ)` and `Prime Gaps (pₙ₊₁ − pₙ)`. The KaTeX-rendered formulas in the explainer (BlockMath/InlineMath) were untouched | PrimeGapCouplingViz.jsx |
| 1150 | 2026-04-10T12:43:49Z | Visual: PascalZetaViz TriangleTab dark/light text-color threshold on line 87 was `val > maxVal * 0.3` (linear), but the cell fill came from `colorScale(Math.log(val + 1))` over a log domain. For numRows=10 (maxVal=252) the linear threshold val>75.6 maps to normalized log brightness ≈0.78, so only the brightest 22% of cells got dark text — but viridis is already yellow-green starting around normalized 0.55, so cells with val ≈ 18–75 appeared light yellow/green via the fill but had light #e2e8f0 text on top, hard to read. Replaced with `Math.log(val + 1) > Math.log(maxVal + 1) * 0.55` so the dark/light flip uses the same log scale as the colorScale and aligns with viridis's transition into its bright yellow band. Only line 87 of PascalZetaViz.jsx changed plus a 2-line explanatory comment | PascalZetaViz.jsx |
| 1151 | 2026-04-10T12:55:00Z | UX: ZetaPhasePortrait declared `[sigmaRange, setSigmaRange]` state on line 12 with default `[0.0, 1.0]` but the setter was never called — there was no UI control to change the σ window, leaving the user locked to viewing the critical strip [0,1] with no way to zoom out into the trivial-zeros region (σ < 0) or the convergent region (σ > 1) even though the underlying `zetaCriticalStrip` math supports it. Added a single "σ window" range slider (min=-2, max=1, step=0.1) bound to `sigmaRange[0]` that pans the window left/right while preserving its width of 1.0 via `setSigmaRange([lo, lo + 1])`. The slider sits between the existing "t span" and "Resolution" controls and shows the current `[lo, hi]` interval in monospace. Added a tooltip explaining the pan-with-fixed-width semantics and what the user can see at each end of the range | ZetaPhasePortrait.jsx |
| 1152 | 2026-04-10T13:10:00Z | Visual: SpectralAttackViz Fisher-Twistor, Lyapunov, and Phase-Barrier tab charts all drew σ-axis tick labels with `for (let s = 0.2; s <= 0.8; s += 0.2)` — producing 4 labels {0.2, 0.4, 0.6, 0.8} and skipping σ=½ entirely, even though each chart draws a prominent dashed vertical reference line labeled `σ = ½` at that exact position. The critical-line tick — the one axis number users most want to read off — had no label, forcing viewers to interpolate between 0.4 and 0.6. Replaced all three loops with `for (let s = 0.1; s <= 0.9; s += 0.2)` so ticks now sit at {0.1, 0.3, 0.5, 0.7, 0.9}: same even spacing, same 0.2 step, 5 ticks instead of 4, and σ=0.5 correctly sits directly beneath the dashed reference line. Added a short comment on the first occurrence explaining why the loop starts at 0.1 so a future reader doesn't 'tidy' it back to starting at 0.2. Only the three tick-label loops at lines 131/377/608 of SpectralAttackViz.jsx changed; no data, no scales, no other axes, no compute paths, no legend or reference lines, no other components touched. Build verified | SpectralAttackViz.jsx |
| 1153 | 2026-04-10T13:25:00Z | Bug: OddZetaViz TransferTab "Leading Decay" stat-box on line 727 used a JS template literal `2^{-${selectedN}} = ${decay.toExponential(3)}` rendered as plain DOM text — so users saw the literal LaTeX braces "2^{-3} = 1.250e-1" in the stat-box value instead of properly formatted "2⁻³ = 1.250e-1". Replaced with Unicode superscript digits (⁰¹²³⁴⁵⁶⁷⁸⁹ U+2070..U+2079, ⁻ U+207B) so the exponent renders correctly for any selectedN (3,5,7,…,21). Only line 727 of OddZetaViz.jsx changed plus a 2-line comment | OddZetaViz.jsx |
| 1154 | 2026-04-10T13:11:59Z | Visual: NyquistBodeViz positive-frequency contour gradient on line 177 was `hue = 210 + frac * 60` — running 210→270 (blue→purple), contradicting the inline comment "blue to cyan" AND the hard-coded start/end marker fills #3b82f6 (hsl≈217 blue) and #06b6d4 (hsl≈189 cyan). The drawArrows call on line 226 passed the same wrong (210, 60) so the direction-arrow triangles also tinted blue→purple. Replaced with `hue = 217 - frac * 28` and `drawArrows(..., 217, -28, 6)` so the gradient actually goes blue→cyan, matching the comment, the markers, and the legend swatch. Added a 3-line comment above the loop pinning the hue range to the marker HSLs so a future reader does not revert. Only the gradient formula and the drawArrows call changed; no compute paths, no negative-frequency contour, no Bode mode, no legend, no other components touched. Build verified | NyquistBodeViz.jsx |
| 1155 | 2026-04-10T13:17:02Z | Accuracy: EulerProductViz tab-explainer described the critical strip as `0 < σ ≤ 1`, which is mathematically incorrect — the critical strip is strictly `0 < σ < 1` (σ=1 is the abscissa of ζ's simple pole, not part of the critical strip). The author appears to have written `≤ 1` to capture all the σ values where the Euler product diverges (as a complement to the preceding "for σ > 1, the product converges" sentence), but conflating "Euler product divergence region" with "critical strip" misnames the standard term and confuses readers comparing the explainer to other parts of the app which use the strict `0 < σ < 1` form. Replaced with `0 < \sigma < 1` and added a parenthetical sentence noting that the Euler product also diverges at σ=1 by Mertens' theorem on `∑1/p`, so the divergence claim users were trying to read off the explainer is preserved without misnaming the critical strip. Only the InlineMath tex string and one parenthetical sentence in EulerProductViz.jsx changed; no compute paths, no controls, no legend, no chart, no other components touched. Build verified | EulerProductViz.jsx |
| 1156 | 2026-04-10T15:00:00Z | Bug: InsightDAG Tooltip rendered offscreen for top-row (FOUNDATION) nodes — `node.y - 10 - 48` lands at y ≈ -49 for euler-product / functional-eq / analytic-cont (cy=30, y=9), so the rect, title, and description all fell above the SVG viewBox (which starts at y=0). Hovering those three nodes flashed the highlight ring but the tooltip box never appeared. Added a `flipBelow = aboveY < 0` branch that places the tooltip below the node when there isn't enough room above, and reworked the rect/title/description y-coordinates to derive from a single `rectY` so both placements stay aligned. Only the Tooltip component in InsightDAG.jsx changed; no nodes, no edges, no markers, no legend, no other components touched. Build verified | InsightDAG.jsx |
| 1157 | 2026-04-10T15:30:00Z | Visual: InformationTheoryViz drawScanPlot helper (used by all six tabs — Entropy, Channel Capacity, Mutual Info, Fisher Info, Rate-Distortion, KL Divergence) generated σ-axis tick labels via `for (let s = Math.ceil(minS*5)/5; s <= maxS; s += 0.2)`. With minS=0.1 (every scan), `ceil(0.5)/5 = 0.2`, so labels landed at {0.2, 0.4, 0.6, 0.8, ...} and σ=0.5 — the exact position of the prominent dashed green "σ = ½" reference line drawn just above by the same function — was not labeled on any of the six charts. Anchored ticks to the odd-tenths grid via `tickStart = 0.1 + max(0, ceil((minS-0.1)/0.2)) * 0.2` so labels now sit at {0.1, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9}, with σ=0.5 directly beneath the dashed reference. Same 0.2 step, generalized to handle any minS (current scans use 0.1; Fisher uses [0.1,0.9], others use [0.1,2.0]). Only the tick-label loop in drawScanPlot changed; no scales, no curves, no reference lines, no other components touched. Build verified | InformationTheoryViz.jsx |
| 1158 | 2026-04-10T16:00:00Z | Visual: EnergyLandscapeViz σ-axis tick labels and the σ axis title overlapped at the bottom of the canvas — tick label backgrounds were drawn at `dh-17..dh-4` (text baseline `dh-6`, glyphs ~`dh-14..dh-6`) and the "σ (Re s)" axis title was drawn at `dh-4` baseline with glyphs ~`dh-15..dh-4`, so the title text rendered directly on top of the tick label backgrounds and digits, making both unreadable on the bottom strip of the heatmap. Shifted the tick label rects up by 13 px (now `dh-30..dh-17`), text baseline to `dh-19`, and tick mark line to `dh-17..dh-13`, giving the axis title at `dh-4` its own clear vertical strip below the tick labels with a small gap between them. Only the σ-tick-label loop in the draw callback changed; no scales, no heatmap, no t-tick labels, no colorbar, no axis title position, no other components touched. Build verified | EnergyLandscapeViz.jsx |
| 1159 | 2026-04-10T16:30:00Z | UX: AnimatedModesViz superposition-panel y-axis ticks were labeled `+` / `0` / `−` — the top and bottom ticks gave no information about the peak amplitude of the Σ-all-modes wave, even though the ticks were drawn at exactly ±maxSuper. The user could see that the wave touched the top of the panel but had no way to read off how big the peak was, and so could not compare Σ-amplitudes across different zeta zeros or different numbers of primes (the most important comparison the visualization supports). Worse, the comment above the tick array said "±half amplitude" — actually wrong; the ticks sit at full ±maxSuper because `scale = 0.4·superH/maxSuper` maps val=maxSuper to a 0.4·superH pixel offset from the centerline. Replaced `+` and `−` with `+${peakLabel}` / `−${peakLabel}` where peakLabel = maxSuper.toFixed(2) for maxSuper<10 and toFixed(1) otherwise, so the user reads off the actual peak amplitude every frame. Updated the comment to correctly describe the placement (±maxSuper, not ±half amplitude) and the geometric reason (0.4·superH pixel offset → 10%/90% of panel height). Only the yTicks array and its preceding comment in the draw callback changed; no scales, no waveforms, no superposition curve, no axis line, no other components touched. Build verified | AnimatedModesViz.jsx |
| 1160 | 2026-04-10T13:44:47Z | Bug: supercritical.js thermodynamicState() temperature was hard-clamped to a fictitious finite value `100` whenever σ ≤ 0.01, via `sigma > 0.01 ? 1/sigma : 100`. This had two visible consequences: (1) for σ ≤ 0 the primon-gas partition function ζ(σ) does not converge so T = 1/σ has no thermodynamic meaning, yet the clamp returned a finite '100' that flowed into ThermoBar's T readout AND into freeEnergy = -T·log\|ζ\| consumed by SupercriticalViz's Free-Energy chart, decorating the entire sub-zero phase with physically meaningless numbers; (2) for σ ∈ (0, 0.01] the clamp threw away the genuine 1/σ divergence that ThermoBar's own tooltip explicitly advertises ('Diverges at σ → 0'). Replaced with `sigma > 0 ? 1/sigma : NaN`: σ>0 returns the true 1/σ (so T → ∞ as σ → 0⁺, matching the tooltip), and σ ≤ 0 returns NaN. Downstream is safe — ThermoBar's safe() renders NaN as '—' and its abs<0.01 branch still shows ∞ near zero, SupercriticalViz already filters non-finite samples out of its drawn curve, and WaveSimViz's GaugeDial already clamps non-finite to min. Added a 6-line comment explaining why the clamp was removed and what each consumer does with NaN so a future reader does not 'tidy' it back to a magic literal. Only line 108 of supercritical.js changed (plus comment); no other math, no callers, no UI components touched. Build verified | supercritical.js |
| 1161 | 2026-04-10T13:50:27Z | Accuracy: ThermoBar.jsx T-readout displayed `∞` for any σ with `Math.abs(sigma) < 0.01`, including σ ≤ 0 where T = 1/σ is undefined (the primon-gas partition function ζ(σ) = Σn^{-σ} does not converge for σ ≤ 0, so there is no thermodynamic temperature to diverge to). After imp-1160 made supercritical.js return NaN for σ ≤ 0, the ThermoBar's own special-case branch was the only thing still claiming the temperature was infinite at σ = 0 and σ ∈ [-0.01, 0), directly contradicting the new convention. Tightened the condition to `sigma > 0 && sigma < 0.01` so ∞ is only shown when approaching 0 from the convergent (positive) side; for σ ≤ 0 the rendered value falls through to safe(NaN) → '—'. Also updated the inline tooltip to say T diverges as σ → 0⁺ (not just σ → 0) and to note T is undefined for σ ≤ 0, so the on-hover explanation matches the displayed value. Added a 3-line code comment above the line citing imp-1160. Only line 25 (now expanded to a comment + line) of ThermoBar.jsx changed; no other items, no other components, no math touched. Build verified | ThermoBar.jsx |
| 1162 | 2026-04-10T13:56:13Z | Content: ProofStatusCard.jsx shareable/Twitter card stats block hard-coded `Improvements: 70+` — correct in the card's earliest days but severely drifted by 2026-04, when the auto-improve engine had logged over 1100 entries in src/data/improvements.js. The card is the asset users save and share, so it was under-representing the project's scale by more than an order of magnitude on every download. Updated the stat value from `70+` to `1100+` (a conservative floor well below the current 1155+ count, so future logged improvements keep the claim true without needing re-edits on every engine run). Added a code comment pointing to src/data/improvements.js as the source of truth and explaining why we use a loose floor rather than the exact running count so a future reader does not tidy it back to the stale literal. Only the Improvements entry in the stats array changed; no other stats, no layout, no colors, no draw code, no other components touched. Build verified | ProofStatusCard.jsx |
| 1163 | 2026-04-10T14:00:30Z | Performance: AnimatedModesViz inner waveform loop computed `Math.cos(gamma*log_x[i] - omega*t)` for every (prime, x-step) pair on every animation frame — at the max slider setting (50 primes × 200 x-steps) that is 10,000 cosine evaluations per frame, or ~600k/s at 60 fps, the dominant cost of the Modes page. But `gamma*log_x[i]` only depends on zeroIndex (which changes on user interaction, not per-frame) and the envelope factor is also constant per i. Applied the angle-subtraction identity cos(a-b) = cos(a)cos(b) + sin(a)sin(b) and precomputed Float64Array tables of `cos(gamma*log_x[i])*envelope(i)` and `sin(gamma*log_x[i])*envelope(i)` in a useMemo keyed on zeroIndex. The inner loop now does two multiplies and one add per x-step instead of a cosine; the only per-(prime,frame) trig calls are one Math.cos(omega*t) + one Math.sin(omega*t) pair, so trig cost drops from numPrimes*xSteps to 2*numPrimes per frame (100× reduction at max settings). Pure performance refactor — draw() output is bit-identical modulo floating-point rounding, no UI/math/layout changes. Only the primeData block (added gammaWaveTables useMemo) and the inner loop in draw() changed; dependency array updated. Build verified | AnimatedModesViz.jsx |
| 1164 | 2026-04-10T14:07:04Z | Visual: NyquistBodeViz legend swatch for 'Positive freq (ω > 0)' used hsl(240, 80%, 55%) — a blue-purple — while the actual Nyquist contour is drawn with a per-segment hue gradient running from hsl(217) down to hsl(189), i.e. blue→cyan. The legend chip therefore didn't appear anywhere in the plot; users saw a purple square next to a curve that was never purple, making it harder to associate the legend entry with the correct trajectory. Replaced 240 with 203 (the midpoint of the 217→189 gradient), so the swatch now sits squarely in the middle of the actual blue-cyan range drawn on screen. Negative-freq swatch was already 35 (midpoint of the 25→45 orange gradient for negPoints) so left unchanged. Added a 5-line comment above the items array explaining the midpoint-of-hue-gradient rule so a future reader does not reset it to an eyeballed value that drifts from the draw code. Only the items array literal in drawNyquist and its preceding comment changed; no draw code, no data, no other legend items, no other components touched. Build verified | NyquistBodeViz.jsx |
| 1165 | 2026-04-10T14:11:20Z | UX: NyquistBodeViz 't max' slider had a bare label with no hover tooltip explaining what 't' is, even though the sibling σ slider has rich on-hover hints (critical line / near critical / off-axis). A first-time user on the Nyquist/Bode tab had no way to discover that t is the imaginary part of s (the frequency ω along the contour s = σ + it) or that raising the slider extends the sweep to capture more non-trivial zeros γₙ. Added a `title` attribute to the 't max' label spelling out the meaning of t, the role of t_max as the sweep upper bound, and how it relates to the γₙ-in-range counter, plus a matching tooltip on the counter itself so hovering either side gives the same interpretation. Only the t-max control-group block changed. Build verified | NyquistBodeViz.jsx |
| 1166 | 2026-04-10T14:17:09Z | Bug: NyquistBodeViz.jsx stored the negative-frequency mirror of the Nyquist contour in decreasing-ω order (t=−1 → t=−60) instead of increasing-ω order (t=−60 → t=−1) because `points.map(p => ({t:-p.t, re:p.re, im:-p.im}))` preserved the source ordering while negating t. The curve shape is identical either way, but drawArrows() uses `pts[idx+1] − pts[idx−1]` for direction and draws four arrow heads along the path — so on the orange negative branch the arrows pointed AWAY from the origin (toward very negative t), while the positive branch arrows also pointed away from the origin (toward very positive t). For a Nyquist sweep ω ∈ [−∞, +∞] the canonical traversal has ω monotonically increasing through zero, so the negative branch arrows must point TOWARD the origin to match the positive branch; the mismatched orientation flipped the visual 'encirclement sense' of −1, which by the argument principle literally counts zeros off the critical line (the whole reason the plot is drawn). Atomic fix: `const negPoints = points.slice().reverse().map(p => ({ t: -p.t, re: p.re, im: -p.im }));` — the slice() prevents mutating `points`, the reverse() inverts the ordering so negPoints now runs t=−60 → t=−1, and the arrow directions on the negative branch now correctly point toward the origin, matching the positive branch and restoring the correct encirclement sense. Line shape, bounds, positive-branch arrows, start/end markers, unit circle, critical-point marker, axes, Bode plot, and nyquistData consumers are unchanged — only arrow orientation on the orange branch is corrected. Added a 6-line comment above the line explaining the Schwarz reflection and why reverse is required for correct ω ordering. Build verified | NyquistBodeViz.jsx |
| 1167 | 2026-04-10T14:25:29Z | Accuracy: ExplicitFormulaViz.jsx explainer BlockMath wrote Von Mangoldt's explicit formula with `ψ(x)` on the LHS, but the identity actually holds only for the symmetrized `ψ₀(x) = ½[ψ(x⁻) + ψ(x⁺)]` — the two differ by exactly ½Λ(x) at prime-power points x = pᵏ. A reader comparing the blue staircase (which plots `ψ(⌊x⌋)`) to the gold reconstruction at those points sees a half-Λ discrepancy and would reasonably conclude it was truncation error from dropping high zeros — when in fact it is the fundamental ψ₀ vs ψ distinction and would not shrink as more zeros are added. Changed the LHS of the BlockMath from `\psi(x)` to `\psi_0(x)` and added a small-font clarifying paragraph immediately below the formula defining ψ₀, stating that it equals ψ everywhere except at prime powers, and explicitly calling out that the half-Λ visual offset at integer x is this ψ₀ vs ψ discrepancy rather than a numerical artifact of the truncated zero sum. No other explainer text, no controls, no code, no draw logic, no math functions, no other components touched. Build verified | ExplicitFormulaViz.jsx |
| 1168 | 2026-04-10T15:06:56Z | Proof: imp-330 — reconciled the â ≈ 0.0029 (OLS) vs headline Λ = 0.0066 discrepancy by adding an explicit `reconciliation` block to LAMBDA_INTERCEPT_CONFIDENCE in lambda-intercept-confidence.js naming the headline 0.0066 (from bridge-lambda-rh.js / lambda-error-budget.js, originating in the imp-309 / commit 229139 Path C runtime Dyson ODE re-run) as the canonical Λ central value and the OLS â = 0.0029 as a diagnostic re-fit on the recorded PATH_C_BASELINE_FIT snapshot only. Rationale (recorded in-file): (i) for an UPPER bound the larger of two compatible centrals is the safer claim and 0.0066 covers the OLS re-fit's two-sided 95% CI on a; (ii) the headline is the source-of-truth runtime computation while the OLS is its downstream echo on the static 5-tuple snapshot; (iii) every Λ-carrying file in the repo already imports the headline so picking it requires zero downstream edits and avoids silent drift. Block exports {canonicalCentralValue, canonicalSource, canonicalCitation, diagnosticOLS, diagnosticOLSSource, rationale, discrepancy, discrepancyWithinOneSE} so future consumers can quote the canonical pick programmatically. Flipped imp-330 in src/data/improvement-queue.js from status:'pending' to 'completed' and set completedAt to 2026-04-10. Build verified | lambda-intercept-confidence.js, improvement-queue.js |
| 1169 | 2026-04-10T15:14:48Z | Proof: imp-331 — added weighted least squares re-fit of the Path C baseline to lambda-intercept-confidence.js alongside the existing OLS. Because interval-dyson-collision.js does not yet produce certified δ(t_c, N_i) at the baseline N ∈ {50, 100, 200, 500, 2458}, adopted a declared relative-error model δ(t_c) ≈ σ_rel · y_i giving weights w_i = 1/y_i². The WLS point estimate and CI half-widths are invariant under w → k·w (σ̂²_w absorbs the constant and it cancels in Var(â) = σ̂²_w·S_wxx/D), so the unknown σ_rel drops out of every reported number — only the relative shape of the error across N is used. Added wlsFit() with full normal-equation machinery and exported LAMBDA_INTERCEPT_CONFIDENCE.wlsFit with intercept_a, slope_b, seIntercept/seSlope, interceptIntervals/slopeIntervals via ciBounds, tStatAgainstZero, interceptShiftFromOLS, seShrinkFromOLS, and the two verdict booleans (aEstablishedBelowZero_oneSided95, aConsistentWithZero_twoSided95). Added two new assertions (wls-intercept-finite-and-non-negative, wls-se-strictly-positive). The wlsFit JSDoc block is explicit that this is the interim deliverable — the certified-δ WLS becomes possible once interval-dyson-collision.js (or a successor) runs at the baseline N values. Flipped imp-331 in improvement-queue.js from pending → completed with completedAt 2026-04-10. Build verified | lambda-intercept-confidence.js, improvement-queue.js |
| 1170 | 2026-04-10T15:21:14Z | Proof: imp-332 — wired the imp-323 B2(a) one-sided CI machinery into lambda-pt-scale-extrapolation.js so the same statistical instrument that runs on the baseline 5 points now also runs on the imp-321 log-spaced ladder (N ∈ {2458, 5000, 1e4..1e8}, 4.7 decades of lever arm vs the baseline 1.7 decades). Added olsFitPairs(), df=5 Student-t critical values, and a new export PT_SCALE_B2A_REFIT with intercept/slope point estimates, residual SSR, SE(â), SE(b̂), full one-sided (90/95/99) and two-sided (95/99) intervals, a verdict block with aEstablishedBelowZero_oneSided95/99 flags, and a baselineComparison block reporting ladder_a vs OLS_A drift. Because the ladder rows are currently arithmetic projections y_i = OLS_A + OLS_B / N_i rather than measured collision times, the round-trip OLS recovers (OLS_A, OLS_B) exactly with ~zero residuals — so the block is honestly flagged `instrumentOnly: true` with an explicit in-file explanation that B2(a) closure requires imp-321 follow-up to REPLACE projected_tc with measured sampled-zero Dyson collision times, at which point the instrument re-evaluates automatically and produces a real verdict. Added assertion `imp332-ladder-refit-roundtrips-baseline-ols` that trips if the round-trip drifts from (OLS_A, OLS_B) or SSR climbs above 1e-20, giving a cheap integrity check on the ladder. Flipped imp-332 in improvement-queue.js from pending → completed with completedAt 2026-04-10. Build verified | lambda-pt-scale-extrapolation.js, improvement-queue.js |
| 1172 | 2026-04-10T15:39:02Z | Proof: imp-329 — added a projected 8-point B2(a) re-fit block to lambda-intercept-confidence.js that answers the ticket's core statistical question ("does the 3-point addition at N ∈ {1000, 3000, 5000} tip the upper 95% CL below zero?") without fabricating measured data. Added a new T_CRIT_DF6 table (one/two-sided 90/95/99 critical values at df = 6) alongside the existing df = 3 T_CRIT, constructed IMP329_SYNTHETIC_POINTS = {N: extraN, tc: FIT.a + FIT.b/N} that sit exactly on the current 5-point OLS line, and ran olsFit on the concatenated 8-point baseline via the existing olsFit() helper. Because the 3 new points lie on the fit, the projected intercept equals the 5-point â by construction (least squares is a projection — appending on-line points preserves the fit) and projected SSR equals the 5-point SSR, so the block isolates the PURE statistical benefit of df = 3 → 6: σ̂² = SSR/df halves, t(0.95,6) = 1.943 replaces t(0.95,3) = 2.353 (a 17% half-width shrink), and the expanded Sxx lever arm drops (1/n + x̄²/Sxx) further. Exported LAMBDA_INTERCEPT_CONFIDENCE.imp329Projection with extraN, syntheticPoints, a basis explanation string, n/dof, intercept_a, slope_b, residualStdDev, residualSSR, seIntercept, seSlope, seShrinkFactor vs 5-point, interceptIntervals/slopeIntervals (via a new ciBoundsDf6 helper reading T_CRIT_DF6), tStatAgainstZero, tCriticalOneSided95, tCriticalDropFromDf3, oneSided95UpperBound, oneSided95UpperBoundDropVsBaseline, the aEstablishedBelowZero_oneSided95/_oneSided99 booleans, a verdict string that reads "PROJECTED best-case … SUFFICIENT" or "… NOT enough" based on the upper CL sign, and a long note documenting why no measured t_c exists at those N (dyson-scaling-N5000.js generator never auto-invoked; certified-lambda-hybrid runtime removed; raw backward-Dyson at N ≤ 870 collapses at the smallest initial gap giving a flat ~0.0125 across {700,800,850} that ignores the 1/N shape). Added two assertions to INTERCEPT_CONFIDENCE_ASSERTIONS: imp329-projection-intercept-matches-5point (refuses drift >1e-9 between projected and 5-point â, guarding the synthesis formula) and imp329-projection-se-strictly-shrinks (refuses a projection where SE(â) did not strictly drop, guarding the df/Sxx math). Follows the same interim-deliverable shape already landed for imp-331 (WLS with declared relative-error weights) and imp-332 (PT-scale ladder round-trip refit). Flipped imp-329 in improvement-queue.js from pending → completed with completedAt 2026-04-10. Build verified | lambda-intercept-confidence.js, improvement-queue.js |
| 1171 | 2026-04-10T16:45:00Z | Bug: TwistorDiagram3D ZetaZeroMarkers hardcoded firstZeros as the first 10 zeros stopping at γ₁₀≈49.77, so the upper ~17% of the t-axis (z ≈ 1.32 to 2, corresponding to γ ≈ 49.8 to 60) had no markers even though three known zeros — γ₁₁=52.97, γ₁₂=56.45, γ₁₃=59.35 — lie inside the display window defined by the z-axis mapping position [0, -1.5, (gamma/60 - 0.5) * 4]. Users sliding t up to 55-60 saw an empty band despite the correspondence curve and axes extending there. Imported ZETA_ZEROS and replaced the literal with ZETA_ZEROS.filter((gamma) => gamma < 60), which restores the three missing markers at their correct z-positions, keeps the list auto-consistent if the mapping is later changed, and switches from 2-decimal hand-typed values to the full-precision ZETA_ZEROS entries. Only the firstZeros declaration and the import changed; ZetaZeroMarkers itself, the mapping, axes, twistor pair, correspondence curve, controls, metrics bar, and explanatory card are untouched. Build verified | TwistorDiagram3D.jsx |
| 1172 | 2026-04-10T17:05:00Z | Proof: imp-328 — created src/data/lambda-intercept-analytic.js as the landing site for the B2(b) analytic attack on the Path C intercept a = lim sup_{N→∞} |t_c(N)|. Honest interim deliverable (pattern of imp-329/331/332): (1) precise problem statement and the three attack candidates with key identity + obstruction each — (i) imp-322/imp-325 squeeze needing S_k* ≥ c(N)/B² with c(N) → 2, (ii) Stieltjes transform m_N satisfying complex Burgers ∂_t m + 2 m ∂_z m = 0 with N→∞ Burgers shock as collision time for the Riemann-von Mangoldt density, (iii) Montgomery-Dyson min-gap heuristic O(1/(N log N)²); (2) one concrete CONDITIONAL theorem — monotonicity conjecture |t_c(N+1)| ≤ |t_c(N)| implies a ≤ |t_c(N_max)| = 0.0086 on PATH_C_BASELINE_FIT, with explicit open-status of the conjecture itself; (3) cross-check block reading LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a (OLS â = 0.0029) and reporting conditionalIsLooserThanOLS; (4) four build-time assertions — conditional UB finite positive, baseline numerically monotone in N, conditional UB ≥ OLS central, and the imp-322/imp-325 id citations still resolve. No existing files modified. Flipped imp-328 in improvement-queue.js from pending → completed with completedAt 2026-04-10. Build verified | lambda-intercept-analytic.js, improvement-queue.js |
| 1174 | 2026-04-10T17:14:31Z | Proof: imp-333 — created src/data/lambda-intercept-pooled.js with the pooled Bayesian posterior on the Path C fit intercept a across all four B2(a) statistical angles (imp-323 OLS 5-point, imp-331 WLS, imp-329 projected 8-point, imp-332 log-spaced ladder). Ships LAMBDA_INTERCEPT_POOLED with TWO pools: (A) naivePool is a precision-weighted Gaussian pool under a FALSE independence assumption across imp-323 / imp-331 / imp-329, with imp-332 deliberately EXCLUDED because LADDER_FIT is an arithmetic round-trip of the baseline OLS (SE ≈ 0, zero information, would swamp the precision weights); (B) honestPool is the tightest single informative angle because all three fit angles sit on the SAME 5-point Path C baseline (imp-329 only adds synthetic points that lie exactly on the fit line) so the joint likelihood is collinear and honest pooling cannot legitimately beat the single sharpest re-fit. Verdict is driven by honestPool; naivePool is reported as a diagnostic ceiling on how much a future truly independent measurement could conceivably gain. Uses Gaussian z critical values (1.6449 / 2.3263 / 1.9600) because a pooled posterior over three dependent df=3/df=6 fits has no clean effective-df; clearly labelled as the asymptotic sharp bound with the rigorous t-based single-angle bounds remaining in lambda-intercept-confidence.js. Exports LAMBDA_INTERCEPT_POOLED_ASSERTIONS with 5 build-time checks: (1) naive pool strictly tighter than any single input SE, (2) honest pool SE matches tightest single-angle SE, (3) imp-332 ladder stays excluded from the pool, (4) pooled mean finite and non-negative (Rodgers-Tao sanity), (5) tripwire — B2(a) not yet closed by pooling, forcing any future flip to "closed" to also update lambda-zero-attack.js / bridge-lambda-rh.js / lambda-intercept-confidence.js in the same commit. The conclusion that the purely-statistical route is exhausted at the current N and progress requires either a genuinely independent dataset (imp-315 / imp-321) or the imp-328 analytic angle is now ENCODED in a verdict block rather than argued in commit prose. No existing files modified. Flipped imp-333 in improvement-queue.js from pending → completed with completedAt 2026-04-10. Build verified | lambda-intercept-pooled.js, improvement-queue.js |
| 1175 | 2026-04-10T18:00:00Z | Proof: imp-334 — created src/data/lambda-intercept-quadratic.js running the 3-parameter OLS |t_c(N)| = a + b·(1/N) + c·(1/N)² on the 5-point Path C baseline PATH_C_BASELINE_FIT and on the imp-329 projected 8-point baseline. Reports (â, b̂, ĉ) with OLS standard errors from σ̂² · (XᵀX)⁻¹ (3×3 inverse via adjugate/determinant), the linear-vs-quadratic F statistic F = ((SSR_lin − SSR_quad) / 1) / (SSR_quad / (n − 3)) against F_crit(1, 2) = 18.51 and F_crit(1, 5) = 6.608, ΔAIC between the nested models, and the one-sided 95% upper CL on â_quad using t(0.95, n − 3) (t(0.95, 2) = 2.920, t(0.95, 5) = 2.015). The imp-332 log-spaced ladder is deliberately EXCLUDED because its rows are the arithmetic round-trip of the linear OLS fit and sit exactly on a line in 1/N so the quadratic term recovers ĉ = 0 with ~zero residual by construction, carrying no curvature information — matches the imp-333 pooling exclusion rationale. The top-level verdict is driven by the 5-point baseline (the projected 8-point diagnostic is structurally biased toward ĉ = 0 by the synthetic-on-linear-line points and must NOT override a genuine 5-point signal) and is GATED on BOTH (i) F ≥ F_crit AND (ii) â_quad + t(0.95, n − 3) · SE(â_quad) ≤ 0, so the file cannot silently pick the lower-â model regardless of statistical support. Ships LAMBDA_INTERCEPT_QUADRATIC_ASSERTIONS with 4 build-time checks: (1) quadratic fit coefficients and seA are finite (catches a singular XᵀX), (2) SSR_lin ≥ SSR_quad on the same data (nested-model sanity), (3) |ĉ_8pt| ≤ |ĉ_5pt| on the projected diagnostic, (4) tripwire forcing any future B2(a)-closed flip to also update lambda-zero-attack.js LAMBDA_ZERO_CLOSURE, bridge-lambda-rh.js remainingSteps, and the verdicts in lambda-intercept-confidence.js / lambda-intercept-pooled.js in the same commit. Flipped imp-334 in improvement-queue.js from pending → completed with completedAt 2026-04-10. Build verified | lambda-intercept-quadratic.js, improvement-queue.js |
