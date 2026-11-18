# Test B: can on-line displacements of the other zeros absorb an off-line pair on u in [0, log N]?
# d(u)   = change of S_w(u) when a double on-line zero at t0 becomes the pair t0 -+ i delta
# V      = real span of displacement fields  d/dgamma_j [ w((gamma_j-T)/H) e^{i u gamma_j} ]  (zeros stay on the line)
# r      = dist(d, V) / ||d||   in L^2([0, log N], du)     (phase e^{iuT} factored out of everything)
import numpy as np, json, sys
from lib import *
g=np.load('zeros40000.npy'); out=[]
def run(T,H,delta,thetas,band=14.0):
    LT=np.log(T/(2*np.pi))
    sel=np.abs(g-T)<band*H; gg=g[sel]-T
    j0=np.argmin(np.abs(gg)); t0=gg[j0]; gg=np.delete(gg,j0)
    rows=[]
    for th in thetas:
        Lmax=th*LT
        du=np.pi/(1.6*band*H); u=np.arange(0,Lmax,du)[:,None]
        zc=(t0-1j*delta); zb=(t0+1j*delta)
        d=(w(zc/H)*np.exp(1j*u*zc)+w(zb/H)*np.exp(1j*u*zb)-2*w(t0/H)*np.exp(1j*u*t0))[:,0]
        A=(1j*u*w(gg/H)[None,:]+dw(gg/H)[None,:]/H)*np.exp(1j*u*gg[None,:])
        nrm=np.linalg.norm(A,axis=0); A=A/nrm
        Ar=np.vstack([A.real,A.imag]); dr=np.concatenate([d.real,d.imag])
        eps,_,rk,sv=np.linalg.lstsq(Ar,dr,rcond=1e-10)
        r=np.linalg.norm(Ar@eps-dr)/np.linalg.norm(dr)
        shift=np.abs(eps/nrm)                      # displacement of each zero
        # zeros inside the main lobe only
        rows.append(dict(theta=th,N=float(np.exp(Lmax)),r=float(r),unknowns=int(gg.size),rows=int(dr.size),
                         time_bandwidth=float(2*band*H*Lmax/(2*np.pi)),max_shift_over_delta2=float(shift.max()/delta**2),
                         d_norm=float(np.linalg.norm(d)*np.sqrt(du))))
        print('T=%g H=%g delta=%g theta=%.2f N=%.3g unknowns=%d TBP=%.0f r=%.3e maxshift/delta^2=%.3g'%(T,H,delta,th,np.exp(Lmax),gg.size,rows[-1]['time_bandwidth'],r,rows[-1]['max_shift_over_delta2']),flush=True)
    out.append(dict(T=T,H=H,delta=delta,logT2pi=LT,rows=rows))
thetas=[0.3,0.5,0.7,0.85,0.95,1.0,1.05,1.15,1.3,1.6,2.0]
for T in (1000.0,10000.0,30000.0):
    for H in (2.0,6.0):
        run(T,H,0.05,thetas)
run(10000.0,6.0,0.3,thetas)
json.dump(out,open('testB.json','w'),indent=1)
