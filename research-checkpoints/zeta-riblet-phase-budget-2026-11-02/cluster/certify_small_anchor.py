"""Ball-arithmetic certificate for the complete-theta small-anchor scalar sign.
See THETA_SMALL_ANCHOR.md for truncation bounds and the analytic t>=3 proof.
"""
import json,sys,time
import flint
from flint import arb,arb_series,ctx

BITS=192
DEN=int(sys.argv[1]) if len(sys.argv)>1 else 4096
ORDER=8
TERMS=8
ctx.prec=BITS
ctx.cap=ORDER+1
KERR=arb('1e-60')
KERR2=arb('1e-56')
MERR=arb('1e-56')

def controls():
    import sympy as s
    t=s.symbols('t',positive=True); ell=s.symbols('ell',positive=True)
    m=[s.Function('M'+str(j))(t) for j in range(4)]
    k=s.Function('k')(t)
    derivs={s.diff(m[j],t):-t**j*k for j in range(4)}
    J=m[1]/4
    B=ell*(m[1]-t*m[0])/4-(m[3]-2*t*m[2]+t*t*m[1])/32
    Bp=-ell*m[0]/4+(m[2]-t*m[1])/16
    assert s.simplify(s.diff(B,t).subs(derivs)-Bp)==0
    assert s.simplify(s.diff(Bp,t).subs(derivs)-(ell*k-J)/4)==0
    u=s.Function('u')(t);Q=u/t
    assert s.simplify(t**3*(Q*s.diff(Q,t,2)-2*s.diff(Q,t)**2)
                     -(t*(u*s.diff(u,t,2)-2*s.diff(u,t)**2)+2*u*s.diff(u,t)))==0
    e=s.symbols('e');gauss=lambda j:s.gamma(s.Rational(j+1,2))/2
    mm=[gauss(j)-e*gauss(j+6) for j in range(4)]
    D=2*mm[1]**2-4*mm[1]*mm[2]/mm[0]+mm[3]
    assert s.simplify(D.subs(e,0))==0
    assert s.simplify(s.diff(D,e).subs(e,0))==-s.Rational(3,4)
    # Explicit non-theta counterexample: e^(-t^2-epsilon*t^6).
    epsilon=arb(1)/10**6
    gm=lambda j:((arb(j)+1)/2).gamma()/2
    gmom=[]
    for j in range(4):
        low=gm(j)-epsilon*gm(j+6)
        width=epsilon**2*gm(j+12)/2
        gmom.append(low+arb(width/2,width/2))
    dd=2*gmom[1]**2-4*gmom[1]*gmom[2]/gmom[0]+gmom[3]
    assert dd<0
    # Constants used in the all-t>=3 analytic argument.
    assert arb.pi()*arb(3).exp()>60
    assert arb(2048000)*60**3/arb(2)**180<arb('1e-40')
    assert (arb(3)/2)**10/arb(2)**300<arb(1)/2
    assert (arb(10)/9)**10/arb(2)**57<arb(1)/2
    assert -60**2+17*60-6<0
    return dict(symbolic_identities='passed',tail_constants='passed',
                non_theta_counterexample_epsilon='1/1000000',counterexample_center_D=str(dd))

def kernel(t):
    ex=t.exp(); ans=0
    for m in range(1,TERMS+1):
        x=arb.pi()*m*m*ex
        ans+=x*(2*x-3)*(t/4-x).exp()
    return ans

def certify():
    assert DEN>0 and DEN&(DEN-1)==0
    assert arb(324)*9**8/arb(2)**243 < KERR
    assert arb(1944)*9**10/arb(2)**243 < KERR2
    assert arb.pi()*arb(5).exp()>400
    assert arb(8)*400**5/arb(2)**400 < arb('1e-100')
    assert 625*KERR+arb('1e-100')<MERR
    radius=arb(1)/(2*DEN)
    moments=[None]*(5*DEN+1)
    moments[-1]=[arb(0) for _ in range(4)]
    kernels=[None]*(3*DEN)
    mid_moments=[None]*(3*DEN)
    start=time.monotonic()
    for i in range(5*DEN-1,-1,-1):
        mid=arb(2*i+1)/(2*DEN)
        z=arb_series([mid,1],prec=ORDER+1)
        zz=arb_series([arb(mid,radius),1],prec=ORDER+1)
        exact=kernel(z); bounds=kernel(zz)
        if i<3*DEN: kernels[i]=(bounds[0],bounds[1],2*bounds[2],exact[0],exact[1])
        cell=[];half=[]
        for j in range(4):
            g=exact*z**j; gb=bounds*zz**j
            integ=sum(2*g[k]*radius**(k+1)/(k+1) for k in range(0,ORDER,2))
            rem=2*gb[ORDER].abs_upper()*radius**(ORDER+1)/(ORDER+1)
            cell.append(integ+arb(0,rem))
            half.append(sum(g[k]*radius**(k+1)/(k+1) for k in range(ORDER))+arb(0,rem/2))
        if i<3*DEN:mid_moments[i]=[moments[i+1][j]+half[j] for j in range(4)]
        moments[i]=[moments[i+1][j]+cell[j] for j in range(4)]
        if i%(DEN)==0: print('integrated to',i/DEN,flush=True,file=sys.stderr)
    full=[x+arb(0,MERR) for x in moments[0]]
    ell=full[2]/(4*full[0]);assert ell>arb(1)/25
    failures=[];mins=[None,None];counts=[0,0]
    for i in range(3*DEN):
        t=arb(arb(2*i+1)/(2*DEN),radius)
        M=[moments[i][j].union(moments[i+1][j])+arb(0,MERR) for j in range(4)]
        k,kp,kpp,kc,kpc=kernels[i]
        k+=arb(0,KERR);kp+=arb(0,KERR);kpp+=arb(0,KERR2)
        kc+=arb(0,KERR);kpc+=arb(0,KERR)
        J=M[1]/4
        assert J>0
        B=ell*(M[1]-t*M[0])/4-(M[3]-2*t*M[2]+t*t*M[1])/32
        Bp=-ell*M[0]/4+(M[2]-t*M[1])/16
        Nprime=-(B*(k+t*kp)+ell*k*J-J*J)/4
        if i<DEN//8:
            value=Nprime
            group=0
        else:
            mid=arb(2*i+1)/(2*DEN)
            mm=[v+arb(0,MERR) for v in mid_moments[i]]
            jc=mm[1]/4
            bc=ell*(mm[1]-mid*mm[0])/4-(mm[3]-2*mid*mm[2]+mid*mid*mm[1])/32
            bpc=-ell*mm[0]/4+(mm[2]-mid*mm[1])/16
            nprime_c=-(bc*(kc+mid*kpc)+ell*kc*jc-jc*jc)/4
            jp=-t*k/4;jpp=-(k+t*kp)/4;jppp=-(2*kp+t*kpp)/4
            bpp=(ell*k-J)/4;bppp=(ell*kp-jp)/4
            nsecond=Bp*jpp+B*jppp-bppp*J-bpp*jp
            value=-bpc*jc-mid*kc*bc/4+arb(0,radius)*nprime_c+arb(0,radius**2*nsecond.abs_upper()/2)
            group=1
        counts[group]+=1
        if not value>0:
            failures.append((i/DEN,str(value)))
        else:
            scaled=value/(J*J)
            if mins[group] is None or scaled.lower()<mins[group]:mins[group]=scaled.lower()
    if not failures:
        assert mins[0]>arb(3)/5000
        assert mins[1]>arb(1)/10000
    print(json.dumps(dict(status='passed' if not failures else 'unresolved',bits=BITS,mesh=f'1/{DEN}',
        theta_terms=TERMS,quadrature_taylor_degree=ORDER-1,remainder_derivative_order=ORDER,
        cutoff=5,kernel_and_first_derivative_tail=str(KERR),
        second_derivative_tail=str(KERR2),uniform_moment_tail=str(MERR),ell=str(ell),counts=counts,
        origin_test='Nprime>0 on [0,1/8], with exact N(0)=0',
        compact_test='N>0 on [1/8,3] by centered Taylor enclosure',
        analytic_tail='t>=3, by the accompanying monotone derivative-ratio proof',
        controls=controls(),
        min_normalized_lower=[str(v) for v in mins],failed_count=len(failures),first_failures=failures[:12],
        weaker_rational_lower_bounds={'Wprime/J^2 on [0,1/8]':'3/5000','W/J^2 on [1/8,3]':'1/10000'},
        elapsed_seconds=time.monotonic()-start,python_flint=flint.__version__),indent=2))
    return not failures
if __name__=='__main__':
    if not certify():sys.exit(1)
