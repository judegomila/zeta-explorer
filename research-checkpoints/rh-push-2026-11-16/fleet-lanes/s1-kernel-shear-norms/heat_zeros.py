# Independent locator of the first off-line zero pair of the backward-heat deformation Xi_tau(t) = E_y Xi(t + y),
# y ~ N(0, |tau|/2), Xi(t) = xi(1/2 + i t) (real, even): count sign changes on the critical line against zeta's.
import sys, math, json
import numpy as np, mpmath as mp
from scipy.special import loggamma
mp.mp.dps = 15
TMAX = float(sys.argv[1]); dy = 0.02
taus = [float(x) for x in sys.argv[2].split(',')]
pad = 40.0
t = np.arange(0, int((TMAX + pad)/dy) + 1)*dy
Z = np.array([float(mp.siegelz(x)) for x in t])
# log|Xi(t)| = log((t^2+1/4)/2) - (1/4) log pi + Re loggamma(1/4 + i t/2) + log|Z(t)| ; sign Xi = -sign Z
logabs = np.log((t*t + 0.25)/2) - 0.25*math.log(math.pi) + loggamma(0.25 + 0.5j*t).real + np.log(np.abs(Z) + 1e-300)
sgn = -np.sign(Z)
s0 = 0.5 + 1j*3.0
chk = (s0*(s0 - 1)/2*mp.pi**(-s0/2)*mp.gamma(s0/2)*mp.zeta(s0)).real
i3 = int(round(3.0/dy)); print('check Xi(3): formula', sgn[i3]*math.exp(logabs[i3]), 'mpmath', chk)
# even extension
la = np.concatenate([logabs[:0:-1], logabs]); sg = np.concatenate([sgn[:0:-1], sgn]); off = len(t) - 1
nT = int(TMAX/dy)
zc = np.cumsum(np.concatenate([[0], (Z[1:nT + 1]*Z[:nT] < 0).astype(int)]))
out = {'TMAX': TMAX, 'zeta_sign_changes': int(zc[-1])}
for tau in taus:
    sig = math.sqrt(abs(tau)/2); Kw = int((10*sig + math.pi*sig*sig/2)/dy) + 2
    Kw = min(Kw, int(pad/dy) - 2)
    idx = np.arange(0, nT + 1) + off
    acc = np.zeros(nT + 1)
    base = la[idx]
    for k in range(-Kw, Kw + 1):
        acc += math.exp(-(k*dy)**2/(2*sig*sig))*sg[idx + k]*np.exp(la[idx + k] - base)
    hc = np.cumsum(np.concatenate([[0], (acc[1:]*acc[:-1] < 0).astype(int)]))
    deficit = zc - hc
    first = np.argmax(deficit >= 2) if np.any(deficit >= 2) else None
    out['tau=%g' % tau] = {'sign_changes': int(hc[-1]), 'deficit_at_TMAX': int(deficit[-1]),
                           'first_height_with_deficit>=2': (float(first*dy) if first is not None else None),
                           'deficit_at': {str(T): int(deficit[int(T/dy)]) for T in (50, 100, 200, 500, 1000, 2000, 3000, 5000) if T <= TMAX}}
    print('tau', tau, json.dumps(out['tau=%g' % tau]), flush=True)
json.dump(out, open('out/heat_zeros.json', 'w'))
