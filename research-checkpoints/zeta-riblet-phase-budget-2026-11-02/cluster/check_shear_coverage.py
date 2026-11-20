"""Rational checks for transverse shear coverage and microscopic moment bounds."""
from fractions import Fraction as Q
from math import comb, factorial, isqrt


def inv_sqrt_upper(n):
    scale = 10**14
    return Q(scale, isqrt(n * scale**2))


def abs_moment(order, derivative):
    degree = 2*order + int(derivative)
    total = Q(0)
    for j in range(degree + 1):
        weight = abs(degree-2*j) if derivative else 1
        total += comb(degree,j) * weight * inv_sqrt_upper((2*j+1)*(2*(degree-j)+1))
    return total / (2**degree * factorial(degree))


def box_margin(grid, reach, cutoff=16):
    margin = Q(1,6) - abs_moment(1,True)/grid
    margin -= (1 + inv_sqrt_upper(3)/grid)/256
    for n in range(2,cutoff+1):
        negative = (abs_moment(n,False) - Q(1,factorial(2*n+1)))/2
        margin -= n * reach**(2*n-2) * (negative + abs_moment(n,True)/grid)
    n = cutoff + 1
    next_term = n * reach**(2*n-2) / factorial(2*n)
    ratio = reach**2 / (2*n*(2*n+1))
    assert ratio < 1
    return margin - (Q(1,2)+Q(1,grid))*next_term/(1-ratio)


def coverage(k):
    # log(11/4)=2 atanh(7/15); bound its positive Taylor tail geometrically.
    y = Q(7,15)
    terms = 20
    log_upper = 2*sum(y**(2*j+1)/(2*j+1) for j in range(terms))
    log_upper += 2*y**(2*terms+1)/((2*terms+1)*(1-y*y))
    pi_lower = Q(333,106)
    return 1-k*log_upper/(2*pi_lower)-1/(64*pi_lower)


def check_pair_factors():
    for k in [1,2,3]:
        eta = (1-Q(1,k*k))/(1+Q(1,k*k))**2
        for radius in [Q(1,20),Q(1,4),Q(49,100)]:
            for dist in [k*radius,2*k*radius,1+k*radius]:
                linear = 2*(dist**2-radius**2)/(dist**2+radius**2)**2
                quadratic = 1/(dist**2+radius**2)**2
                assert linear >= 2*eta/dist**2
                assert quadratic >= eta**2/dist**4
                for x in [Q(0),Q(1,16),Q(1,4)]:
                    log_slope = (linear+2*quadratic*x)/(1+linear*x+quadratic*x*x)
                    assert log_slope >= 2*eta/(x+dist**2)
    # At the pair center the factor decreases to zero and then increases.
    for b in [Q(1,100), Q(1,8), Q(3,8)]:
        linear = -2/b**2
        quadratic = 1/b**4
        for multiple in [Q(1,2), Q(1), Q(3,2)]:
            x = multiple*b**2
            value = 1 + linear*x + quadratic*x*x
            slope = linear + 2*quadratic*x
            assert value == (1-multiple)**2
            assert slope*b**2 == 2*(multiple-1)


def check_local_obstruction():
    # For U(z)=z^2-b^2 the three even integration weights are 6, 2, 6.
    for b in [Q(1,10000),Q(1,7),Q(3,8)]:
        for d in [b/2, b*Q(3,4), b, b*Q(4,3), 2*b]:
            energy = 6*d**4 + 4*b*b*d*d + 6*b**4
            ratio = (d*d-b*b)**2/energy
            assert ratio <= ((d-b)/(d+b))**2
    # 17-12 sqrt(2)<3/100, strictly below the double-zero limit 1/6.
    assert (17-Q(3,100))**2 < 12**2*2 and Q(3,100)<Q(1,6)


if __name__ == '__main__':
    check_pair_factors()
    check_local_obstruction()
    for k, expected in [(1,Q(834,1000)),(2,Q(673,1000))]:
        lower = coverage(k)
        assert lower > expected
        print(f'Grid coverage, dilation {k}: > {expected} (rational check)')
    for grid, reach, expected in [(2,Q(4),Q(13,1000)),(32,Q(44,7),Q(16,1000))]:
        lower = box_margin(grid,reach)
        assert lower > expected
        print(f'Normalized lower sum, K={grid}, A={reach}: > {expected}')
    for n, bound in [(1,Q(1424,100000)),(2,Q(537,1000000))]:
        negative = (abs_moment(n,False)-Q(1,factorial(2*n+1)))/2
        assert negative < bound
        print(f'Negative mass coefficient, n={n}: < {bound}')
