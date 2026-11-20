"""Arb re-verification of the LP dual certificates (Proposition C of stack-feasibility) and Arb check that the LP-feasible
configurations satisfy the real-node Pick LMI (primal feasibility of the joint SDP).
(a) dual: recompute c_j from Arb zeros, Q_j, the bound, G(quartet), and G on the fine grid (t step 0.004, sigma levels of the
    model) in ball arithmetic; PASS iff  Gq - bound - (Nwin + cslack) * max(0, -min G) > 0 with certified sign.
    The region between grid points is not covered (GRID-CERTIFIED).
(b) primal: Pick matrix of {zeta zeros outside the window} + {LP atoms} + {quartet} at K nodes, Cholesky in Arb.
usage: cert_arb.py out/lp_zeta_*.json ..."""
import sys, json, glob, time, os
from multiprocessing import Pool
from flint import arb, acb, ctx
import pickdec as pd
def bhat(z, a): return (z*a).sinc()**6
PREC = int(os.environ.get('PICK_PREC', '3000'))
def one(fn):
    cache = {}
    ctx.prec = 128; d = json.load(open(fn)); T = d['T']; L = arb(d['L']); a = L/6; Wm = d['Wm']; res = []
    zs, lo, hi = pd.window_zeros(int(T), Wm); zt = [g - int(T) for g in zs]; tj = [arb(t) for t in d['tj']]
    assert len(zt) == d['Nwin']
    c = [sum((bhat(acb(g - t), a).real for g in zt), arb(0)) for t in tj]
    eta = arb(d['eta']); cs = arb(d['cslack']); N = arb(d['Nwin'])
    for row in d['rows']:
        smax = {'M1': 0.0, 'M2_3/8': 0.375, 'M2_1/2': 0.5}[row['model']]
        import numpy as np
        sigs = [0.0] if smax == 0 else list(np.linspace(0, smax, 21))
        for nm in ('pair', 'gap'):
            ce = row.get(nm + '_cert')
            if ce:
                tic = time.time(); u = [arb(x) for x in ce['u']]; v = [arb(x) for x in ce['v']]; cp, cm = arb(ce['cp']), arb(ce['cm'])
                y = [p - q for p, q in zip(u, v)]; kap = cp - cm; act = [k for k in range(len(y)) if ce['u'][k] != ce['v'][k]]
                zq = acb(arb(ce['tq']), arb(ce['delta']))
                Gq = sum((y[k]*2*bhat(zq - tj[k], a).real for k in act), arb(0)) + 2*kap
                bound = sum((u[k]*(c[k]+eta) - v[k]*(c[k]-eta) for k in range(len(y))), arb(0)) + cp*(N+cs) - cm*(N-cs)
                gmin = arb(0); tf = np.arange(-Wm, Wm+1e-9, 0.004)
                for s in sigs:
                    for t in tf:
                        if s == 0: G = sum((y[k]*bhat(acb(arb(float(t)) - tj[k]), a).real for k in act), arb(0)) + kap
                        else: G = sum((y[k]*2*bhat(acb(arb(float(t)), arb(float(s))) - tj[k], a).real for k in act), arb(0)) + 2*kap
                        if G.lower() < gmin.lower(): gmin = G
                margin = Gq - bound + (N+cs)*arb(float(gmin.lower()))
                res.append(dict(file=os.path.basename(fn), model=row['model'], pos=nm, delta=ce['delta'], kind='dual', Gq=float(Gq.mid()), bound=float(bound.mid()),
                                Gmin=float(gmin.lower()), margin=float(margin.lower()), PASS=bool(margin > 0), grid_points=len(tf)*len(sigs), sec=round(time.time()-tic)))
                print(json.dumps(res[-1]), flush=True)
            fe = row.get(nm + '_feas')
            if fe and fe.get('atoms') is not None:
                for K, nd in ((6, 'lin'), (12, 'lin'), (24, 'lin'), (24, 'geo'), (24, 'small')):
                    ctx.prec = PREC
                    xs = pd.nodes(nd, K, int(T))
                    if 'zsH' not in cache: cache['zsH'] = pd.window_zeros(int(T), Wm)[0]
                    zsH = cache['zsH']
                    Lv = []
                    for x in xs:
                        l = pd.Ltrue(x) - sum((pd.Lon(x, g) for g in zsH), arb(0))
                        for (t, s, w) in fe['atoms']:
                            l += arb(w)*(pd.Lon(x, arb(int(T)) + arb(t)) if s == 0 else pd.Lq(x, arb(s), arb(int(T)) + arb(t)))
                        l += pd.Lq(x, arb(fe['delta']), arb(int(T)) + arb(d['tqs'][nm]))
                        Lv.append(l)
                    C, piv = pd.chol(pd.pick(Lv, xs))
                    res.append(dict(file=os.path.basename(fn), model=row['model'], pos=nm, delta=fe['delta'], kind='primal_pick', K=K, nodes=nd,
                                    atoms=len(fe['atoms']), offline_mass=sum(2*w for t, s, w in fe['atoms'] if s > 0), prec=PREC, PASS=C is not None))
                    print(json.dumps(res[-1]), flush=True)
                    ctx.prec = 128
    return res
if __name__ == '__main__':
    files = sys.argv[2:]; allr = []
    with Pool(int(sys.argv[1])) as p:
        for r in p.imap_unordered(one, files): allr += r
    json.dump(allr, open(os.environ.get('CERT_OUT', 'cert_arb.json'), 'w'), indent=1)
    du = [r for r in allr if r['kind'] == 'dual']; pr = [r for r in allr if r['kind'] != 'dual']
    print('SUMMARY dual', sum(r['PASS'] for r in du), 'of', len(du), ' primal_pick', sum(r['PASS'] for r in pr), 'of', len(pr))
