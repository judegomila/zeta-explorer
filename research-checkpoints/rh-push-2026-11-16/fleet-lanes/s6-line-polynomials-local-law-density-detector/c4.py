"""Combination 4: true minimum of the mollified modulus over a Riemann-Siegel window against the triangle bound and the two-channel bound.
For x in [x_N, x_{N+1}) (J points, uniform), f = sum_{n<=N} a(n) b_t(n) n^-sigma_B e^{-i theta_n} + g sum conj(a(n)) b_t(n) n^-sigma_A e^{+i theta_n},
E = mollifier at s_B.  true = min_x |E f|;  chan = min_x (|E B| - g |E| |A|);
  tri = 1 - g - sum_{n>=2} (|b(n)| + g |a0(n)|) n^-sigma;   two = 1 - g - sum_{n>=2} max(|b(n) - g a0(n)|, (1-g)/(1+g) |b(n) + g a0(n)|) n^-sigma.
Lemma (Polymath15, Lemma 5.1; real coefficients): chan >= two >= tri whenever two > 0.
Usage: c4.py OUT.jsonl OBJ[:MOLL] N[,N..] [J=10000] [t] [y]     MOLL = euler11 (default; a(p) of the object), zeta11, none, own (TNR3, EA), dh96"""
import sys, json, math, time, numpy as np
import lp, tri, orbit
PR11 = [2, 3, 5, 7, 11]

def mollifier(obj, moll, a, t):
    if moll == 'none': return {1: 1.0}, 1
    if moll == 'zeta11': return orbit.euler_dict(PR11, [1.0] * 5, t), 2310
    if moll == 'euler11': return orbit.euler_dict(PR11, [a[p] for p in PR11], t), 2310
    if moll == 'own':
        nm = 'TNR' if obj == 'TNR3' else 'EA'
        return tri.euler_moll(nm, PR11 if nm == 'TNR' else [2, 3, 5, 7], t)
    if moll == 'dh96':
        d = json.load(open('dh_lam_690988_t0.json')); return {int(k): float(v) for k, v in d.items()}, 72072
    raise ValueError(moll)

def run(obj, moll, N, J, t, y, seed=1):
    a = lp.coefs(obj, N); assert not np.iscomplexobj(a)
    lam, D = mollifier(obj, moll, a, t)
    T = tri.Tri(a, D, N)
    _, p1 = T.value(N, t, y, lam, parts=True); _, p2 = T.value(N, t, y, lam, parts=True, mode='two')
    g, sigma, M = p1['g'], p1['sigma'], p1['M']
    b_tri = 1 - g - p1['S']; b_two = 1 - g - p2['S']
    del T
    n = np.arange(1, N + 1, dtype=np.float64); ln = np.log(n); heat = np.exp((t / 4) * ln * ln)
    wB = a[1:] * heat * np.exp(-sigma * ln); wA = wB * np.exp(y * ln)
    fr = (np.arange(J) + np.random.default_rng(seed).uniform(0, 1)) / J
    B, A = orbit.sums(N, t, fr, wB[:, None], wA[:, None])
    B = B[:, 0]; A = A[:, 0]
    E = orbit.moll_values(N, t, fr, lam, sigma)
    f = B + g * A
    true = np.abs(E * f); chan = np.abs(E) * (np.abs(B) - g * np.abs(A))
    i = int(np.argmin(true))
    return dict(obj=obj, moll=moll, N=N, J=J, t=t, y=y, sigma=sigma, g=g, M=M, tri=b_tri, two=b_two, true_min=float(true.min()), true_med=float(np.median(true)), true_max=float(true.max()),
                chan_min=float(chan.min()), f_at_min=float(fr[i]), absf_min=float(np.abs(f).min()), absE_min=float(np.abs(E).min()), absE_max=float(np.abs(E).max()),
                ratio_true_two=float(true.min() / b_two) if b_two > 0 else None, ratio_true_tri=float(true.min() / b_tri) if b_tri > 0 else None,
                lemma_ok=bool(chan.min() >= b_two - 1e-9) if b_two > 0 else None, frac_true_below_0p1=float(np.mean(true < 0.1)))

if __name__ == '__main__':
    out = sys.argv[1]; spec = sys.argv[2].split(':'); obj = spec[0]; moll = spec[1] if len(spec) > 1 else 'euler11'
    Ns = [int(float(v)) for v in sys.argv[3].split(',')]; J = int(sys.argv[4]) if len(sys.argv) > 4 else 10000
    t = float(sys.argv[5]) if len(sys.argv) > 5 else 129 / 800; y = float(sys.argv[6]) if len(sys.argv) > 6 else 0.1808
    for N in Ns:
        t0 = time.time(); r = run(obj, moll, N, J, t, y); r['sec'] = time.time() - t0
        print(json.dumps(r), flush=True); open(out, 'a').write(json.dumps(r) + '\n')
