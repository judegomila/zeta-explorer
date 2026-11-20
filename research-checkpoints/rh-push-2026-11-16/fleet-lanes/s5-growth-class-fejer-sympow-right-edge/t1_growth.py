"""s5 combination 1: growth exponent of abs psi_z(x) in x (slope of log abs psi against log x over x = 1e3..1e6), z = sigma + 20 i."""
import numpy as np, t1_resolvent as T
x = np.array([1e3, 1e4, 1e5, 1e6])
for o in ['ZETA', 'TNR3', 'TNRQ', 'L4', 'L5', 'DH']:
    row = []
    for sg in (0.2, 0.5, 0.8):
        v = np.abs(T.psi(o, x, [sg + 20j])[:, 0]); row.append((sg, np.polyfit(np.log(x), np.log(v), 1)[0]))
    print('%-5s' % o, '  '.join('sigma %.1f: %+.4f' % (sg, e) for sg, e in row), '   (pole term: 1 - sigma; pole-free: -sigma)', flush=True)
