# Combination 4: truncated theta kernels (sign changes) and algebraic differential closure of the kernel.
#  zeros: (i) canonical zeta kernel, x = e^{4u}:  Phi_N = x^{1/4} G_N(x), G_N(x) = sum_{n<=N} pi n^2 x (2 pi n^2 x - 3) e^{-pi n^2 x}.
#             Every term is >= 0 for x >= 3/(2 pi)  (u >= (1/4) ln(3/(2 pi)) = -0.18482; the source writes the same
#             threshold as (1/2) ln(3/(2 pi)) = -0.36963 in its variable u_src = 2u).  Largest zero x_0(N) and the
#             number of sign changes on (3/(2 pi N^2), 3/(2 pi)).
#         (ii) replay of imp-3347 with the kernel as coded there (prefactors e^{4u}, e^{2u}, Gaussian exp(-pi n^2 e^{4u})).
#         (iii) controls: truncated Dirichlet-type kernels sum_{n<=N} b(n) n^delta e^{-pi n^2 x/q}, the weight-12 kernel
#             sum_{n<=N} tau(n) e^{-2 pi n y}, the T-NR kernel built from Phi_N: sign changes on u > 0.
#  ode:   the system a' = 2a^2 + (v-1)/8, c' = 4ac + 2v, v' = v(8a - c) for H = e^{u/4} theta_3(i e^u) (residual check),
#         and for every kernel the dimension of the space of polynomial relations P(a, a', a'', a''') = 0 of total
#         degree <= D, a = K'/K (numerical nullity of the monomial collocation matrix on points of the curve).
# usage: python t_trunc.py zeros <out.json> [Nmax]   |   python t_trunc.py ode <out.json> <kernels> <Dmax> [prec]
import sys, os, json, time, math
import multiprocessing as mp
from flint import arb, arb_series, ctx
import klib3 as K3

LN2 = math.log(2.0)


def G_N(x, N):
    """sum_{n<=N} pi n^2 x (2 pi n^2 x - 3) exp(-pi n^2 x), powers of E = e^{-pi x} by recurrence."""
    pix = arb.pi()*x
    E = (-pix).exp()
    E2 = E*E
    en2 = E            # E^{n^2}
    odd = E*E2         # E^{2n+1} for n = 1
    s = arb(0)
    cut = arb(2)**(-(ctx.prec + 64))
    for n in range(1, N + 1):
        z = pix*(n*n)
        s += z*(2*z - 3)*en2
        if n > 3 and en2 < cut:
            break
        en2 = en2*odd
        odd = odd*E2
    return s


def zeta_trunc(N):
    t0 = time.time()
    # bracket: G_N > 0 at x = 3/(2 pi); G_N < 0 at x slightly above 3/(2 pi N^2)
    hi = 3/(2*math.pi)
    lowf = 0.3 if N < 50 else 0.9          # bracket [lowf/N, .] ; G_N ~ e^{-pi/x} needs pi N/(lowf ln 2) bits
    prec = int(256 + 1.15*math.pi*N/(lowf*LN2)) if N > 1 else 256
    K3.setp(prec, 1)
    out = {'N': N, 'prec': prec}
    if N == 1:
        out.update({'x0': hi, 'u0': 0.25*math.log(hi), 'sign_changes': 1, 'note': 'single term: zero at 3/(2 pi)'})
        return out
    # coarse scan on a log grid (only for N <= 256) to count the sign changes
    lo = 3/(2*math.pi*N*N)
    if N <= 256:
        npt = 600
        sig = []
        for i in range(npt + 1):
            x = arb(lo)*(arb(hi/lo)**(arb(i)/npt))
            sig.append(K3.sgn(G_N(x, N)))
        ch = sum(1 for i in range(1, len(sig)) if sig[i]*sig[i - 1] < 0)
        out['sign_changes'] = ch + (1 if sig[0] > 0 else 0)
        out['scan_undetermined'] = sig.count(0)
    a = lowf/N; b = min(hi, 4.0/N) if N < 50 else 1.05/N
    sa = K3.sgn(G_N(arb(a), N)); sb = K3.sgn(G_N(arb(b), N))
    out['bracket_signs'] = [sa, sb]
    if sa < 0 and sb > 0:
        for _ in range(70):
            m = 0.5*(a + b)
            s = K3.sgn(G_N(arb(m), N))
            if s > 0:
                b = m
            elif s < 0:
                a = m
            else:
                break
        x0 = 0.5*(a + b)
        out.update({'x0': x0, 'u0': 0.25*math.log(x0), 'N_x0': N*x0, 'u0_plus_quarter_logN': 0.25*math.log(x0) + 0.25*math.log(N)})
    out['seconds'] = time.time() - t0
    return out


def repo_trunc(N):
    """imp-3347 kernel as coded: sum (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})."""
    K3.setp(256, 1)
    def f(u):
        u = arb(u)
        e2 = (2*u).exp(); e4 = e2*e2
        s = arb(0)
        pi = arb.pi()
        for n in range(1, N + 1):
            s += (2*pi*pi*n**4*e4 - 3*pi*n*n*e2)*(-pi*n*n*e4).exp()
        return s
    u1 = 0.5*math.log(3/(2*math.pi))
    prev = u1; u = u1 - 1e-3
    while u > -12:
        if f(u) < 0:
            lo, hi = u, prev
            for _ in range(60):
                m = 0.5*(lo + hi)
                if f(m) < 0:
                    lo = m
                else:
                    hi = m
            u0 = 0.5*(lo + hi)
            return {'N': N, 'u0': u0, 'margin_u1star_minus_u0': u1 - u0, 'leading_formula': 0.5*math.log(5/(2*math.pi*N*N))}
        prev = u; u -= 1e-3
    return {'N': N, 'u0': None}


def dir_trunc(args):
    """sign changes on u > 0 (x > 1) and on all x of the truncated Dirichlet-type kernel."""
    name, Ns = args
    K3.setp(256, 1)
    sp = K3.SPEC(name)
    out = {'kernel': name, 'rows': []}
    pi = arb.pi()
    if sp['type'] == 'dir':
        b = K3._bvec(sp); q = sp['q']; d = sp['delta']
        def val(x, N):
            s = arb(0)
            for n in range(1, N + 1):
                if sp['bnz'][n % q]:
                    s += b[n % q]*(n**d)*(-(pi*n*n/q)*x).exp()
            return s
        xgrid_pos = [math.exp(8*i/1600) for i in range(0, 1601)]          # x in [1, e^8], u in [0, 2]
    elif sp['type'] == 'delta':
        tau = K3.tau_table(1200)
        def val(x, N):                                                    # x = y^2 = e^{4u}
            y = x.sqrt()
            s = arb(0)
            for n in range(1, N + 1):
                s += tau[n]*(-(2*pi*n)*y).exp()
            return s
        xgrid_pos = [math.exp(8*i/1600) for i in range(0, 1601)]
    elif sp['type'] == 'liou':
        lam = K3.liou_table(400)
        def val(x, N):
            s = arb(0)
            for n in range(1, N + 1):
                s += lam[n]*(-(pi*n*n)*x).exp()
            return s
        xgrid_pos = [math.exp(8*i/1600) for i in range(0, 1601)]
    elif sp['type'] == 'tnr':
        l = math.log(sp['q']); c = arb(sp['c'])
        def PhiN(u, N):
            x = (4*u).exp()
            return (u/1).exp()*G_N(x, N) if False else x.root(4)*G_N(x, N)
        def val(x, N):
            u = x.log()/4
            return PhiN(u - arb(l)/2, N) + c*PhiN(u, N) + PhiN(u + arb(l)/2, N)
        xgrid_pos = [math.exp(8*i/1600) for i in range(0, 1601)]
    for N in Ns:
        sig = [K3.sgn(val(arb(x), N)) for x in xgrid_pos]
        ch = [xgrid_pos[i] for i in range(1, len(sig)) if sig[i]*sig[i - 1] < 0]
        out['rows'].append({'N': N, 'sign_at_u0': sig[0], 'sign_changes_u_gt_0': len(ch),
                            'largest_zero_u': (0.25*math.log(ch[-1]) if ch else None), 'undetermined': sig.count(0)})
    return out


# ---------------- ODE closure ----------------
def theta_H_series(u0, n):
    """H(u) = e^{u/4} theta_3(i e^u) = e^{u/4} (1 + 2 sum e^{-pi m^2 e^u}), Taylor coefficients at u0 >= 0."""
    U = arb_series([arb(u0), 1])
    t = U.exp()
    pi = arb.pi()
    s = arb_series([1])
    t0 = float(arb(u0).exp().mid())
    m = 1
    while math.pi*m*m*t0 < (ctx.prec + 40)*LN2:
        s = s + 2*(-(pi*m*m)*t).exp()
        m += 1
    return (U/4).exp()*s


def ode_residual():
    """residual of the system (1) of PR 46 at sample points, with v and c defined from a by the first two equations."""
    K3.setp(256, 8)
    rows = []
    for u0 in ('0', '0.1', '0.37', '0.9', '1.6'):
        Hs = theta_H_series(u0, 8)
        a = Hs.derivative()/Hs
        v = 8*a.derivative() - 16*a*a + 1
        c = 8*a - v.derivative()/v
        R = c.derivative() - 4*a*c - 2*v
        # closed forms: v = pi^2 t^2 theta_2^4 theta_4^4, c = pi t (theta_4^4 - theta_2^4), t = e^u
        t = arb(u0).exp(); pi = arb.pi()
        th2 = arb(0); th4 = arb(1)
        for m in range(0, 40):
            th2 += 2*(-(pi*t)*(arb(2*m + 1)/2)**2).exp()
        for m in range(1, 40):
            th4 += 2*(-1)**m*(-(pi*t)*m*m).exp()
        vcf = pi*pi*t*t*th2**4*th4**4
        ccf = pi*t*(th4**4 - th2**4)
        rows.append({'u': u0, 'residual_c_equation': R.coeffs()[0].str(8), 'v_minus_closed_form': (v.coeffs()[0] - vcf).str(8),
                     'c_minus_closed_form': (c.coeffs()[0] - ccf).str(8), 'a': a.coeffs()[0].str(12)})
    return rows


def jet(name, u0):
    """(a, a', a'', a''') at u0 for a = K'/K; name 'thetaH' is the node's H."""
    if name == 'thetaH':
        Ks = theta_H_series(u0, 6)
    else:
        Ks = arb_series(K3.kser(K3.SPEC(name), arb(u0), 6))
    a = (Ks.derivative()/Ks).coeffs()
    return [a[0], a[1], 2*a[2], 6*a[3]]


def monomials(D, nvar=4):
    out = []
    def rec(prefix, left, k):
        if k == nvar - 1:
            for e in range(left + 1):
                out.append(prefix + [e])
            return
        for e in range(left + 1):
            rec(prefix + [e], left - e, k + 1)
    rec([], D, 0)
    return out


def nullity(args):
    name, D, prec, umin, umax = args
    t0 = time.time()
    K3.setp(prec, 6)
    mons = monomials(D)
    n = len(mons)
    pts = [umin + (umax - umin)*(i + 0.5)/n for i in range(n)]
    rows = []
    for u0 in pts:
        j = jet(name, repr(u0))
        # normalise the variables to O(1) with fixed scales (does not change the nullity)
        pw = [[arb(1)] for _ in range(4)]
        for k in range(4):
            for e in range(D):
                pw[k].append(pw[k][-1]*j[k])
        rows.append([(pw[0][m[0]]*pw[1][m[1]]*pw[2][m[2]]*pw[3][m[3]]).mid() for m in mons])
    ctx.cap = 1
    # Gaussian elimination with full row pivoting on midpoints; record pivot magnitudes (log2)
    piv = []
    A = rows
    used_cols = []
    r = 0
    logs = []
    for cidx in range(n):
        # pivot search in column cidx among rows r..n-1
        best = None; bi = -1
        for i in range(r, n):
            v = abs(A[i][cidx])
            if best is None or v > best:
                best = v; bi = i
        # relative size against the column's original scale
        lg = float(best.log().mid())/LN2 if best > 0 else -1e9
        logs.append(lg)
        if lg < -prec*0.75:
            continue                      # dependent column
        A[r], A[bi] = A[bi], A[r]
        p = A[r][cidx]
        Ar = A[r]
        for i in range(r + 1, n):
            f = A[i][cidx]
            if f == 0:
                continue
            f = (f/p).mid()
            Ai = A[i]
            for jx in range(cidx + 1, n):
                Ai[jx] = (Ai[jx] - f*Ar[jx]).mid()
            Ai[cidx] = arb(0)
        r += 1
    ls = sorted(logs)
    indep = [v for v in ls if v >= -prec*0.75]
    return {'kernel': name, 'D': D, 'monomials': n, 'rank': r, 'nullity': n - r, 'prec': prec,
            'smallest_independent_pivot_log2': (round(indep[0], 1) if indep else None), 'threshold_log2': -prec*0.75,
            'smallest_pivot_log2': [round(v, 1) for v in ls[:6]], 'median_pivot_log2': round(ls[len(ls)//2], 1),
            'seconds': time.time() - t0}


if __name__ == '__main__':
    mode, outf = sys.argv[1], sys.argv[2]
    nw = int(os.environ.get('RH_WORKERS', '4'))
    t0 = time.time()
    if mode == 'zeros':
        Nmax = int(sys.argv[3]) if len(sys.argv) > 3 else 10000
        Ns = list(range(1, 101)) + [128, 181, 256, 362, 512, 724, 1000, 1448, 2048, 2896, 4096, 5793, 8192, 10000]
        Ns = [N for N in Ns if N <= Nmax]
        res = {'zeta_canonical': [], 'repo_kernel': [], 'controls': []}
        with mp.Pool(nw) as pool:
            res['repo_kernel'] = pool.map(repo_trunc, [10, 20, 40, 80])
            print('repo kernel', json.dumps(res['repo_kernel']), flush=True)
            names = ['dh', 'delta', 'liou', 'tnr3_2.2', 'tnr2_2.1'] + ['chi%d' % D for D in
                     (-3, -4, 5, -7, -8, 8, -11, 12, 13, -15, 17, -19, -20, 21, -23, -24, 24, 29, -43, -67, -163)]
            NsC = [1, 2, 3, 4, 5, 7, 10, 20, 50, 100, 300]
            for r in pool.imap_unordered(dir_trunc, [(nm, NsC) for nm in names], chunksize=1):
                res['controls'].append(r)
                print(json.dumps(r), flush=True)
            for r in pool.imap_unordered(zeta_trunc, sorted(Ns, reverse=True), chunksize=1):
                res['zeta_canonical'].append(r)
                print(json.dumps(r), flush=True)
                json.dump(res, open(outf, 'w'), indent=0)
        res['zeta_canonical'].sort(key=lambda d: d['N'])
        res['seconds'] = time.time() - t0
        json.dump(res, open(outf, 'w'), indent=0)
    else:
        names = sys.argv[3].split(',')
        Dmax = int(sys.argv[4])
        prec = int(sys.argv[5]) if len(sys.argv) > 5 else 1536
        res = {'system_residual': ode_residual(), 'nullity': []}
        print(json.dumps(res['system_residual']), flush=True)
        PREC = {2: 1024, 3: 1024, 4: 1536, 5: 2048, 6: 3072, 7: 4608, 8: 6144, 9: 9216, 10: 12288}
        tasks = [(nm, D, max(prec, PREC.get(D, 16384)), 0.03, 1.1) for D in range(2, Dmax + 1) for nm in names]
        with mp.Pool(nw) as pool:
            for r in pool.imap_unordered(nullity, tasks, chunksize=1):
                res['nullity'].append(r)
                print(json.dumps(r), flush=True)
                json.dump(res, open(outf, 'w'), indent=0)
        res['nullity'].sort(key=lambda d: (d['kernel'], d['D']))
        res['seconds'] = time.time() - t0
        json.dump(res, open(outf, 'w'), indent=0)
    print('DONE %.1f s' % (time.time() - t0))
