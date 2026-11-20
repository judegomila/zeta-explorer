# check_ident.py: float checks of the three identities used by dev.py and cth.py (zero/pole side by truncated lattice sums
# against the finite prime-side atoms). Local, numpy + tz (arb) for the atom side.
import json, math, numpy as np
from flint import arb, acb, arb_mat, ctx
import tz, hq2
ctx.prec = 128
out = []
def rank_np(tau, U, pts):
    w0 = np.exp(1j * tau[0] * U); m = len(tau); A = np.zeros((m, m), dtype=complex)
    for z, wt in pts:
        N = 2 - w0 * np.exp(-1j * z * U) - (1 / w0) * np.exp(1j * z * U)
        inv = 1 / (tau - z)
        A += wt * N * np.outer(inv, inv)
    return A.real / U
def atoms_mat(tw, U, m, v, masses, sign):
    tau, D = tz.nodes(tw, arb(U), m)
    F = []; F1 = []
    for j in range(m):
        f = acb(0); f1 = acb(0)
        for k, mu in enumerate(masses, start=1):
            if k * v >= U: break
            e = (acb(0, -1) * tau[j] * (k * v)).exp()
            f += mu * e; f1 += mu * (k * v) * e
        F.append(f); F1.append(f1)
    return tz.to_np(tz.loewner(m, D, arb(U), F, F1, sign))
for (tw, U, m, q, eps) in [(1000.3, 7.0, 12, 2, 0.01), (5000.0, 9.5, 10, 2, 1e-4), (777.7, 6.0, 8, 3, 0.01), (1000.3, 11.0, 12, 2, 0.01)]:
    v = math.log(q); K = 200000
    tau = tw + (np.arange(m) - (m - 1) / 2) * 2 * math.pi / U
    S = [float(x.mid()) for x in hq2.power_sums(eps, int(U / v) + 2)]
    w = complex(hq2.w_root(eps).real.mid(), hq2.w_root(eps).imag.mid())
    zetas = [w / v, -w / v, w.conjugate() / v, -w.conjugate() / v]     # s = 1/2 + zeta + i p_k  <->  z = p_k - i zeta
    # centre the k-range on the window
    k0 = int(round(tw * v / (2 * math.pi)))
    P = np.zeros((m, m)); Qd = np.zeros((m, m))
    CH = 2000
    for a in range(-K, K + 1, CH):
        ks = np.arange(a, min(a + CH, K + 1)) + k0
        for sgn in (1,):
            pk = sgn * 2 * math.pi * ks / v
            w0 = np.exp(1j * tau[0] * U)
            for (zz, wt, tgt) in [(pk + 0j, 4.0, 'P')] + [(pk - 1j * z, 1.0, 'Q') for z in zetas]:
                N = 2 - w0 * np.exp(-1j * zz * U) - (1 / w0) * np.exp(1j * zz * U)
                inv = 1 / (tau[None, :] - zz[:, None])
                M = ((N[:, None] * inv).T @ inv).real / U * wt
                if tgt == 'P': P += M
                else: Qd += M
    Id = np.eye(m)
    P_atoms = 4 * v * Id + atoms_mat(tw, U, m, v, [4 * v] * 64, +1)
    Q_atoms = 4 * v * Id + atoms_mat(tw, U, m, v, [v * S[k] for k in range(1, len(S))], +1)
    asw_atoms = atoms_mat(tw, U, m, v, [v * (4 - S[k]) for k in range(1, len(S))], -1)
    r = dict(tw=tw, U=U, m=m, q=q, eps=eps, K=K,
             pole_lattice_maxdiff=float(np.max(np.abs(P - P_atoms))), pole_lattice_maxentry=float(np.max(np.abs(P))),
             zeros_maxdiff=float(np.max(np.abs(Qd - Q_atoms))), zeros_maxentry=float(np.max(np.abs(Qd))),
             asw_maxdiff=float(np.max(np.abs((Qd - P) - asw_atoms))), asw_maxentry=float(np.max(np.abs(asw_atoms))),
             eig_pole_lattice=[float(x) for x in np.linalg.eigvalsh(P_atoms)[[0, -1]]],
             eig_zeros_only=[float(x) for x in np.linalg.eigvalsh(Q_atoms)[[0, -1]]],
             eig_asw=[float(x) for x in np.linalg.eigvalsh(asw_atoms)[[0, -1]]])
    # C(theta) analog at 5 points
    u = U
    def Ku(wc): return 1 / wc - (1 - np.exp(-u * wc)) / (u * wc * wc)
    dmax = 0; dmaxq = 0
    for t in tw + np.array([0.0, 0.37, 1.9, 4.4, 2 * math.pi * 3 / v - (tw % (2 * math.pi / v))]):
        ks = np.arange(-K, K + 1) + k0
        pk = 2 * math.pi * ks / v
        y = t - pk
        small = np.abs(y) < 1e-6
        ys = np.where(small, 1.0, y)
        lhsP = 4 * np.sum(np.where(small, u / 2, (1 - np.cos(u * ys)) / (u * ys * ys)))
        kk = np.arange(1, int(u / v - 1e-12) + 1)
        rhsP = 2 * v * (1 + 2 * np.sum((1 - kk * v / u) * np.cos(kk * v * t)))
        lhsQ = sum(np.sum(Ku(1j * y - z).real) for z in zetas)
        Sk = np.array([S[k] for k in kk])
        rhsQ = 2 * v + v * np.sum(Sk * (1 - kk * v / u) * np.cos(kk * v * t))
        dmax = max(dmax, abs(lhsP - rhsP)); dmaxq = max(dmaxq, abs(lhsQ - rhsQ))
    r.update(ctheta_pole_maxdiff=float(dmax), ctheta_zeros_maxdiff=float(dmaxq))
    print(json.dumps(r)); out.append(r)
json.dump(out, open("check_ident.json", "w"), indent=1)
