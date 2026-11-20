# independent referee checks (mpmath only), cases different from the author's
from mpmath import *
import sys
print('planned memory < 50 MB')
N=64; rad=mpf(10)**-6
# ---------- B. q=7 three odd characters
mp.dps=40
q7=7; g7=3; dl={}; x=1
for j in range(6): dl[x]=j; x=x*g7%7
def chi(k,a): return exp(2j*pi*k*dl[a]/6)
def L(k,s): return mpf(7)**(-s)*fsum(chi(k,a)*zeta(s,mpf(a)/7) for a in range(1,7))
odd=[1,3,5]   # chi_k(-1)=chi_k(3^3)=(-1)^k
def w0(s): return fsum(1/(L(k,s)*L((6-k)%6,2-s)) for k in odd)   # conj chi_k = chi_{-k}
s0=mpc('0.5085957730951408','17.4811128503728930')
print('B |w0| at claimed q=7 odd zero:',nstr(abs(w0(s0)),4),' |w0| at s0+0.001:',nstr(abs(w0(s0+0.001)),4))
r=findroot(w0,s0); print('B refined',nstr(r,25))
# winding on circle radius 1e-6, 64 points
N=64; rad=mpf(10)**-6; tot=0; prev=w0(r+rad)
for j in range(1,N+1):
    cur=w0(r+rad*exp(2j*pi*j/N)); tot+=arg(cur/prev); prev=cur
print('B winding number',nstr(tot/(2*pi),10))
print('B nearest L zeros check: |L_k(1/2+it)| min near 17.48:',[nstr(abs(L(k,mpc(0.5,17.48))),4) for k in odd])
def G(s,par=1,qq=7): return (mpf(qq)/pi)**(s/2)*gamma((s+par)/2)
def Sv(t):
    tm=[G(mpc(0.5,t))*L(k,mpc(0.5,t))*conj(G(mpc(1.5,t))*L(k,mpc(1.5,t))) for k in odd]
    return fsum(re(x) for x in tm)/fsum(abs(x) for x in tm), fsum(re(1/x) for x in tm)/fsum(abs(1/x) for x in tm)
for t in (16.70,16.75,16.80,17.0,2.31,2.25):
    a,b=Sv(mpf(t)); print('B q=7 odd t',t,'S_v',nstr(a,6),'S_w',nstr(b,6))
# ---------- C. zeta alone
def xiz(s): return s*(s-1)*pi**(-s/2)*gamma(s/2)*zeta(s)
for t in (13.0,13.50,13.54,13.6,14.0,14.2):
    a=xiz(mpc(0.5,t))*conj(xiz(mpc(1.5,t))); print('C zeta t',t,'S_v normalised',nstr(re(a)/abs(a),6))
# Lemma T explicit identity at a random point: P(x-i/2)=xi(3/2-ix)/xi(1/2-ix) vs 1/(m |W(x+i/2)|^2), m(s)=xi(s)xi(2-s), s=1-iz
xr=mpf('7.3'); z=mpc(xr,-0.5); sz=1-1j*z
lhs=xiz(1-1j*(z+1j))/xiz(1-1j*z); m=xiz(sz)*xiz(2-sz); Wi=1/xiz(1-1j*mpc(xr,0.5))
print('C Lemma T identity diff',nstr(abs(lhs-1/(m*abs(Wi)**2)),4))
