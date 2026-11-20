"""LP-E for one object.  usage: run_e.py name k X1,X2,.. [Dfac=2.2] [key=val ...]"""
import sys, json, math, time, numpy as np
from objects import *
name = sys.argv[1]; k = int(sys.argv[2]); Xs = [int(float(a)) for a in sys.argv[3].split(',')]
Dfac = float(sys.argv[4]) if len(sys.argv) > 4 else 2.2
kw = {}
for a in sys.argv[5:]:
    key, v = a.split('='); kw[key] = v if key == 'mode' else (int(v) if key in ('q', 'seed', 'allrows') else float(v))
allrows = bool(kw.pop('allrows', 0)); box = kw.pop('box', None); ftol = kw.pop('ftol', 0.0)
out = []
for X in Xs:
    t0 = time.time()
    o = make(name, X, k, **kw)
    D = min(X, int(math.ceil(Dfac * math.sqrt(X))))
    nnz = 3 * math.sqrt(X) * D + 4 * X
    print(f"# {name} {kw} k={k} X={X} D={D}: planned LP nnz about {nnz:.3g} ({16*nnz/1e9:.2f} GB), arrays {(8+2*k)*8*X/1e9:.2f} GB", flush=True)
    sysm = Sys(X, k, w=o['w'], u=o['u'])
    tr = truth(o['lam'], X, k)
    r = solve(sysm, D, verbose=False, allrows=allrows and X <= 30000, box=box, ftol=ftol)
    lam = o['lam']
    rec = dict(name=name, kw=kw, k=k, X=X, D=D, truth_re=float(np.real(tr)), main_re=float(np.real(o['main'])), status=r['status'],
               neg_count=int(((np.real(lam * np.conj(o['u']))) < -1e-9).sum()), time=time.time() - t0)
    if r['status'] == 0:
        y = r['y']
        rec.update(val=float(r['val']), gap=float(r['val'] - np.real(tr)), gap_over_sqrtX=float((r['val'] - np.real(tr)) / math.sqrt(X)),
                   excess_over_sqrtX=float((np.real(tr) - np.real(o['main'])) / math.sqrt(X)), rows=r['rows'], it=r['it'], worst=float(r['worst']),
                   cmax=float(np.abs(r['c']).max()), at_box=r['at_box'], y_tot=float(y.sum()), y_on_zero_lam=float(y[np.abs(lam) < 1e-12].sum()))
    else: rec.update(msg=str(r.get('msg'))[:100])
    out.append(rec); print(json.dumps(rec), flush=True)
