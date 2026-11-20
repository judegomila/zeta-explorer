#!/usr/bin/env python3
"""Analysis of sieve output. usage: analyze.py out.txt cp.txt.lists.json result.json [extras a alpha]
All statistics are computed from dev(x) = F(x) - main(x) (mpmath, 45 digits, then float64)."""
import sys, json, math, bisect
from fractions import Fraction
import numpy as np, mpmath as mp
mp.mp.dps = 45
out, lists_f, res_f = sys.argv[1:4]
EXTRAS = len(sys.argv) > 4; EA_a = float(sys.argv[5]) if EXTRAS else 0.1; U_al = float(sys.argv[6]) if EXTRAS else 1.0
lists = json.load(open(lists_f))
xs = []; cols = []
for l in open(out):
    t = l.split(); xs.append(int(t[0])); cols.append(t[1:])
xs_arr = np.array(xs, dtype=np.float64); idx = {x: i for i, x in enumerate(xs)}; n = len(xs); XMAX = xs[-1]
print('rows', n, 'XMAX', XMAX, 'pi(XMAX)', cols[-1][0], flush=True)
KNOWN_PI = {10**7: 664579, 10**8: 5761455, 10**9: 50847534, 10**10: 455052511, 10**11: 4118054813, 10**12: 37607912018, 10**13: 346065536839}
checks = {}
for X, v in KNOWN_PI.items():
    if X in idx: checks['pi(%g)' % X] = [int(cols[idx[X]][0]), v, int(cols[idx[X]][0]) == v]
print('prime count checks', checks, flush=True)
# ---------- sequences: (pair-coefficients, main(x) as mp function or None)
SEQ = {
 'zeta': ({0: 1}, lambda x: x * x / 2),
 'chi4': ({1: 1}, None), 'chi3': ({2: 1}, None),
 'chi5real': ({3: 1, 4: -1, 5: -1, 6: 1}, None),
 'chi5q_re': ({3: 1, 6: -1}, None), 'chi5q_im': ({4: 1, 5: -1}, None),
 'eps': ({7: 1}, None),
 'thin': ({0: 1, 8: -2}, lambda x: x * x / 2),
 'del': ({0: 1, 8: -1}, lambda x: x * x / 2),
}
if EXTRAS:
    a = mp.mpf(EA_a); al = mp.mpf(U_al)
    SEQ['EA'] = ({9: 1, 10: 1}, lambda x: x ** (2 + a) / ((1 + a) * (2 + a)) + x ** (2 - a) / ((1 - a) * (2 - a)))
    mU = lambda x: x ** (2 - 1j * al) / ((1 - 1j * al) * (2 - 1j * al))
    SEQ['U_re'] = ({11: 1}, lambda x: mU(x).real)
    SEQ['U_im'] = ({12: -1}, lambda x: mU(x).imag)
dev = {k: np.zeros(n) for k in SEQ}; dth = {k: np.zeros(n) for k in SEQ}
theta_mp = []; R_mp = []
for i in range(n):
    c = cols[i]; x = mp.mpf(xs[i])
    v = [mp.mpf(s) for s in c[1:]]
    theta_mp.append(v[0]); R_mp.append(v[26])
    for k, (co, main) in SEQ.items():
        th = mp.fsum(w * v[2 * j] for j, w in co.items()); th1 = mp.fsum(w * v[2 * j + 1] for j, w in co.items())
        F = x * th - th1
        if main is None:
            dev[k][i] = float(F); dth[k][i] = float(th)
        else:
            dev[k][i] = float(F - main(x))
            dth[k][i] = float(th - x) if k in ('zeta', 'thin', 'del') else float(th)
del cols
chk = {}
if 10**10 in idx: chk['theta(1e10)'] = [mp.nstr(theta_mp[idx[10**10]], 20), '9999939830.657757 (literature)']
print(chk, flush=True)
# ---------- prime powers (k>=2) for psi-type sums
PL = 2 * int(math.isqrt(XMAX)) + 10  # covers the second-level threshold sqrt(2x) of the colossally abundant numbers
sv = np.ones(PL + 1, dtype=bool); sv[:2] = False
for i in range(2, int(PL ** 0.5) + 1):
    if sv[i]: sv[i * i::i] = False
sp = np.nonzero(sv)[0].astype(np.int64)
def smix(x):
    x = x.astype(np.uint64) + np.uint64(0x9E3779B97F4A7C15)
    x = (x ^ (x >> np.uint64(30))) * np.uint64(0xBF58476D1CE4E5B9)
    x = (x ^ (x >> np.uint64(27))) * np.uint64(0x94D049BB133111EB)
    return x ^ (x >> np.uint64(31))
with np.errstate(over='ignore'):
    h = smix(sp)
eps_p = np.where((h >> np.uint64(63)) == 1, -1.0, 1.0)
key = np.where(sp < (1 << 20), sp, sp | 0xFFFFF).astype(np.float64)
inS = ((h & np.uint64((1 << 53) - 1)).astype(np.float64) / 2.0 ** 53) < 0.5 * key ** (-0.1)
pp_n = []; pp_p = []; pp_k = []; pp_i = []
for k in range(2, 64):
    lim = int(round(XMAX ** (1.0 / k))) + 2
    m = sp <= lim
    if not m.any(): break
    for j in np.nonzero(m)[0]:
        p = int(sp[j]); q = p ** k
        if q <= XMAX: pp_n.append(q); pp_p.append(p); pp_k.append(k); pp_i.append(j)
o = np.argsort(np.array(pp_n, dtype=np.float64), kind='stable')
pp_n = np.array(pp_n, dtype=object)[o]; pp_nf = pp_n.astype(np.float64); pp_p = np.array(pp_p)[o]; pp_k = np.array(pp_k)[o]; pp_i = np.array(pp_i)[o]
lp = np.log(pp_p.astype(np.float64))
def chi4(p): return np.where(p % 2 == 0, 0.0, np.where(p % 4 == 1, 1.0, -1.0))
def chi3(p): return np.where(p % 3 == 0, 0.0, np.where(p % 3 == 1, 1.0, -1.0))
def chi5r(p): return np.array([0, 1, -1, -1, 1.0])[p % 5]
chi5q = np.array([0, 1, 1j, -1j, -1])
PPC = {
 'zeta': np.ones(len(pp_p)), 'chi4': chi4(pp_p) ** pp_k, 'chi3': chi3(pp_p) ** pp_k, 'chi5real': chi5r(pp_p) ** pp_k,
 'chi5q_re': (chi5q[pp_p % 5] ** pp_k).real, 'chi5q_im': (chi5q[pp_p % 5] ** pp_k).imag,
 'eps': eps_p[pp_i] ** pp_k, 'thin': np.where(inS[pp_i], (-1.0) ** pp_k, 1.0), 'del': np.where(inS[pp_i], 0.0, 1.0),
}
if EXTRAS:
    PPC['EA'] = np.exp(EA_a * pp_k * lp) + np.exp(-EA_a * pp_k * lp)
    PPC['U_re'] = np.cos(U_al * pp_k * lp); PPC['U_im'] = -np.sin(U_al * pp_k * lp)
def corr_arrays(nf, w):  # w = coefficient * log p at n ; returns arrays over checkpoints: sum w (x-n), sum w
    c0 = np.concatenate([[0.0], np.cumsum(w)]); c1 = np.concatenate([[0.0], np.cumsum(w * nf)])
    j = np.searchsorted(nf, xs_arr, side='right')
    return xs_arr * c0[j] - c1[j], c0[j]
devp = {}; dthp = {}
for k in SEQ:
    cdev, cth = corr_arrays(pp_nf, PPC[k] * lp)
    devp[k] = dev[k] + cdev; dthp[k] = dth[k] + cth
# T-NR: xi(s)(2cosh((s-1/2)log q)+c): Lambda_NR(q^k) = Lambda(q^k) - log q * (alpha^k + beta^k), alpha=-q^(1/2+b), beta=-q^(1/2-b)
def tnr(q, c):
    b = math.acosh(c / 2) / math.log(q)
    ns = []; ws = []; k = 1
    while q ** k <= XMAX:
        ns.append(float(q ** k)); ws.append(-math.log(q) * (-1) ** k * (q ** (k * (0.5 + b)) + q ** (k * (0.5 - b)))); k += 1
    cdev, cth = corr_arrays(np.array(ns), np.array(ws))
    return devp['zeta'] + cdev, dthp['zeta'] + cth, b
TNR = {'TNR_q3_c2.2': (3, 2.2), 'TNR_q3_c2.02': (3, 2.02), 'TNR_q1000003_c2.2': (1000003, 2.2)}
tnr_b = {}
for name, (q, c) in TNR.items():
    devp[name], dthp[name], tnr_b[name] = tnr(q, c)
ALL = {}  # name -> (dev array, dth array, has_main)
for k in SEQ:
    ALL[k + ':theta'] = (dev[k], dth[k]); ALL[k + ':psi'] = (devp[k], dthp[k])
for name in TNR:
    ALL[name + ':psi'] = (devp[name], dthp[name])
    # theta-type variant: primes only for p != q, full T-NR coefficients on powers of q (keeps the prime-square bias of the stated inequalities)
    ALL[name + ':theta'] = (dev['zeta'] + (devp[name] - devp['zeta']), dth['zeta'] + (dthp[name] - dthp['zeta']))
# ---------- deviation at real y (floor(y) must be a checkpoint)
def devat(name, y, quad=True):
    d, t = ALL[name]
    if isinstance(y, int): return d[idx[y]]
    x = y.__floor__(); i = idx[x]; fr = float(y - x)
    base = name.split(':')[0]
    zeta_like = base in ('zeta', 'thin', 'del') or base.startswith('TNR')
    # dev(y) = dev(x) + (y-x)*(theta(x) - main'(x)) - main-curvature ; exact for main x^2/2, used only for zeta-like sequences and main-free ones
    return d[i] + fr * t[i] - (fr * fr / 2 if zeta_like else 0.0)
K0 = 2 + 0.5772156649015329 - math.log(4 * math.pi)
def _rat(v):
    return int(v) if v.denominator == 1 else v
def tent_stats(label, nlist, knots, scale, names):
    """knots(N) -> (y, A, B) as exact rationals: tent on (y, A y, B y]; integer scaling 'scale' multiplies (alpha,beta,gamma)=(A-1,B-1,B-A).
    statistic m(N) = -(tent - main)/N^{3/2}"""
    res = {}
    y0, A, B = knots(1)
    al, be, ga = [float(scale * v) for v in (A - 1, B - 1, B - A)]
    y0f = float(y0); Af = float(A); Bf = float(B)
    pos = (al * Bf ** 1.5 + ga) * y0f ** 1.5; neg = be * Af ** 1.5 * y0f ** 1.5
    bias = (2 / 3) * (pos - neg); floor_rh = bias - K0 * (pos + neg)
    res['_def'] = dict(alpha=al, beta=be, gamma=ga, bias_coeff=bias, rh_floor_abs_amplitude=floor_rh, support_ratio=Bf)
    for name in names:
        ms = []
        nlist = [N for N in nlist if all(_rat(F_(f) * knots(N)[0]).__floor__() in idx for f in (1, A, B))]
        for N in nlist:
            y, A_, B_ = knots(N)
            v = al * devat(name, _rat(B_ * y)) - be * devat(name, _rat(A_ * y)) + ga * devat(name, _rat(F_(y)))
            ms.append(-v / N ** 1.5)
        ms = np.array(ms); Ns = np.array(nlist, dtype=np.float64)
        dec = []
        for d in range(0, 14):
            m_ = (Ns >= 10 ** d) & (Ns < 10 ** (d + 1))
            if m_.any():
                q = np.quantile(ms[m_], [0.05, 0.5, 0.95])
                dec.append(dict(decade=d, count=int(m_.sum()), min=float(ms[m_].min()), q05=float(q[0]), median=float(q[1]), q95=float(q[2]), max=float(ms[m_].max()), mean=float(ms[m_].mean()), n_negative=int((ms[m_] < 0).sum())))
        neg_i = np.nonzero(ms < 0)[0]
        big = Ns >= 1000
        res[name] = dict(first_negative_N=(int(nlist[neg_i[0]]) if len(neg_i) else None), last_negative_N=(int(nlist[neg_i[-1]]) if len(neg_i) else None),
                         n_negative=int(len(neg_i)), n=len(nlist), min_m_N_ge_1000=float(ms[big].min()) if big.any() else None, max_m_N_ge_1000=float(ms[big].max()) if big.any() else None,
                         last=[float(Ns[-1]), float(ms[-1])], decades=dec)
        if label == 'T88':
            res[name]['dyadic'] = [[int(N), float(m)] for N, m in zip(nlist, ms) if N & (N - 1) == 0]
    return res
names_all = sorted(ALL.keys())
F_ = Fraction
RES = {'meta': dict(XMAX=XMAX, rows=n, checks=checks, theta_check=chk, K0=K0, tnr_b=tnr_b, extras=EXTRAS, EA_a=EA_a, U_alpha=U_al)}
RES['T88'] = tent_stats('T88', lists['T88'], lambda N: (N, F_(2), F_(4)), 1, names_all)
RES['T91'] = tent_stats('T91', lists['T91'], lambda N: (81 * N, F_(17, 9), F_(289, 81)), F_(81, 8), names_all)  # (alpha,beta,gamma)=(9,26,17)
c = F_(124, 123)
for m in (61, 62):
    RES['T92_m%d' % m] = tent_stats('T92', lists['T92'], lambda N, m=m: (N, c ** m, c ** 153), 1, [nm for nm in names_all if not nm.startswith(('EA', 'U_'))])
RES['T93'] = tent_stats('T93', lists['T93'], lambda N: (225 * N, F_(23, 15), F_(529, 225)), F_(225, 8), names_all)  # (15,38,23)
# ---------- resolution of the T88 test: largest height gamma at which a hypothetical off-line quadruple (beta, gamma) would produce a violation on the grid (linear response by the explicit formula)
Ns88 = np.array([N for N in lists['T88'] if 4 * N in idx and N >= 2], dtype=np.float64)
m88 = np.array([-(devat('zeta:theta', int(4 * N)) - 3 * devat('zeta:theta', int(2 * N)) + 2 * devat('zeta:theta', int(N))) / N ** 1.5 for N in Ns88])
lnN = np.log(Ns88)
def delta(beta, gam):
    out = np.zeros(len(Ns88))
    for b in (beta, 1 - beta):
        rho = complex(b, gam); Q = 4 ** (rho + 1) - 3 * 2 ** (rho + 1) + 2
        out += 2 * (np.exp((rho - 0.5) * lnN) * Q / (rho * (rho + 1))).real
    return out
resol = {}
gam_grid = np.exp(np.linspace(math.log(5), math.log(1e7), 2400))
for beta in (0.55, 0.6, 0.7, 0.75, 0.8, 0.9, 1.0):
    hit = [g for g in gam_grid if (m88 + delta(beta, g)).min() < 0]
    allbelow = None
    for g in gam_grid:
        if (m88 + delta(beta, g)).min() >= 0: allbelow = float(g); break
    resol[str(beta)] = dict(largest_gamma_with_violation=float(max(hit)) if hit else None, smallest_gamma_without_violation=allbelow)
RES['T88_resolution'] = dict(Nmax=float(Ns88[-1]), table=resol, note='zeta:theta margins m(N) on the grid plus 2Re[N^(rho-1/2)Q(rho)/(rho(rho+1))] for rho = beta+i gamma and 1-beta+i gamma')
json.dump(RES, open(res_f, 'w'), indent=0)
print('tents done', resol, flush=True)
# ---------- (3) Pascal ballot: log(S_N/C_N) = E(N) - [15F(529N) - 38F(345N) + 23F(225N)]
mp.mp.dps = 90
def Sg(A, B):
    lH = lambda v: mp.log(mp.hyperfac(v)); lG = lambda v: mp.log(mp.barnesg(v))
    return (lH(B) - lH(A)) - (mp.loggamma(B + 1) - mp.loggamma(A + 1)) - (lG(B + 1) - lG(A + 1))
pas = {}
for name in names_all:
    base = name.split(':')[0]
    if not (base in ('zeta', 'thin', 'del') or base.startswith('TNR')): continue
    rows = []
    for N in [N for N in lists['T93'] if 529 * N in idx]:
        e = float(15 * Sg(345 * N, 529 * N) - 23 * Sg(225 * N, 345 * N) - 419520 * mp.mpf(N) ** 2) if name == 'zeta:theta' or True else 0
        t = 15 * devat(name, 529 * N) - 38 * devat(name, 345 * N) + 23 * devat(name, 225 * N)
        rows.append((N, (e - t) / N ** 1.5, e / N ** 1.5))
    arr = np.array([r[1] for r in rows]); Ns = np.array([r[0] for r in rows], dtype=float)
    negs = np.nonzero(arr < 0)[0]
    dec = []
    for d in range(0, 12):
        m_ = (Ns >= 10 ** d) & (Ns < 10 ** (d + 1))
        if m_.any(): dec.append(dict(decade=d, count=int(m_.sum()), min=float(arr[m_].min()), median=float(np.median(arr[m_])), max=float(arr[m_].max()), n_negative=int((arr[m_] < 0).sum())))
    pas[name] = dict(first_negative_N=int(Ns[negs[0]]) if len(negs) else None, last_negative_N=int(Ns[negs[-1]]) if len(negs) else None, n_negative=int(len(negs)), n=len(rows), decades=dec,
                     pow3=[[int(r[0]), r[1]] for r in rows if 3 ** round(math.log(r[0], 3)) == r[0]], pow10=[[int(r[0]), r[1], r[2]] for r in rows if 10 ** round(math.log10(r[0])) == r[0]])
RES['Pascal'] = pas
mp.mp.dps = 45
# brute-force identity check at N=1: log(S_1/C_1) from K_u directly
def brute_pascal(N):
    U = 529 * N; s = bytearray([1]) * (U + 1); th = [mp.mpf(0)] * (U + 1); acc = mp.mpf(0)
    for u in range(2, U + 1):
        if s[u]:
            acc += mp.log(u)
            for j in range(u * u, U + 1, u): s[j] = 0
        th[u] = acc
    lK = lambda u: u * mp.log(u + 1) - mp.loggamma(u + 1) - th[u]
    up = mp.fsum(lK(u) for u in range(345 * N, 529 * N)) / (184 * N); lo = mp.fsum(lK(u) for u in range(225 * N, 345 * N)) / (120 * N)
    return 2760 * N * (up - lo)
for N in (1, 2):
    if N in lists['T93'] and 529 * N <= XMAX:
        e = 15 * Sg(345 * N, 529 * N) - 23 * Sg(225 * N, 345 * N) - 419520 * mp.mpf(N) ** 2
        mine = e - (15 * devat('zeta:theta', 529 * N) - 38 * devat('zeta:theta', 345 * N) + 23 * devat('zeta:theta', 225 * N))
        RES['meta']['pascal_bruteforce_N%d' % N] = [mp.nstr(brute_pascal(N), 15), mp.nstr(mine, 15)]
print('pascal done', RES['meta'].get('pascal_bruteforce_N1'), flush=True)
# ---------- Robin margin along colossally abundant numbers with largest prime <= x
EG = mp.euler; rob = []
lsp = np.log(sp.astype(np.float64)); spf = sp.astype(np.float64)
grid = [x for x in lists['GRID'] if x >= 1000][::16]
for x in grid:
    i = idx[x]; eps_ = math.log1p(1.0 / x) / math.log(x)
    extra_log = 0.0; extra_sig = 0.0; k = 2
    prevmask = spf <= x
    while True:
        Ek = np.log1p((spf - 1) / (spf ** (k + 1) - spf)) / lsp
        mk = (Ek >= eps_) & prevmask
        if not mk.any(): break
        extra_log += float(lsp[mk].sum())
        # factor (1-p^-(k+1))/(1-p^-k) per level k (telescopes to (1-p^-(a+1))/(1-p^-2) with the level-1 factor (1+1/p))
        extra_sig += float((np.log1p(-spf[mk] ** (-(k + 1.0))) - np.log1p(-spf[mk] ** (-float(k)))).sum())
        prevmask = mk; k += 1
    logn = theta_mp[i] + extra_log; lsig = R_mp[i] + extra_sig
    f = mp.exp(lsig) / mp.log(logn)
    rob.append((x, float(logn), float((1 - f / mp.exp(EG)) * mp.sqrt(logn) * mp.log(logn)), float(mp.exp(EG) * mp.log(logn) - mp.exp(lsig))))
ra = np.array(rob)
dec = []
for d in range(3, 14):
    m_ = (ra[:, 0] >= 10 ** d) & (ra[:, 0] < 10 ** (d + 1))
    if m_.any(): dec.append(dict(decade=d, count=int(m_.sum()), min_nu=float(ra[m_, 2].min()), max_nu=float(ra[m_, 2].max()), min_margin=float(ra[m_, 3].min())))
RES['Robin'] = dict(definition='nu(x) = (1 - sigma(n)/(n e^gamma loglog n)) sqrt(log n) loglog n, n = colossally abundant number of parameter eps = log(1+1/x)/log x; RH (Robin 1984): nu -> 2(sqrt2-1)=0.8284 with zero wave |.| <= 0.0462 and O(1/loglog n) relative corrections',
                    n=len(rob), n_negative=int((ra[:, 2] <= 0).sum()), decades=dec, last=rob[-1])
print('robin done', flush=True)
# ---------- (4) triangular inequality: R(x) = F(x) - (x^2-1)/2 <= C x^(15/8)
G = np.array([idx[x] for x in lists['GRID']]); gx = xs_arr[G]
tri = {}
L2PI = math.log(2 * math.pi); ZLM1 = float(mp.zeta(-1, derivative=1) / mp.zeta(-1))
for name in names_all:
    d = ALL[name][0][G].copy(); base = name.split(':')[0]
    zeta_like = base in ('zeta', 'thin', 'del') or base.startswith('TNR')
    if zeta_like: d = d + 0.5
    r158 = d / gx ** 1.875; r32 = d / gx ** 1.5
    cmx = np.maximum.accumulate(r158); amx = np.maximum.accumulate(np.abs(r158))
    dec = []
    for dd in range(1, 14):
        m_ = (gx >= 10 ** dd) & (gx < 10 ** (dd + 1))
        if m_.any(): dec.append(dict(decade=dd, max_R_over_x158=float(r158[m_].max()), min_R_over_x158=float(r158[m_].min()), max_R_over_x32=float(r32[m_].max()), min_R_over_x32=float(r32[m_].min()),
                                     bestC_upto=float(cmx[m_][-1]), bestC_twosided_upto=float(amx[m_][-1])))
    ent = dict(bestC_one_sided=float(cmx[-1]), argmax_x=float(gx[int(np.argmax(r158))]), bestC_two_sided=float(amx[-1]), argmax_two_sided_x=float(gx[int(np.argmax(np.abs(r158)))]), decades=dec)
    # centred residual sign changes (psi-type, zeta main): r(x) = (psi1(x) - x^2/2 + x log 2pi - zeta'/zeta(-1)) / x^(3/2)
    if name == 'zeta:psi':
        r = (ALL[name][0][G] + gx * L2PI - ZLM1) / gx ** 1.5
        s = np.sign(r); sc = np.nonzero(s[1:] * s[:-1] < 0)[0]
        ent['centred_residual'] = dict(sign_changes_total=int(len(sc)), sign_changes_upto_4p93e8=int((gx[sc] <= 4.93e8).sum()), per_decade=[[dd, int(((gx[sc] >= 10 ** dd) & (gx[sc] < 10 ** (dd + 1))).sum())] for dd in range(0, 14) if 10 ** dd <= XMAX],
                                       min_x_ge_1e3=float(r[gx >= 1e3].min()), max_x_ge_1e3=float(r[gx >= 1e3].max()), bound_K0=K0)
    if name == 'zeta:theta':
        r = (ALL[name][0][G]) / gx ** 1.5
        ent['theta_residual_over_x32_x_ge_1e3'] = [float(r[gx >= 1e3].min()), float(r[gx >= 1e3].max())]
        ent['sign_changes_of_R'] = int((np.sign(d[1:]) * np.sign(d[:-1]) < 0).sum())
    tri[name] = ent
RES['Triangular'] = tri
json.dump(RES, open(res_f, 'w'), indent=0)
print('ALL DONE', flush=True)
