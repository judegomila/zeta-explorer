from mpmath import mp, mpf, quad, zeta, gamma, pi, diff
mp.dps=25
def xi(s): return s*(s-1)/2*pi**(-s/2)*gamma(s/2)*zeta(s)
f=lambda t: xi(mpf(1)/2+1j*t).real
M2=quad(lambda t:(t*f(t))**2,[0,5,10,14,20,30,45,70])
print('f(0)',f(0),'M2',M2)
# xi diagonal D(t)=f'^2-ff''+ff'/t  normalized, sample (should be >0)
for t in (5,14.2,21.5,30,50.3):
    t=mpf(t); f0=f(t); f1=diff(f,t,1); f2=diff(f,t,2)
    print(float(t), float((f1*f1-f0*f2+f0*f1/t)/(f0*f0+f1*f1)))
