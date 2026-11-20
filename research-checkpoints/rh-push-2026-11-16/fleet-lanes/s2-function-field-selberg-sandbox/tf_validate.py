"""Validation of tf.py: (1) PSL2(Z) with Gaussian h(r) = exp(-tau r^2): geometric side against exp(tau/4) + sum over known Maass r_j.
(2) twisted Gamma(2): geometric side against exp(tau kappa^2) + sum over the zeros found by twzeros.py."""
import sys, json, math
import numpy as np
import tf
G = tf.load_geod(sys.argv[1])
MAASS = [9.53369526135, 12.17300832468, 13.77975135189, 14.35850951826, 16.13807317152, 16.64425920190, 17.73856338106, 18.18091783453, 19.42348147083, 19.48471385474]
for tau in (0.25, 0.1, 0.08):
    g = lambda u: np.exp(-u * u / (4 * tau)) / math.sqrt(4 * math.pi * tau)
    gp = lambda u: -u / (2 * tau) * g(u)
    S = 14 * math.sqrt(2 * tau)
    P = tf.psl_all(g, gp, S, G, pieces=600)
    geo = sum(P.values()); spec = math.exp(tau / 4) + sum(math.exp(-tau * r * r) for r in MAASS)
    print(f'PSL2(Z) tau={tau}: geometric {geo:.13f} spectral {spec:.13f} diff {geo - spec:.3e}  (Maass part {spec - math.exp(tau / 4):.3e})')
    print('   pieces', {k: round(v, 10) for k, v in P.items()})
for fn in sys.argv[2:]:
    z = json.load(open(fn)); a, b = z['a'], z['b']
    c = [i for i in range(len(G['a'])) if abs(G['a'][i] - a) < 1e-9 and abs(G['b'][i] - b) < 1e-9][0]
    kap = {(0.01, 0.02): 0.9503290739 - 0.5, (0.03, 0.05): 0.8398960900 - 0.5}.get((a, b))
    for tau in (1.0, 1.5, 2.0, 2.5):
        g = lambda u: np.exp(-u * u / (4 * tau)) / math.sqrt(4 * math.pi * tau)
        gp = lambda u: -u / (2 * tau) * g(u)
        S = 14 * math.sqrt(2 * tau)
        P = tf.tw_all(g, gp, S, G, c, pieces=800)
        geo = sum(P.values())
        spec = (math.exp(tau * kap * kap) if kap else 0.0) + sum(math.exp(-tau * r * r) for r in z['zeros'])
        tail = math.exp(-tau * z['R'] ** 2)
        print(f'chi=({a},{b}) tau={tau}: geometric {geo:.10f} spectral(zeros r<{z["R"]}) {spec:.10f} diff {geo - spec:.3e} (first omitted term <~ {tail:.1e} x density; hyp tail at l_max: g={float(g(np.array([G["ell"][-1]]))[0]):.1e})')
