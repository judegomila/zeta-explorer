"""Reconstruct exact window deduction from serialized certified intervals."""
import json
from pathlib import Path
from fractions import Fraction as F
p=Path(__file__).resolve().parent
rows={r['name']:(F(r['lower']),F(r['upper'])) for r in json.loads((p/'zero_window_intervals.json').read_text())['values']}
assert -F(1,10**7)<rows['Xi'][0]<=rows['Xi'][1]<0
assert -F(139,100000)<rows['Xi_prime'][0]<=rows['Xi_prime'][1]<-F(138,100000)
assert 0<rows['Xi_second'][0]<=rows['Xi_second'][1]<F(161,100000)
assert 0<rows['weighted_M3'][0]<=rows['weighted_M3'][1]<F(1,125)
r=F(7,50);delta=F(1,16);A=F(1,8)
assert r*r>delta*delta+A*A
B2=F(161,100000)+F(1,125)*r
m=F(138,100000)-B2*r
B0=F(1,10**7)+F(139,100000)*r+B2*r*r/2
kappa=m*m-B2*B0
assert kappa==F(19551771,50000000000000)>0
d=F(1,8192);center=F(7237,512)
left_lower=-F(1,10**7)+d*(F(138,100000)-B2*d)
assert left_lower>0
print('Serialized interval target checks: PASS')
print('Normalized shear lower bound:',kappa,'=',float(kappa))
print('Height center:',center,'; half-width:',delta,'; shifts: 0<a<=',A)
print('Unique simple real zero interval:',center-d,center)
print('Positive lower bound for Xi at left zero-bracket endpoint:',left_lower)
print('This verifies the exact deduction, not a replacement for the integration proof.')
