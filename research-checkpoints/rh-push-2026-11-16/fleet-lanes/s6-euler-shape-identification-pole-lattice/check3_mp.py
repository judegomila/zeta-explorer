"""Higher-precision recheck of test 3 at small N (mpmath eigsy, 30 digits) for zeta and DH at sigma = 1/2 (limit
normalisation), against the float64 values."""
import math, json, numpy as np, mpmath as mp, sys
sys.argv = ['x']
import importlib.util
spec = importlib.util.spec_from_file_location('g3', __file__.replace('check3_mp.py', 'gram3.py')); g3 = importlib.util.module_from_spec(spec); spec.loader.exec_module(g3)
mp.mp.dps = 30; N = 160; out = {}
s5 = mp.sqrt(5); xi = (mp.sqrt(10 - 2*s5) - 2)/(s5 - 1); a = [mp.mpf(0), mp.mpf(1), xi, -xi, mp.mpf(-1)]
Z = sum(x*x for x in a)
T = [[sum(a[(r*x) % 5]*a[(r*y) % 5] for r in range(5))/Z for y in range(5)] for x in range(5)]
for name in ('zeta', 'DH'):
    A = mp.matrix(N, N)
    for i in range(1, N+1):
        for j in range(1, N+1):
            g = math.gcd(i, j); ip = i//g; jp = j//g
            A[i-1, j-1] = (1 if name == 'zeta' else T[ip % 5][jp % 5])/mp.sqrt(ip*jp)
    E = mp.eigsy(A, eigvals_only=True); lo = min(E); hi = max(E)
    fl = np.linalg.eigvalsh(g3.build_dense(np, N, 0.5, g3.objects(N, 0.5)[name]))
    out[name] = dict(N=N, mp_min=mp.nstr(lo, 20), mp_max=mp.nstr(hi, 20), float_min=float(fl[0]), float_max=float(fl[-1]))
    print(name, out[name])
json.dump(out, open(__file__.replace('check3_mp.py', 'out/check3_mp.json'), 'w'), indent=1)
