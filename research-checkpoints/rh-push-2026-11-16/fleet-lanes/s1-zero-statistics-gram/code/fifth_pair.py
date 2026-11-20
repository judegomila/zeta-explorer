"""Test 4a: pairing of the Gram eigenvalues of the skew-Toeplitz matrix T(u,v) = a (v-u) R(|v-u|) H (imp-3668 assembly:
NPHI = 10, H0 = 0.025, U = N H0, midpoint nodes).  S = T^T T.  For any real kernel phi, T is real antisymmetric, so the
nonzero eigenvalues of T are +-i sigma and S = -T^2 has every sigma^2 with even multiplicity: the pairing is algebraic."""
import numpy as np, math, json, sys
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
def phi_zeta(u):     # the repo kernel (imp-3668 phiKernel)
    s = 0.0
    for n in range(1, 11):
        s = s + (2 * math.pi ** 2 * n ** 4 * np.exp(4 * u) - 3 * math.pi * n ** 2 * np.exp(2 * u)) * np.exp(-math.pi * n * n * np.exp(4 * u))
    return s
def phi_per(a):      # odd theta kernel with period-5 coefficients a(n): sum a(n) n e^{3u} exp(-pi n^2 e^{4u}/5)
    def f(u):
        s = 0.0
        for n in range(1, 40):
            c = a[(n - 1) % 5]
            if c: s = s + c * n * np.exp(3 * u) * np.exp(-math.pi * n * n * np.exp(4 * u) / 5)
        return s
    return f
def spectrum(phi, N, H0=0.025, a=1.0):
    H = H0; u = (np.arange(N) + 0.5) * H
    p = phi(u)
    R = np.array([np.dot(p[:N - k], p[k:]) * H for k in range(N)])
    i = np.arange(N); K = np.abs(i[:, None] - i[None, :])
    T = a * (u[None, :] - u[:, None]) * R[K] * H
    S = T.T @ T
    w = np.linalg.eigvalsh(S)[::-1]
    sv = np.sort(np.abs(np.linalg.eigvals(T).imag))[::-1]      # independent: eigenvalues of T are +- i sigma
    return w, sv, float(np.abs(T + T.T).max())
rng = np.random.default_rng(7)
noise = rng.standard_normal(4000)
kernels = {'ZETA (repo kernel)': phi_zeta, 'CHI5R odd theta': phi_per([1, -1, -1, 1, 0]), 'DH odd theta': phi_per([1, KAPPA, -KAPPA, -1, 0]),
           'random kernel': lambda u: noise[:len(u)] * np.exp(-u)}
out = []
for N in [int(v) for v in sys.argv[2:]] or [1200]:
    for name, phi in kernels.items():
        w, sv, sk = spectrum(phi, N)
        spreads = [abs(w[2 * j] - w[2 * j + 1]) / w[2 * j] for j in range(5)]
        row = dict(kernel=name, N=N, skew_defect=sk, top10=[float(v) for v in w[:10]], pair_spreads=[float(s) for s in spreads], fifth_pair_spread=float(spreads[4]),
                   sigma4=float(w[8] / w[0]), top_sv_pair_from_T=[float(sv[0] ** 2), float(sv[1] ** 2)])
        out.append(row)
        print('%-20s N=%d  |T+T^T|max=%.1e  spreads of pairs 1..5: %s  lambda_9/lambda_1=%.5f' % (name, N, sk, ' '.join('%.2e' % s for s in spreads), row['sigma4']), flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
