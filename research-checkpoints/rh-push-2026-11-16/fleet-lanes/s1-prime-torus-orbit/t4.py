"""Test 4: minimal recurrence distance on a disc in the strip.

Stage A (torus): return times of the flow tau -> (tau log p)_p to the origin in the weighted metric
  D_m(tau)^2 = sum_{i<=m} p_i^(-2 sigma0) |1 - p_i^(i tau)|^2, searched on the lattice tau_k = 2 pi k / log 2
  (exact return of p = 2), k <= Tmax log 2 / (2 pi), then refined in tau. The same return times serve every
  twist of an Euler product (a rotation of the torus is an isometry).
Stage B (functions): d_F(tau) = max_{|z|=r} |F(s0+z+i tau) - F(s0+z)| / max_{|z|=r} |F(s0+z)| at the stage-A
  candidates and at random tau, for zeta, L(chi), DH, T-NR, E_a (approximate functional equation; mpmath below
  height 3e4) and for the truncated Euler products of the sign and unimodular twists.
"""
import sys, math, json, time, argparse
import numpy as np, mpmath as mp
import torus as T
from torus import xp

ap = argparse.ArgumentParser()
ap.add_argument('--Tmax', type=float, default=1e12)
ap.add_argument('--sigma0', type=float, default=0.75)
ap.add_argument('--r', type=float, default=0.08)
ap.add_argument('--tb', type=float, default=1000.3)
ap.add_argument('--npts', type=int, default=12)
ap.add_argument('--P', type=float, default=1e6)
ap.add_argument('--nrand', type=int, default=40)
ap.add_argument('--topk', type=int, default=3)
ap.add_argument('--out', default='t4.json')
a = ap.parse_args()
mp.mp.dps = 34
t00 = time.time()
MS = [4, 6, 8, 12, 16]
p16 = T.sieve(60)[:16]
w = p16 ** (-a.sigma0)

# ------------------------------------------------------------------ stage A
gh, gl = T.fixed_logs(p16, denom='log2')
Kmax = int(a.Tmax * math.log(2) / (2 * math.pi))
CK = (1 << 24) if T.GPU else (1 << 22)
ghs = [np.uint64(x) for x in gh]; gls = [np.uint64(x) for x in gl]


def scan_chunk(c0, c1, B2):
    best = {}
    k = xp.arange(c0, c1, dtype=xp.uint64)
    D2 = xp.zeros(len(k))
    for i in range(1, 16):
        u = k * ghs[i] + ((k * gls[i]) >> np.uint64(24))
        c = (u >> np.uint64(11)).astype(xp.float64) * (2.0 ** -53)
        D2 += (4 * w[i] ** 2) * xp.sin(math.pi * c) ** 2
        if B2 < np.inf:
            keep = D2 < B2
            k = k[keep]; D2 = D2[keep]
        if len(k) == 0:
            break
        if i + 1 in MS:
            nt = min(a.topk, len(k))
            idx = xp.argpartition(D2, nt - 1)[:nt]
            kk = T.asnp(k[idx]); dd = T.asnp(D2[idx])
            best[i + 1] = [(int(x), float(y)) for x, y in zip(kk, dd)]
    return best


def scan(k0, k1, B2):
    """Lattice points k0 <= k < k1: smallest partial distances D_m^2 for m in MS among the points whose partial
    sums stay below B2 (branch and bound; B2 = inf keeps every point). Returns {m: [(k, D2)]}."""
    best = {m: [] for m in MS}
    for c0 in range(k0, k1, CK):
        r = T.retry(scan_chunk, c0, min(k1, c0 + CK), B2)
        T.free()
        for m, v in r.items():
            best[m] += v
    return {m: sorted(v, key=lambda x: x[1])[:a.topk] for m, v in best.items()}


def seg(args):
    return scan(*args)


tops = {m: [] for m in MS}
# pilot: every lattice point up to KP, in geometric blocks, no pruning
KP = min(Kmax, 10 ** 7)
k0 = 1; ck = 8
while k0 <= KP:
    k1 = min(KP + 1, k0 + ck)
    r = scan(k0, k1, np.inf)
    for m in MS:
        tops[m] += r[m]
    k0 = k1; ck *= 2
pilot16 = min(d for k, d in tops[16])
B2 = 1.69 * pilot16          # (1.3 x pilot minimum of D_16)^2: a point pruned by it cannot be the minimum of any D_m
print(f'pilot to k={KP:.1e}: min D_16 = {math.sqrt(pilot16):.4f}; pruning bound D < {math.sqrt(B2):.4f}', flush=True)
if Kmax > KP:
    edges = [KP + 1]
    while edges[-1] <= Kmax:
        edges.append(min(Kmax + 1, int(edges[-1] * 1.25) + 1))
    jobs = [(edges[i], edges[i + 1], B2) for i in range(len(edges) - 1)]
    if T.GPU:
        for n_, j in enumerate(jobs):
            r = scan(*j)
            for m in MS:
                tops[m] += r[m]
            if n_ % 5 == 0:
                print(f'segment {n_}/{len(jobs)} {time.time()-t00:.0f}s', flush=True)
    else:
        import multiprocessing as mpc
        with mpc.get_context('fork').Pool(T.nworkers()) as pool:
            for r in pool.imap_unordered(seg, jobs[::-1], chunksize=1):
                for m in MS:
                    tops[m] += r[m]
print(f'stage A: lattice points {Kmax:.3e}, {time.time()-t00:.0f}s', flush=True)
LOG = [mp.log(int(p)) for p in p16]


def Dm(tau, m):
    return mp.sqrt(sum(mp.mpf(float(w[i])) ** 2 * abs(1 - mp.e ** (1j * tau * LOG[i])) ** 2 for i in range(m)))


def refine(k, m):
    c = 2 * mp.pi * k / mp.log(2)
    lo_, hi_ = c - mp.mpf('0.3'), c + mp.mpf('0.3')
    gr = (mp.sqrt(5) - 1) / 2
    x1, x2 = hi_ - gr * (hi_ - lo_), lo_ + gr * (hi_ - lo_)
    f1, f2 = Dm(x1, m), Dm(x2, m)
    for _ in range(60):
        if f1 < f2:
            hi_, x2, f2 = x2, x1, f1; x1 = hi_ - gr * (hi_ - lo_); f1 = Dm(x1, m)
        else:
            lo_, x1, f1 = x1, x2, f2; x2 = lo_ + gr * (hi_ - lo_); f2 = Dm(x2, m)
    x = (lo_ + hi_) / 2
    return x, Dm(x, m)


decs = [10.0 ** e for e in range(1, int(round(math.log10(a.Tmax))) + 1)]
stageA = {}
cands = {}
for m in MS:
    L = sorted(tops[m])
    recs = []; best = 1e9
    for k, d in L:
        if d < best:
            best = d; recs.append(k)
    # also the smallest few in each decade
    per = []
    for Td in decs:
        sub = sorted([(d, k) for k, d in L if Td / 10 < 2 * math.pi * k / math.log(2) <= Td])[:4]
        per += [k for d, k in sub]
    ks = sorted(set(recs + per))
    ref = [(k,) + refine(k, m) for k in ks]
    curve = []
    for Td in decs:
        v = [float(D) for k, tau, D in ref if tau <= Td]
        curve.append(min(v) if v else None)
    stageA[m] = dict(n_cand=len(ks), record_curve=curve)
    cands[m] = ref
    xs = [math.log(Td) for Td, c in zip(decs, curve) if c]; ys = [math.log(c) for c in curve if c]
    sl = float(np.polyfit(xs[-8:], ys[-8:], 1)[0]) if len(xs) >= 6 else None
    stageA[m]['slope'] = sl; stageA[m]['minus_one_over_m'] = -1 / m; stageA[m]['norm'] = float(math.sqrt(2 * (w[:m] ** 2).sum()))
    print(f'm={m} cands={len(ks)} slope={sl} curve={[round(c,4) if c else None for c in curve]}', flush=True)

# ------------------------------------------------------------------ stage B
rng = np.random.default_rng(4)
mB = 12
taus = [(tau, 'rec', float(D)) for k, tau, D in cands[mB]] + [(tau, 'rec16', float(D)) for k, tau, D in cands[16]] + [(tau, 'rec8', float(D)) for k, tau, D in cands[8]]
for Td in decs[1:]:
    for _ in range(a.nrand):
        taus.append((mp.mpf(Td) * mp.mpf(float(0.1 + 0.9 * rng.random())), 'rand', None))
ntau = len(taus)
ang = 2 * math.pi * np.arange(a.npts) / a.npts
zdisc = a.r * np.exp(1j * ang)
AE = 0.15
chi = [0, 1, 1j, -1j, -1]; chib = [0, 1, -1j, 1j, -1]
mT = lambda s: mp.mpf(3) ** (s - 0.5) + T.TNR_C + mp.mpf(3) ** (0.5 - s)
# DH zero in the strip near 0.8085 + 85.6993 i
DHf = lambda s: T.DH_C1 * mp.dirichlet(s, chi) + T.DH_C2 * mp.dirichlet(s, chib)
zdh = mp.findroot(DHf, mp.mpc(0.8085, 85.6993))
discs = {'main': mp.mpc(a.sigma0, a.tb), 'tnr_zero': mp.mpc(0.5 + T.TNR_B, mp.pi / mp.log(3)), 'dh_zero': zdh}
print('DH zero used:', zdh, flush=True)

# point list: for each disc, each tau (and tau = 0 for the base), each boundary point, shifts 0, +AE, -AE (main disc only)
pts = []       # (disc, itau(-1 = base), j, shift, s as mpc)
for dn, s0 in discs.items():
    shifts = [0.0, AE, -AE] if dn == 'main' else [0.0]
    for it in range(-1, ntau):
        tau = mp.mpf(0) if it < 0 else taus[it][0]
        for j in range(a.npts):
            for sh in shifts:
                pts.append((dn, it, j, sh, s0 + mp.mpc(float(zdisc[j].real) + sh, float(zdisc[j].imag)) + 1j * tau))
K = len(pts)
sig = np.array([float(p[4].real) for p in pts]); tim = [p[4].imag for p in pts]
ti = np.array([int(mp.floor(x)) for x in tim], dtype=np.int64); dl = np.array([float(x - mp.floor(x)) for x in tim])
tt = ti + dl
print(f'stage B: {ntau} tau values, {K} points, max height {tt.max():.3e}', flush=True)
LOWT = 2e5
low = tt < LOWT
vals = {f: np.zeros(K, dtype=complex) for f in ('ZETA', 'CHI', 'CHIB')}
il = np.nonzero(low)[0]
sl_ = np.array([complex(pts[i][4]) for i in il])
vals['ZETA'][il] = T.zeta_low(sl_)
i5 = np.array([n for n, i in enumerate(il) if pts[i][3] == 0.0])
vals['CHI'][il[i5]] = T.chi5_low(sl_[i5]); vals['CHIB'][il[i5]] = T.chi5_low(sl_[i5], conj=True)
print(f'low points done ({int(low.sum())}), {time.time()-t00:.0f}s', flush=True)
hiq = np.nonzero(~low)[0]
errs = {}
if len(hiq):
    Nz = int(math.sqrt(tt.max() / (2 * math.pi))) + 2; N5 = int(math.sqrt(5 * tt.max() / (2 * math.pi))) + 2
    lev = T.Levels(N5); hp, lp = T.fixed_logs(lev.primes)
    nn = np.arange(N5 + 1)
    one = np.ones((N5 + 1, 1), dtype=complex); one[0] = 0
    M = np.floor(np.sqrt(tt[hiq] / (2 * math.pi))).astype(np.int64)
    S1 = T.dir_sums(ti[hiq], dl[hiq], sig[hiq], M, one, lev, hp, lp)[:, 0]
    S2 = T.dir_sums(ti[hiq], dl[hiq], 1 - sig[hiq], M, one, lev, hp, lp)[:, 0]
    X = np.array([complex(T.X_factor(pts[i][4], 1, 0, 1.0)) for i in hiq])
    vals['ZETA'][hiq] = S1 + X * np.conj(S2)
    h0 = np.array([i for i in hiq if pts[i][3] == 0.0])
    M5 = np.floor(np.sqrt(5 * tt[h0] / (2 * math.pi))).astype(np.int64)
    cf = np.stack([T.chi5(nn), np.conj(T.chi5(nn))], axis=1)
    A1 = T.dir_sums(ti[h0], dl[h0], sig[h0], M5, cf, lev, hp, lp)
    A2 = T.dir_sums(ti[h0], dl[h0], 1 - sig[h0], M5, cf, lev, hp, lp)
    X5 = np.array([complex(T.X_factor(pts[i][4], 5, 1, complex(T.W5))) for i in h0])
    X5b = np.array([complex(T.X_factor(pts[i][4], 5, 1, complex(np.conj(T.W5)))) for i in h0])
    vals['CHI'][h0] = A1[:, 0] + X5 * np.conj(A2[:, 0])
    vals['CHIB'][h0] = A1[:, 1] + X5b * np.conj(A2[:, 1])
    # measured error of the approximate functional equation against mpmath at the lowest such heights
    order = hiq[np.argsort(tt[hiq])][:24]
    ez = float(np.abs(T.zeta_low(np.array([complex(pts[i][4]) for i in order])) - vals['ZETA'][order]).max())
    o5 = [i for i in order if pts[i][3] == 0.0][:6]
    e5 = float(np.abs(T.chi5_low(np.array([complex(pts[i][4]) for i in o5])) - vals['CHI'][np.array(o5)]).max()) if o5 else None
    errs = dict(afe_zeta_err_at=float(tt[order].max()), afe_zeta_err=float(ez), afe_chi_err=float(e5) if e5 is not None else None)
    print('AFE check', errs, f'{time.time()-t00:.0f}s', flush=True)
# truncated Euler products of the twists
pr = T.sieve(int(a.P)); hi, lo = T.fixed_logs(pr, cache=f'flog_{int(a.P)}.npz')
U = T.families(pr)
i0 = np.array([i for i in range(K) if pts[i][3] == 0.0])
EL, e3 = T.euler_logs(ti[i0], dl[i0], sig[i0], [U['SGN'], U['UNI'], U['ZETA']], pr, hi, lo, [a.P])
pos = {i: n for n, i in enumerate(i0)}
print(f'euler logs done, {time.time()-t00:.0f}s', flush=True)

index = {}
for i, p in enumerate(pts):
    index[(p[0], p[1], p[2], p[3])] = i


def fam_value(f, dn, it, j):
    i = index[(dn, it, j, 0.0)]
    if f in ('ZETA', 'CHI'):
        return vals[f][i]
    if f == 'DH':
        return T.DH_C1 * vals['CHI'][i] + T.DH_C2 * vals['CHIB'][i]
    if f == 'TNR':
        return vals['ZETA'][i] * complex(mT(pts[i][4]))
    if f == 'EA':
        return vals['ZETA'][index[(dn, it, j, AE)]] * vals['ZETA'][index[(dn, it, j, -AE)]]
    if f == 'SGN_P':
        return np.exp(EL[pos[i], 0, 0])
    if f == 'UNI_P':
        return np.exp(EL[pos[i], 1, 0])
    if f == 'ZETA_P':
        return np.exp(EL[pos[i], 2, 0])


out = {'meta': dict(vars(a)), 'stageA': stageA, 'afe': errs, 'discs': {k: [float(v.real), float(v.imag)] for k, v in discs.items()}, 'B': {}}
for dn in discs:
    fams = ['ZETA', 'CHI', 'DH', 'TNR', 'EA', 'SGN_P', 'UNI_P', 'ZETA_P'] if dn == 'main' else ['ZETA', 'DH', 'TNR']
    for f in fams:
        base = np.array([fam_value(f, dn, -1, j) for j in range(a.npts)])
        nb = np.abs(base).max(); mn = np.abs(base).min()
        wind = float(np.sum(np.angle(np.roll(base, -1) / base)) / (2 * math.pi))
        d = np.array([np.abs(np.array([fam_value(f, dn, it, j) for j in range(a.npts)]) - base).max() / nb for it in range(ntau)])
        rec = {}
        for kind in ('rec', 'rec16', 'rec8', 'rand'):
            cur = []
            for Td in decs:
                v = [d[it] for it in range(ntau) if taus[it][1] == kind and taus[it][0] <= Td]
                cur.append(float(min(v)) if v else None)
            rec[kind] = cur
        rmed = float(np.median([d[it] for it in range(ntau) if taus[it][1] == 'rand']))
        allc = [min([x for x in (rec['rec'][i], rec['rec16'][i], rec['rec8'][i]) if x is not None], default=None) for i in range(len(decs))]
        xs = [math.log(Td) for Td, c in zip(decs, allc) if c]; ys = [math.log(c) for c in allc if c]
        sl = float(np.polyfit(xs[-8:], ys[-8:], 1)[0]) if len(xs) >= 6 else None
        best_it = int(np.argmin(d))
        out['B'][f'{dn}|{f}'] = dict(base_max=float(nb), base_min=float(mn), winding=wind, rouche_threshold=float(mn / nb), curves=rec, best_curve=allc,
                                     slope=sl, random_median=rmed, best=float(d.min()), best_tau=float(taus[best_it][0]), best_kind=taus[best_it][1])
        print(dn, f, 'winding', round(wind, 2), 'rouche', round(mn / nb, 3), 'rand med', round(rmed, 3), 'best', [round(c, 3) if c else None for c in allc], 'slope', sl, flush=True)
out['decades'] = decs
out['taus'] = [(float(t), k, D) for t, k, D in taus]
json.dump(out, open(a.out, 'w'), indent=1)
print('done', time.time() - t00, flush=True)
