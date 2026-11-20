# Weil/Suzuki screw form on L^2[0,T], prime side, polynomial Ritz basis, python-flint arb.
# q_T[f] = Lfun(R_f),  R_f(r) = int f(x) f(x+r) dx,  f(x) = T^{-1/2} g(x/T)
# Lfun(phi) = a0 phi(0) + 2 int_0^inf k(r)(phi(0)-phi(r/T)1_{r<T}) dr - 2 sum_{n<=e^T} w_n phi(log n/T) + pole*2 int_0^T e^{r/2} phi(r/T) dr
import sys, math
from flint import arb, arb_mat, acb_mat, ctx, fmpz

def binom(n,k): return fmpz(math.comb(n,k))

def weights(kind, T):
    nmax = int(math.floor(math.exp(T)+1e-12))
    out = []
    if kind == 'zeta':
        for n in range(2, nmax+1):
            # von Mangoldt
            m = n; p = None
            for q in range(2, n+1):
                if m % q == 0:
                    p = q; break
            while m % p == 0: m //= p
            if m == 1: out.append((n, arb(p).log()/arb(n).sqrt()))
    else:
        kap = ((10-2*arb(5).sqrt()).sqrt()-2)/(arb(5).sqrt()-1)
        a = [arb(0), arb(1), kap, -kap, arb(-1)]
        coef = lambda n: a[n % 5]
        Lam = {1: arb(0)}
        for n in range(2, nmax+1):
            s = coef(n)*arb(n).log()
            for d in range(2, n):
                if n % d == 0: s -= Lam[d]*coef(n//d)
            Lam[n] = s
            out.append((n, s/arb(n).sqrt()))
    return out

def mono_functionals(kind, T, C, nq, extra_atoms=()):
    """returns dict name -> list L(rho^c), c=0..C  for: 'Q' (full form) and atoms 'P<n>' (delta at log n/T)."""
    Tb = arb(T)
    beta = arb(5)/2 if kind == 'zeta' else arb(3)/2
    if kind == 'zeta':
        a0 = (arb(5)/4).digamma() - arb.pi().log()
    else:
        a0 = (arb(3)/4).digamma() + (5/arb.pi()).log()
    # GL nodes on [0,1]
    mk = [arb(0)]*(C+1); me = [arb(0)]*(C+1)
    for i in range(nq):
        x, w = arb.legendre_p_root(nq, i, weight=True)
        rho = (x+1)/2; w = w/2
        r = Tb*rho
        g = r*(-beta*r).exp()/(1-(-2*r).exp())      # rho*T*k(T rho)
        e = (r/2).exp()
        pw = w                                       # rho^{c-1} w
        pe = w
        for c in range(0, C+1):
            me[c] += pe*e; pe = pe*rho
            if c >= 1:
                mk[c] += pw*g; pw = pw*rho
    # tail K(T) = sum_m exp(-b_m T)/b_m
    KT = arb(0); m = 0
    while True:
        b = 2*m + beta
        t = (-b*Tb).exp()/b
        KT += t; m += 1
        if float(b*Tb) > ctx.prec*0.7+50: break
    W = weights(kind, T)
    L = []
    for c in range(C+1):
        if c == 0:
            v = a0 + 2*KT
        else:
            v = -2*mk[c]
        if kind == 'zeta':
            v += 2*Tb*me[c]
        L.append(v)
    logs = [(n, w, arb(n).log()/Tb) for (n, w) in W]
    for (n, w, lr) in logs:
        p = arb(1)
        for c in range(C+1):
            L[c] -= 2*w*p; p = p*lr
    res = {'Q': L}
    for n in extra_atoms:
        lr = arb(n).log()/Tb
        res['P%d' % n] = [lr**c for c in range(C+1)]
    return res, W

def assemble(Lmono, N):
    """Legendre-basis matrix of the symmetric form f,g -> L(sym R_fg) on polys of degree < N."""
    C = 3*N+1
    # table Lm[b][a] = L(rho^a (1-rho)^b), a<=C-b
    row = list(Lmono[:C+1]); tab = [row]
    for b in range(1, 2*N+1):
        prev = tab[-1]
        row = [prev[a]-prev[a+1] for a in range(len(prev)-1)]
        tab.append(row)
    M = [[None]*N for _ in range(N)]
    for i in range(N):
        for j in range(N):
            s = arb(0)
            for l in range(j+1):
                s += tab[i+l+1][j-l]*binom(j, l)/(i+l+1)
            M[i][j] = s
    Qm = arb_mat(N, N, [ (M[i][j]+M[j][i])/2 for i in range(N) for j in range(N)])
    Cm = arb_mat(N, N, [ (arb(2*n+1).sqrt()*((-1)**(n+k))*binom(n,k)*binom(n+k,k) if k<=n else arb(0)) for n in range(N) for k in range(N)])
    return Cm*Qm*Cm.transpose()

def eigs_sym(A):
    N = A.nrows()
    E = acb_mat(A).eig(algorithm='approx')
    return sorted([float(e.real) if abs(float(e.real))>1e-290 else e.real for e in E], key=lambda z: float(z))

def run(kind, T, N, prec_digits=None, atoms=(), nq=None):
    if prec_digits is None: prec_digits = int(60 + 2.6*N)
    ctx.dps = prec_digits
    C = 3*N+1
    if nq is None: nq = C//2 + int(prec_digits*1.0) + 40
    fun, W = mono_functionals(kind, T, C, nq, atoms)
    Q = assemble(fun['Q'], N)
    out = {'Q': Q, 'W': W}
    for n in atoms: out['P%d'%n] = assemble(fun['P%d'%n], N)
    return out

if __name__ == '__main__':
    kind = sys.argv[1]; T = float(sys.argv[2]); N = int(sys.argv[3])
    r = run(kind, T, N)
    ev = eigs_sym(r['Q'])
    print(kind, 'T', T, 'N', N, 'lam_min', ev[0], 'next', ev[1], 'max', ev[-1], 'Q00', r['Q'][0,0].str(15))
