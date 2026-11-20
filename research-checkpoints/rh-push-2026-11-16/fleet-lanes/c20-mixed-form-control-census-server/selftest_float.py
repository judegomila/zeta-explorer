# brute-force check of the float stage: direct sums with Lambda_2 = Lambda log + Lambda*Lambda (dense), small P
import math, sys, numpy as np, mixed
def brute(lam, P, u, tw, taus, R, Lg, dens=None):
    N = P - 1
    l2 = lam * np.log(np.maximum(np.arange(N + 1), 1.0))
    for m in range(2, N + 1):
        if lam[m] != 0:
            k = N // m
            l2[m * np.arange(2, k + 1)] += lam[m] * lam[2:k + 1]
    n = np.arange(2, N + 1); ln = np.log(n)
    ct = mixed.cterms(u)
    c = sum((al + be * ln) * np.exp(1j * nu * ln) for al, be, nu in ct)
    c0 = 35 * u / 128; out = []
    for tau in taus:
        ph = np.exp(-1j * (tw + tau) * ln) / np.sqrt(n)
        S1 = (lam[2:] * c * ph).sum(); S2 = (l2[2:] * c * ph).sum()
        out.append(((R - 2 * S1.real / c0) / Lg, (R * R / 2 - 2 * R * S1.real / c0 + 2 * S2.real / c0) / Lg ** 2))
    return out
t, th, w = 1e4, 0.95, 1
P = mixed.P_of(t, th); u = math.log(P); tw = t + 200.0 * w; Lg = math.log(tw / 2 / math.pi)
pp = mixed.PP(P)
print('P', P, 'prime powers', len(pp.n), 'deleted', mixed.del_set(pp.pr).sum())
pr7 = mixed.primes_upto(10 ** 7) if len(sys.argv) > 1 else None
if pr7 is not None: print('DEL deleted below 1e7 (README of c12 battery: 16210):', int(mixed.del_set(pr7).sum()))
objs = [('zeta',), ('EA',), ('DEL',), ('HQ2',), ('HQ3',), ('HQ4',), ('LIOU',), ('TNR',), ('DH',), ('chain', 3), ('haar', 2)]
recs, sec = mixed.job((t, th, w, None, objs, ('zeta', 'EA', 'DEL', 'HQ2', 'HQ3', 'HQ4', 'LIOU', 'TNR', 'DH', 'chain', 'haar')))
tau = np.arange(-mixed.HW, mixed.HW + mixed.STEP / 2, mixed.STEP)[::5]
idx = [0, 137, 400, 555, 800]
for r in recs:
    obj = tuple(r['obj']); cls = obj[0]
    lam = np.zeros(P, dtype=complex)
    if cls == 'DH': lam = mixed.dh_lam(P).astype(complex); R = math.log(5 * tw / 2 / math.pi)
    else: lam[pp.n] = pp.lam(obj); R = 2 * Lg if cls == 'EA' else Lg
    b = brute(lam, P, u, tw, tau[idx], R, Lg)
    e1 = max(abs(b[i][0] - r['T1n_grid'][j]) for i, j in enumerate(idx)); e2 = max(abs(b[i][1] - r['T2n_grid'][j]) for i, j in enumerate(idx))
    print(cls, 'm %.4f neg2 %.4f neg1 %.4f Q1sd %.3f Q2sd %.4f (a %.4f b %.4f) dS1 %s | brute diff T1n %.2e T2n %.2e' % (r['m'], r['neg2'], r['neg1'], r['Q1_sd'], r['Q2_sd'], r['Q2a_sd'], r['Q2b_sd'], r['dS1_vs_zeta'], e1, e2))
