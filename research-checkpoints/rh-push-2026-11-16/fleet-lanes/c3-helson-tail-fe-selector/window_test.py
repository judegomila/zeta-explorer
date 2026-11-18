# Test B: band-limited window mean J_sigma(T) = int w(t-T) log|F(sigma+it)| dt, supp w^ in [-delta,delta], delta=0.6 < log 2.
# Predicted (section 3, Prop. 6): J = pi * sum over zeros/poles rho with beta>sigma of m_rho * int_{-a}^{a} w(gamma-T+iy) dy, a = beta-sigma.
import numpy as np, json, sys, time
delta=0.6
xg,wg=np.polynomial.legendre.leggauss(240)
xi=(xg+1)*delta/2; wq=wg*delta/2; what=(1-(xi/delta)**2)**8
def w(z):
    z=np.asarray(z,dtype=complex)
    return (np.cos(np.multiply.outer(z,xi))@(wq*what))/np.pi
B2k=[1/6,-1/30,1/42,-1/30,5/66,-691/2730]
from math import factorial
def tail(s,x):
    # sum_{m>=0} (x+m)^(-s) Euler-Maclaurin tail, x large
    r=x**(1-s)/(s-1)+0.5*x**(-s)
    poch=s.copy(); 
    for k in range(1,7):
        r=r+B2k[k-1]/factorial(2*k)*poch*x**(-s-2*k+1)
        poch=poch*(s+2*k-1)*(s+2*k)
    return r
def zeta_lines(sigmas,t):
    # returns array [len(sigmas), len(t)] of zeta(sigma+it); shares phases across sigma
    N=int(np.max(np.abs(t)))+60
    out=np.zeros((len(sigmas),len(t)),complex)
    n=np.arange(1,N,dtype=float); ln=np.log(n)
    CH=max(1,int(2e7//len(n)))
    for a in range(0,len(t),CH):
        ph=np.exp(-1j*np.outer(t[a:a+CH],ln))
        for i,sg in enumerate(sigmas):
            out[i,a:a+CH]=ph@(n**(-sg))
    for i,sg in enumerate(sigmas):
        out[i]+=tail(sg+1j*t,float(N))
    return out
kap=(np.sqrt(10-2*np.sqrt(5))-2)/(np.sqrt(5)-1)
def dh(s):
    s=np.asarray(s,dtype=complex); sh=s.shape; s=s.ravel()
    M=int(np.max(np.abs(s.imag)))+60
    r=np.zeros(len(s),complex)
    for rr,a in ((1,1.0),(2,kap),(3,-kap),(4,-1.0)):
        al=rr/5
        m=np.arange(0,M,dtype=float)+al
        CH=max(1,int(1e7//len(m)))
        part=np.empty(len(s),complex)
        for b in range(0,len(s),CH):
            part[b:b+CH]=np.exp(-np.outer(s[b:b+CH],np.log(m))).sum(axis=1)
        r+=a*(part+tail(s,M+al))
    return (5.0**(-s)*r).reshape(sh)
def J(logabs,t,T):
    h=t[1]-t[0]
    return float(np.sum(w(t-T).real*logabs)*h)
yg,ywg=np.polynomial.legendre.leggauss(40)
def pred(zeros,sigma,T):
    tot=0.0
    for (b,g,m) in zeros:
        a=b-sigma
        if a<=0: continue
        tot+=m*np.pi*float(np.sum(ywg*a*w(g-T+1j*a*yg)).real)
    return tot
res={'delta':delta,'w0':float(w(0.0).real),'rows':[]}
print('w(0)=%.6f w(10)=%.3e w(30)=%.3e w(60)=%.3e w(120)=%.3e'%tuple(float(w(x).real) for x in (0,10,30,60,120)),flush=True)
# self-check of evaluators
import mpmath as mp
for s0 in (0.6+10j,0.75+1000.3j,0.6+1e5j):
    print('zeta check',s0,abs(zeta_lines([s0.real],np.array([s0.imag]))[0,0]-complex(mp.zeta(s0))))
s0=0.7+50j
chi=[0,1,1j,-1j,-1,0]
mpdh=(1-1j*kap)/2*mp.dirichlet(s0,[0,1,1j,-1j,-1])+(1+1j*kap)/2*mp.dirichlet(s0,[0,1,-1j,1j,-1])
print('DH check',abs(dh(np.array([s0]))[0]-complex(mpdh)),flush=True)
L=120.0; h=0.01
sig=[0.6,0.75,1.2]
# zeta and finite modification
for T in (10.0,20.0,1e3,1e4,1e5):
    t0=time.time(); t=T+np.arange(-L,L+h/2,h)
    Z=zeta_lines(sig,t)
    for i,sg in enumerate(sig):
        s=sg+1j*t
        Jz=J(np.log(np.abs(Z[i])),t,T)
        fm=(1-2.0**(-s))/(1+2.0**(-s))
        Jf=J(np.log(np.abs(Z[i]*fm)),t,T)
        # control without the band gap property removed: zeta(s)*(1+0.9*2^-s)^-1 keeps it; zeta(s+a)zeta(s-a) a=0.2: pole at 1+a and 1-a, zeros at 1/2+-a
        p=pred([(1.0,0.0,-1)],sg,T)
        res['rows'].append(dict(F='zeta',sigma=sg,T=T,J=Jz,J_finmod=Jf,pred_pole_only=p))
        print('zeta sigma=%.2f T=%g  J=%+.3e  J_finmod=%+.3e  pred(pole only)=%+.3e  mean|log|=%.3f'%(sg,T,Jz,Jf,p,np.mean(np.abs(np.log(np.abs(Z[i]))))),flush=True)
    print('  (%.0fs)'%(time.time()-t0),flush=True)
# DH: locate zeros with beta>0.55 in 0<=t<=215
tt=np.arange(0.0,215.0,0.02); ss=np.arange(0.55,3.0,0.01)
G=np.empty((len(ss),len(tt)))
for i,sg in enumerate(ss): G[i]=np.abs(dh(sg+1j*tt))
cand=[]
for i in range(1,len(ss)-1):
    row=G[i]
    idx=np.nonzero((row[1:-1]<row[:-2])&(row[1:-1]<row[2:])&(row[1:-1]<G[i-1,1:-1])&(row[1:-1]<G[i+1,1:-1])&(row[1:-1]<0.05))[0]+1
    for j in idx: cand.append(ss[i]+1j*tt[j])
zeros=[]
for z in cand:
    for it in range(60):
        f=dh(np.array([z]))[0]; d=(dh(np.array([z+1e-6]))[0]-dh(np.array([z-1e-6]))[0])/2e-6
        z=z-f/d
    if abs(dh(np.array([z]))[0])<1e-9 and z.real>0.5+1e-6 and not any(abs(z-q)<1e-6 for q in zeros): zeros.append(z)
zeros.sort(key=lambda z:z.imag)
print('DH zeros with beta>0.5 (off-line), 0<t<215, beta<3:',[(round(z.real,6),round(z.imag,6)) for z in zeros],flush=True)
res['dh_zeros']=[[z.real,z.imag] for z in zeros]
zl=[(z.real,z.imag,1) for z in zeros]+[(z.real,-z.imag,1) for z in zeros]
for T in (60.0,85.699,100.0,114.163,140.0):
    t=T+np.arange(-L,L+h/2,h)
    for sg in (0.6,0.75,0.85):
        Jd=J(np.log(np.abs(dh(sg+1j*t))),t,T); p=pred(zl,sg,T)
        res['rows'].append(dict(F='DH',sigma=sg,T=T,J=Jd,pred_from_zero_list=p))
        print('DH sigma=%.2f T=%g  J=%+.6e  pred(zero list)=%+.6e'%(sg,T,Jd,p),flush=True)
json.dump(res,open('window_test.json','w'),indent=1)
