# zeta zeros 1..40000 (height ~3.4e4) via Arb; saved as float64
import flint, numpy as np, time
t=time.time(); out=[]
for s in range(1,40001,2000):
    out += [float(z.imag.mid()) for z in flint.acb.zeta_zeros(s,2000)]
np.save('zeros40000.npy', np.array(out)); print(len(out), out[0], out[-1], time.time()-t)
