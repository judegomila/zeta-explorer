import json, glob
for fn in sorted(glob.glob('grid_*.json')):
    r = json.load(open(fn)); rows = r['rows']; n = r['n']
    def pat(key):
        s = ''.join('+' if x[key] > 0 else '-' if x[key] < 0 else '0' for x in rows)
        out = []
        for ch in s:
            if out and out[-1][0] == ch: out[-1][1] += 1
            else: out.append([ch, 1])
        return ' '.join('%s%d' % (c, m) for c, m in out)
    flips = 0; ev = []
    for a, b in zip(rows, rows[1:]):
        d = sum(1 for u, v in zip(a['im_signs'], b['im_signs']) if u != v)
        if d: flips += d; ev.append((round(a['x'], 4), d))
    J = [x['J'] for x in rows if isinstance(x['J'], float)]
    extra = ''
    if r['kind'] == 'theta':
        extra = ' ids(sum,norm,n1,n2) all ok: %s' % all(x['sum_identity_ok'] and x['norm_identity_ok'] and x['norm1_identity_ok'] and x['norm2_identity_ok'] for x in rows)
    print('%-8s p=%2d n=%3d | A: %s | N: %s | J: %s | J1: %s | J2: %s | D: %s (parity %+d) | im undecided %d, D pairs undecided %d | im sign flips %d at %s | J range [%.4g, %.4g] J(x=1e-3)=%.6f%s' % (
        r['kind'], r['p'], n, pat('signA'), pat('signN'), pat('signJ'), pat('signJ1'), pat('signJ2'), pat('signD'), (-1)**(n//2),
        sum(x['n_im_undecided'] for x in rows), sum(x['D_pairs_undecided'] for x in rows), flips, ev[:6], min(J), max(J), rows[0]['J'], extra))
