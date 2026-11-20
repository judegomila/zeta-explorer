"""Rigorous all-anchor certificate for the second canonical theta origin gate.

Analytic divided-difference and tail arguments are in the companion note.
Uses the prior theta helper; positive spatial tails are explicit here.
"""
from math import factorial
import json
from flint import arb,acb,arb_poly,ctx
from theta_preservation_origin_20261110 import Theta, positive_error

def finite_integral(theta,weight,T=8):
    result=acb(0)
    for j in range(T):
        result+=acb.integral(lambda z,analytic:theta.finite(z)*weight(z),j,j+1,
                            rel_tol=arb(2)**-200,abs_tol=arb(2)**-200,
                            deg_limit=120,eval_limit=100000,depth_limit=30)
    assert result.imag.contains(0)
    return result.real

def moment(theta,m,A=200,T=8):
    # Coefficients of E(A*b) and O(A*b), scaled so no large power A^m
    # multiplies a fixed absolute quadrature tolerance afterwards.
    fac=(arb(A)/2)**m/factorial(m)
    val=finite_integral(theta,lambda z:fac*z**m,T)
    # Uniform omitted theta terms on [0,T], integrated against t^m.
    val+=positive_error(theta.tail0()*fac*arb(T)**(m+1)/(m+1))
    jets=theta.jets(T);rate=-jets[1]/jets[0]
    assert rate>0
    # Q'>0 => V' increasing, so kappa(T+s)<=kappa(T)exp(-rate*s).
    tail=arb(0)
    for j in range(m+1):
        tail+=(arb(A)/2)**m*arb(T)**(m-j)/(factorial(m-j)*rate**(j+1))
    val+=positive_error(jets[0]*tail)
    assert val>0
    return val

def derivative_poly(coeffs,j):
    return arb_poly([coeffs[k]*factorial(k)/factorial(k-j) for k in range(j,len(coeffs))])

def certify_compact(return_models=False):
    K=300;A=200;limit=100;cells=2048
    ctx.prec=384
    th=Theta(6,16);jets=th.jets(0);k0=jets[0];c=-jets[2]/k0
    beta=jets[4]/k0
    assert c>0 and c<arb('4.7')
    assert beta>arb('56.8') and beta<57
    # Every proof replay recomputes the coefficients. No external moment
    # cache or diagnostic decimal is accepted as a certificate input.
    coeffs=[]
    for m in range(2*K+2):
        coeffs.append(moment(th,m,A))
    # E(A) bounds all positive e/o coefficient sums. The tilted spatial
    # tail is valid because the rate V'(8)-A/2 is checked positive.
    lam=arb(A)/2
    E=finite_integral(th,lambda z:(lam*z).cosh())
    E+=positive_error(8*th.tail0()*(8*lam).exp())
    j4=th.jets(8);rate=-j4[1]/j4[0]-lam
    assert rate>0
    E+=positive_error(j4[0]*(8*lam).exp()/rate)
    xmax=arb(limit)**2/A**2
    assert xmax<=arb(1)/4
    model=[];errors=[]
    for parity in [0,1]:
        arr=coeffs[parity::2]
        polys=[]
        for j in range(3):
            poly=derivative_poly(arr,j)
            first=K+1
            rho=xmax*(first+1)/(first+1-j)
            assert rho<1
            err=E*arb(factorial(first)//factorial(first-j))*xmax**(first-j)/(1-rho)
            poly+=arb_poly([arb(0,err)])
            polys.append(poly);errors.append(str(err))
        model.append(polys)
    (e,ep,epp),(o,op,opp)=model
    x=arb_poly([0,1]);K0=2*k0*A;A2=A*A
    P=e*o+2*x*(e*op-ep*o)
    Pd=-ep*o+3*e*op+2*x*(e*opp-epp*o)
    Q=Pd*e-P*ep
    T=e+2*x*ep
    S=2*e*ep+2*x*(e*epp-ep*ep)
    G=K0*Q*((A2*x+4*c)*S-A2*T*e)-(A2*P*e-K0*S)**2
    minimum_D=None;maximum_Nx=None
    for i in range(cells):
        lo=xmax*i/cells;hi=xmax*(i+1)/cells
        xx=(lo+hi)/2+arb(0,(hi-lo)/2)
        ev=e(xx);qv=Q(xx);gv=G(xx)
        assert ev>0,(i,ev)
        assert qv<0,(i,qv)
        assert gv>0,(i,gv)
        D=gv/(K0**2*ev**4)/A**4 # D with respect to q=a^2.
        Nx=qv/(K0*ev**2)/A**2
        assert D>0 and Nx<0
        if minimum_D is None or D.lower()<minimum_D:minimum_D=D.lower()
        if maximum_Nx is None or Nx.upper()>maximum_Nx:maximum_Nx=Nx.upper()
    p100=(arb(200)/A**2)*ep(arb(100)**2/A**2)/e(arb(100)**2/A**2)
    assert p100>1
    assert minimum_D>arb('1.12e-10')
    assert maximum_Nx<arb('-4.34e-7')
    result={'status':'passed','anchor_interval':f'0<a<={limit}','polynomial_degree':K,
            'auxiliary_anchor_A':A,'cells':cells,'precision_bits':ctx.prec,
            'kappa0':str(k0),'c_theta':str(c),'kappa4_over_kappa0':str(beta),
            'E_A':str(E),'p100':str(p100),'recomputed_moment_count':len(coeffs),
            'cleared_polynomial_degrees':{'N_derivative':Q.degree(),'D':G.degree()},
            'model_remainders':errors,'minimum_D_q':str(minimum_D),
            'maximum_N_q':str(maximum_Nx),
            'claim':f'J_2\'\'(0)>0 for all first and second anchors in (0,{limit}], including equal anchors; tail result is separate.'}
    if return_models:
        # A companion certificate can reuse exactly these freshly computed
        # enclosures without reading a file or recomputing the 602 moments.
        return result,{'e':e,'ep':ep,'epp':epp,'o':o,'op':op,'opp':opp,
                       'P':P,'T':T,'K0':K0,'kappa0':k0,'c':c,'beta':beta,
                       'A':A,'xmax':xmax,'theta':th,'theta_jets0':jets,
                       'raw_moment_coefficients':coeffs,'moment_sum_bound':E}
    return result

def exact_tail_checks():
    """Exact algebra and rational inequalities in the analytic tail proof.

    The fixed M=1500 bound on the entire real line is a previously proved
    theta theorem from PR #52, not inferred from the local jet evaluation.
    """
    import sympy as s
    a,p,l,g,k,h,v=s.symbols('a p l g k h v')
    d=1+a*p;dp=p+a*l
    N=d/a**2-4*g*(d+2)/a**4+16*k*(d+4)/a**6
    Nd=s.diff(N,a)+s.diff(N,p)*l
    D=Nd*((a*a+4*g)*dp-2*a*d)-(2*a*N-dp)**2
    expanded=(16*(k-g*g)*h*h/a**4+192*(k-g*g)*h/a**5
              +(64*g*k*h*(3*h+2*v)+320*k-576*g*g)/a**6
              +256*g*k*(s.Rational(17,2)*h+v)/a**7
              +(7680*g*k-1024*k*k*(h+v)**2)/a**8
              -10240*k*k*(h+v)/a**9-25600*k*k/a**10)
    assert s.factor(D.subs({p:h+v,l:v/a})-expanded)==0
    A=s.Integer(100);M=s.Integer(1500);gu=s.Rational(47,10)
    kl=s.Rational(284,5);ku=s.Integer(57)
    assert 320*kl-576*gu**2>0
    assert 128*(1+7/A)<140
    assert 64*(15+112/A)<1040
    assert 1+4/A+12*gu/A**2<2
    assert 1+4/A+16*gu/A**2+48*gu/A**3+64*ku/A**4+320*ku/A**5<2
    margin=(16*(kl-gu*gu)-4096*ku**2/A**4-40960*ku**2/A**5
            -102400*ku**2/A**6-3200*M/A**2-78400*M*M/A**8)
    assert margin>75
    derivative_margin=1-24*gu/A**2-96*gu/A**3-16*ku/A**4-1040*M/A**6
    assert derivative_margin>s.Rational(98,100)
    # Dirichlet-series majorant for s>=100. Its bracket decreases;
    # (s-1)^2*2^(-s) decreases because log(2)>1/2>2/(s-1).
    assert 1+2/(A-1)+4/(A-1)**2+4/(A-1)**3<s.Rational(3,2)
    assert s.Rational(3,2)*(A-1)**2/2**A<1
    assert 2/(A-1)<s.Rational(1,2)
    # Generic endpoint formula and reduced one-variable gate.
    n,nd,dd,c,N0,cr,B0,B2,J0=s.symbols('n nd dd c N0 cr B0 B2 J0')
    Y=a*a*n-d;Yp=2*a*n+a*a*nd-dp
    Zp=2*a*Y+a*a*Yp+4*g*dp
    assert s.factor(nd*Zp-Yp**2-(nd*((a*a+4*g)*dp-2*a*d)-(2*a*n-dp)**2))==0
    delta=cr-B0
    M2=((c*c-J0)*N0-delta)/4
    endpoint=B2/N0+delta*M2/N0**2
    assert s.factor(endpoint-((4*B2+delta*(c*c-J0))*N0-delta**2)/(4*N0**2))==0
    return {'status':'passed','exact_checks':13,'tail_anchor_start':100,
            'D_margin_coefficient':str(margin),'N_derivative_coefficient':str(derivative_margin),
            'sixth_derivative_bound_dependency':{'M':1500,'source_pr':52,
              'source_commit':'a24e261deae84bf2a06b6c33a7fbdfe95db2b803'},
            'conclusion':'D(a)>75[p(a)-a*p_prime(a)]^2/a^4 and N_prime(a)<0 for a>=100.'}

if __name__=='__main__':
    if not __debug__:
        raise RuntimeError('Do not run a proof certificate with Python -O.')
    out={'compact':certify_compact(),'tail':exact_tail_checks(),
         'status':'passed','conclusion':"J_2''(0)>0 for all a,c>0, including coincident anchors.",
         'scope':'Origin slope after the second canonical theta reduction; no all-depth or RH conclusion.'}
    with open('theta_second_origin_replay_20261111.json','w') as f:json.dump(out,f,indent=2)
    print(json.dumps(out,indent=2))
