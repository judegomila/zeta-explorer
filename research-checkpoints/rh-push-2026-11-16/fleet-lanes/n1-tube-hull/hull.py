# n1-tube-hull: exact (Fraction) enumeration of functional-equation groups and exact LP over hulls.
# stdlib only. All maps are linear in centred coordinates (centre = (1/2,1/2,1/2) in the normalised variables).
from fractions import Fraction as Fr
from itertools import combinations
import sys
def M(rows): return tuple(tuple(Fr(x) for x in r) for r in rows)
def mul(A,B): return tuple(tuple(sum(A[i][k]*B[k][j] for k in range(len(B))) for j in range(len(B[0]))) for i in range(len(A)))
def app(A,v): return tuple(sum(A[i][k]*v[k] for k in range(len(v))) for i in range(len(A)))
def ident(n): return M([[1 if i==j else 0 for j in range(n)] for i in range(n)])
def group(gens,cap=5000):
    n=len(next(iter(gens.values()))); G={ident(n):()}; frontier=[ident(n)]
    while frontier:
        new=[]
        for g in frontier:
            for name,h in gens.items():
                x=mul(h,g)          # apply g first, then h
                if x not in G:
                    G[x]=(name,)+G[g]; new.append(x)
                    if len(G)>cap: return G,False
        frontier=new
    return G,True
def fun_after(f,g):  # functional f composed with map g: (f o g)(p) = f(g p)
    n=len(f); return tuple(sum(f[i]*g[i][j] for i in range(n)) for j in range(n))
def dot(f,v): return sum(a*b for a,b in zip(f,v))
def solve(A,b):
    n=len(A); A=[list(r)+[b[i]] for i,r in enumerate(A)]
    for c in range(n):
        p=next((r for r in range(c,n) if A[r][c]!=0),None)
        if p is None: return None
        A[c],A[p]=A[p],A[c]; pv=A[c][c]; A[c]=[x/pv for x in A[c]]
        for r in range(n):
            if r!=c and A[r][c]!=0:
                f=A[r][c]; A[r]=[x-f*y for x,y in zip(A[r],A[c])]
    return [A[i][n] for i in range(n)]
def lp_min(obj,apexes,rays,eqs=()):
    """min obj.p over conv(apexes)+cone(rays) subject to e.p = c for (e,c) in eqs. Exact.
    Basis enumeration + exact dual certificate. Returns (status,value,dual)."""
    cols=[(a,1) for a in apexes]+[(r,0) for r in rays]
    m=1+len(eqs); rhs=[Fr(1)]+[Fr(c) for _,c in eqs]
    def col(c): v,k=c; return [Fr(k)]+[dot(e,v) for e,_ in eqs]
    C=[col(c) for c in cols]; cost=[dot(obj,v) for v,_ in cols]
    print(f"   planned: {len(cols)} columns, {m} rows, bases <= C({len(cols)},{m})")
    best=None
    for B in combinations(range(len(cols)),m):
        A=[[C[j][i] for j in B] for i in range(m)]
        x=solve(A,rhs)
        if x is None or any(t<0 for t in x): continue
        # dual y: y.A_B = cost_B
        At=[[C[j][i] for i in range(m)] for j in B]
        y=solve(At,[cost[j] for j in B])
        if y is None: continue
        if all(cost[j]-sum(y[i]*C[j][i] for i in range(m))>=0 for j in range(len(cols))):
            val=sum(cost[j]*t for j,t in zip(B,x))
            return ("optimal",val,y)
        best="feasible"
    return ("unbounded-or-no-dual-feasible-basis" if best else "infeasible",None,None)
def pieces(maps,apex,rays):
    A=[];R=[]
    for g in maps:
        A.append(app(g,apex)); R+= [app(g,r) for r in rays]
    return A,R
E=[(Fr(1),0,0),(0,Fr(1),0),(0,0,Fr(1))]; E=[tuple(Fr(x) for x in e) for e in E]
h=Fr(1,2)

print("=== PART 1. Quadratic row A(s,w,z)=sum_d L(w,chi_d) L(z,chi_d)^(-1) d^(-s); centred (s',w',z') ===")
al=M([[1,1,0],[0,-1,0],[0,0,1]])     # w -> 1-w, s -> s+w-1/2
be=M([[-1,0,0],[1,1,0],[1,0,1]])     # s -> 1-s, w -> w+s-1/2, z -> z+s-1/2
ga=M([[1,0,-1],[0,1,0],[0,0,-1]])    # z -> 1-z, s -> s-z+1/2 (functional equation of 1/L; crosses the zero slab)
G2,ok=group({'a':al,'b':be}); print("order <alpha,beta> =",len(G2),"closed" if ok else "NOT closed")
G3,ok3=group({'a':al,'b':be,'c':ga},cap=3000); print("order <alpha,beta,gamma> =",len(G3) if ok3 else f"> {len(G3)-1} (enumeration cap; infinite or large)")
Ga,_=group({'a':al,'c':ga}); Gb,_=group({'b':be,'c':ga},cap=3000)
print("order <alpha,gamma> =",len(Ga)," order <beta,gamma> =",len(Gb) if _ else "cap reached")
bg=mul(be,ga); P=ident(3); o=None
for k in range(1,60):
    P=mul(bg,P)
    if P==ident(3): o=k;break
print("order of beta*gamma =",o)
F=[(0,0,1),(1,0,1),(1,1,1)]; F=[tuple(Fr(x) for x in f) for f in F]   # z', z'+s', z'+s'+w'  (centred F1,F2,F3)
print("centred functionals F1=z', F2=z'+s', F3=z'+s'+w'  (F1=z-1/2, F2=z+s-1, F3=z+s+w-3/2)")
for g,word in sorted(G2.items(),key=lambda kv:(len(kv[1]),kv[1])):
    ap=app(g,(h,h,h)); imgs=[fun_after(f,g) for f in F]
    perm=[F.index(i) if i in F else None for i in imgs]
    print("  g=%-8s matrix=%s apex(centred)=%s  F3 o g = F%s ; (F1,F2,F3) o g -> %s"%(''.join(word) or 'e',[[str(x) for x in r] for r in g],[str(x) for x in ap],perm[2]+1,[p+1 for p in perm]))
assert all(all(fun_after(f,g) in F for f in F) for g in G2)
print("  CHECK: {F1,F2,F3} is permuted by every element of <alpha,beta>: True")
for th in [Fr(1),Fr(7,8),Fr(1,2)]:
    apex=(h,h,th-h)   # absolute region s>1,w>1,z>theta
    A,R=pieces(list(G2),apex,E)
    # slice s=1 (s'=1/2), minimise w+z = w'+z'+1
    st,val,y=lp_min((0,Fr(1),Fr(1)),A,R,eqs=[((Fr(1),0,0),h)])
    print(f"  input z>{th}: min Re(w+z) on hull at s=1: status={st} value={None if val is None else val+1}  dual={[str(t) for t in y] if y else None}")
print("  with gamma (12 = 6 x 2 images incl. the reflected chamber z<1-theta, formal, not connected):")
G12=[mul(g,k) for g in G2 for k in (ident(3),ga)]
A,R=pieces(G12,(h,h,h),E)
st,val,y=lp_min((0,Fr(1),Fr(1)),A,R,eqs=[((Fr(1),0,0),h)])
print("   12 images: status=",st,val)
neg=[ (''.join(G2[g]) or 'e') for g in G2 if dot(fun_after(F[2],mul(g,ga)),(1,1,1))<0 or any(dot(fun_after(F[2],mul(g,ga)),e)<0 for e in E)]
print("   images g*gamma on which F3 is unbounded below:",len(neg),"of 6")

print()
print("=== PART 1b. Two-variable Z(s,w)=sum_d L(s,chi_d) d^(-w); centred (s',w') ===")
a2=M([[-1,0],[1,1]]); sw=M([[0,1],[1,0]])
D,ok=group({'a':a2,'x':sw}); print("order <alpha,swap> =",len(D))
orb=set()
for g in D: orb.add(fun_after((Fr(0),Fr(1)),g))
print("orbit of the functional w' :",sorted([tuple(str(x) for x in f) for f in orb]))
# hull of the 12 images of the quadrant: is it everything? (rays positively span R^2)
rays=[app(g,e) for g in D for e in [(Fr(1),Fr(0)),(Fr(0),Fr(1))]]
print("sum of all ray images =",[str(sum(r[i] for r in rays)) for i in range(2)]," -> rays positively span R^2: hull = R^2")

print()
print("=== PART 2. Sextic probe series Phi; low coordinates centred (T,S,V): T=t, S=sigma_s-1/2=w+z-1, V=v-1/2=1/2-z ===")
K6=M([[1,0,0],[0,-1,0],[0,1,1]])     # sextic Kubota FE in the modulus s: S->-S, V->V+S
TH=M([[-1,0,0],[0,1,0],[2,0,1]])     # completed cubic reflection (MS Prop 5.1): T->-T, V->V+2T  (dual length q_mu X / q_c^2)
PM=M([[1,0,1],[0,1,1],[0,0,-1]])     # Poisson in m: V->-V, T->T+V, S->S+V
W,ok=group({'K':K6,'T':TH,'P':PM}); print("order <K6,Theta3,Pm> =",len(W),"closed" if ok else "NOT closed")
def order(g):
    P=ident(3)
    for k in range(1,100):
        P=mul(g,P)
        if P==ident(3): return k
print("orders: K6*Pm:",order(mul(K6,PM))," Theta3*Pm:",order(mul(TH,PM))," K6*Theta3:",order(mul(K6,TH)), " -> Coxeter type B3/C3")
X=(Fr(1),Fr(0),Fr(1))   # x-1/2 = T+V
Wf=(Fr(0),Fr(1),Fr(1))  # w-1/2 = S+V
Zf=(Fr(0),Fr(0),Fr(-1)) # z-1/2 = -V
print("X o Theta3 =",[str(t) for t in fun_after(X,TH)],"(= X: the theta reflection fixes x)")
print("X o Pm =",[str(t) for t in fun_after(X,PM)],"; X o K6 =",[str(t) for t in fun_after(X,K6)])
orbX={}
for g,word in W.items():
    orbX.setdefault(fun_after(X,g),[]).append(''.join(word) or 'e')
print("orbit of X under the full group: size",len(orbX))
pos=[];negl=[]
for f,ws in sorted(orbX.items(),key=lambda kv:kv[0]):
    sgn = "nonneg" if all(c>=0 for c in f) else ("nonpos" if all(c<=0 for c in f) else "mixed")
    (pos if sgn=="nonneg" else negl).append(f)
    print("   X o g = %-14s  %-7s  #g=%d  shortest g: %s"%(str([str(c) for c in f]),sgn,len(ws),min(ws,key=len)))
S3,_=group({'K':K6,'P':PM}); print("order <K6,Pm> =",len(S3))
legit=list(S3)+[mul(TH,g) for g in (ident(3),K6)]
legit=list(dict.fromkeys(legit))
print("legitimate pieces (see RESULT.md section 4):",len(legit))
for g in legit:
    print("   g=%-6s X o g = %s"%(''.join(W[g]) or 'e',[str(c) for c in fun_after(X,g)]))
def legit_pieces(theta):
    A=[];R=[]
    for g in legit:
        f=fun_after(X,g)
        # in the charts where X o g = T the T-sum is the Moebius sum; input ZF(theta) allows T > theta-1/2 there
        apex=(theta-h,h,h) if f==(1,0,0) else (h,h,h)
        A.append(app(g,apex)); R+=[app(g,e) for e in E]
    return A,R
for th in [Fr(1),Fr(7,8),Fr(874886647,10**9),Fr(13,15),Fr(5,6),Fr(1,2)]:
    A,R=legit_pieces(th)
    st,val,y=lp_min(X,A,R)
    print(f"  input theta={th} ({float(th):.9f}): min x on hull of legitimate pieces: status={st} x_min={None if val is None else val+h}")
A,R=legit_pieces(Fr(1))
st,val,y=lp_min(X,A,R,eqs=[(Wf,h),(Zf,Fr(1,6)-h)])
print("  slice w=1, z=1/6 (principal residue point), input theta=1: status=",st,"x_min=",None if val is None else val+h)
st,val,y=lp_min(X,A,R,eqs=[(Wf,h)])
print("  slice w=1 only: status=",st,"x_min=",None if val is None else val+h)
# full formal group: unbounded
A=[app(g,(h,h,h)) for g in W]; R=[app(g,e) for g in W for e in E]
badrays=[r for r in R if dot(X,r)<0]
print("  full group (48 images, formal): rays with X<0:",len(badrays),"-> min x = -infinity; sum of rays =",[str(sum(r[i] for r in R)) for i in range(3)],"(hull = R^3)")
# which generators' words leave the legitimate set
illeg=[(''.join(w) or 'e') for g,w in W.items() if not all(c>=0 for c in fun_after(X,g))]
print("  elements g with X o g not nonnegative:",len(illeg),"shortest:",sorted(illeg,key=len)[:6])
# general dual exponent a (T -> -T, V -> V + a T)
print()
print("=== PART 3. dual exponent a (reflection T->-T, V->V+aT); a=2 sextic, a=1 Kubota at fixed index, a=3 quartic, a=4 cubic ===")
for a in [1,2,3,4]:
    THa=M([[-1,0,0],[0,1,0],[a,0,1]])
    Wa,ok=group({'K':K6,'T':THa,'P':PM},cap=2000)
    print(f"  a={a}: order = {len(Wa) if ok else '> 2000 (infinite or large)'} ; X o Theta_a = {[str(t) for t in fun_after(X,THa)]}")
