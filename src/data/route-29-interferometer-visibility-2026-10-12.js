/**
 * @fileoverview route-29-interferometer-visibility-2026-10-12 — roadmap route 29 (batch 7, group E): does a finite-height visibility bound
 * on the twin-ladder interferometer give an RH-equivalent or a genuinely weaker statement? Closed negative. One run plus one adversarial
 * internal referee pass with independent scripts (not refuted; severity minor). The referee corrections are applied below.
 *
 * PROVED (classical / elementary): (a) Split at the bridge's self-dual point x = 1: Λ_F(s) = A_F(s) + A_F(1−s); ζ: A(s) = −1/s + Σ_n (πn²)^{−s/2}
 *  Γ(s/2, πn²); DH: A(s) = Σ_n n a(n) (πn²/5)^{−(s+1)/2} Γ((s+1)/2, πn²/5), a(n mod 5) = (0, 1, κ, −κ, −1). Visibility V = 2|A(s)||A(1−s)| /
 *  (|A(s)|² + |A(1−s)|²), V := 1 where both arms vanish. (b) Dark-fringe lemma: Λ(ρ) = 0 ⇒ V(ρ) = 1, so sup V < 1 off the line is SUFFICIENT for
 *  no off-line zeros there. (c) With u = Λ/A: V = 1 iff |u − 1| = 1, and 1 − V = (|A| − |Λ − A|)²/(|A|² + |Λ − A|²) ≤ |Λ|²/(|A|² + |Λ − A|²):
 *  visibility encodes ONE real condition, a zero needs TWO. (d) Theorem A (exact arms ζ(s), ζ(1−s), the glossary's Mach–Zehnder picture):
 *  V0 = 2|χ|/(1 + |χ|²) = sech(log|χ|), a function of the gamma factor alone — VACUOUS; its zero-evaluated form ⇔ RH only by reparametrisation
 *  (d/dσ log|χ| < 0 for t ≥ 6.5 (ζ) / 1.5 (DH), Arb on t ≤ 100; for t > 100 from Re ψ(s/2) ~ log(t/2) > log π, asserted not certified).
 *  (e) Theorem B (gauge, referee-corrected): A → A + O with O(1−s) = −O(s) changes V; A = Λ/2 gives V ≡ 1 (bound false everywhere); A = wΛ with
 *  w(s) + w(1−s) = 1 gives V = 1 exactly at the zeros (convention V := 1 at common zeros), so the bound is tautologically "no zeros in the region".
 *  The strength of a visibility bound is a gauge choice; the gauge-invariant content is Λ. (f) Arm asymptotics: A_ζ(s) = −θ3(e^{−π})/s +
 *  4ψ'(1)/(s(s+2)) + O(t^{−3}), θ3(e^{−π}) = π^{1/4}/Γ(3/4) = 1.0864348112; A_DH(s) = −2θ1_DH(1)/(s+1) + O(t^{−2}), θ1_DH(1) = 0.5763549565.
 *  Each arm is ~1/t while Λ ~ e^{−πt/4}: deep destructive interference everywhere in the strip.
 * CERTIFIED (Arb): split identities to 1.75e-110 (ζ) / 7.9e-80 (DH) at 400 bits; bridge monotonicity (132,184 / 21,425 boxes, 0 failures); the
 *  pointwise bound is FALSE: certified V = 1 crossings on every tested line t ∈ [2, 200] — ζ 79 on δ = 0.02 … 1.0 (= N(200)), DH 129 on δ = 0.02,
 *  0.3085, 1.0 (256-bit, 0 uncertified), including σ = 1.5 where no zeros exist; first fringe 15.47 (ζ), 6.58 (DH). Counts are certified LOWER
 *  bounds (sign changes on a step-0.01 grid; referee step 0.02 agrees).
 * CONDITIONAL / LITERATURE: crossing lower bound N(T) − O(log T) per line σ = c > ½ (outline only, referee agrees with the outline); phase repair
 *  "arg u increasing in t for every c > ½" is Re Λ'/Λ > 0, which differs from Lagarias' Re ξ'/ξ > 0 by Re(1/s + 1/(s−1)) > 0 (slightly stronger).
 * MEASURED: max 1 − V on t ∈ [30, 200]: ζ 1.8e-21 … 2.8e-18, DH 2.8e-19 … 8.6e-16; interlacing: ζ one fringe per zero gap (79/79, σ = 0.52, 0.7);
 *  DH gap histogram {0: 2, 1: 117, 3: 4} with the four 3-crossing gaps exactly at the off-line heights 85.70, 114.16, 166.48, 176.70; referee
 *  argument-principle count N_DH(200) = 130 = 122 on-line + 8 off-line. Mechanism (referee): for δ → 0 the fringes converge to the critical
 *  points of Ξ_F(t) = Λ_F(½+it) (ζ, σ = 0.52, t ≤ 100: 29/29 within 0.005–0.085), so small-δ interlacing is the Laguerre–Pólya consequence of RH
 *  and the DH triples are the classical extra-extremum signature of off-line zeros; at large δ (σ = 1.5) interlacing fails like Gram's law.
 * HEURISTIC: integrated deficit is zero-blind (1 − V = O(t² e^{−πt/2}) pointwise; no functional or theorem stated — moved from the verdict's
 *  classification); the Mach–Zehnder glossary entry "RH = dark fringes on the max-visibility line" is a gamma-factor reparametrisation;
 *  Riemann–Siegel splits are one more gauge.
 *
 * No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_29_ASSERTIONS recompute live: θ3(e^{−π}) by series and as
 * π^{1/4}/Γ(3/4), the identity θ(1)/2 = 4|ψ'(1)|, θ1_DH(1) from κ, V0 = sech(log|χ|), the sign of d/dσ log|χ| by complex digamma (positive at
 * t = 6, negative from 6.5), N(200) = 79 by Riemann–von Mangoldt, and the DH gap/crossing bookkeeping.
 */

const { PI, abs, sqrt, log, exp, sin, cosh } = Math;

export const ROUTE_29 = Object.freeze({
  id: 'route-29-interferometer-visibility-2026-10-12',
  route: 29,
  date: '2026-10-12',
  title: 'Route 29: interferometer visibility — vacuous, false, or a gauge choice; never a non-tautological RH-equivalent',
  status: 'done',
  headline: 'No visibility bound on the twin-ladder interferometer is a non-tautological RH-equivalent. The exact-arm (glossary) version depends '
    + 'on the gamma factor alone (vacuous); the pointwise bound on the canonical split is sufficient but certified FALSE for both ζ and DH up to t = 200 '
    + '(fringes cross every vertical line, even σ = 1.5); visibility is gauge-dependent and its gauge-invariant content is Λ, whose phase reduces '
    + 'to Lagarias\' criterion or the Turing count.',

  constants: Object.freeze({ theta3: 1.0864348112133080, fourAbsPsiPrime1: 0.543217, theta1DH: 0.5763549564928602 }),
  split: Object.freeze({ zetaErr: 1.75e-110, dhErr: 7.9e-80, bits: 400, refereeMpmath: 3.1e-43 }),
  bridgeMonotone: Object.freeze({ zetaTFrom: 6.5, dhTFrom: 1.5, tTo: 100, zetaBoxes: 132184, dhBoxes: 21425, failures: 0 }),
  crossings: Object.freeze({ T: 200, zetaPerLine: 79, zetaDeltas: Object.freeze([0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 1.0]), dhPerLine: 129,
    dhDeltas: Object.freeze([0.02, 0.3085, 1.0]), firstFringe: Object.freeze({ zeta: 15.47, dh: 6.58 }), gridStep: 0.01, refereeStep: 0.02 }),
  deficit: Object.freeze({ zeta: Object.freeze([[0.52, 1.8e-21], [0.7, 1.8e-19], [1.5, 2.8e-18]]), dh: Object.freeze([[0.52, 2.8e-19], [0.8085, 6.9e-17], [1.5, 8.6e-16]]) }),
  interlacing: Object.freeze({ dhOnLine: 122, dhOffLineHeights: Object.freeze([85.70, 114.16, 166.48, 176.70]), dhGapHistogram: Object.freeze({ 0: 2, 1: 117, 3: 4 }),
    dhTripleGaps: Object.freeze([[83.11, 87.65], [112.38, 116.72], [164.16, 168.32], [174.60, 178.17]]), argPrincipleNdh200: 130, argPrincipleNdh100: 54,
    zetaCritPointOffsets: Object.freeze({ count: 29, min: 0.005, max: 0.085 }), zetaSigma15DefectPairs: Object.freeze(['107–112', '182–186']) }),
  dhOffLineZero: Object.freeze({ rho1: Object.freeze([0.808517182456637, 85.6993484853776]), oneMinusV: 4.75e-74 }),

  refereeKilled: Object.freeze([
    'interlacing mechanism wrong: near the line the V = 1 fringes are the critical points of Ξ_F(t) = Λ_F(½+it) (ζ, σ = 0.52: 29/29 within 0.005–0.085), so small-δ interlacing is the Laguerre–Pólya consequence of RH and the DH 3-crossing gaps are the classical extra-extremum signature of off-line zeros; "Gram-law-like" applies only at large δ (σ = 1.5)',
    'Theorem B wording: with the convention V := 1 at common zeros, the gauge A = wΛ makes the bound tautologically "no zeros in the region", not "satisfied trivially"',
    'part (3) "integrated deficit = WEAKER" not proved (no functional or target bound defined) — moved to heuristic',
    '1 − V(ρ1) ∈ [± 4.75e-74] carries no evidence (1 − V is exponentially small everywhere at that height); the fringe through ρ1 rests on the dark-fringe lemma',
    'Theorem A tautology for t > 100 relies on d/dσ log|χ| < 0 by Stirling, asserted not certified (true: Re ψ(s/2) ~ log(t/2) > log π)',
    'crossing counts are certified LOWER bounds (grid sign changes); "exactly one per gap" is grid-measured; ζ has 80 gaps including [2, 14.13] with 0 crossings; only δ = 0.02, 0.2, 1.0 were rerun with the recorded precision file',
    'phase repair is Re Λ\'/Λ > 0, which differs from Lagarias\' Re ξ\'/ξ > 0 by Re(1/s + 1/(s−1)) > 0 (slightly stronger)',
  ]),
  nextStep: 'Nothing here warrants more Λ/RH compute. Optional: (a) explicit constants for the crossing lower bound N(T) − O(log T) per line and an internal '
    + 'referee; (b) correct the glossary Mach–Zehnder entry (src/data/glossary.js: "RH = dark fringes on the line of maximum visibility") to state that '
    + 'the maximum-visibility line is fixed by the gamma factor alone, citing this module.',
  files: Object.freeze(['tmp/routes-b7-r29-visibility/r29_lib.py', 'tmp/routes-b7-r29-visibility/r29_check_identities.py', 'tmp/routes-b7-r29-visibility/r29_scan.py',
    'tmp/routes-b7-r29-visibility/r29_scan_dh_T200_p256_t2.json', 'tmp/routes-b7-r29-visibility/r29_bridge_monotone2.py', 'tmp/routes-b7-r29-visibility/r29_interlace.py',
    'tmp/routes-b7-r29-visibility/r29_diag.py', 'tmp/routes-b7-ref29/ref29_mpcheck.py', 'tmp/routes-b7-ref29/ref29_check.py', 'tmp/routes-b7-ref29/ref29_dhcount.py',
    'tmp/routes-b7-ref29/ref29_crit.py']),
  verdict: 'Route 29 is closed negative. (1) Exact arms ζ(s), ζ(1−s): VACUOUS, V0 = sech(log|χ|) is a gamma-factor reparametrisation. (2) Canonical '
    + 'smoothed split, pointwise sup V < 1 off the line: sufficient for no off-line zeros but certified FALSE for ζ and DH up to t = 200 on every tested '
    + 'line, including σ = 1.5. (3) Integrated deficit: exponentially small and plausibly zero-blind (heuristic; no theorem stated). (4) Visibility is '
    + 'gauge-dependent; the gauge-invariant content is Λ, and phase repairs collapse onto Lagarias\' criterion or the Turing N_0 = N count. Fringe-zero '
    + 'interlacing near the line is the Laguerre–Pólya consequence of RH, not a new criterion. ζ and DH have the same visibility structure. No Λ bound '
    + 'moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_29;
const g7 = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
const gammaR = (x) => { if (x < 0.5) return PI / (sin(PI * x) * gammaR(1 - x)); const y = x - 1; let s = g7[0];
  for (let i = 1; i < 9; i += 1) s += g7[i] / (y + i); const t = y + 7.5; return sqrt(2 * PI) * t ** (y + 0.5) * exp(-t) * s; };
const cdigammaRe = (x0, y) => { let x = x0; let rr = 0; while (x < 15) { rr -= x / (x * x + y * y); x += 1; }
  const d = x * x + y * y; const izr = x / d; const izi = -y / d; let r = 0.5 * log(d) - 0.5 * izr;
  const z2r = izr * izr - izi * izi; const z2i = 2 * izr * izi; let pr = z2r; let pi = z2i;
  for (const c of [1 / 12, -1 / 120, 1 / 252, -1 / 240, 1 / 132]) { r -= c * pr; const nr = pr * z2r - pi * z2i; pi = pr * z2i + pi * z2r; pr = nr; }
  return r + rr; };
const dLogChiZeta = (s, t) => log(PI) - 0.5 * cdigammaRe(s / 2, t / 2) - 0.5 * cdigammaRe((1 - s) / 2, -t / 2);
const kappa = (sqrt(10 - 2 * sqrt(5)) - 2) / (sqrt(5) - 1);

export const ROUTE_29_ASSERTIONS = Object.freeze([
  {
    id: 'r29-theta-constants',
    holds: () => { let th = 1; let dps = 0; for (let n = 1; n < 10; n += 1) { th += 2 * exp(-PI * n * n); dps += PI * n * n * exp(-PI * n * n); }
      return abs(th - R.constants.theta3) < 1e-14 && abs(PI ** 0.25 / gammaR(0.75) - R.constants.theta3) < 1e-12
        && abs(4 * dps - th / 2) < 1e-14 && abs(4 * dps - R.constants.fourAbsPsiPrime1) < 1e-6; },
    why: 'θ3(e^{−π}) = 1 + 2Σe^{−πn²} = π^{1/4}/Γ(3/4) = 1.0864348112; θ(1/x) = √x θ(x) gives θ(1)/2 = 4|ψ\'(1)| = 0.543217 (the t^{−2} cancellation of the ζ arm on the line).',
  },
  {
    id: 'r29-theta1-dh',
    holds: () => { const a = [0, 1, kappa, -kappa, -1]; let s = 0; for (let n = 1; n < 40; n += 1) s += n * a[n % 5] * exp((-PI * n * n) / 5);
      return abs(s - R.constants.theta1DH) < 1e-14 && abs(kappa - 0.284079043840412) < 1e-14; },
    why: 'θ1_DH(1) = Σ n a(n) e^{−πn²/5} = 0.5763549565 with κ = (√(10 − 2√5) − 2)/(√5 − 1) = 0.28407904384: the DH arm leading coefficient.',
  },
  {
    id: 'r29-v0-is-sech-log-chi',
    holds: () => [0.01, 0.3, 1, 2.7, 50].every((x) => abs((2 * x) / (1 + x * x) - 1 / cosh(log(x))) < 1e-14),
    why: 'Theorem A: V0 = 2|χ|/(1 + |χ|²) = sech(log|χ|) for every |χ| > 0 — a function of the gamma factor alone.',
  },
  {
    id: 'r29-bridge-monotone-onset',
    holds: () => [0, 0.5, 1].every((s) => dLogChiZeta(s, 6) > 0 && dLogChiZeta(s, 6.5) < 0 && dLogChiZeta(s, 50) < 0 && dLogChiZeta(s, 1000) < 0)
      && abs(dLogChiZeta(0.5, 1000) - (log(PI) - log(500))) < 1e-3 && R.bridgeMonotone.failures === 0,
    why: 'd/dσ log|χ(σ+it)| = log π − ½Re ψ(s/2) − ½Re ψ((1−s)/2): positive at t = 6, negative at t = 6.5 (matches the Arb onset 6.5), ≈ log π − log(t/2) for large t.',
  },
  {
    id: 'r29-zeta-crossings-equal-N200',
    holds: () => { const T = R.crossings.T; const N = (T / (2 * PI)) * log(T / (2 * PI * Math.E)) + 7 / 8; return Math.round(N) === R.crossings.zetaPerLine
      && R.crossings.zetaDeltas.length === 7 && R.crossings.firstFringe.zeta > 14.134725 && R.crossings.refereeStep === 2 * R.crossings.gridStep; },
    why: 'Riemann–von Mangoldt N(200) ≈ (T/2π)log(T/2πe) + 7/8 = 79.2 → 79 = certified fringes per line; first ζ fringe 15.47 sits just above γ1 = 14.13.',
  },
  {
    id: 'r29-dh-bookkeeping',
    holds: () => { const i = R.interlacing; const h = i.dhGapHistogram; const gaps = h[0] + h[1] + h[3]; const cross = h[1] + 3 * h[3];
      return gaps === i.dhOnLine + 1 && cross === R.crossings.dhPerLine && i.dhOnLine + 2 * i.dhOffLineHeights.length === i.argPrincipleNdh200
        && i.dhTripleGaps.every(([a, b], k) => a < i.dhOffLineHeights[k] && i.dhOffLineHeights[k] < b)
        && abs(R.dhOffLineZero.rho1[1] - i.dhOffLineHeights[0]) < 0.01 && i.zetaCritPointOffsets.max < 0.1; },
    why: '122 on-line zeros → 123 gaps {0: 2, 1: 117, 3: 4} carrying 117 + 12 = 129 fringes; 122 + 2·4 off-line = 130 = argument-principle N_DH(200); each triple gap contains one off-line height.',
  },
  {
    id: 'r29-honest-scope',
    holds: () => R.status === 'done' && /closed negative/.test(R.verdict) && /Laguerre–Pólya/.test(R.verdict) && /heuristic/.test(R.verdict)
      && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && R.refereeKilled.length === 7
      && R.deficit.zeta.concat(R.deficit.dh).every(([, d]) => d < 1e-15),
    why: 'Negative classification; integrated-deficit claim heuristic; interlacing attributed to Laguerre–Pólya; deficits exponentially small; no Λ change; no QED.',
  },
]);

export default ROUTE_29;
