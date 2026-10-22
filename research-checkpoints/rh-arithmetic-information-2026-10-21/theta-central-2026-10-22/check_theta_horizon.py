#!/usr/bin/env python3
"""Rigorous interval rectangles; requires python-flint==0.9.0 (Arb).
No binary floating-point constants are used in the proof computation.
"""
from flint import arb, ctx
import flint
import argparse
p=argparse.ArgumentParser();p.add_argument('--bits',type=int,default=128);p.add_argument('--cells',type=int,default=65536)
a=p.parse_args();ctx.prec=a.bits
K=a.cells
assert K>0 and K&(K-1)==0, 'Use a power of two for exact endpoints'
N=5
pi=arb.pi();s0=arb(0);s2=arb(0)
for j in range(K):
    u=arb(arb(2*j+1)/(2*K),arb(1)/(2*K))
    e4=(4*u).exp();e5=(5*u).exp();e9=(9*u).exp()
    phi=arb(0)
    for n in range(1,N+1):
        phi+=(2*pi*pi*n**4*e9-3*pi*n*n*e5)*(-pi*n*n*e4).exp()
    f=(u*u/2).exp()*phi
    s0+=f/K;s2+=u*u*f/K
# n>N, 0<=u<=1: ratio of n^4 exp(-pi n^2) <=16 exp(-pi(2N+3)).
series_tail=2*pi*pi*arb('9.5').exp()*(N+1)**4*(-pi*(N+1)**2).exp()/(1-16*(-pi*(2*N+3)).exp())
# u>=1, all n: logarithmic derivative of u^2 exp(u^2/2+9u-pi n^2 e^(4u)) <=-500 n^2.
# Thus integral <=value_at_1/(500 n^2). Adjacent n^2 exp(-A n^2) ratio <=4 exp(-3A).
A=pi*arb(4).exp()
u_tail=2*pi*pi*arb('9.5').exp()*(-A).exp()/(500*(1-4*(-3*A).exp()))
M0lower=s0.lower();M2upper=s2.upper()+series_tail.upper()+u_tail.upper()
R=M2upper/M0lower
print('python-flint:',flint.__version__,'bits:',a.bits,'cells:',K)
print('finite M0 enclosure:',s0)
print('finite M2 enclosure:',s2)
print('series tail bound:',series_tail)
print('u tail bound:',u_tail)
print('M0 lower bound:',M0lower)
print('M2 upper bound:',M2upper)
print('ratio upper bound:',R)
assert M0lower>0
# Final exact rational target. This implies H_tau(x)>0 for |x|<=13.
assert R<arb(2)/169, 'Certificate target not established'
print('PASS: M2(1/2)/M0(1/2) < 2/169; H_tau(x)>0 for 0<=tau<=1/2 and real |x|<=13.')
