# cross-check of the two evaluation paths (partial fractions with weighted moments vs series in a with unweighted moments)
import sys; sys.path.insert(0,'.')
from gates_arb import *
name,astr,K,bits,prec,t=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]),sys.argv[6]
ctx.prec=prec; spec=Spec(name); aq=Q(astr)
P1,S1=basis_jets(spec,aq,K,t,bits); P2,S2=basis_jets_ser(spec,aq,K,t,bits)
worst=0; ok=True
for i in range(-2,K+1):
    for d in range(5):
        for X,Y in ((P1,P2),(S1,S2)):
            ok = ok and X[i][d].overlaps(Y[i][d])
print(name,"a=",astr,"t=",t,"K=",K,"all basis jets overlap:",ok)
for i in (1,K//2,K): print("  Phi_%d: pf %s | ser %s ;  Psi_%d': pf %s | ser %s"%(i,P1[i][0].str(15),P2[i][0].str(15),i,S1[i][1].str(15),S2[i][1].str(15)))
