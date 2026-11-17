"""Over Z: check [(1-L_s)^{-1} 1](x) = E#(x,s)/zeta(2s) with
E#(x,s) = zeta(2s)(1+(x+1)^(-2s)) + 2 sum_{1<=c<d}(c x+d)^(-2s), and the value at x=0: 2 zeta(2s-1)/zeta(2s)."""
import mpmath as mp
mp.mp.dps=60
def Lmat(s,NN):
    zt=[mp.zeta(2*s+t)-1 for t in range(2*NN+1)]
    A=mp.matrix(NN,NN)
    for k in range(NN):
        bk=[mp.binomial(k,j)*(-1)**(k-j) for j in range(k+1)]
        for i in range(NN):
            A[i,k]=sum(bk[j]*mp.rf(2*s+j,i)*zt[j+i] for j in range(k+1))*(-1)**i/mp.factorial(i)
    return A
NN=30
for s in (mp.mpf(3), mp.mpc(2,1), mp.mpc('0.8','2.0'), mp.mpc('0.4','3.0')):
    A=Lmat(s,NN); e=mp.matrix(NN,1); e[0]=1
    v=mp.lu_solve(mp.eye(NN)-A,e)
    at0=sum(v[i]*(-1)**i for i in range(NN))
    pred=2*mp.zeta(2*s-1)/mp.zeta(2*s)
    line=f"s={mp.nstr(s,6)}: [(1-L_s)^-1 1](0) = {mp.nstr(at0,18)}   2 zeta(2s-1)/zeta(2s) = {mp.nstr(pred,18)}   |diff| = {mp.nstr(abs(at0-pred),3)}"
    if s==3:
        x=mp.mpf('0.5'); atx=sum(v[i]*(x-1)**i for i in range(NN))
        E=mp.zeta(2*s)*(1+(x+1)**(-2*s))+2*mp.nsum(lambda d: mp.fsum((c*x+d)**(-2*s) for c in range(1,int(d))),[2,mp.inf])
        line+=f"\n      x=0.5: resolvent {mp.nstr(atx,15)}  E#/zeta(2s) {mp.nstr(E/mp.zeta(2*s),15)}"
    print(line)
