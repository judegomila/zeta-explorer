#!/usr/bin/env python3
"""Verify preserved research bytes and scope, not mathematical theorems."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parent

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
    assert len(rows) == manifest['payload_count'] == 14
    assert len({row['path'] for row in rows}) == len(rows)
    assert sum(row['bytes'] for row in rows) == manifest['payload_bytes']
    original_entries = 0
    expected_payloads = set()
    for package in manifest['source_packages']:
        folder = ROOT / package['path']
        assert {str(p.relative_to(folder)) for p in folder.rglob('*') if p.is_file()} == set(package['files'])
        expected_payloads.update(package['path'] + '/' + name for name in package['files'])
        checked = set()
        for line in (folder / 'SHA256SUMS').read_text().splitlines():
            expected, name = line.split('  ', 1)
            assert name not in checked
            assert digest(safe_file(package['path'] + '/' + name)) == expected, name
            checked.add(name)
        assert checked == set(package['original_checksum_entries'])
        assert checked == set(package['files']) - {'SHA256SUMS'}
        original_entries += len(checked)
        assert not set(package['excluded_working_snapshots']) & set(package['files'])
    assert original_entries == 12
    assert expected_payloads == {row['path'] for row in rows}
    for row in rows:
        path = safe_file(row['path'])
        assert path.stat().st_size == row['bytes'], row['path']
        assert digest(path) == row['sha256'], row['path']
        assert row['source_identical'] is True
    covered = set()
    for line in (ROOT / 'SHA256SUMS').read_text().splitlines():
        expected, name = line.split('  ', 1)
        assert name not in covered, name
        assert digest(safe_file(name)) == expected, name
        covered.add(name)
    actual = {str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
    assert covered == actual - {'SHA256SUMS'}
    assert len(actual) == 18
    assert not any('DRAFT' in name or 'WKB_ROUTE' in name for name in actual)
    assert 'All-degree actual-theta norm comparison' in manifest['scope']
    assert 'not selected derivative coherence' in manifest['scope'] and 'RH closure' in manifest['scope']
    print(json.dumps({'status': 'PASS', 'payload_files': len(rows), 'payload_bytes': manifest['payload_bytes'], 'package_files': len(actual), 'original_checksum_entries': original_entries, 'excluded_working_snapshots': 2, 'mathematical_proof_verification': 'not performed'}, sort_keys=True))

if __name__ == '__main__':
    main()
