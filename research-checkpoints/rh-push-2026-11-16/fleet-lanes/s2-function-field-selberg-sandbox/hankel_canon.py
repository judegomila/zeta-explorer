"""hankel_canon.py: one-node Schur/Hankel condition with the canonical completion.
X_c(w) = Z(1/2 + w, chi) G_c(w), G_c'/G_c = -log c - 2 w psi(1/2 + w)  (area 2 pi; no zeros or poles of G_c in Re w > -1/2; X_c even:
checked through realaxis.py, whose X equals X_c times the even factor E, E'/E = w (psi(1/2+w) + psi(1/2-w))).
(1) nodes 0 < x < 0.46 from the transfer-operator values of realaxis.py: ratio |X_c(x-a)/X_c(x+a)|;
(2) nodes x >= 1 from the Euler product: D(x) = d/dx log X_c(x) = Z'/Z(1/2+x) - log c - 2 x psi(1/2+x); D < 0 on an interval gives |R_a| > 1 there.
usage: hankel_canon.py realaxis.json geod.txt out.json"""
import sys, json, math
import numpy as np
from scipy.special import digamma
from scipy.integrate import quad
import tf
R = json.load(open(sys.argv[1])); G = tf.load_geod(sys.argv[2]); out = {}
N = np.exp(G['ell'])
for key, rec in R['hankel'].items():
    a, b = [float(x) for x in key.split('_')]
    ws = rec['w']; X = rec['X']
    logE = {w: quad(lambda v: v * (digamma(0.5 + v) + digamma(0.5 - v)), 0, abs(w))[0] for w in ws}
    Xc = {w: x * math.exp(-logE[w]) for w, x in zip(ws, X)}
    res = dict(shifts={})
    for sh in (0.02, 0.06, 0.1, 0.2):
        rows = [(x, Xc[round(x - sh, 4)] / Xc[round(x + sh, 4)]) for x in ws if x > 0 and round(x - sh, 4) in Xc and round(x + sh, 4) in Xc]
        bad = [(x, r) for x, r in rows if abs(r) > 1 + 1e-9]
        res['shifts'][str(sh)] = dict(max_abs=max(abs(r) for x, r in rows), first_bad=bad[0] if bad else None, n_bad=len(bad), n=len(rows))
    cidx = [i for i in range(len(G['a'])) if abs(G['a'][i] - a) < 1e-3 and abs(G['b'][i] - b) < 1e-3]
    if cidx:
        c = cidx[0]; logc = tf.cusp_const(G['a'][c], G['b'][c]); xs = np.arange(1.0, 8.01, 0.25); D = []
        for x in xs:
            zpz = float(np.sum(G['tw'][:, c] * G['ell'] * N ** (-(0.5 + x)) / (1 - 1 / N)))
            D.append(zpz - logc - 2 * x * float(digamma(0.5 + x)))
        neg = [float(x) for x, dd in zip(xs, D) if dd < 0]
        res['D_first_negative_x'] = neg[0] if neg else None; res['D_at_1_2_4_8'] = [D[0], D[4], D[12], D[28]]; res['logc'] = logc
    out[key] = res
    print(key, {k: (round(v['max_abs'], 4), v['first_bad']) for k, v in res['shifts'].items()}, '| D(x) < 0 from x =', res.get('D_first_negative_x'), 'D(1,2,4,8) =', [round(z, 3) for z in res.get('D_at_1_2_4_8', [])])
json.dump(out, open(sys.argv[3], 'w'))
