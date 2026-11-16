# Two-term Maass-Selberg-shaped kernel with the DH scattering quotient phi_f(s)=Lam_f(2s-1)/Lam_f(2s). Run: python -I dh_ms.py
import mpmath as mp, random
mp.mp.dps=40; I=mp.mpc(0,1); random.seed(11)
chi=[0,1,I,-I,-1]; chib=[mp.conj(c) for c in chi]
def kap(): return (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def f(s):
    k=kap(); return ((1-I*k)/2)*mp.dirichlet(s,chi)+((1+I*k)/2)*mp.dirichlet(s,chib)
def XD(w): return (5/mp.pi)**(w/2)*mp.gamma((w+1)/2)*f(w)
def xis(w): return mp.pi**(-w/2)*mp.gamma(w/2)*mp.zeta(w)
def K(Xf,nodes,T):
    n=len(nodes); a=[T**(s-mp.mpf(1)/2)*Xf(2*s) for s in nodes]; b=[T**(mp.mpf(1)/2-s)*Xf(2*s-1) for s in nodes]
    G=mp.matrix(n,n)
    for i in range(n):
        for j in range(n):
            s=nodes[i]; sp=mp.conj(nodes[j])
            G[i,j]=(a[i]*mp.conj(a[j])-b[i]*mp.conj(b[j]))/(s+sp-1)+(a[i]*mp.conj(b[j])-b[i]*mp.conj(a[j]))/(s-sp)
    return G
def mineig(G):
    n=G.rows; H=(G+G.H)/2; d=[mp.sqrt(abs(H[i,i])) for i in range(n)]
    C=mp.matrix(n,n)
    for i in range(n):
        for j in range(n): C[i,j]=H[i,j]/(d[i]*d[j])
    return min(mp.eigh(C,eigvals_only=True)), min(mp.re(H[i,i]) for i in range(n))
for T in [1,2,5]:
    for box in [((0.55,1.4),(0.7,6.3)),((0.15,1.4),(0.7,6.3)),((0.55,0.9),(40,46))]:
        nodes=[mp.mpc(random.uniform(*box[0]),random.uniform(*box[1])) for _ in range(6)]
        z=mineig(K(xis,nodes,mp.mpf(T))); d=mineig(K(XD,nodes,mp.mpf(T)))
        print(f"T={T} box={box}: zeta mineig {mp.nstr(z[0],4)} mindiag {mp.nstr(z[1],3)} | DH mineig {mp.nstr(d[0],4)} mindiag {mp.nstr(d[1],3)}")
