import mpmath as m
iv=m.iv;iv.dps=25;p=iv.pi;N=1000;I=[iv.mpf(0)]*4
for j in range(2000):
 t=iv.mpf([f'{j/N:.3f}', f'{(j+1)/N:.3f}']);q=iv.exp(2*t); P=iv.mpf(0)
 for n in range(1,7):P+=(2*p*p*n**4*iv.exp(iv.mpf(9)/2*t)-3*p*n*n*iv.exp(iv.mpf(5)/2*t))*iv.exp(-p*n*n*q)
 c=iv.mpf([1,'1.6']);s=iv.mpf([1,'1.2'])
 for k in range(4): I[k]+=2*t**(k+(k%2))*P*(c if k%2==0 else -s)/N
# Tail bounds for ordinary even moments and odd moments divided by a.
r=(iv.mpf(8)/7)**4*iv.exp(-15*p)
b=2*p*p*iv.exp(9)*7**4*iv.exp(-49*p)/(1-r)
for k in range(4):
    power=k+k%2
    n_tail=2*b*2**(power+1)*iv.mpf('1.6')
    t_tail=8*p*p*m.factorial(power)*iv.exp(12-p*iv.exp(4))/(2*p*iv.exp(4)-6)
    assert n_tail+t_tail < iv.mpf('1e-50')
I=[v+iv.mpf(['-1e-50','1e-50']) for v in I]
print('M0, M1/a, M2, M3/a:',*I,sep='\n')
crit=-2*I[0]*I[1]-9*(I[1]*I[2]-I[0]*I[3])
print('Criterion divided by a:',crit)
assert crit > 0
print('Fourier[C_a](2x)>0 for 0<a<=1/2 and |x|<=3, subject to interval implementation.')
