#!/usr/bin/env python3
"""xcheck.py: cross-check of the certified zeros against the object of box-ly-search/cert.py (imported read-only): its F ('afep', zeta,
riesz2, N) is evaluated at the certified zero s0 (ball of radius 2^-40 from cert_zero) and at s0 + 0.01; a zero shows as
|F(s0)| / |F(s0 + 0.01)| ~ 0.  Also the winding number of F on the circle |s - s0| = 0.004 (64 points, float argument increments)."""
import sys, json, math
sys.set_int_max_str_digits(0)
sys.path.insert(0, '../box-ly-search')
from flint import arb, acb, ctx
import cert as LC
import cert_zero
def run(k, N, q, DL, sigma, tau):
    c = cert_zero.certify(k, N, q, DL, sigma, tau)
    ctx.prec = c['prec_bits'] + 200
    F = LC.make(dict(scheme='afep', input='zeta', size=N, weight=f'riesz{k}'))
    T = arb(q) / 2 ** DL
    # recompute the zero to full precision with cert_zero's Newton
    h = cert_zero.build(k, N)
    s = acb(arb(c['re_s']), T + arb(c['im_s_minus_T']))
    for _ in range(12):
        v, vp, _, _ = h(s); s = s - v / vp; s = acb(arb(s.real.mid()), arb(s.imag.mid()))
    z = lambda s: (s - arb(1) / 2) / acb(0, 1)
    f0 = F(z(s)); f1 = F(z(s + arb(1) / 100))
    ratio = abs(f0) / abs(f1)
    tot = 0.0; prev = None; first = None
    for j in range(65):
        a = 2 * math.pi * j / 64
        w = F(z(s + acb(arb(0.004 * math.cos(a)), arb(0.004 * math.sin(a))))) / f1
        ang = math.atan2(float(w.imag.mid()), float(w.real.mid()))
        if prev is not None:
            tot += (ang - prev + math.pi) % (2 * math.pi) - math.pi
        prev = ang
    return dict(k=k, N=N, T_log10=c['T_log10'], re_s=c['re_s'], ratio_F_at_zero=float(ratio.upper()), winding_number=round(tot / (2 * math.pi), 6))
if __name__ == '__main__':
    print(json.dumps(run(2, 959, 48686999780750483929, 10, 0.5195, -0.058)))
    print(json.dumps(run(2, 959, 79380711440070368642620, 10, 0.5394163360904304, 0.020695152687437112)))
