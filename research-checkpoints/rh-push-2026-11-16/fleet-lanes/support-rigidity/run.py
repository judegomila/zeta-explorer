# support-rigidity numerics (double precision, MEASURED). Single process, small.
import numpy as np, math, cmath
from scipy.special import digamma

# ---- A. Lambda_DH(n): log-derivative coefficients of Davenport-Heilbronn ----
# chi mod 5, chi(2)=i ; f = ((1-i k)/2) L(chi) + ((1+i k)/2) L(chibar); a(n)=Re chi + k Im chi
k = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
chi = {0:0,1:1,2:1j,3:-1j,4:-1}
N=60
a=[0]*(N+1)
for n in range(1,N+1):
    c=chi[n%5]; a[n]=c.real+k*c.imag
# -f'/f = sum L(n) n^-s :  a*log = L (*) a  => L(n) = a(n)log n - sum_{d|n,d<n} L(d) a(n/d)
L=[0.0]*(N+1)
for n in range(2,N+1):
    s=a[n]*math.log(n)
    for d in range(2,n):
        if n%d==0: s-=L[d]*a[n//d]
    L[n]=s
def ispp(n):
    for p in range(2,n+1):
        if n%p==0:
            while n%p==0: n//=p
            return n==1
print("kappa",k)
print("Lambda_DH(n), non-prime-powers n<=60 (zeta: all 0):")
print([(n,round(L[n],4)) for n in range(2,N+1) if not ispp(n) and abs(L[n])>1e-12])
print("non-pp n<=60 with Lambda_DH=0:",[n for n in range(2,N+1) if not ispp(n) and abs(L[n])<=1e-12])

# ---- B. two-cluster Weil test in a prime-power-free window ----
# g = b(u) - b(u-l), b = eta^-1/2 b0(u/eta), b0=(2/sqrt3)cos^2(pi v/2) on [-1,1]
def b0hat(s):
    s=np.asarray(s,dtype=float); out=np.empty_like(s)
    small=np.abs(s)<1e-8
    near=np.abs(np.abs(s)-np.pi)<1e-6
    ok=~(small|near)
    out[ok]=np.pi**2*np.sin(s[ok])/(s[ok]*(np.pi**2-s[ok]**2))
    out[small]=1.0; out[near]=0.5
    return 2/np.sqrt(3)*out
def b0hat_c(z):  # complex arg
    return 2/math.sqrt(3)*cmath.pi**2*cmath.sin(z)/(z*(cmath.pi**2-z*z))
def W_two(l,eta):
    # Weil functional of phi=g*g~, g=b(u)-b(u-l); no prime terms when phi vanishes at log prime powers.
    # W = h(i/2)+h(-i/2) - phi(0) log pi + (1/2pi) int h(t) Re psi(1/4+it/2) dt,  h=|bhat|^2 (2-2cos tl)
    # diagonal part in s=eta*t (smooth); cross part in u-space with kernel -e^{-|u|/2}/(1-e^{-2|u|})
    bh=(eta**0.5*b0hat_c(1j*eta/2)).real
    pole=4*bh*bh*(1-math.cosh(l/2))
    s=np.linspace(0,600,1200001)[1:]; ds=s[1]-s[0]
    w=b0hat(s)**2
    diag=2*np.sum(2*w*digamma(0.25+0.5j*s/eta).real)*ds/(2*math.pi)
    norm=2*np.sum(w)*ds/(2*math.pi)
    v=np.linspace(-1,1,4001); dv=v[1]-v[0]
    b=2/np.sqrt(3)*np.cos(np.pi*v/2)**2
    beta=np.convolve(b,b)*dv            # autocorrelation of b0 on [-2,2] (b0 even)
    vv=np.linspace(-2,2,len(beta)); u=l+eta*vv
    cross=2*np.sum(eta*beta*np.exp(-u/2)/(1-np.exp(-2*u)))*(vv[1]-vv[0])   # -(-beta) at +l and -l
    arch=diag+cross
    return pole - 2*math.log(math.pi) + arch, pole, arch, norm

# maximal prime-power-free gaps up to X
X=20_000_000
sieve=np.ones(X+1,dtype=bool); sieve[:2]=False
for i in range(2,int(X**0.5)+1):
    if sieve[i]: sieve[i*i::i]=False
pp=sieve.copy()
for p in np.nonzero(sieve[:int(X**0.5)+1])[0]:
    q=p*p
    while q<=X: pp[q]=True; q*=p
pts=np.nonzero(pp)[0]
gaps=np.diff(pts)
best=0; rows=[]
for i,gp in enumerate(gaps):
    if gp>best:
        best=gp; rows.append((int(pts[i]),int(pts[i+1])))
print("\nmaximal pp-free gaps (q,q'), ratio g/(sqrt q log q), two-cluster W/2 at widest admissible eta, and pieces")
for (q,q2) in rows:
    if q<7: continue
    l=0.5*(math.log(q)+math.log(q2)); eta=0.25*math.log(q2/q)
    if 2*eta>=math.log(2): continue
    W,pole,arch,norm=W_two(l,eta)
    print(q,q2,q2-q,"ratio %.4f"%((q2-q)/(math.sqrt(q)*math.log(q))),"W/2=%.4f pole/2=%.5f arch/2=%.4f norm=%.5f"%(W/2,pole/2,arch/2,norm))

# hypothetical: how wide must a window at x be for W<0 (this bump)?
print("\nthreshold: smallest g/(sqrt x log x) with W<0 for a hypothetical pp-free window [x,x+g]")
for x in [1e4,1e6,1e8,1e10]:
    lo,hi=0.1,20.0
    for _ in range(30):
        mid=(lo*hi)**0.5
        g=mid*math.sqrt(x)*math.log(x)
        l=math.log(x+g/2); eta=0.25*math.log(1+g/x)
        if 2*eta>=math.log(2): hi=mid; continue
        W=W_two(l,eta)[0]
        if W<0: hi=mid
        else: lo=mid
    print("x=%g  c*=%.3f"%(x,hi))
