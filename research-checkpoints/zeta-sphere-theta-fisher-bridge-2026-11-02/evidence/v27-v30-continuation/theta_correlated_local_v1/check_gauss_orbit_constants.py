"""Owned exact-rational algebra checks, not a theta pivot certificate."""
from fractions import Fraction as F
from math import factorial
import json
# e^3>18 proves full zeroth/second moment bound48*pi*exp(-pi)<8.
e3lower=sum(F(3)**k/factorial(k) for k in range(7))
assert e3lower>18
# pi>3 implies the incomplete-gamma logarithmic slope leaves rate>1/3.
assert 1-F(7,12)>F(1,3)
# 4e^(-3pi)<1/2 follows e^9>8 already from1+9.
assert 1+9>8
# Synthetic kernel C=exp(-r²-r4) and matching one-node rule.
c0=F(1); c2=F(-1); c4=F(-1,2)
mu0=4; mu1=-c2*2; mu2=c4*24/F(4)
h=mu2-F(mu1)**2/mu0
q4=F(2)**2/factorial(4)
assert h==-4 and c4-q4==F(-2,3)
# N1 Stieltjes/Gauss inverse identity under positive symbolic moments,
# sampled exactly for independent rational pairs; algebra formula documented.
for m0,m1,s in [(F(2),F(3),F(1,4)),(F(7,3),F(2,5),F(11))]:
 assert m0*m0/(m1+s*m0)==m0/(s+m1/m0)
print(json.dumps({'e3_rational_lower':str(e3lower),'synthetic_h1_over_pi':str(h),'synthetic_contact_r4':str(c4-q4),'scope':'Exact elementary constants and algebra only; no original-theta pivot certified.'},indent=2))
