"""Riemann-Siegel Z on a block at large height, multiprocess. Usage: rs_big.py T0 HALF STEP NPROC OUT.npz"""
import sys, time, math, os, numpy as np, mpmath as mp
from multiprocessing import Pool

def dtheta(T0, d):
    return 0.5 * d * math.log(T0 / (2 * math.pi)) + d * d / (4 * T0)

def C0(p): return np.cos(2 * np.pi * (p * p - p - 1.0 / 16)) / np.cos(2 * np.pi * p)

def phase_chunk(args):
    T0s, lo, hi = args
    mp.mp.dps = 60
    T0m = mp.mpf(T0s); th0 = mp.siegeltheta(T0m); twopi = 2 * mp.pi
    out = np.empty(hi - lo)
    for n in range(lo, hi):
        v = th0 - T0m * mp.log(n)
        out[n - lo] = float(v - twopi * mp.floor(v / twopi))
    return lo, out

G = {}
def init(cfile, T0):
    G['c'] = np.load(cfile, mmap_mode='r'); G['T0'] = T0
    N = len(G['c']); n = np.arange(1, N + 1, dtype=np.float64)
    G['logn'] = np.log(n); G['amp'] = 2.0 / np.sqrt(n)

def z_rows(ds):
    T0 = G['T0']; c = G['c']; logn = G['logn']; amp = G['amp']
    out = np.empty(len(ds))
    for i, d in enumerate(ds):
        tau = (T0 + d) / (2 * math.pi); rt = math.sqrt(tau); N = int(math.floor(rt)); p = rt - N
        ph = logn[:N] * (-d); ph += c[:N]; ph += dtheta(T0, d); np.cos(ph, out=ph)
        out[i] = ph @ amp[:N] + (1.0 if N % 2 == 1 else -1.0) * tau ** -0.25 * C0(p)
    return out

if __name__ == '__main__':
    T0s = sys.argv[1]; T0 = float(T0s); half = float(sys.argv[2]); step = float(sys.argv[3]); nproc = int(sys.argv[4]); out = sys.argv[5]
    Nmax = int(math.floor(math.sqrt((T0 + half) / (2 * math.pi)))) + 1
    cfile = out + '.phases.npy'
    t1 = time.time()
    if not os.path.exists(cfile):
        edges = np.linspace(1, Nmax + 1, 16 * nproc + 1).astype(int)
        c = np.empty(Nmax)
        with Pool(nproc) as P:
            for lo, arr in P.imap_unordered(phase_chunk, [(T0s, int(edges[i]), int(edges[i + 1])) for i in range(len(edges) - 1)]):
                c[lo - 1:lo - 1 + len(arr)] = arr
        np.save(cfile, c); del c
        print('phases %d terms %.0fs' % (Nmax, time.time() - t1), flush=True)
    d = np.arange(-half, half + step / 2, step)
    parts = np.array_split(d, max(nproc * 40, 1))
    z = []
    with Pool(nproc, initializer=init, initargs=(cfile, T0)) as P:
        for j, r in enumerate(P.imap(z_rows, parts)):
            z.append(r)
            if j % 20 == 0: print('part %d/%d %.0fs' % (j, len(parts), time.time() - t1), flush=True)
    z = np.concatenate(z)
    np.savez(out, T0=T0, d=d, z=z)
    print('done samples=%d time=%.0fs max|Z|=%.3f' % (len(d), time.time() - t1, np.abs(z).max()), flush=True)
