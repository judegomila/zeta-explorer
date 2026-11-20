"""Certify counterexamples: for each (q,n) take the best torus minimiser from search_q*_n*.json,
round to an exact rational point of the closed unit polydisc (on the torus via the tangent half-angle map,
and a second point scaled by 99/100 into the open polydisc), build N(u;z) exactly over Q(i), and
 (1) count zeros in |u| < r for a rational r < q^{-1/2} by exact Schur-Cohn,
 (2) enclose roots with arb (acb_poly.roots, 256 bits) and print 25 digits,
 (3) continue all roots from z=(-1,..,-1) along two paths and report which root descends from u=1/q."""
import sys, json, glob, math, numpy as np
from fractions import Fraction as F
import flint
from lylib import *
from schur import G, schur_cohn_count
flint.ctx.prec = 300

def exact_N(q, n, cnt, zG):
    return Ncoeffs(q, n, cnt, zG, one=G(1, 0))
def to_acb(g): return flint.acb(flint.arb(flint.fmpq(g.a.numerator, g.a.denominator)), flint.arb(flint.fmpq(g.b.numerator, g.b.denominator)))
def rational_r(q):
    # rational r with r^2 < 1/q, r close to q^{-1/2}
    r = F(math.isqrt(10**24 // q), 10**12)
    assert r*r*q < 1
    return r
def track(q, n, cnt, zpath, steps=20000):
    """continue roots along zpath(s), s in [0,1]; returns (start roots, end roots in matched order, min separation margin)."""
    def rt(z): return np.roots(np.array([complex(c) for c in Ncoeffs(q, n, cnt, list(z), one=1+0j)])[::-1])
    cur = rt(zpath(0.0)); start = cur.copy(); worst = np.inf
    for k in range(1, steps+1):
        new = rt(zpath(k/steps))
        if len(new) != len(cur): raise RuntimeError("degree change on path")
        d = np.abs(cur[:, None]-new[None, :]); perm = d.argmin(axis=1)
        if len(set(perm)) != len(perm): raise RuntimeError(f"ambiguous matching at step {k}")
        move = d[np.arange(len(cur)), perm].max()
        sep = min(abs(new[i]-new[j]) for i in range(len(new)) for j in range(i))
        worst = min(worst, sep/max(move, 1e-300))
        cur = new[perm]
    return start, cur, worst

res = []
def run(rec, key, variants):
    q, n, es = rec['q'], rec['n'], rec['es']
    chi = chi_table(q); vals = value_tables(q, n-1); cnt = counts(q, es, vals, chi)
    zf = np.array(rec[key]['z_re']) + 1j*np.array(rec[key]['z_im'])
    for label in variants:
        if label == 'real':
            zG = [G(F(float(v.real)).limit_denominator(1000), 0) for v in zf]
        else:
            scale = F(1) if label == 'torus' else F(99, 100)
            S = [F(math.tan(t/2)).limit_denominator(1000) if abs(abs(t)-math.pi) > 1e-9 else None for t in np.angle(zf)]
            zG = [G(-scale, 0) if s is None else G(scale*(1-s*s)/(1+s*s), scale*2*s/(1+s*s)) for s in S]
        assert all(z.n2() <= 1 for z in zG)
        co = exact_N(q, n, cnt, zG)
        r = rational_r(q)
        cin = schur_cohn_count(co, r)
        roots = flint.acb_poly([to_acb(c) for c in co]).roots()
        roots = sorted(roots, key=lambda u: float(abs(u).mid()))
        mods = [abs(u)*flint.arb(q).sqrt() for u in roots]
        certified_inside = sum(1 for m in mods if m < 1)
        zc = np.array([complex(z) for z in zG])
        def coordpath(s):
            z = -np.ones(n, dtype=complex); x = s*n
            for i in range(n):
                f = min(max(x-i, 0.0), 1.0)
                ang = np.pi + f*((np.angle(zc[i]) - np.pi + np.pi) % (2*np.pi) - np.pi)
                z[i] = (1 + f*(abs(zc[i])-1))*np.exp(1j*ang)
            return z
        tr = {}
        for pname, path in (('straight', lambda s: -1 + s*(zc+1)), ('coordinatewise_arc', coordpath)):
            try:
                st, en, w = track(q, n, cnt, path)
                t = en[np.argmin(abs(st-1/q))]
                order = np.argsort(abs(en)); rank = int(np.where(order == np.argmin(abs(st-1/q)))[0][0])
                tr[pname] = {'trivial_root_end': str(t), 'trivial_abs_sqrt_q': float(abs(t)*q**.5), 'trivial_rank_by_modulus': rank,
                             'nontrivial_min_abs_sqrt_q': float(min(abs(e) for e in en if e != t)*q**.5), 'margin_sep_over_step': float(w)}
            except RuntimeError as e:
                tr[pname] = {'error': str(e)}
        out = {'q': q, 'n': n, 'es': es, 'source': key, 'point': label,
               'z_exact': [f"({z.a}) + ({z.b}) i" for z in zG], 'z_float': [str(complex(z)) for z in zG],
               'r_rational': str(r), 'schur_cohn_zeros_in_|u|<r': cin, 'arb_certified_roots_with_|u|sqrt(q)<1': certified_inside,
               'roots': [u.str(25, radius=False) for u in roots],
               'abs_u_sqrt_q': [m.str(25, radius=False) for m in mods], 'continuation': tr}
        res.append(out)
        print(json.dumps(out, indent=1), flush=True)
for fn in sorted(glob.glob('search_q*_n*.json')):
    data = json.load(open(fn))
    run(min(data, key=lambda r: r['N_second|torus']['min']), 'N_second|torus', ('torus', 'interior'))
    run(min(data, key=lambda r: r['N_second|diag']['min']), 'N_second|diag', ('interior',))
    rr = min(data, key=lambda r: r['N_second|real']['min'])
    if rr['N_second|real']['min'] < 0.999: run(rr, 'N_second|real', ('real',))
    rr = min(data, key=lambda r: r['N_second|rdiag']['min'])
    if rr['N_second|rdiag']['min'] < 0.999: run(rr, 'N_second|rdiag', ('real',))
json.dump(res, open('certify.json', 'w'), indent=1)
