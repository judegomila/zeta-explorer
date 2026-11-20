"""Exact rational checks for the synthesis identities and false shortcuts."""
from fractions import Fraction as F
from pathlib import Path
import json, hashlib

def tr(A):return list(map(list,zip(*A)))
def eye(n):return [[F(i==j) for j in range(n)] for i in range(n)]
def add(A,B):return [[x+y for x,y in zip(a,b)] for a,b in zip(A,B)]
def scale(A,c):return [[c*x for x in a] for a in A]
def sub(A,B):return add(A,scale(B,-1))
def mul(A,B):return [[sum((x*y for x,y in zip(a,b)),F(0)) for b in tr(B)] for a in A]
def inv(A):
    n=len(A);W=[a[:]+b for a,b in zip(A,eye(n))]
    for j in range(n):
        k=next(k for k in range(j,n) if W[k][j]);W[j],W[k]=W[k],W[j]
        p=W[j][j];W[j]=[x/p for x in W[j]]
        for i in range(n):
            if i!=j:
                p=W[i][j];W[i]=[x-p*y for x,y in zip(W[i],W[j])]
    return [a[n:] for a in W]
def pivots(A):
    W=[a[:] for a in A];out=[]
    for j in range(len(W)):
        p=W[j][j];out.append(p)
        if not p:raise ArithmeticError('singular pivot')
        for i in range(j+1,len(W)):
            for k in range(j+1,len(W)):
                W[i][k]-=W[i][j]*W[j][k]/p
    return out
def psd(A):
    # Exact symmetric elimination with correct handling of zero pivots.
    W=[a[:] for a in A]
    for j in range(len(W)):
        p=W[j][j]
        if p<0:return False
        if p==0:
            if any(W[i][j] for i in range(j+1,len(W))):return False
            continue
        for i in range(j+1,len(W)):
            for k in range(j+1,len(W)):
                W[i][k]-=W[i][j]*W[j][k]/p
    return True
def xpoly(w):return ((w-F(3,10))**2+4)*((w+F(3,10))**2+4)

def main():
    beta=F(3,8); a=F(1,10);xs=[F(9),F(17,2),F(25,3)]
    ys=[xpoly(x-a)/xpoly(x+a) for x in xs]
    P0=[[(1-y*z)/(x+t) for t,z in zip(xs,ys)] for x,y in zip(xs,ys)]
    PB=[[(1-y*z)/(x+t-2*beta) for t,z in zip(xs,ys)] for x,y in zip(xs,ys)]
    C=[[1/(x+y) for y in xs] for x in xs]
    debt=[[2*beta*C[i][j]*PB[i][j] for j in range(3)] for i in range(3)]
    assert P0==sub(PB,debt)
    assert all(x>0 for x in pivots(PB)) and psd(debt)
    old=pivots(P0);assert old[:2][0]>0 and old[1]>0 and old[2]<0
    assert old[2]==-F(100524667776910903125,22083581478306370241011846411414)
    assert F(3,10)<beta and F(1,2)+beta==F(7,8)
    assert 2*beta==F(3,4) and 1/(2*(1+beta))==F(4,11)
    records=[]
    for seed in range(1,13):
        U=[[F((i+1)*(j+2)+seed*(i==j)+(i==j)*7) for j in range(4)] for i in range(4)]
        K=add(mul(U,tr(U)),eye(4));b=F(seed+1,7)
        D=add(scale(eye(4),b),K)
        Z=[[F((i+1)**j+(seed if i==j else 0)) for j in range(2)] for i in range(4)]
        A=mul(tr(Z),mul(K,Z));V=mul(K,Z)
        M=add(A,scale(mul(tr(V),V),1/b))
        Upper=sub(scale(eye(4),1/b),scale(mul(V,mul(inv(M),tr(V))),1/b**2))
        assert psd(sub(Upper,inv(D)))
        R=[[F((i+seed+2)*(j+1)+(i==j)) for j in range(3)] for i in range(4)]
        B=mul(tr(V),R);T=scale(mul(inv(M),B),1/b)
        defect=sub(R,mul(V,T))
        penalty=add(scale(mul(tr(defect),defect),1/b),mul(tr(T),mul(A,T)))
        assert penalty==mul(tr(R),mul(Upper,R))
        gain=sub(scale(mul(tr(R),R),1/b),penalty)
        assert psd(gain)
        records.append({'model':seed,'inverse_upper_bound':True,'variational_identity':True,'positive_gain':True})
    # A compressed inverse is generally a LOWER comparison, not the needed upper.
    D=[[F(2),F(1)],[F(1),F(2)]]
    assert inv(D)[0][0]==F(2,3)>F(1,2)
    root=Path(__file__).resolve().parent
    out={'status':'PASS','directional_models':records,
         'self_control':{'beta':'3/8','zero_displacement':'3/10','shift':'1/10',
                         'shifted_pick_positive':True,'original_pick_third_pivot':str(old[2]),
                         'signed_kernel_identity':True},
         'weighted_energy_constant':'4/11','weighted_energy_exponent':'3/4',
         'compressed_inverse_shortcut_rejected':True,
         'source_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
         'scope':'Finite algebra checks; analytic transfer proofs are in the synthesis note. No RH proof or numerical certification of an infinite bound.'}
    (root/'exact-results.json').write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps(out,indent=2))

if __name__=='__main__':
    if not __debug__:raise RuntimeError('Do not disable assertions')
    main()
