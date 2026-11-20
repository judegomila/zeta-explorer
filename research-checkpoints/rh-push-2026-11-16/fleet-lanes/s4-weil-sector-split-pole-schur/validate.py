"""Validation of the sector matrices against the zero side of the explicit formula (zeta), and of the box entry against
the closed form Psi. usage: python validate.py N prec 2a"""
import sys, json, math
import mpmath as mp
from slib import *
N = int(sys.argv[1]); PREC = int(sys.argv[2]); s = sys.argv[3]
setprec(PREC); mp.mp.dps = 30
a = arb(s) / 2; af = float(s) / 2
Q = N + extra_nodes(af, 60)
Alog, T = stage1_nodes(N, Q, list(range(Q)), [s], ['0.25'])
K = int(math.exp(float(s))) + 1
cz = coef_zeta(K)
ce, so = pole_vectors(N, a, '0.5')
M = []
for par in (0, 1):
    d = len(par_idx(N, par))
    X = arch_block(d, a, ['0.25'], Alog[par], [T[(s, '0.25')][par]], arb(0))
    for n in range(2, K + 1):
        if float(cz[n].mid()) != 0 and arb(n).log() < 2 * a:
            X = X - sblocks(arb(n).log() / a, N)[par] * (cz[n] / arb(n).sqrt())
    X = X + outer(ce if par == 0 else so, arb(2 if par == 0 else -2))
    M.append(X)
out = {'N': N, 'twoa': float(s)}
# (1) box entry: phi_0 = (2a)^{-1/2} 1 ; W(phi_0) = 2 Psi(2a)/(2a), Psi from the PR 21 formula
W = mp.mpf(s)
z = mp.mpf(1) / 4
psi = (W / 2) * (mp.digamma(z) - mp.log(mp.pi)) + mp.nsum(lambda k: (1 - mp.exp(-2 * (k + z) * W)) / (4 * (k + z) ** 2), [0, mp.inf]) \
    + 2 * (mp.cosh(W / 2) - 1) / mp.mpf('0.25') - sum(mp.mangoldt(n) / mp.sqrt(n) * (W - mp.log(n)) for n in range(2, K + 1) if mp.log(n) < W)
out['box_closed_form'] = float(2 * psi / W); out['box_matrix'] = float(M[0][0, 0].mid())
# (2) zero side for two smooth tests
zeros = [mp.im(mp.zetazero(n)) for n in range(1, 81)]
def proj(g, par):
    idx = par_idx(N, par); c = []
    for i in idx:
        c.append(mp.quad(lambda x: g(x) * mp.sqrt((2 * i + 1) / (2 * mp.mpf(af))) * mp.legendre(i, x / af), [-af, 0, af]))
    return c
for nm, par, g in (('even (1-x^2/a^2)^3', 0, lambda x: (1 - (x / af) ** 2) ** 3), ('odd x(1-x^2/a^2)^3', 1, lambda x: x * (1 - (x / af) ** 2) ** 3)):
    c = proj(g, par)
    cm = arb_mat([[arb(str(x))] for x in c])
    form = float((cm.transpose() * (M[par] * cm))[0, 0].mid())
    if par == 0: gh = lambda t: 2 * mp.quad(lambda x: g(x) * mp.cos(t * x), mp.linspace(0, af, 12))
    else: gh = lambda t: 2 * mp.quad(lambda x: g(x) * mp.sin(t * x), mp.linspace(0, af, 12))
    zs = float(sum(2 * gh(t) ** 2 for t in zeros))
    polev = float(mp.quad(lambda x: g(x) * (mp.cosh(x / 2) if par == 0 else mp.sinh(x / 2)), [-af, 0, af])) ** 2 * 2
    out[nm] = {'matrix_form': form, 'zero_side_80_zeros': zs, 'pole_term_abs': polev, 'rel_diff': abs(form - zs) / abs(zs)}
print(json.dumps(out, indent=1))
