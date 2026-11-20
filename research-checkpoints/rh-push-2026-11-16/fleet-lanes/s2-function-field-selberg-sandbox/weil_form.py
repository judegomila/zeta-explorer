"""weil_form.py: Weil-type quadratic form W(f) = sum over spectral parameters of h(r_j), h = |F|^2 on the real axis,
for f in the span of hat functions on [0, A] (step d), computed from the geometric side of the trace formula (tf.py).
Objects: twisted Gamma(2) characters of the geod file (W_chi); PSL2(Z): W_disc (discrete spectrum, j >= 1: needs the
scattering term, i.e. the zeta primes) and W_el (same without the prime term 2 sum Lambda(n) g(2 log n)/n).
Output: min generalised eigenvalue of (M, Gram) for nested supports A. float64, MEASURED.
usage: weil_form.py geod.txt d Amax out.json"""
import sys, json, math
import numpy as np
import tf
G = tf.load_geod(sys.argv[1]); d = float(sys.argv[2]); Amax = float(sys.argv[3])
lmax = float(G['ell'][-1]); Amax = min(Amax, lmax)
n = int(round(Amax / d)) - 1
print(f'geod l_max={lmax:.3f} d={d} n={n}; planned memory: {5 * n * n * 8 / 1e9:.3f} GB dense', flush=True)
# archimedean Toeplitz entries
I1 = tf.arch_entries(n, d, lambda g, gp, S, pc: tf.ident(g, gp, S, 1.0, pc))          # per unit area
EL = tf.arch_entries(n, d, lambda g, gp, S, pc: tf.ell_term(g, S, pc))
P1 = tf.arch_entries(n, d, lambda g, gp, S, pc: tf.P1(g, S, pc))
P2 = tf.arch_entries(n, d, lambda g, gp, S, pc: tf.P2(g, S, pc))
POLE = tf.arch_entries(n, d, lambda g, gp, S, pc: 2 * tf._quad(lambda u: g(u) * np.cosh(u / 2), 0, S, pc))
G0 = np.zeros(n); G0[0] = d * 2 / 3; G0[1] = d / 6
lam = tf.mangoldt_upto(int(math.exp(Amax / 2)) + 2); idx = np.nonzero(lam)[0]
PR = tf.deposit(2 * np.log(idx), 2 * lam[idx] / idx, d, n)
HY = tf.deposit(G['ell'], G['amp'] * G['cnt'], d, n)
Gm = tf.gram(n, d)
sizes = sorted(set([int(round(a / d)) - 1 for a in np.arange(0.5, Amax + 1e-9, 0.25)]))
def scan(m, name):
    M = tf.toeplitz(m, n); rows = []
    for k in sizes:
        if k < 2 or k > n: continue
        w, v = tf.min_eig(M[:k, :k], Gm[:k, :k]); rows.append([round((k + 1) * d, 6), w])
    first = next((r[0] for r in rows if r[1] < -1e-9), None)
    print(name, 'first support with min eig < -1e-9:', first, '| min eig at largest support', rows[-1], flush=True)
    return dict(rows=rows, first_negative_support=first)
out = dict(d=d, Amax=Amax, lmax=lmax, objects={})
m_disc = math.pi / 3 * I1 + HY + EL + math.log(math.pi / 2) * G0 - P1 - P2 + PR - POLE
out['objects']['PSL2Z_disc'] = scan(m_disc, 'PSL2(Z) W_disc')
out['objects']['PSL2Z_el'] = scan(m_disc - PR, 'PSL2(Z) W_el (no zeta primes)')
out['objects']['PSL2Z_disc_plus_pole'] = scan(m_disc + POLE, 'PSL2(Z) W_disc + constant eigenfunction (j = 0 kept)')
for c in range(len(G['a'])):
    a, b = G['a'][c], G['b'][c]
    al = [x % 1.0 for x in (a, b, a - b)]
    if min(min(x, 1 - x) for x in al) < 1e-9: continue
    HYc = tf.deposit(G['ell'], G['amp'] * G['tw'][:, c], d, n)
    m = 2 * math.pi * I1 + HYc - tf.cusp_const(a, b) * G0
    out['objects'][f'G2_chi_{a:.4g}_{b:.4g}'] = scan(m, f'Gamma(2) chi=({a:.4g},{b:.4g}) cusp const {tf.cusp_const(a, b):.4f}')
    # archimedean part alone (no geodesics): sign for supports below the shortest geodesic
    out['objects'][f'G2_chi_{a:.4g}_{b:.4g}']['arch_only'] = scan(2 * math.pi * I1 - tf.cusp_const(a, b) * G0, '   archimedean + parabolic part alone')['rows'][-1]
json.dump(out, open(sys.argv[4], 'w'))
