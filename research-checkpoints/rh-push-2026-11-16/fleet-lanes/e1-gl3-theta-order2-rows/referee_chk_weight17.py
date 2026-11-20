import math, numpy as np, random
# (A) weight 17/2 plus form: F = 3 E6(4z) Dtheta - (D E6)(4z) theta ; lift should be Delta*E4 (weight 16); Kohnen e^7
NQ=120000; J=NQ//4
sig5=[0]*(J+1)
for d in range(1,J+1):
    d5=d**5
    for k in range(d,J+1,d): sig5[k]+=d5
E6=[0]*(NQ+1); E6[0]=1; DE=[0]*(NQ+1)
for j in range(1,J+1):
    E6[4*j]=-504*sig5[j]; DE[4*j]=-504*j*sig5[j]
c=[-v for v in DE]   # n=0 theta term: -(DE6)(4z)
n=1
while n*n<=NQ:
    n2=n*n
    for j in range(0,NQ+1-n2,4):
        c[n2+j]+=2*(3*n2*E6[j]-DE[j])
    n+=1
g=c[1]; print("c[1..20]:",[(k,c[k]) for k in range(1,21) if c[k]])
assert all(c[k]==0 for k in range(1,NQ+1) if k%4 in (2,3))
# Delta*E4
MT=400
def mul(a,b):
    r=[0]*(MT+1)
    for i,ai in enumerate(a):
        if ai:
            for j in range(MT+1-i):
                if b[j]: r[i+j]+=ai*b[j]
    return r
e1=[0]*(MT+1); k=0
while True:
    for kk in (k,-k):
        e=kk*(3*kk-1)//2
        if e<=MT: e1[e]+=(1 if kk%2==0 else -1)
    if k==0: e1[0]=1
    k+=1
    if k*(3*k-1)//2>MT: break
e2=mul(e1,e1);e4=mul(e2,e2);e8=mul(e4,e4);e24=mul(mul(e8,e8),e8)
assert e24[:5]==[1,-24,252,-1472,4830]
sig3=[0]*(MT+1)
for d in range(1,MT+1):
    for k in range(d,MT+1,d): sig3[k]+=d**3
E4=[1]+[240*sig3[k] for k in range(1,MT+1)]
f16=[0]+mul(e24,E4)[:MT]   # a(m)
print("Delta*E4:",f16[1:6])
def kron(D,m):
    r=1
    while m%2==0:
        m//=2; r*=0 if D%2==0 else (1 if D%8 in(1,7) else -1)
    if r==0: return 0
    if m==1: return r
    a=D%m; j=1; nn=m
    while a:
        while a%2==0:
            a//=2
            if nn%8 in(3,5): j=-j
        a,nn=nn,a
        if a%4==3 and nn%4==3: j=-j
        a%=nn
    return r*j if nn==1 else 0
def sqf(n):
    q=2
    while q*q<=n:
        if n%(q*q)==0: return False
        q+=1
    return True
def fund(D): return D>1 and ((D%4==1 and sqf(D)) or (D%4==0 and (D//4)%4 in(2,3) and sqf(D//4)))
mu=[1]*(MT+1)
for q in range(2,MT+1):
    if all(q%r for r in range(2,int(q**.5)+1)):
        for k in range(q,MT+1,q): mu[k]=-mu[k]
        for k in range(q*q,MT+1,q*q): mu[k]=0
cnt=bad=zero=0
for D in range(2,3000):
    if not fund(D): continue
    if c[D]==0: zero+=1
    m=2
    while D*m*m<=NQ:
        rhs=c[D]*sum(mu[e]*kron(D,e)*e**7*f16[m//e] for e in range(1,m+1) if m%e==0 and mu[e])
        cnt+=1; bad+=(rhs!=c[D*m*m]); m+=1
print("(A) weight 17/2 Kohnen relation (e^7, Delta*E4): cases",cnt,"mismatches",bad,"c(D)=0 count",zero)
# D=1 too: c(m^2)/c(1) 
print("   D=1: ",all(c[m*m]==c[1]*sum(mu[e]*e**7*f16[m//e] for e in range(1,m+1) if m%e==0 and mu[e]) for m in range(1,300)))
