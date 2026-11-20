import numpy as np
def mineig(Lg,th,eta,n=1000,off=0.3,M=3):
    u=th*Lg; s=(np.arange(n)+0.5)*u/n; ds=u/n
    d=2*np.pi/Lg; g1=off*d+5*d; g2=g1+d; gb=(g1+g2)/2
    xi=s[:,None]-s[None,:]
    K=Lg*np.eye(n)/ds
    if th>1:  # lattice kernel Lg*sum_m delta(xi-m Lg): add shifted identities by interpolation-free nearest grid shift
        k=int(round(Lg/ds)); K=K+Lg*(np.eye(n,k=k)+np.eye(n,k=-k))/ds
    K=K-np.exp(1j*g1*xi)-np.exp(1j*g2*xi)+2*np.cosh(eta*xi)*np.exp(1j*gb*xi)
    return np.linalg.eigvalsh(K*ds)[0]
for th in (0.9,0.98,1.0,1.05,1.2):
    print(th,[round(float(mineig(12.0,th,e)),4) for e in (0.0,0.01,0.05,0.1,0.2)])
