# Referee check of Lemma 2 for monomial m (zeta): m=w_2=2^{-it} (holomorphic inner), m=conj(w_2), m=w_2^2... float poles.
import sys, math, numpy as np
from scipy.special import loggamma
from flint import acb, ctx
ctx.prec = 64
t0 = 4000.0; deltas = [1e-3, 3e-4]; tmax = t0 + 30/min(deltas)
def phaseX(t): return t*math.log(2*math.pi) + loggamma(0.5 - 1j*t).imag + math.pi/4
def U(e, t): return np.exp(1j*(phaseX(t) - e*t*math.log(2)))
for e, lab in ((1, 'm=w_2: Lemma-2 formula 1+conj(int E m)=1 ; note bullet m(2^-1/2) gives 1.7071'),
               (-1, 'm=conj(w_2): formula gives 1+2^-1/2=1.7071'), (2, 'm=w_2^2: formula 1; bullet 1.5')):
    t = np.arange(t0, tmax, 0.004); u = U(e, t); s0, s1 = u.imag[:-1], u.imag[1:]
    idx = np.where((s0*s1 < 0) & (u.real[:-1] > 0))[0]; x = t[idx] + 0.004*s0[idx]/(s0[idx] - s1[idx])
    dp = lambda x: np.angle(U(e, x + 1e-4)*np.conj(U(e, x - 1e-4)))/2e-4
    for _ in range(4): x = x - np.angle(U(e, x))/dp(x)
    d_ = dp(x); r = 2/np.abs(d_)
    v = np.array([complex(*(lambda z: (float(z.real.mid()), float(z.imag.mid())))(acb(0.5, float(y)).zeta())) for y in x])
    print(lab, 'poles', len(x), 'wrong orientation', int((d_ > 0).sum()))
    for d in deltas:
        w = r*np.exp(-d*(x - t0)); print('  delta', d, 'S/S1', (w*v).sum()/w.sum())
