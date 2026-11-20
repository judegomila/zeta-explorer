# usage: runq.py <queue.txt> <workers> <memGB>
# Memory-aware task scheduler (one unit, one queue).  Queue line:  <estimated GB> <shell command>
# Starts tasks in file order, first-fit, while (#running < workers) and (sum of estimates + new <= memGB).  The queue file is re-read
# every 4 s, so lines appended later are picked up.  Tasks are resumable by themselves (each skips finished work).
# A file named STOP in the working directory ends the scheduler after terminating its own children.
import sys, os, time, subprocess, shlex
qf, W, MEM = sys.argv[1], int(sys.argv[2]), float(sys.argv[3])
done = set(); running = {}
os.makedirs('qlogs', exist_ok=True)
def say(m): print(time.strftime('%H:%M:%S'), m, flush=True)
idle = 0
while True:
    if os.path.exists('STOP'):
        for p, _ in running.values(): p.terminate()
        say('STOP file found; children terminated'); break
    for line in list(running):
        p, (t0, mem) = running[line]
        rc = p.poll()
        if rc is not None:
            say('END rc=%s %.0fs :: %s' % (rc, time.time()-t0, line)); del running[line]; done.add(line)
    lines = [l.strip() for l in open(qf) if l.strip() and not l.startswith('#')]
    pending = [l for l in lines if l not in done and l not in running]
    used = sum(m for _, (_, m) in running.values())
    for l in pending:
        if len(running) >= W: break
        mem, cmd = l.split(None, 1); mem = float(mem)
        if used + mem > MEM and running: continue
        idx = lines.index(l)
        lf = open('qlogs/task%04d.log' % idx, 'a')
        p = subprocess.Popen(cmd, shell=True, stdout=lf, stderr=subprocess.STDOUT)
        running[l] = (p, (time.time(), mem)); used += mem
        say('START est %.1f GB (running %d, est total %.1f GB) :: %s' % (mem, len(running), used, cmd))
    if not running and not pending:
        idle += 1
        if idle == 1: say('queue empty; waiting for appended lines')
    else: idle = 0
    time.sleep(4)
