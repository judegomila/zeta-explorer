import numpy as np, math
from fractions import Fraction
from scipy.linalg import eigh
N=2000
idx=np.arange(1,N+1); g=np.gcd.outer(idx,idx)
Gc=np.fromfile('g2000_0.bin',dtype=np.complex128).reshape(N,N).real
G=Gc[(idx[:,None]//g)-1,(idx[None,:]//g)-1]/g
L=math.log(2*math.pi)-0.5772156649015329
def c0(h,k):
    h%=k
    if k==1: return 0.0
    m=np.arange(1,k); return -float(np.sum(m/k/np.tan(np.pi*m*h/k)))
# (1) Farey-edge form: G(h,k) = L/2(1/h+1/k) + (k-h)/(2hk) log(h/k) + pi/(2hk) [c0(hbar/k) - c0(hbar/k - 1/(hk))]
print("(1) Farey-edge form of G(h,k), coprime pairs: max abs error")
err=0
for (h,k) in [(2,3),(3,7),(5,12),(11,7),(89,144),(233,1000),(1999,2000),(1000,1999),(997,1571)]:
    hb=pow(h,-1,k) if k>1 else 0; kb=pow(k,-1,h) if h>1 else 0
    assert (h*hb+k*kb-1)%(h*k)==0
    x=Fraction(hb,k); y=x-Fraction(1,h*k)   # y = -kbar/h mod 1, Farey neighbour of x
    assert y.denominator==h or h==1
    val=L/2*(1/h+1/k)+(k-h)/(2*h*k)*math.log(h/k)+math.pi/(2*h*k)*(c0(hb,k)-c0(y.numerator,y.denominator))
    err=max(err,abs(val-G[h-1,k-1]))
print("   ",err)
# (2) reciprocity unrolled along Euclid: c0(r0/r_-1) = sum_j (-1)^j (r_-1/r_{j-1}) [1/(pi r_j) + g(r_j/r_{j-1})],
#     g(h/k) := c0(h/k) + (k/h) c0(k/h) - 1/(pi h)  (= (i/2) psi_0(h/k), Bettin-Conrey)
def gpsi(h,k): return c0(h,k)+(k/h)*c0(k,h)-1/(math.pi*h)
print("(2) g(2/5) =",gpsi(2,5)," (graph node value 0.080325)")
def unroll(h,k):
    rm,r0=k,h%k; tot=0; sign=1; top=k
    if r0==0: return 0.0
    prev,cur=rm,r0
    while cur>0:
        tot+=sign*(top/prev)*(1/(math.pi*cur)+gpsi(cur,prev)); sign=-sign
        prev,cur=cur,prev%cur
    return tot
e2=max(abs(unroll(h,k)-c0(h,k)) for (h,k) in [(2,5),(89,144),(233,1000),(997,1571),(1234,1999)])
print("    Euclid unrolling of c0 through g: max abs error",e2)
# three-term relation on rationals (algebraic identity from oddness and periodicity)
e3=max(abs(gpsi(h,k)-gpsi(h+k,k)-(k/(h+k))*gpsi(h,h+k)) for (h,k) in [(2,5),(7,3),(89,144),(233,1000)])
print("    three-term relation g(z)-g(z+1)-(z+1)^-1 g(z/(z+1)) on rationals: max abs",e3)
# (3) lower bound chain:  Q(a) >= (1/16) sum_m |f(m)|^2/(m+1)^2,  f = 1*a
def dirconv1(a,M):
    f=np.zeros(M+1)
    for n in range(1,len(a)+1):
        if a[n-1]!=0: f[n::n]+=a[n-1]
    return f
rng=np.random.default_rng(1)
w,v=eigh(G,subset_by_index=[0,0]); vmin=v[:,0]; lam=w[0]
omega=np.zeros(N+1,int)
for p in range(2,N+1):
    if omega[p]==0: omega[p::p]+=1
d=np.arange(1,N+1)
WN=np.max(2.0**omega[1:]*((d+1)**2/d)*N*(1+np.log(N/d)))
print("(3) lower bound: W_N =",WN," 1/(16 W_N) =",1/(16*WN)," lam_min =",lam," ratio lam_min*16*W_N =",lam*16*WN)
for name,a in [("bottom eigenvector",vmin),("random",rng.standard_normal(N)),("mu-like",np.array([(-1)**omega[n] for n in range(1,N+1)],float))]:
    Q=a@G@a; f=dirconv1(a,40*N); m=np.arange(1,40*N+1)
    lb=np.sum(f[1:]**2/(m+1)**2)/16; lbN=np.sum(f[1:N+1]**2/(m[:N]+1)**2)/16
    wsum=np.sum(f[1:N+1]**2*2.0**omega[1:]*(N/d)*(1+np.log(N/d)))
    print(f"    {name}: Q={Q:.6e}  (1/16)sum_m<=40N={lb:.6e}  (m<=N only: {lbN:.6e})  ||a||^2={a@a:.4f} <= weighted f-sum {wsum:.4f}")
# (4) upper bound test vector a = delta_n - ((n-1)/n) delta_{n-1}
print("(4) Rayleigh quotient of delta_n - ((n-1)/n) delta_{n-1}:   n, q, q n^2, q n^2/log n")
for n in [50,200,800,2000]:
    a=np.zeros(n); a[n-1]=1; a[n-2]=-(n-1)/n; q=(a@G[:n,:n]@a)/(a@a)
    print("    ",n,q,q*n*n,q*n*n/math.log(n))
# (5) Dirichlet inverses
k=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
M=200000; c=np.zeros(M+1); per=[0,1,k,-k,-1]
for n in range(1,M+1): c[n]=per[n%5]
inv=np.zeros(M+1); inv[1]=1
acc=np.zeros(M+1)
for n in range(1,M+1):
    if n>1: inv[n]=-acc[n]
    if inv[n]!=0:
        mult=np.arange(2*n,M+1,n); acc[mult]+=inv[n]*c[mult//n]
print("(5) DH Dirichlet inverse: max |c^-1(n)| for n<=10^j:",[float(np.max(np.abs(inv[1:10**j+1]))) for j in range(1,6)])
print("    sum_{n<=x} |c^-1(n)|^2 / x :",[float(np.sum(inv[1:10**j+1]**2)/10**j) for j in range(1,6)])
# DH floor from the first off-line zero
b0,g0=0.808517,85.699348
print("(6) DH floor from zero 0.808517+85.699348i: d^2 >= (2b-1)/|rho|^2 =",(2*b0-1)/(b0*b0+g0*g0))
