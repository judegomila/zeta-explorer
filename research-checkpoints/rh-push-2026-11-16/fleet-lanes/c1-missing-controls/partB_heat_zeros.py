"""Part B, step 1: zeros of the backward heat family F_tau, tau in {-0.1,-0.5,-2}: sign changes on the critical line and
   off-line zeros (Newton from seeds at close pairs of zeta zeros). MEASURED."""
import json, math, sys, time
from heatlib import *
zz = json.load(open('zeta_zeros_900.json'))
def scan(H, tau, a, b, step):
    n = int(round((b - a) / step)); sc = []; prev = None; pt = None
    for i in range(n + 1):
        t = a + i * step; v = H.Freal_axis(tau, t); s = 1 if v.mid() > 0 else -1
        if prev is not None and s != prev: sc.append((pt + t) / 2)
        prev = s; pt = t
    return sc
def offline(H, tau, a, b):
    found = []
    for i in range(len(zz) - 1):
        g1, g2 = zz[i], zz[i + 1]
        if g2 < a or g1 > b: continue
        d = g2 - g1
        if d * d / 2 > 3.0 * abs(tau) + 0.05: continue
        dg = 0.5 * math.sqrt(max(2 * (abs(tau) - d * d / 2), 0.02))
        for seed in (acb(dg, (g1 + g2) / 2), acb(dg / 3 + 0.02, (g1 + g2) / 2)):
            z, err = H.newton(tau, seed)
            re, im = float(z.real.mid()), float(z.imag.mid())
            if err < 1e-20 and abs(re) > 1e-9 and a <= im <= b:
                re = abs(re)
                if not any(abs(re - f[0]) < 1e-8 and abs(im - f[1]) < 1e-8 for f in found):
                    found.append((re, im, z.real.str(25) if z.real.mid() > 0 else (-z.real).str(25), z.imag.str(25), [g1, g2]))
    return sorted(found, key=lambda f: f[1])
if __name__ == '__main__':
    out = {}
    t0 = time.time()
    jobs = [('low', 500, 232.0, [(-0.1, 1.0, 230.0), (-0.5, 1.0, 230.0), (-2.0, 1.0, 230.0), (0.0, 1.0, 230.0)]),
            ('high', 1000, 600.0, [(-0.1, 405.0, 425.0), (-0.1, 532.0, 572.0), (0.0, 405.0, 425.0), (0.0, 532.0, 572.0)])]
    for name, bits, tmax, wins in jobs:
        H = Heat(bits, tmax)
        for tau, a, b in wins:
            sc = scan(H, tau, a, b, 0.01)
            off = offline(H, tau, a, b) if tau < 0 else []
            nz = sum(1 for g in zz if a < g < b)
            rec = dict(tau=tau, window=[a, b], sign_changes=len(sc), zeta_zeros_in_window=nz, offline_upper_right=[dict(delta=f[2], gamma=f[3], parent_pair=f[4]) for f in off],
                       total_count=len(sc) + 2 * len(off), first_sign_changes=[round(x, 3) for x in sc[:6]])
            out['%s_%g_%g' % (name, tau, a)] = rec
            print(json.dumps(rec), 'elapsed', round(time.time() - t0), flush=True)
            json.dump(out, open('partB_heat_zeros.json', 'w'), indent=1)
