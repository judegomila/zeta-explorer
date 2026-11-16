# Cubic deficit lemma checks and the sharp monotone quantity W = (1-Theta)/(Theta g)
import numpy as np, sympy as sp
from fractions import Fraction as Fr
from cm2 import *
# (a) exact telescoping 6a^2+2a^3 = 2(1/r^3 - 1/(r+1)^3)
r=sp.symbols('r',positive=True); a=1/(r*(r+1))
print("telescope residual:",sp.simplify(6*a**2+2*a**3-2*(1/r**3-1/(r+1)**3)))
# (b) one-sided greedy: f(p) = 6p(c^2-(1+c)p)
c,p=sp.symbols('c p'); f=2*c**3-6*p**2-2*p**3-2*(c-p)**3
print("f - 6p(c^2-(1+c)p) =",sp.expand(f-6*p*(c**2-(1+c)*p)))
# (c) random admissible one-sided and two-sided configs: d_side >= 2 x^3 ; D >= 2(x^3+y^3) >= 4 eta^3
rng=np.random.default_rng(1); w1=np.inf; w2=np.inf; w3=np.inf
def side(n):
    mode=rng.integers(0,3)
    if mode==0: gaps=1+rng.exponential(0.5,n)
    elif mode==1: gaps=1+rng.random(n)*1e-2
    else: gaps=1+rng.exponential(3,n)*(rng.random(n)<0.2)
    l=np.cumsum(gaps); mu=1/(l*(l+1)); return 1-mu.sum(), 2-(6*mu**2+2*mu**3).sum()
for t in range(200000):
    x,dL=side(rng.integers(0,30)); y,dR=side(rng.integers(0,30))
    w1=min(w1,dL-2*x**3,dR-2*y**3); eta=(x+y)/2
    w2=min(w2,(dL+dR)-4*eta**3)
print("min(d_side - 2x^3):",w1,"  min(D - 4 eta^3):",w2)
# (d) dynamics: W nondecreasing; collision bound tc <= m0^2 (1+Theta0)/(8(1-Theta0))
from numpy.polynomial.hermite import hermgauss
wm=np.inf; mr=0
for t in range(1200):
    kind=t%4; N=int(rng.integers(3,22))
    if kind==0: gaps=1+rng.exponential(0.5,N-1)
    elif kind==1: gaps=1+rng.random(N-1)*0.03
    elif kind==2:
        z,_=hermgauss(N); gaps=np.diff(np.sort(z))*(1+0.02*rng.standard_normal(N-1))
    else: gaps=np.exp(0.7*rng.standard_normal(N-1))
    rec=run(np.concatenate([[0],np.cumsum(gaps)]),floor=2e-2)
    th=rec[:,2]; m=rec[:,3]; W=(1-th)/(th*m)
    wm=min(wm,(np.diff(W)/W[:-1]).min())
    tc=tc_est(rec); bound=m[0]**2*(1+th[0])/(8*(1-th[0]))
    mr=max(mr,tc/bound)
    assert tc<=bound*(1+1e-6)
print("min relative step increment of W=(1-Theta)/(Theta g):",wm,"   max tc/bound:",mr)
