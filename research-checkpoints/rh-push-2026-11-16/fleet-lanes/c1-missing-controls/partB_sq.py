"""Part B, sq-canonical-det: backward heat control for Suzuki's criterion ||K[t]|| < 1 (lane Lemma A).
   Theta_{tau,omega}(z) = F_tau(z - omega)/F_tau(z + omega) (bridge coordinate z = s - 1/2; Suzuki z_S = i z).
   Checked here: (a) |Theta| = 1 on the line Re z = 0; (b) boundedness on Re z = c (c = 1, 2) (causal kernel);
   (c) poles in Re z > 0: zeros of F_tau with Re > omega (from partB_heat_zeros.json) and their residues.
   By Lemma A(b) of the lane, ||K[T]|| < 1 for all T iff Theta is inner, so a pole in Re z > 0 gives failure at finite T*.
   MEASURED. Planned allocation < 20 MB."""
import json, sys
from heatlib import *
Z = json.load(open('partB_heat_zeros.json'))
out = {}
H = Heat(1000, 600.0)
def mid(s): return float(s.split('[')[1].split(' ')[0])
for tau in (-0.1, -0.5, -2.0):
    offs = []
    for k, rec in Z.items():
        if rec['tau'] == tau: offs += rec['offline_upper_right']
    offs.sort(key=lambda r: mid(r['gamma']))
    rec = {'offline_found': len(offs)}
    # (a) unimodularity on the line, (b) size on Re z = 1, 2
    for om in (0.1, 0.25):
        uni = []; bd = []
        for t in (3.0, 20.0, 57.3, 120.0):
            th = H.F(tau, acb(-om, t)) / H.F(tau, acb(om, t)); uni.append(float(abs(th).mid()) - 1)
            for c in (1.0, 2.0):
                bd.append(float(abs(H.F(tau, acb(c - om, t)) / H.F(tau, acb(c + om, t))).mid()))
        rec['omega=%g' % om] = dict(max_abs_dev_from_1_on_line=max(abs(x) for x in uni), max_modulus_on_Re_1_and_2=max(bd))
        poles = []
        for o in offs:
            d, g = mid(o['delta']), mid(o['gamma'])
            if d > om:
                z0, err = H.newton(tau, acb(d, g))
                f, f1 = H.F(tau, z0, True)
                c = H.F(tau, z0 - 2 * om) / f1
                poles.append(dict(delta=d, gamma=g, v=d - om, abs_residue=float(abs(c).mid()), ritz_degree_needed_at_t_2='p > %d' % int(2 * g)))
        rec['omega=%g' % om]['poles_Re_gt_omega'] = poles[:6]; rec['omega=%g' % om]['n_poles_found'] = len(poles)
    out['tau=%g' % tau] = rec
    print(tau, json.dumps(rec), flush=True)
json.dump(out, open('partB_sq.json', 'w'), indent=1)
