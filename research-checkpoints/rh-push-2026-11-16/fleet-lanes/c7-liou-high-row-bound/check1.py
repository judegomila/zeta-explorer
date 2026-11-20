"""Exact check (machine precision) of the pair Poisson formula used in Lemma 3 of RESULT.md.
For coprime squarefree primary c, c' (coprime to 6), k = c c', shifted Gaussian row weight exp(-pi |m - z0|^2 / M)
(the shift z0 makes the test non-vacuous: for z0 = 0 the six unit multiples of m cancel unless the pair character is
trivial on units):
  sum_{m in O} exp(-pi |m - z0|^2/M) chi_c(m) conj(chi_c'(m))
    = (M / (A q_k)) sum_{h in O} exp(-4 pi M q_h / (3 q_k)) exp(2 pi i Re(2 h z0/(k lambda)))
        * q_k^(1/2) gamma_1(c) conj(gamma_1(c')) conj(chi_c(h)) chi_c'(-h) chi_c(c') conj(chi_c'(c)),   A = sqrt(3)/2."""
import numpy as np, lib7
D = lib7.build(400)
pl, S, qc, gam, inc = D['pl'], D['S'], D['qc'], D['gam'], D['inc']
print('primes', len(pl), 'squarefree c', len(qc), 'max | |gamma_1| - 1 | =', np.max(np.abs(np.abs(gam) - 1)))
A = np.sqrt(3) / 2; om = np.exp(2j * np.pi / 3); lam = 1 + 2 * om
rng = np.random.default_rng(7)
E = np.rint(inc @ S.astype(np.float32) @ inc.T).astype(np.int64) % 6     # E[c, c'] = exponent of chi_c(c')
share = (inc @ inc.T) > 0.5
def elem(i):
    e = (1, 0)
    for j in np.nonzero(inc[i])[0]: e = lib7.emul(e, (pl[j].a, pl[j].b))
    return e[0] + e[1] * om
worst = 0; done = 0
for trial in range(60):
    i, j = rng.integers(1, len(qc), 2)
    if share[i, j] or i == j: continue
    M = float(rng.choice([3.0, 10.0, 40.0])); z0 = complex(rng.normal(), rng.normal())
    qk = float(qc[i] * qc[j]); kel = elem(i) * elem(j)
    u, v, q = lib7.lattice(60 * M + 40)
    T, Zm = lib7.sym_table(pl, u, v)
    X = lib7.chi_c(inc[[i, j]], T, Zm)
    lhs = np.sum(np.exp(-np.pi * np.abs(u + v * om - z0) ** 2 / M) * X[0] * np.conj(X[1]))
    hu, hv, hq = lib7.lattice(12 * qk / M)
    T, Zm = lib7.sym_table(pl, hu, hv); Xh = lib7.chi_c(inc[[i, j]], T, Zm)
    T2, Zm2 = lib7.sym_table(pl, -hu, -hv); Xmh = lib7.chi_c(inc[[j]], T2, Zm2)[0]
    ph = lib7.Z6[(E[i, j] - E[j, i]) % 6]
    shift = np.exp(-2j * np.pi * np.real(2 * (hu + hv * om) * z0 / (kel * lam)))
    rhs = (M / (A * qk)) * np.sqrt(qk) * gam[i] * np.conj(gam[j]) * ph * np.sum(
        np.exp(-4 * np.pi * M * hq / (3 * qk)) * shift * np.conj(Xh[0]) * Xmh)
    worst = max(worst, abs(lhs - rhs)); done += 1
    if done <= 8: print('q_c, q_c\' = %d, %d  M = %g  lhs = %.10f%+.10fi  |lhs - rhs| = %.2e' % (qc[i], qc[j], M, lhs.real, lhs.imag, abs(lhs - rhs)))
print('pairs tested', done, ' worst |lhs - rhs|: %.3e' % worst)
