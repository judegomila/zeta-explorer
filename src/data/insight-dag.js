/**
 * @module insight-dag
 *
 * The Connected Insights DAG (HomePage). Fine-grained 2026-06-21 (Opus 4.8
 * insight-dag-finegrain fan-out, 5 layer-mappers + synthesis), reconciled with
 * the private review-01787854-v3 proof candidate. Nodes span the foundation through
 * finding layers.
 * across 5 layers (FOUNDATION/MODEL/ANALYSIS/GAPS/TARGET). Each node carries its
 * own `layer` (0-4) so the renderer no longer drops nodes missing from a
 * hardcoded map. Statuses now include refuted/estimate/rh-equivalent and edges
 * include refutes/reformulates to carry the session's honest verdicts: the C_H
 * shock-Holder modulus is the wall for the inherited Dyson/collision lane; the Volterra
 * collapse is PCC-FREE but RH-EQUIVALENT (its Sec-27 LINK B identity REFUTED);
 * no refereed bound is changed, while the separate
 * private package proposes Lambda<=0.1787854 as an unreviewed proof candidate
 * without consuming C_H. It is not an established theorem. No false QED.
 */

export const INSIGHT_NODES = [
  { id: 'euler-product', label: 'Euler Product', layer: 0, category: 'foundation', status: 'proven', page: '/zeta', description: 'zeta(s)=prod_p (1-p^-s)^-1 on Re s>1 — encodes the primes' },
  { id: 'analytic-cont', label: 'Analytic Continuation', layer: 0, category: 'foundation', status: 'proven', page: '/zeta', description: 'zeta continues meromorphically, sole pole at s=1' },
  { id: 'functional-eq', label: 'Functional Equation', layer: 0, category: 'foundation', status: 'proven', page: '/hamiltonian', description: 'xi(s)=xi(1-s): completed zeta entire and symmetric about Re s=1/2' },
  { id: 'phi-test-function', label: 'Phi(u) Test Function', layer: 0, category: 'foundation', status: 'proven', page: '/lambda-bounds', description: 'Even super-exponentially decaying Phi(u) built from theta terms' },
  { id: 'xi-fourier-pair', label: 'Xi Fourier Transform', layer: 0, category: 'foundation', status: 'proven', page: '/lambda-bounds', description: 'xi(1/2+iz)=int Phi(u) e^{izu} du — Xi is Fourier transform of Phi' },
  { id: 'ht-heat-flow', label: 'H_t Heat-Flow Family', layer: 0, category: 'foundation', status: 'proven', page: '/lambda-bounds', description: 'H_t(z)=int e^{tu^2}Phi(u)cos(zu)du — backward heat evolution, H_0=Xi/8' },
  { id: 'lambda-def', label: 'Lambda := inf{t}', layer: 0, category: 'foundation', status: 'proven', page: '/lambda-bounds', description: 'de Bruijn-Newman Lambda=inf{t: H_t has only real zeros}' },
  { id: 'rh-iff-lambda-zero', label: 'RH <=> Lambda=0', layer: 0, category: 'foundation', status: 'proven', page: '/route-map', description: 'RH iff Lambda<=0; with Newman Lambda>=0 gives RH <=> Lambda=0' },
  { id: 'single-oscillator', label: 'Single Oscillator', layer: 1, category: 'model', status: 'proven', page: '/oscillators', description: 'H_p(s)=1/(1-p^-s) as a lossless LC resonator per prime' },
  { id: 'ladder-chain', label: 'Ladder Chain', layer: 1, category: 'model', status: 'proven', page: '/oscillators', description: 'Cascade of prime oscillators reproduces the Euler product' },
  { id: 'twin-ladder', label: 'Twin Ladder', layer: 1, category: 'model', status: 'proven', page: '/twin-ladder', description: 'Direct + dual ladders coupled by the bridge chi(s)' },
  { id: 'bridge-unitarity', label: 'Bridge Unitarity', layer: 1, category: 'model', status: 'proven', page: '/control', description: '|chi(1/2+it)|=1: the bridge is lossless on the critical line' },
  { id: 'hamiltonian', label: 'Hamiltonian H', layer: 1, category: 'model', status: 'conditional', page: '/hamiltonian', description: 'Candidate H minimized at sigma=1/2, conditional on operator construction' },
  { id: 'berry-keating', label: 'Berry-Keating xp', layer: 1, category: 'model', status: 'conditional', page: '/berry-keating-xp', description: 'H=xp semiclassical model: prime orbits with period log p' },
  { id: 'dyson-cm-flow', label: 'Dyson / CM Flow', layer: 1, category: 'model', status: 'proven', page: '/dyson-verifier', description: 'Zeros as particles under attractive Calogero-Moser flow' },
  { id: 'dyson-burgers-pde', label: 'Dyson-Burgers PDE', layer: 1, category: 'model', status: 'proven', page: '/viz-euler-transport-flow', description: 'Stieltjes transform obeys inviscid complex Burgers u_t+u u_z=0' },
  { id: 'gap-dynamics', label: 'Gap Dynamics dg/ds', layer: 1, category: 'model', status: 'proven', page: '/dyson-verifier', description: 'Exact pair identity dg/ds=-(4/g)(1-Theta) (sg1 Lemma E)' },
  { id: 'theta-functional', label: 'Theta Functional', layer: 1, category: 'model', status: 'proven', page: '/dyson-verifier', description: 'Dimensionless Theta=g^2 E/2 with exact dE/ds env identity' },
  { id: 'volterra-operator', label: 'Volterra V_{a,Phi}', layer: 1, category: 'model', status: 'proven', page: '/volterra-bound', description: 'Endpoint-Hankel Volterra operator on L^2[0,U]; well-defined and PCC-free' },
  { id: 'debranges-canonical', label: 'de Branges E_a', layer: 1, category: 'model', status: 'conditional', page: '/three-attacks', description: 'E_a=A_a-iB_a / canonical system; trace-normed H exists only abstractly' },
  { id: 'ka-reproducing-kernel', label: 'K_a Reproducing Kernel', layer: 1, category: 'model', status: 'conditional', page: '/shift-bridge-positivity', description: 'K_a of H(E_a); K_a>=0 is RH-equivalent, not a model fact' },
  { id: 'KYP-bounded-real', label: 'KYP / Bounded-Real', layer: 1, category: 'model', status: 'conditional', page: '/kyp-bounded-real', description: 'App M-O: state-space KYP, bounded-real delay, delay-Gram positivity certs' },
  { id: 'gue-statistics', label: 'GUE Statistics', layer: 2, category: 'analysis', status: 'proven', page: '/statistics', description: 'Zero spacings match GUE (pair correlation, form factor) — empirical instrument' },
  { id: 'theta-trap-thmA', label: 'Theta-Trap Thm A', layer: 2, category: 'analysis', status: 'proven', page: '/dyson-verifier', description: 'Theta<=1/4 is an unconditional forward-invariant trap of the CM-flow' },
  { id: 'corollary-a1-tc-part', label: 'Corollary A1 t_c^part', layer: 2, category: 'analysis', status: 'proven', page: '/dyson-verifier', description: 'Theta(0)<=1/4 gives unconditional t_c<=g_min^2/6 — on PARTICLE flow' },
  { id: 'burgers-limsup-tc', label: 'Burgers lim-sup t_c->0', layer: 2, category: 'analysis', status: 'proven', page: '/dyson-verifier', description: 'Route B deterministic lim-sup|t_c(N)|->0, PCC/GUE-free; particle flow not Lambda' },
  { id: 'heat-discriminant-tc', label: 'Heat-Discriminant t_c', layer: 2, category: 'analysis', status: 'proven', page: '/collapse-chain', description: 'Exact collision time via heat-flow discriminant — non-dynamical instrument' },
  { id: 'hs-bound-IJ', label: 'HS bound sqrt(I0 Ja)', layer: 2, category: 'analysis', status: 'proven', page: '/viz-volterra-kernel-heatmap', description: 'Rigorous ||V||<=sqrt(I0 Ja)~2.94e-4; but bounds an RH-equivalent object' },
  { id: 'EN-decomposition', label: 'E(N) Decomposition', layer: 2, category: 'analysis', status: 'conditional', page: '/lambda-bounds', description: '|Lambda+t_c(N)|<=E_trunc+E_flow+E_coll; E_coll funnels into C_H wall' },
  { id: 'spectral-form-factor', label: 'Spectral Form Factor', layer: 2, category: 'analysis', status: 'proven', page: '/statistics', description: 'K(tau) dip-ramp-plateau confirms GUE quantum chaos' },
  { id: 'four-route-equivalence', label: 'Four-Route Equivalence', layer: 2, category: 'analysis', status: 'rh-equivalent', page: '/closure-routes', description: 'Schur / de Branges / hidden-square / Weil routes all RH-equivalent' },
  { id: 'weil-positivity-equiv', label: 'Weil Positivity = RH', layer: 2, category: 'analysis', status: 'rh-equivalent', page: '/spectral-attack', description: 'Weil explicit-formula positivity is RH across Connes sub-routes; not a shortcut' },
  { id: 'connes-spectral-triple', label: 'Connes Spectral Triple', layer: 2, category: 'analysis', status: 'rh-equivalent', page: '/connes-adelic', description: 'Adelic/Weil-positivity realization renames RH; missing piece is the PCC wall' },
  { id: 'beurling-nyman', label: 'Beurling-Nyman', layer: 2, category: 'analysis', status: 'rh-equivalent', page: '/closure-routes', description: 'Strict RH equivalence; d_N~1/sqrt(log N) astronomically slow — a rename' },
  { id: 'guth-maynard-2024', label: 'Guth-Maynard 2024', layer: 2, category: 'analysis', status: 'estimate', page: '/route-map', description: 'Zero-density 0.6->0.52 rigorous but NON-binding: E_trunc sits 261x below L_cond' },
  { id: 'montgomery-pcc', label: 'Montgomery PCC', layer: 3, category: 'gap', status: 'open', page: '/pcc-route-exhaustion', description: 'Pair-correlation support>1 is the 50-yr wall every PCC zero-statistic route hits' },
  { id: 'selberg-trace-pcc', label: 'Selberg-Trace PCC', layer: 3, category: 'gap', status: 'refuted', page: '/pcc-route-exhaustion', description: 'ESY/Selberg-trace closure DEAD: arithmetic dichotomy funnels into Montgomery PCC' },
  { id: 'goldston-gonek-pcc', label: 'Goldston-Gonek 2pt', layer: 3, category: 'gap', status: 'refuted', page: '/pcc-route-exhaustion', description: 'Goldston-Gonek/Maynard 2-point PCC approach DEAD; one citation flagged fabricated' },
  { id: 'gap-CH-shock-holder', label: 'C_H Shock-Holder', layer: 3, category: 'gap', status: 'gap', page: '/rigor-dashboard', description: 'Wall for the inherited Dyson/collision lane: N-uniform Holder-1/2 shock modulus C_H; naive Gronwall refuted (imp-2640)' },
  { id: 'gap-s27-blockpos-identity', label: 'S27 Block-Pos Identity', layer: 3, category: 'gap', status: 'refuted', page: '/route-map', description: 'LINK B: claimed block-positivity<=>K_a-PSD identity REFUTED (2026-06-17)' },
  { id: 'gap-volterra-L2-norm', label: 'L2 Volterra Norm 27.2', layer: 3, category: 'gap', status: 'rh-equivalent', page: '/route-map', description: '||V||<=1 collapse ELIMINATED as a reduction; 5000x margin was a homogeneity artifact' },
  { id: 'gap-s26-normalized-R', label: 'S26 Normalized-R', layer: 3, category: 'gap', status: 'rh-equivalent', page: '/route-map', description: 'Conj-26.3: least-ruled-out direct target but information-preservingly RH-equivalent' },
  { id: 'gap-s5', label: 'S5: Hilbert-Polya', layer: 3, category: 'gap', status: 'gap', page: '/gap-closing', description: 'Construct self-adjoint operator with spectrum = zeros' },
  { id: 'gap-s7', label: 'S7: Darlington', layer: 3, category: 'gap', status: 'gap', page: '/gap-closing', description: 'Prove infinite twin-ladder satisfies Darlington losslessness' },
  { id: 'inverse-Blaschke-ghosts', label: 'Inverse Blaschke Ghosts', layer: 3, category: 'gap', status: 'rh-equivalent', page: '/blaschke-ghosts', description: 'B_a^+=1 <=> RH; ghost poles = off-critical zeros (Krein-Langer/Pontryagin)' },
  { id: 'target-route-map-hub', label: 'Full Route Map (38)', layer: 4, category: 'target', status: 'open', page: '/route-map', description: 'Orientation hub: the inherited Dyson/collision lane hits C_H; the private fixed-height proof candidate is a separate lane; RH still has no shortcut' },
  { id: 'target-lambda-RT', label: 'Lambda>=0 Rodgers-Tao', layer: 4, category: 'target', status: 'proven', page: '/lambda-bounds', description: 'Rigorous floor Lambda>=0 (Rodgers-Tao); sharp under RH, closes the lower side' },
  { id: 'target-lambda-PT', label: 'Lambda<=0.2 Platt-Trudg', layer: 4, category: 'target', status: 'proven', accepted: true, peerReviewed: true, page: '/lambda-bounds', description: 'Accepted peer-reviewed upper-bound benchmark Lambda<=0.2 (Platt-Trudgian)' },
  {
    id: 'target-lambda-candidate-01787854',
    label: 'Lambda<=0.1787854 Candidate',
    layer: 4,
    category: 'target',
    status: 'candidate',
    page: '/newman-lambda-01787854-candidate',
    countsAsEstablishedUpperBound: false,
    repository: 'judegomila/dbn-lambda-01787854-candidate-audit',
    repositoryVisibility: 'private',
    tag: 'review-01787854-v3',
    commit: '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea',
    tree: '7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44',
    manifestSha256: '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c',
    description: 'Private v3 computer-assisted proof candidate for an unconditional bound; not established, unpublished, unpeer-reviewed, unaccepted, and not RH',
  },
  { id: 'target-finite-1e4-beat', label: 'Finite-N*=1e4 Beat', layer: 4, category: 'target', status: 'estimate', page: '/lambda-bounds', description: 'PT-comparable finite beat but ESTIMATE: gated on undischargeable C_H (imp-2640)' },
  { id: 'rh', label: 'Riemann Hypothesis', layer: 4, category: 'target', status: 'open', page: '/formal-proof', description: 'All nontrivial zeros have Re(rho)=1/2' },
  { id: 'shift-bridge-positivity', label: 'Shift-Bridge Positivity', layer: 2, category: 'analysis', status: 'rh-equivalent', page: '/shift-bridge-positivity', description: 'v52 App: shift-bridge positivity certificate; equivalent to the four-route closure' },
  { id: 'reciprocal-program', label: 'Reciprocal Program', layer: 2, category: 'analysis', status: 'rh-equivalent', page: '/closure-routes', description: 'v52 reciprocal / inverse-Blaschke program; an RH-equivalent closure route' },
  { id: 'viz-vortex-field', label: 'Vortex Field', layer: 5, category: 'viz', status: 'illustrative', page: '/vortex-field', description: 'Streamline plot of the log-derivative phase field xi\'(s)/xi(s) swirling around a zeta zero; exploratory geometry with an honest-ceiling banner, no Lambda claim.' },
  { id: 'viz-winding-dyson-flow', label: 'Winding Dyson Flow', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-winding-dyson-flow', description: 'Argument-principle winding of zeros-as-particles under the attractive Calogero-Moser/Dyson flow; a movie of the model dynamics, no rigor implied.' },
  { id: 'viz-near-zero', label: 'Near a Zeta Zero', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-near-zero', description: 'Close-up of the completed xi near a simple zero rho=1/2+i*gamma showing the RH<=>Lambda=0 nodal geometry; illustrative, asserts nothing about Lambda.' },
  { id: 'viz-euler-transport-flow', label: 'Euler Transport Flow', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-euler-transport-flow', description: 'Animated Stieltjes-transport field for the inviscid complex Burgers PDE u_t+u u_z=0 governing the zero gas; depicts the PDE, asserts nothing about Lambda.' },
  { id: 'viz-supercritical', label: 'Supercritical Landscape', layer: 5, category: 'viz', status: 'illustrative', page: '/supercritical', description: 'Landscape view of the supercritical winding experiment (off-critical excursions of the H_t flow); exploratory probe with an honest-ceiling banner, no bound.' },
  { id: 'viz-euler-product', label: 'True vs Perturbed Euler', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-euler-product', description: 'Overlay of log|prod_{p<=P}(1-p^-s)^-1| on the critical line against a per-prime perturbed product; the true product\'s near-zeros sit at the zeta zeros, the perturbed one drifts. Exploratory.' },
  { id: 'viz-prime-caustic', label: 'Prime Caustic', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-prime-caustic', description: 'Prime phase lines theta_p(t)=t log p mod 2pi forming a bright caustic where many coincide; a visual stand-in for multiplicative/explicit-formula resonance, no analytic content.' },
  { id: 'viz-caustic-resonance', label: 'Caustic Resonance', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-caustic-resonance', description: 'Overlay marking where per-prime oscillator resonance peaks land on the log-phase caustic ridges; depicts the single-resonator picture, exploratory only.' },
  { id: 'viz-prime-density-caustic', label: 'Prime Density on Caustic', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-prime-density-caustic', description: 'Heatmap of which primes (by counting rank) contribute to the caustic at each height t; an empirical view of Euler-product term structure, no Lambda claim.' },
  { id: 'viz-prime-rigidity', label: 'Prime Rigidity', layer: 5, category: 'viz', status: 'illustrative', page: '/prime-rigidity', description: 'True-vs-perturbed comparison showing arithmetic prime phases are rigid (caustics stay sharp) where a randomized control smears out; arithmetic-vs-random contrast, illustrative.' },
  { id: 'viz-prime-phase-crystal', label: 'Prime Phase Crystal', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-prime-phase-crystal', description: 'Bragg-style diffraction lattice from the prime phase field evoking GUE-like zero spacings; a quasi-crystal picture of the multiplicative structure, not a statistical claim.' },
  { id: 'viz-log-phase-spiral', label: 'Log-Phase Spiral', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-log-phase-spiral', description: 'Each integer n drawn at angle theta=t log n; primes trace the per-prime LC-resonator winding as a spiral, a visual of the single oscillator, exploratory.' },
  { id: 'viz-hyperbolic-prime-spiral', label: 'Hyperbolic Prime Spiral', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-hyperbolic-prime-spiral', description: 'First ~5000 primes embedded in the Poincare disk; prime geodesics of period log p evoke the Berry-Keating xp orbit picture, illustrative geometry only.' },
  { id: 'viz-phase-cylinder', label: 'Phase Cylinder', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-phase-cylinder', description: 'Log-phase field theta=t log n mod 2pi wrapped on a cylinder where |chi(1/2+it)|=1 bridge unitarity holds; depicts losslessness on the critical line, not a claim about it.' },
  { id: 'viz-unwrapped-rays', label: 'Unwrapped Prime Rays', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-unwrapped-rays', description: 'Flat strip (log p vs t) of unwrapped prime phase rays with caustic-crossing ticks where adjacent rays align mod 2pi; an Euler-product phase view, exploratory.' },
  { id: 'viz-twin-ladder-tomography', label: 'Twin-Ladder Tomography', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-twin-ladder-tomography', description: 'Heatmap of P(sigma,t)=|zeta(sigma+it)||zeta(1-sigma+it)| reading the critical line as a functional-equation interference trough with zeros as nulls; depicts the twin ladder, no claim.' },
  { id: 'viz-volterra-kernel-heatmap', label: 'Volterra Kernel Heatmap', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-volterra-kernel-heatmap', description: 'Heatmap of the endpoint-Hankel Volterra kernel whose HS norm gives the rigorous ||V||<=sqrt(I0 Ja)~2.94e-4 bound; visualizes an RH-equivalent object, not a shortcut.' },
  { id: 'viz-volterra-norm-curve', label: 'Volterra Norm Curve', layer: 5, category: 'viz', status: 'illustrative', page: '/viz-volterra-norm-curve', description: 'Plot of the Volterra operator norm vs cutoff U for V_{a,Phi}; the apparent margin is a homogeneity artifact, shown for context not as evidence, no Lambda claim.' },
  { id: 'finding-ch-wall-rh-hard', label: 'C_H Wall = RH-hard', layer: 6, category: 'finding', status: 'refuted', page: '/rigor-dashboard', description: 'Skeptical verdict: the N-uniform shock-Holder modulus C_H (and its Lipschitz C_Lip route) is genuinely RH-hard, refuting any finite-N shortcut to a Lambda upper bound, three independent ways.' },
  { id: 'finding-tc-linchpin', label: 't_c Linchpin Open', layer: 6, category: 'finding', status: 'open', page: '/lambda-bounds', description: 'Unresolved linchpin: whether the dBN bridge consumes t_c^part (A1-rigorous ~2.4e-4) or t_c^MF (OLS ~7e-3); this gates the finite-N*=1e4 beat and is the one move not yet shown RH-hard.' },
  { id: 'finding-volterra-not-reduction', label: 'Volterra Not-Reduction', layer: 6, category: 'finding', status: 'refuted', page: '/route-map', description: 'Verdict: the Volterra ||V||<=1 collapse is ELIMINATED as a reduction; the residual sub-problem is RH-equivalent, so the collapse renames RH rather than reducing it.' },
  { id: 'finding-norm-mismatch', label: '5000x = Norm Mismatch', layer: 6, category: 'finding', status: 'rh-equivalent', page: '/route-map', description: 'Diagnosis: the 5000x Volterra margin was a homogeneity/norm mismatch, not slack; once corrected the bound is exactly RH-equivalent.' },
  { id: 'finding-mupass-operator', label: 'S26 mu-pass = RH', layer: 6, category: 'finding', status: 'rh-equivalent', page: '/route-map', description: 'section26 mu-pass verdict (2026-06-30): RESIDUAL-SUBGAP, confirmed information-preservingly RH-equivalent at the operator-positivity level.' },
  { id: 'finding-econn-metric', label: 'E_coll Metric Verdict', layer: 6, category: 'finding', status: 'rh-equivalent', page: '/what-we-know', description: 'Metric-rearchitecture verdict (2026-06-30): the global-W_1 norm in E_coll is INCIDENTAL not fundamental; corrects our own prior overclaim, the true obstruction is multi-body isolation and stays RH-hard.' },
  { id: 'finding-routeb-limsup-rigorous', label: 'Route B limsup OK', layer: 6, category: 'finding', status: 'proven', page: '/what-we-know', description: 'The genuine rigorous result of the program: Route B\'s deterministic lim-sup |t_c(N)|->0 holds unconditionally on the particle flow (not on Lambda).' },
  { id: 'finding-r2t-isolation-c', label: 'R2-T Isolation c', layer: 6, category: 'finding', status: 'gap', page: '/what-we-know', description: 'The R2-T isolation constant c is the single DETERMINISTIC, PCC/GUE-free open forward move feeding the C_H wall; the one move not yet shown RH-hard.' },
  { id: 'finding-basin-conditional', label: 'Basin-Conditional C_Lip', layer: 6, category: 'finding', status: 'conditional', page: '/rigor-dashboard', description: 'imp-3006 finding: a local-energy C_Lip holds only inside the sg1c isolation basin (c*~0.9319); conditional, not N-uniform, does not discharge the wall.' },
  { id: 'finding-six-overclaim-ledger', label: '6-Overclaim Ledger', layer: 6, category: 'finding', status: 'refuted', page: '/what-we-know', description: 'Verification ledger that caught and refuted six prior overclaims (including the finite-N beat), enforcing no-false-QED discipline across the program.' },
  { id: 'finding-no-shortcut-meta', label: 'No-Shortcut Meta', layer: 6, category: 'finding', status: 'refuted', page: '/route-map', description: 'Meta-verdict for RH: every classified global route is RH-hard, RH-equivalent, or dead. C_H is specifically the inherited Dyson/collision wall; the separate fixed-height package is only an unreviewed positive-Lambda proof candidate.' },
];

export const INSIGHT_EDGES = [
  { from: 'euler-product', to: 'analytic-cont', type: 'extends' },
  { from: 'analytic-cont', to: 'functional-eq', type: 'derives' },
  { from: 'functional-eq', to: 'xi-fourier-pair', type: 'derives' },
  { from: 'phi-test-function', to: 'xi-fourier-pair', type: 'composes' },
  { from: 'xi-fourier-pair', to: 'ht-heat-flow', type: 'derives' },
  { from: 'phi-test-function', to: 'ht-heat-flow', type: 'composes' },
  { from: 'ht-heat-flow', to: 'lambda-def', type: 'derives' },
  { from: 'lambda-def', to: 'rh-iff-lambda-zero', type: 'derives' },
  { from: 'functional-eq', to: 'rh-iff-lambda-zero', type: 'supports' },
  { from: 'euler-product', to: 'single-oscillator', type: 'derives' },
  { from: 'single-oscillator', to: 'ladder-chain', type: 'composes' },
  { from: 'ladder-chain', to: 'twin-ladder', type: 'composes' },
  { from: 'twin-ladder', to: 'bridge-unitarity', type: 'composes' },
  { from: 'twin-ladder', to: 'hamiltonian', type: 'derives' },
  { from: 'berry-keating', to: 'hamiltonian', type: 'derives' },
  { from: 'single-oscillator', to: 'berry-keating', type: 'inspires' },
  { from: 'hamiltonian', to: 'dyson-cm-flow', type: 'analogous' },
  { from: 'dyson-cm-flow', to: 'gap-dynamics', type: 'derives' },
  { from: 'dyson-cm-flow', to: 'dyson-burgers-pde', type: 'derives' },
  { from: 'gap-dynamics', to: 'theta-functional', type: 'composes' },
  { from: 'twin-ladder', to: 'debranges-canonical', type: 'derives' },
  { from: 'bridge-unitarity', to: 'debranges-canonical', type: 'composes' },
  { from: 'debranges-canonical', to: 'ka-reproducing-kernel', type: 'derives' },
  { from: 'bridge-unitarity', to: 'ka-reproducing-kernel', type: 'composes' },
  { from: 'twin-ladder', to: 'volterra-operator', type: 'derives' },
  { from: 'volterra-operator', to: 'ka-reproducing-kernel', type: 'analogous' },
  { from: 'twin-ladder', to: 'KYP-bounded-real', type: 'derives' },
  { from: 'hamiltonian', to: 'KYP-bounded-real', type: 'analogous' },
  { from: 'KYP-bounded-real', to: 'ka-reproducing-kernel', type: 'supports' },
  { from: 'functional-eq', to: 'gue-statistics', type: 'supports' },
  { from: 'gue-statistics', to: 'spectral-form-factor', type: 'derives' },
  { from: 'gue-statistics', to: 'burgers-limsup-tc', type: 'supports' },
  { from: 'theta-functional', to: 'theta-trap-thmA', type: 'derives' },
  { from: 'theta-trap-thmA', to: 'corollary-a1-tc-part', type: 'derives' },
  { from: 'corollary-a1-tc-part', to: 'burgers-limsup-tc', type: 'supports' },
  { from: 'dyson-burgers-pde', to: 'burgers-limsup-tc', type: 'derives' },
  { from: 'ht-heat-flow', to: 'heat-discriminant-tc', type: 'derives' },
  { from: 'heat-discriminant-tc', to: 'corollary-a1-tc-part', type: 'supports' },
  { from: 'volterra-operator', to: 'hs-bound-IJ', type: 'derives' },
  { from: 'heat-discriminant-tc', to: 'EN-decomposition', type: 'supports' },
  { from: 'burgers-limsup-tc', to: 'EN-decomposition', type: 'supports' },
  { from: 'theta-trap-thmA', to: 'EN-decomposition', type: 'supports' },
  { from: 'EN-decomposition', to: 'gap-CH-shock-holder', type: 'requires' },
  { from: 'ka-reproducing-kernel', to: 'four-route-equivalence', type: 'composes' },
  { from: 'weil-positivity-equiv', to: 'four-route-equivalence', type: 'composes' },
  { from: 'hs-bound-IJ', to: 'four-route-equivalence', type: 'supports' },
  { from: 'connes-spectral-triple', to: 'weil-positivity-equiv', type: 'composes' },
  { from: 'euler-product', to: 'connes-spectral-triple', type: 'derives' },
  { from: 'euler-product', to: 'guth-maynard-2024', type: 'derives' },
  { from: 'analytic-cont', to: 'beurling-nyman', type: 'requires' },
  { from: 'selberg-trace-pcc', to: 'montgomery-pcc', type: 'requires' },
  { from: 'goldston-gonek-pcc', to: 'montgomery-pcc', type: 'requires' },
  { from: 'connes-spectral-triple', to: 'montgomery-pcc', type: 'requires' },
  { from: 'weil-positivity-equiv', to: 'montgomery-pcc', type: 'requires' },
  { from: 'guth-maynard-2024', to: 'montgomery-pcc', type: 'supports' },
  { from: 'four-route-equivalence', to: 'gap-volterra-L2-norm', type: 'reformulates' },
  { from: 'gap-s27-blockpos-identity', to: 'gap-volterra-L2-norm', type: 'refutes' },
  { from: 'gap-s26-normalized-R', to: 'gap-volterra-L2-norm', type: 'requires' },
  { from: 'hamiltonian', to: 'gap-s5', type: 'requires' },
  { from: 'connes-spectral-triple', to: 'gap-s5', type: 'supports' },
  { from: 'twin-ladder', to: 'gap-s7', type: 'requires' },
  { from: 'KYP-bounded-real', to: 'gap-s7', type: 'supports' },
  { from: 'ka-reproducing-kernel', to: 'inverse-Blaschke-ghosts', type: 'requires' },
  { from: 'EN-decomposition', to: 'gap-s7', type: 'supports' },
  { from: 'gap-CH-shock-holder', to: 'target-finite-1e4-beat', type: 'requires' },
  { from: 'gap-CH-shock-holder', to: 'rh', type: 'requires' },
  { from: 'target-route-map-hub', to: 'gap-CH-shock-holder', type: 'requires' },
  { from: 'target-route-map-hub', to: 'rh', type: 'supports' },
  { from: 'target-lambda-PT', to: 'rh', type: 'supports' },
  { from: 'target-lambda-PT', to: 'target-lambda-candidate-01787854', type: 'extends' },
  { from: 'ht-heat-flow', to: 'target-lambda-candidate-01787854', type: 'supports' },
  { from: 'target-lambda-candidate-01787854', to: 'rh', type: 'supports' },
  { from: 'target-lambda-RT', to: 'rh', type: 'supports' },
  { from: 'target-finite-1e4-beat', to: 'target-lambda-PT', type: 'analogous' },
  { from: 'rh-iff-lambda-zero', to: 'target-lambda-PT', type: 'supports' },
  { from: 'rh-iff-lambda-zero', to: 'target-lambda-RT', type: 'supports' },
  { from: 'beurling-nyman', to: 'rh', type: 'equivalent' },
  { from: 'weil-positivity-equiv', to: 'rh', type: 'equivalent' },
  { from: 'four-route-equivalence', to: 'rh', type: 'equivalent' },
  { from: 'connes-spectral-triple', to: 'rh', type: 'reformulates' },
  { from: 'gap-volterra-L2-norm', to: 'rh', type: 'reformulates' },
  { from: 'gap-s26-normalized-R', to: 'rh', type: 'reformulates' },
  { from: 'inverse-Blaschke-ghosts', to: 'rh', type: 'equivalent' },
  { from: 'gap-s5', to: 'rh', type: 'proves' },
  { from: 'gap-s7', to: 'rh', type: 'proves' },
  { from: 'montgomery-pcc', to: 'rh', type: 'requires' },
  { from: 'shift-bridge-positivity', to: 'four-route-equivalence', type: 'supports' },
  { from: 'reciprocal-program', to: 'four-route-equivalence', type: 'supports' },
  { from: 'viz-vortex-field', to: 'ht-heat-flow', type: 'illustrates' },
  { from: 'viz-winding-dyson-flow', to: 'dyson-cm-flow', type: 'illustrates' },
  { from: 'viz-near-zero', to: 'rh-iff-lambda-zero', type: 'illustrates' },
  { from: 'viz-euler-transport-flow', to: 'dyson-burgers-pde', type: 'illustrates' },
  { from: 'viz-supercritical', to: 'ht-heat-flow', type: 'illustrates' },
  { from: 'viz-euler-product', to: 'euler-product', type: 'illustrates' },
  { from: 'viz-prime-caustic', to: 'euler-product', type: 'illustrates' },
  { from: 'viz-caustic-resonance', to: 'single-oscillator', type: 'illustrates' },
  { from: 'viz-prime-density-caustic', to: 'euler-product', type: 'illustrates' },
  { from: 'viz-prime-rigidity', to: 'euler-product', type: 'illustrates' },
  { from: 'viz-prime-phase-crystal', to: 'gue-statistics', type: 'illustrates' },
  { from: 'viz-log-phase-spiral', to: 'single-oscillator', type: 'illustrates' },
  { from: 'viz-hyperbolic-prime-spiral', to: 'berry-keating', type: 'illustrates' },
  { from: 'viz-phase-cylinder', to: 'bridge-unitarity', type: 'illustrates' },
  { from: 'viz-unwrapped-rays', to: 'euler-product', type: 'illustrates' },
  { from: 'viz-twin-ladder-tomography', to: 'twin-ladder', type: 'illustrates' },
  { from: 'viz-volterra-kernel-heatmap', to: 'hs-bound-IJ', type: 'illustrates' },
  { from: 'viz-volterra-norm-curve', to: 'volterra-operator', type: 'illustrates' },
  { from: 'finding-ch-wall-rh-hard', to: 'gap-CH-shock-holder', type: 'characterizes' },
  { from: 'finding-ch-wall-rh-hard', to: 'target-finite-1e4-beat', type: 'refutes' },
  { from: 'finding-tc-linchpin', to: 'target-finite-1e4-beat', type: 'characterizes' },
  { from: 'finding-volterra-not-reduction', to: 'gap-volterra-L2-norm', type: 'characterizes' },
  { from: 'finding-norm-mismatch', to: 'gap-volterra-L2-norm', type: 'characterizes' },
  { from: 'finding-mupass-operator', to: 'gap-s26-normalized-R', type: 'characterizes' },
  { from: 'finding-econn-metric', to: 'EN-decomposition', type: 'characterizes' },
  { from: 'finding-routeb-limsup-rigorous', to: 'burgers-limsup-tc', type: 'characterizes' },
  { from: 'finding-r2t-isolation-c', to: 'gap-CH-shock-holder', type: 'characterizes' },
  { from: 'finding-r2t-isolation-c', to: 'burgers-limsup-tc', type: 'supports' },
  { from: 'finding-basin-conditional', to: 'gap-CH-shock-holder', type: 'characterizes' },
  { from: 'finding-six-overclaim-ledger', to: 'target-finite-1e4-beat', type: 'characterizes' },
  { from: 'finding-no-shortcut-meta', to: 'target-route-map-hub', type: 'characterizes' },
  { from: 'finding-no-shortcut-meta', to: 'gap-CH-shock-holder', type: 'supports' },
];

export const STATUS_COLORS = {
  proven: '#10b981',
  candidate: '#f59e0b',
  conditional: '#f59e0b',
  gap: '#f97316',
  open: '#ef4444',
  refuted: '#b91c1c',
  estimate: '#3b82f6',
  'rh-equivalent': '#94a3b8',
  illustrative: '#22d3ee',
};

export const CATEGORY_COLORS = {
  foundation: '#3b82f6',
  model: '#8b5cf6',
  analysis: '#06b6d4',
  gap: '#f97316',
  target: '#ef4444',
  viz: '#06b6d4',
  finding: '#fbbf24',
};

// ── Build-time assertions (imp-1215 + DAG integrity) ─────────────────────────
//
// These tripwires lock the structural invariants of the Insight DAG so that
// future edits cannot silently introduce cycles, dangling edges, or duplicate
// node ids. They also pin the five wave-11/12 nodes added by imp-1215 so the
// twin-ladder v52 layer cannot regress.

// Tarjan SCC: returns the list of strongly-connected components (each SCC is
// an array of node ids). An SCC of size > 1 is a true cycle; an SCC of size 1
// is a cycle iff the node has a self-loop. Used by the imp-1215 tripwire that
// pins the cycle structure of the DAG.
function _stronglyConnectedComponents() {
  const adj = new Map();
  for (const n of INSIGHT_NODES) adj.set(n.id, []);
  for (const e of INSIGHT_EDGES) {
    if (adj.has(e.from)) adj.get(e.from).push(e.to);
  }
  const index = new Map();
  const lowlink = new Map();
  const onStack = new Set();
  const stack = [];
  const sccs = [];
  let idx = 0;

  function strongconnect(v) {
    // Iterative Tarjan to avoid recursion-stack blow-ups.
    const work = [{ v, pi: 0, child: null }];
    index.set(v, idx);
    lowlink.set(v, idx);
    idx++;
    stack.push(v);
    onStack.add(v);

    while (work.length) {
      const top = work[work.length - 1];
      const children = adj.get(top.v) || [];
      if (top.child !== null) {
        // Returning from recursion on `top.child` — propagate lowlink.
        lowlink.set(top.v, Math.min(lowlink.get(top.v), lowlink.get(top.child)));
        top.child = null;
      }
      if (top.pi < children.length) {
        const w = children[top.pi++];
        if (!index.has(w)) {
          index.set(w, idx);
          lowlink.set(w, idx);
          idx++;
          stack.push(w);
          onStack.add(w);
          top.child = w;
          work.push({ v: w, pi: 0, child: null });
        } else if (onStack.has(w)) {
          lowlink.set(top.v, Math.min(lowlink.get(top.v), index.get(w)));
        }
        continue;
      }
      // Done with v: if it is an SCC root, pop the SCC.
      if (lowlink.get(top.v) === index.get(top.v)) {
        const comp = [];
        let w;
        do {
          w = stack.pop();
          onStack.delete(w);
          comp.push(w);
        } while (w !== top.v);
        sccs.push(comp);
      }
      work.pop();
    }
  }

  for (const n of INSIGHT_NODES) {
    if (!index.has(n.id)) strongconnect(n.id);
  }
  return sccs;
}

// Compute the cycle-baseline (size of largest SCC + number of non-trivial SCCs)
// for the pre-imp-1215 graph. This is recorded so the assertion below can
// detect REGRESSIONS introduced by future edits without forcing us to
// unwind a pre-existing legacy cycle (davenport-heilbronn -> euler-product
// closes a 9-cycle through the model layer; that cycle predates imp-1215 and
// is out of scope for this ticket).

function _nontrivialSCCs() {
  return _stronglyConnectedComponents().filter((c) => c.length > 1);
}

// Baseline pinned 2026-05-28 (imp-1215): the legacy DAG contains exactly
// TWO non-trivial SCCs:
//   (a) size-10 cycle through the foundation/model layer
//       (euler-product -> single-oscillator -> ladder-chain -> twin-ladder
//        -> connes-trace -> nyman-beurling -> li-criterion -> bridge-unitarity
//        -> davenport-heilbronn -> euler-product; selberg-trace also lands
//        inside this SCC via euler-product -> selberg-trace + selberg-trace
//        -> connes-trace).
//   (b) size-4 cycle through the analysis layer
//       (gue-statistics -> spectral-form-factor -> bost-connes ->
//        berry-keating -> gue-statistics).
// Both predate imp-1215 and are out of scope for this ticket (they originate
// from cross-cutting "inspires" / "analogous" edges that are pedagogically
// useful but structurally form back-edges). New imp-1215 nodes / edges are
// wired STRICTLY downstream of these cycles (they all point into the
// four-route / inverse-Blaschke / reciprocal / KYP / shift-bridge subgraph
// and forward to rh, never back to euler-product or gue-statistics), so the
// post-imp-1215 graph must still have AT MOST 2 non-trivial SCCs of
// total size AT MOST 14.
const _PRE_IMP1215_MAX_SCC_SIZE = 10;
const _PRE_IMP1215_NONTRIVIAL_SCC_COUNT = 2;
const _PRE_IMP1215_TOTAL_SCC_SIZE = 14;

export const INSIGHT_DAG_ASSERTIONS = [
  {
    id: 'insight-dag-no-new-cycles-from-imp1215',
    holds: () => {
      const scc = _nontrivialSCCs();
      if (scc.length > _PRE_IMP1215_NONTRIVIAL_SCC_COUNT) return false;
      const maxSize = scc.reduce((m, c) => Math.max(m, c.length), 0);
      if (maxSize > _PRE_IMP1215_MAX_SCC_SIZE) return false;
      const totalSize = scc.reduce((s, c) => s + c.length, 0);
      if (totalSize > _PRE_IMP1215_TOTAL_SCC_SIZE) return false;
      // Crucially: none of the new imp-1215 nodes may appear in any
      // non-trivial SCC. Their role in the DAG is strictly forward-flowing.
      const imp1215Nodes = new Set([
        'shift-bridge-positivity',
        'four-route-equivalence',
        'inverse-Blaschke-ghosts',
        'reciprocal-program',
        'KYP-bounded-real',
      ]);
      for (const comp of scc) {
        for (const id of comp) {
          if (imp1215Nodes.has(id)) return false;
        }
      }
      return true;
    },
    why:
      'imp-1215 invariant: the five new wave-11/12 nodes must not appear in ' +
      'any cycle, and adding them must not increase the cycle-baseline of ' +
      'the legacy graph. The legacy DAG has two pre-existing non-trivial ' +
      'SCCs (size 10 through euler-product / davenport-heilbronn / model ' +
      'layer; size 4 through gue-statistics / bost-connes / berry-keating / ' +
      'spectral-form-factor) for a total of 14 nodes in cycles. This ' +
      'assertion pins that baseline so any FUTURE edit that extends a cycle ' +
      'through the imp-1215 layer fires immediately. The legacy cycles are ' +
      'out of scope for imp-1215 and are left for a separate cleanup ticket.',
  },
  {
    id: 'insight-dag-edges-reference-known-nodes',
    holds: () => {
      const ids = new Set(INSIGHT_NODES.map((n) => n.id));
      return INSIGHT_EDGES.every((e) => ids.has(e.from) && ids.has(e.to));
    },
    why:
      'Every edge must reference node ids that exist in INSIGHT_NODES. ' +
      'Dangling edges would render as floating arrows in InsightGraph and ' +
      'silently mislead the reader about which dependencies are actually ' +
      'encoded.',
  },
  {
    id: 'insight-dag-node-ids-unique',
    holds: () => {
      const ids = INSIGHT_NODES.map((n) => n.id);
      return new Set(ids).size === ids.length;
    },
    why:
      'Duplicate node ids would cause the second copy to silently overwrite ' +
      'the first in any id-indexed render, hiding one of the two nodes.',
  },
  {
    id: 'insight-dag-imp1215-five-nodes-present',
    holds: () => {
      const required = [
        'shift-bridge-positivity',
        'four-route-equivalence',
        'inverse-Blaschke-ghosts',
        'reciprocal-program',
        'KYP-bounded-real',
      ];
      const ids = new Set(INSIGHT_NODES.map((n) => n.id));
      return required.every((id) => ids.has(id));
    },
    why:
      'imp-1215 added five wave-11/12 nodes for the twin-ladder v52 paper ' +
      'landing (shift-bridge-positivity, four-route-equivalence, ' +
      'inverse-Blaschke-ghosts, reciprocal-program, KYP-bounded-real). ' +
      'Removing any of them silently de-wires the v52 layer from the DAG.',
  },
  {
    id: 'insight-dag-imp1215-nodes-reach-rh',
    holds: () => {
      // Every imp-1215 node should reach 'rh' via some directed path.
      const adj = new Map();
      for (const n of INSIGHT_NODES) adj.set(n.id, []);
      for (const e of INSIGHT_EDGES) {
        if (adj.has(e.from)) adj.get(e.from).push(e.to);
      }
      function reaches(start, target) {
        const seen = new Set();
        const stack = [start];
        while (stack.length) {
          const x = stack.pop();
          if (x === target) return true;
          if (seen.has(x)) continue;
          seen.add(x);
          for (const y of adj.get(x) || []) stack.push(y);
        }
        return false;
      }
      return [
        'shift-bridge-positivity',
        'four-route-equivalence',
        'inverse-Blaschke-ghosts',
        'reciprocal-program',
        'KYP-bounded-real',
      ].every((id) => reaches(id, 'rh'));
    },
    why:
      'Each imp-1215 node must reach the rh target via some directed path ' +
      '(directly or through gap-s5/s7). A node disconnected from rh would ' +
      'be a dead branch in the proof chain and misrepresent the role of the ' +
      'twin-ladder v52 program.',
  },
  {
    id: 'insight-dag-private-proof-candidate-is-separate-from-C_H-lane',
    holds: () => {
      const candidate = INSIGHT_NODES.find(
        (node) => node.id === 'target-lambda-candidate-01787854'
      );
      const hasCandidateToRh = INSIGHT_EDGES.some(
        (edge) =>
          edge.from === 'target-lambda-candidate-01787854' &&
          edge.to === 'rh'
      );
      const hasCHToCandidateOrPeerBenchmark = INSIGHT_EDGES.some(
        (edge) =>
          edge.from === 'gap-CH-shock-holder' &&
          (
            edge.to === 'target-lambda-candidate-01787854' ||
            edge.to === 'target-lambda-PT'
          )
      );
      const peerBenchmark = INSIGHT_NODES.find(
        (node) => node.id === 'target-lambda-PT'
      );
      return (
        candidate &&
        candidate.status === 'candidate' &&
        candidate.countsAsEstablishedUpperBound === false &&
        candidate.repository === 'judegomila/dbn-lambda-01787854-candidate-audit' &&
        candidate.repositoryVisibility === 'private' &&
        candidate.tag === 'review-01787854-v3' &&
        candidate.commit === '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea' &&
        candidate.tree === '7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44' &&
        candidate.manifestSha256 ===
          '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c' &&
        candidate.description.includes('proof candidate') &&
        candidate.description.includes('not established') &&
        candidate.description.includes('unpublished') &&
        candidate.description.includes('unpeer-reviewed') &&
        candidate.description.includes('unaccepted') &&
        candidate.description.includes('not RH') &&
        peerBenchmark &&
        peerBenchmark.status === 'proven' &&
        peerBenchmark.accepted === true &&
        peerBenchmark.peerReviewed === true &&
        peerBenchmark.description.includes('peer-reviewed') &&
        hasCandidateToRh &&
        !hasCHToCandidateOrPeerBenchmark
      );
    },
    why:
      'The Home DAG must show 0.1787854 only as an unreviewed, unestablished proof ' +
      'candidate while keeping it and the accepted Platt-Trudgian benchmark independent ' +
      'of the legacy C_H lane.',
  },
  {
    id: 'insight-dag-status-and-category-valid',
    holds: () =>
      INSIGHT_NODES.every(
        (n) =>
          Object.prototype.hasOwnProperty.call(STATUS_COLORS, n.status) &&
          Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, n.category)
      ),
    why:
      'Every node\'s status and category must have a color mapping; ' +
      'otherwise the InsightGraph renderer would receive undefined fills and ' +
      'fall back to the default which hides the layer semantics.',
  },
];
