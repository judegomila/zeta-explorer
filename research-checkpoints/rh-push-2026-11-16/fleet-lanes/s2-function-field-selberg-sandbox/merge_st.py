"""merge_st.py out.json chunk1.json chunk2.json ... : merge ffstream chunks (disjoint c_1 residue classes) of one (q, g)."""
import sys, json
ch = [json.load(open(f)) for f in sys.argv[2:]]
o = dict(q=ch[0]['q'], g=ch[0]['g'], D=ch[0]['D'])
for k in ('tested', 'members', 'rh', 'fakes', 'borderline', 'fakes_pass_T_gplus1', 'fakes_ndet_2g', 'fakes_pass_serre_d_le_g', 'fakes_pass_serre_and_T_gplus1', 'bisections'): o[k] = sum(c[k] for c in ch)
for k in ('ndet_hist', 'nu_hist'):
    h = {}
    for c in ch:
        for kk, v in c[k].items(): h[kk] = h.get(kk, 0) + v
    o[k] = dict(sorted(h.items(), key=lambda kv: int(kv[0])))
mins = sorted((m for c in ch for m in c['minimisers']), key=lambda m: m['Lam'])
o['min_pos_Lam'] = mins[0]['Lam'] if mins else -1.0; o['minimisers'] = mins[:8]; o['wall'] = max(c['wall'] for c in ch); o['chunks'] = len(ch)
json.dump(o, open(sys.argv[1], 'w')); print({k: v for k, v in o.items() if k != 'minimisers'}, mins[:1])
