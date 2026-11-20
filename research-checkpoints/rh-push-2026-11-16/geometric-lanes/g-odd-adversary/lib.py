# Spectral-side evaluation of the odd-sector kernel, python-flint (Arb balls).
# f(t) = Lambda(1/2+it) for xi (kind='xi'), heat-deformed xi is handled in heat.py,
# and the Davenport-Heilbronn completion (kind='dh').
# C(t,s)   = (alpha/pi) (f(t)f'(s)-f'(t)f(s))/(t-s)            [PR56 operator-duality (5)]
# C_-(t,s) = C(t,s)-C(t,-s),  t,s>0                              [(7)]
# C_-(t,t) = (alpha/pi) (f'^2 - f f'' + f f'/t)                  [(11)]
from flint import acb, arb, acb_series, ctx, arb_mat
ALPHA = 1

def kap_dh():
    return ((10-2*arb(5).sqrt()).sqrt()-2)/(arb(5).sqrt()-1)

def jet_xi(t, n=3):
    """[f, f', f''] (t-derivatives) of f(t)=xi(1/2+it), real balls."""
    old = ctx.cap; ctx.cap = n
    try:
        s = acb_series([acb(0.5, 0) + acb(0, 1)*acb(t), acb(0, 1)])  # s = 1/2 + i(t+eps)
        half = acb_series([acb(0.5)])
        xi = half*s*(s-1)*(-(s/2)*acb(arb.pi()).log()).exp()*(s/2).gamma()*s.zeta()
        c = [xi[k] for k in range(n)]
    finally:
        ctx.cap = old
    fac = 1; out = []
    for k in range(n):
        if k > 0: fac *= k
        out.append((c[k]*fac).real)
    return out

def jet_dh(t, n=3):
    """[f, f', f''] of f(t)=Lambda_DH(1/2+it) = (5/pi)^{s/2} Gamma((s+1)/2) sum a_n n^-s."""
    old = ctx.cap; ctx.cap = n
    try:
        s = acb_series([acb(0.5, 0) + acb(0, 1)*acb(t), acb(0, 1)])
        k = kap_dh()
        a = [1, k, -k, -1]
        L = None
        for r in range(1, 5):
            term = s.zeta(acb(r)/5)*acb(a[r-1])
            L = term if L is None else L + term
        L = L*(-(s)*acb(arb(5).log())).exp()
        lam = ((s/2)*acb((arb(5)/arb.pi()).log())).exp()*((s+1)/2).gamma()*L
        c = [lam[j] for j in range(n)]
    finally:
        ctx.cap = old
    fac = 1; out = []
    for j in range(n):
        if j > 0: fac *= j
        out.append((c[j]*fac).real)
    return out

JET = {'xi': jet_xi, 'dh': jet_dh}

def Cdiag(j, t):
    f, f1, f2 = j
    return (f1*f1 - f*f2 + f*f1/t)*ALPHA/arb.pi()

def Cminus_matrix(ts, kind='xi'):
    """Arb matrix C_-(t_i,t_j) at distinct positive nodes."""
    J = [JET[kind](t) for t in ts]
    n = len(ts)
    M = arb_mat(n, n)
    for i in range(n):
        fi, gi = J[i][0], J[i][1]
        M[i, i] = Cdiag(J[i], ts[i])
        for k in range(i+1, n):
            fk, gk = J[k][0], J[k][1]
            # C(t,s) with s=t_k ; C(t,-s): f(-s)=f(s), f'(-s)=-f'(s)
            a = (fi*gk - gi*fk)/(ts[i]-ts[k])
            b = (-fi*gk - gi*fk)/(ts[i]+ts[k])
            v = (a - b)*ALPHA/arb.pi()
            M[i, k] = v; M[k, i] = v
    return M, J
