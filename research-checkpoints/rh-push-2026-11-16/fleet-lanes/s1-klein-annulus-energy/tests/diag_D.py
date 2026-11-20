import sys; sys.path.insert(0, '.')
import numpy as np, lines, analyse
if __name__ == '__main__':
    for dy in (0.005, 0.00125):
        o = lines.compute('DH', 82.0, 8.0, dy, 6.0, xs=[0.0, 0.05, 0.1, 0.25], workers=8)
        i0, M = analyse.central(o); y = o['y'][i0:i0 + M]
        for alpha in (1.0, 0.2):
            mt, _ = analyse.minus_theta_prime(o, alpha)
            for b in (0.05, 0.1, 0.25):
                Tb, R = analyse.T_b(o, b, alpha); D = (mt - Tb)[i0:i0 + M]; u = analyse.u_line(o, b, alpha)[i0:i0 + M]
                k = np.argmin(D)
                print('dy %g al %g b %g: D min %.6g at y=%.4f, D mean %.6g, D max %.4g | u min %.4g at %.4f max %.4g at %.4f | 2pi/ell*... int D = %.6f' % (
                    dy, alpha, b, D[k], y[k], D.mean(), D.max(), u.min(), y[np.argmin(u)], u.max(), y[np.argmax(u)], D.sum() * dy / (2 * np.pi)))
