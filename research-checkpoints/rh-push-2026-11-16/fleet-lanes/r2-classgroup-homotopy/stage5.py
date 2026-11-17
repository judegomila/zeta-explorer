# MEASURED: follow each off-line pair from its leaving point along the level curve Im R = 0 until it rejoins the line
# or escapes to Re s -> +infinity (possible only on the Z_2 side, where R -> 1).   ds/du = 1/D(s), u = log|R|, D = R'/R.
import json, glob, math, sys
from lib import *
ctx.prec = 64
TLIM = float(sys.argv[1]) if len(sys.argv) > 1 else 120.0
def RD(s):
    x = acb_series([acb(s.real, s.imag), acb(1)], prec=2)
    z = x.zeta(); l20 = acb_series.dirichlet_l(x, CHI_M20); l5 = acb_series.dirichlet_l(x, CHI_5); l4 = acb_series.dirichlet_l(x, CHI_M4)
    A = (z * l20).coeffs(); B = (l5 * l4).coeffs()
    return complex(B[0] / A[0]), complex(B[1] / B[0] - A[1] / A[0])
tab = json.load(open('stage3_table.json'))
events = {}
for r in tab['a']:
    for side in ('Z1side', 'Z2side'):
        v = r[side]
        if v and v['kind'] == 'collision' and 0 < v['t_c'] < TLIM: events[(side, round(v['t_c'], 9))] = v
rej = {}
for r in tab['b']:
    for side in ('Z1side', 'Z2side'):
        v = r[side]
        if v and v['kind'] == 'collision': rej[(side, round(v['t_c'], 6))] = v
out = []
for (side, tc), v in sorted(events.items(), key=lambda x: x[0][1]):
    m = v['absR']; sgn = -1 if side == 'Z1side' else 1
    s = complex(0.5 + 2e-3, tc)
    # Newton onto the level curve Im R = 0 near the start, keeping Re s fixed is not needed: project by one complex Newton step to R = real part
    R, D = RD(s); u = math.log(abs(R)); smax = s.real; status = 'lost'; steps = 0
    while steps < 20000:
        steps += 1
        R, D = RD(s)
        # corrector: remove imaginary part of R (stay on the real locus), keep |R|
        tgt = sgn * abs(R)
        s = s - (R - tgt) / (R * D)
        R, D = RD(s)
        h = -min(0.05, 0.02 * abs(D))          # step in u: |ds| <= 0.02
        if side == 'Z2side' and abs(R) < 1 + 1e-9 and s.real > 3: status = 'escape'; break
        k1 = 1 / D
        R2, D2 = RD(s + 0.5 * h * k1); k2 = 1 / D2
        s = s + h * k2
        smax = max(smax, s.real)
        if s.real > 6: status = 'escape to +inf (R->1)'; break
        if s.real < 0.5 + 1e-4 and steps > 5:
            status = 'rejoin'; break
        if abs(R) < 1e-7: status = 'R->0 (reaches zero of B?)'; break
    R, D = RD(s)
    rec = {'side': side, 't_leave': tc, 'cot_leave': m, 'phi_leave': math.atan2(1, m) if side == 'Z1side' else math.pi - math.atan2(1, m),
           'status': status, 'max_re': smax, 't_end': s.imag, 'absR_end': abs(R), 'steps': steps}
    if status == 'rejoin':
        # nearest certified bb critical point on that side
        best = min((abs(k[1] - s.imag), k, vv) for k, vv in rej.items() if k[0] == side)
        rec['t_rejoin'] = best[2]['t_c']; rec['cot_rejoin'] = best[2]['absR']; rec['match_err'] = best[0]
        rec['phi_rejoin'] = math.atan2(1, best[2]['absR']) if side == 'Z1side' else math.pi - math.atan2(1, best[2]['absR'])
    out.append(rec)
    print('%s leave t=%.5f phi=%.5f -> %s  max Re=%.4f  %s' % (side, tc, rec['phi_leave'], status, smax,
          ('rejoin t=%.5f phi=%.5f (|dt|=%.1e)' % (rec['t_rejoin'], rec['phi_rejoin'], rec['match_err'])) if status == 'rejoin' else 't_end=%.4f |R|=%.4g' % (s.imag, abs(R))), flush=True)
json.dump(out, open('stage5_tracks.json', 'w'), indent=1)
