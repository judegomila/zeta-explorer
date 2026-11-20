# tz.py: band forms of T_Z on the span of m consecutive Fourier modes of [0, U]; python-flint balls.
# All matrices returned are Q/U (real symmetric arb_mat), so the statistic is the Rayleigh quotient.
import math
import numpy as np
from flint import arb, acb, arb_mat, ctx

ctx.prec = 128
PI = arb.pi()
I = acb(0, 1)


def nodes(tw, U, m):
    """tau_j as arb; tw exact (float or int), U arb."""
    D = 2 * PI / U
    return [arb(tw) + (j - arb(m - 1) / 2) * D for j in range(m)], D


def loewner(m, D, U, F, F1, sign):
    """Matrix of sign * 2 Re A_mu / U from F(tau_j), F1(tau_j) (lists of acb)."""
    A = arb_mat(m, m)
    imF = [f.imag for f in F]
    for j in range(m):
        A[j, j] = sign * 2 * (U * F[j].real - F1[j].real) / U
        for k in range(j + 1, m):
            v = sign * 2 * (imF[k] - imF[j]) / ((k - j) * D) / U
            A[j, k] = v
            A[k, j] = v
    return A


def arch(tw, U, m, lams, const):
    """Arch/U for the multiplier const + sum_lam Re psi(lam + i x/2). lams: list of arb/float."""
    tau, D = nodes(tw, U, m)
    A = arb_mat(m, m)
    diag = [U * const for _ in range(m)]
    w = [arb(0) for _ in range(m)]
    for lam in lams:
        lam = arb(lam)
        for j in range(m):
            z = acb(lam, tau[j] / 2)
            psi = z.digamma()
            psi1 = acb(2).zeta(z)  # trigamma = Hurwitz zeta(2, z)
            # E = e^{-(2 lam + i tau) U} sum_k e^{-2kU}/(2k + 2 lam + i tau); E' = dE/dtau
            pref = (-(2 * lam + I * tau[j]) * U).exp()
            E = acb(0)
            E2 = acb(0)
            k = 0
            while True:
                den = acb(2 * k + 2 * lam, tau[j])
                fac = (arb(-2 * k) * U).exp()
                E += fac / den
                E2 += fac / (den * den)
                k += 1
                if (arb(-2 * k) * U).exp() < arb(2) ** (-140):
                    break
            E = pref * E
            Ep = -I * U * E - I * pref * E2
            K1 = psi1 / 4 - I * Ep
            diag[j] = diag[j] + U * psi.real + 2 * U * E.real + 2 * K1.real
            w[j] = w[j] + psi.imag + 2 * E.imag
    for j in range(m):
        A[j, j] = diag[j] / U
        for k in range(j + 1, m):
            v = (w[k] - w[j]) / ((k - j) * D) / U
            A[j, k] = v
            A[k, j] = v
    return A


def rank_terms(tw, U, m, points, sign=1):
    """sum over complex points z of sign * N(z)/((tau_j - z)(tau_k - z)) / U, real part.
    points: list of (acb z, weight). The caller supplies conjugate-closed sets."""
    tau, D = nodes(tw, U, m)
    A = arb_mat(m, m)
    w0 = (I * tau[0] * U).exp()
    for (z, wt) in points:
        z = acb(z)
        N = 2 - w0 * (-I * z * U).exp() - w0.conjugate() * (I * z * U).exp() if z.imag == 0 else \
            2 - w0 * (-I * z * U).exp() - (1 / w0) * (I * z * U).exp()
        inv = [1 / (acb(tau[j]) - z) for j in range(m)]
        for j in range(m):
            for k in range(j, m):
                v = (N * inv[j] * inv[k]).real * wt * sign / U
                A[j, k] = A[j, k] + v
                if k != j:
                    A[k, j] = A[k, j] + v
    return A


def to_np(A):
    m = A.nrows()
    return np.array([[float(A[i, j].mid()) for j in range(m)] for i in range(m)])


def maxrad(A):
    m = A.nrows()
    return max(float(A[i, j].rad()) for i in range(m) for j in range(m))


def ldl_psd(A):
    """True if every pivot of LDL^T of the ball matrix A is certified positive."""
    m = A.nrows()
    L = [[arb(0)] * m for _ in range(m)]
    d = [arb(0)] * m
    for j in range(m):
        s = A[j, j]
        for k in range(j):
            s = s - L[j][k] * L[j][k] * d[k]
        if not (s > 0):
            return False
        d[j] = s
        for i in range(j + 1, m):
            t = A[i, j]
            for k in range(j):
                t = t - L[i][k] * L[j][k] * d[k]
            L[i][j] = t / s
    return True


def quad_form(A, v):
    m = A.nrows()
    vv = [arb(float(x)) for x in v]
    s = arb(0)
    for i in range(m):
        r = arb(0)
        for j in range(m):
            r += A[i, j] * vv[j]
        s += vv[i] * r
    n2 = sum((x * x for x in vv), arb(0))
    return s / n2


def certify(A, M_list=(0, 1), encl=False):
    """Float spectrum of mid(A). Signs of lambda_min(A) + 2M decided rigorously:
    pos: LDL of the exact midpoint matrix shifted by 2M - d, d >= m * (largest entry radius) >= norm of the radius part;
    neg: the ball value of v^T (A + 2M) v / v^T v for the float eigenvector v is negative.
    encl: lambda_min(A) in [lam - tol, lam + tol] by the same two tests."""
    m = A.nrows()
    An = to_np(A)
    ev, evec = np.linalg.eigh(An)
    lam = float(ev[0])
    v = evec[:, 0]
    rad = maxrad(A)
    d = m * rad * 1.01 + 1e-25
    out = {"lam_min": lam, "lam_max": float(ev[-1]), "rad": rad, "d": d, "signs": {}}
    qf = quad_form(A, v)

    def mid_shift(c):
        B = arb_mat(m, m)
        for i in range(m):
            for j in range(m):
                B[i, j] = A[i, j].mid() + (c if i == j else 0)
        return B
    for M in M_list:
        if lam + 2 * M < 0:
            out["signs"][str(M)] = "neg" if (qf + 2 * M) < 0 else "undecided"
        else:
            out["signs"][str(M)] = "pos" if ldl_psd(mid_shift(arb(2 * M) - arb(d))) else "undecided"
    if encl:
        tol = max(3 * d, 1e-10 * (abs(float(ev[-1])) + 1))
        lo = ldl_psd(mid_shift(-(arb(lam) - arb(tol) + arb(d))))
        hi = (qf - (lam + tol)) < 0
        out["enclosed"] = bool(lo and hi)
        out["encl_tol"] = tol
    return out


def add(*mats):
    m = mats[0].nrows()
    A = arb_mat(m, m)
    for B in mats:
        A = A + B
    return A


# ---- evaluation of D, D1 from engine moments (float) ----
class Moments:
    def __init__(self, path):
        with open(path, "rb") as f:
            hdr = np.fromfile(f, dtype=np.int64, count=8)
            self.NOBJ, self.NC, self.NW, self.Q, self.NB, self.XSTART, self.XMAX, self.XCHAIN = [int(x) for x in hdr]
            self.C0 = int(np.fromfile(f, dtype=np.int64, count=1)[0])
            self.T0, self.S = [float(x) for x in np.fromfile(f, dtype=np.float64, count=2)]
            self.XB = [int(x) for x in np.fromfile(f, dtype=np.int64, count=16)][: self.NB]
            self.CB = [int(x) for x in np.fromfile(f, dtype=np.int64, count=16)][: self.NB]
            self.SABS = np.fromfile(f, dtype=np.float64, count=self.NOBJ)
            off = f.tell()
        VL = self.NW * self.Q * 2
        nbe = max(self.NB, 1)
        self.EX = np.memmap(path, dtype=np.float64, mode="r", offset=off, shape=(nbe, self.NOBJ, self.NW, self.Q, 2))
        off2 = off + nbe * self.NOBJ * VL * 8
        self.G = np.memmap(path, dtype=np.float64, mode="r", offset=off2, shape=(self.NOBJ, self.NC, self.NW, self.Q, 2))
        self.delta = 1.0 / 512.0

    def add_cells(self, Mc, obj, w, cb):
        """add this file's full cells with index < cb into Mc (rows = absolute cell index)."""
        hi = min(cb, self.C0 + self.NC)
        if hi > self.C0:
            g = self.G[obj, : hi - self.C0, w]
            Mc[self.C0:hi] += g[..., 0] + 1j * g[..., 1]

    @staticmethod
    def eval(Mc, ac, y):
        """D(t_w + y), D1(t_w + y) for complex array y (shape (k,)) from cell moments."""
        y = np.asarray(y, dtype=np.complex128)
        Qn = Mc.shape[1]
        coef = np.empty((len(y), Qn), dtype=np.complex128)
        coef[:, 0] = 1.0
        for q in range(1, Qn):
            coef[:, q] = coef[:, q - 1] * (-1j * y) / q
        ph = np.exp(-1j * np.outer(y, ac))          # (k, ncell)
        P0 = Mc @ coef.T                              # (ncell, k): sum_q coef[j,q] M[c,q]
        D = np.einsum("kc,ck->k", ph, P0)
        M1 = Mc[:, 1:] @ coef[:, : Qn - 1].T          # sum_q coef[j,q] M[c,q+1]
        D1 = np.einsum("kc,ck->k", ph, P0 * ac[:, None] + M1)
        return D, D1
