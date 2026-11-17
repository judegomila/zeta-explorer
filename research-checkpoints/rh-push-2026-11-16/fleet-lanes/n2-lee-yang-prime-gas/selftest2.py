# E_a two-site gas at larger a: zeros of sum over subsets of 2k sites (p,+),(p,-) with fields p^{-a}, p^{+a}, mean-field coupling.
from lib import *
k=7; P=first_primes(k); lp=np.log(P)
for a in (0.2,0.45,0.8):
    l2=np.concatenate([lp,lp]); sh=np.concatenate([np.full(k,a),np.full(k,-a)]); L2=l2.sum()
    ln2,mu2=subset_logs(l2); shs,_=subset_logs(sh*np.concatenate([lp,lp])); coef=mu2*np.exp(ln2**2/(2*L2)-shs)   # site weight p^{-s-a}, p^{-s+a}
    f=lambda z: dsum(coef,ln2,z)
    wide,_=winding(f,complex(-2.5,0.37),complex(3.5,30.0),6000); thin,st=winding(f,complex(0.48,0.37),complex(0.52,30.0),6000)
    print(f"E_a gas a={a}, k={k}: zeros in box Re in [-2.5,3.5], 0.37<t<30: {wide:.3f}; within |Re s-1/2|<0.02: {thin:.3f} (max arg step {st:.2f}); Lee-Yang guarantees only |Re s-1/2|<={a}",flush=True)
