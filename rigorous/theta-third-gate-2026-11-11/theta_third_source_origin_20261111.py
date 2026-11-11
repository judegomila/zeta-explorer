"""Rigorous compact-anchor origin tests for the second-reduced theta sources.

Default recomputes all 602 positive moments. This is an origin test, not
a proof on positive spatial points or on anchors exceeding 100.
"""
import argparse
import json
import sympy as sp
from flint import arb, arb_poly, ctx
from theta_second_origin_20261111 import certify_compact as prior_compact
from theta_second_source_origin_compact_20261111 import to_ball_polynomial


def source_expressions():
    v,N,d,c,b,g,h=sp.symbols('v N d c b g h')
    K1=-c/2;K2=b/12;K3=g/120
    U1=(v*N-d)/8-K1*N
    U2=(v*(v*N-d)+4*c*(d+2))/192-2*K1*U1-K2*N
    U3=(v*(v*(v*N-d)+4*c*(d+2))-16*b*(d+4))/7680-3*K1*U2-3*K2*U1-K3*N
    H1=-sp.Rational(1,8)-K1*h
    H2=-K1/8-2*K1*H1-K2*h
    H3=-K2/8-3*K1*H2-3*K2*H1-K3*h
    B1=-2*K1
    B2=-4*(K2-K1*K1)
    B3=-6*(K3-3*K1*K2+2*K1**3)
    H0=sp.expand(4*(H2*H1*U1-H1**2*U2))
    Hs=sp.expand(4*((H3*H1-H2**2)*U1+H2*H1*U2-H1**2*U3))
    P0=sp.expand(4*(B1**2*U2-B2*B1*U1))
    Ps=sp.expand(4*(B1**2*U3-B2*B1*U2-(B3*B1-B2**2)*U1))
    triples=[]
    for expr in [H0,Hs,P0,Ps]:
        A=sp.diff(expr,N);B=sp.diff(expr,d);C=expr.subs({N:0,d:0})
        assert sp.expand(expr-A*N-B*d-C)==0
        triples.append((A,B,C))
    deflated=[]
    for A,B,C in triples[:2]:
        Z=sp.cancel((A*h+B+C)/v)
        assert sp.denom(Z).is_Integer
        deflated.append((A,B,Z))
    return {'variables':(v,c,b,g,h),'symbols':(N,d),
            'raw':(H0,Hs,P0,Ps),'triples':triples,'deflated':deflated,
            'theta_jets':(H1,H2,H3,B1,B2,B3),'ratio_jets':(U1,U2,U3)}


def exact_checks():
    info=source_expressions()
    v,c,b,g,h=info['variables'];N,d=info['symbols']
    u=sp.symbols('u')
    k=1-c*u/2+b*u*u/24+g*u**3/720
    n=N+(v*N-d)*u/8+(v*(v*N-d)+4*c*(d+2))*u*u/384
    n+=(v*(v*(v*N-d)+4*c*(d+2))-16*b*(d+4))*u**3/46080
    for j,expected in enumerate(info['ratio_jets'],1):
        assert sp.simplify(sp.diff(n/k,u,j).subs(u,0)-expected)==0
    C=h-u/8+c*u*u/32-b*u**3/576
    H=C/k;B=-1-2*u*sp.diff(k,u)/k
    for j in range(1,4):
        assert sp.simplify(sp.diff(H,u,j).subs(u,0)-info['theta_jets'][j-1])==0
        assert sp.simplify(sp.diff(B,u,j).subs(u,0)-info['theta_jets'][j+2])==0
    # Common positive scale is independent of anchor, so its square multiplies Omega.
    s,f0,f1,df0,df1=sp.symbols('s f0 f1 df0 df1')
    assert sp.expand(s*f0*s*df1-s*df0*s*f1-s*s*(f0*df1-df0*f1))==0
    # Deflating a common v factor removes exactly v^2 from the determinant.
    assert sp.expand(v*f0*(f1+v*df1)-(f0+v*df0)*v*f1-v*v*(f0*df1-df0*f1))==0
    return {'status':'passed','exact_checks':17,
            'scope':'Four affine identities, two exact H deflations, nine origin jet identities, and two determinant scaling identities.'}


def certify_compact(models=None,prior_summary=None,cells=4096):
    if models is None:
        prior_summary,models=prior_compact(return_models=True)
    assert ctx.prec>=384
    A=models['A'];A2=A*A;K=models['K0'];xmax=models['xmax']
    e,ep,epp,o,op,opp=[models[k] for k in ('e','ep','epp','o','op','opp')]
    p100=arb(200)*ep(xmax)/(A2*e(xmax))
    assert p100>arb('1.4') and p100<arb('1.402')
    raw=models['raw_moment_coefficients'];bound=models['moment_sum_bound']
    odd=raw[1::2]
    err0=bound*xmax**300/(1-xmax)
    err1=bound*300*xmax**299/(1-xmax*arb(301)/300)
    od=arb_poly(odd[1:])+arb_poly([arb(0,err0)])
    odp=arb_poly([j*odd[j+1] for j in range(1,300)])+arb_poly([arb(0,err1)])
    # Above coefficient at degree j-1 is j*odd[j+1].
    h=odd[0]/K
    k0=models['kappa0'];jets=models['theta_jets0']
    c=-jets[2]/k0;b=jets[4]/k0;g=jets[6]/k0
    info=source_expressions();variables=info['variables']
    pol=lambda expr:to_ball_polynomial(expr,variables,[c,b,g,h],A2)
    x=arb_poly([0,1]);P=models['P'];T=models['T']
    Pd=-ep*o+3*e*op+2*x*(e*opp-epp*o)
    Td=3*ep+2*x*epp
    V=e*od+2*(e*op-ep*o)
    Vd=ep*od+e*odp+2*(e*opp-epp*o)
    Hmodels=[];Pmodels=[]
    for aa,bb,zz in info['deflated']:
        aa,bb,zz=pol(aa),pol(bb),pol(zz)
        F=aa*V+2*K*bb*ep+A2*K*e*zz
        Fd=aa.derivative()*V+aa*Vd+2*K*(bb.derivative()*ep+bb*epp)+A2*K*(ep*zz+e*zz.derivative())
        Hmodels.append((F,Fd))
    for aa,bb,cc in info['triples'][2:]:
        aa,bb,cc=pol(aa),pol(bb),pol(cc)
        F=aa*P+K*bb*T+K*cc*e
        Fd=aa.derivative()*P+aa*Pd+K*(bb.derivative()*T+bb*Td)+K*(cc.derivative()*e+cc*ep)
        Pmodels.append((F,Fd))
    FH,FHd=Hmodels[0];GH,GHd=Hmodels[1]
    FP,FPd=Pmodels[0];GP,GPd=Pmodels[1]
    OH=FH*GHd-FHd*GH
    OP=FP*GPd-FPd*GP
    H1=pol(info['theta_jets'][0])[0]
    B1=pol(info['theta_jets'][3])[0]
    assert H1<0 and B1>0
    minima=[None]*4
    for i in range(cells):
        lo=xmax*i/cells;hi=xmax*(i+1)/cells
        xx=(lo+hi)/2+arb(0,(hi-lo)/2)
        ev=e(xx)
        assert ev>0,(i,'e',ev)
        vals=[FH(xx)/(A2*K*ev*H1**2),FP(xx)/(K*ev*B1**2),
              OH(xx)/(A**6*K*K*ev**2*H1**4),OP(xx)/(A2*K*K*ev**2*B1**4)]
        for j,z in enumerate(vals):
            assert z>0,(i,j,z)
            if minima[j] is None or z.lower()<minima[j]:minima[j]=z.lower()
    return {'status':'passed','anchor_interval':'0<a<=100','cells':cells,
            'precision_bits':ctx.prec,'fresh_moment_count':len(raw),
            'p100_for_tail':str(p100),
            'minimum_PhiH_over_a2':str(minima[0]),'minimum_PhiP':str(minima[1]),
            'minimum_OmegaH_over_a4':str(minima[2]),'minimum_OmegaP':str(minima[3]),
            'cleared_degrees':{'PhiH_deflated':FH.degree(),'PhiP':FP.degree(),'OmegaH_deflated':OH.degree(),'OmegaP':OP.degree()},
            'odd_deflation_remainders':[str(err0),str(err1)],
            'prior_second_origin_replay':prior_summary,
            'claim':'Both second-pair source Wronskians divided by t^6 have strictly positive spatial-origin limits for all anchor pairs in (0,100], including coincident anchors.',
            'scope':'Compact-anchor spatial-origin gate only. Positive spatial points and infinite anchor tails are separate.'}


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--exact',action='store_true');args=parser.parse_args()
    if not __debug__:raise RuntimeError('Do not disable assertions with Python -O.')
    out=exact_checks() if args.exact else certify_compact()
    print(json.dumps(out,indent=2),flush=True)
    if not args.exact:
        with open('theta_third_source_origin_replay_20261111.json','w') as f:json.dump(out,f,indent=2)
