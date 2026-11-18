"""Zeros of the Davenport-Heilbronn function up to height H (python-flint, 64-bit balls used as floats). MEASURED.
On-line: sign changes of the real function e^{i theta(t)} f(1/2+it). Off-line: argument principle on boxes
[-1.6,2.6] x [h,h+5] minus the on-line count, then Newton from a grid in 0.5 < Re s <= 2.6."""
import sys, json, math, cmath
from flint import dirichlet_char, acb, arb, ctx
ctx.prec = 80
H = float(sys.argv[1])
K = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
c2 = dirichlet_char(5, 2); c3 = dirichlet_char(5, 3)
A = acb(0.5, -K / 2); B = acb(0.5, K / 2)
def f(s):
    s = acb(s); return A * c2.l(s) + B * c3.l(s)
def fc(s):
    v = f(s); return complex(float(v.real.mid()), float(v.imag.mid()))
def Z(t):
    s = acb(0.5, t)
    th = float(((s + 1) / 2).lgamma().imag.mid()) + 0.5 * t * math.log(5 / math.pi)
    v = fc(complex(0.5, t)) * cmath.exp(1j * th)
    return v.real
# check reality
s = acb(0.5, 33.3); g = (acb(5) / acb.pi()) ** (s / 2) * ((s + 1) / 2).gamma(); v = g * f(s)
print('reality check Im/Re', float(v.imag.mid()) / float(v.real.mid()))
step = 0.01; n = int(H / step); on = []; pv = None; pt = None
for i in range(1, n + 1):
    t = i * step; v = Z(t)
    if pv is not None and (v > 0) != (pv > 0):
        lo, hi, vlo = pt, t, pv
        for _ in range(48):
            m = 0.5 * (lo + hi); vm = Z(m)
            if (vm > 0) == (vlo > 0): lo = m
            else: hi = m
        on.append(0.5 * (lo + hi))
    pv = v; pt = t
print('on-line zeros', len(on), flush=True)
def wind(a, b, c, d, n=160):
    pts = [complex(a + (b - a) * k / n, c) for k in range(n)]
    m = max(n, int((d - c) * 40))
    pts += [complex(b, c + (d - c) * k / m) for k in range(m)]
    pts += [complex(b - (b - a) * k / n, d) for k in range(n)]
    pts += [complex(a, d - (d - c) * k / m) for k in range(m)]
    pts.append(pts[0]); tot = 0.0; prev = fc(pts[0])
    for p in pts[1:]:
        cur = fc(p); tot += cmath.phase(cur / prev); prev = cur
    return tot / (2 * math.pi)
def newton(s):
    for _ in range(60):
        h = 1e-7; v = fc(s); dv = (fc(s + h) - fc(s - h)) / (2 * h)
        if dv == 0: return None
        ds = v / dv; s -= ds
        if abs(ds) > 3: return None
        if abs(ds) < 1e-13: return s
    return None
off = []; bad = []
h = 0.0
onset = sorted(on)
while h < H:
    c, d = h + 0.0037, min(h + 5, H) + 0.0037
    w = wind(-1.6, 2.6, c, d)
    non = sum(1 for g in onset if c < g < d)
    k = round(w) - non
    if abs(w - round(w)) > 0.05: bad.append((h, w))
    if k != 0:
        loc = []
        for re0 in (0.55, 0.65, 0.8, 1.0, 1.3, 1.7, 2.2):
            for j in range(26):
                r = newton(complex(re0, c + (d - c) * j / 25))
                if r is not None and 0.5 + 1e-7 < r.real < 2.6 and c < r.imag < d and all(abs(r - q) > 1e-7 for q in loc): loc.append(r)
        if 2 * len(loc) != k: bad.append((h, w, non, len(loc)))
        off += [[z.real, z.imag] for z in loc]
        print('box', h, 'wind', round(w, 3), 'online', non, 'offline found', [(round(z.real, 6), round(z.imag, 6)) for z in loc], flush=True)
    h += 5
json.dump(dict(H=H, online=on, offline=off, bad=bad), open('dh_zeros_%d.json' % int(H), 'w'))
print('done: online', len(on), 'offline (Re>1/2)', len(off), 'bad boxes', bad)
