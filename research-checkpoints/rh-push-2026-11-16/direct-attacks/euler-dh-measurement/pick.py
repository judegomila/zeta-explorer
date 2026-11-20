# Real-node Pick test: K_ij=(L(x_i)+L(x_j))/(x_i+x_j), L(x)=Lambda'/Lambda(1/2+x).
# L positive-real on Re z>0  <=>  all K PSD (all finite node sets)  <=>  no zeros with Re s>1/2.
import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dh import f
def L_dh(x):
    s = mp.mpf(1)/2 + x
    return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2 + mp.re(f(s,1)/f(s))
def L_zeta(x):
    s = mp.mpf(1)/2 + x
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s,1,1)/mp.zeta(s)
def nodes(N,a,b):
    return [ (a+b)/2 + (b-a)/2*mp.cos(mp.pi*(2*k+1)/(2*N)) for k in range(N)]
def ldl_min(xs, L):
    Lx = [L(x) for x in xs]
    N = len(xs)
    K = mp.matrix(N,N)
    for i in range(N):
        for j in range(N):
            K[i,j] = (Lx[i]+Lx[j])/(xs[i]+xs[j])
    # normalize to unit diagonal
    d = [mp.sqrt(K[i,i]) for i in range(N)]
    for i in range(N):
        for j in range(N):
            K[i,j] /= d[i]*d[j]
    # LDL^T without pivoting; return index of first nonpositive pivot and min pivot
    A = K.copy(); piv=[]
    for k in range(N):
        p = A[k,k]; piv.append(p)
        if p <= 0: return k+1, piv
        for i in range(k+1,N):
            m = A[i,k]/p
            for j in range(k+1,i+1):
                A[i,j] -= m*A[j,k]
                A[j,i] = A[i,j]
    return None, piv
if __name__=="__main__":
    which, a, b, Nmax, step = sys.argv[1], mp.mpf(sys.argv[2]), mp.mpf(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
    L = L_dh if which=="dh" else L_zeta
    for N in range(step, Nmax+1, step):
        mp.mp.dps = 30 + 3*N
        fail, piv = ldl_min(nodes(N,a,b), L)
        print(which, N, "FAIL at pivot %s"%fail if fail else "PD", "minpiv", mp.nstr(min(piv),5), flush=True)
