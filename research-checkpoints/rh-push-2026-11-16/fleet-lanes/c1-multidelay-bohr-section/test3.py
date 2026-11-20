# Pole term of the sharply truncated chain at fixed sigma < 1:  U_Q(s) = -zeta'/zeta(s) + Q^{1-s}/(1-s) + small.
# Shows the joint section over all primes <= Q loses contractivity at fixed height once Q^{1-sigma} >~ |1-s| Re G.
import numpy as np, mpmath as mp, math, json, sys
def primes_upto(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**0.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]
PR = primes_upto(10**6).astype(float); LP = np.log(PR)
print('primes', len(PR), 'planned alloc per chunk: 200 x %d complex = %.2f GB' % (len(PR), 200*len(PR)*16/1e9))
def G(s): return complex(1/s + 1/(s-1) - 0.5*mp.log(mp.pi) + 0.5*mp.digamma(s/2))
QS = [10**3, 10**4, 10**5, 10**6]; idx = [int(np.sum(PR <= q))-1 for q in QS]
out = []
for sg in (0.5, 0.75, 0.9):
    t = np.arange(14.0, 40.0001, 0.01)
    mx = np.full(len(QS), -np.inf); arg = np.zeros(len(QS)); errmax = np.zeros(len(QS))
    for a in range(0, len(t), 200):
        tt = t[a:a+200]
        z = np.exp(-np.outer(sg+1j*tt, LP))
        cs = np.cumsum(LP*z/(1-z), axis=1)[:, idx]
        rG = np.array([G(mp.mpc(sg, x)).real for x in tt])
        d = cs.real - rG[:, None]
        for j in range(len(QS)):
            k = int(np.argmax(d[:, j]))
            if d[k, j] > mx[j]: mx[j] = d[k, j]; arg[j] = tt[k]
        # identity check at first point of the chunk
        s = mp.mpc(sg, tt[0]); lz = complex(-mp.zeta(s, derivative=1)/mp.zeta(s))
        for j, q in enumerate(QS):
            pole = complex(mp.mpf(q)**(1-s)/(1-s))
            errmax[j] = max(errmax[j], abs(cs[0, j] - lz - pole))
    for j, q in enumerate(QS):
        row = {'sigma': sg, 'Q': q, 'max_excess_t_14_40': float(mx[j]), 'argmax_t': float(arg[j]),
               'pole_size_at_argmax': q**(1-sg)/abs(1-sg-1j*arg[j]), 'max_abs_U_plus_zl_minus_pole': float(errmax[j])}
        out.append(row); print(row); sys.stdout.flush()
json.dump(out, open('test3.json', 'w'), indent=1)
