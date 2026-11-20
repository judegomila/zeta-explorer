# Combination 3: exact-saddle ratio of autocorrelation moments (imp-3849 definitions).
#   A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, M_m = int tau^m A, C_n = M_{n+2}/((n+1)(n+2)M_n), D_n = C_{n+2}-C_n,
#   tau*(n): n = (4 pi/q) tau e^{4 tau} (q = 1 for zeta), C^s_n = tau*^2/((n+1)(n+2)), R_n = |D_n|/|D^s_n|,
#   eps_n = M_{n+2}/(M_n tau*^2) - 1.
# Arithmetic: python-flint arb at PREC bits; panelled Gauss-Legendre (no rigorous quadrature remainder: MEASURED).
import sys, os, json, math, time
from flint import arb, ctx
import numpy as np
PREC = int(os.environ.get('PREC', 256)); ctx.prec = PREC
MMAX = int(os.environ.get('MMAX', 640))
NP_OUT = int(os.environ.get('NP_OUT', 64)); NP_IN = int(os.environ.get('NP_IN', 16)); NG = int(os.environ.get('NG', 32))
PI = arb.pi()

def gl_arb(n):
    # nodes/weights on [-1,1] from mpmath at matching precision
    import mpmath as mp
    mp.mp.prec = PREC + 20
    xs = []; ws = []
    for k in range(1, n + 1):
        x = mp.cos(mp.pi*(k - mp.mpf(1)/4)/(n + mp.mpf(1)/2))
        for _ in range(100):
            p0, p1 = mp.mpf(1), x
            for j in range(2, n + 1):
                p0, p1 = p1, ((2*j - 1)*x*p1 - (j - 1)*p0)/j
            dp = n*(x*p1 - p0)/(x*x - 1)
            dx = p1/dp; x -= dx
            if abs(dx) < mp.mpf(2)**(-PREC - 10): break
        p0, p1 = mp.mpf(1), x
        for j in range(2, n + 1):
            p0, p1 = p1, ((2*j - 1)*x*p1 - (j - 1)*p0)/j
        dp = n*(x*p1 - p0)/(x*x - 1)
        xs.append(arb(mp.nstr(x, PREC//3 + 10))); ws.append(arb(mp.nstr(2/((1 - x*x)*dp*dp), PREC//3 + 10)))
    return xs, ws
GX, GW = gl_arb(NG)

def panel_nodes(a, b, npan):
    xs = []; ws = []
    h = (b - a)/npan
    for p in range(npan):
        lo = a + h*p
        for x, w in zip(GX, GW):
            xs.append(lo + h*(x + 1)/2); ws.append(w*h/2)
    return xs, ws

def mk_zeta(N=14, repo=False):
    def f(u):
        e4 = (4*u).exp(); s = arb(0)
        if repo:
            e2 = (2*u).exp()
            for n in range(1, 11):
                s += (2*PI*PI*n**4*e4 - 3*PI*n*n*e2)*(-PI*n*n*e4).exp()
            return s
        e5 = (5*u).exp(); e9 = (9*u).exp()
        for n in range(1, N + 1):
            s += (2*PI*PI*n**4*e9 - 3*PI*n*n*e5)*(-PI*n*n*e4).exp()
        return s
    return f

def mk_F(b, q, delta, N=None, only_n1=False):
    if N is None: N = int(24*math.sqrt(q)) + 10
    bb = [arb(repr(x)) if not isinstance(x, arb) else x for x in b]
    def f(u):
        e4 = (4*u).exp(); s = arb(0)
        for n in range(1, (1 if only_n1 else N) + 1):
            if b[n % q] == 0: continue
            s += bb[n % q]*(n**delta)*(-PI*n*n*e4/q).exp()
        return 4*((1 + 2*delta)*u).exp()*s
    return f

def heat(f, tau):
    t = arb(repr(tau))
    return lambda u: f(u)*(t*u*u).exp()

def saddle_tau(n, q):
    import mpmath as mp
    mp.mp.prec = PREC
    return arb(mp.nstr(mp.findroot(lambda x: 4*mp.pi/q*x*mp.exp(4*x) - n, 0.25*mp.log(n*q/(4*mp.pi) + 2) + 0.1), PREC//3 + 5))

def ladder(phi, q, T_out, S_in, mmax=MMAX):
    t0 = time.time()
    s, ws = panel_nodes(arb(0), arb(repr(S_in)), NP_IN)
    tau, wt = panel_nodes(arb(0), arb(repr(T_out)), NP_OUT)
    phis = [phi(x) for x in s]
    A = []
    for tj in tau:
        acc = arb(0)
        for x, w, p in zip(s, ws, phis):
            acc += w*p*phi(x + tj)
        A.append(acc)
    vec = [w*a for w, a in zip(wt, A)]
    M = []
    for m in range(mmax + 1):
        M.append(sum(vec, arb(0)))
        vec = [v*tj for v, tj in zip(vec, tau)]
    C = lambda n: M[n + 2]/((n + 1)*(n + 2)*M[n])
    ts = {}
    def tst(n):
        if n not in ts: ts[n] = saddle_tau(n, q)
        return ts[n]
    Cs = lambda n: tst(n)**2/((n + 1)*(n + 2))
    rows = []
    for n in range(3, mmax - 3):
        D = C(n + 2) - C(n); Ds = Cs(n + 2) - Cs(n)
        R = abs(D)/abs(Ds)
        eps = M[n + 2]/M[n]/tst(n)**2 - 1
        rows.append((n, float((R - 1).mid()), float(eps.mid()), float((R - 1).rad()), float(D.mid()) < 0))
    return rows, time.time() - t0, float(A[0].mid())

def landmarks(rows):
    r = {n: x for n, x, e, rad, sg in rows}; ep = {n: e for n, x, e, rad, sg in rows}
    ns = sorted(r)
    def sign_changes(d):
        out = []
        for a, b in zip(ns[:-1], ns[1:]):
            if d[a] == 0 or d[a]*d[b] < 0:
                out.append(round(a + d[a]/(d[a] - d[b]), 3))
        return out
    nmin = min(ns, key=lambda n: r[n])
    return {'n_range': [ns[0], ns[-1]], 'r_sign_changes_at': sign_changes(r)[:12], 'eps_sign_changes_at': sign_changes(ep)[:12],
            'n_r_sign_changes': len(sign_changes(r)), 'n_eps_sign_changes': len(sign_changes(ep)),
            'r_min': r[nmin], 'argmin_r': nmin, 'r_at_3': r[3], 'r_at_40': r.get(40), 'r_at_last': r[ns[-1]],
            'eps_at_40': ep.get(40), 'eps_at_last': ep[ns[-1]], 'max_ball_radius_r': max(x[3] for x in rows),
            'sample_r': {str(n): r[n] for n in (10, 50, 100, 148, 149, 200, 215, 216, 300, 500, 620, 1000, 1500, 2000) if n in r},
            'sample_eps': {str(n): ep[n] for n in (10, 50, 100, 148, 149, 200, 300, 500, 620, 1000, 2000) if n in ep}}

import klib
jobs = []
jobs.append(('zeta_repo_kernel_as_typed(imp-3849)', mk_zeta(repo=True), 1, 1.7, 1.1))
jobs.append(('zeta_canonical_Phi', mk_zeta(), 1, 1.7, 1.1))
for q in (3, 4, 7, 5, 8):
    b, d = klib.real_char(q)
    jobs.append(('chi_real_q%d_delta%d' % (q, d), mk_F(b, q, d), q, 1.7 + math.log(q)/4, 1.1 + math.log(q)/4))
import mpmath as mp
mp.mp.prec = PREC
kap = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
ak = arb(mp.nstr(kap, PREC//3 + 5))
dhb = [arb(0), arb(1), ak, -ak, arb(-1)]
ext = math.log(5)/4
jobs.append(('DH', mk_F(dhb, 5, 1), 5, 1.7 + ext, 1.1 + ext))
jobs.append(('DH_n1_term_only', mk_F(dhb, 5, 1, only_n1=True), 5, 1.7 + ext, 1.1 + ext))
jobs.append(('DH_twin_T-_q5', mk_F([arb(0), arb(1), -1/ak, 1/ak, arb(-1)], 5, 1), 5, 1.7 + ext, 1.1 + ext))
for tau in (-2.0, -0.5, -0.1, 0.1, 0.5):
    jobs.append(('zeta_canonical_heat_tau=%g' % tau, heat(mk_zeta(), tau), 1, 1.7, 1.1))
    jobs.append(('zeta_repo_heat_tau=%g' % tau, heat(mk_zeta(repo=True), tau), 1, 1.7, 1.1))
sel = os.environ.get('SEL')
if sel: jobs = [j for j in jobs if any(s in j[0] for s in sel.split(','))]
which = int(os.environ.get('SHARD', -1)); nsh = int(os.environ.get('NSHARD', 1))
out = {'PREC': PREC, 'MMAX': MMAX, 'panels': [NP_OUT, NP_IN, NG], 'results': {}}
outf = os.path.join(klib.HERE, sys.argv[1] if len(sys.argv) > 1 else 'c3_saddle.json')
for i, (name, f, q, T, S) in enumerate(jobs):
    if which >= 0 and i % nsh != which: continue
    rows, secs, A0 = ladder(f, q, T, S)
    lm = landmarks(rows); lm['secs'] = secs; lm['A(0)'] = A0; lm['q_in_saddle'] = q
    out['results'][name] = lm
    out.setdefault('rows', {})[name] = [(n, x, e) for n, x, e, rad, sg in rows]
    print(name, json.dumps(lm), flush=True)
    json.dump(out, open(outf, 'w'))
