import numpy as np, mpmath as mp, json, os, time
HERE=os.path.dirname(os.path.abspath(__file__))
def primes_upto(x):
    s=np.ones(x+1,bool); s[:2]=False
    for i in range(2,int(x**.5)+1):
        if s[i]: s[i*i::i]=False
    return np.nonzero(s)[0]
def first_primes(k): return primes_upto(200)[:k].astype(float)
def subset_logs(lp):
    """log n and mu(n) over all 2^k subsets (doubling order)."""
    ln=np.zeros(1); mu=np.ones(1)
    for l in lp:
        ln=np.concatenate([ln,ln+l]); mu=np.concatenate([mu,-mu])
    return ln,mu
def pair_form(J):
    """Q(A)=2*sum_{pairs in A} J_pq over all subsets (doubling order)."""
    k=J.shape[0]; Q=np.zeros(1)
    for j in range(k):
        v=np.zeros(1)                       # v(A)=sum_{i in A, i<j} 2 J_ij
        for i in range(j): v=np.concatenate([v,v+2*J[i,j]])
        Q=np.concatenate([Q,Q+v])
    return Q
def grid(sigmas=(0.6,0.7,0.8,0.9),tmax=60.0,dt=0.2):
    t=np.arange(0,tmax+1e-9,dt)
    return np.array([complex(s,x) for s in sigmas for x in t])
def dsum(coef,ln,S,chunk_bytes=6e8):
    """sum_n coef_n exp(-s log n) for s in S; chunked. coef may be complex."""
    N=len(ln); c=max(1,int(chunk_bytes/(16*N))); out=np.empty(len(S),complex)
    for a in range(0,len(S),c):
        out[a:a+c]=np.exp(-np.outer(S[a:a+c],ln))@coef
    return out
_zc={}
def logabs_target(S,kind="zeta"):
    """log|Z| on S, where Theta_S -> 1/Z on Re s>1: Z = zeta | L(s,chi4)/(1-2^-s) | zeta(2s)/zeta(s)."""
    key=(kind,len(S),S[0],S[-1])
    if key in _zc: return _zc[key]
    mp.mp.dps=20; out=[]
    for s in S:
        z=mp.mpc(s.real,s.imag)
        if kind=="zeta": v=1/mp.zeta(z)
        elif kind=="chi4": v=(1-mp.mpf(2)**(-z))/mp.dirichlet(z,[0,1,0,-1])   # eps_2=+1, eps_p=chi4(p)
        elif kind=="liouville": v=mp.zeta(z)/mp.zeta(2*z)                     # eps_p=-1
        out.append(-float(mp.log(abs(v))))   # log|Z|, Z = 1/v: Theta*Z -> 1 is the convergence statement
    _zc[key]=np.array(out); return _zc[key]
def scale_rows(M,r,iters=20000,tol=1e-13):
    """J = D M D (zero diagonal) with row sums r.  Returns J, residual."""
    M=M.copy(); np.fill_diagonal(M,0); d=np.sqrt(r/M.sum(1).clip(1e-300))
    for _ in range(iters):
        Md=M@d; new=np.sqrt(d*r/Md); 
        if np.max(abs(new-d)/new)<tol: d=new; break
        d=new
    J=d[:,None]*M*d[None,:]; return J, float(np.max(abs(J.sum(1)-r)/r))
def winding(f,z0,z1,n=4000):
    """number of zeros of f in rectangle with corners z0 (lower-left), z1 (upper-right), by argument change."""
    a,b,c,d=z0.real,z1.real,z0.imag,z1.imag
    u=np.linspace(0,1,n,endpoint=False)
    path=np.concatenate([a+(b-a)*u+1j*c, b+1j*(c+(d-c)*u), b+(a-b)*u+1j*d, a+1j*(d+(c-d)*u)])
    v=f(path); v=np.append(v,v[0]); dphi=np.angle(v[1:]/v[:-1])
    return dphi.sum()/(2*np.pi), float(np.max(abs(dphi)))
