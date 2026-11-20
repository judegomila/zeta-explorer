# Combination 1: lowest eigenvalue of the Weil form on [-a,a] (X = e^{2a}, lambda = e^a) for zeta, Dirichlet L and controls.
# float64 screen. Uses wf.py / objs.py of lane s2-control-census-onsets (validated there against the zero side).
import sys, os, json, math, time
for _k in ('VECLIB_MAXIMUM_THREADS', 'OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[_k] = '1'
import numpy as np
import multiprocessing as mp
import wf, objs
NB = int(os.environ.get('NB', 170)); XMAX = float(os.environ.get('XMAX', 1e4)); NPTS = int(os.environ.get('NPTS', 30))
WORKERS = int(os.environ.get('FW', 2)); OUT = sys.argv[1]
AMAX = 0.5*math.log(XMAX); NMAX = int(XMAX) + 3
AGRID = [0.5*math.log(x) for x in np.exp(np.linspace(math.log(2.0), math.log(XMAX), NPTS))]
print('NB=%d XMAX=%g NMAX=%d workers=%d ; G1 stack planned %.2f GB' % (NB, XMAX, NMAX, WORKERS, 2*(4*NB+20)*NB*NB*8/1e9), flush=True)
TAB = wf.sieve_mangoldt(NMAX)
B = wf.Basis(NB)
chi = {-4: lambda p: 0 if p % 2 == 0 else (1 if p % 4 == 1 else -1), -3: lambda p: 0 if p % 3 == 0 else (1 if p % 3 == 1 else -1),
       5: lambda p: 0 if p % 5 == 0 else (1 if p % 5 in (1, 4) else -1)}
def hbit(x):
    M = (1 << 64) - 1
    x = (x + 0x9E3779B97F4A7C15) & M; x = ((x ^ (x >> 30))*0xBF58476D1CE4E5B9) & M; x = ((x ^ (x >> 27))*0x94D049BB133111EB) & M; x ^= x >> 31
    return (x >> 17) & 1
def build(name):
    if name == 'zeta': return objs.spec_zeta(NMAX, TAB)
    if name.startswith('L'): q = int(name[1:]); return objs.spec_dirichlet_real(chi[q], abs(q), 1 if q < 0 else 0, NMAX, name, TAB)
    if name == 'DH': return objs.spec_periodic(objs.dh_coeffs(), 5, 1, NMAX, 'DH')
    if name.startswith('EA'): return objs.spec_Ea(float(name[2:]), NMAX, TAB)
    if name.startswith('TNR'): q, c, br = name[3:].split('_'); return objs.spec_tnr(int(q), float(c), NMAX, br, TAB)
    if name == 'SGN-LIOU': return objs.spec_signtwist(lambda p: -1, NMAX, name, TAB)
    if name == 'SGN-HASH': return objs.spec_signtwist(lambda p: 1 - 2*hbit(p), NMAX, name, TAB)
    if name.startswith('WT'): return objs.spec_unimod(float(name[2:]), NMAX, TAB)
    if name == 'U-RAND':
        L, P, K = TAB; rng = np.random.Generator(np.random.PCG64(120000)); pr = [int(q) for q in range(2, NMAX + 1) if K[q] == 1]
        u = dict(zip(pr, rng.random(len(pr)))); n = np.nonzero(L)[0]
        e = np.array([math.cos(2*math.pi*u[int(p)]*int(k)) for p, k in zip(P[n], K[n])])
        s = wf.arch_dirichlet(1, 0); s.update(x=np.log(n), w=e*L[n]/np.sqrt(n), poles=(0.5,), name='U'); return s
    raise ValueError(name)
def run(name):
    t0 = time.time(); s = build(name); rows = []
    for a in AGRID:
        l = B.lam(s, a); rows.append(dict(a=a, X=math.exp(2*a), lam=l, nrm=B.nrm))
    print(name, 'done %.0fs' % (time.time() - t0), 'last', rows[-1]['lam'], flush=True)
    return name, rows
NAMES = ['zeta', 'L-4', 'L-3', 'L5', 'DH', 'EA0.125', 'EA0.25', 'TNR3_2.2_own', 'TNR3_2.2_zeta', 'TNR2_2.05_own', 'SGN-LIOU', 'SGN-HASH', 'WT1.2393168126993495', 'U-RAND']
if len(sys.argv) > 2: NAMES = sys.argv[2].split(',')
if __name__ == '__main__':
    t0 = time.time()
    with mp.get_context('fork').Pool(WORKERS) as pool: res = dict(pool.map(run, NAMES, chunksize=1))
    json.dump(dict(NB=NB, XMAX=XMAX, agrid=AGRID, res=res), open(OUT, 'w'))
    print('DONE %.0fs' % (time.time() - t0))
