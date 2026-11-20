"""Combination 3: M_t = -H_t'/H_t (d_t H = -H_zz, z = x - i c, s = 1/2 + i z/2, Re s = 1/2 + c/2) rebuilt from prime powers <= P
against direct evaluation (Arb), t in {-0.1, 0, +0.1}, lines c = 1.2 and 2.
  t = 0:   M_0 = -(i/2) (g'/g + F'/F)(s);  prime side F'/F = -sum_{n = p^k <= P} c_F(n) log p n^-s  (+ the pole term P^{1-s}/(s-1) where F has the pole of zeta)
  t < 0:   H_t(z) = int H_0(z - y) G(y) dy, G Gaussian of variance 2|t| (heat equation along the line); prime side H_0 = g(s) exp(sum_{n <= P} c_F(n) n^-s / k)
  t > 0:   H_t(z) = int H_0(z + i v) G(v) dv (vertical line; it crosses the strip).  Prime side: the part of the integral with Re s >= 1.02 only.
  Burgers defect at t = -0.1: [M_{t+e} - M_{t-e}]/(2e) - (2 M M' - M'') with z-derivatives from the Gaussian derivatives (convention d_t H = -H_zz).
Objects: ZETA, L4, L5, DH (= c1 L(chi) + c2 L(chibar), two Euler products), LIOU (sign twist lambda: zeta(2s)/zeta(s), gamma factor of zeta),
TNR:<q>:<c> (zeta (1 + c q^{1/2-s} + q^{1-2s}), factor expanded in powers q^j <= P), EA (zeta(s+a) zeta(s-a), a = 0.02, line c = 1.2 only).
Usage: c3.py OUT.json P x0,x0,.. [objects]"""
import sys, os, math, json, time, ctypes, cmath
import numpy as np, mpmath as mp
from flint import arb, acb, ctx, dirichlet_char
HERE = os.path.dirname(os.path.abspath(__file__))
_k = ctypes.CDLL(os.path.join(HERE, 'psum.so')); _dp = np.ctypeslib.ndpointer(np.float64, flags='C_CONTIGUOUS'); _lp = np.ctypeslib.ndpointer(np.int64, flags='C_CONTIGUOUS')
_k.psum.argtypes = [ctypes.c_long, _lp, _dp, _dp, _dp, _dp, ctypes.c_long, _dp, ctypes.c_long, _dp, _dp]
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)
A_EA = 0.02; LINES = [1.2, 2.0]; TB = 0.1; EPS = 0.004; HY = 0.05; NY = 46; HV = 0.04; VMIN = -4.6; VMAX = 2.0

def prime_powers(P):
    log('sieve to %g: planned memory about %.2f GB' % (P, 5.5e7 * 6 * 8 / 1e9 * (P / 1e9) + 0.2))
    seg = 1 << 24; small = int(P ** 0.5) + 1
    s = np.ones(small + 1, dtype=bool); s[:2] = False
    for i in range(2, int(small ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    sp = np.nonzero(s)[0]; out = []
    for lo in range(2, int(P) + 1, seg):
        hi = min(lo + seg, int(P) + 1); m = np.ones(hi - lo, dtype=bool)
        for p in sp:
            if p * p >= hi: break
            st = max(p * p, (lo + p - 1) // p * p); m[st - lo::p] = False
        out.append(np.nonzero(m)[0] + lo)
    pr = np.concatenate(out)
    ns = [pr]; ps = [pr]; ks = [np.ones(len(pr), dtype=np.int8)]
    k = 2
    while 2 ** k <= P:
        q = pr[pr <= int(round(P ** (1.0 / k))) + 1]; q = q[q.astype(object) ** k <= int(P)] if len(q) < 100000 else q[np.power(q.astype(np.float64), k) <= P * (1 + 1e-12)]
        ns.append(q ** k); ps.append(q); ks.append(np.full(len(q), k, dtype=np.int8)); k += 1
    n = np.concatenate(ns); p = np.concatenate(ps); kk = np.concatenate(ks)
    cls = (n % 20) + 20 * (kk % 2 == 0)
    o = np.argsort(cls, kind='stable'); n = n[o]; p = p[o]; kk = kk[o]; cls = cls[o]
    start = np.searchsorted(cls, np.arange(41)).astype(np.int64)
    ll_ = np.log(n.astype(np.longdouble)); lh = ll_.astype(np.float64); llo = (ll_ - lh).astype(np.float64)
    return dict(start=start, lh=np.ascontiguousarray(lh), ll=np.ascontiguousarray(llo), invk=np.ascontiguousarray(1.0 / kk), logp=np.ascontiguousarray(np.log(p.astype(np.float64))), count=len(n))

def psums(PP, t, sig):
    t = np.ascontiguousarray(t, dtype=np.float64); sig = np.ascontiguousarray(sig, dtype=np.float64)
    out = np.zeros(len(t) * len(sig) * 40 * 4)
    _k.psum(40, PP['start'], PP['lh'], PP['ll'], PP['invk'], PP['logp'], len(t), t, len(sig), sig, out)
    o = out.reshape(len(t), len(sig), 40, 4)
    return o[..., 0] - 1j * o[..., 1], o[..., 2] - 1j * o[..., 3]          # sum (1/k) n^-s , sum log p n^-s   by class

def cvec(name):
    r = np.arange(40) % 20; ev = np.arange(40) >= 20
    if name == 'ZETA': return np.ones(40, dtype=complex)
    if name == 'L4': return np.array([0, 1, 0, -1])[r % 4].astype(complex)
    if name == 'L5': return np.array([0, 1, -1, -1, 1])[r % 5].astype(complex)
    if name == 'CHI': return np.array([0, 1, 1j, -1j, -1])[r % 5]
    if name == 'CHIBAR': return np.array([0, 1, -1j, 1j, -1])[r % 5]
    if name == 'LIOU': return np.where(ev, 1.0, -1.0).astype(complex)
    raise ValueError(name)

KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1); C1 = (1 - 1j * KAPPA) / 2; C2 = (1 + 1j * KAPPA) / 2
_CH = {}
def chars():
    if not _CH:
        _CH['L4'] = dirichlet_char(4, 3); _CH['L5'] = dirichlet_char(5, 4)
        for l in (2, 3):
            ch = dirichlet_char(5, l)
            _CH['CHI' if abs(complex(ch(2)) - 1j) < 1e-9 else 'CHIBAR'] = ch
    return _CH
def tnr_factor(s, q, c): return 1 + c * q ** (0.5 - s) + q ** (1 - 2 * s)
def F_direct(obj, s):
    """F(s) as acb"""
    if obj == 'ZETA': return s.zeta()
    if obj in ('L4', 'L5'): return chars()[obj].l(s)
    if obj == 'DH': return acb(C1.real, C1.imag) * chars()['CHI'].l(s) + acb(C2.real, C2.imag) * chars()['CHIBAR'].l(s)
    if obj == 'LIOU': return (2 * s).zeta() / s.zeta()
    if obj == 'EA': return (s + A_EA).zeta() * (s - A_EA).zeta()
    if obj.startswith('TNR'):
        _, q, c = obj.split(':'); q = arb(q); c = arb(c)
        return s.zeta() * (1 + c * (q.log() * (arb(0.5) - s)).exp() + (q.log() * (1 - 2 * s)).exp())
def lg(obj, s):
    """log of the archimedean factor (acb)"""
    pi = arb.pi()
    if obj in ('ZETA', 'LIOU') or obj.startswith('TNR'): return (s * (s - 1) / 2).log() - s / 2 * pi.log() + (s / 2).lgamma()
    if obj == 'EA': return lg('ZETA', s + A_EA) + lg('ZETA', s - A_EA)
    if obj == 'L4': return (s + 1) / 2 * (arb(4) / pi).log() + ((s + 1) / 2).lgamma()
    if obj == 'DH': return (s + 1) / 2 * (arb(5) / pi).log() + ((s + 1) / 2).lgamma()
    if obj == 'L5': return s / 2 * (arb(5) / pi).log() + (s / 2).lgamma()
def cx(z): return complex(float(z.real.mid()), float(z.imag.mid()))
def prime_F(obj, S, D, s, sig_index, P, pole=True):
    """(log F_P(s), (F'/F)_P(s), F_P(s)) from the class sums S, D (arrays over classes) at the complex point s (python complex).
    sig_index: dict sigma -> (S_row, D_row) for EA."""
    def pole_log(s_): return complex(mp.expint(1, (s_ - 1) * math.log(P))) if pole else 0.0
    def pole_dl(s_): return -P ** (1 - s_) / (s_ - 1) if pole else 0.0       # tail of -sum Lambda n^-s
    if obj in ('ZETA', 'L4', 'L5', 'LIOU'):
        c = cvec(obj); lf = (c * S).sum(); dl = -(c * D).sum()
        if obj == 'ZETA': lf += pole_log(s); dl += pole_dl(s)
        if obj == 'LIOU': lf -= pole_log(s); dl -= pole_dl(s)
        return lf, dl, cmath.exp(lf)
    if obj == 'DH':
        l1 = (cvec('CHI') * S).sum(); l2 = (cvec('CHIBAR') * S).sum(); d1 = -(cvec('CHI') * D).sum(); d2 = -(cvec('CHIBAR') * D).sum()
        F = C1 * cmath.exp(l1) + C2 * cmath.exp(l2); dF = C1 * cmath.exp(l1) * d1 + C2 * cmath.exp(l2) * d2
        return cmath.log(F), dF / F, F
    if obj.startswith('TNR'):
        _, q, c = obj.split(':'); q = float(q); c = float(c); al = (c + math.sqrt(c * c - 4)) / 2
        lf, dl, _ = prime_F('ZETA', S, D, s, sig_index, P, pole)
        j = 1
        while q ** j <= P:
            u = (-1) ** (j + 1) * (al ** j + al ** -j) * q ** (j * (0.5 - s)); lf += u / j; dl += -math.log(q) * u; j += 1
        return lf, dl, cmath.exp(lf)
    raise ValueError(obj)

def run_point(PP, P, x0, objs, prec=160):
    ctx.prec = prec; res = []
    y = HY * np.arange(-NY, NY + 1)
    sigs = [0.5 + c / 2 for c in LINES] + [0.5 + LINES[0] / 2 + A_EA, 0.5 + LINES[0] / 2 - A_EA]
    t0 = time.time(); Sh, Dh = psums(PP, (x0 + y) / 2, sigs)                 # [node, sigma, class]
    v = np.arange(VMIN, VMAX + 1e-9, HV)
    sv = sorted(set(round(0.5 + (c - vv) / 2, 10) for c in LINES for vv in v if 0.5 + (c - vv) / 2 >= 1.02 - 1e-12))
    Sv, Dv = psums(PP, np.array([x0 / 2]), sv); svi = {s_: i for i, s_ in enumerate(sv)}
    tk = time.time() - t0
    for obj in objs:
        for ci, c in enumerate(LINES):
            if obj == 'EA' and ci != 0: continue
            sig = 0.5 + c / 2; t1 = time.time()
            def prime_at(node_j=None, sv_=None):
                """F_P and (F'/F)_P at a horizontal node or a vertical sigma"""
                if node_j is not None:
                    s_ = complex(sig, (x0 + y[node_j]) / 2)
                    if obj == 'EA':
                        a = prime_F('ZETA', Sh[node_j, 2], Dh[node_j, 2], s_ + A_EA, None, P); b = prime_F('ZETA', Sh[node_j, 3], Dh[node_j, 3], s_ - A_EA, None, P)
                        return a[0] + b[0], a[1] + b[1], a[2] * b[2]
                    return prime_F(obj, Sh[node_j, ci], Dh[node_j, ci], s_, None, P)
                s_ = complex(sv_, x0 / 2)
                if obj == 'EA': return None
                return prime_F(obj, Sv[0, svi[sv_]], Dv[0, svi[sv_]], s_, None, P)
            # ---- direct values on the horizontal nodes
            s0 = acb(arb(sig), arb(x0) / 2); lg0 = lg(obj, s0)
            Hd = np.empty(len(y), dtype=complex); Hp = np.empty(len(y), dtype=complex)
            for j in range(len(y)):
                sj = acb(arb(sig), arb(float(x0 + y[j])) / 2); g = cx((lg(obj, sj) - lg0).exp())
                Hd[j] = g * cx(F_direct(obj, sj)); Hp[j] = g * prime_at(node_j=j)[2]
            # ---- t = 0
            h = arb(2) ** -30; j0 = NY
            dlF = cx((F_direct(obj, s0 + h) - F_direct(obj, s0 - h)) / (2 * h) / F_direct(obj, s0))
            dlg = cx((lg(obj, s0 + h) - lg(obj, s0 - h)) / (2 * h))
            M0d = -0.5j * (dlg + dlF); M0p = -0.5j * (dlg + prime_at(node_j=j0)[1])
            row = dict(obj=obj, x0=x0, c=c, sigma=sig, M0_direct=[M0d.real, M0d.imag], M0_abs_diff=abs(M0p - M0d),
                       logF_abs_diff=abs(prime_at(node_j=j0)[2] / cx(F_direct(obj, s0)) - 1))
            # ---- t < 0 (Gaussian along the line) and Burgers defect
            def Mt(H, t):
                a = abs(t); G = np.exp(-y * y / (4 * a)) / math.sqrt(4 * math.pi * a) * HY; u = y / (2 * a)
                # derivatives of G at -y: G'(-y) = u G, G''(-y) = (u^2 - 1/(2a)) G, G'''(-y) = (u^3 - 3u/(2a)) G
                h0 = (H * G).sum(); h1 = (H * G * u).sum(); h2 = (H * G * (u * u - 1 / (2 * a))).sum(); h3 = (H * G * (u ** 3 - 3 * u / (2 * a))).sum()
                M = -h1 / h0; M1 = -h2 / h0 + (h1 / h0) ** 2; M2 = -h3 / h0 + 3 * h1 * h2 / h0 ** 2 - 2 * (h1 / h0) ** 3
                return M, M1, M2
            Md, M1d, M2d = Mt(Hd, -TB); Mp, M1p, M2p = Mt(Hp, -TB)
            row['Mneg_direct'] = [Md.real, Md.imag]; row['Mneg_abs_diff'] = abs(Mp - Md)
            for tag, H, (M, M1, M2) in (('direct', Hd, (Md, M1d, M2d)), ('prime', Hp, (Mp, M1p, M2p))):
                dM = (Mt(H, -TB + EPS)[0] - Mt(H, -TB - EPS)[0]) / (2 * EPS)
                row['burgers_defect_' + tag] = abs(dM - (2 * M * M1 - M2)); row['burgers_scale_' + tag] = abs(dM)
            # ---- t > 0 (vertical line through the strip)
            if obj != 'EA':
                Gv = np.exp(-v * v / (4 * TB)) / math.sqrt(4 * math.pi * TB) * HV; uv = v / (2 * TB)
                Hvd = np.empty(len(v), dtype=complex); Hvp = np.zeros(len(v), dtype=complex); inreg = np.zeros(len(v), dtype=bool)
                for j, vv in enumerate(v):
                    sgj = 0.5 + (c - vv) / 2; sj = acb(arb(float(sgj)), arb(x0) / 2); g = cx((lg(obj, sj) - lg0).exp())
                    Hvd[j] = g * cx(F_direct(obj, sj))
                    if sgj >= 1.02 - 1e-12: inreg[j] = True; Hvp[j] = g * prime_at(sv_=round(sgj, 10))[2]
                Mfull = -(-1j * (Hvd * Gv * uv).sum()) / (Hvd * Gv).sum()
                Mtr = -(-1j * (Hvd * Gv * uv)[inreg].sum()) / (Hvd * Gv)[inreg].sum()
                Mpr = -(-1j * (Hvp * Gv * uv)[inreg].sum()) / (Hvp * Gv)[inreg].sum()
                row['Mpos_direct'] = [Mfull.real, Mfull.imag]; row['Mpos_strip_part'] = abs(Mfull - Mtr); row['Mpos_prime_vs_truncated_direct'] = abs(Mpr - Mtr)
                row['Mpos_prime_vs_direct'] = abs(Mpr - Mfull); row['weight_in_strip'] = float(abs((Hvd * Gv)[~inreg].sum()) / abs((Hvd * Gv).sum()))
            row['sec'] = round(time.time() - t1, 1); res.append(row)
            log('%-14s x0=%.6g c=%.1f  |dM0| %.2e  |dM-| %.2e  Burgers %.1e/%.1e  |dM+| %s (strip part %s)  %.0fs' % (obj, x0, c, row['M0_abs_diff'], row['Mneg_abs_diff'],
                row['burgers_defect_prime'], row['burgers_scale_prime'], ('%.2e' % row['Mpos_prime_vs_direct']) if 'Mpos_prime_vs_direct' in row else '-', ('%.2e' % row['Mpos_strip_part']) if 'Mpos_strip_part' in row else '-', row['sec']))
    return res, tk

if __name__ == '__main__':
    out, P = sys.argv[1], float(sys.argv[2]); xs = [float(v) for v in sys.argv[3].split(',')]
    objs = sys.argv[4].split(',') if len(sys.argv) > 4 else ['ZETA', 'LIOU', 'TNR:3:2.2', 'TNR:1000003:2.2', 'EA']
    PP = prime_powers(P); log('prime powers', PP['count'])
    rows = []
    for x0 in xs:
        r, tk = run_point(PP, P, x0, objs); rows += r; log('x0=%g kernel %.0fs' % (x0, tk))
        json.dump(dict(P=P, prime_powers=PP['count'], rows=rows), open(out, 'w'), indent=0)
