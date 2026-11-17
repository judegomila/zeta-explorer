import sys, time
from zf import *
from flint import acb, arb, ctx
t0=time.time(); Z=ZF(); print("setup s", time.time()-t0, "N", Z.N)
def rel(a,b): return float(abs(a-b)/abs(b))
for s in [acb(3,5), acb(0.3,40), acb(1.7,120), acb(-0.5,215), acb(0.25,200)]:
    t0=time.time(); g=Z.F(0,s); dt=time.time()-t0
    print("G", s, "rel err vs closed form (c=-1/4):", rel(g,Gclosed(s)), "ratio", (g/Gclosed(s)).real.str(20), "t", round(dt,4))
for s in [acb(0.5,14.134725), acb(0.3,100), acb(0.5,210), acb(2,33)]:
    z=Z.F(1,s); print("w=1", s, rel(z, zstar(s)))
# w=2: Z(2,s) = sum r_2(n) ... = pi^(-s/2) Gamma(s/2) * 4 zeta(s/2) L(s/2,chi4) /2
for s in [acb(1,30), acb(0.7,150)]:
    u=s/2; L4 = (acb(4)**(-u))*(u.zeta(arb(1)/4) - u.zeta(arb(3)/4))
    ref = (acb.pi()**(-u))*u.gamma()*4*u.zeta()*L4/2
    print("w=2", s, rel(2*Z.F(2,s), ref))
# derivative check
s=acb(0.4,77); f,d=Z.F(0.37,s,True); e=acb('1e-30'); fd=(Z.F(0.37,s+e)-Z.F(0.37,s-e))/(2*e); print("deriv", rel(d,fd))
print("H imag part check", Z.F(0.37, acb(0.185, 77)).imag.str(10), Z.H(0.37,77).str(10))
