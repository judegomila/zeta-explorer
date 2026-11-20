import json, math, numpy as np, tf
G = tf.load_geod('out_server/geod_20000.txt'); d = 0.02; Amax = 4.0; n = int(round(Amax / d)) - 1
I1 = tf.arch_entries(n, d, lambda g, gp, S, pc: tf.ident(g, gp, S, 1.0, pc)); EL = tf.arch_entries(n, d, lambda g, gp, S, pc: tf.ell_term(g, S, pc))
P1 = tf.arch_entries(n, d, lambda g, gp, S, pc: tf.P1(g, S, pc)); P2 = tf.arch_entries(n, d, lambda g, gp, S, pc: tf.P2(g, S, pc))
POLE = tf.arch_entries(n, d, lambda g, gp, S, pc: 2 * tf._quad(lambda u: g(u) * np.cosh(u / 2), 0, S, pc))
G0 = np.zeros(n); G0[0] = d * 2 / 3; G0[1] = d / 6; Gm = tf.gram(n, d)
lam = tf.mangoldt_upto(60); idx = np.nonzero(lam)[0]; PR = tf.deposit(2 * np.log(idx), 2 * lam[idx] / idx, d, n)
HY = tf.deposit(G['ell'], G['amp'] * G['cnt'], d, n)
m_disc = math.pi / 3 * I1 + HY + EL + math.log(math.pi / 2) * G0 - P1 - P2 + PR - POLE
out = {}
for name, m in (('W_disc', m_disc), ('W_el', m_disc - PR), ('W_disc without geodesics', m_disc - HY), ('W_arch (no primes, no geodesics)', m_disc - PR - HY)):
    M = tf.toeplitz(m, n); rows = [((k + 1) * d, tf.min_eig(M[:k, :k], Gm[:k, :k])[0]) for k in range(20, n + 1, 1)]
    first = next((A for A, w in rows if w < -1e-9), None)
    out[name] = dict(first=first, rows=rows)
    print(name, 'first failing support', first, '| min eig at A = 1.3, 1.5, 2.0, 3.0, 4.0:', [round([w for A, w in rows if abs(A - a) < 0.011][0], 6) for a in (1.3, 1.5, 2.0, 3.0, 4.0)], flush=True)
print('2 log 2 =', 2 * math.log(2), ' 2 log 3 =', 2 * math.log(3), ' l0 =', G['ell'][0])
json.dump(out, open('out/psl_fine.json', 'w'))
