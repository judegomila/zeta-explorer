# Server scan (float64 screen; never a verdict): lambda_min of the band form Lg - 2 Re A_P on K sine modes of L^2[0,u],
# u = log P, P = floor(t^0.75), for zeta, DEL(b) and THIN(b) with zeta's Arch imposed. Windows selected here are re-evaluated
# at 30 digits locally (u4_confirm.py). Usage: python u4_scan.py T_start T_end step out.json
import os, sys
os.environ['OMP_NUM_THREADS'] = '1'; os.environ['OPENBLAS_NUM_THREADS'] = '1'
import json, math, time
import numpy as np
from multiprocessing import Pool
T_START, T_END, STEP = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])
OUT = os.path.abspath(sys.argv[4])
THETA = 0.75; K = 6; BLOCK = 2000.0; CH = 1000
WORKERS = int(os.environ.get('RH_WORKERS', '4'))
def sieve(N):
    s = bytearray([1])*(N+1); s[0] = s[1] = 0
    for i in range(2, int(N**0.5)+1):
        if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
    return [i for i in range(N+1) if s[i]]
PMAX = int(T_END**THETA) + 10
PR = sieve(PMAX)
def greedy(b, half):
    Lval = 0.0; prev = 2.0; c = 0; S = set()
    def seg(x0, x1, n=8):
        h = (x1-x0)/n; return sum(((x0+(i+.5)*h)**(b-1))/math.log(x0+(i+.5)*h) for i in range(n))*h
    for p in PR[1:]:
        Lval += seg(prev, float(p)); prev = float(p)
        tgt = math.floor(Lval/2) if half else math.floor(Lval)
        if tgt > c: c += 1; S.add(p)
    return S
SETS = {'DEL b=0.55': (greedy(0.55, False), 0), 'DEL b=0.75': (greedy(0.75, False), 0), 'DEL b=0.9': (greedy(0.9, False), 0),
        'THIN b=0.75': (greedy(0.75, True), -1)}
def overlaps_np(a, u):
    a = np.asarray(a)[:, None, None]
    j = np.arange(1, K+1)[None, :, None]*math.pi/u; k = np.arange(1, K+1)[None, None, :]*math.pi/u
    dm = j - k; dp = j + k
    safe = np.where(np.abs(dm) > 1e-14, dm, 1.0)
    t1 = np.where(np.abs(dm) > 1e-14, (np.sin(dm*u + k*a) - np.sin(dm*a + k*a))/safe, (u - a)*np.cos(k*a))
    t2 = (np.sin(dp*u - k*a) - np.sin(dp*a - k*a))/dp
    return np.where(a < u, (t1 - t2)/u, 0.0)
def errK(t, P, nprime):
    Lg = math.log(t/(2*math.pi)); u = math.log(P); eps = 16*math.log(t)/t*nprime
    EM = eps*(2*Lg + 4.2*math.sqrt(P)) + eps**2 + 10*Lg/t**2
    E0 = 16*(math.log(t)/t)*(3*Lg + 4.2*math.sqrt(P)) + 4*u*math.sqrt(P)*t**-2*Lg*nprime
    return (EM + E0*nprime)/Lg
def block(t0):
    P = int(math.floor(t0**THETA)); u = math.log(P)
    pp = []
    for p in PR:
        if p >= P: break
        n = p; k = 1
        while n < P: pp.append((n, p, k)); n *= p; k += 1
    ln = np.log(np.array([x[0] for x in pp], dtype=float))
    W = {'zeta': np.array([math.log(p)/math.sqrt(n) for n, p, k in pp])}
    for nm, (S, sg) in SETS.items():
        W[nm] = np.array([(0.0 if sg == 0 else (-1.0)**k) * math.log(p)/math.sqrt(n) if p in S else math.log(p)/math.sqrt(n) for n, p, k in pp])
    O = overlaps_np(ln, u).reshape(len(pp), K*K)
    WO = {nm: (w[:, None]*O) for nm, w in W.items()}
    ts = t0 + (np.arange(int(round(BLOCK/STEP))) + 0.5)*STEP
    ts = ts[ts < T_END]
    e = errK(t0, P, K*math.pi/u)
    res = {nm: {'min': 1e9, 't': 0.0, 'vec': None, 'below_err': 0, 'below_0': 0, 'n': 0, 'sum': 0.0} for nm in W}
    for c0 in range(0, len(ts), CH):
        tc = ts[c0:c0+CH]
        ph = np.exp(-1j*np.outer(tc, ln)); Lg = np.log(tc/(2*math.pi))
        for nm in W:
            Bm = (ph @ WO[nm]).reshape(len(tc), K, K)
            Q = Lg[:, None, None]*np.eye(K)[None] - (Bm + np.conj(np.transpose(Bm, (0, 2, 1))))
            ev, vec = np.linalg.eigh(Q); lam = ev[:, 0]; i = int(np.argmin(lam)); r = res[nm]
            if lam[i] < r['min']: r['min'] = float(lam[i]); r['t'] = float(tc[i]); r['vec'] = [[float(z.real), float(z.imag)] for z in vec[i, :, 0]]
            r['below_err'] += int(np.sum(lam < -e)); r['below_0'] += int(np.sum(lam < 0)); r['n'] += len(tc); r['sum'] += float(np.sum(lam))
    return t0, P, e, res
if __name__ == '__main__':
    t_begin = time.time()
    starts = list(np.arange(T_START, T_END, BLOCK))
    nmax = sum(1 for p in PR if p < PMAX)*1.1
    print(f"PLAN: blocks={len(starts)} workers={WORKERS} heights={int((T_END-T_START)/STEP)}; per worker phase chunk {CH}x{int(nmax)} complex = {CH*nmax*16/1e6:.0f} MB", flush=True)
    agg = {}; top = {}
    with Pool(WORKERS) as pool:
        for bi, (t0, P, e, res) in enumerate(pool.imap_unordered(block, starts, chunksize=1)):
            for nm, r in res.items():
                a = agg.setdefault(nm, {'heights': 0, 'below_err': 0, 'below_0': 0, 'sum': 0.0, 'min': 1e9})
                a['heights'] += r['n']; a['below_err'] += r['below_err']; a['below_0'] += r['below_0']; a['sum'] += r['sum']; a['min'] = min(a['min'], r['min'])
                top.setdefault(nm, []).append({'lam': r['min'], 't': r['t'], 'vec': r['vec'], 'P_block': P, 'err_block': e, 'block_below_err': r['below_err']})
                top[nm] = sorted(top[nm], key=lambda x: x['lam'])[:8]
            if bi % 50 == 0: print('block', bi, 'of', len(starts), round(time.time() - t_begin), 's', {nm: round(a['min'], 3) for nm, a in agg.items()}, flush=True)
    for nm, a in agg.items(): a['mean lambda_min'] = a['sum']/max(a['heights'], 1)
    json.dump({'range': [T_START, T_END], 'step': STEP, 'theta': THETA, 'K': K, 'agg': agg, 'top': top, 'seconds': time.time() - t_begin,
               'sets_first': {nm: sorted(S)[:10] for nm, (S, sg) in SETS.items()}, 'sets_size': {nm: len(S) for nm, (S, sg) in SETS.items()}}, open(OUT, 'w'), indent=1)
    print('DONE', json.dumps(agg), flush=True)
