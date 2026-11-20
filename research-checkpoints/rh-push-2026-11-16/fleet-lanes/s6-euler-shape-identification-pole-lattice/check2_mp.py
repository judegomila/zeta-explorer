"""Higher-precision recheck of test 2 (mpmath, 40 digits): Rayleigh quotient |J v|/|v| of the float64 smallest
singular vector, with J recomputed entry by entry at 40 digits. This is an upper bound for sigma_min."""
import sys, json, math, numpy as np, mpmath as mp
sys.argv = ['x']
import importlib.util
spec = importlib.util.spec_from_file_location('jac2', __file__.replace('check2_mp.py', 'jac2.py')); j2 = importlib.util.module_from_spec(spec); spec.loader.exec_module(j2)
mp.mp.dps = 40; out = []
for P, T, n_t in ((1000, 1e2, 2000), (3000, 1e2, 2000), (3000, 1e5, 2000)):
    p = j2.primes_upto(P); lp = np.log(p.astype(float)); t = j2.heights(T, n_t); a0 = np.ones(len(p), dtype=complex)
    J = np.vstack([j2.rows(np, t, 0.5, lp, a0), j2.rows(np, t, 0.25, lp, a0)])
    U, s, Vh = np.linalg.svd(J, full_matrices=False); v = Vh[-1].conj()
    vm = [mp.mpc(float(z.real), float(z.imag)) for z in v]; lpm = [mp.log(int(q)) for q in p]
    tot = mp.mpf(0)
    for sig in (mp.mpf(1)/2, mp.mpf(1)/4):
        for tk in t:
            s_ = mp.mpc(sig, mp.mpf(float(tk))); acc = mp.mpc(0)
            for z, l in zip(vm, lpm): acc += z*(1/(mp.exp(s_*l) - 1) - 1/(mp.exp((1-s_)*l) - 1))
            tot += abs(acc)**2
    rq = mp.sqrt(tot/(2*n_t))/mp.sqrt(sum(abs(z)**2 for z in vm))
    row = dict(P=P, T=T, n_t=n_t, float_smin=float(s[-1]/math.sqrt(2*n_t)), mp_rayleigh=mp.nstr(rq, 12), top_primes=[int(p[i]) for i in np.argsort(-abs(v))[:4]])
    out.append(row); print(json.dumps(row), flush=True)
json.dump(out, open(__file__.replace('check2_mp.py', 'out/check2_mp.json'), 'w'), indent=1)
