import mpmath as mp
from aligned import Lxi, Ldh, mineig
mp.mp.dps = 80
a = mp.mpf('0.55')
def run(tag, ts):
    nodes = [a + 1j*mp.mpf(t) for t in ts]
    print(tag, 'n', len(ts), 'xi', mineig(Lxi, nodes), 'DH', mineig(Ldh, nodes), flush=True)
al = sorted([9.0647*9, 9.0647*10, 5.7192*14, 5.7192*15, 5.7192*16, 3.9040*20, 3.9040*21, 3.9040*22, 3.9040*23, 3.9040*24])
print([round(t,2) for t in al])
run('aligned p<=5 (approx)', al)
run('aligned shifted +2.0 ', [t+2.0 for t in al])
run('aligned shifted -3.0 ', [t-3.0 for t in al])
run('close pair at zero only', [85.6, 85.8])
run('triple at zero', [85.5, 85.7, 85.9])
run('pair away', [80.0, 80.2])
run('uniform14 + pair at zero', [75+21*i/13 for i in range(14)] + [85.65, 85.75])
