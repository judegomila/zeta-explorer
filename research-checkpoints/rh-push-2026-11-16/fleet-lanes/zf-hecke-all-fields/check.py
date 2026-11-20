# Independent replay of the scalar system of Liu 2610.26835 Sec. 14 (formulas (14.3),(14.8), Lemma 14.10).
from mpmath import mp, mpf, findroot, polyroots, diff
mp.dps = 40
def R(k,d,x):
    c=1/(3*k); D=3-(1+2*c)*x; P=(2-2*c*x)*(1-x); J=(mpf(5)/6-d)*D+d*P
    return 1-d+(mpf(5)/6-d)*d*P/(2*J)
def E(b,l,k,d,x):
    c=1/(3*k); ly=(1+b-l)/2; h=(1+b+3*l)/2; C0=-mpf(1)/4+b/6+5*l/4
    return C0+d/2+d*x*(l+c*(h/4-ly/2))-(3*h/4)*(1-R(k,d,x))
def cr(d,k): return (3-324*k**2)*d**2+(756*k**2-54*k-5)*d+40*k-300*k**2
def lstar(d,k):
    n=324*d**2*k**2-72*d**2*k+3*d**2-684*d*k**2+126*d*k-5*d+450*k**2-60*k
    m=324*d**2*k**2-144*d**2*k+15*d**2-2340*d*k**2+450*d*k-25*d+2250*k**2-300*k
    return n/m
def dc(k): return findroot(lambda d: cr(d,k), mpf('0.47'))
def Fb(k): return mpf(11)/12-lstar(dc(k),k)/4
def G(k): return (1+k)/2-Fb(k)
half=mpf(1)/2
# 1. fixed point
rts=[r for r in polyroots([16686,-27405,9936,1290,-275],maxsteps=200,extraprec=200) if abs(r.imag)<1e-30]
kb=[r.real for r in rts if 0.7<r.real<0.8][0]
Bb=(1+kb)/2
print("kappa_flat",kb); print("B_flat",Bb,"quartic resid",133488*Bb**4-376596*Bb**3+384534*Bb**2-167541*Bb+26231)
print("G(kappa_flat)",G(kb))
d=dc(kb); l=lstar(d,kb)
print("delta_c",d,"a_c=(1+delta_c)/2",(1+d)/2,"ell*",l)
# 2. b-independence of E at critical class, and zero at ell*
print("E(b=.05),E(b=.2) at (dc,1/2,ell*):",E(mpf('0.05'),l,kb,d,half),E(mpf('0.2'),l,kb,d,half))
lam=diff(lambda L:E(mpf('0.1'),L,kb,d,half),l); print("lambda",lam)
# 3. tangent b*, grid max of E
bs=findroot(lambda b: diff(lambda dd:E(b,l,kb,dd,half),d), mpf('0.12'))
h=(1+bs+3*l)/2; ly=(1+bs-l)/2
print("b*",bs,"h",h,"ly",ly,"lx",(1-bs-l)/2)
mx=max((E(bs,l,kb,mpf(1)/8+(mpf(5)/6-mpf(1)/8)*i/400,half*j/200),i,j) for i in range(401) for j in range(201))
print("grid max E at tangent:",mx[0],"at delta",float(mpf(1)/8+(mpf(5)/6-mpf(1)/8)*mx[1]/400),"x",float(half*mx[2]/200))
Rc=R(kb,d,half); print("R_c",Rc,"count exponent in conductor units; rows scale h; U^R with U=Z^h")
# 4. G sign and F_flat monotonicity on [13/18,1]
N=2000; lo=mpf(13)/18
ks=[lo+(1-lo)*i/N for i in range(N+1)]
Gs=[G(k) for k in ks]; Fs=[Fb(k) for k in ks]
print("G increasing on grid:",all(Gs[i+1]>Gs[i] for i in range(N)),"G(13/18)",Gs[0],"G(1)",Gs[-1])
print("F_flat increasing on full grid:",all(Fs[i+1]>Fs[i] for i in range(N)),"F(13/18)",Fs[0],"min F",min(Fs),"F(1)",Fs[-1])
# 5. decoupled bound: for family sup beta_M, best target bound T(beta_M)=inf_{kappa>=max(13/18,2beta_M-1)} F_flat(kappa); compare with beta_M
for bM in ['0.5','0.7','0.8','0.86','0.87','0.874','0.8748',str(Bb)[:18],'0.875']:
    bM=mpf(bM); k0=max(lo,2*bM-1)
    T=min(Fb(k0+(1-k0)*i/4000) for i in range(4001))
    print("beta_M",float(bM),"inf F_flat over allowed kappa",T,"T-beta_M",float(T-bM))
# 6. sensitivity: hypothetical extra saving tau in count exponent at critical class: E -> E-(3h/4)tau
dF=diff(Fb,kb); print("F_flat'(kappa_flat)",dF)
print("dB/dtau (first order, fixed class) = -(3h/4)/(4 lambda)/(1-2F') =", -(3*h/4)/(4*lam)/(1-2*dF))
