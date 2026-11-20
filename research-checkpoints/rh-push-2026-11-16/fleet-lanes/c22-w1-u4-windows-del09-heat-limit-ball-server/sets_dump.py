# Writes the explicit sets S (greedy floor rule of round 21) for primes <= PMAX and their sha256; compares with a ball-run record.
import sys, json, math, hashlib
rec = json.load(open(sys.argv[1]))['sets']; PMAX = int(sys.argv[2])
def sieve(N):
    s = bytearray([1])*(N+1); s[0] = s[1] = 0
    for i in range(2, int(N**0.5)+1):
        if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
    return [i for i in range(N+1) if s[i]]
PR = sieve(PMAX)
def greedy(b, half):
    Lval = 0.0; prev = 2.0; c = 0; S = []
    def seg(x0, x1, n=8):
        h = (x1-x0)/n; return sum(((x0+(i+.5)*h)**(b-1))/math.log(x0+(i+.5)*h) for i in range(n))*h
    for p in PR[1:]:
        Lval += seg(prev, float(p)); prev = float(p)
        tgt = math.floor(Lval/2) if half else math.floor(Lval)
        if tgt > c: c += 1; S.append(p)
    return S
out = {}
for nm, (b, half) in {'DEL b=0.55': (0.55, False), 'DEL b=0.75': (0.75, False), 'DEL b=0.9': (0.9, False), 'THIN b=0.75': (0.75, True)}.items():
    S = greedy(b, half); sha = hashlib.sha256((','.join(map(str, S))).encode()).hexdigest()
    out[nm] = dict(PMAX=PMAX, size=len(S), sha256=sha, equals_server_record=bool(sha == rec[nm]['sha256']), members=S)
    print(nm, len(S), sha, sha == rec[nm]['sha256'])
json.dump(out, open(sys.argv[3], 'w'))
