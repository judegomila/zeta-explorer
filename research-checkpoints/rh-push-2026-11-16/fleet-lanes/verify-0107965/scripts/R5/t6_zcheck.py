"""R5: high-precision (python-flint arb, 200 bits, term by term, no bins) recomputation of A, B, D, Z at the
comparison point for chosen (row, height), compared with the stored bounds. Own code; packet JSON read as data."""
import sys, json
from fractions import Fraction as F
from flint import arb, ctx
ctx.prec = 200
PH = sys.argv[1] + '/inputs/source_tree/unconditional_20261020/physical_check/'
N0 = 690988; K = 4096
plan = json.load(open(PH + 'PLAN.json'))['blocks']; nat = json.load(open(PH + 'retained/THERMAL_NATIVE_256_B.json'))['blocks']
av = lambda q: arb(F(q).numerator) / F(q).denominator
for i, hname in [(0, '6'), (0, '2'), (66, None)]:
    blk = plan[i]; tl, tr = av(blk['t_lo']), av(blk['t_hi'])
    recs = nat[i]['height_records']; st = recs[-1] if hname is None else [r for r in recs if r['height'] == hname][0]
    h = av(st['height']); v = arb(N0).log(); L0 = 2 * v; su = (1 + h) / 2 + tl * L0 / 4; sv = su - h
    logs = [arb(0), arb(0)] + [arb(n).log() for n in range(2, N0 + 1)]
    u = [arb(0)] + [(tr * logs[n] ** 2 / 4 - su * logs[n]).exp() for n in range(1, N0 + 1)]
    eul = [(1, 1, arb(0))]
    for p in (2, 3, 5): eul += [(d * p, -s, q + logs[p] ** 2) for d, s, q in list(eul)]
    E = [(d, s * (tr * q / 4 - su * logs[d]).exp()) for d, s, q in eul]
    cw = [arb(0)] * (N0 + 1)
    for d, w in E:
        for m in range(1, N0 // d + 1): cw[d * m] = cw[d * m] + w * u[m]
    csc = [arb(0)] * (N0 + 1); acc = arb(0)
    for m in range(2, N0 + 1):
        acc += cw[m]; csc[m] = acc
    # dtilde at t+ from definition
    b = [arb(0)] + [(tr * logs[n] ** 2 / 4).exp() for n in range(1, K + 1)]
    d_ = [arb(0)] * (K + 1); pend = [arb(0)] * (K + 1)
    for n in range(2, K + 1):
        d_[n] = logs[n] * b[n] - pend[n]
        for m in range(2, K // n + 1): pend[n * m] += d_[n] * b[m]
    dt = list(d_)
    for p in (2, 3, 5):
        q = p; j = 1
        while q <= K:
            dt[q] = dt[q] - logs[p] * (tr * j * logs[p] ** 2 / 4).exp(); q *= p; j += 1
        dt[p] = arb(0)
    D = arb(0); Z = arb(0)
    for k in range(2, K + 1):
        qk = dt[k] * (-su * logs[k]).exp(); D += qk; Z += qk * csc[N0 // k]
    P = sum((abs(w) for d, w in E), arb(0)); P1 = sum((abs(w) * logs[d] for d, w in E), arb(0))
    Ahead = csc[N0]; Bhead = sum((cw[m] * logs[m] for m in range(2, N0 + 1)), arb(0))
    su_all = sum(u[1:], arb(0)); sul = sum((u[n] * logs[n] for n in range(1, N0 + 1)), arb(0))
    pre = {}; a1 = arb(0); a2 = arb(0); need_at = {N0 // d for d, w in E}
    for n in range(1, N0 + 1):
        a1 += u[n]; a2 += u[n] * logs[n]
        if n in need_at: pre[n] = (a1, a2)
    ov = arb(0); ovB = arb(0)
    for d, w in E:
        m = N0 // d; ov += abs(w) * (su_all - pre[m][0]); ovB += abs(w) * ((sul - pre[m][1]) + logs[d] * (su_all - pre[m][0]))
    rv = arb(0); rd = arb(0)
    for n in range(1, N0 + 1):
        r = (tr * logs[n] ** 2 / 4 - sv * logs[n]).exp(); rv += r; rd += r * (L0 - logs[n])
    eh = (-h * L0 / 2).exp()
    A = Ahead + ov + eh * P * rv; B = Bhead + ovB + eh * (P * rd + P1 * rv)
    print('row', i, 'height', st['height'], 't-,t+ =', blk['t_lo'], blk['t_hi'])
    for name, val, key, up in (('A', A, 'prefix_A_upper', True), ('B', B, 'prefix_B_upper', True), ('D', D, 'D_upper', True), ('D', D, 'D_match_lower', False), ('Z', Z, 'overlap_Z_match_lower', False), ('P', P, 'Euler_norm_upper', True), ('P1', P1, 'Euler_log_moment_upper', True)):
        s = av(st[key]); ok = (s > val) if up else (s < val)
        print('   %-3s own = %s   stored %-24s = %s   stored on the safe side: %s   (stored-own)/own = %s' % (name, val.str(25), key, s.str(25), ok, ((s - val) / val).str(5)))
    print('   R* = B-(1-A)D-2Z from own values:', (B - (1 - A) * D - 2 * Z).str(15), ' from stored bounds:', (av(st['prefix_B_upper']) - (1 - av(st['prefix_A_upper'])) * av(st['D_match_lower']) - 2 * av(st['overlap_Z_match_lower'])).str(15), flush=True)
