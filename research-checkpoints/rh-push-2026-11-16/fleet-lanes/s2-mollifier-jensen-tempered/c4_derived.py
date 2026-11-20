"""Combination 4, low range on a fine T grid (CPU): I_F(T), T <= TMAX, for ZETA, LCHI, DH (corrected grid sum as in c4_littlewood.py, recorded every 10 units),
TNR = zeta * (3^{s-1/2} + 2.2 + 3^{1/2-s}), EA = zeta(s+1/4) zeta(s-1/4), LIOU = zeta(2s)/zeta(s); HEAT from the battery zero tables by Littlewood's sum.
Reports the first recorded T with I_F(T) > 5 log T and the least-squares slope of I_F on [TMAX/2, TMAX]. Usage: c4_derived.py [TMAX]"""
import sys, os, json, math, numpy as np
os.environ['S1_NOGPU'] = '1'; os.environ['S2_NOGPU'] = '1'
sys.path.insert(0, '../s1-scattering-one-line')
import lib as s1
import core
from core import CHI5, C1, C2, EPS5
sys.argv = [sys.argv[0]] + sys.argv[1:]
TMAX = float(sys.argv[1]) if len(sys.argv) > 1 else 3000.0
H = 0.004; B = 2500; n = int(round(TMAX / H))
import importlib.util
# reuse the accumulator class
src = open('c4_littlewood.py').read(); cls = src[src.index('class Acc:'):src.index('def theta_parts')]
ns = {'xp': np, 'math': math}; exec(cls, ns); Acc = ns['Acc']
FN = ('ZETA', 'LCHI', 'DH'); acc = {f: Acc(H) for f in FN}; ph = {f: None for f in FN}
plain = {'EA': 0.0, 'Z1': 0.0, 'TNRm': 0.0}; rec = {k: [] for k in ('T', 'ZETA', 'LCHI', 'DH', 'EA', 'Z1', 'TNRm')}
def X0(t, q, kappa):
    s = 0.5 + 1j * t
    return np.exp((0.5 - s) * math.log(q / math.pi) + s1.lgamma_stirling((1 - s + kappa) / 2) - s1.lgamma_stirling((s + kappa) / 2))
for b0 in range(0, n, B):
    j = np.arange(b0, min(b0 + B, n)); t = (j + 0.5) * H
    Rz, _ = s1.hurwitz_batch(t, 0.5, 1, want_deriv=False); R5, _ = s1.hurwitz_batch(t, 0.5, 5, want_deriv=False)
    z = Rz[0]; chi = CHI5[1:5]; lc = chi @ R5[:4]; lb = np.conj(chi) @ R5[:4]; dh = C1 * lc + C2 * lb
    xz = X0(t, 1, 0); x5 = X0(t, 5, 1)
    for f, X, F in (('ZETA', xz, z), ('LCHI', EPS5 * x5, lc), ('DH', x5, dh)):
        start = np.angle(X[0]) / 2 if ph[f] is None else ph[f][0] + np.angle(X[0] / ph[f][1]) / 2
        half = start + np.concatenate([[0.0], np.cumsum(np.angle(X[1:] / X[:-1]))]) / 2
        ph[f] = (half[-1], X[-1]); acc[f].add((F * np.exp(-1j * half)).real)
    Ra, _ = s1.hurwitz_batch(t, 0.75, 1, want_deriv=False); Rb, _ = s1.hurwitz_batch(t, 0.25, 1, want_deriv=False)
    plain['EA'] += H * float(np.log(np.abs(Ra[0] * Rb[0])).sum())
    R1, _ = s1.hurwitz_batch(2 * t, 1.0, 1, want_deriv=False)
    plain['Z1'] += H * float(np.log(np.abs(R1[0])).sum())
    plain['TNRm'] += H * float(np.log(np.abs(2 * np.cos(t * math.log(3)) + 2.2)).sum())
    rec['T'].append((b0 + len(j)) * H)
    for f in FN: rec[f].append(acc[f].I)
    for k in plain: rec[k].append(plain[k])
T = np.array(rec['T']); I = {f: np.array(rec[f]) for f in FN}
I['TNR'] = I['ZETA'] + np.array(rec['TNRm']); I['EA'] = np.array(rec['EA']); I['LIOU'] = np.array(rec['Z1']) - I['ZETA']
for nm in ('HEAT--0.5', 'HEAT--0.1'):
    tab = json.load(open('../c12-control-battery-harness/tables/zeros_%s.json' % nm))
    off = np.array([[float(x[0]), float(x[1])] for x in tab['offline']])
    I[nm + ' (Littlewood sum from the zero table, not integrated)'] = np.array([2 * math.pi * off[off[:, 1] < tt, 0].sum() for tt in T]) if TMAX <= 2000 else None
out = {'T': T.tolist()}
env = 5 * np.log(T)
print('function : I(50) I(100) I(200) I(500) I(1000) I(2000) I(TMAX) | max |I|/logT for T>=50 | first T with I > 5 log T | slope on [TMAX/2, TMAX]')
for k, v in I.items():
    if v is None: continue
    out[k] = v.tolist()
    pick = [float(v[np.argmin(np.abs(T - tt))]) for tt in (50, 100, 200, 500, 1000, 2000, TMAX) if tt <= TMAX]
    m = T >= 50; cross = T[(v > env)]; cross = float(cross[0]) if len(cross) else None
    crossn = T[(v < -env)]; crossn = float(crossn[0]) if len(crossn) else None
    hm = T >= TMAX / 2; slope = float(np.polyfit(T[hm], v[hm], 1)[0])
    print('%-8s : %s | %.3f | above: %s below -5 log T: %s | %.4f' % (k[:40], ' '.join('%.3f' % p for p in pick), float(np.abs(v[m] / np.log(T[m])).max()), cross, crossn, slope))
    out[k + '_summary'] = {'cross_above': cross, 'cross_below': crossn, 'slope': slope, 'max_abs_over_log': float(np.abs(v[m] / np.log(T[m])).max())}
json.dump(out, open('c4_derived_T%g.json' % TMAX, 'w'))
