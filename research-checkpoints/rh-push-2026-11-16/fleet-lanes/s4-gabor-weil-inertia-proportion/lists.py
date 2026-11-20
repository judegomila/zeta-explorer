"""Zero lists on the compute server (read-only): name -> (t ordinates, x unfolded, conductor q)."""
import os, math, numpy as np
PI = math.pi
B = os.path.expanduser('~/rh-push/b-dyson-defect'); S = os.path.expanduser('~/rh-push/s1-zero-statistics-gram/out')
SPECS = {
    'Z0': ('odl', B + '/zeros6', None, 1000.0),
    'Z7': ('blk', B + '/zeros_1e7.npz', None, None), 'Z8': ('blk', B + '/zeros_1e8.npz', None, None), 'Z9': ('blk', B + '/zeros_1e9.npz', None, None),
    'Z10': ('blk', B + '/zeros_1e10.npz', None, None), 'Z11': ('blk', B + '/zeros_1e11.npz', None, None), 'Z12': ('blk', B + '/zeros_1e12.npz', None, None),
    'CHI': ('lz', S + '/LZ.npz', 'CHI', 10000.0), 'CHIBAR': ('lz', S + '/LZ.npz', 'CHIBAR', 10000.0), 'DH': ('lz', S + '/LZ.npz', 'DH', 10000.0),
    'HEATa': ('heat', S + '/heat_-0.005.npz', None, None), 'HEATb': ('heat', S + '/heat_-0.02.npz', None, None), 'HEATc': ('heat', S + '/heat_-0.08.npz', None, None),
}

def xzeta(t):
    return (0.5 * t * np.log(t / (2 * PI)) - 0.5 * t - PI / 8 + 1 / (48 * t)) / PI + 1

def load(name, tmin=None):
    kind, path, key, tm = SPECS[name]
    if tmin is None: tmin = tm
    if kind == 'odl':
        t = np.loadtxt(path); x = xzeta(t); q = 1
    elif kind in ('blk', 'heat'):
        z = np.load(path); t = float(z['T0']) + z['delta']; x = z['x']; q = 1
    else:
        z = np.load(path); t = z['t_' + key]; x = z['x_' + key]; q = 5
    if tmin is not None:
        m = t >= tmin; t = t[m]; x = x[m]
    return dict(name=name, t=np.asarray(t, dtype=np.float64), x=np.asarray(x, dtype=np.float64), q=q)
