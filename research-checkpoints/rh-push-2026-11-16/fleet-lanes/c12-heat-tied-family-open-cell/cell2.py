# Cell 2: tied conductor family V3b. w0(s) = sum_chi 1/(L(s,chi) L(2-s,conj chi)).
# Screen: float winding numbers on grid cells in 0.505<=Re s<=1, 0<Im s<=T. Then Newton (arb, 60 digits),
# then ball-arithmetic winding number on a small square around each refined zero.
import sys, json, time, cmath, math
import numpy as np
from flint import acb, arb, ctx, dirichlet_char
def family(q, parity):
    out=[]
    for n in range(2,q):
        c=dirichlet_char(q,n)
        if c.parity()==parity: out.append(n)   # non-principal (n>=2); q prime so all primitive
    return out
def conj_index(q,n): return pow(n,-1,q)   # Conrey: conj chi_q(n,.) = chi_q(n^-1,.)
class W0:
    def __init__(self,q,fam,a=None,nr=None):
        self.q=q; self.fam=fam; self.a=a; self.nr=nr
        self.ch={n:dirichlet_char(q,n) for n in set(fam)|{conj_index(q,n) for n in fam}}
    def X(self,n,s):
        if self.a is not None:   # E_a control: L(s+a)L(s-a)
            return self.ch[n].l(s+self.a)*self.ch[n].l(s-self.a)
        v=self.ch[n].l(s)
        if self.nr is not None:  # T-NR control: times 2cosh((s-1/2)log p)+c
            p,c=self.nr; v=v*(2*((s-0.5)*arb(p).log()).cosh()+c)
        return v
    def __call__(self,s):
        tot=acb(0)
        for n in self.fam:
            tot+=1/(self.X(n,s)*self.X(conj_index(self.q,n),2-s))
        return tot
def screen(f,T,ds,dt,s0=0.505,s1=1.0,t0=0.1):
    ctx.prec=64
    sig=np.arange(s0,s1+1e-12,ds); tt=np.arange(t0,T+1e-12,dt)
    print('planned grid',len(sig),'x',len(tt),'complex128 =',len(sig)*len(tt)*16/1e6,'MB',flush=True)
    V=np.empty((len(sig),len(tt)),dtype=complex)
    for i,a in enumerate(sig):
        for j,b in enumerate(tt):
            V[i,j]=complex(f(acb(float(a),float(b))))
    A=np.angle(V)
    def d(x): return (x+np.pi)%(2*np.pi)-np.pi
    wn=(d(A[1:,:-1]-A[:-1,:-1])+d(A[1:,1:]-A[1:,:-1])+d(A[:-1,1:]-A[1:,1:])+d(A[:-1,:-1]-A[:-1,1:]))/(2*np.pi)
    cells=[(float(sig[i]),float(tt[j]),int(round(wn[i,j]))) for i,j in zip(*np.nonzero(np.abs(wn)>0.5))]
    return cells,float(np.abs(V).min())
def newton(f,s,prec=200,it=60):
    ctx.prec=prec
    s=acb(s.real,s.imag)
    for _ in range(it):
        h=acb(arb(2)**(-prec//3))
        v=f(s); dv=(f(s+h)-f(s-h))/(2*h)
        step=v/dv
        s=acb(s.real.mid(),s.imag.mid())-acb(step.real.mid(),step.imag.mid())
        if abs(complex(step))<1e-45: break
    return s, abs(complex(f(s)))
def winding(f,c,r,m=64,prec=128):
    # rigorous: boundary of square centre c half-side r, m pieces per side; each piece enclosed by a ball.
    ctx.prec=prec
    cr,ci=c.real.mid(),c.imag.mid()
    corners=[(-1,-1),(1,-1),(1,1),(-1,1)]
    total=arb(0); ok=True
    for k in range(4):
        (x0,y0),(x1,y1)=corners[k],corners[(k+1)%4]
        for j in range(m):
            ua,ub=arb(j)/m,arb(j+1)/m
            pa=acb(cr+r*(x0+(x1-x0)*ua),ci+r*(y0+(y1-y0)*ua)); pb=acb(cr+r*(x0+(x1-x0)*ub),ci+r*(y0+(y1-y0)*ub))
            mid=(pa+pb)/2; rad=arb(r)/m/2*1.0000001
            ball=acb(mid.real+arb(0,float(rad.upper())) if x0!=x1 else mid.real, mid.imag+arb(0,float(rad.upper())) if y0!=y1 else mid.imag)
            E=f(ball); fa=f(pa); fb=f(pb)
            if E.contains(0) or not E.is_finite(): ok=False; continue
            # enclosure inside an open half-plane through 0: rotate by conj(mid value), require real part > 0
            rot=E*acb(complex(fa)).conjugate()
            if not (rot.real>0): ok=False; continue
            total+= (fb/fa).log().imag      # principal log valid since image lies in a half-plane
    wn=total/(2*arb.pi())
    return ok, wn
if __name__=='__main__':
    q=int(sys.argv[1]); par=int(sys.argv[2]); T=float(sys.argv[3]); mode=sys.argv[4] if len(sys.argv)>4 else 'L'
    fam=family(q,par)
    if q==5: fam=[2,3]
    kw={}
    if mode=='EA': kw=dict(a=arb(0.25))
    if mode=='NR': kw=dict(nr=(2,arb(2.5)))
    f=W0(q,fam,**kw); t1=time.time()
    kws=dict(s0=0.505,s1=1.0)
    if mode=='EA': kws=dict(s0=0.505,s1=1.0)
    cells,mn=screen(f,T,0.0125,0.025,**kws)
    print('q',q,'parity',par,'fam',fam,'mode',mode,'cells with winding',len(cells),'min|w0| on grid',mn,'screen s',time.time()-t1,flush=True)
    out=[]
    for (a,b,wn) in cells:
        rec=dict(cell=[a,b],screen_wn=wn)
        if wn>0:
            s,res=newton(f,acb(a+0.00625,b+0.0125))
            ctx.prec=200
            rec.update(sigma=s.real.mid().str(32,radius=False),t=s.imag.mid().str(32,radius=False),resid=res)
            inside = (0.5<float(s.real.mid())<1.5)
            ok,w=winding(f,s,arb(10)**-8)
            rec.update(in_strip=inside,ball_ok=ok,ball_wn=w.str(8))
        out.append(rec)
    nz=[r for r in out if r.get('ball_ok') and r.get('in_strip')]
    print('zeros (wn>0) located:',sum(1 for r in out if r['screen_wn']>0),'ball-confirmed:',len(nz),'pole cells (wn<0):',sum(1 for r in out if r['screen_wn']<0))
    for r in out[:12]: print(r)
    json.dump(dict(q=q,parity=par,fam=fam,mode=mode,T=T,grid=[0.0125,0.025],min_abs_w0_grid=mn,records=out,seconds=time.time()-t1),open(f'cell2_q{q}_p{par}_{mode}_T{int(T)}.json','w'),indent=0)
