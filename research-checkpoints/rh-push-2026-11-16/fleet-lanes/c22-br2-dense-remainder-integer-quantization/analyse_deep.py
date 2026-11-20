import json, statistics, math, os
L2 = math.log(2)
for tag, base in (('b075', 'out/gpu_b075_plus.json'), ('b050', 'out/gpu_b050_plus.json')):
    f = 'out/gpu_%s_plus_deep.json' % tag
    if not os.path.exists(f): continue
    d = json.load(open(f)); b = json.load(open(base))
    ys = {j: b['y'][i] for i, j in enumerate(b['js'])}
    for i, j in enumerate(d['js']):
        if d['done'][i]:
            if j in ys: print(tag, 'overlap j=%d: max |deep - first run| = %.2e' % (j, max(abs(x - y) for x, y in zip(d['y'][i], ys[j]))))
            ys[j] = d['y'][i]
    print(tag, 'deep run: k_done %.3e, secs %.0f, depths final:' % (d['k_done'], d['secs']), [j for i, j in enumerate(d['js']) if d['done'][i]])
    H = b['heights']; groups = {}
    for h, x in enumerate(H): groups.setdefault(x[0], []).append(h)
    for g, idx in groups.items():
        for j in sorted(ys)[-4:]:
            v = [ys[j][h] for h in idx]
            line = '  %s %-4s j=%2d  min %10.2f med %10.2f max %10.2f sd %9.2f' % (tag, g, j, min(v), statistics.median(v), max(v), statistics.pstdev(v))
            if j - 1 in ys:
                ne = [(ys[j][h] - ys[j - 1][h]) / (-L2) for h in idx]
                line += '  n_eff med %8.2f min %8.2f max %8.2f' % (statistics.median(ne), min(ne), max(ne))
            print(line)
    for h in groups['rat'][:6]:
        print('   ', tag, 'a/b = %d/%d' % (H[h][1], H[h][2]), ' '.join('j=%d: %.2f' % (j, ys[j][h]) for j in sorted(ys)[-4:]))
