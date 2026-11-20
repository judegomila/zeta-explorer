# Certificate for the sign law S(b) < 0 and for kappa(b) > 0.69 from Theorem 1(ii) of b-route-m-first-moment
#   |F(b) - K b phi(b)| <= E(b) = b 2^omega(b) (3 + 2 log b) + 2 + log b            (PROVED there, refereed)
# and the identities  S(b) = (2/pi)(F_arith(b) - F(b)) + V(1,b),  V(1,b) = (2/pi)(arith(1,b) - I(1,b)),  I(1,b) >= 1:
#   S(b) <= U(b) := (2/pi) [ Fa1(b) - 1 - K b phi(b) + E(b) ],   Fa1(b) = b sum_{(a,b)=1, a<b} f(a/b) = b sum_{d|b} mu(d) Tn(b/d).
import numpy as np, math, sys, json
N=int(sys.argv[1]) if len(sys.argv)>1 else 5_000_000
print("planned arrays: about %.2f GB"%(12*8*(N+1)/1e9))
EG=0.57721566490153286061; C=(math.log(2*math.pi)-EG)/2; K=1.5*C-0.25; KA=1.5*C-0.375
spf=np.zeros(N+1,np.int32)
for p in range(2,N+1):
    if spf[p]==0:
        v=spf[p::p]; v[v==0]=p
mu=np.ones(N+1,np.int8); om=np.zeros(N+1,np.int8); phi=np.ones(N+1,np.int64); rem=np.arange(N+1,dtype=np.int64); rem[0]=1
while True:
    act=np.nonzero(rem>1)[0]
    if len(act)==0: break
    p=spf[rem[act]].astype(np.int64); r=rem[act]//p; sq=(r%p==0)
    om[act]+=1; mu[act]=np.where(sq,0,-mu[act]); f=p-1
    while True:
        m=(r%p==0)
        if not m.any(): break
        r=np.where(m,r//p,r); f=np.where(m,f*p,f)
    phi[act]*=f; rem[act]=r
n=np.arange(N+1,dtype=np.float64); ln=np.log(np.maximum(n,1))
# D(m) = Tn(m) - m kappa_arith = (1/4) log m + K0 + delta(m)  (imp-97167 STEP 2), evaluated without cancellation:
# exact sums (fsum) for m < 2000, Stirling / Glaisher-Kinkelin expansion above (next neglected term O(m^-5)).
LOGA=0.24875447703378426   # log of the Glaisher-Kinkelin constant
K0=0.5*math.log(2*math.pi)-EG/4
D=np.zeros(N+1)
M0=2000
for t in range(1,M0):
    D[t]=math.fsum([C*(1+j/t)+0.5*(1-j/t)*math.log(j/t)-KA for j in range(1,t+1)])
mm=n[M0:]; D[M0:]=0.25*ln[M0:]+K0+(1/24-LOGA/2-ln[M0:]/24)/mm-1/(480*mm**3)
t=M0-1; chk=0.25*math.log(t)+K0+(1/24-LOGA/2-math.log(t)/24)/t-1/(480*t**3); assert abs(chk-D[t])<1e-11,(chk,D[t])
acc=np.zeros(N+1)
for d in range(1,N+1):
    if mu[d]: acc[d::d]+=int(mu[d])*D[1:N//d+1]
rphi=acc                                   # r(b) phi(b) = sum_{m|b} mu(b/m) D(m)
Fa1=n*(KA*phi+rphi)                        # b sum_{(a,b)=1, 1<=a<b} f(a/b), b >= 2
b=n; E=b*np.exp2(om.astype(float))*(3+2*ln)+2+ln
U=(2/math.pi)*(Fa1-1-K*b*phi+E)
kerr=E/np.maximum(b*phi,1)
bb=np.arange(N+1)
exS=bb[(U>=-1e-6*b*phi)&(bb>=3)]; exK=bb[(kerr>=(K-0.69)*(1-1e-9))&(bb>=3)]   # float64 guard bands
mS=bb>62790; print('certificate margin: max U(b)/(b phi(b)) over b > 62790 = %.5f'%(U[mS]/(b[mS]*phi[mS])).max())
print("N =",N)
print("sign law: certificate fails for %d values of b; largest %d"%(len(exS),exS.max()))
print("kappa > 0.69: certificate fails for %d values of b; largest %d; of these above 2e6: %d, above 1e6: %d"%(len(exK),exK.max(),(exK>2_000_000).sum(),(exK>1_000_000).sum()))
# F_arith residual r(b) = F_arith/(phi b) - kappa_arith (F_arith over a = 2..b-1)
ar1=C*(1+b)+0.5*(1-b)*ln
Farith=Fa1-ar1
r=np.zeros(N+1); r[3:]=rphi[3:]/phi[3:]   # R_b includes a = 1 (imp-97167)
np.save("cert_exS.npy",exS); np.save("cert_exK.npy",exK)
np.savez_compressed("cert_arith.npz",mu=mu,om=om,phi=phi,Farith=Farith)
sgn=np.sign(r); par=np.where(om%2==0,-1,1)   # sign r(b) = (-1)^(omega(b)+1): positive on prime powers
m=bb>=3
print("parity law sign r(b) = (-1)^(omega(b)+1): holds for %d of %d b in [3,N]"%((sgn[m]==par[m]).sum(),m.sum()))
for lo,hi in ((3,10**3),(10**3,10**4),(10**4,10**5),(10**5,10**6),(10**6,N+1)):
    mm=(bb>=lo)&(bb<hi); print("  [%d,%d): agree %d of %d"%(lo,hi,(sgn[mm]==par[mm]).sum(),mm.sum()))
msq=m&(mu!=0); print("  squarefree: agree %d of %d; sign r = -mu(b)"%((sgn[msq]==-mu[msq]).sum(),msq.sum()))
pr=1
for p in (2,3,5,7,11,13,17,19):
    pr*=p
    if pr<=N and pr>=6: print("  primorial %d omega %d r(b) = %.6e  r*phi(b) = %.4f"%(pr,om[pr],r[pr],r[pr]*phi[pr]))
viol=bb[m&(sgn!=par)]; print("  violations: %d; first 30:"%len(viol),viol[:30].tolist(),"largest",int(viol.max()) if len(viol) else None)
for k in range(1,9):
    mk=m&(om==k); print("  omega=%d: agree %d of %d"%(k,(sgn[mk]==par[mk]).sum(),mk.sum()))
json.dump({"N":N,"parityAgree":int((sgn[m]==par[m]).sum()),"parityTotal":int(m.sum()),"nExS":int(len(exS)),"maxExS":int(exS.max()),"nExK":int(len(exK)),"maxExK":int(exK.max())},open("cert.json","w"))
