# Checks for RESULT.md (g-torus-modular). mpmath only. Run: python -I modular_checks.py
import mpmath as mp, random
mp.mp.dps = 40
I = mp.mpc(0,1)
random.seed(7)
# ---------- zeta side
def xis(w):  # completed zeta with poles at 0,1
    return mp.pi**(-w/2)*mp.gamma(w/2)*mp.zeta(w)
def X(w):    # entire xi
    return w*(w-1)/2*xis(w)
def phi(s): return xis(2*s-1)/xis(2*s)
# ---------- DH side
chi=[0,1,I,-I,-1]; chib=[mp.conj(c) for c in chi]
def kap(): return (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def f(s): 
    k=kap(); return ((1-I*k)/2)*mp.dirichlet(s,chi)+((1+I*k)/2)*mp.dirichlet(s,chib)
def XD(w): return (5/mp.pi)**(w/2)*mp.gamma((w+1)/2)*f(w)
def mineig(G):
    n=G.rows
    H=(G+G.H)/2
    d=[mp.sqrt(abs(H[i,i])) for i in range(n)]
    C=mp.matrix(n,n)
    for i in range(n):
        for j in range(n): C[i,j]=H[i,j]/(d[i]*d[j])
    ev=mp.eigh(C,eigvals_only=True)
    return min(ev), max(ev), min(mp.re(H[i,i]) for i in range(n))
print("== 0. FE checks")
w0=mp.mpc(0.3,2.2)
print(" xi:", mp.nstr(X(w0)/X(1-w0),12), " DH:", mp.nstr(XD(w0)/XD(1-w0),12))
print("== 1. geodesic average: int_0^inf (m^2/y+n^2 y)^(-s) y^w dy/y = m^(w-s) n^(-w-s) B((s+w)/2,(s-w)/2)/2")
s=mp.mpf('1.7'); w=mp.mpc(0.3,0.9); m,n=3,5
lhs=mp.quad(lambda y:(m*m/y+n*n*y)**(-s)*y**(w-1),[0,0.2,1,5,mp.inf])
rhs=mp.mpf(m)**(w-s)*mp.mpf(n)**(-w-s)*mp.beta((s+w)/2,(s-w)/2)/2
print(" rel err", mp.nstr(abs(lhs-rhs)/abs(rhs),5))
print("== 2. Maass-Selberg Gram (zeta), complex nodes incl. Re s<1/2")
def MS(s1,s2,T):
    return (T**(s1+s2-1)-phi(s1)*phi(s2)*T**(1-s1-s2))/(s1+s2-1) + (phi(s2)*T**(s1-s2)-phi(s1)*T**(s2-s1))/(s1-s2)
for T in [mp.mpf(1),mp.mpf(2),mp.mpf(5)]:
    for trial in range(3):
        nodes=[mp.mpc(random.uniform(0.15,1.4),random.uniform(0.7,6.3)) for _ in range(7)]
        G=mp.matrix(7,7)
        for i in range(7):
            for j in range(7): G[i,j]=MS(nodes[i],mp.conj(nodes[j]),T)
        lo,hi,dmin=mineig(G)
        print(f" T={T} trial {trial}: min eig(corr)={mp.nstr(lo,6)}  min diag={mp.nstr(dmin,6)}")
print("== 3. shift family K_h(w,w') = [X(w+h)X(w'+h)^* - X(w-h)X(w'-h)^*]/(w+w'^*-1)")
def Kh(Xf,nodes,h):
    n=len(nodes); G=mp.matrix(n,n)
    a=[Xf(w+h) for w in nodes]; b=[Xf(w-h) for w in nodes]
    for i in range(n):
        for j in range(n):
            G[i,j]=(a[i]*mp.conj(a[j])-b[i]*mp.conj(b[j]))/(nodes[i]+mp.conj(nodes[j])-1)
    return G
zn=[mp.mpc(0.5+0.07*(k+1), 13.6+0.35*k) for k in range(6)]      # near first zeta zero 14.1347
dn=[mp.mpc(0.5+0.07*(k+1), 85.2+0.25*k) for k in range(6)]      # near DH off-line zero 0.808517+85.699348i
for h in ['0.5','0.4','0.3085','0.25','0.1','0.02']:
    h=mp.mpf(h)
    lz,_,dz=mineig(Kh(X,zn,h)); ld,_,dd=mineig(Kh(XD,dn,h))
    print(f" h={mp.nstr(h,4)}: zeta min eig {mp.nstr(lz,5)} (min diag {mp.nstr(dz,3)}) | DH min eig {mp.nstr(ld,5)} (min diag {mp.nstr(dd,3)})")
print(" single-node sign for DH at w = rho-h+0.02, rho = 0.808517+85.699348i (diag K_h<0 iff h<beta-1/2=0.3085):")
rho=mp.findroot(f, mp.mpc(0.808517,85.699348))
for h in ['0.45','0.35','0.30','0.2','0.05']:
    h=mp.mpf(h); w=rho-h+mp.mpf('0.02')
    val=(abs(XD(w+h))**2-abs(XD(w-h))**2)/(2*mp.re(w)-1)
    print(f"   h={h}: Re w={mp.nstr(mp.re(w),5)}  K_h(w,w)/|X(w-h)|^2 = {mp.nstr(val/abs(XD(w-h))**2,6)}")
print("== 4. h->0 limit equals the Pick/Weil kernel X(w)X(w')^*(L(w)+L(w')^*)/(w+w'^*-1)")
def Pick(Xf,nodes):
    n=len(nodes); G=mp.matrix(n,n)
    x=[Xf(w) for w in nodes]; L=[mp.diff(Xf,w)/Xf(w) for w in nodes]
    for i in range(n):
        for j in range(n):
            G[i,j]=x[i]*mp.conj(x[j])*(L[i]+mp.conj(L[j]))/(nodes[i]+mp.conj(nodes[j])-1)
    return G
P=Pick(X,zn)
for h in ['1e-2','1e-3','1e-4']:
    h=mp.mpf(h); D=Kh(X,zn,h)/(2*h)-P
    print(f" h={h}: max rel entry diff {mp.nstr(max(abs(D[i,j])/abs(P[i,j]) for i in range(6) for j in range(6)),4)}")
print(" Pick min eig: zeta", mp.nstr(mineig(P)[0],6), "| DH", mp.nstr(mineig(Pick(XD,dn))[0],6))
print("== 5. zeros of a(s)+a(1-s), a(s)=T^s xis(2s) (constant term of E* at height T): on Re s=1/2")
for T in [mp.mpf(1),mp.mpf(2)]:
    F=lambda s: T**s*xis(2*s)+T**(1-s)*xis(2*s-1)
    out=[]
    for g in [(0.62,4.0),(0.4,7.5),(0.7,10.5),(0.35,13.0),(0.6,16.5)]:
        try:
            r=mp.findroot(F, mp.mpc(*g)); out.append(mp.nstr(r,10))
        except Exception as e: out.append("fail")
    print(f" T={T}:", out)
