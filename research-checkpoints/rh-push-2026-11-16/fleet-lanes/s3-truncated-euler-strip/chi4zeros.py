# Ordinates of zeros of L(s, chi_4) on Re s = 1/2, 0 < t <= T, by sign changes of Z(t) = e^{i theta(t)} L(1/2+it, chi_4)
# theta(t) = (t/2) log(4/pi) + Im loggamma(3/4 + it/2). MEASURED (grid 0.04; close pairs can be missed).
import sys, json
from mpmath import mp, mpf, mpc, loggamma, log, pi, exp, findroot, dirichlet
mp.dps=20
T=float(sys.argv[1]); step=0.04
def Z(t):
    t=mpf(t); th=(t/2)*log(4/pi)+loggamma(mpc(0.75,t/2)).imag
    return (exp(1j*th)*dirichlet(mpc(0.5,t),[0,1,0,-1])).real
zs=[]; t=0.5; prev=Z(t)
while t<T:
    t2=t+step; cur=Z(t2)
    if prev*cur<0:
        try:
            r=findroot(Z,(t,t2),solver='anderson',tol=1e-15)
            zs.append(str(r))
        except Exception as e:
            zs.append(str((t+t2)/2))
    t=t2; prev=cur
json.dump(dict(object='L(s,chi4)',T=T,count=len(zs),gamma=zs,method='sign changes of Z, step 0.04, mpmath 20 digits; MEASURED'),open(sys.argv[2],'w'))
print(len(zs),zs[:3])
