"""Exploratory only: non-interval full-xi Green spectral ratios."""
import mpmath as m
m.mp.dps=25
A=m.mpf('.75'); a=m.mpf('.25')
def W(b,t):
 s=m.mpf('.5')+b+1j*t
 z=m.zeta(s); dz=m.zeta(s,derivative=1)
 g=s*(s-1)*m.power(m.pi,-s/2)*m.gamma(s/2)/2
 gp=1/s+1/(s-1)-m.log(m.pi)/2+m.digamma(s/2)/2
 return m.re(g*(dz+gp*z)*m.conj(g*z))
def P(x):return m.sin(m.pi*a/A)/(2*A*(m.cosh(m.pi*x/A)+m.cos(m.pi*a/A)))
print('NONCERTIFIED quadrature, a=.25 A=.75',flush=True)
for t in [0,10,30,60]:
 pts=sorted(set([-m.inf,-20,0,20,t-20,t-5,t,t+5,t+20,m.inf]))
 scale=m.exp(m.pi*t/2)
 B=m.quad(lambda s:scale*P(t-s)*W(A,s),pts)/scale
 w=W(a,t)
 print(t,'W/B=',m.nstr(w/B,16),'K/B=',m.nstr(1-w/B,16),flush=True)
