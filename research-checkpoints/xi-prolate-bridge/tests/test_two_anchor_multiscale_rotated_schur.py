import math
import unittest
from fractions import Fraction
from pathlib import Path


def response_vector(N, alpha):
    if alpha == math.inf:
        return [1.0] + [math.sqrt(2.0)] * N
    if alpha == 0:
        return [1.0] + [0.0] * N
    aa = alpha * alpha
    return [1.0] + [math.sqrt(2.0) * aa / (n * n + aa)
                    for n in range(1, N + 1)]


def dot(x, y):
    return sum(a * b for a, b in zip(x, y))


def norm(x):
    return math.sqrt(dot(x, x))


def unit(x):
    nx = norm(x)
    return [v / nx for v in x]


def scale_grid(N):
    grid = [0.0]
    a = 1
    while a <= N:
        grid.append(float(a))
        a *= 16
    grid.append(math.inf)
    return grid


def multiscale_anchor(N):
    vectors = [unit(response_vector(N, a)) for a in scale_grid(N)]
    return unit([sum(v[k] for v in vectors) for k in range(N + 1)])


def mat_vec(A, x):
    return [sum(A[i][j] * x[j] for j in range(len(x)))
            for i in range(len(A))]


def transpose(A):
    return [list(row) for row in zip(*A)]


def mat_mul(A, B):
    BT = transpose(B)
    return [[sum(a * b for a, b in zip(row, col)) for col in BT]
            for row in A]


def inverse_fraction(A):
    n = len(A)
    aug = [list(A[i]) + [Fraction(int(i == j)) for j in range(n)]
           for i in range(n)]
    for j in range(n):
        pivot = next(i for i in range(j, n) if aug[i][j] != 0)
        aug[j], aug[pivot] = aug[pivot], aug[j]
        p = aug[j][j]
        aug[j] = [x / p for x in aug[j]]
        for i in range(n):
            if i == j:
                continue
            c = aug[i][j]
            aug[i] = [x - c * y for x, y in zip(aug[i], aug[j])]
    return [row[n:] for row in aug]


def bilinear(x, A, y):
    return sum(a * b for a, b in zip(x, mat_vec(A, y)))


class ResponseConeMultiscaleTests(unittest.TestCase):
    def test_note_retains_claim_boundary_and_exact_missing_inputs(self):
        note = (Path(__file__).resolve().parents[1] / "notes" /
                "TWO_ANCHOR_MULTISCALE_ROTATED_SCHUR_REDUCTION.md").read_text()
        self.assertIn("P0_INVALIDATED", note)
        self.assertIn("does not sign either source block", note)
        self.assertIn("relative surplus estimate", note)
        self.assertIn("cancellation-preserving inverse-vector estimate", note)

    def test_uniform_response_norm_and_cross_scale_bounds(self):
        for N in (2, 7, 31, 257):
            alphas = (0.0, 0.2, 1.0, 2.5, N / 2, float(N),
                      5.0 * N, math.inf)
            for alpha in alphas:
                b = response_vector(N, alpha)
                d = min(N, max(1.0, alpha if alpha != math.inf else N))
                self.assertGreaterEqual(dot(b, b) + 1e-14, d / 4)
                self.assertLessEqual(dot(b, b), 9 * d + 1e-12)
            for i, alpha in enumerate(alphas):
                for beta in alphas[i:]:
                    da = min(N, max(1.0,
                                    alpha if alpha != math.inf else N))
                    db = min(N, max(1.0,
                                    beta if beta != math.inf else N))
                    if da > db:
                        da, db = db, da
                    ua = unit(response_vector(N, alpha))
                    ub = unit(response_vector(N, beta))
                    corr = dot(ua, ub)
                    self.assertGreater(corr, 0.0)
                    self.assertLessEqual(corr,
                                         52 * math.sqrt(da / db) + 1e-12)
                    if db / da <= 16:
                        self.assertGreaterEqual(corr + 1e-12, 1 / 24)

    def test_explicit_multiscale_anchor_has_certified_depth(self):
        for N in (16, 64, 256, 1024):
            z = multiscale_anchor(N)
            grid_size = len(scale_grid(N))
            certified = 1 / (24 * math.sqrt(37 * grid_size))
            samples = [0.0, math.inf]
            samples.extend(math.exp(x) for x in
                           [(-8 + 20 * j / 1200) for j in range(1201)])
            sampled_depth = min(dot(unit(response_vector(N, a)), z)
                                for a in samples)
            self.assertGreaterEqual(sampled_depth + 1e-12, certified)

    def test_geometric_grid_gram_has_uniform_row_bound(self):
        for N in (16, 256, 4096):
            finite = []
            a = 1
            while a <= N:
                finite.append(unit(response_vector(N, float(a))))
                a *= 16
            row_bounds = [sum(abs(dot(u, v)) for v in finite)
                          for u in finite]
            self.assertLess(max(row_bounds), 36.0)

    def test_hybrid_closed_cone_margin_and_distance(self):
        N = 256
        p = [1.0] + [0.0] * N
        w = multiscale_anchor(N)
        delta = 0.125
        z = unit([a + delta * b for a, b in zip(p, w)])
        certified_w = 1 / (24 * math.sqrt(37 * len(scale_grid(N))))
        certified_z = delta * certified_w / (1 + delta)
        samples = [0.0, math.inf]
        samples.extend(math.exp(-8 + 20 * j / 1000) for j in range(1001))
        depth = min(dot(unit(response_vector(N, a)), z) for a in samples)
        self.assertGreaterEqual(depth + 1e-12, certified_z)
        self.assertLessEqual(norm([a - b for a, b in zip(z, p)]),
                             2 * delta + 1e-12)

    def test_universal_surplus_ceiling_contains_logarithmic_loss(self):
        for N in (256, 4096, 65536):
            J = 0
            a = 1
            while a * 16 <= N:
                a *= 16
                J += 1
            ceiling = Fraction(36, N * N * (J + 1))
            self.assertGreater(ceiling, 0)
            self.assertLessEqual(ceiling, Fraction(36, N * N))


class RotatedSchurExactTests(unittest.TestCase):
    def setUp(self):
        F = Fraction
        self.B = [[F(2), F(0)], [F(0), F(3)]]
        self.b = [F(1, 2), F(1, 3)]
        self.chi = F(1, 5)
        Binv = inverse_fraction(self.B)
        a0 = bilinear(self.b, Binv, self.b) - self.chi
        self.T = [
            [a0, self.b[0], self.b[1]],
            [self.b[0], F(2), F(0)],
            [self.b[1], F(0), F(3)],
        ]

    def rotated_blocks(self, z, complement):
        C = complement
        az = bilinear(z, self.T, z)
        bz = mat_vec(transpose(C), mat_vec(self.T, z))
        Bz = mat_mul(mat_mul(transpose(C), self.T), C)
        return az, bz, Bz

    def test_rotated_inverse_metric_identities_are_exact(self):
        F = Fraction
        z = [F(3, 5), F(4, 5), F(0)]
        complement = [[F(-4, 5), F(0)],
                      [F(3, 5), F(0)],
                      [F(0), F(1)]]
        az, bz, Bz = self.rotated_blocks(z, complement)
        Bzinv = inverse_fraction(Bz)
        chi_direct = bilinear(bz, Bzinv, bz) - az

        Binv = inverse_fraction(self.B)
        a = z[0]
        v = z[1:]
        cz = a - bilinear(self.b, Binv, v)
        Dz = cz * cz - self.chi * bilinear(v, Binv, v)
        self.assertGreater(Dz, 0)
        self.assertEqual(chi_direct, self.chi / Dz)

        Tinv = inverse_fraction(self.T)
        y = mat_vec(Tinv, z)
        mz = sum(a0 * b0 for a0, b0 in zip(z, y))
        self.assertEqual(mz, -Dz / self.chi)
        self.assertEqual(chi_direct, -1 / mz)

        solve = mat_vec(Bzinv, bz)
        tau_sq_direct = sum(x * x for x in solve)
        py_sq = sum(x * x for x in y) - mz * mz
        self.assertEqual(tau_sq_direct, py_sq / (mz * mz))

        C = complement
        restricted_inverse = mat_mul(mat_mul(transpose(C), Tinv), C)
        py_coords = mat_vec(transpose(C), y)
        reconstructed = [[
            restricted_inverse[i][j] - py_coords[i] * py_coords[j] / mz
            for j in range(2)] for i in range(2)]
        self.assertEqual(reconstructed, Bzinv)

    def test_negative_D_rejects_rotated_complement(self):
        F = Fraction
        z = [F(5, 13), F(12, 13), F(0)]
        complement = [[F(-12, 13), F(0)],
                      [F(5, 13), F(0)],
                      [F(0), F(1)]]
        _, _, Bz = self.rotated_blocks(z, complement)
        Binv = inverse_fraction(self.B)
        cz = z[0] - bilinear(self.b, Binv, z[1:])
        Dz = cz * cz - self.chi * bilinear(z[1:], Binv, z[1:])
        self.assertLess(Dz, 0)
        det_Bz = Bz[0][0] * Bz[1][1] - Bz[0][1] * Bz[1][0]
        self.assertFalse(Bz[0][0] > 0 and det_Bz > 0)

    def test_vanishing_unweighted_rotation_can_destroy_complement_sign(self):
        F = Fraction
        for m in (5, 11, 23):
            t = F(1, m)
            a = (1 - t * t) / (1 + t * t)
            v = 2 * t / (1 + t * t)
            g = t ** 4
            # T=diag(-1,g): the original complement is positive, b=0,
            # chi=1, and the original shifted solve is exactly zero.
            Dz = a * a - v * v / g
            rotated_complement = -v * v + g * a * a
            self.assertLess(Dz, 0)
            self.assertLess(rotated_complement, 0)
            self.assertLess((1 - a) * (1 - a) + v * v,
                            F(5, m * m))


if __name__ == "__main__":
    unittest.main()
