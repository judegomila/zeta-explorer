"""Authored numerical/algebra sanity checks; analytic proof is separate."""
import mpmath as m
m.mp.dps=45
L=2*m.pi;p=m.mpf('4.5');A=32*m.pi**4*L**(-p)
def f(u):return 8*m.pi**2*m.exp(9*u/2)*(1-3*m.exp(-2*u)/(2*m.pi))*m.exp(-m.pi*m.exp(2*u))
def I(s,v):
 q=p+s;c=m.cosh(2*v)
 return A*L**(-s)*(m.gamma(q)*c**(-q)+(21-6*q)*m.gamma(q-2)*c**(-q+2))
for a in [m.mpf('.1'),m.mpf('.5')]:
 for v in [m.mpf(0),m.mpf('.3'),m.mpf('.7')]:
  direct=m.quad(lambda h:m.mpf('.5')*h*m.sinh(2*a*h)*f(h-v)*f(h+v),[-20,-3,-1,0,1,2,4])
  closed=(m.diff(lambda s:I(s,v),a)-m.diff(lambda s:I(s,v),-a))/8
  print('D identity',a,v,m.nstr(direct,22),m.nstr(closed,22),'difference',m.nstr(direct-closed,5),flush=True)
worst=m.inf
for q in [m.mpf(4)+m.mpf(j)/20 for j in range(21)]:
 for k in [m.mpf(0),m.mpf('.1'),1,2,3,5,10,30,100,1000,10000]:
  r=q-5;x=(q-2)/2;y=k/4;B=-m.log(m.pi)+m.re(m.digamma(x+1j*y));T=m.re(m.polygamma(1,x+1j*y))/2;P=r*r+4*y*y
  val=(B*B+T)*P+4*r*B+2;worst=min(worst,val)
  assert val>0
print('sample f_second/g minimum',m.nstr(worst,30))
