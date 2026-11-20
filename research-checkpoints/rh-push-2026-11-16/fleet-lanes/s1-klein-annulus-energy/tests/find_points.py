"""locate, on small local windows, the nodes of minimal u_b and minimal -theta' for each control (input to recheck_points.py)"""
import sys; sys.path.insert(0, '.')
import numpy as np, lines, analyse
if __name__ == '__main__':
    specs = []
    for code, T0, ell in [('DH', 80.0, 12.0), ('EA:1/8', 1000.0, 10.0), ('EA:3/10', 1000.0, 10.0), ('TNR', 1000.0, 12.0), ('ZETA', 1e6, 10.0), ('LCHI3', 1000.0, 10.0)]:
        o = lines.compute(code, T0, ell, 0.005, 2.0, xs=[0.0, 0.05, 0.1, 0.25], workers=8)
        i0, M = analyse.central(o); y = o['y'][i0:i0 + M]
        for alpha in (1.0,):
            mt, _ = analyse.minus_theta_prime(o, alpha); mt = mt[i0:i0 + M]
            for b in (0.05, 0.1, 0.25):
                u = analyse.u_line(o, b, alpha)[i0:i0 + M]
                ku = int(np.argmin(u)); kt = int(np.argmin(mt))
                print('POINT %s|%g|%g|%.3f|%.3f   float64: u_b %.12g  -theta\' %.12g' % (code, alpha, b, y[ku], y[kt], u[ku], mt[kt]), flush=True)
