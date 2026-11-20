# c3_weil.py : Gaussian Weil functionals from the zero side for zeta and the controls (combination 3).
# Test function g(x) = exp(-x^2/(2 w^2)) cos(xi0 x)  (width w in x = log n, centre frequency xi0),
#   hhat(r) = w sqrt(pi/2) [exp(-w^2 (r-xi0)^2/2) + exp(-w^2 (r+xi0)^2/2)],
#   W_F(w, xi0) = sum over the divisor of F in the strip, with multiplicity (poles negative), of hhat(gamma), rho = 1/2 + i gamma.
# sech-type test g(x) = sech(x/(2L)) cos(xi0 x): hhat(r) = pi L [sech(pi L (r-xi0)) + sech(pi L (r+xi0))].
# Divisors below height 2000 from the control battery tables (c12-control-battery-harness/tables).
import sys, json, math, numpy as np
TB = '../c12-control-battery-harness/tables/'
def load(nm): return json.load(open(TB+'zeros_%s.json' % nm))
zz = np.array([float(x) for x in load('ZETA_2H')['gamma']])            # zeta ordinates below 4000
zeta = zz[zz < 2000]

def divisor(obj):
    """list of (gamma complex array, multiplicity) covering both signs of the ordinate; plus the list of off-line points (t, eta)."""
    if obj == 'ZETA': g = zeta.astype(complex); return [(np.concatenate([g, -g]), 1)], []
    if obj == 'DH':
        d = load('DH'); on = np.array([float(x) for x in d['online']]).astype(complex)
        off = [(float(g), float(b)-0.5) for b, g, _ in d['offline']]
        o = np.array([t - 1j*e for t, e in off] + [t + 1j*e for t, e in off])
        g = np.concatenate([on, o]); return [(np.concatenate([g, -g]), 1)], off
    if obj.startswith('EA'):
        a = {'EA-1_4': 0.25, 'EA-1_8': 0.125, 'EA-1_2': 0.5}[obj]
        g = np.concatenate([zeta - 1j*a, zeta + 1j*a]); return [(np.concatenate([g, -g]), 1)], [(t, a) for t in zeta]
    if obj == 'TNR3' or obj == 'TNR1000003':
        q = 3 if obj == 'TNR3' else 1000003; c = 2.2; L = math.log(q); e = math.acosh(c/2)/L
        k = np.arange(0, int(2000*L/(2*math.pi))+1); t = math.pi*(2*k+1)/L; t = t[t < 2000]
        loc = np.concatenate([t - 1j*e, t + 1j*e]); g = np.concatenate([zeta.astype(complex), loc])
        return [(np.concatenate([g, -g]), 1)], [(float(x), e) for x in t]
    if obj == 'WT':
        al = 1.2393168126993495; return [(np.concatenate([zeta - al, -zeta - al]).astype(complex), 1)], []
    if obj == 'SGN-LIOU':
        # zeta(2s)/zeta(s): poles at the zeta zeros (on the line) and at s = 1/2; zeros at rho/2 (Re = 1/4: eta = -1/4, ordinate gamma/2) and at s = 1
        zq = zz/2; zq = zq[zq < 2000]
        zer = np.concatenate([zq + 0.25j, -zq + 0.25j, np.array([-0.5j])])      # rho = 1/4 + i t -> gamma = t + i/4 ; s = 1 -> gamma = -i/2
        pol = np.concatenate([zeta, -zeta, np.array([0.0])]).astype(complex)
        return [(zer, 1), (pol, -1)], [(float(t), 0.25) for t in zq]
    if obj.startswith('HEAT'):
        d = load(obj); on = np.array([float(x) for x in d['online']]).astype(complex)
        off = [(float(r[1]), float(r[0])) for r in d['offline']]
        o = np.array([t - 1j*e for t, e in off] + [t + 1j*e for t, e in off]); g = np.concatenate([on, o])
        return [(np.concatenate([g, -g]), 1)], off
    raise ValueError(obj)

def W_gauss(div, w, xi):
    """w: array (nw,), xi: array (nx,) -> (nw, nx) real"""
    out = np.zeros((len(w), len(xi)))
    for g, m in div:
        for i, ww in enumerate(w):
            sel = np.abs(g.real[None, :] - xi[:, None]) < 9.0/ww + 1.0           # (nx, ng) mask, only near terms
            # evaluate sparsely
            ix, ig = np.nonzero(sel)
            z = g[ig] - xi[ix]; val = np.exp(-ww*ww*z*z/2).real
            out[i] += m*ww*math.sqrt(math.pi/2)*np.bincount(ix, weights=val, minlength=len(xi))
    return out

def W_sech(div, L, xi):
    out = np.zeros(len(xi))
    for g, m in div:
        sel = np.abs(g.real[None, :] - xi[:, None]) < 14.0/L
        ix, ig = np.nonzero(sel); z = g[ig] - xi[ix]
        out += m*math.pi*L*np.bincount(ix, weights=(1/np.cosh(math.pi*L*z)).real, minlength=len(xi))
    return out

if __name__ == '__main__':
    objsl = ['ZETA', 'WT', 'DH', 'EA-1_4', 'EA-1_8', 'TNR3', 'TNR1000003', 'SGN-LIOU', 'HEAT--0.1', 'HEAT--0.5']
    widths = np.geomspace(0.05, 40.0, 400); out = {'widths': [float(widths[0]), float(widths[-1]), 400], 'objects': {}}
    xi_grid = np.linspace(20.0, 1700.0, 200)
    for ob in objsl:
        div, off = divisor(ob); r = {}
        Wg = W_gauss(div, widths, xi_grid)                       # the stated grid: 400 widths x 200 centres
        neg = Wg < 0; r['grid_fraction_negative'] = float(neg.mean()); r['grid_min'] = float(Wg.min())
        r['grid_smallest_negative_width'] = float(widths[np.where(neg.any(axis=1))[0][0]]) if neg.any() else None
        # targeted scan: for each off-line point (t0, eta), centres t0 + delta, |delta| <= 4/w, smallest width with a negative value
        best = None; offs = [(t, e) for t, e in off if 20 < t < 1700]
        if ob in ('EA-1_4', 'EA-1_8', 'TNR3', 'TNR1000003', 'SGN-LIOU'): offs = offs[::max(1, len(offs)//60)]
        for t0, eta in offs:
            for i, ww in enumerate(widths):
                xi = t0 + np.linspace(-4/ww, 4/ww, 81)
                v = W_gauss(div, np.array([ww]), xi)[0]
                if v.min() < 0:
                    if best is None or ww < best['width']:
                        best = {'width': float(ww), 't_off': t0, 'eta': eta, 'value': float(v.min()), 'centre': float(xi[v.argmin()]),
                                'width_times_eta': float(ww*eta), 'log_gamma_over_2pi': math.log(t0/(2*math.pi)), 'ratio_width_to_log': float(ww/math.log(t0/(2*math.pi)))}
                    break
        r['targeted_smallest_negative'] = best
        # p-average at the seam scale L = 1 (sech(x/2): the Gram kernel), and L = 0.5, 0.9 ; centres on a fine grid
        xi_f = np.arange(20.0, 1700.0, 0.05)
        for L in (0.5, 0.9, 1.0):
            ws = W_sech(div, L, xi_f); r['sech_L%g' % L] = {'min': float(ws.min()), 'centre_of_min': float(xi_f[ws.argmin()]), 'mean': float(ws.mean())}
        r['n_offline_points'] = len(off); r['max_eta'] = max([e for _, e in off], default=0.0)
        out['objects'][ob] = r; print(ob, json.dumps(r), flush=True)
        json.dump(out, open('c3_zero_side.json', 'w'), indent=1)
