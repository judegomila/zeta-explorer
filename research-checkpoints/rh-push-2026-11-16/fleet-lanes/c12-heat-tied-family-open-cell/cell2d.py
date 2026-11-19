# S_v for the full odd family mod q by orthogonality (no character values):
#   sum_{chi odd} L(s1,chi) conj L(s2,chi) = q^{-s1-conj s2} (phi(q)/2) sum_a zeta(s1,a/q) conj[ zeta(s2,a/q) - zeta(s2,1-a/q) ],  q prime.
# S_v(t) = Re{ G(s1) conj G(s2) * that }, s1 = 1/2+it, s2 = 3/2+it, G(s) = (q/pi)^{s/2} Gamma((s+1)/2). T-NR: times m(s1) conj m(s2).
import sys, json, time
from flint import arb, acb, ctx
ctx.prec=128
q=int(sys.argv[1]); mode=sys.argv[2]; T=float(sys.argv[3]); dts=sys.argv[4]; dt=float(dts)
frac=[arb(a)/q for a in range(1,q)]
def G(s): return ((s/2)*(arb(q)/arb.pi()).log()).exp()*((s+1)/2).gamma()
def m(s): return 2*((s-arb(1)/2)*arb(2).log()).cosh()+arb(5)/2
def S(t):
    s1=acb(arb(1)/2,t); s2=acb(arb(3)/2,t)
    z1=[s1.zeta(f) for f in frac]; z2=[s2.zeta(f) for f in frac]
    tot=acb(0); ab=arb(0)
    for i in range(q-1):
        d=(z2[i]-z2[q-2-i]).conjugate()
        tot+=z1[i]*d
    g=G(s1)*G(s2).conjugate()*(-(s1+s2.conjugate())*arb(q).log()).exp()
    v=tot*g
    if mode=='NR': v=v*m(s1)*m(s2).conjugate()
    return v.real/abs(g)      # positive normalisation only
t0=time.time(); n=int(round(T/dt)); first=None; neg=0; und=0; mn=None; early=[]
for k in range(1,n+1):
    t=arb(k)*arb(dts); v=S(t)
    if v<0:
        neg+=1
        if first is None: first=(k*dt,v.str(10))
    elif not v>0: und+=1
    if k*dt<=2.0001 and k%25==0: early.append((k*dt,float(v.mid())))
out=dict(q=q,mode=mode,T=T,dt=dt,first_negative=first,neg_fraction=neg/n,undetermined=und,early_values=early,seconds=time.time()-t0)
print(out,flush=True); json.dump(out,open(f'cell2d_q{q}_{mode}.json','w'))
