#!/usr/bin/env python3
"""fam.py k outdir -- target-family scan of the theta-row form at path point k (Q_k, R_k = Q_k^1.4), built from the
per-conductor twisted sums S_sigma(c; Q_k) stored by r2-tro6-nonpolar-scale (read-only).

For a unimodular target nu on the squarefree primary conductors c:
    X_sigma(nu) = sum_c nu(c) x_sigma(c),   x_sigma(c) = alpha(c) gamma_2(c) w_k(c) y_sigma(c),
    y = leave-one-out twisted sum (variant 'loo') or the same minus the band projection on pred(c) (variant 'band').
    t_sigma(nu) = |X_sigma(nu)|^2 / sum_c |x_sigma(c)|^2          (random unimodular nu: E t = 1, t ~ Exp(1))
Families: F1 all Dirichlet characters modulo split primes pi (N(pi) <= PMAX) evaluated on the primary generator;
F1s the same with node labels shuffled (null); F2 alpha^k N^{iv} (2-D FFT); F2r the same on the theta (aligned) row;
F3 sextic symbols chi_c(y)^j; ST random completely multiplicative (Steinhaus); IID random phases.
"""
import os, sys, math, time
for v in ('OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[v] = '1'
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
R2 = os.path.expanduser('~/rh-push/r2-tro6-nonpolar-scale')
sys.path.insert(0, os.path.join(HERE, 'sx'))
import alib as A, zomega as Z
k = int(sys.argv[1]); outd = sys.argv[2]
PMAX = int(os.environ.get('PMAX', 1000)); YMAX = int(os.environ.get('YMAX', 3000)); NDRAW = 150
NA, NV, KA, JV = 1024, 4096, 30, 150
WCUT = 1.6
t0 = time.time()
def P(*a): print(f"[k={k} {time.time()-t0:6.0f}s]", *a, flush=True)
T = A.SFTable(os.path.join(R2, 'sextic/data/sf_1e7.npz'))
nd = np.load(os.path.join(R2, 'out/nodes.npz')); stc = np.load(os.path.join(R2, 'out/static.npz'))
perm = nd['perm']; Np = nd['Np']; clsp = nd['clsp'].astype(np.int64); shp = nd['shp'].astype(np.int64); pred = nd['pred']
Qs = stc['Qs']; Rs = stc['Rs']; grid = stc['grid'].astype(float); nsh = len(grid); cop = [stc['cls_even'], stc['cls_odd']]
types = [str(x) for x in stc['types']]; TA = types.index('a')
n = len(Np); Nf = Np.astype(float)
nap = T.na[perm].astype(np.int64); nbp = T.nb[perm].astype(np.int64); g2p = T.g2[perm]
alpha = ((nap - nbp / 2.0) + 1j * (nbp * math.sqrt(3) / 2.0)) / np.sqrt(Nf)
parp = ((Np - 1) // 6) % 2
key = parp * (nsh * 12) + shp * 12 + clsp
assert (np.diff(key) >= 0).all()
R = Rs[k]
s_lo = max(int(np.searchsorted(grid, R * math.exp(-WCUT), 'left')), 1)
s_hi = min(int(np.searchsorted(grid, R * math.exp(WCUT), 'left')), nsh - 1)
sn = np.load(os.path.join(R2, f'out/snap_{k:02d}.npz'))
S = sn['S']; selfacc = sn['selfacc']; FSr = sn['FS']; SELFr = sn['SELF']
VAR = ['loo', 'band']; STR = ['p6', 'np6', 'all']
blk = []
for p in (0, 1):
    lo = int(np.searchsorted(key, p * nsh * 12 + s_lo * 12, 'left')); hi = int(np.searchsorted(key, p * nsh * 12 + s_hi * 12 + 11, 'right'))
    nw = hi - lo
    w = np.exp(-2 * np.log(Nf[lo:hi] / R) ** 2) / np.sqrt(Nf[lo:hi])
    y = np.empty((3, nw, 6), complex)
    for st in (0, 1):
        y[st] = S[st, lo:hi, :]
        for i, sg in enumerate(cop[p]):
            msk = clsp[lo:hi] == sg
            y[st, msk, i] -= (pred[lo:hi] * selfacc[st, lo:hi])[msk]
    y[2] = y[0] + y[1]
    cell = key[lo:hi] - key[lo]; ncell = int(cell.max()) + 1
    cc = np.bincount(cell, minlength=ncell).astype(float); cc[cc == 0] = 1
    yb = np.empty_like(y); cp = np.conj(pred[lo:hi])
    for st in range(3):
        for i in range(6):
            z = y[st, :, i] * cp
            K = (np.bincount(cell, z.real, ncell) + 1j * np.bincount(cell, z.imag, ncell)) / cc
            yb[st, :, i] = y[st, :, i] - K[cell] * pred[lo:hi]
    bw = alpha[lo:hi] * g2p[lo:hi] * w
    D = np.empty((nw, 2, 3, 6), complex)
    D[:, 0] = (y * bw[None, :, None]).transpose(1, 0, 2); D[:, 1] = (yb * bw[None, :, None]).transpose(1, 0, 2)
    D = D.reshape(nw, 36)
    # validation against the stored forms of r2 (type 'a', leave-one-out)
    X0 = D.sum(0).reshape(2, 3, 6)[0]
    ref = np.stack([[FSr[st, k, TA, sg] - SELFr[st, k, TA, sg] for sg in cop[p]] for st in (0, 1)])
    P(f"parity {p}: window nodes {nw}, check vs r2 FS-SELF (type a): max |diff| {np.abs(X0[:2]-ref).max():.2e} of {np.abs(ref).max():.2e}")
    blk.append(dict(lo=lo, hi=hi, D=D, tores=np.conj(pred[lo:hi]) / (alpha[lo:hi] * g2p[lo:hi])))
del S, selfacc
def binsum(lab, nb, D):
    out = np.empty((nb, D.shape[1]), complex)
    for c in range(D.shape[1]):
        out[:, c] = np.bincount(lab, D[:, c].real, nb) + 1j * np.bincount(lab, D[:, c].imag, nb)
    return out
res = {}
res['N0'] = np.stack([(np.abs(b['D']) ** 2).sum(0) for b in blk])          # [par, 36]
res['Xa'] = np.stack([b['D'].sum(0) for b in blk])                          # trivial target (row 'a')
res['nw'] = np.array([b['hi'] - b['lo'] for b in blk])
# ---------------- F1: Dirichlet characters mod split primes
rng = np.random.default_rng(1000 + k)
primes = [p for p in range(7, PMAX + 1) if p % 3 == 1 and all(p % q for q in range(2, int(p ** 0.5) + 1))]
f1 = []; f1s = []; f1meta = []
for p in primes:
    roots = [x for x in range(2, p) if (x * x + x + 1) % p == 0]
    g = next(g for g in range(2, p) if len({pow(g, e, p) for e in range(1, p)}) == p - 1) if p < 2000 else None
    dlog = np.full(p, p - 1, np.int64); x = 1
    for e in range(p - 1):
        dlog[x] = e; x = x * g % p
    for wr in roots:
        tt = []; ts = []
        for b in blk:
            lo, hi, D = b['lo'], b['hi'], b['D']
            lab = dlog[np.mod(nap[lo:hi] + nbp[lo:hi] * wr, p)]
            for store, lb in ((tt, lab), (ts, lab[rng.permutation(len(lab))])):
                Ab = binsum(lb, p, D)[:p - 1]
                X = np.fft.ifft(Ab, axis=0) * (p - 1)
                Nn = (np.abs(D[lb < p - 1]) ** 2).sum(0)
                store.append((np.abs(X) ** 2 / Nn).astype(np.float32))
        f1.append(np.stack(tt, 1)); f1s.append(np.stack(ts, 1))            # [a, par, 36]
        f1meta.append((p, wr))
    if p % 97 == 0 or p == primes[-1]: P(f"F1 through p = {p}")
res['f1'] = np.concatenate(f1); res['f1s'] = np.concatenate(f1s)
res['f1p'] = np.concatenate([np.full(p - 1, p) for p, _ in f1meta]); res['f1w'] = np.concatenate([np.full(p - 1, wr) for p, wr in f1meta])
res['f1a'] = np.concatenate([np.arange(p - 1) for p, _ in f1meta])
P(f"F1 done: {len(res['f1a'])} characters")
# ---------------- F2: alpha^k N^{iv}
ks = np.arange(-KA, KA + 1); js = np.arange(-JV, JV + 1)
for nm in ('f2', 'f2r'):
    out = np.empty((len(ks), len(js), 2, 36), np.float32)
    for ip, b in enumerate(blk):
        lo, hi = b['lo'], b['hi']; D = b['D'] if nm == 'f2' else b['D'] * b['tores'][:, None]
        ia = np.floor((np.angle(alpha[lo:hi]) + math.pi) / (2 * math.pi) * NA).astype(np.int64) % NA
        ib = np.clip(np.floor((np.log(Nf[lo:hi] / R) + WCUT) / (2 * WCUT) * NV).astype(np.int64), 0, NV - 1)
        lab = ia * NV + ib; N0 = (np.abs(D) ** 2).sum(0)
        for c in range(36):
            Ab = (np.bincount(lab, D[:, c].real, NA * NV) + 1j * np.bincount(lab, D[:, c].imag, NA * NV)).reshape(NA, NV)
            F = np.fft.fft2(Ab)
            out[:, :, ip, c] = (np.abs(F[np.ix_(ks % NA, js % NV)]) ** 2 / N0[c]).astype(np.float32)
    res[nm] = out
    P(f"{nm} done")
res['f2k'] = ks; res['f2v'] = js * (2 * math.pi / (2 * WCUT))
# ---------------- F3: sextic symbols chi_c(y)^j
ys = [((2, 0), 4), (tuple(Z.LAM), 3), ((-1, 0), 1), ((0, 1), 1)]
ys += [((int(T.pa[i]), int(T.pb[i])), int(T.pq[i])) for i in range(T.np_) if T.pq[i] <= YMAX]
z6 = np.exp(2j * np.pi * np.arange(6) / 6)
f3 = np.empty((len(ys), 5, 2, 36), np.float32)
for iy, (yv, _) in enumerate(ys):
    e = T.node_exponents(yv)[perm].astype(np.int64)
    for ip, b in enumerate(blk):
        lo, hi, D = b['lo'], b['hi'], b['D']
        lab = np.where(e[lo:hi] < 0, 6, e[lo:hi])
        Ab = binsum(lab, 7, D)[:6]
        Nn = (np.abs(D[lab < 6]) ** 2).sum(0)
        for j in range(1, 6):
            f3[iy, j - 1, ip] = np.abs((z6[(j * np.arange(6)) % 6][:, None] * Ab).sum(0)) ** 2 / Nn
    if iy % 100 == 0: P(f"F3 y #{iy}/{len(ys)}")
res['f3'] = f3; res['f3y'] = np.array([y for y, _ in ys]); res['f3N'] = np.array([q for _, q in ys])
# ---------------- controls: Steinhaus multiplicative, iid phases
st_ = np.empty((NDRAW, 2, 36), np.float32); ii = np.empty((NDRAW, 2, 36), np.float32)
for d in range(NDRAW):
    r1 = np.random.default_rng(50000 + d)
    thp = r1.uniform(0, 2 * math.pi, T.np_); th = np.zeros(T.n)
    for lev in T.levels: th[lev] = th[T.parent[lev]] + thp[T.last[lev]]
    f = np.exp(1j * th[perm]); f2 = np.exp(1j * r1.uniform(0, 2 * math.pi, n))
    for ip, b in enumerate(blk):
        lo, hi, D = b['lo'], b['hi'], b['D']; N0 = (np.abs(D) ** 2).sum(0)
        st_[d, ip] = np.abs(f[lo:hi] @ D) ** 2 / N0; ii[d, ip] = np.abs(f2[lo:hi] @ D) ** 2 / N0
res['stein'] = st_; res['iid'] = ii
P("controls done")
np.savez(os.path.join(outd, f'fam_{k:02d}.npz'), Q=Qs[k], R=R, cop=np.stack(cop), **res)
P("saved")
