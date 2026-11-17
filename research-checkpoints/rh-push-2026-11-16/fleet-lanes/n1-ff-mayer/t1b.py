import sys, numpy as np
from ffm import *
q=int(sys.argv[1]); n=int(sys.argv[2])
N=irreducibles(q,n)[int(sys.argv[4]) if len(sys.argv)>4 else 0]; R=Ring(q,N)
print("q",q,"N(low->high)",N,"dim",R.size+1,"companion size",n*(R.size+1))
m=R.size-1
ks=range(m) if sys.argv[3]=='all' else [int(x) for x in sys.argv[3].split(',')]
for k in ks:
    chi=chi_k(R,k)
    even = (k*(m//(q-1)))%m==0
    Bs,C=coeff_mats(R,chi)
    v=det_zeros(R,Bs,C)
    big=v[np.abs(v)>1e-4]; u=1/big
    triv=u[np.abs(u-1/q)<2e-2]; u=u[np.abs(u-1/q)>=2e-2]
    u=sorted(u,key=lambda z:(round(abs(z),4),np.angle(z)))
    Lc=L_poly(R,chi); Lr=np.roots(Lc[::-1]) if len(Lc)>1 else []
    print(f"k={k} even={even} finite zeros {len(big)}, near 1/q: {len(triv)} (dim {R.size+1})")
    print("   other zeros (|u|, arg/pi):", [(round(abs(z),4),round(float(np.angle(z))/np.pi,4)) for z in u])
    print("   L zeros     (|u|, arg/pi):", sorted([(round(abs(z),4),round(float(np.angle(z))/np.pi,4)) for z in Lr]))
