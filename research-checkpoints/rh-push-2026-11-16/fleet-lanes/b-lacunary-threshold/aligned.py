# Pick matrices on prime-aligned vertical cones: nodes w_k = a + i*(2pi/log p)*k, |k|<=K. xi vs Davenport-Heilbronn. MEASURED.
import sys, mpmath as mp
mp.mp.dps = 40
def Lxi(w):
    s = mp.mpf(1)/2 + w
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
chi = [0, 1, 1j, -1j, -1]; chib = [0, 1, -1j, 1j, -1]
tanth = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1); th = mp.atan(tanth)
def Ldh(w):
    s = mp.mpf(1)/2 + w
    e1, e2 = mp.exp(-1j*th), mp.exp(1j*th)
    f = e1*mp.dirichlet(s, chi) + e2*mp.dirichlet(s, chib)
    fp = e1*mp.dirichlet(s, chi, 1) + e2*mp.dirichlet(s, chib, 1)
    return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2 + fp/f
def mineig(Lf, nodes):
    n = len(nodes); Ls = [Lf(w) for w in nodes]
    P = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            P[i, j] = (Ls[i] + mp.conj(Ls[j]))/(nodes[i] + mp.conj(nodes[j]))
    d = [mp.sqrt(mp.re(P[i, i])) if mp.re(P[i,i])>0 else None for i in range(n)]
    if any(x is None for x in d): return 'neg-diagonal'
    for i in range(n):
        for j in range(n): P[i, j] /= d[i]*d[j]
    E = mp.eighe(P, eigvals_only=True)
    return mp.nstr(min(E), 6)
if __name__ == '__main__':
    p = int(sys.argv[1]); a = mp.mpf(sys.argv[2]); Ks = [int(x) for x in sys.argv[3].split(',')]
    tau = 2*mp.pi/mp.log(p)
    for K in Ks:
        nodes = [a + 1j*tau*k for k in range(-K, K+1)]
        print(p, sys.argv[2], K, 'height', mp.nstr(tau*K, 5), 'xi', mineig(Lxi, nodes), 'DH', mineig(Ldh, nodes), flush=True)
