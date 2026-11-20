import mpmath as m
m.mp.dps=25
p=m.pi
cc=1+m.euler/2-m.log(2)-m.log(p)/2

def F(t):
 s=m.mpf('.5')+1j*t
 return m.re(s*(s-1)*p**(-s/2)*m.gamma(s/2)*m.zeta(s))
def g(t):
 return (t*t-m.mpf('.25'))/(t*t+m.mpf('.25'))**2+m.re(m.polygamma(1,m.mpf('1.25')+.5j*t))/4
for n in [0,1]:
 G=2*m.quad(lambda t:t**(2*n)*F(t)**2*g(t),[0,.25,.5,1,2,4,8,16,32])
 Hprime=2*cc if n==0 else -m.mpf('.25')*(2*cc+4)
 S=G-2*p*Hprime
 print('n',n,'G',m.nstr(G,22),'pole Hprime',m.nstr(Hprime,22),'S_half',m.nstr(S,22),flush=True)
print('Ordinary truncated quadrature diagnostic, not interval certification.')
