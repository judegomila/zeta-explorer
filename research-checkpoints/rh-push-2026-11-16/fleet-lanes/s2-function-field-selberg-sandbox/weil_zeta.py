"""weil_zeta.py: the same hat-function Weil form for zeta, L(s, chi_4) and the Liouville sign twist of the prime side (controls on the zeta side).
   sum_gamma h(gamma) = 2 int_0^inf g(u) 2cosh(u/2) du [pole, zeta only] - g(0) log(pi/q) + P_a[g] - 2 sum_n chi(n) Lambda(n) n^{-1/2} g(log n),
   P_a[g] = (1/2pi) int h(r) Re psi((1/2 + a + i r)/2) dr = -gamma g(0) + 2 int_0^inf (g(0) e^{-2u} - g(u) e^{-(1/2 + a) u})/(1 - e^{-2u}) du, a = 0 (even), 1 (odd).
Validation: Gaussian h against the first zeros. usage: weil_zeta.py d Amax out.json"""
import sys, json, math
import numpy as np
import tf
def Pa(g, S, a, pieces):
    g0 = float(g(np.array([0.0]))[0])
    return -tf.EULER * g0 + 2 * tf._quad(lambda u: (g0 * np.exp(-2 * u) - g(u) * np.exp(-(0.5 + a) * u)) / (-np.expm1(-2 * u)), 0, S, pieces) - g0 * math.log1p(-math.exp(-2 * S))
def chi4(n): return np.where(n % 2 == 0, 0.0, np.where(n % 4 == 1, 1.0, -1.0))
ZZ = [14.134725141734693, 21.022039638771555, 25.010857580145688, 30.424876125859513, 32.935061587739189, 37.586178158825671, 40.918719012147495, 43.327073280914999, 48.005150881167159, 49.773832477672302]
LZ4 = [6.0209489046976, 10.2437703041665, 12.9880980123124, 16.3426071045872, 18.2919931961235, 21.4506113439835, 23.2783765204595, 25.7287564250522, 28.3596343430193, 29.6563840145932]
def validate():
    for tau in (0.08, 0.05):
        g = lambda u: np.exp(-u * u / (4 * tau)) / math.sqrt(4 * math.pi * tau)
        S = 14 * math.sqrt(2 * tau); g0 = float(g(np.array([0.0]))[0])
        lam = tf.mangoldt_upto(int(math.exp(S)) + 2); idx = np.nonzero(lam)[0]
        pole = 2 * tf._quad(lambda u: g(u) * 2 * np.cosh(u / 2), 0, S, 600)
        geo = pole - g0 * math.log(math.pi) + Pa(g, S, 0, 600) - 2 * float(np.sum(lam[idx] / np.sqrt(idx) * g(np.log(idx))))
        spec = 2 * sum(math.exp(-tau * z * z) for z in ZZ)
        print(f'zeta tau={tau}: geometric {geo:.6e} spectral {spec:.6e}')
        geo4 = -g0 * math.log(math.pi / 4) + Pa(g, S, 1, 600) - 2 * float(np.sum(chi4(idx) * lam[idx] / np.sqrt(idx) * g(np.log(idx))))
        spec4 = 2 * sum(math.exp(-tau * z * z) for z in LZ4)
        print(f'L(chi4) tau={tau}: geometric {geo4:.6e} spectral (first 10 zeros, values quoted from memory, 1e-9 not guaranteed) {spec4:.6e}')
if __name__ == '__main__':
    validate()
    d = float(sys.argv[1]); Amax = float(sys.argv[2]); n = int(round(Amax / d)) - 1
    nmax = int(math.exp(Amax)) + 2
    print(f'n={n}, primes to {nmax}; planned memory {nmax * 9 / 1e9:.2f} GB sieve', flush=True)
    lam = tf.mangoldt_upto(nmax); idx = np.nonzero(lam)[0]
    G0 = np.zeros(n); G0[0] = d * 2 / 3; G0[1] = d / 6; Gm = tf.gram(n, d)
    POLE = tf.arch_entries(n, d, lambda g, gp, S, pc: 2 * tf._quad(lambda u: g(u) * 2 * np.cosh(u / 2), 0, S, pc))
    P0 = tf.arch_entries(n, d, lambda g, gp, S, pc: Pa(g, S, 0, pc)); P1 = tf.arch_entries(n, d, lambda g, gp, S, pc: Pa(g, S, 1, pc))
    PR = tf.deposit(np.log(idx), 2 * lam[idx] / np.sqrt(idx), d, n)
    PR4 = tf.deposit(np.log(idx), 2 * chi4(idx) * lam[idx] / np.sqrt(idx), d, n)
    # Liouville sign twist: Lambda(p^k) -> (-1)^k Lambda(p^k)
    k = np.rint(np.log(idx) / lam[idx]); PRL = tf.deposit(np.log(idx), 2 * (-1.0) ** k * lam[idx] / np.sqrt(idx), d, n)
    objs = {'zeta (zeros only: pole terms moved to the arithmetic side)': POLE - math.log(math.pi) * G0 + P0 - PR,
            'L(chi_4)': -math.log(math.pi / 4) * G0 + P1 - PR4,
            'Liouville sign twist with the archimedean and pole terms of zeta': POLE - math.log(math.pi) * G0 + P0 - PRL,
            'chi_4 prime side with the archimedean terms of zeta (functional equation mismatched)': POLE - math.log(math.pi) * G0 + P0 - PR4}
    out = {}
    for name, m in objs.items():
        M = tf.toeplitz(m, n); rows = []
        for kk in range(4, n + 1, max(1, int(0.25 / d))):
            w, v = tf.min_eig(M[:kk, :kk], Gm[:kk, :kk]); rows.append(((kk + 1) * d, w))
        first = next((A for A, w in rows if w < -1e-9), None)
        out[name] = dict(first_negative_support=first, rows=rows)
        print(name, '| first failing support', first, '| min eig at largest support', rows[-1], flush=True)
    json.dump(out, open(sys.argv[3], 'w'))
