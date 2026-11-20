# T1: checks of the rigidity lemma (Lemma R) and of the normalisation junction.
import numpy as np, mpmath as mp, json, cmath, math
rng = np.random.default_rng(7)
J = np.diag([1.0, -1.0]).astype(complex); N = np.array([[-1, -1], [1, 1]], dtype=complex); E = np.ones((2, 2), dtype=complex)
def M(Z): return np.eye(2, dtype=complex) + (Z/2)*N
def Junit():
    # random J-unitary: e^{ia} * [[ch, sh e^{ib}],[sh e^{-ib}, ch]] * diag(e^{ic},1)
    a, b, c = rng.uniform(0, 2*np.pi, 3); r = rng.uniform(0, 1.5)
    U = np.array([[np.cosh(r), np.sinh(r)*np.exp(1j*b)], [np.sinh(r)*np.exp(-1j*b), np.cosh(r)]])
    return np.exp(1j*a)*U@np.diag([np.exp(1j*c), 1])
def T(Th, e): return (Th[0, 0]*e + Th[0, 1])/(Th[1, 0]*e + Th[1, 1])
def PG(Th):  # Potapov-Ginzburg: (y1,x2) -> (x1,y2), x = Th y
    a, b, c, d = Th[0, 0], Th[0, 1], Th[1, 0], Th[1, 1]
    return np.array([[a - b*c/d, b/d], [-c/d, 1/d]])
out = {}
# (a) algebra: Theta = M(H) V0, random H with Re H>0, V0 J-unitary. Kernel vector y, fixed relations, defect rank.
mx = 0
for _ in range(2000):
    V0 = Junit(); H = rng.uniform(0.01, 3) + 1j*rng.normal(); Th = M(H)@V0
    y = np.linalg.solve(V0, np.array([1, -1], dtype=complex))
    D = J - Th.conj().T@J@Th
    ev = np.linalg.eigvalsh((D + D.conj().T)/2)
    mx = max(mx, abs(ev[0]), np.linalg.norm(D@y), np.linalg.norm(Th@y - np.array([1, -1])),
             np.linalg.norm(np.array([1, 1])@Th - np.array([1, 1])@V0))
    S = PG(Th); sv = np.linalg.svd(S, compute_uv=False); mx = max(mx, abs(sv[0] - 1))
out['a_max_residual_M(H)V0_identities'] = mx
# (b) converse sampled: J-contractive matrices Th0 = V1 diag(s1,1/s2-type) ... generic strict contraction in PG picture;
#     test: -1 in T_{Th0}(closed disc)  <=>  defect has kernel vector y with Th0 y || (-1,1).
def randJcontr():
    # PG^{-1} of a random contraction Sigma with Sigma22 != 0
    A = rng.normal(size=(2, 2)) + 1j*rng.normal(size=(2, 2)); u, s, vh = np.linalg.svd(A)
    s = rng.uniform(0.2, 1.0, 2); Sg = u@np.diag(s)@vh
    d = 1/Sg[1, 1]; c = -Sg[1, 0]*d; b = Sg[0, 1]*d; a = Sg[0, 0] + b*c/d
    return np.array([[a, b], [c, d]])
th = np.exp(1j*np.linspace(0, 2*np.pi, 20001))
mind = 1e9; cnt = 0
for _ in range(3000):
    Th0 = randJcontr(); D = J - Th0.conj().T@J@Th0
    ev = np.linalg.eigvalsh((D + D.conj().T)/2)
    if ev[0] < -1e-9: continue
    cnt += 1
    dist = np.min(np.abs(T(Th0, th) + 1))
    mind = min(mind, dist/max(ev[0], 1e-300)**0.5)
out['b_strict_J_contractions_tested'] = cnt
out['b_min_dist(-1,image circle)/sqrt(min defect eig)'] = mind
# (c) ladder M(a) U_phi M(b): image disc touches -1 iff phi = 0 (mod 2pi) or Re b = 0
rows = []
for phi in [0.0, 0.01, 0.1, 1.0, 3.0]:
    for reb in [0.0, 0.01, 0.5]:
        Th0 = M(0.7 + 0.3j)@np.diag([np.exp(1j*phi), 1])@M(reb + 0.2j)
        rows.append([phi, reb, float(np.min(np.abs(T(Th0, th) + 1)))])
out['c_ladder_[phi,Re b,dist(-1,image)]'] = rows
# (d) junction is control-blind: S(x) -> -1 for zeta and for DH (gamma growth only); S_1 = T_{Theta^{-1}}[S] leaves the
#     disc as x grows for a ladder section with phi != 0, Re b > 0.  Delays 2^{-z}, 3^{-z}.
mp.mp.dps = 30
def Lzeta(x):
    s = mp.mpf(0.5) + x
    return 1/s + 1/(s - 1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
kap = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
chi = [0, 1, 1j, -1j, -1]; chib = [0, 1, -1j, 1j, -1]
def fDH(s): return (1 - 1j*kap)/2*mp.dirichlet(s, chi) + (1 + 1j*kap)/2*mp.dirichlet(s, chib)
def LDH(x):
    s = mp.mpf(0.5) + x   # xi_f = (5/pi)^{s/2} Gamma((s+1)/2) f(s)
    return mp.log(5/mp.pi)/2 + mp.digamma((s + 1)/2)/2 + mp.diff(fDH, s)/fDH(s)
def Zp(p, x): w = p**(-x); return (1 + w)/(1 - w)
rows = []
for x in [5, 20, 80, 320, 1280]:
    row = [x]
    for Lf in (Lzeta, LDH):
        L = complex(Lf(mp.mpf(x))); S = (1 - L)/(1 + L)
        Th = M(0.5*Zp(2, x))@np.diag([np.exp(1j*1.0), 1])@M(0.5*Zp(3, x))
        S1 = T(np.linalg.inv(Th), S)
        row += [S.real, abs(S1)]
    rows.append(row)
out['d_[x, S_zeta(x), |S1_zeta|, Re S_DH(x), |S1_DH|]'] = rows
json.dump(out, open('t1_rigidity.json', 'w'), indent=1, default=float)
for k, v in out.items(): print(k, v)
