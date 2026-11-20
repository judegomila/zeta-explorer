"""analyse.py: tables from dual_q*.jsonl (exact integers; ratios are floats computed from them).
Per block and weight:  J' = Diag + Princ + NP exactly (J = unit * q^d * Gstar * J'), NP = sum over rows u != 1 of c_u,
T1 = sum |c_u| (trivial count: triangle inequality over rows), RMS = sqrt(sum |c_u|^2), U = number of nonzero rows,
rho = |NP| / T1, theta = log(T1/|NP|) / log U (0: no cancellation; 1/2: random phases), env = max(|J'|, |Princ + Diag|)."""
import json, math, glob, statistics as st
from collections import defaultdict
recs = []
for fn in sorted(glob.glob("dual_q*.jsonl")):
    for l in open(fn):
        try: recs.append(json.loads(l))
        except Exception: pass
seen = {}
for b in recs: seen[(b['q'], b['w'], b['k'], b['N'], b['lam'], b['d'])] = b
recs = list(seen.values())
print(f"records (block, weight) {len(recs)}; with a reference |J|^2 in ../c7-ff-order2-vertex-exact/blocks_*.jsonl: {sum(1 for b in recs if b['match'] is not None)}; "
      f"identical integers: {sum(1 for b in recs if b['match'])}; mismatches: {sum(1 for b in recs if b['match'] is False)}")
for b in recs:
    b['NP'] = math.sqrt(b['NP2']); b['P'] = math.sqrt(b['princ2']); b['Jn'] = math.sqrt(b['tot2']); b['RMS'] = math.sqrt(b['S2'])
    b['rho'] = b['NP'] / b['T1'] if b['T1'] > 0 else None
    b['rnd'] = b['NP'] / b['RMS'] if b['RMS'] > 0 else None
    b['theta'] = (math.log(b['T1'] / b['NP']) / math.log(b['U'])) if (b['T1'] > 0 and b['NP'] > 0 and b['U'] > 1) else None
    b['PD'] = b['P'] + abs(b['diag'])
    b['env'] = max(b['Jn'], b['PD']); b['Np'] = b['N'] + b['lam']
def med(x): return st.median(x) if x else float('nan')
WS = ['a', 'b', 'mu', 'lnu', 'thin', 'rm', 'rma', 'n1', 'n2', 'dh', 't']
NOTE = {'a': 'target (quadratic character mod T^3+2)', 'b': 'target (mod T^3+T+1)', 'mu': 'w = mu: Moebius sum trivial (pole control, Liouville type)',
        'lnu': 'w = mu nu_a (Liouville twist of the target)', 'thin': 'nu_a times thin sign twist', 'rm': 'random completely multiplicative signs',
        'rma': 'nu_a times random multiplicative signs', 'n1': 'random +-1, not multiplicative', 'n2': 'random +-1, not multiplicative', 'dh': 'nu_a + nu_b', 't': 'w = 1'}
def classes(title, sel, umin):
    print("\n" + title)
    print(f"{'w':5s} {'q':>2s} {'blocks':>6s} {'NP=0':>5s} {'of which J=0':>12s} | NP != 0: {'n':>3s} {'med U':>6s} {'med rho':>8s} {'max rho':>8s} {'med theta':>9s} {'med NP/RMS':>10s} {'med NP/env':>10s} {'med env/T1':>10s}")
    for q in (7, 13):
        for w in WS:
            L = [b for b in recs if b['q'] == q and b['w'] == w and b['U'] >= umin and sel(b)]
            if not L: continue
            z = [b for b in L if b['NP2'] == 0]; nz = [b for b in L if b['NP2'] != 0]
            print(f"{w:5s} {q:2d} {len(L):6d} {len(z):5d} {sum(1 for b in z if b['tot2'] == 0):12d} |          {len(nz):3d} {med([b['U'] for b in nz]):6.0f} {med([b['rho'] for b in nz]):8.4f} "
                  f"{(max([b['rho'] for b in nz]) if nz else float('nan')):8.4f} {med([b['theta'] for b in nz]):9.3f} {med([b['rnd'] for b in nz]):10.3f} "
                  f"{med([b['NP'] / b['env'] for b in nz if b['env'] > 0]):10.4f} {med([b['env'] / b['T1'] for b in nz]):10.4f}")
print("weights: " + "; ".join(f"{w} = {NOTE[w]}" for w in WS))
classes("T1. complete row range d >= N', at least 20 nonzero non-principal rows", lambda b: b['d'] >= b['Np'], 20)
classes("T2. same, marked blocks (lam >= 1) in the ledger region lx < l (k + lam > d)", lambda b: b['d'] >= b['Np'] and b['lam'] >= 1 and b['k'] + b['lam'] > b['d'], 20)
classes("T3. same as T1 restricted to k <= (d+1)/2 (no re-expression by F1/F2), at least 6 rows", lambda b: b['d'] >= b['Np'] and 2 * b['k'] <= b['d'] + 1, 6)
classes("T4. d < N' (short row range), at least 20 rows", lambda b: b['d'] < b['Np'], 20)
classes("T5. blocks with c_k = 0 identically (d odd, k = (d+1)/2): J = 0, so NP = -(Princ + Diag) exactly; at least 6 rows", lambda b: b['d'] % 2 == 1 and 2 * b['k'] == b['d'] + 1, 6)
print("\nT6. exact identity check: number of (block, weight) records with |NP| > |J'| + |Princ| + |Diag| (must be 0):",
      sum(1 for b in recs if b['NP'] > (b['Jn'] + b['PD']) * (1 + 1e-12) + 1e-9))
print("    records with NP = 0 exactly and T1 > 0:", sum(1 for b in recs if b['NP2'] == 0 and b['T1'] > 0), "of", sum(1 for b in recs if b['T1'] > 0))
print("    of these, records with J = 0 and Princ = Diag = 0:", sum(1 for b in recs if b['NP2'] == 0 and b['T1'] > 0 and b['tot2'] == 0 and b['princ2'] == 0 and b['diag'] == 0))
print("\nT7. same geometry, different weights: theta_w - theta_a over geometries with NP != 0 for both, d >= N', U_a >= 20")
geo = defaultdict(dict)
for b in recs: geo[(b['q'], b['k'], b['N'], b['lam'], b['d'])][b['w']] = b
for q in (7, 13):
    for w in WS:
        x = [g[w]['theta'] - g['a']['theta'] for kk, g in geo.items() if kk[0] == q and kk[4] >= kk[2] + kk[3] and w in g and 'a' in g and g['a']['U'] >= 20
             and g['a']['theta'] is not None and g[w]['theta'] is not None]
        zz = [1 for kk, g in geo.items() if kk[0] == q and kk[4] >= kk[2] + kk[3] and w in g and 'a' in g and g['a']['U'] >= 20 and (g['a']['NP2'] == 0) != (g[w]['NP2'] == 0)]
        if x: print(f"q={q:2d} {w:5s} geometries {len(x):3d}  median {med(x):+.3f}  min {min(x):+.3f}  max {max(x):+.3f}   geometries where exactly one of the two has NP = 0: {len(zz)}")
print("\nT8. the largest blocks with NP != 0 for weight a, d >= N' (top 14 by U): per weight  U, |NP|, T1, rho, theta, |Princ|+|Diag|, |J'|")
big = sorted([kk for kk, g in geo.items() if 'a' in g and g['a']['NP2'] != 0 and kk[4] >= kk[2] + kk[3]], key=lambda kk: -geo[kk]['a']['U'])[:14]
for kk in big:
    g = geo[kk]
    print(f"q={kk[0]} k={kk[1]} N={kk[2]} lam={kk[3]} d={kk[4]} r={g['a']['r']} {'even' if g['a']['even'] else 'odd'}")
    for w in WS:
        if w in g:
            b = g[w]; th = b['theta'] if b['theta'] is not None else float('nan')
            print(f"    {w:5s} U={b['U']:5d} |NP|={b['NP']:10.4g} T1={b['T1']:10.4g} rho={b['rho']:.5f} theta={th:6.3f} PD={b['PD']:10.4g} |J'|={b['Jn']:10.4g}")
print("\nT9. parity classes among records with T1 > 0 (all d): odd = 6 does not divide k - N' (no principal weight for r <= 5: Princ = Diag = 0, J' = NP); even = principal row present")
for q in (7, 13):
    for ev in (False, True):
        L = [b for b in recs if b['q'] == q and b['even'] == ev and b['T1'] > 0]
        nz = [b for b in L if b['NP2'] != 0]
        print(f"q={q:2d} {'even' if ev else 'odd ':4s} records {len(L):5d}  NP = 0: {len(L)-len(nz):5d}  NP != 0: {len(nz):5d}  of these with Princ + Diag != 0: {sum(1 for b in nz if b['PD'] > 0):5d}"
              f"  median |NP|/(|Princ|+|Diag|) there: {med([b['NP']/b['PD'] for b in nz if b['PD'] > 0]):.4f}")
print("\nT10. even blocks with U >= 20, NP != 0, any d: per weight, median of |NP|/T1, |Princ+Diag|/T1, |J'|/T1")
for q in (7, 13):
    for w in WS:
        L = [b for b in recs if b['q'] == q and b['w'] == w and b['even'] and b['U'] >= 20 and b['NP2'] != 0]
        if L: print(f"q={q:2d} {w:5s} n={len(L):3d}  rho {med([b['rho'] for b in L]):.4f}  PD/T1 {med([b['PD']/b['T1'] for b in L]):9.3f}  J'/T1 {med([b['Jn']/b['T1'] for b in L]):9.3f}  theta {med([b['theta'] for b in L]):.3f}")
