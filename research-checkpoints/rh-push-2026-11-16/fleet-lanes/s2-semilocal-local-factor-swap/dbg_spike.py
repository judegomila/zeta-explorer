import sys, math, numpy as np
sys.argv = ['x', '2', sys.argv[1], '/tmp/s2lf_dbg_out', '0']
src = open('symbol2.py').read().split("ts = np.arange(0, 60.0001, 0.02)")[0]
exec(src)
import sisum
for k in (1, 8, 20, 30):
    d = np.array([0.1, -0.2, 0.01, 1e-4])
    a = delta_spike(k, d); b = sisum.delta_grid(name, p, np.exp(k * LP + d))
    print(name, k, a, b)
