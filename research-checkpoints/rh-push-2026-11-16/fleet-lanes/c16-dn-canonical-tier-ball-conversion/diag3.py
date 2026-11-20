"""c16 follow-up on the nodes flagged by the secondary read (amendment A1): b2-with reads only the A kernel, so the
positives' side can be tested on every primitive character.  For each flagged node: value L3 of log|K_chi| (balls,
128/256 bits) for all primitive characters of conductor 3..QMAX (one per conjugate pair), against the feasible
threshold interval [lo, up] and the best threshold.  usage: diag3.py <feas.json> <outjson> <QMAX>"""
import json, sys
import numpy as np
from flint import arb, ctx
import jobj, jk, nball, cball
d = json.load(open(sys.argv[1]))
QMAX = int(sys.argv[3])
R = [q for q in d['rows'] if q['res'] == 'ttrain' and q['secondary']['any']]
chars = jobj.char_objs(3, QMAX)
pairs = [jobj.Pair('X', jk.W(c), jk.W(c)) for c in chars]
print('flagged nodes %d; characters %d (conductor 3..%d)' % (len(R), len(chars), QMAX), flush=True)
out = []
tot_wrong_best = 0
viol = {}
for q in R:
    s, lo, up = q['ints'][0]
    lam = q['secondary']['best_rec']['lam']
    nball._CACHE.clear()
    vals = []
    for c, p in zip(chars, pairs):
        v = None
        for pr in (128, 256):
            ctx.prec = pr
            try:
                b = nball.bvalue('b2-with', q['u'], q['h'], p)[0]
            except Exception:
                continue
            if float(b.rad()) <= 1e-9 * max(1e-3, abs(float(b.mid()))):
                v = float(b.mid())
                break
        vals.append(v)
    # positives' side: sign s means V - lam has sign s
    wrong_best = [c.name for c, v in zip(chars, vals) if v is not None and (v - lam) * s < 0]
    wrong_all = [c.name for c, v in zip(chars, vals) if v is not None and ((v < lo) if s == 1 else (v > up))]   # wrong for every lam of the interval
    nov = sum(v is None for v in vals)
    tr = [c for c in chars if c.q <= 13]
    rec = dict(node=q['node'], u=q['u'], h=q['h'], s=s, lo=lo, up=up, lam=lam, chars=len(chars), no_value=nov,
               wrong_at_best_lam=len(wrong_best), wrong_for_every_lam=len(wrong_all), wrong_names=wrong_all[:12],
               wrong_training=[n for n in wrong_all if n in set(c.name for c in tr)])
    for n in wrong_all:
        viol[n] = viol.get(n, 0) + 1
    out.append(rec)
    print(rec, flush=True)
print('SUMMARY nodes %d; min/median/max number of characters on the wrong side for every lam: %d / %d / %d of %d; nodes with 0 wrong: %d'
      % (len(out), min(r['wrong_for_every_lam'] for r in out), int(np.median([r['wrong_for_every_lam'] for r in out])), max(r['wrong_for_every_lam'] for r in out), len(chars),
         sum(r['wrong_for_every_lam'] == 0 for r in out)))
print('characters most often on the wrong side:', sorted(viol.items(), key=lambda x: -x[1])[:15])
json.dump(dict(nodes=out, violators=viol, nchars=len(chars), qmax=QMAX), open(sys.argv[2], 'w'), indent=1)
print('DIAG3-DONE')
