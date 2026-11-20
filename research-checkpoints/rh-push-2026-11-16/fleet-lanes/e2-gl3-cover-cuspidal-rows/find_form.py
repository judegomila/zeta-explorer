# Search for the genus mate of Q1 = (2x+z)^2 + 11 y^2 + 11 z^2 (Gross: trace-zero part of Z + 2R, R maximal
# order in the quaternion algebra ramified at 11 and infinity). Exact integers. Largest array: 8 * 2001 bytes.
import itertools, math
N = 400
def theta(a,b,c,r,s,t,N):
    # Q = a x^2 + b y^2 + c z^2 + r yz + s xz + t xy ; brute force box
    cnt = [0]*(N+1)
    B = int(math.isqrt(4*N))+2
    for x in range(-B,B+1):
        for y in range(-B,B+1):
            base = a*x*x + b*y*y + t*x*y
            for z in range(-B,B+1):
                v = base + c*z*z + r*y*z + s*x*z
                if 0 <= v <= N: cnt[v]+=1
    return cnt
Q1 = (4,11,12,0,4,0)
def disc(a,b,c,r,s,t): return 4*a*b*c + r*s*t - a*r*r - b*s*s - c*t*t
print("disc Q1", disc(*Q1))
cands=[]
for a in range(1,13):
    for b in range(a,60):
        for t in range(-a,a+1):
            for s in range(-a,a+1):
                for r in range(-b,b+1):
                    den = 4*a*b - t*t
                    if den<=0: continue
                    num = 1936 - r*s*t + a*r*r + b*s*s
                    if num % den: continue
                    c = num//den
                    if c < b: continue
                    # positive definiteness: a>0, den>0, disc>0 ok
                    cands.append((a,b,c,r,s,t))
print("candidates", len(cands))
Nsmall=60
import functools
def theta_small(f): return tuple(theta(*f,Nsmall))
t1 = theta_small(Q1)
seen={}
for f in cands:
    th = theta_small(f)
    if th in seen: continue
    seen[th]=f
print("distinct theta series", len(seen))
for th,f in seen.items():
    diff=[th[i]-t1[i] for i in range(Nsmall+1)]
    plus = all(diff[n]==0 for n in range(Nsmall+1) if n%4 in (1,2))
    plusself = all(th[n]==0 for n in range(Nsmall+1) if n%4 in (1,2))
    if plusself:
        print(f, "theta", th[:25], "half diff", [d/2 for d in diff[:25]])
