# second one-parameter family for combination 2: t -> zeta_lead(t + c) on t >= 0 (n = 1 theta term of zeta, not reflected),
# the conductor rescaling of a leading theta term (c = -(log q)/4).  128-bit balls.
import sys, os, json
from multiprocessing import Pool
import slib, c2

def fam_job(c):
    s2, n = c2.curve('slead%r' % c, 128, 44)
    return c, [float(x.sqrt().asin()) for x in s2], [slib.log10abs(x)/2 for x in s2]

if __name__ == '__main__':
    cs = [round(-1.0 + i/64.0, 6) for i in range(0, 97)]
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as p:
        fam = p.map(fam_job, cs, chunksize=4)
    json.dump([{'c': c, 'theta': th, 'log10sin': ls} for c, th, ls in fam], open(sys.argv[1], 'w'))
