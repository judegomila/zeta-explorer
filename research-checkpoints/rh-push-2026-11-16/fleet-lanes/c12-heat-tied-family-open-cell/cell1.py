# Cell 1: (N2) for the heat family X_tau(s) = 8 int_0^inf e^{tau v^2} Phi(v) cosh(2(s-1/2)v) dv.
# Trapezoid rule (integrand even and analytic in |Im v| < pi/8), Arb ball arithmetic for rounding (quadrature error not enclosed;
# checked by step halving and against Arb zeta at tau = 0).
import sys, json, time
from flint import arb, acb, ctx
PREC=1150
def setup(tau, hs, V=1.5):
    ctx.prec=PREC
    hs=arb(hs); n=int(float(V/hs)); pi=arb.pi(); tau=arb(tau)
    vs=[]; ws=[]
    for k in range(n+1):
        v=hs*k; e4=(4*v).exp(); e5=(5*v).exp(); e9=(9*v).exp()
        ph=arb(0)
        for m in range(1,40):
            a=pi*m*m*e4
            if float(a.mid())>900: break
            ph+=(2*pi*pi*m**4*e9-3*pi*m*m*e5)*(-a).exp()
        w=8*hs*ph*(tau*v*v).exp()
        if k==0: w=w/2
        vs.append(v); ws.append(w)
    return vs,ws
class Heat:
    def __init__(self,tau,hs='0.002'):
        self.tau=tau; self.vs,self.ws=setup(tau,hs); self.v2=[2*v for v in self.vs]
    def H(self,t):      # X(1/2+it), real
        t=arb(t); s=arb(0)
        for a,w in zip(self.v2,self.ws): s+=w*(a*t).cos()
        return s
    def dH(self,t):
        t=arb(t); s=arb(0)
        for a,w in zip(self.v2,self.ws): s-=w*a*(a*t).sin()
        return s
    def X(self,s):      # complex s
        z=s-acb(1)/2; tot=acb(0)
        for a,w in zip(self.v2,self.ws): tot+=w*(a*z).cosh()
        return tot
def sgn(x):
    if x>0: return 1
    if x<0: return -1
    return 0
def refine(F,dF,a,b,sa):
    a=arb(a); b=arb(b)
    for _ in range(30):
        m=(a+b)/2; sm=sgn(F(m))
        if sm==sa: a=m
        else: b=m
    t=(a+b)/2
    for _ in range(8):
        t=arb(t.mid()); t=t-F(t)/dF(t)
    return arb(t.mid())
if __name__=='__main__':
    tau=sys.argv[1]; T=float(sys.argv[2]); dt=float(sys.argv[3]) if len(sys.argv)>3 else 0.02
    t0=time.time(); F=Heat(tau)
    print('tau',tau,'nodes',len(F.vs),'planned memory < 10 MB',flush=True)
    n=int(round(T/dt)); ts=[dt*k for k in range(1,n+1)]
    vals=[]
    for t in ts:
        vals.append(F.H(t))
    sg=[sgn(v) for v in vals]
    print('scan s',time.time()-t0,'undetermined signs',sg.count(0),flush=True)
    zeros=[]
    for j in range(len(ts)-1):
        if sg[j]*sg[j+1]<0: zeros.append(refine(F.H,F.dH,ts[j],ts[j+1],sg[j]))
    # missed close pairs: local minima of |H| without sign change, look at the extremum of H
    extra=0; lehmer=[]
    for j in range(1,len(ts)-1):
        if sg[j-1]==sg[j]==sg[j+1] and abs(vals[j])<abs(vals[j-1]) and abs(vals[j])<abs(vals[j+1]):
            da,db=sgn(F.dH(ts[j-1])),sgn(F.dH(ts[j+1]))
            if da*db<0:
                # root of dH by bisection
                a,b=arb(ts[j-1]),arb(ts[j+1])
                for _ in range(40):
                    m=(a+b)/2
                    if sgn(F.dH(m))==da: a=m
                    else: b=m
                m=(a+b)/2; hm=F.H(m)
                if sgn(hm)!=sg[j]:
                    extra+=2
                    zeros.append(refine(F.H,F.dH,ts[j-1],m,sg[j])); zeros.append(refine(F.H,F.dH,m,ts[j+1],-sg[j]))
                else:
                    lehmer.append(float(m.mid()))
    zeros.sort(key=lambda z: float(z.mid()))
    recs=[]; hsft=['0.5','1','2']
    for z in zeros:
        d=F.dH(z); sd=sgn(d); rho=acb(arb(1)/2,z); r=dict(t=z.str(25,radius=False))
        for h in hsft:
            xv=F.X(rho+arb(h)); q=-sd*xv.imag/abs(xv)      # q_h = -Re{X'(rho) X(rho+h)}/(|X'||X|), X'(rho) = -i dH/dt
            r['q'+h]=float(q.mid())
        recs.append(r)
    out=dict(tau=tau,T=T,dt=dt,n_online=len(zeros),extra_close_pairs=extra,positive_minima_or_negative_maxima=lehmer,
             fails={h:sum(1 for r in recs if r['q'+h]<0) for h in hsft},
             first_fail={h:next((r['t'] for r in recs if r['q'+h]<0),None) for h in hsft},
             min_q={h:min(r['q'+h] for r in recs) for h in hsft},seconds=time.time()-t0,zeros=recs)
    json.dump(out,open(f'cell1_tau{tau}.json','w'),indent=0)
    print({k:v for k,v in out.items() if k!='zeros'},flush=True)
