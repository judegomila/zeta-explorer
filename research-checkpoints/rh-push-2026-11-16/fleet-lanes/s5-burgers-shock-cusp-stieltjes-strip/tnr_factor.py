"""T-NR = xi(s) (2 cosh((s-1/2) log q) + c): the local factor adds (1/2) Re[log q * 2 sinh(u)/(2 cosh(u) + c)], u = (delta + i t) log q, to M (full zero set).
Closed form, no data. Off-line zeros of the factor: b = arccosh(c/2)/log q, ordinates (2k+1) pi/log q."""
import numpy as np, math, json, os
out = {}
for q, c in ((1000003.0, 2.2), (3.0, 2.2)):
    lq = math.log(q); b = math.acosh(c / 2) / lq; ph = np.linspace(0, 2 * math.pi, 200001); rows = {}
    for de in (0.0825, 0.165, 0.2, 0.5):
        u = de * lq + 1j * ph; v = 0.5 * (lq * 2 * np.sinh(u) / (2 * np.cosh(u) + c)).real
        rows['Y%g' % (2 * de)] = dict(min=float(v.min()), max=float(v.max()), mean=float(v.mean()), reading_line_right_of_factor_zeros=bool(de > b))
    out['q%g_c%g' % (q, c)] = dict(b=b, Y_of_b=2 * b, first_offline_ordinate=math.pi / lq, spacing=2 * math.pi / lq, added_mass=rows)
    print(q, c, json.dumps(out['q%g_c%g' % (q, c)]))
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', 'c4_tnr_factor.json'), 'w'), indent=1)
