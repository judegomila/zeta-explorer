# c1_dh_boxes.py : winding counts of an object in boxes to the right of the critical line, to classify windows by their
# off-line zeros.  Box: Re s in [0.52, 2.0], Im s in [c + 4j, c + 4(j+1)], j = -3..2 (window core |t - c| <= 12 = 3H for H = 4).
# float64 phases (MEASURED, not a certificate); largest phase step reported.
# usage: c1_dh_boxes.py <obj> <T0> <out.json> off1,off2,...
import sys, json, math, numpy as np, objs
nm = sys.argv[1]; T0 = float(sys.argv[2]); outp = sys.argv[3]; offs = [float(x) for x in sys.argv[4].split(',')]
coef = objs.OBJ_PER[nm]; s0, s1, ds, dt = 0.52, 2.0, 0.004, 0.004
def val(sig, u):
    return objs.periodic_line(T0, u, coef, sigma=sig)
cuts = np.array([o + 4*j for o in offs for j in range(-3, 4)])
sig = np.arange(s0, s1+ds/2, ds)
Hc = np.array([val(float(sg), cuts) for sg in sig])               # (nsig, ncuts)
out = {'obj': nm, 'T0': T0, 'box': [s0, s1], 'windows': []}
def dphase(z):
    d = np.angle(z[1:]/z[:-1]); return float(d.sum()), float(np.abs(d).max())
for wi, o in enumerate(offs):
    tt = np.arange(o-12, o+12+dt/2, dt); Lv = val(s0, tt); Rv = val(s1, tt); cnts = []; mx = 0
    for j in range(6):
        k0 = int(round(j*4/dt)); k1 = int(round((j+1)*4/dt))
        b = Hc[:, wi*7+j]; t_ = Hc[:, wi*7+j+1]
        p1, m1 = dphase(b)                    # bottom, sigma increasing
        p2, m2 = dphase(Rv[k0:k1+1])          # right, t increasing
        p3, m3 = dphase(t_[::-1])             # top, sigma decreasing
        p4, m4 = dphase(Lv[k0:k1+1][::-1])    # left, t decreasing
        cnts.append((p1+p2+p3+p4)/(2*math.pi)); mx = max(mx, m1, m2, m3, m4)
    w = {'centre': T0+o, 'sub_box_counts': [round(c, 6) for c in cnts], 'total': int(round(sum(cnts))), 'max_phase_step': mx}
    out['windows'].append(w); print(json.dumps(w), flush=True)
json.dump(out, open(outp, 'w'), indent=1)
