#!/usr/bin/env python3
"""Finite theta-sum diagnostics for the boundary-flux kernel.

Point and confluent quadratic forms are evaluated using finite theta sums
and arbitrary-precision quadrature. There are no interval error bounds for
either truncation or quadrature, so these outputs are numerical diagnostics,
not rigorous kernel-positivity certificates. No signs are inferred from tiny
floating-point eigenvalues. The separate leading-model verifier uses exact
rational arithmetic independently of these numerical computations.
"""
import argparse, json, math, time
from fractions import Fraction
import mpmath as mp


def mul(a, b, n):
    return [sum(a[j] * b[k-j] for j in range(k+1)) for k in range(n)]


def div(a, b, n):
    out = []
    for k in range(n):
        out.append((a[k] - sum(b[j]*out[k-j] for j in range(1,k+1))) / b[0])
    return out


def exp_zeta(a, n):
    """Coefficients of exp[-a*zeta/(1-zeta)]."""
    out=[mp.mpf(1)]
    for k in range(1,n):
        out.append(-a*sum(j*out[k-j] for j in range(1,k+1))/k)
    return out


def exp_odd(a, n):
    """Coefficients of exp[a*2*atanh(zeta)]."""
    out=[mp.mpf(1)]
    for k in range(1,n):
        out.append(2*a*sum(out[k-j] for j in range(1,k+1,2))/k)
    return out


def theta_b_jet(L, n, max_theta_n):
    """κ(u)=2π² exp(9u/4−πe^u) B(u), u=L+2atanh(zeta)."""
    x=mp.exp(L)
    d=3/(2*mp.pi*x)
    inv_x=[mp.mpf(1)]+[2*(-1)**k for k in range(1,n)]
    ans=[mp.mpf(0)]*n
    for k in range(1,max_theta_n+1):
        b=mp.pi*(k*k-1)*x
        poly=[-d*k*k*c for c in inv_x]
        poly[0]+=k**4
        ejet=exp_zeta(2*b,n)
        term=mul(poly,ejet,n)
        amp=mp.exp(-b)
        for j in range(n):
            ans[j]+=amp*term[j]
    return ans


def leading_form(L,n):
    return 2*Fraction(L)*n-4*sum((Fraction(n-d,d) for d in range(1,n,2)),Fraction(0))


def scaled_flux_point(u,v,tau=0,dps=60,max_theta_n=5):
    """Numerically evaluate π Kτ(u,v)/(κτ(u)κτ(v)) for positive u,v.

    A separately implemented scalar quadrature, used to verify finite-point
    witnesses independently of the confluent-jet recurrence.
    """
    mp.mp.dps=dps
    u=mp.mpf(u); v=mp.mpf(v); tau=mp.mpf(tau)
    A=mp.pi*(mp.exp(u)+mp.exp(v)); r=(u+v)/2
    def b(x):
        ex=mp.exp(x)
        return sum((k**4-3*k*k/(2*mp.pi*ex))*mp.exp(-mp.pi*(k*k-1)*ex)
                   for k in range(1,max_theta_n+1))
    den=b(u)*b(v)
    def integrand(y):
        ell=mp.log1p(y/A)
        return (mp.exp(-y)*(r+ell)*mp.exp(mp.mpf('3.5')*ell+
                tau*((u+v)*ell+ell*ell)/8)*b(u+ell)*b(v+ell)/den)
    return 2*mp.pi/A*mp.quad(integrand,[0,1,5,20,80,mp.inf])


def exact_form(L,n,tau=0,dps=60,max_theta_n=4):
    """Actual transformed flux at u=L+2atanh(zeta), Taylor weights (-1)^j.

    F(u,v)=π K(u,v)/(κτ(u)κτ(v)); G=2 exp(L) F/[(1-zeta)(1-eta)].
    Leading G=(log x(zeta)+log x(eta))/(1-zeta*eta), x=exp(L)(1+zeta)/(1-zeta).
    Evaluates sum_{j,k<N} (-1)^{j+k} [zeta^j eta^k] G using a finite theta
    sum and non-interval quadrature. The historical function name identifies
    the source integral, not the rigor of its numerical evaluation.
    """
    mp.mp.dps=dps
    L=mp.mpf(L); tau=mp.mpf(tau)
    x=mp.exp(L); A=2*mp.pi*x
    denominator=theta_b_jet(L,n,max_theta_n)
    ujet=[L]+[mp.mpf(2)/j if j%2 else mp.mpf(0) for j in range(1,n)]
    oneover=[mp.mpf(1)]*n

    def integrand(y):
        ell=mp.log1p(y/A)
        b_ratio=div(theta_b_jet(L+ell,n,max_theta_n),denominator,n)
        # Factored common exp(-y/2) was removed from this jet.
        f=mul(mul(exp_zeta(y,n),oneover,n),b_ratio,n)
        if tau:
            f=mul(f,exp_odd(tau*ell/8,n),n)
        amp=mp.exp(9*ell/4+tau*(2*L*ell+ell*ell)/16)
        f=[amp*c for c in f]
        uf=mul(ujet,f,n)
        lf=sum((-1)**j*f[j] for j in range(n))
        luf=sum((-1)**j*uf[j] for j in range(n))
        return 2*mp.exp(-y)*(luf+ell*lf)*lf/(1+y/A)

    # Polynomial-like integrands peak at y of order 4N; breakpoints resolve this.
    splits=sorted(set([mp.mpf(0),mp.mpf(1),mp.mpf(n),mp.mpf(2*n),mp.mpf(4*n),mp.mpf(8*n),mp.inf]))
    return mp.quad(integrand,splits)


def finite_packet_result(tau=0,dps=60,max_theta_n=5):
    """Reproduce the fixed three-point packet; all output is diagnostic."""
    mp.mp.dps=dps
    L=mp.mpf(5)/4
    d=mp.log(mp.mpf(11)/9)
    points=[L-d,L,L+d]
    coefficients=[50,-99,50]
    q=mp.mpf(0)
    start=time.time()
    for i in range(3):
        for j in range(i,3):
            q+=(1 if i==j else 2)*coefficients[i]*coefficients[j]*scaled_flux_point(
                points[i],points[j],tau,dps,max_theta_n)
    leading=mp.exp(-L)*(mp.mpf(29999)/9999*L-mp.mpf(1990)/99*d)
    return {'L':'5/4','d':'log(11/9)',
            'points':[mp.nstr(p,dps-8) for p in points],
            'coefficients':coefficients,'dps':dps,'theta_terms':max_theta_n,
            'tau':str(tau),'leading_M_form':mp.nstr(leading,dps-8),
            'actual_scaled_flux_form':mp.nstr(q,dps-8),
            'actual_scaled_flux_definition':'F(u,v)=pi*K_tau(u,v)/(kappa_tau(u)*kappa_tau(v))',
            'seconds':time.time()-start,
            'status':'NONRIGOROUS_NUMERICAL_DIAGNOSTIC_FINITE_THETA_SUM_AND_QUADRATURE'}


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--finite-packet',action='store_true',
                        help='Evaluate the fixed three-point packet at L=5/4 instead of a confluent jet; --L and --N are unused.')
    parser.add_argument('--L',type=int,default=2)
    parser.add_argument('--N',type=int,default=6)
    parser.add_argument('--tau',default='0')
    parser.add_argument('--dps',type=int,default=50)
    parser.add_argument('--theta-terms',type=int,default=4)
    parser.add_argument('--output')
    args=parser.parse_args()
    if args.finite_packet:
        result=finite_packet_result(args.tau,args.dps,args.theta_terms)
    else:
        start=time.time()
        q0=leading_form(args.L,args.N)
        q=exact_form(args.L,args.N,args.tau,args.dps,args.theta_terms)
        result={'center_L':args.L,'Taylor_order_count':args.N,'tau':args.tau,
                'precision_digits':args.dps,'theta_terms':args.theta_terms,
                'leading_form_exact':str(q0),'leading_form_decimal':float(q0),
                'theta_form':mp.nstr(q,args.dps-8),'elapsed_seconds':time.time()-start,
                'status':'high_precision_numerical_check_not_interval_certificate'}
    print(json.dumps(result,indent=2),flush=True)
    if args.output:
        with open(args.output,'w') as f: json.dump(result,f,indent=2)


if __name__=='__main__': main()
