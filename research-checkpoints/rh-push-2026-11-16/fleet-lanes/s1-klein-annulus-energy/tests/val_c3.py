"""validation of combination (3): the identity W_h(t)/h = int_0^inf omega_{a,h}(r) C_a(t,r) dr under grid refinement
(zeta, window [30,34]); and the polynomial control F = z^2 - delta^2 of the source (sec 7) where everything is closed form."""
import sys; sys.path.insert(0, '.')
import numpy as np, math, lines, analyse
if __name__ == '__main__':
    for dy in (0.005, 0.0025, 0.00125):
        o = lines.compute('ZETA', 30.0, 4.0, dy, 8.0, workers=8)
        r = analyse.combo3(o, tstep=0.1)
        print('dy', dy, ' '.join('(a=%g,h=%g): %.2e' % (x['a'], x['h'], x['identity_max_rel_dev']) for x in r))
    # closed-form control: U_a(t) = a^2 - delta^2 - t^2 + 2 i a t ; W(1/2+h+it)/h = |F|^2 Re(F'/F)/h = 2 (h^2 + t^2 - delta^2)... check by quadrature
    a, h, delta, t = 0.5, 0.2, 0.3, 0.7
    r = np.linspace(0, 12 * a, 200001); om = analyse.omega(r, a, h)
    C = 2 * (a * a - delta * delta + t * t - r * r)                 # source sec 7
    I = np.trapezoid(om * C, r)
    z = complex(h, t); F = z * z - delta ** 2; W = (abs(F) ** 2 * (2 * z / F).real)
    print('polynomial control: integral %.12f  W_h/h %.12f' % (I, W / h))
