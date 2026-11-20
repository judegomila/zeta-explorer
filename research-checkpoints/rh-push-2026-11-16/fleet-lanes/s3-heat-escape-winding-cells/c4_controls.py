"""Combination 4, controls at low height (battery tables of c12-control-battery-harness): largest window free of off-line pairs, walls at its ends,
and one wall through an off-line pair. Prints the wall commands' results."""
import json, math, subprocess, sys, os
import numpy as np
import hk
PY = sys.executable
def run_wall(kind, xw, tag):
    out = 'out/c4wall_%s.json' % tag
    subprocess.run([PY, 'window.py', 'wall', kind, repr(float(xw)), out, 'fine'], check=True, stdout=subprocess.DEVNULL)
    d = json.load(open(out)); return dict(tag=tag, kind=kind, xw=float(xw), R_min=d['R_min'], at=d['at'], real_axis_sign_constant=d['real_axis_sign_constant'])
res = {}
for kind, f, yfac in (('dh', 'zeros_DH.json', lambda b: 2*(b - 0.5)), ('heat:0.1', 'zeros_HEAT--0.1.json', lambda b: 2*b)):
    d = json.load(open(f))
    on = np.array([float(v) for v in d['online']]); off = np.array(sorted(float(g) for b, g, _ in d['offline']))
    gaps = np.diff(off); i = int(np.argmax(gaps))
    gL, gR = off[i], off[i+1]
    inside = on[(on > gL) & (on < gR)]
    # walls: centres of the largest on-line gaps among the first / last 8 on-line zeros inside (at least 3 zeros away from the pair)
    def centre(v):
        j = int(np.argmax(np.diff(v))); return 0.5*(v[j] + v[j+1])
    wl = centre(inside[2:12]); wr = centre(inside[-12:-2])
    cnt = int(((on > wl) & (on < wr)).sum())
    q = 5.0 if kind == 'dh' else 1.0
    Nmain = lambda T: T/(2*math.pi)*math.log(q*T/(2*math.pi*math.e))
    r = dict(kind=kind, offline_pairs=len(off), H=d['H'], first_offline_gamma=float(off[0]), largest_offline_free_gap_gamma=[float(gL), float(gR)], largest_gap_z=float(2*(gR - gL)),
             mean_gap_z=float(2*(off[-1] - off[0])/(len(off) - 1)), D_K_z=[921, 1639], window_z=[float(2*wl), float(2*wr)], online_in_window=cnt,
             main_term_count=Nmain(wr) - Nmain(wl), walls=[])
    r['walls'].append(run_wall(kind, 2*wl, kind.replace(':', '') + '_L'))
    r['walls'].append(run_wall(kind, 2*wr, kind.replace(':', '') + '_R'))
    r['walls'].append(run_wall(kind, 2*gL, kind.replace(':', '') + '_through_pair'))
    res[kind] = r; print(json.dumps(r), flush=True)
# T-NR: pairs at x = (k + 1/2) * 4 pi / log q, y0 = 2 arccosh(c/2)/log q
per = 4*math.pi/math.log(hk.TNR_Q); k = 10
r = dict(kind='tnr', pair_spacing_z=per, y0=2*math.acosh(hk.TNR_C/2)/math.log(hk.TNR_Q), window_z=[(k + 0.5)*per + 1.5, (k + 1.5)*per - 1.5], walls=[])
r['walls'].append(run_wall('tnr', (k + 0.5)*per + 1.5, 'tnr_L')); r['walls'].append(run_wall('tnr', (k + 1.5)*per - 1.5, 'tnr_R'))
r['walls'].append(run_wall('tnr', (k + 0.5)*per, 'tnr_through_pair'))
res['tnr'] = r; print(json.dumps(r), flush=True)
json.dump(res, open('out/c4_controls.json', 'w'), indent=1)
