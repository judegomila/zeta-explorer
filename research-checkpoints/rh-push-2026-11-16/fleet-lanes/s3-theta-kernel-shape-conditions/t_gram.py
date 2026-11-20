# Combination 1(b), 1(c): pair kernel Q_t, Toeplitz (Bochner) Gram matrices, Laguerre expression D_t, central moments.
#   K_t(u) = e^{t u^2} K(u);  H_t(x) = int K_t(u) cos(xu) du;  D_t = H'^2 - H H'';
#   Q_t(v) = int u^2 K_t(v+u) K_t(v-u) du;  D_t(x) = int Q_t(v) cos(2xv) dv   (Lemma 1.1 of r3-theta-collision).
#   Gram matrix on the grid v_i = i hv:  G = [Q_t((i-j) hv)]_{i,j<n}, a symmetric Toeplitz matrix.
#   Levinson-Durbin in ball arithmetic gives the pivots E_m = det G_{m+1}/det G_m, m < n: G_n is positive definite
#   iff all E_m > 0; the number of negative E_m is the number of negative eigenvalues (when no pivot ball meets 0).
#   Symbol of the Toeplitz matrix: (1/hv) sum_k D_t((theta + 2 pi k)/(2 hv)); Nyquist abscissa x_N = pi/(2 hv).
# modes:
#   gram  <out> <kernel> <t> <r> <nmax> [hu_inv=512]      hv = r/hu_inv
#   scan  <out> <kernel> <t> <xmax> <dx> [hu_inv=512]      signs of H_t and D_t on an x-grid
#   mom   <out> <kernel,...>                              M_2/M_0 at tau = 0, 1/4, 1/2
#   batch <out> <taskfile>                                 runs a list of gram/scan tasks in a pool
import sys, os, json, time, math
from flint import arb, ctx
import klib3 as K3

LN2 = math.log(2.0)


def decay_rate(name):
    """exponent c with |H(x)| ~ e^{-c x}: pi/8 for degree-1 gamma factors, pi/4 for the weight-12 form and E_a."""
    if name.startswith('delta') or name.startswith('ea'):
        return math.pi/4
    return math.pi/8


def prec_for(name, xN):
    return int(700 + 2.2*(2*decay_rate(name)*xN)/LN2)


def tgrid(name, t, hu_inv, prec):
    """K_t on the grid j/hu_inv, j = 0..J."""
    sp = K3.SPEC(name)
    K3.setp(prec, 1)
    um = K3.umax_for(prec, sp) + 0.1
    h = 1.0/hu_inv
    g = K3.kgrid(sp, h, um)
    tt = arb(t)
    hh = arb(1)/hu_inv
    return [g[j]*(tt*(hh*j)**2).exp() for j in range(len(g))], hh


def qvals(Kt, hh, r, nmax):
    """Q(k r hu), k = 0..min(nmax-1, J/r).  Trapezoid in u with step hu."""
    J = len(Kt) - 1
    out = []
    u2 = [(hh*m)**2 for m in range(J + 1)]
    for k in range(nmax):
        c = k*r
        if c > J:
            break
        s = arb(0)
        for m in range(1, J - c + 1):
            s += u2[m]*Kt[c + m]*Kt[abs(c - m)]
        out.append(2*hh*s)
    return out


def levinson(q, nmax):
    """pivots E_m = det G_{m+1}/det G_m of the symmetric Toeplitz matrix with first row q (zero beyond len(q)).
    Ball arithmetic loses about 40 bits per step here (wrapping in the predictor update), so the recursion is run
    on midpoints: multiprecision floating point at ctx.prec, not an enclosure.  Returns (signs of E_m, log|E_m|,
    predictor at the first negative pivot)."""
    B = len(q)
    q = [x.mid() for x in q]
    E = q[0]
    signs = [K3.sgn(E)]
    a = []                          # a[i-1] = a_i
    logE = [float(abs(E).log().mid())]
    cert = None
    for m in range(1, nmax):
        acc = q[m] if m < B else arb(0)
        lo = max(1, m - B + 1)
        for i in range(lo, m):
            acc += a[i - 1]*q[m - i]
        k = (-acc/E).mid()
        na = [(a[i - 1] + k*a[m - i - 1]).mid() for i in range(1, m)]
        na.append(k)
        a = na
        E = (E*(1 - k*k)).mid()
        s = K3.sgn(E)
        signs.append(s)
        if s == 0:
            break
        logE.append(float(abs(E).log().mid()))
        if s < 0 and cert is None:
            cert = list(a)
    return signs, logE, cert


def certify_negative(qballs, a):
    """ball evaluation of c^T G c for c = (a_m, ..., a_1, 1) (exact dyadic numbers) against the ball values of Q.
    A negative ball proves that the Gram matrix of size m+1 is not positive semidefinite (for the computed Q)."""
    m = len(a)
    c = [a[m - 1 - i] for i in range(m)] + [arb(1)]
    B = len(qballs)
    n = m + 1
    tot = arb(0)
    for d in range(0, min(B, n)):
        s = arb(0)
        for i in range(0, n - d):
            s += c[i]*c[i + d]
        tot += s*qballs[d]*(1 if d == 0 else 2)
    return tot


def run_gram(name, t, r, nmax, hu_inv=512, pfac=1.0):
    t0 = time.time()
    hv = r/hu_inv
    xN = math.pi/(2*hv)
    prec = int(prec_for(name, xN)*pfac)
    Kt, hh = tgrid(name, t, hu_inv, prec)
    q = qvals(Kt, hh, r, nmax)
    signs, logE, cert = levinson(q, nmax)
    neg = [m for m, s in enumerate(signs) if s < 0]
    cnt = {}
    for n in (25, 50, 100, 250, 500, 1000, 2000, 4000):
        if n <= len(signs):
            cnt[n] = sum(1 for s in signs[:n] if s < 0)
    cz = None
    if cert is not None:
        ctx.prec = 2*prec + 64*len(cert)//8 + 2000
        v = certify_negative(q, cert)
        cz = {'size': len(cert) + 1, 'quadratic_form_over_q0': (v/q[0]).str(12), 'certified_negative': bool(v < 0)}
        ctx.prec = prec
    return {'mode': 'gram', 'kernel': name, 't': t, 'r': r, 'hv': hv, 'xN': xN, 'prec': prec, 'nKt': len(Kt), 'band': len(q),
            'n_reached': len(signs), 'first_negative_pivot_size': (neg[0] + 1 if neg else None),
            'negative_pivots': len(neg), 'neg_count_by_n': cnt, 'zero_pivot': (signs[-1] == 0),
            'certificate': cz, 'log_pivot_over_q0_last': logE[-1] - logE[0], 'log_pivot_over_q0_min': min(logE) - logE[0],
            'seconds': time.time() - t0}


def run_scan(name, t, xmax, dx, hu_inv=512):
    """signs of H_t(x) and D_t(x) on x = 0, dx, ..., xmax (trapezoid of step hu, cos by recurrence)."""
    t0 = time.time()
    prec = prec_for(name, xmax)
    Kt, hh = tgrid(name, t, hu_inv, prec)
    J = len(Kt) - 1
    uu = [hh*j for j in range(J + 1)]
    uK = [uu[j]*Kt[j] for j in range(J + 1)]
    u2K = [uu[j]*uK[j] for j in range(J + 1)]
    xmin = float(os.environ.get('XMIN', '0'))            # optional start of the scan window
    nx = int(round((xmax - xmin)/dx))
    sH = []; sD = []
    ratio = []
    for i in range(nx + 1):
        x = arb(xmin) + arb(dx)*i
        s1, c1 = (x*hh).sin_cos()
        cm, sm = arb(1), arb(0)          # cos(0), sin(0)
        H = Kt[0]/2; H1 = arb(0); H2 = arb(0)
        cj, sj = c1, s1
        for j in range(1, J + 1):
            H += Kt[j]*cj
            H1 -= uK[j]*sj
            H2 -= u2K[j]*cj
            cj, sj = cj*c1 - sj*s1, sj*c1 + cj*s1
        D = H1*H1 - H*H2
        sH.append(K3.sgn(H)); sD.append(K3.sgn(D))
        if sH[-1] != 0 and sD[-1] != 0:
            ratio.append(float((D/(H*H)).mid()))
        else:
            ratio.append(None)
    def runs(sig):
        out = []; j = 0
        for s, ln in K3.rle(sig):
            out.append([s, round(xmin + j*dx, 6), round(xmin + (j + ln - 1)*dx, 6)]); j += ln
        return out
    rD = runs(sD)
    negD = [r_ for r_ in rD if r_[0] < 0]
    firstH = None
    for i in range(1, len(sH)):
        if sH[i]*sH[i - 1] < 0:
            firstH = round(xmin + i*dx, 6); break
    return {'mode': 'scan', 'kernel': name, 't': t, 'xmin': xmin, 'xmax': xmax, 'dx': dx, 'prec': prec,
            'H_sign_changes': sum(1 for i in range(1, len(sH)) if sH[i]*sH[i - 1] < 0), 'first_H_sign_change_x': firstH,
            'D_negative_intervals': negD[:40], 'n_D_negative_intervals': len(negD), 'D_undetermined': sD.count(0),
            'first_D_negative_x': (negD[0][1] if negD else None),
            'min_D_over_H2': min([v for v in ratio if v is not None], default=None), 'seconds': time.time() - t0}


def run_mom(name):
    prec = 256
    sp = K3.SPEC(name)
    K3.setp(prec, 1)
    um = K3.umax_for(prec, sp) + 0.1
    hu_inv = 256
    g = K3.kgrid(sp, 1.0/hu_inv, um)
    hh = arb(1)/hu_inv
    out = {'kernel': name, 'min_sign': min(K3.sgn(x) for x in g)}
    for tau in ('0', '0.25', '0.5'):
        M0 = g[0]/2; M2 = arb(0)
        for j in range(1, len(g)):
            w = g[j]*(arb(tau)*(hh*j)**2).exp()
            M0 += w; M2 += w*(hh*j)**2
        r = M2/M0
        out['tau' + tau] = {'M2_over_M0': r.str(20), 'below_2_over_169': bool(r < arb(2)/169),
                            'x_c': float((2/r).sqrt().mid())}
    return out


def _task(tk):
    try:
        if tk[0] == 'gram':
            return run_gram(*tk[1:])
        if tk[0] == 'scan':
            return run_scan(*tk[1:])
        if tk[0] == 'mom':
            return run_mom(*tk[1:])
    except Exception as ex:                      # report, do not hide
        return {'mode': tk[0], 'task': list(tk), 'error': repr(ex)}


if __name__ == '__main__':
    mode, outf = sys.argv[1], sys.argv[2]
    if mode == 'gram':
        res = [run_gram(sys.argv[3], sys.argv[4], int(sys.argv[5]), int(sys.argv[6]), int(sys.argv[7]) if len(sys.argv) > 7 else 512, float(sys.argv[8]) if len(sys.argv) > 8 else 1.0)]
    elif mode == 'scan':
        res = [run_scan(sys.argv[3], sys.argv[4], float(sys.argv[5]), float(sys.argv[6]), int(sys.argv[7]) if len(sys.argv) > 7 else 512)]
    elif mode == 'mom':
        res = [run_mom(nm) for nm in sys.argv[3].split(',')]
    else:
        from multiprocessing import Pool
        tasks = [tuple(x) for x in json.load(open(sys.argv[3]))]
        nw = int(os.environ.get('RH_WORKERS', '4'))
        res = []
        with Pool(nw) as pool:
            for r_ in pool.imap_unordered(_task, tasks, chunksize=1):
                res.append(r_)
                print(json.dumps(r_), flush=True)
                json.dump(res, open(outf, 'w'), indent=0)
    json.dump(res, open(outf, 'w'), indent=0)
    for r_ in res:
        print(json.dumps(r_))
