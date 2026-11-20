"""window of a zero list as an npz for run.py.  Usage: winlist.py LIST.npy I0 N OUT.npz   |   winlist.py zeta T0 N OUT.npz (Arb zeros from height T0)"""
import sys, math, numpy as np
if sys.argv[1] == 'zeta':
    from flint import acb, ctx
    ctx.prec = 80; T = float(sys.argv[2]); n0 = int(T / (2 * math.pi) * math.log(T / (2 * math.pi * math.e)) + 7 / 8) + 2
    on = np.array([float(z.imag.mid()) for z in acb.zeta_zeros(n0, int(sys.argv[3]))])
else:
    g = np.load(sys.argv[1], mmap_mode='r'); i0 = int(float(sys.argv[2])); on = np.asarray(g[i0:i0 + int(sys.argv[3])], dtype=np.float64)
np.savez(sys.argv[4], on=on, offx=np.zeros(0), offg=np.zeros(0)); print(sys.argv[4], len(on), on[0], on[-1])
