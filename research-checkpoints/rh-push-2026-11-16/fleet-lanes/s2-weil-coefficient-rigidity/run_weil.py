"""Combinations 1, 2, 4: Weil forms on L^2(-a,a) with replaced coefficient vectors / own gamma factors.
usage: python run_weil.py N prec workers outfile [akeys...]
a keys: K<k> (2a = log(k+1)), s<x> (2a = x), a<x> (a = x).
"""
import sys, json, time, math, itertools, os
import multiprocessing as mp
import numpy as np
from wlib import *
from flint import arf

N = int(sys.argv[1]); PREC = int(sys.argv[2]); WORKERS = int(sys.argv[3]); OUT = sys.argv[4]
AKEYS = sys.argv[5:] or ['K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'a0.5',
                         's0.9', 's1.0', 's1.12', 's1.16', 's1.2', 's1.3', 's1.4', 's1.5', 's1.6']
ZKEYS = ['0.25', '0.75', '0.3125', '0.1875', '0.375', '0.125']
NMAX = 10
LIGHT = os.environ.get('LIGHT', '0') == '1'
setprec(PREC)

def aval(key):
    if key[0] == 'K': return arb(int(key[1:]) + 1).log() / 2
    if key[0] == 's': return arb(key[1:]) / 2
    return arb(key[1:])

def ser(M): return [[tuple(int(t) for t in M[i, j].mid().man_exp()) for j in range(M.ncols())] for i in range(M.nrows())]
def des(L): return arb_mat([[arb(arf(t)) for t in row] for row in L])

def stage1(chunk):
    setprec(PREC)
    panels, nodes = chunk
    G = gl(N + 56)
    Alog = arb_mat(N, N); T = {(ak, zk): arb_mat(N, N) for ak in AKEYS for zk in ZKEYS}
    av = {ak: aval(ak) for ak in AKEYS}
    I2 = eye(N) * 2
    for (p, k) in nodes:
        x, w = G[k]
        lo = arb(2 * p) / panels; hw = arb(1) / panels
        v = lo + hw * (1 + x); wv = w * hw
        S = smat(v, N)
        Alog = Alog + (I2 - S) * (wv / (2 * v))
        for ak in AKEYS:
            a = av[ak]
            for zk in ZKEYS:
                T[(ak, zk)] = T[(ak, zk)] + S * (r_z(arb(zk), a * v) * a * wv)
    return ser(Alog), {key: ser(M) for key, M in T.items()}

# ---------------- objects ----------------
def sign_patterns():
    out = {}
    for bits in itertools.product([1, -1], repeat=4):
        e = dict(zip([2, 3, 5, 7], bits))
        out['SGN' + ''.join('+' if b > 0 else '-' for b in bits)] = coef_mult(NMAX, lambda p: e[p])
    return out

def del_coef(dels):
    c = coef_zeta(NMAX)
    for n in range(2, NMAX + 1):
        pk = primepower(n)
        if pk and pk[0] in dels: c[n] = arb(0)
    return c

def real_objects():
    """name -> (family, shift(arb), coef list)"""
    O = {}
    for nm, c in sign_patterns().items(): O[nm] = ('ZP', arb(0), c)      # SGN++++ = zeta, SGN---- = Liouville, SGN++-+ = THIN-0.9 below 10
    O['DEL-0.75'] = ('ZP', arb(0), del_coef({5, 7}))
    O['DEL-0.9'] = ('ZP', arb(0), del_coef({3, 5, 7}))
    cz = coef_zeta(NMAX)
    c2 = list(cz); 
    for n in range(3, NMAX + 1): c2[n] = arb(0)
    O['ZETA-P2ONLY'] = ('ZP', arb(0), c2)
    O['ARCH-ONLY'] = ('ZP', arb(0), [arb(0)] * (NMAX + 1))
    for q in (2, 3, 5, 7):
        O['TNR-q%d-c2.2' % q] = ('ZP', 2 * arb(q).log(), coef_tnr(NMAX, q, '2.2'))
        O['TNR-q%d-c1.0' % q] = ('ZP', 2 * arb(q).log(), coef_tnr(NMAX, q, '1.0'))   # |c| <= 2: zeros on the line (positive comparison)
    O['CHI5'] = ('Z0', arb(5).log(), coef_chi(NMAX, CHI5))
    O['CHI-3'] = ('O0', arb(3).log(), coef_chi(NMAX, CHI3))
    O['DH'] = ('O0', arb(5).log(), coef_dh(NMAX))
    O['EA-1/8'] = ('EA8', arb(0), coef_ea(NMAX, arb(1) / 8))
    O['EA-1/4'] = ('EA4', arb(0), coef_ea(NMAX, arb(1) / 4))
    # zeta coefficients with the wrong gamma factor, and control coefficients with zeta's (mismatch probes)
    O['DHcoef-in-ZETAarch'] = ('ZP', arb(0), coef_dh(NMAX))
    O['CHI5coef-in-ZETAarch'] = ('ZP', arb(0), coef_chi(NMAX, CHI5))
    O['EA-1/8coef-in-ZETAarch'] = ('ZP', arb(0), coef_ea(NMAX, arb(1) / 8))
    return O

FAM = {'ZP': (['0.25'], ['0.5']), 'Z0': (['0.25'], []), 'O0': (['0.75'], []),
       'EA8': (['0.3125', '0.1875'], ['0.625', '0.375']), 'EA4': (['0.375', '0.125'], ['0.75', '0.25'])}

def complex_objects():
    """name -> list of complex c(n) (python complex), all in family ZP"""
    O = {}
    primes = [2, 3, 5, 7]
    for j in range(8):
        u = np.random.Generator(np.random.PCG64(120000 + j)).random(4)      # same seed rule as the battery (first four primes)
        e = dict(zip(primes, np.exp(2j * np.pi * u)))
        c = [0j] * (NMAX + 1)
        for n in range(2, NMAX + 1):
            pk = primepower(n)
            if pk: c[n] = e[pk[0]] ** pk[1] * math.log(pk[0])
        O['U-%02d' % j] = c
    alpha = 1.2393168126993495
    c = [0j] * (NMAX + 1)
    for n in range(2, NMAX + 1):
        pk = primepower(n)
        if pk: c[n] = math.log(pk[0]) * n ** (-1j * alpha)
    O['WT'] = c
    return O

class Family:
    def __init__(self, akey, a, fam, arch, Sn, polev, log):
        zs, poles = FAM[fam]
        self.zs, self.poles = zs, poles
        self.M0 = sum((arch[z] for z in zs[1:]), arch[zs[0]])
        self.Sn = Sn; self.polev = polev; self.cache = {}; self.fam = fam
    def block(self, variant, k, par):
        key = (variant, k, par)
        if key in self.cache: return self.cache[key]
        idx = [i for i in range(N) if i % 2 == par and i >= k]
        Ms = sub(self.M0, idx)
        cols = []
        for p in self.poles:
            vp, vm = self.polev[p]
            col = [vp[i] + (vm[i] if par == 0 else -vm[i]) for i in idx]
            cols.append(col)
        if variant == 'full':
            for col in cols:
                cm = arb_mat([[x] for x in col])
                Ms = Ms + cm * cm.transpose() * (arb(1) / 2)      # |ghat(ip)|^2 + |ghat(-ip)|^2 = (1/2)(col.c)^2 on a parity block
            Z = None
        else:
            Z = complement(cols, len(idx)) if cols else None
        def proj(M):
            return M if Z is None else Z.transpose() * M * Z
        M0c = proj(Ms)
        Rc = {n: proj(sub(S, idx)) for n, S in self.Sn.items()}
        blk = dict(M0=M0c, R=Rc, M0f=tofloat(M0c), Rf={n: tofloat(R) for n, R in Rc.items()}, d=M0c.nrows())
        self.cache[key] = blk
        return blk
    def lam(self, coef, shift, variant, k, par, want_p2=False):
        b = self.block(variant, k, par)
        cf = {n: float(coef[n].mid()) for n in b['R']}
        Mf = b['M0f'] + float(shift.mid()) * np.eye(b['d'])
        for n in b['R']: Mf = Mf - cf[n] * b['Rf'][n]
        w, V = np.linalg.eigh((Mf + Mf.T) / 2)
        lam = float(w[0]); v = V[:, 0]; how = 'f64'
        if abs(lam) < 1e-7:
            M = b['M0'] + eye(b['d']) * shift
            for n in b['R']: M = M - b['R'][n] * coef[n]
            r = eigmin_subspace(M, w, V)
            lam = r['lam']; how = 'ball'
            v = np.array([float(x.mid()) for x in r['vec']])
        out = dict(lam=lam, how=how, lam2=float(w[1]) if len(w) > 1 else None)
        v = v / np.linalg.norm(v)
        out['g'] = {n: float(v @ b['Rf'][n] @ v) for n in b['R']}       # <v, R_n v>: d lam / d c(n) = -g_n
        return out

def stage2(akey):
    part = '%s.%s.part.json' % (OUT, akey)
    if os.path.exists(part):
        return akey, json.load(open(part))
    try:
        res = stage2_inner(akey)
    except Exception as ex:
        import traceback
        print(akey, 'FAILED', traceback.format_exc(), flush=True)
        return akey, {'error': repr(ex)}
    json.dump(res[1], open(part, 'w'))
    return res

def stage2_inner(akey):
    setprec(PREC)
    t0 = time.time()
    a = aval(akey)
    D = PAY
    Alog = des(D['Alog'])
    cst = arb.const_euler() + (4 * a).log() + arb.pi().log()
    arch = {zk: Alog - eye(N) * cst - des(D['T'][(akey, zk)]) for zk in ZKEYS}
    ns = [n for n in range(2, NMAX + 1) if arb(n).log() < 2 * a]
    Cn = {n: rung(N, a, n) for n in ns}
    Sn = {n: C + C.transpose() for n, C in Cn.items()}
    polev = {p: (pole_vec(N, a, p, 1), pole_vec(N, a, p, -1)) for p in ['0.5', '0.625', '0.375', '0.75', '0.25']}
    fams = {f: Family(akey, a, f, arch, Sn, polev, None) for f in FAM}
    R = {'a': float(a.mid()), 'twoa': 2 * float(a.mid()), 'ns': ns, 'objects': {}, 'N': N}
    objs = real_objects()
    for nm, (fam, shift, coef) in objs.items():
        F = fams[fam]; res = {}
        variants = ['full', 'pf'] if F.poles else ['full']
        for var in variants:
            for k in range(4):
                e = F.lam(coef, shift, var, k, 0); o = F.lam(coef, shift, var, k, 1)
                rec = {'even': e['lam'], 'odd': o['lam'], 'how': e['how'] + '/' + o['how']}
                if k == 0:
                    rec['g_even'] = e['g']; rec['g_odd'] = o['g']
                    rec['lam2_even'] = e['lam2']; rec['lam2_odd'] = o['lam2']
                res['%s_k%d' % (var, k)] = rec
        res['coef'] = {n: float(coef[n].mid()) for n in ns}
        R['objects'][nm] = res
    print(akey, 'real objects done %.0fs' % (time.time() - t0), flush=True)
    # ---- complex (unimodular) objects: zeta arch, float64 Hermitian
    F = fams['ZP']
    M0f = tofloat(F.M0); Sf = {n: tofloat(S) for n, S in Sn.items()}
    Af = {n: tofloat(C - C.transpose()) for n, C in Cn.items()}
    vp, vm = polev['0.5']
    vpf = np.array([float(x.mid()) for x in vp]); vmf = np.array([float(x.mid()) for x in vm])
    for nm, c in ({} if LIGHT else complex_objects()).items():
        res = {}
        for var in ('full', 'pf'):
            for k in range(4):
                idx = list(range(k, N))
                H = M0f[np.ix_(idx, idx)].astype(complex)
                for n in ns:
                    H = H - c[n].real * Sf[n][np.ix_(idx, idx)] - 1j * c[n].imag * Af[n][np.ix_(idx, idx)]
                P = np.stack([vpf[idx], vmf[idx]], axis=1)
                if var == 'full':
                    H = H + P @ P.T
                else:
                    Qm, _ = np.linalg.qr(P, mode='complete'); Z = Qm[:, 2:]
                    H = Z.T @ H @ Z
                w = np.linalg.eigvalsh((H + H.conj().T) / 2)
                res['%s_k%d' % (var, k)] = {'lam': float(w[0]), 'how': 'f64-hermitian'}
        res['coef'] = {n: [c[n].real, c[n].imag] for n in ns}
        R['objects'][nm] = res
    # ---- Cramer model: every subset of {3..NMAX}, c(n) = log n on the subset, c(2) = log 2; exact probability weights prod 1/log n
    cr = {}
    for var in ('full', 'pf'):
        ptot = 0.0; pneg = 0.0; nneg = 0; ntot = 0; worst = None
        cand = [n for n in ns if n >= 3]
        for bits in ([] if LIGHT else itertools.product([0, 1], repeat=len(cand))):
            coef = [arb(0)] * (NMAX + 1); coef[2] = arb(2).log()
            pr = 1.0
            for n, b in zip(cand, bits):
                q = 1 / math.log(n)
                pr *= q if b else (1 - q)
                if b: coef[n] = arb(n).log()
            lam = min(F.lam(coef, arb(0), var, 0, 0)['lam'], F.lam(coef, arb(0), var, 0, 1)['lam'])
            ptot += pr; ntot += 1
            if lam < 0: pneg += pr; nneg += 1
            is_primes = all((b == 1) == (n in (3, 5, 7)) for n, b in zip(cand, bits))
            if is_primes: cr.setdefault('primes_only_lam', {})[var] = lam
        cr[var] = {'subsets': ntot, 'negative': nneg, 'prob_negative': pneg, 'prob_total': ptot}
    R['cramer'] = cr
    print(akey, 'complex + cramer done %.0fs' % (time.time() - t0), flush=True)
    # ---- admissible set {c : lam_min >= 0} around a base coefficient vector, in a fixed (gamma factor, pole) family: axis intervals
    cz = coef_zeta(NMAX)
    def admissible(F, shift, base_coef, var, var_rand=False):
        base = {par: F.lam(base_coef, shift, var, 0, par) for par in (0, 1)}
        lam0 = min(base[0]['lam'], base[1]['lam'])
        out = {'base': {'even': base[0]['lam'], 'odd': base[1]['lam']}, 'dirs': {}}
        if not lam0 > 0: return out
        def f(direction, t):
            coef = [base_coef[n] + direction[n] * arb(t) for n in range(NMAX + 1)]
            return min(F.lam(coef, shift, var, 0, 0)['lam'], F.lam(coef, shift, var, 0, 1)['lam'])
        dirs = {}
        for n in ns:
            d = [arb(0)] * (NMAX + 1); d[n] = arb(1); dirs['e%d' % n] = d
        dirs['scale'] = [base_coef[n] for n in range(NMAX + 1)]
        nrand = int(os.environ.get('RANDDIRS', '0')) if var_rand else 0
        rng = np.random.Generator(np.random.PCG64(4242))
        for j in range(nrand):
            g = rng.standard_normal(len(ns)); g /= np.linalg.norm(g)
            d = [arb(0)] * (NMAX + 1)
            for n, x in zip(ns, g): d[n] = arb(float(x))
            dirs['rand%03d' % j] = d
        for dn, d in dirs.items():
            edges = {}
            for sgn in (1, -1):
                lin = []
                for par in (0, 1):
                    slope = -sgn * sum(float(d[n].mid()) * base[par]['g'][n] for n in ns)
                    if slope < 0: lin.append(base[par]['lam'] / (-slope))
                tlin = min(lin) if lin else None
                lo = 0.0; flo = lam0; hi = None
                t = 2 * tlin if tlin else lam0
                for it in range(60):
                    val = f(d, sgn * t)
                    if val < 0: hi = t; fhi = val; break
                    lo = t; flo = val; t *= (2 if tlin else 8)
                    if t > 1e3: break
                key = '+' if sgn > 0 else '-'
                if hi is None:
                    edges[key] = {'edge': None, 'note': 'no sign change up to |t| = 1e3', 'linear': tlin}
                    continue
                side = 0; root = (lo + hi) / 2
                for it in range(60):
                    mid = (lo * fhi - hi * flo) / (fhi - flo)
                    if not (lo < mid < hi): mid = (lo + hi) / 2
                    fm = f(d, sgn * mid)
                    if fm < 0:
                        hi = mid; fhi = fm
                        if side == -1: flo /= 2
                        side = -1
                    else:
                        lo = mid; flo = fm
                        if side == 1: fhi /= 2
                        side = 1
                    root = mid
                    if hi - lo < 1e-5 * hi or abs(fm) < 1e-4 * lam0: break
                edges[key] = {'edge': sgn * root, 'bracket': [lo, hi], 'linear': (sgn * tlin if tlin else None)}
            out['dirs'][dn] = edges
        return out
    adm = {}
    for var in ('full', 'pf'):
        adm['ZETA_' + var] = admissible(F, arb(0), cz, var, True)
    adm['DH_own'] = admissible(fams['O0'], arb(5).log(), coef_dh(NMAX), 'full', True)
    if not LIGHT:
        adm['CHI-3_own'] = admissible(fams['O0'], arb(3).log(), coef_chi(NMAX, CHI3), 'full')
        adm['CHI5_own'] = admissible(fams['Z0'], arb(5).log(), coef_chi(NMAX, CHI5), 'full')
    R['admissible'] = adm
    # ---- combination 2: replace c(2) by x (zeta's form, full variant, even block): lam_min and P_2 on the minimiser
    c2rows = []
    L2 = math.log(2)
    xs = [-1, -0.5, 0, 0.5, 0.9, 0.99, 0.999, 0.9999, 1, 1.0001, 1.001, 1.01, 1.1, 2 ** .125 + 2 ** -.125, 2 ** .25 + 2 ** -.25, 2, 1 + 2.2 * math.sqrt(2),
          float(coef_dh(NMAX)[2].mid()) / L2]
    for x in xs:
        coef = list(cz); coef[2] = arb(x) * arb(2).log()
        row = {'x_over_log2': x}
        for var in ('full', 'pf'):
            for par, pn in ((0, 'even'), (1, 'odd')):
                r = F.lam(coef, arb(0), var, 0, par)
                row['%s_%s' % (var, pn)] = r['lam']
                row['%s_%s_P2' % (var, pn)] = x * L2 * r['g'].get(2, 0.0)
        c2rows.append(row)
    R['combo2_scan'] = c2rows
    print(akey, 'all done %.0fs' % (time.time() - t0), flush=True)
    return akey, R

if __name__ == '__main__':
    t0 = time.time()
    panels = 2; Q = N + 56
    nodes = [(p, k) for p in range(panels) for k in range(Q)]
    nspec = len(AKEYS) * len(ZKEYS)
    print('N = %d, prec = %d bits, workers = %d; quadrature nodes %d; planned: (%d + 1) ball matrices %dx%d per worker (~%.2f GB per worker at 0.2 kB per entry incl. serialised copies)'
          % (N, PREC, WORKERS, len(nodes), nspec, N, N, 3 * (nspec + 1) * N * N * 200 / 1e9), flush=True)
    chunks = [(panels, nodes[i::WORKERS]) for i in range(WORKERS)]
    ctxf = mp.get_context('fork')
    with ctxf.Pool(WORKERS) as pool:
        parts = pool.map(stage1, chunks)
    Alog = arb_mat(N, N); T = {}
    for A_, T_ in parts:
        Alog = Alog + des(A_)
        for key, L in T_.items():
            T[key] = des(L) + T[key] if key in T else des(L)
    print('stage 1 done %.0fs; A_log[0,0]-1 = %s' % (time.time() - t0, (Alog[0, 0] - 1).str(5)), flush=True)
    globals()['PAY'] = {'Alog': ser(Alog), 'T': {key: ser(M) for key, M in T.items()}}
    del parts
    with ctxf.Pool(min(WORKERS, len(AKEYS))) as pool:           # fork: workers inherit PAY
        results = dict(pool.map(stage2, AKEYS, chunksize=1))
    json.dump({'N': N, 'prec': PREC, 'results': results, 'elapsed': time.time() - t0}, open(OUT, 'w'), indent=1)
    print('written', OUT, 'elapsed %.0fs' % (time.time() - t0), flush=True)
