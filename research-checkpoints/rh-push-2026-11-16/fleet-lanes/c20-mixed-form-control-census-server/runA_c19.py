# Run A: Theorem A (c18-tz-one-sided-bound-fe-reserve-bridge) in ball arithmetic. python-flint.
import os, sys, json, math, time
os.environ['OMP_NUM_THREADS'] = '1'
import numpy as np
import flint
from flint import arb, acb
PREC_W, PREC_Z = 128, 256
TS = [100.0, 200.0, 400.0, 800.0]
SLAB = 10.0

def series(name):
    if name.startswith('zeta'):
        P = int(name[4:]); return [1.0] * P
    if name == 'N5': return [1, 1, -1, 2, 0.5]
    if name == 'N12': return [1, -0.5, 2, 1, -1, 0.5, 1, 3, -2, 1, 0.25, 1.5]
    if name == 'DH12':
        k = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
        per = [1, k, -k, -1, 0]
        return [per[(n - 1) % 5] for n in range(1, 13)]
    raise ValueError(name)

class DP:
    def __init__(self, a):
        self.a = [arb(x) for x in a]            # floats are exact dyadics: the series IS the one with these coefficients
        self.af = np.array(a, dtype=float)
        self.P = len(a)
        self.setprec()
    def setprec(self):
        self.L = [arb(n).log() for n in range(1, self.P + 1)]
        self.u = self.L[-1]
    def f(self, s):
        r = acb(0)
        for a, L in zip(self.a, self.L):
            if a != 0: r += a * (-s * L).exp()
        return r
    def df(self, s):
        r = acb(0)
        for a, L in zip(self.a, self.L):
            if a != 0: r -= a * L * (-s * L).exp()
        return r
    def fnp(self, s):
        L = np.log(np.arange(1, self.P + 1))
        E = np.exp(-np.outer(s, L)) * self.af
        return E.sum(1), -(E * L).sum(1)

def strip(D):
    # sigma_R: sum_{n>=2} |a_n| n^-sigma < 1 ; sigma_L: sum_{n<P} |a_n/a_P| (P/n)^sigma < 1
    aP = abs(D.a[-1])
    sR = 0.0
    while True:
        v = sum(abs(a) * (-arb(sR) * L).exp() for a, L in zip(D.a[1:], D.L[1:]))
        if v < 1: break
        sR += 0.25
    sL = 0.0
    while True:
        v = sum(abs(a) / aP * (arb(sL) * (D.u - L)).exp() for a, L in zip(D.a[:-1], D.L[:-1]))
        if v < 1: break
        sL -= 0.25
    return sL, sR

class Deep(Exception): pass

def seg_arg(D, x0, y0, x1, y1, depth=0):
    """certified change of arg D along the axis-parallel segment; returns arb"""
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    rx, ry = abs(x1 - x0) / 2 + 1e-11, abs(y1 - y0) / 2 + 1e-11
    box = acb(arb(mx, rx), arb(my, ry)); mid = acb(mx, my)
    encl = D.f(mid) + D.df(box) * (box - mid)
    if not encl.contains(acb(0)):
        return (D.f(acb(x1, y1)) / D.f(acb(x0, y0))).arg()
    if depth > 44: raise Deep()
    return seg_arg(D, x0, y0, mx, my, depth + 1) + seg_arg(D, mx, my, x1, y1, depth + 1)

def path_arg(D, x0, y0, x1, y1, step):
    n = max(1, int(math.ceil(max(abs(x1 - x0), abs(y1 - y0)) / step)))
    tot = arb(0)
    for i in range(n):
        xa, ya = x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n
        xb, yb = x0 + (x1 - x0) * (i + 1) / n, y0 + (y1 - y0) * (i + 1) / n
        if i + 1 == n: xb, yb = x1, y1
        tot += seg_arg(D, xa, ya, xb, yb)
    return tot

def float_zeros(D, sL, sR, ylo, yhi, dx, dy):
    xs = np.arange(sL, sR + dx, dx); ys = np.arange(ylo, yhi + dy, dy)
    out = []
    B = max(1, 400000 // len(xs))
    for i in range(0, len(ys), B):
        s = (xs[None, :] + 1j * ys[i:i + B, None]).ravel()
        with np.errstate(all='ignore'):
            for _ in range(40):
                f, d = D.fnp(s)
                s = s - f / d
                s = np.where(np.isfinite(s), s, 0)
                s = np.where((s.real < sL - 5) | (s.real > sR + 5), 0, s)
            f, d = D.fnp(s)
            ok = np.abs(f / d) < 1e-9
        out.append(s[ok & (s.real > sL - 1e-6) & (s.real < sR + 1e-6) & (s.imag > ylo - 0.3) & (s.imag < yhi + 0.3)])
    z = np.concatenate(out)
    if len(z) == 0: return z
    z = z[np.lexsort((z.real, z.imag))]
    keep = []
    for v in z:   # dedupe (window of recent)
        if not any(abs(v - w) < 1e-6 for w in keep[-12:]): keep.append(v)
    return np.array(keep)

def certify_zero(D, z):
    flint.ctx.prec = PREC_Z
    s = acb(float(z.real), float(z.imag))
    for _ in range(9):
        s = s - D.f(s) / D.df(s)
        s = acb(s.real.mid(), s.imag.mid())
    r = arb(2) ** (-170)
    B = acb(arb(s.real.mid(), r), arb(s.imag.mid(), r))
    N = s - D.f(s) / D.df(B)
    ok = B.contains_interior(N)
    return B, ok

def forms(D, tau):
    """closed forms for h = sin^4(pi s/u) e^{i tau s}"""
    u = D.u; pi = arb.pi(); I = acb(0, 1)
    ck = {0: arb(3) / 8, 1: -arb(1) / 4, -1: -arb(1) / 4, 2: arb(1) / 16, -2: arb(1) / 16}
    om = {k: 2 * pi * k / u for k in ck}
    tau = arb(tau)
    n2 = u * sum(c * c for c in ck.values())
    n2p = u * sum(ck[k] ** 2 * (tau + om[k]) ** 2 for k in ck)
    def shift(a):     # <h, C_a h>
        r = acb(0)
        for k in ck:
            for l in ck:
                ph = (-I * (tau + om[l]) * a).exp()
                if k == l: integ = acb(u - a)
                else:
                    dw = om[l] - om[k]
                    integ = (1 - (I * dw * a).exp()) / (I * dw)
                r += ck[k] * ck[l] * ph * integ
        return r
    def E(c): return ((c * u).exp() - 1) / c
    def kap(w):       # <h, kappa_w h>
        r = acb(0)
        for k in ck:
            for l in ck:
                a = -(tau + om[k]); b = tau + om[l]
                E0 = acb(u) if k == l else acb(0)
                r += ck[k] * ck[l] * ((E0 - E(I * a + w)) / (I * b - w) + (E0 - E(I * b + w)) / (I * a - w))
        return r
    return n2, n2p, shift, kap

def lam(D):
    P = D.P; L = [arb(0)] * (P + 1)
    for n in range(2, P + 1):
        v = D.a[n - 1] * D.L[n - 1]
        for d in range(2, n):
            if n % d == 0: v -= L[d] * D.a[n // d - 1]
        L[n] = v
    return L

def run(name):
    t0 = time.time()
    flint.ctx.prec = PREC_Z
    a = series(name); D = DP(a); P = D.P
    flint.ctx.prec = PREC_W
    sL, sR = strip(D)
    Tmax = TS[-1]
    res = {'name': name, 'P': P, 'a_P': a[-1], 'sigma_L': sL, 'sigma_R': sR, 'rows': []}
    # cuts
    c0 = 0.3
    cuts = [-c0, c0] + [SLAB * k for k in range(1, int(Tmax / SLAB) + 1)]
    xL, xR = sL - 0.5, sR + 0.5
    H = []
    for i, y in enumerate(cuts):
        for tr in range(40):
            try:
                H.append(path_arg(D, xL, y, xR, y, 0.25)); break
            except Deep:
                y += 0.0037
        else: raise RuntimeError('cut failed')
        cuts[i] = y
    for T in TS:
        assert any(abs(c - T) < 0.2 for c in cuts)
    twopi = 2 * arb.pi()
    wind = []
    for k in range(len(cuts) - 1):
        R = path_arg(D, xR, cuts[k], xR, cuts[k + 1], 0.25)
        Lf = path_arg(D, xL, cuts[k], xL, cuts[k + 1], 0.2)
        n = (H[k] + R - H[k + 1] - Lf) / twopi
        m = n.unique_fmpz()
        if m is None: raise RuntimeError('winding not an integer ball: %s' % n)
        wind.append(int(m))
    res['winding_total_upper'] = sum(wind)
    print(name, 'strip', sL, sR, 'winding done', sum(wind), 'slabs', len(wind), 't=%.0fs' % (time.time() - t0), flush=True)
    # zeros
    dx, dy = 0.2, 0.1
    slab_z = [[] for _ in wind]
    todo = list(range(len(wind)))
    for attempt in range(4):
        if not todo: break
        lo, hi = cuts[min(todo)], cuts[max(todo) + 1]
        cand = []
        if attempt == 0: cand = float_zeros(D, sL - 0.4, sR + 0.4, lo - 0.2, hi + 0.2, dx, dy)
        else:
            for k in todo: cand.extend(float_zeros(D, sL - 0.4, sR + 0.4, cuts[k] - 0.2, cuts[k + 1] + 0.2, dx / 4 ** attempt, dy / 4 ** attempt))
        for k in todo: slab_z[k] = []
        for z in cand:
            B, ok = certify_zero(D, z)
            if not ok: continue
            for k in todo:
                if B.imag > cuts[k] and B.imag < cuts[k + 1]:
                    if not any(B.overlaps(B2) for B2 in slab_z[k]): slab_z[k].append(B)
        flint.ctx.prec = PREC_W
        todo = [k for k in todo if len(slab_z[k]) != wind[k]]
        print(name, 'attempt', attempt, 'deficient slabs', len(todo), flush=True)
    complete = not todo
    res['complete'] = complete
    res['deficient_slabs'] = [(cuts[k], cuts[k + 1], wind[k], len(slab_z[k])) for k in todo]
    # identity
    flint.ctx.prec = PREC_Z
    D.setprec(); u = D.u; LAM = lam(D)
    logaP = abs(D.a[-1]).log()
    dlog = D.df(acb(0.5)) / D.f(acb(0.5))
    res['zeros_in_strip_near_axis'] = len(slab_z[0])
    res['mean_re_first_T'] = None
    for tau in [0.0, 7.3]:
        n2, n2p, shift, kap = forms(D, tau)
        lhs = arb(0)
        for n in range(2, P):
            if LAM[n] != 0: lhs -= 2 * (LAM[n] / arb(n).sqrt() * shift(D.L[n - 1])).real
        S = arb(0); Sreg = arb(0); cnt = 0; k = 0; sumre = arb(0)
        for T in TS:
            while k < len(wind) and cuts[k + 1] <= T + 0.2:
                for B in slab_z[k]:
                    w = B - acb(0.5)
                    v = kap(w); r = 2 * n2 / w
                    mult = 1 if k == 0 else 2
                    S += mult * v.real; Sreg += mult * (v.real + r.real); cnt += mult; sumre += mult * B.real
                k += 1
            Tc = cuts[k]
            R0 = (lhs - (-u * n2 + S)) / n2
            R1 = (lhs - ((-u + logaP) * n2 + S)) / n2
            Rr = (lhs - (Sreg + 2 * n2 * dlog.real)) / n2
            p2 = (u - 2 * logaP) / arb.pi()
            row = {'tau': tau, 'T': Tc, 'zeros': cnt, 'expected_T_u_over_pi': float(Tc * u / arb.pi()),
                   'lhs_over_norm2': float(lhs / n2), 'lhs_rad': float((lhs / n2).rad()),
                   'R_V0': float(R0), 'R_V0_rad': float(R0.rad()), 'R_V1': float(R1), 'R_Vreg': float(Rr), 'R_Vreg_rad': float(Rr.rad()),
                   'R_V0_T_over_pred': float(R0 * Tc / p2), 'R_V1_T_over_pred': float(R1 * Tc / p2),
                   'R_Vreg_T3_over_pred': float(Rr * Tc ** 3 / (p2 * n2p / n2)), 'pred_tail_coeff': float(p2),
                   'mean_Re_beta': float(sumre / cnt), 'log_aP_over_u': float(logaP / u)}
            res['rows'].append(row)
            print(json.dumps(row), flush=True)
    flint.ctx.prec = PREC_W
    res['seconds'] = time.time() - t0
    return res

if __name__ == '__main__':
    names = sys.argv[1].split(',')
    if len(sys.argv) > 2: TS = [float(x) for x in sys.argv[2].split(',')]
    out = []
    for nm in names:
        r = run(nm); out.append(r)
        json.dump(r, open('runA_%s.json' % nm, 'w'), indent=1)
