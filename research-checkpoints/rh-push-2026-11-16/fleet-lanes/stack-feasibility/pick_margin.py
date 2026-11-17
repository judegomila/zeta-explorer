"""Constraints (iii) and (vi) on K = 12 real nodes: P = [(L_i+L_j)/(x_i+x_j)], B = [-(L_i-L_j)/(x_i-x_j)], sectors P+B, P-B.
For a hypothetical configuration = zeta's zeros with a local change, each matrix is S_true + Delta with Delta in closed form
(sum over the changed zeros only).  The configuration keeps the constraint iff lam := min eig(S_true^{-1/2} Delta S_true^{-1/2}) > -1."""
import mpmath as mp, json, sys
mp.mp.dps = 280
def Ltrue(x):
    s = mp.mpf(1)/2 + x
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
def dLtrue(x):
    s = mp.mpf(1)/2 + x; z0 = mp.zeta(s); z1 = mp.zeta(s, derivative=1); z2 = mp.zeta(s, derivative=2)
    return -1/s**2 - 1/(s-1)**2 + mp.polygamma(1, s/2)/4 + (z2*z0 - z1*z1)/z0**2
def ell(x, w):  return 2*x/(x*x - w)                       # pair +-z, w = z^2
def dell(x, w): return 2/(x*x - w) - 4*x*x/(x*x - w)**2
def mats(Lv, dLv, xs):
    n = len(xs); P = mp.matrix(n, n); B = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            P[i, j] = (Lv[i]+Lv[j])/(xs[i]+xs[j])
            B[i, j] = -dLv[i] if i == j else -(Lv[i]-Lv[j])/(xs[i]-xs[j])
    return P, B
def rel_min(S, D):
    C = mp.cholesky(S); Ci = C**-1; Mx = Ci*D*Ci.T; Mx = (Mx + Mx.T)/2
    return min(mp.eigsy(Mx, eigvals_only=True))
def delta_L(xs, online_removed, online_added, quartets):
    """heights are mpf absolute ordinates; quartets = list of (delta, t)"""
    Lv = []; dLv = []
    for x in xs:
        a = mp.mpf(0); d = mp.mpf(0)
        for t in online_added:   a += ell(x, -t*t); d += dell(x, -t*t)
        for t in online_removed: a -= ell(x, -t*t); d -= dell(x, -t*t)
        for (dl, t) in quartets:
            w = mp.mpc(dl, t)**2
            a += 2*mp.re(ell(x, w)); d += 2*mp.re(dell(x, w))
        Lv.append(a); dLv.append(d)
    return Lv, dLv
if __name__ == '__main__':
    out = {}
    for name, xs in (('nodes 0.6..6.1 step 0.5', [mp.mpf('0.6') + mp.mpf(i)/2 for i in range(12)]),
                     ('nodes 0.04..0.48 step 0.04', [mp.mpf(i+1)/25 for i in range(12)])):
        Lv = [Ltrue(x) for x in xs]; dLv = [dLtrue(x) for x in xs]; P, B = mats(Lv, dLv, xs)
        secs = {'P (Pick, vi)': P, 'P+B (bridge sector)': P+B, 'P-B (antibridge sector)': P-B}
        print('##', name)
        for k, S in secs.items():
            print('  true', k, 'min eig', mp.nstr(min(mp.eigsy(S, eigvals_only=True)), 5), 'max eig', mp.nstr(max(mp.eigsy(S, eigvals_only=True)), 5))
        # (a) plain insertion of one quartet at height g
        for dl in ('0.1', '0.375'):
            for g in ('20', '30', '50', '100', '1000', '1e5', '3.0002e12'):
                dL, ddL = delta_L(xs, [], [], [(mp.mpf(dl), mp.mpf(g))]); DP, DB = mats(dL, ddL, xs)
                r = {k: mp.nstr(rel_min(S, D), 4) for (k, S), D in zip(secs.items(), (DP, DP+DB, DP-DB))}
                print(f'  insert delta={dl} gamma={g}:', r, flush=True); out[f'{name}|insert|{dl}|{g}'] = r
        # (b) the surgery configurations at 3e12
        try:
            z = json.load(open('zeros_3e12.json')); t0 = mp.mpf(z['t0']); zt = z['zeros_tau']
            for s in json.load(open('surgery2.json')):
                if not (s['K'] == 400 and s['L'] in (6.0, 12.0) and s['delta'] in (0.05, 0.2, 0.3) and s['sup_E'] < 1e-5): continue
                rem = [t0 + mp.mpf(zt[i]) for i in s['pair']] + [t0 + mp.mpf(zt[i]) for i in s['idx']]
                add = [t0 + mp.mpf(zt[i]) + mp.mpf(e) for i, e in zip(s['idx'], s['eps'])]
                dL, ddL = delta_L(xs, rem, add, [(mp.mpf(s['delta']), t0 + mp.mpf(s['tq']))]); DP, DB = mats(dL, ddL, xs)
                r = {k: mp.nstr(rel_min(S, D), 4) for (k, S), D in zip(secs.items(), (DP, DP+DB, DP-DB))}
                print(f"  surgery delta={s['delta']} L={s['L']} K={s['K']} sup|E|={s['sup_E']:.2g}:", r, flush=True); out[f"{name}|surgery|L{s['L']}|{s['delta']}"] = r
        except FileNotFoundError: print('  (no surgery.json yet)')
    json.dump(out, open('pick_margin.json', 'w'), indent=1)
