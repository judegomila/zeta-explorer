# Rank-2 (SL3 minimal parabolic) Langlands truncated inner product, generic scalar M.
# K_T(lam,mu) = sum_{w,w'} c(w,lam) conj(c(w',mu)) e^{<w lam + conj(w' mu), T>} / prod_{i=1,2} <w lam + conj(w' mu), alpha_i^vee>
# coordinates: nu = (nu1,nu2) = (<nu,a1^vee>,<nu,a2^vee>);  T = t1 varpi1^vee + t2 varpi2^vee.
import mpmath as mp, sys, json, random
mp.mp.dps = 50

def xi(u):
    return mp.pi**(-u/2)*mp.gamma(u/2)*mp.zeta(u)
_cache={}
def M_zeta(u):
    k=(mp.nstr(u.real,45),mp.nstr(u.imag,45)) if isinstance(u,mp.mpc) else (mp.nstr(u,45),'0')
    if k not in _cache: _cache[k]=xi(u)/xi(u+1)
    return _cache[k]
def blaschke(zeros):
    # zeros: list of a with Re a>0 (set should be closed under conjugation); Theta(u)=prod (u-a)/(u+conj a)
    def Th(u):
        r=mp.mpf(1)
        for a in zeros: r*= (u-a)/(u+mp.conj(a))
        return r
    return Th
def orbit(lam, M):
    z1,z2=lam
    m1,m2,m12=M(z1),M(z2),M(z1+z2)
    return [((z1,z2),1),((-z1,z1+z2),m1),((z1+z2,-z2),m2),((z2,-z1-z2),m12*m1),((-z1-z2,z1),m12*m2),((-z2,-z1),m1*m2*m12)]
def pair(nu,T):
    t1,t2=T
    return (2*nu[0]*t1+nu[0]*t2+nu[1]*t1+2*nu[1]*t2)/3
def K(ol,om,T):
    s=mp.mpc(0)
    for (nu,c) in ol:
        for (nv,d) in om:
            a=nu[0]+mp.conj(nv[0]); b=nu[1]+mp.conj(nv[1])
            s+= c*mp.conj(d)*mp.exp(pair((a,b),T))/(a*b)
    return s
def gram(points,M,T):
    orbs=[orbit(p,M) for p in points]
    n=len(points)
    G=mp.matrix(n,n)
    for i in range(n):
        for j in range(n):
            G[i,j]=K(orbs[i],orbs[j],T)
    return G
def min_eig_normalised(G):
    n=G.rows
    d=[G[i,i].real for i in range(n)]
    if min(d)<=0: return min(d), d
    N=mp.matrix(n,n)
    for i in range(n):
        for j in range(n):
            N[i,j]=(G[i,j]+mp.conj(G[j,i]))/2/mp.sqrt(d[i]*d[j])
    E=mp.eigh(N,eigvals_only=True)
    return min(E), d
