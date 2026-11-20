import sys, time, mpmath as mp
sys.path.insert(0, sys.argv[1]); from hlib import *
for dps in (120, 300):
    mp.mp.dps = dps
    s = mp.mpf('0.0225'); t0 = time.time()
    for d in (0, mp.mpf('0.03'), mp.mpf('1.5'), mp.mpf('3.9')):
        val = arch_int(mp.mpf(3)/4, d, 2*s*s, mp.mpf(1))
    print(dps, time.time()-t0, mp.nstr(val, 30))
mp.mp.dps = 320
print(mp.nstr(arch_int(mp.mpf(3)/4, mp.mpf('3.9'), 2*s*s, mp.mpf(1)), 30))
