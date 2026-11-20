"""Control (a): off-line zeros in s of the Epstein zeta at a boundary point (default z = i sqrt5, form [1,0,5], h=2);
W on a small circle around the first one; predicted half-plane direction."""
import sys, math, cmath, json
from elib import *
x0 = float(sys.argv[1]); y0 = float(sys.argv[2]); tag = sys.argv[3]
def f(sg, t): return Eis(sg, t).F(x0, y0)
sigs = [0.505 + 0.025 * k for k in range(21)]; ts = [10 + 0.1 * k for k in range(401)]
g = [[f(a, b) for b in ts] for a in sigs]
zs = []
for i in range(len(sigs) - 1):
    for j in range(len(ts) - 1):
        c = [g[i][j], g[i + 1][j], g[i + 1][j + 1], g[i][j + 1]]
        w = round(sum(cmath.phase(c[(k + 1) % 4] / c[k]) for k in range(4)) / (2 * PI))
        if w:
            s = complex(sigs[i] + 0.0125, ts[j] + 0.05)
            for _ in range(40):
                h = 1e-6
                v = f(s.real, s.imag); d = (f(s.real + h, s.imag) - f(s.real - h, s.imag)) / (2 * h)
                ds = -v / d; s += ds
                if abs(ds) < 1e-12: break
            zs.append((s, abs(f(s.real, s.imag))))
print(tag, "off-line zeros in 0.505<sigma<1.005, 10<t<50:", len(zs))
for s, r in zs: print("   s = %.8f + %.8f i   |F| = %.1e" % (s.real, s.imag, r))
out = {"tag": tag, "zeros": [[s.real, s.imag] for s, r in zs]}
if zs:
    s0 = zs[0][0]; E = Eis(s0.real, s0.imag); h = 1e-4
    Fy = (E.F(x0, y0 + h) - E.F(x0, y0 - h)) / (2 * h)
    Fxx = (E.F(x0 + h, y0) - 2 * E.F(x0, y0) + E.F(x0 - h, y0)) / h ** 2
    hs = 1e-6
    Fs = (f(s0.real + hs, s0.imag) - f(s0.real - hs, s0.imag)) / (2 * hs)
    # x^2/2 = -Im(conj(Fy) Fs delta)/Im(conj(Fy) Fxx) > 0  defines the half-plane of delta = s - s0 with an interior zero nearby
    den = (Fy.conjugate() * Fxx).imag
    print("first zero s0 =", s0, " Fy =", Fy, " Fxx =", Fxx, " Fs =", Fs)
    print("predicted boundary direction arg(delta) mod pi =", (cmath.phase(-(Fy / Fs)) % PI), "rad")
    r = 0.004; ws = []
    for k in range(24):
        th = 2 * PI * (k + 0.5) / 24; d = r * cmath.exp(1j * th); s = s0 + d
        Ek = Eis(s.real, s.imag); W, mn, info, per = winding(Ek, 3 + s.imag / PI)
        pred = -((Fy.conjugate() * Fs * d).imag) / den > 0
        ws.append((th, W, pred))
        print("   theta=%.3f  W=%.4f  predicted interior zero near anchor: %s" % (th, W, pred))
    out["circle"] = ws; out["s0"] = [s0.real, s0.imag]
json.dump(out, open("control_%s.json" % tag, "w"))
