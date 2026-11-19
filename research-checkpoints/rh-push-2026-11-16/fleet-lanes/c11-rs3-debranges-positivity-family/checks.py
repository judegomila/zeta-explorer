# Referee-style checks: (1) q_h = cos(Delta_h), Delta_h = sum over zeros of arctan(h/(gamma-gamma'));
# (2) LAT control: Re sin(u+iL)/sin(u) > 0 for Im u > 0; (3) kernel identity K(w,w+ih) for E_a, direct.
import random, json
from mpmath import mp, mpf, mpc, zeta, loggamma, exp, log, pi, zetazero, im, re, diff, atan, cos, sin, conj
mp.dps=25
def gfac(s): return s*(s-1)*exp(-s/2*log(pi)+loggamma(s/2))
def xi(s): return gfac(s)*zeta(s)
out={}
NZ=400
g=[im(zetazero(n)) for n in range(1,NZ+1)]
T=g[-1]
rows=[]
for n in (1,2,5,10,34,60):
    gam=g[n-1]; rho=mpc(0.5,gam)
    for h in (mpf('0.5'),mpf(1),mpf(2)):
        d=diff(xi,rho); v=xi(rho+h); q=-re(d*v)/(abs(d)*abs(v))
        D=sum(atan(h/(gam-x)) for x in g if x!=gam)+sum(atan(h/(gam+x)) for x in g)
        # tail of the symmetric sum, zeros |gamma'|>T: pair contribution 2 h gam/(gam^2-x^2), density log(x/2pi)/2pi
        tail=-2*h*gam*(log(T/(2*pi))+1)/(2*pi*T)
        rows.append([n,float(h),float(q),float(cos(D+tail)),float(D+tail)])
out['q_vs_cosDelta']=rows
for r in rows: print(r)
# (2) LAT
random.seed(1); mn=10
for _ in range(20000):
    L=random.uniform(0.01,6); u=complex(random.uniform(-10,10),random.uniform(1e-6,8))
    import cmath
    val=(cmath.sin(u+1j*L)/cmath.sin(u)).real
    mn=min(mn,val)
out['LAT_min_Re']=mn; print('LAT min Re',mn)
# (3) kernel: E(z)=xi(1/2+a-iz), h=2a, w = zero with 1/2+a-iw = conj(rho): w=-gam-ia ; K(w,w+ih) limit vs xi'(rho)conj(xi(rho+2a))/(2pi)
a=mpf('0.75'); h=2*a; gam=g[0]
E=lambda z: xi(mpf(1)/2+a-1j*z)
Es=lambda z: conj(E(conj(z)))
def K(w,z): return (E(z)*conj(E(w))-Es(z)*conj(Es(w)))/(2j*pi*(conj(w)-z))
w=mpc(-gam,-a)
eps=mpf('1e-8')
num=K(w,w+1j*h+eps)
rho=mpc(0.5,gam)
pred=diff(xi,rho)*conj(xi(rho+2*a))/(2*pi)
rho2=mpc(0.5,-gam)
pred2=diff(xi,rho2)*conj(xi(rho2+2*a))/(2*pi)
out['kernel']=[str(num),str(pred),str(pred2)]
print(num,pred,pred2)
json.dump(out,open(__file__.replace('checks.py','checks.json'),'w'),indent=1)
