"""Node tables for the lane: zero ordinates of each object (floats, 30 digits kept as strings where copied).
Copied as data from c12-control-battery-harness/tables (zeta, DH, HEAT); L(chi_-4), L(chi_5) computed here (sign changes of Hardy Z, step 0.01,
count checked against the main term of N(T)); EA, TNR(q), WT by their rules."""
import json, math, sys, os
from flint import arb, acb, ctx, dirichlet_char
T = sys.argv[1]; H = float(sys.argv[2]) if len(sys.argv) > 2 else 2000.0
ctx.prec = 80
def lz(q, n, par):
    chi = dirichlet_char(q, n)
    f = lambda t: float(chi.hardy_z(acb(t)).real.mid())
    zs = []; step = 0.01; t = 0.005; fa = f(t)
    while t < H:
        t2 = t + step; fb = f(t2)
        if fa * fb < 0:
            lo, hi, flo = t, t2, fa
            for _ in range(60):
                m = (lo + hi) / 2; fm = f(m)
                if flo * fm <= 0: hi = m
                else: lo, flo = m, fm
            zs.append((lo + hi) / 2)
        t, fa = t2, fb
    # count check: N(T) = (T/pi) log(qT/(2 pi e)) + O(log)  (zeros with 0 < gamma < T: half of the two-sided count)
    main = (H / (2 * math.pi)) * math.log(q * H / (2 * math.pi * math.e))
    return zs, main
out = {}
z = json.load(open(os.path.join(T, 'zeros_ZETA_2H.json'))); out['ZETA'] = dict(online=[float(g) for g in z['gamma']], offline=[], H=4000.0)
d = json.load(open(os.path.join(T, 'zeros_DH.json'))); out['DH'] = dict(online=[float(g) for g in d['online']], offline=[[float(b), float(g)] for b, g, *r in d["offline"]], H=2000.0)
for tau in ['-0.1', '-0.5']:
    h = json.load(open(os.path.join(T, 'zeros_HEAT-%s.json' % tau)))
    out['HEAT' + tau] = dict(online=[float(g) for g in h['online']], offline=[[0.5 + float(b), float(g)] for b, g, *r in h["offline"]], H=2000.0)
for q, n, name in [(4, 3, 'LCHI4'), (5, 4, 'LCHI5')]:
    zs, main = lz(q, n, 0)
    out[name] = dict(online=zs, offline=[], H=H, count=len(zs), count_main_term=main)
    print(name, len(zs), main, zs[:3], flush=True)
json.dump(out, open('nodes.json', 'w'))
