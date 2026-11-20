# Theorem K check on polynomials.  A = R[z]/(F), n = deg F.  Forms h_u(V, W) = sum_roots u(g) V(g) W(g) / F'(g)
# (u = 1: residue form; u = F': trace form).  Gram matrix in the Chebyshev basis T_k(z/3.5), k < n.
import numpy as np, json
rng = np.random.default_rng(7)
def sig(Mx, tol=1e-13):
    w = np.linalg.eigvalsh((Mx+Mx.T)/2); s = np.abs(w).max()
    return int((w > tol*s).sum()), int((w < -tol*s).sum())
def forms(roots, u):
    n = len(roots); F = np.poly(roots); dF = np.polyder(F)
    wts = np.array([u(g)/np.polyval(dF, g) for g in roots])
    T = np.array([np.polynomial.chebyshev.chebval(roots/3.5, [0]*k+[1]) for k in range(n)])   # Chebyshev basis, better conditioned
    return ((T*wts) @ T.T).real, dF
res = {"trials": 0, "residue_ok": 0, "trace_ok": 0, "u_ok": 0}
for trial in range(400):
    nr = rng.integers(0, 7); nc = rng.integers(0, 4)
    if nr + nc == 0: continue
    real = np.sort(rng.uniform(-3, 3, nr)); cx = rng.uniform(-3, 3, nc) + 1j*rng.uniform(0.3, 2, nc)
    if nr > 1 and np.min(np.diff(real)) < 0.15: continue
    roots = np.concatenate([real.astype(complex), cx, cx.conj()]); n = len(roots)
    dF = np.polyder(np.poly(roots))
    H1, _ = forms(roots, lambda g: 1.0)
    Ht, _ = forms(roots, lambda g: np.polyval(dF, g))
    c = rng.uniform(-3, 3); Hu, _ = forms(roots, lambda g: g - c)       # u = z - c, a unit iff c is not a root
    p1 = sum(np.sign(np.polyval(dF, g).real) for g in real)
    pu = sum(np.sign(((g-c)/np.polyval(dF, g)).real) for g in real)
    res["trials"] += 1
    s = sig(H1); res["residue_ok"] += int(s[0]-s[1] == p1 and s[0]+s[1] == n)
    s = sig(Ht); res["trace_ok"] += int(s == (nr+nc, nc))
    s = sig(Hu); ok = int(s[0]-s[1] == pu); res["u_ok"] += ok
    if not ok: res.setdefault("u_fail_min_dist_c_to_root", []).append(float(np.min(np.abs(roots-c))))
print(res)
# path through an exceptional point: F_tau = (z^2 - tau)(z^2 - 4), tau from 1 to -1
path = []
for tau in (1.0, 0.25, 0.01, -0.01, -0.25, -1.0):
    r = np.sqrt(complex(tau)); roots = np.array([r, -r, 2, -2], dtype=complex); dF = np.polyder(np.poly(roots))
    H1, _ = forms(roots, lambda g: 1.0); Ht, _ = forms(roots, lambda g: np.polyval(dF, g))
    path.append({"tau": tau, "residue_sig": sig(H1), "trace_sig": sig(Ht), "det_trace_over_disc": float(np.linalg.det(Ht)/np.real(np.prod([(roots[i]-roots[j])**2 for i in range(4) for j in range(i+1, 4)]))),
                 "disc": float(np.real(np.prod([(roots[i]-roots[j])**2 for i in range(4) for j in range(i+1, 4)])))})
    print(path[-1])
res["path"] = path
json.dump(res, open("krein_poly.json", "w"), indent=1)
