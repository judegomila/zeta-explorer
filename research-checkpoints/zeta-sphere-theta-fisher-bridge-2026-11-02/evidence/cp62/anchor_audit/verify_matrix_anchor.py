#!/usr/bin/env python3
"""Current original exact Gaussian-rational controls; no imported producer."""
from fractions import Fraction as F
from pathlib import Path
import hashlib
import json

def z(x=0,y=0): return (F(x),F(y))
def za(a,b): return (a[0]+b[0],a[1]+b[1])
def zn(a): return (-a[0],-a[1])
def zm(a,b): return (a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0])
def zc(a): return (a[0],-a[1])
def zi(a):
    q=a[0]*a[0]+a[1]*a[1]
    assert q
    return (a[0]/q,-a[1]/q)
def mat(a): return [[v if isinstance(v,tuple) else z(v) for v in row] for row in a]
def add(a,b): return [[za(x,y) for x,y in zip(ar,br)] for ar,br in zip(a,b)]
def neg(a): return [[zn(v) for v in row] for row in a]
def sub(a,b): return add(a,neg(b))
def scale(a,q): return [[zm(v,z(q)) for v in row] for row in a]
def adj(a): return [[zc(a[j][i]) for j in range(len(a))] for i in range(len(a[0]))]
def mul(a,b):
    out=[]
    for ar in a:
        row=[]
        for j in range(len(b[0])):
            v=z()
            for k in range(len(b)):v=za(v,zm(ar[k],b[k][j]))
            row.append(v)
        out.append(row)
    return out
def trace(a):
    v=z()
    for i in range(len(a)):v=za(v,a[i][i])
    return v
def inv(a):
    assert len(a)==len(a[0])==2
    d=za(zm(a[0][0],a[1][1]),zn(zm(a[0][1],a[1][0])))
    return [[zm(v,zi(d)) for v in row] for row in [[a[1][1],zn(a[0][1])],[zn(a[1][0]),a[0][0]]]]
def positive2(a):
    if a!=adj(a):return False
    d=za(zm(a[0][0],a[1][1]),zn(zm(a[0][1],a[1][0])))
    return a[0][0][1]==0 and a[0][0][0]>0 and d[1]==0 and d[0]>0

rows=[]
def ck(name,ok):
    if not ok:raise AssertionError(name)
    rows.append({'name':name,'status':'PASS'})
I=mat([[1,0],[0,1]]);Z=scale(I,0);J=mat([[0,1],[-1,0]])
B1=add(scale(I,F(1,2)),J);B2=sub(scale(I,F(1,2)),J)
ck('J_conjugate_transpose',adj(J)==neg(J))
ck('J_square',mul(J,J)==neg(I))
ck('complete_B',add(B1,B2)==I)
ck('both_normal_Gram_matrices',all(mul(b,adj(b))==mul(adj(b),b)==scale(I,F(5,4)) for b in [B1,B2]))
ck('complete_positive_Schur',sub(scale(I,2),mul(adj(I),I))==I)
P=scale(I,F(1,2));R=I
L1=sub(I,mul(adj(B1),mul(inv(P),B1)));L2=sub(I,mul(adj(B2),mul(inv(P),B2)))
E1=sub(B1,mul(P,R));E2=sub(B2,mul(P,R))
V=add(mul(adj(E1),mul(inv(P),E1)),mul(adj(E2),mul(inv(P),E2)))
ck('equal_anchor_local_residuals',L1==L2==scale(I,F(-3,2)))
ck('equal_anchor_complete_signed_sum',add(L1,L2)==scale(I,-3))
ck('equal_anchor_centered_blocks',E1==J and E2==neg(J))
ck('equal_anchor_full_covariance',V==scale(I,4))
ck('signed_covariance_exact_compensation',add(add(L1,L2),V)==I)
ck('sharp_trace_cost',trace(sub(scale(I,2),add(L1,L2)))==z(10))
ck('sharp_covariance_trace',trace(V)==z(8))
for lam in [F(1,3),F(1,2)]:
    ck('scalar_spectral_gap_'+str(lam),1/lam+1/(1-lam)-4==(2*lam-1)**2/(lam*(1-lam)))
# A genuinely complex Hermitian anchor: no restriction to real diagonal P.
P1=mat([[F(1,3),z(0,F(1,6))],[z(0,F(-1,6)),F(1,2)]])
P2=sub(I,P1)
ck('complex_anchors_positive_and_complete',positive2(P1) and positive2(P2) and add(P1,P2)==I)
ck('complex_anchor_does_not_commute_with_B1',mul(P1,B1)!=mul(B1,P1))
cost=add(mul(adj(B1),mul(inv(P1),B1)),mul(adj(B2),mul(inv(P2),B2)))
ck('complex_trace_cyclic_identity',trace(cost)==zm(z(F(5,4)),trace(add(inv(P1),inv(P2)))))
ck('complex_strict_trace_obstruction',trace(cost)[1]==0 and trace(cost)[0]>10)
# Nonidentity integrated A, rectangular complex B, noncommuting anchors.
Q1=mat([[2,z(0,F(1,3))],[z(0,F(-1,3)),1]])
Q2=mat([[1,F(1,5)],[F(1,5),F(3,2)]])
D1=mat([[z(1,1)],[F(2,3)]]);D2=mat([[F(-1,4)],[z(2,-1)]])
A=add(Q1,Q2);B=add(D1,D2);RR=mul(inv(A),B)
ck('nonidentity_noncommuting_positive_anchors',positive2(Q1) and positive2(Q2) and mul(Q1,Q2)!=mul(Q2,Q1) and A!=I)
EE1=sub(D1,mul(Q1,RR));EE2=sub(D2,mul(Q2,RR))
ck('rectangular_centering',add(EE1,EE2)==mat([[0],[0]]))
local=sub(mat([[5]]),add(mul(adj(D1),mul(inv(Q1),D1)),mul(adj(D2),mul(inv(Q2),D2))))
cov=add(mul(adj(EE1),mul(inv(Q1),EE1)),mul(adj(EE2),mul(inv(Q2),EE2)))
total=sub(mat([[5]]),mul(adj(B),mul(inv(A),B)))
ck('rectangular_full_covariance_identity',total==add(local,cov))
ck('rectangular_covariance_nonnegative_real',cov[0][0][1]==0 and cov[0][0][0]>=0)
actualA=scale(I,3)
correction=mul(adj(B),mul(sub(inv(A),inv(actualA)),B))
actualS=sub(mat([[5]]),mul(adj(B),mul(inv(actualA),B)))
ck('integrated_metric_mismatch_not_zero',correction!=mat([[0]]))
ck('integrated_metric_mismatch_exact',actualS==add(add(local,cov),correction))
# A singular pseudoinverse without the range gate is not a block-PSD test.
singular=mat([[1,0],[0,0]])
ck('singular_anchor_range_failure',mul(sub(I,mul(singular,singular)),B1)!=Z)

base=Path(__file__).resolve().parent
bindings=[]
for name in ['matrix_anchor_obstruction.md','verify_matrix_anchor.py']:
    b=(base/name).read_bytes();bindings.append({'name':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
out={'status':'PASS','controls':len(rows),'method':'Current original exact Fraction arithmetic over Gaussian rationals; finite identities only.','scope':'Synthetic matrix-anchor obstruction and exact covariance/mismatch identities. Universal quantifiers rely on the accompanying analytic proof; no actual theta/Weil realization, imported source replay or global sign is asserted.','checks':rows,'source_bindings':bindings}
(base/'matrix_anchor_controls.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({'status':'PASS','controls':len(rows)}))
