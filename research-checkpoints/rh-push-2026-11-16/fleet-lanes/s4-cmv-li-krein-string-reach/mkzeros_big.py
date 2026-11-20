"""first M zeta ordinates as float64 (Arb zeta_zeros at 80 bits, parallel chunks) -> zeros_big.bin"""
import sys, os, numpy as np
from multiprocessing import Pool
from flint import acb, ctx
M = int(sys.argv[1]); W = int(sys.argv[2]) if len(sys.argv) > 2 else int(os.environ.get('RH_WORKERS', '4'))
def chunk(a):
    lo, cnt = a; ctx.prec = 80
    return [float(z.imag.mid()) for z in acb.zeta_zeros(lo, cnt)]
if __name__ == '__main__':
    step = 5000; jobs = [(lo, min(step, M - lo + 1)) for lo in range(1, M + 1, step)]
    with Pool(W) as p: res = p.map(chunk, jobs, chunksize=1)
    z = np.array([x for r in res for x in r]); assert len(z) == M and np.all(np.diff(z) > 0)
    z.tofile('zeros_big.bin'); print('zeros', M, z[0], z[-1])
