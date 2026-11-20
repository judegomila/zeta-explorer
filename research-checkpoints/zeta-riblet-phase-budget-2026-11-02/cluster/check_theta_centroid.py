"""Direct interval evaluation of the complete theta shear over the centroid cover."""
from decimal import Decimal
from fractions import Fraction
from math import factorial
import json

from certify_actual_window import I, trig


def atan_reciprocal(n):
    total = sum(Fraction((-1)**k, (2*k+1)*n**(2*k+1)) for k in range(64))
    tail = Fraction(1, 129*n**129)
    return I(total.numerator)/total.denominator + I(0,1)*I(tail.numerator)/tail.denominator


def theta_moments(midpoint='111.4375', highest_order=66):
    pi = 16*atan_reciprocal(5)-4*atan_reciprocal(239)
    midpoint = I(midpoint)
    moments = [I(0) for _ in range(highest_order+1)]
    absolute_mass = I(0)
    for k in range(385):
        u = I(k)/128
        a = (2*u).exp()
        envelope = (5*u/2).exp()
        density = I(0)
        for n in range(1,17):
            v = pi*(n*n)
            density += (4*v*a-6)*v*envelope*(-v*a).exp()
        weight = density*(1 if k == 0 else 2)/128
        absolute_mass += I(weight.absup())*(1+u*u)
        # Any integer number of complete turns is valid for range reduction.
        turns = round(float((u*midpoint).lo)/6.283185307179586)
        phase = u*midpoint-2*turns*pi
        cosine, sine = trig(phase,False), trig(phase,True)
        cycle = [cosine,-sine,-cosine,sine]
        power_weight = weight
        for j in range(len(moments)):
            moments[j] += power_weight*cycle[j % 4]
            power_weight *= u
    if absolute_mass.hi >= 10:
        raise ValueError("Taylor mass budget exceeded")
    return moments


def certify():
    moments = theta_moments()
    coeff = [[moments[j+k]/factorial(k) for k in range(65)] for j in range(3)]
    least = Decimal('Infinity')
    for cell in range(128):
        # The full centroid cover is midpoint ± 11/16.
        delta = I(-704+11*cell,-704+11*(cell+1))/1024
        jet = []
        for row in coeff:
            val = row[-1]
            for entry in reversed(row[:-1]):
                val = val*delta+entry
            jet.append(val+I('-1e-55','1e-55'))
        f, df, ddf = jet
        least = min(least,(df.square()-f*ddf).lo)
    if least <= 0:
        raise ValueError("unresolved theta shear")
    return dict(centroid_cover=[110.75,112.125], theta_sum_terms=16, mesh='1/128',
                integration_cutoff=3, taylor_degree=64, height_cells=128,
                analytic_error_per_jet='1e-55', bridge_shear_derivative_lower=str(least))


if __name__ == '__main__':
    print(json.dumps(certify(),indent=2))
