/**
 * @fileoverview route-18-local-levinson-pair-correlation-2026-10-10 — roadmap route 18 (batch 5): local Levinson conditional on pair
 * correlation / GUE statistics, and whether a window certificate can supply the local count H_desc-mirror needs.
 * One run plus one adversarial internal referee pass (not refuted; severity minor); the referee corrections are applied below.
 *
 * PROVED (elementary, unconditional): insensitivity lemma — a normalised pair or n-level statistic P_T(f) with fixed bounded compactly
 *  supported f changes by O(H (log T)^{c_n} / T) when zeros inside windows of total length H are changed; so "P_T = GUE + O(T^{−δ})" is
 *  consistent with any rearrangement in windows shorter than ≈ T^{1−δ} (any o(T) window for an o(1) error), including moving zeros into
 *  off-line pairs; ordinate-only statistics carry no β information. This is a point-set statement (referee): it does NOT show that pair
 *  correlation combined with ζ's analytic structure implies nothing — no non-implication theorem. Count lemma (under B1's hypotheses):
 *  M_t(z) ≥ Σ_W [N_0(W) min 2y/(D² + y²) + (N(W) − N_0(W)) min k′(D)], best possible from per-window counts. GUE Palm density given a
 *  coalesced pair ρ(u) = 1 − S² − 3S′²/π², deficit integral exactly 2 (Parseval). Linearised zero-ODE mode rate (4/s²)(πθ/2 − θ²/4) (Clausen).
 * CERTIFIED: nothing.
 * CONDITIONAL: everything about Λ goes through B1 (H_desc-mirror ⇒ Λ ≤ t0 + y0²/2; P15 Thm 1.2 (i)(ii); flagged residuals). Analytic
 *  tiers T^{1/6+ε} (positivity) and T^{27/82+ε} (proportion) are recalled, not source-checked. Persistence of real zeros forward in t
 *  is recalled (drift ignored).
 * MEASURED (float64; frozen-neighbour model at t = 0 transplanted to the seam): GUE double-point Palm mirror count 3.021 vs lattice
 *  2-slot 2.529, 1-slot 3.854, p_req 4.3743; profile descent GUE 0.1173, lattice 0.1204 vs t0 = 0.1314; required multiple of the lattice
 *  profile c* = 0.882 (0.850 of the GUE profile); CUE_256 close pairs 0.42% (26/6170) fail the profile criterion; ζ zeros #500001–#1e6
 *  0/6950 close pairs (0/27287 at gap < 0.40) fail; close-pair density ±2/±4/±8: CUE 1.064/1.013/1.003, ζ 1.035/1.005/0.999.
 *  Loss-free count certificate (referee-corrected): lattice passes generically only for w ≤ 2 spacings (w = 3 passes in 12% of grid
 *  offsets, an edge-alignment artefact; w = 4 in 0%); GUE-mean counts w ≤ 4 (0.1305); ζ close pairs 100% at w ≤ 1, 88% w = 2, 85% w = 3,
 *  25% w = 4, 0.4% w = 6, 0% w ≥ 8.6; passing at w = 8.6 / 16 would need 1.59× / 2.49× the true count (impossible, N_0 ≤ N).
 *  κ = 2/3 loss-free passes only at w ≤ 1 (lattice) / ≤ 2 (GUE). Constant-p form fails at every w even loss-free (best 2.79 < 4.37).
 * HEURISTIC: linearised relaxation damping by t0 at wavelength 2 / 8 / 16 spacings: 0.0026 / 0.074 / 0.25 (linearisation about a lattice,
 *  not valid for O(1) GUE fluctuations at short wavelength; moved here from "conditional" by the referee). Pair correlation does not
 *  strengthen the short-interval mollified mean square or O(1) boundary losses (structural, no theorem). A near-double zero costs a window
 *  certificate ≈ 2 zeros. GUE conditioned on an off-line pair is an extrapolation; typical-site failure rates do not control every site.
 *
 * Prior result now cited (referee): rh-bridge-mirror-descent C2 already shows the profile descent FAILS at worst-case sites — 0.140 at the
 * 1e12 location-free minima, 0.144–0.154 under GUE largest-gap extrapolation to ≈ 4e17 zeros (vs t0 = 0.1314). So "neutral counts
 * suffice" holds for typical and close-pair sites only, not every site. The profile form is already B1's statement and C1 already gives
 * Λ ≈ 0.132 for the neutral Palm profile; new here are c* = 0.882 and the window-resolution requirement.
 *
 * No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_18_ASSERTIONS recompute the seam spacing, lattice 1- and
 * 2-slot mirror counts (closed forms), p_req, the lattice profile descent and c*, the GUE Palm count and deficit 2 by quadrature, the
 * GUE descent, the window tiers and δ thresholds, and the Clausen damping factors live.
 */

const { PI, log, exp, tanh, sin, cos, abs } = Math;

export const ROUTE_18 = Object.freeze({
  id: 'route-18-local-levinson-pair-correlation-2026-10-10',
  route: 18,
  date: '2026-10-10',
  title: 'Route 18: local Levinson under pair correlation — closed as a map; a count certificate would need ≈ 1–4-spacing loss-free resolution',
  status: 'done',
  headline: 'As an ordinate-only statistic, pair correlation or GUE n-level correlation is consistent with any rearrangement of zeros in windows of length '
    + 'o(T) (or ≈ T^{1−δ}) and carries no β information; no known mechanism combines it with Levinson to shorten the certifiable window (structural '
    + 'observation, not a non-implication theorem). Even a perfect window certificate feeds H_desc-mirror only at ≈ 2 (lattice, generic) to 4 (GUE mean) '
    + 'spacings loss-free — checking zeros one by one near each site.',

  seam: Object.freeze({ T: 3e12, y0: 0.165, t0: 0.1314, pReq: 4.3743 }),
  mirror: Object.freeze({ gueDoublePoint: 3.021, lattice2slot: 2.529, lattice1slot: 3.854, gueAtN1star: 5.024, latticeAtN1star: 4.421 }),
  descent: Object.freeze({ gue: 0.1173, lattice: 0.1204, cStarLattice: 0.882, cStarGUE: 0.850 }),
  closePairs: Object.freeze({
    cue: Object.freeze({ n: 6170, fail: 26, reachPreq: 0.023, meanM: 3.011 }),
    zeta: Object.freeze({ n: 6950, fail: 0, maxDescent: 0.1291, nWide: 27287, failWide: 0, maxDescentWide: 0.1299, meanM: 2.858 }),
    density: Object.freeze({ cue: Object.freeze([1.064, 1.013, 1.003]), zeta: Object.freeze([1.035, 1.005, 0.999]) }),
  }),
  countCertificate: Object.freeze({
    latticeGenericMaxW: 2, latticeOffsetPass: Object.freeze({ 2: 1.0, 3: 0.12, 4: 0 }), latticeW3Symmetric: 0.1600, gueMeanMaxW: 4, gueW4: 0.1305,
    zetaPassByW: Object.freeze([[1, 1.0], [2, 0.88], [3, 0.85], [4, 0.25], [6, 0.004], [8.6, 0]]),
    factorNeeded: Object.freeze({ 8.6: 1.59, 16: 2.49 }), kappa23MaxW: Object.freeze({ lattice: 1, gue: 2 }), constantPBest: 2.79,
  }),
  priorC2: Object.freeze({ worst1e12: 0.140, gueLargestGap: Object.freeze([0.144, 0.154]) }),
  ns3locallev: Object.freeze({ allFixed: Object.freeze([20, 48, 40]), allPerWindow: Object.freeze([16, 48, 32]), kappaW: Object.freeze([0.288, 0.351]),
    extrapolation: Object.freeze([61, 1103]) }),
  damping: Object.freeze([[2, 0.0026], [8, 0.074], [16, 0.25]]),
  tiers: Object.freeze({ positivity: Object.freeze([514, 3826]), proportion: Object.freeze([54924, 2.12e6]), deltaHdesc: Object.freeze([0.9757, 0.9903]),
    deltaBeat2782: 55 / 82, deltaBeat16: 5 / 6, hdescWindow: 8.6 }),

  refereeKilled: Object.freeze([
    'overclaim: "pair correlation adds nothing provable" / "no shorter window is provable" — the insensitivity lemma is a point-set statement (a rearranged point set is not a zeta-like function); corrected to "no known mechanism; structural observation, not a non-implication theorem"',
    'lattice artefact: loss-free lattice certificate "passes for w ≤ 3" (0.1289) came from window edges landing on lattice points; symmetric edges give 0.1600 (fails); over 60 grid offsets w = 2 passes 100%, w = 3 12%, w = 4 0% — generic threshold w ≤ 2',
    'omitted prior result: rh-bridge-mirror-descent C2 already has the profile descent failing at worst-case sites (0.140 at 1e12 minima; 0.144–0.154 GUE largest-gap extrapolation); "neutral counts suffice" holds for typical/close-pair sites only',
    'novelty overstated: the profile form is B1\'s statement and C1 already gives Λ ≈ 0.132 for the neutral Palm profile; new are c* = 0.882 and the resolution requirement',
    'mixed rows: ns3-locallev every-window figures are 20/48/40 (fixed parameters) and 16/48/32 (per-window best), not 16/48/40, and not a T-scaling',
    'tier: linearised relaxation damping moved from conditional to heuristic; "pair correlation says nothing about H_t zeros" softened to "no pair-correlation theorem for H_t is known"',
    'δ thresholds are necessary conditions for resolving counts/positions only (ordinate statistics are β-blind at every window length); 0.1289 and 0.175/0.169 are the K_1-kernel script values (plain: 0.1284, 0.1736/0.1682)',
  ]),
  nextStep: '(1) Record c* = 0.882 next to B1/C1 in the mirror-descent module (profile form: M_t ≥ 0.88× the neutral lattice profile at every off-line zero). '
    + '(2) Evolve a sample of ζ close-pair and largest-gap configurations under the complex-pair flow at seam density over t ∈ (0, 0.1314] and measure the '
    + 'worst profile deficit against c*; with C2 already failing at worst-case sites in the frozen model, a t > 0 failure would retire the H_desc-mirror '
    + 'route outright. (3) No further Levinson / pair-correlation work on this route.',
  files: Object.freeze(['tmp/routes-b5-r18-work/r18_gue_palm.py', 'tmp/routes-b5-r18-work/r18_closepair_mirror.py', 'tmp/routes-b5-r18-work/r18_count_certificate.py',
    'tmp/routes-b5-r18-work/r18_count_certificate_kappa.py', 'tmp/routes-b5-r18-work/r18_count_certificate_combined.py', 'tmp/routes-b5-r18-work/r18_tiers.py',
    'tmp/routes-b5-r18-work/r18_gue_palm.json', 'tmp/routes-b5-r18-work/r18_closepair_mirror_cue.json', 'tmp/routes-b5-r18-work/r18_closepair_mirror_zeta.json',
    'tmp/routes-b5-r18-work/r18_count_certificate_combined.json', 'tmp/routes-b5-r18-work/r18_tiers.json', 'tmp/routes-b5-ref18-check.py', 'tmp/routes-b5-ref18-offset.py',
    'tmp/routes-b5-ref18-check.log']),
  verdict: 'Route 18 is closed as a map; no bound moves. Pair correlation and GUE n-level correlations, as ordinate-only averages, are consistent with any '
    + 'rearrangement in windows of length o(T) or ≈ T^{1−δ} and say nothing about β; no known mechanism combines them with Levinson to go below the '
    + 'unconditional tiers (structural observation, not a theorem). The constant-p form of H_desc-mirror is out of reach at every window length; the profile '
    + 'form needs no deficit worse than ≈ 12% (c* = 0.882) at every site, which a count certificate supplies only loss-free at ≈ 2 (lattice) to 4 (GUE mean) '
    + 'spacings — one-by-one zero checking. The measured certificate (κ_W ≈ 0.29–0.35; 16–48 spacings for every window to 1e6) misses by ≈ 3× in κ and '
    + '5–16× in length, and the frozen-model profile criterion already fails at worst-case sites (C2). Nothing interval-certified. No refereed bound is changed; '
    + 'RH open; NO QED.',
});

const R = ROUTE_18;
const sSeam = (T) => 4 * PI / log(T / (2 * PI)); // mean spacing in de Bruijn x-units (x = 2t)
const lattice2 = (y, s) => (PI / s) * tanh(2 * PI * y / s) - 2 * 2 * y / ((s / 2) ** 2 + 4 * y * y);
const lattice1 = (y, s) => (PI / s) / tanh(2 * PI * y / s) - 1 / (2 * y);
const descent = (p, y0 = R.seam.y0, n = 40) => { const h = (1 - y0) / n; let S = 0;
  for (let i = 0; i <= n; i += 1) { const Y = y0 + i * h; S += (i === 0 || i === n ? 0.5 : 1) / (1 / Y + p(Y)); } return S * h; };
const descentConst = (p, y0 = R.seam.y0) => (1 / p - y0 / p) - (log(1 + p) - log(1 + p * y0)) / (p * p); // ∫ Y/(1+pY) dY exactly
const sinc = (u) => (u === 0 ? 1 : sin(PI * u) / (PI * u));
const dsinc = (u) => (u === 0 ? 0 : (PI * u * cos(PI * u) - sin(PI * u)) / (PI * u * u));
const gue = (y, s, L = 600, h = 0.01) => { let I = 0, D = 0; for (let k = -L / h; k <= L / h; k += 1) { const u = k * h;
  const d = sinc(u) ** 2 + 3 * dsinc(u) ** 2 / PI ** 2; I += d * 2 * y / (s * s * u * u + 4 * y * y); D += d; } return { M: PI / s - I * h, deficit: D * h }; };

export const ROUTE_18_ASSERTIONS = Object.freeze([
  {
    id: 'r18-p-req',
    holds: () => { let lo = 1, hi = 10; for (let k = 0; k < 80; k += 1) { const m = (lo + hi) / 2; if (descentConst(m) > R.seam.t0) lo = m; else hi = m; }
      return abs(lo - R.seam.pReq) < 1e-3; },
    why: 'p_req solves ∫_{0.165}^1 Y/(1 + pY) dY = t0 = 0.1314 exactly: 4.37426.',
  },
  {
    id: 'r18-lattice-mirror-counts',
    holds: () => { const s = sSeam(R.seam.T); const y = R.seam.y0;
      return abs(lattice2(y, s) - R.mirror.lattice2slot) < 1e-3 && abs(lattice1(y, s) - R.mirror.lattice1slot) < 1e-3
        && abs(R.seam.pReq / R.mirror.lattice2slot - 1.730) < 2e-3 && abs(R.seam.pReq / R.mirror.gueDoublePoint - 1.448) < 2e-3; },
    why: 'Seam spacing s = 4π/log(T/2π) = 0.4673; closed forms (π/s)tanh(2πy/s) − pair terms = 2.5288 (pair takes 2 slots) and (π/s)coth(2πy/s) − 1/(2y) = 3.8536 (1 slot); p_req is 1.730× the lattice and 1.448× the GUE mean.',
  },
  {
    id: 'r18-lattice-descent-and-cstar',
    holds: () => { const s = sSeam(R.seam.T); const d = descent((Y) => lattice2(Y, s), R.seam.y0, 400);
      let lo = 0.5, hi = 1.5; for (let k = 0; k < 50; k += 1) { const m = (lo + hi) / 2; if (descent((Y) => m * lattice2(Y, s), R.seam.y0, 400) > R.seam.t0) lo = m; else hi = m; }
      return abs(d - R.descent.lattice) < 5e-4 && abs(lo - R.descent.cStarLattice) < 2e-3 && d < R.seam.t0; },
    why: 'Profile descent ∫ dY/(1/Y + M_lattice(Y)) = 0.1204 < t0; the uniform multiple of the lattice profile that just reaches t0 is c* = 0.8815.',
  },
  {
    id: 'r18-gue-palm',
    holds: () => { const s = sSeam(R.seam.T); const g = gue(R.seam.y0, s); const dg = descent((Y) => gue(Y, s, 300, 0.02).M, R.seam.y0, 20);
      return abs(g.M - R.mirror.gueDoublePoint) < 2e-3 && abs(g.deficit - 2) < 2e-3 && abs(dg - R.descent.gue) < 1e-3
        && R.mirror.lattice2slot < R.mirror.gueDoublePoint && R.mirror.gueDoublePoint < R.seam.pReq; },
    why: 'Quadrature of ρ(u) = 1 − S² − 3S′²/π² against 2y/(s²u² + 4y²): M(y0) = 3.0208, deficit ∫(S² + 3S′²/π²) = 2; GUE profile descent 0.1173; lattice < GUE < p_req.',
  },
  {
    id: 'r18-tiers-and-delta',
    holds: () => { const sp = (T) => log(T / (2 * PI)) / (2 * PI); const [T1, T2] = [3e12, 7.5e16];
      const pos = [T1, T2].map((T) => T ** (1 / 6) * sp(T)); const prop = [T1, T2].map((T) => T ** (27 / 82) * sp(T));
      const dl = [T1, T2].map((T) => 1 - log(R.tiers.hdescWindow / sp(T)) / log(T));
      return pos.every((v, i) => abs(v / R.tiers.positivity[i] - 1) < 2e-3) && prop.every((v, i) => abs(v / R.tiers.proportion[i] - 1) < 5e-3)
        && dl.every((v, i) => abs(v - R.tiers.deltaHdesc[i]) < 2e-4) && abs(1 - 27 / 82 - R.tiers.deltaBeat2782) < 1e-15 && abs(1 - 1 / 6 - R.tiers.deltaBeat16) < 1e-15; },
    why: 'T^{1/6} and T^{27/82} in mean spacings at 3e12 / 7.5e16: 514 / 3826 and 54,924 / 2.12e6; an averaged hypothesis with error T^{−δ} sees the 8.6-spacing window only for δ ≥ 0.9757 / 0.9903; beating T^{27/82} needs δ > 55/82, T^{1/6} needs δ > 5/6.',
  },
  {
    id: 'r18-clausen-damping',
    holds: () => { const s = sSeam(R.seam.T); return R.damping.every(([wl, v]) => { const th = 2 * PI / wl; const rate = (4 / (s * s)) * (PI * th / 2 - th * th / 4);
      return abs(exp(-rate * R.seam.t0) / v - 1) < 0.03; }) && abs(PI * PI / (s * s) - 45.2) < 0.1; },
    why: 'Mode rate (4/s²)(πθ/2 − θ²/4) with θ = 2π/wavelength; π²/s² = 45.2 at wavelength 2; damping by t0: 0.0026 / 0.074 / 0.25 at 2 / 8 / 16 spacings (heuristic tier: linearised about a lattice).',
  },
  {
    id: 'r18-referee-corrections',
    holds: () => { const c = R.countCertificate; return c.latticeGenericMaxW === 2 && c.latticeOffsetPass[2] === 1 && c.latticeOffsetPass[3] < 0.5
        && c.latticeW3Symmetric > R.seam.t0 && c.gueW4 < R.seam.t0 && R.priorC2.worst1e12 > R.seam.t0 && R.priorC2.gueLargestGap.every((v) => v > R.seam.t0)
        && R.ns3locallev.allFixed.join('/') === '20/48/40' && R.ns3locallev.allPerWindow.join('/') === '16/48/32'
        && Object.values(c.factorNeeded).every((f) => f > 1) && c.constantPBest < R.seam.pReq; },
    why: 'Generic lattice threshold w ≤ 2 (w = 3 is an edge artefact: 0.1600 > t0 symmetric); GUE mean w ≤ 4 (0.1305 < t0); C2 worst-case sites already fail (0.140, 0.144–0.154 > 0.1314); ns3-locallev rows 20/48/40 and 16/48/32; certificates at w ≥ 8.6 would need > 1× the true count.',
  },
  {
    id: 'r18-close-pair-rates',
    holds: () => { const c = R.closePairs; return abs(c.cue.fail / c.cue.n - 0.0042) < 1e-4 && c.zeta.fail === 0 && c.zeta.maxDescent < R.seam.t0
      && c.zeta.maxDescentWide < R.seam.t0 && c.zeta.meanM < c.cue.meanM && c.density.zeta.every((v, i) => v <= c.density.cue[i]); },
    why: 'CUE close pairs fail the profile criterion at 0.42%, ζ close pairs (5e5–1e6) at 0/6950 (max 0.1291) — ζ is more rigid than CUE (lower density excess at ±2/±4/±8); typical-site rates only.',
  },
  {
    id: 'r18-honest-scope',
    holds: () => R.status === 'done' && /not a theorem/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict)
      && /no bound moves/.test(R.verdict) && /Nothing interval-certified/.test(R.verdict),
    why: 'Structural observation, not a non-implication theorem; frozen-model measurements; no Λ change; no QED.',
  },
]);

export default ROUTE_18;
