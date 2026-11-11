"""Exact algebra and high-precision diagnostics, not interval certificates."""
import json
import mpmath as mp
import sympy as sp

def kernel(t):
    t=mp.mpf(t)
    k=kp=kpp=mp.mpf('0')
    for n in range(1,9):
        x=mp.pi*n*n*mp.exp(t)
        f=x*(2*x-3)*mp.exp(t/4-x)
        h=mp.mpf(5)/4+2*x/(2*x-3)-x
        hp=-6*x/(2*x-3)**2-x
        k+=f; kp+=f*h; kpp+=f*(h*h+hp)
    return k,kp,kpp

def xi(z):
    s=z+mp.mpf('.5')
    return s*(s-1)*mp.power(mp.pi,-s/2)*mp.gamma(s/2)*mp.zeta(s)/2

def integrate(f,points):
    return mp.quad(f,points)

def values(a,t):
    a,t=mp.mpf(a),mp.mpf(t); lam=a/2
    p=mp.diff(lambda z:mp.log(xi(z)),a)
    k,kp,kpp=kernel(t)
    J=integrate(lambda v:v*kernel(v)[0]/(4*k),[t,(t+7)/2,7])
    # Exact full-line Green representation, approximated numerically on [-7,7].
    points=sorted(set([mp.mpf(0),t,mp.mpf(7)]+[max(mp.mpf(0),min(mp.mpf(7),t+j/a)) for j in [-8,-2,2,8]]))
    def green(v,derivative):
        kv,kpv,kppv=kernel(v)
        N=-v*kpv-(1+a*p)*kv
        Np=-v*kppv-(2+a*p)*kpv
        if derivative:
            return -(mp.exp(-lam*abs(t-v))-mp.exp(-lam*(t+v)))*Np/(4*a*k)
        return -(mp.exp(-lam*abs(t-v))+mp.exp(-lam*(t+v)))*N/(4*a*k)
    # Beyond the tilted mean, use the canceled tail: the full-line
    # convolution loses many digits when opposite source masses cancel.
    use_tail=t>=2*p
    tail_points=[t,(t+7)/2,7]
    def tail_n():
        return integrate(lambda v:kernel(v)[0]/k*(v*mp.cosh(lam*(v-t))/4-p*mp.sinh(lam*(v-t))/2),tail_points)
    if use_tail:
        n=tail_n()
        np_=-t/4+integrate(lambda v:kernel(v)[0]/k*(a*p*mp.cosh(lam*(v-t))/4-a*v*mp.sinh(lam*(v-t))/8),tail_points)
    else:
        n=integrate(lambda v:green(v,False),points)
        np_=integrate(lambda v:green(v,True),points)
    # Independent canceled-tail evaluation of n, when cancellation is moderate.
    n_tail=None
    if a<=32:
        n_tail=integrate(lambda v:green(v,False),points) if use_tail else tail_n()
    H=kp/k+t/(4*J)
    left=np_/n+t/(4*J)
    right=kp/k-np_/n
    Q=-kp/(t*k)
    Qp=-(kpp/k-(kp/k)**2)/t+kp/(t*t*k)
    target=2*t*Q+t*t*Qp
    return dict(left=left,right=right,width=H,n=n,b=(J-n)/a,
                scaled_right=a*p*right,large_anchor_limit=target,
                dual_n_relative_difference=None if n_tail is None else abs((n_tail-n)/n))

def algebra():
    t,a,p=sp.symbols('t a p',positive=True)
    r=sp.Function('r')(t); J=sp.Function('J')(t); k=sp.Function('k')(t)
    n=r*J;b=(1-r)*J/a
    assert sp.simplify(sp.diff(n/b,t)-a*sp.diff(r,t)/(1-r)**2)==0
    assert sp.simplify(sp.diff(sp.log(n/k),t)-sp.diff(sp.log(r),t)-sp.diff(sp.log(J/k),t))==0
    # Differentiate J'=-t*k/4 to obtain 4J''/k=t^2 Q-1.
    assert sp.simplify(4*sp.diff(-t*k/4,t)/k-(-t*sp.diff(k,t)/k-1))==0
    x,c,w=sp.symbols('x c w',real=True)
    assert sp.trigsimp(sp.diff(sp.sinh(c*(x-t)/2)/sp.cosh(c*x/2),x)-c*sp.cosh(c*t/2)/(2*sp.cosh(c*x/2)**2))==0
    assert sp.cancel(c*c/(c*c+4*w*w)-1+4*w*w/(c*c+4*w*w))==0
    return {'normalized_ratio_identities':'passed','integrated_kernel_derivative':'passed',
            'cumulative_green_normalization':'passed','resolvent_multiplier':'passed'}

def main():
    cases=[('0.125','0.125'),('1','1'),('8','2'),('32','0.125'),('64','1'),('128','1'),('256','1'),('64','4')]
    runs=[]
    for precision in [40,70]:
        mp.mp.dps=precision
        rows=[]
        for a,t in cases:
            result=values(a,t)
            assert result['left']>0 and result['right']>0 and result['n']>0 and result['b']>0, (precision,a,t,result)
            if result['dual_n_relative_difference'] is not None:
                assert result['dual_n_relative_difference']<mp.mpf('1e-20'), (precision,a,t,result)
            print(precision,a,t,'passed',file=__import__('sys').stderr,flush=True)
            rows.append(dict(a=a,t=t,**{key:None if val is None else mp.nstr(val,28) for key,val in result.items()}))
        runs.append(dict(decimal_precision=precision,cases=rows))
    changes=[]
    for x,y in zip(runs[0]['cases'],runs[1]['cases']):
        changes.extend(abs(mp.mpf(x[key])-mp.mpf(y[key])) for key in ['left','right','width'])
    assert max(changes)<mp.mpf('1e-20')
    print(json.dumps(dict(status='floating high-precision diagnostics, not interval or global certificates',
        theta_terms=8,quadrature_cutoff=7,kernel_values_normalized_by='kappa(t)',algebra=algebra(),runs=runs,
        maximum_recorded_margin_change=mp.nstr(max(changes),10)),indent=2))
if __name__=='__main__': main()
