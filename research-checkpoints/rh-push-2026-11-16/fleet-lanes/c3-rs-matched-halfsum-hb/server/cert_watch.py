"""Certify res_*.json files as they appear; stop when DONE_<jobset> exists and all are certified."""
import sys, os, glob, time, subprocess
js = sys.argv[1]; skip = ('smooth', '-x', 'rand')
while True:
    todo = [f for f in sorted(glob.glob('res_*.json'), key=os.path.getmtime) if not any(k in f for k in skip) and not os.path.exists('cert_' + f[4:])]
    if not todo:
        if os.path.exists(f'DONE_{js}'): break
        time.sleep(30); continue
    f = todo[0]; time.sleep(3)
    subprocess.run([sys.executable, 'certify.py', f, 'cert_' + f[4:] + '.tmp'], check=False)
    if os.path.exists('cert_' + f[4:] + '.tmp'): os.rename('cert_' + f[4:] + '.tmp', 'cert_' + f[4:])
    else: open('cert_' + f[4:], 'w').write('{"error": "certify failed"}')
print('cert_watch done')
