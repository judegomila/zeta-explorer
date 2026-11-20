#!/usr/bin/env python3
"""Verify this frozen research package without executing its scientific sources."""
from pathlib import Path
import ast, hashlib, json, re
ROOT = Path(__file__).resolve().parent
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
    manifest=json.loads((ROOT/'MANIFEST.json').read_text())
    rows=manifest['payload_files']; expected={r['path'] for r in rows}
    actual={str(p.relative_to(ROOT)) for p in (ROOT/'src').rglob('*') if p.is_file()}
    assert actual==expected, 'Source allowlist mismatch'
    syntax=0; original_checks=0
    for row in rows:
        p=ROOT/row['path']; assert p.stat().st_size==row['bytes'] and digest(p)==row['sha256'], row['path']
        if p.suffix=='.py': ast.parse(p.read_text(), filename=row['path']); syntax+=1
        if p.name=='SHA256SUMS':
            for line in p.read_text().splitlines():
                match=re.fullmatch(r'([0-9a-f]{64})  (.+)',line); assert match, line
                assert digest(p.parent/match[2])==match[1], match[2]; original_checks+=1
    bound=set()
    for line in (ROOT/'SHA256SUMS').read_text().splitlines():
        match=re.fullmatch(r'([0-9a-f]{64})  (.+)',line); assert match, line
        assert digest(ROOT/match[2])==match[1], match[2]; bound.add(match[2])
    all_files={str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
    assert bound==all_files-{'SHA256SUMS'}, 'Package checksum coverage mismatch'
    assert 'remain open' in manifest['scope'] and 'RH conclusion' in manifest['scope']
    print(json.dumps({'status':'PASS','payload_files':len(rows),'payload_bytes':sum(r['bytes'] for r in rows),'package_files':len(all_files),'original_checksum_entries':original_checks,'python_syntax_files':syntax,'scientific_replay':'not performed by this integrity verifier'},sort_keys=True))
if __name__=='__main__': main()
