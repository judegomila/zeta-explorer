# Confirm isolating intervals by independent Riemann-Siegel signs (zsign outputs zs_*.out, zsB_*.out) + parity pattern
# sign Z(b_i) = (-1)^(i-1)  (N(b_i) = i).  Ranges: (T1, T2] = indices ...939370..955440, and ...38814..60598.
def key(m, e):
    m = int(m); e = int(e)
    while m % 2 == 0 and m != 0: m //= 2; e += 1
    return (m, e)
sg = {}
for pat in ['zs_%d.out', 'zsB_%d.out']:
    for j in range(4):
        for line in open(pat % j):
            lab, s = line.split()[:2]; m, e = lab.split('_'); sg[(int(m), int(e))] = int(s)
iv = {}
for line in open('V1_fix_t1_p128_m2500_b520.iv.txt'):
    idx, ch, ma, ea, mb, eb = line.split(); iv[int(idx)] = (key(ma, ea), key(mb, eb))
for lo, hi in [(33328427939370, 33328427955440), (33328427938814, 33328427960598)]:
    ok = sum(1 for i in range(lo, hi + 1) if sg[iv[i][0]] * sg[iv[i][1]] == -1 and sg[iv[i][1]] == (1 if (i-1) % 2 == 0 else -1))
    print(f"indices {lo}..{hi}: {hi-lo+1} intervals, RS-confirmed sign changes with parity pattern: {ok}")
