"""Tables for combinations (2) and (3) from out/c2_*.json and out/c3_*.json.  usage: pick_sum.py > out/PICK_SUMMARY.txt"""
import json, glob, os, math
HERE = os.path.dirname(os.path.abspath(__file__))
def fmt(k):
    fn = k['first_negative']; lr = k['log10_rho']
    return '%-10s first_neg %-5s n_neg %-3d undet %-5s determined %-4d log10rho@100 %-9s @200 %-9s @last %-9s' % (
        k['kernel'], fn, k['n_negative'], k['undetermined_at'], k['determined'],
        lr[99] if len(lr) > 99 else '-', lr[199] if len(lr) > 199 else '-', lr[-1] if lr else '-')
print('=== combination (2): strip kernels ===')
for f in sorted(glob.glob(os.path.join(HERE, 'out', 'c2_*.json'))):
    r = json.load(open(f))
    print('\n%s  code %s a=%s rect %s n=%d bits=%d max|S|=%.6f nodes with |S|>1: %d' % (os.path.basename(f), r['code'], r['a'], r['rect'], r['n'], r['bits'], r['max_abs_S'], r['n_abs_S_gt_1']))
    for k in r['kernels']: print('   ' + fmt(k))
    # Y*(n): least listed Y with a negative pivot among the first n
    ys = [(float(k['kernel'].split(':')[1]), k) for k in r['kernels'] if k['kernel'] != 'lin']
    for n in (50, 100, 200, 300, 400):
        if n > r['n']: continue
        bad = [y for y, k in ys if any(o <= n for o in k['negative_orders'])]
        print('   Y*(n=%d) = %s' % (n, min(bad) if bad else 'none in list'))
print('\n=== combination (3): linear kernel (de Branges kernel of E_a up to diagonal congruence) ===')
for f in sorted(glob.glob(os.path.join(HERE, 'out', 'c3_*.json'))):
    r = json.load(open(f))
    if not r['kernels']: continue
    k = r['kernels'][0]; lr = k['log10_rho']
    print('%-34s %-9s a=%-5s T=[%s,%.5g] n=%d bits=%d max|S|=%.6f |S|>1 at %d nodes (first %s) | first_neg %s n_neg %d undet %s determined %d min log10 rho %.1f' % (
        os.path.basename(f), r['code'], r['a'], r['rect'][2], float(r['rect'][3]), r['n'], r['bits'], r['max_abs_S'], r['n_abs_S_gt_1'], r['first_abs_S_gt_1'],
        k['first_negative'], k['n_negative'], k['undetermined_at'], k['determined'], min(lr) if lr else float('nan')))
print('\n=== combination (3): r = 1 - mu_min with K_{a,0} from Phi ===')
for f in sorted(glob.glob(os.path.join(HERE, 'out', 'c3r_*.json'))):
    r = json.load(open(f))
    print(os.path.basename(f), r['code'], 'a=%s T=[%g,%g] max|S|=%.5f' % (r['a'], r['T0'], r['T'], r['max_abs_S']))
    for row in r['rows']: print('    ', row)
