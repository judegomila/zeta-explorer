"""Odd/even Taylor blocks of the PR-56 cutoff operator for xi and for the
Davenport-Heilbronn completion.  Kernel K(u) (even), F(z) = c*int K(u) e^{2zu} du.
  H0(u,v) = int_0^inf (2r-u-v) K(r-u) K(r-v) dr
  T_ab = d_u^a d_v^b H0 (0,0) = int_0^inf [2r K^(a)K^(b) + a K^(a-1)K^(b) + b K^(a)K^(b-1)] dr  (a+b even)
Odd block J_N ~ [T_ab], a,b in {1,3,..,2N-1}; even block: a,b in {0,2,..}.
Arithmetic: arb balls (rounding tracked); quadrature = tanh-sinh, discretisation checked by level doubling.
usage: jn.py which(zeta|dh) N prec_bits h_level [workers]
"""
import sys, json
from flint import arb, ctx
from multiprocessing import Pool

which = sys.argv[1]; N = int(sys.argv[2]); PREC = int(sys.argv[3]); LEV = int(sys.argv[4])
W = int(sys.argv[5]) if len(sys.argv) > 5 else 1
ctx.prec = PREC
import os
MULTS = {int(k): v for k, v in (kv.split(':') for kv in os.environ.get('MULT', '').split(',') if kv)}
AMAX = 2*N  # derivative orders 0..2N-1 (need a-1 too)

def setup():
    ctx.prec = PREC
    pi = arb.pi()
    digits = PREC*0.30103
    terms = []  # (k, c, poly0 in y) with K = sum w^k P(y) exp(-c y), y=w^4, w=e^u
    if which == 'zeta':
        n = 1
        while 3.14159*n*n < digits*2.31 + 40:
            mult = arb(str(MULTS.get(n, MULTS.get(0, '1'))))
            if mult != 0: terms.append((5, pi*n*n, [mult*(-3*pi*n*n), mult*2*pi*pi*n**4]))
            n += 1
        U = 0.25*__import__('math').log((digits*2.31+60)/3.14159)
    else:
        s5 = arb(5).sqrt()
        kap = ((10-2*s5).sqrt()-2)/(s5-1)
        a = [0, arb(1), kap, -kap, arb(-1)]
        n = 1
        while 3.14159*n*n/5 < digits*2.31 + 40:
            if n % 5: terms.append((3, pi*n*n/5, [a[n % 5]*n*arb(str(MULTS.get(n, '1')))]))
            n += 1
        U = 0.25*__import__('math').log((digits*2.31+60)*5/3.14159)
    # derivative polys: D(w^k P e^{-cy}) = w^k (kP + 4yP' - 4cyP) e^{-cy}
    polys = []
    for (k, c, P) in terms:
        lst = [P]
        for _ in range(AMAX):
            P = lst[-1]
            Q = [arb(0)]*(len(P)+1)
            for i, p in enumerate(P):
                Q[i] = Q[i] + (k+4*i)*p
                Q[i+1] = Q[i+1] - 4*c*p
            lst.append(Q)
        polys.append((k, c, lst))
    return polys, U

POLYS, U = setup()

def derivs(u):
    """K^(a)(u), a=0..AMAX-1"""
    w = u.exp(); y = w**4
    out = [arb(0)]*AMAX
    for (k, c, lst) in POLYS:
        pref = w**k*(-c*y).exp()
        for a in range(AMAX):
            P = lst[a]; s = P[-1]
            for i in range(len(P)-2, -1, -1):
                s = s*y + P[i]
            out[a] = out[a] + pref*s
    return out

def ser(x):
    m, e = x.mid().man_exp()
    return (int(m), int(e), x.rad().str(5, radius=False))
def unser(t):
    v = arb(t[0])*(arb(2)**t[1])
    return v + arb(0, float(t[2])*1.0001 + 0.0) if float(t[2]) > 0 else v
def chunk(js):
    ctx.prec = PREC
    tot = None
    for j in js:
        o = node_contrib(j)
        if o is None: continue
        if tot is None: tot = o
        else:
            for name in tot:
                for i in range(N):
                    for k in range(N):
                        tot[name][i][k] = tot[name][i][k] + o[name][i][k]
    if tot is None: return None
    return {name: [[ser(x) for x in row] for row in tot[name]] for name in tot}
def node_contrib(j):
    ctx.prec = PREC
    h = arb(1)/(2**LEV)
    t = arb(j)*h
    # map [0,U]: r = U/2 (1+tanh(pi/2 sinh t))
    sh = (arb.pi()/2)*t.sinh()
    x = sh.tanh()
    wgt = (arb.pi()/2)*t.cosh()/(sh.cosh()**2)*h*arb(U)/2
    r = arb(U)/2*(1+x)
    if not (r > 0) :
        return None
    d = derivs(r)
    idx_o = list(range(1, 2*N, 2)); idx_e = list(range(0, 2*N, 2))
    res = {}
    for name, idx in (('odd', idx_o), ('even', idx_e)):
        M = []
        for a in idx:
            row = []
            for b in idx:
                v = 2*r*d[a]*d[b]
                if a > 0: v = v + a*d[a-1]*d[b]
                if b > 0: v = v + b*d[a]*d[b-1]
                row.append(wgt*v)
            M.append(row)
        res[name] = M
    return res

def ldl(M):
    n = len(M); A = [row[:] for row in M]; piv = []
    for k in range(n):
        p = A[k][k]; piv.append(p)
        if not (p > 0 or p < 0): return piv, False
        for i in range(k+1, n):
            f = A[i][k]/p
            for j in range(k+1, n):
                A[i][j] = A[i][j] - f*A[k][j]
    return piv, True

if __name__ == '__main__':
    import math
    h = arb(1)/(2**LEV)
    # t-range: tanh-sinh needs |t| up to ~ asinh(2/pi * atanh-ish); choose tmax so 1-x ~ 2^-PREC
    tmax = math.asinh((PREC*0.6931+10)/3.1416*1.0)
    J = int(tmax*2**LEV)+1
    args = list(range(-J, J+1))
    chunks = [args[i::max(W,1)*4] for i in range(max(W,1)*4)]
    if W > 1:
        with Pool(W) as p: out = p.map(chunk, chunks)
    else:
        out = list(map(chunk, chunks))
    out = [{name: [[unser(x) for x in row] for row in o[name]] for name in o} for o in out if o is not None]
    report = {'which': which, 'N': N, 'prec': PREC, 'level': LEV, 'nodes': len(args), 'U': U, 'nterms': len(POLYS)}
    for name in ('odd', 'even'):
        M = [[arb(0)]*N for _ in range(N)]
        for o in out:
            if o is None: continue
            for i in range(N):
                for j in range(N):
                    M[i][j] = M[i][j] + o[name][i][j]
        piv, ok = ldl(M)
        report[name+'_T00'] = str(M[0][0])
        report[name+'_ok'] = ok
        report[name+'_pivots'] = [p.str(12) for p in piv]
        report[name+'_signs'] = ''.join('+' if p > 0 else ('-' if p < 0 else '?') for p in piv)
        report[name+'_pivmid'] = [float(p.mid()) if abs(float(p.mid()))>1e-300 else p.mid().str(8) for p in piv]
        report[name+'_M_first'] = [M[i][j].str(30) for i in range(min(N,2)) for j in range(min(N,2))]
    print(json.dumps(report, indent=1))
