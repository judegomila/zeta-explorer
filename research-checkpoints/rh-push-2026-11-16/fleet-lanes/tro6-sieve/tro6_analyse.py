#!/usr/bin/env python3
"""tro6_analyse.py -- finite-Q proxy for TRO6 on rows prime to 6 (output of tro6_rows.py).  [MEASURED]
r_sigma(Q) = |sum_{N(m)<=Q} rho_sigma(-e0 m) B_m| / (||rho_sigma|| ||B||), toy rows at matched length R = Q^1.4.
Null: independent uniform phases on rho. Reports mean r^2 * n (null = 1), look-elsewhere max, slope of rms r in Q,
and the mean square M(Q) on rows prime to 6."""
import sys, json, math
import numpy as np
d = np.load('tro6_rows.npz'); Nm = d['Nm']; rho = d['rho']; se = d['se']; B = d['B']; keys = [str(k) for k in d['keys']]
rng = np.random.default_rng(20261116); out = {'rows': int(len(Nm)), 'Nmax': int(Nm.max())}
print(f"rows {len(Nm)}, N(m) <= {Nm.max()}")
EMP = 0.85
# mean square
Qs = [100, 200, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000]; Qs = [q for q in Qs if q <= Nm.max()]
if Qs[-1] < Nm.max() - 50: Qs.append(int(Nm.max()))
tab = []
for q in Qs:
    s = Nm <= q; raw = (np.abs(rho[s])**2).sum(); bias = (se[s]**2).sum()
    tab.append([q, int(s.sum()), raw, bias, raw - bias, raw - EMP**2 * bias])
    print(f"M: Q={q:5d} #m={int(s.sum()):5d} raw={raw:.4f} bias={bias:.4f} corr={raw-bias:.4f} emp={raw-EMP**2*bias:.4f} noise share={bias/raw:.3f}")
tab = np.array(tab); lq = np.log(tab[:, 0])
for lo in (100, 400, 800):
    k = tab[:, 0] >= lo
    if k.sum() >= 3:
        sl = [float(np.polyfit(lq[k], np.log(tab[k, c]), 1)[0]) for c in (4, 5, 2)]
        print(f"   slope Q>={lo}: model-corr {sl[0]:.3f}, emp-corr {sl[1]:.3f}, raw {sl[2]:.3f}"); out[f'M_slope_{lo}'] = sl
out['M_tab'] = tab.tolist()
# bootstrap of slope (rows resampled)
k = tab[:, 0] >= 200; bs = []
r2 = (np.abs(rho)**2).sum(1) - (se**2).sum(1)
for _ in range(400):
    idx = rng.integers(0, len(Nm), len(Nm)); nn = Nm[idx]; rr = r2[idx]
    v = np.array([rr[nn <= q].sum() for q in tab[k, 0]])
    bs.append(np.polyfit(lq[k], np.log(v), 1)[0])
bs = np.array(bs); print(f"   bootstrap slope Q>=200: mean {bs.mean():.3f}, 95% [{np.quantile(bs,.025):.3f}, {np.quantile(bs,.975):.3f}]")
out['M_boot'] = [float(bs.mean()), float(np.quantile(bs, .025)), float(np.quantile(bs, .975))]
# TRO proxy
def stats(sel, cols):
    R = rho[sel]; n = sel.sum(); nr = np.sqrt((np.abs(R)**2).sum(0))
    res = []
    for c in cols:
        b = B[sel, c]; nb = np.sqrt((np.abs(b)**2).sum())
        res.append(np.abs(R.T @ b) / (nr * nb)); res.append(np.abs(R.T @ np.conj(b)) / (nr * nb))
    return np.array(res), n
def null(sel, cols, draws=300):
    R = rho[sel]; n = sel.sum(); mx = []; ms = []
    Bm = np.stack([B[sel, c] for c in cols] + [np.conj(B[sel, c]) for c in cols], 1)
    nb = np.sqrt((np.abs(Bm)**2).sum(0)); nr = np.sqrt((np.abs(R)**2).sum(0))
    for _ in range(draws):
        ph = np.exp(2j * np.pi * rng.random(R.shape)); r = np.abs((R * ph).T @ Bm) / np.outer(nr, nb)
        mx.append(r.max()); ms.append((r**2).mean() * n)
    return np.array(mx), np.array(ms)
QJ = [100, 200, 400, 800, 1600, 3200, 6400]; rows = []
print("\nTRO proxy, matched R = Q^1.4, psi in {aG, a}; rows prime to 6, 1 < N(m) <= Q (cumulative) and dyadic shell")
for mode in ('cum', 'shell'):
    for Qj in QJ:
        Qeff = min(Qj, int(Nm.max()))
        if Qj > 3200 and Nm.max() < 0.6 * Qj: continue
        sel = (Nm <= Qeff) & ((Nm > Qj // 2) if mode == 'shell' else True)
        cols = [keys.index(f"aG|{Qj}"), keys.index(f"a|{Qj}")]
        r, n = stats(sel, cols); mx, ms = null(sel, cols)
        S = float((r**2).mean() * n); p_S = float((ms >= S).mean()); p_mx = float((mx >= r.max()).mean())
        print(f" {mode:5s} Q={Qeff:5d} n={n:5d} rms r={math.sqrt((r**2).mean()):.4f} n^-1/2={n**-.5:.4f} mean r^2 n={S:.2f} (null {ms.mean():.2f}+-{ms.std():.2f}, p={p_S:.2f})  max r={r.max():.4f} (null med {np.median(mx):.4f}, 99% {np.quantile(mx,.99):.4f}, p={p_mx:.2f})")
        rows.append(dict(mode=mode, Q=Qeff, n=int(n), rms=float(math.sqrt((r**2).mean())), S=S, pS=p_S, maxr=float(r.max()), pmax=p_mx))
out['tro'] = rows
c = [x for x in rows if x['mode'] == 'cum']
sl = np.polyfit(np.log([x['Q'] for x in c]), np.log([x['rms'] for x in c]), 1)[0]
print(f"\nslope of rms r in Q (cumulative, matched R): {sl:.3f}  (random-phase prediction -0.5)"); out['r_slope'] = float(sl)
# per-(sigma, psi, pairing) slopes bootstrap over the Q-grid is not meaningful with 6 points; report S stability instead
json.dump(out, open('tro6_analyse.json', 'w'), indent=1)
