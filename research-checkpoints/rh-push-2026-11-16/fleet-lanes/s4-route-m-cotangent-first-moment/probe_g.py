import mpmath as mp
mp.mp.dps=25
def c0(h,k):
    return -sum(mp.mpf(m)/k*mp.cot(mp.pi*m*h/k) for m in range(1,k))
def gdef(h,k):
    return c0(h,k)+mp.mpf(k)/h*c0(k%h,h)-1/(mp.pi*h) if h>1 else c0(1,k)-1/mp.pi
def J(x):
    f=lambda t: (lambda s: mp.zeta(s)*mp.zeta(1-s)/mp.sin(mp.pi*s)*mp.power(x,-s))(mp.mpc(-0.5,t))
    return mp.quad(f,mp.linspace(-30,30,31))
for (h,k) in [(3,7),(5,11),(7,23),(2,9),(1,5),(13,17),(40,41)]:
    x=mp.mpf(h)/k
    r=gdef(h,k)+(mp.log(2*mp.pi*x)-mp.euler)/(mp.pi*x)
    j=J(x)
    print(h,k,mp.nstr(r,15),mp.nstr(j,15),mp.nstr(r/j,15))
