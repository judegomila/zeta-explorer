# Combination 1, controls: T_c(b) = sum_{e|b, e>=2} c(e) J(e-1) and E1_c(b)/b = sum_{e|b} c(b/e) g(e)/e
# with c = inverse Dirichlet coefficients of each control. First b with T_c(b) >= 0 and first b with |E1_c(b)| > b/4.
import numpy as np, math, json, sys
N=int(sys.argv[1]) if len(sys.argv)>1 else 300000
lnA=0.2487544770337842625
import re
txt=open('tabs.h').read()
RT=[float(v) for v in re.search(r'RT\[65\]=\{(.*?)\}',txt).group(1).split(',')]
JT=[float(v) for v in re.search(r'JT\[65\]=\{(.*?)\}',txt).group(1).split(',')]
n=np.arange(0,N+1,dtype=np.float64); n[0]=1
J=1/(12*n)-1/(360*n**3)+1/(1260*n**5)-1/(1680*n**7); J[:65]=JT; J[0]=0
r=1/(720*n**2)-1/(5040*n**4)+1/(10080*n**6); r[:65]=RT
g=lnA+np.log(n)/12+r; g[0]=0
Jm1=np.zeros(N+1); Jm1[2:]=J[1:N]          # J(e-1) at index e
print('planned memory: %d arrays of %d doubles'%(12,N+1))
# arithmetic functions
mu=np.ones(N+1); lam=np.ones(N+1); spf=np.zeros(N+1,dtype=np.int64)
for p in range(2,N+1):
    if spf[p]==0:
        spf[p::p]=np.where(spf[p::p]==0,p,spf[p::p])
mu[0]=0; lam[0]=0
for m in range(2,N+1):
    p=spf[m]; q=m//p
    lam[m]=-lam[q]; mu[m]=0 if q%p==0 else -mu[q]
def dirichlet_inverse(c):
    d=np.zeros(N+1,dtype=c.dtype); d[1]=1/c[1]
    acc=np.zeros(N+1,dtype=c.dtype)
    for m in range(1,N+1):
        if m>1: d[m]=-acc[m]/c[1]
        if d[m]!=0:
            k=np.arange(2,N//m+1)
            acc[m*k]+=c[k]*d[m]
    return d
def conv_stats(c,name,note=''):
    c=np.asarray(c)
    T=np.zeros(N+1,dtype=c.dtype); E=np.zeros(N+1,dtype=c.dtype)
    for e in range(1,N+1):
        k=np.arange(1,N//e+1)
        if e>=2 and c[e]!=0: T[e*k]+=c[e]*Jm1[e]
        E[e*k]+=c[k]*g[e]/e        # b = e k, coefficient c(b/e) = c(k)
    Tr=T.real; Er=np.abs(E)
    idx=np.arange(N+1)
    # the sign law is tested on every b >= 2 where the divisor sum is not empty of non-zero terms
    viol=np.nonzero((Tr>=0)&(idx>=2)&(np.abs(T)>0))[0]
    zero=np.nonzero((np.abs(T)==0)&(idx>=2))[0]
    cv=np.nonzero((Er>0.25)&(idx>=2))[0]
    out={'name':name,'N':N,'first_T_violation':int(viol[0]) if len(viol) else None,'count_T_violations':int(len(viol)),
         'count_T_exactly_zero':int(len(zero)),'max_T':float(Tr[2:].max()),'min_T':float(Tr[2:].min()),
         'first_ceiling_violation':int(cv[0]) if len(cv) else None,'count_ceiling_violations':int(len(cv)),'max_4absE1_over_b':float(4*Er[2:].max()),'argmax':int(2+np.argmax(Er[2:])),'note':note}
    print(json.dumps(out)); return out
res=[]
res.append(conv_stats(mu,'zeta: c = mu'))
res.append(conv_stats(lam,'Liouville: c = lambda'))
res.append(conv_stats(np.abs(mu),'sign twist eps_p = -1 (F = zeta(2s)/zeta(s)): c = |mu|'))
rng=np.random.default_rng(7); eps=np.ones(N+1); 
sg=rng.choice([-1.0,1.0],size=N+1)
for m in range(2,N+1):
    p=spf[m]; eps[m]=eps[m//p]*sg[p]
res.append(conv_stats(mu*eps,'random sign twist: c = mu(n) prod eps_p'))
chi4=np.array([0,1,0,-1])[np.arange(N+1)%4].astype(float); chi5=np.array([0,1,-1,-1,1])[np.arange(N+1)%5].astype(float); chi3=np.array([0,1,-1])[np.arange(N+1)%3].astype(float)
res.append(conv_stats(mu*chi4,'L(chi_-4): c = mu chi'))
res.append(conv_stats(mu*chi5,'L(chi_5): c = mu chi'))
xi=0.28407904384041227
dh=np.array([0,1,xi,-xi,-1])[np.arange(N+1)%5]; dh[0]=0
dinv=dirichlet_inverse(dh.astype(float))
print('DH inverse c(2..12):',dinv[2:13])
res.append(conv_stats(dinv,'Davenport-Heilbronn: c = Dirichlet inverse'))
a=0.25; ea=np.zeros(N+1); ea[1]=1
# zeta(s+a) zeta(s-a): inverse coefficients multiplicative, c(p) = -(p^a+p^-a), c(p^2) = 1, c(p^k) = 0 for k >= 3
for m in range(2,N+1):
    p=spf[m]; q=m//p; k=1
    while q%p==0: q//=p; k+=1
    loc=-(p**a+p**-a) if k==1 else (1.0 if k==2 else 0.0)
    ea[m]=ea[q]*loc
res.append(conv_stats(ea,'zeta(s+a) zeta(s-a), a = 1/4: c = inverse'))
al=1.0; tw=(mu*np.exp(-1j*al*np.log(np.maximum(np.arange(N+1),1)))).astype(complex)
res.append(conv_stats(tw,'unimodular twist zeta(s+i): c = mu(n) n^{-i} (real part of T tested)'))
# T-NR small q inside the range
for q,cc in ((2,2.1),(3,2.2),(101,2.2)):
    w=np.zeros(N+1); w[1]=1; k=q; wk1=1.0; wk2=0.0
    while k<=N:
        wk=-cc*math.sqrt(q)*wk1-q*wk2; w[k]=wk; wk2=wk1; wk1=wk; k*=q
    # c = mu * w
    c=np.zeros(N+1)
    for e in range(1,N+1):
        if w[e]!=0:
            kk=np.arange(1,N//e+1); c[e*kk]+=w[e]*mu[kk]
    res.append(conv_stats(c,'T-NR q=%d c=%.1f: c = mu * (1 + c sqrt(q) q^-s + q q^-2s)^-1'%(q,cc)))
json.dump(res,open('controls1.json','w'),indent=1)
