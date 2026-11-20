#!/usr/bin/env python3
"""Verify preserved research bytes and scope, not mathematical theorems."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parent
NAMES = {'README.md', 'FIXED_ROW_STRETCHED_EXPONENTIAL.md', 'DIRECT_HEAD_AND_RELATIVE_COLUMN_OBSTRUCTION.md', 'INDEPENDENT_ANALYTIC_AUDIT.md', 'SHA256SUMS'}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def safe_file(name):
    path = Path(name)
    assert not path.is_absolute() and '..' not in path.parts, name
    full = ROOT / path
    assert full.is_file() and not full.is_symlink(), name
    return full

def main():
    manifest = json.loads((ROOT / 'MANIFEST.json').read_text())
    rows = manifest['payload_files']
    assert len(rows) == manifest['payload_count'] == 5
    assert len({row['path'] for row in rows}) == len(rows)
    assert sum(row['bytes'] for row in rows) == manifest['payload_bytes']
    source_files = {str(p.relative_to(ROOT)) for p in (ROOT / 'src').rglob('*') if p.is_file()}
    assert source_files == {row['path'] for row in rows} == {'src/' + n for n in NAMES}
    for row in rows:
        path = safe_file(row['path'])
        assert path.stat().st_size == row['bytes'], row['path']
        assert digest(path) == row['sha256'], row['path']
        assert row['source_identical'] is True
    originals = set()
    for line in (ROOT / 'src/SHA256SUMS').read_text().splitlines():
        expected, name = line.split('  ', 1)
        assert name not in originals
        assert digest(safe_file('src/' + name)) == expected, name
        originals.add(name)
    assert originals == set(manifest['original_final_payload_files']) == NAMES - {'SHA256SUMS'}
    covered = set()
    for line in (ROOT / 'SHA256SUMS').read_text().splitlines():
        expected, name = line.split('  ', 1)
        assert name not in covered, name
        assert digest(safe_file(name)) == expected, name
        covered.add(name)
    actual = {str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
    assert covered == actual - {'SHA256SUMS'} and len(actual) == 9
    assert 'even with a quasi-polynomial prefactor' in manifest['scope']
    assert 'neither proves nor disproves selected derivative coherence or RH' in manifest['scope']
    print(json.dumps({'status': 'PASS', 'payload_files': len(rows), 'payload_bytes': manifest['payload_bytes'], 'package_files': len(actual), 'original_checksum_entries': len(originals), 'mathematical_proof_verification': 'not performed'}, sort_keys=True))

if __name__ == '__main__':
    main()
