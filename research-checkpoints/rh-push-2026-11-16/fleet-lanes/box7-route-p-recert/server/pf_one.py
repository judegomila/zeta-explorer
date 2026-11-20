#!/usr/bin/env python3
"""pf_one.py IDX: preflight of one floor with the independent driver's own evaluate(): builds the Piece (loads the tables), evaluates
two level-0 boxes and one explicit full bound, reports peak resident memory.  Conditional on the route-P ledger; internal; not a theorem."""
import os, sys, json, time, math, resource, importlib.util as ilu
B = os.path.dirname(os.path.abspath(__file__)); os.environ['RTMP'] = B + '/tmp'
IDX = int(sys.argv[1]); t0 = time.time()
sp = ilu.spec_from_file_location('PAR', B + '/tmp/r7-ref-par-cert.py'); PAR = ilu.module_from_spec(sp); sp.loader.exec_module(PAR)
RF = PAR.RF; C7 = PAR.C7; L6 = PAR.L6
F36 = json.load(open(B + '/floors36.json'))[str(IDX)]
H = json.load(open(B + '/tmp/r6-fiber-out/p47_hybrid.json')); dd = H[IDX]
E = L6.entry(dd['key'], dd['file'])
tc = (E['tL'] + E['tR']) / 2; ac = (E['a_lo'] + E['a_hi']) / 2
DT = float(E['tR'] - E['tL']) / 2 * (1 + 1e-12); DA = float(E['a_hi'] - E['a_lo']) / 2 * (1 + 1e-12)
t1 = time.time(); pc = C7.Piece(E, tc, ac, DT, DA); t2 = time.time()
PAR.pc = pc; PAR.thr = F36['U']
cnt = dict(cheap=0, gap=0, full=0, exc=0, inf=0); vals = []
for b in ((0, 0, 0, 0, 0, 0), (0, 0, 0, 0, 6, 5)):
    ub, src, Fo = PAR.evaluate(b, None, math.inf, cnt); vals.append([list(b), ub, src])
c, d = RF.fbox((0, 0, 0, 4, 6, 5)); v, info = PAR.safe(pc.bound, cnt, c, d, reuse5=True); vals.append(['full(0,0,0,4,6,5)', v, 'full'])
print(json.dumps(dict(idx=IDX, cell=dd['cell'], key=dd['key'], K0_equal=E['K0star'] == F36['K0star'] == dd['K0star'], vals=vals, cnt=cnt,
                      import_s=t1 - t0, piece_s=t2 - t1, eval_s=time.time() - t2, maxrss_gb=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1048576)))
