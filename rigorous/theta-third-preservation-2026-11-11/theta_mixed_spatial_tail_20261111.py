"""Exact algebra for the uniform comparable-scale theta mixed tail.

The analytic differentiated remainder proof is in the companion note.
These checks do not establish a numerical starting height.
"""
import json
import sympy as sp


def run_checks():
    if not __debug__:
        raise RuntimeError('Run without python -O.')
    q, z, t, k = sp.symbols('q z t k', positive=True)
    checks = []

    def check(name, expression):
        assert sp.simplify(expression) == 0, (name, expression)
        checks.append(name)

    check('gamma_polynomial_mass', 2*k*(k+1)-3*k-k*(2*k-1))
    mass=k*(2*k-1)*sp.gamma(k)
    mean=sp.polygamma(0,k)+1/k+2/(2*k-1)
    check('gamma_polynomial_logarithmic_mean',sp.diff(mass,k)/mass-mean)
    check('mean_high_shape_difference',
          sp.expand_func(sp.polygamma(0,k+2))-mean+3/((k+1)*(2*k-1)))
    check('mean_low_shape_difference',
          sp.expand_func(sp.polygamma(0,k+1))-mean+2/(2*k-1))
    Q, boundary = sp.symbols('Q boundary')
    check('centered_incomplete_gamma_recurrence',
          -6*((k+1)*Q+boundary)/((k+1)*(2*k-1))
          +6*Q/(2*k-1)+6*boundary/((k+1)*(2*k-1)))
    L = sp.log(q)/(q-1)
    check('loggamma_saddle_limit', sp.limit(L, q, 1)-1)
    correction = q*sp.log(q)/(4*(q*q-1))
    check('numerator_next_term',
          (L+sp.log(q)/(1+q))/8-correction)
    check('numerator_saddle_limit', sp.limit(correction, q, 1)-sp.Rational(1,8))

    # t=log(z/pi); write its chain rule explicitly to avoid confusing
    # fixed-anchor and fixed-ratio derivatives.
    def Dt(f):
        return sp.diff(f,t)+z*sp.diff(f,z)-q*sp.diff(f,q)

    def Da(f):
        return sp.diff(f,q)/(2*z)

    h=t/(4*z)
    b=t*z
    n=t/(4*z*(1+q))
    fh=sp.factor(Dt(Dt(h))/Dt(h)*Dt(n)-Dt(Dt(n)))
    fp=sp.factor(Dt(Dt(n))-Dt(Dt(b))/Dt(b)*Dt(n))
    check('H_leading_source', sp.limit(z*fh/t,t,sp.oo)-q/(2*(1+q)**3))
    check('P_leading_source', sp.limit(z*fp/t,t,sp.oo)-1/(2*(1+q)**3))
    hlead=t*q/(2*z*(1+q)**3)
    plead=t/(2*z*(1+q)**3)
    target=3/(2*z*(1+q)**2)
    for name, f in [('H',hlead),('P',plead)]:
        cleared=sp.factor((f*Da(Dt(f))-Da(f)*Dt(f))/f**2)
        check(name+'_mixed_log_leading',cleared-target)
    a=sp.symbols('a',positive=True)
    check('mixed_tail_original_coordinate',
          target.subs(q,a/(2*z))-6*z/(a+2*z)**2)
    u=sp.Function('u')(q,z,t)
    check('mixed_coordinate_operator',
          Da(Dt(u))-(Dt(sp.diff(u,q))-sp.diff(u,q))/(2*z))

    # Fixed-anchor spatial tails require the first nonseparable
    # relative correction, since the leading factor has zero mixed log.
    Ds=lambda f:sp.diff(f,t)+z*sp.diff(f,z)
    LH=lambda f:Ds(Ds(h))/Ds(h)*Ds(f)-Ds(Ds(f))
    LP=lambda f:Ds(Ds(f))-Ds(Ds(b))/Ds(b)*Ds(f)
    A=LH(-1/(4*z*z))
    E=sp.factor(LH(t/(16*z**3))/A)
    F=sp.factor(-LP(1/(4*z*z))/LP(h))
    check('fixed_anchor_H_first_mixed_term',sp.limit(z*Ds(E)/t,t,sp.oo)-sp.Rational(3,4))
    check('fixed_anchor_P_first_mixed_term',sp.limit(t*z*Ds(F),t,sp.oo)-3)

    return {'status':'passed','exact_checks':len(checks),'check_names':checks,
            'scope':'Exact identities supporting the analytic eventual tail theorems; no finite starting-height certificate.'}


if __name__ == '__main__':
    print(json.dumps(run_checks(),indent=2))
