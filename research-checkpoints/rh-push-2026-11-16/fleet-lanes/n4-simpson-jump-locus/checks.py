# n4-simpson-jump-locus: pure-python checks (no large allocations; all objects are 4x4 integer
# matrices or scalar complex numbers; planned memory < 50 MB).
import cmath, math, itertools, json, random
from fractions import Fraction
out = {}
# ---------- TEST 1: genus-2 mapping class, Casson-Bleiler, Alexander roots, Lefschetz ----------
# basis a1,b1,a2,b2 ; omega(a_i,b_i)=1
def om(x, y): return x[0]*y[1]-x[1]*y[0]+x[2]*y[3]-x[3]*y[2]
chain = [(1,0,0,0),(0,1,0,0),(1,0,-1,0),(0,0,0,1),(0,0,1,0)]   # Humphries-type chain c1..c5
for i in range(5):
    for j in range(5):
        want = 1 if abs(i-j)==1 else 0
        assert abs(om(chain[i],chain[j]))==want
def twist(v, e):   # matrix of x -> x + e*omega(x,v) v  (columns = images of basis)
    M=[[0]*4 for _ in range(4)]
    for k in range(4):
        x=[0]*4; x[k]=1
        c=e*om(x,v)
        y=[x[r]+c*v[r] for r in range(4)]
        for r in range(4): M[r][k]=y[r]
    return M
def mul(A,B): return [[sum(A[i][k]*B[k][j] for k in range(4)) for j in range(4)] for i in range(4)]
I4=[[int(i==j) for j in range(4)] for i in range(4)]
def tr(A): return sum(A[i][i] for i in range(4))
def charpoly(A):  # Faddeev-LeVerrier, exact
    c=[Fraction(1)]; M=[[Fraction(0)]*4 for _ in range(4)]
    for k in range(1,5):
        M=[[ (M2 + (c[-1] if i==j else 0)) for j,M2 in enumerate(row)] for i,row in enumerate(M)]
        AM=[[sum(Fraction(A[i][l])*M[l][j] for l in range(4)) for j in range(4)] for i in range(4)]
        c.append(-Fraction(sum(AM[i][i] for i in range(4)),k)); M=AM
    return [int(x) for x in c]   # t^4 + c1 t^3 + c2 t^2 + c3 t + c4
def det(A):
    cp=charpoly(A); return cp[4]
def reducible(cp):  # monic quartic over Z: linear factor or product of two monic quadratics
    _,a,b,c,d=cp
    for r in (1,-1):
        if r**4+a*r**3+b*r**2+c*r+d==0: return True
    for q in (1,-1):
        q2=d//q
        for p in range(-60,61):
            r=a-p
            if q+q2+p*r==b and p*q2+r*q==c: return True
    return False
def symplectic(A):
    return all(om([A[r][i] for r in range(4)],[A[r][j] for r in range(4)])==om(I4[i],I4[j]) for i in range(4) for j in range(4))
gens=[(i,e) for i in range(5) for e in (1,-1)]
found=None; examples=[]
for L in range(1,7):
    for w in itertools.product(gens,repeat=L):
        if any(w[k][0]==w[k+1][0] and w[k][1]==-w[k+1][1] for k in range(L-1)): continue
        M=I4
        for (i,e) in w: M=mul(M,twist(chain[i],e))
        cp=charpoly(M)
        if cp[1]!=cp[3] or cp[4]!=1: continue
        if reducible(cp): continue
        if cp[1]==0 and cp[3]==0: continue          # polynomial in t^2
        # roots via u=t+1/t : u^2 + a u + (b-2) = 0
        a,b=cp[1],cp[2]
        us=[(-a+s*cmath.sqrt(a*a-4*(b-2)))/2 for s in (1,-1)]
        roots=[]
        for u in us:
            for s in (1,-1): roots.append((u+s*cmath.sqrt(u*u-4))/2)
        mods=sorted(abs(r) for r in roots)
        noff=sum(1 for m in mods if abs(m-1)>1e-9)
        if noff==0: continue      # irreducible + all on circle => cyclotomic (Kronecker); excluded
        examples.append((L,w,cp,mods,noff))
        if found is None or (noff==4 and found[4]<4): found=(L,w,cp,mods,noff,M,roots)
    if found and found[4]==4: break
L,w,cp,mods,noff,M,roots=found
assert symplectic(M)
# explicit first example with exactly 2 roots off the circle, if any (Salem type)
sal=[e for e in examples if e[4]==2]
out['test1']={
 'word (index in chain c1..c5, exponent)':[list(x) for x in w],
 'matrix':M,'charpoly_coeffs t^4..1':cp,'root_moduli':mods,'roots_off_unit_circle':noff,
 'symplectic':symplectic(M),'det(M-I) = Delta(1)':sum(cp),
 'casson_bleiler': 'irreducible over Z: True; not polynomial in t^k (k>1): True (cubic coefficient %d != 0); no root of unity root: True (irreducible with a root off the circle)'%cp[1],
 'first Salem-type example (2 roots off circle)': (None if not sal else {'word':[list(x) for x in sal[0][1]],'charpoly':sal[0][2],'moduli':sal[0][3]}),
}
# Lefschetz: L(phi^n) = 2 - tr(M^n); zeta(t)=exp(sum L_n t^n/n) = det(1-tM)/(1-t)^2 ; check series to order 12
N=12; P=I4; Ln=[]
for n in range(1,N+1):
    P=mul(P,M); Ln.append(2-tr(P))
# series of log(det(1-tM)/(1-t)^2) : coefficients -tr(M^n)/n + 2/n  -> equals L_n/n termwise (identity);
# independent check: exponentiate sum L_n t^n/n and compare with the polynomial quotient
ser=[Fraction(1)]+[Fraction(0)]*N
# exp via recurrence: n e_n = sum_{k=1..n} L_k e_{n-k}
for n in range(1,N+1): ser[n]=sum(Fraction(Ln[k-1])*ser[n-k] for k in range(1,n+1))/n
rev=[cp[4],cp[3],cp[2],cp[1],cp[0]]            # det(1-tM)= t^4 chi(1/t) = palindromic => same coeffs
num=[Fraction(x) for x in [cp[0],cp[1],cp[2],cp[3],cp[4]]]+[Fraction(0)]*(N-4)
q=num[:]                                           # divide by (1-t)^2 : multiply by sum (n+1) t^n
quo=[sum(q[k]*(n-k+1) for k in range(0,n+1)) for n in range(N+1)]
out['test1']['lefschetz_numbers_1..12']=Ln
out['test1']['zeta_series_matches_det(1-tM)/(1-t)^2_to_order_12']=(ser==quo)
out['test1']['functional_equation_palindromic']=(cp[1]==cp[3] and cp[4]==1)
# jump locus of rank-one systems on the mapping torus pulled back from the circle: dim ker(M - t)
def nullity(t):
    A=[[complex(M[i][j])-(t if i==j else 0) for j in range(4)] for i in range(4)]
    # gaussian elimination rank
    rk=0; rows=[r[:] for r in A]
    for c in range(4):
        piv=max(range(rk,4),key=lambda r:abs(rows[r][c]))
        if abs(rows[piv][c])<1e-8: continue
        rows[rk],rows[piv]=rows[piv],rows[rk]
        for r in range(4):
            if r!=rk:
                f=rows[r][c]/rows[rk][c]; rows[r]=[x-f*y for x,y in zip(rows[r],rows[rk])]
        rk+=1
    return 4-rk
out['test1']['jump_points (t, |t|, dim ker(M-t))']=[(str(complex(round(r.real,10),round(r.imag,10))),round(abs(r),10),nullity(r)) for r in roots]
out['test1']['nullity_at_unitary_samples']=[nullity(cmath.exp(1j*th)) for th in (0.3,1.1,2.0,3.0)]

# ---------- TEST 2a: one-prime model on the elliptic curve E = C/(Z log p + 2 pi i Z) ----------
p=3; lp=math.log(p)
# Betti side: character (rho_1,rho_2)=(p^{-s},1); twisted de Rham symbol on mode (m,n): (2 pi i m/lp - s , i n)
def tate_min_symbol(s,MM=40):
    return min(abs(2j*math.pi*m/lp - s)+abs(n) for m in range(-MM,MM+1) for n in range(-2,3))
# Dolbeault side: (L_t, theta=sigma dz/2); complex O -> Omega^1 by theta is an isomorphism iff sigma != 0;
# for sigma = 0: H*(L_t) != 0 iff L_t trivial iff p^{-it}=1.
grid=[(sig,t) for sig in (-1,-0.5,0,0.5,1) for t in (0,2*math.pi/lp,4*math.pi/lp,1.0)]
bet=[(sig,round(t,6),tate_min_symbol(complex(sig,t))<1e-9) for sig,t in grid]
dol=[(sig,round(t,6),(sig==0 and abs(cmath.exp(-1j*t*lp)-1)<1e-9)) for sig,t in grid]
out['test2_tate_curve']={'p':p,'betti_jump':[b for b in bet if b[2]],'dolbeault_jump':[d for d in dol if d[2]],
  'agree':all(b[2]==d[2] for b,d in zip(bet,dol)),
  'scaling_invariant':'jump set has sigma=0 only: invariant under sigma -> lambda sigma'}

# ---------- TEST 2b/3: periodic-orbit lift Gamma(p): twisted complex in the Connes-Consani algebra ----------
# functions in the sector of e_q: Laurent sums of y^k (k complex); X = 2 pi i q y, Y = y d/dy, [Y,X]=X.
c=2j*math.pi*Fraction(5,7)   # q0 = 5/7
def X(f): return {k+1:c*v for k,v in f.items()}
def Xinv(f): return {k-1:v/c for k,v in f.items()}
def Y(f): return {k:k*v for k,v in f.items()}
def add(f,g,a=1,b=1):
    h={}
    for k,v in f.items(): h[k]=h.get(k,0)+a*v
    for k,v in g.items(): h[k]=h.get(k,0)+b*v
    return h
def nrm(f): return max([abs(v) for v in f.values()]+[0])
def rnd():
    return {complex(random.randint(-3,3),random.uniform(-2,2)):complex(random.uniform(-1,1),random.uniform(-1,1)) for _ in range(4)}
random.seed(7)
def d0(f,s): return (X(f), add(Y(f),f,1,s))                       # f -> (Xf) alpha + ((Y+s)f) beta
def d1(g,h,s): return add(add(Y(g),g,-1,1-s), X(h))                # (g alpha + h beta) -> (-(Y+s-1)g + Xh) alpha^beta
errs={'d1d0':0,'homotopy0':0,'homotopy1':0,'homotopy2':0,'comm':0}
for trial in range(50):
    s=complex(random.uniform(-2,2),random.uniform(-5,5)); f=rnd(); g=rnd(); h=rnd()
    a,b=d0(f,s); errs['d1d0']=max(errs['d1d0'],nrm(d1(a,b,s)))
    # homotopy K(g a + h b) = X^{-1} g ; K(k a^b) = X^{-1}k beta ; check dK+Kd = Id in degrees 0,1,2
    errs['homotopy0']=max(errs['homotopy0'],nrm(add(Xinv(d0(f,s)[0]),f,1,-1)))
    k=d1(g,h,s); dk=d0(Xinv(g),s)
    errs['homotopy1']=max(errs['homotopy1'],nrm(add(dk[0],g,1,-1)),nrm(add(add(dk[1],Xinv(k)),h,1,-1)))
    errs['homotopy2']=max(errs['homotopy2'],nrm(add(d1({},Xinv(f),s),f,1,-1)))
    # [Y, X+iY] = X  (flow does not preserve ker dbar)
    D=lambda u: add(X(u),Y(u),1,1j)
    errs['comm']=max(errs['comm'],nrm(add(add(Y(D(f)),D(Y(f)),1,-1),X(f),1,-1)))
out['gamma_p_complex']={'max_abs_errors':errs,
  'meaning':'d_s^2=0; sectors q!=0 are contractible for every s (homotopy X^{-1}); [Y,X+iY]=X'}
# q = 0 sector on R_+/p^Z: d_s f = (Y+s) f beta ; d_s(g alpha) = -(Y+s-1) g alpha^beta ; modes y^{2 pi i n/lp}
def jump_gamma(s,NN=60):
    e0=min(abs(2j*math.pi*n/lp+s) for n in range(-NN,NN+1))       # H^0,H^1 (beta part)
    e1=min(abs(2j*math.pi*n/lp+s-1) for n in range(-NN,NN+1))     # H^1 (alpha part), H^2
    return e0<1e-9, e1<1e-9
pts=[complex(sig,t) for sig in (-0.5,0,0.25,0.5,0.75,1,1.5) for t in (0,2*math.pi/lp,-4*math.pi/lp,1.234)]
out['gamma_p_jump_locus']={'jump_points':[(z.real,round(z.imag,6),jump_gamma(z)) for z in pts if any(jump_gamma(z))],
  'convention':'differential d + s beta: jump iff p^{s}=1 (pair [True,False], weight 0) or p^{s-1}=1 (pair [False,True], weight 2)',
  'not_scaling_invariant_about_1/2':'sigma-1/2 in {-1/2,+1/2}; about 0: sigma in {0,1}'}

# ---------- Higgs test: d(beta^{1,0}) and the Beltrami coefficient of Fr_lambda ----------
# beta^{1,0} = dz/(2 i y) = A dx + B dy with A = 1/(2iy), B = 1/(2y);  d = (dB/dx - dA/dy) dx^dy
def dform(A,B,x,y,h=1e-5):
    return (B(x+h,y)-B(x-h,y))/(2*h)-(A(x,y+h)-A(x,y-h))/(2*h)
A=lambda x,y:1/(2j*y); B=lambda x,y:1/(2*y)
vals=[]
for (x,y) in [(0.3,0.7),(-1.2,2.5),(4.0,0.2)]:
    lhs=dform(A,B,x,y); rhs=(-0.5j)/(y*y)            # -(i/2) dx^dy / y^2
    vals.append(abs(lhs-rhs)/abs(rhs))
out['higgs_test']={'rel_error  d(beta^{1,0}) = -(i/2) omega_hyp':vals,
  'harmonic_metric_equation':'d*(sigma beta + d phi) = sigma - Delta phi, Delta = X^2+Y^2-Y; integral of Delta phi against dn(x) dy/y vanishes => sigma = 0'}
bel=[]
for lam in (2.0,3.0,0.5,math.e):
    # w = x + i lam y ; w_zbar / w_z
    wz=(1+lam)/2; wzb=(1-lam)/2
    bel.append((lam,wzb/wz))
out['frobenius_beltrami']={'(lambda, mu)':bel,'holomorphic_iff':'lambda = 1'}
# adjoint check Y* = 1 - Y w.r.t. dx dy / y^2 on test functions f=y^a e^{-y}, g=y^b e^{-y} (closed forms via Gamma)
a_,b_=2.3,3.1
G=math.gamma
# int (Y f) g dy/y^2 with f=y^a e^{-y}: Yf=(a - y) f
lhs=a_*G(a_+b_-1)/2**(a_+b_-1)-G(a_+b_)/2**(a_+b_)
rhs=G(a_+b_-1)/2**(a_+b_-1)-(b_*G(a_+b_-1)/2**(a_+b_-1)-G(a_+b_)/2**(a_+b_))
out['adjoint_Y* = 1 - Y (rel err)']=abs(lhs-rhs)/abs(lhs)
print(json.dumps(out,indent=1,default=str))
