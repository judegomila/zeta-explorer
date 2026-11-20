# Combination 2: exponential-family conditions on the real axis and the Fisher (covariance) bound.
# Normalisation of the source (PR 41 sec 2): F(w) = centre-shifted completed function, F(w)/F(0) = E_0 e^{wU},
# U = 2u in the kernel variable of klib3 (F(w) = int K(u) e^{2wu} du).  For real x:
#   mu_x = p(x) = F'(x)/F(x),  I_x = p'(x) = Var_x U,  phi_x(y) = F(x+iy)/F(x),  Z = F'/F,
#   bound:  Re Z(x+iy) >= B(x,y) := mu_x - sqrt(I_x) sqrt(1 - |phi_x(y)|^2)/|phi_x(y)|     (valid when K >= 0).
# Conditions: E1 p(a) > 0, E2 p'(a) > 0 (= K''(a) > 0), E3 (p(a)/a)' < 0 on a in (0, 50];
#   reach y*(x) = first y with B(x,y) = 0, i.e. |phi_x(y)|^2 = I_x/(mu_x^2 + I_x);
#   check of the bound on a (x,y) grid: count of points with Re Z < B (possible only for signed kernels).
# usage: python t_expfam.py <out.json> <kernel,kernel,...> [prec=192]
import sys, os, json, time, math
from multiprocessing import Pool
from flint import arb, acb, ctx
import klib3 as K3


_KCACHE = {}


class Tilt:
    """quadrature weights K(u_j) e^{2 x u_j} h on a grid adapted to the tilt x; moments at x + iy."""
    def __init__(self, sp, x, prec):
        K3.setp(prec, 1)
        self.x = arb(x)
        xf = abs(float(self.x.mid()))
        sig = 1.0/(2*math.sqrt(2*xf + 9))
        # trapezoid step: the kernel is analytic in |Im u| < pi/8, error about exp(-2 pi (pi/8)/h); h <= 2.3/(prec ln 2)
        h = min(1.0/128, sig/6, 2.3/(prec*math.log(2.0)))
        hinv = int(math.ceil(1.0/h))
        self.h = arb(1)/hinv
        um = K3.umax_for(prec, sp) + 0.1
        # upper end: the saddle of e^{2xu} K(u) plus the range where the integrand is above 2^-(prec+40) of its peak
        us = 0.25*math.log(max(1.0, (2*xf + 9)*sp.get('q', 1)/(4*math.pi)))
        top = max(um, us + 0.25*math.log(1 + (prec + 60)*0.7*sp.get('q', 1)*4/(2*xf + 9)) + 0.2)
        if sp['type'] in ('ea', 'tnr', 'delta', 'heat'):
            top = top*2 + 0.6
        J = int(math.ceil(top*hinv))
        self.u = []; self.w = []
        # kernel values on the grid j/hinv are shared by all tilts with the same (kernel, step, precision)
        key = (sp['type'], sp.get('q'), sp.get('D'), sp.get('bname'), sp.get('tau'), str(sp.get('c')), str(sp.get('a')),
               repr(sp.get('base', {}).get('type')) if isinstance(sp.get('base'), dict) else None, hinv, prec)
        cache = _KCACHE.setdefault(key, {})
        even = K3.is_even(sp)
        for j in range(-J, J + 1):
            u = self.h*j
            jj = abs(j) if even else j
            k = cache.get(jj)
            if k is None:
                k = K3.kval(sp, self.h*jj)
                cache[jj] = k
            w = k*(2*self.x*u).exp()
            self.u.append(u); self.w.append(w*self.h)
        self.n = len(self.u)

    def mom(self, y, kmax=2):
        """(F, F', F'') at x+iy, derivative in w (factor 2u per order)."""
        yy = arb(y)
        out = [acb(0)]*(kmax + 1)
        res = [acb(0) for _ in range(kmax + 1)]
        for u, w in zip(self.u, self.w):
            e = acb(0, 2*yy*u).exp()*w
            res[0] += e
            t2 = 2*u
            v = e
            for k in range(1, kmax + 1):
                v = v*t2
                res[k] += v
        return res


def Fvals(name, sp, x, prec, cache):
    """returns a function y -> (F, F', F'') at x + iy for the named object."""
    t = sp['type']
    if t == 'ea':                       # product of two zeta factors (exact, no convolution quadrature)
        a = arb(sp['a'])
        Z = {'type': 'zeta'}
        T1 = Tilt(Z, arb(x) + a, prec); T2 = Tilt(Z, arb(x) - a, prec)
        def f(y):
            A = T1.mom(y); B = T2.mom(y)
            return [A[0]*B[0], A[1]*B[0] + A[0]*B[1], A[2]*B[0] + 2*A[1]*B[1] + A[0]*B[2]]
        return f
    if t == 'tnr':
        Z = {'type': 'zeta'}
        T1 = Tilt(Z, arb(x), prec)
        l = arb(sp['q']).log(); c = arb(sp['c'])
        def f(y):
            A = T1.mom(y)
            w = acb(arb(x), arb(y))
            ch = (w*l).cosh(); sh = (w*l).sinh()
            m0 = 2*ch + c; m1 = 2*l*sh; m2 = 2*l*l*ch
            return [A[0]*m0, A[1]*m0 + A[0]*m1, A[2]*m0 + 2*A[1]*m1 + A[0]*m2]
        return f
    T = Tilt(sp, arb(x), prec)
    return T.mom


def real_axis(name, prec, amax=50.0, na=400):
    sp = K3.SPEC(name)
    rows = []
    sE1 = []; sE2 = []; sE3 = []
    for i in range(1, na + 1):
        a = arb(amax)*i/na
        F = Fvals(name, sp, a, prec, None)(0)
        F0, F1, F2 = F[0].real, F[1].real, F[2].real
        p = F1/F0
        dp = F2/F0 - p*p
        d3 = dp*a - p                    # sign of (p/a)' = (a p' - p)/a^2
        sE1.append(K3.sgn(p)); sE2.append(K3.sgn(dp)); sE3.append(K3.sgn(d3))
        if i % max(1, na//20) == 0:
            rows.append([float(a.mid()), float(p.mid()), float(dp.mid()), float((p/a).mid())])
    def runs(sig):
        out = []; j = 1
        for s, ln in K3.rle(sig):
            out.append([s, round(amax*j/na, 5), round(amax*(j + ln - 1)/na, 5)]); j += ln
        return out
    return {'E1_p_pos': runs(sE1), 'E2_var_pos': runs(sE2), 'E3_p_over_a_decreasing': runs(sE3), 'samples': rows}


def reach(name, prec, x):
    """y*(x) and the check of the bound on a y-grid."""
    sp = K3.SPEC(name)
    f = Fvals(name, sp, x, prec, None)
    F = f(0)
    F0, F1, F2 = F[0].real, F[1].real, F[2].real
    mu = F1/F0
    I = F2/F0 - mu*mu
    out = {'x': x, 'mu': float(mu.mid()), 'I': float(I.mid())}
    if not (I > 0) or not (mu > 0):
        out['note'] = 'mu or I not positive: the bound is not defined'
        thr = None
    else:
        thr = I/(mu*mu + I)
        out['phi2_threshold'] = float(thr.mid())
    def at(y):
        G = f(y)
        phi2 = (G[0].real**2 + G[0].imag**2)/(F0*F0)
        Z = G[1]/G[0]
        return phi2, Z.real
    # y*(x): scan from 0 in steps y0/40, y0 = small-y estimate sqrt((1-thr)/I)
    ystar = None
    if thr is not None:
        y0 = float(((1 - thr)/I).sqrt().mid())
        step = y0/40
        prev = 0.0
        y = step
        for it in range(4000):
            phi2, _ = at(y)
            if phi2 < thr:
                lo, hi = prev, y
                for _b in range(40):
                    mid = 0.5*(lo + hi)
                    p2, _ = at(mid)
                    if p2 < thr:
                        hi = mid
                    else:
                        lo = mid
                ystar = 0.5*(lo + hi)
                break
            prev = y; y += step
        out['y0_estimate'] = y0
        out['ystar'] = ystar
    # check of the inequality on a y grid (absolute heights)
    viol = 0; tested = 0; worst = None; undet = 0
    ys = [0.25*k for k in range(1, 161)]            # y to 40
    if ystar:
        ys += [ystar*k/8 for k in range(1, 33)]
    firstv = None
    for y in ys:
        phi2, rz = at(y)
        if thr is None:
            break
        if not (phi2 > 0):
            undet += 1; continue
        if not (phi2 < 1):
            # |phi| > 1 is impossible for a positive kernel
            viol += 1; tested += 1
            if firstv is None:
                firstv = y
            continue
        B = mu - I.sqrt()*(1 - phi2).sqrt()/phi2.sqrt()
        tested += 1
        d = rz - B
        if d < 0:
            viol += 1
            if firstv is None:
                firstv = y
        m = float(d.mid())
        if worst is None or m < worst:
            worst = m
    out['grid_points'] = tested; out['violations'] = viol; out['first_violation_y'] = firstv
    out['min_ReZ_minus_B'] = worst; out['undetermined'] = undet
    return out


def work(task):
    kind, name, prec, arg = task
    t0 = time.time()
    try:
        if kind == 'real':
            r = real_axis(name, prec)
        else:
            r = reach(name, prec, arg)
    except Exception as ex:
        r = {'error': repr(ex)}
    r['seconds'] = time.time() - t0
    return kind, name, arg, r


XS = ['0.02', '0.05', '0.1', '0.2', '0.3', '0.4', '0.5', '0.75', '1', '2', '5', '10', '20', '50', '100', '200', '500',
      '1000', '2000', '5000', '10000']

if __name__ == '__main__':
    outf = sys.argv[1]
    names = sys.argv[2].split(',')
    prec = int(sys.argv[3]) if len(sys.argv) > 3 else 192
    xs = sys.argv[4].split(',') if len(sys.argv) > 4 else XS
    nw = int(os.environ.get('RH_WORKERS', '4'))
    tasks = []
    for nm in names:
        tasks.append(('real', nm, prec, None))
        for x in xs:
            tasks.append(('reach', nm, prec, x))
    res = {nm: {'reach': []} for nm in names}
    t0 = time.time()
    with Pool(nw) as pool:
        for kind, nm, arg, r in pool.imap_unordered(work, tasks, chunksize=1):
            if kind == 'real':
                res[nm]['real'] = r
            else:
                res[nm]['reach'].append(r)
            print(kind, nm, arg, json.dumps(r)[:400], flush=True)
            json.dump(res, open(outf, 'w'), indent=0)
    for nm in names:
        res[nm]['reach'].sort(key=lambda d: float(d.get('x', 0)))
    json.dump(res, open(outf, 'w'), indent=0)
    print('DONE %.1f s' % (time.time() - t0))
