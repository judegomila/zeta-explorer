#!/usr/bin/env python3
"""Verify preservation integrity, not the scientific claims."""
from pathlib import Path
import ast,hashlib,json,re
ROOT=Path(__file__).resolve().parent
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
    m=json.loads((ROOT/'MANIFEST.json').read_text());rows=m['payload_files']
    assert {str(p.relative_to(ROOT)) for p in (ROOT/'src').rglob('*') if p.is_file()}=={r['path'] for r in rows}
    syntax=0
    for r in rows:
        p=ROOT/r['path'];assert p.stat().st_size==r['bytes'] and digest(p)==r['sha256'],r['path']
        if p.suffix=='.py':ast.parse(p.read_text(),filename=r['path']);syntax+=1
    checks=0
    for line in (ROOT/'src/SHA256SUMS').read_text().splitlines():
        h,name=line.split('  ',1);assert digest(ROOT/'src'/name)==h,name;checks+=1
    paths=set()
    for line in (ROOT/'SHA256SUMS').read_text().splitlines():
        h,name=line.split('  ',1);assert digest(ROOT/name)==h,name;paths.add(name)
    assert paths=={str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts}-{'SHA256SUMS'}
    assert 'remain unproved' in m['scope']
    print(json.dumps({'status':'PASS','payload_files':len(rows),'payload_bytes':sum(r['bytes'] for r in rows),'package_files':len(paths)+1,'original_checksum_entries':checks,'python_syntax_files':syntax,'scientific_replay':'not performed'},sort_keys=True))
if __name__=='__main__':main()
