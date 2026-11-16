# Nested node sequence (van der Corput in log-coordinates on [a,b]); one LDL gives the first indefinite order.
import mpmath as mp, sys, os, json; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick import L_dh, L_zeta
def vdc(k):
    v, den = 0.0, 1.0
    while k: den *= 2; k, r = divmod(k, 2); v += r/den
    return v
def nodes(N, a, b):
    la, lb = mp.log(a), mp.log(b)
    return [mp.exp(la + (lb-la)*mp.mpf(vdc(k+1))) for k in range(N)]
def quad(x,g,d): return 2*(x-d)/((x-d)**2+g**2) + 2*(x+d)/((x+d)**2+g**2)
def first_fail(xs, Lx):
    N=len(xs); K=[[ (Lx[i]+Lx[j])/(xs[i]+xs[j]) for j in range(N)] for i in range(N)]
    d=[mp.sqrt(K[i][i]) for i in range(N)]
    A=[[K[i][j]/(d[i]*d[j]) for j in range(N)] for i in range(N)]
    piv=[]
    for k in range(N):
        p=A[k][k]; piv.append(p)
        if p<=0: return k+1, piv
        for i in range(k+1,N):
            m=A[i][k]/p
            for j in range(k+1,i+1):
                A[i][j]-=m*A[j][k]; A[j][i]=A[i][j]
    return None, piv
if __name__=="__main__":
    which, a, b, Nmax = sys.argv[1], mp.mpf(sys.argv[2]), mp.mpf(sys.argv[3]), int(sys.argv[4])
    mp.mp.dps = 40 + 8*Nmax
    xs = nodes(Nmax, a, b)
    base = [ (L_dh if which=="dh" else L_zeta)(x) for x in xs ]
    tag = "%s [%s,%s] Nmax=%d dps=%d"%(which, sys.argv[2], sys.argv[3], Nmax, mp.mp.dps)
    f0, piv = first_fail(xs, base)
    print(tag, "base first-indefinite:", f0, "pivot(N) samples:", [(n, mp.nstr(piv[n-1],3)) for n in (5,10,20,30,40,60,80,100) if n<=len(piv)], flush=True)
    if which=="zeta" and len(sys.argv)>5:
        for c in sys.argv[5].split(','):
            g,dl,mode = c.split(':'); g=mp.mpf(g); dl=mp.mpf(dl)
            Lx=[base[i] + quad(xs[i],g,dl) - (2*xs[i]/(xs[i]**2+g**2) if mode=="move" else 0) for i in range(Nmax)]
            print(tag, "twin %s g=%s d=%s first-indefinite N*="%(mode,mp.nstr(g,10),mp.nstr(dl,3)), first_fail(xs,Lx)[0], flush=True)
