"""Zero census of conjugate-pair twins F = c L(chi) + conj(c) L(chibar) (same FE as an L-function of that conductor/parity,
root number omega = +-1, real coefficients, a(1)=1).  Counts, for t0 < Im s < T:
  N_total (argument principle on the right half rectangle + symmetry), N_online (sign changes of Z_F), N(sigma>0.75), N(sigma>1).
Run: python twin_zeros.py q m T   (m = Conrey number of chi)  -> one JSON line.   MEASURED (float tracking, not interval-certified)."""
import sys, json, math, cmath
from flint import acb, arb, dirichlet_char, ctx
ctx.prec=64

def run(q,m,T,t0=0.25,h=0.02,sig1=None):
    chi=dirichlet_char(q,m); minv=pow(m,-1,q); chib=dirichlet_char(q,minv)
    a=chi.parity()
    val=lambda n: complex(chi(n))
    tau=sum(val(n)*cmath.exp(2j*math.pi*n/q) for n in range(1,q) if math.gcd(n,q)==1)
    eps=tau/((1j)**a*math.sqrt(q))
    order=1
    while pow(m,order,q)!=1: order+=1
    out=[]
    L=lambda s: complex(chi.l(acb(s.real,s.imag))); Lb=lambda s: complex(chib.l(acb(s.real,s.imag)))
    def lgam_im(s):
        z=acb((s.real+a)/2,s.imag/2).lgamma(); return float(z.imag)
    theta=lambda s: (s.imag/2)*math.log(q/math.pi)+lgam_im(s)
    # grids shared by both omega
    nt=int(round((T-t0)/h)); ts=[t0+k*h for k in range(nt+1)]
    line={}
    for sg in (0.5,0.75,1.0):
        line[sg]=[(L(complex(sg,t)),Lb(complex(sg,t))) for t in ts]
    res=[]
    for om in (1,-1):
        # c/conj(c) = om*conj(eps), a(1)=c+conj(c)=1  -> c = e^{i th}/(2 cos th), e^{2 i th} = om*conj(eps)
        th=cmath.phase(om*eps.conjugate())/2
        if abs(math.cos(th))<1e-9: continue
        c=cmath.exp(1j*th)/(2*math.cos(th))
        F=lambda s: c*L(s)+c.conjugate()*Lb(s)
        Fl=lambda sg,k: c*line[sg][k][0]+c.conjugate()*line[sg][k][1]
        # sigma1 with |F-1| <= 2|c|(zeta(sigma1)-1) < 0.5
        s1=3.0
        while 2*abs(c)*(float(arb(s1).zeta())-1)>0.4: s1+=0.5
        # --- critical line: Z_F real
        Z=[]; maxim=0
        for k,t in enumerate(ts):
            w=cmath.exp(1j*theta(complex(0.5,t)))*Fl(0.5,k)
            if om==1: Z.append(w.real); maxim=max(maxim,abs(w.imag)/(abs(w)+1e-300))
            else: Z.append(w.imag); maxim=max(maxim,abs(w.real)/(abs(w)+1e-300))
        def Zf(t):
            w=cmath.exp(1j*theta(complex(0.5,t)))*F(complex(0.5,t)); return w.real if om==1 else w.imag
        non=0
        for k in range(nt):
            if Z[k]==0 or Z[k]*Z[k+1]<0: non+=1
        # close pairs: local minima of |Z| without sign change
        extra=0
        for k in range(1,nt):
            if Z[k-1]*Z[k]>0 and Z[k]*Z[k+1]>0 and abs(Z[k])<abs(Z[k-1]) and abs(Z[k])<abs(Z[k+1]):
                # only bother if it could plausibly reach zero (parabola through 3 pts)
                d1=(Z[k+1]-Z[k-1])/2; d2=Z[k+1]-2*Z[k]+Z[k-1]
                if d2!=0 and abs(Z[k]-d1*d1/(2*d2))<0.3*abs(Z[k])+1e-6 or abs(Z[k])<1e-3:
                    sub=[Zf(ts[k-1]+j*h/10) for j in range(21)]
                    extra+=sum(1 for j in range(20) if sub[j]*sub[j+1]<0)
        non+=extra
        # --- argument tracking helpers
        def darg_path(pts):
            tot=0; prev=pts[0]
            for z in pts[1:]:
                tot+=cmath.phase(z/prev); prev=z
            return tot
        def horiz(t,sa,sb,step=0.005):
            n=max(2,int(abs(sb-sa)/step)); return darg_path([F(complex(sa+(sb-sa)*j/n,t)) for j in range(n+1)])
        def vert(sg):
            if sg in line: return darg_path([Fl(sg,k) for k in range(nt+1)])
            return cmath.phase(F(complex(sg,T))/F(complex(sg,t0)))   # sigma1: |F-1|<0.5
        # zeros in [sg, s1] x [t0,T]:  (1/2pi) * (bottom sg->s1, right up, top s1->sg, left down)
        def count_right(sg):
            tot=horiz(t0,sg,s1)+vert(s1)+horiz(T,s1,sg)-vert(sg)
            return tot/(2*math.pi)
        # total zeros of Lambda_F with t0<Im<T: 2*(right half incl. gamma factor) ; on-line zeros counted once
        # arg Lambda_F along right-half path from 1/2+it0 to 1/2+iT:
        dLam=(theta(complex(0.5,T))-theta(complex(0.5,t0)))+horiz(t0,0.5,s1)+vert(s1)+horiz(T,s1,0.5)
        Ntot=dLam/math.pi
        n75=count_right(0.75); n1=count_right(1.0)
        res.append({'q':q,'m':m,'order':order,'parity':a,'omega':om,'T':T,'theta_c':th,'abs_c':abs(c),
                    'target':cmath.phase(-om*eps.conjugate()),
                    'euler_density':(2/order if order%2==0 else 1/order),
                    'N_total':Ntot,'N_online':non,'N_off':round(Ntot)-non,'close_pair_extra':extra,
                    'N_right_075':n75,'N_right_1':n1,'reality_defect':maxim,'sigma1':s1})
    return res

if __name__=='__main__':
    q,m,T=int(sys.argv[1]),int(sys.argv[2]),float(sys.argv[3])
    for r in run(q,m,T): print(json.dumps(r),flush=True)
