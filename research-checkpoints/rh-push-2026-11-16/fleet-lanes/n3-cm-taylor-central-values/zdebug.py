import json
from mpmath import mp, mpf, mpc, pi, gamma, sqrt, zeta, binomial, factorial, nstr, quad, exp, cosh, tanh, inf, jtheta, linspace
mp.dps=30
d=[int(x) for x in json.load(open("dn_300.json"))]
Phi=gamma(mpf(1)/4)**8/(128*pi**4); th1=pi**mpf('0.25')/gamma(mpf(3)/4)
h=[th1*d[n]*Phi**n/factorial(2*n)-2*binomial(4*n,2*n)/mpf(16)**n for n in range(301)]
def Frec(t,M):
    G=[abs(gamma(mpf(1)/4+mpc(0,t)/2))**2/sqrt(2*pi)]
    G.append(mpc(0,t)*G[0]/mpf('0.5'))
    for m in range(1,M): G.append((m*G[m-1]+mpc(0,t)*G[m])/(m+mpf('0.5')))
    return G
def H(z):
    x=(1-z)/(1+z)
    th=jtheta(3,0,exp(-pi*x)) if x>0.05 else x**-0.5*jtheta(3,0,exp(-pi/x))
    return (1+z)**-0.5*(th-1-x**-0.5) if x>0.05 else (1+z)**-0.5*(x**-0.5*(jtheta(3,0,exp(-pi/x))-1)-1)
# series for H vs direct
for z in (mpf('0.3'),mpf('0.7'),mpf('0.9')):
    print("H check z=",z, nstr(H(z),12), nstr(sum(h[n]*z**(2*n) for n in range(301)),12))
for t in (mpf(0),mpf(2),mpf(5)):
    s=mpc(0.5,t); target=2*pi**(-s/2)*gamma(s/2)*zeta(s)
    G=Frec(t,601)
    pts=[-inf]+[mpf(k) for k in range(-40,41,2)]+[inf]
    q=[quad(lambda u: exp(1j*t*u)*cosh(u)**-0.5*tanh(u)**m,pts) for m in (0,2,10,40)]
    print("t",t,"rec vs quad",[nstr(abs(q[i]-G[m]),3) for i,m in enumerate((0,2,10,40))],"G40",nstr(G[40],8))
    print(" target",nstr(target,12))
    for N in (20,50,100,200,300):
        print("  partial N",N,nstr(sum(h[n]*sqrt(2)*G[2*n] for n in range(N+1)),12))
    for r in ('0.9','0.97','0.99'):
        r=mpf(r); print("  Abel",r,nstr(sum(h[n]*r**(2*n)*sqrt(2)*G[2*n] for n in range(301)),12))
