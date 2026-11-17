#!/usr/bin/env python3
# tm.py <label> <cmd...>: run cmd, print wall/user/sys/maxrss of the child
import sys, subprocess, resource, time
t = time.time(); rc = subprocess.call(sys.argv[2:]); w = time.time() - t
r = resource.getrusage(resource.RUSAGE_CHILDREN)
print(f"TIMING {sys.argv[1]} rc={rc} wall={w:.2f} user={r.ru_utime:.2f} sys={r.ru_stime:.2f} maxrssMB={r.ru_maxrss/1024:.1f}", flush=True)
