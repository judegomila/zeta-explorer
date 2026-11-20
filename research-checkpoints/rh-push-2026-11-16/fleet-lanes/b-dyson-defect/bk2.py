# Bogomolny-Keating / Conrey-Snaith two-point function of zeta zeros at height L=log(T/2pi), unfolded.
import mpmath as mp, math, sys
mp.mp.dps = 25
from sympy import primerange
PR = list(primerange(2, 200000))
def AB(eta):
    # A(eta) = prod_p (1-p^{-1-eta})(1-2/p+p^{-1-eta})/(1-1/p)^2 ; B(eta)=sum_p (log p/(p^{1+eta}-1))^2
    lA = mp.mpc(0); B = mp.mpc(0)
    for p in PR:
        lp = math.log(p); pe = mp.exp(-(1 + eta) * lp)
        lA += mp.log(1 - pe) + mp.log(1 - mp.mpf(2) / p + pe) - 2 * mp.log(1 - mp.mpf(1) / p)
        B += (lp / (mp.exp((1 + eta) * lp) - 1)) ** 2
    return mp.exp(lA), B
def R2(s, L):
    r = 2 * mp.pi * s / L; ir = mp.mpc(0, r)
    A, B = AB(ir)
    zz = mp.zeta(1 + ir); zd = mp.zeta(1 + ir, derivative=1); zdd = mp.zeta(1 + ir, derivative=2)
    lz2 = zdd / zz - (zd / zz) ** 2
    val = lz2 - B + mp.exp(-ir * L) * mp.zeta(1 - ir) * zz * A
    return 1 + 2 * mp.re(val) / L ** 2
def cue(s, N): return 1 - (math.sin(math.pi * s) / (N * math.sin(math.pi * s / N))) ** 2
LAM = 1.57314
for L in [11.98, 21.19, 46.0]:
    Ne = L / math.sqrt(12 * LAM)
    print('L', L, 'Neff', Ne)
    for s in [0.05, 0.1, 0.2, 0.4, 0.7, 1.0, 1.5, 2.5]:
        z = float(R2(s, L)); g = 1 - (math.sin(math.pi * s) / (math.pi * s)) ** 2
        c = cue(s, Ne)
        print('  s=%.2f zeros %.6f sine %.6f CUE_Neff %.6f  (z-sine)/(cue-sine)=%.3f' % (s, z, g, c, (z - g) / (c - g) if abs(c-g)>1e-9 else float('nan')))
