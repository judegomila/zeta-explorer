#!/usr/bin/env python3
"""Referee R8: own reconstruction of the kernel polynomial of Thm 3.4.

Own code. Does not import any packet code. Reads only data files given as arguments:
  argv[1] = plan JSON (ACTUAL_67_ROW_PLAN.json)
  argv[2] = directory with the packet's ROW_xxx_ACTUAL_CERTIFICATE.json.gz (data, for comparison)
  argv[3] = output JSON
  argv[4] = optional comma list of rows (default all)

Construction (different from the packet script):
  work in Q[s, y], s = d^2, y = contact height (q = y^2); build R(d, y) from eq (30)
  K_h(d, y) = sum over a in {h - y, h + y} of a / (d^2 + a^2),
  symmetric shift v: (1/2)[f(d+v) + f(d-v)] of a/(d^2+a^2) = a (s + v^2 + a^2) / ((s + v^2 + a^2)^2 - 4 s v^2),
  jets: d^m/dh^m [a/(s+a^2)] = (-1)^m m! Re (a - i d)^(m+1) / (s + a^2)^(m+1).
Then P = 4 Den - (s + 4 y^2) Num, checked even in y, rewritten in q, converted to Bernstein form
on s = 4u/(1-u), q = cap v, and (i) compared entry by entry with the packet's root tensor,
(ii) proved nonnegative by own adaptive de Casteljau subdivision (no packet partition used).
Own pair: O(q) = R(0, sqrt q) built in Q[y]; O' numerator proved positive on [0, cap] by a Sturm sequence.
"""
import sys, json, gzip, time
from fractions import Fraction
from math import comb, gcd, lcm
from flint import fmpq, fmpq_mpoly_ctx, fmpq_poly

sys.set_int_max_str_digits(0)
CTX = fmpq_mpoly_ctx.get(('s', 'y'))
s, y = CTX.gens()
ONE = CTX.constant(1)
ZERO = CTX.constant(0)


def fq(x):
    return fmpq(str(x))


def addf(a, b):
    return a[0] * b[1] + b[0] * a[1], a[1] * b[1]


def node_fraction(h, v):
    """(1/2)[K_h(d+v, y) + K_h(d-v, y)] as a fraction in Q[s, y]."""
    out = (ZERO, ONE)
    for a in (h - y, h + y):
        if v == 0:
            t = (a, s + a * a)
        else:
            e = s + v * v + a * a
            t = (a * e, e * e - 4 * v * v * s)
        out = addf(out, t)
    return out


def jet_fraction(p, bs):
    """sum_m b_m p^(m-1)/m! d^m/dh^m K_h(d, y) at h = p, as a fraction in Q[s, y]."""
    M = len(bs) - 1
    out = (ZERO, ONE)
    for a in (p - y, p + y):
        den1 = s + a * a
        pw = [ONE]
        for _ in range(M + 1):
            pw.append(pw[-1] * den1)
        num = ZERO
        apow = [ONE]
        for _ in range(M + 2):
            apow.append(apow[-1] * a)
        for m, b in enumerate(bs):
            if b == 0:
                continue
            re = ZERO
            for k in range((m + 1) // 2 + 1):
                re += comb(m + 1, 2 * k) * (-1) ** k * apow[m + 1 - 2 * k] * s ** k
            num += b * p ** (m - 1) * (-1) ** m * re * pw[M - m]
        out = addf(out, (num, pw[M + 1]))
    return out


def merged_nodes(row):
    nodes = {}
    for nd in row['nodes']:
        h, v, w = fq(nd['height']), abs(fq(nd['shift'])), fq(nd['weight'])
        nodes[(h, v)] = nodes.get((h, v), fmpq(0)) + w
    return nodes


def build_boundary(row):
    cap = fq(row['q_interval'][1])
    assert fq(row['q_interval'][0]) == 0 and cap > 0
    R = (ZERO, ONE)
    for (h, v), w in sorted(merged_nodes(row).items()):
        assert h > 0 and h * h > cap
        if w == 0:
            continue
        n, d = node_fraction(h, v)
        R = addf(R, (w * n, d))
    ov = row.get('joint_jet_overlay')
    if ov:
        alpha = fq(ov['alpha'])
        assert alpha >= 0
        R = (alpha * R[0], R[1])
        for c in ov['centres']:
            p = fq(c['p'])
            bs = [fq(b) for b in c['b']]
            assert p > 0 and p * p > cap
            n, d = jet_fraction(p, bs)
            R = addf(R, (2 * n, d))
    P = 4 * R[1] - (s + 4 * y * y) * R[0]
    return P, cap


def to_sq(P):
    """dict {(i, j): coeff} in s^i q^j; asserts evenness in y."""
    out = {}
    for (i, jy), c in P.to_dict().items():
        i, jy = int(i), int(jy)
        assert jy % 2 == 0, "odd power of y in cleared polynomial"
        out[(i, jy // 2)] = c
    return out


def bernstein_tensor(co, cap, scale):
    m = max(i for i, _ in co)
    n = max(j for _, j in co)
    rows = [[fmpq(0)] * (n + 1) for _ in range(m + 1)]
    bycol = {}
    for (i, j), c in co.items():
        bycol.setdefault(i, {})[j] = c * scale ** i * cap ** j / comb(m, i)
    den = 1
    for i, mono in bycol.items():
        for k in range(n + 1):
            val = fmpq(0)
            for j, c in mono.items():
                if j <= k:
                    val += c * fmpq(comb(k, j), comb(n, j))
            rows[i][k] = val
            den = lcm(den, int(val.denominator))
    ints = [[int(v.numerator) * (den // int(v.denominator)) for v in r] for r in rows]
    g = 0
    for r in ints:
        for v in r:
            g = gcd(g, abs(v))
    g = max(g, 1)
    return [[v // g for v in r] for r in ints], (m, n)


def split_vec(b):
    n = len(b) - 1
    left = [b[0] << n]
    right = [0] * (n + 1)
    cur = list(b)
    right[n] = cur[n] << n
    for r in range(1, n + 1):
        cur = [cur[j] + cur[j + 1] for j in range(n + 1 - r)]
        left.append(cur[0] << (n - r))
        right[n - r] = cur[-1] << (n - r)
    return left, right


def split_tensor(T, axis):
    if axis == 'v':
        pr = [split_vec(r) for r in T]
        return [p[0] for p in pr], [p[1] for p in pr]
    m, n = len(T), len(T[0])
    L = [[0] * n for _ in range(m)]
    Rr = [[0] * n for _ in range(m)]
    for j in range(n):
        l, r = split_vec([T[i][j] for i in range(m)])
        for i in range(m):
            L[i][j] = l[i]
            Rr[i][j] = r[i]
    return L, Rr


def neg_score(T):
    return sum(1 for r in T for v in r if v < 0)


def adaptive(T, maxdepth=48, maxnodes=20000):
    """Own subdivision. Returns (leaf_count, max_depth_used, strict) or raises."""
    stack = [(T, 0)]
    leaves = 0
    deepest = 0
    nodes = 0
    strict = True
    while stack:
        M, depth = stack.pop()
        nodes += 1
        if nodes > maxnodes:
            raise ArithmeticError('node budget exceeded')
        mn = min(min(r) for r in M)
        if mn >= 0:
            leaves += 1
            deepest = max(deepest, depth)
            if mn == 0:
                strict = False
            continue
        if depth >= maxdepth:
            raise ArithmeticError('depth budget exceeded; negative Bernstein coefficient remains')
        # corner values are exact polynomial values: a negative corner is a counterexample
        for (i, j) in ((0, 0), (0, -1), (-1, 0), (-1, -1)):
            if M[i][j] < 0:
                raise ArithmeticError('NEGATIVE POLYNOMIAL VALUE at a box corner: inequality false')
        cu = split_tensor(M, 'u')
        cv = split_tensor(M, 'v')
        su = neg_score(cu[0]) + neg_score(cu[1])
        sv = neg_score(cv[0]) + neg_score(cv[1])
        ch = cu if su <= sv else cv
        stack.append((ch[0], depth + 1))
        stack.append((ch[1], depth + 1))
    return leaves, deepest, strict


def own_pair_poly(row):
    """O(q) = R(0, sqrt q) as fraction of fmpq_poly in y (even), built from eq (30) at d = 0."""
    Y = fmpq_poly([0, 1])
    one = fmpq_poly([1])
    num, den = fmpq_poly([0]), one

    def add(n1, d1):
        nonlocal num, den
        num, den = num * d1 + n1 * den, den * d1

    for (h, v), w in sorted(merged_nodes(row).items()):
        if w == 0:
            continue
        for a in (h - Y, h + Y):
            add(w * a, v * v + a * a) if v != 0 else add(w * one, a)
    ov = row.get('joint_jet_overlay')
    if ov:
        alpha = fq(ov['alpha'])
        num = alpha * num
        for c in ov['centres']:
            p = fq(c['p'])
            bs = [fq(b) for b in c['b']]
            for a in (p - Y, p + Y):
                # d^m/dh^m (1/a) = (-1)^m m!/a^(m+1)
                M = len(bs) - 1
                n1 = fmpq_poly([0])
                for m, b in enumerate(bs):
                    n1 += 2 * b * p ** (m - 1) * (-1) ** m * a ** (M - m)
                add(n1, a ** (M + 1))
    return num, den


def even_to_q(poly):
    c = poly.coeffs()
    for k in range(1, len(c), 2):
        assert c[k] == 0, 'odd coefficient'
    return fmpq_poly(c[0::2])


def sturm_count(p, a, b):
    """number of distinct real roots of p in (a, b]; requires p(a) != 0 and p(b) != 0."""
    seq = [p, p.derivative()]
    while seq[-1].degree() >= 0 and not (seq[-1] == 0):
        r = seq[-2] % seq[-1]
        if r == 0:
            break
        seq.append(-r)

    def changes(x):
        vals = [f(x) for f in seq]
        signs = [1 if v > 0 else -1 for v in vals if v != 0]
        return sum(1 for i in range(len(signs) - 1) if signs[i] != signs[i + 1])
    assert p(a) != 0 and p(b) != 0
    return changes(a) - changes(b)


def main():
    plan = json.load(open(sys.argv[1]))
    certdir = sys.argv[2]
    out = sys.argv[3]
    rows = list(range(67)) if len(sys.argv) < 5 else [int(x) for x in sys.argv[4].split(',')]
    res = []
    for idx in rows:
        t0 = time.monotonic()
        row = plan['rows'][idx]
        assert row['row'] == idx
        P, cap = build_boundary(row)
        co = to_sq(P)
        T, deg = bernstein_tensor(co, cap, fmpq(4))
        print('planned tensor entries row', idx, (deg[0] + 1) * (deg[1] + 1), flush=True)
        with gzip.open(f'{certdir}/ROW_{idx:03}_ACTUAL_CERTIFICATE.json.gz', 'rt') as fh:
            cert = json.load(fh)
        same_row = cert['actual_row'] == row
        same_tensor = cert['root_boundary_integer_tensor'] == T
        # corner / edge facts
        val00 = co.get((0, 0), fmpq(0))          # P(0,0)
        lead = [co.get((deg[0], j), fmpq(0)) for j in range(deg[1] + 1)]  # far-field coefficient in q
        leaves, depth, strict = adaptive(T)
        # own pair
        num, den = own_pair_poly(row)
        nq, dq = even_to_q(num), even_to_q(den)
        dnum = nq.derivative() * dq - nq * dq.derivative()
        capq = cap
        d0, d1 = dnum(fmpq(0)), dnum(capq)
        den_roots = sturm_count(dq, fmpq(0), capq)
        if d0 != 0 and d1 != 0:
            roots = sturm_count(dnum, fmpq(0), capq)
        else:
            roots = None
        # own tensor vs packet own tensor (univariate; packet stores [[...]])
        oc = {(0, j): c for j, c in enumerate(dnum.coeffs()) if c != 0}
        OT, odeg = bernstein_tensor(oc, cap, fmpq(1))
        same_own = cert['root_own_integer_tensor'] == OT
        rec = dict(row=idx, cap=str(cap), degrees=list(deg), packet_row_equal=same_row,
                   boundary_tensor_equals_packet=same_tensor, own_tensor_equals_packet=same_own,
                   P_at_origin_sign=(1 if val00 > 0 else (0 if val00 == 0 else -1)),
                   own_adaptive_leaves=leaves, own_adaptive_depth=depth, all_leaf_coeffs_strictly_positive=strict,
                   own_derivative_degree=int(dnum.degree()), own_derivative_at_0=float(int(d0.numerator) / int(d0.denominator)) if d0 != 0 else 0.0,
                   own_derivative_sign_at_0=(1 if d0 > 0 else (0 if d0 == 0 else -1)),
                   own_derivative_sign_at_cap=(1 if d1 > 0 else (0 if d1 == 0 else -1)),
                   own_derivative_roots_in_cap=(None if roots is None else int(roots)), own_denominator_roots_in_cap=int(den_roots),
                   own_denominator_sign_at_0=(1 if dq(fmpq(0)) > 0 else -1),
                   seconds=round(time.monotonic() - t0, 2))
        res.append(rec)
        print(json.dumps(rec), flush=True)
    json.dump(res, open(out, 'w'), indent=1)
    ok = all(r['packet_row_equal'] and r['boundary_tensor_equals_packet'] and r['own_tensor_equals_packet']
             and r['own_derivative_roots_in_cap'] == 0 and r['own_derivative_sign_at_0'] == 1
             and r['own_denominator_roots_in_cap'] == 0 for r in res)
    print('SUMMARY rows', len(res), 'all_ok', ok)


if __name__ == '__main__':
    main()
