"""Combination 3: Berry-Keating constant and counting residual on on-line zeros.
r_n = (n - 1/2) - theta_F(gamma_n)/pi over the on-line ordinates gamma_1 < gamma_2 < ...; theta_F from the gamma factor (q, kappa).
zeta: constant 1 (Berry-Keating form: 7/8). Usage: t3_bk.py <zeros6 path> <battery tables dir>"""
import sys, json, math, numpy as np
from lib import *
import mpmath as mp
zpath, bdir = sys.argv[1], sys.argv[2]
out = {}
def report(name, g, q, kap, shift_note='', extra=None):
    g = np.asarray(g, dtype=np.float64); n = np.arange(1, len(g) + 1)
    r = (n - 0.5) - theta_generic(g, q, kap) / math.pi
    if extra is not None: r = r - extra(g)
    h = len(g) // 2
    sl = np.polyfit(g, r, 1)[0]
    d = {'n_zeros': len(g), 'height': float(g[-1]), 'const_fit': float(r.mean()), 'se_naive': float(r.std() / math.sqrt(len(g))), 'resid_var': float(r.var()),
         'first_half_mean': float(r[:h].mean()), 'second_half_mean': float(r[h:].mean()), 'slope_per_unit_height': float(sl), 'last_residual': float(r[-1])}
    out[name] = d
    print('%s | zeros %d to %.1f | const %.6f (naive se %.1e) | var %.4f | halves %.4f / %.4f | slope %.2e | %s' % (name, len(g), g[-1], d['const_fit'], d['se_naive'], d['resid_var'], d['first_half_mean'], d['second_half_mean'], sl, shift_note), flush=True)
    return r
z = np.fromstring(open(zpath).read(), sep=' ')
print('zeta zeros read:', len(z))
# zeta: theta(t)/pi + 1 = N_smooth; r_n = n - 1/2 - theta/pi, predicted mean 1; Berry-Keating form constant = mean - 1/8
for N in (10**5, len(z)):
    r = report('ZETA_first_%d' % N, z[:N], 1, 0, 'predicted 1')
    g = z[:N]; bk = (np.arange(1, N + 1) - 0.5) - (g / (2 * math.pi)) * (np.log(g / (2 * math.pi)) - 1)
    # block standard error (blocks of 1000 zeros)
    nb = N // 1000; bm = bk[:nb * 1000].reshape(nb, 1000).mean(axis=1)
    out['ZETA_first_%d' % N]['BK_const'] = float(bk.mean()); out['ZETA_first_%d' % N]['BK_block_se'] = float(bm.std() / math.sqrt(nb))
    print('   Berry-Keating constant (asymptotic smooth term): %.6f +- %.1e (block se); 7/8 = 0.875' % (bk.mean(), bm.std() / math.sqrt(nb)))
# zeta with the first off-line-like deletion: remove one pair of zeros at height H (what an off-line pair does to the on-line list)
for H in (1000.0, 50000.0):
    N = 10**5; g = z[:N]; i = int(np.searchsorted(g, H)); g2 = np.delete(g, [i, i + 1])
    report('ZETA_first_1e5_minus_one_pair_at_%g' % H, g2, 1, 0, 'one pair removed at %g: mean shifts by -2 x fraction above' % H)
def load(nm):
    d = json.load(open('%s/zeros_%s.json' % (bdir, nm)))
    return d
d = load('DH'); on = np.array([float(x) for x in d['online']]); off = d['offline']
print('DH offline entry sample:', off[0] if off else None, 'keys', [k for k in d.keys()][:14])
r = report('DH_online', on, 5, 1, 'predicted 0 if all zeros were on the line; off-line pairs %d' % d['offline_pairs'])
try:
    og = np.sort(np.array([float(x[1]) if isinstance(x, (list, tuple)) else float(x.get('gamma', x.get('im'))) for x in off]))
    allz = np.sort(np.concatenate([on, og, og]))
    report('DH_all_zeros_in_strip', allz, 5, 1, 'on-line + both members of each off-line pair')
    out['DH_first_offline_height'] = float(og[0])
    # first height at which the on-line residual leaves the band |r| < 1.5
    n = np.arange(1, len(on) + 1); rr = (n - 0.5) - theta_generic(on, 5, 1) / math.pi
    bad = np.nonzero(np.abs(rr - rr[:10].mean()) > 1.5)[0]
    out['DH_first_departure_height'] = float(on[bad[0]]) if len(bad) else None
    print('DH first off-line ordinate %.4f; first on-line residual departure > 1.5 at height %s' % (og[0], out['DH_first_departure_height']))
except Exception as e:
    print('offline parse failed', repr(e))
for nm in ('HEAT--0.1', 'HEAT--0.5', 'EA-1_4', 'EA-1_8'):
    try:
        d = load(nm); print(nm, {k: (v if not isinstance(v, list) else 'list[%d]' % len(v)) for k, v in d.items() if k not in ('method', 'note')}); print('   note:', str(d.get('note'))[:300])
    except Exception as e: print(nm, 'load failed', repr(e))
# L(s, chi), chi odd mod 5: on-line zeros 0 < t < H by sign changes of the Hardy function (evaluator A), then the same statistic
H = 2000.0; h = 0.01; tt = np.arange(h / 2, H, h)
vals = []
for b in range(0, len(tt), 1000):
    R, _ = hurwitz_batch(tt[b:b + 1000], 0.5, 5, want_deriv=False, Nfac=2.0, chunk_elems=2e6); vals.append(CHI5[1:5] @ R[:4])
Lv = np.concatenate(vals)
th = theta_generic(tt, 5, 1)
ph0 = -0.5 * np.angle(EPS5)
Zc = (np.exp(1j * (th + ph0)) * Lv)
print('L(chi) Hardy function: max |Im|/|Z| =', float(np.abs(Zc.imag).max()), ' (must be ~0)')
Zr = Zc.real; sc = np.nonzero(np.sign(Zr[1:]) != np.sign(Zr[:-1]))[0]
gam = tt[sc] - Zr[sc] * h / (Zr[sc + 1] - Zr[sc])
# N(T) for L(chi): theta(T)/pi + const; const from arg at t = 0: N(0,T) = (theta(T) + arg L(1/2+iT) - arg L(1/2))/pi; phase offset ph0/pi enters
predicted = float(-(-ph0) / math.pi)
r = report('LCHI5_online_to_2000', gam, 5, 1, 'predicted const = (arg eps)/(2 pi) = %.6f plus S-average; all zeros found on the line iff no drift' % (np.angle(EPS5) / (2 * math.pi)))
out['LCHI5_eps_arg_over_2pi'] = float(np.angle(EPS5) / (2 * math.pi))
json.dump(out, open('t3_result.json', 'w'), indent=1)
