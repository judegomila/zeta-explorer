#!/usr/bin/env python3
"""Rigorous finite-box boundary certificate, not an RH proof. See PROOF.md."""
import argparse, json, math, platform, time
from pathlib import Path
from fractions import Fraction as Q
from flint import arb, acb, acb_poly, ctx
import flint
p=argparse.ArgumentParser(); p.add_argument('--bits',type=int,default=384);p.add_argument('--output',default='certificate.json');args=p.parse_args()
ctx.prec=args.bits
J=112;K=24;N=7;pi=arb.pi();t0=arb(4)/15;x0=arb(210);T=arb(1)/15;X=arb(10)
scale=arb(10)**35
# Finite integral moments/derivatives are always computed by analytic rigorous quadrature.
def integrand(u,analytic,m,t=t0,x=x0):
    e4=(4*u).exp();e5=(5*u).exp();e9=(9*u).exp()
    phi=sum((2*pi*pi*n**4*e9-3*pi*n*n*e5)*(-pi*n*n*e4).exp() for n in range(1,N+1))
    osc=(x*u).cos() if m%2==0 else (x*u).sin()
    return (-1)**((m+1)//2)*u**m*(t*u*u).exp()*phi*osc

def integral(m,t=t0,x=x0):
    r=acb.integral(lambda u,a:integrand(u,a,m,t,x),0,1,abs_tol=arb('1e-85'),rel_tol=arb('1e-80'),eval_limit=200000,depth_limit=40)
    assert r.is_finite() and r.imag.contains(0)
    return r.real

st=time.time()
D=[integral(m) for m in range(J+2*K+2)]
print('Derivative quadratures:',len(D),'seconds:',time.time()-st,flush=True)
# Truncation bounds. The finite positive kernel mass at t0 on [0,1] < 20000.
M=2*pi*pi*arb('9.5').exp()*sum(arb(n)**4*(-pi*n*n).exp() for n in range(1,N+1))
assert M<20000
series_tail=2*pi*pi*arb('9.5').exp()*(N+1)**4*(-pi*(N+1)**2).exp()/(1-16*(-pi*(2*N+3)).exp())
A=pi*arb(4).exp()
u_tail=2*pi*pi*arb('9.5').exp()*(-A).exp()/(500*(1-4*(-3*A).exp()))
taylor_tail=M*T.exp()*(T**(K+1)/math.factorial(K+1)+X**(J+1)/math.factorial(J+1))
E=(series_tail+u_tail+taylor_tail)*scale
assert E<arb('1e-12')
print('Per-component scaled remainder:',E,flush=True)
C=[[acb(D[j+2*k],D[j+2*k+1])*((-1)**k)*scale/(math.factorial(j)*math.factorial(k)) for j in range(J+1)] for k in range(K+1)]
# Edge polynomials in a real parameter delta-t or delta-x.
def xpoly(dt):
    return acb_poly([sum(C[k][j]*dt**k for k in range(K+1)) for j in range(J+1)])
def tpoly(dx):
    return acb_poly([sum(C[k][j]*dx**j for j in range(J+1)) for k in range(K+1)])
# Counterclockwise in coordinate order (t,x).
edges=[('x=200',tpoly(-X),-Q(1,15),Q(1,15)),('t=1/3',xpoly(T),Q(-10),Q(10)),('x=220',tpoly(X),Q(1,15),-Q(1,15)),('t=1/5',xpoly(-T),Q(10),Q(-10))]
def ball(q):return arb(q.numerator)/q.denominator
def exact_box(z):return {name:[str(v.lower().fmpq()),str(v.upper().fmpq())] for name,v in [('real',z.real),('imag',z.imag)]}
def inflate(z):
    return acb(arb(z.real,E.upper()),arb(z.imag,E.upper()))
def value(poly,s): return inflate(poly(ball(s)))
segments=[];vertices=[];lowest=None
# Compose into midpoint coordinates to avoid interval dependency on a long edge.
def cover(label,poly,a,b,depth=0):
    global lowest
    assert depth<30,'Boundary resolution limit reached'
    mid=(a+b)/2;rad=abs(b-a)/2
    local=poly(acb_poly([acb(ball(mid)),acb(1)]))
    box=inflate(local(acb(arb(0,ball(rad).upper()))))
    # A Cartesian rectangle excluding the origin is convex and supports a straight-line homotopy.
    if not box.real.contains(0) or not box.imag.contains(0):
        va=value(poly,a);vb=value(poly,b)
        assert not va.contains(0) and not vb.contains(0)
        # The same rectangle contains endpoints and all true field values on this segment.
        # It lies in one open coordinate half-plane; thus principal argument increment is correct.
        inc=(vb/va).arg()
        assert inc.is_finite()
        margin=max([arb(0)]+[v.lower() if v>0 else -v.upper() if v<0 else arb(0) for v in [box.real,box.imag]])
        assert margin>0
        if lowest is None or margin<lowest:lowest=margin
        segments.append({'edge':label,'a':str(a),'b':str(b),'box':str(box),'box_exact':exact_box(box),'margin_scaled':str(margin),'argument_increment':str(inc)})
        vertices.append((va,vb,inc))
    else:
        cover(label,poly,a,mid,depth+1);cover(label,poly,mid,b,depth+1)
for label,poly,a,b in edges:
    old=len(segments);cover(label,poly,a,b)
    print(label,'certified segments:',len(segments)-old,flush=True)
# All vertices used are enclosures of one actual continuous closed field. Each increment
# encloses its unique half-plane lift. Summing encloses exactly 2*pi times integer winding.
angle=sum(v[2] for v in vertices)
winding=angle/(2*pi)
assert winding>arb('-0.5') and winding<arb('0.5'), 'Zero winding not established'
print('Winding enclosure:',winding,flush=True)
print('Certified winding: 0; minimum scaled boundary norm:',lowest,flush=True)
# Independent of any collision index theorem: cover the entire real rectangle.
interior=[]
def cover_interior(a,b,c,d,depth=0):
    assert depth<25
    xm=(a+b)/2; xr=abs(b-a)/2; tm=(c+d)/2;tr=abs(d-c)/2
    xarg=acb(arb(0,ball(xr).upper()))
    # Shift each x-polynomial before bounding it, retaining time as a polynomial.
    ck=[acb_poly(row)(acb_poly([acb(ball(xm)),acb(1)]))(xarg) for row in C]
    tp=acb_poly(ck)(acb_poly([acb(ball(tm)),acb(1)]))
    box=inflate(tp(acb(arb(0,ball(tr).upper()))))
    if not box.real.contains(0) or not box.imag.contains(0):
        margin=max([arb(0)]+[v.lower() if v>0 else -v.upper() if v<0 else arb(0) for v in [box.real,box.imag]])
        assert margin>0
        interior.append({'dx_a':str(a),'dx_b':str(b),'dt_c':str(c),'dt_d':str(d),'box':str(box),'box_exact':exact_box(box),'margin_scaled':str(margin)})
    else:
        # First reduce space; split time only if its relative width dominates.
        if abs(b-a)/20 >= abs(d-c)/(Q(2,15)):
            cover_interior(a,xm,c,d,depth+1);cover_interior(xm,b,c,d,depth+1)
        else:
            cover_interior(a,b,c,tm,depth+1);cover_interior(a,b,tm,d,depth+1)
cover_interior(Q(-10),Q(10),-Q(1,15),Q(1,15))
print('Interior: all',len(interior),'closed rectangles exclude G=0 directly.',flush=True)
result={'claim':'G=H+i H_x is nonzero on the complete boundary, with winding zero, for [1/5,1/3] x [200,220], coordinate order (t,x). Not RH.','python':platform.python_version(),'python_flint':flint.__version__,'bits':args.bits,'J':J,'K':K,'N':N,'center':['4/15','210'],'scale':'10^35','finite_mass_upper_expression':str(M),'series_tail':str(series_tail),'u_tail':str(u_tail),'taylor_tail':str(taylor_tail),'scaled_component_error':str(E),'derivative_enclosures':[str(d) for d in D],'segments':segments,'winding_interval':str(winding),'winding_integer':0,'min_scaled_boundary_norm':str(lowest),'interior_cells':interior,'elapsed_seconds':time.time()-st}
Path(args.output).write_text(json.dumps(result,indent=2)+'\n')
print('PASS: complete continuous-boundary certificate saved to',args.output,flush=True)
