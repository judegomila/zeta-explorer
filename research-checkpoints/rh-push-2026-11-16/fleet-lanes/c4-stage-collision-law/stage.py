#!/usr/bin/env python
# c4-stage-collision-law: stage zeta_X(s) = P_X(s) + chi(s) P_X(1-s) against zeta, with controls.
# float64 (+ longdouble phase reduction) is a screen; zeta values, the zeta-family stage on the Rouche lines,
# negative minima of phi' and off-line stage zeros are re-evaluated with arb balls (python-flint).
import sys, os, json, math, time, numpy as np, mpmath
from multiprocessing import Pool
from flint import acb, arb, ctx, dirichlet_char
from scipy.special import loggamma
NW = int(os.environ.get('RH_WORKERS', '4'))
LD = np.longdouble
PI_LD = LD('3.141592653589793238462643383279502884')
TWOPI = 2 * math.pi
KAP = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
C1 = complex(0.5, -KAP / 2)
PREC = 128
CS = [0.5, 1.0, 2.0, 4.0, 8.0]          # delta * logT on the Rouche lines
AS = [0.05, 0.1, 0.25, 0.5]             # X = T^a
MS = [1, 4, 16, 64, 256]                # sub-window lengths in mean spacings

def primes_upto(n):
    n = int(n)
    if n < 2: return np.zeros(0, dtype=np.int64)
    s = np.ones(n + 1, bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]

def theta_ld(t):
    t = np.asarray(t, dtype=LD)
    return t / 2 * np.log(t / (2 * PI_LD)) - t / 2 - PI_LD / 8 + 1 / (48 * t) + 7 / (5760 * t ** 3)

def red(th):
    th = np.asarray(th, dtype=LD)
    return (th - 2 * PI_LD * np.rint(th / (2 * PI_LD))).astype(float)

class Fam:
    def __init__(s, kind, T0, pr, cnts, seed=0, alpha=0.0):
        s.kind = kind; s.T0 = float(T0); s.pr = pr; s.cnts = list(cnts); s.alpha = float(alpha)
        s.logp = np.log(pr.astype(float))
        mpmath.mp.dps = 40; tw = 2 * mpmath.pi
        s.a = np.array([float(mpmath.fmod(mpmath.mpf(s.T0) * mpmath.log(int(p)), tw)) for p in pr])
        if kind == 'U':
            s.r = np.random.default_rng(seed).random(len(pr)); s.a = s.a + TWOPI * s.r
        if kind == 'DH':
            tab = {0: 0, 1: 1, 2: 1j, 3: -1j, 4: -1}
            s.eps = np.array([tab[int(p) % 5] for p in pr], dtype=complex)
    def PD(s, tau, delta, cn=None):
        """log P and D = -P'/P of the truncated product at 1/2+delta+i(T0+tau); columns = prime counts cn"""
        cn = s.cnts if cn is None else cn
        tau = np.atleast_1d(np.asarray(tau, float)); n = len(tau); m = max(cn) if len(cn) else 0
        L = np.zeros((n, len(cn)), complex); D = np.zeros((n, len(cn)), complex)
        if m == 0: return L, D
        ch = max(8, int(2e6 / m)); pw = np.exp(-(0.5 + delta) * s.logp[:m]); lp = s.logp[:m]
        sel = [c - 1 for c in cn]
        for i0 in range(0, n, ch):
            t = tau[i0:i0 + ch]
            z = np.exp(-1j * (s.a[None, :m] + t[:, None] * lp[None, :])) * pw[None, :]
            if s.kind != 'DH':
                w = 1 - z
                cl = np.cumsum(-np.log(w), axis=1); cd = np.cumsum(lp[None, :] * z / w, axis=1)
                for k, c in enumerate(sel):
                    if c >= 0: L[i0:i0 + ch, k] = cl[:, c]; D[i0:i0 + ch, k] = cd[:, c]
            else:
                z1 = z * s.eps[None, :m]; z2 = z * s.eps.conj()[None, :m]
                l1 = np.cumsum(-np.log(1 - z1), axis=1); d1 = np.cumsum(lp[None, :] * z1 / (1 - z1), axis=1)
                l2 = np.cumsum(-np.log(1 - z2), axis=1); d2 = np.cumsum(lp[None, :] * z2 / (1 - z2), axis=1)
                for k, c in enumerate(sel):
                    if c >= 0:
                        a1 = C1 * np.exp(l1[:, c]); a2 = C1.conjugate() * np.exp(l2[:, c]); Q = a1 + a2
                        L[i0:i0 + ch, k] = np.log(Q); D[i0:i0 + ch, k] = (a1 * d1[:, c] + a2 * d2[:, c]) / Q
        return L, D
    def theta(s, tau):
        tau = np.atleast_1d(np.asarray(tau, float))
        if s.kind == 'DH':
            t = s.T0 + tau
            return (loggamma(0.75 + 0.5j * t).imag + 0.5 * t * math.log(5 / math.pi)).astype(LD)
        return theta_ld(LD(s.T0) + tau.astype(LD) - LD(s.alpha))
    def thetap(s, tau):
        t = s.T0 + np.atleast_1d(np.asarray(tau, float))
        return 0.5 * np.log(5 * t / TWOPI) if s.kind == 'DH' else 0.5 * np.log((t - s.alpha) / TWOPI)
    def logchi(s, delta, tau):
        tau = np.atleast_1d(np.asarray(tau, float))
        if s.kind == 'DH':
            z = 0.5 + delta + 1j * (s.T0 + tau)
            return (0.5 - z) * math.log(5 / math.pi) + loggamma(1 - z / 2) - loggamma((z + 1) / 2)
        t = s.T0 + tau - s.alpha
        return -2j * red(s.theta(tau)) - delta * np.log(t / TWOPI) + 1j * delta ** 2 / (2 * t)
    def W(s, tau, cn=None):
        """e^{i theta} P on the critical line: stage Z_X = 2 Re W"""
        L, D = s.PD(tau, 0.0, cn)
        return np.exp(1j * red(s.theta(tau))[:, None] + L), L, D
    def F(s, delta, tau, cn=None):
        """stage value P(s) + chi(s) conj(P(1 - conj s))"""
        Lp, _ = s.PD(tau, delta, cn); Lm, _ = s.PD(tau, -delta, cn)
        return np.exp(Lp) + np.exp(s.logchi(delta, tau)[:, None] + Lm.conj())

# ---------------- arb side ----------------
def apt(delta, tau):
    return acb(arb(0.5) + arb(float(delta)), arb(G['T0']) + arb(float(tau)))
def arb_chi(s):
    return (acb(2) ** s) * (acb.pi() ** (s - 1)) * (acb.pi() * s / 2).sin() * (1 - s).gamma()
def arb_dlogchi(s):
    q = (acb(0, 1) * acb.pi() * s).exp()
    return (2 * acb.pi()).log() + acb.pi() / 2 * acb(0, 1) * (q + 1) / (q - 1) - (1 - s).digamma()
def arb_stage(s, cnts, chi=None, want='F'):
    """zeta family. want='F': list of P_X(s)+chi(s)P_X(1-s); 'D': list of D_X(s); 'N': (R, D_X(s)+D_X(1-s)) with R = chi P_X(1-s)/P_X(s).
    Products are accumulated as sums of logarithms (ball products of 10^3 rotated factors lose all precision by wrapping)."""
    m = max(cnts) if cnts else 0; L1 = acb(0); L2 = acb(0); D1 = acb(0); D2 = acb(0); out = {}
    cs = set(cnts)
    def rec(c):
        if want == 'F': out[c] = (-L1).exp() + chi * (-L2).exp()
        elif want == 'D': out[c] = D1
        else: out[c] = (chi * (L1 - L2).exp(), D1 + D2)
    if 0 in cs: rec(0)
    for i in range(m):
        z = (-s * G['alogp'][i]).exp(); L1 += (1 - z).log()
        if want != 'F': D1 += G['alogp'][i] * z / (1 - z)
        if want != 'D':
            w = 1 / (G['pint'][i] * z); L2 += (1 - w).log()
            if want == 'N': D2 += G['alogp'][i] * w / (1 - w)
        if i + 1 in cs: rec(i + 1)
    return [out[c] for c in cnts]
def arb_true(s):
    if G['dh']:
        c = acb(arb(0.5), -G['akap'] / 2); cb = acb(arb(0.5), G['akap'] / 2)
        return c * G['ch1'].l(s) + cb * G['ch2'].l(s)
    return s.zeta()

def w_rouche(a):
    """true function (arb) and, for the zeta family, the arb stage on a Rouche line"""
    delta, taus = a; ctx.prec = PREC; res = []
    for tau in taus:
        s = apt(delta, tau); zt = arb_true(s); row = [complex(zt), float(abs(zt).rad())]
        if not G['dh']:
            chi = arb_chi(s)
            for zx in arb_stage(s, G['cn5'], chi):
                r = abs(zt - zx) / abs(zx)
                row += [float(r.mid()), 1 if r < 1 else (-1 if r > 1 else 0), complex(zx)]
        res.append(row)
    return res
def w_dmin(a):
    """arb value of phi'(t) = theta'(t) - Re D_X(1/2+it) at given tau, per column"""
    c, taus = a; ctx.prec = PREC; res = []
    for tau in taus:
        s = apt(0.0, tau); thp = -(arb_dlogchi(s).real) / 2; d = arb_stage(s, [c], want='D')[0]
        v = thp - d.real; res.append((float(v.mid()), bool(v < 0)))
    return res
def w_newton(a):
    """arb point-Newton refinement, then an interval Newton certificate (N(B) inside B, radius 1e-12)
    for a zero of 1 + chi(s)P_X(1-s)/P_X(s) near 1/2 + delta + i(T0 + tau)"""
    c, delta, tau = a; ctx.prec = PREC; r = 1e-12
    s0 = apt(delta, tau)
    try:
        for _ in range(5):
            R0, E0 = arb_stage(s0, [c], arb_chi(s0), want='N')[0]
            s0 = s0 - (1 + R0) / (R0 * (arb_dlogchi(s0) + E0)); s0 = acb(s0.real.mid(), s0.imag.mid())
        B = acb(arb(s0.real.mid(), r), arb(s0.imag.mid(), r))
        R0, _ = arb_stage(s0, [c], arb_chi(s0), want='N')[0]
        RB, EB = arb_stage(B, [c], arb_chi(B), want='N')[0]
        N = s0 - (1 + R0) / (RB * (arb_dlogchi(B) + EB))
        ok = (abs(float((N.real - s0.real).mid())) + float(N.real.rad()) < r) and (abs(float((N.imag - s0.imag).mid())) + float(N.imag.rad()) < r)
        moved = abs(complex(s0 - apt(delta, tau)))
    except Exception:
        ok = False; moved = None
    return bool(ok), moved
def w_zeros(a):
    n, m = a; ctx.prec = PREC
    return [float((z.imag - arb(G['T0'])).mid()) for z in acb.zeta_zeros(n, m)]
def w_grid(a):
    fi, cn, deltas, taus = a; f = FAMS[fi]
    return np.array([f.F(d, taus, cn) for d in deltas])     # [ndelta, nt, ncol]
def w_line(a):
    fi, taus = a; f = FAMS[fi]; Wv, L, D = f.W(taus)
    return Wv, L.imag, D.real

G = {}; FAMS = []

def bisect(fun, a, b, it=34):
    a = a.copy(); b = b.copy(); fa = fun(a)
    for _ in range(it):
        m = 0.5 * (a + b); fm = fun(m); left = (fa * fm <= 0)
        b = np.where(left, m, b); a = np.where(left, a, m); fa = np.where(left, fa, fm)
    return 0.5 * (a + b)

def crossings(f, tau, vals, col, part):
    """refined sign changes of Re or Im of W for column col"""
    ix = np.nonzero(vals[:-1] * vals[1:] < 0)[0]
    if len(ix) == 0: return np.zeros(0)
    cn = [f.cnts[col]]
    fun = (lambda x: f.W(x, cn)[0][:, 0].real) if part == 're' else (lambda x: f.W(x, cn)[0][:, 0].imag)
    return bisect(fun, tau[ix], tau[ix + 1])

def winfrac(ok, per):
    n = (len(ok) // per) * per
    if n == 0: return None
    return float(ok[:n].reshape(-1, per).all(axis=1).mean())

def main(key, heavy):
    t00 = time.time(); ctx.prec = PREC; dh = key.startswith('dh')
    G['dh'] = dh
    if dh:
        z = np.load('dh_zeros2.npy'); beta, gam, cls = z
        on = gam[cls == 0]; on = on[on < 9900.0][-2001:]
        tA, tB = float(on[0]), float(on[-1]); T0 = math.floor(tA); Tnom = 5 * tA; LT = math.log(Tnom)
        G['T0'] = float(T0); zt_tau = on - T0
        offtrue = [(float(b), float(g - T0)) for b, g, c in zip(beta, gam, cls) if c == 1 and tA < g < tB]
        G['akap'] = ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
        G['ch1'] = dirichlet_char(5, 2); G['ch2'] = dirichlet_char(5, 3)
        dens = math.log(5 * tA / TWOPI) / TWOPI; n0 = None
    else:
        Tn = float(key); n0 = int(float(arb(Tn).zeta_nzeros().mid())) + 1
        g0 = acb.zeta_zeros(n0, 1)[0].imag; T0 = math.floor(float(g0.mid())); G['T0'] = float(T0)
        with Pool(NW) as pool:
            zz = pool.map(w_zeros, [(n0 + i, min(200, 2001 - i)) for i in range(0, 2001, 200)])
        zt_tau = np.array([x for r in zz for x in r]); assert np.all(np.diff(zt_tau) > 0)
        tA, tB = T0 + zt_tau[0], T0 + zt_tau[-1]; Tnom = Tn; LT = math.log(Tnom); offtrue = []
        dens = math.log(tA / TWOPI) / TWOPI
    sp = 1 / dens
    Xs = [('log2', LT ** 2)] + [('a%g' % a, Tnom ** a) for a in AS] + ([('a0.75', Tnom ** 0.75)] if heavy else [])
    pr = primes_upto(max(x for _, x in Xs)); cnts = [int(np.searchsorted(pr, x, 'right')) for _, x in Xs]
    n5 = 5; cn5 = cnts[:n5]; G['cn5'] = cn5
    G['alogp'] = [arb(int(p)).log() for p in pr]; G['pint'] = [int(p) for p in pr]
    alpha = 50 * TWOPI / math.log(tA / TWOPI)
    global FAMS
    FAMS = [Fam('DH', T0, pr, cnts)] if dh else [Fam('zeta', T0, pr, cnts), Fam('U', T0, pr, cnts, seed=20261118), Fam('L', T0, pr, cnts, alpha=alpha)]
    n16 = int((tB - tA) / sp * 16); tau16 = (tA - T0) + np.arange(n16) * sp / 16
    n64 = n16 * 4; tau64 = (tA - T0) + np.arange(n64) * sp / 64
    ndel = 48; dgrid = [(0.03 + k * 3.97 / (ndel - 1)) / LT for k in range(ndel)]
    print(key, 'T0', T0, 'window', tA, tB, 'spacing', sp, 'n0', n0, 'primes', len(pr), 'counts', cnts, flush=True)
    print('planned memory: line grids %d x %d cols x 3 arrays = %.1f MB; 2D grid %d x %d x %d complex = %.1f MB per family; PD chunk <= 2e6 complex x ~8 arrays = 256 MB per worker; arb rows %d x %d'
          % (n64, len(cnts), n64 * len(cnts) * 32e-6, ndel, n16, n5, ndel * n16 * n5 * 16e-6, len(CS), n16), flush=True)
    out = {'key': key, 'T0': T0, 'tA': tA, 'tB': tB, 'spacing': sp, 'logT': LT, 'n0': n0, 'X': Xs, 'counts': cnts, 'alpha_L': alpha,
           'n16': n16, 'n64': n64, 'fam': {}}
    pool = Pool(NW)
    # ---------- self-test: float stage against arb stage, DH functional equation ----------
    if not dh:
        f = FAMS[0]; tt = tau16[[7, n16 // 2, n16 - 5]]; err = 0.0
        for d in (0.0, 1.0 / LT, 4.0 / LT):
            Ff = f.F(d, tt, cn5)
            for i, tau in enumerate(tt):
                s = apt(d, tau); Fa = arb_stage(s, cn5, arb_chi(s))
                err = max(err, max(abs(complex(Fa[k]) - Ff[i, k]) / abs(complex(Fa[k])) for k in range(n5)))
        out['selftest_float_vs_arb_stage_relerr'] = err; print('selftest stage rel err', err, flush=True)
    else:
        f = FAMS[0]; s = apt(0.3, tau16[11]); lhs = arb_true(s); rhs = arb_true(1 - s)
        lc = f.logchi(0.3, tau16[[11]])[0]; e = abs(complex(lhs) - cmath_exp(lc) * complex(rhs)) / abs(complex(lhs))
        out['selftest_dh_fe_relerr'] = e; print('selftest DH FE rel err', e, flush=True)
    # ---------- true function on Rouche lines (arb) ----------
    t1 = time.time(); true = {}; rarb = {}
    for c in CS:
        d = c / LT; ch = 64
        res = pool.map(w_rouche, [(d, tau16[i:i + ch]) for i in range(0, n16, ch)], chunksize=1)
        rows = [r for blk in res for r in blk]
        true[c] = np.array([r[0] for r in rows]); out.setdefault('true_maxrad', {})[str(c)] = max(r[1] for r in rows)
        if not dh:
            rarb[c] = {'mid': np.array([[r[2 + 3 * k] for k in range(n5)] for r in rows]),
                       'cert': np.array([[r[3 + 3 * k] for k in range(n5)] for r in rows]),
                       'zx': np.array([[r[4 + 3 * k] for k in range(n5)] for r in rows])}
        print('rouche line c=%g done, sec %.0f' % (c, time.time() - t1), flush=True)
    # ---------- per family ----------
    for fi, f in enumerate(FAMS):
        fo = {}; out['fam'][f.kind] = fo; t1 = time.time()
        ch = 2048
        res = pool.map(w_line, [(fi, tau64[i:i + ch]) for i in range(0, n64, ch)], chunksize=1)
        Wv = np.concatenate([r[0] for r in res]); argP = np.concatenate([r[1] for r in res]); ReD = np.concatenate([r[2] for r in res])
        thp = f.thetap(tau64); th64 = f.theta(tau64)
        print(f.kind, 'line grid sec %.0f' % (time.time() - t1), flush=True)
        for col, (xn, xv) in enumerate(Xs):
            co = {'X': xv, 'nprimes': cnts[col]}; fo[xn] = co
            dphi = thp - ReD[:, col]; neg = dphi < 0
            sc = np.nonzero((dphi[:-1] < 0) != (dphi[1:] < 0))[0]
            co['a_stationary_points'] = int(len(sc)); co['a_frac_phi_prime_neg'] = float(neg.mean())
            co['a_min_phi_prime_over_theta_prime'] = float((dphi / thp).min())
            co['a_trivial_bound_sum_logp_over_sqrtp_minus_1'] = float(np.sum(f.logp[:cnts[col]] / (np.sqrt(pr[:cnts[col]]) - 1)))
            co['a_theta_prime'] = float(thp[0])
            if f.kind == 'zeta' and len(sc):
                lm = np.nonzero((dphi[1:-1] < 0) & (dphi[1:-1] <= dphi[:-2]) & (dphi[1:-1] <= dphi[2:]))[0] + 1
                lm = lm[:400]; rr = pool.map(w_dmin, [(cnts[col], tau64[lm[i:i + 20]]) for i in range(0, len(lm), 20)], chunksize=1)
                rr = [x for b in rr for x in b]
                co['a_arb_negative_minima_checked'] = len(rr); co['a_arb_negative_minima_certified'] = int(sum(1 for x in rr if x[1]))
            zs = crossings(f, tau64, Wv[:, col].real, col, 're'); ap = crossings(f, tau64, Wv[:, col].imag, col, 'im')
            co['a_online_stage_zeros'] = int(len(zs)); co['true_online_zeros_in_window'] = int(len(zt_tau))
            # nearest-neighbour defect (offset free), in mean spacings
            if len(zs):
                j = np.clip(np.searchsorted(zs, zt_tau), 1, len(zs) - 1)
                dn = np.minimum(np.abs(zs[j] - zt_tau), np.abs(zs[j - 1] - zt_tau)) / sp
                co['b_nn_defect_rms'] = float(np.sqrt((dn ** 2).mean())); co['b_nn_defect_max'] = float(dn.max())
                co['b_nn_defect_median'] = float(np.median(dn))
            if f.kind != 'DH' and len(zs):
                # absolute level of a stage zero: (theta + arg P)/pi = k + 1/2 ; zeta zero n pairs with k = n - 2
                def level(x, half):
                    L, _ = f.PD(x, 0.0, [cnts[col]]); v = (f.theta(x) + L[:, 0].imag.astype(LD)) / PI_LD
                    if f.kind == 'L': v = v + 50      # chi taken at height t - alpha, alpha = 50 mean spacings at tA
                    return np.rint(v - LD(0.5) if half else v).astype(np.int64)
                kz = level(zs, True); best = None
                for off in (1, 2, 3):
                    d = []; multi = 0
                    lev = {}
                    for k, x in zip(kz, zs): lev.setdefault(int(k), []).append(x)
                    for i, g in enumerate(zt_tau):
                        c_ = lev.get(n0 + i - off)
                        if c_:
                            d.append(min(c_, key=lambda x: abs(x - g)) - g)
                            if len(c_) > 1: multi += 1
                    d = np.array(d) / sp
                    st = {'offset': off, 'n': int(len(d)), 'rms': float(np.sqrt((d ** 2).mean())), 'mean': float(d.mean()), 'max': float(np.abs(d).max()),
                          'frac_gt_half': float((np.abs(d) > 0.5).mean()), 'frac_gt_quarter': float((np.abs(d) > 0.25).mean()), 'levels_multi': multi}
                    if off == 2: co['b_level_defect'] = st
                    if best is None or st['rms'] < best['rms']: best = st
                co['b_best_offset'] = best['offset']
                # anti-points: phi = k pi ; ideal count of zeta zeros below is k + 1
                ka = level(ap, False); cntb = n0 - 1 + np.searchsorted(zt_tau, ap); e = cntb - (ka + 1)
                inner = (ap > zt_tau[0]) & (ap < zt_tau[-1]); e = e[inner]
                co['b_antipoint_n'] = int(len(e)); co['b_antipoint_frac_count_error_nonzero'] = float((e != 0).mean())
                co['b_antipoint_frac_sign_law_violated'] = float((e % 2 != 0).mean()); co['b_antipoint_max_abs_count_error'] = int(np.abs(e).max())
                # longest run of consecutive anti-points with zero count error, in spacings
                run = best_run = 0
                for v in e:
                    run = run + 1 if v == 0 else 0; best_run = max(best_run, run)
                co['b_longest_run_exact_antipoints'] = int(best_run)
                # failure prediction by the prime-only event: 4-spacing blocks
                if col < n5:
                    blk = 4 * sp; nb = int((tau64[-1] - tau64[0]) / blk)
                    ev = np.array([neg[i * 256:(i + 1) * 256].any() for i in range(nb)])
                    bi = np.clip(((ap[inner] - tau64[0]) / blk).astype(int), 0, nb - 1); fl = np.zeros(nb, bool); fl[bi[e != 0]] = True
                    co['pred_gram_fail_vs_phi_neg_blocks4'] = [int((fl & ev).sum()), int((fl & ~ev).sum()), int((~fl & ev).sum()), int((~fl & ~ev).sum())]
            if col >= n5: continue
            # ---- (c) Rouche ratio on Re s = 1/2 + c/logT ----
            cc = {}; co['c'] = cc
            blkneg = neg
            for c in CS:
                d = c / LT; Ff = np.concatenate([f.F(d, tau16[i:i + 4096], [cnts[col]])[:, 0] for i in range(0, n16, 4096)])
                rf = np.abs(true[c] - Ff) / np.abs(Ff); e = {}
                if f.kind == 'zeta':
                    ra = rarb[c]; ok = ra['cert'][:, col] == 1; bad = ra['cert'][:, col] == -1
                    e['arb_points'] = int(len(ok)); e['arb_cert_lt1'] = int(ok.sum()); e['arb_cert_gt1'] = int(bad.sum()); e['arb_undecided'] = int(len(ok) - ok.sum() - bad.sum())
                    e['float_vs_arb_max_abs_diff_stage'] = float(np.abs(ra['zx'][:, col] - Ff).max()); e['float_class_mismatch'] = int(((rf < 1) != ok).sum())
                    rr = ra['mid'][:, col]
                else:
                    ok = rf < 1; rr = rf
                e['frac_points_lt1'] = float(ok.mean()); e['median_ratio'] = float(np.median(rr)); e['max_ratio'] = float(rr.max()); e['q90'] = float(np.quantile(rr, 0.9)); e['q99'] = float(np.quantile(rr, 0.99))
                e['winfrac'] = {str(m): winfrac(ok, 16 * m) for m in MS}; e['whole_window_holds'] = bool(ok.all())
                # prediction of failing 4-spacing blocks by the prime-only event phi' <= 0 in the block
                nb = len(ok) // 64; flb = ~ok[:nb * 64].reshape(nb, 64).all(axis=1); evb = np.array([blkneg[i * 256:(i + 1) * 256].any() for i in range(nb)])
                e['pred_fail_vs_phi_neg_blocks4'] = [int((flb & evb).sum()), int((flb & ~evb).sum()), int((~flb & evb).sum()), int((~flb & ~evb).sum())]
                cc[str(c)] = e
        print(f.kind, 'line stats sec %.0f' % (time.time() - t1), flush=True)
        # ---------- off-line stage zeros by cell winding on the 2D grid ----------
        t1 = time.time(); ch = max(64, int(4e5 / max(1, max(cn5))))
        res = pool.map(w_grid, [(fi, cn5, dgrid, tau16[i:min(n16, i + ch + 1)]) for i in range(0, n16 - 1, ch)], chunksize=1)
        for col in range(n5):
            co = fo[Xs[col][0]]; cand = []; tot = 0
            for bi, blk in enumerate(res):
                ang = np.angle(blk[:, :, col]); wr = lambda x: (x + math.pi) % TWOPI - math.pi
                dt = wr(ang[:, 1:] - ang[:, :-1]); ds = wr(ang[1:, :] - ang[:-1, :])
                w = np.rint((dt[:-1, :] + ds[:, 1:] - dt[1:, :] - ds[:, :-1]) / TWOPI).astype(int)
                ii, jj = np.nonzero(w); tot += int(w.sum())
                for i, j in zip(ii, jj): cand.append((0.5 * (dgrid[i] + dgrid[i + 1]), tau16[bi * ch + j] + sp / 32, int(w[i, j])))
            co['a_offline_cells_nonzero_winding'] = len(cand); co['a_offline_net_winding'] = tot
            zer = []
            for d0, tau0, w0 in cand[:600]:
                s = complex(d0, tau0); okc = False
                for it in range(40):
                    h = 1e-6
                    Fv = f.F(s.real, [s.imag], [cn5[col]])[0, 0]; Fd = (f.F(s.real + h, [s.imag], [cn5[col]])[0, 0] - f.F(s.real - h, [s.imag], [cn5[col]])[0, 0]) / (2 * h)
                    if Fd == 0: break
                    st = Fv / Fd
                    if abs(st) > 0.5 * sp: st *= 0.5 * sp / abs(st)
                    s -= st
                    if abs(st) < 1e-12: okc = True; break
                if okc and s.real > 1e-7 and not any(abs(s - u) < 1e-7 for u in zer): zer.append(s)
            co['a_offline_stage_zeros_found'] = len(zer)
            lst = []
            sc_t = tau64[np.nonzero(((thp - ReD[:, col])[:-1] < 0) != ((thp - ReD[:, col])[1:] < 0))[0]]
            cert = pool.map(w_newton, [(cn5[col], s.real, s.imag) for s in zer], chunksize=4) if (f.kind == 'zeta' and zer) else [None] * len(zer)
            cert = [x if x is None else x[0] for x in cert]
            for s, ce in zip(zer, cert):
                dist = float(np.abs(sc_t - s.imag).min() / sp) if len(sc_t) else None
                lst.append({'delta_logT': s.real * LT, 'tau': s.imag, 'dist_to_stationary_pt_spacings': dist, 'arb_interval_newton': ce})
            co['a_offline_stage_zeros'] = lst[:60]
            if lst and lst[0]['dist_to_stationary_pt_spacings'] is not None:
                co['a_offline_max_dist_to_stationary'] = max(x['dist_to_stationary_pt_spacings'] for x in lst)
                co['a_offline_min_delta_logT'] = min(x['delta_logT'] for x in lst)
            if f.kind == 'zeta': co['a_offline_arb_certified'] = int(sum(1 for x in cert if x))
            if dh:
                co['true_offline_in_window'] = len(offtrue)
                mt = []
                for b, tg in offtrue:
                    if zer: mt.append(min(abs(complex(b - 0.5, tg) - u) for u in zer) / sp)
                co['true_offline_dist_to_nearest_stage_offline_spacings'] = mt[:60]
        print(f.kind, '2D grid sec %.0f' % (time.time() - t1), flush=True)
        del res
    pool.close(); pool.join()
    out['sec'] = time.time() - t00
    json.dump(out, open('out_%s%s.json' % (key, '_h' if heavy else ''), 'w'), indent=1, default=float)
    print('done', key, 'sec', out['sec'], flush=True)

def cmath_exp(z):
    import cmath
    return cmath.exp(complex(z))

if __name__ == '__main__':
    main(sys.argv[1], len(sys.argv) > 2 and sys.argv[2] == 'heavy')
