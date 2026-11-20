# Assemble Form D and Form C (definitions of PREREG.md of the lane, re-derived by the referee) from the independent
# moments; float64 eigenvalues at several mode counts.  usage: python ref2_tz_asm.py T0 OUT file1 file2 ...
import sys, math, json
import numpy as np
import mpmath as mp
mp.mp.dps = 50
LD = np.longdouble
T0 = float(sys.argv[1]); OUT = sys.argv[2]; files = sys.argv[3:]
Z = [np.load(f) for f in files]
MOM = sum(z["MOM"] for z in Z); XS = Z[0]["XS"]; WINS = [int(w) for w in Z[0]["WINS"]]
NTERM = sum(z["NTERM"] for z in Z)
THETAS = [0.55, 0.65, 0.75, 0.85]
NQ = MOM.shape[3]; NCELL = MOM.shape[2]
ac = (np.arange(NCELL) + 0.5) / 512.0
MODES = [48, 96, 192]
PI2 = LD(8) * np.arctan(LD(1))

def evalD(Mc, y):
    """D(t_w + y) = sum c n^-1/2 e^{-i (t_w + y) log n} and D1 (extra factor log n)."""
    y = np.asarray(y, dtype=np.complex128)
    Q = NQ - 1
    coef = np.empty((len(y), Q), dtype=np.complex128); coef[:, 0] = 1
    for q in range(1, Q): coef[:, q] = coef[:, q - 1] * (-1j * y) / q
    ph = np.exp(-1j * np.outer(y, ac))
    P0 = Mc[:, :Q] @ coef.T
    P1 = Mc[:, 1:Q + 1] @ coef.T
    D = np.einsum("kc,ck->k", ph, P0)
    D1 = np.einsum("kc,ck->k", ph, P0 * ac[:, None] + P1)
    return D, D1

def loewner(F, F1, U, Delta):
    m = len(F)
    A = np.zeros((m, m))
    imF = F.imag
    j = np.arange(m)
    dj = (j[None, :] - j[:, None]).astype(float)
    with np.errstate(divide="ignore", invalid="ignore"):
        A = 2 * (imF[None, :] - imF[:, None]) / (dj * Delta) / U
    A[j, j] = 2 * (U * F.real - F1.real) / U
    return A

def arch(tw, U, m):
    """(1/U) x compression of the multiplier -log pi + Re psi(1/4 + i x/2) to the m modes (tails a > U dropped: size e^{-U/2}/t)."""
    Delta = 2 * mp.pi / U
    tau = [mp.mpf(tw) + (j - mp.mpf(m - 1) / 2) * Delta for j in range(m)]
    psi = [mp.digamma(mp.mpc(0.25, t / 2)) for t in tau]
    psi1 = [mp.zeta(2, mp.mpc(0.25, t / 2)) for t in tau]
    A = np.zeros((m, m))
    for j in range(m):
        A[j, j] = float(-mp.log(mp.pi) + psi[j].real + psi1[j].real / (2 * U))
        for k in range(j + 1, m):
            v = float((psi[k].imag - psi[j].imag) / ((tau[k] - tau[j]) * U))
            A[j, k] = v; A[k, j] = v
    return A

def sieve_lambda(N):
    lam = np.zeros(N + 1)
    s = np.ones(N + 1, dtype=bool)
    for p in range(2, N + 1):
        if s[p]:
            s[2 * p::p] = False
            pk = p
            while pk <= N:
                lam[pk] = math.log(p); pk *= p
    return lam

rows = []
for wi, w in enumerate(WINS):
    tw = int(T0) + 128 * w
    Lg = float(mp.log(mp.mpf(tw) / (2 * mp.pi)))
    th2 = float(mp.fmod(2 * mp.siegeltheta(mp.mpf(tw)), 2 * mp.pi))
    for si, th in enumerate(THETAS):
        Mc = MOM[:si + 1, wi].sum(axis=0)
        u = th * math.log(T0)
        for m in MODES:
            # Form D: U = u
            Delta = 2 * math.pi / u
            y = (np.arange(m) - (m - 1) / 2) * Delta
            d0, d1 = evalD(Mc, y)
            QD = arch(tw, mp.mpf(u), m) - loewner(d0, d1, u, Delta)
            evD = np.linalg.eigvalsh(QD)
            row = dict(T0=T0, w=w, tw=tw, theta=th, Lg=Lg, u=u, m=m, X=int(XS[si]), nterms=int(NTERM[:si + 1].sum()),
                       D_lam_min=float(evD[0]), D_s=float(evD[0] / Lg), D_lam_max=float(evD[-1]))
            if u < Lg:
                U = Lg
                Delta = 2 * math.pi / U
                y = (np.arange(m) - (m - 1) / 2) * Delta
                d0, d1 = evalD(Mc, y)
                A_arch = arch(tw, mp.mpf(tw) / (2 * mp.pi), m) if False else arch(tw, mp.log(mp.mpf(tw) / (2 * mp.pi)), m)
                A_pr = loewner(d0, d1, U, Delta)
                nmax = int(math.floor(math.exp(Lg - u)))
                lam = sieve_lambda(max(nmax, 2))
                ns = np.array([n for n in range(2, nmax + 1) if lam[n] > 0], dtype=np.int64)
                if len(ns):
                    Ln = np.log(ns.astype(LD))
                    bp = LD(tw) * Ln; bp = (bp - PI2 * np.rint(bp / PI2)).astype(float)
                    logn = Ln.astype(float)
                    an = Lg - logn
                    rho = lam[ns] / np.sqrt(ns) * an / logn
                    # F(tau_j) = e^{-2 i vartheta(t_w)} sum rho_n e^{+i t_w log n} e^{-i y_j a_n}
                    ph = np.exp(1j * (bp[None, :] - np.outer(y, an)))
                    F = np.exp(-1j * th2) * (ph @ rho)
                    F1 = np.exp(-1j * th2) * (ph @ (rho * an))
                    A_ref = loewner(F, F1, U, Delta)
                else:
                    A_ref = np.zeros((m, m))
                ev0 = np.linalg.eigvalsh(A_arch - A_pr)
                evC = np.linalg.eigvalsh(A_arch - A_pr - A_ref)
                evR = np.linalg.eigvalsh(A_ref)
                row.update(C_lam_min=float(evC[0]), C_s=float(evC[0] / Lg), C_noref_lam_min=float(ev0[0]),
                           n_reflected=int(len(ns)), norm_reflected=float(max(abs(evR[0]), abs(evR[-1])) / Lg))
            rows.append(row)
            print(json.dumps(row), flush=True)
json.dump(rows, open(OUT, "w"), indent=0)
