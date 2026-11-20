"""Combinations (1), (3a), (4a): Pick matrix of c = F'/F on real nodes; next-node Schur defects on a probe grid; ladder.
usage: run1.py <out.jsonl> <family> <n> <bits> <code> [delta:gamma ...] [--all] [--probes] [--ladder] [--noplain] [--nodouble]
 families (lib2.node): acc:m (1/2 + 2^(-k/m)), chebv:lo:hi (Chebyshev-distributed, nested), vdc:lo:hi, geo:m, four, lad.
 planted specs add one off-line quadruple +-delta +- i gamma to the base object (base values reused).
 --probes: 48 extra real points x (0.03 .. 40); reports the first N at which some Delta_N(x) < 0.
 --ladder: runs the literal PR-47 ladder on the same data and reports the first p_j <= 0.
Precision is raised (in proportion to n / index of the undecided pivot, at most doubled, up to 3 times) when a pivot ball contains 0."""
import sys, os, json, time, math
from multiprocessing import Pool
from flint import arb, acb, ctx
import lib, lib2

NPROBE = 48
def probe_node(i):
    return arb('0.03') * ((arb(40) / arb('0.03')).log() * i / (NPROBE - 1)).exp() * (1 + arb(2).sqrt() / 4096)

def _pw(args):
    code, i, bits = args
    ctx.prec = bits + 64
    return i, lib2.pack(lib2.logder(lib2.get(code), probe_node(i)).real)

def probe_values(code, bits, pool):
    import pickle
    fn = 'cache/probe_%s_%d.pkl' % (code.replace('/', '_').replace(':', '_'), bits)
    if os.path.exists(fn): return pickle.load(open(fn, 'rb'))
    if code.startswith('HT:'):
        ctx.prec = bits + 64; o = lib2.get(code); o.build()
        out = [lib2.pack(lib2.logder(o, probe_node(i)).real) for i in range(NPROBE)]
    else:
        res = dict(pool.imap_unordered(_pw, [(code, i, bits) for i in range(NPROBE)]))
        out = [res[i] for i in range(NPROBE)]
    pickle.dump(out, open(fn, 'wb')); return out

def run(out, family, n, bits, code, planted, pool, full, probes, ladder, maxatt):
    for attempt in range(maxatt):
        ctx.prec = bits + 64
        base = [lib2.unpack(t) for t in lib2.values(code, family, n, bits, pool)]
        nu = [lib2.node(family, k) for k in range(n)]
        if probes:
            pb = [lib2.unpack(t) for t in probe_values(code, bits, pool)]; pn = [probe_node(i) for i in range(NPROBE)]
        ctx.prec = bits
        retry = False
        for spec in planted:
            def add(cs, xs):
                if spec is None: return cs
                d, g = spec.split(':'); lam = acb(arb(g), -arb(d)); lam = lam * lam
                return [cs[k] + (2 * xs[k] / (xs[k] * xs[k] + lam)).real * 2 for k in range(len(xs))]
            c = add(base, nu); label = code if spec is None else 'PL:%s:%s' % (code, spec)
            t1 = time.time()
            rec = dict(code=label, family=family, bits=bits, n=n)
            if probes:
                piv, negp, und = lib2.schur_probe(nu + pn, c + add(pb, pn), n, stop_at_negative=not full)
                rec['probe_first_N'] = negp[0][0] if negp else None
                rec['probe_first_x'] = float(pn[negp[0][1]].mid()) if negp else None
                rec['probe_first_log2'] = negp[0][2] if negp else None
                rec['probe_negative_at_N0'] = [float(pn[t[1]].mid()) for t in negp if t[0] == 0]
                rec['probe_undecided'] = und
                # probes negative before the base pivot is: list of (N, x) for the first 6
                rec['probe_first_six'] = [(t[0], round(float(pn[t[1]].mid()), 4), round(t[2], 1)) for t in negp[:6]]
            else:
                piv = lib.schur_real(nu, c, stop_at_negative=not full)
            s = lib.summarize(piv, n)
            if s['undecided_at'] is not None and attempt < maxatt - 1:
                und_at = s['undecided_at']
                prec_part = dict(code=label, family=family, bits=bits, n=n, partial=True, **s)
                open(out, 'a').write(json.dumps(prec_part) + '\n')
                print('  undecided', label, family, n, bits, 'at', und_at, '-> raise precision', flush=True); retry = True; break
            rec.update(s); rec['schur_sec'] = round(time.time() - t1, 1)
            fn = s['first_negative']
            if fn is not None: rec['first_negative_node'] = float(nu[fn].mid())
            rec['nu_min'] = min(float(t.mid()) for t in nu); rec['nu_max'] = max(float(t.mid()) for t in nu)
            rec['negative_indices'] = [p[0] for p in piv if p[1] < 0][:40]
            rec['profile'] = [(p[0], round(p[2], 1) if p[2] is not None else None) for p in piv[::max(1, len(piv) // 24)]]
            if ladder:
                lad = lib2.ladder(nu, c)
                f = next((t[0] for t in lad if t[1] < 0), None)
                rec['ladder_steps'] = len(lad); rec['ladder_first_nonpositive'] = f
                rec['ladder_p_first8'] = [t[3] for t in lad[:8]]
                rec['ladder_log2p_profile'] = [(t[0], round(t[2], 1)) for t in lad[::max(1, len(lad) // 16)] if t[2] is not None]
                rec['ladder_p_range'] = [min(t[3] for t in lad if t[1] > 0), max(t[3] for t in lad if t[1] > 0)] if any(t[1] > 0 for t in lad) else None
                rec['ladder_undecided'] = next((t[0] for t in lad if t[1] == 0), None)
            open(out, 'a').write(json.dumps(rec) + '\n')
            print(json.dumps({k: v for k, v in rec.items() if k not in ('profile', 'ladder_log2p_profile')}), flush=True)
        if not retry: return
        bits = int(bits * min(2.0, max(1.2, 1.12 * n / max(und_at, 1)))) + 200

if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    out, family, n, bits, code = a[0], a[1], int(a[2]), int(a[3]), a[4]
    planted = ([None] if '--noplain' not in sys.argv else []) + a[5:]
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as pool:
        run(out, family, n, bits, code, planted, pool, '--all' in sys.argv, '--probes' in sys.argv, '--ladder' in sys.argv,
            1 if '--nodouble' in sys.argv else 4)
