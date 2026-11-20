"""Exploratory only; full-profile tails not certified in this script."""
import mpmath as m
m.mp.dps=35
CO=[[2,-3,0],[-4,15,-m.mpf(15)/2,0],[8,-56,m.mpf(165)/2,-m.mpf(75)/4,0],[-16,180,-529,m.mpf(1635)/4,-m.mpf(375)/8,0],[32,-528,2588,-4256,m.mpf(15465)/8,-m.mpf(1875)/16,0]]
def ps(h,j):
 return 4*m.exp(h/2)*sum(m.polyval(CO[j],m.pi*n*n*m.exp(2*h))*m.exp(-m.pi*n*n*m.exp(2*h)) for n in range(1,7))
def jet(a,r):
 def f(h):
  prod=sum(m.binomial(r,j)*(-1)**j*ps(h,j)*ps(h,r-j) for j in range(r+1))
  w=2*h*h if a==0 else h*m.sinh(2*a*h)/a
  return w*prod
 return m.quad(f,[0,m.mpf('.5'),1,2])
for a in [m.mpf(0),m.mpf('.25'),m.mpf('.5')]:
 js=[jet(a,r) for r in (0,2,4)]
 print('a',a,'jets',*[m.nstr(x,20) for x in js],flush=True)
 H=m.matrix([[js[0],0,js[1]/100],[0,-js[1]/100,0],[js[1]/100,0,js[2]/10000]])
 print('scaled H eigs',list(m.eigsy(H,eigvals_only=True)),flush=True)
