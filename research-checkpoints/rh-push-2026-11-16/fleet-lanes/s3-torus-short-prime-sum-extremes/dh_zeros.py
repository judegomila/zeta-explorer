"""Off-line zeros of the Davenport-Heilbronn function below a given height (mpmath root finding from the step heights
of the line count found by c3.py), 30 digits."""
import sys, json, math, os
os.environ['RH_NOGPU'] = '1'
import mpmath as mp
import torus as T
mp.mp.dps = 30
fn = sys.argv[1]; tmax = float(sys.argv[2])
R = json.load(open(fn))
chi = [0, 1, 1j, -1j, -1]; chib = [0, 1, -1j, 1j, -1]
c1 = mp.mpc(T.DH_C1); c2 = mp.mpc(T.DH_C2)
kap = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
c1 = (1 - 1j * kap) / 2; c2 = (1 + 1j * kap) / 2
F = lambda s: c1 * mp.dirichlet(s, chi) + c2 * mp.dirichlet(s, chib)
out = []
for g in R['dh']['first_step_heights']:
    if g > tmax:
        break
    best = None
    for s0 in (0.65, 0.8, 0.95, 1.1):
        for dg in (0.0, 0.3, -0.3):
            try:
                r = mp.findroot(F, mp.mpc(s0, g + dg), tol=1e-20, maxsteps=60)
            except Exception:
                continue
            if abs(F(r)) < 1e-15 and mp.re(r) > 0.5 + 1e-6 and abs(mp.im(r) - g) < 1.5:
                best = r; break
        if best is not None:
            break
    out.append(dict(step_height=g, beta=float(mp.re(best)) if best is not None else None, gamma=float(mp.im(best)) if best is not None else None))
    print(out[-1], flush=True)
json.dump(out, open('dh_offline_zeros.json', 'w'), indent=1)
