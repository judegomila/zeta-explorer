import numpy as np, mpmath as mp
from gain import *
# (a) closed form ell vs quadrature for v = zeta*(2^-s - 1/2) at (1/2, 1967.40625)
d=0.5; c=62957/32
u, vals = sample(mp.zeta, c, 60.0, 1/64); t=c+u; h=u[1]-u[0]
D2 = 2**-0.5*np.exp(-1j*t*np.log(2)) - 0.5
quad = np.sum(K(d,u)*vals*D2)*h
cf = ell(lambda s: mp.zeta(s)*(mp.power(2,-s)-0.5), d, c)
print("ell quad", quad, "closed", cf)
# (b) PR39 gain-inequality table
a1 = complex(-478747/16777216, -867101/8388608); a2 = complex(478747/8388608, 867101/4194304)
b1 = complex(16645/131072, 2003049/2097152); b2 = complex(-147717/65536, -2003049/1048576)
P = lambda k: k**-0.5*np.exp(-1j*t*np.log(k))
D = a1 + a2*P(2); A = b1 + b2*P(2) + 3*P(3)
print("pole neutral", a1+a2/2, b1+b2/2+1)
R = 1 - vals*D; w=K(d,u)*h
E = np.sum(w*abs(R)**2); V=np.sum(w*abs(vals*A)**2); C=np.sum(w*np.conj(vals*A)*R)
print("E",E,"V",V,"C",C,"gain",abs(C)**2/V,"need",E-15/16,"after",E-abs(C)**2/V)
# (c) N=2 window optimum and N=3 optimum
for N in (2,3,4,8,16):
    print("zeta e_N",N, eN(u,vals,d,c,N,True)[0])
# (d) obstruction algebra
import random
for _ in range(5):
    b=random.uniform(0.01,0.5); dd=random.choice([.5,.25,.125]); g=random.uniform(-1,1)
    a=complex(b-dd,g)/complex(b+dd,g)
    print((1-abs(a)**2)*abs(1-a)**4, 64*dd**5*b/((b+dd)**2+g*g)**3)
print("corner", 64/(4+1/16)**3, 262144/274625, 15/16)
