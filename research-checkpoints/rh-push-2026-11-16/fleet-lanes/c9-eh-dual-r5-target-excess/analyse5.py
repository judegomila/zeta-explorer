"""analyse5.py files... : tables and the pre-registered decision from the jsonl outputs of dual5.py.
All inputs exact integers; ratios are floats. theta = log(T1/|NP|)/log U; R = |NP(w)| / rms over seeds n:1..8 of |NP|
(|NP| is linear in the base weight w, so for random +-1 weights E|NP|^2 = ||F_NP||^2, the l2 norm of the NP functional)."""
import json, math, sys, statistics as st
from collections import defaultdict
def val(xy): return math.sqrt(xy[0] * xy[0] + xy[0] * xy[1] + xy[1] * xy[1])
B = []
for fn in sys.argv[1:]:
    for l in open(fn):
        B.append(json.loads(l))
def cls(nm):
    if nm in ('a', 'b'): return 'target'
    return nm.split(':')[0] if ':' in nm else nm
out = {}
for b in B:
    names = b['names']; S = {s['w']: s for s in b['stats']}
    for s in S.values():
        s['NP'] = math.sqrt(s['NP2']); s['RMS'] = math.sqrt(s['S2']); s['PD'] = math.sqrt(s['princ2']); s['J'] = math.sqrt(s['tot2'])
        s['theta'] = math.log(s['T1'] / s['NP']) / math.log(s['U']) if s['NP'] > 0 and s['U'] > 1 else None
    l2 = {c: math.sqrt(st.mean([S[n]['NP2'] for n in names if n.startswith(c + ':')])) for c in ('n', 'rm', 'rma', 'g')}
    l2J = math.sqrt(st.mean([S[n]['tot2'] for n in names if n.startswith('n:')]))
    l2P = math.sqrt(st.mean([S[n]['princ2'] for n in names if n.startswith('n:')]))
    print(f"\n== q={b['q']} k={b['k']} N={b['N']} lam={b['lam']} d={b['d']} r={b['r']} freqs={b['nfreq']} rows={len(b['rows'])}   "
          f"l2 norms over n-seeds: NP {l2['n']:.4g}  J' {l2J:.4g}  Princ {l2P:.4g};  rms |NP| over rm-seeds {l2['rm']:.4g}, rma {l2['rma']:.4g}, g/2 {l2['g']/2:.4g}")
    print(f"{'w':6s} {'U':>6s} {'|NP|':>10s} {'T1':>10s} {'theta':>6s} {'NP/RMS':>7s} {'R=NP/l2n':>8s} {'|Princ|':>10s} {'diag':>10s} {'|Jp|':>10s} {'Jp/l2J':>7s}")
    for nm in names:
        s = S[nm]
        if ':' in nm and int(nm.split(':')[1]) > 3: continue
        th = s['theta'] if s['theta'] is not None else float('nan')
        print(f"{nm:6s} {s['U']:6d} {s['NP']:10.4g} {s['T1']:10.4g} {th:6.3f} {s['NP']/s['RMS'] if s['RMS'] else float('nan'):7.3f} {s['NP']/l2['n']:8.3f} {s['PD']:10.4g} {s['diag']:10.4g} {s['J']:10.4g} {s['J']/l2J:7.3f}")
    out[(b['r'], b['N'], b['lam'])] = (S, l2, names)
print("\n\n=== pre-registered decision (geometries N >= 3) ===")
verdict = {}
for r in sorted({k[0] for k in out}):
    G = [k for k in out if k[0] == r and k[1] >= 3]
    names = out[G[0]][2]
    def mean_theta(nm):
        x = [out[g][0][nm]['theta'] for g in G]
        return None if any(v is None for v in x) else st.mean(x)
    def mean_logR(nm):
        return st.mean([math.log(out[g][0][nm]['NP'] / out[g][1]['n']) for g in G if out[g][0][nm]['NP'] > 0])
    per = {nm: mean_theta(nm) for nm in names}
    zero = [nm for nm in names if per[nm] is None]
    cl = defaultdict(list)
    for nm in names:
        if per[nm] is not None: cl[cls(nm)].append(per[nm])
    S_ = max(st.pstdev(cl['rm']), st.pstdev(cl['n']))
    ctrl = max(st.mean(cl['rm']), st.mean(cl['n']))
    print(f"\nr={r}: geometries {sorted((g[1], g[2]) for g in G)}; weights with NP = 0 in some geometry: {zero}")
    for c in ('rm', 'rma', 'n', 'g'):
        print(f"   class {c:4s}: seeds {len(cl[c])}  mean theta {st.mean(cl[c]):.4f}  sd over seeds {st.pstdev(cl[c]):.4f}  min {min(cl[c]):.4f}  max {max(cl[c]):.4f}   exp(mean log R) {math.exp(st.mean([mean_logR(n) for n in names if cls(n)==c and ':' in n])):.3f}")
    for nm in ('a', 'b', 'lnu', 'dh', 'thin', 'rm', 'rma', 'n1', 'n2', 'mu', 't'):
        if nm in per and per[nm] is not None:
            E = per[nm] - ctrl
            print(f"   {nm:5s} mean theta {per[nm]:.4f}   E = theta - max(mean rm, mean n) = {E:+.4f}   S = {S_:.4f}   E > S: {E > S_}   above every rm and n seed: {per[nm] > max(cl['rm'] + cl['n'])}   exp(mean log R) = {math.exp(mean_logR(nm)):.3f}")
            verdict[(r, nm)] = (E, S_, E > S_)
    # per geometry
    for g in sorted(G):
        S, l2, _ = out[g]
        tn = [S[n]['theta'] for n in names if cls(n) == 'n' and ':' in n]; tr = [S[n]['theta'] for n in names if cls(n) == 'rm' and ':' in n]
        fa = lambda nm: (f"{S[nm]['theta']:.3f}" if nm in S and S[nm]['theta'] is not None else 'nan')
        print(f"     (N,lam)={g[1:]}: theta a {fa('a')} b {fa('b')} lnu {fa('lnu')} mu {fa('mu')} | rm seeds mean {st.mean(tr):.3f} sd {st.pstdev(tr):.3f} range [{min(tr):.3f},{max(tr):.3f}] | n seeds mean {st.mean(tn):.3f} sd {st.pstdev(tn):.3f} range [{min(tn):.3f},{max(tn):.3f}]")
print("\nverdict table (r, weight): E, S, E > S")
for k_, v in sorted(verdict.items()): print("  ", k_, f"{v[0]:+.4f} {v[1]:.4f} {v[2]}")
rs = sorted({k[0] for k in verdict})
for nm in ('a', 'b'):
    if all((r, nm) in verdict for r in rs): print(f"target {nm}: E > S at every size {rs}: {all(verdict[(r, nm)][2] for r in rs)}")
