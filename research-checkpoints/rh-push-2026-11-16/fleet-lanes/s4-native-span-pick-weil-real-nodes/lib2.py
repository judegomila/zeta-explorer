"""s4-native-span-pick-weil-real-nodes: shared code. Extends lib.py (copied from s3-lacunary-pick-ghost-index).
Objects are completed functions F(w) = completed(1/2 + w); c(w) = F'/F(w) is the datum of every test here.
New objects (controls that exist only through the prime side; zeta's gamma factor and pole term are kept):
  SGNLIOU        xi(s) zeta(2s)/zeta(s)^2          : Lambda(n) -> lambda(n) Lambda(n) (eps(p) = -1 at every prime)
  SGNP:2,3,..    xi(s) prod_p (1-p^-s)/(1+p^-s)     : eps(p) = -1 on the listed primes
  SGNR:seed:X    same with a random subset of the primes <= X (python random.Random(seed), probability 1/2)
  WTRE:alpha     xi(s) sqrt(zeta(s+i alpha) zeta(s-i alpha))/zeta(s) : Lambda(n) -> cos(alpha log n) Lambda(n)
  HT:tau         backward heat, from the Taylor expansion at w = 1: F_tau^(j)(1) = sum_k (-|tau|/4)^k F^(j+2k)(1)/k!
Node families, Schur recursion with probes, one-point jets (Schur parameters), ladder."""
import math, random, os, pickle, time
from flint import acb, arb, ctx, acb_series, fmpz, arb_poly, acb_poly
import lib
from lib import Zeta, _pc

ALPHA_WT = '1.2393168126993495'


def primes_upto(X):
    s = bytearray([1]) * (X + 1); s[0:2] = b'\0\0'
    for i in range(2, int(X ** 0.5) + 1):
        if s[i]: s[i * i::i] = bytearray(len(s[i * i::i]))
    return [i for i in range(2, X + 1) if s[i]]


class SgnLiou:
    code = 'SGNLIOU'
    def completed(self, s):
        z = s.zeta()
        return Zeta().completed(s) * (2 * s).zeta() / (z * z)


class SgnP:
    def __init__(self, code, ps):
        self.code = code; self.ps = ps
    def completed(self, s):
        v = Zeta().completed(s)
        for p in self.ps:
            q = _pc(p, -s)
            v = v * (1 - q) / (1 + q)
        return v


class WTre:
    def __init__(self, alpha):
        self.code = 'WTRE:' + alpha; self.al = alpha
    def completed(self, s):
        ia = acb(0, arb(self.al))
        return Zeta().completed(s) * ((s + ia).zeta() * (s - ia).zeta()).sqrt() / s.zeta()


class HeatT:
    """Taylor data of F_tau at w = 1. coefficients g_j = F_tau^(j)(1)/j!, j < D, from the zeta series of length D + 2K.
    Truncation of the k-sum and of the Taylor polynomial is measured (last-term sizes are stored), not enclosed."""
    _cache = {}
    def __init__(self, tau, D=None, K=None):
        self.tau = float(tau); self.code = 'HT:%s' % tau; self.D = D; self.K = K; self.g = None
    def build(self):
        bits = ctx.prec
        D = self.D or int(os.environ.get('HT_D', max(160, int(bits / 5.5))))
        K = self.K or int(os.environ.get('HT_K', max(120, int(bits / 8))))
        key = (self.tau, bits, D, K)
        if key in HeatT._cache: self.g, self.info = HeatT._cache[key]; return
        fn = 'cache/HT_%s_%d_%d_%d.pkl' % (self.tau, bits, D, K)
        if os.path.exists(fn):
            g, info = pickle.load(open(fn, 'rb')); self.g = [unpack(t) for t in g]; self.info = info
            HeatT._cache[key] = (self.g, info); return
        t0 = time.time(); M = D + 2 * K + 1
        ctx.cap = max(ctx.cap, M + 2); ctx.prec = bits + 9 * M
        x = acb_series([acb(arb(3) / 2), 1], prec=M)
        f = [c.real for c in Zeta().completed(x).coeffs()]
        f += [arb(0)] * (M - len(f))
        c = -arb(abs(self.tau)) / 4
        # derivatives: F^(n) = f_n n!
        fac = [arb(1)]
        for n in range(1, M + 1): fac.append(fac[-1] * n)
        g = []; last = -1e9
        for j in range(D):
            tot = arb(0); ck = arb(1)
            for k in range(K + 1):
                term = ck * f[j + 2 * k] * fac[j + 2 * k] / fac[k]
                tot += term; ck *= c
            g.append(tot / fac[j])
            if j in (0, D - 1):
                last = max(last, lib._log2(term / tot) or -1e9)
        info = dict(D=D, K=K, bits=bits, sec=round(time.time() - t0, 1), log2_last_k_term_rel=last,
                    log2_gD_rel_r1p5=((lib._log2(g[-1] / g[0]) or -1e9) + (D - 1) * math.log2(1.5)))
        ctx.prec = bits
        g = [t * 1 for t in g]
        self.g = g; self.info = info; HeatT._cache[key] = (g, info)
        try:
            os.makedirs('cache', exist_ok=True); pickle.dump(([pack(t) for t in g], info), open(fn, 'wb'))
        except Exception: pass
    def completed(self, s):
        """s = 1/2 + w; polynomial in (w - 1) = s - 3/2. Accepts acb or acb_series."""
        if self.g is None: self.build()
        if isinstance(s, acb_series):
            n = s.prec if hasattr(s, 'prec') else len(s.coeffs())
            c0 = s.coeffs()[0] - arb(3) / 2
            P = acb_poly(self.g)(acb_poly([c0, 1]))            # Taylor shift
            h = acb_series([0] + list(s.coeffs()[1:]), prec=n)
            cs = P.coeffs()[:n]
            return acb_series(cs, prec=n)(h)
        t = acb(s) - arb(3) / 2
        v = acb(0)
        for gj in reversed(self.g): v = v * t + gj
        return v


def get(code):
    if code == 'SGNLIOU': return SgnLiou()
    if code.startswith('SGNP:'): return SgnP(code, [int(p) for p in code[5:].split(',')])
    if code.startswith('SGNR:'):
        _, seed, X = code.split(':'); r = random.Random(int(seed))
        return SgnP(code, [p for p in primes_upto(int(X)) if r.random() < 0.5])
    if code.startswith('WTRE'):
        return WTre(code.split(':')[1] if ':' in code else ALPHA_WT)
    if code.startswith('HT:'): return HeatT(code[3:])
    if code.startswith('PL:'):
        _, b, d, g = code.split(':', 3) if code.count(':') == 3 else (None,) + tuple(code[3:].rsplit(':', 2))
        return lib.Planted(get(b), d, g)
    return lib.get(code)


def logder(obj, w):
    if isinstance(obj, lib.Heat): return lib.logder(obj, w)
    x = acb_series([acb(arb(1) / 2) + acb(w), 1], prec=2)
    y = obj.completed(x)
    return y[1] / y[0]


def parts(nu):
    """zeta: (arch, pole, prime) with c = arch + pole + prime, prime = zeta'/zeta(s) = -Z, s = 1/2 + nu (real)."""
    s = arb(1) / 2 + nu
    arch = (s / 2).digamma() / 2 - arb.pi().log() / 2
    pole = 1 / s + 1 / (s - 1)
    x = acb_series([acb(s), 1], prec=2); z = x.zeta()
    return arch, pole, (z[1] / z[0]).real


def dirichlet_Z(code, nu):
    """Z = -L'/L(s) of the Dirichlet series of the object at s = 1/2 + nu > 1 (real part for WTRE). None if no series."""
    s = arb(1) / 2 + nu
    x = acb_series([acb(s), 1], prec=2)
    def ld(y): return (y[1] / y[0]).real
    if code == 'ZETA': return -ld(x.zeta())
    if code in ('DH', 'LCHI4', 'LCHI5'): return -ld(lib.get(code).value(x))
    if code.startswith('EA-'):
        o = lib.get(code); a = arb(o.num) / o.den
        return -ld((x + a).zeta()) - ld((x - a).zeta())
    if code == 'TNR':
        o = lib.TNR(); c = arb(o.cs)
        D = 1 + c * _pc(o.q, arb(1) / 2 - x) + _pc(o.q, 1 - 2 * x)
        return -ld(x.zeta()) - ld(D)
    if code.startswith('SGN') or code.startswith('WTRE'):
        o = get(code)
        return -ld(o.completed(x)) + ld(Zeta().completed(x)) - ld(x.zeta())
    return None


# ---------------- nodes ----------------
def vdc(k):
    """van der Corput base 2, exact rational (num, den)"""
    num = 0; den = 1
    while k:
        num = num * 2 + (k & 1); den *= 2; k >>= 1
    return num, den


def node(family, k):
    parts_ = family.split(':'); kind = parts_[0]
    if kind == 'geo':   return (arb(2).log() * k / int(parts_[1])).exp()
    if kind == 'four':  return arb(4) ** k
    if kind == 'acc':   return arb(1) / 2 + arb('0.99') * (-arb(2).log() * k / int(parts_[1])).exp()
    if kind in ('chebv', 'vdc'):
        lo = arb(parts_[1]); hi = arb(parts_[2]); a, b = vdc(k + 1); u = arb(a) / b
        if kind == 'chebv': u = (1 - (arb.pi() * u).cos()) / 2
        return lo + (hi - lo) * u
    if kind == 'lad':   # ladder nodes: 1, then (2 - sqrt(2)/1000) * vdc(k+1), dense in (0, 1.99859); avoids s = 1 exactly
        if k == 0: return arb(1)
        a, b = vdc(k + 1); return (arb(2) - arb(2).sqrt() / 1000) * a / b
    raise KeyError(family)


def pack(x):
    m, e = x.mid().man_exp(); rm, re_ = x.rad().man_exp()
    return (int(m), int(e), int(rm), int(re_))
def unpack(t):
    m = arb(fmpz(t[0])) * (arb(2) ** fmpz(t[1])) if t[0] else arb(0)
    if t[2] == 0: return m
    r = arb(fmpz(t[2])) * (arb(2) ** fmpz(t[3]))
    return m + arb(0, r.upper()) if False else m + arb(0, 1) * r


def _work(args):
    code, family, k, bits, mode = args[:5]
    shared = args[5] if len(args) > 5 else None
    if shared:                                   # per-node files: several units can cooperate on one value set
        f = '%s/%d.pkl' % (shared, k); lock = '%s/%d.lock' % (shared, k)
        if os.path.exists(f): return k, pickle.load(open(f, 'rb'))
        try:
            os.close(os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY))
        except FileExistsError:
            if time.time() - os.path.getmtime(lock) < 2400: return k, None      # another process is computing this node
    ctx.prec = bits + 64
    nu = node(family, k)
    if mode == 'c':
        o = get(code); val = pack(logder(o, nu).real)
    elif mode == 'Z':
        val = pack(dirichlet_Z(code, nu))
    elif mode == 'parts':
        val = tuple(pack(v) for v in parts(nu))
    if shared:
        pickle.dump(val, open(f + '.tmp%d' % os.getpid(), 'wb')); os.replace(f + '.tmp%d' % os.getpid(), f)
    return k, val


def values(code, family, n, bits, pool, mode='c'):
    os.makedirs('cache', exist_ok=True)
    key = '%s_%s_%s_%d_%d' % (mode, code.replace('/', '_').replace(':', '_'), family.replace(':', '_').replace('/', '_'), n, bits)
    fn = 'cache/%s.pkl' % key
    if os.path.exists(fn): return pickle.load(open(fn, 'rb'))
    t = time.time()
    if code.startswith('HT:'):                       # build the Taylor data once in the parent, then evaluate serially
        ctx.prec = bits + 64; o = get(code); o.build(); print('  HeatT', o.info, flush=True)
        out = [pack(logder(o, node(family, k)).real) for k in range(n)]
    else:
        shared = None
        if os.environ.get('RH_SHARED') or n * bits >= 4e7:
            shared = 'cache/nodes_' + key; os.makedirs(shared, exist_ok=True)
        order = list(range(n))
        if os.environ.get('RH_REVERSE'): order.reverse()
        jobs = [(code, family, k, bits, mode, shared) for k in order]
        res = dict(pool.imap_unordered(_work, jobs, chunksize=1 if shared else 2) if pool else map(_work, jobs))
        while shared and any(v is None for v in res.values()):      # nodes claimed by another unit: wait for their files
            time.sleep(20)
            for k in [k for k, v in res.items() if v is None]:
                kk, v = _work((code, family, k, bits, mode, shared)); res[k] = v
        out = [res[k] for k in range(n)]
    pickle.dump(out, open(fn, 'wb'))
    print('  values', mode, code, family, n, bits, 'sec %.1f' % (time.time() - t), flush=True)
    return out


# ---------------- Schur recursion with probes ----------------
def schur_probe(nu, c, nb, stop_at_negative=True):
    """Loewner-Pick matrix (c_i + c_j)/(nu_i + nu_j). Pivots on the first nb nodes; the remaining nodes are probes x:
    after N pivots the probe datum is Delta_N(x) = d(x) - v^T P_N^{-1} v (next-node Schur defect).
    Returns (pivots [(k, sign, log2 |d_k/P_kk|)], probes [(N, index of first probe with Delta_N < 0, log2 normalised)], undecided flag)."""
    n = len(nu); x = list(c); y = [arb(1)] * n
    piv = []; neg_probe = []; und_probe = 0
    for k in range(nb + 1):
        # probe defects after k pivots
        for i in range(nb, n):
            d = x[i] * y[i] / nu[i]; r = d / abs(c[i] / nu[i])
            if r < 0: neg_probe.append((k, i - nb, lib._log2(r)))
            elif not (r > 0): und_probe += 1
        if k == nb: break
        xk = x[k]; yk = y[k]; nk = nu[k]
        d = xk * yk / nk; r = d / abs(c[k] / nk)
        sg = 1 if r > 0 else (-1 if r < 0 else 0)
        piv.append((k, sg, lib._log2(r), None))
        if sg == 0 or (sg < 0 and stop_at_negative): break
        dinv = 1 / d
        for i in range(k + 1, n):
            l = (x[i] * yk + y[i] * xk) / (nu[i] + nk) * dinv
            x[i] = x[i] - l * xk; y[i] = y[i] - l * yk
    return piv, neg_probe, und_probe


# ---------------- one-point jets = Schur parameters ----------------
def schur_params(A, B):
    """Kernel K = (A(z) conj A(w) - B(z) conj B(w))/(1 - z conj w), real series as arb lists (length d).
    Returns [(k, sign of pivot_k, log2 |pivot_k|, gamma_k float)]; pivot_k = k-th LDL pivot of the jet (Taylor) matrix."""
    d = len(A); A = list(A); B = list(B); out = []; scale = arb(1)
    for k in range(d):
        a0 = A[0]; b0 = B[0]
        piv = scale * (a0 * a0 - b0 * b0)
        sg = 1 if piv > 0 else (-1 if piv < 0 else 0)
        out.append((k, sg, lib._log2(piv), float((b0 / a0).mid()) if not a0.contains(0) else None))
        if sg == 0: break
        g = b0 / a0
        m = len(A)
        A2 = [A[i] - g * B[i] for i in range(m - 1)]
        B2 = [B[i + 1] - g * A[i + 1] for i in range(m - 1)]
        scale = scale / (1 - g * g)
        A, B = A2, B2
    return out


def jet_series(obj, zstar, a, d):
    """Taylor coefficients (length d) in the disc variable zeta of N(zeta) = F(w - a), Dn(zeta) = F(w + a),
    w = zstar (1 + zeta)/(1 - zeta); real zstar, real a. S = N/Dn is the Schur function of the kernel K_a."""
    zs = arb(zstar); a = arb(a); ctx.cap = max(ctx.cap, d + 2)
    def ser(shift):
        cs = [acb(arb(1) / 2 + zs + shift)] + [acb(2 * zs)] * (d - 1)
        y = obj.completed(acb_series(cs, prec=d))
        co = [t.real for t in y.coeffs()]
        return co + [arb(0)] * (d - len(co))
    return ser(-a), ser(a)


# ---------------- ladder (PR 47) ----------------
def ladder(a, L, stop=True):
    """L_j(z) = (z L_{j-1}(z) - a_j p_j)/(z p_j - a_j L_{j-1}(z)), p_j = L_{j-1}(a_j). a, L = lists of arb (nodes, L_0 values).
    Returns [(j, sign p_j, log2 |p_j|, float p_j)]."""
    n = len(a); v = list(L); out = []
    for j in range(n):
        p = v[j]; sg = 1 if p > 0 else (-1 if p < 0 else 0)
        out.append((j, sg, lib._log2(p), float(p.mid())))
        if sg == 0 or (sg < 0 and stop): break
        aj = a[j]
        for i in range(j + 1, n):
            v[i] = (a[i] * v[i] - aj * p) / (a[i] * p - aj * v[i])
    return out
