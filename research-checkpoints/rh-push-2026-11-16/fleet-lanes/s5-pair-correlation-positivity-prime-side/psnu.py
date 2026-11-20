"""s5 combination 1 (prime side): E(nu_a) = sum_{n<=X} c(n) n^(-1/2 + i nu_a) and D(nu_a) = sum c(n) log n n^(-1/2 + i nu_a)
on the critical grid nu_a = nu0 + a * 2 pi / L, L = log X, a = 0..n-1, for several families in one pass over the primes.

Method: e^{i a delta u} = e^{2 pi i a x}, x = u/L in (0, 1].  Cells of size 1/M (M = 16 n), offsets d = x - (cell + 1/2)/M,
Taylor moments mom_m[cell] = sum w d^m (m = 0..KT), then E_a = e^{i pi a/M} sum_m (2 pi i a)^m/m! * M ifft(mom_m)[a].
|2 pi a d| <= pi/16: truncation (pi/16)^(KT+1)/(KT+1)! = 4e-16 for KT = 10.  Phases nu0 * log n are reduced mod 2 pi in 80-bit long double.
float64 accumulation: a SCREEN (validated against the direct sum of w3.dirichlet_sums and against the zero side).

Families (coefficients of -F'/F at prime powers p^k):
 ZETA log p | CHI4 chi_{-4}(p^k) log p | CHI5R (p^k/5) log p | LIOU (-1)^k log p | RSGN eps_p^k log p, eps_p = +-1 by a hash of p
 UNI e^{i k theta_p} log p, theta_p by a hash | EA:a log p (n^a + n^-a) | TNR:q:c  zeta plus the terms at q^k of 1 + c q^(1/2-s) + q^(1-2s)
 DH (all integers, divisor recursion; separate mode).
"""
import sys, os, math, json, time
import numpy as np
from multiprocessing import Pool
PI = math.pi
KT = 10
LD = np.longdouble
TWO_PI_LD = 2 * np.arctan(LD(1)) * 4
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)

def small_primes(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]

def seg_primes(lo, hi, bp):
    """odd primes in [lo, hi), lo odd, lo >= 3"""
    n = (hi - lo + 1) // 2
    s = np.ones(n, dtype=bool)
    for p in bp:
        if p == 2: continue
        if p * p >= hi: break
        st = max(p * p, ((lo + p - 1) // p) * p)
        if st % 2 == 0: st += p
        s[(st - lo) // 2::p] = False
    return lo + 2 * np.nonzero(s)[0].astype(np.int64)

def hash64(p):
    h = p.astype(np.uint64) * np.uint64(0x9E3779B97F4A7C15)
    h ^= h >> np.uint64(29); h *= np.uint64(0xBF58476D1CE4E5B9); h ^= h >> np.uint64(32)
    return h

def eps_sign(p):
    return 1.0 - 2.0 * ((hash64(p) >> np.uint64(63)).astype(np.float64))

def theta_uni(p):
    return (hash64(p) >> np.uint64(11)).astype(np.float64) * (2 * PI / 2.0 ** 53)

CHI5R_TAB = np.array([0, 1, -1, -1, 1.0]); CHI4_TAB = np.array([0, 1.0, 0, -1.0])

def coeff(fam, p, k, lp):
    """c(p^k) for arrays p (int64), k (int64 or scalar), lp = log p (float64); returns float64 or complex128"""
    if fam == 'ZETA': return lp
    if fam == 'CHI4': return CHI4_TAB[p % 4] ** k * lp
    if fam == 'CHI5R': return CHI5R_TAB[p % 5] ** k * lp
    if fam == 'LIOU': return (-1.0) ** k * lp
    if fam == 'RSGN': return eps_sign(p) ** k * lp
    if fam == 'UNI': return np.exp(1j * k * theta_uni(p)) * lp
    if fam.startswith('EA:'):
        a = float(fam[3:]); return lp * 2 * np.cosh(a * k * lp)
    raise ValueError(fam)

class Acc:
    def __init__(self, n, L, nu0s):
        self.n = n; self.M = 16 * n; self.L = L; self.Lld = LD(L); self.nu0s = [LD(v) for v in nu0s]
        self.mom = {}
    def alloc(self, key):
        self.mom[key] = np.zeros((2, KT + 1, self.M))
    def deposit(self, keys_c, n_int):
        """keys_c: list of (key, nu0 index, coefficient array already divided by sqrt n); n_int: int64 array of the integers"""
        u = np.log(n_int.astype(LD))
        xf = (u / self.Lld).astype(np.float64)
        cell = np.minimum((xf * self.M).astype(np.int64), self.M - 1)
        d = xf - (cell + 0.5) / self.M
        phs = {}
        for key, j, c in keys_c:
            if j not in phs:
                ph = np.fmod(self.nu0s[j] * u, TWO_PI_LD).astype(np.float64)
                phs[j] = (np.cos(ph), np.sin(ph))
            co, si = phs[j]
            if np.iscomplexobj(c): wr = c.real * co - c.imag * si; wi = c.real * si + c.imag * co
            else: wr = c * co; wi = c * si
            mom = self.mom[key]
            for m in range(KT + 1):
                mom[0, m] += np.bincount(cell, weights=wr, minlength=self.M)
                mom[1, m] += np.bincount(cell, weights=wi, minlength=self.M)
                if m < KT: wr = wr * d; wi = wi * d
    def transform(self, mom):
        n = self.n; M = self.M; a = np.arange(n)
        E = np.zeros(n, dtype=np.complex128); Dd = np.zeros(n, dtype=np.complex128)
        fac = np.ones(n, dtype=np.complex128); cc = (np.arange(M) + 0.5) / M
        for m in range(KT + 1):
            z = mom[0, m] + 1j * mom[1, m]
            f0 = M * np.fft.ifft(z)[:n]
            E += fac * f0
            if m < KT:
                f1 = M * np.fft.ifft(cc * z)[:n]
                z2 = mom[0, m + 1] + 1j * mom[1, m + 1]
                f2 = M * np.fft.ifft(z2)[:n]
                Dd += fac * (f1 + f2)
            fac = fac * (2j * PI * a) / (m + 1)
        rot = np.exp(1j * PI * a / M)
        return E * rot, self.L * Dd * rot

def worker(args):
    (wid, lo, hi, X, n, nu0s, combos, seg, tmp) = args
    L = math.log(X); acc = Acc(n, L, nu0s)
    for key, fam, j in combos: acc.alloc(key)
    bp = small_primes(int(X ** 0.5) + 2)
    t0 = time.time(); cnt = 0
    a = lo
    while a < hi:
        b = min(hi, a + 2 * seg)
        p = seg_primes(a, b, bp); a = b
        if len(p) == 0: continue
        cnt += len(p)
        lp = np.log(p.astype(np.float64)); isq = 1.0 / np.sqrt(p.astype(np.float64))
        acc.deposit([(key, j, coeff(fam, p, 1, lp) * isq) for key, fam, j in combos], p)
    fn = os.path.join(tmp, 'mom_%d.npz' % wid)
    np.savez(fn, **{key: acc.mom[key] for key, fam, j in combos})
    return wid, cnt, time.time() - t0, fn

def prime_power_terms(X):
    """(n, p, k) for p^k <= X, k >= 2, and the prime 2 (k = 1)"""
    ps = small_primes(int(X ** 0.5) + 2)
    N = [2]; P = [2]; K = [1]
    for p in ps.tolist():
        v = p * p; k = 2
        while v <= X:
            N.append(v); P.append(p); K.append(k); v *= p; k += 1
    return np.array(N, dtype=np.int64), np.array(P, dtype=np.int64), np.array(K, dtype=np.int64)

def tnr_extra(X, q, cc):
    a = cc * math.sqrt(q); b = float(q)
    K = int(math.log(X) / math.log(q) + 1e-9)
    f = [0.0] * (K + 3); num = [0.0, a, 2 * b]
    for k in range(1, K + 1):
        v = num[k] if k < 3 else 0.0
        v -= a * f[k - 1]
        if k >= 2: v -= b * f[k - 2]
        f[k] = v
    return [(q ** k, math.log(q) * f[k]) for k in range(1, K + 1)]

def dh_coeffs(X, log=print):
    """c(n), n <= X, of -F'/F for the Davenport-Heilbronn function (coefficients 1, kappa, -kappa, -1, 0 mod 5)"""
    X = int(X); per = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])
    print('planned allocation: c %.2f GB + temporaries of the same size' % ((X + 1) * 8 / 1e9), flush=True)
    idx = np.arange(X + 1)
    c = per[idx % 5] * np.log(np.maximum(idx, 1).astype(np.float64))
    a = per[idx % 5]; del idx
    M0 = min(4096, X // 2 + 1)
    for m in range(2, M0):
        if c[m] != 0.0: c[2 * m::m] -= c[m] * a[2:X // m + 1]
    lo = M0
    while lo <= X:
        hi = min(2 * lo, X + 1)
        for d in range(2, X // lo + 1):
            if d % 5 == 0: continue
            mh = min(hi, X // d + 1)
            c[d * lo:d * (mh - 1) + 1:d] -= a[d] * c[lo:mh]
        lo = hi
    return c

def run(X, n, nu0s, fams, workers, outfn, seg=1 << 22, log=print):
    L = math.log(X); t0 = time.time()
    combos = []          # (key, family, nu0 index) computed over the primes
    for fam, js in fams:
        base = 'ZETA' if (fam == 'LIOU' or fam.startswith('TNR')) else fam
        for j in js:
            key = '%s|%d' % (base, j)
            if not any(c[0] == key for c in combos): combos.append((key, base, j))
    M = 16 * n
    per = len(combos) * 2 * (KT + 1) * M * 8 / 1e9
    log('X=%.3g L=%.4f n=%d M=%d combos=%d; planned allocation: %.2f GB of moments per worker, %d workers -> %.2f GB' % (X, L, n, M, len(combos), per, workers, per * workers))
    tmp = outfn + '.tmp'; os.makedirs(tmp, exist_ok=True)
    edges = np.linspace(3, X + 1, workers * 4 + 1).astype(np.int64); edges |= 1
    edges[-1] = int(X) + 1
    tasks = [(i, int(edges[i]), int(edges[i + 1]), X, n, nu0s, combos, seg, tmp) for i in range(workers * 4)]
    acc = Acc(n, L, nu0s); tot = {c[0]: None for c in combos}; nprimes = 0
    with Pool(workers) as pool:
        for wid, cnt, dt, fn in pool.imap_unordered(worker, tasks):
            z = np.load(fn)
            for key in tot:
                tot[key] = z[key] if tot[key] is None else tot[key] + z[key]
            os.remove(fn); nprimes += cnt
            log('  task %d: %d primes %.0fs (elapsed %.0fs)' % (wid, cnt, dt, time.time() - t0))
    os.rmdir(tmp)
    # prime powers and p = 2, per requested family
    N, P, K = prime_power_terms(X); lp = np.log(P.astype(np.float64)); isq = 1 / np.sqrt(N.astype(np.float64))
    res = {}
    nu = [float(v) + 2 * PI / L * np.arange(n) for v in nu0s]
    for fam, js in fams:
        base = 'ZETA' if (fam == 'LIOU' or fam.startswith('TNR')) else fam
        for j in js:
            a2 = Acc(n, L, nu0s); a2.alloc('pp')
            cf = coeff('ZETA' if fam.startswith('TNR') else fam, P, K, lp)
            a2.deposit([('pp', j, cf * isq)], N)
            sgn = -1.0 if fam == 'LIOU' else 1.0
            E, D = acc.transform(sgn * tot['%s|%d' % (base, j)] + a2.mom['pp'])
            if fam.startswith('TNR'):
                _, q, cc = fam.split(':')
                for (m, e) in tnr_extra(X, int(q), float(cc)):
                    um = np.log(LD(m)); ph = np.fmod((LD(nu0s[j]) + LD(2) * TWO_PI_LD / 2 / LD(L) * np.arange(n).astype(LD)) * um, TWO_PI_LD).astype(np.float64)
                    t = e / math.sqrt(m) * np.exp(1j * ph)
                    E += t; D += t * float(um)
            res['E|%s|%d' % (fam, j)] = E; res['D|%s|%d' % (fam, j)] = D
    np.savez(outfn, X=X, L=L, n=n, nu0s=np.array([float(v) for v in nu0s]), nprimes=nprimes, fams=json.dumps(fams), **res)
    log('done: %d odd primes, %.0fs' % (nprimes, time.time() - t0))

def dh_worker(args):
    (wid, lo, hi, X, n, nu0s, fn_c, tmp) = args
    c = np.load(fn_c, mmap_mode='r'); L = math.log(X); acc = Acc(n, L, nu0s)
    keys = ['DH|%d' % j for j in range(len(nu0s))]
    for k in keys: acc.alloc(k)
    step = 1 << 21
    for a in range(lo, hi, step):
        b = min(hi, a + step); nn = np.arange(a, b, dtype=np.int64); cc = np.asarray(c[a:b])
        m = cc != 0.0; nn = nn[m]; cc = cc[m] / np.sqrt(nn.astype(np.float64))
        acc.deposit([(k, j, cc) for j, k in enumerate(keys)], nn)
    fn = os.path.join(tmp, 'mom_%d.npz' % wid); np.savez(fn, **acc.mom)
    return wid, fn

def run_dh(Xs, H, nu0, workers, outdir, Xmax, log=print):
    """DH at several X <= Xmax with the same window [nu0, nu0 + H]"""
    fn_c = os.path.join(outdir, 'dh_c_%d.npy' % int(Xmax))
    if not os.path.exists(fn_c):
        t0 = time.time(); c = dh_coeffs(Xmax); np.save(fn_c, c); log('DH coefficients to %.3g: %.0fs' % (Xmax, time.time() - t0)); del c
    for X in Xs:
        L = math.log(X); n = int(H * L / (2 * PI)); n += n % 2
        outfn = os.path.join(outdir, 'ps_DH_X%.3g.npz' % X); tmp = outfn + '.tmp'; os.makedirs(tmp, exist_ok=True)
        log('DH X=%.3g n=%d; planned allocation %.2f GB per worker' % (X, n, 2 * (KT + 1) * 16 * n * 8 / 1e9))
        edges = np.linspace(2, X + 1, workers + 1).astype(np.int64)
        tot = None
        with Pool(workers) as pool:
            for wid, fn in pool.imap_unordered(dh_worker, [(i, int(edges[i]), int(edges[i + 1]), X, n, [nu0], fn_c, tmp) for i in range(workers)]):
                z = np.load(fn)['DH|0']; tot = z if tot is None else tot + z; os.remove(fn)
        os.rmdir(tmp)
        acc = Acc(n, L, [nu0]); E, D = acc.transform(tot)
        np.savez(outfn, X=X, L=L, n=n, nu0s=np.array([nu0]), fams=json.dumps([['DH', [0]]]), **{'E|DH|0': E, 'D|DH|0': D})
        log('  saved ' + outfn)

if __name__ == '__main__':
    mode = sys.argv[1]
    W = int(os.environ.get('RH_WORKERS', '2'))
    lg = lambda s: print(s, flush=True)
    if mode == 'run':      # psnu.py run OUT X n nu0,nu0,... FAM=j,j FAM=j ...
        out = sys.argv[2]; X = float(sys.argv[3]); n = int(sys.argv[4]); nu0s = [float(v) for v in sys.argv[5].split(',')]
        fams = [[f.split('=')[0], [int(v) for v in f.split('=')[1].split(',')]] for f in sys.argv[6:]]
        run(X, n, nu0s, fams, W, out, log=lg)
    elif mode == 'dh':     # psnu.py dh OUTDIR Xmax nu0 H X,X,...
        run_dh([float(v) for v in sys.argv[6].split(',')], float(sys.argv[5]), float(sys.argv[4]), W, sys.argv[2], float(sys.argv[3]), log=lg)
