#!/usr/bin/env python3
"""nrange.py: at the fixed height T* = 875729722967011/1024 = 855204807584.97 (found by the lattice sweep), for which stages N does the order-2
zeta section have a certified off-line zero near s = 0.54 + i T*?  Newton continuation in N from the certified zero at N = 1250, then
cert_zero.certify at each N."""
import sys, json
import cert_zero
q = 875729722967011
def sweep(Ns, start):
    sg, tau = start
    for N in Ns:
        c = cert_zero.certify(2, N, q, 10, sg, tau)
        ok = bool(c.get('certified') and c.get('re_s_minus_half_lower', -1) > 0 and c.get('in_window') and abs(c['im_s_minus_T'] - tau) < 0.2)
        print(json.dumps(dict(N=N, off_line_certified=ok, re_s=c.get('re_s'), im_s_minus_T=c.get('im_s_minus_T'), abs_X=c.get('abs_X'), abs_hprime_lower=c.get('abs_hprime_lower'))), flush=True)
        if ok: sg, tau = c['re_s'], c['im_s_minus_T']
        else: break
start = (0.54148, -0.0163)
if sys.argv[1] == 'down': sweep(range(1250, 700, -10), start) if len(sys.argv) < 3 else sweep(range(700, 280, -5), (0.5212541829602564, -0.012651975058838479))
else: sweep([1250, 1300, 1400, 1500, 1600, 1800, 2000, 2500, 3000, 4000, 5000, 7000, 10000, 15000, 20000], start)
