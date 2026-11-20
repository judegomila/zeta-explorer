# independent referee checks (mpmath only), cases different from the author's
from mpmath import *
import sys
print('planned memory < 50 MB')
# ---------- A. heat
mp.dps=110
def weights(tau,h=mpf('0.0025'),V=mpf('1.6')):
    n=int(V/h); out=[]
    for k in range(n+1):
        v=h*k; ph=mpf(0)
        for m in range(1,40):
            a=pi*m*m*exp(4*v)
            if a>1200: break
            ph+=(2*pi**2*m**4*exp(9*v)-3*pi*m*m*exp(5*v))*exp(-a)
        w=8*h*ph*exp(tau*v*v)
        if k==0: w/=2
        out.append((2*v,w))
    return out
def X(W,s):
    z=s-mpf(1)/2
    return fsum(w*cosh(a*z) for a,w in W)
def Xp(W,s):
    z=s-mpf(1)/2
    return fsum(w*a*sinh(a*z) for a,w in W)
W0=weights(mpf(0))
s=mpc(1.5,37.3); xi=s*(s-1)*pi**(-s/2)*gamma(s/2)*zeta(s)
print('A0 X_0/(xi/2)-1 at 1.5+37.3i:',nstr(abs(X(W0,s)/(xi/2)-1),5))
def q(W,g,h=1):
    rho=mpc(0.5,g); a=Xp(W,rho)*X(W,rho+h)
    return -re(a)/abs(a)
def zero(W,g0):
    return findroot(lambda t: re(X(W,mpc(0.5,t))),g0)
for tau,g0 in ((mpf('-0.5'),mpf('173.81')),(mpf('-2'),mpf('84.33')),(mpf('-0.05'),mpf('111.08')),(mpf('0.2'),mpf('282.26')),(mpf('0.5'),mpf('110.6')),(mpf(0),mpf('111.03'))):
    W=weights(tau); g=zero(W,g0)
    print('A tau',tau,'zero',nstr(g,12),'q_1',nstr(q(W,g),6),'q_0.5',nstr(q(W,g,mpf(1)/2),6),'q_2',nstr(q(W,g,2),6))
# off-line pair at tau=-0.5 near 111.7 ?
W=weights(mpf('-0.5'))
for guess in (mpc(0.6,111.72),mpc(0.7,111.7),mpc(0.55,111.72)):
    try:
        r=findroot(lambda s: X(W,s),guess)
        print('A off-line zero tau=-0.5:',nstr(r,12),'|X|',nstr(abs(X(W,r)),3),'|X| at r+0.01',nstr(abs(X(W,r+0.01)),3)); break
    except Exception as e: print('findroot fail',guess,e)
# on-line zero count tau=-0.5 in (100,120) by grid 0.01 (different grid)
vals=[re(X(W,mpc(0.5,100+0.01*k))) for k in range(2001)]
print('A sign changes tau=-0.5 in (100,120), grid 0.01:',[round(100+0.01*k,2) for k in range(2000) if vals[k]*vals[k+1]<0])
# Lemma H2 sanity at tau != 0 is not attempted (needs all zeros)
