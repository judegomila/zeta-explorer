"""Decisive test, part 2: DH and backward heat (tau=-0.5), Gaussian windows, Krein and Hermitian zero sums against
zeta_S; plus the size of the multiplier weight on off-line pairs (all functions)."""
import numpy as np, json, math
from scipy.special import digamma
from lib import *
out = dict(rows=[], weights=[])
allp = primes_upto(1000); h = 0.01
def run(name, on, off, Hmax, Om_fun, PL, Deltas, Tmin):
    """on: heights of on-line zeros; off: array of (delta, gamma) with delta = Re z > 0 (pairs +-delta + i gamma)."""
    grid = np.arange(0.0, Hmax + 1, h); Om = Om_fun(grid); on = np.sort(np.asarray(on)); off = np.asarray(off).reshape(-1, 2); off = off[np.argsort(off[:, 1])]
    for P in PL:
        ps = allp[allp <= P]; m2 = np.abs(zS(0.5 + 1j * grid, ps)) ** 2
        von = np.abs(zS(0.5 + 1j * on, ps)) ** 2
        zp = zS(0.5 + off[:, 0] + 1j * off[:, 1], ps); zm = zS(0.5 - off[:, 0] + 1j * off[:, 1], ps)
        for Delta in Deltas:
            Ts = np.arange(max(Tmin, 6 * Delta + 1), Hmax - 6 * Delta, Delta)
            Rk = np.empty(len(Ts)); Rh = np.empty(len(Ts)); Ob = np.empty(len(Ts)); noff = np.empty(len(Ts))
            for i, T in enumerate(Ts):
                a = int((T - 6 * Delta) / h); b = int((T + 6 * Delta) / h) + 1; w = np.exp(-((grid[a:b] - T) / Delta) ** 2)
                den = h * np.dot(m2[a:b], w) / (2 * math.pi); Ob[i] = h * np.dot(m2[a:b] * Om[a:b], w) / (2 * math.pi) / den
                s_on = np.sum(von * np.exp(-((on - T) / Delta) ** 2))
                x = off[:, 1] - T; d = off[:, 0]; wr = np.exp(-(x * x - d * d) / Delta ** 2)
                kre = np.sum(2 * np.real(zp * np.conj(zm) * np.exp(2j * d * x / Delta ** 2)) * wr)
                her = np.sum((np.abs(zp) ** 2 + np.abs(zm) ** 2) * wr)
                Rk[i] = (s_on + kre) / den; Rh[i] = (s_on + her) / den; noff[i] = np.sum(np.abs(x) < 2 * Delta)
            st = lambda v: dict(min=float(v.min()), max=float(v.max()), mean=float(v.mean()))
            row = dict(fn=name, P=int(P), Delta=Delta, nwin=len(Ts), Obar=float(Ob.mean()), R_krein=st(Rk), R_herm=st(Rh), E_krein=st(Rk - Ob), E_herm=st(Rh - Ob),
                       neg_krein=int(np.sum(Rk < 0)), windows_with_offline=int(np.sum(noff > 0)), E_pos=int(np.sum(Rk - Ob > 0)))
            out['rows'].append(row)
            print('%-6s P=%-4d D=%-4s nwin=%-4d Obar %.2f | Krein R min %9.3f mean %7.3f max %9.3f neg %3d | Herm R min %7.3f mean %9.3f max %11.3f | E_krein>0 in %d' %
                  (name, P, Delta, len(Ts), row['Obar'], Rk.min(), Rk.mean(), Rk.max(), row['neg_krein'], Rh.min(), Rh.mean(), Rh.max(), row['E_pos']), flush=True)
        if len(off):
            mean2 = float(np.prod(1 / (1 - 1 / ps.astype(float))))
            wrow = dict(fn=name, P=int(P), mean_sq=mean2, median_online=float(np.median(von) / mean2), median_pair=float(np.median(np.abs(zp * zm)) / mean2),
                        max_pair=float(np.max(np.abs(zp * zm)) / mean2), median_left=float(np.median(np.abs(zm) ** 2) / mean2), median_right=float(np.median(np.abs(zp) ** 2) / mean2))
            out['weights'].append(wrow); print('   weights/mean:', {k: (round(v, 5) if isinstance(v, float) else v) for k, v in wrow.items()}, flush=True)
g = zeta_zeros()
PL = [2, 3, 7, 30, 100, 1000]
# zeta reference on the same low range
run('zeta', g[g < 1000], np.zeros((0, 2)), 1000.0, Omega, PL, [2.0, 10.0], 30.0)
d = json.load(open('dh_zeros_1000.json'))
print('DH zeros: online', len(d['online']), 'offline pairs', len(d['offline']), 'bad boxes', d['bad'])
off = np.array([[z[0] - 0.5, z[1]] for z in d['offline']])
OmDH = lambda t: math.log(5 / math.pi) + np.real(digamma(0.75 + 0.5j * np.asarray(t)))
run('dh', d['online'], off, 1000.0, OmDH, PL, [2.0, 10.0], 30.0)
hz = json.load(open('heat_zeros_tau-0.5.json'))
run('heat', hz['real'], np.array(hz['offline']), 230.0, Omega, PL, [2.0, 5.0], 30.0)
run('zeta230', g[g < 230], np.zeros((0, 2)), 230.0, Omega, PL, [2.0, 5.0], 30.0)
# E_a and T-NR pair weights at zeta heights
a = 0.2
for P in PL:
    ps = allp[allp <= P]; mean2 = float(np.prod(1 / (1 - 1 / ps.astype(float))))
    zp = zS(0.5 + a + 1j * g, ps); zm = zS(0.5 - a + 1j * g, ps); z0 = zS(0.5 + 1j * g, ps)
    lam = float(np.sum(1.0 / (ps.astype(float) ** (1 - 2 * a) * 1.0)))
    wrow = dict(fn='ea', P=int(P), mean_sq=mean2, median_online=float(np.median(np.abs(z0) ** 2) / mean2), median_pair=float(np.median(np.abs(zp * zm)) / mean2),
                median_left=float(np.median(np.abs(zm) ** 2) / mean2), median_right=float(np.median(np.abs(zp) ** 2) / mean2), sum_p_pow=lam,
                mean_log_left=float(np.mean(np.log(np.abs(zm)))), mean_log_right=float(np.mean(np.log(np.abs(zp)))), mean_log_online=float(np.mean(np.log(np.abs(z0)))))
    out['weights'].append(wrow); print('   ea weights:', {k: (round(v, 5) if isinstance(v, float) else v) for k, v in wrow.items()}, flush=True)
json.dump(out, open('test3.json', 'w'), indent=1)
