"""Combination 1, lattice engine: LHS_F(H0 + k step) for k = 0..K-1 by a type-1 non-uniform FFT in k.

sum_n z_n e^{-i (Hb + k' step) log n} = sum_n (z_n e^{-i Hb log n}) e^{-i k' omega_n},  omega_n = 2 pi frac(step log n / 2 pi),
block centre Hb exact (128-bit integer phases), k' in [-M/2, M/2).  Same statistic and output format as c1.py.
mode orbit: true base phases.  mode haarflow: every block starts from independent uniform prime phases (same flow).
"""
import sys, math, json, time, argparse
import numpy as np
import torus as T, s3lib as S
from torus import xp, GPU, asnp
if GPU:
    import cupyx

ap = argparse.ArgumentParser()
ap.add_argument('--N', type=float, default=6420)
ap.add_argument('--K', type=float, default=1e6)
ap.add_argument('--H0', type=float, default=3e12)
ap.add_argument('--H1', type=float, default=1e14)
ap.add_argument('--mode', default='orbit')
ap.add_argument('--full', type=int, default=0)
ap.add_argument('--weights', default='0.375:8.767,0.375:8.0,0.3:8.767,0.2:8.767')
ap.add_argument('--logM', type=int, default=26)
ap.add_argument('--w', type=int, default=14)
ap.add_argument('--hours', type=float, default=2.7)
ap.add_argument('--out', default='c1n.json')
ap.add_argument('--seed', type=int, default=11)
ap.add_argument('--ea', type=float, default=0.1)
ap.add_argument('--tau', type=float, default=-0.5)
ap.add_argument('--fams', default='')
a = ap.parse_args(None if __name__ == '__main__' else [])
t00 = time.time()
N = int(a.N); K = int(a.K)
H0 = int(a.H0); step = max(1, int((a.H1 - a.H0) // K)) | 1
WTS = [tuple(float(x) for x in s.split(':')) for s in a.weights.split(',')]
NB, BW, BLO = 640, 0.125, -40.0
M = 1 << a.logM
while M > 2 * K and M > 1024:
    M //= 2
nf = 2 * M


def wfun(v, d, twoa):
    aa = twoa / 2
    m = math.sinh(twoa * d) / (2 * d) - aa
    r = np.maximum(twoa - np.abs(v), 0.0)
    return (np.sinh(d * r) / (2 * d) - r * np.cosh(d * v) / 2) / m


def build(N, full, WTS, ea, tau, only=''):
    """term indices, per-column complex strengths z_n = Lambda_F(n) n^(-1/2) w(log n), thresholds.
    Returns (primes, idx, cols, Z, mult, const, (base, kk)); base, kk: prime index and exponent of each term (prime-power mode)."""
    pr = T.sieve(N)
    fams = {}
    pk = None
    if full:
        Lam = T.mangoldt(N)
        nn = np.arange(N + 1, dtype=float); nn[0] = 1
        idx = np.arange(2, N + 1)
        fams['ZETA'] = (Lam[idx].astype(complex), 1, 0.0)
        fams['DH'] = (T.log_derivative_coeffs(T.dh_coeffs(N).astype(float))[idx].astype(complex), 1, 0.5 * math.log(5))
        heat = np.exp(tau * np.log(nn) ** 2 / 4); heat[0] = 0
        fams['HEAT'] = (T.log_derivative_coeffs(heat)[idx].astype(complex), 1, 0.0)
    else:
        ii = [pr]; bb = [np.arange(len(pr))]; kks = [np.ones(len(pr), dtype=np.int64)]
        k = 2
        while 2 ** k <= N:
            m = int(np.searchsorted(pr, int(round(N ** (1.0 / k))) + 1, side='right'))
            q = pr[:m].astype(object) ** k
            ok = np.array([int(v) <= N for v in q], dtype=bool)
            ii.append(np.array([int(v) for v in q[ok]], dtype=np.int64)); bb.append(np.arange(m)[ok]); kks.append(np.full(int(ok.sum()), k, dtype=np.int64))
            k += 1
        idx = np.concatenate(ii); base = np.concatenate(bb); kk = np.concatenate(kks)
        o = np.argsort(idx, kind='stable'); idx = idx[o]; base = base[o]; kk = kk[o]
        pk = (base, kk)
        lamz = np.log(pr.astype(float))[base]
        U = T.families(pr)
        U['DEL'] = np.where(S.thin_set(pr, 0.75), 0.0, 1.0).astype(complex)
        U['THIN'] = np.where(S.thin_set(pr, 0.75, half=True), -1.0, 1.0).astype(complex)
        consts = {'CHI': 0.5 * math.log(5)}
        want = only.split(',') if only else None
        for name in ('ZETA', 'CHI', 'SGN', 'UNI', 'LIO', 'DEL', 'THIN'):
            if want and name not in want:
                continue
            fams[name] = (lamz * U[name][base] ** kk, 1, consts.get(name, 0.0))
        if not want or 'TNR' in want:
            al1 = -(T.TNR_C / 2 + math.sqrt(T.TNR_C ** 2 / 4 - 1)); al2 = 1 / al1
            lt = lamz.astype(complex)
            i3 = np.nonzero(pr[base] == 3)[0]
            for i in i3:
                k3 = int(kk[i])
                lt[i] = math.log(3) * (1 - (al1 ** k3 + al2 ** k3) * 3 ** (k3 / 2))
            fams['TNR'] = (lt, 1, math.log(3))
        if not want or 'EA' in want:
            x = idx.astype(float)
            fams['EA'] = ((lamz * (x ** ea + x ** -ea)).astype(complex), 2, 0.0)
    if only:
        fams = {k: v for k, v in fams.items() if k in only.split(',')}
    names = list(fams)
    cols = [(f, j) for f in names for j in range(len(WTS))]
    lg = np.log(idx.astype(float))
    Z = np.empty((len(idx), len(cols)), dtype=complex)
    for c, (f, j) in enumerate(cols):
        d, twoa = WTS[j]
        Z[:, c] = fams[f][0] * (wfun(lg, d, twoa) * idx.astype(float) ** -0.5)
    mult = np.array([fams[f][1] for f, j in cols], dtype=float); const = np.array([fams[f][2] for f, j in cols])
    return pr, idx, cols, Z, mult, const, pk


if __name__ == '__main__':
    pr, idx, cols, Z, mult, const, pk = build(N, a.full, WTS, a.ea, a.tau, a.fams)
    ncol = len(cols); nterm = len(idx)
    torus_sup = np.abs(Z).sum(axis=0); l2 = np.sqrt(0.5 * (np.abs(Z) ** 2).sum(axis=0))
    print(f'planned host arrays: Z {Z.nbytes / 2**30:.2f} GiB; terms {nterm}', flush=True)
    Lp = S.frac_logs(pr)
    if pk is None:
        Lall = S.extend_logs(N, pr, Lp)
        Lt = [Lall[int(n)] for n in idx]
        del Lall
    else:
        Lt = [(int(k) * Lp[int(b)]) & S.MASK for b, k in zip(pk[0], pk[1])]
    # exponent structure for haarflow: cycles of n from prime cycles
    D = [(step * l) & S.MASK for l in Lt]
    omega = np.array([d >> (S.BITS - 53) for d in D], dtype=np.float64) * (2.0 ** -53) * (2 * math.pi)
    nblock = (K + M - 1) // M
    print(f'N={N} terms={nterm} cols={ncol} K={K} step={step} M={M} nf={nf} blocks={nblock} mode={a.mode} GPU={GPU}', flush=True)
    print(f'planned: grid {nf * 16 / 2**30:.2f} GiB + FFT output {nf * 16 / 2**30:.2f} GiB + kernel tables {a.w * nterm * 16 / 2**30:.3f} GiB', flush=True)
    beta_k = S.es_beta(a.w, 2.0)
    x = xp.asarray(omega) * (nf / (2 * math.pi))
    j0 = xp.ceil(x - a.w / 2)
    IDX = xp.empty((a.w, nterm), dtype=xp.int64); KER = xp.empty((a.w, nterm), dtype=xp.float64)
    for l in range(a.w):
        j = j0 + l
        z = (j - x) * (2.0 / a.w)
        KER[l] = xp.exp(beta_k * (xp.sqrt(xp.maximum(0.0, 1 - z * z)) - 1))
        IDX[l] = j.astype(xp.int64) % nf
    IDXf = IDX.ravel()
    kmodes = xp.arange(-M // 2, M // 2)
    khat = S.es_hat(kmodes, nf, a.w, beta_k)
    ksel = kmodes % nf
    Zx = xp.asarray(Z)
    rng = np.random.default_rng(a.seed)
    if a.mode == 'haarflow':
        if pk is None:
            lev = T.Levels(N)

            def haar_cycles():
                c = np.zeros(N + 1); c[pr] = rng.random(len(pr))
                for ix in lev.lev:
                    c[ix] = c[lev.par[ix]] + c[lev.spf[ix]]
                return c[idx]
        else:
            def haar_cycles():
                return rng.random(len(pr))[pk[0]] * pk[1]
    hist = np.zeros((ncol, NB), dtype=np.int64)
    s1 = np.zeros(ncol); s2 = np.zeros(ncol)
    cmax = np.full((nblock, ncol), -np.inf); cargmax = np.zeros((nblock, ncol), dtype=np.int64); cmin = np.full((nblock, ncol), np.inf)
    vmax = np.full(ncol, -np.inf); vmin = np.full(ncol, np.inf)
    done = 0

    def save(final=False):
        top = []
        for c in range(ncol):
            o = np.argsort(-cmax[:, c])[:12]
            top.append([(float(cmax[i, c]), int(H0 + int(cargmax[i, c]) * step)) for i in o if np.isfinite(cmax[i, c])])
        out = dict(meta=dict(vars(a)), N=N, nterm=nterm, step=step, H0=H0, done=done, K=K, final=final, seconds=time.time() - t00,
                   weights=WTS, cols=[[f, j] for f, j in cols], mult=mult.tolist(), const=const.tolist(),
                   torus_sup=torus_sup.tolist(), l2=l2.tolist(), hist=hist.tolist(), hist_bins=[BLO, BW, NB],
                   mean=(s1 / max(done, 1)).tolist(), meansq=(s2 / max(done, 1)).tolist(),
                   maxdev=[float(cmax[:, c].max()) for c in range(ncol)], mindev=[float(cmin[:, c].min()) for c in range(ncol)],
                   maxV=vmax.tolist(), minV=vmin.tolist(), top=top, GPU=GPU, engine='nufft')
        json.dump(out, open(a.out, 'w'))

    def column(c, phase, lo, hi, bh):
        strength = Zx[:, c] * phase
        grid = xp.zeros(nf, dtype=xp.complex128)
        vals = (KER * strength[None, :]).ravel()
        if GPU:
            gv = grid.view(xp.float64)
            cupyx.scatter_add(gv, 2 * IDXf, vals.real)
            cupyx.scatter_add(gv, 2 * IDXf + 1, vals.imag)
        else:
            grid += np.bincount(IDXf, weights=vals.real, minlength=nf) + 1j * np.bincount(IDXf, weights=vals.imag, minlength=nf)
        F = xp.fft.fft(grid)
        del grid
        V = (F[ksel] / khat).real[lo:hi]
        del F
        dev = V - bh * mult[c] - const[c]
        h = xp.bincount(xp.clip(xp.floor((dev - BLO) / BW), 0, NB - 1).astype(xp.int64), minlength=NB)
        am = int(dev.argmax())
        return asnp(h), float(V.sum()), float((V * V).sum()), float(dev[am]), am, float(dev.min()), float(V.max()), float(V.min())

    last = time.time()
    for b in range(nblock):
        kc = b * M + M // 2
        Hb = H0 + kc * step
        lo = 0; hi = min(M, K - b * M)                  # k = b M + i, i in [lo, hi); mode index i <-> k' = i - M/2
        if a.mode == 'orbit':
            cyc = S.cycles_exact(Hb, Lt)
        else:
            cyc = haar_cycles()
        phase = xp.exp(xp.asarray(cyc) * (-2j * math.pi))
        Hf = float(Hb) + (xp.arange(lo, hi, dtype=xp.float64) - M // 2) * float(step)
        bh = 0.5 * xp.log(Hf / (2 * math.pi))
        for c in range(ncol):
            h, a1, a2, mx, am, mn, vM, vm = T.retry(column, c, phase, lo, hi, bh)
            hist[c] += h; s1[c] += a1; s2[c] += a2
            cmax[b, c] = mx; cargmax[b, c] = b * M + am; cmin[b, c] = mn
            vmax[c] = max(vmax[c], vM); vmin[c] = min(vmin[c], vm)
        done += hi - lo
        T.free()
        if time.time() - last > 300 or b == nblock - 1:
            save(); last = time.time()
            print(f'block {b + 1}/{nblock} done={done:.3e} t={time.time() - t00:.0f}s rate={done / (time.time() - t00):.3e} heights/s', flush=True)
        if time.time() - t00 > a.hours * 3600:
            print('time limit reached; stopping', flush=True)
            break
    save(final=True)
    print('done', done, f'{time.time() - t00:.0f}s', flush=True)
