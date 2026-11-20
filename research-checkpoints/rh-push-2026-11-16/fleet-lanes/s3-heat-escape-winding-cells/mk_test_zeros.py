import numpy as np
from flint import acb, ctx
ctx.prec=64
z=acb.zeta_zeros(1,6000)
np.save('out/zeta_6000_local.npy', np.array([float(q.imag.mid()) for q in z]))
