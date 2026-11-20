# Verdict step in Arb balls (python-flint): the U4 band form Q_w(t, c) of PREREG.md at given windows.
# Input JSON: list of {"family": name, "t": decimal string, "vec": [[re, im] x 6] (optional), "note": ...}.
# Without "vec": float64 eigenvector of the 6 x 6 matrix at the exact P (a choice of test vector; any vector is admissible).
# Usage: python u4_ball.py windows.json prec out.json
import os, sys, json, math, time
os.environ['OMP_NUM_THREADS'] = '1'; os.environ['OPENBLAS_NUM_THREADS'] = '1'
import numpy as np
from multiprocessing import Pool
from flint import arb, acb, ctx
from u4lib import *
WIN = json.load(open(sys.argv[1])); PREC = int(sys.argv[2]); OUT = os.path.abspath(sys.argv[3])
WORKERS = int(os.environ.get('RH_WORKERS', '4'))
ctx.prec = PREC
TMAX = max(float(w['t']) for w in WIN)
PMAX = int(TMAX**THETA) + 100
PR = sieve(PMAX); SETS = make_sets(PR); SETS['zeta'] = (set(), 0)
NN, PP, MM = prime_powers(PR, PMAX)
def floorP(t):
    """floor(t^(3/4)) certified: the ball of t^(3/4) must not contain an integer boundary."""
    x = (t.log()*3/4).exp()
    lo = x.lower().floor().unique_fmpz(); hi = x.upper().floor().unique_fmpz()
    assert lo is not None and lo == hi, 'floor not decided'
    return int(lo)
def overlap(a, u, jj, kk):
    al = jj*arb.pi()/u; be = kk*arb.pi()/u
    if jj == kk: t1 = (u - a)*(be*a).cos()
    else: t1 = (((al-be)*u + be*a).sin() - ((al-be)*a + be*a).sin())/(al-be)
    t2 = (((al+be)*u - be*a).sin() - ((al+be)*a - be*a).sin())/(al+be)
    return (t1 - t2)/u
def overlap_check():
    """closed form against acb.integral of (2/u) sin(j pi s/u) sin(k pi (s-a)/u) on [a, u] at three triples."""
    out = []
    for (P, n, jj, kk) in [(22444, 7, 1, 1), (35756, 1009, 2, 5), (16837, 16, 6, 3)]:
        u = arb(P).log(); a = arb(n).log()
        f = lambda s, _: 2/acb(u)*(jj*acb.pi()*s/u).sin()*(kk*acb.pi()*(s - a)/u).sin()
        I = acb.integral(f, acb(a), acb(u))
        d = I.real - overlap(a, u, jj, kk)
        out.append(dict(P=P, n=n, j=jj, k=kk, closed=overlap(a, u, jj, kk).str(25), difference=d.str(5), contains0=bool(d.contains(0)), radius=float(d.rad())))
    return out
def one(w):
    ctx.prec = PREC
    t0 = time.time()
    nm = w['family']; S, sg = SETS[nm]
    t = arb(float(w['t'])) if w.get('t_as_float64') else arb(w['t']); P = floorP(t); u = arb(P).log(); Lg = (t/(2*arb.pi())).log()
    N = int(np.searchsorted(NN, P, side='left'))
    if w.get('vec') is None:                                         # float64 test vector at exact P
        ln_ld = np.log(NN[:N].astype(np.longdouble)); uf = math.log(P)
        O = overlaps_np(ln_ld.astype(float), uf).reshape(N, K*K)
        W = weights(NN[:N], PP[:N], MM[:N], {nm: (S, sg)} if nm != 'zeta' else {})[nm]
        B = ((W*phases(float(w['t']), ln_ld))[:, None]*O).sum(axis=0).reshape(K, K)
        Q = math.log(float(w['t'])/(2*math.pi))*np.eye(K) - (B + B.conj().T)
        ev, vec = np.linalg.eigh(Q)
        w = dict(w); w['vec'] = [[float(z.real), float(z.imag)] for z in vec[:, 0]]; w['float64_lambda_min_exact_P'] = float(ev[0])
    c = [acb(arb(x), arb(y)) for x, y in w['vec']]
    nrm = sum((abs(z)**2 for z in c), arb(0))
    npr = (sum((abs(z)**2*((k+1)*arb.pi()/u)**2 for k, z in enumerate(c)), arb(0))/nrm).sqrt()
    cc = [[c[j].conjugate()*c[k] for k in range(K)] for j in range(K)]
    Bz = acb(0); Bc = acb(0); nS = 0; mass = arb(0); seen = set()
    for i in range(N):
        n = int(NN[i]); p = int(PP[i]); m = int(MM[i])
        a = arb(n).log(); wz = arb(p).log()/arb(n).sqrt()
        qf = acb(0)
        for j in range(K):
            for k in range(K): qf += cc[j][k]*overlap(a, u, j+1, k+1)
        ph = acb(0, -1)*t*a; term = wz*ph.exp()*qf                    # e^(-i t log n)
        Bz += term
        if p in S:
            if p not in seen: seen.add(p); nS += 1
            mass += wz
            if sg != 0: Bc += term*(-1)**m
        else: Bc += term
    Qz = Lg - 2*(Bz/nrm).real; Qc = Lg - 2*(Bc/nrm).real
    eps = 16*t.log()/t*npr; sP = arb(P).sqrt()
    EM = eps*(2*Lg + arb('4.2')*sP) + eps**2 + 10*Lg/t**2
    E0 = 16*(t.log()/t)*(3*Lg + arb('4.2')*sP) + 4*u*sP*Lg*npr/t**2
    err = (EM + E0*npr)/Lg
    r = dict(family=nm, t=w['t'], t_as_float64=bool(w.get('t_as_float64')), note=w.get('note'), P=P, prime_powers_below_P=N, primes_of_S_below_P=nS, changed_weight_mass=mass.str(12),
             Lg=Lg.str(15), u_over_Lg=(u/Lg).str(8), nprime=npr.str(10), err=err.str(10),
             Q_ctl=Qc.str(30), Q_ctl_mid=float(Qc.mid()), Q_ctl_rad=float(Qc.rad()), Q_zeta=Qz.str(30), Q_zeta_mid=float(Qz.mid()), Q_zeta_rad=float(Qz.rad()),
             ctl_ball_excludes_0=bool(not Qc.contains(0)), ctl_negative=bool(Qc < 0), ctl_below_minus_err=bool(Qc + err < 0), ctl_above_plus_err=bool(Qc - err > 0),
             zeta_above_plus_err=bool(Qz - err > 0), zeta_below_minus_err=bool(Qz + err < 0),
             r21_value=w.get('r21_value'), contains_r21_value=(bool((Qc - arb(w['r21_value'])).abs_lower() < arb('1e-13')) if w.get('r21_value') else None),
             float64_lambda_min_exact_P=w.get('float64_lambda_min_exact_P'), screen_lam=w.get('screen_lam'), vec=w['vec'], prec=PREC, seconds=time.time()-t0)
    return r
if __name__ == '__main__':
    print('PLAN: %d windows, prec %d, workers %d; prime powers <= %d: %d; per process fewer than %d balls live (below 100 MB)' % (len(WIN), PREC, WORKERS, PMAX, len(NN), 100), flush=True)
    print('SETS', json.dumps(sets_record({k: v for k, v in SETS.items() if k != 'zeta'})), flush=True)
    oc = overlap_check(); print('OVERLAP', json.dumps(oc), flush=True)
    res = []
    with Pool(min(WORKERS, len(WIN))) as pool:
        for r in pool.imap(one, WIN):
            print(json.dumps({k: v for k, v in r.items() if k != 'vec'}), flush=True); res.append(r)
    json.dump({'prec': PREC, 'overlap_check': oc, 'sets': sets_record({k: v for k, v in SETS.items() if k != 'zeta'}), 'windows': res}, open(OUT, 'w'), indent=1)
    print('DONE', flush=True)
