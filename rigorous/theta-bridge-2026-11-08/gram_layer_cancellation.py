"""Numerical picture of the certified fixed-layer obstruction.

The separate gram_attack_torus_theta_20261108.py certifies negativity.
This file illustrates the signed layer contributions and checks the exact
monopole-period identity numerically. It does not certify RH or global PD.
Dependencies: numpy, scipy, mpmath, matplotlib.
"""
from pathlib import Path
import json
import numpy as np
import mpmath as mp
from scipy.integrate import quad
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

OUT = Path(__file__).resolve().parent
X_TILT = 0.25
SPACING = 0.15
COEFF = np.array([-2, 9, -19, 24, -19, 9, -2], dtype=float)
CORR = np.array([np.dot(COEFF[:7-j], COEFF[j:]) for j in range(7)])

def kappa(u):
    v = np.exp(np.abs(np.asarray(u, dtype=float)))
    result = np.zeros_like(v)
    for n in range(1, 9):
        t = np.pi*n*n*v
        result += np.exp(np.abs(u)/4-t)*(2*t*t-3*t)
    return result

def layer_form(a):
    a = np.asarray(a, dtype=float)
    result = CORR[0]*kappa(a)**2
    for j in range(1, 7):
        d = j*SPACING
        result += 2*CORR[j]*kappa(a+d)*kappa(a-d)
    return result

def weighted_form(a):
    return 2*a*np.sinh(X_TILT*a)*layer_form(a)

a = np.linspace(0, 2.1, 1201)
q = layer_form(a)
wq = weighted_form(a)
net, net_error = quad(weighted_form, 0, 4, points=[.05,.1,.2,.4,.6,1,2],
                      epsabs=2e-13, epsrel=2e-10, limit=150)
positive, _ = quad(lambda t: max(float(weighted_form(t)), 0), 0, 4,
                   epsabs=2e-13, limit=200)
negative, _ = quad(lambda t: min(float(weighted_form(t)), 0), 0, 4,
                   epsabs=2e-13, limit=200)

mp.mp.dps = 65
r = mp.mpf(2)
k0 = r**-2
km = (r-1/r)/(r+1/r)
b = mp.log(mp.ellipk(1-k0*k0)/(2*mp.ellipk(k0*k0)))
H_theta = mp.exp(b/4)*mp.jtheta(3, 0, mp.exp(-mp.pi*mp.exp(b)))
H_period = mp.sqrt(2/mp.pi)*(mp.ellipk(km*km)*mp.ellipk(1-km*km))**mp.mpf('.25')

plt.rcParams.update({'font.family':'DejaVu Sans','font.size':11,
                     'axes.spines.top':False,'axes.spines.right':False})
fig, axes = plt.subplots(1, 2, figsize=(12.8,5.8))
for ax, values, title in zip(axes, [q, wq],
    ['A fixed layer can be indefinite', 'Integration combines signed layers']):
    ax.axhline(0, color='#6b7280', linewidth=.8)
    ax.plot(a, values, color='#192e45', linewidth=1.7)
    ax.fill_between(a, values, 0, where=values<0, color='#c65770', alpha=.7)
    ax.fill_between(a, values, 0, where=values>=0, color='#149b8b', alpha=.55)
    ax.set_xlim(0, 2.1)
    ax.set_xlabel('Layer parameter a')
    ax.set_title(title, loc='left', fontweight='bold', pad=13)
axes[0].set_ylabel(r'$Q(a)=c^T[h_a(b_i-b_j)]c$')
axes[1].set_ylabel(r'$2a\sinh(xa)\,Q(a)$,  $x=1/4$')
axes[0].scatter([.05],[float(layer_form(.05))], color='#9d2745', s=30,zorder=5)
axes[0].annotate('Certified negative at a = 1/20\nQ < -0.000908036036922',
                 xy=(.05,float(layer_form(.05))), xytext=(.45,min(q)*1.1),
                 fontsize=10, color='#84213b',
                 arrowprops={'arrowstyle':'->','color':'#84213b'})
axes[1].text(.96,.96, f'Numerical integrated form\n{net:.10g} > 0',
             transform=axes[1].transAxes, ha='right',va='top',fontsize=11,
             bbox={'boxstyle':'round,pad=.5','facecolor':'white','edgecolor':'#b9c9ca'})
fig.suptitle('Why positivity cannot be proved separately in every layer',
             x=.055, y=.97, ha='left', fontsize=18, fontweight='bold')
fig.text(.055,.875,
    r'$h_a(b)=\kappa(a+b)\kappa(a-b)$;  $b_j=3j/20$;  $c=(-2,9,-19,24,-19,9,-2)$',
    fontsize=12)
fig.text(.055,.065,
    'The same seven-point direction is negative in some layers and positive after integration in this example.',
    fontsize=10, color='#3d4b5b')
fig.text(.055,.028,
    'Only the stated negative layer has an interval certificate here. A positive example does not prove global kernel positivity or RH.',
    fontsize=9.5,color='#3d4b5b')
fig.subplots_adjust(top=.78,bottom=.20,left=.075,right=.98,wspace=.27)
fig.savefig(OUT/'gram_layer_cancellation.png',dpi=190)
fig.savefig(OUT/'gram_layer_cancellation.svg')

result = {
 'status':'Numerical illustration; fixed-layer negative certificate is in the separate interval script.',
 'x':X_TILT,'spacing':SPACING,'coefficients':COEFF.astype(int).tolist(),
 'stencil_autocorrelations':CORR.astype(int).tolist(),
 'Q_at_zero':float(layer_form(0)), 'Q_at_one_twentieth':float(layer_form(.05)),
 'integrated_form_quadrature':net,'quad_error_estimate':net_error,
 'positive_layer_integral':positive,'negative_layer_integral':negative,
 'integration_endpoint':4,
 'monopole_period_check':{'r':'2','k':str(km),'b':str(b),'H_theta':str(H_theta),
   'H_period':str(H_period),'identity_residual':str(abs(H_theta-H_period))},
 'limitations':'The finite positive quadrature is not a global positivity or RH certificate.'}
(OUT/'gram_layer_cancellation.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
