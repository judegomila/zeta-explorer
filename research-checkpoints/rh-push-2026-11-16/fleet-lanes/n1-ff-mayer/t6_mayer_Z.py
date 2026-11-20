"""Over Z: Mayer transfer operator L_s f(x)=sum_{a>=1}(x+a)^(-2s) f(1/(x+a)) in the basis (x-1)^k, truncated at NN.
[L_s]_{ik} = sum_{j<=k} C(k,j)(-1)^(k-j+i) (2s+j)_i/i! (zeta(2s+j+i)-1).
Test: zeros in s of det(1 - e^{i theta} L_s) followed from s=rho/2 (theta=0).  mpmath, 80 digits."""
import sys, mpmath as mp
mp.mp.dps=80
NN=int(sys.argv[1]) if len(sys.argv)>1 else 36
def Lmat(s,NN):
    zt=[mp.zeta(2*s+t)-1 for t in range(2*NN+1)]
    A=mp.matrix(NN,NN)
    for k in range(NN):
        bk=[mp.binomial(k,j)*(-1)**(k-j) for j in range(k+1)]
        for i in range(NN):
            acc=mp.mpc(0)
            for j in range(k+1):
                acc+=bk[j]*mp.rf(2*s+j,i)*zt[j+i]
            A[i,k]=acc*(-1)**i/mp.factorial(i)
    return A
def F(s,lam,NN=NN):
    return mp.det(mp.eye(NN)-lam*Lmat(s,NN))
def newton(s,lam,NN=NN,steps=25,tol=mp.mpf(10)**(-25)):
    for _ in range(steps):
        h=mp.mpf(10)**(-20)
        f=F(s,lam,NN); df=(F(s+h,lam,NN)-F(s-h,lam,NN))/(2*h)
        ds=f/df; s=s-ds
        if abs(ds)<tol: break
    return s
rho1=mp.zetazero(1); rho2=mp.zetazero(2)
print("truncation NN =",NN)
print("check 1: |det(1-L_s)| at s=1 :",mp.nstr(abs(F(mp.mpf(1),1)),5),"  at s=rho1/2:",mp.nstr(abs(F(rho1/2,1)),5),"  at s=rho1/2+0.01:",mp.nstr(abs(F(rho1/2+mp.mpf('0.01'),1)),5))
s0=newton(rho1/2+mp.mpf('0.003'),1)
print("check 2: Newton zero of det(1-L_s) near rho1/2:",mp.nstr(s0,20),"  rho1/2 =",mp.nstr(rho1/2,20))
if len(sys.argv)>2 and sys.argv[2]=='conv':
    for n2 in (NN-8,NN-4):
        print("   truncation",n2,":",mp.nstr(newton(rho1/2+mp.mpf('0.003'),1,NN=n2),20))
print("lambda-rotation: zero s(theta) of det(1 - e^{i theta} L_s) continued from rho_1/2 and rho_2/2")
for name,start in (("rho1/2",rho1/2),("rho2/2",rho2/2)):
    s=start
    for num in range(0,9):
        th=mp.pi*num/64
        lam=mp.e**(1j*th)
        s=newton(s,lam)
        print(f"   {name}: theta={num}/64 pi  s = {mp.nstr(s,14)}   Re s - 1/4 = {mp.nstr(s.real-mp.mpf(1)/4,6)}")
        sys.stdout.flush()
