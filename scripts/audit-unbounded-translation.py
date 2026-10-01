"""Audit the fixed-test translation reduction; no unbounded bound is certified.

Exact rational spline algebra, Arb finite arithmetic sums, analytic tails,
and a Laplace-transform check with the small-prime boundary correction.
"""
import argparse
from fractions import Fraction as F
from hashlib import sha256
import json
from math import comb, factorial, isqrt
from pathlib import Path
import sys
from flint import arb, acb, acb_series, ctx


def ball(x):
    x = F(x)
    return arb(x.numerator)/x.denominator


def ev(p,x):
    v = x*0
    for c in reversed(p): v = v*x+c
    return v


def deriv(p): return [i*p[i] for i in range(1,len(p))]
def integral(p,L): return sum(c*L**(i+1)/F(i+1) for i,c in enumerate(p))
def product(p,q):
    r = [F(0)]*(len(p)+len(q)-1)
    for i,x in enumerate(p):
        for j,y in enumerate(q): r[i+j] += x*y
    return r


def spline_piece(order, index):
    """Local polynomial on the index-th interval of width 1/8."""
    p = [F(0)]*order
    for j in range(index+1):
        offset = F(index-j,8)
        scale = F(8**order*(-1)**j*comb(order,j),factorial(order-1))
        for k in range(order):
            p[k] += scale*comb(order-1,k)*offset**(order-1-k)
    return p


def Q(p):
    d2 = deriv(deriv(p))
    return [v/4-(d2[i] if i<len(d2) else 0) for i,v in enumerate(p)]


def exp_integral(p,z,L):
    """Exact polynomial antiderivative times exp, with interval coefficients."""
    if z == 0: return sum(c*L**(i+1)/(i+1) for i,c in enumerate(p))
    b = [z*0]*len(p)
    for k in range(len(p)-1,-1,-1):
        b[k] = (p[k] - ((k+1)*b[k+1] if k+1<len(p) else 0))/z
    return (z*L).exp()*ev(b,L)-b[0]


def H(z):
    if z == 0: return z*0+arb(1)/4
    return (arb(1)/4-z*z)*((z/16).sinh()/(z/16))**8


def powers(limit):
    sieve = bytearray(b'\x01')*(limit+1)
    sieve[:2] = b'\x00\x00'
    for p in range(2,isqrt(limit)+1):
        if sieve[p]: sieve[p*p:limit+1:p] = b'\x00'*((limit-p*p)//p+1)
    result = []
    for p in range(2,limit+1):
        if sieve[p]:
            n = p
            while n<=limit:
                result.append((n,p))
                n *= p
    return sorted(result)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output')
    args = parser.parse_args()
    ctx.prec = 320
    checks = []
    # g is the eighth convolution power of 8*1_[-1/16,1/16]; h=Qg.
    hp = [Q(spline_piece(8,j)) for j in range(8)]
    cp = [Q(Q(spline_piece(16,j))) for j in range(16)]
    norm = sum(integral(product(p,p),F(1,8)) for p in hp)
    assert norm == cp[8][0] == F(233983221755021,13621608000)
    corr_quarter = sum(integral(product(hp[j],hp[j+2]),F(1,8)) for j in range(6))
    assert corr_quarter == cp[10][0]
    # Endpoint derivatives vanish, and the piecewise definitions join.
    for order in range(5):
        pieces = hp
        for _ in range(order): pieces = [deriv(p) for p in pieces]
        assert ev(pieces[0],F(0)) == ev(pieces[-1],F(1,8)) == 0
        assert all(ev(pieces[j],F(1,8))==pieces[j+1][0] for j in range(7))
    checks += ['exact norm and independent autocorrelation at 1/4', 'C4 spline joins and endpoint traces']
    cb = [[ball(x) for x in p] for p in cp]

    def C(x):
        x = abs(x)
        if x>=1: return arb(0)
        if not x<1: raise ArithmeticError('Unresolved spline endpoint.')
        index = (8*x).floor().unique_fmpz()
        if index is None: raise ArithmeticError('Unresolved spline knot.')
        j = int(index)
        return ev(cb[8+j],x-arb(j)/8)

    def transform(z):
        return sum((z*(arb(j)/8-1)).exp()*exp_integral(p,z,arb(1)/8)
                   for j,p in enumerate(cb))

    for z in [acb(0),acb(arb(1)/2),acb(-arb(1)/2),acb(2,arb(1)/3)]:
        residual = transform(z)-H(z)**2
        assert residual.contains(0) and abs(residual)<arb('1e-55')
    assert abs(H(acb(arb(1)/10,14)))>0
    checks += ['polynomial Laplace transform equals H(z)^2', 'pole cancellation and off-axis filter control']
    assert cp[8][0]/2+cp[8][1]>0
    assert cp[9][0]/2+cp[9][1]<0
    checks.append('centered prime-error weight has both signs')

    # Single-test diagonal W(h), including the entire archimedean tail.
    T,q = 256,48
    pi = arb.pi()
    nodes = [arb.legendre_p_root(q,k,weight=True) for k in range(q)]
    phi = 1+arb(32)/5+(arb(T)/2+1)*pi*pi/6+pi.log()
    quad_error = 4*T*phi*ball(norm)*(arb(3)/16).exp()/pi*arb(2)**(1-2*q)
    # |hhat(t)|^2 <= (1+1/(4T^2))^2*16^16*t^-12 for t>=T.
    tail = (1+arb(1)/(4*T*T))**2*arb(16)**16/(pi*arb(T)**11)
    tail *= (arb(T).log()+1)/11+arb(1)/121
    assert acb(arb(1)/4,arb(T)/2).digamma().real-pi.log()>0
    arch = arb(0)
    independent_arch_cross = {R:arb(0) for R in (2,4)}
    for panel in range(2*T):
        for root,weight in nodes:
            t = arb(panel)/2+(root+1)/4
            fh = (t*t+arb(1)/4)*((t/16).sin()/(t/16))**8
            term = weight*(acb(arb(1)/4,t/2).digamma().real-pi.log())*fh*fh/(4*pi)
            arch += term
            for R in independent_arch_cross: independent_arch_cross[R] += term*(R*t).cos()
    diagonal = arch-2*arb(2).log()/arb(2).sqrt()*C(arb(2).log())
    diagonal_lower,diagonal_upper = diagonal-quad_error,diagonal+quad_error+tail
    assert diagonal_lower>0
    checks.append('single-test diagonal with rigorous frequency tail')
    print('Single-test diagonal enclosed',file=sys.stderr,flush=True)

    endpoint = int(arb(15).exp().upper().ceil().unique_fmpz())
    arithmetic = [(n,p,arb(n).log(),arb(p).log()/arb(n).sqrt()) for n,p in powers(endpoint)]
    rows = []
    prime_samples = {}
    for R in [2,4,6,8,10,12,14]:
        prime = arb(0); count = 0
        for n,p,ell,c in arithmetic:
            if ell<R-1: continue
            if ell>R+1: break
            if not (ell>R-1 and ell<R+1): raise ArithmeticError('Threshold unresolved.')
            prime += c*C(arb(R)-ell)
            count += 1
        arch_cross = arb(0)
        prime_samples[R] = prime
        J = 64
        for j in range(1,J):
            lam = arb(2*j)+arb(1)/2
            arch_cross -= H(lam)**2*(-lam*R).exp()
        lam = arb(2*J)+arb(1)/2
        remainder = arb(8)**16*lam**(-12)*(-(R-1)*lam).exp()/(1-arb(-2*(R-1)).exp())
        # Cross kernel is arch_cross-prime minus a nonnegative tail.
        cross_lower,cross_upper = arch_cross-prime-remainder,arch_cross-prime
        if R in independent_arch_cross:
            error = quad_error*(arb(3*R)/16).cosh()+tail+remainder
            assert abs(independent_arch_cross[R]-arch_cross)<error
        cross_abs = max(abs(cross_lower).upper(),abs(cross_upper).upper())
        margin = (diagonal_lower-cross_abs)/ball(norm)
        assert margin>0
        rows.append({'separation':R,'support_width_of_pair':R+1,'prime_power_count':count,
                     'cross_lower_per_norm':str(cross_lower/ball(norm)),
                     'cross_upper_per_norm':str(cross_upper/ball(norm)),
                     'two_by_two_minimum_eigenvalue_lower_per_norm':str(margin),
                     'archimedean_tail_upper':str(remainder)})
        print(f'Separation {R} checked; {count} prime powers',file=sys.stderr,flush=True)
    checks.append('seven separated two-copy matrices, all prime powers included')
    checks.append('archimedean cross term independently checked by frequency quadrature at R=2,4')

    # Independently integrate the centered prime-error identity at R=2.
    R = arb(2)
    breaks = [arb(j)/8-1 for j in range(17)]
    small = [(ell,arb(p).log()) for n,p,ell,c in arithmetic if ell<3]
    breaks += [R-ell for ell,weight in small if ell>1]
    breaks.sort()
    centered = arb(0)
    for lo,hi in zip(breaks,breaks[1:]):
        mid = (lo+hi)/2
        j = int((8*(mid+1)).floor().unique_fmpz())
        base = arb(j)/8-1
        jp = [v/2+(cb[j][i+1]*(i+1) if i+1<len(cb[j]) else 0) for i,v in enumerate(cb[j])]
        psi = sum(weight for ell,weight in small if ell<R-mid)
        def piece(rate):
            return (rate*base).exp()*(exp_integral(jp,rate,hi-base)-exp_integral(jp,rate,lo-base))
        centered += psi*(-R/2).exp()*piece(arb(1)/2)-(R/2).exp()*piece(-arb(1)/2)
    residual_centered = centered-prime_samples[2]
    assert residual_centered.contains(0) and abs(residual_centered)<arb('1e-50')
    checks.append('centered prime-error convolution independently integrated across every jump at R=2')

    # Laplace transform on R>=1: keep the entire small-prime boundary term.
    z = acb(2,arb(1)/3); s = z+arb(1)/2
    X = 10000
    finite, boundary = acb(0),acb(0)
    complete = transform(-z)
    for n,p,ell,c in arithmetic:
        if n>X: break
        if ell>2:
            finite -= c*(-z*ell).exp()*complete
        else:
            cut = 1-ell
            missing = acb(0)
            for j,polynomial in enumerate(cb):
                lo = arb(j)/8-1
                if cut>lo+arb(1)/8: length=arb(1)/8
                elif cut<lo: break
                else: length=cut-lo
                missing += (-z*lo).exp()*exp_integral(polynomial,-z,length)
            finite -= c*(-z*ell).exp()*(complete-missing)
            boundary += c*(-z*ell).exp()*missing
    expansion = acb_series([s,acb(1)],2).zeta()
    exact_prime_transform = H(z)**2*expansion[1]/expansion[0]+boundary
    # Lambda(n)<=log n; sigma=5/2. Compare the omitted Dirichlet series to its integral.
    series_tail = arb(X)**(-arb(3)/2)*(arb(X).log()/(arb(3)/2)+arb(4)/9)
    tail_bound = abs(H(z)**2)*series_tail
    residual = finite-exact_prime_transform
    assert abs(residual)<tail_bound
    assert abs(boundary)>10*tail_bound
    checks += ['Laplace identity with certified all-integer series tail', 'omitted boundary correction rejected']

    baseline = []
    for B in [2,4,6,8,10,12]:
        rayleigh = sum(2*c*(1-ell/B) for n,p,ell,c in arithmetic if n>=5 and ell<B)
        baseline.append({'width':B,'constant_test_rayleigh_lower':str(rayleigh.lower())})
    checks.append('scalar-baseline Rayleigh lower bounds for retained prime translations')
    for k in [1,2,4]:
        R = 2*pi*k
        good = R.cos()
        bad = (R/10).cosh()*good
        assert abs(good-1)<arb('1e-80') and bad>1
    checks.append('off-axis exponential-growth toy violates the two-copy positivity test')
    result = {'status':'passed','scope':'fixed-test identities and finite diagnostics; no unbounded-support bound or RH proof',
              'precision_bits':ctx.prec,'checks':checks,'norm_squared_exact':str(norm),
              'diagonal_lower_per_norm':str(diagonal_lower/ball(norm)),
              'diagonal_upper_per_norm':str(diagonal_upper/ball(norm)),
              'diagonal_tail_upper_per_norm':str(tail/ball(norm)),
              'diagonal_quadrature_error_per_norm':str(quad_error/ball(norm)),
              'translation_samples':rows,'laplace_series_tail_bound':str(tail_bound),
              'centered_identity_residual':str(residual_centered),
              'laplace_residual_abs_upper':str(abs(residual).upper()),
              'small_prime_boundary_abs_lower':str(abs(boundary).lower()),
              'scalar_baseline_diagnostics':baseline,
              'global_subexponential_bound_proved':False,'rh_proved':False,
              'script_sha256':sha256(Path(__file__).read_bytes()).hexdigest()}
    payload=json.dumps(result,indent=2)+'\n'
    if args.output: Path(args.output).write_text(payload)
    print(payload)


if __name__=='__main__': main()
