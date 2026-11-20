"""Fill RESULT.tmpl.md from the result files (tables are printed by the analysis scripts)."""
import subprocess, sys, os, io, json, contextlib
py = sys.executable
def run(*args):
    return subprocess.run([py, *args], capture_output=True, text=True, env=dict(os.environ, RH_NOGPU='1')).stdout
import c1_summary
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    c1_summary.table('c1n_A.json', 'c1n_D.json', 'Run A: N = 6420 (detection support of offset 3/8 at 3e12)')
    c1_summary.table('c1n_D.json', None, 'Run D: Haar-flow reference for A')
    c1_summary.table('c1n_B.json', 'c1n_D2.json', 'Run B: N = 1.18e6 (detection support of offset 0.2)')
    c1_summary.table('c1n_D2.json', None, 'Run D2: Haar-flow reference for B')
    c1_summary.table('c1n_F.json', 'c1n_F2.json', 'Run F: N = 1e8 (detection support of offset 0.137)')
    c1_summary.table('c1n_F2.json', None, 'Run F2: Haar-flow reference for F')
    c1_summary.table('c1n_C.json', None, 'Run C: full log-derivative coefficients, N = 6420')
    c1_summary.table('c1n_C2.json', None, 'Run C2: full log-derivative coefficients, N = 1.18e6')
    c1_summary.table('c1n_E.json', 'c1n_E2.json', 'Run E: heights 1e6 to 3e8 (below the verified height), N = 6e4')
    c1_summary.table('c1n_E2.json', None, 'Run E2: Haar-flow reference for E')
c1 = buf.getvalue()
rc = []
for f in ('A', 'B', 'F', 'C', 'C2', 'E'):
    fn = f'c1n_{f}_recheck.json'
    if os.path.exists(fn):
        R = json.load(open(fn))
        n = sum(len(c['recheck']) for c in R['recheck'])
        rc.append(f"run {f}: {n} extremes, max difference {R['worst']:.1e} ({R.get('method', '40-digit')})")
c1 += '\nRECHECKED (largest values of LHS - threshold per column, re-evaluated with 40-digit arithmetic, or for more than 3e5 terms with exact 128-bit phases and float64 summation): ' + '; '.join(rc) + '.\n'
c2 = ''
for fn, lab in (('c2_main.json', 'First run (true windows start at x = 4 pi N^2)'), ('c2_more.json', 'Second run (true windows near x = 6.14e12; new seed)'), ('c2_chi.json', 'Third run (L(chi mod 5) against its own Haar flow; zeta rows repeated with a new seed)')):
    if os.path.exists(fn):
        c2 += f'\n{lab}, `{fn}`:\n\n' + run('c2_analyze.py', fn)
c3 = run('c3_analyze.py', 'c3_main.json').split('\n\n')[0]
c4 = run('c4_analyze.py', 'c4_main.json') if os.path.exists('c4_main.json') else '(c4_main.json missing)'
t = open('RESULT.tmpl.md').read()
for k, v in (('@@C1TABLES@@', c1), ('@@C2TABLES@@', c2), ('@@C3TABLE@@', c3), ('@@C4TABLE@@', c4)):
    t = t.replace(k, v.strip('\n'))
for k in ('TABLE1', 'C1READING', 'C4READING', 'UNITS'):
    fn = f'part_{k}.md'
    if os.path.exists(fn):
        t = t.replace(f'@@{k}@@', open(fn).read().strip('\n'))
open('RESULT.md', 'w').write(t)
print('RESULT.md written; unresolved placeholders:', [w for w in ('@@TABLE1@@', '@@C1READING@@', '@@C4READING@@', '@@UNITS@@') if w in t])
