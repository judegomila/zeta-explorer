# Table of G(x) = (1/pi) Int_{Re s=-1/2} zeta(s) zeta(1-s)/sin(pi s) x^{-s} dt  (Bettin-Conrey period function, regular part)
# g(x) = c0(h/k) + (k/h) c0(k/h) - 1/(pi h) = -(log(2 pi x) - gamma)/(pi x) + G(x),  x = h/k   (normalisation fixed by probe_g.py)
import mpmath as mp, numpy as np, sys
from numpy.polynomial import chebyshev as Ch
mp.mp.dps=22
H=0.05; T=22.0
ts=np.arange(-T,T+H/2,H)
print("nodes",len(ts),file=sys.stderr)
wt=[]
for t in ts:
    s=mp.mpc(-0.5,float(t)); wt.append(complex(mp.zeta(s)*mp.zeta(1-s)/mp.sin(mp.pi*s)))
wt=np.array(wt)*H/np.pi
def G(x):
    x=np.atleast_1d(np.asarray(x,float)); L=np.log(x)
    # x^{-s} = x^{1/2} exp(-i t log x)
    return (np.sqrt(x)[:,None]*np.exp(-1j*np.outer(L,ts))*wt[None,:]).sum(1).real
NOCT=48; NSUB=8; DEG=9
uc=np.cos(np.pi*(np.arange(24)+0.5)/24)
GT=np.zeros((NOCT,NSUB,DEG+1)); LT=np.zeros((NSUB,DEG+1))
rng=np.random.default_rng(1); maxerr=0; maxerrL=0
for o in range(NOCT):
    for sub in range(NSUB):
        m=0.5+(sub+(uc+1)/2)/16
        c=Ch.chebfit(uc,G(m*2.0**(-o)),DEG); p=Ch.cheb2poly(c); p=np.pad(p,(0,DEG+1-len(p))); GT[o,sub]=p
        ut=rng.uniform(-1,1,40); mt=0.5+(sub+(ut+1)/2)/16
        err=np.max(np.abs(np.polyval(p[::-1],ut)-G(mt*2.0**(-o)))); maxerr=max(maxerr,err)
        if o==0:
            c=Ch.chebfit(uc,np.log(m),DEG); p=Ch.cheb2poly(c); LT[sub]=p
            maxerrL=max(maxerrL,np.max(np.abs(np.polyval(p[::-1],ut)-np.log(mt))))
print("max abs fit error G",maxerr,"log",maxerrL,file=sys.stderr)
# independent check against mp.quad
def Gmp(x):
    f=lambda t:(lambda s: mp.zeta(s)*mp.zeta(1-s)/mp.sin(mp.pi*s)*mp.power(x,-s))(mp.mpc(-0.5,t))
    return mp.re(mp.quad(f,mp.linspace(-30,30,61)))/mp.pi
for x in [0.9,0.37,0.011,3e-5]:
    print("x",x,"trap",G(x)[0],"quad",mp.nstr(Gmp(mp.mpf(x)),17),file=sys.stderr)
with open("gtab.h","w") as f:
    f.write("#define NOCT %d\nstatic const double GT[NOCT][8][10]={\n"%NOCT)
    for o in range(NOCT):
        f.write("{"+",".join("{"+",".join("%.17g"%v for v in GT[o,s])+"}" for s in range(NSUB))+"},\n")
    f.write("};\nstatic const double LT[8][10]={\n")
    f.write(",\n".join("{"+",".join("%.17g"%v for v in LT[s])+"}" for s in range(NSUB))+"};\n")
