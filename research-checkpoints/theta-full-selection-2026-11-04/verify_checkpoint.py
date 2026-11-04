#!/usr/bin/env python3
"""Verify preservation integrity and scope, not mathematical proofs."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parent
NAMES = ['README.md', 'ARITHMETIC_FREQUENCY_SEPARATION.md', 'FIXED_BAND_ARITHMETIC_INDEPENDENT_AUDIT.md', 'EXACT_GCD_ENDPOINT_SELECTION.md', 'EXACT_GCD_ENDPOINT_SELECTION_AUDIT.md', 'FULL_GRAM_DETERMINANT_INVESTIGATION.md', 'QUANTITATIVE_PERIOD_SPECTRAL_COUNT.md', 'AUDIT.md', 'SHA256SUMS']
REQUIRED_SCOPE = 'The actual full-selected upper bound and RH remain unproved.'

def require(condition, message):
    if not condition:
        raise RuntimeError(message)

def safe_file(name):
    path = Path(name)
    require(not path.is_absolute() and '..' not in path.parts, 'Unsafe path: ' + name)
    full = ROOT / path
    require(full.is_file() and not full.is_symlink(), 'Not a plain file: ' + name)
    current = full.parent
    while current != ROOT:
        require(not current.is_symlink(), 'Symlink parent: ' + name)
        current = current.parent
    return full

def digest(name):
    return hashlib.sha256(safe_file(name).read_bytes()).hexdigest()

def check_sums(manifest_name, prefix=''):
    names = set()
    for line in safe_file(manifest_name).read_text().splitlines():
        require(bool(re.fullmatch(r'[0-9a-f]{64}  .+', line)), 'Malformed checksum line')
        expected, name = line.split('  ', 1)
        require(name not in names, 'Duplicate checksum: ' + name)
        require(digest(prefix + name) == expected, 'Checksum mismatch: ' + prefix + name)
        names.add(name)
    return names

def main():
    manifest = json.loads(safe_file('MANIFEST.json').read_text())
    rows = manifest['payload_files']
    require(len(rows) == manifest['payload_count'] == len(NAMES), 'Payload count mismatch')
    require({row['path'] for row in rows} == {'src/' + n for n in NAMES}, 'Payload allowlist mismatch')
    require(sum(row['bytes'] for row in rows) == manifest['payload_bytes'], 'Payload bytes mismatch')
    for row in rows:
        require(safe_file(row['path']).stat().st_size == row['bytes'], 'Byte length mismatch')
        require(digest(row['path']) == row['sha256'], 'Manifest hash mismatch: ' + row['path'])
        require(row['source_identical'] is True, 'Source preservation label missing')
    originals = check_sums('src/SHA256SUMS', 'src/')
    require(originals == set(NAMES) - {'SHA256SUMS'}, 'Original manifest coverage mismatch')
    require(originals == set(manifest['original_final_payload_files']), 'Original file list mismatch')
    covered = check_sums('SHA256SUMS')
    all_nodes = list(ROOT.rglob('*'))
    require(not any(p.is_symlink() for p in all_nodes), 'Package contains symlink')
    actual = {str(p.relative_to(ROOT)) for p in all_nodes if p.is_file()}
    expected = {'src/' + n for n in NAMES} | {'README.md', 'MANIFEST.json', 'verify_checkpoint.py', 'SHA256SUMS'}
    require(actual == expected, 'Exact package coverage mismatch')
    require(covered == expected - {'SHA256SUMS'}, 'Outer manifest coverage mismatch')
    require(manifest['redactions'] == [], 'Unexpected redactions')
    require(REQUIRED_SCOPE in manifest['scope'], 'Required limitation missing from manifest')
    require(REQUIRED_SCOPE in safe_file('README.md').read_text(), 'Required limitation missing from README')
    print(json.dumps({'status': 'PASS', 'payload_files': len(rows),
                      'payload_bytes': manifest['payload_bytes'], 'package_files': len(actual),
                      'original_checksum_entries': len(originals),
                      'mathematical_proof_verification': 'not performed'}, sort_keys=True))

if __name__ == '__main__':
    main()
