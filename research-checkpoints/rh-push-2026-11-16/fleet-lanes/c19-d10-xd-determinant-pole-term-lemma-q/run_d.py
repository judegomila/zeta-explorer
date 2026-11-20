import sys, os, json, time
from multiprocessing import Pool
from campaign import tasks, predict, work
if __name__ == '__main__':
    ds = [int(x) for x in sys.argv[2].split(',')]; skip = set(int(x) for x in sys.argv[3].split(',')) if len(sys.argv) > 3 and sys.argv[3] else set()
    T = [t for t in tasks() if predict([tuple(s) for s in t['specs']])['d'] in ds and t['id'] not in skip and t['kind'] == 'sym']
    print('tasks', len(T), flush=True); t0 = time.time()
    with Pool(int(os.environ.get('RH_WORKERS', '6'))) as P, open(sys.argv[1], 'w') as f:
        for r in P.imap_unordered(work, T, chunksize=1):
            f.write(json.dumps(r)+'\n'); f.flush(); print(r['id'], r.get('rank'), r.get('pos'), r.get('neg'), r.get('t'), round(time.time()-t0), flush=True)
