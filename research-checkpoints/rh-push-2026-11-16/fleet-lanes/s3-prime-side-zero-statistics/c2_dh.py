"""Combination 2, DH: Var S from the complete zero table below 2000 (argument-principle count = on-line zeros + 2 per off-line pair) and from the on-line
zeros only, against (a) the Euler-product constant of conductor 5 and (b) the truncated sum of DH's own log-derivative coefficients."""
import json, math, numpy as np, w3
from scipy.special import loggamma
PI = math.pi
tab = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
on = np.array([float(x) for x in tab['online']]); off = np.array([float(t) for b, t, _ in tab['offline']])
def theta0(t): return 0.5 * t * math.log(5 / PI) + loggamma(0.75 + 0.5j * t).imag
def varS(a, b, events, weights, h=0.002):
    g = np.arange(a, b, h)
    ev = np.sort(events); 
    N = np.zeros(len(g))
    for e, w in zip(events, weights): N += w * (g >= e)
    S = N - theta0(g) / PI
    return float(S.var()), float(S.mean()), S
res = {}
for (a, b) in ((10, 85), (10, 2000), (100, 2000), (1000, 2000)):
    v_all, m_all, _ = varS(a, b, np.concatenate([on, off]), np.concatenate([np.ones(len(on)), 2 * np.ones(len(off))]))
    v_on, m_on, S = varS(a, b, on, np.ones(len(on)))
    # on-line count with its own linear trend removed
    g = np.arange(a, b, 0.002); c = np.polyfit(g, S, 1); v_on_detr = float((S - np.polyval(c, g)).var())
    tm = math.sqrt(a * b)
    res['[%g,%g]' % (a, b)] = dict(var_S_all=v_all, mean_S_all=m_all, var_S_online=v_on, var_S_online_detrended=v_on_detr,
        euler5_prediction=(math.log(math.log(5 * tm / (2 * PI))) + 0.2614972128 - 0.2 + 0.1394706 - sum(5.0 ** -k / k ** 2 for k in range(2, 40)) + 1) / (2 * PI ** 2))
    print((a, b), res['[%g,%g]' % (a, b)])
# own-coefficient diagonal sums
for X in (1e2, 1e3, 1e4, 1e5, 1e6):
    n, c = w3.dh_logder(X)
    own = float(np.sum(c ** 2 / (n * np.log(n) ** 2)))
    nn, pp, kk = w3.prime_powers(X); m = pp != 5
    eul = float(np.sum(1.0 / (kk[m] ** 2 * nn[m])))
    res['diag_X=%g' % X] = dict(own_sum_c2_over_n_log2n=own, euler5_sum=eul, max_abs_c_over_sqrt_n=float(np.max(np.abs(c) / np.sqrt(n))), growth_exponent=float(np.log(np.max(np.abs(c))) / math.log(X)))
    print(X, res['diag_X=%g' % X])
print('c_DH(n), n=2..13:', {int(a): round(float(b), 5) for a, b in zip(*w3.dh_logder(13))})
json.dump(res, open('out/c2_dh.json', 'w'), indent=1)
