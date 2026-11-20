#!/usr/bin/env python3
"""small_stage.py k N seedkind rho extra_bits out: one certified off-line zero of the zeta section at a stage N close to the torus threshold
(small margin sigma* - 1/2: needs a small tolerance rho and a very large height so that |G(1-s)/G(s)| is small)."""
import sys, json, math, time
sys.set_int_max_str_digits(0)
import numpy as np
import hsearch, hsweep, cert_zero
k = int(sys.argv[1]); N = int(sys.argv[2]); kind = sys.argv[3]; rho = float(sys.argv[4]); extra = int(sys.argv[5]); out = sys.argv[6]
if kind == 'liou':
    seed, _ = hsweep.seed_for(k, N, 'liou')
else:
    seed = np.load(kind)
t0 = time.time()
for rec in hsearch.candidates(float(k), N, seed, [rho], [0.0], sig_back=0.0, extra_bits=extra):
    print('candidate log10T', rec['log10T'], 'dist', rec['dist'], 'D zero sigma', rec['sigma_zero'], 'LLL s', time.time() - t0, flush=True)
    c = cert_zero.certify(k, N, int(rec['q']), rec['delta_log2'], rec['sigma_zero'], rec['tau_zero'])
    c.update(rho=rho, seed=kind, sigma_torus=rec['sigma_torus'], sigma_zero_D=rec['sigma_zero'], seconds=time.time() - t0)
    q = c.pop('q'); c['q_digits'] = len(q)
    print(json.dumps(c), flush=True)
    c['q'] = q
    open(out, 'a').write(json.dumps(c) + '\n')
