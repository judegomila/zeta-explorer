"""Exploratory high precision check, NOT interval evidence."""
import mpmath as m
m.mp.dps=70

def P(a,t): return 16*(t*t+(.5+a)**2)*(t*t+(.5-a)**2)
def g(p,t): return m.pi**(-p)*abs(m.gamma((p+1j*t)/2))**2

def low(a,t):
    p=m.mpf('.5')+a
    summ=m.mpc(0); term=m.mpc(1)
    for j in range(120):
        summ+=term*(1/(p+2*j-1j*t)+1/(1-p+2*j-1j*t))
        term*=m.pi**2/((j+1)*(j+1-1j*t))
    return m.re(m.gamma(1j*t)*m.pi**(-1j*t)*summ)
def lam(s): return m.pi**(-s/2)*m.gamma(s/2)*m.zeta(s)
for t in [100,200]:
    for a in [m.mpf('.001'),m.mpf('.25'),m.mpf('.5')]:
        parent=m.diff(lambda b:P(b,t)*(g(m.mpf('.5')+b,t)+g(m.mpf('.5')-b,t)),a)/(128*a)
        corr=-m.diff(lambda b:P(b,t)*low(b,t),a)/(32*a)
        axis=m.re((1-2j*t)*lam(2j*t))/2
        scale=t**3*m.exp(-m.pi*t/2)
        print('tau,a,parent/scale,corr/scale,axis/scale,total/scale',t,a,*[m.nstr(v/scale,18) for v in [parent,corr,axis,parent+corr+axis]])
