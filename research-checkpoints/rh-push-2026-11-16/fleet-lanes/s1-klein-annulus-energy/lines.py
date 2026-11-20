"""s1-klein-annulus-energy: shared line data.
For an object F (completed, F(z) with s = 1/2 + z, F(-z) = F(z), real on the real axis) write F = g * A with g an
explicit gamma-type factor and A the arithmetic part.  On vertical lines Re z = x, on a uniform grid y_j = y0 + j dy,
compute A (python-flint, prec bits) and from it by 8th-order central stencils in y:
   L = F'/F (x > 0), logabs = log|F|,  and on x = 0 the zero-safe Laguerre data (lag = Xi'^2 - Xi Xi'')/|g|^2 etc.
Output npz per (object, window).  MEASURED float64 output; A is evaluated in ball arithmetic and rounded.
Version 2 (exact abscissae): the server datasets without the suffix _exact were computed with float abscissae (version 1).
usage: lines.py OBJ T0 ELL DY PAD OUT [x1,x2,...]
"""
import sys, os, math, time, json
import numpy as np
from multiprocessing import Pool

XS_DEFAULT = [0.0, 0.05, 0.1, 0.25, 0.5]
LOGPI = math.log(math.pi)

# ---------- arithmetic parts (worker side) ----------
def _init(code, prec, y0s='0', dys='0'):
    global CODE, OBJ, Y0S, DYS
    Y0S = y0s; DYS = dys
    from flint import ctx
    ctx.prec = prec
    CODE = code
    OBJ = None
    if code.startswith('HEAT'):
        import heatlib
        tau = float(code.split(':')[1]); tmax = float(code.split(':')[2])
        bits = int(64 + 1.45 * (math.pi * tmax / 4) + 60)
        OBJ = (heatlib.Heat(bits, tmax + 5), tau)

def _arith(z):
    """A(z) as python complex; z = (x, y)"""
    from flint import acb, arb
    x, j = z
    # exact abscissa y_j = y0 + j dy (decimal strings -> arb).  A float y has absolute rounding 1e-9 at height 1e7, which the
    # second-difference stencil amplifies by 1/dy^2 (found on the first pass: noise in -theta' proportional to the height).
    y = arb(Y0S) + j * arb(DYS)
    s = acb(arb(1) / 2 + arb(x), y)
    c = CODE
    if c == 'ZETA':
        v = s.zeta()
    elif c == 'LCHI3':
        v = (s.zeta(arb(1) / 3) - s.zeta(arb(2) / 3)) * (-s * arb(3).log()).exp()
    elif c == 'LCHI4':
        v = (s.zeta(arb(1) / 4) - s.zeta(arb(3) / 4)) * (-s * arb(4).log()).exp()
    elif c == 'DH':
        r5 = arb(5).sqrt(); k = ((10 - 2 * r5).sqrt() - 2) / (r5 - 1)
        v = (s.zeta(arb(1) / 5) + k * s.zeta(arb(2) / 5) - k * s.zeta(arb(3) / 5) - s.zeta(arb(4) / 5)) * (-s * arb(5).log()).exp()
    elif c.startswith('EA'):
        num, den = c.split(':')[1].split('/'); a = arb(int(num)) / int(den)
        v = (s + a).zeta() * (s - a).zeta()
    elif c.startswith('TNR'):
        q = 3; cc = arb('2.2')
        lq = arb(q).log()
        v = s.zeta() * (1 + cc * ((arb(1) / 2 - s) * lq).exp() + ((1 - 2 * s) * lq).exp())
    elif c.startswith('HEAT'):
        H, tau = OBJ
        zz = acb(arb(x), y)
        v = H.F(tau, zz) * (-acb(0, 1) * arb.pi() * zz / 4).exp()
    else:
        raise KeyError(c)
    return complex(float(v.real.mid()), float(v.imag.mid()))

def _chunk(args):
    return [_arith(z) for z in args]

# ---------- gamma factors (vectorised) ----------
def _trigamma(z):
    z = np.asarray(z, dtype=complex); acc = np.zeros_like(z)
    for k in range(12):
        acc += 1 / (z + k) ** 2
    w = z + 12
    return acc + 1 / w + 1 / (2 * w ** 2) + 1 / (6 * w ** 3) - 1 / (30 * w ** 5) + 1 / (42 * w ** 7) - 1 / (30 * w ** 9) + 5 / (66 * w ** 11)

def gamma_parts(code, s):
    """returns (log|g|, g'/g, (g'/g)') at complex array s"""
    from scipy.special import loggamma, digamma
    def G(u):   # Gamma(u): log|.|, psi, psi'
        return loggamma(u).real, digamma(u), _trigamma(u)
    if code == 'ZETA' or code.startswith('TNR'):
        lg, ps, tg = G(s / 2)
        la = np.log(abs(s)) + np.log(abs(s - 1)) - s.real / 2 * LOGPI + lg
        l1 = 1 / s + 1 / (s - 1) - LOGPI / 2 + ps / 2
        l2 = -1 / s ** 2 - 1 / (s - 1) ** 2 + tg / 4
        if code.startswith('TNR'):
            la = la + s.real * math.log(3); l1 = l1 + math.log(3)
        return la, l1, l2
    if code in ('LCHI3', 'LCHI4', 'DH'):
        q = {'LCHI3': 3, 'LCHI4': 4, 'DH': 5}[code]
        lg, ps, tg = G((s + 1) / 2)
        if code == 'DH':
            la = s.real / 2 * math.log(q / math.pi) + lg
        else:
            la = (s.real + 1) / 2 * math.log(q / math.pi) + lg
        return la, math.log(q / math.pi) / 2 + ps / 2, tg / 4
    if code.startswith('EA'):
        a = float(eval(code.split(':')[1]))
        la = 0; l1 = 0; l2 = 0
        for u in (s + a, s - a):
            lg, ps, tg = G(u / 2)
            la = la + np.log(abs(u)) + np.log(abs(u - 1)) - u.real / 2 * LOGPI + lg
            l1 = l1 + 1 / u + 1 / (u - 1) - LOGPI / 2 + ps / 2
            l2 = l2 - 1 / u ** 2 - 1 / (u - 1) ** 2 + tg / 4
        return la, l1, l2
    if code.startswith('HEAT'):
        z = s - 0.5
        return (1j * math.pi * z / 4).real, np.full(s.shape, 1j * math.pi / 4), np.zeros(s.shape, dtype=complex)
    raise KeyError(code)

# ---------- stencils ----------
C1 = np.array([1 / 280, -4 / 105, 1 / 5, -4 / 5, 0, 4 / 5, -1 / 5, 4 / 105, -1 / 280])
C2 = np.array([-1 / 560, 8 / 315, -1 / 5, 8 / 5, -205 / 72, 8 / 5, -1 / 5, 8 / 315, -1 / 560])
def d1(f, dy):
    n = len(f); out = np.zeros(n - 8, dtype=f.dtype)
    for k in range(9): out += C1[k] * f[k:n - 8 + k]
    return out / dy
def d2(f, dy):
    n = len(f); out = np.zeros(n - 8, dtype=f.dtype)
    for k in range(9): out += C2[k] * f[k:n - 8 + k]
    return out / dy ** 2

def compute(code, T0, ell, dy, pad, xs=XS_DEFAULT, workers=None, prec=None):
    prec = prec or int(os.environ.get('RH_PREC', '64'))
    workers = workers or int(os.environ.get('RH_WORKERS', '4'))
    n = int(round((ell + 2 * pad) / dy)) + 1 + 8
    y = T0 - pad - 4 * dy + dy * np.arange(n)
    print('lines: %s window [%g,%g] dy %g pad %g: %d points x %d lines = %d evaluations; arrays %.1f MB'
          % (code, T0, T0 + ell, dy, pad, n, len(xs), n * len(xs), n * len(xs) * 16 * 6 / 1e6), flush=True)
    from decimal import Decimal
    y0s = str(Decimal(repr(float(T0))) - Decimal(repr(float(pad))) - 4 * Decimal(repr(float(dy)))); dys = repr(float(dy))
    assert abs(float(y0s) - y[0]) < 1e-6 * max(1.0, abs(y[0]))
    pts = [(x, j) for x in xs for j in range(n)]
    csz = max(16, min(2000, len(pts) // (workers * 8) + 1))
    chunks = [pts[i:i + csz] for i in range(0, len(pts), csz)]
    t0 = time.time()
    with Pool(workers, initializer=_init, initargs=(code, prec, y0s, dys)) as p:
        res = p.map(_chunk, chunks, chunksize=1)
    A = np.array([v for c in res for v in c], dtype=complex).reshape(len(xs), n)
    print('lines: evaluated in %.1f s' % (time.time() - t0), flush=True)
    out = dict(y=y[4:-4], xs=np.array(xs), dy=dy, T0=T0, ell=ell, pad=pad, code=code)
    for i, x in enumerate(xs):
        Ai = A[i]; Ay = d1(Ai, dy); Ayy = d2(Ai, dy); Ac = Ai[4:-4]
        s = 0.5 + x + 1j * y[4:-4]
        la, l1, l2 = gamma_parts(code, s)
        key = 'x%g' % x
        out[key + '_A'] = Ac
        out[key + '_logabs'] = la + np.log(np.abs(Ac))
        if x == 0.0:
            # Xi(y) = F(iy) = g A ; y-derivatives: g_y/g = i l1, g_yy/g = -(l1^2 + l2)
            P1 = 1j * l1 * Ac + Ay
            P2 = -(l1 ** 2 + l2) * Ac + 2j * l1 * Ay + Ayy
            out['x0_P1'] = P1; out['x0_P2'] = P2      # Xi'/g, Xi''/g
        else:
            L = l1 + (-1j) * Ay / Ac
            Lp = l2 - Ayy / Ac + (Ay / Ac) ** 2        # dL/dz = l2 + d/dz(A'/A), A' = -i A_y, A'' = -A_yy
            out[key + '_L'] = L; out[key + '_Lp'] = Lp
    return out

if __name__ == '__main__':
    code = sys.argv[1]; T0 = float(sys.argv[2]); ell = float(sys.argv[3]); dy = float(sys.argv[4]); pad = float(sys.argv[5]); outf = sys.argv[6]
    xs = [float(v) for v in sys.argv[7].split(',')] if len(sys.argv) > 7 else XS_DEFAULT
    o = compute(code, T0, ell, dy, pad, xs)
    np.savez(outf, **o)
    print('wrote', outf, flush=True)
