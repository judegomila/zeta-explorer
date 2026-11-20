import json, random, itertools, math
from fractions import Fraction as Fr
D="tmp/research-2026-11-16/push/c11-ff-genus2-probe-jk/"
def tr(Lp,nmax):
    e=[(-1)**i*c for i,c in enumerate(Lp)]; t=[len(Lp)-1]
    for n in range(1,nmax+1):
        t.append(sum((-1)**(i-1)*e[i]*t[n-i] for i in range(1,n) if i<len(e)) + ((-1)**(n-1)*n*e[n] if n<len(e) else 0))
    return t
def Lof(e,q):
    if len(e)==2: e1,e2=e; return [1,-e1,2*q+e2,-q*e1,q*q]
    e1,e2,e3=e; L1,L2,L3=-e1,3*q+e2,-(2*q*e1+e3); return [1,L1,L2,L3,q*L2,q*q*L1,q**3]
def det(A):
    A=[[Fr(x) for x in r] for r in A]; m=len(A); d=Fr(1)
    for i in range(m):
        p=next((r for r in range(i,m) if A[r][i]!=0),None)
        if p is None: return Fr(0)
        if p!=i: A[i],A[p]=A[p],A[i]; d=-d
        d*=A[i][i]
        for r in range(i+1,m):
            f=A[r][i]/A[i][i]
            if f: A[r]=[x-f*y for x,y in zip(A[r],A[i])]
    return d
def psd(M):
    n=len(M)
    return all(det([[M[i][j] for j in idx] for i in idx])>=0 for k in range(1,n+1) for idx in itertools.combinations(range(n),k))
def tests(e,q):
    g=len(e); t=tr(Lof(e,q),2*g); G=lambda j,k: q**min(j,k)*t[abs(j-k)]
    def vec(j,s):
        x=[0]*(2*g+1); x[g+j]+=1; x[g-j]+=s*q**j; return x
    Bv=[vec(j,1) for j in range(g+1)]; Av=[vec(j,-1) for j in range(1,g+1)]
    bil=lambda x,y: sum(x[i]*y[j]*G(i,j) for i in range(2*g+1) for j in range(2*g+1))
    SS=[[bil(x,y) for y in Bv] for x in Bv]; AA=[[bil(x,y) for y in Av] for x in Av]
    ddn=G(2,2)+2*q*G(0,2)+q*q*G(0,0); H=Fr(g,2)*ddn/q
    # exact identities: ddn = 2q(e1^2-2e2) ; gap = g*sum s^2 - (sum s)^2
    assert ddn==2*q*(e[0]**2-2*e[1]) and t[1]==e[0]
    return dict(ineq=(0<=t[1]**2<=H), sym=psd(SS), anti=psd(AA), orth=all(bil(x,y)==0 for x in Bv for y in Av),
                mt=(t[1]**2<=4*g*g*q), mt2=(abs(t[2])<=2*g*q))
print("lane fakes re-tested with referee code (ineq / sym PSD / anti PSD / cross zero / Mattuck-Tate t1^2<=4g^2 q / |t2|<=2gq):")
for q in (5,7):
    for d in (5,7):
        J=json.load(open(D+f"fakes_q{q}_d{d}.json"))
        for c in "WRC":
            rs=[tests(tuple(x["e"]),q) for x in J["fakes"][c]["list"]]
            agree=sum(r["ineq"]==x["ineq"] and r["sym"]==x["sym_psd"] and r["anti"]==x["anti_psd"] for r,x in zip(rs,J["fakes"][c]["list"]))
            print(f"  q={q} g={(d-1)//2} {c}: n={len(rs)} ineq {sum(r['ineq'] for r in rs)} sym {sum(r['sym'] for r in rs)} anti {sum(r['anti'] for r in rs)} orth {sum(r['orth'] for r in rs)} | MT t1 {sum(r['mt'] for r in rs)} |t2| {sum(r['mt2'] for r in rs)} | agree with lane record {agree}")
# own fakes, different q, built from chosen roots (class known by construction, exact): s_m integers or roots of integer quadratics
print("referee fakes, q = 11, 13, classes by construction (exact):")
random.seed(4242)
for q in (11,13):
    B=2*math.sqrt(q)
    for g in (2,3):
        out={"W":[], "R":[], "C":[]}
        for _ in range(4000):
            # quadratic factor s^2 - a s + b plus (g=3) an integer root c
            a=random.randint(-16,16); b=random.randint(-70,70); c=random.randint(-12,12)
            disc=a*a-4*b
            e=(a,b) if g==2 else (a+c, b+a*c, b*c)
            if e[0]==0: continue
            if disc<0: cl="C"
            else:
                # real roots (a +- sqrt disc)/2 ; inside [-B,B] iff |a| <= 2B... exact: both |roots|<=B iff 4q - 2|a|sqrt(q)... use exact test: p(B)>=0,p(-B)>=0,|a/2|<=B
                # p(+-B) = 4q -+ a*2sqrt q + b >= 0  <=> 4q+b >= 2|a|sqrt q
                inside = (4*q+b>=0) and ((4*q+b)**2 >= 4*a*a*q) and (a*a<=16*q)
                if (4*q+b)**2==4*a*a*q: continue
                inside = inside and (g==2 or c*c<4*q)
                cl="W" if inside else "R"
            if len(out[cl])<40 and e not in out[cl]: out[cl].append(e)
        for cl in "WRC":
            rs=[tests(e,q) for e in out[cl]]
            print(f"  q={q} g={g} {cl}: n={len(rs)} ineq {sum(r['ineq'] for r in rs)} sym {sum(r['sym'] for r in rs)} anti {sum(r['anti'] for r in rs)} orth {sum(r['orth'] for r in rs)} | MT t1 {sum(r['mt'] for r in rs)} |t2| {sum(r['mt2'] for r in rs)}")
