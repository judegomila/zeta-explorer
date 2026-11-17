# Away from the real axis: truncated Euler product (the proved large-L limit of Theta_S, ratio -> 1) on sigma=0.6, t in [20,60].
# Prediction from the pole: log|E_x(s) zeta(s)| ~ Re li(x^{1-s}) ~ Re[x^{1-s}/((1-s) log x)], amplitude x^{0.4}/(|1-s| log x).
from lib import *
S=np.array([complex(0.6,t) for t in np.arange(20,60.01,0.1)]); mp.mp.dps=20
lz=np.array([float(mp.log(abs(mp.zeta(mp.mpc(s.real,s.imag))))) for s in S])
allP=primes_upto(10**8).astype(float); print(f"[alloc: {len(allP)} primes; per s-point temporaries {len(allP)*16*3/1e6:.0f} MB]",flush=True)
lpa=np.log(allP); out=[]
for x in (10**3,10**4,10**5,10**6,10**7,10**8):
    lp=lpa[allP<=x]; d=np.array([np.log(abs(1-np.exp(-s*lp))).sum() for s in S])+lz
    pred=np.array([abs(complex(mp.ei((1-mp.mpc(s.real,s.imag))*mp.log(x)))) for s in S])
    i=abs(d).argmax(); out.append(dict(x=x,sup=float(abs(d).max()),at=float(S[i].imag),pred_amp_at=float(pred[i]),sup_pred_amp=float(pred.max()),rms=float(np.sqrt((d**2).mean()))))
    print(out[-1],flush=True)
json.dump(out,open(HERE+"/t5.json","w"),indent=1)
