"""Davenport-Heilbronn control. Real zeros of Z_chi (Euler product), Z_DH = Z_chi + Z_chibar (no Euler product, off-line zeros), Z_alt = Z_chi - Z_chibar.
Q = E[g D] over consecutive REAL zeros (flat kernel, J neighbours + continuum tail)."""
import numpy as np, sys, math, json
sys.path.insert(0, '.')
import rs_zeros as R, qstat as QS
d = np.load(sys.argv[1]); t = d['t']; h = float(d['h']); Z1 = d['Z1']; Z2 = d['Z2']
theta = lambda u: 0.5 * u * np.log(5 * u / (2 * math.pi * math.e))
W, U = R.W, R.U
out = {}
for name, S in [('chi (Euler product)', Z1), ('chibar (Euler product)', Z2), ('DH = Z_chi + Z_chibar', Z1 + Z2), ('alt = Z_chi - Z_chibar', Z1 - Z2)]:
    F = R.upsample(S)
    r, nh = R.find_roots(F, W * U, (len(S) - W) * U)
    rc = R.polish(S, r / U)
    g = t[0] + rc * h
    x = theta(g) / math.pi
    expect = (theta(t[0] + (len(S) - W) * h) - theta(t[0] + W * h)) / math.pi
    x1 = x / np.mean(np.diff(x))
    L = math.log(5 * float(np.median(g)) / (2 * math.pi))
    s = QS.stats(x1, L, J=200, MP=3)
    # block errors with smaller blocks
    print('%-26s real zeros %d  expected (all zeros) %.1f  deficit %.1f  hidden pairs %d | Lmed=%.2f  V=%.4f  Q+1=%.4f +- %.4f' % (
        name, len(g), expect, expect - len(g), nh, L, s['V'], s['Q'] + 1, s['Qerr']), flush=True)
    out[name] = dict(n=len(g), expect=expect, V=s['V'], Q=s['Q'], Qerr=s['Qerr'], L=L)
    # halves
    for lab, m in [('  lower half', g < np.median(g)), ('  upper half', g >= np.median(g))]:
        xx = x[m]; xx = xx / np.mean(np.diff(xx)); s2 = QS.stats(xx, L, J=200, MP=3)
        print('%-26s Q+1=%.4f +- %.4f  V=%.4f' % (lab, s2['Q'] + 1, s2['Qerr'], s2['V']))
json.dump(out, open('dh_result.json', 'w'))
