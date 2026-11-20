"""Exact checks of the one-anchor next-source criterion; no theta sign sampling."""
import json
import sympy as s


def run():
    checks = []

    def zero(name, expr):
        value = s.factor(expr)
        if value != 0:
            raise AssertionError((name, value))
        checks.append(name)

    t, a, p = s.symbols('t a p', positive=True)
    H = s.Function('H')(t)
    B = s.Function('B')(t)
    N = s.Function('N')(t)
    k = s.Function('k')(t)

    def W(*fs):
        return s.det(s.Matrix([[s.diff(f, t, i) for f in fs]
                               for i in range(len(fs))]))

    b1 = p / N - a
    h1 = (H / N - 1) / a
    j1 = a*a + (B-a*p) / N
    zero('first_H_convexity_factor',
         W(s.diff(b1,t),s.diff(h1,t)) - p/(a*N**3)*W(s.diff(H,t),s.diff(N,t)))
    zero('first_J_convexity_factor',
         W(s.diff(b1,t),s.diff(j1,t)) - p/N**3*W(s.diff(B,t),s.diff(N,t)))
    zero('H_prefix_factor', W(k,k*H) - k*k*s.diff(H,t))
    zero('P_prefix_factor', W(k,-k*(1+B)) + k*k*s.diff(B,t))
    zero('H_annihilator_expansion',
         W(k,k*H,k*N) - k**3*s.diff(H,t)*(s.diff(N,t,2)-s.diff(H,t,2)/s.diff(H,t)*s.diff(N,t)))
    zero('P_annihilator_expansion',
         W(k,-k*(1+B),k*N) + k**3*s.diff(B,t)*(s.diff(N,t,2)-s.diff(B,t,2)/s.diff(B,t)*s.diff(N,t)))

    # Abstract independent jets check the monic second-order Sylvester identity.
    # Avoid any special polynomial that would accidentally annihilate a column.
    jets = [[s.symbols(f'j{c}_{r}') for r in range(4)] for c in range(4)]
    f,g,h,z = jets
    G=f[0]*g[1]-f[1]*g[0]
    Gd=f[0]*g[2]-f[2]*g[0]
    M=f[1]*g[2]-f[2]*g[1]
    Md=f[1]*g[3]-f[3]*g[1]
    Gdd=f[1]*g[2]+f[0]*g[3]-f[3]*g[0]-f[2]*g[1]
    def annihilated(v):
        L=v[2]-Gd/G*v[1]+M/G*v[0]
        Ld=v[3]-Gd/G*v[2]+(M/G-(Gdd*G-Gd**2)/G**2)*v[1]+(Md*G-M*Gd)/G**2*v[0]
        return L,Ld
    lh,lhd=annihilated(h);lz,lzd=annihilated(z)
    zero('monic_second_order_Sylvester',s.det(s.Matrix(jets).T)-G*(lh*lzd-lhd*lz))
    zero('block_column_orientation',s.det(s.Matrix([[0,0,1,0],[0,0,0,1],[1,0,0,0],[0,1,0,0]]))-1)

    f=s.Function('f')(a,t)
    zero('mixed_log_clearing',s.diff(s.log(f),a,t)*f**2-(f*s.diff(f,a,t)-s.diff(f,a)*s.diff(f,t)))
    zero('anchor_independent_factor_cancels',s.diff(s.log(k*f),a,t)-s.diff(s.log(f),a,t))
    x=s.symbols('x', positive=True)
    phi=s.Function('phi')(a,x)
    # Work in the jet algebra with D_t=partial_t+2t partial_x (x=t^2).
    # This keeps abstract mixed derivatives canonical, without SymPy's
    # differently named Subs/Dummy representations of the same smooth jet.
    Dt=lambda expr:s.diff(expr,t)+2*t*s.diff(expr,x)
    F=t*t*phi
    zero('spatial_even_deflation',F*Dt(s.diff(F,a))-s.diff(F,a)*Dt(F)-2*t**5*(phi*s.diff(phi,a,x)-s.diff(phi,a)*s.diff(phi,x)))
    v=s.symbols('v',positive=True)
    psi=s.Function('psi')(v,x)
    Da=lambda expr:2*a*s.diff(expr,v)
    zero('anchor_even_deflation',psi*Da(s.diff(psi,x))-Da(psi)*s.diff(psi,x)-2*a*(psi*s.diff(psi,v,x)-s.diff(psi,v)*s.diff(psi,x)))
    Hu=s.Function('Hu')(x);Bu=s.Function('Bu')(x);Nu=s.Function('Nu')(x)
    zero('H_even_annihilator',Dt(Dt(Hu))/Dt(Hu)*Dt(Nu)-Dt(Dt(Nu))-4*t*t*(s.diff(Hu,x,2)/s.diff(Hu,x)*s.diff(Nu,x)-s.diff(Nu,x,2)))
    zero('P_even_annihilator',Dt(Dt(Nu))-Dt(Dt(Bu))/Dt(Bu)*Dt(Nu)-4*t*t*(s.diff(Nu,x,2)-s.diff(Bu,x,2)/s.diff(Bu,x)*s.diff(Nu,x)))
    return {'status':'passed','check_count':len(checks),'checks':checks,
            'scope':'Exact reduction and signs of fixed prefactors; positivity of actual mixed determinants remains a separate gate.'}


if __name__ == '__main__':
    if not __debug__:
        raise SystemExit('Verification must run without python -O.')
    print(json.dumps(run(),indent=2,sort_keys=True))
