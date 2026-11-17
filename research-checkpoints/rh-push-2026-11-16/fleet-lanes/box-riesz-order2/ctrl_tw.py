#!/usr/bin/env python3
"""ctrl_tw.py: control U (unimodular completely multiplicative twist; here the sign flip at 2, 'tw2m' of box-ly-search): the same
lift zero gives a certified off-line zero of the twisted pole-corrected symmetrised section, at a different height."""
import json, math, sys
import numpy as np
import hsweep, hsearch, cert_zero, tor
k, N = 2, int(sys.argv[1]); rho = float(sys.argv[2])
seed, _ = hsweep.seed_for(k, N, 'liou')
ps = tor.primes_upto(N); eps = np.zeros(len(ps)); eps[0] = math.pi
for inp, ea in (('zeta', None), ('tw2m', eps)):
    for rec in hsearch.candidates(2.0, N, seed, [rho], [0.0], sig_back=0.0, epsarg=ea):
        c = cert_zero.certify(k, N, int(rec['q']), rec['delta_log2'], rec['sigma_zero'], rec['tau_zero'], inp=inp)
        c.update(input=inp, rho=rho, sigma_zero_D=float(rec['sigma_zero']))
        print(json.dumps(c), flush=True)
