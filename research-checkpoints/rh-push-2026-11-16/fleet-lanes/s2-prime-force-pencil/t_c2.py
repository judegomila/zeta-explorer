"""validation: (a) extrema from the zero list against mpmath findroot of Z'; sign rule; (b) source values rho(32,T)."""
import numpy as np, mpmath as mp, math, lib
g, cond, s0 = lib.load_list('zeta'); g = g[:4001]
x, s, k, tight = lib.near_collisions(g)
m = x < 1000; x[m] = lib.mp_extrema_zeta(x[m], g[k[m]], g[k[m] + 1])
mp.mp.dps = 20
err = []; sg = []
for i in list(range(0, 60)) + list(range(len(x) - 30, len(x))):
    xs = float(mp.findroot(lambda t: mp.siegelz(t, derivative=1), x[i])); zpp = float(mp.siegelz(xs, derivative=2))
    err.append(abs(xs - x[i]) / (g[k[i] + 1] - g[k[i]])); sg.append(np.sign(zpp) == s[i])
print('extremum from list vs mpmath: max |dx|/gap %.3e  mean %.3e ; sign(Z\'\') by parity agrees %d/%d' % (max(err), np.mean(err), sum(sg), len(sg)))
n = np.arange(1, 33.0)
S = lib.System(x, s, lib.theta_zeta(x), np.log(n), 1 / np.sqrt(n))
src = {60.0: 0.761, 90.0: 0.692, 120.0: 0.660, 150.0: 0.636, 200.0: 0.619, 260.0: 0.600, 395.98: 0.559, 4506.31: 0.3791}
for T, v in src.items():
    K = int((x <= T).sum()); r = lib.margin(S, K)
    print('T=%8.2f K=%5d rho in [%.4f, %.4f] source %.4f  %s' % (T, K, r['rho_lower'], r['rho_upper'], v, r['status']))
S1 = lib.System(x, s, lib.theta_zeta(x), np.log(n[:1]), 1 / np.sqrt(n[:1]))
v = S1.dots(np.array([-1.0])); print('n=1 alone (w_1=-1): fraction of constraints satisfied to gamma_4000: %.4f ; first violation at x=%.3f' % ((v > 0).mean(), x[np.argmax(v < 0)] if (v < 0).any() else -1))
