# Cell 2, boundary statistic: signs of S_v(t) = Re sum_chi X(1/2+it,chi) conj X(3/2+it,chi) and
# S_w(t) = Re sum_chi 1/(X(1/2+it,chi) conj X(3/2+it,chi)) on a grid, Arb ball arithmetic (signs are certified when the ball excludes 0).
import sys, json, time
from flint import acb, arb, ctx, dirichlet_char
ctx.prec=128
def conj_index(q,n): return pow(n,-1,q)
class Fam:
    def __init__(self,q,fam,mode):
        self.q=q; self.fam=fam; self.mode=mode
        self.ch={n:dirichlet_char(q,n) for n in fam}; self.par=self.ch[fam[0]].parity() if q>1 else 0
    def G(self,s):
        if self.q==1: return s*(s-1)*(-(s/2)*arb.pi().log()).exp()*(s/2).gamma()
        return ((s/2)*(arb(self.q)/arb.pi()).log()).exp()*((s+self.par)/2).gamma()
    def L(self,n,s): return s.zeta() if self.q==1 else self.ch[n].l(s)
    def X(self,n,s):
        if self.mode=='EA':
            a=arb(1)/4; return self.G(s+a)*self.L(n,s+a)*self.G(s-a)*self.L(n,s-a)
        v=self.G(s)*self.L(n,s)
        if self.mode=='NR': v=v*(2*((s-arb(1)/2)*arb(2).log()).cosh()+arb(5)/2)
        return v
    def terms(self,t):
        s1=acb(arb(1)/2,t); s2=acb(arb(3)/2,t)
        return [self.X(n,s1)*self.X(n,s2).conjugate() for n in self.fam]
def sg(x):
    if x>0: return 1
    if x<0: return -1
    return 0
if __name__=='__main__':
    q=int(sys.argv[1]); fam=[int(x) for x in sys.argv[2].split(',')]; T=float(sys.argv[3]); mode=sys.argv[4]; dt=0.01
    F=Fam(q,fam,mode); t0=time.time(); n=int(round(T/dt))
    prev=None; cv=cw=0; und=0; firstneg={'v':None,'w':None}; mnv=(9,None); mnw=(9,None); negv=negw=0
    single=[0]*len(fam); sprev=[None]*len(fam)
    for k in range(1,n+1):
        t=arb(k)/100
        tm=F.terms(t)
        sc=sum(abs(x) for x in tm)
        Sv=sum(x.real for x in tm)/sc
        inv=[1/x for x in tm]; sc2=sum(abs(x) for x in inv)
        Sw=sum(x.real for x in inv)/sc2
        a,b=sg(Sv),sg(Sw)
        if a==0 or b==0: und+=1
        for i,x in enumerate(tm):
            c=sg(x.real)
            if sprev[i] is not None and c*sprev[i]<0: single[i]+=1
            if c!=0: sprev[i]=c
        if prev is not None:
            if a*prev[0]<0: cv+=1
            if b*prev[1]<0: cw+=1
        if a<0:
            negv+=1
            if firstneg['v'] is None: firstneg['v']=k/100
        if b<0:
            negw+=1
            if firstneg['w'] is None: firstneg['w']=k/100
        fv=float(Sv.mid()); fw=float(Sw.mid())
        if fv<mnv[0]: mnv=(fv,k/100,Sv.str(12))
        if fw<mnw[0]: mnw=(fw,k/100,Sw.str(12))
        prev=(a if a!=0 else prev[0] if prev else a, b if b!=0 else prev[1] if prev else b)
    out=dict(q=q,fam=fam,mode=mode,T=T,dt=dt,grid_points=n,undetermined=und,C_v=cv,C_w=cw,neg_points_v=negv,neg_points_w=negw,
             first_negative=firstneg,min_normalised_Sv=mnv,min_normalised_Sw=mnw,single_term_sign_changes=single,seconds=time.time()-t0)
    print(out,flush=True)
    json.dump(out,open(f'cell2b_q{q}_{sys.argv[2].replace(",","-")}_{mode}_T{int(T)}.json','w'),indent=0)
