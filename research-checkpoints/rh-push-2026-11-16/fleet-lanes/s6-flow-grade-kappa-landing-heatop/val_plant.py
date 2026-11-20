"""cross-check of the window flow (c1_plant) against the function-side landing time (c1_arbland) for a pair added to zeta:
prints the site g (midpoint of the gap after index i) and the window-flow landing time for Y = 2b; the same pair is then run
through c1_arbland.py with OBJ = PLANT:ZETA:<g>:<b>.  Usage: val_plant.py LIST.npy b i1,i2,.."""
import sys, json, numpy as np, c1_plant
g = np.load(sys.argv[1], mmap_mode='r'); b = float(sys.argv[2]); gg = np.array(g[:200000])
out = []
for i in [int(v) for v in sys.argv[3].split(',')]:
    r = c1_plant.one((gg, float(gg[i]), i, 'added', 2 * b, 300, 0.0)); out.append(dict(i=i, g=repr(float(r['site'])), b=b, land_window=r['land']))
    print(json.dumps(out[-1]))
json.dump(out, open('out/val_plant.json', 'w'))
