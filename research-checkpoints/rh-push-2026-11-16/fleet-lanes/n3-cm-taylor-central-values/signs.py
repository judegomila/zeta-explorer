import json
from fractions import Fraction
d=[int(x) for x in json.load(open("dn_300.json"))]
s=''.join('+' if x>0 else '-' for x in d)
print(s)
print("n<=300: positive",s.count('+'),"negative",s.count('-'), "zeros", sum(1 for x in d if x==0))
# runs
import itertools
runs=[len(list(g)) for k,g in itertools.groupby(s)]
print("max run",max(runs),"number of runs",len(runs))
# autocorrelation of signs
sg=[1 if x>0 else -1 for x in d]
for lag in range(1,13):
    print("lag",lag,"corr %.3f"%(sum(sg[i]*sg[i+lag] for i in range(len(sg)-lag))/(len(sg)-lag)))
# residues
for p in (3,5,7,8,16):
    print("mod",p,[x%p for x in d[:24]])
# Hankel determinants (exact) of m_k = d(k), d(k)/(2k)!, and shifted
from math import factorial
def det(M):
    n=len(M); M=[r[:] for r in M]; D=Fraction(1)
    for i in range(n):
        p=next((r for r in range(i,n) if M[r][i]!=0),None)
        if p is None: return Fraction(0)
        if p!=i: M[i],M[p]=M[p],M[i]; D=-D
        D*=M[i][i]
        for r in range(i+1,n):
            f=M[r][i]/M[i][i]
            if f: M[r]=[a-f*b for a,b in zip(M[r],M[i])]
    return D
for name,seq in (("d(k)",[Fraction(x) for x in d]),("d(k)/(2k)!",[Fraction(x,factorial(2*k)) for k,x in enumerate(d)]),("d(k)/k!",[Fraction(x,factorial(k)) for k,x in enumerate(d)]),("d(k)/(4k)!",[Fraction(x,factorial(4*k)) for k,x in enumerate(d)])):
    for sh in (0,1):
        sg_=[]
        for N in range(1,9):
            D=det([[seq[i+j+sh] for j in range(N)] for i in range(N)])
            sg_.append('+' if D>0 else ('-' if D<0 else '0'))
        print("Hankel signs",name,"shift",sh,''.join(sg_))
