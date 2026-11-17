# Davenport-Heilbronn control: positive local minimum of the Hardy-type function near the first off-line zero pair
import mpmath as mp
mp.mp.dps=25
s5=mp.sqrt(5); kap=(mp.sqrt(10-2*s5)-2)/(s5-1)
chi=[0,1,1j,-1j,-1]; chib=[0,1,-1j,1j,-1]
def f(s): return (1-1j*kap)/2*mp.dirichlet(s,chi)+(1+1j*kap)/2*mp.dirichlet(s,chib)
# completed: Lambda(s)=(5/pi)^{s/2} Gamma((s+1)/2) f(s) satisfies Lambda(s)=Lambda(1-s) => real on the line up to a fixed phase
def Zf(t):
    s=mp.mpf(1)/2+1j*t
    v=mp.exp(mp.loggamma((s+1)/2)-mp.re(mp.loggamma((s+1)/2)))*mp.power(5/mp.pi,1j*t/2)*f(s)
    return v
v=Zf(mp.mpf(10)); ph=v/abs(v); print("phase const check", ph, (Zf(mp.mpf(33.3))/ph).imag)
Z=lambda t: (Zf(mp.mpf(t))/ph).real
ts=[80+0.05*i for i in range(240)]
vals=[Z(t) for t in ts]
sc=[ts[i] for i in range(len(ts)-1) if vals[i]*vals[i+1]<0]
print("sign changes in [80,92]:",[round(x,2) for x in sc])
for i in range(1,len(ts)-1):
    if vals[i]*vals[i-1]>0 and vals[i]*vals[i+1]>0 and abs(vals[i])<abs(vals[i-1]) and abs(vals[i])<abs(vals[i+1]):
        tm=mp.findroot(lambda t: mp.diff(Z,t),ts[i]); print("same-sign local min of |Z_DH| at t=",tm,"Z=",Z(tm))
rho=mp.findroot(f,mp.mpc(0.8085,85.699)); print("off-line zero:",rho)
