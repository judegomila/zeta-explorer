# triangle-inequality floor: lower bound of T2/(c0 Lg^2) valid for zeta and every unimodular completely multiplicative chain
# (abs(Lambda_eps) = Lambda, abs(Lambda_2,eps) <= Lambda_2, c >= 0): floor = 1/2 - a1max/Lg - a2max/Lg^2,
# a1max = 2 sum Lambda n^-1/2 c(log n)/c0, a2max = 2 sum Lambda_2 n^-1/2 c(log n)/c0. Float64 (all terms non-negative).
import math, json, numpy as np, mixed
out = []
for t in (1e4, 1e6, 1e8, 1e10):
    for th in (0.5, 0.7, 0.85, 0.95):
        P = mixed.P_of(t, th)
        if P > 7e7: continue
        u = math.log(P); Lg = math.log(t / 2 / math.pi); c0 = 35 * u / 128
        pp = mixed.PP(P); J = int(u / mixed.DELTA) + 3; xj = np.arange(J) * mixed.DELTA
        lnf, jb, base, d = mixed.phases(pp.n, 0.0)
        G = [base.copy()]
        for k in range(1, mixed.KM): G.append(G[-1] * d / k)
        M = mixed.moments_from(jb, G, pp.lam(('zeta',)), J)
        CT = mixed.ctaylor(u, xj, mixed.RC)
        E = np.ones((1, J), dtype=complex); mit = np.zeros(1, dtype=complex)
        cut = xj <= u + 1.5 * mixed.DELTA
        S1 = mixed.evalS(mixed.weight(M, CT), E, mit)[0].real
        Sl = mixed.evalS(mixed.weight(mixed.xi_moments(M, xj), CT), E, mit)[0].real
        Sc = mixed.evalS(mixed.weight(mixed.conv_moments(M, J) * cut[:, None], CT), E, mit)[0].real
        a1 = 2 * S1 / c0; a2 = 2 * (Sl + Sc) / c0
        r = {'t': t, 'theta': th, 'P': P, 'a1max_over_Lg': a1 / Lg, 'a2max_over_Lg2': a2 / Lg ** 2, 'floor_T2n': 0.5 - a1 / Lg - a2 / Lg ** 2,
             'floor_T1n': 1 - a1 / Lg, 'height_zero_value_T2n': 0.5 - a1 / Lg + a2 / Lg ** 2}
        out.append(r); print(json.dumps(r), flush=True)
json.dump(out, open('trivbound.json', 'w'), indent=1)
