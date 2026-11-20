#!/usr/bin/env python3
"""driver: run spec.py over all configs with a small process pool (each worker prints its planned allocation)"""
import subprocess, sys, os
from concurrent.futures import ThreadPoolExecutor
delta = sys.argv[1]; workers = int(sys.argv[2]); out = sys.argv[3]
single = ['zeta', 'sign', 'ntp', 'ntm', 'ea', 'uni', 'dh', 'l2', 'tnr']
cfgs = ['arch'] + [f'{n}@{p}' for p in (2, 3, 5) for n in single if not (p == 5 and n in ('dh', 'l2'))]
cfgs += ['zeta@2+zeta@3', 'sign@2+sign@3', 'sign@2+zeta@3', 'uni@2+uni@3', 'ntp@2+zeta@3', 'ea@2+ea@3', 'dh@2+dh@3', 'tnr@2+zeta@3', 'zeta@2+zeta@3+zeta@5', 'sign@2+sign@3+zeta@5']
def run(c):
    nlan = '70' if 'uni' in c else '120'
    log = f'{out}/log_{c.replace("+","_").replace("@","")}_d{delta}.txt'
    with open(log, 'w') as f:
        r = subprocess.run([sys.executable, 'spec.py', c, delta, nlan, out], stdout=f, stderr=subprocess.STDOUT)
    print(c, 'exit', r.returncode, flush=True)
os.makedirs(out, exist_ok=True)
with ThreadPoolExecutor(workers) as ex: list(ex.map(run, cfgs))
