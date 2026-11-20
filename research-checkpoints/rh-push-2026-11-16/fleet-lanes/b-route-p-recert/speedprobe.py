#!/usr/bin/env python3
"""speedprobe: single-process timing of the referee evaluate steps (gap_bound, full bound, cheap inherited bound) on a few boxes of floor IDX"""
import os, sys, time, json, importlib.util as ilu
T = os.environ['RTMP']
sp = ilu.spec_from_file_location('RF', f'{T}/r7-ref-full-cert.py'); RF = ilu.module_from_spec(sp); sp.loader.exec_module(RF)
C7 = RF.C7; L6 = RF.L6
IDX = int(sys.argv[1]); H = json.load(open(f'{T}/r6-fiber-out/p47_hybrid.json')); dd_ = H[IDX]; E = L6.entry(dd_['key'], dd_['file'])
tc = (E['tL'] + E['tR']) / 2; ac = (E['a_lo'] + E['a_hi']) / 2
DT = float(E['tR'] - E['tL']) / 2 * (1 + 1e-12); DA = float(E['a_hi'] - E['a_lo']) / 2 * (1 + 1e-12)
pc = C7.Piece(E, tc, ac, DT, DA); out = []
for b in [(0, 0, 0, 4, 6, 5), (0, 0, 0, 1, 2, 3), (2, 2, 2, 17, 26, 22), (3, 3, 3, 30, 50, 41)]:
    c, d = RF.fbox(b)
    t = time.process_time(); g, _ = pc.gap_bound(c, d); tg = time.process_time() - t
    t = time.process_time(); f, info = pc.bound(c, d, reuse5=True); tf = time.process_time() - t
    t = time.process_time(); ch, _ = pc.bound(c, d, Finh=info['Fconst']); tch = time.process_time() - t
    out.append(dict(b=b, gap=g, full=f, cheap=ch, tg=tg, tf=tf, tch=tch)); print(out[-1], flush=True)
json.dump(out, open(sys.argv[2], 'w'))
