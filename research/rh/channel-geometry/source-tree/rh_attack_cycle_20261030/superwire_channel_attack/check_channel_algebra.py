"""Exact synthetic sanity checks, NOT an actual Weil/spectral certificate."""
from fractions import Fraction as Q
import json
from pathlib import Path

def mul(a, b):
    return [[sum(x*y for x, y in zip(row, col)) for col in zip(*b)] for row in a]

def transpose(a):
    return [list(row) for row in zip(*a)]

def add(a, b):
    return [[x+y for x, y in zip(ar, br)] for ar, br in zip(a,b)]

def scale(a, s):
    return [[s*x for x in row] for row in a]

def det2(a):
    return a[0][0]*a[1][1]-a[0][1]*a[1][0]

plus = [[Q(1),Q(1)],[Q(1),Q(1)]]
phase = [[Q(1),Q(1)],[Q(1),Q(-1)]]
assert [[x*x/3 for x in row] for row in plus] == [[x*x/3 for x in row] for row in phase]
gp = scale(mul(transpose(plus),plus),Q(1,3))
gm = scale(mul(transpose(phase),phase),Q(1,3))
identity = [[Q(1),Q(0)],[Q(0),Q(1)]]
qp = add(identity,scale(gp,Q(-1)))
qm = add(identity,scale(gm,Q(-1)))
assert det2(qp)==Q(-1,3)
assert qm==scale(identity,Q(1,3))
assert mul(gp,[[Q(1)],[Q(1)]])==[[Q(4,3)],[Q(4,3)]]
assert mul(gp,[[Q(1)],[Q(-1)]])==[[Q(0)],[Q(0)]]

schur = []
for bridge in [Q(1),Q(2)]:
    d,e=Q(2),Q(1)
    h=[[d,bridge],[bridge,e]]
    lower=[[Q(1),Q(0)],[bridge/d,Q(1)]]
    diag=[[d,Q(0)],[Q(0),e-bridge*bridge/d]]
    assert mul(mul(lower,diag),transpose(lower))==h
    assert det2(h)==d*(e-bridge*bridge/d)
    schur.append({"bridge":str(bridge),"schur":str(e-bridge*bridge/d),"determinant":str(det2(h))})

exponents=[]
for eps,k in [(Q(1),3),(Q(1,2),3),(Q(1,10),11),(Q(3,2),2)]:
    first,second=1-k*eps,3-eps-2*k
    assert k>1 and first<0 and second<0
    exponents.append({"epsilon":str(eps),"K":k,"first":str(first),"second":str(second)})

out={
 "status":"PASS",
 "scope":"Exact synthetic algebra only; no actual spectral, prime, carrier or endpoint experiment.",
 "same_intensity_gram_eigenvalues":{"coherent":["4/3","0"],"opposite_phase":["2/3","2/3"]},
 "schur_factorizations":schur,
 "fixed_epsilon_row_exponents":exponents,
}
path=Path(__file__).with_name('CHANNEL_ALGEBRA_EXACT_CHECKS.json')
path.write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
