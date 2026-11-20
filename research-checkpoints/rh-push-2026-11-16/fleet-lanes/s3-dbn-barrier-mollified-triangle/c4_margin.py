"""Combination 4. Modulus floor delta(N, y) = max over mollifier families of T(N) - E(N) at t0 = 129/800, the two derivative caps and the
panel densities; monotonicity of delta in N.
  Route I  (differentiated cap, leading order): D_I  = (1/2) sum_{n<=N} |a| b_t n^-sigma ln n + g sum_{n<=N} |a| b_t n^(y-sigma) (L - ln n)/2,  L = ln(x_N/4 pi)
  Route II (Cauchy, M(r) <= M(0) e^(w r), r* = 1/w, w = L/2): D_II = e w M(0),  M(0) = sum_{n<=N} |a| b_t n^-sigma (1 + g n^y)
  panel density = D / (pi delta)
Usage: c4_margin.py zeta NN NY | controls NN [dh_lam.json]"""
import sys, math, json, time
from lib import *
MODE = sys.argv[1]; NN = int(sys.argv[2])
SOFF = int(sys.argv[4]) if len(sys.argv) > 4 and MODE == 'zeta' else 0
rng = np.random.default_rng(SEED + 4 + 1000 * SOFF)
Ns = np.unique(np.concatenate([np.exp(rng.uniform(math.log(1000), math.log(3840000), NN)).astype(np.int64), [1000, 690988, 3840000]]))
NMAX = int(Ns.max())
def caps(tr, N, t, y):
    xN, L, sigma, K, g = consts(N, t, y); ln = tr.ln[:N]; tr.set_ty(t, y)
    w0 = tr.heatabs[:N] * xp.exp(-sigma * ln); wy = w0 * xp.exp(y * ln)
    S0 = float(w0.sum()); S1 = float((w0 * ln).sum()); R0 = float(wy.sum()); R1 = float((wy * ln).sum())
    DI = 0.5 * S1 + g * (L * R0 - R1) / 2; DII = math.e * (L / 2) * (S0 + g * R0)
    return DI, DII
def mono(Ns, v):
    """violations of monotone increase along N: count, largest drop, N of the largest drop"""
    v = np.array(v); d = np.diff(v); bad = d < 0
    k = int(bad.sum()); i = int(np.argmin(d)) if k else -1
    return {'violations': k, 'largest_drop': float(-d.min()) if k else 0.0, 'at_N': int(Ns[i + 1]) if k else None, 'first_positive_N': (int(Ns[np.argmax(v > 0)]) if (v > 0).any() else None),
            'negative_after_first_positive': (int((v[np.argmax(v > 0):] <= 0).sum()) if (v > 0).any() else None)}
if MODE == 'zeta':
    NY = int(sys.argv[3])
    ys = [Y0] + ([0.03, 0.10, 0.1809, 0.30, 0.40] if NY > 0 else [])
    FAMS = {'P3': (2, 3), 'P5': (2, 3, 5), 'P7': (2, 3, 5, 7), 'P11': (2, 3, 5, 7, 11)}
    a = coefs('ZETA', NMAX); trs = {}
    announce('4 families x about 14 float64[%d]' % NMAX, 4 * 14 * 8 * NMAX)
    for f, P in FAMS.items():
        lam, D = euler_moll('ZETA', P, T0); trs[f] = (Tri(a, D, NMAX), lam)
    out = {}
    for iy, y in enumerate(ys):
        sub = Ns if iy == 0 else np.unique(np.concatenate([Ns[::max(1, len(Ns) // NY)], [690988, 3840000]]))
        rows = []; t0 = time.time()
        for N in sub:
            N = int(N); E = err_budget(N, T0, y)
            Ts = {f: trs[f][0].value(N, T0, y, trs[f][1]) for f in FAMS}
            DI, DII = caps(trs['P3'][0], N, T0, y)
            rows.append([N, E, DI, DII] + [Ts[f] for f in FAMS])
        rows = np.array(rows); best = rows[:, 4:].max(axis=1) - rows[:, 1]
        o = {'y': y, 'nN': len(sub), 'best': mono(sub, best)}
        for i, f in enumerate(FAMS): o[f] = mono(sub, rows[:, 4 + i] - rows[:, 1])
        pos = best > 0
        o['panel_density_I_at'] = {str(int(N)): float(rows[i, 2] / (math.pi * best[i])) for i, N in enumerate(sub) if pos[i] and N in (690988, 1000000, 3840000)}
        o['ratio_DII_over_DI'] = [float((rows[:, 3] / rows[:, 2]).min()), float((rows[:, 3] / rows[:, 2]).max())]
        o['DI_over_logN_times_S'] = None
        out[str(y)] = o; np.save('c4_zeta_y%.4f.npy' % y, rows)
        print(json.dumps(o), '%.0fs' % (time.time() - t0), flush=True)
    json.dump(out, open('c4_zeta_summary.json', 'w'), indent=1)
if MODE == 'controls':
    y = Y0; out = {}
    dh = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else None
    P = (2, 3, 5, 7, 11)
    for nm in ('ZETA', 'LCHI5', 'CHIM3', 'CHIM4', 'TNR', 'EA', 'DH', 'DH/chi', 'DH/none'):
        base = nm.split('/')[0]
        if nm == 'DH':
            if dh is None: continue
            lam = {int(d): v for d, v in dh.items()}; D = 2**3 * 3**2 * 7 * 11 * 13
        elif nm == 'DH/chi':
            l, D = euler_moll('LCHI5', P, T0); lam = {d: v.real for d, v in l.items() if abs(v.real) > 0}
        elif nm == 'DH/none': lam, D = {1: 1.0}, 1
        elif nm == 'EA': lam, D = euler_moll('EA', (2, 3, 5, 7), T0)
        else: lam, D = euler_moll(base, P, T0)
        tr = Tri(coefs(base, NMAX), D, NMAX); rows = []
        for N in Ns:
            N = int(N); DI, DII = caps(tr, N, T0, y)
            rows.append([N, err_budget(N, T0, y), DI, DII, tr.value(N, T0, y, lam)])
        rows = np.array(rows); d = rows[:, 4] - rows[:, 1]
        o = mono(Ns, d); o['delta_at'] = {str(int(N)): float(d[i]) for i, N in enumerate(Ns) if N in (1000, 690988, 3840000)}
        o['ratio_DII_over_DI'] = [float((rows[:, 3] / rows[:, 2]).min()), float((rows[:, 3] / rows[:, 2]).max())]
        out[nm] = o; np.save('c4_ctrl_%s.npy' % nm.replace('/', '_'), rows); print(nm, json.dumps(o), flush=True); del tr
    json.dump(out, open('c4_controls_summary.json', 'w'), indent=1)
print('done')
