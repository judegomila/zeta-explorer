"""Derived zero tables and non-vanishing sanity checks. Usage: python derive.py <tables>"""
import os, sys, json, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from flint import acb, arb, ctx
import core
tables = sys.argv[1]; ctx.prec = 128
Z = json.load(open(os.path.join(tables, 'zeros_ZETA.json'))); G = Z['gamma']; H = Z['H']
Z2 = json.load(open(os.path.join(tables, 'zeros_ZETA_2H.json')))['gamma']
def s30(x): return x.str(32, radius=False)
def resid(obj, pts, n=40):
    step = max(1, len(pts) // n)
    return max(float(abs(obj.value(acb(arb(p[0]), arb(p[1])))).upper()) for p in pts[::step])
out = {}
for num, den in ((1, 8), (1, 4), (1, 2)):
    o = core.EA(num, den); a = o.a
    zs = [[s30(arb(1) / 2 + a), g] for g in G] + [[s30(arb(1) / 2 - a), g] for g in G]
    json.dump(dict(object=o.code, H=H, rule='rho + a and rho - a for the zeta zeros rho (all on the line below H): real parts 1/2 + a and 1/2 - a', count=len(zs),
                   max_abs_value_at_sampled_zeros=resid(o, zs), zeros=zs), open(os.path.join(tables, 'zeros_%s.json' % o.code.replace('/', '_')), 'w'))
    out[o.code] = len(zs)
o = core.TNR(); beta = o.beta(); lq = arb(o.q).log()
dz = []
k = 0
while True:
    h = arb.pi() * (2 * k + 1) / lq
    if h > H: break
    dz.append([s30(beta), s30(h)]); dz.append([s30(1 - beta), s30(h)]); k += 1
json.dump(dict(object='TNR', H=H, rule='zeta zeros (on the line) and the zeros of the local factor: 1/2 +- arccosh(c/2)/log q + i pi (2k+1)/log q', online=G, offline_local_factor=dz,
               max_abs_value_at_sampled_local_zeros=resid(o, dz), max_abs_value_at_sampled_zeta_zeros=resid(o, [['0.5', g] for g in G])), open(os.path.join(tables, 'zeros_TNR.json'), 'w'))
out['TNR'] = (len(G), len(dz))
o = core.WT(); al = o.alpha()
up = [s30(arb(g) - al) for g in G]; dn = [s30(-arb(g) - al) for g in G]
json.dump(dict(object='WT', H=H, alpha=s30(al), rule='rho - i alpha: ordinates gamma - alpha (upper) and -gamma - alpha (lower); real part 1/2; not symmetric under conjugation',
               upper=up, lower=dn, max_abs_value_at_sampled_zeros=resid(o, [['0.5', u] for u in up])), open(os.path.join(tables, 'zeros_WT.json'), 'w'))
out['WT'] = len(up)
o = core.Liou()
zs = [['0.25', s30(arb(g) / 2)] for g in Z2 if float(g) / 2 <= H]
json.dump(dict(object='SGN-LIOU', H=H, rule='zeta(2s)/zeta(s): zeros at rho/2 (Re s = 1/4, outside the grid) and at s = 1; poles at the zeta zeros rho (Re s = 1/2) and at s = 1/2',
               zeros_quarter_line=zs, zero_at_one=True, poles_on_half_line=G, max_abs_value_at_sampled_zeros=resid(o, zs)), open(os.path.join(tables, 'zeros_SGN-LIOU.json'), 'w'))
out['SGN-LIOU'] = len(zs)
for code, b in (('DEL-0.75', '0.75'), ('DEL-0.9', '0.9'), ('THIN-0.9', '0.9')):
    json.dump(dict(object=code, H=H, rule='by theorem (c10 Lemma 1 / c4), not by data: a simple real zero at s = b; on Re s > max(b - eta, b/2 or b/3) the other zeros are those of zeta. '
                   'The 1e7 stage in the value table has the zeta zeros and no zero at b.', real_zero=b, zeta_zeros=G), open(os.path.join(tables, 'zeros_%s.json' % code), 'w'))
json.dump(dict(object='BEU', H=H, rule='zeta_B = zeta H with H analytic and zero-free on Re s > 0 (each factor is; the product of the logarithms converges absolutely there): zeros = zeta zeros', zeta_zeros=G),
          open(os.path.join(tables, 'zeros_BEU.json'), 'w'))
json.dump(dict(object='U, SGN (random seeds)', rule='no zeros in Re s > 1 (absolutely convergent Euler product); no continuation on file, so zeros in the strip are not defined'),
          open(os.path.join(tables, 'zeros_U_SGN.json'), 'w'))
# ---------- non-vanishing sanity: min |F| on Re s = 2 against a proved lower bound ----------
def load(code):
    d = np.load(os.path.join(tables, 'values_%s.npz' % code.replace('/', '_'))); return d
san = {}
z2 = float(acb(2).zeta().real.mid()); z4 = float(acb(4).zeta().real.mid()); z8 = float(acb(8).zeta().real.mid())
def zr(x): return float(acb(x).zeta().real.mid())
bounds = {'ZETA': z4 / z2, 'DH': 1 - (z2 - 1), 'TNR': z4 / z2 * (1 - 2.2 * 3 ** -1.5 - 3 ** -3.0), 'WT': z4 / z2, 'SGN-LIOU': (z8 / z4) / z2,
          'DEL-0.75': z4 / z2, 'DEL-0.9': z4 / z2, 'THIN-0.9': z4 / z2}
for a_, code in ((0.125, 'EA-1/8'), (0.25, 'EA-1/4'), (0.5, 'EA-1/2')):
    bounds[code] = zr(2 * (2 + a_)) * zr(2 * (2 - a_)) / (zr(2 + a_) * zr(2 - a_))
for code, lb in bounds.items():
    d = load(code); j = list(d['sigmas']).index(2.0)
    m = np.hypot(d['re_hi'][j], d['im_hi'][j]); k = int(np.nanargmin(m))
    san[code] = dict(min_abs_on_Re_s_2=float(m[k]), at_t=float(d['t'][k]), proved_lower_bound=lb, ok=bool(m[k] >= lb), max_rel_ball_radius=float(np.nanmax(d['rad'] / np.hypot(d['re_hi'], d['im_hi']))))
for code in ('U', 'SGN'):
    d = np.load(os.path.join(tables, 'values_%s.npz' % code)); j = list(d['sigmas']).index(2.0)
    arrs = [np.abs(d['pos'][:, j, :])] + ([np.abs(d['neg'][:, j, :])] if 'neg' in d else [])
    m = min(float(a.min()) for a in arrs); lb = z4 / z2 * math.exp(-float(d['tail_log_radius'][j]))
    san[code + '-00..23'] = dict(min_abs_on_Re_s_2=m, proved_lower_bound=lb, ok=bool(m >= lb * (1 - 1e-9)))
d = np.load(os.path.join(tables, 'values_BEU.npz')); zt = load('ZETA'); j = list(d['sigmas']).index(2.0)
m = np.abs(d['H'][j]) * np.hypot(zt['re_hi'][j], zt['im_hi'][j]); san['BEU'] = dict(min_abs_on_Re_s_2=float(m.min()), proved_lower_bound=z4 / z2, ok=bool(m.min() >= z4 / z2 * (1 - 1e-9)))
for tau in ('-0.1', '-0.5'):
    f = os.path.join(tables, 'values_HEAT-%s.npz' % tau)
    if os.path.exists(f):
        d = np.load(f); san['HEAT-' + tau] = dict(note='no lower bound known on Re s = 2 (not an Euler product); reported: minimum ball accuracy and the smallest scaled modulus on Re s = 2',
                                                 min_rel_accuracy_bits=int(d['rel_accuracy_bits'][:, 1:].min()), min_scaled_abs_on_Re_s_2=float(np.hypot(d['re_hi'][-1], d['im_hi'][-1]).min()), ok=bool(d['rel_accuracy_bits'][:, 1:].min() >= 100))
# table spot check: 300 random grid points of each closed table recomputed directly
rng = np.random.Generator(np.random.PCG64(12)); spot = {}
for o in core.make_objects():
    d = load(o.code); worst = 0.0
    for _ in range(300):
        j = int(rng.integers(0, 13)); k = int(rng.integers(1, len(d['t'])))
        v = o.value(acb(float(d['sigmas'][j]), float(d['t'][k])))
        tv = acb(core.dd_join(d['re_hi'][j, k], d['re_lo'][j, k]), core.dd_join(d['im_hi'][j, k], d['im_lo'][j, k]))
        worst = max(worst, float((abs(v - tv) / abs(v)).upper()))
    spot[o.code] = worst
json.dump(dict(derived=out, nonvanishing=san, table_spot_check_max_rel=spot), open(os.path.join(tables, 'sanity.json'), 'w'), indent=1)
for k, v in san.items(): print(k, v)
print('spot', spot); print('all sanity ok:', all(v['ok'] for v in san.values()), 'spot ok:', all(x < 1e-29 for x in spot.values()))
