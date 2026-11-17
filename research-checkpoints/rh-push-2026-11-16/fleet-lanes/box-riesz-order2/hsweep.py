#!/usr/bin/env python3
"""hsweep.py k out_prefix seedkind N1,N2,.. rho1,rho2,.. ntau [ncert] [extra_bits]: for each stage N build candidate heights (hsearch.candidates)
from a torus zero (seedkind 'liou': the real zero at theta = pi; 'file': results/cont_k<k>_theta_N<N>.npy), in parallel over (N, rho);
then certify (cert_zero.certify, Arb interval Newton) the candidates of smallest |T| whose float zero of D_N is near or right of the line."""
import sys, os, json, math
import numpy as np
from multiprocessing import Pool
from scipy.optimize import brentq
import tor, hsearch, cert_zero, liou_zero

def seed_for(k, N, kind):
    if kind == 'file':
        return np.load(f'results/cont_k{k}_theta_N{N}.npy'), 0.005
    lam = liou_zero.lam_upto(N); ln = np.log(np.arange(1, N + 1.0)); w = (1 - ln / math.log(N + 1)) ** k * lam
    f = lambda s: float(w @ np.exp(-s * ln))
    z = brentq(f, 0.5, 0.99, xtol=1e-15)
    return np.concatenate([[z], np.full(len(tor.primes_upto(N)), math.pi)]), 0.0

def task(a):
    k, N, kind, rho, ntau, extra = a
    seed, back = seed_for(k, N, kind)
    taus = np.linspace(-0.4, 0.4, ntau) if ntau > 1 else [0.0]
    out = []
    try:
        for rec in hsearch.candidates(float(k), N, seed, [rho], taus, sig_back=back, extra_bits=extra):
            rec['seed'] = kind; out.append(rec)
    except Exception as ex:
        out.append(dict(k=k, N=N, rho=rho, error=repr(ex)))
    if not out:
        out.append(dict(k=k, N=N, rho=rho, empty=True))
    return out

def cert_task(r):
    try:
        c = cert_zero.certify(int(r['k']), r['N'], int(r['q']), r['delta_log2'], r['sigma_zero'], r['tau_zero'])
    except Exception as ex:
        c = dict(certified=False, error=repr(ex))
    c.update(rho=r['rho'], seed=r.get('seed'), sigma_zero_D=r['sigma_zero'], log10T=r['log10T'])
    return c

if __name__ == '__main__':
    k = int(sys.argv[1]); pre = sys.argv[2]; kind = sys.argv[3]
    Ns = [int(x) for x in sys.argv[4].split(',')]; rhos = [float(x) for x in sys.argv[5].split(',')]; ntau = int(sys.argv[6])
    ncert = int(sys.argv[7]) if len(sys.argv) > 7 else 6
    extra = int(sys.argv[8]) if len(sys.argv) > 8 else 0
    nw = int(os.environ.get('RH_WORKERS', '4'))
    tasks = [(k, N, kind, rho, ntau, extra) for N in Ns for rho in rhos]
    recs = []
    with Pool(nw) as pool:
        for out in pool.imap_unordered(task, tasks):
            recs += out
            with open(pre + '_cand.jsonl', 'a') as f:
                for r in out: f.write(json.dumps(r) + '\n')
            print('done', (out[0].get('N'), out[0].get('rho')) if out else 'empty', len(out), flush=True)
        good = [r for r in recs if r.get('converged') and r['sigma_zero'] > 0.47 and abs(r['tau_zero'] - r['tau_target']) < 0.3]
        sel = []
        for N in Ns:
            g = sorted([r for r in good if r['N'] == N], key=lambda r: r['log10T'])
            sel += g[:ncert * 4]
        print('certifying', len(sel), flush=True)
        for c in pool.imap_unordered(cert_task, sel):
            with open(pre + '_cert.jsonl', 'a') as f: f.write(json.dumps(c) + '\n')
            if c.get('certified') and c.get('re_s_minus_half_lower', -1) > 0 and c.get('in_window'):
                print('CERTIFIED off-line zero', json.dumps({x: c[x] for x in ('N', 'T_log10', 're_s', 'rho', 'abs_X')}), flush=True)
