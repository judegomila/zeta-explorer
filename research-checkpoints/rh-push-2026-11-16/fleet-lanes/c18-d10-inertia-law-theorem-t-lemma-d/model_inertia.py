# Exact inertia of the apex form in the rational model for general finite degree.
# b(u) = base(u) * product of real factors; zeros of Theta at a: factor (u + a) (real a) or u^2 + 2A u + A^2 + g^2 (pair A +- i g).
# base 'pole': (u - 1)  [M_0 = (u+1)/(u-1)];  'minus': 1  [M_0 = -1];  'plus': u  [M_0 = +1].
# N / (Delta Delta) is an invariant polynomial of degree <= 3(n-1) in each variable, n = deg b, so the fit on the invariant monomials is exact.
import sys, json, random, time
from multiprocessing import Pool
from flint import fmpq, fmpq_mat
from lib import orbit, Delta, basis, inv, q, inertia
def build(base, zeros):
    facs = []; n = 0
    if base == 'pole': facs.append(('lin', q(-1))); n += 1
    elif base == 'plus': facs.append(('lin', q(0))); n += 1
    for z in zeros:
        if z[0] == 'r': facs.append(('lin', z[1])); n += 1
        else: facs.append(('quad', 2*z[1], z[1]*z[1] + z[2]*z[2])); n += 2
    def b(u):
        r = q(1)
        for f in facs: r *= (u + f[1]) if f[0] == 'lin' else (u*u + f[1]*u + f[2])
        return r
    return b, n
def run(case):
    name, base, zeros, pred = case
    t0 = time.time(); b, n = build(base, zeros)
    B = basis(3*(n-1)); m = len(B); rng = random.Random(len(name)*7919 + n)
    while True:
        P1 = [(q(rng.randint(1, 100), 101), q(rng.randint(1, 100), 103)) for _ in range(m)]; P2 = [(q(rng.randint(1, 100), 107), q(rng.randint(1, 100), 109)) for _ in range(m)]
        try:
            V1i = fmpq_mat(m, m, [x for p in P1 for x in inv(p, B)]).inv(); V2i = fmpq_mat(m, m, [x for p in P2 for x in inv(p, B)]).transpose().inv(); break
        except ZeroDivisionError: continue
    psi = lambda x: b(x[0])*b(x[1])*b(x[0]+x[1])
    A1 = [[(x, sg*psi(x)) for (x, sg) in orbit(p)] for p in P1]; A2 = [[(x, sg*psi(x)) for (x, sg) in orbit(p)] for p in P2]
    def Nv(oa, ob):
        s = q(0)
        for (x, cx) in oa:
            for (y, cy) in ob: s += cx*cy/((x[0]+y[0])*(x[1]+y[1]))
        return s
    Pm = fmpq_mat(m, m, [Nv(A1[i], A2[j])/(Delta(P1[i])*Delta(P2[j])) for i in range(m) for j in range(m)])
    H = V1i*Pm*V2i
    sym = all(H[i, j] == H[j, i] for i in range(m) for j in range(i))
    pos, neg = inertia(H)
    return dict(case=name, base=base, deg_b=n, basis=m, symmetric=sym, pos=pos, neg=neg, rank=pos+neg, predicted=pred, sec=round(time.time()-t0, 1))
h = q(1, 2)
def quartet(eta, g): return [('c', h-eta, g), ('c', h+eta, g)]
def rpair(eta): return [('r', h-eta), ('r', h+eta)]
def cases():
    rng = random.Random(1811); C = []
    def rq(lo, hi, den=64): return q(rng.randint(int(lo*den), int(hi*den)), den)
    # A. symmetric sets, base with the pole: predicted (d(d-1)/2 ... , 0 negative)
    for d in (2, 4, 6, 8, 10):
        for rep in range(6 if d <= 8 else 3):
            zs = []; cnt = 0
            while cnt < d:
                k = rng.random()
                if d - cnt >= 4 and k < 0.6: zs += quartet(rq(0.02, 0.48), rq(0.1, 9)); cnt += 4
                elif k < 0.85: zs += rpair(rq(0.02, 0.48)); cnt += 2
                else: zs += [('c', h, rq(0.1, 9))]; cnt += 2
            C.append(('A sym d=%d #%d' % (d, rep), 'pole', zs, dict(neg=0)))
    # B. unpaired sets: L left zeros without partner, some right ones, some symmetric ones
    for rep in range(30):
        zs = []; L = 0
        for _ in range(rng.choice([1, 1, 2, 3])):
            if rng.random() < 0.6: zs.append(('c', rq(0.03, 0.47), rq(0.1, 9))); L += 2
            else: zs.append(('r', rq(0.03, 0.47))); zs.append(('r', rq(0.03, 0.47))); L += 2
        if rng.random() < 0.6: zs.append(('c', rq(0.53, 0.97), rq(0.1, 9)))
        if rng.random() < 0.4: zs += [('r', rq(0.53, 0.97)), ('r', rq(0.53, 0.97))]
        if rng.random() < 0.5: zs += quartet(rq(0.02, 0.48), rq(0.1, 9))
        if sum(1 if z[0] == 'r' else 2 for z in zs) > 8: continue
        C.append(('B unpaired #%d' % rep, 'pole', zs, dict(neg=L)))
    # C. controls in the model
    C.append(('C single real zero 3/4, pole base', 'pole', [('r', q(3, 4))], dict(neg=1)))
    C.append(('C single real zero 1/4, pole base', 'pole', [('r', q(1, 4))], None))
    C.append(('C one left one right real, not partners', 'pole', [('r', q(1, 4)), ('r', q(9, 10))], dict(neg=1)))
    for (eta, g) in ((q(3, 4), q(2)), (q(5, 4), q(1, 2)), (q(9, 16), q(5))):
        C.append(('C symmetric quartet outside the strip eta=%s g=%s, pole base' % (eta, g), 'pole', quartet(eta, g), None))
    for bs in ('minus', 'plus'):
        C.append(('C base %s, symmetric quartet (1/4, 2)' % bs, bs, quartet(q(1, 4), q(2)), None))
        C.append(('C base %s, left pair 1/5 +- 3i' % bs, bs, [('c', q(1, 5), q(3))], None))
        C.append(('C base %s, right pair 4/5 +- 3i' % bs, bs, [('c', q(4, 5), q(3))], None))
        C.append(('C base %s, two left pairs' % bs, bs, [('c', q(1, 5), q(3)), ('c', q(1, 3), q(1))], None))
        C.append(('C base %s, single real zero 1/4' % bs, bs, [('r', q(1, 4))], None))
        C.append(('C base %s, single real zero 3/4' % bs, bs, [('r', q(3, 4))], None))
        C.append(('C base %s, real left pair {1/5, 1/3}' % bs, bs, [('r', q(1, 5)), ('r', q(1, 3))], None))
        C.append(('C base %s, symmetric quartet outside the strip (eta = 5/4, g = 1/2)' % bs, bs, quartet(q(5, 4), q(1, 2)), None))
        C.append(('C base %s, pair right of 1: 3/2 +- 2i' % bs, bs, [('c', q(3, 2), q(2))], None))
    C.append(('C pole base, pair right of 1: 3/2 +- 2i', 'pole', [('c', q(3, 2), q(2))], None))
    return C
if __name__ == '__main__':
    C = [c for c in cases() if len(sys.argv) < 2 or c[0][0] in sys.argv[1]]; out = []
    with Pool(3) as p:
        for r in p.imap(run, C, chunksize=1):
            ok = '' if r['predicted'] is None else ('  OK' if r['neg'] == r['predicted']['neg'] else '  MISMATCH')
            print('%-78s deg b %2d  basis %3d  rank %3d  (pos %3d, neg %2d)%s  %ss' % (r['case'], r['deg_b'], r['basis'], r['rank'], r['pos'], r['neg'], ok, r['sec'])); sys.stdout.flush(); out.append(r)
    json.dump(out, open('model_inertia_%s.json' % (sys.argv[1] if len(sys.argv) > 1 else 'all'), 'w'), indent=1)
