#!/usr/bin/env python3
"""Second-pass checks of lane c15-repair-record-strategy-v4-report (same agent; not an independent referee).
Text and JSON only; no repository module is imported."""
import json, os, re, sys, subprocess, hashlib, collections
ROOT = sys.argv[1]; L = os.path.join(ROOT, 'push', 'c15-repair-record-strategy-v4-report')
R = {}
def rd(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
# 1 map reproducible from before/ with the script; rows
tmp = '/tmp/c15_map_check.md'
subprocess.run([sys.executable, os.path.join(L, 'apply_map.py'), os.path.join(L, 'before', 'OBSTRUCTION_MAP.md'), tmp], check=True, capture_output=True)
R['map_reproduced_from_before'] = open(tmp, encoding='utf-8').read() == rd('push/OBSTRUCTION_MAP.md')
m_old = open(os.path.join(L, 'before', 'OBSTRUCTION_MAP.md'), encoding='utf-8').read(); m_new = rd('push/OBSTRUCTION_MAP.md')
lab = lambda t: re.findall(r'^\| ([PGQSZFTLDO]\d+[a-z]?) \|', t, re.M)
lo, ln = lab(m_old), lab(m_new)
R['rows_before_after'] = [len(lo), len(ln)]; R['rows_added'] = [x for x in ln if x not in lo]; R['rows_removed'] = [x for x in lo if x not in ln]
R['duplicate_labels'] = [k for k, v in collections.Counter(ln).items() if v > 1]
# every old line is either unchanged or one of the edited lines
ol, nl = m_old.split('\n'), set(m_new.split('\n'))
changed = [l for l in ol if l not in nl]
R['old_lines_changed'] = len(changed)
R['old_lines_changed_heads'] = sorted(set(l[:14] for l in changed))
# cells per new row = 6 columns
R['new_row_cells'] = {r: len([c for c in l.strip().strip('|').split(' | ')]) for l in m_new.split('\n') for r in ['G37', 'G38', 'G39', 'G40'] if l.startswith('| %s |' % r)}
R['restriction_markers'] = {str(i): ('restriction %d' % i in m_new or 'restrictions %d' % i in m_new or re.search(r'restrictions? [0-9, to and]*\b%d\b' % i, m_new) is not None) for i in range(1, 14)}
R['E1_not_holding_marked'] = m_new.count('NOT HOLDING') >= 2 and 'c15-klein-transport-lemma-w-stage-a-and-e1' in m_new
# 2 regex
bg = rd('engine/build_graph.py')
pat = re.search(r"^CONTROL_CODE_RE = re\.compile\(r'(.*)'\)$", bg, re.M).group(1)
rx = re.compile(pat)
def codes(s): return sorted(set(m.group(1) for m in rx.finditer(s)))
R['regex'] = dict(pattern=pat, t1=codes('T-NR passes; NR-vec (note) passes; BLS passes; UNIV out of scope; EIS-w passes'),
                  t2=codes('NR-vec passes the orthogonality step'), t3=codes('BLSX UNIVERSAL'), t4=codes('DH, HEAT, U, B'))
old_pat = re.search(r"^CONTROL_CODE_RE = re\.compile\(r'(.*)'\)$", open(os.path.join(ROOT, 'engine/scratch/build_graph.pre-c15-repair.py')).read(), re.M).group(1)
R['regex_lines_changed'] = sum(1 for a, b in zip(bg.split('\n'), open(os.path.join(ROOT, 'engine/scratch/build_graph.pre-c15-repair.py')).read().split('\n')) if a != b)
# 3 numbers quoted in the new rows found in the referee files
src = {k: rd('push/%s/REFEREE.md' % k) for k in ['c14-theta-orthogonal-metaplectic-eigenobject', 'c14-laxphillips-hecke-norm-outside-l2', 'c14-joint-pair-design-ratio-vortex-cross-bridge', 'c14-x2-step-catalogue-zero-indexed-objects', 'c14-prefilter-sweep-geometric-nodes']}
src['r13'] = rd('push/c14-referee-r13-independent/REFEREE.md') + rd('push/c14-referee-r13-independent/RESULT.md')
q = [('c14-theta-orthogonal-metaplectic-eigenobject', ['0.7295', '0.2162', '0.3243', '1 + i pi/ln 2', 'Lemma 1\'']),
     ('c14-laxphillips-hecke-norm-outside-l2', ['0.99990', '9973', '0.499', 'mean-zero']),
     ('c14-joint-pair-design-ratio-vortex-cross-bridge', ['1.4e-8', '[1/2, 4/5]', '0.07', '141', '192']),
     ('c14-x2-step-catalogue-zero-indexed-objects', ['never simple', 'E4', 'Re w = P - 1', 'ARGUED']),
     ('c14-prefilter-sweep-geometric-nodes', ['0.99999', '0.35', 'node 386']),
     ('r13', ['160 of 160', '10,123', '50,999', '51,764', '(0.62, 9.3)', 'alpha^+_(1,1/2)', 'even multiplicity', 'I_aff', 'one normalisation', '-1 < c < -1/2', 'L(1/2, chi) != 0', 'log-concavity'])]
R['quoted_numbers_missing_in_source'] = [(k, x) for k, xs in q for x in xs if x not in src[k]]
R['quoted_numbers_missing_in_map'] = [x for k, xs in q for x in xs if x not in m_new and x not in ('E4', 'ARGUED', 'node 386', '141', '192', 'mean-zero', 'I_aff', 'never simple')]
# 4 lane files of rounds 12-14 not edited by this lane (mtime before the first backup)
t0 = os.path.getmtime(os.path.join(L, 'before', 'OBSTRUCTION_MAP.md'))
late = []
for d in os.listdir(os.path.join(ROOT, 'push')):
    if re.match(r'c1[234]-', d):
        for f in os.listdir(os.path.join(ROOT, 'push', d)):
            p = os.path.join(ROOT, 'push', d, f)
            if os.path.isfile(p) and os.path.getmtime(p) > t0: late.append(d + '/' + f)
R['round12_14_lane_files_modified_after_start'] = late
# 5 engine and scoreboard
dv = json.loads(rd('engine/curated/devices.json'))
R['devices'] = dict(collections.Counter(d['state'] for d in dv['devices'])); R['pending'] = len(dv['pending'])
R['pending_RS_left'] = [p['name'][:20] for p in dv['pending'] if 'RS-' in p['name'][:12]]
g = json.loads(rd('engine/IDEA_GRAPH.json'))['meta']['counts']
R['graph'] = {k: g[k] for k in ('nodes', 'edges', 'rows', 'controls', 'live')}
sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
R['outcomes_json_identical'] = sha(os.path.join(ROOT, 'engine/outcomes.json')) == sha(os.path.join(L, 'before/outcomes.json'))
R['outcomes_dir_identical'] = all(sha(os.path.join(ROOT, 'engine/outcomes', f)) == sha(os.path.join(L, 'before/outcomes', f)) for f in os.listdir(os.path.join(L, 'before/outcomes'))) and set(os.listdir(os.path.join(ROOT, 'engine/outcomes'))) == set(os.listdir(os.path.join(L, 'before/outcomes')))
s0 = json.load(open(os.path.join(L, 'before/scoreboard.json'))); s2 = json.loads(rd('campaign/scoreboard.json'))
R['headline_before_after'] = [s0['A_requirements']['headline'], s2['A_requirements']['headline']]
R['headline_unchanged'] = s0['A_requirements'] == s2['A_requirements']
R['holdrate_before_after'] = [s0['D_reliability']['refereeHoldRate'], s2['D_reliability']['refereeHoldRate']]
R['partD_unchanged'] = s0['D_reliability'] == s2['D_reliability']; R['partB_unchanged'] = s0['B_frontier'] == s2['B_frontier']
R['partC_changed_keys'] = {k: [s0['C_coverage'][k], s2['C_coverage'][k]] for k in s2['C_coverage'] if s0['C_coverage'].get(k) != s2['C_coverage'][k]}
cb = json.load(open(os.path.join(L, 'before/CANDIDATES.json')))['candidates']; ca = json.loads(rd('engine/CANDIDATES.json'))['candidates']
key = lambda x: ([n['id'] for n in x['nodes']], x['score'])
R['top60_keys_scores_order_identical'] = [key(x) for x in cb] == [key(x) for x in ca]
# 6 strategy
st = rd('campaign/STRATEGY.md'); v3 = rd('engine/scratch/STRATEGY.v3.md')
mk = '## Directive from the user, 2026-11-19'
R['strategy'] = dict(title=st.split('\n')[0], sentence='these are the classes on which the record is silent, not leads' in st.lower(),
                     U_rows=[u for u in ['U%d' % i for i in range(1, 9)] if '| %s |' % u in st],
                     directive_section_identical=(st[st.index(mk):] == v3[v3.index(mk):]) if mk in st and mk in v3 else None,
                     v3_title=v3.split('\n')[0], changelog_v4='- v4 (2026-11-19' in st, allocation='**1 explore, 2 repair-and-record**' in st)
# 7 report
rp = rd('campaign/CAMPAIGN_REPORT_R15.md')
R['report'] = dict(headline='**1 of 4**' in rp, figure='0.8748866470' in rp, rh_open='Riemann hypothesis is open' in rp, rows='**202 labelled rows**' in rp,
                   devices='50 closed, 1 floored, 0 open' in rp, statement_o='PROVED 4' in rp and 'ARGUED 6' in rp,
                   words_flagged=[w for w in ['breakthrough', 'novel', 'remarkable', 'we prove', 'state-of-the-art'] if w in rp.lower()])
json.dump(R, open(os.path.join(L, 'ref_checks.json'), 'w'), indent=1)
print(json.dumps(R, indent=1))
