"""Surgery with continuation in delta (warm start), larger K.  See surgery.py for the definition of E(u)."""
import numpy as np, json, sys
d = json.load(open('zeros_3e12.json')); zt = np.array(d['zeros_tau'])
cand = np.where(np.abs(zt[:-1]) < 20)[0]; i0 = cand[np.argmin(np.diff(zt)[cand])]; tq = (zt[i0]+zt[i0+1])/2
def run(L, K, deltas, iters=80):
    idx = np.r_[i0-K:i0, i0+2:i0+2+K]; x = zt[idx] - tq; xa, xb = zt[i0]-tq, zt[i0+1]-tq
    nu = int(max(300, 6*L*np.abs(x).max()/np.pi)); u = np.linspace(0, L, nu)[:, None]; base = np.exp(1j*u*x[None, :])
    eps = np.zeros(len(x)); res = []
    for delta in deltas:
        target = (np.exp(1j*u*xa) + np.exp(1j*u*xb) - 2*np.cosh(delta*u))[:, 0]
        f = lambda e: (np.exp(1j*u*(x+e)[None, :]) - base).sum(1) - target
        r = f(eps); cost = np.vdot(r, r).real; lam = 1e-8
        for it in range(iters):
            Jc = 1j*u*np.exp(1j*u*(x+eps)[None, :]); J = np.vstack([Jc.real, Jc.imag]); rr = np.concatenate([r.real, r.imag])
            U, s, Vt = np.linalg.svd(J, full_matrices=False); ok = False
            for _ in range(25):
                step = -Vt.T @ ((s/(s*s + lam)) * (U.T @ rr)); r2 = f(eps+step); c2 = np.vdot(r2, r2).real
                if c2 < cost: ok = True; break
                lam *= 10
            if not ok: break
            done = c2 > cost*(1-1e-9); eps, r, cost = eps+step, r2, c2; lam = max(lam/10, 1e-15)
            if done: break
        g = np.diff(np.sort(x+eps))
        row = dict(L=L, K=K, delta=delta, tq=float(tq), sup_E0=float(np.abs(target).max()), sup_E=float(np.abs(r).max()),
                   max_eps=float(np.abs(eps).max()), l2_eps=float(np.linalg.norm(eps)), min_gap_new=float(g.min()),
                   idx=idx.tolist(), pair=[int(i0), int(i0+1)], eps=eps.tolist())
        res.append(row)
        print(f"L={L:5.1f} K={K:3d} delta={delta:5.3f}: sup|E| {row['sup_E0']:.3g} -> {row['sup_E']:.3g}  max|eps|={row['max_eps']:.3g}  min new gap={row['min_gap_new']:.3g}", flush=True)
    return res
out = []
deltas = [0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.13, 0.16, 0.2, 0.25, 0.3, 0.375]
Ls = [float(a) for a in sys.argv[1:]] or [6.0, 8.0, 10.0, 12.0, 13.0, 14.0, 16.0]
tag = '_'.join(sys.argv[1:])
for L in Ls:
    for K in (40, 150, 400):
        out += run(L, K, deltas)
        json.dump(out, open(f'surgery2_{tag}.json', 'w'))
