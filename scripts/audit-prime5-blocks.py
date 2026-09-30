"""Exact block algebra and the geometry of a possible next prime-7 step."""
import argparse
from fractions import Fraction as Q
from hashlib import sha256
import json
from pathlib import Path
from flint import arb, acb, ctx


def eye(n): return [[Q(i==j) for j in range(n)] for i in range(n)]
def tr(A): return list(map(list,zip(*A)))
def mm(A,B): return [[sum(x*y for x,y in zip(row,col)) for col in zip(*B)] for row in A]
def add(A,B): return [[x+y for x,y in zip(a,b)] for a,b in zip(A,B)]
def sc(A,c): return [[c*x for x in row] for row in A]
def inv(A):
    n=len(A); M=[row[:]+e for row,e in zip(A,eye(n))]
    for k in range(n):
        pivot=next(i for i in range(k,n) if M[i][k])
        M[k],M[pivot]=M[pivot],M[k]
        v=M[k][k]; M[k]=[x/v for x in M[k]]
        for i in range(n):
            if i!=k:
                v=M[i][k]; M[i]=[x-v*y for x,y in zip(M[i],M[k])]
    return [row[n:] for row in M]


def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--output'); args=parser.parse_args()
    ctx.prec=192
    I=eye(6); F=[[Q(0)]*6 for _ in range(6)]
    for i,j in [(0,4),(1,5)]: F[i][j]=F[j][i]=Q(1)
    E=mm(F,F); assert mm(E,E)==E and mm(E,F)==F
    d,c=Q(2),Q(3,4)
    D=add(sc(I,d),sc(F,-c))
    inverse=add(add(sc(I,1/d),sc(E,d/(d*d-c*c)-1/d)),sc(F,c/(d*d-c*c)))
    assert mm(D,inverse)==I and inverse==inv(D)
    wrong=add(add(sc(I,1/d),sc(E,d/(d*d-c*c)-1/d)),sc(F,-c/(d*d-c*c)))
    assert mm(D,wrong)!=I
    U=[[Q(0)]*3 for _ in range(6)]
    for j in range(3): U[2*j][j],U[2*j+1][j]=Q(3,5),Q(4,5)
    assert mm(tr(U),U)==eye(3)
    G=mm(mm(tr(U),inverse),U); GI=inv(G)
    z=[[Q(1)],[-Q(2)],[Q(3)]]
    star=mm(mm(inverse,U),mm(GI,z))
    assert mm(tr(U),star)==z
    k=[[Q(4)],[-Q(3)],[Q(0)],[Q(0)],[Q(0)],[Q(0)]]
    assert mm(tr(U),k)==[[0],[0],[0]]
    h=add(star,k)
    assert mm(mm(tr(h),D),h)==add(mm(mm(tr(z),GI),z),mm(mm(tr(k),D),k))
    l5,l7,l8=arb(5).log(),arb(7).log(),arb(8).log()
    c5,c7=l5/arb(5).sqrt(),l7/arb(7).sqrt()
    rho=(c7+(c7*c7+4*c5*c5).sqrt())/2
    old=acb(arb(1)/4,200).digamma().real-arb.pi().log()-sum(2*arb(p).log()/arb(n).sqrt() for n,p in [(2,2),(3,3),(4,2)])
    assert l8<2*l7-l5 and l8<2*l5
    assert rho<arb(6)/5<old
    identity=rho*rho-c7*rho-c5*c5
    assert identity.contains(0) and abs(identity)<arb('1e-40')
    result={'status':'passed','scope':'exact edge inverse and finite-rank lemma algebra; prime-7 geometry only, not a positivity certificate',
            'checks':['F^2=E and EF=F','exact inverse','wrong sign rejected','orthonormal inclusion',
                      'constrained minimizer','orthogonal energy identity','prime-7 chain geometry','prime-7 norm and old tail margin'],
            'precision_bits':ctx.prec,'next_chain_norm':str(rho),'old_tail_floor_T400':str(old),
            'prime7_positivity_certified':False,'script_sha256':sha256(Path(__file__).read_bytes()).hexdigest()}
    payload=json.dumps(result,indent=2)+'\n'
    if args.output: Path(args.output).write_text(payload)
    print(payload)


if __name__=='__main__': main()
