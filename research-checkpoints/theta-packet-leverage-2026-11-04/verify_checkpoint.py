#!/usr/bin/env python3
"""Verify exact preservation and the finite integer certificate, not theorems."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parent

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    manifest = json.loads((ROOT / 'MANIFEST.json').read_text())
    rows = manifest['payload_files']
    source_files = {str(p.relative_to(ROOT)) for p in (ROOT / 'src').rglob('*') if p.is_file()}
    assert source_files == {r['path'] for r in rows}
    assert len(rows) == manifest['payload_count'] == 7
    assert sum(r['bytes'] for r in rows) == manifest['payload_bytes']
    for row in rows:
        path = ROOT / row['path']
        assert not path.is_symlink()
        assert path.stat().st_size == row['bytes'] and digest(path) == row['sha256'], row['path']
    originals = set()
    for line in (ROOT / 'src/SHA256SUMS').read_text().splitlines():
        expected, name = line.split('  ', 1)
        assert digest(ROOT / 'src' / name) == expected, name
        originals.add(name)
    assert originals == set(manifest['original_final_payload_files']) and len(originals) == 5
    assert not any(name.startswith('DRAFT_') for name in originals)
    assert manifest['archival_files'] == ['src/DRAFT_EXPONENTIAL_PACKET_LEVERAGE.md']
    covered = set()
    for line in (ROOT / 'SHA256SUMS').read_text().splitlines():
        expected, name = line.split('  ', 1)
        assert digest(ROOT / name) == expected, name
        assert name not in covered
        covered.add(name)
    actual = {str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
    assert covered == actual - {'SHA256SUMS'}
    certificate = 4 * 12229**2 * 13 - 9 * 29160**2
    assert certificate == 123768532 and certificate > 0
    assert 'not a disproof' in manifest['scope'] and 'Cancellation-sensitive' in manifest['scope']
    print(json.dumps({'status': 'PASS', 'payload_files': len(rows), 'payload_bytes': manifest['payload_bytes'], 'package_files': len(actual), 'original_final_checksum_entries': len(originals), 'archival_drafts': 1, 'exact_integer_certificate': certificate, 'mathematical_proof_verification': 'not performed'}, sort_keys=True))

if __name__ == '__main__':
    main()
