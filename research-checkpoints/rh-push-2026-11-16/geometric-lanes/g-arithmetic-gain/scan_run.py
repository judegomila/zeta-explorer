# Height scan: e_N(d,c) for zeta, L(s,chi_5) (Euler product) and Davenport-Heilbronn (no Euler product)
import numpy as np, mpmath as mp, json
from gain import *
from ctl_run_fn import Lchi
h = 1/32; t = np.arange(-10, 110+h/2, h)
fns = {"zeta": mp.zeta, "Lchi5": Lchi, "DH": dh}
vals = {k: np.array([complex(F(mp.mpc(0.5, float(x)))) for x in t]) for k,F in fns.items()}
np.save("scan_vals.npy", np.array([vals[k] for k in fns]))
cs = np.arange(30, 70.01, 0.25)
out = {}
for name in fns:
    for d in (0.5, 0.25):
        for N in (4, 16, 48):
            es = []
            for c in cs:
                u = t - c
                e,_ = eN(u, vals[name], d, c, N, name=="zeta")
                es.append(e)
            es = np.array(es); out["%s_%g_%d"%(name,d,N)] = es.tolist()
            print("%-6s d=%g N=%2d  min %.4f  median %.4f  max %.4f  pass(<15/16) %d/%d  argmax c=%.2f"%(name,d,N,es.min(),np.median(es),es.max(),(es<15/16).sum(),len(es),cs[es.argmax()]), flush=True)
json.dump(out, open("scan_out.json","w"))
