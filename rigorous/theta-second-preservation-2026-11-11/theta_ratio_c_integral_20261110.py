"""Rigorous real C endpoints from finite theta sums and explicit tails."""
import json
from flint import arb,acb,ctx
ctx.prec=224
N=16

def kfinite(z,derivative=0):
    r=acb.pi()*z.exp()
    ans=acb(0)
    for n in range(1,N+1):
        x=r*n*n
        if derivative==0:p=2*x*x-3*x
        else:p=-2*x**3+arb('15/2')*x*x-arb('15/4')*x
        ans+=(z/4-x).exp()*p
    return ans

def real_jet(t):
    # Real t>=0. For j<=1, degree<=3 and coefficient norm<=14.
    tail=theta_tail(t)
    return [kfinite(acb(t),j).real+arb(0,tail) for j in range(2)]

def theta_tail(t):
    if not t>=0:
        raise ValueError('theta-tail domain requires t>=0')
    if not (arb(N+2)/(N+1))**6*(-arb(3)*(2*(N+1)+1)).exp()<arb(1)/2:
        raise AssertionError('theta-tail geometric ratio failed')
    e=t.exp()
    return 28*(4*e*(N+1)**2)**3*(t/4-3*e*(N+1)**2).exp()

def C_point(t):
    t=arb(t)
    if not t>=0:
        raise ValueError('C_point requires t>=0')
    k=real_jet(t)[0]
    scale=k.mid()
    total=acb(0)
    for j in range(8):
        a=t+arb(j)/2;b=t+arb(j+1)/2
        total+=acb.integral(lambda z,analytic:z*kfinite(z)/(4*scale),a,b,
                            rel_tol=arb(2)**-180,abs_tol=arb(2)**-180,
                            deg_limit=100,eval_limit=100000,depth_limit=30)
    assert total.imag.contains(0)
    tail_theta=theta_tail(t)
    trunc=(t*2+4)*tail_theta  # integral v/4 over length4 is t+2; conservative.
    k_end,kp_end=real_jet(t+4)
    Q_end=-kp_end/((t+4)*k_end)
    assert Q_end>0
    bound_tail=k_end/(4*Q_end)
    result=total.real*scale+arb(0,trunc)+arb(bound_tail/2,bound_tail/2)
    assert result>0
    return result
if __name__=='__main__':
    out={}
    for t in [0,4]:
        val=C_point(t)
        out[str(t)]=val.str(65)
    print(json.dumps(out,indent=2))
