"""extra.py: (1) Lemma A in the model: aligned vector W = mu, sizes of NP, T1 against Princ; (2) growth with r of |NP| per weight
and of the l2 norm of the NP functional; (3) generic (seed-averaged) cancellation exponent; (4) reference comparison of J2
with ../c7-ff-order2-vertex-exact/blocks_q7_d*.jsonl; (5) seed-level table for the decision."""
import json, math, glob, statistics as st
B = {}
for fn in ['r3_q7_k6.jsonl', 'r4_q7_k6.jsonl', 'r5_q7_k6.jsonl']:
    try:
        for l in open(fn):
            b = json.loads(l); B[(b['r'], b['N'], b['lam'])] = b
    except FileNotFoundError: pass
ref = {}
for fn in glob.glob('../c7-ff-order2-vertex-exact/blocks_q7_d*.jsonl'):
    for l in open(fn):
        b = json.loads(l)
        if b['k'] == 6 and b['N'] + b['lam'] == 6: ref[(b['target'], b['N'], b['lam'], b['d'])] = b['J2']
tot = ok = 0
for key, b in B.items():
    for s in b['stats']:
        k2 = (s['w'], b['N'], b['lam'], b['d'])
        if k2 in ref: tot += 1; ok += ref[k2] == s['J2']
print(f"(4) exact |J|^2 against the c7 block files: comparisons {tot}, identical {ok}")
S = {key: {s['w']: s for s in b['stats']} for key, b in B.items()}
rs = sorted({k[0] for k in B}); geos = sorted({k[1:] for k in B}, reverse=True)
q = 7
print("\n(1) Lemma A in the model, aligned vector W = mu (and W = 1): |Princ|, |NP|/|Princ|, T1/|Princ|; target a for comparison")
for g in geos:
    for r in rs:
        if (r,) + g not in S: continue
        s = S[(r,) + g]
        f = lambda w: f"{w}: Princ {math.sqrt(s[w]['princ2']):.3g} NP/Princ {math.sqrt(s[w]['NP2']/s[w]['princ2']):.2e} T1/Princ {s[w]['T1']/math.sqrt(s[w]['princ2']):.2e}"
        print(f"  (N,lam)={g} r={r}  " + " | ".join(f(w) for w in ('mu', 't', 'a')))
print("\n(2) growth with r (factor per step of r; rows grow by 7): l2 = rms over n-seeds of |NP|; T1n = mean over n-seeds of T1")
for g in geos:
    line = f"  (N,lam)={g}: "
    for w in ('l2', 'T1n', 'a', 'b', 'lnu', 'mu'):
        vals = []
        for r in rs:
            if (r,) + g not in S: continue
            s = S[(r,) + g]
            if w == 'l2': vals.append(math.sqrt(st.mean([s[n]['NP2'] for n in s if n.startswith('n:')])))
            elif w == 'T1n': vals.append(st.mean([s[n]['T1'] for n in s if n.startswith('n:')]))
            else: vals.append(math.sqrt(s[w]['NP2']) if w in s else float('nan'))
        line += f"{w} " + " ".join(f"{v:.3g}" for v in vals) + " (x" + ", x".join(f"{vals[i+1]/vals[i]:.1f}" for i in range(len(vals) - 1)) + ");  "
    print(line)
print("\n(3) generic cancellation exponent theta_gen = log(mean T1 / l2) / log U over n-seeds; over rm-seeds; target a, b; R = |NP(w)|/l2")
for r in rs:
    for g in geos:
        if (r,) + g not in S: continue
        s = S[(r,) + g]; U = max(v['U'] for v in s.values())
        def gen(c):
            nm = [n for n in s if n.startswith(c + ':')]
            return math.log(st.mean([s[n]['T1'] for n in nm]) / math.sqrt(st.mean([s[n]['NP2'] for n in nm]))) / math.log(U)
        th = lambda w: (math.log(s[w]['T1'] / math.sqrt(s[w]['NP2'])) / math.log(s[w]['U'])) if w in s and s[w]['NP2'] else float('nan')
        l2 = math.sqrt(st.mean([s[n]['NP2'] for n in s if n.startswith('n:')]))
        Rs = sorted(math.sqrt(s[n]['NP2']) / l2 for n in s if n.startswith('n:') or n.startswith('rm:'))
        print(f"  r={r} (N,lam)={g} U={U}: theta_gen n {gen('n'):.3f} rm {gen('rm'):.3f} rma {gen('rma'):.3f} | theta a {th('a'):.3f} b {th('b'):.3f} lnu {th('lnu'):.3f} | "
              f"R a {math.sqrt(s['a']['NP2'])/l2:.2f} b {math.sqrt(s['b']['NP2'])/l2:.2f} lnu {math.sqrt(s['lnu']['NP2'])/l2:.2f}; R over the 16 n, rm seeds: min {Rs[0]:.2f} median {st.median(Rs):.2f} max {Rs[-1]:.2f}; rank of R_a among them {sum(1 for x in Rs if x < math.sqrt(s['a']['NP2'])/l2)}/16, R_b {sum(1 for x in Rs if x < math.sqrt(s['b']['NP2'])/l2)}/16")
