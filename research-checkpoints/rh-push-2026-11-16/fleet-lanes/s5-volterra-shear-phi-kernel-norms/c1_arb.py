# Combination 1 (ball arithmetic): two-sided bracket of the threshold a* = sup{a : norm V_{a,Phi} <= 1}.
#   upper bound of the norm:  G(a) = sqrt(E+ E- - I^2)/2  (Hilbert-Schmidt norm; b-volterra-norm T1)
#   lower bound of the norm:  L(a) = <u, V w>/(|u||w|),  u = Phi e^{at}, w = Phi e^{-at} (approximate top singular pair):
#       <u, V w> = (1/2) int Phi(t)^2 [ e^{2at} J_-(t) - J_0(t) ] dt,  J_-(t) = int_0^t Phi^2 e^{-2as} ds,  J_0(t) = int_0^t Phi^2.
#   a_G: G = 1 (norm < 1 below);  a_L: L = 1 (norm > 1 above, by monotonicity of the norm in a for Phi^2 >= 0).
# usage: python c1_arb.py out.json PREC [keys]
import sys, os, json, math, time
from multiprocessing import Pool
from flint import arb, ctx
import slib, keys as KK


def setup(key, npp):
    fn, panels, note = slib.kernel_spec(key)
    xs, ws = slib.gl_unit(npp)
    P = []
    for lo, hi in panels:
        lo = arb(lo); hi = arb(hi); h = (hi - lo)/2; m = (hi + lo)/2
        nodes = []
        for x, w in zip(xs, ws):
            t = m + h*x
            k = fn(t)
            hh = (t - lo)/2; mm = (t + lo)/2
            sub = [(mm + hh*x2, hh*w2*fn(mm + hh*x2)**2) for x2, w2 in zip(xs, ws)]
            nodes.append((t, h*w*k*k, sub))
        P.append(nodes)
    return P


def bounds(P, a):
    a = arb(a)
    I = arb(0); Ep = arb(0); Em = arb(0); num = arb(0)
    cJm = arb(0); cJ0 = arb(0)
    for nodes in P:
        pJm = arb(0); pJ0 = arb(0)
        for t, m, sub in nodes:
            e = (2*a*t).exp()
            I += m; Ep += m*e; Em += m/e
            pJm += m/e; pJ0 += m
            jm = cJm; j0 = cJ0
            for s, ms in sub:
                jm += ms*(-2*a*s).exp(); j0 += ms
            num += m*(e*jm - j0)
        cJm += pJm; cJ0 += pJ0
    G = ((Ep*Em - I*I)/4).sqrt()
    L = (num/2)/(Ep*Em).sqrt()
    return G, L


def root(f, lo=1e-5, hi=600.0):
    if not (f(lo) < 1 < f(hi)):
        return None
    for _ in range(70):
        mid = 0.5*(lo + hi)
        if f(mid) < 1: lo = mid
        else: hi = mid
        if hi - lo < 1e-13*hi: break
    return 0.5*(lo + hi)


def job(arg):
    key, prec = arg
    t0 = time.time()
    slib.setprec(prec)
    rec = {'key': key, 'prec': prec}
    if key.startswith('E_b='):
        T, W, K = slib.table(key)
        f = lambda a: float(((lambda I, Ep, Em: ((Ep*Em - I*I)/4).sqrt())(*slib.exp_moments(T, W, K, a))))
        aG = root(f)
        I, Ep, Em = slib.exp_moments(T, W, K, aG*(1 - 1e-9))
        rec.update({'a_G': aG, 'G_below_lt1': bool(((Ep*Em - I*I)/4).sqrt() < 1), 'a_L': None, 'note': 'table kernel: no ball lower bound'})
    else:
        P = setup(key, slib.npp_for(prec))
        cache = {}

        def fb(a):
            if a not in cache:
                G, L = bounds(P, a); cache[a] = (float(G), float(L))
            return cache[a]
        aG = root(lambda a: fb(a)[0]); aL = root(lambda a: fb(a)[1])
        G1, L1 = bounds(P, aG*(1 - 1e-9)); G2, L2 = bounds(P, aL*(1 + 1e-9))
        rec.update({'a_G': aG, 'a_L': aL, 'G_below_lt1': bool(G1 < 1), 'L_above_gt1': bool(L2 > 1),
                    'G_at_aL': float(G2), 'L_at_aG': float(L1), 'rel_width': (aL - aG)/aG})
        for a in (0.5, 5.0, 30.0, 60.0):
            G, L = bounds(P, a)
            rec.setdefault('grid', {})[str(a)] = {'log10G': slib.log10abs(G), 'L_over_G': float(L/G)}
    rec['sec'] = time.time() - t0
    sys.stderr.write('%s a_G=%s a_L=%s %.0fs\n' % (key, rec['a_G'], rec['a_L'], rec['sec']))
    return rec


if __name__ == '__main__':
    out = sys.argv[1]; prec = int(sys.argv[2])
    ks = sys.argv[3].split(';') if len(sys.argv) > 3 else KK.MAIN
    nw = int(os.environ.get('RH_WORKERS', '4'))
    with Pool(nw) as p:
        recs = p.map(job, [(k, prec) for k in ks], chunksize=1)
    json.dump(recs, open(out, 'w'))
    print('wrote', out)
