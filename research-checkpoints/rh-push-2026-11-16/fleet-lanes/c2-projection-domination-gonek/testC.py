# Test C: (i) counting check for Test B: complex displacements double the unknowns -> threshold moves from theta=1/2 to 1
#         (ii) DH log-derivative coefficients b(n): support and size
#         (iii) table: off-line amplitude g against on-line mass M_on and the proved prime bound B
import numpy as np, json
from lib import *
g=np.load('zeros40000.npy'); out={}
T,H,delta,band=10000.0,6.0,0.05,14.0
LT=np.log(T/(2*np.pi)); gg=g[np.abs(g-T)<band*H]-T; j0=np.argmin(np.abs(gg)); t0=gg[j0]; gg=np.delete(gg,j0)
rows=[]
for th in (0.3,0.5,0.7,0.85,0.95,1.05,1.15,1.3):
    du=np.pi/(1.6*band*H); u=np.arange(0,th*LT,du)[:,None]
    zc=t0-1j*delta; zb=t0+1j*delta
    d=(w(zc/H)*np.exp(1j*u*zc)+w(zb/H)*np.exp(1j*u*zb)-2*w(t0/H)*np.exp(1j*u*t0))[:,0]
    A=(1j*u*w(gg/H)[None,:]+dw(gg/H)[None,:]/H)*np.exp(1j*u*gg[None,:]); A=A/np.linalg.norm(A,axis=0)
    e=np.linalg.lstsq(A,d,rcond=1e-10)[0]; r=np.linalg.norm(A@e-d)/np.linalg.norm(d)
    rows.append((th,float(r))); print('complex displacements theta=%.2f r=%.3e'%(th,r))
out['complex_displacement']=rows
# (ii) DH
N=20000; xi=(np.sqrt(10-2*np.sqrt(5))-2)/(np.sqrt(5)-1)
a=np.zeros(N+1); per=[0,1,xi,-xi,-1]
for n in range(1,N+1): a[n]=per[n%5]
b=np.zeros(N+1)   # -L'/L = sum b(n) n^-s :  a*b = a.log
al=a*np.log(np.maximum(np.arange(N+1),1))
for n in range(1,N+1):
    s=al[n]
    # subtract sum_{d|n, d<n} b(d) a(n/d)  -> do by forward pushing instead
    b[n]+=s
    k=np.arange(2,N//n+1)
    b[n*k]-=b[n]*a[k]
Lam=mangoldt(N); pp=Lam>0
out['DH']=dict(xi=float(xi),a6_minus_a2a3=float(a[6]-a[2]*a[3]),b6=float(b[6]),
   max_abs_b_over_logn=[(int(X),float(np.max(np.abs(b[2:X+1])/np.log(np.arange(2,X+1))))) for X in (100,1000,10000,20000)],
   frac_mass_off_prime_powers=float(np.sum(np.abs(b[1:])*(~pp[1:]))/np.sum(np.abs(b[1:]))))
print(out['DH'])
# (iii) table. window sinc^8: what(0), sup what
wh0=float(what(0.0)[0]); whmax=wh0
tab=[]
for T in (1e4,1e12,1e30,1e100):
    L=np.log(T/(2*np.pi))
    for lab,Hh in (('log^2 T',np.log(T)**2),('T^0.5',T**0.5),('T^1',T)):
        for delta in (0.05,0.2,0.37,0.49):
            Mon=wh0*Hh*L/(2*np.pi)
            # single-term regime, N = H (largest allowed): g = 2 sinh(delta log N); B = H what0 log N/(2 pi sqrt N)
            g1=2*np.sinh(delta*np.log(Hh)); B1=Hh*wh0*np.log(Hh)/(2*np.pi*np.sqrt(Hh))
            # multi-term regime: N* where g = M_on ; B = (2/pi) whmax sqrt(N) log N / log(2N/H)  (Brun-Titchmarsh)
            lnN=np.arcsinh(Mon/2)/delta
            lnB=np.log(2/np.pi*whmax)+0.5*lnN+np.log(lnN)-np.log(max(lnN-np.log(Hh)+np.log(2),1.0))
            tab.append(dict(T=T,H=lab,delta=delta,g_over_Mon_at_N_eq_H=float(g1/Mon),B_over_Mon_at_N_eq_H=float(B1/Mon),
                            logN_star_over_logT=float(lnN/np.log(T)),log10_B_over_g_at_N_star=float((lnB-np.log(Mon))/np.log(10))))
            print('T=%g H=%s delta=%.2f | N=H: g/M_on=%.3g | N*: logN*/logT=%.3g  log10(B/g)=%.3g'%(T,lab,delta,g1/Mon,lnN/np.log(T),(lnB-np.log(Mon))/np.log(10)))
out['table']=tab; out['what0']=wh0
json.dump(out,open('testC.json','w'),indent=1)
