"""Item D: argument-principle counts for the gamma-normalised, pole-renormalised Curie-Weiss stages of
push/c1-leeyang-krein-limit (Test 3 there; alpha = 1; window 10 < Im z < 30; s = 1/2 + z).
   D(s)  = sum over squarefree n | M of a(n) exp(l_n^2/(2L) - s l_n),  l_n = log n, M = prod_{p<=P} p, L = log M
   L~(z) = A(s) + D'(s)/D(s) + r(s),  A = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2)
   zeta phases: a = 1, r(s) = -P^(1-s)/(s-1);     U_s0: a(p) = p^(i Im s0) exp(i eps_k phi_p), r(s) = +P^(s0-s)/(s-s0), s0 = 3/4 + 20 i
   S~ = (1 - L~)/(1 + L~).  Poles of S~ where D != 0 are the zeros of
   N(s) = (1 + A + r) D + D'            (zeta phases),      N(s) = (s - s0)[(1 + A) D + D'] + P^(s0-s) D   (U_s0; pole of r cleared).
N is analytic on the boxes used (poles of A at s = 0, 1 and of psi(s/2) lie outside).
Counts by the argument principle (ball arithmetic, adaptive bisection, exact integer from the enclosed sum of arguments):
   n1 = zeros of N in [0, X] x [10, 30],  n2 = zeros of N in [delta, X] x [10, 30],  n3 = zeros of D in [delta, X] x [10, 30], delta = 2^-6.
If n1 = n2 and n3 = 0: N has no zero with 0 <= Re z < delta in the window, D has none with Re z >= delta, so S~ has exactly n1 poles
in the box 0 < Re z < X, 10 < Im z < 30, counted with multiplicity.
usage: stage_poles.py <prec> <outfile> <X> <kind:P,P,...> [<kind:P,...> ...]
"""
import sys, json, math, time, os
from multiprocessing import Pool
from flint import acb, arb, ctx
PREC = int(sys.argv[1]); OUT = sys.argv[2]; XMAX = sys.argv[3]
WORKERS = int(os.environ.get('RH_WORKERS', '4'))
ctx.prec = PREC
I = acb(0, 1)
S0 = acb(arb(3)/4, 20)
Y0, Y1 = 10, 30
STATE = {}

def primes_upto(n):
    return [p for p in range(2, n + 1) if all(p % d for d in range(2, int(p**0.5) + 1))]

def setup(kind, P):
    ctx.prec = PREC
    ps = primes_upto(P)
    L = sum((arb(p).log() for p in ps), arb(0))
    l = [arb(0)]; a = [acb(1)]
    for k, p in enumerate(ps, start=1):
        lp = arb(p).log()
        if kind == 'zeta': c = acb(1)
        else:
            phi = (-(arb(p)**(S0.real - 1))).acos(); eps = -1 if k % 2 else 1
            c = (I*S0.imag*lp).exp()*(I*eps*phi).exp()
        l = l + [x + lp for x in l]; a = a + [x*c for x in a]
    base = [x*x/(2*L) for x in l]
    STATE.clear(); STATE.update(kind=kind, P=P, L=L, l=l, a=a, base=base, lP=arb(P).log(), n=len(l))

def DD(s):
    """D, D', D'' at s (ball allowed)."""
    D = acb(0); D1 = acb(0); D2 = acb(0)
    for lk, ak, bk in zip(STATE['l'], STATE['a'], STATE['base']):
        e = ak*(bk - s*lk).exp(); el = e*lk
        D += e; D1 -= el; D2 += el*lk
    return D, D1, D2

def NN(z, which):
    """(value, derivative) at z of N (which = 'N') or D (which = 'D')."""
    s = z + arb(1)/2
    D, D1, D2 = DD(s)
    if which == 'D': return D, D1
    A = 1/s + 1/(s - 1) - arb.pi().log()/2 + (s/2).digamma()/2
    A1 = -1/(s*s) - 1/((s - 1)*(s - 1)) + (s/2).polygamma(1)/4
    lp = STATE['lP']
    if STATE['kind'] == 'zeta':
        u = ((1 - s)*lp).exp(); r = -u/(s - 1); r1 = u*lp/(s - 1) + u/((s - 1)*(s - 1))
        return (1 + A + r)*D + D1, (A1 + r1)*D + (1 + A + r)*D1 + D2
    u = ((S0 - s)*lp).exp(); G = (1 + A)*D + D1
    return (s - S0)*G + u*D, G + (s - S0)*(A1*D + (1 + A)*D1 + D2) - lp*u*D + u*D1

def enc(z, which):
    """enclosure of the function on the box z: direct evaluation intersected with the mean-value form
    f(m) + f'(box) (box - m) (valid because the box enclosure of f' is convex and f is analytic on the box)."""
    m = acb(z.real.mid(), z.imag.mid())
    fm = NN(m, which)[0]; fz, dz = NN(z, which)
    mv = fm + dz*(z - m)
    if not mv.is_finite(): return fz
    if not fz.is_finite(): return mv
    try:
        return acb(fz.real.intersection(mv.real), fz.imag.intersection(mv.imag))
    except Exception:
        return mv

def contains0(v):
    return (not v.is_finite()) or (v.real.contains(0) and v.imag.contains(0))

def lowabs(v):
    best = 0.0
    for c in (v.real, v.imag):
        if not c.contains(0):
            best = max(best, float(min(abs(c.lower()), abs(c.upper())))*(1 - 1e-12))
    return best

def _pk(x):
    m, e = x.mid().man_exp(); rm, re_ = x.rad().man_exp()
    return (int(m), int(e), int(rm), int(re_))
def _up(t):
    m, e, rm, re_ = t
    return arb(arb(m)*arb(2)**e, arb((arb(rm)*arb(2)**re_).upper()))

def corners(left):
    xl = arb(left[0])/arb(left[1]); xr = arb(XMAX)
    return [acb(xl, Y0), acb(xr, Y0), acb(xr, Y1), acb(xl, Y1)]

def _chunk(task):
    """one chunk of one edge: points c_e + (c_{e+1} - c_e) * t, t in [i/n, (i+1)/n]; adaptive bisection in t (dyadic)."""
    kind, P, which, left, e, i, n = task
    if STATE.get('kind') != kind or STATE.get('P') != P: setup(kind, P)
    ctx.prec = PREC
    f = lambda zz: NN(zz, which)[0]
    cs = corners(left); p0 = cs[e]; v = cs[(e + 1) % 4] - cs[e]
    def pt(num, den): return p0 + v*(arb(num)/arb(den))
    cache = {}
    def val(num, den):
        k = (num, den)
        if k not in cache: cache[k] = f(pt(num, den))
        return cache[k]
    tot = arb(0); leaves = 0; minlow = None; nev = 0
    stack = [(i, n, 0)]
    while stack:
        num, den, depth = stack.pop()
        a, b = pt(num, den), pt(num + 1, den)
        E = enc(a.union(b), which); nev += 2
        if contains0(E):
            if depth >= 30: return dict(fail='depth 30 reached near t=%d/%d on edge %d' % (num, den, e))
            stack.append((2*num, 2*den, depth + 1)); stack.append((2*num + 1, 2*den, depth + 1)); continue
        fa = val(num, den) if den == n else f(a); fb = val(num + 1, den) if den == n else f(b); nev += 2
        if contains0(fa) or contains0(fb): return dict(fail='vertex enclosure contains 0')
        tot += (fb/fa).arg(); leaves += 1
        m = lowabs(E); minlow = m if minlow is None or m < minlow else minlow
    return dict(arg=_pk(tot), leaves=leaves, nev=nev, minlow=float(minlow))

def count(pool, kind, P, which, left, Lf):
    tasks = []
    lens = [float(XMAX), Y1 - Y0, float(XMAX), Y1 - Y0]
    for e in range(4):
        n = max(4, int(math.ceil(lens[e]*Lf*2)))
        tasks += [(kind, P, which, left, e, i, n) for i in range(n)]
    res = pool.map(_chunk, tasks, chunksize=4)
    fails = [r['fail'] for r in res if 'fail' in r]
    if fails: return dict(count=None, failure=fails[0], n_failed_chunks=len(fails))
    tot = arb(0)
    for r in res: tot += _up(r['arg'])
    W = tot/(2*arb.pi()); ui = W.unique_fmpz()
    return dict(count=(int(ui) if ui is not None else None), winding_enclosure=W.str(20), winding_radius=float(W.rad()),
                leaves=sum(r['leaves'] for r in res), evaluations=sum(r['nev'] for r in res), min_abs_segment_enclosures_lower=min(r['minlow'] for r in res))

if __name__ == '__main__':
    out = dict(prec=PREC, X=XMAX, window=[Y0, Y1], delta='1/64', rows=[])
    t0 = time.time()
    with Pool(WORKERS) as pool:
        for spec in sys.argv[4:]:
            kind, Ps = spec.split(':')
            for P in [int(x) for x in Ps.split(',')]:
                setup(kind, P); t1 = time.time()
                nterms = STATE['n']; Lf = float(STATE['L'].mid())
                print('PLAN: kind %s P=%d: %d terms (3 arb/acb lists of that length, < %d MB per worker at %d bits), L=%.4f, workers %d'
                      % (kind, P, nterms, max(1, nterms*3*200//10**6), PREC, Lf, WORKERS), flush=True)
                row = dict(kind=kind, P=P, L=Lf, terms=nterms, prec=PREC)
                z0 = acb(arb(3)/16, arb(77)/4); hh = acb(arb(2)**(-40), arb(2)**(-41))
                for wch in ('N', 'D'):                    # derivative formulas against a central difference (non-rigorous sanity check)
                    dnum = (NN(z0 + hh, wch)[0] - NN(z0 - hh, wch)[0])/(2*hh); dex = NN(z0, wch)[1]
                    row['deriv_check_rel_' + wch] = float(abs(dnum - dex).mid()/abs(dex).mid())
                row['N_box_0_X'] = count(pool, kind, P, 'N', (0, 1), Lf)
                row['N_box_delta_X'] = count(pool, kind, P, 'N', (1, 64), Lf)
                row['D_box_delta_X'] = count(pool, kind, P, 'D', (1, 64), Lf)
                row['wall_s'] = time.time() - t1
                print(json.dumps(row), flush=True); out['rows'].append(row)
                json.dump(out, open(OUT, 'w'), indent=1)
    out['wall_s'] = time.time() - t0
    json.dump(out, open(OUT, 'w'), indent=1)
    print('DONE %.1fs' % (time.time() - t0))
