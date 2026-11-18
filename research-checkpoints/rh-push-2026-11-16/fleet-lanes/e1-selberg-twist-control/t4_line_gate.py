"""Zeros on Re s = 1/2 for t <= 4.5 (Hardy-type real function) and the sigma = 0.55 phase gate, for one character with
an exceptional zero (0.03, 0.05) and one without (0.10, 0.25). K = 40, compared with K = 32 at sample points."""
import sys, time, json, math, cmath
import numpy as np, mpmath as mp
sys.path.insert(0, 'tmp/research-2026-11-16/push/e1-selberg-twist-control')
from sel import *
t0 = time.time(); out = []
def alphas(a, b): return [x % 1.0 for x in (a, b, a - b)]
def tanint(w):
    w = mp.mpmathify(w)
    return complex(mp.quad(lambda u: (u * w) * mp.tan(mp.pi * u * w) * w, [0, 0.25, 0.5, 0.75, 1]))
def logPsi(s, a, b):
    w = complex(s) - 0.5
    return 2 * math.pi * tanint(w) + 2 * sum(math.log(2 * math.sin(math.pi * x)) for x in alphas(a, b)) * w
for (a, b) in [(0.03, 0.05), (0.10, 0.25)]:
    ts = [0.05 * i for i in range(1, 91)]
    H = []; gate = []
    for t in ts:
        z = Ztw(complex(0.5, t), a, b, K=40)
        lp = logPsi(complex(0.5, t), a, b)          # purely imaginary on the line; continuous in t (no branch: computed by quadrature)
        H.append(z * cmath.exp(-0.5 * lp))
        gate.append(Ztw(complex(0.55, t), a, b, K=40).real)
    relim = [abs(h.imag) / abs(h) for h in H]
    sc = [round((ts[i] + ts[i - 1]) / 2, 3) for i in range(1, len(H)) if H[i].real * H[i - 1].real < 0]
    kc = [abs(Ztw(complex(0.5, t), a, b, K=32) / Ztw(complex(0.5, t), a, b, K=40) - 1) for t in (1.0, 2.5, 4.5)]
    row = {'a': a, 'b': b, 'max_rel_imag_H_t<=4.5': max(relim), 'max_rel_real_part_of_logPsi': max(abs(logPsi(complex(0.5, t), a, b).real) for t in (1.0, 3.0, 4.5)),
           'sign_changes_of_H_(t, step 0.05)': sc, 'count': len(sc), 'weyl_main_term_T^2/2_at_4.5': 4.5 ** 2 / 2,
           'K32_vs_K40_rel_diff_at_t=1,2.5,4.5': kc,
           'gate_sigma0.55_frac_ReZ<0': sum(1 for g in gate if g < 0) / len(gate), 'gate_min_ReZ': min(gate), 'gate_max_ReZ': max(gate)}
    out.append(row); print(json.dumps(row), round(time.time() - t0, 1), flush=True)
json.dump(out, open('tmp/research-2026-11-16/push/e1-selberg-twist-control/t4_line_gate.json', 'w'), indent=1)
