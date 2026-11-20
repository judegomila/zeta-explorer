"""Combination 1: pointwise short prime sums against beta(H).

LHS_F(H) = sum_{n <= N} Re(Lambda_F(n) n^(-iH)) n^(-1/2) w_{a,delta}(log n),
w_{a,d}(v) = [sinh(d(2a-|v|))/(2d) - (2a-|v|) cosh(d v)/2] / m,  m = sinh(2 a d)/(2 d) - a   (source: (star_min)).
Statistic: dev = LHS_F(H) - mult_F * (1/2) log(H / 2 pi) - const_F  (dev <= 0 is Weil non-negativity in the test
direction f = e^{-iHu} sinh(delta u) 1_{|u|<=a}, up to O(1/H) terms).
Heights: integer lattice H0 + k*step (exact phases), or Haar (independent uniform phases for the primes).
"""
import sys, math, json, time, argparse
import numpy as np, mpmath as mp
import torus as T, s3lib as S
from torus import xp, GPU, asnp

ap = argparse.ArgumentParser()
ap.add_argument('--N', type=float, default=6420)
ap.add_argument('--K', type=float, default=1e6)
ap.add_argument('--H0', type=float, default=3e12)
ap.add_argument('--H1', type=float, default=1e14)
ap.add_argument('--mode', default='orbit')          # orbit | haar
ap.add_argument('--full', type=int, default=0)      # 1: all n <= N (DH, HEAT, ZETA); 0: prime powers
ap.add_argument('--weights', default='0.375:8.767,0.375:8.0,0.3:8.767,0.2:8.767')
ap.add_argument('--chunk', type=float, default=1.2e8)
ap.add_argument('--hours', type=float, default=2.7)
ap.add_argument('--out', default='c1.json')
ap.add_argument('--seed', type=int, default=11)
ap.add_argument('--ea', type=float, default=0.1)
ap.add_argument('--tau', type=float, default=-0.5)
a = ap.parse_args()
t00 = time.time()
N = int(a.N); K = int(a.K)
H0 = int(a.H0); step = max(1, int((a.H1 - a.H0) // K)) | 1
WTS = [tuple(float(x) for x in s.split(':')) for s in a.weights.split(',')]
NB, BW, BLO = 640, 0.125, -40.0


def wfun(v, d, twoa):
    aa = twoa / 2
    m = math.sinh(twoa * d) / (2 * d) - aa
    r = np.maximum(twoa - np.abs(v), 0.0)
    return (np.sinh(d * r) / (2 * d) - r * np.cosh(d * v) / 2) / m


# ------------------------------------------------------------ coefficient table
lev = T.Levels(N)
pr = lev.primes
logn = lev.logn
fams = {}       # name -> (complex Lambda_F(n) array over n <= N, mult, const)
Lam = T.mangoldt(N)
if a.full:
    idx_n = np.arange(2, N + 1)
    fams['ZETA'] = (Lam.astype(complex), 1, 0.0)
    fams['DH'] = (T.log_derivative_coeffs(T.dh_coeffs(N).astype(float)).astype(complex), 1, 0.5 * math.log(5))
    nn = np.arange(N + 1, dtype=float); nn[0] = 1
    heat = np.exp(a.tau * np.log(nn) ** 2 / 4); heat[0] = 0
    fams['HEAT'] = (T.log_derivative_coeffs(heat).astype(complex), 1, 0.0)
else:
    idx_n = np.nonzero(Lam > 0)[0]
    U = T.families(pr)
    mdel = S.thin_set(pr, 0.75)
    mthin = S.thin_set(pr, 0.75, half=True)
    U['DEL'] = np.where(mdel, 0.0, 1.0).astype(complex)
    U['THIN'] = np.where(mthin, -1.0, 1.0).astype(complex)
    consts = {'CHI': 0.5 * math.log(5), 'CHIB': 0.5 * math.log(5)}
    for name in ('ZETA', 'CHI', 'SGN', 'UNI', 'LIO', 'DEL', 'THIN'):
        e = T.completely_mult(U[name], lev)
        fams[name] = (Lam * e, 1, consts.get(name, 0.0))
    fams['TNR'] = (T.tnr_lambda(N).astype(complex), 1, math.log(3))
    nn = np.arange(N + 1, dtype=float); nn[0] = 1
    fams['EA'] = ((Lam * (nn ** a.ea + nn ** -a.ea)).astype(complex), 2, 0.0)
names = list(fams)
cols = [(f, j) for f in names for j in range(len(WTS))]
ncol = len(cols)
nn_idx = idx_n
base_c = np.stack([wfun(logn[nn_idx], d, twoa) * nn_idx ** -0.5 for (d, twoa) in WTS], axis=1)     # (n, nw)
Acos = np.zeros((len(nn_idx), ncol)); Asin = np.zeros((len(nn_idx), ncol))
mult = np.zeros(ncol); const = np.zeros(ncol)
torus_sup = np.zeros(ncol); l2 = np.zeros(ncol)
for c, (f, j) in enumerate(cols):
    lam, mu, cs = fams[f]
    z = lam[nn_idx] * base_c[:, j]
    Acos[:, c] = z.real; Asin[:, c] = z.imag      # Re(z e^{-i phase}) = Re z cos + Im z sin
    mult[c] = mu; const[c] = cs
    torus_sup[c] = np.abs(z).sum(); l2[c] = math.sqrt(0.5 * (np.abs(z) ** 2).sum())
A = xp.asarray(np.concatenate([Acos, Asin], axis=0))
multx = xp.asarray(mult); constx = xp.asarray(const)
nterm = len(nn_idx)
Lp = S.frac_logs(pr)
# index maps from the prime cycles to the term cycles
if a.full:
    par = xp.asarray(lev.par); spf = xp.asarray(lev.spf)
    levs = [xp.asarray(ix) for ix in lev.lev]
    prx = xp.asarray(pr)
else:
    pidx = np.zeros(len(nn_idx), dtype=np.int64); kexp = np.zeros(len(nn_idx), dtype=np.uint64)
    pos = {int(p): i for i, p in enumerate(pr)}
    for i, n in enumerate(nn_idx):
        p = int(lev.spf[n]); k = 0; m = int(n)
        while m > 1:
            m //= p; k += 1
        pidx[i] = pos[p]; kexp[i] = k
    pidxx = xp.asarray(pidx); kexpx = xp.asarray(kexp)

Dp = [(step * l) & S.MASK for l in Lp]
dhi = xp.asarray(np.array([d >> 64 for d in Dp], dtype=np.uint64))
dlo = xp.asarray(np.array([(d >> 40) & 0xFFFFFF for d in Dp], dtype=np.uint64))
Kc = int(min(2 ** 24, max(1, a.chunk // nterm)))
nchunk = (K + Kc - 1) // Kc
print(f'N={N} terms={nterm} cols={ncol} K={K} step={step} Kc={Kc} chunks={nchunk} mode={a.mode} GPU={GPU}', flush=True)
print(f'planned per-chunk arrays: {Kc} x {nterm} x 8 B x 5 = {Kc * nterm * 40 / 2**30:.2f} GiB', flush=True)
rs = xp.random.RandomState(a.seed) if GPU else np.random.RandomState(a.seed)

hist = np.zeros((ncol, NB), dtype=np.int64)
s1 = np.zeros(ncol); s2 = np.zeros(ncol)
cmax = np.full((nchunk, ncol), -np.inf); cargmax = np.zeros((nchunk, ncol), dtype=np.int64)
cmin = np.full((nchunk, ncol), np.inf)
vmax = np.full(ncol, -np.inf); vmin = np.full(ncol, np.inf)
done = 0
colx = xp.arange(ncol, dtype=xp.int64)[None, :] * NB


def term_u(Up):
    """(Kc, pi(N)) uint64 prime cycles -> (Kc, nterm) uint64 term cycles."""
    if not a.full:
        return Up[:, pidxx] * kexpx[None, :]
    C = xp.zeros((Up.shape[0], N + 1), dtype=xp.uint64)
    C[:, prx] = Up
    for ix in levs:
        C[:, ix] = C[:, par[ix]] + C[:, spf[ix]]
    return C[:, 2:]


def body(j):
    k0 = j * Kc; kc = min(Kc, K - k0)
    Hc = H0 + k0 * step
    kk = xp.arange(kc, dtype=xp.uint64)
    if a.mode == 'orbit':
        base = xp.asarray(np.array([((Hc * l) & S.MASK) >> 64 for l in Lp], dtype=np.uint64))
        Up = S.lattice_u(base, dhi, dlo, kk)
    else:
        Up = (rs.randint(0, 2 ** 32, size=(kc, len(pr))).astype(xp.uint64) << np.uint64(32)) | rs.randint(0, 2 ** 32, size=(kc, len(pr))).astype(xp.uint64)
    u = term_u(Up); del Up
    ph = S.u2cyc(u) * (2 * math.pi); del u
    V = xp.cos(ph) @ A[:nterm]
    V += xp.sin(ph) @ A[nterm:]
    del ph
    Hf = float(Hc) + kk.astype(xp.float64) * float(step)
    bh = 0.5 * xp.log(Hf / (2 * math.pi)) if a.mode == 'orbit' else xp.full(kc, 0.5 * math.log(a.H0 / (2 * math.pi)))
    dev = V - bh[:, None] * multx[None, :] - constx[None, :]
    b = xp.clip(xp.floor((dev - BLO) / BW), 0, NB - 1).astype(xp.int64) + colx
    h = xp.bincount(b.ravel(), minlength=ncol * NB).reshape(ncol, NB)
    am = dev.argmax(axis=0)
    return (asnp(h), asnp(V.sum(axis=0)), asnp((V * V).sum(axis=0)), asnp(dev.max(axis=0)), asnp(am) + k0, asnp(dev.min(axis=0)),
            asnp(V.max(axis=0)), asnp(V.min(axis=0)))


def save(final=False):
    top = []
    for c, (f, j) in enumerate(cols):
        o = np.argsort(-cmax[:, c])[:12]
        top.append([(float(cmax[i, c]), int(H0 + int(cargmax[i, c]) * step)) for i in o if np.isfinite(cmax[i, c])])
    out = dict(meta=dict(vars(a)), N=N, nterm=nterm, step=step, H0=H0, done=done, K=K, final=final, seconds=time.time() - t00,
               weights=WTS, cols=[[f, j] for f, j in cols], mult=mult.tolist(), const=const.tolist(),
               torus_sup=torus_sup.tolist(), l2=l2.tolist(), hist=hist.tolist(), hist_bins=[BLO, BW, NB],
               mean=(s1 / max(done, 1)).tolist(), meansq=(s2 / max(done, 1)).tolist(),
               maxdev=[float(cmax[:, c].max()) for c in range(ncol)], mindev=[float(cmin[:, c].min()) for c in range(ncol)],
               maxV=vmax.tolist(), minV=vmin.tolist(), top=top, GPU=GPU)
    json.dump(out, open(a.out, 'w'))


last = time.time()
for j in range(nchunk):
    h, a1, a2, mx, am, mn, vM, vm = T.retry(body, j)
    hist += h; s1 += a1; s2 += a2
    cmax[j] = mx; cargmax[j] = am; cmin[j] = mn
    vmax = np.maximum(vmax, vM); vmin = np.minimum(vmin, vm)
    done += min(Kc, K - j * Kc)
    if j % 50 == 49:
        T.free()
    if time.time() - last > 300 or j == nchunk - 1:
        save(); last = time.time()
        print(f'chunk {j + 1}/{nchunk} done={done:.3e} t={time.time() - t00:.0f}s rate={done * nterm / (time.time() - t00):.3e} terms/s', flush=True)
    if time.time() - t00 > a.hours * 3600:
        print('time limit reached; stopping', flush=True)
        break
save(final=True)
print('done', done, f'{time.time() - t00:.0f}s', flush=True)
