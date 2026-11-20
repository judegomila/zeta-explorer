# Combination 4: moments of the autocorrelation and Hankel determinants.
#   Xi(z) = int K(u) e^{izu} du = sum x_n z^n;   G(z) = Xi(z) conj(Xi(conj z))  (= |Xi|^2 on the real axis = transform of A = K * K~)
#   M_2k = int tau^{2k} A(tau) dtau = (2k)! (-1)^k g_2k;   c_k = M_2k/(2k)! = (-1)^k g_2k   ('sq' sequence, the task's)
#   'lin' sequence: c_k = (-1)^k x_2k (Xi itself; even real kernels only).
#   If Xi is even, real, of genus <= 1 in z^2 with only real zeros, sum c_k y^k = prod (1 + y/gamma^2) is a
#   Polya frequency sequence and D_n = det[c_{i+j+s}]_{i,j<n} has sign (-1)^{n(n-1)/2} (column reversal gives a
#   Toeplitz minor), s = 0, 1.  Recorded: sigma_n = (-1)^{n(n-1)/2} sign D_n; first n with sigma_n = -1.
# usage: python c4.py out.json PREC NH [keys]
import sys, os, json, math, time
from multiprocessing import Pool
from flint import arb, acb, ctx
import slib, keys as KK


def half_moments(T, W, K, nmax, wfun=None):
    """h_i = int_0^inf u^i K(u) wfun(u) du (complex if wfun is)."""
    H = [acb(0) for _ in range(nmax + 1)]
    for t, w, k in zip(T, W, K):
        v = acb(w*k)
        if wfun is not None:
            v = v*wfun(t)
        for i in range(nmax + 1):
            H[i] += v
            v = v*t
    return H


def cauchy(x, y, nmax):
    out = []
    for n in range(nmax + 1):
        s = acb(0)
        for i in range(n + 1):
            s += x[i]*y[n - i]
        out.append(s)
    return out


def taylor(key, nmax):
    """complex Taylor coefficients x_0..x_nmax of the transform of `key`; also sign information of the kernel."""
    I = acb(0, 1)
    fact = [arb(1)]
    for n in range(1, nmax + 1): fact.append(fact[-1]*n)
    ipow = [I**n for n in range(nmax + 1)]
    info = {}
    mode = 'even'
    base = key
    if key.startswith('E_b=') or key.startswith('NR(') or key.startswith('U('):
        base = 'zeta'
    if key.endswith('_os'):
        base = key[:-3]; mode = 'os'
    if key in ('liouville', 'zeta_repo'):
        mode = 'os'
    T, W, K = slib.table(base, NPP)
    sg = [slib.sgn(k) for k in K]
    info['kernel_sign_changes_on_window'] = bool(min(sg) < 0 and max(sg) > 0)
    info['kernel_min_sign'] = min(sg); info['nodes'] = len(T)
    if key.startswith('E_b='):
        b = arb(float(key[4:]))
        hp = half_moments(T, W, K, nmax, lambda t: acb((2*b*t).exp()))
        hm = half_moments(T, W, K, nmax, lambda t: acb((-2*b*t).exp()))
        xp = [ipow[n]*(hp[n] + (-1)**n*hm[n])/fact[n] for n in range(nmax + 1)]
        xm = [ipow[n]*(hm[n] + (-1)**n*hp[n])/fact[n] for n in range(nmax + 1)]
        x = cauchy(xp, xm, nmax)
    elif key.startswith('U('):
        al = arb(float(key[2:-1]))
        hp = half_moments(T, W, K, nmax, lambda t: (I*al*t).exp())
        hm = half_moments(T, W, K, nmax, lambda t: (-I*al*t).exp())
        x = [ipow[n]*(hp[n] + (-1)**n*hm[n])/fact[n] for n in range(nmax + 1)]
    else:
        h = half_moments(T, W, K, nmax)
        if mode == 'os':
            x = [ipow[n]*h[n]/fact[n] for n in range(nmax + 1)]
        else:
            x = [(ipow[n]*2*h[n]/fact[n] if n % 2 == 0 else acb(0)) for n in range(nmax + 1)]
        if key.startswith('NR('):
            q, c = key[3:-1].split(','); l2 = arb(int(q)).log()/2; c = arb(float(c))
            y = [acb(0) for _ in range(nmax + 1)]
            y[0] = acb(2 + c)
            for k in range(1, nmax//2 + 1):
                y[2*k] = acb(2*(-1)**k*l2**(2*k)/fact[2*k])
            x = cauchy(x, y, nmax)
        info['h_real'] = [h[n].real.str(25) for n in range(0, 5)]
        info['_h'] = h
    return x, info, mode


def hankel_signs(c, NH, shift):
    """leading principal minors of [c_{i+j+shift}], i, j < NH, by elimination without pivoting.
    returns list of (sign of D_n, log10|D_n|) for n = 1..NH; sign 0 = undecided at this precision."""
    n = NH
    A = [[c[i + j + shift] for j in range(n)] for i in range(n)]
    out = []
    sign = 1; logd = 0.0
    for k in range(n):
        p = A[k][k]
        s = slib.sgn(p)
        if s == 0:
            out.extend([(0, None)]*(n - k))
            break
        sign *= s; logd += slib.log10abs(p)
        out.append((sign, logd))
        rk = A[k]
        for i in range(k + 1, n):
            f = A[i][k]/p
            ri = A[i]
            for j in range(k + 1, n):
                ri[j] = ri[j] - f*rk[j]
    return out


def analyse(c, NH):
    res = {}
    for shift in (0, 1):
        hs = hankel_signs(c, NH, shift)
        sig = []
        for n, (s, l) in enumerate(hs, start=1):
            sig.append(0 if s == 0 else s*(-1)**((n*(n - 1)//2) % 2))
        first_bad = next((n for n, s in enumerate(sig, start=1) if s < 0), None)
        first_und = next((n for n, s in enumerate(sig, start=1) if s == 0), None)
        res['shift%d' % shift] = {'sigma': sig, 'first_negative_order': first_bad, 'first_undecided_order': first_und,
                                  'log10_abs_D': [l for s, l in hs]}
    return res


NPP = None


def window_plan(prec, nmax):
    """half-width W (multiple of 1/8) with pi e^{4W}/8 >= (prec + 200) ln 2 + nmax log(4W): beyond it the integrand
    u^n Phi(u), n <= nmax, is below 2^-(prec+200) of the moment for every conductor <= 8; and nodes per panel."""
    W = 1.5
    while math.pi*math.exp(4*W)/8 < (prec + 200)*math.log(2) + nmax*math.log(4*W):
        W += 0.125
    return W, int(prec/6.5) + 24 + nmax//6


def job(arg):
    global NPP
    key, prec, NH = arg
    t0 = time.time()
    slib.setprec(prec)
    nmax = 4*NH + 2
    if EXT:
        W, NPP = window_plan(prec, nmax)
        slib.EXTRA_U = W - 1.5
    x, info, mode = taylor(key, nmax)
    xc = [z.conjugate() for z in x]
    g = cauchy(x, [((-1)**n)*0 + xc[n] for n in range(nmax + 1)], nmax)   # G(z) = Xi(z) conj(Xi(conj z))
    rec = {'key': key, 'prec': prec, 'NH': NH, 'mode': mode, 'extra_window': slib.EXTRA_U, 'npp': NPP}
    h = info.pop('_h', None)
    rec.update(info)
    csq = [((-1)**k)*g[2*k].real for k in range(2*NH + 1)]
    rec['max_odd_g_log10'] = max((slib.log10abs(abs(g[n])) if abs(g[n]).mid() != 0 else -9999.0) for n in range(1, nmax, 2))
    rec['c_sq_first'] = [z.str(20) for z in csq[:4]]
    rec['c_sq_positive'] = all(z > 0 for z in csq)
    rec['sq'] = analyse(csq, NH)
    if mode == 'even' and not key.startswith('U('):
        clin = [((-1)**k)*x[2*k].real for k in range(2*NH + 1)]
        rec['c_lin_positive'] = all(z > 0 for z in clin)
        rec['lin'] = analyse(clin, NH)
    if mode == 'os' and h is not None:
        # source ladder: M_n = int_0^inf tau^n A(tau) dtau, A one-sided = (1/2) sum C(n,k)(-1)^k h_k h_{n-k} for even n
        M = {}
        for n in (0, 2, 4):
            s = arb(0)
            for k in range(n + 1):
                s += math.comb(n, k)*(-1)**k*h[k].real*h[n - k].real
            M[n] = (s/2).str(15)
        rec['M_one_sided'] = M
    rec['sec'] = time.time() - t0
    sys.stderr.write('%s done %.1fs first_neg sq %s lin %s und %s\n' % (key, rec['sec'], rec['sq']['shift0']['first_negative_order'],
                     rec.get('lin', {}).get('shift0', {}).get('first_negative_order'), rec['sq']['shift0']['first_undecided_order']))
    return rec


def synthetic(NH):
    """validation: finite products with known zeros."""
    out = {}
    g1 = [arb(k*k) + arb(k)/3 for k in range(1, 3*NH)]            # all real zeros: f(y) = prod (1 + y/g)
    def coeffs(roots_real, pair=None):
        p = [arb(1)]
        for g in roots_real:
            p = [(p[i] if i < len(p) else 0) + (p[i - 1]/g if i >= 1 else 0) for i in range(len(p) + 1)]
        if pair is not None:
            a, b = pair                                           # factor 1 + a y + b y^2 with complex roots
            p = [(p[i] if i < len(p) else 0) + (a*p[i - 1] if 1 <= i <= len(p) else 0) + (b*p[i - 2] if 2 <= i <= len(p) + 1 else 0) for i in range(len(p) + 2)]
        return p + [arb(0)]*(2*NH + 2)
    out['real_zeros'] = analyse(coeffs(g1), NH)['shift0']['first_negative_order']
    # replace the 6th zero by a complex pair g6 (1 +- 0.3 i)
    z = acb(g1[5], g1[5]*arb('0.3'))
    a = (1/z + 1/z.conjugate()).real; b = (1/(z*z.conjugate())).real
    out['pair_at_6th'] = analyse(coeffs(g1[:5] + g1[6:], (a, b)), NH)['shift0']['first_negative_order']
    z = acb(g1[0], g1[0]*arb('0.3'))
    a = (1/z + 1/z.conjugate()).real; b = (1/(z*z.conjugate())).real
    out['pair_at_1st'] = analyse(coeffs(g1[1:], (a, b)), NH)['shift0']['first_negative_order']
    for ph in ('0.3', '1.2', '1.4'):
        z = acb(0, arb(ph)).exp()*g1[0]
        a = (1/z + 1/z.conjugate()).real; b = (1/(z*z.conjugate())).real
        out['pair_at_1st_arg' + ph] = analyse(coeffs(g1[1:], (a, b)), NH)['shift0']['first_negative_order']
    out['negative_x_at_3rd'] = analyse(coeffs(g1[:2] + [-g1[2]] + g1[3:]), NH)['shift0']['first_negative_order']
    # identity check: D_2 = -(h_2 of the reciprocal roots) for two roots
    x1 = arb(1)/3; x2 = arb(1)/7
    c = [arb(1), x1 + x2, x1*x2, arb(0), arb(0)]
    out['D2_identity_defect'] = float(abs((c[0]*c[2] - c[1]*c[1]) + (x1*x1 + x1*x2 + x2*x2)))
    return out


C4KEYS = ['zeta', 'chi-4', 'chi5', 'chi-3', 'chi-7', 'chi8', 'E_b=0.125', 'E_b=0.25', 'NR(1000003,2.2)', 'NR(1000003,1.9)',
          'NR(3,2.2)', 'NR(3,1.9)', 'DH', 'heat-2.0', 'heat-0.5', 'heat-0.2', 'heat-0.1', 'heat-0.05', 'heat0.05', 'heat0.2', 'heat0.5',
          'liouville', 'zeta_os', 'zeta_repo', 'U(2.0)', 'gauge0.3', 'zeta_lead']

EXT = os.environ.get('S5_EXT', '0') == '1'      # extended windows (set for every run after the first server run)

if __name__ == '__main__':
    out = sys.argv[1]; prec = int(sys.argv[2]); NH = int(sys.argv[3])
    ks = sys.argv[4].split(';') if len(sys.argv) > 4 and sys.argv[4] != 'all' else C4KEYS
    nw = int(os.environ.get('RH_WORKERS', '4'))
    slib.setprec(max(2000, prec//2))
    syn = synthetic(min(NH, 16))
    print('synthetic validation:', syn)
    with Pool(nw) as p:
        recs = p.map(job, [(k, prec, NH) for k in ks], chunksize=1)
    json.dump({'synthetic': syn, 'recs': recs}, open(out, 'w'))
    print('wrote', out)
