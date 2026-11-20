#!/usr/bin/env python3
"""Verify preserved research bytes and scope, not mathematical theorems."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parent
NAMES = {'README.md', 'ACTUAL_XI_LAGUERRE_SOURCE_AUDIT.md',
         'ACTUAL_THETA_PAIR_CAPACITY_TEST.md', 'VALLEY_MODEL_RETAINS_SUBEXPONENTIAL_COMPARISON.md',
         'SPARSE_MULTIPLIER_REFERENCE_COMPARISON_AUDIT.md', 'ZERO_SURGERY_PRESERVES_SHARP_REFERENCE_BOUNDS.md',
         'ZERO_PAIR_REPLACEMENT_INDEPENDENT_AUDIT.md', 'SHA256SUMS'}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def safe_file(name):
    path = Path(name)
    assert not path.is_absolute() and '..' not in path.parts, name
    full = ROOT / path
    assert full.is_file() and not full.is_symlink(), name
    assert not any(p.is_symlink() for p in full.parents if p != ROOT.parent), name
    return full

def main():
    manifest = json.loads((ROOT / 'MANIFEST.json').read_text())
    rows = manifest['payload_files']
    assert len(rows) == manifest['payload_count'] == 8
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
    assert covered == actual - {'SHA256SUMS'} and len(actual) == 12
    assert manifest['redactions'] == []
    assert 'audited non-theta countermodels' in manifest['scope']
    assert 'Actual-theta capacity tails' in manifest['scope']
    assert 'RH remain unproved' in manifest['scope']
    print(json.dumps({'status': 'PASS', 'payload_files': len(rows),
                      'payload_bytes': manifest['payload_bytes'], 'package_files': len(actual),
                      'original_checksum_entries': len(originals),
                      'mathematical_proof_verification': 'not performed'}, sort_keys=True))

if __name__ == '__main__':
    main()
