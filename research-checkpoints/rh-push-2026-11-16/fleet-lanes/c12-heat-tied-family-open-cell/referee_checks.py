# second-route checks with mpmath (no flint): (i) R+1 at the first q=5 interior zero; (ii) S_v, S_w at chosen t for the q=5 pair;
# (iii) heat q_1 at the first failing zero for tau=-1 by mpmath quadrature; (iv) arg m(3/2+it) for T-NR.
from mpmath import mp, mpf, mpc, zeta, gamma, pi, exp, log, quad, cos, cosh, sinh, re, im, findroot, atan, tan, arg, inf, nstr
mp.dps=40
chi={1:1,2:mpc(0,1),3:mpc(0,-1),4:-1}
def L(s,conj=False):
    return mpf(5)**(-s)*sum((chi[a].conjugate() if conj and a in(2,3) else chi[a])*zeta(s,mpf(a)/5) for a in range(1,5))
s=mpc('0.51022082139396663026550280345140','77.228992526932208790173298659513')
R=(L(s)/L(s,True))*(L(2-s,True)/L(2-s))
print('(i) R+1 at first zero (mpmath):',nstr(R+1,5))
def G(s): return (5/pi)**(s/2)*gamma((s+1)/2)
def xi(s,c=False): return G(s)*L(s,c)
for t in (mpf('8.55'),mpf('3.79'),mpf('27.81')):
    a=xi(mpc(0.5,t))*xi(mpc(1.5,t)).conjugate(); b=xi(mpc(0.5,t),True)*xi(mpc(1.5,t),True).conjugate()
    print('(ii) t=',t,' S_v/scale=',nstr(re(a+b)/(abs(a)+abs(b)),8),' S_w/scale=',nstr(re(1/a+1/b)/(abs(1/a)+abs(1/b)),8))
mp.dps=120
def Phi(v): return sum((2*pi**2*n**4*exp(9*v)-3*pi*n**2*exp(5*v))*exp(-pi*n**2*exp(4*v)) for n in range(1,12))
tau=mpf(-1)
def X(s): return 8*quad(lambda v: exp(tau*v*v)*Phi(v)*cosh(2*(s-mpf(1)/2)*v),[0,0.25,0.5,0.75,1,1.4],maxdegree=8)
def H(t): return re(X(mpc(0.5,t)))
g=findroot(H,mpf('76.53064'))
d=(H(g+mpf(10)**-20)-H(g-mpf(10)**-20))/(2*mpf(10)**-20)
xv=X(mpc(1.5,g)); q1=-(d/abs(d))*im(xv)/abs(xv)
print('(iii) tau=-1 zero at',nstr(g,12),' q_1 =',nstr(q1,8))
for t in (mpf(3),mpf('3.34'),mpf(4)):
    m=2*cosh(mpc(1,t)*log(2))+mpf(5)/2
    print('(iv) t=',t,'arg m(3/2+it)=',nstr(arg(m),8),' formula',nstr(atan(mpf(3)/5*tan(t*log(2)/2)),8))
