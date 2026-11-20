"""Owed numerics (round 1): K[t] for the backward heat family at tau = -2 (lane sq-canonical-det, Suzuki's operator).

Theta(z) = F_tau(z - omega)/F_tau(z + omega), bridge coordinate z = s - 1/2. Poles in Re z > 0: z = rho - omega for the
zeros rho = delta + i gamma of F_tau with delta > omega. The kernel taken on a contour that runs above the poles of
height |gamma| < Gamma and along the line Re z = 0 elsewhere is
    K_Gamma(x) = k_0(x) + r_Gamma(x),   r_Gamma(x) = sum_{|gamma_j| < Gamma} 2 Re( c_j exp((v_j + i gamma_j) x) ),
v_j = delta_j - omega, c_j = F_tau(rho_j - 2 omega)/F_tau'(rho_j), and k_0 the boundary kernel (Fourier transform of a
unimodular function: the operator f -> int k_0(x+y) f(y) dy has norm <= 1 on L^2(-T,T)).
R_Gamma[T]: operator on L^2(-T,T) with kernel r_Gamma(x+y): finite rank, real symmetric. Its non-zero spectrum is the
spectrum of C G, C = diag(c_lambda), G[lambda, mu] = 2 sinh((lambda+mu) T)/(lambda+mu), lambda in {v_j +- i gamma_j}.
Then ||K_Gamma[T]|| >= ||R_Gamma[T]|| - 1.  No Ritz degree enters: the computation is exact for the given pole data.
MEASURED (pole data from python-flint quadrature, midpoints; eigenvalues by mpmath at 60 digits).
Planned memory: quadrature table about 15 MB; matrices at most 48 x 48 mpmath complex."""
import sys, json, glob, os
HERE = os.path.dirname(os.path.abspath(__file__))
C1 = os.path.join(HERE, '..', '..', 'c1-missing-controls')
sys.path.insert(0, C1)
from heatlib import Heat
from flint import acb, arb
import mpmath as mp

TAU = -2.0
def mid(s): return float(s.split('[')[1].split(' ')[0])
zs = {}
for f in sorted(glob.glob(os.path.join(C1, 'partB_heat_zeros*.json'))):
    for k, rec in json.load(open(f)).items():
        if isinstance(rec, dict) and rec.get('tau') == TAU:
            for o in rec.get('offline_upper_right', []):
                d, g = mid(o['delta']), mid(o['gamma'])
                zs[round(g, 6)] = (d, g)
zs = [zs[k] for k in sorted(zs)]
print('zeros of F_tau with Re > 0, Im > 0 read:', len(zs), flush=True)
H = Heat(700, 480.0)
poles = []
for d, g in zs:
    z0, err = H.newton(TAU, acb(d, g))
    f, f1 = H.F(TAU, z0, True)
    rec = dict(delta=float(z0.real.mid()), gamma=float(z0.imag.mid()), newton_step=err, absF=float(abs(f).mid()))
    for om in (0.1, 0.25):
        c = H.F(TAU, z0 - 2 * om) / f1
        rec['c_%g' % om] = [float(c.real.mid()), float(c.imag.mid())]
    poles.append(rec)
    print(json.dumps(rec), flush=True)

mp.mp.dps = 60
def rnorm(om, Gam, T):
    lam = []; cc = []
    for p in poles:
        v = p['delta'] - om
        if v <= 0 or p['gamma'] >= Gam: continue
        c = mp.mpc(*p['c_%g' % om])
        lam += [mp.mpc(v, p['gamma']), mp.mpc(v, -p['gamma'])]; cc += [c, mp.conj(c)]
    n = len(lam)
    if n == 0: return 0.0, 0
    A = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            s = lam[i] + lam[j]
            A[i, j] = cc[i] * 2 * mp.sinh(s * T) / s
    ev = mp.eig(A, left=False, right=False)
    return float(max(abs(e) for e in ev)), n // 2

out = dict(tau=TAU, poles=poles, table=[], crossing=[])
Ts = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 1.72, 2.0]
for om in (0.1, 0.25):
    for Gam in (55.0, 70.0, 100.0, 130.0, 160.0, 190.0, 230.0):
        row = []
        for T in Ts:
            nr, npo = rnorm(om, Gam, T); row.append(nr)
        # first T with norm >= 1 and >= 2 by bisection (norm is non-decreasing in T: compression)
        cr = {}
        for level in (1.0, 2.0):
            lo, hi = 0.0, 4.0
            if rnorm(om, Gam, hi)[0] < level: cr[str(level)] = None; continue
            for _ in range(40):
                m = (lo + hi) / 2
                if rnorm(om, Gam, m)[0] >= level: hi = m
                else: lo = m
            cr[str(level)] = hi
        out['table'].append(dict(omega=om, Gamma=Gam, poles=npo, T=Ts, norm=row))
        out['crossing'].append(dict(omega=om, Gamma=Gam, poles=npo, T_norm1=cr['1.0'], T_norm2=cr['2.0']))
        print('omega %.2f Gamma %5.0f poles %2d  T(||R||=1) = %s  T(||R||=2) = %s  norms %s' % (
            om, Gam, npo, cr['1.0'], cr['2.0'], ' '.join('%.3g' % x for x in row)), flush=True)
json.dump(out, open(os.path.join(HERE, 'heat_k_poles.json'), 'w'), indent=1)
