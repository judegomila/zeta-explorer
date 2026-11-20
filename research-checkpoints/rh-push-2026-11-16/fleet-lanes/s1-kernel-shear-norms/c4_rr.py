# Combination 4: reverse regularity of the Hankel kernel s(x+y), s(t) = Phi_F(sqrt t).
# Coincident-node (Wronskian/Hankel) conditions: W_k(t) = det[ s^{(i+j)}(t) ]_{i,j=0..k-1};
# strict reverse regularity of order r requires sign W_k(t) = (-1)^{k(k-1)/2} for all t > 0, k = 1..r.
# (For a Hankel kernel the k x k minors with distinct nodes are, by the mean-value/Cauchy-Binet argument, integrals of
#  these Wronskians; a sign violation of W_k at one t gives a violating minor with nearby nodes.)
# Also a direct k x k minor test on equally spaced nodes as a cross-check.
# Arithmetic: python-flint arb power series (ball arithmetic on the truncated theta series; series tails are below 1e-300
# at the working truncation and are not enclosed).
import sys, os, json, math
from flint import arb, arb_series, arb_mat, ctx
PREC = int(os.environ.get('PREC', 600)); ctx.prec = PREC
KMAX = int(os.environ.get('KMAX', 7))
ORD = 2*KMAX
ctx.cap = ORD + 2
PI = arb.pi()

def series_var(t0):
    return arb_series([arb(t0), 1], prec=ORD + 1)

def s_zeta(T, N=40):
    U = T.sqrt()
    e4 = (4*U).exp(); e5 = (5*U).exp(); e9 = (9*U).exp(); s = 0
    for n in range(1, N + 1):
        s = s + (2*PI*PI*n**4*e9 - 3*PI*n*n*e5)*((-PI*n*n)*e4).exp()
    return s

def mk_sF(b, q, delta, N=None, only=None):
    if N is None: N = int(float(os.environ.get('NCOEF', 16))*math.sqrt(q)) + 8
    def f(T):
        U = T.sqrt(); e4 = (4*U).exp(); s = 0
        for n in range(1, N + 1):
            if b[n % q] == 0: continue
            if only and n not in only: continue
            s = s + (b[n % q]*(n**delta))*((-PI*n*n/q)*e4).exp()
        return 4*((1 + 2*delta)*U).exp()*s
    return f

def heat(f, tau):
    return lambda T: f(T)*(arb(repr(tau))*T).exp()

def derivs(f, t0):
    S = f(series_var(t0))
    c = [S[i] for i in range(ORD + 1)]
    fac = arb(1); d = []
    for i in range(ORD + 1):
        if i > 0: fac *= i
        d.append(c[i]*fac)
    return d

def wronskians(d, kmax=KMAX):
    out = []
    for k in range(1, kmax + 1):
        M = arb_mat(k, k, [d[i + j] for i in range(k) for j in range(k)])
        out.append(M.det())
    return out

def sgn(x):
    if x > 0: return 1
    if x < 0: return -1
    return 0   # ball contains zero

def scan(f, tgrid):
    """returns per-k: list of t where sign != expected (expected (-1)^{k(k-1)/2}) and where undetermined"""
    bad = {k: [] for k in range(1, KMAX + 1)}; und = {k: [] for k in range(1, KMAX + 1)}; vals = {}
    for t0 in tgrid:
        W = wronskians(derivs(f, t0))
        for k, x in enumerate(W, 1):
            e = (-1)**(k*(k - 1)//2); s = sgn(x)
            if s == 0: und[k].append(t0)
            elif s != e: bad[k].append(t0)
        vals[t0] = [x.str(8) for x in W]
    return bad, und, vals

def minor_test(f, k, x0, h, exact_from=None):
    """sign of det[s(x_i + y_j)] with x_i = y_i = x0 + i h (k x k), value function from the 0th series coefficient."""
    v = {}
    def sv(t):
        if t not in v: v[t] = f(arb_series([arb(t)], prec=1))[0]
        return v[t]
    M = arb_mat(k, k, [sv(2*x0 + (i + j)*h) for i in range(k) for j in range(k)])
    return M.det()

import klib
import mpmath as mp
mp.mp.prec = PREC
kap = arb(mp.nstr((mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1), PREC//3))
dhb = [arb(0), arb(1), kap, -kap, arb(-1)]
objs = [('zeta', s_zeta)]
for D in klib.fundamental_discriminants(int(os.environ.get('DMAX', 13))):
    b, d = klib.kron_char(D)
    objs.append(('chi_real_q%d_delta%d_D=%d' % (abs(D), d, D), mk_sF([int(x) for x in b], abs(D), d)))
objs.append(('DH', mk_sF(dhb, 5, 1)))
objs.append(('DH_n1_term_only', mk_sF(dhb, 5, 1, only={1})))
for tau in (-50.0, -1.0, 1.0, 50.0):
    objs.append(('zeta_heat_tau=%g' % tau, heat(s_zeta, tau)))
ntw = int(os.environ.get('NTWIN', 0))
if ntw:
    # coefficients at full working precision: with float64 coefficients Phi_F is even only to 1e-16 and the odd part
    # eps*sqrt(t) of s(t) = Phi(sqrt t) dominates high derivatives near t = 0
    tw = klib.twin_table_mp(PREC)
    step = max(1, len(tw)//ntw)
    for T in tw[::step]:
        objs.append(('twin_' + T['key'], mk_sF([arb(x) for x in T['b']], T['q'], T['delta'])))
if os.environ.get('ONLY_TWINS'): objs = [o for o in objs if o[0].startswith('twin_')]
NT = int(os.environ.get('NT', 120))
# t grid: log-spaced from 1e-6 to TMAXT (u = sqrt t from 1e-3 to ~1.3 (+ conductor shift))
def tgrid(q):
    lo, hi = 1e-6, (1.25 + math.log(q)/4)**2
    return [repr(lo*(hi/lo)**(i/(NT - 1))) for i in range(NT)]
out = {'PREC': PREC, 'KMAX': KMAX, 'NT': NT, 'results': {}}
outf = os.path.join(klib.HERE, sys.argv[1] if len(sys.argv) > 1 else 'c4_rr.json')
which = int(os.environ.get('SHARD', -1)); nsh = int(os.environ.get('NSHARD', 1))
for i, (name, f) in enumerate(objs):
    if which >= 0 and i % nsh != which: continue
    q = 1
    for tok in name.replace('twin_q', '_q').split('_'):
        if tok.startswith('q') and tok[1:].split('.')[0].isdigit(): q = int(tok[1:].split('.')[0])
    if name.startswith('DH'): q = 5
    g = tgrid(q)
    bad, und, vals = scan(f, g)
    order = 0
    for k in range(1, KMAX + 1):
        if bad[k] or und[k]: break
        order = k
    res = {'strict_RR_order_on_grid': order, 'first_violations': {str(k): bad[k][:3] for k in bad if bad[k]},
           'n_violations': {str(k): len(bad[k]) for k in bad}, 'n_undetermined': {str(k): len(und[k]) for k in und},
           'violation_t_range': {str(k): [bad[k][0], bad[k][-1]] for k in bad if bad[k]},
           't_range': [g[0], g[-1]]}
    # the source's quoted point t = 1e-2
    W = wronskians(derivs(f, '0.01'))
    res['W_k_at_t=0.01'] = [x.str(10) for x in W]
    res['signs_at_t=0.01_times_expected'] = [sgn(x)*(-1)**(k*(k - 1)//2) for k, x in enumerate(W, 1)]
    # direct minors on spaced nodes around t = 0.01 (x0 + y0 = 0.01 - (k-1)h)
    res['minor_k5_nodes_h=1e-3_sum0=0.006'] = minor_test(f, 5, 0.003, 0.001).str(10)
    res['minor_k4_nodes_h=1e-3_sum0=0.007'] = minor_test(f, 4, 0.0035, 0.001).str(10)
    out['results'][name] = res
    out.setdefault('values', {})[name] = {t: vals[t] for t in list(vals)[::max(1, NT//12)]}
    print(name, json.dumps(res), flush=True)
    json.dump(out, open(outf, 'w'))
