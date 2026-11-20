"""Exact finite regression checks; not proofs of continuum claims or RH."""
from fractions import Fraction as F
import unittest


class ExactIdentities(unittest.TestCase):
    def test_ground_state_identity(self):
        weights = [F(1), F(3, 2), F(2)]
        g = [F(-2), F(1, 3), F(4)]
        diagonal = [F(4), F(-1), F(7)]
        edges = [(0, 1, F(2, 3)), (1, 2, F(7, 5)), (0, 2, F(1, 4))]
        f = [w * x for w, x in zip(weights, g)]
        form = sum(d * x*x for d, x in zip(diagonal, f))
        row = [d * w for d, w in zip(diagonal, weights)]
        energy = F(0)
        for i, j, k in edges:
            form -= 2*k*f[i]*f[j]
            row[i] -= k*weights[j]
            row[j] -= k*weights[i]
            energy += k*weights[i]*weights[j]*(g[i]-g[j])**2
        defect = sum((row[i]/weights[i])*f[i]**2 for i in range(3))
        self.assertEqual(form, energy + defect)

    def test_pole_variance_sign(self):
        # r=e^(x/2), paired reciprocally so the quadrature is symmetric.
        r = [F(1, 2), F(1), F(2)]
        c = [(x + 1/x)/2 for x in r]
        s = [(x - 1/x)/2 for x in r]
        q = [F(1, 3), F(2, 3), F(1, 3)]
        g = [F(2), F(-3, 2), F(1, 5)]
        A = sum(qi*ci*ci for qi, ci in zip(q, c))
        nu = [q[i]*c[i]**2/A for i in range(3)]
        mean = sum(nu[i]*g[i] for i in range(3))
        variance = sum(nu[i]*g[i]**2 for i in range(3)) - mean**2
        tau_g = sum(nu[i]*(s[i]/c[i])*g[i] for i in range(3))
        self.assertEqual(sum(nu[i]*s[i]/c[i] for i in range(3)), 0)
        pole = 2*sum(q[i]*c[i]**2*g[i] for i in range(3))**2
        pole -= 2*sum(q[i]*s[i]*c[i]*g[i] for i in range(3))**2
        row = 2*A*sum(q[i]*c[i]**2*g[i]**2 for i in range(3))
        difference = sum(q[i]*q[j]*(c[i]*c[j]-s[i]*s[j])*c[i]*c[j]
                         *(g[i]-g[j])**2 for i in range(3) for j in range(3))
        self.assertEqual(difference, 2*A*A*(variance + tau_g*tau_g))
        self.assertEqual(pole, row - difference)
        self.assertGreater(difference, 0)
        self.assertNotEqual(pole, row + difference)  # wrong-sign negative control

    def test_ou_stationarity_and_short_time_bound(self):
        for sigma in [F(1, 10), F(1, 4), F(1, 2), F(3, 4), F(9, 10)]:
            for k in [F(0), F(3, 10), F(7)]:
                d = [sigma, 1-sigma]
                a = [[-d[0], k], [-k, -d[1]]]
                for i in range(2):
                    for j in range(2):
                        self.assertEqual(a[i][j] + a[j][i] + (2*d[i] if i == j else 0), 0)
                slow = 0 if d[0] <= d[1] else 1
                entropy_log_derivative = 2*a[slow][slow]
                self.assertEqual(entropy_log_derivative, -2*min(d))
                self.assertLessEqual(2*min(d), 1)
                self.assertEqual(2*min(d) == 1, sigma == F(1, 2))


if __name__ == '__main__':
    unittest.main()
