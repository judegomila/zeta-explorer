"""Sample the Hardy functions Z_chi, Z_chibar (chi mod 5, chi(2)=i) on a uniform grid; Davenport-Heilbronn: Z_DH = Z_chi + Z_chibar.
Usage: dh_sample.py T1 T2 NPROC OUT.npz"""
import flint, numpy as np, sys, math, time
from multiprocessing import Pool
def work(ts):
    flint.ctx.prec = 64
    chi = flint.dirichlet_char(5, 2); chib = flint.dirichlet_char(5, 3)
    a = np.empty(len(ts)); b = np.empty(len(ts))
    for i, t in enumerate(ts):
        z = flint.acb(float(t)); a[i] = float(chi.hardy_z(z).real); b[i] = float(chib.hardy_z(z).real)
    return a, b
if __name__ == '__main__':
    T1 = float(sys.argv[1]); T2 = float(sys.argv[2]); nproc = int(sys.argv[3]); out = sys.argv[4]
    Lmax = math.log(5 * T2 / (2 * math.pi)); h = 2 * math.pi / Lmax / 4
    t = T1 + h * np.arange(int((T2 - T1) / h) + 1)
    chunks = np.array_split(t, nproc * 40)
    t0 = time.time()
    with Pool(nproc) as p: res = p.map(work, chunks, chunksize=1)
    Z1 = np.concatenate([r[0] for r in res]); Z2 = np.concatenate([r[1] for r in res])
    np.savez(out, t=t, Z1=Z1, Z2=Z2, h=h)
    print('done', len(t), '%.0fs' % (time.time() - t0), flush=True)
