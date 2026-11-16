# Probe-measure LP at t >= 0 with boundary domination (Theorem C) and a MODEL floor functional.
#   certificate:  -y' >= sum_i w_i S(x*+x_i, h_i, t) + r_w(0),   r_w(d) = 4y/(d^2+4y^2) - sum_i w_i K_{h_i}(d - x_i, y) >= 0  (all d)
#   model floor:  sum_i w_i S_i >= L W - (1/2) sum_{n<=Nc} Lam_t(n) n^{-1/2} |sum_i w_i n^{-h_i/2} cos((x_i/2) log n)| - (1/2) sum_i |w_i| Tail_i
#   Lam_t = formal log-derivative coefficients of sum_{n<=N} D_t(n) n^{-s}, D_t(n) = exp(-(t/4) log n (2 log N - log n)), N = 690988;
#   Tail_i = T_i - sum_{n<=Nc} Lam_t(n) n^{-(1+h_i)/2}, T_i = B_i/(1+A_i) at the real point including the reflected sum (Raymond's cone value).
# The model is NOT a certified floor: x = X only, cone positivity assumed, O(1/x) and Riemann-Siegel remainders dropped.
import numpy as np, json, sys, time, math
from scipy.optimize import linprog
X = 6000000185827.0; N = 690988; LN = math.log(X/(4*math.pi))/2; L = LN/2          # LN = log N (real), L = (1/4) log(X/4pi)
def K(h, d, b): return (h-b)/(d*d+(h-b)**2) + (h+b)/(d*d+(h+b)**2)
_cache = {}
def series(t):
    key = round(t*512000)
    if key in _cache: return _cache[key]
    n = np.arange(N+1, dtype=float); n[0] = 1; ln = np.log(n)
    D = np.exp(-(t/4)*ln*(2*LN - ln)); D[0] = 0
    lam = D*ln
    for e in range(2, N//2 + 1):
        le = lam[e]
        if le != 0.0:
            m = N//e; lam[2*e:m*e+1:e] -= D[2:m+1]*le
    _cache.clear(); _cache[key] = (ln, D, lam); return _cache[key]
def model(t, hs):
    """per-height real-point totals T(h) = B/(1+A) with reflected sum, and partial info"""
    ln, D, lam = series(t); out = {}
    n = np.arange(N+1, dtype=float); n[0] = 1
    for h in hs:
        c = D*n**(-(1+h)/2); c[0] = 0; c[1] = 0                      # n >= 2
        r = math.exp(-h*LN)*D*n**(-(1-h)/2); r[0] = 0                 # m >= 1 (reflected, relative to the leading term)
        A = c.sum() + r.sum(); B = (c*ln).sum() + (r*(2*LN - ln)).sum()
        out[h] = (B/(1+A), A, B, r.sum())
    return out
def lam_stats(t):
    ln, D, lam = series(t); return float(lam[2:].min()), int((lam[2:] < -1e-15).sum())
def solve(t, y, hs, xs, signed, Nc=400, wmax=50.0, verbose=False):
    ln, D, lam = series(t)
    probes = [(h, x) for h in hs for x in xs]; P = len(probes)
    hh = np.array([p[0] for p in probes]); xx = np.array([p[1] for p in probes])
    md = model(t, list(hs)); T = np.array([md[h][0] for h in hh])
    nn = np.arange(2, Nc+1, dtype=float); lnn = np.log(nn); lm = lam[2:Nc+1]
    assert lm.min() > -1e-12
    base = lm*nn**-0.5
    Fm = nn[:, None]**(-hh[None, :]/2)*np.cos(0.5*xx[None, :]*lnn[:, None])     # what(n) = Fm @ w
    part = (base[:, None]*nn[:, None]**(-hh[None, :]/2)).sum(0); tail = np.maximum(T - part, 0)
    ds = np.concatenate([[0.0], y*np.geomspace(1e-3, 1, 25), np.linspace(y, 12, 400)[1:], np.geomspace(12.2, 1e4, 120)])
    cols = np.array([0.5*(K(h, ds-x, y)+K(h, ds+x, y)) for h, x in probes]).T
    rhs = 4*y/(ds*ds+4*y*y); own = K(hh, xx, y); M = len(nn)
    g = L - own
    if signed:
        c = -np.concatenate([g - 0.5*tail, -g - 0.5*tail, -0.5*base])
        A1 = np.hstack([cols, -cols, np.zeros((len(ds), M))]); A2 = np.hstack([Fm, -Fm, -np.eye(M)]); A3 = np.hstack([-Fm, Fm, -np.eye(M)])
        far = np.concatenate([hh, -hh, np.zeros(M)])[None, :]; pos = np.concatenate([-np.ones(P), np.ones(P), np.zeros(M)])[None, :]
        Aub = np.vstack([A1, A2, A3, far, pos]); bub = np.concatenate([rhs, np.zeros(2*M), [2*y, 0]])
        bounds = [(0, wmax)]*(2*P) + [(0, None)]*M
    else:
        c = -np.concatenate([g - 0.5*tail, -0.5*base])
        A1 = np.hstack([cols, np.zeros((len(ds), M))]); A2 = np.hstack([Fm, -np.eye(M)]); A3 = np.hstack([-Fm, -np.eye(M)])
        far = np.concatenate([hh, np.zeros(M)])[None, :]
        Aub = np.vstack([A1, A2, A3, far]); bub = np.concatenate([rhs, np.zeros(2*M), [2*y]])
        bounds = [(0, None)]*(P + M)
    r = linprog(c, A_ub=Aub, b_ub=bub, bounds=bounds, method='highs')
    if r.x is None: return None
    w = r.x[:P] - (r.x[P:2*P] if signed else 0)
    # post-check on a finer grid; rescale w if the boundary inequality is violated between grid points
    df = np.concatenate([[0.0], y*np.geomspace(1e-4, 1, 200), np.linspace(y, 15, 6000), np.geomspace(15, 1e6, 2000)])
    sub = sum(wi*0.5*(K(h, df-x, y)+K(h, df+x, y)) for wi, (h, x) in zip(w, probes) if wi != 0)
    rf = 4*y/(df*df+4*y*y) - sub; viol = float((rf/(4*y/(df*df+4*y*y))).min())
    E = float(w @ g - 0.5*(np.abs(w) @ tail) - 0.5*(base @ np.abs(Fm @ w)))
    res = dict(E=E, W=float(w.sum()), TV=float(np.abs(w).sum()), mom=float(w @ hh), viol=viol, obj=float(-r.fun),
               top=[(float(hh[k]), float(xx[k]), float(w[k])) for k in np.argsort(-np.abs(w))[:8] if abs(w[k]) > 1e-6])
    return res
def f2_model(t, y, h, r, lam_k):
    """model value for the F2 configuration: two probes at x = +- r h, weight W = lam y/h, model joint floor"""
    hs = [h]; res = {}
    ln, D, lam = series(t); md = model(t, hs); T = md[h][0]
    nn = np.arange(2, N+1, dtype=float); lnn = ln[2:]; lm = lam[2:]
    joint = (lm*nn**(-(1+h)/2)*np.abs(np.cos(0.5*r*h*lnn))).sum()
    part = (lm*nn**(-(1+h)/2)).sum()
    ell_single = L - 0.5*T; ell_joint = L - 0.5*(joint + (T - part))
    W = lam_k*y/h; own = K(h, r*h, y)
    return dict(ell_single=float(ell_single), ell_joint=float(ell_joint), T=float(T), A=float(md[h][1]), refl=float(md[h][3]), E_model=float(W*(ell_joint - own)), W=W)
if __name__ == '__main__':
    cells = json.load(open(sys.argv[1])); out_path = sys.argv[2]; part = int(sys.argv[3]) if len(sys.argv) > 3 else 0; nparts = int(sys.argv[4]) if len(sys.argv) > 4 else 1
    out = []
    for ci, c in enumerate(cells):
        if ci % nparts != part: continue
        t0 = time.time(); t = c['t']; y = math.sqrt(c['q']); h0 = c['h']
        mn, nneg = lam_stats(t)
        fm = f2_model(t, y, h0, c['r'], c['lam'])
        rec = dict(k=c['k'], t=t, y=y, h_F2=h0, r_F2=c['r'], lam_F2=c['lam'], ell_F2=c['ell'], rate_F2=c['rate'], E_F2=c['rate']*y/2, f2model=fm, lam_min=mn, lam_neg=nneg,
                   ceiling=L/math.tanh(y*L) - 1/y)
        for tag, lo in (('hge', 1.0), ('free', 0.7)):
            hs = np.unique(np.round(np.concatenate([h0*lo*np.geomspace(1, 2.2, 10), h0*np.array([2.6, 3.2, 4.0, 5.5, 8.0])]), 6))
            if t == 0: hs = hs[hs > 1.04]
            xs = h0*np.linspace(0, 3.0, 16)
            for signed in (False, True):
                rec['%s_%s' % (tag, 'signed' if signed else 'pos')] = solve(t, y, hs, xs, signed)
            if tag == 'free': rec['free_signed3'] = solve(t, y, hs, xs, True, wmax=3.0)
        rec['sec'] = round(time.time() - t0, 1); out.append(rec)
        print(json.dumps(rec), flush=True)
    json.dump(out, open(out_path, 'w'))
