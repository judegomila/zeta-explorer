# Combination 2: scale-free shear angle  sin^2 theta(a) = mu^2/(|p|^2|q|^2),
# p = Phi cosh(a.), q = Phi sinh(a.) on L^2(0, inf).  Closed form in three moments of Phi^2:
#   sin^2 theta = 4 (E+ E- - I^2) / ((E+ + E-)^2 - 4 I^2),  E+- = int Phi^2 e^{+-2at}, I = int Phi^2;
#   a -> 0:  sin^2 theta = 1 - m1^2/(m0 m2)... (m_k = int t^k Phi^2):  cos^2 theta(0) = m1^2/(m0 m2) is not the limit
#   of the formula with p -> Phi; q/a -> t Phi:  cos theta(0) = <Phi, t Phi>/(|Phi| |t Phi|) = m1/sqrt(m0 m2).
# usage: python c2.py out.json PREC [keys]
import sys, os, json, math, time
from multiprocessing import Pool
from flint import arb, ctx
import slib, keys as KK

AGRID = [0.3*k for k in range(0, 201)]


def curve(key, prec, npp=None):
    slib.setprec(prec)
    T, W, K = slib.table(key, npp)
    M = [w*k*k for w, k in zip(W, K)]
    m0 = sum(M, arb(0)); m1 = sum((m*t for m, t in zip(M, T)), arb(0)); m2 = sum((m*t*t for m, t in zip(M, T)), arb(0))
    out = []
    for a in AGRID:
        if a == 0:
            s2 = 1 - m1*m1/(m0*m2)
        else:
            aa = arb(a)
            Ep = arb(0); Em = arb(0)
            for m, t in zip(M, T):
                e = (2*aa*t).exp(); Ep += m*e; Em += m/e
            s2 = slib.shear_angle(m0, Ep, Em)
        out.append(s2)
    return out, len(T)


def job(arg):
    key, prec = arg
    t0 = time.time()
    s2, n = curve(key, prec)
    rec = {'key': key, 'prec': prec, 'nodes': n, 'a': AGRID,
           'theta': [float(x.sqrt().asin()) for x in s2],
           'log10sin': [slib.log10abs(x)/2 for x in s2],
           'theta0_str': s2[0].sqrt().asin().str(60), 'theta_a3_str': s2[10].sqrt().asin().str(60),
           'sin2_a30_str': s2[100].str(60), 'sin2_a60_str': s2[200].str(60),
           'min_rel_bits': min(int(x.rel_accuracy_bits()) for x in s2)}
    # second size: half the precision, its own node count
    s2b, nb = curve(key, prec//2)
    slib.setprec(prec)
    rec['second_size'] = {'prec': prec//2, 'nodes': nb,
                          'max_rel_diff_log10': max((slib.log10abs((x - y)/x) if (x - y).mid() != 0 else -9999.0) for x, y in zip(s2, s2b))}
    rec['sec'] = time.time() - t0
    sys.stderr.write('%s done %.1fs minbits %d\n' % (key, rec['sec'], rec['min_rel_bits']))
    return rec


def fam_job(c):
    s2, n = curve('shift%r' % c, 128, 44)
    return c, [float(x.sqrt().asin()) for x in s2], [slib.log10abs(x)/2 for x in s2]


if __name__ == '__main__':
    out = sys.argv[1]; prec = int(sys.argv[2])
    ks = sys.argv[3].split(';') if len(sys.argv) > 3 else KK.MAIN
    nw = int(os.environ.get('RH_WORKERS', '4'))
    with Pool(nw) as p:
        recs = p.map(job, [(k, prec) for k in ks], chunksize=1)
        # one-parameter family from zeta: t -> Phi_zeta(t + c) on t >= 0
        cs = [round(-8.0 + i/32.0, 5) for i in range(0, int(9.0*32) + 1)]
        fam = p.map(fam_job, cs, chunksize=4)
    json.dump({'curves': recs, 'family': [{'c': c, 'theta': th, 'log10sin': ls} for c, th, ls in fam]}, open(out, 'w'))
    print('wrote', out)
