#!/usr/bin/env python3
"""consume.py: route-P consumer (r3-outer-mixed.py, unchanged apart from relocated paths; exact rationals) on certfiles built from the
collect7 `fullref` margins, with the 36 incomplete floors treated according to the independent re-certification results in
run/results.jsonl.  Certfile rule copied from recert_consume.py (b-route-p-recert), which copied it from tmp/routes-b1-r1-merge.py.
Scenarios written to run/values.json:
  base        collect7 as recorded (must reproduce 36249332027817/250000000000000 and certfile sha 3bcc2e9f...)
  drop36      all 36 excluded (must reproduce 7256757887621/50000000000000)
  mixed       floors with a valid independent certificate at the WEAKER (larger) of the two margins; the other floors at campaign margins
  indep_only  floors with a valid independent certificate at the weaker margin; the other floors of the 36 EXCLUDED (r6 fallback)
  strict      only floors whose independent certificate is COMPLETE at the campaign margin are kept; the rest of the 36 excluded
Conditional on the route-P ledger; internal; not a theorem.
usage: consume.py [--selftest]"""
import sys, os, json, math, subprocess, hashlib, time
from fractions import Fraction as F
B = os.path.dirname(os.path.abspath(__file__)); CT = B + '/cons/tmp/'; RUN = B + '/run'; OUT = RUN + '/consume'
G = CT + 'r2-refF-out/corrected_m0023/batch_*.json,' + CT + 'r2-refF-out/corrected_m0023/adapt*/batch_P*.json'
H = json.load(open(B + '/tmp/r6-fiber-out/p47_hybrid.json')); BASE = CT + 'r6-suffix-out/final/cert_r6.json'
M0 = {int(k): v for k, v in json.load(open(B + '/cons/c7/values.json'))['fullref']['margins'].items()}
F36 = {int(k): v for k, v in json.load(open(B + '/floors36.json')).items()}
EXPECT = dict(base='36249332027817/250000000000000', drop36='7256757887621/50000000000000')
SHA_BASE = '3bcc2e9fb13f81cff3f29c75e13faaafbf051ea0a7c65da979127db7e59e9eec'
for i, v in F36.items(): assert M0[i] == v['margin'], i


def sh(m): return F(math.floor((0.0023 - m * (1 + 1e-12)) * 1e13) - 1, 10 ** 13)


def fup(q):
    """smallest-or-equal float >= the exact rational q"""
    f = float(q)
    while F(f) < q: f = math.nextafter(f, math.inf)
    return f


def run(name, M):
    base = json.load(open(BASE)); c = dict(base)
    for i, m in M.items():
        t = H[i]['key'] + '@' + H[i]['file']; s_ = sh(m + 1e-9)
        assert s_ <= F(23, 10000) - F(m) - F(1, 10 ** 9) + F(1, 10 ** 12)
        if t not in c or F(c[t]) < s_: c[t] = str(s_)
    os.makedirs(OUT, exist_ok=True); fn = OUT + '/certfile_%s.json' % name
    json.dump(c, open(fn + '.tmp', 'w'), sort_keys=True); os.replace(fn + '.tmp', fn)
    p = subprocess.run([sys.executable, '-B', CT + 'r3-outer-mixed.py', G, '--cert', fn], capture_output=True, text=True, cwd=B + '/cons')
    open(OUT + '/cons_%s.txt' % name, 'w').write(p.stdout + p.stderr)
    last = p.stdout.strip().split('\n')[-1].split(); assert p.returncode == 0 and last[0] == 'U1_band', (p.returncode, p.stderr[-500:])
    U = F(last[1])
    return dict(name=name, U=last[1], dec=last[2], below_0145=bool(U < F(145, 1000)), gap_to_0145='%.6e' % float(F(145, 1000) - U), floors=len(M),
                sha256=hashlib.sha256(open(fn, 'rb').read()).hexdigest())


def latest():
    L = {}
    fn = RUN + '/results.jsonl'
    if os.path.exists(fn):
        for ln in open(fn):
            ln = ln.strip()
            if ln:
                r = json.loads(ln)
                if r.get('kind') == 'floor': L[r['idx']] = r
    return L


def main():
    t0 = time.time(); os.makedirs(OUT, exist_ok=True); fixed = OUT + '/fixed.json'
    if os.path.exists(fixed) and '--selftest' not in sys.argv: V = json.load(open(fixed))
    else:
        V = dict(base=run('base', dict(M0)), drop36=run('drop36', {i: m for i, m in M0.items() if i not in F36}))
        for k in EXPECT: assert V[k]['U'] == EXPECT[k], (k, V[k])
        assert V['base']['sha256'] == SHA_BASE
        json.dump(V, open(fixed, 'w'), indent=1)
    if '--selftest' in sys.argv:
        print('SELFTEST OK base %s drop36 %s sha_base_ok' % (V['base']['dec'], V['drop36']['dec'])); return
    L = latest(); cert = {}; strict = []
    for i, r in L.items():
        if r.get('valid_certificate'):
            mref = F(r['margin_ref_exact']); mc = F(F36[i]['margin'])
            cert[i] = fup(max(mref, mc)); assert cert[i] >= F36[i]['margin']
            if r['status'] == 'confirmed': assert mref <= mc and cert[i] == F36[i]['margin']; strict.append(i)
    Mm = dict(M0); Mm.update(cert)
    Mi = {i: m for i, m in Mm.items() if i not in F36 or i in cert}
    Ms = {i: m for i, m in M0.items() if i not in F36 or i in strict}
    V['mixed'] = run('mixed', Mm) if cert else dict(V['base'], name='mixed')
    V['indep_only'] = run('indep_only', Mi) if cert else dict(V['drop36'], name='indep_only')
    V['strict'] = run('strict', Ms) if strict else dict(V['drop36'], name='strict')
    V['_meta'] = dict(time=time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime()), certified=sorted(cert), confirmed_at_campaign_margin=sorted(strict),
                      uncertified=sorted(set(F36) - set(cert)), margins_used={str(i): cert[i] for i in sorted(cert)}, secs=time.time() - t0,
                      label='conditional on the route-P ledger; internal; not a theorem')
    json.dump(V, open(RUN + '/values.json.tmp', 'w'), indent=1); os.replace(RUN + '/values.json.tmp', RUN + '/values.json')
    open(RUN + '/values_history.jsonl', 'a').write(json.dumps({k: (v if k == '_meta' else dict(U=v['U'], dec=v['dec'], below_0145=v['below_0145'])) for k, v in V.items()}) + '\n')
    print('VALUES mixed %s indep_only %s strict %s certified %d confirmed %d' % (V['mixed']['dec'], V['indep_only']['dec'], V['strict']['dec'], len(cert), len(strict)))


if __name__ == '__main__':
    main()
