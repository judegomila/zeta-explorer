"""Exact rational reconstruction of fixed-node/all-shift grouped certificate."""
import json
from fractions import Fraction as F
from pathlib import Path
root=Path(__file__).resolve().parent
g=json.loads((root/'grouped_gram_intervals.json').read_text())['values']
m=json.loads((root/'shift_moment_intervals.json').read_text())['values']
def bounds(row):return F(row['lower']),F(row['upper'])
b=[bounds(row) for row in g]
assert b[0][0]>F(31,1000)
assert max(abs(b[1][0]),abs(b[1][1]))<F(1,125)
assert max(abs(b[2][0]),abs(b[2][1]))<F(1,1000)
assert all(0<bounds(row)[0]<=bounds(row)[1]<F(3,2500) for row in m)
axis_tail=F(16000*7**6,20**49)/(1-F(1,10**18))
assert axis_tail<F(1,10**50)
axis_spatial=F(6*8100*32**6,1)/(3-F(6,32))/400**16
interior_spatial=F(9*56*6**4*32**6,1)/(6-F(6,32))/400**32
assert axis_spatial+interior_spatial<F(1,10**24)
assert 150*F(44,7)**3<37500
epsilon_upper=F(37500,10**8)/(1-F(1,100))
assert epsilon_upper==F(1,2640)<F(1,2500)
eps=F(1,2500)
center=F(31,1000)-2*F(1,125)
shift_lipschitz=F(4,3)*F(3,2500)
shift_entry=shift_lipschitz*F(1,4)
assert shift_entry==eps
full_margin=center-3*eps-3*shift_entry
candidate_margin=full_margin-3*eps
q=3*eps/candidate_margin
assert center==F(3,200)
assert full_margin==F(63,5000)
assert candidate_margin==F(57,5000)
assert q==F(2,19)<1
print('All saved interval targets and rational arithmetic/spatial tail bounds: PASS')
print('Elementary epsilon bound:',epsilon_upper,'<',eps)
print('Fixed real nodes: 0,1/4,1/2; all complex coefficient vectors')
print('Uniform shifts: 0<a<=1/2')
print('Normalized candidate minimum eigenvalue >',candidate_margin)
print('Exact normalized remainder norm <',3*eps)
print('Relative bound E >= -q D, q=',q)
print('Full normalized Gram minimum eigenvalue >',full_margin)
print('No arbitrary-node/global-positive-definiteness conclusion.')
