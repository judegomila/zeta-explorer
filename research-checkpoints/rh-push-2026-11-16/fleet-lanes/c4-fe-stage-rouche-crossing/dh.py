# DH control: the stage f_X = (1/2)[(1 - i k) P_X(s, chi) + (1 + i k) P_X(s, chibar)] vanishes in Re s > 1/2 (mpmath, MEASURED).
import mpmath as mp, json, os
mp.mp.dps = 30
k = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
chi = {0: 0, 1: 1, 2: 1j, 3: -1j, 4: -1}
def primes(X):
    s = [True]*(X+1); out = []
    for p in range(2, X+1):
        if s[p]:
            out.append(p)
            for q in range(p*p, X+1, p): s[q] = False
    return out
def fX(s, P):
    a = mp.mpf(1); b = mp.mpf(1)
    for p in P:
        c = chi[p % 5]; x = mp.power(p, -s)
        a /= (1 - c*x); b /= (1 - mp.conj(c)*x)
    return ((1 - 1j*k)*a + (1 + 1j*k)*b)/2
def fDH(s):
    return ((1 - 1j*k)*mp.dirichlet(s, [0, 1, 1j, -1j, -1]) + (1 + 1j*k)*mp.dirichlet(s, [0, 1, -1j, 1j, -1]))/2
res = {}
z0 = mp.mpc('0.8085171825', '85.6993484854')
res["abs_f_at_recorded_zero"] = float(abs(fDH(z0)))
for X in [100, 1000, 10000]:
    P = primes(X)
    try:
        r = mp.findroot(lambda s: fX(s, P), z0, tol=1e-18, maxsteps=60)
        res[f"X={X}"] = {"zero": [float(r.real), float(r.imag)], "abs_fX": float(abs(fX(r, P))), "dist_to_DH_zero": float(abs(r - z0))}
    except Exception as e:
        res[f"X={X}"] = {"error": str(e)[:100]}
json.dump(res, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "dh.json"), "w"), indent=1); print(json.dumps(res, indent=1))
