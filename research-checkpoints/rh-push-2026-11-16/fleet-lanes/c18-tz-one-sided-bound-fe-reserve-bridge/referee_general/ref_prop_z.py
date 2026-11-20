import numpy as np
def brentq(f,a,b):
    for _ in range(200):
        m=(a+b)/2
        if f(a)*f(m)<=0: b=m
        else: a=m
    return (a+b)/2
def test(Lg,th,frac,n=900,off=0.3):
    u=th*Lg; s=(np.arange(n)+0.5)*u/n; ds=u/n
    d=2*np.pi/Lg; g1=off*d+5*d; g2=g1+d; gb=(g1+g2)/2
    margin=Lg*(1-th-np.sin(np.pi*th)/np.pi)
    mu=lambda e:u*(np.sinh(u*e)/(u*e)-1)
    eta=brentq(lambda e:mu(e)-frac*margin,1e-9,5)
    xi=s[:,None]-s[None,:]
    K=Lg*np.eye(n)/ds - np.exp(1j*g1*xi)-np.exp(1j*g2*xi)+2*np.cosh(eta*xi)*np.exp(1j*gb*xi)
    # direct lattice sum check of Lg*Id: sum_k e^{i gamma_k xi} over many k approximates Lg*delta on |xi|<Lg (not built; identity is Parseval)
    ev=np.linalg.eigvalsh(K*ds)
    print(f"Lg={Lg} th'={th} eta={eta:.4f} mu/margin={frac} margin={margin:.4f} min eig={ev[0]:.4f} bound={margin-mu(eta):.4f}")
for th in (0.55,0.7,0.9,0.98):
    for fr in (0.5,1.0,3.0): test(12.0,th,fr)
test(12.0,1.0,1.0) if False else None
