# Certified isolation of all real zeros in [T0,T1] of Z_A, Z_B and W = Z_A Z_B' - Z_A' Z_B
# (critical points of R = B/A on the critical line). Taylor models + interval bisection (Arb).
import sys, json, time
from lib import *
ctx.prec = 128
T0, T1 = float(sys.argv[1]), float(sys.argv[2]); out = sys.argv[3]
H = float(sys.argv[4]) if len(sys.argv) > 4 else 0.01   # panel half-width
N = int(sys.argv[5]) if len(sys.argv) > 5 else 10

def model(mid, H=None):
    H = H if H is not None else globals()['H']
    """Taylor models on [mid-H, mid+H] for ZA, ZB and derivatives up to 2."""
    pa, pb, _ = hardy(arb(mid), N)           # exact midpoint jets c_0..c_{N-1}
    wa, wb, _ = hardy(arb(mid, H), N + 1)    # wide jets: coefficient N encloses f^(N)/N! on panel
    ca = pa + [wa[N]]; cb = pb + [wb[N]]
    def der(c, j):
        r = []
        for k in range(len(c) - j):
            f = 1
            for i in range(1, j + 1): f *= (k + i)
            r.append(c[k + j] * f)
        return r
    return [der(ca, j) for j in range(3)], [der(cb, j) for j in range(3)]

def horner(c, x):
    r = arb(0)
    for a in reversed(c): r = r * x + a
    return r

def ball(lo, hi): return arb((lo + hi) / 2, (hi - lo) / 2 * (1 + 1e-12) + 1e-300)

def sgn(v):
    if v > 0: return 1
    if v < 0: return -1
    return 0

def isolate(g, dg, lo, hi, res, flags, depth=0):
    X = ball(lo, hi)
    G = g(X)
    if not G.contains(0): return
    D = dg(X)
    if not D.contains(0):
        sl, sh = sgn(g(arb(lo))), sgn(g(arb(hi)))
        if sl and sh:
            if sl * sh < 0: res.append((lo, hi))
            return
    if hi - lo < 1e-9 or len(flags) > 50:
        flags.append((lo, hi)); return
    m = (lo + hi) / 2
    isolate(g, dg, lo, m, res, flags, depth + 1); isolate(g, dg, m, hi, res, flags, depth + 1)

def direct(kind, t):
    ZA, ZB, _ = hardy(t, 2)
    if kind == 'a': return ZA[0]
    if kind == 'b': return ZB[0]
    return ZA[0] * ZB[1] - ZA[1] * ZB[0]

def refine(kind, lo, hi):
    """root is unique in [lo,hi] (certified monotone). Bisect with direct evaluations."""
    sl = sgn(direct(kind, arb(lo))); sh = sgn(direct(kind, arb(hi)))
    assert sl * sh < 0, (kind, lo, hi)
    for _ in range(60):
        m = (lo + hi) / 2
        if not (lo < m < hi): break
        s = sgn(direct(kind, arb(m)))
        if s == 0: break
        if s == sl: lo = m
        else: hi = m
    return lo, hi

roots = {'a': [], 'b': [], 'w': []}; flags = {'a': [], 'b': [], 'w': []}
t0 = time.time()
def finite(cs): return all(c.is_finite() for c in cs)
def panel(mid, h):
    (a0, a1, a2), (b0, b1, b2) = model(mid, h)
    if not (finite(a0) and finite(b0)):
        if h < 1e-4: flags['a'].append((mid - h, mid + h, 'nonfinite')); return
        panel(mid - h / 2, h / 2); panel(mid + h / 2, h / 2); return
    fa = lambda x: horner(a0, x); fa1 = lambda x: horner(a1, x)
    fb = lambda x: horner(b0, x); fb1 = lambda x: horner(b1, x)
    fw = lambda x: horner(a0, x) * horner(b1, x) - horner(a1, x) * horner(b0, x)
    fw1 = lambda x: horner(a0, x) * horner(b2, x) - horner(a2, x) * horner(b0, x)
    for kind, g, dg in (('a', fa, fa1), ('b', fb, fb1), ('w', fw, fw1)):
        r = []; f = []
        isolate(g, dg, -h, h, r, f)
        for lo, hi in r: roots[kind].append(refine(kind, mid + lo, mid + hi))
        for lo, hi in f: flags[kind].append((mid + lo, mid + hi))
    # panel edge sign definiteness (no root exactly on an edge)
    for kind, g in (('a', fa), ('b', fb), ('w', fw)):
        if sgn(g(arb(-h))) == 0 or sgn(g(arb(h))) == 0: flags[kind].append((mid - h, mid + h, 'edge'))
npan = int(round((T1 - T0) / (2 * H)))
for i in range(npan):
    panel(T0 + (2 * i + 1) * H, H)
# values of R at critical points
crit = []
for lo, hi in roots['w']:
    t = ball(lo, hi)
    ZA, ZB, _ = hardy(t, 1)
    Rv = ZB[0] / ZA[0]
    crit.append({'lo': lo, 'hi': hi, 'R_mid': float(Rv.mid()), 'R_rad': float(Rv.rad())})
json.dump({'T0': T0, 'T1': T1, 'H': H, 'a': roots['a'], 'b': roots['b'], 'w': crit, 'flags': flags,
           'secs': time.time() - t0}, open(out, 'w'))
print(T0, T1, len(roots['a']), len(roots['b']), len(crit), str(flags)[:300], round(time.time() - t0, 1))
