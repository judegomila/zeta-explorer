# Prime-side evaluation of the group-law inequality (C-F) left of Re s = 1 for zeta and controls.
#   T_F(sigma, t; U) = sum_{n <= N} Lambda_F(n) n^(-sigma) (1 - log n / U)_+ * 2 (1 + cos(t log n))^2
# (= 3 S(sigma) + 4 Re S(sigma + it) + Re S(sigma + 2it), S the Fejer-weighted log-derivative sum).
# float64 screen (MEASURED). Phase error bound: t log n <= 1.4e10, relative rounding 2.2e-16 -> < 1e-5 rad.
# Usage: prime_side_test.py N NPOINTS [workers]   ; writes prime_side_test_<N>_<NPOINTS>.json next to itself.
import os, sys, json, math, time
for _k in ('OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[_k] = '1'
import numpy as np
from multiprocessing import Pool
HERE = os.path.dirname(os.path.abspath(__file__))
N = int(float(sys.argv[1])); NPTS = int(float(sys.argv[2]))
WORKERS = int(sys.argv[3]) if len(sys.argv) > 3 else int(os.environ.get('RH_WORKERS', '4'))
B = int(os.environ.get('C18_B', '48'))
if __name__ == '__main__': print(f'planned memory: per worker 3 arrays of {B} x {N} float64 = {3*B*N*8/2**30:.2f} GB; workers {WORKERS}; total about {WORKERS*3*B*N*8/2**30 + 0.5:.1f} GB', flush=True)
US = [math.log(20), math.log(1e3), math.log(1e5), math.log(N)]

def mangoldt(N):
    lam = np.zeros(N+1); sieve = np.ones(N+1, dtype=bool); sieve[:2] = False
    for p in range(2, int(N**0.5)+1):
        if sieve[p]: sieve[p*p::p] = False
    for p in np.nonzero(sieve)[0]:
        q = int(p); lp = math.log(q)
        while q <= N:
            lam[q] = lp; q *= int(p)
    return lam
def logder_coeffs(a):   # Lambda_F from a (a[1] = 1): a log = Lambda_F * a
    N = len(a)-1; L = a*np.log(np.maximum(np.arange(N+1), 1))
    for d in range(2, N//2+1):
        if L[d] != 0.0:
            L[2*d::d] -= L[d]*a[2:N//d+1]
    L[0] = L[1] = 0; return L
def build():
    n = np.arange(N+1); logn = np.log(np.maximum(n, 1)).astype(np.float64)
    lam = mangoldt(N); fam = {}
    fam['ZETA'] = lam
    fam['E_a(0.1)'] = lam*(np.exp(0.1*logn) + np.exp(-0.1*logn))
    c, q = 2.2, 3.0
    disc = math.sqrt(c*c*q - 4*q); w1, w2 = (-c*math.sqrt(q)+disc)/(2*q), (-c*math.sqrt(q)-disc)/(2*q)
    tn = lam.copy(); k = 1
    while 3**k <= N:
        tn[3**k] += -math.log(3)*(w1**(-k) + w2**(-k)); k += 1
    fam['T-NR(3,2.2)'] = tn
    kap = (math.sqrt(10-2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
    per = np.array([0, 1, kap, -kap, -1.0]); a = per[n % 5]; a[0] = 0
    fam['DH'] = logder_coeffs(a)
    lio = lam.copy()
    # Liouville twist: Lambda(p^k) (-1)^k
    sieve = lam > 0
    om = np.zeros(N+1)
    pr = [int(p) for p in np.nonzero(sieve)[0] if abs(lam[p] - math.log(p)) < 1e-12]
    for p in pr:
        qv = p; k = 1
        while qv <= N:
            lio[qv] = lam[qv]*(-1)**k; qv *= p; k += 1
    fam['LIOUVILLE'] = lio
    ah = np.exp(-0.5*logn**2/4); ah[0] = 0
    fam['HEAT(-0.5),coef'] = logder_coeffs(ah)
    return logn, fam

logn, fam = build()
NAMES = list(fam)
V = np.zeros((N+1, len(NAMES)*len(US)))
for i, nm in enumerate(NAMES):
    for j, U in enumerate(US):
        V[:, i*len(US)+j] = fam[nm]*np.clip(1 - logn/U, 0, None)
V[:2] = 0
keep = np.nonzero(np.abs(V).sum(axis=1) > 0)[0]
V = np.ascontiguousarray(V[keep]); AV = np.abs(V); LG = np.ascontiguousarray(logn[keep])
if __name__ == '__main__': print('active n:', len(keep), 'of', N, flush=True)

def work(args):
    sig, t = args
    ph = np.outer(t, LG); np.cos(ph, out=ph); ph += 1.0; ph *= ph; ph *= 2.0
    W = np.exp(np.outer(-sig, LG))
    nrm = 3.0*(W @ AV)
    ph *= W
    return ph @ V, nrm

def run(sig, t):
    chunks = [(sig[i:i+B], t[i:i+B]) for i in range(0, len(sig), B)]
    with Pool(WORKERS) as pool:
        res = pool.map(work, chunks, chunksize=4)
    return np.vstack([r[0] for r in res]), np.vstack([r[1] for r in res])

def summarise(T, nrm, sig, t):
    out = {}
    R = T/np.maximum(nrm, 1e-300)
    for i, nm in enumerate(NAMES):
        for j, U in enumerate(US):
            r = R[:, i*len(US)+j]; k = int(np.argmin(r))
            out[f'{nm}|X={math.exp(U):.6g}'] = dict(frac_negative=float(np.mean(r < -1e-3)), frac_below_1em3=float(np.mean(r < 1e-3)),
                min_ratio=float(r[k]), at_sigma=float(sig[k]), at_t=float(t[k]), median_ratio=float(np.median(r)), max_ratio=float(r.max()))
    return out

def main():
    t0 = time.time()
    rng = np.random.default_rng(20261119)
    sig = rng.uniform(0.55, 0.95, NPTS); t = np.exp(rng.uniform(0, math.log(1e9), NPTS))
    T, nrm = run(sig, t)
    result = dict(N=N, npoints=NPTS, families=NAMES, X_values=[math.exp(U) for U in US],
                  note='ratio = T_F / (3 sum |Lambda_F(n)| n^-sigma v_U(log n)); negative means the inequality fails at that point',
                  random=summarise(T, nrm, sig, t))
    # by height decade for the two longest tests
    dec = {}
    for lo in range(0, 9):
        m = (t >= 10**lo) & (t < 10**(lo+1))
        if m.sum():
            R = T[m]/np.maximum(nrm[m], 1e-300)
            dec[f'1e{lo}..1e{lo+1}'] = {f'{nm}|X={math.exp(US[j]):.6g}': [float(np.mean(R[:, i*len(US)+j] < -1e-3)), float(R[:, i*len(US)+j].min())]
                                       for i, nm in enumerate(NAMES) for j in (0, len(US)-1)}
    result['by_decade_frac_negative_and_min'] = dec
    # targeted: heights of the T-NR zeros (Re s = 0.90375), sigma on both sides
    kk = np.arange(0, 2000); tt = (2*kk+1)*math.pi/math.log(3)
    for s0 in (0.85, 0.9038, 0.95):
        Tt, nt = run(np.full(len(tt), s0), tt)
        result[f'targeted_TNR_zero_heights_sigma={s0}'] = summarise(Tt, nt, np.full(len(tt), s0), tt)
    # targeted: DH off-line zero heights; first zeta zero heights (zeros of E_a at Re s = 0.6)
    td = np.array([85.6993484854, 114.1633427308]); 
    for s0 in (0.6508300806, 0.8085171825):
        Tt, nt = run(np.full(2, s0), td); result[f'targeted_DH_zero_heights_sigma={s0}'] = summarise(Tt, nt, np.full(2, s0), td)
    tz = np.array([14.134725141734693, 21.022039638771555, 25.010857580145688, 30.424876125859513, 32.935061587739189, 37.586178158825671, 40.918719012147495, 43.327073280914999, 48.005150881167159, 49.773832477672302])
    Tt, nt = run(np.full(len(tz), 0.6), tz); result['targeted_zeta_zero_heights_sigma=0.6'] = summarise(Tt, nt, np.full(len(tz), 0.6), tz)
    result['seconds'] = time.time() - t0
    json.dump(result, open(os.path.join(HERE, f'prime_side_test_{N}_{NPTS}.json'), 'w'), indent=1)
    print(json.dumps(result['random'], indent=1)); print('seconds', result['seconds'])


if __name__ == '__main__':
    main()
