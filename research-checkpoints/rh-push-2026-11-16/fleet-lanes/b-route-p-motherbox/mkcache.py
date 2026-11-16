#!/usr/bin/env python3
"""build the /tmp cache files (arb-generated coefficient/phase tables, integer structures) the v4c engine opens for the given floors, by constructing the Piece exactly as r7-full-cert.py does."""
import sys, json, time, importlib.util as ilu
T = 'tmp'
sp = ilu.spec_from_file_location('C7', f'{T}/r7-engine-cert-v4c.py'); C7 = ilu.module_from_spec(sp); sp.loader.exec_module(C7)
L6 = C7.L6
L = json.load(open(f'{T}/r6-fiber-out/p47_hybrid.json'))
for ii in [int(x) for x in sys.argv[1].split(',')]:
    t0 = time.time(); d = L[ii]; E = L6.entry(d['key'], d['file'])
    tc = (E['tL'] + E['tR']) / 2; ac = (E['a_lo'] + E['a_hi']) / 2
    DT = float(E['tR'] - E['tL']) / 2 * (1 + 1e-12); DA = float(E['a_hi'] - E['a_lo']) / 2 * (1 + 1e-12)
    pc = C7.Piece(E, tc, ac, DT, DA)
    print(ii, d['key'], 'piece', round(time.time() - t0, 1), flush=True)
