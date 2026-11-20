from mpmath import mp, mpf, mpc, cos, arg, sinh, log, laguerre, binomial, factorial, zeta, diff, taylor, gamma, pi, primepi, nsum, inf, exp
mp.dps = 30
# (1) quadruple identity and lower bound
for (b,g,n) in [(mpf('0.875'),mpf(50),7000),(mpf('0.7'),mpf(20),333),(mpf('0.99'),mpf(15),100)]:
    rho=mpc(b,g); zs=[1-1/r for r in (rho,rho.conjugate(),1-rho,1-rho.conjugate())]
    direct=sum(1-z**n for z in zs).real
    z=zs[0]; r=abs(z); ph=arg(z)
    form=4*(1-cos(n*ph))-2*(r**n+r**(-n)-2)*cos(n*ph)
    lowb=-8*sinh(n*(2*b-1)/(4*g*g))**2
    print('quad', mp.nstr(direct,12), mp.nstr(form,12), 'corr>=', mp.nstr(-2*(r**n+r**(-n)-2)*cos(n*ph),8), 'bound', mp.nstr(lowb,8), 'phi in [1/g-1/(3g^3),1/g]:', (1/g-1/(3*g**3))<=ph<=1/g)
# (2) Laguerre form of the arithmetic part at base a: n [z^n] log zeta(s(z)) = -(2a-1) sum Lambda(m) m^-a L^{(1)}_{n-1}((2a-1) log m)
a=mpf(3)
def lz(z): return log(zeta(a+(2*a-1)*z/(1-z)))
co=taylor(lz,0,4)
def mang(m):
    p=2
    while p*p<=m:
        if m%p==0:
            while m%p==0: m//=p
            return log(p) if m==1 else mpf(0)
        p+=1
    return log(m)
for n in (1,2,3,4):
    s=-(2*a-1)*sum(mang(m)*mpf(m)**(-a)*laguerre(n-1,1,(2*a-1)*log(m)) for m in range(2,4000))
    print('laguerre n',n, mp.nstr(n*co[n],12), mp.nstr(s,12))
