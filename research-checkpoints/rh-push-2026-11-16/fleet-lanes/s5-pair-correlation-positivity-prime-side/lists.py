"""Zero lists (read-only): name -> dict(t0, d, x, q).  t = t0 + d; x = unfolded ordinate (smooth counting function of the family).
Server paths by default; S5_LOCAL=1 uses the 200k-zero sample in data/."""
import os, math, numpy as np
PI = math.pi
B = os.path.expanduser('~/rh-push/b-dyson-defect'); S = os.path.expanduser('~/rh-push/s1-zero-statistics-gram/out')
HERE = os.path.dirname(os.path.abspath(__file__))
SPECS = {
    'Z0': ('odl', B + '/zeros6', None, 1000.0),
    'Z7': ('blk', B + '/zeros_1e7.npz', None, None), 'Z8': ('blk', B + '/zeros_1e8.npz', None, None), 'Z9': ('blk', B + '/zeros_1e9.npz', None, None),
    'Z10': ('blk', B + '/zeros_1e10.npz', None, None), 'Z11': ('blk', B + '/zeros_1e11.npz', None, None), 'Z12': ('blk', B + '/zeros_1e12.npz', None, None),
    'CHI': ('lz', S + '/LZ.npz', 'CHI', 10000.0), 'CHIBAR': ('lz', S + '/LZ.npz', 'CHIBAR', 10000.0), 'DH': ('lz', S + '/LZ.npz', 'DH', 10000.0),
    'HEATa': ('heat', S + '/heat_-0.005.npz', None, None), 'HEATb': ('heat', S + '/heat_-0.02.npz', None, None), 'HEATc': ('heat', S + '/heat_-0.08.npz', None, None),
    'DH0': ('lz', S + '/LZ.npz', 'DH', 0.0),
    'ZS': ('odl', HERE + '/data/zeros6_200k.txt', None, 1000.0),
}

def xzeta(t):
    return (0.5 * t * np.log(t / (2 * PI)) - 0.5 * t - PI / 8 + 1 / (48 * t)) / PI + 1

def load(name, tmin=None):
    kind, path, key, tm = SPECS[name]
    if tmin is None: tmin = tm
    if kind == 'odl':
        t = np.loadtxt(path); x = xzeta(t); q = 1; t0 = 0.0; d = t
    elif kind in ('blk', 'heat'):
        z = np.load(path); t0 = float(z['T0']); d = np.asarray(z['delta'], dtype=np.float64); x = np.asarray(z['x'], dtype=np.float64); q = 1
    else:
        z = np.load(path); d = np.asarray(z['t_' + key], dtype=np.float64); x = np.asarray(z['x_' + key], dtype=np.float64); q = 5; t0 = 0.0
    if tmin is not None:
        m = (t0 + d) >= tmin; d = d[m]; x = x[m]
    return dict(name=name, t0=t0, d=d, x=x, q=q, kind=kind)
