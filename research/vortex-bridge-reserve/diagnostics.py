#!/usr/bin/env python3
"""Floating-point diagnostics, separate from the standard-library certificate."""
import csv
import cmath
import json
import math
from pathlib import Path
import numpy as np
from scipy.integrate import quad
from scipy.special import loggamma
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = Path(__file__).parent


def theta_half(u):
    return sum((4*math.pi**2*n**4*math.exp(4.5*u)
                - 6*math.pi*n*n*math.exp(2.5*u))
               * math.exp(-math.pi*n*n*math.exp(2*u))
               for n in range(1, 9))


def theta_derivative(w, order=0):
    def integrand(u):
        trig = cmath.cosh(w*u) if order % 2 == 0 else cmath.sinh(w*u)
        return 2*theta_half(u)*u**order*trig
    re = quad(lambda u: integrand(u).real, 0, 3, epsabs=2e-14,
              epsrel=2e-13, limit=200)[0]
    im = quad(lambda u: integrand(u).imag, 0, 3, epsabs=2e-14,
              epsrel=2e-13, limit=200)[0]
    return re+1j*im


def xi_em(w, cutoff=96):
    """Independent Euler--Maclaurin diagnostic, no interval claim."""
    s = .5+w
    n = cutoff
    zeta = sum(cmath.exp(-s*math.log(k)) for k in range(1, n))
    zeta += cmath.exp((1-s)*math.log(n))/(s-1) + .5*cmath.exp(-s*math.log(n))
    bernoulli = [1/6, -1/30, 1/42, -1/30, 5/66,
                 -691/2730, 7/6, -3617/510, 43867/798, -174611/330]
    for k, b in enumerate(bernoulli, 1):
        rising = complex(1)
        for j in range(2*k-1):
            rising *= s+j
        zeta += b/math.factorial(2*k)*rising*cmath.exp(-(s+2*k-1)*math.log(n))
    prefactor = .5*s*(s-1)*cmath.exp(-s/2*math.log(math.pi)+loggamma(s/2))
    return prefactor*zeta


def information_checks():
    rows = []
    for x in [.01, .1, .3]:
        fx = theta_derivative(x).real
        mean = theta_derivative(x, 1).real/fx
        fisher = theta_derivative(x, 2).real/fx-mean**2
        for t in [0, .1, 1, 5, 14.1347251417347, 21.0220396387716, 30]:
            value = theta_derivative(x+1j*t)
            slope = theta_derivative(x+1j*t, 1)
            coherence = min(1., abs(value)/fx)
            lower = mean-math.sqrt(fisher)*math.sqrt(max(0., 1-coherence**2))/coherence
            independent = xi_em(x+1j*t)
            rows.append(dict(x=x, t=t, coherence=coherence, mean=mean,
                             fisher_information=fisher,
                             exact_field_diagnostic=(slope/value).real,
                             cauchy_fisher_lower_bound=lower,
                             relative_em_crosscheck=abs(value-independent)/abs(value)))
    with (ROOT/'fisher_diagnostics.csv').open('w', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader(); writer.writerows(rows)
    assert max(row['relative_em_crosscheck'] for row in rows) < 1e-6
    assert all(row['fisher_information'] > 0 for row in rows)
    assert all(row['cauchy_fisher_lower_bound'] <= row['exact_field_diagnostic']+1e-9 for row in rows)
    return rows


def counterexample():
    # Smooth, even, strongly log-concave probability density: a variance-2
    # Gaussian convolved with masses (1/[2(c+1)],c/[c+1],1/[2(c+1)])
    # at -1,0,1. The off-axis zeros lie inside |Re w|<1/2.
    b, variance = .2, 2.
    c = math.cosh(b)
    transform = lambda w: cmath.exp(variance*w*w/2)*(c+cmath.cosh(w))/(c+1)
    z = lambda w: variance*w+cmath.sinh(w)/(c+cmath.cosh(w))
    point = b-.01+1j*math.pi
    shift = .05
    result = {'c': c, 'gaussian_variance': variance,
              'off_axis_zero_real_part': b, 'off_axis_zero_imag_part': math.pi,
              'strong_log_concavity_parameter_at_least': 1/variance-1/variance**2,
              'probe_real': point.real, 'probe_imag': point.imag,
              'probe_field_real': z(point).real,
              'zero_residual': abs(transform(b+1j*math.pi)),
              'boundary_modulus_error_max': max(abs(abs(transform(-shift+1j*t)/transform(shift+1j*t))-1)
                                                 for t in np.linspace(0, 5, 101))}
    assert result['probe_field_real'] < 0
    assert result['boundary_modulus_error_max'] < 1e-12
    (ROOT/'counterexample.json').write_text(json.dumps(result, indent=2)+'\n')
    return result


def plot_reserve():
    rows = np.genfromtxt(ROOT/'certificate'/'reserve_leaves.csv', delimiter=',', names=True)
    t = np.log(rows['prime_power'])
    e, v, a = rows['psi_lo'], rows['slope_lo'], rows['curvature_lo']
    r = rows['reserve_lower']
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5), layout='constrained')
    mask = t <= 3.1
    axes[0].plot(t[mask], e[mask], color='#176e87', marker='.', label=r'$\Psi(\log n)$')
    axes[0].plot(t[mask], r[mask], color='#d17925', marker='.', label='Certified reserve lower bound')
    axes[0].axhline(0, color='#777', lw=.8)
    axes[0].set(xlabel='Log prime-power delay', ylabel='Scalar response / reserve',
                title='Early prime-power events')
    axes[0].legend(frameon=False, fontsize=8, loc='lower left', bbox_to_anchor=(.01, .05))
    # Plot every event. A scatter plot avoids implying interpolation certificates
    # arise from connecting samples; the analytic quadratic bound supplies them.
    axes[1].scatter(t, r, s=1, alpha=.25, color='#176e87')
    i = int(r.argmin())
    axes[1].scatter([t[i]], [r[i]], s=35, color='#be522a', zorder=5)
    axes[1].annotate(f'n={int(rows["prime_power"][i])}\nreserve > {r[i]:.8f}',
                     (t[i], r[i]), xytext=(4.0, .011),
                     arrowprops={'arrowstyle': '->', 'color': '#be522a'}, fontsize=9)
    axes[1].axhline(0, color='#777', lw=.8)
    axes[1].set(xlabel='Log prime-power delay', ylabel='Certified reserve lower bound',
                title='78,734 events through one million', ylim=(-.003, .075))
    fig.suptitle('Finite arithmetic barrier check — no global RH claim', fontsize=13)
    fig.savefig(ROOT/'reserve_check.png', dpi=170)
    plt.close(fig)


if __name__ == '__main__':
    data = information_checks()
    bad = counterexample()
    plot_reserve()
    print(json.dumps({'theta_em_max_relative_difference': max(r['relative_em_crosscheck'] for r in data),
                      'example_row': next(r for r in data if r['x']==.1 and 14<r['t']<15),
                      'counterexample': bad}, indent=2))
