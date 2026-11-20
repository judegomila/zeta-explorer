import json, sys, glob
for f in sys.argv[1:]:
    print('##', f)
    for l in open(f):
        r = json.loads(l)
        print('%-4s %-4s %-5d %-36s H0 %-5g n %-4d decided %-4d index %-2d first %-16s minpiv %s' % (r['mode'], r['mesh'], r['bits'], r['code'][:36], r['H0'], r['n'], r['decided_up_to'], r['index'], r['first_negative'], r['min_log2_pivot']))
