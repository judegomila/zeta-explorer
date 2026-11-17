"""Function-field Mayer operator: finite matrix model.
R = F_q[T]/N (N monic irreducible of degree n). Elements coded as ints base q.
M_chi(u) = sum_{a in F_q[T], deg a>=1} u^{deg a} rho_chi(g_a),  g_a=[[0,1],[1,a]],
rho_chi = right-regular action on {f on R^2 minus 0 : f(lam v)=chi(lam) f(v)}  (dim q^n+1).
"""
import itertools, cmath, math
import numpy as np

class Ring:
    def __init__(self, q, N):
        # N: list of coefficients low->high, monic, len n+1
        self.q=q; self.N=N; self.n=len(N)-1; self.size=q**self.n
        self.dig=[self._digits(x) for x in range(self.size)]
        self.deg=[max([i for i,c in enumerate(d) if c]+[-1]) for d in self.dig]
        self.inv=[None]*self.size
        self.multab=[[self._mul(x,y) for y in range(self.size)] for x in range(self.size)]
        for x in range(1,self.size):
            for y in range(1,self.size):
                if self.multab[x][y]==1: self.inv[x]=y
        assert all(self.inv[x] is not None for x in range(1,self.size)), "N not irreducible"
        # generator and logs
        for g in range(2,self.size):
            lg={}; x=1
            for k in range(self.size-1):
                if x in lg: break
                lg[x]=k; x=self.multab[x][g]
            if len(lg)==self.size-1: self.gen=g; self.log=lg; break
    def _digits(self,x):
        d=[]
        for _ in range(self.n): d.append(x%self.q); x//=self.q
        return d
    def _code(self,d): return sum(c*self.q**i for i,c in enumerate(d))
    def add(self,x,y): return self._code([(a+b)%self.q for a,b in zip(self.dig[x],self.dig[y])])
    def neg(self,x): return self._code([(-a)%self.q for a in self.dig[x]])
    def _mul(self,x,y):
        q=self.q;n=self.n;a=self.dig[x];b=self.dig[y];p=[0]*(2*n-1)
        for i in range(n):
            for j in range(n): p[i+j]=(p[i+j]+a[i]*b[j])%q
        for k in range(2*n-2,n-1,-1):
            c=p[k]
            if c:
                for i in range(n+1): p[k-n+i]=(p[k-n+i]-c*self.N[i])%q
        return self._code(p[:n])
    def mul(self,x,y): return self.multab[x][y]

def rho_g(R, a, chi):
    """matrix of rho_chi(g_a), a residue; chi: dict x->value (x!=0). index: x in R, inf=size."""
    S=R.size; m={}
    for x in range(S):
        y=R.add(x,a)
        if y==0: m[(x,S)]=1
        else: m[(x,R.inv[y])]=chi[y]
    m[(S,0)]=1
    return m

def chi_k(R,k,one=1,zeta=None):
    """character g^j -> zeta^(k j), zeta primitive (q^n-1)-th root (numeric by default)."""
    m=R.size-1
    if zeta is None:
        return {x: cmath.exp(2j*math.pi*((k*l)%m)/m) for x,l in R.log.items()}
    return {x: zeta**((k*l)%m) for x,l in R.log.items()}

def coeff_mats(R, chi, dtype=complex):
    """returns [B_1..B_{n-1}], C  as dense numpy arrays: M(u)=sum u^d B_d + (q-1)u^n/(1-qu) C"""
    S=R.size; n=R.n
    B=[np.zeros((S+1,S+1),dtype=dtype) for _ in range(n)]  # B[0]=C
    for r in range(S):
        m=rho_g(R,r,chi)
        for (i,j),v in m.items():
            B[0][i,j]+=v
            if R.deg[r]>=1: B[R.deg[r]][i,j]+=v
    return B[1:], B[0]

def M_of_u(R, Bs, C, u):
    q=R.q; n=R.n
    M=(q-1)*u**n/(1-q*u)*C
    for d,B in enumerate(Bs, start=1): M=M+u**d*B
    return M

def poly_matrix(R,Bs,C):
    """A(u)=(1-qu)(1-M(u)) = sum_{k=0}^n u^k A_k ; returns list A_k"""
    q=R.q;n=R.n;dim=C.shape[0]
    A=[np.zeros_like(C) for _ in range(n+1)]
    A[0]=A[0]+np.eye(dim); A[1]=A[1]-q*np.eye(dim)
    for d,B in enumerate(Bs, start=1):
        A[d]=A[d]-B
        A[d+1]=A[d+1]+q*B
    A[n]=A[n]-(q-1)*C
    return A

def det_zeros(R,Bs,C):
    """zeros u of det A(u) via monic companion in v=1/u."""
    A=poly_matrix(R,Bs,C); n=R.n; dim=C.shape[0]
    comp=np.zeros((n*dim,n*dim),dtype=complex)
    for k in range(1,n+1): comp[:dim,(k-1)*dim:k*dim]=-A[k]
    for k in range(1,n): comp[k*dim:(k+1)*dim,(k-1)*dim:k*dim]=np.eye(dim)
    v=np.linalg.eigvals(comp)
    return v

def L_poly(R,chi):
    """L(u,chi)=sum_{a monic, deg<n} chi(a) u^deg a ; coefficient list low->high (length n)"""
    q=R.q;n=R.n;co=[0]*n
    for x in range(1,R.size):
        d=R.deg[x]
        if R.dig[x][d]==1: co[d]+=chi[x]
    return co

def irreducibles(q,n):
    out=[]
    for low in itertools.product(range(q),repeat=n):
        N=list(low)+[1]
        try:
            R=Ring(q,N); out.append(N)
        except AssertionError: pass
    return out
