from flint import *
import json, sys
ctx.prec=128
PI=acb.pi()
res={}
for (q,n) in ((5,2),(7,3),(7,2),(11,2),(13,2)):
    chi=dirichlet_char(q,n); chib=dirichlet_char(q,pow(n,-1,q)); k=chi.parity()
    def R(t):
        s=acb(0.5,t); gm=((s+k)/2).gamma()
        return PI**(-s)*gm*gm*acb(q)**s*chi.l(s)*chib.l(s)/abs(gm)**2
    T=40.0; N=16000
    grid=[-T+2*T*i/N for i in range(N+1)]
    zv=[chi.hardy_z(acb(t)).real for t in grid]
    zeros=[]
    for i in range(N):
        if (zv[i]>0 and zv[i+1]<0) or (zv[i]<0 and zv[i+1]>0):
            a,b=grid[i],grid[i+1]; fa=zv[i]
            for _ in range(60):
                m=0.5*(a+b); fm=chi.hardy_z(acb(m)).real
                if (fm>0)==(fa>0): a,fa=m,fm
                else: b=m
            zeros.append(0.5*(a+b))
    # smallest |Z| local minima without sign change (possible double zeros / missed pairs)
    tests=[0.37+39.5*i/60 for i in range(61)]
    ok=bad=0; fails=[]; neg=0; mdef=0.0; imax=0.0
    for t in tests:
        r=R(t); cnt=sum(1 for g in zeros if -t<g<t); sgn=1 if r.real>0 else -1
        neg+= sgn<0
        if sgn==(-1)**cnt: ok+=1
        else:
            bad+=1; fails.append((t,cnt,[g for g in zeros if abs(abs(g)-t)<0.05]))
        mdef=max(mdef, float(abs(abs(r)-(arb(q)/arb.pi()).sqrt()*abs(chi.l(acb(0.5,t)))*abs(chi.l(acb(0.5,-t)))).upper()))
        hz=chi.hardy_z(acb(t)).real*chi.hardy_z(acb(-t)).real
        imax=max(imax, float(abs(r.real-(arb(q)/arb.pi()).sqrt()*hz).upper()), float(abs(r.real+(arb(q)/arb.pi()).sqrt()*hz).upper()) if False else 0)
    res['chi%d.%d'%(q,n)]=dict(parity=k,R_at_0=float(R(0.0).real.mid()),zeros_on_line_with_abs_ordinate_below_40=len(zeros),heights=len(tests),sign_rule_holds=ok,sign_rule_fails=bad,fails=fails,negative_entries=int(neg),modulus_defect=mdef, max_abs_R_minus_sqrt_q_over_pi_Z_t_Z_minus_t=imax)
print(json.dumps(res,indent=1)); json.dump(res,open(sys.argv[1],'w'),indent=1)
