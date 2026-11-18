import numpy as np, json, mpmath as mp
import lag
from lag import *
XI=lag.XI
res={}
# 1. DH: check theta_5 and main sum against exact Z_DH
def fDH(s):
    return 5**(-s)*(mp.zeta(s,mp.mpf(1)/5)+XI*mp.zeta(s,mp.mpf(2)/5)-XI*mp.zeta(s,mp.mpf(3)/5)-mp.zeta(s,mp.mpf(4)/5))
def th5(t):
    return float(t/2*mp.log(5/mp.pi)+mp.im(mp.loggamma(mp.mpf(3)/4+1j*t/2)))
def ZDH(t):
    t=mp.mpf(t); return mp.exp(1j*(t/2*mp.log(5/mp.pi)+mp.im(mp.loggamma(mp.mpf(3)/4+1j*t/2))))*fDH(0.5+1j*t)
for t in [50.0,85.699,114.163]:
    z=ZDH(t); print('ZDH',t,complex(z),'stirling err',th5(t)-float(theta(np.array([t]),5,True)[0]))
def lagtrue(Zf,t,h=1e-3):
    z0=Zf(t).real;zp=Zf(t+h).real;zm=Zf(t-h).real
    d1=(zp-zm)/(2*h);d2=(zp-2*z0+zm)/h**2
    return float(z0),float(d1),float(d2),float(d1*d1-z0*d2)
print('DH true Lag at off-line heights:')
res['dh_true']={}
for g in [85.6993484854,114.1633427308]:
    ts=np.arange(g-1.5,g+1.5,0.05)
    vals=[lagtrue(ZDH,float(x)) for x in ts]
    L=np.array([v[3] for v in vals]);k=int(L.argmin())
    print(' gamma',g,'min Lag true',L[k],'at',ts[k],'Z there',vals[k][0],'negative on',[float(ts[L<0].min()),float(ts[L<0].max())] if (L<0).any() else None)
    res['dh_true'][g]=dict(minLag=float(L[k]),t=float(ts[k]),Z=vals[k][0])
# DH main-sum orbit, segments
print('DH main-sum orbit:')
res['dh_orbit']={}
for N in [8,9]+[10,12,16,20,30,40,50,70,100,150,200,300]:
    o=orbit(N,'dh',q=5,dt=0.002 if N<20 else 0.01)
    res['dh_orbit'][N]=o
    print(N,'[%.1f,%.1f]'%(o['t0'],o['t1']),'zeros',o['zerosMain'],'crit',o['ncrit'],'bad',o['nbad'],'minLag %.4f fracneg %.5f'%(o['minLagTrue'],o['fracNegTrue']),'badT',[round(x,3) for x in o['badT'][:4]],'badF',[round(x,3) for x in o['badF'][:4]])
# 2. zeta: true Z Lag at the bad critical points of the main sum
print('zeta: true Z at bad points of main sum')
r=json.load(open('lag_results.json'))
res['zeta_bad']=[]
for N in ['5','10','16','50','100','300']:
    o=r[N]['orb_zeta']
    for tb,fb in zip(o['badT'][:3],o['badF'][:3]):
        ts=np.arange(tb-0.3,tb+0.3,0.01)
        Zs=np.array([float(mp.siegelz(x)) for x in ts]);Z1=np.array([float(mp.siegelz(x,derivative=1)) for x in ts]);Z2=np.array([float(mp.siegelz(x,derivative=2)) for x in ts])
        L=Z1*Z1-Zs*Z2;k=int(np.abs(Zs).argmin())
        sc=(4*0.5*sum(np.log(int(N)/n)**2/n for n in range(1,int(N)+1)))
        print(' N',N,'t %.3f'%tb,'2*mainsum at bad crit %.4f'%(2*fb),'| true Z: sign changes',int((Zs[:-1]*Zs[1:]<0).sum()),'min true Lag/scale %.5f'%(L.min()/sc),'R scale (t/2pi)^-1/4=%.3f'%((tb/2/np.pi)**-0.25))
        res['zeta_bad'].append(dict(N=int(N),t=tb,main2=2*fb,trueSignChanges=int((Zs[:-1]*Zs[1:]<0).sum()),minTrueLagNorm=float(L.min()/sc)))
# 3. offset controls: theta -> theta + c ; phi_2 -> phi_2 + delta  (true orbit translated on the torus)
def orbit_shift(N,c=0.0,d2=0.0,dt=0.01):
    n=np.arange(1,N+1);a=n**-0.5;ln=np.log(n)
    v2=np.array([ (int(k)&-int(k)).bit_length()-1 for k in n])
    t=np.arange(2*np.pi*N**2,2*np.pi*(N+1)**2,dt)
    F=np.empty(t.size);F1=np.empty(t.size);F2=np.empty(t.size)
    for i in range(0,t.size,20000):
        tt=t[i:i+20000];th=theta(tt)+c;d1=dtheta(tt)
        E=np.exp(1j*(th[:,None]-tt[:,None]*ln[None,:]-d2*v2[None,:]));w=d1[:,None]-ln[None,:]
        F[i:i+20000]=(E.real*a).sum(1);F1[i:i+20000]=(-E.imag*a*w).sum(1);F2[i:i+20000]=(-E.real*a*w*w).sum(1)-(E.imag*a).sum(1)*0.5/tt
    idx=np.nonzero(F1[:-1]*F1[1:]<0)[0];lam=F1[idx]/(F1[idx]-F1[idx+1])
    Fc=F[idx]+lam*(F[idx+1]-F[idx]);F2c=F2[idx]+lam*(F2[idx+1]-F2[idx])
    L=F1*F1-F*F2
    return int((Fc*F2c>0).sum()),int(idx.size),float((L<0).mean())
print('offset controls (bad, crit, fracneg):')
res['offset']={}
for N in [50,100,200]:
    for c in [0,0.01,0.03,0.1,0.3,1.0,np.pi/2]:
        res['offset'][f'{N}_theta_{c:.3f}']=orbit_shift(N,c=c); print(' N',N,'theta+%.3f'%c,res['offset'][f'{N}_theta_{c:.3f}'])
    for d in [0.01,0.03,0.1,0.3,1.0,np.pi]:
        res['offset'][f'{N}_phi2_{d:.3f}']=orbit_shift(N,d2=d); print(' N',N,'phi2+%.3f'%d,res['offset'][f'{N}_phi2_{d:.3f}'])
json.dump(res,open('lag2_results.json','w'),indent=1,default=float)
