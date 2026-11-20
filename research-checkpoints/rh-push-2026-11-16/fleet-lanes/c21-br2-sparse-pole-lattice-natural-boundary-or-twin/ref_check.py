# Author's cross-checks (float64 / mpmath 30 digits). Planned allocation: < 10 MB.
import numpy as np, math
from mpmath import mp, mpf, mpc, exp, quad, pi, cos, log
from isolation import bhat
# (1) CYC in the spike language: sum_k lam_k sum_n (-1)^n That(w - n lam_k) = -lam_0 sum_n That(w - n lam_0),
#     lam_k = 2^k lam_0 (k >= 0), window h = 1, yc = 0.
lam0 = math.log(3.0); h = 1.0
def spikes(w, lam, sign):
    n = np.arange(1, int((w + 60)/lam) + 2)
    return float((lam*(sign**n)*bhat(h*(w - n*lam))).sum())
worst = 0.0
for w in np.linspace(40, 400, 721):
    lhs = sum(spikes(w, lam0*2**k, -1.0) for k in range(0, 12))
    rhs = -spikes(w, lam0, 1.0)
    worst = max(worst, abs(lhs - rhs))
print('CYC spike identity: max |lhs - rhs| over 721 frequencies =', worst, '(terms of size up to', lam0*2**7, ')')
# (2) Series side of (*) against direct quadrature for a 3-factor product, delta = 0.05, theta = 0.
mp.dps = 30
lams = [mpf('2.8332133440562162'), mpf('7.3895663366519'), mpf('20.0855369231877')]
d = mpf('0.05')
def H(z): return sum(L/(exp(L*z) - 1) for L in lams)
def T(y): return mpf(4)/3*cos(pi*y/2)**4 if abs(y) < 1 else mpf(0)
for w in (mpf('7.3895663366519'), mpf('20.0855369231877'), mpf(11)):
    I = quad(lambda y: T(y)*H(mpc(d, y))*exp(1j*w*y), [-1, -0.5, 0, 0.5, 1])
    S = 0.0
    for L in lams:
        Lf = float(L); n = np.arange(1, 400)
        S += float((Lf*np.exp(-n*Lf*float(d))*bhat(float(w) - n*Lf)).sum())
    print('quadrature vs spike sum at w = %.4f: %.10f %+.2ei   %.10f' % (float(w), float(I.real), float(I.imag), S))
# (3) Pole kernel: lim_{delta->0} int T(y) e^{iwy}/(delta + i y) dy -> 2 pi T(0) for large w.
for w in (5, 20, 80):
    v = quad(lambda y: T(y)*exp(1j*w*y)/mpc(mpf('1e-6'), y), np.linspace(-1, 1, 81).tolist())
    print('pole kernel w = %d: %.8f %+.2ei   2 pi T(0) = %.8f' % (w, float(v.real), float(v.imag), float(2*pi*mpf(4)/3)))
# (4) Lemma P constant: int_0^inf log(u)/(e^u+1) du = -(log 2)^2/2 ; int_0^inf du/(e^u+1) = log 2.
print(float(quad(lambda u: log(u)/(exp(u)+1), [0, 1, 10, 80])), -math.log(2)**2/2, float(quad(lambda u: 1/(exp(u)+1), [0, 80])), math.log(2))
