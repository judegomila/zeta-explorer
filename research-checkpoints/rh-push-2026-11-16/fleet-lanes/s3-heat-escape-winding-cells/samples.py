"""Samples of the Dirichlet-series factor of a kind on the vertical line Re w = sigc, Im w = j h, j = 0..T/h  (Arb, 64 bit -> complex128).
Usage: samples.py <kind: zeta|chi4|dh|ea> <sigc> <T> <h> <out.npy>"""
import sys, os, time, numpy as np
from multiprocessing import Pool
from flint import acb, arb, ctx
import hk
NW = int(os.environ.get('RH_WORKERS', '4'))
def _chunk(a):
    kind, sigc, us = a
    ctx.prec = 64
    out = np.empty(len(us), dtype=np.complex128)
    for i, u in enumerate(us):
        _, v = hk.parts(kind, acb(sigc, float(u)))
        out[i] = hk.c128(v)
    return out
if __name__ == '__main__':
    kind, sigc, T, h, outp = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
    n = int(round(T/h)) + 1
    print('planned allocation: %d complex128 samples = %.1f MB' % (n, n*16/1e6), flush=True)
    us = h*np.arange(n)
    t0 = time.time()
    # interleave so that every worker gets all heights (cost grows with height for Hurwitz)
    idx = [np.arange(k, n, NW*8) for k in range(NW*8)]
    with Pool(NW) as p: res = p.map(_chunk, [(kind, sigc, us[i]) for i in idx], chunksize=1)
    out = np.empty(n, dtype=np.complex128)
    for i, r in zip(idx, res): out[i] = r
    np.save(outp, out); np.save(outp.replace('.npy', '.meta.npy'), np.array([sigc, T, h]))
    print(kind, 'done', n, 'samples', time.time() - t0, 's', flush=True)
