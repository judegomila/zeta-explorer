"""Rigorous compact certificates for two theta Wronskian signs.

Reuses the rigorously bounded theta jets and C endpoints of PR #51.
The origin uses the even coordinate u=t^2. The core uses full Taylor
models, including every polynomial product and absolute C remainders.
"""
from fractions import Fraction as Q
from itertools import permutations
from math import factorial
import json
from flint import arb,arb_poly,ctx

from theta_ratio_c_integral_20261110 import C_point
from theta_ratio_core_certificate_20261110 import ThetaJets,rat,ball
from theta_ratio_origin_certificate_20261110 import (
    coefficients,polynomial_derivative,evaluate,kappa_remainder,error_ball)

PERMS=[]
for p in permutations(range(4)):
    sign=(-1)**sum(p[i]>p[j] for i in range(4) for j in range(i+1,4))
    PERMS.append((p,sign))

def det4(columns):
    ans=0
    for p,sign in PERMS:
        term=sign
        for i in range(4):term*=columns[p[i]][i]
        ans+=term
    return ans

def core_numerators(t,k,C):
    col0=k[:4]
    col1=[t*k[1],k[1]+t*k[2],2*k[2]+t*k[3],3*k[3]+t*k[4]]
    col2=k[2:6]
    colC=[4*C,-t*k[0],-(k[0]+t*k[1]),-(2*k[1]+t*k[2])]
    colP=[t*k[3],k[3]+t*k[4],2*k[4]+t*k[5],3*k[5]+t*k[6]]
    return det4([col0,col1,col2,colC]),16*det4([col0,col1,col2,colP])

def origin_numerators(u,k,C):
    col0=k[:4]
    colB=[-(2*j+1)*k[j]-2*u*k[j+1] for j in range(4)]
    colJ=[(8+16*j)*k[j+1]+16*u*k[j+2] for j in range(4)]
    # The first returned numerator is 8*K^4*W_u(B_u,J_u,-H_u).
    colH=[-8*C,k[0],k[1],k[2]]
    colP=[-24*k[1]-96*u*k[2]-32*u*u*k[3],
          -120*k[2]-160*u*k[3]-32*u*u*k[4],
          -280*k[3]-224*u*k[4]-32*u*u*k[5],
          -504*k[4]-288*u*k[5]-32*u*u*k[6]]
    return det4([col0,colB,colJ,colH]),det4([col0,colB,colJ,colP])

def audit():
    import sympy as s
    x=s.symbols('x');k=s.Function('k')(x);C=s.Function('C')(x)
    B=-1-x*s.diff(k,x)/k;J=4*s.diff(k,x,2)/k
    H=C/k;P=-4*x*s.diff(k,x,3)/k-12*s.diff(k,x,2)/k
    def wr(fs):return s.det(s.Matrix([[s.diff(f,x,j) for f in fs] for j in range(len(fs))]))
    out=core_numerators(x,[s.diff(k,x,j) for j in range(7)],C)
    subs={s.diff(C,x,3):-(2*s.diff(k,x)+x*s.diff(k,x,2))/4,
          s.diff(C,x,2):-(k+x*s.diff(k,x))/4,s.diff(C,x):-x*k/4}
    for target,num in zip([-H,P],out):
        assert s.cancel((wr([s.diff(B,x),s.diff(J,x),s.diff(target,x)])-num/k**4).subs(subs))==0
    Bu=-1-2*x*s.diff(k,x)/k;Ju=(8*s.diff(k,x)+16*x*s.diff(k,x,2))/k
    Pu=(-24*s.diff(k,x)-96*x*s.diff(k,x,2)-32*x*x*s.diff(k,x,3))/k
    out=origin_numerators(x,[s.diff(k,x,j) for j in range(7)],C)
    subs={s.diff(C,x,j):-s.diff(k,x,j-1)/8 for j in range(1,4)}
    for target,num,den in zip([-H,Pu],out,[8,1]):
        assert s.cancel((wr([s.diff(Bu,x),s.diff(Ju,x),s.diff(target,x)])-num/(den*k**4)).subs(subs))==0
    return 4

def origin_certificate(degree=24,terms=16,cells=128):
    C0=C_point(0);upper=arb(1)/64
    b,theta_tail=coefficients(degree,terms)
    polys=[polynomial_derivative(b,j) for j in range(7)]
    errors=[kappa_remainder(j,degree,upper) for j in range(7)]
    integral=[arb(0)]+[b[k]/(k+1) for k in range(degree+1)]
    integral_error=40000*4**(degree+1)*upper**(degree+2)/(degree+2)/(1-4*upper)
    names=['W_H_over_64t6','W_P_over_64t6'];mins={name:None for name in names}
    # Preserve the shared u variable through the determinant before
    # interval evaluation, so exact polynomial cancellations are retained.
    Kmodels=[arb_poly(polys[j])+arb_poly([error_ball(errors[j])]) for j in range(7)]
    Cmodel=arb_poly([C0])-arb_poly(integral)*(arb(1)/8)+arb_poly([error_ball(integral_error/8)])
    numerators=origin_numerators(arb_poly([arb(0),arb(1)]),Kmodels,Cmodel)
    for i in range(cells):
        u=arb(2*i+1)/(128*cells)+ball(arb(1)/(128*cells))
        K0=Kmodels[0](u)
        assert K0>0
        vals=[p(u) for p in numerators]
        for name,value,den in zip(names,vals,[8,1]):
            if not value>0:raise AssertionError(f'{name} failed origin cell {i}: {value}')
            lo=(value/(den*K0**4)).lower()
            if mins[name] is None or lo<mins[name]:mins[name]=lo
    return {'status':'passed','domain':'0<t<=1/8','coordinate':'u=t^2',
            'degree':degree,'theta_terms':terms,'cells':cells,'precision_bits':ctx.prec,
            'lower_bounds':{k:str(v) for k,v in mins.items()},'C0':str(C0),
            'conversion':"W_t(B',J',Q')=64*t^6*W_u(B_u,J_u,Q_u)",
            'scope':'Rigorous interval certificate, all theta and Taylor tails included.'}

def core_certificate(order=14,terms=16):
    jet=ThetaJets(order+6,terms)
    right=Q(4);stop=Q(1,8);Cright=C_point(4);initial_C=Cright
    names=['W_H','W_P'];mins={name:None for name in names};cells=0;widths={}
    while right>stop:
        step=Q(1,64)
        while not rat(step)*arb.pi()*rat(right).exp()<=arb(1)/8:step/=2
        step=min(step,right-stop);left=right-step
        center=rat((right+left)/2);half=rat(step/2);delta=ball(half)
        jm=jet(center);jb=jet(center+delta)
        tpoly=arb_poly([center,arb(1)])
        ktrunc=arb_poly([jm[m]/factorial(m) for m in range(order)])
        integ=(tpoly*ktrunc*(arb(1)/4)).integral()
        rem=rat(right)*abs(jb[order]).upper()/(4*factorial(order)*(order+1))
        E=rem*half**(order+1)
        Cmid=Cright+integ(half)+ball(E)
        Cleft=Cright+integ(half)-integ(-half)+ball(2*E)
        assert Cmid>0 and Cleft>0
        Cpoly=arb_poly([Cmid])-integ+arb_poly([arb(0)]*(order+1)+[ball(rem)])
        K=[]
        for j in range(7):
            K.append(arb_poly([jm[j+m]/factorial(m) for m in range(order)]+[jb[j+order]/factorial(order)]))
        vals=[p(delta) for p in core_numerators(tpoly,K,Cpoly)]
        upperk=jet(rat(left),0)[0].upper()
        for name,value in zip(names,vals):
            if not value>0:raise AssertionError(f'{name} failed on [{left},{right}]: {value}')
            lo=(value/upperk**4).lower()
            if mins[name] is None or lo<mins[name]:mins[name]=lo
        Cright=Cleft;right=left;cells+=1;widths[str(step)]=widths.get(str(step),0)+1
    direct=C_point(rat(stop));assert Cright.overlaps(direct)
    return {'status':'passed','domain':'1/8<=t<=4','cells':cells,'Taylor_order':order,
            'theta_terms':terms,'precision_bits':ctx.prec,'cell_widths':widths,
            'lower_bounds':{k:str(v) for k,v in mins.items()},'C4':str(initial_C),
            'C_at_1_over_8_propagated':str(Cright),'C_at_1_over_8_direct':str(direct),
            'scope':'Rigorous full Taylor models; no product truncation or sampled sign inference.'}

def run():
    ctx.prec=256
    exact=audit()
    origin=origin_certificate()
    core=core_certificate()
    return {'status':'passed','exact_numerator_checks':exact,'origin':origin,'core':core,
            'global_scope':'This file covers 0<t<=4; the infinite tail needs a separate analytic proof.'}

if __name__=='__main__':print(json.dumps(run(),indent=2,sort_keys=True))
