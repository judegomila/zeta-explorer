/**
 * @fileoverview route-48-phase-retrieval-zeta-2026-10-15 — roadmap route 48 (batch 10, group J): how much of ζ is determined by |ζ| on
 * vertical lines (the Hilbert-transform wall of imp-95530 B3 made quantitative). Tested on ζ and on the Davenport–Heilbronn twin. One worker
 * run plus one adversarial internal referee pass (independent zero finder, quadrature and mpmath roots; not refuted; severity minor:
 * Thm 48.1 product normalisation, Thm 48.5 wording for σ ≥ 1, 'all 8' completeness, grid minima, an unstated t ≤ 380 mask, the DH σ1 = 1.0
 * run outside Thm 48.3's hypothesis, a labelling nit). Corrections applied below.
 *
 * PROVED (classical-standard proofs, written, internal, not formalised; G* (s) := conj G(1 − s̄), B̃_ρ(s) := (s − (1 − ρ̄))/(s − ρ)):
 *  - Thm 48.1 (one line, no symmetry; CORRECTED form): G entire of order ≤ 1 with |G| = |ξ| on Re s = 1/2 ⇒ GG* ≡ ξξ*, and
 *    G = e^{iα + λ(s − 1/2)} ξ(s) ∏_{ρ ∈ S} B̃_ρ(s)/B̃_ρ(1/2), α, λ real, S any multiset of off-line zeros; the normalised product converges
 *    absolutely since Σ(2β − 1)|s − 1/2|/|ρ|² < ∞ (the un-normalised product needs S conjugation-closed or Σ_S (2β − 1)/|γ| < ∞). Finite order
 *    k: factor e^{iQ(−i(s − 1/2))}, Q real of degree ≤ k. Each off-line pair {ρ, 1 − ρ̄} takes multiplicities (1,1), (2,0), (0,2): 9
 *    configurations per off-line quadruple with identical |ζ| on the line.
 *  - Thm 48.2 (one line + FE + reality ⇒ ±ξ): G* = G gives G² = ξ², G = ±ξ; arg ζ(1/2 + it) = −θ(t) + π + π·#{odd-order zeros in (0, t)}.
 *    Either symmetry alone fails: ξ B̃_ρ B̃_{1−ρ} (FE, not reality) and ξ B̃_ρ B̃_{ρ̄} (reality, not FE).
 *  - Thm 48.3 (two lines, no FE; Poisson–Jensen on Re s > 1/2): for F = ζ(s)(s − 1)/s or F_DH, D(w) := log|F(w)| − P_w[log|F(1/2 + i·)|]
 *    = Σ_{β > 1/2} log|B_ρ(w)| ≤ 0; on a line Re w = σ1 right of every zero it determines all zeros with β > 1/2 (σ1 ≥ 1 for ζ; σ1 > 1.39514
 *    for DH).
 *  - Thm 48.4 (one line + one interior value; extends Balazard–Saias–Yor): J(a) = Σ_{β > 1/2} −log|B_ρ(a)| ≥ 0, = 0 iff no zeros right of the
 *    line; at a = 1 exactly BSY. Decides RH but cannot locate zeros (an off-line quadruple contributes ≈ 2δ/γ²).
 *  - Thm 48.5 (Hilbert / minimum phase; CORRECTED wording): for 1/2 ≤ σ < 1, F_σ = ζ(s)(s − 1)/(s + 1 − 2σ): arg F_σ(σ + it) =
 *    H_σ[log|ζ(σ + i·)|](t) + arg B_σ(σ + it), B_σ the Blaschke product over zeros with β > σ; exact iff no zeros right of σ (σ = 1/2: RH). At
 *    σ = 1 use F_1 = ζ(s)(s − 1)/s (Hilbert statement only); for σ > 1 use F = ζ itself (B ≡ 1; Bohr coefficients Λ(n)/(n^σ log n) of
 *    log|ζ(σ + it)|). Pair bound |arg B_{ρ,ρ̄}(1/2 + it)| ≤ 4tδ/(γ − t)², sharpened to 4tδ/(γ² − t²) (referee), for 0 < t < γ.
 * CERTIFIED: none (mpmath / double precision throughout).
 * CONDITIONAL: given the Lean-formalised 7/8 half-plane (openai/math 003, not peer-reviewed), the Hilbert transform recovers arg ζ(σ + it)
 *  exactly from |ζ(σ + i·)| on every line σ ≥ 7/8 (with the σ < 1 pole factor above; ζ itself for σ > 1). Unconditionally σ ≥ 1.
 *  Phase-defect bound (unconditional modulo Platt–Trudgian H = 3e12 and an explicit S(T) bound; quadrature not interval):
 *  |arg B(1/2 + it)| ≤ t·Σ_{γ > H}(γ − t)^{-2} ≈ 1.4797e-12·t, closed form (log(H/2π) + 1)/(2πH); vacuous for t ≳ H.
 * MEASURED: 1517 ζ line zeros (t ≤ 2000), 848 DH (t ≤ 1000). One-line J(1): ζ −4.4e-6 / 1.8e-6 / 3.1e-8 / −4.8e-8 at T = 250 / 500 / 1000 /
 *  2000 (≈ 0); DH 1.392e-4 / 1.583e-4 / 1.747e-4 vs 1.527e-4 from the 8 off-line zeros below 400 (referee 1.74722e-4, 1.52687e-4). Two-line D
 *  on σ1 = 1.5, 1.0, t ∈ [2, 400]: ζ |D| ≲ 3e-7 = truncation level (systematic offset, sign flips with cutoff; consistent with 0); DH grid
 *  minima −0.767 / −1.689 (0.25-step grid; exact at γ = 240.4047, σ1 = 1.0: −1.896). From the dips: 8 DH off-line zeros located below 400
 *  (0.80852 + 85.69935i, 0.65083 + 114.16334i, 0.57436 + 166.47931i, 0.72426 + 176.70246i, 0.86953 + 240.40467i, 0.81955 + 320.87649i,
 *  0.76822 + 331.05026i, 0.62851 + 366.64091i; Newton residuals ≤ 4e-14, referee mpmath ≤ 4e-25); β from dip depth within 3e-3; predicted −
 *  measured D ≤ 8.6e-4 / 4.3e-4 on t ≤ 380 only. Completeness to 400 corroborated by the count deficit (E ≈ −16 at t ≈ 400 = 8 pairs), NOT
 *  proved (threshold D < −0.02 misses δ ≲ 0.01). DH at σ1 = 1.0 is outside Thm 48.3 (DH has zeros with β > 1): pointwise identity only.
 *  Class-A ambiguity: 9^8 = 43,046,721 zero configurations below 400 with identical |F_DH| on the line; flipping ρ1 changes log|F| on σ1 = 1.5
 *  by 0.6378 (×1.89). DH count deficit ≈ −54.6 at t ∈ [950, 1000] (≈ 27 pairs; window means, no Turing count). σ = 2: Λ(n)/(n² log n),
 *  n ≤ 60, recovered from |ζ(2 + it)| to 4.1e-8.
 * HEURISTIC: FE-constrained conditioning margin ≈ local extremum of |Z| (Lehmer pair 7005.0629/7005.1006: 5.2e-4 relative; DH zero at 166.48:
 *  6.6e-3); not proved to be the minimal FE-preserving perturbation. The repo's pointwise Hilbert-transform wall = arg B from zeros above the
 *  verified height: ≈ 1.5e-12·t for t ≪ H, invisible pointwise without the FE, visible with the FE only through zero counting (Turing).
 *
 * Verdict: mapped. Without symmetry |ζ| on the critical line fixes ζ up to independent off-line flips ρ ↔ 1 − ρ̄ and e^{iα + λ(s − 1/2)} — the
 * Hilbert-transform wall stated exactly; FE + reality make phase retrieval trivial (±ξ); a second line right of the zeros locates them without
 * the FE. No Λ bound moves. PT Lambda <= 0.2 stands; RH open; NO QED. Import-free. ROUTE_48_ASSERTIONS recompute live: the DH zero-free
 * threshold (Hurwitz–Euler–Maclaurin + bisection), the phase-defect constant, the flip factor, the BSY sensitivity, the B̃ identities behind
 * Thm 48.1/48.2, the sharpened pair bound and the configuration count.
 */

const { abs, log, sqrt, PI, pow, atan, hypot } = Math;

export const ROUTE_48 = Object.freeze({
  id: 'route-48-phase-retrieval-zeta-2026-10-15',
  route: 48,
  date: '2026-10-15',
  title: 'Route 48: phase retrieval for ζ — |ζ| on the line fixes ζ up to off-line flips (the Hilbert-transform wall, exactly); FE + reality ⇒ ±ξ; a second line locates zeros',
  status: 'done',
  headline: 'With no symmetry assumed, |ζ| on Re s = 1/2 determines ζ exactly up to independent flips ρ ↔ 1 − ρ̄ of each off-line zero and a '
    + 'factor e^{iα + λ(s − 1/2)} (9 configurations per off-line quadruple). The functional equation plus reality makes it unique up to sign; either '
    + 'alone does not. |F| on a second line right of every zero locates all zeros with β > 1/2 without the FE (demonstrated on Davenport–Heilbronn: '
    + '8 off-line zeros below 400). Unconditionally the Hilbert phase on the critical line is off by ≲ 1.5e-12·t for t ≪ 3e12.',
  dh: Object.freeze({ kappa: 0.2840790438, zeroFreeSigma: 1.39514, lineZeros: 848, offline: Object.freeze([
    [0.80852, 85.69935], [0.65083, 114.16334], [0.57436, 166.47931], [0.72426, 176.70246],
    [0.86953, 240.40467], [0.81955, 320.87649], [0.76822, 331.05026], [0.62851, 366.64091]]),
  firstZeroPrecise: Object.freeze([0.8085171825, 85.6993484854]) }),
  zeta: Object.freeze({ lineZeros: 1517, J1: Object.freeze([[250, -4.4e-6], [500, 1.8e-6], [1000, 3.1e-8], [2000, -4.8e-8]]), maxAbsD: 3e-7 }),
  dhJ1: Object.freeze({ T: Object.freeze([250, 500, 1000]), J: Object.freeze([1.392e-4, 1.583e-4, 1.747e-4]), predBelow400: 1.527e-4, ref: Object.freeze([1.74722e-4, 1.52687e-4]) }),
  twoLine: Object.freeze({ dhGridMin: Object.freeze({ s15: -0.767, s10: -1.689 }), exactAt2404s10: -1.896, flipLog: 0.63781, betaTol: 3e-3, maskT: 380, threshold: -0.02 }),
  phaseDefect: Object.freeze({ H: 3e12, constant: 1.4797036e-12, at: Object.freeze([[1e3, 1.48e-9], [1e6, 1.48e-6], [1e9, 1.48e-3], [1e11, 0.153]]) }),
  configs: Object.freeze({ perQuadruple: 9, quadruplesBelow400: 8, total: 43046721 }),
  margins: Object.freeze({ lehmer7005: 5.2e-4, zetaMin2000: 3.5e-3, dh16648: 6.6e-3, dh8570: 8.7e-2 }),
  countDeficit: Object.freeze({ at400: -16, at950to1000: -54.6, pairsBelow1000: 27 }),
  bohr: Object.freeze({ sigma: 2, nMax: 60, T: 4000, maxErr: 4.1e-8 }),
  refereeKilled: Object.freeze([
    'Thm 48.1: the raw product ∏ B̃_ρ needs Σ_S (2β − 1)/|γ| < ∞ (unknown unconditionally) unless S is conjugation-closed; Σ(2β − 1)/|ρ|² is not enough; use the normalised factors B̃_ρ(s)/B̃_ρ(1/2)',
    'Thm 48.5: F_σ = ζ(s)(s − 1)/(s + 1 − 2σ) has a pole inside the half-plane for σ > 1; use ζ itself there; the Bohr-coefficient identity is for σ > 1 (σ = 1 overstated)',
    '"located ALL 8 DH off-line zeros below 400" is corroborated by the count deficit, not established by the detector (threshold D < −0.02 misses δ ≲ 0.01)',
    'ζ two-line max|D| 1.07e-7 is a systematic truncation offset (sign flips with cutoff), not a precision figure; ≲ 3e-7, consistent with 0',
    'DH min D values are 0.25-step grid minima (exact −1.896 at γ = 240.4047, σ1 = 1.0); predicted − measured ≤ 8.6e-4 holds on t ≤ 380 only',
    'DH run at σ1 = 1.0 is outside Thm 48.3 (DH has zeros with β > 1): pointwise identity, not determination of the Blaschke product',
    'labelling: the phase-defect bound is unconditional modulo the cited theorems (non-interval quadrature); pair bound sharpens to 4tδ/(γ² − t²)',
  ]),
  nextStep: '(1) Interval-certify the phase-defect constant (closed form plus the explicit S(T) terms in Arb) and the two-line detector with a '
    + 'rigorous truncation-tail bound. (2) Rigorous Turing-method count of DH off-line pairs below 1000 (replaces the window-mean ≈ 27). (3) Prove or '
    + 'refute "margin ≈ local extremum of |Z|" as the minimal FE-preserving modulus perturbation (link to Lehmer pairs / de Bruijn–Newman). '
    + '(4) Update the imp-95530 B3 Hilbert-transform-wall wording with Thm 48.1/48.5 (statement: the wall is arg B from zeros above the verified height).',
  files: Object.freeze(['tmp/routes-b10-r48-{core,post,aux,margin}.py', 'tmp/routes-b10-r48-out/{core,post,aux,margin,zeros}.json', 'tmp/routes-b10-r48-out/line-nodes.npz',
    'tmp/routes-b10-ref48-check.py', 'tmp/routes-b10-ref48-out/{check.json,check.log}']),
  verdict: 'Mapped; nothing moves Λ or RH. Without symmetry, |ζ| on the critical line fixes ζ up to independent off-line flips ρ ↔ 1 − ρ̄ and '
    + 'e^{iα + λ(s − 1/2)} (normalised Blaschke factors): the Hilbert-transform wall stated exactly. FE + reality give ±ξ (each alone fails); with the '
    + 'FE, off-line zeros appear only as zero-count deficits with Lehmer-pair-sized margins. A second line right of every zero locates the zeros without '
    + 'the FE (DH: 8 off-line zeros below 400, completeness corroborated, not proved). Hilbert phase on the critical line: ≲ 1.48e-12·t for t ≪ 3e12 '
    + '(unconditional modulo cited theorems); exact on σ ≥ 7/8 conditional on the 003 half-plane. The conditional value stays 0.116091488672439. '
    + 'PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R48 = ROUTE_48;
// Hurwitz zeta by Euler–Maclaurin (s real > 1, a ∈ (0, 1]).
const hz = (s, a, N = 200) => { let t = 0; for (let k = 0; k < N; k += 1) t += pow(k + a, -s); const x = N + a;
  return t + pow(x, 1 - s) / (s - 1) + pow(x, -s) / 2 + (s * pow(x, -s - 1)) / 12 - (s * (s + 1) * (s + 2) * pow(x, -s - 3)) / 720; };
const kappa = (sqrt(10 - 2 * sqrt(5)) - 2) / (sqrt(5) - 1);
const dhTail = (s) => pow(5, -s) * (hz(s, 0.2) + hz(s, 0.8)) - 1 + kappa * pow(5, -s) * (hz(s, 0.4) + hz(s, 0.6));
const C = (re, im = 0) => ({ re, im });
const csub = (a, b) => C(a.re - b.re, a.im - b.im);
const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const Bt = (rho, s) => cdiv(csub(s, C(1 - rho.re, rho.im)), csub(s, rho)); // (s − (1 − ρ̄))/(s − ρ)

export const ROUTE_48_ASSERTIONS = Object.freeze([
  {
    id: 'r48-dh-zero-free-threshold-live',
    holds: () => { let lo = 1.1; let hi = 2; for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (dhTail(m) > 1) lo = m; else hi = m; }
      return abs(lo - 1.3951362) < 1e-6 && abs(lo - R48.dh.zeroFreeSigma) < 1e-5 && abs(hz(2, 1) - (PI * PI) / 6) < 1e-12 && abs(kappa - R48.dh.kappa) < 1e-10; },
    why: 'Root of Σ_{n≥2}|a_DH(n)| n^{-σ} = 1 (period-5 coefficients 0, 1, κ, −κ, −1 via Hurwitz zeta) is σ = 1.3951362: |F_DH − 1| < 1 and F_DH ≠ 0 for σ > 1.39514 (Thm 48.3 line for DH).',
  },
  {
    id: 'r48-phase-defect-constant',
    holds: () => { const H = R48.phaseDefect.H; const c = (log(H / (2 * PI)) + 1) / (2 * PI * H);
      return abs(c - R48.phaseDefect.constant) < 1e-18 && R48.phaseDefect.at.slice(0, 3).every(([t, v]) => abs(c * t - v) / v < 0.01); },
    why: 'Phase-defect constant (log(H/2π) + 1)/(2πH) = 1.4797036e-12 at H = 3e12 (Platt–Trudgian), giving 1.48e-9 / 1.48e-6 / 1.48e-3 rad at t = 1e3 / 1e6 / 1e9.',
  },
  {
    id: 'r48-flip-factor',
    holds: () => { const [b, g] = R48.dh.firstZeroPrecise; const rho = C(b, g); const w = C(1.5, g);
      const v = Bt(rho, w); const flip = log(hypot(v.re, v.im)); return abs(flip - R48.twoLine.flipLog) < 1e-4 && abs(Math.exp(flip) - 1.89) < 0.01; },
    why: 'Flipping ρ1 = 0.80852 + 85.69935i to 1 − ρ̄1 changes log|F| on σ1 = 1.5 at height γ1 by log(1.3085/0.6915) = 0.6378 (×1.89): invisible on the critical line, visible on a second line.',
  },
  {
    id: 'r48-bsy-sensitivity',
    holds: () => { const d = 0.01; const g = 1e3; const contrib = log((0.5 + d) ** 2 + g * g) - log((0.5 - d) ** 2 + g * g);
      return abs(contrib - 2e-8) < 1e-10 && abs(contrib - (2 * d) / (g * g)) < 1e-11; },
    why: 'One-line J(1) sensitivity: an off-line quadruple (ρ, ρ̄ with β = 1/2 + δ) contributes Σ −log|B_ρ(1)| = log(((1/2+δ)² + γ²)/((1/2−δ)² + γ²)) ≈ 2δ/γ² = 2.0e-8 at γ = 1e3, δ = 0.01.',
  },
  {
    id: 'r48-blaschke-identities',
    holds: () => { const rho = C(0.7, 31.5); const s = C(0.3, 12.25); const oneMinus = (z) => C(1 - z.re, -z.im);
      const a = Bt(rho, oneMinus(s)); const b = Bt(C(1 - rho.re, -rho.im), s); // B̃_ρ(1 − s) = B̃_{1−ρ}(s)
      const lhs = Bt(rho, s); const rhs = C(1 + cdiv(C(2 * rho.re - 1, 0), csub(s, rho)).re, cdiv(C(2 * rho.re - 1, 0), csub(s, rho)).im); // 1 + (2β − 1)/(s − ρ)
      const onLine = Bt(rho, C(0.5, 7)); const onLineConj = Bt(C(rho.re, -rho.im), C(0.5, 7));
      return abs(a.re - b.re) < 1e-12 && abs(a.im - b.im) < 1e-12 && abs(lhs.re - rhs.re) < 1e-12 && abs(lhs.im - rhs.im) < 1e-12
        && abs(hypot(onLine.re, onLine.im) - 1) < 1e-12 && abs(hypot(onLineConj.re, onLineConj.im) - 1) < 1e-12; },
    why: 'B̃_ρ(1 − s) = B̃_{1−ρ}(s) (the FE-not-reality counterexample of Thm 48.2), B̃_ρ(s) = 1 + (2β − 1)/(s − ρ) (why the raw product needs Σ(2β−1)/|γ| < ∞), and |B̃_ρ| = 1 on Re s = 1/2 (flips are invisible on the line).',
  },
  {
    id: 'r48-pair-bound-sharpening',
    holds: () => [[100, 0.2, 50], [1000, 0.05, 900], [85.7, 0.3085, 10]].every(([g, d, t]) => { const exact = atan(d / (g - t)) - atan(d / (g + t));
      const sharp = (2 * t * d) / (g * g - t * t); const route = (4 * t * d) / (g - t) ** 2; return exact > 0 && exact <= sharp + 1e-15 && 2 * sharp <= route + 1e-15; }),
    why: 'arctan(δ/(γ−t)) − arctan(δ/(γ+t)) ≤ 2tδ/(γ² − t²), so the pair bound 4tδ/(γ² − t²) (referee) holds and is below the route\'s 4tδ/(γ − t)².',
  },
  {
    id: 'r48-config-count-and-data',
    holds: () => { const c = R48.configs; const z = R48.zeta.J1; return c.perQuadruple ** c.quadruplesBelow400 === c.total && R48.dh.offline.length === c.quadruplesBelow400
      && R48.dh.offline.every(([b, g]) => b > 0.5 && b < 1 && g < 400) && abs(z[z.length - 1][1]) < 1e-7 && R48.dhJ1.J[2] > R48.dhJ1.predBelow400
      && abs(R48.countDeficit.at400 / -2 - c.quadruplesBelow400) < 1e-12 && abs(R48.countDeficit.at950to1000 / -2 - R48.countDeficit.pairsBelow1000) < 0.5; },
    why: '9^8 = 43,046,721 configurations from 8 DH off-line quadruples below 400 (all with 1/2 < β < 1); ζ J(1) ≈ 0 at T = 2000; DH J(1) exceeds the below-400 prediction (zeros in 400–1000); count deficit −16 at 400 = 8 pairs, −54.6 ≈ 27 pairs.',
  },
  {
    id: 'r48-honesty',
    holds: () => /PT Lambda <= 0\.2 stands/.test(R48.verdict) && /NO QED/.test(R48.verdict) && /not proved/.test(R48.verdict)
      && /0\.116091488672439/.test(R48.verdict) && R48.refereeKilled.length === 7,
    why: 'Verdict: map, completeness of the DH zero list corroborated not proved, conditional value unchanged, no QED; seven referee corrections recorded.',
  },
]);

export default ROUTE_48;
