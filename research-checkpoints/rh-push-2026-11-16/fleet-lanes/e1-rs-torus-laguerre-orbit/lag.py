# Laguerre set B_N on the prime-phase torus and along the true orbit segment.
import numpy as np, json, sys
from sympy import primerange, factorint
rng=np.random.default_rng(1)
XI=(np.sqrt(10-2*np.sqrt(5))-2)/(np.sqrt(5)-1)
def theta(t,q=1,odd=False):
    # arg[(q/pi)^{it/2} Gamma((1/2+a+it)/2)], Stirling, a=0 even, a=1 odd
    a=1 if odd else 0
    return t/2*np.log(q*t/(2*np.pi))-t/2+(2*a-1)*np.pi/8+ (1/(48*t) if a==0 else -1/(24*t))
def dtheta(t,q=1): return 0.5*np.log(q*t/(2*np.pi))
def coeffs(N,kind,c=0.0):
    n=np.arange(1,N+1)
    a=n**-0.5
    if kind=='dh':
        tab=np.array([0,1,XI,-XI,-1.0]); a=a*tab[n%5]
    if kind=='heat': a=a*np.exp(c*np.log(n)**2)
    if kind=='sign':
        # completely multiplicative sign twist: eps_p=-1 for p=2 (Q13 control)
        v2=np.array([factorint(int(k)).get(2,0) for k in n]); a=a*(-1.0)**v2
    return n,a
def lag_from(S0,S1,S2,ph):
    # f=Re(ph*S0), Vf=-Im(ph*S1), V2f=-Re(ph*S2) ; S_k=sum a_n w_n^k e^{-i phi_n}
    f=(ph*S0).real; f1=-(ph*S1).imag; f2=-(ph*S2).real
    return f,f1,f2,f1*f1-f*f2
def mc(N,kind,M=200000,c=0.0,notheta=False):
    n,a=coeffs(N,kind,c); ps=list(primerange(2,N+1))
    V=np.zeros((N,len(ps)))
    for i,k in enumerate(n):
        for p,e in factorint(int(k)).items(): V[i,ps.index(p)]=e
    w=(-np.log(n)) if notheta else np.log(N/n)
    neg=0;tot=0;mn=0;negcrit=0
    s1=0.5*np.sum(a*a*w*w)
    ch=20000
    for _ in range(M//ch):
        Phi=rng.uniform(0,2*np.pi,(ch,len(ps)))
        E=np.exp(-1j*(Phi@V.T))
        S0=E@a;S1=E@(a*w);S2=E@(a*w*w)
        ph=np.ones(ch) if notheta else np.exp(1j*rng.uniform(0,2*np.pi,ch))
        f,f1,f2,L=lag_from(S0,S1,S2,ph)
        neg+=(L<0).sum();tot+=ch;mn=min(mn,(L/s1).min())
    return dict(meas=neg/tot,se=float(np.sqrt(neg/tot*(1-neg/tot)/tot)),minLagNorm=float(mn))
def orbit(N,kind,c=0.0,dt=0.01,q=1,notheta=False,t0=None,t1=None):
    # true segment; N = floor(sqrt(q t/2pi)); exact time derivatives of the main sum
    n,a=coeffs(N,kind,c); ln=np.log(n)
    if t0 is None: t0=2*np.pi*N**2/q; t1=2*np.pi*(N+1)**2/q
    t=np.arange(t0,t1,dt)
    out=[];s1=0.5*np.sum(a*a*np.log(N/n)**2) if not notheta else 0.5*np.sum(a*a*ln**2)
    F=np.empty(t.size);F1=np.empty(t.size);F2=np.empty(t.size);LV=np.empty(t.size)
    ch=20000
    for i in range(0,t.size,ch):
        tt=t[i:i+ch]
        if notheta: th=0*tt;d1=0*tt;d2=0*tt
        else: th=theta(tt,q,kind=='dh');d1=dtheta(tt,q);d2=0.5/tt
        E=np.exp(1j*(th[:,None]-tt[:,None]*ln[None,:]))
        w=d1[:,None]-ln[None,:]
        F[i:i+ch]=(E.real*a).sum(1)
        F1[i:i+ch]=(-E.imag*a*w).sum(1)
        F2[i:i+ch]=(-E.real*a*w*w).sum(1)-(E.imag*a).sum(1)*d2
        # torus Lag with frozen speed log N
        if notheta: wN=-ln[None,:]+0*w
        else: wN=np.log(N)-ln[None,:]+0*w
        g1=(-E.imag*a*wN).sum(1);g2=(-E.real*a*wN*wN).sum(1)
        LV[i:i+ch]=g1*g1-F[i:i+ch]*g2
    L=F1*F1-F*F2
    # bad critical points: F'=0 with F*F''>0
    idx=np.nonzero(F1[:-1]*F1[1:]<0)[0]
    lam=F1[idx]/(F1[idx]-F1[idx+1])
    Fc=F[idx]+lam*(F[idx+1]-F[idx]); F2c=F2[idx]+lam*(F2[idx+1]-F2[idx])
    bad=np.nonzero(Fc*F2c>0)[0]
    zeros=int((F[:-1]*F[1:]<0).sum())
    k=int(np.argmin(L))
    return dict(N=N,t0=float(t0),t1=float(t1),npts=int(t.size),zerosMain=zeros,ncrit=int(idx.size),nbad=int(bad.size),
        badT=[float(t[idx[b]]) for b in bad[:8]],badF=[float(Fc[b]) for b in bad[:8]],
        minLagTrue=float(L.min()/s1),tAtMin=float(t[k]),fracNegTrue=float((L<0).mean()),
        minLagTorus=float(LV.min()/s1),fracNegTorus=float((LV<0).mean()),
        minAbsFcrit=float(np.abs(Fc).min()) if idx.size else None)
if __name__=='__main__':
    res={}
    Ns=[2,3,4,5,6,8]+list(range(10,31,2))+[40,50,70,100,150,200,300]
    for N in Ns:
        r={}
        r['mc_zeta']=mc(N,'zeta') ; r['mc_dh']=mc(N,'dh') if N>=3 else None
        r['mc_sign2']=mc(N,'sign'); r['mc_sign_notheta']=mc(N,'sign',notheta=True)
        r['mc_heat+']=mc(N,'heat',c=0.05); r['mc_heat-']=mc(N,'heat',c=-0.05)
        r['orb_zeta']=orbit(N,'zeta')
        r['orb_heat+']=orbit(N,'heat',c=0.05)
        r['orb_sign2']=orbit(N,'sign')
        res[N]=r
        o=r['orb_zeta']
        print(N,'B meas zeta %.4f dh %s sign %.4f notheta %.4f heat+ %.4f heat- %.4f | orbit zeta: zeros %d crit %d bad %d minLag %.4f fracneg %.5f torusfrac %.5f | heat+ bad %d sign bad %d'%(
          r['mc_zeta']['meas'],r['mc_dh'] and '%.4f'%r['mc_dh']['meas'],r['mc_sign2']['meas'],r['mc_sign_notheta']['meas'],r['mc_heat+']['meas'],r['mc_heat-']['meas'],
          o['zerosMain'],o['ncrit'],o['nbad'],o['minLagTrue'],o['fracNegTrue'],o['fracNegTorus'],r['orb_heat+']['nbad'],r['orb_sign2']['nbad']),flush=True)
    json.dump(res,open('lag_results.json','w'),indent=1)
