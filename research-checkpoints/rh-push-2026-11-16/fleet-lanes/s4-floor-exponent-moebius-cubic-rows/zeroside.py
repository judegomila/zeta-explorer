# Combination 1, zero side: Weil form on [-a,a] from a zero table, Q = sum over zeros z (s = 1/2 + i z) of v(z) v(z)^T,
# v_n(z) = int phi_n(x) cos(z x) dx (even sector) or int phi_n(x) sin(z x) dx (odd sector), same basis as wf.py.
# Used for the backward heat control (no Dirichlet series) and as a check of the coefficient side for zeta and DH.
# Zeros above the table height H = 2000 are omitted: on-line zeros contribute a positive semidefinite part, off-line pairs above H are
# weighted by |v(z)|^2 <~ (degree/(a H))^8 for this basis. Float64; MEASURED.
import sys, json, math, os
import numpy as np
from numpy.polynomial.legendre import leggauss
import wf, objs
B12 = '../c12-control-battery-harness/tables/'; B13 = '../c13-repair-map-engine-battery-records/records_corrected/'
def zeros(code):
    fn = {'ZETA': B12 + 'zeros_ZETA.json', 'DH': B12 + 'zeros_DH.json', 'HEAT--0.5': B13 + 'zeros_HEAT--0.5.corrected.json', 'HEAT--0.1': B12 + 'zeros_HEAT--0.1.json'}[code]
    d = json.load(open(fn))
    on = np.array([float(g) for g in (d['gamma'] if code == 'ZETA' else d['online'])])
    off = np.array([[float(o[0]), float(o[1])] for o in d.get('offline', [])]).reshape(-1, 2)
    if code == 'DH' and len(off): off[:, 0] -= 0.5           # DH table lists Re s; HEAT lists Re z
    return on, off
def zform(on, off, a, N, par):
    Mq = int(2*N + 2.2*a*2000/math.pi + 80); y, w = leggauss(Mq)
    Ph = wf.phis(y, N, par)*w[:, None]*math.sqrt(a)                    # phi_n(a y) a dy = a^{1/2} p_n(y)(1-y^2)^3 dy
    f = np.cos if par == 0 else np.sin
    V = f(np.outer(on*a, y)) @ Ph; Q = 2.0*(V.T @ V)
    if len(off):
        z = (off[:, 1] - 1j*off[:, 0])*a; Vc = f(np.outer(z, y)) @ Ph; Q += 4.0*(Vc.T @ Vc).real
    return 0.5*(Q + Q.T)
if __name__ == '__main__':
    N = int(os.environ.get('NB', 170)); out = {}
    AG = [float(x) for x in np.arange(0.6, 3.21, 0.1)]
    Bs = wf.Basis(N)
    NMAX = int(math.exp(2*AG[-1])) + 3; TAB = wf.sieve_mangoldt(NMAX)
    cs = {'ZETA': objs.spec_zeta(NMAX, TAB), 'DH': objs.spec_periodic(objs.dh_coeffs(), 5, 1, NMAX, 'DH')}
    for code in ('ZETA', 'DH', 'HEAT--0.5', 'HEAT--0.1'):
        on, off = zeros(code); rows = []
        print(code, 'on-line', len(on), 'off-line pairs', len(off), 'lowest off-line', off[np.argsort(off[:, 1])[:2]].tolist() if len(off) else None, flush=True)
        for a in AG:
            lz = [float(np.linalg.eigvalsh(zform(on, off, a, N, par))[0]) for par in (0, 1)]
            row = dict(a=a, X=math.exp(2*a), lam_zero=lz)
            if code in cs:
                Qc = Bs.forms(cs[code], a); row['lam_coef'] = [float(np.linalg.eigvalsh(Q)[0]) for Q in Qc]
                row['max_entry_diff'] = [float(np.abs(zform(on, off, a, N, par) - Qc[par])[:40, :40].max()) for par in (0, 1)]
            rows.append(row)
            print('  a=%.2f X=%8.1f zero side (% .4e, % .4e)' % (a, row['X'], lz[0], lz[1]) + ('  coefficient side (% .4e, % .4e)  max diff on the 40x40 low block %.1e' % (row['lam_coef'][0], row['lam_coef'][1], max(row['max_entry_diff'])) if code in cs else ''), flush=True)
        out[code] = rows
    json.dump(out, open(sys.argv[1], 'w'), indent=1)
