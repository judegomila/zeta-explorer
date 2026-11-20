"""summarize_ff.py: tables from out_server/st_q*_g*.json (streaming census) and recheck.json. usage: summarize_ff.py dir recheck.json"""
import sys, json, glob, math, os
d = sys.argv[1]; rc = {(r['q'], r['g']): r for r in json.load(open(sys.argv[2]))} if len(sys.argv) > 2 and os.path.exists(sys.argv[2]) else {}
S = sorted((json.load(open(f)) for f in glob.glob(d + '/st_q*_g*.json')), key=lambda s: (s['g'], s['q']))
print('| g | q | tested | members | RH | fakes | N_det histogram (N: count) | N_det = 2g | pass T_{g+1} | pass Serre d<=g | pass both | min Lambda (stream) | minimiser c_1..c_g | nu | N_det | Serre | eps | Lambda (mpmath) |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for s in S:
    m = s['minimisers'][0] if s['minimisers'] else None; r = rc.get((s['q'], s['g']))
    print(f"| {s['g']} | {s['q']} | {s['tested']} | {s['members']} | {s['rh']} | {s['fakes']} | {', '.join(k + ': ' + str(v) for k, v in s['ndet_hist'].items())} | {s['fakes_ndet_2g']} | {s['fakes_pass_T_gplus1']} | {s['fakes_pass_serre_d_le_g']} | {s['fakes_pass_serre_and_T_gplus1']} | "
          + (f"{m['Lam']:.6g} | {m['c']} | {m['nu']} | {m['ndet']} | {'pass' if m['serre'] else 'reject'} | " if m else '- | - | - | - | - | ')
          + (f"{r['eps']:.4g} | {r['Lam_mp']:.9g} |" if r else '- | - |'))
print()
import numpy as np
for g in sorted(set(s['g'] for s in S)):
    pts = [(s['q'], s['minimisers'][0]['Lam']) for s in S if s['g'] == g and s['minimisers'] and s['q'] >= 4]
    if len(pts) >= 4:
        x = np.log([p[0] for p in pts]); y = np.log([p[1] for p in pts]); sl, ic = np.polyfit(x, y, 1)
        print(f'g={g}: least-squares fit of log(min Lambda) against log q over q in [{pts[0][0]}, {pts[-1][0]}] ({len(pts)} points): slope {sl:.3f}')
