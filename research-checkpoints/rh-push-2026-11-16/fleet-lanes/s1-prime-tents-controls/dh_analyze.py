#!/usr/bin/env python3
"""DH control: tents from the directly computed Lambda_DH sums (n <= 6e8) and from the explicit formula with the
battery zero table (height <= 2000; 1861 on-line, 84 off-line pairs). usage: dh_analyze.py dh.txt lists.json zeros_DH.json out.json"""
import sys, json, math
import numpy as np, mpmath as mp
mp.mp.dps = 30
rows = {}
for l in open(sys.argv[1]):
    t = l.split(); x = int(t[0]); rows[x] = float(mp.mpf(x) * mp.mpf(t[1]) - mp.mpf(t[2]))
lists = json.load(open(sys.argv[2])); z = json.load(open(sys.argv[3]))
on = np.array([float(g) for g in z['online']]); off = [(float(b), float(g)) for b, g, _ in z['offline']]
rho_on = 0.5 + 1j * on
rho_off = np.array([b + 1j * g for b, g in off] + [1 - b + 1j * g for b, g in off])
def ef(N, knots, coef, rho):
    # -(1/N^{3/2}) sum_rho N^{rho+1} Q(rho)/(rho(rho+1)), Q(rho) = sum_j coef_j knot_j^{rho+1}; conjugates included by 2 Re
    Q = sum(c * np.exp((rho + 1) * math.log(k)) for c, k in zip(coef, knots))
    return float(-2 * np.sum((np.exp((rho - 0.5) * math.log(N)) * Q / (rho * (rho + 1))).real))
TENTS = {'T88': ([1, 2, 4], [2, -3, 1], lambda N: (N, 2 * N, 4 * N)),
         'T91': ([81, 153, 289], [17, -26, 9], lambda N: (81 * N, 153 * N, 289 * N)),
         'T93': ([225, 345, 529], [23, -38, 15], lambda N: (225 * N, 345 * N, 529 * N))}
RES = {'zeros': dict(H=z['H'], online=len(on), offline_pairs=len(off), max_beta=max(off), first=off[0])}
for name, (kn, co, pts) in TENTS.items():
    Ns = [N for N in lists[name] if all(p in rows for p in pts(N)) and N >= 30]
    direct = np.array([-sum(c * rows[p] for c, p in zip(co, pts(N))) / N ** 1.5 for N in Ns])   # m = -T/N^{3/2}
    e_all = np.array([-ef(N, kn, co, np.concatenate([rho_on, rho_off])) for N in Ns])
    e_on = np.array([-ef(N, kn, co, rho_on) for N in Ns]); e_off = e_all - e_on
    Nf = np.array(Ns, dtype=float)
    dec = []
    for d in range(1, 10):
        m_ = (Nf >= 10 ** d) & (Nf < 10 ** (d + 1))
        if m_.any(): dec.append(dict(decade=d, count=int(m_.sum()), direct_min=float(direct[m_].min()), direct_max=float(direct[m_].max()), ef_minus_direct_rms=float(np.sqrt(np.mean((e_all[m_] - direct[m_]) ** 2))),
                                     online_part_max_abs=float(np.abs(e_on[m_]).max()), offline_part_max_abs=float(np.abs(e_off[m_]).max())))
    # extrapolation by the explicit formula (zeros of height <= 2000 only)
    ext = []
    for d in range(2, 41):
        g = 10 ** np.linspace(d, d + 1, 400, endpoint=False)
        a_on = np.array([abs(ef(N, kn, co, rho_on)) for N in g]); a_off = np.array([abs(ef(N, kn, co, rho_off)) for N in g])
        ext.append(dict(decade=d, online_max_abs=float(a_on.max()), offline_max_abs=float(a_off.max())))
    cross = next((e['decade'] for e in ext if e['offline_max_abs'] > e['online_max_abs']), None)
    cross3 = next((e['decade'] for e in ext if e['offline_max_abs'] > 3 * e['online_max_abs']), None)
    RES[name] = dict(n=len(Ns), Nmax=Ns[-1], direct_decades=dec, ef_extrapolation=ext, first_decade_offline_exceeds_online=cross, first_decade_offline_exceeds_3x_online=cross3)
gx = np.array([x for x in lists['GRID'] if x in rows and x >= 10], dtype=float); gv = np.array([rows[int(x)] for x in gx])
tri = []
for d in range(1, 10):
    m_ = (gx >= 10 ** d) & (gx < 10 ** (d + 1))
    if m_.any(): tri.append(dict(decade=d, max_abs_F_over_x158=float(np.abs(gv[m_] / gx[m_] ** 1.875).max()), max_F_over_x32=float((gv[m_] / gx[m_] ** 1.5).max()), min_F_over_x32=float((gv[m_] / gx[m_] ** 1.5).min())))
RES['Triangular'] = tri
print('triangular', tri)
json.dump(RES, open(sys.argv[4], 'w'), indent=0)
for name in TENTS:
    r = RES[name]; print(name, 'Nmax', r['Nmax'], 'cross decade', r['first_decade_offline_exceeds_online'], r['first_decade_offline_exceeds_3x_online'])
    for d in r['direct_decades']: print('  ', d)
    print('   ext', [(e['decade'], round(e['online_max_abs'], 3), round(e['offline_max_abs'], 3)) for e in r['ef_extrapolation'][::3]])
