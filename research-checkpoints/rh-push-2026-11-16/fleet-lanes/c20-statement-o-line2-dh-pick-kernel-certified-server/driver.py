import os, sys, json, subprocess
from concurrent.futures import ThreadPoolExecutor
names = sys.argv[1].split(',')
w = int(os.environ.get('RH_WORKERS', '4'))
os.makedirs('out', exist_ok=True)
def go(n):
    with open(f'out/{n}.log', 'w') as f:
        return n, subprocess.call([sys.executable, 'pick2.py', n, 'out'], stdout=f, stderr=subprocess.STDOUT)
with ThreadPoolExecutor(w) as ex:
    for n, rc in ex.map(go, names):
        print(n, 'exit', rc, flush=True)
