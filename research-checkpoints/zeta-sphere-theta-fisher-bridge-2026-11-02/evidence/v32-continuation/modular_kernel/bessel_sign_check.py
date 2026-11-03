import mpmath as m
iv=m.iv;iv.dps=25;p=iv.pi;N=20000; s=iv.mpf(0)
for j in range(N):
 t=iv.mpf(j*2+1)/20000
 c=(iv.exp(t)+iv.exp(-t))/2
 s+=iv.exp(-2*p*c)*iv.cos(10*t)
s=s*2/N
# Midpoint error M*(2)^3/(24*N^2) with |f''|<4 on [0,2].
e=iv.mpf(4)*8/(24*N*N)
# cosh(t)>=cosh(2)+(t-2)sinh(2); with z=2pi,
# tail <= exp(-2pi*cosh2)/(2pi*sinh2).
c2=(iv.exp(2)+iv.exp(-2))/2; s2=(iv.exp(2)-iv.exp(-2))/2
tail=iv.exp(-2*p*c2)/(2*p*s2)
E=e+tail
print('midpoint:',s,'error:',E)
print('enclosure:',s+iv.mpf([-1,1])*E)
assert s+E < 0
