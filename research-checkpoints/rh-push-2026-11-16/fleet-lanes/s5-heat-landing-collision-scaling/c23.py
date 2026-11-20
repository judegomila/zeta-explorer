"""Combinations 2 and 3 on one ordinate list (all zeros real).
Usage: c23.py LIST.npy NAME Q NFULL OUT.json [heatwindow T0]
  Q = conductor used for the unfolding (zeta 1, mod 5 lists 5); NFULL = largest N for the full N-body backward flow.
Combination 2: first collision time t_c(N) of the backward Dyson flow dx_k/ds = -2 sum 1/(x_k - x_j) on the first N ordinates
  (full flow for N <= NFULL, pair value g^2/8 and the plateau bracket of imp-3725 for all N), block statistics of the minimal
  normalised gap, exponent fits, and the source ansatz E_coll = C_C sqrt(log T0 / N).
Combination 3: environment sum S for every adjacent pair, gates S >= 0, B G^2 < 2, S g^2 < 0.909, and the collision depth of the
  NCLOSE closest pairs from a local backward flow, against the static bracket T_-(g, S), T_+(g, S)."""
import sys, os, json, math, numpy as np, hl
fn, name, Q, NFULL, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(float(sys.argv[4])), sys.argv[5]
g = np.load(fn, mmap_mode='r'); g = np.array(g, dtype=np.float64); n = len(g)
if len(sys.argv) > 8: g = g[:int(float(sys.argv[8]))]; n = len(g)
T0w = float(sys.argv[7]) if len(sys.argv) > 7 and sys.argv[7] else None
hl.log('%s: %d ordinates, %.3f .. %.3f ; memory of list %.2f GB ; planned peak about %.1f GB' % (name, n, g[0], g[-1], 8e-9 * n, 9 * 8e-9 * n + 1.5))
CC = math.sqrt(3 * math.pi) / 8
res = dict(name=name, n=n, gmax=float(g[-1]), Q=Q)
gap = np.diff(g)
dens = hl.rho_gamma(0.5 * (g[1:] + g[:-1]) if T0w is None else np.full(n - 1, T0w), Q)
s = gap * dens                                   # normalised gaps (smooth density of all zeros of the object)
res['mean_normalised_gap'] = float(s.mean())

# ---------------------------------------------------------------- combination 2
def tc_flow(x, ld=False, cfl=0.04, stop=1e-3, track=False, ext=False):
    """backward flow, classical RK4, dt = cfl g_min^2; returns t_c, retardation and diagnostics.
    ext=True (windows cut out of a longer list): the zeros outside are replaced by a frozen uniform continuum,
    force rho log((b - x)/(x - a)), a, b half a mean spacing outside the window."""
    x = np.array(x, dtype=np.longdouble if ld else np.float64); s_ = 0.0
    d = np.diff(x); k0 = int(np.argmin(d)); g0 = float(d[k0]); tr = []
    if ext:
        rho_w = (len(x) - 1) / float(x[-1] - x[0]); ea = float(x[0]) - 0.5 / rho_w; eb = float(x[-1]) + 0.5 / rho_w
        _fr = hl.forces_real
        def FR(xx, ld_): return _fr(xx, ld_) + rho_w * np.log((eb - xx) / (xx - ea))
    else: FR = hl.forces_real
    for it in range(4000):
        F = FR(x, ld)
        d = np.diff(x); k = int(np.argmin(d)); gm = float(d[k])
        Bp = float((F[k] - F[k + 1] + 2 / d[k]) / d[k])      # B_p of the minimal pair
        if track: tr.append((s_, gm, float(2 * (F.astype(np.float64) ** 2).sum()), Bp))
        if gm < stop * g0 or it == 3999: break
        dt = cfl * gm * gm
        k1 = -2 * F; k2 = -2 * FR(x + 0.5 * dt * k1, ld); k3 = -2 * FR(x + 0.5 * dt * k2, ld); k4 = -2 * FR(x + dt * k3, ld)
        x = x + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4); s_ += dt
    R = gm * gm * Bp / 2
    return dict(tc=s_ + gm * gm / (8 * (1 - R)), g0=g0, k0=k0, k_final=k, steps=it, pair=g0 * g0 / 8, track=tr)

ladder = sorted(set(int(round(v)) for v in np.geomspace(1e3, n, int(round(4 * math.log10(n / 1e3))) + 1) if v <= n))
rows = []
theta_bar = 0.99
for N in ladder:
    gp = gap[:N - 1]; a = int(np.argmin(gp)); Hm = float(gp[a]); T = Hm * Hm / (8 * theta_bar)
    lo = max(0, a - 20000); hi = min(N - 1, a + 20001)
    sh = np.sqrt(np.maximum(gp[lo:hi] ** 2 - 8 * T, 0.0)); ia = a - lo
    Dr = np.cumsum(sh[ia + 1:]); Dl = np.cumsum(sh[:ia][::-1])
    with np.errstate(divide='ignore'):
        Psi = 4 * Hm * Hm * (float((1 / Dr ** 2).sum()) + float((1 / Dl ** 2).sum())) if len(Dr) and len(Dl) and Dr.min() > 0 and Dl.min() > 0 else float('inf')
    Psi += 4 * Hm * Hm * 2 * float(dens[a]) ** 2 / 20000          # continuum tail of the remaining zeros
    th = 1 - Psi / 8
    T0 = float(g[N - 1])
    row = dict(N=N, T0=T0, gmin=Hm, index=a, height=float(g[a]), smin=float(s[a]), tc_pair=Hm * Hm / 8, theta=th,
               tc_upper=(Hm * Hm / (8 * th) if th >= theta_bar else None), Ecoll_ansatz=CC * math.sqrt(math.log(T0) / N))
    if N <= NFULL:
        r = tc_flow(g[:N], track=(N <= 20000))
        row.update(tc_flow=r['tc'], retardation=r['tc'] / r['pair'] - 1, flow_steps=r['steps'], same_pair=bool(r['k0'] == r['k_final']),
                   in_bracket=bool(r['tc'] >= Hm * Hm / 8 * (1 - 1e-9) and (row['tc_upper'] is None or r['tc'] <= row['tc_upper'] * (1 + 1e-9))))
        if r['track']:
            tr = np.array(r['track']); gm = tr[:, 1]; E = tr[:, 2]
            dE = np.diff(E) / np.diff(tr[:, 0]); gmid = np.sqrt(gm[1:] * gm[:-1])
            row['Ekin_growth_times_g4'] = [float(v) for v in (dE * gmid ** 4)[-6:]]      # d/ds (1/2 sum v^2) * g^4 near the collision
        hl.log('N=%d full flow t_c=%.6e pair %.6e retard %.2e steps %d' % (N, r['tc'], r['pair'], row['retardation'], r['steps']))
    # window flow in long double around the minimal pair (4001 ordinates)
    w0 = max(0, a - 2000); w1 = min(N, a + 2002)
    rl = tc_flow(g[w0:w1], ld=True, cfl=0.02, stop=1e-4, ext=True)
    row.update(tc_window_ld=rl['tc'], retardation_window=rl['tc'] / rl['pair'] - 1)
    rows.append(row)
res['ladder'] = rows
# fits on the ladder: log t_c against log N, and the ansatz ratio
N_ = np.array([r['N'] for r in rows], dtype=float); tc = np.array([r['tc_window_ld'] for r in rows]); ans = np.array([r['Ecoll_ansatz'] for r in rows])
p = np.polyfit(np.log(N_), np.log(tc), 1)
res['ladder_fit'] = dict(slope_log_tc_vs_log_N=float(p[0]), intercept=float(p[1]),
                         ratio_tc_over_ansatz=[float(v) for v in tc / ans], ratio_4tc_over_ansatz=[float(v) for v in 4 * tc / ans],
                         ratio_gmin_over_ansatz=[float(r['gmin'] / r['Ecoll_ansatz']) for r in rows], ratio_smin_over_ansatz=[float(r['smin'] / r['Ecoll_ansatz']) for r in rows],
                         slope_log_gmin=float(np.polyfit(np.log(N_), np.log([r['gmin'] for r in rows]), 1)[0]),
                         slope_log_smin=float(np.polyfit(np.log(N_), np.log([r['smin'] for r in rows]), 1)[0]))
# block statistics of the minimal normalised gap: E[min of N consecutive gaps]
bl = []
for N in [int(v) for v in (1e2, 3e2, 1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7) if n - 1 >= 8 * v]:
    m = (n - 1) // N; mn = s[:m * N].reshape(m, N).min(1)
    gue = math.gamma(4 / 3) * (9 / (math.pi ** 2 * N)) ** (1 / 3)
    bl.append(dict(N=N, blocks=m, mean_min=float(mn.mean()), sem=float(mn.std(ddof=1) / math.sqrt(m)), median_min=float(np.median(mn)),
                   mean_min_sq_over_8=float((mn ** 2).mean() / 8), gue_cubic_prediction=gue, ratio_to_gue=float(mn.mean() / gue),
                   ansatz_shape_sqrt=float(mn.mean() * math.sqrt(N))))
res['block_min'] = bl
if len(bl) >= 3:
    xN = np.log([b['N'] for b in bl]); yv = np.log([b['mean_min'] for b in bl]); w = np.array([b['mean_min'] / max(b['sem'], 1e-12) for b in bl])
    pf, cov = np.polyfit(xN, yv, 1, w=w, cov=True)
    res['block_min_fit'] = dict(exponent=float(pf[0]), exponent_err=float(math.sqrt(cov[0, 0])), prefactor=float(math.exp(pf[1])),
                                 gue_exponent=-1 / 3, ansatz_exponent=-0.5,
                                 local_exponents=[float((yv[i + 1] - yv[i]) / (xN[i + 1] - xN[i])) for i in range(len(bl) - 1)])
res['small_gap'] = dict(P=[dict(d=d, frac=float((s < d).mean()), gue_cubic=math.pi ** 2 * d ** 3 / 9) for d in (0.01, 0.02, 0.05, 0.1, 0.2)],
                        exponent_0p02_0p1=float(math.log(max((s < 0.1).mean(), 1e-300) / max((s < 0.02).mean(), 1e-300)) / math.log(5)))
hl.log('combination 2 done')

# ---------------------------------------------------------------- combination 3
J = 200
S = hl.pair_S(g, J)                                                   # index i <-> pair (i, i+1); nan near the ends
i0, i1 = J, n - 1 - J
a_ = g[i0:i1]; b_ = g[i0 + 1:i1 + 1]; Sv = S[i0:i1]; gp = gap[i0:i1]; dn = dens[i0:i1]
Sv = Sv + 2 * dn * dn / (J + 0.5); del S                              # continuum tail beyond the J-th neighbours
xg = Sv * gp * gp                                                     # gate variable S g^2 (dimensionless)
m10 = len(xg) // 10
fr = lambda thr: (float((xg > thr).mean()), float(np.std([(xg[k * m10:(k + 1) * m10] > thr).mean() for k in range(10)], ddof=1) / math.sqrt(10)))
c3 = dict(pairs=int(len(xg)), S_negative=int((Sv < 0).sum()), S_min_times_meangap2=float((Sv / dn ** 2).min()), S_mean_times_meangap2=float((Sv / dn ** 2).mean()),
          lattice_value=2.0,   # sum_{k>=1} 2/(k(k+1)) = 2: S s^2 = 2 on the lattice
          frac_gate_gt_0p909=fr(0.909), frac_gate_gt_2=fr(2.0), gate_quantiles=[float(v) for v in np.quantile(xg, [0.01, 0.1, 0.5, 0.9, 0.99, 0.999])])
# gate on close pairs (s < 0.2) and on the running minimal pair of the ladder
cl = s[i0:i1] < 0.2
c3['close_pairs'] = dict(n=int(cl.sum()), frac_gate_gt_0p909=float((xg[cl] > 0.909).mean()) if cl.any() else None, n_gate_gt_0p909=int((xg[cl] > 0.909).sum()),
                         n_gate_gt_2=int((xg[cl] > 2).sum()), max_gate=float(xg[cl].max()) if cl.any() else None)
mins = []
for r in rows:
    a = r['index']
    if a < i0 or a >= i1: continue
    Sa = float(Sv[a - i0]); G = r['gmin']
    mins.append(dict(N=r['N'], index=a, gate_S_g2=Sa * G * G, B_G2=Sa * G * G, lt_2=bool(Sa * G * G < 2), lt_0p909=bool(Sa * G * G < 0.909)))
c3['running_minimal_pair'] = mins
# first pair index (in list order) at which each gate fails
for nm, thr in (('first_index_gate_gt_0p909', 0.909), ('first_index_gate_gt_2', 2.0)):
    w = np.nonzero(xg > thr)[0]; c3[nm] = int(w[0] + i0) if len(w) else None
# local backward flow of the NCLOSE closest pairs (by normalised gap): true collision depth against the static bracket
NCL = min(10000, (i1 - i0) // 50); Wn = 24
idx = np.argsort(s[i0 + Wn:i1 - Wn])[:NCL] + i0 + Wn
Xw = np.stack([g[idx + k] for k in range(-Wn, Wn + 2)], 1)          # (NCL, 2 Wn + 2), pair at columns Wn, Wn+1
Xw = Xw - Xw[:, Wn:Wn + 1]
hl.log('local flow of %d pairs, window %d ordinates, array %.2f GB per force evaluation' % (NCL, 2 * Wn + 2, 8e-9 * NCL * (2 * Wn + 2) ** 2))
rw = (2 * Wn + 1) / (Xw[:, -1] - Xw[:, 0]); EA = Xw[:, 0] - 0.5 / rw; EB = Xw[:, -1] + 0.5 / rw
def Fw(X, ai):
    D = X[:, :, None] - X[:, None, :]
    ii = np.arange(X.shape[1]); D[:, ii, ii] = np.inf
    return (1 / D).sum(2) + rw[ai, None] * np.log((EB[ai, None] - X) / (X - EA[ai, None]))
g0 = Xw[:, Wn + 1] - Xw[:, Wn]; S0 = Sv[idx - i0]
tcl = np.full(NCL, np.nan); sup_B = S0.copy(); other = np.zeros(NCL, bool); act = np.ones(NCL, bool); tt = np.zeros(NCL)
X = Xw.copy()
for it in range(3000):
    ai = np.nonzero(act)[0]
    F = Fw(X[act], ai); d = np.diff(X[act], axis=1); gm_all = d.min(1); gp_ = d[:, Wn]
    Bp = (F[:, Wn] - F[:, Wn + 1] + 2 / gp_) / gp_
    sup_B[ai] = np.maximum(sup_B[ai], Bp)
    done = (gp_ < 1e-3 * g0[ai]) | (gm_all < 0.5 * gp_)
    if done.any():
        dd = ai[done]; R = gp_[done] ** 2 * Bp[done] / 2
        tcl[dd] = tt[dd] + gp_[done] ** 2 / (8 * (1 - R)); other[dd] = gm_all[done] < 0.5 * gp_[done]
        act[dd] = False
        if not act.any(): break
        keep = ~done; F = F[keep]; gm_all = gm_all[keep]; ai = ai[keep]
    dt = 0.04 * gm_all ** 2
    Xa = X[ai]; k1 = -2 * F; k2 = -2 * Fw(Xa + 0.5 * dt[:, None] * k1, ai); k3 = -2 * Fw(Xa + 0.5 * dt[:, None] * k2, ai); k4 = -2 * Fw(Xa + dt[:, None] * k3, ai)
    X[ai] = Xa + dt[:, None] / 6 * (k1 + 2 * k2 + 2 * k3 + k4); tt[ai] += dt
okp = ~other & ~np.isnan(tcl)
x0 = S0 * g0 * g0; xs = sup_B * g0 * g0
with np.errstate(invalid='ignore', divide='ignore'):
    Tm = np.log1p(xs / 2) / (4 * sup_B); Tp = np.where(xs < 2, -np.log1p(-np.minimum(xs, 1.999999) / 2) / (4 * sup_B), np.inf)
    Tp0 = np.where(x0 < 2, -np.log1p(-np.minimum(x0, 1.999999) / 2) / (4 * S0), np.inf)
ret = tcl / (g0 * g0 / 8) - 1
c3['closest_pairs'] = dict(n=int(NCL), window=2 * Wn + 2, resolved=int(okp.sum()), neighbour_gap_collided_first=int(other.sum()),
                           normalised_gap_max=float(s[idx].max()),
                           static_gate_x0_quantiles=[float(v) for v in np.quantile(x0, [0.5, 0.9, 0.99, 1.0])], n_x0_gt_0p909=int((x0 > 0.909).sum()), n_x0_gt_2=int((x0 > 2).sum()),
                           true_gate_sup_quantiles=[float(v) for v in np.quantile(xs[okp], [0.5, 0.9, 0.99, 1.0])], n_sup_gt_0p909=int((xs[okp] > 0.909).sum()), n_sup_gt_2=int((xs[okp] > 2).sum()),
                           retardation_quantiles=[float(v) for v in np.quantile(ret[okp], [0.0, 0.5, 0.9, 0.99, 1.0])],
                           violations_lower=int((tcl[okp] < (g0 * g0 / 8)[okp] * (1 - 1e-4)).sum()),
                           violations_sandwich_true_beta=int(((tcl[okp] < Tm[okp] * (1 - 1e-4)) | (tcl[okp] > Tp[okp] * (1 + 1e-4))).sum()),
                           static_reserve_depth_exceeded=int((tcl[okp] > Tp0[okp] * (1 + 1e-6)).sum()),
                           static_reserve_ratio_quantiles=[float(v) for v in np.quantile((tcl / Tp0)[okp & np.isfinite(Tp0)], [0.0, 0.5, 0.99, 1.0])])
res['c3'] = c3
hl.jdump(res, out); hl.log('written', out)
print(json.dumps({k: v for k, v in res.items() if k not in ('ladder',)}, indent=0)[:6000])
