"""CHECK 2 (PR 45 all-order structure; PR 44 order-two jet), independent quadrature.
J_mn = d_u^m d_v^n H(0,0)/alpha = int_0^inf [2u k^(m) k^(n) + m k^(m-1) k^(n) + n k^(m) k^(n-1)] du.
Verifies: displacement identity (3.2), closed form (4.2), bridge (3.4), J_2(0) enclosures, J_11 = int (-b') k'^2,
and reports the least eigenvalue of the diagonally normalised jet J_N for zeta, kappa_sharp, DH.
"""
import sys, json
import mpmath as mp
from kern import zeta_kernel, dh_kernel, sharp_kernel

NMAX = int(sys.argv[1]) if len(sys.argv) > 1 else 14
mp.mp.dps = int(sys.argv[2]) if len(sys.argv) > 2 else 90
HINV = int(sys.argv[3]) if len(sys.argv) > 3 else 24
WHICH = sys.argv[4].split(',') if len(sys.argv) > 4 else ['zeta','s3','s30','DH']


def nodes(h):
    xs = []
    x = mp.mpf(-7)
    while x <= mp.mpf('2.2'):
        u = mp.exp(x - mp.exp(-x))
        w = u * (1 + mp.exp(-x)) * h
        xs.append((u, w))
        x += h
    return xs


def moments(k, N, h):
    nd = nodes(h)
    vals = [[k.d(j, u) for j in range(N + 1)] for (u, w) in nd]
    I = [[mp.fsum(w * u * v[m] * v[n] for (u, w), v in zip(nd, vals)) for n in range(N + 1)] for m in range(N + 1)]
    B = [[mp.fsum(w * v[m] * v[n] for (u, w), v in zip(nd, vals)) for n in range(N + 1)] for m in range(N + 1)]
    return I, B


def jets(k, N, h):
    I, B = moments(k, N, h)
    J = mp.matrix(N + 1, N + 1)
    for m in range(N + 1):
        for n in range(N + 1):
            J[m, n] = 2 * I[m][n] + (m * B[m - 1][n] if m else 0) + (n * B[m][n - 1] if n else 0)
    return J, I, B


def min_eig_norm(J, N):
    M = mp.matrix(N + 1, N + 1)
    for i in range(N + 1):
        for j in range(N + 1):
            M[i, j] = J[i, j] / mp.sqrt(abs(J[i, i]) * abs(J[j, j]))
    M = (M + M.T) / 2
    return min(mp.eigsy(M, eigvals_only=True))


out = {}
h = mp.mpf(1) / HINV
def mk(w):
    if w == 'zeta': return ('zeta', zeta_kernel(NMAX + 2))
    if w == 'DH': return ('DH', dh_kernel(NMAX + 2))
    g = w[1:]
    return ('sharp(rho=0.3+%si)' % g, sharp_kernel(mp.mpc('0.3', g), NMAX + 2))
for name, k in [mk(w) for w in WHICH]:
    J, I, B = jets(k, NMAX, h)
    J2, _, _ = jets(k, NMAX, h / 2)
    quad_err = max(abs(J[i, j] - J2[i, j]) / mp.sqrt(abs(J[i, i]*J[j, j])) for i in range(NMAX+1) for j in range(NMAX+1))
    r_fine = {str(N): mp.nstr(min_eig_norm(J2, N), 6) for N in range(2, NMAX + 1, 2)}
    kk = [k.d(j, 0) for j in range(NMAX + 1)]
    r = {'quadrature_rel_err_h_vs_h/2(normalised,all entries)': mp.nstr(quad_err, 3), 'min_eig_normalised_J_N_at_h/2': r_fine}
    # odd-total-order entries vanish
    r['max_odd_total_entry_rel'] = mp.nstr(max(abs(J[m, n]) / mp.sqrt(abs(J[m, m] * J[n, n])) for m in range(NMAX + 1) for n in range(NMAX + 1) if (m + n) % 2), 3)
    # (3.2) displacement
    dev = mp.mpf(0)
    for m in range(NMAX):
        for n in range(NMAX):
            if (m + n) % 2 == 0:
                continue
            lhs = J[m + 1, n] + J[m, n + 1]
            rhs = -((m * kk[m - 1] * kk[n] if m else 0) + (n * kk[m] * kk[n - 1] if n else 0))
            dev = max(dev, abs(lhs - rhs) / (abs(rhs) + abs(J[m + 1, n]) + mp.mpf(10) ** -200))
    r['(3.2)_displacement_max_rel_dev'] = mp.nstr(dev, 3)
    # (4.2), (3.4)
    a = [(-1) ** p * kk[2 * p] for p in range(NMAX // 2 + 1)]
    dev42 = dev34 = mp.mpf(0)
    P = NMAX // 2
    for p in range(P + 1):
        for q in range(P + 1):
            Epq = (-1) ** (p + q) * J[2 * p, 2 * q]
            cf = 2 * I[p + q][p + q] + mp.fsum(abs(p + q - 1 - 2 * j) * a[j] * a[p + q - 1 - j] for j in range(min(p, q), max(p, q)))
            dev42 = max(dev42, abs(Epq - cf) / (abs(Epq) + abs(cf)))
            if 2 * p + 1 <= NMAX and 2 * q + 2 <= NMAX:
                Opq = (-1) ** (p + q) * J[2 * p + 1, 2 * q + 1]
                Ep = (-1) ** (p + q + 1) * J[2 * p, 2 * q + 2]
                dev34 = max(dev34, abs(Opq - (Ep - (2 * q + 1) * a[p] * a[q])) / (abs(Opq) + abs(Ep)))
    r['(4.2)_closed_form_max_rel_dev'] = mp.nstr(dev42, 3)
    r['(3.4)_bridge_max_rel_dev'] = mp.nstr(dev34, 3)
    r['J00,J11,J02,J22'] = [mp.nstr(J[0, 0], 14), mp.nstr(J[1, 1], 14), mp.nstr(J[0, 2], 14), mp.nstr(J[2, 2], 14)]
    r['det_even_2x2'] = mp.nstr(J[0, 0] * J[2, 2] - J[0, 2] ** 2, 12)
    r['det_J2'] = mp.nstr(J[1, 1] * (J[0, 0] * J[2, 2] - J[0, 2] ** 2), 12)
    r['odd_13_block_det'] = mp.nstr(J[1, 1] * J[3, 3] - J[1, 3] ** 2, 8)
    # J11 = int (-b') k'^2 with (-b') k'^2 = k k' + u k'^2 - u k k''
    nd = nodes(h)
    j11 = mp.fsum(w * (k.d(0, u) * k.d(1, u) + u * k.d(1, u) ** 2 - u * k.d(0, u) * k.d(2, u)) for (u, w) in nd)
    r['J11_minus_int(-b\')k\'^2_rel'] = mp.nstr(abs(J[1, 1] - j11) / abs(J[1, 1]), 3)
    # sign of -b' k'^2 integrand on a grid (b' <= 0 iff integrand >= 0)
    r['min_over_grid_of_(-b\')k\'^2'] = mp.nstr(min(k.d(0, u) * k.d(1, u) + u * k.d(1, u) ** 2 - u * k.d(0, u) * k.d(2, u) for u in [mp.mpf(i) / 40 for i in range(1, 160)]), 4)
    r['min_eig_normalised_J_N'] = {str(N): mp.nstr(min_eig_norm(J, N), 6) for N in range(2, NMAX + 1, 2)}
    r['diag_signs'] = ''.join('+' if J[i, i] > 0 else '-' for i in range(NMAX + 1))
    out[name] = r
    print(name, json.dumps(r, indent=1), flush=True)
