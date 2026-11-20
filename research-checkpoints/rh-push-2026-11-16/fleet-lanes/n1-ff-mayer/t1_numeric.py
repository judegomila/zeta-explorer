import sys, numpy as np
from ffm import *
q=int(sys.argv[1]); n=int(sys.argv[2])
N=irreducibles(q,n)[0]; R=Ring(q,N)
print("q",q,"N(low->high)",N,"dim",R.size+1,"companion size",n*(R.size+1))
m=R.size-1
ks=range(m) if len(sys.argv)<4 else [int(x) for x in sys.argv[3].split(',')]
for k in ks:
    chi=chi_k(R,k)
    even = (k*(m//(q-1)))%m==0
    Bs,C=coeff_mats(R,chi)
    v=det_zeros(R,Bs,C)
    big=v[np.abs(v)>1e-6]; u=1/big
    u=sorted(u,key=lambda z:(round(abs(z),6),np.angle(z)))
    Lc=L_poly(R,chi); Lr=np.roots(Lc[::-1]) if len(Lc)>1 else []
    print(f"k={k} even={even}  #finite zeros of det A = {len(u)}")
    print("   |u| of zeros:", np.round(np.abs(u),6).tolist())
    print("   zeros:", np.round(u,5).tolist())
    print("   L zeros:", np.round(Lr,5).tolist(), " |.|", np.round(np.abs(Lr),6).tolist())
