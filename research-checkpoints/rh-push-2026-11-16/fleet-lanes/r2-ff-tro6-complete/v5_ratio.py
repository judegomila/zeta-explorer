"""Direct (brute-force) normalised block ratios |B| / (||c_k|| ||R_N||) in the long-dual range r >= d (no formula),
to locate where a saving q^(-eta r/12) is impossible.  d = 0: one row, ratio = 1 whenever both factors are nonzero."""
import sys, numpy as np
from ff import FF
q = int(sys.argv[1]); F = FF(q); one = np.array([[1]])
def nu_val(nu, P):
    return np.ones(P.shape[0], dtype=complex) if nu is None else F.chi_at(nu[0][:-1], P, nu[1])
ck = {}; RN = {}
def c_tab(k, d):
    if (k, d) not in ck:
        M = F.monic(d); v = np.zeros(q ** d, dtype=complex)
        for c in F.monic(k): v += F.gauss(c[:-1], M)
        ck[(k, d)] = v
    return ck[(k, d)]
_X = {}
def X_tab(N, ds):
    """one pass over squarefree A of degree N: g_3(1,A), and chi_A(m) for all monic m of each degree in ds."""
    if N not in _X:
        As = F.monic(N); Ms = [F.monic(d) for d in ds]; L = max(ds) + 1
        Mall = np.concatenate([np.pad(M, ((0, 0), (0, L - M.shape[1]))) for M in Ms])
        keep = [i for i, A in enumerate(As) if F.sqfree(tuple(int(x) for x in A))]
        g3 = np.array([F.gauss(As[i][:-1], one, 2)[0] for i in keep])
        X = np.stack([F.chi_at(As[i][:-1], Mall) for i in keep])
        off = np.cumsum([0] + [M.shape[0] for M in Ms])
        _X[N] = (As[keep], g3, {d: X[:, off[j]:off[j + 1]] for j, d in enumerate(ds)})
    return _X[N]
def R_tab(N, d, nu, name):
    if (N, d, name) not in RN:
        As, g3, X = X_tab(N, DS)
        RN[(N, d, name)] = (g3 * nu_val(nu, As)) @ X[d]
    return RN[(N, d, name)]
nus = eval(sys.argv[2]); kmax, Nmax = int(sys.argv[3]), int(sys.argv[4])
DS = eval(sys.argv[5])
for d in DS:
    for name, nu in nus:
        for k in range(1, kmax + 1):
            row = []
            for N in range(1, Nmax + 1):
                c = c_tab(k, d); R = R_tab(N, d, nu, name); cs = np.linalg.norm(c) * np.linalg.norm(R)
                zero = np.linalg.norm(c) < 1e-7 * q ** (d / 2 + k) or np.linalg.norm(R) < 1e-7 * q ** (d / 2 + N)
                row.append(f"N={N}(r={k+N-1-d}):" + ("  0/0 " if zero else f"{abs((c*R).sum())/cs:.3f}"))
            print(f"q={q} d={d} null={q**(-d/2):.3f} nu={name:9s} k={k}: " + "  ".join(row), flush=True)
