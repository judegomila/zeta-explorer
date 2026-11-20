# fine ladder for the detection threshold: mesh z_j = x0 + i (g + (j + off) h), K nodes; planted quadruple at 1/2 +- delta +- i g on top of zeta.
# Reports, for each h * density, the first negative pivot (0 = none) at four offsets, and the number of zeta zeros inside the mesh span.
import sys, json, math
from multiprocessing import Pool
from flint import arb, acb, ctx
import olib

def one(t):
    g, delta, K, prec, base = t
    ctx.prec = prec
    a = delta/2; x0 = delta/2
    key = '%s+plant(%r,%r)' % (base, g, delta)
    th = olib.make_theta(key, a)
    dens = math.log(g/(2*math.pi))/(2*math.pi)
    rows = []
    for hd in (1.30, 1.15, 1.08, 1.04, 1.00, 0.97, 0.94, 0.91, 0.88, 0.85, 0.80, 0.70):
        h = hd/dens; fn = []
        for off in (0.5, 0.23, 0.77, 0.02):
            Z = [acb(x0, g + (j + off)*h) for j in range(-K//2, K - K//2)]
            G = olib.schur_gram([th(z) for z in Z], Z)
            fn.append(olib.first_neg(G))
        lo = g - K/2*h; hi = g + K/2*h
        nz = int(float(arb(hi).zeta_nzeros())) - int(float(arb(lo).zeta_nzeros())) if base == 'zeta' else None
        rows.append({'h_dens': hd, 'first_neg': fn, 'zeros_in_span': nz, 'K': K})
    return {'g': g, 'delta': delta, 'K': K, 'base': base, 'rows': rows}

if __name__ == '__main__':
    T = [(g, d, K, 1024, 'zeta') for g in (1000.0, 10000.0, 100000.0) for d in (0.2, 0.001) for K in (16, 32, 64)]
    T += [(1000.0, 0.2, 32, 1024, 'chi5')]
    with Pool(olib.workers()) as p, open(sys.argv[1], 'w') as f:
        for r in p.imap_unordered(one, T):
            f.write(json.dumps(r) + '\n'); f.flush()
            print(r['base'], r['g'], r['delta'], r['K'], [(x['h_dens'], x['first_neg'], x['zeros_in_span']) for x in r['rows']], flush=True)
