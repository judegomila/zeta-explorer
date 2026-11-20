"""Exact recheck (mpmath, 40 digits) of the extreme values reported by c1.py, and the summary table."""
import sys, json, math
import numpy as np, mpmath as mp
import os; os.environ['RH_NOGPU'] = '1'
import torus as T, s3lib as S
mp.mp.dps = 40
fn = sys.argv[1]
R = json.load(open(fn))
m = R['meta']; N = R['N']; WTS = R['weights']
import c1n
sys.argv = sys.argv[:1]
pr, idx, cols_, Z_, mult_, const_ = None, None, None, None, None, None
import importlib
pr, idx, cols_, Z_, mult_, const_, pk_ = c1n.build(N, m['full'], [tuple(w) for w in WTS], m['ea'], m['tau'], m.get('fams', ''))
assert [list(c) for c in cols_] == R['cols']
NTOP = int(os.environ.get('NTOP', '3' if len(idx) < 5000 else '1'))


def wmp(v, d, twoa):
    d = mp.mpf(d); twoa = mp.mpf(twoa); r = twoa - v
    if r <= 0:
        return mp.mpf(0)
    mm = mp.sinh(twoa * d) / (2 * d) - twoa / 2
    return (mp.sinh(d * r) / (2 * d) - r * mp.cosh(d * v) / 2) / mm


FAST = len(idx) > 300000
if FAST:
    # exact 128-bit phases, float64 summation (independent of the NUFFT; phase error 2^-53 cycles per term)
    Lp = S.frac_logs(pr)
    if pk_ is None:
        Lall = S.extend_logs(N, pr, Lp); Lt = [Lall[int(n)] for n in idx]; del Lall
    else:
        Lt = [(int(k) * Lp[int(b)]) & S.MASK for b, k in zip(pk_[0], pk_[1])]
    out = []; worst = 0.0; cache = {}
    for c, (f, j) in enumerate(R['cols']):
        rows = []
        for dev, H in R['top'][c][:NTOP]:
            if m['mode'] != 'orbit':
                break
            if H not in cache:
                cache[H] = np.exp(-2j * math.pi * S.cycles_exact(H, Lt))
            val = math.fsum((Z_[:, c] * cache[H]).real)
            ex = val - R['mult'][c] * math.log(H / (2 * math.pi)) / 2 - R['const'][c]
            rows.append((H, dev, float(ex))); worst = max(worst, abs(ex - dev))
        out.append(dict(col=[f, j], recheck=rows))
else:
    pass
if not FAST:
    logs = [mp.log(int(n)) for n in idx]
    sq = [mp.sqrt(int(n)) for n in idx]
    out = []
    worst = 0.0
    cache = {}
    for c, (f, j) in enumerate(R['cols']):
        d, twoa = WTS[j]
        rows = []
        for dev, H in R['top'][c][:NTOP]:
            if m['mode'] != 'orbit':
                break
            if H not in cache:
                cache[H] = [mp.expj(-H * ln) for ln in logs]
            E = cache[H]
            tot = mp.mpf(0)
            for i in range(len(idx)):
                z = complex(Z_[i, c])
                if z == 0:
                    continue
                # Z_ holds Lambda_F(n) n^(-1/2) w(log n) in float64; recompute the weight and the root in mp
                lamc = z / (c1n.wfun(np.array([float(logs[i])]), d, twoa)[0] * float(idx[i]) ** -0.5)
                tot += (mp.mpf(lamc.real) * E[i].real - mp.mpf(lamc.imag) * E[i].imag) * wmp(logs[i], d, twoa) / sq[i]
            ex = tot - R['mult'][c] * mp.log(mp.mpf(H) / (2 * mp.pi)) / 2 - mp.mpf(R['const'][c])
            rows.append((H, dev, float(ex)))
            worst = max(worst, abs(float(ex) - dev))
        out.append(dict(col=[f, j], recheck=rows))

h = np.array(R['hist']); BLO, BW, NB = R['hist_bins']
z0 = int(round(-BLO / BW))
print(f"# {fn}: N={N} terms={R['nterm']} heights={R['done']:.3e} mode={m['mode']} step={R['step']}")
print('| family | delta | 2a | torus sup | Haar std | mean | std | max LHS | max dev | exceed count | exceed frac | min dev | recheck (H, float64, 40-digit) |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for c, (f, j) in enumerate(R['cols']):
    d, twoa = WTS[j]
    sd = math.sqrt(max(R['meansq'][c] - R['mean'][c] ** 2, 0))
    ex = int(h[c, z0:].sum())
    rc = '; '.join(f'{H}: {dv:.6f} / {e:.6f}' for H, dv, e in out[c]['recheck'][:1])
    print(f"| {f} | {d} | {twoa} | {R['torus_sup'][c]:.2f} | {R['l2'][c]:.3f} | {R['mean'][c]:+.4f} | {sd:.3f} | {R['maxV'][c]:.3f} | {R['maxdev'][c]:+.3f} | {ex} | {ex / R['done']:.3e} | {R['mindev'][c]:+.3f} | {rc} |")
print('max |float64 - exact| over rechecked extremes:', worst, '(exact 128-bit phases, float64 summation)' if FAST else '(40-digit arithmetic)')
json.dump(dict(file=fn, recheck=out, worst=worst, method='exact phases + float64 sum' if FAST else '40-digit'), open(fn.replace('.json', '_recheck.json'), 'w'))
