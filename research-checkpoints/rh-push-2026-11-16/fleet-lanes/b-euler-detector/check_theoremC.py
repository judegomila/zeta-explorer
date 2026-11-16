"""Checks of Theorem C (right edge).
(1) Truncated two-term model on primes {2,3,7} (DH phases): sigma*_P from 2*sum arctan(p^-sigma) = T. Find a zero by Kronecker search
    + Newton and compare its real part with sigma*_P; verify |c + conj(c) R| stays away from 0 just right of sigma*_P.
(2) DH omega=-1 twin (sigma* = 2.3823): count zeros with Re s > 1.5, 2.0, 2.3, 2.39 for 0.25 < Im s < 3000 (argument principle, float).
Run: python -I check_theoremC.py"""
import math, cmath, json
import numpy as np
from flint import acb, dirichlet_char
kappa=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1); T=math.pi-2*math.atan(kappa)
c=(1-1j*kappa)/2
out={}
# ---- (1)
P=[2,3,7]; chi={2:1j,3:-1j,7:1j}
A=lambda s: 2*sum(math.atan(p**-s) for p in P)
lo,hi=0.1,3.0
for _ in range(80):
    m=(lo+hi)/2
    if A(m)>T: lo=m
    else: hi=m
sP=lo
def f(s):
    a=1; b=1
    for p in P:
        u=cmath.exp(-s*math.log(p)); a*=1/(1-chi[p]*u); b*=1/(1-chi[p].conjugate()*u)
    return c*a+c.conjugate()*b
# Kronecker search: t with 3^{-it}=1 exactly (t = 2 pi k / log 3), 2^{-it} ~ -1, 7^{-it} ~ -1
ks=np.arange(1,4_000_000); t=2*math.pi*ks/math.log(3)
d2=np.abs(np.exp(-1j*t*math.log(2))+1); d7=np.abs(np.exp(-1j*t*math.log(7))+1)
i=int(np.argmin(d2**2+d7**2)); t0=float(t[i])
s=complex(sP-0.002,t0)
for _ in range(60):
    h=1e-7; fs=f(s); df=(f(s+h)-f(s-h))/(2*h); s=s-fs/df
out['truncated_model']={'primes':P,'sigma_star_P':sP,'kronecker_t':t0,'phase_miss':float(math.sqrt(d2[i]**2+d7[i]**2)),'zero':[s.real,s.imag],'abs_f_at_zero':abs(f(s)),
                        'sigma_star_minus_Re_zero':sP-s.real}
# just right of sigma*_P: min |c + conj(c) R| over a long t-range is bounded below by the argument deficit
tt=np.linspace(0,2e6,4_000_001); sg=sP+0.01
R=np.ones_like(tt,dtype=complex)
for p in P:
    u=np.exp(-(sg+1j*tt)*math.log(p)); R*=(1-chi[p]*u)/(1-np.conj(chi[p])*u)
out['truncated_model']['min_abs_c_plus_cbarR_at_sigma*+0.01']=float(np.abs(c+np.conj(c)*R).min())
out['truncated_model']['max_arg_R_at_sigma*+0.01']=float(np.abs(np.angle(R)).max()); out['truncated_model']['target']=T
print(json.dumps(out['truncated_model'],indent=1),flush=True)
# ---- (2) DH omega=-1 twin
chi5=dirichlet_char(5,2); chib=dirichlet_char(5,3)
tau=sum(complex(chi5(n))*cmath.exp(2j*math.pi*n/5) for n in range(1,5)); eps=tau/(1j*math.sqrt(5))
th=cmath.phase(-eps.conjugate())/2; c2=cmath.exp(1j*th)/(2*math.cos(th))
F=lambda s: c2*complex(chi5.l(acb(s.real,s.imag)))+c2.conjugate()*complex(chib.l(acb(s.real,s.imag)))
def darg(pts):
    tot=0; prev=pts[0]
    for z in pts[1:]: tot+=cmath.phase(z/prev); prev=z
    return tot
TT=3000.3; t0=0.25; s1=6.0; h=0.02
nt=int((TT-t0)/h)
res={}
for sg in (1.5,2.0,2.3,2.39):
    left=darg([F(complex(sg,t0+k*(TT-t0)/nt)) for k in range(nt+1)])
    bot=darg([F(complex(sg+(s1-sg)*j/400,t0)) for j in range(401)]); top=darg([F(complex(s1+(sg-s1)*j/400,TT)) for j in range(401)])
    right=cmath.phase(F(complex(s1,TT))/F(complex(s1,t0)))
    res[sg]=(bot+right+top-left)/(2*math.pi); print(sg,res[sg],flush=True)
out['DH_omega_minus_zero_counts_right_of_sigma_T3000']=res; out['DH_omega_minus_sigma_star']=2.382286
json.dump(out,open('check_theoremC.json','w'),indent=1)
