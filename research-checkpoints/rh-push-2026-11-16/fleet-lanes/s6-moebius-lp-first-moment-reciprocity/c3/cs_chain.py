"""Cauchy-Schwarz chain Q(b) >= F(b)^2/S(b) >= 3 F(b)^2/b^3 and T(M) = 2 sum_{b<=M} Q(b)/b^2 against the first-moment floor.
Inputs (text/arrays of lane s5-route-m-divisor-sign-second-moment, read as data): zeta Q(b), F(b) for b <= 1e6; periodic F for b <= 5000."""
import numpy as np, math, json, sys
S5 = '../../s5-route-m-divisor-sign-second-moment/out/'
def S_arith(B):
    """S(b) = sum_{a=2,(a,b)=1}^{b-1} a^2 and phi(b), by Moebius over squarefree d"""
    mu = np.ones(B + 1, dtype=np.int64); pr = np.ones(B + 1, dtype=bool)
    for p in range(2, B + 1):
        if pr[p]:
            pr[2 * p::p] = False; mu[p::p] *= -1
            if p * p <= B: mu[p * p::p * p] = 0
    S = np.zeros(B + 1); phi = np.zeros(B + 1)
    for d in range(1, B + 1):
        if mu[d] == 0: continue
        n = np.arange(1, B // d + 1, dtype=np.float64)
        S[d::d] += mu[d] * d * d * (n * (n + 1) * (2 * n + 1) / 6); phi[d::d] += mu[d] * n
    S[2:] -= 1.0
    return S, phi
def chain(name, b, F, Q, S, phi, kappa, s0, out):
    ok = (b >= 3) & (F != 0)
    b = b[ok]; F = F[ok]; Q = Q[ok]; S = S[ok]; phi = phi[ok]
    loss = Q * S / F ** 2
    T = np.cumsum(2 * Q / b ** 2); C1 = np.cumsum(2 * F ** 2 / (b ** 2 * S)); C2 = np.cumsum(6 * F ** 2 / b ** 5)
    rec = dict(name=name, bmax=int(b[-1]), cs_violations=int((loss < 1 - 1e-12).sum()), loss_min=float(loss.min()), loss_min_b=int(b[np.argmin(loss)]),
               kappa_F=kappa, target_slope_36k2_over_pi2=36 * kappa ** 2 / math.pi ** 2, s0_F=s0, T_slope_limit_12s0_over_pi2=12 * s0 / math.pi ** 2 if s0 else None)
    cps = [m for m in (30, 100, 300, 1000, 3000, 5000, 10000, 100000, 1000000) if m <= b[-1]]
    rows = []
    for i, m in enumerate(cps):
        j = np.searchsorted(b, m, side='right') - 1
        hi = b <= m; lo = b > m / 2
        row = dict(M=m, T=float(T[j]), CS_floor=float(C1[j]), crude_floor=float(C2[j]), loss_mean_top_half=float(loss[hi & lo].mean()), loss_max_top_half=float(loss[hi & lo].max()),
                   kappa_b_min_top_half=float((F / (phi * b))[hi & lo].min()), kappa_b_max_top_half=float((F / (phi * b))[hi & lo].max()))
        if i > 0:
            j0 = np.searchsorted(b, cps[i - 1], side='right') - 1; dl = math.log(m / cps[i - 1])
            row.update(T_slope=float((T[j] - T[j0]) / dl), CS_slope=float((C1[j] - C1[j0]) / dl), crude_slope=float((C2[j] - C2[j0]) / dl))
        rows.append(row)
    rec['rows'] = rows; out.append(rec)
    print(name, 'CS violations', rec['cs_violations'], 'min loss', round(rec['loss_min'], 4), 'at b', rec['loss_min_b'], 'target slope', round(rec['target_slope_36k2_over_pi2'], 4))
    for r in rows: print('   M=%-8d T=%.5f slope T %s  CS floor slope %s  crude %s  loss mean %.4f max %.4f  kappa(b) in [%.6f, %.6f]' % (r['M'], r['T'], format(r.get('T_slope', float('nan')), '.4f'), format(r.get('CS_slope', float('nan')), '.4f'), format(r.get('crude_slope', float('nan')), '.4f'), r['loss_mean_top_half'], r['loss_max_top_half'], r['kappa_b_min_top_half'], r['kappa_b_max_top_half']))
out = []
z = np.load(S5 + 'z1000000_qt_merged.npz'); B = len(z['Q']) - 1
print(f"# planned memory: 6 arrays of {B+1} float64 = {6*8*(B+1)/1e6:.0f} MB")
S, phi = S_arith(B); b = np.arange(B + 1, dtype=np.float64)
chain('zeta', b, z['F'], z['Q'], S, phi, 0.6954960511, 2.9193029855, out)
for nm, kap, s0 in (('chi4', None, 0.2608753), ('chi5', 0.1120952747, 0.0772737), ('DH', 0.4069850721, 0.5661151)):
    A = np.loadtxt(S5 + nm + '_P.txt'); bb = A[:, 0]; F = A[:, -1]; Q = A[:, 10]
    if kap is None: kap = float((F / (phi[bb.astype(int)] * bb))[-500:].mean())
    chain(nm, bb, F, Q, S[bb.astype(int)], phi[bb.astype(int)], kap, s0, out)
json.dump(out, open('../out/cs_chain.json', 'w'), indent=1)
