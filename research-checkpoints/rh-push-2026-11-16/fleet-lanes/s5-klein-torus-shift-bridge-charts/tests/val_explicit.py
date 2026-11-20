"""Validation of the prime-side identity on a case with a known answer: zeta near t in [990, 1010], X = 1e6, eta = 0.5.
A_X(s) = Re(-S_v(s) + G(s)) is compared with (a) Re sum over the 3474 zeros below 4000 (and their conjugates) of
(1 - Phi(rho - s))/(s - rho) plus the smooth tail, (b) the same with Lorentzians against Re xi'/xi from Arb."""
import sys, json, math, subprocess, os
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import explib
from flint import acb, arb, ctx, acb_series
import objs
here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(here, 'out', 'val_explicit.npz')
X = 1e6; eta = 0.5; Tc = 1000.0; delta = 0.01; lg = 11
if not os.path.exists(out):
    subprocess.check_call([sys.executable, os.path.join(here, 'explicit.py'), 'ZETA', str(X), str(eta), str(Tc), str(delta), str(lg), out, '0.05', '0.2'])
d = np.load(out); S = d['S']; N = 1 << lg; t = Tc + delta * np.arange(-N // 2, N // 2)
zs = json.load(open(os.path.join(here, '..', 'c12-control-battery-harness', 'tables', 'zeros_ZETA_2H.json')))
key = [k for k in zs if isinstance(zs[k], list)][0]; g = np.array([float(v) for v in zs[key]])
g = np.concatenate([g, -g]); b = np.zeros(len(g))
o = objs.get('ZETA'); ctx.prec = 80
res = {}
for i, x in enumerate([0.05, 0.2]):
    s = 0.5 + x + 1j * t
    AX = (-S[i] + explib.gamma_part('ZETA', s, X, eta)).real
    near = np.abs(g) < 4000
    ker = explib.zero_kernel(x, t, b, g, X, eta).real
    lor = explib.lorentz(x, t, b, g).real
    far = x * (np.log(4000 / (2 * math.pi)) + 1) / (math.pi * 4000) * 2      # x * 2 int_4000^inf log(u/2pi)/(2 pi u^2) du
    truth = np.array([float(objs.XL(o, acb(x, float(tt)))[1].real.mid()) for tt in t[::64]])
    res[x] = dict(max_dev_prime_vs_kernel_sum=float(np.abs(AX - ker - far).max()), max_dev_lorentz_vs_arb=float(np.abs(lor[::64] + far - truth).max()),
                  max_abs_A=float(np.abs(AX).max()), max_dev_prime_vs_arb=float(np.abs(AX[::64] - truth).max()))
    print(x, res[x])
json.dump(res, open(os.path.join(here, 'out', 'val_explicit.json'), 'w'), indent=1)
