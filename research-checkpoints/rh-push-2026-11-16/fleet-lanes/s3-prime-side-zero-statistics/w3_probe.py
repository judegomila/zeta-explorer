import math, json, numpy as np, w3
tab = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
off = sorted(float(t) for b, t, _ in tab['offline'])
gaps = sorted(((off[i+1]-off[i], off[i], off[i+1]) for i in range(len(off)-1)), reverse=True)[:5]
print('largest gaps between off-line ordinates of DH below 2000:', gaps)
print('betas of first pairs', [(round(float(b),4), round(float(t),2)) for b,t,_ in tab['offline'][:8]])
for name in ('ZETA','CHI5R','DH'):
    for X in (1e2,1e3,1e4,1e5):
        fam = w3.family(name, X); L = math.log(X); d = 2*math.pi/L
        for (a,b) in ((12.0,80.0),(20.0,60.0)):
            n = int((b-a)/d)+1
            W = w3.build_box(fam, a, n, X)
            ev = np.linalg.eigvalsh(W); evh = np.linalg.eigvalsh(w3.hann(W))
            print(name, 'X=%g'%X, 'win', a, b, 'n', n, 'box ev_low', ev[:3], 'absmax %.3g'%np.abs(W).max(), 'hann', evh[:2], flush=True)
