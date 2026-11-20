# Arb certificate: explicit rational test vector w (Levinson predictor, rounded) with w^T T_N w < 0 for DH at node a.
import sys; sys.path.insert(0,'.')
from toep import series_L
from flint import arb, ctx, fmpz
which,a,k,prec = sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
g = series_L(which,a,k,prec); ctx.prec=prec
c = [g[0]] + [x/2 for x in g[1:]]
cm=[x.mid() for x in c]
aco=[arb(1)]; E=cm[0]
for kk in range(1,k+1):
    acc=sum((aco[j]*cm[kk-j]).mid() for j in range(kk)).mid(); al=(-acc/E).mid()
    aco=[arb(1)]+[(aco[j]+al*aco[kk-j]).mid() for j in range(1,kk)]+[al]; E=(E*(1-al*al)).mid()
w=[x.mid() for x in aco]            # exact dyadic numbers
# ball evaluation of q = sum_{i,j} w_i w_j c_{|i-j|} with the ball coefficients c
q=arb(0)
for i in range(k+1):
    row=arb(0)
    for j in range(k+1): row+=w[j]*c[abs(i-j)]
    q+=w[i]*row
nrm=sum(x*x for x in w)
print(which,"a=",a,"order N=",k+1,"prec",prec,"| max rel radius of c_k:",max(float((x.rad()/abs(x.mid())).log()/arb(10).log()) for x in c if x.mid()!=0),"(log10)")
print("  q = w^T T_N w =", q.str(12), " ; q<0 certified:", bool(q<0), " ; q/|w|^2 =", (q/nrm).str(8), "; c0=",c[0].str(12))
