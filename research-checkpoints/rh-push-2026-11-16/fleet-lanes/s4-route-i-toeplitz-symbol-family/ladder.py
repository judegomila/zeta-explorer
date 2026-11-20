"""Combinations 1 and 3 (lane s4-route-i-toeplitz-symbol-family).
lambda_min of Weil forms on L^2(-a,a) (Legendre Galerkin, time-domain assembly, python-flint midpoint balls; wlib.py of lane
s2-weil-coefficient-rigidity) for: zeta and its S-truncations (coefficients kept only on the prime powers of S), Dirichlet
characters, Davenport-Heilbronn and its truncations, T-NR, sign and unimodular twists, on a list of supports 2a.
usage: python ladder.py N prec workers outdir NLIST(comma) 2a_1 2a_2 ...
"""
import sys, json, time, math, os, pickle
import multiprocessing as mp
import numpy as np
from wlib import *
from flint import arf

N = int(sys.argv[1]); PREC = int(sys.argv[2]); WORKERS = int(sys.argv[3]); OUT = sys.argv[4]
NLIST = [int(x) for x in sys.argv[5].split(',')]
SUP = sys.argv[6:]
ZK = ['0.25', '0.75'] + (['0.3125', '0.1875', '0.375', '0.125'] if os.environ.get('EA', '0') == '1' else [])
setprec(PREC)
os.makedirs(OUT, exist_ok=True)

def ser(M): return [[tuple(int(t) for t in M[i, j].mid().man_exp()) for j in range(M.ncols())] for i in range(M.nrows())]
def des(L): return arb_mat([[arb(arf(t)) for t in row] for row in L])

def stage1(wi):
    setprec(PREC)
    nodes = [(p, k) for p in range(2) for k in range(N + 56)][wi::WORKERS]
    G = gl(N + 56); panels = 2
    Alog = arb_mat(N, N); T = {(s, z): arb_mat(N, N) for s in SUP for z in ZK}
    I2 = eye(N) * 2
    av = {s: arb(s) / 2 for s in SUP}
    t0 = time.time()
    for c, (p, k) in enumerate(nodes):
        x, w = G[k]; lo = arb(2 * p) / panels; hw = arb(1) / panels
        v = lo + hw * (1 + x); wv = w * hw
        S = smat(v, N)
        Alog = Alog + (I2 - S) * (wv / (2 * v))
        for s in SUP:
            a = av[s]
            for z in ZK:
                T[(s, z)] = T[(s, z)] + S * (r_z(arb(z), a * v) * a * wv)
        if wi == 0 and c % 20 == 0: print('stage1 worker0 node %d/%d %.0fs' % (c, len(nodes), time.time() - t0), flush=True)
    fn = os.path.join(OUT, 'stage1_%d.pkl' % wi)
    with open(fn, 'wb') as f:
        pickle.dump(('Alog', ser(Alog)), f)
        for key in T:
            pickle.dump((key, ser(T[key])), f); T[key] = None
    return fn

# ---------------- objects ----------------
NMAX = 14
def chi_table(D):
    q = abs(D)
    tabs = {-3: [0, 1, -1], -4: [0, 1, 0, -1], 5: [0, 1, -1, -1, 1], -7: [0, 1, 1, -1, 1, -1, -1], 8: [0, 1, 0, -1, 0, -1, 0, 1],
            -8: [0, 1, 0, 1, 0, -1, 0, -1], 12: [0, 1, 0, 0, 0, -1, 0, -1, 0, 0, 0, 1]}
    if D in tabs: return tabs[D]
    qr = {(x * x) % q for x in range(1, q)}
    return [0] + [1 if x in qr else -1 for x in range(1, q)]

def restrict(c, S):
    """keep c(n) only for n whose prime factors all lie in S (monoid); S = None keeps all"""
    out = list(c)
    for n in range(2, len(c)):
        m = n
        for p in S:
            while m % p == 0: m //= p
        if m != 1: out[n] = arb(0)
    return out

def restrict_pp(c, S):
    """keep c(n) only for n = p^k, p in S"""
    out = list(c)
    for n in range(2, len(c)):
        pk = primepower(n)
        if not (pk and pk[0] in S): out[n] = arb(0)
    return out

def objects():
    """name -> (zs, poles, shift, coef, ladder flag)"""
    O = {}
    cz = coef_zeta(NMAX)
    ZP = (['0.25'], ['0.5'])
    O['ZETA'] = (*ZP, arb(0), cz, True)
    for nm, S in (('S2', [2]), ('S23', [2, 3]), ('S235', [2, 3, 5]), ('S2357', [2, 3, 5, 7])):
        O['ZETA-' + nm] = (*ZP, arb(0), restrict(cz, S), nm in ('S2', 'S23'))
    for D in (-3, -4, 5, -7, 8, -8, -11, 12, 13):
        tab = chi_table(D); cc = coef_chi(NMAX, tab)
        fam = (['0.25'], []) if D > 0 else (['0.75'], [])
        O['CHI%d' % D] = (*fam, arb(abs(D)).log(), cc, False)
        for nm, S in (('S2', [2]), ('S23', [2, 3]), ('S235', [2, 3, 5])):
            if D in (-3, 5, -7, 13): O['CHI%d-%s' % (D, nm)] = (*fam, arb(abs(D)).log(), restrict(cc, S), False)
    # complex character mod 5 (chi(2) = i), real test functions: c(n) = Re chi(n) Lambda(n); same gamma factor and conductor as DH
    cx = coef_chi(NMAX, [0, 1, 0, 0, -1])
    O['X5C'] = (['0.75'], [], arb(5).log(), cx, True)
    for nm, S in (('S2', [2]), ('S23', [2, 3]), ('S235', [2, 3, 5])):
        O['X5C-' + nm] = (['0.75'], [], arb(5).log(), restrict(cx, S), False)
    cd = coef_dh(NMAX)
    O['DH'] = (['0.75'], [], arb(5).log(), cd, True)
    O['DH-S2'] = (['0.75'], [], arb(5).log(), restrict(cd, [2]), True)
    O['DH-S23pp'] = (['0.75'], [], arb(5).log(), restrict_pp(cd, [2, 3]), False)       # 2,3,4,8,9 (no 6, 12)
    O['DH-S23'] = (['0.75'], [], arb(5).log(), restrict(cd, [2, 3]), False)            # monoid 2^a 3^b (6, 12 kept)
    O['DH-S237'] = (['0.75'], [], arb(5).log(), restrict(cd, [2, 3, 7]), False)
    O['DH-pp'] = (['0.75'], [], arb(5).log(), restrict_pp(cd, [2, 3, 5, 7, 11, 13]), False)   # DH with all non-prime-power coefficients removed
    for q in (2, 3):
        for cpar in ('2.2', '1.0'):
            ct = coef_tnr(NMAX, q, cpar)
            O['TNR-q%d-c%s' % (q, cpar)] = (*ZP, 2 * arb(q).log(), ct, False)
            O['TNR-q%d-c%s-S2' % (q, cpar)] = (*ZP, 2 * arb(q).log(), restrict(ct, [2]), False)
            O['TNR-q%d-c%s-S23' % (q, cpar)] = (*ZP, 2 * arb(q).log(), restrict(ct, [2, 3]), False)
    # sign twists, zeta's gamma factor, pole projected out
    liou = coef_mult(NMAX, lambda p: -1)
    f2 = coef_mult(NMAX, lambda p: -1 if p == 2 else 1)
    f3 = coef_mult(NMAX, lambda p: -1 if p == 3 else 1)
    for nm, c in (('LIOU', liou), ('FLIP2', f2), ('FLIP3', f3)):
        O['SGN-' + nm] = (*ZP, arb(0), c, False)
        O['SGN-%s-S2' % nm] = (*ZP, arb(0), restrict(c, [2]), False)
        O['SGN-%s-S23' % nm] = (*ZP, arb(0), restrict(c, [2, 3]), False)
    # control coefficients in zeta's gamma factor (mismatch probes)
    O['DHcoef-ZETAarch'] = (*ZP, arb(0), cd, False)
    O['DHcoef-ZETAarch-S2'] = (*ZP, arb(0), restrict(cd, [2]), False)
    if len(ZK) > 2:
        for b, zs, ps in (('1/8', ['0.3125', '0.1875'], ['0.625', '0.375']), ('1/4', ['0.375', '0.125'], ['0.75', '0.25'])):
            ce = coef_ea(NMAX, arb(1) / int(b[2:]))
            O['EA-' + b] = (zs, ps, arb(0), ce, False)
            O['EA-%s-S2' % b] = (zs, ps, arb(0), restrict(ce, [2]), False)
            O['EA-%s-S23' % b] = (zs, ps, arb(0), restrict(ce, [2, 3]), False)
    return O

def complex_objects():
    O = {}
    primes = [2, 3, 5, 7, 11, 13]
    u = np.random.Generator(np.random.PCG64(120000)).random(6)
    e = dict(zip(primes, np.exp(2j * np.pi * u)))
    def mk(ef):
        c = [0j] * (NMAX + 1)
        for n in range(2, NMAX + 1):
            pk = primepower(n)
            if pk: c[n] = ef(pk[0], pk[1], n) * math.log(pk[0])
        return c
    O['U-A'] = mk(lambda p, k, n: e[p] ** k)
    O['U-2only'] = mk(lambda p, k, n: np.exp(1j * k) if p == 2 else 1.0)
    alpha = 1.2393168126993495
    O['WT'] = mk(lambda p, k, n: n ** (-1j * alpha))
    for nm in list(O):
        for tag, S in (('S2', [2]), ('S23', [2, 3])):
            c = list(O[nm])
            for n in range(2, NMAX + 1):
                pk = primepower(n)
                if not (pk and pk[0] in S): c[n] = 0j
            O[nm + '-' + tag] = c
    return O

def lam_of(B):
    Bf = tofloat(B)
    w, V = np.linalg.eigh((Bf + Bf.T) / 2)
    lam = float(w[0]); how = 'f64'; lam_s = repr(lam)
    if abs(lam) < 1e-7:
        r = eigmin_subspace(B, w, V); lam = r['lam']; how = 'ball'; lam_s = r['lam_str']
    return lam, how, lam_s

def stage2(s):
    setprec(PREC); t0 = time.time()
    a = arb(s) / 2
    base = eye(N) * (arb.const_euler() + (4 * a).log() + arb.pi().log())
    arch = {z: PAY['Alog'] - base - PAY['T'][(s, z)] for z in ZK}
    nmax = min(NMAX, int(math.exp(float(s)) + 1e-12))
    Sn = {}
    for n in range(2, nmax + 1):
        if not (arb(n).log() < 2 * a): continue
        C = rung(N, a, n); Sn[n] = (C, C + C.transpose())
    polev = {p: (pole_vec(N, a, arb(p), 1), pole_vec(N, a, arb(p), -1)) for p in ('0.5', '0.625', '0.375', '0.75', '0.25')[:1 if len(ZK) == 2 else 5]}
    O = objects()
    out = {'twoa': float(s), 'N': N, 'obj': {}}
    cache = {}
    def block(zs, poles, variant, Ns, par):
        key = (tuple(zs), tuple(poles), variant, Ns, par)
        if key in cache: return cache[key]
        idx = [i for i in range(Ns) if i % 2 == par]
        M0 = sub(sum((arch[z] for z in zs[1:]), arch[zs[0]]), idx)
        cols = []
        for p in poles:
            vp, vm = polev[p]
            cols.append([vp[i] + (vm[i] if par == 0 else -vm[i]) for i in idx])
        Z = None
        if variant == 'full':
            for col in cols:
                cm = arb_mat([[x] for x in col]); M0 = M0 + cm * cm.transpose() * (arb(1) / 2)
        elif cols:
            Z = complement(cols, len(idx))
        pr = (lambda M: M) if Z is None else (lambda M: Z.transpose() * M * Z)
        blk = (pr(M0), {n: pr(sub(S[1], idx)) for n, S in Sn.items()})
        cache[key] = blk
        return blk
    for nm, (zs, poles, shift, coef, ladder) in O.items():
        variants = ['pf'] + (['full'] if poles else [])
        for variant in variants:
            for Ns in (NLIST if ladder else [N]):
                rec = {}
                for par in (0, 1):
                    M0, R = block(zs, poles, variant, Ns, par)
                    B = M0 + eye(M0.nrows()) * shift
                    for n, Rn in R.items():
                        if float(abs(coef[n].mid())) != 0: B = B - Rn * coef[n]
                    lam, how, lam_s = lam_of(B)
                    rec['even' if par == 0 else 'odd'] = lam_s; rec['how%d' % par] = how
                out['obj']['%s|%s|%d' % (nm, variant, Ns)] = rec
    # complex (Hermitian) objects: zeta's gamma factor, both pole vectors projected out, float64
    vp, vm = polev['0.5']
    Z = complement([vp, vm], N)
    M0f = tofloat(Z.transpose() * arch['0.25'] * Z)
    Cf = {n: tofloat(Z.transpose() * S[0] * Z) for n, S in Sn.items()}
    for nm, c in complex_objects().items():
        H = M0f.astype(complex)
        for n, C in Cf.items():
            if c[n] != 0: H = H - (c[n] * C + np.conj(c[n]) * C.T)
        w = np.linalg.eigvalsh((H + H.conj().T) / 2)
        out['obj']['%s|pf|%d' % (nm, N)] = {'both': repr(float(w[0])), 'how0': 'f64c'}
    print(s, 'done %.0fs' % (time.time() - t0), 'ZETA pf', out['obj']['ZETA|pf|%d' % N], flush=True)
    json.dump(out, open(os.path.join(OUT, 'sup_%s.json' % s), 'w'))
    return s

if __name__ == '__main__':
    t0 = time.time()
    nm_ = len(SUP) * len(ZK) + 1
    print('N = %d, prec %d, %d supports, z keys %s; planned stage-1 memory per worker: %d ball matrices %dx%d (about %.2f GB), %d workers' % (
        N, PREC, len(SUP), ZK, nm_, N, N, nm_ * N * N * (64 + PREC / 8 + 48) / 1e9, WORKERS), flush=True)
    ctxf = mp.get_context('fork')
    CH = os.environ.get('CHUNK')          # CHUNK=i: compute stage-1 chunk i of WORKERS in this process, keep the file, exit
    if CH is not None:
        stage1(int(CH)); print('chunk %s of %d written %.0fs' % (CH, WORKERS, time.time() - t0), flush=True); sys.exit()
    files = [os.path.join(OUT, 'stage1_%d.pkl' % i) for i in range(WORKERS)]
    missing = [i for i in range(WORKERS) if not os.path.exists(files[i])]
    KEEP = not missing
    if missing:
        with ctxf.Pool(len(missing)) as pool:
            pool.map(stage1, missing, chunksize=1)
    Alog = arb_mat(N, N); T = {}
    for fn in files:
        with open(fn, 'rb') as f:
            while True:
                try: key, L = pickle.load(f)
                except EOFError: break
                M = des(L)
                if key == 'Alog': Alog = Alog + M
                else: T[key] = M + T[key] if key in T else M
        if not KEEP: os.remove(fn)
    globals()['PAY'] = {'Alog': Alog, 'T': T}
    print('stage 1 done %.0fs' % (time.time() - t0), flush=True)
    todo = [s for s in SUP if not os.path.exists(os.path.join(OUT, 'sup_%s.json' % s))]
    S2W = int(os.environ.get('S2WORKERS', WORKERS))
    if S2W == 1:
        for s_ in todo:
            if time.time() - t0 > float(os.environ.get('S2BUDGET', '840')):
                print('time budget reached; %d supports left for the next run' % (len(todo) - todo.index(s_)), flush=True); break
            stage2(s_)
    else:
        with ctxf.Pool(min(S2W, len(todo))) as pool:
            list(pool.imap_unordered(stage2, todo, chunksize=1))
    print('all done %.0fs' % (time.time() - t0), flush=True)
