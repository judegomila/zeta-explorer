"""Pivot: Fourier-self-dual weight family (q = 1 mod 4), branch points e_1..e_n and infinity.
 w_i(a) = (1+z_i)/2 * (1 + eta_i sqrt(q) [a=0]) + (1-z_i)/2 * chi(a),  eta_i = chi(f'(e_i)), eta_inf = 1.
 E_k(z) = sum_{deg D <= k} prod_{i<=n} w_i(D(e_i)) * w_inf(coef_k D),  E_{-1} = prod w_i(0).
 Z(u;z) = sum_{k>=0} (E_k - E_{-1}) u^k,  Nsd(u;z) = (1-u)(1-qu) Z(u;z)  (degree n+1).
Checks: (a) z=-1 gives (q-1)(1-u)(1-qu)L(u,chi_f); (b) functional equation E_k = q^{k-(n-1)/2} E_{n-1-k} for all complex z;
(c) on the real cube [-1,1]^{n+1}: how many roots lie on |u| = q^{-1/2}.
usage: selfdual.py q n maxsets nsamples"""
import sys, json, itertools, numpy as np
from scipy.optimize import minimize
from lylib import chi_table
q, n, maxsets, nsamp = map(int, sys.argv[1:5])
assert q % 4 == 1
chi = chi_table(q); sq = q**0.5
print(f"planned allocation: {q**n}x{q} int64 = {q**n*q*8/1e6:.2f} MB", flush=True)
idx = np.arange(q**n, dtype=np.int64)
digs = [(idx // q**j) % q for j in range(n)]          # coefficient of x^j
V = np.zeros((q**n, q), dtype=np.int64)
for j in range(n-1, -1, -1): V = (V*np.arange(q)[None, :] + digs[j][:, None]) % q
st = np.array([0, 1, 2])[chi]                           # chi=0 ->0, 1->1, -1->2  (state index)
rng = np.random.default_rng(7)
subs = [s for s in itertools.combinations(range(q), n) if s[0]==0 and s[1]==1]
if len(subs) > maxsets: subs = [subs[i] for i in sorted(rng.choice(len(subs), maxsets, replace=False))]
m = n+1
PAT = np.array([[(p // 3**i) % 3 for i in range(m)] for p in range(3**m)])   # (3^m, m)
summary = []
for es in subs:
    es = list(es)
    fp = [int(np.prod([(e-o) % q for o in es if o != e]) % q) for e in es]
    eta = np.array([chi[v] for v in fp] + [1])
    cnt = np.zeros((n, 3**m))
    for k in range(n):
        sl = slice(0, q**(k+1))
        S = np.concatenate([st[V[sl][:, es]], st[digs[k][sl]][:, None]], axis=1)
        cnt[k] = np.bincount((S * 3**np.arange(m)[None, :]).sum(axis=1), minlength=3**m)
    def E(z):
        z = np.asarray(z, dtype=complex)
        w = np.stack([(1+z)/2*(1+eta*sq), (1+z)/2 + (1-z)/2, (1+z)/2 - (1-z)/2], axis=0)   # (3, m): states 0,R,N
        mon = np.prod(w[PAT, np.arange(m)[None, :]], axis=1)
        return cnt @ mon, np.prod(w[0])
    def Nsd(z):
        Ek, Em1 = E(z)
        # Z = sum_{k<n} (E_k - Em1) u^k + Em1 * sum_{k>=n} (q^{k-n+(n+1)/2} - 1) u^k
        #   tail = Em1 * u^n * ( q^{(n+1)/2}/(1-qu) - 1/(1-u) )
        P = np.zeros(n+2, dtype=complex)
        base = np.zeros(n+2, dtype=complex); base[:n] = Ek - Em1
        P += base; P[1:] -= (q+1)*base[:-1]; P[2:] += q*base[:-2]          # times (1-u)(1-qu)
        P[n] += Em1*(q**((n+1)/2) - 1); P[n+1] += Em1*(q - q**((n+1)/2))   # u^n (q^{(n+1)/2}(1-u) - (1-qu))
        return P, Ek, Em1
    # (a)
    P, Ek, Em1 = Nsd(-np.ones(m)); r = np.roots(P[::-1]); a = np.sort(np.abs(r))
    assert abs(a[0]-1/q) < 1e-8 and abs(a[-1]-1) < 1e-6 and np.allclose(a[1:-1]*sq, 1, atol=1e-5), a
    # (b)
    fe = 0
    for t in range(20):
        z = rng.uniform(-1, 1, m) + 1j*rng.uniform(-1, 1, m)
        P, Ek, Em1 = Nsd(z)
        fe = max(fe, max(abs(Ek[k] - q**(k-(n-1)/2)*Ek[n-1-k])/abs(Ek[k]) for k in range(n)))
        fe = max(fe, np.abs(P - (q**((n+1)/2))*np.array([P[n+1-j]*q**(j-(n+1)) for j in range(n+2)])).max()/np.abs(P).max())
    # (c)
    def oncircle(z):
        r = np.roots(Nsd(z)[0][::-1]); return int((np.abs(np.abs(r)*sq-1) < 1e-6).sum()), r
    def offmeasure(z):          # sum of |log(|u| sqrt q)| over the n-1 roots closest to the circle
        r = np.roots(Nsd(z)[0][::-1]); d = np.sort(np.abs(np.log(np.abs(r)*sq)))
        return d[:n-1].sum()
    hist = {}; worst = (0, None)
    for t in range(nsamp):
        z = rng.uniform(-1, 1, m) if t % 3 else np.where(rng.random(m) < 0.5, -1.0, rng.uniform(-1, 1, m))
        c, r = oncircle(z); hist[c] = hist.get(c, 0)+1
        om = offmeasure(z)
        if om > worst[0]: worst = (om, z.copy())
    best = worst
    for s in range(12):
        x0 = rng.uniform(0, np.pi, m)
        rr = minimize(lambda x: -offmeasure(np.cos(x)), x0, method='Nelder-Mead', options={'maxiter': 3000, 'xatol': 1e-9, 'fatol': 1e-12})
        if -rr.fun > best[0]: best = (-rr.fun, np.cos(rr.x))
    cdiag = {}
    for zz in np.linspace(-1, 1, 2001):
        c, r = oncircle(np.full(m, zz)); cdiag[c] = cdiag.get(c, 0)+1
    rec = {'q': q, 'n': n, 'es': es, 'eta': eta.tolist(), 'FE_max_rel_defect': float(fe), 'on_circle_hist_real_cube': hist,
           'on_circle_hist_real_diagonal': cdiag, 'max_off_circle_measure': float(best[0]),
           'argmax_z': [float(v) for v in (best[1] if best[1] is not None else np.zeros(m))]}
    if best[1] is not None:
        r = np.roots(Nsd(best[1])[0][::-1]); rec['roots_abs_sqrtq_at_argmax'] = [float(v) for v in np.sort(np.abs(r))*sq]
    summary.append(rec); print(json.dumps(rec), flush=True)
json.dump(summary, open(f'selfdual_q{q}_n{n}.json', 'w'), indent=1)
