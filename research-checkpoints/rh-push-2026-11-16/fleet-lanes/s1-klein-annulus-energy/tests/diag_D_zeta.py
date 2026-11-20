"""grid-refinement check of the most negative masked value of D for zeta near 1e7 (alpha = 1, b = 0.05)"""
import sys; sys.path.insert(0, '.')
import numpy as np, lines, analyse, math
if __name__ == '__main__':
    yc = float(sys.argv[1]); alpha = float(sys.argv[2]); b = float(sys.argv[3])
    for dy in (0.005, 0.0025, 0.00125):
        o = lines.compute('ZETA', yc - 1.0, 2.0, dy, 4.0, xs=[0.0, b], workers=8)
        y = o['y']; mt, _ = analyse.minus_theta_prime(o, alpha); Tb, R = analyse.T_b(o, b, alpha); D = mt - Tb
        u = analyse.u_line(o, b, alpha)
        sel = (y > yc - 0.3) & (y < yc + 0.3)
        k = np.argmin(np.where(sel, D, np.inf))
        print('dy %g: D at y=%.4f: %.4e ; min D in +-0.3: %.4e at %.4f ; -theta\' %.6f ; max |u| within 1: %.3f ; max|u\'\'| dy^2 within 1: %.3f' % (
            dy, yc, D[np.argmin(abs(y - yc))], D[k], y[k], mt[np.argmin(abs(y - yc))], np.abs(u[(y > yc - 1) & (y < yc + 1)]).max(),
            np.abs(np.diff(u[(y > yc - 1) & (y < yc + 1)], 2)).max()), flush=True)
