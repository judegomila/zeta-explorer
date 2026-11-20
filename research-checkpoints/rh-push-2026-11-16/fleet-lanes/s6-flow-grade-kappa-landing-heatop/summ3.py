import sys, json
for f in sys.argv[1:]:
    d = json.load(open(f)); print('%s  P=%g prime powers %d' % (f, d['P'], d['prime_powers']))
    print('   %-16s %-10s %-4s %-9s %-9s %-9s %-19s %-9s %-9s %-9s' % ('object', 'x0', 'c', '|dM_0|', '|dF/F|', '|dM_-0.1|', 'Burgers defect/scale', '|dM_+0.1|', 'strip part', 'prime-trunc'))
    for r in d['rows']:
        print('   %-16s %-10.6g %-4.1f %-9.2e %-9.2e %-9.2e %-8.1e / %-8.1e %-9s %-9s %-9s' % (r['obj'], r['x0'], r['c'], r['M0_abs_diff'], r['logF_abs_diff'], r['Mneg_abs_diff'], r['burgers_defect_prime'], r['burgers_scale_prime'],
              ('%.2e' % r['Mpos_prime_vs_direct']) if 'Mpos_prime_vs_direct' in r else '-', ('%.2e' % r['Mpos_strip_part']) if 'Mpos_strip_part' in r else '-', ('%.2e' % r['Mpos_prime_vs_truncated_direct']) if 'Mpos_prime_vs_truncated_direct' in r else '-'))
