"""check of the T-NR sampler of c4_count.py against quadrature of the exact function on a short block:
Xi^TNR_t(w) = c Xi_t(w) + e^{t lam^2/4} 2 Re[e^{i lam w} Xi_t(w - i lam t/2)],  Xi_t = Gaussian convolution (variance |t|/2 in w) of Xi = xi(1/2 + i w) (Arb),  t < 0.
Usage: val_tnr_model.py Ta LEN q c tau1,tau2"""
import sys, os, math, json, numpy as np
from flint import arb, acb, ctx
Ta, LEN, q, c = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]); taus = [float(v) for v in sys.argv[5].split(',')]
HERE = os.path.dirname(os.path.abspath(__file__))
import c4_count as C
ctx.prec = 200; lam = math.log(q); L0 = math.log(Ta / (2 * math.pi)); hg = 0.01; pad = 1.2
w = np.arange(Ta - pad, Ta + LEN + pad, hg)
def xi(wr, wi, scale):
    s = acb(arb(0.5) - arb(wi), arb(wr)); v = s * (s - 1) / 2 * (-(s / 2) * arb.pi().log() + (s / 2).lgamma()).exp() * s.zeta() / scale
    return complex(float(v.real.mid()), float(v.imag.mid()))
s0 = acb(arb(0.5), arb(Ta)); scale = abs(s0 * (s0 - 1) / 2 * (-(s0 / 2) * arb.pi().log() + (s0 / 2).lgamma()).exp())
U0 = np.array([xi(float(x), 0.0, scale) for x in w])
res = []
for tau in taus:
    t = -16 * math.pi ** 2 * tau / L0 ** 2; dl = lam * abs(t) / 2; E = math.exp(t * lam * lam / 4)
    U1 = np.array([xi(float(x), dl, scale) for x in w])                       # Xi(w + i dl)
    sg = math.sqrt(abs(t) / 2); m = int(6 * sg / hg) + 1; y = hg * np.arange(-m, m + 1); G = np.exp(-y * y / (2 * sg * sg)); G /= G.sum()
    X0 = np.convolve(U0, G, mode='same'); X1 = np.convolve(U1, G, mode='same')
    F = (c * X0 + E * 2 * (np.exp(1j * lam * w) * X1)).real if False else (c * X0.real + E * 2 * (np.exp(1j * lam * w) * X1).real)
    ins = (w >= Ta) & (w < Ta + LEN); idx = np.nonzero(ins[:-1] & (F[:-1] * F[1:] < 0))[0]
    ze = w[idx] - F[idx] * hg / (F[idx + 1] - F[idx])
    # zeta_t itself on the same grid (c X0 only) for reference
    iz = np.nonzero(ins[:-1] & (X0.real[:-1] * X0.real[1:] < 0))[0]
    zm = C.tnr_block(int(Ta), int(Ta + LEN), -tau, q, c)
    same = len(zm) == len(ze)
    r = dict(tau=tau, t=t, exact_count=int(len(ze)), model_count=int(len(zm)), zeta_t_count=int(len(iz)), max_abs_position_diff=(float(np.abs(zm - ze).max()) if same else None),
             rms_position_diff=(float(np.sqrt(((zm - ze) ** 2).mean())) if same else None), mean_spacing=2 * math.pi / L0)
    res.append(r); print(json.dumps(r), flush=True)
json.dump(res, open(os.path.join(HERE, 'out', 'val_tnr_model_%g_%g.json' % (Ta, q)), 'w'))
