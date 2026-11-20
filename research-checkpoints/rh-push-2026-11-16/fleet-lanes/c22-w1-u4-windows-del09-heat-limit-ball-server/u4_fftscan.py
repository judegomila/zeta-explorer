# Float64 screen (never a verdict): lambda_min of Lg - (B + B^*) on K sine modes, B(t) = sum_{n<P} w_n e^(-i t log n) O_(log n),
# evaluated on arithmetic progressions of heights by a Gaussian-gridding non-uniform FFT (Greengard-Lee), checked against
# direct sums in every block. Usage: python u4_fftscan.py T_start T_end step KMAX families(comma or 'all') out.json
import os, sys
os.environ['OMP_NUM_THREADS'] = '1'; os.environ['OPENBLAS_NUM_THREADS'] = '1'
import json, math, time
import numpy as np
import scipy.sparse as sp
import scipy.fft as sfft
from multiprocessing import Pool
from u4lib import *
T_START, T_END, STEP = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]); KMAX = int(sys.argv[4])
FSEL = sys.argv[5]; OUT = os.path.abspath(sys.argv[6])
WORKERS = int(os.environ.get('RH_WORKERS', '4'))
MSP = 10; RATIO = 2; BASE = 2000.0
PMAX = int(T_END**THETA) + 100
PR = sieve(PMAX)
SETS = make_sets(PR)
NN, PP, MM = prime_powers(PR, PMAX)
LN_LD = np.log(NN.astype(np.longdouble)); LN = LN_LD.astype(float)
WALL = weights(NN, PP, MM, SETS)
CODES = {'DEL055': 'DEL b=0.55', 'DEL075': 'DEL b=0.75', 'DEL09': 'DEL b=0.9', 'THIN075': 'THIN b=0.75'}
NAMES = list(WALL) if FSEL == 'all' else ['zeta'] + [CODES[x] for x in FSEL.split(',') if x != 'zeta']
BINS = np.arange(-12.0, 30.0001, 0.25)
def blocks():
    out = []; t0 = T_START
    while t0 < T_END - 1e-9:
        k = max(0, min(KMAX, int(math.floor(math.log2(t0/1e5)))))
        L = BASE*2**k
        out.append((t0, min(L, T_END - t0))); t0 += L
    return out
def block(arg):
    t0, L = arg
    P = int(math.floor(t0**THETA)); u = math.log(P)
    N = int(np.searchsorted(NN, P, side='left'))                     # n < P
    ln = LN[:N]; lnld = LN_LD[:N]
    O = overlaps_np(ln, u).reshape(N, K*K)
    M = int(round(L/STEP)); M += M % 2
    Mr = RATIO*M
    tc = t0 + (M//2 + 0.5)*STEP                                      # heights t_m = tc + m STEP, m = -M/2 .. M/2-1
    mm = np.arange(-M//2, M//2)
    ts = tc + mm*STEP
    keep = ts < T_END
    tau = math.pi*MSP/(M*M*RATIO*(RATIO - 0.5))
    x = STEP*ln; hx = 2*math.pi/Mr
    i0 = np.rint(x/hx).astype(np.int64)
    taps = np.arange(-MSP, MSP + 1)
    rows = (i0[:, None] + taps[None, :])
    data = np.exp(-((x[:, None] - hx*rows)**2)/(4*tau))
    G = sp.csr_matrix((data.ravel(), ((rows % Mr).ravel(), np.repeat(np.arange(N), len(taps)))), shape=(Mr, N))
    ph = phases(tc, lnld)
    decon = np.exp(mm.astype(float)**2*tau)/math.sqrt(4*math.pi*tau)*(2*math.pi/Mr)
    Lg = np.log(ts/(2*math.pi))
    e = errK(t0, P, K*math.pi/u)
    rng = np.random.default_rng(int(t0))
    chk = rng.integers(0, M, size=3)
    res = {}; dev = 0.0
    for nm in NAMES:
        C = (WALL[nm][:N]*ph)[:, None]*O
        grid = G @ C
        Fh = sfft.fft(grid, axis=0, overwrite_x=True)
        del grid
        B = (Fh[mm % Mr, :]*decon[:, None]).reshape(M, K, K)
        del Fh
        for ci in chk:                                               # direct sums
            Bd = ((WALL[nm][:N]*phases(ts[ci], lnld))[:, None]*O).sum(axis=0).reshape(K, K)
            dev = max(dev, float(np.max(np.abs(Bd - B[ci]))))
        lam = np.empty(M)
        for c0 in range(0, M, 65536):
            Bc = B[c0:c0+65536]
            Q = -(Bc + np.conj(np.transpose(Bc, (0, 2, 1))))
            idx = np.arange(K); Q[:, idx, idx] += Lg[c0:c0+65536, None]
            lam[c0:c0+65536] = np.linalg.eigvalsh(Q)[:, 0]
        del B
        lam = lam[keep]; tk = ts[keep]
        i = int(np.argmin(lam))
        res[nm] = dict(min=float(lam[i]), t=repr(float(tk[i])), below_err=int(np.sum(lam < -e)), below_0=int(np.sum(lam < 0)), n=int(len(lam)),
                       sum=float(np.sum(lam)), hist=np.histogram(lam, bins=BINS)[0].tolist(), out_of_hist=int(np.sum((lam < BINS[0]) | (lam >= BINS[-1]))))
    return t0, L, P, N, e, dev, res
if __name__ == '__main__':
    t_begin = time.time()
    bl = blocks()
    Mmax = int(round(BASE*2**KMAX/STEP)); Nmax = len(NN)
    per = (2*Mmax*36*16*2 + Mmax*36*16 + Nmax*36*16*2 + Nmax*21*20)/1e6
    print(f"PLAN: range [{T_START}, {T_END}] step {STEP}: heights {int((T_END-T_START)/STEP)}, blocks {len(bl)}, workers {WORKERS}, families {NAMES}; "
          f"prime powers <= {PMAX}: {Nmax}; largest block {Mmax} heights; planned peak per worker about {per:.0f} MB "
          f"(gridded array {2*Mmax*36*16/1e6:.0f} MB, its FFT the same, B {Mmax*36*16/1e6:.0f} MB, coefficients {Nmax*36*16/1e6:.0f} MB); total about {per*WORKERS/1e3:.1f} GB", flush=True)
    print('SETS', json.dumps(sets_record(SETS)), flush=True)
    agg = {}; top = {}; maxdev = 0.0
    bl.sort(key=lambda a: -a[1])
    with Pool(WORKERS) as pool:
        for bi, (t0, L, P, N, e, dev, res) in enumerate(pool.imap_unordered(block, bl, chunksize=1)):
            maxdev = max(maxdev, dev)
            for nm, r in res.items():
                a = agg.setdefault(nm, {'heights': 0, 'below_err': 0, 'below_0': 0, 'sum': 0.0, 'min': 1e9, 'hist': [0]*(len(BINS)-1), 'out_of_hist': 0})
                a['heights'] += r['n']; a['below_err'] += r['below_err']; a['below_0'] += r['below_0']; a['sum'] += r['sum']; a['min'] = min(a['min'], r['min'])
                a['hist'] = [x + y for x, y in zip(a['hist'], r['hist'])]; a['out_of_hist'] += r['out_of_hist']
                top.setdefault(nm, []).append({'lam': r['min'], 't': r['t'], 'P_block': P, 'block_t0': t0, 'block_len': L, 'err_block': e, 'block_below_err': r['below_err'], 'block_below_0': r['below_0']})
                top[nm] = sorted(top[nm], key=lambda x: x['lam'])[:12]
            if bi % 100 == 0:
                print('block', bi, 'of', len(bl), round(time.time() - t_begin), 's maxdev %.2e' % maxdev, {nm: (round(a['min'], 4), a['below_0']) for nm, a in agg.items()}, flush=True)
                json.dump({'partial': True, 'blocks_done': bi + 1, 'agg': agg, 'top': top, 'maxdev': maxdev}, open(OUT + '.partial', 'w'))
    for nm, a in agg.items(): a['mean lambda_min'] = a['sum']/max(a['heights'], 1)
    json.dump({'range': [T_START, T_END], 'step': STEP, 'theta': THETA, 'K': K, 'KMAX': KMAX, 'MSP': MSP, 'bins': [float(BINS[0]), float(BINS[-1]), 0.25], 'agg': agg, 'top': top,
               'max_deviation_from_direct_sums': maxdev, 'seconds': time.time() - t_begin, 'sets': sets_record(SETS)}, open(OUT, 'w'), indent=1)
    print('DONE maxdev %.3e' % maxdev, json.dumps({nm: {k: v for k, v in a.items() if k != 'hist'} for nm, a in agg.items()}), flush=True)
