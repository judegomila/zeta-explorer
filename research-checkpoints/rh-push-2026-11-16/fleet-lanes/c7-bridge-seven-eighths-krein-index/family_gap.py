# Toy checks for c7-bridge-seven-eighths-krein-index. numpy double; largest array 1.5e6 complex (24 MB) x 3.
import numpy as np, warnings
warnings.filterwarnings('ignore')
np.set_printoptions(precision=8, linewidth=170)

def build(gammas, quartets):
    zs = []
    for g in gammas: zs += [1j*g, -1j*g]
    for (b, g) in quartets: zs += [b+1j*g, b-1j*g, -b+1j*g, -b-1j*g]
    return np.array(zs)

def Lfun(z, members):   # members: list of (weight, zeros); L = sum_w w * sum 1/(z-rho)
    return sum(w*np.sum(1.0/(z - zs)) for w, zs in members)
def Lp(z, members):
    return sum(-w*np.sum(1.0/(z - zs)**2) for w, zs in members)

def rhp_poles(members, alpha):
    """roots of 1 + alpha L = 0 in Re z > 0, by Newton from many starts near the off-line zeros."""
    found = []
    starts = []
    for w, zs in members:
        for rho in zs[zs.real > 1e-12]:
            for d in (0.0, 0.02, -0.02, 0.02j, -0.02j, 0.1, -0.1, 0.1j, -0.1j, 0.3j, -0.3j):
                starts.append(rho - min(alpha, 0.5*rho.real) + d)
    for z in starts:
        ok = True
        for _ in range(200):
            dz = (1+alpha*Lfun(z, members))/(alpha*Lp(z, members))
            z = z - dz
            if not np.isfinite(z): ok = False; break
            if abs(dz) < 1e-15: break
        if ok and abs(1+alpha*Lfun(z, members)) < 1e-9 and z.real > 1e-10:
            if all(abs(z-f) > 1e-8 for f in found): found.append(z)
    z = np.array(sorted(found, key=lambda t: (t.imag, t.real)))
    r = np.array([2.0/(alpha*Lp(w, members)) for w in z])
    return z, r

def T_gap(z, r, c):
    rc = r*np.exp(-z*c)
    A2 = 1.0/(np.conj(z)[:, None] + z[None, :])**2
    return float(np.real(np.conj(rc) @ A2 @ rc))

def Svals(t, members, alpha):
    L = np.zeros(len(t), dtype=complex)
    for w, zs in members:
        for rho in zs: L += w/(1j*t - rho)
    return (1-alpha*L)/(1+alpha*L)

def k_quad(us, members, alpha):
    h = 0.004; t = np.arange(-3000, 3000, h) + h/2
    print(f"   planned allocation: {len(t)} complex128 = {len(t)*16/1e6:.0f} MB per array")
    n = sum(w*len(zs) for w, zs in members)
    St = Svals(t, members, alpha) - 1 + 2*alpha*n/(1j*t+1)
    return np.array([np.sum(St*np.exp(1j*t*u))*h/(2*np.pi) for u in us])

print("=== T1. Lemma 1 (gapped trace): pole formula vs quadrature of int_c^inf (u-c)|k(-u)|^2 du ===")
zsB = build([1.0, 2.3, 4.7], [(0.3, 3.1)]); mem = [(1.0, zsB)]; alpha = 0.7
z, r = rhp_poles(mem, alpha)
print("   RHP poles", z, " residues", r)
us = np.linspace(0.0, 40.0, 2001); du = us[1]-us[0]
kq = k_quad(-us, mem, alpha)
kp = -np.array([np.sum(r*np.exp(-z*u)) for u in us])
print(f"   max |k_quad - k_pole| on u in [0.2,40] = {np.max(np.abs(kq-kp)[us>=0.2]):.2e}")
for c in (0.0, 1.0, 3.0, 6.0):
    m = us >= c
    f = (us[m]-c)*np.abs(kq[m])**2
    quad = np.sum((f[1:]+f[:-1])/2)*du
    r40 = r*np.exp(-z*40.0); A1 = 1.0/(np.conj(z)[:, None] + z[None, :])
    tail = T_gap(z, r, 40.0) + (40.0-c)*float(np.real(np.conj(r40) @ A1 @ r40))   # exact tail of the pole kernel beyond u = 40
    print(f"   c={c}: quadrature (u<=40) = {quad:.6f}  + pole tail (u>40) {tail:.6f} = {quad+tail:.6f}   pole formula = {T_gap(z, r, c):.6f}")

print("=== T2. isolated pair: singular value = alpha/sqrt(alpha^2+beta^2) * exp(-w_+ c), w_+ = sqrt(alpha^2+beta^2)-alpha ===")
for a, b in ((0.7, 0.3), (0.1, 0.375), (3.0, 0.375), (0.01, 0.375)):
    mem = [(1.0, build([], [(b, 400.0)]))]; z, r = rhp_poles(mem, a)
    wp = np.hypot(a, b)-a
    for c in (0.0, 2.0):
        ev = np.sqrt(T_gap(z, r, c)/len(z))   # two conjugate-symmetric well separated poles: equal singular values
        print(f"   alpha={a} beta={b} c={c}: sqrt(T/2) = {ev:.8f}  predicted {a/np.hypot(a,b)*np.exp(-wp*c):.8f}   Re z_j = {z.real}  w_+ = {wp:.8f}")

print("=== T3. two-sided bound lam_min(A2) sum|r_j|^2 e^{-2 x_j c} <= T(c) <= lam_max(A2) sum ...; rate = min Re z_j ===")
fam = {"chi1": build([1.0, 2.3, 4.7], [(0.36, 3.1)]),
       "chi2": build([0.8, 2.9, 5.2], [(0.20, 4.0), (0.33, 7.5)]),
       "chi3": build([1.7, 3.3, 6.1], [(0.05, 2.4)]),
       "chi4": build([1.2, 2.1, 3.9, 5.5], [])}
alpha = 0.3; data = {}
for name, zs in fam.items():
    z, r = rhp_poles([(1.0, zs)], alpha); data[name] = (z, r)
    if len(z) == 0:
        print(f"   {name}: no RHP poles, T(c) = 0"); continue
    A2 = 1.0/(np.conj(z)[:, None] + z[None, :])**2; ev = np.linalg.eigvalsh(A2)
    xs = z.real
    line = []
    for c in (0.0, 5.0, 20.0, 60.0):
        w = np.sum(np.abs(r)**2*np.exp(-2*xs*c)); T = T_gap(z, r, c)
        assert ev[0]*w*(1-1e-9) <= T <= ev[-1]*w*(1+1e-9)
        line.append(f"c={c}: T={T:.4e} ratio T/sum={T/w:.4f}")
    slope = -(np.log(T_gap(z, r, 80.0))-np.log(T_gap(z, r, 60.0)))/40.0
    print(f"   {name}: Re z_j = {np.unique(np.round(xs,8))}  lam(A2) in [{ev[0]:.4f},{ev[-1]:.4f}]  " + "; ".join(line) + f"; measured rate -dlogT/2dc on [60,80] = {slope:.6f}  min Re z_j = {xs.min():.6f}")

print("=== T4. family sum with positive weights: rate = min over members (no gain) ===")
wts = {"chi1": 1.0, "chi2": 1.0, "chi3": 1e-6, "chi4": 1.0}
def Tfam(c): return sum(wts[n]*T_gap(*data[n], c) for n in fam if len(data[n][0]))
for c0 in (0.0, 5.0, 20.0, 60.0, 120.0, 400.0, 1500.0):
    s = -(np.log(Tfam(c0+5))-np.log(Tfam(c0)))/10.0
    print(f"   c in [{c0},{c0+5}]: family local rate = {s:.6f}   (member min rates: " + ", ".join(f"{n}={data[n][0].real.min():.4f}" for n in fam if len(data[n][0])) + ")")
print("   rank-one Gram coupling v v^*: HS^2 of the anticausal block of sum v_chi S_chi = form over the union of pole sets")
v = {"chi1": 1.0, "chi2": -1.0+0.5j, "chi3": 0.3j}
zu = np.concatenate([data[n][0] for n in v]); ru = np.concatenate([v[n]*data[n][1] for n in v])
A2 = 1.0/(np.conj(zu)[:, None] + zu[None, :])**2
print(f"   union of {len(zu)} distinct poles: lam_min(A2) = {np.linalg.eigvalsh(A2)[0]:.3e} > 0; T(0) = {T_gap(zu, ru, 0):.6f}; rate on [60,80] = {-(np.log(T_gap(zu,ru,80.))-np.log(T_gap(zu,ru,60.)))/40:.6f}")

print("=== T5. sum of forms = bridge of the product: negative index adds ===")
members = [(1.0, fam[n]) for n in fam]
rng = np.random.default_rng(1)
allz = np.concatenate([fam[n][fam[n].real > 1e-12] for n in fam])
circ = 0.03*np.exp(2j*np.pi*np.arange(5)/5)
nodes = np.concatenate([(rho + circ) for rho in allz] + [rng.uniform(0.02, 0.6, 20) + 1j*rng.uniform(-8.5, 8.5, 20)])
print(f"   nodes: 5 on a circle of radius 0.03 about each of the {len(allz)} right-half-plane zeros, plus 20 random: {len(nodes)} nodes")
def pick_neg(members):
    Lv = np.array([Lfun(w, members) for w in nodes])
    K = (Lv[:, None] + np.conj(Lv)[None, :])/(nodes[:, None] + np.conj(nodes)[None, :])
    ev = np.linalg.eigvalsh(K); return int(np.sum(ev < -1e-9*np.max(np.abs(ev)))), ev[:6]
tot = 0
for n in fam:
    k, ev = pick_neg([(1.0, fam[n])]); off = int(np.sum(fam[n].real > 1e-12)); tot += off
    print(f"   {n}: off-line zeros in RHP = {off}, negative eigenvalues of the Pick kernel = {k}")
k, ev = pick_neg(members)
zp, rp = rhp_poles(members, alpha)
print(f"   sum of the four kernels (= kernel of the product): negative eigenvalues = {k}, sum of member indices = {tot}, RHP poles of S_prod = {len(zp)}")
k2, _ = pick_neg([(1.0, fam['chi1']), (7.3, fam['chi4']), (0.01, fam['chi3'])])
print(f"   weights (1, 7.3, 0.01) on (chi1, chi4, chi3): negative eigenvalues = {k2} (expected 2 + 0 + 2 = 4)")
print("   real nodes only (the eq48 class):")
nodes = np.linspace(0.02, 3.0, 60)
k3, ev3 = pick_neg(members); print(f"   product kernel on 60 real nodes in (0.02, 3): negative eigenvalues above 1e-9 relative = {k3}, lowest {ev3[:3]}")
