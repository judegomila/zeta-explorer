"""s5 combination 3: margins h_m = 1 - log c_m / log Q_m from the partial Euler products (out/t3_*.txt).
log Q_m = m log N + sum_{j=0}^{m} log(1 + |(m - 2j) kappa / 2|), kappa = k - 1 (the conductor function of imp-2437/imp-2459, with the level term added)."""
import json, math, sys, glob, os
def logQ(m, kappa, N): return m * math.log(N) + sum(math.log(1 + abs((m - 2 * j) * kappa / 2)) for j in range(m + 1))
def load(f):
    rows = []
    for l in open(f):
        p = l.split(); rows.append((float(p[0]), [float(v) for v in p[2:]]))
    return rows
SEQ = [('delta', 'out/t3_delta_60000000.txt', 11, 1, 'Delta (level 1, weight 12)'), ('f11', 'out/t3_f11_60000000.txt', 1, 11, 'newform 11a (weight 2)'),
       ('cm', 'out/t3_cm.txt', 1, 32, 'CM newform of level 32 (weight 2)'), ('st1', 'out/t3_st_1.txt', 11, 1, 'Sato-Tate random angles, seed 1'),
       ('st2', 'out/t3_st_2.txt', 11, 1, 'Sato-Tate random angles, seed 2'), ('st3', 'out/t3_st_3.txt', 11, 1, 'Sato-Tate random angles, seed 3'),
       ('cmr', 'out/t3_cmr_1.txt', 1, 32, 'random CM-type angles'), ('uni', 'out/t3_uni_1.txt', 11, 1, 'uniform random angles'),
       ('lin', 'out/t3_lin_60000000.txt', 11, 1, 'x_p = (x_p(Delta) + x_p(11a))/2')]
out = {}
for key, f, kap, N, desc in SEQ:
    r = load(f); P, S = r[-1]
    # previous checkpoint a factor >= 5 below
    prev = [x for x in r if x[0] <= P / 5][-1]; mid = [x for x in r if x[0] <= P / 25][-1]
    lc = [sum(S[:m]) for m in range(1, 11)]; lcp = [sum(prev[1][:m]) for m in range(1, 11)]
    h = [1 - lc[m - 1] / logQ(m, kap, N) for m in range(1, 11)]; hp = [1 - lcp[m - 1] / logQ(m, kap, N) for m in range(1, 11)]
    drift = [S[j] - prev[1][j] for j in range(10)]; drift0 = [prev[1][j] - mid[1][j] for j in range(10)]
    dll = math.log(math.log(P)) - math.log(math.log(prev[0]))
    out[key] = {'desc': desc, 'P': P, 'P_prev': prev[0], 'logL': S, 'log_c_m': lc, 'logQ_m': [logQ(m, kap, N) for m in range(1, 11)], 'h_m': h, 'h_m_prev': hp,
                'drift_last_step': drift, 'drift_per_loglog': [d / dll for d in drift], 'drift_prev_step': drift0}
    print('%-6s %s  P = %.0e' % (key, desc, P))
    print('   log L(1, sym^2j), j=1..10 :', ' '.join('%+.4f' % v for v in S))
    print('   change from P = %.0e      :' % prev[0], ' '.join('%+.1e' % v for v in drift))
    print('   change / change of loglog P:', ' '.join('%+.3f' % (v / dll) for v in drift))
    print('   h_m, m=1..10              :', ' '.join('%+.4f' % v for v in h))
json.dump(out, open('out/t3_margins.json', 'w'), indent=1)
