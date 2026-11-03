from mpmath import iv
iv.dps=30
N=4000
p=iv.pi
acc=[iv.mpf(0) for i in range(5)]
for k in range(N):
 u=iv.mpf([k,k+1])*2/N
 phi=iv.mpf(0)
 for n in (1,2):
  phi+=(2*p**2*n**4*iv.exp(9*u/2)-3*p*n**2*iv.exp(5*u/2))*iv.exp(-p*n*n*iv.exp(2*u))
 for j in range(5):
  if j in (0,2,4): acc[j]+=4*u**j*phi*(iv.exp(u/2)+iv.exp(-u/2))/2*2/N
 acc[1]+=4*phi*2/N
 acc[3]+=4*u**2*phi*2/N
for name,v in zip(['A0','xi0','A2','cstar','A4'],acc):print(name,str(v))
import math
for j in (0,2,4):
 bound=800*p**2*iv.exp(-9*p)*math.factorial(j)/(18*p-5)**(j+1)
 print('high',j,str(bound))
 lam=2*p*iv.exp(4)-5
 poly=sum(math.comb(j,k)*2**(j-k)*math.factorial(k)/lam**(k+1) for k in range(j+1))
 b=136*p**2*iv.exp(10-p*iv.exp(4))*poly
 print('tail',j,str(b))
print('implied r² lower:', str(iv.mpf('0.0228')*iv.mpf('0.4949')/(iv.mpf('0.5')*iv.mpf('0.003064')+iv.mpf('0.02351')**2)))
