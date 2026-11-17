# 2 pi^(-s/2) Gamma(s/2) zeta(s) = sum_n h_n J_2n(t) (Abel sense), s = 1/2+it
# h_n = G_2n - 2 binom(4n,2n)/16^n, G(z)=(1+z)^(-1/2) theta((1-z)/(1+z)) = theta(1) sum d(n) Phi^n z^2n/(2n)!
# J_m(t) = 2 int e^{itu} sech^{1/2}(u) tanh^m(u) du  (m even);  (m+1/2) J_{m+1} = m J_{m-1} + i t J_m
import json,sys
from mpmath import mp, mpf, mpc, pi, gamma, sqrt, zeta, nstr, zetazero, log
mp.dps=40
G=[mpf(x) for x in json.load(open("G_1200.json"))]; NM=len(G)-1
b=[mpf(2)]
for n in range(1,NM+1): b.append(b[-1]*(4*n-1)*(4*n-3)/(16*n*(2*n-1))*mpf(4)/4)
# binom(4n,2n)/16^n ratio: (4n)(4n-1)(4n-2)(4n-3)/((2n)^2(2n-1)^2*16) = (4n-1)(4n-3)/(4*2n*(2n-1))... recompute directly
from mpmath import binomial
b=[2*binomial(4*n,2*n)/mpf(16)**n for n in range(NM+1)]
h=[G[n]-b[n] for n in range(NM+1)]
print("h_n n^(1/4):",[(n,nstr(h[n]*mpf(n)**0.25,3)) for n in (1,3,10,30,100,300,600,1000,1200)])
import math
for lo,hi in ((1,50),(50,200),(200,600),(600,1200)):
    print("rms of h_n n^(1/4) on (%d,%d]: %.3f ; rms of G_2n n^(1/4): %.3f"%(lo,hi,math.sqrt(sum(float(h[n])**2*n**0.5 for n in range(lo+1,hi+1))/(hi-lo)),math.sqrt(sum(float(G[n])**2*n**0.5 for n in range(lo+1,hi+1))/(hi-lo))))
def J(t,M):
    F=[2*abs(gamma(mpf(1)/4+mpc(0,t)/2))**2/sqrt(2*pi)]
    F.append(mpc(0,t)*F[0]/mpf('0.5'))
    for m in range(1,M): F.append((m*F[m-1]+mpc(0,t)*F[m])/(m+mpf('0.5')))
    return F
for t in (mpf(0),mpf(zetazero(1).imag), mpf(20), mpf(40)):
    s=mpc(0.5,t); target=(2*pi**(-s/2)*gamma(s/2)*zeta(s)).real
    F=J(t,2*NM+1); scale=abs(2*pi**(-s/2)*gamma(s/2))
    T=[(h[n]*F[2*n]).real for n in range(NM+1)]
    print("t=",nstr(t,12)," target/scale = Re-normalised zeta:",nstr(target/scale,10))
    ps=0
    for n in range(NM+1):
        ps+=T[n]
        if n in (10,30,100,300,600,900,1200): print("   partial N=%4d  value/scale %s  err/scale %s"%(n,nstr(ps/scale,8),nstr((ps-target)/scale,3)))
    for r in ('0.99','0.995','0.998','0.999'):
        r=mpf(r); a=sum(T[n]*r**(2*n) for n in range(NM+1))
        print("   Abel r=%s  value/scale %s  err/scale %s  (r^2N=%s)"%(r,nstr(a/scale,8),nstr((a-target)/scale,3),nstr(r**(2*NM),2)))
