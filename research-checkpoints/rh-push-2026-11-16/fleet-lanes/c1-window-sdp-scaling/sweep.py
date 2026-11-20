"""Driver: LP sweep over T, L/L*, function.  usage: sweep.py nworkers"""
import os, sys
os.environ['OMP_NUM_THREADS'] = '1'; os.environ['OPENBLAS_NUM_THREADS'] = '1'
from multiprocessing import Pool
import ef_lp
def job(a):
    T, fac, func = a
    try: ef_lp.run(T, fac, func); return (a, 'ok')
    except Exception as e: return (a, repr(e))
if __name__ == '__main__':
    tasks = [(T, fac, func) for func in ('zeta', 'twist', 'liou', 'Ea') for T in (1e6, 1e5, 1e4, 1e3, 1e2) for fac in (2, 1, 0.5, 0.25)]
    print('tasks', len(tasks), 'planned peak per worker: KF <= 78 x 367521 x 8 B = 0.23 GB, LP matrix <= 2 x 0.23 GB; workers', sys.argv[1], flush=True)
    with Pool(int(sys.argv[1])) as p:
        for r in p.imap_unordered(job, tasks, chunksize=1): print('DONE', r, flush=True)
