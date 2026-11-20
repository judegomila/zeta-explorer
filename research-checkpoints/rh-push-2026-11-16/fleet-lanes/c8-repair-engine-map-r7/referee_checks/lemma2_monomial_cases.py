import math, cmath
from flint import acb, ctx
ctx.prec=64
def theta(t): return t/2*math.log(t/(2*math.pi)) - t/2 - math.pi/8 + 1/(48*t) + 7/(5760*t**3)
def run(a, q, T0=500.0, T1=40000.0):
    c=cmath.exp(1j*a); lq=math.log(q)
    F=lambda t: 2*theta(t)+t*lq-a
    j0=math.ceil(F(T0)/(2*math.pi)); t=T0
    S={1e-3:0,3e-4:0}; W={1e-3:0,3e-4:0}; ces=0; n=0
    j=j0
    while True:
        tgt=2*math.pi*j
        for _ in range(6):
            d=math.log(t/(2*math.pi))+lq
            t+= (tgt-F(t))/d
        if t>T1: break
        z=complex(acb(0.5,t).zeta()); d=math.log(t/(2*math.pi))+lq
        ces+=z; n+=1
        for dl in S:
            w=2/d*math.exp(-dl*t); S[dl]+=w*z; W[dl]+=w
        j+=1
    nint = 1/q
    pred = 1 + (c.conjugate()/math.sqrt(nint) if abs(nint-round(nint))<1e-12 else 0)
    print('a=%.2f q=%s poles %d pred %s | cesaro %s | abel 1e-3 %s | 3e-4 %s'%(a,q,n,complex(round(pred.real,4),round(pred.imag,4)), complex(round((ces/n).real,4),round((ces/n).imag,4)), *[complex(round((S[d]/W[d]).real,4),round((S[d]/W[d]).imag,4)) for d in S]))
run(math.pi,1.0)       # m=-1: predicted 0
run(math.pi,0.5)       # m=-conj(w_2): 1-1/sqrt2
run(2.5,2.0)           # m = c w_2: 1
run(2.5,1/3)           # 1+e^{-2.5i}/sqrt3
