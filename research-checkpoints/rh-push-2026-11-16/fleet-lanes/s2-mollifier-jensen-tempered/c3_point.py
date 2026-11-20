"""Point check of the source screen (dbn-lambda-below-015-research direct_ft_screen_summary.json): zeta, t = 0.13, 0.125, 0.12, N = 850000, fraction 0.999,
y^2 = 87677/2500000, with phases reduced in longdouble (source: IEEE double). Source values: |E f| = 0.915230628307, 0.915337415039, 0.914664398682."""
import os, sys, math, numpy as np, mpmath as mp
os.environ['S2_NOGPU'] = '1'
sys.argv = ['c3_heat.py', '1', '4', '0.25', 'import']
import core
from core import LD, TWOPI_LD, lnn_ld
src = open('c3_heat.py').read(); src = src[:src.index('def build_coefs')]
ns = {}; exec(src, ns)
print('extended longdouble:', core.EXT)
y = math.sqrt(87677 / 2500000); N = 850000
logs = lnn_ld(N); ln = logs.astype(np.float64)
for t, ref in ((0.13, 0.915230628307), (0.125, 0.915337415039), (0.12, 0.914664398682)):
    left = ns['x_n'](N, t); right = ns['x_n'](N + 1, t); x = left + 0.999 * (right - left)
    sst, kap, lg, g1, g2 = ns['centre'](x, y, t)
    base = np.fmod((LD(x) / 2) * logs, TWOPI_LD).astype(np.float64)
    dIm = float(sst.imag + mp.mpf(x) / 2); heat = (t / 4) * ln * ln
    A = np.sum(np.exp(heat - float(sst.real) * ln) * np.exp(1j * (base - dIm * ln)))
    B = complex(mp.exp(lg)) * np.sum(np.exp(heat + float(y - sst.real - kap.real) * ln) * np.exp(1j * (-base + (dIm - float(kap.imag)) * ln)))
    E = 1
    for p in (2, 3, 5, 7, 11, 13): E *= 1 - complex(mp.exp((mp.mpf(t) / 4) * mp.log(p) ** 2 - sst * mp.log(p)))
    v = E * (A + B)
    # the same with plain double phases, as in the source
    s_star = complex(sst); logs64 = np.log(np.arange(1, N + 1, dtype=np.float64))
    A64 = np.sum(np.exp(heat - s_star * logs64)); B64 = complex(mp.exp(lg)) * np.sum(np.exp(heat + y * logs64 - (np.conj(s_star) + complex(kap)) * logs64))
    v64 = E * (A64 + B64)
    print('t %.3f x %.3f: |E f| = %.12f, Re = %.12f (longdouble phases); %.12f (double phases); source %.12f' % (t, x, abs(v), v.real, abs(v64), ref))
