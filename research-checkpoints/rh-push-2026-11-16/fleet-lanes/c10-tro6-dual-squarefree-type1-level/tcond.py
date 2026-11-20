"""tcond.py -- per-conductor twisted sums T[c, h*12+sigma] = sum_{N(m) <= Q_i(c)} rho-hat_{h,sigma}(y0; m) chi_c(m) (lane c10).
rho-hat is read from the mode-b output of acc10.py (same rows). Conductor c in octave bin i uses the rows with N(m) <= Q_i.
Usage: python tcond.py table.npz acc_b.npz out.npz [workers]"""
import sys, os, time, math
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import alib as A, zomega as Z, acc10
from multiprocessing import get_context
G = acc10.G

def init(path, accp):
    acc10.base_init(path)
    T = G['T']; d = np.load(accp)
    X = T.X; Xc = X / 4.0; NB = int(d['NB']); N = T.N.astype(np.float64)
    isc = (N <= Xc) & (N > Xc / 2 ** NB)
    cidx = np.flatnonzero(isc); cidx = cidx[np.argsort(T.N[cidx], kind='stable')]
    G.update(dict(cidx=cidx, cN=N[cidx], rows=d['rows'], r6=d['r6'], Qi=d['Qi'], NB=NB, Xc=Xc))

def work(w_nw):
    w, nw = w_nw
    T = G['T']; cidx = G['cidx']; cN = G['cN']; rows = G['rows']; r6 = G['r6']; Qi = G['Qi']; NB = G['NB']; Xc = G['Xc']
    out = np.zeros((len(cidx), 24), dtype=np.complex128)
    Z7 = np.concatenate([Z.ZETA6, [0]])
    for k in range(w, len(rows), nw):
        nm, a, b = (int(v) for v in rows[k])
        imax = int(np.flatnonzero(Qi >= nm).max())               # bins 0..imax use this row
        start = int(np.searchsorted(cN, Xc / 2 ** (imax + 1), side='right'))
        e = acc10.node_exp(T, (a, b))[cidx[start:]].astype(np.int64)
        e[e < 0] = 6
        out[start:] += Z7[e][:, None] * r6[k][None, :]
    return out

def main():
    path, accp, outp = sys.argv[1:4]
    nw = int(sys.argv[4]) if len(sys.argv) > 4 else int(os.environ.get('RH_WORKERS', '1'))
    t0 = time.time()
    d = np.load(path); n = len(d['N']); X = int(d['X']); del d
    init(path, accp)
    nc = len(G['cidx'])
    print(f"X = {X}, nodes = {n}, conductors = {nc}, rows = {len(G['rows'])}, workers = {nw}", flush=True)
    print(f"planned memory: per process table {n * 184 / 1e6:.0f} MB + T {nc * 24 * 16 / 1e6:.0f} MB + temporaries {nc * 24 * 16 / 1e6:.0f} MB; x{nw + 1} = {(nw + 1) * (n * 184 + 2 * nc * 24 * 16) / 1e9:.2f} GB", flush=True)
    with get_context('fork').Pool(nw, initializer=init, initargs=(path, accp)) as pool:
        parts = pool.map(work, [(w, nw) for w in range(nw)])
    Tc = sum(parts)
    np.savez(outp, X=X, cidx=G['cidx'], T=Tc.astype(np.complex64))
    print(f"saved {outp} {time.time() - t0:.0f}s", flush=True)

if __name__ == '__main__':
    main()
