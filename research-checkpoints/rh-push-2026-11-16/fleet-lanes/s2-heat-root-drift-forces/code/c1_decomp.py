"""DH, heights below 2000: split of the prime-side force (cos2 weight) into the on-line and off-line zero contributions, using the identity
   E_w(t) = sum_zeros k_w(t - zeta),  k_w(x) = int_0^L cos^2(pi v/2L) sin(x v) dv  (closed form, complex x allowed).
   Shows which zeros carry the loss of correlation with V."""
import numpy as np, json, math, sys
import ctl, combo1
B = '../../c12-control-battery-harness/tables/'
z = json.load(open(B + 'zeros_DH.json')); on = np.array([float(x) for x in z['online']]); off = [(float(b) - 0.5, float(g)) for b, g, _ in z['offline']]
def kw(x, L):
    def k0(y):   # int_0^L sin(y v) dv = (1 - cos(L y))/y
        y = np.where(np.abs(y) < 1e-12, 1e-12, y); return (1 - np.cos(L * y)) / y
    return 0.5 * k0(x) + 0.25 * k0(x + np.pi / L) + 0.25 * k0(x - np.pi / L)
V = np.array(json.load(open(sys.argv[1]))['V']) if len(sys.argv) > 1 else None
out = []
for X in (1e2, 1e4, 1e6):
    L = math.log(X); vc = ctl.coeffs('DH', X); E = combo1.prime_force('DH', on, X, vc)['cos2'][0]
    Eon = np.zeros(len(on)); Eoff = np.zeros(len(on))
    for i, t in enumerate(on):
        d = t - on; d2 = t + on
        Eon[i] = kw(d, L).sum() + kw(d2, L).sum()
        s = 0.0
        for dl, g in off:
            for zz in (g - 1j * dl, g + 1j * dl, -g - 1j * dl, -g + 1j * dl): s += kw(np.array([t - zz]), L)[0]
        Eoff[i] = s.real
    resid = E - Eon - Eoff; resid -= resid.mean()
    row = dict(X=X, rms_prime_side=float(E.std()), rms_online_part=float(Eon.std()), rms_offline_part=float(Eoff.std()), rms_residual=float(resid.std()),
               amplification_first_offline=X ** 0.3085)
    m = on < 85.0
    row['below_85'] = dict(rms_online_part=float(Eon[m].std()), rms_offline_part=float(Eoff[m].std()))
    out.append(row); print(row, flush=True)
json.dump(out, open('../out/c1_decomp_DH.json', 'w'), indent=0)
