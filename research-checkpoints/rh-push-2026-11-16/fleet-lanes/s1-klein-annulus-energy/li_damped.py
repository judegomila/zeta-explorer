"""s1-klein-annulus-energy, combination (2), damped form: D_n(S) = sum over zeros rho of h_S(rho) [1 - (1 - 1/rho)^n],
h_S(rho) = exp(-|rho - 1/2|^2/S^2) (the Gaussian damping of the node zv-gaussian-damped-extension evaluated at the zeros).
Zeros from the battery tables (ordinates below 2000; text json).  On-line zeros contribute 2 h (1 - cos(n theta)) >= 0 per
conjugate pair; an off-line quartet contributes h [4 - 2 Re w^n - 2 Re w^-n], w = 1 - 1/rho.
Reports the first n with D_n(S) < 0 and the scale 1/(1-|w_k|) of each off-line zero.   usage: li_damped.py out.json"""
import json, sys, math
import numpy as np

def zeros(code):
    z = json.load(open('tables/zeros_%s.json' % code))
    if code == 'ZETA':
        on = [float(v) for v in z['gamma']]; off = []
    else:
        on = [float(v) for v in z['online']]; off = [(float(v[0]), float(v[1])) for v in z['offline']]
        if code.startswith('HEAT'): off = [(0.5 + x, g) for x, g in off]       # table in z = s - 1/2
    return np.array(on), off

def first_negative(code, S, nmax=4_000_000, hmax=None):
    on, off = zeros(code)
    if hmax: on = on[on < hmax]; off = [v for v in off if v[1] < hmax]
    rho_on = 0.5 + 1j * on; lw_on = np.log(1 - 1 / rho_on)                # purely imaginary up to rounding
    th_on = lw_on.imag; h_on = np.exp(-on ** 2 / S ** 2)
    rho_off = np.array([complex(b, g) for b, g in off]) if off else np.zeros(0, dtype=complex)
    lw_off = np.log(1 - 1 / rho_off); h_off = np.exp(-np.abs(rho_off - 0.5) ** 2 / S ** 2)
    scale = [dict(beta=float(r.real), gamma=float(r.imag), h=float(h), inv_1_minus_absw=float(-1 / l.real), gamma2_over_x0=float(r.imag ** 2 / (r.real - 0.5)))
             for r, l, h in zip(rho_off, lw_off, h_off)]
    tot_on = float(2 * h_on.sum()); first = None; dmin = (float('inf'), 0)
    step = 2000
    for n0 in range(1, nmax + 1, step):
        n = np.arange(n0, min(nmax + 1, n0 + step))[:, None]
        D = 2 * (h_on[None, :] * (1 - np.cos(n * th_on[None, :]))).sum(1)
        if len(off):
            e = n * lw_off[None, :]
            with np.errstate(over='ignore'):
                D = D + (h_off[None, :] * (4 - 2 * np.exp(e).real - 2 * np.exp(-e).real)).sum(1)
        neg = np.nonzero(D < 0)[0]
        k = int(np.argmin(D))
        if D[k] < dmin[0]: dmin = (float(D[k]), int(n[k, 0]))
        if len(neg): first = int(n[neg[0], 0]); break
    return dict(code=code, S=S, n_online=len(on), n_offline_pairs=len(off), sum_h_online=tot_on, first_negative_n=first, searched_to=nmax if first is None else first,
                min_D=dmin, offline=sorted(scale, key=lambda v: v['inv_1_minus_absw'] * max(1.0, math.log(max(2.0, tot_on / max(v['h'], 1e-300)))))[:4])

if __name__ == '__main__':
    out = []
    # zeta: every term is 2 h (1 - cos) >= 0, so D_n(S) >= 0 for all n by the formula; the scan to 2e4 is a code check only
    for code, Ss, hmax, nmax in [('ZETA', (100,), None, 20000), ('DH', (50, 100, 200, 400), None, 4_000_000), ('HEAT--0.5', (25, 50, 100), 500, 4_000_000), ('HEAT--0.1', (400,), None, 4_000_000)]:
        for S in Ss:
            r = first_negative(code, S, nmax=nmax, hmax=hmax); out.append(r)
            o = r['offline'][0] if r['offline'] else None
            print(code, 'S=%g' % S, 'first negative n:', r['first_negative_n'], 'sum h on-line %.1f' % r['sum_h_online'],
                  ('| controlling off-line zero beta %.4f gamma %.3f: 1/(1-|w|) = %.0f, gamma^2/x0 = %.0f' % (o['beta'], o['gamma'], o['inv_1_minus_absw'], o['gamma2_over_x0'])) if o else '', flush=True)
    json.dump(out, open(sys.argv[1], 'w'), indent=1)
