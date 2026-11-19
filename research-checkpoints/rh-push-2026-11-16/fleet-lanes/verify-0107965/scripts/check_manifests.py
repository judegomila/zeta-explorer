"""Own integrity check (stdlib only; reads packet files as data, executes none of them).
Usage: python3 -I check_manifests.py <packet_dir>"""
import sys, json, hashlib, zipfile
from pathlib import Path
from fractions import Fraction as F
P = Path(sys.argv[1])
def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''): h.update(b)
    return h.hexdigest()
out = {}
# 1. Release_Manifest.json vs downloaded Zenodo files
man = json.loads((P/'zenodo/Release_Manifest.json').read_text())
bad = [n for n, r in man['files'].items() if not (P/'zenodo'/n).is_file() or (P/'zenodo'/n).stat().st_size != r['bytes'] or sha(P/'zenodo'/n) != r['sha256']]
out['release_manifest_files'] = len(man['files']); out['release_manifest_bad'] = bad
# 2. BUNDLE_MANIFEST.json inside Proof_and_Replay
root = P/'replay/Proof_and_Replay/Lambda_Peer_Review'
bm = json.loads((root/'BUNDLE_MANIFEST.json').read_text())
names = set(); badb = []; total = 0
for r in bm['files']:
    p = root/r['path']; names.add(r['path'])
    if '..' in Path(r['path']).parts or not p.is_file() or p.is_symlink() or p.stat().st_size != r['bytes'] or sha(p) != r['sha256']:
        badb.append(r['path'])
    total += r['bytes']
actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
out['bundle_manifest_files'] = len(names); out['bundle_manifest_bad'] = badb
out['bundle_unlisted'] = sorted(actual - names - {'BUNDLE_MANIFEST.json'})[:20]
out['bundle_missing'] = sorted(names - actual)[:20]
out['bundle_count_matches'] = (len(names) == bm.get('file_count')); out['bundle_bytes_match'] = (total == bm.get('total_bytes'))
# 3. the three operational inputs named in the paper
ws = root/'inputs/workspace'
want = {'lambda_round14/material/m8_late/M8_LATE_PLAN.json': 'ec346b7c1136eda38021eb6323033b3b48ed21e6f7458eeeac7cc9579db2497a',
        'lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json': 'b59905d7b994d3424ba14f9347be75a2429ae4d4b0de2c2404971ffda1d4d536',
        'lambda_round16/ordinary_7_8_flow/full_flow/FLOW.json.gz': 'a664e829a3681d96e474bcf875d80cba7b16fe8f65e050c69f01b5ea07de4737',
        }
out['paper_input_hashes_ok'] = {k: sha(ws/k) == v for k, v in want.items()}
out['direct_source_checker_hash_ok'] = sha(root/'verification/direct_source/verify_direct_source.py') == 'a0e8cca86919957d82b714413adc4cc967a32aee94c8b521554d6d2a8a01ce19'
# 4. scientific checker identities and manuscript source identity
tex = [P/'zenodo/Unconditional_0107965.tex', P/'hexsrc/Unconditional_0107965.tex', P/'msrc/Manuscript_Sources/Unconditional_0107965.tex', P/'repo/deposit/Unconditional_0107965.tex']
out['tex_sha256'] = sorted({sha(t) for t in tex})
# 5. exact endpoint arithmetic
T = F(22101, 204800); q = F(7902377963830536747158643, 2**96)
B = F(427693072077942473661578098491, 3961408125713216879677197516800)
out['T_plus_qT_over_2_equals_Bstar'] = (T + q/2 == B)
out['Bstar_lt_headline'] = (B < F(107964910079, 10**12)); out['headline_minus_Bstar_lt_1e-12'] = (F(107964910079, 10**12) - B < F(1, 10**12))
out['Bstar_float'] = float(B)
out['Q0'] = str(F(9,16) + F(1, 10**12))
out['PT_clearance'] = 3000175332800 - (6000000185827 + 1)//2
print(json.dumps(out, indent=1))
