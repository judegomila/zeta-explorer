"""Decisive test, part 2: the closed form P of Theorem A (family sum over the classes mod 72, all d) by exact enumeration,
against the density prediction
   P_pred(M, X) = (M / (A h_0)) K_1 sum_l sum_b kappa_b J(4 pi M q_l q_b^6 / (3 X^2)),
   J(y) = int int V(u) V(u') exp(-y/(u u')) du du'/(u u'),
and against the limit constant C_inf M^(5/6) X^(1/3).  Weights: liou (y = 1) and Hermitian-form controls.
usage: pred.py log2X ratio[,ratio..] out.json"""
import sys, json, time, math, numpy as np, lib7
from scipy.interpolate import CubicSpline
lg = float(sys.argv[1]); ratios = [float(x) for x in sys.argv[2].split(',')]; X = 2.0 ** lg
CUT = 40.0; A = math.sqrt(3) / 2; H0 = 432
t0 = time.time()
def nrm(u, v): return u * u - u * v + v * v
def divides(e, u, v):
    """mask: e | (u + v w).   c conj(e) = (u + v w)((a - b) - b w)"""
    a, b = e; n = a * a - a * b + b * b
    x, y = a - b, -b
    ru = u * x - v * y; rv = u * y + v * x - v * y
    return (ru % n == 0) & (rv % n == 0)
# ---- enumerate squarefree primary c prime to 6 with X/2 < q_c < 2X
R = int(2 * math.sqrt(2 * X)) + 6
us = np.arange(-R - ((-R) % 3) + 1, R + 1, 3, dtype=np.int64); us = us[us % 3 == 1]
vs = np.arange(-R - ((-R) % 3), R + 1, 3, dtype=np.int64)
U, Vv = np.meshgrid(us, vs, indexing='ij'); U = U.ravel(); Vv = Vv.ravel(); n = nrm(U, Vv)
ok = (n > X / 2) & (n < 2 * X) & (n % 2 == 1)
U, Vv, n = U[ok], Vv[ok], n[ok]
prs = lib7.primes_primary(int(math.sqrt(2 * X)) + 1)
sf = np.ones(len(U), dtype=bool)
for (pn, a, b) in prs:
    cand = np.nonzero(n % (pn * pn) == 0)[0]
    if len(cand):
        e2 = lib7.emul((a, b), (a, b))
        sf[cand[divides(e2, U[cand], Vv[cand])]] = False
U, Vv, n = U[sf], Vv[sf], n[sf]
q = n.astype(float); Vb = lib7.bump(q / X); nc = len(q)
key = (U % 72) * 72 + (Vv % 72)
print('X 2^%g  squarefree c %d  classes %d  %.0fs' % (lg, nc, len(set(key.tolist())), time.time() - t0), flush=True)
rng = np.random.default_rng(7)
WT = {'liou': np.ones(nc, complex), 'nm': np.where(rng.random(nc) < 0.75, 1.0, -1.0).astype(complex),
      'nmph': np.exp(1j * rng.uniform(-1.5, 1.5, nc)), 'iid': rng.choice([-1.0, 1.0], nc).astype(complex)}
# Moebius and a random completely multiplicative unimodular weight: factor each c into prime ideals through its norm
NN = int(2 * X) + 2
spf = np.zeros(NN, dtype=np.int64)
for i in range(2, NN):
    if spf[i] == 0: spf[i::i] = np.where(spf[i::i] == 0, i, spf[i::i])
rootc = {}; phase = {}
def root3(p):
    if p not in rootc:
        g = 2
        while pow(g, (p - 1) // 3, p) == 1: g += 1
        rootc[p] = pow(g, (p - 1) // 3, p)
    return rootc[p]
def ph(keyp):
    if keyp not in phase: phase[keyp] = np.exp(2j * np.pi * rng.random())
    return phase[keyp]
muv = np.ones(nc); rmv = np.ones(nc, complex)
for r in range(nc):
    m_ = int(n[r]); uu = int(U[r]); vv = int(Vv[r]); om = 0; z = 1.0 + 0j
    while m_ > 1:
        p = int(spf[m_]); e = 0
        while m_ % p == 0: m_ //= p; e += 1
        if p % 3 == 2:
            om += e // 2; z *= ph((p, 0))
        else:
            rr = root3(p)
            if (uu + vv * rr) % p == 0: om += 1; z *= ph((p, 1))
            if (uu + vv * (p - 1 - rr)) % p == 0: om += 1; z *= ph((p, 2))
    muv[r] = (-1) ** om; rmv[r] = z * muv[r]
WT['one'] = muv.astype(complex); WT['rmult'] = rmv
names = list(WT)
# ---- Euler products
def sieve(N):
    s = np.ones(N + 1, dtype=bool); s[:2] = False
    for i in range(2, int(N ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]
ps = sieve(3_000_000)
qn = np.concatenate([ps[ps % 3 == 1], ps[ps % 3 == 1], ps[(ps % 3 == 2) & (ps > 2)].astype(float) ** 2]).astype(float)
qn = qn[qn < 3e6]
rhoF = math.pi / (3 * math.sqrt(3))
K1 = rhoF ** 2 * (2 / 3) ** 2 * (3 / 4) ** 2 * float(np.prod((1 - 1 / qn) ** 2 * (1 + 2 / qn)))
kap = lambda qq: (1 + (qq - 1) / qq ** 2) / (1 + 2 / qq)
rho_b = rhoF * (2 / 3) * (3 / 4) * float(np.prod(1 - 1 / qn + kap(qn) / qn))
ES = 1 / ((1 - 3 ** (-1 / 6)) * (1 - 4 ** (-1 / 6)))
tt = np.linspace(-1, 1, 4001)[1:-1]; dt = tt[1] - tt[0]; vt = np.exp(1 - 1 / (1 - tt ** 2))
IV = math.log(2) * float(np.sum(vt * 2.0 ** (tt / 6))) * dt            # int V(u) u^(-5/6) du
conv = np.convolve(vt, vt) * dt; ss = np.linspace(2 * tt[0], 2 * tt[-1], len(conv))
def J(y): return math.log(2) ** 2 * float(np.sum(conv * np.exp(-y * 2.0 ** (-ss)))) * dt
Cinf = (1 / (A * H0)) * K1 * 6 * ES * rho_b * math.gamma(7 / 6) * (3 / (4 * math.pi)) ** (1 / 6) * IV ** 2
print('K_1 %.6f  rho_b %.6f  E_S %.4f  I_V %.6f  C_inf (family) %.6e' % (K1, rho_b, ES, IV, Cinf), flush=True)
res = dict(log2X=lg, nc=nc, K1=K1, rho_b=rho_b, Cinf=Cinf, runs=[])
order = np.argsort(key, kind='stable'); keys_sorted = key[order]
bounds = np.nonzero(np.diff(keys_sorted))[0] + 1
groups = np.split(order, bounds)
for ratio in ratios:
    M = X / ratio
    Hmax = CUT * 3 * (2 * X) ** 2 / (4 * math.pi * M); Bmax = Hmax ** (1 / 6)
    # small elements b-part a (primary, prime to 6) with their prime supports; small primes
    sp = [(pn, a, b) for (pn, a, b) in lib7.primes_primary(int(Bmax) + 1)]
    Rr = int(2 * math.sqrt(Bmax)) + 4; smalls = []
    for a in range(-Rr, Rr + 1):
        if a % 3 != 1: continue
        for b in range(-Rr - ((-Rr) % 3), Rr + 1, 3):
            nn = a * a - a * b + b * b
            if nn > Bmax or nn % 2 == 0: continue
            supp = 0
            for i, (pn, pa, pb) in enumerate(sp):
                if bool(divides((pa, pb), np.array([a]), np.array([b]))[0]): supp |= (1 << i)
            smalls.append((nn, supp))
    ql = sorted(3 ** i * 4 ** j for i in range(60) for j in range(60) if 3 ** i * 4 ** j <= Hmax)
    bits = np.zeros(nc, dtype=np.int64)
    for i, (pn, pa, pb) in enumerate(sp):
        bits |= (divides((pa, pb), U, Vv).astype(np.int64) << i)
    # G_mask(t) = 6 sum_l sum_{a: supp(a) & mask = 0} exp(-t q_l q_a^6) on a log grid
    tmin = 4 * math.pi * M / (3 * (2 * X) ** 2) * 0.99; tmax = 4 * math.pi * M / (3 * (X / 2) ** 2) * 1.01 * max(1.0, (Bmax ** 6))
    lt = np.linspace(math.log(tmin), math.log(tmax), 6000)
    Gs = {}
    def G(mask):
        if mask not in Gs:
            g = np.zeros_like(lt)
            for (na, supp) in smalls:
                if supp & mask: continue
                for l in ql:
                    if l * na ** 6 > Hmax * 4: break
                    g += np.exp(-np.exp(lt) * l * float(na) ** 6)
            Gs[mask] = CubicSpline(lt, 6 * g)
        return Gs[mask]
    P = {k: 0.0 for k in names}; npair = 0; nshare = 0; Pd1 = 0.0; percls = []
    for g in groups:
        if len(g) < 2: continue
        i, j = np.triu_indices(len(g), 1); gi, gj = g[i], g[j]
        npair += len(gi)
        share = np.gcd(n[gi], n[gj]) > 1
        # exact gcd in Z[w] for the flagged pairs (Euclid, vectorised)
        dn = np.ones(len(gi), dtype=np.int64); dbits = np.zeros(len(gi), dtype=np.int64)
        if share.any():
            s = np.nonzero(share)[0]
            au, av, bu, bv = U[gi[s]].copy(), Vv[gi[s]].copy(), U[gj[s]].copy(), Vv[gj[s]].copy()
            for _ in range(80):
                nb = nrm(bu, bv); act = nb > 0
                if not act.any(): break
                nbs = np.where(act, nb, 1)
                x, y = bu - bv, -bv                                   # conj(b)
                ru = au * x - av * y; rv = au * y + av * x - av * y    # a conj(b)
                k1 = np.floor(ru / nbs + 0.5).astype(np.int64); k2 = np.floor(rv / nbs + 0.5).astype(np.int64)
                tu = au - (k1 * bu - k2 * bv); tv = av - (k1 * bv + k2 * bu - k2 * bv)
                au, av, bu, bv = np.where(act, bu, au), np.where(act, bv, av), np.where(act, tu, 0), np.where(act, tv, 0)
            gn = nrm(au, av); dn[s] = gn
            for ii, (pn, pa, pb) in enumerate(sp):
                dbits[s] |= (divides((pa, pb), au, av).astype(np.int64) << ii)
            # d must be a product of small primes for a non-zero term: check norm equals product of flagged small primes
            prod = np.ones(len(s), dtype=np.int64)
            for ii, (pn, pa, pb) in enumerate(sp): prod *= np.where((dbits[s] >> ii) & 1, pn, 1)
            dn[s] = np.where(prod == gn, gn, -1)                        # -1: d has a prime with q_p^5 > Hmax, term is 0
        nshare += int(np.sum(dn != 1))
        live = dn > 0
        gi, gj, dn, dbits = gi[live], gj[live], dn[live], dbits[live]
        mask = (bits[gi] | bits[gj]) & ~dbits
        phid = np.ones(len(gi))
        for ii, (pn, pa, pb) in enumerate(sp): phid *= np.where((dbits >> ii) & 1, pn - 1.0, 1.0)
        t = 4 * math.pi * M * dn.astype(float) ** 6 / (3 * q[gi] * q[gj])
        val = np.zeros(len(gi))
        okt = t <= math.exp(lt[-1])
        for mk in np.unique(mask):
            w = np.nonzero((mask == mk) & okt)[0]
            if len(w): val[w] = G(int(mk))(np.log(t[w]))
        base = (M / A) * phid * Vb[gi] * Vb[gj] / (q[gi] * q[gj]) * val
        Pd1 += 2 * float(np.sum(base[dn == 1])); percls.append(2 * float(np.sum(base)))
        for k in names:
            P[k] += 2 * float(np.sum(base * (WT[k][gi] * np.conj(WT[k][gj])).real))
    # diagonal c = c' (d = c): h = l c^5 a^6, zero unless q_c^5 <= Hmax
    # prediction
    pred = 0.0
    for (na, supp) in smalls:
        kb = 1.0
        for i, (pn, pa, pb) in enumerate(sp):
            if (supp >> i) & 1: kb *= kap(float(pn))
        for l in ql:
            y = 4 * math.pi * M * l * float(na) ** 6 / (3 * X * X)
            if y > 4 * CUT * 4: break
            pred += 6 * kb * J(y)
    pred *= (M / (A * H0)) * K1
    lim = Cinf * M ** (5 / 6) * X ** (1 / 3)
    mean = {k: complex(np.sum(WT[k] * Vb / q) / np.sum(Vb / q)) for k in names}
    pc = np.array(percls) / (pred / H0)
    print('    per class (Liouville): P^sigma / (P_pred / 432): min %.4f  max %.4f  mean %.4f  over %d classes' % (pc.min(), pc.max(), pc.mean(), len(pc)), flush=True)
    rec = dict(M=M, percls_min=float(pc.min()), percls_max=float(pc.max()), pairs=npair, shared=nshare, P=P, P_d1=Pd1, pred=pred, lim=lim, mean2={k: abs(mean[k]) ** 2 for k in names})
    res['runs'].append(rec)
    print('M = X/%g: same-class pairs %d (with d != 1: %d)  P_liou %.4f (d = 1 part %.4f)  P_pred %.4f  ratio %.4f   limit form %.4f  P/limit %.4f   %.0fs' % (
        ratio, npair, nshare, P['liou'], Pd1, pred, P['liou'] / pred, lim, P['liou'] / lim, time.time() - t0), flush=True)
    for k in names[1:]:
        print('    %-5s P_w %.4f  P_w/P_liou %.5f  |mean|^2 %.5f' % (k, P[k], P[k] / P['liou'], abs(mean[k]) ** 2), flush=True)
json.dump(res, open(sys.argv[3], 'w'), indent=1)
