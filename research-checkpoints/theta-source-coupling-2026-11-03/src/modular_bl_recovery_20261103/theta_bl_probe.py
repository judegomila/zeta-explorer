import mpmath as m
m.mp.dps=40
pi=m.pi

def vals(h):
 s=[m.mpf(0)]*3
 for n in range(1,9):
  z=pi*n*n*m.exp(2*h);p=4*m.exp(h/2-z)
  q0=2*z*z-3*z;q1=-4*z**3+15*z*z-m.mpf('7.5')*z;q2=8*z**4-56*z**3+m.mpf('82.5')*z*z-m.mpf('18.75')*z
  for j,q in enumerate((q0,q1,q2)):s[j]+=p*q
 return s

def v(h):
 a,b,c=vals(h);return -b/a,(b/a)**2-c/a

def integ(f):return m.quad(f,[0,m.mpf('.15'),m.mpf('.4'),m.mpf('.8'),m.mpf('1.2'),2])
I=integ(lambda h:h*vals(h)[0]**2);P=integ(lambda h:vals(h)[0]**2)
def aa(h):
 t,k=v(h);return h**3*vals(h)[0]**2/(1+2*k*h*h)
def bb(h):
 t,k=v(h);return 4*h**3*vals(h)[0]**2*t*t*k*k/(1+2*k*h*h)
A=integ(aa)/I;B=integ(bb)/I
print('I',I,'P',P,'A',A,'B',B,'lhs',2*I*m.sqrt(A*B),'ratio',2*I*m.sqrt(A*B)/P)
