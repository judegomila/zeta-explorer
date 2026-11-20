"""Combination 2: sign pattern of the theta kernels.  For an odd character sum c(n) mod q,
 F(1/2 + w) = (pi/q)^(1/2) 8 int_0^inf Psi(u) cosh(2uw) du,  Psi(u) = sum_n c(n) n e^{3u} exp(-pi n^2 e^{4u}/q)   (theta inversion makes Psi even).
Checks: (a) the integral reproduces chan.jet at w = 0.3; (b) min of Psi on u >= 0 (pointwise positivity); (c) ratio of the
termwise-absolute majorant to the kernel in K1(r) = 8 int u^2 Psi cosh(2ru) du (first-order perturbation bound)."""
import mpmath as mp, json, math
import chan as C
from flint import acb, fmpq
mp.mp.dps = 30
kap = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
objs = {'L3': (3, [0, 1, -1]), 'L4': (4, [0, 1, 0, -1]), 'DH': (5, [0, 1, kap, -kap, -1])}
C.setprec(256, 60); out = {}
for name, (q, c) in objs.items():
    def Psi(u, ab=False):
        s = mp.mpf(0); e4 = mp.e ** (4 * u)
        for n in range(1, 60):
            cn = c[n % q]; cn = abs(cn) if ab else cn
            if cn == 0: continue
            t = n * mp.e ** (3 * u) * mp.e ** (-mp.pi * n * n * e4 / q); s += cn * t
            if n > 3 and t < mp.mpf(10) ** -40: break
        return s
    nrm = mp.sqrt(mp.pi / q) * 8
    val = nrm * mp.quad(lambda u: Psi(u) * mp.cosh(0.6 * u), [0, 0.5, 1, 2])
    ref = C.jet(name, acb(fmpq(4, 5)), 1)[0]
    mn = min(Psi(mp.mpf(k) / 200) for k in range(0, 400))
    row = {'integral_at_w=0.3': float(val), 'jet_at_w=0.3': C.f(ref.real), 'min_Psi_on_[0,2)': float(mn), 'Psi(0)': float(Psi(0)), 'ratio_abs_over_signed_K1': {}}
    for r in (0, 0.35, 1.0, 3.0):
        k1 = mp.quad(lambda u: u * u * Psi(u) * mp.cosh(2 * r * u), [0, 0.5, 1, 2]); k1a = mp.quad(lambda u: u * u * Psi(u, True) * mp.cosh(2 * r * u), [0, 0.5, 1, 2])
        row['ratio_abs_over_signed_K1'][str(r)] = float(k1a / k1)
    # K1 from the jet: F''(1/2 + r)/4 at r = 0.35
    j = C.jet(name, acb(fmpq(17, 20)), 3); row['K1_jet_r=0.35'] = C.f(j[2].real) * 2 / 4
    row['K1_integral_r=0.35'] = float(nrm * mp.quad(lambda u: u * u * Psi(u) * mp.cosh(0.7 * u), [0, 0.5, 1, 2]))
    out[name] = row; print(name, row)
json.dump(out, open('out/kern.json', 'w'), indent=1)
