"""Test 3: Gram-point sign statistics against the prime-phase torus.

For F in {zeta, L(chi mod 5), DH}: Gram points theta_F(g_n) = n pi; Z_F from the approximate functional
equation (zeta: Riemann-Siegel main sum + C0 term), Q subpoints per Gram interval for sign-change counts.
At each Gram point: truncated torus function (primes <= Pc), coherent weight
C_eps = sum_{p <= Pc, |t log p mod 2pi| < eps} p^(-1/2), and the model 'F = F_P * exp(R)',
R Gaussian with variance v per component, v fitted to the unconditional bad rate.
"""
import sys, math, json, time, argparse
import numpy as np, mpmath as mp
import torus as T
from torus import xp

ap = argparse.ArgumentParser()
ap.add_argument('--heights', default='1e4,1e6,1e8,1e10,1e12')
ap.add_argument('--nblocks', type=int, default=40)
ap.add_argument('--blen', type=int, default=250)
ap.add_argument('--Q', type=int, default=8)
ap.add_argument('--Pc', type=float, default=1e5)
ap.add_argument('--eps', type=float, default=math.pi / 4)
ap.add_argument('--nhaar', type=int, default=20000)
ap.add_argument('--out', default='t3.json')
ap.add_argument('--seed', type=int, default=3)
a = ap.parse_args()
mp.mp.dps = 34
rng = np.random.default_rng(a.seed)
t00 = time.time()
Q = a.Q
OM5 = float(np.angle(T.W5) / 2)
FAMS = {'ZETA': dict(q=1, a=0, om=0.0), 'CHI': dict(q=5, a=1, om=OM5), 'DH': dict(q=5, a=1, om=0.0)}
pr = T.sieve(int(a.Pc)); hi, lo = T.fixed_logs(pr)
U = T.families(pr)
cuts = [c for c in (1e2, 1e3, 1e4, 1e5, 1e6) if c <= a.Pc]
wcoh = pr ** -0.5


def coherent(t_int, delta, haar_base=None, off=None, wt=None):
    """off: per-prime cycle offsets (twisted phases); wt: per-prime weights (default p^-1/2)."""
    K = len(t_int); out = np.empty(K); cnt = np.empty(K)
    l2 = xp.asarray(np.log(pr) / (2 * math.pi)); w = xp.asarray(wcoh if wt is None else wt)
    offx = None if off is None else xp.asarray(off)
    ck = max(1, int(3e7 // len(pr)))
    def body(i, j):
        C = T.base_cycles(t_int[i:j], hi, lo) if haar_base is None else xp.asarray(haar_base[i:j])
        C = C + xp.asarray(delta[i:j])[:, None] * l2[None, :]
        if offx is not None:
            C = C - offx[None, :]
        C = C - xp.floor(C + 0.5)
        m = (xp.abs(C) < a.eps / (2 * math.pi))
        out[i:j] = T.asnp((m * w[None, :]).sum(axis=1)); cnt[i:j] = T.asnp(m.sum(axis=1))

    for i in range(0, K, ck):
        T.retry(body, i, min(K, i + ck))
        T.free()
    return out, cnt


def wrapped_bad(arg, v):
    """P(cos(arg + N(0, v)) < 0)."""
    from math import erf
    sd = math.sqrt(max(v, 1e-12))
    arg = np.mod(arg + math.pi, 2 * math.pi) - math.pi
    p = np.zeros_like(arg)
    Phi = np.vectorize(lambda x: 0.5 * (1 + erf(x / math.sqrt(2))))
    for k in range(-4, 5):
        lo_, hi_ = math.pi / 2 + 2 * math.pi * k, 3 * math.pi / 2 + 2 * math.pi * k
        p += Phi((hi_ - arg) / sd) - Phi((lo_ - arg) / sd)
    return p


def fit_v(arg, rate):
    lo_, hi_ = 1e-4, 6.0
    for _ in range(40):
        mid = 0.5 * (lo_ + hi_)
        if wrapped_bad(arg, mid).mean() < rate:
            lo_ = mid
        else:
            hi_ = mid
    return 0.5 * (lo_ + hi_)


def gram_blocks(fam, Tb):
    q, aa, om = FAMS[fam]['q'], FAMS[fam]['a'], FAMS[fam]['om']
    gi, gd, gn = [], [], []
    for b in range(a.nblocks):
        t = mp.mpf(Tb) * (0.5 + 0.5 * rng.random())
        n0 = int(mp.floor(T.theta_F(t, q, aa, om) / mp.pi))
        g = T.gram_point(n0, q, aa, om, t0=t)
        blk = [g]
        for k in range(1, a.blen + 1):
            g = T.gram_point(n0 + k, q, aa, om, t0=g + mp.pi / (mp.log(q * g / (2 * mp.pi)) / 2))
            blk.append(g)
        gi.append([int(mp.floor(x)) for x in blk]); gd.append([float(x - mp.floor(x)) for x in blk])
        gn.append(n0)
    return np.array(gi, dtype=np.int64), np.array(gd), np.array(gn)


def zvalues(fam, t_int, delta, phase, lev, hp, lp):
    """Z_F at points t = t_int + delta where theta_F(t) (with omega subtracted) = phase."""
    t = t_int + delta
    if fam == 'ZETA':
        tau = np.sqrt(t / (2 * math.pi)); M = np.floor(tau).astype(np.int64); p = tau - M
        coef = np.ones((lev.N + 1, 1), dtype=complex); coef[0] = 0
        S = T.dir_sums(t_int, delta, 0.5, M, coef, lev, hp, lp)[:, 0]
        C0 = np.cos(2 * math.pi * (p * p - p - 1 / 16)) / np.cos(2 * math.pi * p)
        return 2 * (np.exp(1j * phase) * S).real + (-1.0) ** (M - 1) * tau ** -0.5 * C0, np.zeros(len(t))
    M = np.floor(np.sqrt(5 * t / (2 * math.pi))).astype(np.int64)
    nn = np.arange(lev.N + 1)
    coef = np.stack([T.chi5(nn), np.conj(T.chi5(nn))], axis=1)
    S = T.dir_sums(t_int, delta, 0.5, M, coef, lev, hp, lp)
    if fam == 'CHI':
        return 2 * (np.exp(1j * phase) * S[:, 0]).real, np.zeros(len(t))
    e = np.exp(1j * phase)
    z = T.DH_C1 * (e * S[:, 0] + T.W5 * np.conj(e * S[:, 0])) + T.DH_C2 * (e * S[:, 1] + np.conj(T.W5) * np.conj(e * S[:, 1]))
    return z.real, z.imag


res = {'meta': dict(vars(a)), 'rows': []}
heights = [float(h) for h in a.heights.split(',')]
Nmax = int(math.sqrt(5 * max(heights) / (2 * math.pi))) + 2
lev = T.Levels(Nmax); hp, lp = T.fixed_logs(lev.primes)
print(f'levels to {Nmax}, GPU={T.GPU}, {time.time()-t00:.0f}s', flush=True)

# checks against mpmath
chk = {}
HZ = int(min(1e8, max(heights)))
ti = np.array([HZ + 17 * k for k in range(40)], dtype=np.int64); dl = np.full(40, 0.37)
ph = np.array([float(mp.fmod(T.theta_F(int(x) + 0.37), 2 * mp.pi)) for x in ti])
zz, _ = zvalues('ZETA', ti, dl, ph, lev, hp, lp)
ref = np.array([float(mp.siegelz(int(x) + mp.mpf('0.37'))) for x in ti])
chk['zeta_Z_maxerr_1e8'] = float(np.abs(zz - ref).max())
ti = np.array([20000 + 13 * k for k in range(12)], dtype=np.int64); dl = np.full(12, 0.21)
chi = [0, 1, 1j, -1j, -1]; chib = [0, 1, -1j, 1j, -1]
ph = np.array([float(mp.fmod(T.theta_F(int(x) + 0.21, 5, 1, OM5), 2 * mp.pi)) for x in ti])
zc, _ = zvalues('CHI', ti, dl, ph, lev, hp, lp)
ph0 = np.array([float(mp.fmod(T.theta_F(int(x) + 0.21, 5, 1, 0.0), 2 * mp.pi)) for x in ti])
zd, zdi = zvalues('DH', ti, dl, ph0, lev, hp, lp)
rc, rd = [], []
for k, x in enumerate(ti):
    s = mp.mpc(0.5, int(x) + 0.21)
    L1, L2 = mp.dirichlet(s, chi), mp.dirichlet(s, chib)
    rc.append(complex(mp.exp(1j * (T.theta_F(int(x) + 0.21, 5, 1, OM5))) * L1))
    rd.append(complex(mp.exp(1j * T.theta_F(int(x) + 0.21, 5, 1, 0.0)) * (T.DH_C1 * L1 + T.DH_C2 * L2)))
rc = np.array(rc); rd = np.array(rd)
chk['chi_Z_maxerr_2e4'] = float(np.abs(zc - rc.real).max()); chk['chi_Z_ref_imag'] = float(np.abs(rc.imag).max())
chk['dh_Z_maxerr_2e4'] = float(np.abs(zd - rd.real).max()); chk['dh_Z_ref_imag'] = float(np.abs(rd.imag).max()); chk['dh_Z_imag'] = float(np.abs(zdi).max())
res['checks'] = chk
print('checks', chk, flush=True)

# Haar reference for the torus quantities
hb = rng.random((a.nhaar, len(pr)))
z0 = np.zeros(a.nhaar, dtype=np.int64); d0 = np.zeros(a.nhaar)
LH, _ = T.euler_logs(z0, d0, 0.5, [U['ZETA'], U['CHI'], U['CHIB']], pr, hi, lo, cuts, haar_base=hb)
CH, _ = coherent(z0, d0, haar_base=hb)
del hb
qs = np.quantile(CH, [0.25, 0.5, 0.75])
res['coh_quartiles_haar'] = qs.tolist()


def torus_value(fam, L):
    if fam == 'ZETA':
        return np.exp(L[:, 0, :])
    if fam == 'CHI':
        return np.exp(L[:, 1, :])
    return T.DH_C1 * np.exp(L[:, 1, :]) + T.DH_C2 * np.exp(L[:, 2, :])


CI = [0]


def model_bad(fam, L, v, nmc=48):
    """P(Re(F_P-model) < 0) with independent Gaussian remainders (variance v per component) on each Euler product."""
    if fam != 'DH':
        idx = 0 if fam == 'ZETA' else 1
        return wrapped_bad(L[:, idx, CI[0]].imag, v)
    r = np.random.default_rng(11)
    acc = np.zeros(L.shape[0])
    sd = math.sqrt(v)
    for _ in range(nmc):
        R1 = sd * (r.standard_normal(L.shape[0]) + 1j * r.standard_normal(L.shape[0]))
        R2 = sd * (r.standard_normal(L.shape[0]) + 1j * r.standard_normal(L.shape[0]))
        D = T.DH_C1 * np.exp(L[:, 1, CI[0]] + R1) + T.DH_C2 * np.exp(L[:, 2, CI[0]] + R2)
        acc += (D.real < 0)
    return acc / nmc


TASKS = [(Tb, fam) for Tb in heights for fam in FAMS]


def task(i):
    global rng
    Tb, fam = TASKS[i]
    rng = np.random.default_rng([a.seed, i])
    t1 = time.time()
    gi, gd, gn = gram_blocks(fam, Tb)                       # (nb, blen+1)
    nb, bl = a.nblocks, a.blen
    g = gi + gd
    jj = np.arange(Q) / Q
    tsub = g[:, :-1, None] + jj[None, None, :] * (g[:, 1:, None] - g[:, :-1, None])
    nidx = gn[:, None] + np.arange(bl)[None, :]
    phase = (np.mod(nidx, 2)[:, :, None] + jj[None, None, :]) * math.pi
    tl = g[:, -1]; pl = np.mod(gn + bl, 2) * math.pi
    tall = np.concatenate([tsub.reshape(-1), tl]); pall = np.concatenate([phase.reshape(-1), pl])
    base = gi[:, :-1, None] + np.zeros((1, 1, Q), dtype=np.int64)
    ti_all = np.concatenate([base.reshape(-1), gi[:, -1]])
    dl_all = tall - ti_all
    Z, Zi = zvalues(fam, ti_all, dl_all, pall, lev, hp, lp)
    Zs = Z[:nb * bl * Q].reshape(nb, bl, Q); Zl = Z[nb * bl * Q:]
    ext = np.concatenate([Zs.reshape(nb, bl * Q), Zl[:, None]], axis=1)
    sc = (np.sign(ext[:, 1:]) != np.sign(ext[:, :-1])).reshape(nb, bl, Q).sum(axis=2)
    sgn = np.where(np.mod(nidx, 2) == 0, 1.0, -1.0)
    val = sgn * Zs[:, :, 0]                                   # = F(1/2 + i g_n)
    tg_i = gi[:, :-1].reshape(-1); tg_d = gd[:, :-1].reshape(-1)
    L, _ = T.euler_logs(tg_i, tg_d, 0.5, [U['ZETA'], U['CHI'], U['CHIB']], pr, hi, lo, cuts)
    Ccoh, Ccnt = coherent(tg_i, tg_d)
    # natural (twisted) coherent weight: phases of chi(p) p^(-it); for DH the primes on which chi and chibar agree
    r5 = pr % 5
    if fam == 'ZETA':
        Ctw = Ccoh
    elif fam == 'CHI':
        Ctw, _ = coherent(tg_i, tg_d, off=np.angle(T.chi5(pr) + (r5 == 0)) / (2 * math.pi), wt=wcoh * (r5 != 0))
    else:
        Ctw, _ = coherent(tg_i, tg_d, off=np.where(r5 == 4, 0.5, 0.0), wt=wcoh * ((r5 == 1) | (r5 == 4)))
    print(f'task {fam} {Tb:g} done {time.time()-t1:.0f}s', flush=True)
    return dict(sc=sc, val=val, L=L, Ccoh=Ccoh, Ctw=Ctw, maxim=float(np.abs(Zi).max()), seconds=time.time() - t1)


if T.GPU or T.nworkers() == 1:
    RAW = [task(i) for i in range(len(TASKS))]
else:
    import multiprocessing as mpc
    with mpc.get_context('fork').Pool(min(T.nworkers(), len(TASKS))) as pool:
        RAW = pool.map(task, list(range(len(TASKS)))[::-1], chunksize=1)[::-1]

vfit = {}
for i, (Tb, fam) in enumerate(TASKS):
    if True:
        CI[0] = max([i_ for i_, c in enumerate(cuts) if c <= max(100.0, math.sqrt(Tb))])
        R = RAW[i]; sc, val, L, Ccoh = R['sc'], R['val'], R['L'], R['Ccoh']
        nb, bl = a.nblocks, a.blen
        bad = (val < 0)
        tv = torus_value(fam, L)
        badf = bad.reshape(-1)
        agree = [float(((tv[:, c].real < 0) == badf).mean()) for c in range(len(cuts))]
        rate = float(badf.mean())
        key = 'CHI' if fam == 'DH' else fam
        if fam != 'DH':
            v = fit_v(L[:, 0 if fam == 'ZETA' else 1, CI[0]].imag, rate); vfit[(key, Tb)] = v
        else:
            v = vfit[('CHI', Tb)]
        pm = model_bad(fam, L, v)
        LHm = model_bad(fam, LH, v)
        bins = np.digitize(Ccoh, qs); binsH = np.digitize(CH, qs)
        tab = []
        for b in range(4):
            m = bins == b; mh = binsH == b
            tab.append(dict(bin=b, n=int(m.sum()), actual=float(badf[m].mean()) if m.any() else None,
                            se=float(math.sqrt(max(badf[m].mean() * (1 - badf[m].mean()), 1e-9) / max(m.sum(), 1))) if m.any() else None,
                            model_orbit=float(pm[m].mean()) if m.any() else None, model_haar=float(LHm[mh].mean()),
                            torus_sign_orbit=float((tv[m, CI[0]].real < 0).mean()) if m.any() else None))
        Ctw = R['Ctw']; qt = np.quantile(Ctw, [0.25, 0.5, 0.75]); bt = np.digitize(Ctw, qt)
        tabtw = [dict(bin=b, n=int((bt == b).sum()), actual=float(badf[bt == b].mean()), se=float(math.sqrt(max(badf[bt == b].mean() * (1 - badf[bt == b].mean()), 1e-9) / max((bt == b).sum(), 1))),
                      model_orbit=float(pm[bt == b].mean()), mean_abs_F=float(np.abs(val.reshape(-1)[bt == b]).mean())) for b in range(4)]
        zpi = sc.mean()
        blockdef = sc.sum(axis=1) - bl
        nodef = np.repeat(blockdef >= 0, bl)
        row = dict(fam=fam, T=Tb, n_gram=int(badf.size), bad_rate=rate, bad_se=float(math.sqrt(rate * (1 - rate) / badf.size)),
                   gram_law_frac=float((sc == 1).mean()), frac0=float((sc == 0).mean()), frac2=float((sc == 2).mean()), frac3p=float((sc >= 3).mean()),
                   sign_changes_per_interval=float(zpi), blocks_with_deficit=int((blockdef < 0).sum()), block_deficit_total=int(blockdef.sum()),
                   bad_rate_no_deficit_blocks=float(badf[nodef].mean()) if nodef.any() else None, n_no_deficit=int(nodef.sum()),
                   agree_torus_sign=agree, cuts=cuts, v_fit=v, model_bad_orbit=float(pm.mean()), model_bad_haar=float(LHm.mean()),
                   torus_sign_bad_haar=float((torus_value(fam, LH)[:, CI[0]].real < 0).mean()), model_cut=cuts[CI[0]],
                   var_arg_torus_orbit=float(np.var(L[:, 0 if fam == 'ZETA' else 1, CI[0]].imag)), var_arg_torus_haar=float(np.var(LH[:, 0, CI[0]].imag)),
                   coh_mean_orbit=float(Ccoh.mean()), coh_mean_haar=float(CH.mean()), corr_bad_coh=float(np.corrcoef(badf, Ccoh)[0, 1]), corr_bad_coh_twisted=float(np.corrcoef(badf, Ctw)[0, 1]), corr_model_coh_twisted=float(np.corrcoef(pm, Ctw)[0, 1]), table_twisted=tabtw,
                   corr_logabsF_coh_twisted=float(np.corrcoef(np.log(np.abs(val.reshape(-1)) + 1e-300), Ctw)[0, 1]),
                   small_Z=int((np.abs(val) < 3 * (FAMS[fam]['q'] * Tb) ** -0.25).sum()), max_imag=R['maxim'], table=tab,
                   seconds=R['seconds'])
        res['rows'].append(row)
        print(json.dumps({k: row[k] for k in ('fam', 'T', 'n_gram', 'bad_rate', 'bad_se', 'gram_law_frac', 'sign_changes_per_interval', 'agree_torus_sign', 'v_fit', 'model_bad_orbit', 'model_bad_haar', 'corr_bad_coh', 'corr_bad_coh_twisted', 'corr_model_coh_twisted', 'corr_logabsF_coh_twisted', 'seconds')}), flush=True)
        json.dump(res, open(a.out, 'w'), indent=1)
print('done', time.time() - t00, flush=True)
