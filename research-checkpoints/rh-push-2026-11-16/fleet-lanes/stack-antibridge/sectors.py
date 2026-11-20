# First indefinite order of P, K_e = P+B, K_o = P-B on one nested node sequence.
# P_ij=(L_i+L_j)/(x_i+x_j), B_ij=-(L_i-L_j)/(x_i-x_j), B_ii=-L'(x_i); L = xi'/xi(1/2+x) for zeta
# with one on-line pair moved to 1/2 +- d +- i g ("move" twin of euler/RESULT.md sec 2.2).
import mpmath as mp, sys, json
def vdc(k):
    v, den = 0.0, 1.0
    while k: den *= 2; k, r = divmod(k, 2); v += r/den
    return v
def nodes(N, a, b):
    la, lb = mp.log(a), mp.log(b)
    return [mp.exp(la + (lb-la)*mp.mpf(vdc(k+1))) for k in range(N)]
def L_zeta(x):
    s = mp.mpf(1)/2 + x
    z, z1, z2 = mp.zeta(s), mp.zeta(s,1,1), mp.zeta(s,1,2)
    L = 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + z1/z
    dL = -1/s**2 - 1/(s-1)**2 + mp.polygamma(1,s/2)/4 + z2/z - (z1/z)**2
    return L, dL
def pair(x,g):   # on-line pair +-ig : value, derivative
    return 2*x/(x*x+g*g), 2*(g*g-x*x)/(x*x+g*g)**2
def quad(x,g,d): # quartet +-d +-ig
    v=0; dv=0
    for e in (d,-d):
        y=x-e; v+=2*y/(y*y+g*g); dv+=2*(g*g-y*y)/(y*y+g*g)**2
    return v, dv
def first_fail(K):
    N=len(K); A=[row[:] for row in K]; piv=[]
    for k in range(N):
        p=A[k][k]; piv.append(p)
        if p<=0: return k+1, piv
        for i in range(k+1,N):
            m=A[i][k]/p
            for j in range(k+1,i+1):
                A[i][j]-=m*A[j][k]; A[j][i]=A[i][j]
    return None, piv
def mats(xs, Lv, dLv):
    N=len(xs)
    P=[[ (Lv[i]+Lv[j])/(xs[i]+xs[j]) for j in range(N)] for i in range(N)]
    B=[[ (-dLv[i] if i==j else -(Lv[i]-Lv[j])/(xs[i]-xs[j])) for j in range(N)] for i in range(N)]
    Ke=[[P[i][j]+B[i][j] for j in range(N)] for i in range(N)]
    Ko=[[P[i][j]-B[i][j] for j in range(N)] for i in range(N)]
    return P,Ke,Ko
if __name__=="__main__":
    a, b, Nmax = mp.mpf(sys.argv[1]), mp.mpf(sys.argv[2]), int(sys.argv[3])
    idx = [int(t) for t in sys.argv[4].split(',')]; d = mp.mpf(sys.argv[5])
    mp.mp.dps = 80 + 18*Nmax
    xs = nodes(Nmax, a, b)
    base = [L_zeta(x) for x in xs]
    out = {"interval":[sys.argv[1],sys.argv[2]],"Nmax":Nmax,"dps":mp.mp.dps,"delta":sys.argv[5],"rows":[]}
    P,Ke,Ko = mats(xs,[v for v,_ in base],[dv for _,dv in base])
    r = {"case":"zeta"}
    for nm,K in (("P",P),("Ke",Ke),("Ko",Ko)):
        f,piv = first_fail(K); r[nm]=f; r[nm+"_lastpiv"]=mp.nstr(piv[-1],5)
    print(r, flush=True); out["rows"].append(r)
    for n in idx:
        g = mp.im(mp.zetazero(n))
        Lv=[]; dLv=[]
        for x,(v,dv) in zip(xs,base):
            pv,pd = pair(x,g); qv,qd = quad(x,g,d)
            Lv.append(v-pv+qv); dLv.append(dv-pd+qd)
        P,Ke,Ko = mats(xs,Lv,dLv)
        r = {"case":"move","n":n,"gamma":mp.nstr(g,10)}
        for nm,K in (("P",P),("Ke",Ke),("Ko",Ko)):
            r[nm]=first_fail(K)[0]
        print(r, flush=True); out["rows"].append(r)
    json.dump(out, open(sys.argv[6],"w"), indent=1)
