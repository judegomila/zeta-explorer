# c1_eval.py : evaluate F(1/2 + i(T0+u)) for all objects on the base grid and save (server, GPU for the long sums).
# usage: c1_eval.py <T0> <Umax> <out.npz> <names,comma> [h]
import sys, time, numpy as np, objs
T0 = float(sys.argv[1]); Umax = float(sys.argv[2]); outp = sys.argv[3]; names = sys.argv[4].split(',')
h = float(sys.argv[5]) if len(sys.argv) > 5 else 0.05
nU = int(round(Umax/h)); u = np.arange(-nU, nU+1)*h
print(f'T0={T0} grid {len(u)} h={h} GPU={objs.GPU}; planned phase block {8*4e7/1e9:.2f} GB', flush=True)
t0 = time.time(); vals = objs.eval_objects(T0, u, names, h=h)
sv = {'u': u, 'T0': T0, 'h': h}
for nm, v in vals.items():
    if isinstance(v, tuple):
        full = np.full(len(u), np.nan+0j); m = v[1]; full[m:len(u)-m] = v[0]; sv[nm] = full
    else: sv[nm] = v
np.savez(outp, **sv); print('saved', outp, f'{time.time()-t0:.0f}s', flush=True)
