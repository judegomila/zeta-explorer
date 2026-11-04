#!/usr/bin/env python3
"""Verify preservation integrity, not mathematical proofs."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parent
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
    m=json.loads((ROOT/'MANIFEST.json').read_text());rows=m['payload_files']
    assert {str(p.relative_to(ROOT)) for p in (ROOT/'src').rglob('*') if p.is_file()}=={r['path'] for r in rows}
    for r in rows:
        p=ROOT/r['path'];assert p.stat().st_size==r['bytes'] and digest(p)==r['sha256'],r['path']
    original=0
    for line in (ROOT/'src/SHA256SUMS').read_text().splitlines():
        h,name=line.split('  ',1);assert digest(ROOT/'src'/name)==h,name;original+=1
    names=set()
    for line in (ROOT/'SHA256SUMS').read_text().splitlines():
        h,name=line.split('  ',1);assert digest(ROOT/name)==h,name;names.add(name)
    assert names=={str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts}-{'SHA256SUMS'}
    assert 'remain open' in m['scope'] and 'not claims about actual arithmetic remainders' in m['scope']
    print(json.dumps({'status':'PASS','payload_files':len(rows),'payload_bytes':sum(r['bytes'] for r in rows),'package_files':len(names)+1,'original_checksum_entries':original,'mathematical_proof_verification':'not performed'},sort_keys=True))
if __name__=='__main__':main()
