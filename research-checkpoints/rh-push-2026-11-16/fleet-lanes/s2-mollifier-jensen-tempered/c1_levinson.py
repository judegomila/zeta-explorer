"""Combination 1. Per-window Levinson numbers with tempered multiplicative mollifiers.
Windows [T_w, T_w + H], H = T^0.6, T_w = T + w * max(H, T/NWIN_SPAN), full uniform sampling of each window (no Monte Carlo).
Usage: c1_levinson.py T NWIN [R] [w_start] [hfac]      output: c1_T<T>.jsonl (one line per window), c1_T<T>_summary.json"""
import sys, json, math, time, os, numpy as np
import core, c1lib
from core import *
T = float(sys.argv[1]); NW = int(sys.argv[2]); R = float(sys.argv[3]) if len(sys.argv) > 3 else 1.3
W0 = int(sys.argv[4]) if len(sys.argv) > 4 else 0; HF = float(sys.argv[5]) if len(sys.argv) > 5 else 1.25
TAG = os.environ.get('S2_TAG', '')
THS = {'1/2': 0.5, '4/7': 4 / 7}
H = T ** 0.6; step = max(H, T / 1000.0)
ys = {k: int(T ** v) for k, v in THS.items()}; ymax = max(ys.values())
dhopt = json.load(open('dhopt_T1e+06.json'))
print('T %g windows %d H %.1f step %.1f y %s R %.2f gpu %s extended %s' % (T, NW, H, step, ys, R, core.GPU, core.EXT), flush=True)
h, M, Smax = c1lib.window_setup(T + (W0 + NW) * step + H, H, ymax, HF)
print('grid: h <= %.4f, M = %d samples per window, FFT size %d, sources up to %d' % (h, M, 2 * M, Smax), flush=True)
announce('per-window working set ~40 complex128 arrays of M and 3 of 2M', 16 * M * 46)
n = np.arange(1, Smax + 1)
coefs = {'one': xp.ones(Smax, dtype=xp.complex128), 'chi': xp.asarray(CHI5[n % 5]), 'chib': xp.asarray(np.conj(CHI5[n % 5]))}
moll = {}
for k, th in THS.items():
    mc = c1lib.moll_coefs(ys[k], dhopt['%.4f' % th])
    moll[k] = {name: xp.asarray(v) for name, v in mc.items()}
fn = 'c1_T%g%s.jsonl' % (T, TAG)
fo = open(fn, 'a'); t0 = time.time(); rows = []
for wi in range(W0, W0 + NW):
    Tw = T + wi * step; tc = Tw + H / 2
    h, M, _ = c1lib.window_setup(tc, H, ymax, HF)
    V, w, info = c1lib.all_V(tc, h, M, Smax, R, coefs)
    row = {'w': wi, 'Tw': Tw, 'h': h, 'M': M, 'info': info, 'st': {}}
    A2 = {k: xp.abs(v) ** 2 for k, v in V.items()}
    for name in V: row['st'][name + '|none|-'] = c1lib.stats(A2[name], R)
    for k in THS:
        for mname, mc in moll[k].items():
            users = [f for f in V if mname in c1lib.OPTIONS[f]]
            if not users: continue
            p2 = xp.abs(w.dsum(mc)) ** 2
            for f in users: row['st']['%s|%s|%s' % (f, mname, k)] = c1lib.stats(A2[f] * p2, R)
            del p2
    del V, A2, w
    fo.write(json.dumps(row) + '\n'); fo.flush(); rows.append(row)
    if wi < W0 + 3 or (wi - W0) % 50 == 0:
        print('window %d Tw %.6g  %.1fs  ZETA|MU|4/7 kJ %.4f knJ %.4f gap %.4f   DH|MURE|4/7 kJ %.4f knJ %.4f gap %.4f' % (
            (wi, Tw, time.time() - t0) + tuple(row['st']['ZETA|MU|4/7'][2:]) + tuple(row['st']['DH|MURE|4/7'][2:])), flush=True)
fo.close()
print('done %d windows in %.0fs' % (NW, time.time() - t0), flush=True)
