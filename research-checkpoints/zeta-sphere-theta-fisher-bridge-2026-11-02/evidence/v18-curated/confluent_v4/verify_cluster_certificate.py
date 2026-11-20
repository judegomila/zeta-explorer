"""Exact-rational reconstruction of the collision-stable cluster certificate."""
import json,hashlib
from fractions import Fraction as F
from math import factorial
from pathlib import Path
root=Path(__file__).resolve().parent
jets={r['derivative']:(F(r['lower']),F(r['upper'])) for r in json.loads((root/'confluent_jet_intervals.json').read_text())['values']}
env={r['derivative']:F(r['upper']) for r in json.loads((root/'local_derivative_bounds.json').read_text())['values']}
assert jets[0][0]>F(314,10000)
assert -F(1536,1000)<jets[2][0]<=jets[2][1]<-F(1477,1000)
assert jets[4][0]>205
assert env[4]<310 and env[6]<101000
alpha=[F(1),F(1,10),F(1,100)];d=F(1,1000)
margin=min(F(314,10000)-F(1536,100000),F(1477,100000),F(205,10000)-F(1536,100000))
assert margin>F(1,200)
M2=F(1536,1000)+310*d*d/2
assert M2<F(1537,1000)
errk={0:F(1537,1000)*d*d/2,1:F(1537,1000)*d,2:310*d*d/2,3:310*d,4:101000*d*d/2}
row=[sum(alpha[i]*alpha[j]*errk[i+j] for j in range(3)) for i in range(3)]
assert max(row)==F(1861,4000000)<F(1,2000)
assert sum(F(59,10)**k/factorial(k) for k in range(16))>300
assert F(127,128)>F(99,100)
assert F(14,13)**4/300<F(1,100)
strip=F(42500*100*13**4,99*300**13)
assert strip<F(1,10**23)
assert max(factorial(k)*16**k*strip for k in range(7))<F(1,10**12)
theta=F(4*10**30*11**24,20**120)/(1-F(1,10**20))
assert theta<F(1,10**80)
fullmargin=F(1,200)-F(1,2000)
assert fullmargin-3*F(1,10**12)>F(1,250)
assert 3*F(1,10**12)/F(1,250)<F(1,10**9)
print('All serialized interval targets and rational constants: PASS')
print('Scaled confluent Gershgorin margin >',F(1,200))
print('Newton perturbation maximum row sum <=',max(row),'<',F(1,2000))
print('Full normalized Newton margin >',fullmargin)
print('Complex-strip exact tail bound:',strip,'<1e-23')
print('Grouped Ewald cutoff N=12; derivative-tail bounds <1e-12 through order6')
print('Uniform relative q<1e-9 for <=3 real nodes of diameter<=1/1000, 0<a<=1/2')
for name in ['certify_confluent_jets.py','certify_local_derivative_bounds.py','confluent_jet_intervals.json','local_derivative_bounds.json']:
 print('SHA256',name,hashlib.sha256((root/name).read_bytes()).hexdigest())
