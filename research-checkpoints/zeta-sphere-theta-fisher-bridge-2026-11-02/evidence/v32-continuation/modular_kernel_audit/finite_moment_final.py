import mpmath as m
iv=m.iv; iv.dps=25
N=1000; z=iv.mpf(0); I=[z for _ in range(4)]; a=iv.mpf(1)/4; p=iv.pi
for j in range(2*N):
 t=iv.mpf([f"{j/N:.3f}",f"{(j+1)/N:.3f}"]); q=iv.exp(2*t); P=iv.mpf(0)
 for n in range(1,7):
  P+=(2*p*p*n**4*iv.exp(iv.mpf(9)/2*t)-3*p*n*n*iv.exp(iv.mpf(5)/2*t))*iv.exp(-p*n*n*q)
 c=(iv.exp(a*t)+iv.exp(-a*t))/2; s=(iv.exp(a*t)-iv.exp(-a*t))/2
 for k in range(4): I[k]+=2*t**k*P*(c if k%2==0 else -s)/N
# Bound the omitted n >= 7 terms for 0 <= t <= 2 and the full t >= 2 tail.
# For k <= 3, use t**k <= k! * exp(t) in the latter tail.
r=(iv.mpf(8)/7)**4*iv.exp(-15*p)
b=2*p*p*iv.exp(9)*7**4*iv.exp(-49*p)/(1-r)
for k in range(4):
    n_tail=2*b*2**(k+1)*(iv.exp(iv.mpf(1)/2)+iv.exp(-iv.mpf(1)/2))/2
    t_tail=8*p*p*m.factorial(k)*iv.exp(iv.mpf(23)/2-p*iv.exp(4))/(2*p*iv.exp(4)-iv.mpf(23)/4)
    assert n_tail+t_tail < iv.mpf('1e-50')
I=[v+iv.mpf(['-1e-50','1e-50']) for v in I]
print('moments',*I,sep='\n')
crit= -2*I[0]*I[1]-(I[1]*I[2]-I[0]*I[3]);print('criterion',crit)

assert crit > 0
print('Certified: Fourier[C_1/4](2x) > 0 for |x| <= 1.')
