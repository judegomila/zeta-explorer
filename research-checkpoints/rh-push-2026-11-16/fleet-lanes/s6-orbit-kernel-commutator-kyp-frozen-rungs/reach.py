# confined-window Pick test: nodes z_j = eps + i Y j / r, j = 1..r (all below height Y); object zeta + planted quadruple at 1/2 +- delta +- i g, a = 0.1.
# Reports the index and the size of the first negative pivot and the least working precision at which its sign is decided.
import sys, json, math, time
from multiprocessing import Pool
from flint import arb, acb, ctx
import olib

def one(t):
    key, a, Y, r, precs = t
    out = {'key': key, 'a': a, 'Y': Y, 'r': r, 'by_prec': []}
    for prec in precs:
        ctx.prec = prec
        eps = arb(2)**(-64)
        th = olib.make_theta(key, a)
        Z = [acb(eps, arb(Y)*j/r) for j in range(1, r + 1)]
        G = olib.schur_gram([th(z) for z in Z], Z)
        res = olib.inertia(G, want_pivots=True)
        piv = res[3]
        neg = [i + 1 for i, p in enumerate(piv) if p < 0]
        row = {'prec': prec, 'pos': res[0], 'neg': res[1], 'undecided_from': (len(piv) if res[2] else None),
               'first_negative_index': (neg[0] if neg else None),
               'log10_abs_first_negative_pivot': (olib.l10(piv[neg[0] - 1]) if neg else None),
               'log10_pivots_sample': [round(olib.l10(p), 1) if not p.contains(0) else None for p in piv[::max(1, len(piv)//12)]]}
        out['by_prec'].append(row)
        if neg: break
    return out

if __name__ == '__main__':
    P = [500, 1000, 1500, 2000, 3000, 4000, 6000, 9000, 14000]
    T = [('zeta+plant(85.699348,0.308517)', 0.1, 20, 96, P), ('zeta+plant(85.699348,0.308517)', 0.1, 20, 128, P), ('zeta+plant(85.699348,0.308517)', 0.1, 40, 96, P),
         ('zeta+plant(85.699348,0.308517)', 0.1, 60, 64, P), ('zeta+plant(85.699348,0.308517)', 0.1, 60, 96, P),
         ('DH', 0.1, 20, 128, P), ('DH', 0.1, 40, 96, P), ('DH', 0.1, 60, 96, P),
         ('zeta+plant(40,0.3)', 0.1, 10, 64, P), ('zeta+plant(160,0.3)', 0.1, 40, 160, P), ('zeta+plant(160,0.3)', 0.1, 20, 160, P),
         ('zeta', 0.1, 20, 128, [4000, 9000]), ('E_b=0.3', 0.1, 2, 16, P), ('E_b=0.3', 0.1, 0.5, 16, P)]
    with Pool(olib.workers()) as p, open(sys.argv[1], 'w') as f:
        for r in p.imap_unordered(one, T):
            f.write(json.dumps(r) + '\n'); f.flush()
            last = r['by_prec'][-1]
            print(r['key'], 'Y', r['Y'], 'r', r['r'], [(x['prec'], x['pos'], x['neg'], x['undecided_from']) for x in r['by_prec']], 'first neg', last['first_negative_index'], last['log10_abs_first_negative_pivot'], flush=True)
