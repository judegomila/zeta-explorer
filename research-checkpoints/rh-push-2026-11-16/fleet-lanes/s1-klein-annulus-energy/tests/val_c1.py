"""validation of combination (1) code against the recorded numbers of c5-device-table-extension (alpha = 0.2)."""
import sys; sys.path.insert(0, '.')
import numpy as np, lines, analyse
if __name__ == '__main__':
    o = lines.compute('ZETA', 20.0, 20.0, 0.005, 8.0, xs=[0.0, 0.25, 0.5], workers=6)
    mt, im = analyse.minus_theta_prime(o, 0.2); Tb, R = analyse.T_b(o, 0.5, 0.2); y = o['y']
    for yy, ref_m, ref_T in [(27.0, 0.17874572297635843, 0.17869413195376063), (28.3, 0.16969314474507, 0.1696783148537951), (31.7, 0.5443994507119823, 0.53490158725457)]:
        j = int(round((yy - y[0]) / 0.005)); print('zeta y=%g  -theta\' %.12f (ref %.12f)  T_b %.12f (ref %.12f)' % (y[j], mt[j], ref_m, Tb[j], ref_T))
    o = lines.compute('DH', 80.0, 12.0, 0.005, 12.0, xs=[0.0, 0.25, 0.75], workers=6)
    mt, im = analyse.minus_theta_prime(o, 0.2); Tb, R = analyse.T_b(o, 0.75, 0.2); y = o['y']
    for yy, ref_m, ref_T in [(84.9, 0.9454423496548818, 0.9975681046889125), (85.7, -7.795251181810929, 1.733909804634674), (86.4, 1.3710343368887064, 1.3387536819241277)]:
        j = int(round((yy - y[0]) / 0.005)); print('DH y=%g  -theta\' %.12f (ref %.12f)  T_b %.12f (ref %.12f)' % (y[j], mt[j], ref_m, Tb[j], ref_T))
