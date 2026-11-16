"""Series-arithmetic version of jn.py (same quantities, Taylor-normalised basis).
t_a(r) = K^(a)(r)/a!  (Taylor coefficients of K at r),
S_ab = T_ab/(a! b!) = sum_nodes wgt * [2 r t_a t_b + t_{a-1} t_b + t_a t_{b-1}]
usage: jn2.py which N prec_bits level workers
"""
import sys, json, math
from flint import arb, acb, arb_series, arb_mat, ctx
from multiprocessing import Pool
which = sys.argv[1]; N = int(sys.argv[2]); PREC = int(sys.argv[3]); NPAN = int(sys.argv[4]); NPER = int(sys.argv[5]); W = int(sys.argv[6])
L = 2*N  # series length
import os
PP = int(os.environ.get('PP', PREC))   # parameter precision for NMAX, U, tmax (>= PREC)
digits = PP*0.30103
A_ = 2*N; c_ = math.pi if which == 'zeta' else math.pi/5
need = PP*0.6931 + 60
NMAX = 2
while 2*(A_+3)*math.log(NMAX) - c_*(NMAX*NMAX-1) > -need: NMAX += 1
cy = max(A_, 10.0)
while cy - A_*math.log(4*cy) + (A_*math.log(4*A_) - A_ if A_ > 0 else 0) < need + 20: cy *= 1.01
U = 0.25*math.log(cy/c_)

def init():
    global E1, EK, EK9, c1, coef, pi
    ctx.prec = PREC; ctx.cap = L
    pi = arb.pi()
    global RHO
    re_, im_ = open('rho0.txt').read().split()
    RHO = acb(arb(re_) - arb(1)/2, arb(im_))     # centered zero delta + i gamma
    x = arb_series([0, 1])
    E1 = (4*x).exp() - 1            # e^{4x}-1
    if which == 'zeta':
        c1 = pi; EK = (5*x).exp(); EK9 = (9*x).exp()
    else:
        c1 = pi/5; EK = (3*x).exp()
        s5 = arb(5).sqrt(); kap = ((10-2*s5).sqrt()-2)/(s5-1)
        coef = [arb(0), arb(1), kap, -kap, arb(-1)]

def taylor(r):
    """list t_a, a=0..L-1"""
    w = r.exp(); y = w**4
    G = (-c1*y*E1).exp()            # exp(-c1 y (e^{4x}-1))
    G2 = G*G
    e1 = (-c1*y).exp()
    P = G; Q = G                    # P = G^{n^2}, Q = G^{2n-1}
    if which == 'zeta':
        A = arb_series([0]); B = arb_series([0])
        for n in range(1, NMAX+1):
            en = (-c1*y*n*n).exp()
            A = A + P*(en*n**4); B = B + P*(en*n*n)
            Q = Q*G2; P = P*Q
        ser = EK9*A*(2*pi*pi*w**9) - EK*B*(3*pi*w**5)
    else:
        A = arb_series([0])
        for n in range(1, NMAX+1):
            if n % 5:
                en = (-c1*y*n*n).exp()
                A = A + P*(en*n*coef[n % 5])
            Q = Q*G2; P = P*Q
        ser = EK*A*(w**3)
    return [ser[a] for a in range(L)]

def ser_(x):
    m, e = x.mid().man_exp()
    return (int(m), int(e), float(x.rad().str(5, radius=False)))
def unser(t):
    v = arb(t[0])*(arb(2)**t[1])
    return arb(v.mid(), 0) + arb(0, t[2]*1.001) if t[2] > 0 else v

def chunk(js):
    init()
    rows_o = []; rows_e = []; lo = []; le = []; wr = []; ws = []
    XS = [acb(0)]*L; YS = [acb(0)]*L
    for j in js:
        p_, k_ = divmod(j, NPER)
        xk, wk = arb.legendre_p_root(NPER, k_, weight=True)
        lo_ = arb(U)*p_/NPAN; hw = arb(U)/NPAN/2
        r = lo_ + hw*(1+xk); wgt = wk*hw
        tt = taylor(r)
        ep = (2*RHO*r).exp()*wgt; em = (-2*RHO*r).exp()*wgt
        for a_ in range(L):
            XS[a_] = XS[a_] + ep*tt[a_]; YS[a_] = YS[a_] + em*tt[a_]
        rows_o.append([tt[a] for a in range(1, L, 2)]); lo.append([tt[a-1] for a in range(1, L, 2)])
        rows_e.append([tt[a] for a in range(0, L, 2)]); le.append([(tt[a-1] if a > 0 else arb(0)) for a in range(0, L, 2)])
        wr.append(2*r*wgt); ws.append(wgt)
    if not rows_o: return None
    out = {'X': [(ser_(v.real), ser_(v.imag)) for v in XS], 'Y': [(ser_(v.real), ser_(v.imag)) for v in YS]}
    for name, rows, low in (('odd', rows_o, lo), ('even', rows_e, le)):
        m = len(rows)
        V = arb_mat(m, N, [v for row in rows for v in row])
        VR = arb_mat(m, N, [v*wr[i] for i, row in enumerate(rows) for v in row])
        LW = arb_mat(m, N, [v*ws[i] for i, row in enumerate(low) for v in row])
        X = V.transpose()*VR
        Y = LW.transpose()*V
        S = X + Y + Y.transpose()
        out[name] = [[ser_(S[i, k]) for k in range(N)] for i in range(N)]
    return out

def ldl(M, Uc=None):
    n = len(M); A = [row[:] for row in M]; piv = []
    for k in range(n):
        p = A[k][k]; piv.append(p)
        if not (p > 0 or p < 0): return piv, False
        for i in range(k+1, n):
            f = A[i][k]/p
            Ai = A[i]; Ak = A[k]
            if Uc is not None:
                for c in range(4): Uc[i][c] = Uc[i][c] - f*Uc[k][c]
            for j in range(i, n):
                Ai[j] = Ai[j] - f*Ak[j]
            for j in range(i+1, n):
                A[j][i] = A[i][j]
    return piv, True

if __name__ == '__main__':
    import time
    t0 = time.time()
    init()
    args = list(range(NPAN*NPER))
    nch = W*6
    chunks = [args[i::nch] for i in range(nch)]
    M = {name: [[arb(0)]*N for _ in range(N)] for name in ('odd', 'even')}
    X = [acb(0)]*L; Y = [acb(0)]*L
    with Pool(W) as p:
        for ci, o in enumerate(p.imap_unordered(chunk, chunks, chunksize=1)):
            if o is None: continue
            for name in ('odd', 'even'):
                Mn = M[name]; on = o[name]
                for i in range(N):
                    Mi = Mn[i]; oi = on[i]
                    for k in range(N):
                        Mi[k] = Mi[k] + unser(oi[k])
            for a_ in range(L):
                X[a_] = X[a_] + acb(unser(o['X'][a_][0]), unser(o['X'][a_][1]))
                Y[a_] = Y[a_] + acb(unser(o['Y'][a_][0]), unser(o['Y'][a_][1]))
            del o
            print('chunk', ci+1, '/', nch, 'at %.0f s' % (time.time()-t0), file=sys.stderr, flush=True)
    report = {'which': which, 'N': N, 'prec': PREC, 'npan': NPAN, 'nper': NPER, 'nodes': len(args), 'U': U, 'nmax': NMAX, 'PP': PP}
    for name in ('odd', 'even'):
        idx = list(range(1, L, 2)) if name == 'odd' else list(range(0, L, 2))
        Uc = [[X[a_].real, Y[a_].real, X[a_].imag, Y[a_].imag] for a_ in idx]   # columns xr, yr, xi, yi
        piv, ok = ldl(M[name], Uc)
        G = [[arb(0)]*4 for _ in range(4)]; Gs = []
        for k in range(len(piv) if ok else 0):
            for i in range(4):
                for j in range(4):
                    G[i][j] = G[i][j] + Uc[k][i]*Uc[k][j]/piv[k]
            Gs.append([G[i][j].str(40) for i in range(4) for j in range(4)])
        report[name+'_G'] = Gs
        report[name+'_S00'] = M[name][0][0].str(30)
        report[name+'_ok'] = ok
        report[name+'_pivots'] = [p.str(12) for p in piv]
        report[name+'_relrad_log2'] = [int(float((p.rad()/abs(p.mid())).log()/arb(2).log())) if p.rad() > 0 else None for p in piv]
        report[name+'_signs'] = ''.join('+' if p > 0 else ('-' if p < 0 else '?') for p in piv)
        print(name, 'done at %.0f s' % (time.time()-t0), report[name+'_signs'], file=sys.stderr, flush=True)
        open('partial_%s_%d.json' % (which, N), 'w').write(json.dumps(report))
    print(json.dumps(report, indent=1))
