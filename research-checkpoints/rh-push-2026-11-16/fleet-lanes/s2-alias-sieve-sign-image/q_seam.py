"""q_seam.py -- combination (2): compression constant Q at seam points of the 25-prime-node model, for zeta and controls.
Also the five-shell identity on the ladder vector (combination (4), coefficient reading).
usage: q_seam.py out.json [Nmax]"""
import sys, os, math, json, ctypes, time
import numpy as np
import mpmath as mp
HERE = os.path.dirname(os.path.abspath(__file__))
lib = ctypes.CDLL(os.path.join(HERE, "libseam.so"))
dp = ctypes.POINTER(ctypes.c_double)
lib.seam_phases.argtypes = [ctypes.c_int64, ctypes.c_double, ctypes.c_double, dp]
lib.mult_fill.argtypes = [ctypes.c_int64, ctypes.c_int, ctypes.c_uint64, ctypes.c_double, dp, dp]
lib.mult_fill.restype = ctypes.c_int
PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
CUTS = [0, 5, 10, 17, 25]
T0H = 24727519 / 200000000; SIGMA_B = 0.59045; Q_ALLOW = 1.4326672
NLO, NHI = 690988, 54799999

def basis():
    mp.mp.dps = 60
    u = [mp.log(p) / mp.log(97) for p in PR]
    cols = []
    for i in range(18):
        v = [mp.chebyt(i, 2 * x - 1) for x in u]
        for c in cols:
            d = sum(a * b for a, b in zip(v, c)); v = [a - d * b for a, b in zip(v, c)]
        for c in cols:   # second pass
            d = sum(a * b for a, b in zip(v, c)); v = [a - d * b for a, b in zip(v, c)]
        nrm = mp.sqrt(sum(a * a for a in v)); cols.append([a / nrm for a in v])
    Phi = np.array([[float(cols[i][j]) for i in range(18)] for j in range(25)])   # [node, mode]
    K = [sum(cols[i][j] ** 2 for i in range(18)) for j in range(25)]
    return Phi, [float(1 - k) for k in K]

_CACHE = {}

def prep_tables(M):
    """multiplicative tables, stored compactly (int8 signs, complex64 phases, float64 EA)"""
    re = np.zeros(M + 1); im = np.zeros(M + 1)
    for name, kind, seed, a, in [("LIOU", 0, 0, 0.0), ("SGN", 0, 1, 0.0), ("UNI", 1, 1, 0.0), ("EA", 2, 0, 0.25)]:
        assert lib.mult_fill(M, kind, seed, a, re.ctypes.data_as(dp), im.ctypes.data_as(dp)) == 0
        _CACHE[name] = re.astype(np.int8) if kind == 0 else ((re + 1j * im).astype(np.complex64) if kind == 1 else re.copy())
    del re, im

def coef_chunk(name, a, b):
    """Dirichlet coefficients a_F(n), a <= n < b (None for zeta)"""
    if name == "ZETA": return None
    if name in _CACHE: return _CACHE[name][a:b]
    n = np.arange(a, b)
    if name == "CHI101":
        sq = np.full(101, -1.0); sq[0] = 0
        for i in range(1, 101): sq[(i * i) % 101] = 1
        return sq[n % 101]
    if name == "CHI5": return np.array([0, 1, 1j, -1j, -1])[n % 5]
    if name == "DH":
        kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
        return np.array([0, 1, kap, -kap, -1])[n % 5]
    q = int(name[3:]); c = 2.2
    return 1.0 + c * math.sqrt(q) * (n % q == 0) + q * (n % (q * q) == 0)

NAMES = ["ZETA", "CHI101", "CHI5", "DH", "LIOU", "SGN", "UNI", "EA", "TNR2", "TNR3", "TNR97"]

def run(Nmax, outfn):
    Phi, oneMinusK = basis()
    res = {"basis": {"one_minus_K": dict(zip(map(str, PR), oneMinusK)), "qCS": math.sqrt(max(1 - x for x in oneMinusK)),
                     "recorded_one_minus_K": {"2": 1.7e-18, "3": 1.5e-15, "5": 3.9e-12}},
           "phase_bits": int(lib.seam_precision_bits()), "points": []}
    Ns = [int(round(math.exp(math.log(NLO) + i * (math.log(NHI) - math.log(NLO)) / 6))) for i in range(7)]
    Ns[0] = NLO; Ns[-1] = NHI
    Ns = [N for N in Ns if N + 1 <= Nmax] or [Nmax - 1]
    if Nmax < NLO: Ns = sorted(set([Nmax // 8, Nmax // 3, Nmax - 1]))
    M = max(Ns) + 1
    print("planned allocations: phases %.2f GB, index tables %.2f GB, cached coefficient tables %.2f GB, transient fill %.2f GB, chunks 0.3 GB"
          % (8 * (M + 1) / 1e9, 2 * (M + 1) / 1e9, 18 * (M + 1) / 1e9, 21 * (M + 1) / 1e9), flush=True)
    lpmax = np.full(M + 1, 25, dtype=np.int8); lpmin = np.full(M + 1, 25, dtype=np.int8)
    for j in range(24, -1, -1): lpmin[::PR[j]] = j
    for j in range(25): lpmax[::PR[j]] = j
    blk = np.array([0] * 5 + [1] * 5 + [2] * 7 + [3] * 8 + [4], dtype=np.int8)[lpmin]     # 4 = live shell
    del lpmin
    prep_tables(M)
    ph = np.zeros(M + 1)
    ens = {}
    names = NAMES + ["HEATm0.5"]
    CH = 1 << 22
    for N in Ns:
        for (w, extra) in [(0, 0), (1, 0), (1, 1)]:
            vint = float(N) * float(N) + w * (2 * N + 1); vfrac = -T0H / 16
            mt = N + extra
            lib.seam_phases(mt, vint, vfrac, ph.ctypes.data_as(dp))
            pt = {"N": N, "w": w, "terms": mt, "T": 2 * math.pi * (vint + vfrac), "variants": {}}
            acc = {name: [np.zeros(26, dtype=complex), np.zeros(5, dtype=complex)] for name in names}
            for a in range(1, mt + 1, CH):
                b = min(mt + 1, a + CH)
                Lg = np.log(np.arange(a, b, dtype=np.float64))
                base = np.exp(-SIGMA_B * Lg - 2j * np.pi * ph[a:b])
                hb = base * np.exp((T0H / 4) * Lg ** 2)
                hm = base * np.exp((-0.5 / 4) * Lg ** 2)
                i1 = lpmax[a:b]; i2 = blk[a:b]
                for name in names:
                    if name == "HEATm0.5": c = hm
                    elif name == "ZETA": c = hb
                    else: c = hb * coef_chunk(name, a, b)
                    acc[name][0] += np.bincount(i1, weights=c.real, minlength=26) + 1j * np.bincount(i1, weights=c.imag, minlength=26)
                    acc[name][1] += np.bincount(i2, weights=c.real, minlength=5) + 1j * np.bincount(i2, weights=c.imag, minlength=5)
            for name in names:
                Dall, Zall = acc[name]
                D = Dall[:25]; Y4 = Dall[25]; Z = Zall[:4]; Y4b = Zall[4]
                v0 = Dall.sum()
                E97 = Y4 - D.sum()
                cm = Phi.T @ D
                q = float(np.abs(Phi @ cm).max() / np.linalg.norm(cm))
                jq = int(np.abs(Phi @ cm).argmax())
                A = Phi.T @ (D.real[:, None] * Phi)
                ev = np.linalg.eigvalsh(A)
                tol = 1e-12 * np.abs(ev).max()
                pt["variants"][name] = {"qPure": q, "node": PR[jq], "inertia": [int((ev < -tol).sum()), int((np.abs(ev) <= tol).sum()), int((ev > tol).sum())],
                                        "E97": [E97.real, E97.imag], "absE97": abs(E97), "Y4": [Y4.real, Y4.imag], "v0": [v0.real, v0.imag],
                                        "five_shell_err": abs(Y4b + Z.sum() - v0) + abs(Y4b - Y4),
                                        "E97_identity_err": abs(E97 - (2 * Y4 - v0)), "normD": float(np.linalg.norm(D)),
                                        "absZ": [abs(z) for z in Z]}
                ens.setdefault(name, []).append(cm)
            res["points"].append(pt)
            print(N, w, extra, {k: round(v["qPure"], 5) for k, v in pt["variants"].items()}, flush=True)
    res["ensemble"] = {}
    Kmax = max(1 - x for x in oneMinusK)
    for name, cs in ens.items():
        C = np.array(cs); rho = (C.T @ C.conj()) / (np.abs(C) ** 2).sum()
        lam = float(np.linalg.eigvalsh(rho).max())
        res["ensemble"][name] = {"lambda_max": lam, "qVN": math.sqrt(lam * Kmax), "qPure_sup": max(p["variants"][name]["qPure"] for p in res["points"]),
                                 "qPure_min": min(p["variants"][name]["qPure"] for p in res["points"])}
    res["threshold"] = Q_ALLOW
    json.dump(res, open(outfn, "w"), indent=1)
    print(json.dumps(res["ensemble"], indent=1)); print(res["basis"])

if __name__ == "__main__":
    run(int(float(sys.argv[2])) if len(sys.argv) > 2 else NHI + 2, sys.argv[1])
