# Coupling-norm lane library. python-flint (arb ball arithmetic). All returned arb values are rigorous enclosures.
from flint import arb, acb, acb_series, arb_mat, ctx, fmpq
import json

def L_xi(x):
    """xi'/xi(1/2+x) for real arb x>0, x != 1/2."""
    s = acb(arb(1)/2 + x)
    z = acb_series([s, 1], prec=2).zeta()
    zl = z[1]/z[0]
    r = 1/s + 1/(s-1) - arb.pi().log()/2 + (s/2).digamma()/2 + zl
    return r.real

def kappa():
    s5 = arb(5).sqrt()
    return ((10-2*s5).sqrt()-2)/(s5-1)

def f_dh_jet(s):
    """(f, f') for Davenport-Heilbronn f(s)=5^-s[z(s,1/5)+k z(s,2/5)-k z(s,3/5)-z(s,4/5)], s acb."""
    k = kappa()
    S = acb_series([s, 1], prec=2)
    tot0 = acb(0); tot1 = acb(0)
    for a, c in ((1, arb(1)), (2, k), (3, -k), (4, arb(-1))):
        h = S.zeta(acb(arb(a)/5))
        tot0 += c*h[0]; tot1 += c*h[1]
    l5 = arb(5).log()
    p = (-(s*l5)).exp()
    return p*tot0, p*(tot1 - l5*tot0)

def L_dh(x):
    """Lambda_DH'/Lambda_DH(1/2+x), Lambda=(5/pi)^(s/2) Gamma((s+1)/2) f(s)."""
    s = acb(arb(1)/2 + x)
    f0, f1 = f_dh_jet(s)
    r = (arb(5)/arb.pi()).log()/2 + ((s+1)/2).digamma()/2 + f1/f0
    return r.real

def vdc(j):
    """van der Corput radical inverse base 2, as fmpq, j>=1."""
    num, den = 0, 1
    while j:
        den *= 2; num = num*2 + (j & 1); j >>= 1
    return fmpq(num, den)

def nodes(family, N):
    out = []
    for j in range(1, N+1):
        if family == 'A':      # vdC in log x on [0.01, 0.5]  (same family as the euler lane)
            a, b = arb(1)/100, arb(1)/2
            t = arb(vdc(j)); out.append((a.log() + t*(b.log()-a.log())).exp())
        elif family == 'B':    # vdC in log x on [0.6, 4]  (rates > 1/2: absolutely convergent prime side)
            a, b = arb(6)/10, arb(4)
            t = arb(vdc(j)); out.append((a.log() + t*(b.log()-a.log())).exp())
        elif family == 'C':    # spread: x_j = 0.6 + 3 (j-1)
            out.append(arb(6)/10 + 3*(j-1))
        else:
            raise ValueError(family)
    return out

def pick_normalized(xs, Ls):
    N = len(xs)
    K = [[(Ls[i]+Ls[j])/(xs[i]+xs[j]) for j in range(N)] for i in range(N)]
    d = [K[i][i].sqrt() for i in range(N)]
    return [[K[i][j]/(d[i]*d[j]) for j in range(N)] for i in range(N)], K

def ldl_pivots(A):
    """LDL^T without pivoting in ball arithmetic. pivot[n] = 1 - rho^2 for split (first n nodes | node n+1)."""
    N = len(A)
    Lm = [[None]*N for _ in range(N)]
    d = [None]*N
    for i in range(N):
        for j in range(i):
            s = A[i][j]
            for k in range(j):
                s -= Lm[i][k]*Lm[j][k]*d[k]
            Lm[i][j] = s/d[j]
        s = A[i][i]
        for k in range(i):
            s -= Lm[i][k]*Lm[i][k]*d[k]
        d[i] = s
    return d

def log10mid(a):
    return float(abs(a).log()/arb(10).log()) if not a.contains(0) else float('nan')
