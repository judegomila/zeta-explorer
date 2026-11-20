"""s3 combinations 1 and 2: pair correlation against the Bogomolny-Keating / Conrey-Snaith two-point formula, and Var S.
Usage: pc.py OUT.json R dr SPEC...      SPEC = name:kind:path[:key[:tmin]]   kinds: odl, blk, heat, lz (as in the s1 lane)
Pair counts: for every zero i (left member) the number of zeros j > i with t_j - t_i in each bin of width dr up to R (unnormalised t).
Model for the expected count of right neighbours per left zero at height t:  rho dr [1 + (2/L^2) Re val(r)],  rho = L/2pi, L = log(q t/2pi),
  val(r) = -(1 - e^{-irL})/r^2 + [d(r) - B(r)] + e^{-irL} z(r);   GUE = first term;  DIAG = Re(d - B) = sum_{n=p^k, p!=q} log^2 p cos(r log n)/n + 1/r^2;
  OSC = Re(e^{-irL} z(r)), z = zeta(1+ir) zeta(1-ir) A(ir) [x Euler factor corrections at q] - 1/r^2.
Fits (weighted least squares, weights 1/GUE count; errors by jackknife over chunks):
  a      : data - GUE = a (DIAG + OSC)
  ad, ao : data - GUE = ad DIAG + ao OSC
  A_n    : data - GUE - (DIAG + OSC - sum_{n in S} lam2(n) cos(r log n)/n) = sum_{n in S} A_n cos(r log n)/n,  S = {2,...,13}
Var S: S(t) = N(t) - smooth, integrated exactly over t between zeros (S is linear in the unfolded variable between zeros)."""
import sys, math, json, time, numpy as np
import rmt
PI = math.pi
MERT = 0.2614972128476428
SN = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13]

def load(spec):
    p = spec.split(':'); name, kind, path = p[0], p[1], p[2]
    if kind == 'odl':
        t = np.loadtxt(path); x = (0.5 * t * np.log(t / (2 * PI)) - 0.5 * t - PI / 8 + 1 / (48 * t)) / PI + 1; q = 1; T0 = 0.0; d = t
    elif kind in ('blk', 'heat'):
        z = np.load(path); T0 = float(z['T0']); d = z['delta']; x = z['x']; q = 1
    elif kind == 'lz':
        z = np.load(path); d = z['t_' + p[3]]; x = z['x_' + p[3]]; q = 5; T0 = 0.0
    tmin = float(p[4]) if len(p) > 4 and p[4] else (1000.0 if T0 == 0 else -1.0)
    m = (T0 + d) >= tmin
    return dict(name=name, kind=kind, q=q, T0=T0, d=d[m], x=x[m])

class Model:
    def __init__(self, q, R, dr, sub=5):
        self.q = q; self.R = R; self.dr = dr; self.nb = int(round(R / dr)); self.sub = sub
        nx = int(R / 0.004)
        self.bk = rmt.BK(q, P=10 ** 6, xmax=R * 1.0005, nx=nx)
        rs = (np.arange(self.nb * sub) + 0.5) * (dr / sub)
        self.rs = rs
        ip = lambda f: np.interp(rs, self.bk.x, f.real) + 1j * np.interp(rs, self.bk.x, f.imag)
        self.d = ip(self.bk.D + 1 / self.bk.x ** 2) - ip(self.bk.B)        # complex, smooth
        self.z = ip(self.bk.Z - 1 / self.bk.x ** 2)
        lo = rs < self.bk.x[0]
        self.d[lo] = (self.bk.D + 1 / self.bk.x ** 2 - self.bk.B)[0]; self.z[lo] = (self.bk.Z - 1 / self.bk.x ** 2)[0]
        self.cosn = {n: np.cos(rs * math.log(n)) / n for n in SN}
    def binavg(self, f): return f.reshape(self.nb, self.sub).mean(1)
    def comps(self, L):
        """per left zero: expected counts per bin: GUE, DIAG, OSC, and cos_n basis (all multiplied by rho dr and 2/L^2 where relevant)"""
        rho = L / (2 * PI); c = rho * self.dr; rs = self.rs
        e = np.exp(-1j * rs * L)
        gue = c * (1 + (2 / L ** 2) * (-(1 - e) / rs ** 2).real)
        diag = c * (2 / L ** 2) * self.d.real
        osc = c * (2 / L ** 2) * (e * self.z).real
        cs = {n: c * (2 / L ** 2) * self.cosn[n] for n in SN}
        return self.binavg(gue), self.binavg(diag), self.binavg(osc), {n: self.binavg(v) for n, v in cs.items()}

def lam2(n, q):
    for p in (2, 3, 5, 7, 11, 13):
        m = n
        while m % p == 0: m //= p
        if m == 1: return 0.0 if p == q else math.log(p) ** 2
    return 0.0

def pair_counts(t, nb, dr, i0, i1):
    """histogram of t_j - t_i for i in [i0, i1), j > i"""
    h = np.zeros(nb, dtype=np.int64); R = nb * dr; k = 1; n = len(t)
    while True:
        hi = min(i1, n - k)
        if hi <= i0: break
        dd = t[i0 + k: hi + k] - t[i0:hi]
        m = dd < R
        if not m.any(): break
        h += np.bincount((dd[m] / dr).astype(np.int64), minlength=nb)[:nb]
        k += 1
    return h

def analyse(lst, R, dr, models, nchunk=40, log=print):
    q = lst['q']; d = lst['d']; x = lst['x']; T0 = lst['T0']
    if q not in models: models[q] = Model(q, R, dr)
    M = models[q]; nb = M.nb
    n = len(d); nuse = int(np.searchsorted(d, d[-1] - R))       # left members with complete neighbourhoods
    edges = np.linspace(0, nuse, nchunk + 1).astype(int)
    stats = []
    for c in range(nchunk):
        i0, i1 = edges[c], edges[c + 1]
        h = pair_counts(d, nb, dr, i0, i1)
        Lv = np.log(q * (T0 + d[i0:i1]) / (2 * PI))
        Lr = np.round(Lv, 3); u, cnt = np.unique(Lr, return_counts=True)
        gue = np.zeros(nb); diag = np.zeros(nb); osc = np.zeros(nb); cs = {k: np.zeros(nb) for k in SN}
        for Lu, cu in zip(u, cnt):
            g, dg, oc, cc = M.comps(float(Lu))
            gue += cu * g; diag += cu * dg; osc += cu * oc
            for k in SN: cs[k] += cu * cc[k]
        w = 1.0 / np.maximum(gue, 1e-6)
        y = h - gue
        st = dict(n=i1 - i0)
        b = diag + osc
        st['s1'] = (float((w * b * y).sum()), float((w * b * b).sum()))
        X2 = np.stack([diag, osc], 1)
        st['s2'] = ((X2 * w[:, None]).T @ X2, (X2 * w[:, None]).T @ y)
        rest = b - sum(lam2(k, q) * cs[k] for k in SN)
        Xn = np.stack([cs[k] for k in SN], 1)
        st['sn'] = ((Xn * w[:, None]).T @ Xn, (Xn * w[:, None]).T @ (y - rest))
        st['chi2_gue'] = float((w * y * y).sum()); st['chi2_bk'] = float((w * (y - b) ** 2).sum())
        stats.append(st)
        if c % 10 == 0: log('   chunk %d/%d pairs %d' % (c, nchunk, int(h.sum())))
    def solve(sel):
        a1 = sum(stats[i]['s1'][0] for i in sel) / sum(stats[i]['s1'][1] for i in sel)
        A2 = sum(stats[i]['s2'][0] for i in sel); b2 = sum(stats[i]['s2'][1] for i in sel)
        An = sum(stats[i]['sn'][0] for i in sel); bn = sum(stats[i]['sn'][1] for i in sel)
        return np.concatenate([[a1], np.linalg.solve(A2, b2), np.linalg.solve(An, bn)])
    full = solve(range(nchunk))
    jk = np.array([solve([i for i in range(nchunk) if i != j]) for j in range(nchunk)])
    se = np.sqrt((nchunk - 1) / nchunk * ((jk - jk.mean(0)) ** 2).sum(0))
    res = dict(name=lst['name'], q=q, T_lo=float(T0 + d[0]), T_hi=float(T0 + d[-1]), n_zeros=int(n), R=R, dr=dr,
               a=[float(full[0]), float(se[0])], a_diag=[float(full[1]), float(se[1])], a_osc=[float(full[2]), float(se[2])],
               A_n={str(k): [float(full[3 + i]), float(se[3 + i]), lam2(k, q)] for i, k in enumerate(SN)},
               chi2_gue=sum(s['chi2_gue'] for s in stats), chi2_bk=sum(s['chi2_bk'] for s in stats), nbins_total=nb * nchunk)
    return res

def var_S(lst, nchunk=40):
    """exact time-average of S and S^2 (measure dx); S(x_n +) = n - x_n + c"""
    x = lst['x']; n = len(x)
    a = np.arange(n - 1) - x[:-1]          # S just after zero n (up to c)
    b = np.arange(n - 1) - x[1:]           # S just before zero n+1
    dx = np.diff(x)
    m1 = dx * (a + b) / 2; m2 = dx * (a * a + a * b + b * b) / 3
    edges = np.linspace(0, n - 1, nchunk + 1).astype(int)
    S0 = np.array([dx[edges[i]:edges[i + 1]].sum() for i in range(nchunk)])
    S1 = np.array([m1[edges[i]:edges[i + 1]].sum() for i in range(nchunk)])
    S2 = np.array([m2[edges[i]:edges[i + 1]].sum() for i in range(nchunk)])
    def var(sel):
        s0 = S0[sel].sum(); mu = S1[sel].sum() / s0
        return S2[sel].sum() / s0 - mu * mu
    v = var(np.arange(nchunk))
    jk = np.array([var(np.array([i for i in range(nchunk) if i != j])) for j in range(nchunk)])
    se = math.sqrt((nchunk - 1) / nchunk * ((jk - jk.mean()) ** 2).sum())
    # variance with the mean removed separately in each chunk (insensitive to a missed zero or a drift)
    vloc = float(np.mean(S2 / S0 - (S1 / S0) ** 2))
    q = lst['q']; t = lst['T0'] + lst['d']
    LL = float(np.mean(np.log(np.log(q * t / (2 * PI)))))
    LLT = float(np.mean(np.log(np.log(t))))
    ps = rmt.primes_upto(10 ** 6).astype(float)
    P2 = float(sum(np.sum(ps ** -k) / k ** 2 for k in range(2, 40)))
    Mq = MERT - (1.0 / q if q > 1 else 0.0); P2q = P2 - (sum(q ** -k / k ** 2 for k in range(2, 60)) if q > 1 else 0.0)
    K = 2 * PI ** 2 * v - LL - Mq - P2q
    return dict(name=lst['name'], q=q, n_zeros=int(n), T_mid=float(np.median(t)), var_S=v, se=se, var_S_chunk_mean_removed=vloc,
                mean_loglog_qT_2pi=LL, mean_loglog_T=LLT, M_q=Mq, P2_q=P2q, K_with_loglog_qT_over_2pi=K, K_se=2 * PI ** 2 * se,
                K_with_loglog_T=2 * PI ** 2 * v - LLT - Mq - P2q, S_min=float((b - (S1.sum() / S0.sum())).min()), S_max=float((a - (S1.sum() / S0.sum())).max()),
                L_mean=float(np.mean(np.log(q * t / (2 * PI)))))

def var_S_tnr(lst, step=0.125):
    """S_zeta and S_zeta + sawtooth of the T-NR factor (N_P(t) - t log 3/pi), sampled on a uniform grid in t"""
    d = lst['d']; x = lst['x']; T0 = lst['T0']; n = len(d)
    h = (d[-1] - d[0]) / n * step
    out = []; CH = 4_000_000
    s0 = s1 = s2 = c1 = c2 = cz = 0.0; m = 0
    per = 2 * PI / math.log(3)
    T0m = math.fmod(T0, per)
    g = d[0] + h * np.arange(int((d[-1] - d[0]) / h))
    for i in range(0, len(g), CH):
        gg = g[i:i + CH]
        cnt = np.searchsorted(d, gg, side='right')
        S = cnt - np.interp(gg, d, x)
        tt = T0m + gg
        saw = 2 * np.floor((tt + per / 2) / per) - tt * math.log(3) / PI
        m += len(gg); s1 += S.sum(); s2 += (S * S).sum(); c1 += saw.sum(); c2 += (saw * saw).sum(); cz += (S * saw).sum()
    vS = s2 / m - (s1 / m) ** 2; vsaw = c2 / m - (c1 / m) ** 2; cov = cz / m - (s1 / m) * (c1 / m)
    return dict(name=lst['name'], var_S_sampled=vS, var_saw=vsaw, cov=cov, var_S_TNR_argument_principle=vS + vsaw + 2 * cov)

if __name__ == '__main__':
    out = sys.argv[1]; R = float(sys.argv[2]); dr = float(sys.argv[3])
    models = {}; res = []
    t0 = time.time()
    for spec in sys.argv[4:]:
        lst = load(spec)
        print('list', lst['name'], len(lst['d']), 'zeros', flush=True)
        r = dict(spec=spec)
        r['varS'] = var_S(lst); print('  varS', json.dumps(r['varS']), flush=True)
        if lst['q'] == 1 and lst['kind'] != 'heat': r['tnr'] = var_S_tnr(lst); print('  tnr', json.dumps(r['tnr']), flush=True)
        r['pc'] = analyse(lst, R, dr, models, log=lambda s: print(s, flush=True)); print('  pc', json.dumps(r['pc']), '%.0fs' % (time.time() - t0), flush=True)
        res.append(r)
        json.dump(res, open(out, 'w'), indent=1)
