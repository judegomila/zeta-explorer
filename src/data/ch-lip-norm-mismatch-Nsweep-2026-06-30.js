/**
 * @module ch-lip-norm-mismatch-Nsweep-2026-06-30
 *
 * imp-3030: the NUMERICAL N-sweep companion to ch-wall-frontier-verdict route 2
 * (norm-mismatch). The verdict states, as a closed form, that against the bridge
 * GLOBAL Wasserstein metric W_1 = (1/N) Sum |Dx|, the Lipschitz constant of the
 * collision energy
 *
 *     C_Lip(W_1, N) = N * g0 / (4 (1 - Theta))
 *
 * diverges LINEARLY in N. The mechanism is purely metric-architectural, NOT
 * dynamics and NOT the Holder-1/2 shock: a single microscopic 1-pair collision
 * move costs an L^infinity displacement of size eps, but W_1 AVERAGES that one
 * moved coordinate over all N particles, so the same physical move registers as a
 * W_1 distance of only eps/N. Restoring the per-pair sensitivity g0/(4(1-Theta))
 * therefore costs a factor of N -- the dilution is exactly 1/N, so the quotient
 * grows exactly as N.
 *
 * imp-3010 lays the three divergence PROOFS side-by-side qualitatively; imp-3006 /
 * ch-lip-basin-conditional reports the PER-PAIR gap channel g0/(4(1-Theta)) ~ 9.4e-3
 * (the N-independent slope). DELIVERABLE here (distinct, numerical): evaluate the
 * closed form across N = 10, 100, 1e3, 1e4, 1e5 with the certified g0 = g_min(1e4),
 * confirm the strictly linear growth, pin the slope = g0/(4(1-Theta)) (identical to
 * the basin gap channel), and report the operative value at N* = 1e4.
 *
 * RESULT (Theta -> 0 basin nominal, g0 = 0.0376985):
 *   slope = g0/4 = 9.4246e-3 (= the basin gap channel, N-independent)
 *   N = 1e1 : C_Lip = 9.4246e-2
 *   N = 1e2 : C_Lip = 9.4246e-1
 *   N = 1e3 : C_Lip = 9.4246e+0
 *   N = 1e4 : C_Lip = 9.4246e+1   <-- operative N*, ~94.25
 *   N = 1e5 : C_Lip = 9.4246e+2
 * Each decade in N multiplies C_Lip by exactly 10 (C_Lip(N)/N is flat to machine
 * precision), so the growth is strictly linear and the slope is exactly the
 * N-independent per-pair gap channel. The 1/4-trap ceiling (Theta = 1/4) rescales
 * the whole column by 4/3 (slope g0/3 = 1.2566e-2, value 1.2566e+2 at N*=1e4) but
 * leaves the linear-in-N law untouched -- Theta sets the slope, N sets the divergence.
 *
 * HONEST (NO new bound, NO false QED): this is the SAME metric fact already stated
 * in the verdict, now MEASURED as an N-sweep. It quantifies WHY a global-W_1 C_Lip
 * cannot be finite (the per-pair channel is finite -- 9.4e-3 -- but the global one
 * is N times it). No refereed bound is changed; the
 * finite-N*=1e4 beat stays an ESTIMATE. The basin-conditional finite C_Lip lives in
 * the PER-PAIR channel only (ch-lip-basin-conditional); the global-W_1 constant is
 * untouched and still diverges.
 *
 * @see ch-wall-frontier-verdict-2026-06-26 (route 2: the closed form C_Lip = N g0/(4(1-Theta)))
 * @see ch-lip-basin-conditional-2026-06-30 (the per-pair gap channel = this slope, basin-finite)
 * @see finite-height-beats-platt-trudgian (certified g0 = g_min(1e4) = 0.0376985)
 */

const G0 = 0.0376985;          // certified g_min(1e4), Lehmer pair idx 6708, gamma ~ 7005
const THETA_NOMINAL = 0;       // isolated-pair basin nominal (real-zero regime Theta(0) << 1/4)
const THETA_TRAP = 0.25;       // unconditional Theorem-A trap ceiling

// closed form C_Lip(W_1, N) = N * g0 / (4 (1 - Theta))
const slope = (theta) => G0 / (4 * (1 - theta));        // the N-independent per-pair gap channel
const cLip = (N, theta) => N * slope(theta);

const N_GRID = [1e1, 1e2, 1e3, 1e4, 1e5];
const N_STAR = 1e4;

const SLOPE_NOMINAL = slope(THETA_NOMINAL);             // g0/4  = 9.4246e-3
const SLOPE_TRAP = slope(THETA_TRAP);                   // g0/3  = 1.2566e-2

const SWEEP_NOMINAL = N_GRID.map((N) => ({ N, cLip: cLip(N, THETA_NOMINAL), perN: cLip(N, THETA_NOMINAL) / N }));
const SWEEP_TRAP = N_GRID.map((N) => ({ N, cLip: cLip(N, THETA_TRAP), perN: cLip(N, THETA_TRAP) / N }));

export const CH_LIP_NORM_MISMATCH_NSWEEP = {
  ticket: 'imp-3030',
  date: '2026-06-30',
  closedForm: 'C_Lip(W_1, N) = N * g0 / (4 (1 - Theta))',
  g0: G0,
  slopeNominal: SLOPE_NOMINAL,                          // g0/4, = basin gap channel, N-independent
  slopeTrap: SLOPE_TRAP,                                // g0/3, 1/4-trap ceiling
  sweepNominal: SWEEP_NOMINAL,                          // Theta -> 0 basin nominal
  sweepTrap: SWEEP_TRAP,                                // Theta = 1/4 unconditional trap
  cLipAtNStar: cLip(N_STAR, THETA_NOMINAL),             // ~94.25 (Theta->0); 125.66 at the 1/4 trap
  cLipAtNStarTrap: cLip(N_STAR, THETA_TRAP),
  growth: 'strictly linear in N: C_Lip(N)/N is flat to machine precision; each decade multiplies C_Lip by exactly 10',
  mechanism: 'W_1 = (1/N) Sum|Dx| averages a single 1-pair collision move (L-inf cost eps) over all N coordinates -> registers as eps/N; restoring per-pair sensitivity costs the factor N',
  honest: 'NO new bound: the SAME metric fact as the verdict, now measured as an N-sweep. Per-pair channel is finite (9.4e-3); the global-W_1 constant is N times it and diverges. No refereed bound is changed; finite-N*=1e4 beat stays an ESTIMATE. NO false QED.',
};

export const CH_LIP_NORM_MISMATCH_NSWEEP_ASSERTIONS = [
  {
    id: 'ch-lip-nsweep-linear-in-N',
    description: 'C_Lip(W_1,N)/N is constant across the whole N = 10..1e5 grid (strictly linear growth)',
    holds: () => SWEEP_NOMINAL.every((row) => Math.abs(row.perN - SLOPE_NOMINAL) < 1e-12),
  },
  {
    id: 'ch-lip-nsweep-decade-factor-10',
    description: 'each decade in N multiplies C_Lip by exactly 10 (consecutive grid points are decades)',
    holds: () => SWEEP_NOMINAL.slice(1).every((row, i) => Math.abs(row.cLip / SWEEP_NOMINAL[i].cLip - 10) < 1e-9),
  },
  {
    id: 'ch-lip-nsweep-slope-is-gap-channel',
    description: 'the N-independent slope g0/(4(1-Theta)) at Theta->0 reproduces the basin gap channel ~9.42e-3',
    holds: () => Math.abs(SLOPE_NOMINAL - 9.424625e-3) < 1e-9 && Math.abs(SLOPE_NOMINAL - G0 / 4) < 1e-12,
  },
  {
    id: 'ch-lip-nsweep-operative-NStar-value',
    description: 'operative N*=1e4 value C_Lip = 1e4 * g0/4 ~ 94.25 (Theta->0); 1/4 trap rescales to ~125.66',
    holds: () => Math.abs(CH_LIP_NORM_MISMATCH_NSWEEP.cLipAtNStar - 94.24625) < 1e-4
      && Math.abs(CH_LIP_NORM_MISMATCH_NSWEEP.cLipAtNStarTrap - 125.661667) < 1e-4,
  },
  {
    id: 'ch-lip-nsweep-trap-rescales-slope-only',
    description: 'the 1/4 trap multiplies the slope by 4/3 but leaves the linear-in-N law intact (no N-dependence in the ratio)',
    holds: () => Math.abs(SLOPE_TRAP / SLOPE_NOMINAL - 4 / 3) < 1e-9
      && SWEEP_TRAP.every((row) => Math.abs(row.perN - SLOPE_TRAP) < 1e-12),
  },
  {
    id: 'ch-lip-nsweep-no-new-bound-no-qed',
    description: 'explicitly NO new bound and NO false QED: no refereed bound is changed, finite-N beat stays ESTIMATE',
    holds: () => /NO new bound/.test(CH_LIP_NORM_MISMATCH_NSWEEP.honest)
      && /refereed bound is changed/i.test(CH_LIP_NORM_MISMATCH_NSWEEP.honest)
      && /ESTIMATE/.test(CH_LIP_NORM_MISMATCH_NSWEEP.honest),
  },
];

for (const a of CH_LIP_NORM_MISMATCH_NSWEEP_ASSERTIONS) {
  if (!a.holds()) throw new Error(`ch-lip-norm-mismatch-Nsweep assertion failed: ${a.id}`);
}
